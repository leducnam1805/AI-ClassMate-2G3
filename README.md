# 🎓 AI ClassMate 2G3

> **Đề tài Nghiên cứu Khoa học Giáo dục — Hội thi Nhà giáo sáng tạo với công nghệ số và trí tuệ nhân tạo 2026**  
> Căn cứ: Công văn số 4723/UBND-VHXH ngày 07/10/2026  
> Đơn vị thực nghiệm: Lớp 2G3 — Trường Tiểu học Núi Thành (Phân hiệu 6)

---

## 📋 Tên đề tài

**"Ứng dụng trí tuệ nhân tạo xây dựng mô hình hỗ trợ công tác chủ nhiệm lớp nhằm nâng cao hiệu quả theo dõi, giáo dục và phát huy sự tiến bộ của học sinh tiểu học"**

---

## 🗂️ Cấu trúc thư mục dự án

```
AI-ClassMate-2G3/
│
├── 📁 01_requirement/              # Dữ liệu & Yêu cầu nghiệp vụ
│   ├── THI ĐUA THANG 9 LOP 2G3.xlsx       # Bảng thi đua tháng 9 gốc (26 học sinh)
│   ├── Danh sach dien thi dua tung hoc sinh.txt  # Quy định điểm cộng/trừ
│   ├── Ke hoach thuc hien.txt              # Lộ trình triển khai đề xuất
│   └── Số 48 - 4723.UBND.VH.XH.07.10.2026.signed.pdf  # Công văn cơ sở pháp lý
│
├── 📁 02_docs/                     # Tài liệu thiết kế kỹ thuật
│   ├── 00-overview/                # Đề cương NCKH và kế hoạch triển khai
│   ├── 01-business/                # Quy tắc nghiệp vụ (BR-001..BR-008)
│   ├── 02_architecture/            # Kiến trúc hệ thống (System Architecture V1)
│   ├── 03-database/                # Thiết kế CSDL & SQL Schema V1
│   ├── 04_design/                  # API Design, API Contract, Security Design
│   ├── 05_UI_design/               # Thiết kế giao diện (UI Design V1)
│   └── 06_plan/                    # Kế hoạch triển khai UI
│
└── 📁 03_app/                      # Mã nguồn ứng dụng
    ├── 📁 backend/                 # 🐍 Python FastAPI Backend (Cổng 8000)
    │   ├── app/
    │   │   ├── main.py             # Điểm khởi động FastAPI & cấu hình CORS
    │   │   ├── database.py         # Kết nối PostgreSQL (hỗ trợ fallback SQLite)
    │   │   ├── models.py           # ORM models (8 bảng dữ liệu)
    │   │   ├── schemas.py          # Pydantic schemas kiểm tra dữ liệu
    │   │   ├── seed.py             # Nạp dữ liệu 26 học sinh vào database
    │   │   └── services/
    │   │       ├── audit_service.py    # Kiểm toán quy tắc BR-001..BR-008
    │   │       └── ai_service.py       # Sinh nhận xét AI & kế hoạch giáo dục
    │   ├── run.py                  # Entrypoint chạy server
    │   ├── requirements.txt        # Danh sách thư viện Python (FastAPI, SQLAlchemy, psycopg2-binary)
    │   └── classmate.db            # Database SQLite (chế độ fallback ngoại tuyến)
    │
    └── 📁 frontend/                # ⚛️ Next.js Frontend (Cổng 3000)
        └── src/
            ├── app/
            │   ├── page.tsx            # Trang chính — kết nối API và render UI
            │   └── globals.css         # CSS toàn cục
            ├── components/             # Các phân hệ giao diện
            │   ├── Header.tsx          # Thanh tiêu đề và trạng thái kết nối
            │   ├── Sidebar.tsx         # Menu điều hướng 6 phân hệ
            │   ├── DashboardView.tsx   # Bảng điều hành tổng quan lớp
            │   ├── AuditTableView.tsx  # Bảng thi đua & rà soát lỗi dữ liệu
            │   ├── AIAssistantView.tsx # Trợ lý AI soạn nhận xét cuối tháng
            │   ├── StudentProfileView.tsx  # Hồ sơ tiến bộ & kế hoạch chủ nhiệm
            │   ├── ResearchReportView.tsx  # Minh chứng NCKH & báo cáo in ấn
            │   └── RulesSettingsView.tsx   # Quy tắc nghiệp vụ BR Engine
            ├── data/
            │   └── studentsData.ts     # Dữ liệu khởi tạo (fallback nếu mất kết nối API)
            ├── services/
            │   └── api.ts              # API client gọi sang Backend port 8000
            └── types/
                └── index.ts            # TypeScript types toàn dự án
```

---

## 🏗️ Kiến trúc phân tán (Decoupled Architecture with PostgreSQL)

```
┌─────────────────────────────┐        HTTP REST API        ┌─────────────────────────────┐
│       FRONTEND               │   ─────────────────────►   │        BACKEND               │
│   Next.js + TypeScript       │        Port 8000            │   Python FastAPI             │
│   Tailwind CSS               │   ◄─────────────────────   │   SQLAlchemy ORM             │
│   Port 3000                  │        JSON Response        │   Port 8000                  │
│   http://localhost:3000      │                             │   http://localhost:8000      │
└─────────────────────────────┘                             └──────────────┬──────────────┘
                                                                           │
                                                            ┌──────────────▼──────────────┐
                                                            │   PostgreSQL 16 Database    │
                                                            │   (Docker container: 5432)  │
                                                            │  8 bảng quan hệ:            │
                                                            │  • classes                  │
                                                            │  • students                 │
                                                            │  • criteria                 │
                                                            │  • behavior_events          │
                                                            │  • monthly_summaries        │
                                                            │  • ai_comments              │
                                                            │  • review_issues            │
                                                            │  • audit_logs               │
                                                            └─────────────────────────────┘
```

---

## 🚀 Hướng dẫn cài đặt và khởi chạy

### Yêu cầu hệ thống

| Phần mềm | Phiên bản khuyến nghị |
|---|---|
| **Docker & Docker Compose** | Docker 24+ / Compose v2+ (Khuyến nghị hàng đầu) |
| **Python** | 3.11+ (Nếu chạy thủ công) |
| **Node.js** | 20 LTS+ (Nếu chạy thủ công) |
| **PostgreSQL** | 15+ hoặc 16 (Hoặc dùng tự động qua Docker) |

---

### 🐳 Cách 1: Khởi chạy toàn bộ hệ thống bằng Docker (Khuyến nghị chuẩn)

Hệ thống đã được đóng gói toàn diện với 3 service:
1. **`postgres`** (PostgreSQL 16 Alpine, Port 5432)
2. **`backend`** (FastAPI, Port 8000, tự động kết nối và nạp dữ liệu vào PostgreSQL)
3. **`frontend`** (Next.js 16, Port 3000)

Chỉ cần **1 lệnh duy nhất**:

```bash
# Khởi động PostgreSQL, Backend và Frontend cùng lúc
docker compose up --build
```

Hoặc chạy ngầm dưới nền:
```bash
docker compose up -d --build
```

Kiểm tra trạng thái các container:
```bash
docker compose ps
```

Để dừng các service:
```bash
docker compose down
```

> **Ghi chú về dữ liệu:** Dữ liệu PostgreSQL được lưu trữ bền vững tại Docker volume `postgres-data`. Để reset hoàn toàn CSDL, dùng lệnh `docker compose down -v`.

- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:8000`
- **API Docs (Swagger):** `http://localhost:8000/docs`

---

### 💻 Cách 2: Chạy trực tiếp trên Windows (Máy mới tinh, không cần cài trước gì cả)

Dành cho máy mới chưa có bất kỳ phần mềm nào:

1. **Bước 1: Chạy cài đặt tự động:**
   - Nhấp đúp vào file **`install-env.bat`** (hoặc mở cmd gõ `install-env.bat`).
   - File sẽ **tự động hoàn toàn**:
     - Tạo file `.env` chuẩn.
     - Tự tải & cài đặt **Python 3.11** (nếu máy chưa có).
     - Tự tải & cài đặt **Node.js 20 LTS** (nếu máy chưa có).
     - Tự cài đặt toàn bộ thư viện Python (FastAPI, SQLAlchemy, psycopg2...).
     - Tự cài đặt toàn bộ thư viện Frontend (Next.js, Tailwind...).
     - Chạy bộ 17 unit test kiểm tra hệ thống.

2. **Bước 2: Khởi chạy dự án:**
   - Nhấp đúp file **`run.bat`**:
     - Tự động bật Backend (`http://localhost:8000`) & Frontend (`http://localhost:3000`).
     - Tự động mở trình duyệt web.

> **Mẹo:** Ngay cả khi bạn quên chạy `install-env.bat` mà nhấp luôn `run.bat`, script sẽ tự phát hiện máy còn thiếu môi trường và tự động kích hoạt `install-env.bat` giúp bạn!

---

## ✨ Các tính năng chính

| Phân hệ | Mô tả |
|---|---|
| 📊 **Bảng điều hành lớp (Dashboard)** | Thống kê thời gian thực: sĩ số, tổng điểm cộng/trừ, số quà, danh sách Xuất sắc tháng, cảnh báo dữ liệu cần rà soát. |
| 📋 **Bảng thi đua & Rà soát lỗi (Audit Table)** | So sánh bảng gốc Excel với bảng đã chuẩn hóa theo BR-001..008. Nút "Chạy Kiểm Toán Số" phát hiện tự động 100% sai sót chỉ trong < 1 giây. |
| 🤖 **Trợ lý AI soạn nhận xét (AI Assistant)** | Sinh dự thảo nhận xét cá nhân hóa theo minh chứng thực tế; tùy chỉnh giọng điệu sư phạm; giáo viên xem, chỉnh sửa và phê duyệt. |
| 👤 **Hồ sơ tiến bộ học sinh (Student Profile)** | Phân tích điểm mạnh/yếu; kế hoạch can thiệp tuần tiếp theo; mẫu trao đổi với phụ huynh. |
| 📈 **Minh chứng NCKH & Báo cáo** | Bảng đối chứng định lượng giữa phương pháp thủ công và mô hình số; mẫu báo cáo tháng in ấn được. |
| ⚙️ **Quy tắc nghiệp vụ (Business Rules Engine)** | Hiển thị công khai 8 quy tắc BR đã được xác nhận và các điểm đang khảo sát mở rộng. |

---

## 📊 Kết quả thực nghiệm đo lường (Tháng 9/2026 — Lớp 2G3)

| Tiêu chí đo lường | Phương pháp thủ công | AI ClassMate 2G3 | Cải thiện |
|---|:---:|:---:|:---:|
| Tổng thời gian xử lý hồ sơ tháng | **440 phút** | **28 phút** | **Giảm 93.6%** |
| Tỷ lệ sai sót tính điểm/quà | **15.38%** (4/26 HS) | **0.0%** | **Triệt tiêu 100%** |
| Nhận xét gắn liền minh chứng | **42.3%** (11/26 HS) | **100%** (26/26 HS) | **+136.4%** |

---

## 🔌 REST API Endpoints chính

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/health` | Kiểm tra trạng thái server |
| `GET` | `/api/students` | Lấy danh sách 26 học sinh kèm dữ liệu rà soát |
| `GET` | `/api/students/{id}` | Lấy chi tiết 1 học sinh |
| `PATCH` | `/api/students/{id}` | Cập nhật điểm, nhận xét, trạng thái phê duyệt |
| `PATCH` | `/api/audit/issues/{id}/resolve` | Chốt/Mở trạng thái rà soát lỗi dữ liệu |
| `POST` | `/api/ai/generate-draft` | Tạo lại bản nháp nhận xét AI theo giọng điệu chọn |
| `POST` | `/api/ai/batch-approve` | Phê duyệt hàng loạt tất cả bản nháp |
| `GET` | `/api/reports/research-metrics` | Số liệu đối chứng thực nghiệm NCKH |

---

## 📐 Quy tắc nghiệp vụ đã xác nhận (BR-001 đến BR-008)

| Mã | Nội dung cốt lõi |
|---|---|
| **BR-001** | Ô điểm trống = dữ liệu chưa xác nhận, KHÔNG tự coi là 0 |
| **BR-002** | Vi phạm cờ đỏ = trừ **10 điểm** theo quy chế trường |
| **BR-003** | Tổng điểm âm → Số quà = `0`; Điểm dư = `N/A` |
| **BR-004** | Không tự ý sửa dữ liệu gốc; mọi thay đổi phải có xác nhận và lưu vết |
| **BR-005** | Số quà = `FLOOR(Tổng điểm / 10)` khi tổng không âm |
| **BR-006** | Điểm dư = `Tổng điểm − (Số quà × 10)` khi tổng không âm |
| **BR-007** | Nói chuyện + nói leo trong cùng sự việc = trừ **2 điểm** (−1 & −1) |
| **BR-008** | Không tính trùng cùng hành vi trong cùng lần ghi nhận |

---

## 🛠️ Công nghệ sử dụng

### Backend
- **Python 3.11** — Ngôn ngữ lập trình chính
- **FastAPI** — Framework REST API hiệu năng cao, tự sinh Swagger docs
- **SQLAlchemy 2.0** — ORM quản lý cơ sở dữ liệu quan hệ
- **PostgreSQL 16** — Cơ sở dữ liệu chính chạy qua Docker container (Port 5432)
- **psycopg2-binary** — Driver kết nối PostgreSQL hiệu năng cao
- **SQLite** — Chế độ fallback ngoại tuyến tiện lợi khi không có Docker
- **Pandas / Numpy** — Phân tích dữ liệu học sinh (giai đoạn tiếp theo)
- **Uvicorn** — ASGI server

### Frontend
- **Next.js 16 (App Router)** — Framework React hiện đại
- **TypeScript** — Kiểm tra kiểu tĩnh toàn dự án
- **Tailwind CSS** — Styling nhanh và nhất quán
- **Lucide React** — Bộ icon hiện đại

---

## 👥 Đối tượng sử dụng

- **Giáo viên chủ nhiệm Lớp 2G3:** Sử dụng trực tiếp để ghi nhận thi đua, rà soát dữ liệu, soạn và duyệt nhận xét học sinh.
- **Ban Giám hiệu:** Xem báo cáo tổng hợp tháng và minh chứng thực nghiệm NCKH.
- **Phụ huynh học sinh:** Nhận thông tin rèn luyện của con qua mẫu tin nhắn được giáo viên duyệt.

---

## 📅 Thông tin đề tài

| Nội dung | Thông tin |
|---|---|
| **Đơn vị tham dự** | Trường Tiểu học Núi Thành |
| **Hội thi** | Ngày hội Nhà giáo sáng tạo với công nghệ số và trí tuệ nhân tạo 2026 |
| **Căn cứ pháp lý** | Công văn số 4723/UBND-VHXH ngày 07/10/2026 |
| **Địa chỉ nộp bài** | https://www.ieeai.net |
| **Hạn nộp** | 23:59 ngày 25/10/2026 |
