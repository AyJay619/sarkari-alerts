// The missed-run warning. Pure functions (no I/O).
// The monitor is scheduled 5 times a day: about 9:30 am, 12:30 pm, 3:30 pm, 6:30 pm and 9:30 pm IST (the cron fires at :25, 5 minutes
// early, because GitHub is usually a few minutes late). When a run starts, one short note is sent if
//   - it starts between 9 am and 10 pm IST, and
//   - more than 4 hours have passed since the last successful run, and
//   - at least one of the scheduled times in between has clearly passed without a run (so the normal long gap of the NIGHT,
//     between the 9:30 pm run and the 9:30 am run, never warns).
import { istMinutes } from "./skipped.mjs";

export const WINDOW_START_MIN = 9 * 60, WINDOW_END_MIN = 22 * 60;   // 9:00 am - 10:00 pm IST
export const MISSED_AFTER_HOURS = 4;
export const SLOT_MINUTES = [9 * 60 + 25, 12 * 60 + 25, 15 * 60 + 25, 18 * 60 + 25, 21 * 60 + 25];   // when the cron fires (IST)
export const SLOT_GRACE_MIN = 45;   // a slot only counts as missed once this many minutes have passed since it
const DAY = 86400000, IST = 5.5 * 3600 * 1000;

// The scheduled times (UTC ms) that fell after `fromMs` and are at least SLOT_GRACE_MIN minutes before `toMs`.
export function slotsBetween(fromMs, toMs) {
  const out = [];
  for (let dayStart = Math.floor((fromMs + IST) / DAY) * DAY - IST; dayStart < toMs; dayStart += DAY)   // midnight IST of each day, in UTC ms
    for (const m of SLOT_MINUTES) { const t = dayStart + m * 60000; if (t > fromMs && t <= toMs - SLOT_GRACE_MIN * 60000) out.push(t); }
  return out;
}

// "3:30 pm" (and " on 29 Sep" when it was not today), in Indian time
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function fmtIstTime(ms, nowMs) {
  const d = new Date(ms + IST), h = d.getUTCHours(), mm = String(d.getUTCMinutes()).padStart(2, "0");
  const t = `${h % 12 === 0 ? 12 : h % 12}:${mm} ${h < 12 ? "am" : "pm"}`;
  const sameDay = Math.floor((ms + IST) / DAY) === Math.floor((nowMs + IST) / DAY);
  return sameDay ? t : `${t} on ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

// state.lastRunAt: ISO time the last successful run finished. Returns the message to send, or null.
export function missedRunNote(state, nowMs = Date.now()) {
  const last = state.lastRunAt ? Date.parse(state.lastRunAt) : NaN;
  if (!Number.isFinite(last)) return null;
  const m = istMinutes(nowMs);
  if (m < WINDOW_START_MIN || m >= WINDOW_END_MIN) return null;   // only for runs that start between 9 am and 10 pm
  if ((nowMs - last) / 3600000 <= MISSED_AFTER_HOURS) return null;
  if (!slotsBetween(last, nowMs).length) return null;            // nothing was due in between (for example just the night)
  return `⚠️ Last scan was at ${fmtIstTime(last, nowMs)} — a scheduled run may have been missed. Use Run workflow if needed.`;
}
