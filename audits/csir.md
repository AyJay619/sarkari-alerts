# CSIR (csir + csir-archive)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, no config changed)

## BATCH SUMMARY BLOCK
SITE: CSIR | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (main page shows only 4 live items, archive page 0 catches the rest; ?page=N older pages are old history, not needed)
ASK BATLEE: none

## Pages watched and tested
| Source | URL | Fetch | Verdict |
|---|---|---|---|
| csir | https://www.csir.res.in/en/career-opportunities/recruitment | free fetchItems, 3 runs, 4 items, 60-440 ms | FREE-OK |
| csir-archive | https://www.csir.res.in/en/career-opportunities/recruitment/archive-recruitment | free fetchItems, 3 runs, 10 items, ~60-100 ms | FREE-OK |

- www is required: https://csir.res.in (no www) fails to connect; http://www redirects (302) to https.
- Both pages are server-rendered Drupal tables. No JS, no blocks, no ScrapFly needed. Cost 0.
- Main page = current live notices (only 4 today, PDFs linked directly). Archive page 0 = the last 10 notices, linked to CSIR detail pages (the PDF is inside the detail page, e.g. result-urban.pdf), plus one external portal link.
- Archive is newest-first, paged with ?page=N (47 pages). Page 0 is enough; the scanner limit of 20 is never reached.

## What the scanner catches vs misses
- Catches: all notices on the live page (PDF title from column 2) and the 10 newest on archive. State shows items already seen, no flood: links are stable (PDF paths with year-month, detail slugs).
- Overlap: items are on the live page first and move to the archive later. They appear twice under different links (PDF vs detail page); sorter merges by title/parent.
- One odd archive row: "Engagement of Project Staff for Sanskrit, Metallurgy ... Agriculture & Patent" links to http://14.139.49.55:8005/tkdlrecruitment (TKDL application portal, bare IP, generic link). It is a re-listing; the same item came via the main-page corrigendum/advert PDFs. If its title changes it will re-alert, harmless.
- Posting speed: CSIR posts a few notices a week; a scan every few hours is more than enough.

## Label pattern
Titles are free text, no prefix: "<Type phrase> ... [Last Date: dd/mm/yyyy]" or "Result of Interview held on dd.mm.yyyy with reference to Advt. No. TKDL/06/2026 (<disciplines>)".
- Parent = the advert number when present: "Advt TKDL/06/2026", "Project No. HCP522403", "Project No. MLP002639"; else the post/lab: "Director, CSIR-NCL Pune", "Group-II (1) / Technician (1), CSIR Hqrs".
- Type keywords: "Advertisement / Engagement of / Recruitment for / Walk-in" = New Job; "Result of Interview / Selected and Waitlisted candidates" = Result; "Corrigendum" = Update.
- Many ads are project staff / walk-ins at CSIR labs (not regular posts).

## Hold / pass rules for the sorter
- Pass: Director posts, Group-II/Technician and other regular posts, Result of interview / selected-waitlisted lists, corrigenda and last date extensions.
- Hold: Project staff / project personnel / walk-in interviews for short project engagements are contract roles. Under the standing rule "small consultant / contract roles" these are HOLD by default (recommendation: hold project-staff adverts; still pass a Result or Corrigendum only if its parent job was already posted on Sarkari24).
- Hold: Hindi duplicates, deputation / lateral (e.g. "on deputation" adverts at CSIR Hqrs), tenders, RTI.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Advertisement for the post of Director, CSIR-NCL, Pune [Last Date 30/11/2026] | New Job | Director CSIR-NCL | Pass |
| Result of Interview held on 25.09.2026, Advt TKDL/06/2026 (Agriculture and Patent) | Result | TKDL/06/2026 | Hold unless parent posted |
| Corrigendum: extension of last date to 05/10/2026, Project Staff Sanskrit and Metallurgy (TKDL/06/2026) | Update | TKDL/06/2026 | Hold unless parent posted |
| Engagement of Project Personnel for IT, Ayurveda, Unani, Sowa Rigpa, Siddha, Patent, Sanskrit, Yoga (MLP002639) [Last 12/10/2026] | New Job | Project MLP002639 | Hold (project staff) |
| Result of Interview held on 14.09.2026, Advt TKDL/07/2026 | Result | TKDL/07/2026 | Hold unless parent posted |
| Engagement of Project personnel in Urban/Rural Planning (GAP-000001) [walk-in 14/09/2026] | New Job | Project GAP-000001 | Hold |
| Engagement of Project Staff Sanskrit, Metallurgy (HCP522403), Agriculture and Patent (portal link) | New Job | HCP522403 | Hold |
| Result of interview conducted on 01.09.2026 for SPA, PS-I, PS-III | Result | SPA/PS-I/PS-III | Hold unless parent posted |
| Walk-in-Interview for Senior Project Associate / Project Associate-II / I / Project Assistant-II [02/09/2026] | New Job | walk-in 02/09/2026 | Hold |
| Selected and Waitlisted Candidates for Project Personnels, CSIR-IPU | Result | CSIR-IPU project | Hold unless parent posted |
| Advertisement for positions of Project Staff [Walk-in 01/09/2026] | New Job | walk-in 01/09/2026 | Hold |
| Recruitment for Group-II (1) / Technician (1) in CSIR Hqrs [Last 17/09/2026] | New Job | Group-II/Technician CSIR Hqrs | Pass |
| Result of Interview held on 10.08.2026, Advt TKDL/03/2026 (Agriculture, IT) | Result | TKDL/03/2026 | Hold unless parent posted |
| Result of Interview held on 07.08.2026, Advt TKDL/03/2026 (Material Science, Metallurgy, Patent) | Result | TKDL/03/2026 | Hold unless parent posted |

## Proposed config
No change. Current config works:
```json
{"id":"csir","type":"html","url":"https://www.csir.res.in/en/career-opportunities/recruitment","rowSelector":"table tr","rowTitle":"td:nth-child(2)","rowLink":"a[href*='.pdf']","limit":20}
{"id":"csir-archive","type":"html","url":"https://www.csir.res.in/en/career-opportunities/recruitment/archive-recruitment","rowSelector":"table tr","rowTitle":"td:nth-child(2)","rowLink":"a[href]","limit":20}
```

## Uncertain points
- Main page rowLink only matches '.pdf' links: a live row whose notice is a detail page instead of a direct PDF would be missed on csir (the archive would catch it later). Today all 4 live rows are PDFs. Consider widening to a[href] if this ever shows as a miss; not needed now.
- If the live table is ever empty (0 rows), the scanner may flag an empty page; allowEmpty not set. Low risk, the page has had rows constantly.

## BatLee's corrections
- none yet

## Repairs
- none
