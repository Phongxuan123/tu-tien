# F2 và F4: nghĩa vụ giữa các thế lực, và dân số ẩn theo vùng

- Trạng thái: Đã code lõi (2026-10-17): F4.1 đến F4.4, F2.1 đến F2.3, hiển thị ở Nha môn và Điện chưởng môn. Còn lại: nhiệm vụ thế lực, sơ đồ vẽ hiệp ước, F5 (xem mục 11)
- Ngày lập: 2026-10-17
- Liên quan: F-hoan-thien-the-gioi.md (mục 3, 4: chỗ trống số 2 và số 4), E-kinh-te.md (kinh tế cần nguồn cung và cầu thật), M-tong-mon.md (M5b liên tông dùng lại F2), G-nhat-bao.md (tin tức), `js/systems/factions.js`
- Thứ tự đề nghị: **F4 làm trước** (dân số là nền), rồi **F2** (nghĩa vụ lấy thuế, lính, cống từ dân số), rồi nối vào E, M5b, G.

## 1. Mục tiêu
- **F4:** mỗi vùng có dân số ẩn (không mô phỏng từng người) làm nguồn thuế, nguồn lính, nguồn tư chất mới và nguồn cầu cho kinh tế. Dân số đổi theo sinh, tử, di cư, chiến tranh, thiên tai, thời đại, và có "dân tâm" quyết định loạn hay yên.
- **F2:** các thế lực (vương triều, tông, gia tộc, thương hội) ràng buộc nhau bằng **hiệp ước có nghĩa vụ thật**: thuế, cống, bảo hộ, chư hầu, minh ước, trưng binh. Không giữ nghĩa vụ thì oán tích lại, dẫn tới đoạn tuyệt, nổi loạn, chiến tranh. Người chơi thấy và chạm được tới các ràng buộc này.
- Giữ nguyên nguyên tắc: **cấp năm**, mô phỏng rẻ (400 năm game dưới 1 giây), tất định theo hạt giống, lưu bằng trường khởi tạo muộn (không đổi `TT.VERSION`).

## 2. Hiện trạng (đọc code `factions.js`, `world.js`, `regions.js`)
Đã có và dùng lại được:
- Mỗi thế lực: `power`, `unity`, `wealth` (0-100), `tag` (chính/trung/tà), `leader`, `state`, `war`, `ally` (tối đa 2), `vassal` (chỉ ghi lúc thua, **không có hiệu lực**), quan hệ cặp `rel` (-100..100), `infl` (ảnh hưởng của hội), biên niên `chron`.
- Vòng năm: `tickInternal`, `tickRelations` (kết đồng minh), `declareWars` (lý do ngẫu nhiên), `tickWars`, `endWar` (thua thì `vassal = win.id`, "phải nộp cống" chỉ là câu chữ), `destroy`, `rebuilds`, `spawnClans`.
- Thương hội: `infl` với triều và tông, bị triều tịch thu, bị tông cắt hàng, cho vay thời chiến, môi giới hòa nghị.
- Tông (M5a): linh mạch, mỏ, kho = `wealth`, cống nạp cố định 2 điểm kho mỗi năm cho triều mạnh; chiếm mỏ khi thắng trận.
- Vùng có `birth` (trọng số nơi sinh của người chơi và NPC mới), `analog` mô tả kiểu dân số, `rich`, `linh`, `danger`. **Chưa có** dân số, thuế, lính, dân tâm; thế giới 9 vùng nhưng chỉ vùng người chơi ở có NPC sống.

Chỗ trống: `vassal` vô nghĩa; đồng minh không có nghĩa vụ; thuế và cống là hằng số; triều "mạnh" chỉ vì chỉ số `power` chứ không vì dân và lính; không có hậu quả khi bỏ nghĩa vụ; người chơi không thấy hay can thiệp được.

## 3. F4: dân số ẩn theo vùng

### 3.1 Dữ liệu
`world.fac.pop[rid] = { n, mood, food, mig, last }` (khởi tạo muộn lúc có `world.fac`):
- `n`: dân số, đơn vị **vạn người** (chỉ để tính, hiển thị bằng chữ "đông", "vừa", "thưa").
- `mood`: dân tâm 0-100 (50 yên, dưới 30 bất mãn, dưới 15 loạn).
- `food`: mùa màng 0-100 của năm vừa rồi (ảnh hưởng sinh và tử).
- `mig`: di cư ròng năm vừa rồi (để hiển thị).
Số khởi đầu `D.POP[rid] = { n0, cap, birth, death }` (tự đặt, chỉnh ở `js/data/population.js`):
| Vùng | n0 (vạn) | Sức chứa cap | Sinh/năm | Gợi ý theo `analog` |
|---|---|---|---|---|
| Trung Châu | 1200 | 1500 | 1,2% | đông, già, sinh thấp |
| Đông Hải | 800 | 1000 | 2,0% | nhiều ngư dân |
| Tây Thiên Sơn | 300 | 400 | 1,4% | thưa, du mục |
| Nam Lâm | 700 | 900 | 2,6% | trẻ, sinh cao |
| Bắc Cực | 60 | 90 | 0,8% | rất thưa |
| Hỏa Diệm Sơn | 350 | 450 | 1,4% | thợ mỏ, thợ rèn |
| Hoang Mạc | 400 | 500 | 1,9% | du mục |
| Vụ Trạch | 650 | 800 | 2,2% | đông, nghèo |
| Lôi Đảo | 150 | 220 | 1,2% | ít, sống dưới thiên tai |

### 3.2 Công thức mỗi năm (`TT.fac.popYearly`, gọi trong `fac.yearly`)
```
tai = (n / cap)                        // mức chật; 1 là đầy
sinh = n x birth x (0,6 + 0,4 x food/100) x (1 - 0,5 x max(0, tai - 0,8))
tu   = n x (death + 0,01 x (1 - food/100) + chiến sự x 0,02 + dịch x 0,03 + gánh nặng thuế x 0,005)
mig  = tổng chênh lệch (mood, tai) giữa vùng kề (theo D.EDGES, có thương đoàn thì nhiều hơn) x 0,3%
n    = n + sinh - tu + mig
mood = mood + (50 - mood) x 0,08 - thuế x 0,4 - chiến sự x 3 + (food - 55) x 0,05 + sự kiện (thịnh thế +1, loạn thế -1)
food = 55 + nhiễu +-18 + (hợp thời tiết vùng) - thiên tai (hạn, lũ, bão)
```
- Thiên tai và dịch bệnh là **cú sốc có tên** như `shocks` của thương hội (thêm `kind: 'han' | 'lu' | 'dich'`), lên biên niên và Nhật báo, kéo dài 1-3 năm.
- Vùng đang có chiến sự mất 1-3% dân mỗi năm và tăng di cư sang vùng kề (cùng cạnh `EDGES`).
- Hạn trên và dưới: `n` trong [0,25 n0, 1,3 cap]; vùng không bao giờ về 0.

### 3.3 Dân số làm gì (đầu ra)
1. **Thuế gốc** của triều: `Tt = n x thuế_suất x (0,5 + mood/100) x hiệu_quả(unity)`. Cộng vào `wealth` của triều (thay cho trôi ngẫu nhiên) và là nguồn cho hiệp ước F2.
2. **Lính** của triều: `quân = n x tỉ_lệ_lính` (3% bình thường, 6% thời chiến); đóng góp vào `strength()` trong `tickWars` thay cho phần `power` thuần túy: triều đông dân thì mạnh, nhưng lính tốn thuế và làm giảm `mood` khi bị trưng nhiều.
3. **Nguồn tư chất mới:** `birth` của vùng cho người chơi và NPC mới nhân với `clamp((n / n0)^0,5, 0,6, 1,6)`; vùng đông thì sinh nhiều NPC lõi mới hơn và người chơi dễ sinh ra ở đó hơn. Giữ tổng xác suất đã chuẩn hóa, không đổi cân bằng chung.
4. **Cầu cho kinh tế (E):** `cầu(vùng) = n x phồn hoa`, `cung lao động = n x (1 - lính)`; E lấy trực tiếp con số này làm quy mô thị trường thay vì hằng số.
5. **Dân tâm thấp:** dưới 30 thì tăng xác suất cướp, bạo loạn, nổi dậy của gia tộc, thương đoàn bị cướp nhiều hơn (nối với `guard` hội), nguy hiểm vùng +1 theo năm; dưới 15 thì "bạo loạn" có thể làm triều đổi chủ hoặc tách vùng; trên 70 thì thịnh, tông nhận đệ tử dễ hơn (kho tông và `joinCooldown` giảm).
6. **Tông và dân:** số đệ tử nuôi được ~ `cap_tông = 6 + 3 x mạch + n_vùng / 200`; tông nằm ở vùng đông dân tuyển đệ tử dễ (mùa tuyển ra nhiều hơn).

### 3.4 Người chơi thấy gì
- **Nha môn** (thành trì): "Dân số vùng: đông/vừa/thưa, đang tăng/giảm; dân tâm: yên/bất mãn/loạn; thuế suất; số lính".
- **Dải môi trường dưới bản đồ:** thêm một dòng nhỏ khi có thiên tai, dịch, mất mùa, loạn.
- **Biên niên sử và Nhật báo:** "Mất mùa ở Nam Lâm, dân tâm bất mãn"; "dịch bệnh lan ở Vụ Trạch"; "dân Đông Hải di cư sang Trung Châu".
- Mức chính xác của số liệu phụ thuộc thông tin bạn có (đi qua vùng, có đọc Nhật báo); vùng lạ chỉ hiện "chưa rõ".

### 3.5 Các chặng F4
- [ ] F4.1 Dữ liệu `js/data/population.js`, `TT.fac.pop` khởi tạo muộn, `popYearly` (sinh, tử, di cư, mood, food, thiên tai). Kiểm thử: quy mô ổn định theo thời gian, tất định, lưu và tải.
- [ ] F4.2 Thuế gốc vào `wealth` triều; lính vào `strength`; chiến tranh mất dân và di cư tị nạn. Đo lại: số cuộc chiến mỗi 100 năm, số diệt vong (mục tiêu giữ trong khoảng đã đo: khoảng 52 chiến tranh mỗi 300 năm, 10 diệt vong).
- [ ] F4.3 Nơi sinh và NPC mới theo dân số (chuẩn hóa tổng); đo lại phân bố cảnh giới NPC theo tư chất (Trúc Cơ+ ~2%/5%/18%).
- [ ] F4.4 Dân tâm thấp gây loạn, nguy hiểm, cướp; thiên tai và dịch; đưa vào tin tức và biên niên sử.
- [ ] F4.5 Giao diện: dịch vụ Nha môn, dòng dưới bản đồ, tooltip vùng ở Đại địa đồ.

## 4. F2: nghĩa vụ giữa các thế lực

### 4.1 Mô hình hiệp ước
`world.fac.pacts = [{ id, kind, a, b, rate, since, until, strain, note }]`
- `a`: bên gánh nghĩa vụ; `b`: bên hưởng. `rate`: mức (tỉ lệ hoặc điểm). `strain`: oán (0-100), tăng khi bên `a` không trả được hoặc bị ép quá đáng; giảm khi trả đủ và khi `b` bảo hộ tốt.
Các loại (`D.PACT[kind]`):
| kind | a gánh | b hưởng và phải làm gì | Nguồn tự sinh |
|---|---|---|---|
| `thue` Thuế | gia tộc và thương hội nộp triều trong vùng | triều giữ trị an, mở đường, không tịch thu bừa | gia tộc mới, hội có chi nhánh |
| `cong` Cống nạp | tông nộp triều | triều bảo hộ tông khi có giặc ngoài, không đàn áp; tông giữ trung lập hoặc ủng hộ | mặc định mọi tông trong vùng triều |
| `bao_ho` Bảo hộ | thế lực yếu | thế lực mạnh che chở trong chiến tranh, đổi lại phần của cải | thế lực yếu gặp nguy (power thấp) |
| `chu_hau` Chư hầu | bên thua trận | bên thắng thu cống (15-30% thuế hoặc kho) trong N năm, cấm tự đánh bên khác không xin | thay cho `vassal` rỗng của `endWar` |
| `minh_uoc` Minh ước | hai bên | tham chiến cho nhau, chia sẻ mỏ và đường, thông thương | thay `ally` (giữ tối đa 2) |
| `trung_binh` Trưng binh | tông, gia tộc | triều gọi đệ tử ra trận (nay là sự kiện triệu tập), đổi lại danh phận | thời chiến |
| `hon_uoc` Thông gia | hai bên | tăng `rel` và `unity`, kế vị gắn kết | hiếm, khi kết đồng minh sâu |

### 4.2 Giải quyết mỗi năm (`TT.fac.pactYearly`)
```
trả = rate x năng_lực_của_a (wealth, dân tâm vùng của a, thời đại)
nếu trả đủ: b.wealth += trả x hiệu_suất; a.wealth -= trả; strain giảm 3
nếu thiếu (a.wealth thấp, hoặc a bị ép): trả một phần, strain += 6..12
bên b làm tròn bổn phận (bảo hộ, trị an): nếu b bỏ mặc a lúc có chiến sự: strain += 10, quan hệ giảm
strain >= 60: a "bất tuân": ngừng trả, đăng tin; b có thể trừng phạt (đánh a, tăng thuế, tịch thu mỏ)
strain >= 85: đoạn tuyệt (hủy hiệp ước), quan hệ -30, lý do chiến tranh mới "bất tuân cống" (thêm vào REASONS)
```
- Cống của tông hiện cố định 2 điểm kho (M5a) được thay bằng `cong.rate` = `0,03 + 0,10 x (triều.power - tông.power)/100`, kẹp trong [0,02; 0,15] của kho.
- `chu_hau` tự hết hạn sau 8-20 năm hoặc khi chư hầu mạnh lại thì đòi tự chủ (chiến tranh độc lập).
- Số hiệp ước đồng thời giới hạn (mỗi thế lực tối đa 1 `cong`/`thue` đi, 2 `minh_uoc`, nhiều `chu_hau` đến) để dễ đọc và rẻ.

### 4.3 Hệ quả lên chiến tranh và thế cục
- `declareWars`: thêm lý do và xác suất từ hiệp ước (bất tuân cống, đòi tự chủ, bảo hộ đồng minh); đồng minh `minh_uoc` bắt buộc tham chiến với xác suất theo `strain` thấp (trước là 60% cố định).
- `endWar`: thua thì sinh `chu_hau` hoặc `bao_ho` thật; thắng có thể thu cống và mỏ (nối `spoils` của tông).
- Triều đổi chủ thì hiệp ước của triều cũ với các tông và gia tộc **chuyển sang triều mới nhưng `strain` đặt lại ở mức cao**.
- Tông bị diệt, gia tộc suy tàn: hủy hiệp ước liên quan.

### 4.4 Người chơi thấy và chạm được
1. **Thấy:** Nha môn (triều, thuế suất, chư hầu, đồng minh, các hiệp ước trong vùng), Điện chưởng môn (hiệp ước của tông: cống, bảo hộ, trưng binh, oán), sơ đồ thế giới (`so-do-the-gioi.html`) vẽ thêm các đường hiệp ước; biên niên: "Thanh Vân Tông ngừng nộp cống vì kho cạn".
2. **Chạm:**
   - **Triệu tập và trưng binh** (đã có sự kiện) gắn với hiệp ước `trung_binh`: từ chối thì tông và triều ghi oán, danh vọng đổi.
   - **Thuế cửa ải và thuế chợ:** giá mua nhân `1 + thuế_suất_vùng x 0,15` (nhỏ), hiện ở Nha môn; chiến sự hoặc dân tâm thấp thì thuế cao (nối E).
   - **Nhiệm vụ của thế lực** (hệ nhiệm vụ A, giao bởi "thế lực"): hộ tống đoàn thu cống, đòi nợ cống, dẹp loạn, làm sứ giả đưa quốc thư (có ở bảng Ngoại vụ), môi giới hòa nghị.
   - **Chọn phe:** người chơi là đệ tử tông đang bất tuân triều thì lựa chọn: ủng hộ tông, khuyên tông cống, hay chạy; làm chưởng môn (M6) quyết định nộp hay chống.
   - **Hồ sơ quan hệ F5:** mỗi thế lực lưu một số điểm "tín nhiệm" với bạn (cộng khi giúp nghĩa vụ, trừ khi phản), hiện ở tab Hồ sơ.

### 4.5 Các chặng F2
- [ ] F2.1 Mô hình `pacts`, `D.PACT`, sinh hiệp ước ban đầu (cong, thue, minh_uoc từ `ally`, chu_hau từ `vassal`), bài kiểm thử cân đối và lưu/tải.
- [ ] F2.2 `pactYearly`: trả, thiếu, strain, bất tuân, đoạn tuyệt; thay cống 2 điểm cố định của tông; đo lại cân bằng thế giới.
- [ ] F2.3 Nối `declareWars` và `endWar` (lý do mới, chư hầu thật, đồng minh bắt buộc theo oán); tin tức và biên niên.
- [ ] F2.4 Người chơi: sự kiện trưng binh theo hiệp ước, thuế vào giá, nhiệm vụ thế lực, Nha môn và Điện chưởng môn hiện hiệp ước.
- [ ] F2.5 Sơ đồ thế giới vẽ hiệp ước, F5 tín nhiệm theo thế lực ở Hồ sơ.

## 5. Tương tác F4 và F2
- Thuế = `n x thuế_suất x (0,5 + mood/100)`; hiệp ước `thue` và `cong` lấy từ cùng nguồn.
- Chiến tranh giảm `n` và `mood`, tăng di cư; hiệp ước `chu_hau` làm bên thua mất thuế nên dân tâm xấu thêm, dễ nổi loạn đòi tự chủ.
- Thiên tai giảm `food` và thuế thu được, làm `strain` tăng, có thể kéo đổ cả chuỗi (mất mùa, trễ cống, bị trừng phạt, loạn).
- Thế lực có hạn (lính, thuế) nên chiến tranh không còn vô tận như một con số `power` thuần.

## 6. Kiểm thử và chỉ tiêu
- Tất định theo hạt giống; lưu/tải giữ nguyên dân số và hiệp ước; thế giới cũ tự khởi tạo ở năm kế.
- Dân số mọi vùng nằm trong [0,25 n0; 1,3 cap] sau 400 năm với 20 hạt giống; không có vùng chết.
- Số liệu thế giới sau thay đổi phải giữ trong cùng khoảng như mục 18 của nhật ký gốc (khoảng 52 chiến tranh và 10 diệt vong mỗi 300 năm; triều đổi chủ 0-16 lần), có thể lệch +-25%.
- Cân bằng NPC: phân tầng Trúc Cơ+ giữ ~2%/5%/18% theo tư chất; nhịp hỏi người chơi vẫn dưới 6 lần/phút (hiệp ước chỉ thêm sự kiện qua kênh sẵn có, tầng 2).
- Hiệu năng: 400 năm dưới 1 giây (hiện dưới 1 giây).
- Bài kiểm thử đề xuất (`tests.html`): dân số ổn định, thiên tai làm giảm food và mood, thuế vào triều đúng công thức, hiệp ước tự sinh đủ, trả thiếu tăng strain, bất tuân tới đoạn tuyệt sinh chiến tranh, chư hầu hết hạn, đồng minh bị oán thì bỏ cuộc, người chơi từ chối trưng binh có hậu quả.

## 7. Rủi ro và cách giảm
| Rủi ro | Cách giảm |
|---|---|
| Lệch cân bằng thế giới (quá nhiều hoặc quá ít chiến tranh) | Đo ngay sau F4.2 và F2.3; mọi hệ số ở `D.POP`, `D.PACT`, chỉnh được |
| Quá phức tạp, người chơi không đọc được | Chỉ hiện ở Nha môn và Điện chưởng môn bằng vài dòng; sơ đồ chi tiết để ở `so-do-the-gioi.html` |
| Cộng dồn sự kiện làm nhịp hỏi tăng | Sự kiện mới đều qua kênh tầng 2 có sẵn, giữ trần ngân sách nhịp |
| Dân số và thuế làm kinh tế E khó viết | F4 chỉ cung cấp `n`, `mood`, `thuế`; E đọc, không ngược lại |
| Bản lưu cũ | Trường khởi tạo muộn; hiệp ước tự sinh ở năm đầu sau khi tải |

## 8. Cần bạn chốt
1. **Thứ tự:** F4 trước rồi F2 như đề nghị, hay làm F2 trước (không cần dân số, dùng `wealth`)?
2. **Mức hiển thị:** dân số và thuế hiện chữ ("đông", "yên") hay có số cụ thể (vạn người, phần trăm thuế)?
3. **Người chơi có bị thuế trực tiếp không?** Đề xuất: không trừ tiền thẳng, chỉ thấy qua giá cả và phí cửa ải (nhỏ), để không thêm việc vặt.
4. **Người chơi can thiệp mạnh đến đâu?** Chỉ qua sự kiện và nhiệm vụ (đề xuất), hay có thêm hành động chủ động ở Nha môn (nộp hộ thuế, vận động giảm thuế, môi giới hiệp ước)?
5. **Chư hầu và minh ước:** có cho người chơi (khi làm chưởng môn ở M6) ký hiệp ước, hay chỉ NPC ký?
6. **Phạm vi vùng:** chỉ mô phỏng dân số và hiệp ước cho 9 vùng cấp năm (rẻ, đề xuất), hay có thêm chi tiết theo địa điểm (thôn, thành)?

## 9. Ước lượng công việc
F4: 5 chặng nhỏ (khoảng 1,5 lượt làm việc: dữ liệu và sim, hiệu ứng và đo, giao diện). F2: 5 chặng (khoảng 2 lượt: mô hình, giải quyết, nối chiến tranh, người chơi, sơ đồ). Sau đó E (kinh tế) và M5b (liên tông) dùng lại dữ liệu này nên ngắn hơn.

## 10. Nhật ký làm việc
- 2026-10-17: đọc `factions.js` (thế lực, hiệp ước còn thiếu, `vassal` rỗng), viết kế hoạch F4 và F2, chưa code.

## 11. Đã làm (2026-10-17) và chỗ khác với kế hoạch
Bạn duyệt "như trên là được", và nói hai phần này chủ yếu để hoàn thiện thế giới, làm nền cho tiền tệ về sau. Nên làm **nền ở phía sau, hiển thị nhẹ**: người chơi chỉ thấy chữ ở Nha môn, Điện chưởng môn, biên niên sử; không bị trừ tiền thẳng; không thêm hành động chủ động. Các câu 2, 3, 4, 6 ở mục 8 mình chọn theo đề xuất (chữ không số; không thuế trực tiếp; chỉ qua sự kiện, nhiệm vụ sau; chỉ cấp vùng). Câu 1: làm F4 trước rồi F2. Câu 5 (người chơi ký hiệp ước) để M6.

**F4 đã code:** `js/data/population.js` (D.POP, D.POP_RULES), `js/systems/population.js` (TT.pop).
- Dân số, dân tâm, mùa màng theo vùng, lưu ở `world.pop` (khởi tạo muộn, không dùng số ngẫu nhiên khi khởi tạo). Mỗi năm: thiên tai mới (hạn, lũ, dịch; lên biên niên), sinh, tử (cân bằng quanh mức khởi đầu, đã tính hao do thiên tai và chiến tranh), di cư qua các tuyến liền kề, dân tâm, nổi loạn khi dân tâm dưới 20 (triều mất đoàn kết và sức mạnh, có xác suất bị lật đổ).
- Thuế kéo kho vương triều về mức theo dân số và dân tâm (`taxPull`); quân số nhân vào sức mạnh triều khi đánh nhau (`milMul`); vùng đông dân sinh nhiều người mới hơn (`birthMul`, trần 0,6 đến 1,6) trong chọn nơi sinh; dân tâm dưới 30 thì vùng nguy hiểm thêm 1.
- Hiển thị: dịch vụ Nha môn thêm dòng "Dân số vùng đông/vừa/thưa, đang tăng/giảm; dân tâm ...; thiên tai đang có".
- Đo (12 hạt giống, 300 năm): dân số dao động quanh 66 đến 106% mức khởi đầu; số chiến tranh trung bình 59,5 so với 61,3 khi tắt hẳn (không lệch cân bằng thế giới); mô phỏng khoảng 260 ms cho 300 năm.

**F2 đã code:** `js/systems/pacts.js` (TT.pact), `world.fac.pacts` và `world.fac.rifts`.
- Hiệp ước tự sinh khi thế giới chạy lần đầu: Cống nạp (mỗi tông cho vương triều trong vùng, mức theo chênh sức mạnh, thay cống cố định của M5a), Thuế (gia tộc cho triều), Chư hầu (thật, sinh ở `endWar` khi thua, 8 đến 20 năm), Minh ước (đồng bộ từ danh sách đồng minh), Bảo hộ (tông rất yếu xin tông mạnh che chở, phí bảo hộ).
- Mỗi năm: bên gánh trả điểm kho, thiếu thì oán tăng, oán 60 trở lên thì bất tuân (ngừng trả, bên mạnh có thể trừng phạt), 85 trở lên thì đoạn tuyệt (ghi mối rạn nứt trong 6 năm, quan hệ -40) làm chiến tranh dễ nổ gấp 2,2 lần và ghi lý do "bất tuân hiệp ước ..." hoặc "đòi tự chủ"; chư hầu hết hạn thì tự chủ; bên hưởng bỏ mặc khi bên gánh lâm chiến thì thêm oán, che chở đủ thì cộng sức mạnh.
- Đồng minh giúp nhau theo oán của minh ước (xác suất 0,25 đến 0,9 thay cho 0,6 cố định).
- Hiển thị: Nha môn liệt kê hiệp ước trong vùng và tình trạng (êm thấm, có oán, căng thẳng, bất tuân); Điện chưởng môn liệt kê hiệp ước của tông.
- Kiểm thử: bài "Dân số ẩn (F4) và hiệp ước (F2)" (dân số khởi đầu, hiệp ước ban đầu, 300 năm trong khoảng, mô tả thiên tai, thuế, nơi sinh, bất tuân tới đoạn tuyệt, chư hầu, minh ước, lưu/tải).

**Chưa làm (xếp sau):** nhiệm vụ do thế lực giao theo hiệp ước (hộ tống thu cống, đòi nợ cống...), thuế vào giá cả (chờ E), sơ đồ thế giới vẽ hiệp ước, F5 tín nhiệm của người chơi với từng thế lực, trưng binh gắn hiệp ước, thuế thương hội, thông gia. Hội chưa có hiệp ước thuế (dùng `infl` sẵn có), E sẽ bổ sung.