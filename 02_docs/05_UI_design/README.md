# AI ClassMate 2G3 — UI Design

## Mục đích
Bộ tài liệu này mô tả thiết kế giao diện cho MVP AI ClassMate 2G3, làm cơ sở để triển khai Next.js + TypeScript + Tailwind CSS và đối chiếu với API/Database Design hiện có.

## Nguyên tắc
- Giao diện phục vụ giáo viên chủ nhiệm; ưu tiên thao tác nhanh, dễ kiểm tra và hạn chế nhập liệu sai.
- Không tự suy diễn quy tắc nghiệp vụ chưa được xác nhận. Những điểm còn thiếu được đánh dấu **CHỜ XÁC NHẬN**.
- Điểm, số quà và số dư được tính bằng logic xác định ở phía ứng dụng/server; AI chỉ tạo bản nháp nhận xét hoặc gợi ý hỗ trợ.
- Giáo viên phải xem lại, chỉnh sửa khi cần và xác nhận trước khi dùng nhận xét AI.
- Ô điểm để trống nghĩa là **chưa xác minh**, không tự hiểu là 0.
- Dữ liệu demo/tài liệu công khai dùng mã giả như `HS001`; không đưa dữ liệu định danh thật vào ảnh chụp màn hình hoặc bản demo.
- Không tạo bảng xếp hạng công khai theo từng học sinh.

## Danh sách tài liệu
1. `00_UI_Design_Convention.md` — quy ước chung.
2. `01_Dashboard.md` — tổng quan lớp.
3. `02_Student_List.md` — danh sách học sinh.
4. `03_Student_Profile.md` — hồ sơ học sinh.
5. `04_Behavior_Event_Management.md` — ghi nhận và xử lý sự kiện hành vi.
6. `05_Data_Review.md` — rà soát dữ liệu chưa đầy đủ / bất thường.
7. `06_Monthly_Summary.md` — tổng kết tháng.
8. `07_AI_Assistant.md` — tạo và duyệt bản nháp nhận xét AI.
9. `08_Settings_and_Criteria.md` — tiêu chí, quy tắc và cấu hình liên quan.

## Trạng thái
Đây là bản thiết kế UI v1 để thảo luận và triển khai. Các màn hình/API có thể cần điều chỉnh sau khi đối chiếu với bộ API Design và Database Design hiện hành.
