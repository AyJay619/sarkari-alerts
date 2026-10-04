## BATCH SUMMARY BLOCK
SITE: ESIC Recruitment | VERDICT: OK
PROPOSED: none (optional: add page 2 https://esic.gov.in/recruitments/index/page:2 as FREE source, only if flood risk matters)
MISSING TODAY: nothing found (page 1 shows only 11 newest PDFs; at ~4-10 new items per scan window nothing is pushed off page 1 between 3-hourly scans)
ASK BATLEE: Nearly every ESIC item is a contractual walk-in drive for doctors (Specialist / Senior Resident / faculty on contract). Pass or hold? Recommend PASS the walk-in advertisements (multi-post, real jobs) and their results; HOLD single-hospital/part-time-only one-off notices, interview-date notices and "Notice- Deferment" style items.

# ESIC Recruitment (audit 2026-10-04, batch mode)
Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Recruitments (only list; all ads, notices, results, walk-ins) | https://esic.gov.in/recruitments | free fetch via fetchItems | FREE-OK |

- www / no-www and http / https all return 200 with the same page (redirect to /recruitments/n then 200 page, 86 KB). 6 repeat fetches: all 200. Current config (https, no www) is fine; no timeout change needed.
- Scanner result: 11 items per run, identical across 4 runs (no flakiness). `limit: 25` is above the page size, so nothing is cut.
- The homepage (https://esic.gov.in/) also lists the latest recruitmentfile PDFs; redundant, not needed.
- Older pages exist: /recruitments/index/page:2 ... page:9 (all 200). Page 2 has ~30 older items (results mostly). Not needed for new-item detection.

## What the scanner catches vs misses
- Catches every PDF under /attachments/recruitmentfile/ on page 1. Links are PDF-only (no HTML detail pages). No dates shown on the page; the number at the end of each filename (e.g. _1791033631) is a Unix timestamp of upload (1791033631 = 2026-10-03) and is a usable date for the sorter.
- Posting speed: roughly 10 new PDFs per few days (batches). Page 1 holds 11, so a daily or 3-hourly scan is safe; only a gap of several days could push items to page 2.
- Link stability: filenames are stable and unique (title + timestamp); no flood risk seen. Titles carry a trailing "-" (e.g. "Result ... -"), harmless; the seen check handles it.

## Label pattern
Free text, no fixed prefix. Types by keyword in title:
- "Advertisement / Recruitment notification / Walk in Interview for ..." = New Job (walk-in drive)
- "Result / Declaration of Result / Final Result / Provisional result" = Result
- "Notice to Advertisement ... / Circular regarding ... / Deferment / Regarding interview" = Update
Parent = Advt number if present ("Advt. No 01 & 02 of 2026", "Advt No 05/11 of 2026"), else the post + place ("Senior Resident, ESIC Faridabad", "Specialist Gr II Odisha region") and walk-in date ("held on 25.09.2026"). Hindi duplicates: none seen.

## Hold / pass rules for the sorter
Standing rules apply. Site-specific:
- HOLD: "Department-wise Interview Schedule & Vacancy Chart", "Regarding interview of contractual part time specialist" (single-hospital logistics), Notice- Deferment of monthly walk-in (info only unless the sorter finds the drive is posted on Sarkari24, then Update), HPV vaccine project / project-based consultant posts, Ayurveda/part-time single-hospital doctor results, scribe/normalisation notices.
- PASS: multi-post advertisements (Advt No 01/02/05/11 of 2026), monthly walk-in recruitment notifications (e.g. October 2026 allopathy doctors 09.10.2026), faculty/professor ads, results of Advt-numbered recruitment (Specialist Gr II region-wise results, faculty results), circulars changing an advertisement.
- Per-region duplicates: "Result for Specialist Gr. II ... for <state> Region" come as ~15 separate PDFs with the same parent; sorter should merge into one item.
- Final classification of contractual doctor drives depends on BatLee's answer above.

## Sample links (page 1, audit day)
| Title (short) | Type | Parent | Pass/Hold |
|---|---|---|---|
| Notice- Deferment of Monthly Walk-in Interview Oct 2026 | Update | Monthly walk-in Oct 2026 | Hold (info) |
| Advertisement full/part time contractual specialists, SR (3 yr), part time super-specialist via walk-in | New Job | ESIC walk-in specialists/SR | Pass (if BatLee agrees) |
| Declaration of Result walk-in 29.09.2026 SR/Specialist | Result | Walk-in 29.09.2026 | Pass |
| Recruitment notification October 2026 allopathy doctors 09.10.2026 | New Job | Oct 2026 allopathy doctors | Pass |
| Result of walk-in SR 1 year & Specialist 25-09-2026 | Result | Walk-in 25.09.2026 | Pass |
| Circular Regarding Recruitment Adv. No 01 & 02 of 2026 | Update | Advt 01 & 02 / 2026 | Pass |
| Walk in Interview 09.10.2026 SR Broad Speciality ESIC Faridabad NIT-3 | New Job | SR, ESIC Faridabad | Pass |
| Full-time Specialist Part-time Specialist | New Job | Specialists (unclear place) | Pass, sorter to open PDF |
| Advertisement for Recruitment Senior Resident | New Job | Senior Resident | Pass |
| Result walk-in full/part time Specialist, Super Specialist, SR held 25.09.2026 | Result | Walk-in 25.09.2026 | Pass |
| Walk in interview Specialist, PGMO & SR on contract | New Job | Specialist/PGMO/SR | Pass |
| (page 2) Declaration of provisional result Associate/Assistant Professor contractual | Result | Faculty contractual | Pass |
| (page 2) Department-wise Interview Schedule & Vacancy Chart | Update | Lucknow walk-in | Hold |
| (page 2) Regarding interview of Contractual Part Time Specialist | Update | Part time specialist | Hold |

(Filenames of a few titles are cut at the scanner; title text is intact in the page.)

## Proposed config
No change needed. Current source stays:
```json
{ "id": "esic", "name": "ESIC Recruitment", "runner": "india", "tier": "FREE", "level": "central", "type": "html", "url": "https://esic.gov.in/recruitments", "include": "recruitmentfile", "limit": 25 }
```
Optional: `"extraUrls": ["https://esic.gov.in/recruitments/index/page:2"]` (with rebaseline) only if scans are ever spaced more than ~3 days.

## Uncertain
- Sample table dates are inferred from filename timestamps, not shown on the page.
- Whether BatLee wants contractual doctor walk-in drives on Sarkari24 (see ASK).
