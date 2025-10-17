@echo off
setlocal enabledelayedexpansion

echo.
echo ╔═══════════════════════════════════╗
echo ║  Starting Full Stack Application  ║
echo ╚═══════════════════════════════════╝
echo.

REM Lấy IP tự động (tránh IP internal)
REM Allow override via environment variable HOST_IP
if defined HOST_IP (
    set "IP=%HOST_IP%"
) else (
    REM Try to find Wi-Fi or Ethernet adapter explicitly by parsing ipconfig blocks
    set "IP="
    setlocal disabledelayedexpansion
    for /f "usebackq delims=" %%b in (`ipconfig /all`) do (
        set "line=%%b"
        setlocal enabledelayedexpansion
        set "l=!line!"
        rem Check adapter headers
        if /i "!l:~0,22!"=="Wireless LAN adapter Wi-Fi" (
            set "inBlock=wifi"
        ) else if /i "!l:~0,25!"=="Ethernet adapter Ethernet" (
            set "inBlock=eth"
        ) else if "!l!"=="" (
            set "inBlock="
        )

        if defined inBlock (
            rem Look for IPv4 line inside the block
            for /f "tokens=2 delims=:" %%c in ("!l!") do (
                rem token 1 may be '   IPv4 Address. . . . . . . . . . . : 192.168.1.23'
                echo.!l! | findstr /i "IPv4" >nul && (
                    set "temp=%%c"
                    set "temp=!temp: =!"
                    endlocal
                    set "IP=!temp!"
                    goto :found
                )
            )
        )
        endlocal
    )
    endlocal
    rem Fallback: original simple method (first IPv4 found)
    if not defined IP for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr "IPv4"') do (
        set "temp=%%a"
        set "IP=!temp: =!"
    )
)
:found

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
rem Ensure dependencies are installed (react-scripts must be available)
if not exist "FrontEnd\node_modules\.bin\react-scripts" (
    echo react-scripts not found, installing dependencies in FrontEnd...
    if exist "FrontEnd\package-lock.json" (
        pushd FrontEnd
        npm ci
        popd
    ) else (
        pushd FrontEnd
        npm install
        popd
    )
)

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