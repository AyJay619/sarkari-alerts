# CSBC (Bihar Police) - Central Selection Board of Constables
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (works as it is) | Level: state

## BATCH SUMMARY BLOCK
SITE: CSBC (Bihar Police) | VERDICT: OK
PROPOSED: none (optional: raise "limit" 40 -> 60 so a burst of 40+ notices in one scan gap cannot push items off; page lists 178 PDFs newest first, no rebaseline needed for a limit change)
MISSING TODAY: nothing found (home page carries every notice, result and advert as Advt/ PDFs; admit-card portal links on apply-csbc.com have no title/date and are not caught, but each admit card is also announced by an Advt/ "e-Admit Card" notice)
ASK BATLEE: none

## Pages watched
| Page | URL | Fetch method | Verdict |
| Home page (all notices, results, adverts, newest first) | https://csbc.bihar.gov.in/ | free fetchItems, 15 s | FREE-OK (40 items, 150-250 ms, repeated runs identical) |
URL variants: http://csbc.bihar.gov.in/ also works (same 40 items). www.csbc.bihar.gov.in does NOT exist (DNS ENOTFOUND). Keep https, no www. Other pages (Notices.htm, A-REP.htm = Reports/notice archive, Tenders.htm, Orders.htm) not needed: Notices.htm has no Advt/ links; the home page already has all 178 Advt/ links. Orders/ PDFs are old 2008-2013 government notifications (not jobs).
ScrapFly: not needed. PDFs download free (tested the Constable (Operator) advert, HTTP 200).

## What the scanner catches vs misses
Scanner: include "Advt/", minTitle 15, limit 40. Home page has 178 Advt/ links, newest first; the scanner takes the newest 40 (back to Sept 2025). Posting speed: roughly 2-6 PDFs a month, bursts of 3 on one day at most (e.g. 3 HMV DET notices in Sept). Limit 40 is far above that. Seen state has 41 entries, all baselined. Links are static PDF paths with dates in the filename (no timestamps/tokens), so no flood risk.
Not caught (harmless): apply-csbc.com admit card/application portal buttons (no text; only a title attribute with download start dates) and the home page "Apply" links for open recruitments. A new advert always arrives as an Advt/Advt-NN-YYYY-... PDF too, so jobs are caught.

## Label pattern
Titles: "<Type>: <Regarding ...>" with the prefix "Important Notice:" / "Results:" / "Advt. No. NN/YYYY:". Filenames carry the advert number and date:
- Advt-02-2026-Constable(Operator).pdf = Advt 02/2026 (New Job)
- Notice-01-2025-... = notice under Advt 01/2025 (Constable, Bihar Police); Notice-02-2025 = Advt 02/2025 (Driver Constable); Notice-01-2026 = Advt 01/2026 (Special Branch GD Close Cadre Constable); Notice-02-2026 = Advt 02/2026 (Constable Operator); Notice-03-2025 = Prohibition Constable/Jail Warder/Mobile Squad.
- Results-NN-YYYY-<stage>-DD-MM-YYYY.pdf = Result (stage Written-Exam-for-PET, PET, PST, Final).
- Last token is the notice date DD-MM-YYYY (note: some dates in filenames/titles like "HMV-DET-12-09-2025" are typos for 2026; trust the title).
Type words: "Advt. No." = New Job; "e-Admit Card" in title = Admit Card; "Results:" / "Final Selection List" = Result; "Change in Date", "Correction Letter", "New Date", "Cancellation" = Update; "Regarding PET/PST/DET/DV ..." = Update (schedule); "Reject List" = see hold.
Parent: the post plus advert number, e.g. "Advt 01/2025 Constable Bihar Police", "Advt 02/2025 Driver Constable", "Advt 01/2026 Special Branch Constable (GD Close Cadre)", "Advt 02/2026 Constable (Operator)". Titles do not always carry the advert number: infer from the post name or the filename code (01-2025, 02-2025, 01-2026, 02-2026). Old filenames without codes (Notice-25-02-09-2025, Notice-30-01-2025-01-2025) need the PDF opened.

## Hold / pass rules (sorter)
Pass: adverts, written-exam / PET / PST / DET / DV schedules and results, final selection lists, e-admit card notices, exam date changes, correction letters, document verification notices, provisionally-selected confirmation notices, new-date notices (HMV DET).
Hold: "Rebuttal of / Regarding Fake News" notices; "Cancellation of Candidature ... Impersonation and Unfair means" (debarment); "List of Invalid Applications with Reason of Rejection" (rejection lists); "Address of Newly Developed official Website"; "Applications from candidates placed below the merit list for waiting list/reconsideration" (applies only to already-selected-cycle candidates, hold unless BatLee wants it); tenders (Tenders.htm not watched); Hindi duplicates (none seen).
Never hold a normal constable job that reserves seats for ex-servicemen (all CSBC adverts do).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
| Confirmation of selection of candidates provisionally selected in final results of 27.05.2026 (25-09-2026) | Update (selection) | Advt 01/2025 Constable | Pass |
| Submission of original documents for DV and physical presence (22-09-2026, Notice-01-2026) | Update (DV) | Advt 01/2026 Special Branch | Pass |
| New date of HMV Driving Efficiency Test (12-09) | Update | Advt 02/2025 Driver Constable | Pass |
| PST and DV for Constable (GD Close Cadre) Special Branch (29-08-2026) | Update (schedule) | Advt 01/2026 | Pass |
| DET for Driver Constable (28-08-2026) | Update (schedule) | Advt 02/2025 | Pass |
| Results: Written exam shortlisting for PET, Constable (Operator) (18-08-2026) | Result | Advt 02/2026 | Pass |
| Results: Written exam shortlisting for PST, Special Branch Constable (18-08-2026) | Result | Advt 01/2026 | Pass |
| Cancellation of candidature, impersonation and unfair means (18-08-2026, x2) | Noise (debarment) | Advt 01/2026, 02/2026 | Hold |
| Results: Final Selection List, Constable Bihar Police (27-05-2026) | Result | Advt 01/2025 | Pass |
| Change in date of written exam and e-Admit Card, Constable (Operator) (26-05-2026) | Update / Admit Card | Advt 02/2026 | Pass |
| Written exam and e-Admit Card, Special Branch Constable (20-05-2026) | Admit Card | Advt 01/2026 | Pass |
| Address of newly developed official website of CSBC (12-05-2026) | Noise | n/a | Hold |
| List of Invalid Applications, Constable (Operator) (12-05-2026) | Noise (rejection list) | Advt 02/2026 | Hold |
| Results: PET successful candidates, qualified for DET, Driver Constable (28-04-2026) | Result | Advt 02/2025 | Pass |
| Fake news related to Driver Constable recruitment (09-04-2026) | Noise | Advt 02/2025 | Hold |
| Advt. No. 02/2026: Selection to Constable (Operator) in Bihar Police | New Job | Advt 02/2026 | Pass |
| Advt. No. 01/2026: Selection of Constables (GD Close Cadre) Special Branch | New Job | Advt 01/2026 | Pass |
| Written exam e-Admit-Card, Driver Constable (02-12-2025) | Admit Card | Advt 02/2025 | Pass |

## Proposed config (unchanged; optional limit 60)
```json
{
  "id": "csbc",
  "name": "CSBC (Bihar Police)",
  "runner": "india",
  "tier": "FREE",
  "level": "state",
  "type": "html",
  "url": "https://csbc.bihar.gov.in/",
  "include": "Advt/",
  "minTitle": 15,
  "limit": 40,
  "timeoutMs": 15000
}
```
The only optional edit is adding timeoutMs 15000 (site answers in 0.2 s; the default is likely fine). Changing limit/timeout does not trigger a rebaseline as the URL and selectors are unchanged.

## Uncertain points
- The "waiting list / reconsideration for candidates below the merit list" notice is held by default; it concerns an already-closed cycle.
- Some PDF dates in filenames look like year typos (2025 vs 2026); the sorter should trust the title and PDF content.
- The home page "apply" buttons (apply-csbc.com) for new recruitments are not parsed; relies on the Advt PDF appearing at the same time (true for Advt 01/2026 and 02/2026 as listed).

## BatLee's corrections
- none yet

## Repairs
- none
