## BATCH SUMMARY BLOCK
SITE: SIDBI | VERDICT: FIX
PROPOSED: 1) add "allowEmpty": true to sidbi (page empties when the one live ad is archived; today without it a quiet day is an error). 2) keep render:true (free local Chromium) and URL https://www.sidbi.in/en/careers (non-www also works). No other change.
MISSING TODAY: nothing found (the 1 live ad is caught; archive and Notices page are not recruitment feeds)
ASK BATLEE: none

# SIDBI (Small Industries Development Bank of India)
Audited: 2026-10-04 | Group: FREE (local browser render, no ScrapFly) | Status: ACTIVE (batch audit, awaiting approval of proposal)

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Careers & Recruitment (live ads) | https://www.sidbi.in/en/careers | fetchItems with render:true (pinned Chromium), ~2-4 s | FREE-OK. Works with and without www. |
| Same page, render:false | same | plain fetch | JS-ONLY: "no notices found". render:true is required. |
| Archived careers | https://www.sidbi.in/en/careers/careerarchived | render | works, 50+ old ads; not worth watching |
| Notices | https://www.sidbi.in/en/latest-development | render | only event photos (JPG), not recruitment: do not add |

Tests: 2 repeats each, same result every time. ScrapFly not needed.

## What the scanner catches vs misses
- Current config (include "careers/careerdetails", exclude, limit 40) returns exactly 1 item today: "SIDBI invites Applications for Engagement of Assistant Communication Officers and Audit Consultants on full-time Contractual Basis - 2026-27". Menu, footer, "View Archived" and PDF links are correctly dropped by include.
- The earlier seen entry "Hiring of Specialized Consultants / Experts ... GCFV" has since moved to the archive, so the page now holds a single ad. The page often holds 0-2 ads, so an empty page is normal: allowEmpty is needed.
- Ad links are page links (careers/careerdetails/<slug>); the PDF is inside the detail page (not opened here). The slug moves to careers/careerarchived/careerdetails/... when archived, which the include filter ignores (good, no re-flood).

## Posting speed and link stability
- Postings are rare (a handful a year, almost all contractual). Page is a live list, not paginated; ad links are stable slugs. Flood risk: low (the only churn is ad moving to archive, which is not matched).

## Label pattern
- Title is the full ad headline, e.g. "SIDBI invites Applications for Engagement of <Post(s)> on [full-time] Contractual Basis - <FY>". Parent = post names + year ("Assistant Communication Officers and Audit Consultants, 2026-27"). Regular recruitment looks like "Recruitment of Officers in Grade 'A' and Grade 'B' - General and Specialist Stream: <year>" (Parent = "SIDBI Grade A/B <year>"). Type is almost always New Job; no admit cards or results appear on this page (those are on a separate recruitment portal, not found in this audit).

## Hold / pass rules for the sorter
- HOLD: "Engagement ... on Contractual Basis" for consultants / experts / specialists / resource persons (BatLee: consultants), Chartered Accountants through ICAI on contract, Deputation of Officers from banks, Appointment of MD of KITCO / other subsidiary top posts (single senior appointments by deputation), SIDBI Venture Capital Ltd posts only if contractual-consultant style (judge case by case).
- PASS: "Recruitment of Officers in Grade 'A'/'B'" (regular), any regular post with numbered vacancies; contractual full-time posts of ordinary officer posts (ACO, Legal Officer, Compliance Officer) are borderline: recommend pass as Needs-you for BatLee's call.
- Noise filtering is in the sorter, not the script (standing rule).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| SIDBI invites Applications for Engagement of Assistant Communication Officers and Audit Consultants on full-time Contractual Basis - 2026-27 | New Job | ACO and Audit Consultants 2026-27 | Pass/Needs-you (ACO contractual; "Audit Consultants" part is consultant style) |
| Hiring of Specialized Consultants / Experts (Full time) ... GCFV (now archived) | New Job | GCFV consultants | Hold (consultants) |
| SIDBI invites Applications for Engagement of Specialist Officer ... 2026-27 (archived) | New Job | Specialist Officer 2026-27 | Pass (contractual officer) / Needs-you |
| SIDBI invites Applications for Engagement of Chartered Accountants [through ICAI (Aug-Sep 2026)] (archived) | New Job | CA engagement Aug-Sep 2026 | Hold (contract CA) |
| Recruitment of Officers in Grade 'A' and Grade 'B' - General and Specialist Stream (archived) | New Job | SIDBI Grade A/B | Pass |
| SIDBI invites Applications for Deputation of Officers in Grade 'B' from PSBs - 2024-25 (archived) | New Job | Grade B deputation | Hold (deputation) |
| Appointment of Managing Director, KITCO Limited (archived) | New Job | KITCO MD | Hold (senior appointment) |
| Appointment of Legal Officer / Company Secretary cum Compliance Officer (archived) | New Job | Legal Officer / CS | Pass/Needs-you |

## Proposed config (JSON)
```json
{
  "id": "sidbi",
  "name": "SIDBI Careers",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.sidbi.in/en/careers",
  "render": true,
  "include": "careers/careerdetails",
  "exclude": "compassionate|qualified|roll no|unique id",
  "limit": 40,
  "allowEmpty": true
}
```
(Adding allowEmpty does not change URL/selectors in a way that needs re-baselining beyond what the scanner does itself.)

## Uncertain points
- Whether the exclude "compassionate|qualified|roll no|unique id" is useful here (harmless).
- Ad detail pages and their PDFs were not opened; PDF direct-download not tested (no ScrapFly involved anyway).
- SIDBI Grade A/B exam stages (admit card, results) are hosted elsewhere and were not located; not covered.

## BatLee's corrections
- none yet

## Repairs
- none
