## BATCH SUMMARY BLOCK
SITE: National Insurance (NICL) Recruitment | VERDICT: FIX
PROPOSED: 1) source `national-insurance`: drop the "exclude" filter (it hides "List of Roll Numbers of Provisionally Shortlisted Candidates..." = real shortlists/results; sorter holds the rest), keep include "sites/default/files", limit 60, add timeoutMs 15000; no rebaseline needed for the exclude drop alone (rebaseline automatically if the scanner treats it as a change, 8 old PDFs would surface once). 2) optional: add FREE source `national-insurance-archive` (https://nationalinsurance.nic.co.in/recruitment/archive, same options, limit 60) only as history; not needed for new postings.
MISSING TODAY: nothing new missed except shortlist "Roll Numbers" PDFs hidden by the exclude (8 of 82 links, all old 2024-25 lists, but future ones would be hidden). Homepage has no job items (only empanelment EOIs, surveyor lists = noise).
ASK BATLEE: none. Note: the site drops connections in bursts (UND_ERR_SOCKET/ECONNRESET). Single requests spaced apart worked 35/35 (curl 10/10); the scanner's end-of-group retry covers it.

# National Insurance Company Ltd (NICL)
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (nothing applied, no config changed)

## Pages watched and tested (scanner's own fetchItems, free fetch)
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Recruitment (main) | https://nationalinsurance.nic.co.in/recruitment | html, include `sites/default/files` | FREE-OK. 82-84 PDF links on one page, newest first, ~0.2-1.0 s |
| Recruitment archive | https://nationalinsurance.nic.co.in/recruitment/archive | html | FREE-OK, 62 PDF links, older adverts (2023-24 and earlier, plus a few current); history only |
| Homepage | https://nationalinsurance.nic.co.in/ | html | loads; only a "Recruitment" menu link plus corporate PDFs (EOI for loss assessors, surveyor results, policies). Not a job source |
Only the no-www host exists: www.nationalinsurance.nic.co.in does not resolve (ENOTFOUND, https and http). Plain http times out (port 80 not answering). So https, no-www, as now.

## Flakiness (the dropped connection)
- In a burst of 6 quick repeats, 4 failed with "UND_ERR_SOCKET other side closed" (about 0.7 s) and classicTls / legacyTls did not change that; a 12-try loop and the archive page also showed ECONNRESET on the first try. The failure is the server dropping rapid repeat connections, not a TLS problem.
- Spaced out (2-3 s apart, fresh processes) it worked every time: 10/10 with curl, 6/6 plain scanner, 15/15 with timeoutMs 15000. Page size about 280 KB.
- Scanner already retries a failed site once after 20 s, which is enough in practice. timeoutMs 15000 is harmless and proposed; it is not a fix on its own.
No ScrapFly needed: credits 0. PDFs under /sites/default/files/ are plain links (not downloaded in this audit).

## Catch quality
- One list, newest first, items grouped by exercise (Assistants 2026-27, CISO contract, AO 2024-25 and older). Posting speed is a handful of PDFs per month (new items 2026-07 to 2026-09 were 9 within ~3 months), so limit 60 is far above the speed; no flood risk. Links are stable (same file paths; seen state holds them).
- Titles end with the file size ("... 124.58 KB") appended to the title text; it is a stable suffix, so the seen check is unaffected.
- The current `exclude` ("call letter|roll number|compassionate|qualified|unique id") hides 8 of 82 links today. All 8 are "List of Roll Numbers of Provisionally Shortlisted Candidates for Interview / Phase II (Main) Examination": these are shortlist results (PASS under the standing rules). Per BatLee's rule, no keyword filters in the script, so propose dropping the exclude.
- Seen state shows the 2026-09 items (state-wise count notice) already caught, so the scanner has worked on good fetches.

## Label pattern
- Titles are free text, no fixed prefix. Common forms: "Advertisement ... for Recruitment of <post>", "Detailed advertisement for Recruitment of 500 Assistant (Class -III) 2026-27", "Notice - <subject>", "List of Candidates Provisionally Shortlisted For ... (AO 2024-25) - Contingency List N", "Cut Off Marks for Phase I ...", "INTERVIEW SCHEDULE - (Recruitment of AO 2024-25)", "Addendum to Advertisement dated <date> regarding <post>".
- Parent: the exercise in the title or bracket, e.g. "NICL Assistant 2026-27 (500 posts)", "NICL Administrative Officer (AO) 2024-25", "NICL CISO (contract)". Year tag "(AO 2024-25)" / "(Assistant 2024-25)" is the best parent key. PDF filenames sit in /sites/default/files/YYYY-MM/ (folder = upload month); they carry no advert number.

## Hold / pass rules for the sorter (NICL)
HOLD: CISO / any "on contract basis" or "engagement of" posts, Pre-Recruitment Training (PRT) notices, forms and handouts attached to an exercise (Application Form annexure, Interview Data Sheet, Travelling Expenses Reimbursement Form, Form of declaration by OBC, Instructions to Candidates called for interview/RLT, Data Sheet), "Information Handout" for exams already caught, cut-off marks notices, state-wise & category-wise application counts, contingency list / pre-employment medical (PEMT) lists and schedules for old exercises (AO 2023-24, AO 2024-25), withdrawal of a contract advert, EOI / empanelment (loss assessors, surveyors), compassionate appointment, office relocation, policy documents.
PASS: new open-post adverts (Assistant, AO, Specialist), corrigenda / addenda / date extensions to an open advert, exam date intimation / postponement notices, online exam info handout for a CURRENT cycle, result / roll-number shortlists for phase exams and interviews of a current cycle, interview schedules, final selected lists for a current cycle. Old-cycle lists (AO 2023-24, AO 2024-25 pre-medical and contingency lists) are low value: HOLD unless BatLee wants late-stage updates.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Addendum to Advertisement dated 15-07-2026 regarding Engagement of CISO on Contract Basis | Update | NICL CISO (contract) | Hold (contract) |
| Application Form for Engagement of CISO on Contract Basis | Noise | NICL CISO | Hold |
| Advertisement dated 15-07-2026 for Engagement of CISO on Contract Basis | New Job | NICL CISO | Hold (contract) |
| Notice - Withdrawal of Advertisement for Engagement of CISO | Update | NICL CISO | Hold |
| Notice - State-wise & Categorywise count of applications (Recruitment of 500 Assistants 2026-27) | Update | NICL Assistant 2026-27 | Hold (info) |
| Notice regarding Pre-Recruitment Training for SC/ST/OBC & PwBD Candidates | Noise | NICL Assistant 2026-27 | Hold |
| Detailed advertisement for Recruitment of 500 Assistant (Class-III) 2026-27 | New Job | NICL Assistant 2026-27 | Pass |
| List of Provisionally Selected Candidates for Pre-Employment Medical Examination (AO 2024-25) - Contingency List 3 | Result | NICL AO 2024-25 | Hold (old cycle, late stage) |
| SCHEDULE FOR PRE EMPLOYMENT MEDICAL EXAMINATION ... POST OF AO (SCALE I) | Update | NICL AO 2024-25 | Hold |
| Notice - Cut Off Marks for Phase I Examination | Result | NICL AO 2024-25 | Hold |
| INTERVIEW SCHEDULE - (Recruitment of AO 2024-25) | Update | NICL AO 2024-25 | Pass if cycle open |
| Notice - Publication of Result of Phase II (Main) Examination (AO 2024-25) | Result | NICL AO 2024-25 | Pass |
| List of Roll Numbers of Provisionally Shortlisted Candidates for Interview _ Finance (AO 2024-25) | Result | NICL AO 2024-25 | Pass (hidden today by exclude) |
| List of Roll Numbers of Provisionally Shortlisted Candidates For Phase II (Main) Examination (AO 2024-25) | Result | NICL AO 2024-25 | Pass (hidden today) |
| Advertisement - Recruitment of Administrative Officers (Generalists & Specialists) 2024-25 | New Job | NICL AO 2024-25 | Pass (already old) |
| CORRIGENDUM PwBD VACANCIES (RECRUITMENT OF 500 ASSISTANTS) | Update | NICL Assistants 2024-25 | Pass if cycle open |
| NOTICE - Publication of Result of Phase I Examination (Assistant 2024-25) | Result | NICL Assistant 2024-25 | Pass |
| INFORMATION HANDOUT-ONLINE (PHASE I) EXAMINATION | Update | NICL Assistant 2024-25 | Pass if cycle open |
| Notice - Intimation of Date of Mains & Hindi Officers Examination (Online) | Update | NICL AO 2023-24 | Pass if cycle open |
| EOI for empanelment of Loss Assessment Agencies (homepage only) | Noise | n/a | Hold (not watched) |

## Proposed config (not applied)
```json
{
  "id": "national-insurance",
  "name": "National Insurance Recruitment",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://nationalinsurance.nic.co.in/recruitment",
  "include": "sites/default/files",
  "limit": 60,
  "timeoutMs": 15000
}
```
Optional history source: same, with id `national-insurance-archive`, url https://nationalinsurance.nic.co.in/recruitment/archive, limit 60 (propose skipping; duplicates and old items only).

## Uncertain
- The connection drops are unpredictable (server side); a bad day could fail both the first try and the 20 s retry. Persistent failure for several days would mean repeat the audit; no cheaper alternative exists (ScrapFly not tested, not needed).
- Whether NICL ever posts admit cards on this page is unknown: none seen in the 82 links (call letters appear to go via a separate portal). Not verified.

## BatLee's corrections
- none yet

## Repairs
- none yet
