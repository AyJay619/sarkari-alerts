# GIC Re (General Insurance Corporation of India)
Audited: 2026-10-04 (BATCH mode) | Group: FREE | Status: proposal pending BatLee

## BATCH SUMMARY BLOCK
SITE: GIC Re Careers | VERDICT: FIX
PROPOSED: 1) url -> https://www.gicre.in/en/people-resources/career-en (the real Careers page; current url id=304 is only the Home page) 2) keep old Home URL as extraUrls (What's New often lists new ads first) 3) include -> recruit|vacanc|engage|appoint|advertis|result|shortlist|cut-?off|interview|schedule|corrigendum|addendum|call letter|admit|walk-in 4) exclude -> RFP|proposal|EOI|reinsurer|tender|GeM|pre-bid|consultant|magazine|kshitij|newsletter|compassionate|qualified|roll no|unique id, limit 60; rebaseline on first run
MISSING TODAY: Company Secretary (CS) contract ad (2025) and the 2025 AM written-exam result / schedule PDFs on the Careers page are not caught from Home; Home catch also lets tender noise through (consultant stress-test, GeM tenders)
ASK BATLEE: none (all contract roles like CMR / CS / CISO pass as jobs; sorter holds consultant/tender items)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Home (current source) | https://www.gicre.in/en/?option=com_content&view=article&id=304 | free fetch, ~250-500 ms, 5/5 runs OK, 42 items | FREE-OK, but it is the Home page (title "Home"), not careers |
| Careers (proposed main) | https://www.gicre.in/en/people-resources/career-en | free fetch OK (also works without www), 101 KB, all recruitment history | FREE-OK |
| Tenders and Notices | https://www.gicre.in/en/tenders-and-notices | free fetch OK | Not wanted (tenders / EOI), not proposed |
http variant of Home also returns Home. https works fine; no timeout problems, timeoutMs 15000 is plenty. Group: FREE, 0 credits.

## ScrapFly
Not needed. PDFs on gicre.in are plain links (same host); not tested for download since page links are enough.

## Scanner catch vs miss
- Today's Home catch: 42 items with the current filter, stable across 5 runs (flood check OK, same 42 each time).
- Home shows a "What's New" block (newest ads at the top) mixed with menu links; the filter works but lets "Appointment of Consultant ... stress testing" corrigendum, pre-bid queries, GeM tenders and Cafeteria/Internal Auditor tender corrigenda through (they match "appoint"/"corrigendum").
- Careers page lists 91 PDF/links with .pdf include test; most are old Kshitij magazines (exclude) and old 2019/2021/2024 AM recruitment history. Newest items first (CMR Apr 2026, CMR Jul 2025, Actuarial Apprentices Nov 2025, CISO Nov 2025, CS 2025, AM 2025 results). Posting speed: GIC Re posts few jobs a year; no limit problem.
- Link stability: Careers page links use a /people-resources/images/... path variant while Home uses /images/...: the same PDF can appear with two different link forms (seen check does not unify these). Expect one-time duplicates after the switch; rebaseline covers the first run. Duplicates later are merged by the sorter.

## Label pattern
Titles are "<Action> of <Post/Exam> | <Detail> (File Size - nnn KB)". Strip the file-size suffix. Parent examples: "Assistant Managers (Scale I) 2024-25 recruitment", "CMR (Chief Medical Referee) Apr 2026", "CISO Nov 2025", "Company Secretary (contract) 2025", "Actuarial Apprentices Nov 2025". Type comes from the detail after "|": Detailed Advertisement = New Job; Result / Declaration of Result / Final Cut-Off / Shortlisted = Result; Call Letter / Information Handout = Admit Card; Corrigendum / Addendum / Schedule for GD & Interview / Pre-Recruitment Training notice = Update; FAQ / Registration Link = Noise (registration link only if tied to a fresh ad).

## Hold / pass rules for the sorter
- HOLD: tenders, GeM bids, RFP / EOI to reinsurers, pre-bid queries, consultant stress-test appointments, canteen / service-provider appointments, internal auditor tenders, Kshitij magazines / newsletters / press releases, committees, policies, Hindi duplicates (Hindi Information Handout, Hindi training notice), "Marks of candidates who appeared for Personal Interview" (marks only), FAQs, training portal link.
- PASS: Detailed advertisements (AM, CMR, CISO, CS, Actuarial Apprentices), results / shortlists / final cut-off, call letters, corrigenda / addenda, GD and interview schedules for the current cycle.
- Contract posts (CMR, CS, CISO) are real recruitments by GIC Re, not "small consultant roles"; pass them. Old 2019-2024 history rows are stale (hold if they ever resurface).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment of CMR (on Contract Basis) \| Apr 2026 | New Job | CMR Apr 2026 | Pass |
| Appointment of Actuarial Apprentices - Nov 2025 | New Job | Actuarial Apprentices Nov 2025 | Pass |
| Appointment of CISO - NOV 2025 | New Job | CISO Nov 2025 | Pass |
| Appointment of Company Secretary (CS) \| Detailed Advertisement | New Job | CS 2025 | Pass |
| Appointment of Chief Medical Referee \| Detailed Advertisement | New Job | CMR Jul 2025 | Pass |
| AM \| Declaration of Result of GD & Interview | Result | AM recruitment | Pass |
| AM \| Final Cut-Off Marks (Pre-Employment Medical) | Result | AM recruitment | Pass |
| AM \| List of Candidates Shortlisted for GD & Interview | Result | AM recruitment | Pass |
| AM \| Shortlisted for 1st Level Online Interview, Medical Stream | Result | AM recruitment | Pass |
| AM \| Schedule for GD & Interview | Update | AM recruitment | Pass |
| AM \| Download of Call Letter for Written Examination | Admit Card | AM recruitment | Pass |
| AM \| Corrigendum | Update | AM recruitment | Pass |
| AM \| Written Examination Information Handout (Hindi) | Admit Card | AM recruitment | Hold (Hindi duplicate) |
| AM \| Marks of candidates for Personal Interview and GD | Noise | AM recruitment | Hold |
| AM \| Frequently Asked Questions | Noise | AM recruitment | Hold |
| Corrigendum - Appointment of Consultant for stress testing | Noise | tender | Hold |
| GeM Tender - Appointment of PMC for GIC HO premises | Noise | tender | Hold |
| Kshitij Magazine June 2026 | Noise | magazine | Hold |

## Proposed config
```json
{
  "id": "gic-re",
  "name": "GIC Re Careers",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.gicre.in/en/people-resources/career-en",
  "extraUrls": ["https://www.gicre.in/en/?option=com_content&view=article&id=304"],
  "include": "recruit|vacanc|engage|appoint|advertis|result|shortlist|cut-?off|interview|schedule|corrigendum|addendum|call letter|admit|walk-in",
  "exclude": "RFP|proposal|EOI|reinsurer|tender|GeM|pre-bid|consultant|magazine|kshitij|newsletter|compassionate|qualified|roll no|unique id",
  "timeoutMs": 15000,
  "limit": 60
}
```
Note: the include/exclude regex above were reasoned from the unfiltered link list but the exact combined result was only tested for the Careers URL with a looser include (91 hits, mostly magazines); the final exclude list removes those. Untested as a combined run.

## Uncertain
- Whether extraUrls with a different path form causes duplicate link forms (see stability note); harmless duplicates only.
- exclude "consultant" and "tender" could hide a rare real ad that mentions them; low risk, GIC Re contract ads use "Appointment of <post>".
- "Registration Link" rows point to ibps / gicofindia portals (external); not individually classified.

## BatLee's corrections
- none yet

## Repairs
- none
