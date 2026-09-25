// Telegram's address. TELEGRAM_API_BASE lets tests point at a fake server.
export const apiBase = () => process.env.TELEGRAM_API_BASE || "https://api.telegram.org";

// The button under every alert. It carries no link: the listener (src/listener.mjs) reads the link, title, source and
// category from the alert message itself, so it also works for alerts sent from GitHub's servers.
export const SEND_BUTTON = { inline_keyboard: [[{ text: "📥 Send to agents", callback_data: "send" }]] };
export const DONE_BUTTON = { inline_keyboard: [[{ text: "✅ Sent to agents", callback_data: "done" }]] };

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const ICONS = { "Job": "💼", "Admit Card": "🎫", "Result": "📊", "Answer Key": "🔑", "Correction": "✏️", "Other": "📌" };

// flag: null | "unchecked" (the AI could not check it) | "capped" (this run already used its AI calls) | "scanned" (PDF is a scan, judged by title only)
const FLAGS = { unchecked: "❓ unchecked", capped: "🤖 AI skipped: cap reached", scanned: "📷 scanned" };
const flagLine = flag => (FLAGS[flag] ? "\n" + FLAGS[flag] : "");

export function formatItem(sourceName, category, title, link, flag = null) {
  const shown = title.length > 400 ? title.slice(0, 397) + "…" : title;
  return `${ICONS[category] || "📌"} <b>${esc(category)}</b> · ${esc(sourceName)}${flagLine(flag)}

${esc(shown)}

🔗 ${esc(link)}`;
}

// One notice posted on several sites: "RRB CEN 03/2026: Exam Schedule — 21 regions".
export function formatGroup(groupName, category, groupTitle, regions, totalRegions, link, flag = null) {
  const where = regions.length === 1 ? `${regions[0]} only`
    : regions.length === totalRegions ? `${regions.length} regions`
    : `${regions.join(", ")} (${regions.length} of ${totalRegions} regions)`;
  const first = regions.length > 1 ? ` (${regions[0]} copy)` : "";
  return `${ICONS[category] || "📌"} <b>${esc(category)}</b> · ${esc(groupName)}${flagLine(flag)}

${esc(groupTitle)} — ${esc(where)}

🔗 ${esc(link)}${esc(first)}`;
}

export function makeSender({ token, chatId, dryRun }) {
  // withButton: true for alerts (notices); false for summaries and warnings.
  return async function send(html, withButton = false) {
    if (dryRun) { console.log("\n┌── Telegram message (dry run) ──\n" + html.replace(/<\/?b>/g, "*").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").split("\n").map(l => "│ " + l).join("\n") + "\n└──"); return true; }
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(`${apiBase()}/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: "HTML", disable_web_page_preview: true, ...(withButton ? { reply_markup: SEND_BUTTON } : {}) }),
          signal: AbortSignal.timeout(20000),
        });
        const body = await res.json().catch(() => ({}));
        if (res.ok) { await new Promise(r => setTimeout(r, 1100)); return true; }
        if (res.status === 429) { await new Promise(r => setTimeout(r, (body.parameters?.retry_after ?? 5) * 1000 + 500)); continue; }
        // Never print the token: only Telegram's own description
        console.error(`Telegram error ${res.status}: ${body.description ?? "unknown"}`);
        return false;
      } catch (e) {
        console.error(`Telegram request failed (attempt ${attempt}): ${e.message.replace(token, "***")}`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    return false;
  };
}
