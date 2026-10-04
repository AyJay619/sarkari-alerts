# Punjab & Sind Bank (psb)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (works as is)

## BATCH SUMMARY BLOCK
SITE: Punjab & Sind Bank | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page has 100 PDF rows, limit 60 covers the newest; Apply-online jobs go to recruitmentpsb.com, which is not watched)
ASK BATLEE: none

## Pages watched and tested
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Recruitment (all notices) | https://punjabandsind.bank.in/content/recruitment | free, no www (www version 301-redirects to www and also works) | FREE-OK |

Scanner fetchItems: 4 runs, 60 items every time, 2-2.5 s each, no failures. PDFs on /system/uploads/recruitment/ download free (206 on range request). Page has 100 PDF rows; list is newest-first by position (a few re-uploaded old notices sit lower), so limit 60 is enough. Cost: 0 credits.
Apply-online portal (recruitmentpsb.com/Intro.aspx) is linked from the page; not tested or needed, all notices are mirrored here.

## Label pattern
Title is plain uppercase/sentence text, no "Type:" prefix. Rules:
- "ADVERTISMENT FOR ..." / "Lateral recruitment of ... APPLY ONLINE" / "Advertisement for appointment of ..." = New Job (note misspelling ADVERTISMENT).
- "LIST OF (PROVISIONALLY) ELIGIBLE CANDIDATES FOR INTERVIEW ..." = interview schedule/shortlist (Pass if current cycle).
- "RESULT OF ..." / "FINAL RESULT ..." / "LIST OF CANDIDATES PROVISIONALLY SELECTED" = Result.
- "WRITTEN EXAMINATION NOTICE FOR ..." = exam/admit-card notice (Pass).
- "CORRIGENDUM" / "EXTENSION NOTICE" = Update.
- Parent = text after "FOR/OF" (e.g. "Lateral recruitment of Specialist Officers MMGS II", "Local Bank Officers (Phase III)", "635 Apprentices", "Chief Risk Officer (CRO)"). Match updates to the job by this phrase.
- Link has no advert number; filename is <id>_<timestamp>.pdf (timestamp = upload date YYYYMMDDHHMM).

## Hold / pass rules (for sorter)
Hold: FLC Counsellor / Financial Literacy Centre posts (retired bank officials, contract); engagement of Medical Consultant / Physiotherapist / Psychologist (contract); Chief Risk Officer and Cloud Centre of Excellence engagement (contract, individuals) unless BatLee wants them; Defence Banking Advisors / MSME Relationship Manager contract engagements; Hockey Players scholarship scheme; Reservation Rosters and Promotee lists; Joining Formats / checklists / indemnity bond; Information Handout / Scribe Declaration duplicates.
Pass: Apprentices (635), Local Bank Officers, Lateral recruitment of Specialist Officers (regular posts), their exams, interview lists, results, corrigenda and extensions.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Enrollment of Hockey Players under Scholarship Scheme - Declaration of result | Result | Hockey players scheme | Hold |
| Application for Financial Literacy Centres Counsellors, contract, retired bank officials | New Job | FLC Counsellors | Hold |
| List of provisionally eligible candidates for interview - Chief Risk Officer | Update | CRO engagement | Hold (contract) |
| Notice for engagement of individuals for Cloud Centre of Excellence on contract | New Job | Cloud CoE | Hold (contract) |
| Advertisment for engagement of Chief Risk Officer on contract | New Job | CRO | Hold (contract) |
| List of joining formats for engagement of apprentices | Noise | Apprentices | Hold |
| List of candidates provisionally selected for apprenticeship training | Result | Apprentices | Pass |
| List of candidates provisionally eligible for interview, lateral recruitment of Local Bank Officers | Update | LBO Phase III | Pass |
| Result of lateral recruitment of Specialist Officers - Security Managers MMGS II | Result | Specialist Officers Security | Pass |
| Advertisement for appointment of Physiotherapist, RO Shimla, contract | New Job | Physiotherapist Shimla | Hold |
| Advertisment for engagement of 635 apprentices, apply online | New Job | 635 Apprentices | Pass |
| Written examination notice for recruitment of Local Bank Officers | Admit Card/Exam | LBO | Pass |
| Lateral recruitment of Specialist Officers - Security MMGS II, regular, apply online | New Job | Specialist Officers Security | Pass |
| Lateral recruitment of Local Bank Officers (Phase III), regular, apply online | New Job | LBO Phase III | Pass |
| Final result of lateral recruitment of Local Bank Officers (Phase-II) JMGS I | Result | LBO Phase II | Pass |
| Corrigendum for lateral recruitment of Specialist Officers MMGS II | Update | Specialist Officers MMGS II | Pass |
| Reservation Roster of Direct Recruitment of Clerks 2024 | Noise | Rosters | Hold |
| Extension notice of Medical Consultant at STC Rohini | Update | Medical Consultant | Hold |

## Proposed config
No change. Current sources.json entry (id psb, url https://punjabandsind.bank.in/content/recruitment, rowSelector tr:has(a[href*='system/uploads/recruitment']), rowTitle td:first-child, limit 60, exclude compassionate|qualified|roll no|unique id) works.

## Uncertain
- The exclude regex (compassionate|qualified|roll no|unique id) is a leftover; it matches nothing today. Harmless.
- Whether BatLee wants CRO / Cloud CoE specialist contract posts passed (they are senior one-off roles); held by the contract rule.

## BatLee's corrections
- none yet

## Repairs
- none
