# ITBP Recruitment (recruitment.itbpolice.nic.in)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (works as it is)

## BATCH SUMMARY BLOCK
SITE: ITBP Recruitment (itbp + itbp-results) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (new notice 362.pdf, the 02-10-2026 sportsperson corrigendum, is not yet in the seen file but is caught at the next scan; admit cards are login-only, no public list)
ASK BATLEE: none (note for sorter: 3 text-only rows have no PDF, their link is the news page, title is cut at about 110 characters)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Notices (news), 87 rows, newest first | https://recruitment.itbpolice.nic.in/statics/news | free fetch, https | FREE-OK (4 of 4 runs, 40 items each) |
| Results, 40 rows | https://recruitment.itbpolice.nic.in/statics/results | free fetch, https | FREE-OK (4 of 4 runs, 39 items each) |
| Home page | https://recruitment.itbpolice.nic.in/ | free 200 | shows only the latest 4 PDFs, no need |
| http version | http://recruitment.itbpolice.nic.in/statics/news | answers 400 | do NOT use http |
| www.itbpolice.nic.in (main force site) | https://www.itbpolice.nic.in/ | no answer (timeout/000) from this PC | not checked, not needed |

Other menu pages (faqs, government-orders, howtoregister, locations, medical, payscale, refundpolicy, scheme) are info only. Admit card links (rect/OpenAdmitCard..., digialm login) are login portals, nothing to scan.

## ScrapFly
Not needed. Free fetch OK, 0 credits. PDFs (noticeboards/downloadpdf/NNN.pdf) are plain links on the same host.

## What the scanner catches vs misses
- Catches: every row of both tables (title cell 2, PDF link inside the row). 40 of 87 news rows and 39 of 40 results rows, newest first.
- Posting speed: ITBP posts roughly 1 to 3 notices a week (dates seen: 03-10, 02-10, 28-09, 28-09, 12-08, 09-08, 24-07). Limit 40 is far more than needed, no flood risk.
- Link stability: PDF links are numeric ids (361.pdf, 362.pdf...) that only grow, stable. No flood seen on 4 repeated runs; item counts identical.
- Rows with no PDF (text-only notices, e.g. "Candidates are hereby informed that, for the prompt resolution...", the compassionate ground shortlist, the Inspector (Hindi Translator) admit card notice): the scanner records them with the news page URL as link (3 in the current 40). They are deduplicated by title so they alert once; the sorter must open the news page to read them. Titles on the site are cut with "..." after about 110 characters (also on the PDF rows), so full text needs the PDF.
- Table date column (dd-mm-yyyy) is not carried by the scanner; not needed.
- Results page also holds old 2021-2023 rows; already baselined.

## Label pattern
Title is ALL CAPS (or mixed case) free text, no "Type:" prefix, no advert number. Pattern: "<TYPE WORDS> ... <POST NAME> ... <YEAR>".
- New job: "ADVERTISEMENT OF RECRUITMENT FOR THE POST OF <POST>- <YEAR>", "RECRUITMENT FOR/TO THE POST OF <POST> IN ITBP-<YEAR>", "DETAILED ADVERTISEMENT ... <POST>".
- Update: starts with "CORRIGENDUM", or contains "(CORRIGENDUM)", "Amendment", "Important Update: Additional vacancies added", "Notice for Amendment".
- Result (results page and sometimes news page): "RESULT OF ...", "ROLL NUMBERS OF FINALLY SELECTED CANDIDATES ...", "FORCE ALLOCATION ...", "SHORTLISTED CANDIDATE ...".
PARENT = post name + year, e.g. "Head Constable (Motor Mechanic) 2026", "Constable (GD) Sportsperson 2025/2026", "Assistant Commandant (Engineer) 2026", "MOSB 2025 (Medical Officers)". Sorter should match corrigenda to the job by post name + year (no advert number is given; the PDF itself may carry one).
Note: the 2026 sportsperson jobs are titled 2024 / 2025 / 2026 in different notices (361 "Meritorious Sportspersons ... Constable (GD)", 362 corrigendum "Constable (GD) Sportsperson 2025", older 329 "Constable/GD under Sports Quota-2024"): same family, check the PDF.

## Hold / pass rules for the sorter
HOLD:
- Compassionate ground recruitment shortlists / calling lists ("LIST OF CANDIDATES WHO ARE SHORTLISTED FOR COMPASSIONATE GROUND RECRUITMENT ..."): internal dependants quota, not an open job
- LDCE / departmental ("AC/GD LDCE", "(DE/LDE)", "LDE"), deputation posts (e.g. "Deputy Judge Attorney General (Deputy Commandant)", "Specialist Medical Officer (DC)" if by deputation), promotion
- General helpdesk / process notices ("for the prompt resolution of any issue...", "No Request/representation for change of centre ... shall be entertained", "Process of Written Examination/CBT ... are under active..." status notes), attestation / appendix forms ("Attestation Form for MOSB"), allotment of candidates to a battalion ("Candidate who have allotted 51 BN ...")
- Force allocation of UPSC CAPF (AC) candidates, MST/RME of CAPF (AC), PST/PET change of centre for UPSC CAPF: belongs to UPSC CAPF cycle (HOLD here, UPSC source is the master)
- Old-year final selected "roll number" lists for 2022 recruitments if they ever re-appear (already baselined)
- Hindi duplicates, tenders, RTI
PASS:
- New advertisements (including ones reserving ESM seats, sports quota, SSF/ITBPF posts)
- Corrigenda, amendments, additional vacancies, date extensions, cancellations
- Results, shortlists for open jobs (e.g. "Shortlisted Candidate of CT/GD (Sportsperson)"), final selected roll-number lists, reserve lists (MOSB), CBT/PET/PST schedules of current cycle, admit card notices for open posts (e.g. Inspector (Hindi Translator))

## Sample links (audit day 2026-10-04)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Detailed Advertisement for Recruitment of Meritorious Sportspersons to the post of Constable (GD)... (361.pdf, 03-10-2026) | New Job | Constable (GD) Sportspersons | Pass |
| Corrigendum regarding recruitment to Constable (GD) Sportsperson 2025 - amendment... (362.pdf, 02-10-2026) | Update | Constable (GD) Sportsperson 2025 | Pass |
| Advertisement of Recruitment for Head Constable (Motor Mechanic)-2026 (360.pdf) | New Job | HC (Motor Mechanic) 2026 | Pass |
| Advertisement of Recruitment for Head Constable (Education and Stress Counsellor)-2026 (359.pdf) | New Job | HC (Education & Stress Counsellor) 2026 | Pass |
| Candidates are hereby informed that, for the prompt resolution of any issue... (no PDF) | Noise | helpdesk | Hold |
| Recruitment to the post of Medical Officers (MOSB-2025) (Assistant Commandant)/Specialist MO (Deputy... (357.pdf) | New Job | MOSB 2025 | Pass |
| Force Allocation of 515 finally selected candidates of CAPFs (ACs) Exam-2024 (356.pdf) | Result (UPSC CAPF) | CAPF AC 2024 | Hold (UPSC master) |
| List of candidates shortlisted for compassionate ground recruitment test-2026 (1st phase) (no PDF) | Noise | compassionate ground | Hold |
| Process of Written Examination/CBT of various posts for year 2023 and 2024 are under active... (353.pdf) | Update (status) | ITBP 2023/2024 posts | Hold (status note) unless it carries dates |
| MST/RME of Candidates of UPSC CAPF (ACs) Examination-2025 (351.pdf) | Update | CAPF AC 2025 | Hold (UPSC master) |
| Recruitment for the post of Assistant Commandant (Engineer) in ITBP-2026 (350.pdf) | New Job | AC (Engineer) 2026 | Pass |
| Recruitment for Constable (Barber) and Constable (Washerman)-2025 in SSF (348.pdf) | New Job | Constable (Barber/Washerman) SSF 2025 | Pass |
| Advertisement for the post of Deputy Judge Attorney General (Deputy Commandant)-2025 (344.pdf) | New Job (likely deputation) | DJAG 2025 | Hold, check PDF |
| For downloading Admit Card for the post of Inspector (Hindi Translator)... (no PDF) | Admit Card | Inspector (Hindi Translator) 2024 | Pass |
| Corrigendum for vacancies for the post of Inspector (Hindi Translator)-2024 (330.pdf) | Update | Inspector (Hindi Translator) 2024 | Pass |
| Result of Paper-I, II and III in r/o ITBP candidates, AC/GD LDCE-2024 and 2025 (339.pdf, results) | Result (LDCE) | AC/GD LDCE | Hold |
| Result of MOSB-2024 (335.pdf, results) | Result | MOSB 2024 | Pass |
| Shortlisted Candidate of CT/GD (Sportsperson) Recruitment-2024 in ITBP (343.pdf, results) | Result/Shortlist | Constable (GD) Sportsperson 2024 | Pass |
| Force Allocation from Reserve List of Medical Officers (AC) through MOSB 2024 (349.pdf, results) | Result | MOSB 2024 | Pass |

## Proposed config
No change. Current sources (as in sources.json) are correct:
```json
[
 {"id":"itbp","type":"html","url":"https://recruitment.itbpolice.nic.in/statics/news","rowSelector":"table tr","rowTitle":"td:nth-child(2)","rowLink":"a[href$='.pdf']","minTitle":15,"limit":40},
 {"id":"itbp-results","type":"html","url":"https://recruitment.itbpolice.nic.in/statics/results","rowSelector":"table tr","rowTitle":"td:nth-child(2)","rowLink":"a[href$='.pdf']","minTitle":10,"limit":40}
]
```
Optional (not proposed): timeoutMs 15000 (site answered fast on every run). Keep https (http returns 400).

## Uncertain points
- The site shows only the first ~110 characters of each title ("..."), so exact post lists and advert details need the PDF.
- Text-only rows (no PDF) cannot be read in full from the page; link is the news page. They alert once by title.
- www.itbpolice.nic.in (main site) did not answer from this PC, so it was not checked; UPSC and CRPF sources already cover CAPF exams.

## BatLee's corrections
- none yet

## Repairs
- none yet
