# B. Nghề nghiệp

- Trạng thái: Chờ A
- Liên quan: KE-HOACH.md §23; A (nghề là nguồn nhiệm vụ); `js/systems/craft.js`

## 1. Mục tiêu
Làm hệ nghề đi cùng nhiệm vụ và ngã rẽ, để mỗi con đường có sự khác biệt thật.

## 2. Thiết kế (dự kiến)
- Nghề lõi có sẵn: luyện khí (thợ rèn), luyện đan (dược sư), vẽ bùa (phù sư), kiếm đạo (kiếm khách). Nghề mới: thợ mỏ, thợ săn yêu thú, thương nhân, lính đánh thuê, y sư.
- Mỗi nghề: cấp bậc (học đồ, thợ, chuyên gia, đại sư), thu nhập và nhiệm vụ riêng, hành động đặc trưng, vài sự kiện, quan hệ với tông chuyên nghề, thưởng phạt kết hợp với "đạo". Một nghề chính, một nghề phụ. Trần cấp nghề vẫn theo cảnh giới.
- Nguồn nhiệm vụ nghề: đơn hàng luyện khí, đơn thuốc, truy tìm nguyên liệu.

## 3. Các chặng
- [ ] B1 Dữ liệu nghề và cấp bậc
- [ ] B2 Thu nhập, hành động, sự kiện
- [ ] B3 Nối vào nhiệm vụ (đơn hàng) và tông chuyên nghề
- [ ] Kiểm thử, đo cân bằng, chơi thử, ghi KE-HOACH.md

## 4. Cần chốt khi bắt đầu
Danh sách nghề cuối cùng và thu nhập từng nghề.

## 5. Nhật ký làm việc
(Chưa bắt đầu.)


## Thiết kế đã chốt khi làm (2026-10-16)
- 9 nghề: 4 nghề lõi dùng cấp trong craft.js (kiếm khách, thợ rèn, dược sư, phù sư) và 5 nghề mới có cấp ở `c.job.lv` (thợ mỏ, thợ săn yêu thú, thương nhân, lính đánh thuê, y sư). Một nghề chính, một nghề phụ (nửa hiệu lực). Bậc: học đồ (cấp 0-1), thợ (2-4), chuyên gia (5-7), đại sư (8-10). Trần cấp nghề mới = 3 + 2 x cảnh giới (nghề lõi giữ luật cũ).
- Thu nhập khi kiếm sống: nhân hệ số nghề (1,0-1,3) x (1 + 0,1 x cấp); đổi nghề chính thì 6 tháng đầu mất nửa phần lợi.
- Kỹ năng: thợ mỏ ra khoáng thạch; thợ săn ra nanh/da; thương nhân mua rẻ tới 15%; lính đánh thuê thu nhập cao, hay bị thương nhẹ, nổi danh; y sư nghỉ ngơi hồi nhanh, ra linh thảo; nghề lõi đặt tiêu điểm luyện nghề.
- Đơn hàng: mỗi tháng làm việc có 50% xong một đơn (nghề chính); nhiệm vụ kind `order` đếm đơn hàng, giao bởi bản thân, người quen, tông môn hoặc thế lực, nhãn "luyện nghề" cho nghề lõi, "kiếm sống" cho nghề phổ thông.
- Chọn nghề: hộp "Chọn một nghề" hiện ngay sau khi chọn đạo Kiếm sống hoặc Luyện nghề; tab "Nghề" cho đổi bất cứ lúc nào.
- Còn lại: nhiệm vụ "lên cấp nghề", quan hệ tông chuyên nghề giữ nguyên luật cũ, chưa có danh sách đơn hàng riêng (đơn hàng chỉ là bộ đếm).

- Xem nhật ký làm việc ở C-nga-re.md (B và C làm cùng một đợt, 2026-10-16).

- 2026-10-16 (chỉnh luyện đan): bạn báo luyện đan quá mạnh. Nguyên nhân: mỗi lần chỉ tốn 2 linh thảo (12 vàng) mà ra Tụ Khí Đan (70 vàng) hoặc Phá Cảnh Đan (giá tăng theo cảnh giới, hàng trăm vàng), lại hay ra gấp đôi, nên làm đan vừa lãi vô lý vừa tự cấp tu vi. Sửa: nguyên liệu mỗi lần bằng khoảng 55% giá trị món làm ra chia giá linh thảo (tối thiểu 2, tối đa 40) cho cả luyện đan lẫn vẽ bùa; xác suất thành công gốc 0,55 xuống 0,5, gấp đôi từ 20% xuống 10% (cộng 1% mỗi cấp); Tụ Khí Đan dùng nhiều trong một năm thì nhờn thuốc (viên thứ n còn 1/(1 + 0,35 x (n - 1)) hiệu quả). Đo 8 nhân vật Trúc Cơ 20 năm: luyện nghề đan tăng 0,14 cấp tu vi, khổ tu 0,13, kiếm sống 0,06; tài sản tương đương. Còn nghi: nếu chơi tay thấy vẫn mạnh thì hạ tiếp tỉ lệ thành công hoặc tăng nguyên liệu.
