// Link normalising for the seen-links check (no mass re-catch of old links) and the "possible flood" flag. Run:  node test/normalize.test.mjs
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { normalizeLink } from "../src/catch.mjs";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

// ---- the normaliser itself ----
const same = (a, b) => normalizeLink(a) === normalizeLink(b);
check("www vs no www", same("https://www.bemlindia.in/a.pdf", "https://bemlindia.in/a.pdf"));
check("http vs https", same("http://site.gov.in/a.pdf", "https://site.gov.in/a.pdf"));
check("double slash in the path", same("https://x.in/DATA//Writereaddata/a.pdf", "https://x.in/DATA/Writereaddata/a.pdf"));
check("%28 %29 vs ( )", same("https://x.in/a(1)(2).pdf", "https://x.in/a%281%29%282%29.pdf"));
check("%26 vs & and %20 vs space", same("https://x.in/L&D 01.pdf", "https://x.in/L%26D%2001.pdf"));
check("the real BEML change: old and new spelling are the same link", same(
  "https://bemlindia.in/sites/default/files/DATA//Writereaddata/KP&S 14 (1)(2).pdf",
  "https://www.bemlindia.in/sites/default/files/DATA/Writereaddata/KP%26S%2014%20%281%29%282%29.pdf"));
check("host case and #fragment are ignored", same("https://X.in/a.pdf#top", "https://x.in/a.pdf"));
check("different files stay different", !same("https://x.in/a.pdf", "https://x.in/b.pdf") && !same("https://x.in/a.pdf?id=1", "https://x.in/a.pdf?id=2"));
check("a different site stays different", !same("https://a.gov.in/x.pdf", "https://b.gov.in/x.pdf"));
check("a site release that bumps ?v= on every file link is the same link (AWEIL)", same("https://aweil.in/files/ad.pdf?v=1.4.93", "https://aweil.in/files/ad.pdf?v=1.4.94") && same("https://aweil.in/files/ad.pdf?v=1.4.93", "https://aweil.in/files/ad.pdf"));
check("other cache-busting names are ignored too, other parameters are kept", same("https://x.in/a.pdf?id=5&ver=2&_=1727", "https://x.in/a.pdf?id=5") && !same("https://x.in/a.pdf?id=5&v=1", "https://x.in/a.pdf?id=6&v=1"));
check("a link WITHOUT such a parameter is not touched (no re-catch of existing links)", normalizeLink("https://x.in/view.php?NBE=abc def&type=2") === normalizeLink("https://x.in/view.php?NBE=abc def&type=2") && normalizeLink("https://x.in/view.php?NBE=abc&type=2") === "x.in/view.php?NBE=abc&type=2");
check("a relative link is cleaned of ?v= as well", same("assets/a.pdf?v=3", "assets/a.pdf?v=4"));
check("a bad % sequence does not crash", typeof normalizeLink("https://x.in/100%.pdf") === "string" && typeof normalizeLink("not a url %zz") === "string");

// ---- through the real monitor ----
const L = (name, i) => `Notice number ${i} of ${name} recruitment 2026`;
const links = (name, count) => Array.from({ length: count }, (_, i) => ({ title: L(name, i), href: `http://${name}.example.org/files/${name}${i}.pdf` }));
const pages = {
  norm: [   // same notices as in the seen record, but the links are spelled differently now
    { title: "Advertisement KP/S/14/2026 recruitment", href: "https://www.norm.example.org/DATA/Notice%20%281%29.pdf" },
    { title: "Corrigendum KP/S/14/2026 recruitment", href: "https://norm.example.org/DATA/Corr%26Ext.pdf" },
    { title: "A genuinely new notice about recruitment", href: "https://norm.example.org/DATA/new.pdf" },
  ],
  flood: links("flood", 20),   // 20 new links at once
  edge: links("edge", 15),     // exactly 15: not a flood
  grp: links("grp", 16),       // grouped site with 16 new links: flagged too
  aw: [{ title: "Advertisement for Machinist trade apprentices", href: "http://127.0.0.1:8832/files/machinist.pdf?v=1.4.94" }],   // the site bumped ?v= since the seen record was made
};
const server = http.createServer((req, res) => {
  const name = req.url.slice(1);
  if (req.url.includes("/sendMessage")) { let b = ""; req.on("data", c => (b += c)); req.on("end", () => { sent.push(JSON.parse(b)); res.setHeader("content-type", "application/json"); res.end("{}"); }); return; }
  if (!pages[name]) { res.statusCode = 404; return res.end("no"); }
  res.setHeader("content-type", "text/html");
  res.end("<ul>" + pages[name].map(p => `<li><a href="${p.href}">${p.title}</a></li>`).join("") + "</ul>");
}).listen(8832);
const sent = [];
const B = "http://127.0.0.1:8832";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "norm-"));
const sourcesFile = path.join(dir, "sources.json"), stateFile = path.join(dir, "seen.json"), catchDir = path.join(dir, "catch");
const src = (id, extra = {}) => ({ id, name: id + " Board", runner: "india", tier: "FREE", level: "central", type: "html", url: `${B}/${id}`, minTitle: 10, limit: 50, ...extra });
fs.writeFileSync(sourcesFile, JSON.stringify([src("norm"), src("flood"), src("edge"), src("grp", { group: "G", groupName: "Group G", region: "grp" }), src("aw")]));
// the seen record keeps its OLD spelling of the links (this is what is already saved in state/seen-india.json)
const key = (t, l) => (t.toLowerCase().replace(/\s+/g, " ") + "|" + l).slice(0, 600);
const st = seen => ({ initialized: true, seen, fails: 0, warned: false });
fs.writeFileSync(stateFile, JSON.stringify({ sources: {
  norm: st({ [key("Advertisement KP/S/14/2026 recruitment", "http://norm.example.org/DATA//Notice (1).pdf")]: "2026-09-29T00:00:00Z", [key("Corrigendum KP/S/14/2026 recruitment", "http://norm.example.org/DATA/Corr&Ext.pdf")]: "2026-09-29T00:00:00Z" }),
  flood: st({}), edge: st({}), grp: st({}),
  aw: st({ [key("Advertisement for Machinist trade apprentices", "http://127.0.0.1:8832/files/machinist.pdf?v=1.4.93")]: "2026-09-29T00:00:00Z" }),
} }));
await new Promise(r => setTimeout(r, 200));
const r = await new Promise(res => execFile(process.execPath, ["src/monitor.mjs", "--sources", sourcesFile, "--state", stateFile, "--catch-dir", catchDir],
  { encoding: "utf8", cwd: new URL("..", import.meta.url), env: { ...process.env, SCRAPFLY_KEY: "", ANTHROPIC_API_KEY: "", TELEGRAM_BOT_TOKEN: "123:T", TELEGRAM_CHAT_ID: "1", TELEGRAM_API_BASE: B } },
  (err, stdout, stderr) => res({ code: err?.code ?? 0, stdout, stderr })));
const c = JSON.parse(fs.readFileSync(path.join(catchDir, fs.readdirSync(catchDir)[0]), "utf8"));
const by = site => c.items.filter(i => i.site === site + " Board");
const row = id => c.sites.find(s => s.id === id);

check("old-spelling links already seen are NOT caught again (no mass re-catch); only the genuinely new one is", by("norm").length === 1 && /genuinely new/.test(by("norm")[0].title), JSON.stringify(by("norm").map(i => i.title)));
check("the saved link keeps the site's own spelling", by("norm")[0].link === "https://norm.example.org/DATA/new.pdf");
check("20 new links from one site are ALL kept (nothing dropped)", by("flood").length === 20);
check("...and flagged possible_flood, on every item and on the site's result", by("flood").every(i => i.possible_flood === true) && row("flood").possible_flood === true && c.summary.possible_flood_sites === 2, JSON.stringify(c.summary));
check("the same file with a bumped ?v= is NOT caught again (no mass re-catch after a site release)", by("aw").length === 0 && row("aw").new_links === 0, JSON.stringify(row("aw")));
check("exactly 15 new links is not a flood", by("edge").length === 15 && !row("edge").possible_flood && by("edge").every(i => !("possible_flood" in i)));
check("a grouped site over the limit is flagged too", by("grp").length === 16 && by("grp").every(i => i.possible_flood === true));
check("the Telegram message says so, in the one message", sent.length === 1 && /Possible flood/.test(sent[0].text) && /flood Board \(20\)/.test(sent[0].text) && /grp Board \(16\)/.test(sent[0].text) && !/edge Board/.test(sent[0].text), sent[0]?.text);

// second scan: the same pages again -> nothing new, even though the stored keys now include the new spelling
sent.length = 0;
fs.rmSync(catchDir, { recursive: true, force: true });
await new Promise(res => execFile(process.execPath, ["src/monitor.mjs", "--sources", sourcesFile, "--state", stateFile, "--catch-dir", catchDir],
  { encoding: "utf8", cwd: new URL("..", import.meta.url), env: { ...process.env, SCRAPFLY_KEY: "", ANTHROPIC_API_KEY: "", TELEGRAM_BOT_TOKEN: "123:T", TELEGRAM_CHAT_ID: "1", TELEGRAM_API_BASE: B } }, () => res()));
const c2 = JSON.parse(fs.readFileSync(path.join(catchDir, fs.readdirSync(catchDir)[0]), "utf8"));
check("second scan: nothing caught twice, no flood message", c2.items.length === 0 && c2.summary.possible_flood_sites === 0 && !/flood/i.test(sent[0].text), sent[0]?.text);

fs.rmSync(dir, { recursive: true, force: true });
server.closeAllConnections(); server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exitCode = bad ? 1 : 0;
