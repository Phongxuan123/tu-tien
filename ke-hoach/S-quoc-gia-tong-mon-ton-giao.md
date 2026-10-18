# S. Quốc gia, Tông môn hiện đại và Tôn giáo (bản gộp S + T)

- Trạng thái: Chờ duyệt (bản 2, đã gộp S và T, đã gộp các quyết định của bạn ngày 2026-10-18; chưa code)
- Ngày lập: 2026-10-18
- Nội dung sự kiện và chuỗi sự kiện của hệ này nằm ở [Q-cot-truyen](Q-cot-truyen.md) **mục 24** (theo ý bạn). Giáo sĩ và Thần Chức đạo cũng ở Q mục 24.
- Liên quan: [P-nghia-vu-dan-so](P-nghia-vu-dan-so.md) (dân số, hiệp ước: nền của hệ này), [M-tong-mon](M-tong-mon.md) (tông môn, M5b), [KICH-BAN-THE-GIOI](../KICH-BAN-THE-GIOI.md), [N-tai-nguyen-ban-do](N-tai-nguyen-ban-do.md), [E-kinh-te](E-kinh-te.md), [G-nhat-bao](G-nhat-bao.md), [I-cong-trinh](I-cong-trinh.md) (nơi thờ tự), [R-nhan-duyen](R-nhan-duyen.md), `js/data/sects.js`, `js/systems/sect.js`, `js/systems/factions.js`, `js/systems/pacts.js`, `js/systems/population.js`

---

## Mục lục
1. Yêu cầu và quyết định đã chốt
2. Hiện trạng
3. Nguyên tắc chung
4. Phần A: Mạng quan hệ nhiều chiều của mọi thế lực
5. Phần B: Quốc gia (quốc vận, nho khí, quân đội và quân trận, triều chính, quốc sách)
6. Phần C: Tông môn hiện đại hóa (giá trị, công–tội, chỉ số, chính sách, bộ máy, chín nguyên mẫu sâu)
7. Phần C2: Gia tộc, thương hội, vương triều theo nguyên mẫu
8. Phần D: Tôn giáo
9. Phần E: Liên thông M5b (liên tông)
10. Kỹ thuật, cân bằng, kiểm thử
11. Các chặng làm (hợp nhất)
12. Rủi ro
13. Còn lại cần bạn chốt
14. Nhật ký làm việc
15. Kế hoạch triển khai S1 (sẵn sàng code)

---

## 1. Yêu cầu và quyết định đã chốt

**Yêu cầu gốc của bạn**
1. Hệ thống **quốc gia**: quốc vận, nho khí, **sức mạnh đặc biệt của quân đội** (đối kháng được tu sĩ nhưng khó), và các ý tưởng khác; **liên thông với M5b**; làm **quan hệ chi tiết của tất cả thế lực**.
2. Các tông môn **hiện đại hơn**, lấy **nguyên mẫu từ các quốc gia có thật** (không nước nào thuần thiện hay thuần ác), kèm một hệ thống **tôn giáo**.

**Đã chốt (2026-10-18)**
| # | Quyết định |
|---|---|
| 1 | "Hiện đại" là **hỗn hợp có chọn lọc**: thể chế, kinh tế, thông tin, ngoại giao hiện đại, thêm vài thứ như ngân phiếu, bưu truyền, hộ tịch, y quán, viện nghiên cứu, quỹ tương trợ; **không** có súng, xe, điện, mạng. Thẩm mỹ vẫn tu tiên. |
| 2 | **Giữ tên kiểu cổ trang** như Đan Các, Khí Các, Tàng Kinh Các, Chấp Pháp Đường. Hiện đại ở chức năng, không ở tên gọi. |
| 3 | Bỏ nguyên mẫu Triều Tiên và Singapore (chưa đặc trưng); thay bằng nước khác (mục 6.5). |
| 4 | Làm **sâu hơn**: mỗi nguyên mẫu có hồ sơ 12 mục (thể chế, kinh tế, quân sự, khoa học, văn hóa, ngoại giao, thông tin, giá trị, công–tội, bí mật, tình thế khó xử, chính sách). |
| 5 | **Âm Hồn Giáo** vẫn là thế lực u tối, **nghiêng về ác** nhưng không thuần ác (có công thật, có nét người). |
| 6 | Gia tộc dùng nguyên mẫu **tài phiệt, thương gia, thế gia học thuật**; thương hội gợi từ **đô thị thương mại cổ**; vương triều đồng bộ bản sắc với bảng nguyên mẫu. |
| 7 | **Tên tôn giáo/tín ngưỡng dùng tên thật** cho quen thuộc (Phật giáo, Thiên Chúa giáo, Hồi giáo, Ấn Độ giáo, Đạo giáo, Nho giáo, thờ cúng tổ tiên, Thần đạo, tín ngưỡng dân gian). Số tín ngưỡng theo ngoài đời. |
| 8 | Tôn giáo là **lớp phủ** nhưng có **nơi thờ tự, chùa chiền**, tôn giáo mạnh nhất vùng có đại điện. **Mỗi vùng chỉ 3 tôn giáo cùng lúc**; một số **lồng nhau được** (thờ tổ tiên với Phật giáo...), **Thiên Chúa giáo không lồng**. |
| 9 | **Giáo sĩ** và **Thần Chức đạo** chuyển sang **Q mục 24** để làm sau cùng truyện. |
| 10 | **Thêm sự kiện và chuỗi sự kiện nặng đô** vào Q (mục 24). |
| 11 | Thanh trừng nội bộ tông: **có, hiếm** (mặc định, bạn không đổi). |
| 12 | **Gộp S và T** thành một bản kế hoạch (file này). |

---

## 2. Hiện trạng (đọc code `sects.js`, `sect.js`, `factions.js`, `pacts.js`, `population.js`)
- **Vương triều** (9): chỉ có `power`, `unity`, `wealth`, `tag`, `leader`, `state`; không bao giờ diệt, thua trận thì đổi chủ (reset chỉ số).
- **Tông môn** (9): `align` ba giá trị (`chinh`, `trung`, `ta`): 5 chính, 3 trung, 1 tà. `align` đang được dùng ở điều kiện gia nhập, trục xuất ("hành vi tà ác"), cộng trừ thiên hướng, tag quan hệ (cùng tag +10, chính tà -22). Mỗi tông đã có tôn chỉ, luật, tuyệt học, 4 đường (M1), tài nguyên (M5a), phố 9 công trình (M7).
- **Dân số (F4)** và **hiệp ước (F2)** đã có: cống, thuế, chư hầu, minh ước, bảo hộ, oán (`strain`), bất tuân, đoạn tuyệt.
- **Quan hệ**: mỗi cặp thế lực chỉ một số `rel` (-100..100) kèm `ally` (tối đa 2). Không có lý do, lịch sử, nhiều chiều.
- **Chiến tranh**: sức mạnh = `power x unity x wealth x milMul`; không có tướng, quân chủng, trận pháp.
- **Chưa có**: quốc vận, văn hóa, tôn giáo, giá trị tông ngoài chính/tà, thể chế, chính sách, thông tin/tình báo, nơi thờ tự. M5b chưa làm.

Vấn đề cốt lõi: thang chính/tà một chiều khiến Âm Hồn Giáo là "ác" còn năm tông chính là "thiện" ngay từ đầu; triều chỉ là ba con số; thế giới thiếu lớp tín ngưỡng; người chơi không đọc được vì sao hai bên ghét nhau.

---

## 3. Nguyên tắc chung
1. **Cấp năm, rẻ, tất định theo hạt giống**; mô phỏng không đụng vòng NPC. Mục tiêu 400 năm game dưới 1 giây (hiện khoảng 260 ms cho 300 năm).
2. **Trường mới khởi tạo muộn, không đổi `TT.VERSION`**; thế giới cũ tự dựng ở năm kế.
3. **Tương thích ngược**: `relV`, `relAdd`, `ally`, `vassal`, `align`, `power` giữ nguyên giao diện để code và kiểm thử cũ chạy; phần mới đọc thêm.
4. **Giữ chỉ tiêu cân bằng đã đo**: khoảng 52 chiến tranh và 10 diệt vong mỗi 300 năm (±25%), nhịp hỏi người chơi dưới 6 lần mỗi phút, phân tầng NPC Trúc Cơ+ khoảng 2%, 5%, 18%.
5. **Không nước nào, tông nào, tôn giáo nào thuần thiện hay thuần ác**: mỗi bên có công và tội thật (riêng Âm Hồn Giáo nghiêng về ác). Cái "xấu" lấy từ **đặc điểm cấu trúc** (tập quyền thì dễ kiểm duyệt, mở cửa thì dễ bất bình đẳng), không từ sự kiện thời sự thật.
6. **Tên**: quốc gia, tông, hội, gia tộc, triều trong game là **nội dung gốc, tên giả, tên cổ trang**. Chỉ **tôn giáo** dùng tên thật. Các nước thật chỉ nằm trong tài liệu này như nguyên mẫu thiết kế, không xuất hiện trong chữ của game.
7. **Tôn giáo thật được viết tôn trọng**: game mô tả chúng như cơ chế xã hội (đóng góp, căng thẳng), không phán đúng sai về niềm tin, không lấy cả một tôn giáo làm phản diện; "kẻ cực đoan" luôn là một cá nhân hoặc một phái, không phải cả tôn giáo.
8. **Người chơi không điều khiển nước hay tông** ở đợt này (làm chưởng môn, làm vua thuộc M6). Người chơi vào cuộc qua sự kiện, nhiệm vụ, nghề (Q mục 24).

---

## 4. Phần A: Mạng quan hệ nhiều chiều của mọi thế lực (nền cho mọi phần sau)

**Phạm vi:** mọi thế lực sống: 9 vương triều, 9 tông, 8 gia tộc, 3 thương hội (khoảng 29, tối đa khoảng 406 cặp, chỉ lưu cặp có chuyện). Tôn giáo là lớp phủ nhưng **ba giáo hội lớn nhất** cũng vào ma trận như một nút (mục 8.7).

**Bản ghi một cặp** (`world.fac.rel2["a|b"]`):
| Chiều | Ý nghĩa | Nguồn |
|---|---|---|
| `tinh` Thiện cảm | Cảm xúc chung (thay `rel` cũ) | mọi thứ cộng dồn |
| `loi` Lợi ích | Chung lợi hay tranh lợi (mỏ, thương mại, địa bàn, long mạch) | tài nguyên, hội, vùng |
| `dao` Đạo thống | Hợp hay khắc về giá trị và tín ngưỡng | độ gần của hai bộ `gt` (6.1), quốc giáo (8), nho khí |
| `cua` Kiêng dè | Sợ hay coi thường | so sánh sức mạnh, tướng, quân trận |
| `thong` Thông gia / huyết thống | Hôn nhân chính trị, con tin, họ hàng | `hon_uoc`, sự kiện, R |
| `an_oan` Sổ ân oán | Danh sách sự kiện có năm: cứu, phản, giết, nợ, nhục, hòa | chiến tranh, hiệp ước, nhiệm vụ |
| `nghia` Nghĩa vụ | Các hiệp ước đang có giữa hai bên | F2 |
| `tin` Tín nhiệm | Đối phương có giữ lời không | `pacts.strain`, lịch sử bất tuân |

**Bậc quan hệ** hiển thị (suy ra từ tổng hợp; chiều đậm nhất quyết định lời mô tả): Đồng minh, Thân hữu, Hòa hảo, Trung lập, Lạnh nhạt, Bất hòa, Thù địch, Tử thù; cộng nhãn hiệp ước: Chủ, Chư hầu, Bảo hộ, Cống, Thông gia.

**Số tổng hợp (giữ tương thích):** `relV(a,b) = clamp(tinh + 0,3 x loi + 0,3 x dao + 0,2 x thong + ân_oán, -100, 100)`. `relAdd(a, b, n, chiều?, lý do?)` nhận thêm chiều và lý do (mặc định `tinh`).

**Sổ ân oán:** mỗi cặp tối đa 12 mục `{năm, loại, mức, lời}`; chiến tranh, hòa nghị, hiệp ước, giúp đỡ, phản bội, diệt người đứng đầu, ám sát, thôn tính, thánh chiến đều ghi. **Thù truyền đời** giảm chậm hơn nhiều và tồn tại sau khi người đứng đầu đổi.

**Hiển thị:** ma trận 29 x 29 tô màu (lọc theo loại); bấm một ô để xem **hồ sơ cặp** (bậc quan hệ, các chiều, sổ ân oán theo năm, hiệp ước, chiến tranh đã qua); hồ sơ từng thế lực (bạn, thù, chủ, chư hầu, liên minh); `so-do-the-gioi.html` vẽ thêm đường ân oán và hiệp ước.

**Lợi ích:** `declareWars` chọn đối thủ theo nhiều chiều và có lý do rõ; tin tức nêu đúng nguyên do ("hai nhà thù nhau từ năm 41 vì vụ mỏ"); người chơi đọc được thế cờ.

---

## 5. Phần B: Quốc gia

### 5.1 Khái niệm: "Quốc" là vương triều có thêm thân thể
Mỗi vương triều (9) có khối `nat` (`world.fac.nat[id triều]`):
| Trường | Ý nghĩa | Miền |
|---|---|---|
| `van` | **Quốc vận** (khí số của cả nước) | 0-100 |
| `nho` | **Nho khí** (văn trị, chính khí) | 0-100 |
| `quan` | **Quân lực** (quân số, phẩm, tướng, trận) | xem 5.4 |
| `sat` | **Sát khí** của quân | 0-100 |
| `chinh` | **Triều chính** (hoàng quyền, phe phái, kế vị) | xem 5.5 |
| `sach` | **Quốc sách** (chính sách với tu sĩ, quốc giáo) | chọn từ danh sách |
| `mach` | **Long mạch** (linh mạch quốc thổ, nối N) | 0-5 |
| `faith` | **Quốc giáo** và `khoan` (khoan dung 0-100) | mục 8 |
`power` cũ **không bỏ**, nhưng được **suy ra** từ các trường này với hệ số bù (mục 10).

### 5.2 Quốc vận
| Bậc | Quốc vận | Mô tả |
|---|---|---|
| Rồng bay | 80+ | Quốc thái dân an, ít thiên tai, vua tôi đồng lòng |
| Thịnh | 60-79 | Ổn định, thu thuế tốt |
| Bình | 35-59 | Bình thường |
| Suy | 15-34 | Thiên tai nhiều, dân bất mãn, triều lục đục |
| Mạt | dưới 15 | Sắp mất mệnh |

- **Tăng:** dân tâm cao, mùa màng tốt (F4); nho khí cao; người đứng đầu có đức tài (`de`, `tai`); thắng trận chính nghĩa; giữ lời hiệp ước; long mạch tốt; thời đại Thịnh thế hoặc Linh khí phục hồi; quốc giáo được lòng dân (mục 8).
- **Giảm:** thiên tai, dịch, nổi loạn, dân tâm thấp; bại trận, mất đất, bị thần phục; hôn quân, gian thần, thuế nặng; phá hiệp ước; **tu sĩ làm loạn phàm triều**; nội chiến, cướp ngôi; đàn áp tôn giáo quá tay.
- **Tác dụng:** (1) nhân vào sức mạnh quân; thiên tai nhẹ đi, dân tâm hồi nhanh khi vận cao. (2) Ở nước vận Thịnh trở lên, may mắn nền của nhân vật tăng nhẹ, nhiệm vụ triều thưởng cao hơn; ở nước vận Mạt, nguy hiểm vùng +1. (3) **Thiên mệnh:** quốc vận dưới 15 trong 3 năm liên tiếp thì mất mệnh: đổi chủ (đã có), **chia cắt** (một triều tách thành hai nửa yếu), hoặc **bị thôn tính** (thành `chu_hau` thật, nối F2). Thế giới luôn còn đủ 9 vùng có chủ.
- **Phản phệ quốc vận (cơ chế cân bằng cốt lõi):** tu sĩ giết vua, đánh tan quân triều, tàn sát phàm dân, phá long mạch thì **bị phản phệ**: nghiệp tăng, đạo tâm tổn, khó đột phá một thời gian, tu vi thụt; mức tỉ lệ với quốc vận của nước đó và độ lớn việc đã làm (có trần). Đây là lý do tu sĩ cao không thống trị phàm giới. Nước vận Mạt thì gần như hết phản phệ nên dễ bị tông thao túng. Có cảnh báo trước và cách chuộc (việc thiện, tế lễ).
- **Long mạch:** cắt long mạch (nhiệm vụ rất nguy hiểm) giảm mạnh quốc vận, kèm phản phệ lớn; giữ long mạch tốt thì vận hồi nhanh.

### 5.3 Nho khí
Nho khí là sức mạnh **văn trị và chính khí** (thư viện, khoa cử, lễ nghĩa), **đối trọng** của tà khí, yêu khí, sát khí.
- **Quy mô nước (`nho`):** tăng nhờ thư viện, khoa cử đều (3 năm một khoa), quan liêm, người đứng đầu hiếu học, Thịnh thế; giảm nhờ chiến loạn, "văn cấm" (đốt sách), quan tham, mất mùa kéo dài.
- **Tác dụng:** làm **vận vững**; **chính khí trấn tà** (âm khí, tà thuật bị trừ hiệu lực ở thành trì nước nho cao; Âm Hồn Giáo là đối nghịch tự nhiên); **vùng cấm đánh nhau trong thành** (động thủ trong thành bị phạt nặng hơn, nối truy nã); mở **quan chế** cho người chơi; giảm lính cần nuôi (quan văn giỏi giữ được dân tâm). Nho khí cao cũng **thúc đẩy thế tục hóa**: giáo hội phản ứng (mục 8).
- **Văn vị và Hạo nhiên khí (cá nhân):** `van` 0 Dân thường, 1 Đồng sinh, 2 Tú tài, 3 Cử nhân, 4 Tiến sĩ, 5 Đại nho, 6 Thánh nhân (truyền thuyết). Văn vị cao cho `hao` (hạo nhiên khí): tăng đạo tâm nền, chống tâm ma, giảm tác hại tà thuật, tăng sức thuyết phục (ngoại giao, hòa nghị). Ở đợt này là **bổ trợ** cho mọi người, **không** phải đường tu riêng. Có thể đưa thành đường riêng ở bản sau (Q mục 24 có tuyến Nho sĩ).

### 5.4 Quân đội và Quân trận (sức mạnh đặc biệt)
**Mục tiêu:** quân phàm **đối kháng được tu sĩ nhưng khó, và trả giá nặng**. Không vô địch, không vô dụng.

```
quân_số = n x tỉ_lính                             (F4; 3% bình thường, 6% thời chiến)
phẩm    = 0,6 (dân binh) đến 1,6 (tinh binh)
trận    = bậc quân trận đã học (0..3)
sat     = sát khí 0..100 (tích từ chiến thắng, hao khi nhàn rỗi)
CL      = q x phẩm x (1 + 0,5 x trận) x (1 + 0,3 x sat/100) x (0,7 + 0,6 x quốc_vận/100) x tiếp_tế
```
`q` là số lính ra trận (chặn bởi chiến trường và số lính có).

**Bảng lính tương đương một tu sĩ** (khởi điểm, chỉnh ở `D.NATION.unit`):
| Cảnh giới | Chiến lực quân cần (CL) | Ghi chú |
|---|---|---|
| Luyện Khí | 5 | Một đội nhỏ |
| Trúc Cơ | 60 | Tiểu đội có tướng |
| Kim Đan | 2.000 | Cần quân trận cơ bản, thương vong lớn |
| Nguyên Anh | 30.000 | Đại quân tinh binh + đại trận + soái ấn + quốc vận Thịnh; thắng cũng thảm |
| Hóa Thần | 400.000 | Gần như cả đạo quân một nước lớn; sát khí và quốc vận cực đại; dùng một lần là nước đó khó gượng dậy |
| Phi Thăng | không | Phàm quân không thể |
(Trung Châu khoảng 12 triệu dân, 3% lính là 36 vạn, nên chỉ nước lớn nhất mới dồn nổi cho một Hóa Thần.)

**Quân trận** (tăng bậc): 1 **Hợp Kích Trận** (cơ bản), 2 **Sát Khí Trận** (gom sát khí hàng nghìn người thành một đòn), 3 **Quốc Vận Đại Trận** (gắn quốc vận, mở một lần mỗi N năm).

**Tu sĩ đối phó quân:** ám sát tướng, đốt lương, phá trận nhãn (giảm `trận`, `tiếp tế`, `sat`); tránh trận mở (địa hình núi, rừng, đầm, đảo giảm `trận`: Vụ Trạch, Nam Lâm, Lôi Đảo, Tây Thiên Sơn có lợi cho tu sĩ); pháp bảo, đại trận hộ sơn của tông cộng vào "lính tương đương" của tông; và **phản phệ quốc vận** là ràng buộc.

**Quân đối phó tu sĩ:** quân trận; khí giới đặc thù (nỏ liên châu, pháo tụ linh, kiếm trận; nơi kỹ nghệ cao như Hỏa Diệm Sơn thì mạnh); **tướng tu sĩ** (triều cung phụng hoặc thu biên tu sĩ làm tướng, quân sư: chỗ tông và triều liên thông); thiên thời (vận Thịnh nhân thêm, vận Mạt thì trận tự rã).

**Hậu quả khi dùng quân trận chống tu sĩ:** thương vong lớn theo hệ số lính tương đương, `mood` giảm, `sat` hao, ngân khố hao, đôi khi mất tướng. Thắng tu sĩ lớn thì được **uy danh** (quốc vận lên, tông ngần ngại) nhưng sinh **thù truyền đời** với tông đó (ghi sổ ân oán).

**Bản sắc quân từng nước** nằm ở 7.3 (hải quân, sơn binh, kỵ binh, hỏa khí...).

### 5.5 Triều chính, quốc sách và các ý tưởng khác
1. **Triều chính (ưu tiên cao):** hoàng quyền (0-100) đối trọng với quyền thần, thế gia, tông môn. Kế vị (thái tử, tranh ngôi, loạn cung đình). Hoàng quyền yếu thì quyền thần hoặc tông thao túng, quốc vận tụt dần. Gắn `leader` và `succession` hiện có.
2. **Quốc sách với tu sĩ (cao):** **Tự do** (thuế thấp, dễ loạn); **Thu biên/cung phụng** (tu sĩ làm quan, tướng; triều mạnh, tông bất mãn); **Hạn chế** (đăng ký tu sĩ, cấm tư đấu trong thành, có truy nã); **Trấn áp** (săn tà tu, ép cống nặng; dễ nổ chiến tranh). Đổi hiếm, hậu quả dài.
3. **Quốc giáo (cao):** mỗi nước một quốc giáo và mức khoan dung (mục 8); đồng bộ với bản sắc nước.
4. **Gián điệp và mật thám (trung):** mạng tình báo, tung tin đồn, ly gián, nằm vùng; nối Nhật báo (G).
5. **Ngoại giao, sứ giả, hôn nhân chính trị, con tin (trung):** hoàn thiện `hon_uoc` của F2; nghề sứ giả cho người chơi.
6. **Khoa cử và quan chế (trung):** đường làm quan cho phàm nhân (huyện, châu, triều); nối B (nghề), Q mục 24.
7. **Biên phòng và cửa ải (thấp):** ải ở tuyến liền kề có quân đồn trú, mở/siết/đóng theo quan hệ; nối thuế cửa ải (E).
8. **Thiên hạ đại thế (thấp):** thôn tính được 2 vùng thì có danh "bá chủ"; thống nhất thiên hạ cực khó, gắn thời đại.
9. **Lễ nghi, tế lễ (thấp):** tế trời, tế long mạch, đổi niên hiệu; sự kiện định kỳ cộng quốc vận hoặc lộ điềm báo.

### 5.6 Chiến tranh tổng (đại chiến chưa từng có)
Engine hiện tại có chiến tranh hai bên (kèm đồng minh), 1 đến 8 năm, tối đa vài cuộc cùng lúc. Một số biến cố cần **chiến tranh tổng**:
- Đa bên (6 đến 9 thế lực chia hai hay ba phe), **nhiều chiến tuyến** (3 vùng trở lên), kéo dài **10 đến 18 năm**, chia **pha** (điềm báo, tối hậu thư, chiến tuyến mở, bước ngoặt, hòa nghị, hậu chiến).
- Có thể **đổi luật chơi**: ví dụ Đại chiến Phù Lệnh (Q 24.5b) làm phù phổ cập, quân phàm dùng phù chống tu sĩ (bậc `trận` tăng, bảng lính tương đương ở 5.4 hạ).
- Chỉ xảy ra **tối đa một lần mỗi thế giới** (kịch bản ẩn bốc theo hạt giống), **không tính vào chỉ tiêu** 52 chiến tranh và 10 diệt vong mỗi 300 năm (đo riêng); dân vùng chiến sự giảm có trần (khoảng 25%).
- Kết thúc bằng hòa nghị lớn, có hậu quả dài (tông chia đôi, thời đại đổi, hiệp ước mới).

---

## 6. Phần C: Tông môn hiện đại hóa

### 6.1 Thay thang "chính–tà" bằng nhiều trục giá trị
Mỗi tông có `gt` (giá trị), 5 trục từ -100 đến +100:
| Trục | Đầu âm (-100) | Đầu dương (+100) |
|---|---|---|
| `tu` | Tự do, phân quyền | Trật tự, tập quyền, kỷ luật |
| `ca` | Cá nhân trên hết | Cộng đồng trên hết |
| `doi` | Giữ truyền thống | Đổi mới, nghiên cứu |
| `mo` | Khép kín, tự lực | Mở cửa, thương mại |
| `tin` | Thế tục, thực dụng | Tín ngưỡng, thần quyền |
Thêm trục **hành vi** `nhan` (nhân đạo +100 ⟷ tàn nhẫn -100): **không gán nhãn** cho tông mà **đổi theo việc tông làm** (thanh trừng, nô dịch, cứu trợ, tàn sát, giúp dân), hiển thị bằng lời mô tả công–tội. Một tông có thể tốt hôm nay, xấu mai.

**Người chơi và NPC:** `rep.chinh` được giữ cho nhật ký, thêm hồ sơ giá trị `gt` hình thành từ lựa chọn. Tông nhận hay đuổi người dựa vào **độ hợp giá trị**: hợp thì gia nhập dễ, thiện cảm sẵn; lệch ít thì bị để ý, việc nhạy cảm không giao; lệch nhiều thì không nhận, hoặc bị nghi nằm vùng và bị trục xuất khi lộ.

**Tương thích:** `align` cũ giữ như **nhãn suy ra** từ `gt` (và `nhan`) cho code và kiểm thử cũ; chuyển dần mọi chỗ dùng `align` sang `gt` ở chặng S2.

### 6.2 Bảy chỉ số và năm chính sách (mỗi tông như một quốc gia thu nhỏ)
| Chỉ số (0-100) | Ý nghĩa |
|---|---|
| `kt` Kinh tế | Của cải, tài nguyên, thương mại |
| `qs` Quân sự | Lực lượng chiến đấu, trận pháp |
| `kh` Khoa học pháp thuật | Nghiên cứu, luyện đan, luyện khí, công pháp mới |
| `vh` Văn hóa mềm | Uy tín, sức hút, ảnh hưởng tư tưởng |
| `ng` Ngoại giao | Liên minh, mạng lưới, đàm phán |
| `on` Ổn định nội bộ | Đoàn kết; thấp thì dễ nổi loạn (nối M4 hoãn) |
| `tt` Thông tin | Tình báo, truyền thông, kiểm soát tin đồn |
`power` được suy ra từ đây (hệ số bù).

Năm **chính sách** (mỗi cái chọn một, đổi hiếm và đắt):
1. **Thể chế:** tập quyền chưởng môn; hội đồng trưởng lão; bầu cử trong hàng ngũ; thần quyền; thế tập.
2. **Kinh tế:** kế hoạch; thị trường tự do; hỗn hợp; tự lực khép kín; dựa tài nguyên.
3. **Quân sự:** thường trực tinh nhuệ; nghĩa vụ toàn tông; thuê ngoài; chỉ phòng thủ.
4. **Đối ngoại:** bành trướng; liên minh; trung lập; cô lập; buôn bán.
5. **Nhân tài:** thi tuyển; huyết thống; mở cửa; bảo lãnh và tiến cử.
`law` hiện có (cảnh cáo, phạt, trục xuất) vẫn là luật ứng xử của đệ tử; chính sách là đường lối của cả tông, quyết định hệ số nhiệm vụ, tuyển người, đường lên chức, đối ngoại.

### 6.3 Bộ máy hiện đại, tên cổ trang (bạn chốt giữ tên)
Giữ **4 đường M1** và thêm thân thể; mỗi cơ quan là công trình trong phố tông môn (M7) có dịch vụ thật.
| Đường/cơ quan | Chức năng hiện đại hơn | Thêm |
|---|---|---|
| **Chấp Pháp Đường** | An ninh, pháp chế | Điều tra, tòa nội bộ, giám sát (nối `tt`) |
| **Đan Các** | Viện nghiên cứu dược và đan | Đề tài, công pháp mới, quỹ nghiên cứu |
| **Khí Các** | Viện chế tác, kỹ nghệ | Xưởng, khí giới, sản xuất hàng loạt, tiêu chuẩn |
| **Trận Các** | Viện trận pháp | Thiết kế đại trận hộ sơn, quân trận |
| **Phù Các** | Viện phù lục | Dòng "Chuẩn phù" (Kim Phong, cần phù căn) và "Lôi phù" (Tử Lôi); chế phù, kiểm định, độc quyền công thức. Cần xem lại `sect: 'ld_tu_loi'` của nghề bùa trong `craft.js` khi làm |
| **Tàng Kinh Các** | Học cung và thư khố | Đào tạo, tuyển chọn, kiểm duyệt hay cởi mở |
| **Ngoại Vụ Đường** | Ngoại giao và thương vụ | Đại sứ, thương hội, hộ chiếu cửa ải |
| **Tài Các** | Kinh tài: kho, thuế, ngân phiếu | Phát hành ngân phiếu tông, quyên góp, nợ, quỹ tương trợ |
| **Thiên Cơ Các** | Tin tức và truyền thông | Bảng tin tông, tin ra Nhật báo (G) |
| **Mật Các** | Tình báo | Nằm vùng, chống gián điệp (nối `tt`) |
| **Y Quán** | Y tế | Chữa bệnh, chống dịch, tị nạn |
Tông nào cũng không có đủ mười; **mỗi tông có 5 đến 6 cơ quan đặc trưng** (6.5). "Hiện đại chọn lọc": ngân phiếu, bưu truyền (thư nhanh giữa các tông), hộ tịch, quỹ tương trợ, y quán, viện nghiên cứu.

### 6.4 Nguyên tắc cân bằng đạo đức (công–tội)
- Mỗi tông có **sổ Công–Tội**: 3 công và 3 tội, cộng 1 **bí mật** (vết nhơ hay việc tốt chưa ai biết; lộ qua tin tức hoặc nhiệm vụ). **Âm Hồn Giáo nghiêng về ác**: 2 công, 4 tội, `nhan` khởi đầu thấp. Người chơi không thấy hết từ đầu.
- Mỗi tông có **tình thế khó xử** (6.5) làm hạt giống cho **sự kiện nghịch lý** (Q mục 24.6). Lựa chọn của tông (NPC) hoặc của người chơi (đủ bậc) đổi `gt`, `nhan` và chỉ số.
- **Thanh trừng nội bộ (hiếm):** khi `on` quá thấp hoặc đổi chủ, tông có thể thanh trừng: đổi `gt`, chính sách, `nhan`, mất người; sự kiện cho đệ tử (chọn phe, trốn, tố giác).

### 6.5 Chín nguyên mẫu sâu (bạn chọn "sâu hơn", bỏ Triều Tiên và Singapore)
Mỗi nguyên mẫu chỉ là **cảm hứng thiết kế về cấu trúc**; trong game đều là nội dung gốc, tên giả. Dưới đây, `gt` theo thứ tự (tu, ca, doi, mo, tin); chỉ số theo thứ tự (kt, qs, kh, vh, ng, on, tt); chính sách theo thứ tự (thể chế / kinh tế / quân sự / đối ngoại / nhân tài).

| Tông (vùng) | Nguyên mẫu | `gt` | Chỉ số | Chính sách mặc định |
|---|---|---|---|---|
| **Thanh Vân Tông** (Trung Châu) | Đế quốc quan liêu tập quyền, thi cử lâu đời (kiểu Trung Hoa) | +65, +55, +10, -5, -35 | 68, 55, 58, 66, 52, 62, 72 | Tập quyền / hỗn hợp có kế hoạch / thường trực đông / liên minh / thi tuyển |
| **Thủy Nguyệt Cung** (Đông Hải) | Đảo quốc tinh xảo, trọng truyền thống và kỷ luật tập thể (kiểu Nhật Bản) | +45, +60, +25, -45, +20 | 60, 48, 72, 74, 42, 70, 50 | Hội đồng trưởng lão / tự lực tinh xảo / thủy quân phòng thủ / trung lập / tiến cử, huyết thống |
| **Kim Phong Môn** (Tây Thiên Sơn) | Cường quốc kỹ nghệ, kỷ luật, quy trình (kiểu Phổ/Đức) | +70, +30, +35, +5, -20 | 66, 72, 70, 48, 50, 68, 46 | Tập quyền kỷ luật / hỗn hợp công nghiệp / thường trực tinh nhuệ / liên minh có điều kiện / thi tuyển nghiêm |
| **Bách Thảo Môn** (Nam Lâm) | Quốc gia đông dân, đa dạng, mạnh y dược và học thuật (kiểu Ấn Độ) | 0, +10, +20, +30, +60 | 52, 40, 66, 70, 60, 48, 44 | Hội đồng phân tán / thị trường dược / chỉ phòng thủ / buôn bán / mở cửa có đẳng cấp |
| **Huyền Băng Cung** (Bắc Cực) | Cường quốc rộng lớn, nhiều tài nguyên, khắc nghiệt (kiểu Nga) | +60, +40, -5, -40, +10 | 56, 76, 60, 44, 40, 52, 68 | Tập quyền thế tập / dựa tài nguyên / thường trực đông / bành trướng hoặc cô lập / bảo lãnh |
| **Liệt Hỏa Tông** (Hỏa Diệm Sơn) | Cường quốc công nghiệp, cá nhân, đổi mới (kiểu Mỹ) | -35, -60, +70, +55, +15 | 76, 70, 76, 72, 62, 42, 58 | Bầu cử trong hàng ngũ / thị trường tự do / thuê ngoài và tinh nhuệ / can thiệp / mở cửa |
| **Nhật Luân Giáo** (Hoang Mạc) | Các nhà nước sa mạc thần quyền, văn minh cổ, tài nguyên quý (kiểu Ba Tư/Iran và vùng Vịnh) | +55, +45, -30, -20, +85 | 64, 56, 46, 56, 46, 58, 52 | Thần quyền / dựa tài nguyên / nghĩa vụ toàn tông / liên minh tín ngưỡng / huyết thống, tín ngưỡng |
| **Âm Hồn Giáo** (Vụ Trạch) | Đế chế hãn quốc chinh phục (kiểu Đế quốc Mông Cổ), nghiêng về ác nhưng không thuần ác | +50, +50, +5, +10, +25 | 40, 78, 50, 30, 44, 56, 70 | Tập quyền quân sự (hãn) / cống nạp chinh phục / nghĩa vụ và kỵ binh / bành trướng / mở cửa theo tài |
| **Tử Lôi Quan** (Lôi Đảo) | Đảo quốc hải dương, pháp quyền, thương mại, đế quốc cũ (kiểu Anh) | +20, -10, +10, +25, -15 | 66, 60, 58, 62, 74, 64, 62 | Hội đồng và pháp quyền / thị trường hàng hải / thủy quân phòng thủ / liên minh cân bằng / thi tuyển và tiến cử |

**Hồ sơ sâu từng tông**

**1. Thanh Vân Tông (kiểu đế quốc quan liêu tập quyền).**
- *Thể chế và kinh tế:* bộ máy phân cấp nhiều tầng, đệ tử hành chính; quy hoạch dài hạn (thủy lợi, đường sá cho vùng), kho lương dự trữ.
- *Quân sự và khoa học:* quân đông, phẩm trung bình; mạnh về tổ chức hơn về tinh nhuệ; viện nghiên cứu cân bằng.
- *Văn hóa:* thi tuyển công khai nâng người hàn vi; trọng hiếu và tổ tiên; Nho học mạnh (nối nho khí).
- *Cơ quan đặc trưng:* Tàng Kinh Các, Thiên Cơ Các, Chấp Pháp Đường, Tài Các, Ngoại Vụ Đường.
- *Công:* nhận đệ tử phàm nhân đông nhất, lập thư viện; quy hoạch trị thủy và đường xá cho vùng; thi tuyển công bằng nâng người hàn vi.
- *Tội:* kiểm duyệt sách và tin "bất lợi"; ép đồng thuận, nhồi khuôn; giám sát và khuyến khích đệ tử tố giác lẫn nhau.
- *Bí mật:* một đời chưởng môn từng ém tin một trận dịch để giữ ổn định, cứu được nhiều người nhưng giấu cả sự thật.
- *Khó xử:* giữ ổn định thì hạn chế tiếng nói trái chiều; mở cửa thì sợ mất kiểm soát.

**2. Thủy Nguyệt Cung (kiểu đảo quốc tinh xảo).**
- *Thể chế và kinh tế:* hội đồng trưởng lão theo thâm niên, quyết định bằng đồng thuận; kinh tế dựa chế tác tinh xảo, ngư nghiệp, trà.
- *Quân sự và khoa học:* thủy quân nhỏ mà tinh, kiếm mềm; Khí Các hạng nhất về độ tinh xảo.
- *Văn hóa:* lễ nghi, mỹ thuật, thờ thần biển (Thần đạo, Phật giáo lồng nhau); xã hội nặng áp lực chuẩn mực.
- *Cơ quan đặc trưng:* Khí Các, Hải Vụ Đường, Lễ Đường, Y Quán, Tàng Kinh Các.
- *Công:* chế tác bền đẹp, thiện nguyện cứu nạn biển; lễ nghi hòa nhã; kỷ luật tập thể cứu hộ giỏi.
- *Tội:* bảo thủ, từ chối cải cách; áp lực tập thể đến mức đệ tử kiệt sức; khép với người ngoài, thế hệ trẻ ít.
- *Bí mật:* một quy tắc cũ khiến một phái cải cách bị im lặng, nhiều người tài bỏ đi.
- *Khó xử:* giữ nếp cũ hay mở cửa nhận người ngoài.

**3. Kim Phong Môn (kiểu cường quốc kỹ nghệ, quy trình).**
- *Thể chế và kinh tế:* tập quyền theo quy trình, pháp quyền rõ; công nghiệp luyện kiếm quy mô lớn.
- *Quân sự và khoa học:* thường trực tinh nhuệ, kiếm trận chuẩn mực; Trận Các và Khí Các mạnh.
- *Văn hóa:* trọng kỷ luật, tay nghề, tiêu chuẩn; ký ức một cuộc chiến cũ làm tông thận trọng với "trật tự không giới hạn".
- *Cơ quan đặc trưng:* Trận Các, Khí Các, **Phù Các** (viện phù lục, giữ dòng "Chuẩn phù" cần phù căn), Chấp Pháp Đường, Tài Các, Tàng Kinh Các.
- *Công:* kỹ thuật và kiếm trận chuẩn mực; pháp quyền rõ, giữ lời hiệp ước; sản phẩm bền giúp dân đồng bằng.
- *Tội:* quan liêu cứng, coi quy trình hơn con người; từng dùng "trật tự" gây họa; hà khắc với người không đạt chuẩn.
- *Bí mật (bạn chốt):* một người từng **bị từ chối quyền luyện chế phù** vì không đạt "phù căn" chuẩn dù đã **cố gắng nhiều năm**, **âm thầm lên chức chưởng môn** bằng chính quy trình, rồi **phát động cuộc chiến quy mô chưa từng có** (Đại chiến Phù Lệnh). Chi tiết ở Q mục 24.5b (cụm 24, W25).
- *Khó xử:* tuân lệnh hay theo lương tâm; giữ chuẩn để bảo đảm chất lượng hay mở cửa cho người bị gạt.

**4. Bách Thảo Môn (kiểu quốc gia đông dân, đa dạng).**
- *Thể chế và kinh tế:* hội đồng phân tán nhiều phái; thị trường dược, thương mại thảo mộc.
- *Quân sự và khoa học:* quân yếu, dựa ngoại giao và thương mại; Đan Các và Y Quán hạng nhất.
- *Văn hóa:* nhiều trường phái, lễ hội, triết học; Phật giáo, Ấn Độ giáo, Đạo giáo cùng tồn tại.
- *Cơ quan đặc trưng:* Đan Các, Y Quán, Tàng Kinh Các, Ngoại Vụ Đường, Tài Các.
- *Công:* cứu dân bằng y dược; nhiều trường phái sống chung, tranh luận cởi mở; nhân tài đông.
- *Tội:* phân tầng đẳng cấp (đan sư trên thảo dân), bất bình đẳng; thủ tục chậm; độc quyền bí phương, đẩy giá thuốc.
- *Bí mật:* một trận dịch từng bị ém vì lợi ích, nhiều người chết.
- *Khó xử:* cứu người đại trà hay giữ thứ bậc và bí phương.

**5. Huyền Băng Cung (kiểu cường quốc rộng lớn, khắc nghiệt).**
- *Thể chế và kinh tế:* quyền lực tập trung thế tập; nuôi bằng linh thạch và băng ngọc xuất khẩu.
- *Quân sự và khoa học:* thường trực đông, tinh nhuệ trong giá lạnh; khoa học nền tảng vững.
- *Văn hóa:* chịu đựng, trọng sức mạnh; ít nghi lễ, nhiều kỷ luật; Tín ngưỡng dân gian và Thiên Chúa giáo (phái Chính thống) cùng tồn tại.
- *Cơ quan đặc trưng:* Chấp Pháp Đường, Quân Doanh, Thiên Cơ Các, Mật Các, Tài Các.
- *Công:* bền bỉ giữa thiên tai, che chở vùng biên; khoa học nền tảng; kiên cường khi bị xâm lăng.
- *Tội:* quyền lực tập trung, tham nhũng kéo dài; dùng tài nguyên làm vũ khí chính trị; đàn áp bất đồng.
- *Bí mật:* kho linh thạch bị biển thủ qua nhiều đời, nên quân thật ra yếu hơn vẻ ngoài.
- *Khó xử:* dùng sức mạnh hay thỏa thuận để giữ ảnh hưởng.

**6. Liệt Hỏa Tông (kiểu cường quốc công nghiệp, cá nhân).**
- *Thể chế và kinh tế:* bầu chọn trong hàng ngũ, tự do kinh doanh, cạnh tranh khốc liệt giữa các lò.
- *Quân sự và khoa học:* thuê ngoài và tinh nhuệ; Khí Các đứng đầu về đổi mới; hút nhân tài khắp nơi.
- *Văn hóa:* cá nhân chủ nghĩa, trọng thành công; văn hóa đại chúng lan rộng (sức mạnh mềm).
- *Cơ quan đặc trưng:* Khí Các, Tài Các, Thiên Cơ Các, Ngoại Vụ Đường, Y Quán.
- *Công:* đổi mới và hút nhân tài từ mọi xuất thân; cứu trợ hào phóng khi thiên tai; kỹ nghệ lan tỏa cho cả vùng.
- *Tội:* bất bình đẳng giàu nghèo; phe cánh chia rẽ; hay can thiệp xa gây hậu quả khó lường; chạy theo lợi nhuận.
- *Bí mật:* một lò luyện khí gây ô nhiễm nghiêm trọng bị che giấu.
- *Khó xử:* tự do kinh doanh đối lại công bằng; có nên can thiệp vùng khác.

**7. Nhật Luân Giáo (kiểu các nhà nước sa mạc thần quyền).**
- *Thể chế và kinh tế:* thần quyền, giáo chủ và hội đồng tăng lữ; nuôi bằng linh thạch, thương lộ qua sa mạc.
- *Quân sự và khoa học:* nghĩa vụ toàn giáo, kỵ binh sa mạc; thiên văn và y học cổ rất mạnh.
- *Văn hóa:* tôn ti vững, hiếu khách (khách là thượng khách); Hồi giáo là tín ngưỡng chính (độc thần, không lồng), cùng Phật giáo và Tín ngưỡng dân gian.
- *Cơ quan đặc trưng:* Thiên Văn Đài (nghiên cứu), Đại Điện, Tài Các, Mật Các, Y Quán.
- *Công:* học thuật cổ (thiên văn, y), hiếu khách, chia tài nguyên cho đền chùa và cứu trợ; tôn ti giữ ổn định.
- *Tội:* hạn chế tự do tư tưởng và cải cách; phụ thuộc xuất khẩu linh thạch; ưu tiên tín đồ trong việc làm và chức vị.
- *Bí mật:* một giáo chủ từng giấu một phát hiện thiên văn trái giáo lý.
- *Khó xử:* giữ giáo lý nguyên vẹn hay cho phép cải cách.

**8. Âm Hồn Giáo (kiểu hãn quốc chinh phục; nghiêng về ác).**
- *Thể chế và kinh tế:* tập quyền quân sự dưới một hãn, thăng chức theo tài không theo xuất thân; kinh tế dựa cống nạp, bảo kê thương lộ và cướp bóc.
- *Quân sự và khoa học:* **Hồn Kỵ Doanh** (kỵ binh cơ động, hồn nô), quân kỷ rất nghiêm; luyện hồn, âm khí; khoa học hạn chế nhưng thực dụng.
- *Văn hóa:* khoan dung mọi tín ngưỡng (miễn là thần phục); thờ tổ tiên và tử linh, Tín ngưỡng dân gian; nghi lễ tưởng niệm sâu.
- *Cơ quan đặc trưng:* Hồn Kỵ Doanh, Dịch Trạm (bưu truyền), Mật Các, Chấp Pháp Đường, Tài Các.
- *Công:* tuyển người theo tài, không hỏi xuất thân; khoan dung tôn giáo; bưu trạm xuyên vùng và an ninh thương lộ.
- *Tội (nặng hơn công):* đồ thành kháng cự (luyện hồn người), khủng bố tâm lý; cống nạp và cướp bóc; thanh trừng; bắt hồn nô.
- *Bí mật:* nghi lễ "luyện hồn" thật ra giữ hồn người chết không tan, một kiểu an ủi méo mó của hãn đầu tiên.
- *Khó xử:* dọa để khỏi phải đánh, hay đánh để dọa.
- *Ghi chú:* `nhan` khởi đầu -45; 2 công, 4 tội. Vẫn có người tốt, vẫn có thể cải tà (hiếm).

**9. Tử Lôi Quan (kiểu đảo quốc hải dương, pháp quyền).**
- *Thể chế và kinh tế:* hội đồng trưởng lão có tranh luận công khai, pháp quyền; thương mại hàng hải, bảo hiểm tàu thuyền.
- *Quân sự và khoa học:* thủy quân hạng nhất, phòng thủ đảo; Lôi trận.
- *Văn hóa:* tranh luận, truyền thống pháp lý, tự hào về tự do tương đối; tự cho mình có sứ mệnh mang trật tự ra biển.
- *Cơ quan đặc trưng:* Hải Vụ Đường, Pháp Đường, Ngoại Vụ Đường, Tài Các, Trận Các.
- *Công:* pháp quyền và quyền cơ bản được tôn trọng ở mức tương đối; thủy quân bảo vệ thương lộ; tranh luận công khai.
- *Tội:* kiêu ngạo của một đế quốc cũ; vơ vét chư hầu bằng cống nạp; "chia để trị" giữa các thế lực.
- *Bí mật:* một hiệp ước cũ bị bội để lấy lợi.
- *Khó xử:* luật pháp đối lại lợi ích của đế chế.

---

## 7. Phần C2: Gia tộc, thương hội, vương triều theo nguyên mẫu

### 7.1 Tám gia tộc (tài phiệt, thương gia, thế gia học thuật)
Mỗi gia tộc có `kieu` và nguyên mẫu; họ vẫn bốc ngẫu nhiên, nhưng `kieu` quyết định bản sắc.
| Kiểu | Số | Nguyên mẫu gợi ý | Đặc trưng trong game |
|---|---|---|---|
| **Tài phiệt** | 3 | Gia tộc ngân hàng Phục Hưng (kiểu Medici); gia tộc cho vay vua chúa (kiểu Fugger); tập đoàn gia tộc liên kết dọc (kiểu Zaibatsu) | Cho vay triều, mua chuộc tông, bảo trợ nghệ thuật và nghiên cứu; ảnh hưởng chính trị lớn; hay bị tố thao túng; nối thương hội (F1) |
| **Thương gia** | 3 | Ngân hiệu hối phiếu (kiểu Tấn thương); thương gia hàng hải đường dài (kiểu Ả Rập); thương gia liên bang nhiều chi (kiểu Marwari) | Đường buôn, hôn nhân thương mại, tin tức thương lộ; quỹ tương trợ; hợp tác với hội |
| **Thế gia học thuật** | 2 | Dòng tộc Nho học nhiều đời (kiểu Khổng gia); dòng tộc khoa học, y học qua nhiều thế hệ (kiểu các gia tộc khoa học châu Âu và Vệ Đà) | Tăng nho khí, cố vấn triều, thư viện gia đình; ít quân, nhiều tiếng nói; nối R |

### 7.2 Ba thương hội (đô thị thương mại cổ)
| Hội hiện có | Gợi ý nguyên mẫu | Ghi chú |
|---|---|---|
| **Vạn Bảo Thương Hội** (gắn triều, Trung Châu) | Cộng hòa thương mại đầm phá (kiểu Venice) | Hội đồng thương gia, đội tàu và kho, hôn ước chính trị, gần triều |
| **Thanh Phong Hành** (tự do thương mại) | Liên minh thành thị thương mại (kiểu Hansa) | Nhiều chi nhánh tự trị, luật thương mại chung, ít quân |
| **Hắc Kim Hội** (chợ đen) | Cảng tự do hỗn tạp (kiểu Genoa pha Malacca) | Cảng ngầm, buôn lậu, ngân phiếu ngầm, quyền lực ẩn |

### 7.3 Chín vương triều (đồng bộ bản sắc với bảng nguyên mẫu)
Gợi ý (bản sắc quân và quốc, chốt khi làm 5.5 và S3):
| Vùng | Nguyên mẫu gợi ý | Bản sắc quân/quốc |
|---|---|---|
| Trung Châu | Đế quốc La Mã (pháp luật, đường sá, quân đoàn) | Nho khí cao, quân đông nhưng phẩm trung bình, triều chính phức tạp |
| Đông Hải | Cộng hòa hải thương (kiểu Hà Lan) | Thủy quân, thương nghiệp, đê điều, thuế thương mại |
| Tây Thiên Sơn | Vương quốc núi trung lập vũ trang (kiểu Thụy Sĩ, Tây Tạng) | Sơn binh tinh nhuệ, kiếm trận, tăng lữ, ít dân |
| Nam Lâm | Đế quốc thủy lợi, đền tháp (kiểu Khmer, Đông Nam Á) | Nghĩa quân, độc dược, du kích, khó chinh phục |
| Bắc Cực Băng Nguyên | Vương quốc thủy thủ chiến binh (kiểu Viking) | Băng kỵ, hội đồng làng, rất ít dân, phẩm cao |
| Hỏa Diệm Sơn | Đế quốc hỏa pháo (kiểu Ottoman) | Hỏa khí, kỹ nghệ rèn, quân thường trực |
| Hoang Mạc Kim Sa | Vương quốc sông và ốc đảo, du mục (kiểu Ai Cập cổ, Bedouin) | Kỵ binh cơ động, thiên văn, ốc đảo là then chốt |
| Vụ Trạch | Các thành bang đồng bằng ngập (kiểu Lưỡng Hà) | Quân hỗn tạp, âm khí, nhiều tà tu cung phụng, thành bang tự trị |
| Lôi Đảo | Thành bang đảo (kiểu Hy Lạp cổ) | Lôi pháo, thủy quân, thành bang đối địch, ít quân nhưng sát khí cao |

---

## 8. Phần D: Tôn giáo

### 8.1 Nguyên tắc
- **Lớp phủ** lên mọi thế lực, vùng và người; không thay tông môn. Dùng **tên thật** cho quen thuộc. Mô tả tôn trọng (mục 3, nguyên tắc 7).
- Mỗi tín ngưỡng có **phúc** (hiệu ứng nhẹ cho tín đồ), **giới** (ràng buộc), **đóng góp** và **căng thẳng** trong game.
- Mỗi vùng có **tối đa 3 "ô" tín ngưỡng** cùng lúc; hai tín ngưỡng tương thích có thể **lồng** vào một ô.

### 8.2 Chín tín ngưỡng khởi đầu (theo ngoài đời)
| Tín ngưỡng | Cốt lõi | Đóng góp trong game | Căng thẳng trong game | Phái (nguồn rẽ nhánh) | Lồng được với |
|---|---|---|---|---|---|
| **Phật giáo** | Từ bi, nghiệp, luân hồi, giải thoát | Giảm nghiệp, cứu khổ, hòa giải, nối đầu thai | Chùa giàu đất bị thế lực ghen; tranh phái | Đại thừa, Nguyên thủy, Mật tông | Tổ tiên, Đạo giáo, Nho giáo, Thần đạo, Dân gian, Ấn Độ giáo |
| **Thiên Chúa giáo** | Yêu thương, cứu rỗi, một Thiên Chúa | Y tế, giáo dục, cứu trợ, giáo hội có tổ chức | Độc quyền niềm tin nên khó chung ô; tranh phái; giằng co với quyền thế tục | Công giáo, Chính thống, Tin Lành | **Không lồng** |
| **Hồi giáo** | Một Thượng Đế, năm cột trụ, cộng đồng, bố thí | Bố thí, thương mại, học thuật, hiếu khách, đoàn kết | Độc quyền niềm tin nên khó chung ô; tranh phái; giáo luật và luật thế tục | Sunni, Shia | **Không lồng** (mặc định, xem mục 13) |
| **Ấn Độ giáo** | Dharma, karma, luân hồi, nhiều thần | Nghi lễ và lễ hội phong phú, yoga, triết học | Phân tầng đẳng cấp; sức nặng của truyền thống | Vaishnava, Shaiva, Shakta | Phật giáo, Dân gian, Tổ tiên |
| **Đạo giáo** | Thuận tự nhiên, dưỡng sinh, luyện đan | Tu dưỡng, y, đan; nối Đan Các | Huyền bí dễ bị lợi dụng; đồng bóng | Chính Nhất, Toàn Chân | Phật giáo, Nho giáo, Tổ tiên, Thần đạo, Dân gian |
| **Nho giáo** | Nhân, nghĩa, lễ, trí, tín; hiếu; trị quốc | Khoa cử, quan chế, nho khí (nối 5.3) | Nặng thứ bậc, bảo thủ | Chính thống, Tân Nho | Tổ tiên, Đạo giáo, Phật giáo |
| **Thờ cúng tổ tiên** | Hiếu kính, giỗ, dòng tộc | Gắn kết gia tộc, nối R | Nặng huyết thống, kỳ thị người ngoài | (không phái lớn) | Hầu hết, trừ độc thần |
| **Thần đạo** | Thờ kami, tịnh hóa, lễ hội mùa | Gắn cộng đồng, tôn trọng thiên nhiên | Gắn chặt quốc gia, dễ thành chủ nghĩa dân tộc | Thần xã, Thần đạo dân gian | Phật giáo, Đạo giáo, Tổ tiên, Dân gian |
| **Tín ngưỡng dân gian, thiên nhiên** | Thần núi sông, vạn vật hữu linh, thầy cúng | Bảo vệ tài nguyên, chữa bệnh dân gian, hiểu yêu thú | Bị giáo lớn gạt; cản khai mỏ | (nhiều dạng địa phương) | Tất cả trừ độc thần |

(Thang rẽ nhánh dùng để sinh phái mới hoặc dị giáo ở 8.5.)

### 8.3 Ba ô mỗi vùng và quy tắc lồng
```
vùng.slots = [ô1, ô2, ô3]      ô = { chinh: tín_ngưỡng, long?: tín_ngưỡng_tương_thích, share: tỉ_lệ }
share(ô1) >= share(ô2) >= share(ô3), tổng = 1 (các ô, tính cả tục lồng chung ô)
```
- **Ô 1 là tôn giáo mạnh nhất vùng**; có **đại điện** (8.4).
- **Lồng:** một ô có thể chứa một tín ngưỡng chính và **tối đa một tục lồng** tương thích (bảng ở 8.2). Ví dụ ô "Phật giáo + thờ cúng tổ tiên", ô "Đạo giáo + dân gian". **Thiên Chúa giáo** (và, mặc định, **Hồi giáo**) **độc chiếm** một ô, không lồng, và tín đồ không kiêm tín ngưỡng khác.
- **Nhập vùng:** một tín ngưỡng mới muốn vào phải **đẩy ô yếu nhất** (nếu cả ba ô đều đầy); đẩy được thì có sự kiện (đền bị đóng, chuyển thành miếu nhỏ, hòa giải, hoặc xung đột).
- **Khởi đầu theo hạt giống quanh gợi ý** (để mỗi thế giới khác):
| Vùng | Ô 1 | Ô 2 | Ô 3 |
|---|---|---|---|
| Trung Châu | Nho giáo + Tổ tiên | Phật giáo + Đạo giáo | Thiên Chúa giáo |
| Đông Hải | Thần đạo + Phật giáo | Dân gian (thần biển) + Đạo giáo | Thiên Chúa giáo |
| Tây Thiên Sơn | Phật giáo (Mật tông) + Dân gian | Ấn Độ giáo | Đạo giáo |
| Nam Lâm | Phật giáo + Tổ tiên | Dân gian (thần rừng) | Ấn Độ giáo |
| Bắc Cực | Dân gian (thầy cúng) | Thiên Chúa giáo (Chính thống) | Phật giáo |
| Hỏa Diệm Sơn | Hồi giáo | Thiên Chúa giáo | Đạo giáo (luyện) |
| Hoang Mạc | Hồi giáo | Dân gian | Phật giáo |
| Vụ Trạch | Tổ tiên + Dân gian (tử linh) | Ấn Độ giáo | Phật giáo |
| Lôi Đảo | Dân gian + Thần đạo | Thiên Chúa giáo | Đạo giáo |

### 8.4 Nơi thờ tự, chùa chiền
- **Đại điện** ở mỗi vùng thuộc tôn giáo mạnh nhất (ô 1): chùa lớn, nhà thờ lớn, thánh đường, đền Ấn Độ giáo, đạo quán lớn, văn miếu và từ đường, đền thần. Là **địa điểm thật** trên bản đồ vùng (loại mới `tho_tu`), có biểu tượng riêng theo tín ngưỡng.
- **Miếu, am, nhà nguyện nhỏ** ở thôn trấn cho ô 2 và ô 3.
- Khi thứ hạng đổi, **đại điện đổi chủ** (tốn thời gian, có sự kiện: chuyển đổi, tranh chấp, hòa giải).
- **Dịch vụ** tại nơi thờ tự: cầu an và lễ (đạo tâm, giảm nghiệp), tụng kinh hoặc nghe giảng (kiến thức, tâm ma), cứu trợ và tị nạn (khi thiên tai, chiến loạn), chữa bệnh, học chữ, gặp gỡ giáo sĩ, nhận nhiệm vụ do giáo hội giao. Công trình dùng pipeline asset và phố công trình (I).

### 8.5 Dữ liệu và công thức (cấp năm)
`world.fac.faith`:
- `slots[vùng] = [ô1, ô2, ô3]` như 8.3.
- `church[tín_ngưỡng] = { luc, huong, ky, phai }`: `luc` sức mạnh giáo hội, `huong` hương hỏa, `ky` độ nghiêm giới, `phai` các phái.
- Mỗi thế lực: `faith` (quốc giáo hoặc tín ngưỡng chính) và `khoan`.

```
dịch_chuyển(share) = truyền_giáo(luc) + ủng_hộ_thế_lực(quốc giáo)
                   + khủng_hoảng (mood thấp, thiên tai: người ta tìm đến đức tin)
                   - đàn_áp (khoan thấp) - thế_tục_hóa (nho khí cao, khoa học cao)
hương hỏa = tín_đồ x thành_tâm x (1 + phúc_lễ) - chi_nuôi (giáo sĩ, công trình, cứu trợ)
luc = f(tín_đồ, hương hỏa, hiệp_ước_với_triều)
```
- **Hương hỏa** nuôi: công trình, nghi lễ, cứu trợ thiên tai (tăng dân tâm), và (sau, ở Q) thần chức.
- **Phái, dị giáo (hiếm):** giáo hội cực đoan hóa khi bị đàn áp, cải cách khi khoan dung cao mà giáo luật cứng; có xác suất rẽ **phái mới** hoặc **dị giáo**.

### 8.6 Tôn giáo làm gì trong thế giới
1. **Dân tâm và dân số (F4):** niềm tin giúp dân tâm đỡ tụt khi thiên tai; nơi thờ tự cứu trợ giảm tử vong.
2. **Thế lực:** quốc giáo cộng nhẹ `on` và `vh`; khoan dung thấp thì tăng nguy cơ dị giáo nổi loạn. Quan hệ thêm chiều `dao`: cùng tín ngưỡng thì thân, khác thì dè chừng; **thánh chiến** là lý do chiến tranh mới.
3. **Kinh tế (E):** đền chùa có đất và lễ hội tạo cầu; thuế tôn giáo là nguồn cho triều hoặc điểm tranh chấp.
4. **Nho khí và quốc vận:** nho khí cao thúc đẩy thế tục hóa; quốc giáo hợp lòng dân cộng vận; đàn áp mạnh trừ vận.
5. **Chiến tranh:** thánh chiến; giáo hội làm hòa giải viên hoặc cung cấp dân quân; tế lễ trước trận cộng `sat` hay quân tâm.
6. **Tin tức (G):** lễ hội, thần tích, cải cách, dị giáo, thánh chiến lên Nhật báo.
7. **Tông môn:** mỗi tông có quốc giáo hoặc theo thế tục (Nhật Luân: Hồi giáo; Thủy Nguyệt: Thần đạo và Phật giáo; Thanh Vân: Nho giáo và Tổ tiên; Bách Thảo: Phật giáo, Ấn Độ giáo, Đạo giáo; Kim Phong: Nho giáo thế tục và Thiên Chúa giáo ít; Huyền Băng: Dân gian và Thiên Chúa giáo Chính thống; Liệt Hỏa: thế tục là chính; Âm Hồn: tổ tiên, tử linh, dân gian; Tử Lôi: thế tục và Thiên Chúa giáo).

### 8.7 Người chơi và tôn giáo (ở S; phần giáo sĩ và Thần Chức nằm ở Q)
- **Tín ngưỡng cá nhân:** `c.faith`, `c.tam` (mức sùng đạo): Thế tục / Tin sơ / Sùng đạo. Cải đạo là lựa chọn lớn (ảnh hưởng quan hệ).
- **Giữ giới và nghi lễ:** giữ giới cộng đạo tâm, giảm tâm ma, giảm nghiệp; phạm giới trừ đạo tâm và bị cộng đồng xa lánh. Hành hương đến đại điện; lễ hội mùa.
- **Hôn nhân khác đạo (nối R):** đạo lữ khác tín ngưỡng thì xung đột hay hòa giải, ảnh hưởng con cái, gia tộc.
- **Gia nhập tông:** tông có quốc giáo thì ưu tiên tín đồ; khác đạo thì khó hơn, hoặc dễ nếu khoan dung cao.
- **Giáo sĩ và Thần Chức đạo:** xem **Q mục 24.1 và 24.2** (T15, T16).
- **Ba giáo hội lớn nhất** (theo `luc`) đứng trong ma trận quan hệ như một nút, có quan hệ với triều và tông (thân, dè chừng, cạnh tranh, thánh chiến).

---

## 9. Phần E: Liên thông M5b (liên tông)
M5b (minh ước, giải đấu, đại chiến có hậu quả) trở thành **tầng thứ ba của cùng một mạng quan hệ**, làm cùng, không làm riêng:
1. **Tông ↔ triều:** bên triều bảo hộ, trọng dụng hay đàn áp; tông có thể là **quốc sư** (giữ pháp trận của nước), **cung phụng** (nhận bổng), hoặc **ngoài vòng pháp luật**. Tông có thể **thao túng triều** (nâng người của mình lên ngôi): chịu phản phệ khi triều còn vận, trơn tru khi vận Mạt.
2. **Minh ước liên tông:** đồng minh thêm "ước pháp": cùng phòng thủ, chia mỏ, cho mượn đệ tử; dùng chung `pacts` với triều.
3. **Giải đấu liên tông:** bảo trợ bởi triều hoặc minh chủ, chu kỳ 4 hoặc 10 năm; thắng thì cộng uy tín (`an_oan` ân), phần thưởng là mỏ và tư cách; chọn người chơi dự thi hay không.
4. **Đại chiến liên tông:** kết quả tính cả việc triều **đứng ngoài hay nhúng tay** (cho mượn quân, cấm vận, đánh cả hai); diệt tông hay thôn tính có hậu quả cho cả mạng.
5. **Thiên hạ công ước:** tông và triều ký điều ước ngầm cấm tu sĩ cao đánh phàm; vi phạm thì bị liên minh tông môn và quân đội truy cứu. Là hiện thân thể chế của phản phệ.
6. **Thứ tự:** mạng quan hệ (Phần A) xong rồi cắm M5b lên, nên M5b ngắn hơn nhiều so với làm riêng.

---

## 10. Kỹ thuật, cân bằng, kiểm thử

### 10.1 Cách ghép vào mô phỏng sẵn có
- `power` của triều và tông = hàm của chỉ số/quân lực/quốc vận/nho, **hiệu chỉnh** để trung bình giống `power` cũ (đo bật/tắt với 12 hạt giống như F4).
- `strength()` trong chiến tranh dùng `CL` thay phần `milMul`; chênh lệch giữa các nước nay giải thích được.
- Mọi hiệu ứng lên người chơi (may mắn, nguy hiểm, phản phệ) **nhỏ, có trần**; hộp quyết định mới đi qua kênh tầng 2 có sẵn, không tăng nhịp.

### 10.2 Tệp và dữ liệu (dự kiến)
- **Dữ liệu:** `js/data/nation.js` (`D.NATION`: ngưỡng, bảng lính tương đương, quốc sách, bản sắc 9 nước, văn vị), `js/data/sects.js` (thêm `gt`, `chiso`, `chinhsach`, `cong`, `toi`, `bimat`, `nguyenmau`, `coquan`), `js/data/faiths.js` (chín tín ngưỡng, giới, phái, lồng, đại điện), `js/data/natevents.js` (sự kiện, dựa Q mục 24).
- **Hệ thống:** `js/systems/diplo.js` (`TT.diplo`: mạng quan hệ nhiều chiều), `js/systems/nation.js` (`TT.nation`: quốc vận, nho khí, quân, triều chính), `js/systems/sectpol.js` (chỉ số, chính sách, `power` suy ra), `js/systems/faith.js` (`TT.faith`: ô, hương hỏa, giáo hội, phái), `js/ui/nation.js` (Quốc gia và Ma trận), `js/ui/faith.js` (Tín ngưỡng, nơi thờ tự), mở rộng `js/ui/sect.js` (thẻ tông: radar, trục giá trị, công–tội, chính sách).
- **Sửa:** `factions.js` (`strength`, `declareWars` chọn đối thủ nhiều chiều, `endWar`, `relV/relAdd` qua `diplo`), `pacts.js` (ghi ân oán, `strain` nối `tin`), `population.js` (đọc `nat`, `faith.slots`), `sect.js` (bỏ dần `align`, dùng độ hợp `gt`), `character.js` (`faith`, `tam`, `gt`, `van`, `hao`), `places.js`/`buildings.js` (loại `tho_tu`), `so-do-the-gioi.html`.
- **Lưu:** `world.fac.nat`, `world.fac.rel2`, `world.fac.faith`; trường mới trên thế lực/nhân vật; khởi tạo muộn, **không đổi `TT.VERSION`**; thế giới cũ dựng ở năm kế (`gt` suy ra từ `align`, `rel2` từ `rel`, `slots` theo gợi ý vùng).

### 10.3 Kiểm thử và chỉ tiêu
- `relV` tương thích; ma trận đối xứng; `rel2` lưu/tải; sổ ân oán tối đa 12.
- Quốc vận trong khoảng; vận Mạt dẫn tới đổi chủ/chia cắt/thôn tính; không vùng nào hết chủ; phản phệ đúng mức.
- Bảng lính tương đương: Kim Đan bị vây thua, Hóa Thần thắng đại quân nhỏ; Hóa Thần không thắng nổi đại trận quốc vận; Phi Thăng miễn nhiễm.
- `gt` hợp lệ cho chín tông; `power` suy ra sát `power` cũ; sổ công–tội đủ 3+3+1 (Âm Hồn 2+4+1); thanh trừng có điều kiện.
- Tôn giáo: tổng `share` mỗi vùng bằng 1; không quá 3 ô; Thiên Chúa giáo không lồng; ô 1 có đại điện; không giáo hội nào chết hết; đẩy ô yếu nhất đúng quy tắc; phái/dị giáo hiếm.
- Mô phỏng 400 năm nhiều hạt giống không lỗi; giữ 52 chiến tranh và 10 diệt vong mỗi 300 năm (±25%); nhịp hỏi dưới 6 lần mỗi phút; phân tầng NPC Trúc Cơ+ giữ 2/5/18%.

---

## 11. Các chặng làm (hợp nhất S + T, đề xuất)
Thứ tự theo phụ thuộc: **mạng quan hệ trước**, vì quốc gia, tông, tôn giáo và M5b đều cần chiều `dao` và sổ ân oán.
- [ ] **S0 Duyệt:** bạn xem mục 13 (câu hỏi còn lại), chốt nguyên mẫu cuối.
- [ ] **S1 Mạng quan hệ nhiều chiều (Phần A):** `diplo.js`, `rel2` dựng từ `rel`, sổ ân oán ghi từ chiến tranh và hiệp ước, bậc quan hệ, ma trận và hồ sơ cặp. Chưa đổi cân bằng.
- [ ] **S2 Giá trị, công–tội, bộ máy tên cổ cho chín tông (6.1, 6.3, 6.4, 6.5):** thêm `gt`, `cong`, `toi`, `bimat`; `align` thành nhãn suy ra; gia nhập/trục xuất theo độ hợp `gt`; đặt tên và thêm cơ quan (Đan Các, Khí Các, Trận Các, Tài Các, Thiên Cơ Các, Mật Các, Y Quán...); gia tộc `kieu`, hội, triều bản sắc (Phần C2).
- [ ] **S3 Quốc vận và nho khí (5.1 đến 5.3):** khối `nat` cho 9 triều, nguồn tăng giảm, thiên mệnh, phản phệ, long mạch, văn vị cá nhân, tin tức/biên niên. Đo cân bằng bật/tắt.
- [ ] **S4 Chỉ số đa chiều và chính sách của tông (6.2):** bảy chỉ số, năm chính sách, `power` suy ra có hệ số bù, thanh trừng (hiếm); đo cân bằng.
- [ ] **S5 Tôn giáo lõi (Phần D, trừ giáo sĩ/Thần Chức):** chín tín ngưỡng, ba ô mỗi vùng và quy tắc lồng, nơi thờ tự và đại điện, giáo hội và hương hỏa, quốc giáo của thế lực, tín ngưỡng cá nhân (giữ giới, nghi lễ, hành hương), sử ký và tin tức.
- [ ] **S6 Quân đội, quân trận và chiến tranh tổng (5.4, 5.6):** quân lực, phẩm, sát khí, tướng, trận, bảng lính tương đương; thay `strength`; engine chiến tranh tổng cho Đại chiến Phù Lệnh; đo lại số chiến tranh (tách đại chiến); bản sắc quân 9 nước.
- [ ] **S7 Triều chính, quốc sách, quốc giáo (5.5):** hoàng quyền, kế vị, thế gia, quốc sách với tu sĩ, quốc giáo.
- [ ] **S8 M5b liên tông trên nền S1 đến S7 (Phần E):** tông ↔ triều (quốc sư, cung phụng, thao túng), minh ước liên tông, giải đấu, đại chiến có hậu quả, Thiên hạ công ước.
- [ ] **S9 Người chơi vào cuộc:** nhập ngũ, nho quan, sứ giả, cảnh báo phản phệ, nhiệm vụ thế lực, tín nhiệm (F5); gắn nội dung Q mục 24 (tuyến, sự kiện, chuỗi).
- [ ] **S10 Xung đột tôn giáo và thanh trừng:** dị giáo, phái mới, thánh chiến, khoan dung; sự kiện nghịch lý của chín tông.
- [ ] **S11 Giao diện và hoàn thiện:** thẻ tông (radar, trục, công–tội), tab Quốc gia và Tín ngưỡng, ma trận, sơ đồ thế giới, di động; đo lại toàn bộ chỉ tiêu.
- [ ] Kiểm thử trong `tests.html`; đo cân bằng bằng mô phỏng; chơi thử máy tính và điện thoại; ghi tóm tắt vào `KE-HOACH.md`, chụp snapshot.

Ước lượng: S1 khoảng 1,5 lượt làm việc; S2 khoảng 1,5; S3 khoảng 1,5; S4 khoảng 1; S5 khoảng 2; S6 khoảng 2; S7 khoảng 1; S8 khoảng 1,5; S9 khoảng 2 (nội dung nằm ở Q); S10 khoảng 1,5; S11 khoảng 1,5.

---

## 12. Rủi ro
| Rủi ro | Cách giảm |
|---|---|
| Phạm vi rất lớn | 12 chặng, mỗi chặng chơi thử được; làm S1 trước |
| Nhạy cảm khi dùng nguyên mẫu nước thật và tôn giáo thật | Chỉ lấy đặc điểm cấu trúc; tên nước/tông là tên giả; tôn giáo dùng tên thật nhưng mô tả tôn trọng, không phản diện hóa; kẻ cực đoan là cá nhân hoặc phái; bạn duyệt từng nguyên mẫu |
| Lệch cân bằng khi `power` suy ra từ chỉ số | Hệ số bù; đo bật/tắt 12 hạt giống; giữ chỉ tiêu mục 3 |
| Quân quá mạnh hay quá yếu so tu sĩ | Bảng lính tương đương chỉnh được; phản phệ và địa hình là hai nút cân bằng |
| Người chơi không đọc được vì quá nhiều chỉ số | Hiển thị bằng bậc và chữ, số ẩn; chi tiết ở ma trận và hồ sơ cặp, thẻ tông |
| Gỡ `align` hỏng code cũ | Giữ `align` như nhãn suy ra; chuyển từng chỗ có bài kiểm thử |
| Tôn giáo thành "buff" nhàm | Mỗi tín ngưỡng có giá phải trả (giới, hương hỏa, xung đột) |
| Nhịp hỏi người chơi tăng | Mọi hộp mới qua kênh tầng 2 có sẵn, có trần ngân sách |
| Bản lưu cũ | Trường khởi tạo muộn; dựng lại ở năm kế |
| Trùng Q và R | Q mục 24 chứa nội dung; R dùng `thong` và tôn giáo cho hôn nhân khác đạo |

---

## 13. Còn lại cần bạn chốt (mỗi câu có mặc định)
1. **Hồi giáo cũng không lồng** (độc thần, độc chiếm ô) như Thiên Chúa giáo? *(mặc định: có)* Nếu muốn cho Hồi giáo lồng với dân gian hay tổ tiên thì sửa 8.2.
2. **Âm Hồn Giáo = hãn quốc chinh phục (kiểu Đế quốc Mông Cổ)** có hợp ý "đặc trưng, nghiêng ác" chưa, hay thích nguyên mẫu khác (ví dụ Aztec, đế quốc thực dân)? *(mặc định: Mông Cổ)*
3. **Tử Lôi Quan = đảo quốc hải dương, pháp quyền, đế quốc cũ (kiểu Anh)** ổn không? *(mặc định: ổn)* Chọn khác: Hy Lạp thành bang, Israel...
4. **Kim Phong = Phổ/Đức**, **Huyền Băng = Nga**, **Liệt Hỏa = Mỹ**, **Nhật Luân = Ba Tư/Iran và vùng Vịnh**, **Thủy Nguyệt = Nhật**, **Bách Thảo = Ấn Độ**, **Thanh Vân = Trung Hoa**: giữ hay đổi nước nào, thêm Việt Nam, Pháp, Brazil, Thổ Nhĩ Kỳ...? *(mặc định: giữ)*
5. **Thanh trừng nội bộ tông** là hiếm (mặc định bạn không đổi); mức hiếm khoảng 1 lần mỗi tông mỗi 80 đến 150 năm: ổn không?
6. **Văn vị (Đồng sinh đến Thánh nhân)** chỉ là bổ trợ ở đợt này, đường Nho tu độc lập để sau (Q mục 24)? *(mặc định: có)*
7. **Hiển thị:** chữ và bậc, số ẩn? *(mặc định: có)*
8. **Số cơ quan mỗi tông:** 5 đến 6 cơ quan đặc trưng như 6.3; có muốn thêm hay bớt kiểu cơ quan nào? *(mặc định: giữ)*
9. **Địa điểm thờ tự** là loại địa điểm mới `tho_tu` (đại điện + miếu), thêm vào mỗi vùng; có muốn chỉ gắn vào công trình hiện có (không địa điểm mới)? *(mặc định: địa điểm mới)*

---

## 14. Nhật ký làm việc
- 2026-10-18 (bản 1, tách S và T): đọc code và kế hoạch cũ, viết S (quốc gia) và T (tông hiện đại, tôn giáo).
- 2026-10-18 (bản 3): theo ý bạn thêm chuỗi **Thanh Xà hóa long** (T22, cụm 23: nghịch chuyển quốc vận, 4 giai đoạn Hóa Hình, Mãng, Giao, Long, có tuyến tình cảm) vào Q mục 24.5a; đổi bí mật Kim Phong thành "kẻ bị gạt luyện phù" và đại chiến Phù Lệnh (cụm 24, W25, Q 24.5b); thêm Phù Các và chiến tranh tổng (5.6) vào S.
- 2026-10-18 (bản 2, gộp): theo ý bạn gộp S và T thành một bản; giữ tên cổ trang cho cơ quan; đổi nguyên mẫu Âm Hồn Giáo (hãn quốc kiểu Mông Cổ, nghiêng ác) và Tử Lôi Quan (đảo quốc kiểu Anh); chín tông làm sâu; gia tộc, thương hội, vương triều theo nguyên mẫu; tôn giáo dùng tên thật, 9 tín ngưỡng, 3 ô mỗi vùng, quy tắc lồng, nơi thờ tự; giáo sĩ, Thần Chức đạo, sự kiện và chuỗi sự kiện chuyển sang Q mục 24. Chưa code.

---

## 15. Kế hoạch triển khai S1: Mạng quan hệ nhiều chiều (sẵn sàng code)

**Quyết định thứ tự (2026-10-18):** làm S trước R. S không phụ thuộc phần chưa có (chỉ cần F4, F2 đã xong); R1 đến R3 cần nền Q1 và R4 cần khung tuyến Q2. S1 lại cấp sổ ân oán và chiều `thong` cho R. Đường đi: **S1 → S2 → S3**; khi tới Q1 thì làm Q1.1 đến Q1.3 song song R1.

### 15.1 Mục tiêu và ranh giới của S1
- **Có:** `rel2` nhiều chiều, sổ ân oán, bậc quan hệ, hồ sơ cặp, hồ sơ thế lực, ma trận quan hệ (UI), kiểm thử, tương thích ngược.
- **Không đổi cân bằng:** `relV(a,b)` phải **trả đúng giá trị cũ** (các chiều mới mặc định 0 và trọng số 0 ở S1). Mọi sự kiện thế giới giữ nguyên. Chỉ **thêm ghi chép**.
- **Chưa làm ở S1:** đổi `declareWars` theo nhiều chiều, thù truyền đời có tác dụng, `dao` từ `gt` (S2), tôn giáo (S5), hiển thị trên `so-do-the-gioi.html` (S11).

### 15.2 Rào chắn quan trọng: không đụng bộ sinh số ngẫu nhiên
- `fac.rel(a, b)` hiện **gọi `rng.RI(-12, 12)` lần đầu có người hỏi cặp** nên thứ tự truy cập ảnh hưởng dòng số ngẫu nhiên. Nếu giao diện mở ma trận làm khởi tạo cặp mới thì **làm đổi diễn biến thế giới**.
- **Quy tắc:** mọi hàm đọc của `diplo` (giao diện, ma trận, kiểm thử) dùng `diplo.peek` **không gọi rng và không khởi tạo cặp**: nếu `f.rel[k]` chưa có thì trả mặc định xác định `tagBase(a, b)` (cùng công thức nhưng bỏ phần `rng.RI`) và đánh dấu `fresh`.
- `diplo.log` và các hàm ghi **không bao giờ gọi rng**.
- **Bằng chứng kiểm:** chạy cùng hạt giống trước và sau S1, hash `f.rel` + số chiến tranh + sử ký phải **trùng khít** (15.6).

### 15.3 Dữ liệu
`world.fac.rel2` (khởi tạo muộn, `{}` nếu chưa có; **không đổi `TT.VERSION`**):
```
rel2["a|b"] = { loi: 0, dao: 0, thong: 0, tin: 60, an: [ { m, k, v, t, heir? } ] }   // a < b theo id, như f.rel
```
- `tinh` **không lưu lại**: vẫn là `f.rel[k]` (giữ nguyên toàn bộ code cũ và bản lưu cũ).
- `an` tối đa **12** mục (D.DIPLO.logMax). Khi đầy thì bỏ mục cũ nhất **không** `heir` trước; mục `heir` (thù truyền đời) chỉ bị bỏ khi không còn mục thường.
- `tin` 0-100: mặc định 60, giảm khi bất tuân/đoạn tuyệt/bội ước, tăng khi giữ lời nhiều năm. Ở S1 chỉ hiển thị, chưa vào công thức.
- Cặp chưa có chuyện: không có bản ghi trong `rel2`, `peek` trả mặc định.

`D.DIPLO` (file mới `js/data/diplo.js`, chỉnh được):
```
dims: ['tinh','loi','dao','thong','tin']           // thứ tự hiển thị và tên chữ
w:    { tinh: 1, loi: 0, dao: 0, thong: 0 }        // S1: chỉ tinh có trọng số; S2 bật loi/dao/thong (0,3 / 0,3 / 0,2)
levels: [ {min: 60, id:'than_huu'}, {min: 35, ...}, ... ]   // bậc từ tổng hợp
kinds: { chien, hoa_nghi, thang, thua, diet, than_phuc, ket_minh, tan_minh, xung_dot, bo_mac, trung_phat,
         bat_tuan, doan_tuyet, tich_thu, cat_hang, ... } mỗi loại: nhãn, dấu (tốt/xấu), heir?, ảnh hưởng đến tin
logMax: 12
```
**Bậc quan hệ** (từ `total = clamp(tinh + 0,3 loi + 0,3 dao + 0,2 thong, -100, 100)`; S1 chỉ còn `tinh`):
| Tổng | Bậc |
|---|---|
| từ 60 | Thân hữu (nếu có `ally` thì "Đồng minh") |
| 35 đến 59 | Thân hữu |
| 12 đến 34 | Hòa hảo |
| -11 đến 11 | Trung lập |
| -34 đến -12 | Lạnh nhạt |
| -59 đến -35 | Bất hòa |
| -79 đến -60 | Thù địch |
| dưới -80 | Tử thù |
- Đang **chiến tranh** với nhau: nhãn thêm "(đang đánh nhau)"; bậc không hạ thấp hơn "Bất hòa" khi đang đồng minh cũ vừa bất hòa.
- Nhãn hiệp ước (Chủ, Chư hầu, Bảo hộ, Cống, Minh ước) đọc từ `TT.pact.of`.

### 15.4 API `TT.diplo` (file mới `js/systems/diplo.js`)
Nạp **sau** `pacts.js`, trước `ai.js` (sửa `js/files.js`); `js/data/diplo.js` nạp cùng nhóm dữ liệu sau `sects.js`.
| Hàm | Việc làm | Dùng rng |
|---|---|---|
| `key(a, b)` | khóa cặp `lo|hi` (không khởi tạo) | không |
| `peek(a, b)` | `{tinh, loi, dao, thong, tin, an, fresh}` chỉ đọc | không |
| `total(a, b)` | tổng hợp theo `D.DIPLO.w` (S1 = `tinh`) | không |
| `level(a, b)` | `{id, n, war, ally, pacts[]}` | không |
| `log(a, b, kind, v, text)` | ghi sổ ân oán (cap 12), cập nhật `tin` theo loại, trả bản ghi | không |
| `add(a, b, dim, n, why)` | cộng chiều; `dim='tinh'` đi qua `fac.relAdd`; chiều khác kẹp [-100, 100] | không |
| `history(a, b)` | sổ ân oán theo năm mới nhất trước | không |
| `cua(a, b)` | a kiêng dè b (suy từ `power`, không lưu) | không |
| `describe(a, b)` | một câu mô tả: bậc + chiều đậm nhất + ân oán gần nhất | không |
| `of(x, kind?)` | danh sách bạn, thù, chủ, chư hầu, đồng minh của một thế lực | không |
| `matrix(kinds?)` | `{ ids, cells[i][j] }` cho giao diện/kiểm thử | không |
| `migrate()` | tạo `rel2` rỗng nếu thiếu; gọi trong `fac.S()` | không |

### 15.5 Móc vào mô phỏng sẵn có (chỉ thêm ghi chép)
Sửa `fac.relAdd(a, b, n, why?)` nhận tham số thứ tư tùy chọn `why = [kind, text]`; nếu có thì gọi `diplo.log`. `fac.relV` đi qua `diplo.total` (cùng giá trị). Gắn `why` ở các chỗ gọi `relAdd` hiện có:
| Vị trí | Hiện tại | Ghi vào sổ |
|---|---|---|
| `tickRelations` xung đột nhỏ (`d <= -12`) | `relAdd(a,b,d)` | `xung_dot` |
| `tickRelations` kết minh | `a.ally`, `chron` | `ket_minh` (v=0) |
| `tickRelations` đồng minh nguội | xóa `ally` | `tan_minh` (v=0) |
| `startWar` | `relAdd(a,b,-25)` | `chien` + lý do chiến tranh |
| `endWar` hòa | `relAdd(a,b,15)` | `hoa_nghi` |
| `endWar` thắng/thua | `relAdd(a,b,-10)` | `thang` (bên thắng), `thua` (bên thua) |
| `endWar` thần phục (`vassalize`) | `pacts.js` | `than_phuc` |
| `destroy` (diệt môn) | `chron` | `diet` (bên diệt với bên bị diệt) + `heir: true` |
| `pacts.js` bỏ mặc | `relAdd(a,b,-3)` | `bo_mac` |
| `pacts.js` bất tuân | `defy=true`, `chron` | `bat_tuan` (giảm `tin`) |
| `pacts.js` trừng phạt | `relAdd(a,b,-8)` | `trung_phat` |
| `pacts.js` đoạn tuyệt | `relAdd(a,b,-40)` | `doan_tuyet` + `heir` nếu chư hầu |
| `tickHoi` tịch thu | `relAdd(x,t,-30)` | `tich_thu` |
| `tickHoi` cắt hàng | `relAdd(x,t,-8)` | `cat_hang` |
- Chuỗi mô tả lấy từ chính câu `chron` đã có (cắt gọn), không viết lại văn bản.
- Thế giới cũ (đã lưu): `rel2` rỗng, sổ ân oán bắt đầu từ lúc tải; không dựng lại quá khứ (có thể nhập từ `f.chron` theo từ khóa ở bản sau).

### 15.6 Giao diện (file mới `js/ui/diplo.js`, gộp vào tab Biên niên sử)
Quyết định của bạn (2026-10-18): **gộp vào tab "Biên niên sử"**, không thêm tab. `js/ui/diplo.js` xuất `ui.buildDiplo(box, c)`; `history.js` gọi hàm này để chèn mục **"Quan hệ thế lực"** (gập được) **trước** mục "Sử ký"; khóa vẽ lại của tab Biên niên sử thêm số mục sổ ân oán và cặp đang chọn.
- **Khóa vẽ lại:** thêm vào `key` của tab Biên niên sử: số mục sổ ân oán, năm, vùng người chơi biết, cặp đang chọn.
- **Ma trận:** hàng/cột là thế lực còn sống, sắp theo loại rồi vùng; bộ lọc loại (Tất cả / Triều / Tông / Gia tộc / Hội); ô tô màu theo bậc (xanh lục = thân, xám = trung lập, đỏ = thù), viền đậm nếu đang đánh nhau, chấm nếu có hiệp ước; **cuộn ngang** trên điện thoại.
- **Che theo hiểu biết:** chỉ hiện thế lực ở vùng người chơi **đã biết** (`c.knownRegions`) và tông/triều liên quan; cặp nằm ngoài hiểu biết hiện "chưa rõ".
- **Hồ sơ cặp** (bấm ô): bậc, các chiều bằng thanh chữ (không số), hiệp ước, ân oán theo năm (mới nhất trên), có chấm "thù truyền đời".
- **Hồ sơ thế lực** (bấm tên): bạn, thù, chủ, chư hầu, đồng minh, kẻ đang để mắt (`diplo.of`).
- **Hiển thị:** bậc và chữ, không hiện số (đã chốt); số cụ thể chỉ ở tooltip khi `TT.config.debug`.

### 15.7 Kiểm thử và bằng chứng
**Công cụ (không đẩy lên repo):** kịch bản Playwright trong thư mục scratchpad chạy Chromium có sẵn, mở `tests.html?only=S1`, chờ `window.__done`.
- Thêm vào `tests.html` tham số `?only=<từ khóa>`: `test()` bỏ qua bài không khớp (để lặp nhanh, không ảnh hưởng chạy đầy đủ).
- **Đường cơ sở trước khi sửa code:** với 6 hạt giống (301, 911, 77, 5, 12, 33) dựng thế giới, chạy 300 năm `TT.fac.yearly()`, lưu hash của `f.rel`, số chiến tranh, độ dài `chron`, trạng thái thế lực. **Chạy lại sau S1 phải khớp từng hash** (chứng minh S1 không đổi cân bằng).
Bài kiểm thử mới `Mạng quan hệ nhiều chiều (S1)`:
1. Hash 6 hạt giống trùng đường cơ sở (hoặc so ngay trong bài bằng cách tắt móc ghi sổ).
2. `peek` **không khởi tạo cặp và không làm đổi rng**: gọi `peek` cho mọi cặp rồi chạy 50 năm, kết quả trùng lần chạy không gọi.
3. Ma trận đối xứng (`total(a,b) === total(b,a)`), không NaN, trong [-100, 100].
4. `relV` trùng `f.rel` với mọi cặp (S1 chưa có chiều khác).
5. Sổ ân oán: `startWar` ghi `chien` cho cả hai chiều xem; đầy 12 thì bỏ mục thường cũ trước; `heir` được giữ.
6. Bậc quan hệ đúng ngưỡng; `ally` và `war` ghi đè nhãn.
7. `tin` giảm khi bất tuân/đoạn tuyệt; kẹp 0-100.
8. Lưu/tải: `rel2` giống hệt sau `snapshot`/`restore`; bản lưu cũ không có `rel2` vẫn chạy.
9. Hiệu năng: 400 năm dưới 1 giây (mốc hiện tại khoảng 260 ms cho 300 năm).
**Chạy đầy đủ** `tests.html` một lần ở cuối S1 (khoảng 3 phút): mọi bài cũ vẫn đạt (93 bài, cộng bài mới). **Kiểm giao diện** bằng Playwright: mở `index.html`, mở tab Biên niên sử và mục "Quan hệ thế lực", chụp màn hình máy tính và di động, kiểm không lỗi console.

### 15.8 Các bước làm S1 (theo thứ tự, mỗi bước chạy được)
1. **Đường cơ sở:** viết kịch bản băm 6 hạt giống, chạy trên code hiện tại, lưu kết quả (scratchpad).
2. **Bộ chạy kiểm thử:** thêm `?only=` vào `tests.html`; kịch bản Playwright chạy được `tests.html` và đọc kết quả.
3. **Dữ liệu:** `js/data/diplo.js` (`D.DIPLO`); thêm vào `js/files.js`.
4. **Hệ thống:** `js/systems/diplo.js` (API 15.4), thêm vào `js/files.js`; `fac.S()` gọi `diplo.migrate`.
5. **Móc:** sửa `fac.relAdd`, `fac.relV`, và 14 chỗ ở 15.5; so lại hash với đường cơ sở (phải trùng).
6. **Bài kiểm thử mới** (15.7) trong `tests.html`; chạy `?only=S1` đến khi xanh.
7. **Giao diện:** `js/ui/diplo.js` (`ui.buildDiplo`), thêm vào `js/files.js` (nhóm giao diện), sửa `js/ui/history.js` để gọi; chạy `index.html`, kiểm bằng Playwright, mở tab Biên niên sử, chụp màn hình máy tính và di động.
8. **Chạy đầy đủ** `tests.html`; sửa lỗi nếu có.
9. **Tài liệu:** ghi "Đã làm" ở mục này, cập nhật `KE-HOACH.md` (S1 xong), nhật ký; chụp snapshot theo quy ước dự án.
10. **Đẩy lên GitHub** theo quy trình trong `CLAUDE.md` (fetch và merge main, push, đồng bộ local).

Ước lượng: khoảng 1,5 lượt làm việc (như mục 11).

### 15.9 Rủi ro riêng của S1
| Rủi ro | Cách giảm |
|---|---|
| Làm đổi dòng rng, vỡ các bài phụ thuộc hạt giống | `peek` không rng; so hash 6 hạt giống trước và sau; chạy đầy đủ `tests.html` |
| Bản lưu tăng kích thước | Chỉ lưu cặp có chuyện; cap 12 mục mỗi cặp (tối đa khoảng 406 x 12 mục, thực tế ít hơn nhiều) |
| Nhãn sai vì dữ liệu cũ | Thế giới cũ bắt đầu sổ từ lúc tải, không bịa quá khứ |
| Giao diện nặng trên điện thoại | Lọc theo loại, mặc định chỉ triều + tông trong vùng đã biết; cuộn ngang |
| Gắn `why` sót chỗ gọi `relAdd` | Rà bằng `grep relAdd` và bài kiểm thử đếm số loại ghi sổ sau 300 năm |

### 15.10 Lộ trình tổng thể
Thứ tự các đợt, hạ tầng đường cơ sở, cổng chơi thử, chỉ tiêu và ước lượng của toàn bộ Q, R, S, E, F nằm ở [Z-lo-trinh-trien-khai](Z-lo-trinh-trien-khai.md). S1 là **Đợt 1**; **Đợt 0** (công cụ chạy kiểm thử và hash cơ sở) làm trước.

### 15.11 Sau S1 (xem trước)
- **S2:** bật chiều `dao` từ `gt` và chuyển điều kiện gia nhập/trục xuất sang độ hợp giá trị; thêm `gt`, công–tội cho 9 tông; cơ quan tên cổ; gia tộc `kieu`.
- **S3:** quốc vận và nho khí (`world.fac.nat`), phản phệ, thiên mệnh; đo cân bằng bật/tắt như F4.
