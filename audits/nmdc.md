## BATCH SUMMARY BLOCK
```
SITE: NMDC Careers (nmdc.co.in) | VERDICT: FIX
PROPOSED: 1. In source "nmdc" add selector "app-careers a" and change include to "Career_Documents|Media_Gallery" (keep render true, exclude, minTitle 15, limit 40); rebaseline (automatic)
MISSING TODAY: all follow-up notices on the page (CBT notice, shortlists, selected list for Notification 02/2026 of 22 Sep 2026) because they are filed under Media_Gallery, not Career_Documents: 4 of 10 PDFs missed today
ASK BATLEE: none
```

# NMDC Careers (nmdc.co.in)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Careers (current "nmdc") | https://www.nmdc.co.in/careers | free fetch with render:true (pinned Chromium), 2.5-4.2 s, 3/3 runs identical | FREE-OK (JS-only page, rendered locally, no ScrapFly) |

Host: www is the right one (non-www answers 301 to www; plain http does not connect). The raw HTML is an Angular shell (about 3 KB, `<app-root>`), so render is required. The data comes from `cms-admin/api/` with an ApiKey header set in the site's JS; not used (rendering works free, and the key is not ours to copy). PDFs download free (HTTP 200, 1.5 MB, plain request). Only one relevant page exists in the menu (Careers); no separate results/admit card pages. Tenders go to nmdcportals (ignore).

## What the scanner catches vs misses
- Current config (include "Career_Documents") catches the 6 main PDFs: employment notifications, walk-in, admission notice, PESB advert, "provisionally selected" list for 04/2026.
- Misses: the page lists follow-up notices of each recruitment (CBT notice, shortlisted for skill test, shortlisted for interview, selected list for 02/2026 dated 22 Sep 2026) under `Upload/Media_Gallery/`. These are 4 real recruitment items not caught.
- The page-wide link list also contains about 150 nav/footer links (some Media_Gallery brochures: "How To Buy Iron Ore", "Product Brochure"). So Media_Gallery must be combined with selector `app-careers a`, which limits to the page body. Tested: 10 PDF items, 3/3 runs identical.
- formflix.com apply / call-letter links are shared by several rows with generic titles ("Click here to apply"); not taken (the PDF in the same row has the real title).
Posting speed: single page, newest items on top; page holds only about 10 PDFs, limit 40 never reached. Newest item 22 Sep 2026. NMDC posts about 1-2 recruitments a month.
Link stability (flood check): PDF URLs are static hash+timestamp names, identical across runs. No flood risk. Note one URL uses uppercase `CMS-ADMIN` (the include is case-insensitive, matched fine).

## Label pattern
Titles are the notice itself, no "type: parent" prefix.
- New job: "Employment Notification No. NN/2026 dated DD.MM.YYYY - Recruitment of <posts> for <unit>" (Advt no. NN/2026 in title).
- Follow-ups: "List of candidates provisionally selected against employment notification no NN/2026" = Result (parent Notification NN/2026); "List of Provisionally shortlisted candidates for Supervisory Skill Test" / "...shortlisted for interview" = Result/shortlist; "Notice for conducting Computer Based Test (CBT)" = Update/admit-card type (no notification number; parent is the Junior Officer Trainee recruitment inferred from the nmdcjot link, so the sorter should open the PDF).
- Parent for matching = "NMDC Employment Notification NN/2026" (or post/unit for walk-ins).

## Hold / pass rules for the sorter
Hold: "Advertisement of PESB for the post of Director (Finance), SAIL" (another PSU's board-level advert, not an NMDC job); "Notification for admission in NMDC DAV Polytechnic" (school admission, not a job); MD & CEO of ICVL Mozambique (board-level / deputation-type, judgement call, see uncertain); consultant, retired, deputation notices; Hindi duplicates.
Pass: Employment Notifications for regular executive / non-executive posts (e.g. 02/2026 Tokisud North Coal Mines), walk-in for doctors at Apollo Central Hospital Bacheli (open job, contract-type but a real vacancy, judgement call), shortlists, selected lists, CBT / call letter notices, corrigenda.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Walk-in Interview for Doctors by NMDC Apollo Central Hospital, Bacheli | New Job | Doctors walk-in, Bacheli | Pass (judgement) |
| Employment Notification for post of MD & CEO, ICVL, Mozambique | New Job | MD & CEO ICVL | Hold (board-level) |
| List of candidates provisionally selected against employment notification no 04/2026 | Result | Notification 04/2026 | Pass |
| Notification for admission in NMDC DAV Polytechnic, Jawanga | Noise | school admission | Hold |
| Advertisement of PESB for Director (Finance), SAIL | Noise | PESB / SAIL | Hold |
| Notice for conducting Computer Based Test (CBT) | Update | JOT recruitment | Pass (NEW, Media_Gallery) |
| List of Provisionally shortlisted candidates for Supervisory Skill Test | Result | JOT recruitment | Pass (NEW) |
| Employment Notification No. 02/2026 - Regular Executive Posts, Tokisud North Coal Mines | New Job | Notification 02/2026 | Pass |
| List of candidates provisionally shortlisted for interview | Result | Notification 02/2026 | Pass (NEW) |
| List of candidates provisionally selected against employment notification no 02/2026 | Result | Notification 02/2026 | Pass (NEW, 22 Sep 2026) |

## Proposed config
```json
{
  "id": "nmdc",
  "name": "NMDC Careers",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.nmdc.co.in/careers",
  "render": true,
  "selector": "app-careers a",
  "include": "Career_Documents|Media_Gallery",
  "exclude": "compassionate|qualified|roll no|unique id",
  "minTitle": 15,
  "limit": 40
}
```
Tested with fetchItems: 10 items, 3/3 runs identical. Since the selector changes, the scanner rebaselines on its own (the 4 new items will not alert on first run). Note: the standing rule says no keyword filters in the script; the existing exclude is already in the config, left as it is.

## Uncertain
- Whether the walk-in for doctors and the MD & CEO ICVL post should pass; both flagged as judgement calls for the sorter.
- The `app-careers` tag is the Angular component name taken from the site's JS bundle; a site redesign could rename it (the source would then return 0 items and the scanner's failure warning would show).

## BatLee's corrections
- none yet

## Repairs
- none yet
