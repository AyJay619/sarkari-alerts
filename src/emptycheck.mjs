// For sources with "allowEmpty": an empty list is normal, but a list that stays empty for 60 days may mean the site changed
// (its layout no longer matches). Updates st (emptySince / remindedAt) and says whether to send the reminder now.
export const EMPTY_REMINDER_DAYS = 60;
export function emptyReminder(st, itemCount, now = new Date(), days = EMPTY_REMINDER_DAYS) {
  if (itemCount > 0) { delete st.emptySince; delete st.emptyRemindedAt; return { remind: false }; }
  st.emptySince ??= now.toISOString();
  const since = new Date(st.emptySince), last = new Date(st.emptyRemindedAt ?? st.emptySince);
  if ((now - last) / 86400000 >= days) { st.emptyRemindedAt = now.toISOString(); return { remind: true, days: Math.floor((now - since) / 86400000) }; }
  return { remind: false };
}
