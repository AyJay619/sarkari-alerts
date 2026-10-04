## BATCH SUMMARY BLOCK
```
SITE: POWERGRID (powergrid.in) | VERDICT: FIX
PROPOSED: 1. Change selector of "powergrid" from ".newBorderBox a.showMoreBtn" to ".newBorderBox .views-row a" (keep contextClosest/contextFind, drop the "Click here|register|login" exclude, limit 400, rebaseline); reason: current links are cut off before ".pdf" and 404
MISSING TODAY: coverage is complete, but all 331 current file links are broken (end in "." with no extension, GET returns 404) so the sorter cannot open them; 50 apply-portal/external links are skipped on purpose
ASK BATLEE: none
```

# POWERGRID (powergrid.in)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Job Opportunities (current "powergrid") | https://www.powergrid.in/en/job-opportunities | free fetchItems, no certs needed | FREE-OK, 0.2-0.4 s, 4/4 runs identical (329 items today), page 630 KB |

- Host: https://www.powergrid.in works. http:// and no-www (powergrid.in) did not answer from this PC (curl got no response), so keep https + www.
- Server-rendered Drupal HTML; no JS needed.
- Other pages in the menu: /en/job-opportunities-archive (old postings, 20 boxes; not needed), /en/job-opportunities1 (Employment opportunities, no notice list), regional pages such as /en/job-opportunities/northern-region-i-delhi-recruitment (2023 contract engagement text, not opened in depth; not needed). /en/annual-results etc. are investor results, not job results: ignore. Admit cards, results and notices of a recruitment sit INSIDE the same box on the job-opportunities page (e.g. "Notice-5_Link to download Admit card", "Notice 6 Provisionally selected"), so one page covers everything.

## What the scanner catches vs misses
Page layout: one `.newBorderBox` per advertisement (37 boxes, newest first, date dd/mm/yyyy at the top, h4 = advertisement title incl. Advt No and date). Inside each box are the documents (Detailed Advertisement, notices 1..N, window ads, apply / mock-test links).
BUG FOUND: every `a.showMoreBtn` href (331 of 379) is cut before the extension, e.g. `...ET2027_Detailed_Advertisement_For%20Website_1.` (GET returns 404). The same box has a `.views-row` list holding the SAME documents with correct links `...For%20Website_1.pdf` (200 application/pdf). So the current scanner catches every document (329) but with unopenable links. Titles and uniqueness are fine, so the seen check works, but the sorter and BatLee cannot open the PDFs.
Fix tested: selector `.newBorderBox .views-row a` returns the same documents with correct .pdf links, 3/3 runs identical (329 rows exist; tested with limit 60, first 22 checked). The 50 links skipped now (apply portal careers.powergrid.in login pages, safelinks mock-test / TA-form links, cbexams admit-card login pages) exist only in the showMoreBtn list; mostly noise, and the matching PDF notice is in the views-row list.
Posting speed: newest advert (Engineer Trainees-2027 through GATE 2027, CC/03/2026 dated 24.09.2026) is already on the page. Notices for existing recruitments are appended inside their box.
Link stability (flood check): static /sites/default/files/job_opportunities_document/ file URLs, stable across runs. Rebaseline will treat all as seen on first run, no flood. 329 rows today vs limit 400; raise the limit if the page ever grows past that.

## Label pattern
Scanner title = "<Advertisement title (h4)>: <document title>".
- Parent = text before ": ", always carries "Advt No. CC/NN/YYYY" -> use "Advt CC/03/2026".
- Type from the document part: "Detailed Advertisement" / "Window Advertisement" = New Job; "Notice N_Commencement of application window" = Update; "Application in draft mode", "Application Count / No. of applications received" = Noise; "Date of CBT / Eligibility status", "Link to download Admit card" = Admit Card; "Provisionally shortlisted for DV and Interview" = Result (shortlist); "Provisionally selected" = Result; "Objection Management" = Answer Key / Update; TA claims = Noise.
- "Window Advertisement-Hindi" = Hindi duplicate.

## Hold / pass rules for the sorter
Hold: Hindi window advertisements; "Application in draft mode", "Application Count / No. of applications received", TA claim notices, portal-unavailable notices; "Engagement of Experienced Personnel on contract basis" (RDSS, field engineer, company secretary contract) = contract roles; old 2021-2024 boxes if they ever resurface.
Pass: Engineer Trainee (GATE) and Officer Trainee (Law / Finance / CS) advertisements, executive manager posts, Detailed + English window advertisements, commencement / extension / corrigendum notices, CBT date + admit card, shortlists, provisional selection lists, objection windows.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| ET 2027 through GATE 2027: Detailed Advertisement | New Job | Advt CC/03/2026 | Pass |
| ...CC/03/2026: Window Advertisement - English | New Job | Advt CC/03/2026 | Pass (duplicate) |
| ...CC/03/2026: Window Advertisement-Hindi | New Job | Advt CC/03/2026 | Hold (Hindi dup) |
| Special Recruitment Drive ST, OT (CS): Detailed Advertisement | New Job | Advt CC/02/2026 | Pass |
| ...CC/02/2026: Notice-1 Portal Unavailable 1 hour | Noise | Advt CC/02/2026 | Hold |
| ...CC/02/2026: Notice-2 Application in Draft Mode | Noise | Advt CC/02/2026 | Hold |
| ...CC/02/2026: Notice-3 Application Count | Noise | Advt CC/02/2026 | Hold |
| ...CC/02/2026: Notice_4 Date of CBT and Eligibility Status | Admit Card/Update | Advt CC/02/2026 | Pass |
| ...CC/02/2026: Notice-5 Link to download Admit card | Admit Card | Advt CC/02/2026 | Pass |
| ...CC/02/2026: Notice-6 Submission of TA Claims | Noise | Advt CC/02/2026 | Hold |
| ...CC/02/2026: Notice-7 Objection Management Link | Answer Key/Update | Advt CC/02/2026 | Pass |
| Officer Trainee (Law) 2025: Detailed Advertisement | New Job | Advt CC/06/2025 | Pass (old) |
| ...CC/06/2025: Notice 2 Updating CLAT 2026 Roll No. | Update | Advt CC/06/2025 | Pass |
| ...CC/06/2025: Notice 5 Provisionally shortlisted for DV and Interview | Result | Advt CC/06/2025 | Pass |
| ...CC/06/2025: Notice 6 Provisionally selected for OT(Law) | Result | Advt CC/06/2025 | Pass |
| OT (Finance) and OT (CS): Detailed Advertisement | New Job | Advt CC/05/2025 | Pass (old) |
| ...CC/05/2025: Notice 02 Application Count, CBT Schedule | Update | Advt CC/05/2025 | Pass (CBT schedule) |
| ENGAGEMENT OF EXPERIENCED PERSONNEL ON CONTRACT BASIS, RDSS (2022) | New Job | RDSS contract | Hold |

## Proposed config (JSON)
```json
{
  "id": "powergrid",
  "name": "POWERGRID",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.powergrid.in/en/job-opportunities",
  "limit": 400,
  "selector": ".newBorderBox .views-row a",
  "contextClosest": ".newBorderBox",
  "contextFind": "h4",
  "minTitle": 8,
  "rebaseline": true
}
```
The selector change triggers a silent rebaseline by itself.

## Uncertain points
- The 50 apply-portal / external links (mock test, admit-card login) are dropped; assumed unwanted since the PDF notice is caught instead.
- One source cannot mix both link sets; a second source with the old selector would only add broken links.
- Regional recruitment pages were not opened in depth (looked like 2023 contract engagements).
- "Application Count" notices: Notice 02 of CC/05/2025 combines count and CBT schedule, so the sorter should read the title before holding.

## BatLee's corrections
- none yet

## Repairs
- none yet
