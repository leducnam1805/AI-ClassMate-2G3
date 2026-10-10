# UI Screen — Trợ lý AI / Nhận xét học sinh

## 1. Mục tiêu
Hỗ trợ giáo viên soạn bản nháp nhận xét hoặc gợi ý hỗ trợ dựa trên dữ liệu được phép sử dụng; giáo viên chịu trách nhiệm kiểm tra và quyết định cuối cùng.

## 2. Bố cục
- Chọn học sinh và tháng/kỳ (nếu endpoint yêu cầu).
- Tóm tắt dữ liệu nguồn đang được sử dụng; chỉ hiển thị trường cần thiết.
- Khu vực yêu cầu tạo nhận xét/gợi ý.
- Khu vực kết quả có nhãn nổi bật “BẢN NHÁP DO AI ĐỀ XUẤT”.
- Trường chỉnh sửa nội dung.
- Nút: Tạo bản nháp, Duyệt, Từ chối. Chỉ hiển thị khi có endpoint và trạng thái tương ứng.

## 3. Quy trình
1. Giáo viên chọn đúng học sinh/kỳ.
2. UI cho biết dữ liệu đầu vào có thiếu hoặc chưa xác minh hay không.
3. Giáo viên yêu cầu tạo bản nháp.
4. Server gọi AI; API key chỉ nằm ở server.
5. UI hiển thị bản nháp, nguồn/ngữ cảnh phù hợp và cảnh báo cần kiểm tra.
6. Giáo viên sửa nội dung và duyệt hoặc từ chối.
7. Chỉ nội dung đã duyệt mới được coi là nhận xét chính thức.

## 4. Giới hạn an toàn
- Không chẩn đoán sức khỏe/tâm lý.
- Không suy luận hoàn cảnh gia đình, phẩm chất hoặc ý định của học sinh.
- Không dùng từ ngữ làm nhục, gán nhãn cố định hoặc so sánh hạ thấp học sinh.
- Ưu tiên mô tả hành vi quan sát được, tiến bộ cụ thể và gợi ý hỗ trợ tích cực.
- Nếu dữ liệu đầu vào chưa xác minh, AI không được trình bày giả định như sự thật.
- Không gửi nhiều dữ liệu cá nhân hơn mức cần thiết đến nhà cung cấp AI.

## 5. API liên quan dự kiến
- `POST /ai/comments/draft`
- `POST /ai/comments/{commentId}/approve`
- `POST /ai/comments/{commentId}/reject`

Đối chiếu đường dẫn thực tế, request/response và trạng thái trong API Design.

## 6. Trạng thái
Idle, generating, draft ready, generation failed, edited, approved, rejected. Chỉ dùng trạng thái khớp contract backend.

## 7. Tiêu chí nghiệm thu
- Người dùng nhận biết ngay đâu là bản nháp AI.
- Không tự động duyệt/phát hành.
- Có thể chỉnh sửa trước khi duyệt.
- Lỗi từ AI không làm mất dữ liệu đã nhập.
- Không có API key hoặc thông tin bí mật trong bundle client.
