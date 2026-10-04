# ISRO
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## BATCH SUMMARY BLOCK
SITE: ISRO | VERDICT: FIX
PROPOSED: 1) isro: raise limit 30 -> 45 (page has 32 matching rows today, so the current 30 already cuts 2 off); no URL change, no rebaseline needed.
MISSING TODAY: 2 oldest rows beyond limit 30 (SDSC/PRL type centre ads, already old); nothing else found.
ASK BATLEE: none

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Careers (what's new list of all centres) | https://www.isro.gov.in/Careers.html | free fetch, https + www, 3/3 OK, 30-140 ms | FREE-OK |
| http variant | http://www.isro.gov.in/Careers.html | 301 to https | not needed |
| no-www | https://isro.gov.in/Careers.html | no answer from curl (not usable) | use www |
| CurrentOpportunities.html / ViewAllOpportunities.html | same host | loads, but only index of centre pages ("View More Details"), no dated notices | not useful, not proposed |

Links on Careers are centre pages (e.g. ICRB_Recruitment11.html), not PDFs; several different notices share the same centre-page link. The seen key is title+link so each notice is still new on its own. Not a flood risk, titles are stable across 3 repeats.

## ScrapFly
Not needed. Free fetch works.

## Scanner catch vs page
Page has 32 notice rows (plus 2 junk anchors "Home", "here" dropped by minTitle). All 32 pass the include filter, so the current limit 30 leaves 2 out. Posting speed: ISRO posts about 1-3 notices a day at peak, well inside a 45 limit.

## Label pattern
`Advt. No. <ADVT-ID> dated <date> - <what>` where the ADVT-ID carries the centre and number:
- ISRO:ICRB:01(A-JPA):2026 (central board: Assistants/JPA/UDC/Steno), ISRO:ICRB:02(EMC):2025, ISRO:ICRB:03(EMC):2026 (Scientist/Engineer SC)
- LPSC/02/2026, URSC:01:2026, ISTRAC:02:2026, IPRC/RMT/2026/01, SAC:02:2026, NRSC/RMT/1/2026, HSFC:01:RMT:2026, NESAC/RMT-TEMP/WI-02/2026, PRL 01/2026, SDSC SHAR/RMT/02/2026
- DoS/NSIL: DS_IX-14011/1/2026-Section_9-DOS (deputation / absorption)
PARENT = the advertisement ID (clean: "ISRO ICRB 01(A-JPA)/2026", "URSC 01/2026" ...). The text after the dash gives the TYPE: "Inviting applications / Recruitment to the post" = New Job; "Admit Card" = Admit Card; "List of candidates screened in", "Selection Panel" = Result; "Answer keys", "Response Sheet / Objection" = Answer Key; "Corrigendum", "Date of conducting CBT", "Schedule of interview", "Skill Test date", "change of post & zone preference" = Update. Case varies (ADVT NO / Advt. No. / Advertisement No.), match case-insensitively. Some titles omit the Advt prefix (Selection Panel..., Schedule of Interviews..., Admit Card Download Link...), the advert ID is then inside the text ("against Advertisement No. URSC:01:2026").

## Hold / pass rules for the sorter
- HOLD: deputation / contract / immediate absorption posts (NSIL Chairman-cum-MD, NSIL Director (T&S), DoS Director posts "Revised: Advt DS_8C-12012" - central govt officer posts via deputation, check text before holding), temporary research personnel / JRF / project scientist / RA only if BatLee deems them consultant-type (see ask-free default: these are fixed-term project jobs, PASS as normal jobs unless text says consultant), apprentices PASS.
- HOLD: Hindi duplicates, time tables, press notes if they appear.
- PASS: all Inviting applications / Recruitment, admit cards, screened-in / selection panel lists, answer keys / response sheets, corrigenda, CBT/skill-test/interview dates, post and zone preference links.

## Sample links (audit day)
| Title (short) | Type | Parent | Pass/Hold |
|---|---|---|---|
| ISTRAC:02:2026 - CBT conducted, response sheets, objections | Answer Key | ISTRAC 02/2026 | Pass |
| URSC:01:2026 - Answer keys, Scientist/Engineer (Industrial Eng) | Answer Key | URSC 01/2026 | Pass |
| DS_8C-12012/1/2026 Director (Revised) | New Job/Update | DoS Director post | Hold (deputation-type) |
| ICRB:02(EMC-CEPO):2026 - List screened in for interview | Result | ISRO ICRB 02(EMC-CEPO)/2026 | Pass |
| LPSC/03/2026 - Scientist/Engineer SC | New Job | LPSC 03/2026 | Pass |
| ICRB:01(A-JPA):2026 - Skill Test tentative date 25 Oct | Update | ICRB 01(A-JPA)/2026 | Pass |
| ICRB:01(A-JPA):2026 - Response sheet and objection portal | Answer Key | ICRB 01(A-JPA)/2026 | Pass |
| IPRC/RMT/2026/01 - Tech Assistant, Technician B, Cook, Fireman | New Job | IPRC 01/2026 | Pass |
| ISTRAC:02:2026 - Admit card CBT | Admit Card | ISTRAC 02/2026 | Pass |
| ICRB:03(EMC):2026 - CBT date 19 Oct | Update | ICRB 03(EMC)/2026 | Pass |
| ICRB:01(A-JPA):2026 - change of post and zone preference | Update | ICRB 01(A-JPA)/2026 | Pass |
| Admit Card link CBT Assistants/JPA/UDC/Steno 21-09-2026 | Admit Card | ICRB 01(A-JPA)/2026 | Pass |
| SAC:02:2026 - JRF, RA, Project Scientist-I | New Job | SAC 02/2026 | Pass |
| Selection Panel Medical Officer SC (URSC:01:2026) | Result | URSC 01/2026 | Pass |
| ICRB:02(EMC):2025 - Interview schedule Mechanical BE002 | Update | ICRB 02(EMC)/2025 | Pass |
| ICRB:03(EMC):2026 - Scientist/Engineer SC | New Job | ICRB 03(EMC)/2026 | Pass |
| DS_IX-14011/1/2024 - CMD in NSIL on deputation/contract | New Job | NSIL CMD | Hold |
| CORRIGENDUM 2 ICRB:01(A-JPA):2026 | Update | ICRB 01(A-JPA)/2026 | Pass |
| DS_IX-14011/1/2026 - Director (T&S) NSIL immediate absorption | New Job | NSIL Director | Hold |
| URSC:03:2026 - Graduate/Diploma apprentices | New Job | URSC 03/2026 | Pass |

## Proposed config (sources.json, isro entry)
```json
{
  "id": "isro", "name": "ISRO", "runner": "india", "tier": "FREE", "level": "central",
  "type": "html", "url": "https://www.isro.gov.in/Careers.html",
  "include": "Advt|Advertisement|Corrigendum|Schedule|Selection|Admit|Result|Recruitment",
  "minTitle": 30, "limit": 45
}
```
Only `limit` changes. The include keywords are not a "keyword filter to drop noise" but a topic filter already in place; every row on the page matches today. Suggest also adding "Answer|Response|Panel|Notice" is NOT needed now (nothing missed), but a future title without any of the include words would be dropped; low risk.

## Uncertain
- Central-board DoS Director "Revised" ad is hold-vs-pass judgement for the sorter (deputation-style).
- Page lists no dates per row; order on page is not strictly by date.
- no-www host did not respond to curl; not tested through fetchItems.

## BatLee's corrections
- none yet

## Repairs
- none
