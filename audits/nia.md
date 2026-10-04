## BATCH SUMMARY BLOCK
SITE: NIA Recruitment Notices | VERDICT: FIX
PROPOSED: 1) replace include/exclude with a row config (rowSelector "table.custom-table tbody tr", rowTitle "td.views-field-title", rowLink "td.views-field-secure-pdf-link a", rowStartDate/rowEndDate on the date cells); keep allowEmpty, rebaseline automatically
MISSING TODAY: everything - the link text is "View" (under minTitle 12), so the current source returns 0 items every scan; today 2 deputation notices (both HOLD) are on the page
ASK BATLEE: none (the page lists mostly deputation notices; pass only the rare open/direct-recruitment ones)

# NIA (National Investigation Agency)
Audited: 2026-10-04 | Group: FREE | Status: FIX proposed (not applied)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitment Notices | https://nia.gov.in/recruitment-notices | free fetch, 4/4 OK, http/https/www all load | FREE-OK, but 0 items under current config |
| Recruitment Notices archive | https://nia.gov.in/recruitment-notices-archive | free fetch HTTP 403 (curl and scanner) | not usable, skipped (old notices anyway) |
| Recruitment (menu hub) | https://nia.gov.in/recruitment | free OK, only links to notices / rules | no extra source needed |

## Why it catches nothing today
The table has columns S.No / Notices-Advertisements / Opening Date / Closing Date / Downloads. The only link in each row is the Downloads cell with the text "View". The scanner drops link texts shorter than minTitle (12), so nothing survives. Without include/exclude the page returns 30 menu links, which confirms the page itself loads fine. Fix is a row-based config that takes the title from the title cell.

## Test of proposed config (scanner's own fetchItems, 3 repeats, stable)
Returns 2 rows, with title, PDF link and start/end dates:
- "Filling up the posts of Ministerial staff in NIA on deputation basis." | http://nia.gov.in/secure-pdf/generate/5096 | 2026-09-25 .. 2026-11-25
- "Inviting nomination for the post of Additional Superintendent of Police and Deputy Superintendent of Police in NIA on deputation basis." | http://nia.gov.in/secure-pdf/generate/5093 | 2026-09-24 .. 2026-11-07

## Fetch / PDFs / cost
Group FREE, no ScrapFly. Page is small (about 53 KB). PDF links (secure-pdf/generate/ID) answer HTTP 403 to a plain curl, even with referer and browser UA, so the sorter probably cannot open the PDF from this PC; it must rely on the title (titles are descriptive enough) or a browser. Not tested through ScrapFly (no key, and not worth it).

## Posting speed / link stability
Only 2 rows on the page, posted 24 and 25 Sep 2026. NIA posts rarely (a few per year). Links are numeric ids (/secure-pdf/generate/5096), stable; the link is printed with http:// and the seen check ignores http/https, so no flood risk. No archive access, so old rows simply vanish from the page (allowEmpty keeps the source from erroring when the table is empty).

## Label pattern
Titles are plain sentences, no type prefix. Pattern: "<Action> the post(s) of <Post> in NIA on deputation basis" or "Recruitment of <Post> ...". Parent = the post name plus NIA (e.g. "NIA - Ministerial staff (deputation)"). The row dates (opening / closing) are given as startDate / endDate, which the scanner can use if the PDF shows no last date.

## Hold / pass rules for the sorter
- HOLD: anything "on deputation basis" / "inviting nomination" / "absorption" / "foreign service" (this is nearly everything NIA posts), retired-only or ex-servicemen-only, consultants / young professionals, tenders, RTI, Hindi duplicates, general notices.
- PASS: direct recruitment / open vacancies (e.g. Stenographer, Constable, clerk, Inspector via open exam or SSC route), results, shortlists, admit cards, corrigenda / extensions of an open recruitment.
- No keyword filters in the script.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Filling up the posts of Ministerial staff in NIA on deputation basis. | New Job (deputation) | NIA Ministerial staff, deputation | HOLD |
| Inviting nomination for the post of Addl SP and DySP in NIA on deputation basis. | New Job (deputation) | NIA Addl SP / DySP, deputation | HOLD |

## Proposed config (sources.json, id "nia")
```json
{
  "id": "nia",
  "name": "NIA Recruitment Notices",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://nia.gov.in/recruitment-notices",
  "rowSelector": "table.custom-table tbody tr",
  "rowTitle": "td.views-field-title",
  "rowLink": "td.views-field-secure-pdf-link a",
  "rowStartDate": "td.views-field-field-to-date",
  "rowEndDate": "td.views-field-field-from-date",
  "allowEmpty": true,
  "timeoutMs": 15000,
  "limit": 40
}
```
(include / exclude removed; the old exclude "compassionate|qualified|roll no|unique id" is a keyword filter and not needed. Note the site's own column labels are swapped in the HTML: "Opening Date" cell class is field-to-date; the dates tested above are correct as mapped.)

## Uncertain
- Only 2 rows were available, so the layout with 0 rows (empty table or missing table) is untested; allowEmpty should cover it.
- PDF 403: not known whether a real browser gets the PDF; the sorter may need BatLee to open it.
- Archive page 403s, so older notices (and results of NIA recruitments) are not visible through the scanner.

## BatLee's corrections
- none yet

## Repairs
- none
