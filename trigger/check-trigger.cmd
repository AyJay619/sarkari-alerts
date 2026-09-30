@echo off
rem Double-click to see whether the scheduled task is installed, when it runs next, and what the last runs said.
cd /d "%~dp0.."
node trigger\task.mjs status
echo.
pause
