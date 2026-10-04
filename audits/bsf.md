# BSF Recruitment
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (works as it is; one optional proposal)

## BATCH SUMMARY BLOCK
SITE: BSF Recruitment (rectt.bsf.gov.in) | VERDICT: OK
PROPOSED: none (optional: add `static/bsf/pdf` to "include" only if BatLee wants the older fixed-link block; not recommended, those links are 2025 leftovers)
MISSING TODAY: nothing found today ("Current Recruitment Openings" says "No Job(s) Available"); risk: when a job opens, its row will be an apply link inside that block, not a cloudfront/bsf/custom PDF, so the scanner may not see it
ASK BATLEE: none (recommend: when BSF shows a job, check that the scanner caught it; if not, send me the page HTML at that time and I add a row selector)

## Pages watched
| Page | URL | Fetch method | Verdict |
| Recruitment portal home (notice block + current openings) | https://rectt.bsf.gov.in/ | free fetchItems, 15 s | FREE-OK (7 items, 75-380 ms, 3 runs identical) |
Same page with http:// redirects to https (fine). Main site https://www.bsf.gov.in/ returns 403 to a free fetch and is NOT used (the recruitment portal carries all recruitment notices). Candidate-portal sub-pages (/registration, /payment, /home/help-desk) are logins, not notices. Guessed paths /recruitment, /home/notices: 404 (not used).

## ScrapFly
Not needed. PDFs on d3t79nicn48uzj.cloudfront.net download free (tested one, HTTP 200).

## Structure and posting speed
The home page has: (a) admin-managed notice buttons whose PDFs are on cloudfront.net/bsf/custom/<unix timestamp>.pdf, newest first (7 live today, dated by the filename: 1789982259 = 21/09/2026, 1788273108 = 01/09/2026, so roughly a few notices a month); (b) older fixed-link buttons /static/bsf/pdf/... (2025 results, corrigenda, adverts; several are commented out in the HTML) ; (c) "Current Recruitment Openings" list, empty today.
The scanner's include "cloudfront[.]net/bsf/custom" catches exactly block (a), which is the only part that changes now. Seen state has all 7 baselined. Link stability: links are static timestamp files, no session parts, no flood risk. Page has no visible posting dates; use the filename timestamp.

## Label pattern
Titles are free-text in CAPITALS, no "<Type>: <Parent>" form. Type by words: "FINAL RESULT", "RESULT", "NOMINAL ROLL NO ... SHORTLISTED" = Result; "ADVERTISMENT ... RECRUITMENT" = New Job; "CORRIGENDUM", "RESCHEDULING", "NOTICE REGARDING ... EXAM", "INTERRUPTION" = Update; "OBJECTION MANAGEMENT PORTAL" = Answer Key (objection window for the answer key); "E-ADMIT CARD" = Admit Card.
Parent: the post and year in the title, e.g. "HC (RO/RM) BSF Communication Set-up 2025", "ASI (Steno)/HC (Min) CAPFs and Assam Rifles Exam 2024", "CT (GD) Sports Quota 2025". Many titles are generic ("NOTICE REGARDING OPENING OF OBJECTION MANAGEMENT PORTAL") with no parent: open the PDF to find it.

## Hold / pass rules (sorter)
Pass: advertisements/rallies for open posts, results and shortlists, admit cards, objection-portal (answer key) notices, rescheduling, corrigenda, extensions.
Hold: deputation / absorption / re-employment adverts (e.g. Air Wing Group B and C on deputation), walk-in for specialist doctors/GDMO and other contract roles, "fake circulation" warnings and technical-issue notices with no schedule change (power failure at one centre: hold unless it carries a re-exam date), demo videos, OTP notes, helpdesk numbers, LDCE-only (departmental) items. Note: items mixing "direct/departmental" (HC RO/RM 2025) are normal jobs: pass.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
| Notice for objection management portal of CBT exam for ASI (Steno)/HC (Min) exam 2024 through direct entry and LDCE (1789982259) | Answer Key | ASI (Steno)/HC (Min) 2024 | Pass |
| Notice regarding opening of objection management portal (1789465815) | Answer Key | unclear, open PDF | Pass |
| Notice regarding fake circulation of CBT date for HC (RO)/(RM) BSF Comn Set-up 2025 (1789467350) | Update (warning) | HC (RO/RM) 2025 | Hold |
| Final result, meritorious sports person CT(GD) sports quota 2025 (3rd phase) (1788961968) | Result | CT (GD) Sports Quota 2025 | Pass |
| Notice regarding opening of objection management portal (1788950396) | Answer Key | unclear | Pass |
| Interruption of CBT due to power failure, M D Infotech centre, Kanpur (1788336740) | Update | CAPFs ASI/HC exam 2024 | Hold unless re-exam date |
| Rescheduling of written exam (CBT) for ASI (Steno) and HC (Min) CAPFs and Assam Rifles exam 2024 (1788273108) | Update | ASI (Steno)/HC (Min) 2024 | Pass |

## Proposed config (unchanged)
```json
{"id":"bsf","name":"BSF Recruitment","runner":"india","tier":"FREE","level":"central","type":"html","url":"https://rectt.bsf.gov.in/","allowedHosts":["d3t79nicn48uzj.cloudfront.net"],"include":"cloudfront[.]net/bsf/custom","minTitle":15,"limit":30}
```

## Uncertain
- Markup of a job row inside "Current Recruitment Openings" is unknown (empty today). A job posted there may be missed until a row selector is added. Advert PDFs are usually also put in the notice block (as the 2025 HC RO/RM advert was), so it will likely still be caught there.
- Dates are not on the page; the cloudfront filename is a unix timestamp.

## BatLee's corrections
- none yet

## Repairs
- none
