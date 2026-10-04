# NALCO Recruitment Portal
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, not yet applied)

## BATCH SUMMARY BLOCK
```
SITE: NALCO (nalco) | VERDICT: FIX
PROPOSED: 1) nalco: remove "exclude" (it drops all "shortlist" notices = PI/interview/GET shortlists that must pass); keep other fields
PROPOSED: 2) add FREE source nalco-advt (same page, rowSelector "#ctl00_ContentPlaceHolder1_GridView1 tr:has(a.advt-pdf-link)", rowTitle "td:nth-child(3)", rowLink "a.advt-pdf-link", include Uploaded_Data, noFileDownload true, allowEmpty) with rebaseline
MISSING TODAY: all NEW JOB advertisements (grid on the same page; e.g. Advt 10260401 Senior Executives, open 01-10 to 21-10-2026) plus 11 shortlist notices; scanner sees only 12 of 26 notices
ASK BATLEE: 1) to avoid a flood of 11 old shortlists when "exclude" is removed, pre-seed/rebaseline nalco (recommend: yes, rebaseline)
```

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitment portal home (notices ticker + advertisement grid) | https://mudira.nalcoindia.co.in/rec_portal/Default.aspx | free fetch (https, no www), 4 runs, 0.4-0.6 s, all OK | FREE-OK |
| Per-advertisement notices | .../rec_portal/ViewNotice.aspx?Advt_Id=N | free curl 200 (same notice list per advt) | FREE-OK, not needed (home ticker has the same) |
| Per-advertisement results | .../rec_portal/ViewResult.aspx?Advt_Id=N | free curl 200 | FREE-OK, not needed |

robots.txt: `Disallow: /iorms/Uploaded_Data/` (all PDFs). Hence existing `noFileDownload: true` must stay on every NALCO source. Listing page itself is allowed.

## What the scanner does today
Source `nalco`: selector `a.news-link`, include `Uploaded_Data`, exclude `shortlist|compassionate|qualified|roll no|unique id`. Page has 26 news-link items; 3 have href "#" (objection management, mock test, admit card download: dropped by include, fine, these are dated 2025); 12 pass today. Removing the exclude gives 23 (11 more, all shortlists / PI lists). Ticker has no dates; new notices appear at the top.

Not seen at all: the advertisement grid (new jobs). 11 rows, newest first, each with advt number, location, title, open/close date and the advert PDF (`../iorms/Uploaded_Data/Advertisement/...pdf`). Tested with fetchItems: rowSelector config returns all 11 rows with clean titles.

## ScrapFly
Not needed. PDFs not downloaded at all (robots), so nothing to test.

## Link stability / flood check
4 repeated fetches: identical 12 items, stable hrefs (Notice_<ticks>_<name>.pdf). Ticks in the filename make links unique. No flood risk in steady state. One-time flood risk only when removing the exclude (11 old shortlist items would look new).

## Label pattern
News ticker: `<Section>(<AdvtNo>): <text>` where Section = `Circulars/Notices` or `Results`, AdvtNo = the numeric advertisement number (10260213, 10250803, 12240214) or a code like H&A/NRPY/258/2026.
Rule: TYPE from text (Admit Card / Result or "list ... selected/shortlisted" / Update for extension / interview call), PARENT = "NALCO Advt <AdvtNo>" (plus post name when given, e.g. GET, Dy.GM Mining E06).
Advertisement grid: title has NO advt number (it is in column 1 of the row and often in the PDF filename, e.g. 10260401). Parent for matching = the advt number; the sorter can match the grid item to later ticker notices by the 8-digit number (see uncertain points).

## Hold / pass rules (for the sorter)
Pass: all grid advertisements that are regular jobs (executives, GET, non-executive, medical professionals on regular/contract engagement drives like 10260301 are NALCO regular-company drives: pass), admit cards, results, provisional selection lists, shortlists for PI/interview/GET call lists, interview calls, extensions, instructions for candidates.
Hold: walk-in interviews for retainers/doctors/gynaecologist on contract basis (12260201, 12260101), NALCO Foundation roles (NBC/NF/..., community mobiliser, office attendant: small contract roles; recommend hold), NALCO Rojgar Protsahan Yojana (NRPY, a local scheme, not a job: hold unless BatLee says otherwise), tenders, Hindi duplicates.
Note 10260301 "Medical professionals": check the PDF by hand (contract vs regular) - sorter cannot open it (robots).

## Sample links (audit day, 2026-10-04)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| REQUIREMENT OF COMMITTED, PROMISING AND RESULT ORIENTED SENIOR LEVEL EXECUTIVES (grid, NEW, closes 21-10-2026) | New Job | NALCO Advt 10260401 | Pass |
| REQUIREMENT OF COMMITTED, EMPATHETIC AND COMPASSIONATE MEDICAL PROFESSIONALS (grid) | New Job | NALCO Advt 10260301 | Pass (verify) |
| NALCO Foundation: Community Mobiliser, Office Assistant, Office Attendant (grid) | New Job | NBC/NF/2026-27/17 | Hold |
| Recruitment of Non-Executive Personnel, M&R Complex Damanjodi (grid) | New Job | NALCO Advt 10260213 | Pass |
| NRPY at Mines & Refinery Complex, Damanjodi (grid) | Noise | H&A/NRPY/258/2026 | Hold |
| WALK-IN INTERVIEW retainer-land contractual (grid) | Noise | 12260201 | Hold |
| WALK-IN INTERVIEW doctor on contract (grid) | Noise | 12260101 | Hold |
| Recruitment of Graduate Engineer Trainees through GATE-2025 (grid) | New Job | NALCO Advt 10250803 | Pass |
| Circulars/Notices(10260301): List of the candidates shortlisted for PI | Result | NALCO Advt 10260301 | Pass (currently dropped by exclude) |
| Results(10250803): 5th list provisionally shortlisted for the post of GET | Result | NALCO Advt 10250803 GET | Pass (currently dropped) |
| Results(H&A/NRPY/258/2026): NRPY 2026 Provisional Shortlist | Result | NRPY | Hold (not a job) |
| Circulars/Notices(10260213): Extension of last date for submission of applications | Update | NALCO Advt 10260213 | Pass |
| Results(10260105): List of candidates provisionally selected ... | Result | NALCO Advt 10260105 | Pass |
| Circulars/Notices(10260105): Admit Cards issued for CBT | Admit Card | NALCO Advt 10260105 | Pass |
| Circulars/Notices(10250803): Interview for the post of GET(Electrical) | Update (interview) | NALCO Advt 10250803 | Pass |
| Circulars/Notices(10250803): Important: Instructions for the candidates | Update | NALCO Advt 10250803 | Pass |
| Results(10250414): List of provisionally selected ... Dy.GM (Mining) E06 | Result | NALCO Advt 10250414 | Pass |
| Results(12240214): Result of CBT, S&P Complex Angul | Result | NALCO Advt 12240214 | Pass |

## Proposed config (JSON)
```json
[
  {
    "id": "nalco",
    "name": "NALCO Recruitment Portal",
    "runner": "india", "tier": "FREE", "level": "central", "type": "html",
    "url": "https://mudira.nalcoindia.co.in/rec_portal/Default.aspx",
    "selector": "a.news-link",
    "include": "Uploaded_Data",
    "noFileDownload": true,
    "minTitle": 15,
    "limit": 60
  },
  {
    "id": "nalco-advt",
    "name": "NALCO Advertisements",
    "runner": "india", "tier": "FREE", "level": "central", "type": "html",
    "url": "https://mudira.nalcoindia.co.in/rec_portal/Default.aspx",
    "rowSelector": "#ctl00_ContentPlaceHolder1_GridView1 tr:has(a.advt-pdf-link)",
    "rowTitle": "td:nth-child(3)",
    "rowLink": "a.advt-pdf-link",
    "include": "Uploaded_Data",
    "noFileDownload": true,
    "allowEmpty": true,
    "minTitle": 15,
    "limit": 30
  }
]
```
Tested with fetchItems (free): news without exclude = 23 items; advt = 11 items; both stable.

## Uncertain points
- Grid titles lack the advert number; I did not find a config-only way to prepend column 1 (not tested, rowTitle takes one selector). The number is in the PDF filename for most rows, so the sorter can read it from the link.
- Removing "exclude" is a change to an existing source whose URL/selectors are unchanged: the scanner may NOT silently rebaseline, so 11 old shortlists could alert once. Safest: rebaseline nalco when applying.
- The compassionate / qualified / roll no / unique id parts of the old exclude matched nothing today; dropping them is consistent with the "no keyword filters" rule.
- 10260301 "Medical professionals" contract/regular status unknown (PDF not allowed to be fetched).

## BatLee's corrections
- none yet

## Repairs
- none
