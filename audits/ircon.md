## BATCH SUMMARY BLOCK
SITE: IRCON Careers | VERDICT: OK
PROPOSED: none
MISSING TODAY: nothing found
ASK BATLEE: none

# IRCON (Audited 2026-10-04, batch mode) | Group: FREE | Status: ACTIVE

## Pages watched and tested (scanner's own fetchItems, free fetch, 4 runs each ~3-4 s, 131 items every run, stable)
| Page | URL | Items | Verdict |
|---|---|---|---|
| Contract employment (main) | https://ircon.org/career-ircon/contract-employment | 46 | FREE-OK |
| Regular employment | https://ircon.org/career-ircon/regular-employment | 40 | FREE-OK |
| Apprentice under Act | https://ircon.org/career-ircon/apprentice-under-act | 5 | FREE-OK |
| SPV vacancies | https://ircon.org/career-ircon/spv-vacancies | 40 | FREE-OK |
Homepage and /career-ircon return 200. No pagination found on the tables (page=1 returns nothing). Links are direct PDFs under /sites/default/files/YYYY-MM/.

## What the scanner catches / misses
Catches every row of all four tables (new ads, cancellations, results, interview schedules). Nothing missing found. Total 131 items, well under limit 400. Item order is newest-first but not strictly by date; limit is not a risk.

## Link stability (flood check)
Titles and PDF links identical across 4 runs, and match state/seen-india.json. Low flood risk. Minor: a few older contract titles carry stray double quotes (e.g. "Recruitment of ... (Advt. No. C- 23/2025)"); harmless, already baselined.

## Label pattern
Title only, no dates shown. Pattern: "<Type> <post> on <Contract|regular> Basis (Advt. No. <series>/<year>)".
- Contract ads: Advt No. C-NN/YYYY. Regular: Advertisement No. NN/YYYY. SPV: IRPL/C0N/YYYY etc. Apprentice: A0N/YYYY.
- Type words: "Recruitment" = New Job; "Cancellation of recruitment" / "Revised date" / "Extension of last date" = Update; "Result", "Merit list", "Shortlisted candidates", "Result of Scrutiny" = Result; "Interview Schedule", "Walk-in" = Update (interview schedule); "Document Verification" = Update.
- Parent = Advt number plus post (e.g. "Advt C-09/2026 Manager/Legal contract"; "IRPL/C02/2026").

## Pass / hold rules for the sorter
Pass: all Recruitment ads (contract, regular, apprentice, SPV), cancellations, extensions, results, shortlists, interview and document verification schedules.
Hold: "on deputation basis" / "immediate absorption basis" posts (e.g. Manager/Civil P-Way), CEO / Additional CEO posts for SPVs by deputation or contract (CEO of Jharkhand Central Railway etc.), consultant roles, very old (2020-2023) archive items already baselined.
Note: "Recruitment on contract basis" for engineers is a normal job for the portal unless it is a single small consultant role.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Cancellation of Recruitment ... Finance Assistant (C-08/2026) | Update | Advt C-08/2026 | Pass |
| Recruitment for Manager/Legal on Contract Basis (C-09/2026) | New Job | Advt C-09/2026 | Pass |
| Recruitment of Airport Operation Expert (C-06/2026) | New Job | Advt C-06/2026 | Pass |
| Recruitment of HR Assistant (C-05/2026) | New Job | Advt C-05/2026 | Pass |
| Recruitment of Works Engineer/Civil (C-03/2026) | New Job | Advt C-03/2026 | Pass |
| Recruitment for Manager/Rajbhasha, regular, Advt 10/2026 | New Job | Advt 10/2026 | Pass |
| Cancellation ... Assistant Manager/Electrical (13/2025) | Update | Advt 13/2025 | Pass |
| Recruitment for DGM/Company Affairs, regular, Advt 04/2026 | New Job | Advt 04/2026 | Pass |
| Requirement for Manager/Civil (P-Way) on immediate absorption basis | New Job | Manager/Civil P-Way | Hold (absorption/deputation type) |
| Result for Engagement of Apprentices, Advt A02/2025 | Result | Advt A02/2025 | Pass |
| Engagement of Apprentices (Advt 02/2025) | New Job | Advt A02/2025 | Pass |
| Recruitment of various posts on Contract Basis in SPV IRPL (IRPL/C02/2026) | New Job | IRPL/C02/2026 | Pass |
| Result of Scrutiny, Company Secretary IRPL (C01/2026) | Result | IRPL/C01/2026 | Pass |
| Notification of shortlisted candidates, Finance Assistant IRPL | Result | IRPL Finance Assistant | Pass |
| Recruitment of CEO for Jharkhand Central Railway on deputation or contract | New Job | JCRL CEO | Hold (deputation) |
| Revised Date for Walk-In-Interviews, Finance Assistant (C-20/2024) | Update | Advt C-20/2024 | Pass |

## Proposed config
Keep as is (sources.json id "ircon"): url contract-employment + 3 extraUrls, rowSelector `tr:has(td.views-field-title)`, rowTitle `td.views-field-title`, rowLink `a[href]`, exclude `Apply Online|compassionate|qualified|roll no|unique id`, limit 400.

## Uncertain
- Dates are not shown on the pages; only the folder year-month in the PDF path hints at date.
- Exclude word "qualified" could drop a legit "qualified candidates" result; accepted per existing config.
