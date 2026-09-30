@echo off
rem Double-click me ONCE (after setup-token.cmd). Creates the Windows scheduled task that starts the workflow at 9:30, 12:30, 3:30, 6:30 and 9:30 pm.
cd /d "%~dp0.."
node trigger\task.mjs install
echo.
pause
