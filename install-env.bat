@echo off
chcp 65001 >nul 2>&1
setlocal EnableDelayedExpansion

:: ============================================================
::  AI ClassMate 2G3 — Script khởi động tự động
::  Tự động cài Python, Node.js và chạy toàn bộ dự án
:: ============================================================

title AI ClassMate 2G3 — Đang khởi động...

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║          🎓 AI ClassMate 2G3 — Auto Setup               ║
echo  ║   Ứng dụng hỗ trợ công tác chủ nhiệm lớp tiểu học       ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

:: Lấy đường dẫn thư mục chứa file bat này
set "ROOT_DIR=%~dp0"
set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "BACKEND_DIR=%ROOT_DIR%\03_app\backend"
set "FRONTEND_DIR=%ROOT_DIR%\03_app\frontend"

echo  [INFO] Thư mục dự án: %ROOT_DIR%
echo.

:: ============================================================
:: BƯỚC 1: Kiểm tra và cài đặt Python
:: ============================================================
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [1/5] Kiểm tra Python...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [!] Python chưa được cài đặt. Đang tải Python 3.11...
    echo.
    
    :: Tải Python installer
    set "PYTHON_URL=https://www.python.org/ftp/python/3.11.9/python-3.11.9-amd64.exe"
    set "PYTHON_INSTALLER=%TEMP%\python-3.11.9-amd64.exe"
    
    echo  [↓] Đang tải từ: %PYTHON_URL%
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%PYTHON_URL%' -OutFile '%PYTHON_INSTALLER%' -UseBasicParsing}" 
    
    if not exist "%PYTHON_INSTALLER%" (
        echo  [LỖI] Không thể tải Python. Vui lòng tải thủ công tại:
        echo         https://www.python.org/downloads/release/python-3119/
        echo  Sau đó chạy lại file này.
        pause
        exit /b 1
    )
    
    echo  [↑] Đang cài Python 3.11 (tự động, không cần thao tác)...
    "%PYTHON_INSTALLER%" /quiet InstallAllUsers=0 PrependPath=1 Include_pip=1 Include_launcher=1
    
    if %ERRORLEVEL% NEQ 0 (
        echo  [LỖI] Cài Python thất bại. Vui lòng cài thủ công.
        pause
        exit /b 1
    )
    
    :: Reload PATH
    call RefreshEnv.cmd >nul 2>&1
    set "PATH=%LOCALAPPDATA%\Programs\Python\Python311\;%LOCALAPPDATA%\Programs\Python\Python311\Scripts\;%PATH%"
    set "PATH=%APPDATA%\Python\Python311\Scripts\;%PATH%"
    
    :: Thử lại
    python --version >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo  [!] Python đã cài nhưng cần KHỞI ĐỘNG LẠI máy tính.
        echo      Sau khi khởi động lại, hãy chạy lại file này.
        echo.
        echo      Hoặc mở Command Prompt mới và chạy lại.
        pause
        exit /b 1
    )
    
    echo  [✓] Python đã được cài thành công!
) else (
    for /f "tokens=2" %%v in ('python --version 2^>^&1') do set "PY_VER=%%v"
    echo  [✓] Python đã có sẵn: !PY_VER!
)

:: ============================================================
:: BƯỚC 2: Kiểm tra và cài đặt Node.js
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [2/5] Kiểm tra Node.js...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [!] Node.js chưa được cài đặt. Đang tải Node.js 20 LTS...
    echo.
    
    :: Phát hiện kiến trúc
    if "%PROCESSOR_ARCHITECTURE%"=="AMD64" (
        set "NODE_URL=https://nodejs.org/dist/v20.19.0/node-v20.19.0-x64.msi"
        set "NODE_INSTALLER=%TEMP%\node-v20.19.0-x64.msi"
    ) else (
        set "NODE_URL=https://nodejs.org/dist/v20.19.0/node-v20.19.0-x86.msi"
        set "NODE_INSTALLER=%TEMP%\node-v20.19.0-x86.msi"
    )
    
    echo  [↓] Đang tải từ: %NODE_URL%
    powershell -Command "& {[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_INSTALLER%' -UseBasicParsing}"
    
    if not exist "%NODE_INSTALLER%" (
        echo  [LỖI] Không thể tải Node.js. Vui lòng tải thủ công tại:
        echo         https://nodejs.org/en/download/
        echo  Sau đó chạy lại file này.
        pause
        exit /b 1
    )
    
    echo  [↑] Đang cài Node.js 20 LTS (tự động)...
    msiexec /i "%NODE_INSTALLER%" /quiet /norestart
    
    :: Reload PATH
    set "PATH=%ProgramFiles%\nodejs\;%PATH%"
    set "PATH=%APPDATA%\npm\;%PATH%"
    
    :: Chờ cài xong
    timeout /t 5 /nobreak >nul
    
    node --version >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo  [!] Node.js đã cài nhưng cần MỞ LẠI TERMINAL hoặc KHỞI ĐỘNG LẠI máy.
        echo      Sau đó chạy lại file này.
        pause
        exit /b 1
    )
    
    echo  [✓] Node.js đã được cài thành công!
) else (
    for /f %%v in ('node --version 2^>^&1') do set "NODE_VER=%%v"
    echo  [✓] Node.js đã có sẵn: !NODE_VER!
)

:: Kiểm tra npm
npm --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [LỖI] npm không tìm thấy dù Node.js đã cài.
    echo        Thử khởi động lại máy và chạy lại file này.
    pause
    exit /b 1
)
for /f %%v in ('npm --version 2^>^&1') do set "NPM_VER=%%v"
echo  [✓] npm đã có sẵn: !NPM_VER!

:: ============================================================
:: BƯỚC 3: Cài thư viện Python (Backend)
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [3/5] Cài thư viện Python (Backend)...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd /d "%BACKEND_DIR%"

:: Nâng cấp pip trước
python -m pip install --upgrade pip --quiet

:: Cài requirements
echo  [↓] Đang cài: fastapi, uvicorn, sqlalchemy, pydantic, pandas...
python -m pip install -r requirements.txt --quiet

if %ERRORLEVEL% NEQ 0 (
    echo  [LỖI] Cài thư viện Python thất bại!
    echo        Kiểm tra kết nối Internet và thử lại.
    pause
    exit /b 1
)
echo  [✓] Tất cả thư viện Python đã được cài!

:: ============================================================
:: BƯỚC 4: Cài thư viện Node.js (Frontend)
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [4/5] Cài thư viện Node.js (Frontend)...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

cd /d "%FRONTEND_DIR%"

:: Kiểm tra node_modules đã tồn tại chưa
if exist "node_modules\" (
    echo  [✓] node_modules đã tồn tại — bỏ qua bước cài lại.
) else (
    echo  [↓] Đang chạy npm install (next.js, react, tailwind...)
    npm install --legacy-peer-deps
    
    if %ERRORLEVEL% NEQ 0 (
        echo  [LỖI] npm install thất bại!
        echo        Kiểm tra kết nối Internet và thử lại.
        pause
        exit /b 1
    )
    echo  [✓] Tất cả thư viện Node.js đã được cài!
)

:: ============================================================
:: BƯỚC 5: Khởi chạy Backend và Frontend
:: ============================================================
echo.
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  [5/5] Khởi chạy dự án...
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo  Đang mở 2 cửa sổ terminal:
echo    🐍 Backend  → http://localhost:8000
echo    ⚛️  Frontend → http://localhost:3000
echo.

:: Khởi chạy Backend trong cửa sổ mới
start "🐍 Backend — AI ClassMate 2G3 (Port 8000)" cmd /k "cd /d "%BACKEND_DIR%" && echo. && echo  ╔══════════════════════════════════════════╗ && echo  ║  Backend FastAPI - Port 8000             ║ && echo  ║  Swagger UI: http://localhost:8000/docs  ║ && echo  ╚══════════════════════════════════════════╝ && echo. && python run.py"

:: Chờ backend khởi động
echo  [⏳] Chờ Backend khởi động (5 giây)...
timeout /t 5 /nobreak >nul

:: Khởi chạy Frontend trong cửa sổ mới
start "⚛️  Frontend — AI ClassMate 2G3 (Port 3000)" cmd /k "cd /d "%FRONTEND_DIR%" && echo. && echo  ╔══════════════════════════════════════════╗ && echo  ║  Frontend Next.js - Port 3000            ║ && echo  ║  Mở trình duyệt: http://localhost:3000   ║ && echo  ╚══════════════════════════════════════════╝ && echo. && npm run dev"

:: Chờ frontend khởi động
echo  [⏳] Chờ Frontend khởi động (8 giây)...
timeout /t 8 /nobreak >nul

:: Mở trình duyệt
echo  [🌐] Đang mở trình duyệt...
start "" "http://localhost:3000"

:: ============================================================
:: HOÀN TẤT
:: ============================================================
echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║  ✅  AI ClassMate 2G3 đã sẵn sàng!                     ║
echo  ║                                                          ║
echo  ║  🌐 Giao diện:   http://localhost:3000                  ║
echo  ║  🔌 Backend API: http://localhost:8000                  ║
echo  ║  📖 Swagger UI:  http://localhost:8000/docs             ║
echo  ║                                                          ║
echo  ║  Để dừng: Đóng 2 cửa sổ terminal màu đen               ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.
echo  Nhấn phím bất kỳ để đóng cửa sổ này...
pause >nul
