# EXIM Bank Careers (batch audit)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE

## BATCH SUMMARY BLOCK
SITE: EXIM Bank Careers | VERDICT: FIX
PROPOSED: 1. include -> "sites/default/files|/assets/" (page also links PDFs under /assets/ and /themes/custom/exim/pdf/careers/; today's ones are old but a new ad may land there). Rebaseline on first run.
PROPOSED: 2. (optional) timeoutMs 15000.
MISSING TODAY: 3 old Feb-2026 PDFs under /assets/ (DM and MT drive ads, combined result) and 2 old addenda under /themes/... are not caught; nothing current.
ASK BATLEE: none

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Careers (single page, everything) | https://www.eximbankindia.in/careers | free fetchItems, 5/5 runs, 38 items each | FREE-OK |
| Same without www | https://eximbankindia.in/careers | free, 38 items | works too (keep www) |
Hindi page /hi/careers exists (duplicate, skip). No separate results/notice page found on the site menu; results are listed on the careers page.

## Scanner catches vs misses
Catches 38 PDF/docx links, newest first (Sept 2026). Misses links whose href does not contain "sites/default/files" (see /assets/ and /themes/ above). Page is plain HTML, no JS needed. Flood check: link set identical across 5 runs; links are stable (paths include year-month folder). Posting speed: a few ads per quarter, limit 50 is enough (38 now).

## Label pattern
Title is the free text of the link, e.g. "ADVERTISEMENT NO: HRM/ DM/ 2026-27/ 03", "Result: Advertisement No. HRM/OC/ INFRA/2026-27/02", "ADDENDUM: ADV NO. HRM/ MT/2026-27/01 and ...". Parent = advertisement number (HRM/<cadre>/<year>/<n>), cadres: MT management trainee, DM deputy manager, DM & M SRD, OC officer on contract. Type from leading word (ADDENDUM / CORRIGENDUM / Result / LIST OF CANDIDATES SELECTED / LIST OF SHORTLISTED / Syllabus / WRITTEN EXAMINATION). Spacing inside ad numbers is irregular ("HRM/ DM/ 2026-27/ 03"): strip spaces when matching. Combined addenda name two ad numbers.

## Hold / pass rules for the sorter
Hold: Reservation Register for posts, ICC Member for Prevention of Sexual Harassment, consultant/contract-only small roles (e.g. "Recruitment of Business Development Officers on Contract" - hold unless BatLee wants contract jobs; Officers on Contract OC posts look like regular recruitment ads, judge by size), Hindi duplicates, ex-servicemen-only/deputation if any.
Pass: ads (MT, DM, SRD), addenda/corrigenda, written examination notice, syllabus (as update), shortlists for interview, final selected lists (results).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment of Business Development Officers on Contract | New Job (contract) | BDO on Contract 2026 | Hold (contract) - sorter judgement |
| SRD for Backlog Vacancies HRM/DM & M/SRD/2026-27/04 | New Job | Advt HRM/DM&M/SRD/2026-27/04 | Pass |
| Result: Advt HRM/OC/INFRA/2026-27/02 | Result | HRM/OC/INFRA/2026-27/02 | Pass |
| Syllabus for DRD Deputy Managers HRM/DM/2026-27/03 | Update | HRM/DM/2026-27/03 | Pass |
| List of candidates selected as Management Trainees HRM/MT/2025-26/05 | Result | HRM/MT/2025-26/05 | Pass |
| List of candidates selected as OCs HRM/OC/ADMIN/2025-26/08 | Result | HRM/OC/ADMIN/2025-26/08 | Pass |
| List of candidates selected as Deputy Managers HRM/DM/2025-26/06 | Result | HRM/DM/2025-26/06 | Pass |
| Addendum: HRM/MT/2026-27/01 and HRM/DM/2026-27/03 | Update | both ads | Pass |
| Shortlisted for personal interview HRM/DM/2025-26/06 | Result/Update | HRM/DM/2025-26/06 | Pass |
| Advertisement HRM/DM/2026-27/03 | New Job | HRM/DM/2026-27/03 | Pass |
| DRD for Management Trainees HRM/MT/2026-27/01 | New Job | HRM/MT/2026-27/01 | Pass |
| Advt HRM/OC/INFRA/2026-27/02 Officer on Contract Infrastructure | New Job | HRM/OC/INFRA/2026-27/02 | Pass |
| Corrigendum: Adv HRM/OC/ADMIN/2025-26/08 | Update | HRM/OC/ADMIN/2025-26/08 | Pass |
| Addendum: HRM/DM&M/SRD/2025-26/07 | Update | HRM/DM&M/SRD/2025-26/07 | Pass |
| Written Examination HRM/MT/DM/CM/2025-26/01 | Update | HRM/MT/DM/CM/2025-26/01 | Pass |
| Reservation Register for Manager / Deputy Manager / AO | Noise | - | Hold |
| ICC Member for Prevention of Sexual Harassment | Noise | - | Hold |

## Proposed full config
```json
{
  "id": "exim", "name": "EXIM Bank Careers", "runner": "india", "tier": "FREE", "level": "central",
  "type": "html", "url": "https://www.eximbankindia.in/careers",
  "include": "sites/default/files|/assets/",
  "exclude": "cyber|awareness|compassionate|qualified|roll no|unique id",
  "timeoutMs": 15000, "limit": 50
}
```
(Standing rule: no keyword filters for hold items; existing exclude left as is.)

## Uncertain
- Whether "/assets/" links will carry new notices is unknown; adding it is low risk (adds only the 3 old items on rebaseline, which are baselined silently).
- Contract-role hold depends on BatLee's taste; OC (officer on contract) ads are real bank jobs and can be passed.

## BatLee's corrections
- none yet

## Repairs
- none
