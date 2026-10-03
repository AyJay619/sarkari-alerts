# BEML (BEML Limited)
Audited: 2026-10-03 | Group: FREE | Status: PROPOSED (audit written; sources.json NOT changed yet, waiting for BatLee's approval)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Careers page, tab "Current Recruitments" (newest adverts, e.g. KP/S/15/2026, KP/S/16/2026) | https://www.bemlindia.in/careers/ | free fetch (Node), ~660 KB, HTTP 200 | FREE-OK |
| Careers page, tab "In-Progress Recruitments" (every advert with its corrigenda, admit cards, shortlists, results) | https://www.bemlindia.in/careers/in-progress-recruitments/ (the same 58 rows are also inside /careers/) | free fetch, ~880 KB, HTTP 200 | FREE-OK |
| Closed Recruitments tab | https://www.bemlindia.in/careers/closed-recruitments/ | free fetch OK | Not watched (old adverts) |
| Guess /careers/current-recruitments/ | - | 404 | FAILED (does not exist; the Current tab lives only inside /careers/) |

URL variants: https://www.bemlindia.in works. https://bemlindia.in (no www) 301-redirects to www (fine). http://bemlindia.in did not connect from this PC. Use https + www.

## ScrapFly
Not needed. Group FREE. Credits per scan: 0 | Monthly estimate: 0
PDFs download free: yes (tested KP_S_14_2026_Final.pdf: 200, application/pdf, 399 KB).
(SCRAPFLY_KEY was not available in the audit shell and was not needed.)

## Why all 58 links showed as "new" on 2026-10-03
- The 58 row titles are identical to what is stored in state/seen-india.json (58 of 58 match). Only the LINK part of the seen key differs. No real new notices.
- Seen key is "title|link". Stored links (recorded 29 Sep) look like https://bemlindia.in/wp-content/plugins/career/WCP/DATA//Writereaddata/Career/KP_S_01_2025%20%20final%20V2%20(1)%20(2).pdf (no www, a double slash before Writereaddata, raw brackets and raw &).
- Today's page serves the same files as https://www.bemlindia.in/wp-content/plugins/career/WCP/DATA/Writereaddata/Career/KP_S_01_2025%20%20final%20V2%20%281%29%20%282%29.pdf (www, single slash, %28 %29 for brackets, %26 for &).
- Cause: BEML changed how the page writes its PDF links (site change between 1 Oct and 3 Oct). Same files, new spelling. Not a block, not a redesign.
- Today's page is stable: 3 fetches in a row gave the identical link list, so it is not flipping on every request.
- Fix for the false alarm: re-baseline this source once (mark current links as seen without alerting). See proposal below.

## Bigger problems found while checking
1. The current source only takes the FIRST PDF of each row (rowLink .first()). A row holds the advert plus later items (addendum, date extension, cancellation, admit card, shortlist, selected list). Those later items are invisible to the scanner. Example: KP/S/14/2026 has 6 items, only the advert is tracked.
2. The in-progress page does NOT contain the newest adverts. KP/S/15/2026 (closing 7-Oct-2026) and KP/S/16/2026 (closing 5-Oct-2026, plus its date extension) appear only on the "Current Recruitments" tab of /careers/. A new BEML job would first show up there, so the current source would miss new jobs.

## Proposed config (NOT applied)
Replace the single source with one source on https://www.bemlindia.in/careers/ , tier FREE, type html:
- selector: "#v-pills-Recruitments a[href], #v-pills-In-Progress a[href]"
- include: "[.]pdf|admit card|hall.?ticket"  (keeps PDFs and the admit-card portal links; drops Apply online, grievance and status links)
- contextClosest "div.pdf_urls_add_carrears", contextFind "h2"  (prefixes each link with its advert number)
- exclude: keep "compassionate|qualified|roll no|unique id"; minTitle 8; limit 400
- "rebaseline": true so the first run stores the ~235 current links silently
Tested with the scanner's own fetch code (no config change): 235 items, titles like "KP/S/16/2026: Extension of last date for submission ... Chief General Manager - HR".

## Label pattern
Title written by the scanner: "<Advert number>: <link text>". The row heading (h2) is the advert number and is the PARENT. Formats vary by year: "KP/S/14/2026", "ADVT NO - KP/S/01/2025", "ADVT NO - 06/2026", "Advt. No: L&D/01/2026", "PESB Advt. No. - 73/2024". Parent should be normalised to "KP/S/NN/YYYY" (or the L&D / director advert number).
Link text decides TYPE:
- "RECRUITMENT OF ...", "Advertisement", "Walk-in interview ..." = New Job
- "Addendum", "Corrigendum", "Extension of last date", "Rescheduling", "Notification of Change", "Cancellation" = Update
- "Link for downloading Admit card", "Download Hall-ticket" = Admit Card; "Date of Computer Based Written-Test" = Update
- "List of provisionally selected candidate(s)", "Results for ..." = Result
- "List of provisionally shortlisted candidates for assessment/interview/CBT" = Result/Update (shortlist; see uncertain)
Advert PDFs are named after the advert (KP_S_14_2026_Final.pdf); filenames are not reliable for other types ("Webhosting-...").

## Hold rules (site-specific)
Standing rules apply. Site-specific:
- "Advertisement in Hindi" / Hindi PDF when the English advert of the same row exists (Hindi duplicate)
- "Application Form", "Bilingual Application Form" PDFs
- Walk-in for Ex-Servicemen only (e.g. KP/S/20/2024), consultant engagements (KP/S/19/2024 Lean Manufacturing, KP/S/21/2024 Mining)
- Old closed adverts (2024, 2025) are only re-listed, not new; only genuinely new link keys matter after re-baseline
- Grievance portal and "Check Recruitment Status" links (already dropped by the include filter)
- Script keyword filter: none beyond the existing exclude; nothing else is unambiguous enough.
Do NOT hold: SC/ST/OBC special recruitment drives, tenure-basis non-executive recruitment (normal jobs); the Apprentice advert L&D/01/2026 is a normal job.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| RECRUITMENT OF EXECUTIVES (KPS152026_25_09_2026.pdf) | New Job | KP/S/15/2026 | Pass |
| Recruitment of Chief General Manager - HR | New Job | KP/S/16/2026 | Pass |
| Extension of last date ... Chief General Manager - HR | Update | KP/S/16/2026 | Pass |
| RECRUITMENT OF NON-EXECUTIVES ON TENURE BASIS | New Job | KP/S/14/2026 | Pass |
| Addendum - Extension of submission date upto 14.09.2026 | Update | KP/S/14/2026 | Pass |
| Link for downloading Admit card (beml.registrationform.in) | Admit Card | KP/S/14/2026 | Pass |
| Date of Computer Based Written-Test on 28.09.2026 | Update | KP/S/14/2026 | Pass |
| RECRUITMENT OF EXECUTIVE FOR INDUSTRIAL SAFETY | New Job | KP/S/13/2026 | Pass |
| Addendum | Update | KP/S/13/2026 | Pass |
| ENGAGEMENT OF APPRENTICES for FY 2026-27 | New Job | L&D/01/2026 | Pass |
| Cancellation of position code no.108 & 120 | Update | KP/S/12/2026 | Pass |
| Results for recruitment of CGM (Gr IX) Head Engine R&D | Result | KP/S/12/2026 | Pass |
| List of provisionally selected candidate for the post of GM (Gr VIII) Finance | Result | KP/S/11/2026 | Pass |
| List of provisionally shortlisted candidate ... High-Speed Rail R&D | Update (shortlist) | KP/S/06/2026 | Pass as Update (confirmed by BatLee 2026-10-03) |
| Cancellation of Recruitment Notification | Update | KP/S/04/2026 | Pass |
| Advertisement in Hindi | Duplicate | KP/S/01/2025 | Hold |
| Bilingual Application Form | Noise | KP/S/21/2024 | Hold |
| Walk-in: Engagement of Ex-Servicemen for HMV vehicles | Job (ESM only) | KP/S/20/2024 | Hold |
| Engagement of Consultant for Mining | Job (consultant) | KP/S/21/2024 | Hold |

## BatLee's corrections
- (none yet)

## Repairs
- 2026-10-03: found cause of 58/58 false "new" (BEML changed link spelling: www, // collapsed, brackets and & percent-encoded). Fix proposed, awaiting approval.
