# UI-001 — UI/API/Database Contract Audit

- **Dự án:** AI ClassMate 2G3
- **Task:** UI-001 — Đối chiếu tài liệu trước khi code
- **Phiên bản:** 1.0
- **Trạng thái:** Đã rà soát tài liệu đang có; còn các điểm chặn cần thống nhất trước khi triển khai API/UI thật.
- **Tài liệu đã đối chiếu:** UI Design v1, UI Implementation Plan, `AI_ClassMate_2G3_API_Design_V1.md`, bộ API-per-endpoint, Database Design V1, System Architecture V1, Security Design V1 và danh sách quy tắc chưa xác nhận.

## 1. Kết luận

**Chưa nên bắt đầu code các luồng nghiệp vụ thật ngay.** Bộ tài liệu đã có nền tảng tốt, nhưng master API Design và bộ tài liệu API tách theo endpoint không thống nhất hoàn toàn về đường dẫn, request/response, trạng thái và endpoint được hỗ trợ.

Để tránh triển khai hai hợp đồng API khác nhau, đề xuất dùng `AI_ClassMate_2G3_API_Design_V1.md` làm **baseline tạm thời** vì đây là tài liệu API tổng hợp được UI Implementation Plan viện dẫn. Bộ endpoint riêng cần được đối chiếu và chỉnh theo baseline sau khi người phụ trách dự án chấp thuận. Đây là đề xuất quản lý tài liệu, không phải khẳng định rằng các API đã được triển khai.

## 2. Các sai lệch cụ thể cần xử lý

| ID | Mức độ | Vấn đề | Baseline trong API Design tổng hợp | Bộ endpoint riêng / UI Design | Hướng xử lý đề xuất |
|---|---|---|---|---|---|
| AUD-001 | Blocker | Danh sách học sinh | `GET /api/students?classId=...` | Có tài liệu `GET /api/classes/{classId}/students`; UI cũng đang ghi route này | Chọn một route chuẩn. Đề xuất giữ route tổng hợp `GET /api/students` với query `classId`, cập nhật UI và endpoint pack theo route này |
| AUD-002 | Blocker | Tạo học sinh | `POST /api/students`, body có `classId`, `studentCode`, `displayName` | Endpoint riêng dùng `POST /api/classes/{classId}/students`, body chỉ có `studentCode` | Chốt các trường dữ liệu được lưu và route; không triển khai cả hai kiểu cùng lúc nếu chưa có quyết định |
| AUD-003 | Blocker | Tiêu chí hành vi | `GET/POST /api/behavior-criteria` | Endpoint riêng dùng `/api/criteria`; UI ghi `/criteria` | Chọn `/api/behavior-criteria` làm route chuẩn tạm thời; cập nhật UI và endpoint pack |
| AUD-004 | Blocker | Duyệt tiêu chí | API tổng hợp mô tả việc xác nhận thay đổi trong `POST /api/behavior-criteria`, nhưng không định nghĩa route approve riêng rõ ràng | Bộ endpoint riêng có `POST /api/criteria/{criterionId}/approve`; UI dùng route approve | Bổ sung/chốt endpoint duyệt tiêu chí và schema trước khi code; không tự suy diễn cách duyệt |
| AUD-005 | Blocker | Tạo bản nháp AI | `POST /api/students/{studentId}/comments/draft` | Endpoint riêng dùng `POST /api/ai-comments/drafts`; UI ghi `/api/ai/comments/draft` | Chốt một route; đề xuất giữ route gắn với học sinh trong API tổng hợp, hoặc cập nhật master nếu chọn route drafts |
| AUD-006 | High | Sửa bản nháp AI | `PATCH /api/comments/{commentId}` | UI Design chưa nêu rõ endpoint chỉnh sửa | Bổ sung vào luồng UI và bảo đảm API có body/validation/versioning rõ ràng |
| AUD-007 | High | Tạo lớp | API tổng hợp có `GET /api/classes`, `GET /api/classes/{classId}`, không mô tả `POST /api/classes` trong phần endpoint chính | Bộ endpoint riêng có `POST /api/classes` | Xác định tạo lớp có nằm trong MVP không; nếu không, tạo lớp ban đầu bằng seed/admin và bỏ nút tạo lớp khỏi UI |
| AUD-008 | High | Vô hiệu hóa sự kiện nhập nhầm | API tổng hợp có `POST /api/behavior-events/{eventId}/void` | UI Design chưa mô tả thao tác này | Xác định có đưa vào MVP; nếu có, bổ sung thiết kế UI, quyền, lý do và audit log |
| AUD-009 | High | Trạng thái tiêu chí | API tổng hợp dùng `CONFIRMED`, `PENDING_CONFIRMATION`, `INACTIVE` và field `ruleStatus` | Endpoint riêng dùng `DRAFT`, `PENDING_CONFIRMATION`, `APPROVED`, `RETIRED`, field `status` | Chốt enum và cách ánh xạ nhãn UI; không trộn hai bộ trạng thái |
| AUD-010 | High | Envelope và pagination | API tổng hợp mô tả success envelope `data` object và danh sách thường có `items`, `page`, `pageSize`, `total` | Một số endpoint riêng trả `data` là array trực tiếp và meta pagination ở `meta` | Chuẩn hóa một response envelope, pagination và lỗi dùng chung; tạo type TypeScript từ contract được chốt |
| AUD-011 | High | Tên/mức độ riêng tư dữ liệu học sinh | API tổng hợp cho phép `displayName` và trả tên hiển thị phù hợp quyền | Endpoint riêng mặc định chỉ dùng `studentCode`, không trả tên thật trong demo | Chốt chính sách hiển thị: demo dùng mã giả; dữ liệu thật chỉ hiển thị tên khi được phép và thực sự cần thiết |
| AUD-012 | Medium | Dashboard | UI Design đề xuất thẻ số liệu tổng hợp nhưng chưa có endpoint dashboard trong API tổng hợp | Chưa có contract endpoint dashboard riêng | MVP có thể tổng hợp từ các API đã có nếu hiệu năng/logic phù hợp; nếu cần endpoint tổng hợp, bổ sung API Design trước khi code |
| AUD-013 | Medium | Tạo/duyệt tiêu chí | API tổng hợp chưa chỉ rõ route approve riêng và cơ chế version/effective date đầy đủ | Bộ endpoint riêng mô tả version bất biến, effective date và audit | Chốt quy tắc versioning; không sửa tiêu chí đã dùng trong sự kiện lịch sử theo cách làm thay đổi kết quả cũ |
| AUD-014 | Medium | API classes/students trong UI docs | API tổng hợp quy định query `page`, `pageSize`, `q`, `activeOnly`/`classId` | Một số endpoint riêng dùng `active`, tìm theo code only và response khác | Đồng bộ query params và response fields trước khi sinh type hoặc mock data |

## 3. Các quy tắc nghiệp vụ đang là rào chắn

Các điểm sau được ghi nhận là **CHỜ XÁC NHẬN**, không tự quyết định trong UI/API:

- Đơn vị và giới hạn điểm cộng tích cực.
- “Đánh lọn” so với “Đánh bạn”.
- Mức trừ chính thức cho “không tập trung” khi dữ liệu có cả -1 và -3.
- Tiêu chí “viết trước vở tập viết”.
- Điều kiện “Xuất sắc tháng”.
- Ai được nhập, sửa, xác nhận sự kiện và chốt/mở lại tháng.
- Trường nào bắt buộc phải có trước khi chốt, cách xử lý các ô trống lịch sử.

Các quy tắc đã xác nhận cần giữ nguyên:
- Ô điểm trống là chưa xác minh, không phải 0.
- “Vi phạm cờ đỏ” = -10.
- Một sự việc có cả “nói chuyện” và “nói leo” là -2 tổng cộng, không đếm trùng cùng một sự việc.
- Tổng điểm không âm: số quà = `FLOOR(tổng điểm / 10)`, số dư = `tổng điểm % 10`.
- Tổng điểm âm: 0 quà; số dư không áp dụng.
- AI chỉ tạo bản nháp; giáo viên duyệt. AI không tính điểm hoặc chốt tháng.

## 4. Đối chiếu kiến trúc và bảo mật

Các quyết định nền tảng đang thống nhất:
- Next.js + TypeScript + Tailwind CSS.
- Next.js Route Handlers/server-side application services cho MVP.
- PostgreSQL là database mục tiêu.
- Modular monolith; không cần tách Spring Boot ở giai đoạn MVP theo kiến trúc hiện tại.
- Không kết nối PostgreSQL trực tiếp từ trình duyệt.
- Xác thực và kiểm tra quyền phải ở server; không tin `role`, `teacherId` hoặc trạng thái duyệt do client gửi.
- API key AI chỉ ở server.
- Mọi thao tác xác nhận/duyệt/từ chối/mở lại/thay đổi quy tắc cần audit theo contract bảo mật.

**Điểm chưa chốt:** cơ chế đăng nhập/phiên, ma trận quyền cuối cùng, công nghệ truy cập dữ liệu/validation, nhà cung cấp AI và chính sách dữ liệu của nhà cung cấp. Có thể làm giao diện với dữ liệu giả trước, nhưng không đưa dữ liệu học sinh thật lên môi trường chưa có xác thực phù hợp.

## 5. Kế hoạch đóng các điểm chặn

1. Chốt master API Design là nguồn chuẩn tạm thời hay quyết định cập nhật master theo endpoint pack.
2. Chọn một route cho danh sách/tạo học sinh, tiêu chí và tạo nhận xét AI.
3. Chốt enum trạng thái, response envelope, pagination và error format.
4. Bổ sung contract duyệt tiêu chí và quyết định có hỗ trợ tạo lớp/vô hiệu hóa sự kiện trong MVP hay không.
5. Cập nhật các tài liệu UI và endpoint riêng theo quyết định.
6. Sau khi tài liệu nhất quán, thực hiện UI-002 kiểm tra repository và môi trường code hiện có.

## 6. Trạng thái UI-001

- [x] Đã rà soát master API Design, endpoint pack, UI Design, Database Design, Architecture, Security và quy tắc chưa xác nhận.
- [x] Đã lập danh sách sai lệch có mã AUD-001 đến AUD-014.
- [ ] Chưa khóa hợp đồng API cuối cùng vì cần quyết định thống nhất giữa hai bộ tài liệu.
- [ ] Chưa kiểm tra repository code thực tế; chưa thể kết luận dự án Next.js đã khởi tạo hay chưa.

**Kết luận:** UI-001 đã hoàn thành phần phát hiện và ghi nhận sai lệch; chưa thể đánh dấu hoàn tất hoàn toàn cho đến khi chốt hợp đồng API. Không nên bắt đầu các màn hình gọi API thật trước bước này.
