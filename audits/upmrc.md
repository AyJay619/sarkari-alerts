# UP Metro (UPMRC)

## BATCH SUMMARY BLOCK
SITE: UP Metro (UPMRC) Recruitment Notices | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (feed is the site's own Notices API, 259 items, newest first; only 10 per page, scanner reads page 1 = all new postings)
ASK BATLEE: none (note: nearly all posts are deputation/absorption = HOLD; open jobs are rare)

Audited: 2026-10-04 | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Notices API (JSON, feeds the careers page) | https://portal.upmetrorail.com/en/api/v2/notices_list/Notices/?page=1 | free, json | FREE-OK (10 items, 3 runs, 0.5-1.3 s, stable) |
| Careers page (fallbackLink only) | https://upmetrorail.com/careers/new-recruitments | free, JS single-page app shell | JS-ONLY, not needed (API gives data) |
| API categories Recruitment / Careers | .../notices_list/Recruitment/ and /Careers/ | free | empty (count 0), nothing to add |

PDFs on upmrcl-media.s3.amazonaws.com (allowedHosts already set).

## Scanner catches vs misses
Catches all 10 newest notices (page 1). Posting speed: very slow (page 1 spans back to Dec 2025, i.e. a few posts per year), so 10 per page cannot overflow. Links are stable S3 PDF URLs (no flood risk). Pages 2+ are older history (2019-2025), not needed.

## Label pattern
Free-text titles, no fixed prefix. Types seen:
- "Requirement of <Post> in UPMRC on deputation/absorption basis" = job (deputation, HOLD)
- "Extension of last date ... for the post of <Post> ..." = Update
- "Cancellation of notification for (01) post(s) of <Post> ... notification no. UPMRC/HR/D/<n>/<year>" = Update
- "Selection of suitable candidate for <Post>" = result-like, HOLD (deputation)
Parent = the post name (plus notification no. UPMRC/HR/D/n/year when present).

## Hold / pass rules (for the sorter)
- HOLD: anything on deputation / absorption / contract basis (this is nearly every post here), "selection of suitable candidate(s)" for deputation posts.
- PASS: a notice of direct recruitment (regular posts open to all, e.g. Station Controller / Train Operator type advertisements) and its admit card / result / corrigendum, if one ever appears.

## Sample links (audit day, page 1)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Requirement of Project Director in UPMRC on deputation/absorption | New Job | Project Director | HOLD |
| Requirement of Chief Engineer (Electrical) ... deputation/absorption | New Job | Chief Engineer (Electrical) | HOLD |
| Cancellation ... post of Project Director, UPMRC/HR/D/1/2025 | Update | Project Director | HOLD |
| Extension till 17.12.2025, Joint General Manager (HR) | Update | JGM (HR) | HOLD |
| Cancellation ... HOD/IT & Cyber Security, UPMRC/HR/D/8/2024 | Update | HOD/IT | HOLD |
| Requirement of GM/AGM (Operation) & JGM (Operation) deputation | New Job | GM/AGM/JGM Operation | HOLD |
| Cancellation ... GM/AGM (Operation), UPMRC/HR/D/17/2024 | Update | GM/AGM Operation | HOLD |
| Requirement of Joint General Manager (HR) deputation | New Job | JGM (HR) | HOLD |
| Extension till 08.09.2025, Senior System Analyst (CAD/BIM) | Update | Sr System Analyst | HOLD |
| Extension till 22.09.2025, Project Director | Update | Project Director | HOLD |

## Proposed config
No change (current source in sources.json is correct: json, itemsPath results, titleField title, linkField document, allowedHosts s3, limit 40).

## Uncertain
- Site rarely posts direct (open) jobs; Lucknow/Kanpur/Agra metro direct recruitment may appear in this same feed or elsewhere; none seen in the 259-item history after 2019 pages beyond deputation posts (only pages 1-3, 10, 26 sampled).
- Notice dates are not in the API, so freshness is judged by position only.

## BatLee's corrections
- none

## Repairs
- none
