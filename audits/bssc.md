## BATCH SUMMARY BLOCK
SITE: BSSC (Bihar) | VERDICT: FIX
PROPOSED: 1) bssc: set "render": false (plain free fetch works, 0.5s vs 2s browser; same 30 items, same links, so no rebaseline needed beyond what the scanner does itself); 2) add "timeoutMs": 15000
MISSING TODAY: nothing found (NoticeBoard is the one page that lists everything, newest first; no separate results/recruitment pages exist, others 404)
ASK BATLEE: none

# BSSC (Bihar Staff Selection Commission)
Audited: 2026-10-04 | Group: FREE | Status: proposal (batch mode, nothing applied)

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Notice Board (everything: advts, admit cards, results, corrigenda, court notices) | https://bssc.bihar.gov.in/NoticeBoard.htm | plain free fetch, no render; 6 repeats all OK, 0.4-0.5s, identical 30 links each time | FREE-OK |
| Home page | https://bssc.bihar.gov.in/ (index.php) | free, 200; only a menu (Notice Board, Letters, Working) and login box, no notices | no use |
| Advertisement.htm, Result.htm, Recruitment.htm | same host | 404 | do not exist |
| http:// version | http://bssc.bihar.gov.in/NoticeBoard.htm | ECONNRESET | FAILED, use https |
| www version | https://www.bssc.bihar.gov.in/ | DNS not found | FAILED, use no-www https |

The current config has "render": true (pinned Chromium). It works, but the page is static HTML (446 KB, 934 PDF links) and a plain fetch returns exactly the same items. Render is unnecessary, slower and heavier.
ScrapFly: not needed. Cost 0 credits.
PDFs: links are https://bssc.bihar.gov.in/Advertisement/<file>.pdf (also a few under /Notices/ for 2018 items); same free host.

## What the scanner catches vs misses
Row selector `table tr:has(a[href*='Advertisement/'])` gives 712 rows in total (2016 to now; 29 rows from 2026). limit 30 covers the newest ~4 months of notices; page is sorted newest first, so new items always land at the top. Posting speed: about 2-6 notices a month, far below the limit of 30, so no risk of missing items between scans. Old items (2016-2018) use `Notices/` links and are not matched, which is fine.
Link stability: links are fixed file names with a numeric prefix, no session tokens. Identical across 6 fetches. No flood risk.
Note: the title is the whole row text, so it includes "Click Here to Apply / View Detailed Advertisement" fragments. This is harmless (the seen check uses title+link); when a row is edited later to add a link text it could re-fire once (the title changes).
Row "tender" exclude: no tender rows found in the current list; harmless, can stay.

## Label pattern
Title starts with date DD-MM-YYYY, then the advt number, then text.
- `<DD-MM-YYYY> <AdvtNo> Important Notice Regarding Adv No.- <AdvtNo>, Post- <Post name> ...`
- Advt no. forms: NN/YY (02/25), NN/YYYY (02/2022), NN/YY(A) (02/23(A)), plus legacy 8-digit (16010116, 21010116) and 704/2004.
- PARENT = "BSSC Adv <AdvtNo> <Post>" e.g. "BSSC Adv 02/25 Welfare Organiser and LDC (Sainik Kalyan Nideshalaya)", "BSSC Adv 02/23(A) Second Inter Level CCE", "BSSC Adv 02/2022 Office Attendant (Science & Technology Dept)".
- Type words: "Final Result" / "P.T Result" / "Result" = Result; "Download Admit Card" or "admit card" = Admit Card; "Corrigendum", "Date Extension", "Scrutiny of Documents", "Typing test", "Revised Schedule" = Update; "आदर्श उत्तर" = Answer Key; "Click Here to Apply ... View Detailed Advertisement" = New Job (the advertisement notice itself).
- Hindi 02/2022 titles (विज्ञान, प्रावैधिकी एवं तकनीकी शिक्षा विभाग ... कार्यालय परिचारी) are the ONLY text for that advertisement, not Hindi duplicates: keep. Key words: परीक्षाफल = result, मुख्य परीक्षा = main exam, संवीक्षा = document scrutiny, आदर्श उत्तर = answer key.

## Pass / hold rules for the sorter
Hold (site specific): "Advocate Panel" invitations, helpdesk / mail id change notices, notices about High Court CWJC orders (case compliance, e.g. CWJC 10555/2018, 12195/2025) unless they set a new schedule, "List of Not Eligible Candidates" only if candidate-wise lists carry no action (see uncertain).
Hold (standing): consultants, tenders, RTI, deputation, promotion, time tables, press notes.
Pass: new advertisements, admit cards, results (PT, main, final), answer keys, corrigenda, date extensions, document scrutiny schedules, typing / skill test schedules.

## Sample links (audit day, newest first)
| Title (short) | Type | Parent | Pass/Hold |
|---|---|---|---|
| 01-08-2026 02/2022 ... कार्यालय परिचारी पद की अंतिम परीक्षाफल ... | Result | BSSC Adv 02/2022 Office Attendant | Pass |
| 28-07-2026 02/2022 ... प्रमाण-पत्रों की संवीक्षा में अनुपस्थित अभ्यर्थी | Update | BSSC Adv 02/2022 Office Attendant | Pass |
| 22-07-2026 02/2022 ... प्रमाण-पत्रों की संवीक्षा | Update | BSSC Adv 02/2022 Office Attendant | Pass |
| 03-07-2026 Important Notice Regarding Helpdesk Mail Id | Noise | - | Hold |
| 02-07-2026 704/2004 Notice Regarding Adv No. 704/2004, Post S.I. (CWJC) | Update | BSSC Adv 704/2004 SI | Hold (court case, see uncertain) |
| 25-06-2026 02/2022 ... संवीक्षा (Prapatra-1) | Update | BSSC Adv 02/2022 Office Attendant | Pass |
| 25-06-2026 Inviting Application for Formation of Advocate Panel | Noise | - | Hold |
| 04-06-2026 02/2022 ... आदर्श उत्तर Set A-D | Answer Key | BSSC Adv 02/2022 Office Attendant | Pass |
| 18-05-2026 02/2022 ... सम्बन्धी आवश्यक सूचना | Update | BSSC Adv 02/2022 Office Attendant | Pass |
| 15-05-2026 01/25 List of Not Eligible Candidates (Sub Statistical Officer / Block Statistical Officer) | Update | BSSC Adv 01/25 SSO/BSO | Pass |
| 15-05-2026 कार्यालय परिचारी (विशिष्ट) CWJC 12195/2025 compliance | Update | BSSC Adv 06/25 Office Attendant (Special) | Hold/check |
| 14-05-2026 02/2022 ... मुख्य परीक्षा ... admit card | Admit Card | BSSC Adv 02/2022 Office Attendant | Pass |
| 07-05-2026 16010116 Notice Regarding CWJC 10555/2018 | Noise | - | Hold |
| 04-05-2026 08/25 Notice Regarding Adv No. 08/25, Post Sports Trainer | Update | BSSC Adv 08/25 Sports Trainer | Pass |
| 17-04-2026 704/2004 Notice, Post S.I. | Update | BSSC Adv 704/2004 SI | Hold (court case) |
| 02-04-2026 02/25 Final Result, Welfare Organiser and LDC | Result | BSSC Adv 02/25 Welfare Organiser and LDC | Pass |
| 16-03-2026 02/25 Scrutiny of Documents (Revised Schedule) | Update | BSSC Adv 02/25 Welfare Organiser and LDC | Pass |
| 13-02-2026 02/23(a) Corrigendum, Second Inter Level CCE | Update | BSSC Adv 02/23(A) Second Inter Level CCE | Pass |
| 22-01-2026 03/25 P.T Result, Field Assistant (Agriculture) | Result | BSSC Adv 03/25 Field Assistant | Pass |
| 13-01-2026 02/23(a) Date Extension, Second Inter Level CCE | Update | BSSC Adv 02/23(A) Second Inter Level CCE | Pass |

Last new-job notice on the page: 25-09-2025 (08/25 Sports Trainer); the board has had no new advertisement for about a year, so a quiet scan is normal.

## Proposed config (replace the existing bssc entry)
```json
{
  "id": "bssc",
  "name": "BSSC (Bihar)",
  "runner": "india",
  "tier": "FREE",
  "level": "state",
  "type": "html",
  "url": "https://bssc.bihar.gov.in/NoticeBoard.htm",
  "rowSelector": "table tr:has(a[href*='Advertisement/'])",
  "rowTitle": "self",
  "rowLink": "a[href*='Advertisement/']",
  "exclude": "tender",
  "minTitle": 10,
  "limit": 30,
  "timeoutMs": 15000
}
```
(only change: "render": true removed, "timeoutMs": 15000 added.) Rebaseline is not needed: the same 30 titles and links come out; the seen file already holds them.

## Uncertain points
- Court-order notices (CWJC): hold by default, but one that gives a new exam/result date should pass. The sorter should open these PDFs when unsure.
- The new-job notices contain the apply link text inside the row title; if BSSC later edits a row (adds a link) the title changes and it may alert once more. Harmless.
- Whether render=true was originally added for a reason (e.g. an earlier blocked fetch): today plain fetch is fine from this PC, 6 of 6 OK. The GitHub / other runner network was not tested (runner is "india", i.e. this PC), so confirm on the first live scan; if it fails, set render back to true.

## BatLee's corrections
- none yet

## Repairs
- none
