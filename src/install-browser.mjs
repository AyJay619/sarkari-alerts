// Installs (or reinstalls) the pinned Chromium that "render": true sources use. Safe to run again any time.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { browsersPath } from "./fetchers.mjs";

const dir = browsersPath();
const cli = fileURLToPath(new URL("../node_modules/playwright-core/cli.js", import.meta.url));
console.log(`Installing Playwright's pinned Chromium into: ${dir}`);
const r = spawnSync(process.execPath, [cli, "install", "chromium"], { stdio: "inherit", env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: dir } });
process.exit(r.status ?? 1);
