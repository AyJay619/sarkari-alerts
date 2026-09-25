# Sarkari Alerts — notice monitor

Every 30 minutes this checks a list of government recruitment websites and sends **new** notices
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
- **PC off (night):** the timer keeps ticking, but only ONE run can wait in line; a newer one replaces the older waiting one
  (the replaced ones show as "cancelled" in the Actions tab — normal). When the PC starts, that one run catches everything posted overnight.
- **No internet right after boot:** the monitor waits up to ~4 minutes for it, then stops quietly. A lost connection is never counted as a site failing.
- **Morning message:** the first run each day (after 6 am India time) ends with "☀️ Morning check done: N sites, X new notices, Y failed".
- The old GitHub-cloud job is gone. The file `state/seen-cloud.json` is only kept so its memory can be carried over once; the PC ignores it afterwards.
- Want a site checked from GitHub's servers again? Test it with **Test sites from GitHub cloud**; then you would need to add a cloud job back.

## Check that it is working

- Repo → **Actions** tab: a green tick every ~30 minutes means it ran. Click a run to read the log —
  each source shows a line like `OK ISRO: 22 on page, 0 new`.
- The file `state/seen.json` gets a new commit whenever something was recorded.
- If a website stops working for **3 runs in a row** you get **one** ⚠️ warning message, and one ✅ message when it recovers.
- Note: GitHub sometimes runs "every 30 minutes" jobs a few minutes late. That is normal.

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
- `extraCerts` — *(optional)* for a site whose security certificate is incomplete ("unable to verify the first certificate"): a list of certificate files from the `certs/` folder to trust **for that site only**. Security checking stays on for everything else.
- `fromScript` — *(optional)* `true` if the site builds its list with JavaScript from a text template inside the page (GAIL does).
- `titleTemplate` — *(optional)* builds a clearer title from the link text and the link's web-address parameters, e.g. `"RRB Patna CEN {cennum}: {text}"`.
- `pageLink` — *(optional)* `true` if the site's file links change on every visit (NTPC does): every notice then points to the page itself.
- `method` / `form` / `headers` — *(optional)* for the rare site whose list comes from a POST request (HAL does): `"method": "POST", "form": {"lang": "en"}`. `headers` changes a header for that site only.
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

## Optional: AI check of new notices (costs money — OFF by default)

Set `"aiEnabled": true` in `config.json` to turn it on (and add a GitHub secret `ANTHROPIC_API_KEY`). With it **off**, nothing changes.
When on, only **new** notices are looked at:

1. Free word check on the title (`keywords.json`): clearly relevant → sent; clearly irrelevant (tender, circular…) → skipped and logged.
2. Unclear ones: the first 2 pages of the PDF are read as text (max ~2000 characters, never the file itself) and `claude-haiku-4-5` answers with one word.
3. At most `maxAiCallsPerRun` (20) AI calls per run. Extra notices are still sent, marked **🤖 AI skipped: cap reached**. If the AI fails or credit runs out, notices are also sent as ❓ unchecked — never dropped.
4. **Not Relevant** answers are not sent; see `state/ai-log-<runner>.jsonl`. Scanned PDFs are judged by title only (**📷 scanned**). Answers are remembered per link in `state/ai-cache-<runner>.json`.
5. The run log shows the number of AI calls and the approximate cost.

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
