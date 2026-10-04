## BATCH SUMMARY BLOCK
```
SITE: Bank of Baroda | VERDICT: FIX
PROPOSED: 1) Add FREE source "bob-updates" = same URL/extraCerts/jsonInPage as bob, titleField "latestUpdate", linkField "cta", limit 600, rebaseline (69 rows today; catches call letters, results, shortlists, addenda on existing posts).
PROPOSED: 2) Keep the existing "bob" source unchanged (works, 5 of 5 fetches OK, ~0.3 s, 391 items stable). Optional: drop the "exclude" regex from sources.json and hold FLC / guest players in the sorter instead (standing rule: no keyword filters) - 60 rows today.
MISSING TODAY: status updates on already-posted advts (call letters, results, shortlists, addenda) because the title never changes - they live in the "latestUpdate" field; no separate results page exists.
ASK BATLEE: bob-updates titles carry no parent (e.g. "Final Result Declared"): sorter must take the parent from the link/slug - OK? Recommend yes. Also ~15 of 69 rows are post-selection noise (offer letters, project completed, compensation negotiation) - hold in sorter, recommend yes.
```

# Bank of Baroda
Audited: 2026-10-04 | Group: FREE | Status: ACTIVE (batch audit, no config changed)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Current Opportunities (all recruitment notices) | https://bankofbaroda.bank.in/career/current-opportunities | free, https, extraCerts globalsign-gcc-r46-ov-tls-ca-2025.pem, JSON embedded in page (glblMasterCareerDetails) | FREE-OK (5 of 5 fetches, 0.3-0.6 s) |
| Career landing | https://bankofbaroda.bank.in/career | free | loads, no list data; nothing to add |
| /career/results, /career/recruitment-results | guessed, 404 | - | do not exist; results are shown inside the notices (latestUpdate field) |

The page holds 451 records; the scanner returns 391 (the existing exclude drops FLC / counsellor / guest players, 64 rows by regex on titles). Records are newest first. Fields: prfile (title), cta (link), Advtno (85 rows), lDate (last date), vacan (vacancies), latestUpdate (69 rows), apCta (1 row, ibps registration link).

## What the scanner catches vs misses
- Catches: every new advertisement (new row = new title+link). Posting speed: new rows appear on the page itself, no lag seen; limit 600 is above 451.
- Misses: updates on an existing post. BoB changes the "latestUpdate" text of a row (e.g. "Download Call Letters for Online Exam", "Final Result Declared", "Addendum dated 06.07.2026", "Candidates shortlisted for Interview") and the title stays the same, so the seen check never fires.
- Flood check: links are stable slugs (same across 5 runs); an addition of bob-updates baselines on its first run, so no flood.

## Label pattern
- Title = "Recruitment of <post group> on <regular|contractual|contract|fixed term> basis for <Department> - BOB/HRM/REC/ADVT/<year>/<n>". Advt number is in the title for about 85 rows, not all (RSETI / BC coordinator / faculty posts have none).
- PARENT for the sorter: "BoB Advt <n>/<year> - <Department>" (one advt number covers several departments, e.g. 2026/15 has six posts), else the title minus "Recruitment of ... on contractual basis".
- bob-updates rows: title is only the status text, parent must come from the link slug.
- Regular (non-contract) posts: "on regular basis" in the title. Contractual / fixed term / contract = often small or specialist roles.

## Hold / pass rules for the sorter
Hold: FLC / financial literacy counsellor, guest players / sportspersons retainership (not the "Meritorious Sportspersons in clerical cadre" regular recruitment, which PASSES), RSETI faculty / attender / watchman / office assistant / peon on contract, BC coordinator / business correspondent coordinator, Agency for Specialised Monitoring (ASM), invitations to submit quote, retired government officials as panel members, single senior contract roles (CTO, MD & CEO, SVP, key management personnel) unless BatLee wants them, faculty at BSVS / RSETI, "Project Completed", "Offer Letters / Offer of Engagement / Appointment Issued", "Compensation Negotiation is in Process", "Screening is underway / in process", "Interview Result to be declared".
Pass: regular recruitments (Local Bank Officers, professionals on regular basis, clerical cadre sportspersons, apprentices), contractual professional recruitments in departments (large advts, e.g. 2026/05, 2026/06, 2026/08, 2026/11 - sorter judgement, small numbers may be held), and in bob-updates: call letters, written / final / interview results, shortlists, interview scheduled, wait list released, addendum / corrigendum / extension.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Recruitment of Professionals on regular basis for Wealth Management Services Dept - ADVT/2026/17 | New Job (1000) | Advt 17/2026 WMS | Pass |
| Recruitment of Professionals on regular basis for Corporate & Institutional Credit Dept - ADVT/2026/17 | New Job (100) | Advt 17/2026 C&IC | Pass |
| Recruitment of Local Bank Officers on regular basis - ADVT/2026/16 | New Job (2482) | Advt 16/2026 LBO | Pass |
| Recruitment of professionals on regular basis for Digital Banking Dept - ADVT/2026/15 | New Job (19) | Advt 15/2026 Digital | Pass |
| Recruitment of professionals on regular basis for Facility Management Dept - ADVT/2026/15 | New Job (88) | Advt 15/2026 Facility Mgmt | Pass |
| Recruitment of professionals on regular basis for Security Dept - ADVT/2026/15 | New Job (54) | Advt 15/2026 Security | Pass |
| Recruitment of Meritorious Sportspersons in clerical cadre - ADVT/2026/09 | New Job (30) | Advt 9/2026 | Pass |
| Engagement of Apprentices under the Apprentices Act, 1961 | New Job (5000) | Apprentices 2026 | Pass |
| Recruitment of Faculty on contractual basis (Godhra) | Noise | RSETI faculty | Hold |
| Appointment for post of Attender on contractual basis for RSETI, Balod | Noise | RSETI | Hold |
| Agency for Specialised Monitoring (ASM) | Noise | ASM | Hold |
| Advertisement for engagement of Retired Government Officials as panel member (SAC) | Noise | SAC | Hold |
| Recruitment of Chief Technology Officer (CTO) on fixed term - ADVT/2026/13 | New Job (1) | Advt 13/2026 | Hold (single contract role, BatLee may overrule) |
| bob-updates: Download Call Letters for Online Exam | Admit Card | Advt 16/2026 LBO | Pass |
| bob-updates: List of Candidates Shortlisted for Document Verification and Interview (11.09.2026) | Result | Advt 10/2026 C&IC regular | Pass |
| bob-updates: Addendum dated 06.07.2026 | Update | Advt 11/2026 C&IC contractual | Pass |
| bob-updates: Final Result Declared | Result | Advt 7/2026 MSME regular | Pass |
| bob-updates: Written Result Declared | Result | LBO 2025 | Pass (old cycle, sorter check) |
| bob-updates: Offer Letters Issued | Noise | various | Hold |
| bob-updates: Project Completed | Noise | various | Hold |

## Proposed config (not applied)
Existing "bob" source stays as is. New source added next to it:
```json
{
  "id": "bob-updates",
  "name": "Bank of Baroda - updates",
  "runner": "india",
  "tier": "FREE",
  "level": "central",
  "type": "json",
  "url": "https://bankofbaroda.bank.in/career/current-opportunities",
  "extraCerts": ["certs/globalsign-gcc-r46-ov-tls-ca-2025.pem"],
  "jsonInPage": "glblMasterCareerDetails",
  "titleField": "latestUpdate",
  "linkField": "cta",
  "limit": 600
}
```
Tested with the scanner's own fetchItems today: 69 items (rows with empty latestUpdate are skipped automatically). Note the seen key is title + link, so a status change on a row (e.g. "Screening is underway" to "Interview Scheduled") gives a new item; the same status repeated on the same row is not re-reported.

## Uncertain points
- Whether the existing exclude regex on the bob source should stay (standing rule says no keyword filters; harmless today).
- bob-updates items have no parent in the title; link slug is the only context. Sorter should look up the main notice by link.
- Old cycles show in latestUpdate (2025 results) - they baseline on the first run so will not flood.
- Detailed notice PDFs were not opened (not needed for the label pattern).

## BatLee's corrections
- none yet

## Repairs
- none yet
