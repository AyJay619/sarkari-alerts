# Indian Overseas Bank Careers (iob)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## BATCH SUMMARY BLOCK
```
SITE: Indian Overseas Bank Careers | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page lists ~400 doc links newest first; limit 60 covers recent ones)
ASK BATLEE: none
```

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Careers (all recruitment notices, results, corrigenda) | https://www.iob.bank.in/en/careers | free fetch, html rows | FREE-OK |

Tested: https with www works (60 items, 0.3-0.8 s, 4 of 4 runs OK). http://www redirects (301) to https. Non-www https://iob.bank.in/en/careers returns 404, so keep www.

## ScrapFly
Not needed. PDFs/doc links under /documents/d/guest/ are plain links on the same host.

## What scanner catches vs misses
Catches everything on the one page (rows are in a table, newest first). Page has ~400 doc links in total; the limit of 60 reaches back to roughly early 2025, which is far more than the posting speed (a few notices a month). No other careers sub-pages needed. Link stability: slugs are static and identical across 4 runs (no flood risk). Slight note: some slugs vary in case between old/new items (e.g. IOBBiodata_and_Other_forms vs iobbiodata_and_other_forms); same title appears for two cycles (Bio-Data forms, Information Handout, Scribe form), those are noise anyway.

## Label pattern
Titles are plain text, no type prefix. Parent is the notice title itself, and updates reuse the parent words:
- "Recruitment of <Post/Scheme> <year>" = New Job (e.g. Recruitment of Local Bank Officers 2026-27)
- "<Parent> - Conduct of Online Examination / Call Letter" = Admit Card
- "<Parent> - Results / Provisionally Selected / Shortlisted / Cut-Off" = Result
- "Corrigendum Notification dated ..." and "Extension of Closing Date ..." do NOT name the parent, so the sorter must match by the neighbouring rows (they sit directly under the parent ad) or by opening the PDF. The slug often hints (corrigendum-_recruitment-of-security-guards, corrigendum-webad-recruitment202627).

## Hold / pass rules (site-specific, for the sorter)
HOLD: contract/consultant/advisor/ombudsman/faculty-on-contract/Financial Literacy Consultant roles, RSETI Attender / Office Assistant (local, small), Bio-Data Format and Other Forms, Information Handout, Scribe Declaration Form, Revision of Stipend Amount, Pre-Examination Training notification (info only), Chief Financial Officer / General Manager / Company Secretary / senior lateral specialist posts only if BatLee treats them as non-mass (default: PASS, they are normal open jobs), Hindi handout duplicates.
PASS: Apprentices 750, Local Bank Officers, Generalist/Specialist Officers, Security Guards, Sportspersons, their exam notices, results, cut-offs, corrigenda, extensions.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Engagement of Apprentices ... FY 2026-27 - 750 Vacancies | New Job | Apprentices 2026-27 | Pass |
| Extension of Closing Date of Application / Payment of Fees | Update | Apprentices 2026-27 | Pass |
| Notification on Remote proctored Online Examination | Admit Card | Apprentices 2026-27 | Pass |
| Results of Provisionally Shortlisted Candidates | Result | Apprentices 2026-27 | Pass |
| Bio-Data Format and Other Forms | Noise | Apprentices | Hold |
| Recruitment of Chief Financial Officer | New Job | CFO | Pass |
| Recruitment of CFO - Provisional Selection | Result | CFO | Pass |
| Recruitment of Local Bank Officers 2026-27 | New Job | LBO 2026-27 | Pass |
| Notification on Pre Examination Training | Noise | LBO 2026-27 | Hold |
| Conduct of Online examination | Admit Card | LBO 2026-27 | Pass |
| Information Handout to Candidates | Noise | LBO 2026-27 | Hold |
| Scribe Declaration Form | Noise | LBO 2026-27 | Hold |
| Recruitment of Security Guards | New Job | Security Guards | Pass |
| Corrigendum Notification dated 02.09.2026 | Update | Security Guards | Pass |
| Recruitment of Generalist / Specialist Officers 2026-27 | New Job | GSO 2026-27 | Pass |
| Corrigendum Notification dated 02.09.2026 | Update | GSO 2026-27 | Pass |
| Recruitment of General Manager - IBU | New Job | GM IBU | Pass |
| Engagement of Advisor - Customer Service on Contract basis | New Job | Advisor | Hold |
| Financial Literacy Consultant ... Virudhunagar | New Job | FLC | Hold |
| Application for Attender ... RSETI | New Job | RSETI | Hold |

## Proposed config
No change. Current source (sources.json id "iob") is correct:
```json
{"id":"iob","type":"html","url":"https://www.iob.bank.in/en/careers","rowSelector":"tr:has(a[href*='/documents/d/guest/'])","rowTitle":"td:nth-child(2)","rowLink":"a[href*='/documents/d/guest/']","exclude":"compassionate|qualified|roll no|unique id","limit":60}
```

## Uncertain
- Rows carry no dates, so age cannot be judged from the page; rely on order (newest first).
- Corrigendum/extension titles lack the parent name (see label pattern).

## BatLee's corrections
- none yet

## Repairs
- none
