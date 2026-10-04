## BATCH SUMMARY BLOCK
```
SITE: BEL Careers (bel-india.in) | VERDICT: FIX
PROPOSED: 1. Add FREE source "bel-results" = https://bel-india.in/results/ (same selectors, rowLink "a[href*=jobapply], a.file-link-results, a.file-link", limit 25, extraCerts, rebaseline); 2. Keep "bel" (job-notifications) as is
MISSING TODAY: all results / shortlists / call-letter notices (separate /results/ page, 10 rows today, not watched); page 2+ of job list (only matters if >10 postings appear between scans)
ASK BATLEE: none
```

# BEL Careers (bel-india.in)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Job Notifications (current "bel") | https://bel-india.in/job-notifications/ | free fetch via fetchItems, extraCerts sectigo-ov-r36.pem | FREE-OK, 8 items, 0.9-1.3 s, 5/5 runs identical |
| Results (NEW, proposed) | https://bel-india.in/results/ | same | FREE-OK, 10 items, 3/3 runs identical |

No-www is the right host (the site is bel-india.in; the cert chain needs the Sectigo intermediate in certs/). Server-rendered WordPress/Elementor HTML, no JS needed. The home menu has only two relevant pages under Careers: Job Notifications and Results (no separate admit card page; call letters sit inside the results rows, usually as jobapply.in links). eProcurement/tenders go to eprocurebel.co.in (ignore).

## What the scanner catches vs misses
- "bel" catches the first `a.file-link` of each `.career-result-box` = the detailed advertisement PDF. The other links in a box (application forms, SC/ST/OBC certificate formats, police verification, jobapply.in apply link) are intentionally not taken. Today: 8 rows = 8 items.
- Misses: the whole /results/ page (selection lists, shortlists, written-test results, call letters). Proposed as a second source. On /results/ the row's link class is `file-link-results`, and some rows carry only a jobapply.in link (Chennai Trainee Engineer call letter / result), which with the current selector would fall back to the page URL. Proposed rowLink `a[href*="jobapply"], a.file-link-results, a.file-link` (tested: Chennai row now gets its own unique jobapply link; PDF rows unchanged). Row 9 "Recruitment of Non-Executives for BEL Ibrahimpatnam Plant" on /results/ yields a certificate-format PDF as its link (it is a notice with forms, not a result); harmless, the sorter should read the title.
- Pagination: both pages paginate by `?page_num=N` (page reload; HTTP 200 on page_num=2). Page 1 shows 10 rows, so a limit 25 never matters. Pagination matters only if more than ~10 new rows appear between two scans, which is unlikely at BEL (about 8 notices a month).
Posting speed: new rows are added at the top; newest advert PDF is Sept 2026, newest result Oct 2026 (uploads folder year/month in the PDF URL).
Link stability (flood check): links are static wp-content/uploads/YYYY/MM/ PDFs, stable across repeat runs. No flood risk. Note: some titles carry double spaces and trailing dots; titles are not used for the seen check.

## Label pattern
Rows have no "type: parent" prefix; title is the notice itself.
- Jobs page: "Recruitment of <post> for <unit/SBU>", "Engagement of <post>", "Selection of Diploma Apprentices in BEL <unit>", "WALK-IN SELECTION ... APPRENTICESHIP TRAINEE". Post, unit and Advt no. are in the title/PDF; the filename carries the date (Advt-02092026). Row text also shows "Location" and "Last Date to Apply".
- Results page: "LIST OF CANDIDATES PROVISIONALLY SELECTED / SHORTLISTED FOR THE POST OF <post> [FOR <unit>]" = Result (selected list) or shortlist; "Result for the Post of <post> (Ref: Advertisement No: ...)" = Result (the Ref carries the parent Advt no, useful for matching); "RESULT OF THE WRITTEN TEST ..." = Result.
Parent for matching = "<post> + <unit/SBU>" from the title (e.g. "Deputy Engineer FTE, Central Services Division, Bengaluru Complex").

## Hold / pass rules for the sorter
Hold: "Absorption / re-employment of Defence Forces officers (serving/retired)" (ex-servicemen-only); "Engagement of Advisor" posts (Advisor for PDIC Bengaluru, Advisor for MS SBU: consultant / retired-type roles, hold unless the notice is open to all); any short-term walk-in for tiny apprentice/trainee engagements is a judgement call (see uncertain); form / certificate-format PDFs (OBC/SC/EWS formats, police verification, application form) if one ever comes through; Hindi duplicates.
Pass: Recruitment / Selection advertisements for regular and fixed-term engineer posts, Diploma Apprentice selection, all results / provisionally selected or shortlisted lists, call letters, corrigenda / extensions.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment of Advisor for PDIC, Bengaluru | New Job | Advisor PDIC Bengaluru | Hold (advisor/consultant) |
| RECRUITMENT FOR THE POST OF SR.ASST ENGR FOR GHAZIABAD UNIT | New Job | Sr Asst Engr Ghaziabad | Pass |
| Absorption/ re-employment of Defence Forces officers ... Sr. Deputy General Manager | New Job | Sr DGM Delhi/WFS | Hold (defence officers only) |
| Selection of Diploma Apprentices in BEL Ghaziabad | New Job | Diploma Apprentices Ghaziabad | Pass |
| Recruitment of Senior Engineer - Fixed Term Engineer - Export Manufacturing - SBU | New Job | Sr Engineer FTE Export Mfg SBU | Pass |
| WALK-IN SELECTION (WRITTEN TEST) ... SHORT TERM APPRENTICESHIP TRAINEE (ITI) | New Job | ITI Short Term Apprentice Trainee | Pass (see uncertain) |
| Recruitment of Deputy Engineer/ E-II (FTE) posts for NS(S and CS) SBU | New Job | Deputy Engineer E-II FTE NS(S&CS) | Pass |
| Engagement of Advisor for MS SBU. | New Job | Advisor MS SBU | Hold (advisor/consultant) |
| LIST ... SELECTED ... DEPUTY ENGINEER ON FIXED TENURE ... CENTRAL SERVICES BENGALURU | Result | Deputy Engineer FTE CS Bengaluru | Pass |
| List ... selected ... Trainee Engineer - I for BEL-Chennai Unit | Result | Trainee Engineer I Chennai | Pass |
| List ... shortlisted ... Project Engineer for Strategic Communication SBU | Result | Project Engineer SC SBU | Pass |
| Result ... Medical Officer - E-II FT Navi Mumbai (Ref Advt 17004/NAMU/2026/VMO/FT/01) | Result | Advt 17004/NAMU/2026/VMO/FT/01 | Pass |
| List ... Provisionally Shortlisted ... Senior Engineer/Deputy Manager MS SBU | Result | Sr Engineer/Dy Manager MS SBU | Pass |
| LIST ... SHORTLISTED ... PROJECT ENGINEER (03-09-26) | Result | Project Engineer | Pass |
| RESULT OF THE WRITTEN TEST 28.12.2025 and 28.06.2026 ... Engineering Assistant Trainee and Technician C | Result | EAT / Technician-C Bengaluru | Pass |
| LIST ... PROVISIONALLY SELECTED ... DRIVER FOR BEL-GHAZIABAD | Result | Driver Ghaziabad | Pass |
| Recruitment of Non-Executives for BEL Ibrahimpatnam Plant (link = certificate format) | Update/forms | Non-Executives Ibrahimpatnam | Pass the title, read the notice |
| List ... selected ... Field Operation Engineer and Project Engineer (Punjab, MP ...) | Result | FOE / Project Engineer | Pass |

## Proposed config (JSON)
```json
[
  {
    "id": "bel", "name": "BEL Careers", "runner": "india", "tier": "FREE", "level": "central", "type": "html",
    "url": "https://bel-india.in/job-notifications/",
    "extraCerts": ["certs/sectigo-ov-r36.pem"],
    "rowSelector": ".career-result-box", "rowTitle": "h2", "rowLink": "a.file-link", "limit": 25
  },
  {
    "id": "bel-results", "name": "BEL Results", "runner": "india", "tier": "FREE", "level": "central", "type": "html",
    "url": "https://bel-india.in/results/",
    "extraCerts": ["certs/sectigo-ov-r36.pem"],
    "rowSelector": ".career-result-box", "rowTitle": "h2",
    "rowLink": "a[href*=\"jobapply\"], a.file-link-results, a.file-link", "limit": 25
  }
]
```
The first entry is the current one, unchanged. The second is new; a new source is baselined on first run.

## Uncertain points
- Short-term apprentice / ITI trainee walk-ins: no standing rule says hold or pass; marked Pass (open to all eligible, written test). Change if BatLee wants them held.
- "Engagement of Advisor" posts are marked Hold as consultant-type roles; the PDF may be open to all, so the sorter should skim the eligibility line.
- Only page 1 of each list is read (10 rows). Fine at BEL's volume.
- Not verified: whether PDFs download free (plain wp-content URLs on the same host, expected yes; not tested).

## BatLee's corrections
- none yet

## Repairs
- none
