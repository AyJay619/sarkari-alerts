## BATCH SUMMARY BLOCK
```
SITE: Union Bank of India Recruitment | VERDICT: OK
PROPOSED: 1. Optional: drop "qualified" from exclude (it hides result lists like "Candidates Qualified in Online Examination"); 2. Optional: set timeoutMs 15000; 3. Raise limit 80 -> 100 not needed (newest first, 229 rows on page)
MISSING TODAY: nothing found (handouts / scribe / medical / hospital notices are excluded on purpose; no separate admit-card page, call letters are portal links)
ASK BATLEE: Keep "call letter" in exclude? Recommend yes (call letters are portal links, not PDFs; exam notices still pass).
```

# Union Bank of India Recruitment
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitment (current "union") | https://www.unionbankofindia.co.in/en/common/recruitment | free fetch via fetchItems | FREE-OK, 229 PDF rows on page, 80 after limit, 0.7-1.5 s, 3/3 runs identical |

The .co.in host works (curl HEAD shows a 500 but the page body is served; fetchItems is fine). PDF links resolve to the new host www.unionbankofindia.bank.in/pdf/...; the same page also loads on .bank.in (229 rows). /en/common/careers has no notices (scanner error). Server-rendered, no JS needed. No separate admit card / results page: everything is one list, newest first.

## What the scanner catches vs misses
- Catches all PDF rows on the single recruitment list, newest first (top rows are Oct 2026 handout / scribe, Aug 2026 notices, Recruitment Project 2026-27 notification + corrigendum, apprentices result July 2026).
- Excluded by the current regex (correct): information handouts (English/Hindi), scribe guidelines/declaration, medical fitness formats, tie-up hospital lists. 
- Over-exclusion: "qualified" also drops "List of Candidate Qualified in Online Examination" (a result, row 53, old). Harmless today, but would drop a future qualified list.
- Posting speed: a few notices a month; limit 80 covers the last ~15 months, so no risk of missing between scans.
- Link stability (flood check): links static (/pdf/<name>.pdf), identical across repeat runs. The domain moved from .co.in to .bank.in in the PDF links; the seen check ignores www/http differences but NOT a different domain, so if the baseline was recorded with the old domain, one-time re-baseline (or a flood of ~80) may occur. The scanner normally re-baselines only on URL/selector change, so recommend checking state for the old-domain links before the next live scan.

## Label pattern
Titles are the notice name, no "type: parent" prefix. Often generic ("Notification", "Click here for Notification", "Notice regarding Examination date", "Schedule for Online Written Examination") so the PDF filename carries the context: Union-Bank-Recruitment-Project-2026-27.pdf, notification-final-1865-april26.pdf (1865 Apprentices), FINAL-NOTIFICATION-UBRP-2025-26.pdf (Specialist Officers), CRP-XV (Customer Service Associates). Parent = recruitment project name from title or filename (e.g. "Recruitment Project 2026-27", "Apprentices 1865", "UBRP 2025-26", "LBO 2025"). The sorter should open the PDF when title is generic.

## Hold / pass rules for the sorter
Hold: contractual / consultant roles (Internal Ombudsman, Deputy Internal Ombudsman, Chief Compliance/Financial Officer on contract, domain experts on contractual basis, Senior Analyst contractual, Coach / stipendiary hockey players); refund of fees, account-details submission, apprentice offer-cancelled lists, reporting-office lists for already joined candidates (PO/SO/clerk "with reporting office and guidelines"); handouts, scribe, medical formats, hospital lists; Hindi duplicates; old-cycle items (2023-2025 lists).
Pass: Recruitment Project 2026-27 notification and corrigendum, apprentice notifications / results / extensions, exam date and schedule notices, extension of last date, cancellation of recruitment (Wealth Managers), provisionally selected / waitlist lists for regular posts (Assistant Manager, SO, LBO, CSA).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Notice for Examination date for posts under Phase II | Update | Recruitment Project 2026-27 (32 posts) | Pass |
| Notice for Examination date for posts under Phase 1 | Update | Recruitment Project 2026-27 | Pass |
| Notice for extension of last date of application | Update | Recruitment Project 2026-27 | Pass |
| Corrigendum for Union Bank Recruitment Project 2026-27 (Officers with Domain expertise, GBO...) | Update | Recruitment Project 2026-27 | Pass |
| Notification (Union-Bank-Recruitment-Project-2026-27.pdf) | New Job | Recruitment Project 2026-27 | Pass |
| Provisionally selected candidates ... apprentices ... | Result | Apprentices 1865 | Pass |
| Notice regarding Examination date (may26) | Update | Apprentices 1865 | Pass |
| Notification (notification-final-1865-april26.pdf) | New Job | Apprentices 1865 | Pass |
| List of candidates allotted ... Customer Service Associates CRP-XV reserve list | Result | CRP XV CSA | Pass |
| Notice for extension of date for submission of account details | Update | Apprentices | Hold |
| Refund of application fees / intimation charges | Noise | - | Hold |
| Public Notice - Cancellation of Recruitment of Wealth Managers | Update | Wealth Managers (SO) | Pass |
| Schedule for Online Written Examination | Update | Wealth Managers (SO) | Pass |
| Notification for Recruitment of Wealth Managers (Specialist Officers) | New Job | Wealth Managers | Pass |
| Provisionally selected candidate for Internal Ombudsman (contractual) | Result | Internal Ombudsman | Hold |
| Notification for Appointment of Internal Ombudsman and Deputy (contractual) | New Job | Internal Ombudsman | Hold |
| List of Provisionally Shortlisted ... Assistant Manager (Credit) | Result | Assistant Manager Credit (UBRP 2025-26) | Pass |
| CORRIGENDUM UBRP 2025-26 (SPECIALIST OFFICERS) | Update | UBRP 2025-26 | Pass |
| Information Handout-English / Scribe Guidelines (Oct 2026) | Noise | - | Hold (already excluded) |

## Proposed config (JSON)
```json
{
  "id": "union",
  "url": "https://www.unionbankofindia.co.in/en/common/recruitment",
  "type": "html",
  "include": "/pdf/",
  "exclude": "call letter|handout|scribe|medical fitness|format of|tie up|hospital|compassionate|roll no|unique id",
  "limit": 80,
  "timeoutMs": 15000
}
```
(Changing exclude only affects what is shown, not the URL/selector, so no automatic re-baseline; the formerly excluded "qualified" rows are old and would appear once as new, so re-baseline or accept ~1 old item.)

## Uncertain
- Whether stored seen-links use the old .co.in domain (see flood check).
- Careers page has no content; assumed all postings go on /recruitment.
