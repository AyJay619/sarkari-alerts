# IBPS (ibps.in)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (proposal pending)

## BATCH SUMMARY BLOCK
SITE: IBPS | VERDICT: FIX
PROPOSED: 1) add FREE source "ibps-crp" = https://www.ibps.in/index.php/crp-updates/ (same extraCerts, include "^[0-9][0-9] (Jan|Feb|...|Dec) [0-9][0-9] ", minTitle 15, limit 40, rebaseline); this is the full dated CRP updates list (22 rows), the homepage shows only its newest 4. Keep the existing "ibps" homepage source unchanged (it also carries the ibpsreg.ibps.in registration links).
MISSING TODAY: homepage shows only 4 CRP updates, so the scanner never saw "Scores of Online Preliminary Exam CRP-PO/MT-XVI" (29 Sep) or "Online Pre-Examination Training ... CRP-CSA-XVI" (28 Sep); a burst of more than 4 posts in one run gap would also be lost. No results/answer-key page of its own exists (all inside CRP pages).
ASK BATLEE: none (note: about 1 in 5 single fetches fails with an SSL "unexpected message" error on every URL version, www or not, https or http; it is the server being flaky, not a config fault; the scanner's end-of-group retry covers it)

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
| Homepage (4 latest CRP updates + Recruitment block) | https://www.ibps.in/ | free fetchItems with extraCerts globalsign-rsa-ov-ssl-ca-2018.pem | FREE-OK, 7 items, ~0.4 s, flaky ~20% |
| CRP updates (all dated CRP notices) | https://www.ibps.in/index.php/crp-updates/ | free, same cert | FREE-OK (22 dated rows) - PROPOSED NEW |
| Recruitment (outside bank registrations: BMC, IEB, MECL) | https://www.ibps.in/index.php/recruitment/ | free | FREE-OK, 3 rows, already covered by homepage |
| Cycle pages (CRP-CSA-XVI, CRP-PO/MT-XVI, CRP-SPL-XVI, CRP-RRBs-XIV) | https://www.ibps.in/index.php/clerical-cadre-xvi/ etc. | free | work, optional (see below) |
URL versions: https www, https no-www, http no-www all return the real page; http www fails. Each fails the same ~2 times in 8 (error ERR_SSL_UNEXPECTED_MESSAGE, 0.2 s), 8 repeats per version. classicTls / legacyTls give no improvement. Without extraCerts the cert chain does not verify (the existing certs/ file is needed). No redirects to homepage.
No JS or API needed: plain HTML. No ScrapFly needed. PDFs are under https://www.ibps.in/wp-content/uploads/ (not test-downloaded).

## Structure, posting speed, link stability
- crp-updates page: newest first, rows are `<a href><div class=detail-first-heading>dd Mon yy</div><div class=detail-second-heading>Title</div></a>`. About 6 rows in the last 5 days (1 Oct, 30 Sep, 29 Sep x3, 28 Sep), so a limit of 25 on the homepage was never the issue but the homepage cap of 4 is. Limit 40 on the crp-updates page covers all 22 rows with room.
- With a plain "a" selector the scanner title = "01 Oct 26 Online Preliminary ..." (date prefix, which is useful). The seen key is title + link, so a cycle page that is reused (e.g. clerical-cadre-xvi) with a new title is still caught as new.
- Rows that are links to cycle pages (not PDFs) point to the living page of that cycle (call letters, handouts, lists live there); the actual call-letter / score links go to ibpsreg.ibps.in login URLs with an appid token (do not alert on those directly, use the row's page).
- Flood check: first run after adding rebaselines silently. Old rows (back to Nov 2024) will not appear again. The 28 Sep training link carries an appid in the URL, stable.
- Optional extra (not proposed): cycle pages list handouts, scribe forms and rank lists with dates (e.g. rural-bank-xiv: three "List of Candidates Provisionally Allotted" rows). They duplicate crp-updates titles only partly (crp-updates has one row per event, cycle pages one row per file). Add them only if BatLee wants every file; they must be renamed each cycle (XVI, XVII ...).

## Label pattern
Rows on crp-updates: "<dd Mon yy> <Type text> [in connection with | for | under] <CRP code>". The CRP code is the clean PARENT: CRP-CSA-XVI (Clerks 2026), CRP-PO/MT-XVI, CRP-SPL-XVI (Specialist Officers), CRP-RRBs-XIV (Regional Rural Banks, PO/Clerk). Type from keywords: "Notification for Common Recruitment Process" / "Window Notification" = New Job; "Call Letter" = Admit Card; "Scores", "Provisional Allotment", "List of Candidates" = Result; "Corrigendum", "Updated Vacancies" = Update; "Pre-Examination Training" = Update. Registration rows on the homepage (ibpsreg.ibps.in) are "<Organisation> <post> Registration From <date>" (bank/PSU recruitments conducted by IBPS): PARENT = the organisation (BMC, IEB, MECL).

## Hold / pass rules (sorter)
HOLD: "BMC Promotion for the post of Head Clerk" (promotion); "Notification on Fraudulent Websites Resembling IBPS", "Caution Notice", "Trade Mark Caution Notice", ISO certification, Revised Advisory / SOP for cases, "Normated Standards for Flagged Cases" (debarment/normalisation), Information Handouts (English/Hindi duplicate), Scribe guidelines / Scribe declaration form, Mock test links, "Tentative Calendar" (schedule, general info), PwBD "Important Notice" generic, Hindi duplicates, anything pre-2026 cycle (CRP-XIV Clerks, CSA-XV, PO/MT-XIV, SPL-XIV) if ever surfaced.
PASS: new CRP notifications (CSA / PO-MT / SPL / RRBs), Window Notification, Call Letters, Scores, Provisional Allotment and reserve lists, Corrigenda, Updated Vacancies, Online Pre-Exam Training, registration rows of organisation recruitments (IEB SRD, MECL non-executive) as New Job.
No script keyword filters (standing rule).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
| Online Preliminary Exam Call Letter for CRP-CSA-XVI (01 Oct 26) | Admit Card | CRP-CSA-XVI | Pass |
| Provisional Allotment under Reserve List for CRP-RRBs-XIV Office Assistants (30 Sep 26) | Result | CRP-RRBs-XIV | Pass |
| Corrigendum dated 29.09.2026 in connection with CRP-CSA-XVI | Update | CRP-CSA-XVI | Pass |
| Updated Vacancies as on 29.09.2026 for CRP-CSA-XVI | Update | CRP-CSA-XVI | Pass |
| Scores of Online Preliminary Examination for CRP-PO/MT-XVI (29 Sep 26) | Result | CRP-PO/MT-XVI | Pass |
| Online Pre-Examination Training for SC/ST/OBC/Minority/ESM/PwBD, CRP-CSA-XVI (28 Sep 26) | Update | CRP-CSA-XVI | Pass |
| Notification for Common Recruitment Process for CRP-PO/MTs-XVI (01 Jul 26) | New Job | CRP-PO/MT-XVI | Pass |
| Notification for Common Recruitment Process for CRP-SPL-XVI (01 Jul 26) | New Job | CRP-SPL-XVI | Pass |
| Window Notification for CRP-PO/MTs-XVI and SPL-XVI (30 Jun 26) | New Job | CRP-PO/MT-XVI, CRP-SPL-XVI | Pass |
| Notification on Fraudulent Websites Resembling IBPS (27 Apr 26) | Noise | none | Hold |
| Notification regarding ISO 9001:2015 Certification (27 Jan 26) | Noise | none | Hold |
| Tentative Calendar of CRP Online Examinations (16 Jan 26) | Noise | none | Hold |
| Notice dated 15.01.2026 in connection with CRP-PO/MT-XIV | Update | CRP-PO/MT-XIV (old cycle) | Hold |
| Normated Standards for Flagged Cases of Non-Genuine scores (17 Nov 25) | Noise | none | Hold |
| Caution Notice regarding misuse of IBPS proprietary rights (28 Oct 25) | Noise | none | Hold |
| BMC Promotion for the post of Head Clerk, Registration From 15-Sep-2026 | Noise | BMC | Hold (promotion) |
| IEB Special Recruitment Drive (SRD), Registration From 15-Sep-2026 | New Job | IEB | Pass |
| MECL Recruitment of Non-Executive Posts, Registration From 12-Sep-2026 | New Job | MECL | Pass |

## Proposed config (new source; existing "ibps" source unchanged)
```json
{
  "id": "ibps-crp",
  "name": "IBPS CRP Updates",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.ibps.in/index.php/crp-updates/",
  "extraCerts": ["certs/globalsign-rsa-ov-ssl-ca-2018.pem"],
  "include": "^[0-9][0-9] (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) [0-9][0-9] ",
  "minTitle": 15,
  "limit": 40
}
```
Tested with the scanner's fetchItems on the no-www URL (identical page): 22 rows, correct titles and links. A new source rebaselines by itself on the first run.

## Uncertain
- The ~20% random SSL failure rate: only a single attempt per run fails; the scanner retries at the end of the group. If both attempts fail often in the real log, tell me and I will re-test.
- The crp-updates page was tested via the no-www URL; the www URL is the same server and the same page (links on it use www), but the www variant fails equally often on the first handshake.
- The include regex relies on the date prefix of the link text; if IBPS changes that format the source returns 0 items and the scanner will flag it.

## BatLee's corrections
- none yet

## Repairs
- none yet
