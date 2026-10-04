# REC Limited (REC Careers, recindia.nic.in)
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (sources.json NOT changed)

## BATCH SUMMARY BLOCK
```
SITE: REC Careers | VERDICT: BROKEN (fetch works, but it reads a stale Hindi copy; config alone cannot fix it)
PROPOSED: 1) needs a small scanner code change (outside batch scope): before fetching, request https://recindia.nic.in/ajax.php?lang=en in the same cookie session, then fetch /careers and /archive-opportunities with that session cookie; source stays FREE, no config-only fix exists. 2) after that: add /archive-opportunities as extra source, keep include "uploads/files", drop the Hindi-only exclude words.
MISSING TODAY: everything real: scanner sees the Hindi page (last edit Jan 2025: CTO ad + format links); the English page lists 2026 openings (Advisor Green Hydrogen, RECPDCL fixed tenure, ED on deputation, backlog status) and none of it is in the seen record.
ASK BATLEE: (a) allow the small code change (cookie session + language call, about 15 lines, REC only)? Recommend yes; otherwise drop REC (about 3-6 postings a year, mostly consultant/deputation/RECPDCL fixed-tenure that the sorter would hold). (b) if not, leave as is: it is silent, harmless, but useless.
```

## What was tested
Scanner's own `fetchItems(src)` (free fetch with the extraCerts file, 0 credits, no ScrapFly) run 3 times: 875 ms, 134 ms, 127 ms, always the same 3 items, 0 differences, no flood risk. https://recindia.nic.in/careers loads (HTTP 200); the extraCerts chain is still needed by Node (curl works without, not checked as a fault). `www.` variant of /careers also loads. http variant not needed.

### Pages watched and tested
| Page | URL | Method | Verdict |
|---|---|---|---|
| Careers (current openings table + backlog / certificate-format links) | https://recindia.nic.in/careers | free fetch (extraCerts) | loads, but the scanner gets the HINDI copy, which is stale |
| Careers archive (old openings, shortlists, results, deputation ads) | https://recindia.nic.in/archive-opportunities (www version answers 301) | free fetch (curl) | loads; Hindi copy is old, English copy has 2024-2025 shortlists and results |
| Home / What's new | https://recindia.nic.in/ , /whats-new | free fetch | only press releases (RECPDCL SPV hand-overs, sports day); no recruitment items |
| RECPDCL careers (subsidiary) | https://recpdcl.in/career | free fetch | loads but no PDF notice links found; not tested further (probably a separate site, ask) |

## THE KEY FINDING: language is a server session setting
- The site chooses Hindi or English per session (PHPSESSID). A new visitor (and the scanner) gets Hindi. Switching is `GET ajax.php?lang=en` (answers "success") with the same cookie, then reload.
- The Hindi /careers page has not been updated since January 2025: only "Chief Technology Officer advertisement" plus format links. The seen record holds exactly those 3 old items.
- The English /careers page (same URL, after the language call) carries the real, current list (see samples) with last dates. So the scanner is blind to every REC posting.
- Tried without success: `?lang=en`, `?language=en`, Accept-Language header, a hand-made `Cookie: lang=en`, a made-up PHPSESSID (server ignores unknown ids and makes its own). A fixed hard-coded cookie therefore cannot work; a live session handshake is needed.
- `render` + `clickText: "English"` would not help: the English button first shows a JavaScript confirm() box (Hindi text) that the browser dismisses by default, so the language never changes.
- Conclusion: config-only options cannot read the English page. A scanner change is needed (cookie jar + one extra GET to ajax.php?lang=en before the fetch). Not done here (batch rules: no code changes).

## Posting speed and stability
Few postings: English list shows roughly 5 openings between May and July 2026 (about 1 to 3 a month at most), almost all consultant / deputation / RECPDCL fixed-tenure. Real regular recruitment is rare (last big ones: Director (Finance) May 2025, Director (Projects) Dec 2024, CTO Jan 2025). Link flood risk once English is read: low (about 10 current rows, about 40 archive rows, filenames stable). After the language change the source URL/selectors do not change but the content does: first run would see all current rows as new (small, about 10), acceptable or rebaseline.

## Label pattern
Titles on the English page are plain sentences, no code: "Inviting applications for ... <post> ... on contractual basis in REC Limited", "HIRING OF EXPERIENCED PROFESSIONALS ON FIXED TERM BASIS - RECPDCL", "Inviting applications for the post of Executive Director (ED) in REC Limited on deputation". Parent = post name + organisation (REC Limited or RECPDCL) + month, e.g. "Advisor (Green Hydrogen), REC Ltd, Jul 2026". Date appears as a last date (dd.mm.yyyy) in the right column, not a posting date. In the archive, link `title` attributes are clean ("List of selected candidates", "Cancellation Notice"), and filenames carry a ddmmyy date (co-hr-...-dt-190925.pdf = 19-09-2025). Updates to a job (extension of timeline, shortlist, result, cancellation) appear as separate links in the same block; the parent comes from the nearest heading or the filename.

## Hold / pass rules for the sorter
HOLD:
- posts on deputation (ED, Directors by deputation, IAS officers), "Expression of Interest" for part-time doctors/dieticians, Advisor / Senior Consultant / Consultant "on contractual basis" (consultant rule)
- RECPDCL "experienced professionals on fixed term basis" (fixed-tenure experienced hires): hold unless BatLee wants them (not a regular govt job; recommendation: hold)
- Backlog vacancy status, caste / EWS / PWD certificate formats, list of empanelled hospitals, Independent External Monitor image, corporate AGM notices (noise)
- Hindi copies of an English notice
PASS:
- regular recruitment ads (Director posts via PSU selection, Chief Technology Officer, etc.), shortlist / selected-candidate lists and interview results of those, cancellation notices, timeline extensions of a passed job

## Sample links (English page, fetched with a session cookie on audit day; scanner currently sees none of these)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Inviting applications for one expert each for Advisor (Green Hydrogen) and Advisor (CBG) on contractual basis in REC Limited (last date 15.08.2026) | New Job | Advisor (GH) / Advisor (CBG), REC Ltd, Jul 2026 | HOLD (consultant) |
| HIRING OF EXPERIENCED PROFESSIONALS ON FIXED TERM BASIS - RECPDCL (21.07.2026) | New Job | RECPDCL fixed tenure, Jul 2026 | HOLD (fixed tenure, recommend) |
| Inviting applications for Advisor (HR) on contractual basis (21.07.2026) | New Job | Advisor (HR), REC Ltd | HOLD |
| HIRING OF EXPERIENCED PROFESSIONALS ON FIXED TERM BASIS - RECPDCL (06.06.2026) | New Job | RECPDCL fixed tenure, May 2026 | HOLD |
| Inviting applications for the post of Executive Director in REC Limited on deputation | New Job | ED (deputation), REC Ltd | HOLD |
| Extension of timeline for application for ED on deputation (15.06.2026) | Update | ED (deputation) | HOLD (follows parent) |
| Status of Backlog vacancies as on 30 June 2026 | Noise | - | HOLD |
| Format of OBC / SC ST / EWS / PWD certificate | Noise | - | HOLD |
| List of Empanneled Hospital | Noise | - | HOLD |
| Archive: List of selected candidates-2 (co-hr-...List-5-dt-190925.pdf) | Result | selection process, Sep 2025 | PASS (if parent was passed) |
| Archive: 4th List of Shortlisted Candidates (dt-190825) | Result | same | PASS |
| Archive: Cancellation Notice (dt-300525) | Update | selection process 2025 | PASS |
| Archive: Advertisement for the post of Director (Finance), REC Limited (dt-050525) | New Job | Director (Finance) 2025 | PASS |
| Archive: Detailed Advertisement 02/2024 | New Job | Advt 02/2024 | PASS |
| Archive: EOI For Engagement Of Part-time Dietician At REC | New Job | - | HOLD |
| What the scanner sees today (Hindi): detailed advertisement CTO (09.01.2025), empanelled hospitals list, IEM image | stale | - | nothing new |

## Proposed config (after the scanner supports a language session)
Cannot be done by config alone. Intended shape once a language step exists (field names are placeholders, to be decided with the code change):
```json
[
  { "id": "rec", "name": "REC Careers", "type": "html", "tier": "FREE",
    "url": "https://recindia.nic.in/careers",
    "sessionInit": "https://recindia.nic.in/ajax.php?lang=en",
    "extraCerts": ["certs/emsign-dv-tls-ca-g2a-1.pem"],
    "include": "uploads/files", "exclude": "certificate|format|backlog|empanel|compassionate|qualified|roll no|unique id",
    "minTitle": 6, "limit": 30 },
  { "id": "rec-archive", "name": "REC Careers archive", "type": "html", "tier": "FREE",
    "url": "https://recindia.nic.in/archive-opportunities",
    "sessionInit": "https://recindia.nic.in/ajax.php?lang=en",
    "extraCerts": ["certs/emsign-dv-tls-ca-g2a-1.pem"],
    "include": "uploads/files", "minTitle": 6, "limit": 60 }
]
```
Note the English table rows put the link text in a span or table cell; many anchors have an empty text (title only in the `title` attribute). `titleFromHref` (filename as title) may be needed for the rows with no visible text; check once the session step works.

## Uncertain points
- The exact 15-line code change is untested; this audit only proved that a cookie session plus ajax.php?lang=en returns the English page (3 repeats with curl, worked every time).
- Whether the old exclude word list ("certificate|format|backlog") was written looking at the English page: it matches the English noise rows, so probably yes at one time.
- The `include: uploads/files` filter and Hindi-only exclude `प्रारूप` are fine either way.
- recpdcl.in/career (REC's subsidiary) was not understood: it has no PDF anchors in the plain HTML; could be JS-loaded. Not part of the current source; ask only if BatLee wants RECPDCL hires.

## BatLee's corrections
- none yet

## Repairs
- none
