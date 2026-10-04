## BATCH SUMMARY BLOCK
SITE: DSSSB (Delhi Subordinate Services Selection Board; state) | VERDICT: OK
PROPOSED: none (keep https; http times out. Optional: add timeoutMs 15000 to the 3 sources; not needed, pages answer in ~0.4 s)
MISSING TODAY: nothing found (admit cards are not posted as list items; exam schedules, skill tests, interviews, answer-key notices all appear on notice-of-exam)
ASK BATLEE: none

# DSSSB (Delhi Subordinate Services Selection Board)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE | Level: state (Delhi)

## Pages watched and tested
| Source id | URL | Fetch | Verdict |
|---|---|---|---|
| dsssb-vacancies | https://dsssb.delhi.gov.in/dsssb-vacancies | free, fetchItems, 3 runs, 20 items, ~0.4 s | FREE-OK |
| dsssb-exams | https://dsssb.delhi.gov.in/notice-of-exam | free, 3 runs, 20 items, ~0.4 s | FREE-OK |
| dsssb-results | https://dsssb.delhi.gov.in/doit/dsssb/latest-result | free, 3 runs, 20 items, ~0.4 s | FREE-OK |

- https works; http://dsssb... fails (connection error/timeout). Keep https. No www needed (not tested).
- Each page lists 20 per page (limit 30 in config is never reached; newest first). Page 2 exists (?page=1) but is not needed.
- Other pages seen: /recruitment (1 item, "recruitments" landing), /results (20 items, same kind as latest-result), /doit/tab-content/answer-keys (static page, newest key notice is July 2025, stale), /todays-exam (no list). Not worth adding: answer-key notices show up on notice-of-exam.
- Everything is plain server-rendered HTML (Drupal). No JS, no ScrapFly. PDFs are on dsssb.delhi.gov.in/sites/default/files/DSSSB/..., linked directly.

## What the scanner catches
Vacancy page: advertisements, corrigenda, cancellations, revival/revision of vacancies, user guides. Exam page: exam schedule notifications, skill/typing/PET tests, interview schedules, date-change corrigenda. Results page: result notices, rejection notices, supplementary/main result notices.

## Link stability (flood check)
Same links on all 3 runs. Rows are `li` with `a.tab-view` and `.tab-title` (vacancies, exams), or `table tr` td:2 (results). Links are stable /sites/default/files/... PDF paths, so no flood risk. Rarely a title has odd characters (Cyrillic look-alike letters in "SEPTEMBER" on one exam notice) - harmless.

## Label pattern
No "<Type>: <Parent>" prefix. Key words in the title give the type; the parent is "Post Code NN/YY" and/or "Advt No. NN/YYYY" (e.g. "Advertisement No. 03/2026", "Post Code 56/24"). Notice numbers (Result Notice No 379) are not the parent; use Post Code.
- Vacancy page: "VACANCY NOTICE / ADVERTISEMENT NO. 03/2026 for various Posts from Post code 21/26 to 45/26" = New Job, parent Advt 03/2026. "Corrigendum ... advertisement No. 08/22 ... Post Code 41/22" = Update, parent Advt 08/22 / post code 41/22.
- Results: "RESULT NOTICE No: 379 For Post code: 52/25" = Result; "MAIN RESULT NOTICE" = Result; "SUPPLEMENTARY RESULT NOTICE" = Result; "REJECTION NOTICE" = list of rejected candidates (see rules below).
- Exams: "NOTIFICATION OF ONLINE EXAMINATION FOR THE VARIOUS POST CODES ... SCHEDULED FROM 21 SEPTEMBER TO 24 OCTOBER 2026" = exam schedule (Admit Card/Exam info, parent = many post codes); "SCHEDULE OF INTERVIEW FOR ... Post Code 822/24" = Update.

## Hold rules (for the sorter)
Standing rules plus DSSSB specifics:
- HOLD: "General instructions for candidates", tentative calendars, GeM bid / cab hiring / tenders, exam functionary notices, syllabus / recruitment rules pages, "Notice regarding entry of candidates at <venue>" (venue-only logistics), scribe / normalisation / debarment notices.
- HOLD: REJECTION NOTICE (candidates rejected, no news for applicants) unless BatLee wants them. Recommendation: hold.
- HOLD (old cycle): corrigenda on advertisements of past years where the post is already closed and nothing new is offered (e.g. Advt 05/2023). PASS only if it extends dates, revises vacancies, or changes the exam.
- PASS: new Advertisement / vacancy notices, corrigenda for current advts (2026 and live 2025), cancellation notices, revival/revision of vacancies, online exam schedule notifications, skill test / typing test / PET / interview / driving test schedules for the current cycle, result notices (main, supplementary), answer-key notices.
- Departmental / internal items: DSSSB recruits for Delhi departments; hold posts that are deputation or limited departmental exams if they appear.

## Sample links (audit day 2026-10-04)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| VACANCY NOTICE/ADVERTISEMENT NO. 04/2026 Combined Examination (SPA, PA, JJA, Process Server, Peon) | New Job | Advt 04/2026 | Pass |
| VACANCY NOTICE ... NO. 03/2026 Post code 21/26 to 45/26 | New Job | Advt 03/2026 | Pass |
| VACANCY NOTICE ... NO. 02/2026 Post code 01/26 to 20/26 | New Job | Advt 02/2026 | Pass |
| VACANCY NOTICE ... NO. 01/2026 Combined Exams 2026 (Legal Asst, AE Civil, JE Civil, ASO) | New Job | Advt 01/2026 | Pass |
| Corrigendum partial modification adv. 03/2026, Junior Scientific Assistant (Cyber Forensic) 28/26 | Update | Advt 03/2026, 28/26 | Pass |
| Corrigendum revision of vacancies, Junior Laboratory Assistant 18/26 (Advt 02/2026) | Update | Advt 02/2026, 18/26 | Pass |
| Notice for cancellation of Malaria Inspector vacancies 01/25 (MCD) | Update | Advt 01/2025, 01/25 | Pass |
| User Guide for special link, applicants of 2009 (90/09), ASO 804/26 | Noise/Update | 804/26 | Hold (guide), recommend pass only if sorter finds it opens a new window |
| Corrigendum in r/o Post Code 802/23 Advt 05/2023 | Update | Advt 05/2023 | Hold (old cycle) |
| NOTIFICATION OF ONLINE EXAMINATION ... 21 Sept to 24 Oct 2026 | Exam notice | many post codes | Pass |
| Notice for PET, Warder (Male), Post Code 15/25 | Update | 15/25 | Pass |
| SCHEDULE OF INTERVIEW, Peon/Orderly/Dak Peon, Post Code 822/24 | Update | 822/24 | Pass |
| Corrigendum change of exam date, Inspecting Officer 45/25 | Update | 45/25 | Pass |
| GENERAL INSTRUCTIONS FOR CANDIDATES re online exams 2026 | Noise | - | Hold |
| RESULT NOTICE No: 379, Post code 52/25 Pharmacist (Unani) | Result | 52/25 | Pass |
| MAIN RESULT NOTICE NO: 1066 TGT (Sanskrit) 808/24 | Result | 808/24 | Pass |
| REJECTION NOTICE No. 378, Asst Sanitary Inspector 33/24 | Result-related | 33/24 | Hold |
| SUPPLEMENTARY RESULT NOTICE 1065, PGT History Male (court order) | Result | 112/17 | Pass (old post, low priority) |

## Full proposed config
Unchanged from sources.json (all three sources already correct):
```json
[
 {"id":"dsssb-vacancies","url":"https://dsssb.delhi.gov.in/dsssb-vacancies","rowSelector":"li:has(a.tab-view)","rowTitle":".tab-title","rowLink":"a.tab-view","minTitle":10,"limit":30},
 {"id":"dsssb-exams","url":"https://dsssb.delhi.gov.in/notice-of-exam","rowSelector":"li:has(a.tab-view)","rowTitle":".tab-title","rowLink":"a.tab-view","minTitle":10,"limit":30},
 {"id":"dsssb-results","url":"https://dsssb.delhi.gov.in/doit/dsssb/latest-result","rowSelector":"table tr","rowTitle":"td:nth-child(2)","rowLink":"a[href]","minTitle":10,"limit":30}
]
```

## Uncertain points
- Admit cards for DSSSB are issued via the candidate login portal, not as public list items, so none can be caught.
- Posting speed vs limit: pages show 20 rows newest first; these boards post a few notices per day, so 20 rows is enough for a scan every few hours.
- Answer-key page (/doit/tab-content/answer-keys) was last updated July 2025; if DSSSB starts using it again, consider adding it.
- Homepage http (no TLS) did not answer; not retested.

## BatLee's corrections
- none yet

## Repairs
- none
