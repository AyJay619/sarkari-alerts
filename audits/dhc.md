## BATCH SUMMARY BLOCK
SITE: Delhi High Court Recruitment (dhc) | VERDICT: FIX
PROPOSED: 1) drop the "exclude" filter on `dhc` (it hides "Shortlisted / Not Shortlisted", "qualified", "roll no" items that should pass or be judged by the sorter; no-keyword-filter rule); no rebaseline needed (selectors unchanged), hidden items appear once. 2) keep both pages, limit 80 is fine (pages show only 10 rows each).
MISSING TODAY: 2 items hidden by exclude (Chauffeur 2025 shortlist for document verification; DHJS Mains shortlist), both pass-type.
ASK BATLEE: DIAC Deputy Counsel / e-DHCR empanelment results are held as panel roles; recommend HOLD, say if you want them passed.

# Delhi High Court Recruitment (delhihighcourt.nic.in)
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (nothing applied)

## Pages watched and tested (scanner fetchItems, free fetch)
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Job Openings (adverts, admit cards, schedules, circulars; has date column) | https://delhihighcourt.nic.in/web/job-openings | html rows, 10 rows, 0.15-0.6 s | FREE-OK |
| Recruitment Results (current) | https://delhihighcourt.nic.in/web/recruitment-results-current | same selectors, about 8 rows | FREE-OK |
| Job Openings / Results archive | /web/job-openings-archive, /web/recruitment-results-archive | load, 2024 items | not needed (old) |
| General Notices | /web/public-notice | loads, 10 rows: holidays, case statistics, court orders, a few recruitment repeats | not a source (noise; recruitment items already on the two pages) |
| /web/recruitment | menu parent page, no list | no links | not a source |

URL variants: https with and without www, and http (redirects to https) all return the real page. Current https non-www is fine. No ScrapFly, credits 0. PDFs under /files/ are plain links (download free).

## Catch quality
- Scanner result: 20 items without exclude (18 with), identical on 5 repeats, 150-600 ms. Stable.
- Posting speed: about 10 items per 4 weeks on job-openings; a 10-row page is not overrun between scans (limit 80 harmless). Link stability: PDF links are fixed file paths (/files/YYYY-MM/recuritment/...); existing seen state matches them, no flood risk.
- Hidden by exclude today: "List of Candidates Shortlisted/Not Shortlisted for Documents Verification (Chauffeur 2025)" and "Result of Candidates Shortlisted for Delhi Higher Judicial Service Mains (Written) - 2026". Both are pass under the standing rules.

## Label pattern
Title is a free sentence ending in a dot, upper or mixed case, no type prefix. Parent = exam name phrase "<Post> (Open) Examination[ -]<year>", e.g. "Junior Judicial Assistant/Restorer (Open) Examination - 2026", "Chauffeur (Open) Examination-2025", "Despatch Rider-cum-Process Server (Open) Examination-2025", "Senior Personal Assistant and Personal Assistant (Open) Examinations - 2026", "Delhi Higher Judicial Service Preliminary / Mains Examination - 2026".
Stage words: Stage-I Preliminary, Stage-II Main / Skill test, Stage-III Interview. Type words: "Admit Card" = Admit Card; "Result" / "Information regarding result" = Result; "Vacancy Notice" / "Apply for" / "Advertisement" = New Job; "deletion of questions" = Update (answer key type); "Schedule", "date of document verification", "Documents to be furnished by PwBD" = Update. File names carry only a notice number (74_exams-nj.pdf), no advert number. The date column on the page is not captured by the scanner.

## Hold rules for the sorter (DHC)
HOLD: contractual / consultant / empanelment ads (Law Researchers at Jharkhand HC on contract, e-DHCR Assistant Editor empanelment, DIAC Deputy Counsel), deputation circulars (Supreme Court Assistant Registrar on deputation), other-court circulars, Hindi duplicates, general public notices (holidays, case statistics, court sitting days).
PASS: Open exam notices (JJA/Restorer, SPA/PA, Chauffeur, Despatch Rider, Delhi Higher Judicial Service), vacancy notices, admit cards, results, shortlists, document verification lists and schedules, current-cycle interview schedules, deletion-of-questions notices, scribe/PwBD notices for a live exam.

## Sample links (audit day, from the scanner)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Apply for Senior Personal Assistant and Personal Assistant (Open) Examinations - 2026 | New Job | SPA and PA (Open) Exam 2026 | Pass |
| Vacancy Notice of SPA and PA (Open) Examinations - 2026 | New Job | SPA and PA (Open) Exam 2026 | Pass |
| Admit Cards for Stage-II Main (Descriptive) Exam of JJA/Restorer 2026 | Admit Card | JJA/Restorer (Open) Exam 2026 | Pass |
| Schedule for Stage-II Mains (Descriptive) Exam of JJA/Restorer 2026 | Update | JJA/Restorer (Open) Exam 2026 | Pass |
| Documents to be furnished by PwBD candidates for scribe, Stage-II on 04.10.2026 | Update | JJA/Restorer (Open) Exam 2026 | Pass |
| Information regarding result of Stage-I Preliminary (CBT) of JJA/Restorer 2026 | Result | JJA/Restorer (Open) Exam 2026 | Pass |
| Notice regarding date of document verification, Chauffeur (Open) Exam-2025 | Update | Chauffeur (Open) Exam 2025 | Pass |
| List of Candidates Shortlisted/Not Shortlisted for Document Verification, Chauffeur 2025 | Result | Chauffeur (Open) Exam 2025 | Pass (hidden by exclude now) |
| Result of Stage-II Skill Tests of Chauffeur 2025 held 08/09.08.2026 | Result | Chauffeur (Open) Exam 2025 | Pass |
| Notice regarding date of Stage-III Interview, Despatch Rider-cum-Process Server 2025 | Update | DR-cum-PS (Open) Exam 2025 | Pass |
| Download Admit Card for Stage-III Interview of DR-cum-PS 2025 | Admit Card | DR-cum-PS (Open) Exam 2025 | Pass |
| Result of Stage-II Skill Test of DR-cum-PS 2025 | Result | DR-cum-PS (Open) Exam 2025 | Pass |
| Result of Candidates Shortlisted for Delhi Higher Judicial Service Mains (Written) 2026 | Result | DHJS Exam 2026 | Pass (hidden by exclude now) |
| Complete Result of DHJS Preliminary Exam 2026 held 26.07.2026 | Result | DHJS Exam 2026 | Pass |
| Notice regarding deletion of questions, DHJS Preliminary 2026 | Update (answer key type) | DHJS Exam 2026 | Pass |
| Advertisement for Law Researchers/Research Associates, High Court of Jharkhand, contractual | New Job | Jharkhand HC contract | Hold |
| Circular: Supreme Court inviting applications for Assistant Registrar (Computer) on deputation | Noise | Supreme Court deputation | Hold |
| Result publication, Deputy Counsel at DIAC | Result | DIAC Deputy Counsel | Hold (panel role, judgement call) |
| List of candidates selected for empanelment with e-DHCR as Assistant Editor | Result | e-DHCR Assistant Editor | Hold (empanelment) |

## Proposed config (sources.json, source dhc)
```json
{
  "id": "dhc",
  "name": "Delhi High Court Recruitment",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://delhihighcourt.nic.in/web/job-openings",
  "extraUrls": ["https://delhihighcourt.nic.in/web/recruitment-results-current"],
  "rowSelector": "tr:has(a[href])",
  "rowTitle": "td:nth-child(2)",
  "rowLink": "a[href]",
  "limit": 80
}
```
Only change: remove `exclude`. Selectors are unchanged so the scanner will not rebaseline; the 2 hidden items would show once as new catch (acceptable, or rebaseline if unwanted).

## Uncertain
- DIAC Deputy Counsel and e-DHCR empanelment results are held as panel/contract roles; BatLee may want them passed for a law-job audience.
