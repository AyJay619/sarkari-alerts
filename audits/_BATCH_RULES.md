# Batch audit rules (BatLee's standing decisions)

Read this file first when you are asked to audit one "unit" (a site, or a family of sites) in BATCH mode.
Do not stop to ask BatLee: apply these decisions and put only the open questions in your block (see "Your output").

## Hard limits
- Do NOT change sources.json, config.json or any code. Do NOT commit, push or send Telegram messages.
- Never put a key in any file. SCRAPFLY_KEY is not available in your shell.
- Temporary scripts and downloads go ONLY in the scratchpad folder, in a sub-folder named after your unit:
  `C:\Users\amitd\AppData\Local\Temp\claude\C--Dev-sarkari-alerts\0eb8aa6d-4eed-4102-b8f9-4e74b230cac2\scratchpad\<unit>\`
  (a script that imports the scanner's `fetchItems` from `src/fetchers.mjs` may sit there too). Leave nothing in the repo except `audits/<unit>.md`.
- Test pages with the scanner's own `fetchItems(src)` (free fetch) so the result is what the scanner would see.
- Be polite: no hammering. A few requests per page is enough (about 5-10 repeats where flakiness is suspected).

## Standing decisions
- Use whatever URL version actually works (www / no-www, http / https). If https is flaky but http works, use http.
- Timeout: 15000 ms when the site answers fast.
- Any URL change: rebaseline on first run (the scanner does this by itself when a source's URL or selectors change).
- New useful pages found (results, answer keys, current recruitments, notices inside existing posts): propose adding them as FREE sources, with rebaseline; `allowEmpty` if the page empties between postings.
- Duplicates between pages are fine; the sorter merges them.
- NO keyword filters in the script. All hold rules go in the audit file for the sorter.
- Hold: ex-servicemen-only / retired-only, deputation, lateral-only, promotion, LDCE / departmental exams, consultants / young professionals, tenders, RTI, Hindi duplicates, time tables, press notes, marks of recommended candidates, debarment / normalisation / scribe notices.
- Pass: open jobs (including those reserving ESM seats), exam notifications, admit cards, results incl. shortlists and reserve lists, answer keys, corrigenda / addenda / extensions / cancellations, document / identity verification schedules, current-cycle interview schedules.
- ScrapFly: only if a free fetch truly fails (after trying www / http / timeout / render / classicTls / legacyTls / extraCerts as the scanner supports). Record the cheapest working option and its credits, but do NOT move any site to SCRAPFLY (propose nothing beyond "NEEDS SCRAPFLY" as the verdict).
- Site families are ONE audit (all sources of the unit share one audits/<unit>.md).

## The scanner (what you can change in a PROPOSAL)
Config-only options of a source are listed in README.md ("Add a new website") and visible in sources.json: type html/json, selector, rowSelector / rowTitle / rowLink, include / exclude (regex on title+link), minTitle, limit, extraUrls, titleReplace, contextClosest / contextFind, titleFromHref, pageLink, render + clickText + waitFor, extraCerts, legacyTls, classicTls, timeoutMs, allowEmpty, method POST + form/body/headers, itemsPath / titleField / linkField / linkPrefix (json). The seen check ignores www/http/https/double slashes/%-encoding differences in links, and a source whose URL or selectors change is silently re-baselined.

## What each audit file contains (audits/<unit>.md)
1. FIRST, under the heading `## BATCH SUMMARY BLOCK`, the block below (this is copied into the summary file; keep it under 8 lines).
2. Then the normal audit: pages watched and tested (URL, fetch method, verdict), what the scanner catches vs misses, posting speed vs limit, link stability (flood check), label pattern, hold/pass rules for the sorter, a short table of real sample links, the full proposed config (as JSON), and uncertain points.

## Block shape (exact)
```
SITE: <name> | VERDICT: OK / FIX / NEEDS SCRAPFLY / BROKEN
PROPOSED: <numbered config changes, one line each>
MISSING TODAY: <what the scanner misses, one line>
ASK BATLEE: <only questions the standing decisions don't answer, each with your recommendation>
```
VERDICT meaning: OK = works as it is; FIX = works after the proposed config changes; NEEDS SCRAPFLY = free fetch truly fails; BROKEN = nothing works (explain).
If nothing needs changing write `PROPOSED: none`. If nothing is missing write `MISSING TODAY: nothing found`. If nothing to ask write `ASK BATLEE: none`.

## Your final report back to the main session
Keep it to the block only (max 8 lines) plus one line `FILE: audits/<unit>.md written`. Nothing else: the main session collects 25 of these per summary file.
