# Batch 5 summary (units 101-124)

Written 2026-10-03. One block per audit unit; full details in audits/<unit>.md. Rules: audits/_BATCH_RULES.md.

SITE: ICAR (Indian Council of Agricultural Research) | VERDICT: OK
PROPOSED: none (optional: add https://icar.org.in/en/latest-update as FREE source only if BatLee wants admission/counselling notices)
MISSING TODAY: nothing found (ICAR scientist/technical recruitment is run by ASRB, not ICAR; check the ASRB audit)
ASK BATLEE: none
FILE: audits/icar.md

SITE: THDC India Ltd (thdc) | VERDICT: FIX
PROPOSED: 1) replace `include` with rowSelector "tr:has(a[href])", rowTitle "td:nth-child(2)", rowLink "a[href]" (current config can never catch a posting: link text is only "Download (766 KB)", under minTitle 12). 2) add archived-job and result pages to extraUrls. 3) timeoutMs 15000. Keep allowEmpty. Rebaseline on first run is automatic.
MISSING TODAY: the one real row (ESM-type "Associate (Retired Executive)", deadline 22/9/2026, only on Archived Job page) is missed by the old config; with fix it is caught (HOLD, retired-only).
ASK BATLEE: none (note: job-opportunities and new-job-opening list nothing today, so the table layout for live jobs is assumed to match archived-job's; recommend check by eye when THDC next posts).
FILE: audits/thdc.md

SITE: NIA Recruitment Notices | VERDICT: FIX
PROPOSED: 1) replace include/exclude with a row config (rowSelector "table.custom-table tbody tr", rowTitle "td.views-field-title", rowLink "td.views-field-secure-pdf-link a", rowStartDate/rowEndDate on the date cells); keep allowEmpty, rebaseline automatically
MISSING TODAY: everything - the link text is "View" (under minTitle 12), so the current source returns 0 items every scan; today 2 deputation notices (both HOLD) are on the page
ASK BATLEE: none (the page lists mostly deputation notices; pass only the rare open/direct-recruitment ones)
FILE: audits/nia.md

SITE: Cochin Shipyard Careers | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page has no results/shortlist/corrigendum section; /news-release is press releases only)
ASK BATLEE: none
FILE: audits/cochin-shipyard.md

SITE: AWEIL Careers | VERDICT: OK
PROPOSED: 1) add FREE source "AWEIL Notices" https://aweil.in/notice (same selectors, allowEmpty, rebaseline) - it sometimes carries job ads (e.g. Machinist contractual ad); 2) optional: add archive view as a source? NOT recommended (44 old rows).
MISSING TODAY: Machinist/other contractual trade ads posted only on /notice page (not on /career).
ASK BATLEE: Every AWEIL site release bumps "?v=1.4.xx" on all PDF links, so the seen check treats every old row as new (1.4.93 -> 1.4.94 already did this; 12 rows, under the flood limit of 15). Recommend a small code change to ignore a "?v=" query in normalizeLink - I may not touch code in batch mode.
FILE: audits/aweil.md

SITE: Hindustan Shipyard Careers (hsl) | VERDICT: FIX
PROPOSED: 1. Source needs allowEmpty-style tolerance or the existing end-of-group retry (first cold render failed 1 of 4 test starts with "no notices found"; 11 of 11 later runs gave 60 items) - keep retry, no config change needed. 2. Drop "Interview Results|shortlisted" from exclude (rules say results/shortlists PASS; sorter can hold). Everything else unchanged.
MISSING TODAY: nothing found on the page itself; "Interview Results" (plural) titles and shortlisted lists are dropped by the exclude.
ASK BATLEE: none
FILE: audits/hsl.md

SITE: Bangalore Metro Careers (BMRCL) | VERDICT: OK
PROPOSED: none (current rendered-page source works; optional JSON-API route noted below, not recommended)
MISSING TODAY: nothing found (all 3 live notices caught). Caveat: every item links to the career page, not the PDF.
ASK BATLEE: none
FILE: audits/bmrcl.md

SITE: Mumbai Metro (MMRCL) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (only an advertisements feed exists; no results/admit-card/notice feed seen)
ASK BATLEE: none
FILE: audits/mmrcl.md

SITE: NIMHANS Recruitment and Notifications | VERDICT: FIX
PROPOSED: 1) Replace the current html source with a json POST source on the site's own API (bkend.nimhans.ac.in, category recruitment, 50 newest, FREE, same certs/nimhans.pem); full JSON below. 2) Drop include/exclude/allowEmpty (API list is never empty; exclude words are no longer needed, sorter holds them). 3) Rebaseline happens by itself (new URL/type).
MISSING TODAY: EVERYTHING - the current html page is a client-rendered shell ("No Data Found"), the scanner sees 0 items on every run; 66 live notices (incl. open Group B/C, Faculty, SR/JR posts, results, admit card) are invisible.
ASK BATLEE: none (optional: also watch the "Academics and Admissions" category - recommend NO, it is student admissions, not jobs).
FILE: audits/nimhans.md

SITE: NALCO (nalco) | VERDICT: FIX
PROPOSED: 1) nalco: remove "exclude" (it drops all "shortlist" notices = PI/interview/GET shortlists that must pass); keep other fields
PROPOSED: 2) add FREE source nalco-advt (same page, rowSelector "#ctl00_ContentPlaceHolder1_GridView1 tr:has(a.advt-pdf-link)", rowTitle "td:nth-child(3)", rowLink "a.advt-pdf-link", include Uploaded_Data, noFileDownload true, allowEmpty) with rebaseline
MISSING TODAY: all NEW JOB advertisements (grid on the same page; e.g. Advt 10260401 Senior Executives, open 01-10 to 21-10-2026) plus 11 shortlist notices; scanner sees only 12 of 26 notices
ASK BATLEE: 1) to avoid a flood of 11 old shortlists when "exclude" is removed, pre-seed/rebaseline nalco (recommend: yes, rebaseline)
FILE: audits/nalco.md

SITE: DSSSB (Delhi Subordinate Services Selection Board; state) | VERDICT: OK
PROPOSED: none (keep https; http times out. Optional: add timeoutMs 15000 to the 3 sources; not needed, pages answer in ~0.4 s)
MISSING TODAY: nothing found (admit cards are not posted as list items; exam schedules, skill tests, interviews, answer-key notices all appear on notice-of-exam)
ASK BATLEE: none
FILE: audits/dsssb.md

SITE: UPPSC (uppsc-advt, uppsc-notices) | VERDICT: FIX
PROPOSED: 1) uppsc-notices: limit 30 -> 45 (homepage list holds 32 PDF links today, 2 already fall outside limit 30; with 47 it would catch all) 2) uppsc-advt: fix titleReplace backslashes ("^(.+?)\\s*,\\s*(.+)$") - cosmetic, a rebaseline is harmless (2 rows)
MISSING TODAY: nothing structural; titles on the homepage are cut with ".." (full title only in the link's title attribute; needs a small code change: prefer title attr when text ends in "..") so post/department names are partly lost. Advt page rows carry no post/exam name.
ASK BATLEE: allow a small fetchers.mjs change "use link title attribute when it is longer than the text" (recommend yes: gives clean PARENT names for all UPPSC items and several other sites)
FILE: audits/uppsc.md

SITE: UPSSSC (UP Subordinate Service Selection Commission, state) | VERDICT: FIX
PROPOSED: 1) limit 40 -> 60 (page has 48 items today, 8 are cut off at the end); 2) optional: replace "render": true + waitFor with "legacyTls": true (free fetch gives identical 48 items, no browser needed, faster); no URL/selector change so no rebaseline needed
MISSING TODAY: last 8 items of the page (limit cut); titles are shortened by the site with ".." (full title is only in the link's title attribute); admit cards live on a separate upssscadmitcard site (not watched)
ASK BATLEE: none
FILE: audits/upsssc.md

SITE: UPPRPB (UP Police Board) | VERDICT: FIX
PROPOSED: 1) keep uppbpb source as is (home page, 6 latest notices, https works, free). 2) add extraUrls ["https://uppbpb.gov.in/Home/Notice"] (27 notices, ~3 months, one page, no paging) so a burst of >6 notices between scans is not lost; limit 40. 3) add titleReplace to strip "LATEST NOTICE: " prefix and " [ Notice Board ]" suffix so the same PDF has the same title on both pages. 4) timeoutMs 15000. URL change => auto-rebaseline.
MISSING TODAY: home page shows only 6 notices (posting rate up to ~5-8 a day in PET season) so bursts can be missed; Result and Direct Recruitment pages are empty/menu-only (no PDFs).
ASK BATLEE: none (all notices are Hindi only; no English duplicate exists, so none are held as Hindi duplicates - recommend passing them).
Audited: 2026-10-04 | Group: FREE | Status: PROPOSAL (batch mode, config not changed)
FILE: audits/uppbpb.md

SITE: BPSC (Bihar Public Service Commission) | VERDICT: OK
PROPOSED: none (optional: add /advertisement/ as backup FREE source, same selectors, render, rebaseline)
MISSING TODAY: nothing found (home table = "All" feed, 606 records; 10 newest rows shown; only first PDF of a multi-PDF row is caught, which is the main notice)
ASK BATLEE: none
FILE: audits/bpsc.md

SITE: BSSC (Bihar) | VERDICT: FIX
PROPOSED: 1) bssc: set "render": false (plain free fetch works, 0.5s vs 2s browser; same 30 items, same links, so no rebaseline needed beyond what the scanner does itself); 2) add "timeoutMs": 15000
MISSING TODAY: nothing found (NoticeBoard is the one page that lists everything, newest first; no separate results/recruitment pages exist, others 404)
ASK BATLEE: none
FILE: audits/bssc.md

SITE: CSBC (Bihar Police) | VERDICT: OK
PROPOSED: none (optional: raise "limit" 40 -> 60 so a burst of 40+ notices in one scan gap cannot push items off; page lists 178 PDFs newest first, no rebaseline needed for a limit change)
MISSING TODAY: nothing found (home page carries every notice, result and advert as Advt/ PDFs; admit-card portal links on apply-csbc.com have no title/date and are not caught, but each admit card is also announced by an Advt/ "e-Admit Card" notice)
ASK BATLEE: none
FILE: audits/csbc.md

SITE: RPSC (Rajasthan PSC; rpsc + rpsc-advt) | VERDICT: OK
PROPOSED: none (config works as is; optional: nothing to add, see "Other pages")
MISSING TODAY: admit cards and interview letters (home "examlinks" links go to a login portal, no per-notice PDF; only press notes about them are caught)
ASK BATLEE: none
FILE: audits/rpsc.md

SITE: RSSB (4 sources) | VERDICT: FIX
PROPOSED: 1) rssb-advt / rssb-results / rssb-admit: replace the rendered table by the site's own free JSON feed (type json, no render, legacyTls true), clean title "<Exam> <Year> : <Title>" (fixes the flood: titleReplace "^d+s+" lost its backslashes, so the row rank 1,2,3.. stays glued to every title and shifts on each new post).
PROPOSED: 2) rssb: URL to /news (static, 20 dated items, no render, legacyTls true) instead of the 10-item homepage ticker; 3) add rssb-answerkey (filterkey feed, 20 newest, FREE); all rebaseline by themselves.
MISSING TODAY: answer keys (answerkeys page not watched); results/advt/admit alert on every new post only as a mass re-fire (18 new at once) because titles shift; ticker shows only 10 notices.
ASK BATLEE: (a) add the answer-key source (recommended yes, 385 keys, 20 newest watched). (b) /press-notes and /key-objection pages skipped (press notes = hold by rule; key-objection has 4 old items); OK?
FILE: audits/rssb.md

SITE: MPESB (MP Employees Selection Board) | VERDICT: FIX
PROPOSED: 1) mpesb: remove "render":true (plain fetch gives the same 11 links in 0.1s vs 1.4s with Chromium); 2) mpesb include -> "[.](pdf|jpe?g|png)|default_tac|examsList" (today a .jpg "Form Reopen and Exam Date Postponed Notice" is dropped); 3) ADD mpesb-notices https://esb.mp.gov.in/advertisement/Important_message_candidate.htm (31 notices, newest first, include "[.](pdf|jpe?g|png)|default_tac", limit 40, rebaseline); 4) ADD mpesb-answerkeys https://esb.mp.gov.in/Question%20Paper%20and%20Candidate%20Responses/Question_Objection.asp (38 rows, include "cbtexam|cbexams", limit 40, allowEmpty, rebaseline)
MISSING TODAY: the .jpg Group-3 postponement notice (01/10/2026) and every older/ non-homepage notice; answer keys / objection links; no results page found on the free site (results are not published on esb.mp.gov.in pages that list links)
ASK BATLEE: none (note: home page titles are generic, e.g. "Rulebook", "Exam Date Notice", so the sorter must open the PDF to get the parent exam)
FILE: audits/mpesb.md

SITE: HPSC (hpsc, hpsc-advt) | VERDICT: OK
PROPOSED: 1. Optional: add FREE source hpsc-answerkeys = http://hpsc.gov.in/en-us/Examination/Answer-Keys (include Portals/0/, rebaseline; answer-key links are not on the homepage ticker). 2. Optional: hpsc-admit = .../Examination/Admit-card (homepage ticker already carries admit cards, so low value).
MISSING TODAY: answer keys only (not on homepage ticker); everything else (results, announcements, interview/admit notices, advts) is caught.
ASK BATLEE: Add the answer-keys page as a source? Recommend yes (cheap, free, ~0.4 s).
FILE: audits/hpsc.md

SITE: HSSC (Haryana Staff Selection Commission, state) | VERDICT: OK
PROPOSED: none (optional: add an exclude for "Marks of the candidates"/"Revised Marks" rows on hssc-results; the rules say hold in the sorter, so not proposed)
MISSING TODAY: nothing found (each page lists only the latest 10 rows server-side; limit 20 is fine)
ASK BATLEE: none
FILE: audits/hssc.md

SITE: PPSC (Punjab PSC, state) | VERDICT: FIX (works today; simplification proposed)
PROPOSED: 1) remove "render": true (plain fetch returns the same 40 items in ~0.6 s, 5/5 curl runs 200 OK, 1 MB static HTML) 2) timeoutMs 45000 -> 15000 3) raise limit 40 -> 60 (~40 notices/month, so 40 is only about 1 month of cover) 4) rebaseline is automatic only if URL/selectors change; removing render alone may not rebaseline, but links are identical so no flood
MISSING TODAY: nothing found (page is the single "Public Notices" archive, newest first; ads, results, admit cards, answer keys all in it)
ASK BATLEE: none (optional: keep render:true as is if you prefer zero change; it works, just slower and needs the browser)
FILE: audits/ppsc.md

SITE: PSSSB | VERDICT: FIX (works today; render is unnecessary)
PROPOSED: 1) drop "render" and "waitFor" (static fetch with legacyTls returns all 63 upload links in ~0.4 s, 5/5 runs; browser render is slower and a failure risk). 2) limit 40 -> 60 (page holds ~63 links, ~40 posted in Sept alone). 3) add 3 FREE sources, selector "a", include "wp-content/uploads", allowEmpty: vacancy-group-b / -c / -d pages (https://sssb.punjab.gov.in/vacancy-group-b/ etc, 15/5/1 advert links; backup for new advts). 4) timeoutMs 15000.
MISSING TODAY: nothing found on the home list (all 40 newest links caught); /circulars/ returns no notices (empty, skip).
ASK BATLEE: none (optional: keep render as-is if you prefer not to touch a working source; recommendation is still to drop it).
FILE: audits/pssb.md

## Notes from the main session (apply to the blocks above)
- Re-baselining (same correction as batches 2-4): any change to url, selector, include, exclude, limit, etc. changes the source's fingerprint, so the scanner re-baselines it silently on its next scan. Claims that old items "would alert once" (NALCO, others) are wrong: they are recorded as already seen. Nothing needs clearing by hand. If you WANT previously hidden items (e.g. NALCO's 11 shortlists) caught once, tell me.
- Code-level asks (NOT config-only, need your OK): (1) UPPSC (and other sites): prefer the link's title attribute when the link text ends in ".." so post/department names are not cut (small fetchers.mjs change; agent recommends yes). (2) Carried over: REC cookie fetch, AWEIL "?v=" parameter, ICG relative links (batches 1 and 4).
- Biggest "scanner sees almost nothing" finding of this batch: NIMHANS (page is a client-rendered shell, 0 items on every run, allowEmpty hides it; 66 live notices; fix = its own JSON API), NALCO (every new job advert is invisible), RSSB (titles with a row rank glued to them shift on every new post and re-fire whole pages: that was the 18-link flood; fix = its JSON feed). These three fixes matter most.
- Simplifications that fit your rules: BSSC, PPSC, PSSSB, MPESB, UPSSC can drop the browser render (free plain fetch gives the same items and is faster), timeoutMs 15000.
- Questions for you: HPSC answer keys page as a new source (agent: yes); RSSB answer-key source (yes) and skip /press-notes; Bihar/UP/Punjab sources are otherwise OK.
