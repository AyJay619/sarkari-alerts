// CATCH-ONLY scan (config.json "catchOnly": true): fetch every watched page, keep only the links never seen before, and save them
// as ONE file per scan in <inboxDir>\catch\ (YYYY-MM-DD_HHMM.json). Nothing is judged or classified here, and no Claude API is used.
// The catch file also lists the result of EVERY site: OK (with its link count) or FAILED (with the reason), so a broken site can never
// look like a site with 0 new links.
//
// Two groups ("tier" in sources.json): FREE sites run first; SCRAPFLY sites run only after all FREE sites are done, only when the
// Windows environment variable SCRAPFLY_KEY is set, and their credits are counted per site, per scan and per month (state.scrapfly).
import fs from "node:fs";
import path from "node:path";
import { fetchItems } from "./fetchers.mjs";
import { esc } from "./telegram.mjs";

const two = n => String(n).padStart(2, "0");
const localDate = d => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;
export const catchFileBase = d => `${localDate(d)}_${two(d.getHours())}${two(d.getMinutes())}`;   // 2026-10-03_0930
export const FLOOD_LIMIT = 15;   // more new links than this from ONE site in ONE scan = "possible flood" (kept, but flagged for the sorter)
export const tierOf = src => (src.tier === "SCRAPFLY" ? "SCRAPFLY" : "FREE");

// Link normalising for the "already seen" check, for ALL sites: the same file written a little differently is the same link.
// Ignored: http vs https, www vs no www, double slashes in the path, a #fragment, and encoded vs raw characters (%28 = "(").
// Only the COMPARISON uses this; the link that is saved in the catch file stays exactly as the site gives it.
// Version / cache-busting parameters (a site release that bumps "?v=1.4.93" to "?v=1.4.94" on every file link) are ignored too.
const BUST_NAMES = "v|ver|version|_v|cb|cache|cachebust|cache_bust|nocache|_|ts|timestamp|rnd|rand|random";
const BUST_PARAM = new RegExp("^(" + BUST_NAMES + ")$", "i");
export function normalizeLink(link) {
  const dec = t => { try { return decodeURIComponent(t); } catch { return t; } };
  const raw = String(link ?? "").trim();
  try {
    const u = new URL(raw);
    const pathname = dec(u.pathname).replace(/\/{2,}/g, "/");
    let search = u.search;
    if (search) {   // only a link that really has such a parameter is re-written; all other queries stay exactly as before
      const ps = new URLSearchParams(search);
      const hit = [...ps.keys()].filter(k => BUST_PARAM.test(k));
      if (hit.length) { hit.forEach(k => ps.delete(k)); search = ps.toString() ? "?" + ps.toString() : ""; }
    }
    return u.hostname.toLowerCase().replace(/^www\./, "") + (u.port ? ":" + u.port : "") + pathname + dec(search);
  } catch {
    return dec(raw).replace(/^https?:\/\/(www\.)?/i, "").replace(/([^:])\/{2,}/g, "$1/").replace(new RegExp("[?&](" + BUST_NAMES + ")=[^&#]*", "gi"), "");
  }
}
// "title|link" (the seen record's key form, see keyOf in monitor.mjs) -> "title|normalised link"
const normKeyOf = (title, link) => (String(title).toLowerCase().replace(/\s+/g, " ") + "|" + normalizeLink(link)).slice(0, 600);
// Everything a site has already seen, in normalised form. The stored keys keep their old spelling, so nothing already seen looks new
// after this change (no mass re-catch): each stored key is normalised here when the scan starts.
function seenSetOf(st) {
  const set = new Set();
  for (const k of Object.keys(st.seen)) {
    const cut = k.lastIndexOf("|");
    set.add(cut < 0 ? k : normKeyOf(k.slice(0, cut), k.slice(cut + 1)));
  }
  return set;
}

// Where the catch files go: --catch-dir, else <inboxDir>\catch (config.json "inboxDir")
export const catchDirOf = (cfg, override) => path.resolve(override || path.join(cfg.inboxDir || "C:\\Dev\\sarkari-inbox", "catch"));

// Writes the file under a name nobody has used yet (two scans in the same minute get "_HHMM-2"), via a temp file so a half-written file never appears.
export function writeCatchFile(dir, when, data) {
  fs.mkdirSync(dir, { recursive: true });
  const base = catchFileBase(when);
  let file = path.join(dir, base + ".json");
  for (let n = 2; fs.existsSync(file); n++) file = path.join(dir, `${base}-${n}.json`);
  fs.writeFileSync(file + ".tmp", JSON.stringify(data, null, 2) + "\n");
  fs.renameSync(file + ".tmp", file);
  return file;
}

// The ONE Telegram message of a scan, e.g.
//   Scan done: 41 new links from 30 sites. Failed: IOCL, HAL.
//   ScrapFly: 6 links, 48 credits (month: 1,920).
export const REPEAT_FAIL_LIMIT = 3;   // the same site FAILED in this many scans in a row = "needs audit" line in the Telegram message
export function scanMessage({ newLinks, sitesWithNew, failed, floods = [], repeat = [], repeatLimit = REPEAT_FAIL_LIMIT, networkDown, scrapfly }) {
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const names = esc(failed.length > 12 ? failed.slice(0, 12).join(", ") + ` and ${failed.length - 12} more` : failed.join(", "));
  const head = `Scan done: ${plural(newLinks, "new link")} from ${plural(sitesWithNew, "site")}. Failed: ${failed.length ? names : "none"}.`;
  const lines = [networkDown ? "⚠️ Almost every site failed, so the internet probably dropped.\n" + head : head];
  // a site that keeps failing: one line each (counts up every scan until it works again)
  for (const r of repeat.slice(0, 8)) lines.push(`${esc(r.name)} failed ${r.n} scans in a row - needs audit`);
  if (repeat.length > 8) lines.push(`and ${repeat.length - 8} more sites failed ${repeatLimit} or more scans in a row - needs audit`);
  if (floods.length) lines.push(`⚠️ Possible flood (marked in the catch file, sorter please check): ${floods.slice(0, 10).join(", ")}${floods.length > 10 ? ` and ${floods.length - 10} more` : ""}.`);
  if (scrapfly.configured) {
    lines.push(scrapfly.ran
      ? `ScrapFly: ${plural(scrapfly.newLinks, "link")}, ${scrapfly.credits.toLocaleString("en-US")} credits (month: ${scrapfly.monthTotal.toLocaleString("en-US")}).` +
        (scrapfly.failed.length ? ` ScrapFly failed: ${scrapfly.failed.join(", ")}.` : "")
      : `ScrapFly: SKIPPED, no SCRAPFLY_KEY found (${plural(scrapfly.sites, "site")} not scanned).`);
  }
  return lines.join("\n");
}

// ctx: { sources, state, send, dry, onlyTest, now (Date), catchDir, runSlot, fingerprint, legacyFingerprint, keyOf, prune, scrapflyKey, floodLimit, scrapflyCreditLimit, scrapflyRetryMinLeft }
// Returns { file, exitCode, message }. The seen-links record (ctx.state) is changed in memory only; the caller saves it AFTER this returns,
// i.e. only once the catch file really exists, so a link is never marked "seen" without having been written down.
export async function runCatchScan(ctx) {
  const { sources, state, send, now, keyOf, prune } = ctx;
  const floodLimit = ctx.floodLimit ?? FLOOD_LIMIT;
  const startedAt = new Date();
  const stamp = now.toISOString();
  const results = [];     // one per site
  const items = [];       // the new links
  const groupHits = {};   // group -> [{ src, fresh, st }]
  const resOf = new Map();   // site id -> its result row (a retry updates the same row)
  const metaOf = new Map();  // SCRAPFLY site id -> { credits } (counts BOTH tries)

  // One try at one site. Returns null when it worked, or { src, st, res } when it failed (the caller may retry it once, at the end of its group).
  // A site is only really FAILED when its retry fails too: the first failure is kept in "first_try_reason".
  async function scanSite(src, meta, isRetry = false) {
    const st = (state.sources[src.id] ??= { initialized: false, seen: {}, fails: 0, warned: false });
    let res = resOf.get(src.id);
    if (!res) { res = { site: src.name, id: src.id, tier: tierOf(src) }; resOf.set(src.id, res); results.push(res); }
    let found;
    try {
      found = await fetchItems(src, meta);   // (one try only: failures are retried at the end of the group, see below)
    } catch (e) {
      const reason = String(e.reason ?? e.message).slice(0, 300);
      if (isRetry) res.first_try_reason = res.reason;
      Object.assign(res, { status: "FAILED", reason });
      if (isRetry) res.retried = true;
      if (meta) res.credits = meta.credits ?? 0;
      console.log(`FAILED ${src.name}${isRetry ? " (after retry)" : ""}: ${e.message}`);
      return { src, st, res, e };
    }
    st.fails = 0;
    st.warned = false;
    if (isRetry) { res.first_try_reason = res.reason; res.retried = true; res.note = "OK on the retry at the end of the scan"; delete res.reason; }
    Object.assign(res, { status: "OK", links: found.length });
    if (meta) res.credits = meta.credits ?? 0;
    const fp = ctx.fingerprint(src);
    const changed = st.initialized && (st.fp ? st.fp !== fp && st.fp !== ctx.legacyFingerprint(src) : src.rebaseline === true);
    if (!st.initialized || changed) {
      // First time (or its settings changed): everything on the page now is recorded as already seen; nothing is caught.
      found.forEach(i => (st.seen[keyOf(i)] = stamp));
      st.initialized = true;
      st.fp = fp;
      Object.assign(res, { new_links: 0, note: [res.note, changed ? "settings changed: page recorded as already seen, nothing caught" : "first scan of this site: page recorded as already seen, nothing caught"].filter(Boolean).join("; ") });
      console.log(`${changed ? "RE-BASELINE" : "FIRST RUN"} ${src.name}: recorded ${found.length}`);
      prune(st);
      return null;
    }
    st.fp = fp;
    const seenNow = seenSetOf(st);
    const fresh = found.filter(i => {
      const nk = normKeyOf(i.title, i.link);
      if (keyOf(i) in st.seen || seenNow.has(nk)) return false;
      seenNow.add(nk);   // (the same link twice on one page is caught once)
      return true;
    });
    res.new_links = fresh.length;
    const flood = fresh.length > floodLimit;
    if (flood) { res.possible_flood = true; console.log(`POSSIBLE FLOOD ${src.name}: ${fresh.length} new links at once`); }
    console.log(`OK ${src.name}: ${found.length} on page, ${fresh.length} new`);
    if (src.group) { (groupHits[src.group] ??= []).push({ src, fresh, st, flood }); return null; }
    for (const i of fresh) {
      st.seen[keyOf(i)] = stamp;
      items.push({ site: src.name, group: null, page_url: src.url, title: i.title, link: i.link, first_seen: stamp, ...(flood ? { possible_flood: true } : {}) });
    }
    prune(st);
    return null;
  }

  // Every site that failed gets ONE more try after all the other sites of its group (a timeout or a dropped connection is
  // often over a few minutes later). Not when almost everything failed (the internet is down: the whole scan would only take twice as long).
  // note: the note field of a retried-OK site says so; a still-failing site keeps retried: true and both reasons.
  const looksOffline = (failed, total) => total >= 5 && failed.length >= total * 0.9;

  // ---- 1. FREE group ----
  const free = sources.filter(s => tierOf(s) === "FREE");
  const paid = sources.filter(s => tierOf(s) === "SCRAPFLY");
  let stillFailed = [];   // sites whose last try failed
  const firstFree = [];
  for (const src of free) { const f = await scanSite(src); if (f) firstFree.push(f); }
  if (looksOffline(firstFree, free.length)) { console.log(`Almost every FREE site failed (${firstFree.length}/${free.length}): no retries, the internet is probably down.`); stillFailed.push(...firstFree); }
  else for (const f of firstFree) {
    console.log(`RETRY ${f.src.name} (second and last try)`);
    const again = await scanSite(f.src, undefined, true);
    if (again) stillFailed.push(again);
  }

  // ---- 2. SCRAPFLY group: only after FREE has finished, and only with a key ----
  const month = localDate(startedAt).slice(0, 7);
  if (state.scrapfly?.month !== month) state.scrapfly = { month, credits: 0 };
  const scrapfly = { configured: paid.length > 0, ran: false, sites: paid.length, newLinks: 0, credits: 0, monthTotal: state.scrapfly.credits, failed: [] };
  if (paid.length && !ctx.scrapflyKey) {
    console.log(`SCRAPFLY group skipped: SCRAPFLY_KEY is not set (${paid.length} sites not scanned).`);
    for (const src of paid) results.push({ site: src.name, id: src.id, tier: "SCRAPFLY", status: "SKIPPED", reason: "SCRAPFLY_KEY is not set in the Windows environment variables" });
  } else if (paid.length) {
    scrapfly.ran = true;
    // credits are counted after EVERY try, so the retry guard below always sees the real month total
    const charged = async (src, isRetry) => {
      const meta = metaOf.get(src.id) ?? (metaOf.set(src.id, { credits: 0 }), metaOf.get(src.id));
      const before = meta.credits;
      const f = await scanSite(src, meta, isRetry);
      scrapfly.credits += meta.credits - before;
      state.scrapfly.credits += meta.credits - before;
      return f;
    };
    const firstPaid = [];
    for (const src of paid) { const f = await charged(src, false); if (f) firstPaid.push(f); }
    // The retry costs credits again, so it only runs while enough credits are left this month:
    // config.json "scrapflyCreditLimit" (credits the plan gives per month) minus the month total so far must be at least "scrapflyRetryMinLeft".
    // No limit configured = no retries (the safe way round).
    const limit = ctx.scrapflyCreditLimit, minLeft = ctx.scrapflyRetryMinLeft ?? 100;
    for (const f of firstPaid) {
      const left = typeof limit === "number" ? limit - state.scrapfly.credits : null;
      if (left === null || left < minLeft) {
        f.res.retry_skipped = left === null ? "no retry: scrapflyCreditLimit is not set in config.json" : `no retry: only ${left} ScrapFly credits left this month (safe limit is ${minLeft})`;
        console.log(`RETRY SKIPPED ${f.src.name}: ${f.res.retry_skipped}`);
        stillFailed.push(f);
        continue;
      }
      console.log(`RETRY ${f.src.name} (second and last try)`);
      const again = await charged(f.src, true);
      if (again) stillFailed.push(again);
    }
    scrapfly.monthTotal = state.scrapfly.credits;
  }

  // ---- grouped sites (e.g. the 21 RRB sites): a notice already caught under another site of the group is not caught twice ----
  for (const [group, members] of Object.entries(groupHits)) {
    const gs = ((state.groups ??= {})[group] ??= { seen: {} });
    const byTitle = new Map();
    for (const mem of members) for (const i of mem.fresh) {
      const k = i.groupTitle ?? i.title;
      if (!byTitle.has(k)) byTitle.set(k, []);
      byTitle.get(k).push({ mem, i });
    }
    for (const [k, hits] of byTitle) {
      hits.forEach(({ mem, i }) => (mem.st.seen[keyOf(i)] = stamp));
      if (k in gs.seen) continue;
      gs.seen[k] = stamp;
      const first = hits[0], others = [...new Set(hits.slice(1).map(h => h.mem.src.name))];
      items.push({ site: first.mem.src.name, group: first.mem.src.groupName ?? group, page_url: first.mem.src.url, title: first.i.title, link: first.i.link, first_seen: stamp, ...(others.length ? { also_on: others } : {}), ...(first.mem.flood ? { possible_flood: true } : {}) });
    }
    members.forEach(m => prune(m.st));
    const gk = Object.keys(gs.seen);
    if (gk.length > 2000) gk.slice(0, gk.length - 2000).forEach(k => delete gs.seen[k]);
  }
  scrapfly.newLinks = items.filter(i => paid.some(p => p.name === i.site)).length;
  const failedNow = stillFailed;   // { src, st, res, e }: the sites that are FAILED in the end
  scrapfly.failed = failedNow.filter(f => tierOf(f.src) === "SCRAPFLY").map(f => f.src.name);

  // ---- failures: if (nearly) EVERY site failed, the internet dropped: nobody's "in a row" counter goes up ----
  const attempted = results.filter(r => r.status !== "SKIPPED").length;
  const networkDown = attempted >= 5 && failedNow.length >= attempted * 0.9;
  if (networkDown) console.log(`Almost every site failed (${failedNow.length}/${attempted}): treating it as a lost connection, not counting failures.`);
  else for (const { st, res } of failedNow) { st.fails++; res.failed_scans_in_a_row = st.fails; }

  // ---- repeat failures: the counter lives in the seen record (state.sources[id].fails), so it survives between scans and resets on the first success ----
  const repeatLimit = ctx.repeatFailLimit ?? REPEAT_FAIL_LIMIT;
  const repeat = networkDown ? [] : failedNow.filter(f => f.st.fails >= repeatLimit).map(f => { f.res.repeat_failure = true; return { name: f.src.name, n: f.st.fails }; });

  // ---- the catch file ----
  const sitesWithNew = new Set(items.map(i => i.site)).size;
  const failedNames = failedNow.map(f => f.src.name);
  const floods = results.filter(r => r.possible_flood).map(r => `${r.site} (${r.new_links})`);
  const data = {
    scan_started: startedAt.toISOString(),
    scan_finished: new Date().toISOString(),
    summary: {
      sites_scanned: attempted,
      sites_ok: results.filter(r => r.status === "OK").length,
      sites_failed: failedNow.length,
      sites_retried: results.filter(r => r.retried).length,
      sites_ok_on_retry: results.filter(r => r.retried && r.status === "OK").length,
      sites_skipped: results.filter(r => r.status === "SKIPPED").length,
      new_links: items.length,
      sites_with_new_links: sitesWithNew,
      possible_flood_sites: floods.length,
      repeat_failure_sites: repeat.length,
      ...(networkDown ? { warning: "almost every site failed: the internet probably dropped during this scan" } : {}),
    },
    scrapfly: paid.length
      ? { group_ran: scrapfly.ran, ...(scrapfly.ran ? {} : { skipped_because: "SCRAPFLY_KEY is not set in the Windows environment variables" }), credits_this_scan: scrapfly.credits, credits_this_month: scrapfly.monthTotal, month }
      : { group_ran: false, note: "no sites are in the SCRAPFLY group" },
    sites: results,
    items,
  };
  let file;
  try { file = writeCatchFile(ctx.catchDir, startedAt, data); }
  catch (e) { console.error(`Could not write the catch file: ${e.message}. The seen-links record will NOT be saved, so nothing is lost.`); return { file: null, exitCode: 1, saveState: false }; }
  console.log(`CATCH FILE: ${file} (${items.length} new links, ${failedNow.length} failed sites)`);

  // ---- the one Telegram message ----
  const message = scanMessage({ newLinks: items.length, sitesWithNew, failed: failedNames, floods, repeat, repeatLimit, networkDown, scrapfly });
  const delivered = await send(message);
  if (!delivered) console.error("Could not deliver the scan message to Telegram.");

  if (!ctx.onlyTest && !networkDown) { state.lastRunAt = now.toISOString(); state.lastSlot = ctx.runSlot; }   // for the time-slot guard
  return { file, exitCode: delivered ? 0 : 1, saveState: true, message };
}
