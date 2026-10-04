## BATCH SUMMARY BLOCK
```
SITE: Chennai Metro Rail (CMRL) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page lists all job notices, newest first, 59 cards; scanner reads top 40)
ASK BATLEE: none
```

# Chennai Metro Rail (CMRL)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, no config change proposed)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Job Notifications (only recruitment page, covers notifications, addenda, extensions, selection lists) | https://chennaimetrorail.org/job-notifications/ | free fetch, html, rowSelector .job-card | FREE-OK |

URL variants: https without www = 200 (works). www redirects 301 to non-www. http also answers 200. Keep the current https non-www URL.
Scanner test: 4 runs, each 40 items, 0.9-1.3 s. No flakiness. Default timeout is fine.
PDF links are plain files under /wp-content/uploads/YYYY/MM/ (direct, free).
No separate results/admit-card pages found: CMRL has no big exam cycle; selection lists appear on the same page.

## Posting speed / link stability
Newest entry first. Recent cadence about 1 to 3 items a month; 40-item limit covers about 2 years, so no risk of a posting scrolling off. Links are stable uploaded PDFs (no flood risk). A few older items appear twice with a "-1" PDF copy (different link, same title); harmless, sorter merges.

## Label pattern
Titles are free text, usually "[Detailed] Employment Notification No. CMRL-HR-<CON|DEP|CON-DEP|REG>-<nn>-<year> dated <date> for <posts> on <contract/deputation/regular> basis".
Parent = the notification number, e.g. "CMRL-HR-CON-DEP-05-2026". Updates quote the parent number in their title ("Addendum ... vide Employment Notification No. CMRL-HR-REG-03-2026 dated 01-07-2026"). Number formats vary a little (CON-DEP vs CONDEP, "No.CMRL"), match on the digits-and-year part.
Types: "Employment Notification" = New Job; "Addendum / Extension of last date / Cancellation / Corrigendum" = Update; "Selection List" = Result; "Intimation of interview" = Update (current cycle) .

## Hold / pass rules for the sorter
- HOLD: posts offered only on deputation (title says "on deputation basis" alone, e.g. "GM (Tracks) on deputation basis"). Most CMRL notices are "contract / deputation" and are senior posts (CGM/GM/JGM/DGM); mixed contract/deputation = PASS (open to outsiders on contract). Pure-deputation = HOLD.
- HOLD: old items (2023 and earlier) if ever re-listed.
- PASS: regular-basis and contract notifications, addenda, extensions, cancellations, selection lists (results), interview intimations for current notices.
- Note: most posts are senior contract roles with small vacancy counts; BatLee may prefer to hold "single senior contract post" notices as consultants-style. Not applied; standing rule holds only "small consultant roles".

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Detailed Employment Notification CMRL-HR-CON-DEP-05-2026 dated 23-09-2026 for JGM (PMIS),(RS) and other posts on Con / dep basis | New Job | CMRL-HR-CON-DEP-05-2026 | Pass |
| Addendum & Extension of last date upto 31-07-2026 for DGM (AFC) & MGR (AFC) | Update | CMRL-HR-REG-03-2026 | Pass |
| Emp notification CMRL-HR-REG-03-2026 dated 01-07-2026, GM (Ops), DGM (RS), DGM (AFC), Mgr (AFC) regular | New Job | CMRL-HR-REG-03-2026 | Pass |
| Employment Notification CMRL-HR-CON-DEP-04-2026 dated 01-07-2026 CGM/GM (ES)&(RS) etc. | New Job | CMRL-HR-CON-DEP-04-2026 | Pass |
| Selection List ... CMRL-HR-CON-DEP-01-2026 CGM-GM (EC-UGC) | Result | CMRL-HR-CON-DEP-01-2026 | Pass |
| Selection List ... CMRL-HR-CON-02-2025 AM (HR) | Result | CMRL-HR-CON-02-2025 | Pass |
| Detailed Employment Notification CMRL-HR-CON-02-2026 JGM (Signal) & others dep/con | New Job | CMRL-HR-CON-02-2026 | Pass |
| Employment Notification CMRL-HR-CON-01-2026 CGM/GM (UG/EC) | New Job | CMRL-HR-CON-01-2026 | Pass |
| CMAML COO on contract, CMAML-HR-CON-01-2025 | New Job | CMAML-HR-CON-01-2025 | Pass |
| Cancellation of AM (GC) post, CMRL-HR-CON-DEP-06-2024 | Update | CMRL-HR-CON-DEP-06-2024 | Pass |
| Employment Notification CMRL-HR-DEP-07-2024 GM (Tracks) on deputation basis | New Job | CMRL-HR-DEP-07-2024 | Hold (deputation only) |
| Intimation of Interview date, PGMRTM course IIT Madras | Update | CMRL-HR-CON-10-2024 | Pass if current |

## Proposed config
None. Current entry is correct:
```json
{ "id": "cmrl", "url": "https://chennaimetrorail.org/job-notifications/", "type": "html", "rowSelector": ".job-card", "rowTitle": "h6", "rowLink": "a.btn-apply-now-border", "exclude": "compassionate|qualified|roll no|unique id", "limit": 40 }
```

## Uncertain points
- Only one site page was checked; the homepage menu was not exhaustively crawled (no other recruitment page links found in the job page HTML).
- Whether BatLee wants senior single-post contract notices passed (currently Pass).

## BatLee's corrections
- none yet

## Repairs
- none
