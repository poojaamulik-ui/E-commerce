@echo off
echo ==========================================
echo Pushing Nestora E-Commerce 404 Fix to GitHub...
echo ==========================================
cd /d "D:\E-commerce"
git status
echo.
echo Pushing commit to origin/main...
git push origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Pushed successfully to GitHub! Railway will now deploy the fix.
) else (
    echo [NOTICE] If prompted, please authenticate or use GitHub Desktop to push.
)
pause
