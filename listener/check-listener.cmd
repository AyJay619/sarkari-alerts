@echo off
rem Double-click to see whether the listener is running.
cd /d "%~dp0.."
node src\listener-status.mjs
echo.
pause
