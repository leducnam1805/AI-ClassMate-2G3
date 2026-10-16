# AI ClassMate 2G3 — Quy tắc nghiệp vụ

- **Mã tài liệu:** ACM2G3-BR
- **Phiên bản:** 1.0
- **Trạng thái:** Đang áp dụng cho phạm vi quy tắc đã xác nhận
- **Dự án:** AI ClassMate 2G3
- **Tài liệu liên quan:** `AI_ClassMate_2G3_Quy_Tac_Chua_Xac_Nhan.md`

> Chỉ các quy tắc được xác nhận trong tài liệu này mới được dùng làm quy tắc chính thức. Các nội dung chưa xác nhận phải được theo dõi trong tài liệu liên quan; không tự suy diễn hoặc tự đặt ra quy tắc thay thế.

---

## 1. Phạm vi

Tài liệu ghi nhận các quy tắc đã được giáo viên xác nhận liên quan đến dữ liệu điểm thi đua, tính số quà, điểm dư và cách xử lý dữ liệu thiếu hoặc mâu thuẫn.

## 2. Quy tắc nghiệp vụ đã xác nhận

### BR-001 — Ô điểm bị trống phải được rà soát

Ô điểm bị trống là dữ liệu chưa được xác nhận, không được tự động xem là 0.

- Đánh dấu ô trống là cần kiểm tra.
- Không tự điền 0 vào dữ liệu gốc.
- Không chốt kết quả chính thức nếu ô trống có thể ảnh hưởng đến tổng điểm.
- Chỉ ghi nhận 0 khi dữ liệu được xác nhận là không phát sinh điểm hoặc người có thẩm quyền chủ động nhập 0.

### BR-002 — Vi phạm cờ đỏ trừ 10 điểm

Một bản ghi vi phạm cờ đỏ hợp lệ được áp dụng mức trừ **10 điểm**.

Nếu dữ liệu lịch sử có mức điểm khác -10, đánh dấu cần rà soát; không âm thầm sửa dữ liệu cũ.

### BR-003 — Tổng điểm âm thì không có quà

Nếu tổng điểm âm:
- Số quà bằng `0`.
- Giữ nguyên tổng điểm âm.
- Điểm dư không áp dụng; để trống hoặc hiển thị `N/A`.
- Không áp dụng công thức điểm dư thông thường cho tổng điểm âm.

**Ví dụ:** Tổng điểm `-8` thì số quà `0`, tổng điểm vẫn là `-8`, điểm dư là `N/A`.

### BR-004 — Không tự sửa dữ liệu

Hệ thống không được tự sửa hoặc âm thầm ghi đè dữ liệu nguồn.

Mọi thay đổi dữ liệu đã nhập phải có xác nhận phù hợp. Thiết kế hệ thống cần hỗ trợ lưu giá trị trước và sau thay đổi, người thực hiện, thời gian và lý do khi điều chỉnh.

### BR-005 — Tính số quà khi tổng điểm không âm

Khi tổng điểm lớn hơn hoặc bằng `0`:

`Số quà = FLOOR(Tổng điểm / 10)`

**Ví dụ:** Tổng điểm `28` thì số quà bằng `2`.

### BR-006 — Tính điểm dư khi tổng điểm không âm

Khi tổng điểm lớn hơn hoặc bằng `0`:

`Điểm dư = Tổng điểm - (Số quà × 10)`

**Ví dụ:** Tổng điểm `28`, số quà `2`, điểm dư `8`.

Không dùng công thức này để tính điểm dư cho tổng điểm âm.

### BR-007 — Nói chuyện và nói leo trong cùng một lần ghi nhận

Nếu cùng một lần ghi nhận có cả hành vi nói chuyện và nói leo, tổng mức trừ là **2 điểm**: -1 điểm cho nói chuyện và -1 điểm cho nói leo.

Nếu không rõ các mục có thuộc cùng một lần ghi nhận hay không, đưa bản ghi vào danh sách cần rà soát.

### BR-008 — Không tính trùng cùng một hành vi trong cùng lần ghi nhận

Không tính trùng cùng một hành vi trong cùng một lần ghi nhận.

- Hệ thống có thể phát hiện và cảnh báo bản ghi có dấu hiệu trùng.
- Không tự xóa bản ghi trùng khi chưa có xác nhận.
- Không gộp các hành vi khác nhau thành một hành vi nếu chưa có quy tắc được xác nhận.

### BR-009 — Danh mục chuẩn hóa 13 tiêu chí thi đua (Theo SRS v1.0)

Căn cứ theo Đặc tả Yêu cầu Nghiệp vụ SRS v1.0 (`ACM2G3-SRS-V1.0`), danh mục 13 tiêu chí thi đua chính thức gồm:

**1. Tiêu chí Điểm Trừ:**
- `P-01`: Vi phạm cờ đỏ (−10 điểm).
- `P-02`: Xô xát / Đánh bạn (−10 điểm) — Chuẩn hóa từ "Đánh lọn/Đánh bạn", yêu cầu trao đổi riêng và phối hợp phụ huynh.
- `P-03`: Rời vị trí, đi lại tự do trong giờ (−2 điểm) — Chuẩn hóa từ "Đi lung tung".
- `P-04`: Nói chuyện riêng (−1 điểm).
- `P-05`: Tự ý phát biểu khi chưa xin phép (−1 điểm) — Chuẩn hóa từ "Nói leo".
- `P-06`: Thiếu đồ dùng, sách vở học tập (−1 điểm).
- `P-07`: Mất tập trung trong giờ học (−1 điểm/lần nhắc nhở).
- `P-08`: Viết trước vở tập viết khi chưa hướng dẫn (−1 điểm).

**2. Tiêu chí Điểm Cộng:**
- `B-01`: Hăng hái phát biểu xây dựng bài (+1 điểm).
- `B-02`: Vở sạch, chữ đẹp, làm bài tốt (+1 điểm).
- `B-03`: Tích cực tham gia vệ sinh, trực nhật (+1 điểm).
- `B-04`: Giúp đỡ bạn bè trong học tập / sinh hoạt (+1 điểm).
- `B-05`: Tích cực tham gia trò chơi học tập (+1 điểm).

### BR-010 — Bảo vệ tâm lý học sinh tiểu học đối với điểm âm
Khi tổng điểm thi đua trong tháng bị âm:
- Tuyệt đối không dán nhãn hoặc công khai điểm số âm lên bảng thi đua công khai của lớp.
- Điểm âm được bảo lưu kín trong hồ sơ cá nhân của học sinh và chuyển thành *Mục tiêu rèn luyện trọng tâm tháng tiếp theo*.

---

## 3. Yêu cầu kiểm tra dữ liệu

Hệ thống cần kiểm tra:
- Tổng điểm có khớp với các bản ghi điểm cộng và điểm trừ đã xác nhận hay không.
- Số quà và điểm dư có khớp công thức hay không.
- Có ô dữ liệu trống hoặc tiêu chí chưa xác nhận hay không.
- Có bản ghi nghi trùng hoặc mức điểm khác quy tắc hiện hành hay không.

Nếu còn dữ liệu thiếu hoặc có mâu thuẫn có thể làm thay đổi kết quả:
- Có thể hiển thị kết quả tạm tính nếu ghi nhãn rõ ràng.
- Phải hiển thị cảnh báo và lý do.
- Không được trình bày kết quả tạm tính như kết quả chính thức.

## 4. Vai trò của AI

AI ClassMate 2G3 có thể hỗ trợ:
- Phát hiện dữ liệu thiếu, không nhất quán hoặc có dấu hiệu trùng.
- Giải thích cảnh báo.
- Soạn nhận xét học sinh dưới dạng dự thảo dựa trên dữ liệu đã xác nhận.
- Đề xuất hướng hỗ trợ học sinh để giáo viên xem xét.

AI không được tự xác nhận quy tắc, tự sửa điểm hoặc dữ liệu gốc, tự quyết định danh hiệu “Xuất sắc tháng”, tự chốt tổng kết tháng hay công bố nhận xét chưa được giáo viên duyệt.

Mọi nhận xét do AI tạo ra phải là bản nháp để giáo viên xem, chỉnh sửa và phê duyệt (Nguyên tắc Human-in-the-loop).

## 5. Tiêu chí nghiệm thu nghiệp vụ

- [x] Ô điểm trống được đánh dấu cần rà soát, không tự coi là 0.
- [x] Vi phạm cờ đỏ được tính -10 điểm khi bản ghi đã được xác nhận.
- [x] Xô xát / Đánh bạn được tính -10 điểm và có cảnh báo hỗ trợ học sinh.
- [x] Tổng điểm âm cho kết quả 0 quà, không hiển thị điểm âm ra công khai.
- [x] Tổng điểm không âm được quy đổi quà theo công thức đã xác nhận.
- [x] Tổng điểm 28 cho kết quả 2 quà và dư 8.
- [x] Nói chuyện và nói leo trong cùng một lần ghi nhận được tính tổng -2 điểm.
- [x] Mất tập trung được tính -1 điểm/lần, viết trước vở tập viết tính -1 điểm.
- [x] Hệ thống cảnh báo bản ghi nghi trùng nhưng không tự xóa.
- [x] Không có dữ liệu nguồn bị sửa âm thầm.
- [x] Nhận xét AI chỉ được công bố chính thức sau khi giáo viên duyệt.

## 6. Nhật ký thay đổi

| Phiên bản | Ngày | Nội dung | Trạng thái |
|---|---|---|---|
| 1.0 | 2026-10-10 | Tổng hợp các quy tắc đã được xác nhận ban đầu (BR-001..BR-008) | Lưu trữ |
| 1.1 | 2026-10-13 | Đồng bộ 13 tiêu chí thi đua chuẩn hóa (BR-009) & bảo vệ tâm lý điểm âm (BR-010) theo SRS v1.0 | Đang áp dụng chính thức |

