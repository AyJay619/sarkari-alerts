# PSSSB (Punjab Subordinate Services Selection Board)

## BATCH SUMMARY BLOCK
SITE: PSSSB | VERDICT: FIX (works today; render is unnecessary)
PROPOSED: 1) drop "render" and "waitFor" (static fetch with legacyTls returns all 63 upload links in ~0.4 s, 5/5 runs; browser render is slower and a failure risk). 2) limit 40 -> 60 (page holds ~63 links, ~40 posted in Sept alone). 3) add 3 FREE sources, selector "a", include "wp-content/uploads", allowEmpty: vacancy-group-b / -c / -d pages (https://sssb.punjab.gov.in/vacancy-group-b/ etc, 15/5/1 advert links; backup for new advts). 4) timeoutMs 15000.
MISSING TODAY: nothing found on the home list (all 40 newest links caught); /circulars/ returns no notices (empty, skip).
ASK BATLEE: none (optional: keep render as-is if you prefer not to touch a working source; recommendation is still to drop it).

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Home (latest notices list, ul.listing) | https://sssb.punjab.gov.in/ | free, legacyTls; static HTML works without render | FREE-OK (current config uses render; 3/3 runs gave 40 items) |
| Group B advts | https://sssb.punjab.gov.in/vacancy-group-b/ | free, legacyTls, selector a | FREE-OK, 15 links |
| Group C advts | https://sssb.punjab.gov.in/vacancy-group-c/ | same | FREE-OK, 5 links |
| Group D advts | https://sssb.punjab.gov.in/vacancy-group-d/ | same | FREE-OK, 1 link |
| Circulars | https://sssb.punjab.gov.in/circulars/ | free | no notices found (empty), not useful |
| Previous results/advts (till Aug 2025) | /previous-results/, /previous-advertisements/ | not tested | archive, not needed |

Site only works over https (as configured); legacyTls is required (old TLS renegotiation). No ScrapFly needed; cost 0.

## What the scanner catches
Home list: 40 of ~63 upload links; all dated 2026/09 (newest first). Posting speed is about 40 notices a month, so limit 40 is thin on a busy week; 60 is safer. Links are stable PDF URLs under wp-content/uploads/YYYY/MM/ (no flood sign; some titles repeat with different PDFs, e.g. several "Corrigendum Regarding Advt No 7 of 2026" and two identical "Public Notice regarding Correction Portal ... Advt 07" titles with different links; the link is the identity, so fine).

## Label pattern
Titles are free text, no type prefix. Type is a keyword in the title: "Advertisement No. N of YYYY for the post(s) of ..." = New Job; "Result / Provisional Result / Common Merit List / Supplementary Result" = Result; "Corrigendum / Public Notice / Counselling / Scribe / Correction Portal" = Update or Noise. Parent = "Advt No N of YYYY" (variants: "Advt. No. 7 of 2026", "Advertisement 03 of 2026", "07/2023", "No. 08/2025"). Normalise to "Advt N/YYYY". Some titles carry no advt number (e.g. "Schedule of written examination for various post", "Preferences of department ... Stenotypist Advt 14 of 2025" does). PDF filenames often have it too (Advt-No-7-of-2026-JE).

## Hold rules (site-specific, for the sorter)
- Hold: scribe notices, "Schedule of written examination" general notices, public notices about High Court CWP orders, correction-portal-only notices unless they extend a live application date (pass if they reopen/extend applying), "Preferences of department" (post-selection), counselling for absentees / counselling schedules for already-selected candidates (post-result stage: standing rule says pass document verification and interview schedules; counselling is the same stage, so pass but low priority), Hindi/Punjabi duplicates.
- Pass: Advertisements, Results (written, shorthand, CML, supplementary), corrigenda / increase in posts / extensions, admit-card style notices, counselling / verification schedules for current cycle.

## Sample links (audit day, 2026-10-04)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Supplementary Result for JE (Civil) Advt No 16 of 2025 | Result | Advt 16/2025 | Pass |
| Scribe notice, JE Advt No 07 of 2026 | Noise | Advt 07/2026 | Hold |
| Result of written test 26.07.2026 Warder and Matron Advt 08 of 2026 | Result | Advt 08/2026 | Pass |
| Advertisement No. 13 of 2026 Head Draftsman, Law Officer, Legal Assistant, Accountant | New Job | Advt 13/2026 | Pass |
| Preferences of department, Stenotypist Advt 14 of 2025 | Update | Advt 14/2025 | Hold |
| Counselling Notice, Librarian Advt 13 of 2025 on 30.09.2026 | Update | Advt 13/2025 | Pass |
| Advertisement No. 12 of 2026 Driver, Clerk (Legal/Accounts/IT), Translator, Field Artist | New Job | Advt 12/2026 | Pass |
| Corrigendum Advt 05/2026 Stenotypist | Update | Advt 05/2026 | Pass |
| Supplementary Result-cum-CML Inspector Audit Advt 01/2025 | Result | Advt 01/2025 | Pass |
| Result of Shorthand Test, Junior Scale Stenographer Advt 07/2023 | Result | Advt 07/2023 | Pass |
| Regarding Correction Portal Group-D Advt 04 of 2026 | Update | Advt 04/2026 | Pass if dates extend, else Hold |
| Scribe notice Clerk Advt 02 of 2026 | Noise | Advt 02/2026 | Hold |
| Public Notice, CWP No. 3769 of 2026 (Advt 08 of 2024) | Noise | Advt 08/2024 | Hold |
| Schedule of written examination for various post | Update | various | Pass (exam dates) |
| Corrigendum increase in posts and extension, Group-D Advt 04 of 2026 | Update | Advt 04/2026 | Pass |
| Corrigendum for Assistant District Attorney Advt 09 of 2026 | Update | Advt 09/2026 | Pass |
| Provisional Result/CML Clerk I.T. Advt 11/2025 | Result | Advt 11/2025 | Pass |

## Proposed config (JSON, not applied)
```json
{ "id": "pssb", "name": "PSSSB", "runner": "india", "tier": "FREE", "level": "state", "type": "html",
  "url": "https://sssb.punjab.gov.in/", "legacyTls": true, "selector": "ul.listing li a",
  "include": "wp-content/uploads", "minTitle": 15, "limit": 60, "timeoutMs": 15000 }
```
Plus three sources (ids pssb-b, pssb-c, pssb-d), same options but url vacancy-group-b/-c/-d, selector "a", allowEmpty true, limit 30. Rebaseline happens automatically.

## Uncertain
- Whether render was added for a reason I cannot see (git log only says "ScrapFly fallback" for downloads). Static HTML contained the list on 5/5 runs today, so render looks unnecessary. If the site later hides the list behind JS, restore render + waitFor.
- Counselling notices: kept as Pass per the document-verification rule; BatLee may prefer Hold.

## BatLee's corrections
- none yet

## Repairs
- none
