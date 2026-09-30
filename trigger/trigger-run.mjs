// Starts the "Check for new notices" workflow on GitHub (workflow_dispatch API call). Run by Windows Task Scheduler at 9:30, 12:30, 3:30,
// 6:30 and 9:30 pm IST, so a late or skipped GitHub timer does not matter. GitHub's own timer stays as a backup; the time-slot guard
// (src/slot.mjs) makes sure the same slot is never scanned twice.
//   node --env-file=.env trigger/trigger-run.mjs            start the workflow now (what the scheduled task does)
//   node --env-file=.env trigger/trigger-run.mjs --check    only test the token (starts nothing)
// The token is read from a file OUTSIDE the project (default %USERPROFILE%\.sarkari-alerts\github-token.txt), never from the repo.
// The token is never printed or logged. On a final failure you get a Telegram warning (needs TELEGRAM_* in .env).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { makeSender } from "../src/telegram.mjs";

const dir = process.env.SARKARI_TRIGGER_DIR || path.join(os.homedir(), ".sarkari-alerts");
const tokenFile = process.env.SARKARI_GITHUB_TOKEN_FILE || path.join(dir, "github-token.txt");
const logFile = path.join(dir, "trigger.log");
const repo = process.env.SARKARI_REPO || "AyJay619/sarkari-alerts";
const workflow = process.env.SARKARI_WORKFLOW || "monitor.yml";
const api = process.env.GITHUB_API_BASE || "https://api.github.com";
const CHECK = process.argv.includes("--check");
const TRIES = Number(process.env.SARKARI_TRIGGER_TRIES || 8), PAUSE_MS = Number(process.env.SARKARI_TRIGGER_PAUSE_MS || 30000);

export const looksLikeToken = t => /^(github_pat_|ghp_)[A-Za-z0-9_]{20,}$/.test(t);

const say = msg => {
  const line = `${new Date().toISOString()}  ${msg}`;
  console.log(line);
  try {
    fs.mkdirSync(dir, { recursive: true });
    if (fs.existsSync(logFile) && fs.statSync(logFile).size > 200000) fs.writeFileSync(logFile, fs.readFileSync(logFile, "utf8").split("\n").slice(-300).join("\n"));
    fs.appendFileSync(logFile, line + "\n");
  } catch { /* logging must never stop the trigger */ }
};

let token = "";
try { token = fs.readFileSync(tokenFile, "utf8").trim(); } catch { /* handled below */ }
const problem = !token ? `Token file not found or empty: ${tokenFile} (run trigger\\setup-token.cmd)`
  : !looksLikeToken(token) ? `The token file does not contain a GitHub token (it should start with github_pat_): ${tokenFile}`
  : null;

async function warn(text) {
  const t = process.env.TELEGRAM_BOT_TOKEN, c = process.env.TELEGRAM_CHAT_ID;
  if (!t || !c) return;
  try { await makeSender({ token: t, chatId: c, dryRun: false })("⚠️ <b>PC trigger</b>: " + text.replace(/[<>&]/g, "")); } catch { /* best effort */ }
}
async function fail(text) { say("FAILED: " + text); await warn(text); process.exitCode = 1; }

if (problem) await fail(problem);
else {
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "sarkari-alerts-pc-trigger" };
  const url = CHECK ? `${api}/repos/${repo}/actions/workflows/${workflow}` : `${api}/repos/${repo}/actions/workflows/${workflow}/dispatches`;
  const init = CHECK ? { headers } : { method: "POST", headers: { ...headers, "Content-Type": "application/json" }, body: JSON.stringify({ ref: "main", inputs: { slot_guard: "true" } }) };
  let done = false;
  for (let attempt = 1; attempt <= TRIES && !done; attempt++) {
    try {
      const res = await fetch(url, { ...init, signal: AbortSignal.timeout(30000) });
      if (res.status === 204 || (CHECK && res.ok)) { say(CHECK ? "Token OK: it can see the workflow (nothing was started)." : "Started the workflow (slot guard on)."); done = true; }
      else if (res.status === 401 || res.status === 403 || res.status === 404 || res.status === 422) {
        const body = await res.json().catch(() => ({}));
        const hint = res.status === 401 ? "the token is wrong or has expired" : res.status === 404 ? "the token cannot see this repository / workflow (check its repository access and 'Actions: Read and write')" : res.status === 403 ? "the token lacks permission (needs 'Actions: Read and write')" : "GitHub refused the request (is the slot_guard input on the main branch yet?)";
        await fail(`GitHub answered ${res.status}: ${String(body.message ?? "").slice(0, 150)} — ${hint}.`); done = true;
      } else say(`GitHub answered ${res.status} (attempt ${attempt}/${TRIES})` + (attempt < TRIES ? "; trying again..." : ""));
    } catch (e) { say(`No connection to GitHub (attempt ${attempt}/${TRIES}): ${e.message.replaceAll(token, "***")}`); }
    if (!done && attempt < TRIES) await new Promise(r => setTimeout(r, PAUSE_MS));
  }
  if (!done) await fail(`could not reach GitHub after ${TRIES} tries; this time slot was not started from the PC (GitHub's own timer may still run it).`);
}
