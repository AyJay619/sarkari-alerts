## BATCH SUMMARY BLOCK
SITE: Assam Rifles | VERDICT: OK
PROPOSED: none (optional: drop "compassionate" from exclude, see ASK)
MISSING TODAY: 4 English compassionate-ground items (advert Apr 2026, final result Sep 2026, second list Sep 2026) are dropped by the exclude filter; PDFs have no per-item link (all link to the join page)
ASK BATLEE: Keep "compassionate" excluded? Recommend keep (only for wards of deceased personnel, not an open job) but let sorter treat as HOLD if ever shown.

# Assam Rifles
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitment JSON API (POST eventID 1004) | https://assamrifles.gov.in/api/recruitment | free fetch, type json | FREE-OK (3 runs: 2 items each, 59-331 ms) |
| Human page (Referer / fallback link) | https://assamrifles.gov.in/join-assam-rifles | plain curl timed out at 15s (JS SPA); not needed, API is used | not tested further |

API returns 10 rows (CONTENT_ID, SUBJECT, LANGUAGE, DATE). Hindi rows duplicate English ones (excluded by the Devanagari filter). No file URL in the rows, so the scanner links every item to the join page; items are told apart by title.

## Catch / posting speed
Scanner catches 2 of 10 rows today (advert for Technical and Tradesman rally 2026; final result of Meritorious Sportsperson rally 2026). 5 English rows exist in total; 3 are compassionate-ground and excluded. Site posts rarely (a few items per month). Flood risk: low (stable titles; ID-based rows; same link for all so a title edit would re-fire once).

## Label pattern
SUBJECT in English capitals: "<TYPE WORDS> ... ASSAM RIFLES <CATEGORY> RECRUITMENT RALLY 2026".
Type: ADVERTISEMENT FOR = New Job; FINAL RESULT / LIST OF SELECTED CANDIDATES = Result. Parent = rally name, e.g. "Assam Rifles Technical and Tradesman Recruitment Rally 2026", "Meritorious Sportsperson Recruitment Rally 2026", "Compassionate Ground Appointment Recruitment Rally 2026".

## Hold rules (site-specific)
- Hindi duplicates (already excluded by script).
- Compassionate ground appointment items (wards of deceased personnel only): hold, currently excluded in script.
- Standing rules otherwise.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| ADVERTISEMENT FOR ASSAM RIFLES TECHNICAL AND TRADESMAN RECRUITMENT RALLY 2026 (25 Sep) | New Job | Technical and Tradesman Rally 2026 | Pass |
| NOTIFICATION : FINAL RESULT OF ... MERITORIOUS SPORTSPERSON RECRUITMENT RALLY 2026 (17 Jul) | Result | Meritorious Sportsperson Rally 2026 | Pass |
| SECOND LIST OF SELECTED CANDIDATES OF ... COMPASSIONATE GROUND APPOINTMENT ... (21 Sep) | Result | Compassionate Ground Rally 2026 | Hold (excluded) |
| FINAL RESULT OF ... COMPASSIONATE GROUND ... (15 Sep) | Result | Compassionate Ground Rally 2026 | Hold (excluded) |
| ADVERTISEMENT FOR RECRUITMENT THROUGH COMPASSIONATE GROUND APPOINTMENT SCHEME (13 Apr) | New Job | Compassionate Ground | Hold (excluded) |
| Hindi rows x5 | duplicate | - | Hold (excluded) |

## Proposed config
No change; current sources.json entry "assam-rifles" stands (json POST, itemsPath rData.rData, titleField SUBJECT, fallbackLink join page, exclude "compassionate|[ऀ-ॿ]", limit 40).

## Uncertain
- Per-item PDF links are unknown (API gives only CONTENT_ID); the sorter must open the join page to reach the PDF. A download URL pattern was not tested.
- Compassionate exclusion conflicts with "no keyword filters" rule; kept as it is a pre-existing choice pending BatLee.

## BatLee's corrections
- none

## Repairs
- none
