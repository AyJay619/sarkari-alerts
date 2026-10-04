## BATCH SUMMARY BLOCK
```
SITE: UCO Bank Recruitment | VERDICT: FIX
PROPOSED: 1) exclude: drop "shortlisted" and bare "format" (it matches "Information" and wrongly drops IT Advisor selection + info hand-outs): "proforma|certificate|\bformat\b|compassionate|qualified|roll no|unique id"
PROPOSED: 2) limit 60 -> 120 (page has 112 distinct document links; rebaseline on first run, no flood sent)
MISSING TODAY: ~25 shortlist / interview-list posts (e.g. Shortlisted for Interview CTO, Manager-Civil Engineer, Data Scientist JMGS-I), the IT Advisor selection (20-05-2026) and LBO/Specialist Officer information hand-outs are dropped by the exclude
ASK BATLEE: none (shortlists and interview schedules are PASS under standing rules; contractual/consultant posts are HOLD by the sorter)
```

# UCO Bank Recruitment
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (after proposed fix)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Job Opportunities (the one "everything" page: ads, results, notices, updates) | https://uco.bank.in/job-opportunities | free fetch, https works, no www needed, ~0.4-0.8 s | FREE-OK |

Other guesses (/recruitment, /web/uco-bank/careers, /announcements) return 404. No separate results page found; results, shortlists, exam notices all sit on this one page. 4 repeat runs of fetchItems: 49 items each time, stable. http also answers 200.

## ScrapFly
Not needed. Group FREE. 0 credits.

## What the scanner catches vs misses
- Page has 112 distinct `documents/d/guest/...` links (about 201 raw anchors with duplicates). Current config returns 49.
- Links are on-site document pages (not direct PDFs); link slugs are stable (seen-state shows same slugs). No flood risk seen: no date/timestamp in the links.
- Page order is roughly newest first (PO/Specialist joining lists, 2026-27 advert 13-01-2026, then results).
- Wrongly excluded by current `exclude`: "shortlisted" (about 25 interview shortlists, which are PASS), "format" matching inFORMATion (IT Advisor selection, information hand-outs).
- Correctly excluded: Proforma for SC/ST/OBC/EWS/Disability, Format of Experience Certificate, application forms.
- Old non-guest PDF links (2011-2023 uploads) on the page are legacy; ignored correctly.
- Posting speed: not measurable (no dates on the page); a limit of 120 covers the whole page.

## Label pattern
Titles are plain English headings, no type prefix. Rule: type from keywords.
- "Recruitment of ... 2026-27", "Detailed Advertisement" = New Job (parent: the post/advert name or Advt No. such as HO/HRM/RECR/2025-26/COM-04)
- "List of Candidates Provisionally Selected ..." / "Final Result ..." / "Online Examination Result" = Result
- "Shortlisted for Interview ..." = Result / interview schedule (PASS)
- "Notice Regarding Schedule of Online Examination", "Pre-Examination Training", "Information Hand-out" = Update (exam notice)
- "Update on Engagement of ..." / "Status Updation on Engagement of ..." = Update (contractual posts, mostly HOLD)
- "Scribe Declaration Form" = Noise
Parent = text after "for the position of" / "for the post of" plus cycle (e.g. "Security Officer JMGS-I 2025-26", "Local Bank Officer 2025-26", "IBPS CRP-SPL-XV").

## Hold / pass rules for the sorter
HOLD: contractual / consultant roles (Chief Risk Officer, CTO, CDO, Company Secretary, IT Advisor, Treasury Advisor, Manager Economist / Data Analyst / Architect / Civil Engineer on contractual basis, Internal Ombudsman), "Update/Status Updation on Engagement" for those, Scribe Declaration Form, Proforma / certificate formats, application forms, Hindi duplicates of hand-outs, apprenticeship lists (BatLee decides, default PASS as result).
PASS: regular officer recruitment (generalist/specialist, LBO, PO/Rajbhasha/Law/HR via IBPS joining lists), results, provisional-selection and wait lists, shortlists for interview, exam schedule notices, information hand-outs, document verification / interview schedules.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| RECRUITMENT OF GENERALIST AND SPECIALIST OFFICERS ON REGULAR BASIS 2026-27 | New Job | Advt HO/HRM/RECR/2025-26/COM-04 (13.01.2026) | Pass |
| Notification of Final Result ... Generalist and Specialist Officers ... Advt HO/HRM/RECR/2025-26/COM-04 | Result | same | Pass |
| List of Candidates Provisionally Selected as Probationary Officer under IBPS CRP-PO/MT-XV along with joining schedule | Result | IBPS CRP-PO/MT-XV | Pass |
| List of Candidates Provisionally Selected as Law Officer under IBPS-CRP-SPL-XV | Result | IBPS CRP-SPL-XV Law Officer | Pass |
| List of Provisionally Selected Candidate under Wait List for IT Officer in MMGS-II, 2025-26 | Result | IT Officer MMGS-II 2025-26 | Pass |
| List of Provisionally Selected Candidate for Apprenticeship | Result | Apprenticeship | Pass |
| List of Candidates Provisionally Selected for Local Bank Officer 2025-26 | Result | LBO 2025-26 | Pass |
| Notice Regarding Schedule of Online Examaination | Update | LBO 2025-26 | Pass |
| Notice Regarding Pre-Examination Training | Update | LBO 2025-26 | Pass |
| Online Examination Result and Tentative Schedule for Document Verification, LPT and Interview | Result | LBO 2025-26 | Pass |
| Notice Examination for Recruitment of Specialist Officer on Regular Basis 2025-26 | Update | Specialist Officer 2025-26 | Pass |
| Scribe Declaration Form | Noise | n/a | Hold |
| Update on Engagement of Chief Risk Officer | Update | CRO contractual | Hold |
| Status Updation on Engagement of Company Secretary | Update | Company Secretary contractual | Hold |
| Final Result for Position of Manager- Architect on Contractual Basis | Result | Manager Architect contractual | Hold |
| List of Candidates Shortlisted for Interview for Chartered Accountant in MMGS-II (currently dropped) | Result | CA MMGS-II 2025-26 | Pass |
| Information Hand-out (LBO 2025-26) (currently dropped) | Update | LBO 2025-26 | Pass |

## Proposed config (sources.json entry)
```json
{
  "id": "uco-bank",
  "name": "UCO Bank Recruitment",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://uco.bank.in/job-opportunities",
  "include": "documents/d/guest",
  "exclude": "proforma|certificate|\\bformat\\b|compassionate|qualified|roll no|unique id",
  "limit": 120
}
```
(Standing rule says no keyword filters in the script; this only loosens the existing one. Keeping the remaining exclude is optional; the sorter can drop proforma/certificate noise too.) The exclude change plus limit is a config change, so the scanner re-baselines this source silently on first run.

## Uncertain points
- No dates on the page, so true posting speed unknown.
- Whether `\bformat\b` works as written depends on the exclude being compiled as a JS regex (it is a regex per README); not test-run since config must not be changed in batch mode. Simulated by hand against the 112 titles: only the Proforma/Format of Experience Certificate/Application Format items match.
- Limit applies before or after exclude was not verified; 120 is safe either way.

## BatLee's corrections
- none yet

## Repairs
- none
