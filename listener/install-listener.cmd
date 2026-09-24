@echo off
rem Double-click me ONCE. Sets the listener to start hidden every time you log in to Windows, and starts it now.
cd /d "%~dp0.."
node listener\task.mjs install
echo.
pause
