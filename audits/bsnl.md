## BATCH SUMMARY BLOCK
SITE: BSNL (bsnl) | VERDICT: FIX (minor)
PROPOSED: 1) add "allowEmpty": true to source bsnl (page shows 0 open vacancies between campaigns; empty list is normal). Nothing else.
MISSING TODAY: nothing found for open jobs (active campaign cards are plain anchors). The archived table (17 closed campaigns) lives only in embedded page data, not anchors; the scanner never sees it, which is fine (all closed).
ASK BATLEE: none

# BSNL Jobs (audit 2026-10-04)
Group: FREE | Status: ACTIVE (batch audit, not yet applied)

## Pages watched and tested
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Careers (current source) | https://www.bsnl.co.in/opencms/bsnl/BSNL/about_us/hrd/jobs.html | free, 3/3 runs ok, 200-700 ms | FREE-OK. Redirects (server side, curl follows) to https://bsnl.co.in/career/ ; the old opencms path still works and so do hrd/recruitment.html and hrd/career.html (all same page). |
| Careers (new canonical) | https://bsnl.co.in/career/ (also www, http) | free, ok | FREE-OK, identical page. Sitemap lists /career and /hrd only. |
| Detail page of an opening | /careers/Notification_Empanelment_Advocates_LawFirms_UP(W) | 404 | Template placeholder, ignore (include filter "documents/career" drops it). |

No JSON/API found (/api/careers, /api/jobs 404). No other results / admit card / exam pages exist on BSNL's site for recruitment (investors/notice pages are not jobs). PDFs download free (200, application/pdf, 4 MB).

## What the scanner catches vs misses
Page is a Next.js site. The hero shows the ACTIVE campaign(s) as normal anchors ("official notice" button) -> scanner catches these. Today: 1 item, Empanelment of Arbitrators (Adv 27.08.26, PDF Adv_Empanelment_Arbitrator_270826.pdf), 4 weeks from publication.
The "archived campaigns" table (17 rows, all closed, newest 30.07.2026) is only in embedded JSON, not anchors: not seen, no loss. If an active campaign is ever shown only in that data, it would be missed; this cannot be tested until BSNL posts a new one (uncertain).
render:true tested (Chromium): same 1 item, 9.9 s, no gain. Not needed.
Flood check: 1 stable link, no churn across 3 runs. State already baselined (1 seen).
Posting speed vs limit: limit 30, page has 1-2 active items; fine.

## Label pattern
Titles come from file names (titleFromHref): Adv_Empanelment_Arbitrator_270826.pdf -> "Adv Empanelment Arbitrator 270826". The trailing 6 digits are DDMMYY of the PDF date (27 Aug 2026). Page text is Hindi (English toggle exists but the scanner reads Hindi), so the sorter should open the PDF to get the real parent (post name / advert). Parent = post named in the PDF (e.g. "Director (HR)", "Company Secretary", "JTO direct recruitment").

## Hold / pass rules for the sorter (this site)
- HOLD: arbitrator / advocate / law-firm empanelment, consultants, young professionals (YP) / young legal professionals, contract GMs, retired SAG officers, deputation-based Director / CMD posts (PESB-selected, "Schedule A CPSE" - Board-level posts via PESB, not mass jobs; hold unless BatLee wants them), tenders.
- PASS: JTO / SET / management-trainee direct recruitment, apprentices, any exam notification, admit card, result, corrigendum or date extension for those.
- BSNL's large JTO/SET recruitments historically go through exam notifications; those would appear as new PDFs under documents/career/.

## Sample links (from page data, audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Adv_Empanelment_Arbitrator_270826 (active) | New Job | Empanelment of Arbitrators, BSNL HQ | HOLD (retired/empanelment) |
| Advocates_Law_firms_280726 | New Job | Panel of Advocates/Law firms | HOLD |
| Director_HR_210726 | New Job | Director (HR) | HOLD (PESB board post) |
| Company_Secretary_280726 | New Job | Company Secretary | PASS (regular direct recruitment; BatLee to confirm if single-post ok) |
| Young_Professionals_notification_07072026 | New Job | Young Professionals | HOLD |
| GM_Telecom_Notification_17072026 | New Job | GM Telecom contract | HOLD |
| CMD062026 | New Job | CMD (Schedule A CPSE) | HOLD |
| Exam_notification_DR_JTO | New Job | JTO (Telecom) direct recruitment | PASS (closed 03.07.2026) |
| Appl_for_GMs_Finance_Accounts | New Job | GM Finance & Accounts contract | HOLD |
| SET_Notification_29012026 | New Job | Senior Executive Trainee (Telecom & Finance) | PASS (closed 30.04.2026) |
(only the first is visible to the scanner; the rest are archived/closed)

## Proposed config
```json
{
  "id": "bsnl",
  "name": "BSNL Jobs",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.bsnl.co.in/opencms/bsnl/BSNL/about_us/hrd/jobs.html",
  "include": "documents/career",
  "titleFromHref": true,
  "exclude": "compassionate|qualified|roll no|unique id",
  "minTitle": 6,
  "limit": 30,
  "allowEmpty": true
}
```
Optional (not required): switch url to https://bsnl.co.in/career/ since the old path redirects; would trigger a rebaseline. Recommendation: leave as is while it works.

## Uncertain
- Whether a future active campaign always appears as a hero anchor (assumed; today's arbitrator card does).
- If a PDF is posted for an exam (JTO/SET) it may only be reachable as an anchor once marked active; unverifiable today.

## BatLee's corrections
- none yet

## Repairs
- none
