// CATCH-ONLY scan (config.json "catchOnly": true): fetch every watched page, keep only the links never seen before, and save them
// as ONE file per scan in <inboxDir>\catch\ (YYYY-MM-DD_HHMM.json). Nothing is judged or classified here, and no Claude API is used.
// The catch file also lists the result of EVERY site: OK (with its link count) or FAILED (with the reason), so a broken site can never
// look like a site with 0 new links.
//
// Two groups ("tier" in sources.json): FREE sites run first; SCRAPFLY sites run only after all FREE sites are done, only when the
// Windows environment variable SCRAPFLY_KEY is set, and their credits are counted per site, per scan and per month (state.scrapfly).
import fs from "node:fs";
import path from "node:path";
import { fetchItemsWithRetry } from "./fetchers.mjs";

const two = n => String(n).padStart(2, "0");
const localDate = d => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;
export const catchFileBase = d => `${localDate(d)}_${two(d.getHours())}${two(d.getMinutes())}`;   // 2026-10-03_0930
export const tierOf = src => (src.tier === "SCRAPFLY" ? "SCRAPFLY" : "FREE");

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
export function scanMessage({ newLinks, sitesWithNew, failed, networkDown, scrapfly }) {
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const names = failed.length > 12 ? failed.slice(0, 12).join(", ") + ` and ${failed.length - 12} more` : failed.join(", ");
  const head = `Scan done: ${plural(newLinks, "new link")} from ${plural(sitesWithNew, "site")}. Failed: ${failed.length ? names : "none"}.`;
  const lines = [networkDown ? "⚠️ Almost every site failed, so the internet probably dropped.\n" + head : head];
  if (scrapfly.configured) {
    lines.push(scrapfly.ran
      ? `ScrapFly: ${plural(scrapfly.newLinks, "link")}, ${scrapfly.credits.toLocaleString("en-US")} credits (month: ${scrapfly.monthTotal.toLocaleString("en-US")}).` +
        (scrapfly.failed.length ? ` ScrapFly failed: ${scrapfly.failed.join(", ")}.` : "")
      : `ScrapFly: SKIPPED, no SCRAPFLY_KEY found (${plural(scrapfly.sites, "site")} not scanned).`);
  }
  return lines.join("\n");
}

// ctx: { sources, state, send, dry, onlyTest, now (Date), catchDir, runSlot, fingerprint, legacyFingerprint, keyOf, prune, scrapflyKey }
// Returns { file, exitCode, message }. The seen-links record (ctx.state) is changed in memory only; the caller saves it AFTER this returns,
// i.e. only once the catch file really exists, so a link is never marked "seen" without having been written down.
export async function runCatchScan(ctx) {
  const { sources, state, send, now, keyOf, prune } = ctx;
  const startedAt = new Date();
  const stamp = now.toISOString();
  const results = [];     // one per site
  const items = [];       // the new links
  const groupHits = {};   // group -> [{ src, fresh, st }]
  const failedNow = [];   // { src, st }

  async function scanSite(src, meta) {
    const st = (state.sources[src.id] ??= { initialized: false, seen: {}, fails: 0, warned: false });
    const res = { site: src.name, id: src.id, tier: tierOf(src) };
    results.push(res);
    let found;
    try {
      found = await (tierOf(src) === "SCRAPFLY" ? fetchItemsWithRetry(src, 0, meta) : fetchItemsWithRetry(src));
    } catch (e) {
      Object.assign(res, { status: "FAILED", reason: String(e.reason ?? e.message).slice(0, 300) });
      if (meta) res.credits = meta.credits ?? 0;
      failedNow.push({ src, st, res });
      console.log(`FAILED ${src.name}: ${e.message}`);
      return;
    }
    st.fails = 0;
    st.warned = false;
    Object.assign(res, { status: "OK", links: found.length });
    if (meta) res.credits = meta.credits ?? 0;
    const fp = ctx.fingerprint(src);
    const changed = st.initialized && (st.fp ? st.fp !== fp && st.fp !== ctx.legacyFingerprint(src) : src.rebaseline === true);
    if (!st.initialized || changed) {
      // First time (or its settings changed): everything on the page now is recorded as already seen; nothing is caught.
      found.forEach(i => (st.seen[keyOf(i)] = stamp));
      st.initialized = true;
      st.fp = fp;
      Object.assign(res, { new_links: 0, note: changed ? "settings changed: page recorded as already seen, nothing caught" : "first scan of this site: page recorded as already seen, nothing caught" });
      console.log(`${changed ? "RE-BASELINE" : "FIRST RUN"} ${src.name}: recorded ${found.length}`);
      prune(st);
      return;
    }
    st.fp = fp;
    const fresh = found.filter(i => !(keyOf(i) in st.seen));
    res.new_links = fresh.length;
    console.log(`OK ${src.name}: ${found.length} on page, ${fresh.length} new`);
    if (src.group) { (groupHits[src.group] ??= []).push({ src, fresh, st }); return; }
    for (const i of fresh) {
      st.seen[keyOf(i)] = stamp;
      items.push({ site: src.name, group: null, page_url: src.url, title: i.title, link: i.link, first_seen: stamp });
    }
    prune(st);
  }

  // ---- 1. FREE group ----
  const free = sources.filter(s => tierOf(s) === "FREE");
  const paid = sources.filter(s => tierOf(s) === "SCRAPFLY");
  for (const src of free) await scanSite(src);

  // ---- 2. SCRAPFLY group: only after FREE has finished, and only with a key ----
  const month = localDate(startedAt).slice(0, 7);
  if (state.scrapfly?.month !== month) state.scrapfly = { month, credits: 0 };
  const scrapfly = { configured: paid.length > 0, ran: false, sites: paid.length, newLinks: 0, credits: 0, monthTotal: state.scrapfly.credits, failed: [] };
  if (paid.length && !ctx.scrapflyKey) {
    console.log(`SCRAPFLY group skipped: SCRAPFLY_KEY is not set (${paid.length} sites not scanned).`);
    for (const src of paid) results.push({ site: src.name, id: src.id, tier: "SCRAPFLY", status: "SKIPPED", reason: "SCRAPFLY_KEY is not set in the Windows environment variables" });
  } else if (paid.length) {
    scrapfly.ran = true;
    for (const src of paid) {
      const meta = { credits: 0 };
      await scanSite(src, meta);
      scrapfly.credits += meta.credits;
      state.scrapfly.credits += meta.credits;
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
      items.push({ site: first.mem.src.name, group: first.mem.src.groupName ?? group, page_url: first.mem.src.url, title: first.i.title, link: first.i.link, first_seen: stamp, ...(others.length ? { also_on: others } : {}) });
    }
    members.forEach(m => prune(m.st));
    const gk = Object.keys(gs.seen);
    if (gk.length > 2000) gk.slice(0, gk.length - 2000).forEach(k => delete gs.seen[k]);
  }
  scrapfly.newLinks = items.filter(i => paid.some(p => p.name === i.site)).length;
  scrapfly.failed = failedNow.filter(f => tierOf(f.src) === "SCRAPFLY").map(f => f.src.name);

  // ---- failures: if (nearly) EVERY site failed, the internet dropped: nobody's "in a row" counter goes up ----
  const attempted = results.filter(r => r.status !== "SKIPPED").length;
  const networkDown = attempted >= 5 && failedNow.length >= attempted * 0.9;
  if (networkDown) console.log(`Almost every site failed (${failedNow.length}/${attempted}): treating it as a lost connection, not counting failures.`);
  else for (const { st, res } of failedNow) { st.fails++; res.failed_scans_in_a_row = st.fails; }

  // ---- the catch file ----
  const sitesWithNew = new Set(items.map(i => i.site)).size;
  const failedNames = failedNow.map(f => f.src.name);
  const data = {
    scan_started: startedAt.toISOString(),
    scan_finished: new Date().toISOString(),
    summary: {
      sites_scanned: attempted,
      sites_ok: results.filter(r => r.status === "OK").length,
      sites_failed: failedNow.length,
      sites_skipped: results.filter(r => r.status === "SKIPPED").length,
      new_links: items.length,
      sites_with_new_links: sitesWithNew,
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
  const message = scanMessage({ newLinks: items.length, sitesWithNew, failed: failedNames, networkDown, scrapfly });
  const delivered = await send(message);
  if (!delivered) console.error("Could not deliver the scan message to Telegram.");

  if (!ctx.onlyTest && !networkDown) { state.lastRunAt = now.toISOString(); state.lastSlot = ctx.runSlot; }   // for the time-slot guard
  return { file, exitCode: delivered ? 0 : 1, saveState: true, message };
}
