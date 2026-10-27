@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

:: ============================================================
::  AI ClassMate 2G3 — TRÌNH CÀI ĐẶT MÔI TRƯỜNG & DỰ ÁN
::  Dành cho máy mới tinh: Tự tải & cài Python, Node.js, Docker CLI (nếu cần)
::  Cài đặt toàn bộ thư viện Backend (pip) và Frontend (npm)
:: ============================================================

title AI ClassMate 2G3 — Đang cài đặt dự án...

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║       🎓 AI ClassMate 2G3 — SETUP TOÀN DIỆN DỰ ÁN        ║
echo  ║  Cài đặt tự động: Python 3.11, Node.js 20, Thư viện, Env  ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

set "ROOT_DIR=%~dp0"
set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "BACKEND_DIR=%ROOT_DIR%\03_app\backend"
set "FRONTEND_DIR=%ROOT_DIR%\03_app\frontend"

echo  [INFO] Thư mục dự án: %ROOT_DIR%
echo.

:: ============================================================
:: BƯỚC 0: Khởi tạo file cấu hình môi trường .env nếu chưa có
:: ============================================================
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [1/5] Kiểm tra và khởi tạo file cấu hình môi trường (.env)...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if not exist "%ROOT_DIR%\.env" (
    if exist "%ROOT_DIR%\.env.example" (
        copy /y "%ROOT_DIR%\.env.example" "%ROOT_DIR%\.env" >nul
        echo  [✓] Đã tạo file .env từ .env.example thành công!
    ) else (
        echo  [!] Không tìm thấy .env.example, tạo file .env mặc định...
        (
            echo POSTGRES_USER=classmate_user
            echo POSTGRES_PASSWORD=classmate_secret_2026
            echo POSTGRES_DB=classmate_db
            echo POSTGRES_HOST=postgres
            echo POSTGRES_PORT=5432
            echo DATABASE_URL=postgresql://classmate_user:classmate_secret_2026@postgres:5432/classmate_db
            echo SQLITE_DB_PATH=/app/data/classmate.db
            echo NEXT_PUBLIC_API_URL=http://localhost:8000/api
        ) > "%ROOT_DIR%\.env"
        echo  [✓] Đã tạo file .env mặc định!
    )
) else (
    echo  [✓] File .env đã tồn tại sẵn.
)

:: ============================================================
:: BƯỚC 1: Kiểm tra và cài đặt Docker Desktop (cho máy muốn chạy Docker)
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [2/6] Kiểm tra môi trường Docker Desktop...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

docker --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  [✓] Docker đã có sẵn trên máy!
    goto PYTHON_CHECK
)

echo  [!] Chưa tìm thấy Docker Desktop. Đang tự động cài Docker Desktop qua winget...
winget install -e --id Docker.DockerDesktop --accept-source-agreements --accept-package-agreements --silent
if %ERRORLEVEL% EQU 0 (
    echo  [✓] Đã cài xong Docker Desktop!
) else (
    echo  [INFO] Bỏ qua cài Docker tự động (có thể tải tại https://www.docker.com/products/docker-desktop/)
)

:PYTHON_CHECK
:: Cập nhật PATH hiện tại từ Registry để nhận các phần mềm vừa cài
set "PATH=%LOCALAPPDATA%\Programs\Python\Python311\;%LOCALAPPDATA%\Programs\Python\Python311\Scripts\;%ProgramFiles%\Docker\Docker\resources\bin\;%ProgramFiles%\nodejs\;%APPDATA%\npm\;%PATH%"

:: ============================================================
:: BƯỚC 1: Kiểm tra và cài đặt Python
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [2/5] Kiểm tra môi trường Python 3.11+...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 goto PYTHON_READY

echo  [!] Máy chưa có Python. Đang tự động tải Python 3.11.9 (64-bit)...
set "PYTHON_URL=https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe"
set "PYTHON_INSTALLER=%TEMP%\python-3.11.9-amd64.exe"

echo  [↓] Đang tải từ python.org...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%PYTHON_URL%', '%PYTHON_INSTALLER%')"

if not exist "%PYTHON_INSTALLER%" (
    echo  [LỖI] Không thể tự động tải Python. Vui lòng tải thủ công tại:
    echo        https://www.python.org/downloads/release/python-3119/
    pause
    exit /b 1
)

echo  [↑] Đang cài đặt Python 3.11 tự động (Add to PATH + pip)...
"%PYTHON_INSTALLER%" /quiet InstallAllUsers=0 PrependPath=1 Include_pip=1 Include_launcher=1

set "PATH=%LOCALAPPDATA%\Programs\Python\Python311\;%LOCALAPPDATA%\Programs\Python\Python311\Scripts\;%PATH%"

python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [!] Python đã cài xong nhưng chưa cập nhật phiên PATH hiện tại.
    echo      Đang kiểm tra đường dẫn mặc định...
    if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
        set "PATH=%LOCALAPPDATA%\Programs\Python\Python311\;%LOCALAPPDATA%\Programs\Python\Python311\Scripts\;%PATH%"
    )
)

:PYTHON_READY
for /f "tokens=2" %%v in ('python --version 2^>^&1') do set "PY_VER=%%v"
echo  [✓] Python đã sẵn sàng: %PY_VER%

:: ============================================================
:: BƯỚC 2: Kiểm tra và cài đặt Node.js & npm
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [3/5] Kiểm tra môi trường Node.js 20 LTS & npm...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 goto NODE_READY

echo  [!] Máy chưa có Node.js. Đang tự động tải Node.js 20 LTS...
if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    set "NODE_URL=https://nodejs.org/dist/v20.19.0/node-v20.19.0-x64.msi"
    set "NODE_INSTALLER=%TEMP%\node-v20.19.0-x64.msi"
) else (
    set "NODE_URL=https://nodejs.org/dist/v20.19.0/node-v20.19.0-x86.msi"
    set "NODE_INSTALLER=%TEMP%\node-v20.19.0-x86.msi"
)

echo  [↓] Đang tải từ nodejs.org...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%NODE_URL%', '%NODE_INSTALLER%')"

if not exist "%NODE_INSTALLER%" (
    echo  [LỖI] Không thể tải Node.js. Vui lòng tải thủ công tại: https://nodejs.org/
    pause
    exit /b 1
)

echo  [↑] Đang cài đặt Node.js 20 LTS tự động...
msiexec /i "%NODE_INSTALLER%" /quiet /norestart

set "PATH=%ProgramFiles%\nodejs\;%APPDATA%\npm\;%PATH%"
timeout /t 3 /nobreak >nul

:NODE_READY
for /f %%v in ('node --version 2^>^&1') do set "NODE_VER=%%v"
echo  [✓] Node.js đã sẵn sàng: %NODE_VER%

for /f %%v in ('npm --version 2^>^&1') do set "NPM_VER=%%v"
echo  [✓] npm đã sẵn sàng: %NPM_VER%

:: ============================================================
:: BƯỚC 3: Cài đặt thư viện Backend Python
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [4/5] Cài đặt thư viện Backend (FastAPI, SQLAlchemy, psycopg2...)...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd /d "%BACKEND_DIR%"
echo  [↓] Đang nâng cấp pip và cài đặt requirements.txt...
python -m pip install --upgrade pip --quiet
python -m pip install -r requirements.txt --quiet

if %ERRORLEVEL% NEQ 0 (
    echo  [LỖI] Cài thư viện Python thất bại. Vui lòng kiểm tra lại kết nối mạng.
    pause
    exit /b 1
)
echo  [✓] Đã cài đặt xong toàn bộ thư viện Backend!

:: ============================================================
:: BƯỚC 4: Cài đặt thư viện Frontend Node.js
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [5/5] Cài đặt thư viện Frontend (Next.js, React, Tailwind...)...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd /d "%FRONTEND_DIR%"
echo  [↓] Đang cài npm packages (vui lòng chờ trong giây lát)...
call npm install --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    echo  [LỖI] npm install thất bại. Vui lòng kiểm tra lại kết nối mạng.
    pause
    exit /b 1
)
echo  [✓] Đã cài đặt xong toàn bộ thư viện Frontend!

:: ============================================================
:: BƯỚC 5: Chạy unit test xác thực hệ thống
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [KIỂM TOÁN HỆ THỐNG] Đang chạy kiểm thử tự động...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cd /d "%ROOT_DIR%"
node test_system.js

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║  🎉  CÀI ĐẶT HOÀN TẤT 100%! HỆ THỐNG ĐÃ SẴN SÀNG!        ║
echo  ║                                                          ║
echo  ║  Từ bây giờ, bạn chỉ cần chạy:                           ║
echo  ║     👉  run.bat (Khởi chạy ứng dụng ngay lập tức)        ║
echo  ║                                                          ║
echo  ║  Hoặc nếu máy có Docker:                                 ║
echo  ║     👉  docker compose up --build                        ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.
echo  Nhấn phím bất kỳ để kết thúc cài đặt...
pause >nul
