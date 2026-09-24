@echo off
rem Keeps the Telegram listener running: if it stops or crashes, it is started again after 10 seconds.
rem (Started at login by the scheduled task, hidden, through start-hidden.vbs.)
cd /d "%~dp0.."
:loop
node --env-file=.env src\listener.mjs
set code=%errorlevel%
rem 3 = already running, 1 = setup problem (see the log): do not keep retrying
if "%code%"=="3" exit /b 0
if "%code%"=="1" exit /b 1
ping -n 11 127.0.0.1 >nul
goto loop
