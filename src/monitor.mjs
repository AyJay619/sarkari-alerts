import fs from "node:fs";
import path from "node:path";
import { fetchItemsWithRetry } from "./fetchers.mjs";
import { categorize } from "./categorize.mjs";
import { formatItem, formatGroup, makeSender } from "./telegram.mjs";
import { Classifier, keywordVerdict, loadConfig } from "./classify.mjs";

const args = process.argv.slice(2);
const flag = n => args.includes(n);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);

const DRY = flag("--dry-run");          // print messages instead of sending; state is not saved unless --state is given
const CHECK = flag("--check");          // only test the sources: fetch + show what was found
const SOURCES_FILE = opt("--sources", "sources.json");
const RUNNER = opt("--runner", null);      // "cloud" or "india": only check sources with this runner (default: all)
const STATE_FILE = opt("--state", RUNNER ? `state/seen-${RUNNER}.json` : "state/seen.json");
const FAIL_LIMIT = 3;                    // consecutive failed runs before a warning
const MAX_ALERTS_PER_SOURCE = 15;        // safety valve if a site redesign makes everything look new
const MAX_SEEN_PER_SOURCE = 1000;

const sources = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf8")).filter(s => !s.disabled)
  .filter(s => !RUNNER || (s.runner ?? "cloud") === RUNNER);
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
let send = makeSender({ token, chatId, dryRun: DRY });

// ---- AI classification (see config.json; OFF unless aiEnabled is true) ----
const TEST_AI = flag("--test-ai");       // test the AI step on ONE source's latest 3 notices; changes no files
const cfg = loadConfig();
const apiKey = process.env.ANTHROPIC_API_KEY;
const SAVES_STATE = !DRY || flag("--state");
let ai = null;
if (!TEST_AI && cfg.aiEnabled) {
  if (!apiKey) console.error("aiEnabled is true but ANTHROPIC_API_KEY is not set: AI classification is OFF for this run.");
  else ai = new Classifier(cfg, {
    apiKey,
    cacheFile: SAVES_STATE ? `state/ai-cache-${RUNNER ?? "all"}.json` : null,
    logFile: SAVES_STATE ? `state/ai-log-${RUNNER ?? "all"}.jsonl` : null,
  });
}
const NO_AI = { send: true, category: null, flag: null };

if (TEST_AI) {
  if (!apiKey) { console.error("Set ANTHROPIC_API_KEY (in your own terminal) to run the AI test."); process.exit(1); }
  const srcId = opt("--test-source", "ssc");
  const src = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf8")).find(s => s.id === srcId);
  if (!src) { console.error(`No source with id "${srcId}".`); process.exit(1); }
  const realSend = send;
  send = (html, withButton) => realSend("🧪 <b>TEST</b>\n" + html, withButton);
  const test = new Classifier(cfg, { apiKey, force: true });   // force: use the AI even when keywords could decide; no cache/log files written
  const items = (await fetchItemsWithRetry(src)).slice(0, 3);
  console.log("\nTEST MODE: " + src.name + ", latest " + items.length + " notices. No state, cache or log files are changed.\n");
  const rows = [];
  for (const i of items) {
    const d = await test.decide(src, i);
    const category = d.category ?? categorize(i.title);
    rows.push({ title: i.title.slice(0, 70), keywords: keywordVerdict(i.title), "AI chose": d.how === "AI" ? d.category : "(" + d.how + ")", flag: d.flag ?? "", "live mode": d.send ? "sends" : "would NOT send" });
    const note = d.send ? "" : "\n\n(Live mode would NOT send this: AI said Not Relevant)";
    if (!(await send(formatItem(src.name, category, i.title, i.link, d.flag) + note, true))) console.error("Telegram send failed");
  }
  console.table(rows);
  console.log(test.summary());
  process.exit(0);
}

let telegramProblem = false;
const pendingGroups = {};   // group name -> [{ src, st, fresh, now }], sent as one alert per notice after all sources are checked

const prune = st => {
  const keys = Object.keys(st.seen);
  if (keys.length > MAX_SEEN_PER_SOURCE) keys.slice(0, keys.length - MAX_SEEN_PER_SOURCE).forEach(k => delete st.seen[k]);
};
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
  if (src.group) { (pendingGroups[src.group] ??= []).push({ src, st, fresh, now }); prune(st); continue; }
  // page order is newest-first, so send oldest of the new ones first
  const toSend = fresh.slice().reverse();
  const skipped = Math.max(0, toSend.length - MAX_ALERTS_PER_SOURCE);
  for (const i of toSend.slice(skipped)) {
    const d = ai ? await ai.decide(src, i) : NO_AI;
    if (!d.send) { st.seen[keyOf(i)] = now; continue; }   // "Not Relevant": not sent, written to the review log
    if (await send(formatItem(src.name, d.category ?? categorize(i.title), i.title, i.link, d.flag), true)) st.seen[keyOf(i)] = now;
    else telegramProblem = true; // not marked as seen, so it is retried next run
  }
  if (skipped) {
    if (await send(`ℹ️ <b>${src.name}</b>: ${skipped} more new notices not shown individually (too many at once). Check the site: ${src.url}`))
      toSend.slice(0, skipped).forEach(i => (st.seen[keyOf(i)] = now));
    else telegramProblem = true;
  }

  prune(st);
}

// Grouped sources (e.g. the 21 RRB sites): one alert per notice, listing the sites that posted it.
// A site that shows a notice AFTER it was already announced is recorded silently (no second alert).
for (const [group, members] of Object.entries(pendingGroups)) {
  const gs = ((state.groups ??= {})[group] ??= { seen: {} });
  const byTitle = new Map();
  for (const mem of members) for (const i of mem.fresh) {
    const k = i.groupTitle ?? i.title;
    if (!byTitle.has(k)) byTitle.set(k, []);
    byTitle.get(k).push({ mem, i });
  }
  const markSeen = (hits, now) => hits.forEach(({ mem, i }) => (mem.st.seen[keyOf(i)] = now));
  const now = new Date().toISOString();
  const toAnnounce = [];
  for (const [k, hits] of byTitle) {
    if (k in gs.seen) markSeen(hits, now); else toAnnounce.push([k, hits]);
  }
  toAnnounce.reverse();   // oldest first
  const skipped = Math.max(0, toAnnounce.length - MAX_ALERTS_PER_SOURCE);
  for (const [k, hits] of toAnnounce.slice(skipped)) {
    const regions = [...new Set(hits.map(h => h.mem.src.region ?? h.mem.src.name))];
    // One AI decision for the whole group (cached under the group's title, not one region's link)
    const d = ai ? await ai.decide(hits[0].mem.src, { title: k, link: `group:${group}:${k}` }) : NO_AI;
    if (!d.send) { gs.seen[k] = now; markSeen(hits, now); continue; }
    const msg = formatGroup(hits[0].mem.src.groupName ?? group, d.category ?? categorize(k), k, regions, members.length, hits[0].i.link, d.flag);
    if (await send(msg, true)) { gs.seen[k] = now; markSeen(hits, now); } else telegramProblem = true;
  }
  if (skipped) {
    if (await send(`ℹ️ <b>${group}</b>: ${skipped} more new notices not shown individually (too many at once).`))
      toAnnounce.slice(0, skipped).forEach(([k, hits]) => { gs.seen[k] = now; markSeen(hits, now); });
    else telegramProblem = true;
  }
  const gk = Object.keys(gs.seen);
  if (gk.length > 2000) gk.slice(0, gk.length - 2000).forEach(k => delete gs.seen[k]);
}

if (summaries.length) {
  if (!(await send("👀 " + summaries.join("\n")))) {
    telegramProblem = true;
    // Summary not delivered: harmless, but say so in the log.
    console.error("Could not deliver the 'now watching' summary.");
  }
}

if (ai) { console.log(ai.summary()); if (SAVES_STATE) ai.save(); }
if (SAVES_STATE) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 1) + "\n");
}
process.exit(telegramProblem ? 1 : 0);
