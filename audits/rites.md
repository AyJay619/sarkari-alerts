## BATCH SUMMARY BLOCK
SITE: RITES (rites.com) | VERDICT: FIX
PROPOSED: 1) keep "rites" as is (render:true, local browser, free; ~3.5s, 10 rows, stable 4 of 4 runs). 2) add FREE source "rites-results" https://www.rites.com/Result (render, waitFor "table tbody tr td", rowSelector "table tbody tr", rowTitle "td:nth-child(3)", rowLink "a[href]", minTitle 5, limit 30, allowEmpty) - offer lists, answer keys. 3) add FREE source "rites-schedule" https://www.rites.com/SelectionSchedule (same options) - written test/interview schedules, addenda. Rebaseline on first run.
MISSING TODAY: Results (offer lists, provisional answer keys) and Selection Schedule (interviews, addenda) pages are not watched; only Vacancies is.
ASK BATLEE: Table shows only 10 rows per page (Results got 10 rows in 3 days, Sep 28-30): a burst of >10 between scans would lose items; recommend accept (scan runs several times a day).

# RITES Careers
Audited: 2026-10-04 | Group: FREE | Status: PROPOSAL (batch, nothing applied)

## Pages watched / tested (scanner fetchItems, free local Chromium render; ScrapFly not needed)
| Page | URL | Method | Verdict |
|---|---|---|---|
| Vacancies (in config as `rites`) | https://www.rites.com/Career | render + table rows | FREE-OK: 10 items, 4 of 4 runs identical, ~3.4-4.1 s |
| Results | https://www.rites.com/Result | render, same selectors | FREE-OK: 10 items (NEW) |
| Selection Schedule | https://www.rites.com/SelectionSchedule | render, same selectors | FREE-OK: 10 items (NEW) |
Plain curl of /Career returns the shell with no rows (table is filled by JS), so render stays needed. I did not find the underlying JSON call (not searched further; render works). Archived pages /ResultOld and /SelectionScheduleOld exist, not tested, not needed. URL "Selection_Schedule" is wrong (timeout). https with www works; no http/no-www test needed.

## What the scanner catches vs misses
Catches Vacancies only. Misses results/answer keys and interview/test schedules/addenda (pages above). Row title is column 3 of the table; link is the PDF in /Upload/Career/.

## Posting speed vs limit
Vacancies: 10 rows span Sep 16 to Oct 1 (about 2 weeks) - safe. Results: 10 rows span Sep 28-30 - fast, a burst can exceed the 10 shown. Schedule: 10 rows span Sep 9-22 - safe. Links are dated PDF names (stable, no flood risk seen).

## Label pattern
Titles are plain free text, often bilingual "<Hindi> / <English>" (take the English half; Hindi-only duplicates hold). Parent = vacancy number inside the title or advert PDF name: "VC No RG/30-R1/25", "RG/11/26", "YP/13-R1/25" (RG = regular, YP = young professional/contract, CL = contract, M = Manager-level series). Result types: "Offer List N [for VC No ...]", "Provisional Answer Key and Objection Window for <VC>", "Offer list cum result for vacancies RG/08/26 to RG/10/26". Schedule types: "Written Test Schedule ...", "Interview Schedule for VC No. ...", "Addendum for Vacancy No(s). ...".

## Hold / pass rules for the sorter
HOLD: individual consultants / young professionals (YP/...) and "Engagement of Individual Consultants"; REOI / empanelment of experts (project expert pools, e.g. Colombo, Guyana); "absorption basis" / deputation single posts; Hindi-only duplicates; tenders; compassionate-appointment notices.
PASS: "Recruitment of ... Professionals on Regular Basis" (RG/...) ads; offer lists / results; provisional answer keys; written test and interview schedules for regular posts; addenda/corrigenda.
Note: offer lists are numbered per vacancy batch and may be many per day; sorter should merge by VC No.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| REOI Empanelment of Experts, Port of Colombo | Noise | Colombo REOI | Hold |
| Recruitment of Computer Science/IT Professionals on Regular Basis | New Job | RITES Advt (Final_Adv 6) | Pass |
| Recruitment of Engineering Professionals on Regular Basis - DGM (Architect/Buildings) | New Job | RG/47/26 | Pass |
| Engagement of Individual Consultants, Assam | Noise | YP/20-22, 61 | Hold |
| REOI Empanelment of Experts, Guyana Road Project | Noise | Guyana REOI | Hold |
| Filling up of 01 post Manager / Railway Design & Operation, immediate absorption | Noise | 22/26 | Hold |
| Engagement of Individual Consultants, Haryana | Noise | YP/26,28,30 | Hold |
| Recruitment of Professionals on Regular Basis | New Job | RG/46/26 | Pass |
| Recruitment of Engineering Professionals on Regular Basis | New Job | RG/18-R3/25 | Pass |
| Recruitment of Engineering Professionals on Regular Basis | New Job | RG/26-R1/25 to RG/28-R1/25 | Pass |
| Offer List 7 | Result | Offer List 7 | Pass |
| Offer List 32 for VC No M/89-120/25 | Result | M/89-120/25 | Pass |
| Offer list cum result for RG/08/26 to RG/10/26 | Result | RG/08/26-10/26 | Pass |
| Provisional Answer Key and Objection Window for RG/11/26 | Answer Key | RG/11/26 | Pass |
| Written Test Schedule for posts advertised on regular basis | Update | regular-basis posts | Pass |
| Interview Schedule for VC No. RG/13/26 | Update | RG/13/26 | Pass |
| Interview Schedule for posts on Contract basis | Update | contract posts | Hold (contract) |
| Addendum for Vacancy No(s). YP/13-R1/25 | Update | YP/13-R1/25 | Hold (YP) |

## Proposed config (new sources; existing `rites` unchanged)
```json
[
 {"id":"rites-results","name":"RITES Results","runner":"india","tier":"FREE","level":"central","type":"html","url":"https://www.rites.com/Result","render":true,"waitFor":"table tbody tr td","rowSelector":"table tbody tr","rowTitle":"td:nth-child(3)","rowLink":"a[href]","minTitle":5,"limit":30,"allowEmpty":true},
 {"id":"rites-schedule","name":"RITES Selection Schedule","runner":"india","tier":"FREE","level":"central","type":"html","url":"https://www.rites.com/SelectionSchedule","render":true,"waitFor":"table tbody tr td","rowSelector":"table tbody tr","rowTitle":"td:nth-child(3)","rowLink":"a[href]","minTitle":5,"limit":30,"allowEmpty":true}
]
```
Existing `rites` has minTitle 15 and exclude "compassionate|qualified|roll no|unique id"; fine for vacancies.

## Uncertain
- Table pagination: only the first 10 rows are visible; not checked whether a "next page" exists (not needed).
- Row dates were not extracted (scanner does not need them); date ranges above are inferred from PDF filename timestamps.
- Whether the Results page ever empties: unknown, hence allowEmpty.

## BatLee's corrections
none yet

## Repairs
none
