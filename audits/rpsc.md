## BATCH SUMMARY BLOCK
SITE: RPSC (Rajasthan PSC; rpsc + rpsc-advt) | VERDICT: OK
PROPOSED: none (config works as is; optional: nothing to add, see "Other pages")
MISSING TODAY: admit cards and interview letters (home "examlinks" links go to a login portal, no per-notice PDF; only press notes about them are caught)
ASK BATLEE: none

# RPSC (Rajasthan Public Service Commission)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (state level)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Home (News and Events box) | https://rpsc.rajasthan.gov.in/ | free fetch, html | FREE-OK. 273 items in ~0.4-0.7 s, 3 of 3 runs identical |
| Recruitment Advertisements | https://rpsc.rajasthan.gov.in/advertisements | free fetch, html rows | FREE-OK. 30 items in ~0.6-1.1 s, 3 of 3 runs |

URL versions: https without www works; http 307-redirects to https; www. host does not connect (do not use). Default timeout is fine (site answers fast).

## What the scanner catches vs misses
- rpsc (home, include Static/(Result|AnswerKeys|PressNotes|News)/): results, answer keys, press notes (interview dates, response sheets, admit-card/district info), News PDFs. Home list holds ~325 entries back to 2015; scanner takes the newest 273 matching (limit 300, newest first, so new items are never cut off).
- rpsc-advt: Advt. No. xx/2026-27 and Corrigendum No. xx/2026-27 PDFs (30 newest). This is where new jobs appear (e.g. Advt 05/2026-27 Physiotherapist). Good.
- Missed: home entries linking to `examlinks` (20: interview letters, candidate response sheet links) and `results` (23: "Marks for ..."). These all share one generic link (examlinks / results), so the scanner cannot use them (same link for every title). Interview letters are login-portal items; the matching press note "Interview Dates for ..." IS caught. "Marks for ..." is a hold item anyway. Admit cards: no admit-card PDFs are listed on the public pages; RPSC announces them through press notes (e.g. "Press Note Regarding Exam District Information and Admit Card for ...") which are caught.
- Other pages checked: /news (same box as home), /forthcominginterviews (table: release date, exam, dates; no links, covered by press notes), /proposedexamdate, /eventcalendar, /examdashboard, /impmessage, /results (huge 5 MB page of Static/Result PDFs, same type as home; not worth adding). No new source needed.

## Posting speed / stability
Home shows the newest items first with date badges; RPSC posts several items per day on busy days (today 01/10 and 30/09 had 6+). The limit 300 covers all of that. Links are GUID PDF names (Static/Result/<GUID>.pdf), stable, no tracking parameters. Flood risk: low (the date-ordered list only grows at the top). The 33 "Pre-Litigation Committee" News PDFs are old repeated notices, in the baseline already.

## Label pattern
Home and advertisement titles are "[DD/MM/YYYY ]<Type> for <Post/Exam - Year>" (date prefix only on home). Parent = text after "for ", e.g. "Veterinary Officer - 2025", "Asst. Director - 2024", "Asst. Prof., Librarian And PTI (College Edu.) Exam - 2023 (Sociology)" (subject in brackets = sub-part of the same parent).
- Result: "Result Preamble and Cutoff Marks (Main List|Reserve List|Qualified for Mains|Qualified for Interview) for X", "Main Merit List for X", "Additional Result Preamble (...) for X"
- Answer key: "Final Answer Key for X ... (Paper-I)" (URL /Static/AnswerKeys/)
- Press note: "Press Note Regarding <topic> for X" (URL /Static/PressNotes/)
- Advertisement page: "Advt. No. NN/2026-27 for X" = New Job; "Corrigendum No. NN/2026-27 for X" = Update. The Advt number NN/2026-27 is the strongest parent key; the corrigendum names the same post/exam as the advt or exam.
- Note: Hindi-only notices are not seen on these pages.

## Hold / pass rules (for the sorter)
Pass: Advt. No. ... (New Job); Corrigendum (Update, incl. bifurcation of posts); Result Preamble / Main Merit List / Reserve List / Qualified for Mains or Interview (Result); Final Answer Key (Answer Key); Press Note about interview dates, exam dates, admit card / exam district information (Update); Result of document verification.
Hold: "List of Disqualified Candidates" (debarment style list, no use), "Marks for ..." (marks of recommended candidates), "Press Note Regarding Candidate Response Sheet" (low value, hold unless BatLee wants), "Pre-Litigation Committee" press notes, candidate grievance portal / e-mitra / misleading social media press notes, Appointment Letter notices (Fourth Class employee), previous question papers, RPSC internal (RTI, Others). Departmental / LDCE style exams ("Departmental Exam", "LDCE", promotion, deputation, "Retired" posts) hold; Medical Edu. Asst. Professor "(BS)" Super Speciality posts are normal jobs, pass.
Keyword filters in script: none (per standing rule).

## Sample links (audit day, 2026-10-04)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Result Preamble and Cutoff Marks (Qualified for Mains) for Asst. Prosecution Officer - 2026 | Result | Asst. Prosecution Officer - 2026 | Pass |
| List of Disqualified Candidates for Asst. Prosecution Officer - 2026 | Noise | Asst. Prosecution Officer - 2026 | Hold |
| Result Preamble and Cutoff Marks (Main List) for Veterinary Officer - 2025 | Result | Veterinary Officer - 2025 | Pass |
| Result Preamble and Cutoff Marks (Reserve List) for Veterinary Officer - 2025 | Result | Veterinary Officer - 2025 | Pass |
| Additional Result Preamble (Prov. Selected for Interview) ... Librarian | Result | Asst. Prof., Librarian And PTI (College Edu.) Exam - 2023 | Pass |
| Main Merit List for Asst. Director - 2024 | Result | Asst. Director - 2024 | Pass |
| Final Answer Key for Assistant Director (Science and Tech. Dept.) Comp. Exam-2024 (Paper-II) | Answer Key | Assistant Director (Science and Tech.) 2024 | Pass |
| Press Note Regarding Candidate Response Sheet for Inspector Of Factories And Boilers - 2025 | Update | Inspector Of Factories And Boilers - 2025 | Hold |
| Press Note Regarding Interview Dates for Asst. Professor (Medical Edu.) - 2024 Orthopedics (B.S) | Update | Asst. Professor (Medical Edu.) - 2024 | Pass |
| Press Note Regarding Interview Dates for Asst. Prof. (College Education) - 2025 (Maths...) | Update | Asst. Prof. (College Education) - 2025 | Pass |
| Main Merit List for Biochemist - 2024 | Result | Biochemist - 2024 | Pass |
| Final Answer Key for Biochemist (Medical Edu Dept.) Comp. Exam-2024 | Answer Key | Biochemist - 2024 | Pass |
| Advt. No. 05/2026-27 for Physiotherapist - 2026 | New Job | Advt 05/2026-27 Physiotherapist | Pass |
| Advt. No. 04/2026-27 for Sr. Scientific Officer - 2026 | New Job | Advt 04/2026-27 | Pass |
| Advt. No. 02/2026-27 for Raj. State And Sub. Services Comb. Comp Exam - 2026 | New Job | Advt 02/2026-27 (RAS) | Pass |
| Advt. No. 03/2026-27 for Asst. Prosecution Officer - 2026 | New Job | Advt 03/2026-27 | Pass |
| Corrigendum No. 15/2026-27 for Sub Inspector Comb. Comp. Exam - 2021 | Update | Sub Inspector Comb. Comp. Exam - 2021 | Pass |
| Corrigendum No. 13/2026-27 for Sr. Teacher (Sec. Edu.) Comp. Exam - 2025 | Update | Sr. Teacher (Sec. Edu.) 2025 | Pass |
| Press Note Regarding Pre-Litigation Committee | Noise | none | Hold |

## Proposed config (unchanged, current sources.json entries)
```json
[
  {"id":"rpsc","name":"RPSC Notices","runner":"india","tier":"FREE","level":"state","type":"html","url":"https://rpsc.rajasthan.gov.in/","include":"Static/(Result|AnswerKeys|PressNotes|News)/","minTitle":15,"limit":300},
  {"id":"rpsc-advt","name":"RPSC Advertisements","runner":"india","tier":"FREE","level":"state","type":"html","url":"https://rpsc.rajasthan.gov.in/advertisements","rowSelector":"tbody.table-group-divider tr","rowTitle":"td:nth-child(4)","rowLink":"a[href*='RecruitmentAdvertisements']","minTitle":10,"limit":30}
]
```

## Uncertain points
- Home entries pointing to `examlinks` (interview letters, response sheets) cannot be caught: one shared link for all. Interview-date press notes cover the same events.
- The advertisements page keeps only 30 rows; a burst of more than 30 new corrigenda between scans is very unlikely.
- Not checked: whether the advertisements table lists every advertisement for the year in a hidden pagination (the 30 newest were returned, correctly ordered, all 2026-27 first).

## BatLee's corrections
- none yet

## Repairs
- none
