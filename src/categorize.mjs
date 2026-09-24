// Decides the category tag from the notice title. Order matters: first match wins.
const RULES = [
  ["Answer Key", /answer\s*key|response\s*sheet|provisional\s*answer|master\s*question/i],
  ["Admit Card", /admit\s*card|e-?admit|hall\s*ticket|call\s*letter|city\s*intimation|exam\s*city/i],
  ["Correction", /corrigendum|addendum|amendment|erratum|correction|revised|revision|extension\s+of|extended|postponed|rescheduled/i],
  ["Result", /result|merit\s*list|cut[\s-]*off|final\s*selection|selected\s*candidates|shortlist|screened|score\s*card|selection\s*panel/i],
  ["Job", /advt|advertisement|recruitment|vacanc|walk-?in|engagement|invit(e|es|ing|ation)[^.]{0,60}application|apply\s*online|notification|posts?\s+of|deputation/i],
];

export function categorize(title) {
  for (const [tag, re] of RULES) if (re.test(title)) return tag;
  return "Other";
}
