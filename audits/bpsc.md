## BATCH SUMMARY BLOCK
SITE: BPSC (Bihar Public Service Commission) | VERDICT: OK
PROPOSED: none (optional: add /advertisement/ as backup FREE source, same selectors, render, rebaseline)
MISSING TODAY: nothing found (home table = "All" feed, 606 records; 10 newest rows shown; only first PDF of a multi-PDF row is caught, which is the main notice)
ASK BATLEE: none

# BPSC
Audited: 2026-10-04 | Group: FREE (local Chromium render, runner india) | Status: ACTIVE (batch audit, no config changed)

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Home (All feed table) | https://bpsc.bihar.gov.in/ | scanner fetchItems, render + waitFor `#table-body tr td`; 3 runs, 10 items each, ~5 s | FREE-OK (JS-ONLY table, filled by admin-ajax) |
| Advertisement | https://bpsc.bihar.gov.in/advertisement/ | same table widget, 50 rows per page, 52 records; curl 200 (table empty in raw HTML) | JS-ONLY, not tested through scanner, same selectors expected to work |
| What's New | https://bpsc.bihar.gov.in/whats-new/ | curl 200, no table | not a useful list |
| Feed | https://bpsc.bihar.gov.in/feed/ | curl 200 (WordPress posts feed) | not checked for notices, not needed |

Raw HTML of the home page loads with plain curl (HTTP 200, https, with www absent; host is bpsc.bihar.gov.in), but the notice table body is empty until JS runs, hence `render: true`.

Hidden data source (free, no JS needed): POST https://bpsc.bihar.gov.in/wp-admin/admin-ajax.php with form `action=fetch_category_data&category=all|notices|results|advertisement&subcategory=all&page_group=home&page=1&post_per_page=50&year=all&search_term=` returns JSON (posts[].date, category/subcategory, fields.home_advertisement_no, fields.home_subject_details, fields.home_view_download = HTML with PDF links). Counts today: all 606, notices 453, results 75, advertisement 52. The PDF link is embedded in an HTML string, so the scanner's json type (linkField) cannot read it cleanly. Current render approach is therefore kept. Useful only as a fallback if the render ever breaks.

## What the scanner catches vs misses
- Catches: the 10 newest rows of the "All" feed (notices, results, advertisements, DV/interview programs, corrigenda all appear here). Title = column 5 (subject text), link = first PDF in the row.
- Does not see: the Advt. No. column and the sub-category (Important Notices / Results / Corrigendum / Document Verification Program / Advertisement), because only one cell is used for the title. Some titles are therefore vague, e.g. "Auditor (Preliminary) Competitive Examination." (that is a Result row) or "Public Relation Officer Competitive Examination." (Final Result). The sorter must open the PDF or use the filename.
- Multi-PDF rows (TRE 4.0 advertisement row has 8 PDFs): only the first (Important Notice) is caught. Acceptable, the others are annexures of the same posting.
- Posting speed: about 40 rows in the last 2 months (max 3 rows a day seen). 10-row window covers about 2-3 weeks; with scans several times a day there is no flood risk.
- Link stability: links are fixed PDF URLs with a date + random suffix (`..._BPSC-20260929-qxkdgl.pdf`); no session tokens; 3 repeat runs identical. seen-india.json already holds 10 baseline entries.

## Label pattern
Title (column 5) is "<Post / Exam name> [– <action>]". Advt number is NOT in the title but is in the filename in many cases (`Important-Notice-152026-...` = Advt 15/2026; `...-91-1072025-...` = Advts 91-107/2025; `...-082026-Research-Officer-...` = Advt 08/2026; `...-1082025-Debarment...` = Advt 108/2025). Format is `<advtNo><year as 2 digits+... >`: number then 2026/2025 concatenated, so read it as number + 4-digit year. Parent = the exam/post name before " – " or the post name after "For the Post of"; the exam parent also includes the Advt number when known, e.g. "Advt 08/2026 Research Officer", "Advt 15/2026 School Teacher TRE 4.0", "72nd CCE", "71st CCE". Action words: "Final Answer Keys" (answer key), "Invitation of Objection to Answers" (answer key objections), "OMR Sheets ... available on dashboard", "Document Verification", "Provisional List", "Postponement", "Cancellation", "Reduction of Vacancies", "Debarred", "Server Maintenance".

## Hold / pass rules for the sorter
HOLD: debarment lists ("N Candidates have been debarred"), server maintenance notices, requisition sent back to department, OMR sheet upload / dashboard availability notices, unevaluated answer booklet notices, claims/objections about specific candidates only ("Candidates ... who have claimed"), scribe/normalisation, tenders, any Hindi duplicates, deputation or departmental posts, small consultant roles.
PASS: new advertisements (e.g. Advt 15/2026 TRE 4.0 School Teacher), re-invitation or probable commencement dates of online applications, exam date / postponement notices, admit card, answer keys and objection invitations, results (Prelim, Main, Final), document verification schedules and provisional DV lists, interview schedules, corrigenda (e.g. 72nd CCE vacancy changes), cancellations of tests.

## Sample links (audit day, from scanner run)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| School Teacher TRE 4.0 - District-wise Roster Vacancies (Notice cum Corrigendum), 29 Sep | Update | Advt 15/2026 School Teacher TRE 4.0 | Pass |
| HOD Govt. Polytechnic - requisition for 9 advts returned to dept | Noise | Advts 96-107/2025 HOD Polytechnic | Hold |
| Assistant Education Development Officer written exam - 32 candidates debarred | Noise | Advt 87/2025 AEDO | Hold |
| School Teacher TRE 4.0 (Important Notice, Advertisement) | New Job | Advt 15/2026 School Teacher TRE 4.0 | Pass |
| Online application suspended for server maintenance 23/09/2026 | Noise | none | Hold |
| Postponement of Project Manager (Prelim) exam | Update | Advt 109/2025 Project Manager | Pass |
| OMR sheets of Research Officer (Prelim) held 15 July on dashboard | Noise | Advt 08/2026 Research Officer | Hold |
| Research Officer (Prelim) - Final Answer Keys | Answer Key | Advt 08/2026 Research Officer | Pass |
| Revised DV schedule, Factory Inspector | Update | Advt 03/2026 Factory Inspector | Pass |
| Assistant Sanitary & Waste Management - 3 candidates debarred | Noise | Advt 108/2025 | Hold |
| Integrated 72nd CCE (Prelim) - reduction of 2 vacancies (not in scanner window, via ajax) | Update | 72nd CCE | Pass |
| Auditor (Preliminary) Competitive Examination (Results row, ajax) | Result | Advt 09/2026 Auditor | Pass |
| District Statistical Officer/Asst Director Main - Result (ajax) | Result | Advt 38/2025 | Pass |
| Invitation of objection to answers, Prosecution Officer (Prelim) (ajax) | Answer Key | Advt 13/2026 Prosecution Officer | Pass |

## Proposed config (optional, current source is fine as is)
Current (unchanged):
```json
{"id":"bpsc","name":"BPSC","runner":"india","tier":"FREE","level":"state","type":"html","render":true,"waitFor":"#table-body tr td","url":"https://bpsc.bihar.gov.in/","rowSelector":"#table-body tr","rowTitle":"td:nth-child(5)","rowLink":"a[href$='.pdf']","minTitle":10,"limit":30}
```
Optional backup (new job advertisements only, 50 rows per page; duplicates with home are merged by sorter):
```json
{"id":"bpsc-advt","name":"BPSC Advertisements","runner":"india","tier":"FREE","level":"state","type":"html","render":true,"waitFor":"#table-body tr td","url":"https://bpsc.bihar.gov.in/advertisement/","rowSelector":"#table-body tr","rowTitle":"td:nth-child(5)","rowLink":"a[href$='.pdf']","minTitle":10,"limit":30}
```
Note: I did not run the advertisement URL through the scanner (single-site rule, only the home source was tested); the table widget and column order are identical in the HTML. Verify column 5 is still the subject text on that page before adding. Rebaseline happens automatically for a new source.

## Uncertain
- Whether column 5 on /advertisement/ matches the home table (same plugin and columnOrderConfig, so likely yes).
- Hindi duplicates not seen in the English feed.
- Result and DV rows have vague titles without the Advt number; sorter will need the filename or PDF.

## BatLee's corrections
- none

## Repairs
- none
