// Installs / removes the Windows scheduled task that starts the workflow from this PC at 9:30, 12:30, 3:30, 6:30 and 9:30 pm.
//   node trigger/task.mjs install | uninstall | status | print
// One task, five daily triggers, runs hidden as YOU (only when you are logged in). No PowerShell scripts: your execution policy is not involved.
// Settings: wakes the PC from sleep for the run, runs as soon as possible if a time was missed (PC was off), never two copies at once.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const TASK = "SarkariAlertsTrigger";
const TIMES = ["09:30", "12:30", "15:30", "18:30", "21:30"];   // local time on this PC = India time (checked below)
const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "..");
const vbs = path.join(here, "start-hidden.vbs");
const user = `${process.env.USERDOMAIN}\\${process.env.USERNAME}`;
const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
const inIndia = /^Asia\/(Calcutta|Kolkata)$/.test(tz);

export const buildXml = () => `<?xml version="1.0" encoding="UTF-16"?>
<Task version="1.4" xmlns="http://schemas.microsoft.com/windows/2004/02/mit/task">
  <RegistrationInfo><Description>Sarkari Alerts: starts the "Check for new notices" workflow on GitHub at ${TIMES.join(", ")} (India time)</Description></RegistrationInfo>
  <Triggers>
${TIMES.map(t => `    <CalendarTrigger><StartBoundary>2026-01-01T${t}:00</StartBoundary><Enabled>true</Enabled><ScheduleByDay><DaysInterval>1</DaysInterval></ScheduleByDay></CalendarTrigger>`).join("\n")}
  </Triggers>
  <Principals>
    <Principal id="Author"><UserId>${esc(user)}</UserId><LogonType>InteractiveToken</LogonType><RunLevel>LeastPrivilege</RunLevel></Principal>
  </Principals>
  <Settings>
    <MultipleInstancesPolicy>IgnoreNew</MultipleInstancesPolicy>
    <DisallowStartIfOnBatteries>false</DisallowStartIfOnBatteries>
    <StopIfGoingOnBatteries>false</StopIfGoingOnBatteries>
    <StartWhenAvailable>true</StartWhenAvailable>
    <WakeToRun>true</WakeToRun>
    <ExecutionTimeLimit>PT15M</ExecutionTimeLimit>
    <Enabled>true</Enabled>
  </Settings>
  <Actions Context="Author">
    <Exec><Command>wscript.exe</Command><Arguments>"${esc(vbs)}"</Arguments><WorkingDirectory>${esc(repo)}</WorkingDirectory></Exec>
  </Actions>
</Task>
`;

const schtasks = (...a) => execFileSync("schtasks", a, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
const cmd = process.argv[2];

if (process.argv[1]?.endsWith("task.mjs")) {   // (importing this file, e.g. in a test, only gives buildXml)
  if (cmd === "print") console.log(buildXml());
  else if (cmd === "install") {
    if (!inIndia) { console.error(`This PC's time zone is "${tz}", not India. The task times are India times, so set Windows to (UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi first (Settings > Time & language > Date & time).`); process.exit(1); }
    if (!fs.existsSync(path.join(repo, ".env"))) { console.error("There is no .env file in " + repo + " yet (the trigger uses it to warn you on Telegram)."); process.exit(1); }
    const file = path.join(os.tmpdir(), `${TASK}.xml`);
    fs.writeFileSync(file, "﻿" + buildXml(), "utf16le");   // Task Scheduler wants UTF-16 with a BOM
    try {
      schtasks("/Create", "/TN", TASK, "/XML", file, "/F");
      console.log(`Installed: "${TASK}" will start the workflow at ${TIMES.join(", ")} every day.`);
      console.log("Test it right now (starts a real run): trigger\\run-now.cmd    Check it: trigger\\check-trigger.cmd");
    } catch (e) { console.error("Could not create the task: " + (e.stderr || e.message)); process.exit(1); }
    finally { fs.rmSync(file, { force: true }); }
  } else if (cmd === "uninstall") {
    try { schtasks("/Delete", "/TN", TASK, "/F"); console.log("Removed the scheduled task. GitHub's own timer still runs."); } catch { console.log("The scheduled task was not installed."); }
  } else if (cmd === "status") {
    try {
      const out = schtasks("/Query", "/TN", TASK, "/V", "/FO", "LIST");
      for (const l of out.split(/\r?\n/)) if (/^(Status|Next Run Time|Last Run Time|Last Result|Scheduled Task State):/.test(l.trim())) console.log(l.trim());
    } catch { console.log("NOT INSTALLED: run trigger\\install-trigger.cmd"); }
    const log = path.join(process.env.SARKARI_TRIGGER_DIR || path.join(os.homedir(), ".sarkari-alerts"), "trigger.log");
    console.log("\nLast lines of " + log + ":");
    try { console.log(fs.readFileSync(log, "utf8").trim().split("\n").slice(-12).join("\n")); } catch { console.log("(no log yet: the trigger has not run)"); }
  } else { console.error("Usage: node trigger/task.mjs install | uninstall | status | print"); process.exit(1); }
}
