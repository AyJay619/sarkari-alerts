# KVS (Kendriya Vidyalaya Sangathan)
Audited: 2026-10-03 | Group: FREE | Status: PROPOSED (audit written; sources.json NOT changed yet, waiting for BatLee's approval)

## Why kvs-notifications "timed out"
- The site is not slow and not blocking by user agent. When it answers it takes 0.2-0.4 s.
- Port 443 (https) of kvsangathan.nic.in (103.195.208.1) only accepts about 1 connection in 3 from this PC. The other attempts never even connect (no TLS error, no HTTP error, just silence until the timeout). Measured: curl https 6 successes out of 18 tries; Node (the scanner's own fetch code, fresh process) https 3 of 5 on one run, forcing a timeout on the other 2.
- Port 80 (http) of the same host answered every time: curl 8 of 8 plus 6 more, Node 8 of 8 (both pages), always HTTP 200, no redirect to https, 0.2-0.4 s.
- It is not a TLS/certificate problem (when https connects, the handshake and page are fine, no extra cert needed) and not a wrong page (the page is right).
- Why the scanner failed: 45 s timeout x 2 attempts, each attempt has only about a 1 in 3 chance. The earlier full scan happened to get through (10 on page, 0 new).
- The same flakiness hits kvs-results too (same host); it just got lucky in the logged runs.
- Could not test from another network or ScrapFly (SCRAPFLY_KEY not available in the audit shell). So I cannot say whether other networks see the same drops; it may be this PC's ISP route to the host, or a firewall on the site side that rate-limits new https connections. Either way http avoids it.

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Notifications/Recruitment (slug is "interview-notice"; the page title is Notifications/Recruitment). All adverts, extensions, shortlists, interview notices. 10 rows, newest first | http://kvsangathan.nic.in/en/interview-notice/ | free fetch (Node), HTTP 200, ~130 KB, 10 rows with PDF links | FREE-OK on http. https is flaky (see above) |
| Results/Misc/Answer Keys. 12 rows, newest first | http://kvsangathan.nic.in/en/results-misc-answer-keys/ | free fetch, HTTP 200, ~134 KB | FREE-OK on http |
| Admit Cards | http://kvsangathan.nic.in/en/admit-cards/ | free fetch OK, but the page has NO table at all today (empty) | Empty today; see proposal (optional) |
| Limited Dept Exam | http://kvsangathan.nic.in/en/limited-dept-exam/ | free fetch OK, empty today | Not watched (departmental exams are always held) |
| Recruitment (RTI/FAQ text page) and Notification (annual transfer notification) | /en/recruitment/ , /en/notification/ | free fetch OK | Not useful: static FAQ text / transfer notification, no job notices |

URL variants: https://kvsangathan.nic.in works only sometimes (about 1 in 3 from this PC). http://kvsangathan.nic.in works every time and does not redirect. https://www.kvsangathan.nic.in does not resolve (FAILED, use no www). The homepage "/" is a language chooser; the English site is /en/. Menu: Employment > Notifications/Recruitment, Limited Dept Exam, Syllabus, Admit Cards, Results/Misc/Answer Keys.
There is no single "What's New" page with everything; the two pages above are the right pair. The homepage ticker only repeats the newest advert already on the Notifications page.
The archive button (older notices) on each page is a JS toggle; not needed.

## ScrapFly
Not needed. Group FREE. Credits per scan: 0 | Monthly estimate: 0
PDFs download free: yes. Files are on https://cdnbbsr.s3waas.gov.in/... (different host); tested 3 of 3 times: 200, application/pdf, 0.1-0.2 s. That host is not flaky.
(SCRAPFLY_KEY was not available and not needed.)

## Label pattern
Row = title | date (dd/mm/yyyy) | file size; one link per row (PDF on cdnbbsr, or occasionally an external portal link such as cbseit.in or examinationservices.nic.in).
Notifications page titles:
- New job: "Advertisement No. NN/YYYY - Filling up the post of <Post> through <Direct Recruitment | transfer on deputation basis> in Kendriya Vidyalaya Sangathan." Parent = "Advt NN/YYYY" (plus the post). The mode of recruitment decides pass or hold (deputation = hold).
- Update: "Notice for Extension of last date of application for filling up the post of <Post> ..." (no advert number in the title; parent = the post name).
- Update: "List of candidates shortlisted for interview for the post of ... against advertisement No. NN/YYYY"; "Format of bio-data for candidates shortlisted for interview under recruitment notification no. NN/YYYY".
Results page titles:
- Result: "Press release regarding declaration of result of Tier II examination for the post of <posts> under Advt No 01/2025" (several variants: "Advt. No. 01/2025", "Press Release: ...", "Press Release regarding result of Tier-II Examination for the post of ..."). Parent = "Advt 01/2025" + the post group.
- Result link: "Link to view result of Tier-II Examination for the post of ..." (points to the examinationservices.nic.in candidate login, shared across rows).
The big teaching recruitment is "Advt 01/2025" (PRT/TGT/PGT/Principal etc.); its Tier II results are being released post group by post group. Normalise parent to "KVS Advt NN/YYYY" so the sorter can match to the job on Sarkari24. Advert PDFs are named by upload stamp (2026100138.pdf), so filenames carry no information. Always read the title.

## Hold rules (site-specific)
Standing rules apply. Site-specific:
- Anything "on deputation basis" / "transfer on deputation" (advert 03/2026 Executive Engineer and Asst Director OL, 04/2026 Superintending Engineer, Deputy Commissioner (Admn.) deputation) and their date-extension notices and shortlists. Hold.
- KVS LDE/LDCE (limited departmental exam) notices, including OMR image / answer key view-challenge notices. Hold.
- Candidate login links that only duplicate a press release of the same result (for example "Link to view result of Tier-II ...") are supplementary: pass the press release, treat the link as part of the same item (see uncertain).
Do NOT hold: Direct Recruitment adverts (e.g. Advt 05/2026 Deputy Commissioner by direct recruitment), and Advt 01/2025 stage notices (Tier II results, shortlists for interview, bio-data format) because those are real teaching/non-teaching job updates.
Script keyword filter: none proposed. "deputation" looks safe but a direct-recruitment advert could mention it in the body; the title test is unambiguous only for this phrase in the title, so I leave it to the sorter.

## Sample links (audit day, 2026-10-03)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Advertisement No. 05/2026 - Deputy Commissioner through Direct Recruitment (01/10/2026) | New Job | KVS Advt 05/2026 Deputy Commissioner | PASS |
| Advertisement No. 04/2026 - Superintending Engineer on deputation basis (25/09/2026) | New Job | KVS Advt 04/2026 | HOLD (deputation) |
| Notice for Extension of last date ... Executive Engineer and Asst Director (Official Language) transfer on deputation (17/09/2026) | Update | KVS Advt 03/2026 | HOLD (deputation) |
| Public Notice: scanned OMR sheets, view/challenge answer keys of KVS LDE/LDCE 2025-26 (01/09/2026) | Answer Key | KVS LDE/LDCE 2025-26 | HOLD (departmental exam) |
| Link for viewing scanned OMR / challenge answer keys KVS LDE/LDCE 2025-26 (01/09/2026) | Answer Key | KVS LDE/LDCE 2025-26 | HOLD |
| Format of bio-data for candidates shortlisted for interview under recruitment notification 01/2025 (21/08/2026) | Update | KVS Advt 01/2025 | PASS |
| Advertisement No. 03/2026 - Executive Engineer and Asst Director (OL) transfer on deputation (20/08/2026) | New Job | KVS Advt 03/2026 | HOLD (deputation) |
| Notice for Extension ... Deputy Commissioner (Admn.) on deputation (03/08/2026) | Update | Deputy Commissioner (Admn.) deputation | HOLD |
| List of candidates shortlisted for interview, Assistant Director (OL) transfer on deputation, advt 01/2026 (17/07/2026) | Update | KVS Advt 01/2026 | HOLD (deputation) |
| Notice for Extension ... Deputy Commissioner (Admn.) on deputation (08/07/2026) | Update | Deputy Commissioner (Admn.) deputation | HOLD |
| Press release: result of Tier II, Primary Teacher and Junior Secretariat Assistant, Advt 01/2025 (14/09/2026) | Result | KVS Advt 01/2025 | PASS |
| Press release: Tier II result, PGT (Hindi) and TGT (Hindi), Advt 01/2025 (05/09/2026) | Result | KVS Advt 01/2025 | PASS |
| Press Release: Tier II results, Principal, PGT (English), TGT (PhE), PRT (Special Educator), PRT (Music), Advt 01/2025 (05/09/2026) | Result | KVS Advt 01/2025 | PASS |
| Press release: Tier II result, TGT (English), TGT (Social science), TGT (Special Educator), Senior Secretariat Assistant, Advt 01/2025 (01/09/2026) | Result | KVS Advt 01/2025 | PASS |
| Press release: Tier II result, PGT (Biology), Librarian, Assistant Section Officer, Advt 01/2025 (28/08/2026) | Result | KVS Advt 01/2025 | PASS |
| Press release: Tier II result, TGT (Science), Advt 01/2025 (26/08/2026) | Result | KVS Advt 01/2025 | PASS |
| Press release: Tier II result, PGT (Maths), TGT (Maths), TGT (Sanskrit), Advt 01/2025 (26/08/2026) | Result | KVS Advt 01/2025 | PASS |
| Press release: Tier II result, PGT (Chemistry), Assistant Commissioner, Junior Translator, Advt 01/2025 (21/08/2026) | Result | KVS Advt 01/2025 | PASS |
| Link to view result of Tier-II, PGT (CS), FO and Steno Gr. 1 (17/08/2026) | Result | KVS Advt 01/2025 | PASS together with its press release (duplicate link) |
| Press Release regarding result of Tier-II, PGT (CS), FO and Steno Gr. 1 (17/08/2026) | Result | KVS Advt 01/2025 | PASS |

## Uncertain
- The Admit Cards page is empty today, so its row layout is unknown. KVS Tier I/II admit cards for Advt 01/2025 may have been published on the Notifications page or on an external portal; I could not tell from 10 rows. Proposal covers it as an optional extra URL.
- The two pages show only the latest 10 and 12 rows. If KVS posts many notices in a day some could scroll off between scans (limit 40 is not the issue; the page itself only lists 10-12). Scan frequency should be at least daily.
- I cannot tell whether other networks see the https drops. This PC reaches http fine.
- Candidate-login "Link to view result" rows: the sorter decides whether to merge them with the press release.

## BatLee's corrections
- (none yet)

## Repairs
- (none yet)


## Decisions (BatLee, 2026-10-03)
- Approved: both KVS sources switched to http:// (https drops about 2 in 3 connections from this PC) and timeoutMs cut from 45000 to 15000. No re-baseline needed.
- NOT added yet: the Admit Cards page (http://kvsangathan.nic.in/en/admit-cards/), because it is empty today. **TODO: re-audit the Admit Cards page once it has content** (find its row layout, then add it as an extra URL or its own source).
