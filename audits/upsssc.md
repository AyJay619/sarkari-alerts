## BATCH SUMMARY BLOCK
SITE: UPSSSC (UP Subordinate Service Selection Commission, state) | VERDICT: FIX
PROPOSED: 1) limit 40 -> 60 (page has 48 items today, 8 are cut off at the end); 2) optional: replace "render": true + waitFor with "legacyTls": true (free fetch gives identical 48 items, no browser needed, faster); no URL/selector change so no rebaseline needed
MISSING TODAY: last 8 items of the page (limit cut); titles are shortened by the site with ".." (full title is only in the link's title attribute); admit cards live on a separate upssscadmitcard site (not watched)
ASK BATLEE: none

# UPSSSC
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, proposal only, no config changed)

## Pages watched / tested
| Page | URL | Fetch | Verdict |
|---|---|---|---|
| Homepage (all notices) | https://upsssc.gov.in/Default.aspx | free; Node fails with legacy-renegotiation TLS error unless `legacyTls` (or the pinned browser) is used; curl works | FREE-OK |
| www version | https://www.upsssc.gov.in/... | HTTP 400 | FAILED, do not use |
| http version | http://upsssc.gov.in/... | 200 | works but not needed |
| AllNotifications.aspx, News.aspx?id=9 | upsssc.gov.in | redirect to homepage | FAILED page (counts as failed) |
| ResultsDire.aspx | upsssc.gov.in | 200 but content is an iframe (NewsResult.aspx?id=results) which redirects to homepage when fetched alone | not usable, results already appear on the homepage list |
| Admit card pages | upsssc.gov.in/upssscadmitcard/admitCard.aspx?ID=MAIN | 200 (candidate-facing portal) | not tested for links, not proposed |

Scanner test (current config, render true): 40 items. Same source with `render:false, legacyTls:true, limit:100`: 48 items, same top items, repeated 4 times, stable (no flood, no flakiness). No ScrapFly needed.

## Current vs proposed
Selector `ul.top_slider li a, ul.Live_Adverts li a` is right: the home page has the "what's new" slider (shortlists, results, typing-test and schedule notices, newest first, with date and "Visible upto") and two Live_Adverts lists (advertisement PDFs + notice PDFs). Items drop off the page after their "Visible upto" date, so the page is small and a flood is unlikely. Order is newest first, so new items arrive at the top and the limit cut only hides old ones; still, 60 is safer.

## Label pattern
Hindi, "DD/MM/YYYY . विज्ञापन संख्या-NN-परीक्षा/YYYY, <post name> <stage> (प्रा०अ०प०-YYYY)/NN <what happened>" e.g. a shortlist for main exam, answer key, scheduled exam. Parent = "Advt NN/YYYY" plus post name (e.g. Advt 12/2026 Forest Guard). Advert PDFs: "विज्ञापन संख्या-NN-परीक्षा/YYYY, <post> .. " (titles cut with ".."). Type words: विज्ञापन = New Job / advertisement; शार्टलिस्ट / परिणाम = Result; उत्तर कुंजी = Answer Key; प्रवेश पत्र = Admit Card; सम्पन्न लिखित परीक्षा की ... = exam done (answer key / notice); संशोधन / निरस्त = Update. Sort by advert number, not by name. Some links point off-site (examqp.com, Google Drive) - these are the notice files themselves; pass.

## Hold rules (site-specific, for the sorter)
- Standing rules apply. Specific to UPSSSC: exam calendar ("परीक्षाओं व साक्षात्कार का कैलेण्डर"), "future exams candidates must register / OTR" general notice, old closed adverts from 2015/2016 (e.g. 16(4)/2016, 20(7)/2015 instructor) = old, hold unless the notice is new.
- O.T.R. registration link (otr/) = standing link, hold (one-time info).
- Pass: new advertisements, shortlist/result for next stage, typing / skill test schedule, answer keys, extension notices.

## Sample links (audit day, titles shortened)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| 30/09 Advt 11/2026 Havildar Trainer main exam shortlist | Result | Advt 11/2026 | Pass |
| 30/09 Advt 10/2026 Platoon Commander/Block Organizer main exam shortlist | Result | Advt 10/2026 | Pass |
| 30/09 Advt 15/2026 Forensic Lab (joint cadre) completed exam notice (examqp.com) | Answer Key / Update | Advt 15/2026 | Pass |
| 30/09 Advt 12/2026 Forest Guard completed exam notice (examqp.com) | Answer Key / Update | Advt 12/2026 | Pass |
| 29/09 Advt 15/2026 Forensic Lab notice (Google Drive) | Update | Advt 15/2026 | Pass |
| 29/09 Advt 12/2026 Forest Guard notice dated 27-09 (Google Drive) | Update | Advt 12/2026 | Pass |
| 15/09 Advt 12/2024 Junior Assistant next stage typing test shortlist | Result | Advt 12/2024 | Pass |
| 14/07 O.T.R. registration | Noise | - | Hold |
| Advt 23/2026 Regional Youth Welfare / Provincial Development advert | New Job | Advt 23/2026 | Pass |
| Advt 22/2026 Sports Directorate main exam advert | New Job | Advt 22/2026 | Pass |
| Advt 21/2026 State Rural Development Institute (senior instructor) | New Job | Advt 21/2026 | Pass |
| Advt 20/2026 Advocate General Office (computer cadre) | New Job | Advt 20/2026 | Pass |
| Advt 19/2026 Junior Engineer (Agriculture) | New Job | Advt 19/2026 | Pass |
| Advt 18/2026 Veterinary Pharmacist | New Job | Advt 18/2026 | Pass |
| Advt 17/2026 Livestock Extension Officer | New Job | Advt 17/2026 | Pass |
| Advt 16/2026 Preliminary Eligibility Test (PET) | New Job / Exam | Advt 16/2026 | Pass |
| Commission exam and interview calendar | Noise | - | Hold |
| Advt 16(4)/2016 Directorate of Training & Employment (old) | Noise | - | Hold |

## Proposed config (JSON, not applied)
```json
{
  "id": "upsssc", "name": "UPSSSC", "runner": "india", "tier": "FREE", "level": "state",
  "type": "html",
  "legacyTls": true,
  "url": "https://upsssc.gov.in/Default.aspx",
  "selector": "ul.top_slider li a, ul.Live_Adverts li a",
  "minTitle": 15,
  "limit": 60
}
```
(Change 2 is optional: removing render/waitFor and adding legacyTls. If BatLee prefers no change, just raise the limit to 60 and keep render.)

## Uncertain points
- Titles are truncated by the site ("..") so the post name can be cut; the advert number is always intact. Full title exists in the link title attribute but the scanner has no option to use it (no titleFromHref equivalent for title attr).
- Not checked: whether the admit card portal lists new cards for free; the sorter may need the commission admit card notices from the homepage list only.
- Candidate-only pages (admit card download, result lookup) are behind forms.

## BatLee's corrections
- none yet

## Repairs
- none
