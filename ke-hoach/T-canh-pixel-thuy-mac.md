# T. Đổi cảnh và animation sang pixel thủy mặc kiểu tu tiên

- Trạng thái: **Đã chốt 2026-10-20** (mục 8); đã làm T-A, T-C, T-D (mục 11 đến 13); còn T-B (cắt) và T-Cd (dữ liệu)
- Ngày lập: 2026-10-20
- Liên quan: `js/ui/scene.js`, `js/ui/sprites.js`, `js/ui/bldart.js`, [I-cong-trinh](I-cong-trinh.md) (công trình pixel), [M-tong-mon](M-tong-mon.md) (bản sắc tông), [S-quoc-gia-tong-mon-ton-giao](S-quoc-gia-tong-mon-ton-giao.md) (9 tín ngưỡng, nơi thờ tự), `CREDITS.md`
- Phạm vi: **cảnh và animation** của màn hình nhân vật. **Chưa làm vật phẩm** (biểu tượng vật phẩm, trang bị hiện trên người nếu cần thì để sau).

## 1. Yêu cầu của bạn (đã chốt trong phiên demo)
- Cảnh đầu cột hiện trông như game pixel phương Tây; đổi sang phong cách tu tiên "pixel thủy mặc": núi đá dựng đứng kiểu Quế Lâm, biển mây, đỉnh núi lơ lửng có thác, mái cong đầu đao, đèn lồng, linh khí, hạc, kiếm quang.
- Nhân vật to hơn khoảng 1,5 lần so với demo đầu; cho **đi liên tục**, giảm thời gian đứng nghỉ.
- Các loại địa điểm được phép **giống nhau, khác phối màu và bối cảnh**; bù lại **mỗi công trình phải có tính đặc trưng** (ví dụ tông kiếm có đại kiếm cắm đỉnh núi, tông đan có đan đỉnh). Chữ trên công trình không quan trọng.
- Phần nền của các tông về sau phải **làm khác nhau được** (không chỉ đổi công trình).
- 30 hay 60 fps khác nhau không nhiều thì không cần công tắc; tối giản công năng.
- Chưa vật phẩm.

## 2. Hiện trạng (đối chiếu mã, 2026-10-20)
- `scene.js` (358 dòng): canvas **240×72**, vẽ lại bằng `setInterval(tick, 110)` (khoảng 9 khung/giây), trời 3 màu, hai lớp đồi bằng hàm sin, cây/đèn/biển báo lấy từ tilemap Kenney (CC0) rồi nhuộm màu; mặt đất `GY = 54`.
- Trạng thái cảnh đọc từ game bằng `readState()`: 5 pha (`night`, `dusk`, `day`, `cave`, `void`; chọn theo năm), 9 địa hình (`TERRAIN`), loại nơi (`cls`: town, city, sect, secret, ruin, mine, port, market, guild, vein, gate, road, tribe; thêm shrine của S5), thời tiết (`wid`), chiến sự, nhân vật (tuổi, già, thương, giới, trang bị), người nhà, quái, bí cảnh bên trong, các khoảnh khắc `boom` (đột phá), `thunder` (thiên kiếp), `rise` (phi thăng), `dead`.
- Công trình: `ui.bld.draw` (30 px mỗi nhà, bấm/hover/phân trang) vẽ **phố công trình** lên canvas đệm; người nhà vẽ bằng `person()` (khối 8×19); quái bằng `sprites.js`.
- API cảnh mà nơi khác đang dùng: `ui.scene.W/H`, `mirror` (panels.js vẽ lại cảnh trong cửa sổ), `setPage`, `layout`, `readState`, `palette`, `preview`, `force`; `dock.js` (kéo thả, đổi cỡ). Trang xem asset (`asset-xem.html`, `scenetest.html`).
- Chưa kiểm: mùa trong game có dùng cho cảnh không (có `season` ở `press.js`, `eco.js`...), hiệu năng thiết bị yếu, bài kiểm thử nào đang chạm vào `scene.js`.

## 3. Bằng chứng từ bản demo (PR #6)
- `demo-canh.html`: 3 cảnh (thôn, tông môn, ma vực), 4 giờ, 4 mùa, 3 sự kiện (đột phá, thiên kiếp, ngự kiếm), nhân vật chỉnh được màu áo.
- `demo-tongmon.html`: Kiếm Tông (đại kiếm, kiếm trủng, tháp đỉnh kiếm) và Đan Tông (đan đỉnh có lửa, vườn dược liệu), cho thấy cách ghép module + công trình đặc trưng khá ổn.
- Số đo (Chromium headless, máy phát triển): **0,49 ms mỗi khung** (p95 0,6; tối đa 2,1); dựng lại lớp tĩnh khi đổi cảnh hoặc giờ 13–48 ms; tệp 80 KB, **không tải ảnh nào**. Chưa đo máy yếu.
- Hạn chế đã biết: nhân vật 16×24 còn cứng; vách đá lớn vân rối; hạc, kiếm quang, xương, cờ còn đơn giản; hệ số 1,5 gây pixel lệch kích thước.

## 4. Thiết kế

### 4.1 Hướng kỹ thuật
- **Vẽ bằng mã, hạt giống cố định, không tệp ảnh**: nền không tốn tải. Các lớp tĩnh (trời, núi, kiến trúc, mặt đất) vẽ **một lần** vào canvas đệm theo khóa (cảnh, pha, mùa); mỗi khung chỉ vẽ lớp động (mây trôi, hạt, nhân vật, thác, lửa, sự kiện).
- Dùng khóa `key` của `readState()` sẵn có để biết khi nào dựng lại.
- Vòng lặp: `requestAnimationFrame`, dừng khi tab ẩn. **30 khung/giây cho mọi thứ** (chốt), kể cả sự kiện; không công tắc. Mục tiêu dưới 4 ms mỗi khung; đo và in khi `?debug=1`.
- Độ phân giải: **480×144** (chốt; demo đo 0,49 ms mỗi khung nên không nặng hơn đáng kể so với 240×72). Chuyển bằng cấu hình `W`, `H` trong module để không rải số cứng.
- Giảm hiệu ứng: tôn trọng `prefers-reduced-motion` và có công tắc trong cài đặt (giảm hạt, bỏ rung và chớp).

### 4.2 Tách mã (làm một lần, về sau thêm cảnh chỉ thêm dữ liệu)
```
js/ui/scene/
  core.js      bút vẽ pixel, bộ đệm lớp, bảng màu, chuyển pha mượt, đo khung
  sky.js       trời, sao, trăng, mặt trời, mây cao
  land.js      núi xa/giữa (Quế Lâm), đỉnh lơ lửng + thác, rễ đá, vách + tùng
  cloud.js     biển mây, sương thấp
  arch.js      mái cong, nhà, điện, tháp, cổng, bậc đá, đèn lồng (module dùng chung)
  fg.js        tiền cảnh: tre, tùng, đá, cỏ, lan can
  fx.js        hạt (linh khí, đom đóm, hoa/lá/tuyết), hạc, kiếm quang, thời tiết
  actor.js     nhân vật, người nhà, quái, hoạt ảnh
  events.js    đột phá, thiên kiếp, phi thăng, chết
  scene.js     giữ API `ui.scene` cũ, ghép các lớp
```
Giữ nguyên `ui.scene.W/H`, `mirror`, `setPage`, `layout`, `readState`, `palette`, `preview`, `force` để `panels.js`, `dock.js`, trang xem asset không phải sửa lớn.

### 4.3 Ánh xạ dữ liệu game sang cảnh (dữ liệu, không viết thêm cách vẽ)
- **Pha (5)**: `day`, `dusk`, `night` dùng bảng màu demo (sáng và chiều của demo gộp vào `day`); `cave` và `void` làm bảng riêng (tối, đá đen, ánh xanh tím).
- **Địa hình (9)** thành bộ thông số nền: mật độ và độ cao tháp núi, có đỉnh lơ lửng hay thác không, độ dày biển mây, màu núi/đất, loại cây (tùng, trúc, cây chết), hạt đặc trưng. Ví dụ: Tây Sơn (nhiều tháp cao), Bắc Băng (mũ tuyết), Hỏa Sơn (đỏ, khói), Nam Lâm (rừng dày), Đông Hải (biển), Hoang Mạc (đồi thấp), Vụ Trạch (sương), Lôi Đạo (mây giông).
- **Loại nơi (`cls`)** thành bố cục + công trình đặc trưng (đề xuất, chốt ở câu hỏi 3):

| cls | Công trình đặc trưng |
|---|---|
| sect | Theo bản sắc tông (M): kiếm, đan, phù, trận... mỗi hướng một công trình; có sơn môn, bậc đá dài, đại điện, tháp |
| city | Tường thành, lầu cổng, nhiều mái ngói, đèn lồng giăng |
| town / tribe | Nhà ngói xám, rào tre, ruộng bậc thang, khói bếp / lều da, cột tô-tem |
| port | Bến, thuyền buồm, cầu tàu, nước có sóng |
| guild / market | Dãy cờ hiệu, xe hàng, lán chợ |
| mine / vein | Cửa hầm, xe goòng / trụ linh thạch phát sáng |
| secret | Cổng sáng hoặc xoáy linh khí |
| ruin | Cột đổ, tượng vỡ, rêu |
| gate | Cổng ải, tường, cờ |
| shrine | Biểu tượng theo từng tín ngưỡng (9) |
| road | Cuộn nền, biển chỉ đường, cây ven đường |

- **Chín tông (chốt 2026-10-20)**: nền của tông lấy **địa hình vùng của tông** (chín tông nằm ở chín vùng khác nhau nên nền đã khác) + **một lớp nhấn riêng** + **một công trình đặc trưng** (đều là dữ liệu và module):

| Tông | Vùng | Công trình đặc trưng | Lớp nhấn nền | Ưu tiên |
|---|---|---|---|---|
| Kim Phong Môn (kiếm) | Tây Thiên Sơn | đại kiếm cắm đỉnh núi, kiếm trủng | gió, kiếm quang bay | **1** (đã có demo) |
| Bách Thảo Môn (đan) | Nam Lâm | đan đỉnh có lửa, vườn dược liệu bậc thang | sương xanh, đom đóm | **1** (đã có demo) |
| Âm Hồn Giáo (tà) | Vụ Trạch | tháp xương, cờ chiêu hồn, đèn ma xanh | đầm sương tím, hồn quang | **1** (tà đạo, tương phản mạnh) |
| Thủy Nguyệt Cung | Đông Hải | cung điện trên mặt biển, cầu cong, lầu ngắm trăng | biển sóng, trăng phản chiếu | **1** (cảnh biển, khác hẳn núi) |
| Thanh Vân Tông | Trung Châu | cổng mây, bậc đá dài, rùa đá đội bia | biển mây dày | 2 |
| Huyền Băng Cung | Bắc Băng | cung băng tinh thể, cột băng | tuyết, cực quang | 2 |
| Liệt Hỏa Tông | Hỏa Sơn | lò luyện trong núi lửa, võ đài | tro bay, dung nham | 2 |
| Nhật Luân Giáo | Hoang Mạc | đài nhật luân (đĩa vàng lớn), điện bậc thang | nắng gắt, cát | 2 |
| Tử Lôi Quan | Lôi Đảo | đạo quán trên đảo, cột dẫn lôi | sét tím, mây giông | 2 |

  Ưu tiên 1 làm trước ở T-C; ưu tiên 2 cùng chặng nếu kịp, không thì dùng nền vùng + công trình. Bảng `cls` ở trên **giữ**, thêm: `shrine` vẽ **dáng kiến trúc** của nơi thờ (chùa, nhà thờ, thánh đường, đền, đạo quán, văn miếu, từ đường, đền thần, miếu) theo S mục 3 (tôn trọng, không dùng biểu tượng thiêng làm trang trí tùy tiện).
- Ma vực của demo dùng cho `ruin` kiểu hung địa và các nơi bị chiến sự nặng.
- **Hoạt ảnh và sự kiện**: `boom` thành đột phá (linh khí hút về, vòng sáng), `thunder` thành thiên kiếp (trời tối, mây xoáy, sét), `rise` thành phi thăng (ngự kiếm hoặc bay lên), `dead` giữ nhưng tối giản; `war` giữ trời đỏ + khói. **Cảnh đổi theo thời tiết** (chốt, thay cho mùa): mỗi thời tiết vùng trong `js/data/regions.js` (khoảng 2 mỗi vùng: bão biển, ngư triều, bão gió, tuyết lở, mưa độc, linh vũ, bão tuyết, cực quang, phun trào, hỏa tinh, bão cát, thu hoạch, chiến loạn...) có một bộ thông số: lớp phủ màu trời, loại hạt (mưa, tuyết, cát, tro, lá, linh quang), gió (mây, cây, tà áo nghiêng), chớp; không có thời tiết thì cảnh thường. Mùa chỉ dùng nếu game đã có sẵn (kiểm ở T-A), không tự tạo.
- **Nhân vật** (chốt): sprite 16×24 phóng **2x** (pixel đều). Ba kiểu di chuyển: **đi** (mọi lúc, đi liên tục, nghỉ ngắn), **bay** (lướt thấp, tà áo bay) và **ngự kiếm** (đứng trên kiếm, vệt kiếm quang); bay và ngự kiếm **mở từ Trúc Cơ** (`c.realm >= 2`), dùng khi đang đi đường (`c.travel`, `c.cross`) hoặc ngẫu nhiên khi rảnh ở nơi rộng (nhìn thấy cảnh giới qua dáng đi). Tham số hiện có (`kid`, `elder`, `female`, `wound`, `gear`, `aura`) phải còn được dùng: tóc bạc, nhỏ hơn, vết thương, hào quang; trang bị là phần vật phẩm nên **để sau**. Đi liên tục (nghỉ ngắn), người nhà đi theo.

### 4.4 Phố công trình bấm được
Giữ cách chạy của `ui.bld.draw` (hover, bấm, phân trang) ở chặng đầu và vẽ phố lên **nền mới**; chỉnh kích thước nhà cho hợp tỉ lệ nhân vật. Đổi hình các nhà sang phong cách mới là chặng riêng (công trình, không phải vật phẩm).

## 5. Các chặng (gộp lại 2026-10-20 để tiết kiệm: 4 phiên Sonnet + 1 phiên Haiku)
| Chặng | Model | Việc (gộp từ T0 đến T6 bản đầu) | Người chơi thấy gì |
|---|---|---|---|
| **T-A** | Sonnet | tách module, `W/H` = 480×144, `rAF` 30 khung + khóa dựng lại + đo khung; trời, núi, mây, thác, sương, 5 pha, 9 địa hình, chuyển pha mượt; nhà, người nhà, quái cũ vẽ lên nền mới (phóng theo tỉ lệ); **gộp phần cơ bản của T-B: nhân vật 2x + di chuyển (đi; bay và ngự kiếm từ Trúc Cơ)** | nền tu tiên mới, nhân vật mới biết đi, bay, ngự kiếm |
| ~~T-B~~ | | **(cắt 2026-10-20)** phần còn lại để sau: vẽ lại nhân vật đẹp hơn (biến thể kid, elder, wound, aura), hạt linh khí, hạc, kiếm quang, sự kiện đột phá, thiên kiếp, phi thăng (giữ hiệu ứng cũ của `scene.js` cho các sự kiện này) | |
| **T-Cd** | Haiku | dữ liệu: thông số 9 địa hình, bảng `cls`, 9 tông (bảng 4.3), thời tiết vùng, nơi thờ (chỉ dữ liệu theo định dạng T-A đã đặt) | (chưa thấy) |
| **T-C** | Sonnet | module công trình đặc trưng theo `cls`, 4 tông ưu tiên 1 (+ ưu tiên 2 nếu kịp), nơi thờ; phố công trình bấm được trên nền mới, `mirror` | mỗi nơi có hình riêng |
| **T-D** | Sonnet | thời tiết vùng, chiến sự, bí cảnh, `cave`, `void`; dọn mã cũ, bỏ Kenney nếu không còn dùng, `CREDITS.md`, đo hiệu năng | đủ tình huống, gọn |

Cổng chơi thử sau **T-A** (xem nền trong game thật) và sau **T-C**. **Ngân sách**: khoảng 3 phiên Sonnet + 1 Haiku; chạy T-A trước, xem rồi mới quyết làm tiếp (ưu tiên lõi truyện nếu tiền eo hẹp).

## 6. Kiểm thử và đo (mỗi chặng)
- Đây là thay đổi giao diện: `node tools/baseline.js --check` phải **trùng khít** `tools/baseline/seeds.json` (không chạm mô phỏng); `node tools/run-tests.js` không thêm bài đỏ.
- Mã cảnh đọc trạng thái, **không gọi `rng` của mô phỏng** và không khởi tạo dữ liệu (CLAUDE.md điều 5); hạt giống riêng cho hình.
- Chụp ảnh bằng Playwright: mỗi cảnh x pha chính, các sự kiện, máy tính và điện thoại; tự xem lại và chỉnh tới khi nhìn "đúng chất" rồi mới chốt.
- Đo: thời gian vẽ mỗi khung (mục tiêu dưới 4 ms), thời gian dựng lại lớp tĩnh, dung lượng tải thêm (mục tiêu gần 0).
- Chữ trong game: tiếng Việt, tên tông cổ trang (CLAUDE.md điều 7); chữ trên biển hiệu không quan trọng.
- Chọn model: cơ chế và giao diện phức tạp dùng Sonnet; dữ liệu tham số (bảng màu, địa hình, loại nơi) dùng Haiku.

## 7. Rủi ro
- **Hình dạng nhân vật và công trình đặc trưng** làm bằng mã vẫn là bản tạm; muốn đẹp hẳn cần tranh vẽ tay (nhất là nhân vật). Kế hoạch coi bản mã là nền chạy được, thay sprite sau không phải sửa cơ chế.
- **Đổi kích thước 240×72 thành 480×144** có thể làm vỡ bố cục chỗ dùng `W/H` (cửa sổ `mirror`, CSS, dock). Làm ở T0 và kiểm cả ba cỡ dock.
- **Hiệu năng máy yếu chưa đo**: giữ 30 khung/giây mặc định, dừng khi tab ẩn, có giảm hiệu ứng.
- **Nền khác nhau cho từng tông** tốn công thiết kế và chỉnh bằng mắt cho mỗi tông; chọn trước vài tông chính, còn lại dùng bộ nền chung đổi màu.
- **Phụ thuộc Kenney**: bỏ ở T6; đảm bảo không còn nơi nào cần tilemap trước khi xóa.
- **Hệ số 1,5** cho nhân vật làm pixel không đều; chọn 2x hoặc vẽ lại 24×36 khi chốt (câu hỏi 2).

## 8. Đã chốt (2026-10-20)
1. **Độ phân giải 480×144** (không nặng hơn đáng kể).
2. **Nhân vật 2x**; có **đi**, **bay**, **ngự kiếm** (bay và ngự kiếm mở từ Trúc Cơ).
3. **Bảng công trình**: giữ bảng `cls`; chín tông theo bảng ở 4.3; **ưu tiên nền riêng trước: Kim Phong Môn, Bách Thảo Môn, Âm Hồn Giáo, Thủy Nguyệt Cung**.
4. **30 khung/giây** cho mọi thứ.
5. **Cảnh đổi theo thời tiết vùng** (mùa chỉ dùng nếu game có sẵn).
6. **(2026-10-20) T-B cắt còn phần cơ bản (nhân vật 2x + di chuyển) và gộp vào T-A**; hiệu ứng, hạt, vẽ lại nhân vật để sau.
7. **Làm ngay**, song song với lõi truyện (không đụng mô phỏng), nhánh riêng `canh-thuy-mac` từ `main`, mỗi chặng một commit, một PR cho cả T.

## 9. Nhật ký làm việc
- 2026-10-20: lập kế hoạch từ hai bản demo (PR #6) và đối chiếu `scene.js`. Chưa sửa mã game.
- 2026-10-20: chốt mục 8 (480×144, nhân vật 2x có đi/bay/ngự kiếm từ Trúc Cơ, 30 khung, cảnh theo thời tiết vùng, bảng chín tông và 4 tông ưu tiên); gộp T0 đến T6 thành T-A, T-B, T-Cd, T-C, T-D; thêm prompt (mục 10).

## 10. Prompt các phiên
Dùng chung: "Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `main`. Trả lời tiếng Việt, ngắn gọn, xưng "mình", gọi tôi là "bạn". Đọc CLAUDE.md. Làm trên nhánh `canh-thuy-mac` (chưa có thì tạo từ origin/main; đã có thì checkout và merge origin/main). TIẾT KIỆM: chỉ đọc phần ghi dưới; Playwright chụp tối đa 4 ảnh và tự xem lại; kiểm thử chạy đầy đủ một lần cuối. Không gọi rng của mô phỏng, không sửa js/systems; `node tools/baseline.js --check` phải trùng khít. Cuối: ghi "T-x đã làm" vào ke-hoach/T-canh-pixel-thuy-mac.md (kèm ms mỗi khung), push theo CLAUDE.md, mở PR nháp nếu chưa có, báo ngắn."

**T-A (Sonnet):** [dùng chung] + "Đọc ke-hoach/T-canh-pixel-thuy-mac.md mục 2, 4.1, 4.2, 4.3 (phần pha, địa hình, nhân vật), 8; demo-canh.html (lấy cách vẽ trời, núi Quế Lâm, đỉnh lơ lửng, thác, biển mây, sương, bảng màu, bộ đệm lớp, nhân vật và ngự kiếm); js/ui/scene.js (cả file, giữ API ui.scene), js/ui/dock.js và js/ui/panels.js chỗ dùng ui.scene (mirror, W/H). Làm chặng T-A: tách js/ui/scene/ theo 4.2 (đăng ký trong js/files.js), W/H = 480×144 cấu hình một chỗ, requestAnimationFrame 30 khung dừng khi tab ẩn, dựng lại lớp tĩnh theo key của readState, đo khung khi ?debug=1; nền mới cho 5 pha và 9 địa hình (thông số địa hình để trong một đối tượng dữ liệu riêng để T-Cd mở rộng); chuyển pha mượt; nhân vật người chơi 16×24 phóng 2x (lấy từ demo, giữ các biến thể sẵn có kid, elder, female, wound bằng cách đơn giản nhất), đi liên tục nghỉ ngắn, bay (lướt thấp) và ngự kiếm (đứng trên kiếm, vệt sáng) khi c.realm >= 2 lúc đi đường (c.travel, c.cross) hoặc thỉnh thoảng khi rảnh; nhà, người nhà, quái cũ vẽ lên nền mới đúng tỉ lệ; các sự kiện boom, thunder, rise, dead giữ hiệu ứng cũ (chỉ chỉnh tỉ lệ). Giảm hiệu ứng theo prefers-reduced-motion. Kiểm ba cỡ dock và cửa sổ mirror. Chụp: 1 vùng núi ban ngày, 1 vùng biển ban đêm, 1 ngự kiếm, 1 trên điện thoại."

**T-B:** cắt (xem mục 5); làm sau nếu còn ngân sách.

**T-Cd (Haiku):** [dùng chung] + "Đọc T mục 4.3 (bảng cls và bảng chín tông), 'T-A đã làm' (định dạng dữ liệu cảnh); js/data/sects.js (id tông), js/data/regions.js (id thời tiết), js/data/faiths.js (nơi thờ); S mục 3 (viết tôn trọng). Chỉ viết DỮ LIỆU vào tệp dữ liệu cảnh mà T-A đã đặt: thông số đủ 9 địa hình, mỗi cls một bố cục (danh sách module và vị trí), 9 tông (công trình đặc trưng, lớp nhấn, bảng màu, ưu tiên), mỗi thời tiết vùng một bộ (lớp phủ, hạt, gió, chớp), 9 nơi thờ (dáng kiến trúc). Thêm bài kiểm thử cú pháp dữ liệu (đủ khóa, id có thật). Không vẽ module mới."

**T-C (Sonnet):** [dùng chung] + "Đọc T mục 4.3, 4.4, 8, các mục 'đã làm'; demo-tongmon.html (đại kiếm, kiếm trủng, đan đỉnh, vườn dược); js/ui/scene/arch.js; js/ui/bldart.js và ui.bld.draw. Làm T-C: module kiến trúc dùng chung (mái cong, điện, tháp, cổng, bậc đá, đèn lồng) và công trình đặc trưng cho 4 tông ưu tiên 1 (Kim Phong Môn, Bách Thảo Môn, Âm Hồn Giáo, Thủy Nguyệt Cung), 5 tông còn lại nếu kịp; bố cục theo cls; nơi thờ theo dáng kiến trúc; phố công trình bấm được (hover, bấm, phân trang) vẽ lên nền mới, mirror trong cửa sổ. Chụp: 4 tông ưu tiên 1."

**T-D (Sonnet):** [dùng chung] + "Đọc T mục 4.3 (thời tiết, war, cave, void), 7, các mục 'đã làm'. Làm T-D: thời tiết vùng theo dữ liệu T-Cd (lớp phủ, hạt, gió nghiêng mây/cây/tà áo, chớp), chiến sự (trời đỏ, khói), nội thất bí cảnh, cave, void; dọn mã scene cũ không dùng, bỏ tilemap Kenney nếu không còn nơi nào dùng (cập nhật CREDITS.md), đo hiệu năng (ms mỗi khung trung bình, p95, thời gian dựng lại), giảm hiệu ứng. Chụp: 3 thời tiết, chiến sự."
- 2026-10-20: cắt T-B còn phần cơ bản (nhân vật 2x + đi, bay, ngự kiếm) và gộp vào T-A; hiệu ứng, hạt, vẽ lại nhân vật để sau.

## 11. T-A đã làm (2026-10-20)
- **Tách mã** `js/ui/scene/`: `core` (cấu hình `CFG` W=480, H=144, GY=124, FPS=30 ở một chỗ; bút vẽ; bộ đệm lớp; đo khung), `data` (bảng màu 5 pha + đối tượng `TERRAIN` 9 địa hình, **T-Cd mở rộng ở đây**), `sky`, `land`, `cloud`, `arch`, `fg`, `fx`, `actor`, `events`, `legacy` (công trình khối cũ cho cls chưa có bố cục, nội thất bí cảnh), rồi `js/ui/scene.js` ghép lớp và giữ API `ui.scene` (W, H, mirror, setPage, layout, readState, palette, preview, force, state, draw, init). Đăng ký trong `js/files.js` (thêm `TT_SCENE()` cho trang thử). `scenetest.html`, `uimock.html`, CSS đã đổi sang 480×144.
- **Vòng lặp**: `requestAnimationFrame` giới hạn 30 khung/giây, dừng khi tab ẩn; lớp tĩnh dựng lại theo khóa (địa hình, pha, chiến sự, giông, chết; riêng lớp kiến trúc theo cls và có phố hay không), chuyển pha mượt 1,3 giây; `?debug=1` hiện ms mỗi khung ở góc cảnh.
- **Nền**: 5 pha (day, dusk, night theo bảng demo; cave, void bảng riêng), 9 địa hình khác nhau bằng dữ liệu (mật độ/độ cao tháp, đỉnh lơ lửng + thác, biển mây hoặc mặt nước Đông Hải có bóng trăng, màu đá/trời/mây, kiểu cây tiền cảnh, hạt tuyết/tro/cát). Các lớp xa lặp được nên khi đi đường cảnh trượt liên tục.
- **Nhân vật** 16×24 phóng 2x: đi liên tục nghỉ ngắn; bay (lướt thấp, tà áo bay) và ngự kiếm (đứng trên kiếm, vệt sáng) từ `c.realm >= 2` khi đi đường (`c.travel`, `c.cross`) hoặc thỉnh thoảng khi rảnh. Biến thể: kid (thấp), elder (tóc bạc, gậy), female (tóc dài), wound (băng đỏ). Người nhà đi theo; quái vẽ bằng `ui.sprites.monster` ở tỉ lệ 4 (boss 6); kẻ thù dùng sprite mới. Nhà bấm được vẽ ở tọa độ cũ rồi phóng 2x (60 px mỗi nhà), nhãn và bấm chuột khớp.
- **Giữ nguyên** hiệu ứng cũ boom, thunder, rise, dead và thời tiết (chỉ chỉnh tỉ lệ); `prefers-reduced-motion` giảm hạt, bỏ sway, chớp và rung.
- **Chưa làm (để chặng sau)**: hiển thị trang bị trên người (vật phẩm), hạc, kiếm quang bay ngang trời, vẽ lại sự kiện (T-B cắt); công trình đặc trưng theo cls/tông (T-C); cls chưa có bố cục vẫn dùng khối cũ tĩnh (thành, mỏ, bến, chợ, linh mạch, cổng ải); thời tiết theo dữ liệu vùng (T-D); Kenney không còn dùng trong cảnh nhưng chưa xóa tài nguyên (T-D).
- **Đo** (Chromium headless): **~1,0–1,4 ms mỗi khung** (p95 1,5; tối đa 25–72 ms ở khung dựng lại lớp tĩnh), dựng lại lớp tĩnh **9–31 ms**, không tải ảnh. Kiểm thử `node tools/run-tests.js`: 138 đạt, 0 lỗi; `node tools/baseline.js --check`: trùng khít 40 hạt giống. Cửa sổ `mirror` vẽ đủ 480×144; ba cỡ dock và điện thoại chạy không lỗi. Ảnh chụp ở `demo-canh-anh/T-A/`.
- **Cần người chơi thử**: nhân vật ngự kiếm khi đi đường từ Trúc Cơ; tỉ lệ nhà so với nhân vật (nhà 2x còn hơi lùn); độ đẹp từng địa hình.

## 12. T-C đã làm (2026-10-20)
- **Module mới** (`js/ui/scene/`, đăng ký trong `js/files.js`): `place` (bố cục theo cls: thành trì, cửa ải, bộ tộc, bến, chợ/thương đoàn, mỏ, linh mạch, bí cảnh, sân nơi thờ; thôn trấn và tàn tích ở `arch.js`), `sect` (khung chung + công trình đặc trưng chín tông), `shrine` (dáng kiến trúc chín nơi thờ), `street` (phố công trình bấm được vẽ bằng kiến trúc mới). Kiến trúc dùng chung (mái cong đầu đao, điện, tháp nhiều tầng, cổng và bậc đá, lan can, đèn lồng) ở `arch.js`.
- **Dữ liệu** thêm vào `data.js` để T-Cd chỉnh: `SECT_STYLE` (id tông → công trình, lớp nhấn, màu mái, pha màu đá/trời/mây), `CLS_LAYOUT` (cls → danh sách module), `FAITH_FORM` (id tín ngưỡng → dáng kiến trúc). `readState` có thêm `sect`; bảng màu và khóa dựng lại tính theo tông.
- **Chín tông** (cả chín, không chỉ bốn ưu tiên): Kim Phong Môn (đại kiếm cắm đỉnh, kiếm trủng, gió + kiếm quang), Bách Thảo Môn (đan đỉnh có lửa, vườn dược liệu, sương xanh + đom đóm), Âm Hồn Giáo (tháp xương, cờ chiêu hồn, đèn ma xanh, hồn quang tím), Thủy Nguyệt Cung (cung điện trên cọc giữa biển, cầu cong, lầu ngắm trăng), Thanh Vân Tông (cổng mây, rùa đá đội bia), Huyền Băng Cung (tinh thể băng, cực quang), Liệt Hỏa Tông (lò luyện, võ đài, tro bay), Nhật Luân Giáo (đài nhật luân), Tử Lôi Quan (đạo quán, cột dẫn lôi, sét). Công trình hai tông sau cùng và Liệt Hỏa chỉ ở mức khối đơn giản, cần chỉnh bằng mắt thêm.
- **Phố công trình**: nhà thường vẽ bằng `arch.hall` (mái cong, cửa lưới, cửa sổ sáng đèn về đêm) rồi gọi biểu tượng treo cửa của `ui.bld.icon` (mới); 13 công trình có hình riêng (sơn môn, tàng kinh các, điện chưởng môn, võ đài, bến tàu, cổng ải, cổng thám hiểm, hầm mỏ, hang chợ đen, hàng rong, lều tộc trưởng, trận đài, đài đại bỉ) có bản vẽ mới trong `street.js`; hover, bấm, phân trang, nhãn chữ và cửa sổ `mirror` giữ như T-A. Nơi thờ theo 9 dáng: chùa (tháp tầng), nhà thờ, thánh đường (vòm + tháp nhọn), đền tháp bậc, đạo quán, văn miếu, từ đường, đền thần, miếu; chỉ vẽ kiến trúc, không dùng biểu tượng thiêng làm trang trí.
- **Kiểm thử**: thêm bài "Cảnh pixel (T-C)" (đủ khóa dữ liệu, vẽ chín tông, chín nơi thờ, mọi cls và 9 địa hình không lỗi, không gọi rng). `node tools/run-tests.js`: **170 đạt, 2 lỗi có sẵn** (Nhịp quyết định, Sửa lõi 8B2; đã ghi ở Z từ trước). `node tools/baseline.js --check`: trùng khít 40 hạt giống. Đo trong game (Chromium headless): khoảng 1,7–1,8 ms mỗi khung (p95 4,5), dựng lại lớp tĩnh 7–16 ms. Ảnh: `demo-canh-anh/T-C/`.
- **Chưa làm**: biểu tượng sơn môn/biển hiệu mang chữ riêng của tông; tông khác nhau về bố cục phố (phố vẫn do `TT.bld.at` quyết định); module Sơn môn bậc đá chung cho cả chín tông; nội thất bí cảnh (T-D); thời tiết vùng (T-D).

## 13. T-D đã làm (2026-10-20)
- **Thời tiết vùng** (`js/ui/scene/weather.js`, dữ liệu `WEATHER` trong `data.js`, đủ 18 loại có trong `js/data/regions.js`): mỗi loại có lớp phủ màu trời/mây/sương (tối dần về đêm, vào khóa dựng lại lớp tĩnh), loại hạt (mưa thường/độc/linh, tuyết, cát, lá, cánh hoa, tro và tàn lửa, sao băng hỏa tinh, dạ quang, bọt sóng ngư triều, cực quang, tia nắng), mật độ, gió, chớp, sương thêm. Gió (`wind` -1..1, mặc định theo địa hình): làm mây trôi nhanh hơn, **cây tiền cảnh nghiêng** (cắt lớp thành dải, dải cao lệch nhiều, chân cố định), **tà áo và thân người nghiêng** (shear quanh chân), khói và hạt bay theo.
- **Chiến sự** (`s.war` hoặc thời tiết `chien_loan`): trời đỏ như T-A, thêm ba cột khói tối bay theo gió và quầng lửa dưới chân (đèn `always`), tro bay.
- **Nội thất bí cảnh** (`dungeon.js`, độ phân giải đầy đủ thay cho bản khối 2x cũ): tinh thể (bí cảnh), sảnh cổ có cột đuốc cháy (tàn tích), hang đỏ có xương, mắt đỏ chớp, vết nứt dung nham (hung địa); các ô kho báu, chỗ nghỉ, cạm bẫy, thủ lĩnh vẽ theo kích thước mới. **Hư không**: tinh vân tím, đỉnh đá trôi, vệt sao, biển mây tím.
- **Giảm hiệu ứng**: theo `prefers-reduced-motion` và **công tắc "giảm hiệu ứng" trên thẻ màn hình nhân vật** (nhớ trong `tt8b_ui`, `ui.scene.setReduced`): hạt còn 35%, bỏ sway, bỏ chớp và rung, gió và nhấp nháy đèn yếu đi.
- **Dọn mã**: xóa `legacy.js` (công trình khối và nội thất cũ), hàm thời tiết cũ trong `fx.js`, chớp cũ trong `events.js`; **bỏ hẳn gói Kenney Pixel Platformer** (`assets/cc0/kenney-pixel-platformer/`, 1,2 MB) và `tools/tilepick.html`; `CREDITS.md` đã cập nhật (gói Platformer Art Deluxe chưa dùng vẫn giữ).
- **Đo hiệu năng** bằng `node tools/scene-perf.js` (mới; Chromium headless, 30 khung/giây đạt 96 khung mỗi 3,2 giây): **trung bình chung 1,53 ms mỗi khung, nặng nhất 2,17 ms** (Bách Thảo Môn), p95 từ 0,6 đến 5,0 ms (nhiều nhất ở tông có phố và hạt: 4,6 đến 5,0), khung lớn nhất 6 đến 33 ms (khung dựng lại lớp tĩnh), **dựng lại lớp tĩnh 3 đến 19 ms** (nặng nhất khi vào cảnh đầu tiên). Nội thất bí cảnh rẻ nhất (0,5 đến 0,6 ms). Chưa đo máy yếu.
- **Kiểm thử**: thêm bài "Cảnh pixel (T-D)" (đủ thông số cho mọi thời tiết trong dữ liệu vùng, vẽ từng thời tiết kể cả khi giảm hiệu ứng, chiến sự, 3 loại bí cảnh x 6 loại ô, hư không, không gọi rng). `run-tests`: **171 đạt, 2 lỗi có sẵn** (Nhịp quyết định, Sửa lõi 8B2); `baseline --check`: trùng khít 40 hạt giống. Ảnh: `demo-canh-anh/T-D/` (bão biển, bão tuyết, bão cát, chiến sự, bí cảnh và hư không).
- **Chưa làm**: dữ liệu thời tiết vẫn do mình đặt trong `data.js` (T-Cd chưa chạy), chỉnh bằng mắt từng loại hạt; thời tiết chưa tác động lên nội thất bí cảnh (cố ý); sét thiên kiếp, đột phá, phi thăng vẫn hiệu ứng cũ (T-B).
