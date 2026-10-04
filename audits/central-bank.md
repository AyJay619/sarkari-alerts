## BATCH SUMMARY BLOCK
```
SITE: Central Bank of India Recruitment | VERDICT: FIX
PROPOSED: 1) change url to https://centralbank.bank.in/en/recruitments (old centralbankofindia.co.in redirects there; no-www works, rebaseline on first run)
PROPOSED: 2) add "timeoutMs": 15000 (optional; site answers in under 1s)
MISSING TODAY: nothing found (page lists 16 newest-first, all caught; 16 is one full page, 30 days of postings fit easily)
ASK BATLEE: none (links are .zip bundles, not PDFs; the sorter must open the zip - recommend keeping them, they are the real notices)
```

# Central Bank of India Recruitment
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, proposal only; no config changed)

## Pages watched and tested
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitments (main) | https://www.centralbankofindia.co.in/en/recruitments (current) | free fetchItems | FREE-OK, but 301-redirects to centralbank.bank.in |
| Recruitments (proposed) | https://centralbank.bank.in/en/recruitments | free fetchItems | FREE-OK, 16 items, 70-600 ms |
| Recruitments with www.centralbank.bank.in | works too (links come back with www) | free | OK, but the no-www form matches the site's own links |
| http://www.centralbankofindia.co.in | connect timeout | - | FAILED (use https) |
| Recruitments page 2 (?page=1) | https://centralbank.bank.in/en/recruitments?page=1 | curl | 200, 16 more rows (older); not needed |
| Public notices | https://centralbank.bank.in/en/public-notices | curl | 200, different layout, no recruitment rows; not proposed |

Tested 4 repeats of the current config: 16 items every time, no flakiness. Verdict FREE, 0 credits.

## Scanner catch vs miss
- Rows: `li` with views-field-title and a body link ("Click here for details"). Each row = title + one link; body also carries "Last date" text (not captured; fine).
- Newest first, 16 per page. Seen file holds 16, matching the page, no flood risk. Limit 60 is more than enough.
- Missed: nothing found. Public-notices page not job related.
- Link stability: links are relative /sites/default/files/*.zip|pdf; stable. Seen check ignores www/http, so the URL change only rebaselines.
- Most notices are .zip bundles (notification + annexures), a few are direct PDFs. One link goes off-site (cfsl.in, subsidiary careers).

## Label pattern
Title is free text, no type prefix. Rules for the sorter:
- "Recruitment of <post> ..." / "Advertisement for Recruitment of ..." = New Job. Parent = the post name, e.g. "Specialist Officers JMGS-I CRP SPL XV 2026-27", "PO JMGS-I CRP PO_MT XV 2026-27", "Credit Officer JMGS-I (MST) PGDBF".
- "Declaration of Final Result ..." / "List of Shortlisted ..." = Result. Parent = the recruitment named in the title (IT, Risk & CA; AGM Specialist).
- "Notification of Documents Verification ..." = Update (document verification schedule, PASS). Parent = e.g. "CRP CSA XV 2026-27".
- "... Conduct of Interview" = Update (interview schedule).
- Body text "Last date: dd/mm/yyyy" gives the closing date (open the zip/PDF for details).

## Hold / pass rules (for the sorter, no script filters)
HOLD: retired PSB officers engagement (Inquiry Authority, CONCOR empanelment, incl. its result and interview notices), counsellors / BC supervisor / FLCC / RSETI faculty (small contract roles), "officer on contractual basis" (CBI-SUAPS), director appointment at IIBM (deputation-type), CFSL subsidiary careers link (off-site), HR facilities page, Hindi duplicates (/hi/ pages).
PASS: regular recruitments (Company Secretary SMGS-V, Specialist Officers, PO, Credit Officer, CRP CSA clerks), final results of regular recruitments (IT/Risk/CA, AGM), document verification / reserve list notices, corrigenda / extensions.
Existing config excludes "compassionate|qualified|roll no|unique id": keep.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment of Company Secretary in SMGS-V (last date 10.10.2026) | New Job | Company Secretary SMGS-V | Pass |
| Notification for Appointment of Director in IIBM, Guwahati | New Job (deputation-type) | IIBM Director | Hold |
| Recruitment of Credit Officer JMGS-I (MST) PGDBF, onboarding 05.10.2026 | New Job | Credit Officer JMGS-I PGDBF | Pass |
| Engagement of BC Supervisor, Meerut Region | New Job (small contract) | BC Supervisor Meerut | Hold |
| Empanelment of Retired officers as Inquiry officers (CONCOR) | Notice | CONCOR IO empanelment | Hold |
| Counsellors for Financial Literacy Centers, Ambikapur Region | New Job (contract) | FLCC Counsellors 2026-27 | Hold |
| Recruitment for Dept of Accounts/IT/CS of CFSL (off-site) | New Job (subsidiary) | CFSL | Hold |
| Engagement of retired PSB officers, Inquiry Authority - Final Result | Result | IA retired officers | Hold |
| Recruitment of Specialist Officers JMGS-I CRP SPL XV 2026-27 Residual | New Job | CRP SPL XV 2026-27 | Pass |
| Declaration of Final Result: Officer in IT, Risk Mgmt, CA_Taxation | Result | Specialist Officers IT/Risk/CA | Pass |
| Retired PSB officers Inquiry Authority - Conduct of Interview | Update | IA retired officers | Hold |
| Declaration of Final Result: AGM Specialist (Risk, F&A, Credit) | Result | AGM Specialist | Pass |
| Advertisement for Officer on Contractual Basis (CBI-SUAPS) | New Job (contract) | CBI-SUAPS | Hold |
| Documents Verification of CRP CSA XV Reserve List (Phase-I) | Update | CRP CSA XV 2026-27 | Pass |
| Recruitment of PO JMGS-I CRP PO_MT XV 2026-27 Residual | New Job | CRP PO_MT XV 2026-27 | Pass |
| Shortlisted candidates for contractual posts, RSETI Gwalior/Morena/Bhind | Result | RSETI contract posts | Hold |

## Proposed config (JSON)
```json
{
  "id": "central-bank",
  "name": "Central Bank of India Recruitment",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "html",
  "url": "https://centralbank.bank.in/en/recruitments",
  "rowSelector": "li:has(div.views-field a)",
  "rowTitle": "div.views-field-title",
  "rowLink": "div.views-field a[href]",
  "exclude": "compassionate|qualified|roll no|unique id",
  "timeoutMs": 15000,
  "limit": 60
}
```

## Uncertain points
- Works today without the change (redirect is followed), so FIX is for robustness: if the old domain is retired the source breaks.
- Whether the old domain will keep redirecting is unknown.
- Zip bundles: contents not opened in this audit.

## BatLee's corrections
- none yet

## Repairs
- none
