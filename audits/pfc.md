## BATCH SUMMARY BLOCK
```
SITE: PFC Careers (jobs on offer) | VERDICT: FIX
PROPOSED: 1) remove "shortlisted" from exclude (standing rule: shortlists pass; it hides 2 shortlist PDFs); keep refund|backlog|compassionate|qualified|roll no|unique id
MISSING TODAY: the 2 "LIST OF SHORTLISTED CANDIDATES" PDFs (excluded); no 2025/2026 postings on this page at all (newest is Advt 02/2024) - page looks stale
ASK BATLEE: is PFC recruiting in 2026 elsewhere (e.g. pfcindia.co.in/en/pages/... or pfcapps.com/pfcrecruitment)? I could not find another notice page; recommend keep this source and check manually once
```

# PFC (Power Finance Corporation) - audit 2026-10-04
Group: FREE (local Chromium render, 0 ScrapFly credits) | Status: ACTIVE

## Pages watched and tested
| Page | URL | Method | Verdict |
|---|---|---|---|
| Jobs on Offer | https://pfcindia.co.in/en/data/careers/jobs-on-offer (www also works, same content) | fetchItems, render:true, waitFor a[href*='.pdf'], 3 runs, 2.4-3.1 s each | FREE-OK, stable, 10 items every run |
| Careers index | https://pfcindia.co.in/en/data/careers | render | 0 links (not a list page) |

Page is JS-rendered (needs the local browser, which is free). PDFs sit on cms.pfcindia.co.in (allowedHosts already set). Refund-of-fees link goes to pfcapps.com (not a PDF, filtered by include anyway).

## What the scanner catches vs misses
Catches 10 items (current include/exclude). Page has 16 anchors; 3 non-notice (page link, Career Growth Opportunities, backlog data PDF excluded by "backlog"), refund link (not cms), plus 2 shortlist PDFs excluded by "shortlisted".

## Posting speed / flood check
Page is stale: newest entry is Advt 02/2024 selected list; nothing from 2025-26. New postings will appear as new PDFs at the top/anywhere in the list. Links are stable across 3 runs (random suffixes such as _mMxMUL2 are fixed file names, not per-load). No flood risk.

## Label pattern
Titles are plain uppercase PDF captions, no type prefix:
- "ADVERTISEMENT NO. NN/YYYY/<FTE|SME>" = New Job; parent = "Advt NN/YYYY <FTE|SME>" (FTE = fixed term employees, SME = subject matter experts)
- "APPLICATION FOR THE POST OF DIRECTOR (<X>), PFC" = New Job (board-level, PFC Director posts); parent = "Director (<X>) PFC"
- "LIST OF (POST WISE) SELECTED / SHORTLISTED CANDIDATES AGAINST ADVT. NO. NN/YYYY/<X>" = Result; parent = that advt
- "<X> ONLINE APPLICATION PERIOD EXTENDED" = Update (date extension); parent = the SME/FTE advt
- Shortlist titles often lack the advt number; match via filename/date.

## Hold / pass rules for the sorter
Hold: "Notice for caution against fraudulent offers..." (general info), backlog reserved vacancy data, refund of fees, Career Growth Opportunities (internal), compassionate appointment, SME/consultant style roles if small (judge per advt; SME advt here is a contractual expert role - sorter to check size).
Pass: Advertisement notices, Director posts (open applications), selected / shortlisted lists, date extensions.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| APPLICATION FOR THE POST OF DIRECTOR (FINANCE),PFC | New Job | Director (Finance) PFC | Pass |
| APPLICATION FOR THE POST OF DIRECTOR (PROJECTS),PFC | New Job | Director (Projects) PFC | Pass |
| APPLICATION FOR THE POST OF DIRECTOR (COMMERCIAL),PFC | New Job | Director (Commercial) PFC | Pass |
| ADVERTISEMENT NO. 02/2024/FTE | New Job | Advt 02/2024 FTE | Pass |
| LIST OF POST WISE SELECTED CANDIDATES AGAINST ADVT. NO. 02/2024/FTE | Result | Advt 02/2024 FTE | Pass |
| LIST OF SHORTLISTED CANDIDATES (LIST_OF_SHORTLISTED_CANDIDATESHR.pdf) | Result | Advt 02/2024 FTE (by filename/context) | Pass (currently excluded) |
| ADVERTISEMENT NO. 01/2024/SME | New Job | Advt 01/2024 SME | Pass (check size) |
| SME ONLINE APPLICATION PERIOD EXTENDED | Update | Advt 01/2024 SME | Pass |
| ADVERTISEMENT NO. 01/2024/FTE | New Job | Advt 01/2024 FTE | Pass |
| LIST OF POST WISE SELECTED CANDIDATES AGAINST ADVT. NO. 01/2024/FTE | Result | Advt 01/2024 FTE | Pass |
| LIST OF SHORTLISTED CANDIDATES (..._FTEHR.pdf) | Result | Advt 01/2024 FTE | Pass (currently excluded) |
| NOTICE FOR CAUTION AGAINST FRAUDULENT OFFERS FOR LOANS AND RECRUITMENT | Noise | - | Hold |
| Status of Backlog Reserved Vacancies | Noise | - | Hold (already excluded) |
| APPLICATION FOR REFUND OF FEES | Noise | - | Hold (already excluded) |

## Proposed config (sources.json entry)
```json
{
  "id": "pfc",
  "name": "PFC Careers (jobs on offer)",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://pfcindia.co.in/en/data/careers/jobs-on-offer",
  "allowedHosts": ["cms.pfcindia.co.in"],
  "render": true,
  "waitFor": "a[href*='.pdf']",
  "include": "cms[.]pfcindia[.]co[.]in/media/documents",
  "exclude": "refund|backlog|compassionate|qualified|roll no|unique id",
  "limit": 40
}
```
Changing exclude does not re-baseline by itself (URL/selectors unchanged), so the 2 shortlist PDFs would be reported once as new on the next run; acceptable (old 2024 items, sorter can drop) or BatLee can accept the one-off noise.

## Uncertain
- Page content is from 2024; I could not confirm where PFC posts current (2025-26) recruitment notices. Did not guess other URLs.
- No allowEmpty needed (page never empties).
