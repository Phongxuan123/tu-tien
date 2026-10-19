# Bản đồ vùng: địa hình, khu vực, phóng to

- Trạng thái: Xong (bản 1)
- Ngày bắt đầu: 2026-10-16
- Liên quan: `js/ui/map.js`, `js/ui/terrain.js`, KE-HOACH.md mục 33; Đại địa đồ để nguyên, làm sau.

## 1. Mục tiêu và yêu cầu của bạn
"Đại địa đồ chưa cần dùng, tôi muốn bản đồ vùng làm đẹp hơn, thể hiện được địa hình, khu vực đó và có thể phóng to map lên nữa."

## 2. Thiết kế
- Mỗi vùng có nền địa hình vẽ theo thuật toán (nhiễu giá trị, hạt giống theo id vùng nên luôn giống nhau):
  - Trung Châu: đồng bằng, sông Hoàng Hà chảy qua các bến, ruộng quanh thành và thôn.
  - Đông Hải, Lôi Đảo: biển với đảo mọc quanh các địa điểm, đường đi là tuyến thuyền chấm trắng; Lôi Đảo có mây, sét.
  - Tây Thiên Sơn: dãy núi có đỉnh tuyết, bóng đổ từ góc trên trái. Nam Lâm: rừng rậm có sông. Bắc Cực: băng nguyên có hồ băng, đống tuyết.
  - Hỏa Diệm Sơn: đá đen, sông dung nham, núi lửa. Hoang Mạc: đụn cát, xương rồng, ốc đảo ở trạm. Vụ Trạch: đầm nước, lau sậy, cây chết, sương tím.
- Mỗi loại địa điểm có "vết" riêng trên nền: linh mạch phát sáng xanh, bí cảnh xoáy tím, hung địa đỏ có xương, tàn tích có cột đổ, mỏ có đá, cứ địa có lều, tông môn có vòng sáng, cửa ải có tường.
- 3 tên địa danh mờ cho mỗi vùng ("Biển Cát Kim Sa", "Hoàng Hà"...) đặt vào chỗ trống xa địa điểm.
- Địa điểm có biểu tượng riêng theo loại (thành, nhà, thuyền, quầy buôn, chùa, lều, tinh thể, cổng xoáy, cột đổ, hầm mỏ, quầy chợ đen, cổng ải) trên nền tối, tên có viền chữ để đọc được trên mọi nền.
- Đường là đường cong, viền tối + lõi sáng (đường bộ), hoặc chấm trắng (tuyến biển). Chấm "Bạn" đi theo đúng đường cong.
- Phóng to: cuộn chuột (quanh con trỏ), nút +/−, nhấp đúp, kéo để di chuyển, hai ngón trên điện thoại; tối đa 600%. Nút ◎ về chỗ bạn, ⟲ xem cả bản đồ, ⛶ toàn màn hình (Esc để thoát) có khung thông tin và nút "Đi tới" ngay trong chế độ này. Chữ phóng chậm hơn bản đồ nên vẫn gọn.

## 3. Kỹ thuật
- `js/ui/terrain.js` (mới): tạo canvas 2400x1680, bản nền 800x560 phóng 3 lần; cache theo vùng; xuất JPEG qua blob URL (bất đồng bộ, có dòng "Đang vẽ địa hình…").
- `js/ui/map.js`: `buildLocal` dùng ảnh nền, đường cong, biểu tượng; bộ điều khiển zoom/kéo/chụm; `renderInfo` cho chế độ toàn màn hình.
- `index.html` (khung `#map-box`, nút), `css/style.css`, `js/files.js` (thêm terrain.js).
- Không đổi dữ liệu game, không đổi lưu.

## 4. Các chặng
- [x] Bộ vẽ nền cho 9 vùng
- [x] Biểu tượng địa điểm, đường cong, tên địa danh
- [x] Zoom, kéo, chụm, toàn màn hình
- [x] Xem thử trên trình duyệt (Đông Hải, Hoang Mạc, Vụ Trạch, Hỏa Diệm Sơn; các vùng còn lại xem ảnh thu nhỏ)
- [ ] Chỉnh thêm vùng Bắc Cực và Nam Lâm sau khi xem kỹ ở cỡ lớn

## 5. Còn mở
- Đại địa đồ (9 vùng) vẫn kiểu cũ, làm sau theo yêu cầu.
- Có thể thêm sương mù chiến tranh: địa điểm chưa đến thì mờ.
- Cỡ ảnh nền khá nặng khi tạo lần đầu mỗi vùng (vài trăm ms đến vài giây tùy máy), sau đó nhớ lại.

## 6. Nhật ký làm việc
- 2026-10-16: làm terrain.js, đổi map.js; chỉnh lại sa mạc (đường đồng mức giống bản đồ địa hình, đổi thành đụn cát), băng nguyên (bớt nứt), dung nham (mảnh hơn); đổi PNG sang JPEG cho nhanh.
