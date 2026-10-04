## BATCH SUMMARY BLOCK
```
SITE: NCERT Vacancies | VERDICT: FIX
PROPOSED: 1) url -> https://www.ncert.nic.in/vacancies.php?ln=en (www; non-www https drops the connection now and then); 2) remove "render": true (free plain fetch works: 6 of 6 www tries OK, ~0.15s); add timeoutMs 15000
PROPOSED: 3) minTitle 3 (the page links new adverts only as a bare "English" / "Hindi" next to plain row text, so today's Advt 178/2026 and 177/2026 are MISSED); 4) exclude -> "compassionate|roll no|unique id|^\\s*(hindi|हिंदी|हिन्दी)\\s+https?:|_HI\\.pdf" (drops "shortlisted|qualified" so shortlists/results pass, drops Hindi duplicates); 5) limit 150
MISSING TODAY: new Advertisement rows (Advt 178/2026 Principal x2, 177/2026 academic, 01/2025 deputation etc.) have no scanner title; shortlists, "qualified" results; extra PDFs added into existing rows
ASK BATLEE: Add a second source on the same page in row mode (rowSelector "div.card-body li", rowTitle self) only to give new adverts a readable title (e.g. "Advertisement No. 178/2026 for 02 posts of Principal ...")? Recommend NO for now: the sorter opens the PDF anyway, and the row mode misses PDFs added to old rows.
```

# NCERT (National Council of Educational Research and Training)
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (config not changed)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Vacancies (one page, all tabs: academic, non-academic, project staff, miscellaneous, results) | https://www.ncert.nic.in/vacancies.php?ln=en | plain free fetch, no render | FREE-OK |
| same, non-www | https://ncert.nic.in/vacancies.php?ln=en | plain fetch | FLAKY (ECONNRESET once; later OK) |
| same, http | http://ncert.nic.in/vacancies.php?ln=en | plain fetch | OK (1 try) |
| Recruitment portals (recruitment.ncert.gov.in, ncertrec.samarth.edu.in) | - | - | application portals only, not notice lists; not watched |
| Archive pages (archive-academic.php etc.) | https://ncert.nic.in/archive-academic.php | - | old items, not needed |

Current sources.json setting uses "render": true (Chromium, ~1.9 s). It works too, but is not needed. The page is plain server HTML (about 228 KB), links are all in the first response.

## ScrapFly
Not needed. Credits per scan: 0. PDFs download free (direct links on www.ncert.nic.in).

## What the scanner catches vs misses (today, current config)
- Current config returns 60 items (limit 60) and cannot see: the Advertisement rows where the text is outside the link. In the HTML the row is `<li>Advertisement No. 178/2026 for 02 posts of Principal ... || <a><b>English</b></a> | <a>Hindi</a>`. The link text "English" is under minTitle 12, so the advert PDF is dropped. Same for Advt 177/2026, Advt 01/2025 (deputation), Advertisement of Non-Academic Direct Quota Recruitment 2025, Secretary post.
- "shortlisted" and "qualified" are excluded in the current config, but under the standing decisions shortlists pass.
- With the proposed config the page gives about 100 links. Page has no dates; newest rows are on top within each tab.
- Posting speed: the page is updated by NCERT within a day or two of the PDF date (file names carry dd-mm); with scans several times a day there is no limit problem. All 110 anchors fit in limit 150.
- Flood check: links are stable PDF paths under /pdf/announcement/vacancies/<tab>/ . One thing to expect: changing minTitle/exclude may not count as a "selector change" for the silent re-baseline, so the first run after the change could report the ~25 newly visible links (bare "English", shortlists, "Result", "Last date extension", etc.) as new. The URL change (www) does trigger the re-baseline, so applying all changes together should be safe. Please check the first scan output.

## Label pattern
Free-text, no fixed pattern. Two kinds of titles:
1. Descriptive (most notices): "Result of the interviews held for recruitment under Advt. No. 174/2024, NCERT".
2. Bare labels inside a row (English, Hindi, Result, Corrigendum, Date Extended till DD Month YYYY, Last date Extension, Objection Link, Interview Letter). For these the PARENT must come from the PDF filename or the PDF itself: R-I_Advt-178_2026_EN.pdf -> Advt 178/2026; date_extended_177_2026.pdf -> Advt 177/2026; Corrigendum_177_2026.pdf -> Advt 177/2026.
Parent forms: "Advt. No. 174/2024", "Advertisement No.01/2025" (non-academic deputation / non-academic direct quota), "Advertisement No. 178/2026 ... Principal (Group A) RIEs Bhubaneswar and Shillong". Normalise "Advt. No. 174/2O24" (letter O typo) to 174/2024.
Tabs by folder: academicvacancy, nonacademicvacancy, projectstaffvacancy, miscellaneous, resultsvacancy.

## Hold / pass rules for the sorter
Hold:
- Deputation posts (e.g. Scientist G, PSA office; Advertisement No.01/2025 Group A/B/C on deputation, Secretary NCERT if deputation).
- LDCE / LDE / "Limited Departmental" exams and results (PGT/TGT LDE quota, Assistant 25% LDCE, Senior Accountant 75% LDCE, APC LDCE, SO LDCE).
- Project staff / contract / empanelment on daily wage (SRA, JPF, Assistant Editor, DTP, Production Assistant, Graphic Designer) unless BatLee wants them (see uncertain).
- Hindi duplicates (the _HI.pdf and "Hindi" links), recruitment rules, FAQ, syllabus-only and marking scheme pages unless attached to a live exam, attendance report, consolidated statement of applications, mock test link / mock test notice, refund of application fee, cancellation of one named candidate, marks list of an old (2019-20) recruitment, press / time table items.
- Old-cycle 174/2024 academic interview schedules and results (cycle is finished; interview schedules of the current cycle pass).
Pass:
- New advertisements (Principal 178/2026, academic 177/2026, Director NBT contract post is a contract role: hold unless BatLee wants it).
- Corrigendum, date extended / last date extension, objection window, admit card, CBT schedule / date change, typing test, document verification, results, shortlists of current advert.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| English (R-I_Advt-178_2026_EN.pdf) | New Job | Advt 178/2026, 02 Principal, RIE Bhubaneswar and Shillong | Pass (MISSED today) |
| List of Candidates provisionally shortlisted for Interviews | Result | Advt 178/2026 | Pass (excluded today) |
| Notice for Interviews | Update | Advt 178/2026 (likely) | Pass |
| English (R-I_Advt-177_2026_EN.pdf) | New Job | Advt 177/2026 academic positions | Pass (MISSED today) |
| Date Extended till 06 March 2026 | Update | Advt 177/2026 | Pass |
| Corrigendum | Update | Advt 177/2026 | Pass |
| Recruitment of Director, National Book Trust (On contract) | New Job | NBT Director | Hold (contract, 5 years) - ask |
| Result of PGT Under LDCE | Result | PGT LDCE | Hold |
| Notice of Written Examination ... PGT ... LDE Quota | Update | PGT LDE | Hold |
| Result of Interview for the Post of Principal ... Advt. No. 176/2025 | Result | Advt 176/2025 | Pass |
| Interview Schedule Notice (Principal, Advt176) | Update | Advt 176/2025 | Pass |
| Result of the interviews held ... under Advt. No. 174/2024 | Result | Advt 174/2024 | Pass |
| Interview schedule ... Botany (under Advt.174/2024) | Update | Advt 174/2024 | Pass (old cycle: sorter decides) |
| Filling up of vacant post of Scientist 'G' ... by Deputation | New Job | PSA office Scientist G | Hold (deputation) |
| Advertisement No.01/2025 : Notice Regarding the Admit Card for the post of LDC | Admit Card | Advt 01/2025 LDC | Pass |
| Advertisement No.01/2025 : Objection Link for CBT ... April 2026 | Update | Advt 01/2025 | Pass |
| Result of the Word Processing / Typing Test ... LDC / AS / MTS | Result | Advt 01/2025 | Pass |
| Attendance Report of CBT ... | Noise | Advt 01/2025 | Hold |
| Advertisement No.01/2025 : Mock test link for CBT ... LDC | Noise | Advt 01/2025 | Hold |
| Recruitment of 01 SRA at DESM, NCERT | New Job | project post | Hold (project staff) - ask |
| Result of the Stenography Skill Test for the post of APC (LDCE) | Result | APC LDCE | Hold |

## Proposed config (JSON, not applied)
```json
{
  "id": "ncert",
  "name": "NCERT Vacancies",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.ncert.nic.in/vacancies.php?ln=en",
  "timeoutMs": 15000,
  "minTitle": 3,
  "include": "vacancies/",
  "exclude": "compassionate|roll no|unique id|^\\s*(hindi|हिंदी|हिन्दी)\\s+https?:|_HI\\.pdf",
  "limit": 150
}
```
(Removes "render": true.) Tested with the scanner's own fetchItems: 100 items, no Hindi duplicates, new Advt 178/2026 and 177/2026 PDFs present, 0.2 s.

## Uncertain points
- Project-staff tab and the NBT Director contract post: treated as hold (consultant / contract rule). If BatLee wants them, remove from hold list.
- Bare titles ("English", "Result") give the sorter no parent text. The sorter must read the PDF or the file name.
- Old-cycle 174/2024 interview schedules are still on the page and will be seen once on the first scan (re-baseline should absorb them).
- The page also links external application portals (digialm admit card links, recruitment.ncert.gov.in); excluded by include "vacancies/". Admit card download links on those portals are not tracked, only the notice PDF next to them.
- The row mode (whole row text as title) was tested: it gives readable titles but only the first PDF per row, so later notices added to an old row would be missed.

## BatLee's corrections
- none yet

## Repairs
- none
