# RRB (21 Railway Recruitment Board regional sites, rrb.indianrailways.gov.in)
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (sources.json NOT changed)

## BATCH SUMMARY BLOCK
```
SITE: RRB (21 regions) | VERDICT: FIX
PROPOSED: 1) in all 21 rrb-* sources change include to "getdata[?]loc=[a-z]+&cenum=", titleTemplate to "RRB <Region> {text}", groupTemplate to "RRB {text}" (same URLs, limit 400; scanner re-baselines by itself). Reads the homepage "Updates" lists (3 tabs, dated notices) instead of the category index.
MISSING TODAY: every new notice inside an existing CEN category (new schedule, results, e-call letter, extension, city slip) - the scanner only sees brand-new CEN/category links (index has no dates); only the 9 group alerts since 26-Sep were new categories.
ASK BATLEE: (a) replace the old index source (recommended: it adds nothing the dated list lacks, avoids 21 extra fetches) or keep both? (b) expect about 240 group alerts/month (about 8/day, mostly per-region Selection List / Document Verification) - sorter holds none by default; recommend pass all, one line each.
ASK BATLEE: (c) links open category pages and need a browser session/cookie (a cold direct hit gets "Request Rejected"); accept, as today.
```

## What was tested
All 21 regions fetched twice (15 s apart) with the scanner's own `fetchItems(src)` (free fetch, about 50-230 ms each, HTTP 200, no failures, no ScrapFly, 0 credits). The 21 pages are one identical template (Java portal, same HTML), only the region slug differs.

### Pages watched today (existing config)
| Page | URL | Method | Verdict |
|---|---|---|---|
| Region home, left menu "Recruitment (CENs)" = index of category links `getdata?cennum=NN/YYYY&loc=<region>&category=<Category>` | https://rrb.indianrailways.gov.in/<region> (all 21 load; https, no www; http and www variants do NOT connect) | free fetch | FREE-OK, but only an INDEX (no dates, no notice titles) |

Per region 218-267 links (Ahmedabad 263, Ajmer 234, Prayagraj 236, Bengaluru 257, Bhopal 237, Bhubaneswar 247, Bilaspur 233, Chandigarh 236, Chennai 262, Gorakhpur 232, Guwahati 267, Jammu 223, Kolkata 239, Malda 218, Mumbai 253, Muzaffarpur 238, Patna 244, Ranchi 240, Secunderabad 248, Siliguri 236, Thiruvananthapuram 229). No region differs structurally or fails.

### Flood / stability check (old and new feed)
- Old index: two fetches 15 s apart: 0 link or title differences in all 21 regions; no duplicate links; titles always full ("RRB Patna CEN 01/2024: Exam Schedule"); the seen record holds the same 218-267 per region. The only items not yet in the seen record were genuinely new ones (CEN 03/2026 City Intimation appeared on all regions today; 01/2025 and 05/2025 categories on Ajmer / Thiruvananthapuram). No flood risk.
- New dated list (below): 151-180 links per region, 0 differences between two fetches in all 21. Old rows only roll off the end, no flood.
- Group dedupe works: with the old titles 287 distinct group titles for about 5000 region links; 204 of them appear on all 21 regions and merge into one alert (also_on shows the regions); the rest are region-specific (Selection List, Medical, Document Verification, Results). The CEN number with a space (RPF 01/2024, RRC 01/2019) survives as "CEN RPF 01/2024".

## THE KEY FINDING: the index cannot see new notices
The link in the index is a category page ("CEN 01/2024 / Exam Schedule") that already holds many notices. A new notice added under an existing category does not create a new link, so the scanner does not notice it. Alerts only fire when a brand-new CEN or a brand-new category appears. Today's example: Patna category page CEN 01/2024 Exam Schedule lists notices dated 26-06-2025 back to 03-03-2025; if a new one is added tomorrow nothing changes in the index.

## Better page: the "Updates" box on the same region home page (already in the same HTML, so no extra request)
The homepage has a 3-tab "Updates" box (Pre-Examination Phase / Examination Phase / Post-Examination Phase) of the latest dated notices. Each row: `<a href="/getdata?loc=patna&cenum=06/2025&category=Application (Special Notice)">(06/2025) Application (Special Notice) (28-09-2026)</a>`. Note the parameter is spelled `cenum` (one n) here, which is why the current include `getdata[?]cennum` ignores all of it.
- About 200 rows per region (Patna: 47 + 74 + 79), newest first, covering about May 2026 to today (today's newest: 03-Oct-2026 Mock Test Link CEN 02/2026, 02-Oct City Intimation CEN 03/2026 and 04/2026 Exam Schedule, 01-Oct Exam Results CEN 01/2025).
- Title text already carries CEN number, category and PUBLICATION DATE, so a new notice under an old category gives a new title and is caught.
- Repeated identical rows (same CEN + category + date, linked to the same category page) collapse to one (156 unique of 200 for Patna). Limit: a second notice of the same CEN/category on the SAME day shows as the same title and is not a second alert (the category page lists both). Acceptable.
- Tested with the scanner's fetchItems and a modified source: 151-180 items per region, 0 diffs on repeat, 832 distinct group titles in the window, of which 101 appear on all 21 regions (merged to one alert), 558 on a single region (region-specific results and lists).
- Volume (distinct group titles by month): Apr 9, May 61, Jun 114, Jul 192, Aug 193, Sep 242, Oct (3 days) 21. Expect about 240/month (about 8/day) group alerts; most are per-region Selection List / Document Verification / Exam Results (one region each). Categories in the window: Document Verification 287, Selection List 197, Exam Results 110, Special Notice on Examination 90, Medical Examination 48, Application (Special Notice) 32, Exam Schedule 17, City Intimation 12, Notification 11, Mock Test Link 10, Objection Tracker 10, E-Call Letters 8.

## Other pages (checked)
| Page | Result |
|---|---|
| https://rrb.indianrailways.gov.in/getdata?loc=<region> ("View more" of the Updates box: full notice list with description, date and PDF path, 10 per page) | Needs a session cookie. Without it the WAF returns HTTP 200 with a 247-byte "Request Rejected" page. With cookies from any prior page of the site it works. The scanner has no cookie handling, so not usable as a source. The `headers` option could carry a fixed Cookie, but the cookies are per-session WAF tokens, so not stable: not recommended. |
| Category page `getdata?cennum=..&loc=..&category=..` | Same cookie rule. With a cookie: table with CEN, category, description, date, PDF dropdown. PDFs are at `/-/image/<file>.pdf/examsDocuments` and ALSO need the cookie (no cookie: 247-byte rejection; with cookie: real PDF). So PDFs do not download free from the scanner; the sorter would need a cookie-holding fetch (visit the region home first, reuse cookies) or a browser. |
| `/whatsnew/whatsnewviewmore`, `/<region>/whatsNew` (ticker) | Empty or generic (page = 0 notices; ajax returns 0 bytes). Not useful. |
| rrb.indianrailways.gov.in/ (national home) | Loads (79 KB), no notice list. rrbapply.gov.in (apply portal, SPA) not tested. |
| RRB central CEN notification PDFs (indianrailways.gov.in) | Not tested; new CEN notifications show up as "(NN/YYYY) Notification (date)" in the Updates box on all 21 regions. |

## Label pattern
Title text: `(<CEN>) <Category> (<dd-mm-yyyy>)`, CEN is `NN/YYYY`, or `RPF NN/YYYY`, or `RRC NN/YYYY`. Category is one of a fixed list: Notification, Indicative Notice, Application (Special Notice), Mock Test Link, City Intimation (Exam), E-Call Letters, Exam Schedule, Objection Tracker, Exam Results, Selection List, Document Verification, Medical Examination, Special Notice on Examination.
Scanner output with the proposed config: title `RRB Patna (06/2025) Application (Special Notice) (28-09-2026)`, groupTitle `RRB (06/2025) Application (Special Notice) (28-09-2026)`, link = category page. PARENT for the sorter = the CEN (for example "RRB CEN 06/2025"); the CEN number maps to the exam: 01/2024 ALP, 02/2024 and RPF = Constable/SI, 03/2024 JE and others (from notice text). Same-day, same-CEN, same-category notices on all regions are the same notice. Type mapping: Notification / Indicative Notice = New Job; E-Call Letters and City Intimation = Admit Card; Exam Results / Selection List = Result; Objection Tracker = Answer Key; Application (Special Notice), Exam Schedule, Special Notice on Examination, Document Verification, Medical Examination = Update; Mock Test Link = Noise (see rules).

## Hold / pass rules for the sorter
- Pass: Notification and Indicative Notice (new CEN, new job), Exam Schedule, City Intimation (exam city / date), E-Call Letters (admit card), Exam Results, Selection List, Objection Tracker (answer key / response sheet), Document Verification schedules and lists, Application (Special Notice: extensions, fee refund, corrections).
- Hold: Mock Test Link (practice link, no information); Medical Examination lists (info for already-selected, per-region, low value) unless BatLee says otherwise; Special Notice on Examination when it is general info (normalisation, scribe, debarment, common-mistakes); Hindi duplicates; RRC and RPF only if BatLee does not want them (RPF = Constable / SI, a normal job: recommend pass).
- Region-specific lists (Selection List, Document Verification, Results with one region only) are one alert each; the sorter should merge per CEN + date into a single line ("RRB CEN 03/2025 Selection List, 29-09-2026, Patna, Ranchi, ...").
- No script keyword filters (standing decision).

## Sample links (audit day)
| Title (as scanner would give) | Type | Parent | Pass/Hold |
|---|---|---|---|
| RRB Patna (02/2026) Mock Test Link (03-10-2026) | Noise | CEN 02/2026 Technician Gr I | Hold |
| RRB Patna (03/2026) City Intimation (Exam) (02-10-2026) | Admit Card | CEN 03/2026 | Pass |
| RRB Patna (04/2026) Exam Schedule (02-10-2026) | Update | CEN 04/2026 (JE, DMS, CMA) | Pass |
| RRB Patna (01/2025) Exam Results (01-10-2026) | Result | CEN 01/2025 | Pass |
| RRB Patna (07/2025) Objection Tracker (24-09-2026) | Answer Key | CEN 07/2025 | Pass |
| RRB Patna (06/2025) Application (Special Notice) (28-09-2026) | Update | CEN 06/2025 (refund of failed fee, extension) | Pass |
| RRB (all 21) (06/2025) E-Call Letters (26-09-2026) | Admit Card | CEN 06/2025 | Pass |
| RRB (all 21) (05/2026) Notification (14-09-2026) | New Job | CEN 05/2026 | Pass |
| RRB (all 21) (04/2026) Notification (13-08-2026) | New Job | CEN 04/2026 | Pass |
| RRB (all 21) (09/2025) Notification (25-08-2026) | New Job | CEN 09/2025 | Pass |
| RRB (all 21) (01/2026) Exam Schedule (21-09-2026) | Update | CEN 01/2026 | Pass |
| RRB (21) (08/2024) Special Notice on Examination (28-09-2026) | Update (check text) | CEN 08/2024 | Pass or hold after reading |
| RRB (1) (03/2025) Selection List (29-09-2026) | Result | CEN 03/2025 | Pass (one region) |
| RRB (3) (05/2025) Document Verification (29-09-2026) | Update | CEN 05/2025 | Pass |
| RRB (1) (03/2024) Exam Results (25-09-2026) | Result | CEN 03/2024 | Pass |
| RRB Ajmer CEN 01/2025: Selection List (old style, new today) | Result | CEN 01/2025 | Pass |

## Proposed config (each of the 21 sources; only the three keys marked change; id, url, region, group, groupName stay)
```json
{
  "id": "rrb-patna",
  "name": "RRB Patna",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://rrb.indianrailways.gov.in/patna",
  "include": "getdata[?]loc=[a-z]+&cenum=",
  "titleTemplate": "RRB Patna {text}",
  "minTitle": 3,
  "limit": 400,
  "group": "rrb",
  "groupName": "RRB",
  "region": "Patna",
  "groupTemplate": "RRB {text}"
}
```
Changed keys: include, titleTemplate, groupTemplate (no extra requests; same page). Re-baseline happens by itself on the first scan (titles change), so nothing floods. Optional second source per region to keep the old index (not recommended): the old include stays on a source with a different id.

## Uncertain points
- Links go to a category page that needs a browser session; a first direct hit from a Telegram button may show "Request Rejected" until the RRB home has been opened once (tested with curl only; no browser test). Same as today.
- Two notices of the same CEN + category on the same day appear as one alert (identical title).
- Updates box covers only about the last 5 months (about 200 rows). If RRB publishes more than 200 notices between two scans (not realistic at 8/day) the oldest would be missed.
- CEN-to-exam mapping (which CEN is which exam) was not verified against a CEN notification PDF; the sorter should read the notice text through a cookie session.
- Group seen list currently holds 9 old-style titles ("RRB CEN 03/2026: ..."); after the change the new-style titles differ, which is harmless because of the re-baseline.

## BatLee's corrections
- none yet

## Repairs
- none yet
