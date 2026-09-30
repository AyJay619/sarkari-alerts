@echo off
rem Double-click to start a real run of the workflow right now, the same way the scheduled task does (slot guard on:
rem it will say "SKIPPED" in the Actions log if this time slot was already scanned).
cd /d "%~dp0.."
node --env-file=.env trigger\trigger-run.mjs
echo.
pause
