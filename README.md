# Sarkari Alerts — notice monitor

Five times a day (about 9:30 am, 12:30 pm, 3:30 pm, 6:30 pm and 9:30 pm India time) this checks a list of government recruitment websites and sends **new** notices
(jobs, admit cards, results, answer keys, corrections) to you on Telegram.
It only *sends alerts*. It never touches your website or Sanity.

There are **two jobs**: **cloud** (runs on GitHub's servers) and **india** (runs on your own Windows PC, for sites that block GitHub).
Each source in `sources.json` has `"runner": "cloud"` or `"runner": "india"` — change that one word to move a site between jobs.
Each job keeps its own memory file (`state/seen-cloud.json`, `state/seen-india.json`).
If you move a site, it is treated as new on its new job (one silent "now watching" message, no flood).

A Telegram message looks like:

```
💼 Job · ISRO

Advt. No. IPRC/RMT/2026/01 dated 12.09.2026 - Inviting online applications for the posts of ...

🔗 https://www.isro.gov.in/IPRCRecruitment4.html
```

## One-time setup

1. **Make a Telegram bot:** in Telegram, chat with `@BotFather`, send `/newbot`, follow the steps.
   You get a **token** (a long text like `123456:ABC...`).
2. **Start the bot:** open your new bot in Telegram and press **Start** (send it any message).
3. **Find your chat id:** in Telegram chat with `@userinfobot` — it replies with your **Id** (a number).
4. **Save both in GitHub** (never in the code): your repo → **Settings → Secrets and variables → Actions → New repository secret**. Add two secrets, with these exact names:
   - `TELEGRAM_BOT_TOKEN` — the token
   - `TELEGRAM_CHAT_ID` — the number
5. Repo → **Settings → Actions → General → Workflow permissions** → choose **Read and write permissions** → Save.
6. Run it once by hand (see below). You will get **one** message: "Now watching … — N existing notices recorded".
   After that you only get messages for genuinely new notices.

## The india job: your PC

**Is the runner online?** Repo → **Settings → Actions → Runners**. Your runner (label `india`) shows **Idle** or **Active** (online) or **Offline**.
On the PC, the runner must be running (as a Windows service, or by running `run.cmd` in the runner folder).

**If the PC is off:** nothing breaks. The cloud job carries on as normal. The india job just waits in line (only one waiting run is kept, so no pile-up)
and runs when the PC is back; a run that waits more than 24 hours is cancelled by GitHub. You may miss alerts from the india sites while it is off, but you will get them when it is back on
(notices stay on those sites' pages for a while).

**Move the runner to a Mac later:**
1. Repo → **Settings → Actions → Runners → New self-hosted runner**, pick **macOS**, and run the commands it shows on the Mac. When asked for labels, add `india`.
2. Make sure Node.js is installed on the Mac, and that the Mac has an Indian internet connection.
3. Start it (`./run.sh`, or install as a service with `./svc.sh install && ./svc.sh start`).
4. Once the Mac shows as online, remove the old Windows runner (Settings → Actions → Runners → ⋯ → Remove). Nothing else changes: the workflow only looks for the `india` label.

**Safety:** the workflow only starts on the timer or the manual button — never on pull requests. Keep it that way, because the india job runs on your own PC.

## Run it manually

Repo → **Actions** tab → **Check for new notices** → **Run workflow** (green button).

## Everything runs on your PC

All sites are checked by the GitHub runner installed on your PC (a Windows service that starts by itself when Windows starts).
- **Schedule:** the timer fires at 03:55, 06:55, 09:55, 12:55 and 15:55 **UTC** (cron is always UTC; India is UTC+5:30), which is 9:25 am, 12:25 pm, 3:25 pm, 6:25 pm and 9:25 pm IST: five minutes before the times you want, because GitHub usually starts a scheduled run a few minutes late. **Run workflow** (manual) always works too.
- **PC off or asleep:** the timer keeps ticking, but only ONE run can wait in line; a newer one replaces the older waiting one
  (the replaced ones show as "cancelled" in the Actions tab — normal). When the PC comes on, that one run catches everything posted meanwhile. The "duration" of a run in the Actions list includes the time it waited for the PC.
- **Missed-run note:** if a run starts between 9 am and 10 pm and the last successful scan is more than 4 hours back **and** a scheduled time has clearly passed without a run, you get one note: "⚠️ Last scan was at 3:30 pm — a scheduled run may have been missed. Use Run workflow if needed." (The normal night gap never triggers it.)
- **Windows must stay awake:** a sleeping PC runs nothing. Sleep is the most common reason for late or missing runs. In Power Options set "Put the computer to sleep" to **Never** (plugged in), and do not use Start → Sleep. Optionally, a Task Scheduler task with "Wake the computer to run this task" a few minutes before each run time (9:20 am, 12:20 pm, 3:20 pm, 6:20 pm, 9:20 pm) can wake it.
- **No internet right after boot:** the monitor waits up to ~4 minutes for it, then stops quietly. A lost connection is never counted as a site failing.
- **Morning message:** the first run each day (after 6 am India time, so normally the 9:30 am run) ends with "☀️ Morning check done: N sites, X new notices, Y failed".
- The old GitHub-cloud job is gone. The file `state/seen-cloud.json` is only kept so its memory can be carried over once; the PC ignores it afterwards.
- Want a site checked from GitHub's servers again? Test it with **Test sites from GitHub cloud**; then you would need to add a cloud job back.

## Check that it is working

- Repo → **Actions** tab: a green tick for each of the 5 daily runs means it ran. Click a run to read the log —
  each source shows a line like `OK ISRO: 22 on page, 0 new`.
- The file `state/seen.json` gets a new commit whenever something was recorded.
- If a website stops working for **3 runs in a row** you get **one** ⚠️ warning message, and one ✅ message when it recovers.
- Note: GitHub often starts a scheduled run a few minutes late (that is why the timer fires 5 minutes early), sometimes much later at busy times. That is normal.

## Add a new website

Open `sources.json` and copy one of the blocks. The simple kind (a page with a list of links):

```json
{
  "id": "mysite",
  "name": "My Site",
  "type": "html",
  "url": "https://example.gov.in/recruitment-page",
  "include": "advt|recruitment|result|admit",
  "limit": 25
}
```

- `id` — a short unique name, no spaces (used to remember what was already seen).
- `name` — what appears in the Telegram message.
- `url` — the page that lists the notices / recruitment / what's new.
- `include` — *(optional)* only keep links whose text or address contains one of these words (separate with `|`). Use it to cut out menu links.
- `exclude` — *(optional)* drop links containing these words.
- `minTitle` — *(optional)* ignore link texts shorter than this many letters (default 12).
- `limit` — how many notices from the top of the page to look at (default 40).
- `runner` — `"cloud"` (default) or `"india"`: which job checks it.
- `timeoutMs` — *(optional)* for a slow site: how many milliseconds to wait (default is 10 seconds to connect and 30 seconds in total), e.g. `45000`.
- `extraCerts` — *(optional)* for a site whose security certificate is incomplete ("unable to verify the first certificate"): a list of certificate files from the `certs/` folder to trust **for that site only**. Security checking stays on for everything else. **Why this matters on the PC:** your own Windows account has `NODE_USE_SYSTEM_CA=1`, so Node trusts the Windows certificate store there (Windows quietly downloads missing intermediate certificates). The GitHub runner service runs as NETWORK SERVICE without that setting and only trusts Node's built-in list, so a site with an incomplete certificate works in your tests but fails in the live run. To check a site the way the service sees it, run it without that variable: `env -u NODE_USE_SYSTEM_CA node src/monitor.mjs --check --only <id>` (Git Bash) or `set NODE_USE_SYSTEM_CA=` first (cmd). Never turn certificate checking off; add the intermediate to `certs/` instead. A cert file may hold two certificates (an intermediate and the root it needs). Intermediates expire: REC's (`emsign-dv-tls-ca-g2a-1.pem`) runs to Dec 2028.
- `fromScript` — *(optional)* `true` if the site builds its list with JavaScript from a text template inside the page (GAIL does).
- `titleTemplate` — *(optional)* builds a clearer title from the link text and the link's web-address parameters, e.g. `"RRB Patna CEN {cennum}: {text}"`.
- `pageLink` — *(optional)* `true` if the site's file links change on every visit (NTPC does): every notice then points to the page itself.
- `method` / `form` / `headers` — *(optional)* for the rare site whose list comes from a POST request (HAL does): `"method": "POST", "form": {"lang": "en"}`. `headers` changes a header for that site only.
- `classicTls` — *(optional)* `true` for a site that hangs until it times out on the PC but opens fine in a browser (an old firewall that cannot read the modern security handshake Node offers). Checking stays on.
- `jsonInPage` — *(optional, with `"type": "json"`)* the list is a JavaScript variable inside the page, e.g. `"glblMasterCareerDetails"` (Bank of Baroda). `include`/`exclude` also work on JSON titles.
- `body` and `rscLine` — *(optional)* a raw request body for `POST`, and, for sites whose answer is a Next.js "server action" (`1:{...}` lines), which line holds the JSON (AIIMS). Such sites break if the site is rebuilt (the `Next-Action` id changes): you would then get the usual "failed 3 runs" warning.
- `titleReplace` — *(optional)* `["regex", "replacement"]` to tidy long row titles (PNB).
- `noFileDownload` — *(optional)* `true` for a site whose robots.txt forbids fetching its notice files (NALCO): the page listing is read, but the monitor never opens the PDF (no date/post lines, no AI read) and **📥 Send to agents** refuses and tells you to download it yourself. The alert shows the title, the link and "📄 PDF not read (site doesn't allow automated downloads)".
- `titleFromHref` — *(optional)* `true` for a page where every link just says "Detailed Advertisement" or "Click Here": the title is made from the file name in the link instead (IDBI, RCF, BSNL).
- `contextPrev` — *(optional)* a heading tag such as `"h4"`: for pages laid out as a heading followed by a list of links, the nearest heading above the link is put in front of the link text (Bank of Maharashtra).
- `allowEmpty` — *(optional)* `true` for a page that is legitimately empty between postings (THDC, NIA, ICAR): an empty list is then not a failure. Real errors (network, HTTP, certificate) still count. Trade-off: if the site's layout changes so the list can no longer be read, that also looks like "empty", so check these by eye now and then.
- **60-day reminder:** for a source with `allowEmpty`, if its list stays empty for 60 days you get one Telegram note (and another every 60 days after that) so a broken page is not mistaken for "no notices". The reminder clears as soon as a notice appears.
- `extraUrls` — *(optional)* more pages read with the same settings and merged into one list. Used for the railway zone sites, which split their notices over several pages (CEN, apprentices, sports, scouts & guides). A section-list source ("new sections") watches the zone's RRC menu so a brand-new CEN section is announced too. If any page fails, the whole source counts as failed.
- `render` — *(optional)* `true` for a page whose list only appears after JavaScript has run (FCI): the page is opened headless, with no login, in Playwright's own pinned Chromium (falling back to installed Chrome, then Edge; the one used is logged). See "Reinstall the pinned browser" below. `clickText` (a button to click first, e.g. `"English"`), `waitFor` (a selector to wait for) and `browserChannel` (`"chrome"` or `"msedge"`) go with it. It is never used to get past a captcha or bot check.
- `rowEndDate` / `rowStartDate` — *(optional)* selectors of the "end date" and "start date" a list shows for each notice (DRDO). If the PDF itself names no last / start date, these feed the 🔴 Last date / 🟢 Start date lines, labelled "(site list)".
- `allowedHosts` — *(optional)* extra file hosts the **Send to agents** button may download from (BSF, EPFO).
- `group`, `groupName`, `region` — *(optional)* sites that post similar notices are announced as one alert with the region shown (the 21 RRBs and the RRC zones).
- `rowTitle` — normally the CSS selector of the title inside a table row; `"self"` uses the whole row text.
- `contextClosest` / `contextFind` / `contextAttr` — *(optional)* for pages where a link's text is just "Result" or "English": puts the heading of the surrounding box in front of it (PowerGrid, BPCL). `contextAttr` takes that heading from an attribute instead of its text, for headings whose wording changes (SBI).
- `rebaseline` — *(optional)* `true` on an existing site whose `url`/filter you have just changed: its first run afterwards silently records everything on the page as "seen".
- To pause a site without deleting it, add `"disabled": true`.

**No flood of old notices.** A new site, and any site whose `url` or filter you change, is recorded silently on its first run
(everything on the page counts as "already seen", no alerts, no AI calls) — you only get one short "Now watching …" line.
The monitor spots a changed filter by itself (it remembers a fingerprint of each site's settings).

**Test before you push** (needs Node.js installed once: `npm install`):

```
node src/monitor.mjs --check
node src/monitor.mjs --check --runner india   (only the india sites)
node src/monitor.mjs --check --only sbi,hal,nta   (only these ids)
```

**AI dry run** (Actions tab → **AI dry run** → Run workflow, type a source id such as `ssc`): runs on your PC, reads the latest 3 notices of that one site, runs the AI check on them exactly as a live run would (Post, vacancies, ✅/⛔ dates, 🙈 skip) and sends them to your Telegram marked 🧪 TEST. It saves nothing: no seen-list, no AI cache, no log, no commit. It needs the `ANTHROPIC_API_KEY` secret.

**Long Telegram messages** (e.g. the "now watching" list after many new sites) are split at line breaks into parts under 3,500 characters (Telegram's limit is 4,096). If a summary or heading message cannot be delivered, the run still succeeds; only a failed *notice* alert makes the run report a problem (and that notice is retried next run).

To find out whether a site also works from GitHub's servers (so it can run as `"cloud"` instead of on your PC), press **Run workflow** on **Test sites from GitHub cloud** in the Actions tab. It only reads pages; it changes and sends nothing.

It fetches every site and shows what it found. A site only works if it shows `OK` and the notices look right.
Websites that need a CAPTCHA, load their list with JavaScript, or block automated visitors will show `FAIL` or find nothing —
skip those.

To preview the Telegram messages without sending anything:

```
node src/monitor.mjs --dry-run --state test-state.json
```

(Run it twice; delete a few lines from `test-state.json` in between to see "new notice" messages.)

Tables and JSON feeds need extra fields (`rowSelector`, `itemsPath` …); see the AAI and SSC entries in `sources.json` as examples.

## What the category tags mean

Chosen by words in the title (see `src/categorize.mjs`): **Answer Key**, **Admit Card**, **Correction**
(corrigendum, addendum, extension…), **Result**, **Job** (advertisement, recruitment, vacancy…), otherwise **Other**.

## Good to know

- The first time a source is seen, its existing notices are recorded silently — no flood.
- If more than 15 new notices from one site show up at once (usually a site redesign), you get the 15 newest plus one "N more" note.
- If Telegram itself fails, the notice is *not* marked as seen, so it is retried on the next run.
- If the repo has no activity for 60 days GitHub may pause scheduled runs; the state commits normally keep it active,
  and you can always press **Run workflow**.

## Manual check

These are not read by the monitor. Look at them yourself now and then:

| Site | Why it is manual |
|---|---|
| IOCL (`iocl.com`) | Behind a bot check (Sucuri: "JavaScript is required"). Not bypassed. |
| Army Agniveer and officer entries (`joinindianarmy.nic.in`) | The pages send you to a login with a captcha. Not bypassed. (The Army's public news page is covered by `army-notices`.) |
| RRC Eastern Railway (`er.indianrailways.gov.in`) | To do later: the zone site has no recruitment-cell notice list (only Howrah-division staff notices). |
| Metro Railway Kolkata (`mtp.indianrailways.gov.in`) | To do later: the site has no recruitment section. |
| Bank of India (`bankofindia.bank.in/career`, `bankofindia.co.in/career`) | Answers 403 and shows a reCAPTCHA "Checking your browser" page. Not bypassed. |
| IRDAI (`irdai.gov.in/notifications/vacancies`) | A firewall blocks automated visitors ("The request is blocked"). Not bypassed. |
| MRPL (`mrpl.co.in/careers`) | A bot-check redirect (`?prophazecheck=1`, HTTP 503). Not bypassed. |
| DVC (`dvc.gov.in/cms-web/recruitment-notices`) | Its robots.txt allows only Google and Bing and says `User-agent: * Disallow: /`. Respected. |
| NFL (`nationalfertilizers.com`) | Its robots.txt says `User-agent: * Disallow: /`. Respected. |
| EIL recruitment portal (`recruitment.eil.co.in`) | Its robots.txt says `User-agent: * Disallow: /`. Respected. |
| NLC India (`nlcindia.in/website/en/careers/jobs/currentopenings.html`) | Opens in Chrome, but the normal reader and `classicTls` get the page frame with no list, and the pinned Chromium gets a firewall page ("Web Page Blocked!", HTTP 500). Not bypassed. |

## Sites not added yet (retry later)

Each was tested from this PC. "Retry" means: look again in a few weeks, or when the site changes.

| Site | Why it is not added |
|---|---|
| Army Agniveer / officer entry pages (`joinindianarmy.nic.in/AgnipathScheme.htm`, `/officers-notifications.htm`) | Both pages send you to a login page with a captcha. Not read. (The Army's public news page is covered by `army-notices`.) |
| IOCL (`iocl.com`) | Behind a bot check (Sucuri: "JavaScript is required"). Not read. Retry if IOCL publishes notices on a page without it. |
| DRDO CEPTAM (`drdo.gov.in/drdo/en/offerings/vacancies/ceptam`) | The page exists but shows "No Content" (an empty list would count as a failure). The general DRDO vacancies list is covered. Retry when CEPTAM posts. |
| RRC / zonal notices for Eastern Railway (`er.indianrailways.gov.in`) and Kolkata Metro (`mtp.indianrailways.gov.in`) | Their sites have no recruitment-cell notice list: ER only has Howrah-division staff notices (TBT, hospital tenders) and a 2018 Traffic Apprentice page; Metro has no recruitment section. Retry. |
| ASRB (`asrb.gov.in/vacancy`; old `asrb.org.in` times out) | `asrb.gov.in/vacancy` gave HTTP 500 (Internal Server Error) on 29 Sep 2026 with the normal reader, `classicTls` and Chromium alike: a server-side error. Retry later. |
| MTNL (`mtnl.in`) | No recruitment page: only a fake-advert warning. Retry. |
| `www.indianoil.in`, `rrcecr.gov.in` (old RRC ECR address), `jointerritorialarmy.gov.in` | Did not answer from this PC (timeouts), even with `classicTls`. |

Added on a "may break" basis: **AIIMS** (its internal request id changes if the site is rebuilt), **Air Force**, **AFCAT** and **RRC SCR** (the last one lives at an IP address, `203.153.33.92`, which is the address the official SCR site links to).

## Optional: AI check of new notices (costs money — OFF by default)

Set `"aiEnabled": true` in `config.json` to turn it on (and add a GitHub secret `ANTHROPIC_API_KEY`). With it **off**, nothing changes.
When on, only **new** notices are looked at:

1. Free word check on the title (`keywords.json`): clearly irrelevant (tender, circular…) → skipped and logged.
2. **Job and Correction notices always get the AI read** (even when the title is clearly relevant). Haiku gets the first ~3000 characters of the PDF plus every line anywhere in it that mentions a date (last date, closing date, अंतिम तिथि …), max ~6000 characters, today's date in India, and the text of `editorial-rules.md`. It returns a small JSON: category, post, start date, last date, notice type (fresh / corrigendum / extension), and a post/skip verdict with the rule used.
3. **The date lines and the status are worked out by our code** from today's date in India, not by the AI:
   ```
   🟢 Start date: 25 Sep
   🔴 Last date: 19 Oct
   ✅ Open · 19 days left
   ```
   A date that was not found shows `?` (e.g. `🟢 Start date: ?`). If the notice has no application start date (typical for offline / by-post applications), the advertisement / notice date is used and labelled, e.g. `🟢 Start date: 25 Sep (advt date)`; `?` only when neither exists. Status line: **✅ Open · N days left** / **⚠️ Closing · N days left** (3 days or fewer) / **⏳ Closes today** / **⛔ Closed on 12 Sep** / **🕒 Starts 5 Oct** (the start date is still ahead). For a corrigendum or extension, **🔁 Extended: 12 Sep → 30 Oct** sits above the status line. Both dates missing: **⚠️ Dates not found — check PDF** (**📷 scanned — dates not found** for scans). Haiku is asked for the application START date too (start date, opening date, "registration starts", commencement, "from X to Y"), and the lines around those words are sent with them, so a date that wraps onto the next line is not lost.
   - **Wrapped dates:** for every line that mentions a date keyword, the line before it and the two lines after it are sent too (overlaps merged), and a line whose next line holds a date is sent as well, so "…The last date to submit / online application is 06-10-2026." arrives whole. The English keywords work on their own when a PDF's Hindi is garbled.
   - **No vacancies line.** Alerts never show a vacancy count (it is not even asked for, which saves tokens).
   - **PDFs with no real text** (a scan, or only bullets and an e-mail address; fewer than 200 real words for a big file): the first 6 pages are sent to Haiku *as the PDF itself* to read visually. It costs more (about 10,000 input tokens, ~1.2 cents, for a 6-page scan), it is logged as `visual-read` with its tokens and cost, counted in the daily limit and shown in the run summary ("visual PDF reads"). If that fails the alert says **📷 scanned — dates not found**.
   - **Cancelled advertisement** → category Correction, always posted, with **❌ Advertisement cancelled**. An updated/revised vacancy table or annexure of an existing recruitment is a **Correction**, not a Job.
4. `editorial-rules.md` is plain text you can edit. Each SKIP rule is written `- Name: explanation`; the AI may skip **only** with one of them and must name it exactly (the code changes an invented reason into "post"). **A notice skipped by a rule is NOT alerted**: it is written to the AI log (`state/ai-log-<runner>.jsonl`) and listed in the daily digest below. "Ex-servicemen only" applies when the reservation is 100% for ex-servicemen or "(ESM)" is in the post/grade name, or a military rank / years in the Armed Forces are required, or only serving/retired defence personnel can apply. "Retired personnel only" applies when only retired / superannuated people, ex-employees or retired officers / scientists of any organisation can apply (or a superannuation / relieving certificate is required). A quota inside a normal public recruitment (e.g. "10% reserved for ex-servicemen") is still alerted. As a safety net the code also skips a notice whose text plainly says so (100% for ex-servicemen, "(ESM)", "eligible retired Scientist-G ...") if the AI answered "post". Rename a rule in the file and the new name appears in the digest. Old cached answers from before this version are asked again (the cache has a version number).
   - **Free title pre-check** (`keywords.json` → `skipTitles`): a title that clearly belongs to a skip rule (ex-servicemen on contract, retired / superannuated / ex-employees / re-employment, deputation, departmental exam / LDCE / GDCE / internal promotion, tender) is skipped without downloading the PDF or calling the AI. Each rule has `patterns` and `unless` (a title that also matches an `unless` word, such as *reservation* or *quota*, is NOT skipped). Edit the lists freely; delete a pattern to stop it skipping.
   - **Forms are not notices** (`keywords.json` → `formTitles`): titles like *Application Form / Format*, *Annexure* (without vacancy/corrigendum/advt), *Declaration*, *Undertaking*, *Biodata*, *Proforma* are Not Relevant: no alert, no download, no AI. Links to `.doc`, `.docx`, `.xls`, `.xlsx` files are Not Relevant too, unless the title itself is clearly a notice (advertisement, recruitment ...): then it is alerted with **📄 Word/Excel file — not read**.
   - **Daily skipped digest:** everything skipped by the rules is collected per Indian day and sent as ONE message (source, title, rule, link; split if long) with the **last run of the day** (the 9:30 pm run; any run from 9:00 pm IST). If the PC was off then, it goes out with the first run of the next day. Anything skipped later that evening comes as a short extra digest. Nothing skipped = nothing sent. The run summary carries the line **🙈 Skipped by rules: N** (0 when none).
5. Admit cards, results and answer keys that the title already identifies use no AI. Unclear titles are still classified by the AI.
6. At most `maxAiCallsPerRun` calls per run and `maxAiCallsPerDay` (150, Indian date) per day. Beyond that a Job/Correction goes out marked **🤖 dates not checked (limit)**. If the AI fails, or its answer is broken, notices go out as ❓ unchecked — never dropped.
7. **Not Relevant** answers for unclear titles are not sent. Answers (with the extracted facts) are remembered per link in `state/ai-cache-<runner>.json`, together with today's call count. The run log shows calls and approximate cost.

**Test it first** (changes no files; messages start with 🧪 TEST; add `--dry-run` to print instead of sending):

```
node src/monitor.mjs --test-ai
```

Needs `ANTHROPIC_API_KEY` (and the two Telegram variables unless `--dry-run`) set in your terminal. It uses the SSC source and its latest 3 notices; change with `--test-source <id>`.

## "📥 Send to agents" button and the listener (on your Windows PC)

Every alert has a **📥 Send to agents** button. Tapping it saves that notice into an inbox folder on your PC, for your agents to pick up:

- The PDF is downloaded to `C:\Dev\sarkari-inbox\pending\` and named like `2026-09-26_SSC_Tentative-Vacancy-of-Combined-Graduate-Level-Examination.pdf`.
- Next to it is a `.json` with the source, title, category, link and alert date.
- If the link is a web page and not a PDF (RRB pages), only the `.json` is saved and the reply says "link only — no PDF".
- The bot replies "✅ Saved to inbox: …" and the button turns into "✅ Sent to agents". Tap it again and nothing happens. If the same PDF is already there, you get "Already in inbox".
- If the download fails you get "❌ Download failed: …" and the button stays so you can tap again.

**How the listener knows what to download:** the button itself carries no link (Telegram only allows 64 characters). Instead, the listener reads the source, title, category and link from the alert message you tapped. That also works for alerts sent from GitHub's servers, where no PC could have remembered a short ID.

**Safety:** it only obeys taps from *your* chat (`TELEGRAM_CHAT_ID`); anyone else is ignored silently. It only downloads from websites that appear in `sources.json` (a source can add extra file hosts with `"allowedHosts": [...]`) and checks this again on every redirect; anything else is refused and you are told on Telegram. The inbox folder may not be inside OneDrive (change it with `"inboxDir"` in `config.json`).

### One-time setup

1. Put these in the `.env` file in the project folder (it is never uploaded to GitHub):
   ```
   TELEGRAM_BOT_TOKEN=...
   TELEGRAM_CHAT_ID=...
   ```
2. Double-click **`listener\install-listener.cmd`**. It makes the listener start hidden every time you log in to Windows, restarts it if it crashes, and starts it right now. (If Windows says access is denied, right-click it → *Run as administrator*.) It uses no PowerShell scripts, so your execution policy is untouched.
3. Try it: run `npm run send-test-alerts` — three 🧪 TEST alerts arrive: a real SSC PDF, one from a website that is not allowed (should be refused), and an RRB link (link only). Tap each button.

### Is it running?

Double-click **`listener\check-listener.cmd`**. It says RUNNING or NOT RUNNING, whether it starts at login, and shows the last log lines. The full log is `C:\Dev\sarkari-inbox\logs\listener.log`.

To stop it and remove the automatic start: double-click **`listener\uninstall-listener.cmd`**. To run it by hand in a window (to watch it): `npm run listener`.

Only one listener can run at a time, and nothing else in this project uses Telegram's `getUpdates` or a webhook.

Test without touching Telegram: `npm run test:listener` (uses a fake Telegram and real downloads from SSC).

## Reinstall the pinned browser

Sources with `"render": true` (FCI) are read with Playwright's own Chromium, whose version is fixed by the pinned `playwright-core` in `package.json`, so Chrome updates cannot break it. It is stored outside the project, in `C:\ProgramData\sarkari-alerts\browsers` (any account, including the runner service, can read it; the runner wipes its checkout folder each run, so it cannot live there). If that folder is ever deleted, run in the project folder:

```
npm run install-browser
```

Until then the monitor falls back to installed Chrome, then Edge. If all three fail, the usual "failed 3 runs in a row" warning appears and says **browser could not start**. Set `SARKARI_BROWSERS_PATH` to use another folder. Only change the `playwright-core` version on purpose, then run `npm run install-browser` again.
