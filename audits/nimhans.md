## BATCH SUMMARY BLOCK
SITE: NIMHANS Recruitment and Notifications | VERDICT: FIX
PROPOSED: 1) Replace the current html source with a json POST source on the site's own API (bkend.nimhans.ac.in, category recruitment, 50 newest, FREE, same certs/nimhans.pem); full JSON below. 2) Drop include/exclude/allowEmpty (API list is never empty; exclude words are no longer needed, sorter holds them). 3) Rebaseline happens by itself (new URL/type).
MISSING TODAY: EVERYTHING - the current html page is a client-rendered shell ("No Data Found"), the scanner sees 0 items on every run; 66 live notices (incl. open Group B/C, Faculty, SR/JR posts, results, admit card) are invisible.
ASK BATLEE: none (optional: also watch the "Academics and Admissions" category - recommend NO, it is student admissions, not jobs).

# NIMHANS (audit 2026-10-04, batch mode)
Status: proposal only, sources.json NOT changed. Group: FREE.

## Pages watched and tested
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Current source | https://www.nimhans.ac.in/announcements/nimhans-recruitment-and-notifications-announcement | free, HTTP 200 (needs extraCerts) | BROKEN for scanning: Next.js shell, list is loaded by JS from an API; static HTML says "No Data Found". Scanner returned 0 items, 3 of 3 runs. allowEmpty hides the failure. |
| API (real list) | POST https://bkend.nimhans.ac.in/api/announcement/website-list-announcements/ | free via scanner fetchItems, 5 of 5 runs OK, 50 items | FREE-OK |
| Careers page | https://www.nimhans.ac.in/careers | free | no notices, only Recruitment Rules link. Not useful. |
| Other categories | same API, slug academics-and-admissions-announcement | free | student admissions (UG lists etc.). Not proposed. |

API request body (JSON): filters announcement_category_slug = nimhans-recruitment-and-notifications-announcement and is_archived = false, sort publish_date DESC, page 1, list_per_page 50. Needs header Content-Type: application/json. The bkend host needs certs/nimhans.pem (without it: UNABLE_TO_VERIFY_LEAF_SIGNATURE; with it works). Total 66 live items (7 pages of 10); older ones sit in the archive endpoint (not needed).
PDFs: hosted on nimhansbkt.demo-appiness.com, HTTP 200 free with curl (checked one, 43 KB application/pdf). ScrapFly: not needed, 0 credits.

## Posting speed / stability
Items carry publish_date (newest on 2026-09-30). Roughly 8-10 notices per month, so 50 newest cover several months, no flood risk. Each item's link is a unique hashed PDF file name (stable). Pinned item (id 1605, "Caution against Recruitment / Admission Fraud") stays on top permanently; it will just be seen once at baseline. An item with several attachments (notification + corrigendum + addendum) is reported by its FIRST file only; the title usually says "Corrigendum available, Addendum available" so the sorter can open the post. A newly ADDED corrigendum on an old item will not trigger a new alert (known limitation of title+first-link).

## Label pattern
Title (field "content") is a plain sentence, no type prefix. Patterns:
- "Vacancy notification for the post of <Post> [on Contract basis] at NIMHANS" = New Job. Parent = post name (+ date in the title when several, e.g. "Vacancy notification for various Group B & C Positions at NIMHANS-08.06.2026" -> "Group B & C Positions 2026").
- "Final selection list of <Post> ... notified vide NO.NIMH/RECT/ADVT-6/SSO(NM)/2026-27 Dated ..." = Result. Parent = advertisement number inside title (ADVT-6/SSO(NM)/2026-27).
- "Results of ...", "Result of ...", "Merit list", "Provisional Selection and Waitlist", "Overall Results of the Eligibility Test" = Result.
- "Notification regarding Admit card ...", "Detailed Schedule for ...Eligibility Test", "Information regarding skill test" = Admit Card / schedule (pass).
- "Notification on revised date", "Extension of the Last Date", "Cancellation of Recruitment Process", "Kept on hold", title ends with "Corrigendum available, Addendum available" = Update.
- Parent for Group B & C posts: "Group B & C Posts Recruitment (NIMHANS 2026)" - all related lists carry the dates 23/27/28.08.2026 or DV 21-22.09.2026.

## Hold / pass rules (for the sorter)
Hold: "on deputation basis" / "on Deputation" (Assistant Engineer, JE, Chief Nursing Officer), "Caution against Recruitment / Admission Fraud", "operating waitlist for vacant posts" (internal info; pass only if BatLee wants waitlist movement), ex-servicemen-only/retired-only posts, consultants.
Pass: all Vacancy notifications (contract Non-PG SR/JR, Duty Medical Officer, Clinical Psychologist, SSO, Faculty, Director, Group B & C, Library/Hospital Assistant), final selection lists, results, merit lists, waitlists, admit card, schedules, skill test info, revised dates, extension, cancellation.
Note: many posts are "on contract basis" walk-in style. Standing rule holds only "small consultant/contract roles"; these are medical/scientific posts (SR/JR, DMO, SSO, Clin. Psychologist) - passing them by default, BatLee can tell the sorter otherwise.

## Sample links (from the API, audit day)
| Title (short) | Type | Parent | Pass/Hold |
|---|---|---|---|
| Caution against Recruitment / Admission Fraud | Noise | - | Hold |
| Final selection list SSO (Neuromuscular) contract, ADVT-6/2026-27, 30.09.2026 | Result | SSO (Neuromuscular) ADVT-6/2026-27 | Pass |
| Notification AE Civil / AE Electrical / JE Civil on deputation | New Job (deputation) | Engineering Section deputation | Hold |
| Final Selection and waiting list Group B & C posts (DV 21-22.09.2026) | Result | Group B & C Posts 2026 | Pass |
| Final selection list Non PG SR & JR, ADVT-Aug/2026-27 | Result | Non-PG SR/JR ADVT-Aug 2026-27 | Pass |
| Provisional Selection and Waitlist Group B & C (tests 23/27/28.08.2026) | Result | Group B & C Posts 2026 | Pass |
| Results of Eligibility Test, Library Assistant, 28.08.2026 | Result | Group B & C Posts 2026 | Pass |
| Merit list of Eligibility Test 27.08.2026 | Result | Group B & C Posts 2026 | Pass |
| Information regarding skill test for Group B & C posts | Update | Group B & C Posts 2026 | Pass |
| Notification regarding Admit card for Group B & C Eligibility Test | Admit Card | Group B & C Posts 2026 | Pass |
| Detailed Schedule for Group B & C Eligibility Test | Update | Group B & C Posts 2026 | Pass |
| Result of Direct Recruitment of Faculty dated 20 Aug 2026 | Result | Faculty direct recruitment | Pass |
| Vacancy notification Non-PG SR and JR (contract) | New Job | Non-PG SR/JR | Pass |
| Vacancy notification Senior Scientific Officer (Neuromuscular) contract | New Job | SSO (Neuromuscular) | Pass |
| Vacancy notification Asst Professor Neuro Imaging & Interventional Radiology (contract) | New Job | Asst Prof Neuro Imaging | Pass |
| Vacancy notification various Group B & C Positions 08.06.2026 | New Job | Group B & C Posts 2026 | Pass |
| Notification on revised date for various Group B & C Positions | Update | Group B & C Posts 2026 | Pass |
| Vacancy notification Chief Nursing Officer & Nursing Superintendent on Deputation | New Job (deputation) | CNO / NS deputation | Hold |
| Extension of Last Date, Post of Director | Update | Director NIMHANS | Pass |
| Cancellation of Recruitment Process, ADVT-1/2024-25 dated 16.07.2024 | Update | Advt 1/2024-25 | Pass |

## Proposed config (replaces the existing "nimhans" entry; keep runner/tier/level)
```json
{
  "id": "nimhans",
  "name": "NIMHANS Recruitment and Notifications",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "json",
  "method": "POST",
  "url": "https://bkend.nimhans.ac.in/api/announcement/website-list-announcements/",
  "headers": { "Content-Type": "application/json", "Accept": "application/json" },
  "body": "{\"filters\":[{\"field\":\"announcement_category_slug\",\"value\":\"nimhans-recruitment-and-notifications-announcement\"},{\"field\":\"is_archived\",\"value\":false}],\"sort\":{\"field\":\"publish_date\",\"order\":\"DESC\"},\"page\":1,\"list_per_page\":50}",
  "extraCerts": ["certs/nimhans.pem"],
  "itemsPath": "results",
  "titleField": "content",
  "linkField": "announcement_links.0.url",
  "fallbackLink": "https://www.nimhans.ac.in/announcements/nimhans-recruitment-and-notifications-announcement",
  "timeoutMs": 15000,
  "limit": 50
}
```
Tested exactly like this through fetchItems (with the same fields): 5 of 5 runs, 50 items. (timeoutMs not included in the test; the API answered in well under a second.) Human-facing page for readers stays the fallbackLink.

## Uncertain
- Items without any attachment fall back to the listing page URL (same link for all such items; the seen check would then treat them as one). None found in the first 50.
- Cert chain: certs/nimhans.pem already works for the bkend host; if NIMHANS renews it, the fix is a new pem.
- Why the old source was never noticed: allowEmpty true turns "0 items" into a silent pass. Recommend BatLee's 60-day reminder for allowEmpty sources not be relied on here.

## BatLee's corrections
- none yet

## Repairs
- none
