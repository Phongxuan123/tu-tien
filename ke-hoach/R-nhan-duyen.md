# R. Nhân duyên và các mối quan hệ (đạo lữ, con cái, sư đồ, thân tộc, dây duyên)

- Trạng thái: Chờ duyệt (bản 2 đã gộp quyết định mục 1.1; chưa code)
- Ngày lập: 2026-10-18
- Tách khỏi: [Q-cot-truyen](Q-cot-truyen.md) (vì vượt phạm vi cốt truyện). Q chỉ **dùng** các cơ chế ở đây (tuyến T8 Đạo lữ và gia đình, dàn nhân vật định mệnh, xuất thân kế thừa cho con cái, Nghiệt duyên).
- Liên quan: `js/systems/relations.js` (`TT.rel`), `js/systems/family.js` (`TT.family`), `js/systems/social.js` (`TT.social`), `js/data/famevents.js`, `js/data/relevents.js`, `js/ui/family.js`, `js/ui/people.js`, `js/systems/cultivation.js` (song tu, thụ thai), `world.js` (kế thừa, tử vong), Q mục 8, 6, 4, 5, 11, 13.3

## 1. Yêu cầu của bạn
- Hệ thống **nhân duyên, mối quan hệ chưa rõ ràng**, nhất là **tuyến đạo lữ và con cái**. Thiết kế lại; làm thành **kế hoạch riêng** vì đã vượt phạm vi cốt truyện (2026-10-18).

### 1.1 Quyết định đã chốt (2026-10-18, bản 2)
1. **Bỏ giới hạn chênh lệch tuổi 30**: hai người chỉ cần cùng đủ tuổi trưởng thành (18); không còn chặn theo chênh lệch tuổi (vẫn có chặng "nỗi buồn tuổi thọ" khi chênh cảnh giới).
2. **Cùng giới vẫn hiếm gấp 5** so với khác giới (giữ hệ số nảy tình 0,2).
3. **Song tu 1 đến 2 lần mỗi năm**; làm nhiều lần trong năm thì **phần thưởng càng giảm** (5.3).
4. **Khả năng có con: cao nhất 10% rồi giảm dần về 1%** theo cảnh giới (6.1). *Mình hiểu là xác suất mỗi lần song tu (vì chỉ 1 đến 2 lần mỗi năm); xem câu 3 mục 12.*
5. **Tối đa 2 con trong cả đời, tính chung cho mọi đạo lữ** (con ruột và con nuôi cộng chung).
6. **Tham gia việc của con ở mức vừa**: chỉ các **quyết định lựa chọn quan trọng**; phần còn lại **chạy theo tính cách** nhân vật (6.3).
7. **Giáo dưỡng là một quyết định ở một thời điểm** trong đời con (không phải chọn liên tục) (6.4).
8. **"Đẩy duyên" bằng điểm khí vận** qua **giấc mơ hiện lựa chọn** (7.2); **không hiển thị dây duyên** cho người chơi.
9. **Nút hành động** (tặng quà, tâm sự, song tu...) vẫn có để **đẩy tiến độ**, nhưng nhân vật **tự làm theo tính cách**; nút chỉ là **thúc đẩy ưu tiên thấp**; làm việc với NPC cần **cùng địa điểm**, nếu bạn bấm thì nhân vật sẽ **cố gắng đến tìm NPC** (ưu tiên thấp) (9.3).
10. **(2026-10-19, phiên thiết kế Đợt 8)** R1 làm ở chặng 8D, **chỉ cho các cặp thân thiết của người chơi**; R2, R3 làm bản lõi khoảng 12 chặng mỗi cái ở 9B, 9C; **R4 dây duyên và giấc mơ đẩy duyên hoãn** sang Đợt 11 trở đi (tạm dùng nhân vật định mệnh đơn giản của Q2).
## 2. Hiện trạng (vì sao thấy chưa rõ)
**Quan hệ** (`TT.rel`): mỗi cặp chỉ có **một số** `v` (−100 đến 100) và một **nhãn loại** `k` (`thu`, `ket_nghia`, `dao_lu`, `su_do`, `huyet`); cặp đạo lữ có thêm `love` (0 đến 100). Nhãn hiện ra theo ngưỡng (Quen biết, Bạn bè, Tri kỷ...). Không có chiều "tin", "nợ ơn/oán", "kính", không có **giai đoạn**.

**Đạo lữ**:
- Nảy nở từ giao du ("tâm sự") khi đủ tuổi, không ruột thịt, chênh dưới 30 tuổi (**bạn chốt bỏ giới hạn này**); khác giới hợp 1, cùng giới 0,2. Tới ngưỡng thì bật hộp **Duyên tình** (tỏ tình hoặc nhận lời). Nhận lời là **kết đạo lữ** ngay, `love = 100`.
- **Người chơi nhiều đạo lữ** (ghen tuông là một hộp riêng), NPC chỉ một. Không có **lễ kết**, **hôn ước**, **gia tộc hai bên**, **tương hợp** (chỉ `compat` mờ theo nhãn tính cách).
- Hằng năm: gần nhau thì tình tăng nhẹ, xa thì giảm; NPC tình < 25 có thể chia tay. Người chơi hầu như không có "chia tay", "ly biệt", "vĩnh biệt" có chiều sâu.
- Chỉ có **một hành vi** gần hơn: **song tu**; không có "ở bên nhau", "đi cùng", "cãi nhau lâu dài", "vượt thử thách", "chênh thọ nguyên".

**Con cái**:
- Sinh ra khi **song tu** (mẹ nữ, cha nam), tuổi mẹ 18 đến 48, cách lần sinh 24 tháng, **xác suất cố định 1,8% mỗi tháng song tu**, tối đa 4 con. Không có **ý định**, không có **khó khăn khi cảnh giới cao**, không có **thai kỳ có chuyện**.
- Con thừa hưởng **tư chất** (25% từ cha mẹ), **tiên thiên** (mỗi cái 15% hay 6%), tên theo họ cha. **Không** có tính cách, xuất thân, giáo dưỡng, quan hệ cha mẹ-con đổi theo thời gian. Chỉ có hai sự kiện: **Dạy con** (tầng 2) và **Chuyện nhà** (tầng 1).
- Khi người chơi chết: **người kế thừa** là con (hoặc đồ đệ) lớn tuổi nhất, chọn trong hộp; không có thừa kế **nợ, thù, di vật, gia sản** rõ ràng.

**Khác**: sư đồ (tối đa 5 đồ đệ, +15% tu luyện), kết nghĩa, nợ ân tình (đòi sau), kẻ thù (thề báo thù) đều là **mảnh rời**; không có "thân tộc" (anh chị em, họ hàng), không có "bạn đồng hành".

## 3. Mục tiêu thiết kế
1. Mỗi mối quan hệ có **hình thái, giai đoạn, và các thanh** để người chơi **nhìn là hiểu** (không chỉ một số).
2. **Đạo lữ** là một **hành trình** có đầu có đuôi (gặp, mến, tỏ tình, hôn ước, kết, ở bên, thử thách, chia ly hoặc vĩnh biệt), có chính trị gia tộc, có tương hợp thật, có hậu quả.
3. **Con cái** là **một đời người** (thai, thơ ấu, thiếu niên, lập nghiệp, nối nghiệp hoặc rời đi), có **giáo dưỡng** người chơi tham gia, **tính cách** và **xuất thân** thừa hưởng, quan hệ cha mẹ-con đổi theo thời gian, thừa kế rõ ràng.
4. **Nhân duyên** thành một **cơ chế dẫn dắt**: ai sẽ gặp bạn, lúc nào, vì sao (dây duyên), để Q lấy làm **dàn nhân vật định mệnh**.
5. Giữ **chi phí máy thấp** (chỉ nhân vật lõi có chiều sâu), **không phá nhịp** (≤ 6 hộp/phút), **không đổi `TT.VERSION`** (trường mới khởi tạo muộn).
6. Nội dung **ở mức văn học**, không miêu tả chi tiết thân mật; chuyện đau thương **kể gián tiếp**.

## 4. Mô hình quan hệ mới

### 4.1 Các thanh (chỉ cho cặp thân thiết)
Mọi cặp vẫn có **thiện cảm** `v` như cũ (rẻ). Cặp **thân thiết** (|v| ≥ 40 hoặc có loại đặc biệt) có thêm **chiều sâu** `d`:
| Thanh | Ý nghĩa | Thang | Tăng khi | Giảm khi |
|---|---|---|---|---|
| **Tình** (`love`) | gắn bó yêu thương (đạo lữ, người thương, con) | 0 đến 100 | ở bên, quà, giúp đỡ, tâm sự, chung hoạn nạn | xa cách, cãi vã, phản bội |
| **Tin** (`trust`) | tin tưởng, giao phó bí mật | 0 đến 100 | giữ lời, giúp trong nguy, nói thật | nói dối, lộ bí mật, bội ước |
| **Kính** (`respect`) | nể trọng (sư đồ, huynh đệ, con với cha mẹ, đối thủ) | 0 đến 100 | chiến công, đạo đức, dạy dỗ tốt | hèn nhát, thất tín, nuông chiều |
| **Ơn oán** (`debt`) | sổ nợ ân và oán | −100 (oán) đến +100 (ơn) | cứu giúp (+), hại (−) | trả ơn, tha thứ (kéo về 0) |
- Hiển thị: ba thanh nhỏ (Tình, Tin, Kính) và một chip "Ơn" hoặc "Oán" kèm số. **Thanh nào không có thì ẩn** (người quen biết chỉ hiện nhãn).
- **Giá trị suy ra** *Thân*: trung bình có trọng số của Tình, Tin, Kính theo từng loại; dùng cho hộp quyết định và để Q bốc người.

### 4.2 Các hình thái (loại) quan hệ
| Loại | Mã | Hình thành | Thanh chính | Hậu quả/lợi ích |
|---|---|---|---|---|
| Quen biết, Bạn bè, Tri kỷ | `ban` | thiện cảm tăng dần | Tin | tặng đồ, nhờ giúp, tin tức |
| Kết nghĩa (huynh đệ, tỷ muội) | `ket_nghia` | lời thề (sự kiện) | Tin, Kính | bảo vệ, đồng minh, bị liên lụy |
| Đạo lữ (chính, phụ) | `dao_lu` | hành trình tình (mục 5) | Tình, Tin | song tu, đạo tâm, con cái |
| Người thương (chưa danh phận) | `thuong` | tình đơn phương hoặc bí mật | Tình | nhẹ hơn đạo lữ, không song tu chính thức |
| Hôn ước | `hon_uoc` | cha mẹ, gia tộc, thế lực ép hoặc hứa | Kính, ơn | chính trị gia tộc (5.4) |
| Sư đồ (nội môn, ký danh) | `su_do` | nhận đồ đệ | Kính, Tin | +tu luyện cho đồ, truyền thừa |
| Ruột thịt (cha mẹ, con, anh chị em) | `huyet` | sinh ra | Tình, Kính | thừa kế, bổn phận (Q 8) |
| Họ hàng, thân tộc | `toc` | cùng gia tộc | Kính | giúp, tranh chấp, hôn ước |
| Ân nhân | `an` | một ơn lớn (đủ Ơn dương) | Ơn | trả ơn, được nhờ |
| Kẻ thù (cá nhân, thù tông) | `thu` | oán sâu, thề báo thù | Oán | truy sát, trả thù |
| Đối thủ (gương soi) | `doi_thu` | cạnh tranh ngang tầm | Kính, Oán nhẹ | thúc đẩy, đua đột phá |
| Tình địch | `tinh_dich` | cùng yêu một người | Oán nhẹ | ghen, đấu tay đôi |
| Bạn đồng hành | `dong_hanh` | cùng đi đường | Tin | cùng chiến đấu, rời đi sau chuyến |
| Người cũ (đạo lữ cũ, đồ đệ cũ) | `cu` | chia tay êm đẹp hoặc đau | Tình cũ | gặp lại, hối, tái hợp |
| Nghiệt duyên | `nghiet` | nợ thân thể/mạng (Q 11.1) | Oán/Ơn | hội ngộ theo hạn |
- Một cặp có **một loại chính** và có thể có **nhãn phụ** (ví dụ Đạo lữ + Đối thủ trong đạo).
- **Chuyển loại** có quy tắc: Quen → Bạn → Tri kỷ; Bạn → Người thương → Hôn ước/Đạo lữ; Đạo lữ → Người cũ; Bạn → Kẻ thù (phản bội); Kẻ thù → Người cũ (hòa giải)...

## 5. Đạo lữ: một hành trình

### 5.1 Giai đoạn
```
Gặp gỡ ─> Quen ─> Thân ─> Mến ─> Tỏ tình ─┬─> (từ chối) ─> Người cũ / bạn
                                          └─> Hứa hẹn (đính ước / hôn ước) ─> Kết đạo lữ (lễ)
 ─> Đồng hành (ở bên, song tu) ─> [Thử thách chung] ─> Bền chặt ─┬─> Chia ly ─> Người cũ
                                                              ├─> Rạn nứt ─> Hòa / Chia tay
                                                              └─> Vĩnh biệt (một người mất)
```
- Mỗi **giai đoạn** có điều kiện, hành động mở, sự kiện riêng; đồng hồ giai đoạn lưu trong bản ghi quan hệ `d.st`.
- Người chơi **chủ động** (tặng quà, mời đi chơi, tỏ tình, cầu hôn, song tu) hoặc **thụ động** (NPC chủ động); chế độ Cân bằng/Tự động có mặc định hợp tính cách.
- **Từ chối** có hậu quả (Tình giảm, có thể thành Người cũ); **tình đơn phương** có chặng riêng.

### 5.2 Tương hợp (vì sao hai người hợp)
Điểm tương hợp (−1 đến +1) từ sáu thứ:
1. **Tính cách 4 trục** (Q 6): khoảng cách theo từng trục; Đạo đức gần nhau hợp mạnh; Tính tình nóng-nóng dễ cháy, nóng-điềm hợp; Xử thế lệch thì bổ trợ hoặc xung khắc.
2. **Tiên thiên và ngũ hành tư chất** (Q 4): ngũ hành tương sinh (+), tương khắc (−); hợp mệnh tăng; cặp tiên thiên kỵ nhau (Đạo cốt với Ma cốt) giảm.
3. **Đạo đang theo** (ngã rẽ C): cùng đường cộng, khác đường trừ nhẹ.
4. **Xuất thân, địa vị** (Q 8): môn đăng hộ đối cộng, chênh nhiều trừ (nhưng có thể thành chuyện cảm động).
5. **Chênh cảnh giới và thọ nguyên**: chênh ≥ 2 cảnh giới là **nỗi buồn tuổi thọ** (một người sống lâu hơn nhiều), hiện thành chặng riêng khi quan hệ đủ sâu.
6. **Chính tà**: chênh nhiều thì xung (tông chính-tà cấm), nhưng có thể thành "tình cấm".
- Tương hợp ảnh hưởng **tốc độ nảy tình**, **xác suất cãi vã**, **chất lượng song tu**, **bền hay rạn**. Hiển thị bằng chữ ("rất hợp", "hợp", "trái tính"), không hiện số.

### 5.3 Ở bên nhau: song tu, chung đường, thử thách
- **Song tu (bạn chốt)**: là một **buổi** (không phải hành động tháng nào cũng làm), tần suất **1 đến 2 lần mỗi năm**; chỉ khi hai người **cùng một địa điểm**. **Phần thưởng giảm dần theo số lần trong cùng một năm**: lần 1 nhận 100%, lần 2 nhận 60%, lần 3 trở đi chỉ 20% (và không có cơ hội thụ thai từ lần 3). Phần thưởng gồm tu +, đạo tâm +, ngộ +, kháng tâm ma +, tăng theo **tương hợp** và Tình. Nhân vật và NPC tự song tu **1 đến 2 lần mỗi năm** theo tính cách; bấm nút "Song tu" của người chơi là thúc đẩy (xem 9.3). Không còn là cách duy nhất có con (6.1).
- **Đồng hành**: đạo lữ có thể **đi cùng** (chung nơi ở, nhận việc cùng, có phần trong chuyến vượt vùng, hộ pháp đột phá +).
- **Thử thách chung** (sự kiện): hoạn nạn (bệnh, thương, nguy hiểm), cám dỗ (người thứ ba, quyền lực), chênh đường (một người đột phá, một người dừng), **chuyện nhà** (gia tộc phản đối), **tiền bạc** (nợ, đấu giá), **thiên kiếp** (người kia bị thương). Mỗi thử thách có chọn và **kết quả tình** (Tình và Tin tăng hay giảm).
- **Ở xa**: nhạt dần như cũ, nhưng có **thư tay** (sự kiện nhỏ) và ngưỡng nhạt dẫn tới chặng "người kia ở xa quá lâu".
- **Rạn nứt**: Tình hoặc Tin thấp liên tục, nghi ngờ, ghen, bí mật bị lộ; chặng "nói chuyện" (hòa) hoặc "chia tay"; không chia tay đột ngột như cũ.
- **Vĩnh biệt**: một người chết (thọ, chiến sự, thiên kiếp); chặng **tang** (đạo tâm lay, ký ức, di vật), có thể **dựng miếu**, **giữ di nguyện**, hoặc **theo người mất** (hiếm). Người còn sống nhận **dấu ấn** (tính cách đổi, có thể vào tuyến T9).

### 5.4 Hôn ước và chính trị gia tộc
- **Hôn ước** (`hon_uoc`): do cha mẹ, gia tộc, tông, triều đặt trước hoặc ép; có **người đặt**, **điều kiện** (đạt cảnh giới, tới tuổi), **hạn**, **sính lễ/hồi môn** (tài sản, vật phẩm, đất, liên minh).
- Hôn ước **sinh chuyện**: chấp nhận hay chạy trốn, từ hôn (Q 14.3 nối Từ hôn), liên hôn giữa hai tông hoặc hai gia tộc (ghi vào thế lực: quan hệ, hiệp ước mềm, chiến tranh dễ nổ hay dịu).
- **Ép gả/ép cưới** chỉ có khi **thế lực ép người chơi** (luôn có nhánh từ chối); người chơi **không** chủ động ép người khác.
- **Lễ kết đạo lữ**: lễ giản dị (hai người), lễ tông (tông chứng), lễ gia tộc (cả nhà), lễ thương hội (tiệc); mỗi kiểu ảnh hưởng thiện cảm tông/ gia tộc/ hội, chi phí vàng, danh vọng, và **Ơn của khách dự**.

### 5.5 Số đạo lữ, người thương, cùng giới
- **Một đạo lữ chính** tại một thời điểm; tình cảm khác là **người thương** (không danh phận, không lễ) hoặc **tri kỷ**. *(Khác hiện nay: nhiều đạo lữ ngang nhau.)*
- Cho phép **thêm đạo lữ phụ** nếu xuất thân/ thế lực/ tông/ đạo cho phép và **chấp nhận hậu quả** (ghen, tranh gia sản, tông chính đạo ghét). Mặc định: **1 chính, tối đa 2 phụ**.
- **Cùng giới (bạn chốt)**: **vẫn hiếm gấp 5** so với khác giới (hệ số nảy tình 0,2 như cũ); có thể kết đạo lữ bình thường khi xảy ra; con cái đi đường đan, kỳ ngộ, nhận nuôi (6.1).
- **Đạo lữ NPC có tự chủ**: có thể chủ động từ chối, rời đi, theo tông khác, theo đạo; không "thuộc về" người chơi.

## 6. Con cái: một đời người

### 6.1 Ý định, khả năng và thụ thai (đã chốt)
- **Tối đa 2 con trong cả đời, cộng chung mọi đạo lữ** (con ruột và con nuôi cộng chung). Đủ 2 thì không thụ thai nữa (hộp báo "cặp đã đủ con").
- **Khả năng thụ thai mỗi buổi song tu** (chỉ lần 1 và lần 2 trong năm có cơ hội): **cao nhất 10% rồi giảm dần về 1%** theo cảnh giới cao nhất của cặp:
  | Cảnh giới cao nhất của cặp | Phàm | Luyện Khí | Trúc Cơ | Kim Đan | Nguyên Anh | Hóa Thần trở lên |
  |---|---|---|---|---|---|---|
  | Xác suất mỗi buổi | 10% | 8% | 5,5% | 3,5% | 2% | 1% |
  - Cộng/trừ nhẹ theo **tiên thiên** (Long huyết, Phượng huyết, Thể mạnh +), **đan dược** (x1,5), **ý nguyện** ("mong có con": x1,5), **kỳ ngộ**; trần 15%, sàn 0,5%.
  - **Tính ước lượng**: 1 đến 2 buổi mỗi năm cho cặp Luyện Khí khoảng 12% mỗi năm → có con sau trung bình 8 năm; cặp Kim Đan khoảng 5% mỗi năm → trung bình 20 năm; cao thủ rất hiếm, nên con cái là **món quà quý**.
- **Ý định có con** (do **tính cách**, đạo đang theo, thọ nguyên): không muốn thì không thụ thai (không xảy ra), hai bên khác ý thì có chuyện nhỏ nói chuyện (hộp ngắn).
- **Nhận con nuôi** (cô nhi, đồ đệ nhỏ) vẫn là một nhánh, tính vào mức 2 con.
- **Cùng giới**: có con qua **đan và kỳ ngộ** hoặc **nhận nuôi**.
- **Điều kiện khác**: cùng chỗ khi song tu; tuổi người mang thai trong khoảng sinh nở (mở rộng theo cảnh giới).
### 6.2 Thai kỳ và sinh nở
- Thai kỳ **9 tháng** với **sự kiện nhỏ** (khỏe, yếu, đi xa, thuốc), **rủi ro** cho người mang thai ở cảnh giới thấp (có thể mất con hoặc nguy hiểm); tu sĩ cao gần như an toàn.
- **Tên, họ, thiên tượng**: con có "**điềm**" lúc sinh (dị tượng nếu tiên thiên Quý/Thiên), hiện trong nhật ký và có thể lên báo.
- **Sinh đôi** (hiếm), **sinh khó**, **mất con** là chuyện kể gián tiếp.

### 6.3 Các giai đoạn lớn lên (chạy theo tính cách, bạn chỉ quyết các điểm quan trọng)
Con **tự lớn lên theo tính cách của chính nó** (bốn trục Q 6, tiên thiên, xuất thân) và theo sim thế giới; người chơi **không** cần tham gia từng giai đoạn. Người chơi chỉ **gặp một hộp quyết định ở vài thời điểm quan trọng** (tối đa khoảng **5 quyết định cho mỗi đứa con**):
| Thời điểm | Tuổi | Quyết định (người chơi chọn) | Nếu không can thiệp |
|---|---|---|---|
| **Đặt hướng giáo dưỡng** | 6 đến 8 | chọn **phong cách** (6.4) | mặc định theo tính cách cha mẹ |
| **Vào tu hành** | 12 | gửi tông / tự dạy / truyền nghề / cho tự chọn | con theo tính cách tự chọn (hoặc ở với bạn) |
| **Nổi loạn hoặc lệch hướng** (nếu có) | 15 đến 22 | ngăn, tôn trọng, hoặc đuổi theo | con tự quyết, có thể bỏ nhà |
| **Lập nghiệp, kết đôi** | 20 đến 30 | giúp, can thiệp, hoặc thả | con tự đi đường riêng |
| **Thừa kế** | khi bạn mất | di chúc (6.6) | theo mặc định (năng lực, quan hệ) |
- **Hơn nữa không có**: không cần "dạy con", "chăm", "đưa đi thầy thuốc" từng việc; hai sự kiện cũ (**Dạy con**, **Chuyện nhà**) gộp thành **sự kiện thường ngày hiếm** tần suất thấp (không ép).
- Con là **NPC lõi** nhưng **chạy nền gọn** (chỉ cập nhật tại các mốc tuổi); chỉ con đang có chuyện thì chạy đầy đủ.

### 6.4 Giáo dưỡng: một quyết định ở một thời điểm
- Khi con **6 đến 8 tuổi**, hiện **một hộp** chọn **phong cách giáo dưỡng**, có hiệu lực **đến khi con trưởng thành** (không đổi được trừ biến cố lớn): **Nghiêm khắc** (Tu dưỡng +, Tính tình +, Kính cao Tình thấp, dễ nổi loạn), **Nuông chiều** (Tình cao, Tu dưỡng −, dễ ngạo), **Thả cho tự do** (Xử thế +, tự lập sớm), **Truyền nghề** (nối nghề cha mẹ, mất lựa chọn), **Gửi tông** (vào tông sớm, Kính tông cao hơn Kính cha mẹ).
- Hộp hiện gợi ý "hợp tính bạn / trái tính" (Q 6); chế độ tự động chọn theo tính cách bạn.
- **Tính cách của con** (Q 6): bốc từ **trung bình bố mẹ ±3**, đẩy theo giáo dưỡng và biến cố; **học theo** việc bố mẹ làm trước mặt (cha làm điều ác thì Đạo đức con giảm).
- **Tiên thiên của con** (Q 4.4 truyền thừa): Huyết 60%, Cốt 25%, Đồng 25%, Thể 30%, Mệnh 5%, Tâm 10%; phẩm giảm một bậc khi truyền (trừ khi cả hai cha mẹ cùng loại); **thức tỉnh sớm** nếu cha mẹ đã thức tỉnh.
- **Xuất thân của con** (Q 8): gia tộc của người chơi (nếu có), nhà đạo lữ, hoặc xuất thân mới theo nơi sinh.
### 6.5 Quan hệ cha mẹ với con (đổi theo thời gian)
- Các thanh Tình, Kính, Tin giữa bố mẹ và con đổi theo **thời gian bên nhau** (tăng), **vắng mặt dài** (giảm Tình, tăng Kính nếu lập công), **cách giáo dưỡng**, **sự kiện** (cứu con, bỏ rơi, hy sinh).
- **Nhãn quan hệ**: *Hiếu thảo*, *Thân thiết*, *Xa cách*, *Oán trách*, *Đối đầu*, *Nối nghiệp*, *Rời nhà*.
- **Con chống đối**: con thiếu niên hoặc thanh niên có thể **bỏ nhà**, **theo đường tà**, **chọn người bạn đời bạn cấm**; chặng giải quyết (ngăn, tôn trọng, đuổi theo); có thể mở tuyến T7/T9.

### 6.6 Con và người chơi (kế thừa)
- **Kế thừa khi bạn mất** (thay hộp hiện tại): người kế thừa nhận **nhiều thứ rõ ràng** (tài sản, di vật, công pháp để lại, nợ, thù, nghiệt duyên, tên tuổi, **tính cách** (15% ngấm), **tiên thiên truyền thừa**, **ký ức** theo bậc). Người chơi có **giao phó trước** (di chúc: chia tài sản, giao di vật cho ai).
- **Nhiều con**: **ai kế thừa** tính theo **quan hệ, năng lực, giáo dưỡng**, **tranh gia sản** (chặng), người đứng ngoài; không còn "người lớn nhất mặc định".
- **Con trở thành đối thủ hoặc thù** ở đời sau (kiếp sau gặp lại): lưu vào Sổ đời.
- **Gia tộc**: nếu người chơi **lập gia tộc** (Q A5), con cháu mang họ và có **thế lực gia tộc** (fac `gia` đã có): đời sau có xác suất sinh trong gia tộc đó.

### 6.7 Đồ đệ và con
- Giữ **sư đồ** tách (5 đồ đệ tối đa), thêm **ký danh**, **nội môn**, **đồ đệ cuối**; đồ đệ có thể **thành con nuôi** hoặc **người nối dõi**; tuyến Q (Nghiệt duyên) dùng sư đồ như dạng "đồ đệ là người từng bị lấy mắt".

## 7. Nhân duyên: dây duyên dẫn dắt ai gặp ai

### 7.1 Ý tưởng
- **Nhân duyên** = tập hợp **dây duyên** (`c.duyen`) bốc lúc sinh (và bổ sung ở các mốc), mỗi dây là **một vai người** có ý nghĩa với đời bạn, kèm **đồng hồ gặp** và **trạng thái**. Đây là **cơ chế nền cho "dàn nhân vật định mệnh"** của Q (13.3).
- **Dây duyên** `{ vai, npcId | null, hạn, nơi, trạng thái, dấu }`:
  - **Vai**: Đạo lữ, Tri kỷ, Bạn đồng hành, Sư, Đồ, Ân nhân, Đối thủ, Kẻ thù, Kẻ phản bội, Thân tộc, Nghiệt duyên, Người dẫn đường.
  - **Hạn gặp**: khoảng tuổi dự kiến (Đạo lữ ở 18 đến 40...).
  - **Nơi**: vùng hoặc loại nơi dễ gặp (thành trì, tông, thương đoàn, bí cảnh).
  - **Trạng thái**: *Chưa tới* → *Có dấu* (manh mối) → *Đã gặp* → *Thành* (thành quan hệ thật) hoặc *Đứt* (bỏ lỡ, người kia mất, chọn khác).
- **Số dây** bốc theo **tiên thiên Mệnh**, **xương sống**, **xuất thân**, và **khí vận**: thường 4 đến 7 dây mỗi đời (khoảng 2 tích cực, 1 nghiệt, còn lại trung tính); **Mệnh cô tinh** ít dây nhưng dây nặng.
- **NPC được dựng hoặc chọn** khi tới hạn: ưu tiên NPC thật gần (tương hợp cao); nếu không có thì **dựng người mới** ở nơi hợp lý với **tính cách, tiên thiên, xuất thân** hợp vai.

### 7.2 Người chơi thấy gì (bạn chốt: không hiển thị dây duyên)
- **Không có danh sách dây duyên** trong giao diện, cũng không có số dây ở Hồ sơ. Người chơi chỉ **nhận ra duyên qua chuyện xảy ra** (gặp người, giấc mơ, thầy tướng, tin đồn).
- **Có thể bỏ lỡ**: không đi tới nơi thì người kia đi hướng khác; **duyên không đứt hẳn** (vòng quay vận mệnh cho "tái ngộ" ở chặng cuối đời).
- **Đẩy duyên bằng điểm khí vận (Q 5): giấc mơ có lựa chọn.**
  - Thỉnh thoảng (khi một dây duyên tới gần hạn hoặc ở mốc tuổi), nhân vật **nằm mơ**; một hộp hiện **mô tả giấc mơ mơ hồ** (một đôi mắt, một tiếng đàn, một người đứng dưới mưa...) và **các lựa chọn**:
    - **"Theo giấc mơ"**: tiêu **điểm khí vận** để **dẫn tới đúng nơi và đúng lúc** cho dây duyên này (dây chuyển sang *Có dấu*, một nơi hiện trên bản đồ hoặc một lời mách; gặp sớm hơn).
    - **"Để mặc"**: không tốn, duyên tự đến theo thời gian (có thể bỏ lỡ).
    - **"Gạt đi"**: không tốn, **hạ xác suất** gặp dây này (dùng khi muốn né nghiệt duyên).
  - **Giá khí vận** theo vai: Đạo lữ 2; Tri kỷ, Sư, Ân nhân 2; Bạn đồng hành 1; Nghiệt duyên 3 (đẩy để **chủ động tìm** hoặc để **né**: né nghiệt duyên cũng tốn 3); Kẻ thù 2.
  - Hộp ghi rõ: "Theo giấc mơ sẽ tốn 2 trong 5 điểm khí vận."; chế độ tự động **không** tự tiêu khí vận cho giấc mơ (chỉ khi bạn bật quy tắc).
  - **Tần suất**: tối đa 1 giấc mơ mỗi 3 đến 5 năm, không trùng vòng quay vận mệnh.
- **Với Q**: tuyến truyện lấy vai từ dây duyên; một NPC có thể giữ **nhiều vai** theo thời gian (Q 13.3); quyết định của bạn **đổi vai** (ơn thành tình, tình thành oán).
### 7.3 Các loại "duyên"
- **Thiên duyên** (Mệnh tốt): gặp đúng lúc, tình sâu.
- **Nghiệt duyên** (Q 11.1): nợ thân thể/mạng; hội ngộ theo đồng hồ.
- **Cơ duyên** (kỳ ngộ): quý nhân dẫn đường, tặng vật.
- **Phận duyên** (do hành động): bạn tự tạo (kết nghĩa, nhận nuôi), không do mệnh.

## 8. Nội dung và sự kiện (khối lượng dự kiến)
| Nhóm | Số chặng ước | Ghi chú |
|---|---|---|
| Đạo lữ (gặp, mến, tỏ tình, hôn ước, lễ, thử thách, rạn nứt, tang) | 28 | thay `rel_to_tinh`, `rel_ghen`, `fam_gia_dinh` |
| Con cái (thai, sơ sinh, thơ ấu, thiếu niên, thanh niên, chống đối, tranh gia sản) | 30 | thay `fam_day_con`, mở rộng |
| Sư đồ, kết nghĩa, tri kỷ | 14 | thay `rel_nhan_do`, `rel_ket_nghia` |
| Thù, tình địch, đối thủ, tha thứ | 12 | nối Q (thiếu chủ, báo thù) |
| Dây duyên (dấu, gặp, bỏ lỡ, tái ngộ) | 16 | cơ chế chung |
| **Tổng** | **~100 chặng** | mỗi chặng 80 đến 150 chữ, 2 đến 4 lựa chọn |
- Các chặng dùng **cùng khung Q** (tuyến, chặng, hạn, nhân quả, tính cách, vòng quay vận mệnh). **Mô hình quan hệ (4), đạo lữ (5), con cái (6) làm được độc lập**; dây duyên (7) cần khung tuyến của Q1.

## 9. Giao diện

### 9.1 Tab "Gia đình" và "Quan hệ" gộp thành "Nhân duyên"
Hai tab hiện nay trùng nhau. Bố cục mới:
1. **Vòng thân cận** (thẻ lớn): Đạo lữ chính, con cái, đồ đệ, tri kỷ; mỗi thẻ có tên, loại, **giai đoạn**, **3 thanh** (Tình, Tin, Kính), chip Ơn/Oán, tình trạng (ở đâu, làm gì), nút hành động.
2. **Nút hành động** (xem 9.3): nhân vật **tự làm theo tính cách**; nút chỉ để **thúc đẩy** khi bạn muốn; các nút **đổi theo loại và giai đoạn** (ví dụ giai đoạn Mến có "Tặng quà", "Mời đi chơi"; giai đoạn Tình có "Tỏ tình"; đã Hứa có "Cầu hôn", "Chọn lễ"; đã Kết có "Song tu", "Bàn chuyện con").
3. (Bỏ: không hiển thị dây duyên. Chỉ có **giấc mơ** thỉnh thoảng, 7.2.)4. **Gia phả**: cây ngắn (cha mẹ, bạn, đạo lữ, con, cháu), màu theo tình trạng; bấm một người xem chi tiết.
5. **Sổ quan hệ rộng**: danh sách đầy đủ, lọc theo loại và tình trạng, thu gọn.
- **Thẻ người** có **dòng thời gian** nhỏ của mối quan hệ (gặp, mến, kết, thử thách, rạn).
- **Hồ sơ nhân vật**: ô "Nhân duyên" tóm tắt.
- **Nhật ký**: thẻ "Người" đã có; thêm biểu tượng theo loại (tim, nhẫn, chiếc nôi, thanh kiếm).
- **Hộp quyết định**: nhãn quan hệ, giai đoạn, thanh chính, kèm **chấm hợp/không hợp tính** (Q 6).

### 9.2 Hiển thị thanh và nhãn
- Thanh Tình/Tin/Kính có màu riêng (hồng, xanh, vàng), nhãn chữ theo dải; Ơn và Oán là chip có số.
- Giai đoạn đạo lữ là một **thanh bước** (Gặp, Mến, Tình, Hứa, Kết, Bền).

### 9.3 Nút hành động và lệnh ưu tiên thấp (bạn chốt)
- **Mặc định nhân vật tự làm** theo **tính cách** (Q 6) và **giai đoạn**: Điềm tĩnh + Đạo đức cao thì hay tặng quà, tâm sự; Nóng nảy thì hay cãi; Tu dưỡng cao thì hay song tu đúng 1 đến 2 lần mỗi năm... Người chơi **không cần bấm** để quan hệ tiến triển.
- **Nút thúc đẩy** ở thẻ người vẫn có và **đổi theo giai đoạn** (tặng quà tăng Tình, tâm sự tăng Tin, nhờ giúp, mời đi cùng, tỏ tình, cầu hôn, song tu, bàn chuyện con, hòa giải, cắt đứt có xác nhận). Mỗi nút ghi **kết quả dự kiến nhỏ** và **giá** (vàng, thời gian).
- **Cần cùng một địa điểm** để làm với NPC. Nếu người chơi bấm nút khi **chưa cùng chỗ**, nhân vật **ghi một lệnh** `c.intents = [{ loại, đích, từ tháng, hạn }]` và **sẽ cố gắng đến tìm NPC** để làm (**ưu tiên thấp**, sau đột phá, nhiệm vụ cấp bách, chuyến đi đang chạy): nếu gặp được trong thời hạn (mặc định 6 tháng) thì làm; không thì tự hủy và ghi nhật ký "Chưa tìm được ...".
- **Giới hạn**: tối đa 2 lệnh cùng lúc; lệnh trùng thì gộp; NPC không ở được (đã mất, đang vượt vùng) thì báo ngay.
- **Hạn chế lợi dụng**: mỗi hành động có **thời gian hồi** (tặng quà 3 tháng, song tu theo 5.3), nên bấm liên tục không giúp.
- **NPC cũng có lệnh tương tự** (theo tính cách), nên chuyện đôi bên đều chủ động.
## 10. Cân bằng và kỹ thuật

### 10.1 Cân bằng
- **Đạo lữ**: mục tiêu ~60% người chơi tới Kết đạo lữ trong đời khi chơi chủ động; ~35% khi Tự động mặc định; chia tay ≤ 25% cặp; vĩnh biệt do thọ nguyên theo cảnh giới.
- **Con cái** (tối đa 2, xác suất 10% giảm về 1% mỗi buổi song tu, 1 đến 2 buổi mỗi năm): mục tiêu khoảng 70% người chơi Luyện Khí có ít nhất 1 con trước tuổi 60; Trúc Cơ khoảng 45%; Kim Đan khoảng 20%; Nguyên Anh trở lên dưới 10% (bù bằng đan, kỳ ngộ, nhận nuôi). Đo bằng `story-sim`.
- **Chi phí máy**: chiều sâu chỉ cho cặp **thân thiết** (tối đa ~15 người mỗi nhân vật lõi), NPC thường chạy bản gọn như cũ; dây duyên chỉ cho **người chơi** và **nhân vật định mệnh**.
- **Nhịp hỏi**: chặng quan hệ nằm trong **ngân sách thường ngày** (Q 14.4), ưu tiên thấp hơn chuỗi; giữ ≤ 6 hộp/phút.
- **Sức mạnh**: lợi ích song tu cộng nhẹ (±10%), con cái không phải nguồn sức mạnh chính (nhưng là nguồn **truyền thừa** và truyện).

### 10.2 Kỹ thuật
- Dữ liệu: `js/data/bonds.js` (`D.BOND`: loại, giai đoạn, thanh, nhãn dải, hệ số, bảng tương hợp), `js/data/lovestory.js` (chặng đạo lữ), `js/data/kidstory.js` (chặng con cái), `js/data/duyen.js` (vai, hạn, nơi).
- Hệ: `TT.bond` (thanh, giai đoạn, chuyển loại, nhãn), `TT.love` (giai đoạn, tương hợp, hôn ước, lễ), `TT.kid` (ý định, thai, giai đoạn, giáo dưỡng, thừa kế), `TT.duyen` (bốc dây, gặp, đứt, dựng NPC); thay dần `family.js` (giữ hàm cũ làm vỏ tương thích).
- Lưu: mở rộng `world.rel[key]` bằng `d` (`{ love, trust, respect, debt, st, since, tags }`); `c.duyen`, `c.kidPlan`; khởi tạo muộn; bản lưu cũ **chuyển một lần**: `love` hiện có vào `d.love`, `k` cũ vào loại mới, đạo lữ cũ thành **chính** (từ người thứ hai là **phụ**), con cái cũ gán giai đoạn theo tuổi. Không đổi `TT.VERSION`.
- UI: `js/ui/family.js` viết lại thành "Nhân duyên", thêm `js/ui/bond.js`; `people.js` gộp vào.
- Kiểm thử: thanh và tăng giảm; chuyển loại; giai đoạn đạo lữ từ gặp tới vĩnh biệt; tương hợp; hôn ước và từ hôn; ý định và xác suất thụ thai theo cảnh giới; thai kỳ; giai đoạn con; giáo dưỡng đổi tính cách; kế thừa; dây duyên (bốc, gặp, bỏ lỡ, dựng NPC); chuyển bản lưu cũ; lưu/tải; nhịp; cân bằng (Trúc Cơ+ giữ).

## 11. Các chặng làm (đề xuất)
- [ ] **R0** duyệt kế hoạch; chốt mục 12.
- [ ] **R1** mô hình quan hệ (4): thanh, loại, giai đoạn, chuyển bản lưu cũ, nhãn và thẻ; kiểm thử.
- [ ] **R2** đạo lữ (5): hành trình, tương hợp, hôn ước, lễ, song tu mới, thử thách, rạn nứt, tang; viết khoảng 28 chặng.
- [ ] **R3** con cái (6): ý định, khả năng, thai kỳ, giai đoạn, giáo dưỡng, tính cách và xuất thân của con, quan hệ cha mẹ-con, di chúc và kế thừa; viết khoảng 30 chặng.
- [ ] **R4** nhân duyên (7): dây duyên, dấu, gặp, bỏ lỡ, dựng NPC, nối vai với Q.
- [ ] **R5** giao diện Nhân duyên (gộp Quan hệ và Gia đình), gia phả, nút hành động.
- [ ] **R6** nội dung còn lại: sư đồ, kết nghĩa, thù, tình địch, đối thủ (khoảng 26 chặng); tinh chỉnh.
- [ ] Mỗi chặng: kiểm thử, đo cân bằng bằng mô phỏng, chơi thử máy tính và điện thoại, cập nhật KE-HOACH.md, snapshot.

## 12. Cần bạn chốt (đã chốt phần lớn ở mục 1.1; còn lại có mặc định)
Đã chốt: bỏ chênh lệch tuổi; cùng giới hiếm gấp 5; song tu 1 đến 2 lần mỗi năm, giảm thưởng; xác suất con 10% về 1%; tối đa 2 con cho mọi đạo lữ; tham gia chuyện con chỉ ở quyết định quan trọng; giáo dưỡng là một quyết định; đẩy duyên bằng giấc mơ và khí vận; nút hành động là thúc đẩy ưu tiên thấp, cần cùng địa điểm; không hiển thị dây duyên.

Còn mở (mặc định đã ghi, bạn sửa nếu muốn):
1. **Số đạo lữ**: 1 chính + tối đa 2 phụ (có hậu quả), giữ nhiều đạo lữ ngang nhau, hay chỉ 1 duy nhất? *(mặc định: 1 chính + 2 phụ)*
2. **Thai kỳ có rủi ro** (mất con, nguy hiểm ở cảnh giới thấp), kể gián tiếp: ổn không? *(mặc định: ổn)*
3. **Xác suất 10% đến 1%** là **mỗi buổi song tu** (lần 1 và 2 trong năm), đúng ý bạn chưa? *(mặc định: mỗi buổi)*
4. **Hôn ước và ép cưới**: chỉ thế lực ép người chơi (có nhánh từ chối), người chơi không chủ động ép ai: ổn không? *(mặc định: ổn)*
5. **Năm quyết định cho mỗi đứa con** (giáo dưỡng 6-8 tuổi, vào tu hành 12, nổi loạn, lập nghiệp, thừa kế): ổn không? *(mặc định: ổn)*
6. **Di chúc và thừa kế** (chọn trước ai nhận gì; chỉ 2 con nên đơn giản): ổn không? *(mặc định: có, mặc định theo năng lực và quan hệ)*
7. **Giấc mơ đẩy duyên** (7.2): giá 1 đến 3 khí vận, tối đa 1 giấc mỗi 3 đến 5 năm: ổn không? *(mặc định: ổn)*
8. **Gộp tab Quan hệ và Gia đình** thành "Nhân duyên": ổn không? *(mặc định: gộp)*
9. **Đạo lữ NPC tự chủ** (có thể rời, từ chối): ổn không? *(mặc định: ổn)*
10. **Thứ tự làm**: R1 đến R3 độc lập nên làm ngay, R4 (dây duyên, giấc mơ) sau Q1 (khung tuyến) và Q0b (tiên thiên, khí vận). Làm R trước hay Q0b trước? *(mặc định: Q0b trước, rồi Q1a, rồi R1 đến R3)*
## 13. Nhật ký làm việc
- 2026-10-18 (bản 2): theo ý bạn: bỏ chênh lệch tuổi 30, cùng giới hiếm gấp 5, song tu 1 đến 2 lần mỗi năm (giảm thưởng khi nhiều), xác suất con 10% về 1%, tối đa 2 con, chuyện con chỉ ở quyết định quan trọng, giáo dưỡng là một quyết định, đẩy duyên bằng giấc mơ và khí vận, nút hành động là lệnh ưu tiên thấp cần cùng địa điểm, không hiển thị dây duyên.
- 2026-10-18: bạn nói hệ nhân duyên chưa rõ ràng, nhất là đạo lữ và con cái, muốn thiết kế lại thành kế hoạch riêng. Khảo sát code hiện có (`relations.js`, `family.js`, `social.js`, `famevents.js`, `ui/family.js`, song tu trong `cultivation.js`), viết kế hoạch bản 1, chưa code.

## 14. Kết quả và việc để sau
(Điền khi xong.)
