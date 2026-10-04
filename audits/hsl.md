## BATCH SUMMARY BLOCK
SITE: Hindustan Shipyard Careers (hsl) | VERDICT: FIX
PROPOSED: 1. Source needs allowEmpty-style tolerance or the existing end-of-group retry (first cold render failed 1 of 4 test starts with "no notices found"; 11 of 11 later runs gave 60 items) - keep retry, no config change needed. 2. Drop "Interview Results|shortlisted" from exclude (rules say results/shortlists PASS; sorter can hold). Everything else unchanged.
MISSING TODAY: nothing found on the page itself; "Interview Results" (plural) titles and shortlisted lists are dropped by the exclude.
ASK BATLEE: none

# Hindustan Shipyard (HSL) - batch audit 2026-10-04
Group: FREE (local pinned Chromium render, no ScrapFly)

## Pages watched
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Careers | https://hslvizag.in/en/careers | render:true (Blazor app; raw HTML is a 6.8 KB shell with no links) | FREE-OK, ~1.5-2 s, 60 items (hits limit 60) |
| PDFs | https://hslvizag.in/hsl-cms/media/*.pdf | direct free download (HTTP 200 tested) | free |

Not tested: other HSL pages (tenders, news); only the careers page is a recruitment source.

## Flakiness
First-ever cold render failed once ("Page loaded but no notices were found"); 11 subsequent runs all returned 60 items. The scanner's retry-at-end-of-group covers this.

## Catch vs miss
Page lists newest first; items are ads, corrigenda, interview schedules, interview results. Limit 60 is reached, so the page holds at least 60 (back to Dec 2025); newest ones are on top so nothing new is missed at current posting speed (a few per month).
Links are stable file URLs under hsl-cms/media (no floods seen; seen-state already holds them).

## Label pattern
- New job: "ADVT NO. HR/ES(O)/0102/NN/YYYY Dt <date>" -> parent "Advt HR/ES(O)/0102/NN/YYYY" (post names are only in the PDF filename/inside the PDF, e.g. "Medical Officer", "Executive Coordinator", "DPO (Technical)").
- Update: "CORRIGENDUM TO ADVT NO. <same advt no.> Dated <date>" -> parent = that advt no.
- Interview: "Interview Schedule for the post of <post>" / "Interview Result for the post of <post>" -> parent = post name; match to the advt via post name.

## Hold / pass rules for sorter
- Pass: advertisements, corrigenda, interview schedules (current cycle), interview results/shortlists.
- Hold: Senior Consultant / consultant posts, deputation postings, procurement/tenders, compassionate appointment lists, qualified-candidate/roll-number lists, old-cycle schedules (before current advts 02-06/2026) already posted.
- Note many HSL ads are Deputation/Contract/Permanent-FTC mixes: sorter should open the PDF before deciding.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| ADVT NO. HR/ES(O)/0102/06/2026 Dt 14 Aug 2026 | New Job | Advt 06/2026 (Medical Officer) | Pass |
| CORRIGENDUM TO ADVT NO. HR/ES(O)/0102/06/2026 | Update | Advt 06/2026 | Pass |
| Interview Schedule - Medical Officer | Update | Advt 06/2026 | Pass |
| Interview Schedule - Executive Coordinator (Corporate Affairs) | Update | Advt 05/2026 | Pass |
| ADVT NO. HR/ES(O)/0102/05/2026 Dt 16 Jul 2026 | New Job | Advt 05/2026 | Pass |
| Interview Schedule - Project Superintendent (Technical) | Update | Advt 04/2026 | Pass |
| Interview Schedule - Dy Project Superintendent (Tech) Delhi | Update | Advt 04/2026 | Pass |
| CORRIGENDUM TO ADVT NO. .../04/2026 Dated 03 Jun 2026 (x2) | Update | Advt 04/2026 | Pass |
| ADVT NO. HR/ES(O)/0102/04/2026 Dt 03 Jun 2026 | New Job | Advt 04/2026 | Pass |
| Interview Schedule - DGM (HR) (E5) | Update | Advt 04/2026 | Pass |
| Interview Schedule - Deputy Manager (Safety) | Update | Advt 04/2026 | Pass |
| ADVT NO. HR/ES(O)/0102/03/2026 Dt 13 May 2026 | New Job | Advt 03/2026 (DPO Technical) | Pass |
| Interview Result - Dy Project Officer Civil | Result | Advt 03/2026 | Pass |
| ADVT NO. HR/ES(O)/0102/02/2026 Dt 16 Mar 2026 | New Job | Advt 02/2026 (Medical Officer, Sr Consultant) | Pass, sorter checks consultant posts |
| Interview Result - Senior Consultant (Marine Technical Works) | Result | Sr Consultant | Hold (consultant) |

## Proposed config (sources.json entry "hsl")
```json
{ "id": "hsl", "url": "https://hslvizag.in/en/careers", "render": true,
  "include": "hsl-cms/media|WriteReadData|[.]pdf",
  "exclude": "procurement|improvement|compassionate|qualified|roll no|unique id",
  "titleReplace": ["^link(.*?)(\\s*\\(?Size:.*)?$", "$1"], "minTitle": 12, "limit": 60 }
```
(Other fields unchanged. Exclude change is not a URL/selector change, so no rebaseline needed, but newly un-excluded old "Interview Results"/"shortlisted" items will appear once as new: consider rebaseline or accept a one-time batch.)

## Uncertain
- "WriteReadData" in include is not seen on the page today; harmless.
- Whether limit 60 truncates anything: only old items, fine.
