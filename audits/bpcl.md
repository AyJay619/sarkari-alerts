## BATCH SUMMARY BLOCK
```
SITE: BPCL Careers | VERDICT: OK
PROPOSED: none
MISSING TODAY: text-only "UPDATE AS ON <date>" lines (last-date extensions, CBT dates) have no link, so they are not caught; the "Apply Online" and travel-reimbursement links are excluded on purpose
ASK BATLEE: none
```

# BPCL Careers (bharatpetroleum.in)
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Job Openings (the only recruitment notice page; one table "main-tbl", 10 rows) | https://www.bharatpetroleum.in/careers/job-openings | free fetch via fetchItems | FREE-OK, 28 items, 0.9-1.2 s, 5/5 runs identical |

http and no-www 301 to https://www (works). Server-rendered HTML, no JS needed. /careers/careers.aspx is a general careers landing page, nothing to add. Older cycles (Jan 2025 entry level, R&D / Renewable fixed term) are inside HTML comments, so not live and not caught (correct).

## What the scanner catches vs misses
Catches every link in the table that is not an Apply / travel-reimbursement link: advertisements, corrigenda, information handouts, call letters (ibps), results (PDF and the ebiz.bpc.co.in login link), shortlists.
Misses: "UPDATE AS ON dd.mm.yyyy" paragraphs that only carry text (e.g. last date extended, CBT date announced, "process for Medical Officer still ongoing"). A date extension therefore does not reach the catch file; an admit card / result / corrigendum with a link does.
Today's catch includes one item not yet in the seen list: the shortlist for the skill / proficiency test, Kochi and Mumbai Refinery (SHORTLIST-SKILL-TEST-KOCHI-and-MUMBAI-REFINERY.pdf). It is a real new result-type update.
Posting speed: no dates on the links; the newest cycle is at the top of the table. 28 items vs limit 100, so no cap problem.
Link stability (flood check): static PDF URLs under /images/files/, stable over 5 runs. One ibps call-letter link carries an appid token and the ebiz login link repeats under several rows (same link, different title prefix, so the seen key differs). The shared result PDF result-for-cbt-held-on-17-08-2025.pdf appears under both entry-level and mid/senior rows (duplicate, harmless). No flood risk seen. Old rows can drop off the page when BPCL tidies it; that only removes items, nothing new appears.

## Label pattern
Title = "<Recruitment row heading>: <link text>" (scanner builds it from column 2 of the row).
- Row headings are generic and repeat across cycles: "Recruitment for Entry Level Roles", "Recruitment for Mid/Senior Level Roles", "Recruitment to Non-Management Posts in Kochi Refinery & Mumbai Refinery", "Recruitment for Fixed Term Engagement", "Advertisement for the post of Director (...)".
- Link text gives the type: "view Detailed Advertisement" = New Job; "Corrigendum to ..." = Update; "DOWNLOAD CALL LETTER (& INFORMATION HANDOUT)" = Admit Card; "VIEW RESULTS" / "shortlisted for ..." = Result; "INFORMATION HANDOUT" = general info.
- Parent must be taken from the PDF filename / ibps path, because the heading is not unique: filename date tags (july-26, May26, 23-07-2025) and ibps path (bpclmar26 = Kochi/Mumbai Refinery non-mgmt, bpcllmsmay26 = Mid/Senior May 2026, bpclapr26 = Entry level Apr 2026, bpcljul25 / bpclmay25 / bpclmar25 = the 2025 cycles).

## Hold / pass rules for the sorter
Hold: Hindi duplicates (the "(Hindi)" Director adverts); Information Handout PDFs (general info) unless BatLee says otherwise; "Fixed Term Engagement" (FTE-HANA) adverts - fixed-term/contract engagement, hold as contract role unless a regular-scale post; the ebiz.bpc.co.in "VIEW RESULTS" login link when it is the same link already seen (no PDF content); Director-level (board) adverts are normal jobs, pass but flag as senior.
Pass: Detailed Advertisements (new jobs, including ESM-reserving ones), corrigenda, call letters (admit cards), result PDFs and shortlists, new cycle ads for non-management posts.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Kochi & Mumbai Refinery Non-Mgmt: view Detailed Advertisement (BPCL-KR-and-MR-NON-MGMT-RECT-NOTIFICATION-july-26.pdf) | New Job | Kochi & Mumbai Refinery Non-Mgmt Posts Jul 2026 | Pass |
| ...: list of candidates shortlisted for skill / proficiency test | Result | same | Pass (new today) |
| ...: DOWNLOAD CALL LETTER (ibps bpclmar26) | Admit Card | same | Pass |
| ...: DOWNLOAD INFORMATION HANDOUT | Info | same | Hold |
| Director (Refineries), BPCL: Advertisement (English) | New Job | Director (Refineries) May 2026 | Pass |
| Director (Refineries), BPCL: Advertisement (Hindi) | Hindi dup | same | Hold |
| Mid/Senior Level Roles: view Detailed Advertisement (May26) | New Job | Mid/Senior May 2026 | Pass |
| Mid/Senior Level Roles: Corrigendum | Update | Mid/Senior May 2026 | Pass |
| Mid/Senior Level Roles: DOWNLOAD CALL LETTER & INFORMATION HANDOUT (bpcllmsmay26) | Admit Card | Mid/Senior May 2026 | Pass |
| Entry Level Roles: view Detailed Advertisement (bpcl-entry-level-advertisement.pdf) | New Job | Entry Level Apr 2026 | Pass |
| Entry Level Roles: Corrigendum (corrigendum-entry-level-profiles-may26.pdf) | Update | Entry Level Apr 2026 | Pass |
| Entry Level Roles: DOWNLOAD CALL LETTER (bpclapr26) | Admit Card | Entry Level Apr 2026 | Pass |
| Entry Level Roles: VIEW RESULTS (ebiz login) | Result | Entry Level 2026 | Pass (link only, check portal) |
| Director (Operations & Business Development), BPRL: Advertisement (English) | New Job | Director Ops & BD, BPRL | Pass |
| Director (Operations & Business Development), BPRL: Advertisement (Hindi) | Hindi dup | same | Hold |
| Fixed Term Engagement: view Detailed Advertisement (FTE-HANA-ADVERTISEMENT.pdf) | New Job | Fixed Term Engagement (HANA) | Hold (contract) |
| Entry Level Roles: VIEW RESULTS (FINAL-RESULTS-CBT-5-10-2025-BRAND-AND-PR.pdf) | Result | Entry Level Jul 2025 | Pass (old cycle) |
| Entry Level Roles: view Detailed Advertisement (ADVERTISEMENT-ENTRY-LEVEL-23-07-2025.pdf) | New Job | Entry Level Jul 2025 | Pass (old cycle) |
| Mid/Senior Level Roles: view Detailed Advertisement (LATERAL - ADVERTISEMENT - BPCL.pdf) | New Job | Mid/Senior 2025 | Pass (old cycle; lateral hiring, but open to all experienced applicants) |

## Proposed config (current, unchanged)
```json
{
  "id": "bpcl", "name": "BPCL Careers", "runner": "india", "tier": "FREE", "level": "central",
  "type": "html", "url": "https://www.bharatpetroleum.in/careers/job-openings",
  "selector": "table.main-tbl a[href]", "contextClosest": "tr", "contextFind": "td:nth-child(2) p",
  "minTitle": 10, "exclude": "travel reimbursement|apply online", "limit": 100
}
```

## Uncertain points
- Text-only date-extension updates cannot be caught by a link scanner; a page-text change check would be needed (not in scanner options), so not proposed.
- Whether FTE (fixed term engagement) roles count as holdable contract jobs depends on BatLee's taste; marked Hold as a contract role by the standing rule.
