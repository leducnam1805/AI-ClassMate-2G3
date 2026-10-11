#!/bin/bash

# ============================================================
#  AI ClassMate 2G3 — Script khởi động tự động (macOS/Linux)
#  Tự động cài Python, Node.js và chạy toàn bộ dự án
# ============================================================

# Màu sắc terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Lấy đường dẫn thư mục chứa script này
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/03_app/backend"
FRONTEND_DIR="$ROOT_DIR/03_app/frontend"

echo ""
echo -e "${CYAN}${BOLD} ╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}${BOLD} ║          🎓 AI ClassMate 2G3 — Auto Setup               ║${NC}"
echo -e "${CYAN}${BOLD} ║   Ứng dụng hỗ trợ công tác chủ nhiệm lớp tiểu học       ║${NC}"
echo -e "${CYAN}${BOLD} ╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE} [INFO] Thư mục dự án: $ROOT_DIR${NC}"
echo ""

# ============================================================
# BƯỚC 1: Kiểm tra và cài đặt Homebrew (chỉ macOS)
# ============================================================
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${BOLD} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD} [1/5] Kiểm tra Homebrew (macOS package manager)...${NC}"
    echo -e "${BOLD} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    if ! command -v brew &>/dev/null; then
        echo -e "${YELLOW} [!] Homebrew chưa cài. Đang cài Homebrew...${NC}"
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        
        # Thêm Homebrew vào PATH (Apple Silicon M1/M2/M3)
        if [[ -f "/opt/homebrew/bin/brew" ]]; then
            eval "$(/opt/homebrew/bin/brew shellenv)"
            echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
        fi
        
        if ! command -v brew &>/dev/null; then
            echo -e "${RED} [LỖI] Cài Homebrew thất bại. Thử cài thủ công tại: https://brew.sh${NC}"
            exit 1
        fi
        echo -e "${GREEN} [✓] Homebrew đã được cài thành công!${NC}"
    else
        echo -e "${GREEN} [✓] Homebrew đã có sẵn: $(brew --version | head -1)${NC}"
    fi
fi

# ============================================================
# BƯỚC 2: Kiểm tra và cài đặt Python
# ============================================================
echo ""
echo -e "${BOLD} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD} [2/5] Kiểm tra Python 3...${NC}"
echo -e "${BOLD} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Kiểm tra python3
PYTHON_CMD=""
if command -v python3 &>/dev/null; then
    PY_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    PY_MAJOR=$(echo $PY_VERSION | cut -d. -f1)
    PY_MINOR=$(echo $PY_VERSION | cut -d. -f2)
    
    if [ "$PY_MAJOR" -ge 3 ] && [ "$PY_MINOR" -ge 10 ]; then
        PYTHON_CMD="python3"
        echo -e "${GREEN} [✓] Python đã có sẵn: $PY_VERSION${NC}"
    else
        echo -e "${YELLOW} [!] Python $PY_VERSION quá cũ (cần 3.10+). Đang nâng cấp...${NC}"
    fi
fi

if [ -z "$PYTHON_CMD" ]; then
    echo -e "${YELLOW} [!] Python 3.10+ chưa có. Đang cài...${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install python@3.11
        # Thêm vào PATH
        export PATH="$(brew --prefix)/opt/python@3.11/bin:$PATH"
    elif command -v apt-get &>/dev/null; then
        # Ubuntu/Debian
        sudo apt-get update -qq
        sudo apt-get install -y python3.11 python3.11-pip python3-pip
    elif command -v dnf &>/dev/null; then
        # Fedora/RHEL
        sudo dnf install -y python3.11
    elif command -v pacman &>/dev/null; then
        # Arch Linux
        sudo pacman -S --noconfirm python
    else
        echo -e "${RED} [LỖI] Không thể tự cài Python. Tải thủ công: https://www.python.org/downloads/${NC}"
        exit 1
    fi
    
    if command -v python3.11 &>/dev/null; then
        PYTHON_CMD="python3.11"
    elif command -v python3 &>/dev/null; then
        PYTHON_CMD="python3"
    else
        echo -e "${RED} [LỖI] Cài Python thất bại!${NC}"
        exit 1
    fi
    echo -e "${GREEN} [✓] Python đã được cài thành công!${NC}"
fi

# ============================================================
# BƯỚC 3: Kiểm tra và cài đặt Node.js
# ============================================================
echo ""
echo -e "${BOLD} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD} [3/5] Kiểm tra Node.js...${NC}"
echo -e "${BOLD} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

NODE_READY=false
if command -v node &>/dev/null; then
    NODE_VERSION=$(node --version)
    NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "${GREEN} [✓] Node.js đã có sẵn: $NODE_VERSION${NC}"
        NODE_READY=true
    else
        echo -e "${YELLOW} [!] Node.js $NODE_VERSION quá cũ (cần v18+). Đang nâng cấp...${NC}"
    fi
fi

if [ "$NODE_READY" = false ]; then
    echo -e "${YELLOW} [!] Đang cài Node.js 20 LTS...${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install node@20
        export PATH="$(brew --prefix)/opt/node@20/bin:$PATH"
        # Thêm vào shell profile
        echo 'export PATH="'$(brew --prefix)'/opt/node@20/bin:$PATH"' >> ~/.zprofile
    elif command -v apt-get &>/dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif command -v dnf &>/dev/null; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo dnf install -y nodejs
    elif command -v pacman &>/dev/null; then
        sudo pacman -S --noconfirm nodejs npm
    else
        echo -e "${RED} [LỖI] Không thể tự cài Node.js. Tải thủ công: https://nodejs.org${NC}"
        exit 1
    fi
    
    if ! command -v node &>/dev/null; then
        echo -e "${RED} [LỖI] Cài Node.js thất bại!${NC}"
        exit 1
    fi
    echo -e "${GREEN} [✓] Node.js đã được cài: $(node --version)${NC}"
fi

NPM_VERSION=$(npm --version 2>/dev/null || echo "not found")
echo -e "${GREEN} [✓] npm: v$NPM_VERSION${NC}"

# ============================================================
# BƯỚC 4: Cài thư viện Python (Backend)
# ============================================================
echo ""
echo -e "${BOLD} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD} [4/5] Cài thư viện Python (Backend)...${NC}"
echo -e "${BOLD} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$BACKEND_DIR"

# Nâng cấp pip
$PYTHON_CMD -m pip install --upgrade pip --quiet 2>/dev/null || true

# Cài requirements
echo -e "${BLUE} [↓] Đang cài: fastapi, uvicorn, sqlalchemy, pydantic, pandas...${NC}"
$PYTHON_CMD -m pip install -r requirements.txt --quiet

if [ $? -ne 0 ]; then
    echo -e "${RED} [LỖI] Cài thư viện Python thất bại! Kiểm tra kết nối Internet.${NC}"
    exit 1
fi
echo -e "${GREEN} [✓] Tất cả thư viện Python đã được cài!${NC}"

# ============================================================
# BƯỚC 5: Cài thư viện Node.js (Frontend)
# ============================================================
echo ""
echo -e "${BOLD} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD} [5/5] Cài thư viện Node.js (Frontend)...${NC}"
echo -e "${BOLD} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$FRONTEND_DIR"

if [ -d "node_modules" ]; then
    echo -e "${GREEN} [✓] node_modules đã tồn tại — bỏ qua bước cài lại.${NC}"
else
    echo -e "${BLUE} [↓] Đang chạy npm install (next.js, react, tailwind...)${NC}"
    npm install --legacy-peer-deps
    
    if [ $? -ne 0 ]; then
        echo -e "${RED} [LỖI] npm install thất bại! Kiểm tra kết nối Internet.${NC}"
        exit 1
    fi
    echo -e "${GREEN} [✓] Tất cả thư viện Node.js đã được cài!${NC}"
fi

# ============================================================
# KHỞI CHẠY Backend và Frontend
# ============================================================
echo ""
echo -e "${BOLD} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD} Khởi chạy dự án...${NC}"
echo -e "${BOLD} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE} Đang mở 2 tab terminal:${NC}"
echo -e "${BLUE}   🐍 Backend  → http://localhost:8000${NC}"
echo -e "${BLUE}   ⚛️  Frontend → http://localhost:3000${NC}"
echo ""

# Khởi chạy Backend trong background tab mới
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS — dùng osascript để mở Terminal tab mới
    osascript <<EOF
tell application "Terminal"
    activate
    do script "echo ''; echo '  ╔══════════════════════════════════════════╗'; echo '  ║  🐍 Backend FastAPI - Port 8000         ║'; echo '  ║  Swagger: http://localhost:8000/docs    ║'; echo '  ╚══════════════════════════════════════════╝'; echo ''; cd '$BACKEND_DIR' && $PYTHON_CMD run.py"
end tell
EOF

    sleep 3

    osascript <<EOF
tell application "Terminal"
    activate
    do script "echo ''; echo '  ╔══════════════════════════════════════════╗'; echo '  ║  ⚛️  Frontend Next.js - Port 3000        ║'; echo '  ║  Giao diện: http://localhost:3000       ║'; echo '  ╚══════════════════════════════════════════╝'; echo ''; cd '$FRONTEND_DIR' && npm run dev"
end tell
EOF

    # Chờ frontend khởi động rồi mở browser
    echo -e "${YELLOW} [⏳] Chờ các server khởi động (10 giây)...${NC}"
    sleep 10

    echo -e "${BLUE} [🌐] Đang mở trình duyệt...${NC}"
    open "http://localhost:3000"

else
    # Linux — dùng gnome-terminal hoặc xterm
    if command -v gnome-terminal &>/dev/null; then
        gnome-terminal --title="🐍 Backend — AI ClassMate" -- bash -c "cd '$BACKEND_DIR'; $PYTHON_CMD run.py; exec bash"
        sleep 3
        gnome-terminal --title="⚛️ Frontend — AI ClassMate" -- bash -c "cd '$FRONTEND_DIR'; npm run dev; exec bash"
    elif command -v xterm &>/dev/null; then
        xterm -title "Backend — AI ClassMate" -e "cd '$BACKEND_DIR' && $PYTHON_CMD run.py" &
        sleep 3
        xterm -title "Frontend — AI ClassMate" -e "cd '$FRONTEND_DIR' && npm run dev" &
    else
        # Fallback: chạy cả 2 trong background, log ra file
        echo -e "${YELLOW} [!] Không tìm thấy terminal GUI. Chạy ở background...${NC}"
        cd "$BACKEND_DIR"
        nohup $PYTHON_CMD run.py > "$ROOT_DIR/backend.log" 2>&1 &
        BACKEND_PID=$!
        echo -e "${GREEN} [✓] Backend đang chạy (PID: $BACKEND_PID) — log: backend.log${NC}"
        
        sleep 3
        
        cd "$FRONTEND_DIR"
        nohup npm run dev > "$ROOT_DIR/frontend.log" 2>&1 &
        FRONTEND_PID=$!
        echo -e "${GREEN} [✓] Frontend đang chạy (PID: $FRONTEND_PID) — log: frontend.log${NC}"
    fi

    # Mở browser trên Linux
    sleep 10
    if command -v xdg-open &>/dev/null; then
        xdg-open "http://localhost:3000"
    fi
fi

# ============================================================
# HOÀN TẤT
# ============================================================
echo ""
echo -e "${GREEN}${BOLD} ╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD} ║  ✅  AI ClassMate 2G3 đã sẵn sàng!                     ║${NC}"
echo -e "${GREEN}${BOLD} ║                                                          ║${NC}"
echo -e "${GREEN}${BOLD} ║  🌐 Giao diện:   http://localhost:3000                  ║${NC}"
echo -e "${GREEN}${BOLD} ║  🔌 Backend API: http://localhost:8000                  ║${NC}"
echo -e "${GREEN}${BOLD} ║  📖 Swagger UI:  http://localhost:8000/docs             ║${NC}"
echo -e "${GREEN}${BOLD} ║                                                          ║${NC}"
echo -e "${GREEN}${BOLD} ║  Để dừng: Ctrl+C trong từng cửa sổ terminal            ║${NC}"
echo -e "${GREEN}${BOLD} ╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
