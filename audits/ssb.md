# SSB Recruitment (Sashastra Seema Bal)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (no config change needed)

## BATCH SUMMARY BLOCK
SITE: SSB Recruitment | VERDICT: OK
PROPOSED: none (optional: add /advertisementsUrl as FREE source, see below)
MISSING TODAY: nothing found on notificationUrl (30 of 135 rows watched, newest first); open-job rows also appear there, but the clean Advertisements table (advt no, post, last date) is not watched
ASK BATLEE: Add https://recruitment.ssb.gov.in/advertisementsUrl as a 2nd FREE source (extra clean list of open jobs with last date; rebaseline)? Recommend yes, low cost. Also note: all links are the page itself (PDFs only via form POST), so Sarkari24 agents must open the page and click PDF Download.

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Notifications / notices (main, "everything") | https://recruitment.ssb.gov.in/notificationUrl | free fetchItems, https, 4 runs: 30 items, 230-570 ms, no failures | FREE-OK |
| Advertisements (open jobs) | https://recruitment.ssb.gov.in/advertisementsUrl | free curl 200, 18 rows (not in scanner) | FREE-OK, proposed extra |
| Admit Card | https://recruitment.ssb.gov.in/AdmitCardUrl | free curl 200, 6 rows, links to external admit-card portals | FREE-OK, optional |
| Result | https://recruitment.ssb.gov.in/resultUrl | 200 but "Data Not Available." today | empty (allowEmpty if ever added) |

Homepage and all pages load without www (the host has no www variant in use). Cost: FREE, 0 credits.

## What the scanner catches
Source `ssb`: rows `table tr`, title = td 2 of notificationUrl (Notice title), pageLink true, minTitle 15, limit 30. Returns 30 titles; every link = https://recruitment.ssb.gov.in/notificationUrl (PDFs are not real links: each button submits a form POST `getDownloadUrlforadvdocnoti` with an encrypted doc id, so they cannot be linked directly). pageLink:true is therefore correct and necessary; dedupe is by title.
Posting speed vs limit: page has 135 rows, newest first with a date column (td 3). 30 rows cover roughly the last 2-3 months; a flood would need more than 30 new notices between scans, unlikely. The date is not captured by the scanner (not required).
Link stability: all links identical to the page, so no flood from rotating URLs. Titles stable across 4 runs.

## Label pattern
Titles are free text, no fixed prefix. Common forms:
- "Important Notice : <subject> for the post of <post>-<year>" (notices, schedules)
- "Corrigendum: - <subject>" / "Extension of ..." (updates)
- "Advertisement for the post of <post> ..." (new job; basis in text: Deputation / Re-employment / remustration / Sports Quota)
- "e-Admit Card / E-Admit Card / Admit Card for ... <exam/post>"
- "Details of Candidate whose withheld/revised result cleared ... for the post of Constable (GD) - <year>" (result notes)
PARENT = the "post + year" part, e.g. "Constable to Sub Inspector (Non-GD) 2025", "Head Constable (Ministerial) 2020", "CAPFs (AC) Exam 2026", "Constable (GD) Sports Quota 2026", "GDMO/Specialist Doctors walk-in 2026". The Advertisements page gives the advt number (e.g. 524/RC/SSB/Combined-Advt./CT_to_SI(Non-GD)/2025, 541/RC/SSB/CT(GD)SQ-2025/2026) which ties notices to the job.

## Hold / pass rules for the sorter
HOLD:
- Deputation / re-employment / "short-term contract" advertisements (e.g. Senior Instructor Mountaineering, Inspector Veterinary on Deputation/Re-employment).
- Constable (GD) "through remustration" advertisements (internal, serving personnel only).
- "Details of Candidate whose withheld/revised result cleared ..." (individual clearance lists, old cycles) - hold as marks/individual-case notices.
- Court-compliance result notices for old cycles (e.g. EWS Cat.-2020 per Delhi High Court) - hold unless BatLee wants.
- Updation of official email ID, objection-portal logistics (hold unless the exam is the current cycle; extension of objection window is hold per debarment/normalisation style rules - borderline, see uncertain).
- Walk-in interviews for GDMO/Specialist doctors: contract-type doctor posts, hold as small contract roles (borderline, see uncertain).
PASS:
- Constable to SI (Non-GD) 2025 corrigenda, correction window, PET/PST admit cards and schedules.
- CAPFs (AC) Exam 2026 notices and e-admit cards (note: this is a UPSC exam run through SSB's portal; link to UPSC parent).
- Head Constable (Ministerial) 2020 admit card, written exam notice.
- Constable (GD) Sports Quota 2026 advertisement and admit card.
- Any new open advertisement that is not deputation/remustration.

## Sample links (audit day, notificationUrl)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Important Notice - Recruitment of CAPFs (ACs) Exam - 2026 | Update | CAPFs (AC) 2026 | Pass |
| Details of Candidate whose withheld result cleared ... Constable (GD) -2025 | Result | Constable (GD) 2025 | Hold |
| Important Notice: e-Admit cards for PST and PET of CAPFs (AC) Exam-2026 | Admit Card | CAPFs (AC) 2026 | Pass |
| Important Notice: Conduct of PST and PET for CAPFs (ACs) Exam-2026. | Update | CAPFs (AC) 2026 | Pass |
| Filling up the 01 post of Senior Instructor (Mountaineering) ... on deputation | New Job | Advt 1/SSB/Pers-IV/Dep-In/Mount/25 | Hold (deputation) |
| Corrigendum: Recruitment for Constable to Sub Inspector (Non-GD)-2025 | Update | CT to SI (Non-GD) 2025 | Pass |
| Advertisement for Inspector (Veterinary) Group-B ... Deputation/Re-employment | New Job | Inspector (Vety) 2023 | Hold |
| E-Admit Card for Constable to Sub-Inspector (Non-GD)-2025, PET and PST | Admit Card | CT to SI (Non-GD) 2025 | Pass |
| Important Notice: Commencement of PET and PST for CT to SI (Non-GD)-2025 | Update | CT to SI (Non-GD) 2025 | Pass |
| Important Notice: Updation of official Email ID of Recruitment Branch | Noise | - | Hold |
| Declaration of results ... EWS Cat.-2020 (Delhi HC judgment 19.06.2026) | Result | Constable (GD)/EWS 2020 | Hold (court case, old cycle) |
| Extension of Objection Management Portal for 01 day ... CBT HC (Ministerial)-2020 | Update | HC (Ministerial) 2020 | Pass (answer-key objection window, borderline) |
| e-Admit Card for CBT for Head Constable (Ministerial)-2020 | Admit Card | HC (Ministerial) 2020 | Pass |
| Admit Card for Documentation, PST, DME, RME for Constable (GD) Sports Quota 2026 (Stage-1) | Admit Card | CT (GD) Sports Quota 2026 | Pass |
| Important Notice - Advertisement for Constable (GD) through remusteration | Update | CT (GD) remustration 2026 | Hold |
| Advertisement for Constable (General Duty) under Sports Quota in SSB | New Job | Advt 541/RC/SSB/CT(GD)SQ-2025/2026 | Pass |
| Walk-in-interview for GDMOs and Specialist Doctors in SSB | New Job | GDMO walk-in 2026 | Hold (contract doctors; ask) |
| Corrigendum ... Walk-in-interview GDMOs (Employment News 16-22 May 2026) | Update | GDMO walk-in 2026 | Hold |

## Proposed full config (unchanged source + optional new source)
```json
[
  { "id": "ssb", "name": "SSB Recruitment", "runner": "india", "tier": "FREE", "level": "central", "type": "html",
    "url": "https://recruitment.ssb.gov.in/notificationUrl", "rowSelector": "table tr", "rowTitle": "td:nth-child(2)",
    "pageLink": true, "minTitle": 15, "limit": 30 },
  { "id": "ssb-advt", "name": "SSB Advertisements", "runner": "india", "tier": "FREE", "level": "central", "type": "html",
    "url": "https://recruitment.ssb.gov.in/advertisementsUrl", "rowSelector": "table tr", "rowTitle": "td:nth-child(3)",
    "pageLink": true, "minTitle": 6, "limit": 20 }
]
```
(ssb-advt untested through fetchItems; selectors derived from the HTML, columns: no, advt no, post, start, last date. Title would be the post name only; consider titleReplace or td 2 for the advt number. Test before adding.)

## Uncertain points
- PDFs cannot be linked or fetched without a form POST with an encrypted id; not tested whether the id changes per visit (irrelevant while pageLink is true).
- GDMO walk-in doctors and objection-window extensions: borderline pass/hold; defaulted as stated above.
- resultUrl is empty today, so results appear as notices on notificationUrl instead.

## BatLee's corrections
- none yet

## Repairs
- none
