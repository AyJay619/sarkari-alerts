# SSC (Staff Selection Commission, main site ssc.gov.in)
Audited: 2026-10-03 | Group: FREE | Status: PROPOSED (audit written; sources.json NOT changed yet, waiting for BatLee's approval)

## Summary
- The current source ("ssc", notice-boards API) loads free and reliably: 13 of 13 test calls HTTP 200 in 0.15-0.3 s. ScrapFly is not needed (0 credits).
- It covers almost everything (new exam notices, corrigendum/addendum/cancellation, answer keys, tentative/final vacancy, admit card city/date notices, schedules).
- It MISSES most stage-wise Results (the "Results" list is a separate feed). That is the one real gap. 35 of 38 result rows posted since 1 June 2026 never appear on the notice board feed (CHSL FRTA shortlist, MTS/JE/Steno shortlists, Delhi Police PE&MT lists, typing/steno skill test results).
- The URL's limit=20 is ignored by the server: the notice-boards feed always returns 10 per page (see below).
- "Items without attachments (redirectUrl)": none exist. 290 notices checked (back to Sep 2025): 0 without an attachment, 0 with a redirectUrl. isAttachment=true/false/omitted all return the same 704 records. Nothing is being dropped by that filter.

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Notice Board (everything: new exam notices, corrigendum, addendum, cancellation, answer keys, vacancies, admit card/city notices, schedules, some results) | https://ssc.gov.in/api/general-website/portal/notice-boards?page=1&contentType=notice-boards&key=createdAt&order=DESC&isAttachment=true&language=english&attributes=id,headline,examId,contentType,redirectUrl,startDate,endDate,language,createdAt | free fetch (Node/curl), JSON, ~6 KB | FREE-OK. Server returns 10 rows per page whatever limit says. 704 records total |
| Results (stage-wise results, shortlists, final results) | https://ssc.gov.in/api/general-website/portal/records?page=1&limit=20&contentType=results&key=createdAt&order=DESC&isAttachment=true&language=english&attributes=id,headline,examId,examYear,contentType,startDate,endDate,language,createdAt | free fetch, JSON, 20 rows per page, 298 records, 8 of 8 calls OK in 0.2 s | FREE-OK. PROPOSED as a second source |
| Answer Keys | same /records endpoint, contentType=answer-key (76 records) | free fetch OK | Not needed: every answer key since June also appears on the notice board (14 of 14) |
| Tentative Vacancy | /records, contentType=tentative-vacancy (74 records) | free fetch OK | Not needed: the notice board carries these too (CGL 2026, CHT, ASO LDCE ... confirmed by title/date); a few revised-steno ones may differ only in headline |
| Admit Card | /records, contentType=admit-card (2 records, both from 2024) | free fetch OK | Dead feed. Admit-card / city notices are published on the notice board instead |
| Special Instructions (normalisation, debarment SOP, typing instructions) | /records, contentType=special-instructions (19) | free fetch OK | Not watched (general info = hold) |
| Homepage https://ssc.gov.in/ | Angular app (80 KB shell, no links in the HTML) | free fetch OK | JS-ONLY page, but it just calls the API above. Nothing to scrape |

URL variants: https://ssc.gov.in works. https://www.ssc.gov.in and http://ssc.gov.in and ssc.nic.in do NOT work from this PC (no connection/timeout), so keep https without www.
API discovered by reading the site's own JavaScript (main bundle + lazy chunks): all content types go through /api/general-website/portal/records (contentType = results, answer-key, admit-card, tentative-vacancy, special-instructions, syllabus, browse-exam, ssc-calendar ...) and /notice-boards. There is no "exam notification" feed separate from the notice board: new exams are announced as "Notice of <Exam>, <year>" on the notice board.

### Regional SSC sites (checked lightly, NOT proposed)
Reachable free: www.sscwr.net, ssckkr.kar.nic.in, sscsr.gov.in, sscer.org. Not reachable from this PC / redirect only: sscnr.nic.in, sscmpr.gov.in (302 to /newlook), sscner.org.in (266-byte page), ssc-cr.org (404), others dead. I only looked at homepage text. What they add beyond the main API: per-post Selection Post results (for example "Phase XIII ... Final Result for Post Code KK13225 (NIL SELECT LIST)") and regional "Young Professional / Legal Consultant" hiring (consultant roles = hold). The Selection Post cancellation/corrigendum notices already come through the main notice board. Not worth adding; not deeply audited (one homepage view each).

## ScrapFly
Not needed. Group FREE. Credits per scan: 0 | Monthly estimate: 0
SCRAPFLY_KEY was not available in this shell and was not needed.
PDFs download free: yes. https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_01102026.pdf returned 200, application/pdf, 489 KB, both with the backslashes turned into / (what the scanner does) and with %5C. Same host, not flaky.
Caveat: tested only from this PC (runner "india"). Could not test from a cloud/foreign IP; if it is ever run from there it may differ.

## Notice board size and speed (the 10-item window)
- The server ignores limit: notice-boards (language=english) always gives 10 per page, so the scanner reads only the newest 10, not 20. Without the language filter it gives 20 per page but mixes in Hindi duplicates, so keep language=english.
- Posting rate (english notices, Sep 2025 to Oct 2026): 14-31 per month (about 1 a day, 18-27 typical). Busiest single day: 9 items (5 Feb 2026); other busy days 5-7 (26 May: 7; 25 Jun: 6; 8 Sep, 9 Sep, 3 Sep: 5 each).
- Current window of 10 = 14 days on 1 Oct 2026 (17 Sep to 1 Oct), but a 9-item burst could push items off in a day. At 2+ scans a day there is no real risk; if the PC is off for 3-4 days in a busy week, items could be lost. Page 2 would be a free safety net (config only: another source with page=2) but I do not recommend it: it would flood on first run and the risk is small.
- Results feed: 20 per page, about 10-15 per month. Page 1 spans about 3 months (9 Sep back to 25 Jun). Plenty of margin.

## Label pattern
Every row = headline + createdAt (ISO date) + examId (an opaque id, the same for all notices of one exam) + attachments[] (PDF in attachments.0.path). Link = https://ssc.gov.in/api/attachment/ + path with backslashes turned into /. PDF file names carry the date as ddmmyyyy, and post codes for Selection Posts (Notice_KK13526_01102026.pdf). Result rows usually have 2 attachments (the write-up and the list); several rows can share the same PDF file.
Headline shapes (Parent = exam name + year, always taken from the headline; examId can be used to group but is not readable):
- New Job: "Notice of <Exam>, <year>" e.g. "Notice of Combined Graduate Level Examination, 2026"; "Notice for Phase-XIV/2026/Selection Posts". Parent = "SSC <Exam> <year>" (CGL 2026, CHSL 2026, JE 2026, Steno C&D 2026, CHT 2026, GD 2026, Selection Post Phase-XIV/2026).
- Update: "Corrigendum to / Addendum to the Notice of <Exam>", "CORRIGENDUM: Recruitment to ... Phase-XIV/2026/Selection Posts", "<Exam>, <year>, Addendum: <what>". Parent = the exam.
- Update (cancellation): "Cancellation Notice for the post of '<Post>', Post Code KK13526, ... Selection Posts Examination, Phase-XIV/2026". Parent = "Selection Post Phase-XIV/2026 - <Post> (<Post Code>)". Special case "Advertisement cancelled".
- Admit Card: "Information regarding the city of examination and Admission Certificate for ... <Exam>"; "Information regarding City of examination and Scribe Registration". Parent = exam.
- Answer Key: "<Exam>: Uploading of Tentative / Final Answer Key(s) along with Candidates' Response Sheet(s)". Parent = exam.
- Result: "<Exam>: Declaration of Result ...", "<Exam>: List of candidates ... provisionally shortlisted for <next stage>", "List of candidates qualified in CBE / PE&MT", "Uploading Final Marks". Parent = exam. Stage matters (CBE, DV, PE&MT, final).
- Vacancy: "Tentative Vacancy of <Exam>, <year> as on dd.mm.yyyy", "Final Vacancies of ...", "Revised Tentative Vacancies for ...". Type = Update (never Job); special case "Updated vacancies".
- Noise: "Important Notice - Schedule of Examination(s)" (generic calendar, no exam named).
Year gotcha: the year in the name is the notification year. CGL/CHSL/JE/Steno/CHT/GD "2026" are notified in 2026 (written exam later); but CHSL 2025, JE 2025, MTS 2025, Delhi Police 2025 are older recruitments whose results are coming out now. Do not "fix" the year; keep it exactly as printed so the sorter matches the Sarkari24 post.

## Hold rules (site-specific)
Standing rules apply. Site-specific:
- Any title with "Limited Departmental Competitive Examination" (LDCE): Grade 'C' Stenographers LDCE, ASO / Assistant Grade LDCE, Senior Secretariat Assistant / UDC LDCE, Junior Secretariat Assistant / LDC LDCE, and their notices, corrigenda, vacancies, answer keys, results. Hold (internal departmental exam).
- "Annual Departmental Typing / Stenography Skill Test" notices and results. Hold (departmental).
- "Important Notice - Schedule of Examination(s)" and "Re-schedule" generic ones that name no exam: hold (general info). A notice that reschedules a named recruitment exam (e.g. "Schedule of Constable (GD) ... Examination, 2026") PASS as Update.
- "List of debarred candidates", "candidates whose results were not processed / withheld", "deemed to have made genuine attempt" lists: hold (candidate lists, not a job event). "Identity Verification schedule for shortlisted candidates": my suggestion is hold, ask BatLee.
- Normalisation procedure, debarment SOP, Aadhaar biometric, scribe-procedure notices, Public Disclosure (RTI), Proactive Disclosure: hold (general info).
- Young Professional / Legal Consultant hiring at SSC offices (regional sites): hold (consultant). Not in the main feed anyway.
Never hold: new open exam notices, Selection Post cancellations/corrigenda, answer keys, results, vacancy updates, admit card/city notices, Delhi Police / CAPF / MTS / JE / CHSL / CGL / Steno C&D / CHT / GD stages.
Script keyword filter suggestion (unambiguous only): drop titles containing "Limited Departmental Competitive Examination" and titles that start with "Important Notice - Schedule of Examination" or "Annual Departmental". Needs BatLee's OK; the standing editorial rules and sorter would otherwise handle them.

## Sample links (audit day, 2026-10-03; latest data 1 Oct 2026)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Important Notice - Schedule of Examinations (01/10/2026) | Noise | n/a | HOLD (generic schedule) |
| Cancellation Notice for the post of Junior Technical Officer, Post Code KK13526 ... Selection Posts Phase-XIV/2026 (01/10/2026) | Update (cancellation) | Selection Post Phase-XIV/2026 - JTO (KK13526) | PASS |
| Cancellation Notice for the post of Agriculture Assistant, KK11426 ... Phase-XIV/2026 (01/10/2026) | Update (cancellation) | Selection Post Phase-XIV/2026 - Agriculture Assistant (KK11426) | PASS |
| Important Notice - Grade 'C' Stenographers LDCE 2025 (25/09/2026) | Update | Steno Grade C LDCE 2025 | HOLD (departmental) |
| Tentative Vacancy of Combined Graduate Level Examination, 2026 as on 24.09.2026 (24/09/2026) | Update (vacancy) | SSC CGL 2026 | PASS |
| Stenographer Grade C and D Examination 2026: Uploading of Tentative Answer Keys ... inviting challenges (23/09/2026) | Answer Key | SSC Steno Grade C & D 2026 | PASS |
| Stenographer Grade C and D Examination 2026, Addendum: Mandatory use of Mangal Font in Hindi Typing/Skill Test (23/09/2026) | Update | SSC Steno Grade C & D 2026 | PASS |
| Information regarding the city of examination and Admission Certificate ... Combined Graduate Level Examination, 2026 (Tier-I) (21/09/2026) | Admit Card | SSC CGL 2026 | PASS |
| Combined Hindi Translators Examination, 2026: Uploading of Tentative Answer Key(s) ... (21/09/2026) | Answer Key | SSC CHT 2026 | PASS |
| Grade 'C' Stenographers LDCE 2025: Uploading of Final Answer Key and Final Marks (17/09/2026) | Answer Key | Steno Grade C LDCE 2025 | HOLD (departmental) |
| Declaration of Result of Annual Departmental Stenography Test, 2024 (09/09/2026) | Result | Annual Departmental Steno Skill Test 2024 | HOLD (departmental) |
| Notice of Combined Higher Secondary (10+2) Level Examination, 2026 (07/09/2026) | New Job | SSC CHSL 2026 | PASS |
| Notice of Junior Engineer Examination, 2026 (02/09/2026) | New Job | SSC JE 2026 | PASS |
| Information regarding the city of examination and Admission Certificate ... Phase-XIV/2026/Selection Posts Examination (CBE) (08/09/2026) | Admit Card | Selection Post Phase-XIV/2026 | PASS |
| Combined Higher Secondary (10+2) Level Examination, 2025: List of Candidates in Roll Number Order provisionally shortlisted for ... (17/08/2026) [results feed only] | Result | SSC CHSL 2025 | PASS (currently missed) |
| Multi Tasking (Non-Technical) Staff, and Havaldar Examination, 2025: List of candidates qualified in CBE (03/08/2026) [results feed only] | Result | SSC MTS & Havaldar 2025 | PASS (currently missed) |
| Multi Tasking ... 2025: List of debarred candidates (03/08/2026) [results feed only] | Result | SSC MTS & Havaldar 2025 | HOLD (debarred list) |
| Head Constable (Ministerial) in Delhi Police Examination, 2025: Male (Open) Candidates qualified for PE and MT (25/06/2026) [results feed only] | Result | SSC Delhi Police Head Constable (Ministerial) 2025 | PASS (currently missed) |
| Notice of Junior Secretariat Assistant / LDC Grade LDCE 2025 (25/06/2026) | New Job | CSCS LDC LDCE 2025 | HOLD (departmental) |
| Notice of Combined Graduate Level Examination, 2026 (21/05/2026) | New Job | SSC CGL 2026 | PASS |
| Schedule of Constable (GD) in CAPFs, SSF and Rifleman (GD) in Assam Rifles Examination, 2026 (22/05/2026) | Update | SSC GD Constable 2026 | PASS |

## Proposed change (NOT applied; needs BatLee's "approved")
1. Keep "ssc" as is (FREE). Optionally tidy the URL (remove limit=20, which the server ignores, and isAttachment, which changes nothing); not required.
2. ADD a second FREE source "ssc-results": type json, itemsPath "data", titleField "headline", linkField "attachments.0.path", linkPrefix "https://ssc.gov.in/api/attachment/", fallbackLink "https://ssc.gov.in/", url = the Results URL in the Pages table. No code change, config only. About 20 rows on first run (flood protection may flag it; most are already-old rows) and about 10-15 new rows a month.
3. Optional keyword filter in keywords.json for LDCE / Annual Departmental / generic schedule (see Hold rules).
Uncertain points: several result rows share one PDF link (e.g. three MTS lists point to writeup_mts_03082026.pdf); if the seen check keys on title + link this is fine, if on link alone only the first would alert. Many result rows are Delhi Police PE&MT lists per category (10 rows in one day): a daily flood of near-identical rows, the sorter should group them under one parent.

## BatLee's corrections
- (none yet)

## Repairs
- (none yet)

## Decisions (BatLee, 2026-10-03)
- Approved: add the "ssc-results" source (FREE, rebaseline on first run); drop the unused limit=20 and isAttachment from the "ssc" URL. ScrapFly stays unused.
- No keyword filter in the script. The hold rules above are for the SORTER only.
- "Identity Verification schedule for shortlisted candidates" notices: PASS as Updates, unless they belong to a departmental exam (LDCE etc.), which stays hold.
- Sorter: group the Delhi Police PE&MT rows (about 10 near-identical rows a day, one per category) under ONE parent.
