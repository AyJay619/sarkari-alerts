## BATCH SUMMARY BLOCK
```
SITE: MOIL Careers (moil.nic.in) | VERDICT: FIX
PROPOSED: 1. Replace "moil" (render) with a FREE JSON source: POST https://backend.moil.nic.in/career/career-public-list, itemsPath result, titleField title, linkField advertisementPdf, linkPrefix https://backend.moil.nic.in/getFiles/, no render, timeout 15000, rebaseline; 2. Add JSON sources "moil-updates" (linkField otherPdf.url) and "moil-corrigendum" (linkField corrigendumPdf) with titleFormat "{title} - update/corrigendum"
MISSING TODAY: the 11 current advertisements (render shows only 3 junk links: user manual, Hindi goods-demand, a 2025 call letter); results / interview lists / corrigenda attached to a row
ASK BATLEE: none (note: rows with no update make one harmless phantom item per extra source, baselined silently)
```

# MOIL Careers (moil.nic.in)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (proposal pending)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Career page (current "moil") | https://www.moil.nic.in/public/career | render:true, pinned Chromium, allowedHosts backend.moil.nic.in, include getFiles/userfiles | Loads but catches only 3 items: "Notification for Call Letter" (2025 PDF), a Hindi "goods demand" notice, "View User Manual". None of the real adverts. Without render: 2 junk items. FAIL (silently under-catching) |
| Career JSON API (proposed) | POST https://backend.moil.nic.in/career/career-public-list | free fetch via fetchItems (POST, JSON body), 50-210 ms, 3/3 runs identical, 11 rows | FREE-OK |
| Archive list (not proposed) | same API with "type":"archive" | free | works, old postings only; skip |

The site is a Next.js app (www host redirects the bare domain with 307; /public/career returns 200). The list is not in the HTML: the page calls the backend API above, no login, no captcha, no auth needed (tested without any token). Body: {"page":1,"lang":"english","searchString":"","publishDate":"","lastDate":"","type":"careerList"}. totalPages = 1 (11 rows today), so no pagination issue. lang "hindi" gives Hindi duplicates: not used.

## What the scanner catches vs misses
- Catches today: nothing useful (3 junk links, see above). The 11 live rows are missed.
- Each API row has: title, publishDate, submissionDate (last date), advertisementPdf, corrigendumPdf (empty today), otherPdf.url (results / interview lists), applyNowLink (sometimes, pesb.gov.in for CMD posts), isArchive.
- A new advert = a new row with a new advertisementPdf. A result/interview list/corrigendum on an existing job is added INTO the same row (otherPdf / corrigendumPdf), so the main source would never see it. Hence the two extra sources.
- PDF links: file names contain spaces and brackets. The link must be fetched with %20 encoding (tested: raw spaces fail in curl, encoded gives 200, 303 KB PDF). The scanner's seen check ignores %-encoding, so the stored link can stay as the scanner builds it; the sorter should encode spaces when opening PDFs. PDFs download free (backend.moil.nic.in/getFiles/...).
Posting speed: rows appear within the same day as publishDate (latest 2026-09-18, about 1 posting every 1-3 weeks). A scan every few hours is far more than enough.
Link stability (flood check): links are stable file paths with an id prefix, identical across 3 runs per source. No flood risk. Phantom items: for a row with no update, the extra sources fall back to https://www.moil.nic.in/public/career (same link for all rows, so the seen check holds just one such item, and baseline absorbs it).

## Label pattern
Rows are plain titles, no "type: parent" prefix.
- "RECRUITMENT OF <post> (E-xx)" / "Recruitment Advertisement for the post of <post> (E-xx)" = New Job. Parent = post name + grade, e.g. "Manager (Survey) E-02".
- "Selection for the post of <Director/CMD>, <PSU>" = New Job (PESB board posts, apply via pesb.gov.in).
- "DIRECT RECRUITMENT - Advertisement No.: STAT/09/2025" = New Job, Parent = "Advt STAT/09/2025".
- Extra sources: the title repeats the parent job with the suffix " - update" (otherPdf: usually a result, DV schedule or interview list; read the PDF to type it) or " - corrigendum". Parent = the row title, which equals the title of the original advert, so the sorter can match updates to jobs already posted.

## Hold / pass rules for the sorter
Hold: "Deputy/Joint Industrial Advisor in Ministry of Steel by Deputation / Composite Method" (deputation); "Senior Consultant (Project Management Cell)" (consultant); "INTERNAL RECRUITMENT" (departmental/internal); "Selection for the post of Chairman & Managing Director, MECON Limited" (a different PSU's board post, via PESB; hold unless BatLee wants PESB posts); Hindi duplicates.
Pass: Manager (Survey), Manager (Medical Service), CGM (Personnel), Graduate/Management Trainees, Director (Commercial) MOIL, Direct recruitment (STAT) ads; any result / interview / DV list in otherPdf; corrigenda.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| RECRUITMENT OF MANAGER (SURVEY) (E-02) | New Job | Manager (Survey) E-02 | Pass |
| Selection for the post of CMD, MECON Limited | New Job | CMD MECON | Hold (other PSU, PESB) |
| Recruitment Advertisement for the post of Manager (Medical Service) (E-02) | New Job | Manager (Medical Service) E-02 | Pass |
| Recruitment Advertisement for the post of Chief General Manager (Personnel) (E-08) | New Job | CGM (Personnel) E-08 | Pass |
| Senior Consultant (Project Management Cell) | New Job | Senior Consultant PMC | Hold (consultant) |
| Deputy Industrial Advisor in Ministry of Steel By Deputation... | New Job | Dy Industrial Advisor MoS | Hold (deputation) |
| Joint Industrial Advisor in Ministry of Steel By Composite Method | New Job | Jt Industrial Advisor MoS | Hold (deputation) |
| Selection for the post of Director (Commercial), MOIL Limited | New Job | Director (Commercial) MOIL | Pass |
| Director (Commercial) - update: List Interview GTMT.pdf | Update | Director (Commercial) MOIL | Pass (read PDF) |
| RECRUITMENT OF GRADUATE TRAINEES / MANAGEMENT TRAINEES & MANAGER(SURVEY) | New Job | GT/MT/Manager (Survey) | Pass (closed 2026-01-20) |
| GT/MT - update: MOIL GT-MT Result.pdf | Result | GT/MT/Manager (Survey) | Pass |
| DIRECT RECRUITMENT - Advertisement No.: STAT/09/2025 | New Job | Advt STAT/09/2025 | Pass |
| Direct Recruitment STAT/09/2025 - update: Results Direct D.V. Medical | Result | Advt STAT/09/2025 | Pass |
| INTERNAL RECRUITMENT - Advertisement No.: STAT/09/2025 | New Job | Advt STAT/09/2025 (internal) | Hold (internal) |
| Internal Rect. - update: Notice for DV Medical | Update | Advt STAT/09/2025 (internal) | Hold |
| Notification for Call Letter (2025 PDF, current render catch) | Admit Card | unknown (old) | Pass if ever new |

## Proposed config (JSON)
```json
[
  {
    "id": "moil",
    "name": "MOIL Careers",
    "runner": "india",
    "tier": "FREE",
    "level": "central",
    "type": "json",
    "url": "https://backend.moil.nic.in/career/career-public-list",
    "method": "POST",
    "headers": { "Content-Type": "application/json" },
    "body": "{\"page\":1,\"lang\":\"english\",\"searchString\":\"\",\"publishDate\":\"\",\"lastDate\":\"\",\"type\":\"careerList\"}",
    "itemsPath": "result",
    "titleField": "title",
    "linkField": "advertisementPdf",
    "linkPrefix": "https://backend.moil.nic.in/getFiles/",
    "fallbackLink": "https://www.moil.nic.in/public/career",
    "timeoutMs": 15000,
    "limit": 40
  },
  {
    "id": "moil-updates",
    "name": "MOIL Results / interview lists",
    "runner": "india", "tier": "FREE", "level": "central", "type": "json",
    "url": "https://backend.moil.nic.in/career/career-public-list",
    "method": "POST",
    "headers": { "Content-Type": "application/json" },
    "body": "{\"page\":1,\"lang\":\"english\",\"searchString\":\"\",\"publishDate\":\"\",\"lastDate\":\"\",\"type\":\"careerList\"}",
    "itemsPath": "result",
    "titleFormat": "{title} - update",
    "linkField": "otherPdf.url",
    "linkPrefix": "https://backend.moil.nic.in/getFiles/",
    "fallbackLink": "https://www.moil.nic.in/public/career",
    "timeoutMs": 15000,
    "limit": 40
  },
  {
    "id": "moil-corrigendum",
    "name": "MOIL Corrigenda",
    "runner": "india", "tier": "FREE", "level": "central", "type": "json",
    "url": "https://backend.moil.nic.in/career/career-public-list",
    "method": "POST",
    "headers": { "Content-Type": "application/json" },
    "body": "{\"page\":1,\"lang\":\"english\",\"searchString\":\"\",\"publishDate\":\"\",\"lastDate\":\"\",\"type\":\"careerList\"}",
    "itemsPath": "result",
    "titleFormat": "{title} - corrigendum",
    "linkField": "corrigendumPdf",
    "linkPrefix": "https://backend.moil.nic.in/getFiles/",
    "fallbackLink": "https://www.moil.nic.in/public/career",
    "timeoutMs": 15000,
    "limit": 40
  }
]
```
All three tested with the scanner's own fetchItems (3 runs each, 11 rows, identical). Allowed-hosts: the old "allowedHosts" entry is not needed for JSON sources (not tested whether the scanner requires it for json; the test ran without it). Changing the "moil" source type/URL makes the scanner re-baseline it silently.

## Uncertain
- The extra "update" source also fires if MOIL edits an existing otherPdf (replaces the file): that would be a genuine new notice, so fine.
- Phantom page-link item per extra source (see flood check); if BatLee dislikes it, drop the corrigendum source (empty today, rare) and keep only moil-updates.
- Whether MOIL ever moves postings to archive before a result is attached is unknown; archive API ("type":"archive") exists and could be added later if updates are missed.
- Link contains raw spaces; fine for the seen check, but the sorter must encode them to open the PDF.

## BatLee's corrections
- none yet

## Repairs
- none
