# Noida Metro Careers (NMRC)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (works; one small optional improvement)

## BATCH SUMMARY BLOCK
SITE: Noida Metro Careers | VERDICT: OK
PROPOSED: 1) optional: add "contextClosest":"tr", "contextFind":"td:nth-child(3)" and selector "#careerTable tbody td a" so each title becomes "<post advertised>: <link text>" (clean PARENT for the sorter); rebaseline on first run. Keep render true (plain fetch fails), exclude and include as they are.
MISSING TODAY: nothing found (page lists only 2 adverts now; both caught; results/notices are added as extra links in the same row and are caught).
ASK BATLEE: none (both live adverts are contract / young-professional posts = HOLD by the standing rule).

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Career List (only recruitment page; one table) | https://www.nmrcnoida.com/Career/public-career | scanner fetchItems with render true (pinned Chromium, about 5 s) | FREE-OK |
| no-www / http variants | https://nmrcnoida.com/..., http://www... | curl returns 200 with the same page | same page |

Notes: node's own fetch (render false) FAILS with "Response does not match the HTTP/1.1 protocol (Invalid header token)" (server sends a malformed header; curl tolerates it). So render true is needed, but only as a workaround for this header bug: the page itself is fully server-rendered HTML, no JS needed. No ScrapFly needed, 0 credits. PDFs under /Upload/CareersRecentItems/<n>/ are plain files. Not tested by downloading (no download done).
Other pages: none useful. A "Public Notice" modal shows an image only (/career-notice.png). Static link list holds standing documents (medical standards, certificate formats) = noise. No separate results page; results are attached as extra links in the table row (seen earlier: "Result for the post of DGM (Company Secretary)").

## Test results
- Scanner's own fetchItems on current source: 2 items, identical on 3 runs (5.0 to 5.2 s). No flakiness.
- Table "careerTable": columns S.No | Advertisement No. | Post Advertised | Start Date | Close Date | Recent Updates (links). Today 2 rows (adverts 05/2026 and 04/2026). Older rows (ids 44, 45 in seen file) were removed from the page by NMRC, so the page empties/rotates: do not rely on old rows staying.
- Link stability: links are /Upload/CareersRecentItems/<row id>/<file>.pdf, stable. Seen file already holds 7 entries, no flood risk (limit 30 vs 5-10 links max).
- Proposed context variant tested: 5 items, titles like "Recruitment of Young Professional (Legal) on Direct Contract Basis in NMRC: Advt. Young Professional Legal". Exclude keeps dropping "Application Form" and "Combined Format Certificate" (the exclude regex is also applied on the longer title; "format" matches "Combined Format Certificate"; with the context title the application-form links are still dropped by the existing exclude, which is why the test above ran with exclude blank).

## What the scanner catches vs misses
- Catches: new adverts and any new link (result, notice, corrigendum, cancellation) in a row, as soon as NMRC publishes (page is live content). Posting speed: same day.
- Misses: nothing found. Caution: a corrigendum PDF with "format" or "certificate" in its name would be excluded; low risk.

## Label pattern
Today's source: title = PDF link text only ("Advertisement 22.08.2026", "Advt. Young Professional Legal", "Result for the post of DGM (Project - Finance)", "Cancellation Notice", "Officer Posts 01.04.2026"); the parent (post name and advert number NMRC/HR/Rectt./NN/YYYY) is not in the title. With the proposed context option: "<Post Advertised>: <link text>". Advert number appears in the Advertisement No. column (not captured); the upload folder id (47, 46, ...) identifies the row, so links in one row belong to the same parent. Type from link text: Advertisement / Advt = New Job; Result = Result; Cancellation / Corrigendum = Update.

## Hold / pass rules for the sorter
HOLD: young professional, consultant, contract-basis engagements of the "Senior Supervisor project works on contract" kind (judge by post: short project contracts are small contract roles; recommend HOLD unless BatLee says NMRC contract posts are wanted), deputation / lateral posts, application forms, certificate formats, compassionate appointment, qualified / roll-no / unique-id lists, standing documents (medical standards).
PASS: regular officer / executive / staff advertisements, results (incl. shortlists), exam / interview schedules, corrigenda / cancellation notices tied to an advert.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Advertisement 22.08.2026 | New Job | Senior Supervisors, Project Works, contract (NMRC/HR/Rectt./05/2026), closes 22-09-2026 | HOLD (contract) |
| Application Form (row 47) | Noise | same | HOLD |
| Combined Format Certificate | Noise | same | HOLD |
| Advt. Young Professional Legal | New Job | Young Professional (Legal), NMRC/HR/Rectt./04/2026, closed 14-08-2026 | HOLD (young professional) |
| Application Form (row 46) | Noise | same | HOLD |
Earlier seen: Officer Posts 01.04.2026; SSO or SO Legal Post 01.04.2026; Result DGM (Company Secretary); Result DGM (Project-Finance); Cancellation Notice (these 5 no longer on the page).

## Proposed config (optional)
```json
{
  "id": "nmrc",
  "url": "https://www.nmrcnoida.com/Career/public-career",
  "render": true,
  "selector": "#careerTable tbody td a",
  "contextClosest": "tr",
  "contextFind": "td:nth-child(3)",
  "include": "CareersRecentItems",
  "exclude": "application form|format|certificate|compassionate|qualified|roll no|unique id",
  "minTitle": 12,
  "limit": 30
}
```
(other fields unchanged; rebaseline happens automatically since selector changes.) Not run end to end with the exclude, only the variant with blank include/exclude was tested.

## Uncertain points
- Whether the page keeps old rows: ids 44 and 45 vanished, so results of older adverts may disappear from the page; the scanner has already seen them.
- Only 2 rows to judge the table from; "Recent Updates" cell content for result rows was not seen today (recorded from the seen file only).

## BatLee's corrections
- none yet

## Repairs
- none
