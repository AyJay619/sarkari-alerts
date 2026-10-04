# NTA (National Testing Agency)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## BATCH SUMMARY BLOCK
SITE: NTA | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found for the notice feed; the recruitment portal (ntarecruitment.ntaonline.in) did not resolve from this PC so NTA's own staff vacancies are only caught when also posted in "Latest @ NTA"
ASK BATLEE: (1) NTA is mostly admission exams (NEET, CUET, JEE, AIAPGET, ICAR, SWAYAM). Pass only job-relevant ones (UGC-NET, CSIR-NET, NTA staff posts, RMS/RIMC/Sainik school entries?) and hold the rest? Recommend: pass UGC-NET, CSIR-NET and NTA vacancies; hold pure admission-exam notices unless you want them.

## Pages watched
| Page | URL | Fetch method | Verdict |
| Home, "Latest @ NTA" marquee | https://nta.ac.in/ (www and http also work, identical page) | free fetch, 0.1-0.5 s | FREE-OK |
| Notice Board Archive | https://nta.ac.in/NoticeBoardArchive (2.2 MB, 200) | free, not needed | backup only |
| Tender | https://nta.ac.in/Tender | free | not wanted (tenders) |
| Recruitment portal | https://ntarecruitment.ntaonline.in/ | could not resolve host from this PC | UNCHECKED |

Scanner config as it is (selector `.latestPart p`, title from `content`, link `a[href]`, limit 1000) returns 811 items on 3 of 3 runs, all unique links, no failures.

## Scanner catches vs misses
- Catches: every notice PDF on the home marquee: admit cards, results, answer keys, exam notices, corrigenda, vacancy notices, public notices. Marquee holds about 811 items going back to Dec 2023 (older than a year), newest first (a few late additions sit out of date order, e.g. an 18 Aug notice listed after July items).
- Newest notice is 25 Sep 2026 (9 days quiet today); about 25 notices in Sep 2026. Posting speed is far below the 1000 limit.
- Flood check: links are stable PDF paths (Notice_YYYYMMDDHHMMSS.pdf, 17 with uppercase .PDF; the seen check handles that). One row has link https://nta.ac.in/ (UGC-NET Dec 2025 "Correction in particulars" notice with no PDF); harmless, title is unique. First run after any reset would flood 811 items, so rebaseline (already how the scanner works).
- Exam-specific sites (exams.nta.nic.in/..., neet/jeemain/cuet.nta.nic.in) carry their own notice lists; not audited here (one unit = nta source). Home marquee already carries their main notices.

## Label pattern
Plain sentence titles, no "Type: Parent" prefix. Type is in the wording: "Release of Admit Card for ...", "Declaration of Result ...", "Display of Final/Provisional Answer Keys ...", "Inviting Online Application ...", "Extension of last date ...", "Correction in the particulars ...". Parent = the exam name in the title (UGC-NET June 2026, Joint CSIR-UGC NET June 2026, AIAPGET-2026, ICAR AIEEA-PG 2026, RMS CET 2026, RIMCEE 2026, CUET-UG 2026). Filenames carry only a timestamp, no exam name. Hindi duplicates exist (title starts in Devanagari, same timestamp-1 second as the English one, 19 in the feed).

## Hold / pass rules for the sorter
Hold: Hindi duplicates; deputation posts (incl. extensions); EoI for Subject Matter Expert / Translation Reviewers; Notice Inviting Quotation / tenders (hotel empanelment); relocation of NTA office; press/statement/social-media/fake-document notices (NEET OMR claims, Telegram statement, WhatsApp updates, "Team NTA, Team Bharat"); advisories (dress code, biometric, venue/city change, scribe portal, duplicate score card procedure, fee-refund bank details); exam calendar; cut-off marks lists only if BatLee wants none (default: pass as Result); court affidavits; topper lists.
Pass: Inviting Online Application (UGC-NET, CSIR-NET, RMS CET, RIMCEE, AIAPGET, NTA vacancy e.g. "Vacancy notification for Bilingual typist and operation assistant"); admit cards; results/score cards; final and provisional answer keys with challenge notices; extensions, corrections of application particulars; re-exam notices; advance city intimation.
Open question (ASK): admission-only exams (NEET, CUET, JEE, SWAYAM, NITTT).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
| Issuance of Certificates for Joint CSIR-UGC NET June 2026 | Update | CSIR-UGC NET Jun 2026 | Pass |
| Public Notice: Issuance of e-Certificates for UGC-NET June 2026 | Update | UGC-NET Jun 2026 | Pass |
| Inviting Online Application Form for RMS CET 2026 | New Job/Exam | RMS CET 2026 | Pass (see ASK) |
| Affidavit filed on behalf of Union of India before Supreme Court, 16 Sep | Noise | W.P. 651/2026 | Hold |
| Declaration of Results NTA Scores AIAPGET-2026 | Result | AIAPGET 2026 | Pass (see ASK) |
| Display of Final Answer Keys of AIAPGET | Answer Key | AIAPGET 2026 | Pass |
| Declaration of results of UGC-NET June 2026 (English, Commerce, Sociology) | Result | UGC-NET Jun 2026 | Pass |
| UGC-NET June 2026 (3) Subjects Category Wise Cut off Marks | Result | UGC-NET Jun 2026 | Pass |
| Procedure for Issuance of Duplicate Score Card | Noise | - | Hold |
| Announcement of Dates for SWAYAM (July 2026 Semester) Exam | Update | SWAYAM Jul 2026 | Hold (admission/semester, see ASK) |
| Notice Inviting Quotation for Empanelment of Hotels, Minto Road | Noise | - | Hold |
| Publication of Examination Calendar up to March 2027 | Noise | - | Hold |
| EoI for Translation Reviewers and Corrigendum | Noise | - | Hold |
| Relocation of NTA Office | Noise | - | Hold |
| Declaration of Result and Rank of Joint CSIR-UGC NET June 2026 | Result | CSIR-UGC NET Jun 2026 | Pass |
| Challenge of Provisional Answer Keys for UGC-NET June 2026 Re-Exam | Answer Key | UGC-NET Jun 2026 | Pass |
| Extension of last date, various posts in NTA on deputation basis | Noise | NTA deputation | Hold |
| Release of Admit Card for UGC-NET June 2026 re-examination | Admit Card | UGC-NET Jun 2026 | Pass |
| Vacancy notification for Bilingual typist and operation assistant | New Job | NTA Bilingual Typist / Operation Assistant | Pass |
| Inviting Online Application Form for RIMCEE 2026 | New Job/Exam | RIMCEE 2026 | Pass (see ASK) |
| Advance Intimation of Allotment of Re-Exam City, UGC-NET June 2026 | Update | UGC-NET Jun 2026 | Pass |

## Proposed config
No change. Current source stays:
```json
{ "id": "nta", "name": "NTA", "runner": "india", "tier": "FREE", "level": "central", "type": "html",
  "url": "https://nta.ac.in/", "rowSelector": ".latestPart p", "rowTitle": "content", "rowLink": "a[href]",
  "minTitle": 10, "limit": 1000 }
```
Optional: add timeoutMs 15000 (site answers in under 1 s; not essential).

## Uncertain points
- ntarecruitment.ntaonline.in did not resolve here (DNS), so not verified; may be reachable from other networks.
- Home marquee is a "Latest" box; if NTA changes it to show only a few items the first-run rebaseline logic still copes.

## BatLee's corrections
- none yet

## Repairs
- none
