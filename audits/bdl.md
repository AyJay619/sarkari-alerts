# Bharat Dynamics (BDL) - batch audit
Audited: 2026-10-04 | Group: FREE | Status: proposal (batch mode, nothing applied)

## BATCH SUMMARY BLOCK
```
SITE: Bharat Dynamics Recruitment (bdl) | VERDICT: FIX
PROPOSED: 1. replace include "[.]pdf" with rowSelector "table tbody tr", rowTitle "td.views-field-title", rowLink "a[href$='.pdf']" (real titles instead of 2x "Click here for Detailed Notification", drops 2 static rows); 2. keep exclude and limit 40; 3. rebaseline on first run (automatic)
MISSING TODAY: nothing important; but 2 titles are the useless "Click here for Detailed Notification" (Director Technical Advt 106/2026, CMD Advt 101/2025) and 2 static rows (Check Points, Incentive Scheme) are noise
ASK BATLEE: none (rowLink fallback: one row "Syllabus for CBoT ... Advt 2025-4" has no PDF, scanner falls back to the page URL; harmless, hold as info)
```

## Pages watched
| Page | URL | Fetch method | Verdict |
| Recruitment (all notices table: title, date, PDF) | https://bdl-india.in/recruitments | free fetch, https, no www, 15 s | FREE-OK |
| Homepage Recruitments tab (subset of same) | https://bdl-india.in/ | not needed | skip |

- http:// version timed out (15 s): use https. www version also works but serves www-links; keep no-www.
- 7 repeats of the page: all 200 in about 0.12 s. Stable, fast; timeoutMs 15000 is fine.
- No other recruitment page needed: the table lists every advert, result, shortlist, corrigendum, cancellation. Tenders/open-tenders pages are held anyway.

## What the scanner catches / misses
- Current config (include "[.]pdf"): 26 items, newest first, page has a date column (e.g. 30/09/2026) but the scanner does not read it. 26 < limit 40 so nothing falls off; page is small, so flood risk is low (seen file already holds all 26).
- Weakness: link text for two rows is "Click here for Detailed Notification" (title cell holds the real name). Static rows "Check Points" and "Incentive Scheme" (2023/2024 circulars) are noise.
- Proposed rows config yields 25 items with full titles, in the same order (includes the Cancellation of GM (Production) row and a Syllabus row).
- Posting speed: page updated same day (Director Technical advt dated 30/09/2026 was caught 30/09).

## Label pattern
Title is free text, no fixed prefix. Parent clues: "Advt No. 2025-4", "Advt 2026-1", "Advertisement No. 106/2026", or the post name ("General Manager (Business Development & Marketing)"). Type from words: "Recruitment/Notification for the post" = New Job; "Corrigendum/Addendum/Cancellation" = Update; "Shortlisted/Selected/Provisionally Selected" = Result; "Interview Schedule / Schedule for CBoT" = Update (schedule). Parent = "BDL Advt <no>" or post name.

## Hold / pass rules for the sorter
- Hold: "Contract Engineer/Project Engineer ... on contract basis" walk-ins are small contract roles (hold unless BatLee wants them: see uncertain); "Recruitment ... from Indian Armed Forces" (GM BD&M, ex-servicemen/armed forces only); Check Points, Incentive Scheme (static circulars); Director/CMD/GM top-level posts are PSU-board appointments (pass as New Job but low value, sorter decide); old selection lists for closed cycles seen at baseline.
- Pass: Management Trainee / Trainee Engineer / Officer / Diploma Assistant / Trade Assistant adverts, corrigendum, addendum, cancellation, shortlist/selected lists for current cycle, CBoT/interview schedules, syllabus for current advert.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
| Notification for the post of Director (Technical) - Advt No. 106/2026 (30/09/2026) | New Job | Advt 106/2026 | Pass (senior board post) |
| Notification - Contract Engineer (Field Firing), contractual basis | New Job | Contract Engineer (Field Firing) | Hold (contract) |
| List of provisionally selected Project Engineer(s), contract, Advt 2026-1 | Result | Advt 2026-1 | Hold (contract) |
| Addendum of Para-8.3 in Advt BDL/C-HR(TA&CP)/2026-1 | Update | Advt 2026-1 | Hold (contract, follows parent) |
| Recruitment of Project Engineers, walk-in 06-07 June 2026 | New Job | Advt 2026-1 | Hold (contract, expired) |
| List of candidates selected, Management Trainee, Advt 2025-4 | Result | Advt 2025-4 | Pass |
| Interview schedule, Management Trainee, Advt 2025-4 | Update | Advt 2025-4 | Pass |
| Shortlisted for interview, Management Trainee, Advt 2025-4 | Result | Advt 2025-4 | Pass |
| Syllabus for CBoT, Management Trainees, Advt 2025-4 | Update | Advt 2025-4 | Pass (link = page, no PDF) |
| Corrigendum - Management Trainees Advt 2025-4 | Update | Advt 2025-4 | Pass |
| Recruitment of Management Trainees, Advt 2025-4 | New Job | Advt 2025-4 | Pass |
| Selected candidate, GM (Business Development & Marketing) | Result | GM (BD&M) | Hold (armed forces only) |
| List of selected, Trainee Engineers/Officers/TDA/TA, Advt 2025-3 | Result | Advt 2025-3 | Pass |
| Notification for CMD - Advt 101/2025 (29/10/2025) | New Job | Advt 101/2025 | Pass/old |
| Schedule for CBoT, Advt 2025-3 | Update | Advt 2025-3 | Pass |
| Cancellation of notification, GM (Production) 2024 | Update | GM (Production) | Pass (cancellation) |

## Proposed config (replace the bdl entry fields)
```json
{
  "id": "bdl", "name": "Bharat Dynamics Recruitment", "runner": "india", "tier": "FREE", "level": "central",
  "type": "html", "url": "https://bdl-india.in/recruitments",
  "rowSelector": "table tbody tr",
  "rowTitle": "td.views-field-title",
  "rowLink": "a[href$='.pdf']",
  "exclude": "directory|standardisation|certification|compassionate|qualified|roll no|unique id",
  "limit": 40,
  "timeoutMs": 15000
}
```
Tested with the scanner's fetchItems: 25 items, correct titles and PDF links.

## Uncertain
- Whether BatLee wants contract Project/Contract Engineer postings; standing rules say hold small contract roles, so hold.
- The page's date column is not captured (no config option found for it); not needed.
- Syllabus row has no PDF so its link falls back to the listing page; seen-check keys on title+link so it still works.

## BatLee's corrections
- none yet

## Repairs
- none
