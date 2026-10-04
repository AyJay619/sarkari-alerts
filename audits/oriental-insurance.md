## BATCH SUMMARY BLOCK
SITE: Oriental Insurance Careers | VERDICT: FIX
PROPOSED: 1) Add contextClosest "tr" + contextFind "td:first-child" so each PDF title gets its row heading as parent (e.g. "DR-AO (GENERALIST & HINDI OFFICER) EXERCISE -2025: NOTICE DT 04 08 2026"). Keep render true (free local Chromium), waitFor, include, limit. Links are unchanged so no flood; titles change only.
MISSING TODAY: Parent exam name is missing from titles (many are just "NOTICE ..."); rows that have no PDF but an IBPS link (score display, call letter, re-print) are not caught; Archive (previous years) not watched.
ASK BATLEE: (a) Also catch the IBPS-hosted score/call-letter links (include "[.]pdf|ibpsreg[.]ibps[.]in")? Recommend NO: they are candidate login links that do not give a new notice. (b) Hold-rule for formats/addresses is left to the sorter (no script filter), OK?

# Oriental Insurance (OICL)
Audited: 2026-10-04 | Group: FREE (local rendering) | Status: ACTIVE (batch audit, not yet applied)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Careers (current FY) | https://orientalinsurance.org.in/careers | render true (local Chromium), waits for a PDF link | FREE-OK with render |
| Careers archive | link "Archive (For Previous Financial Years)" on the same page | not tested | not watched |

- Plain fetch (no render) returns a JS shell (about 8 KB, AWS WAF script, no notices); the scanner without render says "no notices found". So render is needed. It costs no credits (local browser, about 3-6 s per scan). curl gets HTTP 200 but with the empty shell.
- Scanner result today (current config): 18 PDF links, same on repeat runs (3 runs). PDFs sit on a public S3 bucket (oicl-cms-media.s3.ap-south-1.amazonaws.com) with a hash in the filename, so links are stable (no flood risk).
- Not tested: whether the S3 PDFs download without the page (they are plain public S3 links, expected yes; not downloaded).
- I did not test the "www." version separately; the non-www URL works.

## Page layout
A table (Title | Last Uploaded Date | Action). Each row = one heading (the exam / exercise name) with a date and one or more PDFs. Newest row first. Some rows have only an external IBPS link (score display, call letter, re-print) and no PDF.
Posting speed: about 1 to 4 rows a month; limit 40 is ample.

## Label pattern
Current titles are the PDF filename only ("NOTICE DT 04 08 2026", "ADVERTISEMENT BIG"): no exam name, no date. With the proposed contextClosest the title becomes "<Row heading>: <PDF name>".
Row headings seen: "Engagement of Actuarial Apprentices" (new job), "DR-AO (GENERALIST & HINDI OFFICER) EXERCISE -2025" (= AO Generalist & Hindi Officer 2025 recruitment), "ASSISTANT RECRUITMENT EXERCISE-2025".
Parent for the sorter: take the row heading before the colon, e.g. "AO (Generalist & Hindi Officer) 2025", "Assistant 2025", "Actuarial Apprentices".

## Hold / pass rules for the sorter
Pass: ADVERTISEMENT (new job: Actuarial Apprentices, row dated 23-09-2026, check it is a normal engagement and not consultant-type), cut-off / shortlist / contingency lists, notices about the exam or medical examination, interview schedules, results.
Hold: blank formats and forms (Character certificate, Reference Letter, Undertaking from Surety, Service Agreement/Guarantee Bond, Caste certificate format, Interview Data Sheet, Format of Application, Instructions to candidates called for interview), Regional Office address lists, posting notices (final posting list after selection), general info notices. Hold external IBPS candidate login links (not caught anyway).
Note: the existing script exclude already drops "format of|instructions|data sheet|..." ; "Format - ..." (with a dash) and "address" are not dropped, left to the sorter per the no-keyword-filter rule.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| ADVERTISEMENT BIG | New Job | Engagement of Actuarial Apprentices | Pass (verify role) |
| FORMAT OF APPLICATION FOR ACTUARIAL APPRENTICES | form | Actuarial Apprentices | Hold (not caught, excluded) |
| INTERVIEW DATA SHEET | form | Actuarial Apprentices | Hold (excluded) |
| CUT OFF OF PHASE I II (DR AO 2025 ...) | Result | AO Generalist & Hindi Officer 2025 | Pass |
| Notice- DR AO-2025 13.08.2026 | Update | AO 2025 | Pass (read it) |
| NOTICE DT 04 08 2026 | Update | AO 2025 | Pass (read it) |
| Format - Character certificate | form | AO 2025 | Hold |
| Format - Reference Letter from Referee | form | AO 2025 | Hold |
| Format -Undertaking from Surety | form | AO 2025 | Hold |
| Format -Service Agreement-cum-Guarantee Bond | form | AO 2025 | Hold |
| NOTICE DR AO POSTINGS 01.08.2026 | Update (postings) | AO 2025 | Hold (post-selection postings) |
| RO PUNE ADDRESS | Noise | AO 2025 | Hold |
| Notice for Pre Recruitment Medical Examination DR-AO-2025 | Update | AO 2025 | Pass |
| DR AO 2025 SHORTLISTED CANDIDATES FOR PRE RECRUITMENT MEDICAL EXAMINATION | Result (shortlist) | AO 2025 | Pass |
| CASTE CERTIFICATE FORMAT | form | AO 2025 | Hold |
| ADDRESS OF REGIONAL OFFICE DR AO 2025 | Noise | AO 2025 | Hold |
| NOTICE FOR DISPLAY OF CONTINGENCY-DR-ASSISTANT-2025 | Result (contingency list) | Assistant 2025 | Pass |
| DR-ASSISTANT-2025 (DISPLAY OF CONTINGENCY) | Result | Assistant 2025 | Pass |
| REGIONAL_OFFICE_ADDRESS DR ASSTT 2025 | Noise | Assistant 2025 | Hold |

## Proposed config (sources.json, id oriental-insurance)
```json
{
  "id": "oriental-insurance",
  "name": "Oriental Insurance Careers",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://orientalinsurance.org.in/careers",
  "render": true,
  "waitFor": "a[href*='.pdf']",
  "contextClosest": "tr",
  "contextFind": "td:first-child",
  "include": "[.]pdf",
  "exclude": "format of|instructions|data sheet|compassionate|qualified|roll no|unique id",
  "limit": 40
}
```
Tested with this exact context setting: 18 items, row heading prefixed correctly. Selectors changed, so the scanner re-baselines silently on first run.

## Uncertain
- Rendering needs the pinned Chromium on the machine that runs the india group; fine locally, would fail if that browser is missing (error says "browser could not start").
- Row headings are shared by many PDFs, so a later row title edit would only change titles, not links (seen check is by link).
- Archive page and the page behind "Actuarial Apprentices" advert content were not opened/read.
