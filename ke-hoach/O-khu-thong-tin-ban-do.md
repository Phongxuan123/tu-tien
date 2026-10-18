# Khu thông tin dưới bản đồ (gọn lại) và ý tưởng tiếp

- Trạng thái: Bản gọn đã code (2026-10-17); các ý tưởng còn lại chờ bạn chọn
- Liên quan: J-ban-do-vung.md, N-tai-nguyen-ban-do.md, M-tong-mon.md (Vượt vùng chuyển sang tab Tông môn), G-nhat-bao.md (tin thiên hạ)

## 1. Yêu cầu của bạn
Khối thông tin địa điểm dưới bản đồ hơi thừa:
- Linh khí, nguy hiểm, phồn hoa: xem ở bản đồ hoặc gộp vào tổng quan.
- Môi trường và thời tiết: đưa xuống dưới bản đồ.
- Vượt vùng: để ở mục Tông môn và khóa, đủ điều kiện mới tiếp cận.
- Địa điểm tông: biểu tượng là cổng dịch chuyển.
- Thêm ý tưởng cho khu bên dưới và đưa vào kế hoạch.

## 2. Đã làm (bản gọn)
- Ba thanh Linh khí, Nguy hiểm, Phồn hoa thành một hàng nhãn nhỏ cùng "Hợp tư chất" (rê chuột để xem giải thích). Rê chuột lên địa điểm trên bản đồ cũng hiện ba chỉ số này.
- Khối tài nguyên thu thành một dòng (biểu tượng, sao, chỉ ghi kho khi dưới 60%); bỏ câu giải thích dài (còn trong chú giải khi rê chuột).
- Môi trường và thời tiết của vùng nằm thành một dải ngay dưới bản đồ, cập nhật theo tháng (kháng, thời gian còn, lợi và hại).
- "Vượt vùng" chuyển sang tab Tông môn (mục riêng khi đã vào tông, và ở cuối tab khi chưa vào tông). Còn khóa thì chỉ hiện khung "Đang khóa" kèm điều kiện còn thiếu của từng lối đi; chỉ cần đủ điều kiện một lối thì mở đủ các lối đi để chọn.
- Địa điểm tông môn dùng biểu tượng cổng dịch chuyển (hai trụ đá, xà ngang, vòng xoáy) trên bản đồ vùng.

## 3. Ý tưởng cho khu bên dưới bản đồ (chờ chọn)
1. **Tab con cho khối địa điểm:** Tổng quan, Tài nguyên, Người ở đây, Dịch vụ; chỉ mở cái đang cần, khu dưới bản đồ đỡ dài.
2. **"Việc nên làm ở đây":** gợi ý theo nơi đang đứng và nghề, đạo, nhiệm vụ của bạn (ví dụ: mỏ giàu quặng và bạn là thợ rèn, nhiệm vụ "đạt Luyện Khí" cần linh mạch).
3. **Bộ lập lộ trình:** chọn mục tiêu (tìm quặng, dược liệu, yêu thú, tông môn, người quen) thì tính đường ngắn nhất, tổng tháng, nguy hiểm, đặt điểm đến nhiều chặng.
4. **Dải "Sắp tới":** đếm ngược đại bỉ của tông, mùa tuyển đệ tử, đổi thời tiết, mùa tài nguyên hồi, thương đoàn ghé, phiên chợ.
5. **Tin địa phương:** tin đồn, chiến sự, giá cả trong vùng (lọc từ nhật báo G) thay khung "Thiên hạ", không phải cuộn tin cả thế giới.
6. **Đánh dấu địa điểm và khu:** ghim kèm ghi chú ("mỏ này cạn, quay lại sau 3 năm"), nối với mục Đánh dấu của Hồ sơ.
7. **Nhiều lớp bản đồ:** tài nguyên (đã có), nguy hiểm (nền đỏ theo mức), thế lực (tô màu lãnh thổ theo vương triều, tông), giá cả (khi làm kinh tế), người quen (chấm tên bạn bè).
8. **Thanh hành trình:** khi đang đi đường hoặc tới khu hiện tiến độ, sự kiện dọc đường, nút đổi hướng hoặc nghỉ chân.
9. **So sánh hai nơi:** chọn hai địa điểm, so thời gian, nguy hiểm, tài nguyên, dịch vụ để quyết định.
10. **Sương mù khám phá:** khu tài nguyên hay địa điểm chưa nghe tin thì mờ; hỏi thăm ở tửu lâu, đi thám hiểm hoặc nhờ thợ săn dẫn đường để mở.
11. **Người quen ở gần:** liệt kê bạn bè đang ở nơi này hoặc kế bên, bấm là tìm gặp.

## 4. Kỹ thuật (bản gọn)
- `js/ui/map.js`: headLocal rút gọn, `resHtml` một dòng, `renderEnv` (dải `#map-env`), `ui.crossSection` (khóa, mở), biểu tượng tông là cổng dịch chuyển, `<title>` cho từng địa điểm.
- `js/ui/sect.js`: mục "Vượt vùng", cuối tab cho người chưa vào tông; key tab có thêm tình trạng lối đi.
- `index.html`, `css/style.css`: `#map-env`, `.pchips`, `.lockbox`.

## 5. Các chặng
- [x] Gọn khối địa điểm, dải môi trường và thời tiết, Vượt vùng sang tab Tông môn có khóa, biểu tượng tông
- [ ] Chọn trong các ý tưởng mục 3 để làm tiếp (đề nghị: 4 dải Sắp tới, 7 lớp thế lực và nguy hiểm, 3 lộ trình)

## 6. Còn mở
- Biểu tượng cổng dịch chuyển đã áp cho bản đồ vùng; còn công trình "Sơn môn" trong phố nhân vật (bldart) chưa đổi, bạn có muốn đổi cùng không?
- Lối vượt vùng bằng đại trận tông môn chỉ hiện đúng chỗ khi bạn đang đứng ở nơi có lối đi (cửa ải, tông môn, truyền tống trận cổ). Bạn có muốn xem trước lối đi từ xa (mờ) không?

## 7. Nhật ký làm việc
- 2026-10-17: làm bản gọn theo ý bạn; ghi ý tưởng.

## 8. Bản 2: bỏ hết thông tin nơi đang ở khỏi cột phải (2026-10-17)
Theo ý bạn "bỏ hết mấy cái trên đi, giữ người ở đây thôi; muốn xem thông tin nơi đang ở thì vào công trình đại diện":
- Cột phải chỉ còn: tên nơi và nút "Đi tới" (hoặc "Bạn đang ở đây"), rồi danh sách "Người ở đây". Chip linh khí, nguy hiểm, phồn hoa, tài nguyên, khối tông môn, bí cảnh đều bỏ khỏi đây. Rê chuột lên địa điểm trên bản đồ vẫn xem được ba chỉ số.
- Thông tin chi tiết (thế lực, chỉ số, tài nguyên, khu tài nguyên quanh đây, và khối tông môn kèm nút xin gia nhập) nằm trong cửa sổ của công trình đại diện, chỉ xem được khi đứng ở nơi đó: tông môn: Sơn môn; thôn trấn: Nhà trưởng thôn (công trình mới, có hỏi thăm tin tức miễn phí); thành trì: Nha môn (đổi tên từ Quan phủ); cứ địa bộ tộc: Lều tộc trưởng; cửa ải: Cổng ải.
- Tàn tích và hung địa nay có "Cổng thám hiểm" (trước đây vào qua khối thông tin ở cột phải), để không mất lối vào hầm.
- Cổng ải trỏ sang mục "Vượt vùng" của tab Tông môn thay vì mở Đại địa đồ.
- Nơi không có công trình đại diện (linh mạch...) thì chỉ xem được tooltip trên bản đồ.
- Kỹ thuật: `ui.placeInfo(p, pl)` trong `js/ui/map.js`; dịch vụ có cờ `info`; `js/ui/shop.js` vẽ khối này; `js/ui/bldart.js` thêm công trình `thon` và đổi tên `quan` thành Nha môn, `cua` thành Cổng thám hiểm.