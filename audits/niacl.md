# NIACL (New India Assurance)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## BATCH SUMMARY BLOCK
SITE: NIACL | VERDICT: FIX
PROPOSED: 1) niacl: include "docs/recruitment" -> "docs/recruitment|ibpsonline.ibps.in" so call-letter (admit card) links are caught; 2) niacl: add "reprint|re-print|apply online" to exclude (those IBPS links are forms, not news); 3) keep limit 25 and timeoutMs 45000 (first request is slow, 15 s; later 4 s). Seen key = title+link, so rebaseline happens by itself.
MISSING TODAY: admit-card / call-letter links on ibpsonline.ibps.in (excluded by the include filter); no new job posted since 2025 (page newest items are CTO/CISO contract ads + AO 2025 results).
ASK BATLEE: none

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitment list (all notices, newest first) | https://www.newindia.co.in/recruitment/list | free fetch via scanner, https+www, 7/7 OK (first call 15 s, then about 3.9 s) | FREE-OK |
| no-www | https://newindia.co.in/recruitment/list | works too (25 items) | not needed, keep www |

Page layout: one long list, newest first: Contract (CTO, CISO) ads, then AO 2025 recruitment notices, then older Assistant 2024 notices, then "mark-sheets" pages per past exercise, then Surveyor Management Policy (SMP) empanelment docs further down the page. Docs are PDFs under /recruitment/assets/docs/recruitment/<exercise folder>/. Admit-card / call-letter / apply links go off-site to ibpsonline.ibps.in/niacl<exercise>/... (login.php?appid=... , appid is unique per letter).

## ScrapFly
Not needed. Free fetch works. PDFs on newindia.co.in are directly linked.

## Scanner catch vs page
- Full page, unfiltered: 168 links with current exclude only; 117 pass the current include+exclude; limit 25 keeps the newest 25 (top of page). That is safe: posting speed is a few notices per month, far below 25.
- Links stable across 6 repeat runs (same 25, same titles) so no flood risk. Pages are very quiet (no new job notice since the 2025 AO recruitment).
- With the proposed include/exclude: 141 matches, top 25 identical in practice, call-letter links appear when NIACL posts them.
- Already-seen baseline: state/seen-india.json has niacl; changing include does not change the URL/selectors, so the new ibps links would appear as new only if they are within the top 25 (old ones already present would appear once, as a one-time catch of old call letters). To avoid a one-time flood of old call letters, rebaseline niacl after the change (README: change URL or selector, or clear that source's seen entry).

## Label pattern
Titles are free text in CAPITALS, no standard prefix. Type from keywords:
- "DETAILED ADVERTISEMENT", "NOTICE - RECRUITMENT OF ..." = New Job (parent = post + year, e.g. "NIACL Administrative Officers (Scale I) 2025", "NIACL Assistants 2024")
- "CLICK HERE TO DOWNLOAD (INTERVIEW|PHASE-I|PHASE-II|TIER I|TIER II|REGIONAL LANGUAGE TEST) CALL-LETTER" = Admit Card
- "LIST OF ROLL NUMBERS OF PROVISIONALLY SHORTLISTED", "LIST OF PROVISIONALLY SELECTED", "CUT-OFF MARKS", "STATE-WISE LIST ... SHORTLISTED" = Result
- "SCHEDULE OF INTERVIEW", "ADDENDUM", "CONTINGENCY LIST" = Update
- "INFORMATION HANDOUT", "DECLARATION", "TRAVELLING EXPENSES", "DOCUMENTS CHECKLIST", "DATA SHEET", "PRE-EXAMINATION TRAINING", "APPLICATION COUNT" = Noise
Parent comes from the exercise folder in the link path (RECRUITMENT OF ADMINISTRATIVE OFFICERS 2025, ASSISTANT RECRUITMENT EXERCISE - 2024) or from the IBPS path (niacljul25 = AO 2025, niacl5anov24 = Assistant 2024).

## Hold / pass rules for the sorter
- HOLD: contract appointments of senior officers (CTO, CISO "on Contract basis"), Surveyor Management Policy (SMP) empanelment notices and lists (surveyors, not employees; folder surveyor_management_policy), Hindi duplicates (e.g. "विस्तृत विज्ञप्ति", "(HINDI)" handouts), information handouts, declaration / travelling / checklist / data sheet forms, state-wise application counts, training links, mark-sheets pages, pre-employment medical instructions (info for already selected candidates; the list of selected itself is a Result, PASS).
- PASS: Administrative Officer / Assistant recruitment advertisements, call letters (admit cards), shortlists / roll-number lists / cut-offs, interview schedules of the current cycle, addenda / corrigenda, final provisional-selection lists.
- Hold-note: the CTO/CISO contract ads are the newest items; they are HOLD by the consultant/contract rule, but the sorter may show them as "Needs you" if the contract is large-post.

## Sample links (audit day)
| Title (short) | Type | Parent | Pass/Hold |
|---|---|---|---|
| Detailed advertisement Appointment of CTO on Contract basis | New Job | NIACL CTO contract 2025 | HOLD (contract) |
| Detailed advertisement Appointment of CISO on Contract basis | New Job | NIACL CISO contract 2025 | HOLD (contract) |
| List of provisionally selected candidates for pre-employment medical exam AO DR 2025 Contingency list | Result | NIACL AO 2025 | PASS |
| List of provisionally selected ... pre-employment medical AO DR 2025 | Result | NIACL AO 2025 | PASS |
| NOTICE - Recruitment of Administrative Officers (Scale I) 2025 | Update | NIACL AO 2025 | PASS |
| Schedule of interview for provisionally selected candidates AO Scale I 2025 | Update | NIACL AO 2025 | PASS |
| List of roll numbers of provisionally shortlisted for interview AO 2025 | Result | NIACL AO 2025 | PASS |
| ADDENDUM - Degree Specialisation AO DR RE 2025 | Update | NIACL AO 2025 | PASS |
| Click here to download interview call-letter (ibpsonline niacljul25) | Admit Card | NIACL AO 2025 | PASS (missed today, fixed by proposal) |
| Click here to download call-letter for Phase-II (Mains) exam | Admit Card | NIACL AO 2025 | PASS (missed today) |
| Information handout Phase-II online exam (English) | Noise | NIACL AO 2025 | HOLD (excluded by "handout") |
| Information handout Phase-II (Hindi) | Noise | NIACL AO 2025 | HOLD |
| Detailed advertisement - Recruitment of 550 Administrative Officers 2025 | New Job | NIACL AO 2025 | PASS |
| Pre-interview declaration form | Noise | NIACL AO 2025 | HOLD (excluded) |
| Travelling expenses reimbursement form | Noise | NIACL AO 2025 | HOLD (excluded) |
| State-wise and category-wise cut-off marks Tier II (Main) | Result | NIACL Assistant 2024 | PASS |
| Detailed advertisement in English (Assistant 2024) | New Job | NIACL Assistant 2024 | PASS |
| Notice Inviting Applications for Empanelment of Surveyors SMP 2026-27 | Noise | NIACL SMP | HOLD (not in scan: path is surveyor_management_policy) |

## Proposed config (sources.json, source "niacl")
```json
{
  "id": "niacl",
  "name": "NIACL",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.newindia.co.in/recruitment/list",
  "include": "docs/recruitment|ibpsonline\\.ibps\\.in",
  "exclude": "declaration|travelling|handout|annexure|format for|reprint|re-print|apply online",
  "minTitle": 15,
  "limit": 25,
  "timeoutMs": 45000
}
```
Change is include/exclude only (no URL/selector change), so rebaseline is not automatic: clear niacl's entry in state/seen-india.json once (or first run will list old call letters within the top 25).

## Uncertain points
- First request took 15 s on the cold call (later 3.9 s); keep 45000 ms timeout.
- The IBPS call-letter titles are generic ("CLICK HERE TO DOWNLOAD ... CALL-LETTER"); the same title repeats every cycle with a different link/appid, so seen key (title+link) works, but the sorter must read the exercise from the link path.
- Page is very quiet now, so "nothing new" in daily scans is normal, not a failure.

## BatLee's corrections
- none yet

## Repairs
- none yet
