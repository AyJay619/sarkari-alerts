// Tells you whether the listener is running (double-click listener\check-listener.cmd, or: npm run listener:status).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

try { process.loadEnvFile(new URL("../.env", import.meta.url)); } catch { /* .env is optional here */ }
const config = JSON.parse(fs.readFileSync(new URL("../config.json", import.meta.url), "utf8"));
const inboxDir = path.resolve(process.env.INBOX_DIR || config.inboxDir);
const logDir = path.join(inboxDir, "logs");

let status = "NOT RUNNING", detail = "no heartbeat file yet: it has never started, or the inbox folder is different.";
try {
  const beat = JSON.parse(fs.readFileSync(path.join(logDir, "listener-heartbeat.json"), "utf8"));
  const age = Math.round((Date.now() - Date.parse(beat.time)) / 1000);
  let alive = true;
  try { process.kill(beat.pid, 0); } catch { alive = false; }
  if (alive && age < 90) { status = "RUNNING"; detail = `last check-in ${age}s ago (process ${beat.pid}).`; }
  else detail = `last check-in was ${age}s ago${alive ? "" : " and its process is gone"}.`;
} catch { /* keep default */ }

console.log(`Listener: ${status} — ${detail}`);
try {
  const out = execFileSync("schtasks", ["/Query", "/TN", "SarkariAlertsListener", "/FO", "LIST"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  console.log("Starts at login: YES (" + (out.match(/Status:\s*(.+)/)?.[1]?.trim() ?? "installed") + ")");
} catch { console.log("Starts at login: NO (run listener\\install-listener.cmd once)"); }
console.log(`Inbox: ${path.join(inboxDir, "pending")}`);
try {
  const lines = fs.readFileSync(path.join(logDir, "listener.log"), "utf8").trim().split("\n");
  console.log("\nLast log lines:\n  " + lines.slice(-5).join("\n  "));
} catch { /* no log yet */ }
process.exit(status === "RUNNING" ? 0 : 1);
