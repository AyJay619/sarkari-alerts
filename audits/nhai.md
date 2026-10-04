## BATCH SUMMARY BLOCK
SITE: NHAI (National Highways Authority of India) | VERDICT: FIX
PROPOSED: 1) Replace source `nhai` (HTML term/249) with JSON POST to https://nhai.gov.in/nhai/api/vacancies-current (form status=Open), title "{title} [{type}]", link = first PDF (current links /nhai/node/N are "Access denied" to the public and show no type/date). 2) Add FREE JSON source `nhai-results` (POST /nhai/api/vacancy-result) for results/shortlists, rebaseline. Both rebaseline on first run. Config below.
MISSING TODAY: Results/shortlists/interview notices (not scanned at all); corrigenda/extensions (edited in the same row, no new link); ~95% of NHAI open posts are deputation/contract (HOLD), real direct-recruitment ads are rare (~4-6 a year).
ASK BATLEE: Should the node-link source keep running as a backup next to the JSON one? Recommend NO (duplicate, and its links are unreadable). Also: contract roles at NHAI (Advisor, Joint Advisor, Draftsman) are held as "small contract roles" - recommend keep HOLD.
FILE: audits/nhai.md

# NHAI
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (not applied)

## Pages watched (tested with scanner fetchItems, free fetch)
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Open vacancies list (current source) | https://nhai.gov.in/nhai/taxonomy/term/249 | free HTML, 0.2-0.5 s, 10 items per run (5 repeats stable) | FREE-OK but weak: links /nhai/node/N return "Access denied. You are not authorized" to the public (Drupal back end). Titles only, no type/date. 10 per page, page 2 (?page=1) not read |
| Same, www | https://www.nhai.gov.in/... | 404 | FAILED, use no-www |
| Same, http | http://nhai.gov.in/... | connect timeout 10 s | FAILED, use https |
| Public site | https://nhai.gov.in/ | Angular SPA (empty shell), data from POST API https://nhai.gov.in/nhai/api | JS-ONLY page, but API is free |
| Open vacancies API (proposed) | POST https://nhai.gov.in/nhai/api/vacancies-current (language=en, index=0, archive=0, totalrecord=40, status=Open) | free, ~0.2 s, response identical on 3 repeats | FREE-OK, 16 open rows with type, posted date, last date, PDFs |
| Results / notices API (proposed new) | POST https://nhai.gov.in/nhai/api/vacancy-result (language=en, index=0, totalrecord=40, sortby=archive_date_val, sorttype=desc) | free, ~0.2 s | FREE-OK, 304 records, newest first |

ScrapFly: not needed. Credits 0. PDFs (nhai.gov.in/nhai/sites/default/files/...) are public direct links.
Not tested: browser view of the SPA itself (not needed; API found in the site's own JS). Public SPA URLs for BatLee to eyeball: https://nhai.gov.in/#/vacancies/current and https://nhai.gov.in/#/vacancies/result (route names taken from the site's code, not opened in a browser by me).

## What the scanner catches vs misses
- Today it catches 10 open node links (only first page of 16 open). New ad appears at the top, so new postings are caught; but the link is unreadable for sorter/BatLee.
- Misses: results, shortlists, interview/skill-test notices (vacancy-result list), and corrigenda (flag cor_addendum_notic_val=Yes is set on the same row; no new item).
- Posting speed: about 2-4 ads a month (list is 116 current+closed incl. 2025-26), mostly in bursts (7 deputation ads on 2026-08-19/20). Direct recruitment ads: Deputy Manager (IT/F&A/Tech via GATE) a few times a year. Flood risk: a burst of ~10 deputation ads in one day happened; all HOLD anyway.
- Link stability: PDF links are fixed per row (Detailed_Advertisement_N.pdf etc.). One row (58652) lists a Hindi PDF first, so a link can be Hindi; title is English. Titles can be edited by NHAI (row stays same id), a title change would re-flag once.

## Label pattern
Titles are free text, no fixed prefix. Patterns:
- "National Highways Authority of India (NHAI) invites applications for recruitment to the following post of <POST>." -> Parent = "<POST> (NHAI)"
- "Advertisement for the posts of <POST>" / "NHAI invites applications for the post of <POST> on contract basis."
- "NHAI invites applications for filling up <N> posts of <POST> on direct recruitment / GATE basis" -> Parent = "NHAI <POST> <year>"
- Results: "Result for <POST> ...", "Result of Direct Recruitment on All India Competitive examination basis for the posts of <POST>", "List of candidates shortlisted for interview to the post of <POST>"
Proposed title adds "[<type>]" from the API (Deputation / Contract / Direct Recruitment / Fixed Term Contract / Search-cum-Selection / Promotion), which makes hold decisions mechanical. Advertisement date for the parent: "Advertisement dated" appears in some result titles (e.g. 30.10.2025).

## Hold / pass rules for the sorter
HOLD: [Deputation], [Promotion...], [Deputation/Promotion], [Search-cum-Selection Committee] types; [Contract] and [Fixed Term Contract] roles (Advisor, Joint Advisor, Assistant Advisor, Draftsman, Quantity Surveyor, Pavement Design Expert, LA Support Officer, Young Professional) unless BatLee says otherwise; "Notice for filling up vacant posts ... on deputation basis"; results of deputation/contract engagements ("Result for engagement ... on contract basis", "Result for the posts of ... on deputation basis"); Hindi PDF duplicates (file name starting Hindi_ or Hindi title). Old/stale open rows (e.g. walk-in interview of March 2026) are not news.
PASS: [Direct Recruitment] ads (Deputy Manager IT / F&A / Technical, Stenographer, Library & Information Assistant, Junior Translation Officer, GATE-based), exam notices, admit cards, results and shortlists of direct recruitment (CBT / skill test / interview shortlists), corrigenda/addenda/date extensions on a passed ad, cancellations of a passed ad.
Status values other than Open are not fetched.

## Sample links (audit day; real data from the API)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| NHAI invites applications for recruitment ... General Manager (Land Acquisition & Estate Management) on Deputation basis | New Job [Deputation] | GM (Land Acq & Estate Mgmt) | HOLD |
| NHAI invites applications for the post of Draftsman on contract basis | New Job [Contract] | Draftsman | HOLD |
| Advertisement for the posts of Manager (legal) | New Job [Deputation] | Manager (Legal) | HOLD |
| Advertisement for the posts of Senior Librarian & Information Officer (SL&IO) | New Job [Deputation] | SL&IO | HOLD |
| ... post of Deputy General Manager (Technical) | New Job [Deputation] | DGM (Technical) | HOLD |
| ... post of Manager (Technical) | New Job [Deputation] | Manager (Technical) | HOLD |
| ... post of Joint Advisor (Environment & Plantation) for RO Vijayawada | New Job [Contract] | Joint Advisor (Env) | HOLD |
| Recruitment Notice - General Manager (Legal) | New Job [Deputation] | GM (Legal) | HOLD |
| ... post of General Manager (Information Technology) | New Job [Deputation] | GM (IT) | HOLD |
| NHAI invites applications for 02 posts of Deputy Manager (Information Technology) on direct recruitment (2026-07-06, now Closed) | New Job [Direct] | DM (IT) 2026 | PASS (example of what should pass) |
| NHAI invites applications for filling up 60 posts of Deputy Manager (Technical) ... GATE (2026-05-15, Closed) | New Job [Direct] | DM (Technical) GATE 2026 | PASS |
| Result for filling up 60 posts of Deputy Manager (Technical) on the basis of GATE 2026 Score | Result | DM (Technical) GATE 2026 | PASS |
| Result for Direct Recruitment ... Deputy Manager (Finance & Accounts) | Result | DM (F&A) | PASS |
| List of candidates shortlisted for interview to the post of DM(F&A) - Notice dated 29.07.2026 | Result (shortlist) | DM (F&A) | PASS |
| Result of Direct Recruitment ... Stenographer | Result | Stenographer | PASS |
| Result of candidate selected for Junior Translation Officer on direct recruitment (CBT 07.05.2026) | Result | JTO, Advt 30.10.2025 | PASS |
| Result for the post of Geotechnical Engineer on contract basis | Result [contract] | Geotechnical Engineer | HOLD |
| Result for engagement to Joint Advisor (Tech.) RO-Chennai on contract basis | Result [contract] | Joint Advisor (Tech) | HOLD |
| Notice for Filling up of vacant posts in Technical Cadre under MoRT&H quota on deputation basis | Notice | - | HOLD |

## Proposed config (not applied)
Replace the existing `nhai` entry and add `nhai-results`:
```json
{
  "id": "nhai", "name": "NHAI Vacancies (open)", "runner": "india", "tier": "FREE", "level": "central",
  "type": "json",
  "url": "https://nhai.gov.in/nhai/api/vacancies-current",
  "method": "POST",
  "form": { "language": "en", "index": "0", "archive": "0", "totalrecord": "40", "status": "Open" },
  "itemsPath": "list",
  "titleFormat": "{title} [{type}]",
  "linkField": "upload_file.0.uf_target_id",
  "fallbackLink": "https://nhai.gov.in/#/vacancies/current",
  "timeoutMs": 15000, "limit": 40, "allowEmpty": true
},
{
  "id": "nhai-results", "name": "NHAI Results and notices", "runner": "india", "tier": "FREE", "level": "central",
  "type": "json",
  "url": "https://nhai.gov.in/nhai/api/vacancy-result",
  "method": "POST",
  "form": { "language": "en", "index": "0", "totalrecord": "40", "sortby": "archive_date_val", "sorttype": "desc" },
  "itemsPath": "list",
  "titleFormat": "{title}",
  "linkField": "upload_file.0.uf_target_id",
  "fallbackLink": "https://nhai.gov.in/#/vacancies/result",
  "timeoutMs": 15000, "limit": 40
}
```
Both configs were run through the scanner's fetchItems (16 and 40 items returned, 0.2 s). Dates were left out of the title on purpose, so an edited last date does not re-flag a row. The old source's `exclude` (compassionate|qualified|roll no|unique id) is dropped, no such titles seen (add back if wanted).

## Uncertain points
- Hindi-first PDF on at least one row (58652); sorter can open the other PDFs of the row via the API if the link is Hindi.
- The scanner link for results can fall back to the SPA hash URL, whose exact path I did not open in a browser.
- Since the API call uses totalrecord, NHAI could cap it; 200 worked in my tests.
- Corrigenda are not separate items; a rule for them would need a "cor_addendum_notic_val" change to be visible (not possible with current config).

## BatLee's corrections
- none yet

## Repairs
- none
