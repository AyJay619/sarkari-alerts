// Tests the listener against a FAKE Telegram server (nothing real is sent) and real downloads from the allowed sites.
// Run:  node test/listener.test.mjs
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { formatItem, formatGroup } from "../src/telegram.mjs";
import { fetchItems } from "../src/fetchers.mjs";
import { allowedHosts, hostAllowed, parseAlert } from "../src/inbox.mjs";

const sources = JSON.parse(fs.readFileSync(new URL("../sources.json", import.meta.url), "utf8"));
const CHAT = "42", PORT = 8811;
const inboxDir = fs.mkdtempSync(path.join(os.tmpdir(), "inbox-test-"));
let assertions = 0, failures = 0;
const check = (name, ok, extra = "") => { assertions++; if (!ok) failures++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

// ---- pure checks ----
const hosts = allowedHosts(sources);
check("allowed: ssc.gov.in", hostAllowed("ssc.gov.in", hosts));
check("allowed: www.ssc.gov.in", hostAllowed("www.ssc.gov.in", hosts));
check("refused: evil.example.com", !hostAllowed("evil.example.com", hosts));
check("refused: ssc.gov.in.evil.com", !hostAllowed("ssc.gov.in.evil.com", hosts));
check("refused: evilssc.gov.in", !hostAllowed("evilssc.gov.in", hosts));
check("allowed: Coal India's file host (allowedHosts)", hostAllowed("d3u7ubx0okog7j.cloudfront.net", hosts));

// The alert text as Telegram hands it back with the button press (HTML tags removed).
const plain = html => html.replace(/<\/?b>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const alertText = html => "🧪 TEST\n" + plain(html);
const sscItem = (await fetchItems({ ...sources.find(s => s.id === "ssc"), limit: 3 }))[0];
const parsed = parseAlert(alertText(formatItem("SSC", "Job", sscItem.title, sscItem.link)));
check("reads source/category/title/link from an alert", parsed?.source === "SSC" && parsed.category === "Job" && parsed.title === sscItem.title && parsed.link === sscItem.link);
const grouped = parseAlert(alertText(formatGroup("RRB", "Other", "RRB CEN 03/2026: Exam Schedule", ["Patna", "Ranchi"], 21, "https://rrb.indianrailways.gov.in/getdata?cennum=03/2026&loc=patna&category=Exam%20Schedule")));
check("reads a grouped RRB alert", grouped?.source === "RRB" && grouped.link.includes("loc=patna") && grouped.title.includes("Exam Schedule"));
const unchecked = parseAlert(alertText(formatItem("ISRO", "Other", "Some notice", "https://www.isro.gov.in/x.pdf", "unchecked")));
check("reads an ❓ unchecked alert", unchecked?.flag === "unchecked" && unchecked.title === "Some notice");

// ---- fake Telegram ----
const queue = [], calls = [];
let nextId = 1;
const server = http.createServer((req, res) => {
  let body = ""; req.on("data", c => (body += c));
  req.on("end", async () => {
    const method = req.url.split("/").pop(), data = body ? JSON.parse(body) : {};
    res.setHeader("content-type", "application/json");
    if (method === "getMe") return res.end(JSON.stringify({ ok: true, result: { username: "fake_bot" } }));
    if (method === "getUpdates") {
      if (!queue.length) await new Promise(r => setTimeout(r, 250));
      return res.end(JSON.stringify({ ok: true, result: queue.splice(0) }));
    }
    calls.push({ method, ...data });
    res.end(JSON.stringify({ ok: true, result: true }));
  });
}).listen(PORT);

const cbq = (msgId, text, { from = CHAT, data = "send" } = {}) => ({
  update_id: nextId++,
  callback_query: { id: "cb" + nextId, from: { id: Number(from) }, data, message: { message_id: msgId, date: Math.floor(Date.now() / 1000), chat: { id: Number(CHAT) }, text } },
});

const listener = spawn(process.execPath, ["src/listener.mjs"], {
  cwd: new URL("..", import.meta.url), stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, TELEGRAM_BOT_TOKEN: "123:TESTTOKEN", TELEGRAM_CHAT_ID: CHAT, TELEGRAM_API_BASE: `http://localhost:${PORT}`, INBOX_DIR: inboxDir },
});
let out = ""; listener.stdout.on("data", d => (out += d)); listener.stderr.on("data", d => (out += d));
const wait = async (cond, ms = 60000) => { const t = Date.now(); while (!cond() && Date.now() - t < ms) await new Promise(r => setTimeout(r, 200)); return cond(); };
const said = re => calls.some(c => c.method === "sendMessage" && re.test(c.text));

await wait(() => out.includes("Listener started"), 10000);
check("listener starts and talks to (fake) Telegram", out.includes("Listener started as @fake_bot"));

// 1) a valid tap, and 2) the same button tapped again straight away (double tap)
const sscText = alertText(formatItem("SSC", "Job", sscItem.title, sscItem.link));
queue.push(cbq(101, sscText), cbq(101, sscText));
await wait(() => calls.filter(c => c.method === "sendMessage").length >= 2);
const pending = () => fs.readdirSync(path.join(inboxDir, "pending"));
check("PDF and .json appear in the inbox", pending().some(f => f.endsWith(".pdf")) && pending().some(f => f.endsWith(".json")), pending().join(", "));
check("reply says ✅ Saved to inbox", said(/✅ Saved to inbox: \d{4}-\d\d-\d\d_SSC_/));
check("double tap: 'Already in inbox' and only one PDF", said(/Already in inbox/) && pending().filter(f => f.endsWith(".pdf")).length === 1);
check("button was changed to ✅ Sent to agents", calls.some(c => c.method === "editMessageReplyMarkup" && c.reply_markup.inline_keyboard[0][0].text === "✅ Sent to agents"));
const meta = JSON.parse(fs.readFileSync(path.join(inboxDir, "pending", pending().find(f => f.endsWith(".json"))), "utf8"));
check(".json has source/title/category/link/alert date", meta.source === "SSC" && meta.title === sscItem.title && meta.category === "Job" && meta.link === sscItem.link && !!meta.alertDate && meta.pdfFile?.endsWith(".pdf"));

// 3) a site that is not in sources.json
const before = calls.length;
queue.push(cbq(102, alertText(formatItem("SSC", "Job", "Definitely a normal notice", "https://evil.example.com/notice.pdf"))));
await wait(() => said(/Refused/));
check("non-allowed domain refused, and I am told", said(/🚫 Refused: evil\.example\.com/));
check("nothing downloaded for it", pending().filter(f => f.endsWith(".pdf")).length === 1);

// 4) someone else taps: ignored silently
const n = calls.length;
queue.push(cbq(103, sscText, { from: "999" }));
await new Promise(r => setTimeout(r, 1500));
check("a stranger's tap is ignored silently (no answer, no reply)", calls.length === n);

// 5) tapping the already-done button
queue.push(cbq(101, sscText, { data: "done" }));
await wait(() => calls.some(c => c.method === "answerCallbackQuery" && /Already sent/.test(c.text ?? "")));
check("tapping ✅ Sent to agents just says 'Already sent'", calls.some(c => c.method === "answerCallbackQuery" && /Already sent/.test(c.text ?? "")));

// 6) a link that is a web page, not a PDF (RRB): link only
queue.push(cbq(104, alertText(formatGroup("RRB", "Other", "RRB CEN 03/2026: Exam Schedule", ["Patna"], 21, "https://rrb.indianrailways.gov.in/getdata?cennum=03/2026&loc=patna&category=Exam%20Schedule"))));
await wait(() => said(/link only/) || said(/Download failed/));
check("web-page link: only .json saved, reply says 'link only — no PDF'", said(/link only — no PDF/) && pending().some(f => /_RRB_.*\.json$/.test(f)) && !pending().some(f => /_RRB_.*\.pdf$/.test(f)));

// 7) allowed site but the file does not exist: failure, button stays
const editsBefore = calls.filter(c => c.method === "editMessageReplyMarkup").length;
queue.push(cbq(105, alertText(formatItem("SSC", "Job", "A file that is gone", "https://ssc.gov.in/api/attachment/uploads/does-not-exist-12345.pdf"))));
await wait(() => said(/Download failed/));
check("failed download: '❌ Download failed: …'", said(/❌ Download failed: .*404/), calls.filter(c => /Download failed/.test(c.text ?? "")).map(c => c.text.split("\n")[0]).join(" | "));
check("failed download: button left in place for a retry", calls.filter(c => c.method === "editMessageReplyMarkup").length === editsBefore);

listener.kill();
server.close();
console.log(`\nInbox files (${inboxDir}\\pending):`);
for (const f of pending()) console.log("  " + f);
console.log(`\nListener log:\n${out.split("\n").filter(Boolean).map(l => "  " + l).join("\n")}`);
console.log(`\n${assertions - failures}/${assertions} checks passed`);
fs.rmSync(inboxDir, { recursive: true, force: true });
process.exit(failures ? 1 : 0);
