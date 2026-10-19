# I. Công trình trong nơi chốn, cửa hàng và biểu tượng vật phẩm

- Trạng thái: Đã duyệt; asset (biểu tượng vật phẩm, hình công trình) đã làm xong; I2 trở đi chờ
- Ngày lập: 2026-10-16
- Bản mẫu để xem: [uimock-congtrinh.html](../uimock-congtrinh.html) (chọn nơi đang đứng, rê chuột và bấm vào công trình trong màn hình pixel, cửa hàng mở thành cửa sổ riêng có lưới biểu tượng, hạn mức và giới hạn mua bán)
- Liên quan: `js/ui/scene.js` (màn hình pixel 240x72), `js/data/places.js` (`D.PLACE_TYPES`, 15 loại), `js/data/items.js` (`D.SHOPS`), `js/systems/items.js` (`TT.market`), `js/ui/bag.js` (chợ nằm trong tab Hành trang), `js/ui/sect.js` (kho cống hiến), `ke-hoach/E-kinh-te.md` (bậc thành, hạn mức, giá), `ke-hoach/F-hoan-thien-the-gioi.md`, `ke-hoach/H-phat-trien-thanh-tri.md`, `ke-hoach/G-nhat-bao.md`

## 1. Yêu cầu của bạn
1. Mỗi nơi (của các thế lực) có **công trình** mà người chơi tương tác được.
2. Hiện công trình **trong màn hình nhỏ của nhân vật**: đến thành thì có chợ, thương hội, võ đài...; có **ngôi nhà đại diện cho từng cửa hàng**, bấm vào được.
3. **Chỉnh lại giao diện mua bán**: không bấm vào Hành trang rồi "đại đồng" như hiện nay.
4. **Giới hạn nơi mua bán:** đến thành thì mới mua và bán được.
5. Hỏi: **có làm được biểu tượng (avatar) cho vật phẩm không?** Trả lời: **được** (mục 4.6).

## 2. Hiện trạng
- Màn hình nhân vật là canvas pixel 240x72, cảnh cuộn ngang theo nơi, không có gì bấm được.
- Mua bán nằm trong tab **Hành trang** (cùng trang bị, linh thạch, lò luyện): một danh sách dài chữ, nút Mua/Bán lẫn với nút dùng đồ.
- Chợ theo **loại địa điểm** (7 loại: thành trì, thương đoàn, chợ đen, bến, trạm nghỉ, mỏ, phường), danh sách hàng cố định; tông môn có kho cống hiến ở tab riêng.
- Vật phẩm chỉ có chữ, không có hình.
- Tông môn, hầm mỏ, bí cảnh, cửa ải chưa có "nơi để bước vào" ngoài việc đứng ở đó.

## 3. Ý tưởng một dòng
Đến một nơi, màn hình pixel của nhân vật thành một **con phố nhỏ** với vài **công trình** (mái nhà màu khác nhau, biển tên). Rê chuột thấy tên và mô tả, bấm vào là **bước vào**: cửa hàng mở thành cửa sổ riêng với lưới vật phẩm có **biểu tượng**, tab Mua và Bán, hạn mức giao dịch; dịch vụ khác (y quán, võ đài, quán trọ...) mở màn dịch vụ. Chỉ nơi có công trình phù hợp mới mua bán được.

## 4. Thiết kế

### 4.1 Công trình theo loại nơi
Dữ liệu `D.BUILDINGS` (từng công trình) và `D.PLACE_BUILDINGS[loại nơi]` (bộ công trình mặc định, thêm bớt theo quy mô thành, tông, hội, thế lực):

| Nơi | Công trình |
|---|---|
| Thành lớn (thành trì, thủ phủ) | Quan phủ, Chợ, Đan các, Khí phô, Phù trai, Thư các, Thương hội, Võ đài, Y quán, Tửu lâu, Tòa soạn (khi có Nhật báo), Kho; thủ phủ thêm Nhà đấu giá |
| Thôn trấn | Chợ nhỏ, Y quán, Quán trọ |
| Bến, trạm nghỉ | Bến tàu (thuê đò), Chợ nhỏ, Quán trọ |
| Thương đoàn | Hội sở, Chợ sỉ, Kho, bảng đơn hàng |
| Tông môn | Sơn môn (nhập môn, nhận nhiệm vụ tông), Kho cống hiến, Võ trường, và theo sở trưởng: Đan phòng, Luyện khí các, Thư các nội bộ (chỉ thành viên) |
| Mỏ, phường | Chợ mỏ, Hầm mỏ (làm việc thợ mỏ), Lò rèn |
| Chợ đen | Hang chợ đen, Tửu lâu ngầm |
| Bí cảnh, tàn tích | Cổng vào (bấm để vào), không có chợ |
| Cửa ải | Cổng ải (qua ải, nộp thuế), không có chợ |
| Hoang vu, linh mạch, hung địa, bộ tộc | Không có công trình (bộ tộc có thể có lều tộc trưởng) |
- Số công trình mỗi nơi theo quy mô (bậc thành ở E): làng 2-3, thị trấn 3-5, thành lớn 8-12, thủ phủ 12-14.
- **Do thế lực quyết định:** Quan phủ (vương triều), Sơn môn (tông), Hội sở (thương hội, chỉ ở nơi hội phủ), Phủ đệ (gia tộc), Tòa soạn (Nhật báo). Thế lực bị diệt thì công trình đóng cửa hoặc đổi chủ (tin trong Biên niên sử).

### 4.2 Hiển thị trong màn hình nhân vật
- **Chế độ phố:** khi đứng tại nơi có công trình, cảnh dừng cuộn, vẽ một hàng công trình trên mặt đất (mỗi công trình rộng khoảng 30 pixel), nhân vật đi dạo giữa phố.
- **Tối đa 6 công trình mỗi "phố".** Thành lớn có nhiều hơn thì chia thành **nhiều phố**, có nút ◀ Phố trước / Phố sau ▶ dưới màn hình (xem bản mẫu).
- **Nhãn là chữ HTML nằm trên canvas** (rõ nét, không bị mờ khi phóng to), rê chuột sáng lên; chú giải ngắn khi rê (tên + việc làm được).
- **Bấm vào công trình:** mở cửa hàng hoặc dịch vụ. Trên điện thoại chạm là mở; không có rê chuột nên nhãn luôn hiện.
- **Màn hình thu nhỏ trong hộp quyết định** (bản sao của cảnh) không tương tác.
- **Cỡ màn hình** (nhỏ, vừa, lớn) và gắn/tách giữ nguyên; công trình co theo.
- **Khi đang đi đường, trong bí cảnh, hầm mộ, hoang vu:** cảnh cũ, không phố.
- **Hình công trình:** mái, tường, cửa, cửa sổ vẽ bằng khối pixel, màu và phụ kiện theo loại (lá cờ cho Thương hội, bệ tròn cho Võ đài, cổng cao cho Sơn môn/Cổng ải); có thể thay bằng sprite Kenney CC0 sau.

### 4.3 Các loại cửa hàng (nhà đại diện cho cửa hàng)
Thay "chợ theo loại địa điểm" bằng **cửa hàng theo công trình**, mỗi cửa hàng có kho riêng và danh sách thu mua riêng:
| Cửa hàng | Bán | Thu mua |
|---|---|---|
| Chợ (chung) | đồ cơ bản: Hồi Xuân Đan, linh thảo, khoáng thạch, giấy bùa, áo da, mũ vải | các hàng cơ bản trên |
| Đan các | đan dược, linh thảo | đan dược, linh thảo |
| Khí phô | kiếm, giáp, mũ, ngọc bội, lò, khoáng thạch | khí cụ, khoáng thạch, nanh/da yêu thú |
| Phù trai | bùa chú, giấy bùa | bùa chú, giấy bùa |
| Thư các | công pháp, tâm đắc nghề | sách (không thu tâm đắc) |
| Thương hội | hàng theo lô (mua sỉ), hợp đồng, bảo hiểm | hàng theo lô, yêu liệu |
| Hang chợ đen | hàng cấm, đồ chưa giám định (có đồ nhái) | yêu đan, yêu liệu, sách lạ |
| Kho cống hiến (tông) | đồ của tông (đổi bằng cống hiến) | không |
- Hàng bán ở mỗi nơi vẫn lấy từ `D.SHOPS` cũ (chuyển danh sách theo loại cửa hàng) để không mất nội dung; sau này E (cung cầu, đặc sản vùng) thay giá và tồn kho.

### 4.4 Giao diện mua bán mới (thay cách "bấm Hành trang")
- **Cửa sổ riêng** mở khi bấm công trình (kiểu hộp quyết định nổi): tiêu đề (tên cửa hàng, nơi), tab **Mua / Bán**, **lưới ô vật phẩm có biểu tượng**, giá và số lượng trên từng ô, **bảng chi tiết bên phải** (biểu tượng lớn, mô tả, phẩm, hệ, giá, trong kho/trong túi), nút Mua/Bán 1, 5, 10, hết; thanh tìm lọc theo loại (đan, bùa, khí...), hiển thị **tài sản** và **hạn mức tháng còn lại**; đóng bằng ✕ hoặc phím Esc.
- **Hành trang chỉ còn quản lý đồ:** trang bị, dùng, đọc, hấp thụ linh thạch, lò luyện; **bỏ phần Chợ và bỏ nút "Bán" trong tab Hành trang**; thay bằng dòng gợi ý "đến cửa hàng để bán" kèm nút "tới công trình" nếu đang ở nơi có cửa hàng thích hợp.
- **Phím nóng và điện thoại:** lưới cuộn, chạm ô chọn rồi chạm nút; cửa sổ chiếm gần cả màn hình.
- **Hộp "Bán bớt hàng thừa"** chuyển vào cửa hàng (nút "Bán đồ thừa" trong tab Bán).

### 4.5 Giới hạn mua bán
1. **Chỉ mua bán ở nơi có cửa hàng:** không mua bán khi đang đi đường, trong bí cảnh, hầm mộ, tàn tích, hoang vu, tông môn (trừ kho cống hiến và đan phòng nội bộ), cửa ải. Mọi hàm `market.buy/sell/autoSell` và mọi chỗ máy tự mua (`auto.js`, `craft.js`) **phải đứng ở cửa hàng đúng loại** (người chơi tự động sẽ tự đi tới công trình phù hợp theo di chuyển hiện có, hoặc không mua bán nếu không có).
2. **Mỗi cửa hàng chỉ thu mua nhóm hàng của mình** (bảng 4.3); thứ khác bị từ chối kèm lý do.
3. **Hạn mức giao dịch mỗi tháng theo quy mô nơi** (làng 20 x (1 + cảnh giới) vàng, thị trấn 100, thành lớn 500, thủ phủ 3000; số của E, tạm dùng ở đây): vượt hạn mức thì cửa hàng hết tiền/hết chỗ, giao dịch tạm dừng tới tháng sau.
4. **Kho hàng giới hạn:** mỗi mặt hàng ở mỗi cửa hàng có số lượng tồn (ví dụ Phá Cảnh Đan chỉ 3), hồi dần theo tháng; mua hết thì chờ.
5. **Hàng cấm và chưa giám định** chỉ ở chợ đen.
6. Sau E: giá và tồn kho theo cung cầu, spread, hội (mục 4.7).

### 4.6 Biểu tượng vật phẩm (trả lời câu hỏi cuối)
**Làm được, không cần tệp ảnh.** Sinh biểu tượng pixel 16x16 bằng mã (như bản mẫu), cache theo khóa, vẽ lên canvas nhỏ rồi dùng ở mọi nơi:
- **Theo loại:** đan (bình), viên đan, bùa (giấy có chữ), kiếm, giáp, mũ, ngọc bội, linh thảo, khoáng thạch, sách, linh thạch (4 phẩm, sáng dần), lò, yêu đan, nanh/da; loại mới thêm hình mới dễ.
- **Màu theo thuộc tính** (hệ Kim, Mộc, Thủy, Hỏa, Thổ, Lôi, ...) cho đan, ngọc, yêu đan, khoáng.
- **Viền theo phẩm** (phàm xám, linh xanh, bảo vàng, tiên hồng), **chất lượng** thể hiện bằng độ sáng/điểm sáng (trang bị mã hóa `g|slot|tier|q|elem`), **pháp bảo bản mệnh** có hào quang.
- **Dùng ở đâu:** lưới cửa hàng, túi đồ, ô trang bị, nhật ký ("nhặt được [biểu tượng] ..."), hộp quyết định (phần thưởng), Nhật báo, bảng truy nã/rao vặt.
- **Nâng cấp sau:** thay từng loại bằng sprite vẽ tay hoặc Kenney CC0 mà không đổi mã gọi.
- API dự kiến: `TT.ui.icon(itemId, size)` trả canvas hoặc data URL; hàm vẽ nằm ở `js/ui/icons.js`.

### 4.7 Liên kết với các kế hoạch khác
- **Kinh tế (E):** giá, spread, tồn kho, cung cầu, đặc sản vùng áp theo **cửa hàng**; bậc thành quyết định bộ công trình và hạn mức; Thương hội là công trình có thật, hội viên vào quầy riêng; nghề Thương nhân mở sơ đồ ngay tại Hội sở.
- **Thế lực (F):** công trình thuộc thế lực, thế lực diệt thì công trình thay đổi; Quan phủ nơi nộp thuế, xem bảng truy nã.
- **Nhật báo (G):** Tòa soạn là nơi gia hạn, đọc lại, và gặp người bán báo; bảng tin chợ miễn phí (H) đặt ở Quan phủ hoặc Chợ.
- **Thành trì (H):** bộ công trình chính là xương sống của mục phát triển thành trì (dịch vụ, phiên chợ, thành chủ).
- **Nghề:** Hầm mỏ (làm việc thợ mỏ), Lò rèn (thợ rèn dùng lò công cộng), Y quán (y sư làm việc), Đan các (dược sư nhận đơn).
- **Nhiệm vụ:** Quan phủ, Thương hội, Tửu lâu, Sơn môn là nơi nhận nhiệm vụ đề nghị (giữ nhịp hỏi người chơi thấp, không bật hộp mới).
- **Võ đài:** thách đấu NPC cảnh giới tương đương (thua thì thương nhẹ, thắng thì danh vọng, tiền thưởng nhỏ, hạn mức số trận mỗi năm); xem giải đấu theo thời đại.

## 5. Kỹ thuật dự kiến
- `js/data/buildings.js`: `D.BUILDINGS` (id, tên, màu, mô tả, loại dịch vụ, nhóm hàng bán/thu), `D.PLACE_BUILDINGS`.
- `js/systems/buildings.js`: `TT.bld.of(placeId)` (công trình của nơi, tính theo loại nơi, quy mô, thế lực, hội, tông), `TT.bld.canTrade(c, bldId)`, kho theo nơi `world.shop[placeId][bldId]` khởi tạo lười và hồi mỗi tháng, hạn mức `c.trade = { m, spent }`.
- `js/systems/items.js`: `market.buy/sell/autoSell` nhận thêm công trình; giữ chữ ký cũ làm lớp tương thích (dùng cửa hàng chung của nơi) để các bài kiểm thử cũ chạy tiếp, rồi cập nhật dần.
- `js/ui/icons.js`: hàm vẽ biểu tượng và cache.
- `js/ui/shop.js`: cửa sổ cửa hàng (dùng khung modal đã có), `js/ui/scene.js`: chế độ phố, trúng ô công trình (hit-test), nhãn HTML.
- `js/ui/bag.js`: bỏ phần Chợ và nút Bán; thêm biểu tượng vào túi đồ và trang bị.
- Lưu: không đổi `TT.VERSION`; trạng thái mới khởi tạo lười.
- Hiệu năng: bộ công trình tính theo nơi và cache; kho cập nhật theo tháng chỉ cho nơi người chơi ghé.

## 6. Các chặng làm (mỗi chặng người chơi thấy gì)
- [ ] **I1 Biểu tượng vật phẩm.** Thấy: túi đồ, trang bị, nhật ký có biểu tượng. Làm `icons.js` và gắn vào Hành trang.
- [ ] **I2 Công trình trong màn hình nhân vật.** Thấy: đến thành thì có phố, nhãn, rê và bấm được; nơi không có công trình thì như cũ. Làm `buildings.js`, chế độ phố, phân trang, bấm mở màn dịch vụ cơ bản.
- [ ] **I3 Cửa hàng mới và giới hạn mua bán.** Thấy: cửa sổ cửa hàng (Mua/Bán, lưới, chi tiết, hạn mức), gỡ chợ khỏi Hành trang, hàng và thu mua theo cửa hàng, chặn mua bán ngoài nơi có cửa hàng. Cập nhật `auto.js`, `craft.js`, kiểm thử.
- [ ] **I4 Dịch vụ công trình:** Y quán (chữa thương có phí), Quán trọ (nghỉ), Kho (cất đồ), Võ đài (thách đấu), Quan phủ (thuế, giấy phép, bảng truy nã), Hầm mỏ (làm việc), Bến tàu (thuê đò).
- [ ] **I5 Tích hợp thế lực:** Sơn môn, Kho cống hiến, Đan phòng nội bộ, Hội sở thương hội, Tòa soạn nhật báo; công trình theo thế lực suy/diệt.
- [ ] Mỗi chặng: kiểm thử trong tests.html (công trình theo nơi, chặn mua bán sai nơi, whitelist thu mua, hạn mức, biểu tượng ổn định, lưu/tải), chơi thử máy tính và điện thoại, ghi tóm tắt vào KE-HOACH.md, chụp snapshot.

Thứ tự đề xuất: I1, I2, I3 (cho bạn chơi thử sớm), rồi I4, I5. Có thể làm trước F2 (nghĩa vụ giữa các thế lực) như bạn dự định.

## 7. Tiêu chí chấp nhận
1. Mọi nơi có công trình hiện đúng bộ ở bảng 4.1; nơi không có công trình thì không hiện phố.
2. Không thể mua bán ở nơi không có cửa hàng; không thể bán món mà cửa hàng không thu; không vượt hạn mức tháng; máy tự mua bán cũng theo luật này.
3. Cửa hàng mở bằng một cú bấm, đóng bằng ✕ hoặc Esc; lưới hiển thị đủ biểu tượng, giá, số lượng; dùng được trên điện thoại.
4. Tab Hành trang không còn mua bán; chuyển người chơi sang cửa hàng bằng gợi ý rõ ràng.
5. Biểu tượng cho mọi vật phẩm (kể cả trang bị mã hóa) không lỗi, cùng một vật phẩm luôn cùng một hình.
6. Không phá cân bằng cũ (NPC ~4/10/19% Trúc Cơ+, nhịp hỏi ≤ 6 lần/phút, bài mô phỏng nhiều đời); người chơi tự động vẫn mua đan và đồ cần khi có đường tới cửa hàng.

## 8. Rủi ro
- **Người chơi tự động hết đường mua bán** vì nơi ở không có cửa hàng: sửa bằng cách cho `auto` ưu tiên đi tới nơi có cửa hàng khi cần mua (đã có di chuyển tự động) và chấp nhận tu sĩ ở nơi hẻo lánh khó mua đồ (đúng tinh thần khắc nghiệt).
- **Kiểm thử cũ giả định mua bán ở mọi nơi có chợ theo loại:** cần lớp tương thích và cập nhật bài.
- **Màn hình nhỏ chật khi nhiều công trình:** đã giải bằng phân phố và nhãn HTML; nếu vẫn chật thì chỉ hiện biểu tượng và nhãn khi rê.

## 9. Câu hỏi cần bạn chốt
1. **Tối đa 6 công trình mỗi phố, thành lớn chia nhiều phố có nút trước/sau:** ổn không, hay muốn cho kéo cảnh ngang?
2. **Võ đài** làm gì: thách đấu NPC lấy danh vọng và tiền thưởng nhỏ, có rủi ro thương nhẹ, giới hạn số trận mỗi năm. Đồng ý, hay muốn cược và giải đấu lớn?
3. **Giới hạn bán:** mỗi cửa hàng chỉ thu đúng nhóm hàng (đan chỉ bán ở Đan các, khí ở Khí phô...) có quá khắt khe không? Hay cho Chợ chung thu mọi thứ với giá thấp hơn?
4. **Biểu tượng:** vẽ bằng mã như bản mẫu (đồng nhất, nhẹ) hay muốn dùng sprite có sẵn (đẹp hơn, nhưng cần chọn từng hình)?
5. **Hoang vu:** hoàn toàn không mua bán được ngoài chỗ có cửa hàng (rất khắc nghiệt), hay có người bán rong thỉnh thoảng?
6. **Thứ tự:** làm I1-I3 trước F2, hay F2 trước?

## 10. Nhật ký làm việc
- 2026-10-16: bạn muốn hoàn thành các thành tố trong thế lực trước khi làm quan hệ: công trình tương tác trong màn hình nhân vật (chợ, thương hội, võ đài, nhà cửa hàng bấm được), chỉnh lại giao diện mua bán (bỏ cách đại trà trong Hành trang), giới hạn mua bán theo nơi, hỏi có làm biểu tượng vật phẩm được không. Khảo sát: màn hình pixel 240x72, chợ trong bag.js, D.PLACE_TYPES, D.SHOPS. Dựng bản mẫu `uimock-congtrinh.html` (12 loại công trình, 9 loại nơi, cửa hàng modal, biểu tượng 16 loại) và viết kế hoạch này. Chưa code game.

## 11. Kết quả và việc để sau
(Điền khi xong.)

## 12. Quyết định và tiến độ (2026-10-16, sau khi bạn duyệt)
- **Biểu tượng của cửa hàng nói rõ nó bán gì:** mỗi nhà có **biển hiệu lớn trên mái** vẽ vật đại diện: Chợ (mái hiên sọc đỏ trắng, sọt đồ), Đan các (hồ lô thuốc đỏ), Khí phô (đe và búa), Phù trai (ba dải bùa vàng), Thư các (quyển sách mở), Thương hội (cờ và đồng vàng), Võ đài (bệ tròn, cờ đỏ, hai kiếm), Y quán (chữ thập xanh), Tửu lâu (bình rượu và đèn), Quan phủ (ấn đỏ), Tòa soạn (tờ báo và bút), Kho (hòm và khóa), Quán trọ (đèn lồng), Nhà đấu giá (búa gõ), Sơn môn (cổng lớn có ấn tông), Kho cống hiến (rương), Hầm mỏ (cửa hầm, cuốc), Hang chợ đen (mắt đỏ trong hang), Bến tàu (thuyền buồm), Cổng bí cảnh (cổng tím phát sáng), Cổng ải (tháp đá, cờ), Lều tộc trưởng. Làm xong và xem được ở `asset-xem.html`.
- **Hàng rong:** có (đồng ý). Công trình "Hàng rong" (xe đẩy dưới ô đỏ) thỉnh thoảng xuất hiện ở nơi hoang vu, trạm, bến, thôn: hàng ít, lạ, giá hơi cao; ở hoang vu đây là chỗ duy nhất mua bán được. Chưa cài logic xuất hiện (làm ở I3).
- **Thứ tự mới:** làm asset trước (xong phần hình), rồi tính tiếp I2 (phố công trình trong màn hình nhân vật) và I3.
- **Đã làm (asset):**
  - `js/ui/icons.js`: `TT.ui.icon(id, px)`, `TT.ui.iconSpec(id)`; 60 vật phẩm gốc đều có hình riêng; trang bị mã hóa lấy hình theo ô (kiếm, giáp, mũ), phẩm, hệ, chất lượng (điểm sáng); pháp bảo bản mệnh có hào quang và màu theo chỉ số; nanh và da yêu thú theo hệ.
  - `js/ui/bldart.js`: `TT.ui.bld.draw(ctx, id, x, gy, w, {hover, frame})`, `TT.ui.bld.defs`; 22 công trình (có chuyển động nhẹ: cờ bay, đèn nhấp nháy, cổng phát sáng).
  - Trang xem: `asset-xem.html` (vật phẩm, trang bị, pháp bảo, nguyên liệu, công trình có chuyển động, một con phố ví dụ).
  - Gắn biểu tượng vào tab Hành trang (túi đồ, ô trang bị, hàng ở chợ cũ).
  - Kiểm thử: bài "Asset" (mọi vật phẩm có hình, hình ổn định, công trình vẽ đủ điểm ảnh).

## 13. I2 và I3 đã làm (2026-10-16)
- **Dữ liệu và hệ:** `js/data/buildings.js` (`D.PLACE_BLD` bộ công trình theo loại nơi, `D.PLACE_SIZE`, `D.TRADE_LIMIT`, `D.STOCK_MUL`, `D.RONG`, `D.BSELL` hàng bán theo cửa hàng và theo loại nơi), `js/systems/buildings.js` (`TT.bld`: `at/shopsAt/sells/buys/state/limitOf/left/spend/service/rongHere`).
- **Phố công trình trong màn hình nhân vật** (`js/ui/scene.js`): đứng ở nơi có công trình thì cảnh thành một con phố, tối đa 6 nhà mỗi phố (thành lớn có hai phố, nút ◀ ▶ và chữ "Phố 1/2"); nhãn tên là chữ HTML trên canvas; rê chuột nhà sáng lên, con trỏ thành tay, hiện mô tả; bấm vào để vào. Nhà vẽ bằng `js/ui/bldart.js` (biển hiệu đại diện trên mái) và nhuộm màu theo giờ trong ngày.
- **Cửa sổ cửa hàng và dịch vụ** (`js/ui/shop.js`): tab Mua/Bán, lưới vật phẩm có biểu tượng, bảng chi tiết, nút mua/bán 1, 5, 10, hết, hạn mức tháng, "Bán đồ thừa"; thời gian tạm dừng khi cửa sổ mở, đóng bằng ✕, Esc hoặc bấm nền. Dịch vụ thật: Y quán (chữa dứt thương, hồi đầy sinh lực, có phí theo cảnh giới và độ nặng), Quán trọ (nghỉ một đêm, hồi 40%, mỗi tháng một lần), Tửu lâu (nghe ngóng tin đồn), Quan phủ (thông tin triều, chiến sự, thương hội, truy nã), Sơn môn và Kho cống hiến (mở tab Tông môn), Cổng bí cảnh (thám hiểm), Cổng ải (mở Đại địa đồ). Chưa mở (sẽ làm ở I4): Võ đài, Kho, Hầm mỏ, Bến tàu, Nhà đấu giá, Tòa soạn, Lều tộc trưởng.
- **Mua bán theo cửa hàng** (`TT.market` viết lại trong `js/systems/items.js`): chỉ mua bán được ở nơi có cửa hàng; mỗi cửa hàng chỉ bán hàng của mình (Đan các bán đan, Khí phô bán khí cụ và khoáng thạch, Phù trai bán bùa, Thư các bán sách và tâm đắc, Thương hội bán hàng theo lô, Hang chợ đen bán hàng hiếm) và chỉ thu nhóm hàng của mình (cửa hàng chuyên trả cao hơn chợ chung 10%); kho có hạn (số lượng theo giá trị món và quy mô nơi, hồi 25% mỗi tháng); hạn mức giao dịch mỗi tháng theo quy mô (làng 50, thị trấn 150, thành lớn 600 vàng nhân (1 + cảnh giới); hàng rong 40; số này tạm, sẽ chỉnh khi làm kinh tế E); bán vượt hạn mức bị cắt bớt. Thành trì chỉ bán đồ phàm phẩm; đồ linh phẩm ở thương đoàn, phường; hàng hiếm ở chợ đen (giữ cân bằng cũ).
- **Hàng rong:** thỉnh thoảng ghé trạm, bến, thôn, bộ tộc (30-35% mỗi quý), tàn tích, hung địa, linh mạch (20-25%), mỏ và phường (15%), xác định theo nơi và quý (không dùng bộ sinh số ngẫu nhiên của thế giới). Bán 5 món, giá đắt hơn 20%, thu mua giá thấp, hạn mức riêng; ở nơi hoang vu là chỗ duy nhất mua bán được.
- **Hành trang:** bỏ phần chợ và các nút Bán; thay bằng thẻ "Mua bán" gợi ý cửa hàng ở nơi đang đứng, có nút mở nhanh từng cửa hàng.
- **Hệ khác theo luật mới:** trợ lý Tự động và luyện nghề (`auto.js`, `craft.js`) chỉ mua bán khi đang ở nơi có cửa hàng đúng; mua không đủ thì đi tìm chậm.
- **Chưa làm:** I4 (dịch vụ còn lại) và I5 (tích hợp tông, hội, tòa soạn); giá theo cung cầu (E).
