## BATCH SUMMARY BLOCK
SITE: NABARD Career Notices | VERDICT: FIX
PROPOSED: 1) nabard: replace `include: "CareerNotices"` with selector `.career_row a.pdf-link[href]:not([href$="CareerNotices/"]), .career_row .ext_link a[href^="http"]` + contextClosest `.career_row` + contextFind `.career_title` + minTitle 4, rebaseline true (drops empty "Apply Here" folder links, adds the real IBPS apply link and the post/advert name to every title)
MISSING TODAY: nothing missed (page loads free, newest first, 4/4 test fetches OK); but titles are bare ("Notification", "Select List") and "Apply Here" items point to an empty folder URL
ASK BATLEE: none (contract "Specialist"/Young Professionals notices: I recommend HOLD per the consultant rule)

# NABARD
Audited: 2026-10-04 | Group: FREE | Status: PROPOSAL (batch, no config changed)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Career Notices (all recruitment notices, ~268 rows, newest first) | https://www.nabard.org/careers-notices1.aspx?cid=693&id=26 | free fetchItems, 15 s | FREE-OK |

URL variants: https + www works (200, about 1 s). Without www = 404. http + www timed out at 20 s (https needed, as in the current config). Fetch repeated 4 times: 40 items each time, 0.8-1.8 s.
Page has no dates. Rows are in posting order (newest first), so limit 40 covers about 10-15 latest postings. Flood check: only 2 new rows between 29 Sep and 1 Oct baseline (Result_DDMABI, SPPID_Result); no flood risk. Link stability good (numeric prefix + filename never changes).

## Scanner today vs proposal
Today: `include: CareerNotices` takes the PDF link text only. Titles are bare ("Notification", "Select List", "Result_RMD") with no post or advertisement name; two "Apply Here" items have link = empty folder `/auth/writereaddata/CareerNotices/` (junk, the real apply link is an external IBPS URL hidden in `.ext_link`); the "Marks" item also resolves to a bare folder.
Each page row is `div.career_row` with the full heading in `div.career_title` (e.g. "Recruitment of Specialists on contract - 2026-27 - SPPID, DCAS & FD"). Tested with the scanner's own fetchItems: the proposed selector gives clean "<heading>: <link text>" titles, and the Apply Here items get the IBPS URL. Test output below.

## Label pattern
Title becomes: `<career_title heading>: <pdf link text>`.
Heading pattern: "Recruitment of <Post(s)> [on contract] - <year> - <what>" e.g.
- "Recruitment of Specialists on contract - 2026-27 - SPPID, DCAS & FD: Advtertisement - SPPID, DCAS & FD" -> type New Job; parent = "Specialists on contract 2026-27 SPPID/DCAS/FD"
- "...DDMABI - Result for the posts of ...: Result_DDMABI" -> Result; parent = DDMABI 2026-27
- "...Registration Nos. Of the candidates shortlisted for Interview...: <file>" -> Result (shortlist); parent = post group name in heading
- "Recruitment of Development Assistant / Development Assistant (Hindi) - 2026 - ...: <file>" -> LPT / select list / wait list / Information Handout; parent = "Development Assistant 2026"
- "Recruitment to the post of Grade A - Assistant Manager (RDBS/Legal/P & SS) - 2025 - Individual Score card & Cut-Off Marks" -> Result (cut-offs); parent = Grade A 2025
Parent = the text after "Recruitment of/to" up to the first " - 20xx" year, plus the year; ignore the "Hindi" variant file as duplicate.
Apply links: "...: Apply Here" with ibpsreg.ibps.in URL = the apply-online link of that advertisement (use it as apply link for the New Job).

## Hold / pass rules for the sorter
Pass: Advertisement / Notification / Apply Here of open posts (Grade A/B officers, Development Assistant, Office Attendant etc.), Information Handout, LPT / exam notification and date notices, admit card / call letter, results, select / wait lists, shortlisted-for-interview lists, cut-offs (results incl. shortlists), corrigendum / extension / cancellation.
Hold: "Specialists on contract" and "Young Professionals (on Contract)" advertisements (contract consultant-type roles) - their results/shortlists may follow the same rule; Hindi duplicates (e.g. "Development Assistant (Hindi)" lists mirror the English ones, hold only if the English one is already caught); "Roll Nos. of DISQUALIFIED/ABSENT candidates" (debarment type); "Individual Score card / marks" items; bid results, tenders; empty-link items (link ending in /CareerNotices/ with no file).
Never hold: normal job that merely reserves ESM seats.

## Sample links (audit day, proposed titles shortened)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Specialist On Contract 2026-27 SPPID - Result: SPPID_Result | Result | SPPID 2026-27 | Hold (contract specialist) |
| Specialist On Contract 2026-27 DDMABI - Result: Result_DDMABI | Result | DDMABI 2026-27 | Hold |
| Specialists on contract DDMABI 2026-27 - Registration Nos shortlisted for Interview | Result | DDMABI 2026-27 | Hold |
| Development Assistant / (Hindi) 2026 - Roll Nos. of DISQUALIFIED/ABSENT in LPT: LPT result notification | Update | Development Assistant 2026 | Hold (debar type) |
| Grade A (RDBS/Legal/P&SS) 2025 - Select & Wait List Cut offs | Result | Grade A 2025 | Pass |
| Grade A (RDBS/Legal) 2025 - Cut-offs of Mains examination | Result | Grade A 2025 | Pass |
| Grade A 2025 - Preliminary & Mains Marks (link = IBPS login) | Result | Grade A 2025 | Hold (marks) |
| Notification - Development Assistant 2026 - Language Proficiency Test Date | Update | Development Assistant 2026 | Pass |
| Development Assistant 2026 - Provisional Select List / Wait List | Result | Development Assistant 2026 | Pass |
| Development Assistant (Hindi) - Provisional Select List | Result | Development Assistant 2026 | Hold (duplicate) |
| Young Professionals 2025-26 - Select List / Wait List | Result | Young Professionals 2025-26 | Hold |
| Specialists on contract 2026-27 SPPID, DCAS & FD: Advtertisement (June 2026) | New Job | Specialists contract 2026-27 | Hold (contract) |
| ...SPPID, DCAS & FD: Apply Here (ibpsreg.ibps.in/nabardjun26) | New Job | same | Hold (with the above) |
| IT Operations & Infrastructure Services ... on contract 2025-26 - Result DIT | Result | DIT 2025-26 | Hold |
| Advertisement_BMO | New Job | Business Management Officer | Pass if non-contract (check) |
| Development Assistant 2026 - Information Handout | Update | Development Assistant 2026 | Pass |

## Proposed config (sources.json)
```json
{
  "id": "nabard",
  "name": "NABARD Career Notices",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.nabard.org/careers-notices1.aspx?cid=693&id=26",
  "selector": ".career_row a.pdf-link[href]:not([href$=\"CareerNotices/\"]), .career_row .ext_link a[href^=\"http\"]",
  "contextClosest": ".career_row",
  "contextFind": ".career_title",
  "minTitle": 4,
  "limit": 40,
  "timeoutMs": 15000,
  "rebaseline": true
}
```
Tested: this config (with limit 22) returned 22 clean items with correct links. Rebaseline is required (titles change for all rows).

## Uncertain
- `include: CareerNotices` is dropped because the selector now filters; the external IBPS Apply link is kept on purpose.
- Rows' headings can be edited by NABARD later; a heading edit would re-announce that row (small risk; contextAttr not available here).
- Whether contract Specialist posts count as "consultants" for BatLee is a judgement; recommended HOLD.

## BatLee's corrections
- none yet

## Repairs
- none
