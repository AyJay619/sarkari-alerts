# GAIL
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## BATCH SUMMARY BLOCK
SITE: GAIL | VERDICT: OK
PROPOSED: none
MISSING TODAY: results / admit cards / shortlists (no such page found on gailonline.com; only Vacancies.html is catchable). Some "jobs" caught are small medical consultant walk-ins (hold).
ASK BATLEE: none

## Pages watched
| Page | URL | Fetch method | Verdict |
| Vacancies (current openings, newest first, whole archive ~200 cards) | https://www.gailonline.com/Vacancies.html | free fetch via scanner fromScript, rowSelector .vacancy-card | FREE-OK |

- http://www. gives no answer (connection fails); https://gailonline.com (no www) redirects (307) to www. Keep https + www.
- Plain curl is blocked by the WAF (406); the scanner's own fetch works. 4 repeats: 20 items each time, 0.2-1 s. Stable.
- Homepage (https://www.gailonline.com/) has only portal links; no notices/results list. Guessed pages (Careers, Results, Notices, Recruitment .html) return 404. Menu is JS-built, so I could not find a results page. Not claimed as checked beyond that.
- Items are newest first; limit 20 covers about 8 months. Flood check: links are static PDF/JPG URLs, no dates or tokens in query. No flood risk.

## Label pattern
Title only, no type prefix, no date. Parent = the title itself.
- "Career opportunities as Executive Trainee through GATE-2027" = New Job (Exec Trainee, GATE 2027)
- "Selection for the post of Director (X), GAIL (India) Limited" = New Job (Board level)
- "Engagement of medical consultants ..." / "Requirement of ... Medical Officer on temporary tenure" = contract medical: HOLD
- Advert date is often in the filename (e.g. _030326 = 03-03-26, 09-09-2026).
Site only carries advertisements; corrigenda/results are not listed here.

## Hold rules (site-specific)
- "Engagement of medical consultants / medical officers / SDMO / GDMO / part-time visiting consultant / walk-in" = small contract roles, HOLD.
- "retired ... officials", "competent authority (temporary tenure)" = retired-only, HOLD.
- Pass: GATE Executive Trainee, Director selections (Marketing/Projects/Finance), Special Recruitment Drive (SRD), legal discipline and other regular posts.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
| Engagement of Medical Consultant - Part-time Visiting (MD Medicine) walk-in | New Job | GAIL medical consultant Sep 2026 | HOLD |
| Career Opportunities as Executive Trainee through GATE-2027 | New Job | GAIL ET GATE 2027 | PASS |
| Engagement of Authorised Medical Attendant - part-time visiting | New Job | GAIL AMA Aug 2026 | HOLD |
| Engagement of Medical Consultants - Part Time Visiting (Pediatrician) | New Job | GAIL pediatrician Aug 2026 | HOLD |
| Selection for the post of Director (Marketing) | New Job | GAIL Director (Marketing) | PASS |
| Engagement of Medical Consultants - Full Time SDMO (jpg notice) | New Job | GAIL SDMO Apr 2026 | HOLD |
| Engagement of Medical Consultants - Full Time SDMO (detailed pdf) | New Job | GAIL SDMO Apr 2026 | HOLD |
| Engagement of a retired Jharkhand Govt Revenue Officials (SDM) | New Job | GAIL Competent Authority Ranchi | HOLD |
| Full Time Shift Duty Factory Medical Officer (AFIH) | New Job | GAIL FMO Mar 2026 | HOLD |
| Engagement of Medical Officers at GAIL, Usar | New Job | GAIL MO Usar 2026 | HOLD |
| Selection for the post of Director (Projects) | New Job | GAIL Director (Projects) | PASS |
| Career Opportunities as Executive Trainee through GATE-2026 | New Job | GAIL ET GATE 2026 | PASS |
| Special Recruitment Drive (SRD) SC/ST/OBC/PwBD | New Job | GAIL SRD | PASS |
| Selection for the post of Director (Finance) | New Job | GAIL Director (Finance) | PASS |
| Career Opportunities in Legal Discipline | New Job | GAIL Legal (CGM Law) | PASS |

## Proposed config (unchanged)
```json
{"id":"gail","name":"GAIL","runner":"india","tier":"FREE","level":"central","type":"html","url":"https://www.gailonline.com/Vacancies.html","fromScript":true,"rowSelector":".vacancy-card","rowTitle":"h3","rowLink":"a[href]","limit":20}
```

## Uncertain
- No results / admit card / answer key page found; GAIL ET results come via GATE and may be posted elsewhere (not found, not verified).
- Menu is JS-built; a hidden careers page may exist under another URL.

## BatLee's corrections
- none

## Repairs
- none
