## BATCH SUMMARY BLOCK
```
SITE: Indian Navy (joinindiannavy.gov.in) | VERDICT: FIX
PROPOSED: 1. Keep "navy" as is (FREE, www host, 8 events, 5/5 runs ok); 2. Add FREE source "navy-civilian" = https://indiannavy.gov.in/content/civilian (no-www host, selector ".sb_pdf_box a", limit 25, minTitle 15, rebaseline)
MISSING TODAY: all civilian recruitment (INCET Group B/C, Boat Crew Staff, apprentices): select lists, results, corrigenda, adverts - on the separate indiannavy.gov.in civilian page, not watched
ASK BATLEE: none
```

# Indian Navy
Audited: 2026-10-04 (batch mode) | Group: FREE | Status: ACTIVE

## Pages watched
| Page | URL | Fetch method | Verdict |
|---|---|---|---|
| Recruitment portal home "navy" (current) | https://www.joinindiannavy.gov.in/ | free fetchItems, include "/en/event/" | FREE-OK, 8 items, 0.1-0.35 s, 4/4 runs identical |
| Civilian recruitment and results (NEW) | https://indiannavy.gov.in/content/civilian (www. redirects here) | free fetchItems, selector ".sb_pdf_box a", limit 60 | FREE-OK, 60+ PDF links, 5/5 runs identical, 0.15-0.3 s |

Host notes: joinindiannavy.gov.in works only WITH www and https (no-www and plain http fail to connect). indiannavy.gov.in works with or without www (www redirects to no-www). There is no events archive page (/en/event.html and /en/events.html are 404); the only list of events is on the home page (3 "Upcoming Events" with a NEW icon + a few more, 8 total). Everything else in the home menu is static info pages (ways to join, pay scale, etc.), not notices. Officer/sailor entries are applied for through navydmpr.in / agniveer portals (login only, not watched).

## What the scanner catches vs misses
- Catches: the home-page event announcements (application windows with advert download, call-ups for SSB / Stage-II, extensions). Titles are short announcements, the actual advert/call-up is behind a login or inside the event page.
- Misses: the whole civilian page. It is the page where INCET (civilian Group B/C) adverts, Boat Crew Staff notifications, provisional select lists, score and ranking lists, reserve-list nominations, corrigenda, apprentice written-exam results and shortlists are posted, as direct PDFs. About 5 new rows in Sept 2026, 5 in Aug, 5 in Jul: busy enough to matter.
- Home page depth: only 8 events are shown and older ones roll off (the "10+2 B.Tech callups for SSBs scheduled in Sep 26" item was on the page earlier and is gone today). A scan gap of more than a few days could miss an event; daily scans are fine.
- Titles: the scanner shortens some titles (e.g. "... Login to" with "download." cut); harmless.

Posting speed: events are posted within days of the action (call-up dates, extensions). Civilian PDFs carry the upload month in the URL (sites/default/files/2026-09/...).

Link stability (flood check):
- Events: the URL slug is built from the title, and when a window closes the title gets "(Closed)" appended and the slug changes to "...-closed.html". A live event will therefore reappear once as a "new" link when it closes (a small, bounded repeat, 1-2 items at a time, not a flood). The sorter should treat a "-closed" duplicate of an already-seen event as Noise.
- Civilian page: links are static PDFs, stable across runs. Caveat: PDFs uploaded in May 2026 sit on a different host (innavy.appentus.com) than the rest (indiannavy.gov.in). They are far below the top of the list and are covered by the first rebaseline, so no flood.

## Label pattern
- Events (joinindiannavy): free-text sentence, "<Entry/Batch> <course> - <action>. Login to download/apply." e.g. "SSC - Jun 27 Course - Callups for SSBs scheduled in Nov - Dec 26 issued". Parent = entry + course/batch ("SSC (various entries) Jun 27 course", "10+2 B.Tech Cadet Entry Jan 27", "Agniveer SSR/MR/Apprentice 1/27 batch", "AVR (SSR/MR) INET 26"). Type words: "application window ... is live / extended" = New Job (or Update if extended), "Callups ... issued" = Admit Card / call letter, "(Closed)" = Noise.
- Civilian (indiannavy.gov.in): "<Series>-<no>-<year> - <what> - <post>", e.g. "INCET-01-2024 - List of Candidates Nominated from Reserve List - Tradesman Mate", "Notification_16-2025-BCS - Provisional Select List - 2025 Recruitment to Lascar-I of Boat Crew Staff". Parent = series code (INCET-01-2025, INCET-01-2024, INCET-01-2026 (ABS-DEP), Notification_NN-2025-BCS) + post name. Some titles are bare filenames or have no series ("Notice - Recruitment for the post of Pharmacist (By Absorption) - HQANC"); the HQ command code (HQANC, HQENC, HQWNC) is the unit.

## Hold / pass rules for the sorter
Hold:
- "ABS-DEP", "By Absorption", "Deputation", "Re-employment", "ISTC" posts (INCET-01-2026 (ABS-DEP), Pharmacist/Staff Nurse/Tradesman Mate by Absorption, Foreman on Deputation, NCLAT deputation posts).
- Compassionate appointment lists and merit points ("Employment Assistance Scheme", "Merit Points Allotted ... Compassionate").
- "Score & Ranking of candidates who opted Yes iaw DoPT OM" lists, "Candidates View QP", "Candidates Details": general info / marks lists. (If BatLee wants these as results, say so; default Hold.)
- "(Closed)" events, "Agniveers ... reset password" notices, calendar PDFs.
Pass:
- New adverts: INCET adverts, Boat Crew Staff recruitment, apprentice adverts, SSC / 10+2 B.Tech / AVR / SSR / MR application windows (live).
- Provisional select lists, nominated-from-reserve-list lists, written-exam results and shortlists, call-ups for SSB / Stage-II, extensions, corrigenda, amended timelines, cancellation / re-conduct notices.

## Sample links (audit day)
| Title | Type | Parent | Pass/Hold |
|---|---|---|---|
| Agniveer SSR, MR & Apprentice - 1/27 Batch - Callup for Stage-II at NREs issued | Admit Card | Agniveer SSR/MR/Apprentice 1/27 | Pass |
| SSC - Jun 27 Course - Callups for SSBs scheduled in Nov - Dec 26 issued | Admit Card | SSC Jun 27 course | Pass |
| Agniveers of 02/2022 Batch to RESET their password and login | Noise | Agniveer 02/2022 | Hold |
| Online application window for SSC (various entries) Jun 27 Course is extended upto 03 Aug 26 (Closed) | Update | SSC Jun 27 course | Hold (closed) |
| Online application window for 10+2 B.Tech Cadet entry Jan 27 ... extended upto 29 Jun 26 (Closed) | Update | 10+2 B.Tech Jan 27 | Hold (closed) |
| Online application for AVR (SSR), AVR (MR), SSR (Med) INET 26 live from 14 Mar 26 (Closed) | New Job | INET 26 | Hold (closed) |
| Notification_18-2025-BCS - Provisional Marks and Swimming Test Results - Lascar-I Boat Crew Staff | Result | BCS Notification 18-2025, Lascar-I | Pass |
| Notification_14-2025-BCS - Provisional Select List - Fireman and Topass, Boat Crew Staff | Result | BCS Notification 14-2025, Fireman/Topass | Pass |
| INCET-01-2024 - List of Candidates Nominated from Reserve List - Tradesman Mate / Pest Control Worker | Result | INCET-01-2024 | Pass |
| INCET-01-2025 - Amended Timelines of Various Recruitment Activities Stages | Update | INCET-01-2025 | Pass |
| LIST OF COMPASSIONATE CASES ... XXVI BOARD ... EMPLOYMENT ASSISTANCE SCHEME | Noise | Compassionate appointment | Hold |
| INCET_01_2026 (ABS-DEP) - Corrigendum - Group B(NG)/C posts by Deputation and Absorption | Update | INCET-01-2026 (ABS-DEP) | Hold (deputation) |
| INCET-01-2026 (ABS-DEP) - Detailed Advertisement ... by Deputation Absorption | New Job | INCET-01-2026 (ABS-DEP) | Hold (deputation) |
| Notice - Recruitment of Staff Nurse - HQWNC | New Job | Staff Nurse HQWNC | Pass if open (check body; absorption variants Hold) |
| Notice - Recruitment for the post of Pharmacist (By Absorption) - HQANC | New Job | Pharmacist HQANC | Hold (absorption) |
| INCET-01-24-Score & Ranking of Candidates (opted Yes) ... - Fireman | Noise | INCET-01-2024 Fireman | Hold (marks list) |
| WRITTEN EXAMINATION RESULT FOR ENROLLMENT OF APPRENTICES FOR 2026-27 BATCH AT NAVA | Result | Apprentices 2026-27, Naval Dockyard | Pass |
| Notice - INCET-01_2025 - Cancellation / Re-Conduct of INCET-01-2025 for Specific Centres | Update | INCET-01-2025 | Pass |
| INCET-01-2025 - Corrigendum No. 3 - Amendment of Vacancies | Update | INCET-01-2025 | Pass |
| Advertisement for 02 Posts of Foreman (Mechanic) and 01 Foreman (Ammunition) on Deputation | New Job | Foreman Naval Dockyard | Hold (deputation) |

## Proposed config (JSON, for BatLee's approval; nothing applied)
```json
[
  {
    "id": "navy",
    "name": "Indian Navy",
    "runner": "india", "tier": "FREE", "level": "central", "type": "html",
    "url": "https://www.joinindiannavy.gov.in/",
    "include": "/en/event/", "minTitle": 15, "limit": 30
  },
  {
    "id": "navy-civilian",
    "name": "Indian Navy Civilian Recruitment",
    "runner": "india", "tier": "FREE", "level": "central", "type": "html",
    "url": "https://indiannavy.gov.in/content/civilian",
    "selector": ".sb_pdf_box a", "minTitle": 15, "limit": 25
  }
]
```
("navy" is unchanged. The new source is picked up and baselined silently on its first run.)

## Uncertain points
- Whether the civilian page has older sections beyond ".sb_pdf_box" (it shows one "Recruitment & Result" block today; other blocks, if any, would need their own check).
- The event pages themselves (title-only on the home page) were not opened for body text; call-up/advert details are behind the login portals, so the sorter can only judge from the title.
- Lists of "opted Yes" score/ranking and compassionate cases are held by default; BatLee may want INCET score/ranking lists as results.
- ScrapFly: not needed, both pages work with a free fetch.

## BatLee's corrections
- (none yet)

## Repairs
- (none yet)
