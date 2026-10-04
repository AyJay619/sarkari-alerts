## BATCH SUMMARY BLOCK
```
SITE: ONGC (ongcindia.com) | VERDICT: FIX
PROPOSED: 1. Add FREE source "ongc-results" = https://ongcindia.com/web/eng/career/results (selector a.pdf-link, minTitle 15, limit 25, rebaseline); 2. Add FREE source "ongc-apprentice" = https://ongcindia.com/web/eng/career/apprenticeship-opportunities (same selectors, limit 25, rebaseline); 3. Keep "ongc" as is (works, 5/5 runs)
MISSING TODAY: all results / merit lists (/career/results) and apprenticeship shortlists (/career/apprenticeship-opportunities), neither watched
ASK BATLEE: none (note: ~90% of ONGC notices are retired-consultant/contract posts = Hold; page speed 2-21 s so keep 15 s timeout or raise to 30000)
```

# ONGC (ongcindia.com)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitment Notice (current "ongc") | https://ongcindia.com/web/eng/career/recruitment-notice | free fetchItems, no www needed | FREE-OK, 25 items (limit), 5/5 runs identical, 2.2 s typical, one run 21 s, first 6 s |
| Results (NEW, proposed) | https://ongcindia.com/web/eng/career/results | same | FREE-OK, 60 items tested at limit 60 |
| Apprenticeship Opportunities (NEW, proposed) | https://ongcindia.com/web/eng/career/apprenticeship-opportunities | same | FREE-OK, 20 items |

Server-rendered Liferay page, no JS needed. The page HTML holds ~485 `a.pdf-link` anchors (the whole list, paged client-side with "delta=5"); the `?..._cur=2` pagination URL returned the same first items, so page-1 HTML already holds everything and no extra pages are needed. Career menu: Recruitment Notice, Results, Apprenticeship Opportunities, Recruitment Policy (static). Admit cards are external login links (eapplicationonline.com etc.), not notices.

## What the scanner catches vs misses
- Catches the notice list newest first (top 25 of ~485), which is the current notice board: executive posts, consultant ads, corrigenda, apprenticeship corrigenda.
- Misses results / merit lists (separate page) and NAPS/NATS apprentice shortlists and summer-training lists (separate page).
- Posting speed: roughly 2-5 notices a month, far below limit 25. Newest today: Director (Technology & Field Services), Sept 2026.
Link stability (flood check): links are Liferay document URLs with a UUID suffix, stable across 5 runs. State file has them. Note: "ONGC Green CA industrial trainees" is in state but no longer in today's top 25 (was removed or scrolled off); not a flood risk.

## Label pattern
Titles are plain, no "type: parent" prefix. Type is in the first words:
- "Notification for the post of X" / "Advertisement for ..." / "Call for applications ..." = New Job
- "Addendum to ...", "Corrigendum ...", "Date Extension: ..." = Update
- Results page: "Final result for the post of X [Advt. No. n/yyyy]", "Result for ... against Advt. No ...", "List of candidates selected ..." = Result
- Apprentice page: "List of shortlisted candidates for document verification - NAPS & NATS (Advt. No. ONGC/APPR/1/2025 ...)" = Result/Update, "Final Merit List ..." = Result
Parent = the post + asset/unit, or the Advt. No. in the title (e.g. "ONGC/APPR/1/2025", "Advt. No. 6/2025 (R&P)"), which is the best match key.

## Hold / pass rules for the sorter
Hold: any "retired ONGCians / retired officials / retired executives / Domain Experts" posts; "Junior/Associate Consultant", "Mentors for PMIS interns" (contract, retired); Inquiry Officer empanelment; Contract Medical Officer walk-ins unless open to all (judgement); summer-training student lists; "List of students selected for Summer Training".
Pass: Chairman / Director / functional-head notifications (and their addenda), Apprenticeship engagement (NAPS/NATS) ads, corrigenda and result dates, GT recruitment (CBT) results, Final Results for regular / fixed-term posts, apprentice document-verification and merit lists.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Notification for the post of Director (Technology & Field Services), ONGC | New Job | Director TFS ONGC | Pass |
| Engagement of Retired Revenue Officials (Surveyor) as Junior Consultant (LA/ROU) | New Job | Retired Revenue Officials | Hold (retired) |
| Advertisement for engagement of retired ONGCians as Junior/Associate Consultant, PMIS Tripura | New Job | PMIS Tripura | Hold |
| Walk-in Interview for Retired Revenue Officials, Cauvery Asset | New Job | RRO Cauvery | Hold |
| Addendum to the Notification for the post of Chairman - ONGC | Update | Chairman ONGC | Pass |
| Notification for the post of Chairman - ONGC, a schedule 'A' CPSE | New Job | Chairman ONGC | Pass |
| Advertisement for Junior/Associate Consultants, Well Services Ahmedabad | New Job | Well Services Ahmedabad | Hold (consultant) |
| Advertisement for engagement of Mentors for PMIS Interns 2026-27, Assam | New Job | PMIS Assam | Hold |
| Empanelment of retired officers as Inquiry Officers | New Job | Inquiry Officers | Hold |
| Call for applications for 5 vacant positions, ONGC Energy Centre | New Job | ONGC Energy Centre | Pass (check) |
| Corrigendum to Advt. No. ONGC/APPR/1/2025: Delay in Result due to technical issues | Update | Advt ONGC/APPR/1/2025 | Pass |
| Corrigendum regarding additional vacancies under Apprenticeship FY26-27 | Update | Advt ONGC/APPR/1/2025 | Pass |
| Corrigendum to Advt. ONGC/APPR/1/2025: Updated Result Dates for NAPS & NATS | Update | Advt ONGC/APPR/1/2025 | Pass |
| Final Result for Contract Medical Officer against Advt. No. 6/2025 | Result | Advt 6/2025 CMO | Pass (judgement) |
| Result for GT Recruitment in Engineering & Geoscience via CBT, Advt. No 1/2025 | Result | Advt 1/2025 GT | Pass |
| Result for Senior Vice President-Marine Operations (fixed term) | Result | SVP Marine Ops | Pass |
| Final Merit list of shortlisted candidates under NATS (Advt. ONGC/APPR/1/2025) | Result | Advt ONGC/APPR/1/2025 | Pass |
| List of students selected for Summer Training at ONGC Assam Asset | Result | Summer Training Assam | Hold |

## Proposed config (JSON)
```json
{ "id": "ongc", "...": "unchanged" },
{ "id": "ongc-results", "name": "ONGC Results", "runner": "india", "tier": "FREE", "level": "central", "type": "html",
  "url": "https://ongcindia.com/web/eng/career/results", "selector": "a.pdf-link", "minTitle": 15, "limit": 25 },
{ "id": "ongc-apprentice", "name": "ONGC Apprenticeship", "runner": "india", "tier": "FREE", "level": "central", "type": "html",
  "url": "https://ongcindia.com/web/eng/career/apprenticeship-opportunities", "selector": "a.pdf-link", "minTitle": 15, "limit": 25 }
```

## Uncertain points
- Response time varies (2 s typical, 6 s and 21 s seen); if the default timeout is shorter than ~25 s an occasional failure is possible and the retry should cover it. Optionally add "timeoutMs": 30000.
- Pagination: the 2nd-page URL returns the same first items; assumed the full list is in page 1 HTML.
- Whether a Contract Medical Officer or "Energy Centre" call counts as a pass is an editorial judgement.

## BatLee's corrections
- none yet

## Repairs
- none
