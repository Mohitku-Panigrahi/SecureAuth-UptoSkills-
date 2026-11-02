@echo off
title SecureAuth - MongoDB Data Inspector
cls

echo ================================================================
echo           SECUREAUTH - LIVE MONGODB DATA INSPECTOR
echo ================================================================
echo.

node --input-type=module -e "import('./server/src/models/User.js').then(async () => { try { const res = await fetch('http://localhost:5000/api/admin/database'); const data = await res.json(); console.log(JSON.stringify(data, null, 2)); } catch(e) { console.error('Please make sure the server is running (run start.bat first). Error:', e.message); } });"

echo.
echo ================================================================
pause
