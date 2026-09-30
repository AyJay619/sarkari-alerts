@echo off
rem Double-click to remove the PC trigger. GitHub's own timer keeps working.
cd /d "%~dp0.."
node trigger\task.mjs uninstall
echo.
pause
