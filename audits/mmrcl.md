## BATCH SUMMARY BLOCK
```
SITE: Mumbai Metro (MMRCL) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (only an advertisements feed exists; no results/admit-card/notice feed seen)
ASK BATLEE: none
```

# Mumbai Metro Rail Corporation (MMRCL)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Advertisements (JSON API behind recruitment.mmrcl.com) | https://portal.mmrcl.com/en/api/advertisement-public-list/ | free, json, itemsPath results | FREE-OK (3 of 3 scanner runs identical, 8 items) |
| Recruitment portal (React SPA, fallbackLink) | https://recruitment.mmrcl.com/en | HTTP 200, JS shell only | used only as fallback link |

PDF links (mmrcl-development.s3.amazonaws.com, "private" path) return HTTP 403 when fetched directly: PDFs do NOT download free. The API item also gives a signed URL (aws_file_url, valid 3 h) but the scanner does not use it; the fallbackLink is used for humans. One item has file_exists=false.

## What the scanner catches / misses
Catches all 8 advertisements in the API (whole list; API has count 8, no paging). Misses: nothing found. No results/admit card/notice feed exposed by the API; these seem not to be published on this portal.

## Posting speed and stability
Only about 1 to 2 ads per quarter (2026: Jan 28, May 27). Limit 40 is ample. Links are stable filenames (no flood risk); seen state already holds all 8.

## Label pattern
Titles are inconsistent: "Recruitment Advertisement 2026 - 02", "MMRCL Rect Advt 01/2026", "MMRCL/HR-Rect./ 2025-03". The API also has `adv_no` (e.g. MMRCL/HR-Rect./202605), which is the reliable parent key, plus last_date_submission, status (open/closed), total_jobs, post_advertisement. Note the title numbering and adv_no differ (title "2026 - 02" = adv_no 202605). Sorter should use adv_no or the PDF text, not the title number, as parent. Type is always New Job.

## Hold / pass rules for the sorter
- Pass: every item (new advertisement = New Job). Check last_date_submission; status "closed" on a brand-new item would mean stale.
- Hold: deputation-only or consultant-only advertisements (MMRCL sometimes advertises deputation posts; read the PDF), tenders.
- Duplicate adv_no (202506 appears for both 2025-01 and 2024-04) is a data quirk in the source, not a repost.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment Advertisement 2026 - 02 | New Job | MMRCL/HR-Rect./202605 (19 posts, closed 26 Jun 2026) | Pass (old) |
| MMRCL Rect Advt 01/2026 | New Job | MMRCL/HR-Rect./202601 (6 posts) | Pass (old) |
| MMRCL Rect Advt 05/2025 | New Job | MMRCL/HR-Rect./202512 (1 post) | Pass (old) |
| MMRCL Rect Advt 04/2025 | New Job | MMRCL/HR-Rect./202511 (1 post) | Pass (old) |
| MMRCL/HR-Rect./ 2025-03 | New Job | MMRCL/HR-Rect./202509 (4 posts) | Pass (old) |
| MMRCL/HR-Rect./ 2025-02 | New Job | MMRCL/HR-Rect./202505 (23 posts) | Pass (old) |

## Proposed config
No change. Current entry (sources.json id mmrcl): type json, itemsPath results, titleField title, linkField attach_pdf, fallbackLink https://recruitment.mmrcl.com/en, allowedHosts [mmrcl-development.s3.amazonaws.com], limit 40.

## Uncertain
- PDFs are 403 for direct download; sorter must read the PDF via the signed aws_file_url from the API (valid 3 h) or the portal. Not tested beyond the 403 on the plain link.
- Title-vs-adv_no mismatch noted above.

## BatLee's corrections
- none yet

## Repairs
- none
