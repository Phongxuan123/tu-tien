# C3. Công pháp và tâm pháp: thiết kế chi tiết và kế hoạch phát triển

Bản nháp thiết kế (chưa có code), phiên 2026-11-09, nhánh `claude/thiet-ke-chien-dau`. Nằm dưới `C2-chien-dau.md` (lõi trận thế). Làm **trước** lõi trận vì hai hệ này độc lập được và cho người chơi thấy giá trị ngay.

**Giả định đang dùng (mặc định, chưa bị chủ game phản đối, đổi được):** trận 5 nhịp (thủ lĩnh 6); mang bộ ba công pháp (Công, Thủ, Tụ); quái "xảo" và thủ lĩnh thích nghi, quái khác tính cố định. Giữ nguyên đặc trưng ngũ hành.

## 0. Tóm tắt một màn hình

- **Công pháp = bộ chiêu.** 3 loại (Công, Thủ, Tụ) quyết định chiêu ra khi nào. Hệ ngũ hành quyết định chất chiêu. Người chơi mang **bộ ba** (mỗi loại một công pháp), pha hệ được (ví dụ Kim Công, Thủy Thủ, Hỏa Tụ).
- **Tâm pháp = đạo của đời.** Tâm pháp chính **tự hoàn thiện** từ các đạo đã đi (dùng lại `c.pathMo`), đổi đạo không mất phần cũ nhưng vẫn bị phạt như hiện nay. Ba phụ mua bằng đạo điểm, mở khóa theo mạch đã đi, có đánh đổi.
- **Ranh giới:** công pháp lo chiến đấu, tâm pháp lo đời (tu luyện, đột phá, thọ, tâm ma) và hai cầu nối nhỏ sang chiến đấu (điểm đọc, độ nạp). Công pháp **bỏ** phần tăng tốc tu luyện.
- **Sáu phiên** (CP1 đến CP6), xong thì C2-1 (lõi trận) có đủ nguyên liệu. Từng phiên đều cho người chơi thấy thay đổi.

## 1. Công pháp

### 1.1 Cấu trúc dữ liệu (mới)
Mỗi công pháp trong `D.TECHS`:
```
{ id, n, elem: 'Kim'|...|null, loai: 'cong'|'thu'|'tu'|'da', tier: 0..3, realm, pts, desc,
  chieu: { n, mul, hieuUng: [...], phanPhe? }, bien: [ {lv:3,...}, {lv:6,...}, {lv:9,...} ] }
```
- `loai: 'da'` là đa dụng (xem 1.5).
- `chieu.mul`: hệ số sát thương so với `hit(a, b)` hiện có. `hieuUng`: danh sách hiệu ứng (bảng 1.4). `bien`: biến thức mở theo cấp luyện.
- Cấp luyện 0 đến 9 giữ nguyên (`LV_MAX`, `tech.need`). Sát thương chiêu = `mul × (1 + tier×0.10 + lv×0.03)`.

### 1.2 Bộ ba
- `c.bo = { cong: id|null, thu: id|null, tu: id|null }` (khởi tạo muộn; hàm đọc `TT.tech.bo(c)` trả bộ mặc định **không ghi**, xem 1.7).
- Ô trống thì thế đó dùng đòn thuần vô hệ (không chiêu, không khắc). Không ai bị khóa thế.
- Mở ô: Phàm 1 ô (tùy chọn), từ Luyện Khí đủ 3 ô.
- **Kho công pháp** đã học giữ `tech.slots(c) = 2 + realm`. Đổi công pháp trong bộ ba cần ở yên (không đang thám hiểm hay giao chiến), không tốn gì khác.
- **Công pháp ưu tiên luyện** (thay `techMain`): chọn một cái trong bộ ba nhận tu vi luyện khi tu luyện. Dùng chiêu thắng trong trận cũng cộng xp cho chính công pháp đó (thưởng cho việc dùng thật).

### 1.3 Tam giác và chiêu
| Loại | Chiêu ra khi |
|---|---|
| Công | chọn Công và thắng hoặc hòa nhịp (thắng: đủ hiệu ứng, hòa: chỉ sát thương) |
| Thủ | chọn Thủ và thắng nhịp (hòa: chỉ giảm đòn nhận) |
| Tụ | nạp một nhịp, bung đầu nhịp sau nếu không bị Công đánh đứt (xem `C2` mục 2) |

### 1.4 Hệ: chất chiêu (30 chiêu, số ban đầu chỉnh bằng đo)
Đơn vị sát thương là "hệ số × `hit`". "maxHP" là phần trăm sinh lực tối đa của mục tiêu (hoặc của mình khi ghi "phản phệ"). Tên chiêu để Haiku viết.
| Hệ | Chiêu Công | Chiêu Thủ | Chiêu Tụ |
|---|---|---|---|
| **Kim** | Sốc: ×1.3, xuyên giáp 30%, phản phệ 6% | Kiếm màn: thắng thì phản ×0.6 xuyên giáp | Kiếm trận: ×2.2, xuyên 50%, phản phệ 10% |
| **Mộc** | Mũi độc: thắng thì **độc** 2 nhịp (3% mỗi nhịp) | Mộc giáp: thắng hoặc hòa hồi 6%, giảm đòn nhận 20% | Rừng độc: ×1.8, độc 3 nhịp (4%), **trói** (đòn mục tiêu -25% 1 nhịp) |
| **Thủy** | Liên sóng: 3 đòn ×0.6 (chí mạng riêng), **ướt** 2 nhịp | Thủy kính: thắng thì phản ×0.5, xóa 1 trạng thái xấu | Triều dâng: ×2.0, ướt, đặt đà mục tiêu về 0 |
| **Hỏa** | Hỏa cầu: thắng thì **thiêu** 2 nhịp (4%), liều: thua nhịp chịu thêm +15% | Hỏa tường: thắng mà đối thủ vừa dùng Công thì thiêu lên nó | Phần thiên: ×2.4, thiêu 3 nhịp, phản phệ 8% |
| **Thổ** | Trụ đá: ×1.2, đòn kế của mục tiêu -15% | Giáp đất: giảm đòn nhận 40%, thua nhịp chỉ chịu ×1.0 thay ×1.5 | Địa lôi: ×1.6, đặt **bẫy** lên thế mục tiêu dùng nhiều nhất (nhịp sau dùng thế đó ăn thêm 1.0) |
| **Phong** | Phong nhận: 2 đòn ×0.75, hòa tính thắng | Lướt gió: hòa thì né hẳn (không nhận đòn); thắng thì phản và lên đà | Lốc xoáy: ×1.8, nạp bền (bị đánh đứt chỉ mất nửa) |
| **Lôi** | Lôi tiễn: thắng thì **tê** (nhịp sau mục tiêu bị ép Thủ) | Lôi màn: thắng thì giật ngược ×0.5 | Lôi kiếp: ×2.3, tê chắc chắn |
| **Băng** | Băng đạn: thắng thì **đóng băng** (mục tiêu không lặp thế vừa dùng) | Băng giáp: giảm đòn nhận 30%, đòn mục tiêu -15% 1 nhịp | Cực hàn: ×2.0, đóng băng 2 nhịp |
| **Âm** | Hồn trảo: hút máu 40% sát thương | Quỷ ảnh: thắng hoặc hòa thì **nhiễu** (mục tiêu chọn thế ngẫu nhiên nhịp sau, ý đồ quái hiển thị sai nếu là mình bị nhiễu) | Hồn phệ: ×2.0, hút máu 50%, nhiễu |
| **Dương** | Dương diễm: ×1.2, thanh tẩy 1 trạng thái xấu của mình, khắc Âm +25% | Dương quang: hồi 8%, miễn trạng thái xấu 1 nhịp | Thái dương: ×2.2, thanh tẩy toàn bộ |

**Quy tắc trạng thái nền:** mỗi bên tối đa 2 trạng thái, không cộng dồn cùng loại (làm mới thời hạn), mỗi trạng thái kéo dài 1 đến 3 nhịp.
**Kích nổ ngũ hành:** chiêu hệ G trúng mục tiêu đang mang trạng thái của hệ H mà `beats(G, H)` (bảng `KHAC` trong `combat.js`) thì tiêu trạng thái đó, nổ ngay phần sát thương còn lại ×1.5 kèm hiệu ứng nổ. Ánh xạ trạng thái sang hệ: độc là Mộc, thiêu là Hỏa, ướt là Thủy, tê là Lôi, đóng băng là Băng, bẫy là Thổ, sốc là Kim, nhiễu là Âm.
**Khắc hệ** (`elemMul`) tính theo hệ của **chiêu đang dùng** chứ không còn theo công pháp chính.

### 1.5 Phân bố 34 công pháp và tương thích với bản cũ
- **30 công pháp có hệ** = 10 hệ × 3 loại. 20 công pháp hiện có xếp vào các ô, **10 công pháp mới** (6 ở hệ cơ bản, 4 ở hệ biến dị).
- **Tầng và yêu cầu:** hệ cơ bản (Kim, Mộc, Thủy, Hỏa, Thổ, Phong): Công và Thủ tầng 0 (cảnh giới 0, 15 điểm tư chất), Tụ tầng 1 (cảnh giới 1, 35 điểm). Hệ biến dị (Lôi, Băng, Âm, Dương): Công và Thủ tầng 1 (30 điểm), Tụ tầng 2 (55 điểm). Giữ đúng các mốc `pts` và `realm` hiện có.
- **4 công pháp đa dụng** (`loai: 'da'`, vô hệ, đặt vào ô bất kỳ, không khắc và không bị khắc): Dưỡng Khí (tầng 0, hiệu lực 0.6, thắng nhịp hồi 5%), Ngũ Hành Dung Hòa (tầng 1, hiệu lực 0.7, dùng hệ mạnh nhất trong tư chất nhưng nửa hiệu lực), Thiên Cương Địa Sát (tầng 2, hiệu lực 0.9), Hư Không Đại Pháp (tầng 3, hiệu lực 1.1, chiêu vô hệ mạnh nhất).
- **Biến thức:** cấp 3, 6, 9 mở thêm một hiệu ứng nhỏ hoặc tăng hệ số. Cấp 9 (đại thành) có "tuyệt kỹ" riêng của công pháp đó.
- **Nguồn học:** giữ bí kíp (`bk_<id>`, rơi bí cảnh, mua), kỳ ngộ (`events.js`). Thêm sau: tông môn dạy theo hệ của tông (nối vào nghĩa vụ), tiên thiên (Kiếm cốt thưởng Kim Công, Thú ngữ thưởng đọc quái thú...).

### 1.6 Bỏ tăng tốc tu luyện khỏi công pháp
`trainMul` hiện cho công pháp chính tới khoảng +54% ở tầng 3. Chuyển hết sang tâm pháp (mục 2) để công pháp thuần là chiến đấu. Công tắc `D.TECH2.on`: tắt thì mọi hàm (`trainMul`, `mod('atk')`, `mainElem`) chạy đúng như cũ.

### 1.7 Di chuyển bản cũ (không đổi `TT.VERSION`)
- `TT.tech.bo(c)` **đọc thuần**: nếu `c.bo` chưa có thì tính bộ mặc định từ `c.techs` và `c.techMain` (công pháp chính xếp vào ô đúng loại, các ô còn lại chọn công pháp tầng cao nhất cùng loại), không ghi. Chỉ ghi `c.bo` khi người chơi đổi hoặc khi vào trận lần đầu.
- Công pháp cũ khi tải bản lưu được ánh xạ sang ô mới theo bảng cố định (id cũ sang id mới), giữ nguyên cấp luyện.

## 2. Tâm pháp

### 2.1 Tâm pháp chính: mạch từ các đạo đã đi
**Dùng lại, không làm lại:** `D.PATHS` (5 đạo: Khổ tu, Kiếm sống, Phiêu lưu, Giao du, Luyện nghề), `c.pathMo` (tháng đã đi mỗi đạo, giữ khi đổi), `TT.path.lv` (thành thạo 0 đến 5 theo `PATH_LV_YEARS = [0, 3, 8, 15, 25, 40]` năm), `quitCost` / `abandon` (phạt bỏ đạo: mất đạo tâm và nửa thành thạo), `PATH_ADAPT` (12 tháng thích nghi nửa hiệu lực).

- **Mạch** của một đạo = cấp theo số năm đã đi (cùng bảng `PATH_LV_YEARS`), tính từ `c.path.mo` nếu là đạo hiện tại, từ `c.pathMo[id]` nếu là đạo cũ. Hàm đọc thuần `TT.xinfa.mach(c, id)`.
- Đang đi một đạo thì giữ hiệu ứng đạo hiện có (`path.mods`). **Dư âm tâm pháp** là phần giữ lại vĩnh viễn kể cả khi đã đổi đạo, theo cấp mạch (bảng 2.2).
- **Đổi đạo vẫn bị phạt như cũ** (`quitCost`, nửa thành thạo, thích nghi). Phạt chỉ cắt mạch bị bỏ giữa chừng (theo `PATH_QUIT_KEEP`), không động đến mạch khác.

### 2.2 Dư âm theo mạch (mỗi cấp, trần ở cấp 5)
| Mạch | Mỗi cấp | Trần (cấp 5) |
|---|---|---|
| Khổ tu | tu luyện +3%, đột phá +0.6% | +15% tu luyện, +3% đột phá |
| Phiêu lưu | vận may +1, điểm đọc +0.04 | +5 vận, +0.20 đọc, khí vận +2 |
| Giao du | chống tâm ma +2%, hiệu quả bạn đồng hành +2% | +10% tâm ma, +10% bạn |
| Luyện nghề | thọ nguyên +1.5%, niệm lực +2 | +7.5% thọ, +10 niệm lực |
| Kiếm sống | thu nhập +3% | +15% thu nhập (nhẹ nhất vì xa tu hành) |

### 2.3 Đạo hạnh, ngộ, cộng hưởng và nhất tâm
- **Đạo hạnh** = tổng cấp các mạch (0 đến 25). Mốc 5, 10, 15 mở **ngộ** 1, 2, 3 (tầng ngộ): mỗi tầng một dòng thưởng chung (ví dụ ngộ 1: đột phá +1%, ngộ 2: chống tâm ma +5%, ngộ 3: điểm đọc +0.1 và tu luyện +3%).
- **Cộng hưởng ("đạo viên dung"):** từ 3 mạch cấp 2 trở lên được +3% tu luyện, +1% đột phá. Từ 5 mạch cấp 3 trở lên được thêm +5% tu luyện, +2% đột phá, +10% chống tâm ma, +5% thọ.
- **Nhất tâm:** một mạch đạt cấp 5 thì dư âm mạch đó ×1.5 và mở hiệu ứng riêng (ví dụ Khổ tu nhất tâm: đột phá thất bại thì giữ lại 30% tu vi tích). Đi chuyên và đi rộng đều có giá trị, tổng giá trị xấp xỉ.
- **Biến cố cộng ngộ (nhỏ):** đột phá thành công, qua tâm ma, kỳ ngộ có thể cộng vài tháng vào mạch đang đi (tối đa 6 tháng mỗi biến cố), thay cho việc cày đạo điểm.

### 2.4 Ba phụ
- Slot giữ `min(3, 1 + floor(realm/2))`. Mua bằng đạo điểm như hiện nay, quên mất đạo điểm đã bỏ (giữ nguyên).
- **Yêu cầu mạch (mới):** phụ cũ có điều kiện mạch, nên hướng đi đời quyết định phụ nào mở:
| Phụ | Điều kiện mạch (thêm vào đạo tâm và cảnh giới sẵn có) |
|---|---|
| Tĩnh Tâm Chú, Kim Cang Bất Hoại | không (phụ khởi đầu) |
| Phá Chướng Tâm Kinh | Khổ tu cấp 2 |
| Thái Thượng Vong Tình | Khổ tu cấp 3 |
| Thiên Nhãn Thông | Phiêu lưu cấp 2 |
| Hộ Đạo Tâm Ấn | Giao du cấp 2 hoặc Luyện nghề cấp 2 |
| Trường Sinh Quyết | Luyện nghề cấp 3 |
| Thiên Đạo Cảm Ứng | đạo hạnh từ 12 |
- **Đồng nguyên:** phụ cùng dòng với mạch cấp cao nhất của bạn hiệu lực +25%.
- **6 phụ mới** (nối chiến đấu và có đánh đổi). Tên và lời để Haiku viết, số ban đầu:
| Phụ | Cho | Giá |
|---|---|---|
| Minh Kính Đài | điểm đọc +0.15 | Phiêu lưu cấp 2 |
| Tụ Khí Quyết | độ nạp +1 (nạp bền hơn) | niệm lực cao, Luyện nghề cấp 2 |
| Cuồng Tu Tâm Kinh | tu luyện +20% | thọ nguyên -5%, nguy cơ tâm ma +10% |
| Huyết Tế Tâm Pháp | đột phá +8% | sinh lực tối đa -10% |
| Vong Ngã Thiền | chống tâm ma +20% | gắn bó -20% |
| Hộ Pháp Ấn | giảm 15% đòn khi thua nhịp | tu luyện -5% |
- Mọi đánh đổi dùng chỉ số có sẵn (`train`, `brk`, `life`, `tm`, `hpMax`, `luck`, `kv`, `nl`) cộng `doc` (điểm đọc), `nap` (độ nạp) và `bond` (gắn bó, nếu đã có chỗ đọc thì nối, nếu chưa thì để sau).

### 2.5 Ngân sách tu luyện (giữ nhịp thế giới)
- Mục tiêu: nhịp trung bình người chơi (50 tuổi Luyện Khí, 130 tuổi Trúc Cơ) **lệch không quá ±5%** so với hiện tại cho cùng cách chơi.
- Cũ: công pháp chính cho tới +54% tu luyện. Mới: tổng nguồn tu luyện từ tâm pháp (mạch 15% + ngộ 3% + cộng hưởng tới 8% + phụ vong_tinh 12% và thien_dao 8%) chặn **tối đa +45%** (phụ Cuồng Tu ngoài trần nhưng có giá). Số cụ thể chỉnh khi đo ở CP1 và CP2, không đoán ở đây.
- Công pháp, tâm pháp chỉ người chơi dùng nên không đổi baseline chiến tranh, nhưng đổi nhịp người chơi nên phải đo bằng công cụ mô phỏng đời.

### 2.6 Công tắc và chứng minh
- `D.TAMPHAP.on` tắt thì `S.mod`, `trainMul`, `brk` quay lại đúng như cũ. Chứng minh bằng `node tools/baseline.js --check` (trùng khít) và so nhịp đời với công cụ đời người.
- Hàm đọc không gọi `rng`; trường mới (`c.bo`) khởi tạo muộn; không đổi `TT.VERSION`.

## 3. Kế hoạch phát triển (sáu phiên)

Mỗi phiên làm trên nhánh mới từ `main`, mở PR nháp, ghi mục "Đã làm" cuối phiên, chạy `node tools/run-tests.js` và `node tools/baseline.js --check`. Chạy lần lượt, không song song.

| Phiên | Model | Việc | Người chơi thấy gì | Đo / kiểm |
|---|---|---|---|---|
| **CP1** | Sonnet | **Lõi tâm pháp.** Hàm `TT.xinfa.mach/dao_hanh/ngo/cong_huong` (đọc thuần), cộng dư âm vào `S.mod` và `trainMul` qua công tắc `D.TAMPHAP.on`, trần ngân sách 2.5, bộ kiểm thử. Chưa đổi giao diện. | (ẩn) | `--check` trùng khít khi tắt; đo nhịp 50/130 tuổi trước và sau; kiểm thử đơn vị cho từng mạch và trần |
| **CP2** | Haiku | **Dữ liệu tâm pháp.** Bảng mạch, 4 mốc ngộ, cộng hưởng, nhất tâm; điều kiện mạch của 8 phụ cũ; 6 phụ mới với đánh đổi; chữ mô tả. | (ẩn) | Kiểm thử lint dữ liệu (đủ trường, id duy nhất, ánh xạ chỉ số hợp lệ) |
| **CP3** | Sonnet | **Giao diện tâm pháp.** Trang tâm pháp: thanh năm mạch, đạo hạnh, tầng ngộ, ba phụ có điều kiện mạch hiển thị lý do khóa; nhật ký khi lên cấp mạch; `auto.js` và `report.js` cập nhật. | Thấy tâm pháp lớn dần theo đạo đã chọn | `tests.html`, Playwright chụp màn hình; đo lại nhịp |
| **CP4** | Sonnet | **Khung công pháp.** Schema loại/chiêu/biến, bộ ba `c.bo`, `TT.tech.bo` đọc thuần, di chuyển bản cũ, công tắc `D.TECH2.on`, tách `trainMul` khỏi công pháp, giao diện bộ ba trong túi. Chiến đấu cũ tạm đọc hệ của ô Tụ rồi ô Công thay `mainElem`. | Thấy 3 ô công pháp, đổi được | `--check` trùng khít khi tắt; kiểm thử di chuyển bản lưu cũ; cân bằng người chơi không tụt |
| **CP5** | Haiku | **Dữ liệu công pháp.** 34 công pháp (10 mới), chiêu theo bảng 1.4, biến thức cấp 3/6/9, bí kíp, giá, bảng rơi, văn mô tả. | (ẩn, chờ trận thế) | Lint dữ liệu (đủ 30 ô hệ x loại, 4 đa dụng; `pts` và `realm` đúng mốc) |
| **CP6** | Sonnet | **Mô-đun trạng thái nền và kích nổ** (`js/systems/status.js`, hàm thuần): áp, giảm thời hạn, giới hạn 2, ánh xạ trạng thái sang hệ, kích nổ qua `beats`. Kiểm thử bảng hệ x hệ x trạng thái. | (ẩn, dùng cho C2-1) | Kiểm thử đơn vị đầy đủ; mô phỏng nhỏ xác minh không có chuỗi vô hạn hay âm sát thương |

**Sau CP6:** các phiên `C2-1` đến `C2-5` (lõi trận, giao diện trận, dữ liệu quái, kết liễu và sổ quái, nối truyện) dùng nguyên liệu này. Phiên `C2-6` và `C2-7` cũ trong `C2` đã được gộp vào đây (CP1 đến CP5), cập nhật khi chốt.

### Thứ tự vì sao như vậy
1. Tâm pháp trước (CP1 đến CP3): độc lập hẳn với trận mới, người chơi thấy ngay, và là chỗ rủi ro cân bằng lớn nhất (nhịp 50/130 tuổi), nên đo sớm.
2. Công pháp khung (CP4) trước dữ liệu (CP5): để Haiku có schema rõ.
3. Trạng thái (CP6) sau cùng và độc lập: `duel()` gọi thẳng vào được.

### Rủi ro và cách chặn
| Rủi ro | Chặn |
|---|---|
| Bỏ tăng tốc tu luyện khỏi công pháp làm tụt nhịp thế giới | Ngân sách 2.5, đo trước và sau ở CP1, CP3, CP4; công tắc để quay lại |
| Phá bản lưu cũ | `TT.tech.bo` đọc thuần, không đổi `TT.VERSION`, kiểm thử di chuyển ở CP4 |
| 34 công pháp x biến thức quá nhiều chữ | CP5 giao Haiku; biến thức mỗi công pháp chỉ ba dòng ngắn |
| Trạng thái chồng chéo gây lỗi | Giới hạn 2, không cộng dồn, CP6 kiểm thử bảng |
| Người chơi bị rối khi có 3 ô cộng 3 phụ cộng mạch | Giao diện CP3 và CP4 có "gợi ý bộ mặc định" một chạm; chế độ tự động xếp bộ tốt nhất |
| Mạch Kiếm sống quá yếu | Chấp nhận ở bản đầu, xem lại sau khi người chơi thử |

## 4. Việc cần chủ game duyệt trước CP1
1. Bảng dư âm mạch (2.2) và ánh xạ mạch sang chỉ số có ổn không?
2. Mốc ngộ và cộng hưởng (2.3) có ổn không, hay muốn đơn giản hơn?
3. Bộ ba (mục 1.2) và "công pháp ưu tiên luyện" có ổn không?
4. Sáu phụ mới (2.4): giữ, bớt, hay thêm?

## 5. Đã làm
(chưa có, mới thiết kế)
