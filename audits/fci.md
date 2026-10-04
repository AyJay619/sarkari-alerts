## BATCH SUMMARY BLOCK
SITE: FCI Recruitment | VERDICT: OK
PROPOSED: none (optional: set timeoutMs 30000 if flaky; page needs local browser render, 6-10 s)
MISSING TODAY: nothing found (page lists only contract/retired/deputation posts today; Category II/III regular exams are not on it)
ASK BATLEE: none

# FCI (Food Corporation of India)
Audited: 2026-10-04 | Group: FREE (local pinned Chromium, no ScrapFly) | Status: ACTIVE (batch audit, not yet BatLee-reviewed)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitment | https://fci.gov.in/recruitment | render + clickText "English" + waitFor .recruitment-box-area | FREE-OK (13 items, 3 runs, 6.5-9.6 s each, always 13) |

URL notes: https and no-www only. www.fci.gov.in does not connect; http redirects (302) to https. Static HTML has no links (Angular app), so render is required. 3 of 3 runs identical.
Other FCI pages (tenders, news) are not job pages. Site API (api/ManageRecruitment/viewall exists in the JS bundle) answers with the HTML shell on the same host, so the real API base was not found; not pursued. Not needed, render works.

## What the scanner catches vs misses
Catches every box on the recruitment page: 3 PDF-linked adverts, plus accordion boxes (Category IV, Archive 2019/2021/2022, some contract ads) whose link falls back to the page URL itself. Those items are keyed by title, so they are stable. FCI's regular recruitment (Category II/III, run by an outside agency) is not on this page today; if it appears it would show as a new box. Posting speed vs limit 30: only 13 items, no flood risk. Page shows no dates.

## Label pattern
Title is the h2 text, upper or mixed case, no dates. Pattern: "ADVERTISEMENT FOR <ENGAGEMENT OF / ENGAGING> <post> ON <CONTRACTUAL / DEPUTATION / RE-EMPLOYMENT> BASIS". Result style: "RESULT NOTICE: <same title>". Parent = post name + year, e.g. "Company Secretary cum Compliance Officer 2026". PDF filenames are random hashes (no advert number). Link is often https://fci.gov.in/recruitment (no direct PDF), so the sorter must match on title.

## Hold / pass rules for the sorter
- HOLD: all "retired / superannuated / re-employment" ads (doctors, civil engineers, IT advisor, GM Engineering), "deputation" (AGM CE/EM), "contractual basis" consultants, "Archive ..." boxes, "Category IV Recruitment" heading box.
- HOLD: "Result Notice" for a contract/CS post (contract role; BatLee may override).
- PASS: any regular-cadre notification (Category II / III / Managers / Assistant Grade), admit cards, results, answer keys, corrigenda and date extensions for those.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| RESULT NOTICE: ADVERTISEMENT FOR ENGAGEMENT OF COMPANY SECRETARY(CS) CUM COMPLIANCE OFFICER ON CONTRACTUAL BASIS-2026 | Result | CS cum Compliance Officer 2026 | Hold (contract) |
| ADVERTISEMENT FOR ENGAGING RETIRED IT PROFESSIONAL ... ADVISOR(IT) ON CONTRACTUAL BASIS - 2026 | New Job | Advisor (IT) 2026 | Hold (retired, contract) |
| ADVERTISEMENT FOR ENGAGEMENT OF COMPANY SECRETARY(CS) CUM COMPLIANCE OFFICER ... -2026 | New Job | CS cum Compliance Officer 2026 | Hold (contract) |
| Advertisement for Engagement of Retired Doctors ... General Duty Medical Officer | New Job | GDMO retired doctors | Hold |
| ADVERTISEMENT FOR ENGAGEMENT OF RETIRED CIVIL ENGINEERS ... CONSULTANT | New Job | Civil Engineer consultant | Hold |
| Advertisement seeking application ... AGM(CE) & AGM(EM) on deputation basis | New Job | AGM (CE/EM) | Hold (deputation) |
| CATEGORY I ADVERTISEMENT ... GENERAL MANAGER (ENGINEERING) RE-EMPLOYMENT | New Job | GM Engineering | Hold |
| Category IV Recruitment | Noise | - | Hold |
| Archive Category II/III Recruitment 2022 and 2019, Category I 2021 (5 boxes) | Noise | archive | Hold |

## Proposed config (unchanged)
```json
{"id":"fci","url":"https://fci.gov.in/recruitment","render":true,"clickText":"English","waitFor":".recruitment-box-area","rowSelector":".recruitment-box-area","rowTitle":"h2","rowLink":"a[href*='fci-storage']","minTitle":15,"limit":30}
```

## Uncertain
- Whether regular Category II/III posts ever appear on this page or only on an outside portal; cannot be seen today.
- Render needs the local Chromium (6-10 s); if it ever fails, the cause is likely the Angular site changing the .recruitment-box-area class.

## BatLee's corrections
- none yet

## Repairs
- none
