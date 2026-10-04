## BATCH SUMMARY BLOCK
```
SITE: Bank of Maharashtra | VERDICT: OK
PROPOSED: 1) Drop "shortlisted|qualified" from exclude (shortlists must pass; no title matches today). 2) Optional: limit 120 -> 200 (page has 151 PDFs, newest on top).
MISSING TODAY: nothing found (new ads, results, provisional lists, corrigenda all appear as PDFs under the same project heading on /current-openings; no separate results/notices page exists).
ASK BATLEE: none
```

# Bank of Maharashtra
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, no config changed)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Current Openings (all projects, newest first) | https://bankofmaharashtra.bank.in/current-openings | free, https, no extra options | FREE-OK (5 of 5 fetches, 0.7-1.4 s, 120 items each time, identical) |
| /careers | https://bankofmaharashtra.bank.in/careers | HTTP 200, only a landing page | nothing to add |
| /results-and-notices, /current-openings/results | guessed | 302 to error404 | do not exist |

Page has 151 unique PDFs under h4 project headings; the scanner returns the first 120 (limit). Order is newest project first, and new PDFs of a project sit inside that project's block, so the cut-off only drops very old items.

## What the scanner catches vs misses
- Catches: new advertisements (new project heading + "Recruitment Notification" PDF), and every later document of a project (results, provisional lists, corrigenda, scribe forms) because each is a new PDF link.
- Misses: nothing found. Posting speed: appears on the page directly, no lag evidence.
- Flood check: links are stable GUID PDF paths (same across 5 runs). No flood risk.

## Label pattern
Title = "<Project/parent heading>: <document type>" (the scanner joins the h4 via contextPrev). Examples: "Recruitment Project 2025-26 Phase II In Scale II, III, IV, V & VI: Corrigendum". PARENT for the sorter = text before the first colon; TYPE = text after it (Recruitment Notification = New Job; Result / List of Provisionally Selected Candidates = Result; Corrigendum = Update). Some projects have no colon form only in the h4 (apprenticeship: "...Project 2025-26: Apprenticeship Notification").

## Hold / pass rules for the sorter
Hold: Scribe Declaration Form, Experience Certificate Format and other blank forms/formats, "Result and Project Closure Notification" for old projects (info only unless fresh), empanelment of retired officers (Tele-Callers), empanelment of concurrent auditors, interview-process notices for senior contract posts only if old; any ex-servicemen-only / retired-only posts.
Pass: Recruitment Notification, Apprenticeship Notification, written-exam / online exam results, List of Provisionally Selected Candidates, corrigenda, interview schedules, IBPS CRP related notices.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment of Economists - Project 2026-27: Recruitment Notification | New Job | Economists Project 2026-27 | Pass |
| Online application for Engagement of Apprentices ... Project 2025-26: Apprenticeship Notification | New Job | Apprentices Project 2025-26 | Pass |
| Recruitment Project 2025-26 Phase II ...: List of Provisionally Selected Candidates for the post of Deputy General Manager - IT | Result | Project 2025-26 Phase II | Pass |
| ... Phase II: List of Provisionally Selected Candidates for the post of Manager | Result | Project 2025-26 Phase II | Pass |
| ... Phase II: Recruitment Notification | New Job | Project 2025-26 Phase II | Pass |
| ... Phase II: Corrigendum | Update | Project 2025-26 Phase II | Pass |
| ... Phase II: Corrigendum-1 | Update | Project 2025-26 Phase II | Pass |
| ... Phase II: Experience Certificate Format | Noise | Project 2025-26 Phase II | Hold |
| Generalist Officers in Scale II - Project 2025-26: List of Provisionally Selected Candidates | Result | Generalist Officers Scale II 2025-26 | Pass |
| Generalist Officers Scale II: Result of Online Examination (Additional) | Result | Generalist Officers Scale II 2025-26 | Pass |
| Generalist Officers Scale II: Result of Online Examination | Result | Generalist Officers Scale II 2025-26 | Pass |
| Generalist Officers Scale II: Scribe Declaration Form | Noise | Generalist Officers Scale II 2025-26 | Hold |
| Generalist Officers Scale II: Recruitment Notification | New Job | Generalist Officers Scale II 2025-26 | Pass |
| Project 2025-26 for Internal Ombudsman: List of Provisionally Selected Candidates | Result | Internal Ombudsman 2025-26 | Pass (single senior post, sorter judgement) |
| Project 2025-26 for Internal Ombudsman: Recruitment Notification | New Job | Internal Ombudsman 2025-26 | Pass |
| Project 2024-25 Phase III: Result and Project Closure Notification | Result | Project 2024-25 Phase III | Hold (old project closure) |
| Project 2024-25 Phase III: Recruitment Notification | New Job | Project 2024-25 Phase III | Pass if new |

## Proposed config (optional, no rebaseline needed)
```json
{ "id": "bank-of-maharashtra", "url": "https://bankofmaharashtra.bank.in/current-openings",
  "selector": "div.inner_post_content a[href*='documentlibrary']", "contextPrev": "h4",
  "exclude": "shortlisted|compassionate|qualified|roll no|unique id", "minTitle": 8, "limit": 200 }
```

## Uncertain points
- The existing exclude drops any title containing "shortlisted", "qualified", "roll no": that can hide a genuine "Shortlisted candidates for interview" result. The standing rule says no keyword filters and shortlists must PASS. Not asked as a question because it is a minor risk; recommend removing "shortlisted|qualified" from exclude (changes the selector config so it would rebaseline silently). Left unchanged in this batch.
- Old-project "Result and Project Closure" PDFs may be fresh when a project ends; sorter should check the date.

## BatLee's corrections
- none

## Repairs
- none
