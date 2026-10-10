# AI ClassMate 2G3 — API Design V1.0

- **Mã tài liệu:** ACM2G3-API
- **Phiên bản:** 1.0
- **Trạng thái:** Bản thiết kế đề xuất — cần rà soát trước khi triển khai
- **Ngày:** 2026-10-10
- **Tài liệu liên quan:** `AI_ClassMate_2G3_System_Architecture_V1.md`, `AI_ClassMate_2G3_Database_Design_V1.md`, `AI_ClassMate_2G3_Quy_Tac_Nghiep_Vu_v1_final.md`

> Các endpoint trong tài liệu này là hợp đồng API dự kiến cho MVP, chưa phải API đã triển khai. Không được cho phép endpoint bỏ qua quy tắc nghiệp vụ hoặc quyền truy cập.

---

## 1. Mục tiêu và quy ước

API cung cấp giao tiếp có kiểm soát giữa giao diện Next.js và application services phía server.

### 1.1. Quy ước chung

- Base path: `/api`
- Dữ liệu trao đổi: JSON UTF-8.
- Ngày giờ: ISO 8601 có timezone, ví dụ `2026-10-10T09:30:00+07:00`.
- ID: chuỗi số hoặc số nguyên an toàn theo cách serialize thống nhất. Khuyến nghị API trả ID dưới dạng chuỗi nếu có khả năng vượt giới hạn số nguyên an toàn của JavaScript.
- Danh sách: phân trang bằng `page` và `pageSize` trong MVP.
- Không trả stack trace, câu SQL, secrets hoặc thông tin nội bộ trong lỗi.
- Mọi endpoint đọc/ghi dữ liệu học sinh phải xác thực và kiểm tra quyền phía server trước khi triển khai với dữ liệu thật.
- Không cho frontend kết nối PostgreSQL trực tiếp.
- Các endpoint thay đổi trạng thái phải ghi audit log theo quy tắc bảo mật.

### 1.2. Mẫu phản hồi thành công

```json
{
  "data": {
    "id": "123"
  },
  "meta": {
    "requestId": "req_example"
  }
}
```

### 1.3. Mẫu phản hồi lỗi

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu gửi lên chưa hợp lệ.",
    "details": [
      {
        "field": "occurredAt",
        "reason": "REQUIRED"
      }
    ]
  },
  "meta": {
    "requestId": "req_example"
  }
}
```

Không trả dữ liệu nhạy cảm trong `details`. Thông báo phải đủ rõ để người dùng sửa lỗi nhưng không tiết lộ chi tiết hệ thống.

## 2. Mã lỗi chuẩn

| HTTP | Code | Khi sử dụng |
|---|---|---|
| 400 | `BAD_REQUEST` | Request sai định dạng hoặc query không hợp lệ |
| 401 | `UNAUTHENTICATED` | Chưa đăng nhập hoặc phiên hết hạn |
| 403 | `FORBIDDEN` | Không đủ quyền |
| 404 | `NOT_FOUND` | Không tìm thấy tài nguyên hoặc không được phép biết tài nguyên tồn tại |
| 409 | `STATE_CONFLICT` | Trạng thái hiện tại không cho phép thao tác |
| 422 | `VALIDATION_ERROR` | Dữ liệu hợp lệ về cú pháp nhưng vi phạm validation/nghiệp vụ |
| 429 | `RATE_LIMITED` | Gửi yêu cầu quá nhanh |
| 502 | `AI_PROVIDER_ERROR` | Nhà cung cấp AI trả lỗi |
| 503 | `SERVICE_UNAVAILABLE` | Thành phần phụ thuộc tạm thời không khả dụng |
| 500 | `INTERNAL_ERROR` | Lỗi không dự kiến; chi tiết chỉ ghi trong log server |

## 3. Nhóm API

### 3.1. Classes

#### `GET /api/classes`

Lấy danh sách lớp mà người dùng hiện tại được phép truy cập.

Query:
- `activeOnly` (boolean, optional; mặc định `true`)

Response data:
```json
{
  "items": [
    {
      "id": "1",
      "classCode": "2G3",
      "className": "Lớp 2G3",
      "schoolYear": "2026-2027",
      "isActive": true
    }
  ]
}
```

#### `GET /api/classes/{classId}`

Lấy thông tin một lớp sau khi kiểm tra quyền truy cập.

### 3.2. Students

#### `GET /api/students`

Query:
- `classId` (required)
- `q` (optional; tìm theo mã hoặc tên trong phạm vi quyền)
- `activeOnly` (optional, default `true`)
- `page` (optional, default `1`)
- `pageSize` (optional, default `20`, giới hạn tối đa đề xuất `100`)

Response data gồm `items`, `page`, `pageSize`, `total`.

#### `POST /api/students`

Tạo hồ sơ học sinh tối thiểu.

Request:
```json
{
  "classId": "1",
  "studentCode": "HS001",
  "displayName": "Học sinh 001"
}
```

Validation:
- `classId` phải thuộc phạm vi người dùng được phép quản lý.
- `studentCode` bắt buộc và duy nhất trong lớp.
- Không yêu cầu nhập thêm dữ liệu cá nhân không cần thiết.

#### `GET /api/students/{studentId}`

Lấy hồ sơ tối thiểu của học sinh theo quyền truy cập.

#### `PATCH /api/students/{studentId}`

Cập nhật các trường được phép chỉnh sửa. Ghi audit log khi thay đổi dữ liệu quan trọng.

### 3.3. Behavior criteria

#### `GET /api/behavior-criteria`

Query:
- `status` (optional: `CONFIRMED`, `PENDING_CONFIRMATION`, `INACTIVE`)
- `category` (optional: `POSITIVE`, `NEGATIVE`)

Response mỗi tiêu chí gồm:
`id`, `criterionCode`, `criterionName`, `category`, `points`, `ruleStatus`, `description`.

Không hiển thị `points` như điểm áp dụng chính thức nếu `ruleStatus` chưa phải `CONFIRMED`.

#### `POST /api/behavior-criteria`

Chỉ người được phân quyền quản lý quy tắc mới được tạo/cập nhật tiêu chí. Thay đổi mức điểm phải được xác nhận và có audit log. Không sửa tiêu chí theo cách làm thay đổi âm thầm kết quả lịch sử.

### 3.4. Behavior events

#### `POST /api/behavior-events`

Tạo bản ghi sự kiện ở trạng thái nháp hoặc chờ rà soát.

Request:
```json
{
  "classId": "1",
  "studentId": "101",
  "occurredAt": "2026-10-10T09:30:00+07:00",
  "description": "Ghi nhận trong giờ học",
  "items": [
    {
      "criterionId": "2",
      "note": null
    }
  ]
}
```

Validation:
- Học sinh phải thuộc lớp đã gửi.
- Tiêu chí phải tồn tại.
- Nếu tiêu chí chưa xác nhận hoặc điểm chưa rõ, không tự gán điểm chính thức; tạo cảnh báo và đưa bản ghi vào rà soát.
- Kiểm tra dấu hiệu trùng trước khi cho xác nhận.
- Lưu người nhập và nguồn dữ liệu.
- Việc tạo thành công không đồng nghĩa bản ghi đã được xác nhận.

#### `GET /api/behavior-events`

Query đề xuất:
- `classId` (required)
- `studentId` (optional)
- `from` / `to` (optional; ISO 8601)
- `status` (optional)
- `page`, `pageSize`

#### `GET /api/behavior-events/{eventId}`

Trả sự kiện cùng các mục hành vi, trạng thái rà soát và cảnh báo liên quan theo quyền truy cập.

#### `POST /api/behavior-events/{eventId}/confirm`

Xác nhận sự kiện sau khi kiểm tra quyền và điều kiện nghiệp vụ.

Quy tắc:
- Không xác nhận nếu có tiêu chí chưa được xác nhận, điểm chưa rõ hoặc lỗi chặn chưa xử lý.
- Ghi `reviewedBy`, `reviewedAt` và audit log.
- Không cho phép xác nhận lặp gây ra thay đổi ngoài ý muốn.

#### `POST /api/behavior-events/{eventId}/reject`

Từ chối sự kiện với lý do bắt buộc.

#### `POST /api/behavior-events/{eventId}/void`

Vô hiệu hóa bản ghi đã nhập nhầm theo quyền được cấp. Không xóa cứng; phải lưu lý do và audit log.

### 3.5. Review issues

#### `GET /api/review-issues`

Query:
- `classId` (required)
- `status` (optional: `OPEN`, `RESOLVED`, `DISMISSED`)
- `severity` (optional: `INFO`, `WARNING`, `BLOCKING`)
- `page`, `pageSize`

#### `POST /api/review-issues/{issueId}/resolve`

Request:
```json
{
  "resolutionNote": "Đã đối chiếu dữ liệu với sổ ghi nhận."
}
```

Yêu cầu:
- Người dùng phải có quyền xử lý cảnh báo.
- Ghi người xử lý, thời điểm và ghi chú.
- Không cho đóng cảnh báo `BLOCKING` nếu điều kiện giải quyết chưa được đáp ứng.
- Không tự đánh dấu đã giải quyết chỉ vì người dùng mở xem cảnh báo.

### 3.6. Monthly summaries

#### `GET /api/monthly-summaries`

Query:
- `classId` (required)
- `year` (required)
- `month` (required, 1–12)
- `status` (optional)
- `page`, `pageSize`

Response mỗi dòng cần thể hiện:
- Mã học sinh và tên hiển thị phù hợp quyền.
- Điểm cộng, điểm trừ, tổng điểm.
- Số quà, điểm dư.
- Trạng thái dữ liệu.
- Số lượng cảnh báo đang mở.

Các trường điểm có thể `null` nếu dữ liệu chưa đủ. Không tự chuyển `null` thành `0`.

#### `GET /api/monthly-summaries/{summaryId}`

Trả tổng kết, trạng thái duyệt, phiên bản quy tắc và tham chiếu dữ liệu nguồn cần thiết.

#### `POST /api/monthly-summaries/recalculate`

Request:
```json
{
  "classId": "1",
  "year": 2026,
  "month": 9
}
```

Hành vi:
- Tính lại từ các mục đã xác nhận.
- Không sửa dữ liệu sự kiện nguồn.
- Nếu còn lỗi chặn ảnh hưởng kết quả, lưu trạng thái `NEEDS_REVIEW`.
- Tạo audit log cho thao tác tính lại.
- Endpoint này không tự duyệt tổng kết.

#### `POST /api/monthly-summaries/{summaryId}/approve`

Duyệt tổng kết sau khi kiểm tra quyền, trạng thái và cảnh báo.

Không cho duyệt khi còn vấn đề chặn có thể làm thay đổi kết quả. Lưu người duyệt, thời điểm và phiên bản quy tắc.

#### `POST /api/monthly-summaries/{summaryId}/reopen`

Mở lại tổng kết theo quyền được cấp, bắt buộc có lý do và audit log.

### 3.7. AI comments

#### `POST /api/students/{studentId}/comments/draft`

Request:
```json
{
  "year": 2026,
  "month": 9,
  "tone": "ENCOURAGING",
  "focus": ["PROGRESS", "NEXT_STEP"]
}
```

Hành vi:
- Kiểm tra quyền người dùng và phạm vi học sinh.
- Chỉ dùng dữ liệu đã xác nhận, cần thiết cho mục tiêu nhận xét.
- Không gửi thông tin định danh hoặc dữ liệu nhạy cảm không cần thiết đến nhà cung cấp AI.
- AI chỉ tạo bản dự thảo; lưu `sourceType = AI_DRAFT`, `status = DRAFT`.
- Không tự động duyệt, gửi hoặc công bố.
- Nếu AI không khả dụng, trả lỗi phù hợp; các chức năng thi đua khác vẫn hoạt động.

#### `PATCH /api/comments/{commentId}`

Cho phép giáo viên chỉnh sửa nội dung dự thảo theo quyền. Lưu lịch sử thay đổi.

#### `POST /api/comments/{commentId}/approve`

Duyệt nội dung sau khi giáo viên xem và xác nhận.

#### `POST /api/comments/{commentId}/reject`

Từ chối dự thảo. Có thể lưu lý do để phục vụ quản lý quy trình; không dùng dữ liệu này để huấn luyện mô hình nếu chưa có cơ sở và phê duyệt phù hợp.

### 3.8. Audit logs

#### `GET /api/audit-logs`

Chỉ người có quyền phù hợp được tra cứu. Query theo `entityType`, `entityId`, thời gian và phân trang. Không cung cấp endpoint cho client sửa/xóa audit log.

## 4. Quy tắc validation dùng chung

- Từ chối trường bắt buộc bị thiếu.
- Không tự biến chuỗi rỗng hoặc `null` thành số 0.
- Kiểm tra ID và quyền truy cập trên server.
- Kiểm tra học sinh thuộc đúng lớp.
- Kiểm tra tháng từ 1 đến 12.
- Kiểm tra tiêu chí và trạng thái xác nhận trước khi tính điểm.
- Dùng giao dịch database cho thao tác nhiều bảng.
- Với thao tác tạo hoặc xác nhận có nguy cơ gửi lặp, cân nhắc `Idempotency-Key` hoặc kiểm tra trạng thái hiện tại.
- Không tin `role`, `teacherId` hoặc trạng thái duyệt do client tự gửi; lấy danh tính và quyền từ phiên đã xác thực phía server.

## 5. Quy tắc trạng thái

| Tài nguyên | Chuyển trạng thái đề xuất |
|---|---|
| Behavior event | `DRAFT` → `PENDING_REVIEW` → `CONFIRMED` hoặc `REJECTED`; bản ghi đã nhập nhầm có thể `VOIDED` theo quyền |
| Review issue | `OPEN` → `RESOLVED` hoặc `DISMISSED` |
| Monthly summary | `DRAFT` / `NEEDS_REVIEW` → `READY` → `APPROVED`; có thể `REOPENED` theo quy trình |
| Student comment | `DRAFT` → `APPROVED` hoặc `REJECTED` |

Mọi chuyển trạng thái phải được kiểm tra ở server; không cho client tự ghi trạng thái tùy ý.

## 6. Kiểm thử API tối thiểu

- [ ] Request thiếu trường bắt buộc trả `422 VALIDATION_ERROR`.
- [ ] Người chưa xác thực không đọc/ghi dữ liệu học sinh.
- [ ] Người dùng không có quyền không thể xem lớp ngoài phạm vi.
- [ ] Tiêu chí chưa xác nhận không được tính điểm chính thức.
- [ ] Ô điểm trống không bị chuyển thành 0.
- [ ] Sự kiện nghi trùng tạo cảnh báo, không tự xóa.
- [ ] Tổng điểm âm cho 0 quà và điểm dư `null`.
- [ ] Tổng điểm 28 cho 2 quà, dư 8.
- [ ] Không thể duyệt tổng kết còn lỗi chặn.
- [ ] Nhận xét AI được lưu ở trạng thái `DRAFT`.
- [ ] Lỗi AI không làm hỏng bản ghi thi đua đã lưu.
- [ ] Các thao tác xác nhận, duyệt, từ chối, mở lại có audit log.

## 7. Các quyết định còn mở

- [ ] Cơ chế đăng nhập và phiên xác thực.
- [ ] Công nghệ validation/schema trong Next.js.
- [ ] Cách phân trang và giới hạn xuất dữ liệu.
- [ ] Cơ chế rate limiting cho API AI.
- [ ] Nhà cung cấp AI và chính sách lưu/truyền dữ liệu.
- [ ] Quy trình phân quyền chính thức của giáo viên và quản trị viên.

## 8. Nhật ký thay đổi

| Phiên bản | Ngày | Nội dung | Trạng thái |
|---|---|---|---|
| 1.0 | 2026-10-10 | Đặc tả API dự kiến cho MVP và quy tắc validation/trạng thái | Bản đề xuất |
