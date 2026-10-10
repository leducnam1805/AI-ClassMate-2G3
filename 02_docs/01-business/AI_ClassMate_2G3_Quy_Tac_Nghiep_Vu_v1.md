# AI ClassMate 2G3 — BỘ QUY TẮC NGHIỆP VỤ V1.0

- **Tên sản phẩm:** AI ClassMate 2G3 – Mô hình trợ lý AI hỗ trợ công tác chủ nhiệm lớp tiểu học
- **Phiên bản:** 1.0
- **Ngày cập nhật:** 10/10/2026
- **Phạm vi:** Quản lý thi đua, tổng hợp kết quả tháng, hỗ trợ nhận xét và theo dõi sự tiến bộ của học sinh tiểu học.
- **Trạng thái:** Đã chốt một số quy tắc cốt lõi; các tiêu chí còn mâu thuẫn phải được giáo viên xác minh trước khi tính điểm chính thức.

---

## 1. NGUYÊN TẮC NGHIỆP VỤ

1. Giữ nguyên dữ liệu nguồn; không tự ý sửa điểm hoặc nhận xét đã ghi nhận.
2. Quy tắc đã được giáo viên xác nhận được đánh dấu `APPROVED`.
3. Quy tắc chưa rõ hoặc còn mâu thuẫn được đánh dấu `PENDING_CONFIRMATION`.
4. Ô điểm cộng hoặc điểm trừ để trống là dữ liệu chưa xác nhận, không tự hiểu là 0.
5. Phần mềm tính điểm bằng code theo quy tắc đã duyệt; không giao cho AI tự tính điểm.
6. AI chỉ hỗ trợ soạn nhận xét và đề xuất kế hoạch hỗ trợ. Giáo viên phải kiểm tra, chỉnh sửa và duyệt kết quả.
7. Dữ liệu dùng cho AI và bản demo cần được ẩn danh bằng mã học sinh như `HS001`, `HS002`.
8. Không dùng tổng điểm thi đua đơn lẻ để kết luận toàn diện về năng lực, phẩm chất hoặc tính cách của học sinh.
9. Không công khai bảng xếp hạng cá nhân hoặc dữ liệu riêng tư của học sinh khi trình diễn sản phẩm.

## 2. QUY TẮC ĐÃ ĐƯỢC GIÁO VIÊN XÁC NHẬN

| Mã | Nội dung | Trạng thái |
|---|---|---|
| BR-001 | Ô điểm cộng hoặc điểm trừ để trống phải được cảnh báo và yêu cầu giáo viên kiểm tra. | `APPROVED` |
| BR-002 | Vi phạm cờ đỏ: trừ 10 điểm cho mỗi lần vi phạm được xác minh. | `APPROVED` |
| BR-003 | Nếu tổng điểm tháng âm, học sinh không nhận quà; tổng điểm âm vẫn được giữ nguyên. | `APPROVED` |
| BR-004 | Không tự sửa dữ liệu thiếu hoặc mâu thuẫn. Phải hiển thị cảnh báo để giáo viên xử lý. | `APPROVED` |
| BR-005 | Với tổng điểm không âm, số quà bằng phần nguyên của tổng điểm chia 10. | `APPROVED` |
| BR-006 | Điểm dư bằng tổng điểm trừ đi số quà nhân 10. | `APPROVED` |
| BR-007 | Nếu cùng một lần ghi nhận có cả nói chuyện và nói leo, trừ tổng cộng 2 điểm, tương ứng -1 cho mỗi hành vi. | `APPROVED` |
| BR-008 | Không tính trùng cùng một hành vi trong cùng một lần ghi nhận. | `APPROVED` |

## 3. DANH SÁCH TIÊU CHÍ ĐIỂM CỘNG

Các mức dưới đây lấy từ file quy định thi đua do giáo viên cung cấp. Cần xác nhận thêm cách ghi nhận theo từng lần, buổi hoặc ngày nếu chưa rõ.

| Mã | Hành vi/tiêu chí | Điểm | Trạng thái |
|---|---|---:|---|
| POS-001 | Phát biểu | +1 | `PENDING_CONFIRMATION` về đơn vị ghi nhận |
| POS-002 | Điểm cộng vở | +1 | `PENDING_CONFIRMATION` về đơn vị ghi nhận |
| POS-003 | Tham gia dọn vệ sinh | +1 | `PENDING_CONFIRMATION` |
| POS-004 | Giúp đỡ bạn | +1 | `PENDING_CONFIRMATION` |
| POS-005 | Tham gia trò chơi học tập | +1 | `PENDING_CONFIRMATION` |

**Nguyên tắc:** Chỉ cộng điểm khi sự việc đã được ghi nhận và tiêu chí áp dụng đã được duyệt. Không tự suy ra điểm từ nhận xét chưa rõ nghĩa.

## 4. DANH SÁCH TIÊU CHÍ ĐIỂM TRỪ

| Mã | Hành vi/tiêu chí | Mức trong file quy định | Trạng thái |
|---|---|---:|---|
| NEG-001 | Vi phạm cờ đỏ | -10 | `APPROVED` |
| NEG-002 | Đi lung tung | -2 | `PENDING_CONFIRMATION` nếu cách ghi thực tế không thống nhất |
| NEG-003 | Nói chuyện | -1 | `APPROVED` về mức cơ bản; cách ghi khác cần xác minh |
| NEG-004 | Nói leo | -1 | `APPROVED` về mức cơ bản; cách ghi khác cần xác minh |
| NEG-005 | “Đánh lọn” — giữ nguyên thuật ngữ trong file nguồn | -10 | `PENDING_CONFIRMATION` về ý nghĩa và cách áp dụng |
| NEG-006 | Không mang sách vở/dụng cụ học tập | -1 | `PENDING_CONFIRMATION` |
| NEG-007 | Không tập trung giờ học | -1 | `PENDING_CONFIRMATION` vì Excel có trường hợp ghi -3 |
| NEG-008 | Viết trước vở tập viết | Không có trong danh sách quy định | `PENDING_CONFIRMATION`; Excel có ghi -1 |
| NEG-009 | “Đánh bạn” | Excel có ghi -7 | `PENDING_CONFIRMATION`; chưa có trong danh sách quy định chính thức |

### 4.1. Quy tắc kết hợp hành vi

- Nói chuyện: -1 điểm.
- Nói leo: -1 điểm.
- Nếu cùng một lần ghi nhận có cả hai hành vi: tổng điểm trừ là -2.
- Nếu một hành vi được ghi nhận trùng lặp do nhập liệu, không được tự động trừ điểm nhiều lần.
- Nếu một lần ghi nhận có nhiều hành vi khác nhau, phần mềm chỉ cộng dồn khi từng hành vi được ghi rõ và mức điểm đã được duyệt.
- Các trường hợp có cách ghi hoặc mức điểm mâu thuẫn phải hiển thị cảnh báo.

### 4.2. Các điểm chưa được phép tự suy đoán

1. “Đánh lọn” có đúng là thuật ngữ trong quy định hay không.
2. “Đánh bạn” có phải tiêu chí riêng hay không.
3. “Viết trước vở tập viết” có được bổ sung thành tiêu chí chính thức hay không.
4. “Không tập trung giờ học” có luôn là -1 hay có quy tắc khác.
5. Điểm cộng được tính theo mỗi lần, mỗi buổi hay theo một đơn vị khác.

## 5. QUY TẮC TÍNH TỔNG ĐIỂM

### 5.1. Công thức

`Tổng điểm = Tổng điểm cộng - Tổng trị số điểm trừ`

Trong đó:
- Tổng điểm cộng là tổng các điểm cộng hợp lệ.
- Tổng trị số điểm trừ là tổng độ lớn của các khoản điểm trừ hợp lệ, được lưu hoặc xử lý theo quy ước dấu nhất quán.
- Không được trừ hai lần do nhầm lẫn giữa giá trị âm hiển thị và trị số điểm trừ.

### 5.2. Điều kiện tính điểm

Phần mềm chỉ xác nhận kết quả tính chính thức khi:
- Các ô điểm cần thiết đã được xác minh.
- Các tiêu chí liên quan đã được duyệt.
- Không còn mâu thuẫn dữ liệu ảnh hưởng đến phép tính.
- Giáo viên có thể xem lại các sự việc cấu thành tổng điểm.

Nếu dữ liệu chưa đạt điều kiện, hiển thị trạng thái `NEEDS_REVIEW` thay vì tự tính kết quả chính thức.

### 5.3. Không ghi đè dữ liệu gốc

- Giữ nguyên tổng điểm trong Excel để đối chiếu.
- Kết quả tính bằng phần mềm được lưu riêng.
- Nếu kết quả khác dữ liệu gốc, tạo cảnh báo để giáo viên kiểm tra.
- Mọi chỉnh sửa phải có dấu vết thay đổi và lý do nếu hệ thống được triển khai chính thức.

## 6. QUY TẮC TÍNH QUÀ VÀ ĐIỂM DƯ

### 6.1. Khi tổng điểm từ 0 trở lên

Công thức:

`Số quà = FLOOR(Tổng điểm / 10)`

`Điểm dư = Tổng điểm - Số quà × 10`

Ví dụ:

| Tổng điểm | Số quà | Điểm dư |
|---:|---:|---:|
| 0 | 0 | 0 |
| 9 | 0 | 9 |
| 10 | 1 | 0 |
| 19 | 1 | 9 |
| 20 | 2 | 0 |
| 28 | 2 | 8 |
| 35 | 3 | 5 |

### 6.2. Khi tổng điểm âm

- Số quà bằng 0.
- Giữ nguyên tổng điểm âm.
- Không chuyển tổng điểm âm thành 0.
- Không áp dụng công thức phần dư thông thường cho tổng điểm âm.
- Trường điểm dư có thể hiển thị “Không áp dụng” hoặc để trống theo thiết kế giao diện; không được ghi thành điểm dư âm theo công thức chia quà nếu chưa có quy định riêng.

Ví dụ:

| Tổng điểm | Số quà | Điểm dư |
|---:|---:|---|
| -1 | 0 | Không áp dụng |
| -8 | 0 | Không áp dụng |
| -15 | 0 | Không áp dụng |

### 6.3. Ô quà hoặc điểm dư bị trống trong Excel

Không tự coi là 0. Đánh dấu cần kiểm tra để xác định ô đó chưa tính hay thiếu dữ liệu.

## 7. QUY TẮC NHẬN XÉT CUỐI THÁNG BẰNG AI

AI chỉ tạo bản nháp, không tự động ghi nhận là nhận xét chính thức.

### Đầu vào cho AI

- Mã học sinh ẩn danh.
- Các hành vi tích cực đã được xác minh.
- Các nội dung cần rèn luyện đã được xác minh.
- Sự thay đổi theo thời gian nếu có dữ liệu.
- Mục tiêu hỗ trợ giáo dục phù hợp.

Không gửi thông tin cá nhân không cần thiết như họ tên đầy đủ, địa chỉ, số điện thoại hoặc thông tin gia đình.

### Yêu cầu đầu ra

1. Nêu điểm tích cực có minh chứng.
2. Nêu một hoặc hai nội dung cần rèn luyện bằng ngôn ngữ tích cực, tôn trọng.
3. Đề xuất mục tiêu nhỏ, cụ thể, có thể quan sát.
4. Không bịa sự việc hoặc tự tạo số liệu.
5. Nếu thiếu dữ liệu, phải nêu rõ chưa đủ thông tin.
6. Không chẩn đoán sức khỏe, tâm lý hoặc suy đoán hoàn cảnh gia đình.
7. Không gắn nhãn tiêu cực cho học sinh.
8. Không so sánh học sinh này với học sinh khác.
9. Giáo viên có quyền sửa, duyệt hoặc từ chối bản nháp.

Hệ thống phải lưu riêng:
- Nội dung AI tạo.
- Nội dung giáo viên chỉnh sửa.
- Nội dung giáo viên đã duyệt.
- Trạng thái duyệt và thời điểm duyệt.

## 8. THEO DÕI SỰ TIẾN BỘ CỦA HỌC SINH

1. Theo dõi các hành vi cụ thể theo tuần và tháng.
2. Ghi nhận cả hành vi tích cực, không chỉ các lần vi phạm.
3. Chỉ kết luận về tiến bộ khi có dữ liệu của nhiều thời điểm để so sánh.
4. Nếu chỉ có dữ liệu tháng 9, xem đó là dữ liệu ban đầu; không khẳng định học sinh đã tiến bộ nếu chưa có minh chứng sau đó.
5. Kế hoạch hỗ trợ do AI đề xuất phải được giáo viên kiểm tra trước khi áp dụng.
6. Không dùng tổng điểm thi đua đơn lẻ làm thước đo duy nhất của sự tiến bộ.

## 9. QUẢN LÝ DỮ LIỆU VÀ PHÂN QUYỀN

Mỗi sự việc nên có các trường:
- Mã sự việc.
- Mã học sinh.
- Ngày ghi nhận.
- Mã tiêu chí.
- Mô tả khách quan.
- Điểm áp dụng.
- Trạng thái xác minh.
- Người ghi nhận/duyệt theo quyền được cấp.
- Thời điểm tạo và cập nhật.
- Lý do sửa đổi nếu có.

Mỗi kỳ tổng kết nên lưu:
- Tháng/năm.
- Phiên bản quy tắc sử dụng.
- Tổng điểm cộng.
- Tổng điểm trừ.
- Tổng điểm.
- Số quà và điểm dư nếu đủ điều kiện.
- Danh sách cảnh báo.
- Trạng thái giáo viên duyệt.

Chỉ người được phép mới được xem hoặc chỉnh sửa hồ sơ chi tiết. Bản demo và báo cáo nghiên cứu ưu tiên dùng mã ẩn danh và số liệu tổng hợp.

## 10. CÁC VẤN ĐỀ CÒN CHỜ XÁC NHẬN

| Mã | Vấn đề | Việc cần làm |
|---|---|---|
| OPEN-01 | Đơn vị ghi nhận điểm cộng: mỗi lần, mỗi buổi hay theo ngày | Giáo viên xác nhận |
| OPEN-02 | Mức điểm và cách áp dụng “Đi lung tung” nếu dữ liệu thực tế khác quy định | Đối chiếu và xác nhận |
| OPEN-03 | “Đánh lọn” và “Đánh bạn” có phải hai tiêu chí khác nhau không | Xác minh thuật ngữ và quy định |
| OPEN-04 | Có bổ sung “Viết trước vở tập viết” vào danh sách chính thức không | Giáo viên quyết định |
| OPEN-05 | “Không tập trung giờ học” có mức trừ khác -1 không | Xác nhận cách áp dụng |
| OPEN-06 | Các ô điểm, quà hoặc điểm dư đang trống trong Excel | Kiểm tra từng trường hợp |
| OPEN-07 | Tiêu chí chính thức để chọn “Xuất sắc tháng” | Xác nhận quy định |
| OPEN-08 | Quy trình ghi nhận và phê duyệt sự việc | Xác nhận người phụ trách và cách xác minh |
| OPEN-09 | Quyền sửa điểm và yêu cầu ghi lý do sửa | Chốt theo quy trình của lớp/trường |

## 11. ĐIỀU KIỆN TRƯỚC KHI BẬT TÍNH ĐIỂM CHÍNH THỨC

- [ ] Các tiêu chí sử dụng đã được xác nhận.
- [ ] Các mức điểm mâu thuẫn đã được giải quyết.
- [ ] Ô điểm trống đã được giáo viên xử lý.
- [ ] Quy tắc tính quà và điểm dư đã được duyệt.
- [ ] Có kiểm thử các trường hợp 0, 9, 10, 19, 20, 28 và tổng điểm âm.
- [ ] Có kiểm thử trường hợp nói chuyện + nói leo = -2.
- [ ] Có kiểm thử chống tính trùng cùng một hành vi.
- [ ] Kết quả phần mềm được đối chiếu với ví dụ tính thủ công của giáo viên.
- [ ] Có cơ chế cảnh báo và truy vết phiên bản quy tắc.
- [ ] Có quy trình giáo viên kiểm tra và duyệt kết quả.

## 12. KẾ HOẠCH TRIỂN KHAI TIẾP THEO

**Bước 2 — Hoàn tất bộ quy tắc:** xử lý các mục còn mở, xác nhận danh sách tiêu chí và mức điểm chính thức.

**Bước 3 — Thiết kế dữ liệu:** xác định bảng học sinh ẩn danh, tiêu chí, sự việc, kỳ tổng kết, cảnh báo và nhận xét.

**Bước 4 — Xây dựng MVP:** nhập sự việc, tính điểm theo quy tắc được duyệt, cảnh báo dữ liệu, tổng kết tháng.

**Bước 5 — Tích hợp AI:** tạo bản nháp nhận xét và kế hoạch hỗ trợ, có cơ chế giáo viên sửa/duyệt.

**Bước 6 — Kiểm thử và đánh giá:** kiểm tra tính đúng đắn, đo thời gian thao tác, đánh giá chất lượng nhận xét và ghi lại hạn chế thực tế.

---

**Nguyên tắc cuối cùng:** Phần mềm hỗ trợ giáo viên quản lý minh chứng và ra quyết định có trách nhiệm; phần mềm và AI không thay thế vai trò chuyên môn của giáo viên.
