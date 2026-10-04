## BATCH SUMMARY BLOCK
SITE: Konkan Railway (KRCL) | VERDICT: FIX
PROPOSED: 1) konkan: drop `render`, add `legacyTls:true`, timeoutMs 15000 (free fetch 1.5s vs 4.5s browser; site needs legacy TLS renegotiation) 2) konkan exclude: remove `shortlisted|panel` (selection/panel PDFs are results; sorter holds contract-post ones) 3) add FREE source konkan-archive https://konkanrailway.com/en/archive_notification (legacyTls, same include/exclude) - catches corrigenda/registration-link notices that move off the current page between scans
MISSING TODAY: "Selection for the post of Nurse ... NursePAnel.pdf" (blocked by exclude `panel`); archive-only items (e.g. Intimation of Registration/Online Application Link for CO/P-R/02/2026, Corrigendum to 18C/2026)
ASK BATLEE: none (note: KRCL posts are mostly contract / re-employment / deputation = HOLD; only the "Employment Notification CO/P-R/0x" family is a real job)

# Konkan Railway (KRCL)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (proposal, not applied)

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Current Notifications (main) | https://konkanrailway.com/en/current_notification | free, legacyTls:true, no render (1.4-1.7s, 3/3 runs OK) | FREE-OK |
| same, no legacyTls | same | fails: ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED | needs legacyTls |
| same, http | http://konkanrailway.com/... | timeout 15s | FAILED |
| www | https://www.konkanrailway.com/... | DNS not found | FAILED |
| Archive Notifications | https://konkanrailway.com/en/archive_notification | free, legacyTls | FREE-OK (25 file links) |
| Engagement on contract | /en/pages/viewpage/Engagement_on_contract | free | no notices, only static links - not useful |

Current config (render:true, Chromium) also works (6 items, 4.5s) but is needlessly heavy; legacyTls gives the identical 6 items for free.

## What the scanner catches vs misses
Current include/exclude gives 6 items (all real notices). Page has 7 notice PDFs; the missed one is the Nurse selection panel (exclude `panel` matches the filename NursePAnel). Page is plain server HTML: no JS needed. Full page has about 90 links (menu, RTI, freight etc.), so include/exclude is needed; the notice block sits at the end of the page.

## Posting speed / flood check
Links are stable: /sites/default/files/YYYY-MM/<name>.pdf, same URLs across runs and already in state. Notices list is short (7 on current, rest move to archive). No flood risk seen. Dates not shown on the page; month folder in the link gives month.

## Label pattern
Titles are free text, no type prefix. Rules:
- "Notification No CO/P-R/<n>C/<yr> dated <d> for the post of X ... on contract basis" = contract job (HOLD)
- "Vacancy Notice ... on Re-employment basis" / "on Deputation basis" = HOLD
- "Employment Notification No. CO/P-R/02/2026 dated 31/07/2026" = real job (PASS), parent = "KRCL Employment Notification CO/P-R/02/2026"
- Parent = the "Notification No. CO/P-R/..." number quoted in the title (Addendum, Intimation/CBT schedule, Corrigendum, "Selection for the post of X against Notification ...").

## Hold / pass rules (for sorter)
HOLD: contract-basis posts (CO/P-R/NNC/...), re-employment, deputation, "Selection for the post of X on contract basis" panels, Consolidate Instructions / recruitment policy, RTI, freight, board of directors, org chart, website policy.
PASS: Employment Notification CO/P-R/02/2026 and its addenda, CBT schedule, registration / application link intimations, corrigenda, any regular-basis (Jr. Scale Executives CO/P-R/01/2026) selection process, postponement, syllabus notices; selection results for regular posts.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Notification No CO/P-R/19C/2026 ... Junior Technical Assistant Mechanical, contract | New Job | CO/P-R/19C/2026 | HOLD (contract) |
| Vacancy Notice CO/P/E/RE-07/2026 AEE re-employment | New Job | CO/P/E/RE-07/2026 | HOLD |
| Notification Asst Loco Pilot / Sr ALP on Deputation | New Job | ALP deputation 01/2026 | HOLD |
| Vacancy Notice APWS re-employment | New Job | APWS re-employment | HOLD |
| Addendum to marks, clause 14.7, Employment Notification CO/P-R/02/2026 | Update | CO/P-R/02/2026 | PASS |
| Intimation regarding schedule of CBT, CO/P-R/02/2026 | Update | CO/P-R/02/2026 | PASS |
| Selection for post of Nurse on contract basis against 18C/2026 | Result | CO/P-R/18C/2026 | HOLD (contract) |
| Corrigendum to Notification CO/P-R/18C/2026 (archive) | Update | CO/P-R/18C/2026 | HOLD (contract) |
| Intimation of Registration and Online Application Link, CO/P-R/02/2026 (archive) | Update | CO/P-R/02/2026 | PASS |
| Selection for post of Section Officer / Sr Technician / Cook etc. on contract (archive) | Result | 14C/15C/2026 | HOLD |
| Employment Notification for various categories posts in KRCL (2026-07, in state) | New Job | CO/P-R/02/2026 | PASS |
| Postponement of selection process, Jr. Scale Executives CO/P-R/01/2026 (in state) | Update | CO/P-R/01/2026 | PASS |

## Proposed config
```json
[
 {
  "id": "konkan",
  "name": "Konkan Railway Notifications",
  "runner": "india", "tier": "FREE", "level": "central", "type": "html",
  "url": "https://konkanrailway.com/en/current_notification",
  "legacyTls": true,
  "timeoutMs": 15000,
  "include": "(vacanc|notification|recruit|post of|engage|employment|selection|corrigendum|intimation|addendum).*sites/default/files|sites/default/files.*(vacanc|notification|recruit)",
  "exclude": "RTI|Freight|IRCTC|Consolidate|policy|compassionate|qualified|roll no|unique id|BOD|OrgChart|MCA|Coffee|KR-Mirror",
  "limit": 40
 },
 {
  "id": "konkan-archive",
  "name": "Konkan Railway Archive Notifications",
  "runner": "india", "tier": "FREE", "level": "central", "type": "html",
  "url": "https://konkanrailway.com/en/archive_notification",
  "legacyTls": true,
  "timeoutMs": 15000,
  "include": "(vacanc|notification|recruit|post of|engage|employment|selection|corrigendum|intimation|addendum).*sites/default/files|sites/default/files.*(vacanc|notification|recruit|corrigendum|inmation)",
  "exclude": "RTI|Freight|IRCTC|Consolidate|policy|compassionate|qualified|roll no|unique id|BOD|OrgChart|MCA|Coffee|KR-Mirror",
  "limit": 40
 }
]
```
Changed URL/selector options trigger a silent rebaseline. Note: the proposed include was not re-run as a whole; the current include was tested (6 items) and the unfiltered pages were reviewed manually. The archive filename "INMATION_LINK_CLOSING_DT_0.pdf" has a typo (INMATION) and relies on the title word "Intimation" matching.

## Uncertain
- Exact new include regex untested end to end (config not changed per batch rules); verify after approval with one test scan.
- Archive page order/size could grow; limit 40 is fine.
- Dates are not shown on the page.

## BatLee's corrections
- none yet

## Repairs
- none
