# AI ClassMate 2G3 — Bước 1: Rà soát dữ liệu và quy tắc thi đua

**Ngày rà soát:** 10/10/2026  
**Nguồn được đối chiếu:**
1. `THI ĐUA THANG 9 LOP 2G3.xlsx`
2. `Danh sach dien thi dua tung hoc sinh.txt`

> **Nguyên tắc:** Đây là báo cáo rà soát, không phải bản sửa dữ liệu. Không tự suy đoán ô trống là 0 và không tự đổi mức điểm. Các mã HS001–HS026 dưới đây là mã ẩn danh được gán theo thứ tự dòng học sinh trong bảng nguồn; giáo viên cần đối chiếu mã trong tệp gốc khi xác minh.

## 1. Kết quả khảo sát cấu trúc Excel

- Bảng có **26 dòng học sinh**.
- Các cột chính: STT, họ tên, nam/nữ, điểm cộng, điểm trừ, nhận xét, tổng, số lượng quà, điểm dư.
- Cột **Tổng** có công thức dạng `=Dòng_điểm_cộng-Dòng_điểm_trừ` cho 26 dòng.
- Bảng có phần ghi danh sách “Xuất sắc tháng 9” ở cuối.
- Cột điểm cộng/điểm trừ và một số ô quà/điểm dư được lưu dưới dạng chuỗi hoặc để trống; cần chuẩn hóa kiểu dữ liệu trước khi nhập vào phần mềm.
- Trong bản Excel đọc được, công thức tổng tồn tại nhưng kết quả tính toán lưu sẵn không được cung cấp cho công cụ đọc tệp. Vì vậy, cần mở bằng Excel/LibreOffice để kiểm tra kết quả hiển thị thực tế trước khi chốt đối chiếu.

## 2. Các điểm dữ liệu cần giáo viên xác minh

| Mã học sinh ẩn danh | Vấn đề quan sát được | Việc cần xác minh |
|---|---|---|
| HS016 | Ô điểm cộng trống; nhận xét ghi “Phát biểu, điểm cộng ()” | Điểm cộng thực tế là 0 hay bị thiếu ghi nhận? |
| HS004, HS005 | Ô nhận xét cuối tháng trống | Có cần bổ sung nhận xét hay đây là chủ ý? |
| HS002, HS006, HS011, HS013, HS016, HS017, HS022, HS024 | Ô số lượng quà trống | Ô trống nghĩa là 0 quà, chưa tính, hay thiếu dữ liệu? |
| HS001, HS004, HS005 | Ô điểm trừ trống | Có thể hiểu là 0 điểm trừ không? Cần xác nhận quy ước nhập liệu. |
| HS013 | Tổng tính từ điểm cộng/trừ là -8 theo dữ liệu đang ghi, nhưng điểm dư ghi -9 | Cần xác minh điểm dư và quy tắc xử lý tổng điểm âm. |
| Nhiều dòng | Nhận xét có cách viết khác nhau, lỗi gõ hoặc gộp nhiều hành vi | Chuẩn hóa tên hành vi nhưng phải giữ nguyên dữ liệu gốc để truy vết. |

**Lưu ý:** Các mã trên chỉ phục vụ rà soát ẩn danh. Không dùng chúng để kết luận học sinh có vấn đề; đây là các điểm cần kiểm tra trong bảng dữ liệu.

## 3. Đối chiếu quy định điểm với cách ghi trong Excel

| Hành vi | Quy định trong tệp TXT | Ví dụ cách ghi trong Excel | Trạng thái |
|---|---:|---|---|
| Vi phạm cờ đỏ | -10 | Có ghi -5 và có ghi -10 | Chưa thống nhất |
| Không tập trung giờ học | -1 | Nhiều nhận xét ghi -3 | Chưa thống nhất |
| Nói chuyện | -1 | Có trường hợp ghi -1, -2, -3 hoặc -5 | Chưa thống nhất |
| Nói leo | -1 | Có trường hợp gộp “nói chuyện, nói leo” thành -4 hoặc -5 | Chưa rõ cách tính khi nhiều hành vi cùng lúc |
| “Đánh lọn” | -10 | Excel có ghi “Đánh bạn” -7 | Cần xác minh thuật ngữ và mức điểm; không tự coi hai cụm từ là một |
| Viết trước vở tập viết | Không thấy trong danh sách quy định | Excel có ghi -1 | Xác nhận có bổ sung thành tiêu chí chính thức không |
| Đi lung tung | -2 | Excel có ghi -2 | Khớp ở ví dụ được quan sát |
| Không mang sách vở/dụng cụ học tập | -1 | Chưa thấy ví dụ rõ trong phần nhận xét đã rà soát | Chưa đủ dữ liệu để xác minh cách áp dụng |
| Phát biểu/điểm cộng vở | +1 cho mỗi tiêu chí theo tệp TXT | Excel ghi tổng điểm cộng, ví dụ “điểm cộng vở, phát biểu (28)” | Cần làm rõ số trong ngoặc là tổng tích lũy của nhiều lần hay số điểm theo cách ghi khác |

## 4. Quy tắc tính quà và điểm dư: chưa đủ điều kiện tự động hóa

Tệp quy định ghi: **10 điểm được 1 món quà; lấy tổng điểm chia 10 để tính số quà cuối tháng.**

Cần giáo viên xác nhận các trường hợp chưa được mô tả rõ:

1. **Tổng điểm từ 0 trở lên:** số quà có lấy phần nguyên của `tổng điểm / 10` không? Ví dụ 28 điểm là 2 quà, dư 8 điểm.
2. **Tổng điểm âm:** học sinh nhận 0 quà và điểm dư âm, hay có quy tắc khác? Không nên áp dụng phép chia phần dư âm khi chưa thống nhất.
3. **Ô trống:** điểm cộng, điểm trừ, số quà và điểm dư để trống được hiểu là 0 hay là dữ liệu chưa nhập?
4. **Nhiều hành vi trong cùng một lần ghi nhận:** cộng dồn từng mức trừ hay dùng một mức chung?
5. **Sửa dữ liệu:** nếu giáo viên điều chỉnh điểm, số quà và điểm dư sẽ được tính lại theo quy tắc đã duyệt; cần lưu dấu vết thay đổi.

### Công thức kỹ thuật chỉ dùng sau khi được duyệt

Với tổng điểm không âm và quy tắc làm tròn xuống được giáo viên xác nhận:

- `Tổng điểm = Điểm cộng - Điểm trừ`
- `Số quà = FLOOR(Tổng điểm / 10)`
- `Điểm dư = Tổng điểm - Số quà × 10`

Không áp dụng công thức quà/điểm dư cho tổng âm cho đến khi có quyết định chính thức.

## 5. Quy trình hiện tại có thể mô tả từ hai tài liệu

1. Giáo viên ghi nhận điểm cộng, điểm trừ và mô tả hành vi/hoạt động trong bảng thi đua.
2. Bảng tổng hợp điểm cộng và điểm trừ để tính tổng.
3. Số quà và điểm dư được ghi ở các cột riêng.
4. Cuối tháng, giáo viên tổng kết và cần có nhận xét cho từng học sinh.
5. Danh sách “Xuất sắc tháng 9” được ghi ở phần cuối bảng.

**Phần chưa thể kết luận chỉ từ hai tài liệu:** ai ghi nhận sự việc hằng ngày, quy trình xác minh sự việc, tiêu chí chọn “Xuất sắc”, cách trao đổi với phụ huynh và thời gian giáo viên đang mất cho từng công đoạn. Cần hỏi/ghi nhận trực tiếp, không tự điền giả định vào báo cáo nghiên cứu.

## 6. Danh sách quyết định cần chốt trước khi code

Đánh dấu sau khi giáo viên đã xác nhận:

- [ ] Ô điểm cộng/điểm trừ trống được hiểu là 0 hay là dữ liệu thiếu.
- [ ] Mức trừ chính thức cho “vi phạm cờ đỏ”.
- [ ] Mức trừ chính thức cho “không tập trung giờ học”.
- [ ] Cách tính “nói chuyện” và “nói leo”, đặc biệt khi cùng xảy ra.
- [ ] Ý nghĩa chính xác của “Đánh lọn” và quan hệ (nếu có) với “Đánh bạn”.
- [ ] Có bổ sung “viết trước vở tập viết” vào quy định không.
- [ ] Cách tính số quà và điểm dư khi tổng điểm âm.
- [ ] Quy tắc xử lý điểm lẻ, điểm bằng 0 và số quà bằng 0.
- [ ] Tiêu chí chính thức để chọn “Xuất sắc tháng”.
- [ ] Ai có quyền sửa điểm và cách ghi lại lý do sửa.

## 7. Quyết định thiết kế phần mềm sau bước rà soát

1. **Không hard-code các mức điểm đang mâu thuẫn.** Đưa quy tắc vào cấu hình có trạng thái `DRAFT` / `APPROVED`.
2. Chỉ quy tắc `APPROVED` mới được dùng để tính điểm chính thức.
3. Tách **sự việc gốc** (hành vi, ngày, điểm, minh chứng/người ghi nhận) khỏi **tổng hợp theo tháng**.
4. Tính điểm bằng code theo quy tắc đã duyệt; không giao AI tính điểm.
5. Hiển thị cảnh báo dữ liệu thiếu/mâu thuẫn và yêu cầu giáo viên xác nhận.
6. AI chỉ tạo **bản nháp** nhận xét dựa trên dữ liệu đã xác minh; giáo viên được sửa, duyệt hoặc từ chối.
7. Dùng mã học sinh trong dữ liệu thử nghiệm và prompt AI; hạn chế quyền xem dữ liệu cá nhân.

## 8. Kết luận bước 1

**Đã hoàn thành khảo sát sơ bộ cấu trúc và đối chiếu quy tắc từ hai tài liệu.** Bảng hiện có đủ cơ sở để thiết kế quy trình nhập sự việc, tổng hợp điểm và hỗ trợ nhận xét, nhưng **chưa nên lập trình công thức quà/điểm dư chính thức** vì còn quy tắc chưa thống nhất và ô dữ liệu chưa rõ ý nghĩa.

### Bước tiếp theo

Giáo viên xác nhận các mục ở phần 6. Sau đó mới chuyển sang **Bước 2: chốt bộ quy tắc nghiệp vụ phiên bản 1**, rồi mới thiết kế dữ liệu và code chức năng tính điểm.
