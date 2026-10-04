## BATCH SUMMARY BLOCK
SITE: UGC | VERDICT: FIX
PROPOSED: 1) drop the "exclude" filter on source `ugc` (rule: no keyword filters; sorter holds noise) and set limit 30; rebaseline. 2) add FREE json source `ugc-jobs` (UGC Jobs page API, POST Tenders/Fill_Tenders) with rebaseline. 3) optional: add FREE json source `ugc-notices` (full dated Notices list API) as backup/history, limit 40, rebaseline.
MISSING TODAY: the Jobs page (recruitment adverts/results, JS-loaded table, not on homepage) is not watched at all; last posting there is 07-02-2026 (Standing Counsel panel), so low volume.
ASK BATLEE: none (UGC rarely posts real jobs; most are consultants/deputation/empanelment which the sorter holds; keep ugc-jobs anyway, cost is zero).

# UGC (University Grants Commission)
Audited: 2026-10-04 | Group: FREE | Status: PROPOSED (nothing applied, no config changed)

## Pages watched and tested (scanner's own fetchItems, free fetch)
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Homepage (news ticker of PDFs) | https://www.ugc.gov.in/ | html, include `pdfnews` (current source `ugc`) | FREE-OK. 61 links, 0.6-0.8 s, identical on 5 repeats (stable). http and https both work. No-www https is REFUSED (ECONNREFUSED), so `www.` is required. |
| Jobs | https://www.ugc.gov.in/Tenders/Jobs | page table is empty in raw HTML (JS fills it), but data comes from a free JSON API | JS-ONLY, API is FREE-OK |
| Jobs API | POST https://www.ugc.gov.in/Tenders/Fill_Tenders form ID=0&type=JobsGrid | json, itemsPath List | FREE-OK, 138 rows, newest first |
| Notices | https://www.ugc.gov.in/Notices (JS table) | API POST https://www.ugc.gov.in/Notices/Fill_Notices form ID=0&type=NoticeGrid | FREE-OK, 2867 rows, newest first, has `created` date |
| Circulars | https://www.ugc.gov.in/Circulars (JS table) | API POST .../Circulars/Fill_Circulars type=CircularGrid | FREE-OK, 114 rows, newest dated 2024-11-19 (admin circulars, DA, pension: all noise, NOT worth watching) |
| Recruitment portal | https://recruitment.ugc.ac.in/v1 | loads (login/apply portal, no notice list) | not a source |
Guessed URLs /Vacancies, /Recruitment, /Home/Notices return a soft 404 (redirect to ErrorPage): FAILED, not used.
No ScrapFly needed: credits 0. PDFs under /pdfnews/ download free (links are plain).

## Catch quality
- Homepage lists the newest ~21 notices (public notices, letters, advisories) then older circulars. UGC posts roughly 3-8 items a month, so a 25-30 window is far larger than the posting speed (no miss risk). Links are stable (same hash/file URLs), no flood seen.
- Current `exclude` ("Organisational Chart|Certificate|letter regarding|Advisory") silently hides all "letter regarding" items; per standing rule it should go (letters are noise, but the sorter decides). Organisational Chart is a permanent header link: it is baselined on first run and never alerts again.
- A CUET public notice link in the homepage HTML is inside an HTML comment (old, not live); ignored correctly.
- Jobs API gives code + title with the advert reference, e.g. "45/2026", "42/2025 (Admn. I/C)", "44/2025": that is a clean parent key.

## Label pattern
- Homepage / Notices title: "UGC Public Notice regarding: <subject>", "UGC letter regarding <subject>", "UGC Circular regarding: <subject>", "UGC Advisory regarding <subject>", "Result under <programme> ...". Type = first words; Parent = the subject after "regarding:".
- Jobs API title: "<advt no> <headline>", headline forms: "Advertisement for the post(s) of ...", "Extension of ... last date ...", "FINAL RESULT FOR THE POST OF <post> Reference Advertisement - <no>/<year>", "List of Selected Candidates against ...". Parent = "UGC Advt <no>/<year>" (from the code) + post name. Extension / corrigendum / final result with the same code = Update / Result of that advert.
- PDF filenames are hashes or "NNNNNNN_Title.pdf": no advert number there; use the Jobs code instead.

## Hold rules for the sorter (UGC)
HOLD: all UGC letters/advisories to universities (Swachhata, TB Mukt Bharat, Yoga Day, Padma awards, sports day, SWAYAM MOOCs, quizzes, VBYLD, ragging, ABC credit upload), DA / dearness relief / pension / property-declaration / leave-rules circulars, scholarship and fellowship calls for students (NSPG, Stipendium Hungaricum, Russia scholarships, UNESCO prizes, awards), regulations / degree-specification / ODL recognition / equivalence notices, lists of fake or defaulter universities, comments-on-draft notices, foreign-student / study-in-India notices, Hindi duplicate adverts, Standing Counsel / Panel Advocate empanelment, Consultant / Young Professional / Domain Professional / Project Officer / Intern contract hires, deputation / "on deputation basis" posts (Joint Secretary, Director, Financial Advisor, Deputy Director), director posts of IUCs/UGC centres by selection (NAAC, INFLIBNET, CEC, IUAC), vice-chairman / secretary nominations.
PASS (if they ever appear): direct-recruitment posts at UGC (Lower Division Clerk, Accounts Officer / Junior Accounts Officer, Education Officer, Deputy Secretary, System Officer, Software Development) and their corrigenda / extensions / results / admit cards.
Realistically almost everything is HOLD; a pass is rare.

## Sample links (audit day, from the scanner)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| UGC Advisory observance of Swachhata Hi Seva Campaign 2026 | Noise | Swachhata Hi Seva 2026 | Hold |
| UGC Public Notice regarding Specification of Degrees Fifth Amendment | Noise (regulation) | UGC Degree Specification | Hold |
| UGC letter National Renewable Energy Quiz 2026 | Noise | Quiz | Hold |
| UGC Advisory related to RPwD Act 2016 | Noise | RPwD | Hold |
| UGC letter Mass participation in VBYLD 2027 | Noise | VBYLD | Hold |
| UGC Public Notice Invitation of applications from HEIs for ODL/Online recognition 2026-27 | Noise (HEI-facing) | ODL recognition | Hold |
| UGC Public Notice Draft Model Curriculum Substance Abuse | Noise | Draft curriculum | Hold |
| UGC Public Notice NSPG and ISHAN UDAY scholarship via NSP | Noise (scholarship) | NSPG / ISHAN UDAY | Hold |
| Result under Hungaricum Stipendium Programme 2026-27 | Noise (student scholarship result) | Stipendium Hungaricum | Hold |
| UGC Circular Grant of Dearness Relief pensioners 50% to 53% | Noise | DA circular | Hold |
| 45/2026 Standing Counsel / Panel Advocate empanelment (Jobs API) | Noise (empanelment) | UGC Advt 45/2026 | Hold |
| 42/2025 FINAL RESULT Domain Professional (Various Functions) | Result | UGC Advt 42/2025 Domain Professionals | Hold (contract Domain Professional) |
| 44/2025 Extension of timelines, 11 Domain Professionals | Update | UGC Advt 44/2025 | Hold (contract) |
| 43/2025 Online applications on Deputation basis (SCD) | New Job | UGC Advt 43/2025 | Hold (deputation) |
| Recruitment of Lower Division Clerks in UGC (Last Date extended) (old) | Update | UGC LDC | Pass if it were current |
| Advertisement for 17 posts of Education Officer at UGC (old) | New Job | UGC EO | Pass if it were current |

## Proposed config (JSON, for BatLee's "approved"; nothing applied)
```json
[
  { "id": "ugc", "name": "UGC", "runner": "india", "tier": "FREE", "level": "central", "type": "html",
    "url": "https://www.ugc.gov.in/", "include": "pdfnews", "limit": 30 },
  { "id": "ugc-jobs", "name": "UGC Jobs", "runner": "india", "tier": "FREE", "level": "central", "type": "json",
    "method": "POST", "url": "https://www.ugc.gov.in/Tenders/Fill_Tenders", "form": { "ID": "0", "type": "JobsGrid" },
    "itemsPath": "List", "titleFormat": "{tender_code} {tender_title}", "linkHtmlField": "tender_title",
    "linkPrefix": "https://www.ugc.gov.in/Tenders/", "limit": 25 },
  { "id": "ugc-notices", "name": "UGC Notices", "runner": "india", "tier": "FREE", "level": "central", "type": "json",
    "method": "POST", "url": "https://www.ugc.gov.in/Notices/Fill_Notices", "form": { "ID": "0", "type": "NoticeGrid" },
    "itemsPath": "List", "titleFormat": "{created} {title}", "linkField": "pdfnews",
    "linkPrefix": "https://www.ugc.gov.in/pdfnews/", "limit": 40 }
]
```
Tested with the scanner's fetchItems: ugc-jobs returned 25 rows, ugc-notices 40 rows, homepage 61 raw / stable x5.

## Uncertain points
- ugc-jobs links come out as ".../Tenders/../pdfnews/<file>.pdf" (the site's own relative "../pdfnews/"); a browser resolves them correctly, but the text differs from homepage links of the same PDF, so the same PDF could show up once from each source (duplicates are fine, sorter merges). Not tested by opening in a browser.
- `ugc-notices` mostly duplicates the homepage and adds dates; it is optional. Without the `exclude`, the first run after the change would list ~35 older letters unless the scanner rebaselines (it should, since the source definition changes; confirm on the first run).
- The Jobs table has a Hindi column (tender_title_Hindi) that appears empty; Hindi duplicates may still appear as separate rows (one seen: Hindi translator recruitment, old).

## BatLee's corrections
- none yet

## Repairs
- none
