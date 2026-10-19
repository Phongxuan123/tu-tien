# E. Kinh tế: chuỗi cung ứng linh vật và thương hội (bản 6)

- Trạng thái: Bản 6 (2026-10-17): đã gộp các quyết định của bạn vào bản 5 (xem A.10 và A.12 đến A.15), phạm vi **E0 đến E6 làm một mạch**, chờ bạn xem lại kế hoạch rồi mới code. Mục A là bản **đang dùng**; các mục 0 đến 15 là bản 4 giữ làm nền thiết kế (công thức, bảng số, sơ đồ), nơi nào mâu thuẫn thì theo mục A
- Ngày lập: 2026-10-16 (bản 1-3), bản 4 cùng ngày: đưa **thương hội** lên làm cùng, là thế lực trung gian đại diện giai cấp tư bản
- Bản mẫu giao diện để xem trước: [uimock-kinhte.html](../uimock-kinhte.html) (chỉnh cấp Thương nhân, bấm biến cố, có thêm "thương hội đầu cơ" và "xả hàng", bảng chuyến buôn có dòng đi theo đoàn hội)
- Liên quan: `js/systems/items.js` (chợ), `js/data/items.js` (D.SHOPS), `js/systems/ls.js`, `js/data/sects.js` (D.SECT_SHOP), `js/systems/factions.js` (vương triều, tông, gia tộc, chiến tranh, thời đại), `js/systems/jobs.js` (Thương nhân), `js/systems/dungeon.js`, `js/systems/rumors.js`, `KICH-BAN-THE-GIOI.md`, KE-HOACH.md §16-§18

## A. Bản 5 (2026-10-17): kế hoạch thực thi trên nền thế giới đã hoàn thiện

### A.1 Điều kiện nền đã có (trước đây là điều kiện chờ)
| Cần cho kinh tế | Đã có từ | Dùng thế nào |
|---|---|---|
| Thương hội là thế lực thứ tư (tên, lãnh tụ, của cải, uy tín, hộ vệ, `infl`, tự cung, tích trữ, bị tịch thu) | F1: `factions.js` (`tickHoi`, `hoiAt`, `hoiCover`, `shocks`) | Hội là tác nhân phân phối và ép chênh giá; `hoiCover(vùng)` thành hệ số `δ` |
| Dân số, dân tâm, thuế, quân số, thiên tai, di cư theo vùng | F4: `systems/population.js` | **Cầu** = dân số x phồn hoa; thiên tai và chiến sự làm lệch cầu và cung |
| Hiệp ước (thuế, cống, chư hầu, bảo hộ, minh ước), oán, đoạn tuyệt | F2: `systems/pacts.js` | Thuế cửa ải và thuế chợ; cú sốc "đóng cửa ải" khi đoạn tuyệt; cống nạp của tông |
| Tài nguyên có mức và kho hao, hồi theo năm; khu tài nguyên; nghề thu theo nơi | `systems/resources.js` | **Cung thô** của quặng, linh thảo, yêu liệu, linh thạch theo vùng |
| Cửa hàng chuyên nhóm hàng, kho từng cửa hàng, hạn mức tháng theo quy mô nơi, hàng rong | `systems/buildings.js`, `items.js` (I3) | Điểm giao dịch của người chơi; hạn mức và kho đã đúng ý, giữ nguyên |
| Kho tông, giá kho cống hiến, quyên góp, cống nạp | M5a | Kênh tông giữ nguyên, nối giá tông |
| Chiến tranh, thời đại (`era.price`), tiền tuyến, thời tiết, tin đồn | `factions.js`, `rumors.js` | Bộ phát cú sốc |
| Nghề Thương nhân (chiết khấu mua) | `jobs.js` | Cửa vào sơ đồ số liệu |
| Biên niên sử, nhiều trang xem thử | `chron`, `uimock-kinhte.html` | Tin giá, biểu đồ |

Hiện trạng chợ (cần thay): `market.buyPrice = giá_trị x D.SHOPS[loại nơi].buy x priceMul(vùng) x job.buyMul`; `sellPrice = giá_trị x sell x bonus cửa hàng`. Giá **tĩnh** theo loại nơi, chỉ nhúc nhích theo thời đại và tiền tuyến. Kho cửa hàng (`st.q`) và hạn mức đã động theo tháng nhưng không phản ánh cung cầu.

### A.2 Nguyên tắc thu gọn để làm được
1. **Giá theo nhóm hàng, không theo từng món:** mỗi vùng có một chỉ số giá cho mỗi nhóm (`dan` đan dược, `bua` bùa, `thao` linh thảo, `khoang` quặng, `khi` khí cụ và trang bị, `sach` sách, `yeu` yêu liệu). Giá một món = `giá_trị nền x chỉ_số_giá[vùng][nhóm] x hệ_số_cửa_hàng x (1 + thuế)`. Vài chục chỉ số (9 vùng x 7 nhóm = 63) là đủ, rẻ, dễ vẽ biểu đồ.
2. **Tháng là bước tính** (không cần từng giao dịch): cập nhật 63 chỉ số mỗi tháng game, dưới 1 ms.
3. **Cung và cầu lấy từ thế giới có sẵn**, không dựng thêm mô phỏng NPC (xem A.3).
4. **Người chơi là hạt nhỏ:** bán dồn chỉ làm trượt giá tạm thời, không thao túng được.
5. **Hạn mức tháng, kho từng cửa hàng, hàng rong giữ nguyên.** Kinh tế chỉ thay *giá* và *lượng hàng nhập kho mỗi tháng* (kho hồi theo cung vùng).
6. Giữ nguyên **cân bằng tu luyện**: giá chỉ đổi ±(vài chục %) và không tạo nguồn linh thạch mới ngoài nghề (kiểm bằng `econ-sim`).

### A.3 Mô hình cung và cầu theo dữ liệu thật
Với mỗi vùng `r`, nhóm `g`, mỗi tháng:
```
Cung S(r,g) = thô(r,g) + tông(r,g) + thợ(r,g) + hội(r,g) + nhập(r,g)  - hao(r,g)
  thô   = tổng mức tài nguyên các địa điểm và khu của vùng cho nhóm (quặng, thảo, yêu liệu) x hệ số kho còn lại (resources.js)
  tông  = sản lượng các tông trong vùng theo sở trường (nghề lõi: kiếm/khí/đan/bùa) x (0,6 + kho tông/100) x (1 nếu tông còn)
  thợ   = (dân số x (1 - quân số)) x mật độ thợ nghề x thiên tai
  hội   = xưởng hội (<= 12% tổng) và hàng mua gom
  nhập  = các vùng kề qua EDGES, theo chênh giá (δ hội càng cao nhập càng nhiều), trừ cước
  hao   = hàng hạn dùng (đan, bùa), cướp đoàn buôn
Cầu D(r,g) = dân số/n0 x phồn hoa vùng x trọng số nhóm
              x (1,6 đan/bùa nếu tiền tuyến) x era (thời đại) x mùa đột phá x (0,9 + dân tâm/500)
Chỉ số giá cân bằng P*(r,g) = clamp( (D/S)^(1 / (e + es)), 0,45, 3 - 1,0 x δ_hội )
Mỗi tháng: P <- P + 0,18 x (P* - P) + nhiễu(±1,5%) - dump (người chơi bán dồn, hồi 8%/tháng)
```
- `e`, `es` theo nhóm lấy từ mục 5.1 (đan 0,4/0,6; bùa 0,7/0,7; thảo 0,6/1,0; quặng 0,5/0,9; khí 1,1/0,8; sách 1,5/0,5; yêu liệu 0,6/0,9).
- **Chuẩn hóa lúc khởi tạo:** mỗi (r,g) có hệ số `k(r,g)` đặt sao cho `D/S = 1` ở trạng thái bình thường, cộng *đặc sản vùng* cố định (2-3 nhóm rẻ -25%, 2-3 đắt +30%) lấy từ thuộc tính vùng. Nhờ đó giá lúc yên giữ ±8% quanh mức vùng.
- **Cú sốc có tên** (`shocks`, đã có cho hội và thiên tai): chiến sự, tông đóng hoặc mở kho, bí cảnh mở, mùa thu hoạch hay hạn, đường phong tỏa, hội đầu cơ hay xả hàng, đóng ải và thuế tăng (đọc từ `pacts` đoạn tuyệt), giá trần thời chiến. Mỗi cú sốc là dịch chuyển `D` hoặc `S` trong một khoảng tháng (bảng mục 5.2) và có dòng biên niên sử và tin đồn.

### A.4 Chạm vào người chơi ở đâu
- **Giá ở cửa sổ cửa hàng:** mỗi món hiện giá và mũi tên "so với bình thường" (dễ thấy), và một biểu đồ nhỏ 36 tháng ở đầu cửa sổ khi đã mở khóa (nghề Thương nhân hoặc hội, xem E5). Hạn mức tháng, kho cửa hàng giữ nguyên; kho hồi mỗi tháng theo `S` vùng (vùng thiếu hàng thì hồi ít).
- **Nha môn (nơi duy nhất ghi thuế và bảng giá vùng, theo ý bạn: ít ai đọc trừ người làm Thương nhân):** "Giá cả trong vùng: đan đang đắt, quặng đang rẻ vì ...", thuế suất vùng (từ F2), thế lực kiểm soát đường. Cửa hàng chỉ ghi giá cuối, không bày dòng thuế. 
- **Thông tin có độ trễ:** chỉ biết giá nơi đang đứng và nơi đã ghé ("cách đây N tháng"); Thương nhân và hội mở rộng (mục 6.4).
- **Bán dồn:** mỗi lô bán trượt giá 2%, tối đa 40%, hồi 8% mỗi tháng.
- **Spread thay "bán lại 55%":** làng 18%, thị trấn 12%, thành lớn 8%, chợ đen 20% (giảm theo cấp Thương nhân); thay `D.SHOPS[...].sell/buy` hiện tại.
- **Không thêm hộp hỏi mới** cho kinh tế; cú sốc đi qua tin đồn và nhật ký, nhịp hỏi giữ dưới 6 lần/phút.

### A.5 Thương hội trong kinh tế (nối `tickHoi` hiện có)
- `hoiCover` thành `δ` ép chênh giá giữa vùng và hạ trần giá khi khan; hội mua sỉ của tông (giá 0,9 x giá tông, hạn mức theo quan hệ) và bán cho chợ.
- Đầu cơ tích trữ và xả hàng (đã có trong `tickHoi`) thành cú sốc `S` thật.
- Hội cho vay, bảo hiểm, tài khoản hội viên: để E4b (sau khi giá chạy ổn), vì cần UI riêng.

### A.6 Các chặng thực thi (thứ tự và sản phẩm thấy được)
Mỗi chặng chơi được và có kiểm thử. Số trong ngoặc là bài kiểm thử đề xuất.
- [ ] **E0 Đo hiện trạng.** `tools/econ-sim.js`: thu nhập theo từng cách kiếm tiền (kiếm sống, nhiệm vụ tông, đơn hàng, đào quặng, săn, bán đồ luyện, buôn theo vùng) cho từng cảnh giới; làm mốc để chặn khai thác lỗ hổng sau này. Thấy: bảng số trong `ke-hoach/E-kinh-te.md` mục A.7 (điền khi xong). (kiểm thử: bảng mốc ổn định giữa các hạt giống)
- [ ] **E1 Chỉ số giá theo vùng và nhóm.** `js/data/eco.js` (nhóm hàng, `e`, `es`, ánh xạ vật phẩm sang nhóm, đặc sản vùng), `js/systems/eco.js` (`world.eco`, `price(vùng, nhóm)`, `tick`, `dump`, lịch sử 36 tháng). Nối `market.buyPrice` và `sellPrice` qua chỉ số, spread theo quy mô nơi. Chưa có cú sốc: giá chỉ trôi theo cung cầu nền. Thấy: giá khác nhau giữa vùng và nơi, mũi tên so với bình thường, trượt giá khi bán dồn. (giá yên ±8%, giá đổi tất định theo hạt giống, lưu/tải)
- [ ] **E2 Cung và cầu từ thế giới.** Tính `S` và `D` từ tài nguyên (`resources.js`), dân số (`population.js`), tông, chiến sự, thời đại; kho cửa hàng hồi theo `S` vùng. Thấy: vùng nhiều mỏ rẻ quặng, vùng đông dân đắt đồ thiết yếu, tiền tuyến đắt đan bùa. (chênh giữa vùng 10-35%, tiền tuyến đúng bảng 5.3)
- [ ] **E3 Cú sốc nối vào thế cuộc.** Chiến sự, tông mở hay đóng kho, bí cảnh, hạn hay mùa thu hoạch, đường phong tỏa, cửa ải đóng từ đoạn tuyệt hiệp ước, thuế vào giá; tin đồn "khan hàng, dư hàng" có nguyên nhân; biên niên sử. Thấy: giá nhảy đúng bảng 5.3 và có tin giải thích. (đo lại bảng 5.3, sai số 10%)
- [ ] **E4 Kênh tông và thương hội.** Giá nội bộ của thành viên tông (0,8 x giá tông, đã có hệ cống hiến), hội mua sỉ và ép chênh `δ`, đầu cơ và xả hàng thành cú sốc; bảng hợp đồng sỉ cho hội viên (**E4b** gia nhập hội, bậc, quyền lợi, vay, bảo hiểm làm sau). Thấy: thành viên tông và hội viên mua rẻ hơn người ngoài 25-45%. (tiêu chí 12.4)
- [ ] **E5 Nghề Thương nhân và sơ đồ.** Sơ đồ số liệu mở theo cấp 0-5 như `uimock-kinhte.html`: thẻ giá, lịch sử, cung cầu, đường S-D, so sánh vùng, giá hai tầng; bảng chuyến buôn (cước, cướp, hạn dùng, sức chứa); tin sớm. Thấy: người chơi lập luận kinh tế được (đọc sơ đồ rồi quyết định mua gì ở đâu). (lãi chuyến buôn 8-18%, không cách kiếm tiền nào vượt 1,6 lần "làm việc")
- [ ] **E6 Chợ đen, giám định, đấu giá thủ phủ** và hàng hạn dùng nếu thấy cần (thông tin bất cân xứng); hội đen. Có thể gộp vào I4 (nhà đấu giá).
- Mỗi chặng: kiểm thử `tests.html`, đo `econ-sim` và các chỉ tiêu cũ (Trúc Cơ+ NPC ~2/5/18%, nhịp < 6, số chiến tranh không lệch), chơi thử, ghi KE-HOACH.md, snapshot.

### A.7 Mốc cần đo ở E0 (điền khi làm)
| Cách kiếm tiền | Luyện Khí | Trúc Cơ | Kim Đan | Ghi chú |
|---|---|---|---|---|
| Kiếm sống (hành động Làm việc) | | | | |
| Nhiệm vụ tông (bảng việc) | | | | |
| Đơn hàng nghề | | | | |
| Đào quặng, săn thú, hái thảo rồi bán | | | | |
| Luyện đan, bùa, khí rồi bán | | | | |
| Buôn chênh vùng (sau E1) | | | | |

### A.8 Tiêu chí chấp nhận (cập nhật từ mục 12)
1. Giá lúc yên ±8%; có cú sốc đúng bảng 5.3 (sai số 10%).
2. Không cách kiếm tiền nào vượt 1,6 lần thu nhập "làm việc" cùng cảnh giới (đo bằng `econ-sim`, bảng A.7).
3. Chuyến buôn trung bình lãi ròng 8-18% sau phí và rủi ro; tuyến hội mạnh biên thấp hơn 20-35%.
4. Thành viên tông và hội viên mua thiết yếu rẻ hơn người ngoài 25-45%.
5. Hội: tự cung ≤ 12%, `guard` ≤ 30, không chiếm quá 60% phân phối một vùng, phá sản hoặc bị thôn tính ít nhất 1 lần trong 300 năm mô phỏng.
6. Không phá cân bằng cũ: NPC Trúc Cơ+ ~2/5/18% theo tư chất, nhịp hỏi người chơi < 6/phút, số chiến tranh và diệt vong trong khoảng đã đo (mục 18 nhật ký gốc), đời người chơi Tự động Trúc Cơ 12-60%.
7. Hiệu năng: 300 năm mô phỏng thế giới dưới 1 giây (kinh tế chỉ thêm khoảng 63 chỉ số mỗi tháng).
8. Lưu và tải giữ nguyên `world.eco`; thế giới cũ tự khởi tạo (không đổi `TT.VERSION`).

### A.9 Rủi ro riêng của kinh tế
| Rủi ro | Cách giảm |
|---|---|
| Lạm phát hoặc khai thác lỗ hổng (buôn vòng, mua rẻ bán đắt giữa hai nơi) | Spread, hạn mức tháng, cước, trượt giá khi bán dồn, đo `econ-sim` cho mọi cặp vùng |
| Giá dao động quá mạnh làm người chơi bỏ cuộc | Trần 3 lần, sàn 0,45 lần, tốc độ về cân bằng 0,18/tháng, giảm sốc nhờ hội |
| Cú sốc cộng dồn nhiều nguồn | Mỗi nhóm một lớp dịch chuyển, trần tổng cộng; biên niên sử ghi nguyên nhân chính |
| Quá phức tạp khi đọc | Mặc định chỉ thấy giá và mũi tên; sơ đồ là tính năng mở khóa theo nghề |
| Làm hỏng cân bằng NPC | Kinh tế không tác động tu luyện NPC; kiểm bằng bài cân bằng sẵn có |

### A.10 Đã chốt (2026-10-17, trả lời 7 câu của bản 5)
| Câu | Quyết định của bạn | Cách làm |
|---|---|---|
| 1 Phạm vi | Làm **đến E6 một mạch** | Giữ thứ tự E0 đến E6, chơi thử sau cả đợt (vẫn kiểm thử và snapshot sau từng chặng) |
| 2 Hạn dùng | **Có**, tính đơn giản, một đồng hồ cho cả chồng | Xem A.12 |
| 3 Chuyến buôn | Bạn chưa hiểu câu này, và dặn "tùy tính sao hiệu quả" | Chọn cách hiệu quả: **trừu tượng, không sức chứa**, giới hạn bằng hạn mức tháng của nơi + cước + rủi ro; giải thích ở A.13 |
| 4 Thuế | Chỉ ở **Nha môn** | A.4 |
| 5 Gia nhập hội | Cần **thiện cảm với hội** (ngoài tài sản); Thương nhân cần **bằng cấp nghề và tổng tiền kiếm được** đạt mốc | Xem A.15 |
| 6 Giá theo cửa hàng | **Có cạnh tranh nhưng mua ở đâu cũng có sức nặng** | Xem A.14: mua ở chợ thì có cơ hội kết thân, mua ở hội thì tăng thiện cảm với hội, v.v. |
| 7 Chính trị hội, số hội | Giữ nguyên bản 4 (3 hội lớn, tịch thu, một hội một tông, cú sốc do hội) | Giữ |
### A.12 Hạn dùng (đơn giản, một đồng hồ cho cả chồng)
- **Món có hạn:** đan dược 18 tháng, bùa chú 24 tháng, linh thảo 12 tháng; nanh, da, quặng, sách, linh thạch, trang bị **không** hỏng. Chỉ áp dụng cho túi đồ người chơi (kho cửa hàng và NPC không tính).
- **Mỗi chồng cùng loại có một mốc hỏng chung** `c.invExp[id]` (tháng tuyệt đối), không theo dõi từng món. Mua hay nhặt món mới thì cộng thêm một ít, theo đúng ý bạn:
  ```
  mới có  n món trong chồng (còn r tháng), thêm k món (mỗi món sống L tháng):
  r' = min(L, r + L x k / (n + k))
  ```
  Ví dụ đan L=18 còn 6 tháng, đang có 3 viên, mua thêm 1 viên: r' = 6 + 18 x 1/4 = 10,5 tháng; chồng 20 viên thêm 1 viên chỉ cộng 0,86 tháng. Nghĩa là gom nhiều thì mốc hỏng gần hơn, nên phải dùng hoặc bán sớm; chồng nhỏ thì được cộng nhiều.
- **Hỏng:** hết mốc thì cả chồng mất (ghi nhật ký "N Hồi Xuân Đan đã hết hạn dùng"); còn 3 tháng thì cảnh báo trong nhật ký và hiện ở thẻ vật phẩm "còn X tháng".
- **Cửa hàng:** món bán ra luôn mới, `L` đầy; chỉ nhận mua lại món còn ít nhất 1/3 hạn (giá giảm theo phần hạn còn: `0,5 + 0,5 x r/L`).
- **Trợ lý Tự động:** ưu tiên dùng hoặc bán chồng sắp hết hạn; không tích trữ quá mức cần.
- **Kỹ thuật:** `c.invExp = { id: tháng }` (khởi tạo muộn); `TT.items.add` cập nhật mốc; một bước kiểm tra mỗi tháng (chỉ người chơi); `D.ITEMS[id].life` (tháng) cho đan, bùa, thảo; bài kiểm thử cho công thức cộng, cảnh báo, hỏng, mua lại, lưu/tải.

### A.13 Giải thích câu 3 (chuyến buôn) và cách chọn
Câu hỏi là: khi Thương nhân mua hàng ở thị trấn A đem bán ở thành B, **có tính túi đồ chứa được bao nhiêu** (ô, cân nặng, kiểu "chở đầy xe" mới đi được) **hay chỉ tính trừu tượng** (mua một lô, tốn thời gian đi đường, cước, có rủi ro cướp, bán lô đó). Chọn phương án **trừu tượng**: túi đồ game hiện không có sức chứa nên không dựng thêm; số lượng một chuyến bị giới hạn bởi **hạn mức tháng** của nơi mua và nơi bán (đã có), cước tăng theo giá trị lô, nguy cơ cướp theo tuyến và `guard` hội, và hạn dùng (A.12). Đủ để buôn có rủi ro và có giới hạn mà không thêm hệ mới.

### A.14 Cạnh tranh giữa các kênh mua và "sức nặng" của lựa chọn
Cùng một thành có nhiều kênh; chọn kênh nào cũng được **một thứ khác**, không có kênh "luôn tốt nhất". Giá cuối = `chỉ số vùng x hệ số kênh x (1 - giảm theo thiện cảm)`. Cạnh tranh nhẹ: kênh cùng nhóm hàng chênh nhau ±3 đến 6%, đổi theo kho và theo ngày chợ.
| Kênh | Giá và hạn mức | Được gì thêm | Mất gì |
|---|---|---|---|
| Chợ (dân thường) | giá cao nhất, kho đủ loại thường | mỗi lần mua lớn có **cơ hội kết thân** với người ở chợ (chủ quán, dân sở tại, tăng thiện cảm và có thể mở sự kiện kết bạn): khoảng 4% mỗi lần, cao hơn nếu mua đều, cao hơn nếu có nghề Thương nhân | không giảm giá |
| Cửa hàng chuyên (Đan các, Khí phô, Phù trai, Thư các) | đắt hơn 5-8%, có hàng hiếm hơn và phẩm tốt | uy tín cửa hàng, thỉnh thoảng được báo tin hàng quý | đắt |
| **Thương hội** (hội sở) | rẻ hơn 5-10%, hạn mức lớn, kho sỉ | mỗi lần mua tăng **thiện cảm với hội** (điểm 0-100), mở giá hội viên, sỉ, bảo hiểm | bị dính chính trị (hội đối thủ ghét, tông ghét nếu hội ép), thiện cảm tụt nếu mua của hội đối thủ |
| Kho tông | rẻ nhất với thành viên | trả bằng cống hiến, nghĩa vụ | cần là thành viên |
| Hàng rong | đắt, hàng lạ | món hiếm | ít, không hạn |
| Chợ đen | rẻ hoặc hiếm | hàng cấm, đồ chưa giám định | có thể là đồ nhái, tăng nghiệp hoặc bị truy; thiện cảm hội và tông giảm |
- **Thiện cảm với hội (`c.hoi[hộiId]` 0-100):** cộng khi mua bán qua hội, làm nhiệm vụ hội, đưa hàng; trừ khi bội ước, buôn lậu, mua của hội đối thủ; trôi chậm về 0 nếu lâu không giao dịch. Hiệu lực: giá giảm tới 8%, hạn mức sỉ, mở quầy hội viên. Cấp độ: khách (0-25), quen mặt (26-45), tin cậy (46-65), thân thiết (66+).
- **Kết thân ở chợ:** dùng hệ quan hệ sẵn có (`TT.rel`) với người đang ở nơi bán (cùng `place`); không ép cốt truyện, chỉ nâng cơ hội kết bạn hoặc nhờ vả sau này.
- Mục tiêu thiết kế: người chơi cân nhắc *giá, kho, quan hệ, chính trị, rủi ro*, không chỉ nhìn một con số.

### A.15 Điều kiện gia nhập thương hội (E4b)
Hai con đường, đều cần ghé hội sở ở thành lớn:
1. **Người thường:** tài sản tối thiểu (khoảng 200 linh thạch hạ phẩm cho khách, 1000 cho hội viên) **và** thiện cảm với hội đó từ 46 (tin cậy) trở lên; chưa vào hội nào, không đang là kẻ thù của hội.
2. **Thương nhân (nghề):** cấp nghề Thương nhân từ 3 (xem như "bằng cấp") **và** tổng tiền kiếm được qua buôn bán (`c.tradeEarn`, tổng lãi từ bán hàng, chuyến buôn, đơn hội, không tính tiền vặt) đạt mốc (khoảng 500 linh thạch hạ phẩm cho hội viên, 5000 cho quản sự) **và** thiện cảm từ 26. Con đường này vào thẳng bậc cao hơn.
- Bậc hội: khách, hội viên, quản sự, chấp sự, hội trưởng; lên bậc theo tổng giao dịch, thiện cảm và đóng góp (không theo tu vi). Mỗi người chơi một hội và một tông; xung đột thành sự kiện (tầng 2).
- Quyền lợi theo bậc: phí bán 5% xuống 2%, hạn mức sỉ, đi theo đoàn có hộ vệ, bảo hiểm, vay, tin sớm, bảng đơn hàng và nhiệm vụ hội. Nghĩa vụ: phí năm, nhận một số đơn, không bán cho hội đối thủ trong hợp đồng độc quyền.

### A.16 Chặng làm đã sửa (E0 đến E6, một mạch)
- [x] **E0** đo hiện trạng (`tools/econ-sim.js`: lệch giá, chênh vùng, lãi buôn sau cước; lãi tối đa 25% trung bình sau khi thu đặc sản về 0,86 và 1,16).
- [x] **E1** chỉ số giá 63 ô, spread theo quy mô, trượt giá bán dồn, biểu đồ nhỏ; **hệ số kênh** (A.14), cạnh tranh nhẹ giữa các cửa hàng cùng nhóm.
- [x] **E2** cung cầu từ tài nguyên, dân số, tông, chiến sự; kho cửa hàng hồi theo cung vùng.
- [x] **E3** cú sốc nối vào thế cuộc, tin đồn, biên niên sử, bảng giá và thuế ở Nha môn; **hạn dùng** (A.12) vì cần tin "hết hạn" và cảnh báo.
- [x] **E4** kênh tông và thương hội: hợp đồng sỉ, `δ` ép chênh, đầu cơ và xả hàng; **thiện cảm hội** (A.14) và **kết thân ở chợ**.
- [x] **E4b** gia nhập hội (A.15): hai con đường, bậc, quyền lợi, nghĩa vụ, nhiệm vụ hội, vay, bảo hiểm.
- [x] **E5** nghề Thương nhân và sơ đồ số liệu mở theo cấp; chuyến buôn trừu tượng (A.13); tin sớm.
- [x] **E6** chợ đen, giám định, đấu giá thủ phủ (nhà đấu giá I4), hàng nhái; hoàn thiện cân bằng toàn bộ bằng `econ-sim`.
### A.17 Trạng thái làm (2026-10-17)
- Xong: giá 63 ô theo cung cầu (`systems/eco.js`), cú sốc có báo trước, thuế và bảng giá ở Nha môn, hạn dùng (giá bán giảm tuyến tính, 3 tháng cuối còn 40%), kênh mua có hệ số riêng, sức ép mua bán dồn, thiện cảm hội và hội viên (`systems/hoi.js`), hai đường gia nhập, kết thân ở chợ, đồ nhái ở chợ đen, biểu đồ giá theo tầm nhìn Thương nhân.
- Cướp đường (`TT.cross.robbery`: hàng buôn từ ~150 hạ phẩm, thương đoàn và bậc hội giảm rủi ro, mất 25-60% hàng) và nhà đấu giá ở thành trì (3 món mỗi quý, ra giá x1 / x1,25 / x1,6, thua không mất tiền).
- Đan, bùa, thảo còn 3 tháng: chế độ Cân bằng/Tự động tự hiến kho tông (nếu đang ở tông, đổi cống hiến, chung trần quyên năm) hoặc tự bán (nếu đang ở nơi có cửa hàng thu); Thủ công thì không tự làm. Nút Hiến tông thủ công trong túi đồ.
- Chưa làm: giám định, nhiệm vụ/vay/bảo hiểm hội.

### A.18 E7a đã làm (2026-10-19): thuế vào giá và móc S

- **Mã:** `js/data/eco.js` (`sx`, `taxRate`, `taxK`, `vanCut`, `tithe`, `le`, cú sốc `chien_tong`), `js/systems/eco.js` (`rate`, `taxOld`, `tax`, `damp`, `festOf`, `raise`), `js/systems/faith.js` (thuế hương hỏa cuối `yearly`), `tools/baseline.js` (`--eco=off`), `tools/econ-sim.js` (mỗi năm gọi `fac.yearly`, băm 63 ô), `tools/econ-check.js` (mới, đường cơ sở kinh tế), `tests.html` (bài E7a). Không đổi `TT.VERSION`; trường mới đọc từ dữ liệu, không khởi tạo, không gọi `rng`.
- **Thuế vào giá:** thuế suất vùng = 0,45 + 0,40 x (1 - kho triều/100) + 0,15 nếu chiến tuyến + 0,15 x (55 - dân tâm)/55 (khi dân tâm dưới 55) + 0,10 nếu loạn + 0,03 mỗi đoạn tuyệt của vùng - 0,15 x (vận - 50)/50 (khi vận trên 50); kẹp 0,2 đến 1,2. Giá mua nhân `1 + thuế suất x 0,15`, nên phần thêm nằm trong 0,03 đến 0,18 (cùng trần thuế cũ). Giá bán vẫn trừ một nửa phần thêm như cũ. Không đếm đôi với `taxPull`: thuế dân vẫn kéo kho triều như cũ, giá chỉ đọc kho.
- **Lễ hội (cầu tạm thời):** mỗi tín ngưỡng có một tháng lễ và tối đa ba nhóm hàng (bảng `D.ECO.le`: Vu Lan tháng 8 cho bùa và linh thảo, Thượng nguyên tháng 1 cho đan và bùa, lễ Khổng Tử tháng 9 cho sách...). Chỉ trong tháng đó, cầu nhân `1 + mức lễ x min(1, 2 x tỉ phần ô 1)`; lý do "lễ ..." hiện ở Bảng giá của Nha môn.
- **Thuế hương hỏa:** mỗi năm `0,02 x Σ(tỉ phần ô x hương hỏa)` cộng vào kho triều của vùng (triều còn sống). Đây là nguồn khác, không phải thuế dân; triều vẫn kéo về mức thuế dân nên tác động là dịch chuyển mức cân bằng, khoảng +0,6 kho mỗi năm.
- **Quốc vận làm cú sốc nhỏ:** biên độ cú sốc (cả cầu và cung) nhân `1 - 0,3 x (vận - 50)/50`, tối đa giảm 30% ở vận 100, không giảm khi vận dưới 50.
- **Chiến tranh tổng (S6):** khai báo `chien_tong` với `chance: 0` (không tự sinh, không gọi `rng`), 12 tháng, cầu x1,5 và cung x0,8. `TT.eco.raise(loại, vùng, báo trước)` đưa cú sốc vào hàng chờ; S6 gọi sau. Hiện chưa có chỗ gọi.
- **Công tắc `D.ECO.sx = false`:** thuế về kiểu cũ (`taxOld`), không lễ, không giảm cú sốc, không thuế hương hỏa, `raise` trả về false.

**Kiểm chứng:**
- `node tools/baseline.js --eco=off --check`: 40/40 hạt giống trùng khít đường cơ sở trước E7a (thế giới không đổi).
- `node tools/econ-check.js --eco=off --check`: 40/40 hạt giống trùng khít băm 63 chỉ số giá trước E7a.
- Bật (mặc định): `baseline --check` lệch có chủ ý (hương hỏa đổi kho triều); đã lập lại mốc `seeds.json` và `econ.json`.
- `tests.html` **104 đạt, 0 lỗi** (bài E7a mới: công thức và khoảng, lễ đúng tháng và đúng tỉ phần, quốc vận và trần, chiến tranh tổng không tự sinh, hương hỏa đúng công thức, tắt như cũ, lưu/tải, bản cũ, 400 năm có kinh tế nối S).
- Playwright: Nha môn ở máy tính 1366x850 và điện thoại 390x844: hiện đủ, không lỗi console, không tràn ngang.

**Đo (40 hạt giống 101 đến 140, 300 năm):**

| Chỉ tiêu | Trước E7a | Sau E7a |
|---|---|---|
| Chiến tranh mỗi 300 năm | 49,4 | 47,5 |
| Diệt vong | 6,2 | 6,0 |
| Đổi chủ triều | 4,6 | 4,5 |
| Mất mệnh | 0,8 | 1,0 |
| Quốc vận cuối kỳ / nho khí | 53,9 / 57,5 | 53,0 / 56,0 |
| Lệch giá so với thường (TB) | 0,117 | 0,118 |
| Chênh giá giữa vùng (TB, max) | 1,46 (2,58) | 1,46 (2,56) |
| Lãi buôn tối đa mỗi chuyến (TB, max) | 48,5% (101%) | 49,2% (104%) |
| Cú sốc mỗi thế giới | 452,9 | 454,3 |

- **Chưa đạt chỉ tiêu lãi buôn:** trung bình lãi tối đa khoảng 49%, không phải khoảng 25% như mục 6 của Z. Phép đo lấy mức lớn nhất trên mọi cạnh và nhóm mỗi năm, nên bị các chênh giá cực đoan kéo lên (max 104%). Thuế mới gần như không đổi mức giá trung bình nên không kéo được con số này. Cần chỉnh cơ chế thương hội (chênh giá đóng chậm), để một chặng riêng.
- `econ-sim.js` nay gọi `fac.yearly` mỗi năm, nên số "trước" đo lại trên mã cũ bằng công cụ mới, không so với số E0 cũ.

**Khác kế hoạch / chưa làm:**
1. Kế hoạch ghi thuế "chữ và bậc, không số": Nha môn hiện vẫn ghi số `Thuế chợ N%` (có từ trước). Giữ nguyên, chờ bạn chọn.
2. Giám định, nhiệm vụ hội, vay và bảo hiểm: chuyển sang **E7b** (chưa làm).
3. `chien_tong` mới khai báo; S6 gọi `TT.eco.raise`.
4. Hương hỏa và lễ hội chưa có giao diện riêng ngoài Bảng giá của Nha môn.
5. Mức thuế, mức lễ, tỉ lệ hương hỏa là số đoán để chơi thử, chưa qua cân chỉnh.

### A.19 E7b đã làm (2026-10-19): giám định, hội (nhiệm vụ, vay, bảo hiểm)

- **Mã:** `js/systems/appraise.js` (mới: `TT.gd`, giám định và đồ nhái), `js/systems/hoi.js` (vay, bảo hiểm, bảng đơn, quyền lợi `perk`), `js/systems/items.js` (đồ chợ đen chưa giám định, tiến độ đơn ở hội sở, rút món giảm sổ giám định), `js/systems/crossing.js` (`robbery` trả giá trị hàng mất; `arrive` gọi `TT.hoi.claim`), `js/systems/buildings.js` (đấu giá: món thắng có thể là đồ nhái; nhà đấu giá có nút giám định), `js/systems/eco.js` (nhịp tháng gọi `TT.hoi.tick`), `js/ui/shop.js` (mục Nhiệm vụ, Vay, Bảo hiểm trong cửa sổ hội; mục Giám định ở chợ đen), `js/data/eco.js` (`hq`, `gd`, `ins`, `loan`, `jobs`, `cargo`), `js/files.js`, `tools/baseline.js` và `tools/econ-check.js` (`--hq=off`), `tests.html` (bài E7b). Không đổi `TT.VERSION`; trường mới (`c.sus`, `c.hoi.loan`, `c.hoi.ins`, `c.hoi.job`) đọc qua hàm và khởi tạo muộn.
- **Giám định:** món mua ở chợ đen và món thắng đấu giá chưa rõ thật giả, lưu ở `c.sus[id] = {n, f}` (n món, f là đồ nhái, người chơi không thấy). Giám định một loại: phí `6 x (1 + cảnh giới)` vàng; độ chính xác `0,55 + 0,08 x tầm nhìn` (tầm nhìn 0 đến 5 theo `TT.eco.insight`). Kết quả đúng: "nhái" thì bỏ phần nhái khỏi túi, "thật" thì hết nghi. Sai (chỉ khi thật ra là nhái): nói "thật" với xác suất 0,3, còn lại "chưa chắc". Tầm nhìn từ 4 (Thương nhân cấp cao hoặc hội viên có nghề) thì miễn phí, và đồ nhái bị bỏ ngay khi mua. Đồ chợ đen nhái xác suất `nhái x (1 - 0,15 x tầm nhìn)`, như cũ, nhưng nay chỉ lộ khi giám định. Bán hoặc dùng bớt món thì số nghi giảm theo.
- **Vay hội (chỉ hội viên không nợ):** hạn mức theo bậc `[200, 600, 2000, 6000, 15000] x 10 vàng`, một khoản một lúc, lãi đơn 8% mỗi năm, trả trong 24 tháng. Quá hạn: mất quyền lợi hội viên (giảm giá, phí bán, vay, bảo hiểm, đơn), thiện cảm hội giảm 6 mỗi năm đến khi trả hết. Không tịch thu tài sản, không khai trừ vì nợ (khai trừ vì phí năm vẫn như cũ). Trả hết thì quyền lợi trở lại.
- **Bảo hiểm chuyến buôn (chỉ hội viên không nợ):** phí 4% giá trị hàng buôn trong túi, một hợp đồng một chuyến. Khi tới nơi, nếu bị cướp thì bồi thường `min(trần, 60% hàng mất)`, trần là 30% giá trị hàng đã mua bảo hiểm. Không bị cướp thì phí mất.
- **Nhiệm vụ hội:** mỗi quý mỗi hội có ba đơn (tất định theo hội và quý): giao hoặc thu mua 3, 5 hoặc 8 món của một nhóm, tại hội sở của hội. Thưởng `số món x 1,3 x giá món đại diện`, thiện cảm +5, cộng vào tổng giao dịch (để lên bậc). Một đơn một lúc, hết quý chưa xong thì thiện cảm -3. Chỉ hội viên của hội đó nhận đơn.
- **Công tắc `D.ECO.hq = false`:** không vay, bảo hiểm, đơn, giám định; đồ chợ đen nhái lộ ngay khi mua như cũ.

**Kiểm chứng:**
- `node tools/baseline.js --check` và `--hq=off --check`: 40/40 trùng khít mốc (E7b không chạm thế giới; người chơi không có trong mô phỏng thế giới).
- `node tools/econ-check.js --check` và `--hq=off --check`: 40/40 băm 63 chỉ số giá trùng khít mốc.
- `tests.html` **105 đạt, 0 lỗi**. Bài E7b mới: độ chính xác giám định theo tỉ lệ (400 lần), phí và miễn phí theo tầm nhìn, đồ thật không bị kết luận nhái, vay theo hạn mức, lãi, quá hạn và trả hết, bảo hiểm phí và trần và một hợp đồng một chuyến, đơn nhận và xong (đúng chiều, thưởng), hết quý thì hỏng, lưu/tải, bản cũ, tắt thì đóng, đọc bảng đơn nhanh.
- Playwright: cửa sổ hội (Thương hội), chợ đen và nhà đấu giá ở máy tính 1366x850 và điện thoại 390x844: hiện đủ chữ và nút, không lỗi console, không tràn ngang.

**Đo lại `tools/econ-sim.js` (40 hạt giống 101 đến 140, 300 năm):** trước và sau E7b giống nhau: lệch giá 0,118, chênh giá vùng 1,46, cú sốc 454,3 mỗi thế giới. Lãi buôn tối đa trung bình **49,2%** (max 104%), vẫn chưa đạt khoảng 25%. Lý do: E7b chỉ đổi phía người chơi, còn công cụ đo chỉ có NPC buôn. Chưa có công cụ đo chuyến buôn của người chơi.

**Khác kế hoạch / chưa làm:**
1. Đo chuyến buôn của người chơi (lãi ròng, bảo hiểm, phí) chưa có công cụ; chỉ tiêu 25% vẫn mở, cần chặng riêng.
2. Hộ tống trong đơn hội chưa làm (cần hệ đoàn buôn); chỉ có giao và thu mua.
3. Giám định chỉ cho đồ chợ đen và đấu giá; hàng rong và kho tông không nhái.
4. Con số (phí giám định 6 vàng, lãi 8%, trần bảo hiểm 30%, thưởng 1,3 lần giá) là số đoán, cần chơi thử.
5. Quá hạn không tịch thu tài sản và không khai trừ tức thì; nếu cần áp lực hơn, phải thêm ở chặng sau.

**Mốc lại sau S6a (2026-10-19):** `node tools/econ-check.js --save`; chỉ 27/40 hạt giống lệch băm giá, do S6a đổi dòng chiến tranh (lệch có chủ ý, bảng 63 chỉ số đo lại: lệch giá 0,118, chênh vùng 1,46, cú sốc 455,8 mỗi thế giới, lãi tối đa 49,1%).

**S6b (2026-10-19):** cú sốc `chien_tong` đã có chỗ gọi: mỗi năm mỗi chiến tuyến của chiến tranh tổng gọi `TT.eco.raise` (trừ giai đoạn nghị hòa). Đo lại 40 hạt giống: lệch giá 0,123, chênh vùng 1,48, lãi tối đa 51,3%, cú sốc 454,0 mỗi thế giới; 33/40 băm lệch so với mốc sau S6a, có chủ ý (xem S mục 15.18).

### A.11 Nhật ký bản 5
- 2026-10-17: bạn bảo bắt đầu thiết lập kế hoạch kinh tế sau khi hoàn thiện thế giới (F4, F2, tài nguyên). Đọc `items.js` (chợ giá tĩnh), `buildings.js` (hạn mức, kho cửa hàng), `factions.js` (hội). Viết mục A: điều kiện nền đã có, thu gọn mô hình thành 63 chỉ số giá (9 vùng x 7 nhóm), công thức cung cầu lấy từ tài nguyên, dân số, tông, hội, chiến sự, chặng E0 đến E6 mới, bảng mốc E0, tiêu chí, rủi ro, 7 câu hỏi. Chưa code.

---
## 0. Cách đọc tài liệu này (bản 4, nền thiết kế)
Bản 3 xây kinh tế từ thế giới ra theo mạch **nguồn - đường - đích**. Bản 4 giữ nguyên mạch đó và thêm **một nhân vật mới ở giữa đường**: thương hội. Câu chuyện một dòng:

> Tông môn nắm nguồn hàng thiết yếu, vương triều nắm đường sá và thuế, tán tu nắm số đông người mua. **Thương hội là người đứng giữa cả ba**: mua sỉ của tông, bán lẻ cho tán tu, tiếp tế cho vương triều, cho tông vay, mua chuộc quan, nuôi một đội hộ vệ nhỏ để bảo vệ hàng. Họ giàu và có tiếng nói chính trị nhưng **không có quân đội**; sống nhờ lợi nhuận và quan hệ, nên luôn sợ chiến tranh vô ích và bị tông hoặc triều nuốt.

Ba câu hỏi bạn đặt ra vẫn là xương sống: (1) ai làm ra, ai giữ, ai dùng; (2) cái gì làm cung cầu đổi và có đáng kể không; (3) Thương nhân nhìn thấy gì.

## 1. Sự thật đo được của thế giới hiện tại
- Mỗi vùng khi sinh chỉ có khoảng **35 nhân vật**; vùng khác chỉ dựng khi bạn tới. NPC **không chế tác** và **ít đột phá** (80 năm hai thế giới thử: 27 lần đột phá, không ai lên Trúc Cơ).
- Chợ hiện bán hàng vô hạn, giá cố định, "bán lại" 50-62% giá nền.
- Đã có sẵn: chín **vương triều** (mỗi vùng một), chín tông môn, khoảng tám gia tộc; chiến tranh, diệt môn, thời đại có hệ số giá, tiền tuyến, thời tiết, tin đồn bí cảnh, hệ thế lực mô phỏng cấp năm (`world.fac`).

**Kết luận thiết kế:** không đếm từng NPC. Kinh tế chạy bằng **dân số ẩn theo vùng** cộng **cú sốc có tên** lấy từ thế cuộc; thương hội là **thế lực cấp năm** như tông và triều, mô phỏng rẻ. Người chơi và NPC lõi chỉ là hạt nhỏ tác động nhẹ vào thị trường.

## 2. Bức tranh: nguồn - đường - đích, có thương hội

```
 NGUỒN (làm ra)                ĐƯỜNG (phân phối)                      ĐÍCH (dùng)
 ---------------------------   ----------------------------------    ---------------------------
 Tông môn chuyên nghề   ~70%   Kho tông: hạn mức, giá nội bộ          Đột phá (Phá Cảnh Đan)
 Tán tu thợ (nhỏ lẻ)    ~25%   THƯƠNG HỘI: mua sỉ của tông, chở       Chiến sự, bí cảnh (bùa, đan)
 Xưởng của hội  (<= 12%)  ->     sang vùng thiếu, bán cho chợ,     -> Chữa thương, hồi phục
 Bí cảnh (rơi, hiếm)    ~2%      bán cho vương triều (quân nhu)      Quân nhu của vương triều
 Thiên nhiên (thảo, quặng)     Chợ tán tu / thị trấn (cung cầu)       Chế tác khác (nguyên liệu)
                               Chợ đen (hàng cấm, đồ nhái)
```
- **Tông môn** giữ nguồn thiết yếu, bán **sỉ cho hội** (giá 0,9 x giá tông) và **lẻ cho thành viên** (giá nội bộ).
- **Vương triều** thu thuế, mở hay đóng cửa ải, mua quân nhu, đặt giá trần thời chiến; **không** sản xuất đan.
- **Tán tu** vừa là người bán (thợ nhỏ, thợ mỏ, thợ săn) vừa là phần lớn người mua ngoài tông.
- **Thương hội** nối cả ba bên và ăn chênh lệch (buôn, cước, phí, tín dụng).

## 3. Hàng thiết yếu và thế độc quyền của tông môn (câu hỏi 1)

### 3.1 Tông giữ giá, hội và tán tu chia phần còn lại
Mô hình "hãng chi phối + đám đông ngoại vi" như bản 3, nay có thêm hội:
- **Tông** chiếm `σ` nguồn cung, đặt giá tông `Pt = MC x (1 + m)`, `m = 0,15 + 0,5 x σ` (tối đa 0,90). Bị chặn bởi uy tín tông (chính đạo giữ giá thấp, tà đạo cao), cạnh tranh phần dư từ tán tu và hội, và sợ bất ổn.
- **Thành viên tông** mua ở kho tông với `0,8 x Pt`, trong hạn mức theo bậc, cần cống hiến.
- **Thương hội** mua sỉ theo hợp đồng `0,9 x Pt` (khối lượng lớn, hạn mức theo quan hệ tông-hội), nên giá vốn của hội thấp hơn người ngoài lẻ.
- **Người ngoài** mua qua hội hoặc chợ tán tu; không qua hội thì phải xếp hàng chợ tông với giá `1,2 x Pt`, hạn mức rất nhỏ.
- Hạn mức làm thế độc quyền "gay gắt": người ngoài hay thiếu thiết yếu, phải mua của hội (rẻ nhưng bị giữ hàng), chợ tán tu (đắt, nhảy giá), hoặc đi bí cảnh.

### 3.2 Hệ quả cho người chơi
| Thân phận | Cách mua thiết yếu | Giá thực tế | Ưu / nhược |
|---|---|---|---|
| Thành viên tông | kho tông trong hạn mức | thấp nhất, ổn định | cần cống hiến, nghĩa vụ |
| Hội viên thương hội | kho hội, hợp đồng sỉ, đoàn buôn | gần giá tông, ổn định hơn chợ | phí hội, nghĩa vụ nhận đơn, ràng buộc chính trị |
| Tán tu | chợ tán tu, thương nhân, bí cảnh | theo cung cầu, nhảy mạnh khi cú sốc | tự do, nhưng chịu cú sốc đầu tiên |
| Thương nhân độc lập | mua sỉ vùng rẻ, bán vùng đắt | chênh vùng, thời điểm | cạnh tranh với hội, tự gánh rủi ro đường |
| Thợ luyện đan tán tu | tự làm | nguyên liệu 55% giá trị (đã áp dụng) | lãi mỏng |

### 3.3 Hạn dùng và tồn kho
Đan 18 tháng, bùa 24 tháng; hàng tồn quá hạn mất 5% giá trị mỗi tháng. Hàng bí cảnh rơi (nhỏ, quý) là nguồn cung ngoài tầm tông và hội; khi tông đóng kho hoặc bị diệt, phần này làm sàn cho giá.

## 4. Thương hội: trung gian giao thương và đại diện giai cấp tư bản

### 4.1 Hội là gì trong thế giới này
Một **thế lực loại thứ tư** (`kind: 'hoi'`) trong `world.fac`, ngang hàng vương triều, tông môn, gia tộc về cách mô phỏng (cấp năm, có lãnh tụ NPC lõi, tên, lịch sử, có thể thịnh/suy/diệt, ghi vào Biên niên sử). **Số lượng: 3 hội lớn xuyên vùng** (mỗi hội phủ 3-6 trong 9 vùng, mỗi vùng có 1-3 hội cạnh tranh) cộng vài hội nhỏ cấp vùng sinh ra theo thời đại. Ví dụ đặt tên: *Vạn Bảo Thương Hội* (gần triều, lớn nhất), *Thanh Phong Hành* (ủng hộ tự do thương mại, nhiều tán tu), *Hắc Kim Hội* (chợ đen, quan hệ tà đạo).

Bản ghi mỗi hội:
| Trường | Ý nghĩa |
|---|---|
| `wealth` | vốn lưu động (của cải), tăng theo lợi nhuận, giảm theo thua lỗ, hối lộ, chi hộ vệ |
| `reach` | số vùng có chi nhánh (và độ phủ từng vùng 0-1) |
| `trust` | uy tín 0-100: giá phí, được tông bán sỉ, được người chơi gia nhập |
| `guard` | hộ vệ đoàn 0-30: sức bảo vệ đoàn buôn và hội sở (xem 4.4) |
| `infl` | ảnh hưởng chính trị với từng vương triều và tông, 0-100 (xem 4.5) |
| `agenda` | thiên hướng: *tự do thương mại*, *trục lợi chiến tranh*, *gắn bó triều*, *chợ đen* |
| `leader` | NPC lõi (có thể chết, kế vị) |
| `state` | thịnh / ổn / suy / diệt |
| `own` | tỉ phần tự sản xuất theo nhóm hàng, tối đa 12% |

### 4.2 Vai trò kinh tế (trung gian)
1. **Mua sỉ và phân phối:** nhận hàng từ tông (hợp đồng sỉ), từ tán tu thợ, từ xưởng riêng; chở sang vùng thiếu; bán cho chợ, tán tu, vương triều.
2. **Làm co hẹp chênh giá giữa vùng** (arbitrage): ở vùng hội phủ `δ` (0-1), chênh giá vùng thực tế `= chênh_thô x (1 - 0,5 x δ)`, và trần giá khi khan hạ từ 3 lần xuống `3 - 1,0 x δ`. Hội kiếm lãi từ phần chênh bị ép; thương nhân độc lập thấy biên mỏng đi ở tuyến hội mạnh.
3. **Hợp đồng và tín dụng:** cho tán tu, tông, triều vay lãi `r0 + 4%`; bảo hiểm hàng (phí = xác suất cướp x 1,2); bảng giá và tin tức (mạng lưới thông tin là nguồn của "biết trước biến cố" ở nghề Thương nhân).
4. **Dịch vụ thành:** kho cất đồ, giám định, đấu giá nhỏ ở thành lớn; phí thấp cho hội viên.
5. **Phí và biên:** hội thu `8-15%` trên khối lượng qua tay; phí bán 3% cho hội viên, 5% cho người ngoài.

### 4.3 Tự cung có giới hạn (không quá nhiều, không quá mạnh)
- Hội có **xưởng riêng** (đan phòng, lò đúc, trại thảo) nhưng tổng sản xuất **không quá 12%** nguồn cung mỗi nhóm hàng của một vùng, chủ yếu hàng phẩm thấp-trung, thuê tán tu thợ làm gia công.
- **Vì sao bị chặn (lý do trong game):** thiếu bí truyền (đan phương cao cấp thuộc tông), thiếu nguyên liệu tinh, và tông trả đũa nếu hội cạnh tranh trực diện (cắt hàng sỉ, tăng giá, đòi thêm quà). Hội tự cung nhiều thì quan hệ với tông xấu đi 2 điểm mỗi 1% vượt 8%.
- Tác dụng: dập bớt cú sốc nhỏ, tạo cạnh tranh vừa phải với tán tu thợ, nhưng không thay được tông.

### 4.4 Hộ vệ đoàn: lực lượng tự bảo vệ nhỏ
- `guard` 0-30 (tông 0-100, triều đi theo quân số riêng). Đội do thuê tán tu, lính đánh thuê (nghề đã có), vài cao thủ Trúc Cơ đến Kim Đan; **không có quân đội**, không tấn công địa điểm.
- Tác dụng: giảm xác suất cướp đoàn buôn của hội `x (1 - 0,6 x guard / 30)`; giữ hội sở trước cướp và trộm; hộ tống cho hội viên (phí 6%).
- **Giới hạn:** nếu tông hay triều đe dọa trực tiếp, hội **không chống**; chỉ chạy, nộp quà, hoặc nhờ bên thứ ba. Hộ vệ không được dùng để gây chiến (hội không có quyền "tuyên chiến"); nếu hội thuê người đi giết đối thủ làm ăn thì thành sự kiện tai tiếng, có thể bị tông/triều trừng phạt.

### 4.5 Quyền lực chính trị (nhưng không có quyền lực quân sự)
Đại diện lợi ích giai cấp tư bản; công cụ là tiền, nợ, quan hệ:

| Đòn bẩy | Cách tác động | Hiệu quả tối đa |
|---|---|---|
| Vận động giảm thuế qua cửa ải | `thuế = thuế_gốc x (1 - 0,4 x infl_triều / 100)` | -40% thuế |
| Giữ thông thương, chống đóng cửa ải | xác suất cửa ải đóng giảm `x (1 - 0,5 x infl / 100)` | -50% |
| Cản giá trần thời chiến | giá trần ít khắt khe, hàng vẫn chảy | giảm sức ép trần 40% |
| Cho triều/tông vay (nợ chiến tranh) | tăng `infl`, đổi lại triều/tông nợ hội | khi vỡ nợ: hội mất tiền hoặc chiếm quyền thu thuế một trạm |
| Môi giới hòa nghị | xác suất chiến tranh kéo dài giảm `x (1 - 0,3 x infl)` | -30% (nếu hội thấy chiến không có lợi) |
| Hối lộ quan, thanh tra | tránh phạt, né thuế, kiếm giấy phép | đổi `wealth` lấy giảm rủi ro; lộ ra thì mất uy tín |
| Bảo hộ pháp lý | đòi nợ, hợp đồng có hiệu lực | giảm tỉ lệ vỡ nợ |

- **Chiến tranh và lợi nhuận:** hội có agenda *trục lợi chiến tranh* vận động kéo dài chiến sự (bán quân nhu, cho vay), hội *tự do thương mại* vận động hòa. Xung đột lợi ích giữa các hội là tài nguyên kể chuyện.
- **Phản ứng của thế lực đối với hội:** triều có thể tăng thuế, tịch thu tài sản, thanh trừng quan chức nhận hối lộ khi triều mạnh và hội quá giàu; tông có thể cắt hàng sỉ, ép hội làm chư hầu tài chính, hoặc thôn tính xưởng nếu hội yếu. Hội luôn **ở thế bị kẹp**, nên chính trị của hội là mua an ninh bằng tiền chứ không phải kiểm soát.
- **Tán tu:** hội thu mua của tán tu thợ (giá thấp hơn chợ 5-10% đổi lấy đơn đảm bảo), cho tán tu vay, nhưng ép giá khi tán tu yếu thế; một số hội đứng về phía tán tu (*tự do thương mại*) và bênh vực khi tông cắt hàng.

### 4.6 Hội tạo và dập cú sốc
- **Tích trữ đầu cơ:** hội có agenda *trục lợi* hoặc uy tín thấp, khi biết trước chiến sự (thông tin sớm) có xác suất 25% mỗi lần tích trữ làm cung giảm 20% trong 9 tháng (cú sốc "hội đầu cơ tích trữ" trong bản mẫu); phát hiện thì mất uy tín, triều có thể phạt.
- **Xả hàng:** khi dư hàng hoặc cần tiền, hội xả hàng nhập từ vùng khác, cung tăng 30% trong 4 tháng.
- **Ổn định:** ở vùng hội phủ tốt, cú sốc từ thiên nhiên bị giảm 15-25% do hội điều hàng.
- **Thất bại của hội:** đoàn bị cướp lớn, hội phá sản, bị tông thôn tính, bị triều tịch thu: cú sốc "mất kênh phân phối" (cung -30% 12 tháng ở vùng đó).

### 4.7 Người chơi và thương hội
- **Gia nhập:** ở thủ phủ/thành lớn có hội sở; điều kiện: uy tín thương mại, tài sản tối thiểu, hoặc nghề Thương nhân cấp 2; một người chơi **chỉ vào một hội** và **một tông** (xung đột lợi ích xảy ra thành sự kiện).
- **Bậc:** khách, hội viên, quản sự, chấp sự, hội trưởng (bậc cao theo tổng giao dịch, uy tín và đóng góp, không theo tu vi).
- **Quyền lợi theo bậc:** phí bán 5% -> 2%, hạn mức mua sỉ, giá hợp đồng, đi theo đoàn có hộ vệ, bảo hiểm, vay vốn, thông tin giá và biến cố sớm (nền của sơ đồ Thương nhân), bảng đơn hàng của hội.
- **Nghĩa vụ:** phí hội hằng năm, nhận một số đơn, không bán hàng cho hội đối thủ trong hợp đồng độc quyền, không buôn lậu ở chợ đen; vi phạm bị phạt hoặc trục xuất.
- **Nhiệm vụ của hội** (thêm vào hệ nhiệm vụ): giao hàng, thu mua, hộ tống, đòi nợ, thương lượng, thu thập tin; thưởng linh thạch và uy tín thương mại; thất bại mất uy tín.
- **Chính trị thông qua hội:** đôi khi hội nhờ người chơi làm việc nhạy cảm (đưa quà cho quan, theo dõi tông, tung tin). Nhận thì thêm thưởng và rủi ro đạo tâm hoặc quan hệ tông/triều.
- **Con đường làm hội trưởng** là hướng mở rộng sau.

## 5. Cái gì làm cung cầu đổi và có đáng kể không (câu hỏi 2)

### 5.1 Công thức duy nhất cho mọi hàng
- Cầu `D(P) = D0 x dịch_cầu x (P / P0)^(-e)`; cung `S(P) = S0 x dịch_cung x mùa x (P / P0)^(+es)`.
- Giá điều chỉnh mỗi tháng: `P' = P x (1 + 0,35 x (D - S) / ((D + S) / 2))`; trần `(3 - 1,0 x δ_hội)` lần, sàn 0,45 lần giá vùng.
- Giá cân bằng khi cú sốc kéo dài: `P*/P0 = (dịch_cầu / dịch_cung)^(1 / (e + es))`.
- Thông số theo nhóm hàng: đan thường e=0,4, es=0,6; bùa 0,7/0,7; linh thảo 0,6/1,0 (mùa ±12%); khoáng 0,5/0,9; khí cụ 1,1/0,8; sách 1,5/0,5.

### 5.2 Các động lực (có thêm động lực từ hội và chính trị)
| Động lực | Từ hệ nào | Cầu | Cung | Thời gian | Tần suất mỗi vùng |
|---|---|---|---|---|---|
| Chiến sự nổ ra (tiền tuyến) | `factions` | x1,6 đan/bùa | x0,8 | 18 tháng | cứ 6-10 năm |
| Tông đóng kho (bị vây, bị diệt) | `factions` | | x0,5 đan | 24 tháng | cứ 8-15 năm |
| Tông mở kho bán rộng | tông môn | | x1,4 | 3 tháng | cứ 4-6 năm |
| Bí cảnh mở gần | `rumors` | x1,3 | x1,15 sau đó | 6 + 8 tháng | cứ 3-5 năm |
| Mùa thu hoạch / hạn hán | thời tiết | | thảo x1,3 / x0,6 | 6-9 tháng | cứ 2-3 năm |
| Đại hội, mùa đột phá | thế cuộc | x1,25 Phá Cảnh Đan | | 4 tháng | cứ 5-8 năm |
| Đường buôn phong tỏa, cướp | nguy hiểm tuyến, kẻ thù | | x0,7 | 8 tháng | cứ 4-8 năm |
| **Hội đầu cơ tích trữ** | thương hội | | x0,8 | 9 tháng | cứ 8-12 năm (nếu hội tham/biết tin) |
| **Hội xả hàng, mở chi nhánh mới** | thương hội | | x1,3 | 4 tháng | cứ 4-8 năm |
| **Cửa ải đóng / thuế tăng** | vương triều (`infl` hội giảm khả năng) | | x0,75 qua cửa ải | 12 tháng | khi triều siết |
| **Giá trần thời chiến** | vương triều | | x0,85 (sau trần) và chợ đen +40% | 12-24 tháng | khi có chiến |
| Thời đại (`era.price`) | `factions` | x(0,9-1,2) | | 20-40 năm | khi đổi |
| Người chơi và NPC lõi bán/mua dồn | giao dịch | -/+ vài % | | hồi 6-8 tháng | khi xảy ra |

### 5.3 Độ lớn (kết quả mô hình, giá cân bằng khi cú sốc đủ mạnh)
| Biến cố | Đan thường | Bùa | Linh thảo | Khoáng |
|---|---|---|---|---|
| Chiến sự | +100% | +79% | +15% | +50% |
| Tông đóng kho | +100% | +44% | 0 | 0 |
| Bí cảnh mở gần | +30% | +21% | +9% | +6% |
| Mùa thu hoạch tốt | -6% | 0 | -15% | 0 |
| Hạn hán | +16% | 0 | +38% | 0 |
| Tông mở kho | -29% | -18% | 0 | 0 |
| Mùa đột phá | +25% | +7% | +5% | 0 |
| Đường buôn phong tỏa | +27% | +18% | +16% | +18% |
| Hội đầu cơ tích trữ | +25% | +18% | +9% | +5% |
| Hội xả hàng | -17% | -13% | -17% | -17% |
(Bốn dòng sau cùng ước tính theo cùng công thức; sẽ kiểm bằng mô phỏng ở E4.)

### 5.4 Trả lời thẳng "có đáng kể không"
- Lúc yên: giá quanh mức bình thường ±5%.
- Có cú sốc: +15% đến +100% (đồ thiết yếu nhảy mạnh nhất; đồ xa xỉ ít).
- Một vùng ở trạng thái lệch giá hơn 15% khoảng **25-35% thời gian**; ở vùng hội phủ tốt hạ còn **20-28%** vì hội điều hàng.
- Chênh giữa vùng: 10-35%; ở vùng hội phủ tốt chỉ còn 7-25% (hội ép chênh), nên thương nhân độc lập kiếm biên mỏng ở tuyến chính và kiếm biên dày ở tuyến vắng hội (rủi ro cao hơn).
- Chênh giữa thân phận (hội viên, thành viên tông, người ngoài): 25-45% ở hàng thiết yếu.
- Kết luận: đủ lớn để đổi quyết định, không phá nhịp tu luyện.

### 5.5 Người chơi tác động ngược lại
Bán dồn n lô thì giá trượt (mỗi lô -2%, tối đa -40%), hồi dần 8%/tháng. Nhỏ so với thị trường vùng nên không thao túng được, nhưng đủ thấy hạn mức.

## 6. Nghề Thương nhân và sơ đồ số liệu (câu hỏi 3)

### 6.1 Thương nhân làm được gì mà người khác không
1. Biết giá và nguyên nhân sớm hơn. 2. Mua sỉ, hạn mức cao, chênh mua-bán thấp (đã có chiết khấu 1,5% mỗi cấp). 3. Tính chuyến buôn. 4. Hợp đồng và bảo hiểm ở cấp cao (kết hợp hội).

### 6.2 Mở khóa sơ đồ theo cấp
| Cấp | Mở | Sơ đồ |
|---|---|---|
| 0 | giá hiện tại, mũi tên | thẻ giá + chỉ số "so với bình thường" |
| 1 | lịch sử giá | biểu đồ đường 36 tháng, vạch giá bình thường, đánh dấu biến cố |
| 2 | cung và cầu từng tháng | thanh cung/cầu, nhận xét xu hướng |
| 3 | đường cung S, cầu D | giao điểm cân bằng, nét đứt (bình thường) so nét liền (hiện tại), chữ giải thích dịch chuyển; biết trước biến cố 1-3 tháng |
| 4 | so sánh vùng, chuyến buôn | thanh giá theo thị trấn, bảng lãi ròng (mua, cước, phí, chênh, bán, xác suất cướp), thêm dòng "đi theo đoàn hội" |
| 5 | giá hai tầng, dự báo | bảng giá kho tông / sỉ hội / chợ tán tu / tông bán ngoài; dự báo theo biến cố còn lại; hội viên cấp cao xem **vị thế hội** (ai phủ vùng nào, `infl`, hợp đồng) |
Hội viên được mở sơ đồ **một cấp cao hơn** cấp nghề Thương nhân của mình (mạng lưới thông tin của hội), tối đa cấp 5.

### 6.3 Mỗi sơ đồ dạy gì
Biểu đồ đường: giá đổi vì biến cố nào. Thanh cung/cầu: cầu > cung thì giá tăng. Sơ đồ S-D: biến cố làm đường nào dời, đồ thiết yếu đường dốc nên giá nhảy mạnh. So sánh vùng: lợi thế so sánh và cước làm hết lãi. Giá hai tầng: vì sao thành viên tông và hội viên được giá tốt, và hội/độc quyền ép ngoại vi ra sao.

### 6.4 Thông tin có độ trễ
Người không có nghề Thương nhân hay hội chỉ biết giá nơi đang đứng và các nơi đã ghé ("cách đây N tháng"); Thương nhân cấp 2 thấy giá thị trấn trong vùng; cấp 4 thấy vùng liền kề; cấp 3 hoặc hội viên biết trước biến cố 1-3 tháng.

## 7. Nền giá
- Giá mua = giá vùng (giá nền x đặc sản) x giá điều chỉnh cung cầu x (1 + spread); giá bán = giá điều chỉnh x (1 - spread) trừ phí.
- **Spread** thay "bán lại 55%": làng 18%, thị trấn 12%, thành lớn 8%, thủ phủ 5%, chợ đen 20%; giảm thêm theo cấp Thương nhân; phí bán chợ 5% (hội viên 2-3%).
- **Hạn mức tháng theo quy mô thành:** làng 20 x (1 + cảnh giới), thị trấn 100, thành lớn 500, thủ phủ 3000 vàng; vượt thì giá sàn. Hội viên có hạn mức cao hơn.
- **Đặc sản vùng:** mỗi vùng 2-3 nhóm hàng rẻ (-25%) và 2-3 đắt (+30%) theo thuộc tính.
- **Dịch vụ thành:** quán trọ, thầy thuốc, giám định (3% giá trị), kho cất đồ.

## 8. Shop tông môn
Là phần của **kênh tông** (3.1): hai quầy (cống hiến, nội bộ bằng linh thạch), hàng xoay theo quý, hạn mức theo bậc, giá nội bộ 0,8 x giá tông, theo sở trưởng (`D.SECT_STOCK[sectId]`), tông chuyên nghề rẻ nguyên liệu 20% và có đơn hàng, tông bị diệt hoặc bị vây thì kho đóng (cú sốc đóng kho). Tỉ giá cống hiến: 1 điểm = 0,6 giá vàng thị trường của món (không đổi ngược thành vàng).

## 9. Liên kết với hệ đã có
- **Thế lực (`factions`):** thêm `kind: 'hoi'`; hội có quan hệ với tông và triều (rel, nợ, hợp đồng); chiến tranh và diệt môn ảnh hưởng hội; Biên niên sử ghi sử hội.
- **Nhiệm vụ:** thêm loại thương mại và nhiệm vụ của hội.
- **Nghề:** Thương nhân là cửa vào hội; thợ mỏ, thợ săn, y sư là nguồn nguyên liệu; lính đánh thuê là nguồn hộ vệ và nhiệm vụ hộ tống.
- **Ngã rẽ (đạo):** Kiếm sống hợp Thương nhân và hội; Phiêu lưu kiếm hàng bí cảnh; Khổ tu ít giao dịch.
- **Cái giá thất bại:** kho cất đồ, bảo hiểm, vay khi thua nặng.

## 10. Chặng làm (mỗi chặng người chơi thấy gì)
- [ ] **E0 Đo hiện trạng:** `tools/econ-sim.js` đo thu nhập từng cách kiếm tiền theo cảnh giới làm mốc (trước khi sửa).
- [ ] **E1 Giá động theo vùng.** Thấy: giá khác nhau giữa nơi, biểu đồ lịch sử giá trong tab Chợ, chỉ số so với bình thường, trượt giá khi bán dồn, spread theo quy mô. Làm: `js/data/eco.js`, `TT.eco.price`, `world.mk`, hồi dần, thay "bán lại 55%".
- [ ] **E2 Kênh tông và shop tông.** Thấy: kho tông hạn mức, giá nội bộ, quầy người ngoài, hàng hạn dùng, nguồn bí cảnh. Làm: tỉ phần `σ`, `D.SECT_STOCK`, hạn mức, hạn dùng.
- [ ] **E3 Thương hội.** Thấy: tin về hội (tên, lãnh tụ, mở chi nhánh, đầu cơ), hội sở ở thành lớn, đoàn buôn có hộ vệ, bảng hợp đồng sỉ, tab Hội (gia nhập, bậc, quyền lợi, nghĩa vụ), nhiệm vụ hội. Làm: `js/data/hoi.js`, mở rộng `factions.js` (kind hoi, quan hệ, vay, hộ vệ, chính trị, agenda), trần tự cung 12%, ép chênh giá `δ`, sự kiện hội (tích trữ, xả hàng, bị cướp, bị tịch thu, bị tông thôn tính).
- [ ] **E4 Cú sốc nối vào thế cuộc.** Thấy: tin đồn "khan hàng", "dư hàng" có nguyên nhân (chiến, tông, hội, thời tiết, cửa ải), giá nhảy đúng bảng 5.3. Làm: bộ phát cú sốc từ `factions`, hội, thời tiết, bí cảnh, triều; đo lại bảng 5.3 bằng mô phỏng.
- [ ] **E5 Nghề Thương nhân và sơ đồ.** Thấy: sơ đồ mở theo cấp 0-5 theo `uimock-kinhte.html`, bảng chuyến buôn (cước, cướp, hạn dùng, sức chứa), tin sớm, hội viên mở thêm một cấp.
- [ ] **E6 Chợ đen, giám định, đấu giá thủ phủ** (thông tin bất cân xứng); hội đen liên quan.
- Mỗi chặng: kiểm thử trong tests.html, đo bằng `econ-sim`, chơi thử máy tính và điện thoại, ghi tóm tắt vào KE-HOACH.md, chụp snapshot.

Thứ tự: E0, E1, E2, E3, E4, E5, E6. Mốc chơi thử sớm nhất sau E3 (đã có giá cung cầu, tông, hội).

## 11. Để sau (cố ý chưa làm)
Cung tiền và lạm phát tự động, vay mượn kiểu ngân hàng độc lập, thuế vương triều chi tiết (ở E3 chỉ giản lược), Gini, hội trưởng do người chơi đảm nhiệm, nhiều hội cạnh tranh trên cùng tuyến theo mô hình đấu thầu.

## 12. Tiêu chí chấp nhận (đo bằng `econ-sim`)
1. Giá lúc yên ±8%; cú sốc đúng bảng 5.3 (sai số 10%).
2. Không cách kiếm tiền nào vượt 1,6 lần thu nhập "làm việc" cùng cảnh giới (kể cả buôn, chế tác, làm cho hội).
3. Chuyến buôn trung bình lãi ròng 8-18% sau phí và rủi ro; ở tuyến hội mạnh biên thấp hơn 20-35%.
4. Thành viên tông và hội viên mua thiết yếu rẻ hơn người ngoài 25-45%.
5. Hội: tự cung ≤ 12%, `guard` ≤ 30; hội không tham gia chiến tranh quân sự; hội bị triều/tông diệt hoặc thôn tính ít nhất 1 lần trong 300 năm mô phỏng, và hội bền vững ít nhất 1 trong 3; không có hội nào chiếm hơn 60% phân phối của một vùng.
6. Không phá cân bằng cũ: NPC ~4/10/19% đạt Trúc Cơ+, nhịp hỏi ≤ 6 lần/phút, bài mô phỏng nhiều đời giữ Trúc Cơ 12-60%.

## 13. Câu hỏi cần bạn chốt
1. **Số lượng hội:** 3 hội lớn xuyên vùng cộng vài hội nhỏ: đúng ý chưa, hay muốn nhiều hội nhỏ hơn?
2. **Chính trị của hội:** các đòn bẩy ở 4.5 (giảm thuế, giữ thông thương, cho vay, môi giới hòa nghị, hối lộ) có đủ hay muốn thêm (ví dụ tài trợ một phe)?
3. **Hội và vương triều:** triều có thể tịch thu tài sản hội khi hội quá giàu. Đây là hậu quả mạnh: giữ không?
4. **Người chơi trong hội:** chỉ một hội và một tông cùng lúc, hay cho vào nhiều hội?
5. **Cú sốc do hội** (đầu cơ, xả hàng): đồng ý để hội có thể gây ra, hay chỉ làm dịu cú sốc?
6. **Tần suất cú sốc** ở 5.2 (một vùng lệch giá 25-35% thời gian) quá nhiều hay quá ít?

## 14. Nhật ký làm việc
- 2026-10-16: bản 1-3 như trước (đo thế giới: 35 NPC mỗi vùng, NPC không chế tác; mô hình cung cầu; bản mẫu giao diện).
- 2026-10-16 (bản 4): bạn bảo đưa thương hội lên làm cùng: trung gian giữa tông, quốc gia, tán tu; có thể tự cung nhưng ít; có lực lượng tự bảo vệ nhỏ; có quyền lực chính trị nhưng không có quân đội; đại diện giai cấp tư bản. Viết thành mục 4 (thế lực thứ tư trong `factions`, vai trò, tự cung ≤ 12%, hộ vệ ≤ 30, bảng đòn bẩy chính trị, cú sốc do hội, người chơi gia nhập), cập nhật sơ đồ nguồn - đường - đích, bảng động lực, chặng E3, tiêu chí, câu hỏi; thêm hai biến cố và dòng "đi theo đoàn hội" vào bản mẫu. Chưa code game.

## 15. Kết quả và việc để sau
(Điền khi xong.)
