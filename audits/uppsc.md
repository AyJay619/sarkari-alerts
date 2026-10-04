# UPPSC (Uttar Pradesh Public Service Commission, uppsc.up.nic.in)
Audited: 2026-10-04 | Group: FREE | Status: BATCH AUDIT (sources.json NOT changed)

## BATCH SUMMARY BLOCK
```
SITE: UPPSC (uppsc-advt, uppsc-notices) | VERDICT: FIX
PROPOSED: 1) uppsc-notices: limit 30 -> 45 (homepage list holds 32 PDF links today, 2 already fall outside limit 30; with 47 it would catch all) 2) uppsc-advt: fix titleReplace backslashes ("^(.+?)\\s*,\\s*(.+)$") - cosmetic, a rebaseline is harmless (2 rows)
MISSING TODAY: nothing structural; titles on the homepage are cut with ".." (full title only in the link's title attribute; needs a small code change: prefer title attr when text ends in "..") so post/department names are partly lost. Advt page rows carry no post/exam name.
ASK BATLEE: allow a small fetchers.mjs change "use link title attribute when it is longer than the text" (recommend yes: gives clean PARENT names for all UPPSC items and several other sites)
```

## Pages watched and tested
All with the scanner's own fetchItems (free fetch), 3 repeats each, 60-340 ms, identical results. ScrapFly: 0 credits, not needed. No www host (www.uppsc.up.nic.in does not exist). http redirects 301 to https.

| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Notifications (open adverts, uppsc-advt) | https://uppsc.up.nic.in/CandidatePages/Notifications.aspx | free | FREE-OK. 2 rows today (D-6/E-1/2025 dated 21/09/2026, D-2/E-1/2026 dated 14/09/2026): only adverts whose application window is currently open. Page empties between recruitments, so `allowEmpty` is sensible. Columns: advt number, date, apply start/end dates; the "Examination Name" column is blank, so no post name. Link = View_Advertisement.aspx?ID=<n>&flag=E (HTML page, ID rises with each advert) |
| Homepage (uppsc-notices) | https://uppsc.up.nic.in/ | free, 183 KB | FREE-OK. Block "What's New" = 31 Open_PDF_DB.aspx PDF links + "UPPSC Exam Calendar" (32 with the calendar); no dates in that block |
| Homepage tab segments (Upcoming Exams / Results / Press / Download) | same homepage | free | duplicates of the What's New list (Open_PDF.aspx links, 4 per tab, FULL titles and dates). Not worth a separate source |
| "More" pages (FooterPages/Latest-News, Results, Press-Release, Downloads, Upcoming-Exams) | https://uppsc.up.nic.in/FooterPages/... | scanner: BROKEN (302 to homepage without a session cookie, so fetchItems returns the homepage again, 47 links); curl with the cookie from one homepage visit: 200 with the fuller lists | Not usable by the scanner as is (needs cookie support, a code change). Do NOT add |
| Advertisement_New.aspx, FooterPages/Notice | - | 302/404 | failed pages |

PDFs: Open_PDF_DB.aspx PDF links answer 302 to the homepage unless the request carries the session cookie (__AntiXsrfToken, set by any homepage visit) and Referer; with cookie they return a real PDF (tested: 762 KB application/pdf, free). So PDFs are free, but the sorter/extractor needs a "visit homepage first" step. View_Advertisement.aspx is an HTML detail page (same session behaviour). Tested from this PC only.

## What the scanner catches vs misses
- uppsc-notices: catches all 30 first links of 32. Misses 2 (limit 30). Everything in the What's New block is a notice/result/admit card, so one source is enough.
- uppsc-advt: catches both open adverts. A new advert shows as a new row (new ID).
- Posting speed: homepage shows about 35 notices spanning roughly 3 weeks (dates seen in the tab segments run 05 Oct to 29 Oct 2026, which look like future or mistyped dates on the site: do not trust site dates). Notices often come 1-3 a day, and the list order is not strictly by date. Limit 30-45 is ample. Existing state: 30 items seen on first run plus 2 later (grew from 30 to 32 in 2 days), no flood.
- Link stability: Open_PDF_DB tokens identical across fetches (diff clean). The seen file already holds them. No churn seen.

## Label pattern
Notice text (UPPER CASE): `<TYPE PHRASE> [FOR|OF|IN] ADVT. NO. <letter>-<n>/E-1/<year>, <DEPARTMENT>, <POST>, <S-xx/yy>`.
- Advert number format: A-n/E-1/YYYY (combined/State services style), D-n/E-1/YYYY (departmental/direct recruitment). Normalise "ADVT.NO.D-2/E-1/2024", "D-5-E-1-2025", "A-7/E-1/2021" to "Advt D-2/E-1/2024". PARENT = advert number + department/post if present, e.g. "Advt D-6/E-1/2025, Directorate of Ayurveda, Chikitsa Adhikari (Ayurved)". Exam name sometimes follows (e.g. "Combined State/Upper Subordinate Services (M.) Exam-2025").
- TYPE phrases: "RESULT OF ADVT" = Result; "LIST OF PROVISIONALLY SELECTED / SUPPLEMENTRY LIST OF SELECTED" = Result; "LIST OF CANDIDATES PROVISIONALLY QUALIFIED FOR MAINS/INTERVIEW" = Result (shortlist); "NOTICE REGARDING ADMIT CARD" = Admit Card; "CORRIGENDUM NOTICE" = Update; "NOTICE REGARDING INTERVIEW SCHEDULE" = Update (current cycle); "NOTICE REGARDING DOCUMENTS FOR APPOINTMENT" = Update (document verification); "DOWNLOAD MARKSHEET & CUT OFF" = Result-related, pass; generic "NOTICE REGARDING ADVT. NO. ..." = Update (open the PDF to see: postponement, cancellation, date, answer key or revised result); "FORMAT OF PREFERENCE SHEET", "DETAILS OF POSTS" = Update (pass; main exam stage).
- uppsc-advt rows: "UPPSC Advt. No. D-6/E-1/2025 dated 21/09/2026" = New Job (open the View_Advertisement page for posts/dept). Date is the advert date.
- Titles from the homepage end in ".." when long (cut at about 80 chars). The full title is the `title` attribute of the same link.

## Hold / pass rules (for the sorter)
Hold: "UPPSC Exam Calendar 2026" (general info); "NOTICE REGARDING ... PRASHIKSHAK ..." style departmental/instructor notices are NOT held (normal jobs); Hindi duplicates (none seen); any notice for LDCE/departmental/promotion exams; deputation/consultant posts; notices about debarment/normalisation/scribe; marks of recommended candidates / marksheet lists unless it is "download marksheet & cut off" (kept, applicants want it). The "Click here to view List of Candidates who are not selected in P.C.S.-2022 ..." banner link (Open_PDF.aspx, in the toppers area, not caught by `include`) is not caught and is old: ignore.
Pass: new adverts (uppsc-advt), results and provisional/supplementary selected lists, qualified-for-mains/interview lists, admit-card notices, corrigenda, interview schedules, document verification, cut-off/marksheet notices.
Not unambiguous enough for a keyword filter: none proposed.

## Sample links (2026-10-04)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| UPPSC Advt. No. D-6/E-1/2025 dated 21/09/2026 | New Job | Advt D-6/E-1/2025 | Pass |
| UPPSC Advt. No. D-2/E-1/2026 dated 14/09/2026 | New Job | Advt D-2/E-1/2026 | Pass |
| RESULT OF ADVT. NO.D-2/E-1/2024, UP AYUSH (AYURVEDA) DEPT, Reader Kaya Chikitsa S-09/02 | Result | Advt D-2/E-1/2024, Reader Kaya Chikitsa | Pass |
| RESULT OF ADVT. NO. D-1/E-1/2026, MEDICAL EDUCATION DEPT (ALLOPATHY)/ PROFESSOR NEPHROLOGY S-08/18 | Result | Advt D-1/E-1/2026, Professor Nephrology | Pass |
| RESULT OF ADVT. NO. D-2/E-1/2024, HIGHER EDUCATION DEPT, REGISTRAR S-03/01 | Result | Advt D-2/E-1/2024, Registrar | Pass |
| NOTICE REGARDING ADMIT CARD FOR ADVT NO. A-10/E-1/2025, ASSISTANT TOWN PLANNER (SPL. RECT.) (MAIN) EXAM-2025 (exam 06/10/2026) | Admit Card | Advt A-10/E-1/2025 | Pass |
| NOTICE REGARDING ADMIT CARD FOR ADVT.NO.D-6/E-1/2025, SWASTHYA SHIKSHA ADHIKARI (SCREENING) EXAM-2025 | Admit Card | Advt D-6/E-1/2025, Swasthya Shiksha Adhikari | Pass |
| NOTICE REGARDING ADMIT CARD OF ADVT. NO. A-7/E-1/2025, ASSISTANT PROFESSOR, GOVT... | Admit Card | Advt A-7/E-1/2025 | Pass |
| CORRIGENDUM NOTICE REGARDING ADVT. NO. D-6/E-1/2025, FOOD SAFETY AND DRUG ADMIN, INSPECTOR OF DRUGS | Update | Advt D-6/E-1/2025, Inspector of Drugs | Pass |
| CORRIGENDUM NOTICE ... D-6/E-1/2025, LABOUR DEPT, CHIKITSA ADHIKARI (HOMOEOPATHIC) S-11/31 | Update | Advt D-6/E-1/2025, Chikitsa Adhikari (Homoeopathic) | Pass |
| NOTICE REGARDING INTERVIEW SCHEDULE OF ADVT. NO. A-1/E-1/2025, COMBINED STATE/UPPER SUBORDINATE SERVICES (M.) | Update | Advt A-1/E-1/2025 (PCS Mains 2025) | Pass |
| LIST OF CANDIDATES PROVISIONALLY QUALIFIED FOR INTERVIEW IN ADVT. NO. A-1/E-1/2025 ... | Result | Advt A-1/E-1/2025 | Pass |
| LIST OF CANDIDATES PROVISIONALLY QUALIFIED FOR MAINS IN ADVT. NO. A-10/E-1/2025 ... | Result | Advt A-10/E-1/2025 | Pass |
| LIST OF PROVISIONALLY SELECTED CANDIDATES IN ADVT. NO. A-5/E-1/2025, ASSISTANT TEACHER TRAINED GRADUATE | Result | Advt A-5/E-1/2025 | Pass |
| SUPPLEMENTRY LIST OF SELECTED CANDIDATES IN ADVT. NO. A-7/E-1/2021, U.P. TECHNICAL EDUCATION (TEACHING) | Result | Advt A-7/E-1/2021 | Pass |
| NOTICE REAGARDING DOCUMENTS FOR APPOINTMENT FOR ADVT. NO. A-4/E-1/2025, COMPUTER ASSISTANT | Update | Advt A-4/E-1/2025 | Pass |
| NOTICE REGARDING DOWNLOAD MARKSHEET & CUT OFF FOR ADVT. NO. D-5-E-1-2025 [S-10-04] | Result | Advt D-5/E-1/2025, Deputy Secretary (IT) | Pass |
| FORMAT OF PREFERENCE SHEET FOR ADVT. NO. A-1/E-1/2025 ... | Update | Advt A-1/E-1/2025 | Pass |
| UPPSC Exam Calendar 2026 | Noise | - | Hold (general info; also not caught since text is under minTitle? it IS caught as Open_PDF_DB link) |

## Proposed config (JSON, for sources.json when BatLee approves)
```json
{
  "id": "uppsc-advt", "name": "UPPSC Advertisements", "runner": "india", "tier": "FREE", "level": "state", "type": "html",
  "url": "https://uppsc.up.nic.in/CandidatePages/Notifications.aspx",
  "rowSelector": "table tr:has(a[href*='View_Advertisement'])",
  "rowTitle": "td:nth-child(4)",
  "rowLink": "a[href*='View_Advertisement']",
  "titleReplace": ["^(.+?)\\s*,\\s*(.+)$", "UPPSC Advt. No. $1 dated $2"],
  "minTitle": 8, "limit": 20, "allowEmpty": true, "timeoutMs": 15000
},
{
  "id": "uppsc-notices", "name": "UPPSC Notices", "runner": "india", "tier": "FREE", "level": "state", "type": "html",
  "url": "https://uppsc.up.nic.in/",
  "include": "Open_PDF_DB",
  "minTitle": 20, "limit": 45, "timeoutMs": 15000
}
```
Note: changing the advt titleReplace/allowEmpty changes its fingerprint, so it rebaselines (2 current adverts will not be re-sent). The notices source is unchanged except limit; if limit is not part of the fingerprint nothing is re-caught.

## Uncertain points
- Site dates in the homepage tabs run to 29 Oct 2026, ahead of today (4 Oct 2026): either future-dated or typos. Do not use them for ordering.
- The uppsc-advt page row has no post/department name; the sorter must open View_Advertisement.aspx (session cookie needed) to learn the posts.
- The More pages (fuller lists) need a session cookie; not reachable by the scanner today.
- One title already in state ("...MEDICAL EDUCATION DEPARTMENT U.P. (ALLOPATHY)/..") shows the ".." truncation can also cut the post name, which makes duplicate-looking titles (e.g. two "NOTICE REGARDING ADVT. NO. A-10/E-1/2023 U.P. KHADI AND VILLAGE INDUSTRIES BOARD.." differ only in the PDF link).

## BatLee's corrections
- none yet

## Repairs
- none yet
