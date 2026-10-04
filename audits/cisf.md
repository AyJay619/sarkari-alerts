## BATCH SUMMARY BLOCK
SITE: CISF | VERDICT: FIX
PROPOSED: 1) add source cisf-ticker (FREE, same URL https://www.cisf.gov.in/home.php, selector `marquee a[href$=".pdf"]`, minTitle 12, limit 20, allowEmpty) to catch the "LATEST" ticker; 2) leave existing cisf source unchanged (works, 22 items, 4/4 repeats stable)
MISSING TODAY: ticker notice "Admit Card for PST and Documentation, Paramedical Staff 2026" (assets/pdfs/2026/08/rectt_imp_not_pmsr_eng.pdf) is not in the news cards; the recruitment portal cisfrectt.cisf.gov.in notice board is also not watched
ASK BATLEE: none (recruitment portal not proposed: its links change on every load, so it would flood; recommend skipping)

# CISF
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, not yet approved)

## Pages watched and tested
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Home (news cards, current source `cisf`) | https://www.cisf.gov.in/home.php | scanner free fetch, 15s ok | FREE-OK, 22 items, 4 repeats identical |
| Home ticker (marquee "LATEST") | same URL | free | FREE-OK, 3 PDF links today |
| recruitment.php / cisfnews.php / archives.php | https://www.cisf.gov.in/... | free | Not useful: static rank info, DG messages, press clippings |
| Recruitment portal notice board | https://cisfrectt.cisf.gov.in/ | free | Loads, 4 notices, BUT link is `file_open.php?fnm=<token>` and the token differs on every load (checked twice) -> would re-alert every scan. Do not add. |

PDFs download free (direct nginx 200). `www.` works; no-www also redirects fine. Cookie PHPSESSID is set but not needed.

## Posting speed / what is caught
Home page has 24 `.news-card` items (newest first, about 3 months deep, PDFs under /assets/pdfs/YYYY/MM/). The current source gets 22 (2 dropped by its exclude regex: DG message, POSH handbook = correct). The marquee ticker holds the newest "NEW" items and can include admit cards/notices that never appear as a card (today: PMS admit card). Commented-out (`<!-- -->`) ticker entries are ignored by the HTML parser, good.

## Label pattern
No type prefix. Title is a plain heading, e.g. "Deputation to SPG", "Recruitment of Paramedical Staff 2026", "CISF AC-LDCE 2026: Interview Schedule". Type must be read from the words (Recruitment / Filling N posts / vacancy = job; Admit Card; Interview Schedule; Corrigendum). Parent = the post/exam name ("Paramedical Staff in CISF - 2026", "CISF AC-LDCE 2026", "AC/Fire in CISF"). PDF filenames are numbered letters (no advert number), e.g. 1854_depu_spg.pdf. Ticker titles are long sentences; parent can be cut at "has been uploaded".

## Hold / pass rules (for the sorter)
HOLD: "Deputation ..." / "Vacant posts in <other org>" (BPR&D etc.), "Filling N posts ... on deputation", "Accts Officer ... depu", seniority lists, scholarships (DG scholarship, PMSS, PM Rashtriya Bal Puruskar), MBBS/BDS seats for wards, allowance clarifications, debarment of firms, MoUs, DG messages, POSH handbook, press clippings / media pages.
PASS: "Recruitment of Paramedical Staff 2026" and any corrigendum / admit card / PST-documentation / result for it, CISF recruitment notifications (Constable/Fire, ASI/HC exams), CISF AC-LDCE interview schedule only as current-cycle interview schedule (LDCE itself = departmental, so HOLD per standing rule unless BatLee says otherwise).
Note: "Filling 02 posts of AC/Fire in CISF" is usually a deputation/absorption circular -> HOLD unless the PDF says direct recruitment.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Draft Seniority List - Medical Officers | Noise | - | Hold |
| Deputation to SPG | Noise | - | Hold |
| Deputation of DIG/Fire in CISF | Noise | - | Hold |
| CISF AC-LDCE 2026: Interview Schedule | Update | CISF AC-LDCE 2026 | Hold (LDCE) |
| Deputation to NEPA Umsaw | Noise | - | Hold |
| Debarment of Swastik Boot Factory, Agra | Noise | - | Hold |
| Clarification on Tough Location Allowance | Noise | - | Hold |
| PMSS guidelines for AY 2026-27 | Noise | - | Hold |
| MBBS/BDS seats for wards of CAPF/AR | Noise | - | Hold |
| Filling 02 posts of AC/Fire in CISF | New Job? | AC/Fire | Hold (likely deputation, check PDF) |
| Deputation in GAIL (Security Advisor) | Noise | - | Hold |
| DG Scholarship for 2026 | Noise | - | Hold |
| Vacanct posts in BPR&D | Noise | - | Hold |
| Recruitment of Paramedical Staff 2026 | New Job | Paramedical Staff CISF 2026 | Pass |
| 01 vacancy of Accts Officer in CISF | New Job (deputation) | Accts Officer | Hold |
| Admit Card for PST and Documentation, Paramedical Staff 2026 (ticker) | Admit Card | Paramedical Staff CISF 2026 | Pass |
| MoU between Sanrakshika and Haldiram Skill Academy | Noise | - | Hold |

## Proposed config (JSON)
```json
{
  "id": "cisf-ticker",
  "name": "CISF Latest ticker",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.cisf.gov.in/home.php",
  "selector": "marquee a[href$=\".pdf\"]",
  "titleReplace": ["\\s+has been uploaded on.*$", ""],
  "exclude": "mou\\b|message",
  "minTitle": 12,
  "limit": 20,
  "allowEmpty": true
}
```
(New source, rebaselines on first run. Existing `cisf` source stays as is. Exclude/titleReplace are cosmetic; per the no-filter rule they could be dropped and left to the sorter. The title cut is a display trim only, tested without it: titles come through intact.)

## Uncertain
- Ticker has only a few entries and they stay for months; allowEmpty keeps it quiet if the marquee empties.
- Recruitment portal tokens: if CISF later gives stable links it is worth watching (it holds PMS notices/admit cards), but today no.
- Not checked: the contents of the PDFs (sample classification is from titles only).

## BatLee's corrections
- none yet

## Repairs
- none
