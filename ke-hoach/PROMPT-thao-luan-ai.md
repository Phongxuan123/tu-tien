# Prompt thảo luận với AI khác: hệ chiến đấu và công pháp mới

Cách dùng: sao chép **toàn bộ phần bên dưới đường kẻ** (từ "VAI TRÒ" đến hết "ĐỊNH DẠNG TRẢ LỜI") dán cho AI. Prompt tự đủ ngữ cảnh, AI không cần xem mã nguồn. Muốn AI đào sâu một phần thì thêm một dòng ở cuối, ví dụ "tập trung vào phần cân bằng và mô phỏng".

---

## VAI TRÒ

Bạn là nhà thiết kế game kỳ cựu (chiến đấu theo lượt, game chữ, roguelike, game mô phỏng đời người) và là người phản biện khó tính. Tôi là chủ một game tu tiên mô phỏng đời người. Tôi cần bạn **thảo luận và phản biện thiết kế chiến đấu và công pháp mới**, không phải khen. Hãy chỉ ra chỗ hỏng, chỗ nhàm, chỗ mất cân bằng, rồi đề xuất cách sửa cụ thể. Trả lời tiếng Việt, ngắn gọn, có số liệu khi được.

## 1. Bối cảnh game

- **Game:** mô phỏng đời người tu tiên, thuần HTML và JavaScript, chạy trên trình duyệt, không có máy chủ. Hình ảnh là cảnh pixel đơn giản, phần lớn là chữ. Chơi một đời từ lúc sinh ra tới lúc chết hoặc phi thăng, rồi đời sau.
- **Nhịp thế giới:** mỗi tháng game là một bước. Người thường thọ khoảng 70 tuổi. Cảnh giới: Phàm (0), Luyện Khí (1), Trúc Cơ (2), Kim Đan (3), Nguyên Anh (4), cảnh giới 5. Thọ Luyện Khí khoảng 130 tuổi, Trúc Cơ khoảng 260 tuổi. Nhịp thiết kế: khoảng **50 tuổi mới lên Luyện Khí**, khoảng **130 tuổi mới lên Trúc Cơ** (tu luyện là việc của cả đời, không phải vài giờ chơi).
- **Thế giới có NPC, tông môn, quốc gia, chiến tranh thế lực** chạy ngầm. Chiến đấu cá nhân của người chơi tách biệt với chiến tranh thế lực.
- **Truyện:** có kịch bản nhiều chặng, cao trào là cảnh đối đầu có nguy hiểm thân thể. Có "vòng quay vận mệnh" quyết định các cảnh người chơi không điều khiển được. Người chơi có "đạo" (hướng sống: Khổ tu, Kiếm sống, Phiêu lưu, Giao du, Luyện nghề) và bỏ đạo giữa chừng thì bị phạt (mất đạo tâm, mất nửa thành thạo).
- **Người chơi có thể để máy chọn thay** (chế độ tự động), nên mọi quyết định phải có phương án mặc định hợp lý.
- **Ràng buộc kỹ thuật cần biết:** NPC và quái thường dùng hệ chiến đấu cũ, không được đổi (để cân bằng chiến tranh và thế giới không lệch). Chỉ người chơi dùng hệ mới. Hàm "đọc" không được sinh số ngẫu nhiên.

## 2. Hệ chiến đấu hiện tại (để bạn thấy vấn đề)

- **Tự động hoàn toàn**, tối đa 14 hiệp, mỗi hiệp A đánh rồi B đánh.
- **Công thức một đòn:** `(công kích × ngẫu nhiên 0.8 đến 1.25 + niệm lực × 0.25) × chiến thuật × khắc ngũ hành (0.78 đến 1.32) × chí mạng (6%, ×1.8) ÷ (1 + phòng thủ/60)`.
- **Thắng thua:** bên còn tỉ lệ máu cao hơn khi trận dừng. Dừng khi một bên xuống dưới 20% máu (hàng), hoặc 0 máu nếu đánh tới cùng, hoặc hết 14 hiệp.
- **Người chơi quyết định đúng một lần trước trận:** Tấn công mạnh (đòn ×1.25, nhận ×1.15), Thủ chắc (đòn ×0.8, nhận ×0.65), hoặc Bỏ chạy. Trong trận không làm gì thêm.
- **Công pháp hiện tại** (24 cái) chỉ cộng một ít công kích (`(2 + 3×bậc) × (cấp+1)/10`) và tăng tốc độ tu luyện (tới khoảng +54% ở bậc cao nhất). Không có chiêu thức.
- **Tâm pháp hiện tại** (8 cái, bị động) mua bằng "đạo điểm": cộng niệm lực, sinh lực, vận may, tỉ lệ đột phá, tốc độ tu luyện, thọ, chống tâm ma. Tối đa 3 chỗ.
- **Quái** (16 loại) chỉ khác hệ ngũ hành và hệ số sức mạnh, không có hành vi riêng.
- **Số đo hiện trạng** (60 lượt mỗi loại, người máy chọn mặc định, có trang bị): bí cảnh Luyện Khí 1: thông quan 5%, chết 15%. Bí cảnh Luyện Khí 2: thông quan 15%, chết 13%. Hung địa Luyện Khí 1: thông quan 0%, chết 13%, bỏ chạy 53%. Tỉ lệ chết đã đáng kể, **không được tăng thêm**.

**Điểm yếu lớn nhất:** mất quyền quyết định, công pháp vô hình, quái cùng một khuôn.

## 3. Mục đích và mục tiêu thiết kế

1. **Lõi phải hay trước khi nhiều.** Một trận quan trọng phải có quyết định thật, không phải xem kết quả.
2. **Có chiều sâu chiến thuật mà không dài dòng**: 5 nhịp một trận, mỗi nhịp có lý do để chọn.
3. **Công pháp thành "kiểu đánh riêng" của nhân vật**, nối với ngũ hành và tư chất.
4. **Tâm pháp là cách sống và cách tu**, nối với "đạo" của đời, không phải chỉ cộng số.
5. **Nối vào truyện**: kết quả trận (tha, giết, cướp) tác động tới đạo tâm, nghiệp và cốt truyện.
6. **Không đổi cân bằng thế giới** (NPC, chiến tranh), **không tăng độ chết**, **không làm chậm nhịp đời người** quá ±5%.
7. **Tiết kiệm công sức làm:** chia thành các phiên nhỏ, giao việc dữ liệu cho mô hình nhẹ.

## 4. Thiết kế đề xuất (cần bạn phản biện)

### 4.1 Trận thế ("duel"), dùng cho thủ lĩnh, kẻ thù có tên, cao trào truyện
- **5 nhịp tiêu chuẩn** (thủ lĩnh 6 nhịp, pha 2 từ nhịp 4). Quái thường và NPC vẫn dùng hệ cũ.
- **Ba thế kiểu kéo búa bao, nhưng đọc được:** Công thắng Tụ, Thủ thắng Công, Tụ thắng Thủ.
  - Thắng nhịp: ra đòn ×1.5 và không bị đánh lại. Hòa: hai bên cùng ra đòn ×0.8. Thua: ngược lại.
- **Tụ = nhịp nạp.** Nhịp Tụ chỉ nạp. Nếu không bị Công đánh đứt thì chiêu **bung đầu nhịp sau**. Bị Công đánh thì mất nạp và chịu đòn nặng. Không có thế nào bị khóa vì thiếu tài nguyên (đã bỏ tài nguyên "khí" vì nó làm sụp tam giác: đối thủ hết khí thì Thủ thành thế an toàn tuyệt đối).
- **Quái báo ý đồ:** mỗi quái có "tính" (hung hăng nghiêng Công, cẩn trọng nghiêng Thủ, xảo nghiêng Tụ và phản lại thế người chơi vừa dùng). Người chơi thấy ý đồ ở ba mức: mờ, loại trừ một thế, rõ hẳn, tùy niệm lực, tiên thiên và sổ quái. Quái đang nạp thì luôn hiện rõ.
- **Đà:** thắng hai nhịp liền vào "thế thượng phong" (hòa tính thắng, thắng ×2).
- **Quái có chiêu riêng theo hệ** (thường 1 chiêu, thủ lĩnh 3 đến 4 chiêu và 2 pha).
- **Kết liễu** (chỉ với thủ lĩnh và kẻ thù có tên): Tha, Giết, Cướp, nối vào đạo tâm và truyện.
- **Sổ quái:** gặp càng nhiều thì càng biết tính, xác suất thế, rồi thuộc mẫu.
- **Cân bằng:** chọn thế ngẫu nhiên thì tỉ lệ thắng và chết xấp xỉ hệ cũ, đọc giỏi thì hơn rõ rệt.

### 4.2 Công pháp mới = bộ chiêu
- **Hai trục:** *loại* (Công, Thủ, Tụ) quyết định chiêu ra khi nào; *hệ ngũ hành* (Kim, Mộc, Thủy, Hỏa, Thổ, Phong, Lôi, Băng, Âm, Dương) quyết định chất chiêu.
  - Công: chiêu ra khi chọn Công và thắng hoặc hòa. Thủ: ra khi chọn Thủ và thắng. Tụ: nạp rồi bung nhịp sau.
- **Bộ ba:** mỗi người mang 3 công pháp, mỗi loại một cái, nên pha hệ được (ví dụ Kim Công, Thủy Thủ, Hỏa Tụ). Ô trống thì dùng đòn thuần.
- **Chất chiêu theo hệ (ví dụ):** Kim sốc xuyên giáp nhưng phản phệ. Mộc độc. Thủy nhiều đòn nhỏ và làm ướt. Hỏa thiêu đốt nhưng liều. Thổ rải bẫy lên thế đối thủ hay dùng. Phong ra đòn trước, hòa tính thắng. Lôi tê (ép đối thủ nhịp sau chọn Thủ). Băng đóng băng (đối thủ không lặp thế). Âm hút máu và gây nhiễu ý đồ. Dương thanh tẩy và khắc Âm.
- **Trạng thái nền** (độc, thiêu, ướt, tê, băng, bẫy, sốc, nhiễu) tối đa 2 mỗi bên, kéo dài 1 đến 3 nhịp. **Kích nổ ngũ hành:** chiêu hệ khắc trúng mục tiêu đang mang trạng thái của hệ bị khắc thì tiêu trạng thái và nổ sát thương còn lại ×1.5.
- **34 công pháp**, cấp luyện 0 đến 9, biến thức mở ở cấp 3, 6, 9.
- **Công pháp bỏ phần tăng tốc tu luyện**, chuyển sang tâm pháp.

### 4.3 Tâm pháp mới
- **Tâm pháp chính = tổng các đạo đã đi** ("mạch"), tự hoàn thiện theo các lựa chọn đạo. Đi Khổ tu rồi chuyển sang Luyện nghề thì mạch Khổ tu vẫn giữ làm "dư âm" vĩnh viễn, nhưng đổi đạo vẫn bị phạt như cũ.
- **Dư âm mỗi mạch** (trần cấp 5): Khổ tu cho tu luyện và đột phá; Phiêu lưu cho vận may và điểm đọc ý đồ; Giao du cho chống tâm ma; Luyện nghề cho thọ và niệm lực; Kiếm sống cho thu nhập.
- **Đạo hạnh** (tổng cấp mạch, 0 đến 25) mở 3 tầng ngộ. **Cộng hưởng** thưởng người đi nhiều đạo, **nhất tâm** thưởng người đi chuyên một đạo.
- **Ba phụ** mua bằng đạo điểm, **mở khóa theo mạch đã đi**, vài cái có đánh đổi (ví dụ tu luyện +20% nhưng thọ -5%, tâm ma tăng).
- **Ranh giới:** tâm pháp không cộng sát thương trực tiếp; chỉ có hai cầu nối sang chiến đấu là điểm đọc và độ nạp.
- **Ngân sách:** tổng tốc độ tu luyện từ tâm pháp chặn tối đa +45%, giữ nhịp đời người lệch không quá ±5%.

### 4.4 Số liệu mô phỏng đã có (mô hình rút gọn: ba thế, Tụ nạp-bung, quái có tính cố định; 40.000 trận mỗi dòng)
| Số nhịp | Người chọn ngẫu nhiên thắng | Người đọc được 40% ý đồ thắng | Cách biệt |
|---|---|---|---|
| 3 | 50% | 86% | 36 điểm |
| 4 | 50% | 89% | 39 điểm |
| 5 | 50% | 90% | 40 điểm |
| 6 | 50% | 92% | 42 điểm |
| 8 | 50% | 95% | 44 điểm |
| 10 | 50% | 96% | 46 điểm |
Kết luận từ đó: kỹ năng bão hòa từ 4 đến 5 nhịp, dài hơn chỉ mệt hơn. Nhưng **người đọc 40% đã thắng 90% là quá chắc**, nên chiều sâu phải đến từ nội dung (quái thích nghi, chiêu riêng, trạng thái, kích nổ), không từ độ dài.

### 4.5 Kế hoạch triển khai (6 phiên công pháp và tâm pháp, rồi 5 phiên lõi trận)
Tâm pháp (lõi, dữ liệu, giao diện) → khung công pháp (bộ ba, di chuyển bản lưu cũ) → dữ liệu công pháp → mô-đun trạng thái và kích nổ → lõi trận → giao diện trận → dữ liệu quái → kết liễu và sổ quái → nối truyện.

## 5. Điều tôi muốn bạn làm

Hãy thảo luận theo thứ tự, trả lời từng mục:

1. **Phản biện lõi trận (4.1):** tam giác Công/Thủ/Tụ kiểu "nạp rồi bung" có thật sự có chiều sâu không, hay rơi vào "bấm thế thắng thế thua" nhàm? Có tình huống nào người chơi tìm ra thế thống trị (dominant strategy)? Quái thích nghi ở mức nào thì đủ mà không bực?
2. **Phản biện công pháp (4.2):** 30 chiêu (10 hệ × 3 loại) có đủ khác biệt về *cảm giác* không, hay chỉ khác tên và số? Hệ nào dễ bị lấn át hoặc vô dụng? Kích nổ ngũ hành có gây chuỗi tấn công quá mạnh không? Trạng thái tối đa 2 có đủ?
3. **Phản biện tâm pháp (4.3):** "mạch từ các đạo đã đi" có thật sự tạo cảm giác tự hoàn thiện không, hay người chơi chỉ chạy theo hệ số? Đi rộng và đi chuyên có thật sự ngang giá? Đánh đổi của phụ có đủ đau để thành quyết định?
4. **Cân bằng:** xác định các biến dễ làm vỡ cân bằng (tốc độ tu luyện, tỉ lệ chết, sát thương chiêu Tụ so với Công) và đề xuất phương pháp đo (mô phỏng gì, đo chỉ số gì, ngưỡng nào là đạt).
5. **Cảm giác chơi trong game chữ:** cách trình bày một trận 5 nhịp bằng chữ và nút bấm để vui mà không mệt (văn trận, hiển thị ý đồ, hiển thị trạng thái). Có cách rút ngắn khi chơi nhiều trận không?
6. **Nối truyện:** cách nối Tha/Giết/Cướp và mạch tâm pháp vào cốt truyện và đạo tâm để mỗi trận có trọng lượng.
7. **Rủi ro kỹ thuật và phạm vi:** việc nào nên cắt khỏi bản đầu, việc nào phải làm sớm nhất, thứ tự tốt hơn nếu có.
8. **Ba đề xuất đột phá** mà tôi chưa nghĩ tới, mỗi cái kèm chi phí và rủi ro.

## 6. Tiêu chí đánh giá (cho thiết kế và cho câu trả lời của bạn)

**Chấm thiết kế (1 đến 5 điểm mỗi mục, kèm lý do một dòng):**
- Chiều sâu quyết định: mỗi nhịp có lý do chọn, không có thế thống trị.
- Dễ đọc và dễ học: người mới hiểu trong hai trận.
- Độc đáo và gắn với tu tiên: không chỉ là kéo búa bao đổi tên.
- Nối truyện và nối đạo: trận và công pháp có hệ quả ngoài trận.
- Cân bằng và an toàn: không tăng độ chết, không phá nhịp đời người, không đổi thế giới NPC.
- Chi phí làm: số phiên và rủi ro triển khai hợp lý.
- Chơi lặp lại: sau 50 trận vẫn còn thứ để học.

**Câu trả lời của bạn sẽ được tôi đánh giá theo:**
- Cụ thể: có ví dụ, con số, kịch bản tình huống, không nói chung chung.
- Phản biện thật: chỉ ra ít nhất 5 vấn đề có thật, xếp theo mức nghiêm trọng.
- Đề xuất làm được: mỗi đề xuất có cách làm, chi phí ước lượng và rủi ro.
- Tôn trọng ràng buộc: không đề xuất thứ phá ràng buộc ở mục 1 và mục 3.
- Có thứ tự ưu tiên: biết cái gì làm trước.

## ĐỊNH DẠNG TRẢ LỜI

1. **Nhận định chung** (tối đa 5 dòng): điểm mạnh nhất, điểm yếu nhất.
2. **Bảng chấm** theo 7 tiêu chí ở mục 6.
3. **Phản biện chi tiết** theo mục 1 đến 8 ở mục 5, mỗi mục có: vấn đề, vì sao, cách sửa.
4. **Top 5 việc nên sửa ngay**, xếp theo mức nghiêm trọng, mỗi việc một câu và một số liệu hoặc ví dụ.
5. **Ba đề xuất đột phá.**
6. **Câu hỏi bạn muốn hỏi lại tôi** (tối đa 4 câu).

Nếu thiếu thông tin để kết luận thì nói rõ thiếu gì thay vì đoán.
