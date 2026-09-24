const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const ICONS = { "Job": "💼", "Admit Card": "🎫", "Result": "📊", "Answer Key": "🔑", "Correction": "✏️", "Other": "📌" };

export function formatItem(sourceName, category, title, link) {
  const shown = title.length > 400 ? title.slice(0, 397) + "…" : title;
  return `${ICONS[category] || "📌"} <b>${esc(category)}</b> · ${esc(sourceName)}\n\n${esc(shown)}\n\n🔗 ${esc(link)}`;
}

// One notice posted on several sites: "RRB CEN 03/2026: Exam Schedule — 21 regions".
export function formatGroup(groupName, category, groupTitle, regions, totalRegions, link) {
  const where = regions.length === 1 ? `${regions[0]} only`
    : regions.length === totalRegions ? `${regions.length} regions`
    : `${regions.join(", ")} (${regions.length} of ${totalRegions} regions)`;
  const first = regions.length > 1 ? ` (${regions[0]} copy)` : "";
  return `${ICONS[category] || "📌"} <b>${esc(category)}</b> · ${esc(groupName)}

${esc(groupTitle)} — ${esc(where)}

🔗 ${esc(link)}${esc(first)}`;
}

export function makeSender({ token, chatId, dryRun }) {
  return async function send(html) {
    if (dryRun) { console.log("\n┌── Telegram message (dry run) ──\n" + html.replace(/<\/?b>/g, "*").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").split("\n").map(l => "│ " + l).join("\n") + "\n└──"); return true; }
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: "HTML", disable_web_page_preview: true }),
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
