// Tests for long Telegram messages against a FAKE Telegram server. Run:  node test/telegram.test.mjs
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { makeSender, splitMessage, SEND_BUTTON } from "../src/telegram.mjs";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

const sent = []; let failAt = -1;
const server = http.createServer((req, res) => {
  let body = ""; req.on("data", c => (body += c)); req.on("end", () => {
    const data = JSON.parse(body); res.setHeader("content-type", "application/json");
    if (data.text.length > 4096) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, description: "Bad Request: message is too long" })); }
    sent.push(data);
    if (sent.length === failAt) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, description: "Bad Request: something else" })); }
    res.end(JSON.stringify({ ok: true, result: true }));
  });
}).listen(8815);
process.env.TELEGRAM_API_BASE = "http://127.0.0.1:8815";

const lines = Array.from({ length: 400 }, (_, i) => `🏛️ <b>Now watching Source ${i}</b> — ${"x".repeat(40)}`);
const plainOf = h => h.replace(/<\/?b>/g, "");

// pure splitting
check("a short message is left alone", splitMessage("hello").length === 1 && splitMessage("hello")[0] === "hello");
const long = "👀 " + lines.join("\n");
const parts = splitMessage(long);
check("a long message is split into parts under the limit", parts.length > 1 && parts.every(p => p.length <= 3600), parts.map(p => p.length).join(","));
check("parts split only at line breaks (no line is cut)", plainOf(parts.join("\n")).split("\n").filter(Boolean).length === lines.length + 0 && lines.every(l => plainOf(parts.join("\n")).includes(plainOf(l))));
const wrapped = "<b>" + lines.join("\n") + "</b>";
const wp = splitMessage(wrapped);
const cnt = (s, re) => (s.match(re) || []).length;
check("open <b> tags are closed and re-opened so every part is valid HTML", wp.length > 1 && wp.every(p => cnt(p, /<b>/g) === cnt(p, /<\/b>/g)));
check("one giant line is cut hard, still under the limit", splitMessage("a".repeat(9000)).every(p => p.length <= 3500));

// through the sender, against the fake Telegram
const send = makeSender({ token: "123:T", chatId: "1", dryRun: false });
let ok = await send(long, false);
check("a long summary is delivered as several messages, none over 4096", ok === true && sent.length === parts.length && sent.every(m => m.text.length <= 4096), `${sent.length} messages`);
check("no button on summary parts", sent.every(m => !m.reply_markup));
sent.length = 0;
ok = await send("<b>Alert</b>\nshort", true);
check("a short alert is one message with the button", ok === true && sent.length === 1 && JSON.stringify(sent[0].reply_markup) === JSON.stringify(SEND_BUTTON));
sent.length = 0; failAt = 2;
ok = await send(long, false);
check("if one part fails, send() says false (the caller decides what that means) but the other parts still go out", ok === false && sent.length >= parts.length - 1, `${sent.length} accepted`);

// a summary that Telegram refuses must NOT fail the whole run (exit code 0), and the source is still recorded
const site = http.createServer((q, r) => { r.setHeader("content-type", "text/html"); r.end('<ul><li><a href="/a.pdf">Notice about the engagement of apprentices</a></li></ul>'); }).listen(8816);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mon-test-"));
fs.writeFileSync(path.join(tmp, "sources.json"), JSON.stringify([{ id: "t", name: "Test site", runner: "india", level: "central", type: "html", url: "http://127.0.0.1:8816/", selector: "li a", minTitle: 10 }]));
const refuseSummary = http.createServer((q, r) => { let b = ""; q.on("data", c => (b += c)); q.on("end", () => { const d = b ? JSON.parse(b) : {}; r.setHeader("content-type", "application/json"); if (String(d.text ?? "").startsWith("👀")) { r.statusCode = 400; return r.end(JSON.stringify({ ok: false, description: "Bad Request: message is too long" })); } r.end(JSON.stringify({ ok: true, result: true })); }); }).listen(8817);
const stateFile = path.join(tmp, "state.json");
const child = spawn(process.execPath, ["src/monitor.mjs", "--sources", path.join(tmp, "sources.json"), "--state", stateFile], { cwd: new URL("..", import.meta.url), env: { ...process.env, TELEGRAM_BOT_TOKEN: "123:T", TELEGRAM_CHAT_ID: "1", TELEGRAM_API_BASE: "http://127.0.0.1:8817", ANTHROPIC_API_KEY: "" } });
let mout = ""; child.stdout.on("data", d => (mout += d)); child.stderr.on("data", d => (mout += d));
const code = await new Promise(r => child.on("close", r));
check("Telegram refusing the 'now watching' summary does not fail the run (exit code 0)", code === 0, "exit " + code + " " + (code ? mout.slice(-300) : ""));
check("...it is logged, and the site is still recorded as watched", mout.includes("Could not deliver the 'now watching' summary") && JSON.parse(fs.readFileSync(stateFile, "utf8")).sources.t.initialized === true);
site.close(); refuseSummary.close(); fs.rmSync(tmp, { recursive: true, force: true });

server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exit(bad ? 1 : 0);
