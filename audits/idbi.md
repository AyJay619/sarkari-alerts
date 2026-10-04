## BATCH SUMMARY BLOCK
SITE: IDBI Bank Careers | VERDICT: FIX
PROPOSED: 1) idbi exclude: replace bare "Format" with a word-boundary form (current one also kills every "Information ..." handout PDF); 2) add FREE source idbi-results = https://www.idbi.bank.in/idbi-bank-careers-current-result.aspx, include "pdf/careers", titleFromHref, extraCerts certs/idbi.pem, allowEmpty, rebaseline
MISSING TODAY: 4 "Information Hand out for Online Exam" PDFs (JAM 2026-27, PGDBF 2025) are dropped by the exclude; "Current Update" / "Process Closure" notices on the results page are not watched
ASK BATLEE: none

# IDBI Bank Careers (audit 2026-10-04, batch mode)

## Pages tested
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Current Openings (watched) | https://www.idbi.bank.in/idbi-bank-careers-current-openings.aspx | free, extraCerts certs/idbi.pem | FREE-OK, 33 items, 4 repeats stable (110-760 ms) |
| Results / current updates (new) | https://www.idbi.bank.in/idbi-bank-careers-current-result.aspx | free, same cert | FREE-OK, 4 careers PDFs among 45 PDF links |
| Announcements / homepage | idbi.bank.in | free | not useful (tenders, customer notices) |

All links are `pdf/careers/...` and all say "Detailed Advertisement" / "Instructions"; titleFromHref (file name) is right.

## What is caught / missed
- Caught: ads (SCO 2026-27, BMO Guwahati, Doctor, Spl Officer, Grade O/A), JAM/PGDBF/ESO closures, corrigendum, DV/PI instructions.
- Missed: exclude "Format" matches "Information" so the Information Hand-out PDFs vanish (4 today). With fixed exclude `Certificate|(^|[-/ _])Formats?([-_. ]|$)|Annexure|compassionate|qualified|roll no|unique id` the page gives 37 items (+4, nothing unwanted).
- Results page: the include "pdf/careers" gives exactly 4 items: Current Update SCO FY 2026-27, SCO 2026-27 Current Update, Current Update on Process (Jun 2025), Process Closure Specialist Officer. Everything else on that page is unrelated bank notices (excluded by include).
- Page lists no dates; posting speed cannot be measured. Page is a long history (older 2024-25 items); the 50 limit covers it. No flood risk seen (links stable file names).

## Label pattern
No date/type text on the page. Type and parent come from the file name: "Detailed-Advt-of-SCO-2026-27" = New Job, SCO 2026-27; "Advertisement-Grade-A/O-2-year-exp" = New Job; "JAM-... Instruction ... DV PI" = Update (DV/interview); "AM/JAM Information/Instructions" = exam handout (Admit card-type, Pass); "Closure Notification" = Update (process closed); "Current Update" = Update; "Corrigendum" = Update.

## Hold / pass (sorter)
- Hold: Hindi duplicates (name has "Hindi" / "IH Hindi"), Scribe Declaration forms, SC-ST/OBC format/self-declaration sheets (SC-ST-exe, OBC-exe), old 2024-25 / 2025-26 cycle items already closed (Closure Notifications are still passed as Updates only if the parent job was posted).
- Pass: all open ads (incl. Doctor, Spl Officer, SCO, BMO), exam information handouts (English), DV/PI instructions, corrigenda, Current Update notices.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Detailed Advertisement BMO Guwahati | New Job | BMO Guwahati | Pass |
| Detailed Advt of SCO 2026 27 | New Job | SCO 2026-27 | Pass |
| Advertisement Grade O 2 year exp March072026 | New Job | Grade O 2026 | Pass |
| Advertisement Grade A 2 year exp March072026 | New Job | Grade A 2026 | Pass |
| Detailed Advertisement Doctor | New Job | Doctor | Pass |
| Detailed Advt of Spl officer 2026 27 | New Job | Spl Officer 2026-27 | Pass |
| JAM Regional 2026 27 Instruction for DV PI | Update | JAM 2026-27 | Pass |
| Instructiions Document Verification PI Grade A 2026 27 | Update | Grade A 2026-27 | Pass |
| AM Instructions in English 2026 2027 | Admit Card | AM 2026-27 | Pass |
| AM Instructions in Hindi 2026 2027 | Admit Card | AM 2026-27 | Hold (Hindi dup) |
| JAM Information in English 2026 27 (currently missed) | Admit Card | JAM 2026-27 | Pass |
| Corrigendum JAM Grade O 2025 26 | Update | JAM Grade O 2025-26 | Pass |
| Closure Notification JAM 2025 26 Grade O | Update | JAM Grade O 2025-26 | Pass (if parent posted) |
| Scribe Declaration PGDBF 2025 26 | Noise | PGDBF | Hold |
| SC ST exe / OBC exe | Noise | ESO | Hold |
| Current Update Specialist Cadre Officers FY 2026 27 (results page) | Update | SCO 2026-27 | Pass |

## Proposed config
```json
{ "id":"idbi", "...":"unchanged", "exclude":"Certificate|(^|[-/ _])Formats?([-_. ]|$)|Annexure|compassionate|qualified|roll no|unique id" }
{ "id":"idbi-results","name":"IDBI Bank Results and Updates","runner":"india","tier":"FREE","level":"central","type":"html",
  "url":"https://www.idbi.bank.in/idbi-bank-careers-current-result.aspx","extraCerts":["certs/idbi.pem"],
  "include":"pdf/careers","titleFromHref":true,"allowEmpty":true,"limit":50 }
```
Exclude change makes idbi rebaseline-safe? The URL is unchanged, so the 4 handouts would alert once as new (all are old/2026-27 handouts); acceptable, or BatLee can accept the one-time alert.

## Uncertain
- Hindi detection relies on file names; "IH Hindi" names carry the word. Page has no dates.
- Exact `exclude` regex tested with the scanner's fetchItems; pattern anchoring for "Format" is by file-name separators.
