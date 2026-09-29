// Notices skipped by an editorial rule are NOT alerted. They are remembered per day (in the state file) for one digest message.
// Pure functions (no I/O) so the tests can drive them with fixed clocks.
import { esc } from "./telegram.mjs";

export const DIGEST_FROM_MINUTES = 20 * 60 + 30;   // the digest is due from 8:30 pm Indian time
const MAX_ITEMS_PER_DAY = 500;

// Indian date (YYYY-MM-DD) and minutes since midnight there
export const istDate = (nowMs = Date.now()) => new Date(nowMs + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
export const istMinutes = (nowMs = Date.now()) => { const d = new Date(nowMs + 5.5 * 3600 * 1000); return d.getUTCHours() * 60 + d.getUTCMinutes(); };

// items: [{ source, title, rule, link, by }] skipped in this run. Adds them to today's list in state.skippedDays.
export function recordSkips(state, items, nowMs = Date.now()) {
  const days = (state.skippedDays ??= []);
  const today = istDate(nowMs);
  if (items.length) {
    let day = days.find(d => d.date === today);
    if (!day) days.push(day = { date: today, items: [], sentCount: 0 });
    for (const it of items) if (day.items.length < MAX_ITEMS_PER_DAY) day.items.push(it);
  }
  // forget days that are fully sent and more than 3 days old
  state.skippedDays = days.filter(d => d.items.length > d.sentCount || d.date >= istDate(nowMs - 3 * 86400000));
  return state.skippedDays;
}

// The days that owe a digest now: a past day never sent (the PC was off in the evening), or today once it is 8:30 pm or later.
// Each has NEW items (after sentCount) to list. Returns [{ day, date, items }].
export function digestsDue(state, nowMs = Date.now()) {
  const today = istDate(nowMs), late = istMinutes(nowMs) >= DIGEST_FROM_MINUTES;
  return (state.skippedDays ?? [])
    .filter(d => d.items.length > d.sentCount && (d.date < today || (d.date === today && late)))
    .map(d => ({ day: d, date: d.date, items: d.items.slice(d.sentCount) }));
}
export const markDigestSent = due => { due.day.sentCount = due.day.items.length; };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const niceDate = d => `${+d.slice(8, 10)} ${MONTHS[+d.slice(5, 7) - 1]} ${d.slice(0, 4)}`;

// One message (the sender splits it if it is long): source, title, rule, link.
export function digestHtml({ date, items }) {
  const head = `🙈 <b>Skipped by rules — ${niceDate(date)}: ${items.length}</b>\nNot alerted. Rule names are the ones in editorial-rules.md.`;
  const body = items.map(i => `• <b>${esc(i.source)}</b> · ${esc(i.rule)}${i.by === "title" ? " (from the title)" : ""}\n${esc(String(i.title).slice(0, 220))}\n🔗 ${esc(i.link)}`);
  return head + "\n\n" + body.join("\n\n");
}
