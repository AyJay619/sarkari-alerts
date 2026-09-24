// Helpers for the "📥 Send to agents" listener: reading an alert message, the allowed-sites check, and the inbox folder.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// ---- which sites may be downloaded from ----

// Every web address that appears in sources.json (url, linkPrefix, fallbackLink ...) plus any "allowedHosts" list on a source.
export function allowedHosts(sources) {
  const hosts = new Set();
  const add = value => {
    if (typeof value !== "string") return;
    try { const u = new URL(value); if (/^https?:$/.test(u.protocol)) hosts.add(u.hostname.toLowerCase().replace(/^www\./, "")); } catch { /* not a URL */ }
  };
  for (const s of sources) {
    for (const v of Object.values(s)) add(v);
    for (const h of s.allowedHosts ?? []) hosts.add(String(h).toLowerCase().replace(/^www\./, ""));
  }
  return hosts;
}

// Exact site or one of its sub-sites (www.ssc.gov.in and ssc.gov.in are both fine for ssc.gov.in).
export function hostAllowed(hostname, hosts) {
  const h = hostname.toLowerCase().replace(/^www\./, "");
  return [...hosts].some(d => h === d || h.endsWith("." + d));
}

// The source in sources.json that owns this host (used for its extraCerts / timeoutMs when downloading).
export function sourceForHost(hostname, sources) {
  const h = hostname.toLowerCase().replace(/^www\./, "");
  return sources.find(s => {
    const hosts = allowedHosts([s]);
    return [...hosts].some(d => h === d || h.endsWith("." + d));
  });
}

// ---- reading an alert message (the plain text Telegram gives back with the button press) ----
// Layout (see formatItem / formatGroup in telegram.mjs):
//   [🧪 TEST]
//   <icon> <Category> · <Source>
//   [❓ unchecked | 📷 scanned]
//   <blank>
//   <title>
//   <blank>
//   🔗 <link> [(Patna copy)]
export function parseAlert(text) {
  if (!text) return null;
  let lines = text.split("\n");
  const test = /^🧪\s*TEST/.test(lines[0]);
  if (test) lines = lines.slice(1);
  const blocks = lines.join("\n").split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  const header = blocks[0]?.split("\n")[0]?.match(/^\S+\s+(.+?)\s+·\s+(.+)$/u);
  const linkBlock = blocks.findIndex(b => b.startsWith("🔗"));
  if (!header || linkBlock < 1) return null;
  const link = blocks[linkBlock].match(/^🔗\s*(\S+)/u)?.[1];
  const title = blocks.slice(1, linkBlock).join(" ").trim();
  if (!link || !title) return null;
  const flag = /unchecked/.test(blocks[0]) ? "unchecked" : /scanned/.test(blocks[0]) ? "scanned" : null;
  return { category: header[1], source: header[2].trim(), title, link, flag, test };
}

// ---- file names: 2026-09-26_SSC_CGL-2026-Tentative-Vacancy ----
const words = s => String(s).replace(/[^A-Za-z0-9]+/g, " ").trim().split(" ").filter(Boolean);
export function baseName(date, source, title) {
  const pad = n => String(n).padStart(2, "0");
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  let slug = "";
  for (const w of words(title)) { if ((slug + "-" + w).length > 60) break; slug += (slug ? "-" : "") + w; }
  return `${day}_${words(source).join("-") || "source"}_${slug || "notice"}`;
}

// ---- the inbox folder ----
export class Inbox {
  constructor(dir) {
    this.dir = dir;
    this.pending = path.join(dir, "pending");
    this.indexFile = path.join(dir, "index.json");
    fs.mkdirSync(this.pending, { recursive: true });
    this.index = fs.existsSync(this.indexFile) ? JSON.parse(fs.readFileSync(this.indexFile, "utf8")) : { byLink: {}, byHash: {} };
  }

  // "Already in inbox" also holds after your agents move or delete the file, because the index remembers.
  findExisting(link, sha) {
    return this.index.byLink[link] ?? (sha ? this.index.byHash[sha] : undefined);
  }

  static sha(buf) { return crypto.createHash("sha256").update(buf).digest("hex"); }

  // pdf: Buffer or null (link only). Returns the main file name (.pdf, or .json for link-only).
  save(base, pdf, meta) {
    let name = base, n = 2;
    while (fs.existsSync(path.join(this.pending, name + ".json"))) name = `${base}-${n++}`;
    const sha = pdf ? Inbox.sha(pdf) : null;
    const record = { ...meta, pdfFile: pdf ? name + ".pdf" : null, sha256: sha, savedAt: new Date().toISOString() };
    if (pdf) fs.writeFileSync(path.join(this.pending, name + ".pdf"), pdf);
    fs.writeFileSync(path.join(this.pending, name + ".json"), JSON.stringify(record, null, 2) + "\n");
    const shown = pdf ? name + ".pdf" : name + ".json";
    this.index.byLink[meta.link] = shown;
    if (sha) this.index.byHash[sha] = shown;
    fs.writeFileSync(this.indexFile, JSON.stringify(this.index, null, 1) + "\n");
    return shown;
  }
}
