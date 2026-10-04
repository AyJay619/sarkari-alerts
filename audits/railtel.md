# RailTel Careers
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (batch mode, nothing applied)

## BATCH SUMMARY BLOCK
```
SITE: RailTel Careers | VERDICT: FIX
PROPOSED: 1) railtel: replace li/span.title selector with tables: selector "table.railtel_table a[href]", contextClosest "table", contextFind "tr.heading td", minTitle 4, limit 80 (drop rowSelector/rowTitle/rowLink); keep url, extraCerts, exclude; auto re-baseline.
MISSING TODAY: all 2026 content. Current notices (Civil Engineer SR, ED/GGM deputation WR, BHISHM, KSWAN, Data Centre regular recruitment, Apprenticeship 2026-27, corrigendum 24-09-2026) sit in table.railtel_table boxes; the scanner only reads an old li archive whose newest item is Feb 2026.
ASK BATLEE: none (recommend FIX as proposed; most RailTel posts are deputation/contract = HOLD, only regular recruitment, apprentices and their results/admit cards pass).
```

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Careers (all notices) | https://www.railtel.in/career.html | free, needs extraCerts certs/sectigo-ov-r36.pem (already set) | FREE-OK |
| Careers menu page | /careers.html | not tested separately (menu link only) | not needed |
| Recruitment portal | http://recruitment.railtelindia.com/ | curl returned no response (connection failed) | not usable, not tested further |

Free fetch via scanner `fetchItems`: 4 runs, all OK, 60 items, first ~1.3 s then ~0.15 s. No flakiness. No ScrapFly needed (0 credits). PDFs live under /images/careers/ on the same host (not tested for download; links are plain).

## What the page really contains
- career.html holds 54 `table.railtel_table` boxes, newest first. Each box = one recruitment: first row `tr.heading td` = the recruitment name (parent), following rows = its notices (vacancy notice, corrigendum, shortlist, result, proforma). A blinking "new" gif marks the latest items.
- Below that, an old archive `li:has(span.title)` list (311 li, many inside HTML comments/old years; first 60 are Feb 2026 and older). This is the ONLY thing the scanner reads now, so it sees nothing from 2026-03 onwards.
- 189 PDF rows in tables. Limit 60 reaches back to about Nov 2025 with the proposed selector; 80 is safer when a big recruitment adds many rows at once.

## Scanner: catches vs misses
- Catches: only old archive li items (all already in seen state, nothing new will ever appear there).
- Misses: everything current (see MISSING TODAY).
- Posting speed: RailTel adds a new box or a new row at the top; one scan per run is enough. Flood check: link text is generic ("Corrigendum-1", "Annexure-I"), so the heading must be prefixed (contextClosest does this). Links are stable file names. One quirk: a few rows link to Index.html or have odd links ("Click here"); harmless.

## Label pattern
Title as the scanner will produce it: `<Recruitment heading>: <row text>`
e.g. `DEPUTATION for 1 post of ED/GGM/GM Technical/ RailTel / Western Region/ Mumbai: Corrigendum-1`.
- PARENT = the text before the first ": " (the box heading). Vacancy numbers sometimes appear in heading (RailTel/2026/P&A/03/SR) or in PDF name (Vacancy RE-05-2026.pdf).
- TYPE from the row text after the colon: "Detailed Vacancy Notice"/"Notification" = New Job; "Corrigendum" = Update; "List of ... shortlisted / Cut-off marks / Result / Empanelled / Provisionally suitable" = Result; "Admit card" = Admit Card; "Notice inviting objections" = Update; "Annexure / Proforma / Performa / Application form" = Noise (attachment of the notice above).
- Note: "Corrigendum-1" etc. have dates only in the PDF name (e.g. Corrigendum dt 24092026.pdf = 24-09-2026).

## Hold / pass rules (for the sorter)
HOLD: Deputation / Absorption / Re-employment notices (most RailTel notices), Advisor / Consultant posts, contract-basis project engagements (MPSEDC DC-DR, KSWAN, KSITM, BHISHM medical consultant, Signalling/Kavach, Solution Architect) per standing rules for consultants unless BatLee decides contract jobs are wanted; Annexures, Proforma/Performa, application format attachments.
PASS: Regular recruitment (e.g. "Regular recruitment in Technical, Marketing and Finance Departments ... 48 Posts", "Data Centre Posts" 2026) and all its admit card, objection, cut-off, shortlist, result notices; Apprenticeship Training 2026-27 and its results; corrigenda/extensions on any passed job.
Open question left to the sorter: contract "Engagement of Experienced Technical Personnel" notices are real jobs for engineers but are project contracts; treated as HOLD by the contract rule.

## Sample links (audit day, proposed selector)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Provisional list for Civil Engineer on contract basis | Result | Civil Engineer SR RailTel/2026/P&A/03/SR | Hold (contract) |
| Notice for Engagement of Experienced Civil Engineer (07-08-2026) | New Job | same | Hold (contract) |
| Corrigendum-1 (24-09-2026) | Update | Deputation 1 post ED/GGM/GM Tech WR Mumbai | Hold (deputation) |
| Application proforma | Noise | same | Hold |
| List of Provisionally Empanelled Candidate | Result | BHISHM Medical Consultant | Hold (consultant) |
| Result Published for KSWAN Project List-III | Result | KSWAN project (SR) | Hold (contract) |
| Cut-off Marks Data Centre 2026 | Result | Regular Recruitment Technical Dept, Data Centre posts | Pass |
| List of Provisionally Suitable Candidates for Pre-Appointment Medical Exam | Result | same | Pass |
| Provisional Eligibility List | Result | same | Pass |
| Detailed Vacancy Notice RCIL/2026/P&A/44/1 and Application Form (07-03-2026) | New Job | same | Pass |
| Notice regarding Apprenticeship Training (FY 2026-27) | New Job | Apprenticeship Training FY 2026-27 | Pass |
| Detailed Vacancy Notice 2 posts Manager/Dy Mgr/AM (Tech) | New Job | Vacancy RE-05-2026 | Hold (re-employment) |
| Corrigendum-1 (16-06-2026) | Update | MPSEDC DC-DR project | Hold (contract) |
| Annexure-I/II/III | Noise | MPSEDC DC-DR | Hold |
| Vacancy notice 2 posts Jr Translator (E-0) Rajbhasha | New Job | same | Hold (deputation/re-employment) |
| Cut-off marks of CBT Result and Provisional Suitability List | Result | Regular recruitment 48 posts 2025 | Pass |
| Notice regarding Admit card and mock test link | Admit Card | same | Pass |
| Notice inviting objections w.r.t. CBT held 18.08.2025 | Update | same | Pass |

## Proposed config (railtel)
```json
{
  "id": "railtel",
  "name": "RailTel Careers",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.railtel.in/career.html",
  "extraCerts": ["certs/sectigo-ov-r36.pem"],
  "selector": "table.railtel_table a[href]",
  "contextClosest": "table",
  "contextFind": "tr.heading td",
  "minTitle": 4,
  "exclude": "compassionate|qualified|roll no|unique id",
  "limit": 80
}
```
Tested with this selector (limit 60): 60 items, correct headings, no errors. Selector change triggers silent re-baseline automatically, so no flood. No allowEmpty needed (page never empties).

## Uncertain
- The li archive below is dropped by this proposal; it is old (Feb 2026 and older) and duplicates table content, so nothing is lost.
- A few rows link to non-PDF pages (Index.html "Click here"); sorter can ignore.
- recruitment.railtelindia.com did not answer from this PC; not checked in a browser.
- Whether BatLee wants contract-basis project posts as jobs (currently HOLD by consultant/contract rule).

## BatLee's corrections
- none yet

## Repairs
- none
