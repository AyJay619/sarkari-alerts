# RCF HR Recruitment (Rashtriya Chemicals and Fertilizers)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (works as it is)

## BATCH SUMMARY BLOCK
SITE: RCF HR Recruitment (rcfltd.com) | VERDICT: OK
PROPOSED: none (optional: nothing in config can read the inline text notices, see MISSING)
MISSING TODAY: corrigenda (e.g. AO Secretarial last date extended to 06.10.2026) and "provisionally shortlisted for medical check-up" lists are inline page text with no PDF, so the scanner never sees them; the two ad PDFs seen on 29-Sep (Dir Mktg, Direct Recruitment 2026) were later removed from the page
ASK BATLEE: none (recommend: new jobs are caught via their ad PDF and the IBPS source already catches the ibpsreg apply links; accept that inline corrigenda are missed, or check this page by eye once a week)

## Pages watched
| Page | URL | Fetch method | Verdict |
| Recruitment (the only HR notice page) | https://www.rcfltd.com/hrrecruitment/recruitment-1 | free fetchItems, 15 s default | FREE-OK (5 items, 250-1700 ms, 3 runs identical) |
http:// returns 302 (to https), no-www returns 200. Menu: HR > Recruitment is the only recruitment page; Tender/RTI/Investor pages are not job pages. Candidate portal is on ibpsreg.ibps.in (not RCF). ScrapFly not needed. PDFs under /files/ download free (tested one: HTTP 200, 378 KB).

## Structure and posting speed
One long page, newest block on top, no dates in the markup. Blocks are plain text: corrigenda, shortlist tables (application numbers only), then per-advertisement tables (Apply Online link to ibpsreg.ibps.in/rcf..., "Download Advertisement" PDF, annexures). Only /files/ PDF links are real links. Roughly 1-3 new blocks a month. Links are static file names (/files/<name>.pdf), no session parts, no flood risk. Revised ads appear as "Rev(1)", "Rev(2)" with new file names (these re-fire as new items: fine, the sorter merges).

## What the scanner catches today
Config: include "/files/", titleFromHref, exclude annexure/certificate/form/undertaking etc., minTitle 6, limit 40. Today it returns 5: Secretarial advertisement 03 09 2026, MT 2026(1), Syllabus for Operator Trainee (Chem), Final Detailed Advertisement Operator 10 04 2026 Rev(2) and Rev(1). Exclude filter correctly drops annexures, appendices, TA/Bank form, self-declaration, the ilovepdf Zero Tolerance PDF. The .mp4/.mpg awareness videos are not under /files/, so they are not caught (good).
Misses: inline corrigenda, shortlist/medical-check-up notices (no link). Titles are file names, so "Click Here" problem is handled.

## Label pattern
Titles come from the file name (free text): "<Post> advertisement <date>", "MT 2026", "Final Detailed Advertisement <Post> <dd mm yyyy> Rev(n)", "Syllabus for <Post>". Parent: the post and advertisement number printed inside the PDF/page (Advt No. is 8 digits ddmmyyyy-style, e.g. 01072026 = AO Secretarial, 16022026 = Management Trainee, 17022026 = Operator (Chemical) Trainee 188 posts, 18032026 = Asst Engineer (Electrical)/Officer (Medical)). Parent format: "RCF <post> Advt <no>". File names alone often lack the Advt number: open the PDF.

## Hold / pass rules (sorter)
Pass: advertisements (AO Secretarial, Management Trainee, Operator Trainee, Directors if posted), Rev(n) revised ads, syllabus (part of a live job), corrigenda, date extensions.
Hold: annexures, certificate formats, undertakings, TA/bank forms, self-declaration forms, "Zero Tolerance Policy" PDF, awareness videos, Director (Marketing) type board-level posts only if on deputation/PSU-selection-by-PESB (judge from the PDF), shortlist-for-medical lists are post-selection: pass only if BatLee wants them (recommend hold, they are just application numbers).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
| Secretarial advertisement 03 09 2026 | New Job | RCF Assistant Officer (Secretarial) E0, Advt 01072026 | Pass |
| MT 2026(1) | New Job | RCF Management Trainee, Advt 16022026 | Pass |
| Final Detailed Advertisement Operator 10 04 2026 Rev(2) | New Job (revised) | RCF Operator (Chemical) Trainee, Advt 17022026 | Pass |
| Final Detailed Advertisement Operator 10 04 2026 Rev(1) | New Job (revised) | same | Pass (duplicate) |
| Syllabus for Operator Trainee (Chem) | Update | Operator (Chemical) Trainee, Advt 17022026 | Pass |
| (inline) Corrigendum: last date extended to 06.10.2026 | Update | AO Secretarial, Advt 01072026 | Pass, NOT caught |
| (inline) Corrigendum: cut-off date revised, last date 10.09.2026 | Update | MT, Advt 16022026 | Pass, NOT caught |
| (inline) Provisionally shortlisted for medical check-up (AE Electrical, Officer Medical, MT Electrical, Operator Trainee) | Result | Advt 18032026 / 05022025 / 04022025-R | Hold (recommended) |
| (inline) Corrigendum on Caste Validity Certificate self-declaration | Update | Operator Trainee Advt 17022026 | Pass, NOT caught |
| Annexure I-VI, Appendix I-II, TA & Bank Details Form, ilovepdf_merged | Noise | n/a | Hold (already excluded) |

## Proposed config
No change. Current entry in sources.json (id "rcf") stays as it is:
```json
{"id":"rcf","url":"https://www.rcfltd.com/hrrecruitment/recruitment-1","type":"html","include":"/files/","titleFromHref":true,"minTitle":6,"limit":40}
```

## Uncertain
- Inline corrigenda/shortlists could only be seen by a page-change detector, which the scanner config does not offer for plain text; not proposed.
- The "Rev(1)/Rev(2)" PDFs and the later-removed ads show the page is edited by hand; a removed item will never re-alert (seen check), fine.

## BatLee's corrections
- none yet

## Repairs
- none
