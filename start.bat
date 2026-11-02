@echo off
title SecureAuth Identity Platform - UpToSkills
cls

echo ================================================================
echo    SECUREAUTH - FULL-STACK IDENTITY ^& PROFILE MANAGEMENT
echo                  UpToSkills Internship Project
echo ================================================================
echo.

:: 1. Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: 2. Verify dependencies
echo [1/3] Checking dependencies...
if not exist "node_modules\" (
    echo [*] Installing root dependencies...
    call npm install
)

if not exist "server\node_modules\" (
    echo [*] Installing server dependencies...
    call npm --prefix server install
)

if not exist "client\node_modules\" (
    echo [*] Installing client dependencies...
    call npm --prefix client install
)

echo [2/3] Dependencies verified.
echo.
echo [3/3] Launching SecureAuth Full-Stack Platform...
echo.
echo ================================================================
echo   Backend API   : http://localhost:5000
echo   Health Check  : http://localhost:5000/api/health
echo   Frontend App  : http://localhost:5173
echo ================================================================
echo.
echo Opening browser to http://localhost:5173...
start http://localhost:5173 2>nul
echo.
echo Press Ctrl+C at any time to stop both servers.
echo.

:: Start full-stack platform using concurrently
npm run dev
