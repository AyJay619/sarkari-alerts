// Runs continuously on your PC. Waits for a tap on "📥 Send to agents" under an alert, then saves the notice
// (PDF + a small .json) into the inbox folder. Uses Telegram long polling (getUpdates): nothing else in this
// project uses getUpdates or a webhook, so there is no conflict. Start it with:  node --env-file=.env src/listener.mjs
import fs from "node:fs";
import path from "node:path";
import { apiBase, DONE_BUTTON } from "./telegram.mjs";
import { getBuffer } from "./fetchers.mjs";
import { allowedHosts, baseName, hostAllowed, Inbox, parseAlert, sourceForHost } from "./inbox.mjs";

const token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
if (!token || !chatId) { console.error("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be in the .env file."); process.exit(1); }

const root = new URL("..", import.meta.url);
const SOURCES_FILE = new URL("sources.json", root);
const readSources = () => JSON.parse(fs.readFileSync(SOURCES_FILE, "utf8"));
const config = JSON.parse(fs.readFileSync(new URL("config.json", root), "utf8"));

// ---- inbox location (config.json "inboxDir", or INBOX_DIR in .env). Never inside OneDrive. ----
const inboxDir = path.resolve(process.env.INBOX_DIR || config.inboxDir || "C:\\Dev\\sarkari-inbox");
const oneDriveRoots = [process.env.OneDrive, process.env.OneDriveConsumer, process.env.OneDriveCommercial].filter(Boolean).map(p => path.resolve(p).toLowerCase());
if (/onedrive/i.test(inboxDir) || oneDriveRoots.some(r => inboxDir.toLowerCase().startsWith(r))) {
  console.error(`The inbox folder (${inboxDir}) is inside OneDrive. Choose another folder in config.json ("inboxDir").`);
  process.exit(1);
}
const inbox = new Inbox(inboxDir);
const logDir = path.join(inboxDir, "logs");
fs.mkdirSync(logDir, { recursive: true });
const LOG = path.join(logDir, "listener.log"), HEARTBEAT = path.join(logDir, "listener-heartbeat.json");
const OFFSET = path.join(logDir, "listener-offset.json"), PIDFILE = path.join(logDir, "listener.pid");

const secretless = s => String(s).split(token).join("***");
function log(msg) {
  const line = `${new Date().toISOString()} ${secretless(msg)}`;
  console.log(line);
  try {
    if (fs.existsSync(LOG) && fs.statSync(LOG).size > 2_000_000) fs.renameSync(LOG, LOG + ".old");
    fs.appendFileSync(LOG, line + "\n");
  } catch { /* logging must never stop the listener */ }
}

// ---- only one listener at a time (two would fight over getUpdates) ----
if (fs.existsSync(PIDFILE)) {
  const other = Number(fs.readFileSync(PIDFILE, "utf8"));
  let alive = false;
  try { process.kill(other, 0); alive = other !== process.pid; } catch { /* not running */ }
  if (alive) { console.log(`Listener already running (pid ${other}).`); process.exit(3); }
}
fs.writeFileSync(PIDFILE, String(process.pid));
const cleanup = () => { try { if (fs.readFileSync(PIDFILE, "utf8") === String(process.pid)) fs.unlinkSync(PIDFILE); } catch { /* */ } };
process.on("exit", cleanup);
for (const sig of ["SIGINT", "SIGTERM", "SIGBREAK"]) process.on(sig, () => process.exit(0));

// ---- Telegram calls ----
async function tg(method, body, timeoutMs = 20000) {
  const res = await fetch(`${apiBase()}/bot${token}/${method}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(timeoutMs),
  });
  const json = await res.json().catch(() => ({}));
  if (!json.ok) throw Object.assign(new Error(`${method}: ${json.description ?? res.status}`), { code: json.error_code ?? res.status });
  return json.result;
}
const quietly = async p => { try { return await p; } catch (e) { log(`  (Telegram: ${e.message})`); } };
const reply = (msg, text) => quietly(tg("sendMessage", { chat_id: msg.chat.id, text, reply_to_message_id: msg.message_id, disable_web_page_preview: true }));
const markDone = msg => quietly(tg("editMessageReplyMarkup", { chat_id: msg.chat.id, message_id: msg.message_id, reply_markup: DONE_BUTTON }));

// ---- one button press ----
async function handleTap(cb) {
  const msg = cb.message;
  // SECURITY: only my own chat. Anyone else is ignored silently (no answer, no reply).
  if (String(cb.from?.id) !== String(chatId) || String(msg?.chat?.id) !== String(chatId)) {
    log(`Ignored a button press from someone else (user ${cb.from?.id}).`);
    return;
  }
  if (cb.data === "done") { await quietly(tg("answerCallbackQuery", { callback_query_id: cb.id, text: "Already sent ✅" })); return; }
  if (cb.data !== "send") return;
  await quietly(tg("answerCallbackQuery", { callback_query_id: cb.id, text: "⏳ Saving…" }));

  const alert = parseAlert(msg.text);
  if (!alert) { log("Could not read the alert message."); await reply(msg, "❌ Download failed: I could not read the link from this message."); return; }
  log(`Tap: [${alert.source}] ${alert.title.slice(0, 80)} -> ${alert.link}`);

  const sources = readSources(), hosts = allowedHosts(sources);
  const refuse = url => {
    const host = new URL(url).hostname;
    if (!/^https?:$/.test(new URL(url).protocol) || !hostAllowed(host, hosts)) {
      throw Object.assign(new Error(`${host} is not one of the sites in sources.json`), { refused: true });
    }
  };

  try {
    refuse(alert.link);
    const known = inbox.findExisting(alert.link);
    if (known) { log(`Already in inbox: ${known}`); await reply(msg, `ℹ️ Already in inbox: ${known}`); await markDone(msg); return; }

    const { buf, finalUrl, contentType } = await getBuffer(alert.link, {
      allow: refuse,
      optsFor: url => {
        const s = sourceForHost(new URL(url).hostname, sources);
        return { extraCerts: s?.extraCerts, timeoutMs: s?.timeoutMs };
      },
    });
    const isPdf = buf.subarray(0, 1024).includes("%PDF");
    const same = isPdf ? inbox.findExisting(alert.link, Inbox.sha(buf)) : undefined;
    if (same) { log(`Same PDF already in inbox: ${same}`); await reply(msg, `ℹ️ Already in inbox: ${same}`); await markDone(msg); return; }

    const when = new Date((msg.date ?? Date.now() / 1000) * 1000);
    const name = inbox.save(baseName(when, alert.source, alert.title), isPdf ? buf : null, {
      source: alert.source, title: alert.title, category: alert.category, link: alert.link,
      alertDate: when.toISOString(), flag: alert.flag, ...(alert.test ? { test: true } : {}),
      ...(finalUrl !== alert.link ? { finalUrl } : {}), contentType,
    });
    log(`Saved: ${name}${isPdf ? "" : " (link only)"}`);
    await reply(msg, isPdf ? `✅ Saved to inbox: ${name}` : `✅ Saved to inbox: ${name}\n(link only — no PDF)`);
    await markDone(msg);
  } catch (e) {
    if (e.refused) {
      log(`REFUSED: ${e.message}`);
      await reply(msg, `🚫 Refused: ${e.message}. Nothing was downloaded.`);
    } else {
      log(`Download failed: ${e.message}`);
      await reply(msg, `❌ Download failed: ${e.message.split(" | ")[0].replace(/^\w*Error: /, "")}\nThe button is still there, so you can tap again to retry.`);
    }
  }
}

// ---- main loop ----
const sleep = ms => new Promise(r => setTimeout(r, ms));
let offset = fs.existsSync(OFFSET) ? JSON.parse(fs.readFileSync(OFFSET, "utf8")).offset : 0;

try {
  const me = await tg("getMe", {});
  log(`Listener started as @${me.username}. Inbox: ${inboxDir}`);
} catch (e) {
  log(`Could not reach Telegram: ${e.message}`);
  process.exit(e.code === 401 ? 1 : 2);   // the launcher tries again after a pause
}

while (true) {
  try {
    const updates = await tg("getUpdates", { offset, timeout: 30, allowed_updates: ["callback_query"] }, 45000);
    fs.writeFileSync(HEARTBEAT, JSON.stringify({ time: new Date().toISOString(), pid: process.pid }));
    for (const u of updates) {
      offset = u.update_id + 1;
      if (u.callback_query) {
        try { await handleTap(u.callback_query); } catch (e) { log(`Unexpected error: ${e.stack ?? e.message}`); }
      }
      fs.writeFileSync(OFFSET, JSON.stringify({ offset }));
    }
  } catch (e) {
    if (e.code === 409) { log("Telegram says another getUpdates/webhook is active for this bot. Retrying in 30s."); await sleep(30000); }
    else if (e.code === 401) { log("Telegram rejected the bot token. Check .env."); process.exit(1); }
    else { log(`Polling problem: ${e.message}`); await sleep(5000); }
  }
}
