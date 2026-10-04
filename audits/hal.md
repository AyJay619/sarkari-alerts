# HAL Careers
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## BATCH SUMMARY BLOCK
SITE: HAL Careers | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (API lists only currently active notices, 5 today; no PDF link exposed, link is the career page + #id)
ASK BATLEE: none

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Career API (what the Angular career page loads) | POST https://hal-india.co.in/backend/wp-json/hal/v1/career, form lang=en | free fetch via fetchItems, type json | FREE-OK |
| Career page (human view) | https://hal-india.co.in/career | Angular app, JS only, not used | JS-ONLY (API used instead) |

Tested with the scanner's own fetchItems, 5 runs, all OK, 5 items each, 0.8-1.0 s. No flakiness. Other API routes under hal/v1 not guessed or found (root returned rest_no_route).

## What the scanner catches vs misses
- API fields: id, division, title, floated_date (dd-mm-yyyy), activeupto. Only notices still active (activeupto not passed) are returned: 5 today. Nothing older is shown on the site, so nothing is missed by the scanner.
- Link is `https://hal-india.co.in/career#<id>` (stable id, no flood risk). The PDF itself is not in the API response, so the sorter must open the career page / search by title to see the document. Posting speed: new item appears with its floated_date (e.g. 01-10-2026 item seen on 04-10); well within a daily scan.
- Dates are in the API but the scanner does not use them (title only). Fine.

## Label pattern
Titles are free text, usually UPPER or mixed case, no "Type:" prefix. Parent is inside the title, e.g.:
- "SELECTION OF DESIGN TRAINEES/ MANAGEMENT TRAINEES 2026 - <stage>" -> parent "HAL Design Trainees / Management Trainees 2026"; stage words: ANNOUNCEMENT OF ONLINE TEST RESULTS, DOWNLOAD INTERVIEW CALL LETTER, SCORECARD, DECLARATION OF FINAL RESULTS, LINK FOR DOWNLOADING PROVISIONAL OFFER.
- "Candidates provisionally selected for the post of <post>" -> Result, parent = that post.
- "ADVERTISEMENT FOR THE POST OF <post>" -> New Job.
- "Engagement of visiting consultant ..." -> consultant, hold.
- "<Division>" is a separate field in the API (not in the title); the scanner drops it. Division names (Lucknow, Korwa, Nasik, Bangalore) must be read from the title text.

## Hold / pass rules (for the sorter)
Hold: visiting consultants / part-time specialist doctors, tenure-basis engagement of retired or contract personnel, apprenticeship "joining instructions" lists (training, not a job: hold unless BatLee wants apprentices), offer-of-appointment download links (post-selection, no new info), Hindi duplicates.
Pass: Director / executive / trainee / officer advertisements, written test / online test results, interview call letters, scorecards, provisional selection lists, document verification schedules, corrigenda / extensions.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| List of Provisionally qualified candidates in Written Test ... Tenure basis Non-Executive Cadre, HAL Accessories Division Lucknow / Avionics Division Korwa, with Document Verification schedule | Result / Update | HAL Lucknow-Korwa tenure basis non-executive 2026 | Pass (check if tenure-basis engagement is a normal job) |
| ADVERTISEMENT FOR THE POST OF DIRECTOR HUMAN RESOURCES | New Job | HAL Director (HR) | Pass |
| DT/MT 2026 - Declaration of final results - list of provisionally selected | Result | HAL DT/MT 2026 | Pass |
| DT/MT 2026 - Link for downloading provisional offer of appointment | Update | HAL DT/MT 2026 | Hold (post-selection) |
| Joining instructions and list shortlisted for one year apprenticeship training, HAL Nasik | Result | HAL Nasik apprentice 2026 | Hold / BatLee call |

## Proposed config
No change. Current source (unchanged):
```json
{ "id": "hal", "type": "json", "url": "https://hal-india.co.in/backend/wp-json/hal/v1/career", "method": "POST", "form": {"lang":"en"}, "headers": {"Accept":"application/json"}, "itemsPath": "career", "titleField": "title", "linkField": "id", "linkPrefix": "https://hal-india.co.in/career#", "fallbackLink": "https://hal-india.co.in/career" }
```

## Uncertain
- The API gives no PDF link; sorter needs the Angular page. Not verified how the page shows the attachment.
- If HAL ever expires/re-floats a notice with the same id nothing new is flagged; ids look unique and increasing.

## BatLee's corrections
- none yet

## Repairs
- none
