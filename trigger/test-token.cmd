@echo off
rem Double-click to test your token against GitHub. It starts NOTHING.
cd /d "%~dp0.."
node --env-file=.env trigger\trigger-run.mjs --check
echo.
pause
