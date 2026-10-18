# C. Ngã rẽ cuộc đời (thay ô "Hướng đi")

- Trạng thái: Chờ B
- Liên quan: KE-HOACH.md §23; `js/ui/panels.js` (ô Hướng đi), `js/systems/decisions.js`, `js/systems/auto.js`

## 1. Yêu cầu của bạn đã chốt
- Hướng đi chỉ là lựa chọn tại một giai đoạn (tuổi, đột phá, sự kiện đặc biệt). Cho bỏ giữa chừng nhưng trả giá. Khoảng 8-12 ngã rẽ một đời. Bỏ hướng "Cân bằng".

## 2. Thiết kế (dự kiến)
- Bỏ ô thả xuống; đầu trang có chip "Đạo: ... · đã đi N năm".
- Ngã rẽ là hộp quyết định với 3-4 đường, ghi được gì, mất gì, cam kết bao lâu (tối thiểu 5-10 năm hoặc tới ngã rẽ kế). Bỏ đạo: mất đạo tâm, mất cấp thành thạo, 12 tháng thích nghi.
- Mốc: tuổi 12 bước vào tu hành; mỗi lần đột phá; mỗi 25 năm nếu chưa có; vào tông; kết đạo lữ/có con; thua nặng hoặc người thân mất; tông bị diệt hoặc đổi thế cuộc; kỳ ngộ lớn.
- Các đường: khổ tu (tu vi +25%, quan hệ nhạt, ít kỳ ngộ), kiếm sống (thu nhập +35%, tu vi chậm), phiêu lưu (kỳ ngộ x2, nhiều hầm mộ, dễ thương), giao du (quan hệ x1,5, được giúp khi nguy, tu vi chậm), luyện nghề (nghề nhanh, chất lượng cao, tu vi chậm). Cấp thành thạo 0-5, đổi hướng có độ trễ, cấp cao nhất giữ một nửa cho đời sau. "Tự động" chọn theo tính cách, nhiệm vụ, hoàn cảnh.
- Công tắc "Phong cách" (thận trọng/bình thường/liều lĩnh) để lại bàn sau.
- Cân bằng: chênh thưởng phạt +/-15-35% giữa các đường; đo lại tỉ lệ Phi Thăng và NPC (~4/10/19% Trúc Cơ+).

## 3. Các chặng
- [ ] C1 Mô hình dữ liệu ngã rẽ và con đường, chuyển từ `c.dir` cũ
- [ ] C2 Các mốc kích hoạt và hộp quyết định
- [ ] C3 Hiệu ứng từng đường, cấp thành thạo, bỏ đạo
- [ ] C4 Giao diện chip, gỡ ô thả xuống
- [ ] Kiểm thử, đo cân bằng, chơi thử, ghi KE-HOACH.md

## 4. Cần chốt khi bắt đầu
Số liệu từng con đường và độ chênh cuối cùng.

## 5. Nhật ký làm việc
(Chưa bắt đầu.)

## Hòa hợp A và C (chốt 2026-10-16)
- Đường quyết định cách sống, nhiệm vụ quyết định đích đến. Trọng số hành động = hệ số của đường x cộng thêm từ nhiệm vụ hạng cao, có trần chung khoảng +60%.
- Mỗi nhiệm vụ có nhãn đường hợp. Hợp đường: thưởng +15%. **Nhiệm vụ ngược đường vẫn có xác suất xuất hiện** (khoảng 15-25% số đề nghị, tăng khi do người khác, tông môn, thế lực hoặc hoàn cảnh ép): nhãn "ngược đạo", tiến độ chậm hơn, nhận thì hơi tốn đạo tâm, nhưng thưởng cao hơn một chút và là chỗ để người chơi cân nhắc đánh đổi. Nhiệm vụ Thiên Đạo không có nhãn, đường không hủy được.
- Ngã rẽ hiện trước; chọn xong chạy cửa sổ xem xét nhiệm vụ một lần trong cùng chuỗi. Các cửa sổ khác cách nhau ít nhất 12 tháng.
- Chọn đường xong được đề nghị 1-2 nhiệm vụ ngắn/trung hợp đường đó.
- Đổi đường thì tính lại độ khó theo hệ số mới, thưởng điều chỉnh theo. Bỏ đường thì nhiệm vụ hợp đường đó tạm dừng không phạt.
- Trần phạt chung mỗi năm cho đạo tâm (bỏ đạo + bỏ nhiệm vụ không cộng chồng quá trần).
- Khi làm A: mỗi nhiệm vụ có trường `tag` (nhãn đường) và gọi hàm hệ số đường `TT.path.mods(c)` (tạm trả trung tính) để C cắm vào.


## Thiết kế đã chốt khi làm (2026-10-16)
- Năm đường: Khổ tu (tu vi +25%, giao du -40%, kỳ ngộ -20%, kiếm sống -10%), Kiếm sống (thu nhập +35%, tu vi -15%), Phiêu lưu (kỳ ngộ x2, tu vi -10%, hiểm nguy +25%), Giao du (thân thiết +50%, tu vi -15%), Luyện nghề (nghề lên nhanh +60%, thu nhập +10%, tu vi -15%). Bỏ "Cân bằng" khỏi lựa chọn (chỉ còn cho NPC và trước ngã rẽ đầu).
- Khóa đường = `c.direction` nên AI, sự kiện, tin đồn vẫn dùng bảng hướng đi cũ. Trạng thái `c.path = { id, since, mo, adapt, last, n, want }`, `c.pathMo` nhớ thành thạo các đường đã bỏ.
- Thành thạo cấp 0-5 theo năm đã đi (0/3/8/15/25/40); mỗi cấp tăng 10% phần lợi. Đổi đường ở ngã rẽ: không phạt, 12 tháng thích nghi (phần lợi giảm nửa). Bỏ đạo giữa chừng: đạo tâm -(6 + 2 x cấp), mất nửa thành thạo, chọn lại ngay.
- Mốc: tuổi 12; đột phá, vào tông, có đạo lữ, thương nặng, thông quan bí cảnh (cách ngã rẽ trước tối thiểu 8 năm); không có ngã rẽ 25 năm thì tự mở.
- Giao diện: ô "Hướng đi" thành chip "Đạo: tên · số năm · cấp" kèm nút "bỏ đạo"; hộp ngã rẽ là cửa sổ nổi có ghi được/mất từng đường; mức Tự động máy chọn theo tính cách, tư chất, nghề, nhiệm vụ ưu tiên và giữ đường cũ.
- Hòa hợp với A: đổi đường thì tính lại nhãn hợp/ngược đạo của nhiệm vụ và đề nghị sẵn 1-2 nhiệm vụ hợp đường.
- Chưa làm: công tắc "Phong cách" (thận trọng/liều lĩnh), di sản thành thạo sang đời sau, cảnh báo ngược đạo ở hộp sự kiện.

## Nhật ký làm việc (2026-10-16)
- Bạn bảo làm B và C cùng lúc. Làm C trước vì chạm lõi (hướng đi), rồi B.
- Code C: js/data/paths.js, js/systems/path.js; nối vào cultivation.js (tu vi, thu nhập, kỳ ngộ, hiểm nguy), social.js, craft.js, report.js (mốc đời), decisions.js (hộp ngã rẽ), world.js (đầu thai, kế thừa), controls.js và index.html (chip Đạo), quests.js (đổi đường tính lại nhãn, đề nghị nhiệm vụ hợp đường).
- Code B: js/data/jobs.js, js/systems/jobs.js, js/ui/jobs.js (tab Nghề); nối vào cultivation.js (kiếm sống, nghỉ ngơi), items.js (giá mua), decisions.js (hộp chọn nghề), quests.js (kind order).
- Nhịp hỏi người chơi vượt 6 lần/phút khi thêm ngã rẽ và hộp chọn nghề. Sửa: bỏ việc mở cửa sổ xem xét nhiệm vụ khi có biến cố lớn (ngã rẽ đã lo), nghỉ giữa hai lần xem xét 120-168 tháng (đại nguyện 60), lần xem xét đầu tính từ lúc sinh. Kết quả đo: 5,3 lần/phút.
- Bản lưu cũ: nhân vật đã có hướng đi sẵn tự được coi là đã chọn đường đó (path.adopt), không bị hỏi lại.
