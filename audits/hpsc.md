# HPSC (Haryana Public Service Commission, hpsc.gov.in) - state level
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (batch audit; sources.json NOT changed)

## BATCH SUMMARY BLOCK
SITE: HPSC (hpsc, hpsc-advt) | VERDICT: OK
PROPOSED: 1. Optional: add FREE source hpsc-answerkeys = http://hpsc.gov.in/en-us/Examination/Answer-Keys (include Portals/0/, rebaseline; answer-key links are not on the homepage ticker). 2. Optional: hpsc-admit = .../Examination/Admit-card (homepage ticker already carries admit cards, so low value).
MISSING TODAY: answer keys only (not on homepage ticker); everything else (results, announcements, interview/admit notices, advts) is caught.
ASK BATLEE: Add the answer-keys page as a source? Recommend yes (cheap, free, ~0.4 s).

## Pages watched and tested
| Page | URL | Method | Verdict |
|---|---|---|---|
| hpsc (homepage ticker) | https://hpsc.gov.in/en-us/ | free fetchItems | FREE-OK: 3/3 runs, 40 items, 0.3-0.6 s |
| hpsc-advt | https://hpsc.gov.in/en-us/Instructions | free fetchItems | FREE-OK: 3/3 runs, 40 items, 0.45 s |
| extra: Answer-Keys | http://hpsc.gov.in/en-us/Examination/Answer-Keys | free | OK, 40 items (not watched) |
| extra: Results / Admit-card | .../Examination/Results, .../Admit-card | free | OK, 40 items each (duplicates of homepage) |

http, https and www all work (same 54 KB page). ScrapFly: not needed, 0 credits. PDFs are plain /Portals/0/ links (scanner uses noFileDownload).

## Scanner coverage and speed
- Homepage ticker holds about 46 PDF links covering roughly 3 weeks (09.09 to 30.09.2026), about 3-6 new items per day; limit 40 is enough for a scan every few hours.
- Homepage mixes results, marks, announcements, interview schedules, admit cards and some advts. The Instructions page is the full advertisement list (Advt 25/2026 dated 18.09 is newest) plus advt corrigenda/withdrawals.
- Links stable across 3 runs (same count, same order); no flood sign.

## Label pattern
Homepage: "<Type> dated DD.MM.YYYY [regarding ...] for the posts of <Post> in <Department>, Haryana (Advt. No. NN/YYYY)". Parent = post name + "Advt NN/YYYY" from the bracket (note odd forms: "Advt. No. 11(Viii)/2021", multiple advts joined by & or ","). Advt page: "Advt No. NN of YYYY - <Post> in <Dept>"; PDF filename Advt_NN_YYYY_... gives the number. Note HPSC advt "NN of 2026" numbering sometimes differs from the year of the 2024/2025 advt in result titles; match on number + post name, not number alone.

## Pass / hold rules
PASS: Advt (new job), corrigenda, withdrawn/cancelled advts, results (Result-I/II/IV, Final, Mains, SKT, screening), correction in result, admit card announcements, interview/PMT/document schedules for current cycle, answer keys, scheme/pattern/syllabus announcements (exam info for a live job), bifurcation/pay-scale announcements for a live advt.
HOLD: "Roll No. wise marks ..." and "Marks of interviewed candidate ..." (marks lists), provisional rejection of candidature notices if only individual-level (review), departmental/LDCE-type posts, deputation, consultants, tenders, RTI, Hindi duplicates, previous question papers, calculator/OMR guideline miscellany.

## Sample links (audit day)
| Title (short) | Type | Parent | Pass/Hold |
|---|---|---|---|
| Interview schedule 30.09 Asst District Attorney | Update | ADA Advt 18/2025 | Pass |
| Correction in Result-II 29.09, Lecturers (Civil/Comp/Elec/Mech/Pharm/Foreman) | Update | Advt 75,76,77,80,82,84/2024 | Pass |
| Roll no. wise marks SKT Asst Prof Commerce | Noise | Advt 44/2024 | Hold |
| Roll no. wise marks SKT PGT Computer Science | Noise | Advt 23/2026 | Hold |
| Result-II 28.09 Lecturer Fashion Design | Result | Advt 11(Viii)/2021 | Pass |
| Scheme/Pattern/Syllabus Safety Officer HPGCL | Update | Safety Officer HPGCL | Pass |
| PMT schedule 25.09 Deputy Supt of Police | Update | DSP | Pass |
| Final Result 24.09 Lecturer Textile Tech/Fashion | Result | Advt 83/2024 | Pass |
| SKT Result 24.09 Superintendent (Legal) | Result | Advt 01/2025 | Pass |
| SKT Result 22.09 Asst District Attorney | Result | Advt 18/2025 | Pass |
| Marks of interviewed candidate Roll 34870, AP Geography | Noise | Advt 51/.. | Hold |
| Interview schedule HCS (Ex. Br.) 18.09 | Update | Advt 22/2026 HCS | Pass |
| Mains result 17.09 HCS | Result | Advt 22/2026 | Pass |
| Final Result 16.09 AP Environmental Science | Result | AP EVS | Pass |
| Advt 25 of 2026 Food Safety Officer | New Job | Advt 25/2026 | Pass |
| Advt 24 of 2026 District Manager HSWC | New Job | Advt 24/2026 | Pass |
| Corrigendum Advt 18/2025 ADA | Update | Advt 18/2025 | Pass |
| Withdrawn Advt 21/2026 Veterinary Surgeon | Update | Advt 21/2026 | Pass |
| Advt 23 of 2026 PGT Computer Science | New Job | Advt 23/2026 | Pass |
| Advt 22 of 2026 HCS (Ex. Br.) | New Job | Advt 22/2026 | Pass |

## Proposed config (changes marked)
```json
[
 {"id":"hpsc","url":"https://hpsc.gov.in/en-us/","include":"Portals/0/","noFileDownload":true,"minTitle":15,"limit":40,"timeoutMs":15000},
 {"id":"hpsc-advt","url":"https://hpsc.gov.in/en-us/Instructions","include":"Portals/0/","noFileDownload":true,"minTitle":15,"limit":40,"timeoutMs":15000},
 {"id":"hpsc-answerkeys","name":"HPSC Answer Keys","runner":"india","tier":"FREE","level":"state","type":"html","url":"http://hpsc.gov.in/en-us/Examination/Answer-Keys","include":"Portals/0/","noFileDownload":true,"minTitle":15,"limit":40}
]
```
(Existing two sources need no change; timeoutMs is optional. Third entry is new, optional; rebaselines silently.)

## Uncertain
- Answer-key page titles start "Click here to view ..." (sorter should strip). Not tested whether new keys also appear on the homepage ticker (none seen in 46 links).
- Homepage ticker keeps only about 3 weeks, so a long outage (>2 weeks) could miss items.

## BatLee's corrections
- none yet

## Repairs
- none
