## BATCH SUMMARY BLOCK
SITE: PPSC (Punjab PSC, state) | VERDICT: FIX (works today; simplification proposed)
PROPOSED: 1) remove "render": true (plain fetch returns the same 40 items in ~0.6 s, 5/5 curl runs 200 OK, 1 MB static HTML) 2) timeoutMs 45000 -> 15000 3) raise limit 40 -> 60 (~40 notices/month, so 40 is only about 1 month of cover) 4) rebaseline is automatic only if URL/selectors change; removing render alone may not rebaseline, but links are identical so no flood
MISSING TODAY: nothing found (page is the single "Public Notices" archive, newest first; ads, results, admit cards, answer keys all in it)
ASK BATLEE: none (optional: keep render:true as is if you prefer zero change; it works, just slower and needs the browser)

# PPSC audit (2026-10-04)

## Pages watched / tested
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Home page, section "Public Notices" (tabid=10) | https://ppsc.gov.in/ | scanner fetchItems with render true: 40 items, 1.9-2.9 s; render false: 40 items, 0.6 s; curl x5: HTTP 200, identical 1,069,140 bytes | FREE-OK (render not needed) |
| Same, with www | https://www.ppsc.gov.in/ | render true: 40 items | works too; no-www kept |
| http | http://ppsc.gov.in/ | 301 redirect to https | use https |

Homepage holds 646 links to tabid=10 (the whole notice archive since about 2022), newest first; the scanner takes the first 40 with include "tabid=10&". Other menu tabs (tabid=3 rules/regulations, 21, 34 etc.) are static info, not postings. No separate advertisements page found in the menu; ads appear as notices in the same list.

## Posting speed / flood
About 40 notices per month in 2026 (Jan 6, Feb 14, Mar 21, Apr 8, May 10, Jun 7, Jul 19, Aug 8, Sep 7). limit 40 = about 1 month cover, fine for daily scans; 60 gives margin. Links are stable ids (index.aspx?page=NNNN&tabid=10&tablinkid=NNNN, increasing). Each link opens a page that holds the PDF; PDFs not tested for ScrapFly need (none needed, whole site free).

## Label pattern
Titles are free text, uppercase or mixed case, ending "UPLOADED ON dd-mm-yyyy" (older ones "UPDATED dd-mm-yyyy"). Forms:
- "PUBLIC NOTICE REGARDING <topic> FOR (THE) RECRUITMENT TO <n> POSTS OF <post> IN THE DEPARTMENT OF <dept> GOVERNMENT OF PUNJAB" -> parent = "<n> posts of <post>, <dept>"
- "FINAL RESULT FOR ...", "PUBLIC NOTICE REGARDING OBJECTIONS IN THE ANSWER KEY ...", "TIME SLOT FOR COMPETITIVE EXAMINATION ...", "... INTERVIEW SCHEDULE ...", "... PROVISIONALLY SHORTLISTED CANDIDATES ...", "CORRIGENDUM REGARDING ...", "ADVERTISEMENT FOR RECRUITMENT TO ..."
- Advertisement numbers sometimes inside the title ("ADVT NO 202270", "ADVERTISEMENT NOS 202229 TO 202236"): use as parent when present.
Type by keyword: advertisement / recruitment to n posts (new) = New Job; admit card = Admit Card; final result / provisionally shortlisted = Result; objections in the answer key = Answer Key; time slot, schedule, reschedule, interview, scrutiny, deficiencies, corrigendum, withdrawing = Update. Note new jobs are often titled "public notice regarding recruitment to ..." so open the PDF to tell new ad from update.

## Hold rules (for the sorter)
- "on transfer basis" posts in PPSC's own office (internal); "notification regarding the 04 posts of senior assistant ... on transfer basis"
- deputation / promotion / departmental posts, calculators-permitted notices, common/wrong-data notices (multiple unique IDs, wrong gender/DOB), result of exams of posts reserved ex-servicemen only, tenders/RTI.
- Pass: ads, schedules/time slots, answer key objections, shortlists, final results, scrutiny/document notices, corrigenda, withdrawals.

## Sample links (audit day)
| Title (shortened) | Type | Parent | Pass/Hold |
|---|---|---|---|
| Public notice regarding recruitment to 75 posts of Junior Auditor Group-B, Finance (01-10-2026) | New Job (verify) | 75 Junior Auditor, Finance Dept | Pass |
| Final result 101 posts Horticulture Development Officer (28-09-2026) | Result | 101 HDO, Horticulture | Pass |
| Objections in answer key, 05 posts Research Officer Group-A, Planning (27-09-2026) | Answer Key | 05 Research Officer, Planning Dept | Pass |
| Time slot, exam, 05 posts Research Officer Group-A (25-09-2026) | Update | same | Pass |
| Objections in answer key, Research Officer, State Directorate of Statistics (20-09-2026) | Answer Key | Research Officer, Statistics | Pass |
| Time slot, 11 posts Research Officer, Statistics (19-09-2026) | Update | 11 Research Officer, Statistics | Pass |
| Multiple unique IDs / wrong gender-DOB, Senior Assistant Advt 202229-202236 (16-09-2026) | Update | Advt 202229-202236 Senior Assistant | Hold (data-correction notice; BatLee may pass) |
| Joint exam SDO / SDE, public notice (01-09-2026) | Update | Joint exam SDO & SDE | Pass |
| Interview schedule, SDO / SDE joint exam (31-08-2026) | Update | same | Pass |
| Interview schedule, Horticulture Development Officer (28-08-2026) | Update | 101 HDO | Pass |
| Reschedule exam Research Officer Group-A Statistics (25-08-2026) | Update | Research Officer, Statistics | Pass |
| Schedule exam Senior Assistant Group-B and Peon Group-D PPSC (14-08-2026) | Update | Senior Assistant / Peon | Pass |
| Notification 04 posts Senior Assistant, PPSC office, transfer basis (04-08-2026) | New Job | PPSC office Sr Assistant | Hold (transfer basis) |
| Answer key objections Senior Assistant Accounts, PUDA (02-08-2026) | Answer Key | 30 Sr Assistant Accounts, PUDA Advt 202270 | Pass |
| Final result Assistant Research Officer, Water Resources (30-07-2026) | Result | ARO, Water Resources | Pass |
| Final result Research Officer, Water Resources (30-07-2026) | Result | RO, Water Resources | Pass |
| Calculators for exam, Sr Assistant Accounts PUDA Advt 202270 (17-07-2026) | Noise | Advt 202270 | Hold (general info) |
| PSCSCCE 2025 Mains public notice (15-07-2026) | Update | PCS Combined Exam 2025 Mains | Pass |

## Proposed config (sources.json, id ppsc)
```json
{
  "id": "ppsc", "name": "PPSC", "runner": "india", "tier": "FREE", "level": "state",
  "type": "html",
  "url": "https://ppsc.gov.in/",
  "include": "tabid=10&",
  "minTitle": 25,
  "limit": 60,
  "timeoutMs": 15000
}
```

## Uncertain
- New-job ads are not labelled distinctly; the sorter must open the notice page to confirm.
- Links open an HTML page then the PDF; PDF direct download not tested (not needed for scanning).
- The 4-hour run only sampled one audit day; render:false reliability tested with 5 curl runs and 1 scanner run, all good.
