## BATCH SUMMARY BLOCK
SITE: Indian Army (army + army-notices) | VERDICT: OK
PROPOSED: none (optional: timeoutMs 15000 on both, no other change)
MISSING TODAY: nothing found (admit-card table is a stale May-June 2026 CEE schedule; real recruitment/results are announced inside the CEE portal login, not as public links)
ASK BATLEE: none

# Indian Army (admit cards + notices)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE

## Pages watched and tested
| Source | URL | Fetch | Verdict |
|---|---|---|---|
| army | https://joinindianarmy.nic.in/ | free, 150-430 ms, 5/5 repeats = 5 rows | FREE-OK. Page is only a small captcha/login screen (11 KB) plus one table "ISSUE OF ADMIT CARD & SCH OF EXAM FOR ONLINE COMMON ENTRANCE EXAM 2026" (Post / Category, Exam Date, Admit Card Live Date). Every row links to the same Authentication.aspx login, so the title (post + dates) is the only identity. |
| army-notices | https://indianarmy.nic.in/ (needs extraCerts rapidssl pem, as in config) | free, 250-290 ms, 5/5 repeats = 10 items | FREE-OK. Homepage "News" list of /News/Article/<id> items (newest ids 10703 first). |

Also looked at: /content2/career/permanent-commission (static info page, no list), /tenderrfi/tender/ (vendor/contractor ads only, noise), /content2/important-links-main (404). Nothing else useful and free found. The apply/result flow lives on cdn.digialm.com (login form) and joinindianarmy login; not watchable.

## What the scanner catches vs misses
- army: the 5 CEE admit-card rows (all dated May-June 2026, stale; baselined). A new CEE cycle will add a new table, new rows = new titles, so it will fire. The table heading (exam name) is not captured in the title; sorter must treat "Agniveer ..." rows as CEE admit cards.
- army-notices: 10 of ~24 homepage articles pass the config exclude (vendors/contractors/message/awardees/honours/awards/guidelines for film). Passing items are mostly noise today; useful ones are TAC / "successful candidates" lists and "ADVERTISEMENT FOR ... " civilian posts.
- Posting speed: homepage news shows only the latest ~24 items, ids rise slowly (about 100 articles in 9 months), so no flood risk and nothing gets pushed off before a scan.
- Link stability: article ids are permanent; no flapping across 5 repeats.

## Label pattern
- army rows: "<Post/Category list separated by ;> <Exam date(s)> <Admit card live date> (Evening)". Parent = "Indian Army CEE 2026" (from the table heading, constant); type = Admit Card. Dates in the title mean the same post list can reappear with a new date: treat as new.
- army-notices: free-text capitals titles. "ADVERTISEMENT FOR FILLING UP <post>" = New Job (civilian/staff, check eligibility); "LIST OF SUCCESSFUL CANDIDATES OF <ENTRY> <year>" = Result (parent e.g. "TAC 2026", Technical Entry / TGC / NCC style entries). Parent = entry scheme + year.

## Hold / pass rules for the sorter
Hold: MoU with universities, newsletters (CUNPK), commendation / honorary ranks / awards / Independence-Day-Republic-Day lists, DDQ trains, banned apps, museums, MoD film guidelines, vendor/contractor registrations (ASC), E-in-C and chief messages, tenders. Principal Civilian Staff Officer advertisement: check if deputation/ex-servicemen only (usually deputation: hold unless open recruitment).
Pass: CEE admit-card rows, TAC/other entry shortlists and successful-candidate lists, any true recruitment notification (Agniveer, TES, TGC, SSC officers, NCC special entry, JAG), result / cut-off notices.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| JCO RT; SEPOY (PHARMA); Havildar Education 11-Jun-2026 15-May-2026 | Admit Card | Army CEE 2026 | Pass (stale) |
| Agniveer (GD); Agniveer Tradesmen (10TH) 01 & 02-Jun-2026 18-May-2026 | Admit Card | Army CEE 2026 | Pass (stale) |
| Agniveer (GD); Tradesmen (10TH); Tech 03 & 04-Jun-2026 | Admit Card | Army CEE 2026 | Pass (stale) |
| Agniveer (GD); Tradesmen (10TH); Tech 05 & 08-Jun-2026 | Admit Card | Army CEE 2026 | Pass (stale) |
| Remaining category: Agniveer GD/Tradesmen (8TH)/SOL TECH/WMP/Clerk 09,10,12-Jun-2026 | Admit Card | Army CEE 2026 | Pass (stale) |
| LIST OF SUCCESSFUL CANDIDATES OF TAC 2026 (10701) | Result | TAC 2026 | Pass |
| ADVERTISEMENT FOR FILLING UP PRINCIPAL CIVILIAN STAFF OFFICER (10699) | New Job | Principal Civilian Staff Officer | Pass/check (likely deputation) |
| MoU with Universities and Schools (10700) | Noise | - | Hold |
| LIST OF HONORARY RANKS ... REPUBLIC DAY 2026 (10667) | Noise | - | Hold |
| CUNPK NEWS LETTER JAN 2026 (10662) | Noise | - | Hold |
| LIST OF COAS AND VCOAS COMMENDATION CARD ... (10659) | Noise | - | Hold |
| DEFENCE DEPARTMENT QUOTA (DDQ) ON VARIOUS TRAINS (10635) | Noise | - | Hold |
| AWARD OF DGAFMS 15 AUG 2025 (10624) | Noise | - | Hold |
| List of Banned Apps (10608) | Noise | - | Hold |
| INDIAN ARMED FORCES MUSEUMS (10596) | Noise | - | Hold |
| Registration of vendors as approved ASC contractors (10669, 10646-8) | Noise | - | Hold (already excluded) |
| LIST OF PERSONNEL ... HIGHER AWARDS INDEPENDENCE DAY 2026 (10698) | Noise | - | Hold (already excluded) |

## Proposed config
Current config is fine as is. Optional only:
```json
{"id":"army","timeoutMs":15000}
{"id":"army-notices","timeoutMs":15000}
```
(Both answer in under 0.5 s; this only guards against a slow day.) No URL/selector change, so no rebaseline.

## Uncertain points
- Real Army recruitment (Agniveer, TES, TGC, SSC officers) is announced on joinindianarmy.nic.in behind login/captcha and in newspapers; the public pages rarely show it, so this source will be mostly quiet. Not fixable for free.
- The exclude "awards" would also drop a notice with "awards" in a job title; very unlikely.
- Was not able to confirm what the TAC list links to (PDF links are "Click Here to View" via script).

## BatLee's corrections
- none yet

## Repairs
- none yet
