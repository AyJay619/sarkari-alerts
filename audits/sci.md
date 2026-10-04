# Supreme Court of India - Recruitments
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (works as it is)

## BATCH SUMMARY BLOCK
SITE: Supreme Court Recruitments (sci.gov.in) | VERDICT: OK
PROPOSED: none (optional: raise "limit" 60 to 110 only if BatLee wants the full back-catalogue; not needed, list is newest-first)
MISSING TODAY: nothing found (newest "Junior Court Assistant Examination-2026" notice of 01.10.2026 and the 30.09.2026 advertisement are both caught)
ASK BATLEE: none

## Pages watched
| Page | URL | Fetch method | Verdict |
| Recruitments (only list) | https://www.sci.gov.in/recruitments/ | free fetchItems, default timeout | FREE-OK (60 items, 120-290 ms, 3 runs identical) |
http:// redirects (301) to https://www. ; no-www host did not answer (connection failed), so www is required. The page has pager links (/recruitments/page/2, /3) but they returned no PDF rows when tested; page 1 itself holds 110 PDF rows (the scanner keeps the newest 60). Other site pages (notices-and-circulars, tenders, aor-examination) are not recruitment feeds; not added.

## ScrapFly
Not needed. PDFs on cdnbbsr.s3waas.gov.in download free (tested, HTTP 200, 85 KB).

## Structure and posting speed
One table, newest first, columns Title and View/Download (plus an "Accessible Version" PDF in the second cell, ignored by the row selector). No dates shown; the date is in the PDF path (uploads/2026/10/2026100117.pdf = 01.10.2026, last 2 digits a sequence). Cadence: roughly 3-8 items a month during active cycles. Links are static S3 paths, no session parts, no flood risk. Seen state is already baselined.

## Label pattern
Free-text titles, no "<Type>: <Parent>" form. Type by words: "Detailed advertisement", "Link for online application" = New Job; "Admit Card", "intimation of test city/state" = Admit Card; "Result", "Select list", "Wait list", "Consolidated result", "Score Card" = Result; "objection to the answer key", "Change of Answer Key" = Answer Key; "Notice regarding ... Test/Examination", "In re: ..." (exam notices), "Syllabus" = Update.
Parent: the post named in the title (Junior Court Assistant 2026, Court Master (Shorthand), Personal Assistant, Senior Personal Assistant, Additional Registrar (Housekeeping) ex-cadre, Law Clerks-cum-Research Associates 2026, Assistant Editor SCR / Museum / Librarian posts). "In re: <Exam>" titles carry the exam as parent.

## Hold / pass rules (sorter)
Pass: detailed advertisements, online application links, admit cards, test-city notices, results, select/wait lists, score cards, answer keys and changes, exam notices, syllabus for an open exam.
Hold: deputation vacancy circulars (Assistant Registrar (Computer), General Manager Canteen), Consultant / Research Assistant short-term contractual engagements, Law Clerk-cum-Research Associate short-term contract adverts are contractual (recommend HOLD per consultant rule; BatLee may override since they are popular law-graduate posts), Hindi duplicates if any.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
| In re: Junior Court Assistant Examination-2026 | Update | JCA Exam 2026 | Pass |
| Detailed advertisement ... Junior Court Assistant - 30 Sep 2026 | New Job | JCA 2026 | Pass |
| Vacancy Circular ... Assistant Registrar (Computer) on deputation | New Job | Asst Registrar (Computer) | Hold (deputation) |
| In re.: Law Clerks-cum-Research Associates Examination, 2026 (x3) | Update | Law Clerks 2026 | Pass |
| Syllabus for Senior/Junior Court Assistant-cum-Programmer | Update | SCA/JCA-cum-Programmer | Pass |
| Link for online application ... Assistant Editor SCR; Asst Director Museum; Asst Librarian | New Job | same posts | Pass |
| Vacancy circular General Manager Departmental Canteen on deputation | New Job | GM Canteen | Hold |
| Detailed advertisement Law Clerk-cum-Research Associates short-term 2026-27 | New Job | Law Clerks 2026-27 | Pass/Hold (see question) |
| Score Card Shorthand Skill Test ... Court Master (Shorthand) | Result | Court Master (Shorthand) | Pass |
| Consolidated result ... Additional Registrar (Housekeeping) | Result | Addl Registrar (HK) | Pass |
| Inviting online objection to answer keys ... Court Master (Shorthand) | Answer Key | Court Master (Shorthand) | Pass |
| Link to download Admit Card ... Court Master (Shorthand) | Admit Card | Court Master (Shorthand) | Pass |
| Select list / Wait list ... Junior Court Assistant | Result | JCA 2025 | Pass |
| Applications invited for Consultant (Research) and Research Assistant, CRP | New Job | CRP | Hold (consultant) |
| Change of Answer Key ... Personal Assistant held on 01.05.2025 | Answer Key | Personal Assistant 2025 | Pass |

## Proposed config
No change. Current source (sources.json id "sci"): url https://www.sci.gov.in/recruitments/, allowedHosts cdnbbsr.s3waas.gov.in, rowSelector "tr:has(td a[href*='.pdf'])", rowTitle td:first-child, rowLink "td:first-child a[href*='.pdf']", limit 60.

## Uncertain
- Law Clerk-cum-Research Associate adverts are short-term contracts; sorter default is hold, but BatLee may prefer pass (large audience).
- Pager pages /page/2 and /page/3 gave no PDF rows in my test, so I could not confirm older pages; irrelevant for new-item catching.

## BatLee's corrections
none yet

## Repairs
none
