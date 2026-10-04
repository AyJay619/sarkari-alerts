# CRIS Career Notices (Centre for Railway Information Systems, www.cris.org.in)
Audited: 2026-10-04 (BATCH mode) | Group: FREE | Status: ACTIVE, no change needed

## BATCH SUMMARY BLOCK
SITE: CRIS Career Notices | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (371 PDF links, all on one page)
ASK BATLEE: CRIS posts are almost all deputation (Gazetted/Non_Gazetted, HOLD) or contract Project Assistant/Officer/Consultant engagements (Project_*). Recommend HOLD all contract Project_* posts (consultant/contract rule), except pass the few Software_Professionals (ASE/JEE/Executive) select lists and results. Say if you want Project Assistant posts passed instead.

## Pages watched and tested
All via the scanner's own fetchItems (free fetch). ScrapFly credits: 0.
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Career notices (current source) | https://www.cris.org.in/loadpage?page=indexcareer | free, 0.2-0.9 s, 480 KB, 371 links on every run (5 repeats) | FREE-OK |
URL variants: https, http, and no-www all return the same 371 links. Homepage https://www.cris.org.in/ has only 12 links (no career list), not useful. No separate results / admit card pages found (everything sits on the one careers page, in blocks by folder). PDFs download free: yes (HTTP 200 application/pdf from the same host, tested one).

## What the scanner catches vs misses
- Catches every PDF under cris.org.in/PDF/ on the page: 371 links. Hindi-title rows are dropped by the exclude regex; English twin kept. Nothing found that is missed.
- 4 rows have the useless title "PDF file,size < 1 mb, use Acrobat reader to open" (link only; the real title is in the filename, e.g. VAC NO 42_R_2025- AM_EXE_CEP.pdf). Sorter must open the PDF.
- No dates on the page. Newest rows are first inside each block. Posting speed cannot be measured from the page; the page is the first place CRIS publishes. Flood check: list is cumulative (old notices stay), the first run baselines all 371; no churn between runs.

## Blocks on the page (folder in the link)
| Folder | Links | What it is | Sorter |
|---|---|---|---|
| Gazetted | 21 | Deputation vacancy notices (Director, Manager, GM) | HOLD |
| Non_Gazetted | 101 | Deputation vacancy notices (Asst Manager, Executive) plus extensions, corrigenda, cancellations of those | HOLD |
| Project_Assistants | 119 | Contract Project Assistant engagements (some ex-servicemen only) | HOLD (see ASK) |
| Project_Officers | 66 | Contract Project Officer engagements (some retired railway officers only) | HOLD (see ASK) |
| Project_Consultant | 24 | Consultants | HOLD |
| Software_Professionals | 28 | ASE / JEE / Executive 2023 recruitment: select lists and provisional results | PASS (results/shortlists, but all old 2023, baseline only) |
| root /PDF/ | ~10 | ASE 2019 select panels (old), Internal Complaints Committee, contact list | HOLD (old / general info) |

## Label pattern
Titles are plain sentences: "<One/Two> vacancy of <Post> at <place> on deputation basis." (new job) or "Extension of last date / Corrigendum / Cancellation of vacancy notice No. N/YYYY for <post>" (update). Parent = vacancy notice number + post (e.g. "Vacancy Notice 47(R)/2026, Asst Manager/Executive PRS Secunderabad"). Notice number is also in the PDF filename (VC 45 of 2026.pdf = notice 45/2026). Results: "Provisional <Nth> Select List for <post>" / "Provisional Result for <post> 2023".

## Hold / pass rules for the sorter
- HOLD: anything in Gazetted / Non_Gazetted (deputation), incl. their extensions/corrigenda; "from Ex-Servicemen" or "Retired Railway officer" engagements; Project Consultant / Consultant/Security; Project Assistant/Officer contract engagements (pending BatLee); ICC, contact details, old ASE 2019 panels.
- PASS: Software_Professionals select lists and results if new; any non-deputation, non-contract open recruitment that appears.
- Hindi twins: already excluded by regex.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Seventh List of Selected Asst Software Engineers (ASE) 2023 | Result | ASE 2023 | Pass (old) |
| Provisional Seventh Select List for Executive (Personnel Admin HRD) | Result | Executive HRD 2023 | Pass (old) |
| Provisional Result for Junior Civil Engineer 2023 | Result | JCE 2023 | Pass (old) |
| One vacancy of Director (Operation) at New Delhi on deputation basis | New Job | Director (Operation) | Hold (deputation) |
| One vacancy of Manager/Dy. Manager (Civil), deputation | New Job | VN 18-R/2025 | Hold |
| Last date extension of Vacancy Notice 47(R)/2026, Asst Manager/Executive (PRS) Secunderabad | Update | VN 47/2026 | Hold (deputation) |
| Cancellation of Vacancy Notice 8(R)/2024, AM/Executive (PRS) Chennai | Update | VN 8/2024 | Hold |
| One vacancy of Project Assistant in Data Centre at CRIS New Delhi | New Job | VC 45/2026 | Hold (contract) |
| One vacancy of Project Assistant in Personnel Group | New Job | VC 34/2026 | Hold (contract) |
| Four vacancy of Project Assistant in Administration from Ex-Service men | New Job | VC 27 | Hold (ESM only) |
| One vacancy of Project Officer in HRMS Group at CRIS | New Job | VC 44/2026 | Hold (contract) |
| Two vacancy of Project Officer in Electrical group | New Job | VC 14/2026 | Hold (contract) |
| Corrigendum, engagement of Retired Railway officer as Project Officer | Update | VN 29/2025 (R) 20/2026 | Hold (retired only) |
| One vacancy of Project Consultant in FOIS Group | New Job | VC 43/2024 | Hold (consultant) |
| Internal Complaints Committee for CRIS | Noise | - | Hold |

## Proposed config
No change. Current source stays as is:
```json
{"id":"cris","url":"https://www.cris.org.in/loadpage?page=indexcareer","include":"cris[.]org[.]in/PDF/","exclude":"[ऀ-ॿ]|compassionate|qualified|roll no|unique id","minTitle":20,"limit":1000}
```
Note: minTitle 20 removes nothing important. limit 1000 is above the 371 present, so new rows are not cut.

## Uncertain
- Whether BatLee wants contract Project Assistant/Officer posts (the only "open to all" posts CRIS has) passed. They are fixed-term engagements, not regular govt jobs.
- No dates on the page, so posting speed vs limit not measurable; nothing indicates a lag.

## BatLee's corrections
- none yet

## Repairs
- none
