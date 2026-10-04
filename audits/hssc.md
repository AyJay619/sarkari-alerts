## BATCH SUMMARY BLOCK
SITE: HSSC (Haryana Staff Selection Commission, state) | VERDICT: OK
PROPOSED: none (optional: add an exclude for "Marks of the candidates"/"Revised Marks" rows on hssc-results; the rules say hold in the sorter, so not proposed)
MISSING TODAY: nothing found (each page lists only the latest 10 rows server-side; limit 20 is fine)
ASK BATLEE: none

# HSSC (hssc.gov.in)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, no config changes)

## Pages watched and tested
| Source id | URL | Fetch | Verdict |
|---|---|---|---|
| hssc-advt | https://hssc.gov.in/advertisement | free, scanner fetchItems, 3 runs, 10 items each, 100-400 ms | FREE-OK |
| hssc-notices | https://hssc.gov.in/publicNotice | free, 3 runs, 10 items, ~75 ms | FREE-OK |
| hssc-results | https://hssc.gov.in/result | free, 3 runs, 10 items, ~80 ms | FREE-OK |

URL version: https without www works (www also returns 200; http redirects 301 to https). Keep https no-www.
Other pages seen in the menu: /notifications (no file links, nothing to catch), /examsyllabus, /tender (hold anyway). Homepage banner links "Apply for CET Group D-05/2026" and "Apply for Advt no. 06/2026" (external apply portal adv062026.hryssc.com), not notice links. No separate Admit Card page; admit cards, if any, appear as public notices.
ScrapFly: not needed. PDFs: links are /file/<uuid>/<section>, same host, free.

## What the scanner catches vs misses
Each page renders the 10 newest rows in the HTML (DataTables, no pagination in the source). Scanner catches all 10 of each. Posting speed: advertisements are rare (about 1-3 per month, plus corrigenda); notices and results move faster (several per week during PST/PMT/answer-key phases). 10 rows is enough unless more than 10 land between scans (unlikely at normal frequency). Flood check: links are stable UUID file links; rows shift out only when new ones appear. Nothing missed today.

## Label pattern
- hssc-advt: scanner prefixes "HSSC Advt." and the cell text carries "<title> <date YYYY-MM-DD>". Titles: "Advt. No. NN/YYYY (Group-X)", "Corrigendum Advt. No. NN/YYYY", "Corrigendum in Appendix-A (Advt.No.NN/YYYY)", "Closing Date Extension". Parent = "Advt NN/YYYY" (the number is in the title; no PDF filename info, links are opaque UUIDs). Group C/D (CET) ads come as Advt 05/2026 / 06/2026.
- hssc-notices / hssc-results: sentence-style titles (often ALL CAPS) with no date: "<action> for the post of <post> against Advt. No. NN/YYYY, Cat. No. NN of <department>". Parent = "<post> / Advt NN/YYYY Cat NN". Several notices cover multiple advts ("Advt. Nos. 13/2024, 01/2026 & 06/2026"): parent = the list of advts.
- Title is trimmed by the scanner at ~150 chars in some outputs (long titles end "...Haryana" fine; ALL CAPS ones can be cut mid-phrase).

## Pass / hold rules for the sorter
Pass: new advertisements and their corrigenda/extensions; answer keys (provisional/final); results (final, waiting list, additional candidates, revised final result); PST/PMT physical test notices and re-schedules (current cycle, candidates called); scrutiny/document verification lists; preference selection notices; grievance submission notices tied to an exam.
Hold: "Marks of the candidates ..." and "Revised marks ..." (marks of recommended candidates); absentee-candidate notices if judged minor (recommend pass: they are second chance schedule notices); tenders (/tender page not watched); Hindi duplicates; any ESM/retired-only, deputation, promotion, departmental-exam notice.
Never hold: normal jobs that reserve ESM seats.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Advt. No. 05/2026 (Group-D) Closing Date Extension 2026-07-03 | Update | Advt 05/2026 Group-D | Pass |
| Advt. No. 06/2026 (Group-C) 2026-06-22 | New Job | Advt 06/2026 Group-C | Pass |
| Advt. 05/2026 2026-06-18 | New Job | Advt 05/2026 | Pass |
| Advt. 01/2023 (Additional Posts) 2026-06-03 | New Job/Update | Advt 01/2023 additional posts | Pass |
| Corrigendum Advt. No. 05/2024 | Update | Advt 05/2024 | Pass |
| Corrigendum in Appendix-A (Advt.No.04/2026) | Update | Advt 04/2026 | Pass |
| Advt. 01/2026, 02/2026, 03/2026 & 04/2026 | New Job | Advts 01-04/2026 | Pass |
| Final Answer Key for Primary Teacher (Mewat Cadre) Advt 05/2024 Cat 1 | Answer Key | PRT Mewat, Advt 05/2024 | Pass |
| Final Answer Key For The Post Of Primary Teacher (PRT) | Answer Key | PRT | Pass |
| Notice for PST for various posts, Advt 13/2024, 01/2026, 06/2026 | Update (exam schedule) | Advts 13/2024, 01/2026, 06/2026 | Pass |
| Public notice to male/female absentee candidates for PST | Update | same advts | Pass (low priority) |
| Preference Selection for posts under Group-25, Advt 08/2024 | Update | Advt 08/2024 Group-25 | Pass |
| Grievances submission, PRT (Mewat Cadre) Advt 05/2024 | Update | PRT Mewat, Advt 05/2024 | Pass |
| Declaration of final result, PRT (Mewat Cadre) Advt 05/2024 | Result | PRT Mewat, Advt 05/2024 | Pass |
| Declaration of waiting list, PRT (Mewat Cadre) | Result | PRT Mewat, Advt 05/2024 | Pass |
| List of additional candidates for scrutiny of documents, PRT Mewat | Result/Update | PRT Mewat, Advt 05/2024 | Pass |
| Declaration of revised final result, TGT Science (ROH & Mewat), Advt 2/2023 | Result | TGT Science, Advt 02/2023 | Pass |
| Marks of the candidates, PRT Mewat Cadre | Noise | PRT Mewat | Hold |
| Revised Marks, TGT English/Home Science/PE/Sanskrit/SS, Advt 02/2023 | Noise | Advt 02/2023 TGTs | Hold |
| PMT notice, Forest Guard Advt 04/2026 Cat 12 | Update | Forest Guard, Advt 04/2026 | Pass |

## Proposed config (unchanged, current sources.json entries are correct)
```json
[
 {"id":"hssc-advt","url":"https://hssc.gov.in/advertisement","rowSelector":"table tbody tr","rowTitle":"self","titleReplace":["^(.+)$","HSSC Advt. $1"],"rowLink":"a[href*='/file/']","minTitle":4,"limit":20},
 {"id":"hssc-notices","url":"https://hssc.gov.in/publicNotice","rowSelector":"table tbody tr","rowTitle":"td:nth-child(1)","rowLink":"a[href*='/file/']","minTitle":10,"limit":20},
 {"id":"hssc-results","url":"https://hssc.gov.in/result","rowSelector":"table tbody tr","rowTitle":"td:nth-child(2)","rowLink":"a[href*='/file/']","minTitle":10,"limit":20}
]
```

## Uncertain points
- Notices and results rows show no date in the scanner title (advts do). Dates may exist in another cell; not needed for matching.
- Only 10 rows per page are served; if a burst of more than 10 notices happens between scans, some could be missed. Low risk.
- No admit card page was found; admit cards for HSSC are published on the candidate portal (not watchable), so none will be caught.

## BatLee's corrections
- none yet

## Repairs
- none
