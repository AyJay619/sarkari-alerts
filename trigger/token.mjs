// Sets up / tests the GitHub token file for the PC trigger.  node trigger/token.mjs setup | check
//  setup: makes the folder and a placeholder file, locks the file so only your Windows account can read it, opens it in Notepad.
//  check: tests the saved token against GitHub (starts nothing).
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawn, spawnSync } from "node:child_process";

const dir = process.env.SARKARI_TRIGGER_DIR || path.join(os.homedir(), ".sarkari-alerts");
const tokenFile = process.env.SARKARI_GITHUB_TOKEN_FILE || path.join(dir, "github-token.txt");
const cmd = process.argv[2];

if (cmd === "setup") {
  fs.mkdirSync(path.dirname(tokenFile), { recursive: true });
  if (!fs.existsSync(tokenFile)) fs.writeFileSync(tokenFile, "PASTE-YOUR-TOKEN-HERE\n");
  try {   // only you (and no inherited group) may read it
    execFileSync("icacls", [tokenFile, "/inheritance:r", "/grant:r", `${process.env.USERNAME}:(R,W)`], { stdio: "ignore" });
    console.log("Locked the file so only your Windows account can open it.");
  } catch { console.log("Could not lock the file's permissions (not fatal). It is in your own user folder."); }
  console.log("\nThe token file is:\n  " + tokenFile + "\nNotepad opens now: delete the words PASTE-YOUR-TOKEN-HERE, paste your token, press Ctrl+S, close Notepad.");
  spawn("notepad.exe", [tokenFile], { detached: true, stdio: "ignore" }).unref();
} else if (cmd === "check") {
  spawnSync(process.execPath, ["--env-file=.env", "trigger/trigger-run.mjs", "--check"], { cwd: path.resolve(import.meta.dirname, ".."), stdio: "inherit" });
} else { console.error("Usage: node trigger/token.mjs setup | check"); process.exit(1); }
