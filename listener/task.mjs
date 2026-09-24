// Installs / removes the Windows scheduled task that starts the listener (hidden) at every login.
//   node listener/task.mjs install     node listener/task.mjs uninstall     node listener/task.mjs print   (just show the task definition)
// No PowerShell scripts are used, so your PowerShell execution policy is not involved and is not changed.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const TASK = "SarkariAlertsListener";
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "..");
const vbs = path.join(here, "start-hidden.vbs");
const user = `${process.env.USERDOMAIN}\\${process.env.USERNAME}`;
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const xml = `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.4" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo><Description>Sarkari Alerts: Telegram "Send to agents" listener</Description></RegistrationInfo>
  <Triggers>
    <LogonTrigger><Enabled>true</Enabled><UserId>${esc(user)}</UserId></LogonTrigger>
  </Triggers>
  <Principals>
    <Principal id="Author"><UserId>${esc(user)}</UserId><LogonType>InteractiveToken</LogonType><RunLevel>LeastPrivilege</RunLevel></Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <StartWhenAvailable>true</StartWhenAvailable>
    <ExecutionTimeLimit>PT0S</ExecutionTimeLimit>
    <RestartOnFailure><Interval>PT1M</Interval><Count>999</Count></RestartOnFailure>
    <Enabled>true</Enabled>
  </Settings>
  <Actions Context="Author">
    <Exec><Command>wscript.exe</Command><Arguments>"${esc(vbs)}"</Arguments><WorkingDirectory>${esc(repo)}</WorkingDirectory></Exec>
  </Actions>
</Task>
`;

const schtasks = (...a) => execFileSync("schtasks", a, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const cmd = process.argv[2];

if (cmd === "print") { console.log(xml); process.exit(0); }

if (cmd === "install") {
  if (!fs.existsSync(path.join(repo, ".env"))) { console.error("There is no .env file in " + repo + " yet. Put TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in it first."); process.exit(1); }
  const file = path.join(os.tmpdir(), `${TASK}.xml`);
  fs.writeFileSync(file, "﻿" + xml, "utf16le");   // Task Scheduler wants UTF-16 with a BOM
  try {
    schtasks("/Create", "/TN", TASK, "/XML", file, "/F");
    console.log(`Installed: "${TASK}" will start hidden every time you log in.`);
    try { schtasks("/Run", "/TN", TASK); console.log("Started it now as well."); } catch (e) { console.log("Installed, but could not start it now: " + (e.stderr || e.message)); }
    console.log("Check it any time with listener\\check-listener.cmd");
  } catch (e) {
    console.error("Could not create the task: " + (e.stderr || e.message));
    console.error("If it says access is denied, right-click install-listener.cmd and choose 'Run as administrator'.");
    process.exit(1);
  } finally { fs.rmSync(file, { force: true }); }
} else if (cmd === "uninstall") {
  try { schtasks("/End", "/TN", TASK); } catch { /* not running */ }
  try { schtasks("/Delete", "/TN", TASK, "/F"); console.log("Removed the automatic start."); } catch { console.log("The scheduled task was not installed."); }
  // stop a listener that is still running
  try {
    const cfg = JSON.parse(fs.readFileSync(path.join(repo, "config.json"), "utf8"));
    const pidFile = path.join(process.env.INBOX_DIR || cfg.inboxDir, "logs", "listener.pid");
    const pid = Number(fs.readFileSync(pidFile, "utf8"));
    process.kill(pid); console.log(`Stopped the running listener (pid ${pid}).`);
  } catch { /* nothing running */ }
} else {
  console.error("Usage: node listener/task.mjs install | uninstall | print");
  process.exit(1);
}
