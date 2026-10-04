# CBSE Recruitment
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (proposal pending)

## BATCH SUMMARY BLOCK
SITE: CBSE Recruitment | VERDICT: FIX
PROPOSED: 1) cbse: raise "limit" 25 -> 60 (page has 142 PDF links in several blocks; limit 25 stops inside the KVS/NVS press-release block, so the CBSE result / cancellation / deputation / KVS-NVS notice blocks below it are never seen); URL, include, minTitle, free fetch unchanged; rebaseline happens by itself on the first run
MISSING TODAY: everything after row 25 (about 117 links): cancellation and result notices (Junior Assistant, Superintendent, SAO, Under Secretary Legal), KVS/NVS Tier-2 shortlist, KVS/NVS corrigenda and public notices, deputation adverts
ASK BATLEE: none (note for the sorter: the page has no posting date; page header is not labelled by date, items are newest-first inside each block)

## Pages watched
| Page | URL | Fetch method | Verdict |
| Recruitment (all CBSE recruitment notices) | https://www.cbse.gov.in/cbsenew/recruitment.html | free fetchItems, 15 s | FREE-OK (142 PDF links, 40-330 ms) |
Also works: https://cbse.gov.in/..., http://www.cbse.gov.in/... (same page, no redirect to home). Kept the https www URL already in sources.json. Ran 2 fetches per URL version: all identical, 142 items, no flakiness. Only the recruitment page was audited (it is the one everything is posted on; no separate JS/API needed).

## ScrapFly
Not needed. Free fetch works. PDFs sit under https://www.cbse.gov.in/cbsenew/documents/ (not test-downloaded).

## Structure and posting speed
The page is one list of PDF links in blocks, each block newest-first, no dates on the page (a few titles carry "Dated : dd/mm/yyyy", the filename ends in ddmmyyyy: e.g. Result_Notice_JTO_21092026.pdf = 21/09/2026).
Blocks in order: (1) Direct recruitment DRQ2026 (results, admit card, city, answer key, corrigenda, advert) idx 0-17; (2) KVS/NVS recruitment press releases idx 18-29 (about 12 phases, new one added every 1-3 days in Aug-Sep 2026, so this block grows at the top); (3) CBSE results / cancellation notices idx 30-43; (4) KVS/NVS 2025 recruitment (advert, corrigenda, public notices) idx 44-55; (5) deputation + older result/cancellation notices idx 56+ and archive back to 2024.
A new notice enters at the top of its own block, so limit 25 sees only blocks 1-2. Limit 60 covers blocks 1-5 (idx 0-59). Link stability: links static, no session or random parts; the one oddity is "City_Intimation_DRQ2026_Tier_II_07042026%20.pdf" (encoded space, the seen check ignores that). Flood risk: first run after change rebaselines; later, only new top-of-block rows appear.

## Label pattern
Titles are free text, no fixed "<Type>: <Parent>" form. Rules for the sorter:
- Type from the first words: "Result Notice / Result Notification / Result notice" = Result; "Shortlisted Candidate" = Result; "Admit Card" in title or filename = Admit Card; "Final Answer Key / OMR and Answer Keys / Key Challenge" = Answer Key; "Vacancy Notification / Pointer Notification / Detailed Advertisement / Detailed Notification" = New Job; "Corrigendum", "Public Notice ... Extension / Correction / Modification", "Cancellation notice" = Update; "City Intimation" / "Display of City of Examination" = Update (exam schedule); "Skill Test", "Tier-2 Examination" public notices = Update.
- Parent: the post name after "for the post of ..." or the exam token in the title/filename: "DRQ2026" (CBSE Direct Recruitment 2026, adverts of 02/12/2025), "KVS & NVS Recruitment Drive 2025" (KVS/NVS 2025), or post name (Junior Assistant, Superintendent, Junior Translation Officer, Senior Accounts Officer, Under Secretary (Legal), AIAFA).
- Many titles are generic ("Public Notice Dated : 27/12/2025 (819 KB) |"): use the filename (Public_Notice_Correction_Modification_DRQ2026_27122025.pdf = DRQ2026 correction). The trailing " |" and "(819 KB)" are page junk.
- Press releases ("Press Release : KVS/NVS Recruitment Drive - 2025 (Nth Phase)") are phase-wise appointment/selection lists for KVS/NVS, not applications.

## Hold / pass rules (sorter)
HOLD: deputation posts (Pointer Notification Deputation, Details_Advertisement_Deputation, deputation results); KVS/NVS "Press Release ... Phase" notes (press notes); "Candidature cancellation" of one named person (e.g. "Cancellation ... (Shri ...)"); Notice inviting empanelment of retired officers; Young Professional (On Contract); Pre-RFP meeting for CBT; Public Notice Compensatory time PwBD only if individual; Regional Office Dubai / jurisdiction notices; question-paper structure PDFs (QP_Str_*); walk-in notice; old archive items (2024 and earlier) if ever surfaced.
PASS: DRQ2026 and KVS/NVS 2025 adverts, corrigenda, extensions, city intimation, admit card, answer key, results, shortlisted candidates; result / cancellation notices for posts in the current cycle (Junior Assistant, Superintendent, JTO, SAO, US Legal, AIAFA 2026) as Updates/Results.
No script keyword filters (per standing rule).

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
| Result Notice for the post of Superintendent (Reserve Panel) (24/09/2026) | Result | Superintendent | Pass |
| Result Notice (Junior Translation Officer) (21/09/2026) | Result | JTO | Pass |
| Public Notice : Download of Admit Card for DRQ2026 (Skill Test) | Admit Card | DRQ2026 | Pass |
| City Intimation to candidates for DRQ2026 (Skill Test) | Update | DRQ2026 | Pass |
| Result Notice for DRQ2026 (Tier-II) examination | Result | DRQ2026 | Pass |
| Final Answer Key (DRQ2026 Tier-1) | Answer Key | DRQ2026 | Pass |
| Public Notice (Admit Card) Dated : 28/01/2026 | Admit Card | DRQ2026 | Pass |
| Corrigendum Dated : 18/12/2025 | Update | DRQ2026 | Pass |
| Public Notice Dated : 22/12/2025 (extension of last date) | Update | DRQ2026 | Pass |
| Vacancy Notification Dated : 02/12/2025 | New Job | DRQ2026 | Pass |
| Detailed Advertisement Dated : 02/12/2025 | New Job | DRQ2026 | Pass |
| Press Release : KVS/NVS Recruitment Drive - 2025 (12th Phase) | Noise | KVS/NVS 2025 | Hold |
| Cancellation notice for the post of Junior Assistant (23/05/2026) | Update | Junior Assistant | Pass |
| Result Notice for the post of Under Secretary (Legal) | Result | Under Secretary (Legal) | Pass |
| Shortlisted Candidate (Tier - 2) KVS/NVS | Result | KVS/NVS 2025 | Pass |
| Recruitment of Various Teaching & Non-teaching Posts in KVS and NVS | New Job | KVS/NVS 2025 | Pass |
| Corrigendum - 3 Dated : 10/12/2025 | Update | KVS/NVS 2025 | Pass |
| Pointer Notification (Deputation, 15/01/2026) | New Job | Deputation | Hold |
| Cancellation of candidature ... (Shri Abhishek Saini) | Noise | Junior Assistant | Hold |

## Proposed config (only the changed field)
```json
{
  "id": "cbse",
  "name": "CBSE Recruitment",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://www.cbse.gov.in/cbsenew/recruitment.html",
  "include": "[.]pdf",
  "minTitle": 15,
  "limit": 60
}
```
Note: minTitle 15 drops short titles such as "Pointer Notification" no (20 chars, kept) but would drop e.g. "Accounts Officer" (16, kept) and any title under 15 chars; only archive rows are affected. Test of the proposed config with fetchItems returned the same 142 items before the limit; limit 60 yields idx 0-59.

## Uncertain
- Page lists no dates; "newest first" is inferred from filenames inside each block.
- Whether CBSE posts new notices at the top of every block was inferred from the block contents, not watched over time.
- PDFs were not opened; types come from titles and filenames.

## BatLee's corrections
- none yet

## Repairs
- none
