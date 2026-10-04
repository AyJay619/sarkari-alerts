## BATCH SUMMARY BLOCK
```
SITE: CRPF Recruitment (rect.crpf.gov.in) | VERDICT: OK
PROPOSED: 1. Optional: raise "crpf" limit 40 -> 80 (page lists 36 notices after excludes today, so it sits near the cap; pinned Constable-2026 notices sit at the bottom of the list); no URL/selector change so no rebaseline
MISSING TODAY: nothing found (compassionate-appointment lists are excluded on purpose; they are hold/noise)
ASK BATLEE: none
```

# CRPF Recruitment (rect.crpf.gov.in)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitment notices (current "crpf") | https://rect.crpf.gov.in/ | free fetch via fetchItems, https, no www | FREE-OK, 36 items, 50-230 ms, 3/3 runs identical |
| Archived (not proposed) | https://rect.crpf.gov.in/Archived | free curl 200, 952 PDF links | old notices only, not worth watching |
| recruitment.crpf.gov.in | https://recruitment.crpf.gov.in/ | free curl 200 | JS app (apply / admit-card login portal), no notice list, not usable |

http://rect... (plain http) fails (000), so keep https. The homepage of rect.crpf.gov.in IS the notice list: one server-rendered page, about 60 notice rows (124 PDF links, each row has a title link plus a "Click Here to View PDF" duplicate link). The crpf.gov.in main site menu has no separate recruitment-notice page beyond this.

## What the scanner catches vs misses
- Include "Upload/Recruitment" keeps all PDF links; exclude drops compassionate lists, Appendix/Annexure, application forms, candidate instructions and the "Click Here to View PDF" duplicates. Result: 36 items. Nothing real is lost: the exclude dropped only compassionate-appointment selection lists (noise), form/annexure/appendix PDFs.
- Newest-first order, but not strictly chronological: the Constable (Technical & Tradesmen) 2026 notices (Apr-May 2026) and the Para Medical final result (Jun 2026) sit at the END of the list, below 2025 rows. With limit 40 and 36 items there are only 4 spare slots; a few new rows could push those pinned rows out of the window (harmless for the seen check, but proposed limit 80 for margin).
- Posting speed: top rows are Sept 2026 (Sports Quota recruitment 20/09 and 15/09, compassionate list 15/09), so the page is updated within days. No dates are shown as text; the date is embedded in the PDF filename (e.g. ...320092026-528 = 20/09/2026 plus a suffix).
- Link stability (flood check): static PDF URLs under /Upload/Recruitment/ with a random numeric suffix, identical across 3 runs. No flood risk. Titles repeat the English text; some are Hindi duplicates (first row, and the Constable Hindi row) that carry "::" with the English half.

## Label pattern
No type prefix. Title is the notice text: "Recruitment of <post> ... : Publication of Advertisement", "E-ADMIT CARD FOR <stage> FOR THE POST OF <post> -<year>", "Result of qualified candidates in Paper-I & II of Written Exam. (<force>)", "Answer key for the written examination ... (<force> / Keys A-D)", "FINAL RESULT OF <cadre> RECRUITMENT-<year>", "Recruitment of <post>-2026 :: <update text>" or "(Amendment dated dd/mm/yyyy)".
Parent for matching = the post + year part, e.g. "Constable (Technical & Tradesmen and Pioneer) 2026", "HC/GD and CT/GD Sports Quota 2026", "Sub Inspector (Hindi Translator) 2025", "Assistant Commandant (GD) LDCE CAPFs", "Para Medical Staff 2020".

## Hold / pass rules for the sorter
Hold: compassionate-appointment selection lists (already excluded in script), Hindi duplicates (rows starting with Devanagari that repeat an English row), Assistant Commandant/GD LDCE (limited departmental exam: hold per standing rule), Question Paper PDFs (Set 1 Paper 1/2 series A-D: info, hold unless BatLee wants them), form / appendix / annexure / instruction PDFs if any slip through, "Regarding recruitment ... LDCE" info notices.
Pass: open recruitment notices (Constable Tech & Tradesmen 2026, Sports Quota HC/GD CT/GD 2026), e-admit cards, results incl. qualified-candidate lists and final results, answer keys and objections notices (open exams), amendments / window for form correction.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment of Meritorious Sportspersons for HC/GD and CT/GD under Sports Quota : Publication of Advertisement (315092026) | New Job | HC/GD & CT/GD Sports Quota 2026 | Pass |
| Hindi version of the Sports Quota notice (320092026) | New Job (Hindi dup) | HC/GD & CT/GD Sports Quota 2026 | Hold (Hindi duplicate) |
| E-ADMIT CARD FOR PST/DV/DME/RME ... SUB INSPECTOR (HINDI TRANSLATOR) -2025 | Admit Card | SI (Hindi Translator) 2025 | Pass |
| Selection of Assistant Commandant/GD (CAPFs) through LDCE ... (Recruitment_result_291082026) | Result | AC (GD) LDCE CAPFs | Hold (LDCE) |
| Regarding recruitment for AC(GD) through LDCE in CAPFs ... | Update | AC (GD) LDCE CAPFs | Hold (LDCE) |
| LIST OF 4 QUALIFIED CANDIDATES | Result | AC (GD) CAPFs 2025 (unclear) | Pass, read the PDF |
| Result of qualified candidates in Paper-I & II of Written Exam. (CRPF) | Result | AC (GD) CAPFs 2025 | Pass |
| Result of qualified candidates in Paper-I & II of Written Exam. (BSF) | Result | AC (GD) CAPFs 2025 | Pass |
| Notice-Queries/Objections against Answer keys for Selection of AC/GD (CAPFs) | Answer Key / Update | AC (GD) CAPFs 2025 | Pass |
| Answer key for the written examination ... Assistant Commandant (GD) in CAPFs (BSF) | Answer Key | AC (GD) CAPFs 2025 | Pass |
| Question Paper Set 1 Paper 2 CRPF Series A, B, C, D | Noise (question paper) | AC (GD) CAPFs 2025 | Hold |
| Question Paper Set 1 Paper 1 GK & GS Series -A | Noise (question paper) | AC (GD) CAPFs 2025 | Hold |
| FINAL RESULT OF PARA MEDICAL STAFF RECRUITMENT-2020 | Result | Para Medical Staff 2020 | Pass |
| Recruitment of Constable (Technical & Tradesmen and Pioneer)-2026 :: Window for online application form correction | Update | Constable Tech & Tradesmen 2026 | Pass |
| Recruitment of Constable (Technical & Tradesmen and Pioneer)-2026 (Amendment dated 17/04/2026) | Update | Constable Tech & Tradesmen 2026 | Pass |
| Recruitment for the post of Constable (Technical & Tradesmen and Pioneer) (Male/Female)-2026 in CRPF | New Job | Constable Tech & Tradesmen 2026 | Pass |
| Hindi Constable recruitment notice (Recruitment Notice 104042026 (hindi)) | New Job (Hindi dup) | Constable Tech & Tradesmen 2026 | Hold (Hindi duplicate) |

## Proposed config (JSON)
```json
{
  "id": "crpf",
  "name": "CRPF Recruitment",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://rect.crpf.gov.in/",
  "include": "Upload/Recruitment",
  "exclude": "compassionate|Appendix|Annexure|Detailed Application Form|Instructions? (for|to) candid|Click Here to View PDF",
  "minTitle": 20,
  "limit": 80
}
```
Only change: limit 40 -> 80. URL and selectors unchanged, so no rebaseline. Keeping 40 also works today.

## Uncertain points
- Question-paper PDFs are held as info; if BatLee wants them, they are easy to pass.
- "LIST OF 4 QUALIFIED CANDIDATES" has no parent in the title; the sorter must open the PDF.
- Exclude word "compassionate" is a script filter that already existed (not added by this audit); it is unambiguous noise so it was left as is.
