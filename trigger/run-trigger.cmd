@echo off
rem Starts the "Check for new notices" workflow on GitHub. Run by the scheduled task (hidden, through start-hidden.vbs).
cd /d "%~dp0.."
node --env-file=.env trigger\trigger-run.mjs
