## BATCH SUMMARY BLOCK
```
SITE: MIDHANI Careers (midhani-india.in) | VERDICT: FIX
PROPOSED: 1. Edit "midhani" include to "WordPress-content.*(advt|advert|recruit|walk|corrigendum|addendum|selected|shortlist|result|admit|call-letter|interview|merit|answer)" (the current include is two-sided; this one-sided form is tested) ; 2. exclude add "|format" (drops Application Format PDFs/docs); 3. rebaseline on first run
MISSING TODAY: "Corrigendum" (GM/GGM, 04-Jun-26) and "Provisionally selected candidates for GGM & GM posts" PDFs - titles/links lack advt/recruit words so the include drops them; whole careers page has only ~6 relevant links
ASK BATLEE: none
```

# MIDHANI Careers (midhani-india.in)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Careers (current "midhani") | https://midhani-india.in/department_hrd/career-at-midhani/ | free fetch via fetchItems | FREE-OK, 0.6-1.4 s, 4/4 runs identical (2 items with current filter) |
| Homepage | https://midhani-india.in/ | free | Has only a Careers menu link and a news ticker (corporate news, not jobs); nothing to add |

Host: no-www only. www fails (TLS cert does not cover www.midhani-india.in). http times out at 15 s. Keep https no-www. PDFs download free (HEAD 200). Server-rendered WordPress, no JS needed. One external link "Click here for E-recruitment" (erecruit.ap.nic.in) is the apply portal, not watched.

## What the scanner catches vs misses
The careers page is a small static page (about 6 notice links in total, 102 links incl. menus). Unfiltered notice links today:
- MDN/HR/E/1/26 (Detailed Advertisement English, GM/GGM) - caught
- Corrigendum (GM/GGM, 04-Jun-26) - MISSED (no advt/recruit word in title or URL)
- Provisionally selected candidates for various GGM and GM posts - MISSED
- Application Format (.doc) - not caught, correct
- GAT ADVT 18 MAY 2026 (graduate/technician apprentice) - caught
- Apprentices Application Format for GAT/TAT/ITI - not caught, correct
Tested replacement include returns 4 items (the 2 above plus the 2 missed). Posting speed: notices are added into the same page; PDFs sit under a fixed "uploads/2018/11" folder, so the URL carries no date. Link stability: static PDFs, identical across 4 runs, no flood risk (page is tiny). Because titles are short and generic ("Corrigendum"), the sorter must open the PDF to find the parent.

## Label pattern
Titles are the raw link text: advertisement number ("MDN/HR/E/1/26"), "GAT ADVT 18 MAY 2026", "Corrigendum", "Provisionally selected candidates for various GGM & GM Posts." No "type: parent" prefix. Parent comes from the PDF filename/content: Detailed-Advertisement_English_GM_GGM = Advt MDN/HR/E/1/26 (GM/GGM posts); GAT-ADVT-18-MAY-2026 = GAT apprentice advt dated 18 May 2026.

## Hold / pass rules (for the sorter)
- Pass: advertisements (including apprentice advts), corrigenda, provisionally selected lists, results, call letters.
- Hold: Application Format / forms, brochures, tenders, EOIs, RFPs, contract/procurement pages, investor/financial notices, news-ticker items, Hindi duplicates.
- Note: GM/GGM posts may be lateral/deputation style at senior level; sorter should read the advert and hold if deputation-only.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| MDN/HR/E/1/26 | New Job | GM/GGM posts, Advt MDN/HR/E/1/26 | Pass (check deputation) |
| Corrigendum | Update | Advt MDN/HR/E/1/26 (GM/GGM) | Pass |
| Provisionally selected candidates for various GGM & GM Posts | Result | Advt MDN/HR/E/1/26 | Pass |
| GAT ADVT 18 MAY 2026 | New Job | GAT apprentices 2026 | Pass |
| Application Format_GM_GGM posts (.doc) | Noise | MDN/HR/E/1/26 | Hold |
| Apprentices Application Format GAT/TAT/ITI | Noise | GAT advt | Hold |
| Brochures (6 PDFs), Tenders, EOIs | Noise | - | Hold |

## Proposed config (sources.json, id "midhani")
```json
{
  "id": "midhani",
  "name": "MIDHANI Careers",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://midhani-india.in/department_hrd/career-at-midhani/",
  "include": "WordPress-content.*(advt|advert|recruit|walk|corrigendum|addendum|selected|shortlist|result|admit|call-letter|interview|merit|answer)",
  "exclude": "brochure|profile|compassionate|qualified|roll no|unique id|format",
  "limit": 30,
  "minTitle": 6
}
```
Include/exclude are regex on title+link, so "WordPress-content" in the link anchors the match to uploaded PDFs. Changing include rebaselines automatically. Note "qualified" in exclude would hide a "qualified candidates" result list; harmless today, flagged below.

## Uncertain
- Exclude "qualified" (already in config) drops "list of qualified candidates" style results; not seen on the page today, so left. Remove only if such a title appears.
- Site is rarely updated (page has 2 live notices); long quiet periods are normal, not a failure.
