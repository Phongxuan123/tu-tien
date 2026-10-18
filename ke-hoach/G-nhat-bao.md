# G. Nhật báo tu tiên (bản 3: cập nhật theo thế giới đã có kinh tế, dân số, hiệp ước, tông mới)

- Trạng thái: Đã code G1 đến G5 (2026-10-17), chờ bạn chơi thử
- Ngày lập: 2026-10-16 (bản 1), sửa cùng ngày theo ý bạn (bản 2)
- Bản mẫu để xem: [uimock-nhatbao.html](../uimock-nhatbao.html) (ba màn: sự kiện người bán báo, mục Nhật báo đọc lại, một số tổng san bốn năm)
- Liên quan: `js/core/state.js` (`TT.news`, 39 chỗ gọi), `js/ui/panels.js` (khung "Thiên hạ", `renderNews`), `index.html` (panel `#news`), `js/systems/decisions.js` (hộp quyết định), `js/systems/rumors.js`, `js/systems/factions.js`, `ke-hoach/E-kinh-te.md`, `ke-hoach/F-hoan-thien-the-gioi.md`, hệ nhiệm vụ

## 1. Yêu cầu của bạn (bản 2)
1. Báo **ra bốn năm một lần**.
2. Có **sự kiện** một người tới giới thiệu **gia hạn mua báo hàng tháng**; chỉ xảy ra khi người chơi **đủ linh thạch trụ ít nhất 30 năm**; **bốn năm hiện lên một lần**.
3. **Bỏ khung/tab "Thiên hạ"**, thêm **mục Nhật báo** để đọc lại thông tin của các số đã mua.
4. Vì bốn năm mới có một số nên **lượng thông tin phải lớn và chất lượng**.
5. (Từ trước) Cơ chế **thụ động, ít ảnh hưởng** đến người chơi.

## 2. Hiểu lại cơ chế cho khớp
- **Đăng ký tính theo tháng:** mỗi tháng trừ một khoản nhỏ tự động (khoản này là hố tiêu tiền đều đặn).
- **Giao hàng theo bốn năm:** mỗi bốn năm (48 tháng) tòa báo gửi một **số tổng san** gom mọi chuyện thiên hạ của bốn năm đó. Trong bốn năm giữa các số, người chơi **không có tin gì từ báo**, nên tin về thế giới trở nên "cũ nhưng đầy đủ" và ít ảnh hưởng tức thời.
- **Người bán báo** (sự kiện) ghé **mỗi bốn năm**, đúng lúc tổng san sắp ra, hỏi gia hạn hoặc đổi tờ hoặc hủy. Lần đầu có thể tặng **số biếu** (tổng san bốn năm gần nhất) để người chơi thấy ngay giá trị.
- **Điều kiện hiện sự kiện:** tài sản (quy linh thạch) của người chơi **≥ 360 x phí tháng của tờ rẻ nhất** (30 năm x 12 tháng). Nếu không đủ, không có sự kiện, bốn năm sau xét lại. Mục đích: chỉ ai đủ giàu mới dính vào khoản chi dài hạn, người nghèo không bị hỏi.

## 3. Phí và điều kiện (số thử, sẽ đo)
Phí tháng tăng theo cảnh giới để người chơi ở cảnh giới nào cũng gánh được: `phí = phí_gốc x (1 + 0,6 x cảnh giới)`.

| Tòa báo | Phí gốc (linh thạch/tháng) | Trúc Cơ | Kim Đan | Cần có (30 năm), Trúc Cơ |
|---|---|---|---|---|
| Thiên Cơ Báo (thương hội) | 0,6 | 1,32 | 1,68 | 475 |
| Chính Đạo Nhật San | 0,4 | 0,88 | 1,12 | 317 |
| Hắc Phong Tiểu Báo | 0,2 | 0,44 | 0,56 | 158 |
- Tối đa **hai tờ** cùng lúc. Hết linh thạch giữa chừng thì tạm ngưng đăng ký (log báo), vẫn giữ các số đã mua.
- Số lẻ: gặp người bán báo ở thành lớn mua được một số cũ (giá bằng phí bốn năm x 1,2), để người không đủ trụ 30 năm vẫn có đường đọc.

## 4. Nội dung một số tổng san (dày và chất lượng)
Mỗi số khoảng **50-65 tin, 5-6 bảng, 2 biểu đồ**, chia mục (số lượng mục tiêu theo tờ):

| Mục | Số lượng | Nội dung |
|---|---|---|
| Xã luận | 1 | bình luận tổng kết bốn năm theo giọng chủ báo |
| Dòng thời gian bốn năm | 12-20 mốc | các mốc lớn theo tháng |
| Thế cuộc và chiến sự | 8-12 bài | **bài theo chuỗi**: nguyên nhân, diễn biến, kết cục (chiến tranh, diệt môn, đổi thế lực, đổi thời đại) |
| Tông môn, gia tộc | 6-10 | tuyển đệ tử, tranh chấp, kế vị, đóng/mở kho |
| Bí cảnh và kỳ ngộ | 4-6 | kết quả các bí cảnh đã qua, bí cảnh sắp mở, thương vong |
| Bảng giá và thị trường | 1 bảng + 1 biểu đồ | giá đầu kỳ, cuối kỳ, đỉnh, xu hướng (cần E; trước E hiện hệ số thời đại) |
| Nhân vật và xếp hạng | 1 bảng 10 người | tu sĩ mạnh nhất, thăng cấp, đi vắng |
| Truy nã và treo thưởng | 5-8 | nguồn nhiệm vụ đề nghị |
| Hỷ tín và cáo phó | 5-8 | người quen xuất hiện |
| Rao vặt dài hạn | 8-12 | tuyển người, bán đan phương, tuyển thợ (là nguồn nhiệm vụ nghề) |
| Có liên quan đến bạn | 3-5 | tên bạn, người quen, kẻ thù, nhiệm vụ |
| Dự báo bốn năm tới | 3-5 | xác suất chiến sự, giá, thời đại, bí cảnh |
| Đính chính | 1-3 | tin sai ở số trước |

**Cách làm cho "chất lượng":**
1. **Gom tin thành chuyện:** các sự kiện cùng thế lực/cùng cuộc chiến gộp thành một bài kể đủ đầu đuôi (dùng `fac.chron`, `fac.wars`), không liệt kê lẻ tẻ.
2. **Số liệu:** bảng và biểu đồ lấy số thật theo thời gian (giá, danh sách thế lực, thương vong bí cảnh).
3. **Thiên kiến có phong cách:** tòa báo chọn mục đậm, đặt tít, viết nhận xét khác nhau; nhưng sự kiện cốt lõi giống nhau.
4. **Độ tin cậy:** ba nhãn (đã kiểm chứng, khá chắc, chưa xác nhận). Tin sai có sẵn tỉ lệ theo tờ và được đính chính ở số sau.
5. **Phần "dự báo"** là phần có giá trị đi tới của một số báo đã cũ, nhưng độ chính xác chỉ ở mức xác suất.

## 5. Giao diện
- **Bỏ khung "Thiên hạ"** ở cột giữa (`#news`, `renderNews`). Không còn dòng tin cuộn.
- **Thêm tab "Nhật báo"** ở thanh tab (cạnh Quan hệ, Nhiệm vụ, Nghề): có hai phần.
  1. **Thư viện:** danh sách các số **đã mua** (số, tòa báo, giai đoạn năm, số tin, phí), nút Đọc; hiển thị ngày dự kiến số tới và tình trạng đăng ký (tiền trừ mỗi tháng, còn trụ bao nhiêu năm).
  2. **Tờ báo:** bố cục như bản mẫu (tên báo, số, mục lục dính bên trái, các mục, bảng, biểu đồ), tin liên quan bạn đánh dấu, độ tin cậy, vài nút tùy chọn (đánh dấu, lập kế hoạch, nhận truy nã/việc làm).
- **Sự kiện người bán báo:** cửa sổ nổi (tầng 2, có mặc định: gia hạn tờ đang đọc nếu có, nếu không thì "chưa cần") với tờ nào, phí tháng, tổng bốn năm, mô tả, độ tin cậy; lựa chọn gia hạn, đổi, thêm tờ thứ hai, hủy.
- **Báo mới đến:** một dòng nhật ký + chấm ở tab; không bật hộp.

## 6. Dữ liệu và kỹ thuật
- **Nguồn tin:** `TT.news(text, cls, ids)` giữ làm cửa cũ nhưng mở rộng thành sự kiện có cấu trúc `{ m, kind, region, importance, truth, ids, text }` vào **kho tin** `world.press.pool` (tối đa khoảng 600, giữ theo độ quan trọng); thế cuộc, bí cảnh, diệt môn, truy nã, tin giá (khi có E) gọi `TT.press.emit`.
- **Xuất bản:** mỗi 48 tháng (mốc theo năm của thế giới) `TT.press.publish(pubId)` dựng số cho từng tòa báo từ kho tin (gom chuyện, chọn mục theo hạn mức, áp thiên kiến, gán độ tin cậy) và lưu `world.press.pubs[pubId].issues`.
- **Mua và lưu:** người chơi `c.press = { subs: [{pub, since}], owned: [{pub, issue, paid}], lastOffer }`; số đã mua giữ **tối đa 10 số** (người chơi), mỗi số lưu gọn (id tin tham chiếu và chuỗi ngắn) để bản lưu không phình: ước 8-12 KB mỗi số.
- **Phí tháng:** `TT.press.monthly(c)` trừ qua `TT.ls.pay`; thiếu tiền thì ngưng.
- **Sự kiện:** `TT.press.offer(c)` được gọi mỗi năm; mỗi 48 tháng nếu thỏa điều kiện thì `TT.decisions.request({ type: 'press', ... })` (tầng 2 có mặc định); xử lý bằng handler `press`.
- **Khung Thiên hạ cũ:** gỡ `#news` khỏi `index.html` và `renderNews`; `world.news` cũ không còn hiển thị (có thể dùng nó làm một phần kho tin cho tương thích bản lưu).
- **Lưu cũ:** `world.press` và `c.press` khởi tạo lười; bản lưu cũ không có số báo nào cho tới mốc 48 tháng kế; không đổi `TT.VERSION`.
- **Nhịp hỏi:** thêm một sự kiện mỗi bốn năm nên khoảng 0,25 hộp/năm trong những đời đủ giàu (khoảng 3 lần/phút nếu hiện hàng năm; ở đây chỉ 1/4), cần kiểm tra lại nhịp ≤ 6 lần/phút (hiện 5,3).

## 7. Tác dụng đến người chơi (giữ nhỏ)
- **Tin cũ nhưng đầy đủ:** biết được những gì đã xảy ra ở thế giới trong bốn năm (đặc biệt lúc đầu thai/kế thừa vào thế giới đã đổi).
- **Dự báo:** có xác suất chiến sự, bí cảnh, giá cho bốn năm tới (tác dụng lên quyết định, không đổi chỉ số).
- **Nguồn nhiệm vụ đề nghị:** truy nã, rao vặt dài hạn thành đề nghị trong hệ nhiệm vụ (vẫn theo luật nhiệm vụ và nhịp hỏi).
- **Danh vọng và quan hệ:** người chơi xuất hiện trong báo (thành tích, thương vong), cộng/trừ vài điểm danh vọng.
- **Giới hạn cứng:** không cho xác suất đánh nhau hay tu vi; tổng lợi ích thông tin quy ra ≤ 5% kết quả ở lựa chọn liên quan.
- **Tiền:** phí đều đặn là hố tiêu tiền nhỏ (≈ 1-2% thu nhập một người chơi khá).

## 8. Các chặng làm
- [ ] **G1 Kho tin và xuất bản:** `TT.press.emit`, kho tin, chuyển các `TT.news` lớn sang có `kind/region/importance`; `TT.press.publish` dựng số 48 tháng một lần với gom chuyện.
- [ ] **G2 Ba tòa báo và nội dung:** thiên kiến, độ tin cậy, mục và hạn mức, đính chính, bảng và biểu đồ (giá khi có E; trước đó bảng thế lực và hệ số thời đại).
- [ ] **G3 Đăng ký, phí tháng, sự kiện người bán báo, số biếu, số lẻ.**
- [ ] **G4 Giao diện:** bỏ khung Thiên hạ, tab Nhật báo (thư viện và tờ báo), mục lục, đánh dấu liên quan bạn.
- [ ] **G5 Tác dụng nhỏ:** dự báo, truy nã/rao vặt thành nhiệm vụ đề nghị, người chơi lên báo.
- [ ] Mỗi chặng: kiểm thử trong tests.html (kho tin, xuất bản đúng nhịp, điều kiện hiện sự kiện, phí, lưu/tải, không phình bản lưu), đo nhịp hỏi, chơi thử máy tính và điện thoại, ghi tóm tắt vào KE-HOACH.md, chụp snapshot.

## 9. Tiêu chí chấp nhận
1. Mỗi số tổng san có ít nhất 45 tin, 5 bảng và 2 biểu đồ; chuyện chiến tranh/diệt môn được kể đủ nguyên nhân, diễn biến, kết cục.
2. Sự kiện người bán báo chỉ hiện khi tài sản ≥ 30 năm phí tờ rẻ nhất và đúng 48 tháng một lần.
3. Không có khung Thiên hạ; số đã mua đọc lại được sau khi lưu/tải.
4. Nhịp hỏi người chơi ≤ 6 lần/phút (kiểm bằng bài nhịp hiện có).
5. Bản lưu không tăng quá 150 KB cho một đời dài 80 năm.
6. Cùng một sự kiện ở ba tòa báo có tít và nhận định khác nhau, độ tin cậy khác nhau; tin sai được đính chính trong số kế.

## 10. Câu hỏi cần bạn chốt
1. **Người không có báo** sẽ không có tin nào về thế giới ngoài nhật ký việc của mình và tab tin đồn bí cảnh có sẵn. Chấp nhận, hay muốn một "bảng tin chợ" miễn phí rất ngắn ở thành (vài tin lớn)?
2. **Số tờ báo:** ba tờ hay bắt đầu một tờ?
3. **Số biếu lần đầu** (tặng một tổng san để thấy giá trị) có giữ không?
4. **Tin sai thật sự** có muốn làm người chơi mất công đi theo, hay chỉ ghi chú "chưa xác nhận"?
5. **Phí:** mức 0,2-0,6 linh thạch/tháng (gốc) nhân theo cảnh giới đã hợp lý chưa?

## 11. Nhật ký làm việc
- 2026-10-16 (bản 1): đề xuất ba tòa báo ra theo quý.
- 2026-10-16 (bản 2): bạn đổi: bốn năm một số, người bán báo gia hạn hàng tháng khi đủ trụ 30 năm, bỏ tab Thiên hạ, thêm mục Nhật báo đọc lại số đã mua, nội dung phải dày và chất lượng. Viết lại kế hoạch và dựng lại bản mẫu (sự kiện gia hạn có tính điều kiện theo cảnh giới và tài sản, thư viện, số tổng san 13 mục, 20 bài mẫu, bảng giá, biểu đồ). Chưa code game.

## 12. Kết quả và việc để sau
(Điền khi xong.)

## 13. Quyết định chốt (2026-10-16, sau bản 2)
- **Chỉ một tòa báo** cho nhẹ máy: **Thiên Cơ Báo** (do thương hội ra), thiên kiến vừa phải (thích thông thương, ổn định; đưa tin chính đạo và tà đạo tương đối trung lập), độ tin cậy khoảng 85%, phí gốc 0,4 linh thạch/tháng (x (1 + 0,6 x cảnh giới)). Vì vậy: bỏ cột "chọn tờ" trong sự kiện người bán báo (chỉ còn gia hạn hoặc hủy), bỏ giới hạn "hai tờ", bỏ đoạn thiên kiến giữa ba tòa. Cấu trúc số tổng san, mục lục, bảng, biểu đồ, dự báo giữ nguyên. Bản mẫu `uimock-nhatbao.html` vẫn còn ba tờ để minh họa, khi làm sẽ chỉ giữ tờ Thiên Cơ. Có thể thêm các tờ khác sau như một mở rộng.
- **Bảng tin chợ miễn phí ở thành:** hay, đã lưu vào `ke-hoach/H-phat-trien-thanh-tri.md`, làm khi phát triển thành trì, không làm trong đợt Nhật báo.
- **Thứ tự:** quay lại phát triển thế giới (F) trước; Nhật báo (G) và kinh tế (E) làm sau khi thế giới chốt.

## 14. Bản 3 (2026-10-17): chỉnh theo những gì game đã có
Từ bản 2 game đã thêm kinh tế (E), dân số và hiệp ước (F4, F2), tông môn mới (M), tài nguyên bản đồ (N). Vì vậy kế hoạch đổi như sau; phần còn lại giữ như mục 1-13.

**Nguồn tin có sẵn, không phải viết mới** (mỗi nguồn gọi `TT.press.emit` ở chỗ đang ghi `TT.fac.chron` hoặc `TT.news`):
| Nguồn | Tin | Ghi chú |
|---|---|---|
| `TT.fac.chron` (chiến tranh, hòa nghị, diệt vong, đổi thời đại) | chuỗi chiến sự | gom theo `fac.wars` |
| `eco.monthly` (cú sốc, giá lệch quá 32%) | tin giá, mùa đột phá, đường buôn phong tỏa | đã có `why` để viết nguyên nhân |
| Dân số (`pop.shocks`: hạn, lũ, dịch; nổi loạn) | thiên tai, dân biến | mới, trước chưa có |
| Hiệp ước (`pact`: cống nạp, chư hầu, bất tuân, đoạn tuyệt) | tin chính trị | mới |
| Tông môn (`sect` đại bỉ, thay chưởng môn, chiếm mỏ, tuyển đệ tử) | tin tông | thay "tông môn, gia tộc" |
| Tài nguyên (`res`: mỏ cạn, linh mạch) | tin tài nguyên | mới |
| Thương hội (`hoi` shocks: tích trữ, xả hàng, rút khỏi vùng) | tin hội | mới |
| Người chơi (`hoi` lên bậc, đấu giá thắng, bị cướp, hiến tông) | mục "Có liên quan đến bạn" | mới |

**Chỉnh nội dung số tổng san:**
1. Mục **Bảng giá và thị trường** làm thật ngay (không chờ E): 7 nhóm hàng x vùng người chơi đang ở, giá đầu kỳ/cuối kỳ/đỉnh từ `eco.series` (đã giữ 36 tháng, đủ cho bốn năm 48 tháng nếu nâng lên 48), kèm nguyên nhân.
2. Mục **Dự báo** dùng `eco.upcoming` (cú sốc sắp tới), `pop` (nguy cơ thiên tai), `fac` (căng thẳng giữa hai thế lực): chỉ ở dạng xác suất, giới hạn như mục 7.
3. Thêm mục **Dân sinh** (dân số vùng, dân tâm, thiên tai) và **Hiệp ước và thuế** (ai nộp cống cho ai, ai bất tuân).
4. Mục tông môn dùng sự kiện tông thật (đại bỉ, thăng chưởng môn).

**Chỉnh kỹ thuật:**
- `eco.hist` nâng 36 lên 48 tháng.
- Kho tin tham chiếu id tin, cap 600 tin; số đã mua giữ 10 số.
- Nhịp hỏi: người bán báo chỉ hỏi 1 lần/4 năm và chỉ khi tài sản đủ 30 năm phí; kiểm lại nhịp ≤ 6.
- Gỡ `#news` (cột giữa) và `renderNews`; tab Nhật báo thêm vào hàng tab hiện có.

**Chặng làm (thay mục 8):** G1 kho tin và xuất bản (gom nguồn trên); G2 nội dung một tờ Thiên Cơ (bảng giá, dự báo, dân sinh, hiệp ước); G3 đăng ký, phí, sự kiện người bán báo, số biếu; G4 giao diện (bỏ Thiên hạ, tab Nhật báo); G5 tác dụng nhỏ (nhiệm vụ đề nghị, lên báo). Làm một mạch G1 đến G5 như E.

**Câu hỏi còn lại (đã có mặc định, bạn chỉ cần sửa nếu muốn khác):**
1. Số biếu lần đầu: **giữ** (số tổng san bốn năm gần nhất).
2. Tin sai: **chỉ ghi "chưa xác nhận"** và đính chính ở số sau, không bắt người chơi đi kiểm chứng.
3. Phí gốc 0,4 linh thạch/tháng x (1 + 0,6 x cảnh giới): **giữ**.
4. Người chưa mua báo: **không có tin thế giới**, ngoài nhật ký, tin đồn và Nha môn (bảng giá, bảng truy nã) vừa thêm; bảng tin chợ sẽ làm khi phát triển thành trì (H).