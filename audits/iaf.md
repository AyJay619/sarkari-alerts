## BATCH SUMMARY BLOCK
```
SITE: Indian Air Force (Agniveervayu, Airmen, AFCAT) | VERDICT: FIX
PROPOSED: 1) iaf-agniveervayu: include -> "pdffiles|digialm|index\.html$" (also catches link-less notices: Phase-I result, selected-candidates list, objection portal), rebaseline. 2) iaf-airmen: include -> "pdfforms|digialm|airmen/?$" (same reason), rebaseline. 3) iaf-afcat: no change. 4) Add timeoutMs 15000 to all three (all answer in under 0.5 s).
MISSING TODAY: agniveervayu: objection-portal notice (22-23 Sep 2026 exam), Phase-I result, "List of Selected Candidates Non-Combatant 02/2026"; airmen: objection-portal notice (23 Sep 2026 exam), Phase-I result (all have no link, dropped by the include filter). AFCAT: notification PDFs and objection / exam-city / edit-window notices sit in HTML comments (not live, correctly ignored).
ASK BATLEE: none
```

# Indian Air Force (iaf)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (after proposed changes)

## Pages watched and tested
All three are plain server-rendered HTML, free fetch from this PC through the scanner's `fetchItems`, 3 runs each, no failures, 75-400 ms.

| Source id | URL | Method | Verdict |
|---|---|---|---|
| iaf-agniveervayu | https://iafrecruitment.edcil.co.in/agniveervayu/index.html | free, https | FREE-OK (19 items now, 22 after fix) |
| iaf-airmen | https://iafrecruitment.edcil.co.in/airmen/ | free, https | FREE-OK (6 items now, 8 after fix) |
| iaf-afcat | https://afcat.edcil.co.in/ | free, https (http also works; /notification is the same page, no extra info) | FREE-OK (3 items) |

http://iafrecruitment.edcil.co.in/ (root) is a tiny 2.5 KB landing page, not useful. The three sites are separate (Agniveervayu and Airmen share the EDCIL template; AFCAT is a different template).

## What the scanner catches vs misses
- Each notice is an `li` (Agniveervayu) or a bold `b` block (Airmen) with a "[CLICK HERE]" link. Links are either a PDF on the site (`pdffiles/` or `pdfforms/`) or a digialm candidate-login URL.
- PROBLEM 1: some notices have NO link (result of Phase-I "available in Candidate's Login ID", objection management portal "now live", list of selected candidates). The scanner gives such rows the page URL as link, but the current `include` filter (`pdffiles|digialm`, `pdfforms|digialm`) then drops them. These are exactly the important result / answer-key notices. Fix: add the page URL to the include pattern.
- PROBLEM 2 (unavoidable): many different notices share the same digialm login URL (admit card, city intimation, edit window, objection portal for one exam all point to the same login page). The seen key is title|link, so each distinct title is still new. Titles carry dates / intake numbers, so they are distinct. No change needed.
- Airmen page: the page also has Airmen Group X/Y notices in the full year cycle; today only Med Asst (Pharmacist) intake plus STAR exam notices are live. Notices that are inside HTML comments are not live and are ignored (correct).
- AFCAT: `#newsUp li` has 3 live items. Others (Notification for AFCAT 01/2026, 02/2026 PDFs, corrigendum, objection portal, exam-city intimation, edit window) are inside HTML comments, i.e. taken down by the site. Between cycles the page is nearly empty; the next cycle (01/2027) notification should appear here as a new `li` with a PDF link. Titles are long all-caps sentences; the "click here" strip works.

## Posting speed vs limit / flood check
- Agniveervayu: ~22 live rows, `limit` 40, new rows appear at the top. No flood risk (3 runs identical, 19 items each).
- Airmen: 8 rows, limit 40. AFCAT: 3 rows, limit 40.
- Stability: link-less rows use the page URL, so the key is title only; a site editor changing the wording of an old notice would re-flag it (low risk, rare).
- Rebaseline: changing `include` triggers the scanner's silent re-baseline for those two sources, so the 3 + 2 newly visible old items will not flood.

## Label pattern (for the sorter)
Free-text sentences, no "<Type>: <Parent>" structure. Rules:
- Parent = intake / cycle number found in the title: "Agniveervayu Intake 02/2027", "Airmen Intake 01/2027", "Airmen (Med Asst) Intake 02/2027", "AFCAT 02/2026". Musician rally and Non-Combatant are separate parents ("Agniveervayu (Musician) Intake 01/2027", "Agniveervayu Non-Combatant Intake 01/2027").
- Type keywords: "Advertisement For ..." = New Job; "Online Registration link / Applications are Invited / registration is open" = New Job (apply link, same parent as the advertisement); "Admit Card(s)" / "Provisional Admit Card" = Admit Card; "Exam Date and name of Exam City" = Update (city / exam date intimation); "Result of ..." / "List of Selected Candidates" / "cut-off declared" = Result; "Objection Management Portal ... Provisional Answer Keys" = Answer Key; "Corrigendum", "date extended", "Edit Window" = Update.
- Link tells the document: `pdffiles/Advt%20Agniveervayu%2002%20of%2027.pdf` = advertisement 02/2027; `pdfforms/Advt Airmen Med Asst 01 of 2027.pdf`. digialm `.../1258/<id>/login.html` ids: 101256 Agniveervayu 02/2027, 101431 Airmen 02/2027, 97277 / 97524 Agniveervayu / Airmen 01/2027, 101682 Musician. Same login URL is reused for admit cards, results, objections, so judge by the title, not the link.
- Titles may end with a dangling " [" (leftover of "[CLICK HERE]"); harmless.

## Hold / pass rules for the sorter
Pass: advertisements, registration open, admit cards, exam city/date intimations, results, selected / shortlist lists, answer keys / objection portal, corrigenda, extensions, edit window, rally advertisements (open, musician, non-combatant).
Hold (site-specific): mock test links, "Airmen Training", selection-centre / contact pages, general terms & conditions, "ways to reach reporting point" AFSB info PDF, mandatory-forms PDF and AFSB seat-selection notice only if BatLee does not want in-service-process notices (default: PASS as current-cycle schedule notice; it is a call-letter / schedule item). Duplicate: the same notice appears in both Agniveervayu and Airmen pages (e.g. STAR Phase-I admit card, "Admit Cards for First Batch of Phase-II Testing for Airmen and Agniveervayu"); sorter should merge. Stale/old-cycle items (Intake 01/2027 registration etc.) are only seen on the first baseline, not alerted.

## Sample links (audit day)
| Title (short) | Type | Parent | Pass/Hold |
|---|---|---|---|
| Advertisement For AGNIVEERVAYU INTAKE 02/2027 (pdf) | New Job | Agniveervayu Intake 02/2027 | Pass |
| Online Registration link for IAF Agniveervayu Intake 02/2027 (06-26 Jul 2026) | New Job | Agniveervayu Intake 02/2027 | Pass |
| Admit Card for STAR Phase-I exam Intake 02/2027 on 22 and 23 Sep 26 | Admit Card | Agniveervayu / Airmen Intake 02/2027 | Pass (duplicate on both pages) |
| Exam Date and name of Exam City ... Agniveervayu Intake 02/2027 | Update | Agniveervayu Intake 02/2027 | Pass |
| Candidates who appeared ... 22-23 Sep 2026 ... Objection Management Portal live (NO LINK) | Answer Key | Agniveervayu Intake 02/2027 | Pass (currently missed) |
| Result of Phase-I online exam for Agniveervayu Intake 01/2027 (NO LINK) | Result | Agniveervayu Intake 01/2027 | Pass (currently missed) |
| List of Selected Candidates Agniveervayu Non-Combatant (Main & S/By) Intake 02/2026 (NO LINK) | Result | Agniveervayu Non-Combatant 02/2026 | Pass (currently missed) |
| Provisional Admit Card Agniveervayu (Musician) rally Intake 01/2027 | Admit Card | Agniveervayu (Musician) Intake 01/2027 | Pass |
| Advertisement for open recruitment rally Agniveervayu (Other than Science), Chumoukedima / Sri Vijaya Puram | New Job | Agniveervayu rally 01/2027 | Pass |
| Corrigendum for Age Extension upto 22 Years, Intake 01/2027 | Update | Agniveervayu Intake 01/2027 | Pass |
| Applications invited for Agniveervayu Non-Combatant Intake 01/2027 | New Job | Agniveervayu Non-Combatant 01/2027 | Pass |
| Advertisement For AIRMEN (MED ASST) Trade Including Pharmacist Intake 02/2027 | New Job | Airmen Med Asst Intake 02/2027 | Pass |
| Exam Date and name of Exam City for Airmen Medical Assistant 02/2027 | Update | Airmen Med Asst Intake 02/2027 | Pass |
| Admit Cards for Second batch of Phase-II Testing for Airmen Intake 01/2027 | Admit Card | Airmen Intake 01/2027 | Pass |
| Objection Management Portal, Airmen exam 23 Sep 2026 (NO LINK) | Answer Key | Airmen Intake 02/2027 | Pass (currently missed) |
| AFSB seat selection for AFCAT 02/2026 from 10 to 14 Sep 2026 (+ call-up letter / mandatory forms PDF) | Update | AFCAT 02/2026 | Pass |
| Result of AFCAT 02/2026 declared (login) | Result | AFCAT 02/2026 | Pass |
| Cut-off for GATE score entry for AFCAT 02/2026 declared | Result | AFCAT 02/2026 | Pass |

## Proposed config (changes only; everything else as in sources.json)
```json
[
  { "id": "iaf-agniveervayu", "include": "pdffiles|digialm|index\\.html$", "timeoutMs": 15000 },
  { "id": "iaf-airmen",       "include": "pdfforms|digialm|airmen/?$",     "timeoutMs": 15000 },
  { "id": "iaf-afcat",        "timeoutMs": 15000 }
]
```
Tested with `fetchItems` using these include patterns: Agniveervayu 22 items, Airmen 8 items (the 4 link-less notices appear with the page URL as link). ScrapFly: not needed, 0 credits.

## Uncertain points
- Link-less notices get the page URL as link, so the sorter must open the page to see the content; acceptable.
- AFCAT page content is mostly commented out between cycles: the next AFCAT notification (cycle 01/2027) will show only if the site un-comments / adds a new `li` inside `#newsUp`. Not verifiable today.
- Airmen "Group X/Y" main recruitment is not on the page today (only Med Asst); layout of that notice unknown, but it would be a normal `b` with a pdfforms link and is covered by the include.

## BatLee's corrections
- none yet

## Repairs
- none yet
