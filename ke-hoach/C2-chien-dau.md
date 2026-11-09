# C2. Cơ chế chiến đấu mới ("Trận thế")

Tài liệu thiết kế, chưa có code. Phiên thiết kế bắt đầu 2026-11-09, nhánh `claude/thiet-ke-chien-dau`. Chủ game chốt, các phiên code sau đọc mục "Đã chốt" và "Bản thiết kế".

## Đã chốt

1. **Hướng A:** trận chia nhịp, người chơi chọn thế mỗi nhịp theo kiểu kéo búa bao nhưng có thể đọc được (có chiến thuật, không đoán mù). Nối sang cao trào truyện (`chong`) ở một phiên sau.
2. **Ba thế:** Công, Thủ, Tụ (tam giác). Không thêm thế thứ tư. Né là khả năng tiên thiên (khóa `ne`), không phải thế.
3. **Bản đầu gồm năm ý:** (1) quái báo ý đồ, (2) khí làm tài nguyên, (3) đà, (5) kết liễu, (6) sổ quái.
4. **Phạm vi dùng `duel()`:** thủ lĩnh, kẻ thù tìm đến (có tên), cao trào truyện. Quái thường và mọi trận của NPC vẫn dùng `combat.run()` cũ để không đổi baseline.
5. **Cái chết:** không tăng độ chết. Người chơi đọc giỏi thì ít chết hơn.

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
- Thế Tụ tung **chiêu** của công pháp chính: sát thương cộng theo bậc công pháp và cấp luyện, mang hệ nên cộng thêm khi khắc hệ quái (dùng `elemMul`). Không có công pháp chính thì Tụ vẫn dùng được nhưng chỉ là đòn thường mạnh hơn. Danh sách chiêu theo từng công pháp viết ở phiên dữ liệu (Haiku).

### 3. Khí (ý 2)
- Khí bắt đầu 2, tối đa 4. Mỗi nhịp tự +1 (hít thở) nếu không Tụ. **Tụ tốn 2 khí.** Không đủ khí thì không chọn được Tụ.
- Quái cũng có khí theo cùng luật. Quái hết khí thì không thể Tụ, đây là thông tin đọc được.
- Khí tối đa và khí đầu trận có thể tăng nhờ công pháp (tầng cao), tâm pháp, trang bị niệm lực. Chi tiết chốt ở phiên công pháp.

### 4. Báo ý đồ (ý 1)
- Mỗi quái có **tính** quyết định xác suất chọn thế: hung hăng (nghiêng Công), cẩn trọng (nghiêng Thủ), xảo (nghiêng Tụ và hay đổi mẫu). Thủ lĩnh có **2 pha** đổi mẫu (pha 2 khi máu dưới 50%).
- Chuỗi thế của quái sinh một lần lúc vào trận (lưu trong trạng thái), nên hiển thị không gọi `rng`.
- **Điểm đọc** = chênh niệm lực so với quái (tỉ lệ) + thưởng tiên thiên (Kiếm tâm, khóa `chien`...) + thưởng sổ quái. Ba mức:
  - mờ: chỉ lời văn gợi tính (quái "gầm gừ", "đứng im");
  - hướng: loại trừ một thế (ví dụ "không phải Thủ");
  - rõ: nói thẳng thế của quái ở nhịp kế.
- Quái chọn thế cũng bị ràng buộc bởi khí của nó, nên người chơi suy luận được.

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
- **Công pháp** (`tech.js`): thêm chiêu cho Tụ; chưa đổi `mod('atk')`.
- **Trang bị** (`gear.js`): giữ nguyên. Niệm lực tăng điểm đọc và khí.
- **Tiên thiên** (`Q-tien-thien.md`): `ne` thành Né một lần miễn đòn; `chien` thành thưởng điểm đọc; Kiếm tâm thưởng đọc; Thú ngữ thưởng đọc quái thú. Các khóa chưa nối vào sự kiện (`ne`, `yeu`) nối được ở đây.
- **Truyện:** kiểu `chong` dùng `duel()` thay hoặc cạnh vòng quay (phiên cuối). Phải giữ luật cường độ (Q-giong-truyen mục 6d): cao trào là đối đầu, có nguy hiểm thân thể, hai nhịp.

### 9. Phiên code đề xuất
| Phiên | Model | Việc |
|---|---|---|
| C2-1 | Sonnet | Lõi `duel()`: trạng thái, tam giác, khí, đà, công tắc, kiểm thử, `dgsim` cân bằng |
| C2-2 | Sonnet | Giao diện hộp trận (thế, khí, đà, ý đồ), nối vào thủ lĩnh và kẻ thù tìm đến |
| C2-3 | Haiku | Dữ liệu: tính quái, mẫu thủ lĩnh, chiêu công pháp, văn trận |
| C2-4 | Sonnet | Kết liễu và sổ quái, nối nghiệp, đạo tâm |
| C2-5 | Sonnet | Nối truyện `chong`, tiên thiên |

## Câu hỏi mở
1. Sổ quái lưu liên đời hay chỉ trong một thế giới?
2. Kết liễu "Giết" phạt nặng đến đâu với người chơi theo đạo thiện? Tha có luôn tốt không?
3. Có cho phép "hàng" (xin tha) khi thua như một lựa chọn chính thức không?
4. Hiệu ứng "Cướp" lấy gì (vật phẩm, bí kíp, cả hai)?

## Đã làm
(chưa có, mới thiết kế)
