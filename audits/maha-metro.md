## BATCH SUMMARY BLOCK
SITE: Maha Metro Careers | VERDICT: FIX
PROPOSED: 1) Replace include/exclude/limit with link mode on visible pdf links, titled by the row's Advertisement No (config below); 2) rebaseline (automatic, selector changes).
MISSING TODAY: every new job advertisement - the scanner only sees corrigenda/old notices because the advert link is the bare word "View" (shorter than minTitle 12). Today it misses Advt 08/2026, 07/2026, 06/2026, 03/2026, Internship 2026 etc.
ASK BATLEE: none (rows for deputation/contract-only Director posts are held by the sorter; recommend keep passing everything and let the sorter hold).

# Maha Metro (Maharashtra Metro Rail Corporation) - batch audit 2026-10-04
Group: FREE | Status: proposed

## Pages watched / tested
| Page | URL | Fetch | Verdict |
| Careers (only page with job notices) | https://www.mahametro.org/Career.aspx | free fetch via scanner fetchItems, https www. 5 runs OK (0.3-1.9 s, 2.3 MB page) | FREE-OK for loading; current config catches the wrong links |
- https no-www also works (same page). http with www TIMES OUT (15 s) - keep https.
- Page is huge: 121 table rows, every row repeats ~57 hidden (display:none) PDF links, so 7207 hrefs but only 57 unique PDFs. Scanner's current selector sees them in document order, which is why it shows a mix of corrigenda/results from 2020-2022 plus 2026 corrigenda, and never the advertisements.
- Table columns: Advertisement No | Advt For | Particulars (title as plain text, NOT a link; visible corrigendum/notice links sit below it) | Last Date | Details ("View" = advertisement PDF) | Apply Here (external, mostly closed).
- Newest first, no dates beside links; last date shown in its own column (not used).
- Other site pages (tenders on Nagpur/Pune metro sites, RTI) not job notices; not added.

## What the scanner catches vs misses
- Catches today (40, limit hit): corrigenda, extension notices, old 2020-22 results/exam notices, medical schedules. All already in the seen list, so silent.
- MISSES: the advertisement PDFs themselves (link text "View"). Verified in raw HTML: Advt 08/2026 (Director, deputation/contract, last date 24/09/2026), 07/2026 and 06/2026 (various posts, regular, last 18/09/2026), 05/2026, 04/2026, 03/2026, Internship 2026-27.
- Posting speed: about 8 adverts so far in 2026 (Jan-Sep), plus corrigenda; a few per month, well inside limit 40.
- Link stability: PDF names stable; no floods seen (3 consecutive runs identical).

## Label pattern
Proposed title = "<Advertisement No as in column 2>: <link text>", e.g.
- "MAHA-Metro/N/HR/07/2026 Date: 19.08.2026: View" = New Job (advertisement PDF), parent = Advt N/HR/07/2026
- "MAHA-Metro/N/HR/05/2026 Date: 10.08.2026: Corrigendum-1 to Advertisement No. ..." = Update, parent Advt N/HR/05/2026
Advert number format: MAHA-Metro/<N|P>/HR/<nn>/<year> (N = Nagpur HQ, P = Pune). Internship: "MAHA Metro/Pune/HR/Internship/<year>/<n>". Particulars text (e.g. "Advertisement for Various Posts ... on Contract / Deputation basis") is NOT in the title; sorter must open the PDF to read posts and basis.
Note: the Date after the number is not always identical to the date quoted in a corrigendum (02/2026: row says 18.04.2026, corrigendum says 15.04.2026) - match parents on number + year only.

## Hold rules for the sorter (site-specific)
- HOLD: Director / ED / GM / CPM / Chief Vigilance Officer posts "on deputation / contract" only, "Requirement of experienced personnel from Metro Rail/Railways" (lateral/deputation), internship notifications (not recruitment), document verification for apprentices only if a one-off list (apprentices call itself = pass).
- HOLD: SC/ST/OBC/EWS certificate formats, medical standards, how-to-raise-objection / question paper viewing instructions, objection window notices (already in current exclude list, keep).
- PASS: Advertisements for Various Posts "on Regular basis" or contract jobs open to all (e.g. N/HR/07/2026, 06/2026, 05/2026), apprentice engagement (AA), corrigenda/extensions, results, admit cards, exam date notices, medical schedules.
- Noise seen: the same "Steps to download admit card for Psycho Test" PDF repeats in every row of the page (old SC/TO/TC 2020 cycle) - proposed exclude.

## Sample links (audit day, proposed config output)
| Title | Type | Parent | Pass/Hold |
| MAHA-Metro/P/HR/08/2026 dated 03.09.2026: View | New Job | Advt P/HR/08/2026 (Director RS/S&O, deputation/contract) | Hold (deputation) |
| MAHA-Metro/N/HR/07/2026 Date: 19.08.2026: View | New Job | Advt N/HR/07/2026 (various posts, regular) | Pass |
| MAHA-Metro/N/HR/06/2026 Date: 19.08.2026: View | New Job | Advt N/HR/06/2026 (various posts, regular) | Pass |
| MAHA-Metro/N/HR/05/2026 Date: 10.08.2026: View | New Job | Advt N/HR/05/2026 (various, contract) | Pass (check basis) |
| ...N/HR/05/2026: Corrigendum-1 / Corrigendum-2 | Update | Advt N/HR/05/2026 | Pass |
| MAHA-Metro/N/HR/04/2026 Date: 05.08.2026: View | New Job | Advt N/HR/04/2026 (contract / deputation) | Check PDF |
| ...N/HR/04/2026: Corrigendum-1 / -2 | Update | Advt N/HR/04/2026 | Pass |
| MAHA Metro/Pune/HR/Internship/2026/384: View | Noise/Other | Internship 2026-27 | Hold |
| MAHA-Metro/N/HR/03/2026: View | New Job | Advt N/HR/03/2026 (contract / deputation) | Check PDF |
| MAHA-Metro/P/HR/02/2026 Date:18.04.2026: Corrigendum to Advertisement ... | Update | Advt P/HR/02/2026 (ED/GM/CPM) | Hold-ish (executive contract) |
| MAHA-Metro/P/HR/01/2026: View | New Job | Advt P/HR/01/2026 (executive) | Hold if deputation |
| MAHA-Metro/N/HR/05/2025: View | New Job | Senior Office Assistant (HR) | Pass (closed 30/10/2025, old) |
| MAHA-Metro/N/HR/04/2025: View | New Job | Advt N/HR/04/2025 | old |

## Proposed config (replace the maha-metro entry, nothing else)
```json
{
  "id": "maha-metro",
  "name": "Maha Metro Careers",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.mahametro.org/Career.aspx",
  "selector": "a[href*='pdf/']:not([style*='display:none'])",
  "minTitle": 4,
  "contextClosest": "tr",
  "contextFind": "td:nth-child(2)",
  "exclude": "steps to download|certificate|standards|instructions|how to|objection|format|compassionate|qualified|roll no|unique id",
  "timeoutMs": 15000,
  "limit": 40,
  "rebaseline": true
}
```
(Tested with fetchItems, 40 items, advert PDFs first. I dropped "document verification" from exclude: apprentice shortlist verification is a PASS under the standing rules; it only appears in the 2023 apprentice row, so no flood. Selector change triggers silent rebaseline anyway.)
Optional later: the Apply column links (digialm login/mock test) are external and mostly closed - not worth adding.

## Uncertain points
- Titles lack the post description; the sorter must read the PDF to see posts and whether deputation-only. Row 1 (Director) says deputation/contract, so it is a hold in practice.
- Date after the advert number differs between row and corrigendum in places; use number+year for matching.
- The page hides old rows' links via inline style on the element or its parent paragraph; the selector filters the first kind only. The second kind (hidden paragraph around visible link) is only the admit-card/objection links, which the exclude list removes. If Maha Metro redesigns the page, re-audit.
- The hidden "Click Here" span (2020 notice) can show as "<advt>: Click Here"; it is old and deep, not within limit 40.

## BatLee's corrections
- none yet

## Repairs
- none
