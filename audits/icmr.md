## BATCH SUMMARY BLOCK
```
SITE: ICMR (Indian Council of Medical Research) | VERDICT: FIX
PROPOSED: 1) keep icmr (employment-opportunities) as is - works free, 7 rows, stable 4/4 runs, ~0.7-1.1 s
PROPOSED: 2) ADD source "icmr-results" = https://www.icmr.gov.in/career-results, same extraCerts/rowSelector/rowTitle/rowLink as icmr, limit 60 (19 rows today; interview notices, results, eligible lists)
PROPOSED: 3) optional: keep the existing exclude only on icmr; on icmr-results leave no exclude (compassionate-appointment notice then reaches the sorter, which holds it)
MISSING TODAY: all results / interview / eligibility notices (about 20 posted since Aug 2026, many for Scientist and Director posts); archive page ?archive=1 (older ads, not needed)
ASK BATLEE: ICMR posts mostly Consultant / Young Professional / deputation notices (HOLD by rule) - keep the source anyway? Recommend yes, a few real jobs appear (Scientist, Addl. DG, Director); ICMR cert (certs/icmr.pem) is no longer needed today (plain fetch gives 200) - recommend keep it, harmless.
```

# ICMR
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (batch audit, nothing applied)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Employment Opportunities (current) | https://www.icmr.gov.in/employment-opportunities | free, https, www, extraCerts certs/icmr.pem | FREE-OK. 7 rows, one per advertisement |
| Career Results (interviews, results, eligibility lists) | https://www.icmr.gov.in/career-results | free, same options | FREE-OK. 19 rows via the same selectors (20 on the page, 1 dropped by the existing "compassionate" exclude) |
| Employment Opportunities archive | https://www.icmr.gov.in/employment-opportunities?archive=1 | free | works, older ads only; not needed |
| Recruitment Portal | https://recruitment.icmr.org.in/ | NOT tested | external portal, not opened |

Tested with the scanner's own fetchItems: 4 runs on icmr (7,7,7,7) and 3 runs on the results page (19,19,19), no flakiness. Plain fetch without extraCerts also returned HTTP 200 today, so the cert file is probably no longer needed (safe to leave).
ScrapFly not needed (credits 0). PDFs are direct links under /icmrobject/uploads/ (not tested for download, links only).

## Page structure
- Table: Serial, Title, Venue, Date, Document. The first `a.descView__link` in a row is the English advertisement (or the only document). The row also holds Hindi advertisement and application form links; the scanner takes only the first, so Hindi duplicates are skipped by design.
- Rows are listed newest first. Employment page: 7 rows, all open advertisements (no pagination today). Results page: 83 pages of 20, only page 1 is needed.
- Links are file-name stable (epoch prefix + name), so no flood risk. Posting speed: about 5-8 notices per week on the results page, well below limit 60.

## Label pattern
Titles are free text, shape: "Advertisement (<advt no.>) for the position of <post> at ICMR-<institute>, <city> (Last date: ...)". Parent = post + institute + advt no. (e.g. "Consultant (Medical/Non-Medical), ICMR-Hqrs", "Advt 05/2026-27 NITHR Jabalpur"). Results page titles: "Result / Interview notice / List of eligible and ineligible candidates ... for the post of <post> ... advertised vide Advt No. <no.> dated <date>". Parent = the Advt No. quoted in the title.

## Pass / hold rules for the sorter
Hold: Young Professional, Consultant (any), project staff on temporary / contract basis, deputation posts (Assistant, Section Officer), LDCE / promotion orders, compassionate appointment, Hindi duplicates, Employment News reprints of an advertisement already seen, application-form-only links.
Pass: Scientist / Director / Additional DG / faculty and other regular recruitments, Common Recruitment Examination (CRE) notices and results, results / interview notices / eligible lists for a regular post that was posted, corrigenda / extensions.
Note: Result and interview rows for Consultant / Young Professional posts are Hold (small contract roles).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Advertisement (CD/TBaccelerator/Admin, 28.09.2026) Young Professional-I and II, ICMR-Hqrs | New Job | YP-I / YP-II ICMR-Hqrs | Hold (young professional) |
| Advertisement (5/9/7/Misc(staff)/2026-Nut) Consultant (Medical/Non-Medical), ICMR-Hqrs | New Job | Consultant ICMR-Hqrs | Hold (consultant) |
| Advt 05/2026-27 various project positions, NITHR Jabalpur (last date 5-6 Oct) | New Job | Advt 05/2026-27 NITHR | Hold (temporary / contract) |
| Advt 05/2026-27 Young Professional-I (Admin), NITHR Jabalpur | New Job | Advt 05/2026-27 NITHR | Hold |
| Walk-in interview Consultant (Scientific-Medical), ICMR-NIRWoH Mumbai | New Job | Consultant NIRWoH | Hold |
| Advt ICMR-NIREH/Estt/Assistant/01/2026 Assistant on deputation, NIREH Bhopal | New Job | Assistant NIREH | Hold (deputation) |
| Vacancy Circular Section Officer (Level-7) on deputation, ICMR | New Job | Section Officer ICMR | Hold (deputation) |
| Notice for interview, Additional Director General (ICMRHQ/Addl.DG(IM)/01/2026) | Update (interview) | Addl. DG 01/2026 | Pass |
| List of eligible / ineligible, Associate and Assistant Professor (BMHRC/Faculty/01/2026) | Update (shortlist) | BMHRC Faculty 01/2026 | Pass |
| Result Consultant (Scientific-Non-Medical), Hqrs | Result | Consultant Hqrs Staff Hiring 2026 | Hold (consultant) |
| Result Scientist-B (Non-Medical) (IT/Computer Science), Advt 377/2025 | Result | Scientist-B Advt 377/2025 | Pass |
| List of eligible / ineligible, Additional Director General | Update (shortlist) | Addl. DG 01/2026 | Pass |
| Result of CRE-4 for Junior Translation Officer, ICMR Hqrs | Result | JTO CRE-4 | Pass |
| Interview notice, Director NIOH Nagpur | Update (interview) | Director NIOH Nagpur | Pass |
| Result Jr. Consultant (Admin)-Procurement, CPC/Staff/Consultant/2025-26 | Result | Jr Consultant CPC | Hold |
| Result Scientist-C (4) and Scientist-D (2), NARFBR/01/2025 | Result | Advt NARFBR/01/2025 | Pass |
| Interview notice, 36 vacancies Scientist-B (Non-Medical), 15-18 Sep 2026 | Update (interview) | Scientist-B (Non-Med) | Pass |
| Promotion to Assistant through LDCE, vacancy year 2025 and 2026 | Noise | LDCE Assistant | Hold (LDCE / promotion) |
| Compassionate appointment, Technician-I | Noise | Compassionate appointment | Hold (currently dropped by existing exclude) |
| Result Scientist-D (Medical) (Clinical Trials), Sc-D/01/2026 | Result | Scientist-D Clinical Trials | Pass |

## Proposed config (JSON)
```json
[
  {
    "id": "icmr",
    "name": "ICMR Employment Opportunities",
    "runner": "india",
    "tier": "FREE",
    "level": "central",
    "type": "html",
    "url": "https://www.icmr.gov.in/employment-opportunities",
    "extraCerts": ["certs/icmr.pem"],
    "timeoutMs": 15000,
    "rowSelector": "tr:has(a.descView__link)",
    "rowTitle": "td:nth-child(2)",
    "rowLink": "a.descView__link",
    "exclude": "compassionate|qualified|roll no|unique id",
    "limit": 60
  },
  {
    "id": "icmr-results",
    "name": "ICMR Career Results and Interview Notices",
    "runner": "india",
    "tier": "FREE",
    "level": "central",
    "type": "html",
    "url": "https://www.icmr.gov.in/career-results",
    "extraCerts": ["certs/icmr.pem"],
    "timeoutMs": 15000,
    "rowSelector": "tr:has(a.descView__link)",
    "rowTitle": "td:nth-child(2)",
    "rowLink": "a.descView__link",
    "limit": 60
  }
]
```
The timeoutMs 15000 is optional (answers in about 1 s; add per the standing 15 s rule). Existing `exclude` on icmr is already in config; it is kept, nothing new added.

## Uncertain points
- The Recruitment Portal (recruitment.icmr.org.in) was not opened; it may hold the real Scientist/Admin application data but is not a notice list.
- Result titles for different parents share the generic wording "Result", so the sorter must read the Advt No. inside the title.
- PDF download test not done (links only).

## BatLee's corrections
- none yet

## Repairs
- none
