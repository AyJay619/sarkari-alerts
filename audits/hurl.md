## BATCH SUMMARY BLOCK
```
SITE: HURL Recruitment (Hindustan Urvarak & Rasayan) | VERDICT: FIX
PROPOSED: 1. Repoint "hurl" from career.hurl.net.in (stale 2024 GET/DET portal) to https://jobse4.hurl.net.in/ (current E-04-2026 portal), include "/others/", drop exclude, minTitle 3, rebaseline; 2. Add FREE source "hurl-careers" = https://hurl.net.in/careers/ (rowSelector .job-card, rowTitle .job-title, rowLink "a.btn-download, a.btn-hurl-primary", allowEmpty, limit 25, rebaseline)
MISSING TODAY: the live recruitment E-04-2026 (advert + Corrigendum 1) and the Doctor walk-in E-03-2026: current source watches an old 2024 page and would only catch a new cycle if HURL reuses career.hurl.net.in
ASK BATLEE: none (note: each recruitment cycle gets a NEW portal host, e.g. jobse4; hurl-careers is the early-warning source because it lists the new portal link)
```

# HURL Recruitment
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE (proposed fix)

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Current "hurl" | https://career.hurl.net.in/ | free fetch (http redirects to https) | FREE-OK technically, 5 items, 4/4 runs identical, BUT STALE: it is the old GET-DET/2024/01 portal (registration Oct 2024). Items: CBT exam notices, FAQ, advert 2024. Nothing new since 2024-25. |
| Live recruitment portal (proposed) | https://jobse4.hurl.net.in/ | free fetch, 3/3 identical | FREE-OK, 2 items: Detailed Advertisement E-04-2026 (reg 05-08-2026 to 26-08-2026) and Corrigendum 1 (E-04-2026). |
| Careers list on main site (proposed) | https://hurl.net.in/careers/ | free fetch, 3/3 identical | FREE-OK, 2 job cards: E-04 (Executive/Non-Executive, regular + FTC, deadline 26 Aug 2026, link = jobse4 portal) and Walk-in Doctor at HQ (E-03-2026, deadline 20 Feb 2026, PDF in /media/careers/). |
| hurl.net.in noticeboard / homepage | https://hurl.net.in/page/noticeboarddisplay/ | free fetch 200 | Not useful (tenders, GeM bids, certificates). Skip. |

No-www/www not relevant (subdomains). http redirects to https. Server-rendered PHP/Django HTML, no JS needed. No ScrapFly needed; PDFs are plain links.

## What the scanner catches vs misses
Current source catches only old 2024 items (all baselined, never changes). It misses the live cycle completely. Pattern per cycle: HURL spins up a new portal host per advert (career.hurl.net.in for 2024, jobse4.hurl.net.in for 2026), and puts all notices (advert, corrigenda, admit card notices, CBT date notices, results) as `/others/*.pdf` links on that portal's home. Admit card / result links often point to external logins (hurlrecruitment.in/home/login) - not trackable. So the portal page is good for PDFs, hurl.net.in/careers/ is good for discovering a NEW portal host.
Posting speed: a new advert appears on /careers/ and the portal together; flood check: links are static file names, stable across 3 runs. No flood risk. Caveat: the /careers/ E-04 card links to the portal root (not a PDF), so a later new cycle on the same host would not look new by link; the title of each card differs, and the host changes per cycle, so fine in practice. Corrigendum on the portal is a new file link so it will be caught.

## Label pattern
Portal rows: ":: <Notice name> (<Advt no>)" e.g. ":: Detailed Advertisement (E-04-2026)", ":: Corrigendum 1 (E-04-2026)", ":: Notice regarding CBT Exam". Advt no format E-NN-YYYY (E-03 = Doctor FTC walk-in, E-04 = Executive/Non-Executive 2026), older cycle "HURL/GET-DET/2024/01". Parent = the Advt no. Strip leading ":: ". Careers cards: title is the job headline; PDF filename carries the advert (E-03-2026_walk_in...).

## Hold / pass rules for the sorter
Hold: syllabus, FAQ, objection tracker/objection notices, "Notice - 1/2" with no content (open first), admit-card-download login links, candidate lists by roll no, compassionate appointment, tenders / GeM bids, certificates (ISO), walk-in for single Doctor/consultant on contract (judgement: Medical Officer walk-in for HQ is a small contract role, hold per standing rule unless BatLee wants it).
Pass: Detailed Advertisement for regular / FTC Executive and Non-Executive posts, corrigenda / extensions / cancellations, CBT exam date and city intimation notices, admit card notices, results / shortlists.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| :: Detailed Advertisement (E-04-2026) | New Job | E-04-2026 Executive/Non-Executive | Pass |
| :: Corrigendum 1 (E-04-2026) | Update | E-04-2026 | Pass |
| HURL invites applications in Executive and Non-Executive cadre ... (careers card) | New Job | E-04-2026 | Pass (duplicate of above) |
| WALK-IN INTERVIEW for engagement of Doctor at HURL HQ | New Job | E-03-2026 Doctor HQ | Hold (single contract doctor, expired Feb 2026) |
| :: Notice regarding CBT Exam (old portal) | Update | GET-DET/2024/01 | Hold (2024, old cycle) |
| :: Notice - 1 / Notice - 2 (old portal) | Update | GET-DET/2024/01 | Hold (old) |
| :: FAQ (GET-DET/2024/01) | Noise | GET-DET/2024/01 | Hold |
| :: Detailed Advertisement (GET-DET/2024/01) | New Job | GET-DET/2024/01 | Hold (2024, closed) |
| Objection Tracker / Corrigendum Objection Tracker (old page, now excluded) | Noise | GET-DET/2024/01 | Hold |

## Proposed config (JSON)
```json
[
  {
    "id": "hurl",
    "name": "HURL Recruitment (career portal)",
    "runner": "india",
    "tier": "FREE",
    "level": "central",
    "type": "html",
    "url": "https://jobse4.hurl.net.in/",
    "include": "/others/",
    "exclude": "syllabus|objection|faq|compassionate|qualified|roll no|unique id",
    "minTitle": 3,
    "limit": 40,
    "timeoutMs": 15000
  },
  {
    "id": "hurl-careers",
    "name": "HURL Careers list (hurl.net.in)",
    "runner": "india",
    "tier": "FREE",
    "level": "central",
    "type": "html",
    "url": "https://hurl.net.in/careers/",
    "rowSelector": ".job-card",
    "rowTitle": ".job-title",
    "rowLink": "a.btn-download, a.btn-hurl-primary",
    "allowEmpty": true,
    "limit": 25,
    "timeoutMs": 15000
  }
]
```
Tested both (without exclude) via fetchItems: portal 2 items, careers 2 items, 3/3 runs identical.

## Uncertain points
- When HURL opens its next cycle it will probably use another portal host (jobse5?). Then "hurl" needs its URL updated; hurl-careers will show the new Apply link (a new card with its own title) and flag it, and a repair of the "hurl" URL can follow. Could not verify any future host.
- hurlrecruitment.in/home/login (admit card / objection tracker) is a login portal, not opened or tested.
- The admit card / result PDFs of E-04-2026 do not exist yet (CBT not announced), so their label form is unseen.
