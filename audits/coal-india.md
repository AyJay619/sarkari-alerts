## BATCH SUMMARY BLOCK
SITE: Coal India | VERDICT: FIX
PROPOSED: 1) keep coal-india as is (free, stable); 2) add FREE source coal-india-cbt26 = https://www.coalindia.in/career-cil/jobs-coal-india/recruitment-of-management-trainee-through-computer-based-test-cbt-26/ (rowSelector "table tr", rowLink "a[href]", minTitle 20, allowedHosts cloudfront, rebaseline); 3) add FREE source coal-india-results = https://www.coalindia.in/career-cil/appointment-result-interview/ (same options, limit 25, rebaseline)
MISSING TODAY: updates/admit cards/results posted INSIDE a job's own page (e.g. CBT-26 notices dated 21.09.2026, objection notice 08/2026) - main list only shows the job page link, so these are never caught
ASK BATLEE: none (when a new MT/GATE advert page appears, a matching per-advert page source should be added then; recommend doing it when it shows up)

# Coal India (CIL) audit
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, config not yet changed)

## Pages watched and tested (scanner fetchItems, free fetch)
| Page | URL | Result | Verdict |
|---|---|---|---|
| Jobs (current source) | https://www.coalindia.in/career-cil/jobs-coal-india/ | 25 items (limit), 5 runs, 200-550 ms, identical each time. Page has ~195 table rows | FREE-OK |
| Per-advert page (CBT-26) | https://www.coalindia.in/career-cil/jobs-coal-india/recruitment-of-management-trainee-through-computer-based-test-cbt-26/ | 19 items (notices, syllabus, FAQs, advert) | FREE-OK, proposed |
| Appointment / result / interview | https://www.coalindia.in/career-cil/appointment-result-interview/ | 25 items (limit), selection lists, DV/IME notices | FREE-OK, proposed |
| Info bank notices | https://www.coalindia.in/info-bank/notices/ | 25 items but general (consumer meets, pay slips) plus duplicates of contract adverts | not recommended |
| GATE-2027 per-advert page | .../recruitment-of-management-trainee-based-on-gate-2027-score/ | only 1 item (Hindi advert 07/2026); English advert likely a non-table link | page selector would need a look when it grows; skip for now |
| /career-cil/results-coal-india/, /admit-card/ | guessed | 404 (do not exist) | not used |
https are fine with www; PDFs on d3u7ubx0okog7j.cloudfront.net download free (200). Admit card links point to external digialm / apps.coalindia.in pages.

## Scanner catches vs misses
- Catches: new job pages and contract adverts listed on the Jobs page (new rows appear at the top; 25 limit is ample: page has ~195 rows but only a handful change per month).
- Misses: anything posted inside an existing job page (admit card link, objection notice, extension, results), and result lists on the result page.
- Flood check: links are stable (cloudfront file URLs and page slugs); no flood seen in 5 runs. Note some PDFs exist twice with different suffixes (e.g. Notification_2102_Advisor_MM_ECL.pdf vs ..._6Sa3j0D.pdf), duplicates are fine for the sorter.

## Label pattern
No type prefix. Titles are free text such as "Recruitment of Management Trainee through Computer Based Test (CBT-26)" (job page), "Notification for engagement of <post> in <SUBSIDIARY> on contract basis" (contract advert, usually hold), "Notice No. NN/YYYY dated ... for <parent>" (updates). Parent = advert number when present ("Advt. No. 03/2026" = CBT-26 MT; "Advt 07/2026" = GATE-2027 MT; Hindi title "विज्ञापन संख्या 07 2026" is a Hindi duplicate). Subsidiary codes: ECL, BCCL, CCL, SECL, WCL, NCL, MCL, NLC-type CIL HQ, CGIL, BCGCL.

## Hold / pass rules for the sorter
- HOLD: Advisor / Sr. Advisor / task-based advisor / CEO / Executive Director engagement on contract or fixed tenure (consultant-type, mostly retired-eligible), DNB/Diploma seat counselling and selection lists (internal medical courses), CS Practical Trainee notifications unless BatLee wants them, consumer meets, pay fixation notices, scribe forms, syllabus, FAQs, mock link, facilitation centres, Hindi duplicates, objection-management notices.
- PASS: Management Trainee adverts (GATE and CBT), new executive/non-executive posts on open recruitment, Admit card link, results/provisional selection lists, DV & IME schedules, extension / addendum / corrigendum / cancellation notices on a live advert.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment of Management Trainee based on GATE-2027 Score | New Job | MT GATE-2027 (Advt 07/2026) | Pass |
| Recruitment of MT through CBT (CBT-26) | New Job | MT CBT-26 (Advt 03/2026) | Pass |
| Notice CBT-26/25/2026 dated 21.09.2026 | Update | Advt 03/2026 | Pass |
| Notice no. 08/2026 for candidates appeared in CBT held 24.08.2026 | Update (objection) | Advt 03/2026 | Hold |
| Notice No. 22 for extension upto 21.06.2026 | Update | Advt 03/2026 | Pass |
| Addendum regarding CS discipline Advt 03/2026 | Update | Advt 03/2026 | Pass |
| List of facilitation centre CBT-26 | Noise | Advt 03/2026 | Hold |
| Scribe form Appendix I and II | Noise | Advt 03/2026 | Hold |
| Indicative syllabus Paper-I | Noise | Advt 03/2026 | Hold |
| Engagement of Executive Director (IICM) fixed tenure | New Job (contract) | IICM ED | Hold |
| Notification for engagement of Advisor (MM) in ECL on contract basis | Noise (consultant) | ECL Advisor | Hold |
| Full time Advisor (Land and Revenue) in CCL on contract | Noise (consultant) | CCL Advisor | Hold |
| Selection List for DNB/Diploma Courses at Central Hospital CCL & BCCL | Noise | DNB/Diploma | Hold |
| Notification 03/2025 CS Practical Training (Professional Qualified) | New Job | CS Trainee 03/2025 | Pass (BatLee to confirm) |
| Cancellation of notification no. 02/2025 CS Practical Trainee | Update | CS Trainee 02/2025 | Pass |
| Advertisement No. 16/2025 Engagement of CEO for CGIL (fixed term) | New Job (contract) | CEO CGIL | Hold |
| Notice No. 19/2025 CEO for CGIL | Update | CEO CGIL | Hold |
| Notice No. 06/2025 DV & IME Medical Specialists 3rd phase | Update | Medical Executives 2022-23 | Pass |
| Notice No. 06/2023 List of MT provisionally selected GATE-2022 | Result | MT GATE-2022 (Advt 02/2022) | Pass (old, rebaseline hides) |

## Proposed full config (sources.json)
```json
[
  {"id":"coal-india","name":"Coal India","runner":"india","tier":"FREE","level":"central","type":"html",
   "url":"https://www.coalindia.in/career-cil/jobs-coal-india/","rowSelector":"table tr","rowLink":"a[href]",
   "minTitle":20,"limit":25,"allowedHosts":["d3u7ubx0okog7j.cloudfront.net"]},
  {"id":"coal-india-cbt26","name":"Coal India CBT-26 notices","runner":"india","tier":"FREE","level":"central","type":"html",
   "url":"https://www.coalindia.in/career-cil/jobs-coal-india/recruitment-of-management-trainee-through-computer-based-test-cbt-26/",
   "rowSelector":"table tr","rowLink":"a[href]","minTitle":20,"limit":25,
   "allowedHosts":["d3u7ubx0okog7j.cloudfront.net"],"rebaseline":true},
  {"id":"coal-india-results","name":"Coal India Results","runner":"india","tier":"FREE","level":"central","type":"html",
   "url":"https://www.coalindia.in/career-cil/appointment-result-interview/",
   "rowSelector":"table tr","rowLink":"a[href]","minTitle":20,"limit":25,
   "allowedHosts":["d3u7ubx0okog7j.cloudfront.net"],"rebaseline":true}
]
```
(Test used the same options as the current source via fetchItems; allowedHosts not applied by my test script, check the cbt26 page's external admit-card link host (digialm) is intentionally excluded - admit card link itself would be dropped by allowedHosts; consider adding "cdn4.digialm.com" / "cdn.digialm.com" if BatLee wants the admit card link caught.)

## Uncertain points
- CBT-26 page is tied to one advert; when it ends the source goes stale harmlessly, but each new advert needs its own source (manual).
- The GATE-2027 page returned only a Hindi advert via table rows; English advert link format not verified.
- allowedHosts and digialm admit-card links: unverified how the scanner treats off-host links in this case.
- CS Practical Trainee posts: pass or hold is BatLee's call.
- Page order (newest first) assumed from the seen list, not guaranteed.

## BatLee's corrections
- none yet

## Repairs
- none
