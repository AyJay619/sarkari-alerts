## BATCH SUMMARY BLOCK
```
SITE: Oil India (oil-india + oil-india-archive) | VERDICT: FIX
PROPOSED: 1) add FREE source oil-india-results = https://www.oil-india.com/result (rowSelector "table tr", rowTitle "td:nth-child(2)", rowLink "a[href*='files/result']", limit 20, allowEmpty true) - tested, returns 2 rows
PROPOSED: 2) keep oil-india and oil-india-archive exactly as they are (both work free, 250-950 ms, 3/3 repeats stable)
MISSING TODAY: results page (Grade D/E/F result of 10/09/2026 is not caught by either source); the CBT admit-card/objection links on digialm ARE caught via the archive page
ASK BATLEE: none (note: most Oil India postings are contractual/consultant roles = HOLD; only Grade D/E/F executive and PwBD special drive style notices are real jobs)
```

# Oil India
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, config not yet changed)

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Advertisement List (current) | https://www.oil-india.com/advertisement-list | free fetch via fetchItems (https, www) | FREE-OK, 2 rows today |
| Archive / recent advertisements | https://www.oil-india.com/archive-advertisement-data | free fetch | FREE-OK, 10 rows today (also holds CBT notices, admit card + objection links to cdn.digialm.com) |
| Results (NOT watched yet) | https://www.oil-india.com/result | free fetch | FREE-OK, 2 rows, proposed new source |
| Careers hub | https://www.oil-india.com/careeroil | opened, only a menu page | not needed |

Repeat test: 3 fetches each, all succeeded (oil-india 2 rows; archive 10 rows; 250-950 ms). No timeout change needed (default is fine). Group FREE, no ScrapFly needed.

## What the scanner catches vs misses
- Catches: current advertisements, archive advertisements, CBT deferment / admit card / objection notices (archive page).
- Misses: the /result page (result notifications). Not seen anywhere else on the two watched pages.
- Posting speed: the pages are small and rarely change (current list last updated 22/09/2026; only a few postings a month). limit 20 is plenty. Archive page is a rolling list; the current page holds only open adverts, so it empties between postings (consider allowEmpty on oil-india; at present it has 2 rows).
- Link stability: links are `download-advertisement-document?detail=<base64 id>` (stable ids, e.g. NlVXMw==), result links are static PDF paths. No flood risk seen (the same ids appear in state/seen-india.json run after run). Digialm links on the archive page are generic form URLs (Index.html / login.html) that stay the same across notices; the seen check keys on title+link so a new title still alerts.

## Label pattern
Titles are plain headlines, no type prefix:
- "Advertisement for Engagement of <contractual role(s) / Consultant (...)> ... FHQ, OIL, Duliajan" = contract hiring (HOLD).
- "Advertisement for Recruitment in Grade D/E/F in Executive Cadre in OIL" = real job (PASS).
- "Admit Card download link for CBT ... against Advertisement no. HRAQ/REC-WP-B/26-148 dated 08/05/2026" = Admit Card.
- "Objection Management for CBT ... against Advertisement no. ..." = Update (answer-key style objection window, PASS).
- "Deferment of Computer Based Test (CBT) against Notification no. ..." = Update (PASS).
- "Result Notification for recruitment held against advertisement no. HRAQ/REC-EX-B/2026-01 dated 28/05/2026 ..." = Result.
PARENT = the advertisement number after "against (Advertisement|Notification) no." (e.g. HRAQ/REC-WP-B/26-148 = PwBD special recruitment drive, workmen category; HRAQ/REC-EX-B/2026-01 = Grade D/E/F executive cadre), otherwise the post name in the title.

## Hold / pass rules for the sorter
HOLD: "Engagement of Contractual ..." and "Engagement of Consultant ..." adverts (contractual / consultant roles), contractual teacher posts at OIHSS Duliajan, tenders / vendor notices, financial results, blocked vendor lists, fraud-offer public notices.
PASS: Grade D/E/F executive recruitment, workmen / PwBD drive notices, CBT admit cards, objection windows, deferments, result notifications for regular posts, corrigenda / extensions.
Borderline: results of contractual-teacher engagements (e.g. OIHSS Duliajan result) = HOLD for consistency with their adverts.
No keyword filters in the script (standing rule).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Advertisement for Engagement of Contractual Electrician and Contractual Associate Engineer (Electrical) ... FHQ, Duliajan | New Job (contract) | contractual Electrician / Assoc Engineer, FHQ Duliajan | HOLD |
| Advertisement for Recruitment in Grade D/E/F in Executive Cadre in OIL | New Job | Grade D/E/F Executive Cadre | PASS |
| Advertisement for Engagement of Consultant (Land and Coordination) ... MBP, Bhubaneswar | New Job (consultant) | Consultant Land & Coord, MBP | HOLD |
| Advertisement for Engagement of Contractual Personnel at OGEL | New Job (contract) | OGEL contractual | HOLD |
| Advertisement for Engagement of Contractual Graduate Teacher (Fine Arts) and (Physical Education) ... OIHSS | New Job (contract) | OIHSS teachers | HOLD |
| Objection Management for CBT for Special Recruitment Drive for PwBD ... HRAQ/REC-WP-B/26-148 | Update | HRAQ/REC-WP-B/26-148 | PASS |
| Admit Card download link for CBT ... PwBD ... HRAQ/REC-WP-B/26-148 | Admit Card | HRAQ/REC-WP-B/26-148 | PASS |
| Advertisement for Engagement of Consultant (Fishing) ... FHQ Duliajan | New Job (consultant) | Consultant Fishing | HOLD |
| Advertisement for Engagement of Contractual Mechanical Supervisor, Instrumentation Technician, Asst Diesel Mechanic ... | New Job (contract) | FHQ contractual | HOLD |
| Advertisement for Engagement of Contractual Chemist (Fields) ... | New Job (contract) | Chemist FHQ | HOLD |
| Deferment of CBT against Notification no. HRAQ/REC-WP-B/26-148 | Update | HRAQ/REC-WP-B/26-148 | PASS |
| Advertisement for Engagement of Contractual Data Assistant (Medical) ... | New Job (contract) | Data Assistant FHQ | HOLD |
| Result Notification ... advertisement no. HRAQ/REC-EX-B/2026-01 ... Grade D/E/F Executive cadre | Result | HRAQ/REC-EX-B/2026-01 | PASS (not caught today) |
| Engagement of Contractual Graduate Teacher ... OIHSS Duliajan (result PDF) | Result | OIHSS teachers | HOLD (not caught today) |

## Proposed config (sources.json, NOT applied)
```json
{
  "id": "oil-india-results",
  "name": "Oil India (results)",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.oil-india.com/result",
  "rowSelector": "table tr",
  "rowTitle": "td:nth-child(2)",
  "rowLink": "a[href*='files/result']",
  "limit": 20,
  "allowEmpty": true
}
```
Existing oil-india and oil-india-archive entries unchanged. Optional: add "allowEmpty": true to oil-india (the current list can empty between postings). New source baselines on first run.

## Uncertain
- The /result page has only 2 rows now, so the row structure was tested on a small sample; the row link selector assumes result PDFs stay under /files/result/.
- Digialm links are shared form URLs; if Oil India reuses the same title for a new round it would be treated as seen.

## BatLee's corrections
- none yet

## Repairs
- none
