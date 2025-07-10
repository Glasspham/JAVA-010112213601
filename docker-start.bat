@echo off
setlocal enabledelayedexpansion

echo.
echo ╔═══════════════════════════════════╗
echo ║  Starting Full Stack Application  ║
echo ║           with Docker             ║
echo ╚═══════════════════════════════════╝
echo.

REM Lấy IP tự động
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
    set "temp=%%a"
    set "IP=!temp: =!"
    goto :found
)
:found

echo Current IP: !IP!
echo Updating docker configuration...

REM Tạo docker-compose.yml từ template (ở thư mục Docker)
powershell -Command "(Get-Content Docker\docker-compose.template.yml) -replace 'REACT_APP_API_URL: http://localhost:8080', 'REACT_APP_API_URL: http://!IP!:8080' | Out-File -encoding UTF8 docker-compose.yml"

REM Kiểm tra xem có cần build không
echo.
echo ╔═══════════════════════════════╗
echo ║       Choose an option:       ║
echo ║  1. Quick Start - Rebuild FE  ║
echo ║  2. Full Build and Start All  ║
echo ╚═══════════════════════════════╝
echo.
set /p choice="Enter your choice 1 or 2: "

if "%choice%"=="1" (
    echo.
    echo ╔════════════════════════════╗
    echo ║  Starting Docker Services  ║
    echo ║         No Build           ║
    echo ╚════════════════════════════╝
    echo.
    start "Docker Services" cmd /c "docker-compose build frontend && docker-compose up --force-recreate"
) else (
    echo.
    echo ╔════════════════════════════════╗
    echo ║  Building and Starting Docker  ║
    echo ╚════════════════════════════════╝
    echo.
    start "Docker Services" cmd /c "docker-compose up --build"
)

echo.
echo ═════════════════════════════════════════════
echo             Applications Started!
echo ═════════════════════════════════════════════
echo    Frontend: http://!IP!:3000
echo    Backend:  http://!IP!:8080
echo.
echo    📱 Other devices can access via this IP
echo    🐳 Running in Docker containers
echo ═════════════════════════════════════════════
pause