import fs from "node:fs";
import tls from "node:tls";
import { constants as cryptoConstants } from "node:crypto";
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
// "legacyTls": true for sites whose server still uses the old TLS "legacy renegotiation" (PSSSB). Node refuses those by default; this
// allows it for that source ONLY. The site's certificate is still fully checked, so no security checking is switched off.
function agentFor(extraCerts = [], timeoutMs, classicTls = false, legacyTls = false) {
  const key = extraCerts.join("|") + "@" + (timeoutMs ?? "") + (classicTls ? "@classic" : "") + (legacyTls ? "@legacy" : "");
  if (!agents.has(key)) {
    const connect = {};
    if (extraCerts.length) connect.ca = [...tls.rootCertificates, ...extraCerts.map(f => fs.readFileSync(new URL("../" + f, import.meta.url), "utf8"))];
    if (timeoutMs) connect.timeout = timeoutMs;
    if (classicTls) connect.ecdhCurve = "X25519:prime256v1:secp384r1";
    if (legacyTls) connect.secureOptions = cryptoConstants.SSL_OP_LEGACY_SERVER_CONNECT;
    const opts = { connect };
    if (timeoutMs) Object.assign(opts, { headersTimeout: timeoutMs, bodyTimeout: timeoutMs });
    agents.set(key, new Agent(opts));
  }
  return agents.get(key);
}

// One HTTP request, honouring the source's extraCerts / timeoutMs.
// Optional per source: "method": "POST" + "form": {...} for the few sites whose list comes from a POST request (e.g. HAL),
// and "headers": {...} to change a header for that site only (HAL refuses the normal Accept header on POST).
function request(url, { extraCerts, timeoutMs, classicTls, legacyTls, method, form, body, headers } = {}, redirect = "follow") {
  const opts = { headers: { ...HEADERS, ...headers }, signal: AbortSignal.timeout(timeoutMs ?? 30000), redirect };
  if (method === "POST") Object.assign(opts, { method, body: body ?? new URLSearchParams(form ?? {}) });   // "body": a raw text body instead of "form" (AIIMS)
  return extraCerts?.length || timeoutMs || classicTls || legacyTls ? undiciFetch(url, { ...opts, dispatcher: agentFor(extraCerts, timeoutMs, classicTls, legacyTls) }) : fetch(url, opts);
}
// The real reason a download failed, in plain words (the technical code is kept in brackets).
export function plainCause(e) {
  const code = [e.cause?.code, e.code].find(c => typeof c === "string") ?? "";
  const text = `${e.name ?? ""} ${e.message ?? ""} ${e.cause?.message ?? ""}`;
  const http = text.match(/HTTP (\d{3})/)?.[1];
  const tag = code ? ` (${code})` : "";
  if (http === "403" || http === "401") return `the site refused us: HTTP ${http} (it may block automated downloads or non-Indian visitors)`;
  if (http === "404") return "the file was not found: HTTP 404 (the link may be dead or moved)";
  if (http === "429") return "the site says too many requests: HTTP 429 (try again later)";
  if (http && Number(http) >= 500) return `the site itself is having a problem: HTTP ${http}`;
  if (http) return `the site answered HTTP ${http}`;
  if (/LEGACY_RENEGOTIATION/.test(code + text)) return `the site uses an old security handshake that this program blocks by default${tag}`;
  if (/CERT|SELF_SIGNED|UNABLE_TO_VERIFY|UNABLE_TO_GET_ISSUER|HOSTNAME_MISMATCH/i.test(code + text)) return `the site's security certificate could not be verified${tag}`;
  if (/TimeoutError|ABORT_ERR|CONNECT_TIMEOUT|HEADERS_TIMEOUT|BODY_TIMEOUT|ETIMEDOUT|timed out|due to timeout/i.test(code + text)) return `timed out: the site did not answer in time${tag}`;
  if (/ENOTFOUND|EAI_AGAIN/.test(code)) return `the site's address could not be found (DNS)${tag}`;
  if (/ECONNREFUSED/.test(code)) return `the site refused the connection${tag}`;
  if (/ECONNRESET|UND_ERR_SOCKET|EPIPE|socket hang up/i.test(code + text)) return `the connection was cut off by the site${tag}`;
  if (/too large/.test(text)) return "the file is too large";
  if (/too many redirects/.test(text)) return "the link keeps redirecting (too many redirects)";
  return `${e.message}${e.cause ? " (" + [e.cause.code, e.cause.message].filter(Boolean).join(" ") + ")" : ""}`;
}
const explain = (e, started, url) => {
  const cause = e.cause ? ` | cause: ${[e.cause.code, e.cause.message].filter(Boolean).join(" ")}` : "";
  return Object.assign(new Error(`${e.name}: ${e.message}${cause} | after ${((Date.now() - started) / 1000).toFixed(1)}s | url: ${url}`), { reason: plainCause(e) });
};

// One attempt, with a detailed error message so the GitHub log shows exactly what went wrong.
export async function getText(url, srcOpts = {}) {
  const started = Date.now();
  try {
    const res = await request(url, srcOpts);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
    return { text: await res.text(), finalUrl: res.url };
  } catch (e) {
    throw explain(e, started, url);
  }
}

// ScrapFly fallback (https://scrapfly.io): used only when the direct download fails AND SCRAPFLY_KEY is set in .env.
// ScrapFly fetches the file from its own servers (Indian residential proxy) and hands the bytes back; nothing else changes.
async function scrapflyBuffer(url, maxBytes) {
  const key = process.env.SCRAPFLY_KEY;
  if (!key) throw new Error("ScrapFly is not set up (no SCRAPFLY_KEY environment variable)");
  const api = new URL("https://api.scrapfly.io/scrape");
  api.search = new URLSearchParams({ key, url, country: "in", asp: "true", proxy_pool: "public_residential_pool", format: "raw", retry: "false", timeout: "120000" }).toString();
  const res = await fetch(api, { signal: AbortSignal.timeout(150000) });
  if (!res.ok) {
    const info = await res.json().catch(() => null);   // ScrapFly describes its own errors in a small JSON body
    throw new Error(`ScrapFly HTTP ${res.status}${info?.message ? ": " + info.message : info?.result?.error?.message ? ": " + info.result.error.message : ""}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > maxBytes) throw new Error("file is too large");
  if (!buf.length) throw new Error("ScrapFly returned an empty file");
  return { buf, finalUrl: url, contentType: res.headers.get("content-type") ?? "" };
}

// ScrapFly for a WHOLE PAGE (the SCRAPFLY group in sources.json). The key comes ONLY from the Windows environment variable SCRAPFLY_KEY.
// meta.credits (optional) is increased by what ScrapFly charged for the request (its X-Scrapfly-Api-Cost header).
async function scrapflyText(src, meta) {
  const key = process.env.SCRAPFLY_KEY;
  if (!key) throw new Error("ScrapFly is not set up (no SCRAPFLY_KEY environment variable)");
  if (src.method === "POST") throw new Error("the SCRAPFLY group does not support POST sources yet");
  const params = { key, url: src.url, country: "in", asp: "true", proxy_pool: "public_residential_pool", format: "raw", retry: "false", timeout: "120000" };
  if (src.render) Object.assign(params, { render_js: "true", rendering_wait: "3000" });
  const api = new URL("https://api.scrapfly.io/scrape");
  api.search = new URLSearchParams(params).toString();
  const res = await fetch(api, { signal: AbortSignal.timeout(150000) });
  const cost = Number(res.headers.get("x-scrapfly-api-cost"));
  if (meta && Number.isFinite(cost)) meta.credits = (meta.credits ?? 0) + cost;   // (charged even when the target site answered with an error)
  if (!res.ok) {
    const info = await res.json().catch(() => null);
    throw Object.assign(new Error(`ScrapFly HTTP ${res.status}${info?.message ? ": " + info.message : info?.result?.error?.message ? ": " + info.result.error.message : ""}`), { reason: `ScrapFly answered HTTP ${res.status}` });
  }
  return { text: await res.text(), finalUrl: src.url };
}

// Downloads a file (used by the listener and the PDF reader). A direct download first; if that fails and SCRAPFLY_KEY is set, ScrapFly is tried.
// If both fail, the error's "reason" says what went wrong with each. (The site-allowed check still runs on the first address.)
export async function getBuffer(url, opts = {}) {
  try {
    return await getBufferDirect(url, opts);
  } catch (direct) {
    if (direct.refused || !process.env.SCRAPFLY_KEY || opts.scrapfly === false) throw direct;
    try {
      return { ...(await scrapflyBuffer(url, opts.maxBytes ?? 30 * 1024 * 1024)), viaScrapfly: true };
    } catch (fallback) {
      throw Object.assign(direct, { reason: `${direct.reason}; ScrapFly fallback also failed: ${plainCause(fallback)}` });
    }
  }
}

// One direct download. Redirects are followed by hand so that EVERY hop can be checked:
// allow(url) must throw to refuse a URL. optsFor(url) gives that host's extraCerts / timeoutMs.
async function getBufferDirect(url, { allow = () => {}, optsFor = () => ({}), maxBytes = 30 * 1024 * 1024 } = {}) {
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
      // "rowStartDate": the same for the row's own "start date"
      const startDate = src.rowStartDate ? isoDate($row.find(src.rowStartDate).first().text()) : null;
      items.push({ title, link, ...(endDate ? { endDate } : {}), ...(startDate ? { startDate } : {}) });
    });
    return items;
  }
  $(src.selector || "a[href]").each((_, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    if (!href || href.startsWith("#") || /^(javascript|mailto|tel):/i.test(href)) return;
    let title = retitle(tidyTitle(clean($el.text()) || clean($el.attr("title"))));
    const linkText = title;
    if (title.length < minTitle && !src.titleFromHref) return;
    let link;
    try { link = new URL(href.trim(), finalUrl).href; } catch { return; }
    // "titleFromHref": for pages whose links all read "Detailed Advertisement" / "Click here": use the file name in the link instead (IDBI)
    if (src.titleFromHref) title = decodeURIComponent(link.split("?")[0].split("/").pop()).replace(/[.][a-z0-9]{2,4}$/i, "").replace(/[-_+]+/g, " ").trim();
    // "contextClosest" + "contextFind" (optional): put the heading of the surrounding box in front of a bare link text,
    // e.g. "Recruitment of Officer Trainee (Law) 2025: Notice 5 - Shortlisted for interview".
    // "contextAttr" (optional) uses that element's attribute (e.g. an advertisement number) instead of its text,
    // for headings whose wording changes over time (which would make old notices look new).
    // "contextPrev" (optional): the nearest heading BEFORE the list this link sits in (e.g. "h4"), for pages laid out as <h4>Post</h4><ul><li><a>Notification</a>... (Bank of Maharashtra)
    if (src.contextPrev) {
      const head = clean($el.closest("ul,ol,table").prevAll(src.contextPrev).first().text());
      if (head) title = `${head}: ${title}`;
    }
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
  // "titleFormat" (optional): builds the title from several fields, e.g. "{fields.date} {fields.no} {fields.subject}" (HTML in them is turned into plain text).
  // "linkHtmlField" (optional): the link is the first web address inside a field that holds a piece of HTML (BPSC).
  const plain = s => cheerio.load("<p>" + String(s ?? "") + "</p>")("p").text();
  return list.map(row => {
    const title = src.titleFormat ? clean(src.titleFormat.replace(/\{([\w.]+)\}/g, (_, k) => plain(pick(row, k)))) : clean(pick(row, src.titleField));
    let link = src.linkHtmlField ? cheerio.load(String(pick(row, src.linkHtmlField) ?? ""))("a[href]").first().attr("href") ?? "" : src.linkField ? pick(row, src.linkField) : "";
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

// meta (optional): { credits } is filled with the ScrapFly credits this call used. A source with "tier": "SCRAPFLY" is fetched through ScrapFly.
export async function fetchItems(src, meta) {
  const viaScrapfly = src.tier === "SCRAPFLY";
  const { text, finalUrl } = viaScrapfly ? await scrapflyText(src, meta) : src.render ? await getRendered(src) : await getText(src.url, src);
  const items = src.type === "json" ? fromJson(src, text) : fromHtml(src, text, finalUrl);
  // "extraUrls" (optional): more pages read the same way, for sites that split their notices over several pages (the railway zones).
  // Any page failing fails the whole source, so a quietly missing page cannot hide new notices.
  for (const u of src.extraUrls ?? []) { const more = viaScrapfly ? await scrapflyText({ ...src, url: u }, meta) : await getText(u, src); items.push(...fromHtml(src, more.text, more.finalUrl)); }
  // de-duplicate identical title+link within one page
  const seen = new Set();
  const unique = items.filter(i => { const k = i.title + "|" + i.link; if (seen.has(k)) return false; seen.add(k); return true; });
  const limited = unique.slice(0, src.limit ?? 40);
  // "allowEmpty": a page that is legitimately empty between postings (THDC, NIA) is not a failure; real errors (network, HTTP, TLS) still are
  if (limited.length === 0 && !src.allowEmpty) throw new Error("Page loaded but no notices were found (site layout may have changed)");
  return limited;
}

// Tries once, and if that fails waits a short while and tries one more time.
// (a SCRAPFLY source is never retried: every try costs credits)
export async function fetchItemsWithRetry(src, pauseMs = 20000, meta) {
  try {
    return await fetchItems(src, meta);
  } catch (e) {
    if (src.tier === "SCRAPFLY") throw e;
    console.log(`  ${src.name}: first attempt failed -> ${e.message}
  ${src.name}: retrying in ${pauseMs / 1000}s ...`);
    await new Promise(r => setTimeout(r, pauseMs));
    return await fetchItems(src, meta);
  }
}
