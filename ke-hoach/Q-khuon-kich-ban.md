# Q-khuôn kịch bản. Khuôn xương sống theo khuyết điểm (cho AI sinh kịch bản cụ thể lúc chơi)

- Trạng thái: **Đủ chín khuôn** (kiêu hãnh 2026-10-23, tám khuôn còn lại 2026-10-25), chờ bạn duyệt; việc còn lại của K3 chỉ là chuyển tám khuôn mục 3 đến 10 thành dữ liệu.
- **Đã chép thành dữ liệu (AI1a, 2026-10-23)**: khuôn "kiêu hãnh" ở `js/data/khuon/kieu_hanh.js` (kèm dòng dự phòng 2 đến 3 câu cho cả 24 chặng), thư viện kiểu ở `D.STORY.kieu`, bộ cụ thể hóa ở `js/systems/khuon.js`; định dạng dữ liệu chi tiết xem Z mục 7d "AI1a đã làm". Mục 1 dưới đây là định dạng gốc; bản dữ liệu thêm `bien` (biến thể chặng theo cờ), `ep`, `lc` của móc/leo/treo và `kieu_cao_trao` có nhãn `vt` (nguoc, dkd, khac).
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

---

## Quy ước chung cho tám khuôn dưới đây (viết 2026-10-25)
- **Mở phần** theo bảng chung của mục 2.5: phần 1 lúc 12 tuổi; phần 2 lúc 30; phần 3 Luyện Khí hoặc 55; phần 4 Luyện Khí hậu kỳ hoặc 85; phần 5 lúc 100; phần 6 lúc 115 hoặc thọ còn 15% (**đồng hồ thọ nguyên**). Thang sức mạnh theo 2.4.
- Phần 4 luôn là **chiến thắng giả**, phần 5 là **tất cả đã mất**, phần 6 là **trận cuối** có đồng hồ thọ nguyên.
- Kiểu lựa chọn ghi trong ngoặc theo thư viện mục 0; "ngược" là lựa chọn đi ngược khuyết điểm có giá thật.
- Ba phương án lật, mỗi phương án ≥ 3 manh mối; P1 đến P6 là phần cài manh mối.
- Kết cục **toàn vẹn** cần ≥ 3 lựa chọn ngược có giá ở phần 3 đến 6, trong đó phần 6 là `hy_sinh`; **đọa** khi phần 4 và phần 6 đều `dung_khuyet_diem` hoặc `tam_ma`; còn lại là **cô độc**.
- Con cái chưa có (9C hoãn): vai "con" dùng **người kế thừa** (`ke_thua`: đứa trẻ bạn nhận nuôi hoặc đệ tử nhỏ).

---

## 3. Khuôn "Tàn nhẫn" (Đạo đức âm)
- **Câu hỏi trung tâm:** Mạng người khác đáng giá bao nhiêu khi đặt cạnh con đường của mình? **Thuốc:** vị tha.
- **Vết thương:** (a) năm đói, cả nhà chết vì nhà bên giấu gạo; (b) cô nhi bị bỏ lại giữa đường khi phát bệnh, sống nhờ cướp; (c) cha bị bạn thân lừa hết gia sản rồi treo cổ.
- **Lời nói dối:** "Thế gian ăn thịt người; ta ăn trước thì ta sống." **Muốn:** mạnh tới mức không ai lấy được gì của mình. **Cần:** thấy người khác là người.
- **Bóng tối:** Huyết Thủ lão tổ (`su`), người dạy bạn ma công, đã "ăn" hết mọi thứ kể cả đồ đệ cũ; lý lẽ: "Kẻ yếu đằng nào cũng chết, chết cho kẻ mạnh thì còn có ích." **Gương:** A Liên (`ke_thua`), đứa trẻ sống sót từ việc ác của chính bạn, ngây thơ, ở cạnh bạn. **Hy sinh:** ma công, tu vi, mạng.
- **Sợi chính:** bạn và A Liên (vật: **chiếc lược bạc** của mẹ nàng nhặt từ thôn cháy). **Phụ:** lão tổ (vật: con dao tế); `ke_thu` là con của một nạn nhân khác. **Nơi:** động phủ ma tu; thôn Thạch Khê (tên khe từ mô phỏng).

| Phần | Câu hỏi | Cao trào (kiểu) | Thắng hoặc vui | Treo |
|---|---|---|---|---|
| 1. Miếng ăn | Bạn sống bằng gì? | **Miếng ăn cuối**: giật bánh của đứa nhỏ hơn (`dung_khuyet_diem`) / chia đôi (ngược, `hy_sinh`) / bỏ chạy (`dao_thoat`) | lần đầu no bụng | lão tổ đứng xa nhìn |
| 2. Bái sư | Bạn trả gì để mạnh? | **Bài nhập môn: giết một người lạ** (`duong_tat`) / giết thú thay và nói dối thầy (`im_lang`, bị phát hiện ở P3) / bỏ đi (`dao_thoat`) | ma công tiến vọt | lão tổ: "Lò cần ba trăm." |
| 3. Thạch Khê | Ba trăm mạng đổi một cảnh giới? | **Đêm Thạch Khê**: đồ sát (`dung_khuyet_diem`) / dừng ở cổng thôn, chịu phạt (ngược, `hy_sinh`) / tha một nửa (`im_lang`) ; mọi nhánh đều nhặt A Liên về | (nếu làm) Luyện Khí tiến vọt | A Liên gọi bạn là "ân nhân" |
| 4. Mười năm trà *(chiến thắng giả)* | Kẻ mạnh có còn ai không? | **Người con của Thạch Khê** tìm tới báo thù trước mặt A Liên: giết hắn (`dung_khuyet_diem`) / để hắn đánh mình (ngược) / nói dối A Liên (`im_lang`) | A Liên pha chén trà ngon nhất | lão tổ tới đòi phần |
| 5. Vật tế | Thêm một người thì khác gì? | **Cảnh chuẩn "Vật tế thứ ba trăm lẻ một"**: cầm dao (`tam_ma` hoặc `dung_khuyet_diem`) / tự kể cho nàng trước (ngược, `phuc_tung`) / lao vào lão (`chong`); nhịp 2 như mẫu | (không) | thôn Thạch Khê được người sống sót dựng lại |
| 6. Ba trăm cái tên | Kẻ đã giết ba trăm người còn cứu được ai? | **Đệ tử mới của lão tổ** (một đứa trẻ đói như bạn năm xưa) tới đốt thôn mới: chặn hắn bằng tu vi cuối (`hy_sinh`) / dạy hắn ma công đổi lấy làng (`duong_tat`) / giết hắn (`dung_khuyet_diem`) | một đứa trẻ trong thôn mời bạn bát cháo | (kết) |
- **Không kẻ ác:** mở phần 6: A Liên (phàm, nay sáu mươi mấy tuổi) già yếu; **chén trà cuối** nàng pha cho bạn. **Tâm ma 🜏:** P3, P5.
- **Lật:** (a) **Chính bạn là thủ phạm**: Thạch Khê là làng cũ của mẹ bạn, mẹ còn sống trong đêm ấy (P1: mẹ hát một bài ru; P3: cây đa đầu thôn có vết khắc tên bạn hồi nhỏ, bạn không thấy trong đêm; P4: A Liên hát đúng bài ru ấy). (b) **A Liên biết từ đầu**, ở lại để chờ ngày giết bạn, rồi không nỡ (P3: nàng giữ chiếc lược mà không hỏi; P4: nàng học pha một vị trà đắng lạ; P4: nàng hỏi về "đêm cháy" rồi im). (c) **Lão tổ là cha ruột bạn**, bỏ rơi bạn cho đói để rèn ra một kẻ như mình (P1: người lạ bỏ lại một túi gạo rồi đi; P2: lão biết tên tục của bạn; P3: con dao tế khắc họ của bạn).
- **Kết:** toàn vẹn: bạn, tu vi tan hết, quét lá ở thôn Thạch Khê mới, trẻ con không biết bạn là ai. Đọa: bạn ngồi chỗ lão tổ, một đứa trẻ đói quỳ trước lò đan. Cô độc: chén trà nguội, không còn ai pha.

## 4. Khuôn "Nhân hậu" (Đạo đức dương, mềm yếu)
Rút gọn từ dàn cảnh Thanh Khê bản 2 (Q-giong-truyen 4b) theo ngân sách 6e.
- **Câu hỏi trung tâm:** Có nên im lặng trước cái ác để giữ cho nhiều người được yên? **Thuốc:** trách nhiệm.
- **Vết thương:** (a) năm đói nhường gạo cho em, em vẫn chết, mẹ bảo "con không có lỗi gì"; (b) cô nhi: bà lão cho ăn nhờ, khi bà chết vì bệnh, người làng bảo "không phải lỗi của mày"; (c) cha tha nợ cho người nghèo đến phá sản, mẹ vẫn bảo cha là người tốt.
- **Lời nói dối:** "Không làm ai đau thì mình không có lỗi." **Muốn:** học y ở nội môn để chữa bệnh phổi cho mẹ và cứu thôn. **Cần:** trách nhiệm (im lặng cũng là một lựa chọn).
- **Bóng tối:** trưởng lão Hà (`su`): người hiền nhất tông, ba mươi năm ký danh sách đệ tử nghèo nộp cho thế lực mạnh kề bên làm lò đỉnh để tông không bị thôn tính. **Gương:** Tần Diệp (`doi_thu`): công lý không có lòng thương. **Hy sinh:** nội môn, người thầy, công pháp thầy dạy.
- **Sợi chính:** bạn và trưởng lão Hà (vật: **cây bút son**). **Phụ:** Lục Tam (`huynh`; vật: tấm chăn dày, ước thấy biển); cháu gái Hà (`thuong`). **Nơi:** sơn môn (ngoại môn, thư phòng, sân đại hội); thôn dưới núi.

| Phần | Câu hỏi | Cao trào (kiểu) | Thắng hoặc vui | Treo |
|---|---|---|---|---|
| 1. Chiếc chăn | Tin ai? | **Mảnh giấy "cứu"** trong đôi giày bỏ quên: đưa thầy (`tin`) / giấu đi (`im_lang`) / đưa Tần Diệp (ngược) | Hà bỏ tiền mua thuốc cho mẹ bạn; Tết cả phòng | thầy cất mảnh giấy |
| 2. Danh sách | Nói hay im? | **Đêm trước ngày lên nội môn** (mẫu 6): viết thư (`im_lang`) / kể cho Lục Tam (ngược) / trốn cùng hắn (`dao_thoat`) | trị được dịch cho nửa thôn (thử thách) | Lục Tam không về |
| 3. Nhân chứng | Cứu ai? | **Phiên chấp pháp**: làm chứng (ngược) / im (`dung_khuyet_diem`) / nói nửa (`im_lang`) | đêm vò rượu với Tần Diệp | gói di vật về thôn |
| 4. Bút son *(chiến thắng giả)* | Làm gì khi có quyền? | **Tờ danh sách đầu tiên của bạn**: ký (`dung_khuyet_diem`) / ký nhưng đổi tên (`duong_tat`) / không ký (ngược) | đám cưới với cháu gái Hà | thế lực ngoài đòi gấp đôi |
| 5. Đại hội | Bỏ gì? | **Cảnh chuẩn: "Quỳ xuống nhặt lên và ký đi"**: ký (`phuc_tung`) / đọc to danh sách ba mươi năm (ngược) / rút kiếm (`chong`); nhịp 2 cướp lại mẹ | (không) | sơn môn vỡ, hoặc bạn ngồi ghế Hà |
| 6. Biển | Đánh hay không? | **Trận cuối** giữ thôn: bằng tu vi cuối (`hy_sinh`) / đem tông mới ra đối diện (`chong`) / ký thêm danh sách (`dung_khuyet_diem`) | đệ tử đầu tiên của tông mới | (kết) |
- **Không kẻ ác:** móc phần 3: mẹ mất (thọ), lời cuối "con không có lỗi gì". **Tâm ma 🜏:** P4 (đổi tên đứa trẻ bằng tên Tần Diệp), P5.
- **Lật:** (a) **Người thầy hiền là kẻ ký** (mặc định; P1 thầy cất mảnh giấy; P2 son của thầy trên danh sách nhưng nét mờ; P3 thầy ngồi hàng đầu phiên chấp pháp không nói gì). (b) **Lục Tam đã biết và tự đi thay em trai mình** (P1 hắn hỏi "lên nội môn có được gửi thư không"; P2 hắn nhờ bạn viết thư nhưng không ký tên mình; P3 em trai hắn xuất hiện ở thôn). (c) **Chính bạn là thủ phạm**: người viết mảnh giấy "cứu" là anh trai Tần Diệp; bạn đưa thầy, và hắn biến mất ngay đêm ấy (P1 nét chữ mảnh giấy; P2 Tần Diệp hỏi bạn có thấy anh hắn không; P3 Tần Diệp nhìn đôi giày bạn cất).
- **Kết:** toàn vẹn: bạn đưa tấm chăn ra biển. Đọa: bạn xoa đầu một đệ tử trẻ, "đừng làm lớn chuyện". Cô độc: bạn sống, không còn ai để đưa ra biển.

## 5. Khuôn "Nóng nảy" (Tính tình âm)
- **Câu hỏi trung tâm:** Sức mạnh nằm ở cú đánh, hay ở lúc dừng tay? **Thuốc:** nhẫn.
- **Vết thương:** (a) cha nóng nảy, bạn học được rằng kẻ đánh trước là kẻ được yên; (b) cô nhi bị bắt nạt tới khi đánh trả mới được để yên; (c) cha là thợ rèn nhịn bọn thu thuế tới mất cả lò, rồi chết trong nhục.
- **Lời nói dối:** "Ai đánh trước, kẻ đó không bị đánh." **Muốn:** không ai dám coi thường bạn và em gái. **Cần:** nhẫn.
- **Bóng tối:** Triệu Liệt (`ke_thu`): kẻ để cơn giận đốt cả một đời, anh trai của người bạn từng đánh phế. **Gương:** lão Mộc (`su`), thợ đẽo gỗ ẩn thân, điềm tĩnh tới mức bị cho là hèn. **Hy sinh:** đan điền, danh "Liệt Quyền".
- **Sợi chính:** bạn và Triệu Liệt (vật: **cây sáo trúc** của Triệu Kỳ, em hắn). **Phụ:** Tiểu Đào (`than_nhan`, em gái; vật: sợi dây buộc tóc đỏ); lão Mộc (vật: cái đục gỗ). **Nơi:** võ trường của tông; làng của Tiểu Đào.

| Phần | Câu hỏi | Cao trào (kiểu) | Thắng hoặc vui | Treo |
|---|---|---|---|---|
| 1. Nắm đấm | Bảo vệ hay hả giận? | **Kẻ bắt nạt Tiểu Đào**: đánh đến khi hắn không dậy (`dung_khuyet_diem`) / dừng ở cú đầu (ngược, bị cười là hèn) / gọi người lớn (`im_lang`) | Tiểu Đào cười, buộc dây tóc đỏ lên tay bạn | thằng bé bị đánh không về nhà |
| 2. Một câu khích | Thắng một trận đáng giá gì? | **Đấu trường**: Triệu Kỳ khích; đánh vỡ đan điền hắn (`dung_khuyet_diem`) / dừng ở đòn cuối, thua trận và mất suất (ngược, `hy_sinh`) / bỏ võ đài (`dao_thoat`) | (nếu thắng) suất nội môn | Triệu Kỳ thành phế nhân |
| 3. Cây sáo | Bạn nợ gì một người đã chết? | **Đám tang Triệu Kỳ** (treo cổ sau ba năm): tới quỳ thắp nhang trước mặt Triệu Liệt (ngược, `phuc_tung`) / không đến (`im_lang`) / đến và đánh nhau với Triệu Liệt (`dung_khuyet_diem`) | lão Mộc dạy bạn đẽo một con chim gỗ | Triệu Liệt giữ cây sáo |
| 4. Liệt Quyền *(chiến thắng giả)* | Kẻ không ai dám đụng có còn ai không? | **Triệu Liệt khiêu chiến công khai**: đánh trong cơn giận, thắng nhưng làm chết một người đứng xem (`dung_khuyet_diem`) / nhận thua trước toàn tông (ngược) / đánh lén trước trận (`duong_tat`) | danh hiệu "Liệt Quyền", cả tông nể | Tiểu Đào mất tích |
| 5. Chín cái tát | Đứng yên được không? | **Cảnh chuẩn "Chín cái tát"**: đứng yên (ngược) / bẻ tay hắn (`chong`) / quỳ xin chịu thay bằng đan điền (`hy_sinh`); nhịp 2 có `tam_ma` 🜏 | (không) | Tiểu Đào không nhìn bạn như trước |
| 6. Lửa cuối | Dừng tay lần cuối? | **Triệu Liệt già, đốt làng của Tiểu Đào**: dập lửa bằng tu vi cuối (`hy_sinh`) / đánh hắn đến chết (`dung_khuyet_diem`) / buông tay cho hắn đánh mình đến hả giận (ngược, `phuc_tung`) | con của Tiểu Đào thổi một khúc sáo | (kết) |
- **Không kẻ ác:** móc phần 3 hoặc 4: lão Mộc chết già (Trúc Cơ cạn thọ), để lại con chim gỗ chưa đẽo xong. **Tâm ma 🜏:** P4, P5.
- **Lật:** (a) **Chính bạn là thủ phạm**: thằng bé bạn đánh quá tay năm mười hai tuổi chính là Triệu Kỳ; câu khích ở đấu trường là hắn muốn bạn nhận ra (P1 thằng bé có cây sáo; P2 Triệu Kỳ hỏi "ngươi còn nhớ bờ ao không"; P3 vết sẹo trên trán Triệu Kỳ trong quan tài). (b) **Lão Mộc là kẻ năm xưa giết cha bạn trong cơn giận**, tu nhẫn năm mươi năm để chuộc (P1 tay ông có vết bỏng lò rèn; P3 ông né nói về làng bạn; P4 cái đục khắc tên cha bạn). (c) **Kẻ ác có lý do**: Triệu Kỳ treo cổ vì chính Triệu Liệt ép em tập luyện lại bằng roi; Triệu Liệt đổ cơn hận của chính mình lên bạn (P3 lưng Triệu Kỳ đầy vết roi; P4 Triệu Liệt không bao giờ thổi cây sáo; P5 hắn gọi Tiểu Đào bằng tên em hắn).
- **Kết:** toàn vẹn: bạn ngồi đẽo nốt con chim gỗ của lão Mộc, tay không còn run. Đọa: bạn tát một đệ tử vì một câu nói, và nghe trong đầu ai đó đang đếm. Cô độc: bạn thắng mọi trận, sợi dây tóc đỏ đã mục.

## 6. Khuôn "Mưu mô" (Xử thế dương)
- **Câu hỏi trung tâm:** Người ta sống được với nhau bằng tính toán, hay bằng tin nhau? **Thuốc:** niềm tin.
- **Vết thương:** (a) cha tin bạn bè, bị lừa mất hết; (b) cô nhi tin một người lớn, bị bán cho gánh xiếc; (c) cha làm quan bị chính em ruột tố giác.
- **Lời nói dối:** "Đừng tin ai; ai cũng là quân cờ." **Muốn:** nắm mọi sợi dây: phó chưởng môn, rồi người quyết định của cả tông. **Cần:** đặt cược vào người khác mà không kiểm soát được.
- **Bóng tối:** Quỷ Diện (`ke_thu`, giáo chủ thế lực mạnh kề bên): kẻ thao túng giỏi hơn, coi bạn là quân cờ. **Gương:** Hàn Thất (`huynh`): tin người tới ngây thơ. **Hy sinh:** ghế, mạng lưới tin tức, mạng sống.
- **Sợi chính:** bạn và Hàn Thất (vật: **câu đối hai vế** làm mật hiệu, mỗi người giữ một vế). **Phụ:** Quỷ Diện (vật: quân cờ ngọc đen); `thuong`. **Nơi:** sơn môn (nghị sự đường, yến minh ước); tổng đàn của thế lực kề bên.
- **Luật 20:** bạn **không bao giờ để lộ dấu vết ngớ ngẩn**; mọi thất bại đến từ người giỏi hơn hoặc người tin bạn phản bội.

| Phần | Câu hỏi | Cao trào (kiểu) | Thắng hoặc vui | Treo |
|---|---|---|---|---|
| 1. Quân cờ đầu | Ai gánh tội? | **Vụ mất trộm ở ngoại môn**: đổ cho bạn cùng phòng (`dung_khuyet_diem`) / nhận tội (ngược) / im (`im_lang`); Hàn Thất tự nhận thay bạn trong mọi nhánh trừ nhánh nhận tội | chưởng sự khen bạn lanh | Hàn Thất bị phạt quỳ, cười với bạn |
| 2. Câu đối | Tin hay dùng? | **Kết nghĩa**: chia vế mật hiệu và kể thật về đời mình (ngược, `tin`) / kết nghĩa giả để dùng (`dung_khuyet_diem`) / từ chối (`im_lang`) | đêm hai người say, đối nhau câu đối | Quỷ Diện để ý tông bạn |
| 3. Nằm vùng | Ai đi vào hang? | **Gửi người vào thế lực kề bên**: gửi Hàn Thất (`dung_khuyet_diem`) / tự đi (ngược, `hy_sinh`) / không gửi, mất công lớn (`im_lang`) | lần đầu được ngồi nghị sự đường | tin của Hàn Thất ngày càng thưa |
| 4. Hiệp ước *(chiến thắng giả)* | Đổi một người lấy một ghế? | **Mật thư**: gửi mật hiệu bán thân phận Hàn Thất đổi hiệp ước, lên phó chưởng môn (`dung_khuyet_diem`) / không gửi, mất hiệp ước (ngược) / gửi mật hiệu giả để báo hắn chạy (`duong_tat`, Quỷ Diện sẽ biết) | đại tiệc phong phó chưởng môn | Hàn Thất bặt tin |
| 5. Người hầu rượu | Còn ai tin bạn? | **Cảnh chuẩn "Người hầu rượu"** (bản sửa: mật hiệu, không nét chữ): đọc to sự thật (ngược) / đổi bằng tài sản của tông (`duong_tat`) / nâng chén như không quen (`dung_khuyet_diem`); phản đòn "Ta có nói trả người sống đâu." | (không) | minh ước vỡ hoặc ký |
| 6. Ván cuối | Đặt cược vào người khác được không? | **Ván cờ cuối với Quỷ Diện**, cược cả tông: tin một người bạn không kiểm soát được để họ đi nước quyết định (ngược, `tin`) / tự tính hết (`dung_khuyet_diem`, thua vì hắn đã tính trước) / tự làm quân thí (`hy_sinh`) | người bạn tin đi đúng nước | (kết) |
- **Không kẻ ác:** phần 3: mẹ Hàn Thất (phàm) hấp hối khi hắn đang nằm vùng; báo cho hắn thì lộ thân phận, không báo thì bà chết không gặp con. **Tâm ma 🜏:** P4, P5.
- **Lật:** (a) **Kẻ đứng sau kẻ đứng sau**: Quỷ Diện chỉ là quân cờ của sư phụ bạn, người dạy bạn "đừng tin ai" (P2 thầy biết về câu đối; P3 thầy gợi ý gửi Hàn Thất; P4 quân cờ ngọc đen trong thư phòng thầy). (b) **Hàn Thất biết mình bị bán từ đầu** và vẫn đi vì tin bạn có lý do (P2 hắn đổi một chữ trong vế đối của mình; P3 thư cuối của hắn có chữ ấy; P5 hắn nhìn bạn rất quen mà không gọi). (c) **Chính bạn là thủ phạm**: năm tám tuổi, bạn vô tình kể chuyện nhà với một người lạ tốt bụng; người lạ ấy là Quỷ Diện, và đó là lý do cha bạn sụp đổ (P1 Quỷ Diện biết món ăn bạn thích lúc nhỏ; P3 hắn nhắc tên làng cũ; P4 hắn gọi bạn bằng tên tục).
- **Kết:** toàn vẹn: bạn ngồi đối câu đối với một ghế trống, vế dưới viết bằng chữ của Hàn Thất. Đọa: bạn xếp quân trên bàn cờ, quân nào cũng mang tên một người. Cô độc: bạn nắm mọi sợi dây, không sợi nào dẫn tới ai.

## 7. Khuôn "Thờ ơ" (Tính tình dương, điềm tĩnh)
- **Câu hỏi trung tâm:** Không làm gì có phải là vô tội? **Thuốc:** dám.
- **Vết thương:** (a) lần đầu lao xuống sông cứu người, cả hai suýt chết và người kia chết; (b) cô nhi chạy theo đám đông bị đánh, đứng ngoài thì yên; (c) cha liều đột phá và chết, mẹ bảo "phải chi ông ấy chờ".
- **Lời nói dối:** "Chờ đủ chắc rồi mới làm; đứng ngoài thì không sai." **Muốn:** tu đạo thanh tịnh, không vướng víu. **Cần:** dám làm khi chưa chắc.
- **Bóng tối:** sư tổ Vô Vi (`su`): "đạo là không vội", nhìn thế gian sụp đổ và gọi đó là đạo. **Gương:** Hạ Lam (`thuong` hoặc `doi_thu`), tán tu bốc đồng, làm sai nhiều mà cứu được người. **Hy sinh:** sự thanh tịnh, tu vi, mạng.
- **Sợi chính:** bạn và Vô Vi (vật: **chén trà**). **Phụ:** Hạ Lam (vật: đèn lồng giấy); `ban` ở thôn Hạ Khê. **Nơi:** đỉnh núi của tông; thôn Hạ Khê dưới chân núi.

| Phần | Câu hỏi | Cao trào (kiểu) | Thắng hoặc vui | Treo |
|---|---|---|---|---|
| 1. Bờ sông | Nhảy hay gọi người? | **Đứa trẻ rơi xuống sông**: nhảy (ngược, `chong`) / chạy gọi người lớn (`dung_khuyet_diem`) / đứng nhìn (`im_lang`) | (nếu cứu) cả thôn mời cơm | Vô Vi ở bờ bên kia, không động |
| 2. Dấu trận | Chờ thêm hay đi xem? | **Dấu trận lạ ở hậu sơn**: chờ cho chắc (`dung_khuyet_diem`) / tự đi xem (ngược) / báo lên tông (`tin`, bị bảo đừng vội) | tâm tĩnh, đột phá dễ | đêm ấy một ngọn đèn ở Hạ Khê tắt |
| 3. Chén thứ nhất | Đi muộn một ngày có sao không? | **Bạn thuở nhỏ hấp hối** khi bạn đang bế quan: phá quan sớm (ngược, mất một bậc tiến) / ra đúng hạn (`dung_khuyet_diem`) | Hạ Lam kéo bạn đi hội đèn | Vô Vi rót chén trà thứ nhất |
| 4. Tĩnh Tâm *(chiến thắng giả)* | Thanh tịnh để làm gì? | **Hạ Lam xin bạn cùng phá trận**: chờ đủ chắc (`dung_khuyet_diem`) / đi ngay (ngược) / để nàng đi một mình (`im_lang`) | được tôn là "Tĩnh Tâm chân nhân" | đèn lồng giấy của Hạ Lam treo ở cổng tông |
| 5. Ba chén trà | Còn kịp không? | **Cảnh chuẩn "Ba chén trà"** ("Còn nóng."): uống (`dung_khuyet_diem`) / lao xuống (ngược, `chong`) / hỏi hai chén kia của ai (`im_lang`); nhịp 2 như mẫu | (không) | Hạ Khê mất một nửa |
| 6. Chén thứ tư | Lần này dám chưa? | **Trận lớn nuốt cả vùng**: phá trận bằng tu vi cuối (`hy_sinh`) / rót trà cho đệ tử trẻ, dạy "đạo là không vội" (`dung_khuyet_diem`) / đưa dân chạy, bỏ tông (`dao_thoat`) | một đứa trẻ Hạ Khê thắp đèn lồng giấy | (kết) |
- **Không kẻ ác:** phần 3 (bạn thuở nhỏ chết già khi bạn ra quan muộn một ngày). **Tâm ma 🜏:** P4 (để Hạ Lam đi một mình rồi tự nhủ "nàng sẽ ổn"), P5.
- **Lật:** (a) **Vô Vi là người dựng trận**, không chỉ đứng nhìn (P2 dấu trận theo lối bút của ông; P3 lá vàng úp chén là lá cây hậu sơn; P4 ông biết tên trận). (b) **Chính bạn là thủ phạm**: người đầu tiên báo bạn về dấu trận, bị bạn bảo "chờ", là người chết đầu tiên trong trận (P2 tên người báo tin; P3 người ấy không về; P5 tờ lá vàng thứ nhất úp trên chén có tên người ấy). (c) **Kẻ ác có lý do**: trận trấn một yêu vật dưới núi, mỗi năm phải ăn sinh khí một thôn; Vô Vi chọn thôn nhỏ nhất (P1 dân kể chuyện ma dưới núi; P3 động đất nhẹ mỗi khi đèn tắt; P4 sách cổ của tông nói về "trấn sơn").
- **Kết:** toàn vẹn: bạn, tu vi đã cạn, rót trà cho chính mình ở Hạ Khê, đèn trong thôn sáng đủ. Đọa: bạn đẩy chén trà sang một đệ tử trẻ: "Còn nóng." Cô độc: trên bàn còn bốn chén, không ai ngồi.

## 8. Khuôn "Buông thả" (Tu dưỡng âm)
- **Câu hỏi trung tâm:** Một đời vui có đáng không, khi lúc cần thì trong tay không có gì? **Thuốc:** kỷ luật và hy sinh.
- **Vết thương:** (a) cha mẹ khổ cả đời, chết khi chưa được hưởng ngày nào; (b) cô nhi chỉ được no vào những đêm hội làng; (c) cha tu khổ sáu mươi năm không đột phá, chết trong căn nhà dột.
- **Lời nói dối:** "Khổ luyện là phí đời; vui được lúc nào hay lúc ấy." **Muốn:** một tửu lâu đông khách, bạn bè, tiếng cười. **Cần:** kỷ luật, và bỏ cái vui của mình vì người khác.
- **Bóng tối:** Tô Lão Lục (`ke_thu`), chủ sòng, bạn rượu cũ, buông thả tới cùng: nợ nần đến mức bán bố phòng của trấn cho đám săn yêu. **Gương:** Lạc Vân (`doi_thu`), người cùng khóa khổ luyện đến khô khốc, không biết cười; **vượt bạn hợp lý** (phần 5: hắn Luyện Khí hậu kỳ, bạn Luyện Khí sơ kỳ hoặc vẫn phàm nhân). **Hy sinh:** tửu lâu, cái vui, mạng.
- **Sợi chính:** bạn và Lạc Vân (vật: **thanh kiếm gỗ** bạn dạy hắn cầm năm mười hai tuổi). **Phụ:** Tô Lão Lục (vật: con xúc xắc); `thuong`. **Nơi:** trấn Lạc Hà (tửu lâu, cổng trấn, sòng bạc).

| Phần | Câu hỏi | Cao trào (kiểu) | Thắng hoặc vui | Treo |
|---|---|---|---|---|
| 1. Hội làng | Học hay chơi? | **Đêm hội và buổi khảo hạch trùng ngày**: đi hội (`dung_khuyet_diem`) / ở lại dạy Lạc Vân cầm kiếm (ngược) / rủ hắn trốn theo (`duong_tat`) | cả làng múa lân, bạn được đội đầu lân | Lạc Vân giữ thanh kiếm gỗ |
| 2. Tửu lâu | Vốn để làm gì? | **Thi vào nội môn hay mở quán**: dùng vốn mở tửu lâu (`dung_khuyet_diem`) / đi thi (ngược, `hy_sinh` vốn) / nhường suất cho Lạc Vân (`hy_sinh`) | đêm khai trương, Lạc Vân uống chén đầu tiên rồi đi | Tô Lão Lục mở sòng bên cạnh |
| 3. Sổ nợ | Ai trả? | **Nợ sòng của Tô Lão Lục đứng tên bạn**: trả bằng tửu lâu (ngược) / để hắn bán đất của người khác (`duong_tat`) / say cho quên (`dung_khuyet_diem`) | (nếu giữ quán) đêm Trung thu đông khách nhất | cha hoặc mẹ mất trong đêm bạn ở sòng |
| 4. Ông chủ *(chiến thắng giả)* | Cái vui có giữ được trấn không? | **Lạc Vân xin bạn ba năm luyện trận giữ trấn**: từ chối, mở thêm quán (`dung_khuyet_diem`) / đóng quán đi luyện (ngược, `hy_sinh`) / đưa tiền thay công (`duong_tat`) | tửu lâu đông nhất vùng, ai cũng quý | Tô Lão Lục mua rượu bằng bạc lạ |
| 5. Kẻ chạy chậm nhất | Chạy được không? | **Cảnh "Kẻ chạy chậm nhất"** (đã sửa thang sức mạnh): chạy làm mồi (ngược) / xuống hầm với khách (`dung_khuyet_diem`) / bảo hắn tự làm mồi (`im_lang`); nhịp 2: đốt tửu lâu chắn đường (`hy_sinh`) | (không) | Lạc Vân trọng thương hoặc chết |
| 6. Đèn cuối | Lần này đứng được bao lâu? | **Thú triều lớn hơn, không còn Lạc Vân**: giữ cổng bằng tu vi cuối (`hy_sinh`) / chạy (`dao_thoat`) / mở cổng phụ cho khách quen chạy trước (`dung_khuyet_diem`) | đệ tử nhỏ của Lạc Vân đưa bạn thanh kiếm gỗ | (kết) |
- **Không kẻ ác:** phần 3 (cha hoặc mẹ chết già trong đêm bạn ở sòng). **Tâm ma 🜏:** P3, P6.
- **Lật:** (a) **Tô Lão Lục bán trấn** (đồng minh là tay trong; P3 hắn hỏi giờ đổi gác; P4 bạc lạ; P5 thú vào đúng chỗ cổng gác bỏ trống). (b) **Lạc Vân khổ luyện vì một lời hứa với bạn** năm mười hai tuổi: "Ta sẽ giữ cổng cho cả hai" (P1 hắn nói câu ấy khi bạn đi hội; P2 hắn để lại thanh kiếm gỗ ở quán; P4 hắn gọi bạn là "người giữ cổng thứ hai"). (c) **Chính bạn là thủ phạm**: đêm thú triều lần đầu (phần 3 hoặc 4), bạn say và mở cổng phụ cho khách quen; thú vào từ đó (P3 bạn giữ chìa cổng phụ để đón khách; P4 dấu chân thú bên cổng phụ; P5 một người khách nhớ ra).
- **Kết:** toàn vẹn: bạn đứng gác ở cổng trấn mỗi đêm, tay cầm thanh kiếm gỗ. Đọa: tửu lâu sáng đèn suốt đêm thú triều, bạn rót rượu cho kẻ đã bán trấn. Cô độc: quán đông khách, không ai trong đó biết tên bạn.

## 9. Khuôn "Khắc kỷ" (Tu dưỡng dương)
- **Câu hỏi trung tâm:** Trường sinh để làm gì, nếu không còn ai để sống cùng? **Thuốc:** tình người.
- **Vết thương:** (a) mẹ bỏ đi theo người khác, bạn học rằng thương là xiềng; (b) cô nhi thương một con chó, nó chết, bạn khóc ba ngày rồi thề không thương gì nữa; (c) cha bỏ tu vì vợ con, già chết nghèo, mẹ bảo "giá ông ấy đừng vì chúng ta".
- **Lời nói dối:** "Trần duyên là xiềng xích; dứt được mới lên được." **Muốn:** Trúc Cơ trước khi cạn thọ, rồi xa hơn nữa. **Cần:** tình người; sống cùng ai đó còn hơn sống lâu một mình.
- **Bóng tối:** sư tôn Băng Lạc (`su`): đã hiến cả gia tộc cho đạo. **Gương:** A Mộc (`ban`, phàm nhân), sống trọn tình người, chết nghèo, không hối tiếc. **Hy sinh:** cơ hội Trúc Cơ, tuổi thọ.
- **Sợi chính:** bạn và Băng Lạc (vật: **chiếu thiền băng**). **Phụ:** A Mộc (vật: con thuyền nan, người từng cõng bạn qua sông); đứa trẻ bạn nhận nuôi (`ke_thua`; vật: những lá thư). **Nơi:** động phủ bế quan; làng bên sông.
- **Sửa thang sức mạnh cho cảnh chuẩn "Cửa quan":** đổi "bảy ngày nữa thành Nguyên Anh" thành **"bảy ngày nữa thành Trúc Cơ"**, lúc bạn khoảng 100 tuổi, thọ Luyện Khí còn khoảng 30 năm; người bị bắt là **đứa con nuôi** (`ke_thua`).

| Phần | Câu hỏi | Cao trào (kiểu) | Thắng hoặc vui | Treo |
|---|---|---|---|---|
| 1. Con chó | Khóc hay đứng dậy? | **Con chó chết**: chôn nó và khóc (ngược) / bỏ đi luyện ngay (`dung_khuyet_diem`) / nhờ A Mộc chôn giùm (`im_lang`) | A Mộc cõng bạn qua sông mùa lũ | Băng Lạc nhận bạn |
| 2. Người thương | Nhận hay từ? | **Lời tỏ tình**: từ chối vì đạo (`dung_khuyet_diem`) / nhận (ngược) / hẹn sau Trúc Cơ (`im_lang`) | (nếu nhận) một mùa xuân bên sông | Băng Lạc lạnh với bạn |
| 3. Diên Thọ Đan | Cho ai năm tháng của mình? | **Cảnh chuẩn "Viên Diên Thọ Đan"** (sửa: đan để dành cho lần xung kích Trúc Cơ): đưa đan (ngược) / nói cho ông biết bạn là ai (`tin`) / để lại vàng rồi về (`dung_khuyet_diem`) | A Mộc nắm tay: "Thằng ngốc." | bạn nhặt một đứa trẻ mồ côi ở làng |
| 4. Lá thư *(chiến thắng giả)* | Đọc hay đốt? | **Lá thư thứ một trăm** của con nuôi: đốt không đọc, như mọi lá trước (`dung_khuyet_diem`) / đọc hết một trăm lá trong một đêm (ngược, chậm tiến) / gửi người xuống đưa tiền (`duong_tat`) | đạt Luyện Khí đỉnh phong, Băng Lạc gật đầu lần đầu | bạn bế quan xung kích Trúc Cơ |
| 5. Cửa quan | Bảy ngày hay một mạng? | **Cảnh chuẩn "Cửa quan"** (đã sửa thang): tiếp tục bế quan (`dung_khuyet_diem`) / phá quan (ngược, mất cơ hội Trúc Cơ) / xin sư tôn (`phuc_tung`); nhịp 2 như mẫu | (không) | con nuôi sống hoặc chết |
| 6. Người báo tin | Thành Trúc Cơ rồi báo cho ai? | **Đồng hồ thọ nguyên**: dùng chút thọ còn lại cứu con của con nuôi (`hy_sinh`) / xung kích Trúc Cơ lần cuối (`dung_khuyet_diem`) / ngồi với người còn lại cho tới hết (ngược) | con nuôi gọi bạn là "cha" | (kết) |
- **Không kẻ ác:** phần 3 (A Mộc). **Tâm ma 🜏:** P4, P5.
- **Lật:** (a) **Băng Lạc dựng vụ bắt cóc** để thử bạn có dứt được không (kẻ đứng sau; P4 bà biết con nuôi tên gì; P5 bà bóp nát phù trước khi bạn đọc hết; P5 Liệt Hỏa Tông không đòi gì). (b) **A Mộc biết bạn là ai từ đầu**, giả không nhận để bạn khỏi áy náy (P1 ông cõng bạn qua sông; P3 ông nhìn rất lâu; P3 lúc bạn đi, ông gọi khẽ tên tục của bạn). (c) **Chính bạn là thủ phạm**: một lá thư bạn đốt không đọc ở phần 4 báo trước vụ bắt (P4 con nuôi viết "có người lạ hỏi thăm"; P4 lá thư cháy dở; P5 kẻ bắt nói "chúng tôi đã chờ ngài trả lời").
- **Kết:** toàn vẹn: bạn già đi như người phàm bên sông, con nuôi chèo thuyền nan. Đọa: bạn thành Trúc Cơ trong động phủ băng, không ai để báo tin. Cô độc: bạn sống thêm một trăm năm, đọc lại một trăm lá thư.

## 10. Khuôn "Ba phải" (Trung dung: không trục nào lệch quá 3)
- **Câu hỏi trung tâm:** Đứng giữa có phải là đứng ở đâu không? **Thuốc:** đứng về một phía và chịu giá.
- **Vết thương:** (a) cha mẹ cãi nhau, bắt bạn chọn; chọn ai người kia cũng giận, nên bạn học cách vừa lòng cả hai; (b) cô nhi sống giữa hai băng trẻ ăn xin, theo bên nào cũng bị bên kia đánh; (c) cha là trưởng thôn, bị hai họ trong thôn cùng ghét vì xử công bằng.
- **Lời nói dối:** "Không đứng về phía nào thì không ai ghét mình." **Muốn:** được cả hai phía nể; làm trưởng thôn, người hòa giải. **Cần:** chọn và trả giá.
- **Bóng tối:** Đổng Uy (`ke_thu`), tướng triều: chọn phe mạnh dứt khoát, thắng, khinh kẻ không có mặt. **Gương:** Lưu Nghĩa (`ban`), thủ lĩnh nghĩa quân: chọn phe vì lý tưởng, chịu mọi giá. **Hy sinh:** sự nể trọng của cả hai phía, thôn, mạng.
- **Sợi chính:** bạn và Lưu Nghĩa (vật: **con diều hai màu** hai đứa làm chung). **Phụ:** Đổng Uy (vật: hai lá cờ); thôn Vọng Giang. **Nơi:** thôn Vọng Giang (sân đình, kho thóc, đê sông). Triều và nghĩa quân lấy từ thế lực thật trong mô phỏng.

| Phần | Câu hỏi | Cao trào (kiểu) | Thắng hoặc vui | Treo |
|---|---|---|---|---|
| 1. Con diều | Đứng bên ai? | **Hai nhóm trẻ tranh bãi thả diều**: đứng về phía Lưu Nghĩa (ngược) / làm trung gian chia đôi bãi (`dung_khuyet_diem`) / bỏ về (`dao_thoat`) | con diều hai màu bay cao nhất thôn | Lưu Nghĩa: "Ngươi lúc nào cũng ở giữa." |
| 2. Trưởng thôn | Công bằng hay chia đều? | **Tranh nước giữa hai họ**: xử cho họ đúng lý, mất lòng họ kia (ngược) / chia đều dù sai lý (`dung_khuyet_diem`) / để quan xử (`im_lang`) | được tôn làm trưởng thôn | Lưu Nghĩa bỏ làng đi |
| 3. Đê sông | Mở đê nào? | **Lũ năm Tý** (không kẻ ác): chỉ mở được một cửa xả, cứu xóm trên hay xóm dưới (ngược, chọn một) / không mở, để trời quyết (`dung_khuyet_diem`) / chia nước làm đôi, cả hai cùng ngập một nửa (`im_lang`) | (nếu chọn) xóm được cứu dựng miếu cho bạn | nghĩa quân về đóng gần thôn |
| 4. Hòa giải *(chiến thắng giả)* | Hòa bằng gì? | **Văn hòa giữa triều và nghĩa quân** do bạn soạn: ký văn có điều khoản giao nộp "kẻ cầm đầu" (`dung_khuyet_diem`) / từ chối soạn (ngược) / soạn hai bản khác nhau cho hai bên (`duong_tat`) | cả hai phía mời bạn dự tiệc | đêm ấy bạn giấu người của Lưu Nghĩa trong kho thóc, không hỏi gì |
| 5. Hai lá cờ | Lá nào? | **Cảnh chuẩn "Hai lá cờ"**: cắm cờ triều (`dung_khuyet_diem`) / cắm cờ nghĩa quân (ngược) / xin thêm một ngày (`im_lang`); phản đòn "Giờ dẫn ta ra kho thóc."; nhịp 2 như mẫu | (không) | Lưu Nghĩa thấy ai cầm đuốc |
| 6. Cờ cuối | Lần này đứng ở đâu? | **Trận cuối ở Vọng Giang**: cầm cờ đứng ra giữa hai bên, chịu đòn của cả hai (`hy_sinh`) / đứng ngoài (`dung_khuyet_diem`) / dẫn quân triều vào (`tam_ma` 🜏) | một đứa trẻ thả lại con diều hai màu | (kết) |
- **Không kẻ ác:** phần 3 (lũ). **Tâm ma 🜏:** P4, P6.
- **Lật:** (a) **Danh tính thật**: Lưu Nghĩa là con rơi của Đổng Uy (P2 Lưu Nghĩa không biết cha; P4 Đổng Uy hỏi về "thằng nhóc thả diều"; P5 Đổng Uy dừng đuốc trước kho). (b) **Chính bạn là thủ phạm**: danh sách "ân xá" bạn soạn kèm văn hòa ở phần 4 chính là danh sách Đổng Uy dùng để bắt nghĩa quân (P4 Đổng Uy xin bạn ghi tên "cho đủ thủ tục"; P5 lính đọc tên theo thứ tự bạn viết; P5 Lưu Nghĩa cầm một bản chép). (c) **Kẻ ác có lý do**: Đổng Uy là người Vọng Giang; năm xưa nhà hắn bị giết khi cả thôn đứng giữa không ai lên tiếng (P2 hắn biết đường đê; P3 hắn hỏi miếu thờ ai; P5 hắn nhìn sân đình rất lâu).
- **Kết:** toàn vẹn: bạn đứng giữa sân đình, trên tay chỉ một lá cờ. Đọa: bạn soạn văn hòa cho một cuộc chiến mới, cả hai phía đều cảm ơn. Cô độc: cả hai phía đều nể bạn, không phía nào nhớ tên bạn.
