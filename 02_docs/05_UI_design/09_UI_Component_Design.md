# UI Component Design — AI ClassMate 2G3

- **Phiên bản:** v1
- **Trạng thái:** Bản thiết kế đề xuất, cần đối chiếu với UI Design và API/Database Design hiện hành.
- **Mục tiêu:** Chuẩn hóa các thành phần giao diện dùng chung để các màn hình có cùng hành vi, cách hiển thị và khả năng kiểm thử.

## 1. Nguyên tắc thiết kế

1. Ưu tiên dễ dùng cho giáo viên chủ nhiệm, thao tác ngắn và ngôn ngữ tiếng Việt rõ ràng.
2. Thành phần hiển thị dữ liệu phải thể hiện rõ trạng thái tải, rỗng, lỗi và không đủ quyền.
3. Không biến dữ liệu chưa xác minh thành số 0.
4. Không cho giao diện tự quyết định quy tắc nghiệp vụ; server/API là nguồn xác nhận trạng thái và kết quả.
5. Không hiển thị nội dung AI như kết luận chính thức trước khi giáo viên duyệt.
6. Mọi thành phần cần hỗ trợ bàn phím, focus rõ ràng và nhãn phù hợp.
7. Dùng mã học sinh giả trong dữ liệu demo và ảnh chụp giao diện công khai.

## 2. Khung ứng dụng (App Shell)

### 2.1 Sidebar
**Mục đích:** Điều hướng giữa các phân hệ chính.

Các mục đề xuất:
- Tổng quan
- Học sinh
- Ghi nhận hành vi
- Rà soát dữ liệu
- Tổng kết tháng
- Trợ lý AI
- Cấu hình

**Hành vi:**
- Mục hiện tại có trạng thái active rõ ràng.
- Trên màn hình hẹp, sidebar thu gọn thành menu.
- Ẩn hoặc vô hiệu hóa mục mà người dùng không có quyền truy cập.
- Không tự thêm mục điều hướng nếu chưa có màn hình tương ứng.

### 2.2 Header
**Nội dung đề xuất:**
- Tên ứng dụng / logo chữ.
- Lớp đang chọn (nếu người dùng có nhiều lớp).
- Kỳ/tháng hiện tại khi ngữ cảnh màn hình cần.
- Menu tài khoản và đăng xuất.

Không hiển thị dữ liệu cá nhân học sinh ở khu vực header.

### 2.3 Page Header
Mỗi trang có:
- Breadcrumb khi hữu ích.
- Tiêu đề trang.
- Mô tả ngắn về mục tiêu.
- Một hành động chính tối đa nếu có.
- Các hành động phụ nằm trong vùng dễ nhận biết.

## 3. Button

### Variants
- **Primary:** hành động chính của trang, ví dụ “Lưu”, “Tạo bản nháp”.
- **Secondary:** hành động phụ, ví dụ “Hủy”, “Quay lại”.
- **Danger:** hành động có hậu quả lớn hoặc phá hủy dữ liệu, nếu có trong nghiệp vụ.
- **Tertiary/Ghost:** thao tác phụ trong bảng hoặc thanh công cụ.

### States
- Default
- Hover
- Focus-visible
- Disabled
- Loading

### Quy tắc
- Trong lúc request đang gửi, khóa nút submit để hạn chế gửi lặp.
- Loading state phải có nhãn dễ hiểu, ví dụ “Đang lưu…”.
- Không dùng “Thành công” trước khi server xác nhận.
- Hành động duyệt, từ chối, chốt hoặc mở lại cần xác nhận nếu khó hoàn tác.
- Không dùng màu sắc đơn lẻ để truyền đạt ý nghĩa.

## 4. Form Field

Mỗi trường gồm:
- Label hiển thị thường trực.
- Control phù hợp: input, textarea, select, date/time picker.
- Helper text khi cần.
- Error text gắn với trường.
- Trạng thái disabled/read-only khi phù hợp.

### Validation
- Validate phía client để hỗ trợ trải nghiệm; server vẫn phải xác thực lại.
- Giữ lại dữ liệu đã nhập khi lỗi mạng có thể phục hồi.
- Không dùng placeholder thay cho label.
- Không báo lỗi trước khi người dùng có cơ hội tương tác, trừ trường hợp bảo vệ bắt buộc.
- Thông báo lỗi nói rõ cách sửa, không chỉ nói “Dữ liệu không hợp lệ”.

## 5. DataTable

### Cấu trúc
- Thanh tìm kiếm/bộ lọc ở phía trên khi cần.
- Header cột rõ ràng.
- Hàng dữ liệu.
- Khu vực phân trang hoặc tải thêm theo khả năng API.
- Trạng thái loading/empty/error.

### Quy tắc
- Chỉ hiển thị trường cần thiết cho tác vụ.
- Không đặt hành động nguy hiểm sát hành động thường dùng nếu dễ bấm nhầm.
- Trên màn hình nhỏ, ưu tiên cuộn ngang có chỉ dẫn hoặc chuyển mỗi hàng thành thẻ; quyết định theo độ phức tạp thực tế.
- Sắp xếp và lọc phải phản ánh đúng request API; không giả lập kết quả lọc nếu dataset chỉ có một phần ở client.
- Không hiển thị bảng xếp hạng công khai học sinh.
- Với dữ liệu chưa xác minh, dùng “Chưa xác minh” thay vì 0.

## 6. Search and Filter Bar

Thành phần có thể gồm:
- Ô tìm kiếm.
- Bộ lọc trạng thái.
- Bộ lọc lớp/tháng/ngày khi màn hình cần.
- Nút “Áp dụng” nếu không lọc tức thời.
- Nút “Xóa bộ lọc”.

Quy tắc:
- Hiển thị các bộ lọc được API hỗ trợ.
- Khi xóa bộ lọc, trở về trạng thái mặc định đã thống nhất.
- Tránh gửi request cho mỗi ký tự nếu không có debounce hoặc hành động áp dụng.
- Không giữ bộ lọc gây hiểu nhầm khi người dùng chuyển sang lớp khác.

## 7. Status Badge

Mục đích: hiển thị trạng thái bản ghi bằng nhãn chữ kèm màu/icon nếu cần.

Ví dụ nhãn hiển thị (chỉ dùng khi khớp trạng thái backend):
- Chờ xác nhận
- Đã xác nhận
- Đã từ chối
- Cần rà soát
- Bản nháp
- Đã duyệt
- Chưa đủ dữ liệu

**Lưu ý:** Danh sách trên là nhãn UX gợi ý, không phải danh sách enum backend chính thức. Trước khi code phải đối chiếu enum thực tế.

## 8. Alert / Inline Notice

Dùng để giải thích:
- Dữ liệu chưa đủ.
- Thao tác không thể thực hiện do trạng thái hiện tại.
- Lưu ý về dữ liệu chưa xác minh.
- Cảnh báo trước khi duyệt/chốt.

Mỗi thông báo cần:
- Tiêu đề hoặc thông điệp chính.
- Mô tả ngắn nếu cần.
- Hành động tiếp theo rõ ràng khi có thể.

Không lạm dụng hộp thoại cho các thông báo thông thường.

## 9. Modal / Confirmation Dialog

Dùng cho thao tác có ảnh hưởng đáng kể: duyệt, từ chối, chốt hoặc mở lại tổng kết; xóa dữ liệu nếu nghiệp vụ cho phép.

Nội dung tối thiểu:
- Tên hành động.
- Đối tượng bị tác động.
- Hậu quả dễ hiểu.
- Nút xác nhận và nút hủy.
- Trạng thái đang xử lý và phản hồi lỗi.

Không mở modal xác nhận cho mọi thao tác nhỏ.

## 10. Empty State

Mỗi màn hình rỗng cần:
- Nêu lý do nếu xác định được.
- Nêu hành động tiếp theo.
- Có CTA chỉ khi hành động đó được hỗ trợ và người dùng có quyền.

Ví dụ:
- “Chưa có học sinh trong danh sách.”
- “Chưa có sự kiện phù hợp với bộ lọc.”
- “Không có vấn đề cần rà soát.”
- “Chưa có tổng kết cho tháng này.”

Không dùng thông báo “Không có dữ liệu” nếu thực tế là lỗi tải dữ liệu.

## 11. Loading State

- Dùng skeleton cho bố cục trang/bảng khi thời gian tải đáng kể.
- Dùng spinner nhỏ trên nút khi chỉ một hành động đang xử lý.
- Không khóa toàn bộ trang nếu chỉ một khu vực đang tải.
- Tránh nhấp nháy giữa empty và loading do trạng thái khởi tạo không rõ.

## 12. Error State

- Nói rõ thao tác nào thất bại.
- Có nút thử lại khi thao tác có thể lặp an toàn.
- Không lộ stack trace, SQL, token, API key hoặc thông tin nội bộ.
- Phân biệt lỗi xác thực, không đủ quyền, dữ liệu không hợp lệ và lỗi hệ thống khi có thông tin đáng tin cậy.
- Nếu request tạo bản ghi có kết quả không rõ do mất kết nối, tránh tự động gửi lại gây trùng; kiểm tra trạng thái hoặc dùng cơ chế idempotency nếu API hỗ trợ.

## 13. Pagination

- Dùng pagination hoặc tải thêm theo contract API.
- Hiển thị trang hiện tại và tổng số trang nếu backend cung cấp.
- Khi thay đổi bộ lọc, đưa trang về trang đầu.
- Không giả định tổng số bản ghi nếu API không trả về.

## 14. Student Selector

Dùng khi chọn học sinh trong form sự kiện hoặc trợ lý AI.

- Hiển thị tên và mã học sinh theo quyền và nhu cầu.
- Có tìm kiếm nếu danh sách dài.
- Hiển thị rõ học sinh đã chọn.
- Không chọn mặc định một học sinh nếu điều đó có thể khiến ghi nhầm.
- Trước khi submit, hiển thị lại đối tượng được tác động ở nơi phù hợp.

## 15. Score / Point Display

- Hiển thị rõ đơn vị và kỳ tính điểm.
- Điểm chưa xác minh phải hiện “Chưa xác minh”, không phải 0.
- Phân biệt tổng điểm đã xác nhận với dữ liệu tạm tính.
- Nếu tổng điểm không âm: số quà = `FLOOR(tổng điểm / 10)`, số dư = `tổng điểm % 10`.
- Nếu tổng điểm âm: số quà = 0; số dư không áp dụng.
- Không tính điểm bằng AI; phép tính phải do logic xác định thực hiện.
- Không gán màu mang tính phán xét cho điểm học sinh.

## 16. AI Draft Panel

Các phần:
- Nhãn “Bản nháp do AI đề xuất”.
- Tóm tắt dữ liệu đầu vào được dùng.
- Nội dung có thể chỉnh sửa.
- Hành động duyệt/từ chối nếu trạng thái và quyền cho phép.
- Cảnh báo nếu dữ liệu nguồn chưa xác minh.

Quy tắc:
- Không tự động duyệt.
- Không tạo chẩn đoán hoặc suy luận về hoàn cảnh gia đình/tính cách.
- Chỉ gửi dữ liệu tối thiểu cần thiết tới dịch vụ AI.
- Lưu kết quả chỉ sau phản hồi server.
- Nội dung đã chỉnh sửa cần được gửi đúng API contract trước khi duyệt.

## 17. Toast / Feedback

Dùng cho phản hồi ngắn sau thao tác:
- “Đã lưu.”
- “Đã cập nhật.”
- “Không thể lưu. Vui lòng thử lại.”
Chỉ hiển thị thông báo thành công sau khi server xác nhận. Lỗi cần giữ đủ thông tin để người dùng biết cách xử lý nhưng không tiết lộ nội bộ.

## 18. Accessibility và responsive

- Mọi control tương tác có label hoặc accessible name.
- Focus keyboard dễ thấy.
- Không dùng màu sắc làm tín hiệu duy nhất.
- Modal giữ focus và cho phép đóng bằng bàn phím theo chuẩn UI framework.
- Bảng phải có tiêu đề cột có ý nghĩa.
- Ở màn hình hẹp, ưu tiên nội dung và hành động chính; tránh làm form tràn ngang.
- Kích thước vùng bấm phù hợp với thao tác chuột và cảm ứng.

## 19. Quy ước kỹ thuật đề xuất

- Tạo component dùng chung trong thư mục UI components theo convention dự án.
- Tách component trình bày khỏi logic gọi API khi phù hợp.
- Dùng TypeScript type dựa trên API contract đã duyệt; tránh tạo type trùng khác nghĩa.
- Trạng thái server phải lấy từ API; không coi state local là trạng thái cuối cùng.
- Xử lý lỗi API tập trung và thống nhất thông báo.
- Không chứa secret trong biến môi trường có prefix public hoặc bundle client.
- Tên component và thư mục cần tuân theo quy ước codebase được thống nhất trước khi triển khai.

## 20. Checklist nghiệm thu component

- [ ] Có trạng thái mặc định, hover, focus và disabled phù hợp.
- [ ] Có loading/error/empty khi thành phần tải dữ liệu.
- [ ] Thông báo có nội dung tiếng Việt rõ ràng.
- [ ] Có nhãn cho input và thông báo lỗi theo trường.
- [ ] Không thể gửi lặp ngoài ý muốn.
- [ ] Không tự biến dữ liệu chưa xác minh thành 0.
- [ ] Không báo thành công trước khi server xác nhận.
- [ ] Không làm lộ dữ liệu nhạy cảm hoặc bí mật.
- [ ] Đối chiếu với API/DB contract hiện hành.
