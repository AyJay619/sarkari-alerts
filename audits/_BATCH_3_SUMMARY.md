# Batch 3 summary (units 51-75)

Written 2026-10-03. One block per audit unit; full details in audits/<unit>.md. Rules: audits/_BATCH_RULES.md.

SITE: Union Bank of India Recruitment | VERDICT: OK
PROPOSED: 1. Optional: drop "qualified" from exclude (it hides result lists like "Candidates Qualified in Online Examination"); 2. Optional: set timeoutMs 15000; 3. Raise limit 80 -> 100 not needed (newest first, 229 rows on page)
MISSING TODAY: nothing found (handouts / scribe / medical / hospital notices are excluded on purpose; no separate admit-card page, call letters are portal links)
ASK BATLEE: Keep "call letter" in exclude? Recommend yes (call letters are portal links, not PDFs; exam notices still pass).
FILE: audits/union.md

SITE: Central Bank of India Recruitment | VERDICT: FIX
PROPOSED: 1) change url to https://centralbank.bank.in/en/recruitments (old centralbankofindia.co.in redirects there; no-www works, rebaseline on first run)
PROPOSED: 2) add "timeoutMs": 15000 (optional; site answers in under 1s)
MISSING TODAY: nothing found (page lists 16 newest-first, all caught; 16 is one full page, 30 days of postings fit easily)
ASK BATLEE: none (links are .zip bundles, not PDFs; the sorter must open the zip - recommend keeping them, they are the real notices)
FILE: audits/central-bank.md

SITE: EXIM Bank Careers | VERDICT: FIX
PROPOSED: 1. include -> "sites/default/files|/assets/" (page also links PDFs under /assets/ and /themes/custom/exim/pdf/careers/; today's ones are old but a new ad may land there). Rebaseline on first run.
PROPOSED: 2. (optional) timeoutMs 15000.
MISSING TODAY: 3 old Feb-2026 PDFs under /assets/ (DM and MT drive ads, combined result) and 2 old addenda under /themes/... are not caught; nothing current.
ASK BATLEE: none
FILE: audits/exim.md

SITE: GIC Re Careers | VERDICT: FIX
PROPOSED: 1) url -> https://www.gicre.in/en/people-resources/career-en (the real Careers page; current url id=304 is only the Home page) 2) keep old Home URL as extraUrls (What's New often lists new ads first) 3) include -> recruit|vacanc|engage|appoint|advertis|result|shortlist|cut-?off|interview|schedule|corrigendum|addendum|call letter|admit|walk-in 4) exclude -> RFP|proposal|EOI|reinsurer|tender|GeM|pre-bid|consultant|magazine|kshitij|newsletter|compassionate|qualified|roll no|unique id, limit 60; rebaseline on first run
MISSING TODAY: Company Secretary (CS) contract ad (2025) and the 2025 AM written-exam result / schedule PDFs on the Careers page are not caught from Home; Home catch also lets tender noise through (consultant stress-test, GeM tenders)
ASK BATLEE: none (all contract roles like CMR / CS / CISO pass as jobs; sorter holds consultant/tender items)
FILE: audits/gic-re.md

SITE: National Insurance (NICL) Recruitment | VERDICT: FIX
PROPOSED: 1) source `national-insurance`: drop the "exclude" filter (it hides "List of Roll Numbers of Provisionally Shortlisted Candidates..." = real shortlists/results; sorter holds the rest), keep include "sites/default/files", limit 60, add timeoutMs 15000; no rebaseline needed for the exclude drop alone (rebaseline automatically if the scanner treats it as a change, 8 old PDFs would surface once). 2) optional: add FREE source `national-insurance-archive` (https://nationalinsurance.nic.co.in/recruitment/archive, same options, limit 60) only as history; not needed for new postings.
MISSING TODAY: nothing new missed except shortlist "Roll Numbers" PDFs hidden by the exclude (8 of 82 links, all old 2024-25 lists, but future ones would be hidden). Homepage has no job items (only empanelment EOIs, surveyor lists = noise).
ASK BATLEE: none. Note: the site drops connections in bursts (UND_ERR_SOCKET/ECONNRESET). Single requests spaced apart worked 35/35 (curl 10/10); the scanner's end-of-group retry covers it.
FILE: audits/national-insurance.md

SITE: Oriental Insurance Careers | VERDICT: FIX
PROPOSED: 1) Add contextClosest "tr" + contextFind "td:first-child" so each PDF title gets its row heading as parent (e.g. "DR-AO (GENERALIST & HINDI OFFICER) EXERCISE -2025: NOTICE DT 04 08 2026"). Keep render true (free local Chromium), waitFor, include, limit. Links are unchanged so no flood; titles change only.
MISSING TODAY: Parent exam name is missing from titles (many are just "NOTICE ..."); rows that have no PDF but an IBPS link (score display, call letter, re-print) are not caught; Archive (previous years) not watched.
ASK BATLEE: (a) Also catch the IBPS-hosted score/call-letter links (include "[.]pdf|ibpsreg[.]ibps[.]in")? Recommend NO: they are candidate login links that do not give a new notice. (b) Hold-rule for formats/addresses is left to the sorter (no script filter), OK?
FILE: audits/oriental-insurance.md

SITE: UCO Bank Recruitment | VERDICT: FIX
PROPOSED: 1) exclude: drop "shortlisted" and bare "format" (it matches "Information" and wrongly drops IT Advisor selection + info hand-outs): "proforma|certificate|\bformat\b|compassionate|qualified|roll no|unique id"
PROPOSED: 2) limit 60 -> 120 (page has 112 distinct document links; rebaseline on first run, no flood sent)
MISSING TODAY: ~25 shortlist / interview-list posts (e.g. Shortlisted for Interview CTO, Manager-Civil Engineer, Data Scientist JMGS-I), the IT Advisor selection (20-05-2026) and LBO/Specialist Officer information hand-outs are dropped by the exclude
ASK BATLEE: none (shortlists and interview schedules are PASS under standing rules; contractual/consultant posts are HOLD by the sorter)
FILE: audits/uco-bank.md

SITE: Indian Overseas Bank Careers | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page lists ~400 doc links newest first; limit 60 covers recent ones)
ASK BATLEE: none
FILE: audits/iob.md

SITE: Punjab & Sind Bank | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page has 100 PDF rows, limit 60 covers the newest; Apply-online jobs go to recruitmentpsb.com, which is not watched)
ASK BATLEE: none
FILE: audits/psb.md

SITE: NHAI (National Highways Authority of India) | VERDICT: FIX
PROPOSED: 1) Replace source `nhai` (HTML term/249) with JSON POST to https://nhai.gov.in/nhai/api/vacancies-current (form status=Open), title "{title} [{type}]", link = first PDF (current links /nhai/node/N are "Access denied" to the public and show no type/date). 2) Add FREE JSON source `nhai-results` (POST /nhai/api/vacancy-result) for results/shortlists, rebaseline. Both rebaseline on first run. Config below.
MISSING TODAY: Results/shortlists/interview notices (not scanned at all); corrigenda/extensions (edited in the same row, no new link); ~95% of NHAI open posts are deputation/contract (HOLD), real direct-recruitment ads are rare (~4-6 a year).
ASK BATLEE: Should the node-link source keep running as a backup next to the JSON one? Recommend NO (duplicate, and its links are unreadable). Also: contract roles at NHAI (Advisor, Joint Advisor, Draftsman) are held as "small contract roles" - recommend keep HOLD.
FILE: audits/nhai.md
FILE: audits/nhai.md

SITE: SJVN Current Jobs | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found
ASK BATLEE: none
FILE: audits/sjvn.md

SITE: Bharat Dynamics Recruitment (bdl) | VERDICT: FIX
PROPOSED: 1. replace include "[.]pdf" with rowSelector "table tbody tr", rowTitle "td.views-field-title", rowLink "a[href$='.pdf']" (real titles instead of 2x "Click here for Detailed Notification", drops 2 static rows); 2. keep exclude and limit 40; 3. rebaseline on first run (automatic)
MISSING TODAY: nothing important; but 2 titles are the useless "Click here for Detailed Notification" (Director Technical Advt 106/2026, CMD Advt 101/2025) and 2 static rows (Check Points, Incentive Scheme) are noise
ASK BATLEE: none (rowLink fallback: one row "Syllabus for CBoT ... Advt 2025-4" has no PDF, scanner falls back to the page URL; harmless, hold as info)
FILE: audits/bdl.md

SITE: Delhi High Court Recruitment (dhc) | VERDICT: FIX
PROPOSED: 1) drop the "exclude" filter on `dhc` (it hides "Shortlisted / Not Shortlisted", "qualified", "roll no" items that should pass or be judged by the sorter; no-keyword-filter rule); no rebaseline needed (selectors unchanged), hidden items appear once. 2) keep both pages, limit 80 is fine (pages show only 10 rows each).
MISSING TODAY: 2 items hidden by exclude (Chauffeur 2025 shortlist for document verification; DHJS Mains shortlist), both pass-type.
ASK BATLEE: DIAC Deputy Counsel / e-DHCR empanelment results are held as panel roles; recommend HOLD, say if you want them passed.
FILE: audits/dhc.md

SITE: Supreme Court Recruitments (sci.gov.in) | VERDICT: OK
PROPOSED: none (optional: raise "limit" 60 to 110 only if BatLee wants the full back-catalogue; not needed, list is newest-first)
MISSING TODAY: nothing found (newest "Junior Court Assistant Examination-2026" notice of 01.10.2026 and the 30.09.2026 advertisement are both caught)
ASK BATLEE: none
FILE: audits/sci.md

SITE: RailTel Careers | VERDICT: FIX
PROPOSED: 1) railtel: replace li/span.title selector with tables: selector "table.railtel_table a[href]", contextClosest "table", contextFind "tr.heading td", minTitle 4, limit 80 (drop rowSelector/rowTitle/rowLink); keep url, extraCerts, exclude; auto re-baseline.
MISSING TODAY: all 2026 content. Current notices (Civil Engineer SR, ED/GGM deputation WR, BHISHM, KSWAN, Data Centre regular recruitment, Apprenticeship 2026-27, corrigendum 24-09-2026) sit in table.railtel_table boxes; the scanner only reads an old li archive whose newest item is Feb 2026.
ASK BATLEE: none (recommend FIX as proposed; most RailTel posts are deputation/contract = HOLD, only regular recruitment, apprentices and their results/admit cards pass).
FILE: audits/railtel.md

SITE: ICMR (Indian Council of Medical Research) | VERDICT: FIX
PROPOSED: 1) keep icmr (employment-opportunities) as is - works free, 7 rows, stable 4/4 runs, ~0.7-1.1 s
PROPOSED: 2) ADD source "icmr-results" = https://www.icmr.gov.in/career-results, same extraCerts/rowSelector/rowTitle/rowLink as icmr, limit 60 (19 rows today; interview notices, results, eligible lists)
PROPOSED: 3) optional: keep the existing exclude only on icmr; on icmr-results leave no exclude (compassionate-appointment notice then reaches the sorter, which holds it)
MISSING TODAY: all results / interview / eligibility notices (about 20 posted since Aug 2026, many for Scientist and Director posts); archive page ?archive=1 (older ads, not needed)
ASK BATLEE: ICMR posts mostly Consultant / Young Professional / deputation notices (HOLD by rule) - keep the source anyway? Recommend yes, a few real jobs appear (Scientist, Addl. DG, Director); ICMR cert (certs/icmr.pem) is no longer needed today (plain fetch gives 200) - recommend keep it, harmless.
FILE: audits/icmr.md

SITE: PGIMER Vacancies | VERDICT: FIX
PROPOSED: 1) raise limit 60 -> 80 (page now lists 67 rows, 7 oldest are cut off); everything else unchanged
MISSING TODAY: 7 oldest active rows (cut by limit 60; harmless as they are old); no results/admit-card page found (PGIMER posts interview lists inside the same vacancy page)
ASK BATLEE: Project/ad-hoc posts (Project Research Scientist, Project Nurse, Senior Resident adhoc, walk-ins) are contract roles, many per week; recommend PASS only regular posts (Nursing Officer, UPSC-routed Assistant Professors, Principal/Vice Principal) and HOLD project/ad-hoc/walk-in ones, as a "contract" rule - confirm
(Not a bug: URL parameter aflag=0/1/2/3 all return the identical page.)
FILE: audits/pgimer.md

SITE: IDBI Bank Careers | VERDICT: FIX
PROPOSED: 1) idbi exclude: replace bare "Format" with a word-boundary form (current one also kills every "Information ..." handout PDF); 2) add FREE source idbi-results = https://www.idbi.bank.in/idbi-bank-careers-current-result.aspx, include "pdf/careers", titleFromHref, extraCerts certs/idbi.pem, allowEmpty, rebaseline
MISSING TODAY: 4 "Information Hand out for Online Exam" PDFs (JAM 2026-27, PGDBF 2025) are dropped by the exclude; "Current Update" / "Process Closure" notices on the results page are not watched
ASK BATLEE: none
FILE: audits/idbi.md

SITE: RITES (rites.com) | VERDICT: FIX
PROPOSED: 1) keep "rites" as is (render:true, local browser, free; ~3.5s, 10 rows, stable 4 of 4 runs). 2) add FREE source "rites-results" https://www.rites.com/Result (render, waitFor "table tbody tr td", rowSelector "table tbody tr", rowTitle "td:nth-child(3)", rowLink "a[href]", minTitle 5, limit 30, allowEmpty) - offer lists, answer keys. 3) add FREE source "rites-schedule" https://www.rites.com/SelectionSchedule (same options) - written test/interview schedules, addenda. Rebaseline on first run.
MISSING TODAY: Results (offer lists, provisional answer keys) and Selection Schedule (interviews, addenda) pages are not watched; only Vacancies is.
ASK BATLEE: Table shows only 10 rows per page (Results got 10 rows in 3 days, Sep 28-30): a burst of >10 between scans would lose items; recommend accept (scan runs several times a day).
FILE: audits/rites.md

SITE: JIPMER Jobs | VERDICT: FIX
PROPOSED: 1) in source "jipmer" change exclude to "jobs-archive|entrance|admission|compassionate|roll no|unique id" (drop shortlisted|eligible|qualified: shortlists/eligibility lists are PASS by rule; the sorter holds the project/contract ones). 2) set timeoutMs 30000 explicitly (site answers in 6-12 s; do NOT use 15000). 3) no extra pages needed.
MISSING TODAY: shortlists / eligibility lists / "Eligible list" results (about 10 of 24 current items are dropped by the exclude, mostly for contract project posts that are held anyway). Nothing else; page 0 holds the 24 newest.
ASK BATLEE: none (recommend keeping the source; ~90% of JIPMER posts are ICMR project / contract posts the sorter will hold).
FILE: audits/jipmer.md

SITE: GRSE Careers | VERDICT: OK
PROPOSED: 1) optional: drop "render" and "waitFor" (page is plain HTML with all 140 PDF links; fetch drops from 2-7 s with Chromium to 0.4-3 s free). 2) optional: remove "shortlisted" and "qualified" from exclude (those are PASS items per standing rules; none on the page today, so no effect now)
MISSING TODAY: nothing found (limit 40 of 117 deduped PDFs shown on page; newest-first so fine; admit cards / online results are not on this page)
ASK BATLEE: none
FILE: audits/grse.md

SITE: NCERT Vacancies | VERDICT: FIX
PROPOSED: 1) url -> https://www.ncert.nic.in/vacancies.php?ln=en (www; non-www https drops the connection now and then); 2) remove "render": true (free plain fetch works: 6 of 6 www tries OK, ~0.15s); add timeoutMs 15000
PROPOSED: 3) minTitle 3 (the page links new adverts only as a bare "English" / "Hindi" next to plain row text, so today's Advt 178/2026 and 177/2026 are MISSED); 4) exclude -> "compassionate|roll no|unique id|^\\s*(hindi|हिंदी|हिन्दी)\\s+https?:|_HI\\.pdf" (drops "shortlisted|qualified" so shortlists/results pass, drops Hindi duplicates); 5) limit 150
MISSING TODAY: new Advertisement rows (Advt 178/2026 Principal x2, 177/2026 academic, 01/2025 deputation etc.) have no scanner title; shortlists, "qualified" results; extra PDFs added into existing rows
ASK BATLEE: Add a second source on the same page in row mode (rowSelector "div.card-body li", rowTitle self) only to give new adverts a readable title (e.g. "Advertisement No. 178/2026 for 02 posts of Principal ...")? Recommend NO for now: the sorter opens the PDF anyway, and the row mode misses PDFs added to old rows.
FILE: audits/ncert.md

SITE: NBEMS Vacancies | VERDICT: FIX
PROPOSED: 1) change rowLink of source "nbems" to "td:nth-child(3) a[href*='viewNotice']" (the scanner now picks a malformed first link that returns 404). Links change, so it is rebaselined silently on first run; nothing else changes.
MISSING TODAY: nothing missed by coverage (all 15 rows of the single page are caught, free, ~0.2-1 s); but every alert link is a 404 (https://natboard.edu.in/vacancy/https://natboard.edu.in/viewNotice.php?...).
ASK BATLEE: none
FILE: audits/nbems.md

SITE: NEEPCO Careers | VERDICT: FIX
PROPOSED: 1) add clickText:"English" (page opens in Hindi in the headless browser; today only the 4 Hindi ads are caught, English titles/ads never are)
PROPOSED: 2) drop the exclude (it kills every shortlist / result / "list of" notice, which the standing rules say PASS); the include already removes the policy PDF; add minTitle:8 so the bare "Corrigendum" link is kept
PROPOSED: 3) add timeoutMs:25000 (default 45 s made the one failed scan wait too long; page renders in 3-5 s, 10/10 test runs OK); source URL unchanged
MISSING TODAY: all English ads, all results/shortlists (excluded by regex), corrigenda (minTitle 12); Hindi ads only are caught
ASK BATLEE: titles change (Hindi -> English, no exclude) with unchanged URL, so expect a one-time flood of about 16 items unless re-baselined; recommend re-baseline (clear neepco's seen entry) on first run
FILE: audits/neepco.md

SITE: PFC Careers (jobs on offer) | VERDICT: FIX
PROPOSED: 1) remove "shortlisted" from exclude (standing rule: shortlists pass; it hides 2 shortlist PDFs); keep refund|backlog|compassionate|qualified|roll no|unique id
MISSING TODAY: the 2 "LIST OF SHORTLISTED CANDIDATES" PDFs (excluded); no 2025/2026 postings on this page at all (newest is Advt 02/2024) - page looks stale
ASK BATLEE: is PFC recruiting in 2026 elsewhere (e.g. pfcindia.co.in/en/pages/... or pfcapps.com/pfcrecruitment)? I could not find another notice page; recommend keep this source and check manually once
FILE: audits/pfc.md

## Notes from the main session (apply to the blocks above)
- Re-baselining (same correction as batch 2): every config change that alters the source's fingerprint (url, selector, include, exclude, limit, titleFromHref, contextClosest, etc.) re-baselines silently on the next scan. Statements like "about 10 old shortlist items would alert once" (JIPMER), "expect a one-time flood of about 16 items; clear neepco's seen entry" (NEEPCO), "limit change adds ~21 old items" (PNB) are wrong: those items are recorded as already seen and are not alerted. Nothing needs clearing by hand. If you WANT a previously hidden item caught once, tell me.
- Rule conflicts for you to decide (standing rule = no keyword filters in the script): DMRC, NEEPCO, JIPMER, PFC, National Insurance, UCO Bank, Delhi High Court, Goa Shipyard propose DROPPING excludes such as shortlisted/qualified (fits your rule: do it). GIC Re (tender/GeM/consultant/newsletter), MIDHANI (an include word list + "format" exclude), NCERT (hindi/_HI.pdf exclude) and IDBI/UCO ("format" regex) propose NEW or reworded word lists: recommend keeping only structural filters (menu, apply buttons, Hindi-only duplicates by link pattern) and leaving the rest to the sorter.
- Not a config question: NBEMS alert links are broken today (malformed URL, 404) and POWERGRID links are cut before ".pdf" (404): these two are the most urgent fixes of the batch.
- Open questions that need your answer: PFC: is PFC recruiting in 2026 elsewhere? (page stale, newest advert 02/2024; recommend keep and check manually once). NHAI: replace the HTML source with the JSON API (recommended yes) and add nhai-results. SC: Law Clerk short-term contract adverts pass or hold (agent recommends pass).
