# DRDO (RAC + Vacancies of labs)
Audited: 2026-10-04 (BATCH mode) | Group: FREE | Status: ACTIVE (no change needed)

## BATCH SUMMARY BLOCK
SITE: DRDO (drdo-rac + drdo-vacancies) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (RAC FAQ PDFs are excluded on purpose; older lab posts are on page 2 of the vacancies list, 6 items, all old)
ASK BATLEE: none

## Pages watched and tested
| Source | URL | Fetch | Verdict |
|---|---|---|---|
| drdo-rac | https://rac.gov.in/index.php?lang=en&id=0 | free, scanner fetchItems, 3 runs: 15 items, 110-320 ms | FREE-OK |
| drdo-vacancies | https://drdo.gov.in/drdo/en/offerings/vacancies | free, 3 runs: 12 items (one page = 12 boxes), 70-250 ms | FREE-OK |

URL notes: rac.gov.in without www is correct (http redirects 302 to https; www.rac.gov.in returns HTTP 500, do not use www). drdo.gov.in works on https and http; the scanner already links items as http (fine, seen check ignores it). RAC PDFs download free (advt_157.pdf 200, ~298 KB). DRDO lab detail pages open free over https. Group FREE, 0 ScrapFly credits.

Other pages checked: RAC content.php menu pages (id 39, 40, 41, 62, 8, 16, 17) hold no notice PDFs (only the caution notice); RAC Archive page is old material only. DRDO CEPTAM page returns 200 but "No Content" (as README says), still skip. Vacancies page 2 (`?page=1`) has 6 older rows, not needed.

## What the scanner catches vs misses
- RAC home shows three blocks: current Advertisements (157, 156, 152, 154) with sub-files, Latest notices (public notice, addenda), alert/caution. Scanner (include advt|result|notice|admit, exclude faq, limit 20) catches 15; the 5 skipped are FAQ files, the caution/alert PDFs and a jpg. Correct.
- RAC has no separate results/admit-card list on the home page today. Results/admit cards for RAC come as notices on this same page when they appear; the "result|admit" include words cover them.
- Vacancies: all 12 rows on page 1 caught, with start/end dates from the list.
- Posting speed: no site-side limit hit (15 and 12 items, limits 20 and 30). Flood check: link stability good, vacancies slugs are stable; RAC filenames are versioned (advt_156_v3.pdf, calendar02 etc.), so a re-upload with a new version suffix will look like a new item (a "Tentative Schedule" or "Advertisement" revision). Sorter should treat as Update of the same advt.

## Label pattern
RAC: link text is generic ("Advertisement", "Tentative Schedule", "Pay Equivalence Matrix", "Brief Advertisement"); the PARENT is only in the filename: `advt_<NNN>...pdf` gives Advt <NNN> (e.g. advt_157 = Advt 157; `payEquivalenceCriteria_advt154.pdf` = Advt 154). Notices carry the parent in the title: "Addendum to Advt. no. 156 : ..." = Advt 156 Update. Public Notice titles carry size and "Published on: <date>" noise (e.g. GATE score notice, 31 Aug 2026).
Vacancies: "<LAB>, <City> invites eligible candidates for <engagement of Apprentices / walk in interview for JRF / ...>" = New Job, parent = lab + city + post (e.g. "RCI, Hyderabad - Apprentices"). "List of selected / provisionally selected and waitlisted candidates ... JRF interview held on <date> at <LAB>" and "Result of walk in interview ... at <LAB>" = Result, parent = that lab + JRF/RA walk-in. "Advertisement for the post of ..." = New Job.

## Hold / pass rules for the sorter
Hold: RAC "Pay Equivalence Matrix / Criteria" (info), FAQ, Tentative Schedule of the exam stages unless it changes the process (borderline: schedule = info, hold), alert/caution notices, Lateral Entry / LDCE / DRDS departmental pages, "Advertisement for DRDO Chair / Distinguished Fellowship / Fellowship" (fellowship scheme, consultant-like: hold unless BatLee wants), director posts on deputation / retired (check PDF: DIA-CoE BHU Director), internships (CASDIC paid internship for students: hold, not a job), tenders, Hindi duplicates.
Pass: RAC Advertisement / Brief Advertisement (one New Job per advt, merge the brief and full copy), addenda / corrigenda / public notice on GATE score requirement for Scientist B (exam-entry notice), results, admit cards. Lab apprentice ads (RCI, PXE, DIPR) and JRF walk-in interviews pass as New Job; lab result lists pass as Result.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Advertisement (advt_157.pdf) | New Job | Advt 157 | Pass |
| Brief Advertisement (advt_157_brief.pdf) | New Job (duplicate) | Advt 157 | Pass (merge) |
| Pay Equivalence Matrix (advt_157) | Noise | Advt 157 | Hold |
| Tentative Schedule (advt_157_calendar02) | Info | Advt 157 | Hold |
| Advertisement (advt_156_v3.pdf) | New Job / revised | Advt 156 | Pass |
| Addendum to Advt. no. 156: Post Induction Training | Update | Advt 156 | Pass (borderline, info for selected) |
| Addendum to Advt. no. 156: Additional Information on 3 posts under DST | Update | Advt 156 | Pass |
| Advertisement (advt_152.pdf) | New Job | Advt 152 | Pass |
| Advertisement (advt_154.pdf) | New Job | Advt 154 | Pass |
| Public Notice: valid GATE score for Scientist B (DRDS) | Update | DRDS Scientist B 2027 | Pass |
| RCI, Hyderabad invites ... engagement of Apprentices | New Job | RCI Hyderabad Apprentices | Pass |
| PXE, Balasore invites ... Apprentices | New Job | PXE Balasore Apprentices | Pass |
| DIPR, Delhi invites ... ITI pass-out Apprentices | New Job | DIPR Delhi Apprentices | Pass |
| MTRDC, Bengaluru ... walk in interview for JRF | New Job | MTRDC JRF | Pass |
| LRDE / DYSL-SM / NPOL / VRDE ... walk in interview JRF | New Job | per lab | Pass |
| List of Selected candidates of JRF Interview, DGRE Chandigarh | Result | DGRE JRF | Pass |
| Result of Walk in interview 02 Sept 2026, DMSRDE Kanpur | Result | DMSRDE RA/JRF | Pass |
| Advertisement for the Post of Director, DIA-CoE, BHU | New Job | DIA-CoE BHU Director | Check (likely deputation/retired) |
| Advertisement for DRDO Chair / Distinguished Fellowship | New Job? | DRDO Fellowship | Hold (fellowship) |
| CASDIC paid internship BE/B.Tech, M.Sc | Noise | CASDIC | Hold |
| ALERT / CAUTION fake emails | Noise | RAC | Hold |

## Current config (unchanged) and proposal
```json
[
 {"id":"drdo-rac","url":"https://rac.gov.in/index.php?lang=en&id=0","include":"advt|result|notice|admit","exclude":"faq","limit":20},
 {"id":"drdo-vacancies","url":"https://drdo.gov.in/drdo/en/offerings/vacancies","rowSelector":".vacanciess-box","rowTitle":".vacanciess-title","rowLink":".vacanciess-view-node a","rowEndDate":".vacanciess-due-date-content","rowStartDate":".vacanciess-start-date-content","minTitle":15,"limit":30}
]
```
No changes proposed.

## Uncertain
- RAC titles are generic, so the sorter must open the PDF or read the filename to name the parent. The scanner passes the link only.
- RAC may later post results/admit cards under other wording not matching include (e.g. "Selection list", "Interview"); watch.
- Not opened: detail pages of every lab post (only the list was audited).

## BatLee's corrections
- none yet

## Repairs
- none
