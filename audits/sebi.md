## BATCH SUMMARY BLOCK
SITE: SEBI Careers | VERDICT: OK
PROPOSED: 1) timeoutMs 15000 (optional, site answers in 250-500 ms); no other change.
MISSING TODAY: nothing found (one page lists all 140 career notices; no pagination; newest 14-Aug-2026).
ASK BATLEE: none (note: most SEBI posts are contract / deputation / part-time, so expect many HOLDs; the only regular recruitment is Officer Grade A, once a year around Oct-Nov).

# SEBI Careers (audit 2026-10-04, batch mode)
Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Vacancies (everything page) | https://www.sebi.gov.in/sebiweb/about/AboutAction.do?doVacancies=yes | free fetchItems, 4 runs, 248-503 ms, 140 items each, identical | FREE-OK |

- https + www works (current URL correct). no-www https also answers 200; http www does not connect.
- Page is one table (date | title link), ascending by date, oldest first, newest last. 140 rows, all in one page, no pagination or load-more. Date column exists in the page (e.g. 14-Aug-2026) but the scanner does not need it.
- Each row opens careerdetail.jsp?careerId=N, which shows the notice PDF in an iframe (sebi.gov.in/sebi_data/careerfiles/<mon-year>/<n>.pdf). The detail page loads free (200); PDFs are on the same host and are not blocked (not downloaded in this audit).
- Posting speed: about 8-10 rows a year (2025: 8 rows; 2026 so far: 8 rows). Scan frequency is far more than needed. Limit 400 vs 140 rows: plenty of headroom.
- Link stability (flood check): links are careerId numbers, stable and ascending, so no repeat alerts expected. careerId is not contiguous (ids skip), normal.

## What the scanner catches vs misses
Catches every row (include "careerdetail"). Misses nothing seen. Titles include the full wording, so the type is readable from the title. The current exclude (compassionate|qualified|roll no|unique id) drops nothing today.
Latest cycle: Officer Grade A (Assistant Manager) 2025 (advance intimation 08-Oct-2025, advert 30-Oct-2025, addendum 14-Nov-2025, handouts/call letters Jan-Feb 2026, interview call letter 17-Apr-2026). No 2026 Grade A advance intimation yet (last year's came 08-Oct, so it may appear soon).

## Label pattern
Titles are free text, no fixed prefix. Pattern: "<Recruitment of / Advertisement / Application for> <post or exam>" for adverts, "<exam> - <Download of Call Letter / Information Handout / Call letter for Interview / Addendum / Corrigendum>" for updates. Parent for the sorter: the exam name + year, e.g. "SEBI Officer Grade A (Assistant Manager) 2025", or the post name for single posts ("SEBI Security Coordinator (contract) Aug 2026"). Types by wording: "Advance Intimation" = New Job (pre-notice, pass as heads-up); advert = New Job; "Call Letter" = Admit Card; "Information Handout" = Update (exam info); "Addendum / Corrigendum / Revised" = Update; "Result / List of candidates selected" = Result.

## Hold / pass rules for the sorter
- HOLD: "on Contract basis" / "Contract" single posts (Security Coordinator, CITSO, Consultant IT, Nutritionist, Part-Time Counsellor, Part-Time Medical Officer, IT Executive walk-in, NCFE contract hires), deputation posts (Executive Director on Deputation / Contract, Officers Grade A/B/C on deputation, Director at NISM), "Format of ... certificate" forms, "Declaration Form for ... scribe", "Marks obtained", old cycles (2022 and earlier) baseline only.
- PASS: Officer Grade A (Assistant Manager) advance intimation / advert / addendum / corrigendum / call letters (Phase I, II, interview) / results, any new regular (non-contract, non-deputation) recruitment, Special Recruitment Drive notices if new.
- Judgement: Executive Director "Deputation / Contract" and CEO of NCFE are senior one-off posts; hold per deputation rule, BatLee may override.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| SEBI - Recruitment of Security Coordinator on (on Contract basis) (14-Aug-2026) | New Job | SEBI Security Coordinator (contract) | Hold |
| SEBI Recruitment Exercise - Recruitment of Executive Director on Deputation / Contract (26-Jun-2026) | New Job | SEBI Executive Director | Hold |
| Recruitment of Officer Grade A (Assistant Manager) 2025 - Call Letter for Interview (17-Apr-2026) | Admit Card | SEBI Officer Grade A 2025 | Pass |
| Application for the post of Part-Time Counsellor (on contract basis) (10-Apr-2026) | New Job | SEBI Part-Time Counsellor | Hold |
| Officer Grade A 2025 ... Call Letter for Phase II (12-Feb-2026) | Admit Card | SEBI Officer Grade A 2025 | Pass |
| Officer Grade A 2025 ... Information Handout for Phase II and Scribe Declaration forms (12-Feb-2026) | Update | SEBI Officer Grade A 2025 | Pass (info handout; sorter judgement) |
| Officer Grade A 2025 ... Call Letter for Phase I (03-Jan-2026) | Admit Card | SEBI Officer Grade A 2025 | Pass |
| Officer Grade A 2025 ... Information Handout (03-Jan-2026) | Update | SEBI Officer Grade A 2025 | Pass |
| Addendum - Recruitment of Officer Grade A (Assistant Manager) 2025 (14-Nov-2025) | Update | SEBI Officer Grade A 2025 | Pass |
| Recruitment of Officer Grade A (Assistant Manager) 2025 - General, Legal, IT, Research, OL, Eng (Electrical), Eng (Civil) (30-Oct-2025) | New Job | SEBI Officer Grade A 2025 | Pass |
| Advance Intimation - Recruitment of Officer Grade A 2025 ... (08-Oct-2025) | New Job | SEBI Officer Grade A 2025 | Pass (heads-up) |
| Recruitment of Executive Director on Deputation / Contract (24-Jun-2025) | New Job | SEBI Executive Director | Hold |
| Officer Grade A 2024 - Call letter download for Interview (23-Oct-2024) | Admit Card | SEBI Officer Grade A 2024 | Hold (old cycle) |
| Hiring a Consultant - IT for NCFE on contract basis | New Job | NCFE consultant | Hold |
| Format for SC/ST/OBC/PWD Certificates | Noise | n/a | Hold |

## Proposed config (sources.json, sebi entry)
```json
{
  "id": "sebi", "name": "SEBI Careers", "runner": "india", "tier": "FREE", "level": "central",
  "type": "html",
  "url": "https://www.sebi.gov.in/sebiweb/about/AboutAction.do?doVacancies=yes",
  "include": "careerdetail",
  "exclude": "compassionate|qualified|roll no|unique id",
  "minTitle": 15,
  "limit": 400,
  "timeoutMs": 15000
}
```
Adding timeoutMs does not change the URL or selectors, so no rebaseline is needed.

## Uncertain points
- The notice itself is inside a PDF on the detail page; the scanner link points to the detail page (HTML), not the PDF. Sorter can read the PDF URL from the iframe in the detail page.
- No results page for completed cycles is visible (final selection lists are not listed for 2024/2025 cycles); SEBI may publish results elsewhere (press releases), not checked.
- Posting is rare, so a long silence is normal, not a failure.
