// Tests for the time-slot guard (same slot never scanned twice). Run:  node test/slot.test.mjs
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { slotOf, slotAlreadyDone } from "../src/slot.mjs";

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };
const ist = s => Date.parse(s + "+05:30");   // an Indian wall-clock time

// which slot a run belongs to
check("GitHub's 9:25 timer and the PC's 9:30 trigger are the same slot", slotOf(ist("2026-09-30T09:25:00")) === "2026-09-30 09:30" && slotOf(ist("2026-09-30T09:30:00")) === "2026-09-30 09:30");
check("a run that starts late (10:40) still belongs to the 9:30 slot", slotOf(ist("2026-09-30T10:40:00")) === "2026-09-30 09:30");
check("12:15 already counts as the 12:30 slot, 12:14 is still 9:30", slotOf(ist("2026-09-30T12:15:00")) === "2026-09-30 12:30" && slotOf(ist("2026-09-30T12:14:00")) === "2026-09-30 09:30");
check("all five slots", ["09:25", "12:25", "15:25", "18:25", "21:25"].map(t => slotOf(ist("2026-09-30T" + t + ":00")).slice(11)).join() === "09:30,12:30,15:30,18:30,21:30");
check("late evening stays in the 9:30 pm slot", slotOf(ist("2026-09-30T23:59:00")) === "2026-09-30 21:30");
check("after midnight, before 9:15 am: the previous day's 9:30 pm slot", slotOf(ist("2026-10-01T01:00:00")) === "2026-09-30 21:30" && slotOf(ist("2026-10-01T09:14:00")) === "2026-09-30 21:30");
check("the same instant in UTC gives the same slot (03:55 UTC = 9:25 IST)", slotOf(Date.parse("2026-09-30T03:55:00Z")) === "2026-09-30 09:30");

// the decision
const state = { lastSlot: "2026-09-30 09:30" };
check("guard on + same slot: skip", slotAlreadyDone(state, ist("2026-09-30T09:31:00"), true) === true);
check("guard on + next slot: run", slotAlreadyDone(state, ist("2026-09-30T12:25:00"), true) === false);
check("guard on + yesterday's same slot time: run", slotAlreadyDone(state, ist("2026-10-01T09:30:00"), true) === false);
check("guard OFF (the manual button): always runs", slotAlreadyDone(state, ist("2026-09-30T09:31:00"), false) === false);
check("no lastSlot yet (first ever run): runs", slotAlreadyDone({}, ist("2026-09-30T09:31:00"), true) === false);

// the real monitor
let hits = 0;
const site = http.createServer((q, r) => { hits++; r.setHeader("content-type", "text/html"); r.end('<ul><li><a href="/a.pdf">Notice about the engagement of apprentices</a></li></ul>'); }).listen(8819);
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "slot-"));
const sourcesFile = path.join(dir, "sources.json"), stateFile = path.join(dir, "state.json");
fs.writeFileSync(sourcesFile, JSON.stringify([{ id: "t", name: "Test site", runner: "india", level: "central", type: "html", url: "http://127.0.0.1:8819/", selector: "li a", minTitle: 10 }]));
const seen = { "notice about the engagement of apprentices|http://127.0.0.1:8819/a.pdf": "2026-01-01T00:00:00Z" };
const writeState = lastSlot => fs.writeFileSync(stateFile, JSON.stringify({ sources: { t: { initialized: true, seen, fails: 0, warned: false } }, ...(lastSlot ? { lastSlot } : {}) }));
const run = (guard, nowIst) => new Promise(res => execFile(process.execPath, ["src/monitor.mjs", "--dry-run", "--sources", sourcesFile, "--state", stateFile],
  { encoding: "utf8", cwd: new URL("..", import.meta.url), env: { ...process.env, SLOT_GUARD: guard, TEST_NOW_ISO: new Date(ist(nowIst)).toISOString(), ANTHROPIC_API_KEY: "", TELEGRAM_BOT_TOKEN: "", TELEGRAM_CHAT_ID: "" } },
  (err, stdout) => res({ code: err?.code ?? 0, stdout })));
await new Promise(r => setTimeout(r, 200));

writeState("2026-09-30 09:30"); hits = 0;
let r = await run("true", "2026-09-30T09:32:00");
check("monitor: the slot was already scanned -> SKIPPED at once, exit 0, no website was contacted", r.code === 0 && /SKIPPED: the 2026-09-30 09:30/.test(r.stdout) && hits === 0, r.stdout.slice(0, 160));
check("monitor: the state file is left as it was", JSON.parse(fs.readFileSync(stateFile, "utf8")).lastSlot === "2026-09-30 09:30" && !JSON.parse(fs.readFileSync(stateFile, "utf8")).lastRunAt);

hits = 0; r = await run("false", "2026-09-30T09:32:00");
check("monitor: the manual button (guard off) runs even in an already-scanned slot", r.code === 0 && !/SKIPPED/.test(r.stdout) && hits >= 1, r.stdout.slice(0, 120));

writeState("2026-09-30 09:30"); hits = 0; r = await run("true", "2026-09-30T12:26:00");
const after = JSON.parse(fs.readFileSync(stateFile, "utf8"));
check("monitor: the next slot (12:30) runs and remembers its slot", hits >= 1 && after.lastSlot === "2026-09-30 12:30", `lastSlot ${after.lastSlot}`);

hits = 0; r = await run("true", "2026-09-30T12:31:00");
check("monitor: then the PC trigger at 12:30 for the same slot is skipped", /SKIPPED: the 2026-09-30 12:30/.test(r.stdout) && hits === 0);

fs.rmSync(dir, { recursive: true, force: true });
site.closeAllConnections(); site.close();
console.log(`\n${n - bad}/${n} checks passed`);
process.exitCode = bad ? 1 : 0;
