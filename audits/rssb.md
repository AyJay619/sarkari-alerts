# RSSB (Rajasthan Staff Selection Board, rssb.rajasthan.gov.in) - 4 sources: rssb, rssb-advt, rssb-results, rssb-admit
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (sources.json NOT changed)

## BATCH SUMMARY BLOCK
```
SITE: RSSB (4 sources) | VERDICT: FIX
PROPOSED: 1) rssb-advt / rssb-results / rssb-admit: replace the rendered table by the site's own free JSON feed (type json, no render, legacyTls true), clean title "<Exam> <Year> : <Title>" (fixes the flood: titleReplace "^d+s+" lost its backslashes, so the row rank 1,2,3.. stays glued to every title and shifts on each new post).
PROPOSED: 2) rssb: URL to /news (static, 20 dated items, no render, legacyTls true) instead of the 10-item homepage ticker; 3) add rssb-answerkey (filterkey feed, 20 newest, FREE); all rebaseline by themselves.
MISSING TODAY: answer keys (answerkeys page not watched); results/advt/admit alert on every new post only as a mass re-fire (18 new at once) because titles shift; ticker shows only 10 notices.
ASK BATLEE: (a) add the answer-key source (recommended yes, 385 keys, 20 newest watched). (b) /press-notes and /key-objection pages skipped (press notes = hold by rule; key-objection has 4 old items); OK?
```

## Pages watched and tested (all by the scanner's own fetchItems, free, 0 ScrapFly credits)
| Page | URL | Method | Verdict |
|---|---|---|---|
| Notices (homepage ticker, existing) | https://rssb.rajasthan.gov.in/ | free fetch with render (Chromium, about 4.5 s) | FREE-OK but heavy; only 10 items |
| Notices (all, proposed) | https://rssb.rajasthan.gov.in/news (20 per page, dated, ?page=2.. for older) | free fetch, needs `legacyTls: true`, about 0.3 s | FREE-OK |
| Advertisements | https://rssb.rajasthan.gov.in/advertisements (table is filled by JS from JSON `/filteradv/0/0?page=1`) | JSON feed, free, legacyTls | FREE-OK |
| Results | https://rssb.rajasthan.gov.in/results (JSON `/filterresult/0/0?page=1`, 967 rows, 20 per page) | JSON feed, free, legacyTls | FREE-OK |
| Admit cards | https://rssb.rajasthan.gov.in/admitcards (JSON `/filteradmitcard/0/0?page=1`) | JSON feed, free, legacyTls | FREE-OK |
| Answer keys (new) | https://rssb.rajasthan.gov.in/answerkeys (JSON `/filterkey/0/0?page=1`, 385 rows) | JSON feed, free, legacyTls | FREE-OK |
| Question objection | /key-objection (JSON /filterkeyobj, only 4 rows, last 2022) | not worth watching | skip |
| Press notes | /press-notes (static, links storage/pressnote_item) | free | skip (hold type, see rules) |

Without `legacyTls` plain https fails with ERR_SSL_UNSAFE_LEGACY_RENEGOTIATION_DISABLED (this is why the old config used render). With legacyTls plain fetch works. http redirects (302) to https; no www variant used or needed. Feed URL with the two `0` path parts = "no year / no exam filter" = newest first across all exams. PDFs: `https://rssb.rajasthan.gov.in/storage/<kind>_item/<file>.pdf`, kinds news_item, advertisement_item, result_item, admitcard_item, answerkey_item. PDF download not tested through the scanner (not needed by the scanner).

## Why rssb-results returned 18 new links at once (cause found)
The three table sources use `rowTitle: "self"` with `titleReplace ["^d+s+", ""]`. In sources.json the backslashes are missing (`d` and `s` instead of `\d` and `\s`), so the rank cell number (1, 2, 3 ...) is never removed and, because the cells have no separator, it is glued to the date: "129-09-2026Contractual Jr. ..." (rank 1, date 29-09-2026). The seen record stores that title. Whenever a new row appears at the top, every row below moves down one rank, the title of every old row changes, and all 20 on the page look new. Seen record confirms it (keys start with "115-08-2026junior engineer...", "129-09-2026..."). The links (storage/..pdf) are stable; only the titles were not. In today's scan 5 genuinely new results (01-Oct) pushed the rest down: 18 "new" links. Same defect would hit rssb-advt and rssb-admit on their next post. Fix = clean titles from JSON fields (no rank). Tested: two fetches, 0 differences on all five feeds.

## Posting speed vs limit
Results: about 1000 rows over about 5 years; busy days post 5-15 rows (29-Sep: 15 rows, 28-Sep: more). The page is 20 per page: if more than 20 results are posted between two scans, the oldest of them fall off page 1 (possible on a big day such as 29-Sep with about 15+). Scans are frequent, so acceptable; the feed supports `?page=2` if BatLee wants a bigger window (would need a second source with url page=2, not proposed). Advertisements: about 1-3 per month. Admit cards: only about 5-8 per year (listed 19 items, newest 19-06-2026): rare, normal; `allowEmpty` not needed. Answer keys: several per week during exam season. Notices: about 20 in 5 weeks on /news (1 Aug - 3 Oct), so 20 items is plenty.

## Label pattern
- Notices: `<Exam> <Year> : <Subject>` e.g. "Lab Assistant 2026 : Important Information Regarding Absent Candidates For Document Verification"; general ones start "Exams 2026 : ...".
- Feeds (proposed titleFormat `{exam_name} {exam_year} : {title}` or `{result}`): same pattern, so PARENT = `<Exam> <Year>` taken before " : " (e.g. "Driver 2024", "LDC Grade II / Junior Assistant 2026", "Basic and Senior Computer Instructor 2026"). Advertisement title part is one of Short / Detailed / Amended Advertisement. Result part examples: "Final Recommendation and Cut Off Marks", "Meritwise List of Finally Selected Candidate's After Document Verification", "List of Shortlisted Candidate's for Type Test", "Provisional List of Candidates Passed in Written Examination". Capitalisation differs slightly between pages ("UPPER PRIMARY SCHOOL TEACHER 2025" vs "Upper Primary School Teacher 2025"): sorter should compare parents case-insensitively. Year in the parent is the recruitment year, not the exam date (Driver 2024 still active in 2026).
- Type: Advertisement page = New Job (Short/Detailed) or Update (Amended); admit card page and notices "Admit card issue date" = Admit Card; result page = Result; answer-key page = Answer Key; notice subjects "Schedule for ...", "Document Verification", "Last chance", "Corrigendum", "Question Objection" = Update.

## Hold / pass rules for the sorter (site-specific)
- Hold: "Press Note" notices (press notes about exam dates are info; but "Press Note regarding Exam Schedule" carries exam dates - recommend pass when it announces new exam dates for a current recruitment, hold generic "Press Note For Upcoming Exam Dates"); "Office Order Regarding Debarred Candidates" (debarment); "Committee report on scrutiny of ... candidates pursuant to court directions" (court/committee note); Hindi-only duplicates (titles with "विज्ञप्ति"/"शुद्धि पत्र" only if an English one exists; "Vigyapti of Question Objection" duplicates its Press Note: keep one); exam scheme / old paper / syllabus pages (not watched); vocational trade-test phase schedules for old recruitments are updates (pass, see below).
- Pass: advertisements (Short / Detailed / Amended), admit card issue date notices, all result items incl. shortlists, provisional / final recommendation and cut-off lists, document verification schedules and absent-candidate last chances, answer keys (Primary and Final), question objection windows, corrigenda, exam schedule / date notices, "Last chance of editing for online application form" (application extension, Update).
- RSSB result lists are many small per-post lists (for example 8 Stenographer / ANM lists on 29-Sep). Sorter should merge by Parent + date into one alert. "Order of Final Recommendation (01 Candidate)" style single-candidate lists are low value, merge or hold at BatLee's choice (recommend pass merged, they are real results).
- Contractual posts (NHM, Aayush Officer (Contractual), Community Health Officer (Contract), Jr. Tech. Assistant (Contractual)) are normal state recruitments run by RSSB: pass, not "consultant" noise.
- No keyword filters in the script (standing decision).

## Sample links (audit day, 2026-10-04)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Lab Assistant 2026 : Important Information Regarding Absent Candidates For Document Verification (news, 01-Oct) | Update | Lab Assistant 2026 | Pass |
| Live Stock Assistant 2024 : Order Of Final Recommendation (06 Candidates) | Result | Live Stock Assistant 2024 | Pass |
| Librarian Grade III 2024 : Order Of Final Recommendation (04 Candidates) | Result | Librarian Grade III 2024 | Pass |
| Contractual Teaching Associate (Raj-CES) 2026 : Press Note regarding Exam Schedule (Exam Dates & Time) | Update | Contractual Teaching Associate (Raj-CES) 2026 | Pass (carries dates) |
| Exams 2026 : Press Note For Upcoming Exam Dates | Update | Exams 2026 (general) | Hold (general press note) |
| Basic and Senior Computer Instructor 2026 : Press Note For Question Objection | Update | Basic and Senior Computer Instructor 2026 | Pass (one of the Vigyapti / Press Note pair; keep one) |
| Driver 2024 : Schedule for the Vocational Trade Test Phase - VI | Update | Driver 2024 | Pass |
| Physical Training Instructor (PTI) Grade III 2022 : Committee report on scrutiny of 35 candidates pursuant to court directions | Noise | PTI Grade III 2022 | Hold |
| Junior Engineer (JEN) 2026 : Short Advertisement (15-Aug-2026) | New Job | Junior Engineer (JEN) 2026 | Pass |
| Junior Engineer (JEN) 2026 : Detailed Advertisement | New Job | Junior Engineer (JEN) 2026 | Pass (merge with Short) |
| Lab Assistant 2026 : Amended Advertisement (03-Jul-2026) | Update | Lab Assistant 2026 | Pass |
| Common Eligibility Test(Graduation Level) 2026 : Detailed Advertisement | New Job | CET Graduation Level 2026 | Pass |
| Forester 2026 : Admit card issue date & Important Instructions (19-Jun-2026) | Admit Card | Forester 2026 | Pass |
| Stenographer 2024 : Final Recommendation and Cut Off Marks | Result | Stenographer 2024 | Pass |
| ANM (Contractual) 2023 : Meritwise List of Finally Selected Candidate's After Document Verification (List-07) | Result | ANM (Contractual) 2023 | Pass |
| LDC Grade II / Junior Assistant 2026 : List of Shortlisted Candidate's for Type Test (NTSP) | Result | LDC Grade II / Junior Assistant 2026 | Pass |
| LDC Grade II / Junior Assistant 2026 : Final Answer Key (Paper-1, Paper Code:DG28) | Answer Key | LDC Grade II / Junior Assistant 2026 | Pass |
| Basic and Senior Computer Instructor 2026 : Primary Answer Key (BCI Paper I) | Answer Key | Basic and Senior Computer Instructor 2026 | Pass |
| Basic and Senior Computer Instructor 2026 : Office Order Regarding Debarred Candidates (news, 14-Aug) | Noise | Basic and Senior Computer Instructor 2026 | Hold |

## Proposed config (sources.json; replaces the four rssb entries, adds rssb-answerkey)
```json
[
  { "id": "rssb", "name": "RSSB Notices", "runner": "india", "tier": "FREE", "level": "state", "type": "html",
    "url": "https://rssb.rajasthan.gov.in/news", "legacyTls": true, "timeoutMs": 15000,
    "include": "storage/news_item", "minTitle": 15, "limit": 30 },
  { "id": "rssb-advt", "name": "RSSB Advertisements", "runner": "india", "tier": "FREE", "level": "state", "type": "json",
    "url": "https://rssb.rajasthan.gov.in/filteradv/0/0?page=1", "legacyTls": true, "timeoutMs": 15000,
    "itemsPath": "data", "titleFormat": "{exam_name} {exam_year} : {title}",
    "linkField": "file_name", "linkPrefix": "https://rssb.rajasthan.gov.in/storage/advertisement_item/", "limit": 30 },
  { "id": "rssb-results", "name": "RSSB Results", "runner": "india", "tier": "FREE", "level": "state", "type": "json",
    "url": "https://rssb.rajasthan.gov.in/filterresult/0/0?page=1", "legacyTls": true, "timeoutMs": 15000,
    "itemsPath": "data", "titleFormat": "{exam_name} {exam_year} : {result}",
    "linkField": "result_link", "linkPrefix": "https://rssb.rajasthan.gov.in/storage/result_item/", "limit": 30 },
  { "id": "rssb-admit", "name": "RSSB Admit Cards", "runner": "india", "tier": "FREE", "level": "state", "type": "json",
    "url": "https://rssb.rajasthan.gov.in/filteradmitcard/0/0?page=1", "legacyTls": true, "timeoutMs": 15000,
    "itemsPath": "data", "titleFormat": "{exam_name} {exam_year} : {title}",
    "linkField": "file_name", "linkPrefix": "https://rssb.rajasthan.gov.in/storage/admitcard_item/", "limit": 30 },
  { "id": "rssb-answerkey", "name": "RSSB Answer Keys", "runner": "india", "tier": "FREE", "level": "state", "type": "json",
    "url": "https://rssb.rajasthan.gov.in/filterkey/0/0?page=1", "legacyTls": true, "timeoutMs": 15000,
    "itemsPath": "data", "titleFormat": "{exam_name} {exam_year} : {title}",
    "linkField": "file_name", "linkPrefix": "https://rssb.rajasthan.gov.in/storage/answerkey_item/", "limit": 30 }
]
```
Tested exactly this way with fetchItems: rssb 20 items, advt 20, results 20, admit 19, answerkey 20; each fetch about 0.25-0.5 s; two fetches, 0 differences; no render, no browser, no ScrapFly (0 credits). The "browser used: pinned Chromium" step disappears, saving about 4 runs of Chromium per scan.
Seen-check note: the URL and fields change, so the scanner rebaselines these sources silently on the first run; the new answer-key source starts baselined too.

## Uncertain points
- The JSON feeds are the site's own front-end calls (not documented); if RSSB redesigns, the sources fail with a clear "items list not found" error.
- Results feed order is by posting date; several rows share one date, order inside a date is not strictly by id, which is harmless because links are stable.
- Hindi duplicates: titles are English on all feeds seen; Hindi appears only inside PDFs and a few "( शुद्धि पत्र )" tags.
- PDF free-download from this PC through the scanner was not tested (not needed); site needs the legacy TLS handshake, so a PDF fetch by the sorter must allow it too.

## BatLee's corrections
- none yet

## Repairs
- none yet
