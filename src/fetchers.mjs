import fs from "node:fs";
import tls from "node:tls";
import os from "node:os";
import path from "node:path";
import * as cheerio from "cheerio";
import { Agent, fetch as undiciFetch } from "undici";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "Accept": "text/html,application/json,application/xhtml+xml,*/*;q=0.8",
  "Accept-Language": "en-IN,en;q=0.9",
};

// Some sites forget to send their intermediate certificate. For those sources only, "extraCerts" in
// sources.json lists PEM files (in certs/) that are trusted on top of the normal list. Checking stays ON.
// "timeoutMs" (optional, per source) allows slow sites longer, both to connect and to answer. Other sources keep the defaults.
const agents = new Map();
// "classicTls": true for sites whose (old) firewall drops Node's modern TLS hello (it offers a post-quantum key that some servers
// cannot read, so the connection just hangs until it times out, while a normal browser or curl connects at once).
function agentFor(extraCerts = [], timeoutMs, classicTls = false) {
  const key = extraCerts.join("|") + "@" + (timeoutMs ?? "") + (classicTls ? "@classic" : "");
  if (!agents.has(key)) {
    const connect = {};
    if (extraCerts.length) connect.ca = [...tls.rootCertificates, ...extraCerts.map(f => fs.readFileSync(new URL("../" + f, import.meta.url), "utf8"))];
    if (timeoutMs) connect.timeout = timeoutMs;
    if (classicTls) connect.ecdhCurve = "X25519:prime256v1:secp384r1";
    const opts = { connect };
    if (timeoutMs) Object.assign(opts, { headersTimeout: timeoutMs, bodyTimeout: timeoutMs });
    agents.set(key, new Agent(opts));
  }
  return agents.get(key);
}

// One HTTP request, honouring the source's extraCerts / timeoutMs.
// Optional per source: "method": "POST" + "form": {...} for the few sites whose list comes from a POST request (e.g. HAL),
// and "headers": {...} to change a header for that site only (HAL refuses the normal Accept header on POST).
function request(url, { extraCerts, timeoutMs, classicTls, method, form, body, headers } = {}, redirect = "follow") {
  const opts = { headers: { ...HEADERS, ...headers }, signal: AbortSignal.timeout(timeoutMs ?? 30000), redirect };
  if (method === "POST") Object.assign(opts, { method, body: body ?? new URLSearchParams(form ?? {}) });   // "body": a raw text body instead of "form" (AIIMS)
  return extraCerts?.length || timeoutMs || classicTls ? undiciFetch(url, { ...opts, dispatcher: agentFor(extraCerts, timeoutMs, classicTls) }) : fetch(url, opts);
}
const explain = (e, started, url) => {
  const cause = e.cause ? ` | cause: ${[e.cause.code, e.cause.message].filter(Boolean).join(" ")}` : "";
  return new Error(`${e.name}: ${e.message}${cause} | after ${((Date.now() - started) / 1000).toFixed(1)}s | url: ${url}`);
};

// One attempt, with a detailed error message so the GitHub log shows exactly what went wrong.
async function getText(url, srcOpts = {}) {
  const started = Date.now();
  try {
    const res = await request(url, srcOpts);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
    return { text: await res.text(), finalUrl: res.url };
  } catch (e) {
    throw explain(e, started, url);
  }
}

// Downloads a file (used by the listener). Redirects are followed by hand so that EVERY hop can be checked:
// allow(url) must throw to refuse a URL. optsFor(url) gives that host's extraCerts / timeoutMs.
export async function getBuffer(url, { allow = () => {}, optsFor = () => ({}), maxBytes = 30 * 1024 * 1024 } = {}) {
  const started = Date.now();
  let current = url;
  try {
    for (let hop = 0; hop <= 5; hop++) {
      allow(current);
      const res = await request(current, optsFor(current), "manual");
      const loc = res.headers.get("location");
      if (res.status >= 300 && res.status < 400 && loc) { current = new URL(loc, current).href; continue; }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
      if (Number(res.headers.get("content-length") ?? 0) > maxBytes) throw new Error("file is too large");
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > maxBytes) throw new Error("file is too large");
      return { buf, finalUrl: current, contentType: res.headers.get("content-type") ?? "" };
    }
    throw new Error("too many redirects");
  } catch (e) {
    if (e.refused) throw e;
    throw explain(e, started, url);
  }
}

const clean = s => String(s ?? "").replace(/\s+/g, " ").trim();
// Removes leftovers like "Read More" or "(1.68 MB)" / "PDF size:(251 KB)" so titles read cleanly.
const tidyTitle = t => t
  .replace(/\s*\[\s*new\s*\]\s*/gi, " ")   // a "[NEW]" badge comes and goes, which would make an old notice look new
  .replace(/\s*\(\s*[\d.,]+\s*[KM]B\s*\|.*$/i, "")   // "( 1.72 MB | PDF | open in Adobe Reader )"
  .replace(/\s*(read more|click here|download)\W*$/i, "")
  .replace(/\s*(pdf\s*)?(size:)?\s*\(\s*[\d.,]+\s*[KM]B\s*\)\s*[.\d\/]*\s*$/i, "")
  .trim();
const pick = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

// For pages that build their list in JavaScript from a `template string` (e.g. GAIL): pull the HTML out of those strings.
const htmlFromScriptStrings = text => {
  const $ = cheerio.load(text);
  const parts = [];
  $("script:not([src])").each((_, s) => { for (const m of $(s).html().matchAll(/`([^`]*<[a-z][^`]*)`/gi)) parts.push(m[1]); });
  return parts.join("\n");
};

// "15/10/2026", "15-10-2026" or "15.10.2026" -> "2026-10-15" (null when it is not a real date)
export function isoDate(s) {
  const m = String(s ?? "").match(/(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
  if (!m) return null;
  const iso = `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
  const d = new Date(iso + "T00:00:00Z");
  return isNaN(d) || d.toISOString().slice(0, 10) !== iso ? null : iso;
}

function fromHtml(src, text, finalUrl) {
  const $ = cheerio.load(src.fromScript ? htmlFromScriptStrings(text) : text);
  // "titleReplace": ["regex", "replacement"] (optional) tidies a row title, e.g. turns "... Publish Date -: 20-Apr-2026 ..." into "... (published 20-Apr-2026)"
  const retitle = t => (src.titleReplace ? t.replace(new RegExp(src.titleReplace[0], "i"), src.titleReplace[1]).trim() : t);
  const include = src.include ? new RegExp(src.include, "i") : null;
  const exclude = src.exclude ? new RegExp(src.exclude, "i") : null;
  const minTitle = src.minTitle ?? 12;
  const items = [];
  if (src.rowSelector) {
    // Table/list layout: each row has a title somewhere and a link somewhere.
    $(src.rowSelector).each((_, row) => {
      const $row = $(row);
      // rowTitle "self" = the whole row text (for rows that are just a few plain cells, e.g. an admit-card schedule)
      const title = retitle(tidyTitle(clean(src.rowTitle === "self" ? $row.text() : src.rowTitle ? $row.find(src.rowTitle).first().text() : $row.find("td").first().text())));
      const href = $row.find(src.rowLink || "a[href]").first().attr("href");
      if (title.length < minTitle) return;
      let link = finalUrl;
      try { if (href) link = new URL(href.trim(), finalUrl).href; } catch {}
      if (src.pageLink) link = finalUrl;
      const hay = title + " " + link;
      if (include && !include.test(hay)) return;
      if (exclude && exclude.test(hay)) return;
      // "rowEndDate": selector of the row's own "end date" (e.g. 15/10/2026); used later if the PDF names no last date
      const endDate = src.rowEndDate ? isoDate($row.find(src.rowEndDate).first().text()) : null;
      items.push(endDate ? { title, link, endDate } : { title, link });
    });
    return items;
  }
  $(src.selector || "a[href]").each((_, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    if (!href || href.startsWith("#") || /^(javascript|mailto|tel):/i.test(href)) return;
    let title = retitle(tidyTitle(clean($el.text()) || clean($el.attr("title"))));
    const linkText = title;
    if (title.length < minTitle) return;
    let link;
    try { link = new URL(href.trim(), finalUrl).href; } catch { return; }
    // "contextClosest" + "contextFind" (optional): put the heading of the surrounding box in front of a bare link text,
    // e.g. "Recruitment of Officer Trainee (Law) 2025: Notice 5 - Shortlisted for interview".
    // "contextAttr" (optional) uses that element's attribute (e.g. an advertisement number) instead of its text,
    // for headings whose wording changes over time (which would make old notices look new).
    if (src.contextClosest) {
      const $ctx = $el.closest(src.contextClosest).find(src.contextFind || "h4").first();
      const ctx = clean(src.contextAttr ? $ctx.attr(src.contextAttr) : $ctx.text()).replace(/^\d+\.\s+/, "");   // drop list numbers ("22. ..."): they shift when the list grows
      if (ctx) title = `${ctx}: ${title}`;
    }
    // "titleTemplate": build a readable title from the link text and the link's ?parameters, e.g. "RRB Patna CEN {cennum}: {text}"
    let groupTitle;
    if (src.titleTemplate) {
      const q = new URL(link).searchParams;
      const fill = tpl => tpl.replace(/\{(\w+)\}/g, (_, k) => (k === "text" ? linkText : q.get(k) ?? ""));
      title = fill(src.titleTemplate);
      // "groupTemplate": the same notice on several sites (see "group" in sources.json) gets the same groupTitle
      if (src.groupTemplate) groupTitle = fill(src.groupTemplate);
    }
    if (src.pageLink) link = finalUrl;
    const hay = `${title} ${link}`;
    if (include && !include.test(hay)) return;
    if (exclude && exclude.test(hay)) return;
    items.push({ title, link, groupTitle });
  });
  return items;
}

// For pages that carry their list as a JavaScript variable (e.g. `var glblMasterCareerDetails = [...]`, Bank of Baroda):
// returns the JSON text of that variable's value (found by matching brackets, so strings containing brackets are fine).
function jsonFromPageVariable(text, name) {
  const m = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*=\\s*").exec(text);
  if (!m) throw new Error(`Page loaded but the variable '${name}' was not found (site layout may have changed)`);
  const start = m.index + m[0].length, open = text[start], close = open === "[" ? "]" : "}";
  let depth = 0, inString = false;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (inString) { if (c === "\\") i++; else if (c === '"') inString = false; }
    else if (c === '"') inString = true;
    else if (c === open) depth++;
    else if (c === close && --depth === 0) return text.slice(start, i + 1);
  }
  throw new Error(`Variable '${name}' is not complete JSON`);
}

function fromJson(src, text) {
  // "rscLine": the answer is a Next.js server-action reply, several "N:{json}" lines; take the JSON of line N (AIIMS)
  if (src.rscLine) text = text.split("\n").find(l => l.startsWith(src.rscLine + ":"))?.slice(src.rscLine.length + 1) ?? "";
  const data = JSON.parse(src.jsonInPage ? jsonFromPageVariable(text, src.jsonInPage) : text);
  const include = src.include ? new RegExp(src.include, "i") : null, exclude = src.exclude ? new RegExp(src.exclude, "i") : null;
  const list = src.itemsPath ? pick(data, src.itemsPath) : data;
  if (!Array.isArray(list)) throw new Error("JSON: items list not found at '" + src.itemsPath + "'");
  return list.map(row => {
    const title = clean(pick(row, src.titleField));
    let link = src.linkField ? pick(row, src.linkField) : "";
    link = link ? (src.linkPrefix || "") + String(link).replaceAll("\\", "/") : src.fallbackLink || src.url;
    return { title, link };
  }).filter(i => i.title && (!include || include.test(i.title)) && !(exclude && exclude.test(i.title)));   // include / exclude work on the title, as for html sources
}

// Returns [{title, link}] in page order (newest first on most sites). Throws on any problem.
// For pages that only show their list after JavaScript has run (FCI): opens the page in a headless browser, optionally clicks a
// button by its text ("clickText", e.g. "English"), and returns the finished page.
// Browser order: Playwright's own pinned Chromium (kept in a fixed folder, so Chrome updates cannot change it) -> installed Chrome
// -> installed Edge. The one used is logged. Only used when the source says "render": true. No login, no captcha: if a page ever
// shows a bot check, that source is not added.
// The pinned Chromium lives OUTSIDE the project on purpose: the GitHub runner wipes its checkout folder on every run, and a fixed
// path works for whichever Windows account the runner service uses. Override with SARKARI_BROWSERS_PATH. Install: npm run install-browser
export function browsersPath() {
  return process.env.SARKARI_BROWSERS_PATH
    || (process.platform === "win32" ? path.join(process.env.ProgramData || "C:\\ProgramData", "sarkari-alerts", "browsers") : path.join(os.homedir(), ".cache", "sarkari-alerts", "browsers"));
}

const BROWSER_NAMES = { pinned: "pinned Chromium", chrome: "installed Chrome", msedge: "installed Edge" };

async function getRendered(src) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = browsersPath();   // read by playwright-core when it looks for its own Chromium
  const { chromium } = await import("playwright-core");
  let browser;
  const problems = [];
  for (const which of src.browserChannel ? [src.browserChannel] : ["pinned", "chrome", "msedge"]) {
    try {
      browser = await chromium.launch(which === "pinned" ? { headless: true } : { channel: which, headless: true });
      console.log(`  ${src.name}: browser used: ${BROWSER_NAMES[which] ?? which}`);
      break;
    } catch (e) { problems.push(`${BROWSER_NAMES[which] ?? which}: ${String(e?.message ?? "").split("\n")[0].slice(0, 100)}`); }
  }
  if (!browser) throw new Error("browser could not start (" + problems.join("; ") + ")");
  try {
    const page = await browser.newPage({ locale: "en-IN" });
    await page.goto(src.url, { waitUntil: "networkidle", timeout: src.timeoutMs ?? 45000 });
    if (src.clickText) { await page.locator(`text=${src.clickText}`).first().click({ timeout: 8000 }).catch(() => {}); await page.waitForTimeout(2500); }
    if (src.waitFor) await page.waitForSelector(src.waitFor, { timeout: 15000 });
    return { text: await page.content(), finalUrl: page.url() };
  } finally { await browser.close(); }
}

export async function fetchItems(src) {
  const { text, finalUrl } = src.render ? await getRendered(src) : await getText(src.url, src);
  const items = src.type === "json" ? fromJson(src, text) : fromHtml(src, text, finalUrl);
  // de-duplicate identical title+link within one page
  const seen = new Set();
  const unique = items.filter(i => { const k = i.title + "|" + i.link; if (seen.has(k)) return false; seen.add(k); return true; });
  const limited = unique.slice(0, src.limit ?? 40);
  if (limited.length === 0) throw new Error("Page loaded but no notices were found (site layout may have changed)");
  return limited;
}

// Tries once, and if that fails waits a short while and tries one more time.
export async function fetchItemsWithRetry(src, pauseMs = 20000) {
  try {
    return await fetchItems(src);
  } catch (e) {
    console.log(`  ${src.name}: first attempt failed -> ${e.message}
  ${src.name}: retrying in ${pauseMs / 1000}s ...`);
    await new Promise(r => setTimeout(r, pauseMs));
    return await fetchItems(src);
  }
}
