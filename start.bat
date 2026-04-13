@echo off
echo Cleaning up...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul
if exist .next rmdir /s /q .next
echo Starting dev server...
npm run dev

