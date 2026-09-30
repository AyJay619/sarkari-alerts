@echo off
rem Double-click me ONCE. Makes the private token file (outside the project) and opens it in Notepad for you to paste your token.
cd /d "%~dp0.."
node trigger\token.mjs setup
echo.
pause
