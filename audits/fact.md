# FACT (Fertilisers and Chemicals Travancore Ltd)
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (nothing applied)

## BATCH SUMMARY BLOCK
SITE: FACT Recruitment Notifications | VERDICT: FIX
PROPOSED: 1) fact: include -> "(Recruitment Notification|Apprenticeship|ENGAGEMENT OF|Selection of).*(Dynamicpages|/images/upload/)" (adds the PDF rows of the Job Openings table); rebaseline automatic. 2) add source fact-results = https://fact.co.in/home/Dynamicpages?MenuId=97 (FREE, include "/images/upload/", exclude "AGM|Reform|Annual General|Utsav", limit 40, rebaseline). 3) timeoutMs 15000 on both.
MISSING TODAY: Recruitment Notification No.7/2026 dated 01.10.2026 (Engineer IT, open till 14/10/2026) sits in the Job Openings table as a PDF link and is NOT caught (include requires "Dynamicpages" in the link); all Results / merit lists / shortlists (MenuId=97) are unwatched.
ASK BATLEE: FACT posts are mostly fixed-tenure/contract/adhoc, and today's 7/2026 is for Ex-Apprentices of FACT's own training centre only. Recommend HOLD that restricted one (like ex-servicemen-only), PASS open notifications, apprenticeships and merit lists/shortlists.

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Job Openings (main) | https://fact.co.in/home/Dynamicpages?MenuId=90 | free fetchItems, 4 runs, 0.5-1.3 s, always 9 items | FREE-OK but incomplete |
| Results (merit lists, shortlists, validity extensions) | https://fact.co.in/home/Dynamicpages?MenuId=97 | free, 40 PDF rows | FREE-OK, not yet watched |
| Apprenticeship | https://fact.co.in/home/Dynamicpages?MenuId=909 (ITI / Graduate / Diploma notifications + forms as PDFs) | free | FREE-OK, reachable via menu link |
| OJT trainees | https://fact.co.in/home/Dynamicpages?MenuId=3055 | free | FREE-OK |
| Director (Marketing) | https://fact.co.in/home/Dynamicpages?MenuId=3053 | free | FREE-OK |

URL versions: https without www works (current config); https://www.fact.co.in gives the same page; plain http:// fails (connection error). Keep https non-www. No ScrapFly needed; PDFs are on the same free host.

## What the scanner catches vs misses
Current include matches only links containing "Dynamicpages", i.e. the left-menu entries under Careers (Recruitment Notification No.2/2024 ... 07/2022, Apprenticeship, OJT, Director Marketing). The menu is STALE: it stops at 2/2024. Real current recruitments (3/2025, 4/2025, 10/2025, 11/2025, 12/2025, 02-07/2026) never got a menu entry. They appear only as rows of the table on MenuId=90 (Adv. No / Description / Start Date / End Date) with the notice as an /images/upload/ PDF. Today's single live row: "Recruitment Notification No.7/2026 dated 01.10.2026 - Engineer(IT) on Fixed Tenure Contract Basis from Ex-Apprentices of FACT Training and Development Centre", 01/10/2026 to 14/10/2026, PDF /images/upload/Recruitment-Notification-7-2026---Engineer-(IT)_3057.pdf. Not caught today. The table empties between postings, so the PDF row is the new-job signal.
Tested proposal: the new include gives 11 items (10 menu + the 7/2026 PDF). Nested anchors in the row parse fine (title and PDF link correct). Related PDFs in the row (Application Form, OBC-NCL declaration, forms.gle link) are not matched, good. A broader include with "Advertisement|Notification" only added noise (Newspaper Advertisement, an investor page), so not proposed.

## Posting speed / flood
About 12 notifications a year (2025-26). The Job Openings table holds 1 row now; limit 40 is ample. Results page holds about 40 PDFs, not strictly date-sorted (2025 validity extensions at top, then 2026 items), so rely on the seen check, not order. First run rebaselines, so the 40 existing results do not flood. Results links use a double slash (fact.co.in//images/...), which the seen check normalises. PDF names carry a random suffix (_3057) but are stable per file. Every page also repeats the header items "Notice of 82nd AGM" and "Reform Utsav" (excluded in fact-results).

## Label pattern
Job Openings row: "Recruitment Notification No.<n>/<year> dated <dd.mm.yyyy> - <Post> on <Fixed Tenure Contract (Adhoc) / Temporary Contract> Basis [from Ex-Apprentices ...]". Parent = "FACT Notification <n>/<year>".
Results rows: "<Merit list | Merit Panel | Shortlist | Extension of validity of Merit List> to the post of <Post> ... Recruitment Notification No. <n>/<year> dtd <date>". Type = Result for merit list / shortlist, Update for extension of validity. Parent = the same "Notification <n>/<year>"; when no number is given use the post name (e.g. "Fireman test 25.03.2026").
Apprenticeship: "NOTIFICATION FOR ENGAGEMENT OF ITI / GRADUATE/TECHNICIAN APPRENTICES" 2026-27 = New Job (apprentices).

## Hold / pass rules for the sorter
HOLD: Notice of AGM, Reform Utsav, shareholder notices (header items on every page); "Newspaper Advertisement" (investor page); posts open to Ex-Apprentices of FACT TDC only; Application Form / OBC-NCL self-declaration / forms.gle links; "Extension of validity of Merit List" for old recruitments unless the parent was posted on Sarkari24; RTI, tenders, vendor meets; old menu entries 2022-2024 (baseline anyway).
PASS: Recruitment Notification PDFs open to all, Apprenticeship notifications (ITI, Graduate, Diploma), OJT trainee notification, Director (Marketing) selection, merit lists / merit panels / shortlists of current-cycle notifications.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment Notification No.7/2026 dated 01.10.2026 - Engineer(IT), Ex-Apprentices | New Job | FACT Notif 7/2026 | Hold (ex-apprentice-only), BatLee to confirm |
| Apprenticeship 2026-2027 Notification | New Job | FACT Apprentice 2026-27 | Pass |
| NOTIFICATION FOR ENGAGEMENT OF GRADUATE/TECHNICIAN (DIPLOMA) APPRENTICES | New Job | FACT Apprentice 2026-27 | Pass |
| NOTIFICATION FOR ENGAGEMENT OF ITI APPRENTICES | New Job | FACT Apprentice 2026-27 | Pass |
| NOTIFICATION FOR ENGAGEMENT OF ON-THE-JOB (OJT) TRAINEES | New Job | FACT OJT | Pass |
| Selection of Director (Marketing) | New Job | FACT Director Marketing | Pass |
| Recruitment Notification No.2/2024 | New Job (old) | Notif 2/2024 | Hold (old) |
| Merit Panel - Data Processing Assistant, No. 5/2026 dated 20.06.2026 | Result | Notif 5/2026 | Pass |
| Merit list - Resident Construction Manager, No. 04/2026 | Result | Notif 4/2026 | Pass |
| Merit list - Engineer(Chemical), No. 03/2026 | Result | Notif 3/2026 | Pass |
| Merit list - Technician (Process), No. 02/2026 | Result | Notif 2/2026 | Pass |
| Shortlist - Engineer (Instrumentation), 03/2025 | Result | Notif 3/2025 | Pass |
| Merit List of Fireman - Test Dated 25.03.2026 | Result | Fireman 2026 | Pass |
| Shortlist - Nurse(Male), No. 10/2025 | Result | Notif 10/2025 | Pass |
| Extension of validity of Merit List - Medical Officer | Update | Medical Officer 14/2024 | Hold |
| Notice of 82nd Annual General Meeting | Noise | - | Hold |
| Reform Utsav | Noise | - | Hold |
| Application Form prescribed / OBC-NCL Self Declaration Format | Noise | Notif 7/2026 | Hold |

## Proposed config (JSON)
Changed fields of the existing source, plus one new source:
```json
[
  {"id":"fact","include":"(Recruitment Notification|Apprenticeship|ENGAGEMENT OF|Selection of).*(Dynamicpages|/images/upload/)","exclude":"compassionate|qualified|roll no|unique id","minTitle":12,"limit":40,"timeoutMs":15000},
  {"id":"fact-results","name":"FACT Results / Merit Lists","runner":"india","tier":"FREE","level":"central","type":"html","url":"https://fact.co.in/home/Dynamicpages?MenuId=97","include":"/images/upload/","exclude":"AGM|Reform|Annual General|Utsav","minTitle":12,"limit":40,"timeoutMs":15000}
]
```

## Uncertain
- Results page order is not date-sorted; safe only because the rebaseline absorbs the existing 40.
- Whether ex-apprentice-only posts (7/2026) should reach Sarkari24: the standing rules cover ex-servicemen/retired-only, not this case.
- Was not able to test a second live row layout (only 1 row exists today); assumed future rows follow the same table format.

## BatLee's corrections
- none yet

## Repairs
- none
