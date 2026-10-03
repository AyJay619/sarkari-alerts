// Tests for silent rule skips: the daily digest, the "Skipped by rules" line, and a whole monitor run against a fake site and a FAKE Telegram.
// Run:  node test/skipped.test.mjs
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { digestHtml, digestsDue, istDate, markDigestSent, recordSkips } from "../src/skipped.mjs";
import { fmtIstTime, missedRunNote, slotsBetween } from "../src/schedule.mjs";
import { buildPlan } from "../src/order.mjs";
import { splitMessage } from "../src/telegram.mjs";
process.env.SARKARI_LEGACY_ALERTS = "1";   // these tests cover the old alert pipeline (config.json now defaults to catch-only)

let n = 0, bad = 0;
const check = (name, ok, extra = "") => { n++; if (!ok) bad++; console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`); };

// ---- the "Skipped by rules" line in the run summary ----
const alert = { level: "central", category: "Job", html: "x" };
const summary = c => buildPlan([alert], c)[0].html;
check("summary shows 🙈 Skipped by rules: N", summary(3).includes("🙈 Skipped by rules: 3"));
check("summary shows 0 when nothing was skipped", summary(0).includes("🙈 Skipped by rules: 0"));
check("no count given (old callers): no line", !summary(undefined).includes("Skipped"));
check("nothing new: still nothing sent", buildPlan([], 5).length === 0);

// ---- the daily digest: clocks are Indian time (UTC+5:30); 21:00 IST = 15:30 UTC (the 9:30 pm run is the last of the day) ----
const at = iso => Date.parse(iso);
const item = (i, o = {}) => ({ source: "BEL Careers", title: `Re-employment of retired officers ${i}`, rule: "Retired personnel only", link: `https://bel.example/${i}.pdf`, by: "title", ...o });
{ const st = {};
  recordSkips(st, [item(1), item(2, { rule: "Tender", by: "AI", source: "SAIL" })], at("2026-09-29T05:00:00Z"));   // 10:30 IST on 29 Sep
  check("skips are remembered per Indian day", st.skippedDays.length === 1 && st.skippedDays[0].date === "2026-09-29" && st.skippedDays[0].items.length === 2);
  check("no digest at the earlier runs (9:30 am, 12:30 pm, 3:30 pm, 6:30 pm)", ["2026-09-29T04:00:00Z", "2026-09-29T07:00:00Z", "2026-09-29T10:00:00Z", "2026-09-29T13:00:00Z", "2026-09-29T15:29:00Z"].every(t => digestsDue(st, at(t)).length === 0));   // the last: 20:59 IST
  const due = digestsDue(st, at("2026-09-29T15:55:00Z"));   // 21:25 IST: the last scheduled run of the day
  check("with the last run of the day (from 9:00 pm IST) the digest is due, with both items", due.length === 1 && due[0].items.length === 2 && due[0].date === "2026-09-29");
  const html = digestHtml(due[0]);
  check("digest lists source, title, rule and link for each item", html.includes("BEL Careers") && html.includes("Re-employment of retired officers 1") && html.includes("Retired personnel only") && html.includes("https://bel.example/1.pdf") && html.includes("SAIL") && html.includes("Tender"), "\n" + html.slice(0, 500));
  check("digest header shows the date and the count", /Skipped by rules — 29 Sep 2026: 2/.test(html));
  markDigestSent(due[0]);
  check("after sending, no second digest the same evening", digestsDue(st, at("2026-09-29T16:00:00Z")).length === 0);
  recordSkips(st, [item(3)], at("2026-09-29T16:10:00Z"));   // a later run the same evening skips one more
  const more = digestsDue(st, at("2026-09-29T16:30:00Z"));
  check("something skipped later that evening goes out as a short extra digest (only the new one)", more.length === 1 && more[0].items.length === 1 && more[0].items[0].title.endsWith("3")); }
{ const st = {};   // the PC was off in the evening: the digest goes out at the first run of the next day
  recordSkips(st, [item(1)], at("2026-09-29T09:00:00Z"));
  check("PC was off at the last run: the past day's digest is due at the first run of the next day", digestsDue(st, at("2026-09-29T20:00:00Z")).length === 0 ? false : true);   // 01:30 IST on 30 Sep
  check("...and it still says 29 Sep", digestsDue(st, at("2026-09-29T20:00:00Z"))[0].date === "2026-09-29"); }
{ const st = {}; recordSkips(st, [], at("2026-09-29T09:00:00Z"));
  check("nothing skipped: no digest at all", digestsDue(st, at("2026-09-29T16:00:00Z")).length === 0 && (st.skippedDays ?? []).length === 0); }
{ const st = {}; recordSkips(st, Array.from({ length: 120 }, (_, i) => item(i)), at("2026-09-29T09:00:00Z"));
  const html = digestHtml(digestsDue(st, at("2026-09-29T16:00:00Z"))[0]);
  const parts = splitMessage(html);
  check("a long digest is split into several messages under the limit", parts.length > 1 && parts.every(p => p.length <= 4096), `${html.length} chars -> ${parts.length} parts`);
  check("HTML in a title is escaped in the digest", digestHtml({ date: "2026-09-29", items: [item(1, { title: "Tender <b>&</b> more" })] }).includes("Tender &lt;b&gt;&amp;&lt;/b&gt; more")); }
{ const st = {}; recordSkips(st, [item(1)], at("2026-09-01T09:00:00Z")); markDigestSent(digestsDue(st, at("2026-09-02T09:00:00Z"))[0]);
  recordSkips(st, [], at("2026-09-29T09:00:00Z"));
  check("old, already sent days are forgotten", st.skippedDays.length === 0); }
check("istDate: 30 Sep 00:30 IST is still 29 Sep 19:00 UTC", istDate(at("2026-09-29T19:00:00Z")) === "2026-09-30");

// ---- the workflow schedule: 5 runs a day, 5 minutes before 9:30, 12:30, 3:30, 6:30, 9:30 IST (UTC = IST - 5:30) ----
{ const yml = fs.readFileSync(new URL("../.github/workflows/monitor.yml", import.meta.url), "utf8");
  // (the schedule may be PAUSED on purpose: the lines are then commented out; the one entry must still be the right one)
  const crons = [...yml.matchAll(/^\s*(?:#\s*)?- cron: "([^"]+)"/gm)].map(m => m[1]);
  check("monitor.yml has ONE cron entry (active or paused): 55 3,6,9,12,15 * * * (no every-30-minutes)", crons.length === 1 && crons[0] === "55 3,6,9,12,15 * * *" && !yml.includes("*/30"), crons.join(" | "));
  const [min, hours] = crons[0].split(" "); const ist = hours.split(",").map(h => { const m = (+h * 60 + +min + 330) % 1440; return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`; }).join(" ");
  check("...in IST that is 9:25 12:25 15:25 18:25 21:25 (5 minutes before 9:30 am, 12:30 pm, 3:30 pm, 6:30 pm, 9:30 pm)", ist === "9:25 12:25 15:25 18:25 21:25", ist);
  check("...the manual Run workflow button is still there", /workflow_dispatch:/.test(yml));
  check("...runs still collapse: one concurrency group, waiting runs replaced (cancel-in-progress false)", /group: notice-monitor-india/.test(yml) && /cancel-in-progress: false/.test(yml));
  const dry = fs.readFileSync(new URL("../.github/workflows/ai-dry-run.yml", import.meta.url), "utf8");
  check("the AI dry run has its OWN group, so a waiting dry run can never replace a waiting real check", /group: ai-dry-run/.test(dry) && !/notice-monitor-india/.test(dry.replace(/#.*$/gm, ""))); }

// ---- the missed-run warning ----
const T = iso => Date.parse(iso);
check("scheduled times: 5 a day at :25 IST (03:55, 06:55, 09:55, 12:55, 15:55 UTC)", slotsBetween(T("2026-09-29T00:00:00Z"), T("2026-09-30T00:00:00Z")).map(t => new Date(t).toISOString().slice(11, 16)).join() === "03:55,06:55,09:55,12:55,15:55");
check("a slot only counts once 45 minutes have passed since it", slotsBetween(T("2026-09-29T00:00:00Z"), T("2026-09-29T04:30:00Z")).length === 0 && slotsBetween(T("2026-09-29T00:00:00Z"), T("2026-09-29T04:41:00Z")).length === 1);
const st0 = { lastRunAt: "2026-09-29T04:00:00Z" };   // last scan 9:30 am IST
check("normal spacing: the 12:30 pm run (3 h later): no warning", missedRunNote(st0, T("2026-09-29T07:00:00Z")) === null);
check("a delay of a bit over 3 h (GitHub late, PC slow): still no warning", missedRunNote(st0, T("2026-09-29T07:55:00Z")) === null);
const missed = missedRunNote(st0, T("2026-09-29T10:00:00Z"));   // the 12:30 run was missed: this is the 3:30 pm run
check("a missed run: more than 4 h since the last scan -> the note, with the exact wording", missed === "⚠️ Last scan was at 9:30 am — a scheduled run may have been missed. Use Run workflow if needed.", String(missed));
check("the first run next morning after a normal night: no warning", missedRunNote({ lastRunAt: "2026-09-29T16:05:00Z" }, T("2026-09-30T04:00:00Z")) === null);
check("the 9:30 am run was missed (last scan 9:35 pm yesterday): the 12:30 pm run warns", missedRunNote({ lastRunAt: "2026-09-29T16:05:00Z" }, T("2026-09-30T07:00:00Z")) === "⚠️ Last scan was at 9:35 pm on 29 Sep — a scheduled run may have been missed. Use Run workflow if needed.");
check("the PC slept from 9:35 am until 2:06 pm (queued runs collapsed into one): the 2:06 pm run warns", missedRunNote({ lastRunAt: "2026-09-29T04:05:00Z" }, T("2026-09-29T08:36:00Z")) !== null);
check("no warning outside 9 am - 10 pm IST (a run at 11 pm)", missedRunNote(st0, T("2026-09-29T17:30:00Z")) === null && missedRunNote(st0, T("2026-09-29T03:00:00Z")) === null);
check("no last run recorded yet: no warning", missedRunNote({}, T("2026-09-29T10:00:00Z")) === null);
check("the time is written in Indian time, with the day when it was not today", fmtIstTime(T("2026-09-29T09:55:00Z"), T("2026-09-29T15:00:00Z")) === "3:25 pm" && fmtIstTime(T("2026-09-27T16:00:00Z"), T("2026-09-29T15:00:00Z")) === "9:30 pm on 27 Sep" && fmtIstTime(T("2026-09-29T06:30:00Z"), T("2026-09-29T15:00:00Z")) === "12:00 pm");

// ---- a whole monitor run: fake site + FAKE Telegram ----
const sent = [];
const tg = http.createServer((q, r) => { let b = ""; q.on("data", c => (b += c)); q.on("end", () => { const d = b ? JSON.parse(b) : {}; if (d.text) sent.push(d); r.setHeader("content-type", "application/json"); r.end(JSON.stringify({ ok: true, result: true })); }); }).listen(8823);
let page = [["/old.pdf", "Recruitment of Clerk 2025 (old notice, already known)"]];
const site = http.createServer((q, r) => { r.setHeader("content-type", "text/html"); r.end("<ul>" + page.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("") + "</ul>"); }).listen(8822);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "skip-test-"));
fs.writeFileSync(path.join(tmp, "sources.json"), JSON.stringify([{ id: "t", name: "Test site", runner: "india", level: "central", type: "html", url: "http://127.0.0.1:8822/", selector: "li a", minTitle: 10 }]));
const stateFile = path.join(tmp, "state.json");
const run = async nowIso => {
  const child = spawn(process.execPath, ["src/monitor.mjs", "--sources", path.join(tmp, "sources.json"), "--state", stateFile], { cwd: new URL("..", import.meta.url), env: { ...process.env, TELEGRAM_BOT_TOKEN: "123:T", TELEGRAM_CHAT_ID: "1", TELEGRAM_API_BASE: "http://127.0.0.1:8823", ANTHROPIC_API_KEY: "", TEST_NOW_ISO: nowIso } });
  let out = ""; child.stdout.on("data", d => (out += d)); child.stderr.on("data", d => (out += d));
  const code = await new Promise(r => child.on("close", r)); return { code, out };
};
const texts = () => sent.map(m => m.text);

const r1 = await run("2026-09-29T05:00:00Z");   // 10:30 IST: first run, silent baseline
check("first run: baseline, exit 0", r1.code === 0);
check("the first run of the day sends the morning status message; there is no missed-run note on the very first run", texts().some(t => t.includes("Morning check done")) && !texts().some(t => t.includes("may have been missed")));
page = [
  ["/junior.pdf", "Recruitment of Junior Engineer 2026 (Advt 09/2026)"],
  ["/retired.pdf", "Re-employment of retired officers on contract basis"],
  ["/ex.pdf", "Recruitment of Ex-Servicemen on contract basis"],
  ["/quota.pdf", "Recruitment of Constables 2026 (10% vacancies reserved for ex-servicemen)"],
  ["/form.pdf", "Download Application Form for Clerk"],
  ["/tender.pdf", "Tender for supply of chairs"],
  ["/old.pdf", "Recruitment of Clerk 2025 (old notice, already known)"],
];
sent.length = 0;
const r2 = await run("2026-09-29T05:30:00Z");   // 11:00 IST: 6 new, 3 skipped by rules, 1 form
check("run at 11:00 IST: exit 0", r2.code === 0, r2.out.slice(-300));
const alertMsgs = sent.filter(m => m.reply_markup);
check("only the two real notices are alerted (Junior Engineer + the ex-servicemen QUOTA one)", alertMsgs.length === 2 && alertMsgs.some(m => m.text.includes("Junior Engineer")) && alertMsgs.some(m => m.text.includes("reserved for ex-servicemen")), alertMsgs.map(m => m.text.split("\n")[2]).join(" | "));
check("no alert for the retired / ex-servicemen-only / tender / form notices", !alertMsgs.some(m => /retired|Ex-Servicemen on contract|Tender|Application Form/i.test(m.text)));
check("the run summary says 🙈 Skipped by rules: 3", texts().some(t => t.includes("New this run: 2") && t.includes("🙈 Skipped by rules: 3")), texts()[0]);
check("no digest yet at 11:00 IST, no second morning message, no missed-run note (30 min after the last scan)", !texts().some(t => t.includes("Skipped by rules —")) && !texts().some(t => t.includes("Morning check")) && !texts().some(t => t.includes("may have been missed")));
check("the skips are logged to the run output", /title-skip.*retired/i.test(r2.out) && /title-skip.*Ex-Servicemen/i.test(r2.out) && /title-skip.*Tender/i.test(r2.out) && /not-relevant.*Application Form/i.test(r2.out), r2.out.slice(-600));
const st2 = JSON.parse(fs.readFileSync(stateFile, "utf8"));
check("the state remembers 3 skipped notices for the digest (the form is not one of them)", st2.skippedDays?.[0]?.items?.length === 3 && !st2.skippedDays[0].items.some(i => /Application Form/.test(i.title)));

sent.length = 0;
const r3 = await run("2026-09-29T16:00:00Z");   // 21:30 IST: the last run of the day: the digest is due
const digest = sent.find(m => m.text.includes("Skipped by rules —"));
check("at 21:30 IST (the last run) ONE digest is sent, listing source, title, rule and link of the 3 skips", !!digest && sent.filter(m => m.text.includes("Skipped by rules —")).length === 1 && ["Test site", "Re-employment of retired officers", "Recruitment of Ex-Servicemen on contract basis", "Tender for supply of chairs", "Retired personnel only", "Ex-servicemen only", "Tender", "http://127.0.0.1:8822/retired.pdf"].every(x => digest.text.includes(x)), digest?.text?.slice(0, 700));
check("the digest has no 'Send to agents' button", !digest?.reply_markup);
check("the 21:30 run also warns: the last scan was at 11:00 am, 10.5 h earlier inside the day", sent.some(m => m.text === "⚠️ Last scan was at 11:00 am — a scheduled run may have been missed. Use Run workflow if needed."), sent.map(m => m.text.slice(0, 60)).join(" | "));
sent.length = 0;
const r4 = await run("2026-09-29T16:20:00Z");   // 21:50 IST: nothing new, nothing more
check("a later run the same evening sends nothing (digest not repeated, nothing new, no missed-run note)", sent.length === 0, texts().join(" || ").slice(0, 300));

site.close(); tg.close(); fs.rmSync(tmp, { recursive: true, force: true });
console.log(`\n${n - bad}/${n} checks passed`);
process.exit(bad ? 1 : 0);
