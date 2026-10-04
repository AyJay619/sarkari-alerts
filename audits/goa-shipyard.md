## BATCH SUMMARY BLOCK
```
SITE: Goa Shipyard Advertisements (goashipyard.in) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (one page holds ads, shortlists, CBT lists and final results together; no other career page exists)
ASK BATLEE: none
```

# Goa Shipyard Ltd (goashipyard.in)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Career / Advertisement (current "goa-shipyard") | https://goashipyard.in/notice-board/career/advertisement | free fetch via fetchItems, extraCerts certs/goashipyard.pem | FREE-OK, 40 items (limit), 1.0-1.6 s, 4/4 runs identical |

No-www is the right host. http (port 80) is refused (ECONNREFUSED), so https only. Other career menu pages are policy-scheme and equal-opportunity-policy (not job notices). Guessed sub-pages (career/result, /recruitment, /admit-card) return a generic page with no notices, so they are not real pages. /notice-board/notifications has only 2 PDF links (general notices, not recruitment); not worth watching.

## What the scanner catches vs misses
- The single page lists everything career-related in one table, newest first: advertisements ("SELECTION FOR THE POST OF ..."), shortlists for interview / CBT / document verification, final selection results, and corrigenda-type notices. Page holds 397 PDFs in total (full history), the scanner takes the newest 40. Include filter "storage/clients_logo" matches all notice PDFs.
- Misses: nothing found. Limit 40 is ample: GSL posts roughly 30-40 notices in 5 months, and the newest are always at top.
- Posting speed: newest PDF filename is a Unix timestamp (1788345486 = late Sept 2026), so new items appear within days.
- Link stability (flood check): PDF links are static /storage/clients_logo/<timestamp>.pdf, identical across 4 runs. No flood risk.
- Titles are ALL CAPS and some are cut off (missing closing quote or bracket); titles are not used for the seen check.

## Label pattern
No "type: parent" prefix. The title is the notice itself.
- Job: "SELECTION FOR THE POST OF <post> - (ON FIXED TERM / CONTRACT BASIS ...) - (ADVT. NO. NN/YYYY)"; also "ADVERTISEMENT NO. NN/YYYY (FOR <post>)" and "Apprenticeship Advertisement".
- Shortlist / call list: "LIST OF CANDIDATES CALLED FOR CBT FOR THE POST OF <post> (ADVT. NO. ..)", "CANDIDATES PROVISIONALLY SHORT LISTED FOR PERSONAL INTERVIEW / DOCUMENT VERIFICATION & SKILL/TRADE TEST FOR THE POST OF <post> (ADVT. NO. ..)".
- Update: "SELECTION PROCESS SCHEDULED FOR THE POST OF <post> (ADVT. NO. ..)" = schedule; "NOTICE WITH RESPECT TO ... FINAL SELECTION RESULT ..." = corrigendum/result notice.
Parent = "<post> + Advt NN/YYYY" taken from the title. Some ads lack the Advt no (e.g. Painter): use the post name.

## Hold / pass rules for the sorter
Hold: "EXPERT/SPECIALIST ... ON CONTRACT BASIS FOR 1 YEAR" and the "ENGAGEMENT OF EXPERTS ON CONTRACT" ad (consultant-type roles); anything for retired / ex-servicemen only; deputation; Hindi duplicates.
Pass: all regular / fixed-term / trainee advertisements (Deputy Manager, Manager, Management Trainee, Trainee Project Executive, Office Assistant, trades such as Welder / Painter / Fitter, Apprenticeship), CBT call lists, interview / DV / trade-test shortlists, final results, selection schedules, corrigenda.
Note for matching: the same Advt no. covers many posts (Advt 03/2026 = about 10 Deputy Manager / Manager posts, one PDF each), so match on post + Advt no., not Advt no. alone. Many of the posts are fixed-term contract (3 years / 2 years) but are real recruitment, passed.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| ADVERTISEMENT NO. 05/2026 (FOR TRAINEE PROJECT EXECUTIVE) | New Job | Trainee Project Executive, Advt 05/2026 | Pass |
| SELECTION FOR THE POST OF OFFICE ASSISTANT - CLERICAL STAFF (3 yrs fixed term) (ADVT. NO. 04/2025) | New Job | Office Assistant Clerical, Advt 04/2025 | Pass |
| SELECTION FOR THE POST OF WELDER (ADVT. NO. 09/2025) | New Job | Welder, Advt 09/2025 | Pass |
| SELECTION FOR THE POST OF EXPERT/SPECIALIST - CIVIL - CONTRACT 1 YEAR (ADVT. NO. 04/2026) | New Job | Expert Civil, Advt 04/2026 | Hold (contract expert) |
| SELECTION FOR THE POST OF EXPERT/SPECIALIST - BUSINESS DEVELOPMENT & PROJECTS (ADVT. NO. 04/2026) | New Job | Expert BD&P, Advt 04/2026 | Hold |
| SELECTION FOR THE POST OF MANAGEMENT TRAINEE (ELECTRONICS) (ADVT. NO. 06/2025) | New Job | Management Trainee, Advt 06/2025 | Pass |
| LIST OF CANDIDATES CALLED FOR CBT FOR THE POST OF MANAGEMENT TRAINEE (MECHANICAL) (ADVT. NO. 06/2025) | Admit Card / Update | Management Trainee Mechanical, Advt 06/2025 | Pass |
| Apprenticeship Advertisement | New Job | Apprentices (GSL) | Pass |
| SELECTION FOR THE POST OF JUNIOR SUPERVISOR (MECHANICAL-SAFETY) (ADVT. NO. 09/2025) | New Job | Junior Supervisor, Advt 09/2025 | Pass |
| SELECTION PROCESS SCHEDULED FOR THE POST OF EXPERT/SPECIALIST - CIVIL (ADVT. NO. 04/2026) | Update | Expert Civil, Advt 04/2026 | Hold (parent held) |
| NOTICE WITH RESPECT TO THE HEADER OF THE FINAL SELECTION RESULT ... TRAINEE PROJECT EXECUTIVE ... ADVT. NO. 02/2026 | Result / Update | Trainee Project Executive, Advt 02/2026 | Pass |
| SELECTION FOR THE POST OF DEPUTY MANAGER (ELECTRICAL / ELECTRONICS / POWER) (ADVT. NO. 03/2026) | New Job | Deputy Manager Electrical, Advt 03/2026 | Pass |
| SELECTION FOR THE POST OF DEPUTY MANAGER (HVACR) (ADVT. NO. 03/2026) | New Job | Deputy Manager HVACR, Advt 03/2026 | Pass |
| SELECTION FOR THE POST OF MANAGER (WEAPONS) (ADVT. NO. 03/2026) | New Job | Manager Weapons, Advt 03/2026 | Pass |
| CANDIDATES PROVISIONALLY SHORT LISTED FOR PERSONAL INTERVIEW ... TRAINEE PROJECT EXECUTIVE (MECHANICAL) (ADVT. NO. 02/2026) | Result (shortlist) | Trainee Project Executive Mechanical, Advt 02/2026 | Pass |
| CANDIDATES PROVISIONALLY SHORT LISTED FOR DOCUMENT VERIFICATION & SKILL/TRADE TEST ... OFFICE ASSISTANT (ADVT. NO. 04/2025) | Result (shortlist) | Office Assistant Clerical, Advt 04/2025 | Pass |

## Proposed config
No change. Current source stays:
```json
{ "id": "goa-shipyard", "url": "https://goashipyard.in/notice-board/career/advertisement", "extraCerts": ["certs/goashipyard.pem"], "include": "storage/clients_logo", "exclude": "shortlisted|compassionate|qualified|roll no|unique id", "limit": 40 }
```

## Uncertain points
- The current exclude contains "shortlisted". The page titles use "SHORT LISTED" (two words), so the filter does NOT drop them today and shortlists do come through (matches the Pass rule). If the site ever writes "shortlisted" as one word, those lists would be silently dropped; BatLee's standing rule is to pass shortlists, so recommend removing "shortlisted" from exclude (config-only, no rebaseline needed beyond the scanner's own). Not put in PROPOSED because it changes nothing today.
- No dates are shown in the scanner output; the PDF filename is a timestamp only.

## BatLee's corrections
- none yet

## Repairs
- none
