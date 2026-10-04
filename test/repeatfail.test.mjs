// "Repeat failure" alert: the same source FAILED in 3 scans in a row -> one extra line in the ONE Telegram message ("X failed 3 scans in a row - needs audit").
// The counter lives in the seen record (state file), counts up every scan, resets on the first success, and is not counted when the whole internet was down.
// Run:  node test/repeatfail.test.mjs
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { scanMessage } from "../src/catch.mjs";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

// ---- the message itself ----
const base = { newLinks: 0, sitesWithNew: 0, failed: [], scrapfly: { configured: false } };
check("no repeat failures: no extra line", scanMessage({ ...base }).split("\n").length === 1);
check("one repeat failure: the exact wording", scanMessage({ ...base, failed: ["National Insurance"], repeat: [{ name: "National Insurance", n: 3 }] }).split("\n")[1] === "National Insurance failed 3 scans in a row - needs audit");
check("the count goes up", /failed 5 scans in a row/.test(scanMessage({ ...base, failed: ["X"], repeat: [{ name: "X", n: 5 }] })));
check("a name with & is escaped for Telegram", /Punjab &amp; Sind Bank failed 3/.test(scanMessage({ ...base, failed: ["Punjab & Sind Bank"], repeat: [{ name: "Punjab & Sind Bank", n: 3 }] })));
const many = Array.from({ length: 11 }, (_, i) => ({ name: "Site " + i, n: 3 }));
const long = scanMessage({ ...base, failed: many.map(m => m.name), repeat: many });
check("more than 8 repeat failures: 8 lines and one 'and N more' line", long.split("\n").filter(l => /needs audit/.test(l)).length === 9 && /and 3 more sites failed 3 or more scans in a row - needs audit/.test(long));

// ---- through the real monitor, three scans in a row ----
let mode = "dead", hits = 0, sent = [];
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname.includes("/sendMessage")) { let b = ""; req.on("data", c => (b += c)); req.on("end", () => { sent.push(JSON.parse(b)); res.setHeader("content-type", "application/json"); res.end("{}"); }); return; }
  if (u.pathname === "/good") { res.setHeader("content-type", "text/html"); return res.end('<a href="/g1.pdf">Advertisement for recruitment at the good site 2026</a>'); }
  if (u.pathname === "/flaky") { hits++; if (mode === "dead") { res.statusCode = 500; return res.end("broken"); } res.setHeader("content-type", "text/html"); return res.end('<a href="/f1.pdf">Advertisement for recruitment at the flaky site 2026</a>'); }
  res.statusCode = 404; res.end("no");
}).listen(8844);
const B = "http://127.0.0.1:8844";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "repeatfail-"));
const sourcesFile = path.join(dir, "sources.json"), stateFile = path.join(dir, "seen.json"), catchDir = path.join(dir, "catch");
const src = (id, name) => ({ id, name, runner: "india", tier: "FREE", level: "central", type: "html", url: `${B}/${id}`, minTitle: 10, limit: 20 });
fs.writeFileSync(sourcesFile, JSON.stringify([src("good", "Good Board"), src("flaky", "Flaky & Co Board")]));
const scan = async () => {
  sent = [];
  await new Promise(res => execFile(process.execPath, ["src/monitor.mjs", "--sources", sourcesFile, "--state", stateFile, "--catch-dir", catchDir],
    { encoding: "utf8", cwd: new URL("..", import.meta.url), env: { ...process.env, SCRAPFLY_KEY: "", ANTHROPIC_API_KEY: "", TELEGRAM_BOT_TOKEN: "123:T", TELEGRAM_CHAT_ID: "1", TELEGRAM_API_BASE: B } }, () => res()));
  const files = fs.readdirSync(catchDir).filter(f => f.endsWith(".json")).sort((a, b) => a.slice(0, -5).localeCompare(b.slice(0, -5)));
  const c = JSON.parse(fs.readFileSync(path.join(catchDir, files.at(-1)), "utf8"));
  return { text: sent[0]?.text ?? "", c, state: JSON.parse(fs.readFileSync(stateFile, "utf8")) };
};
await new Promise(r => setTimeout(r, 200));

let r = await scan();
check("scan 1: failed once, no alert line, counter 1 in the state file", !/needs audit/.test(r.text) && r.state.sources.flaky.fails === 1 && r.c.sites.find(s => s.id === "flaky").failed_scans_in_a_row === 1, r.text);
r = await scan();
check("scan 2: failed twice, still no alert line", !/needs audit/.test(r.text) && r.state.sources.flaky.fails === 2, r.text);
r = await scan();
check("scan 3: the third failure in a row adds the line, in the same ONE message", sent.length === 1 && /Flaky &amp; Co Board failed 3 scans in a row - needs audit/.test(r.text) && r.state.sources.flaky.fails === 3, r.text);
check("the catch file marks it (site flag + summary count)", r.c.sites.find(s => s.id === "flaky").repeat_failure === true && r.c.summary.repeat_failure_sites === 1, JSON.stringify(r.c.summary));
check("a healthy site never gets the line", !/Good Board failed/.test(r.text));
r = await scan();
check("scan 4: still failing, the line stays and counts up", /Flaky &amp; Co Board failed 4 scans in a row - needs audit/.test(r.text) && r.state.sources.flaky.fails === 4, r.text);

mode = "alive";
r = await scan();
check("the first success clears it: no line, counter back to 0", !/needs audit/.test(r.text) && r.state.sources.flaky.fails === 0, r.text);
mode = "dead";
r = await scan();
check("after a recovery the count starts again at 1", !/needs audit/.test(r.text) && r.state.sources.flaky.fails === 1, r.text);

// when (nearly) EVERY site fails the internet dropped: nobody's counter goes up and nobody gets the line
fs.writeFileSync(sourcesFile, JSON.stringify(["a", "b", "c", "d", "e"].map(i => src("dead" + i, "Dead " + i.toUpperCase()))));
const deadState = { sources: Object.fromEntries(["a", "b", "c", "d", "e"].map(i => ["dead" + i, { initialized: true, seen: {}, fails: 2, warned: false }])) };
fs.writeFileSync(stateFile, JSON.stringify(deadState));
r = await scan();
check("everything failed (internet down): counters stay at 2 and there is no 'needs audit' line", Object.values(r.state.sources).every(s => s.fails === 2) && !/needs audit/.test(r.text) && /internet probably dropped/.test(r.text), r.text.split("\n")[0]);

fs.rmSync(dir, { recursive: true, force: true });
server.closeAllConnections(); server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exitCode = bad ? 1 : 0;
