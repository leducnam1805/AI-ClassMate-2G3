# UI Design Convention — AI ClassMate 2G3

## 1. Phạm vi
Áp dụng cho giao diện web MVP dành cho giáo viên chủ nhiệm lớp tiểu học. Stack mục tiêu: Next.js App Router, TypeScript, Tailwind CSS. Các quy ước này không thay thế API Design, Database Design hoặc quy tắc nghiệp vụ đã được giáo viên xác nhận.

## 2. Bố cục ứng dụng
- Sidebar: Tổng quan, Học sinh, Ghi nhận hành vi, Rà soát dữ liệu, Tổng kết tháng, Trợ lý AI, Cấu hình.
- Header: tên ứng dụng, lớp đang chọn, kỳ/tháng đang xem (nếu áp dụng), tài khoản và đăng xuất.
- Main content: tiêu đề trang, mô tả ngắn, hành động chính, bộ lọc, nội dung, trạng thái tải/lỗi/rỗng.
- Desktop là mục tiêu MVP trước; thiết kế phải co giãn ở màn hình tablet. Trên màn hình nhỏ, sidebar chuyển thành menu thu gọn.

## 3. Trạng thái giao diện bắt buộc
Mỗi màn hình có tối thiểu:
- Loading: skeleton hoặc chỉ báo đang tải.
- Empty: hướng dẫn hành động tiếp theo, không chỉ để vùng trống.
- Error: thông báo dễ hiểu, có nút thử lại khi phù hợp.
- Success: xác nhận thao tác đã được server chấp nhận.
- Validation: nêu rõ trường cần sửa và lý do.
- Permission denied: thông báo không đủ quyền, không lộ dữ liệu không được phép xem.

## 4. Quy ước dữ liệu và điểm
- Giá trị chưa xác minh phải hiển thị là “Chưa xác minh” hoặc “— (chưa xác minh)”, không hiển thị thành 0.
- Nếu tổng điểm không âm: số quà = `FLOOR(tổng điểm / 10)`, số dư = `tổng điểm % 10`.
- Nếu tổng điểm âm: số quà = 0; số dư không áp dụng.
- “Vi phạm cờ đỏ” có mức -10 theo quy tắc đã xác nhận.
- Một sự kiện gồm cả “nói chuyện” và “nói leo” là -2, mỗi hành vi -1; không nhân đôi nếu chỉ là một sự việc đã ghi nhận.
- Quy tắc điểm tích cực, một số mức trừ và tiêu chí tháng còn chưa chốt. UI không được tự đặt ra hoặc ngầm mặc định các giá trị này.

## 5. AI và kiểm duyệt
- Nội dung AI luôn gắn nhãn “Bản nháp do AI đề xuất”.
- Có các thao tác: chỉnh sửa, tạo lại (nếu API hỗ trợ), duyệt và từ chối.
- Không tự động phát hành nội dung AI khi chưa được giáo viên duyệt.
- Hiển thị ngữ cảnh và dữ liệu đầu vào đủ để giáo viên kiểm tra nhưng không phơi bày dữ liệu nhạy cảm không cần thiết.
- Không dùng AI để chẩn đoán tâm lý, gán nhãn tính cách, hoặc suy luận hoàn cảnh gia đình.

## 6. Bảo vệ dữ liệu
- Chỉ hiển thị trường cần thiết cho công việc.
- Không đưa API key vào client.
- Không đưa dữ liệu học sinh thật vào log phía client hoặc bản demo công khai.
- Thao tác có ảnh hưởng dữ liệu phải có phản hồi thành công/thất bại; thao tác duyệt/chốt cần xác nhận khi khó hoàn tác.
- Audit log cần ghi lại các thao tác quan trọng theo thiết kế bảo mật.

## 7. Tiêu chuẩn thành phần
- Form có label rõ ràng; không chỉ dùng placeholder.
- Nút chính nhất quán và có trạng thái disabled/loading khi đang gửi.
- Bảng có trạng thái rỗng, phân trang nếu danh sách dài, và tiêu đề cột rõ nghĩa.
- Không dùng màu sắc làm tín hiệu duy nhất; luôn có chữ/icon.
- Không dùng bảng xếp hạng công khai học sinh.
- Ngày hiển thị theo định dạng `dd/MM/yyyy`; múi giờ và cách lưu thời gian phải tuân theo backend convention.
- Các thông báo xác nhận cần phân biệt “đã lưu”, “đã duyệt”, “đã chốt”.

## 8. Quy ước trạng thái
Tên trạng thái trên UI phải được ánh xạ nhất quán với enum thực tế trong API/DB. Trước khi code, đối chiếu enum trong tài liệu backend; không tự tạo enum mới nếu backend đã có định nghĩa.
