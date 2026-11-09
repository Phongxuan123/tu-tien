# U. Phím tắt, tự bán đồ sắp hỏng, hạn dùng đồ (đợt T2)

Trạng thái: đã làm (2026-11-07). Cần người chơi kiểm bằng tay.

## 1. Phím tắt (`js/ui/keys.js`)
Không bắt phím khi đang gõ vào ô nhập chữ. Phím số 1-9 chọn lựa chọn đã có sẵn ở `panels.js`.

**Khi có hộp quyết định**
| Phím | Làm gì |
|---|---|
| 1 đến 9 | Chọn lựa chọn theo số |
| Enter hoặc Space | Hộp một lựa chọn: bấm luôn. Có lựa chọn kiểu xác nhận (`ok`, `nhan`, `quay`): bấm lựa chọn đó. Hộp nhiều lựa chọn khác: lần 1 làm sáng lựa chọn mặc định, lần 2 mới chọn |
| ↑ ↓ | Di chuyển mục sáng |
| R | Đổi lại: lựa chọn có khóa `doi` (Thiên cơ điểm khi đột phá hỏng) hoặc `lai` (quay lại vòng quay) |
| Esc hoặc N | Lựa chọn có khóa `thoi` (chấp nhận thất bại, không đổi) |

Chống lỡ tay: không nhận Enter/Space trong 250 ms đầu sau khi hộp mới hiện, và bỏ qua phím giữ lặp.
Chân hộp quyết định hiện dòng gợi ý phím theo từng hộp.

**Khi không có hộp**
| Phím | Làm gì |
|---|---|
| Space | Tạm dừng hoặc chạy tiếp (nhớ tốc độ trước đó) |
| 0 đến 5 | Tạm dừng, x1, x2, x4, x8, x16 |
| T | Tua tới sự kiện kế tiếp |
| A | Đổi mức tự động (thủ công, cân bằng, tự động) |
| M | Bật hoặc tắt âm thanh |
| ← → | Chuyển tab bên trái |
| C, B, Q, K, X | Hồ sơ, Hành trang, Nhiệm vụ, Công pháp, Quan hệ |
| S, F, J, N, L | Tông môn, Gia đình, Nghề, Nhật báo, Biên niên sử |
| Ctrl + S | Lưu game |
| ? hoặc F1 | Bảng phím tắt (cũng có nút "Phím tắt" ở thanh trên) |

Nút gợi ý thêm sau này: phím cho các nút chuẩn bị đột phá (Phá Cảnh Đan, động phủ), nhảy tới người ở cùng vùng, mở bản đồ lớn.

## 2. Tự bán đồ sắp hỏng
Nguyên nhân người chơi thấy "không chạy":
- Chế độ **thủ công** tắt hẳn việc này (có chủ ý ở bản cũ nhưng không ai báo).
- Cửa sổ chỉ **3 tháng cuối**; nếu lúc đó đang đi đường, trong bí cảnh hoặc ở nơi không thu món đó thì không tự bán được, tới hạn thì mất trắng.
- Bán không được (hết hạn mức giao dịch tháng, không cửa hàng thu) thì im lặng.

Đã sửa: cửa sổ thử là **6 tháng cuối** (`D.ECO.decay.rescue`); chạy ở mọi mức tự động; ô "Tự bán đồ sắp hỏng" trên thanh trên (mặc định bật, `TT.world.settings.autoSell`); chưa bán được thì nhật ký nói lý do (ở mốc 3 tháng cuối). Ở tông môn thì hiến kho tông, ở nơi có cửa hàng thì bán.

Đo 12 hạt giống x 40 năm (chồng hết hạn, hạ được/đã tự xử lý): cân bằng 13 hết hạn, 13 tự bán; tự động 26 và 16; thủ công 33 và 0. Sau đợt này: 8 và 7; 9 và 3; 11 và 4. Các chồng còn hết hạn là do lúc đó người chơi không ở nơi bán được.

## 3. Hạn dùng đồ
Đan 18 thành 120 tháng, bùa 24 thành 180, linh thảo 12 thành 96 (gấp 6,7; 7,5; 8). Giá bán vẫn giảm dần theo hạn (còn 40% ở 3 tháng cuối), nên đồ cũ rẻ chậm hơn. Túi đồ và cửa hàng hiện "x năm y tháng" khi còn từ 24 tháng trở lên.
Bản lưu cũ: số tháng còn lại giữ nguyên (không nhân), nên đồ đang dở vẫn hết theo hạn cũ, đồ mua mới theo hạn mới.

## 4. Kiểm
- `node tools/baseline.js --check`: trùng khít 40 hạt giống (hạn dùng chỉ ảnh hưởng túi đồ người chơi, không đổi thế giới).
- `node tools/run-tests.js`: thêm kiểm tra tự bán ở chế độ thủ công và tắt bằng ô; sửa kiểm tra hạn dùng cộng dồn cho hạn mới.
- Phím tắt kiểm bằng Chromium không giao diện: R, Esc, Enter, Space, ↑↓, 0 đến 5, B, ←→, ?.
