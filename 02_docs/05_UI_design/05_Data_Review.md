# UI Screen — Rà soát dữ liệu

## 1. Mục tiêu
Tập trung các trường hợp dữ liệu thiếu, chưa xác minh hoặc không nhất quán để giáo viên xử lý trước khi tổng kết.

## 2. Danh sách vấn đề
- Bộ lọc: lớp, tháng, loại vấn đề, trạng thái (tùy API).
- Cột: loại vấn đề, đối tượng liên quan, mô tả, ngày phát hiện, trạng thái, thao tác.
- Ưu tiên các vấn đề ảnh hưởng đến việc tính tổng điểm/tổng kết, nhưng không tự tạo mức độ ưu tiên nếu backend chưa định nghĩa.

## 3. Chi tiết vấn đề
- Mô tả vấn đề và trường dữ liệu liên quan.
- Giá trị hiện có và lý do cần rà soát (nếu được API cung cấp).
- Hướng dẫn thao tác hợp lệ.
- Nút “Đánh dấu đã xử lý”/“Giải quyết” chỉ dùng theo contract thực tế của API; có thể yêu cầu nhập ghi chú nếu backend quy định.

## 4. Quy tắc bắt buộc
- Ô điểm trống là chưa xác minh, không phải 0.
- Không tự sửa dữ liệu nguồn để làm cho tổng kết đủ điều kiện.
- Chỉ đóng vấn đề sau khi dữ liệu liên quan được xử lý và thao tác được server xác nhận.
- Khi chưa đủ dữ liệu, hiển thị “Chưa đủ dữ liệu để tính/duyệt” thay vì đoán.

## 5. API liên quan dự kiến
- `GET /review-issues`
- `POST /review-issues/{issueId}/resolve`

Đối chiếu path, bộ lọc và body với API Design.

## 6. Tiêu chí nghiệm thu
- Người dùng hiểu tại sao bản ghi cần rà soát.
- Có thể truy cập đối tượng liên quan.
- Vấn đề chỉ đổi trạng thái sau phản hồi thành công từ server.
- Không biến dữ liệu chưa xác minh thành số 0.
