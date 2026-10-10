# AI ClassMate 2G3 — UI Design v1


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

## Trạng thái
Đây là bản thiết kế UI v1 để thảo luận và triển khai. Các màn hình/API có thể cần điều chỉnh sau khi đối chiếu với bộ API Design và Database Design hiện hành.


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
