# UI Screen — Ghi nhận và xử lý sự kiện hành vi

## 1. Mục tiêu
Ghi nhận sự kiện, xem chi tiết, xác nhận hoặc từ chối theo quy trình nghiệp vụ. Màn hình phải giúp tránh ghi trùng và bảo toàn trạng thái chưa xác minh.

## 2. Danh sách sự kiện
- Bộ lọc: lớp, học sinh, khoảng ngày, trạng thái (chỉ những bộ lọc API hỗ trợ).
- Bảng: thời điểm, học sinh, hành vi, điểm tác động nếu đã xác minh, trạng thái, người ghi nhận (nếu API trả về), thao tác.
- Nút “Ghi nhận sự kiện”.
- Nhãn trạng thái bằng chữ, không chỉ bằng màu.

## 3. Form ghi nhận
Trường đề xuất, cần đối chiếu schema API:
- Học sinh.
- Ngày/giờ xảy ra.
- Hành vi/tiêu chí.
- Mô tả ngắn, khách quan.
- Ghi chú nội bộ nếu được mô hình dữ liệu cho phép.
- Nút Lưu bản ghi / Hủy.

Không tự cho phép nhập mức điểm tùy ý nếu mức điểm phải lấy từ tiêu chí được cấu hình.

## 4. Chi tiết và xử lý
- Xem dữ liệu gốc, người ghi nhận, trạng thái và tác động điểm.
- Hành động “Xác nhận” và “Từ chối” chỉ khi trạng thái hiện tại và quyền người dùng cho phép.
- Xác nhận/từ chối cần hộp thoại xác nhận; lý do từ chối nếu API yêu cầu.
- Chống gửi lặp khi người dùng bấm nhiều lần; xử lý idempotency nếu API hỗ trợ.

## 5. Quy tắc nghiệp vụ đã xác nhận
- “Vi phạm cờ đỏ” = -10.
- Một sự việc có cả “nói chuyện” và “nói leo” tính -2 tổng cộng, mỗi hành vi -1; không ghi trùng cùng hành vi trong cùng sự việc.
- Các mức trừ chưa xác nhận phải được đánh dấu chờ cấu hình/xác nhận; không tự đưa vào danh sách lựa chọn chính thức.
- Một sự kiện chưa xác nhận không được trình bày như điểm đã chốt.

## 6. API liên quan dự kiến
- `POST /behavior-events`
- `GET /behavior-events`
- `GET /behavior-events/{eventId}`
- `POST /behavior-events/{eventId}/confirm`
- `POST /behavior-events/{eventId}/reject`

Đối chiếu path thực tế với API Design.

## 7. Trạng thái giao diện
Loading, empty, validation error, server error, pending confirmation, confirmed, rejected.

## 8. Tiêu chí nghiệm thu
- Giáo viên phân biệt được bản ghi đang chờ và đã xác nhận.
- Không thể xác nhận hai lần một bản ghi đã xử lý.
- Lỗi được hiển thị rõ; form không mất dữ liệu không cần thiết khi lỗi tạm thời.
- Không tạo tác động điểm trước khi điều kiện xác nhận nghiệp vụ được đáp ứng.
