@echo off
setlocal enabledelayedexpansion

echo.
echo ╔═══════════════════════════════════╗
echo ║  Starting Full Stack Application  ║
echo ╚═══════════════════════════════════╝
echo.

REM Lấy IP tự động (tránh IP internal)
set "IP="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4" ^| findstr /v "169.254"') do (
    set "temp=%%a"
    set "IP=!temp: =!"
    if not "!IP!"=="127.0.0.1" goto :found
)

:found
if "!IP!"=="" (
    echo ERROR: Could not detect IP address
    pause
    exit /b 1
)

echo Current IP: !IP!
echo Updating environment files...

REM Cập nhật .env.development cho Frontend
echo|set /p="REACT_APP_API_URL=http://!IP!:8080"> FrontEnd\.env.development

REM Cập nhật application.properties (dùng 0.0.0.0 để bind tất cả interface)
findstr /v "server.address" BackEnd\src\main\resources\application.properties > temp.properties
echo server.address=0.0.0.0>> temp.properties
move temp.properties BackEnd\src\main\resources\application.properties

echo.
echo ╔═══════════════════════════╗
echo ║    Starting Backend...    ║
echo ╚═══════════════════════════╝
start cmd /k "cd BackEnd && .\mvnw spring-boot:run"

timeout /t 10

echo.
echo ╔════════════════════════════╗
echo ║    Starting Frontend...    ║
echo ╚════════════════════════════╝
echo.
start cmd /k "cd FrontEnd && npm start -- --host 0.0.0.0"

echo ═════════════════════════════════════════════
echo             Applications Started!
echo ═════════════════════════════════════════════
echo    Frontend: http://!IP!:3000
echo    Backend:  http://!IP!:8080
echo.
echo    📱 Other devices can access via this IP
echo ═════════════════════════════════════════════
pause