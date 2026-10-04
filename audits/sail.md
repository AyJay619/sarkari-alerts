# SAIL (sailcareers.com)

## BATCH SUMMARY BLOCK
SITE: SAIL | VERDICT: FIX
PROPOSED: 1) limit 15 -> 30 (4 plant-menu links eat the limit; 27 links on page today). 2) exclude "PlantName=" (plant menu links, not notices). Rest unchanged.
MISSING TODAY: nothing real is missed now; 12 of today's 27 links sit beyond limit 15 (old, but a burst of 6+ postings would push new ones out). "CUT OFF Marks" (short title) is skipped by minTitle, harmless.
ASK BATLEE: none (the exclude is a structural menu filter, not a keyword filter; recommend yes).

Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (nothing applied)

## Pages watched
| Page | URL | Fetch method | Verdict |
| Home (news + jobs lists, plus apply links) | https://sailcareers.com/ | free, fetchItems | FREE-OK. 4/4 runs identical, HTTP 200, ~43 KB. http and www both redirect to https://sailcareers.com/ (fine). |
| Archive (older) | https://sailcareers.com/Archive.aspx?Section=News (same 227 PDFs for Jobs) | free | Old items only (back to Aug 2026 and earlier); not needed. |
| Plant pages | Default.aspx?PlantName=XXX | free | Per-plant filtered view of same PDFs; duplicates, not needed. |

No ScrapFly needed. PDFs on aima-web-images S3 are public (free download expected; not downloaded in this audit).

## What the scanner catches vs misses
Home page has a "News" and a "Jobs" box (same latest PDFs, ~20) plus a red apply-link block at top. Scanner reads all anchors in page order. Today 27 links with limit 200; limit 15 stops at the "Dresser Cum Compounder" item (4 plant-menu links + 11 real). Commented-out MTT call letter links in the HTML are not live, correctly ignored.

Posting speed: about 14 PDFs between 08 Sep and 01 Oct (under 1 per day, bursts of 2-5 on some days e.g. 24 Sep had 5). Limit 30 gives plenty of headroom.
Link stability: S3 PDF links are stable (timestamped filenames); seen-state for sail already has 15 entries and no flood seen. The plant-menu links are constant and permanent in seen.

## Label pattern
No type prefix. Free text, plant prefix sometimes: "RSP: ...", "Bokaro Steel Plant: ...", "Rourkela Steel Plant: ...". PDF filename carries unit and date: `<UNIT>_News & Jobs_<DDMMYYYY>_<time>.pdf` (units: RSP, BSP=Bokaro, BHILAI, IISCO, DSP, SAIL-CFP, CR=central recruitment, MTR). Advt number is in the title ("Advt. No. ISP/YP/2026/01", "BSL/R-C/2026-08"). PARENT = advertisement number if present, else the post/programme named. Type words: "Result of", "List of ... selected", "Interview Schedule", "Notice for Shortlisting", "Cut off marks", "Advertisement for", "Application window / Apply online".

## Hold / pass rules for the sorter
HOLD: Young Professionals (YP) and consultant/advisor engagements (ISP/RSP/BSL YP, CMO/EMD YP, CMLO YP), sports coach consultants, walk-in medical/consultant posts (audiologist, specialist/GDMO contract doctors) unless BatLee wants contract doctors; plant menu links (Durgapur Steel Plant etc.); GNM prospectus/admission lists (nursing school admissions, not jobs); training programmes on stipend (IGH trainees, Dresser cum Compounder proficiency training); Bio Data form page; "CUT OFF marks" lists only if a pure info note (MTT cut-offs: pass as part of result, recommend pass).
PASS: Management Trainee (MTT) apply/score card/interview schedule/cut-off, Trade Apprentices advertisement (Bhilai), any regular or non-executive post advertisement, results/selected lists for regular posts, interview call letters.
Note: YP and consultants are hold under the standing rules, so most of the current page is hold; real passes today are MTT items and the Bhilai Trade Apprentices ad.

## Sample links (audit day 2026-10-04)
| Title | Type | Parent | Pass/Hold |
| Application window to apply for YP at RSP/MTI Ranchi, Advt RSP/R-YP/2026-01 | New Job | RSP/R-YP/2026-01 | Hold (young professionals) |
| Application window to apply for YP at Bokaro, Advt BSL/R-YP/2026-01 | New Job | BSL/R-YP/2026-01 | Hold |
| Application window to apply for YP at ISP/DSP/ASP, Advt ISP/YP/2026/01 | New Job | ISP/YP/2026/01 | Hold |
| Application window to apply for MTT, Advt HR/REC/C-97/MTT/2025 | New Job | MTT 2025 (HR/REC/C-97) | Pass |
| Bio Data Form ... GD/Interview shortlisted MTT | Update | MTT 2025 | Pass (current-cycle interview docs) |
| SCORE CARD for MTT-2026 (ibpsreg.ibps.in login) | Result | MTT 2025 | Pass |
| Raw Materials Division / Durgapur / Rourkela / SAIL-CFP | Noise | none | Hold (menu, propose exclude) |
| RSP: Engagement of YP at CMLO, Advt CMLO/YP/2026-04 | New Job | CMLO/YP/2026-04 | Hold |
| Result of personal interview, YP, Advt ISP/YP/2026/01 | Result | ISP/YP/2026/01 | Hold |
| Apply online for Engagement of YP at CMO and EMD | New Job | SAIL2026YPCMO | Hold |
| Advertisement for engagement of Trade Apprentices at Bhilai FY 2026-27 | New Job | Bhilai TA 2026-27 | Pass |
| Proficiency Training of Dresser cum Compounder, CFP | Noise | CFP training | Hold |
| Bokaro: Result of walk-in interview, Audiologist, Advt BSL/R-C/2026-08 | Result | BSL/R-C/2026-08 | Hold (single contract post), recommend hold |
| List of provisionally selected, GNM programme, Bokaro School of Nursing | Result | GNM admission | Hold (admission) |
| RSP: Interview schedule, trainees at IGH on stipend, Advt HR-T&M/2498 | Update | HR-T&M/2498 | Hold (training) |
| List of candidates selected, Specialist & GDMO, ISP/RECTT/CONT_DOC/2026/307 | Result | ISP/.../307 | Hold (contract doctors) |
| MT & Central Recruitment: Cut off marks for percentile | Result | MT 2026 | Pass |
| RSP: Result of walk in interview, consultants (sports coach), Advt 03/2026 | Result | RSP 03/2026 | Hold |
| Detailed advertisement, Advisors/Consultants 2026-27, IISCO | New Job | IISCO consultants | Hold |
| Cut-Off Marks for Management Trainees (Technical) | Result | MT (Technical) | Pass |
| Download Interview Call Letter, Advt ISP/YP/2026/01 | Update | ISP/YP/2026/01 | Hold (YP) |

## Proposed full config
```json
{
  "id": "sail", "name": "SAIL", "runner": "india", "tier": "FREE", "level": "central",
  "type": "html", "url": "https://sailcareers.com/",
  "exclude": "PlantName=", "minTitle": 20, "limit": 30
}
```
Changing limit/exclude does not change URL or selectors; check whether the scanner re-baselines. If it does not, the 12 older links beyond old limit 15 could be reported once as new on the first run (recommend rebaseline for that run).

## Uncertain points
- Whether contract doctor/walk-in medical results should be held (treated as hold here; BatLee can overrule).
- PDF download not tested (not permitted by the batch rules to keep things minimal).
- exclude on "PlantName=" assumes exclude matches title+link (per README); not run-tested with the proposed config.

## BatLee's corrections
- none yet

## Repairs
- none
