# AI ClassMate 2G3 — API Contract Reconciliation V1.1

- **Ngày:** 2026-10-10
- **Trạng thái:** Đề xuất chuẩn hóa để rà soát; chưa phải xác nhận API đã triển khai.
- **Mục tiêu:** Chọn một hợp đồng API nhất quán giữa API Design tổng hợp, API theo endpoint, Database Design và UI Design.
- **Nguồn ưu tiên đề xuất:** `AI_ClassMate_2G3_API_Design_V1.md` làm baseline nghiệp vụ/API; Database Design và SQL Schema là nguồn xác minh kiểu dữ liệu thực tế. Nếu hai nguồn mâu thuẫn, phải cập nhật tài liệu trước khi code.

## 1. Kết luận

Không nên dùng đồng thời master API Design và endpoint pack hiện tại vì chúng có khác biệt về path, request/response, trạng thái và kiểu ID. Tài liệu này đề xuất chuẩn hóa theo master API Design, đồng thời ưu tiên SQL Schema khi xác định kiểu ID và quan hệ dữ liệu.

**Không có endpoint nào trong tài liệu này được coi là đã triển khai.** Đây là hợp đồng đề xuất để chốt trước khi code.

## 2. Quy ước chung đề xuất

### 2.1 Base path và định dạng
- Base path: `/api`.
- JSON UTF-8.
- Timestamp: ISO 8601 có timezone; lưu và trả theo quy ước thống nhất trong backend.
- ID từ DB hiện là `BIGINT`; API serialize ID thành chuỗi thập phân, ví dụ `"101"`, để tránh sai số JavaScript. Không dùng UUID trong ví dụ/contract cho đến khi SQL Schema được đổi sang UUID.
- Danh sách dùng `page` (mặc định 1), `pageSize` (mặc định 20, tối đa 100).
- Query sort, nếu có, phải allow-list.
- Không trả stack trace, SQL, secrets hoặc dữ liệu học sinh không cần thiết.

### 2.2 Success envelope thống nhất
Tất cả endpoint trả dữ liệu theo một trong các dạng dưới đây; không trộn `data: []` với `data: { items: [] }` cho cùng loại collection.

Single resource:
```json
{
  "data": { "id": "101" },
  "meta": { "requestId": "req_example" }
}
```

Collection:
```json
{
  "data": {
    "items": [],
    "page": 1,
    "pageSize": 20,
    "total": 0
  },
  "meta": { "requestId": "req_example" }
}
```

Batch operation:
```json
{
  "data": {
    "items": [],
    "blockingIssues": [],
    "processedCount": 0
  },
  "meta": { "requestId": "req_example" }
}
```

### 2.3 Error envelope
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu gửi lên chưa hợp lệ.",
    "details": [
      { "field": "occurredAt", "reason": "REQUIRED" }
    ]
  },
  "meta": { "requestId": "req_example" }
}
```

HTTP code tối thiểu:
- `400 BAD_REQUEST`
- `401 UNAUTHENTICATED`
- `403 FORBIDDEN`
- `404 NOT_FOUND`
- `409 STATE_CONFLICT` hoặc `VERSION_CONFLICT`
- `422 VALIDATION_ERROR`
- `429 RATE_LIMITED`
- `500 INTERNAL_ERROR`
- `502 AI_PROVIDER_ERROR`
- `503 SERVICE_UNAVAILABLE`

### 2.4 Bảo mật và audit
- Xác thực và kiểm tra quyền ở server; không tin `teacherId`, `role`, hoặc trạng thái duyệt do client gửi.
- Mọi request phải được giới hạn theo lớp mà giáo viên được phép truy cập.
- State transitions phải được kiểm tra ở server và ghi audit log.
- Dùng `Idempotency-Key` cho thao tác tạo/AI có rủi ro gửi lặp nếu triển khai hỗ trợ.
- Dùng version/updatedAt precondition cho sửa bản ghi nếu cần tránh ghi đè dữ liệu mới hơn.
- Không kết nối PostgreSQL trực tiếp từ browser; AI API key chỉ ở server.

## 3. Danh mục endpoint chuẩn đề xuất

| Method | Endpoint chuẩn | Ghi chú |
|---|---|---|
| GET | `/api/classes` | Danh sách lớp được phép truy cập |
| GET | `/api/classes/{classId}` | Chi tiết lớp |
| GET | `/api/students` | Danh sách học sinh; `classId` là query bắt buộc |
| POST | `/api/students` | Tạo học sinh; body có `classId`, `studentCode`, `displayName` |
| GET | `/api/students/{studentId}` | Hồ sơ học sinh |
| PATCH | `/api/students/{studentId}` | Sửa các trường được phép |
| GET | `/api/behavior-criteria` | Danh sách tiêu chí |
| POST | `/api/behavior-criteria` | Tạo tiêu chí nháp; cập nhật tiêu chí hiện có cần endpoint riêng nếu được chấp thuận |
| **CHƯA CHỐT** | `/api/behavior-criteria/{criterionId}/approve` | Master chưa mô tả rõ route duyệt; cần bổ sung contract trước code |
| POST | `/api/behavior-events` | Tạo sự kiện ở trạng thái nháp/chờ rà soát |
| GET | `/api/behavior-events` | Danh sách sự kiện |
| GET | `/api/behavior-events/{eventId}` | Chi tiết sự kiện |
| POST | `/api/behavior-events/{eventId}/confirm` | Xác nhận sự kiện |
| POST | `/api/behavior-events/{eventId}/reject` | Từ chối sự kiện |
| POST | `/api/behavior-events/{eventId}/void` | Vô hiệu hóa sự kiện nhập nhầm; yêu cầu lý do và audit |
| GET | `/api/review-issues` | Danh sách vấn đề cần rà soát |
| POST | `/api/review-issues/{issueId}/resolve` | Giải quyết vấn đề |
| GET | `/api/monthly-summaries` | Danh sách tổng kết; `classId`, `year`, `month` bắt buộc |
| GET | `/api/monthly-summaries/{summaryId}` | Chi tiết tổng kết |
| POST | `/api/monthly-summaries/recalculate` | Tính lại theo lớp/tháng; không tự duyệt |
| POST | `/api/monthly-summaries/{summaryId}/approve` | Duyệt tổng kết |
| POST | `/api/monthly-summaries/{summaryId}/reopen` | Mở lại tổng kết; lý do bắt buộc |
| POST | `/api/students/{studentId}/comments/draft` | Tạo bản nháp nhận xét AI |
| PATCH | `/api/comments/{commentId}` | Chỉnh sửa bản nháp |
| POST | `/api/comments/{commentId}/approve` | Duyệt nhận xét |
| POST | `/api/comments/{commentId}/reject` | Từ chối nhận xét |
| GET | `/api/audit-logs` | Tra cứu audit log; chỉ người có quyền |

### Endpoint chưa đưa vào baseline chuẩn
- `POST /api/classes`: chưa nằm trong endpoint chính của master API Design. Đề xuất không đưa vào MVP cho đến khi xác nhận có nhu cầu tạo lớp từ UI.
- `GET/POST /api/classes/{classId}/students`: thay bằng `/api/students?classId=...` và `POST /api/students` để thống nhất với master.
- `/api/criteria`: thay bằng `/api/behavior-criteria`.
- `/api/ai-comments/drafts` và `/api/ai-comments/{commentId}/...`: thay bằng routes ở mục 3.
- `/api/behavior-criteria` không nên dùng một `POST` vừa tạo vừa sửa. Nếu cần sửa, phải xác định route riêng, quyền, versioning và hiệu lực áp dụng.

## 4. Chuẩn hóa kiểu dữ liệu và trạng thái

### 4.1 IDs
SQL Schema hiện định nghĩa các khóa chính theo `BIGINT`; endpoint pack có ví dụ UUID. Đề xuất API trả ID dưới dạng string chứa số (`"101"`), còn backend chuyển đổi và validate theo kiểu DB. Nếu quyết định dùng UUID, phải cập nhật SQL Schema, khóa ngoại, migration và toàn bộ ví dụ API trước khi code.

### 4.2 Students
- Dùng `classId`, `studentCode`, `displayName` như master API.
- Môi trường demo dùng tên/mã giả.
- Tìm kiếm theo tên chỉ được bật khi API cho phép và quyền dữ liệu cho phép.
- Không dùng `active` và `isActive` lẫn nhau; chọn `isActive` nếu khớp schema/API được chốt.

### 4.3 Criteria
Master dùng `ruleStatus`: `CONFIRMED`, `PENDING_CONFIRMATION`, `INACTIVE`. Endpoint pack dùng `status`: `DRAFT`, `PENDING_CONFIRMATION`, `APPROVED`, `RETIRED`. Đề xuất chuẩn hóa theo `ruleStatus` của master, nhưng cần kiểm tra enum/cột thật trong SQL Schema và database design trước khi đóng contract.

### 4.4 Behavior events
Giữ state machine trong master:
`DRAFT` → `PENDING_REVIEW` → `CONFIRMED` hoặc `REJECTED`; `VOIDED` cho bản ghi nhập nhầm theo quyền.
Không cho client gửi trạng thái tùy ý. Event chỉ được tính điểm chính thức sau khi đủ điều kiện và được xác nhận.

### 4.5 Monthly summaries
- `recalculate` nhận `classId`, `year`, `month`; trả kết quả batch gồm các mục và `blockingIssues`.
- Không dùng `summaryId` cho request tính lại hàng loạt.
- Các trường điểm có thể `null` nếu dữ liệu chưa đủ; UI không chuyển `null` thành 0.
- Tổng điểm không âm: `giftCount = floor(totalPoints / 10)`, `remainderPoints = totalPoints % 10`.
- Tổng điểm âm: `giftCount = 0`, `remainderPoints = null`.

### 4.6 AI comments
- Tạo draft: `POST /api/students/{studentId}/comments/draft`.
- Chỉnh sửa: `PATCH /api/comments/{commentId}`.
- Duyệt/từ chối: `/api/comments/{commentId}/approve`, `/reject`.
- Nội dung AI chỉ là draft đến khi giáo viên duyệt; lưu riêng nội dung draft và nội dung được duyệt.
- AI không tính điểm, không tự quyết định kỷ luật, không chẩn đoán và không suy luận hoàn cảnh gia đình/tính cách.

## 5. Danh sách thay đổi cần thực hiện trong endpoint pack

1. Đổi `GET/POST /api/classes/{classId}/students` sang `GET/POST /api/students` với `classId` query/body.
2. Đổi `/api/criteria` sang `/api/behavior-criteria`.
3. Chuẩn hóa collection envelope thành `data.items` cùng pagination trong `data`.
4. Thay ví dụ UUID bằng ID string số nếu giữ SQL Schema `BIGINT`.
5. Chuẩn hóa field `active`/`isActive`, `status`/`ruleStatus` theo contract được duyệt.
6. Đổi tạo draft AI sang `/api/students/{studentId}/comments/draft`.
7. Đổi approve/reject AI sang `/api/comments/{commentId}/approve` và `/reject`.
8. Thêm `PATCH /api/comments/{commentId}`.
9. Thêm `POST /api/behavior-events/{eventId}/void`.
10. Đưa `POST /api/classes` ra khỏi baseline MVP hoặc bổ sung vào master sau khi xác nhận.
11. Bổ sung contract duyệt tiêu chí và quyết định rõ quy trình tạo/cập nhật/phiên bản tiêu chí.
12. Đồng bộ error codes và lỗi validation.
13. Đối chiếu tất cả field với Database Design và SQL Schema; nếu schema không hỗ trợ, phải tạo quyết định thay đổi schema trước khi code.
14. Cập nhật UI Design và UI Implementation Plan theo route và response chuẩn.

## 6. Những việc chưa thể tự kết luận từ tài liệu

Các điểm sau cần quyết định rõ, không nên tự đoán:
- Route và body cuối cùng cho duyệt tiêu chí.
- Có cần tạo lớp qua UI trong MVP hay tạo bằng seed/admin.
- Có cho phép cập nhật tiêu chí không; nếu có, versioning/effective date xử lý thế nào.
- Kiểu ID cuối cùng là `BIGINT` serialize thành string hay chuyển toàn bộ schema sang UUID.
- Cơ chế xác thực/phiên, ma trận quyền, rate limit và nhà cung cấp AI.
- Các quy tắc nghiệp vụ đang chờ xác nhận trong tài liệu quy tắc.

## 7. Checklist chốt contract

- [ ] Chủ dự án chấp thuận master API Design làm baseline.
- [ ] Kiểu ID khớp SQL Schema.
- [ ] Mọi route trong endpoint pack khớp danh mục chuẩn.
- [ ] Mọi collection dùng cùng pagination/envelope.
- [ ] Enum và field name khớp schema.
- [ ] Mỗi thao tác state-changing có quyền, điều kiện trạng thái và audit.
- [ ] UI Design trỏ đúng API.
- [ ] Có test contract cho thành công, validation, không xác thực, không đủ quyền, trạng thái xung đột và dữ liệu chưa xác minh.

## 8. Bước tiếp theo sau khi chốt

Sau khi checklist ở mục 7 được chấp thuận, tạo phiên bản **API Design V1.1** và đồng bộ các file endpoint theo danh mục ở mục 3. Tiếp theo mới thực hiện UI-002: kiểm tra repository Next.js, cấu trúc source, package manager và lệnh build/test hiện có.
