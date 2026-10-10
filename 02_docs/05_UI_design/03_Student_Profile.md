# UI Screen — Hồ sơ học sinh

## 1. Mục tiêu
Cho phép giáo viên xem thông tin cơ bản và các thông tin theo dõi được phép truy cập của một học sinh.

## 2. Bố cục
- Breadcrumb: Học sinh > Hồ sơ học sinh.
- Phần thông tin cơ bản: mã, họ tên và các trường đã được duyệt trong Database Design.
- Các tab/khu vực (chỉ hiển thị nếu API cung cấp dữ liệu):
  - Tổng quan.
  - Sự kiện hành vi.
  - Tổng kết theo tháng.
  - Nhận xét đã được giáo viên duyệt.
- Nút sửa thông tin chỉ khi endpoint/quyền tương ứng được xác nhận.

## 3. API liên quan dự kiến
- `GET /students/{studentId}`
- `PATCH /students/{studentId}`
- API sự kiện và tổng kết có bộ lọc theo học sinh nếu được hỗ trợ.

## 4. Quy tắc
- Không tự suy diễn tính cách, năng lực, hoàn cảnh gia đình hoặc tình trạng tâm lý từ dữ liệu điểm/hành vi.
- Không hiển thị nội dung AI chưa duyệt như nhận xét chính thức.
- Phân biệt rõ sự kiện đã xác nhận và sự kiện đang chờ xác nhận.
- Nếu chưa có dữ liệu tháng, hiển thị “Chưa có dữ liệu”, không tạo giá trị mặc định.

## 5. Trạng thái
Loading, not found, permission denied, error, partial data.

## 6. Tiêu chí nghiệm thu
- Mã học sinh và hồ sơ hiển thị đúng.
- Dữ liệu sự kiện/tổng kết có nguồn và trạng thái rõ ràng.
- Thông tin chỉnh sửa được xác thực ở cả UI và server.
