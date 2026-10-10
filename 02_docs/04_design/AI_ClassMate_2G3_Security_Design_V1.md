# AI ClassMate 2G3 — Security Design V1.0

- **Mã tài liệu:** ACM2G3-SEC
- **Phiên bản:** 1.0
- **Trạng thái:** Bản thiết kế đề xuất — cần rà soát trước khi dùng dữ liệu thật
- **Ngày:** 2026-10-10
- **Tài liệu liên quan:** `AI_ClassMate_2G3_System_Architecture_V1.md`, `AI_ClassMate_2G3_API_Design_V1.md`, `AI_ClassMate_2G3_Database_Design_V1.md`

> Tài liệu này đặt ra các yêu cầu bảo mật cho MVP. Chưa được xem là bằng chứng hệ thống đã đáp ứng các yêu cầu đó. Không đưa dữ liệu định danh học sinh thật vào môi trường demo công khai.

---

## 1. Mục tiêu bảo mật

1. Chỉ người được phép mới có thể truy cập dữ liệu học sinh.
2. Bảo vệ dữ liệu khi truyền, lưu trữ, sao lưu và sử dụng với AI.
3. Ngăn sửa điểm, duyệt kết quả hoặc thay đổi quy tắc trái quyền.
4. Có khả năng truy vết các thao tác nghiệp vụ quan trọng.
5. Giảm thiểu dữ liệu thu thập và dữ liệu được gửi đến dịch vụ bên ngoài.
6. Có quy trình xử lý lỗi, lộ dữ liệu và khôi phục hệ thống.

## 2. Phân loại dữ liệu

| Nhóm | Ví dụ | Cách xử lý |
|---|---|---|
| Dữ liệu học sinh | Mã học sinh, tên hiển thị, lớp | Chỉ thu thập mức tối thiểu; giới hạn theo quyền |
| Dữ liệu thi đua | Sự kiện, điểm, cảnh báo, tổng kết | Hạn chế truy cập; ghi lịch sử thay đổi |
| Nhận xét giáo viên/AI | Bản nháp, nội dung đã duyệt | Chỉ người có quyền được xem/sửa/duyệt |
| Dữ liệu tài khoản | Email, vai trò, thông tin phiên | Không ghi secrets vào log; bảo vệ thông tin xác thực |
| Secrets | API key, database URL, session secret | Chỉ ở secret manager hoặc biến môi trường server-side |
| Dữ liệu kiểm thử | Học sinh giả lập | Dùng dữ liệu giả, không sao chép dữ liệu thật vào repo |

Không thu thập thông tin sức khỏe, hoàn cảnh gia đình hoặc thông tin nhạy cảm khác nếu không có mục tiêu rõ ràng và căn cứ phù hợp.

## 3. Xác thực (Authentication)

### Yêu cầu

- Trước khi sử dụng dữ liệu thật, mọi API đọc/ghi dữ liệu học sinh phải yêu cầu phiên đăng nhập hợp lệ.
- Không tin `teacherId`, `role` hoặc thông tin danh tính do client tự gửi.
- Xác định người dùng hiện tại từ phiên đã được xác thực ở server.
- Phiên hết hạn hoặc không hợp lệ phải bị từ chối.
- Không lưu mật khẩu dạng văn bản thuần nếu hệ thống tự quản lý mật khẩu.
- Ưu tiên nhà cung cấp xác thực đã được đánh giá phù hợp thay vì tự viết cơ chế mật khẩu/phiên từ đầu.
- Cookie phiên, nếu sử dụng, cần cấu hình `HttpOnly`, `Secure` trong HTTPS và `SameSite` phù hợp.

### Trạng thái MVP

`PENDING_DECISION`: Chưa chốt cơ chế đăng nhập cụ thể. Có thể phát triển giao diện bằng dữ liệu giả lập khi chưa có xác thực, nhưng không được coi đó là môi trường an toàn để dùng dữ liệu thật hoặc đưa lên Internet công khai.

## 4. Phân quyền (Authorization)

### Vai trò dự kiến

- `TEACHER`: Xem và quản lý dữ liệu thuộc lớp được phân công, ghi nhận sự kiện, rà soát và duyệt theo phạm vi quyền đã được xác nhận.
- `ADMIN`: Quản lý cấu hình/tài khoản theo phạm vi được cấp; không mặc định được xem mọi dữ liệu nếu không cần thiết.

Các vai trò trên là đề xuất ban đầu, cần xác nhận theo quy trình thực tế.

### Nguyên tắc

- Kiểm tra quyền ở server trên từng request, không chỉ ẩn nút ở giao diện.
- Kiểm tra quyền ở cấp tài nguyên và lớp; biết một `studentId` không có nghĩa là được phép xem hồ sơ.
- Từ chối mặc định nếu không xác định được quyền.
- Tách quyền nhập, xác nhận, duyệt tổng kết và quản lý quy tắc khi quy trình yêu cầu.
- Không cho người dùng tự nâng quyền bằng cách sửa request.
- Thao tác thay đổi quy tắc hoặc duyệt tổng kết phải có audit log.

## 5. Bảo vệ dữ liệu và quyền riêng tư

- Chỉ lưu trường dữ liệu cần cho chức năng đã xác định.
- Dùng mã giả lập như `HS001`, `HS002` trong tài liệu, ảnh chụp màn hình, seed demo và kiểm thử.
- Không công khai danh sách điểm hoặc bảng xếp hạng cá nhân.
- Chỉ xuất dữ liệu khi người dùng có quyền và có mục đích phù hợp.
- Hạn chế tải xuống file chứa dữ liệu học sinh; nếu có, ghi nhận thao tác xuất theo chính sách.
- Xác định thời hạn lưu dữ liệu và quy trình xóa/ẩn danh khi không còn cần thiết.
- Không đưa dữ liệu thật vào prompt AI nếu không cần cho nội dung nhận xét.
- Trước khi dùng AI provider bên ngoài, đánh giá điều khoản xử lý dữ liệu, nơi xử lý/lưu trữ, thời hạn lưu và tùy chọn không dùng dữ liệu cho huấn luyện nếu có.

## 6. An toàn tích hợp AI

### Quy tắc bắt buộc

1. AI chỉ được dùng để tạo bản nháp nhận xét hoặc gợi ý hỗ trợ.
2. AI không được tính điểm chính thức, thay đổi điểm, xác nhận quy tắc hoặc chốt tháng.
3. Chỉ gửi dữ liệu tối thiểu cần thiết; ưu tiên mã học sinh thay cho tên thật.
4. Không gửi dữ liệu nhạy cảm hoặc nội dung không cần thiết.
5. API key chỉ ở phía server; không đặt trong mã frontend, file công khai hoặc repository.
6. Xem đầu ra AI là nội dung chưa tin cậy: cần kiểm tra, giới hạn độ dài và lưu ở trạng thái `DRAFT`.
7. Giáo viên phải xem và duyệt trước khi nhận xét được coi là chính thức.
8. Xử lý timeout, lỗi quota và lỗi nhà cung cấp mà không làm mất dữ liệu nghiệp vụ đã lưu.
9. Giới hạn tần suất gọi AI và kiểm soát chi phí.
10. Không dùng nội dung học sinh để huấn luyện hoặc cải thiện mô hình nếu chưa có cơ sở, phê duyệt và thông báo phù hợp.

### Rủi ro nội dung

Prompt phải hướng dẫn AI:
- Chỉ sử dụng dữ kiện được cung cấp.
- Không suy đoán tính cách, chẩn đoán, hoàn cảnh gia đình hoặc động cơ.
- Dùng ngôn ngữ tôn trọng, khích lệ, phù hợp lứa tuổi.
- Nêu điểm mạnh và bước cải thiện cụ thể khi dữ liệu hỗ trợ.
- Không so sánh hạ thấp học sinh với bạn khác.

## 7. Bảo vệ ứng dụng và API

- Validate mọi input ở server.
- Dùng truy vấn có tham số hoặc data-access library an toàn; không nối chuỗi input thành SQL.
- Giới hạn kích thước request, độ dài nội dung nhận xét và kích thước file nhập.
- Kiểm soát loại file, kích thước file và nội dung trước khi nhập dữ liệu.
- Áp dụng rate limiting phù hợp, đặc biệt cho endpoint AI và đăng nhập.
- Chống CSRF khi mô hình xác thực/cookie yêu cầu.
- Dùng HTTPS khi triển khai.
- Không trả stack trace, SQL, đường dẫn nội bộ hoặc secrets trong response.
- Cấu hình CORS chặt chẽ nếu có nhiều origin; không mở rộng không cần thiết.
- Dùng security headers phù hợp với ứng dụng.
- Kiểm tra dependency và cập nhật bản vá bảo mật định kỳ.

## 8. Database và secrets

- PostgreSQL không được mở trực tiếp ra Internet nếu không có nhu cầu và biện pháp bảo vệ đã đánh giá.
- Tài khoản ứng dụng chỉ có quyền tối thiểu cần thiết.
- Không dùng tài khoản superuser trong ứng dụng.
- Dùng biến môi trường hoặc secret manager cho database URL, session secret và AI API key.
- Không commit `.env` chứa secrets; cung cấp `.env.example` chỉ với tên biến và giá trị giả.
- Hạn chế quyền đọc `audit_logs`.
- Dùng migration có phiên bản và kiểm tra trên database phát triển trước khi triển khai.
- Sao lưu định kỳ, bảo vệ quyền truy cập bản sao lưu và kiểm tra khả năng khôi phục.
- Không ghi mật khẩu, token, API key hoặc dữ liệu nhạy cảm vào log.

## 9. Audit logging

Ghi lại tối thiểu các hành động quan trọng:

- Tạo hoặc sửa dữ liệu học sinh.
- Tạo, xác nhận, từ chối hoặc vô hiệu hóa sự kiện thi đua.
- Thay đổi tiêu chí/mức điểm.
- Tính lại, duyệt hoặc mở lại tổng kết tháng.
- Tạo, sửa, duyệt hoặc từ chối nhận xét.
- Xuất dữ liệu khi tính năng xuất được triển khai.
- Thay đổi quyền hoặc tài khoản.

Mỗi log nên có người thực hiện, thời điểm, loại tài nguyên, ID tài nguyên, hành động, lý do nếu có và phần thay đổi cần thiết. Không đưa secrets hoặc dữ liệu thừa vào log.

Không cung cấp thao tác chỉnh sửa/xóa audit log cho người dùng ứng dụng thông thường. Nếu cần sửa sai, ghi một sự kiện mới giải thích điều chỉnh.

## 10. Logging và giám sát

- Dùng mã request để liên kết lỗi giữa các tầng.
- Log lỗi kỹ thuật đủ để điều tra nhưng không chứa nội dung riêng tư không cần thiết.
- Tách log kỹ thuật khỏi audit log nghiệp vụ.
- Theo dõi lỗi API, lỗi database, lỗi nhà cung cấp AI và số lần gọi AI.
- Không ghi toàn bộ prompt/response AI nếu nội dung có thể chứa dữ liệu học sinh; nếu buộc phải lưu để điều tra, cần chính sách truy cập và thời hạn lưu rõ ràng.

## 11. Sao lưu, khôi phục và xử lý sự cố

Trước khi sử dụng dữ liệu thật, cần xác định:

- Tần suất sao lưu.
- Thời gian lưu bản sao.
- Người có quyền khôi phục.
- Cách kiểm tra bản sao lưu không bị lỗi.
- Quy trình khôi phục thử trên môi trường riêng.
- Cách xử lý khi tài khoản bị chiếm, API key bị lộ hoặc dữ liệu bị truy cập trái phép.
- Người chịu trách nhiệm thông báo và thực hiện các nghĩa vụ liên quan theo quy định áp dụng.

Nếu phát hiện lộ API key, phải thu hồi/thay key, rà soát log và đánh giá ảnh hưởng. Không chỉ xóa key khỏi file hiện tại nếu key từng bị commit vào lịch sử repository.

## 12. Checklist trước khi dùng dữ liệu thật

- [ ] Cơ chế đăng nhập đã được chọn và kiểm thử.
- [ ] Quyền được kiểm tra ở server cho mọi endpoint.
- [ ] Người dùng chỉ truy cập lớp/dữ liệu thuộc phạm vi được phép.
- [ ] API key và database secrets không xuất hiện trong frontend/repository.
- [ ] PostgreSQL được bảo vệ bằng mạng và quyền truy cập phù hợp.
- [ ] HTTPS được bật trên môi trường triển khai.
- [ ] Dữ liệu demo đã được tách khỏi dữ liệu thật.
- [ ] Prompt AI chỉ chứa dữ liệu tối thiểu cần thiết.
- [ ] Đầu ra AI luôn ở trạng thái dự thảo trước khi giáo viên duyệt.
- [ ] Audit log hoạt động cho các thao tác quan trọng.
- [ ] Sao lưu và khôi phục đã được kiểm thử.
- [ ] Có quy trình xử lý sự cố và lộ dữ liệu.
- [ ] Đã rà soát quy định và chính sách liên quan đến dữ liệu trẻ em tại môi trường triển khai.

## 13. Rủi ro cần theo dõi

| Rủi ro | Biện pháp giảm thiểu |
|---|---|
| Người không có quyền xem dữ liệu học sinh | Xác thực và kiểm tra quyền server-side |
| AI tạo nhận xét sai hoặc thiên lệch | Chỉ tạo dự thảo, kiểm tra dữ kiện, giáo viên duyệt |
| Điểm bị sửa không có dấu vết | Audit log và lưu giá trị trước/sau |
| Dữ liệu trống bị hiểu thành 0 | Giữ `NULL`, tạo cảnh báo, chặn chốt khi ảnh hưởng |
| Lộ API key | Server-side secrets, xoay vòng key, kiểm tra repository |
| Lộ dữ liệu qua log/prompt | Tối thiểu hóa dữ liệu, lọc log, giới hạn quyền truy cập |
| Mất dữ liệu | Sao lưu và diễn tập khôi phục |
| Demo công khai lộ tên học sinh | Dùng dữ liệu giả lập hoặc đã ẩn danh |

## 14. Các quyết định còn mở

- [ ] Chọn nhà cung cấp xác thực.
- [ ] Chốt vai trò và quyền của giáo viên/quản trị viên.
- [ ] Chọn môi trường triển khai và cách quản lý secrets.
- [ ] Chọn AI provider sau khi đánh giá điều khoản dữ liệu.
- [ ] Chốt thời hạn lưu, sao lưu và xóa dữ liệu.
- [ ] Xác nhận quy trình xuất dữ liệu và quyền phê duyệt.
- [ ] Rà soát các yêu cầu pháp lý/chính sách áp dụng trước khi vận hành thật.

## 15. Nhật ký thay đổi

| Phiên bản | Ngày | Nội dung | Trạng thái |
|---|---|---|---|
| 1.0 | 2026-10-10 | Thiết kế yêu cầu xác thực, phân quyền, quyền riêng tư, AI safety, audit và phục hồi | Bản đề xuất |
