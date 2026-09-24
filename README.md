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
- `extraCerts` — *(optional)* for a site whose security certificate is incomplete ("unable to verify the first certificate"): a list of certificate files from the `certs/` folder to trust **for that site only**. Security checking stays on for everything else.
- `fromScript` — *(optional)* `true` if the site builds its list with JavaScript from a text template inside the page (GAIL does).
- `titleTemplate` — *(optional)* builds a clearer title from the link text and the link's web-address parameters, e.g. `"RRB Patna CEN {cennum}: {text}"`.
- To pause a site without deleting it, add `"disabled": true`.

**Test before you push** (needs Node.js installed once: `npm install`):

```
node src/monitor.mjs --check
node src/monitor.mjs --check --runner india   (only the india sites)
```

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
3. At most `maxAiCallsPerRun` (20) AI calls per run. Extra notices are still sent, marked **❓ unchecked**. If the AI fails or credit runs out, notices are also sent as ❓ unchecked — never dropped.
4. **Not Relevant** answers are not sent; see `state/ai-log-<runner>.jsonl`. Scanned PDFs are judged by title only (**📷 scanned**). Answers are remembered per link in `state/ai-cache-<runner>.json`.
5. The run log shows the number of AI calls and the approximate cost.

**Test it first** (changes no files; messages start with 🧪 TEST; add `--dry-run` to print instead of sending):

```
node src/monitor.mjs --test-ai
```

Needs `ANTHROPIC_API_KEY` (and the two Telegram variables unless `--dry-run`) set in your terminal. It uses the SSC source and its latest 3 notices; change with `--test-source <id>`.
