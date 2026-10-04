## BATCH SUMMARY BLOCK
SITE: India Post | VERDICT: OK
PROPOSED: none (optional: add "timeoutMs": 15000 to india-post; site answers in about 1-2 s)
MISSING TODAY: nothing found for the current cycle; all links are the page URL itself (PDFs sit behind a "verification step"), so the sorter must open the page, not the PDF
ASK BATLEE: none

# India Post (Department of Posts)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, no config changed)

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Vacancies (main, scanned) | https://www.indiapost.gov.in/vacancies | free fetchItems, 5 runs, 8 items every time | FREE-OK |
| Recruitments tab | https://www.indiapost.gov.in/vacancies/recruitments | free curl, same 10 rows as /vacancies | duplicate, not needed |
| Online GDS tab | https://www.indiapost.gov.in/vacancies/online-gds | free curl, no table, only static GDS text | nothing to scan |
| GDS portal | https://indiapostgdsonline.gov.in/ | free curl 200, marquee lists only Jan 2025 shortlists | stale, not worth adding |

- No-www and http both 301 to https://www.indiapost.gov.in/..., so the current URL is the right version.
- Page is server-rendered (Next.js); table has 10 rows per page (page 1 of 2, newest first, "Published Date (Latest)"). Scanner collects 8 items because English and Hindi rows with the same title collapse into one.
- ?page=2 returns the same page (pagination is client-side), so older rows are not reachable; not needed since newest are on top.

## Links and PDFs
- Row title is a button, not an anchor. The scanner therefore uses the page URL as the link for every item. The seen key is "title|page URL", which is stable across runs (flood check: 5 runs, identical items; titles unchanged).
- The page embeds JSON per row (title, date, version English/Hindi, size, /api/documents/file/<encryptedId>). The file ids are the same across fetches but the download returns HTTP 410 "Document link no longer available" without the in-browser verification step (with or without cookie). So PDFs do NOT download free; links cannot be improved by config. Not a ScrapFly case (no captcha-free path found; do not spend credits).
- Dates exist in the row (dd-mm-yyyy) and in the embedded JSON, but the scanner does not carry them.

## Posting speed vs limit
Very low volume: 3 new items in June 2026, 1 in Aug 2026 (Drivers deputation). limit 25 is far above the 10-row page. No flood risk.

## Label pattern
Titles are free text, no "<Type>: <Parent>" format. Rules for the sorter:
- Starts "Notification for filling up / Filling up of vacancies / Direct Recruitment for the post of ..." = New Job; parent = post + place (e.g. "Skilled Artisan (Ordinary Grade), MMS Bengaluru").
- Starts "Corrigendum for ..." = Update; parent = text after "for" (same as the original "Filling up of vacancies of ..." title).
- "Declaration of (pending) results ...", "Declaration of result of trade test ...", "... Provisional Merit list ..." = Result; parent = the notification named in the title (e.g. "Sports quota notification W-17/55/2022-SPN-I dated 08-11-2023, <Circle>"; "Staff Car Driver DMS-B/2-8/Driver Rectt/XXIX/2018").
- "... list of Tainted candidates" = Noise/Hold.
- English and Hindi versions share one title; one catch item only.

## Hold / pass rules (site-specific)
- HOLD: deputation / absorption notices (Drivers Ordinary Grade on deputation); tainted-candidates lists; old results of cycles from 2020-2025 (trade test 2020 cycle, Postman/MTS 2015) unless clearly new.
- PASS: direct recruitment notices (Manager MMS, Skilled Artisan), corrigenda to them, current-cycle results and merit lists (Sports quota Maharashtra / Karnataka).
- Note: the table also contains old items (2024 and 2025) that were already baselined on 2026-09-24; they only matter if the page is re-baselined.

## Sample links (audit day, all link = https://www.indiapost.gov.in/vacancies)
| Title | Date | Type | Parent | Pass/Hold |
|---|---|---|---|---|
| Notification for filling up of Drivers (Ordinary Grade) through deputation/absorption basis | 01-08-2026 | New Job | Drivers (Ordinary Grade) | HOLD (deputation) |
| Corrigendum for filling up of vacancies of Skilled Artisan (Ordinary Grade) at MMS Bengaluru | 29-06-2026 | Update | Skilled Artisan, MMS Bengaluru | PASS |
| Filling up of vacancies of Skilled Artisan (Ordinary Grade) at MMS Bengaluru | 16-06-2026 | New Job | Skilled Artisan, MMS Bengaluru | PASS |
| Direct Recruitment for the post of Manager MMS in Department of Posts | 05-06-2026 | New Job | Manager MMS | PASS |
| Declaration of Pending Results - Meritorious Sportspersons W-17/55/2022-SPN-I - Karnataka Circle | 22-08-2025 | Result | Sports quota, Karnataka | PASS if new, else old |
| Declaration of Results - Meritorious Sportspersons - Karnataka Circle | 04-03-2025 | Result | Sports quota, Karnataka | old |
| First Provisional Merit list Maharashtra Circle, Sports quota | 28-02-2025 | Result | Sports quota, Maharashtra | old |
| Declaration of result of trade test 22.10.2020 MMS Mumbai, Staff Car Driver, Ratnagiri | 23-10-2024 | Result | Staff Car Driver DMS-B/2-8 | old |
| Declaration of result of trade test 21.10.2020 MMS Mumbai, Staff Car Driver, Sindhudurg | 22-10-2024 | Result | Staff Car Driver DMS-B/2-8 | old |
| Direct Recruitment exam Postman/Mailguard and MTS 2015 - 11th list of Tainted candidates | 27-09-2024 | Noise | Postman/MTS 2015 | HOLD |

## Full proposed config (JSON)
```json
{
  "id": "india-post",
  "name": "India Post",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.indiapost.gov.in/vacancies",
  "rowSelector": "table tr",
  "rowTitle": "td:nth-child(2)",
  "limit": 25,
  "timeoutMs": 15000
}
```
(Only change from today: the optional timeoutMs. A timeout-only change should not alter the seen keys.)

## Uncertain points
- Circle-level GDS and other circle recruitments are posted on separate circle sites, not here; this page only shows headquarters-level items. Not audited (one unit only).
- The "verification step" before PDF view may be a captcha; not tested in a browser.

## BatLee's corrections
- none yet

## Repairs
- none yet
