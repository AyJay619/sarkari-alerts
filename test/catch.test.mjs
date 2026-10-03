// Catch-only scan against a fake site: new links only, per-site OK/FAILED status, FREE before SCRAPFLY, key never needed from a file,
// ONE short Telegram message. Run:  node test/catch.test.mjs
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

let page = ["Advertisement for recruitment of Junior Engineer 2026", "Advertisement for recruitment of Stenographer 2026"];
const sent = [];
const server = http.createServer((req, res) => {
  if (req.url === "/list") { res.setHeader("content-type", "text/html"); return res.end("<ul>" + page.map((t, i) => `<li><a href="/${t.split(" ").pop() === "2026" ? t.split(" ").slice(-2, -1)[0] : i}.pdf">${t}</a></li>`).join("") + "</ul>"); }
  if (req.url === "/empty") { res.setHeader("content-type", "text/html"); return res.end("<p>nothing</p>"); }
  if (req.url.includes("/sendMessage")) { let b = ""; req.on("data", c => (b += c)); req.on("end", () => { sent.push(JSON.parse(b)); res.setHeader("content-type", "application/json"); res.end("{}"); }); return; }
  res.statusCode = 404; res.end("no");
}).listen(8831);
const B = "http://127.0.0.1:8831";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "catch-"));
const sourcesFile = path.join(dir, "sources.json"), stateFile = path.join(dir, "seen.json"), catchDir = path.join(dir, "inbox", "catch");
const src = (id, name, extra = {}) => ({ id, name, runner: "india", tier: "FREE", level: "central", type: "html", url: B + "/list", minTitle: 10, limit: 20, ...extra });
fs.writeFileSync(sourcesFile, JSON.stringify([
  src("ok", "Good Board"),
  src("bad", "Broken Board", { url: B + "/missing" }),
  src("empty", "Empty Board", { url: B + "/empty" }),
  src("pay", "Paid Board", { tier: "SCRAPFLY" }),
]));
const run = () => new Promise(res => execFile(process.execPath, ["src/monitor.mjs", "--sources", sourcesFile, "--state", stateFile, "--catch-dir", catchDir],
  { encoding: "utf8", cwd: new URL("..", import.meta.url), env: { ...process.env, SCRAPFLY_KEY: "", ANTHROPIC_API_KEY: "", TELEGRAM_BOT_TOKEN: "123:T", TELEGRAM_CHAT_ID: "1", TELEGRAM_API_BASE: B } },
  (err, stdout, stderr) => res({ code: err?.code ?? 0, stdout, stderr })));
const files = () => (fs.existsSync(catchDir) ? fs.readdirSync(catchDir).filter(f => f.endsWith(".json")).sort((a, b) => a.slice(0, -5).localeCompare(b.slice(0, -5))) : []);
const read = f => JSON.parse(fs.readFileSync(path.join(catchDir, f), "utf8"));
await new Promise(r => setTimeout(r, 200));

// scan 1: first time = baseline. Nothing is caught, but the file and the status list exist; the folder was created by the scan.
let r = await run();
check("the catch folder is created when missing, one file per scan, named YYYY-MM-DD_HHMM.json", files().length === 1 && /^\d{4}-\d{2}-\d{2}_\d{4}\.json$/.test(files()[0]), files().join(","));
let c = read(files()[0]);
check("first scan: nothing caught (page recorded as already seen)", c.items.length === 0 && c.sites.find(s => s.id === "ok").new_links === 0);
const broken = c.sites.find(s => s.id === "bad");
check("a failed site is FAILED with a reason, never 'OK, 0 new'", broken.status === "FAILED" && /404|not found/i.test(broken.reason) && broken.links === undefined, JSON.stringify(broken));
check("a site with an empty page FAILS too (no notices found)", c.sites.find(s => s.id === "empty").status === "FAILED");
check("an OK site shows its link count", c.sites.find(s => s.id === "ok").status === "OK" && c.sites.find(s => s.id === "ok").links === 2);
check("SCRAPFLY site is SKIPPED (not OK) when SCRAPFLY_KEY is missing, and the file says why", c.sites.find(s => s.id === "pay").status === "SKIPPED" && c.scrapfly.group_ran === false && /SCRAPFLY_KEY/.test(c.scrapfly.skipped_because));
check("exactly ONE Telegram message, short, naming the failed sites and the skipped ScrapFly group", sent.length === 1 && /Scan done: 0 new links from 0 sites\. Failed: Broken Board, Empty Board\./.test(sent[0].text) && /ScrapFly: SKIPPED/.test(sent[0].text) && !sent[0].reply_markup, sent[0]?.text);

// scan 2: one new link -> caught once, with all six fields
sent.length = 0;
page = ["Advertisement for recruitment of Clerk 2026", ...page];
r = await run();
c = read(files().at(-1));
const it = c.items[0];
check("a new link is caught with site, group, page_url, title, link, first_seen", c.items.length === 1 && it.site === "Good Board" && "group" in it && it.page_url === B + "/list" && /Clerk/.test(it.title) && it.link === B + "/Clerk.pdf" && !isNaN(Date.parse(it.first_seen)), JSON.stringify(it));
check("the Telegram message counts it", sent.length === 1 && /Scan done: 1 new link from 1 site\./.test(sent[0].text), sent[0]?.text);

// scan 3: same page -> nothing caught twice
sent.length = 0;
r = await run();
c = read(files().at(-1));
check("nothing is caught twice", c.items.length === 0 && /0 new links/.test(sent[0].text));
check("no Claude API: the config switch is off", JSON.parse(fs.readFileSync(new URL("../config.json", import.meta.url), "utf8")).aiEnabled === false && JSON.parse(fs.readFileSync(new URL("../config.json", import.meta.url), "utf8")).sendToAgentsButton === false);

fs.rmSync(dir, { recursive: true, force: true });
server.closeAllConnections(); server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exitCode = bad ? 1 : 0;
