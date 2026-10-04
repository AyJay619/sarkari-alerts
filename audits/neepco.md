## BATCH SUMMARY BLOCK
SITE: NEEPCO Careers | VERDICT: FIX
PROPOSED: 1) add clickText:"English" (page opens in Hindi in the headless browser; today only the 4 Hindi ads are caught, English titles/ads never are)
PROPOSED: 2) drop the exclude (it kills every shortlist / result / "list of" notice, which the standing rules say PASS); the include already removes the policy PDF; add minTitle:8 so the bare "Corrigendum" link is kept
PROPOSED: 3) add timeoutMs:25000 (default 45 s made the one failed scan wait too long; page renders in 3-5 s, 10/10 test runs OK); source URL unchanged
MISSING TODAY: all English ads, all results/shortlists (excluded by regex), corrigenda (minTitle 12); Hindi ads only are caught
ASK BATLEE: titles change (Hindi -> English, no exclude) with unchanged URL, so expect a one-time flood of about 16 items unless re-baselined; recommend re-baseline (clear neepco's seen entry) on first run

# NEEPCO Careers
Audited: 2026-10-04 (batch) | Group: FREE (render) | Status: ACTIVE (change proposed)

## Pages watched
| Page | URL | Fetch method | Verdict |
| Career (openings + archive, one page) | https://neepco.co.in/career | headless browser render (React app, raw HTML is an empty shell of 1.9 KB; www / http variants return the same shell) | FREE-OK with render. 10 runs: 3-5 s each, 0 failures |
| Raw fetch without render | same | free fetch | FAILS ("no notices found"): links come from JS |

Hidden JSON the page calls: https://neepco.co.in/neepco/api/v1/careers (English, 112 items back to 2024, newest first by "created", 0.3-0.6 s, free) and /neepco/hi/api/v1/careers (Hindi). It would be the cleanest source, but the PDF path sits in a field_download HTML string made of <span> tags (no <a href>), so the scanner's json type (linkField / linkHtmlField) cannot read it without a code change. Not proposed; the render source is enough. ScrapFly: not needed. PDFs download free (same host, static files).

## What the scanner catches / misses
The page has only about 16 PDF links: 3-4 "current" rows plus a short archive of recent results. The older 112-item history is in the API only (not needed).
Today (Hindi page, with the exclude): 4 items only, all Hindi (biodata form + 3 Hindi ads). The English ads, results, shortlists and the corrigendum are not caught. After the proposal: 16 items, tested 5 times in a row.

## Posting speed / link stability
Roughly 2-6 postings a month (ads about every 1-2 months, shortlists / results in between). Links are static file URLs under /neepco/sites/default/files/YYYY-MM/. Flood risk: only the one-off title change (see ASK). One failed scan seen earlier (45 s goto timeout); could not be reproduced in 10 runs, so it looks like a one-off slow response. The scanner already retries failed sites once at the end of the group.

## Label pattern
Table "Latest Vacancies": row title = long description, then link text. Link texts: "Advertisement No. NEEPCO/03/2026 Date: 11.08.2026" (ads, carries the advt number), "List of selected candidates against Advertisement No : NEEPCO/09/2025, Date: 28-10-2025" (results, carries the parent), "List of Shortlisted Candidates for Personal Interview" (shortlists, parent NOT in link text, only in the filename e.g. advt02.26 or in the row heading), "Corrigendum" (bare; parent in filename corrigendum_advt_02_2026_230626.pdf), "Click here to Apply Now" (link to recruitment.neepco-spark.co.in, not a PDF, not caught, fine).
Parent rule: "Advt NEEPCO/NN/YYYY" taken from the title or filename (advt_01_2026, advt_02_2026, advt_09_2025 ...). Ad numbers are written in many forms: NEEPCO/03/2026, NEEPCO-02/2026, NEEPCO - 08/2025, Advt.No.122/2024 (CMD post, ignore).

## Hold / pass rules for the sorter
- PASS: ads (Advertisement No. ...), results "List of selected candidates ...", shortlists for personal interview / written test, corrigenda, documents required at interview.
- HOLD: "NEEPCO EQUAL OPPORTUNITY POLICY", "Biodata Form" (format only), Hindi twins (titles starting "विज्ञापन संख्या", "शुद्धिपत्र" when the English one exists), CMD / board-level posts (Advt.No.122/2024), any deputation notice.
- NEEPCO ads are often Fixed Term Basis (FTB) executive posts and Executive Trainee (via GATE) - these are normal jobs, PASS.

## Sample links (audit day, English page)
| Title | Type | Parent | Pass/Hold |
| List of Shortlisted Candidates for Personal Interview ... Executives (Finance), FTB-2 | Result (shortlist) | Advt 02/2026 | PASS |
| List of shortlisted candidates for Offline Personal Interview for Executive Trainee (Civil), E2 | Result (shortlist) | ET Civil E2 (Advt 09/2025 line) | PASS |
| List of Shortlisted Candidates for Personal Interview ... Executives on Fixed Term Basis | Result (shortlist) | Advt 02/2026 | PASS |
| Advertisement. No: NEEPCO/03/2026 Date: 11.08.2026 | New Job | Advt 03/2026 (JE) | PASS |
| List of selected candidates JE (Civil)/(Electrical) S-1, Tato Shi-Yomi | Result | Advt 03/2026 JE (Tato Shi-Yomi) | PASS |
| List of selected candidates against Advt NEEPCO/09/2025 (reoffers) | Result | Advt 09/2025 | PASS |
| Corrigendum (file corrigendum_advt_02_2026_230626) | Update | Advt 02/2026 | PASS |
| Advertisement No. NEEPCO-02/2026 Date 23-06-2026 | New Job | Advt 02/2026 (FTB) | PASS |
| List of Selected candidate against Advt NEEPCO/05/2025 (Law) | Result | Advt 05/2025 | PASS |
| List of Selected candidates against Advt NEEPCO/06/2025 | Result | Advt 06/2025 | PASS |
| Advertisement No : NEEPCO/01/2026 Date 14-05-2026 | New Job | Advt 01/2026 | PASS |
| List of selected candidates against Advt NEEPCO/ 09/2025 (Electrical/Mechanical/Civil) | Result | Advt 09/2025 | PASS |
| Biodata Form | Noise | none | HOLD |
| NEEPCO EQUAL OPPORTUNITY POLICY | Noise | none | HOLD (already removed by include) |
| विज्ञापन संख्या: नीपको/03/2026 (Hindi page) | Hindi duplicate | Advt 03/2026 | HOLD |

## Proposed config (sources.json, source "neepco")
```json
{
  "id": "neepco", "name": "NEEPCO Careers", "runner": "india", "tier": "FREE", "level": "central",
  "type": "html", "url": "https://neepco.co.in/career",
  "render": true, "clickText": "English", "waitFor": "a[href*='.pdf']",
  "include": "sites/default/files/20",
  "minTitle": 8, "timeoutMs": 25000, "limit": 40
}
```
(exclude removed; include kept so the policy PDF under /2024-07 is... note: it matches "files/20" too, so the Equal Opportunity Policy PDF IS caught once; it is old and gets seen once, sorter holds it. Keep include as is, or set include to "sites/default/files/202[56]" to drop it.)

## Uncertain
- The page's default language is Hindi for the headless browser (likely site setting); the English click depends on the "English" menu text staying. If it ever fails the Hindi page is still caught (fallback is harmless).
- Shortlists show no parent in link text; the sorter should read the PDF filename (advt02.26) or open the PDF.
- clickText adds about 2.5 s per scan; total about 5 s per scan, no credits (FREE).

## BatLee's corrections
- none yet

## Repairs
- none yet
