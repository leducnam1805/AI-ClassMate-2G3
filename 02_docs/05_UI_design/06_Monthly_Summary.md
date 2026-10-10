# UI Screen — Tổng kết tháng

## 1. Mục tiêu
Xem kết quả tính toán theo tháng, phát hiện dữ liệu chưa đủ, yêu cầu tính lại và duyệt/chốt theo quy trình đã được xác nhận.

## 2. Danh sách tổng kết
- Bộ lọc tháng và lớp.
- Bảng tổng kết theo học sinh với các trường thực tế API trả về, có thể gồm tổng điểm, số quà, số dư, trạng thái.
- Không hiển thị xếp hạng công khai.
- Chỉ cho phép xem lớp trong phạm vi quyền.

## 3. Chi tiết tổng kết
- Tháng/kỳ tổng kết.
- Các thành phần điểm và nguồn dữ liệu nếu API cung cấp.
- Cảnh báo dữ liệu chưa xác minh hoặc vấn đề chưa giải quyết.
- Tổng điểm.
- Số quà và số dư theo quy tắc đã xác nhận.
- Trạng thái tổng kết và lịch sử thao tác nếu có.

## 4. Hành động
- Tính lại: yêu cầu server tính lại từ dữ liệu nguồn; hiển thị cảnh báo trước thao tác.
- Duyệt: chỉ bật khi đủ điều kiện backend xác nhận.
- Mở lại: chỉ dành cho người có quyền và theo quy trình được duyệt.
- Không giả lập trạng thái thành công ở client trước khi server trả kết quả.

## 5. Quy tắc tính đã xác nhận
- Nếu tổng điểm >= 0: `số quà = FLOOR(tổng điểm / 10)`; `số dư = tổng điểm % 10`.
- Nếu tổng điểm < 0: số quà = 0; số dư không áp dụng.
- Trường điểm trống/chưa xác minh không được tự xem là 0.
- Điều kiện “Xuất sắc tháng” và quy trình chốt tháng còn **CHỜ XÁC NHẬN**; không tự hiển thị danh hiệu hoặc tự chốt theo quy tắc suy đoán.

## 6. API liên quan dự kiến
- `POST /monthly-summaries/recalculate`
- `GET /monthly-summaries`
- `GET /monthly-summaries/{summaryId}`
- `POST /monthly-summaries/{summaryId}/approve`
- `POST /monthly-summaries/{summaryId}/reopen`

Đối chiếu contract thực tế trước khi code.

## 7. Tiêu chí nghiệm thu
- UI hiển thị rõ dữ liệu nào đã tính và dữ liệu nào chưa đủ.
- Công thức được tính ở server/logic xác định, không phụ thuộc AI.
- Không thể duyệt khi còn lỗi chặn theo quy tắc backend.
- Có xác nhận trước hành động duyệt/mở lại.
