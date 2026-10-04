# BARC (Bhabha Atomic Research Centre)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (proposal pending)

## BATCH SUMMARY BLOCK
```
SITE: BARC (barc-vacancies, barc-results) | VERDICT: FIX
PROPOSED: 1) ADD FREE source "barc-eadv" = recruit.barc.gov.in nbArchive.jsp?unit=ADV (real job adverts), rebaseline. 2) ADD FREE source "barc-enotice" = nbArchive.jsp?unit=BARC (screening lists, call letters, final results of Advt 06/2026 etc.), rebaseline. 3) barc-vacancies: add allowEmpty:true (page often empties) + timeoutMs 15000. 4) barc-results: no change (works, 19 rows, stable).
MISSING TODAY: The live Advt 06/2026 (SA/B, SA/C paramedical, 16-Jul) and all its Screened IN/OUT lists (latest 01-Oct-2026) are NOT on careers/recruitment.html or result.html; they are only on recruit.barc.gov.in.
ASK BATLEE: none (new pages follow standing decision: add as FREE with rebaseline).
```

## Pages watched and tested (all free fetch via scanner fetchItems)
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Vacancies (existing, id barc-vacancies) | https://barc.gov.in/careers/recruitment.html | free, ~0.1-0.8 s, 4/4 runs OK | FREE-OK but nearly empty: 1 row (RE-2/2026 retired consultants, last date 21-Sep-2026). Real adverts are not posted here. |
| Results (existing, id barc-results) | https://barc.gov.in/careers/result.html | free, ~0.1 s, 4/4 runs OK, 19 rows | FREE-OK. Newest row result23.pdf (CAC minutes, mostly noise). Mostly older ESM/consultant/medical walk-in results. |
| E-Recruit adverts (NEW) | https://recruit.barc.gov.in/barcrecruit/nbArchive.jsp?unit=ADV | free, ~0.1-0.3 s, 3/3 OK, 56 rows | FREE-OK. Type "New Vacancy" rows, newest 16-Jul-2026 (Advt 06/2026). |
| E-Recruit notice board (NEW) | https://recruit.barc.gov.in/barcrecruit/nbArchive.jsp?unit=BARC | free, ~0.2 s, 3/3 OK, ~475 rows | FREE-OK. Date, Type (Others / Final Result / New Vacancy / Instruction / Call Letter), Advt no., Subject. Newest 01-Oct-2026. |

URL variants: http redirects (301) to https; www and non-www both answer 200. No block, no JS needed. barconlineexam.com does not answer (connection failed); barconlineexam.in only answered via the portal's redirect text, ignore. Other careers pages (admin, ass_tech, auxi, officers, training, ddfs...) are static info pages, no notices. nbArchive units DPS (last 2019), MYS (2022), NRB (2023), NRBK (2019) are stale, not worth watching. Guessed pages careers/walkin.html and trainee.html return 404.

ScrapFly: not needed (all FREE). PDFs: barc.gov.in/careers/*.pdf download free (vacancy23.pdf returned 200 application/pdf). Portal getDocument links not downloaded in this audit.

## Catches vs misses
- Scanner today (2 old pages): catches result PDFs and the RE-2/2026 consultant ad. MISSES the real recruitment cycle (Advt 06/2026: lists, written exam, results) because BARC posts those only on the e-recruit portal. Seen state shows only 1 + 19 items, and the Advt 06/2026 items were never caught.
- Posting speed: scanner limit for results is 40 and page has 19 rows; the notice-board archive can add 8 rows in one day (01-Oct-2026), so use limit 40 for the notice board and 15 for adverts.
- Link stability (flood check): old pages use stable result<N>.pdf / vacancy<N>.pdf names. Portal links use getDocument&pid=<n> (stable, increasing numbers). Row text is "date type advt subject" so titles are unique. 3 repeat runs identical, no flood.
- Duplicates: ADV lists each advert twice (English plus Hindi/second file, pid differ). Hindi duplicates are HOLD.

## Label pattern
- Portal row title (rowTitle self) comes out as: `<dd/mm/yyyy> <Type> <Advt no.> <Subject>`, e.g. "16/07/2026 New Vacancy 06/2026 Inviting applications for appointment to the posts of SA/B & SA/C (paramedical category) in BARC, Mumbai & RMRC, Kolkata".
- Parent = the advertisement number in the third field, normalised "Advt <no>" e.g. "Advt 06/2026", "Advt 05/2026(R-V)", "Advt 3/2026(R-V)" (RA fellowship), "Advt 4/2026(R-V)" (JRF). Post codes inside subjects (DR-01 SA/C Psychologist, DR-02 SA/B Pathology, DR-03 Radiography, DR-04 NMT) are sub-parents of Advt 06/2026.
- Old careers pages: row = "<Advt no.>" cell + title; parent from the title wording (e.g. "Diploma in Radiological Physics against advt. No. 05/2026(R-V)"). Old result titles often lack an advert number; match by post name.
- Type hints from portal Type column: New Vacancy = New Job (or an Update if subject says result/corrigendum), Final Result = Result, Call Letter = Admit Card, Others = read the subject (Screened IN/OUT list = Result/shortlist, written exam = Update), Instruction = Update/Noise.

## Hold / pass rules for the sorter
HOLD: Re-engagement of retired employees / consultants (RE-x/yyyy), part-time or locum consultants, compassionate appointment (CAC) minutes, Hindi version duplicates ("Hindi version", "(Hindi)"), "Instructions to candidates" generic forms, Screened OUT lists (low value; pass only if BatLee wants), stale MYS/NRB/DPS items. Locum walk-in interview results for medical posts are pass only if open posts (they are time-limited contract roles; recommend HOLD as small contract roles).
PASS: Any advert with type New Vacancy (SA/B, SA/C, stipendiary trainee, DipRP, JRF, RA fellowship), Screened IN lists, written exam / call letter notices, final results and wait-lists (JRF, RA, DipRP, apprenticeship), cancellations of recruitment (e.g. Work Assistant/A), corrigenda and addenda.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Re-engagement of Retired Employees of DAE ... Consultants Admin & Accounts / Driving | New Job | Advt RE-2/2026 | HOLD (retired consultants) |
| Inviting applications for posts of SA/B & SA/C (paramedical) BARC Mumbai & RMRC Kolkata | New Job | Advt 06/2026 | PASS |
| Final Screened IN list for Written Exam, DR-01 SA/C (Psychologist) (01/10/2026) | Result | Advt 06/2026 | PASS |
| Final Screened IN list, DR-02 SA/B (Pathology) | Result | Advt 06/2026 | PASS |
| Final Screened IN list, DR-03 SA/B (Radiography) | Result | Advt 06/2026 | PASS |
| Screened IN list, DR-04 SA/B (Nuclear Medicine Technologist) | Result | Advt 06/2026 | PASS |
| Final Screened OUT list, DR-01 SA/C (Psychologist) | Result | Advt 06/2026 | HOLD (optional) |
| List of candidates selected and wait-listed, Research Associate (RA) fellowship (24/09/2026) | Result | Advt 3/2026(R-V) | PASS |
| Final list of selected and waitlisted candidates, JRF 2026 (15/09/2026) | Result | Advt 4/2026(R-V) | PASS |
| Result of written test, Diploma in Radiological Physics 2026-27 | Result | Advt 05/2026(R-V) | PASS |
| Inviting applications for DipRP 2026-27 (22/05/2026) | New Job | Advt 05/2026(R-V) | PASS (closed 10-Jun, old) |
| Applications invited for RA Fellowship (Hindi version) | New Job | Advt 3/2026(R-V) | HOLD (Hindi dup) |
| Advertisement for Group A posts (Medical) BARC, RMC, RMRC (28/01/2026) | New Job | Advt 01/2026(R-IV) | PASS (old) |
| Minutes of the meeting of the CAC held on 20/07/2026 (result23.pdf) | Noise | none | HOLD |
| Result of Walk-in-Interview of Part time consultants posts (result15.pdf) | Result | consultants | HOLD |
| Result of walk-in-interview PGRMO and Non-DNB JRD/SRD 09.07.2026 (result19.pdf) | Result | BARC Hospital walk-in | HOLD (contract medical) |
| Cancellation of recruitment process, Work Assistant/A (result12.pdf) | Update | Work Assistant/A | PASS |
| List of candidates selected for apprenticeship training 2026-27 (result10.pdf) | Result | Apprenticeship 2026-27 | PASS |
| List of screened-in/screened-out candidates, DipRP against advt 05/2026(R-V) (result16.pdf) | Result | Advt 05/2026(R-V) | PASS |

## Proposed config (not applied)
```json
[
  { "id": "barc-vacancies", "...": "unchanged", "allowEmpty": true, "timeoutMs": 15000 },
  { "id": "barc-results",   "...": "unchanged" },
  {
    "id": "barc-eadv", "name": "BARC E-Recruit Advertisements", "runner": "india", "tier": "FREE", "level": "central",
    "type": "html", "url": "https://recruit.barc.gov.in/barcrecruit/nbArchive.jsp?unit=ADV",
    "rowSelector": "#notificationList tbody tr", "rowTitle": "self", "rowLink": "a[href]",
    "minTitle": 10, "limit": 15, "timeoutMs": 15000
  },
  {
    "id": "barc-enotice", "name": "BARC E-Recruit Notice Board", "runner": "india", "tier": "FREE", "level": "central",
    "type": "html", "url": "https://recruit.barc.gov.in/barcrecruit/nbArchive.jsp?unit=BARC",
    "rowSelector": "#notificationList tbody tr", "rowTitle": "self", "rowLink": "a[href]",
    "minTitle": 10, "limit": 40, "timeoutMs": 15000
  }
]
```
Both new sources were tested with fetchItems from a scratch script (3 runs each, identical output). They rebaseline on first run (new sources). Note the first baseline will hold the existing 40 notice-board rows silently; Advt 06/2026 items already there will not alert. If BatLee wants today's Advt 06/2026 lists to flow once, skip the rebaseline for barc-enotice.

## Uncertain points
- allowEmpty on barc-vacancies is a precaution: the page held a single row, and an emptied table could otherwise count as a failure.
- The notice board sorts by date descending; if BARC edits old rows the seen check will not re-alert (link keys are stable pid numbers).
- Portal PDF (getDocument) downloads were not tested (no file download done); old careers PDFs download free.
- Whether the portal drops in Hindi duplicates of every notice is only seen for adverts.

## BatLee's corrections
- none yet

## Repairs
- none yet
