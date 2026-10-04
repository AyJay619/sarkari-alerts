# NHPC (batch audit)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, not yet BatLee-reviewed)

## BATCH SUMMARY BLOCK
SITE: NHPC | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page 1 = newest 10 rows; NHPC posts about 10 notices per 6-7 weeks, so limit 25 / 10 visible rows is safe; no separate results/current-openings page exists)
ASK BATLEE: none

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
| All notices (jobs, results, notices, merged) | https://www.nhpcindia.com/welcome/job | free fetch via fetchItems | FREE-OK |

- www / no-www and http / https all return the same page (200). Current https://www works; keep it.
- 4 repeated scanner runs: 10 items each time, 0.7-0.9 s, no flakiness.
- Pagination exists (/welcome/job/10, /job/20 are older pages, 10 rows each). Not needed: page 1 holds the newest 10 and rows are ordered newest first.
- Sitemap and homepage showed no other recruitment / results page. Everything is on /welcome/job.
- PDFs live at https://www.nhpcindia.com/assests/pzi_public/job/... (note the site's spelling "assests"); links are stable per notice (details_<timestamp>_<n>.pdf), no flood risk seen.

## Scanner catch vs miss
Catches all 10 visible rows with clean title + PDF link. Dates are on the page (dd-mm-yyyy) but not extracted (not needed). Some rows carry two links (second one in Hindi or FAQ PDF); scanner takes the first, fine. One title carries trailing junk "( Not Available | PDF | Adobe Reader... )" - harmless, the sorter should ignore it.

## Posting speed
Page 1 spans 05-08-2026 to 22-09-2026 (10 rows in ~7 weeks); busy phases give 3-4 rows a day (12-08, 14-08, 25-06) so limit 25 has ample margin.

## Label pattern
Plain title, no "<Type>:" prefix. Rules:
- "List of provisionally selected candidates ... against Advt. No.NH/Rectt./NN/YYYY" = Result (final/provisional selection). Parent = "Advt NH/Rectt/NN/YYYY" plus post (e.g. "TE (Civil)").
- "List of Provisionally Shortlisted Candidates for Personal Interview, GD..." = Result (shortlist) / interview schedule, pass.
- "List of candidates called for document verification (DV)" / "Document Verification against Advertisement..." = Update (DV schedule), pass.
- "Extension of Last Date ..." = Update (extension), pass.
- "Notification: Special Recruitment Drive ..." / advertisement titles = New Job.
- Advt number format varies: NH/Rectt./04/2025, NH/Rectt/02/2026, NH/Recruitment/04/2025 - normalise to "NH/Rectt/NN/YYYY".
- Apprenticeship lists reference "advertisement no. NH/Rectt./01/2026" (apprentice drive).

## Hold / pass rules for the sorter
Hold: Expression of Interest for empanelment (arbitrators etc.), Director (Projects) selection notices (CPSE PESB board process, not a normal job), apprenticeship results for a single power station / regional office (local, low value; recommend hold unless BatLee wants apprentice results), tenders, RTI, deputation, consultants, Hindi duplicates.
Pass: TE / JE / ARO / Hindi Translator / Trainee Officer results and shortlists, DV schedules, extensions, new advertisements, UGC NET score-use notices for Trainee Officer posts.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
| List of prov. selected, JE (Civil), JE (E and C), JE (Mech), ARO | Result | Advt NH/Rectt/04/2025 | Pass |
| EOI for Empanelment of Arbitrators | Noise | - | Hold |
| Prov. selection of apprenticeship at Sewa-II Power Station | Result | Apprentice Advt 01/2026 (Sewa-II) | Hold (local apprentice) |
| Prov. selected TE (Mechanical) | Result | Advt NH/Rectt/02/2026 TE (Mech) | Pass |
| Prov. selected TE (Electrical) | Result | Advt NH/Rectt/02/2026 TE (Elec) | Pass |
| Prov. selected TE (Civil) | Result | Advt NH/Rectt/02/2026 TE (Civil) | Pass |
| Apprenticeship selected, 3rd phase | Result | Apprentice Advt 01/2026 | Hold (apprentice, recommend) |
| JE (Civil) 4th list and ARO 3rd list | Result | Advt NH/Rectt/04/2025 | Pass |
| Called for DV, JE(E&C) and JE(Mech) | Update (DV) | Advt NH/Rectt/04/2025 | Pass |
| Apprenticeship selected, 2nd phase | Result | Apprentice Advt 01/2026 | Hold (apprentice, recommend) |
| Extension of last date for online consent (22-06) | Update | (post not named in title) | Pass |
| Shortlisted for PI, GD, Psychometric (x4) | Result/Update | Trainee Engineer drive | Pass |
| Notice for Selection, Director (Projects) | Noise | - | Hold |
| Special Recruitment Drive SC/ST/OBC/PwBD, Trainee Engineers (12-03) | New Job | Special drive TE | Pass |
| Prior intimation, UGC NET-2026 score, Trainee Officer (HR) | Update | Trainee Officer (HR) | Pass |

## Full proposed config
Unchanged (current entry works):
```json
{ "id": "nhpc", "name": "NHPC", "runner": "india", "tier": "FREE", "level": "central", "type": "html",
  "url": "https://www.nhpcindia.com/welcome/job", "rowSelector": "li.list-group-item",
  "rowTitle": ".col-md-7", "rowLink": "a[href]", "limit": 25 }
```
Optional: add "timeoutMs": 15000 (site answers in under 1 s).

## Uncertain
- Whether BatLee wants apprenticeship results (my recommendation: hold).
- The extension notice titles do not name the post; sorter must open the PDF to find the parent.
- Did not open PDFs for content; classification is from titles.

## BatLee's corrections
- none yet

## Repairs
- none
