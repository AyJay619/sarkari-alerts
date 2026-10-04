## BATCH SUMMARY BLOCK
SITE: Indian Coast Guard CGCAT (icg) | VERDICT: FIX
PROPOSED: 1) add FREE json source icg-news = https://joinindiancoastguard.cdac.in/cgcat/getScrollJson (titleFormat "{Data}", linkField url, limit 15, allowEmpty, timeoutMs 15000, rebaseline) - needs relative-link handling, see ASK; 2) add timeoutMs 15000 to icg (no other change)
MISSING TODAY: merit lists, result/admit-card notices, date extensions (only in the JSON feed behind the home page news ticker, not in the HTML the scanner reads); last entry is Dec 2025, nothing newer today
ASK BATLEE: JSON links are mixed: PDFs are relative ("./assets/img/news/..."), login/registration links are absolute, and config linkPrefix is all-or-nothing. Recommend a tiny code change (resolve relative links against the source URL); config-only fallback is fallbackLink = site home (no PDF link, titles still unique)

# Indian Coast Guard (CGCAT)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (current source icg works, but sees only 2 links)

## Pages watched and tested
| Source | URL | Fetch | Verdict |
|---|---|---|---|
| icg (existing) | https://joinindiancoastguard.cdac.in/cgcat/ | free, 640 ms first, 35-50 ms after, 5/5 repeats = 2 items; http also works | FREE-OK |
| icg-news (proposed) | https://joinindiancoastguard.cdac.in/cgcat/getScrollJson | free, JSON, 77 entries, stable | FREE-OK (the page's own news ticker loads this by JavaScript) |

Other endpoints seen: getNoticeJson (16 entries, only registration extensions, all 2023-2025 login links), getAnnouncementJson (same 77 entries as getScrollJson). /cgcat/upcoming is a static list of advertisement PDFs by batch (2023-2027), same new ad appears also on the home page drop-down. Login/registration lives on /cgcatreg (login only, not watchable). PDFs: HEAD gives 403 but GET downloads fine (200, 936 KB advertisement), so PDFs are free.

## What the scanner catches vs misses
- icg today: "CGCAT 2027 Advertisement: English" (Advertisement_for_Asst_Comdt_2027_Batch.pdf) and "Downloads: Instructions Regarding Tattoo" (Tatto.pdf, static, noise). A new batch advertisement will appear as a new PDF link in the Advertisement drop-down, so new jobs are caught. Results, merit lists, admit-card notices and date extensions are NOT on the HTML (they come from the JSON ticker, with start/end dates, so they vanish from the page after the end date).
- Posting speed: the ticker shows entries only between startDate and endDate (days to weeks); with the JSON feed holding the full history there is no way for an item to be pushed off before a scan.
- Flood check: JSON has 77 historical entries; the first run on the new source must rebaseline (automatic for a new source). Newest entries are on top; limit 15 is enough. Many entries share the same login link, so titles (which carry dates) are the identity.
- Dates inside titles/ticker: JSON titles hold HTML (<sup>th</sup>); titleFormat "{Data}" turns it to plain text.

## Label pattern
- Advertisement PDF: Advertisement_for_Asst_Comdt_<year>_Batch.pdf -> New Job, parent "Indian Coast Guard Assistant Commandant <year> batch" (CGCAT <year>). Title from page: "CGCAT <year> Advertisement: English".
- JSON titles: free text with batch year: "MERIT LIST ... ASSISTANT COMMANDANT-2026 BATCH" (Result), "UPDATED MERIT LIST ... AS ON <date>" (Result/update), "Result of Stage-I (CGCAT) of Assistant Commandant-2027 batch" (Result, login only), "Important Notice to Candidates for Stage-I: CGCAT 2027 batch" (Update/Admit Card), "Exam Date and name of Exam City ... E-Admit Card" (Admit Card, login), "last date ... extended" / "Online Registration ... will be available" (New Job / Update), "Correction window" (Update).
- Parent: "CGCAT <batch year>" / "Assistant Commandant <year> batch".

## Hold / pass rules for the sorter
Hold: Tattoo instructions and other static Downloads / FAQ / document-format pages, medical standard PDFs unless tied to a new cycle, duplicate entries repeated in getNoticeJson, old (pre-2025) entries on first catch.
Pass: new batch advertisement, registration open / last-date extension, correction window, admit-card and exam-city notices, Stage-I/II/III results, merit lists and updated merit lists, document verification / final selection notices.
Note: result and admit-card entries point to a candidate-login page (cgcatreg); the link is not a PDF, treat as "official page" and use the title.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| CGCAT 2027 Advertisement: English (Advertisement_for_Asst_Comdt_2027_Batch.pdf) | New Job | CGCAT 2027 batch | Pass |
| Downloads: Instructions Regarding Tattoo | Noise | - | Hold |
| UPDATED MERIT LIST OF CANDIDATES FOR ASSISTANT COMMANDANT-2026 COURSE AS ON 22 DEC 25 | Result | Asst Comdt 2026 | Pass (old) |
| MERIT LIST OF SELECTED CANDIDATES FOR ASSISTANT COMMANDANT-2026 BATCH | Result | Asst Comdt 2026 | Pass (old) |
| Result of Stage-I (CGCAT) of Assistant Commandant-2027 batch is available ... | Result | CGCAT 2027 | Pass (old) |
| Exam Date and name of Exam City for CGCAT-2027 ... E-Admit Card ... | Admit Card | CGCAT 2027 | Pass (old) |
| Important Notice to Candidates for Stage-I: CGCAT 2027 batch | Update | CGCAT 2027 | Pass (old) |
| Correction window for CGCAT 2027 batch 04-05 Aug 2025 | Update | CGCAT 2027 | Pass (old) |
| Last date for application extended to 27 Jul 2025, Asst Comdt 2027 | Update | CGCAT 2027 | Pass (old) |
| Online Registration for Asst Comdt 2027 batch 08-23 Jul 2025 | New Job | CGCAT 2027 | Pass (old) |
| Last date extended to 31 Dec 24, Asst Comdt 2026 | Update | CGCAT 2026 | Pass (old) |
| Advertisement for Officers 2026 batch (/upcoming) | New Job | CGCAT 2026 | Pass (old) |

## Proposed config
```json
{"id":"icg","timeoutMs":15000}
{"id":"icg-news","name":"Indian Coast Guard (CGCAT news ticker)","runner":"india","tier":"FREE","level":"central","type":"json",
 "url":"https://joinindiancoastguard.cdac.in/cgcat/getScrollJson",
 "titleFormat":"{Data}","linkField":"url","fallbackLink":"https://joinindiancoastguard.cdac.in/cgcat/",
 "minTitle":5,"limit":15,"allowEmpty":true,"timeoutMs":15000}
```
Relative PDF links ("./assets/...") need resolving against https://joinindiancoastguard.cdac.in/cgcat/ (code change, or accept homepage link). New source rebaselines itself; icg URL/selectors unchanged so no rebaseline needed there.

## Uncertain
- Tested the JSON through fetchItems with linkField/linkPrefix: works (77 entries) but relative links stay relative, see ASK.
- No newer-than-Dec-2025 entries exist, so I could not see how a live 2028-batch advertisement will be announced; the site normally adds it to the home drop-down (icg catches) and to the ticker.
