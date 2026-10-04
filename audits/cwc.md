## BATCH SUMMARY BLOCK
SITE: CWC Careers (e-portal) | VERDICT: OK
PROPOSED: none (optional: add allowEmpty only if the page ever empties; not needed today)
MISSING TODAY: nothing found (page currently lists only 3 live items, all caught)
ASK BATLEE: none

# Central Warehousing Corporation (CWC) - e-portal careers
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, no config changed)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Careers (what is live) | https://www.cwceportal.com/cwc_careers.html | free, fetchItems | FREE-OK. 3 items, 6 of 6 runs, 25-320 ms |
| Same, no www | https://cwceportal.com/cwc_careers.html | free | FREE-OK, same 3 items |
| Same, http+www | http://www.cwceportal.com/cwc_careers.html | free | FREE-OK, same 3 items |
| Homepage | https://www.cwceportal.com/ | free curl | 200, only an app/portal menu, no notices |
| Careers app | https://cwceportal.com/careers/ | free curl | 200, apply portal only, no notice list |
| Old careers site | http://www.cwccareers.in/ | free curl | 200, 1.3 KB redirect shell, not useful |

No JS rendering or ScrapFly needed. PDFs on cwceportal.com are plain direct links (free). Timeout default is fine (answers in under 1 s); no change needed.

## What the scanner catches vs misses
- Selector `li:has(a[href*='Guidelines'])` matches every live row. In the page source, all other rows (older ads, shortlist/result rows, direct recruitment 2025) are inside HTML comments, so they are not live and not visible to anyone.
- Not matched by the selector but live and irrelevant: a "fraudulent appointment letters" intimation on /careers/ (noise). No results or admit-card pages are live today.
- Risk: the result rows historically linked to `result_for_candidates.html` / `general_manager_result.html` / blank-href "Click here" (no Guidelines in the link). If CWC re-enables such rows, the selector would miss them. Currently commented out, so nothing missing. Re-check on repair if a result is posted.
- Posting speed: page is hand-edited by CWC, new rows are added at the top with a sequential ID in the PDF path (latest 43). Postings are rare (months apart). No flood risk (3 items, limit 40).

## Link stability (flood check)
Links are stable `cwceportal.com/Careers/Guidelines/<n>/<n>_<name>_<guid>.pdf` (no www in link; the scanner's seen check ignores that anyway). Same 3 links on every run.

## Label pattern
Row text is "<Title> Click here to know more"; the config already strips the trailing text. Title is a plain description, no type prefix. Parent = the title itself (e.g. "Director (Human Resources), CWC", "Professional Doctor (Homeopathy)"). The PDF folder number (Guidelines/43) and the "YPcareers" path are useful: YPcareers = Young Professionals engagement; Careers/Guidelines = everything else (consultants, deputation, direct recruitment, doctors).

## Hold / pass rules (for the sorter)
- HOLD: "Engagement of Young Professionals" (YPcareers path), "Engagement of Consultant / Advisor" notices, deputation vacancy notices (GM(G), "on deputation basis"), "Vacancy Circular" for board-level posts (MD / Director / Director HR / Finance) filled by deputation/PESB selection - check the PDF; these are normally not open recruitment. Fraud/appointment-letter intimations.
- PASS: "Career@CWC (Direct Recruitment)" / "Direct Recruitment - <year>" advertisements (Management Trainee, Junior Technical Assistant, Superintendent, Accountant etc.), shortlists, results, offer-of-appointment/waiting-list notices for direct recruitment.
- UNCLEAR: "Engagement of Professional Doctor (Homeopathy)" - contract/engagement basis, lean HOLD (small contract role).

## Sample links (audit day, all that are live)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Engagement of Professional Doctor (Homeopathy) | New Job (contract) | Professional Doctor (Homeopathy), CWC | Hold (small contract role), sorter to confirm from PDF |
| Engagement of Young Professionals-2026 | New Job (contract) | Young Professionals 2026, CWC | Hold (young professionals) |
| Vacancy Circular for the post of Director (Human Resources), CWC | New Job (board-level) | Director (HR), CWC | Hold likely (deputation/PESB); check PDF |

## Proposed config
No change. Current entry (id `cwc`, runner india, tier FREE, html, url https://www.cwceportal.com/cwc_careers.html, rowSelector `li:has(a[href*='Guidelines'])`, rowTitle self, rowLink `a[href*='Guidelines']`, titleReplace strip "Click here to know more", exclude `compassionate|qualified|roll no|unique id`, minTitle 10, limit 40) is correct.

## Uncertain points
- Whether the sorter should auto-hold all 3 live items; I did not open the PDFs (not needed for the source audit).
- Result/shortlist rows, if revived, may not contain "Guidelines" in the link; revisit then.

## BatLee's corrections
- none yet

## Repairs
- none
