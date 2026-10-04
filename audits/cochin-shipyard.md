## BATCH SUMMARY BLOCK
```
SITE: Cochin Shipyard Careers | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page has no results/shortlist/corrigendum section; /news-release is press releases only)
ASK BATLEE: none
```

# Cochin Shipyard (CSL)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, no config change)

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Careers (Current Job Openings) | https://cochinshipyard.in/Careers | free, 3 runs via fetchItems, 160-640 ms, 5 items each time | FREE-OK |
| Archive per location | https://cochinshipyard.in/careersummary/career_locations/1..7 | free (HTTP 200) | closed/old notices only (2025-26 expired), not worth watching |
| News & Updates | https://cochinshipyard.in/news-release | free (HTTP 200) | press releases only (ship launches, awards), no jobs. Not recommended |

No ScrapFly needed. Homepage and Careers both load with plain https, no www needed (www not tested).

## What the scanner catches vs misses
Catches the "Current Job Openings" table: each row = title + "Read more" link to /careerdetail/career_locations/<id>. Today 5 rows: PMIS interns (806), Technician (Vocational)/Trade apprentices (815), ITI trade apprentices (821), Supervisory posts on contract (819), Draftsman on regular (820).
Seen file also holds earlier ones (814 nurse, 816 officer skill development, 817 faculty, 818 hostel warden) which have since dropped off the page: normal, page only lists open posts.
Posting speed: about 9 new notices in about 2 days in late Sep (IDs 814-821); well under limit 60. No flood risk: links are stable numeric IDs.
The row also holds a direct PDF link and a last date, but the scanner uses the careerdetail link (stable). No reason to change.
Not on the page: results, shortlists, admit cards, corrigenda. CSL posts these inside the same career notice (detail page) or in the PDFs; nothing separate to watch.

## Label pattern
Title = post/notification name, often "Vacancy Notification - <posts> [on contract basis | on regular basis]" or "Notification for Engagement of <apprentices|interns>". No advert number. Parent = the notification title itself (e.g. "Draftsman, regular, CSL"). Contract/regular word tells the sorter the type.

## Hold / pass rules for the sorter
- Pass: regular posts (draftsman, workmen, executive/diploma trainees), apprentice and ITI trade apprentice notifications, PMIS interns (apprentice/intern: BatLee to decide, treated as Pass by default since Sarkari24 normally posts apprentice drives).
- Hold: ex-Navy / ex-servicemen-only walk-ins (e.g. "Walk-in selection for ex-Indian Navy personnel as Commissioning Engineers"), deputation / CMD selection, faculty / nurse / hostel warden / officer on contract at the training institute (small contract roles), consultants, tenders, Hindi duplicates.
- Judgement: "Supervisory posts on contract basis" is a real recruitment but contract; sorter should check size, pass if sizable.
- Existing exclude regex (compassionate|qualified|roll no|unique id) is fine; nothing found to add.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Notification for Engagement of Technician (Vocational)/Trade Apprentices Under Apprentices Act 1961 (815) | New Job | Technician/Trade Apprentices 2026 | Pass |
| Notification for Engagement of Interns under PMIS (806) | New Job | PMIS Interns CSL | Pass (check) |
| Notification for Engagement of ITI Trade Apprentices (821) | New Job | ITI Trade Apprentices 2026 | Pass |
| Vacancy Notification - Supervisory Posts on Contract Basis (819) | New Job | Supervisory posts CSL | Pass if sizable |
| Vacancy Notification - Draftsman on Regular Basis (820) | New Job | Draftsman CSL | Pass |
| Vacancy Notification - Nurse (Male) on contract (814, seen, gone) | New Job | Nurse CSL | Hold (small contract) |
| Faculty posts METI on contract (817, seen, gone) | New Job | MET Institute CSL | Hold |
| Female Hostel Superintendent/Warden contract (818, seen, gone) | New Job | MET Institute CSL | Hold |
| Walk-in for Ex-Indian Navy personnel (758, archive) | New Job | Commissioning Engineers | Hold (ex-servicemen only) |

## Proposed config
No change. Current source (sources.json id cochin-shipyard) is correct:
```json
{"id":"cochin-shipyard","url":"https://cochinshipyard.in/Careers","rowSelector":"tr:has(a[href*='careerdetail'])","rowTitle":"td:nth-child(2)","rowLink":"a[href*='careerdetail']","exclude":"compassionate|qualified|roll no|unique id","minTitle":15,"limit":60}
```

## Uncertain
- Title cell from td:nth-child(2) comes out clean (no file-size text), confirmed in test output.
- If the page ever empties, it would be flagged; table normally never empty, so no allowEmpty needed.
- www variant not tested.

## BatLee's corrections
- none yet

## Repairs
- none
