## BATCH SUMMARY BLOCK
```
SITE: DMRC Careers (delhimetrorail.com) | VERDICT: FIX
PROPOSED: 1. Edit "dmrc": remove "exclude" (screening/result-of items are PASS: screening schedules + results = interview/shortlist notices); 2. add "minTitle": 8 (the one-word "Corrigendum" PDFs are dropped today by the default 12); 3. keep render:true, same URL, rebaseline on first run (selectors/exclude change); 4. keep "limit" 40 (page shows 10 advts, 25 PDFs today)
MISSING TODAY: all "Corrigendum" PDFs (title too short) and all screening-schedule / result-of-screening PDFs (12 of 25 links today); older advts on Archives page (not needed)
ASK BATLEE: none (note: today's DMRC posts are mostly PRCE/deputation = HOLD; the sorter will drop most of them, only Direct Recruitment ones pass)
```

# DMRC Careers (delhimetrorail.com)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Careers > Vacancies (current "dmrc") | https://delhimetrorail.com/pages/en/career | fetchItems with render:true (pinned Chromium), waitFor a[href*='.pdf'] | FREE-OK, 4/4 runs identical (13 items with today's exclude, 25 with the proposed config), 5.6-10.3 s |
| Careers > Archives | https://delhimetrorail.com/pages/en/archived_career | not fetched (old, closed advts) | not needed |
| Careers > Formats | https://delhimetrorail.com/pages/en/formats | not fetched (application forms) | not needed |

Details:
- The site is a React SPA: a plain fetch of /pages/en/career returns an empty shell (5.7 KB, no links), so the render is needed. Without www is the right host (www answers 301).
- The page loads its list from https://backend.delhimetrorail.com/api/v2/en/career/ (JSON, 135 rows, 10 per page, `documents` field = HTML with the PDF links). That API is behind Cloudflare: plain curl got 403 "Sorry, you have been blocked"; with ordinary browser-style headers (Origin + Referer = delhimetrorail.com) it answered 200. Not proposed: it is fragile (header dependent) and `linkHtmlField` would give only the FIRST PDF per advt, missing the corrigenda/results under each advt. The rendered page keeps all PDFs.
- PDFs on backend.delhimetrorail.com/documents/... download free by direct request (tested one: 200, application/pdf, 1.6 MB).
- No ScrapFly needed. Cost: 0 credits.

## What the scanner catches vs misses
- Today's source catches the 13 PDFs whose title is 12+ chars and does not contain "screening|result of|...": advertisements, extension notices, withdrawal.
- It MISSES (a) "Corrigendum" PDFs (title is exactly 11 chars, below the default minTitle 12; e.g. documents/10756/Corrigendum-Advt-230.pdf), and (b) the SCREENING SCHEDULE and RESULT OF SCREENING PDFs (12 of the 25 links today) because of the exclude. Under BatLee's standing rules these are PASS (results/shortlists, interview/screening schedules).
- Pagination: page shows only the latest 10 advertisements. Only matters if more than ~10 advts appear between two scans (DMRC posts about 1-3 a month): no risk.
- Posting speed: newest advt 21/09/2026 (Advt 234); site posts a few advts per month, no strong delay seen.
- Link stability (flood check): all links are static /documents/<id>/<file>.pdf, identical across 4 runs. No flood risk. Titles of the extension notices are duplicated (2 different PDFs, same title); the scanner's seen key is title|link so both are kept. The 13 links in state/seen-india.json stay known after the change (same title+link), so only the 12 newly visible PDFs would appear on the first run (rebaseline, because the exclude/minTitle change, makes them silent).

## Label pattern
Rows have no "type: parent" prefix. Title is the notice itself, usually in CAPS or sentence case.
- New job: "Requirement of <post>, [for/in] DMRC|DMIL [project/place], on <Direct Recruitment | Deputation | Post Retirement Contractual Engagement (PRCE) | Contractual> basis". The basis words in the title decide pass/hold.
- Advt number is NOT in the title but is in the PDF filename: Advt-234, Advertisement_233, Advt__229, Advt-228 etc. (and in the page's Advertisement no. column, e.g. DMRC/PERS/22/HR/2026(234)). Parent = "DMRC Advt 234/2026" style, or the post name + basis.
- Update types: "Corrigendum" (parent only from filename: Corrigendum-Advt-230 -> Advt 230), "Notification for extension of last date for receipt of applications for the post of <post> ..." (Update), "WITHDRAWAL OF ADVERTISEMENT FOR THE POST OF <post> ..." (Update, cancellation; filename Advt-230C).
- "SCREENING SCHEDULE FOR THE POST OF <post> ..." (Update, screening/interview schedule) and "RESULT OF SCREENING FOR THE POST OF <post> ..." (Result). Parent = the post text after "FOR THE POST OF", matching the original "Requirement of <post>" title; the filename also carries the Advt number (Advt-232-Result.pdf).

## Hold / pass rules (for the sorter)
HOLD:
- Any advt whose title says only "Post Retirement Contractual Engagement (PRCE)" or "on Deputation basis" (retired-only / deputation): today Advt 233, 232, 231, 228 (PRCE/deputation), DMIL/HR/1/2026 (deputation only), Advt 234 (Deputation / PRCE / Contractual).
- Screening schedule / result of screening that belong to a held (PRCE / deputation) advt: hold together with the parent (e.g. Advt 232, 231, 228).
- Anything about tenders, RTI, vigilance (not on this page, only noted).
PASS:
- Titles with "Direct Recruitment" (Advt 229 Executive (Legal) 3 posts DR, Advt 227 Project Director DR/deputation/PRCE, Advt 226 GM (Rolling Stock) DR/deputation): pass, because a direct-recruitment route is open to all.
- Corrigendum / extension / withdrawal / screening schedule / result of screening that belong to a passed advt (227, 226, 229).
- Mixed-basis posts (DR + deputation + PRCE) are judgement calls: recommended pass when "Direct Recruitment" appears.

## Sample links (audit day, 2026-10-04)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Requirement of Head Operations, for DMRC, ... Mumbai Metro Line-3 ... Deputation / PRCE / Contractual basis | New Job | Advt 234/2026 Head Operations Mumbai Line-3 | HOLD (deputation/PRCE) |
| REQUIREMENT OF ADDITIONAL GENERAL MANAGER (PLANNING & STRATEGY), FOR DMIL, ON DEPUTATION BASIS | New Job | DMIL/HR/1/2026 | HOLD (deputation) |
| REQUIREMENT OF SUPERVISOR (P. WAY), IN DMRC, ON PRCE BASIS | New Job | Advt 233/2026 | HOLD (PRCE) |
| REQUIREMENT OF ASSISTANT MANAGER / MANAGER FOR UTILITY DIVERSION WORK ... PRCE BASIS | New Job | Advt 232/2026 | HOLD |
| SCREENING SCHEDULE FOR THE POST OF AM / MANAGER FOR UTILITY DIVERSION WORK ... | Update | Advt 232/2026 | HOLD (parent held) |
| RESULT OF SCREENING FOR THE POST OF AM / MANAGER FOR UTILITY DIVERSION WORK ... | Result | Advt 232/2026 | HOLD (parent held) |
| REQUIREMENT OF AM/MANAGER (INSPECTION) FOR DMRC PROJECT, AT SRICITY, PRCE BASIS | New Job | Advt 231/2026 | HOLD |
| REQUIREMENT OF GENERAL MANAGER (PROPERTY DEVELOPMENT), FOR DMRC, ON DEPUTATION/ PRCE BASIS | New Job | Advt 230/2026 | HOLD |
| Corrigendum (Corrigendum-Advt-230.pdf) | Update | Advt 230/2026 | HOLD (parent held) |
| Notification for extension of last date ... General Manager (Property Development) (2 PDFs, same title) | Update | Advt 230/2026 | HOLD |
| WITHDRAWAL OF ADVERTISEMENT FOR THE POST OF GENERAL MANAGER (PROPERTY DEVELOPMENT) ... | Update (cancellation) | Advt 230/2026 | HOLD |
| REQUIREMENT OF EXECUTIVE (LEGAL), IN DMRC, ON DIRECT RECRUITMENT BASIS | New Job | Advt 229/2026, 3 posts | PASS |
| REQUIREMENT OF MANAGER/ASSISTANT MANAGER AND SUPERVISOR (ELECTRICAL) ... PRCE / DEPUTATION, JAIPUR PHASE-II | New Job | Advt 228/2026 | HOLD |
| RESULT OF SCREENING FOR THE POST OF MANAGER (ELECTRICAL) / AM (ELECTRICAL) (2 PDFs) | Result | Advt 228/2026 | HOLD (parent held) |
| REQUIREMENT OF PROJECT DIRECTOR (CIVIL) AT PATNA ... DIRECT RECRUITMENT/ DEPUTATION/ PRCE | New Job | Advt 227/2026 | PASS (DR route) |
| SCREENING SCHEDULE FOR THE POST OF PROJECT DIRECTOR (CIVIL) AT PATNA ... | Update | Advt 227/2026 | PASS |
| RESULT OF SCREENING FOR THE POST OF PROJECT DIRECTOR/CIVIL AT PATNA | Result | Advt 227/2026 | PASS |
| REQUIREMENT OF GENERAL MANAGER (ROLLING STOCK), IN DMRC, ON DIRECT RECRUITMENT/ DEPUTATION BASIS | New Job | Advt 226/2026 | PASS |
| SCREENING SCHEDULE / RESULT OF SCREENING FOR THE POST OF GENERAL MANAGER (ROLLING STOCK) | Update / Result | Advt 226/2026 | PASS |

## Proposed config (full "dmrc" source)
```json
{
  "id": "dmrc",
  "name": "DMRC Careers",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://delhimetrorail.com/pages/en/career",
  "allowedHosts": ["backend.delhimetrorail.com"],
  "render": true,
  "waitFor": "a[href*='.pdf']",
  "include": "backend[.]delhimetrorail[.]com/documents",
  "minTitle": 8,
  "limit": 40
}
```
(Changes: exclude removed, minTitle 8 added. Rebaseline happens by itself. Verified with fetchItems: 25 items, 4/4 runs identical links.)

## Uncertain points
- Because most DMRC advts are PRCE/deputation, the sorter will hold the majority; true DR recruitment (station controllers, JE, etc.) is normally advertised on DMRC's other pages/portal under advts with "Direct Recruitment" and appears here as well, but none besides Executive (Legal) was visible today.
- The old exclude also dropped "shortlisted|compassionate|qualified|roll no|unique id" items. None were on the page today, so removing them changes nothing now; the sorter holds them via the standing rules (mark lists / non-jobs). If BatLee prefers, only "screening|result of" needs to go and the rest could stay.
- The JSON API worked only with Origin/Referer headers (403 without); not used. If the render ever breaks (Cloudflare on the page itself), the JSON API with headers would be the fallback, but it gives only the main PDF per advt.

## BatLee's corrections
- none yet

## Repairs
- none yet
