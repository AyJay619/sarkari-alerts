# UIIC (United India Insurance) - batch audit
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (works, one gap)

## BATCH SUMMARY BLOCK
SITE: UIIC Recruitment | VERDICT: OK
PROPOSED: 1) optional: add FREE source "uiic-1620" = http://uiic.co.in/web/recruitment/details/1620 (AO 2026 notice page: corrigenda, apply link, ads), allowEmpty, rebaseline; 2) optional: same for details/1607 (apprentices)
MISSING TODAY: corrigenda / extensions / result PDFs added INSIDE an existing post's details page (e.g. AO 2026 corrigendum) are invisible; list page only shows new post titles
ASK BATLEE: details pages need a manual id per live recruitment - add 1620 only (recommend yes, remove when the recruitment closes); site gives 504 about 1 in 6 requests at 32s (retry at group end handles it, recommend leave timeout 45000)

## Pages watched and tested
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Careers / Recruitment list (current source) | https://uiic.co.in/web/careers/recruitment | free fetchItems, 10 rows | FREE-OK |
| same, http | http://uiic.co.in/web/careers/recruitment | free, 10 rows, 1.5-2.5 s | FREE-OK |
| same, www | https://www.uiic.co.in/... | 1 of 2 failed (504 and "no notices") | worse, do not use |
| Post details page | /web/recruitment/details/<id> | free, table rows with PDFs | FREE-OK (not watched today) |
| Homepage ticker | https://uiic.co.in/ | free; only 2 links (AO 2026, surveyor SMP results) | not needed |

Tests: 12 fetches of the list. 2 failures, both HTTP 504 Gateway Timeout after ~32 s (server side, random, also on www). All others OK in 1.5-2.5 s. Timeout 45000 covers the slow 32 s successes; a 15 s timeout would drop those, so keep 45000. No ScrapFly needed.

## What the scanner catches today
Rows: S.No | Title | Downloads (one "+" link to /web/recruitment/details/<id>). The source reads title from column 2 and link from the details link: 10 items, correct, newest first (highest id on top: 1620, 1607, 1610, then older 200-206). Matches seen-india.json exactly. limit 20 is enough.
Link stability: details ids are fixed numbers, no tokens or dates in URLs, so no flood risk.

## What it misses
The list page has no dates and no updates. A corrigendum, date extension, admit card or result for an existing recruitment is added as a new row inside that post's details page. Example today: details/1620 holds Corrigendum PDF, Hindi advertisement, English advertisement, Apply Online (https://ibpsreg.ibps.in/uiicljul26/), CGRS link. The scanner will never see a new corrigendum there. (Apply/admit card/result usually live on the IBPS site, ibpsreg.ibps.in, which is outside UIIC.)

## Label pattern
Titles are the post name in upper or mixed case: "RECRUITMENT OF <POST> (SCALE I)--<CATEGORY>-<YEAR>", "ENGAGEMENT OF APPRENTICES - <FY>", "Recruitment of <post> - <year>". Parent = title without "Recruitment of", e.g. "UIIC Administrative Officer (Scale I) Generalists and Hindi Officers 2026". No advert number in the titles; the year in the title is the key. Detail-page rows are "Corrigendum - <same title>", "Detailed Advertisement--<same title>" (parent = text after the dash).

## Hold / pass rules for the sorter
- HOLD: "on contract basis" (CISO 2026), Actuary in addition to Appointed Actuary (specialist/contract-type, ask if wanted), Hindi Version duplicates, CGRS complaint link, toll-free helpline row, surveyor (SMP) results, tenders / RFP, RTI, old years (2023-2025 posts already closed).
- PASS: Administrative Officer, Assistants, Apprentices (open), corrigendum / extension / admit card / result rows.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| RECRUITMENT OF ADMINISTRATIVE OFFICERS (SCALE I)--GENERALISTS AND HINDI OFFICERS-2026 (details/1620) | New Job (already seen) | AO Scale I 2026 | Pass |
| ENGAGEMENT OF APPRENTICES - 2025-26 (1607) | New Job (already seen) | Apprentices 2025-26 | Pass |
| RECRUITMENT OF CISO ON CONTRACT BASIS - 2026 (1610) | New Job | CISO 2026 | Hold (contract) |
| Recruitment of Actuary in addition to Appointed Actuary - 2025 (201) | New Job | Actuary 2025 | Hold (confirm) |
| ENGAGEMENT OF APPRENTICES-2024-25 (200) | old | Apprentices 2024-25 | Hold (closed) |
| ...ADMINISTRATIVE OFFICERS (SCALE I)--GENERALISTS AND SPECIALISTS--2024 (203) | old | AO 2024 | Hold (closed) |
| RECRUITMENT OF ADMINISTRATIVE OFFICERS 2023 (206) | old | AO 2023 | Hold (closed) |
| Recruitment of Assistants - 2023 (205) | old | Assistants 2023 | Hold (closed) |
| Corrigendum - ...AO (Scale I) Generalists and Hindi Officers-2026 (PDF on 1620 page) | Update | AO 2026 | Pass (not caught today) |
| Detailed Advertisement ... Hindi Version (1620 page) | duplicate | AO 2026 | Hold |
| Apply Online https://ibpsreg.ibps.in/uiicljul26/ (1620 page) | info | AO 2026 | Pass (already caught via UIICL IBPS item) |

## Proposed config (nothing applied)
Existing source unchanged. Optional extra source:
```json
{
  "id": "uiic-1620",
  "name": "UIIC AO 2026 notice page",
  "runner": "india", "tier": "FREE", "level": "central", "type": "html",
  "url": "http://uiic.co.in/web/recruitment/details/1620",
  "rowSelector": "table tr",
  "rowTitle": "td:nth-child(2)",
  "rowLink": "td:nth-child(3) a[href]",
  "limit": 30, "timeoutMs": 45000, "allowEmpty": true
}
```
Tested with fetchItems: returns 6 rows for 1620 (corrigendum, Hindi ad, CGRS, helpline, Apply Online, English ad) and 1 row for 1607 (apprentice notification PDF). First run baselines these (they would all be "new" otherwise; the scanner rebaselines a new source). Noise rows (CGRS, helpline) are held by the sorter, no script filter.

## Uncertain
- Whether UIIC adds admit cards/results on its own details pages or only on ibpsreg.ibps.in (unknown until the next stage).
- Actuary posts: hold or pass is BatLee's call.
- Cause of the 504s is unknown; may be load-balancer related. No pattern by URL version.

## BatLee's corrections
- none yet

## Repairs
- none
