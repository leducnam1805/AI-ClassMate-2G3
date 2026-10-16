# 📋 ĐẶC TẢ YÊU CẦU PHẦN MỀM & NGHIỆP VỤ SƯ PHẠM (SRS)
## DỰ ÁN: AI ClassMate 2G3 — Trợ Lý Theo Dõi & Phát Huy Sự Tiến Bộ Học Sinh Tiểu Học

- **Đơn vị thực nghiệm:** Lớp 2G3 — Trường Tiểu học Núi Thành (Phân hiệu 6)
- **Hội thi:** Ngày hội Nhà giáo sáng tạo với công nghệ số và trí tuệ nhân tạo 2026
- **Cơ sở pháp lý:** Công văn số 4723/UBND-VHXH ngày 07/10/2026
- **Mã tài liệu:** `ACM2G3-SRS-V1.0`
- **Phiên bản:** 1.0 (Chuẩn hóa)

---

## 1. TỔNG QUAN & MỤC TIÊU NGHIÊN CỨU

### 1.1. Mục tiêu sư phạm
Không dừng lại ở việc tính điểm thưởng/phạt đơn thuần, hệ thống xây dựng một **vòng lặp đồng hành sư phạm khép kín**:
$$\text{Ghi nhận minh chứng} \longrightarrow \text{Phân tích số liệu} \longrightarrow \text{Hỗ trợ sư phạm} \longrightarrow \text{Theo dõi tiến bộ} \longrightarrow \text{Điều chỉnh biện pháp}$$

### 1.2. Đối tượng thụ hưởng
1. **Giáo viên chủ nhiệm (GVCN):** Giảm tải 90%+ thời gian ghi chép, cộng trừ thủ công và viết nhận xét cá nhân hóa cuối tháng; kịp thời phát hiện học sinh cần hỗ trợ rèn luyện.
2. **Học sinh lớp 2 (7-8 tuổi):** Được khích lệ kịp thời qua hệ thống điểm thưởng quà, không bị dán nhãn tiêu cực, theo dõi được sự tiến bộ của bản thân theo từng tuần.
3. **Phụ huynh học sinh:** Nhận thông tin đa chiều, dựa trên minh chứng rõ ràng và giải pháp đồng hành tích cực tại nhà.
4. **Ban Giám Hiệu:** Có số liệu đối chứng khoa học, báo cáo trực quan phục vụ công tác quản lý giáo dục.

---

## 2. BẢNG TIÊU CHÍ THI ĐUA CHUẨN HÓA (ĐÃ ĐỐI CHỨNG EXCEL & NỘI QUY)

### 2.1. Tiêu chí Điểm Trừ (Rèn luyện hành vi)
| Mã | Tên hành vi chuẩn hóa | Tên gọi gốc trong ghi chép | Mức điểm | Quy tắc áp dụng |
|:---:|---|---|:---:|---|
| **P-01** | Vi phạm cờ đỏ | Vi phạm cờ đỏ | **-10** | Trừ trực tiếp khi bị Đội sao đỏ / Ban thi đua toàn trường ghi nhận. |
| **P-02** | Xô xát / Đánh bạn | Đánh lọn / Đánh bạn | **-10** | Hành vi bạo lực học đường; bắt buộc GVCN trao đổi riêng và phối hợp phụ huynh. |
| **P-03** | Rời vị trí, đi lại tự do trong giờ | Đi lung tung | **-2** | Vi phạm nề nếp di chuyển trong lớp học. |
| **P-04** | Nói chuyện riêng | Nói chuyện | **-1** | Làm ồn, ảnh hưởng việc học của bạn. |
| **P-05** | Tự ý phát biểu khi chưa xin phép | Nói leo | **-1** | Cắt lời cô giáo hoặc bạn. Nếu vừa nói chuyện vừa nói leo tính tổng -2 (BR-007). |
| **P-06** | Thiếu đồ dùng, sách vở học tập | Không mang sách vở, dụng cụ | **-1** | Quên sách, vở bài tập, bảng con, bút chì. |
| **P-07** | Mất tập trung trong giờ học | Không tập trung giờ học | **-1** | Ngơ ngác, nghịch đồ chơi cá nhân (ghi nhận theo từng lần nhắc nhở). |
| **P-08** | Viết trước vở tập viết khi chưa hướng dẫn | Viết trước vở tập viết | **-1** | Tiêu chuẩn chữ viết lớp 2 cần đúng quy trình giảng dạy của giáo viên. |

### 2.2. Tiêu chí Điểm Cộng (Khuyến khích rèn luyện)
| Mã | Tên hành vi chuẩn hóa | Tên gọi gốc | Mức điểm | Ý nghĩa giáo dục |
|:---:|---|---|:---:|---|
| **B-01** | Hăng hái phát biểu xây dựng bài | Phát biểu | **+1** | Khích lệ sự tự tin trước tập thể. |
| **B-02** | Vở sạch, chữ đẹp, làm bài tốt | Điểm cộng vở | **+1** | Rèn tính cẩn thận, chỉn chu. |
| **B-03** | Tích cực tham gia vệ sinh, trực nhật | Tham gia dọn vệ sinh | **+1** | Giáo dục tinh thần lao động, giữ gìn vệ sinh chung. |
| **B-04** | Giúp đỡ bạn bè trong học tập / sinh hoạt | Giúp đỡ bạn | **+1** | Giáo dục lòng nhân ái, tình bạn và tinh thần sẻ chia. |
| **B-05** | Tích cực tham gia trò chơi học tập | Tham gia trò chơi học tập | **+1** | Tinh thần đồng đội và năng lượng học tập tích cực. |

---

## 3. BỘ QUY TẮC TÍNH TOÁN & NGHIỆP VỤ (BUSINESS RULES ENGINE)

- **BR-001 (Tính toàn vẹn dữ liệu):** Ô dữ liệu trống nghĩa là *chưa ghi nhận / chưa xác nhận*, tuyệt đối không tự ý gán là số 0.
- **BR-002 (Bảo toàn dữ liệu gốc):** Không bao giờ ghi đè trực tiếp lên lịch sử ghi nhận thi đua. Mọi thao tác sửa đổi phải lưu vết (Ai sửa, thời gian nào, lý do gì).
- **BR-003 (Công thức quà tặng):**
  $$\text{Số quà} = \begin{cases} \lfloor \text{Tổng điểm} / 10 \rfloor & \text{khi } \text{Tổng điểm} \ge 10 \\ 0 & \text{khi } \text{Tổng điểm} < 10 \end{cases}$$
- **BR-004 (Xử lý điểm lẻ & điểm âm):**
  - **Khi Tổng điểm $\ge 0$:** Điểm dư tháng = $\text{Tổng điểm} \pmod{10}$. Điểm dư được lưu vào hồ sơ tích lũy để giáo viên khen thưởng linh hoạt.
  - **Khi Tổng điểm $< 0$:** Số quà nhận là **0**. Không dán nhãn âm lên bảng thi đua công khai của lớp để bảo vệ tâm lý lứa tuổi tiểu học; điểm âm chuyển thành *Mục tiêu rèn luyện trọng tâm tháng tiếp theo*.
- **BR-005 (Tránh trùng lặp hành vi):** Không ghi nhận trùng cùng một sự việc/hành vi trong cùng một thời điểm đánh giá.

---

## 4. MA TRẬN 6 PHÂN HỆ CHỨC NĂNG CỦA ỨNG DỤNG

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AI CLASSMATE 2G3 PLATFORM                       │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 1. Bảng điều hành │ 2. Bảng thi đua & │ 3. Trợ lý nhận xét AI          │
│    lớp (Dashboard)│    kiểm toán số   │    (Cá nhân hóa theo minh chứng│
├───────────────────┼───────────────────┼────────────────────────────────┤
│ 4. Hồ sơ cá nhân &│ 5. Minh chứng     │ 6. Cấu hình quy tắc            │
│    tiến bộ học sinh│    NCKH & Báo cáo │    (Business Rules Engine)     │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

1. **Phân hệ 1: Bảng điều hành lớp (Dashboard View):**
   - Hiển thị sĩ số, phân bố học sinh tích cực / học sinh cần hỗ trợ rèn luyện.
   - Thống kê tổng số quà thưởng dự kiến toàn lớp trong tháng.
   - Cảnh báo dữ liệu có dấu hiệu bất thường để giáo viên rà soát ngay.

2. **Phân hệ 2: Bảng thi đua & Kiểm toán sai sót (Audit Table View):**
   - Bảng nhập liệu ma trận tuần 1 $\to$ tuần 4 cho từng học sinh.
   - Thuật toán kiểm toán số tự động phát hiện 100% lỗi logic cộng trừ so với bảng tay truyền thống.

3. **Phân hệ 3: Trợ lý AI sinh nhận xét sư phạm (AI Assistant View):**
   - Sinh tự động dự thảo lời nhận xét cuối tháng dựa trên dữ liệu minh chứng thực tế của từng em.
   - Hỗ trợ các tone giọng sư phạm: *Khích lệ truyền cảm hứng*, *Nhẹ nhàng uốn nắn*, *Ngắn gọn súc tích*.
   - Cho phép giáo viên đọc, chỉnh sửa câu chữ và phê duyệt trước khi gửi.

4. **Phân hệ 4: Hồ sơ cá nhân hóa & Kế hoạch chủ nhiệm (Student Profile View):**
   - Biểu đồ biến thiên nề nếp qua các tuần.
   - Đề xuất biện pháp can thiệp sư phạm phù hợp với từng nhóm hành vi.
   - Mẫu tin nhắn sẵn gửi phụ huynh để phối hợp giáo dục tại nhà.

5. **Phân hệ 5: Báo cáo in ấn & Minh chứng NCKH (Research Report View):**
   - Bảng số liệu đối chứng định lượng: Thời gian xử lý (440 phút $\to$ 28 phút), độ chính xác (sai sót 15.38% $\to$ 0%).
   - Hỗ trợ xuất mẫu biểu in ấn tổng kết tháng dán góc thông báo của lớp.

6. **Phân hệ 6: Quản lý quy tắc nghiệp vụ (Rules Settings View):**
   - Tra cứu và tùy chỉnh linh hoạt các ngưỡng điểm thưởng, quy định cờ đỏ mà không cần sửa code.

---

## 5. YÊU CẦU PHI CHỨC NĂNG & ĐẠO ĐỨC TRÍ TUỆ NHÂN TẠO TRONG GIÁO DỤC

1. **An toàn & Bảo mật dữ liệu học sinh (Data Privacy):**
   - Hệ thống chạy mạng nội bộ / offline SQLite, không lưu trữ thông tin nhạy cảm của học sinh lên máy chủ công cộng chưa được phê duyệt.
   - Dữ liệu gửi đến AI chỉ bao gồm chuỗi hành vi và tên gọi thông dụng, không gửi thông tin định danh cá nhân chi tiết.
2. **Nguyên tắc "Human-in-the-loop" (Giáo viên là người quyết định tối cao):**
   - AI chỉ giữ vai trò **Trợ lý đề xuất** (Draft Generator), không thay thế quyền đánh giá, khen thưởng hay kỷ luật của nhà giáo.
   - Mọi nhận xét bắt buộc phải qua bước giáo viên "Phê duyệt" (Approved) mới có hiệu lực.
3. **Tính dễ dùng đối với giáo viên tiểu học:**
   - Thao tác một chạm (1-Click Audit, 1-Click Draft Comment).
   - Giao diện trực quan, màu sắc thân thiện, font chữ chuẩn tiếng Việt rõ ràng.
