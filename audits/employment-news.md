## BATCH SUMMARY BLOCK
SITE: Employment News (adverts) | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found (page lists the last ~50 weekly adverts, scanner keeps all 50 real ones; the other 4 tabs hold only a policy notice and an old 2023 deputation ad)
ASK BATLEE: none (note: titles are only the organisation name + issue, so the sorter must open each PDF to see posts/dates; recommend leaving as is)

# Employment News (adverts)
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
| Advertisements (weekly issues) | https://employmentnews.gov.in/NewEmp/MoreContentS.aspx?n=WebAdvertisement | free fetch via fetchItems, 3 runs: 50 items each, 89-357 ms | FREE-OK |
| Editorial / InDepthJobs / SpecialContent / WebExclusive tabs | MoreContentS.aspx?n=<tab> | free curl | No useful notices (only "New Advertisement Policy" PDF and a 2023 deputation ad). Not worth watching. |

http:// version of the page timed out from curl (https works, keep https). PDFs download free (HTTP 200/206, application/pdf).
No ScrapFly needed.

## What the scanner catches vs misses
Page has 53 writereaddata PDF links: 50 real adverts + 3 non-advert (policy PDF, 2023 deputation ad x2) which are dropped by `include: "Issue no"`. Page spans issues 18 to 26 (1 Aug to 2 Oct 2026), so about 5-9 adverts per weekly issue; limit 60 is enough (50 on page today). Link stability: links are fixed writereaddata PDFs (name = DDMMYYYY + number); no flood risk seen across 3 runs (identical lists).
Posting speed: Employment News is a weekly roundup of ads that mostly appear first on the organisations' own sites, so this source is a backup/late catch.

## Label pattern
Scanner title: `Advertisement: <ORGANISATION / POST BODY> ( Issue no N , <date range> )`. Parent = the organisation name (upper case, sometimes with ministry suffix, e.g. "O/O THE PRINCIPAL CHIEF COMMISSIONER OF INCOME TAX, M/O FINANCE"). The title does not give post names, count or last date; the PDF must be opened. Same organisation may repeat in later issues (e.g. NDMA in issues 22 and 23, MECL in 18 and 24), which may be a re-advert of the same job or a new one - compare PDF.

## Hold / pass rules for the sorter
- Hold: deputation / lateral / promotion / retired-only / ex-servicemen-only adverts, consultants / young professionals / contract fellow roles, tenders. Employment News carries many of these (e.g. NDMA, MECL consultancy, Sainik School contractual roles), so check the PDF before passing.
- Pass: open recruitments from universities, institutes, PSUs, ministries (regular posts).
- A repeat advert of an organisation already posted: treat as Update only if the PDF shows a changed date or corrigendum, otherwise skip as duplicate.
- Items on the other tabs (policy notice, deputation ad): Hold.

## Sample links (2026-10-04)
| Title | Type | Parent | Pass/Hold |
| CENTRE FOR DEVELOPMENT STUDIES (Issue 26) | New Job | Centre for Development Studies | Check PDF |
| INDIAN INSTITUTE OF PETROLEUM AND ENERGY VISAKHAPATNAM (26) | New Job | IIPE Visakhapatnam | Check PDF |
| O/O PRINCIPAL CHIEF COMMISSIONER OF INCOME TAX, M/O FINANCE (26) | New Job | Income Tax Dept | Check PDF (may be sports quota/deputation) |
| RAJIV GANDHI INSTITUTE OF PETROLEUM TECHNOLOGY (26) | New Job | RGIPT | Check PDF |
| INDIAN INSTITUTE OF TECHNOLOGY, MANDI (25) | New Job | IIT Mandi | Pass if regular posts |
| IISER KOLKATA, MINISTRY OF EDUCATION (25) | New Job | IISER Kolkata | Pass if regular posts |
| MINERAL EXPLORATION AND CONSULTANCY LIMITED (24) | New Job | MECL | Check PDF |
| DNS REGIONAL INSTITUTE OF COOPERATIVE MANAGEMENT (24) | New Job | DNS RICM | Check PDF |
| NALANDA UNIVERSITY (24) | New Job | Nalanda University | Check PDF |
| RAMAGUNDAM FERTILIZERS AND CHEMICALS LIMITED (23) | New Job | RFCL | Check PDF |
| NIPER KOLKATA (23) | New Job | NIPER Kolkata | Check PDF |
| NTPC-SAIL POWER COMPANY LIMITED (23) | New Job | NSPCL | Check PDF |
| IIT (BHU) (23) | New Job | IIT BHU | Check PDF |
| INDIAN OIL CORPORATION LIMITED IOCL (23) | New Job | IOCL | Pass if regular posts |
| SAINIK SCHOOL NAGROTA (23) | New Job | Sainik School Nagrota | Check PDF (often contractual) |
| NATIONAL DISASTER MANAGEMENT AUTHORITY (23 and 22) | New Job | NDMA | Likely Hold (deputation) - check PDF |
| NATIONAL BOARD OF EXAMINATIONS IN MEDICAL SCIENCES (22) | New Job | NBEMS | Check PDF |
| CENTRAL ADOPTION RESOURCE AUTHORITY (22) | New Job | CARA | Check PDF (likely deputation) |
| INDO-RUSSIAN RIFLES PVT LTD (21) | New Job | IRRPL | Check PDF |
| SAINIK SCHOOL AMBIKAPUR (21) | New Job | Sainik School Ambikapur | Check PDF |

## Proposed config
No change. Current source is correct:
```json
{"id":"employment-news","type":"html","url":"https://employmentnews.gov.in/NewEmp/MoreContentS.aspx?n=WebAdvertisement","include":"Issue no","titleReplace":["^(.+)$","Advertisement: $1"],"minTitle":20,"limit":60}
```

## Uncertain
- Pass/hold per item cannot be decided from the title; only the PDF shows post type (regular vs deputation/contract). Types above are my reading of titles, not of the PDFs.
- Page keeps only about 2 months of issues; if it ever shows fewer than 50 items that is normal.

## BatLee's corrections
- none yet

## Repairs
- none
