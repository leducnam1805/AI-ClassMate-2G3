@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

:: ============================================================
::  AI ClassMate 2G3 — Khởi Động Bằng Docker (100% Docker & PostgreSQL)
:: ============================================================

title AI ClassMate 2G3 — Docker Manager

echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║       🐳 AI ClassMate 2G3 — Quản Lý Bằng Docker         ║
echo  ║    PostgreSQL 16 Alpine + FastAPI Backend + Next.js     ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.

set "ROOT_DIR=%~dp0"
set "ROOT_DIR=%ROOT_DIR:~0,-1%"

:: Đảm bảo file .env đã có sẵn
if not exist "%ROOT_DIR%\.env" (
    if exist "%ROOT_DIR%\.env.example" (
        copy /y "%ROOT_DIR%\.env.example" "%ROOT_DIR%\.env" >nul
        echo  [✓] Đã khởi tạo cấu hình môi trường .env chuẩn Docker.
    )
)

:: Kiểm tra Docker CLI
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo  ❌ CHƯA CÀI ĐẶT DOCKER TRÊN MÁY TÍNH
    echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    echo  Dự án hiện đã xóa bỏ hoàn toàn SQLite và chạy thuần 100%% Docker.
    echo  Máy tính của bạn cần cài đặt Docker Desktop để khởi chạy.
    echo.
    echo  👉 Tải Docker Desktop miễn phí tại: https://www.docker.com/products/docker-desktop/
    echo.
    echo  Sau khi cài xong, bạn mở Docker Desktop rồi chạy lại file run.bat này nhé!
    echo.
    pause
    exit /b 1
)

:: Kiểm tra Docker Engine Daemon đang chạy
docker info >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo  ⚠️  DOCKER DESKTOP CHƯA ĐƯỢC BẬT
    echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    echo  Đã tìm thấy Docker, nhưng phần mềm Docker Desktop chưa được khởi động.
    echo.
    echo  👉 Vui lòng mở ứng dụng Docker Desktop từ màn hình Windows (chờ biểu tượng cá voi sáng lên)
    echo     sau đó nhấn phím bất kỳ tại đây để tiếp tục...
    echo.
    pause >nul
    docker info >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo  [!] Vẫn chưa thấy Docker khởi động. Vui lòng thử lại sau khi Docker sẵn sàng.
        pause
        exit /b 1
    )
)

echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo  🐳 Đang khởi động 3 dịch vụ qua Docker Compose...
echo     1. classmate-postgres  (PostgreSQL 16 Alpine - Cổng 5432)
echo     2. classmate-backend   (FastAPI Backend     - Cổng 8000)
echo     3. classmate-frontend  (Next.js App         - Cổng 3000)
echo  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

cd /d "%ROOT_DIR%"
docker compose up -d --build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo  [❌ LỖI] Quá trình Docker build/up gặp sự cố.
    echo  Vui lòng kiểm tra lại Docker Desktop.
    pause
    exit /b 1
)

echo.
echo  [⏳] Đang chờ CSDL PostgreSQL và các container ổn định - 5 giây...
timeout /t 5 /nobreak >nul

start "" "http://localhost:3000"

:FINISH_DOCKER
echo.
echo  ╔══════════════════════════════════════════════════════════╗
echo  ║  ✅  AI ClassMate 2G3 (Docker) đã khởi động thành công!  ║
echo  ║                                                          ║
echo  ║  🐘 Database:    PostgreSQL 16 Alpine (Port 5432)        ║
echo  ║  🔌 Backend API: http://localhost:8000                   ║
echo  ║  🌐 Giao diện:   http://localhost:3000                   ║
echo  ║  📖 Swagger UI:  http://localhost:8000/docs              ║
echo  ║                                                          ║
echo  ║  Để dừng: Mở terminal gõ: docker compose down            ║
echo  ╚══════════════════════════════════════════════════════════╝
echo.
echo  Trạng thái các container đang chạy:
docker compose ps
echo.
echo  Nhấn phím bất kỳ để đóng cửa sổ quản lý này...
pause >nul
