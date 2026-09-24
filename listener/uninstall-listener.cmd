@echo off
rem Double-click to stop the listener and remove its automatic start.
cd /d "%~dp0.."
node listener\task.mjs uninstall
echo.
pause
