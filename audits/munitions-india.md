## BATCH SUMMARY BLOCK
```
SITE: Munitions India Careers (munitionsindia.in) | VERDICT: FIX
PROPOSED: 1. Edit source "munitions-india": add selector "a[href*='wp-content/uploads']:nth-last-of-type(-n+30)", timeoutMs 15000, keep limit 30 (page is oldest-first, so the current limit 30 reads only the 2022-23 rows); 2. Drop the exclude regex (it would hide "qualified"/"roll no" result lists, which pass); 3. rebaseline on first run (automatic, selector changes)
MISSING TODAY: ALL notices from Dec 2023 onward (about 100 rows incl. every 2025-26 advert, result and general notice): scanner takes the first 30 of 131 rows, which are the oldest
ASK BATLEE: none
```

# Munitions India Limited careers (munitionsindia.in)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Career list (current source) | https://munitionsindia.in/career-ajax/ | free fetch via fetchItems, no extra options | FREE-OK, 131 rows, 1.2-2.4 s, 3/3 runs identical |
| Career shell page | https://munitionsindia.in/career/ | free curl | HTML shell: shows only the latest 4 rows and loads /career-ajax/ for the full list; not needed |
| /careers/ | https://munitionsindia.in/careers/ | free curl | WordPress archive of per-unit sub-pages (afk, cfa, hef...), only an RTI PDF on it; ignore |

URL notes: no-www https works; www https also works (redirects to no-www); plain http FAILED (connection error, HTTP 000), so keep https. The page is a bare HTML fragment (rows are `<tr class="career-data">` with no `<table>`), so the HTML parser drops the tr/td tags and only the `<a>` links remain as siblings; a rowSelector therefore finds nothing (tested, "no notices found"). Use `selector` on the links instead.

## What the scanner catches vs misses (the problem)
- Page order is OLDEST FIRST (row 0 is Nov 2022, row 130 is Sept 2026, the newest rows are appended at the bottom; a few late rows are out of date order by days). The scanner keeps `limit` items from the TOP, so with limit 30 it reads only rows 0-29 (2022 to Oct 2023, e.g. "HR CONSULTANT", "OFI-CPW Result of provisionally selected candidates 2023"). New postings (Sept 2026: OFDR 3 Sep, CFA, HEF 15 Sep, MIL Director DCC IIT Madras 19 Sep) are never seen. This is probably why the site looks quiet.
- Fix (config only, tested): `selector` = `a[href*='wp-content/uploads']:nth-last-of-type(-n+30)` picks the last (newest) 30 links. Tested 3 runs: 30 items, identical, newest = Advengofdr0309.pdf (3 Sep 2026) and FULL-ADVT-FINAL.pdf (19 Sep 2026). As the page grows, the window slides with it, so new rows are always at the end of the window. With about 25 posts in the last 3 months, 30 is enough for scans every few days; limit 40 with nth-last-of-type(-n+40) is a safe alternative if BatLee wants more margin (not tested).
- Old exclude "compassionate|qualified|roll no|unique id": would drop result / shortlist rows ("qualified candidates", "roll no") that must pass. Propose removing it (standing rule: no keyword filters in the script). The `include` "wp-content/uploads" is redundant with the new selector; harmless to keep.
- Titles are the PDF link text ("(PDF, 2.82 MB)" size suffix sometimes present); the unit (OFI, OFDR, HEF, CFA, OFK, OFN, OFBA, OFCH, AFK, MILHQ) is in a separate column and is NOT in the title, so the sorter must read the PDF or filename for the factory. The "Floated on" and "Active upto" dates are also not captured.

Posting speed: current postings are floated the same day as the PDF; newest rows Sept 2026 (3, 15, 19 Sep), so activity is roughly weekly.
Link stability (flood check): links are static wp-content/uploads PDFs, identical across 3 runs. With the sliding window, nothing old re-enters. First run after the selector change will be rebaselined silently; no flood.
Hindi duplicates: appear as a separate row (e.g. "(English)" and "(Hindi)" OFDR rows on 30 Jul 2026); hold the Hindi one.

## Label pattern
No "type: parent" prefix. Title = notice name. Typical forms:
- Jobs: "Engagement of Tenure based DBW / CPW (AOCP trade) in <unit>", "Engagement of Graduate/Diploma Project Engineer on Tenure Basis", "Engagement of Graduate & Technician Apprentices", "Advertisement for ... Hindi Officer on tenure basis".
- Results: "Provisional Select List for ...", "Selection List of ...", "CPW in OFI - General Notice and List of Provisionally selected candidates", "Provisionally Selected list ...".
- Updates: "General Notice - Document verification and joining ...", "Trade Test/Pract Test ... General Notice", "Corrigendum ...", "Cancellation of advertisement ...".
Parent for matching = the post + the factory (unit) from the title or the PDF; the filename sometimes holds a ddmmyy date (OFDR advt 110925 = 11 Sep 2025).

## Hold / pass rules for the sorter
Hold: Hindi duplicate rows; "Posting information (JPG)" images; blank forms / format certificates (character, OBC, SC-ST, non-creamy layer, police clearance, attestation, medical) and "application form" PDFs; consultant / expert / HR consultant / Business Process Domain Expert on fixed-term contract; Director / senior corporate posts on deputation or tenure from outside (e.g. Director DCC at IIT Madras on tenure basis) are a judgement call, hold unless open to all; RTI file (9.0-RTI-Act PDF seen on /careers/, not on the list page); compassionate appointment notices.
Pass: tenure-based CPW / DBW / Project Engineer / Hindi Officer / Medical Practitioner advertisements, Graduate and Technician Apprentice advertisements (apprenticeship is a job-type alert for Sarkari24; BatLee may want to hold apprentices, see uncertain), provisional select lists, selection lists, general notices for document verification / joining / trade test / interview, corrigenda, amendments, cancellations.

## Sample links (audit day, newest at the bottom of the page)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Engagement of Graduate/Diploma Project Engineer on Tenure Basis (Advengofdr0309.pdf, floated 3 Sep 2026) | New Job | OFDR Project Engineer tenure 2026 | Pass |
| General Notice: Recruitment of CPW on Tenure Basis (HEF-Intimation-CPW.pdf, 15 Sep 2026) | Update | HEF CPW tenure 85 posts | Pass |
| ENGAGEMENT OF DIRECTOR, DCC AT IIT MADRAS ON TENURE BASIS (FULL-ADVT-FINAL.pdf, 19 Sep 2026) | New Job | MIL Director DCC IIT Madras | Hold (senior/tenure, judgement) |
| Selection List of GSG Apprentice Candidates (AFK, 31 Aug 2026) | Result | AFK GSG Graduate Apprentices | Pass |
| General Notice - Document verification and joining of provisionally selected candidates (OFI, 21 Aug 2026) | Update | OFI CPW tenure | Pass |
| Engagement of one year Graduate and Technician Apprentice Trainee (OFK-GTA-Adv.pdf, 20 Aug 2026) | New Job | OFK GA/TA apprentices | Pass |
| ENGAGEMENT OF PERSONNEL ON TENURE BASIS (HEF, 85 CPW, 18 Aug 2026) | New Job | HEF CPW tenure 85 posts | Pass |
| Advertisement for Engagement of tenure based Hindi Officer (AFK, 17 Aug 2026) | New Job | AFK Hindi Officer | Pass |
| HINDI OFFICER on tenure basis ... MIL-CO Pune (30 Jul 2026) | New Job | MIL-CO Hindi Officer | Pass |
| Engagement of Tenure based DBW in OFDR (English) (30 Jul 2026) | New Job | OFDR DBW AOCP | Pass |
| Engagement of Tenure based DBW in OFDR (Hindi) (30 Jul 2026) | New Job | OFDR DBW AOCP | Hold (Hindi duplicate) |
| Engagement of Graduate/Diploma Project Engineer OFN (29 Jun 2026) | New Job | OFN Project Engineer | Pass |
| Engagement of Tenure based CPW - OFI (General Notice and list of provisionally eligible, 2026) | Update | OFI CPW tenure | Pass |
| Inviting Applications for Graduate Apprentice and Technical Apprentice at OFCH (15 Jun 2026) | New Job | OFCH 60th batch GATA | Pass |
| Hiring of Project Engineer on tenure basis (HEF, 8 Jun 2026) | New Job | HEF Project Engineer | Pass |
| CPW in OFI - General Notice and List of Provisionally selected candidates (22 Dec 2025) | Result | OFI CPW tenure | Pass |
| HR CONSULTANT (Dec 2022; what the scanner sees today) | Noise | MIL HR consultant | Hold (old, consultant) |
| 2.OFI-CPW-170723-Prescribed format of Character Certificate (2023; scanner sees today) | Noise | OFI CPW 2023 | Hold (blank format) |

## Proposed full source config (JSON)
```json
{
  "id": "munitions-india",
  "name": "Munitions India Careers",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://munitionsindia.in/career-ajax/",
  "selector": "a[href*='wp-content/uploads']:nth-last-of-type(-n+30)",
  "minTitle": 8,
  "timeoutMs": 15000,
  "limit": 30
}
```
(`exclude` removed. `include` is no longer needed.)

## Uncertain points
- Page is sorted oldest-first by the site. If MIL ever re-sorts it newest-first, the nth-last window would read the oldest rows again; a quick check then would show titles from 2022. Today it is clearly oldest-first (rows 0..130 span Nov 2022 to Sep 2026).
- Apprentice advertisements (GA/TA, GSG): passed here; BatLee decides if apprenticeships belong on Sarkari24.
- Factory (unit) not in the title: sorter should read the PDF or the filename to build a unique parent.
- Whether the table after row 130 will ever be paginated: not seen, all 131 rows load in one fetch (152 KB).

## BatLee's corrections
- none yet

## Repairs
- none yet
