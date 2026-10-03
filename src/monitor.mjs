import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fetchItemsWithRetry } from "./fetchers.mjs";
import { emptyReminder } from "./emptycheck.mjs";
import { categorize } from "./categorize.mjs";
import { formatItem, formatGroup, makeSender, apiBase } from "./telegram.mjs";
import { buildPlan, levelOf } from "./order.mjs";
import { Classifier, keywordVerdict, loadConfig, noFileDecision, preFilter } from "./classify.mjs";
import { digestHtml, digestsDue, markDigestSent, recordSkips } from "./skipped.mjs";
import { missedRunNote } from "./schedule.mjs";
import { slotOf, slotAlreadyDone } from "./slot.mjs";
import { runCatchScan, catchDirOf } from "./catch.mjs";

const args = process.argv.slice(2);
const flag = n => args.includes(n);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);

const DRY = flag("--dry-run");          // print messages instead of sending; state is not saved unless --state is given
const CHECK = flag("--check");          // only test the sources: fetch + show what was found
const SOURCES_FILE = opt("--sources", "sources.json");
const RUNNER = opt("--runner", null);      // "cloud" or "india": only check sources with this runner (default: all)
const ONLY = opt("--only", null);            // comma-separated source ids: only these (used to test a few sites, e.g. from GitHub cloud)
const STATE_FILE = opt("--state", RUNNER ? `state/seen-${RUNNER}.json` : "state/seen.json");
const FAIL_LIMIT = 3;                    // consecutive failed runs before a warning
const MAX_ALERTS_PER_SOURCE = 15;        // safety valve if a site redesign makes everything look new
const MAX_SEEN_PER_SOURCE = 1000;

const sources = JSON.parse(fs.readFileSync(SOURCES_FILE, "utf8")).filter(s => !s.disabled)
  .filter(s => !RUNNER || (s.runner ?? "cloud") === RUNNER)
  .filter(s => !ONLY || ONLY.split(",").includes(s.id));
let state = { sources: {} };
if (fs.existsSync(STATE_FILE)) state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
state.sources ??= {};

// Time-slot guard (see slot.mjs): a timer / PC-trigger run whose slot was already scanned stops here, before anything is fetched or sent.
const RUN_START_MS = process.env.TEST_NOW_ISO ? Date.parse(process.env.TEST_NOW_ISO) : Date.now();
const RUN_SLOT = slotOf(RUN_START_MS);   // (fixed at the START of the run: a long run does not move into the next slot)
if (!ONLY && !CHECK && slotAlreadyDone(state, RUN_START_MS, process.env.SLOT_GUARD === "true")) {
  console.log(`SKIPPED: the ${RUN_SLOT} (India) scan was already done by an earlier run. Nothing was checked or changed.`);
  process.exit(0);
}

// One-time move of the old GitHub-cloud job's memory into the PC's: sites that used to run on "cloud" carry over what they had
// already seen, so moving them to the PC neither re-baselines them nor floods you with old notices. Only sites the PC state
// does not know yet are copied, so this does nothing on later runs.
const LEGACY_STATE = "state/seen-cloud.json";
if (RUNNER === "india" && fs.existsSync(LEGACY_STATE)) {
  const old = JSON.parse(fs.readFileSync(LEGACY_STATE, "utf8")).sources ?? {};
  for (const src of sources) {
    if (old[src.id] && !state.sources[src.id]?.initialized) {
      state.sources[src.id] = old[src.id];
      console.log(`IMPORTED the saved memory of ${src.name} from ${LEGACY_STATE} (${Object.keys(old[src.id].seen ?? {}).length} notices)`);
    }
  }
}

// A fingerprint of everything that decides WHICH notices a source finds (URL, filters, selectors, limit...).
// If it changes, the source is silently re-baselined (see below) so a wider filter can never flood you with old notices.
// Not part of it: name, runner, tier, level and timeoutMs. Sources saved before this existed have no fingerprint yet: they just get one
// stored, unless sources.json carries "rebaseline": true for them.
const hashOf = rest => crypto.createHash("sha1").update(JSON.stringify(rest)).digest("hex").slice(0, 12);
// (extraCerts is left out too: HOW to connect does not change WHICH notices are found)
const fingerprint = src => { const { name, runner, tier, timeoutMs, level, extraCerts, legacyTls, ...rest } = src; return hashOf(rest); };
// Fingerprints saved before extraCerts was left out still count as "unchanged" (no needless silent re-baseline).
const legacyFingerprint = src => { const { name, runner, tier, timeoutMs, level, legacyTls, ...rest } = src; return hashOf(rest); };

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
// "Send to agents" button under alerts: only when config.json says "sendToAgentsButton": true
let send = makeSender({ token, chatId, dryRun: DRY, button: loadConfig().sendToAgentsButton === true });

// ---- AI classification (see config.json; OFF unless aiEnabled is true) ----
const TEST_AI = flag("--test-ai");       // test the AI step on ONE source's latest 3 notices; changes no files
const cfg = loadConfig();
// CATCH-ONLY mode (config.json "catchOnly", default on): the scan only saves new links into the catch folder (src/catch.mjs) and sends one
// short Telegram message. "catchOnly": false brings back the old way below (keyword/AI checks, one alert per notice, the button).
const CATCH_ONLY = cfg.catchOnly !== false;
const apiKey = process.env.ANTHROPIC_API_KEY;
const SAVES_STATE = !DRY || flag("--state");
let ai = null;
if (!TEST_AI && cfg.aiEnabled) {
  if (!apiKey) console.error("aiEnabled is true but ANTHROPIC_API_KEY is not set: AI classification is OFF for this run.");
  else ai = new Classifier(cfg, {
    apiKey,
    cacheFile: SAVES_STATE ? `state/ai-cache-${RUNNER ?? "all"}.json` : null,
    mergeCacheFrom: RUNNER === "india" ? "state/ai-cache-cloud.json" : null,   // old cloud answers are kept (one-time carry-over)
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
    const note = d.send ? "" : "\n\n(Live mode would NOT alert this: " + (d.skipped ? "skipped by rule: " + d.skipped.rule : d.reason ?? "AI said Not Relevant") + ")";
    if (!(await send(formatItem(src.name, category, i.title, i.link, d.flag, levelOf(src), d.extra) + note, true))) console.error("Telegram send failed");
  }
  console.table(rows);
  console.log(test.summary());
  process.exit(0);
}

// The PC may have just started and Windows may not have its network up yet. Wait a few minutes for it. If there is still no
// internet, stop quietly (exit 0, nothing saved): being offline is not a site failure, and the next run simply tries again.
async function waitForInternet(tries = 8, pauseMs = 30000) {
  for (let i = 1; i <= tries; i++) {
    try { await fetch(apiBase(), { signal: AbortSignal.timeout(15000) }); return true; } catch { /* not reachable yet */ }
    console.log(`No internet yet (attempt ${i}/${tries})` + (i < tries ? `, waiting ${pauseMs / 1000}s ...` : ""));
    if (i < tries) await new Promise(r => setTimeout(r, pauseMs));
  }
  return false;
}
if (!(await waitForInternet())) {
  console.log("OFFLINE: the PC has no internet right now. Nothing was checked or changed; the next run will try again.");
  process.exit(0);
}

const prune = st => {
  const keys = Object.keys(st.seen);
  if (keys.length > MAX_SEEN_PER_SOURCE) keys.slice(0, keys.length - MAX_SEEN_PER_SOURCE).forEach(k => delete st.seen[k]);
};
const clockMs = () => (process.env.TEST_NOW_ISO ? Date.parse(process.env.TEST_NOW_ISO) : Date.now());   // (TEST_NOW_ISO: only the tests set it)

// ---- the OLD way: one alert per notice, with keyword/AI checks, the button, warnings, morning check and digests. Used only when catchOnly is false. ----
async function runAlertScan() {
let telegramProblem = false;
const skippedRun = [];   // notices skipped by a rule in this run: { source, title, rule, link, by }
function noteSkip(sourceName, item, d) {
  if (d.skipped) skippedRun.push({ source: sourceName, title: item.title, rule: d.skipped.rule, link: item.link, by: d.skipped.by });
  if (!ai) console.log(`  [${d.skipped ? "title-skip" : "not-relevant"}] ${sourceName}: ${item.title.slice(0, 90)} (${d.reason ?? d.how})`);   // (with the AI on, the classifier logs it itself)
}
let alertsSent = 0;         // notices announced in this run (for the morning message)
const failures = [];        // sites that could not be read in this run
const pendingAlerts = [];   // notices found in this run; sent together at the end, ordered by level and category (see order.mjs)
const pendingNotes = [];    // "N more not shown" notes, sent after the alerts
const pendingGroups = {};   // group name -> [{ src, st, fresh, now }], sent as one alert per notice after all sources are checked

const summaries = [];

// Missed-run warning: this run starts between 9 am and 10 pm IST and the last successful run is more than 4 hours back (only the
// 9 am - 10 pm hours count, so the first run of the morning does not warn about the night). One short note; a failed note never fails the run.
if (!ONLY) {
  const note = missedRunNote(state, clockMs());
  if (note && !(await send(note))) console.error("Could not deliver the missed-run note.");
}

for (const src of sources) {
  const st = (state.sources[src.id] ??= { initialized: false, seen: {}, fails: 0, warned: false });
  let items;
  try {
    items = await fetchItemsWithRetry(src);
  } catch (e) {
    failures.push({ src, st, e });   // counted after the loop, so a PC that lost its internet is not blamed on every site
    console.log(`FAIL ${src.name} (after retry): ${e.message}`);
    continue;
  }

  if (st.warned) {
    if (await send(`✅ <b>${src.name}</b> is back to normal.`)) st.warned = false; else telegramProblem = true;
  }
  st.fails = 0;
  const now = new Date().toISOString();
  if (src.allowEmpty) {   // an empty list is fine, but 60 days of it deserves a look
    const r = emptyReminder(st, items.length);
    if (r.remind) await send(`ℹ️ <b>${src.name}</b> has listed no notices for ${r.days} days. That may be normal, or the page layout may have changed: worth a quick look: ${src.url}`);
  }

  const fp = fingerprint(src);
  const changed = st.initialized && (st.fp ? st.fp !== fp && st.fp !== legacyFingerprint(src) : src.rebaseline === true);
  if (!st.initialized || changed) {
    // Silent baseline: everything on the page right now is recorded as already seen. No alerts, no AI calls.
    items.forEach(i => (st.seen[keyOf(i)] = now));
    st.initialized = true;
    st.fp = fp;
    summaries.push(changed
      ? `Updated <b>${src.name}</b> — ${items.length} notices on the page recorded (no alerts for these)`
      : `Now watching <b>${src.name}</b> — ${items.length} existing notices recorded`);
    console.log(`${changed ? "RE-BASELINE" : "FIRST RUN"} ${src.name}: recorded ${items.length}`);
    prune(st);
    continue;
  }
  st.fp = fp;   // (also moves a legacy fingerprint over to the current form)

  const fresh = items.filter(i => !(keyOf(i) in st.seen));
  console.log(`OK ${src.name}: ${items.length} on page, ${fresh.length} new`);
  if (src.group) { (pendingGroups[src.group] ??= []).push({ src, st, fresh, now }); prune(st); continue; }
  // page order is newest-first, so send oldest of the new ones first
  const toSend = fresh.slice().reverse();
  const skipped = Math.max(0, toSend.length - MAX_ALERTS_PER_SOURCE);
  for (const i of toSend.slice(skipped)) {
    // free title/file-type pre-check first (the classifier does it itself when the AI is on). noFileDownload: never open the file, AI on or off
    const d = src.noFileDownload ? (preFilter(i) ?? noFileDecision(i)) : ai ? await ai.decide(src, i) : (preFilter(i) ?? NO_AI);
    if (!d.send) { st.seen[keyOf(i)] = now; noteSkip(src.name, i, d); continue; }   // skipped by a rule / Not Relevant / a form: no alert (logged; rule skips go in the daily digest)
    const category = d.category ?? categorize(i.title), level = levelOf(src);
    // marked as seen only once it is really sent; if sending fails it is retried next run
    pendingAlerts.push({ level, category, html: formatItem(src.name, category, i.title, i.link, d.flag, level, d.extra), onSent: () => (st.seen[keyOf(i)] = now) });
  }
  if (skipped) pendingNotes.push({ html: `ℹ️ <b>${src.name}</b>: ${skipped} more new notices not shown individually (too many at once). Check the site: ${src.url}`, onSent: () => toSend.slice(0, skipped).forEach(i => (st.seen[keyOf(i)] = now)) });

  prune(st);
}

// Failures. If (nearly) EVERY site failed, the internet dropped during the run: that is not the sites' fault, so nobody's
// "runs in a row" counter goes up. Otherwise each failed site counts, and you get one warning after FAIL_LIMIT runs in a row.
const networkDown = sources.length >= 5 && failures.length >= sources.length * 0.9;
if (networkDown) console.log(`Almost every site failed (${failures.length}/${sources.length}): treating it as a lost connection, not counting failures.`);
else for (const { src, st, e } of failures) {
  st.fails++;
  console.log(`${src.name} has now failed ${st.fails} run(s) in a row`);
  if (st.fails >= FAIL_LIMIT && !st.warned) {
    const ok = await send(`⚠️ <b>${src.name}</b> has failed ${st.fails} runs in a row.
Last error: ${e.message.replace(/[<>&]/g, "")}
I'll tell you when it recovers.`);
    if (ok) st.warned = true; else telegramProblem = true;
  }
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
    const gItem = { title: k, link: `group:${group}:${k}` };
    const d = ai ? await ai.decide(hits[0].mem.src, gItem) : (preFilter(gItem) ?? NO_AI);
    if (!d.send) { gs.seen[k] = now; markSeen(hits, now); noteSkip(hits[0].mem.src.groupName ?? group, gItem, d); continue; }
    const category = d.category ?? categorize(k), level = levelOf(hits[0].mem.src);
    pendingAlerts.push({ level, category, html: formatGroup(hits[0].mem.src.groupName ?? group, category, k, regions, members.length, hits[0].i.link, d.flag, level, d.extra), onSent: () => { gs.seen[k] = now; markSeen(hits, now); } });
  }
  if (skipped) pendingNotes.push({ html: `ℹ️ <b>${group}</b>: ${skipped} more new notices not shown individually (too many at once).`, onSent: () => toAnnounce.slice(0, skipped).forEach(([k, hits]) => { gs.seen[k] = now; markSeen(hits, now); }) });
  const gk = Object.keys(gs.seen);
  if (gk.length > 2000) gk.slice(0, gk.length - 2000).forEach(k => delete gs.seen[k]);
}

// Send everything found in this run: one summary, then Central (Jobs, Admit Cards, Results, Other), then State. Nothing new = nothing sent.
// If the summary or a level/category header cannot be sent, the notices are still tried (their own send decides "seen").
recordSkips(state, skippedRun, clockMs());   // remembered for the daily digest
for (const m of buildPlan(pendingAlerts, skippedRun.length)) {
  const ok = await send(m.html, !!m.alert);
  if (m.alert) { if (ok) { m.alert.onSent(); alertsSent++; } else telegramProblem = true; }
  else if (!ok) console.error("Could not deliver a summary/heading message (the notices themselves are unaffected).");
}
for (const n of pendingNotes) { if (await send(n.html)) n.onSent(); else telegramProblem = true; }

// Daily digest of everything skipped by the rules: with the last run of the day (from 9:00 pm Indian time: the 9:30 pm run), or with the first run of the
// next day if the PC was off then. Nothing skipped = nothing sent.
// A failed digest is not marked as sent, so the next run tries again; it never fails the run.
if (!ONLY) for (const due of digestsDue(state, clockMs())) {
  if (await send(digestHtml(due))) markDigestSent(due); else console.error("Could not deliver the skipped digest (it will be tried again next run).");
}

if (summaries.length) {
  if (!(await send("👀 " + summaries.join("\n")))) {
    // Summary not delivered: harmless (the sources ARE recorded), so it never fails the run. Just say so in the log.
    console.error("Could not deliver the 'now watching' summary.");
  }
}

// Morning check: once per day (Indian time), on the first complete run at or after 06:00, so you know the system started.
if (!ONLY && !networkDown) {
  const ist = new Date(clockMs() + 5.5 * 3600 * 1000), today = ist.toISOString().slice(0, 10);
  if (ist.getUTCHours() >= 6 && state.morning !== today) {   // the first complete run of the day sends it
    const msg = `☀️ Morning check done: ${sources.length} sites, ${alertsSent} new notice${alertsSent === 1 ? "" : "s"}, ${failures.length} failed`;
    if (await send(msg)) state.morning = today; else telegramProblem = true;
  }
}

if (!ONLY && !networkDown) { state.lastRunAt = new Date(clockMs()).toISOString(); state.lastSlot = RUN_SLOT; }   // for the missed-run warning and the time-slot guard
if (ai) { console.log(ai.summary()); if (SAVES_STATE) ai.save(); }
if (SAVES_STATE) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 1) + "\n");
}
// (not process.exit(): on Windows, exiting while an HTTP connection is still closing can abort Node with a libuv assertion and a
// wrong exit code 3221226505. Setting exitCode lets the last connections close, then the process ends by itself.)
process.exitCode = telegramProblem ? 1 : 0;
}

if (CATCH_ONLY) {
  const result = await runCatchScan({
    sources, state, send, now: new Date(clockMs()), onlyTest: !!ONLY, runSlot: RUN_SLOT,
    catchDir: catchDirOf(cfg, opt("--catch-dir", null)),
    scrapflyKey: process.env.SCRAPFLY_KEY,   // read ONLY from the Windows environment variable; never from a file
    fingerprint, legacyFingerprint, keyOf, prune,
  });
  if (result.saveState && SAVES_STATE) {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 1) + "\n");
  }
  process.exitCode = result.exitCode;
} else await runAlertScan();
