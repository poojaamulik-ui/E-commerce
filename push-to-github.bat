@echo off
title Push Nestora to GitHub
echo ========================================================
echo Pushing Nestora E-Commerce to GitHub (origin main)...
echo Repo: https://github.com/poojaamulik-ui/E-commerce.git
echo ========================================================
echo.

cd /d "D:\E-commerce"
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo SUCCESS! Code pushed to GitHub successfully.
    echo You can now deploy on Railway: https://railway.app
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo Push paused or authentication needed.
    echo If prompted above, please sign in with GitHub or use
    echo your Personal Access Token (PAT).
    echo Or open GitHub Desktop and click 'Push origin'.
    echo ========================================================
)

echo.
pause
