# UI Screen — Danh sách học sinh

## 1. Mục tiêu
Tìm kiếm, lọc và mở hồ sơ học sinh trong lớp được phép truy cập.

## 2. Thành phần
- Tiêu đề: “Học sinh”.
- Ô tìm kiếm theo mã học sinh hoặc tên (chỉ bật tìm theo trường thực sự được API hỗ trợ).
- Bộ lọc trạng thái nếu mô hình dữ liệu có trường trạng thái.
- Bảng: Mã học sinh, họ tên, trạng thái dữ liệu cần rà soát (nếu có), thao tác xem hồ sơ.
- Phân trang hoặc tải thêm khi API hỗ trợ.
- Nút “Thêm học sinh” chỉ hiển thị khi endpoint và quyền tạo đã được xác nhận.

## 3. Hành động
- Tìm kiếm.
- Xóa bộ lọc.
- Mở hồ sơ.
- Tạo học sinh (nếu được phép).
- Sửa thông tin từ hồ sơ hoặc thao tác được API hỗ trợ.

## 4. API liên quan dự kiến
- `GET /classes`
- `GET /classes/{classId}/students`
- `POST /classes/{classId}/students` (nếu dùng để tạo)
- `GET /students/{studentId}`
- `PATCH /students/{studentId}`

Tên và path phải được đối chiếu với API Design đã chốt trước khi triển khai.

## 5. Validation và bảo vệ dữ liệu
- Mã học sinh phải được xử lý theo quy tắc backend.
- Không để thông tin nhạy cảm xuất hiện trong URL hoặc log client.
- Không hiển thị điểm hoặc thứ hạng cá nhân ngay trong bảng danh sách nếu không cần cho tác vụ.
- Với demo, dùng mã giả như `HS001`, `HS002`.

## 6. Trạng thái
Loading, empty, error, không có kết quả tìm kiếm, permission denied.

## 7. Tiêu chí nghiệm thu
- Tìm kiếm/lọc không làm mất lớp đang chọn.
- Mở đúng hồ sơ tương ứng.
- Nút thao tác chỉ hiện khi được hỗ trợ và người dùng có quyền.
