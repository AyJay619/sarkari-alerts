## BATCH SUMMARY BLOCK
SITE: LIC Careers | VERDICT: FIX
PROPOSED: 1) careers source: replace include filter with rowSelector "#tableID tbody tr" + rowTitle "td:nth-child(3)" (also catches the 5 click-only rows the scanner ignores today); 2) add FREE source lic-aao = AAO/AE 2025 page https://licindia.in/recruitment-of-aao-generalists/-specialists/-assistant-engineers-2025 (selector "main a[href]", exclude forms/annexures/Hindi, limit 80, rebaseline); 3) timeout 15000.
MISSING TODAY: all updates of the AAO/AE 2025 cycle (results, shortlists, call letters, scorecards) live on a sub-page the scanner never opens; 5 of 7 careers rows are click-only (no href) and invisible today.
ASK BATLEE: Add the AAO/AE sub-page as a source? Recommend YES (it is the only place LIC posts results/call letters). Also: LIC posts few jobs a year (ADO, apprentice, HFL are not on this page); recommend no extra pages.

# LIC Careers (audit 2026-10-04, batch mode)
Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Careers list | https://licindia.in/careers | free fetchItems, 4 runs, 35-217 ms, all OK | FREE-OK but incomplete |
| AAO/AE 2025 recruitment page (updates feed) | https://licindia.in/recruitment-of-aao-generalists/-specialists/-assistant-engineers-2025 | free fetch 200, 240 KB | FREE-OK, not watched yet |
| CFO engagement page | https://licindia.in/engagement-of-chief-financial-officer-on-contract-basis | free fetch 200 | FREE-OK (detail page, not needed) |

- www and no-www both work, http redirects to https. Current config (https, no www) is fine. Timeout 15000 ok (site answers fast).
- /web/guest/notices (200) has no recruitment links. Archive of old careers is a POST-click, not needed.

## What the scanner catches vs misses
- Careers page is a Liferay table (#tableID) with 7 rows: Region | Department | Job description. Only rows that hold a real <a href> are caught (2 today). Five rows "Engagement of Chief Financial Officer- on contract basis" are click-only (onclick getCareerValuesByID(id) with a POST), so no link exists: invisible to the scanner. Any new posting added as a click-only row would also be missed. Fix: rowSelector reads the title from every row; click-only rows get the careers page URL as link (title|link key, so a new title is still fresh; the 5 identical CFO titles collapse to one item, acceptable).
- The real activity is on the AAO/AE 2025 page: ~43 useful links (cut-offs, display of marks, medical shortlists 32nd batch, scorecard notice, mains results, call letters, prelim results, notifications). Newest entries are at the top. No dates shown. Today a new result or call letter there is never alerted.
- Posting speed: LIC posts few recruitments a year (the careers list is tiny); the AAO page changes in bursts during a cycle. Flood check: links are stable (/documents/d/guest/<slug>); the "Display of marks" and call-letter links are ibpsonline login links with an appid token, which may change; harmless (one extra alert at most). First run after change rebaselines silently.

## Label pattern
Careers page: free text "Recruitment of <post> <year>" / "Engagement of <post> on contract basis". AAO page: "<TYPE IN CAPS> ... AAO(<stream>)-<batch/year>", e.g. "Result of Mains Examination-AAO(CA)", "LIST OF CANDIDATES SHORTLISTED ... AE(CIVIL)-32ND BATCH". Parent for all: "LIC AAO / AE 2025" (stream and batch are sub-labels; merge streams into one item). Types: Result of ... / Cut-offs / Display of marks / Scorecard = Result; Call letter / Reporting time / Handouts = Admit Card; Notification English = New Job; Notice / Clarification / Reprinting = Update.

## Hold / pass rules for the sorter
- HOLD: "Engagement of Chief Financial Officer on contract basis" (single senior contract post, repeated 6 times; sorter should treat as one item, hold unless BatLee wants it), Hindi duplicate notifications, forms/annexures (Surety, Guarantee bond, Attestation, Bio-data, Medical report format, caste/OBC/EWS/disability certificate formats, appendices, FAQs, centres list, scribe declaration, divisional office address), pre-recruitment medical shortlist is PASS (shortlist), reprinting of application form HOLD.
- PASS: new AAO/AE/ADO/apprentice notifications, prelim/mains/final results, cut-offs, display of marks, scorecard notice, call letters, handouts, corrigenda, medical-exam shortlists, document-verification notices.

## Sample links (audit day, AAO page unless noted)
| Title (short) | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment of AAO Generalists Specialists AE 2025 (careers) | Update hub | AAO/AE 2025 | Pass (hub) |
| Engagement of Chief Financial Officer- on contract basis (careers x6) | New Job | LIC CFO contract | Hold |
| CUT-OFFS FOR AAO GENERALIST-2025 | Result | AAO/AE 2025 | Pass |
| CUT-OFFS FOR AAO (SPECIALIST)-2025 | Result | AAO/AE 2025 | Pass |
| Display of marks AAO/AE-2025 (ibpsonline) | Result | AAO/AE 2025 | Pass |
| LIST OF CANDIDATES SHORTLISTED AFTER PRE RECRUITMENT MEDICAL EXAM AAO(GENERALIST)-32ND BATCH | Result | AAO/AE 2025 | Pass |
| ... same for AAO(CA)/(CS)/(ACTUARIAL)/(LEGAL)/(INSURANCE SPECIALIST)/AE(CIVIL)/AE(ELECTRICAL) | Result | AAO/AE 2025 | Pass (merge) |
| NOTICE REGARDING SCORECARD OF AAO/AE-2025 | Update | AAO/AE 2025 | Pass |
| Download "SURETY FORM" / "GUARANTEE BOND FORMAT" / "ATTESTATION FORM" | Noise | AAO/AE 2025 | Hold |
| NOTICE-12.03.2026 reprinting of application | Update | AAO/AE 2025 | Hold |
| CALL LETTER DOWNLOAD ... AAO 2025 (ibpsonline) | Admit Card | AAO/AE 2025 | Pass |
| Result of Mains Examination-AAO(CA) (and Actuarial, CS, Legal, Insurance Specialist, AE Civil, AE Electrical, Generalists 08.11.2025) | Result | AAO/AE 2025 | Pass (merge) |
| NOTICE REGARDING CLARIFICATION ON ENGLISH LANGUAGE DESCRIPTIVE PAPER | Update | AAO/AE 2025 | Pass |
| DOWNLOAD PHASE-II CALL LETTER / HANDOUTS 08.11.2025 | Admit Card | AAO/AE 2025 | Pass |
| RESULT OF PRELIMINARY EXAM 03.10.2025 & 07.10.2025 (8 streams) | Result | AAO/AE 2025 | Pass (merge) |
| Notification English / Hindi (Generalist, Specialist) | New Job / dup | AAO/AE 2025 | Pass English, Hold Hindi |

## Proposed config (sources.json, NOT applied)
```json
[
  {"id":"lic","name":"LIC Careers","runner":"india","tier":"FREE","level":"central","type":"html",
   "url":"https://licindia.in/careers","rowSelector":"#tableID tbody tr","rowTitle":"td:nth-child(3)","timeoutMs":15000,"limit":20},
  {"id":"lic-aao","name":"LIC AAO/AE 2025 updates","runner":"india","tier":"FREE","level":"central","type":"html",
   "url":"https://licindia.in/recruitment-of-aao-generalists/-specialists/-assistant-engineers-2025",
   "selector":"main a[href]","exclude":"format|bio.?data|surety|guarantee|attestation|appendix|annexure|faq|certificate|hindi|download document|medical report|statement of health",
   "timeoutMs":15000,"limit":80}
]
```
Both change selectors/URL so the scanner rebaselines silently. The lic-aao source is dormant between cycles; if LIC later removes the page it should get allowEmpty.

## Uncertain
- Tested with fetchItems on both configs: careers gives 3 items (1 hub + CFO click-only collapsed + CFO link); AAO page gives 43 items after exclude. Not run through the full monitor.
- The AAO page URL is cycle-specific ("2025"); next year's cycle will have a new page, which should then show up as a new row on /careers (the hub row) and be caught there.
- Other LIC recruitments (ADO, HFL, apprentices) are not listed on /careers today; not checked elsewhere.

## BatLee's corrections
- none yet

## Repairs
- none
