// Commits and pushes one state file. Used by the workflow on both Linux and Windows runners.
// Usage: node src/save-state.mjs state/seen-cloud.json [more files...]   (files that do not exist are skipped)
import { execFileSync } from "node:child_process";

import fs from "node:fs";
const files = process.argv.slice(2).filter(f => fs.existsSync(f));
const file = files.join(" ");
if (!files.length) { console.error("Usage: node src/save-state.mjs <state-file>"); process.exit(1); }
const branch = process.env.GITHUB_REF_NAME || "main";
const git = (...a) => execFileSync("git", a, { stdio: "inherit" });
const gitOk = (...a) => { try { git(...a); return true; } catch { return false; } };

git("config", "user.name", "notice-monitor");
git("config", "user.email", "notice-monitor@users.noreply.github.com");
git("add", ...files);
if (gitOk("diff", "--cached", "--quiet")) { console.log("Nothing new to save."); process.exit(0); }
git("commit", "-m", `Update seen notices (${file}) [skip ci]`);

// The other job may have pushed in the meantime: rebase on top of it and retry.
for (let attempt = 1; attempt <= 5; attempt++) {
  if (!gitOk("pull", "--rebase", "origin", branch)) {
    gitOk("rebase", "--abort");
    console.error(`Pull failed (attempt ${attempt}).`);
  } else if (gitOk("push", "origin", `HEAD:${branch}`)) process.exit(0);
  else console.error(`Push failed (attempt ${attempt}); retrying.`);
}
console.error("Could not save state after 5 tries; it will be re-detected next run.");
process.exit(1);
