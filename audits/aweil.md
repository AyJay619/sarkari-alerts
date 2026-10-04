# AWEIL (Advanced Weapons and Equipment India Ltd) - batch audit
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (works as is)

## BATCH SUMMARY BLOCK
SITE: AWEIL Careers | VERDICT: OK
PROPOSED: 1) add FREE source "AWEIL Notices" https://aweil.in/notice (same selectors, allowEmpty, rebaseline) - it sometimes carries job ads (e.g. Machinist contractual ad); 2) optional: add archive view as a source? NOT recommended (44 old rows).
MISSING TODAY: Machinist/other contractual trade ads posted only on /notice page (not on /career).
ASK BATLEE: Every AWEIL site release bumps "?v=1.4.xx" on all PDF links, so the seen check treats every old row as new (1.4.93 -> 1.4.94 already did this; 12 rows, under the flood limit of 15). Recommend a small code change to ignore a "?v=" query in normalizeLink - I may not touch code in batch mode.

## Pages watched and tested
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Careers (current view) | https://aweil.in/career | free fetchItems, 4 runs, all 12 rows, no failures, ~0.4 s | FREE-OK |
| Careers archive | https://aweil.in/career?lang=en&section=careers&view=archive | 44 old rows | not needed |
| Notices | https://aweil.in/notice | free curl, 7 rows | proposed extra |
URL variants: https no-www works; https www works; http (no-www) times out at 15 s (use https). Timeout 15000 is fine; page answers in under 1 s.
No ScrapFly needed. PDFs download directly from the same host (free).

## What the scanner catches
Current view = 12 rows (jobs, results, cancellation). Page is a single list, newest first, rows are tr[data-document-row]. Dates are not shown in the row (no date field). Link pattern: /download/recruitment/<year>/<file>.pdf?v=<site version>.
Flood check: links are stable except the "?v=" site-version suffix, which changes on every site release and re-presents all rows as new (see ASK). Rows move off to archive after a while (e.g. SAF Kanpur mason ad is already in archive).

## Label pattern
Titles are free text, no fixed prefix. Cues:
- Job: "Advertisement for ...", "Fixed Tenure based Contractual hiring of <post> in GCF, Jabalpur - Last date ...", "Requirement of ...", "Filling of Technical Posts ..."
- Result: "Result for the post of <post> - Advt. No. AWEIL/03/2026", "Result of GCF, Jabalpur for FTE 2026-27 ... against Advt. No. ...", "Publication of Results for Interview ..."
- Update: "Cancellation of Advertisement No. AWEIL/01/2025 ...", "... last date extended to ..."
- Parent: Advt No. when given (AWEIL/02/2025, AWEIL/03/2026, 01/Hiring-GSF/AWTM/2026-27, 10201/11/0015/2627) else unit + post (GCF Jabalpur Design Engineer, etc.).
Nearly every AWEIL post is CONTRACT / fixed-tenure (not regular), so BatLee's "small contract roles" hold rule bites often: treat full-time fixed-term executive posts and GCF tradesman/engineer mass hiring as PASS; single consultant / retired-only as HOLD.

## Hold / pass rules for the sorter
HOLD: retired central govt employee / ex-servicemen-only ads (Draft-Advt-ESM, SAF retired mason, DIRECTOR DCC IIT Kanpur retired only, Consultant Accounts retired only); consultant roles; CEO/MD vacancy circular of a JV company; /notice items on absorption package, labour codes, training plan, deemed deputation.
PASS: open fixed-term / fixed-tenure ads (GCF tradesman, design engineers, GSF technical posts, executive posts), results, shortlists, cancellations, extensions.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Result for the post of Legal Expert | Result | Legal Expert fixed-term | Pass |
| Result for the post of Executive/Official Language | Result | Executive Official Language | Pass |
| Fixed Tenure hiring of Experienced Tradesman in GCF, last date 11.10.2026 | New Job | GCF Jabalpur Tradesman 2026 | Pass |
| Fixed Tenure hiring of Design Engineers in GCF, last 11.10.2026 | New Job | GCF Jabalpur Design Engineer | Pass |
| GSF Filling of Technical Posts, Advt 01/Hiring-GSF/AWTM/2026-27 | New Job | GSF technical posts | Pass |
| Result of GCF FTE 2026-27 Experienced Tradesman, Advt 10201/11/0015/2627 | Result | GCF advt 10201/11/0015/2627 | Pass |
| Result for the post of Advisor, AWEIL/03/2026 | Result | AWEIL/03/2026 | Pass |
| GCF Jabalpur Advertisement Skilled (Experienced) Tradesmen | New Job | GCF Skilled Tradesmen | Pass |
| Executive (Corporate Communication), AWEIL/02/2025 | New Job | AWEIL/02/2025 | Pass |
| GCF Advertisement Retired Central Govt Employees incl. Ex-Servicemen | New Job | GCF retired | Hold (retired only) |
| Cancellation of Advt AWEIL/01/2025, 10 Consultant (Accounts) | Update | AWEIL/01/2025 | Pass (update; the original was retired-only consultant, sorter decides) |
| Publication of Results, Executive Finance interview 20.11.2025 | Result | Executive Finance | Pass |

## Proposed config (not applied)
```json
{
  "id": "aweil-notices",
  "name": "AWEIL Notices",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://aweil.in/notice",
  "rowSelector": "tr[data-document-row]",
  "rowTitle": ".dbim-document-title",
  "rowLink": "a[href]",
  "minTitle": 15,
  "limit": 30,
  "allowEmpty": true
}
```
Existing "aweil" source: keep unchanged (its exclude regex is copied from another site and harmless).

## Uncertain
- /notice is mostly HR/absorption news; value is low, only 1 job ad seen there. Adding it is optional (BatLee's call; recommend adding, low cost).
- No dates available on rows, so the date field stays empty.
