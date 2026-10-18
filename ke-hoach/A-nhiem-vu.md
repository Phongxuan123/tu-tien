# A. Hệ nhiệm vụ (thay hệ mục tiêu)

- Trạng thái: Đã code (A1-A6), còn mục nhỏ ở phần 8
- Ngày bắt đầu: 2026-10-16
- Liên quan: KE-HOACH.md §23; `js/systems/goals.js` (sẽ thay); B, C

## 1. Mục tiêu và yêu cầu của bạn
- "Mục tiêu" hơi vô nghĩa, biến thành hệ nhiệm vụ 3 tầng (ngắn, trung, dài).
- Thưởng phụ thuộc người giao: bản thân thì tu vi/kinh nghiệm; người khác thì tài nguyên; nhiệm vụ dài do Thiên Đạo giao, xong thì thưởng, hỏng thì mất đạo tâm.
- Nhân vật nên hướng tới hoàn thành nhiệm vụ. Có bảng ưu tiên kéo thả; nhiệm vụ cấp bách (còn khoảng 1/3 thời gian) tự lên đầu.
- Độ khó phải hợp với thế giới khắc nghiệt: tính lại một nhân vật trung bình làm được gì với tư chất và tài nguyên hiện có.
- Định kỳ yêu cầu người chơi xem xét và chỉnh nhiệm vụ.

## 2. Số đo nền (từ mô phỏng)
- Tư chất: 25-40% chỉ 50, trung vị 66, một phần tư trên 110, hiếm trên 150.
- Tuổi đạt Luyện Khí (trung vị): 48 / 46 / 35 / 32 ứng với tư chất 50 / 66 / 110 / 150. Trúc Cơ: 93 / 90 / 83 / 71, tỉ lệ 25 / 43 / 70 / 83%.
- Tu vi: khoảng 3%/năm nhu cầu ở Phàm nhân, khoảng 2,3%/năm ở Luyện Khí.
- Tài sản: khoảng 0,15-0,25 linh thạch/năm đầu đời. Cấp nghề kẹt ở 2 tới Luyện Khí.
- Bạn thân khoảng 1/10 năm. Vào tông lúc 32 tuổi: 37% (giao du), 17% (cân bằng).
- Hầm mộ cảnh giới 2 có trang bị: rút an toàn 25-50% thu hoạch, thông quan 8-14%, thua 60%.

## 3. Thiết kế
- Ba tầng: ngắn 2-4 năm, trung 6-10 năm, dài 15-30 năm; chạy cùng lúc khoảng 2 ngắn, 1 trung, 1 dài, kèm hàng chờ đề nghị. Nhịp co giãn theo tư chất và cảnh giới.
- Người giao: bản thân, người khác (bạn, đạo lữ, sư phụ), tông môn, thế lực/triều đình, Thiên Đạo (chỉ nhiệm vụ dài).
  - Bản thân: thưởng tu vi, kinh nghiệm nghề, đạo tâm; bỏ giữa chừng giảm đạo tâm nhẹ.
  - Người khác: thưởng tài nguyên, ân tình; hỏng hoặc bỏ thì giảm quan hệ.
  - Tông môn: cống hiến, vật phẩm kho tông, cơ hội thăng chức; hỏng thì mất cống hiến, phạt, có thể trục xuất.
  - Thế lực: linh thạch, danh vọng, đặc quyền; hỏng thì mất danh vọng, thêm kẻ thù.
  - Thiên Đạo: thưởng lớn hiếm (Thiên cơ điểm, tư chất, thọ nguyên, nâng pháp bảo, kỳ ngộ lớn); hỏng mất 15-25 đạo tâm và thiên phạt nhẹ (khó đột phá một thời gian).
- Độ khó: mục tiêu = tốc độ trung bình 5 năm gần nhất (hoặc chuẩn theo tư chất) x thời hạn x hệ số. Bốn bậc: Dễ 0,6 (~85%), Vừa 0,9 (~65%), Khó 1,25 (~40%), Gian nan 1,7 (~20%); thưởng theo bình phương hệ số. Tỉ lệ nhắm: ngắn 75%, trung 55%, dài 35%. Nhiệm vụ Thiên Đạo luôn mức Khó.
- Nguồn nhiệm vụ: hoàn cảnh (kẻ thù, tông môn, tin đồn bí cảnh, chiến tranh), nghề (đơn hàng), ngã rẽ, thế cuộc, người thân.
- Nhân vật tự cố gắng: trọng số hành động hằng tháng và lựa chọn mặc định thiên về nhiệm vụ ưu tiên cao.
- Bảng ưu tiên: danh sách kéo thả (điện thoại có nút lên/xuống), dòng đầu là đang tập trung; mỗi dòng có loại, người giao, thời gian còn lại, tiến độ, độ khó, thưởng, xung đột; thanh khối lượng; nút khóa thứ tự và tự sắp xếp.
- Cấp bách: còn khoảng 1/3 thời hạn mà tiến độ tụt thì tự lên đầu, nhãn đỏ, ghi nhật ký; đang khóa thì chỉ nhắc; hộp nhắc có "đặt về chỗ cũ".
- Cửa sổ "Xem xét nhiệm vụ" khi: nhiệm vụ xong/hỏng; có đề nghị mới (1-2 năm); biến cố lớn; quá 5 năm chưa xem. Lựa chọn: giữ, đổi độ khó, gia hạn (tốn đạo tâm/cống hiến/quan hệ), bỏ (phạt theo người giao); có "áp dụng gợi ý".
- Giao diện: tab "Nhiệm vụ" thay "Mục tiêu"; mốc xong/hỏng lên bản đồ cuộc đời; hộp quyết định có dòng "liên quan nhiệm vụ X".

## 4. Kỹ thuật
- Thay `js/systems/goals.js` bằng `js/systems/quests.js`, giữ tương thích tên hàm tiến độ cũ (`TT.goals.active/progress/yearly`); dữ liệu `js/data/quests.js`; lưu `c.quests` (khởi tạo lười, không đổi `TT.VERSION`).
- Sửa `js/files.js` (thứ tự nạp), `js/ui/panels.js` (tab, cửa sổ xem xét), `js/ui/lifemap.js` (mốc), `js/systems/auto.js` (trọng số), `tests.html`.
- Đã có từ trước và cần chuyển: loại realm/gold/friend/explore/fame/revenge, thưởng đạo tâm/đạo điểm/Thiên cơ điểm.

## 5. Các chặng
- [x] A1 Khung dữ liệu: loại nhiệm vụ, người giao, độ khó, tiến độ, lưu `c.quests`; chuyển loại cũ từ goals.js
- [x] A2 Công thức độ khó và thưởng phạt; đo bằng mô phỏng (tools/quest-sim.js) cho 4 mức tư chất
- [x] A3 Sinh nhiệm vụ từ hoàn cảnh/nghề/người thân/Thiên Đạo; hàng chờ đề nghị
- [x] A4 Tab Nhiệm vụ: bảng ưu tiên kéo thả, cấp bách, khóa thứ tự
- [x] A5 Cửa sổ Xem xét nhiệm vụ và các thời điểm kích hoạt
- [x] A6 Nối vào nhân vật tự chơi (trọng số), nhật ký, bản đồ cuộc đời
- [x] Kiểm thử trong tests.html (5 bài mới thay bài mục tiêu cũ)
- [x] Chơi thử trình duyệt máy tính và điện thoại (tab, kéo thả, cửa sổ xem xét, 375px không tràn ngang)
- [ ] Ghi tóm tắt vào KE-HOACH.md, chụp snapshot

## 6. Còn mở / cần chốt khi bắt đầu
- Mức đạo tâm mất chính xác ở nhiệm vụ dài và thiên phạt cụ thể.
- Phạt khi bỏ nhiệm vụ do người khác giao.

## 7. Nhật ký làm việc
- 2026-10-16: lập kế hoạch, bạn duyệt ("okk"). Bạn bảo bắt đầu làm A.
- Code: js/data/quests.js (cấu hình), js/systems/quests.js (logic), js/ui/quests.js (tab), nối vào ai.js (trọng số hành động, đi khám phá), decisions.js (hộp qreview), report.js, world.js, character.js; goals.js bị bỏ, TT.goals còn làm tên cũ.
- Nhịp hộp quyết định: lần đầu cửa sổ xem xét làm nhịp hỏi 13 lần/phút (quá tay). Giãn tối thiểu giữa hai lần theo lý do (72-108 tháng, riêng đại nguyện 12), còn 5,5 lần/phút (khoảng cho phép 1,5-6).
- Đo tốc độ thật: tu vi thật/ước lượng gần 1 ở Phàm nhân, nhưng của cải tăng ròng chỉ khoảng 1-3 vàng/năm, danh vọng gần 0, đi thêm địa điểm gần 0. Vì thế dùng trung vị lịch sử, mức sàn nhỏ, và nhiệm vụ khám phá làm nhân vật chủ động đi (exploreBias).
- Hiệu chỉnh: hệ số tầng TIER_K (ngắn 0,5, trung 0,95, dài 1,4), hệ số khó 0,45/0,8/1,3/2. Kết quả nhân vật tự chơi nhận hết đề nghị: ngắn xong 70%, trung 56%, dài 54% (dài gồm nhiều Dễ/Vừa; Khó và Gian nan dài 38%); theo độ khó: Dễ 70, Vừa 78, Khó 63, Gian nan 51 (đường cong hơi phẳng vì nhân vật tự chơi bị động và cái chết/thương cắt ngang). Đại nguyện Thiên Đạo xong khoảng 48%.
- Lỗi gặp: đề nghị chờ lâu nên mốc đầu và hạn cũ (sửa: tính lại khi nhận); phần thưởng đạo tâm tăng theo bình phương độ khó nên quá tay (sửa: chỉ tăng thẳng).
- 2026-10-16 (chỉnh lần 2): bạn chơi thử, nhân vật tư chất trung thượng mà tới 79 tuổi vẫn Luyện Khí và nhiệm vụ vẫn quá khó (tốc độ lịch sử bị kéo thấp vì thương tích và nghỉ ngơi). Sửa: tốc độ tu vi dự tính không thấp hơn 70% mức ước lượng theo tiềm lực; hệ số khó hạ còn Dễ 0,35, Vừa 0,6, Khó 0,95, Gian nan 1,5 (tỉ lệ ghi trên đề nghị: 95/80/55/30%); hệ số tầng hạ còn ngắn 0,4, trung 0,75, dài 1,1; trọng số bốc độ khó nghiêng về Dễ/Vừa. Mô phỏng sau chỉnh: ngắn xong 76%, trung 70%, dài 71%; Gian nan 53%; đại nguyện 66%. Nguyên tắc: nhiệm vụ để giúp phát triển, không được bất khả thi.
- Chỉnh lần 2 làm bài mô phỏng nhiều đời báo Trúc Cơ 65% (giới hạn 60%): nhiệm vụ dễ hơn thưởng tu vi và nghiêng hành động quá mạnh. Sửa: nhiệm vụ tu vi/cảnh giới không thưởng thêm tu vi, thưởng tu vi loại khác tối đa 20% cảnh giới, trần nghiêng hành động còn +40%, giãn nhịp xem xét (96-120 tháng). Kết quả: 80 bài đạt, nhịp hỏi 5,4 lần/phút.

## 8. Kết quả và việc để sau
- Xong: ba tầng, bốn bậc khó, năm người giao, thưởng phạt theo người giao, trần phạt đạo tâm 25/năm, nhãn hợp/ngược đạo (xác suất ngược đạo 20%, 35% nếu người khác giao), bảng ưu tiên kéo thả, khóa thứ tự, tự sắp xếp, cấp bách tự lên đầu và đặt về chỗ cũ, cửa sổ xem xét có gợi ý, đại nguyện Thiên Đạo (Khó, không đổi độ khó, hỏng mất 20 đạo tâm và thiên phạt nhẹ).
- Để sau: thanh khối lượng (tổng giờ cần so với giờ còn lại) chưa làm; mốc xong/hỏng trên bản đồ cuộc đời dùng chấm vàng chung chứ chưa có màu riêng; dòng "liên quan nhiệm vụ X" trong hộp quyết định chưa có; thông số đường (TT.path.mods) chờ bước C; nhiệm vụ nghề chờ bước B; đo lại độ khó bằng người chơi thật.

## Hòa hợp A và C (chốt 2026-10-16)
- Đường quyết định cách sống, nhiệm vụ quyết định đích đến. Trọng số hành động = hệ số của đường x cộng thêm từ nhiệm vụ hạng cao, có trần chung khoảng +60%.
- Mỗi nhiệm vụ có nhãn đường hợp. Hợp đường: thưởng +15%. **Nhiệm vụ ngược đường vẫn có xác suất xuất hiện** (khoảng 15-25% số đề nghị, tăng khi do người khác, tông môn, thế lực hoặc hoàn cảnh ép): nhãn "ngược đạo", tiến độ chậm hơn, nhận thì hơi tốn đạo tâm, nhưng thưởng cao hơn một chút và là chỗ để người chơi cân nhắc đánh đổi. Nhiệm vụ Thiên Đạo không có nhãn, đường không hủy được.
- Ngã rẽ hiện trước; chọn xong chạy cửa sổ xem xét nhiệm vụ một lần trong cùng chuỗi. Các cửa sổ khác cách nhau ít nhất 12 tháng.
- Chọn đường xong được đề nghị 1-2 nhiệm vụ ngắn/trung hợp đường đó.
- Đổi đường thì tính lại độ khó theo hệ số mới, thưởng điều chỉnh theo. Bỏ đường thì nhiệm vụ hợp đường đó tạm dừng không phạt.
- Trần phạt chung mỗi năm cho đạo tâm (bỏ đạo + bỏ nhiệm vụ không cộng chồng quá trần).
- Khi làm A: mỗi nhiệm vụ có trường `tag` (nhãn đường) và gọi hàm hệ số đường `TT.path.mods(c)` (tạm trả trung tính) để C cắm vào.
