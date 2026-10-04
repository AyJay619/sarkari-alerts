## BATCH SUMMARY BLOCK
SITE: PNB Recruitment (pnb.bank.in) | VERDICT: FIX
PROPOSED: 1. pnb: limit 40 -> 80 (page has 61 notices; limit 40 cuts the last 21, which are the live "750 Local Bank Officers HRP 2026-27" group). Nothing else changes (URL, selectors same).
MISSING TODAY: all 21 items of the 750 LBO 2026-27 group (advert 20-Jul-2026, Apply link, corrigendum 07-Aug, call letters 28-Aug, handouts 04-Sep) plus older LBO 2025-26 items; every item links to the page itself (postback links, no PDF URL).
ASK BATLEE: Raising the limit will list ~21 OLD items as new on the next run (limit change is not auto-rebaselined). Recommend: run once with a rebaseline / mark seen before the next real scan.

# PNB (Punjab National Bank) - Recruitments/Careers
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (batch mode; sources.json NOT changed)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitments/Careers (single page: every advert, call letter, result, joining schedule) | https://pnb.bank.in/Recruitments.aspx | free fetch via scanner fetchItems, https, no www, 356 KB | FREE-OK. 8 of 8 calls fine (0.3-0.9 s), 61 notices every time |

No ScrapFly needed (0 credits). PDFs: the anchors are ASP.NET postbacks (javascript:__doPostBack), so no PDF URL appears in the page; the scanner correctly uses pageLink:true and every item's link is the page URL. Other file links on the site (downloadprocess.aspx?fid=...) download free (tested one: 200, application/pdf), but the recruitment items do not expose such a link. Other PNB pages (Public-Notices, Tender) not examined beyond seeing them in the menu; Tender = hold anyway.

## What the scanner catches vs misses
- Page structure: 7 groups (one per exam / advertisement), each = group name (lblName), group last-updated date, then its notices in date order. Groups are listed newest-updated first; notices are appended to the END of their group, and a group that gets a new notice moves to the top.
- Total notices today: 61. Source limit is 40, so only groups 1-5 (40 items) are seen. Cut off: group 6 "Recruitment of 750 Local Bank Officers under HRP 2026-27" (updated 29-Jul-2026; about 15 items, the CURRENT LBO cycle) and group 7 "Recruitment of Local Bank Officers under HRP 2026-27" (older, 20-Jul-2026, about 6 items). A new notice in group 6 will be missed today. Tested with limit 80: all 61 returned.
- Posting speed: roughly 1 to 3 notices per week overall; busy days 24-Mar-2026 (5-6 joining schedules). 61 vs limit 80 leaves margin of about 19; page also drops items after their End Date, so it will not grow without bound.
- Link stability: all links equal the page URL, so the seen key is title + "(published date)". Titles repeat across groups (for example "DETAILED ADVERTISEMENT (ENGLISH)", "INFORMATION HANDOUT _ENG- LBO") but the published date is appended, and repeats only collide if same title AND same date, which I did not find. Flood check: a group's date is NOT part of the key, so reordering of groups does not re-flag items. No flood risk seen in 8 runs.
- Titles carry no parent. The parent group name cannot be added by config (contextClosest/contextFind need the heading inside an ancestor box; here the group heading is a flat sibling of the notices). So the sorter must infer the parent from keywords (see Label pattern).

## Label pattern
Title as the scanner gives it: "<NOTICE TITLE> (published DD-Mon-YYYY)". Group (parent) is not in the title. Infer by keywords:
- "SOBIP 30", "Specialist Officers" + "Information Handout", "Individual Scorecard" in 2026 -> Advt "30 Specialist Officers HRP 2026-27" (published 20-Apr-2026).
- "SDBA", "DBA", "Defence Banking Advisor" -> contractual engagement of SDBA/DBA (published 12-May-2026) = HOLD (retired defence personnel, contract).
- "CSA", "Customer Service Associates", "CRP XV" + "CSAs" -> IBPS CRP-XV CSA allotment (joining/LLPT). 
- "Management Trainees", "MTs" CRP XV -> IBPS CRP-XV Management Trainees (JMGS-I) joining.
- "Specialist Officers CRP XV", "Marketing/IT/Agriculture Officers", "Rajbhasha Adhikari" joining -> IBPS CRP-XV Specialist Officers joining.
- "LBO", "Local Bank Officer": two cycles. 2025-26 cycle (advert 03-Nov-2025, hindi 12-Nov-2025, exam call letter 26-Dec-2025, results Jun 2026). New cycle "750 Local Bank Officers HRP 2026-27" (advert 20-Jul-2026, apply, corrigendum 07-Aug-2026, exam 06-Sep-2026). Use date and "scheduled on 06.09.2026" to tell them apart.
Type words: "DETAILED ADVERTISEMENT" = New Job; "CALL LETTER" = Admit Card; "FINAL RESULT" / "LIST OF CANDIDATES QUALIFIED" / "SELECTED" / "SCORECARD" = Result; "CORRIGENDUM" = Update; "INTERVIEW SCHEDULE", "LLPT schedule", "JOINING SCHEDULE" = Update (schedule); "CLICK HERE TO APPLY" / "LINK TO DOWNLOAD APPLICATION FORM" = Update (apply link; for form download after interview it is Noise/hold).

## Hold / pass rules for the sorter
- HOLD: "Engagement of Senior Defence Banking Advisor / Defence Banking Advisors on contractual basis" group (all items: advert, interview schedules, selected candidates) - retired/contract.
- HOLD: "INFORMATION HANDOUT" (exam info handouts, English and Hindi), Hindi duplicates ("(HINDI)", "_HINDI", Devanagari titles such as the Hindi apply link).
- HOLD: "LINK TO DOWNLOAD APPLICATION FORM" (post-interview form, for shortlisted only) - candidate-specific.
- HOLD or low priority: Joining Schedules of IBPS-allotted CSAs / MTs / SOs and LLPT/document-collection schedules (post-selection, allotted candidates only) - these are individual joining logistics, not a public job step. Recommend hold unless BatLee wants them (see ask below... not asked; default = hold since they are only for already-selected candidates). Exception: Reserve List announcements are passed as Result by the standing rule if they are lists, but these are "schedule" notices, so hold.
- PASS: Detailed Advertisement (English), Apply link ("CLICK HERE TO APPLY"), Corrigendum, call letter for online exam, "Notice for online written examination", list of candidates qualified + interview schedule, interview call letter, final result, individual scorecard.

## Sample links (audit day, 2026-10-04)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| DETAILED ADVERTISEMENT (ENGLISH) (published 20-Apr-2026) | New Job | 30 SO HRP 2026-27 | Pass (already posted) |
| CLICK HERE TO DOWNLOAD CALL LETTER FOR ONLINE WRITTEN TEST SCHEDULED ON 27.05.2026 | Admit Card | 30 SO HRP 2026-27 | Pass |
| LIST OF CANDIDATES QUALIFIED IN ONLINE WRITTEN TEST HELD ON 27.05.2026 AND INTERVIEW SCHEDULE (23-Jul-2026) | Result | 30 SO HRP 2026-27 | Pass |
| Final Result and Joining Schedule of Specialist Officers (29-Aug-2026) | Result | 30 SO HRP 2026-27 | Pass |
| Link to View Individual Scorecard (29-Sep-2026) | Result | 30 SO HRP 2026-27 | Pass |
| INFORMATION HANDOUT _ENG - SOBIP 30 (18-May-2026) | Noise | 30 SO HRP 2026-27 | Hold |
| INFORMATION HANDOUT _HINDI - SOBIP 30 | Noise | 30 SO HRP 2026-27 | Hold |
| DETAILED ADVERTISEMENT (ENGLISH) (12-May-2026) | New Job | SDBA/DBA contractual | Hold |
| Interview Schedule- Defence Banking Advisor (19-Sep-2026) | Update | SDBA/DBA contractual | Hold |
| Schedule for Document Collection and LLPT (13-Apr-2026) | Update | CSA CRP XV | Hold |
| Joining Schedule of CSAs- CRP CSA XV- Reserve List I (24-Sep-2026) | Update | CSA CRP XV | Hold |
| Joining Schedule of Management Trainees- CRP XV- Reserve List II (29-Aug-2026) | Update | MT CRP XV | Hold |
| Joining Schedule of IT Officers - 06.04.2026 | Update | SO CRP XV | Hold |
| DETAILED ADVERTISEMENT (ENGLISH) (published 20-Jul-2026) [BEYOND limit 40] | New Job | 750 LBO HRP 2026-27 | Pass |
| CLICK HERE TO APPLY (20-Jul-2026) [BEYOND limit] | Update (apply link) | 750 LBO HRP 2026-27 | Pass |
| CORRIGENDUM (ENGLISH) (07-Aug-2026) [BEYOND limit] | Update | 750 LBO HRP 2026-27 | Pass |
| CLICK HERE TO DOWNLOAD CALL LETTER FOR ONLINE WRITTEN TEST SCHEDULED ON 06.09.2026 (28-Aug-2026) [BEYOND limit] | Admit Card | 750 LBO HRP 2026-27 | Pass |
| FINAL RESULT - LOCAL BANK OFFICER (LBO) (23-Jun-2026) [BEYOND limit] | Result | LBO 2025-26 | Pass |
| DETAILED ADVERTISEMENT (ENGLISH) (published 03-Nov-2025) [BEYOND limit] | New Job | LBO 2025-26 | Pass (old) |

## Proposed config (sources.json, pnb entry)
```json
{
  "id": "pnb", "name": "PNB Recruitment", "runner": "india", "tier": "FREE", "level": "central",
  "type": "html", "url": "https://pnb.bank.in/Recruitments.aspx",
  "rowSelector": "div[id^='ContentPlaceHolder1_rptGrid_lbtnrTitle1_'] p",
  "rowTitle": "self",
  "titleReplace": ["\\s*Publish Date\\s*-?:?\\s*(\\d{1,2}-\\w{3}-\\d{4}).*$", " (published $1)"],
  "pageLink": true, "minTitle": 15, "limit": 80
}
```
Only change: limit 40 -> 80. No keyword filters (per standing rule).

## Uncertain points
- Hindi-only titles (Devanagari) have length >= 15 so they pass minTitle; they are caught and should be held by the sorter.
- The page shows only unexpired notices (End Date); older notices vanish, so the item count can shrink; no problem for the seen check.
- Whether the limit change triggers an automatic rebaseline is not guaranteed (README says URL/selector changes do); assume it does NOT and expect ~21 old items to appear once.
- Could not obtain the real PDF URLs (postback only); the sorter must open the page to read a notice, or work from the title.
- Tested only from this PC (runner "india").

## BatLee's corrections
- none yet

## Repairs
- none yet
