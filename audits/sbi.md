## BATCH SUMMARY BLOCK
SITE: SBI Careers | VERDICT: OK
PROPOSED: 1) timeoutMs 15000 (optional, site answers in 230-630 ms); no other change.
MISSING TODAY: nothing found (one page holds every advert, call letter, result, corrigendum; 318 links, limit 500 not reached).
ASK BATLEE: none (note: page keeps growing, 318 links of 500 limit; raise limit to 800 when it passes ~450).

# SBI Careers (audit 2026-10-04, batch mode)
Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Current openings (everything page) | https://sbi.bank.in/web/careers/current-openings | free fetchItems, 5 runs, 230-632 ms, 318 items each, identical | FREE-OK |
| recruitment-results | https://sbi.bank.in/web/careers/recruitment-results | curl 200 but no card list / no #jobLinks | not useful, not proposed |

- Only the https, no-www host works. www.sbi.bank.in does not connect; http sbi.bank.in did not answer; bank.sbi redirects to a maintenance page. Current URL is correct.
- Page is one accordion list (#jobLinks .card), newest advert at top, back to 2024-25. Each advert card holds all its links: English/Hindi advert, Apply Online, Biodata/CTC/Undertaking forms, call letters, corrigenda, interview schedule, results, wait lists, scribe links. So results and updates are on the same page: no extra source needed.
- Posting speed: a few adverts a month (SCO 2026-27/25 posted 30.09.2026). Scan frequency is ample. Result pages for some adverts are sub-pages (e.g. /web/careers/special-drive-ja-pre-marks-2024); they are linked from the card, so the link is caught.

## What the scanner catches vs misses
Catches every link of every card (title = "<advert no>: <link label>" via contextFind .accordion data-articleid). Misses nothing seen. Current exclude ": Hindi https" drops only the Hindi-only duplicate; fine.
Link stability (flood check): PDF links carry a "?t=<timestamp>" and a document UUID. If SBI re-uploads a PDF the link changes and a repeat alert could occur (rare, harmless). Apply links (recruitment.sbi.bank.in/<advt>/apply) are stable. ibps call-letter links carry an appid token, stable per cycle. Not tested over time.

## Label pattern
Title = "<advert no>: <label>". Parent = the advert number: "CRPD/<cat>/<yyyy-yy>/<n>" (cat: SCO = specialist officer, CR = clerk/JA, PO = probationary officer, CBO = circle based officer, RS = retired staff, APPR = apprentice, SPLDRIVE = special drive). Older ones have a numeric prefix ("21.CRPD/CR-SPLDRIVE/2024-25/23", "15.CRPD/SCO/2024-25/16"): strip the "NN." prefix. Parent for sorter: "SBI <cat> <yyyy-yy>/<n>", plus the post name from the English advert PDF (the labels do not name the post except for some results).
Types by label: "English"/"Apply Online"/"Apply Now" = New Job; "DOWNLOAD ... CALL LETTER" = Admit Card; "PRELIMINARY/MAIN/FINAL RESULT", "LIST OF CANDIDATES PROVISIONALLY SELECTED", "WAIT LIST", "MARKS SECURED" = Result; "CORRIGENDUM", "ADDENDUM", "Registration Extended", "INTERVIEW SCHEDULE" = Update; "LETTER TO SUCCESSFUL CANDIDATES" = Update/Result.

## Hold / pass rules for the sorter
- HOLD: RS (retired staff) adverts (CRPD/RS/...), Hindi / "Hindi/" labels, BIODATA / CTC NEGOTIATION FORM / UNDERTAKING FORMAT, SCRIBE GUIDELINES, LINK FOR UPDATION OF SCRIBE DETAILS, PRE-EXAMINATION TRAINING MATERIALS, ACQUAINT YOURSELF booklet, "Apply Now" duplicate of Apply Online, MARKS SECURED (marks notice; hold per standing rule), old-cycle items (2024-25 and earlier) are baseline only.
- PASS: English advert of any non-RS advert (PO, JA/clerk, SCO, CBO, apprentice), Apply Online with date/extension, call letters, prelim/main/final results, provisionally selected / wait lists, corrigendum/addendum, interview schedule for current cycle.
- Note: SCO adverts are often contract / specific-expertise posts (Wealth Management, IT, CISO); pass them as normal jobs unless the advert says contract-consultant only (BatLee to judge case by case).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| CRPD/SCO/2026-27/25: English | New Job | SBI SCO 2026-27/25 (Wealth Mgmt) | Pass |
| CRPD/SCO/2026-27/25: APPLY ONLINE (30.09.2026 to 21.10.2026) | New Job | same | Pass |
| CRPD/SCO/2026-27/25: BIODATA | Noise | same | Hold |
| CRPD/SCO/2026-27/25: CTC NEGOTIATION FORM | Noise | same | Hold |
| CRPD/SCO/2026-27/24: English | New Job | SBI SCO 2026-27/24 | Pass |
| CRPD/SCO/2026-27/24: UNDERTAKING FORMAT | Noise | same | Hold |
| CRPD/SCO/2026-27/23: APPLY ONLINE (Online Registration Extended till 05.10.2026) | Update | SBI SCO 2026-27/23 | Pass |
| CRPD/SCO/2026-27/20: Apply Now | Dup | SBI SCO 2026-27/20 | Hold (dup) |
| CRPD/CR/2026-27/17: English) | New Job | SBI JA 2026-27/17 | Pass |
| CRPD/CR/2026-27/17: DOWNLOAD PRELIMINARY EXAMINATION CALL LETTER | Admit Card | SBI JA 2026-27/17 | Pass |
| CRPD/CR/2026-27/17: LINK FOR UPDATION OF SCRIBE DETAILS | Noise | same | Hold |
| CRPD/CR/2026-27/17: PRE-EXAMINATION TRAINING MATERIALS | Noise | same | Hold |
| CRPD/PO/2026-27/09: PRELIMINARY EXAMINATION RESULT | Result | SBI PO 2026-27/09 | Pass |
| CRPD/PO/2026-27/09: DOWNLOAD MAIN EXAM CALL LETTER | Admit Card | SBI PO 2026-27/09 | Pass |
| CRPD/PO/2026-27/09: CORRIGENDUM | Update | SBI PO 2026-27/09 | Pass |
| CRPD/SCO/2026-27/12: INTERVIEW SCHEDULE | Update | SBI SCO 2026-27/12 | Pass |
| CRPD/SCO/2026-27/04: CORRIGENDUM (138 KB) | Update | SBI SCO 2026-27/04 | Pass |
| CRPD/CBO/2025-26/18: FINAL RESULT | Result | SBI CBO 2025-26/18 | Pass (old cycle) |

## Proposed config (sources.json, NOT applied)
```json
{"id":"sbi","name":"SBI Careers","runner":"india","tier":"FREE","level":"central","type":"html",
 "url":"https://sbi.bank.in/web/careers/current-openings","selector":"#jobLinks .card a[href]",
 "contextClosest":".card","contextFind":".accordion","contextAttr":"data-articleid",
 "minTitle":4,"exclude":": Hindi https","timeoutMs":15000,"limit":500}
```
(Optional: change nothing else. If a URL/selector is untouched no rebaseline is triggered; timeoutMs alone is harmless.)

## Uncertain points
- "?t=" timestamps in PDF links could cause a duplicate alert if SBI re-uploads a file; not observed over time.
- A page with 318 links (limit 500) will approach the limit in about a year; raise limit later.
- recruitment-results sub-page is not a list page; there is no separate results page worth watching.
