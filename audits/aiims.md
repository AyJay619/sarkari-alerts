# AIIMS (aiimsexams.ac.in notices + other AIIMS sites)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (works as it is)

## BATCH SUMMARY BLOCK
SITE: AIIMS Exams (notices) | VERDICT: OK
PROPOSED: none (source "aiims" stays as is; its Next-Action id is the known "may break if the site is rebuilt" risk). No extra AIIMS sources proposed.
MISSING TODAY: nothing found on the main feed (50 newest notices, ~1-2 per day, covers 7 weeks). Not watched, by choice: miscellaneous-notice feed (9 items in 2026, mostly deputation) and individual AIIMS sites (mostly contract/project/walk-in posts).
ASK BATLEE: optional - individual AIIMS sites (Bhopal, Raipur, Rishikesh...) post only walk-in/contract/project jobs that the standing rules hold; recommend NOT adding them. Regular AIIMS jobs (CRE, faculty, Group A/B) all show up in the aiimsexams notice feed.
(All links in the catch point to the notice page, not a PDF: this is deliberate, the PDF links are signed and expire after 7 days.)

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Notices (all AIIMS exams/recruitment/admission notices, newest first) | https://www.aiimsexams.ac.in/landingpage/notice (data comes from a Next.js server-action POST, see sources.json) | free fetch via scanner fetchItems, www + https (no-www also 200; http redirects 301 to https) | FREE-OK |
| Miscellaneous notices | same page, request `type=miscellaneousNotice&noticeType=miscellaneousNotice&year=2026` (same Next-Action id) | free POST, 200 | works, not proposed (only 9 items in 2026; e.g. deputation vacancy notice, result of deputation selection) |
| /landingpage/recruitment, /result, /admit-card, /advertisement | aiimsexams.ac.in | free 200 but they are empty app shells, no list of their own | not usable; recruitment/result/admit-card items are inside the notice feed |
| /advertisement/<id> | aiimsexams.ac.in/advertisement/<id> | 200 shell (JS) | detail page of one advert; linked as externalLink from 3 of 50 notices ("Online Registration..."); not a list |
| rrp.aiimsexams.ac.in | - | 301 to home | n/a |
| aiims.edu (New Delhi) | https://www.aiims.edu/ | static page of ~1 KB (placeholder, no recruitment list) | useless |

## ScrapFly
Not needed. Free fetch OK, no credits. PDFs (rrpdocuments.aiimsexams.ac.in, S3 signed URLs) are not scanned.

## Test results
- Scanner's own fetchItems("aiims"): 48 items, identical on 5 runs, 40-380 ms. No flakiness, no block. Timeout 15000 not needed.
- The feed returns 50 records per request (limit=50); 48 after the scanner's own dedupe (two near-identical titles). Source limit is 60: fine. totalRecords = 638 (13 pages), so there is no need for more than page 1.
- Posting rate: 27 posting days in the last 7 weeks, 1-6 notices per day, usually 1-2. 50 rows = about 7 weeks, so a missed week can never lose items.
- Link stability / flood check: all items get fallbackLink (the notice page), so the seen key is title + that URL: stable. The record has a PDF link (prospectusLink) but it is a signed S3 URL that expires after 7 days and changes on every request; it must NOT be used as the link (it would re-alert every scan). 3 of 50 records have no PDF but an externalLink to /advertisement/<id> (stable); not used today, fine.
- Weakness: the dedupe is by title. If AIIMS reposts a notice with a byte-identical title (e.g. a second "Corrigendum" with the same text) it is not re-alerted. Titles carry numbers (Notice No. 156/2026, Corrigendum No.40/2026), so this is rare.
- The notice feed ignores noticeType values other than miscellaneousNotice (recruitment/result/admit-card all return the same 638 notices), so there is no cheaper per-category feed.

## What the scanner catches vs misses
- Catches: every notice AIIMS posts on the central exam portal: CRE (Common Recruitment Examination) notices, corrigenda, addenda with vacancies per institute, seat allocation, walk-ins at AIIMS New Delhi, INI-CET / INI-SS registration, faculty shortlists (e.g. Assistant Professor AIIMS Awantipora), MBBS / nursing / PG exam notices, ICMR interview schedules and other bodies' (ICMR, Pasteur Institute) schedules that AIIMS conducts.
- Posting speed: new notices appear on the feed as soon as AIIMS publishes them; scan interval is the only delay.
- Misses: nothing on the feed. Individual AIIMS campuses' own sites (Bhopal, Raipur, Rishikesh, Nagpur, Bhubaneswar, Gorakhpur, Bilaspur etc.) are not watched; see below.

## Other AIIMS pages (looked at, not proposed)
Checked on 2026-10-04 (homepage status only, no deep audit):
- Reachable: Bhopal (aiimsbhopal.edu.in, homepage lists career items with PDFs), Raipur (recruitment.aiimsraipur.edu.in), Nagpur (/recurtitement1), Rishikesh (aiimsrishikesh.edu.in/a1_1/ with page_id=2809 "New Job" and 6279 "New Project Jobs"), Bhubaneswar (/recruitment-notice/), Mangalagiri, Bibinagar, Gorakhpur, Kalyani, Bilaspur, Deoghar and Jammu answer 200 (after redirect to www where shown).
- Not reachable from this PC today: Jodhpur (www.aiimsjodhpur.edu.in), Raebareli (www.aiimsrae.edu.in) (connection failed; could be www/http issue, not investigated). Patna answers 307.
- Content on Bhopal's homepage today: project posts on contract (ICMR/DHR funded), result of contractual staff, SR (Non-Academic) rolling advertisement. This is what campus sites mostly carry: walk-ins, contract, project, Senior Resident on short term. Under the standing rules these are held (consultant/contract) or low value, and the regular posts (CRE, faculty at institutes, Group A/B) are announced on aiimsexams.ac.in.
- Recommendation: do not add individual campus sources (high cost: ~20 sites, each with its own layout, mostly HOLD). If BatLee later wants Senior Resident / Group A walk-ins, add the campuses one at a time as separate audits (Rishikesh page_id=2809 and Bhopal homepage are the likeliest).

## Label pattern
Titles are AIIMS' own, often with a serial number. Shapes:
- "Notice No.<n>/2026: <text>" e.g. "Notice No. 156/2026: Schedule of Seat Allocation ... for Common Recruitment Examination (CRE-5)"
- "Corrigendum No.<n>/2026: Common Recruitment Examination-5(CRE-5)", "Addendum No. <n>_2026_ <text>" (n runs 33-42 in Aug-Oct 2026; one shared numbering for CRE/INI/vacancy addenda)
- "Corrigendum No: 39/2026 Regarding Seat position ... INI-SS DM/M.Ch. January 2027 Session"
- Plain: "Walk in Interview for the post of Senior Resident / Demonstrator at AIIMS, New Delhi-110029", "Online Registration for INI-CET ..."
PARENT rule for the sorter: take the exam or post name after the number/prefix: "CRE-5" (Common Recruitment Examination-5, 2026), "INI-SS January 2027 session", "INI-CET January 2027 session", "Senior Resident / Demonstrator AIIMS New Delhi walk-in (advt Academics/10-01/SR/Short term, 18.09.2026)", "Assistant Professor AIIMS-Awantipora". Typos exist in titles ("Janurary", "Biotechnolgy"): normalise. All catch links are the same notice-page URL, so the sorter must open the AIIMS notice page (or search the title) to find the PDF; the PDF itself is not in the catch.

## Hold / pass rules for the sorter
HOLD:
- Limited Departmental Competitive Examination (LDCE) and promotion items: "Limited Departmental Competitive Examination for the post of Senior Administrative Assistant", "List of eligible candidates ... promotion ... 25% LDCE quota", "Scheme of Examination for promotion ...", Assessment Promotion Scheme (APS-2026) notices (programme, faculty eligibility lists, online application for promotion)
- Deputation vacancy notices and their results (miscellaneous feed, AIIMS-CAPFIMS etc.)
- Student-side items with no job angle: MBBS / B.Sc. Nursing / PG professional exam date sheets, schedules, "Fees and Admit Card for ... Supplementary Professional Examinations", reporting instructions for MBBS admission
- Admission seat allocation / vacant seat position lists for B.Sc., M.Sc., Nursing, M.Biotechnology, MBBS (course admissions, not jobs); keep an eye on INI-CET / INI-SS registration as admission notices (not jobs): hold unless BatLee wants admissions
- Consultant / contract / project / young-professional posts and small walk-ins at AIIMS New Delhi when contract-only (judge from the PDF)
- Notices about other bodies (ICMR Scientist-B interview schedules, Pasteur Institute DWT): pass only if BatLee wants ICMR jobs; ICMR "Scientist-B" is a regular central post, so recommend PASS as "interview schedule, current cycle" under the standing rule
PASS:
- CRE (Common Recruitment Examination) notices: advertisement / registration, corrigenda, addenda adding vacancies (e.g. Addendum No. 37 AIIMS Rishikesh, No. 35 AIIMS Madurai, No. 38 Bhopal and Mangalagiri), exam date changes, re-conduct, city / admit card, results, seat (institute and post) allocation schedule and brochure for CRE
- Walk-in interviews for Senior Resident / Demonstrator / faculty with their corrigenda and interview schedules (these are real job posts even though short term; treat as New Job, the sorter may judge duration)
- Faculty recruitment: eligible / not eligible / shortlisted lists (e.g. Assistant Professor AIIMS-Awantipora)
- Answer keys, results, document verification lists, current-cycle interview schedules

## Sample links (audit day 2026-10-04; every link is https://www.aiimsexams.ac.in/landingpage/notice)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Schedule for Walk in Interview for the post of Senior Resident / Demonstrator at AIIMS, New Delhi-110029 | Update (interview schedule) | SR/Demonstrator walk-in, AIIMS New Delhi | Pass |
| Walk in Interview for the post of Senior Resident / Demonstrator at AIIMS, New Delhi-110029 | New Job | SR/Demonstrator walk-in, AIIMS New Delhi | Pass |
| Corrigendum related to walk in interview ... advt no. Academics/10-01/SR/Short term dated 18.09.2026 | Update | SR/Demonstrator walk-in 18.09.2026 | Pass |
| Notice No. 156/2026: Schedule of Seat Allocation (for group codes where skill test is not required) for CRE-5 | Update | CRE-5 2026 | Pass |
| Corrigendum No.40/2026: Common Recruitment Examination-5(CRE-5) | Update | CRE-5 2026 | Pass |
| Addendum No: 42/2026 Regarding Seat position for the INI-SS DM/M.Ch. January 2027 Session | Update (admission) | INI-SS Jan 2027 | Hold (admission) |
| Online Registration for the INI-SS (DM/MCh) Courses for January 2027 Session has been started | Admission notice | INI-SS Jan 2027 | Hold (admission) unless BatLee wants |
| Online Registration for INI-CET for admission to PG Courses for Janurary 2027 session has been started | Admission notice | INI-CET Jan 2027 | Hold (admission) unless BatLee wants |
| 1_Addendum No. 38_2026_ Final vacancies of AIIMS Bhopal and Mangalagiri | Update (vacancies) | CRE-5 2026 | Pass |
| Addendum No. 37/2026 regarding addition of AIIMS Rishikesh vacancy | Update (vacancies) | CRE-5 2026 | Pass |
| List of eligible/Provisionally eligible/Not eligible/Not shortlisted candidates for the post of Assistant Professor of AIIMS-Awantipora | Result (shortlist) | Asst Professor AIIMS-Awantipora | Pass |
| Notice no.146/2026: Re-conduct of CRE-5 Examination at ION Digital Zone IDZ Sitapura, Jaipur on 7 September, 2026 | Update | CRE-5 2026 | Pass |
| Notice No.132/2026: Information Brochure for Online Seat Allocation (Institute And Post) for CRE-5 | Update | CRE-5 2026 | Pass |
| Schedule of Interview for Scientist-B (Non-Medical) posts at ICMR hqrs. & its Institutes/Centers. | Update (interview schedule) | ICMR Scientist-B | Pass (ICMR, other body) |
| Limited Departmental Competitive Examination for the post of Senior Administrative Assistant scheduled on 18th September, 2026 | Noise (LDCE) | Sr Admin Assistant LDCE | Hold |
| Programme for the standing selection committee meeting 2026 for the Assessment Promotion Scheme (APS-2026) | Noise (promotion) | APS-2026 | Hold |
| Date Sheet of PG (MD/MS/MDS/Fellowship Programme) Professional Examinations to be held in December 2026 | Noise (student exam) | PG exams Dec 2026 | Hold |
| Notice: Fees and Admit Card for First MBBS (Supplementary)/Final MBBS (Supplementary) Professional Examinations | Noise (student exam) | MBBS supplementary | Hold |
| Vacant seat position for M.Sc. Nursing courses Open round of seat allocation at AIIMS, August-2026 session | Noise (admission) | M.Sc. Nursing Aug 2026 | Hold |
| Vacancy Notice for various Group A and B posts on deputation basis at AIIMS-CAPFIMS, Maidangarhi (miscellaneous feed, not scanned) | Job (deputation) | AIIMS-CAPFIMS | Hold |

## Proposed config (JSON)
No change. Current source stays:
```json
{ "id": "aiims", "type": "json", "url": "https://www.aiimsexams.ac.in/landingpage/notice", "method": "POST",
  "body": "[\"type=announcements&noticeType=notice&page=1&limit=50\"]", "rscLine": "1", "itemsPath": "data.data",
  "titleField": "value", "fallbackLink": "https://www.aiimsexams.ac.in/landingpage/notice", "limit": 60 }
```
(Optional, only if BatLee ever wants it: a second source "aiims-misc" with body `["type=miscellaneousNotice&noticeType=miscellaneousNotice&page=1&limit=20&year=2026"]`, titleField "title", same itemsPath/rscLine/headers; it would mostly carry deputation items. Not recommended. The year in the body would need a manual bump every January.)

## Uncertain points
- The Next-Action id (2d69b5b6...) still works today; if AIIMS rebuilds its site it changes and the source will fail 3 runs and warn. Repair = read the new id from the notice page's JS chunk (app/landingpage/notice/page-*.js).
- Whether INI-CET / INI-SS admission notices should pass: they are PG medical admissions, not jobs. Held here; BatLee may overrule.
- Jodhpur and Raebareli sites did not answer from this PC (not investigated further).

## BatLee's corrections
- none yet

## Repairs
- none yet
