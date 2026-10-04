## BATCH SUMMARY BLOCK
SITE: Mazagon Dock Careers | VERDICT: OK
PROPOSED: none (optional only: add "(Size:.*" strip to titleReplace for cleaner titles, causes a one-time rebaseline; not needed)
MISSING TODAY: nothing found (Executives page holds 1 stale May-2026 row, Non-Executives is empty; real recruitment form/portal is login-only and not scannable)
ASK BATLEE: none

# Mazagon Dock Careers
Audited: 2026-10-04 (batch) | Group: FREE | Status: ACTIVE (no change)

## Pages watched
| Page | URL | Fetch method | Verdict |
| Career Executives | https://mazagondock.in/English/career/Career-Executives | free fetch, https, no www (www also works) | FREE-OK. 1 row (consultant selection list, 20/05/2026) |
| Career Non-Executives | https://mazagondock.in/English/career/Career-Non-Executives | free fetch | FREE-OK but table empty today (only forms below it) |
| Career Apprentice | https://mazagondock.in/English/career/Career-Apprentice | free fetch | FREE-OK. 14 rows (MDLATS/01/2026 trade apprentice cycle) |
| Online Recruitment portal | https://mazagondock.in/app/MDLJobPortal/Welcome.aspx | free fetch | Login/landing page only, no notices; nothing to scan |

Scanner result with the current config: 15 items (1 + 0 + 14). 6 runs: first run 12.7 s (cold), then 0.25-0.55 s, always 15 items. ScrapFly: not needed. PDFs on mazagondock.in/app/writereaddata/career/ are same host, free.

## What the scanner catches / misses
Catches every table row with a writereaddata/career link on all 3 pages, with the full row text as title (date + advt no + post + notice + "(Size: .., Language: ..) CLICK HERE FOR MORE DETAILS"). Misses nothing visible. Executive and non-executive openings are rare (months apart); apprentice notices come in bursts (merit lists, waiting lists). Form PDFs (caste certificate, attestation, user manual) are under /writereaddata/pdfs/, not matched by the row selector, so they never enter. Archive pages (Ex-Executives / Ex-Non-Executives links are retired-employee pages, not job archives) not watched.

## Posting speed / link stability
Hand-edited table, newest first. Links are static PDF URLs with a timestamp in the name. Last apprentice postings 30/09/2026 (2 items). No flood risk: seen state holds the 15 items. Row cap 200 is far above the table size.

## Label pattern
Row text: "<dd/mm/yyyy> <Advt/Ref no> <post or cycle> - <notice type text> (Size..., Language...) CLICK HERE FOR MORE DETAILS". Parent = the advertisement ref: "MDLATS/01/2026" (Trade Apprentices Batch 2026, Groups A/B/C by qualification: A = 10th/non-ITI, B = ITI, C = 8th/non-ITI) or "MDL/HR-TA-MP/Exec/86/2026" (Consultant Offshore Projects). Type keywords: "Merit List", "Waiting List", "Eligibility List", "Corrigendum", "Information Brochure", "Syllabus".

## Hold / pass rules (for the sorter)
HOLD: consultant / contract engagement notices (e.g. Advt 86/2026 Engagement of Consultant, Offshore Projects, selection list), Hindi duplicates, user manuals, caste/attestation/employment/nomination forms, syllabus and exam pattern notes, information brochure (rules text) unless it is the first notice of a new cycle, retired-employee pages.
PASS: new Executive / Non-Executive / Apprentice advertisements, corrigenda and last-date extensions, eligibility lists, merit / waiting lists with document-verification schedules (Rounds 1-3), admit cards, results.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
| 30/09/2026 Group A Declaration of 2nd Waiting List + DV schedule (Round 3) | Result | MDLATS/01/2026 | Pass |
| 30/09/2026 Group B 2nd Waiting List (Round 3) | Result | MDLATS/01/2026 | Pass |
| 17/09/2026 Group A Waiting List (Round 2) | Result | MDLATS/01/2026 | Pass |
| 17/09/2026 Group B Waiting List (Round 2) | Result | MDLATS/01/2026 | Pass |
| 28/08/2026 Group A Merit List with DV (Round 1) | Result | MDLATS/01/2026 | Pass |
| 28/08/2026 Group B Merit List with DV | Result | MDLATS/01/2026 | Pass |
| 28/08/2026 Group C Merit List with DV | Result | MDLATS/01/2026 | Pass |
| 22/07/2026 Online Exam Syllabus & Pattern, Intake 2026 | Update/Noise | MDLATS/01/2026 | Hold |
| 20/07/2026 Eligibility list Group A / B / C | Update | MDLATS/01/2026 | Pass |
| 08/07/2026 Corrigendum: last date extended to 15-07-2026 | Update | MDLATS/01/2026 | Pass |
| 01/07/2026 Corrigendum: extension of last date | Update | MDLATS/01/2026 | Pass |
| 10/06/2026 Information Brochure (rules, reservation, selection) | New Job | MDLATS/01/2026 | Pass (already posted) |
| 20/05/2026 List of selected candidates, Consultant (Offshore Projects) | Result | MDL/HR-TA-MP/Exec/86/2026 | Hold (consultant) |

## Proposed config
No change. Current (sources.json id mazagon-dock): url Career-Executives + extraUrls Non-Executives and Apprentice, rowSelector "tr:not(:has(tr)):has(a[href*='writereaddata/career'])", rowTitle self, rowLink a[href*='writereaddata/career'], titleReplace strip leading serial number, exclude "compassionate|qualified|roll no|unique id", minTitle 15, limit 200.
Optional: titleReplace add ["\s*\(Size:.*$",""] (cleaner titles; triggers a one-time rebaseline of 15 items).

## Uncertain points
- One slow cold request (12.7 s) seen once; later runs fast. Default 30 s timeout covers it; do not shorten to 15 s.
- Real executive/non-executive vacancies are applied through the login-only portal; they may only appear as a PDF on the Executives page, which the scanner watches.
