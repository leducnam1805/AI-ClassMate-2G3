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
