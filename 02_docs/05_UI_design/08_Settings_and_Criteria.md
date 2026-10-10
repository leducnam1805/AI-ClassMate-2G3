# UI Screen — Cấu hình và tiêu chí

## 1. Mục tiêu
Cho phép người có quyền xem/quản lý các tiêu chí hành vi và quy tắc được cấu hình, với cơ chế duyệt nếu quy trình nghiệp vụ yêu cầu.

## 2. Danh sách tiêu chí
- Tên tiêu chí.
- Mô tả.
- Giá trị điểm hoặc tác động theo contract.
- Trạng thái: đang dùng/chờ duyệt/ngừng dùng — chỉ dùng nếu enum backend có các trạng thái này.
- Người cập nhật và thời điểm cập nhật nếu API cung cấp.
- Thao tác xem/sửa/đề nghị tiêu chí theo quyền.

## 3. Tạo hoặc chỉnh sửa
Các trường form phải bám theo request schema trong API Design. Không tự thêm các trường không có trong database/API.
- Tên tiêu chí.
- Mô tả.
- Mức điểm/tác động (nếu schema cho phép).
- Ghi chú thay đổi (nếu được hỗ trợ).

## 4. Duyệt tiêu chí
- Hiển thị thay đổi trước khi duyệt.
- Hộp thoại xác nhận.
- Không cho người dùng không có quyền duyệt thực hiện thao tác.
- Lưu trạng thái chỉ sau phản hồi thành công từ server.

## 5. Quy tắc chưa xác nhận
Không tự cấu hình mức điểm cho các nội dung còn chưa được giáo viên xác nhận, bao gồm:
- Cách tính/giới hạn điểm tích cực.
- Mức trừ cho các hành vi còn chưa rõ.
- Tiêu chí “Xuất sắc tháng”.
- Các trường hợp cần quy tắc riêng chưa được thống nhất.

## 6. API liên quan dự kiến
- `GET /criteria`
- `POST /criteria`
- `POST /criteria/{criterionId}/approve`

Đối chiếu path và schema thực tế trước khi code.

## 7. Tiêu chí nghiệm thu
- Người dùng phân biệt được tiêu chí chính thức và tiêu chí chờ duyệt.
- Không thể tự ý đưa quy tắc chưa xác nhận thành quy tắc chính thức.
- Mọi thay đổi được phản hồi từ server và ghi audit log theo thiết kế bảo mật.
