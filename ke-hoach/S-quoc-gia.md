# S. Hệ thống Quốc gia: quốc vận, nho khí, quân đội, triều chính, và mạng quan hệ của mọi thế lực

- Trạng thái: Chờ duyệt (mới có kế hoạch, chưa code)
- Ngày lập: 2026-10-18
- Liên quan: [P-nghia-vu-dan-so](P-nghia-vu-dan-so.md) (dân số, hiệp ước: nền của hệ này), [M-tong-mon](M-tong-mon.md) (M5b liên tông: làm chung ở chặng S5), [KICH-BAN-THE-GIOI](../KICH-BAN-THE-GIOI.md) (vương triều, chiến tranh, thời đại), [N-tai-nguyen-ban-do](N-tai-nguyen-ban-do.md) (linh mạch, mỏ), [E-kinh-te](E-kinh-te.md) (thuế, cung cầu), [G-nhat-bao](G-nhat-bao.md) (tin tức), [Q-cot-truyen](Q-cot-truyen.md) (tuyến truyện thế giới), [B-nghe-nghiep](B-nghe-nghiep.md), `js/systems/factions.js`, `js/systems/pacts.js`, `js/systems/population.js`

## 1. Yêu cầu của bạn
Lập kế hoạch cho **hệ thống quốc gia**, gồm:
1. **Quốc vận.**
2. **Nho khí.**
3. **Sức mạnh đặc biệt của quân đội**, có thể đối kháng với tu sĩ nhưng khó.
4. Các ý tưởng khác làm được với hệ thống quốc gia.
5. **Liên thông với M5b** (liên tông).
6. Làm **mối quan hệ chi tiết của tất cả thế lực**.

Cách làm theo quy ước của dự án: viết kế hoạch và các chặng trước, chưa code. Chờ bạn duyệt rồi mới làm.

## 2. Hiện trạng (đọc code ngày 2026-10-18)
Đã có và dùng lại được:
- **Vương triều** (`kind: 'trieu'`, 9 cái, mỗi vùng một): chỉ có `power`, `unity`, `wealth`, `tag`, `leader`, `state`. Không bao giờ diệt, thua trận thì "đổi chủ" (reset chỉ số, đổi người đứng đầu và tag).
- **Dân số ẩn (F4)** theo vùng: `n`, `mood`, `food`; `taxPull` kéo kho triều; `milMul` nhân quân số vào sức mạnh khi đánh nhau; dân tâm dưới 20 thì nổi loạn.
- **Hiệp ước (F2)**: cống, thuế, chư hầu, minh ước, bảo hộ, có `strain` (oán), bất tuân, đoạn tuyệt, `rifts`.
- **Quan hệ**: mỗi cặp thế lực chỉ có **một số** `rel` (-100..100) trong `world.fac.rel`, cộng danh sách `ally` (tối đa 2). Không có lý do, không có lịch sử ân oán, không có nhiều chiều.
- **Chiến tranh**: sức mạnh một bên = `power x unity x wealth x milMul` cộng 30% power đồng minh. Không có tướng, quân chủng, trận pháp. Người chơi chỉ "bị cuốn vào" qua hộp quyết định.
- **M5b liên tông**: chưa làm. M-tong-mon mục 3.7 chỉ ghi ý (minh ước, giải đấu 4 hoặc 10 năm, đại chiến có hậu quả).

Chỗ trống cần lấp:
1. Triều chỉ là ba con số. Chưa có "quốc" theo nghĩa có thiên mệnh, văn hóa, quân đội, triều đình.
2. Chưa có lý do thế giới phàm không bị tu sĩ thống trị. Cần cơ chế khiến quân đội phàm và tu sĩ **kiềm chế lẫn nhau**.
3. Chưa có vai trò nào cho người chơi không đi đường tu thuần (nho sinh, quân nhân, quan lại).
4. Quan hệ giữa các thế lực mỏng. Người chơi không đọc được **vì sao** hai bên ghét nhau.
5. Liên tông (M5b) sẽ thiếu nền nếu làm riêng. Nên làm cùng một mạng quan hệ.

## 3. Thiết kế

### 3.1 Khái niệm: "Quốc" là vương triều có thêm thân thể
Mỗi vương triều (9 cái) được thêm một khối `nat` (khởi tạo muộn, lưu ở `world.fac.nat[id triều]`):

| Trường | Ý nghĩa | Miền |
|---|---|---|
| `van` | **Quốc vận** (khí số của cả nước) | 0-100 |
| `nho` | **Nho khí** (văn trị, chính khí, nền học vấn) | 0-100 |
| `quan` | **Quân lực** (quân số, phẩm chất, tướng, trận) | xem 3.4 |
| `sat` | **Sát khí** của quân (tích từ chiến thắng, hao theo thời gian) | 0-100 |
| `chinh` | **Triều chính**: hoàng quyền, phe phái, người kế vị | xem 3.5 |
| `sach` | **Quốc sách** (đạo thống chủ đạo, chính sách với tu sĩ) | chọn từ danh sách |
| `mach` | **Long mạch** (linh mạch quốc thổ, nối N) | 0-5 |

`power` hiện có **không bỏ**, nhưng từ nay được tính ra từ các trường này (giữ tên để code cũ chạy), xem 3.9.

### 3.2 Quốc vận
Quốc vận là "khí số" của một nước, thể hiện bằng thang bậc để người chơi đọc được:
| Bậc | Quốc vận | Mô tả |
|---|---|---|
| Rồng bay | 80+ | Quốc thái dân an, ít thiên tai, vua tôi đồng lòng |
| Thịnh | 60-79 | Ổn định, thu thuế tốt |
| Bình | 35-59 | Bình thường |
| Suy | 15-34 | Thiên tai nhiều, dân bất mãn, triều đình lục đục |
| Mạt | dưới 15 | Sắp mất mệnh: đổi chủ, chia cắt hoặc bị thôn tính |

**Nguồn tăng** (mỗi năm, hệ số ở `D.NATION`):
- Dân tâm cao, mùa màng tốt (đọc từ F4).
- Nho khí cao (văn trị làm vận vững).
- Người đứng đầu có đức và tài (thuộc tính `de`, `tai` mới của người đứng đầu).
- Thắng trận chính nghĩa (đánh giặc ngoài, dẹp loạn), giữ lời hiệp ước.
- Long mạch tốt, thời đại Thịnh thế hoặc Linh khí phục hồi.
- Tông chính đạo trong nước nộp cống đều và không gây loạn.

**Nguồn giảm**:
- Thiên tai, dịch, nổi loạn, dân tâm thấp.
- Bại trận, mất đất, bị thần phục, mất người đứng đầu.
- Hôn quân, gian thần, thuế nặng, vi phạm hiệp ước.
- **Tu sĩ làm loạn phàm triều** (xem "phản phệ" dưới đây).
- Nội chiến, cướp ngôi.

**Tác dụng của quốc vận:**
1. **Chỗ dựa của thế lực:** nhân vào sức mạnh quân (3.4), tỉ lệ thiên tai nhẹ đi khi vận cao, dân tâm hồi nhanh.
2. **Nhân vật trong nước:** ở nước vận Thịnh trở lên, may mắn nền (`baseLuck`) tăng nhẹ và nhiệm vụ do triều giao có thưởng cao hơn. Ở nước vận Mạt, nguy hiểm vùng +1 (hợp với dân tâm thấp đã có).
3. **Thiên mệnh:** quốc vận xuống dưới 15 trong 3 năm liên tiếp thì "mất mệnh": đổi chủ (đã có), thêm khả năng **chia cắt** (một triều tách thành hai nửa yếu, kế hoạch sau) hoặc bị nước láng giềng **thôn tính** (thành `chu_hau` thật, nối F2).
4. **Phản phệ quốc vận (cơ chế cân bằng cốt lõi):**
   Tu sĩ giết vua, đánh tan quân triều, tàn sát dân phàm, phá long mạch thì bị **phản phệ**: nghiệp (`c.nghiep`) tăng, đạo tâm tổn thương, khó đột phá một thời gian, tu vi thụt. Mức phản phệ tỉ lệ với quốc vận của nước đó và độ lớn việc đã làm.
   - Đây là lý do lý thuyết khiến tu sĩ cao không thống trị phàm giới: ra tay với một nước vận Rồng bay là **tự hại mình**.
   - Nước vận Mạt thì phản phệ gần như hết: tu sĩ "thế thiên hành đạo", cướp ngôi trơn tru. Vì vậy nước suy dễ bị tông môn thao túng.
   - Hiển thị cho người chơi: cảnh báo trước khi chọn các hành động có phản phệ, kèm mức (nhẹ, nặng, rất nặng).
5. **Long mạch:** mỗi nước có `mach` (nối linh mạch ở N). Cắt long mạch (một nhiệm vụ rất nguy hiểm) giảm mạnh quốc vận nhưng có cái giá phản phệ lớn. Giữ long mạch tốt thì vận hồi nhanh.

### 3.3 Nho khí
Nho khí là sức mạnh của **văn trị và chính khí**: sách vở, thư viện, khoa cử, lễ nghĩa. Nó là **đối trọng** của tà khí, yêu khí và sát khí.

**Quy mô quốc gia (`nho`, 0-100):**
- Tăng nhờ: thư viện, khoa cử đều đặn (3 năm một khoa), quan lại liêm, người đứng đầu hiếu học, thời Thịnh thế.
- Giảm nhờ: chiến loạn, đốt sách (chính sách "văn cấm"), quan tham, mất mùa kéo dài (dân không đi học).
- Tác dụng:
  - Làm **vận vững**: nho cao thì quốc vận ít dao động, hồi nhanh.
  - **Chính khí trấn tà**: ở thành trì của nước nho cao, âm khí, tà thuật, yêu khí bị giảm hiệu lực (tu sĩ đi đường Âm, tà đạo bị trừ). Âm Hồn Giáo ở Vụ Trạch là kẻ đối nghịch tự nhiên của nho quốc.
  - **Vùng cấm đánh nhau trong thành:** nước nho cao có "khí cấm", tu sĩ động thủ ở trong thành bị trừng phạt nặng hơn (nối hệ truy nã, G).
  - Mở **quan chế**: nước nho cao có thêm chức văn quan cho người chơi (xem 3.8).
  - Giảm lính cần nuôi: quan văn giỏi thì dân tâm giữ được mà không cần nhiều quân.

**Quy mô cá nhân: Văn vị và Hạo nhiên khí** (đề xuất, nhỏ, chờ bạn chốt ở mục 8):
- Người chơi và NPC có thể có `van` (văn vị): 0 Dân thường, 1 Đồng sinh, 2 Tú tài, 3 Cử nhân, 4 Tiến sĩ, 5 Đại nho, 6 Thánh nhân (rất hiếm, gần như chỉ truyền thuyết).
- Văn vị cao cho `hao` (hạo nhiên khí): tăng đạo tâm nền, chống tâm ma, giảm tác hại của tà thuật, và tăng sức thuyết phục (nhiệm vụ ngoại giao, hòa nghị).
- **Nho tu** không đi theo thang Luyện Khí..Phi Thăng. Đây là con đường **riêng** hỗ trợ thêm cho tu sĩ (ví dụ một Trúc Cơ có văn vị Tiến sĩ vẫn được hưởng bảo hộ chính khí). Bạn cần quyết định có tách thành một đường tu độc lập hay chỉ là "bổ trợ" (mục 8).

### 3.4 Quân đội và sức mạnh đặc biệt: Quân trận

**Mục tiêu thiết kế:** quân đội phàm **đối kháng được tu sĩ nhưng khó**, và đánh đổi nặng. Không để quân vô địch, không để quân vô dụng.

**Quân lực của một nước:**
```
quân_số   = n x tỉ_lính                           (dân số F4; 3% bình thường, 6% thời chiến)
phẩm      = 0,6 (dân binh) đến 1,6 (tinh binh)   (theo luyện tập, ngân khố, quốc sách)
tướng     = số tướng tu sĩ trong quân (Kim Đan trở lên cho quân đoàn lớn)
trận      = bậc quân trận đã học (0..3)
sát khí   = 0..100, tích từ chiến thắng, hao dần khi nhàn rỗi
tiếp tế   = tình trạng lương (phụ thuộc food, kho, đường vận chuyển)
```

**Chiến lực quân trận** của một quân đoàn gồm `q` lính ra trận:
```
CL = q x phẩm x (1 + 0,5 x trận) x (1 + 0,3 x sat/100) x (0,7 + 0,6 x quốc_vận/100) x tiếp_tế
```
`q` bị chặn bởi sức chứa chiến trường và số lính nước đó có.

**Bảng "bao nhiêu lính tương đương một tu sĩ"** (con số khởi điểm, chỉnh ở `D.NATION.unit`):
| Cảnh giới tu sĩ | Lính tương đương (chiến lực CL cần) | Ghi chú |
|---|---|---|
| Luyện Khí | 5 | Một đội nhỏ đã bắt được |
| Trúc Cơ | 60 | Một tiểu đội có tướng |
| Kim Đan | 2.000 | Cần quân trận cơ bản, thương vong lớn |
| Nguyên Anh | 30.000 | Cần đại quân tinh binh + đại trận + soái ấn + quốc vận Thịnh; thắng cũng thảm |
| Hóa Thần | 400.000 | Gần như cả đạo quân của một nước lớn; sát khí và quốc vận tối đa; một lần dùng thì nước đó khó gượng dậy |
| Phi Thăng | không | Phàm quân không thể |

Hiểu thế này: **một Kim Đan đơn độc có thể bị vây giết** nếu đi vào thành quân; một Nguyên Anh phải cẩn thận; Hóa Thần thì cả nước phải liều. Trung Châu có khoảng 12 triệu dân, 3% lính là 36 vạn, nên chỉ nước lớn nhất mới dồn nổi cho một Hóa Thần, đúng với cảm giác "cực khó".

**Cách tu sĩ đối phó quân (để cuộc đối kháng có chiều sâu):**
- **Ám sát tướng, đốt lương, phá trận nhãn** (nhiệm vụ nguy hiểm): giảm `trận`, `tiếp tế`, `sat` cho nhiều cảnh giới thấp hơn nhiều.
- **Tránh đánh trận mở:** tu sĩ cao thắng nhờ không giao chiến chính diện ở bình nguyên (địa hình núi, rừng, đầm, đảo làm giảm `trận`; vùng Vụ Trạch, Nam Lâm, Lôi Đảo, Tây Thiên Sơn có lợi cho tu sĩ).
- **Pháp bảo và thiên kiếp:** pháp bảo bản mệnh phẩm cao, và tông môn có đại trận hộ sơn cộng vào "lính tương đương" của tông đó.
- **Dùng phản phệ quốc vận như ràng buộc:** tu sĩ đánh thắng quân vẫn bị nghiệp, nên không ai thích làm. Chỉ nước vận Mạt hoặc kẻ liều mới bị tu sĩ "dọn".

**Cách quân đội đối phó tu sĩ (để quân có bản sắc):**
- **Quân trận (tăng bậc 1..3):** 1 Trận Hợp Kích (cơ bản), 2 Trận Sát Khí (gom sát khí của hàng nghìn người thành một đòn), 3 Đại Trận Quốc Vận (gắn quốc vận, chỉ mở được một lần mỗi N năm).
- **Khí giới đặc thù:** nỏ liên châu, pháo tụ linh, kiếm trận, nơi có kỹ nghệ cao (xem 3.6).
- **Tướng tu sĩ:** triều cung phụng hoặc thu biên tu sĩ làm tướng, làm quân sư; đây là lúc tông và triều liên thông.
- **Kết hợp với thiên thời:** vận Thịnh nhân thêm, vận Mạt thì quân trận tự rã.

**Hậu quả khi dùng quân trận chống tu sĩ:**
- Thương vong lớn (tỉ lệ theo hệ số lính tương đương), kéo `mood` xuống, hao `sat`, hao ngân khố, đôi khi mất tướng.
- Thắng tu sĩ lớn thì được **uy danh** (quốc vận +, tông ngần ngại), nhưng cũng sinh **thù truyền đời** với tông đó (ghi vào sổ ân oán, xem 3.7).

**Người chơi chạm vào quân đội ở đâu (xem 3.8):** nhập ngũ, thăng cấp, làm tướng; hộ tống quân lương; bị vây; làm quân sư; ám sát tướng; hoặc làm kẻ thù của quân.

### 3.5 Triều chính và các ý tưởng khác của hệ quốc gia
Danh sách này là **kho ý tưởng có thứ tự ưu tiên**; bạn chọn cái nào làm trước (mục 8).

1. **Triều chính (cao):** hoàng quyền (0-100) đối trọng với quyền thần, thế gia, tông môn. Kế vị (thái tử, tranh ngôi, loạn cung đình). Hoàng quyền yếu thì quyền thần hoặc tông môn thao túng, quốc vận tụt dần. Gắn với `leader` hiện có; `succession` mở rộng.
2. **Quốc sách với tu sĩ (cao):** mỗi triều chọn một chính sách (đổi được hiếm hoi, hậu quả dài):
   - **Tự do:** tu sĩ đi lại thoải mái, thuế thấp, nhưng dễ loạn.
   - **Thu biên (cung phụng):** tu sĩ vào làm quan hoặc tướng, nhận bổng; triều mạnh nhưng tông bất mãn.
   - **Hạn chế:** đăng ký tu sĩ, cấm tư đấu trong thành; có truy nã.
   - **Trấn áp:** săn tà tu, ép tông môn nộp cống nặng; dễ nổ chiến tranh.
3. **Quốc giáo / đạo thống chủ đạo (trung):** Nho, Phật, Đạo, Pháp (luật), Binh. Mỗi cái cộng nhẹ cho nho khí hay quân lực hay vận, và quan hệ với tông tương thích. Phần này chỉ là nhãn và hệ số, rẻ.
4. **Bản sắc từng nước (cao, chủ yếu là dữ liệu):** để 9 nước khác nhau thật, không chỉ tên:
   | Vùng | Bản sắc quân và quốc đề xuất |
   |---|---|
   | Trung Châu | Nho khí cao, quân đông nhưng phẩm trung bình, triều chính phức tạp |
   | Đông Hải | Thủy quân, thương nghiệp, thuế thương mại, quân ít mà nhanh |
   | Tây Thiên Sơn | Sơn binh tinh nhuệ, kiếm trận, ít dân |
   | Nam Lâm | Nghĩa quân, độc dược, du kích, khó chinh phục |
   | Bắc Cực Băng Nguyên | Băng kỵ, rất ít dân, nhưng khắc nghiệt nên phẩm cao |
   | Hỏa Diệm Sơn | Hỏa khí, khí giới tốt, kỹ nghệ rèn |
   | Hoang Mạc Kim Sa | Kỵ binh du mục, cơ động |
   | Vụ Trạch | Quân hỗn tạp, âm khí, nhiều tà tu cung phụng |
   | Lôi Đảo | Lôi pháo, trận sấm, ít quân nhưng sát khí cao |
5. **Gián điệp và mật thám (trung):** mỗi nước có mạng lưới tình báo, tung tin đồn, ly gián, nằm vùng. Nối Nhật báo (G) và hệ tin đồn.
6. **Ngoại giao và sứ giả (trung):** sứ đoàn, quốc thư, hôn nhân chính trị (`hon_uoc` đã nêu ở F2 mà chưa làm), con tin, cống sứ. Người chơi làm sứ giả là một nghề (bảng Ngoại vụ).
7. **Khoa cử và quan chế (trung):** đường làm quan cho người phàm, nối B (nghề). Ba tầng quan (huyện, châu, triều), có thể thăng, bị cách, bị hại.
8. **Biên phòng và cửa ải (thấp):** ải ở tuyến liền kề (`D.EDGES`) có quân đồn trú; mở, siết, đóng ải theo quan hệ, nối thuế cửa ải (E).
9. **Thiên hạ đại thế (thấp):** khi một nước thôn tính được 2 vùng, xuất hiện danh xưng "bá chủ"; thống nhất toàn thiên hạ là mục tiêu cực khó, gắn thời đại. Chỉ làm khi mọi thứ khác ổn.
10. **Lễ nghi và tế lễ (thấp):** tế trời, tế long mạch, đổi niên hiệu: các sự kiện định kỳ cộng quốc vận hoặc làm lộ điềm báo. Là gia vị, không cần cơ chế nặng.

### 3.6 Liên thông với M5b (liên tông)
M5b trước đây là "minh ước, giải đấu, đại chiến có hậu quả". Với hệ quốc gia, M5b trở thành **tầng thứ ba của cùng một mạng quan hệ**, không làm riêng:

1. **Tông ↔ triều** (mới):
   - Hiệp ước cống nạp (đã có) thêm bên triều: bảo hộ, trọng dụng, hoặc đàn áp.
   - Tông có thể là **quốc sư** (trên triều, giữ pháp trận của nước), **cung phụng** (nhận bổng), hoặc **ngoài vòng pháp luật** (chống triều).
   - Tông âm mưu **thao túng triều** (nâng người của mình lên ngôi), chịu phản phệ khi triều còn vận, trơn tru khi vận Mạt.
2. **Minh ước liên tông** (thuộc M5b): đồng minh có thêm "ước pháp": cùng phòng thủ, chia mỏ, cho mượn đệ tử. Dùng chung `pacts` với triều.
3. **Giải đấu liên tông** (thuộc M5b): bảo trợ bởi một triều (đại hội thiên hạ) hoặc minh chủ. Thắng giải cộng uy tín (`rel` ân), tông thua mất mặt. Phần thưởng có tài nguyên (mỏ, tư cách).
4. **Đại chiến liên tông** (thuộc M5b): kết quả tính cả việc **triều đứng ngoài hay nhúng tay** (cho mượn quân, cấm vận, hoặc đánh cả hai). Diệt tông hay thôn tính mang hậu quả cho quan hệ cả mạng.
5. **Thiên hạ công ước** (mới, nối 3.4): các tông và triều ký một "điều ước ngầm" cấm tu sĩ cao đánh phàm triều. Vi phạm thì bị liên minh tông môn **và** quân đội truy cứu. Đây là hiện thân thể chế của "phản phệ" ở 3.2.
6. **Thứ tự làm:** S1 (mạng quan hệ chi tiết) làm trước, rồi S5 (M5b) cắm lên, nên M5b ngắn hơn nhiều so với làm riêng.

### 3.7 Mạng quan hệ chi tiết của tất cả thế lực
Hiện tại mỗi cặp chỉ có một số. Thay bằng một **bản ghi nhiều chiều** nhưng vẫn có số tổng hợp để code cũ không đổi.

**Phạm vi:** mọi thế lực sống: 9 vương triều, 9 tông, 8 gia tộc, 3 thương hội (khoảng 29, nên có tối đa khoảng 406 cặp). Chỉ lưu cặp có chuyện (thưa), phần còn lại suy ra từ mặc định.

**Bản ghi một cặp** (`world.fac.rel2["a|b"]`):
| Chiều | Ý nghĩa | Nguồn |
|---|---|---|
| `tinh` Thiện cảm | Cảm xúc chung (thay `rel` cũ) | mọi thứ cộng dồn |
| `loi` Lợi ích | Có chung lợi hay tranh lợi (mỏ, thương mại, địa bàn) | tài nguyên, thương hội, vùng |
| `dao` Đạo thống | Hợp hay khắc về đạo (chính/tà, Nho/Phật/Đạo, nho vs âm) | tag, quốc giáo, nho khí |
| `cua` Kiêng dè | Sợ hay coi thường (hơn kém sức mạnh) | so sánh sức mạnh, tướng, quân trận |
| `thong` Thông gia / huyết thống | Hôn nhân chính trị, con tin, họ hàng | `hon_uoc`, sự kiện |
| `an_oan` Sổ ân oán | Danh sách sự kiện có ngày: cứu, phản, giết, nợ, nhục, hòa | chiến tranh, hiệp ước, nhiệm vụ |
| `nghia` Nghĩa vụ | Các hiệp ước đang có giữa hai bên (liên kết tới `pacts`) | F2 |
| `tin` Tín nhiệm | Đối phương có giữ lời không (lịch sử bất tuân) | `pacts.strain`, lịch sử |

**Bậc quan hệ** hiển thị (suy ra từ tổng hợp, chiều đậm nhất quyết định lời mô tả): Đồng minh, Thân hữu, Hòa hảo, Trung lập, Lạnh nhạt, Bất hòa, Thù địch, Tử thù; thêm nhãn hiệp ước: Chủ, Chư hầu, Bảo hộ, Cống, Thông gia.

**Số tổng hợp (giữ tương thích):** `relV(a,b) = clamp(tinh + 0,3 x loi + 0,3 x dao + 0,2 x thong + ân oán, -100, 100)`. Code cũ vẫn gọi `relV`, `relAdd`; `relAdd` nhận thêm tham số "chiều" và "lý do" (mặc định `tinh`).

**Sổ ân oán:** mỗi cặp giữ tối đa 12 mục (cũ đẩy ra), mỗi mục `{năm, loại, mức, lời}`; chiến tranh, hòa nghị, hiệp ước, giúp đỡ, phản bội, diệt người đứng đầu, ám sát, thôn tính đều ghi. **Thù truyền đời** (mức rất nặng) giảm chậm hơn nhiều so với thù thường, và tồn tại sau khi người đứng đầu đổi.

**Hiển thị:**
- **Ma trận quan hệ** (29 x 29, tô màu, lọc theo loại thế lực).
- Bấm vào một ô thì xem **hồ sơ cặp**: bậc quan hệ, các chiều, sổ ân oán theo năm, hiệp ước đang có, chiến tranh đã qua.
- Hồ sơ từng thế lực: bạn bè, kẻ thù, chủ, chư hầu, liên minh, kẻ đang để mắt.
- `so-do-the-gioi.html` vẽ thêm đường ân oán và hiệp ước.

**Lợi ích cho game:** quyết định chiến tranh (`declareWars`) chọn đối thủ theo nhiều chiều (không chỉ rel thấp nhất), có lý do và kẻ ủng hộ rõ; tin tức nêu đúng nguyên do ("hai nhà thù nhau từ năm 41 vì vụ mỏ"); người chơi đọc được thế cờ.

### 3.8 Người chơi chạm vào hệ quốc gia ở đâu
Giữ nguyên nguyên tắc cũ: người chơi **không điều khiển nước** trong đợt này (làm chưởng môn, lập tông, làm vua thuộc M6 trở đi). Người chơi vào cuộc qua:
1. **Nhập ngũ và đường võ quan:** lính, đội trưởng, tướng; chiến công; bị trưng binh; chỉ huy hộ tống quân lương; bị vây giữa quân trận.
2. **Đường nho quan:** thi cử, đỗ đạt, nhậm chức; kết thân hay đối đầu quyền thần; nho khí cá nhân.
3. **Sứ giả và quân sư:** đưa quốc thư, hòa nghị (nối bảng Ngoại vụ và F2), mưu sĩ cho tướng.
4. **Tu sĩ trong và ngoài pháp luật:** đăng ký, được cung phụng, hay bị truy nã theo quốc sách; cảnh báo phản phệ quốc vận.
5. **Dân thường:** thuế qua giá và phí ải, trưng binh, tị nạn, theo dõi quốc vận (qua thiên tai, tin tức).
6. **Nhiệm vụ của thế lực:** hộ tống thu cống, đòi nợ cống, dẹp loạn, cắt long mạch (rất nguy hiểm), ám sát tướng, đốt lương, bảo vệ thư viện.
7. **Hồ sơ tín nhiệm (F5):** mỗi thế lực có điểm tín nhiệm với bạn; nay thêm tai tiếng khi bạn dính phản phệ.

### 3.9 Cách ghép vào mô phỏng sẵn có (để không phá cân bằng)
Phải giữ các chỉ tiêu đã đo: khoảng 52 chiến tranh và 10 diệt vong mỗi 300 năm (±25%), nhịp hỏi người chơi dưới 6 lần mỗi phút, phân tầng NPC Trúc Cơ+ khoảng 2%, 5%, 18%.
- `power` của triều = hàm của `quân_lực x quốc_vận x nho` được **hiệu chỉnh** để trung bình giống `power` cũ. Làm bằng cách thêm hệ số bù và đo so sánh với bản tắt (như cách đã đo ở F4: bật/tắt cho cùng 12 hạt giống).
- `strength()` trong chiến tranh dùng thêm `CL` thay phần `milMul`. Chênh lệch giữa các nước nay có thể giải thích được.
- Các hiệu ứng lên người chơi (may mắn, nguy hiểm, phản phệ) đều **nhỏ, có trần**, và mọi hộp quyết định mới đi qua kênh tầng 2 có sẵn, không tăng nhịp.
- Mô phỏng cấp năm, không đụng vòng NPC. Mục tiêu: 400 năm game dưới 1 giây (hiện khoảng 260 ms cho 300 năm).

## 4. Kỹ thuật (dự kiến)
- **Dữ liệu mới:** `js/data/nation.js` (`D.NATION`: ngưỡng, hệ số, bảng lính tương đương, quốc sách, quốc giáo, bản sắc 9 nước, văn vị), `js/data/natevents.js` (sự kiện và hộp quyết định: phản phệ, nhập ngũ, thi cử, ám sát tướng, cắt long mạch...).
- **Hệ thống mới:** `js/systems/nation.js` (`TT.nation`: quốc vận, nho khí, quân, triều chính, quốc sách, năm), `js/systems/diplo.js` (`TT.diplo`: mạng quan hệ nhiều chiều, sổ ân oán, bậc quan hệ), `js/ui/nation.js` (tab hoặc cửa sổ Quốc gia và Ma trận quan hệ).
- **Sửa:** `factions.js` (`strength`, `declareWars`, `endWar`, `relV`/`relAdd` đi qua `diplo`), `pacts.js` (ghi ân oán, strain nhìn sang `tin`), `population.js` (đọc `nat`), `sect.js` (tông ↔ triều, M5b), `so-do-the-gioi.html` (vẽ lại).
- **Lưu trữ:** `world.fac.nat`, `world.fac.rel2` khởi tạo muộn như F4/F2, **không đổi `TT.VERSION`**; bản lưu cũ tự dựng `nat` và `rel2` ở năm kế (dựng `rel2` từ `rel` cũ, ân oán trống).
- **Tương thích:** `relV`, `relAdd`, `ally`, `vassal`, `pacts` giữ nguyên giao diện để code và kiểm thử cũ chạy.
- **Kiểm thử:** thêm bài vào `tests.html`: quốc vận trong khoảng, rơi vào Mạt thì đổi chủ, nho khí giảm thiệt hại tà khí, bảng lính tương đương (Kim Đan bị vây thua, Hóa Thần thắng đại quân nhỏ), phản phệ đúng mức, ma trận đối xứng, `rel2` lưu/tải, mô phỏng 400 năm nhiều hạt giống, tương thích `relV`.

## 5. Các chặng (mỗi chặng chạy và kiểm thử được)
- [ ] **S0 Duyệt:** bạn chọn ưu tiên ở mục 3.5 và trả lời mục 8.
- [ ] **S1 Mạng quan hệ nhiều chiều:** `diplo.js`, `rel2` dựng từ `rel`, sổ ân oán ghi từ chiến tranh và hiệp ước hiện có, bậc quan hệ, ma trận và hồ sơ cặp. Chưa đổi cân bằng. (Làm trước vì M5b và các phần sau đều cần.)
- [ ] **S2 Quốc vận và nho khí:** khối `nat` cho 9 triều, nguồn tăng giảm, tác dụng, thiên mệnh (đổi chủ), phản phệ, long mạch, tin tức và biên niên. Đo cân bằng bật/tắt.
- [ ] **S3 Quân đội và quân trận:** quân lực, phẩm, sát khí, tướng, trận, bảng lính tương đương; thay `strength`; đo lại số chiến tranh. Bản sắc 9 nước.
- [ ] **S4 Triều chính và quốc sách:** hoàng quyền, kế vị, thế gia, quốc sách với tu sĩ, quốc giáo.
- [ ] **S5 M5b liên tông trên nền S1 đến S4:** tông ↔ triều (quốc sư, cung phụng, thao túng), minh ước liên tông, giải đấu, đại chiến có hậu quả, Thiên hạ công ước.
- [ ] **S6 Người chơi vào cuộc:** nhập ngũ, nho quan, sứ giả, cảnh báo phản phệ, nhiệm vụ thế lực, tín nhiệm (F5).
- [ ] **S7 Ý tưởng bổ sung đã chọn:** gián điệp, ngoại giao, khoa cử và quan chế, biên phòng...
- [ ] **S8 Giao diện và hoàn thiện:** tab Quốc gia, ma trận, sơ đồ thế giới, di động; đo lại toàn bộ chỉ tiêu.
- [ ] Kiểm thử trong `tests.html`
- [ ] Đo cân bằng bằng mô phỏng (mục 3.9)
- [ ] Chơi thử trên trình duyệt (máy tính và điện thoại)
- [ ] Ghi tóm tắt vào `KE-HOACH.md`, chụp snapshot

Ước lượng: S1 khoảng 1,5 lượt làm việc; S2 khoảng 1,5; S3 khoảng 2; S4 khoảng 1; S5 khoảng 1,5 (ngắn hơn M5b làm riêng); S6 khoảng 2; S7 và S8 tùy lựa chọn.

## 6. Rủi ro
| Rủi ro | Cách giảm |
|---|---|
| Phạm vi lớn, dễ sa vào làm hết một lúc | Chia S1..S8, mỗi chặng chơi được, mỗi chặng đo lại cân bằng |
| Lệch cân bằng thế giới (quá nhiều hay quá ít chiến tranh) | Hệ số bù trong 3.9; đo bật/tắt cho 12 hạt giống; mọi hệ số ở `D.NATION` |
| Quân quá mạnh (tu sĩ vô dụng) hay quá yếu | Bảng lính tương đương chỉnh được; phản phệ và địa hình là hai nút cân bằng |
| Người chơi không đọc được vì quá nhiều chỉ số | Hiển thị bằng bậc và chữ (Rồng bay, Thịnh, Bình, Suy, Mạt; Rất mạnh...), số cụ thể ẩn; chi tiết ở ma trận và hồ sơ cặp |
| Phản phệ quá nặng làm người chơi sợ mọi thứ | Trần phản phệ, cảnh báo trước, có cách chuộc (việc thiện, tế lễ) |
| Mạng quan hệ nhiều chiều khó bảo trì | Một hàm `relV` tổng hợp cho code cũ, chiều thêm vào dần, dữ liệu thưa |
| Bản lưu cũ | Trường khởi tạo muộn, dựng `nat` và `rel2` ở năm kế |
| Trùng với Q (cốt truyện) và R (nhân duyên) | Q có "tuyến thế giới" dùng được `rel2` và quốc vận làm mầm chuyện; R dùng `thong` cho hôn nhân chính trị. Làm S trước Q nếu muốn cốt truyện sâu hơn |

## 7. Liên hệ với các kế hoạch khác
- **P (dân số, hiệp ước):** S dùng lại `n`, `mood`, `pacts`; F5 (tín nhiệm) gộp ở S6.
- **E (kinh tế):** thuế, cung cầu, thuế cửa ải đọc `nat` (vận cao thì thuế dễ thu, giá ổn).
- **G (nhật báo):** thêm mục tin quốc vận, tin quân sự, tin ân oán; ly gián.
- **M (tông môn):** M5b gộp vào S5; M6 (làm chưởng môn) sau này dùng mạng quan hệ và quốc sách để ra quyết định.
- **N (tài nguyên):** long mạch dựa trên linh mạch.
- **Q, R:** dùng sổ ân oán và quốc vận làm mầm chuyện.

## 8. Cần bạn chốt (mỗi câu có mặc định mình sẽ dùng nếu bạn không đổi)
1. **Thứ tự:** S1 trước rồi S2, S3, S4, S5, S6 như trên? (Mặc định: có.)
2. **Nho khí:** chỉ là chỉ số quốc gia cộng văn vị và hạo nhiên khí **bổ trợ** cho mọi người, hay thêm một **đường tu Nho riêng** cho người chơi? (Mặc định: bổ trợ ở đợt này, đường riêng để sau.)
3. **Quân vs tu sĩ:** bảng lính tương đương ở 3.4 (Kim Đan 2.000, Nguyên Anh 30.000, Hóa Thần 400.000) có hợp ý "đối kháng được nhưng khó" không, hay muốn dễ hơn/khó hơn? (Mặc định: giữ bảng này, đo rồi chỉnh.)
4. **Phản phệ quốc vận:** nên là rào cản cứng (không làm được) hay chỉ **tốn nghiệp và đạo tâm** (làm được nhưng trả giá)? (Mặc định: tốn nghiệp và đạo tâm, có trần.)
5. **Tất cả thế lực** của mạng quan hệ gồm: 9 triều, 9 tông, 8 gia tộc, 3 thương hội. Có muốn thêm **tán tu liên minh, yêu tộc, ma đạo** như thế lực không? (Mặc định: chưa, chỉ bốn loại hiện có.)
6. **Vương triều diệt hẳn được không?** Hiện triều không bao giờ diệt (chỉ đổi chủ). Hệ mới có thể cho **chia cắt hoặc thôn tính** khi quốc vận Mạt. Có muốn không? (Mặc định: có, nhưng thế giới luôn còn đủ 9 vùng có chủ.)
7. **Người chơi làm vua hoặc quan lớn:** để M6 hay cho sớm? (Mặc định: để M6; ở S6 người chơi chỉ làm quan và tướng cấp thấp đến trung.)
8. **Ý tưởng bổ sung (mục 3.5):** chọn cái nào làm ở S7 trong: gián điệp, ngoại giao và hôn nhân chính trị, khoa cử và quan chế, biên phòng, thiên hạ đại thế, lễ nghi? (Mặc định: ngoại giao và khoa cử trước.)
9. **Có nên làm S trước Q (cốt truyện) và R (nhân duyên)?** (Mặc định: làm S1 và S2 trước vì Q có "tuyến thế giới" cần mạng quan hệ.)

## 9. Nhật ký làm việc
- 2026-10-18: đọc `factions.js`, `pacts.js`, `population.js`, `KICH-BAN-THE-GIOI.md`, P, M; viết kế hoạch S, chưa code. Chờ bạn duyệt mục 8.

## 10. Kết quả và việc để sau
(Chưa làm.)
