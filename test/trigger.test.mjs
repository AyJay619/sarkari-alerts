// Tests for the PC trigger script against a FAKE GitHub and a fake Telegram. Run:  node test/trigger.test.mjs
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { buildXml } from "../trigger/task.mjs";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

const TOKEN = "github_pat_" + "A1b2C3d4E5".repeat(4);
let gh = [], ghStatus = 204, tg = [];
const github = http.createServer((q, r) => {
  let b = ""; q.on("data", c => (b += c)); q.on("end", () => {
    gh.push({ method: q.method, url: q.url, auth: q.headers.authorization, body: b });
    r.statusCode = q.url.endsWith("/dispatches") || ghStatus !== 204 ? ghStatus : 200; r.setHeader("content-type", "application/json");
    r.end(ghStatus === 204 ? (q.url.endsWith("/dispatches") ? "" : "{}") : JSON.stringify({ message: "Bad credentials" }));
  });
}).listen(8820);
const telegram = http.createServer((q, r) => { let b = ""; q.on("data", c => (b += c)); q.on("end", () => { if (b) tg.push(JSON.parse(b)); r.setHeader("content-type", "application/json"); r.end('{"ok":true}'); }); }).listen(8821);

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "trig-"));
const tokenFile = path.join(dir, "github-token.txt");
const run = (args = []) => new Promise(res => execFile(process.execPath, ["trigger/trigger-run.mjs", ...args], {
  encoding: "utf8", cwd: new URL("..", import.meta.url),
  env: { ...process.env, SARKARI_TRIGGER_DIR: dir, SARKARI_GITHUB_TOKEN_FILE: tokenFile, GITHUB_API_BASE: "http://127.0.0.1:8820", TELEGRAM_API_BASE: "http://127.0.0.1:8821", TELEGRAM_BOT_TOKEN: "1:T", TELEGRAM_CHAT_ID: "5", SARKARI_TRIGGER_TRIES: "2", SARKARI_TRIGGER_PAUSE_MS: "50" },
}, (err, stdout, stderr) => res({ code: err?.code ?? 0, out: stdout + stderr })));
await new Promise(r => setTimeout(r, 200));
const log = () => { try { return fs.readFileSync(path.join(dir, "trigger.log"), "utf8"); } catch { return ""; } };

// the schedule itself
const xml = buildXml();
check("the scheduled task has the five India times", ["09:30", "12:30", "15:30", "18:30", "21:30"].every(t => xml.includes(`T${t}:00`)) && (xml.match(/<CalendarTrigger>/g) || []).length === 5);
check("...wakes the PC, catches up a missed time, never runs two copies", /<WakeToRun>true/.test(xml) && /<StartWhenAvailable>true/.test(xml) && /<MultipleInstancesPolicy>IgnoreNew/.test(xml));

// no token file
let r = await run();
check("no token file: fails clearly, calls nothing, warns on Telegram", r.code === 1 && gh.length === 0 && /Token file not found/.test(r.out) && tg.length === 1 && /PC trigger/.test(tg[0].text), r.out.slice(0, 200));

// placeholder text
fs.writeFileSync(tokenFile, "PASTE-YOUR-TOKEN-HERE\n"); gh = []; tg = [];
r = await run();
check("the placeholder text is not accepted as a token", r.code === 1 && gh.length === 0 && /does not contain a GitHub token/.test(r.out));

// a good token
fs.writeFileSync(tokenFile, TOKEN + "\n"); gh = []; tg = []; ghStatus = 204;
r = await run();
check("good token: one POST to the workflow's dispatches with ref main and slot_guard true", r.code === 0 && gh.length === 1 && gh[0].method === "POST" && gh[0].url === "/repos/AyJay619/sarkari-alerts/actions/workflows/monitor.yml/dispatches"
  && JSON.parse(gh[0].body).ref === "main" && JSON.parse(gh[0].body).inputs.slot_guard === "true", JSON.stringify(gh[0]));
check("the token is sent as a Bearer header, and is never printed or logged", gh[0].auth === "Bearer " + TOKEN && !r.out.includes(TOKEN) && !log().includes(TOKEN));
check("...it writes a log line, and sends no Telegram message on success", /Started the workflow/.test(log()) && tg.length === 0);

// --check starts nothing
gh = [];
r = await run(["--check"]);
check("--check only reads the workflow (GET), starts nothing", r.code === 0 && gh.length === 1 && gh[0].method === "GET" && !gh[0].url.endsWith("/dispatches") && /Token OK/.test(r.out));

// bad / expired token
gh = []; tg = []; ghStatus = 401;
r = await run();
check("expired token (401): fails once, no endless retry, explains it, warns on Telegram", r.code === 1 && gh.length === 1 && /expired/.test(r.out) && tg.length === 1 && /401/.test(tg[0].text) && !JSON.stringify(tg).includes(TOKEN));

// GitHub having a bad moment: retried, then a warning
gh = []; tg = []; ghStatus = 503;
r = await run();
check("GitHub 503: retried (2 tries here), then a Telegram warning", r.code === 1 && gh.length === 2 && tg.length === 1 && /could not reach GitHub/.test(tg[0].text));

// no internet at all
gh = []; tg = [];
r = await new Promise(res => execFile(process.execPath, ["trigger/trigger-run.mjs"], { encoding: "utf8", cwd: new URL("..", import.meta.url),
  env: { ...process.env, SARKARI_TRIGGER_DIR: dir, SARKARI_GITHUB_TOKEN_FILE: tokenFile, GITHUB_API_BASE: "http://127.0.0.1:1", TELEGRAM_API_BASE: "http://127.0.0.1:8821", TELEGRAM_BOT_TOKEN: "1:T", TELEGRAM_CHAT_ID: "5", SARKARI_TRIGGER_TRIES: "2", SARKARI_TRIGGER_PAUSE_MS: "50" } },
  (err, stdout, stderr) => res({ code: err?.code ?? 0, out: stdout + stderr })));
check("no connection: retried, then fails with a warning, token never printed", r.code === 1 && /No connection to GitHub/.test(r.out) && tg.length === 1 && !r.out.includes(TOKEN));

fs.rmSync(dir, { recursive: true, force: true });
github.closeAllConnections(); github.close(); telegram.closeAllConnections(); telegram.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exitCode = bad ? 1 : 0;
