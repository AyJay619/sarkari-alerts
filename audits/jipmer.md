# JIPMER (Jobs announcements)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (works; one small exclude change proposed)

## BATCH SUMMARY BLOCK
SITE: JIPMER Jobs | VERDICT: FIX
PROPOSED: 1) in source "jipmer" change exclude to "jobs-archive|entrance|admission|compassionate|roll no|unique id" (drop shortlisted|eligible|qualified: shortlists/eligibility lists are PASS by rule; the sorter holds the project/contract ones). 2) set timeoutMs 30000 explicitly (site answers in 6-12 s; do NOT use 15000). 3) no extra pages needed.
MISSING TODAY: shortlists / eligibility lists / "Eligible list" results (about 10 of 24 current items are dropped by the exclude, mostly for contract project posts that are held anyway). Nothing else; page 0 holds the 24 newest.
ASK BATLEE: none (recommend keeping the source; ~90% of JIPMER posts are ICMR project / contract posts the sorter will hold).

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Jobs announcements (main, newest first) | https://jipmer.edu.in/announcement/jobs | free fetchItems with extraCerts certs/jipmer.pem, https, no-www | FREE-OK (slow, 6-8 s, identical result on 4 runs) |
| www version | https://www.jipmer.edu.in/announcement/jobs | free, 200, same list | works, not needed |
| http version | http://jipmer.edu.in/announcement/jobs | connect timeout (port 80 not answering) | FAILED, keep https |
| Page 2/3 of jobs | /announcement/jobs?page=1 , ?page=2 | free, 25 items each (older, Aug-Sep) | works; not needed (page 0 covers recent weeks) |
| All announcements | https://jipmer.edu.in/announcement | free 200 | mixed with academic/admission/office notices; not proposed |
| /announcement/jobs-archive, /results, /notices | same host | return the generic "all announcements" list, not real category pages | not useful |

Free fetch only, no ScrapFly, 0 credits. Notice links go to JIPMER announcement pages (the PDF sits inside), stable slug URLs; not scanned.

## What the scanner catches vs misses
- Today: 13 items kept of 24 on page 0 (the rest dropped by the exclude words shortlisted / eligible).
- Page holds 25 rows per page; limit 50 is more than enough. Posting rate is about 1-3 per day (page 0 = roughly 3 weeks; page 1 and 2 reach back to Aug), so a missed week cannot lose items.
- Flood check: links are slugs (e.g. ...-projec-0 for a repeat), stable between runs, no dates or tokens. Seen keys are title + link; no flood risk found.
- Real regular jobs seen: Nursing Officer (NORCET route), Group A non-faculty posts July 2026 and its result, Deputy Director on deputation. The rest are ICMR project/contract posts.

## Label pattern
Plain sentence titles, no fixed prefix. Types by keywords: "Advertisement / Recruitment / Vacancy notification / Re-Advertisement" = New Job; "Result(s) / Final Results / Interview Result / Recruitment Results" = Result; "Shortlisted / Eligible list / Eligibility List / Selection Notification / Annexure" = Update (shortlist); "Corrigendum / Extension" = Update; "Written Test and Interview Notice" = Update (schedule). Parent = the project or post named in the title ("Project Nurse-II, CHANGING trial", "Group A (Non-Faculty) Posts - July 2026"). A "Recruitment ... Result" and its advertisement share the project name.

## Hold / pass rules for the sorter (site-specific)
- HOLD: deputation posts (e.g. Group A and B on deputation, Deputy Director on deputation); promotion results (APS interview for promotion of faculty); consultant / project / contract roles of a single post (Project Nurse, PTS-I/III, Research Nurse, Clinical Trial Coordinator, Senior Health Economist) per standing rule, unless BatLee wants project jobs; tenders and equipment specifications ("Revised specifications for the equipment..."); outsourcing / office orders / circulars / attendance / winter vacation; awards and prizes ("Dr ... has secured third prize"); conferences and workshops; time tables (M.Ch exam time table); MBBS / convocation / exam fee notices (academic, not jobs).
- PASS: regular posts (Nursing Officer, Group A non-faculty, faculty), their results and shortlists; any corrigendum or date extension to a passed job.
- Noise inside the feed: awards / prizes appear in the jobs category.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Advertisement for the post of Project Technical Support - III (1) under ICMR-funded India-EMS project | New Job | PTS-III India-EMS | Hold (project contract) |
| Recruitment for the post of Data entry operator - NOCI Monitoring, Dept of Medical Oncology | New Job | DEO NOCI | Hold (contract) |
| Recruitment to Various Group A and B Posts on Deputation Basis at JIPMER - 2026 | New Job | Group A/B deputation 2026 | Hold (deputation) |
| Recruitment to the post of Deputy Director (Admn.) [on deputation basis] | New Job | DD Admn | Hold (deputation) |
| Result for Recruitment of Various Group A (Non-Faculty) Posts - July 2026 | Result | Group A Non-Faculty Jul 2026 | Pass |
| Advertisement for Recruitment of Various Group A (Non-Faculty) Posts - July 2026 | New Job | Group A Non-Faculty Jul 2026 | Pass |
| JIPMER - Nursing Officer on a regular basis, direct recruitment through NORCET | New Job | Nursing Officer | Pass |
| Results of the selection process held on 28/09/2026 for Project Nurse-II under CHANGING trial | Result | Project Nurse-II CHANGING | Hold (single contract post) |
| Final Results - Selection for Project Technical Support-I, Dept of ENT | Result | PTS-I ENT | Hold |
| Results of the APS interview for promotion of faculty members, 18-19 Aug 2026 | Result | APS promotion | Hold (promotion) |
| Corrigendum: Extension of Application Submission Date, TARGET Project | Update | TARGET project | Hold with its parent |
| Shortlisted Candidates for Written Examination - PRS-I POICE | Update | PRS-I POICE | Hold |
| DR. S. SREE DEVI ... has secured third prize for oral paper presentation | Noise | - | Hold |
| Revised specifications for the equipment SPECT/CT Scanner | Noise | - | Hold (tender-like) |

## Proposed config (source "jipmer")
```json
{
  "id": "jipmer", "name": "JIPMER Jobs", "runner": "india", "tier": "FREE", "level": "central",
  "type": "html", "url": "https://jipmer.edu.in/announcement/jobs",
  "extraCerts": ["certs/jipmer.pem"],
  "include": "jipmer[.]edu[.]in/announcement/[a-z0-9]",
  "exclude": "jobs-archive|entrance|admission|compassionate|roll no|unique id",
  "minTitle": 30, "limit": 50, "timeoutMs": 30000
}
```
Changing exclude/timeout does not change the URL or selectors, so no rebaseline happens: the previously excluded shortlist items (about 10) would alert once on the first run. Recommend a one-time rebaseline, or accept them (they are mostly project-post items the sorter holds).

## Uncertain
- Dates are not shown on the listing, so age of items is inferred (about 3 weeks per page).
- The mix of regular jobs vs project posts may change; only 2 regular posts visible in the last 2 pages, so project-hold policy could hide most of this source's output.
- Page speed (6-12 s per request) leaves little margin if timeout were lowered.
