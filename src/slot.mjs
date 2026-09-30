// "Time slots": the five scheduled scans of the day, in Indian time (9:30 am, 12:30 pm, 3:30 pm, 6:30 pm, 9:30 pm).
// A run belongs to the latest slot that is at most EARLY_MIN minutes ahead of it: the GitHub timer fires at :25 (5 minutes early),
// the PC trigger at :30, and either may start late (a late 9:25 run that only starts at 10:40 still belongs to the 9:30 slot).
// Before 9:15 am a run belongs to the previous evening's 9:30 pm slot.
// The monitor remembers the slot of its last run (state.lastSlot). A run started by the timer or by the PC trigger (SLOT_GUARD=true)
// whose slot was already done exits at once, so the same slot never runs twice when both fire. The manual "Run workflow" button is not guarded.
export const SLOT_MINUTES_IST = [9 * 60 + 30, 12 * 60 + 30, 15 * 60 + 30, 18 * 60 + 30, 21 * 60 + 30];
export const EARLY_MIN = 15;
const DAY = 86400000, IST = 5.5 * 3600 * 1000;
const two = n => String(n).padStart(2, "0");

// -> "2026-09-30 09:30" (Indian date and slot time)
export function slotOf(ms) {
  const ist = ms + IST, m = Math.floor((ist % DAY) / 60000);
  let day = Math.floor(ist / DAY), slot = null;
  for (const s of SLOT_MINUTES_IST) if (m >= s - EARLY_MIN) slot = s;
  if (slot === null) { slot = SLOT_MINUTES_IST.at(-1); day -= 1; }
  return `${new Date(day * DAY).toISOString().slice(0, 10)} ${two(Math.floor(slot / 60))}:${two(slot % 60)}`;
}

// true when this run should stop because its slot was already scanned
export const slotAlreadyDone = (state, ms, guardOn) => guardOn === true && state?.lastSlot === slotOf(ms);
