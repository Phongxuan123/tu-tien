# T. Âm thanh: bảng sự kiện cho đột phá, thiên kiếp, giao chiến

Trạng thái: **bảng sự kiện và điểm phát đã có; chưa có `audio.js`** (chưa ai nghe được gì). Nhạc nền chưa làm (xem mục 5).

## 1. Nguyên tắc
- Âm thanh chỉ **nghe** bus, không đổi trạng thái, không gọi `rng`. Dùng `Math.random` riêng.
- Chỉ phát cho **người chơi** (NPC cũng đột phá và đánh nhau, phát hết sẽ ồn). Các `emit` dưới đây đã lọc sẵn.
- Phải có công tắc tắt, cài đặt âm lượng khởi tạo muộn, không đổi `TT.VERSION`.
- Âm thanh chỉ bật sau cú bấm đầu tiên của người chơi (trình duyệt chặn tự phát).
- Tốc độ game cao (sự kiện `speed`): chỉ phát âm có ưu tiên Cao trở lên.

## 2. Sự kiện bus đã thêm (đã có trong code)
| Sự kiện | Dữ liệu | Phát ở | Ghi chú |
|---|---|---|---|
| `dotpha:bat-dau` | `{id, realm}` | `cultivation.js` `attemptBreak`, sau log "Bạn bắt đầu đột phá" | `realm` là cảnh giới sắp lên |
| `dotpha:thanh-cong` | `{id, realm}` | `breakSuccess`, sau `realm++` | `realm` mới; `>= 6` là phi thăng |
| `dotpha:that-bai` | `{id, realm}` | `breakFail` | |
| `dotpha:doi-lai` | `{id}` | `rerollBreak` khi dùng Thiên cơ điểm | |
| `kiep:bat-dau` | `{id, target, total}` | `fate.js` `tri.start` | `total` là số đợt (3, phi thăng 4) |
| `kiep:set-danh` | `{id, phase, total, how}` | `tri.strike`, mỗi đợt | `how`: `bua`, `dan`, `ho` hoặc cách khác; `phase/total` tăng độ mạnh |
| `kiep:vuot-qua` | `{id}` | Hết đợt cuối, trước `breakSuccess` | Sau đó còn `dotpha:thanh-cong` |
| `kiep:chet` | `{id, target}` | `hp <= 0` trong `tri.strike` | Còn có sự kiện `death` có sẵn |
| `chien:bat-dau` | `{id, quai}` | `combat.js` `run`, chỉ khi `opts.important` | `quai`: đối thủ là quái |
| `chien:bua` | `{id, loai}` | Dùng Hộ Thân Phù (`ho`) hoặc Liệt Diễm Phù (`cong`) | |
| `chien:ket-thuc` | `{win, ended, player}` | Cuối `run`, cả khi chạy thoát | `ended`: `ko`, `yield`, `time`, `fled`; `player` là người chơi đứng phía `ac` |

Ghi chú: `combat.quick` là bí danh của `run`, nên đánh nhanh cũng phát `chien:ket-thuc` (không phát `chien:bat-dau` nếu không `important`).

## 3. Bảng âm thanh (đề xuất, chưa làm)
Ưu tiên: Rất cao > Cao > Trung bình > Thấp. "Chờ" là thời gian tối thiểu giữa hai lần phát cùng một âm.

| Sự kiện | Âm thanh | Ưu tiên | Cùng lúc | Chờ | Biến thể |
|---|---|---|---|---|---|
| `dotpha:bat-dau` | Gom khí: nốt ngân tăng dần, bộ lọc mở, khoảng 1,5 giây | Cao | 1 | 3 giây | 1 |
| `dotpha:thanh-cong` | Chuông rải lên, thêm nốt cao ngân | Rất cao | 1 | 5 giây | 3 (dưới Kim Đan, từ Kim Đan, phi thăng) |
| `dotpha:that-bai` | Tiếng "tạch" trầm, nốt rơi xuống, nhịp trống thấp | Cao | 1 | 5 giây | 1 |
| `dotpha:doi-lai` | Nốt xoay chuyển ngắn, đảo ngược | Trung bình | 1 | 2 giây | 1 |
| `kiep:bat-dau` | Sấm rền xa, gió | Rất cao | 1 | 5 giây | 1 |
| `kiep:set-danh` | Sét đánh, độ mạnh tăng theo `phase/total`; thêm lớp theo `how` (bùa: vầng sáng, đan: nốt hồi phục, hộ pháp: tiếng giáp) | Rất cao | 1 | 0 | 3 mức |
| `kiep:vuot-qua` | Sấm tan, im 1 giây rồi chuông vang | Rất cao | 1 | 5 giây | 1 |
| `kiep:chet` | Tiếng chuông trầm, nốt rơi dài | Rất cao | 1 | 5 giây | 1 |
| `chien:bat-dau` | Nhịp trống vào | Cao | 1 | 4 giây | 2 |
| `chien:bua` | Vầng sáng (`ho`) hoặc lửa bùng (`cong`) | Trung bình | 1 | 1 giây | 2 |
| `chien:ket-thuc` | Thắng: hai nốt lên. Thua: hai nốt xuống. `ko`: thêm tiếng chém. `fled`: bước chân dồn, gió | Cao | 1 | 1 giây | 4 |

## 4. Cách tạo tiếng (quyết định)
Hiệu ứng tạo bằng Web Audio trong trình duyệt, không có file âm thanh. Lý do: không tốn dung lượng, không vướng bản quyền, đúng kiểu "mở `index.html` là chạy". Giới hạn: nghe "nhạc số" hơn là thu thật. Nếu muốn tiếng thật hơn thì dùng file CC0 (xem mục 5) và ghi vào `CREDITS.md`.

## 5. Chưa làm
- Nhạc nền và chuyển nhạc theo bối cảnh. Bản demo tạo bằng code người dùng thấy chưa đạt, nên hoãn đến khi chọn được nhạc thật.
- File `js/systems/audio.js` (nghe bus, phát theo bảng trên).
- Nút bật/tắt tiếng và thanh âm lượng trong giao diện.
- Âm cho các hệ khác (tông môn, mua bán, chết ngoài thiên kiếp...).

## 6. Đã làm
- Thêm 11 sự kiện bus ở 3 file mô phỏng (xem mục 2). Chỉ phát khi có người chơi, không gọi `rng`.
- Kiểm: `node tools/baseline.js --check` trùng khít đường cơ sở 40 hạt giống; `node tools/run-tests.js`: 138 đạt, 0 lỗi.
- Việc người chơi thử: chưa có gì để nghe. Cần `audio.js` mới thử được.
