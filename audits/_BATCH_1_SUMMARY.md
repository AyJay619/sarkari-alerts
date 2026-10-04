# Batch 1 summary (units 1-25)

Written 2026-10-04. One block per audit unit; full details in audits/<unit>.md. Rules: audits/_BATCH_RULES.md.

SITE: ISRO | VERDICT: FIX
PROPOSED: 1) isro: raise limit 30 -> 45 (page has 32 matching rows today, so the current 30 already cuts 2 off); no URL change, no rebaseline needed.
MISSING TODAY: 2 oldest rows beyond limit 30 (SDSC/PRL type centre ads, already old); nothing else found.
ASK BATLEE: none
FILE: audits/isro.md

SITE: SAIL | VERDICT: FIX
PROPOSED: 1) limit 15 -> 30 (4 plant-menu links eat the limit; 27 links on page today). 2) exclude "PlantName=" (plant menu links, not notices). Rest unchanged.
MISSING TODAY: nothing real is missed now; 12 of today's 27 links sit beyond limit 15 (old, but a burst of 6+ postings would push new ones out). "CUT OFF Marks" (short title) is skipped by minTitle, harmless.
ASK BATLEE: none (the exclude is a structural menu filter, not a keyword filter; recommend yes).
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (nothing applied)
FILE: audits/sail.md

SITE: CBSE Recruitment | VERDICT: FIX
PROPOSED: 1) cbse: raise "limit" 25 -> 60 (page has 142 PDF links in several blocks; limit 25 stops inside the KVS/NVS press-release block, so the CBSE result / cancellation / deputation / KVS-NVS notice blocks below it are never seen); URL, include, minTitle, free fetch unchanged; rebaseline happens by itself on the first run
MISSING TODAY: everything after row 25 (about 117 links): cancellation and result notices (Junior Assistant, Superintendent, SAO, Under Secretary Legal), KVS/NVS Tier-2 shortlist, KVS/NVS corrigenda and public notices, deputation adverts
ASK BATLEE: none (note for the sorter: the page has no posting date; page header is not labelled by date, items are newest-first inside each block)
FILE: audits/cbse.md

SITE: RBI Vacancies | VERDICT: FIX
PROPOSED: 1) add source rbi-results = https://opportunities.rbi.org.in/Scripts/resultsnew.aspx (FREE, include "bs_viewcontent|Result_.*[.]aspx", limit 30, rebaseline)
PROPOSED: 2) add source rbi-calls = https://opportunities.rbi.org.in/Scripts/CallLetters.aspx (FREE, same include, allowEmpty, rebaseline); keep rbi (Vacancies) as is
MISSING TODAY: Results (Assistant, JE, Grade B scorecards) and Call Letters/admit cards pages are not watched at all
ASK BATLEE: none (nav/footer noise "Rosters at ROs", "COVID-19 Measures" is already in the seen baseline; sorter holds it)
FILE: audits/rbi.md

SITE: ESIC Recruitment | VERDICT: OK
PROPOSED: none (optional: add page 2 https://esic.gov.in/recruitments/index/page:2 as FREE source, only if flood risk matters)
MISSING TODAY: nothing found (page 1 shows only 11 newest PDFs; at ~4-10 new items per scan window nothing is pushed off page 1 between 3-hourly scans)
ASK BATLEE: Nearly every ESIC item is a contractual walk-in drive for doctors (Specialist / Senior Resident / faculty on contract). Pass or hold? Recommend PASS the walk-in advertisements (multi-post, real jobs) and their results; HOLD single-hospital/part-time-only one-off notices, interview-date notices and "Notice- Deferment" style items.
FILE: audits/esic.md

SITE: HPCL Careers | VERDICT: OK
PROPOSED: 1. Optional: raise limit 25 -> 40 (page has exactly 25 matching links today, so the cap is already full); no other change
MISSING TODAY: nothing found (the 'Click here to Apply' links and /images/ form PDFs are dropped on purpose; 'Selection Methodology' PDFs are excluded by config)
ASK BATLEE: none
FILE: audits/hpcl.md

SITE: UGC | VERDICT: FIX
PROPOSED: 1) drop the "exclude" filter on source `ugc` (rule: no keyword filters; sorter holds noise) and set limit 30; rebaseline. 2) add FREE json source `ugc-jobs` (UGC Jobs page API, POST Tenders/Fill_Tenders) with rebaseline. 3) optional: add FREE json source `ugc-notices` (full dated Notices list API) as backup/history, limit 40, rebaseline.
MISSING TODAY: the Jobs page (recruitment adverts/results, JS-loaded table, not on homepage) is not watched at all; last posting there is 07-02-2026 (Standing Counsel panel), so low volume.
ASK BATLEE: none (UGC rarely posts real jobs; most are consultants/deputation/empanelment which the sorter holds; keep ugc-jobs anyway, cost is zero).
FILE: audits/ugc.md

SITE: BHEL Careers | VERDICT: FIX
PROPOSED: 1) add titleFromHref:true (link texts are "Advertisement", "(English version )", "Click here to apply"; file names carry the real info)
PROPOSED: 2) widen include to "[.]pdf|ednnet|bplcareers|careers1" so ads on BHEL's external recruitment sites are caught
PROPOSED: 3) raise limit 25 -> 40 (page has ~40 PDF links; the top 25 already include certificate formats, so real items near the bottom of the page could fall off)
MISSING TODAY: FTA HSE TBG (bplcareers.bhel.com), Project Engineers EDN Bengaluru (ednnet.bhel.in), Consultants HPEP Hyderabad (careers1.bhel.in) are non-PDF links, not caught; Hindi ads and newspaper ads are skipped
ASK BATLEE: Source URL unchanged, but titles change with titleFromHref, so confirm the scanner re-baselines (no flood of 25-40 old items); recommend yes
FILE: audits/bhel.md

SITE: DRDO (drdo-rac + drdo-vacancies) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (RAC FAQ PDFs are excluded on purpose; older lab posts are on page 2 of the vacancies list, 6 items, all old)
ASK BATLEE: none
FILE: audits/drdo.md

SITE: AAI Recruitment | VERDICT: FIX
PROPOSED: 1) keep source "aai" unchanged (new jobs: release links, works free, 7/7 runs OK). 2) add FREE source "aai-updates" (same URL, selector "table tbody tr td.views-field a", contextClosest "tr", contextFind "td.views-field-title", limit 130, rebaseline) so press notes, syllabus, admit card, result, registration/objection links and "Updated On" date changes are caught.
MISSING TODAY: the scanner takes only the FIRST link of each table row (the release page), so a new result / press note / admit card / syllabus on an existing advert is never seen (e.g. result for Advt 12/2026 Managers/JE, Advt 01/2025/NR results updated Sep 2026).
ASK BATLEE: apprentice-engagement notices (graduate/diploma/ITI apprentices, per region) pass under the standing rule "open jobs"; recommend PASS but tell sorter they are training posts, not regular jobs.
FILE: audits/aai.md

SITE: LIC Careers | VERDICT: FIX
PROPOSED: 1) careers source: replace include filter with rowSelector "#tableID tbody tr" + rowTitle "td:nth-child(3)" (also catches the 5 click-only rows the scanner ignores today); 2) add FREE source lic-aao = AAO/AE 2025 page https://licindia.in/recruitment-of-aao-generalists/-specialists/-assistant-engineers-2025 (selector "main a[href]", exclude forms/annexures/Hindi, limit 80, rebaseline); 3) timeout 15000.
MISSING TODAY: all updates of the AAO/AE 2025 cycle (results, shortlists, call letters, scorecards) live on a sub-page the scanner never opens; 5 of 7 careers rows are click-only (no href) and invisible today.
ASK BATLEE: Add the AAO/AE sub-page as a source? Recommend YES (it is the only place LIC posts results/call letters). Also: LIC posts few jobs a year (ADO, apprentice, HFL are not on this page); recommend no extra pages.
FILE: audits/lic.md

SITE: IBPS | VERDICT: FIX
PROPOSED: 1) add FREE source "ibps-crp" = https://www.ibps.in/index.php/crp-updates/ (same extraCerts, include "^[0-9][0-9] (Jan|Feb|...|Dec) [0-9][0-9] ", minTitle 15, limit 40, rebaseline); this is the full dated CRP updates list (22 rows), the homepage shows only its newest 4. Keep the existing "ibps" homepage source unchanged (it also carries the ibpsreg.ibps.in registration links).
MISSING TODAY: homepage shows only 4 CRP updates, so the scanner never saw "Scores of Online Preliminary Exam CRP-PO/MT-XVI" (29 Sep) or "Online Pre-Examination Training ... CRP-CSA-XVI" (28 Sep); a burst of more than 4 posts in one run gap would also be lost. No results/answer-key page of its own exists (all inside CRP pages).
ASK BATLEE: none (note: about 1 in 5 single fetches fails with an SSL "unexpected message" error on every URL version, www or not, https or http; it is the server being flaky, not a config fault; the scanner's end-of-group retry covers it)
FILE: audits/ibps.md

SITE: BEL Careers (bel-india.in) | VERDICT: FIX
PROPOSED: 1. Add FREE source "bel-results" = https://bel-india.in/results/ (same selectors, rowLink "a[href*=jobapply], a.file-link-results, a.file-link", limit 25, extraCerts, rebaseline); 2. Keep "bel" (job-notifications) as is
MISSING TODAY: all results / shortlists / call-letter notices (separate /results/ page, 10 rows today, not watched); page 2+ of job list (only matters if >10 postings appear between scans)
ASK BATLEE: none
FILE: audits/bel.md

SITE: NIACL | VERDICT: FIX
PROPOSED: 1) niacl: include "docs/recruitment" -> "docs/recruitment|ibpsonline.ibps.in" so call-letter (admit card) links are caught; 2) niacl: add "reprint|re-print|apply online" to exclude (those IBPS links are forms, not news); 3) keep limit 25 and timeoutMs 45000 (first request is slow, 15 s; later 4 s). Seen key = title+link, so rebaseline happens by itself.
MISSING TODAY: admit-card / call-letter links on ibpsonline.ibps.in (excluded by the include filter); no new job posted since 2025 (page newest items are CTO/CISO contract ads + AO 2025 results).
ASK BATLEE: none
FILE: audits/niacl.md

SITE: UIIC Recruitment | VERDICT: OK
PROPOSED: 1) optional: add FREE source "uiic-1620" = http://uiic.co.in/web/recruitment/details/1620 (AO 2026 notice page: corrigenda, apply link, ads), allowEmpty, rebaseline; 2) optional: same for details/1607 (apprentices)
MISSING TODAY: corrigenda / extensions / result PDFs added INSIDE an existing post's details page (e.g. AO 2026 corrigendum) are invisible; list page only shows new post titles
ASK BATLEE: details pages need a manual id per live recruitment - add 1620 only (recommend yes, remove when the recruitment closes); site gives 504 about 1 in 6 requests at 32s (retry at group end handles it, recommend leave timeout 45000)
FILE: audits/uiic.md

SITE: Oil India (oil-india + oil-india-archive) | VERDICT: FIX
PROPOSED: 1) add FREE source oil-india-results = https://www.oil-india.com/result (rowSelector "table tr", rowTitle "td:nth-child(2)", rowLink "a[href*='files/result']", limit 20, allowEmpty true) - tested, returns 2 rows
PROPOSED: 2) keep oil-india and oil-india-archive exactly as they are (both work free, 250-950 ms, 3/3 repeats stable)
MISSING TODAY: results page (Grade D/E/F result of 10/09/2026 is not caught by either source); the CBT admit-card/objection links on digialm ARE caught via the archive page
ASK BATLEE: none (note: most Oil India postings are contractual/consultant roles = HOLD; only Grade D/E/F executive and PwBD special drive style notices are real jobs)
FILE: audits/oil-india.md

SITE: CSIR | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (main page shows only 4 live items, archive page 0 catches the rest; ?page=N older pages are old history, not needed)
ASK BATLEE: none
FILE: audits/csir.md

SITE: India Post | VERDICT: OK
PROPOSED: none (optional: add "timeoutMs": 15000 to india-post; site answers in about 1-2 s)
MISSING TODAY: nothing found for the current cycle; all links are the page URL itself (PDFs sit behind a "verification step"), so the sorter must open the page, not the PDF
ASK BATLEE: none
FILE: audits/india-post.md

SITE: POWERGRID (powergrid.in) | VERDICT: FIX
PROPOSED: 1. Change selector of "powergrid" from ".newBorderBox a.showMoreBtn" to ".newBorderBox .views-row a" (keep contextClosest/contextFind, drop the "Click here|register|login" exclude, limit 400, rebaseline); reason: current links are cut off before ".pdf" and 404
MISSING TODAY: coverage is complete, but all 331 current file links are broken (end in "." with no extension, GET returns 404) so the sorter cannot open them; 50 apply-portal/external links are skipped on purpose
ASK BATLEE: none
FILE: audits/powergrid.md

SITE: Coal India | VERDICT: FIX
PROPOSED: 1) keep coal-india as is (free, stable); 2) add FREE source coal-india-cbt26 = https://www.coalindia.in/career-cil/jobs-coal-india/recruitment-of-management-trainee-through-computer-based-test-cbt-26/ (rowSelector "table tr", rowLink "a[href]", minTitle 20, allowedHosts cloudfront, rebaseline); 3) add FREE source coal-india-results = https://www.coalindia.in/career-cil/appointment-result-interview/ (same options, limit 25, rebaseline)
MISSING TODAY: updates/admit cards/results posted INSIDE a job's own page (e.g. CBT-26 notices dated 21.09.2026, objection notice 08/2026) - main list only shows the job page link, so these are never caught
ASK BATLEE: none (when a new MT/GATE advert page appears, a matching per-advert page source should be added then; recommend doing it when it shows up)
FILE: audits/coal-india.md

SITE: NHPC | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page 1 = newest 10 rows; NHPC posts about 10 notices per 6-7 weeks, so limit 25 / 10 visible rows is safe; no separate results/current-openings page exists)
ASK BATLEE: none
FILE: audits/nhpc.md

SITE: ONGC (ongcindia.com) | VERDICT: FIX
PROPOSED: 1. Add FREE source "ongc-results" = https://ongcindia.com/web/eng/career/results (selector a.pdf-link, minTitle 15, limit 25, rebaseline); 2. Add FREE source "ongc-apprentice" = https://ongcindia.com/web/eng/career/apprenticeship-opportunities (same selectors, limit 25, rebaseline); 3. Keep "ongc" as is (works, 5/5 runs)
MISSING TODAY: all results / merit lists (/career/results) and apprenticeship shortlists (/career/apprenticeship-opportunities), neither watched
ASK BATLEE: none (note: ~90% of ONGC notices are retired-consultant/contract posts = Hold; page speed 2-21 s so keep 15 s timeout or raise to 30000)
FILE: audits/ongc.md

SITE: GAIL | VERDICT: OK
PROPOSED: none
MISSING TODAY: results / admit cards / shortlists (no such page found on gailonline.com; only Vacancies.html is catchable). Some "jobs" caught are small medical consultant walk-ins (hold).
ASK BATLEE: none
FILE: audits/gail.md

SITE: RRB (21 regions) | VERDICT: FIX
PROPOSED: 1) in all 21 rrb-* sources change include to "getdata[?]loc=[a-z]+&cenum=", titleTemplate to "RRB <Region> {text}", groupTemplate to "RRB {text}" (same URLs, limit 400; scanner re-baselines by itself). Reads the homepage "Updates" lists (3 tabs, dated notices) instead of the category index.
MISSING TODAY: every new notice inside an existing CEN category (new schedule, results, e-call letter, extension, city slip) - the scanner only sees brand-new CEN/category links (index has no dates); only the 9 group alerts since 26-Sep were new categories.
ASK BATLEE: (a) replace the old index source (recommended: it adds nothing the dated list lacks, avoids 21 extra fetches) or keep both? (b) expect about 240 group alerts/month (about 8/day, mostly per-region Selection List / Document Verification) - sorter holds none by default; recommend pass all, one line each.
ASK BATLEE: (c) links open category pages and need a browser session/cookie (a cold direct hit gets "Request Rejected"); accept, as today.
FILE: audits/rrb.md

SITE: SBI Careers | VERDICT: OK
PROPOSED: 1) timeoutMs 15000 (optional, site answers in 230-630 ms); no other change.
MISSING TODAY: nothing found (one page holds every advert, call letter, result, corrigendum; 318 links, limit 500 not reached).
ASK BATLEE: none (note: page keeps growing, 318 links of 500 limit; raise limit to 800 when it passes ~450).
FILE: audits/sbi.md

## Notes from the main session (apply to the blocks above)
- Re-baselining: any change to a source's URL, selector, include, exclude, limit, titleFromHref, contextClosest etc. is part of its fingerprint, so the scanner silently re-baselines that source on its next scan (no flood). Claims in some audits that include/exclude/limit changes are "not an automatic rebaseline" (NIACL, PNB) or need the state file cleared by hand are wrong: nothing needs clearing. Only timeoutMs, name, runner, tier, level, extraCerts and legacyTls are ignored by the fingerprint.
- Caveat of that silent re-baseline: a notice posted between the last scan and the first scan after a change is recorded as already seen, not caught. Normally a few hours.
- Open questions that need your answer (not covered by the standing decisions): ICG (Coast Guard) needs a small code change to resolve relative PDF links in its JSON news feed (config-only fallback: link to the site home page); LIC: add the AAO/AE sub-page as a source (recommended yes) and hold the repeated "Engagement of CFO on contract" post; SSB: add the advertisements page (recommended yes) and keep doctors' walk-ins on hold.
