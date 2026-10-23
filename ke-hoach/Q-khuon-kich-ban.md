# Q-khuôn kịch bản. Khuôn xương sống theo khuyết điểm (cho AI sinh kịch bản cụ thể lúc chơi)

- Trạng thái: **Khuôn mẫu đầu tiên ("kiêu hãnh") chờ bạn duyệt** (2026-10-23). Tám khuôn còn lại viết theo đúng định dạng này (K3).
- Dùng bởi: bộ máy kịch bản (K1) và lớp AI lúc chơi (AI1, Z mục 7d). Ở mốc A1, Sonnet nhận **khuôn + trạng thái thật của đời** và sinh **bảng một trang cụ thể**; khi mở mỗi phần, Sonnet viết 4 chặng của phần theo khuôn và theo những gì đã xảy ra.
- Luật kể chuyện: [Q-giong-truyen](Q-giong-truyen.md) (bản 13). Khuôn **không** chứa chữ truyện; chữ do AI viết theo cẩm nang và bộ cảnh chuẩn.

---

## 0. Thư viện kiểu lựa chọn (dùng chung cho mọi khuôn)
Mỗi cao trào chọn **2 đến 3 kiểu** từ bảng này. Cơ chế của kiểu là **cố định** (bộ máy áp); AI chỉ viết nhãn và `mat` cho đúng kiểu.

| Kiểu | Nghĩa | Cơ chế mặc định (bộ máy) |
|---|---|---|
| `phuc_tung` | làm theo, chịu nhục để đạt điều cần | đạt mục tiêu trước mắt; danh −; cờ `nhuc_<phan>`; trục ngược khuyết điểm +1 (bắt đầu đổi) |
| `chong` | chống lại trực diện | vòng quay chiến đấu (yếu tố: tu vi so với đối phương); thua: thương tật hoặc mất người; thắng: phản diện trả đòn ở phần sau |
| `dao_thoat` | bỏ chạy, trốn, mang người đi | `tong.truy` hoặc rời nơi chốn; người ở lại chịu thay (`no`) |
| `hy_sinh` | đổi thứ mình quý lấy người khác | mất tu vi, vật, ghế hoặc công pháp (`tong`, `vat`, xp lớn); gắn bó với người được cứu + nhiều |
| `duong_tat` | nhanh, bất lương | đạt ngay; nghiệp +, `no`, `tre.chang` **chắc chắn** đòi ở phần sau; bị gọi tên nếu có cờ `khinh_*` |
| `im_lang` | không làm gì, giữ hòa khí | không mất gì ngay; `no` với người chịu hậu quả; cờ cho chặng gặt |
| `tin` | đặt niềm tin vào một người | gắn bó +; có cờ rủi ro: người ấy có thể là tay trong (nếu khuôn có phương án lật ấy) |
| `dung_khuyet_diem` | hành xử đúng khuyết điểm gốc | thuận tay (không phí trái tính), nhưng đẩy khuyết điểm sâu thêm; tiến gần kết cục "đọa" |
| `tam_ma` 🜏 | lựa chọn của tâm ma | chỉ hiện khi đạo tâm thấp hoặc tâm ma nặng; giống `duong_tat` nhưng tàn bạo hơn, không báo hết giá |

Mỗi cao trào **phải có** ít nhất một kiểu đi ngược khuyết điểm (có giá thật) và một kiểu `dung_khuyet_diem`.

## 1. Định dạng một khuôn
```
khuon {
  id, khuyet_diem (đầu trục), cau_hoi_trung_tam,
  bay_manh: { vet_thuong: [2 đến 3 phương án theo xuất thân], loi_noi_doi, muon: [phương án], can, bong_toi (kiểu + cách chọn vai), guong (kiểu + cách chọn vai), hy_sinh },
  dan: { chức năng → vai trong dàn (su, doi_thu, huynh, thuong, than_nhan, ban, ke_thu, ke_thua) },
  soi: { chinh: { người, vật: [phương án] }, phu: [ tối đa 2 ] },
  noi: [1 đến 2 loại địa điểm, lấy từ mô phỏng],
  thang_suc_manh: cách quy "đỉnh" theo cảnh giới thật của người chơi,
  phan: [6 × { chuc_nang, tuoi (khoảng, hoặc theo cảnh giới), cau_hoi, kieu_cao_trao: [kiểu lựa chọn], cai_mat (loại), thang_vui, treo, manh_moi: [chỗ cài cho từng phương án lật] }],
  lat: [2 đến 3 phương án: { kieu, phan_no, manh_moi: [≥ 3, phần cài] }],
  khong_ke_ac: phần nào có cao trào không có kẻ ác,
  ket: { toan_ven, doa, co_doc: điều kiện từ chuỗi lựa chọn }
}
```

---

## 2. Khuôn "Kiêu hãnh" (Xử thế âm: cương trực đến kiêu ngạo)

### 2.1 Lõi
- **Câu hỏi trung tâm:** Giá trị của một người nằm ở thứ hắn có, hay ở cách hắn đối xử với kẻ không có gì?
- **Thuốc:** sỉ nhục. **Điều cần học:** khiêm nhường (biết mình là ai khi mất hết), rồi hy sinh.

### 2.2 Bảy mảnh
| Mảnh | Nội dung khuôn | Phương án (AI chọn theo xuất thân, dàn, vùng) |
|---|---|---|
| Vết thương | một lần bị hạ nhục vì yếu hoặc nghèo, không ai bênh | (a) nhà nông: bị con nhà giàu bắt quỳ trước cổng học đường; (b) cô nhi: bị đánh vì ăn cắp một cái bánh mà mình không lấy; (c) con nhà buôn sa sút: cha bị chủ nợ tát trước mặt mình |
| Lời nói dối | "Chỉ kẻ mạnh mới không bị giẫm." | |
| Muốn | đứng trên tất cả, không bao giờ phải cúi đầu | (a) thành đệ nhất đệ tử rồi chân truyền kế vị của tông; (b) đứng đầu bảng thiên kiêu của vùng; (c) (nếu không vào tông) thành tán tu không ai dám động tới |
| Cần | khiêm nhường; thấy giá trị của người không có gì | |
| Bóng tối | **kẻ bạn từng giẫm lên, đã học cách giẫm từ chính bạn** và giờ giẫm bạn | vai `ke_thu` (mở ở phần 1), thường dựng từ một tạp dịch, đệ tử ngoại môn nghèo hoặc người hầu cùng nơi |
| Gương đối lập | người khiêm nhường đến mức tự hạ mình, thương bạn | vai `thuong` hoặc `huynh` |
| Hy sinh | danh, kiếm tâm (công pháp chính), có thể cả mạng | |

### 2.3 Dàn, sợi, nơi
- **Dàn:** `ke_thu` = bóng tối; `thuong` (hoặc `huynh`) = gương; `su` = người thầy chỉ coi trọng kẻ thắng (có thể là kẻ đứng sau, xem phương án lật a); `doi_thu` = đối thủ ngang tài ở phần 2; `than_nhan` = người gắn với vết thương; `ban` = người ở quê, nhớ bạn khi còn chưa kiêu.
- **Sợi chính:** bạn và `ke_thu`. **Vật:** (a) chiếc bát sứ mẻ; (b) chiếc dép rơm bị giẫm bẹp; (c) đồng xu bạn ném cho hắn.
- **Sợi phụ:** `thuong` (vật: dải lụa buộc chuôi kiếm, hoặc chiếc lược gỗ); `su` (vật: thanh kiếm gỗ đầu tiên thầy đưa).
- **Nơi:** tông hoặc học đường của người chơi (sân luyện, Hình đường hoặc nơi xử phạt), một nơi cấm (Kiếm trủng, cấm địa, mộ cổ) trong vùng.

### 2.4 Thang sức mạnh và nhịp đời (luật 26; số liệu từ `js/data/realms.js`, bạn nhắc 2026-10-23)
**Nhịp thật của thế giới:** người bình thường khoảng **50 tuổi mới vào Luyện Khí**, khoảng **130 tuổi mới Trúc Cơ**; thọ nguyên **phàm nhân 70, Luyện Khí 130, Trúc Cơ 260, Kim Đan 520**. Hệ quả cho kịch bản:
- **Gần nửa đời đầu là phàm nhân** (12 đến 50): ngoại môn, tạp dịch, học đường, trấn; cao trào ở đây là chuyện của người phàm có giấc mơ tu tiên.
- **Người phàm trong dàn chết già khi bạn khoảng 50 đến 70** (cha mẹ sớm hơn): cao trào "không có kẻ ác" tự nhiên rơi vào khoảng này.
- **Trúc Cơ là cuộc chạy đua với cái chết**: thọ Luyện Khí là 130, đúng lúc người thường mới chạm Trúc Cơ; phần cuối luôn có **đồng hồ thọ nguyên** (đột phá hay chết) gắn vào kịch bản.
- "Đỉnh" luôn **tương đối với cảnh giới thật lúc ấy**: phàm nhân → đứng đầu ngoại môn, học đường, trấn; Luyện Khí sơ, trung kỳ → đệ tử nội môn có tiếng; Luyện Khí hậu kỳ → đệ nhất nội môn, chân truyền; Trúc Cơ → trưởng lão, người đứng đầu một vùng nhỏ; Kim Đan → huyền thoại.
- `ke_thu` luôn **cao hơn người chơi đúng một bậc** (một giai đoạn hoặc một cảnh giới) ở phần 5, không hơn.

### 2.5 Sáu phần (tuổi theo nhịp thật ở 2.4; mỗi phần mở theo "cảnh giới HOẶC tuổi", cái nào đến trước)
| Phần | Chức năng | Mở khi | Câu hỏi | Kiểu cao trào | Cái mất (loại) | Thắng hoặc vui | Treo |
|---|---|---|---|---|---|---|---|
| 1. Bậc thang | biến cố khởi đầu; lời nói dối có lợi | 12 tuổi (phàm, ngoại môn hoặc học đường) | Bạn có leo lên được không? | **Sỉ nhục kẻ yếu trước đám đông**: `dung_khuyet_diem` (bắt hắn làm điều nhục) / `hy_sinh` nhỏ (tha, mất mặt) / `chong` với người bênh hắn | danh của kẻ yếu; mầm thù | lần đầu đứng đầu kỳ khảo hạch ngoại môn; cả phòng cõng bạn về | `ke_thu` nhặt lại vật |
| 2. Ngôi đầu | đối thủ ngang tài; gương xuất hiện; chạy đua vào Luyện Khí | 30 tuổi | Ai xứng đứng đầu? | **Trận tranh suất nhập nội môn với người thương bạn** (chỉ một suất): đòn hiểm (`duong_tat`) / nhường (`hy_sinh`) / bỏ trận (`dao_thoat`) | suất nội môn, hoặc lòng tin của gương | đêm hai người ngồi mài kiếm chung | `ke_thu` đã vào Luyện Khí trước bạn (không ai rõ bằng cách nào) |
| 3. Cấm địa | đổi gì để không bao giờ thua; người phàm trong dàn bắt đầu chết già | Luyện Khí hoặc 55 tuổi | Bạn đổi gì để không bao giờ thua? | **Đêm ở nơi cấm**: học cấm thuật (`duong_tat`) / từ chối và thua trận lớn của tông (`hy_sinh`) / để gương đi thay (`im_lang`) | tuổi thọ, danh, hoặc gương | thắng trận tông chiến (nếu học), cả tông mở tiệc | gương giấu một điều |
| 4. Đỉnh *(chiến thắng giả)* | lên đỉnh; cấm thuật phản phệ | Luyện Khí hậu kỳ hoặc 85 tuổi | Đứng trên đỉnh thì thấy gì? | **Đại điển phong chân truyền**: phản phệ giữa đại điển (bộ máy ép); chọn: giấu bằng mọi giá (`duong_tat`) / thú nhận trước toàn tông (`phuc_tung`) / đổ cho người khác (`tam_ma` 🜏) | đan điền, ghế, hoặc lương tâm | sáng hôm đại điển, `ban` (đã già) gửi lên một gói quà | `ke_thu` là người duy nhất không bất ngờ |
| 5. Bát cơm thừa | tất cả đã mất; đảo vai | 100 tuổi | Bạn còn gì khi không còn gì? | **Cảnh chuẩn số 1** (bản bạn viết): `phuc_tung` (liếm) / `chong` (cướp) / `hy_sinh` (đứng thẳng, xin hắn giết mình thay) | gương, hoặc phần còn lại của sĩ diện | (không có; phần tối nhất) | thế lực ngoài vây tông |
| 6. Trận cuối | kẻ mất hết cho đi được gì; **đồng hồ thọ nguyên** | 115 tuổi (hoặc thọ còn 15%) | Kẻ đã mất hết còn cho đi được gì? | **`ke_thu` giữ trận và sắp chết**: cứu kẻ đã hành hạ bạn bằng chút tu vi cuối, mất cơ hội Trúc Cơ (`hy_sinh`) / để hắn chết (`im_lang`) / giành lấy trận và danh (`dung_khuyet_diem`) | (kết cục) | đệ tử nhỏ nhất của tông nhận ra bạn và cúi chào | (kết đời; nếu người chơi vẫn Trúc Cơ được thì sang **phần hậu truyện** 130 đến 260 tuổi, viết sau) |

- **Cao trào không có kẻ ác** (bắt buộc một lần mỗi đời): **phần 3** là chỗ tự nhiên (người phàm trong dàn chết già khi bạn 50 đến 70), ví dụ "Người cũ ở quê không nhận ra bạn" (mẫu "Viên Diên Thọ Đan"); nếu `ban` hoặc `than_nhan` đã chết sớm thì dời sang phần khác.
- **Tâm ma 🜏**: phần 4 (đổ tội cho người khác) và phần 5 (lựa chọn giết `ke_thu` trong đêm), chỉ khi đạo tâm thấp.

### 2.6 Ba phương án lật (bốc một mỗi đời; nổ ở phần 4 hoặc 5)
| Phương án | Kiểu | Phần nổ | Manh mối (≥ 3, phần cài) |
|---|---|---|---|
| (a) **Người thầy tạo ra cả hai**: `su` cố ý để bạn sỉ nhục `ke_thu` năm ấy để rèn hắn thành thanh kiếm thứ hai của tông; bạn chỉ là đá mài | kẻ đứng sau kẻ đứng sau | 5 | P1: `su` có mặt ở sân hôm sỉ nhục mà không ngăn; P2: `ke_thu` được nhận vào nơi tốt dù không đủ tư chất; P3: vật của gương do `su` tặng |
| (b) **Gương đưa cấm thuật cho bạn**: `thuong` biết bạn không bao giờ chịu thua, thà để bạn mạnh mà chết sớm còn hơn sống mà nhục | đồng minh là tay trong (vì thương) | 4 | P2: nàng biết đường vào nơi cấm; P3: nàng khóc trước khi bạn thắng, không phải sau; P3: vật của nàng có mùi nhang của nơi cấm |
| (c) **Chính bạn là thủ phạm**: kẻ hạ nhục bạn trong vết thương tuổi thơ đã chết vì một câu nói đùa của bạn lan khắp làng; `ke_thu` là em trai người ấy, vào tông để tìm bạn | chính bạn là thủ phạm | 5 | P1: `ke_thu` biết tên làng bạn; P2: hắn hỏi bạn còn nhớ cổng học đường không; P4: vật của sợi chính có khắc chữ của làng ấy |

### 2.7 Kết cục
| Kết | Điều kiện (từ chuỗi lựa chọn) | Hình ảnh khép lại (đối lập hình ảnh mở đầu) |
|---|---|---|
| **Toàn vẹn** | ≥ 3 lựa chọn đi ngược khuyết điểm có giá ở phần 3 đến 6, trong đó phần 6 là `hy_sinh` | bạn, không còn tu vi, rửa chiếc bát mẻ rồi đặt lên bàn thờ của `ke_thu` |
| **Đọa** | phần 4 và 6 đều `dung_khuyet_diem` hoặc `tam_ma` | bạn ngồi ghế cao nhất, một tạp dịch quỳ lau sàn dưới chân, và bạn không nhìn xuống |
| **Cô độc** | còn lại | bạn sống, đứng đầu một tông trống; không ai còn nhớ bạn từng bị ai giẫm, hay từng giẫm ai |

### 2.8 Lời dặn cho AI khi cụ thể hóa khuôn này
- Chọn phương án vết thương, muốn, vật, lật **theo xuất thân và dàn thật**; ghi lý do một dòng.
- Đặt tên tông, nơi, thế lực **chỉ từ danh sách mô phỏng gửi kèm**.
- `ke_thu` phải được **ra mắt ở phần 1** bằng một hành động, một câu thoại, một đặc điểm; phải **có mặt ở mọi phần** sau.
- Ngôn từ "đỉnh", "đệ nhất", "huyền thoại" theo thang 2.4.
- Bảng một trang cụ thể phải qua story-lint (24 chặng, ≤ 25 cờ, đủ manh mối cho phương án lật đã bốc, đủ kiểu lựa chọn theo bảng 2.5).
