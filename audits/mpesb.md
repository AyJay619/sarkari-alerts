# MPESB (MP Employees Selection Board, esb.mp.gov.in)
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (batch audit; sources.json NOT changed)

## BATCH SUMMARY BLOCK
SITE: MPESB (MP Employees Selection Board) | VERDICT: FIX
PROPOSED: 1) mpesb: remove "render":true (plain fetch gives the same 11 links in 0.1s vs 1.4s with Chromium); 2) mpesb include -> "[.](pdf|jpe?g|png)|default_tac|examsList" (today a .jpg "Form Reopen and Exam Date Postponed Notice" is dropped); 3) ADD mpesb-notices https://esb.mp.gov.in/advertisement/Important_message_candidate.htm (31 notices, newest first, include "[.](pdf|jpe?g|png)|default_tac", limit 40, rebaseline); 4) ADD mpesb-answerkeys https://esb.mp.gov.in/Question%20Paper%20and%20Candidate%20Responses/Question_Objection.asp (38 rows, include "cbtexam|cbexams", limit 40, allowEmpty, rebaseline)
MISSING TODAY: the .jpg Group-3 postponement notice (01/10/2026) and every older/ non-homepage notice; answer keys / objection links; no results page found on the free site (results are not published on esb.mp.gov.in pages that list links)
ASK BATLEE: none (note: home page titles are generic, e.g. "Rulebook", "Exam Date Notice", so the sorter must open the PDF to get the parent exam)

## Pages watched and tested
All tested with the scanner's own fetchItems (free fetch). No ScrapFly needed: 0 credits. 5 of 5 repeats identical (HTTP 200, 10366 bytes home, 37081 bytes notices, ~0.1 s). https and http both work; www.esb.mp.gov.in gives 404 (use NO www). The site is old static HTML (windows-1252), no JavaScript needed; the "latest news" marquee on the home page is inside an HTML comment (inactive).

| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Home highlights (current source) | https://esb.mp.gov.in/home_n.html | free, no render | FREE-OK. ~12 current rows: online-form rows, notices, rulebooks, admit card. Newest events only |
| Home root | https://esb.mp.gov.in/ | free | FRAME only (loads home_n.html + leftmenu.html); fetching it gives 1 useless link. Do not use |
| Important Notices / Advertisement to Candidates | https://esb.mp.gov.in/advertisement/Important_message_candidate.htm | free | FREE-OK, PROPOSE. 31 notices (form date changes, exam date changes, caveat notices, fee refund, court case), newest first, PDF and JPG/JPEG |
| Question Objections / Response Sheet | https://esb.mp.gov.in/Question%20Paper%20and%20Candidate%20Responses/Question_Objection.asp | free | FREE-OK, PROPOSE. 38 rows, one per exam, each links to an external cbtexam.in / cbexams.com challenge portal (answer key / response sheet window). New exam = new row |
| Exams calendar | https://esb.mp.gov.in/Exams_Schedule/exams_schedule.htm | free | page loads, no links (image/table); not watchable |
| Tenders | https://esb.mp.gov.in/Tenders/tender.htm | free | 1 tender image; HOLD category, not proposed |
| Exam list portal | https://esb.mponline.gov.in/Portal/Examinations/Vyapam/examsList.aspx | free | loads (58 KB) but job list is not in the HTML (only profile-registration links). NOT useful. All "Online Form - ..." home rows point to this same URL |
| Other left-menu pages | Old question papers, statistics, RTI, Viniyam, officers, FAQ | not tested further | static / HOLD |

PDFs download free: yes. Tested 3 (retired officers PDF 57 KB, Exam Date Notice PDF 25 KB, a 873 KB JPG notice), all HTTP 200 on the same host. (HEAD requests answer 404 on this server; GET works. Not a problem for the scanner.)

## What the scanner catches vs misses
- Catches: home_n.html rows (11 of 12). Its include keeps only .pdf / default_tac / examsList.
- Misses: image notices (.jpg/.jpeg, MPESB posts many notices as scanned images, e.g. Group3_2026_ExamDate_changeNotice_01102026.jpg); anything that fell off the home page; answer-key / objection portal links.
- Same link, different titles: all "Online Form - ..." rows share one link (examsList.aspx). The seen check keys on title+link, so each new form row is caught as its own item (OK), but a re-worded or unchanged title with a new date would not re-fire. Minor.
- Posting speed: the home page shows only about 12 rows, mixed old and new (a row stays until editors remove it), so a burst of 12+ new rows in one scan interval could push one off. The Important Notices page (31 rows) is the safety net.
- Flood check: links are stable between fetches (5 of 5 identical). Case of path differs between pages (Advertisement/ vs advertisement/); the server is case-insensitive and the seen check does not lowercase, so the same notice seen through both pages may be caught twice. Harmless (sorter merges).
- Cosmetic: one title starts with a stray character ("?Form Reopen ...", windows-1252 byte). Harmless.

## Label pattern
Titles are English or Hindi free text, no fixed "<Type>: <Parent>" format.
- Home page job rows: "Online Form - <Exam name> Start Date:dd/mm/yyyy" (type = New Job / form open; parent = the exam name, e.g. "Police Constable (G.D.) Recruitment Test 2026"). "Online Form Reopen (Start From - dd/mm/yyyy)- <Exam>" = Update (reopening).
- "Test Admit Card - <Exam>" = Admit Card (parent = exam, e.g. "Group-2 Sub Group-4 Recruitment Test 2026").
- Generic titles ("Rulebook", "Exam Date Notice", "Notice", "Caveat Notice") carry NO parent in the title. The parent is in the file name: Group3_2026_..., Group2_SG4_2026_..., MSTET_PSTET_2026..., PCRT_2026_..., Steno_ASI_2026..., Nayab_Tehsildar_2026..., JAIL_VAN_TAC26. Rule: take the token before the year (PCRT = Police Constable Recruitment Test, PRT/Subedar_SI = Subedar and Sub-Inspector, Group2_SG4 = Group-2 Sub Group-4, Group3 = Sub Engineer and other posts, PSTST/PST = Primary School Teacher Selection Test, MSTET_PSTET = MP teacher eligibility tests). Date at the end of the file name is ddmmyyyy (the upload/notice date).
- Answer-key page: "<Exam name> Dated: dd/mm/yyyy" with the exam date; type = Answer Key / response sheet window.

## Hold / pass rules for the sorter
HOLD: "Requirement for retired senior officers" (retired-only, Parvekshak_form_13082026.pdf); tenders (Tenders/...jpg); Fee Refund Notice; Caveat Notice (court caveat, general info); Rulebook pages (rule book / "Rulebook Revised Page-01") unless BatLee wants them; "Nayab Tahsildar Departmental Recruitment Test" (departmental exam); Hindi duplicates (Hindi/h_...); Disclaimer / RTI / Viniyam / officer list / statistics / old question papers; profile registration links on the portal.
PASS: new "Online Form - ..." rows (open jobs, incl. ones reserving seats for ex-servicemen); Online Form Reopen; Form Date Change / Form Submission Date Extended; Exam Date Change / Postponed / Examination Related Notice; Test Admit Card; Physical Proficiency Test schedule; answer key / response sheet rows; Court Case form submission date notices (extension of application window); Transgender form reopen.
Uncertain: Rulebooks (exam pattern PDFs published at the same time as the form; proposed HOLD).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Requirement for retired senior officers | New Job (retired only) | Parvekshak (retired) | HOLD |
| Online Form Reopen (Start From - 13/10/2026) - Group-3 Sub Engineer and Other Post Combined Recruitment Test | Update (form reopen) | Group-3 Sub Engineer & other posts 2026 | PASS |
| Form Reopen and Exam Date Postponed Notice (.jpg, 01/10/2026) | Update | Group-3 2026 | PASS (missed today: .jpg) |
| Test Admit Card - Group-2 Sub Group-4 Recruitment Test 2026 | Admit Card | Group-2 SG-4 2026 | PASS |
| Exam Date Notice (23/09/2026) | Update | Group-2 SG-4 2026 | PASS |
| Online Form - Eligibility Test 2026 for Teachers (Primary and Secondary) | New Job | MP Primary/Middle School Teacher Eligibility Test 2026 | PASS |
| Notice for Application Form Date extension (18/09/2026) | Update | MSTET/PSTET 2026 | PASS |
| Online Form - Subedar (Stenographer) and ASI Recruitment Test, Police HQ | New Job | Subedar (Steno) and ASI 2026 | PASS |
| Physical Proficiency Test - Jail Prahari and Asst. Jail Superintendent | Update (PPT schedule) | Jail Prahari / Van Rakshak 2026 | PASS |
| Online Form - Nayab Tahsildar Departmental Recruitment Test 2026 | New Job (departmental) | Nayab Tahsildar 2026 | HOLD |
| Online Form - Police Constable (G.D.) Recruitment Test 2026 | New Job | Police Constable GD 2026 | PASS |
| Rulebook / Rulebook Revised Page-01 | Noise | PCRT 2026 etc. | HOLD |
| Fee Refund Notice (18/09/2026) | Noise | Group-3 / Group-2 SG-4 | HOLD |
| Exam Date Change Notice-2 (31/07/2026) | Update | Group-2 SG-1 2026 | PASS |
| Pre-Agriculture Test (PAT) 2026 Dated 11/05/2026 (cbtexam) | Answer Key | PAT 2026 | PASS |
| Group-5 Combined Recruitment Test 2026 Dated 24/04/2026 (cbtexam) | Answer Key | Group-5 2026 | PASS |
| E-Tender - Annual Maintenance of Air Conditioner | Noise | n/a | HOLD |

## Proposed config (sources.json, NOT applied)
```json
[
  { "id": "mpesb", "name": "MPESB (MP Employees Selection Board)", "runner": "india", "tier": "FREE", "level": "state", "type": "html",
    "url": "https://esb.mp.gov.in/home_n.html", "include": "[.](pdf|jpe?g|png)|default_tac|examsList", "minTitle": 12, "limit": 40, "timeoutMs": 15000 },
  { "id": "mpesb-notices", "name": "MPESB Important Notices", "runner": "india", "tier": "FREE", "level": "state", "type": "html",
    "url": "https://esb.mp.gov.in/advertisement/Important_message_candidate.htm", "include": "[.](pdf|jpe?g|png)|default_tac", "minTitle": 5, "limit": 40, "timeoutMs": 15000 },
  { "id": "mpesb-answerkeys", "name": "MPESB Answer Keys / Response Sheets", "runner": "india", "tier": "FREE", "level": "state", "type": "html",
    "url": "https://esb.mp.gov.in/Question%20Paper%20and%20Candidate%20Responses/Question_Objection.asp", "include": "cbtexam|cbexams", "minTitle": 12, "limit": 40, "allowEmpty": true, "timeoutMs": 15000 }
]
```
(Note: minTitle 5 on the notices page because titles are short, e.g. "Notice". Removing render re-baselines the home source once; the two new sources baseline on first run.)

## Uncertain
- No page with MPESB results or merit lists was found on esb.mp.gov.in (results are likely in the exam portal or individual exam pages not linked from the menu). Not checked further; I did not guess URLs.
- Exam list portal (mponline) is not scannable for free as plain HTML; not tried with render.
- The Question Objection page mixes old and new rows; exam date text is the only date.

## BatLee's corrections
- none yet

## Repairs
- none yet
