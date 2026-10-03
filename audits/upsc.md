# UPSC (Union Public Service Commission, www.upsc.gov.in)
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (audit written; sources.json NOT changed yet, waiting for BatLee's approval)

## Summary
- Everything loads FREE from this PC (plain fetch, 25-160 ms, 10 of 10 repeat fetches identical). ScrapFly: 0 credits. No render option needed. The "enable JavaScript" text in the HTML is only a <noscript> warning; all lists are in the server HTML.
- The current source (homepage, include "whats-new/|[.]pdf", limit 60) returns 45 links. They are EXACTLY the same 45 title+link pairs as https://www.upsc.gov.in/whats-new (0 differences both ways). So the homepage and the What's New page are equivalent. Switching the URL to /whats-new would not re-catch anything.
- What's New is NOT complete. It is a "latest stage per post/exam" board (rows are relabelled in place, no dates, no paging). Events that UPSC publishes on its other pages and that never reach What's New (examples found, not on the page and never in state/seen-india.json):
  - Recruitment Test answer key "323 vacancies, Personal Assistant, EPFO" (Advt 51-2024 Special), uploaded 29/09/2026, only on /recruitment/recruitment-test/answer-keys.
  - Recruitment Test "Result Details" (reserve list) "03 posts Administrative Officer, GSI" (Advt 13-2023), 08/09/2026.
  - 13 of the 16 recruitment final results of the last 3 weeks (18/09 to 30/09): Deputy Director (Planning/Statistics) GNCTD, Asst Professor (History) A&N, 4 x Senior Scientific Assistant (MoD), Operations Officer DGCA (121 posts) and more. What's New carried only 3 of the 16.
  - New documents added INSIDE an existing row. The What's New row "Rectt. Test: 09 posts of Scientist-B ... " links to a /content/ page whose document list grows (it now holds the 01/10/2026 e-Admit Card notice for the 11 Oct test, a 29/09 time table, a corrigendum). The row title and link did not change, so the seen check cannot notice it. The same documents appear as new PDFs on /recruitment/recruitment-test/notices (dated 01/10/2026).
  - Recruitment interview schedules (15 in 46 days) and applicants' lists (91 rows). These are candidate-stage items, proposed HOLD, so not proposed as sources.
- Of BatLee's six pages, only What's New carries a changing list of notices that is worth watching. Recruitment Advertisements shows only the newest ONE advert (backup, duplicate of a What's New row). Exam Notifications and Active Exams are duplicates or static name lists. E-Admit Cards and Written Results (with the trailing hyphen) are static link hubs (see table).

## Pages watched (today) and tested
All tested with the scanner's own fetchItems (free fetch). URL variants: ONLY https://www.upsc.gov.in works. https://upsc.gov.in/... answers 307 to the HOMEPAGE (a failed page, as BatLee said). http://www.upsc.gov.in/... redirects to https www (fine). Trailing slash after /whats-new also works.

| Page | URL | Fetch method | Verdict | Content |
|---|---|---|---|---|
| What's New (MAIN) | https://www.upsc.gov.in/whats-new | free, 45 KB | FREE-OK | 45 rows in one page, no paging, no dates. 3 PDF links at top + 42 page-links |
| Homepage (current source) | https://www.upsc.gov.in/ | free, 100 KB | FREE-OK | same 45 rows plus 6 "Important notice" /content/ pages (general info) |
| Recruitment Advertisements | https://www.upsc.gov.in/recruitment/recruitment-advertisement | free | FREE-OK, backup only | ONE row: newest advert (No.12-2026, PDF link, size only; the title is plain text next to the link). Older adverts on /archives- |
| Active Examinations | https://www.upsc.gov.in/examinations/active-exams | free | FREE-OK, not useful | 20 exam names linking to per-exam pages (no events, no dates) |
| Exam Notification | https://www.upsc.gov.in/exams-related-info/exam-notification | free | FREE-OK, duplicate | 2 current tables (ESE Prelim 2027, SO/Steno LDCE) with notification date, last date, PDF. Same as the What's New "Exam Notification:" rows but with a direct PDF link |
| E-Admit Cards | https://www.upsc.gov.in/e-admit-cards | free | FREE-OK, static | 3 links to upsconline portals, never changes. The portal itself (upsconline.nic.in) answers HTTP 401/301 to scripts: not watchable |
| Written Results (hub, trailing hyphen) | https://www.upsc.gov.in/written-results- | free | FREE-OK, static | 2 links to the two result pages below |
| Written Result (exams) | https://www.upsc.gov.in/exams-related-info/written-result | free | FREE-OK, poor | 1 row (Steno 2020 roll list, 15/09). Does NOT even carry the CMS 2026 / CAPF 2026 written results that What's New has |
| Written Result (recruitment) | https://www.upsc.gov.in/recruitment/recruitment-test/results/written-results | free | FREE-OK, empty | no rows |
| RT Notices | https://www.upsc.gov.in/recruitment/recruitment-test/notices | free | FREE-OK, PROPOSE | table: advt no, vacancy no, post, PDF, upload date. 25 rows (06/02 to 01/10/2026) |
| RT Answer Keys | https://www.upsc.gov.in/recruitment/recruitment-test/answer-keys | free | FREE-OK, PROPOSE | same table, 1 row today (can be empty) |
| RT Result Details | https://www.upsc.gov.in/recruitment/recruitment-test/result-details | free | FREE-OK, PROPOSE | same table, 1 row today (can be empty) |
| RT Provisional Answer Keys | https://www.upsc.gov.in/recruitment/recruitment-test/provisional-answer-keys | free | FREE-OK, duplicate | 3 rows, same as What's New "Provisional Answer Key:" rows |
| Recruitment Final Results | https://www.upsc.gov.in/recruitment/status-recruitment-cases-advertisementwise/results/final-result | free | FREE-OK, PROPOSE | same table, 16 rows (08/09 to 30/09/2026) |
| Recruitment Interview Details | .../status-recruitment-cases-advertisementwise/interview-detail | free | FREE-OK, NOT proposed | 15 rows (14/08 to 29/09). Proposed hold |
| Recruitment Notices | .../status-recruitment-cases-advertisementwise/notices | free | FREE-OK, NOT proposed | 11 rows, postponement/cancellation notices; the cancellation also sits at the top of What's New as a PDF |
| Applicants' Lists | .../status-recruitment-cases-advertisementwise/applicant-list | free | FREE-OK, NOT proposed | 91 rows since 2023 = noise |
| Per-exam pages (e.g. CDS II 2026) | https://www.upsc.gov.in/examinations/<exam name> | free | FREE-OK, NOT proposed | every document with its date (e-Admit Card 03/09, Time Table 10/08, Question Paper 14/09) but 20 pages would be needed. What's New covers the same events |

PDFs download free: yes. Tested 4 PDFs (advert 12-2026, ESE 2027 notification, PA EPFO answer key, a final result): all HTTP 200 application/pdf, 0.3 to 14.5 MB, same host as the pages. Caveat: tested from this PC only (runner "india").

## ScrapFly
Not needed. Group FREE. Credits per scan: 0 | Monthly estimate: 0. SCRAPFLY_KEY was not available in this shell and was not needed.

## Posting speed, limits, paging
- No paging anywhere. What's New has 45 rows today; the scanner limit is 60, so the whole page is read every scan. Headroom is 15 rows. Seen history: 63 distinct rows in 8 days (41 at baseline on 25/09, then +2 on 26/09, +14 on 29/09, +6 on 30/09). A burst of 14 new rows in ONE scan already happened (29/09: 12 "Rectt. Test" rows relabelled together). Suggest limit 100 for safety (free).
- The list rewrites itself: a row's stage label changes and the row replaces the old one ("Addendum Notice: X" -> "Rectt. Test: X"; "Rectt. Test: X" -> "Notice: X" + "Provisional Answer Key: X"). 18 of the 41 baseline rows were gone 8 days later. A stage that appears and is replaced between two scans would be lost; at 2+ scans a day this is unlikely.
- Advertisements: 14 in the last 6 months (Advt 01 to 12-2026 plus Special 51 and 52), about 2 a month.
- Recruitment final results: about 16 in 3 weeks. Interview schedules: 15 in 6 weeks. Answer keys / result details: 1-3 a month each.

## Link stability (flood check)
- Same 45 links on 10 fetches 1.5 s apart: identical. Same links from homepage and /whats-new. Links contain spaces in the raw HTML ("whats-new/32 Posts of ..."); the scanner turns them into %20 and the seen check normalises encoded vs raw, so there is no flood from that.
- Link shape: whats-new/<Parent>/<Stage>. A stage change creates a new link (new catch), which is wanted. A relabel back and forth (Addendum Notice / Rectt. Test) re-alerts: that caused the 14-row burst on 29/09. Expect similar bursts of up to ~13 whenever UPSC touches a 12-post batch (current batches: 12 posts of Advt 05-2026 MoES/MSME, 3 posts of Advt 08/13). FLOOD_LIMIT is 15; a flag is only a warning to the sorter.
- Table pages (proposed): one row = one PDF; links are stable. Several rows share one file; Drupal adds _0, _1 ... _N to the file name per row (stable once uploaded). A batch notice gives up to 13 rows with the same PDF; the sorter should group by PDF.
- Not seen by the seen check: a new PDF added inside an existing What's New row's page (see Summary). Only the RT Notices page exposes it.

## Duplicates between pages (same notice, different link/title)
- Homepage = What's New (identical, do not watch both).
- What's New "Advertisement No.12 - 2026" (page link) = Advertisements page (PDF link). If both are watched the same advert is caught twice.
- What's New "Exam Notification: ..." = Exam Notification page. "Provisional Answer Key: ..." = RT Provisional Answer Keys page. "Notice: N Posts ..." = RT Notices rows (same event, different link). 3 What's New "Final Result:" rows are also in the Final Results page (different link).
- The top PDF "Notice regarding change in recruitment process for six (06) posts ... Advt No. 13-2025" = the 6 cancellation rows on Recruitment Notices (same PDF NoticeCancellation-06-Posts-Advt-13-25-Engl-200826).
- Hindi pages (/hi/...) are separate copies and are not watched.

## Label pattern
What's New row title = "<Stage>: <Parent>" and link = whats-new/<Parent>/<Stage>. Two kinds of Parent:
1. Exam: "Combined Medical Services Examination, 2026", "Engineering Services (Main) Examination, 2026", "Central Armed Police Forces (ACs) Examination, 2026", "CISF AC(EXE) LDCE-2026", "Indian Forest Service (Main) Examination, 2026". Clean name = exactly as printed; keep the year (the sorter matches it to the Sarkari24 post).
2. Recruitment post group: "<NN> Posts of <Post>, <Organisation>" e.g. "32 Posts of Accounts Officer, Administration of Union Territory of Ladakh", "74 Posts of Assistant Provident Fund Commissioner, EPFO". The advert number is NOT in the What's New title. It is in the table pages ("Advt 13 - 2025"), in the PDF name (...Advt-13-25...), and in the text of the top PDFs ("vide Advt. No. 11 - 2026"). The proposed table sources add it to the title as "(Advt NN - YYYY)".
Stage vocabulary seen: Advertisement No.NN - YYYY (New Job), Exam Notification (New Job), Notice, Addendum Notice, Rectt. Test (recruitment test / e-Admit Card hub page for a post; links to a /content/ page that lists time table, addendum, e-AC notice PDFs), Provisional Answer Key, Final Result, Written Result, Written Result (with name), Marks of Recommended Candidates, Marks of Recommended Candidates (Reserve List), Interview Schedule, Examination Time Table, and (per BatLee's example, not on the page today because CDS II / NDA II cards went out on 03/09 and rolled off) "e - Admit Card: <exam>".
The 3 top rows are free-text PDF titles (no "<Stage>: " prefix): "Common mistakes ...", "Notice regarding change in recruitment process for six (06) posts advertised vide Advt. No. 13-2025", "Clarification for the post of ... vide Advt. No. 11 - 2026". Parent = the advert number in the text.
PDF file names carry the upload date as ddmmyy at the end: AdvtNo-12-2026-Engl-250926_0.pdf = advert 12/2026 of 25/09/2026; Notif-ESEP-2027-Engl-160926.pdf = notified 16/09/2026; RT-AnsKey-323-PA-EPFO-290926.pdf = 29/09/2026. Prefixes: AdvtNo/Advt = advertisement ("Special" in the name = Special Advt 51/52, e.g. EPFO), Notif = exam notification, Intv = interview, Result / ResultReserveList / AddnlFR = result, RT-AnsKey / RT-...ProvAnsKey = answer key, RT-eAC / eACNotice = e-Admit Card notice, TT = time table, QPRep = question-paper representation, NoticeCancellation = cancellation, Pstpntmnt = postponement, WR-... = written result roll list. The "_0, _1, _N" suffix is only a duplicate-file counter. ("FScrty" notices: meaning not verified, open the PDF.)
Proposed table sources (RT / final-result pages): row = Advt no + vacancy no + post + PDF + upload date. Title built as "<Stage>: <post> (Advt NN - YYYY)", for example "Final Result: 121 Posts of Operations Officer in DGCA (Advt 06 - 2025)". Link = the PDF.

## Hold rules (site-specific)
Standing rules apply (ex-servicemen-only, retired-only, deputation, departmental/LDCE, consultant under 5, tender, Hindi duplicates, general info). Site-specific, my drafts (BatLee to confirm the ones marked ASK):
- HOLD: anything with "LDCE" in the parent: Combined Section Officers' / Stenographers' (Grade 'B') LDCE, CISF AC(EXE) LDCE (internal departmental exams): notification, results, marks, answer keys, interview.
- HOLD: "Marks of Recommended Candidates" and "(Reserve List)" (marks lists, general info), "Written Result (with name)" when the plain "Written Result" of the same exam is also posted (same event twice), "Examination Time Table", "Common mistakes done while filling OMR sheet", press notes, annual calendar, advisories ("e-affidavit", "Face Authentication", "Advisory to recommended candidates"), question-paper representation notices (QPRep).
- ASK: "Interview Schedule: <exam>" for the current cycle (CMS 2026, ESE Main 2026) = Update PASS in my suggestion; interview schedules of older exams = HOLD. Recruitment-by-post interview schedules, applicants' lists, scrutiny lists = HOLD (not scanned).
- PASS (never hold): Advertisement No.NN (open direct-recruitment advert; if an advert lists ONLY deputation/lateral posts it is HOLD under the standing rule, mixed adverts PASS), Exam Notification for NDA/NA, CDS, CSE (Prelim/Main), IFS, ESE, CMS, CAPF (ACs), IES/ISS, Combined Geo-Scientist; e-Admit Card / "Rectt. Test" / RT e-AC notices; Written Result and Final Result (exam or post); Provisional/Final Answer Key; corrigendum, addendum, postponement, cancellation or change-in-process notices; reserve-list results.
- One-off direct recruitment (by advertisement number, "NN Posts of ... , <Ministry>") is normal PASS. The big combined exams (NDA/CDS/CSE/ESE/CMS/IFS/CAPF/Geo-Scientist/EPFO special) are normal PASS.
- Script keyword filter suggestion (unambiguous only, needs OK): drop titles containing "LDCE" and titles starting with "Common mistakes". Everything else is left to the sorter/editorial rules.

## Proposed config change (APPLIED 2026-10-04: items 1, 2, 3 and 4)
1. KEEP source "upsc" as the main What's New source. Change only: url -> https://www.upsc.gov.in/whats-new and limit 60 -> 100. include stays "whats-new/|[.]pdf". Same 45 links, so nothing is re-caught (the fingerprint change only triggers the silent re-baseline; "rebaseline": true stays). If BatLee prefers not to touch it, keeping the homepage is equally correct.
2. ADD "upsc-final-result": html, url .../recruitment/status-recruitment-cases-advertisementwise/results/final-result, rowSelector "tbody tr", rowTitle "self", titleReplace ["^([0-9]+ - [0-9]{4}(?: [(]Special[)])?) [0-9]+ (.*)$", "Final Result: $2 (Advt $1)"], minTitle 10, limit 60. Tested: 16 rows.
3. ADD "upsc-rt-answer-keys" (same pattern, page .../recruitment/recruitment-test/answer-keys, prefix "Answer Key", allowEmpty true) and "upsc-rt-result-details" (page .../recruitment/recruitment-test/result-details, prefix "Result Details", allowEmpty true). Tested: 1 row each. allowEmpty because UPSC empties these tables between postings.
4. OPTIONAL ADD "upsc-rt-notices" (page .../recruitment/recruitment-test/notices, prefix "Notice"). Catches new documents added inside an existing post (e-Admit Card notice, addendum, time table). 25 rows, up to ~13 rows at once for one batch notice; overlaps with the What's New "Notice:" rows (same event may be caught twice with different links).
5. NOT proposed: Advertisements page (duplicate, shows only 1 row), Exam Notification, Active Exams, E-Admit Cards, Written Results hub (static), interview / applicants / status notices.
Expected cost: all FREE, 4 small extra requests per scan, 0 credits.

## Sample links (audit day, 2026-10-04)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Provisional Answer Key: 32 Posts of Accounts Officer, Administration of Union Territory of Ladakh | Answer Key | 32 Posts of Accounts Officer, UT Ladakh (Advt 13/2025) | PASS |
| Notice: 32 Posts of Accounts Officer, Administration of Union Territory of Ladakh (PDF RT-QPRepNotice, 30/09) | Update (question-paper representation) | same | HOLD (ASK) |
| Final Result: 363 Posts of Principal in Education Department, GNCTD | Result | 363 Posts of Principal, GNCTD (Advt 07/2021) | PASS |
| Rectt. Test: 09 posts of Scientist-B (Instrumentation) in Ministry of Earth Sciences | Admit Card (e-AC, time table, addendum on its page) | 09 posts Scientist-B (Instrumentation), MoES (Advt 05/2026) | PASS |
| Rectt. Test: 04 posts of Assistant Director Grade-II (IEDS) (Food) in Ministry of MSME | Admit Card | 04 posts AD Gr-II (IEDS) (Food), MSME (Advt 05/2026) | PASS |
| Rectt. Test: 06 Posts Deputy Central Intelligence Officer (DCIO) (Technical), Ministry of Home Affairs | Admit Card | 06 Posts DCIO (Technical), MHA (Advt 06/2026) | PASS |
| Interview Schedule: Combined Medical Services Examination, 2026 | Update | CMS 2026 | PASS (ASK, current cycle) |
| Interview Schedule: Engineering Services (Main) Examination, 2026 | Update | ESE (Main) 2026 | PASS (ASK, current cycle) |
| Advertisement No.12 - 2026 | New Job | Advt 12/2026 | PASS (check deputation-only) |
| Advertisement No.11 - 2026 | New Job | Advt 11/2026 | PASS (check deputation-only) |
| Notice: 74 Posts of Assistant Provident Fund Commissioner, EPFO | Update | 74 Posts APFC, EPFO (Advt 52/2025 Special) | PASS (open PDF) |
| Notice: 01 Post of Data Processing Assistant, Ministry of Defence | Update | 01 Post DPA, MoD (Advt 06/2025) | PASS (open PDF) |
| Examination Time Table: Indian Forest Service (Main) Examination, 2026 | Noise (time table) | IFS (Main) 2026 | HOLD |
| Exam Notification: Engineering Services (Preliminary) Examination, 2027 | New Job | ESE (Prelim) 2027 (last date 06/10/2026) | PASS |
| Exam Notification: Combined Section Officers (Grade-'B') LDCE - 2026 and Combined Stenographers ... LDCE | New Job (departmental) | SO/Steno LDCE 2026 | HOLD (LDCE) |
| Written Result: Combined Medical Services Examination, 2026 | Result | CMS 2026 | PASS |
| Written Result (with name): Combined Medical Services Examination, 2026 | Result (duplicate file) | CMS 2026 | HOLD as duplicate (keep one) |
| Written Result (with name): Central Armed Police Forces (ACs) Examination, 2026 | Result | CAPF (ACs) 2026 | PASS |
| Marks of Recommended Candidates (Reserve List): Central Armed Police Forces (ACs) Examination, 2024 | Noise (marks list) | CAPF (ACs) 2024 | HOLD |
| Final Result: CISF AC(EXE) LDCE-2026 | Result (departmental) | CISF AC(EXE) LDCE 2026 | HOLD (LDCE) |
| Common mistakes done while filling OMR Sheet/Scannable Attendance List | Noise | n/a | HOLD |
| Notice regarding change in recruitment process for six (06) posts advertised vide Advt. No. 13-2025 | Update (cancellation / change) | Advt 13/2025 (6 legal posts) | PASS |
| Clarification for the post of Assistant Public Prosecutor in Delhi, vide Advt. No. 11 - 2026 | Update | Advt 11/2026, APP Delhi | PASS |
| (missed today) Answer Key: 323 vacancies for the post of Personal Assistant in EPFO (Advt 51 - 2024 (Special)) | Answer Key | 323 PA, EPFO | PASS |
| (missed today) Final Result: 121 Posts of Operations Officer in DGCA (Advt 06 - 2025) | Result | 121 Posts Operations Officer, DGCA | PASS |

## BatLee's corrections
- 2026-10-04: BatLee confirmed the six pages work (only with www).
- 2026-10-04 APPROVED and applied: items 1, 2, 3 and 4 (upsc -> /whats-new with limit 100; upsc-final-result, upsc-rt-answer-keys, upsc-rt-result-details, upsc-rt-notices). All FREE. UPSC test scan: 5 of 5 OK, 0 caught, nothing swallowed by the re-baseline.
- No keyword filter in the script. The hold rules above are for the SORTER only.
- Interview schedules: PASS for current-cycle exams (CMS 2026, ESE Main 2026); HOLD for older exams and per-post interviews.
- QPRep notices (question-paper representation, file prefix QPRep): HOLD.
- "Rectt. Test" rows are admit-card events (hub page with the e-Admit Card notice, time table, addendum): PASS as Admit Card.
- "FScrty" notice PDFs: open the PDF and let the sorter decide.
- SORTER: upsc-rt-notices ("Notice: ...") can duplicate the What's New "Notice:" rows of the same event (different link and title). Merge them into one item.

## Repairs
- (none)
