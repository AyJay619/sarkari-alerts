# Batch 4 summary (units 76-100)

Written 2026-10-03. One block per audit unit; full details in audits/<unit>.md. Rules: audits/_BATCH_RULES.md.

SITE: DMRC Careers (delhimetrorail.com) | VERDICT: FIX
PROPOSED: 1. Edit "dmrc": remove "exclude" (screening/result-of items are PASS: screening schedules + results = interview/shortlist notices); 2. add "minTitle": 8 (the one-word "Corrigendum" PDFs are dropped today by the default 12); 3. keep render:true, same URL, rebaseline on first run (selectors/exclude change); 4. keep "limit" 40 (page shows 10 advts, 25 PDFs today)
MISSING TODAY: all "Corrigendum" PDFs (title too short) and all screening-schedule / result-of-screening PDFs (12 of 25 links today); older advts on Archives page (not needed)
ASK BATLEE: none (note: today's DMRC posts are mostly PRCE/deputation = HOLD; the sorter will drop most of them, only Direct Recruitment ones pass)
FILE: audits/dmrc.md

SITE: NMDC Careers (nmdc.co.in) | VERDICT: FIX
PROPOSED: 1. In source "nmdc" add selector "app-careers a" and change include to "Career_Documents|Media_Gallery" (keep render true, exclude, minTitle 15, limit 40); rebaseline (automatic)
MISSING TODAY: all follow-up notices on the page (CBT notice, shortlists, selected list for Notification 02/2026 of 22 Sep 2026) because they are filed under Media_Gallery, not Career_Documents: 4 of 10 PDFs missed today
ASK BATLEE: none
FILE: audits/nmdc.md

SITE: Chennai Metro Rail (CMRL) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page lists all job notices, newest first, 59 cards; scanner reads top 40)
ASK BATLEE: none
FILE: audits/cmrl.md

SITE: Noida Metro Careers | VERDICT: OK
PROPOSED: 1) optional: add "contextClosest":"tr", "contextFind":"td:nth-child(3)" and selector "#careerTable tbody td a" so each title becomes "<post advertised>: <link text>" (clean PARENT for the sorter); rebaseline on first run. Keep render true (plain fetch fails), exclude and include as they are.
MISSING TODAY: nothing found (page lists only 2 adverts now; both caught; results/notices are added as extra links in the same row and are caught).
ASK BATLEE: none (both live adverts are contract / young-professional posts = HOLD by the standing rule).
FILE: audits/nmrc.md

SITE: UP Metro (UPMRC) Recruitment Notices | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (feed is the site's own Notices API, 259 items, newest first; only 10 per page, scanner reads page 1 = all new postings)
ASK BATLEE: none (note: nearly all posts are deputation/absorption = HOLD; open jobs are rare)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE
FILE: audits/upmrc.md

SITE: Maha Metro Careers | VERDICT: FIX
PROPOSED: 1) Replace include/exclude/limit with link mode on visible pdf links, titled by the row's Advertisement No (config below); 2) rebaseline (automatic, selector changes).
MISSING TODAY: every new job advertisement - the scanner only sees corrigenda/old notices because the advert link is the bare word "View" (shorter than minTitle 12). Today it misses Advt 08/2026, 07/2026, 06/2026, 03/2026, Internship 2026 etc.
ASK BATLEE: none (rows for deputation/contract-only Director posts are held by the sorter; recommend keep passing everything and let the sorter hold).
FILE: audits/maha-metro.md

SITE: Konkan Railway (KRCL) | VERDICT: FIX
PROPOSED: 1) konkan: drop `render`, add `legacyTls:true`, timeoutMs 15000 (free fetch 1.5s vs 4.5s browser; site needs legacy TLS renegotiation) 2) konkan exclude: remove `shortlisted|panel` (selection/panel PDFs are results; sorter holds contract-post ones) 3) add FREE source konkan-archive https://konkanrailway.com/en/archive_notification (legacyTls, same include/exclude) - catches corrigenda/registration-link notices that move off the current page between scans
MISSING TODAY: "Selection for the post of Nurse ... NursePAnel.pdf" (blocked by exclude `panel`); archive-only items (e.g. Intimation of Registration/Online Application Link for CO/P-R/02/2026, Corrigendum to 18C/2026)
ASK BATLEE: none (note: KRCL posts are mostly contract / re-employment / deputation = HOLD; only the "Employment Notification CO/P-R/0x" family is a real job)
FILE: audits/konkan.md

SITE: Goa Shipyard Advertisements (goashipyard.in) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (one page holds ads, shortlists, CBT lists and final results together; no other career page exists)
ASK BATLEE: none
FILE: audits/goa-shipyard.md

SITE: MIDHANI Careers (midhani-india.in) | VERDICT: FIX
PROPOSED: 1. Edit "midhani" include to "WordPress-content.*(advt|advert|recruit|walk|corrigendum|addendum|selected|shortlist|result|admit|call-letter|interview|merit|answer)" (the current include is two-sided; this one-sided form is tested) ; 2. exclude add "|format" (drops Application Format PDFs/docs); 3. rebaseline on first run
MISSING TODAY: "Corrigendum" (GM/GGM, 04-Jun-26) and "Provisionally selected candidates for GGM & GM posts" PDFs - titles/links lack advt/recruit words so the include drops them; whole careers page has only ~6 relevant links
ASK BATLEE: none
FILE: audits/midhani.md

SITE: Munitions India Careers (munitionsindia.in) | VERDICT: FIX
PROPOSED: 1. Edit source "munitions-india": add selector "a[href*='wp-content/uploads']:nth-last-of-type(-n+30)", timeoutMs 15000, keep limit 30 (page is oldest-first, so the current limit 30 reads only the 2022-23 rows); 2. Drop the exclude regex (it would hide "qualified"/"roll no" result lists, which pass); 3. rebaseline on first run (automatic, selector changes)
MISSING TODAY: ALL notices from Dec 2023 onward (about 100 rows incl. every 2025-26 advert, result and general notice): scanner takes the first 30 of 131 rows, which are the oldest
ASK BATLEE: none
FILE: audits/munitions-india.md

SITE: FACT Recruitment Notifications | VERDICT: FIX
PROPOSED: 1) fact: include -> "(Recruitment Notification|Apprenticeship|ENGAGEMENT OF|Selection of).*(Dynamicpages|/images/upload/)" (adds the PDF rows of the Job Openings table); rebaseline automatic. 2) add source fact-results = https://fact.co.in/home/Dynamicpages?MenuId=97 (FREE, include "/images/upload/", exclude "AGM|Reform|Annual General|Utsav", limit 40, rebaseline). 3) timeoutMs 15000 on both.
MISSING TODAY: Recruitment Notification No.7/2026 dated 01.10.2026 (Engineer IT, open till 14/10/2026) sits in the Job Openings table as a PDF link and is NOT caught (include requires "Dynamicpages" in the link); all Results / merit lists / shortlists (MenuId=97) are unwatched.
ASK BATLEE: FACT posts are mostly fixed-tenure/contract/adhoc, and today's 7/2026 is for Ex-Apprentices of FACT's own training centre only. Recommend HOLD that restricted one (like ex-servicemen-only), PASS open notifications, apprenticeships and merit lists/shortlists.
FILE: audits/fact.md

SITE: BSNL (bsnl) | VERDICT: FIX (minor)
PROPOSED: 1) add "allowEmpty": true to source bsnl (page shows 0 open vacancies between campaigns; empty list is normal). Nothing else.
MISSING TODAY: nothing found for open jobs (active campaign cards are plain anchors). The archived table (17 closed campaigns) lives only in embedded page data, not anchors; the scanner never sees it, which is fine (all closed).
ASK BATLEE: none
FILE: audits/bsnl.md

SITE: HURL Recruitment (Hindustan Urvarak & Rasayan) | VERDICT: FIX
PROPOSED: 1. Repoint "hurl" from career.hurl.net.in (stale 2024 GET/DET portal) to https://jobse4.hurl.net.in/ (current E-04-2026 portal), include "/others/", drop exclude, minTitle 3, rebaseline; 2. Add FREE source "hurl-careers" = https://hurl.net.in/careers/ (rowSelector .job-card, rowTitle .job-title, rowLink "a.btn-download, a.btn-hurl-primary", allowEmpty, limit 25, rebaseline)
MISSING TODAY: the live recruitment E-04-2026 (advert + Corrigendum 1) and the Doctor walk-in E-03-2026: current source watches an old 2024 page and would only catch a new cycle if HURL reuses career.hurl.net.in
ASK BATLEE: none (note: each recruitment cycle gets a NEW portal host, e.g. jobse4; hurl-careers is the early-warning source because it lists the new portal link)
FILE: audits/hurl.md

SITE: Mazagon Dock Careers | VERDICT: OK
PROPOSED: none (optional only: add "(Size:.*" strip to titleReplace for cleaner titles, causes a one-time rebaseline; not needed)
MISSING TODAY: nothing found (Executives page holds 1 stale May-2026 row, Non-Executives is empty; real recruitment form/portal is login-only and not scannable)
ASK BATLEE: none
FILE: audits/mazagon-dock.md

SITE: Bank of Maharashtra | VERDICT: OK
PROPOSED: 1) Drop "shortlisted|qualified" from exclude (shortlists must pass; no title matches today). 2) Optional: limit 120 -> 200 (page has 151 PDFs, newest on top).
MISSING TODAY: nothing found (new ads, results, provisional lists, corrigenda all appear as PDFs under the same project heading on /current-openings; no separate results/notices page exists).
ASK BATLEE: none
FILE: audits/bank-of-maharashtra.md

SITE: Indian Bank Careers | VERDICT: FIX
PROPOSED: 1) Drop the "exclude" regex from "indian-bank" (it also kills real results: "List of roll numbers of shortlisted candidates", "List of Candidates called for ... interview"); hold annexures / address lists / forms in the sorter instead (standing rule: no keyword filters); rebaseline.
PROPOSED: 2) Keep render:true (REQUIRED: plain Node fetch gets "Request Rejected" from the WAF; 5/5 render fetches OK ~5 s, 0 credits), url, include "documents/20117/34414" (rosters live under /34438 and stay out) and limit 60 unchanged.
MISSING TODAY: nothing important found (page is newest-first, one page holds ads, results, call-letter notices, corrigenda); but titles are generic ("Detail Advertisement", "Corrigendum 1", "Final Result") so the sorter must take the parent from the PDF filename.
ASK BATLEE: none (render is already free local Chromium; ScrapFly not needed). Note: if the render browser is missing on the India runner this site silently fails, same as FCI.
FILE: audits/indian-bank.md

SITE: RCF HR Recruitment (rcfltd.com) | VERDICT: OK
PROPOSED: none (optional: nothing in config can read the inline text notices, see MISSING)
MISSING TODAY: corrigenda (e.g. AO Secretarial last date extended to 06.10.2026) and "provisionally shortlisted for medical check-up" lists are inline page text with no PDF, so the scanner never sees them; the two ad PDFs seen on 29-Sep (Dir Mktg, Direct Recruitment 2026) were later removed from the page
ASK BATLEE: none (recommend: new jobs are caught via their ad PDF and the IBPS source already catches the ibpsreg apply links; accept that inline corrigenda are missed, or check this page by eye once a week)
FILE: audits/rcf.md

SITE: CRIS Career Notices | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (371 PDF links, all on one page)
ASK BATLEE: CRIS posts are almost all deputation (Gazetted/Non_Gazetted, HOLD) or contract Project Assistant/Officer/Consultant engagements (Project_*). Recommend HOLD all contract Project_* posts (consultant/contract rule), except pass the few Software_Professionals (ASE/JEE/Executive) select lists and results. Say if you want Project Assistant posts passed instead.
FILE: audits/cris.md

SITE: REC Careers | VERDICT: BROKEN (fetch works, but it reads a stale Hindi copy; config alone cannot fix it)
PROPOSED: 1) needs a small scanner code change (outside batch scope): before fetching, request https://recindia.nic.in/ajax.php?lang=en in the same cookie session, then fetch /careers and /archive-opportunities with that session cookie; source stays FREE, no config-only fix exists. 2) after that: add /archive-opportunities as extra source, keep include "uploads/files", drop the Hindi-only exclude words.
MISSING TODAY: everything real: scanner sees the Hindi page (last edit Jan 2025: CTO ad + format links); the English page lists 2026 openings (Advisor Green Hydrogen, RECPDCL fixed tenure, ED on deputation, backlog status) and none of it is in the seen record.
ASK BATLEE: (a) allow the small code change (cookie session + language call, about 15 lines, REC only)? Recommend yes; otherwise drop REC (about 3-6 postings a year, mostly consultant/deputation/RECPDCL fixed-tenure that the sorter would hold). (b) if not, leave as is: it is silent, harmless, but useless.
FILE: audits/rec.md

SITE: MHA / Intelligence Bureau Vacancies | VERDICT: OK
PROPOSED: none (optional: change limit 60 to 25, page shows 20 rows)
MISSING TODAY: IB's own recruitment (ACIO / Security Assistant / MTS) is NOT on this page; could not find its page on mha.gov.in (guessed URLs all 404). Page is MHA deputation/contract circulars only.
ASK BATLEE: Keep this source (almost all items are HOLD: deputation/consultant)? Recommend keep (cheap, free, catches CEPI/MHA contract and any real IB advert); and tell me the URL where IB adverts show up if you know it.
FILE: audits/intelligence-bureau.md

SITE: SIDBI | VERDICT: FIX
PROPOSED: 1) add "allowEmpty": true to sidbi (page empties when the one live ad is archived; today without it a quiet day is an error). 2) keep render:true (free local Chromium) and URL https://www.sidbi.in/en/careers (non-www also works). No other change.
MISSING TODAY: nothing found (the 1 live ad is caught; archive and Notices page are not recruitment feeds)
ASK BATLEE: none
FILE: audits/sidbi.md

SITE: IRCON Careers | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found
ASK BATLEE: none
FILE: audits/ircon.md

SITE: MOIL Careers (moil.nic.in) | VERDICT: FIX
PROPOSED: 1. Replace "moil" (render) with a FREE JSON source: POST https://backend.moil.nic.in/career/career-public-list, itemsPath result, titleField title, linkField advertisementPdf, linkPrefix https://backend.moil.nic.in/getFiles/, no render, timeout 15000, rebaseline; 2. Add JSON sources "moil-updates" (linkField otherPdf.url) and "moil-corrigendum" (linkField corrigendumPdf) with titleFormat "{title} - update/corrigendum"
MISSING TODAY: the 11 current advertisements (render shows only 3 junk links: user manual, Hindi goods-demand, a 2025 call letter); results / interview lists / corrigenda attached to a row
ASK BATLEE: none (note: rows with no update make one harmless phantom item per extra source, baselined silently)
FILE: audits/moil.md

SITE: SEBI Careers | VERDICT: OK
PROPOSED: 1) timeoutMs 15000 (optional, site answers in 250-500 ms); no other change.
MISSING TODAY: nothing found (one page lists all 140 career notices; no pagination; newest 14-Aug-2026).
ASK BATLEE: none (note: most SEBI posts are contract / deputation / part-time, so expect many HOLDs; the only regular recruitment is Officer Grade A, once a year around Oct-Nov).
FILE: audits/sebi.md

SITE: CWC Careers (e-portal) | VERDICT: OK
PROPOSED: none (optional: add allowEmpty only if the page ever empties; not needed today)
MISSING TODAY: nothing found (page currently lists only 3 live items, all caught)
ASK BATLEE: none
FILE: audits/cwc.md

## Notes from the main session (apply to the blocks above)
- Re-baselining (same correction as batches 2-3): any change to url, selector, include, exclude, limit, titleFromHref, etc. changes the source's fingerprint, so the scanner re-baselines it silently on its next scan. "One-time batch of old items will appear" (HSL), "one-time flood" (NEEPCO) and similar claims are wrong: those items are recorded as already seen. Nothing needs clearing by hand.
- Code-level asks (NOT config-only, need your OK before anything is changed): (1) REC needs a small code change: fetch an ajax cookie URL first so the English page is served; without it REC returns a stale Hindi copy (agent offers a ~15-line change, also fine to drop REC). (2) AWEIL appends "?v=1.4.xx" to every PDF link and bumps it at each site release, so all rows look new again: ask is to ignore a "?v=" query parameter in the link normaliser. (3) ICG relative links (batch 1). (4) PDFs that need cookies/signed URLs (MMRCL, NIA, India Post) cannot be opened by the sorter from the link alone.
- Verdict BROKEN in this batch: REC only (code change needed). Biggest "scanner sees almost nothing" findings: Munitions India (reads the oldest 30 of 131 rows), Maha Metro (adverts have link text "View"), NIA (0 items today), THDC (0 items), HURL (stale 2024 portal), RailTel (old archive only), MOIL (3 junk links, real data is a JSON API).
- Keyword-filter conflicts: units that propose dropping excludes (Indian Bank, FACT, HSL, DMRC, Bank of Maharashtra) fit your rule: do it. FACT also proposes an exclude word list for its results page (AGM|Reform|Annual General|Utsav): recommend not adding it.
- Open questions for you: FACT notification 7/2026 is for FACT's own ex-apprentices only (agent recommends hold, same as ex-servicemen-only); CRIS Project_* contract posts (recommend hold); Intelligence Bureau: tell me the URL where IB adverts (ACIO/SA/MTS) appear, mha.gov.in only has deputation circulars.
