import fs from "node:fs";
import path from "node:path";
import { fetchItemsWithRetry } from "./fetchers.mjs";
import { categorize } from "./categorize.mjs";
import { formatItem, makeSender } from "./telegram.mjs";

const args = process.argv.slice(2);
const flag = n => args.includes(n);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);

const DRY = flag("--dry-run");          // print messages instead of sending; state is not saved unless --state is given
const CHECK = flag("--check");          // only test the sources: fetch + show what was found
const SOURCES_FILE = opt("--sources", "sources.json");
const STATE_FILE = opt("--state", "state/seen.json");
const FAIL_LIMIT = 3;                    // consecutive failed runs before a warning
const MAX_ALERTS_PER_SOURCE = 15;        // safety valve if a site redesign makes everything look new
const MAX_SEEN_PER_SOURCE = 1000;

const sources = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf8")).filter(s => !s.disabled);
let state = { sources: {} };
if (fs.existsSync(STATE_FILE)) state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
state.sources ??= {};

const keyOf = i => (i.title.toLowerCase().replace(/\s+/g, " ") + "|" + i.link).slice(0, 600);

if (CHECK) {
  let bad = 0;
  for (const src of sources) {
    try {
      const items = await fetchItemsWithRetry(src);
      console.log(`OK    ${src.name} — ${items.length} notices`);
      items.slice(0, 3).forEach(i => console.log(`        [${categorize(i.title)}] ${i.title.slice(0, 90)}\n        ${i.link.slice(0, 110)}`));
    } catch (e) { bad++; console.log(`FAIL  ${src.name} — ${e.message}`); }
  }
  process.exit(bad ? 1 : 0);
}

const token = process.env.TELEGRAM_BOT_TOKEN, chatId = process.env.TELEGRAM_CHAT_ID;
if (!DRY && (!token || !chatId)) {
  console.error("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID must be set (GitHub Secrets). Nothing was sent.");
  process.exit(1);
}
const send = makeSender({ token, chatId, dryRun: DRY });

let telegramProblem = false;
const summaries = [];

for (const src of sources) {
  const st = (state.sources[src.id] ??= { initialized: false, seen: {}, fails: 0, warned: false });
  let items;
  try {
    items = await fetchItemsWithRetry(src);
  } catch (e) {
    st.fails++;
    console.log(`FAIL ${src.name} (after retry): ${e.message} (failed ${st.fails} run(s) in a row)`);
    if (st.fails >= FAIL_LIMIT && !st.warned) {
      const ok = await send(`⚠️ <b>${src.name}</b> has failed ${st.fails} runs in a row.\nLast error: ${e.message.replace(/[<>&]/g, "")}\nI'll tell you when it recovers.`);
      if (ok) st.warned = true; else telegramProblem = true;
    }
    continue;
  }

  if (st.warned) {
    if (await send(`✅ <b>${src.name}</b> is back to normal.`)) st.warned = false; else telegramProblem = true;
  }
  st.fails = 0;
  const now = new Date().toISOString();

  if (!st.initialized) {
    items.forEach(i => (st.seen[keyOf(i)] = now));
    st.initialized = true;
    summaries.push(`Now watching <b>${src.name}</b> — ${items.length} existing notices recorded`);
    console.log(`FIRST RUN ${src.name}: recorded ${items.length}`);
    continue;
  }

  const fresh = items.filter(i => !(keyOf(i) in st.seen));
  console.log(`OK ${src.name}: ${items.length} on page, ${fresh.length} new`);
  // page order is newest-first, so send oldest of the new ones first
  const toSend = fresh.slice().reverse();
  const skipped = Math.max(0, toSend.length - MAX_ALERTS_PER_SOURCE);
  for (const i of toSend.slice(skipped)) {
    if (await send(formatItem(src.name, categorize(i.title), i.title, i.link))) st.seen[keyOf(i)] = now;
    else telegramProblem = true; // not marked as seen, so it is retried next run
  }
  if (skipped) {
    if (await send(`ℹ️ <b>${src.name}</b>: ${skipped} more new notices not shown individually (too many at once). Check the site: ${src.url}`))
      toSend.slice(0, skipped).forEach(i => (st.seen[keyOf(i)] = now));
    else telegramProblem = true;
  }

  const keys = Object.keys(st.seen);
  if (keys.length > MAX_SEEN_PER_SOURCE) keys.slice(0, keys.length - MAX_SEEN_PER_SOURCE).forEach(k => delete st.seen[k]);
}

if (summaries.length) {
  if (!(await send("👀 " + summaries.join("\n")))) {
    telegramProblem = true;
    // Summary not delivered: harmless, but say so in the log.
    console.error("Could not deliver the 'now watching' summary.");
  }
}

if (!DRY || flag("--state")) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 1) + "\n");
}
process.exit(telegramProblem ? 1 : 0);
