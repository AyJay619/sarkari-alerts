// Telegram's address. TELEGRAM_API_BASE lets tests point at a fake server.
export const apiBase = () => process.env.TELEGRAM_API_BASE || "https://api.telegram.org";

// The button under every alert. It carries no link: the listener (src/listener.mjs) reads the link, title, source and
// category from the alert message itself, so it also works for alerts sent from GitHub's servers.
export const SEND_BUTTON = { inline_keyboard: [[{ text: "📥 Send to agents", callback_data: "send" }]] };
export const DONE_BUTTON = { inline_keyboard: [[{ text: "✅ Sent to agents", callback_data: "done" }]] };

export const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const ICONS = { "Job": "💼", "Admit Card": "🎫", "Result": "📊", "Answer Key": "🔑", "Correction": "✏️", "Other": "📌" };

// flag: null | "unchecked" (the AI could not check it) | "capped" (this run already used its AI calls) | "limit" (daily AI limit reached,
// so a Job/Correction has no dates) | "scanned" (PDF is a scan, judged by title only)
const FLAGS = { unchecked: "❓ unchecked", capped: "🤖 AI skipped: cap reached", limit: "🤖 dates not checked (limit)", scanned: "📷 scanned" };
// extra (optional): { body: [lines under the title: post, vacancies, dates, verdict], skip: editorial rule name | null }
const flagLine = (flag, extra) => (FLAGS[flag] ? "\n" + FLAGS[flag] : "") + (extra?.skip ? "\n🙈 AI says skip: " + esc(cap(String(extra.skip), 200)) : "");
// (a notice is always ONE message: its title and body lines are capped, so it stays far below Telegram's 4096 limit)
const cap = (t, n) => (t.length > n ? t.slice(0, n - 1) + "…" : t);
const bodyBlock = extra => (extra?.body?.length ? "\n\n" + extra.body.slice(0, 8).map(l => esc(cap(String(l), 250))).join("\n") : "");

// First-line tag: "🏛️ Central · " or "🗺️ State · " (parseAlert in inbox.mjs skips it)
const tag = level => (level === "state" ? "🗺️ State · " : "🏛️ Central · ");

export function formatItem(sourceName, category, title, link, flag = null, level = "central", extra = null) {
  const shown = title.length > 400 ? title.slice(0, 397) + "…" : title;
  return `${tag(level)}${ICONS[category] || "📌"} <b>${esc(category)}</b> · ${esc(sourceName)}${flagLine(flag, extra)}

${esc(shown)}${bodyBlock(extra)}

🔗 ${esc(link)}`;
}

// One notice posted on several sites: "RRB CEN 03/2026: Exam Schedule — 21 regions".
export function formatGroup(groupName, category, groupTitle, regions, totalRegions, link, flag = null, level = "central", extra = null) {
  const where = regions.length === 1 ? `${regions[0]} only`
    : regions.length === totalRegions ? `${regions.length} regions`
    : `${regions.join(", ")} (${regions.length} of ${totalRegions} regions)`;
  const first = regions.length > 1 ? ` (${regions[0]} copy)` : "";
  return `${tag(level)}${ICONS[category] || "📌"} <b>${esc(category)}</b> · ${esc(groupName)}${flagLine(flag, extra)}

${esc(cap(groupTitle, 400))} — ${esc(cap(where, 400))}${bodyBlock(extra)}

🔗 ${esc(link)}${esc(first)}`;
}

// Telegram refuses messages over 4096 characters. Long ones (the "now watching" summary, big category lists) are cut into several
// messages of at most `limit` characters, always at a line break (a single over-long line is cut hard). HTML tags that are open
// at a cut (<b>, <i>, <a href>, ...) are closed there and re-opened in the next part, so every part is valid HTML.
export const TELEGRAM_SAFE_LIMIT = 3500;   // well under 4096: room for the re-opened tags
export function splitMessage(html, limit = TELEGRAM_SAFE_LIMIT) {
  if (html.length <= limit) return [html];
  const lines = [];
  for (const line of html.split("\n")) {
    if (line.length <= limit) { lines.push(line); continue; }
    for (let i = 0; i < line.length; i += limit - 200) lines.push(line.slice(i, i + limit - 200));   // rare: one giant line
  }
  const open = [];   // tags still open at this point: { name, tag }
  const track = text => {
    for (const m of text.matchAll(/<(\/?)([a-z]+)[^>]*>/gi)) {
      const name = m[2].toLowerCase();
      if (m[1]) { const i = open.map(o => o.name).lastIndexOf(name); if (i >= 0) open.splice(i, 1); }
      else open.push({ name, tag: m[0] });
    }
  };
  const parts = []; let cur = [], len = 0, prefix = "";
  const flush = () => {
    parts.push(cur.join("\n") + [...open].reverse().map(o => "</" + o.name + ">").join(""));
    prefix = open.map(o => o.tag).join(""); cur = []; len = prefix.length;
  };
  for (const line of lines) {
    if (cur.length && len + line.length + 1 > limit) flush();
    cur.push(cur.length ? line : prefix + line); len += line.length + 1; track(line);
  }
  if (cur.length) parts.push(cur.join("\n"));
  return parts.filter(p => p.trim());
}

const stripTags = h => h.replace(/<[^>]*>/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

export function makeSender({ token, chatId, dryRun }) {
  // withButton: true for alerts (notices); false for summaries and warnings.
  // send() never throws: any unexpected problem is logged and reported as "not delivered" (false), so state is still saved.
  return async function send(html, withButton = false) {
    try { return await sendParts(html, withButton); }
    catch (e) { console.error("Telegram send error: " + String(e?.message ?? e).replace(token ?? "", "***")); return false; }
  };
  async function sendParts(html, withButton) {
    const parts = splitMessage(html);
    if (parts.length > 1) {   // several messages; the button (if any) goes under the last one; ok only if every part was delivered
      let all = true;
      for (let i = 0; i < parts.length; i++) all = (await sendOne(parts[i], withButton && i === parts.length - 1)) && all;
      return all;
    }
    return sendOne(html, withButton);
  }
  async function sendOne(html, withButton, plain = false) {
    if (dryRun) { console.log("\n┌── Telegram message (dry run) ──\n" + html.replace(/<\/?b>/g, "*").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").split("\n").map(l => "│ " + l).join("\n") + "\n└──"); return true; }
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(`${apiBase()}/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: plain ? stripTags(html) : html, ...(plain ? {} : { parse_mode: "HTML" }), disable_web_page_preview: true, ...(withButton ? { reply_markup: SEND_BUTTON } : {}) }),
          signal: AbortSignal.timeout(20000),
        });
        const body = await res.json().catch(() => ({}));
        if (res.ok) { await new Promise(r => setTimeout(r, 1100)); return true; }
        if (res.status === 429) { await new Promise(r => setTimeout(r, (body.parameters?.retry_after ?? 5) * 1000 + 500)); continue; }
        // Never print the token: only Telegram's own description
        console.error(`Telegram error ${res.status}: ${body.description ?? "unknown"}`);
        // A message Telegram cannot parse as HTML would otherwise fail on every run: send it once more as plain text.
        if (res.status === 400 && !plain && /parse entities|unsupported start tag/i.test(body.description ?? "")) return sendOne(html, withButton, true);
        return false;
      } catch (e) {
        console.error(`Telegram request failed (attempt ${attempt}): ${e.message.replace(token, "***")}`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    return false;
  }
}
