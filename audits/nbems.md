# NBEMS Vacancies (National Board of Examinations in Medical Sciences)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (page loads, but every link the scanner catches is BROKEN - FIX proposed)

## BATCH SUMMARY BLOCK
SITE: NBEMS Vacancies | VERDICT: FIX
PROPOSED: 1) change rowLink of source "nbems" to "td:nth-child(3) a[href*='viewNotice']" (the scanner now picks a malformed first link that returns 404). Links change, so it is rebaselined silently on first run; nothing else changes.
MISSING TODAY: nothing missed by coverage (all 15 rows of the single page are caught, free, ~0.2-1 s); but every alert link is a 404 (https://natboard.edu.in/vacancy/https://natboard.edu.in/viewNotice.php?...).
ASK BATLEE: none

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Vacancy list (all NBEMS own recruitment notices, 15 rows, newest first, columns: date, title, PDF icon) | https://natboard.edu.in/vacancy.php | free fetch, https, no www (http no-www gives 301 to https) | FREE-OK |

Only this one page lists NBEMS's own jobs. The rest of natboard.edu.in is DNB/exam material, not recruitment; not audited further.

## ScrapFly
Not needed. Free fetch, no credits.

## Test results
- Scanner's own fetchItems on current "nbems": 15 items, identical on 5 repeated runs (0.2-0.7 s). No flakiness, no block.
- BUG: each row's title cell holds a broken double anchor: `<a href="vacancy/https://natboard.edu.in/viewNotice.php?NBE=...">` followed by a second unclosed `<a href=https://natboard.edu.in/viewNotice.php?NBE=...>`. The scanner's rowLink "td:nth-child(2) a[href*='viewNotice']" takes the first one, so the link becomes https://natboard.edu.in/vacancy/https://natboard.edu.in/viewNotice.php?... which returns HTTP 404 (checked). The correct link, https://natboard.edu.in/viewNotice.php?NBE=<token>, returns 200 application/pdf (checked, PDF ~278 KB).
- Fix tested: with rowLink "td:nth-child(3) a[href*='viewNotice']" (the PDF icon in column 3, always the clean absolute link) and timeoutMs 15000, 6 runs all give the same 15 items with correct links.
- Link stability: the NBE token is an encrypted per-notice id, stable. Old seen-state keys (broken links) will no longer match, so the first run after the change re-baselines silently (URL/selector change rule). No flood risk (only 15 rows).
- Page size: 15 rows total, limit 60 is ample. Posting speed: new notice appears at the top of the table the day it is posted (rows dated up to 01-10-2026 today).

## What the scanner catches vs misses
- Catches: every row of the vacancy table (jobs, exam schedules, syllabus, answer keys, shortlists, interview results).
- Misses: nothing found on this site. Dates are shown in column 1 but not in the title (not needed, the link is the identity).

## Label pattern
Title = notice title exactly as NBEMS writes it, no type prefix, mixed case. Parent must be derived from the wording:
- Direct recruitment cycle 2026 (Group A, B, C posts: Dy. Director [Medical], Jr. Programmer, Jr. Accountant, Stenographer, Jr. Assistant): "NBEMS Direct Recruitment 2026" (titles say "Direct Recruitment", "NBEMS Recruitment Exam-2026", "Group A, B and C posts to be filled by Direct Recruitment").
- Research Associates (RA-I / RA-II) 30 posts, contract: "NBEMS 30 posts of Research Associates (contract)".
- Executive Director post (English + Hindi version): "NBEMS Executive Director".
- Deputation posts (Group A & B): "NBEMS deputation Group A & B".
Type words inside titles: "Vacancy Notice" / "Filling up the N posts" / "Link for Registration" = New Job; "Schedule date and time of examination", "Rescheduling" = Update; "Scheme / Syllabus" = Update; "provisional answer keys" = Answer Key; "Result", "List of Shortlisted Candidates" = Result.

## Hold / pass rules for the sorter
HOLD:
- Hindi duplicate of an English notice (e.g. the Hindi "कार्यकारी निदेशक" vacancy notice when the English version is caught).
- Deputation posts and everything about them (vacancy, status of candidature, interview result for deputation basis).
- Contract Research Associates walk-in notices (small contract roles): vacancy, application forms, revised walk-in schedule, shortlisted list. (Recommended HOLD per consultants/contract rule; see ask-note below.)
- Existing source exclude (compassionate|qualified|roll no|unique id) stays; nothing to add.
PASS:
- Direct recruitment of Group A, B, C posts: registration/application link, scheme of examination, syllabus, exam schedule and rescheduling, provisional answer keys.
- Executive Director vacancy notice (English), unless it says deputation only (check the PDF).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Display of provisional answer keys of NBEMS RECRUITMENT EXAM-2026 and Question Paper with recorded responses | Answer Key | NBEMS Direct Recruitment 2026 | Pass |
| Rescheduling of NBEMS Direct Recruitment Exam 2026 | Update | NBEMS Direct Recruitment 2026 | Pass |
| Schedule date and time of examination for the post of Dy. Director [Med], Jr. Programmer, Jr. Accountant, Stenographer and Jr. Assistant (2 rows, 24-08-2026) | Update | NBEMS Direct Recruitment 2026 | Pass (duplicate pair, merge) |
| Scheme of examination of Stage-I for the posts of Dy. Director [Medical], Jr. Programmer ... reg. | Update | NBEMS Direct Recruitment 2026 | Pass |
| Scheme & Syllabus for the Post of Junior Programmer [on Direct Recruitment] in NBEMS | Update | NBEMS Direct Recruitment 2026 | Pass |
| Link for Registration and Filling up the online application form for Group A, B and C posts to be filled by Direct Recruitment | New Job | NBEMS Direct Recruitment 2026 | Pass |
| Vacancy Notice for the post of Executive Director [English version] | New Job | NBEMS Executive Director | Pass (verify not deputation-only) |
| कार्यकारी निदेशक के पद हेतु रिक्ति सूचना [हिंदी संस्करण] | New Job | NBEMS Executive Director | Hold (Hindi duplicate) |
| Result of the interview for various Group A & B posts on deputation basis in NBEMS | Result | NBEMS deputation Group A & B | Hold (deputation) |
| Status of candidature of applicants applied for the various Group-A and Group-B posts on deputation basis. | Update | NBEMS deputation Group A & B | Hold (deputation) |
| Filling up the 30 posts of Research Associates on contract basis. | New Job | NBEMS 30 posts of Research Associates | Hold (contract, see ask) |
| Application forms for the post of Research Associates [RA-I and RA-II] on contract basis for walk-in-Interaction. | Update | NBEMS 30 posts of Research Associates | Hold |
| REVISED WALK-IN-INTERACTION SCHEDULE FOR THE POSTS OF RESEARCH ASSOCIATES [RA-I AND RA-II] ON CONTRACT BASIS | Update | NBEMS 30 posts of Research Associates | Hold |
| List of Shortlisted Candidates - for filling the 30 posts of Research Associates ... on contract basis. | Result | NBEMS 30 posts of Research Associates | Hold |

## Proposed config (source "nbems", only rowLink and timeoutMs change)
```json
{
  "id": "nbems",
  "name": "NBEMS Vacancies",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://natboard.edu.in/vacancy.php",
  "rowSelector": "tr:not(:has(tr)):has(a[href*='viewNotice'])",
  "rowTitle": "td:nth-child(2)",
  "rowLink": "td:nth-child(3) a[href*='viewNotice']",
  "exclude": "compassionate|qualified|roll no|unique id",
  "minTitle": 15,
  "timeoutMs": 15000,
  "limit": 60
}
```

## Uncertain points
- Research Associates on contract (30 posts, walk-in): I held them as small contract roles; if BatLee wants such RA walk-ins posted on Sarkari24, flip this rule. Recommendation: hold.
- Only one page exists for NBEMS own jobs, so no extra sources are proposed. The table could become empty? Unlikely (15 historical rows), so no allowEmpty.

## BatLee's corrections
- none yet

## Repairs
- none yet
