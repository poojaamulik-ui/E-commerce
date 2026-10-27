@echo off
title BharatBazaar Storefront - Dev Server (Port 2525)
echo Starting BharatBazaar at http://localhost:2525 ...
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:2525"
npm run dev
