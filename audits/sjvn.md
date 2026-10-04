# SJVN (batch audit)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (works as is)

## BATCH SUMMARY BLOCK
SITE: SJVN Current Jobs | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found
ASK BATLEE: none

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Current Jobs (only recruitment page) | https://sjvn.nic.in/en/current-job | free, scanner fetchItems | FREE-OK, 7 items, 3 runs, 125-830 ms |

Tested variants: http:// times out (connect timeout 10 s, 3 of 3), www. fails (TLS cert has no www name). So https without www is the only working form. /en/recruitment and /en/careers are 404. Other menu pages (corporate-announcements, tender, quarterly-result) are not jobs.

## What the scanner catches
Table rows on the page, title from th, link from the "View Job Details" anchor. All 7 rows on the page are caught. Page has a pager; page 1 holds the newest, limit 40 is ample. Links come back as /index.php/en/<slug>; the seen file already holds both forms (slug identical), and no flood seen (7 stable items across runs).

## Label pattern
Title is free text, no fixed type prefix. Type is in the title wording: "Advertisement for ..." = New Job; "To view list of ... shortlisted / selected / called for Document verification click on View Job Details" = Result/Update on the same parent. Parent = text before the dash (e.g. "Recruitment at Executive level for Buxar Thermal Power Project", "Apprenticeship Scheme in STPL for the State of Bihar"). Strip the "- To view / to check ... click on View Job Details tab" tail to get a clean parent. Same slug with a suffix (-view-list-...) is the update of the base slug.

## Hold / pass rules for the sorter
- Hold: Advertisement for the post of Chairman & Managing Director (board-level, usually PSU/deputation style; hold unless BatLee wants it - see uncertain).
- Pass: executive / workmen / workmen trainee / apprenticeship adverts, shortlists, document verification lists, interview lists, selected lists.
- Standing hold rules apply (consultants, deputation, tenders, etc.).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment at Executive level for Buxar TPP - list shortlisted for Personal Interview | Update (Interview/shortlist) | Buxar Thermal Power Project executive recruitment | Pass |
| Advertisement for the post of CMD SJVN | New Job | CMD SJVN | Hold (uncertain) |
| Apprenticeship Scheme in STPL, Bihar - list of selected candidates | Result | STPL Bihar Apprenticeship | Pass |
| Apprenticeship Scheme in STPL for the State of Bihar | New Job | STPL Bihar Apprenticeship | Pass |
| Advertisement for Recruitment of Workmen in Arunachal Pradesh Projects | New Job | Workmen Arunachal Pradesh | Pass |
| Apprenticeship Training FY 2026-27 Himachal Pradesh - Fourth list called for Document verification | Update (DV list) | SJVN Apprenticeship HP 2026-27 | Pass |
| Workmen Trainees - 4th round Document Verification shortlist | Update (DV list) | Workmen Trainees SJVN | Pass |

## Proposed config
None. Current source is correct:
```json
{ "id": "sjvn", "url": "https://sjvn.nic.in/en/current-job", "rowSelector": "table.common-table", "rowTitle": "th", "rowLink": "a:contains('View Job Details')", "limit": 40 }
```
Note: the existing exclude "compassionate|qualified|roll no|unique id" is a keyword filter (BatLee's rule says no filters in the script); it is harmless today (matches nothing) and left as is, no change proposed.

## Uncertain
- Whether the CMD advert should pass (single top post, application via PESB-style process). Default hold.
- Page shows no dates, so posting speed could not be measured.

## BatLee's corrections
- none

## Repairs
- none
