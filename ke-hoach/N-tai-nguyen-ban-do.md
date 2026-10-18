# Tài nguyên trên bản đồ

- Trạng thái: Bản 1 và Bản 2 (khu tài nguyên, đường mòn vạch đứt) đã code (2026-10-17)
- Liên quan: M-tong-mon.md (tài nguyên tông M5a), E-kinh-te.md (kinh tế sẽ dùng nguồn cung này), J-ban-do-vung.md (bản đồ vùng), B-nghe-nghiep.md (nghề thu hoạch)

## 1. Yêu cầu của bạn
"Làm luôn mấy cái tài nguyên trên map. Bạn nghĩ có những tài nguyên nào cần có?"

## 2. Những tài nguyên mình chọn (5 loại) và lý do
| Loại | Biểu tượng | Nguồn / mục đích | Ai thu |
|---|---|---|---|
| Linh mạch | ✧ | Linh khí dày, tu luyện nhanh (đã có trong chỉ số linh khí của địa điểm, nay hiện lên bản đồ) | Mọi người, tại chỗ |
| Mỏ linh thạch | ◈ | Tiền tệ thô của giới tu hành; thợ mỏ thỉnh thoảng nhặt được; tông và triều tranh nhau | Thợ mỏ |
| Khoáng thạch | ▲ | Quặng để luyện khí (nền của trang bị) | Thợ mỏ, người luyện khí |
| Linh thảo | ✿ | Dược liệu để luyện đan, chữa bệnh | Y sư, người luyện đan |
| Yêu thú | Ψ | Nanh, da, nội đan để luyện khí và bán | Thợ săn, lính đánh thuê |

Chọn năm loại vì mỗi loại nuôi một nghề đã có (thợ mỏ, thợ săn, y sư, đan sư, thợ rèn), mỗi loại gắn với vài loại địa điểm sẵn có, và đủ để sau này kinh tế (E) có nguồn cung có thật. Chưa làm: lương thực và nước (chờ F4 dân số), gỗ và đá xây dựng, cổ vật (đã có trong bí cảnh và tàn tích).

## 3. Quy tắc
- Mỗi địa điểm có mức 0 đến 3 cho từng loại, sinh tất định từ loại địa điểm, vùng và mã địa điểm (xem `js/data/resources.js`): mỏ giàu quặng, linh mạch có linh thạch, hung địa và bí cảnh giàu yêu thú, thôn trấn có ít dược liệu và thú, tông môn theo mỏ và hệ của tông (Bách Thảo Môn giàu dược liệu nhất). Vùng thêm đặc sản: Tây Thiên Sơn nhiều quặng, Nam Lâm nhiều dược liệu và yêu thú, Hỏa Diệm Sơn nhiều quặng và linh thạch, Vụ Trạch dược liệu, Hoang Mạc linh thạch, Bắc Cực và Đông Hải yêu thú.
- Thành trì, cửa ải, bến, trạm, chợ đen, thương đoàn không có tài nguyên.
- Mỗi loại có kho 0-100 ở từng địa điểm, hao khi thu hoạch và hồi 12 mỗi năm. Hệ số thu hoạch = (0,35 / 0,7 / 1,15 / 1,7 theo mức) x (0,4 + 0,6 x kho), còn 0,3 lần nếu kho dưới 15. Đang đi đường chỉ lượm lặt (0,35).
- Nghề thợ mỏ, thợ săn, y sư và các lần "đi tìm vật liệu" khi luyện khí, luyện đan dùng hệ số này, nên muốn nhiều phải tới nơi giàu. Thợ mỏ ở nơi có mỏ linh thạch thỉnh thoảng nhặt được 1 hạ phẩm.
- Chủ địa điểm: tông môn (nếu là tông), gia tộc có nhà ở đó, còn lại là vương triều của vùng (hiển thị, chưa có thu thuế tài nguyên).

## 4. Giao diện
- Bản đồ vùng: mỗi địa điểm có các huy hiệu tròn màu dưới tên (to dần theo mức, mờ đi khi kho cạn), chú giải ở góc dưới, nút ◈ bật tắt lớp tài nguyên (nhớ lựa chọn).
- Thông tin địa điểm: khối "Tài nguyên" với mức sao, thanh kho còn lại, chủ; trong chế độ toàn màn hình có dòng tóm tắt.

## 5. Kỹ thuật
- `js/data/resources.js` (D.RES, D.RES_BASE, D.RES_REGION, D.RES_RULES), `js/systems/resources.js` (TT.res: levels, stock, list, owner, power, level, take, yearly, summary), `js/systems/jobs.js` và `js/systems/craft.js` (dùng TT.res.power/take), `js/systems/world.js` (TT.res.yearly), `js/ui/map.js` và `css/style.css`.
- Kho lưu ở `world.resNodes[địa điểm][loại]`, chỉ ghi khi có hao hụt, khởi tạo muộn, không đổi `TT.VERSION`.

## 6. Các chặng
- [x] Dữ liệu và hệ thống TT.res
- [x] Nối nghề và luyện nghề
- [x] Lớp tài nguyên trên bản đồ vùng, khối thông tin
- [x] Kiểm thử
- [ ] Việc kế: NPC cũng thu hoạch làm kho hao; thu thuế tài nguyên cho chủ; tranh chấp tài nguyên làm lý do chiến tranh thật; thợ mỏ NPC; nhà đấu giá nguyên liệu (E, I4)

## 7. Còn mở
- Có muốn thêm lương thực và nước (cho dân số và thuế) khi làm F4 không?
- Chủ địa điểm có nên đổi chủ khi thắng trận (hiện chỉ chiếm "mỏ" ở mức tông, chưa gắn địa điểm cụ thể)?

## 8. Nhật ký làm việc
- 2026-10-17: viết dữ liệu, hệ thống, nối nghề, lớp bản đồ, kiểm thử.

## 9. Bản 2: khu tài nguyên và đường mòn vạch đứt (2026-10-17)
Theo ý bạn "nhớ hiện trên map và đường tới các khu này thể hiện bằng vạch đứt": thêm khu tài nguyên là vệ tinh của địa điểm, nối với địa điểm chủ bằng đường mòn nét đứt.
- Mỗi vùng có 6 khu (vỉa quặng, bãi thảo dược, săn trường, vỉa linh thạch), loại chọn theo đặc sản vùng, sinh tất định theo vùng và vị trí địa điểm (trong `TT.res.zones`). Mức 2 đến 3 sao, giàu hơn địa điểm thường.
- Bản đồ: nút tròn nét đứt cùng màu tài nguyên, đường mòn vạch đứt từ địa điểm chủ tới khu (ghi "1 th"), chỉ hiện khi bật lớp tài nguyên (nút ◈). Bấm khu để xem thông tin, nút "Đi tới khu" khi đang đứng ở địa điểm chủ, nút "Rời khu".
- Đi tới khu mất 1 tháng, chấm "Bạn" đi dọc đường mòn. Ở khu: không có công trình và cửa hàng (không mua bán được), nguy hiểm theo loại (yêu thú cao nhất) và theo vùng, mỗi tháng có xác suất bị thương.
- Hành động "Kiếm sống" ở khu lượm được nguyên liệu của khu (quặng, linh thảo, yêu đan, hiếm có linh thạch thô) không cần nghề; nghề đúng loại thu thêm qua hệ số thu hoạch. Kho của khu riêng, hao và hồi mỗi năm như địa điểm.
- Rời khu khi lên đường tới nơi khác (`startTravel` xóa `c.zone`) hoặc bấm "Rời khu".
- Kỹ thuật: `c.zone = {id, host, arrive}` (dữ liệu thuần, lưu như thường); `js/data/resources.js` (D.RES_ZONE), `js/systems/resources.js` (zones, zone, zonesAt, zoneOf, goZone, leaveZone, zoneMonth, zoneWork, siteId), `js/systems/buildings.js` (bld.at rỗng khi ở khu), `js/systems/cultivation.js`, `js/ui/map.js`.
- Chưa làm: NPC đi khu, tranh chấp khu giữa thế lực, thợ mỏ NPC, đường mòn dẫn tới khu giữa hai địa điểm.