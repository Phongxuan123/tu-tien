# Giao diện thủy mặc

## Đã làm — 2026-11-15

- Áp dụng hướng demo 13: nền sơn thủy dịu, khung mực than có họa tiết trúc, tùng, nước; nhấn ngọc, đồng cũ và son.
- Menu 11 mục gọn bên trái; cảnh động ở giữa; bản đồ cuộc đời cuối cột phải.
- Giữ tốc độ gốc và phím tắt; Lưu luôn thấy, các công cụ âm thanh, AI, nhập/xuất nằm trong Tùy chọn.
- Chuyển trạng thái cảnh và chỉ số về gắn khung một lần, sau đó tiếp tục nhớ tùy chọn người chơi.
- Kiểm tra máy tính 1816 × 1000 và điện thoại 390 × 844: đủ nút, không tràn ngang, không lỗi JavaScript.
- Đối chiếu mô phỏng: 40 hạt giống trùng khít đường cơ sở; không đổi cân bằng.
- Cần người chơi thử độ dễ đọc trên màn hình thật và các hộp sự kiện dài.

Tài nguyên `assets/ink-world.png` và `assets/ink-ornaments.png` là ảnh tạo bằng AI cho giao diện; không thay các lớp cảnh pixel phản ánh trạng thái mô phỏng.

Kiểm tra giao diện: cài Playwright, đặt `NODE_PATH` nếu cần và `CHROMIUM_PATH` đến trình duyệt, chạy `node tools/check-ink-ui.js`.
- Bộ kiểm thử tổng run-tests.js: chưa xác nhận; tiến trình chạy kéo dài không trả kết quả, đã dừng. Kiểm tra giao diện riêng và baseline hoàn tất.
