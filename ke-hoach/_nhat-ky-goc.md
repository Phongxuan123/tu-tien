# Nhật ký gốc của KE-HOACH.md (lưu nguyên văn, chỉ để tra cứu)

Đây là bản KE-HOACH.md cũ trước khi sắp xếp lại ngày 2026-10-17. Mọi chi tiết số liệu M0 đến M7, mục 14 (mặc định), 16 đến 22 đều còn ở đây. File KE-HOACH.md mới ở thư mục gốc là bản sắp xếp theo chủ đề và có tích tiến độ; khi cần số liệu cũ thì tra ở file này.

---

# Kế hoạch dự án: "1 trong 8 tỷ: Tu Tiên"

Cập nhật: 2026-10-15. Trạng thái: M1-M7 đã code xong, 69/69 bài kiểm tra trong tests.html đạt; mặc định tự chọn ở mục 14, phần chưa kiểm chứng ở mục 15.

## 1. Tầm nhìn

Một game web mô phỏng cuộc đời tu tiên chạy trên trình duyệt, lấy cảm hứng từ cấu trúc và tính năng của Quỷ Cốc Bát Hoang (Tale of Immortal), nhưng làm theo kiểu **mô phỏng chữ chạy theo thời gian** chứ không phải game hành động.

Nguyên tắc cốt lõi:
1. **Sinh ra ngẫu nhiên.** Tư chất, tiên thiên, xuất thân đều random ("1 trong 8 tỷ").
2. **Người chơi chỉ chọn hướng đi.** Nhân vật tự quyết định hành động hằng tháng; game chỉ dừng hỏi ở khoảnh khắc lớn (đột phá, sinh tử, cưới hỏi, kết thù, chọn tông môn).
3. **Thế giới tự sống.** NPC dùng chung bộ máy quyết định với người chơi, tự tu luyện, già đi, kết bạn, kết thù, lập gia đình, chết, ngay cả khi người chơi không gặp họ.
4. **Kỳ ngộ làm cho mình đặc biệt.** Cơ hội 5–15% đổi vận (tăng tư chất, thức tỉnh biến dị, xóa tiên thiên xấu...).
5. **Nội dung gốc.** Không chép tên, văn bản hay thiết lập riêng của tác phẩm nào. Chỉ dùng khuôn mẫu chung của thể loại tu tiên.
6. **Chơi một lần ngắn, nhiều kiếp.** Chết thì đầu thai, kế thừa một phần (con cháu, di vật) sang kiếp sau.

Ngoài phạm vi (không làm): chiến đấu hành động thời gian thực, đồ họa 2D/3D, nhiều người chơi, kiếm tiền.

## 2. Nguồn tham khảo và độ tin cậy

Thông tin về Quỷ Cốc Bát Hoang lấy từ bài giới thiệu, blog và tài liệu hướng dẫn cộng đồng (nhiều bản dịch). **Chưa kiểm chứng với bản game chính thức**, nên số liệu cụ thể (cảnh giới, hiệu ứng, công thức) chỉ để lấy cảm hứng; ta tự đặt số liệu riêng.

Những điều tìm được và dùng làm cảm hứng:
- Thế giới mở, NPC sống độc lập, có quan hệ và tham vọng riêng; hành động của người chơi để lại hậu quả (trộm cắp, giết người) và sinh ra kẻ thù.
- Tiên Thiên Khí Vận chọn lúc tạo nhân vật, ảnh hưởng chỉ số gốc, tốc độ tu luyện, cơ hội và thử thách.
- Nghịch Thiên Cải Mệnh: đổi vận khi nguy nan, với cái giá lớn.
- Khoảng 12 loại linh căn, mỗi loại gắn với công pháp riêng; công pháp có yêu cầu tư chất mới học được.
- Cảnh giới đi từ Luyện Khí qua Trúc Cơ, Kim Đan, Nguyên Anh... đến Vũ Hóa/Phi thăng (danh sách khác nhau giữa các nguồn). Đột phá cần linh khí, vật phẩm, điều kiện đặc biệt.
- Tông môn có vai trò (đệ tử, trưởng lão, chưởng môn), nhiệm vụ, bí kíp, cống hiến đổi vật phẩm; chính đạo/tà đạo ảnh hưởng điểm.
- Đạo tâm và đạo điểm; song tu và luận bàn là cách tăng; có thể kết đạo lữ.
- Nhận đồ đệ, lãng mạn với NPC, danh tiếng, kẻ thù không đội trời chung.
- Chế tạo: luyện đan, vẽ bùa, phong thủy, luyện khí (pháp khí).
- Pháp bảo có khí linh; bắt yêu thú làm bạn đồng hành.

## 3. Ánh xạ tính năng: làm gì, làm thế nào

| Tính năng QCBH | Quyết định | Cách làm trong game này |
|---|---|---|
| Tạo nhân vật, tiên thiên khí vận | Làm | 20 tiên thiên, 3 phẩm, random. Đã có ở prototype. |
| Linh căn (12 loại) | Làm | Tư chất 50–200 điểm chia cho 5 ngũ hành + biến dị. Mở rộng số biến dị sau (câu hỏi mở). |
| Cảnh giới và đột phá | Làm | 7 cảnh giới, thêm sơ/trung/hậu kỳ để nhịp đều. Đột phá cần điều kiện, vật phẩm, có thể thất bại. |
| Công pháp, tâm pháp | Làm | Công pháp theo thuộc tính, có yêu cầu tư chất. Tâm pháp tốn đạo điểm. |
| Thiên phú nghề: luyện đan, vẽ bùa, luyện khí, kiếm đạo | Làm | Cấp 0–10, học từ thầy hoặc thực hành, yêu cầu thuộc tính và niệm lực. |
| Đạo tâm, đạo điểm | Làm | Chỉ số liên quan đột phá và chống tâm ma. Tăng qua song tu, luận đạo, hành thiện. |
| NPC sống độc lập | Làm | 15–30 NPC thường trực, cùng bộ máy quyết định. |
| Quan hệ, danh tiếng, kẻ thù | Làm | Thiện cảm từng cặp + danh tiếng chung; kẻ thù chủ động tìm báo thù. |
| Tông môn (đệ tử, trưởng lão, chưởng môn) | Làm | 3–5 tông môn chính/tà, nhiệm vụ, cống hiến, thăng chức. |
| Đạo lữ, song tu, nhận đồ đệ | Làm | Cho phép nhiều đạo lữ, có con cái, nhận đồ đệ. |
| Nghịch Thiên Cải Mệnh | Làm (muộn) | Khi sắp chết hoặc đột phá thất bại, trả giá để đổi vận. Cần bàn thêm. |
| Bản đồ thế giới mở | Làm đơn giản | "Bát Hoang": 8 vùng chữ, mỗi vùng có tài nguyên, nguy hiểm, sự kiện riêng. |
| Bí cảnh, thám hiểm | Làm đơn giản | Sự kiện nhiều bước, có lựa chọn và rủi ro. |
| Chiến đấu hành động (bullet hell) | Bỏ | Thay bằng chiến đấu tự động so chỉ số + kỹ năng, người chơi chọn chiến thuật. |
| Pháp bảo và khí linh, yêu thú đồng hành | Làm sau | Giai đoạn mở rộng. |
| Phong thủy, trận pháp | Làm sau | Giai đoạn mở rộng. |
| Mod, đa nền tảng | Bỏ | Ngoài phạm vi. |

## 4. Kiến trúc kỹ thuật

Chạy được bằng cách mở `index.html`, không cần cài gì. Không dùng ES module (mở file trực tiếp sẽ bị chặn), dùng thẻ `<script>` thường theo đúng thứ tự.

```
game-tu-tien/
  index.html
  KE-HOACH.md
  css/style.css
  js/
    core/      state.js, rng.js, time.js (vòng lặp), bus.js (sự kiện), save.js
    data/      realms.js, elements.js, traits.js, names.js, events.js, techniques.js, sects.js, regions.js
    systems/   character.js, cultivation.js, ai.js, relations.js, sect.js, family.js, combat.js, craft.js, items.js
    ui/        panels.js, log.js, npc-list.js, sect-panel.js, controls.js
  tu-tien-prototype.html   (bản đợt 1 hiện có, giữ làm tham chiếu)
```

### Mô hình dữ liệu cốt lõi
- **World:** thời gian (tháng tuyệt đối), danh sách nhân vật, danh sách tông môn, vùng, sự kiện toàn cục, seed ngẫu nhiên.
- **Character** (người chơi và NPC dùng chung): id, tên, giới, tuổi, cảnh giới, tu vi, chỉ số (sinh lực, công kích, niệm lực, đạo tâm), chỉ số ẩn (khí vận, vận may), tư chất (thuộc tính + điểm), tiên thiên, tính cách, hướng đi, vị trí, tông môn + chức vị, quan hệ, đạo lữ, con cái, túi đồ, công pháp, thiên phú, trạng thái (sống/chết/mất tích), nhật ký riêng.
- **Relation:** (idA, idB) → thiện cảm, loại (bạn, sư đồ, đạo lữ, kẻ thù...), ký ức sự kiện chính.
- **Sect:** tên, chính/tà, thế lực, tài nguyên, danh sách thành viên + chức vị, kho bí kíp.
- Người chơi chỉ khác NPC ở cờ `controller = 'player'` (hướng đi do người chơi đặt, còn NPC do máy chọn theo tính cách).

### Vòng lặp và AI quyết định
- Tick theo **tháng game**; hệ số thời gian cấu hình được (xem mục 7).
- Mỗi tick với mỗi nhân vật còn sống: chấm điểm các hành động (tu luyện, rèn thể, kiếm sống, tìm cơ duyên, nghỉ ngơi, kết giao, nhiệm vụ tông môn, luyện đan...) theo: hướng đi, tính cách, nhu cầu (sinh lực thấp thì nghỉ), mục tiêu (đang cần đột phá), cơ hội xung quanh. Chọn có trọng số ngẫu nhiên.
- NPC xa người chơi cập nhật **thô** (mỗi quý hoặc mỗi năm) để nhẹ máy; NPC liên quan người chơi cập nhật chi tiết.
- Khoảnh khắc lớn của **người chơi** tạo yêu cầu quyết định (pending decision) và dừng thời gian; của NPC thì máy tự quyết.

### Sự kiện
- Bus sự kiện: các hệ thống phát `event`, hệ thống khác và nhật ký lắng nghe.
- Sự kiện dữ liệu hóa (JSON/JS object): điều kiện, trọng số, các lựa chọn, kết quả. Thêm nội dung chỉ cần sửa `data/events.js`.
- Có cả sự kiện thế giới (NPC với NPC) hiện dưới dạng tin đồn hoặc bảng "Thiên hạ".

### Lưu game
- Serialize `World` vào `localStorage` (try/catch), có nút xuất/nhập file JSON để sao lưu.
- Có số phiên bản dữ liệu để nâng cấp bản lưu cũ.

### Chất lượng
- Mô phỏng headless (không UI) chạy thử hàng nghìn đời để cân bằng số liệu: tỉ lệ Phi thăng, tuổi thọ trung bình, độ dài đời.
- Một bộ kiểm tra tự động nhỏ cho các công thức then chốt.

## 5. Thiết kế hệ thống

### 5.1 Cảnh giới
Phàm nhân → Luyện Khí → Trúc Cơ → Kim Đan → Nguyên Anh → Hóa Thần → Phi Thăng. Mỗi cảnh giới chia sơ/trung/hậu kỳ. Thọ nguyên theo cảnh giới (hiện: 70/130/260/520/1000/2000). Đột phá lớn cần: đủ tu vi, vật phẩm (đan, linh dược), đạo tâm đủ, có thể gặp thiên kiếp. Thất bại gây tổn thương, hao tu vi, có xác suất tử vong.

### 5.2 Tư chất, tiên thiên, chỉ số
- Tư chất: tổng 50–200 điểm (lệch về thấp), chia cho ngũ hành + biến dị. Công thức hiện có: tốc độ tu theo thuộc tính cao nhất, số thuộc tính nhiều thì chậm và khó đột phá nhưng học được nhiều thuật.
- 20 tiên thiên (10 tốt, 10 xấu; phẩm trắng/xanh/vàng). Mở rộng sau.
- Chỉ số cơ bản: Sinh lực, Công kích, Niệm lực. Chỉ số ẩn: Khí vận, Vận may (lộ khi gặp thầy tướng hoặc đạt cảnh giới). Thêm **Đạo tâm** (hiện).
- Kỳ ngộ 5–15% đổi vận: xem prototype, mở rộng bảng kỳ ngộ.

### 5.3 Công pháp và thiên phú nghề
- Công pháp gắn thuộc tính; cần điểm tư chất tối thiểu của thuộc tính đó mới học. Có phẩm (trắng/xanh/vàng), cấp luyện.
- Tâm pháp: bị động, tốn đạo điểm, bổ trợ công pháp.
- Thiên phú nghề: kiếm đạo, luyện khí, luyện đan, vẽ bùa (sau: trận pháp, y thuật, ngự thú). Cấp 0–10, kinh nghiệm riêng, yêu cầu thuộc tính + niệm lực, cần thầy hoặc sách để vượt cấp.
- Vật phẩm: đan dược, bùa chú, pháp khí, linh dược, vật liệu; có túi đồ và giá trị mua bán.

### 5.4 Thế giới "Bát Hoang"
Tám vùng chữ, mỗi vùng có đặc trưng (linh khí, tài nguyên, nguy hiểm, loại sự kiện, NPC cư trú), ví dụ: làng quê, thành thị, hoang mạc, rừng yêu thú, núi tuyết, hải đảo, cổ địa, tông môn. Nhân vật di chuyển giữa các vùng; vùng xa nguy hiểm hơn nhưng nhiều cơ duyên.

### 5.5 NPC và quan hệ
- NPC có tên sinh ngẫu nhiên (không dùng tên nhân vật sẵn có), tính cách (hiền, kiêu, mưu mô, trọng nghĩa...), mục tiêu cá nhân, quan hệ.
- Thiện cảm -100..100 giữa mọi cặp NPC đã gặp, chia mức: kẻ thù, ghét, xa lạ, quen, bạn, tri kỷ.
- Hành động của người chơi để lại **danh tiếng** (chính/tà, ngạo mạn, nhân nghĩa) và **ký ức** NPC; trộm cắp, giết người có thể sinh ra kẻ thù chủ động truy đuổi.
- Tương tác do **nhân vật tự quyết** theo hướng đi + thái độ; người chơi chỉ quyết ở khoảnh khắc lớn.
- NPC tự tu luyện, đột phá, kết bạn, thù oán, cưới, sinh con, chết; có bảng "Thiên hạ" ghi tin tức đáng chú ý.

### 5.6 Tông môn
- 3–5 tông môn (chính đạo, tà đạo, trung lập) với tài nguyên và thế lực riêng.
- Chức vị: ngoại môn, nội môn, chân truyền, trưởng lão, chưởng môn.
- Nhiệm vụ và cống hiến đổi lấy bí kíp, linh dược, chức vị. Chính/tà ảnh hưởng điểm và quan hệ.
- Sau này: thăng cấp tông môn, chiến tranh giữa các tông môn, tranh đoạt tài nguyên.

### 5.7 Gia đình, đạo lữ, kế thừa
- Cho phép **nhiều đạo lữ**, có con, nhận đồ đệ. Song tu tăng đạo tâm/đạo điểm; luận đạo cũng vậy.
- Con cháu thừa hưởng một phần tư chất (ngẫu nhiên, có biến dị).
- Khi người chơi chết có thể **tiếp tục bằng con/đồ đệ** (kế thừa di vật, quan hệ, danh tiếng) hoặc đầu thai làm mới. Hai chế độ lựa chọn.

### 5.8 Nghịch Thiên Cải Mệnh
Khi sắp chết hoặc đột phá thất bại nặng, người chơi có thể trả giá (giảm thọ nguyên, mất một tiên thiên tốt, tăng nghiệp chướng...) để sống sót hoặc đổi một yếu tố vận mệnh. Mỗi đời giới hạn số lần. **Còn cần bàn thiết kế chi tiết.**

### 5.9 Chiến đấu
Tự động theo hiệp, so chỉ số (công kích, sinh lực, niệm lực, thuộc tính khắc chế ngũ hành) cộng kỹ năng của công pháp. Người chơi chọn chiến thuật tổng quát (công, thủ, chạy) trước trận. Đơn giản, dễ cân bằng.

## 6. Lộ trình và tiêu chí hoàn thành

Mỗi mốc chạy được và chơi thử trước khi sang mốc sau.

| Mốc | Nội dung | Tiêu chí xong |
|---|---|---|
| **M0 Sườn** | Dựng cấu trúc thư mục, mô hình Character/World, vòng lặp tháng, bus sự kiện, lưu/tải. NPC ban đầu chỉ tu luyện và già. | Mở `index.html` thấy người chơi và 20 NPC chạy theo thời gian, lưu/tải được, không lỗi console. |
| **M1 Chuyển đợt 1** | Chuyển chỉ số, tư chất, tiên thiên, kỳ ngộ, sự kiện hiện có sang sườn mới. Người chơi chạy bằng AI theo hướng đi. | Chơi được một đời đầy đủ tương đương prototype, nhưng nhân vật tự quyết hành động. |
| **M2 Quan hệ và NPC** | Thiện cảm, tương tác, danh tiếng, kẻ thù, tin tức "Thiên hạ". NPC tự kết bạn, kết thù, chết. | Có thể thấy NPC đổi quan hệ và chết khi bạn không gặp; kẻ thù đến báo thù. |
| **M3 Tông môn** | 3–5 tông môn, chức vị, nhiệm vụ, cống hiến, bí kíp, chính/tà. | Gia nhập, thăng chức, rời/bị trục xuất; NPC cũng làm vậy. |
| **M4 Gia đình và kế thừa** | Đạo lữ (nhiều), song tu, con cái, đồ đệ, chế độ tiếp tục bằng người kế thừa. | Có thể sống nhiều thế hệ; con cái mang tư chất kế thừa. |
| **M5 Công pháp, thiên phú, vật phẩm** | Công pháp theo thuộc tính, tâm pháp, thiên phú nghề, túi đồ, mua bán, luyện đan, vẽ bùa. | Học và luyện được ít nhất 4 thiên phú; đột phá cần vật phẩm. |
| **M6 Thế giới và chiến đấu** | Bát Hoang 8 vùng, bí cảnh nhiều bước, chiến đấu tự động theo hiệp. | Di chuyển giữa vùng, thám hiểm, chiến đấu có chiến thuật. |
| **M7 Nghịch Thiên và hoàn thiện** | Nghịch Thiên Cải Mệnh, thiên kiếp, cân bằng bằng mô phỏng hàng loạt, tốc độ thời gian, giao diện đẹp, di động. | Một đời Phi thăng mất thời gian mục tiêu; tỉ lệ thành công hợp lý. |
| **M8 Mở rộng (tùy chọn)** | Pháp bảo + khí linh, yêu thú đồng hành, phong thủy, trận pháp, chiến tranh tông môn. | Theo nhu cầu. |

## 7. Vấn đề thời gian (chưa chốt)

Thọ nguyên tăng theo cảnh giới nhưng 1 năm = 5 giây cố định, nên đời dài sẽ mất hàng giờ. Phương án đang xét:
- **A** Tốc độ tự nhanh dần theo cảnh giới.
- **B** Nút tua tới sự kiện/đột phá kế tiếp.
- **C** Sự kiện tính theo giây thật, không theo năm game.
- **D** Đổi đơn vị thời gian (tháng/năm/thập niên) theo cảnh giới.
- **E** Cân bằng số liệu để mỗi cảnh giới mất 3–5 phút thật.

Đề xuất: **E + A + B**, thêm C nếu thấy chán. Mục tiêu: một đời đến Phi thăng khoảng 20–30 phút. Hệ số thời gian được để cấu hình ngay từ M0; chốt chính thức ở M7 hoặc sớm hơn nếu bạn muốn.

## 8. Câu hỏi mở cần bạn quyết

1. Thời gian một đời mong muốn và chọn A/B/C/D/E (mục 7).
2. Số loại thuộc tính tư chất: giữ 5 ngũ hành + 5 biến dị, hay mở rộng gần 12 như bản gốc?
3. Kế thừa: khi chết có tiếp tục bằng con/đồ đệ, hay luôn đầu thai làm người hoàn toàn mới, hay cho chọn?
4. Nghịch Thiên Cải Mệnh: cái giá và giới hạn lần dùng.
5. Số NPC thường trực: 15–30, đủ không?
6. Có cần giao diện bản đồ (nhấp vùng) hay chỉ danh sách chữ?
7. Ngôn ngữ: tiếng Việt hoàn toàn, hay chuẩn bị sẵn để dịch sang ngôn ngữ khác?
8. Mức độ nội dung nhạy cảm: song tu, thù hận, cái chết (đã bỏ cảnh tự tử như tham khảo).

## 9. Rủi ro và cách giảm

| Rủi ro | Cách giảm |
|---|---|
| Phạm vi quá lớn | Làm theo mốc, mỗi mốc chơi được; M8 là tùy chọn. |
| Cân bằng khó (tu vi, tuổi thọ, đột phá) | Mô phỏng headless hàng loạt từ M1; số liệu để trong `data/`. |
| NPC chậm máy | Cập nhật thô cho NPC xa; giới hạn số NPC thường trực. |
| Tự động quá nhiều làm người chơi thấy thụ động | Quyết định lớn luôn dừng game hỏi người chơi; hướng đi có nhiều tùy chọn. |
| Bản lưu hỏng sau cập nhật | Số phiên bản dữ liệu + nút xuất/nhập JSON. |
| Bản quyền/nhái | Nội dung tự viết, tên tự sinh, chỉ dùng khuôn mẫu thể loại chung. |
| Nguồn tham khảo không chính xác | Coi nguồn là cảm hứng, tự đặt số liệu; kiểm tra thêm nếu cần bám sát bản gốc. |

## 10. Trạng thái hiện tại

- `tu-tien-prototype.html`: bản đợt 1 chạy được (theo thiết kế, chưa kiểm thử thực tế trong trình duyệt): tư chất, 20 tiên thiên, chỉ số, kỳ ngộ, thời gian chạy liên tục, 14 sự kiện.
- Chưa có: NPC, tông môn, đạo lữ, công pháp, thiên phú, bản đồ, Nghịch Thiên, cân bằng thời gian.
- Bước tiếp theo: bạn duyệt kế hoạch, trả lời mục 8, sau đó bắt đầu **M0**.


## 11. Quyết định đã chốt (2026-10-15)

| # | Chủ đề | Quyết định |
|---|---|---|
| 1 | Thời gian | Dùng E + A + B (cân bằng số liệu + tốc độ tự nhanh dần theo cảnh giới + nút tua tới sự kiện). Thêm C nếu còn chán. Mục tiêu một đời 20–30 phút. |
| 2 | Thuộc tính tư chất | 5 ngũ hành + 5 biến dị (giữ nguyên). |
| 3 | Kế thừa | Cho cả hai cách. **Đầu thai mới:** có xác suất linh căn/tư chất tốt hơn, nhưng không mang theo Nghịch Thiên. **Kế thừa:** mang theo nhân quả đời trước (ơn, nghiệp, kẻ thù, nợ ân tình) và phải gánh. |
| 4 | Nghịch Thiên Cải Mệnh | Thiết kế cái giá và giới hạn sau (ở M7). |
| 5 | NPC | 5–7 NPC **thân thiết** (hiện trạng thái tình cảm). Còn lại là NPC **qua đường**, nhưng có thể giữ vai trò cố định (sư phụ, chưởng môn, thương nhân...). Sự kiện có thể nâng NPC qua đường lên thân thiết. |
| 6 | Bản đồ | Có bản đồ, hiển thị vị trí của bạn và NPC. |
| 7 | Ngôn ngữ | Chỉ tiếng Việt. |
| 8 | Nội dung nhạy cảm | Giữ đầy đủ (song tu, thù hận, cái chết...), tăng tần suất xuất hiện. Viết ở mức văn học, không miêu tả chi tiết cảnh nhạy cảm. |

## 12. Chống cảm giác thụ động (game tự chạy quá nhiều)

Rủi ro: nhân vật tự quyết và thời gian tự chạy nên người chơi chỉ ngồi xem. Giải pháp là gói 6 phần, làm từ sớm:

1. **Ba tầng quyết định.**
   - Tầng 1 (thường ngày): máy tự quyết, chỉ ghi vào nhật ký.
   - Tầng 2 (quan trọng vừa): hiện hộp chọn có đếm ngược vài giây, quá giờ thì máy chọn mặc định theo hướng đi.
   - Tầng 3 (đổi đời: đột phá, sinh tử, cưới hỏi, kết thù, vào tông môn): dừng hẳn chờ người chơi.
   - Mục tiêu: khoảng 2–4 lựa chọn có ý nghĩa mỗi phút; không để quá 30 giây thật mà không có gì để làm hoặc để xem.
2. **Hướng đi thành lớp chiến lược thật.**
   - Thanh trượt phân bổ thời gian (tu luyện / kiếm sống / xã giao / mạo hiểm).
   - **Quy tắc nếu-thì** (ví dụ: sinh lực dưới 30% thì nghỉ; gặp kẻ thù thì chạy hoặc đánh; cơ duyên nguy hiểm thì thử hoặc bỏ).
   - **Mục tiêu đời** có thanh tiến độ và hạn (đột phá Trúc Cơ trước 30 tuổi, vào tông môn X, báo thù Y, tìm đạo lữ).
3. **Can thiệp chủ động bất cứ lúc nào.**
   - Tài nguyên "Thiên cơ điểm" tích lũy dần; tiêu để đổi lại một lần tung xúc xắc quan trọng hoặc nghiêng xác suất.
   - Nút dốc sức (tu nhanh đổi sinh lực), bế quan đột kích, nhờ bạn thân giúp, dùng đan khẩn cấp; có thời gian hồi.
4. **Chuẩn bị trước cú tung lớn.** Đột phá không còn là bấm nút. Có giai đoạn chuẩn bị: chọn nơi, chọn thời điểm, đan dược, người hộ pháp, tâm pháp. Mỗi lựa chọn đổi xác suất hiển thị rõ. Đây là khoảnh khắc thú vị nhất của game.
5. **Báo trước và hạn chót.**
   - Tin đồn và điềm báo: "Bí cảnh sẽ mở ở phương Bắc sau 2 năm", "kẻ thù đang tìm bạn", "tông môn sắp tuyển đệ tử".
   - Cơ hội có hạn buộc người chơi lập kế hoạch: đi đâu, luyện gì, kéo bạn nào.
6. **Gắn bó với 5–7 NPC thân thiết.** Họ có yêu cầu, tình huống khó xử đạo đức, trạng thái tình cảm hiển thị. Nhật ký "Sử ký" tóm tắt đời bạn dễ đọc.

Phụ trợ:
- **Cài đặt mức tự động:** Thủ công (hỏi nhiều), Cân bằng (mặc định), Tự động. Người thích xem thì để tự động, người thích điều khiển thì để thủ công.
- Báo cáo cuối năm cho thấy rõ nguyên nhân và kết quả, để người chơi thấy lựa chọn của mình có tác dụng.
- Lý do chơi lại: bộ sưu tập kết cục, kế thừa nhân quả, mở khóa kho tiên thiên.

**Cách đo:** mô phỏng headless đếm số lần cần người chơi quyết định mỗi phút và khoảng "thời gian chết" dài nhất, rồi chỉnh tần suất sự kiện cho đạt mục tiêu.

**Gán vào lộ trình:** tầng quyết định + quy tắc nếu-thì ở M1; mục tiêu đời + báo trước ở M2; chuẩn bị đột phá + Thiên cơ điểm ở M5; cài đặt mức tự động + cân bằng bằng mô phỏng ở M7.


## 13. Tiến độ

- **M0 (2026-10-15): xong.** Sườn dự án chạy được: `index.html` (mở trực tiếp được), `tests.html` (8 bài kiểm thử đạt: RNG lặp lại được, tạo thế giới, tư chất, mô phỏng 100 năm, lưu/tải cho cùng kết quả, quyết định đột phá/đầu thai, số liệu cân bằng). Thế giới có 20 NPC tự tu luyện, già, đột phá, chết, người mới đến thay thế; người chơi chạy theo hướng đi, dừng hỏi ở đột phá/chết/phi thăng; tự lưu mỗi năm, có xuất/nhập JSON.
- Ghi chú cân bằng (để M7): sau 100 năm game, NPC còn sống đa số đã ở Kim Đan/Nguyên Anh và tuổi chết trung bình khoảng 109, tức tiến triển đang quá nhanh. Chỉ xử lý ở M7.
- Chạy thử có máy chủ: `serve.ps1` (cổng 8765), không bắt buộc.
- Tiếp theo: **M1** (chuyển sự kiện, kỳ ngộ, tư chất kỳ ngộ của đợt 1 sang sườn mới, thêm tầng quyết định và quy tắc nếu-thì).

- **Chỉnh nhịp tu luyện (2026-10-15):** làm tu luyện chậm lại và thêm áp lực. Hệ số tích lũy tu vi 0,4; tu vi cần cho từng cảnh giới tăng mạnh. Thêm **cơ duyên** và **bình cảnh**: mỗi lần đột phá cần đủ tu vi *và* đủ cơ duyên (4/8/12/18/28 cho các cảnh giới từ Luyện Khí trở lên); kiếm cơ duyên chủ yếu bằng "Tìm cơ duyên", khí vận cao thì dễ hơn. Xác suất đột phá dựa vào nỗ lực (tu vi tích lũy dư), cơ duyên dư và niệm lực, tư chất ít ảnh hưởng. Thất bại mất một nửa cơ duyên đã dùng. Mô phỏng 20 thế giới x 100 năm: tư chất thấp đạt Trúc Cơ khoảng 3%, tư chất khá 12%, tư chất cao 22%. Các số này nằm trong `js/data/realms.js`, chỉnh được. Bản lưu cũ không dùng được (phiên bản dữ liệu 2).

- **Giảm tỉ lệ đột phá từ Trúc Cơ và thêm bổ trợ (2026-10-15):** xác suất nền khi đột phá từ Trúc Cơ chỉ 6% (giảm 2% mỗi cảnh giới sau). Muốn cao phải cộng dồn các phần bổ trợ, mỗi phần hiển thị rõ trong hộp "Thời khắc đột phá": nỗ lực (tu vi tích lũy dư, tối đa +15%), cơ duyên dư (+2% mỗi điểm, tối đa +10%), niệm lực và linh ngộ, vận may, **Phá Cảnh Đan** (mua bằng vàng, tối đa 3 viên, +6% mỗi viên), **động phủ linh khí** (+8%). Bổ trợ mất đi sau mỗi lần thử đột phá. NPC có tiền cũng tự dùng bổ trợ. Ví dụ Trúc Cơ lên Kim Đan: khoảng 18% khi chưa bổ trợ, lên được khoảng 60% khi dùng đủ. Hộ pháp (NPC thân thiết), tâm pháp, bí cảnh sẽ là bổ trợ thêm ở M2, M5, M6. Số liệu ở `js/data/realms.js` (mục `AID`). Bản lưu cũ không dùng được (phiên bản dữ liệu 3).

- **Bản đồ cố định (2026-10-15):** đã thay danh sách NPC bằng bản đồ sơ đồ nút (SVG). 9 khu vực: Trung Châu (đồng bằng), Đông Hải (biển), Tây Thiên Sơn (núi cao), Nam Lâm (rừng rậm), Bắc Cực Băng Nguyên (cực băng), Hỏa Diệm Sơn (núi lửa), Hoang Mạc Kim Sa (sa mạc), Vụ Trạch (đầm lầy), Lôi Đảo (đảo giông bão). Mỗi vùng có linh khí, nguy hiểm, phồn hoa và thuộc tính hợp vùng (hợp tư chất thì tu luyện nhanh thêm tối đa 80%). Nhân vật sinh ra ở vùng ngẫu nhiên, đi lại mất 3-4 tháng mỗi chặng (tự tìm đường ngắn nhất), NPC tự cân nhắc đổi nơi ở theo việc muốn làm, sức mạnh, sở thích riêng và độ đông người. Người chơi bấm vùng rồi "Đi tới", hoặc bật "Tự di chuyển". Vùng nguy hiểm gây thương tích cho người yếu hơn mối đe dọa. Dữ liệu ở `js/data/regions.js`, hệ số ở `js/systems/map.js`. Hệ số tu luyện chung hạ xuống 0,28 để bù tăng tốc từ vùng linh khí. Bản lưu cũ không dùng được (phiên bản dữ liệu 5).

- **Thiết kế bản đồ lồng nhau (2026-10-15, chưa code):** 9 vùng lớn mỗi vùng có bản đồ nhỏ cố định 10 địa điểm (thành trì, thôn trấn, tông môn, bộ tộc, thương đoàn, linh mạch, bí cảnh, tàn tích, cửa ải...), có quốc gia và thế lực. Sinh ra ngẫu nhiên ở một địa điểm; vượt vùng cần Nguyên Anh/Hóa Thần và 60-120 năm. Chi tiết trong `MAP-THIET-KE.md`. Chờ bạn duyệt 5 câu hỏi cuối tài liệu trước khi code.

- **M1 (2026-10-15): xong.** Bộ nạp script chung `js/files.js` (thêm file chỉ sửa một chỗ). 36 sự kiện trong `js/data/events.js` (15 từ prototype, phần thưởng đã chỉnh theo thang tu vi mới, cộng 21 sự kiện mới theo loại địa điểm và đặc trưng từng vùng), bảng kỳ ngộ `D.FATE` (tăng tư chất, thức tỉnh biến dị, xóa tiên thiên xấu, nhận tiên thiên tốt, tăng khí vận, lộ chỉ số ẩn; đo được khoảng 10-11% mỗi lần gặp sự kiện có kỳ ngộ). Ba tầng quyết định (`js/systems/decisions.js`): tầng 1 tự chạy ghi nhật ký, tầng 2 hộp chọn đếm ngược 12 giây rồi máy chọn mặc định (theo quy tắc nếu-thì, rồi hướng đi và tính cách), tầng 3 dừng hẳn. Mức tự động Thủ công/Cân bằng/Tự động đã có ở thanh trên cùng (làm sớm hơn kế hoạch, ở M7 chỉ cần chỉnh). Quy tắc nếu-thì (`js/systems/rules.js`, bảng ở cột trái): sinh lực dưới X% thì nghỉ, vàng dưới X thì kiếm sống, kẹt bình cảnh thì tìm cơ duyên, cơ hội nguy hiểm thì thử/bỏ qua, gặp kẻ thù/yêu thú thì đánh/chạy. NPC cũng gặp một số sự kiện (rất thưa, tự chọn). Đo nhịp: khoảng 3,5 lần hỏi mỗi phút ở tốc độ x1; quãng "thời gian chết" dài nhất vẫn còn lâu (khoảng hai phút ở x1), sẽ cải thiện ở M2 (mục tiêu, tin đồn) và M7 (tốc độ tự nhanh dần). Bản lưu phiên bản 7. Tests: `tests.html` chạy từng bài một (không treo trang), thêm bài đo cân bằng phân tầng theo vùng ít nhiễu hơn.
- **M2 (2026-10-15): xong.** Quan hệ (`js/systems/relations.js`): thiện cảm đối xứng -100..100 lưu ở `world.rel`, mức Kẻ thù/Ghét/Xa lạ/Quen/Bạn/Tri kỷ, loại đặc biệt (kết nghĩa, kẻ thù, đạo lữ, sư đồ chừa cho M4). Giao du (`js/systems/social.js`): thêm hành động "Giao du" và hướng đi "Giao du"; nhân vật (người chơi và NPC dùng chung) tự chọn người cùng chỗ để trò chuyện, luận đạo, tặng quà, cãi vã, tranh chấp, hợp tác theo độ hợp tính cách và thiên hướng chính/tà. Người chơi chỉ bị hỏi ở khoảnh khắc lớn (`js/data/relevents.js`): kết nghĩa, va chạm, nhờ vả, làm quen, kẻ thù tìm đến, tha hay giết. 5-7 người thân thiết hiện ở tab "Quan hệ" kèm trạng thái tình cảm; còn lại là người qua đường (cột "Quan hệ" trong danh sách người, bấm vào để xem thẻ và chủ động giao tiếp). Danh tiếng (danh vọng và thiên hướng chính/tà), nghiệp. Kẻ thù: giết người hoặc bẽ mặt người sinh ra thù, NPC thề báo thù tự đi tìm tới nơi bạn ở, có tin báo trước ("X đang tìm bạn, dự kiến tới sau N tháng") rồi giáp mặt; NPC với NPC cũng báo thù lẫn nhau. Chiến đấu nhanh `js/systems/combat.js` (so công kích, niệm lực, thủ, chí mạng; M6 mở rộng). Mục tiêu đời (`js/systems/goals.js`): cảnh giới, vàng, bạn bè, khám phá, danh vọng, ân oán; có thanh tiến độ, hạn theo tuổi, thưởng đạo tâm/đạo điểm/Thiên cơ điểm, trễ hạn bị phạt, hộp chọn mục tiêu (tầng 2). Tin đồn và cơ hội có hạn (`js/systems/rumors.js`): bí cảnh, cao nhân giảng đạo, đấu giá, đại hội luận đạo báo trước vài năm, người chơi lập kế hoạch tới dự (hoặc nhân vật tự đi theo hướng đi), lỡ thì mất. Giao diện bên trái chia tab (Nhân vật, Quan hệ, Mục tiêu, Quy tắc). Hành động giao du làm giảm thời gian tu luyện nên `D.TRAIN_RATE` nâng 0,42 lên 0,50 để giữ nhịp. Bản lưu phiên bản 8. "Duyên phận" của prototype được thay bằng quan hệ thật với NPC (kết nghĩa ở M2, đạo lữ ở M4). Đã sửa lỗi nghiêm trọng: chết khi đang có hộp quyết định khác thì không hiện hộp "Đạo tiêu" (nay chết luôn thay thế hộp đang chờ).
- **M3 (2026-10-15): xong.** 9 tông môn lấy từ các địa điểm `tong_mon` có sẵn (`js/data/sects.js`): Thanh Vân Tông, Thủy Nguyệt Cung, Kim Phong Môn, Bách Thảo Môn, Tử Lôi Quan (chính đạo), Huyền Băng Cung, Liệt Hỏa Tông, Nhật Luân Giáo (trung lập), Âm Hồn Giáo (tà đạo). Chức vị: ngoại môn, nội môn, chân truyền, trưởng lão, chưởng môn (`js/systems/sect.js`). Gia nhập cần điểm tư chất chính tối thiểu (hợp thuộc tính của tông thì giảm 8) và không xung khắc chính/tà; mùa tuyển đệ tử (tin đồn báo trước) và lời mời ở cổng tông môn là sự kiện tầng 3. Thành viên làm "nhiệm vụ tông môn" thay cho hành động kiếm sống (sinh cống hiến), nhận bổng lộc hằng năm, tu luyện nhanh hơn 5% mỗi bậc (cộng 10% nếu hợp thuộc tính), hỗ trợ đột phá 2% mỗi bậc. Lên bậc: nội môn (cảnh giới 1, 120 cống hiến), chân truyền (cảnh giới 2, 700), trưởng lão (cảnh giới 3, 2500, tối đa 3 ghế), chưởng môn chỉ qua kế vị (người chơi là trưởng lão thì được hỏi tranh ngôi hoặc ủng hộ đối thủ). Kho cống hiến đổi Phá Cảnh Đan, linh dược, tâm đắc, mượn động phủ (mốc M5 thêm công pháp và vật phẩm vào cùng bảng). Chính/tà: nhiệm vụ của tông chính đạo tăng chính khí, tà đạo giảm; tiếng xấu quá mức bị trục khỏi tông chính, quá chính bị tà đạo đuổi; bỏ chức trưởng lão trở lên hoặc bị trục khi đã chân truyền thì chưởng môn ghi hận. Mỗi tông luôn đủ chưởng môn và trưởng lão (NPC phụ hoặc thăng người từ đệ tử); NPC lõi tự gia nhập, làm nhiệm vụ, thăng chức. **Đại trận tông môn đã mở khóa** cho trưởng lão trở lên (1500 cống hiến và 300 vàng, tức thì, thành công khoảng 92%). Có tab "Tông môn" và khối thông tin tông môn ở địa điểm. Bản lưu phiên bản 9. Thêm hàm bảo vệ: sự kiện không giết người chơi ngay tại chỗ (còn 1 sinh lực).
- **M4 (2026-10-15): xong.** Gia đình (`js/systems/family.js`, `js/data/famevents.js`): tình cảm yêu đương (`rec.love`) nảy nở qua giao du và "tâm sư" giữa cặp đủ 18 tuổi, không ruột thịt, khác giới (cùng giới hiếm hơn); đủ gắn bó thì tỏ tình (tầng 3) rồi kết đạo lữ. Người chơi được nhiều đạo lữ (đạo lữ cũ ghen, có sự kiện hờn ghen), NPC chỉ một. Hành động mới **Song tu** (chỉ khi đạo lữ ở cùng chỗ): tu nhanh hơn 30%, tăng đạo tâm và đạo điểm, thụ thai khoảng 1,8% mỗi tháng (tối đa 4 con, cách nhau 2 năm). Con cái mang họ cha, thừa hưởng một phần tư chất (75% bốc ngẫu nhiên, 25% từ bố mẹ theo từng thuộc tính, có thể truyền lại biến dị và tiên thiên), lớn lên tới 12 tuổi mới tu luyện (thời gian chạy nhanh gấp 6 nếu người chơi còn nhỏ). Đồ đệ: từ Trúc Cơ nhận tối đa 5, tu nhanh thêm 15% (25% nếu ở cùng chỗ), sư phụ được tiếng khi đồ đệ đột phá; NPC mạnh cũng tự nhận đồ đệ. Nợ ân tình (được cứu giúp thì mắc nợ, chủ nợ tới đòi: trả, làm công hoặc quịt). **Khi chết cho chọn:** đầu thai mới (bốc tư chất hai lần lấy lần tốt hơn, trung bình cao hơn khoảng 20 điểm, không mang gì) hoặc kế thừa con hay đồ đệ (mang theo 60% vàng, 50% Thiên cơ điểm và nghiệp, nửa danh vọng, ơn của bạn bè cũ, kẻ thù đổi sang người thừa kế, nợ ân tình và nợ phải thu). Sử ký các đời và bộ sưu tập 15 kết cục (lưu riêng, qua các thế giới). Bản lưu phiên bản 10.
- **M5 (2026-10-15): xong.** Túi đồ, trang bị và chợ (`js/data/items.js`, `js/systems/items.js`): 5 loại vật phẩm (đan, bùa, pháp khí, nguyên liệu, bí kíp và tâm đắc), 3 chỗ trang bị (vũ khí, giáp, bùa hộ thân); chợ ở thành trì, thương đoàn (rẻ nhất), chợ đen (hàng hiếm, đắt), bến, trạm, mỏ, phường; bán lại giá 50-62%. Công pháp (`js/data/techs.js`, `js/systems/tech.js`): 24 công pháp theo thuộc tính (4 phẩm), yêu cầu điểm tư chất hệ và cảnh giới, học bằng bí kíp (có ở chợ, kho tông môn, sự kiện, bí cảnh), cấp luyện 0-9, công pháp chính làm tu luyện nhanh thêm 8-45% và cộng công kích. Tâm pháp: 8 tâm pháp bị động tốn đạo điểm, cần đạo tâm và cảnh giới, số chỗ tăng theo cảnh giới (1 tới 4). Thiên phú nghề (`js/systems/craft.js`): kiếm đạo, luyện khí, luyện đan, vẽ bùa, cấp 0-10, hợp thuộc tính và niệm lực thì học nhanh; qua cấp 3 cần tông môn chuyên nghề (Kim Phong: kiếm, Liệt Hỏa: khí, Bách Thảo: đan, Tử Lôi: bùa; trần +4) hoặc tâm đắc (+2 mỗi quyển), còn bị cảnh giới giới hạn; hành động mới "Luyện nghề" và hướng đi mới "Luyện nghề". NPC không dùng túi đồ, công pháp, nghề (giữ nhịp thế giới). **Hộp chuẩn bị đột phá** dựng lại: các hàng bật/tắt có hoàn lại (Phá Cảnh Đan trong túi hoặc mua, động phủ, Ngưng Thần Đan, Hộ Mạch Đan giảm tổn thương và nguy cơ chết, hộ pháp là người thân thiết ở cùng chỗ, Thiên cơ nghịch chuyển +10%), kiếm đạo và tâm pháp cộng tự động, nơi đột phá (linh khí dày, bế quan ở tông môn) cộng thêm, hiện rõ xác suất và nguy cơ tử vong. **Thiên cơ điểm**: nhận khi đột phá (bằng cảnh giới mới), mỗi 12 tuổi, hoàn thành mục tiêu; dùng nghịch chuyển +10% khi đột phá (tốn 1 + cảnh giới), đổi lại một lần đột phá thất bại (tốn 2 + cảnh giới, hộp tầng 3), hoặc +20% truyền tống trận (3 điểm). Bùa tự dùng ở trận quan trọng, Thoát Thân Phù chắc chắn thoát, quy tắc nếu-thì thêm "uống đan khi sinh lực thấp". Kế thừa mang cả di vật (túi đồ, trang bị, công pháp đã sâu thành bí kíp). Bản lưu phiên bản 11.
- **M6 (2026-10-15): xong.** Chiến đấu theo hiệp (`js/systems/combat.js`): so công kích, niệm lực, phòng thủ, chí mạng; **ngũ hành khắc chế** (Kim khắc Mộc khắc Thổ khắc Thủy khắc Hỏa khắc Kim, cộng khắc chế cho các biến dị; thuộc tính tính theo công pháp chính hoặc thuộc tính tư chất cao nhất; đo: hệ khắc thắng khoảng 99% so với 10% khi hai bên cùng chỉ số), **chiến thuật** công/thủ/chạy do người chơi chọn (chạy thoát theo tốc độ), trang bị, công pháp, bùa tính vào sức mạnh. Quái vật (`js/data/monsters.js`): 16 loài và thủ lĩnh. **Bí cảnh, tàn tích, hung địa nhiều bước** (`js/systems/dungeon.js`, `js/data/dgevents.js`): mỗi chuyến 4-5 chặng (cấm chế, quái, kho báu, chỗ nghỉ, thủ lĩnh), mỗi chặng một hộp quyết định có rủi ro và có đếm ngược; rút lui bất cứ lúc nào thì giữ thu hoạch, bại trận mất nửa, thủ lĩnh có thể đánh tới cùng (thua có thể chết nhưng 35% thoát chết); thông quan được thưởng Thiên cơ điểm và danh vọng; nghỉ 12 tháng giữa hai chuyến. Vào qua sự kiện lối vào, tin đồn bí cảnh mở (nay có NPC đổ vào, có người không trở ra, lên tin Thiên hạ) hoặc nút "Thám hiểm" ở địa điểm. Đo với người chơi Trúc Cơ có kiếm và áo: thông quan khoảng 30-35%, chết 0-20%, thu hoạch khoảng 200-260 vàng mỗi chuyến. Sự kiện yêu thú nay có chọn chiến thuật. **Sự kiện dọc đường vượt vùng** phong phú hơn nhiều: 10 loại (bão hư không, yêu thú, đạo tặc, di tích, đoàn buôn, lữ khách, tâm ma, linh khí, cảnh đẹp, lôi vân), mỗi năm đi có 35-50% gặp một sự kiện. Bản lưu phiên bản 12.
- **M7 (2026-10-15): xong.** **Nghịch Thiên Cải Mệnh** (`js/systems/fate.js`): khi sắp chết (hết sinh lực, bị giết, thiên kiếp, hết thọ nguyên) người chơi được hỏi (tầng 3) có trả giá để sống tiếp không; tối đa 3 lần mỗi đời; giá tăng dần: lần 1 tốn 3 Thiên cơ điểm, 3 nghiệp, đạo tâm -10, thọ nguyên tối đa -10%; lần 2 tốn 5 điểm, mất một tiên thiên tốt (hoặc 15% tư chất), 6 nghiệp, đạo tâm -15, thọ -15%; lần 3 tốn 8 điểm, mất 30% tư chất, 12 nghiệp, đạo tâm -20, thọ -25% và thiên phạt (đột phá khó hơn 10% mãi mãi). Sống lại với 35% sinh lực (hết thọ nguyên thì kéo dài 12 năm). Đầu thai không mang theo; kế thừa thì người thừa kế gánh một nửa thọ nguyên đã tổn và một nửa nghiệp. **Thiên kiếp**: đột phá thành công lên Kim Đan trở lên phải qua 3 đợt (4 đợt khi phi thăng) rồi mới lên cảnh giới; mỗi đợt người chơi chọn cứng chịu, Hộ Thân Phù (-40%), uống Hồi Xuân Đan, hoặc nhờ hộ pháp gánh (-25%); gục thì chết hoặc cải mệnh (khi đó coi như đột phá thất bại). NPC tự xử lý (khoảng 15% chết ở Kim Đan). **Nhịp thời gian**: tốc độ tự nhanh dần theo cảnh giới (x1, x1, x1,5, x2, x3, x5, x5 từ Phàm nhân đến Phi Thăng, nhân với tốc độ người chơi chọn), sự kiện mỗi năm thưa đi khi thời gian nhanh để số hộp hỏi mỗi phút thật không vọt lên, nút "Tua" chạy nhanh tới sự kiện kế tiếp (tối đa 15 năm). Một đời Phi Thăng điển hình (650 năm game) mất khoảng 23 phút ở x1, ngắn hơn khi dùng x2, x4 và Tua. **Cân bằng đời người chơi** (mô phỏng hàng loạt, `tools/calib.js` và bài kiểm thử): người chơi Tự động chuyên tu luyện, tư chất ngẫu nhiên, 40 đời: đạt Luyện Khí 68%, Trúc Cơ 35%, Kim Đan 20%, Nguyên Anh 10%, Hóa Thần 10%, Phi Thăng 3%. Để đạt được, thêm hệ số riêng người chơi `D.PLAYER_RATE` 0,42 (người chơi có công pháp, tông môn, song tu, đan dược mà NPC không có), trần xác suất đột phá từ Trúc Cơ là 46%, tử vong khi đột phá thất bại cao hơn (24% ở Trúc Cơ tăng dần, Hộ Mạch Đan giảm còn 35%), đổi lại Thiên cơ điểm đắt hơn (3 + 2 x cảnh giới), tu vi cần cho Kim Đan trở đi là 6000/14000/36000 nhưng hệ số tu luyện các bậc đó tăng (6/8/14). Chế độ Tự động có trợ lý lo đồ (trang bị, học công pháp và tâm pháp, mua đan và sách). **Báo cáo cuối năm** (`js/systems/report.js`): thẻ trong cột giữa nêu kết quả, nguyên nhân (nhờ đâu tu vi tăng), việc đáng chú ý và cảnh báo (hạn mục tiêu, kẻ thù, bí cảnh sắp mở, thọ nguyên, bình cảnh, sinh lực). **Giao diện di động**: bố cục một cột, hộp quyết định lên đầu, nút lớn, thanh tab cuộn ngang, thanh trên gọn (nút tệp thu vào "Tệp"), kiểm ở 375px không tràn ngang. Bản lưu phiên bản 13.
- Ghi chú đo cân bằng: bài "20 thế giới x 100 năm" nhiễu mạnh vì thành phần vùng (vùng Đông Hải, Nam Lâm, Tây Thiên Sơn tăng nhanh hơn Hỏa Diệm Sơn, Hoang Mạc hai ba lần). Mốc đối chiếu ổn định hơn là bài phân tầng: NPC lõi sống tới 70 tuổi đạt Trúc Cơ+ khoảng 2% (thấp), 5% (khá), 18% (cao); bật hay tắt sự kiện cho NPC không làm lệch.
- **Bản đồ hai tầng đã làm (2026-10-15):** 9 vùng x 10 địa điểm, đường đi trong vùng, môi trường và thời tiết theo vùng, nơi sinh ngẫu nhiên theo tỉ lệ sinh và bối cảnh từng vùng, NPC lõi và NPC phụ chỉ dựng cho vùng người chơi ở, du hành giả và khách lạ, vượt vùng (tự thân, truyền tống trận, thương đoàn), giao diện bản đồ vùng và đại địa đồ (vùng chưa biết hiện ???). 17 bài kiểm thử đạt (`tests.html`). Chi tiết trong `MAP-THIET-KE.md` mục 9. Bản lưu cũ không dùng được (phiên bản dữ liệu 6).


## 14. Mặc định tự chọn trong M1-M7 (cần bạn duyệt)

Các điểm còn mở được chọn mặc định hợp lý để làm liền mạch. Tất cả chỉnh được bằng số liệu trong `js/data/`.

| Chủ đề | Mặc định đã chọn | Nơi chỉnh |
|---|---|---|
| Ba tầng quyết định | Tầng 2 đếm ngược 12 giây (15 giây cho hộp mục tiêu), quá giờ máy chọn theo quy tắc nếu-thì rồi hướng đi, tính cách. Mức tự động: Thủ công (tầng 2 thành tầng 3), Cân bằng, Tự động (tầng 2 tự chọn, chỉ dừng ở tầng 3 như tỏ tình, kẻ thù, vào tông môn, chết; riêng đột phá tự chuẩn bị). | `decisions.js` |
| Tần suất sự kiện | Khoảng 5-6 hộp hỏi mỗi phút ở x1 khi đo (mục tiêu ban đầu 2-4 nhưng đã tính cả mục tiêu, tin đồn, quan hệ); sự kiện thưa đi khi thời gian chạy nhanh. | `events.js` hàm `rate`, mục tiêu trong `rumors.js` |
| Số tông môn và chức vị | 9 tông môn (theo các địa điểm đã có), 5 chức vị: ngoại môn, nội môn (cảnh giới 1, 120 cống hiến), chân truyền (cảnh giới 2, 700), trưởng lão (cảnh giới 3, 2500, tối đa 3 ghế), chưởng môn (qua kế vị). | `sects.js` mục `SECT_RULES` |
| Đại trận tông môn | Trưởng lão trở lên, 1500 cống hiến và 300 vàng, tức thì, thành công 92%. | `SECT_RULES.portal` |
| Chính/tà | Nhiệm vụ tông chính đạo +0,15 chính khí mỗi tháng, tà đạo -0,25; chính khí dưới -50 bị tông chính đạo trục xuất, trên +50 bị tà đạo đuổi. | `sect.js` |
| Tình cảm và gia đình | Cùng giới được phép nhưng hiếm (hệ số 0,2), chỉ khác giới mới có con; người chơi nhiều đạo lữ, NPC một; tối đa 4 con, 5 đồ đệ. | `family.js` |
| Con cái | 75% tư chất bốc ngẫu nhiên, 25% từ bố mẹ. | `family.js` `mixTuChat` |
| Đầu thai | Bốc tư chất hai lần lấy lần tốt hơn (cao hơn trung bình khoảng 20 điểm), không mang gì. | `world.js` `reincarnate` |
| Kế thừa | Mang 60% vàng, 50% Thiên cơ điểm, 30% đạo điểm, nửa nghiệp, nửa danh vọng, nửa thọ nguyên đã tổn vì Nghịch Thiên, toàn bộ túi đồ và trang bị, kẻ thù, nợ ân tình; công pháp từ tầng 3 thành bí kíp. | `world.js` `inherit` |
| Thiên cơ điểm | Nhận khi đột phá (bằng cảnh giới mới), mỗi 12 tuổi, thông quan hiểm địa, hoàn thành mục tiêu. Dùng +10% đột phá, đổi lại đột phá thất bại, +20% truyền tống trận, Nghịch Thiên. | `stats.js`, `fate.js` |
| Nghịch Thiên | Tối đa 3 lần mỗi đời, giá tăng dần (xem M7 ở trên). | `fate.js` `D.NT` |
| Công pháp, tâm pháp, nghề | Xem M5; NPC không dùng (giữ nhịp thế giới). | `techs.js`, `items.js` |
| Độ khó người chơi | `PLAYER_RATE` 0,42 và trần đột phá 46% (xem M7). Đây là điểm bạn nên duyệt kỹ nhất vì quyết định cảm giác của game. | `realms.js`, `stats.js` |
| Tốc độ thời gian theo cảnh giới | x1, x1, x1,5, x2, x3, x5, x5 và nhân với tốc độ chọn; trẻ nhỏ x6; vượt vùng x10. | `realms.js` `REALM_SPEED` |

## 15. Chưa kiểm chứng và việc nên làm tiếp

- Chưa có người thật chơi liên tục; mọi số liệu cân bằng đều từ mô phỏng. Nên chơi thử vài đời ở cả ba mức tự động để chỉnh nhịp (đặc biệt số hộp hỏi mỗi phút và độ khó Trúc Cơ).
- Giao diện đã kiểm trên trình duyệt trong app (máy tính và màn hình 375px), chưa thử trên điện thoại thật.
- Chưa có git trên máy: dùng `tools/snapshot.ps1` để nén bản sao theo mốc vào thư mục `game-tu-tien-snapshots` cạnh dự án.
- M8 (pháp khí có khí linh, yêu thú đồng hành, phong thủy, trận pháp, chiến tranh tông môn) chưa làm.


## 16. Hệ thống linh thạch (đợt điều chỉnh sau M7)

Yêu cầu: linh thạch là tiền tệ chính, giao dịch được và hấp thụ được để tu hành (bằng 50% đan dược cùng giá, cùng thời gian), có bậc, bậc cao khó kiếm, quy đổi dễ, chưa làm thương hội.

- **Bậc:** hạ, trung, thượng, cực phẩm, mỗi bậc gấp 100 bậc dưới. Hạ phẩm cất ở `c.ls` (số lẻ, 2 chữ số), bậc cao là vật phẩm trong túi (`ls_trung`, `ls_thuong`, `ls_cuc`). Vàng (`c.gold`) giữ làm tiền lẻ phàm gian: 10 vàng = 1 hạ phẩm. Mọi giá cả cũ vẫn tính bằng đơn vị vàng nên NPC và cân bằng NPC không đổi.
- **Trả tiền:** `TT.ls.pay` dùng vàng lẻ trước, rồi hạ phẩm, rồi đập bậc cao và thối lại hạ phẩm, không hao tổn. Mọi chỗ kiểm tra "đủ tiền" dùng `TT.ls.wealth` (tổng tài sản). Chợ, đột phá (đan, động phủ), vượt vùng, sự kiện mất của, mục tiêu "của cải" đều theo đó.
- **Quy đổi:** nút trong tab Hành trang: vàng ra hạ phẩm, hạ phẩm ra vàng, ghép 100 thành 1 bậc trên, tách 1 thành 100 bậc dưới.
- **Hấp thụ:** 1 hạ phẩm cho khoảng 0,214% nhu cầu cảnh giới (bằng 50% Tụ Khí Đan trên cùng giá trị). Mỗi cảnh giới có bậc tối thiểu để hấp thụ trọn (Luyện Khí, Trúc Cơ: hạ; Kim Đan, Nguyên Anh: trung; Hóa Thần trở lên: thượng), thiếu một bậc thì còn 35% hiệu quả. Có hai đường: (1) tự động mỗi tháng khi tu luyện, chỉ hạ phẩm, phần dư ngoài mức giữ lại (quy tắc "Giữ lại N hạ phẩm", mặc định 10), tối đa bằng 50% tu vi tháng đó; (2) bằng tay trong Hành trang cho mọi bậc, tối đa 25% nhu cầu cảnh giới mỗi lần, nghỉ 3 tháng, viên nào vượt sức chịu của cảnh giới thì bị từ chối.
- **Nguồn thu (người chơi):** kiếm sống của tu sĩ từ Luyện Khí trở lên, nhiệm vụ tông môn, bổng lộc hằng năm, hầm mộ (tiền thu được và thưởng thông quan), kỳ ngộ tìm túi trữ vật. Trung phẩm chỉ rơi ở hầm mộ từ Nguyên Anh (25%, hung địa 40%), thượng phẩm từ Hóa Thần (3%). Dưới Nguyên Anh chưa có đường kiếm bậc cao ổn định (kỳ ngộ nhỏ để dành đợt sau).
- **Giá trị so với trước:** đổi nguồn thu sang linh thạch giữ nguyên giá trị quy ra vàng; không đổi giá chợ. Thưởng thông quan hầm mộ là thu nhập mới. Mô phỏng 100 đời tự động (hướng tu luyện, không NPC): mở hay tắt hấp thụ cho kết quả gần như nhau (Phi Thăng 13% cả hai) vì bot không tích trữ nhiều linh thạch.
- **Kế thừa:** mang 60% linh thạch (kể cả bậc cao), như vàng.
- **Còn mở:** kỳ ngộ cho trung phẩm ở cảnh giới thấp, mỏ linh thạch, đấu giá (cố ý không làm hệ thống thương hội).


## 17. Độ khó hầm mộ, yêu thú, kẻ thù và cái giá thất bại (sau mục 16)

Yêu cầu: bí cảnh, yêu thú, kẻ địch mạnh và nhiều thử thách hơn; tỉ lệ lớn người chơi sẽ thua và mất thứ gì đó để mỗi lựa chọn có sức nặng.

- **Cái giá thất bại (`js/systems/loss.js`, chỉ người chơi):** thương tích kéo dài (`c.wound`: nhẹ 8 tháng, trọng thương 18, căn cơ tổn hại 36; giảm sinh lực tối đa 10/20/30%, tu luyện chậm 15/30/45%, đột phá khó thêm 2/5/8%), nghỉ ngơi lành nhanh gấp đôi; mất đan, bùa, một nửa chồng nguyên liệu; tụt phần trăm tu vi; pháp khí đang mặc có thể vỡ. Bí kíp, tâm đắc và linh thạch không bị mất.
- **Hầm mộ:** quái vượt cảnh giới người chơi một bậc theo xác suất (không làm tròn): thường 5-15%, thủ lĩnh 40-60%, thêm quái đầu đàn (khoảng 18% mỗi chặng, mạnh hơn 12%). Cấm chế khó hơn 30%, cạm bẫy đau hơn 40%. **Rút lui từ chặng 2 trở đi có thể bị chặn đường** (11% mỗi chặng đã đi qua); đánh thua thì thành bại trận. Chạy thoát vẫn rơi mất 30% thu hoạch. Bại trận: mất nửa thu hoạch + 12% tu vi + 1-2 món đồ + 30% vỡ pháp khí + thương tích nhẹ hoặc trọng thương. Gục giữa trận: Thoát Thân Phù tự cứu mạng (nhưng căn cơ tổn hại nặng), không có thì còn xác suất sống nhỏ.
- **Yêu thú hoang:** mạnh hơn 20%, 15% (cộng theo mức nguy hiểm và "khó") là con vượt một bậc. Thua thì có thể bị thương tích hoặc mất đồ.
- **Kẻ thù tìm đến:** đánh nhau họ ra đòn mạnh hơn 15% (đã chuẩn bị), chạy khó hơn, thua thì dễ bị giết hơn (62% nếu họ không yếu hơn bạn quá một bậc), còn sống thì mất nửa tài sản, tu vi, đồ đạc, pháp khí và trọng thương.
- **Đo bằng `tools/dgsim.js`** (người chơi do máy chọn mặc định, cảnh giới 2, có kiếm tinh cương, áo da, công pháp, 2 bùa, 3 đan hồi sinh): bí cảnh thông quan 14%, rút 25%, chạy 18%, bại 25%, chết 19%; hung địa thông quan 13%, rút 49%, chạy 9%, bại 21%, chết 9%; tàn tích thông quan 18%, chết 0%. Tay không (không pháp khí, không công pháp) thông quan 0%. Người chơi "tính toán" (công khi khỏe, thủ khi yếu, rút khi dưới nửa máu) thông quan 16-44% nhưng chết 45-49% ở bí cảnh và hung địa vì thủ lĩnh đánh tới cùng.
- Các số chỉnh nằm ở `D.DG` (`js/data/monsters.js`) và `D.WOUND` (`js/systems/loss.js`).


## 18. Thế giới tự vận động (thế lực, chiến tranh, thời đại)

Làm theo [KICH-BAN-THE-GIOI.md](KICH-BAN-THE-GIOI.md) (mục 11 liệt kê đã làm và chưa làm). Quyết định của bạn: tông của người chơi có thể bị diệt thật; nhịp thế giới ngẫu nhiên theo hạt giống; chưa làm chưởng môn hoặc lập tông.

- **Mô phỏng:** cấp năm trên `world.fac` (`js/systems/factions.js`), gọi từ `stepWorld` mỗi 12 tháng. 400 năm chạy mất dưới 1 giây. Cùng hạt giống cho cùng lịch sử; lưu/tải giữ nguyên.
- **Số đo (10 thế giới, mỗi thế giới 300 năm):** trung bình 52 cuộc chiến (từ 9 tới 75 tùy nhịp và thời đại), khoảng 10 lần diệt vong (từ 1 tới 18, gồm cả gia tộc), vương triều đổi chủ từ 0 tới 16 lần.
- **Tác động tới cân bằng:** thời đại đổi tốc độ tu luyện ±8-10% cho mọi người (trung bình dài hạn gần 0); chiến tuyến thêm 1,2% tử trận mỗi năm cho NPC trong vùng đang mô phỏng. Phép đo NPC theo tư chất trong tests.html vẫn đạt.
- **Có thể chỉnh** ở `D.FAC` và `D.ERAS` (`js/systems/factions.js`).
- Lưu ý mức "Tự động": hộp triệu tập và chiến loạn là tầng 2 nên máy tự chọn mặc định (hậu phương, lánh đi, hoặc ra trận khi khỏe); chọn "Thủ công" để tự quyết.


## 19. Cảnh pixel art (giao diện, đợt 1)

`js/ui/scene.js`: cảnh canvas 240x72 ở đầu cột giữa (phóng lên bằng CSS, `image-rendering: pixelated`). Phản ánh nơi ở (làng, thành trì, tông môn, bến, chợ, mỏ, linh mạch, cửa ải, tàn tích, bí cảnh, hầm mộ, trên đường, hư không), vùng (9 địa hình), thời tiết (mưa, tuyết, bão cát, cực quang, đom đóm, núi lửa, sấm sét), chiến loạn, giờ trong ngày (đổi theo năm: đêm, hoàng hôn, ban ngày), gia đình và đồ đệ đứng cạnh (tối đa 5 người), cảnh giới (màu áo, hào quang), thương tích, đột phá, Phi Thăng. Nhân vật, nhà, núi, bầu trời tự vẽ bằng code; cây, xương rồng, đèn, biển báo từ gói Kenney (CC0, xem CREDITS.md). Xem mọi cảnh cùng lúc ở `scenetest.html`. Chưa làm: thanh trạng thái (phương án C), bảng màu mới, bản đồ cuộc đời, bản đồ cuộc đời.

**Bổ sung đợt 1b (yêu thú và bí cảnh):** `js/ui/sprites.js` vẽ 16 loại yêu thú, thủ vệ, thủ lĩnh bằng bản đồ ký tự (màu theo thuộc tính, quay mặt sang trái, to gấp đôi cho thủ lĩnh). Cảnh hiển thị đúng con yêu thú sắp đánh (id lưu trong `ctx.m` của hộp quyết định `yeu_thu`, `cx_yeu_thu`, hoặc lấy từ chặng hầm mộ `dg_fight`, `dg_boss`) và kẻ thù tìm đến (`rel_ke_thu`) thành người mặc áo đỏ sẫm. Ba loại hiểm địa có nội thất riêng: bí cảnh (tinh thể xanh tím, đốm sáng), tàn tích (đại sảnh gạch, cột đổ, đuốc), hung địa (xương, gai đá, mắt đỏ trong bóng tối); chặng cấm chế, kho báu, chỗ nghỉ và thủ lĩnh có vật thể riêng. Xem toàn bộ ở `scenetest.html` (cảnh) và `spritetest.html` (từng con yêu thú).


## 20. Trang bị và luyện khí (kế hoạch đã duyệt)

Quyết định: đơn giản, 4 ô (vũ khí, mũ, giáp, pháp bảo bản mệnh); chưa làm độ bền, cường hóa, khảm. Mỗi món cộng vào **chỉ số riêng** của nó nên không cộng chồng: vũ khí là công kích, giáp là sinh lực tối đa, mũ là niệm lực; pháp bảo bản mệnh cộng vào một chỉ số theo loại. Trần mỗi món 30% sức mạnh gốc (gồm cảnh giới, tu luyện, không gồm đồ), pháp bảo bản mệnh thêm tối đa 15% khi lớn lên (chỉ số đó tối đa 45%).

- **Phẩm chất:** phàm 6-10%, linh 13-18%, bảo 20-25%, tiên 26-30% (ngẫu nhiên trong khoảng, chỉ tiên may mắn mới chạm 30%). Cảnh giới tối thiểu: phàm 0, linh 1, bảo 3, tiên 4.
- **Mã vật phẩm mang thông số** (`g|ô|phẩm|q|hệ`, `r|chỉ số|phẩm|q|hệ|cấp`, `m|bộ phận|hệ|phẩm`) nên tồn kho, bán, kế thừa chạy bằng cơ chế sẵn có; `D.ITEMS` là Proxy tự dựng định nghĩa từ mã. Id cũ (kiếm sắt, kiếm tinh cương...) là mẫu với q trung bình.
- **Pháp bảo bản mệnh:** nhận từ kỳ ngộ, luyện khí cấp 8 trở lên, hoặc mua bản yếu ở chợ đen; lớn 10 cấp (mỗi cấp +1,5%, bị cảnh giới giới hạn), cùng hệ thì thêm 3% khắc chế; là món duy nhất đi qua đầu thai (cấp giảm một nửa); không bị vỡ khi thua.
- **Chợ:** bán phàm và linh; bảo và tiên chỉ từ luyện khí, kỳ ngộ, hầm mộ, đấu giá hiếm.
- **Luyện khí mới:** bản vẽ (ô, phẩm), khoáng thạch bốn bậc (quang thạch, tinh thiết, huyền thiết, thiên thạch), vật liệu từ yêu thú (nanh cho vũ khí, da cho giáp và mũ, mang thuộc tính của quái), yêu đan, linh thạch làm nhiên liệu, lò luyện bốn bậc, địa hỏa; mất 1 / 3 / 6 / 12 tháng theo phẩm, xen kẽ với tu luyện; cấp nghề tối thiểu 0 / 3 / 6 / 9. Thất bại làm hao nguyên liệu, nặng thì nổ lò (mất máu, có thể bị thương).
- **Hình nhân vật** trong cảnh pixel mặc đúng vũ khí, mũ, giáp; pháp bảo lơ lửng cạnh người.
- **Cân bằng:** hạ độ khó hầm mộ, kẻ thù nếu cần (đo bằng `tools/dgsim.js`).

**Đã làm theo kế hoạch trên:** `js/data/gear.js` (mã trang bị có thông số, Proxy `D.ITEMS`, 11 mẫu), `js/systems/items.js` (thưởng theo phần trăm, pháp bảo lớn lên, vật liệu rơi), `js/systems/craft.js` (bản vẽ, vật liệu, lò, nhiên liệu, thành bại, tự chọn bản vẽ), tab Hành trang (4 ô, phần Lò luyện khí), cảnh pixel (nhân vật mặc đúng đồ, pháp bảo lơ lửng), kỳ ngộ "pháp bảo", pháp bảo đi qua đầu thai. Bỏ ô bùa cũ (đồ ở ô đó tự về túi khi tự trang bị). Chưa làm: độ bền, cường hóa, khảm.

**Cân bằng sau khi đổi:** thưởng trang bị giữa phẩm (phẩm linh khoảng 15% công kích) yếu hơn số cứng cũ (kiếm tinh cương +12 là khoảng 39% ở cảnh giới 2), nên giảm độ khó hầm mộ: `D.DG.mob` 0,98 xuống 0,86, `boss` 1,06 xuống 0,93, `wild` 1,2 xuống 1,12. Đo bằng `tools/dgsim.js` (cảnh giới 2, kiếm tinh cương, áo da): bí cảnh thông quan 8%, thua 61%; tàn tích thông quan 13%; hung địa thông quan 7%.

## 21. Hộp quyết định dạng cửa sổ nổi (giao diện)

Mọi sự kiện và quyết định (`#decision`, `js/ui/panels.js` hàm `renderDecision`) hiện thành cửa sổ nổi giữa màn hình, nền mờ phía sau: đầu cửa sổ có nhãn loại việc (Giữa dòng đời, Thám hiểm, Thiên kiếp, Ân oán, Thế cuộc, Đột phá...), tuổi và năm, chọn nhanh mức tự động; cảnh pixel thu nhỏ (yêu thú, kẻ thù, nơi đang đứng); tiêu đề chữ có chân; nội dung; khung hoàn cảnh (sinh lực, tu vi, linh thạch, thương tích); lựa chọn đánh số kèm gợi ý theo loại (rủi ro, an toàn, chiến đấu...), lựa chọn mặc định viền hồng khi có đếm ngược; thanh đếm ngược hồng; nút "Tắt tự động quyết định" và "Hiện thành khung thường" (nhớ trong localStorage `tt8b_popup`). Phím 1-9 chọn nhanh. Màn hình nhỏ thì thành tấm trượt từ đáy. Chưa làm: ô viết ghi chú như mẫu tham khảo, nút "Tạm gác lại".

**Nhật ký dạng dòng (giao diện):** mỗi mục là một dòng có cột tuổi (chữ đơn cách, ví dụ "13 tuổi"), nội dung (việc lớn in đậm trắng, việc xấu đỏ cam, việc tốt xanh lá, việc vặt mờ có dấu ▸ hồng), kẻ ngăn mảnh, và dòng "Chi tiết" nhỏ (nhãn xanh ngọc) bên dưới cho số liệu. `TT.log(c, text, cls, note)` nhận thêm ghi chú. Đã gắn chi tiết cho: trận đánh (đối thủ, sức mạnh hai bên, số hiệp, thương tổn), đột phá (xác suất và các phần chính), luyện khí (xác suất, chất lượng), hấp thụ linh thạch, đổi thời đại, chiến loạn lan tới vùng của bạn.

## 22. Giao diện mới đã áp vào game (bố cục, màu, khung nổi, bản đồ cuộc đời)

- **Bố cục:** đầu trang có tên, tuổi lớn, năm, cảnh giới, tình trạng, thanh tiến độ năm (hồng), hàng nút điều khiển và hàng tab nằm ngang. Cột trái: màn hình nhân vật (cảnh pixel, dính khi cuộn) rồi nội dung tab (hồ sơ, hành trang...). Cột giữa: báo cáo năm, nhật ký, Thiên hạ. Cột phải: bản đồ cuộc đời, bản đồ vùng, người ở đây. Điện thoại: màn hình nhân vật lên đầu, rồi báo cáo và nhật ký, rồi tab nội dung, rồi bản đồ.
- **Khung nổi (`js/ui/dock.js`):** màn hình nhân vật tách ra, kéo, đổi ba cỡ, gắn lại; thẻ trạng thái (sinh lực, tu vi, đạo tâm, linh thạch, trọng thương khi có; không có cơ duyên) kéo được, thu gọn, gắn vào cột trái. Nhớ trong localStorage `tt8b_ui`. Điện thoại: không tách màn hình, thẻ trạng thái mặc định thu gọn.
- **Bản đồ cuộc đời (`js/ui/lifemap.js`):** ô theo năm (1 ô = 1, 2, 5, 10 hoặc 20 năm để tối đa khoảng 100 ô); màu theo điểm năm (`c.life.y`, tính trong `TT.report.close` từ tiến độ tu vi, việc tốt xấu, sức khỏe, thương tích); viền hồng hiện tại, viền trắng thọ nguyên, viền nét đứt thọ nguyên nếu lên cảnh giới kế; chấm vàng là mốc (`TT.report.mark`: đột phá, vào tông, kết đạo lữ, thương nặng, tông bị diệt, thông quan hầm mộ). Bản lưu cũ chưa có dữ liệu năm thì các ô cũ để trống.
- **Màu:** nền xanh than, hồng đậm làm điểm nhấn, tiêu đề chữ có chân, nhãn chữ đơn cách; toàn bộ biến màu ở `:root` trong `css/style.css`.
- Chưa làm: ô viết ghi chú trong hộp quyết định, dải các kiếp trước trên bản đồ cuộc đời.


## 23. Kế hoạch gộp: nhiệm vụ, nghề nghiệp, ngã rẽ cuộc đời, kỳ ngộ (chờ duyệt, chưa code)


Chi tiết từng bước nằm trong thư mục `ke-hoach/` (xem `ke-hoach/README.md`): A nhiệm vụ, B nghề nghiệp, C ngã rẽ, D kỳ ngộ. Mỗi bước có file riêng với thiết kế, chặng làm và nhật ký. Mục này chỉ giữ tóm tắt.

Tóm tắt: A hệ nhiệm vụ 3 tầng, thưởng phạt theo người giao, bảng ưu tiên kéo thả, cấp bách tự lên đầu, cửa sổ xem xét định kỳ; B nghề nghiệp; C ngã rẽ thay ô Hướng đi (bỏ Cân bằng); D kỳ ngộ có cốt truyện. Số đo nền và công thức độ khó xem `ke-hoach/A-nhiem-vu.md`.

## Quy ước làm việc (từ 2026-10-16)
Mỗi tính năng mới hoặc sửa lớn: tạo file kế hoạch riêng trong `ke-hoach/` (mẫu `_mau.md`), cập nhật chặng và nhật ký khi làm; `KE-HOACH.md` chỉ ghi tóm tắt kết quả như nhật ký tổng.


## 24. Hệ nhiệm vụ (bước A, xong 2026-10-16)

Thay hệ mục tiêu bằng nhiệm vụ ba tầng (ngắn 2-4, trung 6-10, dài 15-30 năm), bốn bậc độ khó theo tốc độ thật của nhân vật, thưởng phạt theo người giao (bản thân, người quen, tông môn, thế lực, Thiên Đạo), bảng ưu tiên kéo thả với cấp bách tự lên đầu, cửa sổ xem xét định kỳ và nhiệm vụ ngược đạo có xác suất. Chi tiết, số đo và việc còn lại: `ke-hoach/A-nhiem-vu.md`. Kiểm thử: 80 bài đạt. Công cụ đo: `sim.html` và `tools/quest-sim.js` (`qsim`, `rateCheck`). Bước kế: B nghề nghiệp, C ngã rẽ, D kỳ ngộ.


## 25. Ngã rẽ cuộc đời và nghề nghiệp (bước B và C, 2026-10-16)

Ô "Hướng đi" được thay bằng năm con đường (Khổ tu, Kiếm sống, Phiêu lưu, Giao du, Luyện nghề), chọn ở các ngã rẽ (tuổi 12, đột phá, vào tông, có đạo lữ, thương nặng, thông quan bí cảnh, hoặc 25 năm không đổi); bỏ "Cân bằng"; bỏ đạo giữa chừng tốn đạo tâm và thành thạo. Thêm hệ nghề nghiệp 9 nghề (4 lõi, 5 mới), nghề chính/phụ, đơn hàng làm nguồn nhiệm vụ. Chi tiết: `ke-hoach/C-nga-re.md`, `ke-hoach/B-nghe-nghiep.md`. Bước kế: D kỳ ngộ có cốt truyện.


## 26. Kế hoạch kinh tế (chờ duyệt, chưa code)

Lập kế hoạch chi tiết hệ kinh tế: giá theo cung cầu và đặc sản vùng, thành có quy mô và dịch vụ, shop tông môn theo sở trưởng, buôn đường dài, nhà đấu giá, vay mượn, thương hội (tùy chọn). Bản 4: thương hội là thế lực thứ tư (trung gian tông, vương triều, tán tu; tự cung tối đa 12%; hộ vệ nhỏ; có ảnh hưởng chính trị nhưng không có quân đội; đại diện giai cấp tư bản). Nền là bản 3 (gom thành một mạch nguồn - đường - đích: tông môn nắm thế độc quyền hàng thiết yếu, chợ tán tu là phần dư, cú sốc cung cầu lấy từ thế cuộc, nghề Thương nhân mở sơ đồ giá theo cấp): `ke-hoach/E-kinh-te.md`, bản mẫu giao diện `uimock-kinhte.html`.


## 27. Hoàn thiện thế giới trước kinh tế (đang xem sơ đồ)

Bạn yêu cầu vẽ sơ đồ năng lực và quan hệ của thế giới trước khi làm tiền tệ. Đã dựng `so-do-the-gioi.html` (đọc số liệu thật từ game) và ghi các chỗ trống trong `ke-hoach/F-hoan-thien-the-gioi.md`. Kinh tế (mục 26, `E-kinh-te.md`) tạm hoãn tới khi chốt thế giới.


## 28. Nhật báo tu tiên (chờ duyệt, chưa code)

Cơ chế mới đưa thông tin thiên hạ, bản 2: ba tòa báo (do thương hội, tông chính đạo, giới ngầm ra), mỗi bốn năm một số tổng san dày (50-65 tin, bảng, biểu đồ, dự báo), người bán báo ghé mỗi bốn năm mời gia hạn (phí tháng, chỉ khi đủ linh thạch trụ 30 năm), bỏ khung Thiên hạ và thêm tab Nhật báo đọc lại số đã mua; tin có nguồn, độ tin cậy, thiên kiến, độ trễ theo khoảng cách, mức liên quan đến người chơi; tab Nhật báo đọc tùy ý, tác dụng cố ý nhỏ (tin sớm, gợi ý, nguồn nhiệm vụ đề nghị). Chi tiết: `ke-hoach/G-nhat-bao.md`, bản mẫu `uimock-nhatbao.html`.


## 29. Hoàn thiện thế giới, bước F1: thương hội (xong 2026-10-16)

Thêm thế lực thứ tư `hoi` vào `world.fac`: 3 thương hội lớn, có vốn, uy tín, hộ vệ tối đa 30, ảnh hưởng chính trị, xu hướng; không có quân đội, không tham chiến, tự sản xuất tối đa 12%; mô phỏng cấp năm với mở/đóng chi nhánh, đầu cơ, cướp, tịch thu, cắt hàng sỉ, môi giới hòa nghị, phá sản và gây dựng lại. Bản lưu cũ tự sinh hội. Giao diện: mục Thương hội trong Biên niên sử, sơ đồ `so-do-the-gioi.html` hiện hội thật. Tiếp theo F2 (nghĩa vụ giữa các thế lực). Chi tiết: `ke-hoach/F-hoan-thien-the-gioi.md` mục 7. Quyết định cùng đợt: Nhật báo chỉ một tờ; bảng tin chợ miễn phí lưu ở `ke-hoach/H-phat-trien-thanh-tri.md`. Kiểm thử: 85 bài đạt.


## 30. Công trình trong nơi chốn, cửa hàng, biểu tượng vật phẩm (chờ duyệt, chưa code)

Đến một nơi, màn hình pixel của nhân vật hiện phố công trình (chợ, đan các, khí phô, phù trai, thư các, thương hội, võ đài, y quán, quan phủ, ...), bấm vào để vào; cửa hàng mở thành cửa sổ riêng có lưới biểu tượng, tab Mua/Bán, hạn mức; Hành trang không còn mua bán; chỉ nơi có cửa hàng mới mua bán được, mỗi cửa hàng chỉ thu nhóm hàng của mình; biểu tượng vật phẩm sinh bằng mã. Chi tiết: `ke-hoach/I-cong-trinh.md`, bản mẫu `uimock-congtrinh.html`.


## 31. Asset: biểu tượng vật phẩm và hình công trình (xong 2026-10-16)

Làm xong phần hình của kế hoạch công trình (mục 30): `js/ui/icons.js` (biểu tượng pixel cho 60 vật phẩm gốc, trang bị mã hóa, pháp bảo, nguyên liệu yêu thú), `js/ui/bldart.js` (22 công trình, mỗi nhà có biển hiệu trên mái nói rõ nó bán gì, có chuyển động nhẹ), trang xem `asset-xem.html`, biểu tượng đã gắn vào tab Hành trang. Kiểm thử 86 bài đạt. Hàng rong được duyệt (làm ở I3). Bước kế: I2 (phố công trình trong màn hình nhân vật), I3 (cửa hàng mới và giới hạn mua bán). Chi tiết: `ke-hoach/I-cong-trinh.md` mục 12.


## 32. Công trình trong màn hình nhân vật, cửa hàng, giới hạn mua bán (I2 và I3, xong 2026-10-16)

Đứng ở nơi có công trình thì màn hình nhân vật thành con phố (tối đa 6 nhà mỗi phố, nút chuyển phố), rê chuột và bấm vào nhà để vào: cửa hàng mở thành cửa sổ riêng (tab Mua/Bán, lưới biểu tượng, hạn mức tháng), dịch vụ thật (y quán, quán trọ, tửu lâu, quan phủ, sơn môn, cổng bí cảnh, cổng ải). Mua bán chỉ ở nơi có cửa hàng; mỗi cửa hàng chỉ bán và thu đúng nhóm hàng; kho có hạn, hồi theo tháng; hạn mức giao dịch theo quy mô nơi; hàng rong thỉnh thoảng ghé; Hành trang không còn mua bán. Kiểm thử 87 bài đạt, nhịp hỏi 5,33 lần/phút, cân bằng cũ giữ. Chi tiết: `ke-hoach/I-cong-trinh.md` mục 13. Bước kế: I4 (võ đài, kho, hầm mỏ, bến tàu, nhà đấu giá...), I5 (tích hợp tông, hội, tòa soạn), hoặc F2.

## 33. Bản đồ vùng có địa hình và phóng to (xong 2026-10-16)

Bản đồ vùng có nền địa hình vẽ theo thuật toán cho cả 9 vùng (đồng bằng có sông, biển đảo, núi tuyết, rừng, băng nguyên, núi lửa dung nham, sa mạc, đầm lầy, đảo giông bão), vết riêng theo loại địa điểm, tên địa danh mờ, biểu tượng địa điểm, đường cong. Phóng tới 600% bằng cuộn chuột, nút +/−, nhấp đúp hoặc chụm hai ngón; kéo để di chuyển; có nút về chỗ bạn, xem cả bản, toàn màn hình (Esc thoát, có khung thông tin và nút Đi tới). Đại địa đồ để nguyên. Chi tiết: `ke-hoach/J-ban-do-vung.md`.

## 34. Nhật ký mới và Hồ sơ nhân vật (xong 2026-10-16, chờ chơi thử)

Nhật ký của bạn giờ hiển thị mục mới nhất ở trên cùng. Kế hoạch đổi cách hiển thị (gom theo năm, ba mức quan trọng, phân loại có biểu tượng, bộ lọc, dòng Hôm nay, Sổ đời) nằm ở `ke-hoach/K-nhat-ky.md`, chờ bạn chọn phần làm. Đã có demo `uimock-nhatky.html`; theo ý bạn bỏ ô tìm, thêm đánh dấu ★ (mục ghim có ghi chú, nút lọc). Hồ sơ nhân vật gom vào kế hoạch riêng `ke-hoach/L-ho-so-nhan-vat.md` (chờ duyệt, nêu rõ phần nào đã có ở Trạng thái, tab Nhân vật, nhật ký để khỏi trùng). Cùng đợt: sửa lỗi bảng bên trái không cập nhật sau khi bấm Trang bị hay Đọc học (`js/ui/side.js`).

Đã code cả hai: nhật ký mới nhất ở trên, gom theo năm, ba mức quan trọng, biểu tượng theo loại, bộ lọc, gộp việc vặt, ⓘ chi tiết, ☆ đánh dấu, Sổ đời; tab Nhân vật đổi thành Hồ sơ gồm Tổng quan (thẻ có ảnh pixel, danh vọng, đang theo, người thân cận, kỷ lục), Chỉ số, Thành tựu, Đánh dấu, Kiếp trước. Chi tiết: ke-hoach/K-nhat-ky.md, ke-hoach/L-ho-so-nhan-vat.md. Demo cũ giữ ở uimock-nhatky.html, uimock-hoso.html.

## 35. Thiết kế lại Tông môn (M1 đến M3 đã code, 2026-10-17)

Tông môn được nâng thành trụ cột của thế giới. Kế hoạch ở ke-hoach/M-tong-mon.md: hiện trạng và 8 chỗ trống, rồi đề xuất bản sắc và đạo thống, bốn đường nội bộ, nhiệm vụ tông thật sự, vòng đời đệ tử (thi tuyển, sư phụ, đại bỉ), chính trị nội bộ, tài nguyên và liên tông, nhiều đường cho người chơi (khách khanh, lập tông, làm chưởng môn), tab và phố tông môn. Chờ bạn chốt thứ tự các chặng M1 đến M7 và 6 câu hỏi.

Đã làm M1 đến M3: tôn chỉ, luật tông (cảnh cáo, phạt, trục xuất), tuyệt học ở chân truyền; bốn đường (Chấp pháp, Dược và luyện, Tàng kinh, Ngoại vụ) chọn từ nội môn; bảng nhiệm vụ tông 12 loại việc làm thật sự (thay việc vặt tự chạy, vẫn có việc vặt khi rảnh), thử luyện nhập môn; sư phụ nội môn, danh sách đồng môn, đại bỉ năm năm một lần; tab Tông môn năm mục; chế độ Tự động tự nhận việc. Còn lại: M4 chính trị nội bộ, M5 tài nguyên và liên tông, M6 lập tông và làm chưởng môn, M7 phố tông môn. Chi tiết: ke-hoach/M-tong-mon.md.

Cập nhật cùng ngày: hoãn M4 (chính trị nội bộ) theo ý bạn, làm tài nguyên tông (M5a): linh mạch 1-3 sao, mỏ 0-3, kho tông (wealth của thế lực) trôi về mức theo mạch và mỏ, cống nạp vương triều, thắng trận chiếm mỏ hoặc cướp mạch, kho quyết định bổng lộc, giá kho cống hiến, việc nhận đệ tử; người chơi quyên góp đổi cống hiến.

## 36. Tài nguyên trên bản đồ (bản 1, 2026-10-17)

Năm loại tài nguyên: linh mạch, mỏ linh thạch, khoáng thạch, linh thảo, yêu thú. Mỗi địa điểm có mức 0-3 theo loại địa điểm và vùng, kho hao khi thu hoạch và hồi theo năm; nghề thợ mỏ, thợ săn, y sư và việc tìm vật liệu luyện khí, luyện đan phụ thuộc nơi đang đứng. Bản đồ vùng có lớp huy hiệu tài nguyên (bật tắt bằng nút ◈), thông tin địa điểm có khối tài nguyên và chủ. Chi tiết: ke-hoach/N-tai-nguyen-ban-do.md.

Bản 2 (cùng ngày): khu tài nguyên là vệ tinh của địa điểm, mỗi vùng 6 khu, nối bằng đường mòn vạch đứt trên bản đồ; đi tới khu mất 1 tháng, ở khu không có cửa hàng, nguy hiểm hơn, Kiếm sống lượm được nguyên liệu không cần nghề, nghề đúng loại thu thêm.

## 37. Gọn khu thông tin dưới bản đồ (2026-10-17)

Linh khí, nguy hiểm, phồn hoa thành hàng nhãn nhỏ (và hiện khi rê chuột lên địa điểm); môi trường và thời tiết thành dải ngay dưới bản đồ; Vượt vùng chuyển sang tab Tông môn và bị khóa tới khi đủ điều kiện một lối đi; địa điểm tông dùng biểu tượng cổng dịch chuyển; 11 ý tưởng cho khu dưới bản đồ ghi ở ke-hoach/O-khu-thong-tin-ban-do.md.

Cập nhật cùng ngày: cột phải chỉ còn tên nơi, nút đi tới và Người ở đây; thông tin nơi đang ở chuyển vào công trình đại diện (Sơn môn, Nhà trưởng thôn mới, Nha môn, Lều tộc trưởng, Cổng ải); tàn tích và hung địa có Cổng thám hiểm. Chi tiết ở ke-hoach/O-khu-thong-tin-ban-do.md mục 8.

## 38. M7: asset phố tông môn (2026-10-17, xem trước)

Vẽ 7 công trình mới cho tông môn (Chấp pháp đường, Dược đường, Tàng kinh các, Ngoại vụ đường, Điện chưởng môn, Trận đài truyền tống, Đài đại bỉ), xem ở asset-tongmon.html, chưa gắn vào game. Trả lời câu hỏi vai trò tab Tông môn: công trình làm việc, tab thành Thẻ đệ tử xem từ xa. Chi tiết ke-hoach/M-tong-mon.md mục 9.

## 39. M7 gắn phố tông môn vào game (2026-10-17)

Tông môn có chín công trình trong màn hình nhân vật, mỗi nhà có dịch vụ thật; nút hành động dời từ tab sang công trình, tab Tông môn thành Thẻ đệ tử (theo dõi từ xa). Chi tiết ke-hoach/M-tong-mon.md mục 10.
