# RRC family (18 sources, group "rrc")
Audited: 2026-10-04 | Group: FREE (all 18) | Status: ACTIVE | Batch mode, no config changed

## BATCH SUMMARY BLOCK
SITE: RRC family (18 sources) | VERDICT: OK
PROPOSED: none (optional: add rrc-sr open-market-recruitment.html as an extraUrl, needs an include for its sub-page links)
MISSING TODAY: rrc-sr lists only 5 links, the real CEN/apprentice notices sit inside its sub-pages; rrc-ncr/swr/scr/cr show only 8-10 recent items (fine for new-only scanning)
ASK BATLEE: group dedupe only merges IDENTICAL titles (no groupTemplate in sources.json), so a CEN-wide notice posted on many RRCs arrives as several catch items with different wording; recommend leave as is and let the sorter merge by CEN number (floodLimit 15 per site, none near it)

## Test method
Scanner's own fetchItems(src), run 3 times per source (free fetch from this PC). All 18 returned rows 3/3, identical link lists each time, no errors, no timeouts. Slowest first call 1.6 s (wcr, ner); repeats 0.05-1.4 s. Nothing needs ScrapFly.

## Pages watched
| Source | Rows | Verdict | Notes |
|---|---|---|---|
| rrc-ecor (rrcbbs.org.in, classicTls) | 40 | FREE-OK | PET, answer key, call letters (digialm), GDCE; titles carry a garbled char (charset) |
| rrc-sr (rrcmas.in) | 5 | FREE-OK, thin | answer keys + 2 menu pages (open-market-recruitment, GDCE); details inside sub-pages |
| rrc-swr (rrchubli.in) | 8 | FREE-OK | PET notices, e-call letter, digialm links |
| rrc-nr (rrcnr.org, rows tr.content) | 40 | FREE-OK | "Kind Attention:" prefix on titles; admit cards, GDCE, CEN 08/2024 |
| rrc-ncr (rrcpryj.org/notification/) | 10 | FREE-OK | apprentice, cultural quota, GDCE, DV notices |
| rrc-wr (rrc-wr.com) | 40 | FREE-OK | "Click here to view/download" prefix; Hindi + English notification pair |
| rrc-nwr (rrcjaipur.in/Notice) | 40 | FREE-OK | titles start with a dd-mm-yyyy date |
| rrc-ser (rrcser.co.in) | 40 | FREE-OK | PET qualified / not-qualified roll lists pass the include (no "qualified" exclude here) |
| rrc-ecr (ecr.indianrailways.gov.in) | 40 | FREE-OK | "Notice No. x/yyyy: title" format |
| rrc-secr (+4 extraUrls, limit 500) | 101 | FREE-OK | whole archive; old items are baseline only |
| rrc-secr-sections | 9 | FREE-OK | menu of CEN/quota sections; a NEW section name = new notification set |
| rrc-ner (+5 extraUrls) | 173 | FREE-OK | archive back to 2018, baseline only |
| rrc-ner-sections | 15 | FREE-OK | section menu |
| rrc-nfr (+3 extraUrls) | 206 | FREE-OK | mostly CEN 08/2024 PET notices |
| rrc-wcr (+5 extraUrls) | 36 | FREE-OK | 21 of 36 are Hindi |
| rrc-wcr-sections | 36 | FREE-OK | includes 3 Hindi "important notice" section links |
| rrc-scr (https://203.153.33.92/) | 8 | FREE-OK | raw IP works as is (3/3, no cert error); links also use the IP; breaks if SCR moves to a domain |
| rrc-cr (rrccr.com/Home/Home) | 5 | FREE-OK | PET and eligibility-status notices |

## Coverage today
Caught: CEN 08/2024 (Level-1 / Group D) PET schedules, PET results, DV notices; GDCE notifications and corrigenda; Act Apprentice notifications and corrections; Sports / Cultural / Scouts quota notifications; answer keys and objection trackers (digialm); e-call letter / admit card links; CBT reschedules. No NTPC or ALP notice was on any page today (CEN 08/2024 is the active Level-1 cycle).
Missed: rrc-sr sub-pages. Pages with few rows (ncr, swr, scr, cr, sr) could drop items only if more new items than shown appear between two scans (unlikely).

## Dedupe and flood check
- catch.mjs groups by `i.groupTitle ?? i.title`; no RRC source has groupTemplate, so only identical titles merge across sites. Today only 3 titles repeat across sites: "Cultural Quota" and "CEN 08/2024" (the -sections menus of different zones, merge correctly) and "List of candidates shortlisted for PET" (secr + wcr).
- Region-specific lists (PET batches, shortlists) are different per RRC, correct. A CEN-wide notice (new CEN, schedule, corrigendum) will arrive as up to 18 items with different titles. The sorter must merge by CEN number / advertisement.
- Flood: floodLimit 15 per site. First scan or changed settings rebaseline silently. A new CEN gives 1-3 new links per site, far under the limit. The big archives (secr, ner, nfr) only matter if their page structure changes (then re-baselined silently).

## Label pattern
No common pattern. Parent = CEN number ("CEN 08/2024", "CEN 09/2025"), "GDCE 01/2026", "Act Apprentice 2026-27", "Sports Quota 03/2026", "Cultural Quota 02/2026". Strip prefixes "Kind Attention:", "Click here to view/download", leading dd-mm-yyyy (nwr), "Notice No. x/yyyy:" (ecr), "Notification for" (nfr). Type words: PET, CBT, e-Call letter / admit card, Final Answer Key / Objection Tracker, Result, Corrigendum / Addendum / Postponement / Rescheduling.

## Hold / pass rules for the sorter
HOLD: GDCE / LDCE / departmental / promotion / departmental TBT (shunting master, STA/JTA etc.), contract / ex-servicemen engagement, retired re-engagement, Hindi duplicates (wcr is mostly Hindi), roll-number lists ("PET qualified / not qualified", "unique ID details"; keep PET RESULT and shortlist notices), normalised cut-off marks, free travel authority, venue-only instructions, block-date info notices (unless they reschedule the exam). GDCE 2026 notifications are departmental: HOLD even though they look like New Job.
PASS: open CEN / Act Apprentice / Sports / Cultural / Scouts-Guide notifications (with corrigendum, addendum, date extension), admit card / e-call letter links for open-market exams, final answer key / objection tracker for open-market exams, results and shortlists (CBT result for PET, PET result), PET / CBT schedule and postponement for the current CEN 08/2024, document verification notices.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Notice for Physical Efficiency Test (PET) against CEN 08/2024 (ecor) | Update | CEN 08/2024 | Pass |
| Link for downloading e-Call Letter of CBT 04.09.2026 (ecor, digialm) | Admit Card | ECoR CBT Sept 2026 | Check (departmental?) |
| Final Answer Key of CBT for departmental posts (ecor) | Answer Key | ECoR departmental CBT | Hold |
| Postponement of CBT scheduled on 15.09.2026 (ecor) | Update | ECoR CBT | Pass if open-market |
| Detailed Notification of Cultural Quota 2026-27 CQ-02/2026 (ncr) | New Job | NCR Cultural Quota 02/2026 | Pass |
| Addendum: trades / slots in Act Apprentice notification (ncr) | Update | NCR Act Apprentice 01/2026 | Pass |
| Detailed notification for Engagement of Apprentices 04/2026 (nwr) | New Job | NWR Apprentice 04/2026 | Pass |
| Detailed notification no. 03/2026 Sports Quota (nwr) | New Job | NWR Sports Quota 03/2026 | Pass |
| PET Results held on 10.09.2026 of Level-1, CEN 08/2024 (scr) | Result | CEN 08/2024 SCR | Pass |
| Online GDCE Notification 02/2026 non-safety (scr) | New Job | SCR GDCE 02/2026 | Hold (departmental) |
| Notification in English, uploaded 27-08-2026 (wr) | New Job | WR notification | Pass |
| Notification in Hindi, uploaded 27-08-2026 (wr) | Noise | same | Hold (Hindi duplicate) |
| LIST OF NOT QUALIFIED CANDIDATES FOR PET 30/09/2026 (ser) | Noise | CEN 08/2024 SER | Hold |
| LIST OF PET QUALIFIED CANDIDATES 30/09/2026 (ser) | Result | CEN 08/2024 SER | Hold (roll list) |
| Answer Keys for TBT exam held on 24.09.2026 (ser) | Answer Key | SER TBT departmental | Hold |
| Schedule for departmental promotion through TBT (nr) | Noise | NR | Hold (promotion) |
| CEN 08/2024 Important Instructions for shortlisted candidates (nr) | Update | CEN 08/2024 | Pass |
| Revised schedule of PET CEN 08/2024 (ner) | Update | CEN 08/2024 | Pass |
| Re-engagement of Retired Officers (ner-sections) | Noise | NER | Hold |
| CEN 09/2025 (wcr-sections) | section label | CEN 09/2025 | Pass only if newly appearing |

## Proposed config
No change required. Optional, only with BatLee's approval (rebaselines itself):
```json
{"id":"rrc-sr","extraUrls":["https://www.rrcmas.in/open-market-recruitment.html"]}
```
The GDCE sub-page is departmental, so not worth adding.

## Uncertain
- rrc-scr uses a raw IP: works today (3/3) but a failure there should be repaired by re-checking for a domain.
- Not opened this run: the sub-pages of rrc-sr (whether they list the full CEN set).
- The sorter-side CEN merge is not tested here; the scanner only dedupes identical titles.
