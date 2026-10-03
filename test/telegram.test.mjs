// Tests for long Telegram messages against a FAKE Telegram server. Run:  node test/telegram.test.mjs
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { makeSender, splitMessage, SEND_BUTTON, formatItem, formatGroup } from "../src/telegram.mjs";
process.env.SARKARI_LEGACY_ALERTS = "1";   // these tests cover the old alert pipeline (config.json now defaults to catch-only)

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

const sent = []; let failAt = -1;
const server = http.createServer((req, res) => {
  let body = ""; req.on("data", c => (body += c)); req.on("end", () => {
    const data = JSON.parse(body); res.setHeader("content-type", "application/json");
    if (data.text.length > 4096) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, description: "Bad Request: message is too long" })); }
    if (data.parse_mode && data.text.includes("BADTAG")) { res.statusCode = 400; return res.end(JSON.stringify({ ok: false, description: "Bad Request: can't parse entities: Unsupported start tag" })); }
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

// ---- more limits: grouped alerts, the "Now watching" summary, cuts inside tags/entities, parse errors, failed sends ----
const regions = Array.from({ length: 21 }, (_, i) => "RRB Region-Name-" + i);
const worst = formatGroup("RRB", "Job", "T".repeat(3000), regions.slice(0, 20), 21, "https://x.test/" + "a".repeat(500), null, "central", { body: Array.from({ length: 40 }, () => "L".repeat(2000)), skip: null });
check("a grouped alert with a huge title and body is still ONE message under 4096", worst.length < 4096 && splitMessage(worst).length === 1, "length " + worst.length);
const worstItem = formatItem("Src", "Job", "T".repeat(5000), "https://x.test/" + "a".repeat(500), null, "state", { body: Array.from({ length: 40 }, () => "L".repeat(2000)), skip: "r".repeat(3000) });
check("a single-notice alert with huge fields is capped the same way", worstItem.length < 4096, "length " + worstItem.length);
const watching = "👀 " + Array.from({ length: 200 }, (_, i) => `Now watching <b>Source ${i} & Co</b> — ${i} existing notices recorded`).join("\n");
sent.length = 0; failAt = -1;
ok = await send(watching, false);
const back = sent.map(m => m.text).join("\n");
check("the 'Now watching' summary is split; every source line arrives whole, none cut in half", ok === true && sent.length > 1 && sent.every(m => m.text.length <= 4096) && Array.from({ length: 200 }, (_, i) => `Now watching <b>Source ${i} & Co</b> — ${i} existing notices recorded`).every(l => back.includes(l)), sent.length + " messages");
const giant = ("word &amp; <a href=\"https://x.test/very/long\">link</a> ").repeat(400);
const gp = splitMessage(giant);
check("a giant line is cut only at spaces: no part ends inside a tag or an &entity;", gp.length > 1 && gp.every(p => p.length <= 3600 && !/<[^>]*$/.test(p) && !/&[a-z]*$/.test(p)), gp.map(p => p.length).join(","));
check("...and open tags are balanced in every part", gp.every(p => cnt(p, /<a /g) === cnt(p, /<\/a>/g)));
sent.length = 0;
ok = await send("<b>Alert</b> with BADTAG <weird>", true);
check("a message Telegram cannot parse is re-sent once as plain text instead of failing forever", ok === true && sent.length === 1 && !sent[0].parse_mode && !/<b>/.test(sent[0].text) && sent[0].reply_markup, JSON.stringify(sent[0]?.text));
const badSend = makeSender({ token: "123:T", chatId: "1", dryRun: false });
const savedBase = process.env.TELEGRAM_API_BASE; process.env.TELEGRAM_API_BASE = "http://127.0.0.1:1";   // nothing listens here
ok = await badSend("hello", false);
process.env.TELEGRAM_API_BASE = savedBase;
check("an unreachable Telegram makes send() return false (it never throws)", ok === false);

// Telegram failing for a NEW notice: the run ends with exit code 1, but the state file is still written first (so the Save step has it)
const site2 = http.createServer((q, r) => { r.setHeader("content-type", "text/html"); r.end('<ul><li><a href="/a.pdf">Notice about the engagement of apprentices</a></li><li><a href="/b.pdf">Old notice about the engagement of staff</a></li></ul>'); }).listen(8817);
const tmp2 = fs.mkdtempSync(path.join(os.tmpdir(), "mon-test2-"));
fs.writeFileSync(path.join(tmp2, "sources.json"), JSON.stringify([{ id: "t", name: "Test site", runner: "india", level: "central", type: "html", url: "http://127.0.0.1:8817/", selector: "li a", minTitle: 10 }]));
const failTg = http.createServer((q, r) => { q.resume(); q.on("end", () => { r.setHeader("content-type", "application/json"); r.statusCode = q.url.includes("sendMessage") ? 400 : 200; r.end(JSON.stringify({ ok: false, description: "Bad Request: nope" })); }); }).listen(8818);
const state2 = path.join(tmp2, "state.json");
fs.writeFileSync(state2, JSON.stringify({ sources: { t: { initialized: true, seen: { "old notice about the engagement of staff|http://127.0.0.1:8817/b.pdf": "2026-01-01T00:00:00Z" }, fails: 0, warned: false } } }));
const child2 = spawn(process.execPath, ["src/monitor.mjs", "--sources", path.join(tmp2, "sources.json"), "--state", state2], { cwd: new URL("..", import.meta.url), env: { ...process.env, TELEGRAM_BOT_TOKEN: "123:T", TELEGRAM_CHAT_ID: "1", TELEGRAM_API_BASE: "http://127.0.0.1:8818", ANTHROPIC_API_KEY: "" } });
let out2 = ""; child2.stdout.on("data", d => (out2 += d)); child2.stderr.on("data", d => (out2 += d));
const code2 = await new Promise(r => child2.on("close", r));
const st2 = JSON.parse(fs.readFileSync(state2, "utf8")).sources.t;
check("Telegram failing on an alert: exit code 1 (run reported) ...", code2 === 1, "exit " + code2 + " " + out2.slice(-200));
check("... but the state file is still saved, and the undelivered notice is NOT marked seen (it is retried next run)", st2.initialized === true && !Object.keys(st2.seen).some(k => k.includes("a.pdf")) && Object.keys(st2.seen).some(k => k.includes("b.pdf")));
site2.close(); failTg.close(); fs.rmSync(tmp2, { recursive: true, force: true });

server.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exit(bad ? 1 : 0);
