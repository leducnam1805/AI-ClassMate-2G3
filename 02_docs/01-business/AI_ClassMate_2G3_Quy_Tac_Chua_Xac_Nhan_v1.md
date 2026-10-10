# AI ClassMate 2G3 — Quy tắc nghiệp vụ chưa xác nhận

- **Mã tài liệu:** ACM2G3-BR-PENDING
- **Phiên bản:** 1.0
- **Trạng thái:** Đang rà soát
- **Dự án:** AI ClassMate 2G3
- **Tài liệu liên quan:** `AI_ClassMate_2G3_Quy_Tac_Nghiep_Vu_v1.md`
- **Mục đích:** Quản lý các quy tắc chưa được giáo viên xác nhận trước khi triển khai chính thức chức năng tính điểm, tổng kết thi đua và đánh giá học sinh.

---

## 1. Mục tiêu

Tài liệu này tổng hợp các vấn đề nghiệp vụ chưa thống nhất được phát hiện trong dữ liệu thi đua lớp 2G3 tháng 9.

Các quy tắc trong tài liệu này chưa phải quy định chính thức. Hệ thống không được tự động áp dụng chúng để tính điểm chính thức khi chưa có xác nhận của giáo viên phụ trách.

Mỗi quy tắc phải có trạng thái rõ ràng:

- `PENDING_CONFIRMATION`: Chờ giáo viên xác nhận.
- `CONFIRMED`: Đã được xác nhận.
- `REJECTED`: Đề xuất hoặc cách hiểu đã bị từ chối.
- `SUPERSEDED`: Đã được thay thế bởi quy tắc mới.

Khi một quy tắc được xác nhận, cập nhật tài liệu `AI_ClassMate_2G3_Quy_Tac_Nghiep_Vu_v1.md` và ghi lại lịch sử thay đổi.

## 2. Nguyên tắc xử lý chung

### BR-P-001 — Không tự suy diễn quy tắc

Nếu quy tắc chưa rõ hoặc có nhiều cách hiểu, hệ thống phải yêu cầu giáo viên xác nhận.

### BR-P-002 — Không tự sửa dữ liệu gốc

Không tự thay đổi điểm số, tên hành vi, số quà hoặc nhận xét trong dữ liệu nhập vào.

Mọi điều chỉnh phải có người thực hiện, thời gian, giá trị trước và sau điều chỉnh, cùng lý do.

### BR-P-003 — Phân biệt dữ liệu trống và điểm 0

Ô dữ liệu trống được xem là chưa có thông tin xác nhận, không mặc định là 0.

Chỉ sử dụng 0 khi dữ liệu đã được xác nhận là không phát sinh điểm hoặc người có thẩm quyền chủ động nhập 0.

### BR-P-004 — Không công bố kết quả chính thức khi còn lỗi ảnh hưởng

Nếu còn dữ liệu thiếu, quy tắc chưa xác nhận hoặc phép tính không nhất quán có thể làm thay đổi kết quả, hệ thống phải cảnh báo và yêu cầu rà soát trước khi chốt tổng kết.

### BR-P-005 — AI không tự quyết định điểm thi đua

AI chỉ được hỗ trợ phát hiện bất thường, giải thích dữ liệu và soạn nhận xét dự thảo. Việc xác nhận điểm, sửa dữ liệu và duyệt nhận xét thuộc giáo viên có thẩm quyền.

---

## 3. Danh sách quy tắc cần xác nhận

### BR-P-006 — Đơn vị ghi nhận điểm cộng

**Vấn đề:** Chưa xác định rõ mỗi lần thực hiện hành vi tích cực được tính một điểm theo lần phát sinh, theo buổi học hay theo ngày.

Các hành vi liên quan:

- Phát biểu.
- Điểm cộng vở.
- Tham gia dọn vệ sinh.
- Giúp đỡ bạn.
- Tham gia trò chơi học tập.

**Cần giáo viên xác nhận:**

1. Mỗi lần phát sinh hành vi có được cộng một điểm không?
2. Có giới hạn số điểm cộng cho cùng một hành vi trong ngày không?
3. Một hành vi được ghi nhận nhiều lần trong cùng buổi học có được tính nhiều lần không?
4. Ai có quyền xác nhận một lần ghi nhận là hợp lệ?

**Trạng thái:** `PENDING_CONFIRMATION`

**Cách hệ thống xử lý trước khi xác nhận:** Cho phép nhập bản ghi nháp nhưng chưa tự động dùng bản ghi chưa được duyệt để chốt tổng điểm.

### BR-P-007 — Phân biệt “Đánh lọn” và “Đánh bạn”

**Vấn đề:** Danh sách quy tắc có cụm từ “Đánh lọn”, trong khi dữ liệu Excel có mục “Đánh bạn”. Chưa đủ căn cứ để kết luận hai mục này cùng một hành vi hoặc có cùng mức trừ điểm.

**Cần giáo viên xác nhận:**

1. “Đánh lọn” có phải lỗi ghi chép của một tên hành vi khác không?
2. “Đánh lọn” và “Đánh bạn” là cùng một tiêu chí hay hai tiêu chí khác nhau?
3. Mức trừ điểm chính thức của từng tiêu chí là bao nhiêu?
4. Có cần đổi tên tiêu chí trong dữ liệu cũ hay giữ nguyên và lập bảng ánh xạ?

**Trạng thái:** `PENDING_CONFIRMATION`

**Cách hệ thống xử lý trước khi xác nhận:** Giữ nguyên tên hành vi gốc, không tự ánh xạ hai mục thành một và không tự áp dụng mức trừ điểm.

### BR-P-008 — Mức trừ điểm khi không tập trung

**Vấn đề:** Quy tắc nguồn ghi “không tập trung giờ học” là -1 điểm, nhưng dữ liệu Excel có trường hợp ghi mức -3 điểm.

**Cần giáo viên xác nhận:**

1. Mức trừ điểm chuẩn là -1 hay -3?
2. Có nhiều mức độ vi phạm hay không?
3. Nếu có nhiều mức, tiêu chí phân biệt từng mức là gì?
4. Các bản ghi lịch sử đã ghi -3 có được giữ nguyên hay cần rà soát?

**Trạng thái:** `PENDING_CONFIRMATION`

**Cách hệ thống xử lý trước khi xác nhận:** Không tự sửa bản ghi cũ và không tự lựa chọn mức điểm cho bản ghi mới. Yêu cầu giáo viên chọn mức đã được xác nhận.

### BR-P-009 — Hành vi “Viết trước vở tập viết”

**Vấn đề:** Excel có tiêu chí “viết trước vở tập viết” với mức -1 điểm, nhưng tiêu chí này chưa xuất hiện trong danh sách quy tắc nguồn đã cung cấp.

**Cần giáo viên xác nhận:**

1. Có chính thức áp dụng tiêu chí này không?
2. Mức trừ điểm có phải -1 không?
3. Tiêu chí áp dụng trong những trường hợp nào?
4. Có cần đưa tiêu chí này vào danh mục thi đua chính thức không?

**Trạng thái:** `PENDING_CONFIRMATION`

**Cách hệ thống xử lý trước khi xác nhận:** Giữ lại bản ghi lịch sử để rà soát nhưng không coi tiêu chí là quy tắc chính thức.

### BR-P-010 — Tiêu chí “Xuất sắc tháng”

**Vấn đề:** Dữ liệu có danh sách học sinh “Xuất sắc tháng 9”, nhưng chưa có đủ thông tin xác định điều kiện lựa chọn.

**Cần giáo viên xác nhận:**

1. Điều kiện để được xếp loại “Xuất sắc tháng” là gì?
2. Có yêu cầu điểm tối thiểu không?
3. Có xét số lần vi phạm hoặc loại vi phạm không?
4. Có xét sự tiến bộ của học sinh so với thời gian trước không?
5. Giáo viên có quyền điều chỉnh kết quả đề xuất của hệ thống không?

**Trạng thái:** `PENDING_CONFIRMATION`

**Cách hệ thống xử lý trước khi xác nhận:** Không tự xếp loại “Xuất sắc tháng”. Có thể hiển thị dữ liệu tổng hợp để giáo viên xem xét, nhưng kết quả phải được giáo viên xác nhận.

### BR-P-011 — Điều kiện xác nhận dữ liệu và chốt tháng

**Vấn đề:** Chưa có quy trình chính thức quy định ai kiểm tra dữ liệu, ai duyệt kết quả và khi nào được chốt tổng kết tháng.

**Cần giáo viên xác nhận:**

1. Ai được nhập dữ liệu thi đua?
2. Ai được sửa bản ghi đã nhập?
3. Ai được xác nhận điểm?
4. Ai được chốt tổng kết tháng?
5. Khi phát hiện sai sót sau khi chốt, quy trình mở lại và điều chỉnh như thế nào?

**Trạng thái:** `PENDING_CONFIRMATION`

**Cách hệ thống xử lý trước khi xác nhận:** Chỉ cho phép lưu kết quả nháp. Chưa triển khai thao tác chốt chính thức hoặc phân quyền phức tạp dựa trên các giả định chưa được duyệt.

### BR-P-012 — Xử lý các trường dữ liệu còn thiếu

**Vấn đề:** Một số ô điểm cộng, điểm trừ, số quà hoặc điểm dư trong Excel bị trống.

**Cần giáo viên xác nhận:**

1. Trường nào bắt buộc phải có trước khi chốt tháng?
2. Trường nào có thể để trống hợp lệ?
3. Trường nào phải được tính tự động?
4. Ai chịu trách nhiệm xác nhận các ô trống trong dữ liệu cũ?

**Trạng thái:** `PENDING_CONFIRMATION`

**Cách hệ thống xử lý trước khi xác nhận:**

- Đánh dấu trường chưa có dữ liệu.
- Không tự chuyển ô trống thành 0.
- Không tự tạo số quà hoặc điểm dư khi tổng điểm chưa đáng tin cậy.
- Hiển thị danh sách bản ghi cần rà soát.

### BR-P-013 — Quy tắc hiệu chỉnh và lưu lịch sử

**Vấn đề:** Chưa có quy trình chính thức về quyền sửa điểm và quản lý lịch sử chỉnh sửa.

**Cần giáo viên xác nhận:**

1. Ai được phép sửa dữ liệu?
2. Có bắt buộc nhập lý do khi sửa không?
3. Có cần lưu giá trị trước và sau khi sửa không?
4. Có cần lưu người sửa và thời điểm sửa không?
5. Dữ liệu đã chốt có cần cơ chế mở lại để điều chỉnh không?

**Trạng thái:** `PENDING_CONFIRMATION`

**Cách hệ thống xử lý trước khi xác nhận:** Thiết kế dữ liệu theo hướng có thể lưu lịch sử chỉnh sửa. Không cho phép xóa hoặc ghi đè âm thầm các bản ghi đã được xác nhận.

---

## 4. Quy tắc đã xác nhận — không hỏi lại nếu chưa có thay đổi

Các quy tắc sau đã được giáo viên xác nhận và được quản lý trong tài liệu Business Rules V1.0:

| Mã | Nội dung |
|---|---|
| BR-001 | Ô điểm bị trống phải được đánh dấu cần kiểm tra, không tự coi là 0. |
| BR-002 | Vi phạm cờ đỏ trừ 10 điểm. |
| BR-003 | Nếu tổng điểm âm, số quà bằng 0 và giữ nguyên tổng điểm âm. |
| BR-004 | Không tự sửa dữ liệu mà không có xác nhận. |
| BR-005 | Nếu tổng điểm từ 0 trở lên, số quà bằng phần nguyên của tổng điểm chia 10. |
| BR-006 | Điểm dư bằng tổng điểm trừ số quà nhân 10, áp dụng khi tổng điểm không âm. |
| BR-007 | Nếu một lần ghi nhận có cả nói chuyện và nói leo, tổng mức trừ là 2 điểm. |
| BR-008 | Không tính trùng cùng một hành vi trong cùng một lần ghi nhận. |

**Lưu ý:** Bảng trên là bản tóm tắt. Khi triển khai phần mềm, tài liệu `AI_ClassMate_2G3_Quy_Tac_Nghiep_Vu_v1.md` là nơi quản lý nội dung chi tiết của các quy tắc đã xác nhận.

---

## 5. Yêu cầu hệ thống khi gặp quy tắc chưa xác nhận

Hệ thống phải đáp ứng các yêu cầu sau:

### FR-P-001 — Trạng thái quy tắc

Mỗi quy tắc có mã định danh, mô tả, trạng thái, ngày cập nhật và người xác nhận nếu đã được xác nhận.

### FR-P-002 — Cảnh báo dữ liệu chưa hợp lệ

Hệ thống phát hiện và hiển thị những trường hợp:

- Điểm bị trống.
- Tiêu chí chưa được xác nhận.
- Mức điểm không khớp quy tắc hiện hành.
- Tổng điểm không khớp phép tính từ các bản ghi chi tiết.
- Số quà hoặc điểm dư không khớp công thức đã xác nhận.
- Có dấu hiệu ghi trùng cùng một hành vi trong cùng một lần ghi nhận.

### FR-P-003 — Chặn chốt kết quả khi cần rà soát

Không cho chốt tổng kết chính thức nếu còn lỗi ảnh hưởng đến kết quả mà chưa được giải quyết.

### FR-P-004 — Hiển thị lý do cảnh báo

Mỗi cảnh báo phải nêu rõ:

- Học sinh hoặc bản ghi liên quan.
- Trường dữ liệu có vấn đề.
- Quy tắc liên quan.
- Lý do cần rà soát.
- Hành động tiếp theo mà giáo viên có thể thực hiện.

### FR-P-005 — Lưu lịch sử xử lý

Khi giáo viên xác nhận hoặc điều chỉnh một bản ghi, hệ thống lưu người thực hiện, thời gian và nội dung thay đổi phù hợp với quyền truy cập.

### FR-P-006 — Phân biệt đề xuất AI và quyết định của giáo viên

Mọi nội dung do AI đề xuất phải được gắn nhãn dự thảo. AI không được tự xác nhận quy tắc, tự sửa điểm hoặc tự chốt kết quả thi đua.

---

## 6. Điều kiện hoàn thành rà soát

Chuyển tài liệu sang trạng thái hoàn tất khi:

- [ ] Tất cả quy tắc ảnh hưởng đến tính điểm đã được xác nhận hoặc được xử lý bằng cơ chế chờ xác nhận.
- [ ] Tên hành vi và mức điểm được thống nhất.
- [ ] Điều kiện xếp loại “Xuất sắc tháng” đã được xác nhận hoặc được xác định rõ là giáo viên quyết định thủ công.
- [ ] Quy trình kiểm tra, điều chỉnh và chốt tháng được xác định.
- [ ] Các quy tắc đã xác nhận được cập nhật vào Business Rules.
- [ ] Có bộ dữ liệu kiểm thử bao gồm dữ liệu hợp lệ, dữ liệu thiếu và dữ liệu mâu thuẫn.
- [ ] Không còn trường hợp hệ thống tự suy diễn dữ liệu chưa được xác nhận.

---

## 7. Nhật ký thay đổi

| Phiên bản | Nội dung | Trạng thái |
|---|---|---|
| 1.0 | Tổng hợp các quy tắc chưa thống nhất và yêu cầu xử lý an toàn | Đang rà soát |
