// End-of-scan retry: a failed site gets ONE more try after all the other sites of its group; FAILED only if that fails too.
// The ScrapFly retry only runs while enough credits are left. Fake site + fake ScrapFly server. Run:  node test/retry.test.mjs
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

const page = name => `<ul><li><a href="/${name}.pdf">Advertisement for recruitment at ${name} 2026</a></li></ul>`;
let hits = [], sfHits = [], sent = [];
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname.includes("/sendMessage")) { let b = ""; req.on("data", c => (b += c)); req.on("end", () => { sent.push(JSON.parse(b)); res.setHeader("content-type", "application/json"); res.end("{}"); }); return; }
  if (u.pathname === "/scrape") {   // fake ScrapFly: every request is charged; "sf-flaky" fails once, "sf-dead" always (HTTP 502 from the target)
    const target = new URL(u.searchParams.get("url")).pathname;
    sfHits.push(target);
    const tries = sfHits.filter(t => t === target).length;
    res.setHeader("x-scrapfly-api-cost", target === "/sf-dead" || tries === 1 ? "5" : "25");
    if (target === "/sf-dead" || (target === "/sf-flaky" && tries === 1)) { res.statusCode = 502; res.setHeader("content-type", "application/json"); return res.end(JSON.stringify({ message: "upstream failed" })); }
    res.setHeader("content-type", "text/html"); return res.end(page(target.slice(1)));
  }
  hits.push(u.pathname);
  if (u.pathname === "/flaky" && hits.filter(h => h === "/flaky").length === 1) { req.socket.destroy(); return; }   // dropped connection, first time only
  if (u.pathname === "/dead") { res.statusCode = 500; return res.end("broken"); }
  res.setHeader("content-type", "text/html"); res.end(page(u.pathname.slice(1)));
}).listen(8833);
const B = "http://127.0.0.1:8833";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "retry-"));
const sourcesFile = path.join(dir, "sources.json");
const src = (id, extra = {}) => ({ id, name: id + " Board", runner: "india", tier: "FREE", level: "central", type: "html", url: `${B}/${id}`, minTitle: 10, limit: 20, ...extra });
fs.writeFileSync(sourcesFile, JSON.stringify([src("flaky"), src("dead"), src("good"), src("last"),
  src("sf-flaky", { tier: "SCRAPFLY" }), src("sf-dead", { tier: "SCRAPFLY" })]));

let runNo = 0;
async function scan(extraArgs = []) {
  hits = []; sfHits = []; sent = [];
  const stateFile = path.join(dir, `seen${++runNo}.json`), catchDir = path.join(dir, "catch" + runNo);
  await new Promise(res => execFile(process.execPath, ["src/monitor.mjs", "--sources", sourcesFile, "--state", stateFile, "--catch-dir", catchDir, ...extraArgs],
    { encoding: "utf8", cwd: new URL("..", import.meta.url), env: { ...process.env, SCRAPFLY_KEY: "test-key-not-real", SCRAPFLY_API_BASE: B, ANTHROPIC_API_KEY: "", TELEGRAM_BOT_TOKEN: "123:T", TELEGRAM_CHAT_ID: "1", TELEGRAM_API_BASE: B } }, () => res()));
  const c = JSON.parse(fs.readFileSync(path.join(catchDir, fs.readdirSync(catchDir)[0]), "utf8"));
  return { c, row: id => c.sites.find(s => s.id === id), hits: [...hits], sfHits: [...sfHits], text: sent[0]?.text ?? "" };
}
await new Promise(r => setTimeout(r, 200));

// ---- FREE group (no ScrapFly limit configured) ----
let r = await scan();
check("a dropped connection is retried and the site ends OK, marked retried", r.row("flaky").status === "OK" && r.row("flaky").retried === true && /retry/i.test(r.row("flaky").note) && /cut off|connection/i.test(r.row("flaky").first_try_reason), JSON.stringify(r.row("flaky")));
check("the retry runs AFTER all the other FREE sites, not right away", r.hits.indexOf("/flaky") < r.hits.indexOf("/dead") && r.hits.lastIndexOf("/flaky") > r.hits.indexOf("/last"), r.hits.join(" "));
check("a site that fails twice is FAILED, retried, with both reasons", r.row("dead").status === "FAILED" && r.row("dead").retried === true && r.row("dead").reason && r.row("dead").first_try_reason && r.hits.filter(h => h === "/dead").length === 2, JSON.stringify(r.row("dead")));
check("a site that works is fetched ONCE (no needless retry)", r.hits.filter(h => h === "/good").length === 1 && !r.row("good").retried);
check("only the still-failing site is in the Telegram 'Failed' list", /Failed: dead Board, sf-\w+ Board, sf-\w+ Board\./.test(r.text) && !/Failed:[^.]*, flaky Board/.test(r.text) && !/good Board|last Board/.test(r.text), r.text);
check("summary counts retries", r.c.summary.sites_ok_on_retry === 1 && r.c.summary.sites_retried >= 2, JSON.stringify(r.c.summary));

// ---- SCRAPFLY group: no credit limit set -> the retry is NOT run (safe default), credits of the first try are still counted ----
check("ScrapFly, no limit configured: no retry, each site fetched once, reason in the catch file", r.sfHits.length === 2 && /scrapflyCreditLimit is not set/.test(r.row("sf-flaky").retry_skipped) && r.row("sf-flaky").status === "FAILED" && !r.row("sf-flaky").retried, JSON.stringify(r.row("sf-flaky")));
check("ScrapFly credits of the first tries are counted (5 + 5)", r.c.scrapfly.credits_this_scan === 10 && r.c.scrapfly.credits_this_month === 10, JSON.stringify(r.c.scrapfly));

// ---- plenty of credits: retried; credits of BOTH tries counted ----
r = await scan(["--scrapfly-credit-limit", "1000", "--scrapfly-retry-min-left", "100"]);
check("ScrapFly, enough credits: the flaky site is retried and OK; the dead one is retried and FAILED", r.row("sf-flaky").status === "OK" && r.row("sf-flaky").retried === true && r.row("sf-dead").status === "FAILED" && r.row("sf-dead").retried === true && r.sfHits.length === 4, JSON.stringify([r.row("sf-flaky"), r.row("sf-dead")]));
check("ScrapFly credits include the retries: flaky 5+25, dead 5+5 = 40, per site and per scan", r.row("sf-flaky").credits === 30 && r.row("sf-dead").credits === 10 && r.c.scrapfly.credits_this_scan === 40 && r.c.scrapfly.credits_this_month === 40, JSON.stringify(r.c.scrapfly));
check("the ScrapFly retries ran after the whole ScrapFly group (both first tries came first)", r.sfHits.slice(0, 2).sort().join() === "/sf-dead,/sf-flaky", r.sfHits.join(" "));

// ---- credits getting low: the guard is checked before EACH retry ----
// limit 120, min-left 100: after the first tries 10 are used (110 left) -> the first retry runs (costs 30 in all) -> 85 left -> the next retry is skipped
r = await scan(["--scrapfly-credit-limit", "120", "--scrapfly-retry-min-left", "100"]);
check("ScrapFly, credits get low: the first retry runs, the next is skipped with the reason", r.row("sf-flaky").retried === true && r.row("sf-flaky").status === "OK" && /only 85 ScrapFly credits left/.test(r.row("sf-dead").retry_skipped ?? "") && r.sfHits.length === 3, JSON.stringify([r.row("sf-flaky"), r.row("sf-dead")]));
// limit 100 and nothing used yet beyond the first tries (10) -> 90 left < 100: no retry at all
r = await scan(["--scrapfly-credit-limit", "100", "--scrapfly-retry-min-left", "100"]);
check("ScrapFly, below the safe limit: no retry at all", r.sfHits.length === 2 && /only 90 ScrapFly credits left/.test(r.row("sf-flaky").retry_skipped ?? "") && r.row("sf-flaky").status === "FAILED", JSON.stringify(r.row("sf-flaky")));

fs.rmSync(dir, { recursive: true, force: true });
server.closeAllConnections(); server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exitCode = bad ? 1 : 0;
