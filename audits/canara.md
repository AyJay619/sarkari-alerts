# Canara Bank Careers
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: PROPOSED FIX

## BATCH SUMMARY BLOCK
SITE: Canara Bank Careers | VERDICT: FIX
PROPOSED: 1) url -> https://www.canarabank.bank.in/pages/recruitment, selector -> "div.text-sec li a" (rebaseline on first run, 23 items); keep minTitle 15, limit 40
MISSING TODAY: current source (pages/career) shows only 5 old links; it misses IBPS-CRP-XV CSAs and POs and Graduate Apprentices FY 2026-27 (all [NEW] on the recruitment page)
ASK BATLEE: none

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitment (the real list, marked [NEW]) | https://www.canarabank.bank.in/pages/recruitment | free fetchItems, selector div.text-sec li a | FREE-OK (23 items, 4 runs, 50-210 ms) |
| Career (current source) | https://www.canarabank.bank.in/pages/career | free fetchItems, selector div.mainBox li a | FREE-OK but only 5 stale links (6 runs fine) |
| /recruitment-know-more | redirects to /pages/recruitment | - | alias, not needed |
Only https www tested (works, fast). No ScrapFly needed. Cost: 0 credits.

## What the scanner catches vs misses
- Today's source: 5 items (apprentice selection list, CRP-XIV CSAs, CRP-XIII clerks, CRP-XIII POs, HRD Initiatives). Misses the three newest notices above.
- Proposed source: 23 items, all notices; each is a sub-page (one per recruitment) that holds the advert/PDF and updates (results, schedules) inside it, so a NEW update inside an existing page will NOT create a new link. Sorter should open the sub-page when it is flagged. Each recruitment has its own page, so a new recruitment = new link (caught).
- Posting speed: new items are added at top with [NEW]; not strictly ordered (e.g. extension for CFAT sits 4th), so keep limit 40 (23 now).
- Flood check: links are stable slugs. One slug appears with and without /pages/ (ibps-crp-xiii-probationary-clerks): only a one-time duplicate risk on rebaseline, none after.

## Label pattern
Free text, no Type prefix. Parent = the title itself:
- "IBPS-CRP-XV-Probationary Officers (POs) in JMG Scale I" -> New Job, parent "Canara Bank PO (IBPS CRP XV)". (IBPS CRP posts are IBPS exams: match with IBPS items.)
- "Engagement of Graduate Apprentices ... FY 2026-27" -> New Job (apprentice), parent "Canara Bank Graduate Apprentices 2026-27".
- "List Of Provisionally Selected Candidates ... Apprentice ... Document Submission" -> Result/Update, parent = Apprentices FY (check which year).
- "RP-x/yyyy" / "Recruitment Project n/yyyy - ..." -> specialist officer recruitment, parent "Canara RP n/yyyy".
- "... Extension" -> Update (extension), parent = the post named before it.

## Hold / pass rules (for the sorter)
Hold: contract-basis engagements of senior individuals (Chief Economist, Chief Compliance/Risk Officer, Internal Ombudsman, Deputy Managing Trustee CFAT, Specialist Officers on contract) unless BatLee wants them; Canbank Venture Capital Fund / subsidiary single posts; Caution Notice - Fraud Alert; HRD Initiatives; old cycles (CRP-XII, XIII, FY 2024-25 apprentices) already seen.
Pass: IBPS CRP PO / CSA / clerk / IT-law officer notices (current cycle XV, results/provisional lists for XIV), regular Specialist Officer recruitments (RP-3/2024 style, regular basis), Graduate Apprentice notices and provisional selected lists, extensions / corrigenda.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Engagement of Graduate Apprentices ... FY 2026-27 | New Job | Apprentices 2026-27 | Pass |
| IBPS-CRP-XV-Probationary Customer Service Associates (CSAs) | New Job | IBPS CRP XV CSA | Pass |
| IBPS-CRP-XV-Probationary Officers (POs) in JMG Scale I | New Job | IBPS CRP XV PO | Pass |
| Engagement Of DMT CFAT On Contract Basis - Extension | Update | CFAT DMT contract | Hold (contract) |
| Engagement of Graduate Apprentice ... FY 2025-26 | Update/Result | Apprentices 2025-26 | Pass if new content |
| IBPS-CRP-XIV Probationary IT Officers & Law Officers - list of provisionally selected & withheld | Result | IBPS CRP XIV IT/Law | Pass |
| IBPS-CRP-XIV-Probationary Officers (POs) | Result/Update | IBPS CRP XIV PO | Pass |
| IBPS-CRP-XIV-Probationary CSAs | Result/Update | IBPS CRP XIV CSA | Pass |
| IBPS-CRP-XIII-Probationary Clerks | Old | IBPS CRP XIII | Pass only if changed |
| Recruitment Project 1/2025 - Specialist Officers on contract basis | New Job | RP 1/2025 | Hold (contract) |
| List of Provisionally Selected Candidates ... Graduate Apprentice - Document Submission & Verification | Result | Apprentices | Pass |
| RP-4/2024 Internal Ombudsman on contract | New Job | RP 4/2024 | Hold |
| RP-3/2024 Specialist Officers (Company Secretary) MMG II & III regular | New Job | RP 3/2024 | Pass |
| Recruitment Project 2/2024 Chief Economist contract | New Job | RP 2/2024 | Hold |
| Caution Notice - Fraud Alert | Noise | - | Hold |

## Proposed config (not applied)
```json
{
  "id": "canara", "name": "Canara Bank Careers", "runner": "india", "tier": "FREE", "level": "central",
  "type": "html",
  "url": "https://www.canarabank.bank.in/pages/recruitment",
  "selector": "div.text-sec li a",
  "minTitle": 15, "limit": 40
}
```

## Uncertain
- Updates are posted inside sub-pages; the scanner cannot see them unless a new link appears on the recruitment page (extension/result PDFs sometimes are added as new list rows, as with the DMT extension and apprentice list).
- "[NEW]" text is stripped by the scanner's title (aria-label has it); fine.
- The page is a Liferay site with a broad "div.text-sec"; if other text-sec blocks appear (footer) the list could grow; limit 40 guards this.

## BatLee's corrections
- none yet

## Repairs
- none
