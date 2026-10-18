# Q. Làm mới toàn bộ hệ cốt truyện, lựa chọn và kỳ ngộ (gộp và thay D)

- Trạng thái: Chờ duyệt (bản 10: đã sắp xếp lại và chỉnh logic; chưa code)
- Ngày lập: 2026-10-18; thay thế [D-ky-ngo](D-ky-ngo.md). Kế hoạch con tách riêng: [R-nhan-duyen](R-nhan-duyen.md) (đạo lữ, con cái, dây duyên).
- Liên quan: `js/systems/events.js`, `js/data/events.js` và các file sự kiện, `path.js` + `data/paths.js` (ngã rẽ), `quests.js`, `rumors.js`, `press.js`, `eco.js`, `pacts.js`, `population.js`, `sect.js`, `decisions.js`, `stats.js` (tiên thiên, khí vận), `character.js`, `family.js`, `fate.js` (Nghịch Thiên)
- **Bản này chỉ sắp xếp lại số mục** (bản 9 có các mục 4B đến 4G, 6B đến 6E rời rạc). Bảng đối chiếu số mục cũ và mới ở cuối phần "Đọc nhanh".

## Đọc nhanh

**Ý chính:** mỗi đời người chơi được dựng từ **bốn lớp**, từ gốc lên ngọn:
1. **Nền nhân vật** (mục 4 đến 7): tiên thiên, khí vận, tính cách, vòng quay vận mệnh. Đây là bộ **luật chơi** cho mọi truyện.
2. **Khởi đầu đời** (mục 8, 9): **xuất thân** (nhà nào, cha mẹ ai) và **xương sống** (kiểu đời: phàm nhân, xuyên không, trọng sinh, huyết mạch, thiên phạt).
3. **Cốt truyện** (mục 10 đến 14): **tuyến thân phận** (14), **tuyến thế giới** (8), cách chúng **lồng nhau**, và cách xử lý **85 sự kiện lẻ cũ**.
4. **Nhân duyên** (kế hoạch R riêng): đạo lữ, con cái, sư đồ, dây duyên.

### Bản đồ các mục
| Phần | Mục | Nội dung |
|---|---|---|
| I. Bối cảnh | 1, 2, 3 | yêu cầu và quyết định đã chốt, hiện trạng, mục tiêu |
| II. Nền nhân vật | 4 Tiên thiên v2; 5 Khí vận v2; 6 Tính cách bốn trục; 7 Vòng quay vận mệnh | cơ chế dùng chung |
| III. Khởi đầu đời | 8 Xuất thân (17); 9 Xương sống (5 kiểu đời) | bốc lúc sinh |
| IV. Cốt truyện | 10 Kiến trúc tuyến, kỳ ngộ, lựa chọn; 11 Tuyến thân phận (T1 đến T14); 12 Tuyến thế giới (W1 đến W8); 13 Lồng nhau; 14 Sự kiện lẻ cũ | nội dung |
| V. Triển khai | 15 Tác động qua lại; 16 Giao diện; 17 Cân bằng; 18 Kỹ thuật; 19 Các chặng làm | cách làm |
| VI. Chốt và mở | 20 Đã chốt và câu hỏi còn mở; 21 Gợi ý bổ sung; 22 Nhật ký; 23 Kết quả | quyết định |
| VII. Nội dung từ kế hoạch S | 24 Giáo sĩ (T15), Thần Chức đạo (T16), tuyến T17 đến T21, tuyến thế giới W13 đến W24, 12 cụm chuỗi (11 đến 22), 36 sự kiện nghịch lý của chín tông, sự kiện quốc gia, tôn giáo, hội, gia tộc | nội dung cho hệ Quốc gia, Tông môn hiện đại, Tôn giáo |

### Thứ tự phụ thuộc (làm cái trên trước)
```
Nền (4 Tiên thiên, 5 Khí vận, 6 Tính cách)  ──>  7 Vòng quay (cần khí vận, tính cách)
        │                                              │
        v                                              v
 8 Xuất thân, 9 Xương sống (cần tiên thiên, tính cách)  ──>  10 Khung tuyến (engine)
                                                              │
                          ┌───────────────────────────────────┼───────────────────────────┐
                          v                                   v                           v
                 11 Tuyến thân phận                  12 Tuyến thế giới             14 Sự kiện lẻ cũ
                          └──────── 13 Lồng nhau (móc, chặng ghép, dàn nhân vật) ─────────┘
                 R Nhân duyên: R1 đến R3 chỉ cần 4, 5, 6; R4 (dây duyên) cần 10
```

### Bảng đối chiếu số mục (bản 9 → bản 10)
| Bản 9 | Bản 10 | Bản 9 | Bản 10 |
|---|---|---|---|
| 4 Kiến trúc | **10** | 6B Tuyến thân phận | **11** |
| 4B Xương sống | **9** | 6C Tuyến thế giới | **12** |
| 4C Xuất thân | **8** | 6D Lồng nhau | **13** |
| 4D Tính cách | **6** | 6E Sự kiện lẻ cũ | **14** |
| 4E Vòng quay | **7** | 5 Tác động qua lại | **15** |
| 4F Tiên thiên | **4** | 7, 8, 9 Giao diện, Cân bằng, Kỹ thuật | **16, 17, 18** |
| 4G Khí vận | **5** | 10 Chặng; 11 Câu hỏi | **19; 20** |


---

# PHẦN I. BỐI CẢNH


## 1. Yêu cầu của bạn và những gì đã chốt
- Làm mới toàn bộ hệ thống cốt truyện, lựa chọn và kỳ ngộ (2026-10-18).
- Từ trước: nên có tuyến nhiều chặng theo nghề, đạo, tông môn, thế lực; thêm loại sự kiện bí cảnh (D).

### 1.1 Các ý bạn đã đưa ra (theo thứ tự)
1. Làm mới **toàn bộ** hệ cốt truyện, lựa chọn, kỳ ngộ (gộp D).
2. **Xương sống**: làm kỹ; thêm 4 xương sống tỉ lệ thấp (xuyên không, đại năng trọng sinh, và 2 gợi ý của mình).
3. **Xuất thân**: nhiều kiểu gia đình (phàm nhân, cha mẹ tu tiên, gia tộc luyện khí, đan, phù, ẩn thế, thương cổ, thương nhân, quan lại, đại năng ẩn thế...).
4. **Tuyến thân phận và tuyến thế giới** chi tiết; **lồng nhau** thế nào.
5. **Sự kiện lẻ cũ**: phân loại lại, nối chuỗi, ý tưởng cho Nhẫn, Từ hôn, Thiếu chủ...; việc thường ngày giảm tần suất, tự chọn khi quá nhiều chuyện.
6. **Tính cách** bốn trục như ảnh mẫu; **hạn chế và định hướng** lựa chọn; **đổi dần**; **mỗi quyết định dịch một trục**; thang **−10 đến +10**.
7. **Vòng quay vận mệnh**: quyết định không được chọn ở sự kiện lớn; 0 đến 100; 2 đến 4 vùng; **một yếu tố cộng điểm**; quay lại bằng **khí vận**.
8. **Tiên thiên làm lại** (điều kiện, thân phận cần tiên thiên phù hợp); **khí vận làm lại** (chỉ cộng từ kỳ ngộ vận mệnh, hoàn thành tuyến, chuyện lớn; **không theo thời gian**).
9. **Tỉ lệ tiên thiên**: Quý 15%, Thiên 5%, mỗi cái ra thì lần sau giảm một nửa.
10. Thêm **2 tuyến**: **Móc mắt (trùng đồng)** và **Đào cốt (đạo cốt)**, có **nghiệt duyên**; mở từ **Trúc Cơ**, việc dùng trùng đồng/xương do **vòng quay quyết**.
11. **Nhân duyên, đạo lữ, con cái** tách thành kế hoạch **R**.

### 1.2 Quyết định đã chốt (bảng tóm tắt)
| # | Chủ đề | Chốt | Mục |
|---|---|---|---|
| 1 | Phạm vi | làm mới toàn bộ cốt truyện, lựa chọn, kỳ ngộ; D gộp vào Q | cả file |
| 2 | Kiểu đời | 5 kiểu, tỉ lệ 75/6/5/7/7, xuyên không và trọng sinh thấp hơn kiểu thường | 9 |
| 3 | Xuất thân | 17 loại, cha mẹ và gia tộc là thật | 8 |
| 4 | Tính cách | 4 trục, thang −10 đến +10, 0 là Trung dung | 6 |
| 5 | Vòng quay | 0 đến 100, 2 đến 4 vùng, **một** yếu tố cộng, vùng càng cao càng **phù hợp** (không nhất thiết lợi) | 7 |
| 6 | Quay lại | tiêu điểm khí vận, **tối đa 1 lần mỗi vòng**, giá 2 đến 5 | 5.4, 7.4 |
| 7 | Khí vận | điểm khí vận chỉ cộng từ **chuyện lớn**, không theo thời gian, trần 10 | 5 |
| 8 | Tiên thiên | 6 ô, 4 phẩm; **Quý 15%, Thiên 5%**, mỗi cái ra thì lần sau giảm một nửa | 4 |
| 9 | T13, T14 | mở từ **Trúc Cơ**; dùng trùng đồng/xương **do vòng quay quyết** | 11 |
| 10 | Sự kiện cũ | phân loại 5 nhóm, 10 cụm chuỗi, thường ngày giảm và tự chọn theo ngân sách | 14 |
| 11 | Nhân duyên | tách thành kế hoạch R | R |

## 2. Hiện trạng (vì sao cần làm lại)
- Khoảng 85 sự kiện, đều là **mảnh rời**: bốc ngẫu nhiên theo trọng số, mỗi cái một hộp, kết thúc là xong, **không nhớ gì** ngoài thời gian chờ (`evCool`) và vài cờ (`c.flags`). Người chơi hiếm cảm thấy "mình đang sống trong một câu chuyện".
- **Kỳ ngộ** (`ev.kyNgo`) chỉ là một cú tung xúc xắc ra phần thưởng (tư chất, biến dị, tiên thiên, khí vận, pháp bảo). Không có manh mối, không có hành trình, không phải đi tìm.
- **Lựa chọn** phần lớn là "liều hay an toàn": kết quả tức thời (vàng, tu vi, thương), ít hậu quả dài hạn, ít liên quan thế giới (giá, hiệp ước, tông, báo).
- Các hệ mới (kinh tế, dân số, hiệp ước, tông môn, thương hội, Nhật báo, tài nguyên) **chưa cho sự kiện nào dùng** ngoài vài chỗ nhỏ.
- Ngã rẽ (C) và nhiệm vụ (A) đứng riêng, chưa gắn với truyện.

### 2.1 Các hệ nền cũng cần làm lại (phát hiện thêm)
- **Tiên thiên**: chỉ 20 mục phẳng (`D.TRAITS`), 3 phẩm, chỉ cộng/trừ vài chỉ số, không gắn xuất thân, xương sống, truyện; không ẩn, không mất, không chuyển, không truyền hiệu quả.
- **Khí vận và vận may**: hai chỉ số bị động chồng chéo (`baseKv`, `baseLuck`), tăng bằng nhặt nhạnh nhỏ, người chơi khó thấy tác dụng và **không tiêu được**.
- **Tính cách**: sáu nhãn cố định (`D.personalities`), người chơi luôn là "Bình thường", chỉ nhân trọng số hành động và độ liều.
- **Quan hệ và nhân duyên**: một số thiện cảm và vài nhãn; đạo lữ, con cái thiếu chiều sâu → xem R.

## 3. Mục tiêu thiết kế
1. Mỗi đời có **một xương sống** (hành trình theo cảnh giới) và vài **tuyến truyện** cài lên, để khi nhìn lại đời có đầu có đuôi.
2. **Lựa chọn có sức nặng và có hậu quả trễ**: chọn hôm nay, vài năm sau mới thấy; không chọn cũng là một lựa chọn.
3. **Kỳ ngộ là hành trình**: có dấu hiệu, có manh mối để đi tìm, có chặng, có giá phải trả; chỉ một phần nhỏ còn là "trúng số".
4. **Thế giới sống thật vào truyện**: truyện đọc được giá cả, chiến sự, hiệp ước, dân sinh, tông, hội, tin báo và cũng ghi ngược lại vào thế giới.
5. **Thụ động vẫn chơi được**: chế độ Cân bằng/Tự động có chọn mặc định hợp lý; nhịp hỏi ≤ 6 hộp/phút (bài nhịp hiện có).
6. Không làm hỏng cân bằng: phần thưởng truyện nằm trong biên của tu luyện, thưởng lớn đi kèm giá lớn (xem mục 17).

7. **Nền nhân vật nhất quán**: tiên thiên (bạn sinh ra là gì), tính cách (bạn là ai), khí vận (bạn được may mắn bao nhiêu để sửa số phận), vòng quay (số phận quyết) cùng một khung, không chồng chéo.
8. **Chọn có ý nghĩa**: thông tin tới tay người chơi **đủ** để cân nhắc (lý do khóa, mức hợp tính, giá khí vận) nhưng không bao giờ lộ hết.


---

# PHẦN II. NỀN NHÂN VẬT


## 4. Tiên thiên làm lại (v2): làm nền cho xuất thân, xương sống, tuyến và vòng quay

**Vì sao làm lại (ý bạn 2026-10-18):** điều kiện, thân phận và tuyến cần có **tiên thiên phù hợp**; hệ cũ đã lỗi thời. Hiện chỉ có **20 tiên thiên** phẳng (`D.TRAITS`: mỗi cái chỉ cộng/trừ vài chỉ số, 3 phẩm trắng, xanh, vàng, tối đa 5 cái, không liên quan xuất thân, xương sống, không có cơ chế riêng, không truyền, không mất, không chuyển).

### 4.1 Cấu trúc mới
- **Sáu loại (ô)**: mỗi nhân vật có tối đa **một tiên thiên mỗi loại** (tiên thiên chuẩn), thêm các **tật** (xấu) không tính ô.
  | Loại | Là gì | Ví dụ |
  |---|---|---|
  | **Thể** | thân thể, linh thể | Thân cường, Đạo thể, Ngũ hành linh thể (Kim/Mộc/Thủy/Hỏa/Thổ), Chí dương thể, Chí âm thể, Thần lực bẩm sinh |
  | **Cốt** | căn cốt | **Đạo cốt**, Tiên cốt, Kiếm cốt, Ma cốt, Cốt cách thượng thừa |
  | **Đồng** | thiên phú về mắt, tai, thần thức | **Trùng đồng**, Thiên nhãn, Mắt tinh, Thiên lý nhĩ, Linh giác |
  | **Huyết** | huyết mạch | Long huyết, Phượng huyết, Hồ huyết, Cổ thần huyết (nối xương sống D) |
  | **Mệnh** | mệnh cách | Mệnh hảo, Phúc duyên, Đại khí vận giả, Mệnh cô tinh, Thiên cơ ghét bỏ, **Thiên phạt dấu** (E), **Dị hồn** (B), **Hồn cũ** (C) |
  | **Tâm** | bản tâm | Ngộ tính cao, Tâm tĩnh, Đạo tâm vững, Tâm ma quấn thân, Hay quên, Lười biếng |
- **Bốn phẩm**: **Thường** (trắng), **Hiếm** (xanh), **Quý** (vàng), **Thiên** (đỏ, hầu như chỉ ở tuyến/xương sống đặc biệt). Hiện 3 phẩm; thêm phẩm Thiên và đổi tên bậc.
- **Số lượng**: bốc 1 đến 3 tiên thiên chuẩn cho mỗi người (thường 1 đến 2), 0 đến 2 tật; tối đa cả đời 6 (6 ô) + tật; **tỉ lệ phẩm cao (bạn chốt 2026-10-18): Quý (vàng) 15%, Thiên (đỏ) 5% cho mỗi lần bốc**, và **mỗi lần ra một tiên thiên Quý hoặc Thiên thì lần bốc phẩm cao kế tiếp giảm một nửa** (xem 4.1b).
- **Mỗi tiên thiên có**: tên, loại, phẩm, **dòng chữ mô tả**, **hiệu chỉnh chỉ số** (như cũ), **cơ chế riêng** (tùy cái), **thẻ** (tag) cho tương thích, **dấu hiệu** (biểu hiện bên ngoài), **trạng thái ẩn** (có cái chỉ lộ khi thức tỉnh), **truyền thừa** (có truyền cho con không, bao nhiêu %), **chuyển nhượng được không** (đào, cấy).

### 4.1b Tỉ lệ phẩm khi bốc (bạn chốt 2026-10-18)
- **Mỗi lần bốc một tiên thiên** (1 đến 3 lần mỗi người): **Thiên (đỏ) 5%**, **Quý (vàng) 15%**, **Hiếm (xanh) 30%**, **Thường (trắng) 50%**. Tức mỗi lần bốc có **20%** ra phẩm Quý trở lên (trước đây khoảng 8%).
- **Giảm một nửa theo số lần đã ra phẩm cao**: mỗi khi trong cùng một người đã ra **một** tiên thiên Quý hoặc Thiên thì xác suất ra phẩm Quý và Thiên ở **lần bốc kế tiếp** đều **giảm một nửa** (dồn phần dư vào Hiếm và Thường theo tỉ lệ).
  | Đã ra phẩm cao | Thiên (đỏ) | Quý (vàng) |
  |---|---|---|
  | 0 cái | 5% | 15% |
  | 1 cái | 2,5% | 7,5% |
  | 2 cái | 1,25% | 3,75% |
  | 3 cái | 0,625% | 1,875% (ô tiên thiên chuẩn tối đa 6 nên gần như dừng) |
  *(Ví dụ bạn viết "2,25%, 1,15%" là làm tròn; công thức đúng là nhân 0,5 mỗi lần: 5 → 2,5 → 1,25.)*
- **Công thức:** `p_Thiên(k) = 5% x 0,5^k`, `p_Quý(k) = 15% x 0,5^k`, với k là số tiên thiên Quý hoặc Thiên đã ra; phần còn lại chia theo tỉ lệ 30:50 cho Hiếm và Thường.
- **Tiên thiên bắt buộc theo xương sống/xuất thân** (Dị hồn, Hồn cũ, Thiên phạt dấu, tiên thiên Huyết của D...): **không tính vào k** và không dùng xác suất này; nhưng tổng số tiên thiên Quý và Thiên của một người **tối đa 3**.
- **Thiên phẩm "đỏ"** (5% mỗi lần): chỉ chọn trong danh sách **Thiên** (Tiên cốt, Thần thể, Thiên phạt dấu bản mạnh...), thường có **cái giá** hoặc **đòi điều kiện** (không phải lúc nào cũng lợi).
- **Cân bằng phải làm lại:** vì phẩm cao gấp 2,5 lần trước, **hiệu chỉnh số của phẩm Quý và Thiên bị hạ** so với dự định ban đầu (ví dụ Quý: tu luyện +25 đến +35% thay vì 50%; Thiên: +50% kèm giá), kiểm bằng `story-sim`: tỉ lệ Trúc Cơ trở lên, Kim Đan trở lên vẫn trong ±10% (hiện 2/5/18%).
- **Tính theo từng nhân vật thế giới:** NPC cũng bốc cùng công thức nhưng **chia xác suất phẩm cao cho NPC ít** (NPC lõi chỉ 1/3 mức người chơi) để thế giới không đầy thiên tài.

### 4.2 Cơ chế riêng của vài tiên thiên (mẫu)
- **Trùng đồng** (Đồng, Quý): hai đồng tử; **thấy ẩn** (nhìn xuyên ảo ảnh, trận, kẻ ẩn thân), **thấy nhược điểm** (+xác suất thắng trận đầu), **ngộ** +, nhưng **dễ bị biết và bị săn**, đau mắt khi dùng quá (đạo tâm mệt), khi **đột phá** có thể thấy "thiên cơ". Có thể **bị móc** (mất, kéo tới tuyến T13) hoặc **cấy** vào người khác (sức mạnh nhưng phản phệ).
- **Đạo cốt** (Cốt, Quý): tu luyện nhanh hơn, ngộ đạo dễ, **hợp thiên đạo** (giảm khó đột phá, tăng kháng tâm ma), nhưng **bị thèm khát**; có thể **bị đào** (mất, tới tuyến T14) hoặc **cấy** vào người khác.
- **Thiên phạt dấu** (Mệnh, Hiếm đến Quý): chỉ có ở xương sống E (đồng hồ Phạt, điểm Nghịch).
- **Dị hồn** (Mệnh, Hiếm): chỉ có ở xương sống B (điểm Dị tri, đồng hồ Lộ).
- **Hồn cũ** (Mệnh, Quý): chỉ có ở xương sống C (Tái tu, tâm ma kiếp trước).
- **Long huyết, Phượng huyết...** (Huyết): đồng hồ Huyết của xương sống D.
- **Đại khí vận giả** (Mệnh, Quý): mở khí vận khởi đầu cao hơn và tăng điểm nhận khi cộng khí vận (mục 5).
- **Ngũ hành linh thể** (Thể, Hiếm): tăng điểm tư chất của đúng hệ, làm đạo thuật hệ đó mạnh hơn, hợp nghề tương ứng.
- Tiên thiên cũ (Thân cường, Mắt tinh, Tay khéo...) giữ nguyên hiệu chỉnh, xếp vào loại hợp lý.

### 4.3 Tương hợp với xuất thân, xương sống, tuyến
1. **Xuất thân bốc kèm tiên thiên phù hợp** (trọng số x0,3 đến x3 theo thẻ):
   | Xuất thân | Ưu tiên bốc |
   |---|---|
   | Nông hộ (p1) | Thân cường, Đạo tâm vững, Mộc linh thể, tật hay gặp: Thể nhược |
   | Thợ thủ công (p2) | Tay khéo, Mắt tinh, Kim/Hỏa linh thể |
   | Nhà thương nhân (p3), gia tộc thương cổ (t5) | Mệnh hảo, Phúc duyên, Linh giác, Tay khéo |
   | Nhà quan lại (p4), thế gia (t7) | Cốt cách thượng thừa, Ngộ tính cao, Đạo thể (hiếm) |
   | Cô nhi (p5) | Mệnh cô tinh (tật), Linh giác, **Mệnh cô độc nhưng đại khí vận** (hiếm) |
   | Thầy đồ, y sư (p6) | Ngộ tính cao, Tâm tĩnh, Mộc linh thể |
   | Tán tu cha mẹ (t1) | Thân cường, Mệnh hảo |
   | Gia tộc luyện khí (t2), đan (t3), phù (t4) | Kim/Hỏa, Mộc, Thủy linh thể; Trùng đồng hoặc Thiên nhãn cho phù/trận |
   | Hậu duệ tông (t6) | Cốt cách thượng thừa, Ngộ tính cao |
   | Gia tộc ẩn thế (t8) | Huyết mạch cổ, Đạo cốt, Trùng đồng (bí truyền, **dễ có** tiên thiên Quý) |
   | Cha mẹ đại năng ẩn thế (t9) | **Đạo cốt, Tiên cốt, Trùng đồng** (khả năng cao, phẩm cao) |
   | Gia tộc sa sút (t10), con ma tu (t11) | Ma cốt, Huyết mạch lạ, tật nghiệp |
2. **Xương sống đòi hoặc ưu tiên tiên thiên**:
   - **A** Phàm nhân: bốc theo xuất thân, không đòi.
   - **B** Xuyên không: **bắt buộc Dị hồn** (Mệnh).
   - **C** Đại năng trọng sinh: **bắt buộc Hồn cũ** (Mệnh); thêm tiên thiên liên quan ký ức kiếp trước (hợp công pháp cũ).
   - **D** Huyết mạch thượng cổ: **bắt buộc một tiên thiên Huyết**.
   - **E** Thiên phạt chi nhân: **bắt buộc Thiên phạt dấu** (Mệnh) và bốc thêm tật.
3. **Tuyến và chặng đòi tiên thiên** (điều kiện mở hoặc nhánh riêng):
   | Tuyến/chặng | Cần/hợp tiên thiên |
   |---|---|
   | T3 Đan sư | Mộc linh thể, Linh giác, Mũi/Linh giác (nhận thảo) |
   | T4 Luyện khí | Kim/Hỏa linh thể, Mắt tinh, Thần lực |
   | T5 Thương nhân | Mệnh hảo, Linh giác |
   | T9 Báo thù | Kiếm cốt, Ma cốt (nhánh), Thiên nhãn |
   | T10 Di sản | Trùng đồng (thấy ẩn trong tàn tích) |
   | T12 Kẻ nghịch thiên | Thiên phạt dấu hoặc từng cải mệnh |
   | **T13 Móc mắt (mới)** | **Trùng đồng** (là nạn nhân, hoặc kẻ có cơ hội lấy/cấy) |
   | **T14 Đào cốt (mới)** | **Đạo cốt** (nạn nhân hoặc kẻ cấy) |
   | Vòng quay (yếu tố `stat`) | tiên thiên có thể là yếu tố cộng điểm (Trùng đồng với chặng "thấy rõ", Hồn cũ với chặng kiếp trước) |
4. **Thẻ tương hợp**: mỗi tiên thiên có thẻ (`kim`, `moc`, `thuy`, `hoa`, `tho`, `dan`, `khi`, `phu`, `huyet`, `nhan`, `cot`, `menh`, `tam`); xuất thân, nghề, tuyến khai báo thẻ ưa; bốc theo công thức `w = w0 x (1 + 1,5 x số thẻ khớp)` (tối đa x3) và `x0,3` cho thẻ kỵ (ma cốt với gia tộc chính đạo).
5. **Tương thích giữa tiên thiên**: có cặp **loại trừ** (Đạo cốt với Ma cốt; Long huyết với Phượng huyết cùng lúc), **cặp cộng hưởng** (Trùng đồng + Thiên nhãn không cùng một ô, nhưng Trùng đồng + Đạo cốt tăng "bị thèm khát").

### 4.4 Ẩn, thức tỉnh, mất, chuyển
- **Ẩn**: tiên thiên Hiếm trở lên có thể **ẩn** tới khi thức tỉnh (thức tỉnh bằng sự kiện, tuổi 12, đột phá, thầy tướng, sự cố sinh tử); trước đó chỉ có dấu hiệu mơ hồ (đồng tử lạ khi tức giận, xương hơi kêu...). Cái nào mang lại cho người khác biết thì đã **lộ** (kéo kẻ săn).
- **Thức tỉnh**: gắn mốc xương sống/tuổi thơ; vòng quay vận mệnh có thể quyết định phẩm thức tỉnh.
- **Mất**: đào, móc, bị hủy, tự hiến, phản phệ; hệ cũ chỉ có cú "mất tiên thiên" trong Nghịch Thiên Cải Mệnh.
- **Chuyển/Cấy**: tiên thiên **chuyển nhượng được** (`transferable`) có thể thành **vật phẩm hiếm cấm** (Đồng, Cốt) cấy cho người khác với xác suất tương thích và phản phệ (tuyến T13, T14); người cấy nhận một phần sức, thêm **nghiệp** và **nghiệt duyên** (mục 11).
- **Truyền thừa**: con cái nhận tiên thiên cha mẹ với xác suất theo loại (Huyết 60%, Cốt 25%, Đồng 25%, Thể 30%, Mệnh 5%, Tâm 10%), cộng hưởng với `family.mixTraits` hiện có.
- **Hiển thị**: Hồ sơ có khối **Tiên thiên** (6 ô, chip theo phẩm, mờ nếu ẩn, tooltip cơ chế và cái giá), nhật ký ghi lần thức tỉnh/mất/cấy.

### 4.5 Chuyển dữ liệu cũ và kỹ thuật
- 20 tiên thiên cũ **giữ nguyên id và hiệu chỉnh**, được thêm `loai`, `pham` (q 0 → Thường, q 1 → Hiếm, q 2 → Quý), `tag`; **`c.traitIds` không đổi** (không đổi `TT.VERSION`); tiên thiên mới thêm tiếp.
- Dữ liệu: `js/data/traits.js` mở rộng (ước 60 tiên thiên: 20 cũ + 14 thể/cốt/đồng/huyết + 6 mệnh/tâm + các tiên thiên đặc biệt cho xương sống), `D.TRAIT_RULES` (ô, phẩm, xác suất, loại trừ, truyền thừa).
- Hệ: `TT.trait` (bốc theo thẻ, kiểm điều kiện, thức tỉnh, chuyển/cấy, cơ chế riêng); chỉnh `stats.js` (`S.mod` đọc cơ chế mới), `events.js` (`addGoodTrait`/`removeBadTrait` theo ô), `fate.js` (Nghịch Thiên mất tiên thiên), `family.js` (`mixTraits`), `character.js` (bốc lúc sinh), UI `panels.js`/Hồ sơ.
- Kiểm thử: bốc theo ô và thẻ, loại trừ, bắt buộc theo xương sống, truyền thừa, mất/cấy, ẩn/thức tỉnh, lưu/tải, cân bằng (tiên thiên không phá Trúc Cơ+ 2/5/18%).


## 5. Khí vận làm lại (v2): điểm khí vận chỉ có từ chuyện lớn, không tích theo thời gian

**Ý bạn (2026-10-18):** làm lại hệ khí vận (hiện đang song song với vận may); roll lại ở vòng quay (7) phải **cân nhắc thật kỹ**; thích cách **cộng khí vận kiểu kỳ ngộ vận mệnh, hoàn thành tuyến, làm chuyện lớn**; **không** cộng theo thời gian.

### 5.1 Hiện trạng và vấn đề
- Hiện có **hai chỉ số**: **khí vận** (`baseKv` + tiên thiên, dùng cho xác suất có sự kiện, tăng tốc tu `kvFactor` 1 + 0,02 x kv, xác suất vượt vùng...) và **vận may** (`baseLuck`, cộng vào xác suất nhiều việc nhỏ). Cả hai đều là **chỉ số bị động**, tăng bằng nhặt nhạnh nhỏ, người chơi khó thấy tác dụng và không **tiêu** được.

### 5.2 Thiết kế mới: ba thứ tách bạch
| Thứ | Là gì | Đổi theo | Hiển thị |
|---|---|---|---|
| **Điểm khí vận** (`c.kvPts`, số nguyên 0 đến 10) | **tài nguyên tiêu được** (quay lại vòng quay, về sau đổi hướng chặng) | **chỉ cộng bằng chuyện lớn** (5.3), trừ khi tiêu hoặc phạm điều cấm | luôn hiện ở Hồ sơ và hộp vòng quay |
| **Vận may** (`luck`, −10 đến +10) | **may rủi ngắn hạn** cộng vào xác suất việc nhỏ (như cũ) | đổi theo việc nhỏ và biến cố, trôi dần về 0 | hiện (như cũ) |
| **Mệnh cách** (tiên thiên loại Mệnh) | **nền** thiên mệnh (Phúc duyên, Đại khí vận giả, Mệnh cô tinh...) | cố định hoặc đổi rất hiếm | trong ô tiên thiên |
- **Bỏ chỉ số `kv`** (stat `baseKv`) như một số cộng chung. Tác dụng cũ của nó được thay bằng: (1) **Mệnh cách** (tiên thiên) cho các cộng/trừ nhỏ về xác suất kỳ ngộ và tu luyện; (2) **điểm khí vận** cho quyền "quay lại" và vài việc đặc biệt. `kvFactor` tu luyện giảm thành thành phần tiên thiên Mệnh; xác suất sự kiện `rate` dùng Mệnh cách, không dùng điểm.
- **Chuyển bản lưu cũ**: `baseKv` cũ quy đổi một lần: `kvPts = clamp(round(baseKv / 12), 0, 3)`, và nếu `baseKv ≥ 15` thêm tiên thiên Phúc duyên (Mệnh), `baseKv ≤ −15` thêm Mệnh cô tinh; xóa `baseKv` khỏi `S.kv` (giữ hàm `S.kv` trả giá trị đã quy đổi cho mã cũ). Không đổi `TT.VERSION`.

### 5.3 Cách có điểm khí vận (chỉ chuyện lớn)
| Nguồn | Điểm | Điều kiện / giới hạn |
|---|---|---|
| **Kỳ ngộ vận mệnh** (kết quả hiếm của `kyNgo`) | +2 đến +3 | mỗi lần xảy ra |
| **Hoàn thành một tuyến thân phận** | +2 (kết cục tốt), +1 (kết cục trung) | 12 đến 14 tuyến, chỉ tính lần đầu |
| **Hoàn thành tuyến thế giới có can dự** (không bỏ lỡ) | +1 | tối đa một lần mỗi tuyến |
| **Qua mốc xương sống** | +1 ở mốc 3 và 5; +2 ở mốc 6 (tùy kết cục) | một lần mỗi mốc |
| **Chuyện lớn** (cứu cả làng, tha kẻ thù lớn, thắng thù lớn, giữ lời thề trăm năm, mang di sản trả chủ, chữa dịch) | +1 đến +2 | do chặng đánh dấu `big`; trần 1 điểm mỗi 5 năm từ nguồn này |
| **Vòng quay vùng cao nhất** (quay trúng "phù hợp nhất") | +1 | chỉ khi **không** quay lại |
| **Đột phá thiên kiếp thành công** (Kim Đan trở lên) | +1 | một lần mỗi cảnh giới |
| **Không có**: theo thời gian, theo tuổi, theo tiền, theo nhặt nhạnh nhỏ | — | — |
- **Trần**: giữ tối đa **10**; vượt thì cắt ("khí vận đầy, phần dư tan vào thiên địa").
- **Khởi đầu**: 1 điểm (+1 nếu có tiên thiên Phúc duyên hoặc Đại khí vận giả; về 0 nếu Thiên cơ ghét bỏ).
- **Mất điểm**: phản bội ân nhân, bội ước thề lớn, giết kẻ vô tội xin tha (−1 đến −2, không xuống dưới 0); **nợ trời** không tồn tại (không được quay khi hết điểm).
- **Ước lượng cả đời**: 12 đến 20 điểm, **khoảng 10 vòng quay**, trung bình tốn 2,5 mỗi lần quay lại. Nghĩa là chỉ **quay lại được khoảng 5 đến 8 lần cả đời**, nên mỗi lần phải **đáng giá**; đây là mục tiêu cân bằng, `story-sim` đo và chỉnh.

### 5.4 Vòng quay dùng khí vận (sửa lại 7.4)
- **Quay lại tối đa 1 lần mỗi vòng** (thay vì 2), giá theo sự kiện **2/3/4/5** (sự kiện lớn dùng 2 đến 3, rất lớn 4 đến 5); **1 điểm** chỉ dùng cho vòng quay nhỏ hiếm.
- **Không quay lại ở vùng cao nhất**; **không quay lại khi hết điểm**; **không hoàn lại** nếu số mới tệ hơn.
- Hộp ghi rõ: "Quay lại sẽ tốn 3 trong 5 điểm khí vận. Số mới có thể thấp hơn." và lịch sử ("Còn 2 điểm, nguồn kế: tuyến Đan sư, kỳ ngộ").
- **Quy tắc tự động**: mặc định **không** tự quay lại khi chưa cho phép; nếu bật, chỉ khi rơi vùng thấp nhất **và** còn dư ít nhất `giá + 2` điểm.
- Điểm khí vận còn dùng cho **"đẩy duyên" qua giấc mơ** (kế hoạch R mục 7.2, giá 1 đến 3 điểm) và cho **tinh chỉnh hiếm khác** (nhưng không đợt đầu): xin "ơn trời" né một cú xui lớn; **đổi hướng** một chặng sắp xấu.

### 5.5 Vận may (giữ, thu hẹp)
- Thang −10 đến +10 (như tính cách), hiện số; cộng vào xác suất việc nhỏ như cũ (`lp`, `fight`, bẫy, nhặt);
- **Vận may không dùng cho vòng quay** (vòng quay dùng đúng một yếu tố khác); không dùng để quay lại.
- Trôi về 0 chậm (0,1 mỗi tháng); tăng nhẹ khi làm việc thiện nhỏ, giảm khi làm việc xấu nhỏ.

### 5.6 Kỹ thuật
- Lưu: `c.kvPts` (0 đến 10), `c.kvLog` (20 mục `{m, Δ, nguồn}`), bỏ ghi vào `baseKv` (còn đọc để chuyển cũ).
- Hệ: `TT.kv` (`add(c, n, nguồn)`, `spend(c, n)`, `can`, `cap`), chỉnh `stats.js` (`S.kv` quy đổi), `events.js` (`kyNgo` cộng điểm, bỏ `baseKv`), `cultivation.js` (`kvFactor` đổi), `crossing.js`, `character.js`, `world.js` (khởi tạo lúc sinh), `ui/panels.js` (hiển thị).
- Kiểm thử: cộng đúng nguồn và trần, **không cộng theo thời gian** (chạy 80 năm không sự kiện thì không tăng), chuyển bản lưu cũ, quay lại trừ đúng và chặn khi thiếu, lưu/tải, mô phỏng đo số điểm kiếm/tiêu mỗi đời.


## 6. Tính cách nhân vật: bốn trục trượt (thay "tính cách" rời rạc hiện nay)

**Ý bạn (2026-10-18, kèm ảnh mẫu):** làm tính cách nhân vật để **hạn chế và định hướng** các quyết định có thể chọn; tính cách **đổi dần** từ việc nhỏ và biến cố lớn; **mỗi quyết định làm một trong các chỉ số dịch đi một chút**. Ảnh mẫu là bốn thanh **Tính tình, Xử thế, Đạo đức, Tu dưỡng**, mỗi thanh có nút + và −, giữa là "Trung dung" và nhãn đổi theo vùng. **Bạn chỉnh (2026-10-18): thang từ −10 đến +10, 0 là Trung dung** (thay cho 0 đến 20).

### 6.1 Hiện trạng
Hiện NPC có **một nhãn** trong 6 (Cần cù, Tham lam, Liều lĩnh, Hiền hòa, Kiêu ngạo, Mưu mô) cố định cả đời; người chơi luôn là "Bình thường". Nhãn chỉ nhân trọng số hành động và độ liều (`bold`), không đổi theo trải nghiệm, không khóa lựa chọn.

### 6.2 Bốn trục (−10 đến +10, mặc định 0)
| Trục | Đầu âm (−10) | Giữa (−2 đến +2) | Đầu dương (+10) | Chủ yếu ảnh hưởng |
|---|---|---|---|---|
| **Tính tình** | Nóng nảy, bộc phát | Trung dung | Điềm tĩnh, nhẫn nại | độ liều, dễ gây xung đột, tâm ma, bế quan, ngộ |
| **Xử thế** | Cương trực, thẳng thừng | Trung dung | Linh hoạt, khéo léo, mưu lược | giao du, thương nhân/hội, chính trị, kết thù |
| **Đạo đức** | Tàn nhẫn, vị kỷ (tà) | Trung dung | Nhân hậu, trọng nghĩa (chính) | chính tà (đồng bộ `c.align`), ân/oán, nghiệp, thiện cảm tông/NPC |
| **Tu dưỡng** | Buông thả, phóng túng | Trung dung | Khắc kỷ, chuyên tâm | tu luyện đều, đạo tâm, kháng cám dỗ, tâm ma, nghiện vui chơi |
- **Năm dải mỗi trục** (theo điểm): −10 đến −7 cực âm, −6 đến −3 thiên âm, −2 đến +2 **Trung dung**, +3 đến +6 thiên dương, +7 đến +10 cực dương; nhãn đổi và màu xanh khi đang thay đổi gần đây (như ảnh mẫu).
- **Nhãn tóm tắt** (để hiển thị gọn như cũ): ghép hai trục lệch nhất, ví dụ "Nóng nảy, cương trực", "Điềm tĩnh, nhân hậu"; thay cho `D.personalities`.
- **Mở rộng sau** (không làm đợt đầu): trục thứ năm "Tham vọng" (an phận ↔ khát vọng), trục thứ sáu "Ân oán" (hay quên ↔ ghi hận).

### 6.3 Lúc sinh và chỉnh ban đầu
- **Bốc** quanh 0 (±3) theo xuất thân (quan lại: Xử thế cao; nông hộ: Tu dưỡng cao; cô nhi: Xử thế cao, Đạo đức thấp nhẹ...), theo xương sống (E: Tính tình thấp), theo tiên thiên (đã có `traits`), cha mẹ truyền một phần (con cái người chơi).
- **Chỉnh ban đầu** (đúng ảnh mẫu có +/−): ở lúc sinh/đầu thai hoặc ở tuổi 12 (mốc A1) người chơi có **ngân sách 4 điểm** cộng/trừ giữa các trục (tổng không đổi: tăng trục này phải giảm trục kia); chỉnh xong khóa. Chế độ tự động: bốc mặc định.
- **Đời sau kế thừa nhẹ**: đầu thai giữ **một phần ngấm** (15%) từ kiếp trước (người rất tà để lại tính ngang ngạnh), ghi Sổ đời.

### 6.4 Mỗi quyết định dịch một trục
- Mỗi lựa chọn mang **hướng** `ax = { trục: ±độ }` (độ nhỏ ±0,25 đến ±1 với việc thường ngày; ±1 đến ±3 với chặng truyện quan trọng; ±3 đến ±6 với biến cố lớn).
- **Tự gán cho sự kiện cũ**: nhãn `kind` hiện có ánh xạ sẵn: `risk` → Tính tình −; `safe` → Tính tình +; `fight` → Xử thế − và Tính tình −; `flee` → Tính tình +; `help` → Đạo đức +; `pay` → Xử thế +; chặng truyện mới tự gán tay (chính xác hơn).
- **Biến cố lớn** (không phải lựa chọn mà là cú sốc): người thân mất (Tính tình ±), bị phản bội (Xử thế +, Đạo đức −), giết người lần đầu (Đạo đức −, Tính tình −), cứu một làng (Đạo đức +), thất bại thiên kiếp, ngộ đạo (Tu dưỡng +)...
- **Quán tính**: gần hai đầu đổi chậm hơn (nhân 0,6 từ dải cực), đạo tâm cao làm tính khó đổi; tuổi cao và cảnh giới cao đổi chậm hơn; một năm không đổi quá **±3** mỗi trục trừ biến cố lớn (≤ ±6).
- **Lịch sử đổi** lưu 30 mục `{m, trục, Δ, lý do}`, hiện trong Hồ sơ ("năm 12: cứu làng, Đạo đức +1") và Sổ đời.
- **Trôi nhẹ về bẩm sinh**: không có (đã chọn: tính cách bạn là kết quả bạn sống), nhưng thiền định hoặc tâm ma lớn có thể kéo.

### 6.5 Tính cách hạn chế và định hướng lựa chọn
1. **Khóa mềm (có lý do hiện rõ)**: một lựa chọn có thể yêu cầu trục ở một khoảng (`gate`); bị khóa thì vẫn hiện, ghi lý do. Ví dụ:
   - "Nhẫn nhịn cho qua" cần Tính tình ≥ −5 (nóng quá thì "Bạn nóng tính quá, không nhịn nổi").
   - "Đánh trả bất chấp" cần Tính tình ≤ +5.
   - "Lừa gạt người tin mình" cần Đạo đức ≤ +4 (người quá chính trực "không làm nổi").
   - "Hối lộ quan lại" cần Xử thế ≥ −2.
   - "Thẳng thắn nói thật với sư phụ" cần Xử thế ≤ +4.
   - "Bỏ tu đi chơi" cần Tu dưỡng ≤ +5; "Bế quan ba năm" cần Tu dưỡng ≥ −4.
   - "Giết kẻ đã xin tha" cần Đạo đức ≤ +2; "Tha cho kẻ thù" cần Đạo đức ≥ −4.
   Khóa tuyệt đối chỉ ở đầu cực (dải −10 đến −7 hoặc +7 đến +10) và chỉ với hành vi trái bản chất; dải giữa luôn chọn được nhưng **có phí** (điểm 2).
2. **Phí trái bản tính**: chọn ngược hướng tính cách thì chịu **một giá nhỏ** (đạo tâm −1, hoặc xác suất thành công −10%, hoặc "dằn vặt" làm chậm tu vài tháng); chọn **đúng bản tính** thì thuận (xác suất thành công +, ít hao). Tính vào cảm giác "hành động theo tính".
3. **Định hướng mặc định** (chế độ Cân bằng/Tự động): xác suất chọn mặc định ∝ độ hợp với tính cách (thay cho `bold` cũ); tab Quy tắc có thể đè.
4. **Gợi ý trên hộp**: lựa chọn hợp bản tính có chấm nhỏ "hợp tính bạn"; ngược thì "trái tính (giá: ...)".
5. **Tính cách mở/đóng chuỗi**: tuyến truyện có điều kiện trục (ví dụ T9 Báo thù cần Đạo đức ≤ +4; T11 Người cứu đời cần Đạo đức ≥ +1; T5 Thương nhân thuận Xử thế ≥ +2; cụm Cao nhân giấu mặt hợp Tu dưỡng ≥ 0).

### 6.6 Tác động lên các hệ (nhẹ, trần ±10% ở đầu cực)
| Trục | Tác động số (đề xuất) |
|---|---|
| Tính tình thấp | độ liều +20% (nối `bold`), tâm ma xuất hiện nhiều +25%, dễ xung đột (`rel_xung_dot` +), ít "ngộ" khi bế quan |
| Tính tình cao | độ liều −15%, tâm ma −25%, ngộ tính khi bế quan +8%, ít đột phá liều (nhưng chờ lâu) |
| Xử thế thấp (cương) | giao du −, kết thù dễ +, danh "quân tử" +, giá trả hối lộ cao |
| Xử thế cao (linh) | giao du +, thiện cảm hội/tông + , buôn bán tầm nhìn +, dễ bị coi là "mưu mô" |
| Đạo đức | đồng bộ `c.align`; chính: tông chính đạo vào dễ, ân tình +; tà: tà tu nhanh hơn, nghiệp nặng, chính đạo thù |
| Tu dưỡng cao | tu luyện đều +5%, đạo tâm bền, kháng cám dỗ; không ham việc thường ngày |
| Tu dưỡng thấp | tu luyện −5%, hay sa vào chơi bời (nhiều việc thường ngày xảy ra hơn), tâm ma dễ |
- **Quan hệ NPC**: thay `CLASH` cố định bằng **khoảng cách tính cách** (cùng Đạo đức cao dễ thân; Tính tình quá lệch dễ khắc); NPC đánh giá bạn theo tính cách bạn.
- **Ngã rẽ (C)**: mỗi đường hợp một vùng tính cách; đi trái đường thì "phí trái tính" lúc cam kết.

### 6.7 Tính cách khác nhân quả và tuyến thế nào
- **Tính cách** = bạn là ai (4 trục, chậm đổi, dùng để khóa/định hướng chọn).
- **Nhân quả** (`karma`: ân, oán, danh, nghiệp, đạo, mục 13) = bạn đã làm gì (cộng dồn, dùng để mở kết cục).
- Một lựa chọn thường cập nhật **cả hai** (cứu làng: Đạo đức +1 và danh +, ân +).

### 6.8 NPC
- NPC cũng có bốn trục (bốc theo nhãn cũ để chuyển dữ liệu: Cần cù → Tu dưỡng +5; Tham lam → Đạo đức −4 và Xử thế +4; Liều lĩnh → Tính tình −6; Hiền hòa → Đạo đức +5 và Tính tình +4; Kiêu ngạo → Tính tình −4 và Xử thế −5; Mưu mô → Xử thế +6 và Đạo đức −3).
- NPC dịch trục **rất chậm** (mỗi vài năm) để giữ chi phí tính toán thấp; nhân vật định mệnh thì dịch theo truyện (thiếu chủ ngạo mạn dịu dần sau khi gặp họa).

### 6.9 Giao diện
- **Hồ sơ nhân vật**: khối "Tính cách" bốn thanh như ảnh mẫu (thanh trắng trên nền tối, số, nhãn dải; xanh khi vừa đổi), nút +/− chỉ dùng ở bước chỉnh ban đầu; di chuột/bấm xem **lịch sử đổi** và hiệu ứng hiện có.
- **Hộp quyết định**: chấm "hợp tính bạn / trái tính", khóa kèm lý do; ở chế độ thủ công vẫn chọn trái tính được (trừ khóa cực).
- **Nhật ký**: dòng nhỏ khi tính cách đổi qua dải ("Tính tình của bạn đã bớt nóng nảy").
- **Sổ đời**: tính cách cuối đời và những lần đổi lớn.

### 6.10 Kỹ thuật
- Dữ liệu: `js/data/nature.js` (`D.NATURE`: trục, dải, tác động, ánh xạ `kind` → hướng, chuyển nhãn cũ).
- Hệ: `js/systems/nature.js` (`TT.nature`: `get/band/label`, `shift(c, trục, Δ, lý do)` có quán tính và trần, `affinity(c, lựa chọn)`, `gate(c, lựa chọn)`, `mods(c)` cho tu luyện/độ liều/tâm ma, `summary(c)` nhãn gọn).
- Lưu: `c.nature = { tinh, xuthe, daoduc, tudung }`, `c.natureLog` (30 mục); khởi tạo muộn (nhân vật cũ suy từ `personality` cũ), không đổi `TT.VERSION`.
- Nối: `events.js` (`chooseIndex` dùng `affinity`, `fire` áp `gate`/phí trái tính), `decisions.js` (chấm hợp/trái tính), `ai.js` (thay `pers`), `path.js`, `social.js` (CLASH), `rules.js`.
- Kiểm thử: dải đúng, quán tính và trần/năm, ánh xạ `kind` → hướng, khóa/phí trái tính, NPC chuyển nhãn cũ, lưu/tải, cân bằng (tính cách ±10% không phá nhịp, tỉ lệ Trúc Cơ+ giữ).


## 7. Vòng quay vận mệnh: quyết định mà bạn không được chọn

**Ý bạn (2026-10-18):** có những quyết định **người chơi không được lựa chọn**, thường là quyết định **quá quan trọng** trong các sự kiện lớn hoặc rất lớn. Thay vì hộp chọn, hiện **một vòng quay ra số từ 0 đến 100**; số rơi vào **vùng** của quyết định nào thì quyết định đó xảy ra. Một yếu tố (tính cách, hảo cảm, năng lực...) **cộng thêm điểm** cho vòng quay. Tối đa **2 đến 4 vùng**. Không ưng số thì **tiêu điểm khí vận để quay lại** (1 điểm thường, 2 đến 5 điểm với sự kiện rất quan trọng).
*(Các từ trong ngoặc kép của bạn như "tốt", "lợi" được hiểu là **phù hợp nhất với tình huống**, chưa chắc tốt nhất hay lợi nhất; mục 7.2 giải thích cách thể hiện.)*

### 7.1 Khi nào dùng vòng quay (và khi nào không)
- **Dùng** cho chặng/sự kiện gắn nhãn **Định mệnh** (`fate`): bước ngoặt của xương sống (mốc 5, 6 và các mốc đổi đời), chặng cuối của tuyến thân phận, biến cố thế giới đập thẳng vào bạn (tông diệt, thất thủ, dịch quét), kết cục của chuỗi lớn (nhẫn, hôn ước, thù), điểm gục ngã của Đại năng trọng sinh, thức tỉnh lần hai của Huyết mạch, cuộc đối mặt Thiên Đạo của Thiên phạt...
- **Không dùng** cho việc thường ngày và các chặng thường: ở đó người chơi vẫn **chọn** (với khóa mềm, phí trái tính, mục 6).
- **Tần suất**: hiếm; khoảng **8 đến 14 vòng quay cả đời** (mỗi 5 đến 10 năm một lần), không bao giờ hai vòng trong cùng một tháng, nằm trong nhịp ≤ 6 hộp/phút.
- **Thiên kiếp, đột phá** vẫn dùng cơ chế hiện có (hộp chuẩn bị, tỉ lệ, Thiên cơ điểm); vòng quay là **cơ chế riêng cho chuyện cốt truyện**, không thay thế đột phá.

### 7.2 Cấu trúc một vòng quay
```
wheel {
  id, tên, mô tả tình huống,
  zones: [ {w: độ rộng, tên, kết quả}, ... ]   // 2 đến 4 vùng, tổng độ rộng 100, xếp từ số 0 lên 100
  factor: { loại: 'nature'|'rel'|'stat'|'skill', ... , tối đa +15 }   // đúng MỘT yếu tố
  cost: 1..5                                    // điểm khí vận để quay lại
  tier: 'lớn'|'rất lớn'
}
```
- **Thứ tự vùng = mức phù hợp tăng dần.** Vùng thấp (số nhỏ) là kết quả **ít phù hợp** (hoặc nhiều rủi ro), vùng cao (số lớn) là kết quả **phù hợp nhất** với người đang đứng ở tình huống đó. Mỗi vùng luôn có **cái được và cái mất** riêng (vùng cao không phải toàn lợi; có khi cái "phù hợp nhất" là một lối đi nhiều giá).
- **Độ rộng vùng** (xác suất cơ bản) do tác giả đặt, ví dụ 25 / 45 / 30 cho 3 vùng, hoặc 15 / 25 / 35 / 25 cho 4 vùng; vùng chết (nếu có) luôn nằm **thấp nhất**, hẹp (≤ 15), được báo trước bằng nhãn "nguy cơ tử vong".
- **Số quay** = `clamp(ngẫu nhiên 0 đến 100 + điểm cộng, 0, 100)`. Hàm ngẫu nhiên dùng `TT.rng` để lưu/tải và mô phỏng lặp lại được.

### 7.3 Một yếu tố ảnh hưởng một vòng quay
- Mỗi vòng quay khai báo **đúng một** `factor`; không cộng chồng. Điểm cộng tối đa **+15** (và tối thiểu **−10** nếu tính cách/quan hệ **đi ngược** tình huống; để hiểu rõ, giao diện luôn ghi rõ "−6 vì bạn quá nóng nảy").
- Bốn loại yếu tố:
  | Loại | Ví dụ | Cách tính điểm |
  |---|---|---|
  | **Tính cách** (`nature`) | Đạo đức, Tính tình... trên thang −10 đến +10 | điểm trục theo hướng có lợi: +1,5 điểm cho mỗi bậc (trục +8 thì +12, trục −8 thì −12 nếu tình huống đòi dương) |
  | **Hảo cảm** (`rel`) | quan hệ với một NPC cụ thể (sư phụ, đối thủ, đạo lữ) | từ −10 đến +15 theo thiện cảm với người đó |
  | **Năng lực** (`stat`) | cảnh giới, ngộ tính, đạo tâm, khí vận | thang có trần +15 |
  | **Kỹ năng** (`skill`) | nghề (Đan sư, Thương nhân), công pháp, giao du | theo cấp nghề |
- **Hiển thị** ngay trên vòng quay: "Yếu tố: Đạo đức (+9) vì bạn đã cứu làng" và vùng được tô sáng/rộng theo điểm.
- Tính cách thật sự **lái** truyện: một người Đạo đức −8 sẽ khó rơi vào vùng "được dân cảm kích" mà dễ vào vùng "bị căm ghét", nên tính cách không chỉ khóa lựa chọn thường mà còn tác động tới chuyện định mệnh.

### 7.4 Quay và quay lại bằng điểm khí vận
- **Quay**: một nút "Quay" (chế độ thủ công) hoặc tự quay sau 1,5 giây (Cân bằng/Tự động); vòng quay SVG/canvas chia vùng theo màu, mũi tên chạy chậm dần rồi dừng ở số; số hiện lớn, tên vùng, kết quả tóm tắt.
- **Quay lại** (reroll): nút "Quay lại (−N khí vận)" với N theo `cost` của sự kiện (**2 đến 3** cho sự kiện lớn, **4 đến 5** cho sự kiện rất lớn; 1 điểm chỉ cho vòng quay nhỏ hiếm). Quay lại **thay hẳn** số cũ (không chọn số tốt hơn), có thể tệ hơn; tối đa **1 lần** mỗi vòng; vùng cao nhất thì **không cho quay lại** (đã đủ phù hợp).
- **Điểm khí vận** (`c.kvPts`) **làm lại ở mục 5** (bản này thay đoạn cũ): chỉ có từ chuyện lớn (kỳ ngộ vận mệnh, hoàn thành tuyến, qua mốc xương sống, chuyện lớn), **không tích theo thời gian**, trần 10, cả đời khoảng 12 đến 20 điểm cho khoảng 10 vòng quay, nên **quay lại là tài nguyên khan hiếm**, phải chọn vòng nào đáng tiêu. Quay lại tối đa 1 lần mỗi vòng, giá 2 đến 5, không ở vùng cao nhất.
- **Quan hệ với khí vận hiện có**: chỉ số khí vận cũ bỏ, thay bằng Mệnh cách (tiên thiên) và điểm khí vận (5); vận may giữ cho việc nhỏ. (Thiên cơ điểm của đột phá giữ nguyên, hai thứ khác nhau.)
- **Quy tắc tự động** (tab Quy tắc): *quay lại tự động* khi rơi vào **vùng thấp nhất** nếu còn ít nhất N điểm dư; mặc định **tắt** ở chế độ Thủ công, **bật cho vùng thấp nhất** ở Cân bằng và Tự động, không tiêu quá nửa số điểm đang có.

### 7.5 Ví dụ vòng quay
1. **Nhẫn, chặng cuối** (3 vùng 25/45/30): *bị đoạt xác* / *chia tay trong yên ổn* / *hợp nhất, nhận ký ức*. Yếu tố: **Độ tin** vào lão gia gia (0 đến 100 quy đổi tới +15). Quay lại tốn 2.
2. **Từ hôn, gặp lại sau 30 năm** (3 vùng 30/40/30): *oán hận bùng lên* / *xa lạ rồi đi* / *hòa giải, có thể thành duyên*. Yếu tố: **Đạo đức**. Quay lại tốn 2.
3. **Đệ tử tông, chặng 5** (4 vùng 15/25/35/25): *bị trục xuất mang hận* / *rời trong êm đẹp* / *giữ ghế nhưng mang cái giá* / *được tin dùng, kế vị*. Yếu tố: **thiện cảm với chưởng môn**. Quay lại tốn 3.
4. **Báo thù, quyết chiến** (3 vùng 20/45/35, có vùng chết 10 nằm trong vùng 1): *thua thảm* / *thắng nhưng trọng thương* / *thắng gọn*. Yếu tố: **cảnh giới so với kẻ thù**. Quay lại tốn 4.
5. **Xương sống C, điểm gục ngã** (3 vùng 25/45/30): *lặp lại số phận* / *vượt qua với giá* / *vượt kiếp trước*. Yếu tố: **Tính tình** (điềm tĩnh được +). Quay lại tốn 5.
6. **Xương sống E, đối mặt Thiên Đạo** (4 vùng): *đồng quy* / *thành sứ giả* / *phá dấu nhưng mất nhiều* / *phá dấu trọn vẹn*. Yếu tố: **điểm Nghịch**. Quay lại tốn 5.
7. **Tuyến thế giới W1, làng bị phá** (3 vùng): *bạn mất nhà* / *bạn thoát cùng vài người* / *cứu được cả làng*. Yếu tố: **Đạo đức hoặc kỹ năng chiến đấu** (tùy chọn khi bạn đã chọn "ở lại cứu").
8. **Xương sống A6, thiên môn** (4 vùng, kết cục): *đọa ma* / *tọa hóa để lại truyền thừa* / *ẩn thế* / *phi thăng*. Yếu tố: **nhân quả tổng** (ân trừ oán, nghiệp, đạo) quy về điểm.

### 7.6 Quan hệ với chọn thường
- **Cùng một chặng có thể vừa chọn vừa quay**: bạn chọn *hướng đi* (ví dụ "Ở lại cứu làng"), rồi **vòng quay quyết định kết quả**; vòng chỉ thế chỗ lựa chọn khi chuyện **vượt quá tầm bạn quyết** (ví dụ chọn có cứu được hay không).
- **Hộp thường** hiển thị nhãn khi lựa chọn dẫn tới một vòng quay: "Chọn thế này sẽ có vòng quay".
- **Không bỏ qua**: không có nút bỏ vòng quay; hết giờ ở chế độ Cân bằng/Tự động thì **tự quay**.

### 7.7 Cân bằng
- Điểm cộng tối đa +15 trên thang 100 nghĩa là **dịch xác suất tối đa 15 điểm phần trăm** một vùng; không bao giờ biến vùng xấu thành chắc chắn né.
- Cái giá nằm trong vùng: vùng cao thường kèm một cái mất (nghiệp, thù, nợ, một cảnh giới giữ chậm) để người chơi không "lúc nào cũng cố quay lại".
- Mô phỏng `story-sim` đo: phân bố vùng theo yếu tố, số điểm khí vận dùng/đời, tỉ lệ tử vong qua vòng quay (nhắm ≤ 1/20 vòng quay chết, và đều có cảnh báo).

### 7.8 Giao diện và kỹ thuật
- Giao diện: **hộp "Vòng quay vận mệnh"**: tiêu đề tình huống, vòng chia vùng màu (tên vùng ghi cạnh vòng), thanh số 0 đến 100 phía dưới, dòng yếu tố "+N vì ...", số khí vận hiện có, nút Quay, nút Quay lại (kèm giá), kết quả. Chế độ giảm hiệu ứng: hiện kết quả ngay không xoay. Trong nhật ký: dòng "Vòng quay: 64 → vùng 'hợp nhất' (yếu tố Độ tin +9)".
- Dữ liệu: trong dữ liệu chặng `wheel: {...}` (7.2); lưu `w.pending = { type: 'wheel', ..., rolled, mod, rerolls }` (thuần dữ liệu), `c.kvPts`.
- Hệ: `TT.wheel` (`spin`, `reroll`, `resolve`, `factorValue`), handler `wheel` trong `decisions.js`, `TT.nature.mods` cung cấp điểm cộng cho yếu tố tính cách.
- Kiểm thử: tổng độ rộng vùng = 100, số vùng 2 đến 4, đúng một yếu tố, điểm cộng nằm trong [−10, +15], quay lại trừ điểm khí vận và đúng giá, tối đa 2 lần, không quay lại ở vùng cao nhất, lưu/tải giữa chừng, tự động quay, mô phỏng lặp lại được.



---

# PHẦN III. KHỞI ĐẦU ĐỜI


## 8. Xuất thân (thân phận lúc sinh): trục thứ hai ngoài xương sống

**Ý tưởng:** xương sống (9) trả lời "câu chuyện lớn của đời là gì"; **xuất thân** trả lời "bạn sinh ra trong nhà nào, cha mẹ là ai, bạn mang gánh gì". Hai trục **độc lập và nhân nhau**: 5 kiểu đời x 17 xuất thân, đủ để mỗi đời mở đầu khác nhau. Hiện game chỉ có 4 xuất thân (`D.origins`: con nhà nông, con thương nhân, thiếu gia thế gia, cô nhi) chỉ đổi vàng và vận may; kế hoạch này thay bằng hệ có **cha mẹ thật, gia tộc thật, bổn phận thật**.

### 8.1 Bảng xuất thân (bốc lúc sinh, tỉ lệ có thể chỉnh trong `D.STORY.origin.w`)
**Nhóm 1: nhà phàm nhân (cha mẹ không tu), 61%**
| Mã | Xuất thân | % | Khởi đầu | Gánh | Lối vào tu hành (mốc A1) |
|---|---|---|---|---|---|
| p1 | **Nông hộ** | 22 | ít vàng, sức bền, hợp thảo dược | cha mẹ cần người, mùa vụ, hạn lụt ảnh hưởng nhà | gặp tán tu qua làng, thi tuyển đệ tử ở thôn trấn, nhặt được sách |
| p2 | **Thợ thủ công, ngư dân, thợ săn** | 10 | tay nghề (nghề phụ cấp 1), một món công cụ | nợ chủ hàng, bang hội địa phương | học nghề rèn/săn, lên thành, gặp khí sư/yêu thú |
| p3 | **Nhà thương nhân** | 10 | vốn khá, tầm nhìn giá +1 (E), quen vài thương nhân | thương vụ nhà, nợ, đối thủ buôn | đi theo đoàn buôn, gặp hội, được hội đỡ đầu |
| p4 | **Nhà quan lại, quý tộc phàm** | 5 | vàng khá, quen quan phủ, học chữ, thiện cảm triều | chính trị triều đình, chọn phe, bị ép làm quan | vào học viện triều, gặp cao tăng/tu sĩ ở dinh, bị triều đưa đi tu |
| p5 | **Cô nhi lang thang** | 9 | không vàng, khí vận hơi cao, nhanh nhạy, giao du rộng | không ai chống lưng, dễ bị bắt nạt | được người lạ dạy, trộm sách, gia nhập bang |
| p6 | **Nhà thầy đồ, y sư** | 5 | có chữ, hiểu thuốc, ngộ tính nhỉnh | nghèo thanh cao, nợ ân bệnh nhân | học y lý lên tới đan, thầy đồ giới thiệu tông |

**Nhóm 2: có người tu trong nhà, 39%**
| Mã | Xuất thân | % | Khởi đầu | Gánh | Lối vào tu hành |
|---|---|---|---|---|---|
| t1 | **Cha hoặc mẹ là tán tu Luyện Khí** (chỉ dạy cơ bản) | 8 | bí kíp nhập môn, một sư phụ tại gia, tu từ rất sớm | cha mẹ tu vi thấp bị người ức hiếp, đời thấp; kẻ thù của cha mẹ nhắm bạn | được cha mẹ dạy, rồi vượt cha mẹ; cha mẹ đưa đi tông |
| t2 | **Gia tộc luyện khí** (khí sư thế gia) | 5 | tay nghề luyện khí cấp 2, một món khí, lò gia truyền, nhận đơn gia tộc | nợ đơn hàng, đối thủ gia tộc khác, bí quyết gia truyền | học khí từ nhỏ, thừa kế xưởng |
| t3 | **Gia tộc luyện đan** | 5 | đan phương gia truyền, thảo viên nhỏ, nghề đan cấp 2 | thiếu linh thảo, tông nhòm ngó đan phương | học đan, giữ hay bán phương |
| t4 | **Gia tộc phù chú, trận pháp** | 4 | phù, trận cơ bản, nghề bùa cấp 2, tầm nhìn tốt | gia tộc nhỏ yếu, bí thuật bị săn | học phù từ nhỏ, đưa vào hội |
| t5 | **Gia tộc thương cổ** (thương hội tu sĩ) | 4 | vốn lớn, thiện cảm hội +, kho nhỏ, đoàn hộ vệ | nghĩa vụ hội, hôn ước kinh doanh, đối thủ hội | theo đoàn đi các vùng, làm việc hội |
| t6 | **Hậu duệ đệ tử tông** (cha mẹ là đệ tử hoặc trưởng lão) | 4 | quen người trong tông, vào tông dễ, sư phụ tin cậy | áp lực danh tiếng, chính trị tông, kẻ ghen | vào tông ngay hoặc qua thử luyện nhẹ |
| t7 | **Thế gia tu tiên lớn** (liên quan vương triều) | 3 | vàng, bí kíp, tài nguyên, hộ vệ; tư chất tốt hơn bình thường | hôn ước, tranh quyền thừa kế, địch nhân gia tộc, kỳ vọng lớn | được dạy bài bản, hoặc bị đẩy vào cuộc tranh thừa kế |
| t8 | **Gia tộc ẩn thế** (giữ bí truyền, lánh đời) | 2 | công pháp bí truyền, quy tắc nghiêm, nơi ở linh khí đẹp | bị cấm rời, bí mật nặng, kẻ truy tìm gia tộc | học bí truyền, hoặc trốn ra ngoài |
| t9 | **Cha hoặc mẹ là đại năng ẩn thế** | 1 | được nuôi dạy bí mật, tư chất cao, di vật, ân huệ lớn | cha mẹ lúc ẩn lúc hiện, thù cũ của cha mẹ, bạn không biết thân thế | cha mẹ rời đi để lại lời dặn, bạn tự tìm đường |
| t10 | **Gia tộc sa sút** (bị diệt, bị truy nã, mất gốc) | 2 | di vật gia tộc, bí mật, thù hận | bị truy, nợ máu, phải giấu họ | lớn lên lang bạt, người cũ gia tộc tìm tới |
| t11 | **Con của ma tu hoặc tà tu** | 1 | công pháp tà, kiến thức cấm, kháng nghiệp | bị chính đạo săn, đồng đạo của cha mẹ kéo vào | trốn khỏi cha mẹ, hoặc đi theo con đường tà |

### 8.2 Thông tin gắn với một xuất thân (dữ liệu và cơ chế)
- `c.origin = { id, parents: [idCha, idMẹ], clan: idGiaTộc, secret: id, duty: {...}, mood: {...} }`.
- **Cha mẹ là NPC thật** (không chỉ chữ): có tên, cảnh giới theo xuất thân (p*: phàm; t1: Luyện Khí; t6: Trúc Cơ đến Kim Đan; t7: Kim Đan trở lên; t9: Nguyên Anh trở lên ẩn thân), sống hoặc đã mất, ở đâu, nghề. Họ sống tiếp trong thế giới: có thể già yếu, mất, bị giết, tu lên, mất tích; **tin về họ tới người chơi** (thư, Nhật báo, người quen).
- **Gia tộc là thế lực thật**: nối vào kiểu thế lực `gia` hiện có (`fac`), gắn vào **một gia tộc đang tồn tại ở vùng sinh** (hoặc dựng nhỏ nếu chưa có). Gia tộc có sức mạnh, kho, thù, hôn ước; chịu chiến sự, thuế (F2), dân tâm (F4). Gia tộc **suy, diệt, lên** theo thế giới.
- **Bổn phận** (`duty`): nghĩa vụ định kỳ với gia đình hoặc gia tộc: nộp tiền hằng năm, đi giúp, theo hôn ước, giữ bí mật. Làm đủ được ơn, bỏ thì mất ơn và có hậu quả. Bổn phận nhẹ dần khi bạn trưởng thành.
- **Bí mật** (`secret`): mỗi xuất thân có 1 đến 3 bí mật có thể bốc (ví dụ cha mẹ từng thuộc tông bị diệt; gia tộc giữ bản đồ bí cảnh; mẹ là hậu duệ yêu tộc; cha nợ ân hội). Lộ ra theo mốc (A2, A4) hoặc kỳ ngộ.
- **Tuổi thơ** (0 đến 12 tuổi): chạy một **cụm nhỏ 2 đến 3 chặng kể tuổi thơ** theo xuất thân, thay cho mốc A1 chung chung: người chơi chọn một vài điều quyết định nền (học gì, theo ai, giữ hay bỏ đồ cha mẹ); ở chế độ tự động có mặc định theo tính cách.
- **Tư chất, nghề, đồ ban đầu**: nghiêng nhẹ theo xuất thân (t3 nghiêng Mộc/đan, t2 nghiêng Kim/Hỏa/khí, t4 nghiêng bùa...), không phá cân bằng tư chất chung (mix như `family.mixTuChat` lấy thêm một nhịp từ cha mẹ thật nếu là người tu).
- **Cân bằng xuất thân**: mỗi xuất thân có "điểm ưu" và "điểm gánh" cân nhau; nhà giàu mạnh thì gánh nặng (tranh quyền, hôn ước, thù), nhà nghèo thì được khí vận, giao du, tự do. Mục tiêu: tổng tiến độ cả đời mỗi xuất thân **lệch ≤ ±12%** so với trung bình, khác nhau ở hình dạng, không ở mạnh hay yếu.

### 8.3 Xuất thân x Xương sống (khớp nhau)
| Xương sống | Xuất thân ảnh hưởng thế nào |
|---|---|
| A Phàm nhân hướng đạo | chủ yếu quyết định tuổi thơ và lối vào; mọi xuất thân hợp |
| B Xuyên không | **xuất thân là của thân xác chủ cũ**: người chơi nhập vào "đứa trẻ nhà ai"; bạn bị coi là con của họ, nên cảm xúc (p1, p3, t1, t5...) quyết định chặng "Người của thân xác này"; hợp nhất với xuất thân phàm (hiếm khi t9) |
| C Đại năng trọng sinh | xuất thân mới có thể **liên quan kiếp trước** (gia tộc có hậu duệ của bạn cũ; nhà thương nhân cùng vùng nơi bạn từng chết; cha mẹ nhận ra bạn, hoặc kẻ thù cũ nuôi bạn mà không biết); xuất thân giàu mở cửa thu thập di vật nhanh |
| D Huyết mạch thượng cổ | rất hợp **t8 gia tộc ẩn thế**, **t9 cha mẹ đại năng**, **t10 gia tộc sa sút**, **p5 cô nhi** (bị bỏ vì huyết mạch); gia tộc ẩn thế biết bí mật huyết mạch |
| E Thiên phạt chi nhân | gia tộc **ruồng bỏ hoặc che giấu** bạn; xuất thân giàu biến thành áp lực "nhục nhã"; **p5 cô nhi** và **p1 nông hộ** có người tin bạn hơn |
- Có **bảng tương thích** `compat[backbone][origin]` (trọng số), bốc xương sống trước rồi xuất thân theo trọng số tương thích; ví dụ D x t9 tăng, E x t7 vẫn có nhưng thay chữ ("gia tộc muốn giấu bạn"). Mọi cặp đều bốc được, chỉ khác tần suất.

### 8.4 Xuất thân mở gì ở các tầng khác
- **Tuyến thân phận (mục 11)**: p3, t5 mở **Thương nhân** và **Hội viên**; t2, t3, t4 mở **Luyện khí sư/Đan sư/Phù sư** (bản "kế nghiệp gia tộc"); t6 mở **Đệ tử tông**; t7 mở **tranh quyền thừa kế**; t9, t8 mở **người giữ di sản**; t10, t11 mở **kẻ bị truy nã**; p1, p6 mở **người cứu đời** (dịch, hạn); p4 mở **chính trị/quan trường**; p5 mở **tán tu** nặng mùi lang bạt.
- **Kinh tế (E)**: p3, t5 tầm nhìn giá +1, hội thiện cảm khởi đầu; p4 thuế nhẹ; t2, t3 giá nguyên liệu nội bộ rẻ.
- **Tông môn (M)**: t6 vào ngoại môn dễ; t7 vào nội môn dễ; t8, t10, t11 vào khó.
- **Nhật báo (G)**: cha mẹ, gia tộc xuất hiện trong báo; gia tộc suy diệt thành tin lớn.
- **Gia đình, đạo lữ, con cái**: con cái người chơi có xuất thân **kế thừa** (gia tộc của bạn nếu có), đạo lữ mang xuất thân riêng nên liên hôn là chuyện thật.
- **Kế thừa và đầu thai**: kiếp sau bốc xuất thân mới, nhưng nếu người chơi **lập gia tộc** (A5) thì đời sau có xác suất sinh trong gia tộc đó.

### 8.5 Giao diện
- **Hồ sơ nhân vật**: ô "Xuất thân" gồm tên, cha mẹ (tình trạng), gia tộc (sức mạnh, quan hệ), bổn phận hiện có, bí mật đã biết (còn ẩn thì "?").
- **Hộp mở đầu đời** (tuổi 0): hiện ngắn "Bạn sinh ra trong ...", rồi chạy tuổi thơ.
- **Nhật ký**: thẻ "Gia đình" cho các chuyện cha mẹ, gia tộc, bổn phận.
- **Bản đồ**: nơi sinh, nhà gia tộc đánh dấu.


## 9. Xương sống chi tiết: năm "kiểu đời"

**Ý tưởng:** mỗi đời có đúng **một xương sống** (kiểu đời), bốc **một lần lúc sinh**, ẩn với người chơi cho tới khi "thức tỉnh" ở mốc 1. Xương sống quyết định **câu chuyện lớn của cả đời**, cơ chế riêng và các kết cục. Tuyến thân phận, tuyến thế giới và kỳ ngộ (mục 10, 11, 12) cài lên xương sống.

| # | Xương sống | Tỉ lệ gốc | Cảm giác |
|---|---|---|---|
| A | **Phàm nhân hướng đạo** (mặc định) | 75% | từ cỏ rác leo lên, câu chuyện tu tiên thuần túy |
| B | **Xuyên không** | 6% | người ngoài thế giới, kiến thức lạ, tìm chỗ đứng hoặc đường về |
| C | **Đại năng trọng sinh** | 5% (tới 15% nếu kiếp trước đạt Nguyên Anh trở lên) | từng đứng trên đỉnh, giờ làm lại từ đầu, gánh thù và ký ức |
| D | **Huyết mạch thượng cổ** (gợi ý 1) | 7% | dòng máu long, phượng, thần tộc bị phong ấn, bị săn đón |
| E | **Thiên phạt chi nhân** (gợi ý 2) | 7% | bị Thiên Đạo đánh dấu, cả đời bị trời chặn nhưng sinh ra sức nghịch |

- Tỉ lệ do bạn chỉnh được trong dữ liệu (`D.STORY.backbone.w`). Người chơi **không tự chọn**; mỗi lần đầu thai bốc lại (trừ khi kiếp trước để lại "dấu" ở mục 9.7).
- **Thức tỉnh** (mốc 1) mới lộ tên kiểu đời trong Hồ sơ và Sổ đời; trước đó chỉ thấy "dấu hiệu" mơ hồ trong nhật ký (người chơi tinh ý đoán ra).
- Xương sống có **6 mốc** như nhau để giao diện và đo đạc thống nhất; mỗi mốc là một chặng (hoặc cụm chặng) với 2 đến 4 lựa chọn lớn và một mầm hậu quả trễ.
- NPC lõi có thể mang xương sống B, C, D, E rất hiếm (cỡ 1/300), thành **nhân vật nổi tiếng trong thế giới** (lên báo, gây tin đồn "đại năng chuyển thế"); không có tuyến hoàn chỉnh, chỉ đóng vai nguồn truyện cho người chơi gặp.

### 9.1 Xương sống A: Phàm nhân hướng đạo (75%)
| Mốc | Khi nào | Chuyện | Lựa chọn chính | Hậu quả |
|---|---|---|---|---|
| A1 Mầm xanh | 0 đến 12 tuổi | xuất thân, kiểm tra tư chất, người dẫn đường đầu tiên | vào tông / theo sư phụ tán tu / tự học sách cũ | quyết định nền đạo đầu (nối ngã rẽ C), người định mệnh #1 (sư hoặc người bạn đồng kỳ) |
| A2 Ngưỡng cửa | chạm Luyện Khí | cái giá của tu hành: gia đình cần mình, cơ duyên gọi mình đi | ở lại giúp nhà / rời quê / đưa cả nhà đi | quan hệ gia đình, nợ nhân tình, mầm "nhớ quê" về sau |
| A3 Nền móng | Trúc Cơ | ma chướng và lần đầu giết người hoặc tha người | tâm cứng / tâm mềm / né tránh | đạo tâm, nghiệp, đồng kỳ trở thành bạn hay thù |
| A4 Vị thế | Kim Đan | biến cố thế giới kéo vào (chiến sự, hạn, hiệp ước) | chọn phe / đứng ngoài / lợi dụng | ơn, oán, danh vọng, tiếng trên báo |
| A5 Đạo quả | Nguyên Anh | thu đồ, lập tông, nhận trách nhiệm, đồng kỳ trở lại | lập nghiệp / độc hành / nhường cho đời sau | di sản (đồ đệ, tông, của để lại) |
| A6 Thiên môn | Hóa Thần trở lên | thiên kiếp và cái giá cuối cùng | phi thăng / tọa hóa để lại truyền thừa / đọa ma / ẩn thế | 4 kết cục, ghi Sổ đời, quà cho đời sau |
- Là xương sống "chuẩn": nối thẳng ngã rẽ, nhiệm vụ, đột phá hiện có; ít cơ chế đặc biệt, làm **nền để so các kiểu khác**.

### 9.2 Xương sống B: Xuyên không (6%)
**Chuyện:** một linh hồn từ nơi khác (không nói rõ, người chơi tự đoán) thức dậy trong thân xác của một đứa trẻ hoặc thiếu niên của thế giới này. Chủ cũ của thân xác đã mất hoặc... chưa hẳn.
- **Cơ chế riêng:**
  - **Dị tri** (điểm hiếm, 0 đến 10): kiến thức ngoài thế giới. Dùng để "phát minh" (cải tiến đan phương, luyện khí, cách buôn, cách chữa bệnh) cho một lần thưởng lớn **nhưng đổi bằng đồng hồ Lộ**.
  - **Lộ** (0 đến 100): mức người ta nghi ngờ bạn không phải người bản xứ (nói lạ, biết lạ). Cao thì tông, triều, thương hội chú ý, có thể bị thu hút hoặc bị coi là yêu quái.
  - **Lạc lõng** (phạt đầu đời): giao du kém, hiểu sai lễ nghĩa, tu luyện chậm nhẹ, đạo tâm dễ lung lay; **giảm dần** khi có người thân thật.
  - **Cú nhìn khác**: luôn thấy một vài thứ người bản xứ không thấy: tầm nhìn thị trường +1 (xem E), thấy bất hợp lý trong luật (hiệp ước, thuế), thấy mầm mống của thiên tai sớm hơn.
- **Sáu mốc:**
  1. **Tỉnh dậy** (tuổi 5 đến 25, ngẫu nhiên): giấu hay thổ lộ với ai đó; người thân của chủ cũ phát hiện bạn "khác".
  2. **Học làm người ở đây**: sống sót, học quy tắc; người định mệnh #1 là ai dạy mình (kẻ lừa, ân nhân, hay người thấy rõ bạn không phải chủ cũ).
  3. **Thử dùng kiến thức**: ba lối phát minh (đan, khí, buôn); thành công thì lên danh, nhưng Lộ tăng.
  4. **Người của thân xác này**: gặp gia đình thật hoặc người yêu của chủ cũ; chọn gánh trách nhiệm hay xa lánh; tình cảm sinh thật.
  5. **Cánh cửa**: lần đầu thấy dấu hiệu về một đường trở lại (tàn tích đặc biệt, bí cảnh "không thuộc thế giới này"); các thế lực nghe đồn.
  6. **Ở hay về**: **về** (mất hết, kết thúc đặc biệt, để lại "ký ức thế giới ngoài" cho đời sau), **ở lại** (hòa vào thế giới, dùng dị tri làm di sản), hoặc **mở cổng** (kéo người khác sang: đại biến thế giới, nhiều xuyên không NPC xuất hiện).
- **Tác động tới thế giới:** phát minh thành "tin đột phá" trên báo; có thể làm cú sốc giá (đan rẻ đi khi công thức lan).

### 9.3 Xương sống C: Đại năng trọng sinh (5%, tăng theo kiếp trước)
**Chuyện:** hồn một đại năng (cảnh giới cao) chuyển vào thân xác nhỏ yếu; tu vi kiếp trước không còn, nhưng **ký ức, nhãn lực và nợ cũ còn nguyên**. Thế giới đã đi vài trăm năm; bạn bè cũ có thể đã chết, thù cũ có thể là chưởng môn.
- **Cơ chế riêng:**
  - **Tái tu**: tốc độ tu luyện **rất nhanh** cho đến khi chạm mức bạn từng đạt, rồi **chậm lại** (nút thắt). Ngộ tính cao, ít cần sách.
  - **Tâm ma kiếp trước**: ký ức gây ảo ảnh ở các mốc đột phá cũ; ngưỡng nguy hiểm đặt đúng cảnh giới mà kiếp trước gục ngã.
  - **Nợ kiếp trước**: ân, oán, lời thề còn hiệu lực (thù dò ra bạn, di vật cần tìm); sinh các tuyến phụ.
  - **Di vật**: pháp bảo bản mệnh cũ nằm đâu đó; tìm được thì mở sức mạnh lớn nhưng báo hiệu cho kẻ thù.
- **Sáu mốc:**
  1. **Thức tỉnh ký ức** (3 đến 20 tuổi): giấu hết, nhờ người tin cậy, hay lao đi tìm di vật; kẻ có thể đã nghe tin.
  2. **Dấu vết quá khứ**: đọc tin báo và biên niên sử để biết thế giới đã đổi (tông cũ diệt, bạn cũ lên vị trí lạ); chọn nơi bắt đầu tái dựng.
  3. **Di vật và nhân tình cũ**: tìm pháp bảo/hang động cũ; gặp người cũ (hoặc con cháu họ), họ có nhận ra không.
  4. **Kẻ thù nhận ra bạn**: đối đầu sớm bằng trí hay trốn; chuyện ân oán chạm vào thế lực hiện có.
  5. **Điểm gục ngã**: tới cảnh giới và hoàn cảnh bạn từng chết; tâm ma, một chọn lựa quyết định (lặp lại hay đổi).
  6. **Kết cục:** **vượt kiếp trước** (đạt cao hơn, kết đặc biệt), **lặp lại số phận** (ngã đúng chỗ cũ), hoặc **buông** (làm người bình thường, bình yên kết thúc).
- **Kích hoạt tăng theo kiếp trước:** nếu đời trước của người chơi đạt Nguyên Anh trở lên, xác suất chọn C tăng và **chính kiếp trước của bạn là "đại năng" đó** (ký ức, thù, di vật lấy từ Sổ đời).

### 9.4 Xương sống D: Huyết mạch thượng cổ (7%, gợi ý)
**Chuyện:** bạn mang một dòng máu cổ (long, phượng, thần thú, thượng cổ tộc). Nó ngủ yên, hé lộ bằng dị tượng, thu hút các thế lực muốn dùng bạn.
- **Cơ chế riêng:** đồng hồ **Huyết** (0 đến 100). Tăng thì sức mạnh, tu vi, kháng nguyên tố tăng mạnh; nhưng **nhân tính giảm** (giao du, chính đạo, tình người), cao tới ngưỡng thì **dị hóa** (ngoại hình, tính tình, kẻ thù từ chính huyết tộc). Hạ Huyết bằng đan phương/hồ băng đòi giá lớn.
- **Sáu mốc:** (1) **Dị tượng** thời thơ ấu (điềm lành hay quái vật); (2) **Thức tỉnh lần một** cần cơ duyên (linh vật, nguy cơ sinh tử); (3) **Bị săn đón**: tông muốn thu, triều muốn dùng, yêu tộc muốn nhận về; (4) **Thức tỉnh lần hai** có giá nặng (Huyết nhảy vọt, thân thể đổi); (5) **Tìm nguồn gốc**: tàn tích tộc, người thân thất lạc, đặt câu hỏi ai bỏ bạn; (6) **Kết cục**: làm **tộc trưởng chính thống** (quay về), **tự do giữa hai thế giới**, hoặc **bị huyết mạch nuốt** (đọa thành yêu/thần thú, thế giới đổi).
- **Đời sau:** có thể truyền một phần huyết mạch cho con cháu (tăng tỉ lệ D cho dòng đó).

### 9.5 Xương sống E: Thiên phạt chi nhân (7%, gợi ý)
**Chuyện:** từ khi sinh, Thiên Đạo đã đánh dấu bạn: khí vận âm nặng, tai họa theo bước chân, người thường xa lánh. Đổi lại bạn có **sức nghịch**: càng vượt khó càng mạnh.
- **Cơ chế riêng:**
  - **Phạt** (đồng hồ): các "giáng họa" định kỳ (mỗi vài năm một nạn), mức tăng dần; có thể giảm bằng ân đức, giải ấn, nhưng không tắt hẳn.
  - **Nghịch** (điểm): cộng mỗi lần sống sót nạn, thắng nghịch cảnh; đổi lấy thưởng đặc biệt (tư chất, kháng tai họa, đột phá), liên kết với **Nghịch Thiên Cải Mệnh** hiện có (rẻ hơn, hiệu lực lớn hơn).
  - **Cô lập**: giao du, hội, tông khó nhận; bù bằng **một người** hiếm hoi tin bạn (người định mệnh).
- **Sáu mốc:** (1) **Bị xa lánh** từ nhỏ; (2) **Phát hiện dấu** (một kẻ muốn giết, một kẻ muốn lợi dụng, một người cố giải); (3) **Ba đường đối với dấu**: xóa (tốn rất lớn), sống chung (dần mạnh), chuyển sang người khác (nghiệp nặng); (4) **Giáng họa đầu tiên** rõ ràng (thế giới thấy cả vùng bị họa); (5) **Đối mặt Thiên Đạo** trước thiên kiếp (chọn đường nhận phạt hay nghịch); (6) **Kết cục**: **phá dấu** (tự do), **thành sứ giả Thiên Đạo** (đổi phe), hoặc **đồng quy** (cùng phá trời, biến cố thế giới).
- **Tác động thế giới:** giáng họa nặng có thể kéo hạn, dịch, cướp ở vùng đang ở (nối thiên tai thật); người dân đổi thái độ theo.

### 9.6 Bảng so sánh (để chỉnh cân bằng)
| | A | B | C | D | E |
|---|---|---|---|---|---|
| Khởi đầu | trung bình | yếu xã hội | yếu thể chất, nhanh ngộ | khá, bị săn đón | rất khó |
| Giữa đời | đều | bùng nổ nếu khéo | nhanh rồi nghẽn | mạnh nhưng giá nhân tính | chậm rồi bứt |
| Rủi ro riêng | thấp | Lộ cao | tâm ma, kẻ thù cũ | dị hóa | Phạt |
| Thưởng riêng | di sản | dị tri, phát minh | di vật, ký ức | huyết mạch | Nghịch |
| Mục tiêu cân bằng | chuẩn | ≈ chuẩn | ≈ chuẩn (nhanh đầu, chậm sau) | ≈ chuẩn + dễ chết | ≈ chuẩn - đầu, + cuối |
- Mục tiêu: tổng tiến độ cả đời **không lệch quá ±15%** so với A trên mô phỏng (`story-sim`); khác biệt nằm ở **hình dáng** đường đời, không ở mạnh hay yếu tổng.

### 9.7 Quan hệ với đầu thai và kế thừa
- Mỗi kiểu đời ghi vào **Sổ đời** (kiểu, kết cục). Kết cục đẹp có thể để lại "dấu": B về nhà, C vượt kiếp trước, D tộc trưởng, E phá dấu: tăng nhẹ tỉ lệ chọn kiểu đó hoặc kiểu đối ứng ở đời sau (ví dụ xuyên không kết cục "về" sinh ra người có mộng lạ).
- Kế thừa (con cháu, đồ đệ): D có thể truyền; các kiểu khác chỉ truyền **ân, oán, di vật**.

### 9.8 Cách thể hiện cho người chơi
- Giao diện Hồ sơ: ô **"Kiểu đời"** hiện "chưa thức tỉnh" cho tới mốc 1; sau đó có tên kiểu, đồng hồ riêng (Dị tri/Lộ, Huyết, Phạt/Nghịch...), và 6 mốc dạng đường đi (đã qua, đang ở, chưa tới).
- Nhật ký có thẻ riêng, sao tự động cho cả 6 mốc.
- Chế độ tự động: mỗi mốc có **mặc định hợp tính cách**; luật nếu-thì đọc được nhãn loại giá.



---

# PHẦN IV. CỐT TRUYỆN


## 10. Kiến trúc tuyến truyện (story arc), kỳ ngộ và lựa chọn
Một tuyến là **đồ thị các chặng** (không phải danh sách thẳng).

```
tuyến { id, tên, loại, mở khi (điều kiện), chặng: { id: { chữ, lựa chọn[], hạn, tự tiến } }, kết cục[] }
chặng.lựa chọn { nhãn, điều kiện (hiện lý do nếu khóa), chi phí, kết quả -> chặng kế | kết cục, hậu quả (ngay, trễ), cờ }
```

- **Trạng thái theo nhân vật** `c.story = { arcs: { id: { st, since, due, flags, log } }, done: [...], karma: {} }` (khởi tạo muộn, không đổi `TT.VERSION`).
- **Mở tuyến** bằng điều kiện: cảnh giới, nghề, đạo (ngã rẽ), tông, địa điểm/vùng, quan hệ, tài sản, tin báo, cú sốc đang diễn ra, mốc dân số/hiệp ước...
- **Chặng có hạn**: không xử lý trong N tháng thì **tự tiến theo mặc định** (bỏ lỡ cũng là hậu quả, ghi nhật ký).
- **Hậu quả trễ** (`due`): đặt một "quả" chín sau 6 đến 120 tháng (ví dụ ân nhân tới trả ơn, kẻ thù tìm đến, món nợ tông, tin đồn bị báo đăng).
- **Nhân quả** (`karma`): vài đồng hồ nhỏ (ân, oán, danh, nghiệp, đạo) cộng dồn từ nhiều tuyến, mở/đóng chặng và kết cục; hiện trong Hồ sơ.
- **Nhân vật định mệnh**: khi tuyến cần người, dựng NPC thật vào thế giới (tái dùng `TT.social`/`setup`), người này sống tiếp ngoài tuyến (thù, bạn, sư, đối thủ), có thể chết, có thể xuất hiện ở báo.

### Ba tầng truyện
| Tầng | Là gì | Số lượng đề xuất | Ví dụ |
|---|---|---|---|
| Xương sống | kiểu đời bốc lúc sinh, hành trình 6 mốc (mục 9) | 5 kiểu, mỗi kiểu 6 mốc | bước vào tu hành, thành tựu đầu, thử thách đột phá, vị thế, thiên kiếp, phi thăng hoặc để lại di sản |
| Tuyến theo thân phận | mở theo nghề, đạo, tông, hội, thế lực, tiên thiên | 14 tuyến, 4 đến 6 chặng | đan sư, luyện khí, thương nhân, tán tu, đệ tử tông, trưởng lão, hội viên, kẻ bị truy nã... |
| Tuyến thế giới | sinh từ biến cố thế giới, nhiều người cùng thấy | 8 tuyến, 3 đến 5 chặng | chiến sự nổ ở vùng bạn, đại hạn, dịch, đường buôn đóng, hiệp ước bị phá, thời đại đổi |

### Kỳ ngộ làm lại (bốn dạng)
1. **Cơ duyên khám phá (có manh mối)**: gắn với nơi (khu tài nguyên, bí cảnh, tàn tích, linh mạch). Manh mối đến từ tin đồn, báo, NPC, bản đồ (chấm mờ). Người chơi có thể đi tìm; chặng có rủi ro.
2. **Kỳ ngộ nhân vật**: gặp người định mệnh (cao nhân, truyền nhân, tà tu, sư thất lạc), mở tuyến nhiều chặng.
3. **Kỳ ngộ vận mệnh** (còn xúc xắc nhưng hiếm, tính vào khí vận): giữ kết quả cũ (tư chất, biến dị, tiên thiên) nhưng thêm **cái giá hoặc mầm hậu quả** để không phải "trúng là lời".
4. **Kỳ ngộ do thế giới**: cú sốc giá, hạn, dịch, chiến sự, hiệp ước, tông mở kho, báo đăng tin; mỗi biến cố có 1 đến 3 "móc" mời người chơi nhúng tay (buôn lậu, cứu trợ, làm lính, tố cáo...).

### Lựa chọn có sức nặng
- Mỗi lựa chọn ghi rõ **loại giá**: tiền, thương, thời gian, quan hệ, danh, nghiệp, đạo tâm, tài nguyên tông.
- **Khóa thấy được**: lựa chọn bị khóa vẫn hiện, kèm lý do (cần nghề, cần quan hệ, cần tiền...), để người chơi biết mình thiếu gì và hướng đời theo đó.
- **Mức nhìn trước** theo đạo tâm, nghề, báo: thấy "có vẻ nguy hiểm" hay thấy cả xác suất (không bao giờ thấy hết).
- **Không chọn là một lựa chọn** (hết hạn thì máy chọn mặc định theo tính cách, ghi hậu quả).
- **Luật tự động**: tận dụng `TT.rules.pickChoice` đã có; thêm nhãn `kind` và `price` để quy tắc nếu-thì đọc được.


## 11. Tuyến thân phận chi tiết (14 tuyến, mỗi tuyến 5 chặng)

### 11.0 Danh sách tuyến thân phận (tổng quan)
| Mã | Tên | Mở khi | Tiên thiên/tính cách hợp | Móc hệ khác |
|---|---|---|---|---|
| T1 | Tán tu: "Gió không thuộc về ai" | không tông, không hội, từ Luyện Khí | Xử thế linh hoạt, p5 p1 t1 t11 | tông, hội, hiệp ước |
| T2 | Đệ tử tông: "Dưới mái ngói sơn môn" | vào tông | t6, Ngộ tính | tông, báo |
| T3 | Đan sư: "Một lò, ba phương" | nghề đan cấp 2, t3 | Mộc linh thể, Linh giác | giá thảo, dịch |
| T4 | Luyện khí sư: "Thanh kiếm dang dở" | nghề khí cấp 2, t2 | Kim/Hỏa linh thể, Thần lực | mỏ, chiến sự |
| T5 | Thương nhân: "Một chuyến buôn" | nghề thương nhân, p3 t5 | Mệnh hảo, Linh giác, Xử thế linh hoạt | eco, hội, ải |
| T6 | Hội viên thương hội: "Dưới cờ hội" | gia nhập hội | Xử thế linh hoạt | hoi, eco |
| T7 | Kẻ truy nã: "Tiếng chuông đuổi" | bị truy nã, t10 t11 | Tính tình điềm tĩnh | báo, pacts, vượt vùng |
| T8 | Đạo lữ và gia đình: "Hai người, một đạo" | hôn ước/đạo lữ (cơ chế ở R) | Đạo đức, Tính tình | gia tộc, family |
| T9 | Báo thù: "Món nợ máu" | có kẻ thù thật | Kiếm cốt/Ma cốt (nhánh), Thiên nhãn | nhân vật định mệnh |
| T10 | Giữ di sản: "Chiếc chìa khóa cũ" | di vật, t8 t9 t10, tông diệt | Trùng đồng | bản đồ, tông diệt (W6) |
| T11 | Người cứu đời: "Giữa lúc dân khổ" | tai họa vùng, Đạo đức ≥ +1 | y thuật, p1 p6 | pop, eco |
| T12 | Kẻ nghịch thiên: "Cãi lệnh trời" | Nghịch Thiên Cải Mệnh, xương sống E | Thiên phạt dấu | thiên kiếp, W8 |
| T13 | **Móc mắt (trùng đồng)** | Trùng đồng, từ Trúc Cơ | Trùng đồng | chợ đen, hội, báo |
| T14 | **Đào cốt (đạo cốt)** | Đạo cốt, từ Trúc Cơ | Đạo cốt | chợ đen, tông, báo |
- **Đợt đầu chơi thử**: T1, T2, T3, T5 (bốn tuyến khác loại: tự do, tông, nghề, buôn), cùng W1 đến W3.
- **Hạn chế**: các mã, tên là tên làm việc; có thể đổi khi viết nội dung.


Quy ước: **mở khi** là điều kiện; **chặng** liệt kê tên và việc chính (mỗi chặng 2 đến 4 lựa chọn, kèm loại giá); **người định mệnh** là vai NPC thật dùng chung (xem 13.3); **kết cục** có 3 nhánh; **móc** là hệ khác mà tuyến đọc hoặc ghi. Có thể chạy **nhiều tuyến thân phận cùng lúc** nhưng chỉ **một chặng "nóng"** (đang chờ quyết) tại một thời điểm.

**T1. Tán tu: "Gió không thuộc về ai"**
- Mở khi: không có tông, không là hội viên, Luyện Khí trở lên (hợp p5, p1, t1, t11).
- Chặng: (1) **Bữa cơm ân** một người xa lạ cứu đói, ghi một món nợ; (2) **Chợ tán tu**: học luật ngầm, gặp kẻ lừa hoặc bạn đồng hành; (3) **Bị chèn ép** bởi tông hoặc hội ở một mỏ/thôn, chọn nhịn, đánh, hay bỏ đi; (4) **Ba lời mời** (tông, hội, triều), nhận một hay giữ tự do; (5) **Ngày trả nợ**: mọi ân oán dồn về một chỗ.
- Kết cục: tự do vang danh / sa vào một bên / bị nghiền giữa các thế lực.
- Người định mệnh: Ân nhân, Kẻ lừa. Móc: tông (M), hội (E), hiệp ước (F2).

**T2. Đệ tử tông: "Dưới mái ngói sơn môn"**
- Mở khi: vào tông (ngoại môn trở lên).
- Chặng: (1) **Ngày đầu**: huynh đệ, kẻ bắt nạt, một người đỡ; (2) **Thử luyện** chọn cách thắng (sức, mưu, nhờ vả); (3) **Bí mật của sư huynh**: tông giấu một việc, bạn biết hay không; (4) **Đại bỉ và phe phái**: bị kéo vào chính trị (nối M4 sau); (5) **Giữ, phản, hay rời**.
- Kết cục: kế vị/ thăng vị cao / rời tông trong êm đẹp / bị trục xuất mang hận.
- Người định mệnh: Sư phụ, Sư huynh (có thể là Đối thủ), Kẻ phản bội. Móc: tông, tài nguyên tông, báo.

**T3. Đan sư: "Một lò, ba phương"**
- Mở khi: nghề đan cấp 2 trở lên, hoặc t3.
- Chặng: (1) **Đan phương cổ** tìm được/được truyền; (2) **Bệnh nhân khó** (đan thử, danh và nghiệp); (3) **Thiếu nguyên liệu** (hạn, giá thảo vọt, đường buôn đóng: lấy từ cú sốc thật); (4) **Bị cướp công hoặc đan bị làm giả** (tông, hội, hay đối thủ); (5) **Mở đan phường** / dâng phương cho tông / giấu kín.
- Kết cục: đan đạo tông sư / đan độc thành nghiệp / thương nhân hóa. Giá: nghiệp, nợ nguyên liệu.
- Người định mệnh: Bệnh nhân, Đối thủ đan sư. Móc: eco (giá thảo, đan), pop (dịch).

**T4. Luyện khí sư: "Thanh kiếm dang dở"**
- Mở khi: nghề luyện khí cấp 2 trở lên, hoặc t2.
- Chặng: (1) **Kiếm dở** một món chưa hoàn thành, không biết của ai; (2) **Người đặt hàng bí ẩn** (tông? ma tu?); (3) **Khoáng hiếm**: mỏ bị tranh (khu tài nguyên thật), cần chọn bên; (4) **Kiếm có linh**: khí linh hé lộ (nối M8 sau); (5) **Giao, giữ, hay phá**.
- Kết cục: khí đạo thành danh / kiếm thành họa / thành tâm giao với khí linh.
- Người định mệnh: Người đặt hàng, Khí linh. Móc: tài nguyên mỏ (N), chiến sự (vũ khí).

**T5. Thương nhân: "Một chuyến buôn"**
- Mở khi: nghề Thương nhân cấp 2, hoặc p3/t5, hoặc đã mua bán đủ lớn (`tradeEarn`).
- Chặng: (1) **Chuyến buôn đầu** (nguy cơ cướp đường thật); (2) **Đối thủ hạ giá** (cuộc chiến giá, nhìn thấy sức ép mua bán dồn); (3) **Cơ hội độc quyền** khi có cú sốc giá (nên nhập gì); (4) **Hợp đồng sinh tử** giữa hội và triều (thuế, ải); (5) **Đế chế nhỏ / phá sản / bị hội nuốt**.
- Người định mệnh: Đối thủ buôn, Người mối hội. Móc: eco, hoi, pacts.

**T6. Hội viên thương hội: "Dưới cờ hội"**
- Mở khi: gia nhập hội (hội viên trở lên).
- Chặng: (1) **Việc hội đầu tiên**; (2) **Hai phe trong hội** (tích trữ hay xả hàng); (3) **Hàng cấm**: làm ngơ, tố cáo, hay dính; (4) **Bị đẩy làm tay trong** cho một bên; (5) **Lên hội trưởng / phản hội / rời** (bậc hội).
- Kết cục: lên bậc cao / bị khai trừ / lập hội riêng (rất hiếm).
- Người định mệnh: Chấp sự, Kẻ phản bội. Móc: hoi (rank, rep), eco (hội xả/tích trữ ghi vào giá).

**T7. Kẻ truy nã: "Tiếng chuông đuổi"**
- Mở khi: bị truy nã (trục xuất tông, đắc tội triều/hội, t10, t11, giết người nặng nghiệp).
- Chặng: (1) **Tiếng chuông** (truy lệnh ra, báo đăng); (2) **Nơi trú** một làng che chở, có giá; (3) **Thợ săn tiền thưởng** đuổi tới (đối đầu hay thương lượng); (4) **Cơ hội rửa tội** (chứng cứ, cống nạp) hoặc **trốn sang vùng khác**; (5) **Kết thúc truy đuổi**.
- Kết cục: rửa tội / sống ẩn / sa đọa thành ma. Móc: Nhật báo (truy nã), pacts (nơi trú ẩn), cross (trốn vùng).

**T8. Đạo lữ và gia đình: "Hai người, một đạo"** *(cơ chế đạo lữ, con cái, hôn ước nằm ở kế hoạch riêng [R-nhan-duyen](R-nhan-duyen.md); T8 chỉ là tuyến truyện đứng trên cơ chế đó)*
- Mở khi: có hôn ước hoặc kết đạo lữ (hoặc t7 liên hôn).
- Chặng: (1) **Gặp hoặc nhận hôn ước**; (2) **Thử tình** (khác đạo, khác thế lực); (3) **Hai gia tộc** (xung đột, của hồi môn, bổn phận); (4) **Con** (hy vọng, mất, tư chất); (5) **Giữa đạo và nhà**: tu sâu, hoặc ở bên.
- Kết cục: song tu cùng đỉnh / tách đường êm đẹp / mất nhau. Móc: family, gia tộc (8), xuất thân.

**T9. Báo thù: "Món nợ máu"**
- Mở khi: có kẻ thù thật (nhân vật định mệnh, kẻ giết cha mẹ, kẻ hại người thân).
- Chặng: (1) **Biến cố** (mất người thân hoặc bị hại); (2) **Dấu vết**; (3) **Lý do của kẻ thù** (không còn đen trắng); (4) **Quyết chiến**; (5) **Hậu quả**: nghiệp, trống rỗng, hoặc tha.
- Kết cục: báo thù xong / tha thứ / sa đọa. Giá: nghiệp, đạo tâm. Người định mệnh: Kẻ thù (có thể chung với T2, T7).

**T10. Giữ di sản: "Chiếc chìa khóa cũ"**
- Mở khi: có di vật từ cha mẹ đại năng, gia tộc ẩn thế/sa sút, hoặc tông diệt (tuyến thế giới W6).
- Chặng: (1) **Chìa khóa**; (2) **Tàn tích/di tích** (khu thật trên bản đồ); (3) **Người canh giữ** (khảo nghiệm); (4) **Thế lực nhòm ngó** (tông, hội, triều, ma tu); (5) **Kế thừa / phá / gửi lại**.
- Kết cục: nhận di sản (pháp bảo, công pháp, thế lực) / hủy để không ai nhận / mất vào tay kẻ khác. Móc: bản đồ, tông diệt, báo.

**T11. Người cứu đời: "Giữa lúc dân khổ"**
- Mở khi: tai họa thế giới ở vùng bạn (W1 đến W4) và (y thuật/đan sư/hảo tâm/xuất thân p1, p6).
- Chặng: (1) **Tai họa tới**; (2) **Cứu một làng** (tốn tiền, thuốc, công); (3) **Quyền lực chặn** (thuế, cửa ải, tông giữ kho); (4) **Đứng về dân hay quyền lực**; (5) **Danh, thù, hay nghiệp** (tùy bạn làm gì).
- Kết cục: được dân tôn / bị quyền lực ghét / hai bên đều giữ ơn. Móc: pop (dân tâm), eco (giá, thuế), pacts.

**T12. Kẻ nghịch thiên: "Cãi lệnh trời"**
- Mở khi: đã dùng Nghịch Thiên Cải Mệnh, hoặc xương sống E, hoặc thất bại thiên kiếp mà sống.
- Chặng: (1) **Lần cải mệnh đầu**; (2) **Cái giá hiện ra** (họa trên người thân/vùng); (3) **Kẻ cùng nghịch** (đồng minh hoặc kẻ lợi dụng); (4) **Thiên Đạo đáp** (giáng họa lớn); (5) **Chung cuộc** nối thiên kiếp.
- Kết cục: phá trời / sứ giả Thiên Đạo / đồng quy. Móc: thiên kiếp, xương sống E, tuyến thế giới W8.

**T13. Móc mắt (trùng đồng): "Đôi mắt không phải của mình"** *(tuyến mới, tối tăm, nhiều nghiệt duyên)*
- **Điều kiện mở:** liên quan **tiên thiên Trùng đồng** (4), một trong ba vai: **(a) bạn mang Trùng đồng** và bị săn; **(b) bạn gặp người mang Trùng đồng** (đứa trẻ, đệ tử, đối thủ) và có cơ hội lấy hoặc cứu; **(c) bạn nhận được một đôi mắt đã bị lấy** (di vật, đồ nhái, món bí mật chợ đen, người nhờ cấy). **Ngưỡng đạt (bạn chốt 2026-10-18): từ Trúc Cơ trở lên** (người chơi hoặc kẻ ra tay phải ít nhất Trúc Cơ; đề nghị "gấp" nên mở sớm).
- **Chặng (5):**
  1. **Dấu hiệu**: đồng tử lạ, tin đồn, thầy tướng, một người biết đôi mắt đó đáng giá bao nhiêu.
  2. **Kẻ săn**: lời đề nghị, đe dọa hoặc cái bẫy; hé lộ **giá thật** của đôi mắt (cấy cho người nào, ai cần, vì sao).
  3. **Khoảnh khắc (không chọn, do số mệnh)**: **việc có dùng Trùng đồng hay không, có móc hay không, có bị móc hay không đều do vòng quay vận mệnh (7) quyết**, người chơi chỉ **xem vòng quay** (và có thể quay lại bằng khí vận). Mỗi vai một vòng riêng, đúng một yếu tố cộng điểm (xem 11.2).
  4. **Hệ quả**: người mất mắt học **thấy bằng tâm**, sống tiếp; người nhận mắt có **sức mạnh nhưng phản phệ** ("thấy hồn", oán niệm, đau đầu, mắt của chủ cũ thỉnh thoảng nhìn về hướng cũ), hoặc cấy thất bại (mù cả hai).
  5. **Nghiệt duyên hội ngộ** (sau 8 đến 40 năm thế giới): **người bị móc hoặc người mang mắt đó trở lại**, đã trưởng thành: là **đồ đệ của bạn** (bạn nhận nuôi không biết, hoặc bạn là nạn nhân và nhận kẻ lấy mắt làm đồ đệ), **kẻ thù**, **người ân**, hoặc **người xa lạ cứ nhìn bạn như đã từng gặp**.
- **Kết cục:** chuộc tội (trả mắt hoặc trả giá), tha thứ, báo thù, hoặc mối nợ truyền sang đời sau. Không có kết cục "sạch": luôn mang **nghiệp** hoặc **ơn** (nhân quả).
- **Nghiệt duyên** (cơ chế chung với T14, xem 11.1): người bị móc **là NPC thật**, sống tiếp, lớn lên, có đường tu riêng (tu bằng thần thức, mắt giả, nhập tông khác), có thể lên báo ("kẻ mù Thiên Cơ"). Mối ràng buộc kích hoạt chặng hội ngộ theo đồng hồ.
- **Thế giới:** ảnh hưởng chợ đen (đồ nhái và đồ thật), thiện cảm hội (bị nghi thu mua), tông chính đạo thù, Nhật báo đăng "vụ án mắt".

**T14. Đào cốt (đạo cốt): "Căn cốt của kẻ khác"** *(tuyến mới, cùng bộ khung T13)*
- **Điều kiện mở:** **tiên thiên Đạo cốt** (hoặc Tiên cốt/Ma cốt/Kiếm cốt, tùy nhánh), ba vai tương tự T13: **(a) bạn mang đạo cốt**, **(b) bạn gặp người mang đạo cốt**, **(c) bạn được người ta đưa một đạo cốt để cấy** (kẻ hào phóng, cha mẹ hy sinh, tông bán). **Ngưỡng đạt: từ Trúc Cơ trở lên** (như T13).
- **Chặng (5):** (1) **Dấu hiệu** căn cốt lạ (tu nhanh bất thường, người hâm mộ và kẻ thèm); (2) **Người cần cốt** (đệ tử cần, tông cần, người thân hấp hối) và **cái giá** (cấy cốt đòi hy sinh chủ cũ hoặc chia sẻ); (3) **Khoảnh khắc (không chọn, do số mệnh)**: **việc đào, cấy hay dùng đạo cốt đều do vòng quay vận mệnh quyết** (tương thích cốt: cấy thành công hay cốt phản chủ), xem 11.2; (4) **Hệ quả**: người mất cốt **tu vi tụt, thân thể yếu hoặc phế**, có thể phải **tìm cách tu khác**; người nhận cốt **tăng tư chất, tu nhanh**, nhưng **cốt có linh** (tâm ma mang mùi chủ cũ, bóng chủ cũ trong mộng); (5) **Nghiệt duyên hội ngộ**: người mất cốt xuất hiện lại.
- **Kết cục:** trả cốt, nhường cốt, đồng tu (hai người chia một đạo cốt, hiếm), báo thù, hoặc cốt thành tai họa (cốt ma hóa).
- **Khác T13:** nhấn vào **cái giá thân thể** (cấy cốt đau, phản phệ chậm), **cốt tương thích theo tư chất** (cấy ngũ hành sai thì tai họa), và **tiên thiên của người nhận đổi** (nhận Đạo cốt thì thay ô Cốt; cốt cũ mất).

### 11.1 Cơ chế Nghiệt duyên (dùng chung T13, T14 và về sau T9, T7)
- **Nghiệt duyên** = một **ràng buộc nợ thân thể hoặc nợ mạng** giữa hai nhân vật (một người **là bạn** hoặc **là NPC khác**). Cấu trúc `{a, b, loại ('mắt'|'cốt'|'mạng'|'ơn'), nợ, cần trả, hạn gặp}`.
- **Đồng hồ hội ngộ**: bốc một mốc 8 đến 40 năm thế giới; tới hạn thì sinh một **chặng hội ngộ** ở T13/T14; trong khoảng đó, **người bị hại sống tiếp** theo sim NPC (có thể chết, vào tông, lên báo).
- **Biến thể vai** khi hội ngộ: **Đồ đệ** (gặp lại qua chuyện nhận đồ đệ), **Kẻ thù**, **Ân nhân bất đắc dĩ**, **Người lạ nhìn như quen** (chỉ lộ cuối); bốc theo cách bạn đối xử người đó, nhân quả và tính cách (Đạo đức, Xử thế).
- **Lộ dần**: manh mối nhỏ (đôi mắt, vết sẹo, giọng nói) trước khi lộ; người chơi tinh ý đoán ra (và nhận khí vận nếu giải quyết ôn hòa, mục 5).
- **Hai chiều**: nếu bạn **là người bị hại** thì kẻ lấy xuất hiện sau (hoặc bạn gặp con cháu kẻ lấy); nếu bạn **là kẻ lấy** thì người bị hại hoặc đồ đệ trở lại tính sổ.
- **Giới hạn tối tăm**: nội dung kể **gián tiếp, không tả cảnh máu me**; chế độ tự động có mặc định né nhánh tàn nhẫn nhất theo Đạo đức của nhân vật.

### 11.2 Vòng quay của T13 và T14 (chặng 3: số mệnh quyết định, không chọn)
**Nguyên tắc (bạn chốt 2026-10-18):** có dùng Trùng đồng hay xương (móc, đào, cấy, giữ, mất) **do số mệnh (vòng quay) quyết**, người chơi không chọn. Điều mình có thể làm là **quay lại bằng điểm khí vận** (2 đến 5 điểm, tối đa 1 lần) và **tạo điều kiện trước đó** (nhận hay không nhận tuyến, đi đâu, quen ai; vì yếu tố cộng điểm lấy từ tính cách và quan hệ). Mỗi vòng quay có **đúng một yếu tố cộng điểm** và **2 đến 4 vùng**, vùng thấp là ít phù hợp (hoặc nhiều rủi ro), vùng cao là phù hợp nhất với vai.

**T13 Móc mắt, ba vai:**
| Vai | Vùng (từ thấp đến cao) | Rộng | Yếu tố cộng điểm | Giá quay lại |
|---|---|---|---|---|
| **(a) Bạn mang Trùng đồng, bị săn** | 1 **Bị móc** (mất đôi mắt, sống tiếp, nghiệt duyên) / 2 **Trốn thoát nhưng bị lộ** (kẻ săn theo đuổi) / 3 **Được che chở** (một ân nhân/ thế lực nhận bảo vệ, nợ ơn) / 4 **Phản kích thành công** (kẻ săn gục hoặc sợ, tiếng vang) | 20 / 30 / 30 / 20 | **Thiện cảm với người đứng ra giúp** (hoặc Tính tình nếu không có ai) | 4 |
| **(b) Bạn có cơ hội lấy mắt của người khác** | 1 **Thất bại, bị phát hiện** (thù, bị truy) / 2 **Không xảy ra** (cơ hội trượt, lương tâm hay hoàn cảnh ngăn) / 3 **Lấy được nhưng không dùng** (giữ đôi mắt, lập nghiệt duyên) / 4 **Lấy và cấy thành công** (dùng Trùng đồng, nghiệp nặng, phản phệ nhẹ) | 20 / 30 / 25 / 25 | **Đạo đức (đảo)**: Đạo đức thấp cộng điểm cho vùng 3 và 4, Đạo đức cao cộng cho vùng 2 | 3 |
| **(c) Bạn nhận một đôi mắt đã bị lấy** | 1 **Cấy thất bại** (mù hoặc nửa mù) / 2 **Cấy được nhưng cố cưỡng đoạt, phản phệ nặng** / 3 **Cấy thành công, phản phệ nhẹ** / 4 **Hòa hợp hoàn toàn** (tiên thiên đổi sang Trùng đồng thật) | 20 / 30 / 30 / 20 | **Tiên thiên loại Đồng hoặc ngộ tính/tâm tính** (kiểm tương thích) | 5 |
- Sau vòng quay: **Hệ quả** (chặng 4) và **Nghiệt duyên hội ngộ** (chặng 5) theo vùng rơi vào.
- **Quan trọng:** vòng quay quyết định **việc xảy ra**, còn **cách đối xử với người trong cuộc** (tha, nuôi, giấu) vẫn do các chặng thường (chọn được) ở chặng 2, 4, 5.

**T14 Đào cốt, ba vai:**
| Vai | Vùng | Rộng | Yếu tố cộng điểm | Giá quay lại |
|---|---|---|---|---|
| **(a) Bạn mang Đạo cốt, bị săn** | 1 **Bị đào** (mất cốt, tu vi tụt) / 2 **Trọng thương, giữ được cốt** / 3 **Được bảo vệ** / 4 **Cốt thức tỉnh, phản đòn** | 20 / 30 / 30 / 20 | **Cảnh giới và đạo tâm** (so với kẻ săn) | 5 |
| **(b) Bạn có cơ hội đào cốt người khác** | 1 **Thất bại, bị truy** / 2 **Không xảy ra** / 3 **Đào được nhưng cốt không hợp (không cấy)** / 4 **Đào và cấy thành công** (đổi tiên thiên Cốt, nghiệp nặng) | 20 / 30 / 25 / 25 | **Đạo đức (đảo)** như T13 | 4 |
| **(c) Bạn được đưa một đạo cốt để cấy** | 1 **Cốt phản chủ** (ma hóa, nguy cơ chết) / 2 **Cấy được nhưng phản phệ lâu dài** / 3 **Cấy thành công** / 4 **Hòa hợp, đạo cốt thăng phẩm** | 20 / 30 / 30 / 20 | **Tư chất so với cốt** (ngũ hành khớp) | 5 |
- Khí vận: hoàn thành T13 hoặc T14 với kết cục **chuộc tội hoặc tha thứ** (không báo thù bằng máu) +2 điểm khí vận (5); kết cục báo thù thành công không cộng; kết cục phạm thêm nghiệp trừ 1 điểm.


## 12. Tuyến thế giới chi tiết (8 tuyến)

**Khác với tuyến thân phận:** tuyến thế giới **tiến theo thế giới**, **kể cả khi người chơi không làm gì**; người chơi chỉ **nhúng tay** vào các "móc". Mỗi tuyến có **pha** (đồng hồ thế giới) và ở mỗi pha có 2 đến 4 **móc** (việc làm được). Bỏ lỡ thì pha vẫn qua, hậu quả ghi vào thế giới và nhật ký ("Bạn đã lỡ cơ hội cứu làng X").

| Tuyến | Mở khi (thật từ hệ thống) | Pha | Móc cho người chơi | Ghi vào thế giới |
|---|---|---|---|---|
| **W1 Chiến sự lan tới** | có cuộc chiến mà vùng bạn ở chiến tuyến hoặc kề | tin báo → lửa tới → đỉnh điểm (trưng thu, phá làng) → hòa nghị hoặc thất thủ | nhập ngũ, buôn quân nhu, cứu dân, đưa tin, lợi dụng giá | điểm số trận, dân tâm, giá vũ khí/đan, chư hầu/đồng minh |
| **W2 Đại hạn** | `han` ở vùng | mất mùa → giá thảo/dân đói → cứu trợ hay đầu cơ → mưa về hay dân biến | tích trữ, cứu trợ, chuyển hàng tới, tố cáo tích trữ | giá thảo, dân tâm, hội xả/tích trữ, nổi loạn |
| **W3 Dịch bệnh** | `dich` ở vùng | ca đầu → phong tỏa → cần đan thuốc → hết dịch hoặc lan | chữa bệnh, tìm phương, vượt phong tỏa, buôn đan | giá đan, dân số, phong tỏa ải, danh vọng |
| **W4 Đường buôn bị phong tỏa** | cú sốc `duong_chan` | hàng không tới → buôn lậu/hộ tống → hội đàm phán → mở lại hoặc đổi tuyến | hộ tống, buôn lậu, đàm phán, tố cáo | giá, thiện cảm hội, thuế ải, tin báo |
| **W5 Hiệp ước bị phá** | một hiệp ước `defy` tới `break` | bất tuân → đòi thuế → phái quân → chư hầu hoặc đoạn tuyệt | sứ giả, tông trung lập, tố cáo, làm chứng | hiệp ước, rạn nứt, nguy cơ chiến tranh |
| **W6 Tông diệt, di tích mở** | một tông diệt vong | tin → người sống sót chạy → tranh di vật → di tích mở | cứu người, giữ di vật, tranh đoạt | tàn tích mới, người mồ côi sinh ra tuyến T10/T9 |
| **W7 Bí cảnh mở** (thay `dgevents`) | bí cảnh tới kỳ | dấu hiệu → đổ về → vào (cụm chặng trong) → hậu quả (thương vong, vật phẩm ra chợ) | đi ngay, đợi, bán thông tin, bảo vệ | giá vật phẩm, thương vong NPC, tin báo |
| **W8 Đổi thời đại** | `nextEra` điềm báo | điềm báo → các phe tranh vị → chuyển → luật mới | chọn phe, tiên tri, chuẩn bị, đầu cơ | thời đại mới (hệ số giá, chiến tranh), mốc xương sống |
- **Mở rộng sau** (không làm đợt đầu): W9 Dân biến, W10 Hội đầu cơ, W11 Quái họa, W12 Linh mạch cạn.
- **Thời lượng**: mỗi tuyến thế giới sống 6 đến 36 tháng thế giới; tối đa 2 tuyến thế giới cùng chạy ở một vùng.
- **Báo**: mỗi pha sinh một tin; số báo bốn năm kể thành chuyện (đã có kho tin).


## 13. Các tuyến lồng nhau như thế nào

### 13.1 Ba lớp, một sợi dây
```
Xương sống (6 mốc)      ── cổng mở/đóng, kết cục tổng
   │ kiểu đời + xuất thân quyết định ai có tuyến nào
Tuyến thân phận (T1-T12) ── "tôi là ai trong chuyện này"
   │ đón các "móc"
Tuyến thế giới (W1-W8)   ── "chuyện đang xảy ra quanh tôi"
```
- **Xương sống** ở các mốc 2, 3, 4, 5 phát **tín hiệu cổng**; tuyến thân phận chưa đủ chặng thì chặn mốc kế (ví dụ chưa qua T2 chặng 3 thì mốc A4 chưa tới).
- **Tuyến thế giới** phát **biến cố** kèm thẻ (`chien`, `han`, `dich`, `hang`, `hiepuoc`, `ditich`, `bicanh`, `thoidai`). Tuyến thân phận khai báo **cửa** nhận thẻ nào.

### 13.2 Cơ chế lồng nhau (kỹ thuật, cụ thể)
1. **Móc và cửa**: `arc.hooks = { dich: stageId, chien: stageId }`. Khi một biến cố mang thẻ `dich` bắn ra, tuyến thân phận đang chạy (T3 Đan sư, T11 Người cứu đời, T8 gia đình...) có cửa `dich` sẽ **chuyển sang một chặng biến thể** thay vì chặng thường (ví dụ T3 chặng 3 thành "Đan thuốc cho cả làng"), mang theo bối cảnh thật (vùng, giá thảo, số ca).
2. **Chặng ghép** (weave): nếu hai tuyến cùng đòi người chơi trong một tháng (ví dụ T2 chặng 4 Đại bỉ và W1 chiến sự), engine tạo **một hộp chặng ghép** có lựa chọn chung (ở lại đại bỉ hay xuống chiến tuyến), mỗi lựa chọn cộng cả hai tuyến. Chỉ ghép khi hai bên cùng có cửa; không thì xếp hàng.
3. **Hàng đợi và chỉ một chặng nóng**: tối đa 1 hộp tuyến chờ quyết; các chặng khác xếp hàng (tối đa 3) **kèm hạn**; hết hạn thì tự tiến theo mặc định và ghi "đã lỡ".
4. **Loại trừ và đồng hành**: có bảng `excl` (không đồng thời T2 Đệ tử tông trọn vẹn và T7 Kẻ truy nã của chính tông đó; T1 Tán tu tắt khi vào tông, mở lại khi rời) và `with` (T8 + T9 cho chặng "báo thù vì người thương"; T10 + W6).
5. **Dàn nhân vật dùng chung** (xem 13.3): một NPC thật có thể giữ vai ở nhiều tuyến.
6. **Cờ và nhân quả chung** (`karma`: ân, oán, danh, nghiệp, đạo): chặng của tuyến nào cũng cộng vào đồng hồ chung; **kết cục** của mọi tuyến đọc đồng hồ này, nên một quyết định ở T1 có thể quyết định kết cục T9 mười năm sau.
7. **Tuyến sinh tuyến** (mầm): kết cục hoặc lựa chọn của tuyến này **mở tuyến khác** (T7 kết "rửa tội thất bại" mở T9; W6 mở T10; T2 kết "phản tông" mở T7; T11 kết "bị quyền lực ghét" mở T7 hoặc T1).
8. **Điểm hội tụ**: các mốc xương sống **5 (Đạo quả) và 6 (Thiên môn)** gom mọi ân oán: người chơi gặp lại **mọi nhân vật định mệnh, mọi nợ chưa trả** trong một chuỗi cuối, kết cục xương sống thay đổi theo đó (không ai ghét, ai hận, bao nhiêu ơn).

### 13.3 Dàn nhân vật định mệnh (dùng chung giữa các tuyến)
- Mỗi đời có **8 vai**: Sư/Người dẫn đường, Bạn đồng hành, Đối thủ, Người thương, Kẻ thù, Ân nhân, Kẻ phản bội, Thân tộc. Vai được **gán khi cần** (lần đầu tuyến nào gọi), chọn từ NPC thật gần đó hoặc dựng NPC mới; **cùng một NPC giữ nhiều vai** theo thời gian (Bạn đồng hành ở T1, thành Kẻ phản bội ở T6, rồi Kẻ thù ở T9).
- NPC vẫn **tự sống**: có thể chết, vào tông, lên báo; vai đổi theo hành động của bạn (ơn đền oán, oán thành tình).
- Giới hạn: tối đa 8 vai cùng lúc, mỗi vai tối đa 1 NPC; vai trống khi NPC mất thì tuyến liên quan tự chuyển (sự kiện "người ấy đã không còn").

### 13.4 Ví dụ một đời lồng ba lớp
*Nông hộ (p1) + Phàm nhân hướng đạo (A):* tuổi 12 thầy đồ giới thiệu vào tông (A1) → **T2 Đệ tử tông** mở; năm 20 vùng gặp **W2 Đại hạn** → T2 chặng 2 biến thể "tông mở kho hay giữ?"; bạn xin tông phát lương cứu làng → **T11 Người cứu đời** mở; chặng ghép "tông vs dân" (T2 chặng 3 gặp T11 chặng 3); bạn chọn dân, tông trừng phạt → T2 kết "rời tông mang hận" mở **T7 Kẻ truy nã**; sau đó **W1 Chiến sự** làm triều cần người, bạn có cơ hội rửa tội (T7 chặng 4) bằng nhập ngũ; tới mốc A5 các ân (làng được cứu) và oán (tông) hội tụ: kết cục xương sống thay đổi (người dân dựng miếu thờ, hoặc tông truy cho tới cuối).

### 13.5 Bảng giao nhau (thế giới → thân phận nào được "gõ cửa")
| Tuyến thế giới | T1 | T2 | T3 | T4 | T5 | T6 | T7 | T8 | T9 | T10 | T11 | T12 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| W1 Chiến sự | ● | ● | | ● | ● | ● | ● | ● | ● | | ● | |
| W2 Đại hạn | ● | ● | ● | | ● | ● | | ● | | | ● | |
| W3 Dịch | | ● | ● | | ● | | | ● | | | ● | |
| W4 Đường buôn | ● | | | ● | ● | ● | ● | | | | | |
| W5 Hiệp ước | ● | ● | | | ● | ● | ● | | ● | | | |
| W6 Tông diệt | ● | ● | | ● | | | ● | | ● | ● | ● | |
| W7 Bí cảnh | ● | ● | ● | ● | ● | | ● | | | ● | | ● |
| W8 Thời đại | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● |
(● = tuyến thân phận có chặng biến thể khi tuyến thế giới nổ ra; nội dung từng ô sẽ viết ở Q5 và Q6, đợt đầu chỉ làm các ô in đậm ở T1, T2, T3, T5.)

### 13.6 Khối lượng nội dung
- 14 tuyến x 5 chặng = 70 chặng gốc; mỗi tuyến thêm trung bình 4 chặng biến thể (từ bảng giao nhau) = khoảng 48; 8 tuyến thế giới x (4 pha + 3 móc) = 56; xương sống 5 x 6 mốc = 30; tuổi thơ 17 x 2 = 34. Tổng **khoảng 230 chặng**; mỗi chặng 80 đến 150 chữ + 2 đến 4 lựa chọn. Làm theo từng đợt (Q3 đến Q6), đợt đầu khoảng 70 chặng để chơi thử.


## 14. Xử lý các sự kiện lẻ cũ (phân loại, liên kết thành chuỗi, ý tưởng, việc thường ngày)

### 14.1 Phân loại lại 85 sự kiện cũ
Quy ước nhãn: **[M]** mở chuỗi (thành chặng 1 của một tuyến hoặc một cụm), **[C]** cảnh ngộ/dấu hiệu (kỳ ngộ khám phá nhẹ, gieo manh mối), **[N]** việc thường ngày (giảm tần suất, có thể tự chọn), **[F]** kỳ ngộ vận mệnh (thưởng hiếm, thêm giá), **[K]** kịch bản cụm (bí cảnh, vượt vùng; giữ làm nội dung bên trong tuyến).

| Nhóm | Số lượng | Sự kiện (id: tên) |
|---|---|---|
| **[M] Mở chuỗi** | 36 | `nhan_la` Chiếc nhẫn kỳ lạ; `lao_gia_gia` Lão gia gia lên lớp (chặng 2 của nhẫn); `tu_hon` Từ hôn; `thieu_chu` Thiếu chủ ngạo mạn; `cao_nhan` Cao nhân chỉ điểm; `opp_cao_nhan` Cao nhân giảng đạo; `thay_tuong` Thầy tướng xem số; `nguoi_xin` Người ăn xin; `hai_cot` Hài cốt tu sĩ; `co_dong_phu` Cổ động phủ; `dao_quan` Đạo quán hoang; `lo_ren` Lò rèn bỏ hoang; `linh_thu` Linh thú bị thương; `tho_san` Thợ săn rủ đi cùng; `ho_tong` Thương đoàn thuê hộ tống; `thuong_nhan_dan` Thương nhân bán đan; `hac_thi_hang` Hàng lạ ở chợ đen; `ke_trom` Kẻ móc túi; `trung_binh` Quan phủ trưng binh; `bi_canh_mo`, `opp_bi_canh`, `dg_loi_vao` Bí cảnh/hiểm địa; `opp_dau_gia` Phiên đấu giá; `luan_dao`, `opp_luan_dao` Luận đạo; `tong_mon_gap` Cổng tông môn, `opp_tuyen` Mùa tuyển đệ tử, `sect_nhiem_vu`, `sect_dai_bi`, `sect_chuong_mon_viec`, `sect_succession`, `fac_trieu_tap` (cụm Đệ tử tông); `rel_ket_nghia`, `rel_xung_dot`, `rel_nho_giup`, `rel_gap_nguoi`, `rel_ke_thu`, `rel_tha_giet`, `rel_to_tinh`, `rel_ghen`, `rel_doi_no`, `rel_nhan_do`, `fam_gia_dinh`, `fam_day_con` (cụm Quan hệ và Gia đình); `fac_chien_loan` Chiến loạn lan tới |
| **[C] Cảnh ngộ, dấu hiệu** | 8 | `linh_tuyen` Linh tuyền ẩn mình; `kiem_y` Kiếm ý trong gió núi; `duoc_thao` Dược thảo quý; `tuyet_lac` Lạc giữa bão tuyết; `ao_anh` Ốc đảo ảo ảnh; `den_ma` Đèn ma trong đầm; `set_danh` Sét đánh gần; `sao_bang` Sao băng |
| **[N] Việc thường ngày** | 8 | `thue_kho` Việc làm thuê; `le_hoi` Lễ hội làng; `cho_phien` Chợ phiên náo nhiệt; `benh_tat` Bệnh tật; `tam_ma` Tâm ma quấy nhiễu (một phần thành cụm Đạo tâm); `tinh_ngo` Thông suốt; `yeu_thu` Yêu thú tấn công (trùng ở hai file, gộp); `ngu_linh` Đoàn thuyền cá linh |
| **[F] Kỳ ngộ vận mệnh** | 7 | `tu_chat`, `di`, `xoa`, `tot`, `kv`, `lo`, `phap_bao` (trong `ev.kyNgo`) |
| **[K] Kịch bản cụm** | 17 | `dg_trap`, `dg_fight`, `dg_boss`, `dg_treasure`, `dg_rest`, `tri_phase` (bên trong bí cảnh); `cx_bao`, `cx_yeu_thu`, `cx_dao_tac`, `cx_di_tich`, `cx_thuong_doan`, `cx_lu_khach`, `cx_tam_ma`, `cx_linh_khi`, `cx_canh_dep`, `cx_loi_van` (dọc đường vượt vùng) |
- Quy tắc xử lý: **[M]** viết lại thành chặng 1 (giữ chữ hay, thêm "hạt giống"); **[C]** giữ nhưng thêm khả năng gieo **manh mối** (một dấu trên bản đồ, một dòng tin đồn); **[N]** giữ, giảm tần suất, thêm tự chọn (14.4); **[F]** thêm giá/mầm hậu quả, hiếm, hoặc phát ở cuối chuỗi; **[K]** giữ làm bể sự kiện của bí cảnh và vượt vùng, **tuyến W7 và W4 gọi chúng** thay vì bốc ngẫu nhiên đơn.

### 14.2 Liên kết các sự kiện thành chuỗi (mười cụm)
```
CỤM 1  VẬT LẠ VÀ TÀN HỒN (nhẫn)
  nhan_la ─> lao_gia_gia ─> [đòi giá] ─> [kẻ thù của lão tìm tới] ─> [chia tay | hợp nhất | bị đoạt xác]
     ▲            └─ nhận ra qua: hac_thi_hang (đồ lạ), hai_cot (di thư), lo_ren (khí chưa xong)
     └─ nếu xuất thân t9/t10 hoặc xương sống C: nhẫn là của cha mẹ / của chính kiếp trước

CỤM 2  HÔN ƯỚC VÀ ĐỐI THỦ (Từ hôn + Thiếu chủ cùng một nhân vật)
  tu_hon ─> [lời thề 3/10/30 năm] ─> thieu_chu ─> luan_dao/sect_dai_bi (đấu lại) ─> [hắn gặp họa] ─> [hòa | thù | tình]
     └─ nhánh ngược: người từ hôn có lý do (bị ép/ âm mưu thông gia) ─> mở T8 hoặc T9

CỤM 3  CAO NHÂN GIẤU MẶT (một người, nhiều hình dạng)
  nguoi_xin / thay_tuong / cao_nhan / opp_cao_nhan ─> [bạn đối xử ra sao được ghi "ân"] ─> [lộ diện]
     lộ diện là: sư phụ (A1) | cha/mẹ đại năng (t9) | người kiếp trước (C) | sứ giả thiên đạo (E) | kẻ lừa
     thay_tuong còn là NGUỒN DẤU HIỆU XƯƠNG SỐNG: nói câu mơ hồ gợi B/C/D/E trước khi thức tỉnh

CỤM 4  ĐƯỜNG BUÔN VÀ CHỢ
  thuong_nhan_dan / ho_tong / hac_thi_hang / ke_trom / cho_phien ─> T5 / T1 ─> W4 (đường bị phong tỏa)
  opp_dau_gia ─> nhà đấu giá thật (E) ─> T10 (món đấu là di vật)
  ke_trom ─> [bạn đồng hành hoặc kẻ lừa] ─> vai trong dàn nhân vật

CỤM 5  THÚ VÀ THỢ SĂN
  tho_san / linh_thu / yeu_thu ─> [bạn đồng hành thú] ─> (M8 sau: yêu thú đồng hành)
     └─ cx_yeu_thu, dg_fight ở cụm [K] cùng nguồn gốc

CỤM 6  DẤU VẾT NGƯỜI XƯA
  hai_cot / co_dong_phu / dao_quan / lo_ren / linh_tuyen ─> [manh mối trên bản đồ] ─> T10 / W6 / W7
     hai_cot mang di thư gọi tên một tông hoặc gia tộc cũ ─> nối tới tông đã diệt (W6) và nhẫn (cụm 1)

CỤM 7  DÂN SINH VÀ CHIẾN TRANH
  trung_binh / thue_kho / le_hoi / benh_tat / nguoi_xin ─> W1 / W2 / W3 ─> T11
  fac_chien_loan / fac_trieu_tap ─> W1 ─> T2 / T7

CỤM 8  QUAN HỆ VÀ GIA ĐÌNH
  rel_gap_nguoi ─> rel_ket_nghia ─> rel_nho_giup ─> rel_doi_no ─> [ơn thành tình | oán thành thù]
  rel_xung_dot ─> rel_ke_thu ─> rel_tha_giet ─> T9
  rel_to_tinh ─> rel_ghen ─> fam_gia_dinh ─> fam_day_con ─> T8
  rel_nhan_do ─> A5 (thu đồ, lập nghiệp)

CỤM 9  TÔNG MÔN
  tong_mon_gap / opp_tuyen ─> sect_nhiem_vu ─> sect_dai_bi ─> sect_chuong_mon_viec ─> sect_succession ─> T2

CỤM 10 ĐẠO TÂM
  tam_ma / tinh_ngo / kiem_y / sao_bang / set_danh ─> [dấu hiệu đạo tâm] ─> mốc A3 / C5 (tâm ma "bóng của chính mình")
     tam_ma lặp lại sẽ thành chuỗi: lần 1 nhẹ, lần 2 có hình bóng, lần 3 là một cuộc đối thoại với chính mình
```
- **Sợi liên kết**: mỗi cụm chia sẻ **cờ cụm** (ví dụ `cum.nhan = {stage, ally?}`) và nhiều sự kiện **cùng trỏ vào một nhân vật định mệnh** (Cụm 2: thiếu chủ chính là người nhà từ hôn; Cụm 3: ăn xin, thầy tướng, cao nhân là một người; Cụm 8: người gặp có duyên chính là người bạn kết nghĩa sau này). Nhờ vậy người chơi thấy **một câu chuyện lặp lại**, không phải nhiều hộp rời.

### 14.3 Ý tưởng cho từng sự kiện mở chuỗi
**Chiếc nhẫn kỳ lạ** (6 "phiên bản thật" bốc lúc đeo, theo xuất thân và xương sống; người chơi không biết là bản nào):
1. **Tàn hồn đại năng thật**: dạy thật nhưng đòi giá (muốn một món, muốn báo thù, muốn mượn thân xác một lúc).
2. **Tàn hồn đoạt xác**: dạy để bạn mạnh rồi chiếm; có dấu hiệu (giấc mơ, mất ký ức); cứu được nếu phát hiện sớm.
3. **Khí linh yếu cần nuôi**: lớn cùng bạn, thành bạn đồng hành, nối M8.
4. **Gã lừa**: nhẫn là đồ giả, nhưng gã lừa **là người thiếu thốn** và sau thành người quen (cụm 4).
5. **Di vật của cha/mẹ**: lão gia gia **là mảnh hồn cha/mẹ** (xuất thân t9, t10); cảm động hoặc nghiệt ngã.
6. **Bẫy của kẻ thù**: nhẫn là mắt theo dõi; kẻ thù thấy mọi việc của bạn; phát hiện thì đảo ngược (giả vờ cho xem).
- **Tính cách lão gia gia** (bốc một): khoác lác, nghiêm khắc, keo kiệt, hay quên, nói dối giỏi. Mỗi lần "lên lớp" (chặng 2) là một mẩu hài + một mẩu bài học thật; có thể **nghe, ngủ gật, cãi lại, hỏi bí mật**.
- **Độ tin** (0 đến 100): nghe lời thì tăng, cãi thì giảm; quyết định lão giúp hay phản ở chặng cuối. Chặng cuối: chia tay (lão siêu thoát, để lại một món), hợp nhất (nhận ký ức, mang nhân quả của lão), bị đoạt (tai họa), hoặc lão chết vì cứu bạn.

**Từ hôn**: (1) người từ hôn **thật sự muốn thoát** (bị cha ép, hoặc người đó yêu người khác); (2) hôn ước là **âm mưu thông gia** để chiếm tài nguyên; (3) lời "ba mươi năm Hà Đông" ghi vào **sổ lời thề** và tới hạn thì nhà đó **tới đòi/gặp lại**; (4) khi bạn mạnh lên, họ hối hận cầu hòa, bạn tha hay trả thù; (5) hôn ước là **hôn ước thật** do cha mẹ bạn ký (xuất thân t7, t9), bạn biết quá trễ. Thiếu chủ nhà đó sau này xuất hiện ở cụm 2.

**Thiếu chủ ngạo mạn**: biến thành **đối thủ "gương soi"** đi cùng bạn qua các cảnh giới, bạn mạnh lên thì hắn cũng mạnh; hắn có **điểm yếu thật** (cha ép, sợ hãi, thích người bạn quen); cách bạn đối xử lần đầu quyết định hắn thành **bạn thân, đồng minh gượng gạo, kẻ thù không đội trời chung, hoặc kẻ phản bội**. Có chặng đảo vai: một ngày hắn sa cơ đến nhờ bạn, hoặc bạn là kẻ ngạo mạn trong mắt người khác.

**Cao nhân chỉ điểm / Người ăn xin / Thầy tướng** (cụm 3): một **người ẩn mình** hiện ra nhiều lần dưới các hình dạng, mỗi lần bạn đối xử ra sao được ghi vào **ân nhân**; lộ diện bằng một chặng đặc biệt (nhận ra sau khi chia tay, hoặc ông ta chết). Thầy tướng hé **câu sấm mơ hồ** (người chơi tinh ý sẽ đoán ra kiểu đời).

**Hài cốt tu sĩ**: có **di thư** gọi tên một người hoặc tông; mang tới đúng nơi thì nhận một ân, bỏ đi thì ma xó theo bạn; có thể là **chủ cũ chiếc nhẫn** (cụm 1) hoặc **người của một tông bị diệt** (W6).

**Lò rèn bỏ hoang**: trong lò có **mẩu kiếm dang dở** (T4); hoặc chủ lò là **thợ rèn đã bị truy nã** (T7), nay hồn ma nhờ hoàn thành.

**Cổ động phủ / Đạo quán hoang**: **kỳ ngộ khám phá có manh mối** (tin đồn trước, chấm trên bản đồ), bên trong 3 thử thách khác nhau theo đạo bạn đang theo; đạo quán hoang có **hương hỏa của một vị thần địa phương**, giúp dân thì thần giúp bạn.

**Linh thú bị thương**: cứu rồi nó **theo bạn hoặc trả ơn bằng một lần**; thú có tính cách; ở chuỗi sau nó là **hậu duệ huyết thú** (xương sống D) hoặc **canh giữ di tích** (T10).

**Thợ săn rủ đi cùng**: kèo săn đầu tiên, người thợ săn trở thành **bạn đồng hành** hoặc **kẻ bỏ rơi bạn giữa núi**; dẫn tới yêu thú lớn (cụm 5).

**Thương nhân bán đan / Hàng lạ ở chợ đen / Kẻ móc túi**: ba người này **có thể là cùng một băng** (bạn bắt được một đầu mối, rồi dò ra băng); hoặc **gã móc túi là cô nhi cùng tuổi**, nếu giúp thì có bạn đồng hành giỏi mánh khóe.

**Quan phủ trưng binh**: đi nhập ngũ, **trốn**, **đút lót**, **thay người** (bạn thân bị bắt thay bạn, ân nặng); mở W1 và T7.

**Phiên đấu giá**: món đấu là **di vật** có lai lịch; người đấu cùng bạn là đối thủ định mệnh; trúng hay hụt cũng mở một nhánh.

**Luận đạo giữa đường**: người đối luận trở thành **bạn tri kỷ** hoặc **đối thủ đạo tâm**; thắng thua ảnh hưởng đạo tâm và ngộ.

**Tâm ma quấy nhiễu**: lần đầu mờ, lần hai hiện **bóng** (một người bạn từng bỏ rơi / chính mình), lần ba đối thoại; thua thì mất đạo tâm, thắng thì được **ngộ** lớn (nối A3, C5).

### 14.4 Việc thường ngày: giảm tần suất và cho tự chọn
- **Tần suất động**: trọng số của nhóm **[N] và [C]** nhân theo số chuỗi đang mở: 0 đến 1 chuỗi x1; 2 chuỗi x0,6; 3 chuỗi x0,4; 4 chuỗi trở lên x0,25. Nhóm **[M]** thì hạ trần: một chuỗi "mới" chỉ mở khi số chuỗi nóng chưa quá 3.
- **Ngân sách hỏi**: mỗi năm tối đa **K hộp thường ngày** hỏi người chơi, K = 4 trừ số chuỗi đang mở (thấp nhất 0). Vượt thì **tự chọn** (theo quy tắc nếu-thì của bạn rồi tới tính cách) và **gộp vào bản tổng kết năm**: "Năm nay bạn gặp 5 việc nhỏ: cho ăn xin 1 đồng, ...".
- **Bật tắt trong Cài đặt**: *Việc thường ngày*: **Hỏi hết** / **Cân bằng (ngân sách, mặc định)** / **Tự chọn hết** (chỉ hỏi chuỗi và kỳ ngộ lớn).
- **Quy tắc riêng từng việc**: tab Quy tắc cho đặt sẵn câu trả lời (ví dụ "người ăn xin: luôn cho 1 đồng", "kẻ móc túi: luôn truy"), áp cho cả chế độ Cân bằng.
- **Thường ngày gieo hạt**: mỗi việc có thể **gieo một hạt** mở chuỗi (cho ăn xin thì tăng xác suất cụm 3; cứu linh thú thì cụm 5; giúp người bị trưng binh thì cụm 7), nên "tự chọn hết" không làm mất chuỗi, chỉ làm hạt theo mặc định tính cách.
- **Ưu tiên khi nhiều thứ cùng tới**: chuỗi nóng > kỳ ngộ khám phá > thường ngày; thường ngày bị hoãn tối đa 3 tháng rồi tự chọn nếu không có chỗ trống. Vẫn giữ nhịp **≤ 6 hộp/phút** của bài đo hiện có.


---

# PHẦN V. TRIỂN KHAI

## 15. Tác động qua lại với các hệ khác
| Hệ | Truyện đọc | Truyện ghi |
|---|---|---|
| Kinh tế (E) | giá lệch, cú sốc, thuế, hội, đấu giá, cướp đường | đẩy giá cục bộ (xả hàng, tích trữ), thiện cảm hội, tài sản |
| Dân số, hiệp ước (F4, F2) | dân tâm, thiên tai, bất tuân, chư hầu | gây nổi loạn, hòa giải, đổi dân tâm một vùng |
| Tông môn (M) | chức, cống hiến, đại bỉ, tài nguyên tông | cống hiến, luật tông, bị trục xuất, ơn nghĩa |
| Nhật báo (G) | tin báo làm manh mối, dự báo | **bài báo về hành động của bạn** (danh vọng, truy nã) |
| Nhiệm vụ (A), ngã rẽ (C) | đạo đang theo, nhiệm vụ đang làm | chặng sinh nhiệm vụ; hoàn thành tuyến là mốc cho ngã rẽ |
| Quan hệ, gia đình | người thân, đạo lữ, con, thù | tạo, đổi, giết người thân (có kiểm soát) |
| Bản đồ (N, O) | khu tài nguyên, bí cảnh, tàn tích | chấm manh mối, mở/đóng địa điểm |

### 15.1 Các hệ mới của Q đọc và ghi gì
| Hệ mới | Đọc | Ghi |
|---|---|---|
| **Tiên thiên** (4) | xuất thân, xương sống (bắt buộc), thẻ tương hợp | điều kiện tuyến, yếu tố vòng quay, tương hợp đạo lữ (R), truyền thừa cho con (R), mất/cấy (T13, T14) |
| **Khí vận** (5) | nguồn cộng: kỳ ngộ vận mệnh, hoàn thành tuyến, chuyện lớn, vòng quay | quay lại vòng quay (7), đẩy duyên qua giấc mơ (R 7.2) |
| **Tính cách** (6) | lựa chọn, quyết định mặc định, vòng quay (yếu tố), quan hệ | điều kiện mở tuyến, tương hợp đạo lữ (R), tính cách con (R), thái độ NPC |
| **Vòng quay** (7) | tiên thiên, tính cách, hảo cảm, năng lực | kết cục chặng định mệnh, cộng/trừ khí vận (nguồn: vùng cao nhất) |
| **Nhân duyên** (R) | dàn nhân vật định mệnh, tính cách, tiên thiên | vai NPC cho tuyến (Q 13.3), quan hệ thật (đạo lữ, con, thù, ân) |

## 16. Giao diện (tổng hợp)
- **Tab Nhiệm vụ** có thêm phần **"Truyện của đời bạn"**: tuyến đang đi (chặng, manh mối, hạn, người liên quan), tuyến đã qua (kết cục), dòng thời gian đọc lại như truyện ngắn. *(Mặc định: gộp vào Nhiệm vụ, không thêm tab; xem câu mở 5.)*
- **Hồ sơ nhân vật** thêm các khối: **Kiểu đời và mốc xương sống** (đường 6 mốc, ẩn tới thức tỉnh), **Xuất thân** (cha mẹ, gia tộc, bổn phận, bí mật đã biết), **Tiên thiên** (6 ô, chip theo phẩm, mờ nếu ẩn), **Tính cách** (4 thanh −10 đến +10 như ảnh mẫu, lịch sử đổi), **Khí vận** (điểm hiện có, nguồn gần nhất), **Nhân quả** (ân, oán, danh, nghiệp, đạo).
- **Hộp chặng truyện**: tiêu đề tuyến nhỏ, chữ truyện, lựa chọn có **nhãn loại giá**, **khóa kèm lý do**, **chấm "hợp tính bạn / trái tính"**, mặc định khi hết giờ ghi rõ, nhãn "có vòng quay" nếu chọn dẫn tới vòng quay.
- **Hộp vòng quay vận mệnh** (mục 7.8): vòng chia vùng màu, yếu tố cộng điểm, số khí vận, nút Quay, nút Quay lại kèm giá; chế độ giảm hiệu ứng.
- **Hộp giấc mơ** (R 7.2): mô tả mơ hồ, lựa chọn Theo / Để mặc / Gạt đi, giá khí vận.
- **Nhật ký**: thẻ riêng cho truyện, sao tự động cho chặng quan trọng, dòng khi tính cách đổi dải, dòng vòng quay.
- **Bản đồ**: chấm manh mối, địa điểm cơ duyên, nơi sinh và nhà gia tộc.
- **Nhật báo**: mục "Có liên quan đến bạn" lấy từ truyện; tin truyện lớn vào kho tin.
- **Quy tắc** (nếu-thì): thêm điều kiện theo tính cách, khí vận; thêm tự quay lại vòng quay.

## 17. Cân bằng
- Phần thưởng truyện chia ba bậc: nhỏ (vài tháng tu vi/tiền), vừa (một vật phẩm, một quan hệ, một vị thế), lớn (tư chất, biến dị, pháp bảo) và **lớn luôn đi kèm giá** (nghiệp, thù, thương tật, nợ).
- Tổng lợi ích từ truyện nhắm khoảng 15 đến 25% tổng tiến độ cả đời; nếu vượt thì đo lại bằng `calib.js` và hạ.
- Tần suất: tối đa 1 tuyến "nóng" (đang chạy chặng cần quyết) cùng lúc; tổng nhịp hộp ≤ 6/phút.
- Kiểm thử tỉ lệ: cảnh giới (Trúc Cơ+ khoảng 2/5/18%) và số cuộc chiến (≈ 60/300 năm) không đổi quá ±10%.
- Cái chết: chặng có thể đưa đến chết nhưng cách chết phải được báo trước một lần ở hộp có chữ "nguy cơ tử vong".

### 17.1 Các điểm cân bằng bổ sung (từ nền mới)
- **Tiên thiên**: phẩm Quý và Thiên xuất hiện nhiều gấp 2,5 so với dự định ban đầu (mỗi lần bốc 20% ra Quý trở lên), nên **hạ hiệu chỉnh số** của các phẩm đó (Quý: tu luyện +25 đến +35% thay vì +50%; Thiên: lớn nhưng **luôn kèm giá/điều kiện**). NPC lõi chỉ nhận 1/3 mức xác suất phẩm cao của người chơi.
- **Khí vận**: cả đời 12 đến 20 điểm, khoảng 10 vòng quay, trung bình 2,5 mỗi lần quay lại → **quay lại được 5 đến 8 lần**; nếu `story-sim` cho thấy dư/thiếu thì chỉnh nguồn cộng.
- **Tính cách**: trần tác động ±10% ở đầu cực; một năm không đổi quá ±3 mỗi trục (biến cố lớn ±6).
- **Vòng quay**: điểm cộng tối đa +15, tối thiểu −10 (dịch tối đa 15 điểm phần trăm xác suất); vùng chết ≤ 15% và luôn báo trước; ≤ 1/20 vòng quay chết.
- **Nghiệt duyên, T13, T14**: kết cục báo thù không cộng khí vận; chuộc tội/tha thứ +2 (5.3).

## 18. Kỹ thuật
| Việc | File/Module | Ghi chú |
|---|---|---|
| Tiên thiên v2 | `data/traits.js` (mở rộng), `data/trait-rules.js`, `systems/trait.js` (`TT.trait`) | giữ id cũ, thêm loại/phẩm/thẻ; `c.traitIds` giữ |
| Khí vận v2 | `systems/kv.js` (`TT.kv`) | `c.kvPts`, `c.kvLog`; bỏ `baseKv` (đọc để chuyển cũ) |
| Tính cách | `data/nature.js`, `systems/nature.js` (`TT.nature`) | `c.nature`, `c.natureLog`; chuyển từ `personality` cũ |
| Vòng quay | `systems/wheel.js` (`TT.wheel`) | handler `wheel` trong `decisions.js` |
| Xuất thân | `data/origins.js`, `systems/origin.js` | thay `D.origins`; `c.origin` |
| Xương sống | `data/backbones.js`, `systems/backbone.js` | `c.bb`; 5 kiểu x 6 mốc |
| Khung tuyến | `data/stories/*.js` (mỗi tuyến một file), `data/story-index.js`, `systems/story.js` (`TT.story`) | `c.story`, `world.story` |
| Sự kiện lẻ cũ | phân loại thêm thẻ (`tag`) vào `data/*events.js`; `systems/daily.js` (ngân sách thường ngày) | không xóa dữ liệu cũ |
| Giao diện | `ui/story.js`, `ui/wheel.js`, `ui/nature.js`, `ui/trait.js`; chỉnh `ui/profile.js`, `ui/panels.js` | |
| Công cụ | `tools/story-sim.js` (mô phỏng hàng loạt), `tools/story-lint.js` (kiểm dữ liệu chặng), `so-do-tuyen.html` (vẽ đồ thị tuyến) | |
- **Lưu**: mọi trường mới **khởi tạo muộn**, **không đổi `TT.VERSION`**; bản lưu cũ chuyển một lần (tiên thiên, khí vận, tính cách, xuất thân suy từ dữ liệu cũ).
- **Hiệu năng**: chiều sâu chỉ cho người chơi và nhân vật định mệnh; NPC thường chạy bản gọn.
- **Kiểm thử** (`tests.html`): cú pháp mọi chặng (trỏ tới chặng/kết cục có thật), điều kiện, hạn tự tiến, hậu quả trễ, chặng ghép, lưu/tải giữa chặng, bốc tiên thiên (tỉ lệ phẩm và giảm một nửa), khí vận (không cộng theo thời gian), tính cách (quán tính, trần), vòng quay (vùng, một yếu tố, quay lại), xuất thân, kiểu đời, nhịp ≤ 6 hộp/phút, cân bằng (Trúc Cơ+ giữ 2/5/18% ±10%).

## 19. Các chặng làm (đề xuất, làm một mạch như E và G)
**Nguyên tắc:** làm từ **nền** lên **nội dung**, mỗi chặng chơi thử được; cuối mỗi chặng chạy `tests.html`, `story-sim`, cập nhật KE-HOACH.md, snapshot.
- [ ] **Q0** duyệt kế hoạch (mục 20), chốt các câu còn mở.
- [ ] **Q1 Nền nhân vật** (độc lập với truyện):
  - [ ] **Q1.1** tiên thiên v2 (mục 4): 6 ô, 4 phẩm, tỉ lệ Quý 15% Thiên 5% và giảm một nửa, thẻ tương hợp, ẩn/thức tỉnh/mất/cấy, chuyển 20 tiên thiên cũ, Hồ sơ.
  - [ ] **Q1.2** khí vận v2 (mục 5): `kvPts`, nguồn cộng chỉ từ chuyện lớn, bỏ chỉ số `kv` thay bằng Mệnh cách, chuyển bản lưu cũ, hiển thị.
  - [ ] **Q1.3** tính cách (mục 6): bốn trục −10 đến +10, đổi dần, khóa mềm, phí trái tính, mặc định theo tính cách, NPC chuyển nhãn cũ, thanh trong Hồ sơ, chỉnh ban đầu bằng ngân sách điểm.
- [ ] **Q2 Khung và vòng quay**: `TT.story` (tuyến, chặng, hạn, hậu quả trễ, nhân quả, hàng đợi), `TT.wheel` (vùng, một yếu tố, quay lại bằng khí vận), hộp chặng và hộp vòng quay, thẻ nhật ký.
- [ ] **Q3 Khởi đầu đời**: xuất thân (mục 8) 17 loại + tuổi thơ; xương sống A (6 mốc); bốn tuyến mẫu T1, T2, T3, T5; chơi thử.
- [ ] **Q4 Bốn xương sống còn lại** (B Xuyên không, C Trọng sinh, D Huyết mạch, E Thiên phạt): cơ chế riêng, 6 mốc mỗi kiểu, `story-sim` so tiến độ ±15% với A.
- [ ] **Q5 Kỳ ngộ làm lại** (+ **kho trope**, mục 21.5 tầng A): manh mối (tin đồn, báo, bản đồ), kỳ ngộ vận mệnh có giá, kỳ ngộ khám phá; sự kiện lẻ cũ phân loại, nối chuỗi, thường ngày có ngân sách và tự chọn.
- [ ] **Q6 Tuyến thế giới** W1 đến W8 nối kinh tế, dân số, hiệp ước, tông, báo; bí cảnh mới thay `dgevents`; chặng ghép và loại trừ.
- [ ] **Q7 Tuyến thân phận còn lại** T4, T6 đến T14 (kèm Nghiệt duyên T13, T14, vòng quay riêng); hoàn thiện bảng giao nhau.
- [ ] **Q9 (tùy chọn, sau khi chơi thử)** mở rộng nội dung (mục 21.5): AI viết lại chữ, AI sinh tuyến (khóa API của bạn, kiểm và kẹp số, rơi về kho trope khi lỗi).`r`n- [ ] **Q8 Hoàn thiện**: cân bằng toàn bộ, chơi thử trên máy tính và điện thoại, công cụ viết nội dung (mục 21), bài kiểm thử cuối.
- [ ] **Q10 Nội dung hệ Quốc gia, Tông môn, Tôn giáo (mục 24):** làm sau các chặng S3 đến S5 của [S-quoc-gia-tong-mon-ton-giao](S-quoc-gia-tong-mon-ton-giao.md); đợt đầu khoảng 70 chặng/sự kiện (T15, T17, T18; W13, W16, W18, W20; cụm 11, 12, 15; 12 sự kiện nghịch lý), sau đó T16 Thần Chức, T19 đến T21, các cụm còn lại.
- **Song song (kế hoạch R)**: R1 đến R3 sau Q1.3; R4 sau Q2.

---

# PHẦN VI. CHỐT VÀ MỞ

## 20. Đã chốt và câu hỏi còn mở

### 20.1 Đã chốt
Xem bảng 1.2. Thêm các chi tiết đã chốt sau khi bạn chỉnh: thang tính cách −10 đến +10; điểm khí vận không tích theo thời gian; quay lại tối đa 1 lần mỗi vòng, không ở vùng cao nhất; T13, T14 mở từ Trúc Cơ và do vòng quay quyết; tiên thiên Quý 15%, Thiên 5%, giảm một nửa mỗi lần ra; nhân duyên, đạo lữ, con cái chuyển sang kế hoạch R.

### 20.2 Câu hỏi còn mở (mỗi câu có mặc định, bạn chỉ cần sửa chỗ muốn khác)
**Giọng và nhịp truyện**
1. **Giọng truyện**: nghiêm túc tiên hiệp hay pha hài đời thường như các sự kiện cũ? *(mặc định: pha, nghiêm khi chuyện lớn)*
2. **Độ tàn khốc**: chặng được dẫn tới chết người chơi (có báo trước, có đường tránh)? *(mặc định: có, hiếm)*
3. **Đợt đầu** chỉ T1, T2, T3, T5 và W1 đến W3 rồi chơi thử, hay viết đủ trước? *(mặc định: đợt đầu rồi mở rộng)*
4. **Nội dung tối** (T13, T14, nghiệt duyên) kể gián tiếp; có thêm **bật/tắt "chế độ truyện nhẹ"** trong Cài đặt không? *(mặc định: có nút bật/tắt nhánh tàn nhẫn nhất)*

**Cấu trúc**
5. **Tab riêng "Cốt truyện"** hay gộp vào Nhiệm vụ? *(mặc định: gộp vào Nhiệm vụ)*
6. **Xương sống ẩn** tới mốc 1 hay hiện ngay từ đầu đời? *(mặc định: ẩn, chỉ gợi ý mơ hồ)* **NPC mang kiểu đời đặc biệt** (đại năng chuyển thế nổi tiếng) có không? *(mặc định: có, rất hiếm)*
7. **Chặng ghép và loại trừ** (13.2) làm không, hay mỗi tuyến chạy riêng? *(mặc định: làm)*
8. **Tuyến thế giới tiến cả khi bạn bỏ lỡ**? *(mặc định: có)*
9. **Đời sau kế thừa** nhân quả (thù, ơn, người định mệnh) và **15% tính cách** kiếp trước? *(mặc định: kế thừa phần nhẹ, ghi Sổ đời)*

**Xuất thân (mục 8)**
10. Mười bảy xuất thân và tỉ lệ có thêm/bớt/đổi không? *(mặc định: giữ)*
11. Cha mẹ là NPC thật có thể mất, bị giết, bị truy ngoài ý bạn? *(mặc định: có)*
12. Bổn phận gia đình: chọn được (bỏ thì mất ơn, có hậu quả)? *(mặc định: có)*
13. Tuổi thơ chơi được (2 đến 3 chặng ngắn) hay chỉ kể tóm tắt? *(mặc định: chơi được, ngắn)*

**Sự kiện cũ (mục 14)**
14. Phân loại 85 sự kiện và 10 cụm chuỗi: có gộp/tách cụm nào không? *(mặc định: giữ)*
15. Việc thường ngày: 3 mức trong Cài đặt (Hỏi hết / Cân bằng / Tự chọn hết), ngân sách K = 4 trừ số chuỗi đang mở: ổn không? *(mặc định: ổn)*
16. **Nhẫn có 6 phiên bản thật** bốc ẩn: giữ ẩn hay hiện manh mối sớm? *(mặc định: ẩn, có dấu nhỏ)*
17. **Kỳ ngộ xúc xắc cũ** (trúng tư chất, biến dị...) giữ rất hiếm có giá, hay bỏ hẳn? *(mặc định: giữ rất hiếm, có giá)*

**Nền nhân vật (mục 4, 5, 6, 7)**
18. **Tiên thiên v2**: 6 loại ô và 4 phẩm ổn không; có muốn thêm/bớt loại (ví dụ thêm loại "Thần thông thiên bẩm")? *(mặc định: ổn)* Cách tính giảm một nửa là nhân 0,5 đúng (5 → 2,5 → 1,25; số bạn ghi 2,25 và 1,15 là làm tròn)? *(mặc định: nhân 0,5)*
19. **Bốn trục tính cách** và tên hai đầu từng trục đúng ý chưa? Chỉnh ban đầu bằng ngân sách 4 điểm (tổng cố định) hay chọn tự do/bốc ngẫu nhiên? Khóa tuyệt đối chỉ ở đầu cực? Hai trục mở rộng (Tham vọng, Ân oán) để đợt sau? *(mặc định: như mục 6)*
20. **Khí vận**: bỏ chỉ số cũ, thay bằng Mệnh cách (tiên thiên) + điểm khí vận (trần 10, 12 đến 20 điểm/đời), giữ vận may thu hẹp; **Thiên cơ điểm** của đột phá giữ riêng: ổn không? *(mặc định: ổn)*
21. **Vòng quay**: tần suất 8 đến 14 lần mỗi đời, giá quay lại 2 đến 5, tự quay lại ở vùng thấp nhất khi còn dư ít nhất `giá + 2` điểm (chỉ khi bạn bật): ổn không? *(mặc định: ổn)*

## 21. Gợi ý bổ sung (mình thấy còn thiếu hoặc đáng thêm)

### 21.1 Còn thiếu trong kế hoạch (nên bổ sung trước khi code)
1. **Màn kết đời / bia mộ**: khi chết hoặc phi thăng, hiện **một trang tóm tắt đời** từ truyện: kiểu đời, xuất thân, các tuyến đã qua và kết cục, người định mệnh, tính cách cuối, khí vận đã dùng, **dòng bia mộ** (tên đạo hiệu và một câu); lưu vào Sổ đời. Là phần thưởng cảm xúc lớn và làm đòn bẩy cho đời sau.
2. **Nhạc trưởng nhịp truyện** (`Story Director`): một lớp điều tiết **nhịp**: không để hai tuyến nóng cùng lúc, sau một vòng quay lớn có **vài năm yên ả**, nếu quá lâu không có chuyện thì **gợi** một hạt mới; đo bằng `story-sim`. Hiện kế hoạch chỉ có "tối đa 1 chặng nóng", chưa có nhịp cao thấp.
3. **Truyện quay lại đời sau** (liên kiếp): nhân quả, người định mệnh còn sống, di vật, địa điểm cơ duyên, tin đồn **huyền thoại** về kiếp trước (NPC kể "ngày xưa có một người..."); làm đầu thai có ý nghĩa truyện. (Mục 9.7 mới sơ lược.)
4. **Tốc độ thời gian**: hộp chặng, vòng quay, giấc mơ phải **tạm dừng** thời gian và không bị bỏ lỡ khi chạy x8, x16; đã có cơ chế dừng ở hộp quyết định, cần kiểm cho vòng quay (hoạt ảnh) và giấc mơ.
5. **Chế độ Tự động thực sự chơi được**: chặng chọn **theo tính cách**, vòng quay tự quay, khí vận tự dùng có quy tắc; **bản tóm tắt cuối năm** gom các việc nhỏ tự xử lý (đã có ý ở 14.4), cần thêm cho truyện.
6. **Hướng dẫn nhập môn** (tutorial nhẹ): lần đầu có vòng quay, giấc mơ, khóa mềm, thanh tính cách thì hiện một dòng giải thích ngắn (dạng "mẹo", tắt được).
7. **Thế giới sau khi bạn chết**: hậu quả lâu dài của quyết định (tông diệt vì bạn, thù tiếp tục, miếu thờ, tên tuổi); NPC định mệnh và đồ đệ tiếp tục sống 20 đến 50 năm thế giới và **xuất hiện trong báo** ở đời sau.

### 21.2 Ý tưởng hay nên cân nhắc
8. **Sổ manh mối** (clue journal): mọi manh mối (tin đồn, giấc mơ, lời thầy tướng, tin báo) gom vào một sổ ghim lên bản đồ; bấm để theo dõi. Làm kỳ ngộ khám phá thành **trò chơi trinh thám nhẹ**.
9. **NPC có mini-truyện riêng**: vài "thiên kiêu" nổi tiếng chạy theo vòng đời kiểu đời (trọng sinh, huyết mạch...) và được **báo đăng** (vạch "vị đại năng chuyển thế này mất tích"): thế giới sống động, người chơi có thể **gặp và can dự**.
10. **Bản đồ đời người** (UI): cây nhánh các quyết định lớn và vòng quay đã qua, nhìn lại đời như bản đồ "nếu tôi chọn khác"; **Sổ đời** hiện trên cây.
11. **Danh hiệu và thành tựu theo truyện**: "Người cứu một làng", "Kẻ giữ lời thề trăm năm", "Nghịch thiên"; mở bộ sưu tập kết cục, **thưởng nhỏ đời sau** (một điểm khí vận đầu đời, một dòng ghi trong xuất thân).
12. **Chọn đầu thai nhẹ** (meta): khi đầu thai, bỏ **Thiên cơ điểm** để nghiêng trọng số **xuất thân** hoặc **kiểu đời** (không chọn thẳng); gắn với "dấu" kiếp trước (9.7).
13. **Kỳ ngộ có mùa và nơi** (thật sự là hành trình): một số cơ duyên chỉ mở **vào thời đại, mùa, hoặc khi giá/chiến sự đạt điều kiện** (nối kinh tế và thời đại): ví dụ bí cảnh chỉ mở khi hạn hán kéo dài.
14. **Bạn đồng hành truyện** (companion): NPC theo bạn một đoạn (thợ săn, thầy thuốc, đạo sĩ), có bản **tính cách riêng** và **lời khuyên** ở hộp chặng ("Y nghĩ nên tha"), có thể rời, phản bội, hy sinh. Nối R (dây duyên) và Q 13.3 (vai).
15. **Lời tiên tri và thầy tướng như hệ**: không chỉ vài sự kiện; một "hệ tiên tri" đưa **lời sấm đúng một phần** về 1 trong 3 chặng sắp tới (đúng 70%), người chơi dùng để chuẩn bị; sai cũng ghi vào nhân quả.
16. **Tùy chọn độ khó truyện**: *Nhẹ* (ít chết, vòng quay cộng thêm +5), *Thường*, *Nặng* (vòng quay trừ −5, khí vận ít hơn, hậu quả trễ nặng hơn).

### 21.3 Hỗ trợ viết nội dung (để 230+ chặng nhất quán)
17. **Cẩm nang giọng truyện** (`ke-hoach/Q-giong-truyen.md`): ngôi, xưng hô, độ dài, từ cấm, mẫu câu mở/kết, cách viết nghiệt duyên gián tiếp, bảng tên (họ, địa danh, đạo hiệu).
18. **Công cụ**: `tools/story-lint.js` (kiểm mọi chặng trỏ đúng, lựa chọn có giá, khóa có lý do, tổng độ rộng vùng quay), `so-do-tuyen.html` (vẽ đồ thị tuyến để duyệt trực quan), lệnh **"nhảy tới chặng"** trong console để thử nhanh.
19. **Bộ dữ liệu mẫu để chơi thử** (sandbox): chọn xuất thân, kiểu đời, tính cách, tiên thiên, khí vận từ một bảng ở trang debug để kiểm đúng tuyến và vòng quay.

### 21.4 Rủi ro cần canh
| Rủi ro | Cách giảm |
|---|---|
| **Phạm vi quá lớn** (~230 chặng, nhiều nền mới) | làm theo chặng Q1 → Q8, mỗi chặng chơi thử được; đợt đầu 4 tuyến; tách R |
| **Nền thay quá nhiều chỉ số** (tiên thiên, khí vận, tính cách) làm lệch cân bằng cũ | bài đo Trúc Cơ+ 2/5/18% ±10% sau mỗi chặng nền; hạ số phẩm cao |
| **Quá nhiều hộp** | ngân sách thường ngày, tự quay, tự chọn theo tính cách; nhịp ≤ 6/phút |
| **Người chơi bực vì không chọn** (vòng quay) | chỉ ở chặng lớn, hiện yếu tố cộng điểm và quay lại bằng khí vận; ghi rõ "phù hợp" chứ không "tốt" |
| **Nội dung tối bị coi là quá đà** | kể gián tiếp, nút bật/tắt chế độ truyện nhẹ, mặc định né nhánh tàn nhất theo Đạo đức |
| **Bản lưu cũ hỏng** | trường khởi tạo muộn, chuyển một lần, snapshot trước mỗi chặng, test lưu/tải |


### 21.5 Mở rộng nội dung: kho trope, gói truyện, AI tùy chọn (bạn hỏi 2026-10-18)
**Vấn đề:** kịch bản tu tiên (phim ngắn, truyện) có **rất nhiều kiểu**; viết tay từng tuyến thì không kịp. Cần cách **thêm nhiều chuỗi** mà vẫn nhất quán và an toàn. Đề xuất **bốn tầng**, từ chắc chắn tới liều, tầng nào cũng dùng **cùng định dạng dữ liệu chặng** (mục 10) để không phải viết engine riêng.

| Tầng | Là gì | Chạy ở đâu | Cần mạng | Rủi ro | Đề xuất |
|---|---|---|---|---|---|
| **A. Kho trope (mẫu có khe)** | khung "đả mặt, từ hôn, giả heo ăn thịt hổ..." với **khe điền** (nhân vật, nơi, vật, tính cách, thế lực lấy từ thế giới đang chạy) | trong game | không | thấp | **Làm trước (Q5 đến Q7)**: vài chục mẫu sinh hàng trăm biến thể |
| **B. Gói truyện nhập (JSON)** | người dùng hoặc tác giả viết tuyến theo định dạng, dán/tải vào game; có kiểm dữ liệu | trong game | không | thấp | **Làm sau tầng A** (cần `story-lint`) |
| **C. AI viết lại chữ** (an toàn) | AI chỉ **diễn đạt lại văn bản** của chặng đã có để hợp ngữ cảnh (tên, tính cách, địa danh); **cơ chế, thưởng, hậu quả giữ nguyên** | cần mạng, tùy chọn | có (khóa của bạn) | thấp | tùy chọn, tắt mặc định |
| **D. AI sinh tuyến mới** (như bạn nói "kéo API") | AI nhận **ý tưởng** (từ bạn hoặc từ thế giới) và **sinh một tuyến JSON** theo định dạng; **bị kiểm và kẹp số** rồi mới vào game | cần mạng, tùy chọn | có | **cao hơn** | tùy chọn nâng cao, làm cuối, nhiều rào chắn |

#### A. Kho trope (nền tảng cho mọi tầng)
- **Trope** = khung cốt truyện ngắn (4 đến 6 nhịp): *móc* → *dồn ép* → *đảo ngược* → *trả giá/đền đáp* (+ tùy chọn *hậu quả trễ*). Mỗi nhịp là một chặng dùng **khe** (`{nhan_vat_chinh}`, `{doi_thu}`, `{noi}`, `{vat}`, `{the_luc}`) và **điều kiện tính cách/tiên thiên**; số liệu thưởng/giá lấy theo **bậc** (nhỏ/vừa/lớn) để cân bằng chung.
- **Thư viện trope gợi ý** (từ phim ngắn, tiểu thuyết tu tiên), nhóm theo **vị trí trong đời**:
  - *Mở đầu*: phế vật bị khinh (đả mặt), từ hôn ba mươi năm Hà Đông, nhặt nhẫn/ông già trong nhẫn, thân thế bí ẩn (cha mẹ đại năng), mất đan điền rồi phục hồi, hệ thống kim thủ chỉ (cheat system).
  - *Giữa đời*: giả heo ăn thịt hổ (che giấu tu vi), đấu giá đả mặt phú nhị đại, thiên kiêu bảng và đối thủ, luyện đan đại hội, bí cảnh tranh đoạt, thu đồ thiên tài, anh hùng cứu mỹ nhân (và đảo vai), kẻ phản bội ngược tra rồi báo thù, bị tông trục xuất rồi nghịch tập.
  - *Cao trào*: đại năng ẩn thế lộ diện, tông bị diệt và người sống sót, gia tộc bị hại và báo thù, đọa ma hoặc hồi đầu, thiên đạo trừng phạt, vòng lặp thời gian, kẻ thù hóa ra là sư phụ.
  - *Kết*: để lại truyền thừa, từ chối phi thăng vì người thương, phá trời, quy ẩn.
- **Sinh biến thể**: mỗi trope có **3 đến 5 nhánh kết** và **nhiều cách điền khe**; trộn với dàn nhân vật định mệnh (mục 13.3) và tính cách (mục 6) cho ra truyện khác nhau. Ước tính **~40 trope x 10 biến thể ≈ 400 chặng** từ khoảng 150 chặng viết tay.
- **Nguồn khe thật**: NPC có vai (mục 13.3), vùng đang ở, tông, giá và cú sốc (eco), tin báo, xuất thân; nên truyện **luôn liên quan thế giới đang chạy**.
- **Lưu**: biến thể được **sinh và ghi vào `c.story`** (dữ liệu thuần) nên **lưu/tải ổn định**, không phụ thuộc lần sinh sau.

#### B. Gói truyện nhập (JSON)
- Định dạng tuyến (mục 10) viết bằng **JSON thuần** (không mã), gồm: chặng, điều kiện, lựa chọn, vòng quay, hậu quả, thưởng theo bậc; **không** cho gọi hàm tùy ý, chỉ dùng **danh sách hiệu ứng được phép** (cộng tiền, quan hệ, tính cách, khí vận, cờ, sinh NPC...).
- **Kiểm** bằng `story-lint`: mọi chặng trỏ đúng, thưởng trong trần theo bậc, độ rộng vùng quay = 100, không vòng lặp vô hạn; lỗi thì từ chối kèm báo.
- **Cài đặt** mục "Gói truyện": bật/tắt từng gói, xem điều kiện mở, xóa; gói đánh dấu nguồn ("do người dùng thêm").

#### C. AI viết lại chữ (tùy chọn, an toàn)
- Chỉ thay **văn bản** (tiêu đề, mô tả, lời thoại) bằng một bản phù hợp hơn (tên NPC, tính cách, địa danh, giọng truyện); **không** đụng cơ chế. Có **bản gốc** để dự phòng khi lỗi hoặc mất mạng.
- Gọi **bất đồng bộ** ở lúc rảnh (trước khi chặng tới hạn), lưu kết quả vào bản lưu; không bao giờ **chờ** AI khi chơi.

#### D. AI sinh tuyến mới (kéo API, tùy chọn nâng cao)
- **Luồng:** (1) lấy **ý tưởng**: từ ô nhập của bạn ("đại tiểu thư bị phế, tôi cứu cô ấy") hoặc từ **thế giới** (một cú sốc giá, một tông diệt, một NPC định mệnh); (2) gửi cho mô hình **gói ngữ cảnh gọn** (định dạng tuyến, danh sách hiệu ứng, trần thưởng, bốn trục tính cách, vài ví dụ trope, tóm tắt thế giới) và yêu cầu **trả JSON**; (3) **kiểm bằng `story-lint`** và **kẹp số** (thưởng vượt trần bị hạ, vùng quay chuẩn hóa), tối đa 1 lần sinh lại nếu lỗi; (4) **xếp hàng**: mỗi lần **sinh sẵn 1 đến 3 tuyến** ở lúc rảnh, tuyến vào game ở **điểm an toàn** (không giữa chặng); (5) ghi vào `c.story` và **bản lưu** (lần chơi lại cùng một kết quả).
- **Rào chắn bắt buộc:**
  - **Không chạy mã** từ AI; chỉ **dữ liệu** theo danh sách hiệu ứng cho phép (không `eval`, không HTML tự do).
  - **Kẹp cân bằng**: tổng thưởng của tuyến AI ≤ trần theo bậc; khí vận, tiên thiên Quý/Thiên và vật phẩm hiếm **chỉ** do hệ thống cấp (AI chỉ gợi ý "mở một vòng quay").
  - **Nội dung**: chế độ truyện nhẹ áp dụng; lọc từ nhạy cảm; **không** nội dung tình dục, **không** bạo lực quá mức (giữ mức kể gián tiếp như T13, T14); người chơi có nút **"bỏ tuyến này"** (không tốn gì nếu chưa qua chặng 2).
  - **Nhãn "do AI viết"** trong Truyện của đời bạn.
  - **Giới hạn**: tối đa N tuyến AI mỗi đời; mỗi tuyến 4 đến 6 chặng; thời hạn dài; tối đa 1 tuyến AI nóng một lúc.
- **Kỹ thuật và chi phí:**
  - Game là **HTML thuần chạy trên máy**; gọi API từ trình duyệt cần **khóa API của bạn** (lưu **cục bộ**, không gửi đi đâu khác; không ghi vào bản lưu xuất ra) hoặc qua **proxy cục bộ** (`serve.ps1` thêm đường `/ai` giữ khóa trong biến môi trường). Mặc định **tắt**.
  - Chi phí ước: một tuyến khoảng 2.000 đến 4.000 token đầu ra, vài nghìn token ngữ cảnh; sinh 1 đến 3 tuyến mỗi vài năm thế giới → rất rẻ nếu dùng mô hình nhỏ. Có **bộ đếm token** trong Cài đặt và **hạn mức** (ví dụ tối đa 20 lần gọi mỗi đời).
  - **Lỗi mạng/khóa sai** → tự rơi về tầng A (kho trope), không dừng game.
  - **Lặp lại được**: lần sinh được lưu; **mô phỏng cân bằng và kiểm thử không gọi AI** (dùng tuyến có sẵn).
- **Ý tưởng chơi vui:** nút **"Nhờ Thiên Cơ Các kể một chuyện"** (trên Truyện của đời bạn): bạn nhập một câu ý tưởng, AI dựng tuyến phù hợp thế giới hiện tại; hoặc **"Chuyện thiên hạ"**: AI viết một tuyến thế giới ngắn (W9 mở rộng) từ chính biến cố đang diễn ra.

#### Thứ tự đề xuất (cho kế hoạch chặng, mục 19)
- **Q5 đến Q7**: thêm **kho trope** (tầng A) cùng với việc viết tuyến tay; chốt định dạng dữ liệu chặng có **khe** và **hiệu ứng cho phép**.
- **Q8**: **`story-lint` hoàn chỉnh** và **gói truyện nhập** (tầng B).
- **Q9 (tùy chọn)**: **AI viết lại chữ** (tầng C) rồi **AI sinh tuyến** (tầng D) sau khi bạn chơi thử và muốn thêm.
- Mọi tầng sau **không** thay đổi luật chơi cốt lõi; nếu bạn không dùng AI thì game vẫn đủ nội dung nhờ tầng A và B.

**Câu hỏi cho bạn (mặc định ghi sẵn):**
1. Làm **tầng A (kho trope)** trong Q5 đến Q7, B ở Q8, **C và D tùy chọn ở Q9**? *(mặc định: có)*
2. Với tầng D bạn thích **khóa API riêng của bạn** (lưu cục bộ) hay **proxy cục bộ**? *(mặc định: khóa riêng, qua proxy `serve.ps1`)*
3. AI được **sinh tuyến hoàn toàn mới** hay chỉ **điền khe vào trope có sẵn**? *(mặc định: chỉ điền khe và viết chữ ở lần đầu; sinh tuyến mới hoàn toàn là tùy chọn "Thử nghiệm")*
4. **Mức nội dung tối đa** cho AI sinh: bằng mức các tuyến T13, T14 (gián tiếp), hay thấp hơn? *(mặc định: bằng, có nút truyện nhẹ)*
## 22. Nhật ký làm việc
(Các số mục trong những dòng nhật ký cũ là số theo bản của từng lần ghi; từ bản 10 dùng số mới ở bảng đối chiếu.)
- 2026-10-18 (bản 12): theo ý bạn gộp kế hoạch quốc gia và tông môn hiện đại thành [S-quoc-gia-tong-mon-ton-giao](S-quoc-gia-tong-mon-ton-giao.md); thêm PHẦN VII, mục 24: giáo sĩ (T15) và Thần Chức đạo (T16) chuyển vào Q, tuyến T17 đến T21, tuyến thế giới W13 đến W24, 12 cụm chuỗi (11 đến 22), 36 sự kiện nghịch lý của chín tông, và các sự kiện quốc gia, tôn giáo, hội, gia tộc.
- 2026-10-18: bạn yêu cầu làm mới toàn bộ hệ cốt truyện, lựa chọn và kỳ ngộ. Khảo sát hiện trạng, viết kế hoạch bản 1, chưa code.
- 2026-10-18 (bản 11): bạn hỏi cách thêm nhiều kịch bản tu tiên kiểu phim ngắn, có thể kéo API cho AI tự thiết kế lúc chơi. Thêm mục 21.5: bốn tầng (kho trope, gói truyện JSON, AI viết lại chữ, AI sinh tuyến) với rào chắn và thứ tự làm.`r`n- 2026-10-18 (bản 9): chốt tỉ lệ tiên thiên (Quý 15%, Thiên 5%, mỗi cái ra thì lần sau giảm một nửa, 4.1b); chốt điều kiện T13, T14: từ Trúc Cơ trở lên, và việc dùng Trùng đồng hay xương (móc, đào, cấy) do vòng quay vận mệnh quyết (11.2), có bảng vùng và yếu tố cộng điểm cho từng vai.
- 2026-10-18 (bản 8): theo ý bạn: **tiên thiên làm lại** (4: 6 ô, 4 phẩm, tương hợp xuất thân/xương sống/tuyến, ẩn/mất/cấy/truyền) và **khí vận làm lại** (5: điểm khí vận chỉ từ chuyện lớn, không theo thời gian; vòng quay quay lại 1 lần, giá 2 đến 5); thêm 2 tuyến **T13 Móc mắt (trùng đồng)** và **T14 Đào cốt (đạo cốt)** với cơ chế Nghiệt duyên (11.1). Câu về điều kiện 'chỉ xảy ra khi đạt...' bị cắt, tạm đặt Kim Đan và hỏi lại ở mục 11.
- 2026-10-18 (bản 7): đổi thang tính cách thành −10 đến +10 (0 là Trung dung) và thêm mục 7 vòng quay vận mệnh: quyết định không được chọn ở sự kiện lớn, số 0 đến 100 rơi vào 2 đến 4 vùng, một yếu tố cộng điểm, quay lại bằng điểm khí vận (1 đến 5), 8 vòng quay mẫu.
- 2026-10-18 (bản 6): thêm mục 6 tính cách bốn trục (Tính tình, Xử thế, Đạo đức, Tu dưỡng) theo ảnh mẫu của bạn: đổi dần theo quyết định và biến cố, khóa mềm, phí trái tính, định hướng mặc định, NPC chuyển nhãn cũ, giao diện Hồ sơ.
- 2026-10-18 (bản 5): thêm mục 14: phân loại 85 sự kiện cũ (36 mở chuỗi, 8 cảnh ngộ, 8 thường ngày, 7 kỳ ngộ vận mệnh, 17 kịch bản cụm), 10 cụm liên kết, ý tưởng chi tiết cho nhẫn/từ hôn/thiếu chủ và các sự kiện khác, cách giảm việc thường ngày và cho tự chọn (ngân sách hỏi).
- 2026-10-18 (bản 4): thêm mục 11 (12 tuyến thân phận chi tiết), 12 (8 tuyến thế giới, pha và móc), 13 (cách lồng nhau: móc và cửa, chặng ghép, hàng đợi, loại trừ, dàn nhân vật dùng chung, nhân quả chung, hội tụ ở mốc 5-6, bảng giao nhau, ví dụ, khối lượng ~230 chặng).
- 2026-10-18 (bản 3): thêm trục xuất thân (mục 8): 17 xuất thân (nhà phàm, tán tu, gia tộc luyện khí/đan/phù, thương cổ, hậu duệ tông, thế gia, ẩn thế, đại năng ẩn thế, sa sút, ma tu), cha mẹ và gia tộc là thật, bổn phận, bí mật, tuổi thơ, bảng khớp với xương sống.
- 2026-10-18 (bản 2): theo ý bạn, làm kỹ xương sống: 5 kiểu đời (thêm Xuyên không, Đại năng trọng sinh, và hai gợi ý Huyết mạch thượng cổ, Thiên phạt chi nhân), tỉ lệ thấp hơn kiểu thường; mục 9.


## 23. Kết quả và việc để sau
(Điền khi xong.)


---

# PHẦN VII. NỘI DUNG TỪ KẾ HOẠCH S (QUỐC GIA, TÔNG MÔN HIỆN ĐẠI, TÔN GIÁO)

## 24. Giáo sĩ, Thần Chức đạo, sự kiện và chuỗi sự kiện của hệ Quốc gia, Tông môn, Tôn giáo

Theo ý bạn (2026-10-18): **giáo sĩ và Thần Chức đạo** đưa vào đây để làm cùng cốt truyện; **thêm sự kiện và chuỗi sự kiện nặng đô** cho hệ quốc gia, tông môn và tôn giáo. Cơ chế nền (quốc vận, nho khí, quân trận, `gt`, công–tội, ba ô tín ngưỡng...) nằm ở [S-quoc-gia-tong-mon-ton-giao](S-quoc-gia-tong-mon-ton-giao.md); mục này chỉ viết **truyện và sự kiện** dùng các cơ chế đó.

**Quy ước riêng của mục 24**
- **Tên thật chỉ cho tôn giáo**; tên nước, tông, hội, gia tộc là tên giả cổ trang. Sự kiện tôn giáo viết bằng **khe `{tn}`** (tín ngưỡng của vùng/nhân vật) và có biến thể chữ theo tín ngưỡng, để không gắn một tôn giáo cụ thể vào vai xấu. Kẻ cực đoan luôn là **một cá nhân hoặc một phái** (`{phai}`), không phải cả tôn giáo.
- **Công–tội cân bằng:** mọi lựa chọn có hai mặt; riêng nhánh Âm Hồn Giáo thì nghiêng tối hơn.
- **Móc hệ:** `qv` quốc vận, `nho` nho khí, `ql` quân lực, `sat` sát khí, `gt` giá trị tông, `nhan` hành vi tông, `rel2` mạng quan hệ, `faith` ba ô, `huong` hương hỏa.
- **Mã sự kiện:** `qg_` (quốc gia), `tm_` (tông môn), `tg_` (tôn giáo), `th_` (thương hội), `gtc_` (gia tộc).

### 24.1 Giáo sĩ (tuyến thân phận T15: "Tiếng chuông trên đồi")
**Ý tưởng:** nghề cho người **sùng đạo**, thay một phần đường tông môn: thăng bậc bằng công đức và hương hỏa chứ không chỉ bằng cảnh giới. Có thể **kiêm tu tiên** (giáo sĩ Luyện Khí, Trúc Cơ... vẫn tu bình thường); nhưng giáo sĩ cao bị ràng buộc giới luật và trách nhiệm với cộng đồng.

**Mở khi:** `tam` từ "Sùng đạo" (S mục 8.7), có nơi thờ tự trong vùng, không bị gạt vì khác đạo; hoặc xuất thân "hậu duệ tăng lữ/thầy cúng" (mục 8).

**Bốn bậc theo tín ngưỡng** (tên thật cho quen thuộc):
| Tín ngưỡng | Tập sự | Giáo sĩ | Chủ lễ/Trụ trì | Giáo trưởng |
|---|---|---|---|---|
| Phật giáo | Sa di | Tỳ kheo | Trụ trì | Đại sư |
| Thiên Chúa giáo | Thầy giúp lễ | Linh mục | Chánh xứ | Giám mục |
| Hồi giáo | Học trò kinh | Imam | Imam lớn của thánh đường | Đại học giả |
| Ấn Độ giáo | Đệ tử | Tư tế | Đạo sư (guru) | Đại đạo sư |
| Đạo giáo | Đạo đồng | Đạo sĩ | Đạo trưởng | Chưởng giáo |
| Nho giáo | Học trò | Thầy đồ | Giáo thụ (chủ văn miếu) | Đại nho |
| Thờ cúng tổ tiên | Con cháu giúp lễ | Thủ từ | Trưởng tộc | Tộc trưởng toàn họ |
| Thần đạo | Học trò đền | Thần chủ | Cung ty | Đại cung ty |
| Dân gian | Người học việc | Thầy cúng | Trưởng lễ làng | Trưởng lão các làng |

**Năm chặng**
1. **Tiếng gọi:** gặp nơi thờ tự và một người dẫn đường; nhận hay từ chối; ghi một món nợ hoặc một lời nguyện.
2. **Mùa lễ đầu tiên:** lần đầu chủ trì một nghi lễ; chọn giữ nguyên nghi thức hay thích nghi cho dân hợp; đúng sai đều có giá.
3. **Khủng hoảng:** thiên tai hay dịch (W2, W3); đền có kho lương và hương hỏa; chọn **mở kho cứu dân** (cạn hương hỏa, dân tâm lên), **giữ kho cho lễ lớn**, hoặc **đàm phán với triều/tông**.
4. **Quyền lực:** triều hay tông muốn dùng đền làm chỗ dựa (quốc giáo, thu thuế, tuyên truyền); chọn theo (đại điện giàu hơn, mất tự chủ), từ chối (bị đàn áp, được dân quý), hoặc chia đôi.
5. **Di sản:** chọn người kế vị, cải cách hay giữ nguyên, hay đứng ra chống một phái cực đoan.
- **Kết cục:** (a) *Người dẫn đường*: được dân tôn, đại điện vững; (b) *Giáo sĩ quyền lực*: giáo hội mạnh nhưng dính chính trị, dễ sa vào tham; (c) *Tử đạo/ẩn tu*: bỏ lại danh vọng, hương hỏa tan thành phúc cho dân.
- **Người định mệnh:** Thầy dẫn đường, Tín đồ trung thành, Kẻ cực đoan (một người trong một phái), Quan hay tông sứ.
- **Móc:** hương hỏa (S 8.5), W2, W3, W18 Thánh chiến, W19 Dị giáo, W20 Đại điện đổi chủ, cụm 15 và 16.
- **Cân bằng:** giáo sĩ nhận bổng bằng hương hỏa, không bằng linh thạch; thăng bậc cần **công đức** (cứu người, làm lễ, hòa giải) chứ không chỉ tu vi; phạm giới nặng bị thu chức. Không phải con đường mạnh hơn tông môn, mà **khác** (dân tâm, hòa giải, cứu trợ).

### 24.2 Thần Chức đạo (tuyến thân phận T16: "Hương hỏa trên vai")
**Phạm vi (rất quan trọng):** Thần Chức đạo là **hệ riêng gắn với tín ngưỡng dân gian, Thần đạo và Đạo giáo dân gian** (thờ thổ địa, sơn thần, thủy thần, thành hoàng, thần y, thần chiến). **Không** áp vào Thiên Chúa giáo, Hồi giáo, Phật giáo, Ấn Độ giáo: những tôn giáo đó có quan niệm riêng về thần thánh và không được dùng như "cấp bậc thần" trong game. Điều này tránh mạo phạm và giữ hệ rõ ràng.

**Ý tưởng:** tu sĩ **không** chỉ tu bằng linh khí mà có thể được dân lập miếu thờ, nhận **hương hỏa** để tăng tu vi và quyền hạn, đổi lại bị ràng buộc bởi **nguyện vọng** của người thờ. Là "con đường thứ ba" giữa tu tiên và giáo sĩ.

**Cơ chế**
1. **Thần vị** (Thổ địa làng, Sơn thần, Thủy thần, Thành hoàng, Thần y, Thần giữ cửa ải, Thần chiến): mỗi thần vị có **phạm vi** (làng, vùng, thành), **nguyện vọng điển hình** (mưa thuận, đẻ khỏe, buôn may, bình an), **hương hỏa tối đa**.
2. **Lập miếu:** dân tự nguyện lập miếu nếu bạn có công lớn (W2, W3, W1), hoặc bạn tự dựng (tốn). Miếu là công trình thờ tự nhỏ (S 8.4).
3. **Hương hỏa** (`huong`): tích khi dân thờ và cầu được ứng; mất khi dân thất vọng, miếu bị phá, dị giáo cướp tín đồ. Dùng để: tăng tốc tu luyện (có trần, tối đa +25%, không thay đột phá), **thần thông phạm vi** (che chở làng, đẩy lùi yêu thú, chữa dịch trong phạm vi), và duy trì thần vị.
4. **Nguyện vọng (ràng buộc):** mỗi tuần/tháng có "lời cầu" của dân thành **việc phải làm** (nhiệm vụ nhỏ có hạn); bỏ lỡ thì hương hỏa hao, bỏ lỡ nhiều thì **thần chức rơi**.
5. **Mê muội:** tham hương hỏa dẫn tới đạo tâm lệch (đòi cúng bái nhiều hơn, bắt dân hiến tế, ganh với thần khác); đi quá xa thì thành **thần ma** (nghiêng ác, bị thế lực và giáo sĩ săn).
6. **Giải thoát:** trả hương hỏa lại cho dân, rời thần chức, giữ lại chút duyên; có thể phi thăng.

**Năm chặng**
1. **Lời cầu đầu tiên:** một làng cầu bạn trong lúc nguy cấp; chọn ứng hay không, ghi hương hỏa lần đầu.
2. **Miếu nhỏ:** dân lập miếu; chọn nhận thần vị nào (làm lễ, nhận hay chối).
3. **Thần cạnh tranh:** gặp thần khác (có thể là tu sĩ khác hoặc đồ vật hóa linh); tranh tín đồ hay hợp tác.
4. **Nguyện vọng trái nhau:** hai làng cầu hai điều đối nghịch (mưa và nắng, hòa và chiến); chọn bên nào, mất bên kia.
5. **Chọn đường:** tiếp tục làm thần (mạnh, ràng buộc), trả hương hỏa (giải thoát), hay thành thần ma.
- **Kết cục:** *Chính thần* (dân thờ nhiều đời, hương hỏa bền, nhưng không rời được); *Thần ma* (bị săn, bi kịch); *Giải thoát* (trả đủ, phi thăng hoặc ẩn dật).
- **Người định mệnh:** Người cầu đầu tiên, Thầy cúng/giáo sĩ phụ trách, Thần cạnh tranh, Kẻ lợi dụng miếu.
- **Mở khi:** Trúc Cơ trở lên, có ân với một nơi, hoặc thức tỉnh tiên thiên đặc biệt, hoặc kỳ ngộ "được dân thờ".
- **Móc:** W2, W3, W1 (cứu làng), tín ngưỡng dân gian của vùng (S 8.3), cụm 22.
- **Cân bằng:** thần chức không cho vượt cảnh giới; tăng tốc có trần; mê muội có thang cảnh báo; tông và triều có thể chiêu hay trấn (T21, cụm 17).

### 24.3 Năm tuyến thân phận mới cho hệ quốc gia (T17 đến T21)
Quy ước như mục 11: mỗi tuyến 5 chặng, kết cục 3 nhánh, người định mệnh, móc.

**T17. Võ quan: "Cờ trên lưng ngựa"**
- *Mở khi:* nhập ngũ (trưng binh, tình nguyện) hoặc xuất thân quân; Luyện Khí trở lên.
- *Chặng:* (1) **Lệnh nhập ngũ** (tình nguyện, bị trưng, hay mua người thế chân); (2) **Quân doanh**: kỷ luật, tình đồng đội, một người bạn và một viên cấp trên; (3) **Trận đầu**: chiến sự (W1) hay vây tu sĩ (W16), chọn theo lệnh hay cứu đồng đội; (4) **Quân công và tội**: thắng, được thưởng, nhưng có lệnh đồ sát tù binh hay thôn xóm; (5) **Cởi giáp**: giải ngũ, thăng tướng, hay đào ngũ.
- *Kết cục:* Tướng quân / Kẻ cởi giáp về làng / Kẻ đào ngũ bị truy.
- *Người định mệnh:* Bạn đồng đội, Cấp trên, Tu sĩ làm tướng, Kẻ thù trên chiến trường.
- *Móc:* quân trận (S 5.4), W1, W16, cụm 12.

**T18. Nho sĩ: "Ba khoa thi"**
- *Mở khi:* `van` từ 1 (Đồng sinh), nước có khoa cử; không cần tu tiên.
- *Chặng:* (1) **Học đường**: thầy đồ, bạn cùng lớp, nghèo hay giàu; (2) **Kỳ thi hương**: đỗ hay hỏng, gian lận quanh bạn; (3) **Bảng vàng**: đỗ Tiến sĩ hay chọn đường khác; (4) **Quan trường**: làm quan, đối mặt tham nhũng, phe phái, văn cấm (W15); (5) **Lời để lại**: bản tấu, sách, hay ngồi dưới gốc cây dạy học trò.
- *Kết cục:* Thanh quan lưu danh / Quyền thần / Kẻ về ẩn.
- *Người định mệnh:* Thầy đồ, Bạn thi, Quyền thần, Hoàng thượng.
- *Móc:* nho khí (S 5.3), W15, cụm 13, hạo nhiên khí.

**T19. Sứ giả: "Quốc thư trong tay áo"**
- *Mở khi:* làm ở Ngoại Vụ Đường hoặc có tín nhiệm hai bên (tông và triều); từ Trúc Cơ.
- *Chặng:* (1) **Giao thư đầu**: đưa quốc thư qua vùng nguy hiểm; (2) **Bàn tiệc**: gặp sứ bên kia, nghe được hơn lời nói; (3) **Điều khoản khó**: một điều khoản sẽ hại một bên vô tội; (4) **Bội ước**: một bên xé hiệp ước (W5); bạn làm chứng, ém, hay báo; (5) **Hòa nghị**: kéo hai bên về bàn hay bỏ cuộc.
- *Kết cục:* Hòa giải đời đời / Kẻ bị bỏ rơi giữa hai phía / Kẻ lộ mặt gián điệp.
- *Người định mệnh:* Sứ bên kia, Quan hầu, Kẻ mua chuộc, Tướng muốn đánh.
- *Móc:* hiệp ước (F2), mạng quan hệ (S Phần A), W5, W22, W24, cụm 14.

**T20. Mật thám: "Hai gương mặt"**
- *Mở khi:* được Mật Các (tông) hay mật thám triều chiêu mộ; hoặc bị bắt buộc vì nợ; từ Luyện Khí.
- *Chặng:* (1) **Lời mời trong bóng tối**; (2) **Cài vào**: lẫn vào một thế lực khác, tạo thân phận; (3) **Tin đầu tiên**: gửi tin hay giữ lại, có người hại; (4) **Bị nghi**: sắp lộ, phải chọn phản chủ hay hy sinh; (5) **Ngày lộ diện**: về hay ở lại.
- *Kết cục:* Anh hùng thầm lặng / Kẻ phản bội hai phía / Kẻ ở lại sống đời khác.
- *Người định mệnh:* Chủ nhân, Người tin bạn, Kẻ nghi ngờ, Người bạn bị bạn hại.
- *Móc:* thông tin (`tt`), cụm 18, thanh trừng (cụm 19).

**T21. Tu sĩ cung phụng: "Bổng lộc của triều"**
- *Mở khi:* Trúc Cơ trở lên, triều có quốc sách "thu biên".
- *Chặng:* (1) **Lời mời của sứ triều**; (2) **Nhận chức**: bổng, nhà, nhiệm vụ; (3) **Lệnh khó**: đánh một thôn kháng thuế, dẹp một phái, săn một tà tu; (4) **Lằn ranh phản phệ**: lệnh liên quan tới giết người vô tội, phá long mạch (S 5.2); (5) **Cởi áo triều**: ở lại, rời, hoặc đứng lên chống.
- *Kết cục:* Quốc sư / Kẻ bị nghiệp phản / Kẻ cởi áo triều tự do.
- *Người định mệnh:* Vua hay quyền thần, Tướng, Đồng nghiệp tu sĩ, Tông cũ.
- *Móc:* phản phệ quốc vận, quốc sách, cụm 11, 17.

### 24.4 Mười hai tuyến thế giới mới (W13 đến W24)
Quy ước như mục 12: tiến theo thế giới kể cả khi người chơi không làm gì; mỗi pha có 2 đến 4 móc.
| Tuyến | Mở khi | Pha | Móc cho người chơi | Ghi vào thế giới |
|---|---|---|---|---|
| **W13 Quốc vận suy** | `van` một nước xuống "Suy" | điềm báo → thiên tai và loạn quan → dân biến → mất mệnh hoặc hồi vận | làm lễ cầu vận, tố gian thần, nhờ tông, rời nước | quốc vận, đổi chủ, chia cắt, giá cả, dân tâm |
| **W14 Long mạch bị cắt** | ai đó nhận cắt long mạch (tông thù hay kẻ ngoại) | tin → động đất nhỏ → lộ thủ phạm → hậu quả | điều tra, ngăn, tham gia, tố cáo | `mach`, quốc vận, linh mạch (N), mối thù |
| **W15 Văn cấm** | nho khí giảm đột ngột hoặc đổi chủ nghiêng tà | lệnh cấm → đốt sách → ẩn sách và thầy trò → bung ra hoặc lụi tàn | giấu sách, tố, thi hành, mở trường ẩn | `nho`, thư viện, dân tâm, nhân tài bỏ đi |
| **W16 Vây thành tu sĩ** | một Kim Đan trở lên gây họa phàm hay triều ra lệnh bắt | lệnh bắt → quân trận hợp → giao tranh → thắng thảm hoặc tu sĩ thoát | giúp quân, giúp tu sĩ, chạy tin, đứng xem | quân lực, sát khí, uy danh, thù truyền đời, phản phệ |
| **W17 Chia cắt và thôn tính** | quốc vận Mạt kéo dài | nứt triều → hai phe → nước láng giềng nhúng tay → hợp nhất hoặc tách | chọn phe, chạy loạn, buôn quân nhu, làm sứ | số triều, chư hầu, biên giới, ân oán |
| **W18 Thánh chiến** | hai thế lực khác tín ngưỡng, khoan dung thấp, quan hệ `dao` rất xấu | tuyên cáo → triệu tập tín đồ → chiến tuyến → hòa giải hoặc thảm họa | nhập quân, hòa giải, cứu dân, tố kẻ kích động | chiến tranh, `faith.slots`, thù tôn giáo, tị nạn |
| **W19 Dị giáo và phái mới** | `faith.church.phai` cực đoan hoặc cải cách | tin lạ → tín đồ ly khai → bị đàn áp hoặc được bảo trợ → chia tách hoặc hòa | nghe giảng, che giấu, tố cáo, hòa giải | phái mới, khoan dung, `slots` |
| **W20 Đại điện đổi chủ** | thứ hạng ô 1 đổi ở một vùng | tín đồ đổ về ô mới → tranh chấp đền → chuyển giao hay xung đột | giúp chuyển giao, bảo vệ di vật, tố cướp đền | đại điện, hương hỏa, quan hệ giáo hội |
| **W21 Thanh trừng trong tông** | `on` thấp hoặc đổi chủ tông | tin đồn → lập danh sách → bắt, trục xuất → tông đổi hướng hoặc nứt | tố giác, che chở, chạy, đứng ngoài | `gt`, `nhan`, chính sách, người bỏ đi, M4 |
| **W22 Đại hội liên tông** | chu kỳ 4 hoặc 10 năm, minh chủ hay triều bảo trợ (M5b) | báo danh → vòng loại → chung kết → trao giải và thương lượng ngầm | dự thi, làm trọng tài, buôn tin, cược | uy tín, mỏ, liên minh, ân oán |
| **W23 Đại chiến liên tông** | hai tông thù, không nhượng, quan hệ `tinh` tới Tử thù | tuyên chiến → triều đứng ngoài hay nhúng → trận lớn → diệt, thôn tính, hòa | nhập quân, cứu đệ tử, giữ di vật, tố triều | diệt tông, chư hầu, tàn tích (W6), sổ ân oán |
| **W24 Thiên hạ công ước vỡ** | một tu sĩ cao đánh phàm triều hoặc ngược lại bị triều đánh tu sĩ | vi phạm → liên minh tông + quân → truy → thỏa hiệp hoặc chiến tranh tổng | làm chứng, trốn, truy, hòa giải | công ước, quốc vận, phản phệ, thời đại |
- Mỗi tuyến sống **6 đến 36 tháng thế giới**; tối đa **2 tuyến thế giới mới** cùng chạy ở một vùng (và 2 tuyến thế giới cũ); không để nhịp hỏi vượt 6 lần mỗi phút.
- **Báo:** mỗi pha sinh một tin trên Nhật báo (G), có tin đồn báo trước.

### 24.5 Mười hai cụm chuỗi sự kiện nặng đô (cụm 11 đến 22)
Quy ước như 14.2: các sự kiện nối bằng cờ cụm, cùng trỏ vào một nhân vật định mệnh. Mỗi cụm có **mầm** (sự kiện mở), **dồn ép**, **nút**, **kết**, và **nhánh rẽ**; thường dài **7 đến 10 sự kiện** trong 1 đến 3 thập kỷ.

```
CỤM 11  NGÔI VÀNG VÀ LONG MẠCH  (triều chính, quốc vận; nối T21, W13, W14, W17)
  qg_dieu_van (sao chổi, vận suy) ─> qg_thai_tu (tranh ngôi) ─> qg_quyen_than (chuyên quyền)
     ─> [tông nào đó chống lưng một phe] ─> qg_tong_thao_tung (tông thao túng)
        ├─ phe A thắng ─> qg_dang_quang (đăng quang, tháng ngày yên) ─> qg_phan_phe (phản phệ lên tông)
        ├─ phe B thắng ─> qg_dao_chinh (đảo chính) ─> W17 (chia cắt)
        └─ không phe nào ─> W13 (dân biến) ─> qg_cat_long_mach (có kẻ nhận cắt long mạch)
     ─> qg_ket: vua mới giỏi (vận hồi) | vua yếu (vận tụt) | nước mất mệnh
     Người định mệnh: Thái tử, Quyền thần, Quốc sư (tông), Tướng quân, Người cắt long mạch.
     Ghi: quốc vận, hoàng quyền, mạng quan hệ (tông ↔ triều), phản phệ.

CỤM 12  CỜ TRÊN LƯNG NGỰA  (quân đội; nối T17, W1, W16)
  qg_trung_binh (lệnh nhập ngũ) ─> qg_quan_doanh (kỷ luật và bạn) ─> qg_tran_dau
     ─> [tu sĩ lạ xuất hiện giữa chiến trường] ─> qg_vay_tu_si (quân trận hợp)
        ├─ giúp quân ─> thắng thảm ─> qg_dong_dai (đồng đội chết) ─> qg_thuong_cong
        ├─ giúp tu sĩ ─> bị coi phản ─> truy nã (T7) ─> qg_tha_giet
        └─ đứng xem ─> bị cả hai bên nghi
     ─> qg_do_sat (lệnh đồ sát tù binh) ─> [theo | trái lệnh | báo trên]
     ─> qg_coi_giap: tướng quân | về làng | đào ngũ
     Người định mệnh: Bạn đồng đội, Cấp trên, Tu sĩ bị vây, Người lính bên kia.
     Ghi: sát khí, uy danh quân, nhân vật chết, nhật ký đời (Sổ đời).

CỤM 13  BẢNG VÀNG VÀ LỬA  (nho khí, văn cấm; nối T18, W15)
  qg_khoa_thi (kỳ thi) ─> qg_gian_lan (có kẻ mua đề) ─> qg_bang_vang (đỗ hay hỏng)
     ─> qg_quan_truong (làm quan, tham nhũng, phe phái) ─> qg_van_cam (lệnh đốt sách)
        ├─ nộp sách ─> an toàn, nho tụt ─> nhân tài bỏ nước
        ├─ giấu sách ─> mở trường ẩn ─> qg_thay_tro (mầm nho khí lại lên)
        └─ phản đối công khai ─> bị cách chức ─> thành biểu tượng (qg_bieu_tuong)
     ─> qg_ghi: nho khí hồi | lụi | tà khí trỗi
     Người định mệnh: Thầy đồ, Bạn thi, Quyền thần ra lệnh cấm, Học trò ẩn.
     Ghi: nho khí, thư viện, văn vị, dân tâm, tà khí.

CỤM 14  QUỐC THƯ  (ngoại giao, hôn nhân chính trị; nối T19, W5, W22, W24)
  qg_su_gia (đưa thư) ─> qg_ban_tiec (ăn tiệc, nghe lén) ─> qg_dieu_khoan_kho
     ─> [bên kia xé ước] ─> qg_boi_uoc ─> qg_lam_chung (làm chứng | ém | tố)
     ─> qg_hon_nhan (hôn nhân chính trị để vá) ─> [người thân bạn bị gả | bị trao làm con tin]
     ─> qg_hoa_nghi: hòa | chiến | vỡ lần nữa
     Người định mệnh: Sứ bên kia, Công chúa hay con tin, Tướng muốn đánh, Kẻ mua chuộc.
     Ghi: hiệp ước, `an_oan`, `thong` (thông gia), tin nhật báo.

CỤM 15  NGÔI CHÙA TRÊN ĐỒI  (ô tôn giáo, nơi thờ tự; nối T15, W20)
  tg_truyen_giao (tín ngưỡng mới tới làng) ─> tg_mieu_nho (dựng miếu hay nhà nguyện)
     ─> tg_dan_chuyen (dân đổ về, thứ hạng ô đổi) ─> tg_dai_dien_doi_chu (đại điện đổi chủ)
        ├─ hòa giải ─> hai bên chung đại điện (lồng) hoặc chia sân
        ├─ tranh chấp ─> tg_dap_den (đền bị đóng hay phá) ─> thù tôn giáo (không trở thành thánh chiến nếu khoan dung)
        └─ tông/triều can thiệp ─> nghiêng một bên ─> bất mãn
     ─> tg_ghi: ô mới ổn | bất ổn kéo dài | giáo hội cải cách
     Người định mệnh: Giáo sĩ cũ, Giáo sĩ mới, Trưởng làng, Người thợ dựng đền.
     Ghi: `slots`, `khoan`, hương hỏa, dân tâm.

CỤM 16  TIẾNG CHUÔNG VÀ LƯỠI GƯƠM  (thánh chiến; nối T15, W18)
  tg_phai_cuc_doan (một phái {phai} lớn mạnh) ─> tg_tuyen_cao (tuyên cáo gay gắt)
     ─> tg_trieu_tap (lệnh triệu tập tín đồ) ─> tg_chien_tuyen
        ├─ tham gia ─> chiến công, tội nặng ─> tg_hoi_han
        ├─ hòa giải ─> tg_sieu_do (cứu nạn nhân hai bên) ─> thành người trung gian
        └─ tố kẻ kích động ─> bị cô lập ─> tg_thuc_tinh (cộng đồng nhìn lại)
     ─> tg_ket: hòa nghị | thảm họa | chia ô vĩnh viễn
     Người định mệnh: Giáo sĩ kích động (một phái), Giáo sĩ hòa giải, Người bạn khác đạo, Binh sĩ bên kia.
     Ghi: chiến tranh, `faith.slots`, `an_oan`, tị nạn, kết nối cụm 12.

CỤM 17  QUỐC SƯ  (tông và triều; nối T21, M5b)
  tm_moi_cung_phung (triều mời) ─> tm_nhan_chuc ─> tm_lenh_kho
     ─> [lệnh có phản phệ: giết người vô tội | phá long mạch | đàn áp phái]
        ├─ làm ─> phản phệ ─> tm_chuoc (tế lễ, việc thiện, hoặc trả giá)
        ├─ từ chối ─> mất chức, thù triều ─> tm_vong_ban (bỏ nước)
        └─ làm một nửa ─> lương tâm dày vò, đạo tâm lệch
     ─> tm_thao_tung (tông muốn nâng người lên ngôi) ─> (đi vào cụm 11)
     ─> tm_ket: quốc sư | kẻ cởi áo | kẻ chống triều
     Người định mệnh: Vua hay quyền thần, Tướng, Đồng nghiệp tu sĩ, Chưởng môn.
     Ghi: phản phệ, hiệp ước tông ↔ triều, mạng quan hệ.

CỤM 18  HAI MẶT GƯƠNG  (tình báo, bí mật của tông; nối T20, sổ công–tội)
  tm_moi_mat_cac ─> tm_cai_vao (cài vào tông khác) ─> tm_tin_dau (gửi tin hay giữ)
     ─> [bí mật của tông bị lộ: mỗi tông một bí mật, xem 24.6] ─> tm_lo_bi_mat
        ├─ công bố ─> tông mất uy tín, người vô tội bị vạ
        ├─ giữ ─> bí mật mục ruỗng, kẻ khác biết
        └─ tống tiền ─> giàu và nguy
     ─> tm_bi_nghi ─> tm_lo_dien: về | ở lại | bị giết
     Người định mệnh: Chủ nhân, Người tin bạn, Kẻ nghi ngờ.
     Ghi: `tt`, `an_oan`, nhật báo (tin lộ).

CỤM 19  NỒI NẤU THANH TRỪNG  (nội bộ tông, thanh trừng; nối W21, M4)
  tm_on_giam (`on` thấp) ─> tm_tin_don ─> tm_danh_sach (danh sách "bất tuân")
     ─> tm_bat_bo ─> [bạn nằm trong danh sách | bạn viết danh sách | bạn biết]
        ├─ che chở ─> bị kéo vào ─> trốn
        ├─ tố giác ─> lên chức, nhưng mất bạn
        └─ đứng ngoài ─> bị nghi ngờ lúc sau
     ─> tm_doi_huong: `gt` đổi, `nhan` đổi, chính sách đổi
     ─> tm_ket: tông nứt (ra tông mới) | tông yên nhưng nghèo | tông bền hơn
     Người định mệnh: Chưởng môn, Trưởng lão cải cách, Bạn đồng môn, Chấp pháp.
     Ghi: `gt`, chính sách, thành viên, tông mới (spawn).

CỤM 20  THÀNH BANG VÀ CẢNG  (thương hội theo đô thị thương mại cổ; nối T5, T6, E)
  th_dau_gia_lon (đấu giá lớn ở cảng) ─> th_phong_toa (đường buôn bị chặn, W4)
     ─> th_hoi_dam_phan (hội họp) ─> [hai hội tranh một tuyến]
        ├─ chọn Vạn Bảo (gắn triều) ─> triều bảo hộ, hội kia ghét
        ├─ chọn Thanh Phong (liên minh thành thị) ─> tự do, thiếu quân
        └─ chọn Hắc Kim (cảng ngầm) ─> lợi lớn, rủi ro
     ─> th_chien_tranh_cang (hội chiến cảng) ─> th_hoa (tiền hay quân quyết)
     Người định mệnh: Lãnh đạo hội, Đối thủ hội, Thuyền trưởng, Quan cảng.
     Ghi: hội `infl`, giá, đường buôn, `loi` quan hệ.

CỤM 21  GIA TỘC BỐN ĐỜI  (tài phiệt, thương gia, thế gia học thuật; nối T8, R)
  gtc_thua_ke (người đứng đầu qua đời) ─> gtc_tranh_chap (anh em tranh)
     ─> [kiểu gia tộc: tài phiệt cho triều vay | thương gia mở đường | học thuật dạy nho khí]
        ├─ cho triều vay ─> triều trả bằng đặc quyền ─> gtc_bi_to (thao túng)
        ├─ mở đường ─> gtc_bao_cang ─> thiệt hại hay lợi lớn
        └─ học thuật ─> gtc_ve_thu_vien ─> W15 (văn cấm)
     ─> gtc_hon_ket (hôn nhân với gia tộc khác, R) ─> gtc_ket_noi
     ─> gtc_ket: gia tộc thăng thành thế lực | lụi | tách chi
     Người định mệnh: Tộc trưởng, Anh em, Quan triều, Hội trưởng.
     Ghi: gia tộc `power`, hiệp ước thuế, mạng quan hệ.

CỤM 22  THẦN VÀ HƯƠNG HỎA  (Thần Chức đạo; nối T16)
  tg_loi_cau_dau (làng cầu) ─> tg_dung_mieu (dân lập miếu) ─> tg_nhan_than_vi
     ─> tg_nguyen_vong (mỗi mùa một lời cầu) ─> [hai lời cầu đối nghịch]
        ├─ chọn bên A ─> bên B mất tin
        ├─ giữ cân bằng ─> không ai ứng đủ
        └─ tự đứng ra ─> hương hỏa hao, mê muội
     ─> tg_than_canh_tranh ─> tg_me_muoi (đòi cúng nhiều, hiến tế) ─> [dừng | đi tiếp]
     ─> tg_ket: chính thần | thần ma (bị săn) | giải thoát
     Người định mệnh: Người cầu đầu tiên, Giáo sĩ phụ trách, Thần cạnh tranh, Kẻ lợi dụng miếu.
     Ghi: hương hỏa, dân tâm, quan hệ giáo sĩ, đạo tâm.
```
- **Sợi liên kết:** mỗi cụm có **cờ cụm** (`cum.vang`, `cum.co`, ...) và nhiều sự kiện trỏ vào cùng một nhân vật định mệnh; cụm 11, 17, 19 chồng lên nhau (tông thao túng triều, triều ép tông, tông thanh trừng).
- **Hội tụ:** các cụm 11, 12, 16, 19 là **điểm rơi** của xương sống mốc 5 và 6: người chơi gặp lại mọi ân oán.

### 24.6 Bốn sự kiện nghịch lý của mỗi tông (36 sự kiện, "tình thế khó xử" + "bí mật")
Mỗi sự kiện: tình huống → 3 lựa chọn (có giá) → hệ quả lên `gt`, `nhan`, chỉ số, sổ công–tội. Mở khi bạn là đệ tử của tông, hoặc gần tông, hoặc nghe tin.

**Thanh Vân Tông**
- `tm_tv_1` **Kho sách bị niêm**: Thiên Cơ Các niêm kho sách "bất lợi". Tuân (ổn định, nho khí giảm) | lén sao chép (rủi ro bị tố, ân của người đọc) | tố công khai lên báo (danh, bị truy).
- `tm_tv_2` **Bảng vàng gian lận**: kẻ mua đề trong kỳ thi tuyển. Tố giác (công bằng, cô lập) | im lặng | ăn chia.
- `tm_tv_3` **Làng bị ém tin dịch** *(bí mật)*: Chấp Pháp Đường cấm nói. Báo làng (cứu người, phạm lệnh) | tuân lệnh | tự mang thuốc.
- `tm_tv_4` **Phiếu đồng thuận**: ép đệ tử ký chủ trương mới. Ký | từ chối (bị đẩy ngoại môn) | ký kèm ghi chú.

**Thủy Nguyệt Cung**
- `tm_tn_1` **Kiếm mềm thất truyền**: nghệ nhân già sắp mất, luật cấm truyền ngoại. Học trái luật | tuân | xin ngoại lệ.
- `tm_tn_2` **Đêm cứu nạn**: bão biển, đội cứu hộ thiếu người, đúng ngày lễ. Ra khơi (thương, danh) | giữ lễ | đưa ngư dân vào cung.
- `tm_tn_3` **Phái cải cách bị im**: đệ tử trẻ xin nhận người ngoài. Ủng hộ | can ngăn | tố.
- `tm_tn_4` **Kiệt sức vì kỳ thi**: nhiều người suy sụp. Xin giảm | gánh thay | im lặng.

**Kim Phong Môn**
- `tm_kp_1` **Quy trình hay lương tâm**: lệnh thu hồi kiếm lỗi của dân theo quy trình, tốn dân. Thi hành | làm trái cứu dân | báo trên.
- `tm_kp_2` **Mẻ kiếm chuẩn**: đồng môn gian lận để cứu mẻ. Tố | che | sửa giúp.
- `tm_kp_3` **Hồ sơ niêm kín** *(bí mật)*: tìm thấy hồ sơ bi kịch cũ. Mở | đưa trưởng lão | đốt.
- `tm_kp_4` **Giữ hiệp ước dù thiệt**: giữ | lách | phá.

**Bách Thảo Môn**
- `tm_bt_1` **Bí phương độc quyền**: thảo dân cần phương thuốc đắt. Bán | tiết lộ miễn phí (phạm quy) | đưa vào Y Quán.
- `tm_bt_2` **Dịch bị ém** *(bí mật)*: lộ hồ sơ cũ. Công bố | im | bán.
- `tm_bt_3` **Hai phái tranh cách chữa**: đứng phe | trung lập | thử cả hai (rủi ro).
- `tm_bt_4` **Ranh giới đẳng cấp**: thảo dân giỏi xin vào Đan Các. Tiến cử | từ chối | nhận làm học trò riêng.

**Huyền Băng Cung**
- `tm_hb_1` **Kho hụt** *(bí mật)*: kiểm kho phát hiện thất thoát nhiều đời. Tố (nguy) | sửa sổ | ăn chia.
- `tm_hb_2` **Mùa đông khắc nghiệt**: mở kho cứu dân biên giới | giữ lương | thương lượng với triều.
- `tm_hb_3` **Tiếng nói trái chiều**: trưởng lão phê bình đường lối bị giam. Thăm | ủng hộ công khai | im.
- `tm_hb_4` **Sức mạnh hay thỏa thuận**: sứ tông láng giềng xin đàm phán. Hộ tống | cản | ám sát sứ (tội).

**Liệt Hỏa Tông**
- `tm_lh_1` **Lò nổ che giấu** *(bí mật)*: ô nhiễm. Tố | che | đền bù lặng lẽ.
- `tm_lh_2` **Cuộc đua phát minh**: đồng môn cắp đề tài. Tố | bắt chước | hợp tác.
- `tm_lh_3` **Cứu trợ hay lợi nhuận**: thiên tai. Cứu miễn phí | bán đắt | bán giá vừa.
- `tm_lh_4` **Can thiệp xa**: ra tay vùng khác để bảo vệ thị trường. Đi | ngăn | đòi bồi thường.

**Nhật Luân Giáo**
- `tm_nl_1` **Thiên văn trái giáo lý** *(bí mật)*: phát hiện bị giấu. Công bố | giữ kín | chuyển cho đạo sĩ ngoại.
- `tm_nl_2` **Khách khác đạo xin trú**: đón (hiếu khách) | từ chối theo giáo luật | báo giáo chủ.
- `tm_nl_3` **Giáo chủ muốn cải cách**: tăng lữ phản đối. Ủng hộ | chống | trung lập.
- `tm_nl_4` **Thương lộ bị cướp**: hộ tống | đàm phán | nhờ hãn (Âm Hồn).

**Âm Hồn Giáo** *(nghiêng tối hơn)*
- `tm_ah_1` **Thành kháng cự**: lệnh đồ thành để cảnh cáo. Thi hành (tội nặng) | can ngăn (rủi ro) | trốn.
- `tm_ah_2` **Hồn nô**: bắt hồn từ chiến trường. Nhận | cứu một hồn (bí mật) | báo.
- `tm_ah_3` **Hãn thăng người ngoài theo tài**: nhận ân | ghen | kết thân.
- `tm_ah_4` **Lễ tưởng niệm** *(bí mật)*: giữ hồn không tan. Ở lại giữ lễ | giải thoát hồn (trái giáo) | che giấu.

**Tử Lôi Quan**
- `tm_tl_1` **Luật và lợi** *(bí mật)*: hiệp ước cũ bị bội để lấy lợi. Tố | im | lách luật.
- `tm_tl_2` **Chư hầu bị vơ vét**: giảm cống | ép thêm | đứng về chư hầu.
- `tm_tl_3` **Tranh luận công khai**: nói thẳng | nói khéo | vắng mặt.
- `tm_tl_4` **Bão biển**: cứu tàu thương lộ | giữ trận | nhờ hội.

### 24.7 Sự kiện quốc gia (`qg_`, 18 sự kiện lẻ ngoài các cụm)
- `qg_dieu_van` **Điềm vận suy**: sao chổi. Làm lễ cầu vận | đồn đại | rời nước.
- `qg_thue_chien` **Thuế nặng thời chiến**: thu | giảm | trốn.
- `qg_khoa_hoi` **Khoa thi ba năm**: dự thi | buôn đề | giúp học trò nghèo.
- `qg_cat_long_mach_moi` **Lời mời cắt long mạch**: nhận (tiền, nghiệp) | từ chối | báo triều.
- `qg_phan_phe` **Phản phệ**: bạn ra tay quá tay. Chuộc (tế lễ, việc thiện) | ẩn | lao tới.
- `qg_vay_la` **Quân trận vây một tu sĩ lạ**: xem | giúp tu sĩ | giúp quân.
- `qg_quan_su` **Tướng quân mời làm quân sư**: nhận | từ chối | nhận nhưng đặt điều kiện.
- `qg_tiep_te` **Tiếp tế bị cắt**: mua chợ đen | cướp thương đoàn | xin tông.
- `qg_cung_phung` **Triều mời làm cung phụng**: nhận | từ chối | thương lượng.
- `qg_su_gia_mat` **Sứ giả mất tích**: tìm | im | lợi dụng.
- `qg_hon_nhan_chinh_tri` **Người thân bị gả để vá hiệp ước**: ngăn | chấp nhận | cùng đi.
- `qg_dich_thanh` **Dịch trong thành**: phong tỏa | mở cửa | trộm thuốc.
- `qg_mat_tham` **Mật thám tìm bạn**: nhận | tố | giả mù.
- `qg_ly_gian` **Tin ly gián**: tin đồn hai tông thù nhau; truy nguồn | thổi phồng | dập.
- `qg_van_hoi` **Đại hội văn nhân**: đọc thơ | tranh luận | phản biện quyền thần.
- `qg_thue_cua_ai` **Thuế cửa ải đột ngột**: nộp | lách | tố.
- `qg_bao_vat_trieu` **Bảo vật triều đình mất**: truy | giấu | mua lại.
- `qg_phe_truat` **Vua bị phế**: đứng phe | chạy | giúp vua.

### 24.8 Sự kiện tôn giáo (`tg_`, 18 sự kiện lẻ ngoài các cụm; dùng khe `{tn}`)
- `tg_le_hoi` **Lễ hội mùa lớn ở đại điện**: tham dự (phúc, quan hệ) | bán hàng | đứng ngoài.
- `tg_hanh_huong` **Hành hương**: đi (hao thời gian, được phúc) | cử người thay | bỏ qua.
- `tg_pha_gioi` **Phá giới**: nhận lỗi (mất phúc, giữ cộng đồng) | giấu | rời đạo.
- `tg_tranh_luan` **Tranh luận giáo lý**: tham gia | cổ vũ | can ngăn.
- `tg_truyen_giao_lang` **Người truyền giáo tới làng**: đón | xua | lấy làm chứng.
- `tg_mieu_dong` **Miếu bị đóng**: bảo vệ | phản đối | im.
- `tg_di_giao` **Dị giáo**: nghe | tố | che giấu một người.
- `tg_than_tich` **Thần tích**: tin | nghi | khai thác.
- `tg_cau_mua` **Cầu mưa đại hạn** (W2): tham gia | tổ chức | mua nước.
- `tg_cuu_tro_dich` **Nơi thờ tự cứu dịch** (W3): giúp | khám bệnh | trộm thuốc.
- `tg_hon_nhan_khac_dao` **Hôn nhân khác đạo**: thuyết phục | chấp nhận mỗi người một đạo | bỏ.
- `tg_cai_dao` **Lời mời cải đạo**: nhận | từ chối | giả vờ.
- `tg_thanh_chien_tri` **Triệu tập thánh chiến**: nhập | hòa giải | tị nạn.
- `tg_phai_cai_cach` **Phái cải cách**: theo | chống | đứng giữa.
- `tg_gio_to_tien` **Giỗ tổ tiên và gia tộc**: về dự | gửi tiền | bỏ.
- `tg_khoan_dung` **Hòa giải hai tín ngưỡng**: làm cầu | chọn bên | im.
- `tg_giao_si_tham` **Giáo sĩ tham nhũng hương hỏa**: tố | che | ăn chia.
- `tg_di_vat` **Di vật thánh bị mất**: tìm | giữ | bán.

### 24.9 Sự kiện thương hội và gia tộc (`th_`, `gtc_`, 8 sự kiện lẻ)
- `th_dau_gia` **Đấu giá lớn ở cảng**: tham gia | mua tin | bán hộ.
- `th_phong_toa` **Tuyến bị chặn** (W4): hộ tống | buôn lậu | đàm phán.
- `th_quan_cang` **Quan cảng đòi lót**: lót | tố | đổi cảng.
- `th_tau_dam` **Tàu đắm hàng chìm**: cứu | mua xác | nhận bảo hiểm.
- `gtc_tai_phiet_vay` **Tài phiệt cho triều vay**: làm chứng | tố | hưởng lợi.
- `gtc_thuong_gia_hon` **Thương gia gả con để mở đường**: ủng hộ | can | trốn.
- `gtc_thu_vien_gia` **Thế gia giữ thư viện**: giúp giữ | mượn | đốt khi cấm.
- `gtc_chia_chi` **Gia tộc tách chi**: về phe nào.

### 24.10 Khối lượng, nhịp, kỹ thuật
- **Khối lượng nội dung thêm:** T15 đến T21: 7 tuyến x 5 chặng = 35 chặng gốc, cộng biến thể từ bảng giao nhau khoảng 28; W13 đến W24: 12 tuyến x (4 pha + 3 móc) = 84; sự kiện: 36 (tông) + 18 (quốc gia) + 18 (tôn giáo) + 8 (hội, gia tộc) = 80; cụm chuỗi 12 cụm x ~8 sự kiện = ~96 (một phần trùng với các sự kiện lẻ). Tổng **khoảng 260 chặng/sự kiện**; đợt đầu chọn khoảng **70**.
- **Đợt đầu đề xuất để chơi thử:** T15 (Giáo sĩ), T17 (Võ quan), T18 (Nho sĩ); W13, W16, W18, W20; cụm 11, 12, 15; 12 sự kiện nghịch lý (bốn tông: Thanh Vân, Kim Phong, Liệt Hỏa, Âm Hồn); T16 (Thần Chức), T19 đến T21 và các cụm còn lại làm sau.
- **Bảng giao nhau (mục 13.5) mở rộng:** W13 gõ cửa T17, T18, T19, T21; W16 gõ T17, T21, T7, T1; W18 gõ T15, T17, T19, T6; W20 gõ T15, T16, T2; W21 gõ T2, T20, T7; W22 gõ T2, T19, T5.
- **Nhịp:** các sự kiện lẻ của hệ này chỉ bốc khi điều kiện hệ thật xảy ra (không ngẫu nhiên đơn); tối đa 1 chặng nóng, hàng đợi 3; mọi chặng có hạn; bám ngân sách K của mục 14.4.
- **Kỹ thuật:** dữ liệu tại `js/data/natevents.js` (cùng định dạng chặng mục 10), nhân vật định mệnh dùng chung dàn 8 vai (mục 13.3), cờ cụm lưu trong `c.story`; mọi trường khởi tạo muộn, không đổi `TT.VERSION`. Điều kiện mở dựa trên cơ chế S (quốc vận, `gt`, `slots`, `huong`), nên **Q10 phải làm sau S3 đến S5**.
- **Rủi ro:** nội dung tôn giáo dễ nhạy cảm: dùng khe `{tn}`, viết cho cả hai phía, kẻ cực đoan là cá nhân/phái, cho bạn duyệt chữ từng biến thể; nội dung tàn khốc (đồ sát, hiến tế) kể gián tiếp, có chế độ truyện nhẹ (mục 20).
