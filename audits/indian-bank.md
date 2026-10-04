## BATCH SUMMARY BLOCK
```
SITE: Indian Bank Careers | VERDICT: FIX
PROPOSED: 1) Drop the "exclude" regex from "indian-bank" (it also kills real results: "List of roll numbers of shortlisted candidates", "List of Candidates called for ... interview"); hold annexures / address lists / forms in the sorter instead (standing rule: no keyword filters); rebaseline.
PROPOSED: 2) Keep render:true (REQUIRED: plain Node fetch gets "Request Rejected" from the WAF; 5/5 render fetches OK ~5 s, 0 credits), url, include "documents/20117/34414" (rosters live under /34438 and stay out) and limit 60 unchanged.
MISSING TODAY: nothing important found (page is newest-first, one page holds ads, results, call-letter notices, corrigenda); but titles are generic ("Detail Advertisement", "Corrigendum 1", "Final Result") so the sorter must take the parent from the PDF filename.
ASK BATLEE: none (render is already free local Chromium; ScrapFly not needed). Note: if the render browser is missing on the India runner this site silently fails, same as FCI.
```

# Indian Bank Careers
Audited: 2026-10-04 | Group: FREE (render, local Chromium) | Status: ACTIVE (batch audit, no config changed)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Career / Current Openings (one list: ads, notices, results, corrigenda, forms) | https://indianbank.bank.in/en/career | render:true (pinned Chromium), https, no www | FREE-OK (5 of 5 fetches, 5-6 s, 0 credits) |
| same URL, plain Node fetch (render false, also classicTls / legacyTls) | https://indianbank.bank.in/en/career | free fetch | FAILS: 244-byte "Request Rejected" WAF page (curl and a real browser get the 830 KB page, so it is the Node request that is refused). Render is therefore needed. |
| www host | https://www.indianbank.bank.in/en/career | curl only | 301 redirect to non-www; plain http gave no answer. Use https non-www. |
| Reservation rosters | links under /documents/20117/34438/ | - | not job notices; correctly outside the include |
| Result portals (career_result_main, career_result_so_call_letter) | indianbank.bank.in | login (roll no / DOB) | not tested, need candidate login; the PDFs announcing them appear on the main list |
| Tenders | /en/tender | - | not recruitment, skipped |

No separate results / notices page exists: the career page is the single "everything" page (blocks: Current Openings, Download Forms, Reservation Rosters).

## What the scanner catches vs misses
- Scanner result today with current config: 60 items (limit hit), identical order across 5 runs. Without include/exclude/limit: 500 anchors, of which 273 are career documents (/34414) and 244 survive the current exclude (29 dropped).
- Catches: new PDFs on the list (new row = new link). Page is newest first (top items upload stamp 2026_09_22, then 09_03, 09_02; the 2026_05_0x stamps are an old bulk migration). Limit 60 covers the last months; the old archive sits beyond it, so the limit is fine.
- Posting speed: the list is the notice board itself, new PDFs appear at the top; no lag measurable from one day of data.
- Flood check: link = file name + upload timestamp + UUID. Stable across runs. Risk: when the bank re-uploads an old document (e.g. "Notice for Clerks allotted under IBPS CRP XV" exists as a 2026_05_01 and a 2026_09_02 version) the link is new and it looks like a new item once; the sorter should treat it as a repeat of the earlier notice.
- Misses: the exclude regex words "qualified", "roll no", "unique id" hide genuine result / shortlist PDFs (e.g. "List of roll numbers of shortlisted candidates for main exam"). Nothing else.

## Label pattern
- Titles are the link text and are often generic: "Detail Advertisement", "Detailed Advertisement", "English Advertisement", "Hindi Advertisement", "Corrigendum 1", "Final Result", "Notice for Interview Schedule". PARENT therefore comes from the PDF file name in the link, e.g.
  - Advertisement-for-Recruitment-of-Specialist-Officers -> "Specialist Officers 2026 (Indian Bank)"
  - Detailed-Advertisement-for-engagement-of-Fire-Safety-Officers -> "Fire Safety Officers"
  - ...Recruitment-of-Sportspersons-for-FY-2025-26 -> "Sportspersons FY 2025-26"
  - Web-Notice-IBPS-CRP-SPL-XV... -> "IBPS CRP SPL XV (Indian Bank allotment)"
  - Corrigendum-1 / Corrigendum2 -> the rows next to it with the same upload stamp (e.g. 2026_05_04_17_45_20 belongs to one Specialist Officers drive); sorter matches by stamp neighbours and PDF contents.
- Rows with the same upload stamp (YYYY_MM_DD_HH_MM_SS inside the file name) belong to one upload batch, usually one recruitment.
- Hindi twins: title contains "(Hindi)" / "Hindi Advertisement" or is in Devanagari; the English twin is a separate row.
- Type words: "Advertisement" = New Job; "Interview Schedule", "Document Verification Schedule", "shortlisted for interview" = Update (current cycle, pass); "Result", "provisionally selected", "Allotted under IBPS CRP", "Reserve List" = Result; "Corrigendum", "Addendum", "Extension of last date" = Update.

## Hold / pass rules for the sorter
Hold: Annexure I / II (address lists, list of candidates and venue), "Application Format / Application Form", "Scribe Declaration Form", "Acquaint Yourself booklet", "Information Handout", "Guidance 1/2 to students", "Instructions Page", "List of documents to be carried", Hindi twins of an English advert, contract engagements for single or small roles (Authorised Doctor per zonal office, INDSETI office assistant / attender / faculty, Internal Ombudsman, Treasury Consultant, CFO / CRO type posts, IBA deputy chief executive), FLC / financial literacy counsellor, statistics notices (cut-off marks, vacancies vs applications registered), joining / induction-training details unless BatLee wants IBPS allotment notices, non-recruitment items (Vidya Lakshmi education loan form).
Pass: Specialist Officer / PO / Clerk / LBO / Sportspersons / Security Guard-cum-Peon adverts, Apprentices, exam / interview / document-verification schedules of the current cycle, shortlists, provisional selection and reserve lists, results, corrigenda / addenda / extensions of the current cycle. Old-cycle items (2018-2023, CRP VII / VIII): hold unless they are new links with a recent upload stamp.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Notice for Customer Service Associates under IBPS CRP CSA - XV (Reserve List Phase II) | Result | IBPS CRP CSA XV | Pass |
| Notice for Customer Service Associates Allotted under IBPS CRP CSA -XV | Result | IBPS CRP CSA XV | Pass (low value) |
| Notice on Selection (Basketball and Volleyball) | Result | Sportspersons FY 2025-26 | Pass |
| Detailed advertisement for Recruitment of Sportspersons for FY 2025-26 (English) | New Job | Sportspersons FY 2025-26 | Pass |
| Detailed advertisement for Recruitment of Sportspersons for FY 2025-26 (Hindi) | New Job | Sportspersons FY 2025-26 | Hold (Hindi twin) |
| Notice for Interview Schedule | Update | Specialist Officers 2026 | Pass |
| Notice for Document Verification Schedule | Update | Specialist Officers 2026 | Pass |
| Detail Advertisement (Recruitment of Specialist Officers, stamp 2026_09_02) | New Job | Specialist Officers 2026 | Pass |
| Hindi advertisement for Specialist Officers 2026 (Devanagari title) | New Job | Specialist Officers 2026 | Hold (Hindi twin) |
| Recruitment of Specialist Officers under IBPS CRP SPL - XV (Reserve List) | Result | IBPS CRP SPL XV | Pass |
| English Advertisement (Engagement of Authorised Doctor on contract basis) | New Job | Authorised Doctor, ZO Bahraich | Hold (small contract) |
| RESULT - LIST OF SELECTED CANDIDATES (Fire Safety Officers) | Result | Fire Safety Officers | Pass |
| Detailed Advertisement (Fire Safety Officers) | New Job | Fire Safety Officers | Pass if recent, else Hold |
| ENGAGEMENT OF SUPPORT STAFF ... INDSETI KALLAKURICHI ON CONTRACT BASIS | Noise | INDSETI | Hold |
| Detailed Advertisement (Internal Ombudsman 28.01.2026) | New Job | Internal Ombudsman | Hold (single contract role) |
| Corrigendum 1 / Corrigendum 2 | Update | Specialist Officers (2026_05_04 batch) | Pass (match parent by upload stamp) |
| Details of candidates shortlisted for interview - date, time and venue | Update | Specialist Officers | Pass |
| SCRIBE DECLARATION FORM | Noise | - | Hold |
| Application Format | Noise | - | Hold |
| ACQUAINT YOURSELF BOOKLET - ENGLISH | Noise | - | Hold |

## Proposed config (full source, replaces the existing entry)
```json
{
  "id": "indian-bank",
  "name": "Indian Bank Careers",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://indianbank.bank.in/en/career",
  "render": true,
  "include": "documents/20117/34414",
  "limit": 60
}
```
Only change: "exclude" removed. The scanner re-baselines the source on its first run, so nothing floods.

## Uncertain points
- Why the WAF rejects Node but accepts curl was not investigated further (code is off limits); render works, so no action is needed. ScrapFly was not tested and is not needed.
- The delay between the bank publishing and the PDF appearing cannot be measured from one day of data.
- Allotment / joining notices for IBPS CRP (reserve lists, pre-joining verification) are marked Pass as "results incl. reserve lists" per the standing decisions; they are low value for job seekers and BatLee may prefer to hold them.
- Upload stamps in link names (2026_05_04 = migration date) are not real publish dates; use the 2026_09_xx stamps only as a rough recency hint.

## BatLee's corrections
- none yet

## Repairs
- none
