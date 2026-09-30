// A source's FIRST run only records what is on the page: no alerts and NO calls to the Anthropic API.
// Runs the real monitor against a fake site and a fake Anthropic server (counts requests). Run:  node test/firstrun.test.mjs
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

let aiRequests = 0, page = ["Advertisement for recruitment of Junior Engineer 2026", "Advertisement for recruitment of Stenographer 2026"];
const server = http.createServer((req, res) => {
  if (req.url.startsWith("/v1/messages")) { aiRequests++; res.statusCode = 500; return res.end("{}"); }
  if (req.url === "/list") { res.setHeader("content-type", "text/html"); return res.end("<ul>" + page.map((t, i) => `<li><a href="/f${i}.pdf">${t}</a></li>`).join("") + "</ul>"); }
  res.statusCode = 404; res.end("no");
}).listen(8815);
const B = "http://127.0.0.1:8815";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "firstrun-"));
const sourcesFile = path.join(dir, "sources.json"), stateFile = path.join(dir, "seen.json");
fs.writeFileSync(sourcesFile, JSON.stringify([{ id: "t1", name: "Test Board", runner: "india", level: "state", type: "html", url: B + "/list", minTitle: 10, limit: 20 }]));
// (async, so this process can keep answering the fake server while the monitor runs)
const run = () => new Promise(res => execFile(process.execPath, ["src/monitor.mjs", "--dry-run", "--sources", sourcesFile, "--state", stateFile], { encoding: "utf8", cwd: new URL("..", import.meta.url), env: { ...process.env, ANTHROPIC_API_KEY: "test-key", ANTHROPIC_BASE_URL: B, TELEGRAM_BOT_TOKEN: "", TELEGRAM_CHAT_ID: "" } }, (err, stdout, stderr) => res({ stdout, stderr })));
const listen = () => new Promise(r => setTimeout(r, 200));
await listen();

let r = await run();
check("first run: notices are recorded (FIRST RUN)", /FIRST RUN Test Board: recorded 2/.test(r.stdout), r.stdout.slice(0, 200));
check("first run: ZERO Anthropic API calls", aiRequests === 0, `calls: ${aiRequests}`);
check("first run: only the 'Now watching' message, no notice alert", /Now watching \*Test Board\*/.test(r.stdout) && !/Advertisement for recruitment/.test(r.stdout.replace(/Test Board/g, "")) , "");

r = await run();
check("second run: nothing new, still no API call", /0 new/.test(r.stdout) && aiRequests === 0, `calls: ${aiRequests}`);

page = ["Advertisement for recruitment of Clerk 2026", ...page];
r = await run();
check("a genuinely new notice on a later run IS looked at (the API counter works)", aiRequests >= 1, `calls: ${aiRequests}`);

fs.rmSync(dir, { recursive: true, force: true });
for (const f of ["state/ai-cache-all.json", "state/ai-log-all.jsonl"]) fs.rmSync(new URL("../" + f, import.meta.url), { force: true });   // the monitor writes these next to the real state files when --state is given
server.closeAllConnections(); server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exitCode = bad ? 1 : 0;
