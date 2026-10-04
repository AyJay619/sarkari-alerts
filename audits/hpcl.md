## BATCH SUMMARY BLOCK
```
SITE: HPCL Careers | VERDICT: OK
PROPOSED: 1. Optional: raise limit 25 -> 40 (page has exactly 25 matching links today, so the cap is already full); no other change
MISSING TODAY: nothing found (the 'Click here to Apply' links and /images/ form PDFs are dropped on purpose; 'Selection Methodology' PDFs are excluded by config)
ASK BATLEE: none
```

# HPCL Careers (hindustanpetroleum.com)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Job Openings (the only notice page) | https://www.hindustanpetroleum.com/job-openings | free fetch via fetchItems | FREE-OK, 25 items, 0.5-0.9 s, 6/6 runs identical |

http and no-www both 301 to https://www... (works). The page is server-rendered HTML; no JS needed. /careers is an old static page (form formats in ../images/), nothing new to watch. The admit card portal link goes to ibpsreg.ibps.in (third party, link is on the page and is caught).

## What the scanner catches vs misses
Catches all 25 notice links on the page (66 PDF/doc links exist; the rest are /images/ certificate formats, apply buttons, and 2 'Selection Methodology' PDFs excluded by config). Nothing useful missed. An old April admit card link is commented out in the HTML (not live).
Posting speed: no dates on the page; new postings are added at the top of the list, so a 25 limit drops only the oldest. Because exactly 25 match now, raising the limit to 40 is a harmless safety margin.
Link stability (flood check): links are plain static document URLs under /documents/pdf/, stable across 6 runs. Two oddities (double slash in the Scribe letter URL, ../ prefixes) are normalised by the seen check. No flood risk seen. Generic link titles repeat ("View Window Advertisement", "Detailed Advertisement (pdf attached)") so the sorter must use the PDF filename/content to tell postings apart.

## Label pattern
No date and no consistent parent in titles. Pattern: block per recruitment, in order:
- "View Window Advertisement" = short newspaper-style ad (parent in PDF filename/content, e.g. Officers 26-27, Dir Marketing, HPCL GAT Refineries FY26-27)
- "Detailed Advertisement (pdf attached)" = full advert (Feb 2026, July 2026 officers)
- "(Content is in Hindi)" = Hindi duplicate
- "Download Admit Card for ... <posts>" = admit card (ibps link)
- "Corrigendum/ Addendum dated <date>" = update; "Position Wise Cut-off Marks ... CBT" = result-type
Parent must be read from the PDF.

## Hold / pass rules for the sorter
Hold: "Engagement of Ex-Employees as TA Consultant" (retired-only, English/Hindi/annexure docx); any "(Content in Hindi)" duplicate; "Details of Applications Received" / "Position Wise Application Count"; "Recruitment Fraud Alert" public notice; FAQs; syllabus PDFs (general info, hold unless BatLee says otherwise); PwBD certificate format / scribe undertaking / physical limitation certificate (forms); Selection Methodology (excluded by config anyway).
Pass: View Window / Detailed Advertisements (new jobs), Admit Card, CBT cut-off marks (result), Corrigendum/Addendum.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Engagement of Ex-Employees as TA Consultant for Visakh Refinery - English Advt. | New Job | VR TA Consultant 2026 | Hold (retired only) |
| ...Hindi Advt. | Hindi dup | same | Hold |
| Application and Declarations Format (Word) | Noise | same | Hold |
| Details of Applications Received | Noise | - | Hold |
| Download Admit Card for CBT: JE Chemical, JE Fire & Safety, AM/M Projects | Admit Card | Officers (Aug 2026 CBT) | Pass |
| Syllabus for Junior Executive - Chemical | Info | same | Hold |
| Syllabus for JE Fire & Safety | Info | same | Hold |
| Syllabus for AM/Manager Projects | Info | same | Hold |
| Corrigendum/ Addendum dated 2nd July, 2026 | Update | Officers 2026-27 | Pass |
| View Window Advertisement (Officers 26-27.pdf) | New Job | Officers 26-27 | Pass |
| Detailed Advertisement (Recruitment of Officers July-26) | New Job | Officers July 2026 | Pass |
| Detailed Advertisement ... (Hindi) | Hindi dup | same | Hold |
| View Window Advertisement (Dir Marketing) | New Job | Director Marketing | Pass |
| Position Wise Cut-off Marks, CBT 3 May 2026, Advt HPCL/OPEN/HR/3/2025-26 | Result | Advt HPCL/OPEN/HR/3/2025-26 | Pass |
| Public Notice: Recruitment Fraud Alert | Noise | - | Hold |
| Detailed Advertisement (Feb 2026) | New Job | Officers Feb 2026 | Pass |
| Frequently Asked Questions | Noise | - | Hold |
| View Window Advertisement (HPCL GAT Refineries FY26-27) | New Job | GAT Refineries 26-27 | Pass |
| Letter of Undertaking for Using Own Scribe | Noise | - | Hold |

## Proposed config (current, with optional limit bump)
```json
{
  "id": "hpcl", "name": "HPCL Careers", "runner": "india", "tier": "FREE", "level": "central",
  "type": "html", "url": "https://www.hindustanpetroleum.com/job-openings",
  "include": "documents/pdf|admit|result|advt|advertisement|recruitment",
  "exclude": "Selection Methodology|Application Count",
  "minTitle": 25, "limit": 40
}
```

## Uncertain
- Selection Methodology (Revised) PDFs are excluded by config; the standing rules do not list them as pass, so left excluded.
- Page has no dates; "newest first" is assumed from layout.

## BatLee's corrections
- none yet

## Repairs
- none
