## BATCH SUMMARY BLOCK
```
SITE: ICAR (Indian Council of Agricultural Research) | VERDICT: OK
PROPOSED: none (optional: add https://icar.org.in/en/latest-update as FREE source only if BatLee wants admission/counselling notices)
MISSING TODAY: nothing found (ICAR scientist/technical recruitment is run by ASRB, not ICAR; check the ASRB audit)
ASK BATLEE: none
```

# ICAR
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, no config change)

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Vacancies (current source) | https://icar.org.in/en/vacancies | free, scanner fetchItems, 2 runs, 7 items each, identical | FREE-OK |
| Archive vacancies | https://icar.org.in/archive-vacancies | free, 21 PDF links | FREE-OK (older posts, includes the 7 current ones; not needed) |
| Latest update | https://icar.org.in/en/latest-update | free, 10 items | FREE-OK, but content is admissions/counselling/awards, not jobs |
| www / http variants of vacancies | www.icar.org.in, http://icar.org.in | all return 200 | all work; https no-www kept |

No JS needed, no block, no ScrapFly. PDFs are plain links under /sites/default/files/YYYY-MM/.

## What the scanner catches
Current source (table rows, title in column 2, `allowEmpty`) returns all 7 rows on the page. Page lists only a handful of posts at a time (newest 2026-09, oldest 2026-07), so the posting rate is low (about 2-4 a month) and the limit of 40 is far above need. Links are dated folders and stable, so no flood risk. Drupal site; empty list between postings is plausible, so `allowEmpty` is right.

## Label pattern
Free-text titles, no fixed pattern. Types: "Advertisement for <post>, <org>", "Inviting application for the post of X on deputation basis", "Hiring of Young Professional / Consultant at ICAR-<unit>". Parent = post + organisation (e.g. "Director, CSIR-NBRI Lucknow"). Hindi twins exist on /archive-vacancies and /hi/vacancies only; the English page watched here is the one to keep.

## Hold / pass rules for the sorter
- HOLD: Young Professional (YP-I/II), consultants, walk-in engagement, deputation posts (e.g. Director (OL)), transfer cycles, awards/fellowship ads, Hindi duplicates, .docx ToR drafts.
- PASS: open posts with regular recruitment (e.g. Vice Chancellor, Director/DG posts of other bodies are third-party ads: pass only if open to direct applicants, otherwise hold as deputation/tenure), admit cards, results, corrigenda/extensions.
- Note: many ads here are for other organisations (AARDO, CSIR-NBRI, ICFRE, CERT-In) reposted by ICAR; usually tenure/deputation, so mostly HOLD.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Advertisement post of Secretary General, AARDO | New Job (foreign org post) | Secretary General AARDO | HOLD (senior tenure/deputation, check) |
| Notice for the post of DG, ICERT - Reg. | New Job (OM) | DG CERT-In | HOLD (deputation-type) |
| Advertisements for Director, CSIR-NBRI Lucknow | New Job | Director CSIR-NBRI | HOLD (senior tenure/deputation, check) |
| Technical Manpower [Young Professional-I (Finance & Accounts) | New Job | YP-I F&A, ICAR | HOLD (YP) |
| Hiring of Young Professional-II at ICAR-DKMA | New Job | YP-II DKMA | HOLD (YP, docx) |
| Hiring of Senior Consultant (Grade-I) at ICAR-DKMA | New Job | Sr Consultant DKMA | HOLD (consultant) |
| Inviting application for Director (OL) on deputation basis | New Job | Director (OL) | HOLD (deputation) |
| Public Notice (Revised) Mop-Up counselling ICAR UG 2026 (latest-update, not watched) | Update | ICAR UG admission | not a job |

## Proposed config
Unchanged:
```json
{"id":"icar","url":"https://icar.org.in/en/vacancies","rowSelector":"tr:has(a[href])","rowTitle":"td:nth-child(2)","rowLink":"a[href]","allowEmpty":true,"exclude":"compassionate|qualified|roll no|unique id","minTitle":10,"limit":40}
```

## Uncertain points
- Page shows no dates, so posting date is unknown; judged by folder month.
- ICAR exams (AIEEA/AICE) are run by NTA and posted there; ICAR scientist jobs by ASRB. Neither is on this page.
- Existing `exclude` words came from an earlier setup; none matched today's rows.
