# Batch 2 summary (units 26-50)

Written 2026-10-03. One block per audit unit; full details in audits/<unit>.md. Rules: audits/_BATCH_RULES.md.

SITE: NTPC Careers | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (PDF links are not captured by design: tokens change every visit, so every notice points to the recruitment page)
ASK BATLEE: none
FILE: audits/ntpc.md

SITE: BPCL Careers | VERDICT: OK
PROPOSED: none
MISSING TODAY: text-only "UPDATE AS ON <date>" lines (last-date extensions, CBT dates) have no link, so they are not caught; the "Apply Online" and travel-reimbursement links are excluded on purpose
ASK BATLEE: none
FILE: audits/bpcl.md

SITE: HAL Careers | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (API lists only currently active notices, 5 today; no PDF link exposed, link is the career page + #id)
ASK BATLEE: none
FILE: audits/hal.md

SITE: Indian Army (army + army-notices) | VERDICT: OK
PROPOSED: none (optional: timeoutMs 15000 on both, no other change)
MISSING TODAY: nothing found (admit-card table is a stale May-June 2026 CEE schedule; real recruitment/results are announced inside the CEE portal login, not as public links)
ASK BATLEE: none
FILE: audits/army.md

SITE: Indian Navy (joinindiannavy.gov.in) | VERDICT: FIX
PROPOSED: 1. Keep "navy" as is (FREE, www host, 8 events, 5/5 runs ok); 2. Add FREE source "navy-civilian" = https://indiannavy.gov.in/content/civilian (no-www host, selector ".sb_pdf_box a", limit 25, minTitle 15, rebaseline)
MISSING TODAY: all civilian recruitment (INCET Group B/C, Boat Crew Staff, apprentices): select lists, results, corrigenda, adverts - on the separate indiannavy.gov.in civilian page, not watched
ASK BATLEE: none
FILE: audits/navy.md

SITE: BARC (barc-vacancies, barc-results) | VERDICT: FIX
PROPOSED: 1) ADD FREE source "barc-eadv" = recruit.barc.gov.in nbArchive.jsp?unit=ADV (real job adverts), rebaseline. 2) ADD FREE source "barc-enotice" = nbArchive.jsp?unit=BARC (screening lists, call letters, final results of Advt 06/2026 etc.), rebaseline. 3) barc-vacancies: add allowEmpty:true (page often empties) + timeoutMs 15000. 4) barc-results: no change (works, 19 rows, stable).
MISSING TODAY: The live Advt 06/2026 (SA/B, SA/C paramedical, 16-Jul) and all its Screened IN/OUT lists (latest 01-Oct-2026) are NOT on careers/recruitment.html or result.html; they are only on recruit.barc.gov.in.
ASK BATLEE: none (new pages follow standing decision: add as FREE with rebaseline).
FILE: audits/barc.md

SITE: NTA | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found for the notice feed; the recruitment portal (ntarecruitment.ntaonline.in) did not resolve from this PC so NTA's own staff vacancies are only caught when also posted in "Latest @ NTA"
ASK BATLEE: (1) NTA is mostly admission exams (NEET, CUET, JEE, AIAPGET, ICAR, SWAYAM). Pass only job-relevant ones (UGC-NET, CSIR-NET, NTA staff posts, RMS/RIMC/Sainik school entries?) and hold the rest? Recommend: pass UGC-NET, CSIR-NET and NTA vacancies; hold pure admission-exam notices unless you want them.
FILE: audits/nta.md

SITE: NVS (Navodaya Vidyalaya Samiti) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (main Recruitment feed has 21 items, scanner gets all 21; the 01/2025 advert PDF itself is no longer in the feed)
ASK BATLEE: none
FILE: audits/nvs.md

SITE: BSF Recruitment (rectt.bsf.gov.in) | VERDICT: OK
PROPOSED: none (optional: add `static/bsf/pdf` to "include" only if BatLee wants the older fixed-link block; not recommended, those links are 2025 leftovers)
MISSING TODAY: nothing found today ("Current Recruitment Openings" says "No Job(s) Available"); risk: when a job opens, its row will be an apply link inside that block, not a cloudfront/bsf/custom PDF, so the scanner may not see it
ASK BATLEE: none (recommend: when BSF shows a job, check that the scanner caught it; if not, send me the page HTML at that time and I add a row selector)
FILE: audits/bsf.md

SITE: CRPF Recruitment (rect.crpf.gov.in) | VERDICT: OK
PROPOSED: 1. Optional: raise "crpf" limit 40 -> 80 (page lists 36 notices after excludes today, so it sits near the cap; pinned Constable-2026 notices sit at the bottom of the list); no URL/selector change so no rebaseline
MISSING TODAY: nothing found (compassionate-appointment lists are excluded on purpose; they are hold/noise)
ASK BATLEE: none
FILE: audits/crpf.md

SITE: ITBP Recruitment (itbp + itbp-results) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (new notice 362.pdf, the 02-10-2026 sportsperson corrigendum, is not yet in the seen file but is caught at the next scan; admit cards are login-only, no public list)
ASK BATLEE: none (note for sorter: 3 text-only rows have no PDF, their link is the news page, title is cut at about 110 characters)
FILE: audits/itbp.md

SITE: SSB Recruitment | VERDICT: OK
PROPOSED: none (optional: add /advertisementsUrl as FREE source, see below)
MISSING TODAY: nothing found on notificationUrl (30 of 135 rows watched, newest first); open-job rows also appear there, but the clean Advertisements table (advt no, post, last date) is not watched
ASK BATLEE: Add https://recruitment.ssb.gov.in/advertisementsUrl as a 2nd FREE source (extra clean list of open jobs with last date; rebaseline)? Recommend yes, low cost. Also note: all links are the page itself (PDFs only via form POST), so Sarkari24 agents must open the page and click PDF Download.
FILE: audits/ssb.md

SITE: Indian Coast Guard CGCAT (icg) | VERDICT: FIX
PROPOSED: 1) add FREE json source icg-news = https://joinindiancoastguard.cdac.in/cgcat/getScrollJson (titleFormat "{Data}", linkField url, limit 15, allowEmpty, timeoutMs 15000, rebaseline) - needs relative-link handling, see ASK; 2) add timeoutMs 15000 to icg (no other change)
MISSING TODAY: merit lists, result/admit-card notices, date extensions (only in the JSON feed behind the home page news ticker, not in the HTML the scanner reads); last entry is Dec 2025, nothing newer today
ASK BATLEE: JSON links are mixed: PDFs are relative ("./assets/img/news/..."), login/registration links are absolute, and config linkPrefix is all-or-nothing. Recommend a tiny code change (resolve relative links against the source URL); config-only fallback is fallbackLink = site home (no PDF link, titles still unique)
FILE: audits/icg.md

SITE: AIIMS Exams (notices) | VERDICT: OK
PROPOSED: none (source "aiims" stays as is; its Next-Action id is the known "may break if the site is rebuilt" risk). No extra AIIMS sources proposed.
MISSING TODAY: nothing found on the main feed (50 newest notices, ~1-2 per day, covers 7 weeks). Not watched, by choice: miscellaneous-notice feed (9 items in 2026, mostly deputation) and individual AIIMS sites (mostly contract/project/walk-in posts).
ASK BATLEE: optional - individual AIIMS sites (Bhopal, Raipur, Rishikesh...) post only walk-in/contract/project jobs that the standing rules hold; recommend NOT adding them. Regular AIIMS jobs (CRE, faculty, Group A/B) all show up in the aiimsexams notice feed.
(All links in the catch point to the notice page, not a PDF: this is deliberate, the PDF links are signed and expire after 7 days.)
FILE: audits/aiims.md

SITE: EPFO Recruitment | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page lists only deputation / contract / consultant / LDCE items; EPFO direct exams (SSA, Stenographer) are run via NTA and UPSC, already covered by those sources)
ASK BATLEE: none
FILE: audits/epfo.md

SITE: Bank of Baroda | VERDICT: FIX
PROPOSED: 1) Add FREE source "bob-updates" = same URL/extraCerts/jsonInPage as bob, titleField "latestUpdate", linkField "cta", limit 600, rebaseline (69 rows today; catches call letters, results, shortlists, addenda on existing posts).
PROPOSED: 2) Keep the existing "bob" source unchanged (works, 5 of 5 fetches OK, ~0.3 s, 391 items stable). Optional: drop the "exclude" regex from sources.json and hold FLC / guest players in the sorter instead (standing rule: no keyword filters) - 60 rows today.
MISSING TODAY: status updates on already-posted advts (call letters, results, shortlists, addenda) because the title never changes - they live in the "latestUpdate" field; no separate results page exists.
ASK BATLEE: bob-updates titles carry no parent (e.g. "Final Result Declared"): sorter must take the parent from the link/slug - OK? Recommend yes. Also ~15 of 69 rows are post-selection noise (offer letters, project completed, compensation negotiation) - hold in sorter, recommend yes.
FILE: audits/bob.md

SITE: PNB Recruitment (pnb.bank.in) | VERDICT: FIX
PROPOSED: 1. pnb: limit 40 -> 80 (page has 61 notices; limit 40 cuts the last 21, which are the live "750 Local Bank Officers HRP 2026-27" group). Nothing else changes (URL, selectors same).
MISSING TODAY: all 21 items of the 750 LBO 2026-27 group (advert 20-Jul-2026, Apply link, corrigendum 07-Aug, call letters 28-Aug, handouts 04-Sep) plus older LBO 2025-26 items; every item links to the page itself (postback links, no PDF URL).
ASK BATLEE: Raising the limit will list ~21 OLD items as new on the next run (limit change is not auto-rebaselined). Recommend: run once with a rebaseline / mark seen before the next real scan.
FILE: audits/pnb.md

SITE: Canara Bank Careers | VERDICT: FIX
PROPOSED: 1) url -> https://www.canarabank.bank.in/pages/recruitment, selector -> "div.text-sec li a" (rebaseline on first run, 23 items); keep minTitle 15, limit 40
MISSING TODAY: current source (pages/career) shows only 5 old links; it misses IBPS-CRP-XV CSAs and POs and Graduate Apprentices FY 2026-27 (all [NEW] on the recruitment page)
ASK BATLEE: none
FILE: audits/canara.md

SITE: NABARD Career Notices | VERDICT: FIX
PROPOSED: 1) nabard: replace `include: "CareerNotices"` with selector `.career_row a.pdf-link[href]:not([href$="CareerNotices/"]), .career_row .ext_link a[href^="http"]` + contextClosest `.career_row` + contextFind `.career_title` + minTitle 4, rebaseline true (drops empty "Apply Here" folder links, adds the real IBPS apply link and the post/advert name to every title)
MISSING TODAY: nothing missed (page loads free, newest first, 4/4 test fetches OK); but titles are bare ("Notification", "Select List") and "Apply Here" items point to an empty folder URL
ASK BATLEE: none (contract "Specialist"/Young Professionals notices: I recommend HOLD per the consultant rule)
FILE: audits/nabard.md

SITE: RRC family (18 sources) | VERDICT: OK
PROPOSED: none (optional: add rrc-sr open-market-recruitment.html as an extraUrl, needs an include for its sub-page links)
MISSING TODAY: rrc-sr lists only 5 links, the real CEN/apprentice notices sit inside its sub-pages; rrc-ncr/swr/scr/cr show only 8-10 recent items (fine for new-only scanning)
ASK BATLEE: group dedupe only merges IDENTICAL titles (no groupTemplate in sources.json), so a CEN-wide notice posted on many RRCs arrives as several catch items with different wording; recommend leave as is and let the sorter merge by CEN number (floodLimit 15 per site, none near it)
FILE: audits/rrc.md

SITE: Indian Air Force (Agniveervayu, Airmen, AFCAT) | VERDICT: FIX
PROPOSED: 1) iaf-agniveervayu: include -> "pdffiles|digialm|index\.html$" (also catches link-less notices: Phase-I result, selected-candidates list, objection portal), rebaseline. 2) iaf-airmen: include -> "pdfforms|digialm|airmen/?$" (same reason), rebaseline. 3) iaf-afcat: no change. 4) Add timeoutMs 15000 to all three (all answer in under 0.5 s).
MISSING TODAY: agniveervayu: objection-portal notice (22-23 Sep 2026 exam), Phase-I result, "List of Selected Candidates Non-Combatant 02/2026"; airmen: objection-portal notice (23 Sep 2026 exam), Phase-I result (all have no link, dropped by the include filter). AFCAT: notification PDFs and objection / exam-city / edit-window notices sit in HTML comments (not live, correctly ignored).
ASK BATLEE: none
FILE: audits/iaf.md

SITE: CISF | VERDICT: FIX
PROPOSED: 1) add source cisf-ticker (FREE, same URL https://www.cisf.gov.in/home.php, selector `marquee a[href$=".pdf"]`, minTitle 12, limit 20, allowEmpty) to catch the "LATEST" ticker; 2) leave existing cisf source unchanged (works, 22 items, 4/4 repeats stable)
MISSING TODAY: ticker notice "Admit Card for PST and Documentation, Paramedical Staff 2026" (assets/pdfs/2026/08/rectt_imp_not_pmsr_eng.pdf) is not in the news cards; the recruitment portal cisfrectt.cisf.gov.in notice board is also not watched
ASK BATLEE: none (recruitment portal not proposed: its links change on every load, so it would flood; recommend skipping)
FILE: audits/cisf.md

SITE: Assam Rifles | VERDICT: OK
PROPOSED: none (optional: drop "compassionate" from exclude, see ASK)
MISSING TODAY: 4 English compassionate-ground items (advert Apr 2026, final result Sep 2026, second list Sep 2026) are dropped by the exclude filter; PDFs have no per-item link (all link to the join page)
ASK BATLEE: Keep "compassionate" excluded? Recommend keep (only for wards of deceased personnel, not an open job) but let sorter treat as HOLD if ever shown.
FILE: audits/assam-rifles.md

SITE: FCI Recruitment | VERDICT: OK
PROPOSED: none (optional: set timeoutMs 30000 if flaky; page needs local browser render, 6-10 s)
MISSING TODAY: nothing found (page lists only contract/retired/deputation posts today; Category II/III regular exams are not on it)
ASK BATLEE: none
FILE: audits/fci.md

SITE: Employment News (adverts) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page lists the last ~50 weekly adverts, scanner keeps all 50 real ones; the other 4 tabs hold only a policy notice and an old 2023 deputation ad)
ASK BATLEE: none (note: titles are only the organisation name + issue, so the sorter must open each PDF to see posts/dates; recommend leaving as is)
FILE: audits/employment-news.md

## Notes from the main session (apply to the blocks above)
- Re-baselining: any change to a source's URL, selector, include, exclude, limit, titleFromHref etc. is part of its fingerprint, so the scanner silently re-baselines that source on its next scan. That means: (a) "the hidden items appear once" / "will alert those old items once" claims after dropping or loosening an exclude (e.g. Delhi High Court, IDBI, UCO Bank) are wrong: they are recorded as already seen and never alerted; (b) PNB / NIACL claims that the state file must be cleared by hand are wrong; nothing needs clearing. If you WANT the previously hidden items caught once, tell me and I will add a one-off flag instead.
- Rule conflicts to decide: several audits propose script-level include/exclude word lists (GIC Re: tender/GeM/consultant/newsletter; UCO Bank and IDBI: replacing the "format"/"qualified" excludes). The standing decision is "no keyword filters in the script": recommend keeping only structural filters (menu links, apply buttons) and leaving the rest to the sorter.
- Code-level asks, not config-only (need your OK before anything is changed): ICG relative PDF links in its JSON feed (batch 1). None new in this batch.
