@echo off
setlocal enabledelayedexpansion
title BharatBazaar E-Commerce Platform Launcher

echo =====================================================================
echo               BHARATBAZAAR E-COMMERCE PLATFORM
echo =====================================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found on your system PATH!
    echo Please install Node.js (version 20, 22, or 24) from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js detected:
node -v
echo.

:: 2. Check if .env exists, if not copy from .env.example
if not exist ".env" (
    echo [INFO] .env file not found. Copying default configuration from .env.example...
    copy ".env.example" ".env" >nul
    echo [OK] .env created.
    echo.
)

:: 3. Check if node_modules exists, if not install dependencies
if not exist "node_modules\" (
    echo [INFO] Installing project dependencies... This may take a minute.
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed.
    echo.
)

:: 4. Generate Prisma Client
echo [INFO] Generating Prisma client...
call npx prisma generate
echo.

:: 5. Menu options
echo Choose an option:
echo   [1] Start Development Server (Default)
echo   [2] Sync Database & Seed Initial Products/Admin
echo   [3] Run Automated Test Suite (Vitest)
echo   [4] Build Production Application
echo.
set /p CHOICE="Enter choice [1-4, default 1]: "

if "%CHOICE%"=="" set CHOICE=1

if "%CHOICE%"=="1" goto START_DEV
if "%CHOICE%"=="2" goto SEED_DB
if "%CHOICE%"=="3" goto RUN_TESTS
if "%CHOICE%"=="4" goto BUILD_PROD

:START_DEV
echo.
echo =====================================================================
echo Starting Next.js Development Server at http://localhost:2525
echo.
echo Default Storefront:  http://localhost:2525
echo Admin Dashboard:     http://localhost:2525/admin
echo Admin Login:         admin@bharatbazaar.in / BharatAdmin@2026
echo Customer Login:      customer@example.in / Customer@2026
echo =====================================================================
echo.

:: Open browser automatically after 3 seconds
start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:2525"

call npm run dev
goto END

:SEED_DB
echo.
echo [INFO] Pushing Prisma schema to PostgreSQL database...
call npx prisma db push
if %errorlevel% neq 0 (
    echo [ERROR] Failed to connect to PostgreSQL on port 5432.
    echo Please make sure your PostgreSQL service is running.
    pause
    exit /b 1
)
echo.
echo [INFO] Seeding authentic Indian products, categories, and admin...
call npm run seed
echo.
echo [SUCCESS] Database synchronized and seeded successfully!
pause
goto END

:RUN_TESTS
echo.
echo [INFO] Running Vitest test suite...
call npm test
echo.
pause
goto END

:BUILD_PROD
echo.
echo [INFO] Creating production build...
call npm run build
echo.
pause
goto END

:END
endlocal
