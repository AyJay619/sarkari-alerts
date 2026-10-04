# AAI Recruitment (Airports Authority of India)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (works, but misses updates - FIX proposed)

## BATCH SUMMARY BLOCK
SITE: AAI Recruitment | VERDICT: FIX
PROPOSED: 1) keep source "aai" unchanged (new jobs: release links, works free, 7/7 runs OK). 2) add FREE source "aai-updates" (same URL, selector "table tbody tr td.views-field a", contextClosest "tr", contextFind "td.views-field-title", limit 130, rebaseline) so press notes, syllabus, admit card, result, registration/objection links and "Updated On" date changes are caught.
MISSING TODAY: the scanner takes only the FIRST link of each table row (the release page), so a new result / press note / admit card / syllabus on an existing advert is never seen (e.g. result for Advt 12/2026 Managers/JE, Advt 01/2025/NR results updated Sep 2026).
ASK BATLEE: apprentice-engagement notices (graduate/diploma/ITI apprentices, per region) pass under the standing rule "open jobs"; recommend PASS but tell sorter they are training posts, not regular jobs.

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitment table (all adverts, one row per advert, 50 rows per page, newest first) | https://www.aai.aero/en/careers/recruitment | free fetch (https, www; no-www also answers 200) | FREE-OK |
| Page 2..6 of the same table | .../recruitment?page=1 ... | free fetch 200 | not needed (older adverts; page 0 = newest) |
| Archive page | https://www.aai.aero/en/careers/aai-career | free 200 | archive of 2017-era notices, ignore |

Row columns: Exam Name | Department | Total Posts | Job Post Date | Recruitment Advt. (release page link + "Updated On") | Press Note | Online Registration & Objection Link | Syllabus | Admit Card | Last Updation | Result.
Per-row links look like /en/recruitment/release/<id>, /recruitment/press-note/<id>, /recruitment/syllabus/<id>, /recruitment/result/<id> (admit card column empty today, expected /recruitment/admit-card or a digialm login link), plus external registration/objection links (cdn.digialm.com, ibpsreg.ibps.in).

## ScrapFly
Not needed. Free fetch OK; no credits.

## Test results
- Scanner's own fetchItems on current "aai" source: 30 items, identical on 7 repeated runs (6 + 1 with timeoutMs 15000). No flakiness, no block.
- Page 0 has 50 rows (current limit 30 shows only the top 30; fine for new postings, but old rows below 30 can never matter).
- Link stability: release links are numeric ids, stable. Seen-state already holds these 30, no flood risk. Row order is not strictly by date (an older "Updated" row can sit above a newer one), so keep limit comfortably above what can be posted between scans.
- Proposed "aai-updates" source: 118 items on page 0 (so limit 130). The title carries "Updated On dd-mm-yyyy", so an edited release page or a new press note/result gets a NEW title and is alerted once; link host stays stable. First run is silently re-baselined.

## What the scanner catches vs misses
- Catches: new adverts (new row = new release link). Posting speed: a new advert appears at the top of page 0 within the same day it is posted; 30-row limit is ample.
- Misses today: any later document on an existing advert (press note, syllabus, admit card, result, registration/objection link, corrigendum shown by "Updated On" change). AAI posts results/press notes this way (e.g. Advt 01/2025/NR result updated 09-09-2026, Advt 01/2025/CHQ result 01-07-2026), so these were silently lost.

## Label pattern
Source "aai": title = advert title exactly as AAI writes it, often with the advert number inside: "Direct Recruitment of Managers and Junior Executives in various disciplines under Advt. No: 12/2026/CHQ/DR-CBT". Advert numbers have shapes like NN/YYYY/CHQ(/DR-CBT, /CN, /AD, /SSCOs), NN/YYYY/NR, SR/01/2023, ER/01/2024, 01/2025/DR/NER. Capitals vary (often ALL CAPS): normalise case.
Source "aai-updates": "<advert title>: <document label>" where document label is "Updated On dd-mm-yyyy" (type is read from the link path: /release/ = notification or edit of it, /press-note/ = press note (may carry a result, schedule, notice), /syllabus/ = syllabus/exam scheme, /result/ = result), "Registration Link" or "Objection Link" (external digialm/IBPS portal). PARENT = the part before the last ": ". Release id in the link (e.g. 721425) is the same across release/press-note/syllabus/result links of one advert: use it to match updates to the job.

## Hold / pass rules for the sorter
HOLD:
- Contract engagement of consultants / senior consultants / junior consultants / advisors / principal consultants (AAI Advt NN/YYYY/CHQ/CN, /AD, "Engagement of consultants ... on contract basis"), short-service-commission officers as consultants (Advt 14/2026/CHQ/SSCOs: ex-servicemen/retired style)
- Medical consultant (non-specialist doctor) on contract, locum
- Flight Inspection Unit contract hires (Co-Pilot P2, Quality Manager, NSOP post holders), Company Secretary on contract
- Empanelment (arbitrator, panels), tenders, RTI, lost and found, press/media pages
- Deputation, promotion, departmental exams; ex-servicemen-only
- Registration/Objection Link items with no document (not a notice by themselves): hold unless an admit card/result/new job is behind them (they are useful as signals that a window opened: sorter may open the advert's release page)
- Syllabus-only updates: hold (info) unless the sorter sees exam date or scheme change
PASS:
- Regular direct recruitment (Junior Executives, Managers, Senior/Junior Assistant, Non-Executive cadres, ATC, GATE-based), including ones reserving ESM seats
- Admit cards, results (press-note link updated after a result/CBT date), answer keys, corrigenda, extensions, cancellations, document verification schedules, current-cycle interview schedules
- Apprentice engagement notices (see ASK)

## Sample links (audit day 2026-10-04)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Advertisement for Hiring of Co-Pilot (P2) on contract basis at Flight Inspection Unit, AAI | New Job (contract) | FIU Co-Pilot P2 | Hold |
| Engagement of Medical Consultant (Non-Specialist Doctor) ... RHQ Southern Region, Chennai | New Job (contract) | Medical Consultant SR | Hold |
| Hiring of Quality Manager/Compliance Monitoring Manager ... Flight Inspection Unit | New Job (contract) | FIU QM | Hold |
| Direct Recruitment of Managers and Junior Executives ... Advt. No: 12/2026/CHQ/DR-CBT | New Job | Advt 12/2026/CHQ (389 posts) | Pass |
| ... Advt 12/2026/CHQ: Updated On 23-09-2026 (press-note/721425) | Update | Advt 12/2026/CHQ | Pass (open) |
| ... Advt 12/2026/CHQ: Registration Link (ibpsreg.ibps.in/aaioct25) | Update | Advt 12/2026/CHQ | Pass as signal |
| AAI Advertisement No.14/2026/CHQ/SSCOs ... Short Service Commission Officers as Consultants | New Job (contract/ESM) | Advt 14/2026 | Hold |
| Application for Empanelment as Arbitrator in AAI | Noise | - | Hold |
| Recruitment Notification (Advt. 01/2025/NR) Non-Executive, Northern Region: Updated On 09-09-2026 (result/559022) | Result | Advt 01/2025/NR | Pass |
| Engagement of Graduate/Diploma apprentices 2026-27, Nagpur | New Job (apprentice) | Apprentices Nagpur | Pass (see ASK) |
| Direct Recruitment of Non Executives ... Western Region: Updated On 18-08-2026 (result/567625) | Result | WR non-exec | Pass |
| Advertisement No. 01/2026/NR Apprentices, AAI Northern Region | New Job (apprentice) | Advt 01/2026/NR | Pass |
| Recruitment for Junior Assistant (Fire Service) ER (Advt ER/01/2024): Updated On 27-07-2026 (result/545277) | Result | Advt ER/01/2024 | Pass |
| AAI Advertisement No. 11/2026/CHQ/CN Senior Consultant in Law Directorate | New Job (contract) | Advt 11/2026/CN | Hold |
| Direct Recruitment of Junior Executives through GATE ... Advt 09/2025/CHQ: Updated On 17-07-2026 (result/618077) | Result | Advt 09/2025/CHQ | Pass |
| Direct Recruitment of Junior Executives ... Advt 01/2025/CHQ: Updated On 01-07-2026 (result/558472) | Result | Advt 01/2025/CHQ | Pass |
| Recruitment Notification (Advt 01/2025/DR/NER) Non-Executive NER: Updated On 19-06-2026 (result/653237) | Result | Advt 01/2025/DR/NER | Pass |
| Advertisement No.13/2026/CHQ/AD Engagement of an Advisor ... | New Job (contract) | Advt 13/2026 | Hold |

## Proposed config (not applied)
```json
{
  "id": "aai-updates",
  "name": "AAI Recruitment (documents)",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.aai.aero/en/careers/recruitment",
  "selector": "table tbody tr td.views-field a",
  "contextClosest": "tr",
  "contextFind": "td.views-field-title",
  "limit": 130,
  "rebaseline": true
}
```
Existing source "aai" stays as is. Duplicates between the two (release links) are fine, the sorter merges them.

## Uncertain
- The Admit Card column was empty on all rows checked today, so the exact admit-card link shape is not seen yet (expected to be caught by the generic selector).
- "Updated On" date changes re-alert an advert when AAI merely edits its release page; this is wanted (corrigenda) but may occasionally be a trivial edit.
- Only page 0 is watched. Pages 1-5 hold older adverts; a very busy day (>50 new rows) is not realistic.

## BatLee's corrections
- none yet

## Repairs
- none
