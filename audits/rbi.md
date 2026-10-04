# RBI Vacancies (opportunities.rbi.org.in)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (proposal, no config changed)

## BATCH SUMMARY BLOCK
SITE: RBI Vacancies | VERDICT: FIX
PROPOSED: 1) add source rbi-results = https://opportunities.rbi.org.in/Scripts/resultsnew.aspx (FREE, include "bs_viewcontent|Result_.*[.]aspx", limit 30, rebaseline)
PROPOSED: 2) add source rbi-calls = https://opportunities.rbi.org.in/Scripts/CallLetters.aspx (FREE, same include, allowEmpty, rebaseline); keep rbi (Vacancies) as is
MISSING TODAY: Results (Assistant, JE, Grade B scorecards) and Call Letters/admit cards pages are not watched at all
ASK BATLEE: none (nav/footer noise "Rosters at ROs", "COVID-19 Measures" is already in the seen baseline; sorter holds it)

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Current Vacancies (watched) | https://opportunities.rbi.org.in/Scripts/Vacancies.aspx | scanner free fetch, 4/4 OK, ~0.4s, 20 items | FREE-OK |
| Results (new) | https://opportunities.rbi.org.in/Scripts/resultsnew.aspx | free fetch OK, 20 items | FREE-OK |
| Call Letters (new) | https://opportunities.rbi.org.in/Scripts/CallLetters.aspx | free fetch OK, 1 real item today | FREE-OK |

Notes: plain curl gets a bot-challenge page (TSPD script), but the scanner's own fetch gets the real page every time. Keep using the scanner. https works; http also works. Lowercase "/scripts/Vacancies.aspx" returned no notices once (path case), so keep the capital-S URL. Page links are relative (bs_viewcontent.aspx?Id=NNNN), the scanner resolves them. Some Result rows link to rbi.org.in/Scripts/Result_*.aspx pages (hence the include widening). Year/month archive links on the page are JavaScript (GetYearMonth) and are not needed: the page already shows the latest ~18-20.

## Catch vs miss
- Vacancies page today: 18 real items, almost all part-time/contract Medical Consultant (BMC) ads and their extensions, plus Director IIBM Guwahati. No Grade B / Assistant / JE advert is open today (those appear here only when open).
- Scanner (limit 20) currently takes all 18 plus 2 noise links (Rosters at ROs Id=2801 from the menu, COVID-19 Measures Id=3894 from the footer). Both are in the seen baseline, so they will not alert again.
- Missed: results and call letters (see MISSING TODAY).

## Posting speed / link stability
New ids rise in order (latest vacancy 5178, results 5180, call letter 5113). Links are stable per id; no flood risk seen across 4 repeats (same 20 items, same order).

## Label pattern
Title = free text, no fixed prefix. Parent comes after the type words:
- Jobs: "Engagement of ... <post> ... at Reserve Bank of India, <city>" -> parent = post + city, e.g. "BMC, Chandigarh".
- Extensions: "Extension of last date for submission of Application - <same text as original>" -> Update, parent = the original text (match on post + city).
- Results/call letters: "Recruitment for the post of <Post> - Panel Year 2026: Display of Roll Numbers ..." -> parent = "<Post> PY 2026" (Assistant PY 2025, JE PY 2026, Officers Grade B (DR) General/DEPR/DSIM PY 2026, Non-CSG posts PY 2026).
- "Score Card and Cutoff marks ... Phase-I/Phase-II" -> Result.
- "Admit Card, Information Handout ..." -> Admit Card.

## Hold / pass rules for the sorter
HOLD: Medical Consultant / BMC part-time contract engagements (and their extensions) at RBI regional offices (small contract roles); Lateral Recruitment of Site Engineers on contract (lateral/consultant); Director IIBM (senior engagement, review case by case); Rosters at ROs (Id=2801); COVID-19 Measures (Id=3894); Promotion / Recruitment info pages (Id=2802, 4349, 3061); Vision/Values PDFs; Marksheet / scorecard pages of already-finished stages only if BatLee wants them held (default: pass, they are results).
PASS: Grade B (DR) / Assistant / JE / Non-CSG adverts when they appear, admit cards, roll-number result lists (Finally Selected / Provisionally Shortlisted), scorecards and cutoffs, extensions and corrigenda of those.

## Sample links (audit day)
| Title (short) | Type | Parent | Pass/Hold |
|---|---|---|---|
| Engagement of Part-time BMC ... Itanagar (5178) | New Job | BMC Itanagar | HOLD (contract) |
| Engagement of Medical Consultant (MC) ... Patna (5177) | New Job | MC Patna | HOLD |
| Engagement of BMC ... Bhubaneswar (5176) | New Job | BMC Bhubaneswar | HOLD |
| Inviting Applications for Post of Director, IIBM, Guwahati (5171) | New Job | Director IIBM Guwahati | PASS/review |
| Extension of last date ... BMC Bhopal (5167) | Update | BMC Bhopal | HOLD |
| Extension of last date ... BMC Chandigarh (5162) | Update | BMC Chandigarh | HOLD |
| Advertisement ... BMC Panaji, Goa (5149) | New Job | BMC Goa | HOLD |
| Rosters at ROs (2801) | Noise | - | HOLD |
| COVID-19 Measures (3894) | Noise | - | HOLD |
| Result - BMC ... Lucknow (5180) | Result | BMC Lucknow | HOLD |
| Assistant PY 2025 - roll numbers provisionally shortlisted (5179) | Result | Assistant PY 2025 | PASS |
| JE (Civil/Electrical) PY 2026 - roll numbers finally selected (5175) | Result | JE PY 2026 | PASS |
| Lateral Recruitment of Site Engineers ... (5169) | Result/Update | Site Engineers lateral | HOLD |
| Grade B (DR) DSIM Cadre PY 2026 - Result Phase-II (5155) | Result | Grade B DSIM PY 2026 | PASS |
| Assistant PY 2025 - Marksheet of Preliminary Exam (5152) | Result | Assistant PY 2025 | PASS |
| Grade B (DR) General Cadre PY 2026 - Result Phase-II (5147) | Result | Grade B General PY 2026 | PASS |
| Score Card and Cutoff - Non-CSG Legal Officer Grade B (Result_LegalOfficer...aspx) | Result | Non-CSG Legal Officer PY 2026 | PASS |
| Scorecard and Cut-off Phase-I Grade B (DR) General PY 2026 | Result | Grade B General PY 2026 | PASS |
| Admit Card, Info Handout ... Phase-II Grade B (5113) | Admit Card | Grade B (DR) PY 2026 | PASS |

## Proposed config (JSON, NOT applied)
```json
[
  { "id": "rbi-results", "name": "RBI Results", "runner": "india", "tier": "FREE", "level": "central",
    "type": "html", "url": "https://opportunities.rbi.org.in/Scripts/resultsnew.aspx",
    "include": "bs_viewcontent|Result_.*[.]aspx", "limit": 30, "timeoutMs": 15000 },
  { "id": "rbi-calls", "name": "RBI Call Letters", "runner": "india", "tier": "FREE", "level": "central",
    "type": "html", "url": "https://opportunities.rbi.org.in/Scripts/CallLetters.aspx",
    "include": "bs_viewcontent|Result_.*[.]aspx", "limit": 10, "allowEmpty": true, "timeoutMs": 15000 }
]
```
Existing `rbi` source unchanged (optionally add timeoutMs 15000). Both new sources catch the 2 menu/footer noise links (Id=2801, 3894) on first baseline only; they are then seen.

## Uncertain
- Call Letters page holds only 1 real item now, so allowEmpty is advised.
- Which of the Medical Consultant postings BatLee might still want is an editorial call; default HOLD as small contract roles.
- Grade B / Assistant new adverts did not appear on Vacancies today, so the label pattern for them is inferred from the results titles.

## BatLee's corrections
- none yet

## Repairs
- none
