# UI Screen — Dashboard / Tổng quan lớp

## 1. Mục tiêu
Giúp giáo viên nhìn nhanh tình trạng dữ liệu và công việc cần xử lý của lớp đang chọn, không tạo áp lực bằng xếp hạng công khai học sinh.

## 2. Người dùng
Giáo viên được cấp quyền truy cập lớp.

## 3. Bố cục
1. Header: “Tổng quan lớp”, lớp đang chọn, tháng/kỳ đang xem nếu có.
2. Thẻ chỉ số:
   - Tổng số học sinh (từ dữ liệu lớp).
   - Số sự kiện đang chờ xác nhận (nếu API cung cấp).
   - Số vấn đề dữ liệu cần rà soát.
   - Trạng thái tổng kết tháng: chưa tạo / bản nháp / chờ duyệt / đã duyệt (chỉ dùng trạng thái nếu API hỗ trợ).
3. Danh sách “Việc cần xử lý”: dữ liệu chưa xác minh, sự kiện chờ xử lý, tổng kết chưa duyệt.
4. Lối tắt: Xem học sinh, Ghi nhận sự kiện, Rà soát dữ liệu, Mở tổng kết tháng.
5. Khu vực hướng dẫn khi lớp chưa có dữ liệu.

## 4. Hành động
- Chọn lớp (nếu tài khoản có nhiều lớp).
- Chọn tháng/kỳ nếu endpoint hỗ trợ.
- Bấm vào thẻ để điều hướng đến danh sách chi tiết đã lọc.
- Làm mới dữ liệu.

## 5. API liên quan dự kiến
Đối chiếu các endpoint hiện có trong bộ API Design. Có thể cần một endpoint tổng hợp dashboard nếu các API hiện tại không cung cấp dữ liệu tổng hợp; **không tự thêm endpoint khi chưa cập nhật API Design**.

## 6. Quy tắc hiển thị
- Không hiển thị bảng xếp hạng cá nhân.
- Không coi trường điểm trống là 0.
- Không hiển thị chỉ số tổng hợp nếu dữ liệu nguồn chưa đủ; thay bằng “Chưa đủ dữ liệu” và liên kết rà soát.
- Chỉ hiển thị dữ liệu thuộc lớp người dùng được phép truy cập.

## 7. Trạng thái
- Loading: skeleton thẻ và danh sách.
- Empty: chưa có dữ liệu; cung cấp lối tắt nhập dữ liệu.
- Error: thông báo lỗi và thử lại.
- Partial data: nêu rõ mục nào chưa có dữ liệu, không tự suy diễn.

## 8. Tiêu chí nghiệm thu
- Giáo viên xác định được việc cần xử lý mà không phải mở từng màn hình.
- Các thẻ điều hướng đúng bộ lọc tương ứng.
- Dữ liệu thiếu được biểu thị rõ ràng.
- Không xuất hiện thông tin của lớp khác.
