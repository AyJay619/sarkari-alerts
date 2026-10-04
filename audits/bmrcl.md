## BATCH SUMMARY BLOCK
SITE: Bangalore Metro Careers (BMRCL) | VERDICT: OK
PROPOSED: none (current rendered-page source works; optional JSON-API route noted below, not recommended)
MISSING TODAY: nothing found (all 3 live notices caught). Caveat: every item links to the career page, not the PDF.
ASK BATLEE: none

# Bangalore Metro Careers (BMRCL)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, no config changed)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Career | https://www.bmrc.co.in/career/ | free fetch with `render: true` (local pinned Chromium, no ScrapFly) | FREE-OK, 3 items, 4.4-5.4 s, 3/3 runs identical |

- Without render the page says "No Data Found" (the list is filled in by JavaScript), so `render: true` is required. Tested: no-render = fails, no-www (`bmrc.co.in`) with render = fails (no notices), so keep `https://www.`. Plain `http://www` on port 80 not needed.
- The list comes from a JSON call: `https://www.bmrc.co.in:8282/api/users/career/togetCareers` with an `Authorization: Bearer <key>` header. The key is a public web-client key shipped inside the site's own JavaScript (not a ScrapFly key). Without it the API answers "apikey Should Not be Empty". With it: 200, 2.8 KB, ~1.2 s, same result 3/3 times. The key is NOT written here.
- No other recruitment page exists on the site (menu: About, Projects, Tender, News, Finance, Career, Vigilance, RTI). "Tender" and "News" in the menu point to `/career/#` (dead anchors). Not useful.

## What the scanner catches vs misses
- Catches all 3 notices currently listed (only 3 exist; page is small).
- Link is the career page itself for every item (the row has no `a[href]` that survives; PDF paths exist in the API as `engLinkUrl` like `/fileuploads/<id>$@!!<name>.pdf`). I could not find a working free PDF URL form (tried 3 path variants under port 8282, all 404), so PDF direct download is UNVERIFIED.
- Seen key = title|career-page-URL. Titles are unique per notification number, so new postings will be detected. A corrigendum would show as a separate row or a changed PDF on an existing row; a changed PDF on an existing row would NOT be noticed (title and link unchanged). Low risk: the site rarely has more than a handful of rows.
- Posting speed vs limit: only 3 rows total, limit 60 is far above. Flood check: state has 3 seen entries, stable across 3 runs. Rows are sorted newest first by the site.

## Label pattern
Title (after the scanner's titleReplace) = `Notification No. BMRCL/HR/<seq>/PRJ/<year>/<post name>`
e.g. `Notification No. BMRCL/HR/0004/PRJ/2026/Supervisor (Operation Safety)`.
- Parent for the sorter: `BMRCL Notification <seq>/<year> - <post name>` (e.g. "BMRCL 0004/2026 Supervisor (Operation Safety)"). Type is nearly always New Job (the page lists only recruitment notifications). Updates appear as the PDF filename containing "updated on <date>" (e.g. "...2 Posts updated on 01-06-26.pdf") - API only.
- Note the title in the scanner output joins notification number and post name; the API holds them in two fields (EngDescription = notification no, NotifocationNo = post name, confusingly).

## Hold rules (site-specific)
- Standing rules apply (deputation, ex-servicemen-only, consultants, tenders, RTI, etc.). BMRCL posts are often on contract / deputation basis: HOLD any post stated as "deputation" or "retired" only; PASS normal contract/regular jobs.
- Existing exclude `compassionate|qualified|roll no|unique id` is harmless; nothing in the 3 current rows matches. (Standing rule says no keyword filters in the script; this one is already there, left as is.)

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Notification No. BMRCL/HR/0005/PRJ/2026 /Deputy General Manager ( Operation Safety) | New Job | BMRCL 0005/2026 DGM (Operation Safety) | Pass (check whether deputation-only in the PDF) |
| Notification No. BMRCL/HR/0004/PRJ/2026/Supervisor (Operation Safety) | New Job (PDF says 2 posts, updated 01-06-26) | BMRCL 0004/2026 Supervisor (Operation Safety) | Pass |
| Notification No. BMRCL/HR/0021/PRJ/2025/Asst Manager (Right to Information, Public Grievance) | New Job | BMRCL 0021/2025 Asst Manager (RTI, PG) | Pass (the post is about RTI, but it is a job, not an RTI notice; check deputation in PDF) |

All three have the same link: https://www.bmrc.co.in/career/

## Full proposed config
No change. Current entry (kept):
```json
{
  "id": "bmrcl", "name": "Bangalore Metro Careers", "runner": "india", "tier": "FREE", "level": "central",
  "type": "html", "url": "https://www.bmrc.co.in/career/", "render": true,
  "rowSelector": "div.metro-bonds-header2", "rowTitle": "p strong", "rowLink": "a[href]",
  "titleReplace": ["^\\d+\\)\\s*", ""],
  "exclude": "compassionate|qualified|roll no|unique id", "minTitle": 10, "limit": 60
}
```
Optional alternative (not proposed): `type: json` on the API above with `headers: {Authorization: Bearer <site key>}`, `itemsPath: results`, `linkField: engLinkUrl` + a `linkPrefix` once the real PDF host path is confirmed. It is faster (1 s, no browser) and gives PDF links, but the title would be only one of the two fields, and the site key would sit in the public repo (it is public in the site's JS anyway, but not worth it for 3 rows).

## Uncertain points
- PDF direct download: URL form not confirmed (404 on my guesses), so unknown whether free.
- The site's JS is a Next.js development build, so the layout and the API host (also a hardcoded IP `106.51.122.122:8282` appears as a fallback) could change without notice. If the scanner starts reporting "no notices found", re-check the API first.
- Row count is tiny; when the site has zero postings it shows "No Data Found" - consider `allowEmpty: true` if the scanner errors on an empty list (not seen today).

## BatLee's corrections
- none yet

## Repairs
- none
