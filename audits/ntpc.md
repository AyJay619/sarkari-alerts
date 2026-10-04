# NTPC Careers (batch audit)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (works as it is)

## BATCH SUMMARY BLOCK
```
SITE: NTPC Careers | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (PDF links are not captured by design: tokens change every visit, so every notice points to the recruitment page)
ASK BATLEE: none
```

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitment (everything: adverts, admit cards, results, shortlists, schedules) | https://careers.ntpc.co.in/recruitment/ | free, scanner fetchItems, https, 0.8-1.2 s | FREE-OK |
| careers.ntpc.co.in/ (root) | redirects to http://.../recruitment/ | n/a | same page |
| ntpc.co.in/careers | 404 (main site has no useful notice page found) | n/a | not used |

fetchItems run 4 times (3 s apart): 484 items every time, identical titles in a raw-HTML comparison. No flakiness.

## ScrapFly
Not needed. Credits per scan: 0.

## What the scanner catches
484 rows (485 rows on page, 1 under minTitle 15), newest first, sorted by "Posting date" (round 2026-10-01 down to 2022). Rate: about 10 posts/month, so limit 700 is plenty; 484 items vs limit 700 gives headroom for roughly 20 months. Every item links to the page itself (pageLink true), correct because the PDF links are pdf_viewer.php?token=... and the token differs on every visit (would cause a flood). Seen state already holds the items (state/seen-india.json "ntpc"), titles stable, no flood risk.
Not captured: the actual PDF/attachment names (Short Ad, Result, Interview Schedule). The title text itself is descriptive enough. The attachment links (pdf_viewer) return an iframe wrapper page; whether the PDF inside downloads free was not tested further.

## Label pattern
Free-text sentence in h5, no "Type:" prefix. Type is read from the wording:
- "Recruitment of ... Advt.NN/YY", "Special Recruitment Drive ..." with "Online application portal will remain open from A to B" = New Job
- "Link ... Admit Card", "CBT ... scheduled ... link to download admit card" = Admit Card
- "Result ...", "Individual Scorecard and Cut-off ...", "Shortlisting for online document verification ...", "Result of Interviews ..." = Result
- "Interview Schedule", "Indicative Syllabus", "Corrigendum" = Update
Parent comes from the advert number in the title: "Advt. 09/26", "Ad. 08/26", "Advt.13/26", "Advt. 06A/26", "Advt. 06B/26", "Advt. 14/24", "NTPC WR-II HQ 01/2023", "Kudgi/01/2026". Spelling varies (Advt. / Advt / Ad. / Ad-), so normalise to "Advt NN/YY" (keep the A/B suffix: 06A and 06B are different adverts). Post name usually follows "for the post of ...".

## Hold / pass rules (for the sorter)
Hold:
- "Associate positions for retired executives from PSUs/Govt organisations" (retired-only)
- Medical/consultant style fixed-term empanelment unless a normal job
- Deputation / internal-only notices, if any appear
Pass: open jobs (Advt. numbers), Special Recruitment Drives (SC/ST backlog, land oustees), admit cards, results, shortlists/cut-offs, score cards, document verification lists, interview schedules for the current cycle, corrigenda/extensions.
Note: "Result for experienced professionals on fixed term basis" is a normal job result, pass.

## Sample links (audit day)
| Title (shortened) | Type | Parent | Pass/Hold |
|---|---|---|---|
| Interviews for Assistant Chemist Trainee ... scheduled from 07.10.2026 | Update (interview) | Advt 09/26 ACT | pass |
| Special Recruitment Drive for SC/ST Candidates, Advt.13/26 (apply 29-09 to 13-10-2026) | New Job | Advt 13/26 | pass |
| CBT for shortlisted candidates, NTPC WR-II HQ 01/2023, on 25.10.2026 | Update (exam date) | Advt WR-II HQ 01/2023 | pass |
| Result for the post of GDMO against Advt. 04/26 | Result | Advt 04/26 GDMO | pass |
| Result for experienced professionals on fixed term basis - Ad. 08/26 | Result | Advt 08/26 | pass |
| Recruitment of Assistant Officer (Corporate Communication), Advt.12/26 | New Job | Advt 12/26 | pass |
| Special Recruitment Drive ST backlog Diploma Engineer (C and I) NTPC Kudgi | New Job | Kudgi ST backlog | pass |
| Admit cards, Land Oustees Kudgi Artisan Trainees (Kudgi/01/2026) | Admit Card | Kudgi/01/2026 | pass |
| Individual Scorecard and Cut-off, CBT Assistant Executive (Operation) 05/26 | Result | Advt 05/26 | pass |
| Result for Assistant Executive (Operation) fixed term - Ad. 05/26 | Result | Advt 05/26 | pass |
| Result for Assistant Officer (Environment Management) - Ad. 06A/26 | Result | Advt 06A/26 | pass |
| CBT Assistant Chemist Trainee Advt. 09/26 planned 13.09.2026, admit card live | Admit Card | Advt 09/26 | pass |
| Result of Interviews, Engineer (Contracts and Materials) 06B/26 | Result | Advt 06B/26 | pass |
| Recruitment of Engineering Executive Trainees-2027 through GATE-2027, Ad-11/26 | New Job | Advt 11/26 | pass |
| Recruitment of Deputy Managers (Electrical, Mechanical, CnI), Advt.10/26 | New Job | Advt 10/26 | pass |
| Shortlisting for document verification EET-2025 (Advt. 14/24) fourth list | Result | Advt 14/24 | pass |
| Associate positions for retired executives, coal coordination liaisoning | New Job | n/a | hold (retired-only) |

## Proposed config
No change. Current source (kept as is):
```json
{"id":"ntpc","type":"html","url":"https://careers.ntpc.co.in/recruitment/","rowSelector":"ul.post-job-bx > li","rowTitle":"h5","pageLink":true,"minTitle":15,"limit":700}
```

## Uncertain
- Whether the PDFs behind pdf_viewer.php download free was not verified (wrapper page loads; PDF is inside an iframe). Not needed by the scanner.
- 99 old rows have no posting date, harmless.

## BatLee's corrections
- none yet

## Repairs
- none
