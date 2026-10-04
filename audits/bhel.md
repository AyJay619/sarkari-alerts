## BATCH SUMMARY BLOCK
SITE: BHEL Careers | VERDICT: FIX
PROPOSED: 1) add titleFromHref:true (link texts are "Advertisement", "(English version )", "Click here to apply"; file names carry the real info)
PROPOSED: 2) widen include to "[.]pdf|ednnet|bplcareers|careers1" so ads on BHEL's external recruitment sites are caught
PROPOSED: 3) raise limit 25 -> 40 (page has ~40 PDF links; the top 25 already include certificate formats, so real items near the bottom of the page could fall off)
MISSING TODAY: FTA HSE TBG (bplcareers.bhel.com), Project Engineers EDN Bengaluru (ednnet.bhel.in), Consultants HPEP Hyderabad (careers1.bhel.in) are non-PDF links, not caught; Hindi ads and newspaper ads are skipped
ASK BATLEE: Source URL unchanged, but titles change with titleFromHref, so confirm the scanner re-baselines (no flood of 25-40 old items); recommend yes

# BHEL Careers
Audited: 2026-10-04 (batch) | Group: FREE | Status: ACTIVE (change proposed)

## Pages watched
| Page | URL | Fetch method | Verdict |
| Careers home (openings, news, formats, archives all on one page) | https://careers.bhel.in/index.jsp | free fetch, https, no www | FREE-OK. 5 runs: 39 items, 0.13-0.9 s, stable |
| Same page without file name | https://careers.bhel.in/ | free fetch | FAILS ("no notices found"); keep index.jsp |

No second page needed: the single page holds Artisan recruitment (results, cut-offs, addenda), FTA/part-time ads, consultants, formats and archives. ScrapFly: not needed. PDFs download free (same host).

## What the scanner catches / misses
Catches all `.pdf` links (about 39). Misses non-PDF links to external recruitment sites (careers1.bhel.in, bplcareers.bhel.com, ednnet.bhel.in). Titles are mostly useless as they stand ("Advertisement", "(English version )", "Click here to apply") so Telegram/catch items are unreadable; with titleFromHref the titles become e.g. "Corrigenda PTMC IVP 01092026", "PTMC Advt. English PSSR 092026". The page text does carry a bold heading before each link (e.g. "Engagement of Part-Time Medical Consultant (PTMC)- BHEL, IVP Goindwal") but the markup is flat (img, b, a, br), so contextClosest cannot reach it; the sorter should open the PDF.

## Posting speed / link stability
Page is edited by hand, changes sporadically (a few postings per month). Links are stable static file URLs (static/, ar_2025/, archives/). No flood risk seen. Commented-out HTML blocks on the page (old Artisan updates) are ignored by the parser.

## Label pattern
Page heading "Recruitment of FTA/ Part-Time positions" lists "<post> at <place> : (Advertisement) / (Corrigenda - due date ...)". File names: PTMC_Advt_<unit>_<MON>_<year>.pdf, Corrigenda_<post>_<ddmmyyyy>.pdf, ar_2025/ = Artisan Recruitment 2025 (Skill Test Result, Cut Off, Addendum). Parent = the bold post/place heading on the page (not in the link text), or the file-name stem.

## Hold / pass rules (for the sorter)
HOLD: Part-Time Medical Consultant (PTMC) and Assistant Technical Consultant walk-ins (consultant/contract), "Engagement of Consultants" (HPEP etc.), FTA HSE / fixed-tenure project engineers unless BatLee wants FTA posts (flag as consultant/contract), deputation/lateral/"Experienced professionals", all Hindi duplicates, certificate formats and proformas (EWS, OBC, SC/ST, physical limitation, scribe declaration, biodata, experience certificate), syllabus, exam pattern, FAQs, medical examination rules, compassionate consideration, shortlisting methodology, everything under archives/ (old ET/ST 2019-2025 cut-offs and ads), static public-caution notices.
PASS: Artisan / Engineer Trainee / Supervisor Trainee regular recruitment ads and their addenda/corrigenda, admit cards, results, cut-offs and skill-test/document-verification results of the current cycle.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
| BHEL Artisan - Skill Test Result Declaration | Result | Artisan Recruitment 2025 | Pass |
| Cut-Off Marks for shortlisting to DV cum Skill Test | Result | Artisan Recruitment 2025 | Pass |
| BHEL Shortlisting Methodology | Update/Noise | Artisan 2025 | Hold |
| Detailed Advertisement (Artisan_Detailed AD_110825) | New Job | Artisan 2025 | Pass (already posted) |
| BHEL Artisans Addendum | Update | Artisan 2025 | Pass |
| Detailed Vacancy breakup | Update | Artisan 2025 | Pass (info; low priority) |
| BHEL Exam Pattern / Artisan Syllabus | Noise | Artisan 2025 | Hold |
| Medical Examination Rules / Compassionate Consideration / FAQs | Noise | Artisan 2025 | Hold |
| PTMC Advt English PSSR Chennai 092026 | New Job (consultant) | PTMC PSSR Chennai | Hold |
| Advertisement PTMC IVP Goindwal + Corrigenda (due 12.09.2026) | New Job/Update (consultant) | PTMC IVP | Hold |
| PTMC Advt Corp Aug 2026 (walk-in 19.08.2026) | New Job (consultant) | PTMC Delhi/Noida | Hold |
| Assistant Technical Consultant, Jhansi | New Job (consultant) | ATC Jhansi | Hold |
| Biodata/EWS/OBC/SCST/scribe forms (Eng/Hindi) | Noise | - | Hold |
| ET & ST 2025 Detailed Advertisement (archives) | Noise | archive | Hold |
| ET 2025 Final Cut-Off (archives) | Noise | archive | Hold |

## Proposed config (sources.json entry)
```json
{
  "id": "bhel", "name": "BHEL Careers", "runner": "india", "tier": "FREE", "level": "central",
  "type": "html", "url": "https://careers.bhel.in/index.jsp",
  "include": "[.]pdf|ednnet|bplcareers|careers1",
  "titleFromHref": true,
  "limit": 40
}
```

## Uncertain
- titleFromHref on the three external non-PDF links gives poor titles ("career", empty, "et eng index"); they would still alert, sorter must open them. If it looks too noisy, drop item 2.
- Whether changing titleFromHref triggers an automatic re-baseline: the README says URL/selector changes do; not confirmed for this option. Check the first scan for a flood.
- Page currently has no live regular job (Artisan cycle is in result stage); BHEL regular ET/ST ads usually appear in this same page, so it is a low-volume source.

## BatLee's corrections
- none yet

## Repairs
- none
