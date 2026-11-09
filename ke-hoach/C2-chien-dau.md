# C2. Cơ chế chiến đấu mới ("Trận thế")

Tài liệu thiết kế, chưa có code. Phiên thiết kế bắt đầu 2026-11-09, nhánh `claude/thiet-ke-chien-dau`. Chủ game chốt, các phiên code sau đọc mục "Đã chốt" và "Bản thiết kế".

## Đã chốt

1. **Hướng A:** trận chia nhịp, người chơi chọn thế mỗi nhịp theo kiểu kéo búa bao nhưng có thể đọc được (có chiến thuật, không đoán mù). Nối sang cao trào truyện (`chong`) ở một phiên sau.
2. **Ba thế:** Công, Thủ, Tụ (tam giác). Không thêm thế thứ tư. Né là khả năng tiên thiên (khóa `ne`), không phải thế.
3. **Bản đầu gồm năm ý:** (1) quái báo ý đồ, (2) khí làm tài nguyên, (3) đà, (5) kết liễu, (6) sổ quái.
4. **Phạm vi dùng `duel()`:** thủ lĩnh, kẻ thù tìm đến (có tên), cao trào truyện. Quái thường và mọi trận của NPC vẫn dùng `combat.run()` cũ để không đổi baseline.
5. **Cái chết:** không tăng độ chết. Người chơi đọc giỏi thì ít chết hơn.
6. **Công pháp là bộ chiêu thức, không chỉ buff.** Có 3 loại: **Công, Thủ, Tụ**. Mỗi hệ ngũ hành có "chất" chiêu riêng (ví dụ Mộc: độc, Hỏa: thiêu đốt, Kim: sốc nhưng bị phản phệ, Thủy: nhiều đòn nhỏ, Thổ: rải cạm bẫy tạo môi trường). Các ví dụ là gợi ý, được đổi cho hợp.
7. **Tâm pháp chính là đạo của người chơi, tự hoàn thiện bằng các lựa chọn đạo:** không phải bỏ đạo này chọn đạo khác. Khổ tu chọn đầu đời thì sau này đổi sang luyện nghề, phần khổ tu vẫn giữ. Cơ chế phạt khi bỏ đạo giữ nguyên (xem mục 11).
8. **Tâm pháp: một chính và ba phụ.** Cách phát triển (tầng ngộ, cộng hưởng, đánh đổi) đã duyệt.
9. **Tụ phải thiết kế lại:** không được vừa mất nhịp vừa tốn khí (phạt đôi), và không được để khí làm sụp tam giác (xem mục 2 và 3).

Chưa chốt (còn hỏi): xem mục "Câu hỏi mở".

## Bản thiết kế (đề xuất, chờ duyệt)

### 1. Cấu trúc trận
- Tệp mới `js/systems/duel.js` (`TT.duel`), tách khỏi `combat.js`. Công tắc `D.DUEL.on`. Tắt thì mọi nơi dùng `combat.run()` như cũ và `node tools/baseline.js --check` trùng khít.
- **3 nhịp**, mỗi nhịp người chơi chọn một thế. Sau 3 nhịp, bên còn tỉ lệ máu cao hơn thắng (cùng luật `combat.run`). Hết máu sớm thì dừng sớm.
- Sau nhịp 2, nếu máu dưới 35%, được **hàng/rút** (giống `yield` hiện có, hoặc chạy theo luật `flee` hiện có).
- Trạng thái là dữ liệu thuần trong `w.pending { type: 'duel' }` (lưu/tải giữa trận được, giống `wheel.js`). `rng` chỉ gọi khi tạo trận và khi phân xử một nhịp. Hàm đọc (ý đồ, mô tả) không gọi `rng`.

### 2. Tam giác thế và sát thương
| Thế | Thắng | Thua |
|---|---|---|
| Công | Tụ | Thủ |
| Thủ | Công | Tụ |
| Tụ | Thủ | Công |

- Gốc sát thương dùng lại `hit(a, b)` của `combat.js` (công, niệm lực, ngũ hành, chí mạng, phòng thủ) rồi nhân hệ số nhịp.
- **Thắng nhịp:** mình ra đòn ×1.5, đối thủ không đánh trả. **Hòa** (cùng thế): hai bên cùng ra đòn ×0.8. **Thua nhịp:** đối thủ ra đòn ×1.5, mình không đánh trả.
- **Hệ số nhịp K** (một nhịp gộp nhiều hiệp cũ) ban đầu ≈ 4, chỉnh bằng đo. **Nguyên tắc cân bằng:** chọn thế ngẫu nhiên thuần thì tỉ lệ thắng/chết xấp xỉ `run()` cũ; đọc giỏi thì hơn rõ rệt. Đo bằng `tools/dgsim.js`.
- **Tụ = nhịp nạp (xem bên dưới).** Chiêu thức theo loại công pháp ở mục 10.

#### Tụ thiết kế lại (thay bản "tốn 2 khí")
Vấn đề của bản cũ: Tụ vừa mất nhịp vừa tốn khí là phạt đôi, và nếu khí cản không cho chọn Tụ thì tam giác sụp. Ví dụ đối thủ hết khí thì không Tụ được, Thủ trở thành thế an toàn tuyệt đối. Bản mới:
- **Không có thế nào bị khóa vì thiếu tài nguyên.** Ba thế luôn chọn được, nên tam giác luôn đủ chân vạc.
- **Tụ = nhịp nạp.** Ở nhịp Tụ bạn không ra đòn mạnh, chỉ nạp. Nếu **không bị Công đánh đứt**, chiêu **bung ngay đầu nhịp sau** (là một đòn riêng, trước khi chọn thế nhịp đó, rồi nhịp đó vẫn chọn thế bình thường).
  - Tụ thắng Thủ: nạp thành công, kèm đòn nhẹ.
  - Tụ hòa Tụ: cả hai cùng nạp.
  - Tụ thua Công: bị đánh đứt, **mất nạp**, chịu đòn nặng.
- **Chiêu đang nạp là thông tin hiển thị cho đối thủ** ("đang gom lực"), nên Công đánh đứt là phản ứng đúng. Đây là chỗ đọc ý đồ có nghĩa thật.
- Nhịp cuối mà Tụ thì chiêu bung ngay cuối trận, trước khi tính điểm.
- Chi phí duy nhất của Tụ là **rủi ro** (một nhịp bị hở), không còn tiền khí.

### 3. Khí → đổi thành "độ nạp" (ý 2 sửa lại)
- Bỏ khí làm tài nguyên cản chọn thế. Thay bằng **độ nạp**: Tụ liên tiếp hai nhịp (không bị đánh đứt) thì chiêu bung to hơn (chiêu lớn), đổi lại hở hai nhịp liền.
- **Niệm lực và tâm pháp** quyết định ngưỡng: niệm lực cao thì nạp nhanh hơn (chiêu thường chỉ cần nạp "nửa nhịp", tức nhịp Tụ hòa Công vẫn không mất nạp ở bậc cao). Chốt số ở phiên lõi bằng đo.
- Quản lý tài nguyên mất đi nhưng bù bằng bài toán thời điểm: nạp lúc nào, đọc quái sắp Công hay không.

### 4. Báo ý đồ (ý 1)
- Mỗi quái có **tính** quyết định xác suất chọn thế: hung hăng (nghiêng Công), cẩn trọng (nghiêng Thủ), xảo (nghiêng Tụ và hay đổi mẫu). Thủ lĩnh có **2 pha** đổi mẫu (pha 2 khi máu dưới 50%).
- Chuỗi thế của quái sinh một lần lúc vào trận (lưu trong trạng thái), nên hiển thị không gọi `rng`.
- **Điểm đọc** = chênh niệm lực so với quái (tỉ lệ) + thưởng tiên thiên (Kiếm tâm, khóa `chien`...) + thưởng sổ quái. Ba mức:
  - mờ: chỉ lời văn gợi tính (quái "gầm gừ", "đứng im");
  - hướng: loại trừ một thế (ví dụ "không phải Thủ");
  - rõ: nói thẳng thế của quái ở nhịp kế.
- Quái đang nạp thì hiển thị rõ "đang gom lực" (không phụ thuộc điểm đọc), nên người chơi luôn biết lúc nào nên Công đánh đứt.

### 5. Đà (ý 3)
- Thắng nhịp +1 đà cho bên thắng, thua nhịp -1 (về 0 khi đà âm trội thì chuyển sang bên kia). Hòa giữ nguyên.
- **Thế thượng phong** (đà 2, tức thắng hai nhịp liền): nhịp sau hòa được tính thắng, thắng thì ×2 thay ×1.5. Quái cũng có đà, nên người chơi bị dồn thì phải đổi nhịp, không bấm một thế mãi.
- Mở rộng sau: lên đà làm hiện chiêu tuyệt của công pháp (nếu cần).

### 6. Kết liễu (ý 5)
- Chỉ khi thắng **thủ lĩnh hoặc kẻ thù có tên**. Quái thường tự dọn như cũ.
- Ba lựa chọn: **Tha** (đạo tâm tăng, kẻ thù sống, có thể trả ơn hay trả thù ở truyện sau), **Giết** (xong hẳn, thủ lĩnh rơi đủ đồ, có thể tích nghiệp), **Cướp** (lấy một vật hoặc bí kíp của đối thủ, danh giảm).
- Hiệu ứng cụ thể gắn trục tính cách (`TT.nature`) và cờ truyện, chốt ở phiên nối truyện (cần xem K1/Q-giong-truyen).
- Thua thì đối thủ định đoạt: giữ nguyên các lối thoát hiện có (Thoát Thân Phù, tia may 30%, bị mất nửa thu hoạch...), không thêm đường chết mới.

### 7. Sổ quái (ý 6)
- Dữ liệu `{ idQuái: { gap, thang, biet } }`, `biet` từ 0 đến 3, tăng mỗi lần gặp (nhanh hơn nếu thắng):
  - 1: biết tính;
  - 2: biết xác suất thế;
  - 3: thuộc mẫu, đọc rõ nhịp 1 (và thủ lĩnh thì báo trước pha 2).
- **Lưu liên đời:** cần kiểm xem `TT.meta` (có `record/classify` ở `world.js`) có dùng được làm nơi lưu liên đời không. Nếu không, lưu ở `w` và chấp nhận mất khi đổi thế giới. Trường mới khởi tạo muộn, không đổi `TT.VERSION`.

### 8. Chạm hệ thống hiện có
- **Công pháp** (`tech.js`): làm lại thành bộ chiêu 3 loại (mục 10); bỏ phần tăng tốc tu luyện (chuyển sang tâm pháp).
- **Trang bị** (`gear.js`): giữ nguyên. Niệm lực tăng điểm đọc và tốc độ nạp.
- **Tiên thiên** (`Q-tien-thien.md`): `ne` thành Né một lần miễn đòn; `chien` thành thưởng điểm đọc; Kiếm tâm thưởng đọc; Thú ngữ thưởng đọc quái thú. Các khóa chưa nối vào sự kiện (`ne`, `yeu`) nối được ở đây.
- **Truyện:** kiểu `chong` dùng `duel()` thay hoặc cạnh vòng quay (phiên cuối). Phải giữ luật cường độ (Q-giong-truyen mục 6d): cao trào là đối đầu, có nguy hiểm thân thể, hai nhịp.

### 10. Công pháp = bộ chiêu (đã chốt hướng, số liệu chờ đo)
**Hai trục:** *loại* (Công, Thủ, Tụ) quyết định **khi nào ra chiêu**, *hệ* quyết định **chất chiêu**.
| Loại | Khi nào chiêu ra |
|---|---|
| Công | Khi bạn chọn Công và **thắng hoặc hòa** nhịp (không cần nạp, nhẹ, dùng đều) |
| Thủ | Khi bạn chọn Thủ và **thắng** nhịp (phản kích, hoặc dựng trạng thái phòng thủ) |
| Tụ | Nạp một nhịp, bung đầu nhịp sau (mạnh nhất, nhưng hở) |

- Mỗi công pháp là một chiêu, ở một loại. Công pháp chính quyết định chiêu ra trong trận. Các công pháp đã học khác là kho để đổi chính (đổi cần thời gian, chốt ở phiên công pháp).
- Hệ ngũ hành đặt "chất" cho chiêu. Bảng gợi ý (đổi được):
| Hệ | Chất chiêu (ví dụ) |
|---|---|
| Kim | Sốc xuyên giáp, đâm mạnh nhưng bị **phản phệ** (mất một phần máu) |
| Mộc | **Độc** gây sát thương nhiều nhịp, dây leo trói |
| Thủy | **Nhiều đòn nhỏ** (chí mạng cao), mượn lực phản lại |
| Hỏa | **Thiêu đốt** nhiều nhịp, liều: thua thì đau hơn |
| Thổ | **Môi trường:** rải cạm bẫy, nhịp sau đối thủ chọn đúng thế đã bị đoán thì dính |
| Phong | Ra đòn trước, lướt né |
| Lôi | **Tê liệt:** đối thủ mất lựa chọn thế nhịp sau |
| Băng | Đóng băng: đối thủ không thể lặp lại thế vừa dùng |
| Âm | Hút máu và làm nhiễu ý đồ hiển thị |
| Dương | Thanh tẩy, khắc Âm, hồi đạo tâm |
- **Trạng thái nền** (độc, thiêu, cạm bẫy, tê, đóng băng) kéo dài 1 đến 2 nhịp. Giới hạn mỗi bên tối đa 2 trạng thái cùng lúc để không rối. Nếu thấy 3 nhịp quá ngắn cho trạng thái thì tăng lên 4 nhịp (câu hỏi mở).
- 24 công pháp hiện có sắp xếp lại vào ma trận hệ x loại, bổ sung cho đủ (khoảng 30). Công pháp không hệ (Dưỡng Khí, Ngũ Hành Dung Hòa, Thiên Cương, Hư Không) là đa dụng, nửa hiệu lực.

### 11. Tâm pháp: một chính và ba phụ (đã chốt hướng)
**Dùng lại những gì đã có trong `path.js`:** `D.PATHS` (Khổ tu, Kiếm sống, Phiêu lưu, Giao du, Luyện nghề), `c.pathMo` (số tháng đã đi từng đạo, **giữ lại khi đổi đạo**), `quitCost` và `abandon` (phạt khi bỏ đạo giữa chừng: mất đạo tâm, mất một nửa thành thạo), `PATH_ADAPT` (giai đoạn thích nghi nửa hiệu lực sau khi đổi). Không phải làm lại hệ đạo.

- **Tâm pháp chính = tổng của các đạo đã đi.** Mỗi đạo để lại một **mạch** trong tâm pháp, cấp mạch theo `c.pathMo`. Khổ tu hồi nhỏ rồi sang Luyện nghề thì mạch Khổ tu vẫn còn, chỉ thôi tăng.
- Không còn cảm giác "bỏ đạo này lấy đạo khác". Mỗi lựa chọn đạo bồi thêm cho tâm pháp, và đổi đạo vẫn bị phạt như hiện nay.
- **Mạch ánh xạ sang chỉ số tâm pháp (gợi ý, chốt khi viết dữ liệu):**
| Mạch (đạo) | Cho |
|---|---|
| Khổ tu | Tốc độ tu luyện, tỉ lệ đột phá |
| Phiêu lưu | Điểm đọc ý đồ, vận may, khí vận |
| Giao du | Chống tâm ma, hiệu quả bạn đồng hành |
| Luyện nghề | Tâm tĩnh (đạo tâm), thọ nguyên |
| Kiếm sống | Tiết kiệm, thu nhập (hoặc nhẹ nhất, vì ít liên quan tu hành) |
- **Cộng hưởng (đã duyệt):** nhiều mạch cùng cấp thì có thưởng bộ ("đạo viên mãn"). Đi đủ nhiều đạo cho thưởng khác đi chuyên một đạo, hai lối chơi đều có giá trị.
- **Đánh đổi (đã duyệt):** mạch hoặc tâm pháp phụ có giá thật (ví dụ Thái Thượng Vong Tình: tu luyện nhanh nhưng giảm gắn bó).
- **Ba phụ:** 8 tâm pháp hiện có (mua bằng đạo điểm) trở thành phụ, tối đa 3 chỗ (mở theo cảnh giới). Đổi phụ phải bế quan một thời gian.
- **Ranh giới:** tâm pháp không cộng sát thương trực tiếp. Hai kênh nối sang chiến đấu là tốc độ nạp và điểm đọc.

### 12. Phiên code đề xuất
| Phiên | Model | Việc |
|---|---|---|
| C2-1 | Sonnet | Lõi `duel()`: trạng thái, tam giác, khí, đà, công tắc, kiểm thử, `dgsim` cân bằng |
| C2-2 | Sonnet | Giao diện hộp trận (thế, khí, đà, ý đồ), nối vào thủ lĩnh và kẻ thù tìm đến |
| C2-3 | Haiku | Dữ liệu: tính quái, mẫu thủ lĩnh, chiêu công pháp, văn trận |
| C2-4 | Sonnet | Kết liễu và sổ quái, nối nghiệp, đạo tâm |
| C2-5 | Sonnet | Nối truyện `chong`, tiên thiên |
| C2-6 | Sonnet + Haiku | Công pháp thành bộ chiêu (ma trận hệ x loại, trạng thái nền), dữ liệu khoảng 30 công pháp |
| C2-7 | Sonnet + Haiku | Tâm pháp: mạch từ `c.pathMo`, chính và ba phụ, cộng hưởng, đánh đổi; đo lại nhịp 50 và 130 tuổi |

## Câu hỏi mở
0. Trận là 3 hay 4 nhịp (Tụ cần một nhịp nạp, trạng thái cần vài nhịp)? Mặc định đề xuất: 4.
1. Sổ quái lưu liên đời hay chỉ trong một thế giới?
2. Kết liễu "Giết" phạt nặng đến đâu với người chơi theo đạo thiện? Tha có luôn tốt không?
3. Có cho phép "hàng" (xin tha) khi thua như một lựa chọn chính thức không?
4. Hiệu ứng "Cướp" lấy gì (vật phẩm, bí kíp, cả hai)?

## Đã làm
(chưa có, mới thiết kế)
