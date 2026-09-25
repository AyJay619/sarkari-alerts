import fs from "node:fs";
import tls from "node:tls";
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
function agentFor(extraCerts = [], timeoutMs) {
  const key = extraCerts.join("|") + "@" + (timeoutMs ?? "");
  if (!agents.has(key)) {
    const connect = {};
    if (extraCerts.length) connect.ca = [...tls.rootCertificates, ...extraCerts.map(f => fs.readFileSync(new URL("../" + f, import.meta.url), "utf8"))];
    if (timeoutMs) connect.timeout = timeoutMs;
    const opts = { connect };
    if (timeoutMs) Object.assign(opts, { headersTimeout: timeoutMs, bodyTimeout: timeoutMs });
    agents.set(key, new Agent(opts));
  }
  return agents.get(key);
}

// One HTTP request, honouring the source's extraCerts / timeoutMs.
// Optional per source: "method": "POST" + "form": {...} for the few sites whose list comes from a POST request (e.g. HAL),
// and "headers": {...} to change a header for that site only (HAL refuses the normal Accept header on POST).
function request(url, { extraCerts, timeoutMs, method, form, headers } = {}, redirect = "follow") {
  const opts = { headers: { ...HEADERS, ...headers }, signal: AbortSignal.timeout(timeoutMs ?? 30000), redirect };
  if (method === "POST") Object.assign(opts, { method, body: new URLSearchParams(form ?? {}) });
  return extraCerts?.length || timeoutMs ? undiciFetch(url, { ...opts, dispatcher: agentFor(extraCerts, timeoutMs) }) : fetch(url, opts);
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

function fromHtml(src, text, finalUrl) {
  const $ = cheerio.load(src.fromScript ? htmlFromScriptStrings(text) : text);
  const include = src.include ? new RegExp(src.include, "i") : null;
  const exclude = src.exclude ? new RegExp(src.exclude, "i") : null;
  const minTitle = src.minTitle ?? 12;
  const items = [];
  if (src.rowSelector) {
    // Table/list layout: each row has a title somewhere and a link somewhere.
    $(src.rowSelector).each((_, row) => {
      const $row = $(row);
      // rowTitle "self" = the whole row text (for rows that are just a few plain cells, e.g. an admit-card schedule)
      const title = tidyTitle(clean(src.rowTitle === "self" ? $row.text() : src.rowTitle ? $row.find(src.rowTitle).first().text() : $row.find("td").first().text()));
      const href = $row.find(src.rowLink || "a[href]").first().attr("href");
      if (title.length < minTitle) return;
      let link = finalUrl;
      try { if (href) link = new URL(href.trim(), finalUrl).href; } catch {}
      if (src.pageLink) link = finalUrl;
      const hay = title + " " + link;
      if (include && !include.test(hay)) return;
      if (exclude && exclude.test(hay)) return;
      items.push({ title, link });
    });
    return items;
  }
  $(src.selector || "a[href]").each((_, el) => {
    const $el = $(el);
    const href = $el.attr("href");
    if (!href || href.startsWith("#") || /^(javascript|mailto|tel):/i.test(href)) return;
    let title = tidyTitle(clean($el.text()) || clean($el.attr("title")));
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

function fromJson(src, text) {
  const data = JSON.parse(text);
  const list = src.itemsPath ? pick(data, src.itemsPath) : data;
  if (!Array.isArray(list)) throw new Error("JSON: items list not found at '" + src.itemsPath + "'");
  return list.map(row => {
    const title = clean(pick(row, src.titleField));
    let link = src.linkField ? pick(row, src.linkField) : "";
    link = link ? (src.linkPrefix || "") + String(link).replaceAll("\\", "/") : src.fallbackLink || src.url;
    return { title, link };
  }).filter(i => i.title);
}

// Returns [{title, link}] in page order (newest first on most sites). Throws on any problem.
export async function fetchItems(src) {
  const { text, finalUrl } = await getText(src.url, src);
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
