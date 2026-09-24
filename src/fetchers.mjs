import * as cheerio from "cheerio";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "Accept": "text/html,application/json,application/xhtml+xml,*/*;q=0.8",
  "Accept-Language": "en-IN,en;q=0.9",
};

// One attempt, with a detailed error message so the GitHub log shows exactly what went wrong.
async function getText(url) {
  const started = Date.now();
  try {
    const res = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(30000), redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`.trim());
    return { text: await res.text(), finalUrl: res.url };
  } catch (e) {
    const cause = e.cause ? ` | cause: ${[e.cause.code, e.cause.message].filter(Boolean).join(" ")}` : "";
    throw new Error(`${e.name}: ${e.message}${cause} | after ${((Date.now() - started) / 1000).toFixed(1)}s | url: ${url}`);
  }
}

const clean = s => String(s ?? "").replace(/\s+/g, " ").trim();
// Removes leftovers like "Read More" or "(1.68 MB)" / "PDF size:(251 KB)" so titles read cleanly.
const tidyTitle = t => t
  .replace(/\s*(read more|click here|download)\W*$/i, "")
  .replace(/\s*(pdf\s*)?(size:)?\s*\(\s*[\d.,]+\s*[KM]B\s*\)\s*[.\d\/]*\s*$/i, "")
  .trim();
const pick = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

function fromHtml(src, text, finalUrl) {
  const $ = cheerio.load(text);
  const include = src.include ? new RegExp(src.include, "i") : null;
  const exclude = src.exclude ? new RegExp(src.exclude, "i") : null;
  const minTitle = src.minTitle ?? 12;
  const items = [];
  if (src.rowSelector) {
    // Table/list layout: each row has a title somewhere and a link somewhere.
    $(src.rowSelector).each((_, row) => {
      const $row = $(row);
      const title = tidyTitle(clean(src.rowTitle ? $row.find(src.rowTitle).first().text() : $row.find("td").first().text()));
      const href = $row.find(src.rowLink || "a[href]").first().attr("href");
      if (title.length < minTitle) return;
      let link = finalUrl;
      try { if (href) link = new URL(href.trim(), finalUrl).href; } catch {}
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
    const title = tidyTitle(clean($el.text()) || clean($el.attr("title")));
    if (title.length < minTitle) return;
    let link;
    try { link = new URL(href.trim(), finalUrl).href; } catch { return; }
    const hay = `${title} ${link}`;
    if (include && !include.test(hay)) return;
    if (exclude && exclude.test(hay)) return;
    items.push({ title, link });
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
  const { text, finalUrl } = await getText(src.url);
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
