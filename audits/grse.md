# GRSE Careers
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## BATCH SUMMARY BLOCK
SITE: GRSE Careers | VERDICT: OK
PROPOSED: 1) optional: drop "render" and "waitFor" (page is plain HTML with all 140 PDF links; fetch drops from 2-7 s with Chromium to 0.4-3 s free). 2) optional: remove "shortlisted" and "qualified" from exclude (those are PASS items per standing rules; none on the page today, so no effect now)
MISSING TODAY: nothing found (limit 40 of 117 deduped PDFs shown on page; newest-first so fine; admit cards / online results are not on this page)
ASK BATLEE: none

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Careers (main) | https://grse.in/career/ | scanner fetchItems as configured (render true, Chromium): 4/4 runs OK, 40 items, 2.2-7.6 s. Also tested with render false, 5 runs OK, 40 items, 0.4-3.1 s. Plain curl also returns 200, 300 KB, 140 .pdf hrefs | FREE-OK |
| Career archives | https://grse.in/career-archives/ | curl only: 200, 31 PDFs, old notifications. Not used, not needed | FREE-OK (archive, skip) |

No ScrapFly needed. PDFs are linked directly as https://grse.in/career/PDFs/<file>.pdf (relative `PDFs/...` on page, resolved correctly by the scanner).

## What the scanner catches vs misses
- Page lists, newest first: recruitment notifications (Detailed + Abridged English + Hindi), addenda / corrigenda, written-test syllabus, "List of selected candidates against EN No. ..." (results). Hindi PDFs are already dropped by `exclude: hindi`.
- With limit 40 the scanner sees the 40 newest rows (117 after dedupe of the full page, 140 raw). New postings appear at the top, so nothing is missed at daily scans. Latest is EN 2026/04(O) (28 Sep area; seen file baseline dated 2026-09-29).
- Posting speed: GRSE posts notification PDFs at the top of the page the day they publish. No dates shown on the page, so the scanner has no date to compare; fine.
- Link stability: PDF filenames are stable and unique per document. A few filenames repeat the same file under different titles (e.g. Detailed Advertisement 2025-05(J) appears twice, same link, different title). The seen key is title|link so one extra alert is possible only if GRSE retitles a row; low risk. No flood risk seen.
- Not on this page: admit cards / online test links / application portal (GRSE uses its own recruitment portal, not tested here). Result items appear only as "List of selected candidates".

## Label pattern
Title format: `GRSE Employment Notification No. <YYYY>/<NN>(<code>) (Detailed Notification | Abridged Notification-English)`.
- Parent = "GRSE EN <YYYY>/<NN>(<code>)", e.g. "GRSE EN 2026/04(O)". Code letters: O = officers/other, E = experts, J / SRD-J = junior/ senior-regular-deputed-junior style cadres, S = specialist, P = project.
- Some rows are untitled generics: "Abridged Advertisement (English)", "Written Test Syllabus", "Detailed Advertisement 2025-05(J) FINAL". The parent must come from the PDF filename / neighbouring row (the filename carries the EN number, e.g. `Abridged (Eng) Advt 2025-05 (J)...`).
- Titles of the form "Detailed Notification" can carry the wrong EN number (e.g. 2025/07(E) label on the 2025-08(O) and 2025-09(E) files). Trust the PDF filename and content over the label.
- Results: `LIST OF SELECTED CANDIDATES AGAINST EN NO. - 2025 / 08(O)` -> Result, parent EN 2025/08(O).
- Updates: `CORRIGENDUM - ...`, `ADDENDUM TO Employment Notification No. 2025/02(O) - ...` -> Update, parent EN 2025/02(O).

## Hold / pass rules (for the sorter)
Hold: Hindi duplicates, written test syllabus alone (general info; pass only if no notification is out yet for that EN), compassionate appointment lists, roll-no / unique-id lists, expert / project-based engagements that are consultant-type (EN codes E and P: check content; hold if consultant / retired / deputation only), Abridged versions when the Detailed one of the same EN is already caught (duplicate).
Pass: new Detailed notifications, addenda, corrigenda, extensions of closing date, selected-candidate lists (results), shortlists / reserve lists if they appear.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| GRSE Employment Notification No. 2026/04(O) (Detailed Notification) | New Job | GRSE EN 2026/04(O) | Pass |
| GRSE Employment Notification No. 2026/04(O) (Abridged Notification-English) | New Job (duplicate) | GRSE EN 2026/04(O) | Hold (duplicate of detailed) |
| GRSE Employment Notification No. 2026/03(o) (Detailed Notification) | New Job | GRSE EN 2026/03(O) | Pass |
| GRSE Employment Notification No. 2026/03(O) (Abridged Notification-English) | New Job (duplicate) | GRSE EN 2026/03(O) | Hold (duplicate) |
| GRSE Employment Notification No. 2025/07(E) (Detailed Notification) [file Detailed Notification 2025-08(O)] | New Job | GRSE EN 2025/08(O) (label mismatch) | Pass |
| LIST OF SELECTED CANDIDATES AGAINST EN NO. - 2025 / 08(O) | Result | GRSE EN 2025/08(O) | Pass |
| GRSE Employment Notification No. 2025/07(E) (Detailed Notification) [file Expert 2025-09 (E)] | New Job | GRSE EN 2025/09(E) (label mismatch) | Pass (check expert/consultant) |
| Abridged Advertisement (English) [EN 2025-07 (E)] | New Job (duplicate) | GRSE EN 2025/07(E) | Hold (duplicate) |
| GRSE Employment Notification No. 2025/06(SRD-J) (Detailed Notification) | New Job | GRSE EN 2025/06(SRD-J) | Pass |
| Written Test Syllabus (JMan SRD-2025) | Update (info) | GRSE EN 2025/06(SRD-J) | Hold |
| LIST OF SELECTED CANDIDATES AGAINST EN NO. - 2025 / 06 (SRD-J) | Result | GRSE EN 2025/06(SRD-J) | Pass |
| GRSE Employment Notification No. 2025/05(J) (Detailed Notification) | New Job | GRSE EN 2025/05(J) | Pass |
| LIST OF SELECTED CANDIDATES AGAINST EN NO. - 2025 / 05(J) | Result | GRSE EN 2025/05(J) | Pass |
| GRSE Employment Notification No. 2025/04(S) (Detailed Notification) | New Job | GRSE EN 2025/04(S) | Pass |
| ADDENDUM TO Employment Notification No. 2025/02(O) - AGM / DGM / Manager (Technical) | Update | GRSE EN 2025/02(O) | Pass |
| CORRIGENDUM - closing date extended upto 06 May 2025 | Update | GRSE EN 2025/02(O) | Pass |
| CORRIGENDUM-2 - closing date extended upto 13 May 2025 | Update | GRSE EN 2025/02(O) | Pass |
| Corrigendum - EN 2024/06(P) Sr. Project Executives and Project Coordinators | Update | GRSE EN 2024/06(P) | Pass (project-contract roles: check) |

## Proposed config (full source, optional changes)
```json
{
  "id": "grse",
  "name": "GRSE Careers",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://grse.in/career/",
  "timeoutMs": 15000,
  "include": "[.]pdf",
  "exclude": "hindi|compassionate|roll no|unique id",
  "titleReplace": ["\\s*\\(\\s*[|].*$", ""],
  "limit": 40
}
```
Current config works as is; the above only removes Chromium and two exclude words.

## Uncertain
- Whether removing render/waitFor triggers a rebaseline: the scanner re-baselines on URL or selector changes; render is not a selector, so probably not, but links are identical so no new alerts either way (the 40 items from both modes matched in the first 3 rows and count).
- GRSE application portal / admit cards are on another site, not verified or located.

## BatLee's corrections
- none yet

## Repairs
- none
