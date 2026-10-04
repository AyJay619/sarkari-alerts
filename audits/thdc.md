## BATCH SUMMARY BLOCK
SITE: THDC India Ltd (thdc) | VERDICT: FIX
PROPOSED: 1) replace `include` with rowSelector "tr:has(a[href])", rowTitle "td:nth-child(2)", rowLink "a[href]" (current config can never catch a posting: link text is only "Download (766 KB)", under minTitle 12). 2) add archived-job and result pages to extraUrls. 3) timeoutMs 15000. Keep allowEmpty. Rebaseline on first run is automatic.
MISSING TODAY: the one real row (ESM-type "Associate (Retired Executive)", deadline 22/9/2026, only on Archived Job page) is missed by the old config; with fix it is caught (HOLD, retired-only).
ASK BATLEE: none (note: job-opportunities and new-job-opening list nothing today, so the table layout for live jobs is assumed to match archived-job's; recommend check by eye when THDC next posts).

# THDC India Limited (THDCIL)
Audited: 2026-10-04 (batch) | Group: FREE | Status: ACTIVE (config needs the fix above)

## Pages watched and tested
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Job Opportunities | https://www.thdc.co.in/en/career/job-opportunities | free, 200, ~0.1-0.4s | FREE-OK, page only shows a fake-ad warning notice, no list |
| New Job Opening | https://www.thdc.co.in/en/career/new-job-opening | free, 200 | FREE-OK, says "Currently, no Job Available" |
| Archived Job (proposed add) | https://www.thdc.co.in/en/career/archived-job | free, 200 | FREE-OK, table: S.No / Title / Download / Last Date |
| Result (proposed add) | https://www.thdc.co.in/en/career/result | free, 200 | FREE-OK, says "No results available." |
www and https work. No block, no JS needed. 3 repeated scans all stable.
PDFs download free: yes (HEAD on the advert PDF returned 200).

## What the scanner catches vs misses
- Current config (include "sites/default/files/career", default minTitle 12): returns 0 items on every run. The link text is "Download (766.24 KB)", which is dropped as too short, and the title sits in the 2nd table cell, not the link. So a future posting would NOT be caught. Fixed by the row config below (tested: returns the real row with its full title, 3 of 3 runs).
- state/seen-india.json shows emptySince 2026-09-29, i.e. the scanner has treated the page as empty all along.
- The only real row today was posted around 7-9 Sep 2026 on the Archived Job page (page says Last Updated 9/9/2026), deadline 22/9/2026 18:00. THDC appears to put live adverts in the Archived Job table too (deadline was in the future when posted), so it is worth watching.
- Posting speed vs limit: very rare postings, limit 40 is far more than needed. Links are stable direct PDF URLs under /sites/default/files/career/ (no flood risk).

## Label pattern
Table row title is plain caps text, e.g. "ENGAGEMENT OF 01 NO. OF <post> (<category>) FROM ..." or "RECRUITMENT OF <n> <posts> ...". No advert number in the title; PDF filename is free-form (Advertisment_Associate.pdf). Parent = the post phrase from the title (e.g. "Associate (Retired Executive), 1 post, THDCIL"). Deadline is in the 4th column (not extracted by the scanner).

## Hold / pass rules for the sorter
- HOLD: "engagement of ... (retired executive) ... from PSUs/Govt" (retired-only), deputation / absorption notices, consultants, contract engagement of retired persons, tenders, Hindi duplicates, "fake recruitment advertisement" notice text.
- PASS: regular recruitments (engineers, executive trainees, diploma trainees, etc.), results / shortlists on the Result page, corrigenda / date extensions, interview or document-verification schedules.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| ENGAGEMENT OF 01 NO. OF ASSOCIATE (RETIRED EXECUTIVE) FROM PSUs/GOVT. ORGANIZATION OF REPUTE (Advertisment_Associate.pdf, last date 22/9/2026) | New Job (retired-only) | Associate (Retired Executive), 1 post | HOLD |
That is the only link on all four pages today.

## Proposed config (sources.json entry, NOT applied)
```json
{
  "id": "thdc",
  "name": "THDC Job Opportunities",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.thdc.co.in/en/career/new-job-opening",
  "extraUrls": [
    "https://www.thdc.co.in/en/career/job-opportunities",
    "https://www.thdc.co.in/en/career/archived-job",
    "https://www.thdc.co.in/en/career/result"
  ],
  "rowSelector": "tr:has(a[href])",
  "rowTitle": "td:nth-child(2)",
  "rowLink": "a[href]",
  "allowEmpty": true,
  "timeoutMs": 15000,
  "limit": 40
}
```
(Keep the original url/extraUrls order if preferred; any order works. Keep the existing "exclude" if wanted; the row config makes it unnecessary and no keyword filters are proposed. Changing selectors triggers an automatic rebaseline, so the Sep 2026 retired-executive row will not alert.)

## Uncertain points
- job-opportunities and new-job-opening were empty, so I could not see their live-job table layout; assumed the same as archived-job. If THDC posts there in a different layout, the scanner could look "empty" (allowEmpty hides this). Check by eye when a posting appears.
- The odd use of "Archived Job" for a live advert may be a one-off.

## BatLee's corrections
- none yet

## Repairs
- none
