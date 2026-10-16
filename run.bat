@echo off
chcp 65001 >nul 2>&1
setlocal

:: ============================================================
::  AI ClassMate 2G3 — Khởi động tự động một chạm (Windows)
::  Tự động tải & cài đặt Python, Node.js và chạy toàn bộ dự án
:: ============================================================

title AI ClassMate 2G3 — Đang khởi động...

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║          🎓 AI ClassMate 2G3 — Auto Setup               ║
echo  ║   Ứng dụng hỗ trợ công tác chủ nhiệm lớp tiểu học       ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

set "ROOT_DIR=%~dp0"
set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "BACKEND_DIR=%ROOT_DIR%\03_app\backend"
set "FRONTEND_DIR=%ROOT_DIR%\03_app\frontend"

echo  [INFO] Thư mục dự án: %ROOT_DIR%
echo.

:: ============================================================
:: BƯỚC 1: Kiểm tra Python
:: ============================================================
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [1/5] Kiểm tra Python...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 goto PYTHON_READY

echo  [!] Python chưa được cài đặt. Đang tải Python 3.11...
echo.

set "PYTHON_URL=https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe"
set "PYTHON_INSTALLER=%TEMP%\python-3.11.9-amd64.exe"

echo  [↓] Đang tải từ: %PYTHON_URL%
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%PYTHON_URL%', '%PYTHON_INSTALLER%')"

if not exist "%PYTHON_INSTALLER%" (
    echo  [LỖI] Không thể tải Python. Vui lòng tải thủ công tại:
    echo         https://www.python.org/downloads/release/python-3119/
    echo  Sau đó chạy lại file này.
    pause
    exit /b 1
)

echo  [↑] Đang cài Python 3.11 (tự động, vui lòng chờ trong giây lát)...
"%PYTHON_INSTALLER%" /quiet InstallAllUsers=0 PrependPath=1 Include_pip=1 Include_launcher=1

set "PATH=%LOCALAPPDATA%\Programs\Python\Python311\;%LOCALAPPDATA%\Programs\Python\Python311\Scripts\;%PATH%"
set "PATH=%APPDATA%\Python\Python311\Scripts\;%PATH%"

python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [!] Python đã cài xong nhưng Command Prompt hiện tại chưa nhận diện được PATH.
    echo      Vui lòng mở lại Command Prompt mới hoặc nhấp đúp lại file install-env.bat này.
    pause
    exit /b 1
)

:PYTHON_READY
for /f "tokens=2" %%v in ('python --version 2^>^&1') do set "PY_VER=%%v"
echo  [✓] Python đã sẵn sàng: %PY_VER%

:: ============================================================
:: BƯỚC 2: Kiểm tra Node.js & npm
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [2/5] Kiểm tra Node.js ^& npm...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 goto NODE_READY

echo  [!] Node.js chưa được cài đặt. Đang tải Node.js 20 LTS...
echo.

if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
    set "NODE_URL=https://nodejs.org/dist/v20.19.0/node-v20.19.0-x64.msi"
    set "NODE_INSTALLER=%TEMP%\node-v20.19.0-x64.msi"
) else (
    set "NODE_URL=https://nodejs.org/dist/v20.19.0/node-v20.19.0-x86.msi"
    set "NODE_INSTALLER=%TEMP%\node-v20.19.0-x86.msi"
)

echo  [↓] Đang tải từ: %NODE_URL%
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%NODE_URL%', '%NODE_INSTALLER%')"

if not exist "%NODE_INSTALLER%" (
    echo  [LỖI] Không thể tải Node.js. Vui lòng tải thủ công tại:
    echo         https://nodejs.org/en/download/
    echo  Sau đó chạy lại file này.
    pause
    exit /b 1
)

echo  [↑] Đang cài Node.js 20 LTS (tự động)...
msiexec /i "%NODE_INSTALLER%" /quiet /norestart

set "PATH=%ProgramFiles%\nodejs\;%PATH%"
set "PATH=%APPDATA%\npm\;%PATH%"

timeout /t 5 /nobreak >nul

node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [!] Node.js đã cài xong. Vui lòng mở lại Command Prompt và chạy lại file này.
    pause
    exit /b 1
)

:NODE_READY
for /f %%v in ('node --version 2^>^&1') do set "NODE_VER=%%v"
echo  [✓] Node.js đã sẵn sàng: %NODE_VER%

npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [LỖI] npm không tìm thấy dù Node.js đã cài.
    pause
    exit /b 1
)
for /f %%v in ('npm --version 2^>^&1') do set "NPM_VER=%%v"
echo  [✓] npm đã sẵn sàng: %NPM_VER%

:: ============================================================
:: BƯỚC 3: Cài thư viện Python (Backend)
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [3/5] Cài đặt thư viện Backend (FastAPI, SQLite, SQLAlchemy)...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd /d "%BACKEND_DIR%"
python -m pip install --upgrade pip --quiet
python -m pip install -r requirements.txt --quiet

if %ERRORLEVEL% NEQ 0 (
    echo  [LỖI] Cài thư viện Python thất bại. Vui lòng kiểm tra kết nối mạng.
    pause
    exit /b 1
)
echo  [✓] Đã cài đặt xong thư viện Backend!

:: ============================================================
:: BƯỚC 4: Cài thư viện Node.js (Frontend)
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [4/5] Cài đặt thư viện Frontend (Next.js, React, Tailwind)...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd /d "%FRONTEND_DIR%"

if exist "node_modules\" goto FRONTEND_DEPS_READY

echo  [↓] Đang cài npm packages...
call npm install --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    echo  [LỖI] npm install thất bại. Vui lòng kiểm tra kết nối mạng.
    pause
    exit /b 1
)

:FRONTEND_DEPS_READY
echo  [✓] Đã cài đặt xong thư viện Frontend!

:: ============================================================
:: BƯỚC 5: Khởi chạy song song Backend và Frontend
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [5/5] Khởi chạy hệ thống AI ClassMate 2G3...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo  Đang mở 2 cửa sổ terminal:
echo    🐍 Backend  → http://localhost:8000
echo    ⚛️  Frontend → http://localhost:3000
echo.

start "🐍 Backend — AI ClassMate 2G3" cmd /k "cd /d "%BACKEND_DIR%" && python run.py"

echo  [⏳] Đang chờ Backend khởi động (3 giây)...
timeout /t 3 /nobreak >nul

start "⚛️  Frontend — AI ClassMate 2G3" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

echo  [⏳] Đang chờ Frontend khởi động (6 giây)...
timeout /t 6 /nobreak >nul

start "" "http://localhost:3000"

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║  ✅  AI ClassMate 2G3 đã khởi động thành công!         ║
echo  ║                                                          ║
echo  ║  🌐 Giao diện:   http://localhost:3000                  ║
echo  ║  🔌 Backend API: http://localhost:8000                  ║
echo  ║  📖 Swagger UI:  http://localhost:8000/docs             ║
echo  ║                                                          ║
echo  ║  Để dừng: Đóng 2 cửa sổ terminal vừa xuất hiện          ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.
echo  Nhấn phím bất kỳ để đóng cửa sổ quản lý này...
pause >nul
