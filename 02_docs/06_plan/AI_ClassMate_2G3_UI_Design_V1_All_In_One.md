# AI ClassMate 2G3 — UI Design v1


---

<!-- SOURCE FILE: 00_UI_Design_Convention.md -->

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


---

<!-- SOURCE FILE: 01_Dashboard.md -->

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


---

<!-- SOURCE FILE: 02_Student_List.md -->

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


---

<!-- SOURCE FILE: 03_Student_Profile.md -->

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


---

<!-- SOURCE FILE: 04_Behavior_Event_Management.md -->

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


---

<!-- SOURCE FILE: 05_Data_Review.md -->

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


---

<!-- SOURCE FILE: 06_Monthly_Summary.md -->

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


---

<!-- SOURCE FILE: 07_AI_Assistant.md -->

# UI Screen — Trợ lý AI / Nhận xét học sinh

## 1. Mục tiêu
Hỗ trợ giáo viên soạn bản nháp nhận xét hoặc gợi ý hỗ trợ dựa trên dữ liệu được phép sử dụng; giáo viên chịu trách nhiệm kiểm tra và quyết định cuối cùng.

## 2. Bố cục
- Chọn học sinh và tháng/kỳ (nếu endpoint yêu cầu).
- Tóm tắt dữ liệu nguồn đang được sử dụng; chỉ hiển thị trường cần thiết.
- Khu vực yêu cầu tạo nhận xét/gợi ý.
- Khu vực kết quả có nhãn nổi bật “BẢN NHÁP DO AI ĐỀ XUẤT”.
- Trường chỉnh sửa nội dung.
- Nút: Tạo bản nháp, Duyệt, Từ chối. Chỉ hiển thị khi có endpoint và trạng thái tương ứng.

## 3. Quy trình
1. Giáo viên chọn đúng học sinh/kỳ.
2. UI cho biết dữ liệu đầu vào có thiếu hoặc chưa xác minh hay không.
3. Giáo viên yêu cầu tạo bản nháp.
4. Server gọi AI; API key chỉ nằm ở server.
5. UI hiển thị bản nháp, nguồn/ngữ cảnh phù hợp và cảnh báo cần kiểm tra.
6. Giáo viên sửa nội dung và duyệt hoặc từ chối.
7. Chỉ nội dung đã duyệt mới được coi là nhận xét chính thức.

## 4. Giới hạn an toàn
- Không chẩn đoán sức khỏe/tâm lý.
- Không suy luận hoàn cảnh gia đình, phẩm chất hoặc ý định của học sinh.
- Không dùng từ ngữ làm nhục, gán nhãn cố định hoặc so sánh hạ thấp học sinh.
- Ưu tiên mô tả hành vi quan sát được, tiến bộ cụ thể và gợi ý hỗ trợ tích cực.
- Nếu dữ liệu đầu vào chưa xác minh, AI không được trình bày giả định như sự thật.
- Không gửi nhiều dữ liệu cá nhân hơn mức cần thiết đến nhà cung cấp AI.

## 5. API liên quan dự kiến
- `POST /ai/comments/draft`
- `POST /ai/comments/{commentId}/approve`
- `POST /ai/comments/{commentId}/reject`

Đối chiếu đường dẫn thực tế, request/response và trạng thái trong API Design.

## 6. Trạng thái
Idle, generating, draft ready, generation failed, edited, approved, rejected. Chỉ dùng trạng thái khớp contract backend.

## 7. Tiêu chí nghiệm thu
- Người dùng nhận biết ngay đâu là bản nháp AI.
- Không tự động duyệt/phát hành.
- Có thể chỉnh sửa trước khi duyệt.
- Lỗi từ AI không làm mất dữ liệu đã nhập.
- Không có API key hoặc thông tin bí mật trong bundle client.


---

<!-- SOURCE FILE: 08_Settings_and_Criteria.md -->

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


---

<!-- SOURCE FILE: 09_UI_Component_Design.md -->

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


---

<!-- SOURCE FILE: README.md -->

# AI ClassMate 2G3 — UI Design

## Mục đích
Bộ tài liệu này mô tả thiết kế giao diện cho MVP AI ClassMate 2G3, làm cơ sở để triển khai Next.js + TypeScript + Tailwind CSS và đối chiếu với API/Database Design hiện có.

## Nguyên tắc
- Giao diện phục vụ giáo viên chủ nhiệm; ưu tiên thao tác nhanh, dễ kiểm tra và hạn chế nhập liệu sai.
- Không tự suy diễn quy tắc nghiệp vụ chưa được xác nhận. Những điểm còn thiếu được đánh dấu **CHỜ XÁC NHẬN**.
- Điểm, số quà và số dư được tính bằng logic xác định ở phía ứng dụng/server; AI chỉ tạo bản nháp nhận xét hoặc gợi ý hỗ trợ.
- Giáo viên phải xem lại, chỉnh sửa khi cần và xác nhận trước khi dùng nhận xét AI.
- Ô điểm để trống nghĩa là **chưa xác minh**, không tự hiểu là 0.
- Dữ liệu demo/tài liệu công khai dùng mã giả như `HS001`; không đưa dữ liệu định danh thật vào ảnh chụp màn hình hoặc bản demo.
- Không tạo bảng xếp hạng công khai theo từng học sinh.

## Danh sách tài liệu
1. `00_UI_Design_Convention.md` — quy ước chung.
2. `01_Dashboard.md` — tổng quan lớp.
3. `02_Student_List.md` — danh sách học sinh.
4. `03_Student_Profile.md` — hồ sơ học sinh.
5. `04_Behavior_Event_Management.md` — ghi nhận và xử lý sự kiện hành vi.
6. `05_Data_Review.md` — rà soát dữ liệu chưa đầy đủ / bất thường.
7. `06_Monthly_Summary.md` — tổng kết tháng.
8. `07_AI_Assistant.md` — tạo và duyệt bản nháp nhận xét AI.
9. `08_Settings_and_Criteria.md` — tiêu chí, quy tắc và cấu hình liên quan.
10. `09_UI_Component_Design.md` — quy chuẩn component dùng chung.

## Trạng thái
Đây là bản thiết kế UI v1 để thảo luận và triển khai. Các màn hình/API có thể cần điều chỉnh sau khi đối chiếu với bộ API Design và Database Design hiện hành.


---

<!-- SOURCE FILE: UI_Implementation_Plan.md -->

# AI ClassMate 2G3 — UI Implementation Plan V1.0

- **Phiên bản:** 1.0
- **Trạng thái:** Kế hoạch triển khai đề xuất — cần đối chiếu với API Design, Database Design và System Architecture hiện hành trước khi code.
- **Mục tiêu:** Chuyển bộ UI Design thành các task có thứ tự, phụ thuộc, tiêu chí nghiệm thu và kiểm thử rõ ràng.
- **Phạm vi MVP:** Ứng dụng web hỗ trợ giáo viên chủ nhiệm quản lý lớp, học sinh, sự kiện hành vi, rà soát dữ liệu, tổng kết tháng và bản nháp nhận xét AI.

## 1. Nguyên tắc triển khai

1. **Documentation-First:** Tài liệu API, DB, kiến trúc và quy tắc nghiệp vụ là cơ sở triển khai. Nếu phát hiện mâu thuẫn, cập nhật tài liệu trước khi tự ý đổi contract.
2. **UI không thay thế backend:** Client hiển thị trạng thái và kiểm tra dữ liệu cơ bản; server xác thực quyền, kiểm tra dữ liệu và quyết định trạng thái cuối cùng.
3. **Tính điểm bằng logic xác định:** Không dùng AI để tính điểm, số quà, số dư hoặc quyết định duyệt.
4. **Dữ liệu thiếu không đồng nghĩa với 0:** Giá trị điểm để trống/chưa xác minh phải được đưa vào luồng rà soát.
5. **AI chỉ tạo bản nháp:** Giáo viên xem lại, chỉnh sửa và duyệt; không tự động phát hành.
6. **Bảo vệ dữ liệu học sinh:** Dùng dữ liệu giả trong môi trường demo; chỉ hiển thị dữ liệu cần thiết; không đưa secret vào client.
7. **Làm theo vertical slice:** Hoàn thành từng luồng từ giao diện → API → phản hồi/trạng thái → kiểm thử, thay vì chỉ dựng giao diện tĩnh cho tất cả màn hình.

## 2. Phạm vi và ngoài phạm vi

### Trong phạm vi MVP
- Khung ứng dụng, điều hướng và trạng thái dùng chung.
- Xem lớp và danh sách học sinh.
- Xem/sửa hồ sơ học sinh theo API và quyền đã xác định.
- Ghi nhận, xem, xác nhận và từ chối sự kiện hành vi.
- Xem và xử lý các vấn đề cần rà soát.
- Xem, tính lại, duyệt và mở lại tổng kết tháng nếu nghiệp vụ/quyền cho phép.
- Tạo bản nháp nhận xét AI, chỉnh sửa, duyệt hoặc từ chối.
- Xem/quản lý tiêu chí theo contract hiện hành.
- Xử lý loading, empty, error, validation, permission denied.
- Kiểm thử luồng nghiệp vụ, quyền truy cập và các trường hợp dữ liệu chưa xác minh.

### Ngoài phạm vi cho đến khi được xác nhận
- Bất kỳ quy tắc điểm hoặc danh hiệu tháng chưa được giáo viên xác nhận.
- Phân tích/chẩn đoán tâm lý, suy luận tính cách hoặc hoàn cảnh gia đình.
- Bảng xếp hạng công khai học sinh.
- Các màn hình hoặc endpoint chưa có trong API Design được duyệt.
- Tích hợp bên ngoài chưa nằm trong kiến trúc MVP.

## 3. Điều kiện trước khi bắt đầu code

- [ ] Đã đưa bộ UI Design vào thư mục `UI design`.
- [ ] Đã đưa `09_UI_Component_Design.md` vào cùng thư mục.
- [ ] Xác định được tài liệu API Design, Database Design, System Architecture và Security Design là các bản đang được dùng.
- [ ] Đối chiếu chính xác method, path, query, request body, response body, error format và enum của API.
- [ ] Xác nhận các quy tắc nghiệp vụ đang còn mở hoặc ghi rõ là chưa triển khai.
- [ ] Có môi trường phát triển và dữ liệu giả để kiểm thử.
- [ ] Có thống nhất về package manager, linter, formatter, test runner và quy ước tên file của repository.

Nếu một API được UI cần dùng nhưng chưa tồn tại trong API Design, ghi nhận đó là **API gap** và cập nhật API Design trước; không âm thầm tự phát minh endpoint.

## 4. Thứ tự triển khai và task

### Phase 0 — Rà soát và khóa contract

#### UI-001 — Đối chiếu tài liệu
**Mục tiêu:** Đảm bảo UI, API, DB, bảo mật và nghiệp vụ không mâu thuẫn.

**Công việc**
- So khớp màn hình với endpoint.
- So khớp field UI với schema API/DB.
- Lập danh sách API gap, enum chưa rõ và quy tắc nghiệp vụ chưa xác nhận.
- Xác định những hành động cần quyền hoặc xác nhận bổ sung.

**Phụ thuộc:** Không.

**Nghiệm thu**
- Mỗi màn hình có danh sách API liên quan.
- Mỗi field nhập/hiển thị có nguồn dữ liệu xác định.
- Không còn path/body/enum do suy đoán được coi là contract chính thức.
- Các điểm chưa rõ được ghi thành câu hỏi/quyết định cần xác nhận.

#### UI-002 — Chuẩn bị môi trường và quy ước code
**Mục tiêu:** Thống nhất cách chạy, kiểm tra và tổ chức mã nguồn.

**Công việc**
- Kiểm tra cấu trúc Next.js App Router + TypeScript + Tailwind CSS hiện tại.
- Chốt package manager và các lệnh dev/build/lint/typecheck/test.
- Chốt cấu trúc thư mục theo repository thực tế.
- Chuẩn bị `.env.example` không chứa secret thật.
- Xác nhận cách cấu hình base URL và gọi API phía server/client theo kiến trúc đã chọn.

**Phụ thuộc:** UI-001.

**Nghiệm thu**
- Người phát triển khác có thể chạy ứng dụng theo hướng dẫn.
- Secret không xuất hiện trong mã nguồn hoặc bundle client.
- Các lệnh kiểm tra cơ bản chạy được.

### Phase 1 — Nền tảng UI dùng chung

#### UI-003 — App Shell và điều hướng
**Công việc**
- Tạo layout chính, Sidebar, Header, Page Header và vùng nội dung.
- Tạo trạng thái menu đang chọn.
- Đảm bảo bố cục phù hợp desktop và tablet.
- Chỉ hiển thị mục điều hướng được hỗ trợ; việc bảo vệ dữ liệu vẫn phải được thực hiện ở server/API.

**Phụ thuộc:** UI-002.

**Nghiệm thu**
- Các trang dùng chung layout nhất quán.
- Điều hướng không dẫn đến màn hình chưa được triển khai mà không có thông báo.
- Màn hình hẹp vẫn sử dụng được các thao tác chính.

#### UI-004 — Component dùng chung
**Công việc**
- Button, Input, Textarea, Select, Date/Time control nếu cần.
- DataTable, Search/Filter Bar, Pagination.
- Status Badge, Alert, Modal/Confirmation Dialog.
- Empty State, Loading/Skeleton, Error State, Toast/Feedback.
- Student Selector.
- AI Draft Panel và Score Display khi đã xác định data contract.

**Phụ thuộc:** UI-003.

**Nghiệm thu**
- Component có trạng thái disabled/loading/error phù hợp.
- Form có label và lỗi theo trường.
- Không báo thành công trước khi server xác nhận.
- Có thể tái sử dụng ở các màn hình mà không sao chép logic nghiệp vụ.

#### UI-005 — Lớp gọi API và xử lý lỗi
**Công việc**
- Tạo lớp/API client theo kiến trúc hiện hành.
- Chuẩn hóa cách truyền query/path/body theo contract.
- Chuẩn hóa xử lý lỗi, loading và dữ liệu trả về.
- Phân biệt lỗi validation, xác thực, quyền truy cập, not found và lỗi hệ thống nếu API cung cấp đủ thông tin.
- Không log token, secret hoặc dữ liệu học sinh không cần thiết.

**Phụ thuộc:** UI-001, UI-002.

**Nghiệm thu**
- UI không lặp lại logic gọi API theo nhiều kiểu khác nhau.
- Lỗi được chuyển thành thông báo thân thiện mà không lộ chi tiết nội bộ.
- TypeScript type khớp contract đã xác nhận.
- Kiểm thử được các trường hợp thành công và thất bại.

### Phase 2 — Luồng dữ liệu nền tảng

#### UI-006 — Danh sách lớp và chọn lớp
**API tham chiếu dự kiến:** `GET /classes` (đối chiếu contract thực tế).

**Công việc**
- Hiển thị lớp người dùng được phép truy cập.
- Chọn lớp hiện hành và giữ ngữ cảnh khi chuyển trang.
- Xử lý loading, empty, error và permission denied.

**Phụ thuộc:** UI-005.

**Nghiệm thu**
- Chỉ hiển thị lớp mà API cho phép.
- Chuyển lớp không để lại dữ liệu của lớp trước trên giao diện.
- Không có lớp thì có thông báo và hướng dẫn phù hợp.

#### UI-007 — Danh sách học sinh
**API tham chiếu dự kiến:** `GET /classes/{classId}/students`.

**Công việc**
- Bảng danh sách, tìm kiếm/lọc theo contract.
- Mở hồ sơ học sinh.
- Phân trang hoặc tải thêm theo API thực tế.

**Phụ thuộc:** UI-006.

**Nghiệm thu**
- Kết quả khớp response API và bộ lọc.
- Không tự lọc một tập dữ liệu chưa tải đầy đủ ở client rồi coi đó là toàn bộ kết quả.
- Dùng mã học sinh giả trong môi trường demo.

#### UI-008 — Hồ sơ học sinh
**API tham chiếu dự kiến:** `GET /students/{studentId}`, `PATCH /students/{studentId}`.

**Công việc**
- Hiển thị các trường đã có trong schema.
- Chế độ xem/sửa nếu được API và quyền hỗ trợ.
- Hiển thị sự kiện/tổng kết chỉ khi có endpoint và quan hệ dữ liệu được xác nhận.

**Phụ thuộc:** UI-007.

**Nghiệm thu**
- Không có field tự phát minh.
- Sửa dữ liệu có validation, trạng thái gửi và phản hồi từ server.
- Không hiển thị nội dung AI chưa duyệt như nhận xét chính thức.

### Phase 3 — Sự kiện và chất lượng dữ liệu

#### UI-009 — Danh sách và tạo sự kiện hành vi
**API tham chiếu dự kiến:** `GET /behavior-events`, `POST /behavior-events`.

**Công việc**
- Danh sách sự kiện và bộ lọc được API hỗ trợ.
- Form tạo sự kiện dựa trên request schema.
- Chọn học sinh, thời điểm, tiêu chí và mô tả nếu schema cho phép.
- Chặn submit lặp trong lúc request đang xử lý.

**Phụ thuộc:** UI-007, UI-005.

**Nghiệm thu**
- Không cho chọn tiêu chí chưa được duyệt nếu quy tắc backend cấm.
- Không tự cho nhập điểm tùy ý nếu điểm lấy từ tiêu chí.
- Sau lỗi, giữ dữ liệu nhập hợp lý và hiển thị cách xử lý.
- Không ghi trùng do bấm nút nhiều lần trong một lần gửi.

#### UI-010 — Chi tiết, xác nhận và từ chối sự kiện
**API tham chiếu dự kiến:** `GET /behavior-events/{eventId}`, `POST /behavior-events/{eventId}/confirm`, `POST /behavior-events/{eventId}/reject`.

**Công việc**
- Hiển thị thông tin gốc và trạng thái.
- Thao tác xác nhận/từ chối theo quyền và trạng thái hiện tại.
- Xác nhận trước thao tác; nhập lý do nếu API yêu cầu.

**Phụ thuộc:** UI-009.

**Nghiệm thu**
- Không cho xác nhận bản ghi đã được xử lý.
- Trạng thái UI chỉ cập nhật theo phản hồi server.
- Quy tắc đã xác nhận được tuân thủ: “Vi phạm cờ đỏ” = -10; một sự việc có “nói chuyện” và “nói leo” là -2 tổng cộng, không đếm trùng.
- Quy tắc còn chưa chốt không bị áp dụng mặc định.

#### UI-011 — Rà soát dữ liệu
**API tham chiếu dự kiến:** `GET /review-issues`, `POST /review-issues/{issueId}/resolve`.

**Công việc**
- Danh sách vấn đề và bộ lọc.
- Chi tiết vấn đề và điều hướng đến dữ liệu liên quan.
- Giải quyết vấn đề theo contract.

**Phụ thuộc:** UI-005, UI-009.

**Nghiệm thu**
- Giá trị chưa xác minh được biểu thị rõ, không đổi thành 0.
- Không cho đóng vấn đề khi chưa nhận phản hồi thành công.
- Giáo viên hiểu lý do cần rà soát và bước tiếp theo.

### Phase 4 — Tổng kết tháng

#### UI-012 — Danh sách và chi tiết tổng kết
**API tham chiếu dự kiến:** `GET /monthly-summaries`, `GET /monthly-summaries/{summaryId}`.

**Công việc**
- Chọn tháng và lớp theo contract.
- Hiển thị dữ liệu tổng kết, trạng thái và cảnh báo dữ liệu thiếu.
- Không tạo bảng xếp hạng công khai.

**Phụ thuộc:** UI-008, UI-010, UI-011.

**Nghiệm thu**
- Chỉ hiển thị số liệu server cung cấp hoặc tính toán theo quy tắc đã duyệt.
- Có cảnh báo khi dữ liệu chưa đủ.
- Không tự áp dụng tiêu chí “Xuất sắc tháng” khi chưa xác nhận.

#### UI-013 — Tính lại, duyệt và mở lại tổng kết
**API tham chiếu dự kiến:** `POST /monthly-summaries/recalculate`, `POST /monthly-summaries/{summaryId}/approve`, `POST /monthly-summaries/{summaryId}/reopen`.

**Công việc**
- Tạo hành động tính lại và hiển thị kết quả server.
- Duyệt/mở lại theo quyền, trạng thái và điều kiện nghiệp vụ.
- Xác nhận các thao tác quan trọng.

**Phụ thuộc:** UI-012.

**Nghiệm thu**
- Không tự coi tính lại là duyệt/chốt.
- Không cho duyệt khi server báo chưa đủ điều kiện.
- Quy tắc đã xác nhận: tổng điểm không âm thì số quà = `FLOOR(tổng điểm / 10)`, số dư = `tổng điểm % 10`; tổng điểm âm thì số quà = 0, số dư không áp dụng.
- Điểm chưa xác minh không bị mặc định là 0.

### Phase 5 — Trợ lý AI và tiêu chí

#### UI-014 — Tạo và duyệt bản nháp nhận xét AI
**API tham chiếu dự kiến:** `POST /ai/comments/draft`, `POST /ai/comments/{commentId}/approve`, `POST /ai/comments/{commentId}/reject`.

**Công việc**
- Chọn học sinh/kỳ và gửi yêu cầu tạo bản nháp.
- Hiển thị dữ liệu đầu vào đủ để giáo viên kiểm tra.
- Cho phép chỉnh sửa, duyệt hoặc từ chối theo contract.
- Xử lý lỗi provider/timeout mà không mất nội dung người dùng đã nhập.

**Phụ thuộc:** UI-008, UI-012, UI-005.

**Nghiệm thu**
- Bản nháp luôn được gắn nhãn rõ.
- Không tự động duyệt.
- API key chỉ ở server.
- Không chẩn đoán, gán nhãn tính cách hoặc suy luận hoàn cảnh gia đình.
- Giáo viên có thể xem lại và sửa trước khi duyệt.

#### UI-015 — Danh sách và duyệt tiêu chí
**API tham chiếu dự kiến:** `GET /criteria`, `POST /criteria`, `POST /criteria/{criterionId}/approve`.

**Công việc**
- Hiển thị tiêu chí và trạng thái theo enum thực tế.
- Tạo/đề xuất tiêu chí nếu request schema hỗ trợ.
- Xem thay đổi trước khi duyệt.

**Phụ thuộc:** UI-005.

**Nghiệm thu**
- Không áp dụng tiêu chí chưa được duyệt nếu backend yêu cầu duyệt.
- Không tự đặt mức điểm cho quy tắc còn chưa xác nhận.
- Thao tác theo đúng quyền và phản hồi server.

### Phase 6 — Hoàn thiện và phát hành MVP

#### UI-016 — Kiểm thử tích hợp và quyền truy cập
**Công việc**
- Kiểm thử các luồng chính từ UI đến API.
- Kiểm thử truy cập trái phép tới lớp/học sinh không thuộc phạm vi quyền.
- Kiểm thử lỗi mạng, API trả lỗi, dữ liệu rỗng và dữ liệu chưa xác minh.
- Kiểm thử submit lặp và thao tác với trạng thái đã xử lý.

**Phụ thuộc:** Các task màn hình tương ứng.

**Nghiệm thu**
- Không có lỗi nghiêm trọng về phân quyền hoặc lộ dữ liệu.
- Các trạng thái UI được kiểm tra.
- Quy tắc nghiệp vụ đã xác nhận có test tương ứng.

#### UI-017 — Accessibility, responsive và polish
**Công việc**
- Kiểm tra thao tác bàn phím và focus.
- Kiểm tra tablet/màn hình nhỏ.
- Kiểm tra nhãn form, tương phản và thông báo lỗi.
- Kiểm tra loading, empty, error và nội dung tiếng Việt.

**Phụ thuộc:** UI-003 đến UI-015.

**Nghiệm thu**
- Các luồng quan trọng có thể thực hiện không chỉ bằng chuột.
- Không có lỗi bố cục nghiêm trọng ở kích thước mục tiêu.
- Không dùng màu sắc làm tín hiệu duy nhất.

#### UI-018 — Hướng dẫn chạy và bàn giao
**Công việc**
- Cập nhật hướng dẫn cài đặt/chạy.
- Ghi các biến môi trường cần thiết bằng placeholder, không chứa secret.
- Ghi các chức năng đã hoàn thành, giới hạn và vấn đề còn mở.

**Phụ thuộc:** UI-016, UI-017.

**Nghiệm thu**
- Thành viên khác có thể chạy dự án theo hướng dẫn.
- Các giới hạn MVP và các quy tắc chờ xác nhận được ghi rõ.
- Không tuyên bố tính năng hoàn thành nếu chưa có test/nghiệm thu.

## 5. Ma trận phụ thuộc tóm tắt

| Task | Phụ thuộc chính |
|---|---|
| UI-001 | Không |
| UI-002 | UI-001 |
| UI-003 | UI-002 |
| UI-004 | UI-003 |
| UI-005 | UI-001, UI-002 |
| UI-006 | UI-005 |
| UI-007 | UI-006 |
| UI-008 | UI-007 |
| UI-009 | UI-005, UI-007 |
| UI-010 | UI-009 |
| UI-011 | UI-005, UI-009 |
| UI-012 | UI-008, UI-010, UI-011 |
| UI-013 | UI-012 |
| UI-014 | UI-005, UI-008, UI-012 |
| UI-015 | UI-005 |
| UI-016 | Các task luồng cần kiểm thử |
| UI-017 | UI-003 đến UI-015 |
| UI-018 | UI-016, UI-017 |

## 6. Định nghĩa hoàn thành (Definition of Done)

Một task chỉ được coi là hoàn thành khi:
- [ ] Đã triển khai theo tài liệu và contract được duyệt.
- [ ] Có loading/empty/error/validation/permission states phù hợp.
- [ ] Đã kiểm thử trường hợp thành công và ít nhất các lỗi quan trọng.
- [ ] Không có secret trong client.
- [ ] Không làm lộ dữ liệu ngoài phạm vi quyền.
- [ ] Không tự diễn giải dữ liệu chưa xác minh thành 0.
- [ ] Có xử lý chống submit lặp hoặc giải thích rõ giới hạn.
- [ ] Đã chạy các lệnh lint, typecheck, test/build tương ứng với repository.
- [ ] Tài liệu được cập nhật nếu phát sinh thay đổi contract.
- [ ] Người phụ trách nghiệp vụ duyệt các thay đổi có ảnh hưởng quy tắc.

## 7. Rủi ro và cách giảm thiểu

| Rủi ro | Cách giảm thiểu |
|---|---|
| UI gọi sai endpoint hoặc dùng sai schema | UI-001 đối chiếu contract trước khi code; type theo API đã duyệt |
| Quy tắc nghiệp vụ chưa rõ | Ghi rõ CHỜ XÁC NHẬN; không đưa vào luồng chính thức |
| Dữ liệu thiếu bị coi là 0 | Dùng trạng thái “Chưa xác minh”; kiểm thử dữ liệu thiếu |
| AI tạo nội dung sai hoặc không phù hợp | Chỉ tạo draft; giáo viên duyệt; giới hạn dữ liệu đầu vào |
| Gửi trùng sự kiện/thao tác | Khóa nút trong lúc gửi; dùng idempotency nếu backend hỗ trợ |
| Lộ dữ liệu học sinh | Phân quyền server-side; giảm thiểu dữ liệu; dữ liệu giả trong demo |
| Thay đổi API giữa chừng | Cập nhật API Design và type trước khi sửa UI |

## 8. Các quyết định nghiệp vụ còn mở

Các điểm sau phải được xác nhận trước khi triển khai chức năng phụ thuộc:
- Cách tính và giới hạn điểm tích cực.
- Mức trừ của các hành vi chưa rõ, gồm các thuật ngữ cần thống nhất.
- Tiêu chí “Xuất sắc tháng”.
- Quy trình chốt tháng, mở lại và quyền được thực hiện.
- Trường dữ liệu chính thức và quyền xem/sửa từng nhóm dữ liệu.
- Điều kiện chính xác để tổng kết được duyệt khi có dữ liệu chưa xác minh.

## 9. Thứ tự khởi động khuyến nghị

Không bắt đầu bằng việc dựng tất cả màn hình tĩnh. Thứ tự khởi động:

1. Hoàn tất UI-001: đối chiếu tài liệu và ghi lại gap.
2. Hoàn tất UI-002: kiểm tra môi trường dự án hiện có.
3. Làm UI-003, UI-004, UI-005: nền tảng giao diện và API.
4. Làm một luồng dọc hoàn chỉnh: danh sách học sinh → hồ sơ học sinh.
5. Tiếp tục sự kiện hành vi và rà soát dữ liệu.
6. Hoàn thiện tổng kết tháng.
7. Tích hợp trợ lý AI sau khi các dữ liệu nền và quyền đã rõ.
8. Kiểm thử toàn bộ trước khi tuyên bố MVP sẵn sàng.

**Lưu ý cuối:** Tên endpoint trong tài liệu này là tên tham chiếu từ bộ API Design hiện có trong quá trình lập kế hoạch. Trước khi code, phải đối chiếu với file API chính thức trong repository; nếu khác, cập nhật tài liệu này theo contract thực tế.
