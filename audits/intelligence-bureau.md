## BATCH SUMMARY BLOCK
SITE: MHA / Intelligence Bureau Vacancies | VERDICT: OK
PROPOSED: none (optional: change limit 60 to 25, page shows 20 rows)
MISSING TODAY: IB's own recruitment (ACIO / Security Assistant / MTS) is NOT on this page; could not find its page on mha.gov.in (guessed URLs all 404). Page is MHA deputation/contract circulars only.
ASK BATLEE: Keep this source (almost all items are HOLD: deputation/consultant)? Recommend keep (cheap, free, catches CEPI/MHA contract and any real IB advert); and tell me the URL where IB adverts show up if you know it.

# MHA / Intelligence Bureau Vacancies
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, no config changed)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| MHA Vacancies | https://www.mha.gov.in/en/notifications/vacancies | free fetch (fetchItems), 4 runs, 127-271 ms, always 20 items | FREE-OK |
| MHA Notices (not recommended) | https://www.mha.gov.in/en/notifications/notice | free, works | Noise only (Delegation of powers, Extension of State Acts) |
| MHA Circulars (not recommended) | https://www.mha.gov.in/en/notifications/circular | free, works | Noise only (office orders, telecom suspension orders) |
| Page 2 | ...vacancies?page=1 | works, 10 more rows | Older items, not needed |

Home page menu has no recruitment / IB link. Guessed URLs (/en/recruitment, /en/commoncontent/ib-recruitment, etc.) return 404: not found, not a working page. mharecruitment.gov.in did not connect from this PC (not tested further).
Group FREE, 0 ScrapFly credits. PDFs are on the same host (www.mha.gov.in/sites/default/files/) and are not tested for download in this audit.

## What the scanner catches vs misses
Catches every row of the Vacancies table (20 rows, row selector works, links are PDFs via a.ext). Misses: any IB (Intelligence Bureau) recruitment notice if IB publishes elsewhere (its adverts normally sit on a separate IB/MHA recruitment page not linked from the menu). Unconfirmed.
Posting speed: about 1-2 items per week (Jul-Oct 2026: ~20 items in 10 weeks), far under limit 60. Links are stable PDF paths with date in the filename (ddmmyyyy); no flood risk seen.

## Label pattern
Title is free text of the form "Filling up of NN post of <Post> in <Office> on deputation basis-reg." or "Engagement of <Role> on Contract Basis in the Office of the Custodian of Enemy Property for India (CEPI)". Date is embedded in filename, e.g. SSB_vacancy_29092026.PDF = 29-09-2026. Parent = post + office (e.g. "Deputy Director, I4C"). Some titles contain OCR-garbled characters (CEPI shown as CEРІ with Cyrillic letters, "tCPs").

## Hold / pass rules for the sorter
HOLD: "on deputation basis" / "including short-term contract" (all MHA/CEPI/LPAI/SSB/I4C/SSF posts), retired officials as consultants, "Engagement of ... on Contract Basis", canteen manager posts, notices and circulars pages content.
PASS: an open direct-recruitment IB/MHA advert (ACIO, SA/MTS, JIO, etc.), exam/admit card/result, and extensions/corrigenda to a pass item. An "Extension of last date" for a deputation vacancy is HOLD.
Existing exclude regex (compassionate|qualified|roll no|unique id) kept; no keyword filters added (standing rule).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Filling up 01 post Manager Gr-II, MHA canteen (VacancyCircular_01102026) | New Job | Manager Gr-II MHA canteen | Hold (deputation, canteen) |
| Senior Instructor (Mountaineering) SSB (SSB_vacancy_29092026) | New Job | Sr Instructor SSB | Hold (deputation) |
| Member (Finance) LPAI (AppointmentMemberLPAI_21092026) | New Job | Member Finance LPAI | Hold (deputation) |
| Member (P&D) LPAI (PostMember(PD)LPAI_15092026) | New Job | Member P&D LPAI | Hold (deputation) |
| Deputy Director (Implementation) Dept of Official Language (DDVacancy_10092026) | New Job | DD Implementation | Hold (deputation) |
| Deputy Director I4C (i4Cvacancy_03092026) | New Job | DD I4C | Hold (deputation) |
| 30 retired Sr Accountant/Accountant as Consultants PAO CRPF/Delhi Police | New Job | Consultants PAO | Hold (retired, consultant) |
| Chief Supervisors, CEPI (1065CS_13082026) | New Job | CEPI contract | Hold (contract) |
| Data Analyst, CEPI (1063DA_13082026) | New Job | CEPI contract | Hold |
| Project Manager (IT), CEPI (1061PMIT_13082026) | New Job | CEPI contract | Hold |
| Senior Legal Consultants, CEPI (1066SLC_13082026) | New Job | CEPI contract | Hold |
| Surveyors, CEPI (1062Surveyor_13082026) | New Job | CEPI contract | Hold |
| Supervisor, CEPI (1064Supervisor_13082026) | New Job | CEPI contract | Hold |
| Senior Consultants, CEPI (1060SeniorConsultant_13082026) | New Job | CEPI contract | Hold |
| Extension of last date, LPAI Secretariat vacant posts | Update | LPAI deputation | Hold |
| SO, CEPI Kolkata (SOCepi_07082026) | New Job | SO CEPI | Hold (deputation) |
| ASO, CEPI Kolkata (ASOCepi_07082026) | New Job | ASO CEPI | Hold (deputation) |
| 03 Inspectors CEPI (CircularVacancy_03082026 / PostCEPI_31072026) | New Job | Inspector CEPI | Hold (deputation) |
| 02 UDC CEPI Delhi/Mumbai (VacancyUDC_31...) | New Job | UDC CEPI | Hold (deputation) |

## Proposed config (current one is fine; limit change is optional)
```json
{
  "id": "intelligence-bureau",
  "name": "MHA / Intelligence Bureau Vacancies",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.mha.gov.in/en/notifications/vacancies",
  "rowSelector": "tr:has(td.views-field-title)",
  "rowTitle": "td.views-field-title",
  "rowLink": "a.ext",
  "exclude": "compassionate|qualified|roll no|unique id",
  "limit": 60
}
```

## Uncertain
- Whether IB's real adverts are published on a page this scanner does not watch. Not found; not guessed.
- Source name says "Intelligence Bureau" but content is MHA-wide deputation/contract circulars.
- PDF direct download not tested.

## BatLee's corrections
- none yet

## Repairs
- none
