# EPFO Recruitment (batch audit)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch mode, no config changed)

## BATCH SUMMARY BLOCK
SITE: EPFO Recruitment | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page lists only deputation / contract / consultant / LDCE items; EPFO direct exams (SSA, Stenographer) are run via NTA and UPSC, already covered by those sources)
ASK BATLEE: none

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitments (archive list) | https://www.epfo.gov.in/archive-recruitments | free fetch via fetchItems, 4 runs, 12 items each, 60-400 ms | FREE-OK |
| Recruitments landing | https://www.epfo.gov.in/recruitments/ | HTTP 200 but only a button pointing to the archive page | no extra value |
| No-www | https://epfo.gov.in/archive-recruitments | redirects to www version, works | fine |

PDFs host: pmvbry-cdn.epfindia.gov.in and www.epfo.gov.in (already in allowedHosts).

## What the scanner catches vs misses
Catches all 12 rows on the page. Selector `.jobgrid` / `h4.job-title` / `a.card` works. No dates shown on the page. Page is a slow archive: all 12 items are 2024-2025 notices, so posting speed is low (a few per year). Flood check: links are stable across runs; one row (Recruitment Rules Director/Asst Director IS) links to the page itself, which is fine because the title is the seen key. Seen state already holds all 12.

## Label pattern
Plain sentence titles, no type prefix: "Filling up the posts of <Post> on deputation basis in EPFO", "Engagement of Retired Government Officers as Consultant (...) on contract basis". Parent = post name (e.g. "Vigilance Assistant, EPFO"). Real job notices from EPFO normally arrive as exam notifications on the UPSC / NTA pages, not here.

## Hold / pass rules (for the sorter)
- HOLD: anything "on deputation basis", "Limited Departmental Competitive Examination", "promotion", "Recruitment Rules", "Engagement of Retired ... Consultant", "Young Professionals", "on contract basis".
- PASS: a direct-recruitment advertisement or exam notification (SSA, Stenographer, APFC, Enforcement Officer etc.), admit card, result, answer key, corrigendum or extension for such an exam. None present today.
- Note: corrigenda on deputation posts (e.g. Vigilance Assistant) are HOLD too.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment Rules for the post of Director (IS) and Assistant Director (IS) | Noise | Director/AD (IS) | Hold |
| Corrigendum regarding filling up the post of vigilance assistant on deputation basis | Update | Vigilance Assistant | Hold |
| Engagement of Retired Government Officers as Consultant (Plan & Policy) | New Job | Consultant Plan & Policy | Hold (retired/consultant) |
| Filling up posts of Deputy Director (Vigilance) & Asst Director (Vigilance) on deputation | New Job | DD/AD Vigilance | Hold |
| Young Professionals (Law) on contract basis | New Job | YP Law | Hold |
| CTO and CISO on deputation basis | New Job | CTO/CISO | Hold |
| Joint/Deputy/Asst Director (IS) on deputation | New Job | IS Directors | Hold |
| LDCE for promotion to Section Supervisor and LDC/JSA, intimation of cities and date | Update | LDCE Section Supervisor | Hold (departmental) |
| Deputy Director (Audit) and Asst Director (Audit) on deputation | New Job | Audit | Hold |
| Vigilance Assistant on deputation (2024) | New Job | Vigilance Assistant | Hold |
| Programmer on deputation | New Job | Programmer | Hold |
| Consultant (International Cooperation), retired officers, contract | New Job | Consultant Intl Coop | Hold |

## Proposed config
Unchanged from sources.json:
```json
{"id":"epfo","type":"html","url":"https://www.epfo.gov.in/archive-recruitments","allowedHosts":["pmvbry-cdn.epfindia.gov.in"],"rowSelector":".jobgrid","rowTitle":"h4.job-title","rowLink":"a.card","minTitle":15,"limit":40}
```

## Uncertain
- Direct-recruitment EPFO posts appear through UPSC and NTA, so this page is mostly HOLD noise. Keep it anyway (cheap, free) in case a direct notice is posted.
- No dates on the page, so age cannot be judged from it.

## BatLee's corrections
none yet

## Repairs
none
