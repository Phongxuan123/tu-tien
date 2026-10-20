# T. Đổi cảnh và animation sang pixel thủy mặc kiểu tu tiên

- Trạng thái: Chờ duyệt (đã có hai bản demo; chưa sửa mã game)
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
- Vòng lặp: `requestAnimationFrame`, dừng khi tab ẩn. Mặc định **30 khung/giây** (nhẹ khoảng một nửa so với 60, nhìn gần như không khác với cảnh chậm); sự kiện nhanh (sét, ngự kiếm) cho phép 60. Mục tiêu dưới 4 ms mỗi khung; đo và in khi `?debug=1`.
- Độ phân giải: **480×144** như demo (đề xuất; xem câu hỏi 1). Chuyển bằng cấu hình `W`, `H` trong module để không rải số cứng.
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

- Ma vực của demo dùng cho `ruin` kiểu hung địa và các nơi bị chiến sự nặng.
- **Hoạt ảnh và sự kiện**: `boom` thành đột phá (linh khí hút về, vòng sáng), `thunder` thành thiên kiếp (trời tối, mây xoáy, sét), `rise` thành phi thăng (ngự kiếm hoặc bay lên), `dead` giữ nhưng tối giản; `war` giữ trời đỏ + khói; thời tiết `wid` dùng hạt và lớp phủ.
- **Nhân vật**: sprite 16×24 phóng 1,5 lần làm bản tạm; cần chốt có vẽ tay lại không. Tham số hiện có (`kid`, `elder`, `female`, `wound`, `gear`, `aura`) phải còn được dùng: tóc bạc, nhỏ hơn, vết thương, hào quang; trang bị là phần vật phẩm nên **để sau**. Đi liên tục (nghỉ ngắn), người nhà đi theo.

### 4.4 Phố công trình bấm được
Giữ cách chạy của `ui.bld.draw` (hover, bấm, phân trang) ở chặng đầu và vẽ phố lên **nền mới**; chỉnh kích thước nhà cho hợp tỉ lệ nhân vật. Đổi hình các nhà sang phong cách mới là chặng riêng (công trình, không phải vật phẩm).

## 5. Các chặng (mỗi chặng một phiên; chạy lần lượt)
Ước lượng thô, "lượt" như ở Z.

| Chặng | Việc | Người chơi thấy gì | Lượt |
|---|---|---|---|
| T0 | Tách module, `W/H` cấu hình, `rAF` + khóa dựng lại + đo khung; chưa đổi hình | Giống cũ, chạy mượt hơn | 1 |
| T1 | Trời, núi, mây, thác, sương, 5 pha, 9 địa hình, chuyển pha mượt | Nền mới tu tiên; nhân vật và nhà cũ tạm | 2 |
| T2 | Nhân vật + người nhà + hoạt ảnh đi/đứng; hạt; sự kiện đột phá, thiên kiếp, phi thăng, chết; quái | Nhân vật và hiệu ứng mới | 3 |
| T3 | Công trình đặc trưng theo `cls` và theo bản sắc tông; nơi thờ tự 9 tín ngưỡng | Mỗi nơi có hình riêng | 3 |
| T4 | Phố công trình (bldart) hợp phong cách, giữ tương tác, `mirror` trong cửa sổ | Phố bấm được trên nền mới | 1,5 |
| T5 | Thời tiết, chiến sự, nội thất bí cảnh, `cave`, `void`, mùa | Đủ các tình huống | 2 |
| T6 | Dọn mã cũ, bỏ phụ thuộc Kenney nếu không còn dùng, `CREDITS.md`, tài liệu, đo hiệu năng | Gọn, nhẹ | 1 |

Tổng khoảng **13,5 lượt**. Cổng chơi thử sau **T1** (xem nền trong game thật) và sau **T3**.

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

## 8. Cần bạn chốt (có mặc định)
1. **Độ phân giải**: 480×144 như demo, hay giữ 240×72 (nhẹ hơn nhưng ít chỗ cho núi và mây)? (Mặc định: 480×144.)
2. **Nhân vật**: giữ hệ số 1,5 tạm rồi vẽ tay sau, đổi sang 2x, hay vẽ lại 24×36 ngay? (Mặc định: giữ 1,5 tạm.)
3. **Bảng công trình đặc trưng** ở 4.3 có đúng ý bạn không, tông nào là tông "chính" cần nền riêng trước? (Mặc định: Kiếm Tông và Đan Tông như demo.)
4. **Khung hình**: 30 hay 60 mặc định? (Mặc định: 30, sự kiện 60.)
5. **Mùa**: cảnh có đổi theo mùa của game không, hay chỉ theo năm/pha? (Mặc định: kiểm lại `season` trong game ở T0, có thì dùng.)
6. **Thứ tự**: làm sau Đợt nào của Z? (Mặc định: song song, không đụng mô phỏng; chạy trong nhánh riêng, mỗi chặng một PR.)

## 9. Nhật ký làm việc
- 2026-10-20: lập kế hoạch từ hai bản demo (PR #6) và đối chiếu `scene.js`. Chưa sửa mã game.
