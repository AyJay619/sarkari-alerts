## BATCH SUMMARY BLOCK
```
SITE: NVS (Navodaya Vidyalaya Samiti) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (main Recruitment feed has 21 items, scanner gets all 21; the 01/2025 advert PDF itself is no longer in the feed)
ASK BATLEE: none
```

# NVS (Navodaya Vidyalaya Samiti)
Audited: 2026-10-03 (batch mode) | Group: FREE | Status: ACTIVE, no change proposed

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitment feed (JSON API behind the site's Recruitment page) | https://navodaya.gov.in/api/public/media?media_type_id=7&limit=100&page=1 | free fetch via scanner `fetchItems` (type json) | FREE-OK. HTTP 200 on 5 of 5 tries, 0.3-0.6 s, 21 items, totalItems 21, one page |
| Notices & circulars (type 9) | same API, media_type_id=9 | free | Not watched. 37 items, mostly admission/school circulars, contracts, tenders. It mirrors the recruitment items under different ids (244-258 vs 280-293), so the same title would come twice with a different link |
| Modal / pop-up (type 278) | same API, media_type_id=278 | free | Not watched. 14 items, all copies of recruitment notices |
| Other media types 1-6, 8, 10-12 | same API | free | Empty |
| Homepage | https://navodaya.gov.in/ | redirects 302 to /nvs/ (HTML shell, JS app) | Not used. http://navodaya.gov.in did not answer from this PC. The site is a JS app, so the API is the right source |

The scanner's current source is correct and complete for jobs. Items carry `start_date` (not used by the scanner; titles carry the date).
PDF downloads: https://navodaya.gov.in/api/public/media/<id>/download returns 200 application/pdf on GET (tested ids 305 and 299, 0.3-0.45 MB). A HEAD request gets 403, so do not use HEAD to check links.

## ScrapFly
Not needed. Group FREE. Credits per scan: 0 | Monthly estimate: 0. PDFs download free: yes.

## What the scanner catches vs misses
- Catches all 21 items of the Recruitment feed (confirmed with `fetchItems`: 21 items, links of the form https://navodaya.gov.in/api/public/media/NNN/download).
- Posting speed: the feed is updated when NVS uploads (newest item 14.09.2026, nothing newer by 03.10.2026); no speed concern at the current scan frequency.
- Link stability / flood check: links are stable media ids; the seen state holds all 21 with initialised baseline. No flood risk. Note the old state keys show the same 21 titles, so no re-baseline is needed (URL and fields are unchanged).
- Not caught and not needed: type 9 only adds non-job items (admission class XI notice, JNVST results for students, tenders, one older "Result of Tier-II Recruitment Examination" dated 2026-08-07, id 259, which the Recruitment feed does not list but the Tier-II result notices of the same period are covered). Adding type 9 would create duplicates (different ids for the same notice) and student-admission noise, so I do not recommend it.

## Label pattern
Title is plain text, no "Type:" prefix; type is read from the words. Dates are inside the title as dd.mm.yyyy.
- Result: "Notice dated DD.MM.2026 - View (status of) result of Tier-II examination for the post(s) of <posts> under Recruitment Notification 01/2025." Parent = "NVS Recruitment Notification 01/2025" plus post group (PGT/TGT/JSA/Principal etc.).
- Update: "Corrigendum II / 3 Regarding the Recruitment Notification No. 01/2025", "Format of Bio-Data for candidates shortlisted for interview under Recruitment Notification 01/2025", "The facility to opt any post in KVS or NVS is now available on the portal up to <date>" (option window extension, parent 01/2025).
- New job (rare): "Notification ... for filling up the post of <post> ..." (almost always deputation). The big teaching advert 01/2025 itself is no longer in the list.
Normalise parent to "NVS Advt 01/2025" so the sorter matches the job already posted on Sarkari24 (KVS and NVS share this joint recruitment; the sorter should keep KVS and NVS parents apart).

## Hold / pass rules for the sorter
Standing rules apply. Site-specific:
- HOLD: "engagement of Counsellors on contract basis" (regional contract roles, Bhopal, Chandigarh).
- HOLD: "engagement of Project Staff for Vigyan Jyoti" (contract project staff).
- HOLD: "Deputy Commissioner (Finance) on Deputation basis" notification and its date extension.
- HOLD if they ever appear: tenders, RFPs, service-charge notices, housekeeping/vehicle contracts.
- PASS: Tier-II result notices and "view status of result" notices of 01/2025 (including Second Notice 18.08.2026), shortlist/interview bio-data format, corrigenda II and 3, post-option facility notice.
No script keyword filter proposed (rules say none).

## Sample links (audit day, 2026-10-03)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Notice dated 14.09.2026 - result Tier-II, Junior Secretariat Assistants (media 305) | Result | NVS Advt 01/2025 JSA | PASS |
| Notice dated 05.09.2026 - result Tier-II, PGT(Hindi), TGT(Hindi), Principal (280) | Result | NVS Advt 01/2025 | PASS |
| Notice dated 03.09.2026 - result Tier-II, PGT(English), PGT(PE), TGT(Music), TGT(PE) (281) | Result | NVS Advt 01/2025 | PASS |
| Notice dated 01.09.2026 - result Tier-II, TGT(Social Science), TGT(Special Educator), TGT(English) (282) | Result | NVS Advt 01/2025 | PASS |
| Notification for engagement of Counsellors on contract basis, Madhya Pradesh, RO Bhopal (283) | New Job | contract counsellors MP | HOLD (contract) |
| Format of Bio-Data for candidates shortlisted for interview, 01/2025 (284) | Update | NVS Advt 01/2025 | PASS |
| Notice dated 28.08.2026 - result Tier-II, PGT(Commerce), PGT(Geography), PGT(Biology), TGT(Art), TGT(Library) (285) | Result | NVS Advt 01/2025 | PASS |
| Notice dated 26.08.2026 - status of result Tier-II, TGT(Science) (286) | Result | NVS Advt 01/2025 | PASS |
| Notice dated 25.08.2026 - status of result, PGT(Maths), TGT Maths, Lab Attendant (287) | Result | NVS Advt 01/2025 | PASS |
| Notice dated 21.08.2026 - result Tier-II, PGT(Chemistry), Assistant Commissioner (289) | Result | NVS Advt 01/2025 | PASS |
| Second Notice dated 18.08.2026 - status of result Tier-II (291) | Result | NVS Advt 01/2025 | PASS |
| Notice for engagement of Counsellors (Male & Female), Chandigarh region 2026-27 (292) | New Job | contract counsellors Chandigarh | HOLD (contract) |
| Notice for engagement of Project Staff for Vigyan Jyoti (294) | New Job | Vigyan Jyoti project staff | HOLD (contract) |
| Extension of date, Deputy Commissioner (Finance) on deputation (295) | Update | NVS DC (Finance) deputation | HOLD (deputation) |
| Invitation of applications, Deputy Commissioner (Finance) on deputation, HQ Noida (296) | New Job | NVS DC (Finance) deputation | HOLD (deputation) |
| Facility to opt any post in KVS or NVS available up to 15 Dec 2025 (297) | Update | KVS/NVS Advt 01/2025 | PASS |
| Corrigendum 3 regarding Recruitment Notification 01/2025 (298) | Update | NVS Advt 01/2025 | PASS |
| Corrigendum II regarding Recruitment Notification 01/2025 (299) | Update | NVS Advt 01/2025 | PASS |

## Proposed config (unchanged, as in sources.json)
```json
{
  "id": "nvs", "name": "NVS Recruitment", "runner": "india", "tier": "FREE", "level": "central",
  "type": "json",
  "url": "https://navodaya.gov.in/api/public/media?media_type_id=7&limit=100&page=1",
  "itemsPath": "data.items", "titleField": "title_english",
  "linkField": "download_url", "linkPrefix": "https://navodaya.gov.in",
  "fallbackLink": "https://navodaya.gov.in/"
}
```
Optional (not recommended): add `"timeoutMs": 15000`; site answers in under 1 s, the default is fine.

## Uncertain points
- The main 01/2025 advert PDF and any new NVS direct-recruitment advert will appear in the type 7 feed when published; none is present today, so I could not see how a new advert title looks.
- Only tested from this PC; no other network checked.
- Media id 259 ("Result of Tier-II Recruitment Examination", 07.08.2026) exists only in type 9; judged stale and not worth a second source.

## BatLee's corrections
- none yet

## Repairs
- none
