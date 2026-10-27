@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

:: ============================================================
::  AI ClassMate 2G3 — Khởi động nhanh một chạm (Windows)
::  Ưu tiên kiểm tra Docker -> Nếu có Docker thì chạy Docker
::  Nếu không có Docker -> Chạy trực tiếp Python + Node.js
:: ============================================================

title AI ClassMate 2G3 — Đang khởi động...

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║          🎓 AI ClassMate 2G3 — Khởi Động Nhanh           ║
echo  ║   Ứng dụng hỗ trợ công tác chủ nhiệm lớp tiểu học        ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

set "ROOT_DIR=%~dp0"
set "ROOT_DIR=%ROOT_DIR:~0,-1%"
set "BACKEND_DIR=%ROOT_DIR%\03_app\backend"
set "FRONTEND_DIR=%ROOT_DIR%\03_app\frontend"

:: Đảm bảo file .env đã có sẵn
if not exist "%ROOT_DIR%\.env" (
    if exist "%ROOT_DIR%\.env.example" (
        copy /y "%ROOT_DIR%\.env.example" "%ROOT_DIR%\.env" >nul
    )
)

:: ============================================================
:: 1. KIỂM TRA XEM MÁY CÓ DOCKER KHÔNG
:: ============================================================
docker info >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo  🐳 Phát hiện máy có Docker đang hoạt động!
    echo  Khởi động bằng Docker: PostgreSQL 16 + Backend + Frontend
    echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    echo  [⏳] Đang khởi chạy các container (vui lòng chờ)...
    cd /d "%ROOT_DIR%"
    docker compose up -d --build
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo  [⏳] Đang chờ hệ thống ổn định (5 giây)...
        timeout /t 5 /nobreak >nul
        start "" "http://localhost:3000"
        goto FINISH_DOCKER
    ) else (
        echo.
        echo  [!] Docker gặp lỗi, chuyển hướng sang chạy trực tiếp không dùng Docker...
        echo.
    )
)

:: ============================================================
:: 2. NẾU KHÔNG CÓ DOCKER: CHẠY TRỰC TIẾP PYTHON + NODE.JS
:: ============================================================
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  💻 Khởi động trực tiếp trên Windows (Python + Node.js)
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

:: Thêm đường dẫn mặc định nếu mới cài đặt
set "PATH=%LOCALAPPDATA%\Programs\Python\Python311\;%LOCALAPPDATA%\Programs\Python\Python311\Scripts\;%ProgramFiles%\nodejs\;%APPDATA%\npm\;%PATH%"

python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [!] Chưa tìm thấy Python. Đang chuyển hướng sang cài đặt dự án...
    call "%ROOT_DIR%\install-env.bat"
    exit /b
)

node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  [!] Chưa tìm thấy Node.js. Đang chuyển hướng sang cài đặt dự án...
    call "%ROOT_DIR%\install-env.bat"
    exit /b
)

if not exist "%FRONTEND_DIR%\node_modules\" (
    echo  [!] Chưa cài thư viện Frontend. Đang chạy cài đặt tự động...
    call "%ROOT_DIR%\install-env.bat"
    exit /b
)

echo    🐍 Backend API  →  http://localhost:8000
echo    ⚛️  Frontend UI  →  http://localhost:3000
echo.

start "🐍 Backend — AI ClassMate 2G3" cmd /k "cd /d "%BACKEND_DIR%" && python run.py"

echo  [⏳] Đang chờ Backend khởi động (3 giây)...
timeout /t 3 /nobreak >nul

start "⚛️  Frontend — AI ClassMate 2G3" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

echo  [⏳] Đang chờ Frontend khởi động (5 giây)...
timeout /t 5 /nobreak >nul

start "" "http://localhost:3000"

:FINISH_DIRECT
echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║  ✅  AI ClassMate 2G3 đã khởi động thành công!          ║
echo  ║                                                          ║
echo  ║  🌐 Giao diện:   http://localhost:3000                   ║
echo  ║  🔌 Backend API: http://localhost:8000                   ║
echo  ║  📖 Swagger UI:  http://localhost:8000/docs              ║
echo  ║                                                          ║
echo  ║  Để dừng: Đóng 2 cửa sổ terminal vừa xuất hiện           ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.
echo  Nhấn phím bất kỳ để đóng cửa sổ quản lý này...
pause >nul
exit /b

:FINISH_DOCKER
echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║  ✅  AI ClassMate 2G3 (Docker) đã khởi động thành công!  ║
echo  ║                                                          ║
echo  ║  🐘 Database:    PostgreSQL 16 (Port 5432)               ║
echo  ║  🔌 Backend API: http://localhost:8000                   ║
echo  ║  🌐 Giao diện:   http://localhost:3000                   ║
echo  ║  📖 Swagger UI:  http://localhost:8000/docs              ║
echo  ║                                                          ║
echo  ║  Để dừng: Mở terminal gõ: docker compose down            ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.
echo  Nhấn phím bất kỳ để đóng cửa sổ quản lý này...
pause >nul
