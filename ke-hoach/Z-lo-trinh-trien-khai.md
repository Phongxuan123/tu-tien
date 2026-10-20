# Z. Lộ trình triển khai tổng thể (Q, R, S, E, F)

- Trạng thái: Chờ duyệt (kế hoạch thực thi; chưa code)
- Ngày lập: 2026-10-18
- Mục đích: gom **một lộ trình làm việc duy nhất** cho các kế hoạch lớn còn lại: **Q** (cốt truyện), **R** (nhân duyên), **S** (quốc gia, tông môn hiện đại, tôn giáo, mạng quan hệ, M5b), **E** (kinh tế, phần còn tồn), **F** (hoàn thiện thế giới, phần còn tồn). Chi tiết thiết kế của từng hệ vẫn ở file riêng; file này chỉ nói **làm gì trước, làm thế nào, kiểm gì, khi nào dừng để bạn chơi thử**.
- Liên quan: [S-quoc-gia-tong-mon-ton-giao](S-quoc-gia-tong-mon-ton-giao.md) (mục 11, 15), [Q-cot-truyen](Q-cot-truyen.md) (mục 19, 24), [R-nhan-duyen](R-nhan-duyen.md), [E-kinh-te](E-kinh-te.md), [F-hoan-thien-the-gioi](F-hoan-thien-the-gioi.md), [P-nghia-vu-dan-so](P-nghia-vu-dan-so.md) (mục 11), [M-tong-mon](M-tong-mon.md), [G-nhat-bao](G-nhat-bao.md)

---

## 1. Hiện trạng chính xác (đối chiếu code và kế hoạch, 2026-10-18)

**Đính chính:** bạn gọi E và F là "phần chưa làm", nhưng theo `KE-HOACH.md` và code thì **phần lớn đã làm**; còn **phần tồn** là thứ lộ trình này xử lý.

| Hệ | Đã làm (có kiểm thử) | Còn tồn (đưa vào lộ trình) |
|---|---|---|
| **E Kinh tế** | E0 đến E6: giá 63 ô theo cung cầu, cú sốc, hạn dùng, kênh mua, thương hội và gia nhập hội, kết thân ở chợ, cướp đường, nhà đấu giá, đồ nhái | **Giám định**; **nhiệm vụ, vay, bảo hiểm của hội**; **thuế vương triều vào giá** (đang giản lược); móc kinh tế với quốc vận, tôn giáo (lễ hội, thuế tôn giáo) khi S xong; chờ bạn chơi thử E0 đến E6 |
| **F Hoàn thiện thế giới** | F1 thương hội; F2 hiệp ước (cống, thuế, chư hầu, minh ước, bảo hộ) và F4 dân số ẩn (đã code lõi) | **F3** vòng xung đột và hòa giải; **F5** hồ sơ quan hệ người chơi với từng thế lực; **F2 phần sau** (nhiệm vụ do thế lực giao, trưng binh gắn hiệp ước, thuế vào giá, sơ đồ vẽ hiệp ước, thông gia, thuế thương hội) |
| **S Quốc gia, Tông, Tôn giáo** | Chỉ có kế hoạch (bản 3 + mục 15 triển khai S1) | Toàn bộ S1 đến S11 |
| **Q Cốt truyện** | Chỉ có kế hoạch (bản 12, có mục 24) | Q1 đến Q10 |
| **R Nhân duyên** | Chỉ có kế hoạch (bản 2) | R1 đến R6 |
| **M5b Liên tông** | Xong (S8, 2026-10-19) | Cổng chơi thử 5 còn chờ bạn |
| **Khác liên quan** | G nhật báo, I2, I3, N, O, J, K, L, M1 đến M3, M5a, M7 đã xong | I4/I5 (dịch vụ công trình còn lại), M4, M6 (để sau) |

**Cơ sở kỹ thuật hiện có:** 93 bài kiểm thử `tests.html` (khoảng 3 phút), `tools/econ-sim.js`, `tools/calib.js`, `tools/dgsim.js`, `tools/quest-sim.js`; mô phỏng thế giới 300 năm khoảng 260 ms; `TT.VERSION` giữ nguyên bằng cách khởi tạo muộn mọi trường mới.

---

## 2. Nguyên tắc triển khai (áp dụng cho mọi chặng)

1. **Một chặng, một thứ chơi thử được.** Sau mỗi chặng game vẫn chạy và tất cả bài kiểm thử cũ vẫn đạt.
2. **Không đổi cân bằng một cách vô tình.** Chặng nào *không nhằm* đổi cân bằng (như S1) phải chứng minh bằng **hash đường cơ sở** trùng khít; chặng nào có chủ ý đổi (F3, S3, S6...) phải đo lại các chỉ tiêu (mục 6) và ghi số trước/sau.
3. **Không đụng bộ sinh số ngẫu nhiên khi chỉ đọc.** Hàm đọc (giao diện, ma trận, kiểm thử) tuyệt đối không gọi `rng` (xem S 15.2).
4. **Tương thích ngược.** Trường mới khởi tạo muộn, **không đổi `TT.VERSION`**; API cũ (`relV`, `relAdd`, `align`, `power`) giữ nguyên giao diện đến khi có chặng thay thế rõ ràng.
5. **Dữ liệu nằm ở `js/data/`, hệ số chỉnh được**, tên người chơi thấy là tiếng Việt cổ trang (Đan Các, Khí Các...); tên nước thật chỉ ở tài liệu.
6. **Mỗi chặng có checklist xong**: mã, kiểm thử mới, chạy đầy đủ `tests.html`, đo cân bằng nếu liên quan, kiểm giao diện (Playwright, ảnh chụp máy tính và điện thoại), cập nhật tài liệu, commit và đẩy theo `CLAUDE.md`.
7. **Giao diện gộp vào chỗ sẵn có** khi hợp lý (ví dụ ma trận quan hệ vào **Biên niên sử**), tránh thêm tab.
8. **Nhịp hỏi người chơi** luôn dưới 6 lần mỗi phút; hộp mới đi qua kênh tầng 2 có sẵn.
9. **Nội dung nhạy cảm** (tôn giáo thật, nước thật): xem S mục 3 nguyên tắc 5 đến 7; bạn duyệt chữ trước khi coi là xong.

---

## 3. Sơ đồ phụ thuộc và đường găng

```
Đợt 0 Hạ tầng (chạy kiểm thử, hash cơ sở)
   │
   ├─> Đợt 1: S1 Mạng quan hệ ──> F3 Xung đột và hòa giải
   │        │
   │        ├─> Đợt 2: S2 Giá trị tông, công–tội, cơ quan, gia tộc/hội/triều
   │        │        └─> Đợt 3: S3 Quốc vận, nho khí ──┐
   │        │                                          ├─> Đợt 5: E7 (E còn tồn + móc S)
   │        └────────> Đợt 4: S4 Chỉ số tông ─ S5 Tôn giáo lõi ──┘
   │
   ├─> Đợt 6: S6 Quân đội, chiến tranh tổng ─ S7 Triều chính ─ F2 phần sau
   │        └─> Đợt 7: S8 M5b Liên tông
   │
   ├─> Đợt 8: Q0–Q2 Nền nhân vật + Khung tuyến   ║   R1 Mô hình quan hệ   (song song, cần Q1.3 cho R1–R3)
   │        └─> Đợt 9: Q3–Q4 Xuất thân, xương sống ║ R2 Đạo lữ, R3 Con cái, R4 Dây duyên
   │
   ├─> Đợt 10: F5 Hồ sơ quan hệ người chơi ─ S9 Người chơi vào cuộc   (cần Q2)
   │
   └─> Đợt 11: Q5–Q7 + Q10 (mục 24) ─ S10 ─ R5/R6    (nội dung)
            └─> Đợt 12: S11 + Q8 hoàn thiện (giao diện, cân bằng, mobile)  ──> Q9 AI (tùy chọn)
```
- **Đường găng:** Đợt 0 → 1 → 2 → 3 → 4 → 6 → 7 (S hoàn chỉnh) song song Đợt 8 → 9 → 10 → 11 → 12.
- **Có thể song song** (nếu làm hai phiên): Đợt 8 (Q nền, R1) với Đợt 2 trở đi, vì ít đụng `factions.js`.
- **File dễ xung đột:** `js/systems/factions.js` (S1, F3, S3, S4, S6, S7, S8), `js/systems/sect.js` (S2, S4, S8), `js/systems/pacts.js` (S1, F2-sau, S8), `tests.html` (mọi chặng), `js/ui/history.js` (S1, S3, S5). Quy tắc: mỗi chặng chỉ chạm các chỗ nó cần, không tái cấu trúc rộng.

---

## 4. Các đợt chi tiết

### Đợt 0. Hạ tầng và đường cơ sở (khoảng 0,5 lượt)
**Mục tiêu:** có công cụ chạy kiểm thử trong môi trường này và mốc "trước khi sửa".
- [x] `tools/run-tests.js`: kịch bản Playwright (Chromium có sẵn) mở `tests.html`, chờ `window.__done`, in kết quả đạt/lỗi và thời gian; tham số lọc bài.
- [x] `tests.html`: thêm `?only=<từ khóa>` (bài không khớp bị bỏ qua; mặc định chạy tất cả).
- [x] `tools/baseline.js`: dựng thế giới cho 6 hạt giống (301, 911, 77, 5, 12, 33), chạy 300 năm `TT.fac.yearly()`, xuất hash của `f.rel`, số chiến tranh theo thời đại, chiều dài `chron`, trạng thái thế lực, số hiệp ước; lưu `tools/baseline/seeds.json` (đưa vào repo làm mốc).
- [x] Chạy đầy đủ 96 bài: đạt hết, 98 giây.
- **Cổng:** 93 bài đạt trong môi trường này; `seeds.json` tạo ra và tái lập được (chạy hai lần ra cùng hash).

### Đợt 1. Mạng quan hệ nhiều chiều (S1) và vòng xung đột (F3) (khoảng 3 lượt)
**S1 đã xong (2026-10-18)** (chi tiết ở S mục 15, kết quả ở S 15.12; **giao diện gộp vào Biên niên sử**, không tạo tab mới):
- [x] `js/data/diplo.js`, `js/systems/diplo.js`, sửa `js/files.js`, `fac.relAdd/relV`, 14 chỗ gắn sổ ân oán; hash cơ sở trùng.
- [x] `js/ui/diplo.js` (hàm `buildDiplo(box, c)`) gọi từ `history.js`: mục mới **"Quan hệ thế lực"** gập được, đặt trước "Sử ký": ma trận có lọc loại, hồ sơ cặp, hồ sơ thế lực; khóa vẽ lại của tab Biên niên sử thêm số mục sổ ân oán.
- [x] Bài `Mạng quan hệ nhiều chiều (S1)` (9 mục kiểm thử ở S 15.7).
**F3 Vòng xung đột và hòa giải** (**có chủ ý đổi cân bằng**):
- [ ] Dùng sổ ân oán làm **đồng hồ căng thẳng** theo cặp: ân oán xấu gần đây + tranh chấp (mỏ, địa bàn, nguồn hàng) → ngưỡng tạo **xung đột nhỏ** (tranh chấp, trục xuất sứ, cắt hàng) → có thể leo thang thành chiến tranh hoặc **hòa giải** (môi giới của hội, hòa nghị chủ động, sứ giả).
- [ ] Sửa lỗ hổng "Thịnh thế 25 năm không có cuộc chiến nào" (F mục 3 điểm 3): đảm bảo mỗi 25 năm có ít nhất vài xung đột nhỏ dù chiến tranh hiếm.
- [ ] Tần suất theo thời đại (hệ số `D.ERAS[..].war` đã có) nối vào ngưỡng.
- [ ] Đo lại: khoảng 52 chiến tranh và 10 diệt vong mỗi 300 năm (±25%); lập đường cơ sở mới `seeds.json` sau F3.
- **Cổng chơi thử 1 (bạn xem):** mở Biên niên sử → "Quan hệ thế lực": ma trận, hồ sơ cặp, sổ ân oán có hợp lý không; xung đột nhỏ có đủ vui không.

### Đợt 2. Giá trị tông, công–tội, cơ quan, nguyên mẫu (S2) (khoảng 2 lượt) — đã xong 2026-10-18 (xem S mục 15.13; công trình mới và độ hợp giá trị người chơi dời sang các đợt sau)
- [ ] `js/data/sects.js`: thêm `gt`, `chiso`, `chinhsach`, `cong`, `toi`, `bimat`, `nguyenmau`, `coquan` cho 9 tông (số trong S 6.5); `align` thành **nhãn suy ra** từ `gt` và `nhan`.
- [ ] Đổi gia nhập/trục xuất/cộng thiên hướng (`sect.js` dòng 38-40, 112, 295-304) sang **độ hợp giá trị**; giữ kiểm thử cũ (gia nhập, trục xuất) đạt.
- [ ] Bật chiều `dao` trong `diplo` (trọng số 0,3) từ độ gần `gt`; đo lại cân bằng, lập đường cơ sở mới.
- [ ] Bộ máy tên cổ (Đan Các, Khí Các, Trận Các, Phù Các, Tài Các, Thiên Cơ Các, Mật Các, Y Quán...) trong phố tông môn M7: đặt tên lại công trình hiện có, thêm công trình thiếu (dùng pixel mã hóa như `bldart.js`, trang xem thử `asset-tongmon.html`).
- [ ] Gia tộc `kieu` (tài phiệt, thương gia, học thuật), thương hội và 9 triều: dữ liệu bản sắc (S 7); hiển thị mô tả trong Biên niên sử.
- [ ] **Thẻ tông** (giao diện): trục giá trị, bảy chỉ số (chữ, radar nhỏ), công–tội, chính sách, bí mật (che đến khi lộ).
- **Cổng chơi thử 2:** đọc thẻ chín tông, kiểm các nguyên mẫu và công–tội có đúng ý (nhất là Âm Hồn Giáo và Kim Phong).

### Đợt 3. Quốc vận và nho khí (S3) (khoảng 2 lượt) — đã xong 2026-10-18 (xem S mục 15.14; `strength()` dùng vận trực tiếp, quan chế, vùng cấm đánh nhau, long mạch động dời sang các đợt sau)
- [x] `js/data/nation.js`, `js/systems/nation.js`: `world.fac.nat[triều]` (`van`, `nho`, `mach`...), nguồn tăng giảm, thiên mệnh (đổi chủ/chia cắt/thôn tính), phản phệ cơ bản, long mạch (nối N), văn vị cá nhân.
- [x] `power` của triều **suy ra** có hệ số bù; đo bật/tắt như F4 (40 hạt giống: 52,2 → 48,1 chiến tranh), giữ chỉ tiêu.
- [x] Hiển thị: thanh bậc quốc vận trong Nha môn, mô tả trong Biên niên sử (mục "Quốc gia"), tin tức, biên niên.
- [x] Bài kiểm thử: quốc vận trong khoảng, mất mệnh có hậu quả, thế giới luôn đủ 9 triều có chủ, nho khí giảm tà khí, lưu/tải.

### Đợt 4. Chỉ số tông, chính sách và Tôn giáo lõi (S4, S5) (khoảng 3 lượt) — S4 và S5 đã xong 2026-10-19 (xem S mục 15.15 và 15.16; thánh chiến, hương hỏa nuôi công trình, ma trận quan hệ giáo hội dời sang sau)
**S4:** 7 chỉ số + 5 chính sách của tông, `power` suy ra, thanh trừng hiếm; đo cân bằng. **Đã làm:** trạng thái theo thế giới, `power` suy từ chỉ số (công tắc `D.SECT_MOD.on`, 40 hạt giống trùng khít khi tắt), năm chính sách tác dụng nhỏ có trần, thanh trừng hiếm, thẻ tông đọc giá trị hiện có. Còn tồn: bài "Nhịp quyết định" lỗi ở 12 hạt giống (xem S 15.15).
**S5 Tôn giáo:**
- [x] `js/data/faiths.js` (9 tín ngưỡng tên thật, giới, phái, lồng được, hiệu ứng), `js/systems/faith.js` (`world.fac.faith`: 3 ô mỗi vùng, quy tắc lồng (Thiên Chúa giáo và, mặc định, Hồi giáo không lồng), hương hỏa, giáo hội, quốc giáo, phái/dị giáo hiếm).
- [x] **Nơi thờ tự**: loại địa điểm `tho_tu` (đại điện cho ô 1 mỗi vùng, miếu cho ô 2, 3), biểu tượng pixel theo tín ngưỡng, dịch vụ (cầu an, tụng kinh, cứu trợ, chữa bệnh); thêm vào `places.js` an toàn cho bản lưu cũ.
- [x] Tín ngưỡng cá nhân (`c.faith`, `c.tam`), giữ giới, nghi lễ, hành hương; hôn nhân khác đạo (móc R).
- [x] Bài kiểm thử: tổng `share` bằng 1, không quá 3 ô, quy tắc lồng, đẩy ô yếu nhất, đại điện đúng chủ.
- **Cổng chơi thử 3:** thẻ tông + tab/mục Tín ngưỡng + một vòng đời ở vùng có nơi thờ tự.

### Đợt 5. Kinh tế còn tồn, nối S (E7) (khoảng 2 lượt) — E7a đã xong 2026-10-19 (E mục A.18); E7b đã xong 2026-10-19 (E mục A.19: giám định, vay, đơn, bảo hiểm); chỉ tiêu lãi buôn (khoảng 25%) vẫn chưa đạt, cần chặng đo chuyến buôn người chơi
- [x] **Giám định** (E7b; đồ nhái, thông tin bất cân xứng; nhà đấu giá và chợ đen).
- [x] **Hội: nhiệm vụ, vay, bảo hiểm** (E7b; trong cửa sổ hội; hộ tống chưa làm).
- [x] **Thuế vào giá** theo triều (E7a): `giá x (1 + thuế_suất x 0,15)` đọc từ `nat` và dân tâm; hiển thị ở Nha môn (F2 phần sau).
- [x] Móc S vào kinh tế (E7a; cú sốc `chien_tong` khai báo, S6 gọi sau): lễ hội tôn giáo tạo cầu, thuế tôn giáo là nguồn cho triều, quốc vận cao ổn giá, chiến tranh tổng (S6) làm cú sốc lớn.
- [x] Đo lại bằng `tools/econ-sim.js` (E7a: 48,5% trước, 49,2% sau, chưa đạt khoảng 25%; xem E A.18) các chỉ tiêu E (lãi buôn tối đa 25% trung bình...).
- **Cổng chơi thử 4:** chơi thử kinh tế E0 đến E6 + E7a + E7b.

### Đợt 6. Quân đội, chiến tranh tổng, triều chính, F2 phần sau (S6, S7) (khoảng 4 lượt) — ĐÃ XONG 2026-10-19 (S6a, S6b, S7 và F2 phần sau; xem S mục 15.17 đến 15.19)
- [x] **S6a**: quân lực, phẩm, sát khí, tướng, quân trận, bảng lính tương đương (`TT.army.vsCultivator`), bản sắc quân 9 triều, `strength()` dùng quân lực (không đếm đôi với quốc vận); đo: chiến tranh 54,5 (từ 47,5), diệt vong 6,8 (chưa đạt ±25%, từ 6,0), đổi chủ 10,3 (từ 4,5).
- [x] **S6b**: **engine chiến tranh tổng** (đa bên, nhiều chiến tuyến, 10-18 năm, giai đoạn, trần hậu quả, phản phệ, tông buộc chọn phe, `TT.totalwar.start` cho Q); đo 40 hạt giống: chiến tranh 54,5 → 57,0, diệt vong 6,8 → 7,7 (vào chỉ tiêu), đổi chủ 10,3 → 9,8, đại chiến 0,6 mỗi 300 năm (không vi phạm 150 năm). Cốt truyện Phù Lệnh (Q 24.5b), thương vong tu sĩ và mất tướng vẫn để sau.
- [x] **S7**: triều chính (hoàng quyền, kế vị có tranh ngôi và nội chiến nhỏ có trần, thế gia, quốc sách với tu sĩ, quốc giáo gắn triều); đo: chiến tranh 57,0 → 51,5, diệt vong 7,7 → 9,4, đổi chủ 9,8 → 7,7 (xem S 15.19).
- [x] **F2 phần sau**: trưng binh gắn hiệp ước chư hầu, nhiệm vụ thế lực (hộ tống cống, đòi nợ cống, dẹp loạn) qua hệ nhiệm vụ A, thông gia (`hon_uoc`), thuế thương hội (`thue_hoi`).
- [x] Bài kiểm thử (S6a): bảng lính tương đương (Kim Đan bị vây thua, Hóa Thần thắng đại quân nhỏ), tắt thì trùng khít, lưu/tải, bản cũ, hiệu năng.
- [x] Bài kiểm thử (S6b): chiến tranh tổng không phá chỉ tiêu, phản phệ có trần, giai đoạn và kết đúng điều kiện, 150 năm, lưu/tải, tắt trùng khít (107 bài đạt).

### Đợt 7. M5b Liên tông (S8) (khoảng 1,5 lượt) — ĐÃ XONG 2026-10-19 (xem S mục 15.20; còn Cổng chơi thử 5)
- [x] Tông ↔ triều (quốc sư, cung phụng, ngoài vòng pháp luật, thao túng), minh ước liên tông, giải đấu 4 hoặc 10 năm, đại chiến liên tông có hậu quả, Thiên hạ công ước.
- [x] Giao diện: mục "Liên tông" trong tab Tông môn; tin trong Nhật báo.
- **Cổng chơi thử 5:** thế giới tự chạy 200-300 năm quan sát biên niên (hoặc chạy thử tốc độ cao): tông diệt, tông mới, liên minh, đại chiến có hợp lý không.

### Đợt 8. Nền nhân vật và khung tuyến, làm theo lát cắt dọc (chốt lại 2026-10-19, phiên thiết kế)
**Nguyên tắc riêng của Đợt 8-9 (chốt 2026-10-19):**
- **Chỉ áp hệ mới cho người chơi và con của người chơi.** NPC giữ `baseKv`, `personality`, cách bốc tiên thiên cũ; chỉ có **hàm ánh xạ đọc** (ví dụ nhãn cũ ra bốn trục) khi chặng truyện cần đọc NPC. Vì vậy công tắc tắt phải trùng khít `tools/baseline/seeds.json`, và chỉ tiêu Trúc Cơ+ (đo trên NPC) gần như không đổi.
- **Lát cắt dọc:** sớm có một tuyến truyện thật chạy được để chơi thử, không làm hết nền rồi mới có truyện.
- **Chơi thử bằng đọc:** `tools/life-sim.js` chạy một đời rồi in truyện đời dạng văn bản (từ 8B); trang thử nghiệm chọn sẵn nhân vật (từ 8C).
- [x] **8A** (Sonnet) Q1.3 tính cách bốn trục + Q1.2 khí vận v2, chỉ cho người chơi; vỏ `S.kv` giữ cho mã cũ.
  **Đặc tả 8A (chốt 2026-10-19, lượt 2 và 3):**
  - *Tính cách người chơi* `c.nature = {tinh, xuthe, daoduc, tudung}` (−10..+10), **định lúc sinh, ngẫu nhiên, không để trung dung hết**: mỗi trục bốc trong khoảng ±8 (dồn về giữa nhẹ), bảo đảm ít nhất 2 trục có |giá trị| ≥ 3. Bốc bằng **băm từ hạt giống thế giới và id nhân vật, không gọi `rng`** (để thế giới không lệch). Nhãn cũ `personality` của người chơi suy từ hai trục lệch nhất (cho `boldOf`, `path.js`, `social.js` cũ đọc).
  - *Hộp "Đời mới"* (khi tạo thế giới và khi đầu thai; không áp cho kế thừa con): hiện tên, xuất thân, tư chất, tiên thiên, khí vận, bốn thanh tính cách; **ngân sách 4 điểm** (+/− giữa các trục, tổng chênh không đổi); **nếu người chơi không chỉnh, máy phân 4 điểm** vào trục đang lệch nhất (cá tính rõ hơn); nút **"Bốc lại" không giới hạn** (= tạo thế giới mới với hạt giống mới; khi đầu thai thì bốc lại người chơi); nút "Bắt đầu". Hộp **chỉ là giao diện** (không dùng `w.pending`, không chặn `simulate`); chế độ Tự động/kiểm thử bỏ qua hộp. Hộp này về sau chứa xuất thân (9A), tuổi thơ (9A), và là trang thử nghiệm (8C).
  - *Dịch trục*: mọi lựa chọn cũ dịch theo `kind` (Q 6.4; ±0,25 đến 1), có quán tính và trần ±3 mỗi trục mỗi năm; nhật ký khi đổi dải; sổ `c.natureLog` 30 mục. **Chưa** khóa mềm, **chưa** phí trái tính với sự kiện cũ (dành cho chặng truyện mới từ 8B).
  - *Chọn mặc định*: `chooseIndex` của người chơi dùng độ hợp tính cách thay cho `bold` (quy tắc nếu-thì vẫn đè).
  - *Tác động số*: chỉ độ liều và tâm ma (trần ±10% ở đầu cực); tu luyện ±5% hoãn.
  - *Khí vận*: `c.kvPts` = đúng lần rút `baseKv = rng.RI(0, 10)` hiện có (không thêm lần rút); **không trần**; **vừa thụ động vừa tiêu**: `S.kv(c)` của người chơi = min(kvPts, 20) + phần Mệnh cách của tiên thiên (`S.mod(c,'kv')`), nên tiêu điểm làm giảm vận thụ động. Nguồn cộng ở 8A: kỳ ngộ vận mệnh +2 (thay `baseKv += 3..8`), Nhẫn thật +2 (thay +15/+30), đột phá Kim Đan trở lên +1 mỗi cảnh giới; các nguồn khác ở 8B+. Không cộng theo thời gian. Sổ `c.kvLog` 20 mục. Hồ sơ: "Khí vận: N điểm". NPC giữ `baseKv` y nguyên.
  - *Bản lưu cũ*: người chơi chưa có `c.nature` thì suy từ `personality` (bảng Q 6.8) + băm; chưa có `kvPts` thì `kvPts = max(0, round(baseKv))`. Không đổi `TT.VERSION`.
  - *Công tắc*: `D.NATURE.on = false` thì mọi thứ chạy như cũ và `node tools/baseline.js --check` trùng khít. Bật thì đo 40 hạt giống (người chơi tự chọn khác nên thế giới có thể lệch nhẹ) và ghi số.
  **8A đã làm (2026-10-19):** `js/data/nature.js` (`D.NATURE`), `js/systems/nature.js` (`TT.nature`: `ensure`, `get`, `band`, `label`, `summary`, `rows`, `shift`, `shiftKind`, `affinity`, `mods`, `autoAlloc`, `set`), `js/systems/kv.js` (`TT.kv`: `pts`, `ensure`, `add`, `addOnce`, `spend`, `can`, `log`), `js/ui/newlife.js` (hộp Đời mới), khối Tính cách và "Khí vận: N điểm" ở Hồ sơ.
  - *Bốc*: `rollVec(hạt giống thế giới, id, muối)` bằng băm FNV và mulberry32 riêng; muối là `rng.getState()` lúc sinh (chỉ đọc), nên "Bốc lại" khi đầu thai ra người khác mà không rút thêm số: trạng thái rng bật/tắt công tắc bằng nhau (có bài kiểm). Nhãn cũ `c.personality` của người chơi suy từ trục (khoảng cách tới véc-tơ bảng Q 6.8; trục lệch nhất dưới 3 thì "Bình thường") và cập nhật mỗi lần trục đổi.
  - *Dịch trục*: `kindAx` risk (tinh −0,5), safe (tinh +0,3), fight (xuthe −0,4, tinh −0,4), flee (tinh +0,4), help (daoduc +0,6), pay (xuthe +0,4). Quán tính: đi tiếp vào dải cực ×0,6, đạo tâm trên 50 giảm tới 20%, mỗi cảnh giới −4% (tối đa 5), trên 60 tuổi ×0,85; trần ±3 mỗi trục mỗi năm (biến cố lớn ±6, tham số `big`). Móc ở `events.apply` (mọi hộp sự kiện, kể cả máy tự chọn) và `decisions.resolve` (hộp khác có `kind`).
  - *Chọn mặc định*: người chơi `w *= affinity` (1 + 1,2·s khi hợp, 1/(1 + 1,2·|s|) khi trái, s ∈ [−1, 1]); `boldOf` còn hướng đi nhân `mods.bold` (±10%). Tâm ma: `mods.tamMa` (±0,10) cộng vào xác suất đối mặt ở `tam_ma` và `cx_tam_ma`. Tu luyện ±5% hoãn.
  - *Khí vận*: `kvPts` = đúng lần rút `baseKv` (trước khi cộng nhẫn); nhẫn lúc sinh +2 qua `TT.kv.add`; `S.kv` người chơi = min(kvPts, 20) + Mệnh cách. Nguồn: kỳ ngộ vận mệnh +2 (vẫn rút `RI(3,8)` bỏ đi để dòng rng không đổi), Nhẫn thật +2, đột phá Kim Đan trở lên +1 mỗi cảnh giới (cờ `kv_realmN`). Hồ sơ hiện "Khí vận: N điểm" (kể cả khi chưa biết khí vận). Người kế thừa chưa có `kvPts`: suy từ `baseKv` khi đọc.
  - *Hộp Đời mới*: lớp phủ giao diện, `TT.time.hold` dừng đồng hồ (không dùng `w.pending`); mở từ bus `reincarnate` có `kind: 'new'` (`first` = thế giới mới); không mở khi `kind: 'heir'`, chế độ Tự động, hay khi không nạp giao diện (kiểm thử). Ngân sách: dồn tối đa 4 điểm +/− (mỗi bấm một điểm, bấm ngược thì hoàn); nếu không chỉnh gì thì `autoAlloc` dồn 4 điểm vào trục lệch nhất (tràn sang trục kế khi đầy ±10); chỉnh dở dang thì giữ nguyên phần đã chỉnh. "Bốc lại": thế giới mới thì `createWorld(hạt giống ngẫu nhiên)`; đầu thai thì khôi phục ảnh chụp trước lúc sinh (`life.undo`, chỉ chụp khi giao diện bật) rồi đốt vài số rng và sinh lại. Bản lưu ghi lại khi bắt đầu.
  - *Công tắc*: `D.NATURE.on = false` tắt cả tính cách lẫn khí vận người chơi; `node tools/baseline.js --check --nature=off` trùng khít 40/40 hạt giống 101-140. Cờ `--nature=off` thêm vào `tools/baseline.js`.
  - *Đo*: 40 hạt giống 101-140, 300 năm: **bật và tắt cùng một kết quả** (chiến tranh 48,0, diệt vong 7,2, đổi chủ 9,5; hash trùng khít cả khi bật), vì baseline chỉ chạy thế giới thế lực, không bước người chơi, và việc bốc người chơi không rút thêm số rng. Nên không ghi lại `seeds.json`. Ảnh hưởng của người chơi lên thế giới sẽ đo bằng `life-sim` ở 8B.
  - *Kiểm thử*: 9 bài mới nhóm "Tính cách và khí vận (8A)"; chạy đầy đủ 118 đạt, 0 lỗi, 147 giây. Giao diện kiểm bằng Playwright (máy tính 1280 và điện thoại 390): hộp Đời mới, + / −, Bốc lại (thế giới mới và đầu thai), tự phân 4 điểm, Hồ sơ và lịch sử, chế độ Tự động không hiện hộp; không lỗi console của 8A.
  - *Còn lại / lưu ý*: khóa mềm và phí trái tính (8B), tu luyện ±5% (hoãn), sổ đời hiện tính cách cuối đời (chưa), tính cách kế thừa 15% khi đầu thai (Q 6.3, chưa), `c.align` chưa đồng bộ với Đạo đức. Lỗi cũ không thuộc 8A: `js/ui/map.js:126` (`svg.removeChild(wait)` sau khi hàm gọi lại đã gỡ `wait` khi địa hình có sẵn trong bộ nhớ đệm) thỉnh thoảng ném lỗi console khi vẽ lại bản đồ ngay sau đầu thai.
- [x] **8A2** (Haiku dữ liệu) + **8A3** (Sonnet nối) **Tuổi thơ** (chốt 2026-10-19, lượt 4; kéo lên từ 9A, bản chung không cần xuất thân; bản theo xuất thân thêm ở 9A).
  **Đặc tả tuổi thơ:**
  - *Luồng*: hộp Đời mới (bốc, chỉnh 4 điểm, Bốc lại) → bấm xác nhận → **ba hồi** lần lượt: Hồi 1 (0 đến 3 tuổi), Hồi 2 (4 đến 7), Hồi 3 (8 đến 11) → **hộp Tổng kết** lúc vào game 12 tuổi (tính cách đã đổi ra sao, chỉ số nhận được, dòng tóm tắt từng hồi; có nút "Đầu thai lại" bốc lại cả đời) → thế giới chạy như hiện nay.
  - *Số sự kiện mỗi hồi*: luôn có sự kiện 1; sự kiện 2 xuất hiện **50%**; sự kiện 3 xuất hiện **25%** (tức 50% khi đã có sự kiện 2). Trung bình khoảng 5 sự kiện mỗi tuổi thơ.
  - *Ngẫu nhiên*: bốc sự kiện bằng **băm** (hạt giống thế giới, id, hồi, thứ tự), **không gọi `TT.rng`**, không lặp sự kiện trong một đời.
  - *Mỗi sự kiện*: 2 đến 3 lựa chọn; mỗi lựa chọn có `kind`, dịch trục `ax` (±1 đến ±3) và **1 đến 2 hiệu ứng chỉ số** trong danh sách cho phép: `atk`, `nl`, `hp` (chỉ số gốc), `gold`, `luck`, `daoTam`, `tuchat` (+1, hiếm), `kv` (±1, hiếm), `wake` (thức tỉnh một tiên thiên ẩn, chờ 8C; trước 8C bỏ qua), `bad` (nhận một tật cũ), `ban` (thiện cảm với bạn thuở nhỏ của `TT.social.childhood`).
  - *Trần cả tuổi thơ* (cộng dồn, kẹp khi áp): atk +6, nl +6, hp +30, gold ≤ vàng xuất thân, luck ±3, daoTam ±10, tuchat +1, kv ±1, tối đa 1 tật; tổng không mạnh hơn một tiên thiên Hiếm.
  - *Tự động / kiểm thử*: không hiện hộp; chọn theo độ hợp tính cách (`TT.nature.affinity`) và ghi tóm tắt vào nhật ký. Hộp chỉ là giao diện, không dùng `w.pending`.
  - *Dữ liệu* `js/data/childhood.js` (`D.CHILDHOOD`): **ít nhất 8 sự kiện mỗi hồi (24 sự kiện)**, khe `{ban}` tùy chọn, chữ ngắn (2 đến 3 câu), giọng đời thường pha nhẹ.
  - *Công tắc*: `D.CHILDHOOD.on`; tắt thì `--check` trùng khít. Bật thì người chơi mạnh hơn chút ở 12 tuổi: đo 40 hạt giống, ghi số.
  **8A2 đã làm (2026-10-19):** `js/data/childhood.js` (`D.CHILDHOOD`: 27 sự kiện, 9 mỗi hồi; 4 sự kiện có khe `{ban}`), đăng ký trong `js/files.js`; 5 bài "Dữ liệu tuổi thơ (8A2)". Chưa có hệ thống (chờ 8A3). Kiểm thử 123 đạt, 0 lỗi; `baseline.js --check` trùng khít 40/40.
  **8A3 đã làm (2026-10-20):** `js/systems/childhood.js` (`TT.childhood`: `plan`, `begin`, `current`, `pick`, `fit`, `fx`, `apply`, `finish`, `auto`, `summary`, `text`, `pending`), `js/ui/childhood.js` (hộp từng sự kiện, hộp kết quả, hộp Tổng kết 12 tuổi), đăng ký trong `js/files.js`; móc ở `life.reincarnate` (`js/systems/world.js`), `ui.newLife.start` (`js/ui/newlife.js`: sau khi xác nhận thì mở tuổi thơ; thêm `ui.newLife.reroll` cho "Đầu thai lại") và `js/main.js` (`ui.childhood.resume()`: tải bản lưu giữa chừng thì mở tiếp).
  - *Bốc*: `plan(c)` bằng băm FNV và mulberry32 riêng, khóa là hạt giống thế giới + id + `birthMonth` + tên; không gọi `TT.rng`, đọc thuần. Sự kiện 1 luôn có, sự kiện 2 theo `p2`, sự kiện 3 theo `p3` khi đã có 2; không lặp trong đời; sự kiện `needBan` chỉ bốc khi có bạn thuở nhỏ (NPC còn sống thiện cảm ≥ 20, chọn theo băm). Đo 2.000 lần bốc: **1,75 sự kiện mỗi hồi** (khoảng 5,25 mỗi tuổi thơ; trên 40 hạt giống 101-140 đo 5,4).
  - *Áp*: `ax` qua `TT.nature.shift(c, ax, d, 'tuổi thơ', 'free')`: tham số `big === 'free'` mới thêm vào `shift` bỏ trần ±3 mỗi năm và không ghi nhật ký đổi dải từng lần (vẫn có quán tính). `fx` cộng dồn vào `c.childFx`, kẹp theo `D.CHILDHOOD.cap` (atk, nl, luck, daoTam, kv hai phía; tuchat ≥ 0; vàng ± vàng xuất thân và không âm; tối đa một tật); `hp` cộng vào `trainHp`, `atk` và `nl` vào `baseAtk` và `baseNl`, `luck` vào `baseLuck`, `tuchat` +1 vào hệ lớn nhất, `kv` qua `TT.kv.add` (âm thì trừ `kvPts` không xuống dưới 0), `ban` qua `TT.rel.ensure`, `wake` bỏ qua (chờ 8C). Máu đầy sau mỗi lần áp. Dữ liệu người chơi: `c.child` (`steps`, `i`, `nat0`, `gold0`, `done`), `c.childFx`, `c.childLog`; không đổi `TT.VERSION`.
  - *Luồng*: `life.reincarnate` sau khi phát `reincarnate`, nếu hộp Đời mới không mở (Tự động, kiểm thử, `D.NATURE.on = false`) thì gọi `TT.childhood.auto(c)` (chọn theo `TT.nature.affinity`, hòa thì lựa chọn đầu); nếu hộp đang mở thì `start()` sau xác nhận mở hộp tuổi thơ. Mỗi sự kiện có chấm ● "hợp tính" (độ hợp > 1,05) và chữ kết quả trước khi sang sự kiện kế. Tổng kết: đổi tính cách (làm tròn một số lẻ), chỉ số nhận được, tóm tắt ba hồi; "Đầu thai lại" = Bốc lại cả đời (mở lại hộp Đời mới), "Vào đời" lưu và đóng. Nhật ký: một dòng mỗi hồi, một dòng chỉ số, một dòng tính cách. Không dùng `w.pending`; `TT.time.hold` dừng đồng hồ.
  - *Công tắc*: `D.CHILDHOOD.on = false` thì `node tools/baseline.js --check --childhood=off` trùng khít 40/40 (cờ mới thêm vào `tools/baseline.js`).
  - *Đo*: 40 hạt giống 101-140, 300 năm: **bật cũng trùng khít** (chiến tranh 48,0, diệt vong 7,2, đổi chủ 9,5), vì baseline chỉ chạy thế giới thế lực và tuổi thơ không rút rng; không ghi lại `seeds.json`. Người chơi ở 12 tuổi (trung bình 40 hạt giống): Công +1,45, Linh lực +2,83, Sinh lực +0,83, Vàng −0,17, May mắn +0,28, Đạo tâm +2,55, Tư chất +0,18, Khí vận +0,18; 35% có một tật, 35% có sự kiện bạn thuở nhỏ.
  - *Kiểm thử*: 4 bài "Tuổi thơ (8A3)" (số sự kiện theo p2/p3 trên 2.000 lần bốc, không lặp, không gọi rng, đọc thuần; kẹp trần; auto theo affinity, nhật ký, lưu/tải, bước dở dang; công tắc); sửa 2 bài cũ (Quy tắc nếu-thì, khí vận 8A) tắt tuổi thơ khi dựng người chơi vì tuổi thơ đổi tính cách và khí vận. Chạy đầy đủ 127 bài. Giao diện bằng Playwright (máy tính 1280 và điện thoại 390): hộp Đời mới → Bắt đầu → các sự kiện → kết quả → Tổng kết → Đầu thai lại (lại ba hồi) → Vào đời; chế độ Tự động không hiện hộp; không lỗi console.
  - *Còn lại*: `wake` chờ 8C; tuổi thơ theo xuất thân ở 9A; sổ đời chưa hiện tuổi thơ; kế thừa con không có tuổi thơ.
- [x] **8B** (Sonnet) Q2 `TT.story` + `TT.wheel` bản tối thiểu, **một tuyến thật** làm mẫu, `story-lint` rút gọn, lệnh nhảy tới chặng, `tools/life-sim.js`.
  **Đặc tả 8B (chốt 2026-10-19, lượt 5):**
  - *Tuyến mẫu*: **xương sống A, mốc A1 đến A3** (Q 9.1): A1 Mầm xanh (vào đời 12 tuổi, người dẫn đường đầu tiên), A2 Ngưỡng cửa (chạm Luyện Khí: gia đình hay cơ duyên), A3 Nền móng (Trúc Cơ: lần đầu giết hay tha). Có **1 vòng quay** (A3) và **ít nhất 2 hậu quả trễ** (ví dụ người được tha quay lại sau 3 đến 10 năm). Chuỗi Nhẫn chuyển sau (Q5).
  - *Dữ liệu tuyến* (`js/data/stories/*.js`, đăng ký vào `D.STORY.arcs`), thuần dữ liệu để Haiku viết được về sau:
    `{ id, n, loai: 'bb'|'tp'|'tg', mo: { realm?, age?, flag? }, vai: { khe: { pick: 'gan'|'su'|'dong_ky', dung_moi: true } }, dau: 'c1', chang: { c1: { t, d, khi: { realm?, age?, sau? }, han (tháng), mac (key mặc định), lc: [ { key, label, kind, ax, gate?, gia?, fx, toi: 'c2'|'ket:x', tre?: [ { sau: [min,max] tháng, fx, log } ], wheel? } ] } }, ket: { x: { t, kv, log } } }`
    `wheel: { vung: [ { w, n, fx, toi } ] (2 đến 4, tổng 100, thấp → cao), yeu_to: { loai: 'nature'|'rel'|'stat', truc|vai|chi_so, tran: 15 }, gia: 2..5 }`
    Hiệu ứng cho phép (`fx`): gold, xp (theo tỉ lệ cảnh giới), hp, daoTam, nghiep, rep (chinh/danh), rel (vai, Δ), flag, kv, ax. Không hàm tùy ý.
  - *Bộ máy* `TT.story` (`js/systems/story.js`): `c.story = { arcs: { id: { st, since, han, vai, log } }, due: [ { m, arc, fx, log } ], done: [] }` khởi tạo muộn; mỗi tháng (chỉ người chơi) mở tuyến đủ điều kiện, đưa chặng tới hạn vào hộp, chặng quá hạn tự đi theo `mac` (ghi "bỏ lỡ"), chín hậu quả trễ. **Tối đa 1 hộp truyện mỗi tháng**, giữ nhịp ≤ 6 hộp/phút. Nhân quả tạm dùng `c.nghiep`, `c.rep`.
  - *Tính cách trong chặng truyện*: chặng truyện mới có **khóa mềm** (`gate`, hiện lý do) và **phí trái tính** (`gia`, Q 6.5); khóa tuyệt đối chỉ ở đầu cực. Mặc định Tự động chọn theo `affinity`.
  - *Vai*: ưu tiên NPC có sẵn ở gần (theo điều kiện `pick`), chỉ dựng NPC mới khi không có.
  - *Vòng quay* `TT.wheel` (`js/systems/wheel.js`): số = clamp(rng 0..100 + điểm yếu tố, 0, 100); đúng một yếu tố, điểm trong [−10, +15]; quay lại tối đa 1 lần, tốn `gia` điểm khí vận qua `TT.kv.spend`, không ở vùng cao nhất, không khi thiếu điểm; tự quay lại **tắt** mọi chế độ; vùng cao nhất không quay lại thì +1 khí vận. Trạng thái lưu thuần dữ liệu trong `w.pending` (`type: 'story'`/`'wheel'`), lưu/tải giữa chừng được.
  - *Giao diện*: dùng lại hộp quyết định (nhãn "Truyện"); hộp vòng quay SVG xoay khoảng 1,5 giây (chế độ giảm hiệu ứng hiện ngay), dòng "Yếu tố: … (+N vì …)", số khí vận, nút Quay/Quay lại kèm giá; ở x8/x16 thời gian dừng khi có hộp. Tab Nhiệm vụ thêm mục **"Truyện của đời bạn"** (tuyến đang đi, chặng đã qua, hậu quả đang chờ ghi mơ hồ "có điều gì đó đang tới").
  - *Công cụ*: `tools/story-lint.js` (chặng trỏ đúng, tổng vùng = 100, 2 đến 4 vùng, một yếu tố, fx chỉ dùng khóa cho phép, gate có lý do); lệnh console `TT.story.jump(arcId, changId)`; **`tools/life-sim.js`** (Playwright như baseline: chạy một đời với hạt giống cho trước ở chế độ Tự động, in nhật ký người chơi + Truyện của đời bạn + tuổi thơ + tính cách đầu/cuối + khí vận kiếm/tiêu, ra tệp văn bản `tools/life-sim/<seed>.txt`).
  - *Công tắc*: `D.STORY.on`; tắt thì `--check` trùng khít. Bật thì đo 40 hạt giống và nhịp quyết định.
  **8B đã làm (2026-10-20):** `js/systems/story.js` (`TT.story`: `tick`, `choose`, `jump`, `rows`, `sig`, `pendingDue`, `check`, `lint`, `go`, `applyFx`), `js/systems/wheel.js` (`TT.wheel`: `zoneAt`, `factor`, `canReroll`, `make`, `begin`, `spin`, `resolve`, `act`), `js/data/story.js` (`D.STORY`: cấu hình, `reg`), `js/data/stories/bb_a.js` (tuyến A1 Mầm xanh, A2 Ngưỡng cửa, A3 Nền móng: 6 chặng, 16 lựa chọn, 4 hậu quả trễ, 1 vòng quay ở A3 chặng c2), `js/ui/story.js` (vòng quay SVG, mục "Truyện của đời bạn"), `tools/story-lint.js`, `tools/life-sim.js`, handler `story` và `wheel` trong `decisions.js`, móc `TT.story.tick(c)` ở `life.stepChar` (chỉ người chơi, ngay trước `events.monthly`), cờ `--story=off` ở `tools/baseline.js`.
  - *Bộ máy*: `c.story = { arcs: { id: { st, since, ready, w, vai, log, ket } }, due: [ { m, arc, fx, log } ], done, box }` khởi tạo muộn, không đổi `TT.VERSION`. Mở tuyến theo `mo` (`age`, `realm` là mức tối thiểu, `flag`, `sau` là tuyến trước đã có kết cục); chặng tới hạn khi `khi.realm`, `khi.age` đủ và qua `khi.sau` tháng; hộp chặng là `w.pending { type: 'story' }` (tầng 2, đếm ngược 25 giây ở Cân bằng, dừng ở Thủ công, máy chọn ở Tự động theo độ hợp tính cách); **tối đa 1 hộp truyện mỗi tháng, cách nhau ít nhất `D.STORY.gap` = 2 tháng**; chặng quá `han` tháng kể từ lúc sẵn sàng thì tự đi theo `mac` (log "lỡ mất dịp", ghi "(bỏ lỡ)"); `mac` không được có `gate`. Hậu quả trễ `tre` đặt hạn bằng `rng.RI(sau[0], sau[1])` lúc chọn, chín trong `tick`, không cần hộp.
  - *Lựa chọn*: `gate { truc, min?, max?, why }` khóa mềm (vẫn hiện, ghi lý do), `gia { gold|hp|daoTam|kv }` (thiếu thì khóa, đủ thì trừ khi chọn), **khóa theo khoảng cách tính cách** (cập nhật sau 8B: điểm trục ngược chiều với hướng `lc.ax`; từ `traiAt` = 4 điểm là trái tính, mất `trai.daoTam` = 1 đạo tâm, hộp ghi trước; từ `khoaAt` = 7 điểm (đầu cực, theo Q 6.5) thì không chọn được, hiện lý do "Quá trái bản tính (Đạo đức −7, …)"; hai ngưỡng chỉnh ở `D.STORY`; lựa chọn `mac` không bao giờ bị khóa kiểu này để luôn còn đường đi; bài kiểm thử thêm, chạy 11 bài 8B đạt), chấm "hợp tính" (độ hợp ≥ 1,1), `ax` dịch trục qua `TT.nature.shift(..., true)` (trần biến cố lớn ±6/năm). Hộp chặng không có `kind` ở lựa chọn đã đóng gói nên `decisions.resolve` không dịch trục lần hai. Vai (`vai`): NPC có sẵn ở gần theo `pick` (`gan` cùng nơi, thiện cảm cao; `su` từ 25 tuổi, cảnh giới cao; `dong_ky` lệch tuổi ≤ 8), chỉ dựng NPC mới (`TT.life.spawnNpc`) khi không có và `dung_moi`; chết thì chọn lại lúc tới chặng; khe `{khe}` và `{ten}` trong chữ.
  - *Vòng quay*: số = clamp(`rng.RI(0, 100)` + điểm yếu tố, 0, 100); yếu tố `nature` (1,5 điểm mỗi bậc theo `huong`), `rel` (thiện cảm × 0,15, hoặc × 0,10 khi âm), `stat` (`realm` ×3, `daoTam` (đạo tâm − 50) × 0,3, `kv` ×3), kẹp trong [−10, min(`tran`, 15)]; hộp hai giai đoạn `st: 'wait'` (Quay) rồi `'done'` (Nhận kết quả hoặc Quay lại), thuần dữ liệu, lưu/tải được ở cả hai; quay lại tối đa 1 lần, tốn `gia` điểm khí vận (`TT.kv.spend`), khóa ở vùng cao nhất và khi thiếu điểm (kèm lý do), số mới thay hẳn số cũ; **không bao giờ tự quay lại** (mọi chế độ); vùng cao nhất mà chưa quay lại thì +1 khí vận. Ở Tự động vòng quay tự quay và tự nhận; ở Cân bằng hết giờ thì quay rồi nhận. Giao diện: vòng SVG chia vùng (đỏ → xanh), kim xoay 1,5 giây (`tt_reduce` = 1 trong localStorage hoặc `prefers-reduced-motion` thì hiện ngay), chú thích vùng, dòng "Yếu tố: … (+N điểm)", số khí vận, giá quay lại. Chặng có vòng quay: chọn hướng trước (`lc.fx` và `ax` áp ngay), kết quả theo vùng (`toi` ở từng vùng).
  - *Tuyến mẫu*: A1 (c1 người dẫn đường, c2 đêm nản lòng, 3 kết cục, kv 0), A2 (mở ở Luyện Khí; c1 hai ngả, c2 cái giá, 2 kết cục, kv 0; gate đạo đức ≤ 8, gia 30 vàng, 2 hậu quả trễ: mùa gặt 48-96 tháng, thư quê 36-84 tháng), A3 (mở ở Trúc Cơ; c1 kẻ xin tha: gate đạo đức ≥ −6 để tha, ≤ 6 để ra tay, 2 hậu quả trễ: người được tha trả ơn 36-120 tháng, thân nhân đòi nợ 24-96 tháng; c2 tâm ma: vòng quay 25/45/30, yếu tố Tu dưỡng, quay lại tốn 3; 4 kết cục, kv +1 cho "qua được" và "tâm sáng", cộng một lần mỗi tuyến theo Q 5.3 mốc 3). Tuyến mở cho mọi người chơi (xương sống và xuất thân chờ 9A).
  - *Công cụ*: `node tools/story-lint.js` (sạch: 3 tuyến, 6 chặng; kiểm chặng trỏ đúng và tới được, 2 đến 4 lựa chọn, `mac` không khóa, gate có lý do, `fx`, `gia`, `tre`, vòng quay (tổng 100, 2 đến 4 vùng, một yếu tố, `tran` ≤ 15, giá 1..5), kết cục, khe `{khe}` có trong `vai`); `TT.story.jump(arcId, changId)` (console; từ chối khi đang có hộp); `node tools/life-sim.js --seed=101 [--years=80] [--dao=tu_luyen|auto] [--nhay=bb_a3:c1]` ra `tools/life-sim/101.txt` (mặc định ép đạo tu luyện vì Tự động thuần hay chọn đạo giao du/kiếm sống rồi không tới Luyện Khí); `--batch=101-140` đo bật/tắt truyện. `.gitignore` chỉ giữ 3 tệp mẫu `tools/life-sim/101.txt` (nhảy tới A3 để thấy vòng quay), `102.txt`, `103.txt` (đời tự nhiên: A1 rồi A2).
  - *Công tắc*: `D.STORY.on = false` thì `node tools/baseline.js --check --story=off` trùng khít 40/40; bật cũng trùng khít (baseline không bước người chơi): chiến tranh 48,0, diệt vong 7,2, đổi chủ 9,5.
  - *Nhịp quyết định*: bài "Nhịp quyết định" (12 hạt giống 500-511) từ 4,97 lên 6,28 hộp/phút khi bật truyện (44 hộp truyện trong 869 năm). Chỉnh: thêm `D.STORY.evMul` = 0,85 nhân vào xác suất sự kiện lẻ của người chơi (`events.rate`, chỉ khi bật truyện) để hộp truyện chiếm một phần nhịp: còn **5,83** (< 6). Đo 40 hạt giống 101-140, tối đa 60 năm mỗi đời, chế độ Cân bằng chọn mặc định: tắt 4,96 → bật 5,34 hộp/phút. Thế giới (60 năm có người chơi): tắt chiến tranh 9,88, diệt vong 1,63, đổi chủ 1,68; bật 7,42, 1,52, 0,82. Độ nhiễu cỡ ±0,4 đến ±1 (đối chứng: chỉ đốt một số rng thì 9,53, 1,60, 1,33), và trên 80 hạt giống khác (201-280) bật lại cao hơn (tắt 10,26, đốt 10,58, bật 11,23), nên không có xu hướng thật; chênh lệch ở 101-140 là nhiễu. Cảnh giới cuối trung bình 0,42 → 0,57, mỗi người chơi trung bình mở 1,57 tuyến, xong 1,57.
  - *Kiểm thử*: 10 bài "Truyện và vòng quay (8B)" (lint sạch và bắt được dữ liệu hỏng, mở tuyến đúng điều kiện và tối đa một hộp mỗi tháng, hạn tự tiến theo `mac`, gate/gia/trái tính/`ax`, hậu quả trễ chín đúng khoảng, vai NPC có sẵn và dựng mới khi hết người, vòng quay (tổng 100, một yếu tố, điểm [−10, +15], hàm đọc không gọi rng), quay lại (một lần, trừ khí vận đúng giá, chặn vùng cao nhất và thiếu điểm, +1 vùng cao nhất, kẹp 0..100, không tự quay lại), Tự động đi trọn một tuyến và `jump`, lưu/tải giữa chặng và giữa vòng quay, công tắc và NPC không có truyện). Chạy đầy đủ 137 bài, 0 lỗi. Hai bài cũ vẫn đạt không phải sửa. Giao diện bằng Playwright (máy tính 1280 và điện thoại 390): hộp chặng (nhãn Truyện, chấm hợp/trái tính, khóa có lý do, ★ mặc định, đếm ngược), thời gian dừng ở x16 khi có hộp, hộp vòng quay (chờ quay, đã quay, kim xoay, chú thích vùng, nút quay lại khóa khi ở vùng cao nhất), giảm hiệu ứng, mục "Truyện của đời bạn" và dòng "Có điều gì đó đang tới..." ở tab Nhiệm vụ; không lỗi console.
  - *Còn lại / lưu ý*: nút Quay lại bấm được chưa kiểm bằng Playwright (kiểm bằng bài kiểm thử); A4 đến A6 và tuyến thân phận/thế giới chờ 9A+; trong đời mô phỏng 80 năm hầu hết người chơi chưa tới Trúc Cơ nên A3 hiếm gặp tự nhiên (cần `--nhay`); `evMul` giảm khoảng 15% sự kiện lẻ của người chơi khi bật truyện.
  **Câu hỏi chờ cho 8C (hỏi lại sau khi 8B xong; mặc định đề xuất):** (1) đợt đầu khoảng 36 tiên thiên (20 cũ xếp vào 6 ô + khoảng 16 mới, 3 đến 4 phẩm Thiên có giá; tiên thiên riêng của xương sống B đến E hoãn); (2) mỗi tiên thiên có hiệu chỉnh số, thẻ, ẩn và thức tỉnh (12 tuổi, đột phá, `wake` của tuổi thơ), dấu hiệu khi ẩn; cơ chế riêng phức tạp (Trùng đồng bị săn, đào, móc, cấy) hoãn cùng T13, T14; Quý +25 đến 35% tu luyện; (3) tỉ lệ 5/15/30/50 có giảm một nửa, chỉ cho người chơi, đo bằng `life-sim`; (4) trang thử nghiệm `?dev=1` trong hộp Đời mới (chọn tiên thiên, tính cách, khí vận, hạt giống, nhảy chặng, tua 10 năm); truyền thừa cho con chỉ ghi dữ liệu, áp ở 9C.
- [ ] **8C** (Haiku dữ liệu, rồi Sonnet cơ chế) Q1.1 tiên thiên v2, chỉ cho người chơi; trang thử nghiệm.
- [x] **8D** (Sonnet) R1 lõi: bốn thanh (Tình, Tin, Kính, Ơn oán) và loại quan hệ cho cặp thân thiết của người chơi; chuyển bản lưu cũ. (đã gộp vào 9B, xem mục Đợt 9)
- **Cổng chơi thử 6:** đọc 3 bản `life-sim` + chơi 15 phút: tính cách đổi theo lựa chọn, vòng quay, tuyến mẫu, tiên thiên mới.

### Đợt 9. Một đời đầy đủ (gọn lại 2026-10-19)
- [x] **8B2** (Sonnet, nhỏ) **Sửa lõi sau khi đọc life-sim** (chốt 2026-10-20, lượt 6):
  - *Hạ cảnh giới nội dung*: tiến độ cảnh giới chậm là **cố ý** (không đổi). Thêm điều kiện `stage` (sơ/trung/hậu kỳ, `D.STAGE_NAMES`) cho `mo` và `khi` của tuyến; **60 đến 70% nội dung từng dự tính "từ Trúc Cơ" hạ xuống "Luyện Khí trung kỳ"**; 30 đến 40% còn lại (T13, T14 đã chốt từ Trúc Cơ, A4 trở lên, chuyện rất lớn) giữ. Áp ngay cho A3 (Luyện Khí trung kỳ) và cho mọi dữ liệu tuyến viết sau này (ghi vào hướng dẫn viết tuyến).
  - *Mốc xương sống theo giai đoạn đời*: mốc mở khi tới cảnh giới **hoặc** tới tuổi, cái nào trước (A2 Luyện Khí hoặc 18; A3 Luyện Khí trung kỳ hoặc 35; A4 Trúc Cơ hoặc 55; A5 tuổi 75; A6 khi thọ còn 10%); chặng có chữ khác nhau cho phàm nhân và tu sĩ khi cần (trường `d_pham`).
  - *Chống trôi tính cách*: quán tính dải cực 0,3 (thay 0,6); dịch trục của sự kiện thường ngày nhân 0,5; chế độ Tự động chọn **ngẫu nhiên theo trọng số độ hợp tính** (không luôn lấy lựa chọn hợp nhất), bốc bằng `rng` như cách chọn mặc định cũ.
  - *Lọc nhật ký*: gom dòng tổng kết năm "+0" và tin đồn lặp (cùng loại, cùng nơi trong 3 năm) thành một dòng cuối năm.
  - *Đo*: 3 tệp life-sim mới (101, 102, 103) không còn đời nào cuối đều cực một trục; mỗi đời có A1 đến A3 trong 40 năm đầu.
  **8B2 đã làm (2026-10-20):**
  - *Điều kiện*: `TT.stats.stage(c)` (0 sơ, 1 trung, 2 hậu kỳ; phàm nhân 0, cảnh giới cuối 2; `realmName` dùng lại). `mo` và `khi` nhận `stage` (đi kèm `realm`, chỉ tính khi đúng cảnh giới đó; cảnh giới cao hơn là đủ), `age` (tuổi, giữ tên cũ thay cho `tuoi`) và `hoac: [ điều kiện, ... ]` (từ 2 nhánh, một nhánh đủ là mở). `story-lint` kiểm các khóa, `stage` 0 đến 2, `hoac` ≥ 2 nhánh không rỗng, `d_pham`. Chặng có `d_pham` (chữ thay `d` khi còn phàm nhân). Hướng dẫn viết tuyến (60 đến 70% hạ xuống Luyện Khí trung kỳ, mốc xương sống "cảnh giới HOẶC tuổi") nằm ở chú thích đầu `js/data/story.js`.
  - *bb_a*: A2 mở khi Luyện Khí hoặc 18 tuổi; A3 mở khi Luyện Khí trung kỳ hoặc 35 tuổi (bỏ `khi.realm: 2` của A3/c1); `d_pham` cho A2/c1 và A3/c1; bỏ chữ "Trúc Cơ" trong chữ A3.
  - *Chống trôi* (`D.NATURE`): `extremeMul` 0,6 → **0,3**; `dailyMul` = 0,5 (nhân ở `TT.nature.shiftKind`, chỉ dùng cho sự kiện thường ngày và hộp quyết định khác; chặng truyện và tuổi thơ gọi `shift` trực tiếp nên không bị nhân); `autoRandom` = true: `chooseIndex` của người chơi ở Tự động/Cân bằng bốc ngẫu nhiên theo trọng số (kind, `ai`, độ hợp) bằng `rng`, Thủ công vẫn lấy lựa chọn hợp nhất, quy tắc nếu-thì vẫn đè. Hộp chặng truyện (`TT.story.build`) vẫn chọn mặc định là lựa chọn hợp nhất (chưa đổi, ngoài phạm vi 8B2).
  - *Lọc nhật ký* (`D.STORY.logGom = { on, rumorMonths: 36 }`): năm trống ("… +0") không ghi từng dòng mà dồn lại, ghi một dòng "Tuổi a đến b: n năm trôi qua yên ả" khi chuỗi kết thúc; tin đồn lặp (cùng loại, cùng nơi trong 36 tháng) không ghi riêng mà gộp vào dòng tổng kết năm: "nghe lại N tin đồn cũ (tên)". Bản tin thế giới (`TT.news`) vẫn đủ. Trường lười `c.qYear`, `c.qRumor`, `p.rumorSeen`, không đổi `TT.VERSION`. `life-sim` thêm `--gom=off` để so sánh.
  - *Kiểm thử*: bài mới "Sửa lõi (8B2)" (4 bài: hoặc-tuổi/stage/d_pham/lint, quán tính 0,3 và nhân 0,5, Tự động và Cân bằng bốc 500 lần không luôn chọn hợp nhất, Thủ công vẫn xác định, quy tắc đè, lọc nhật ký). **Sửa 3 bài 8A cũ chỉ vì hệ số/đường đi đổi**: (1) "dịch có quán tính" đọc `D.NATURE.extremeMul` thay vì 0,6; (2) "affinity và chooseIndex" kiểm phần xác định ở chế độ Thủ công; (3) "khí vận nguồn cộng" bỏ qua nguồn "truyện …" và "vòng quay vùng cao nhất" (A2, A3 nay xảy ra trong 80 năm). 8B cũ đạt không sửa.
  - *Nhịp quyết định*: A2, A3 xảy ra ở mọi đời nên số hộp truyện từ 44 lên 90 trong cùng 12 đời (6,3 hộp/phút, vượt 6). Đã hạ `D.STORY.evMul` 0,85 → **0,3** (đòn bẩy yếu: nhiều hộp không đến từ `events.rate`): còn 5,26. Hệ quả: sự kiện lẻ của người chơi thưa đi khoảng 65% so với trước 8B, cần người chơi thử xem có quá vắng không.
  - *Đo life-sim* (80 năm, Tự động, đạo tu luyện; cùng hạt giống, tắt/bật gom): 101 **432 → 431**, 102 **532 → 531**, 103 **415 → 415** dòng nhật ký (bản 8B cũ: 401, 324, 463; không so được vì đời đã khác). Gom chỉ bớt 0 đến 1 dòng mỗi đời vì năm "+0" hiếm (1 đến 3 mỗi đời) và tin đồn lặp hiếm; phần nhiều nhật ký là "Tuổi N: tu vi +N" (30 đến 40), "Bị thương ở …" (13 đến 30), "Rong ruổi tìm kiếm" (8 đến 24), "Thiên Cơ Báo số N" (20), "Bạn mua Linh thảo" (20 đến 95), "Quy tắc nếu-thì" (9 đến 12). **Chưa đạt "giảm rõ"**: muốn giảm thật phải gom các loại ấy (việc 8B3 nếu bạn muốn). A1 đến A3 đều xảy ra ở 12 đến 13, 18 và 35 tuổi cả ba đời. Tính cách cuối đời (số ≥ 7 là dải cực): 101 Tính tình −4, Xử thế +4,8, Đạo đức +9,2, Tu dưỡng +4,9 (1 trục cực); 102 +7, +6,2, +6,2, +8,6 (2 trục cực); 103 +7,9, +5, +8,8, +9,4 (3 trục cực). Không đời nào đủ bốn trục cực, nhưng 103 vẫn trôi mạnh vì tuổi thơ đã đẩy sẵn (+8 sau tuổi thơ).
  - *Chạy đầy đủ*: 142 bài, 0 lỗi (4 bài mới, 138 cũ gồm 3 bài 8A đã sửa).
  - *Cân bằng*: `node tools/baseline.js --check` trùng khít 40/40; `node tools/story-lint.js` sạch (3 tuyến, 6 chặng).
- [x] **9A-d** (Haiku, chỉ dữ liệu) **đã làm (2026-10-20):**
  - `js/data/origins2.js` (`D.ORIGINS2`, `D.ORIGINS2_BY_ID`): 8 xuất thân p1 28, p2 13, p3 13, p5 12, t1 12, t3 8, t6 8, t10 6 (tổng 100) với `start`, `gom`, `cha_me`, `ax`, `bi_mat` (t1, t10), `place_types`; thêm vào `js/files.js` sau `childhood.js`. Chưa có hệ nào đọc (việc của 9A).
  - `js/data/childhood.js`: thêm 24 sự kiện có `origin: [id]` (3 mỗi xuất thân; p5, t3, t10 đủ ba hồi), không dùng `tuchat`/`kv` nên không đụng trần chung. **Lưu ý cho 9A: `TT.childhood` chưa lọc theo `origin`** (`js/systems/childhood.js` dòng bốc `cand`), nên đến khi 9A thêm bộ lọc, người chơi vẫn bốc được cả sự kiện riêng của xuất thân khác; 9A phải lọc: sự kiện không có `origin` là chung, có `origin` thì chỉ bốc khi trùng xuất thân của nhân vật.
  - `js/data/stories/bb_a.js`: thêm `bb_a4` Vị thế (Trúc Cơ hoặc 55 tuổi; chọn phe / đứng ngoài / lợi dụng, 2 chặng), `bb_a5` Đạo quả (tuổi 75 hoặc Kim Đan; thu đồ / lập nghiệp / độc hành, đồng kỳ trở lại, 2 chặng), `bb_a6` Thiên môn (Hóa Thần hoặc 117 tuổi; vòng quay 4 vùng đọa ma / ẩn thế / tọa hóa / phi thăng, 2 chặng, thêm kết "tọa hóa giữ bí mật"). Có `d_pham`, hậu quả trễ ở A4, A5, A6, kết cục kv: A4 0, A5 1/1/0, A6 0/1/2/1/2.
  - **Hai chỗ lệch so với yêu cầu, vì khung chưa hỗ trợ (không sửa `js/systems`):** (1) điều kiện "thọ còn 10%" của A6 chưa có khóa; tạm dùng `age: 117` (10% thọ Luyện Khí, nhân vật Trúc Cơ trở lên sẽ gặp A6 sớm hơn lúc thọ còn nhiều, chữ A6 đã viết trung tính); (2) yếu tố vòng quay `stat` chỉ nhận `realm`, `daoTam`, `kv` (không có `nghiep`, `rep`), nên A6 dùng `nature` trục `daoduc` làm yếu tố nhân quả, còn nghiệp thể hiện ở hiệu ứng vùng "Đọa ma" (+6 nghiệp). 9A có thể thêm `nghiep` vào `D.STORY.stats` và `wheel.factor`.
  - Kiểm: `story-lint` sạch (6 tuyến, 12 chặng); hai bài mới "Dữ liệu xuất thân (9A-d)"; chạy đầy đủ 144 bài, 0 lỗi; `baseline --check` trùng khít 40/40.
- [x] **9A** 8 xuất thân đầu (17 sau) + sự kiện tuổi thơ theo xuất thân (thêm vào khung 8A2/8A3) + xương sống A mốc A4 đến A6. **9A đã làm (2026-10-20):**
  - `js/systems/origin.js` (`TT.origin`, nạp sau `childhood.js`): `roll(seed, id, salt)` bốc xuất thân theo trọng số bằng băm (muối = `rng.getState()` lúc sinh, chỉ đọc nên Bốc lại ra xuất thân khác); `placeFor` chọn nơi sinh theo `place_types` (băm; vùng không có loại nào hợp thì giữ nơi cũ); `apply` (gold đặt thẳng thay vàng xuất thân cũ; `luck`, `atk`, `nl`, `daoTam` cộng thêm, `luck` cũ của regions.js bị trừ; `items` mỗi món 1; `ax` cộng vào bốn trục kẹp ±10; `bi_mat` ghi `c.flags.biMat = id`); `spawnParents`; đọc thuần `get`, `burden`, `secret`, `parents`, `parentsText`. Công tắc `D.ORIGINS2.on` (mặc định bật).
  - `createChar` (người chơi): mọi lần rút rng cũ giữ nguyên (xuất thân cũ và nơi sinh cũ vẫn bốc rồi bị đè bằng băm), nên tắt công tắc là trùng khít. `c.origin2` = id, `c.origin` = tên hiển thị (nhật ký: "sinh ra trong hoàn cảnh «…»"). NPC giữ xuất thân cũ.
  - **Cha mẹ thật** (`life.reincarnate`, đặt SAU mọi lần rút cũ, ngay trước `emit('reincarnate')`): khi `cha_me.co`, 80% có cả cha lẫn mẹ, 20% chỉ một (băm); NPC lõi tuổi 30 đến 50, cùng nơi sinh, cha cùng họ, `realm` 1 khi `tu` (t6 thì 2), vàng theo xuất thân; quan hệ `huyet` thiện cảm 60 đến 85 với người chơi (`p.parents`, `parent.children`), hai người là `dao_lu` của nhau; sống tiếp, già đi và chết như NPC lõi khác. Cô nhi (p5) không có cha mẹ. Việc dựng rút rng nên **đường cơ sở 40 hạt giống đổi (xem số đo)**.
  - Tuổi thơ (`js/systems/childhood.js`): sự kiện có `origin` chỉ bốc khi trùng `c.origin2` (sửa lỗ hổng 9A-d: trước đó ai cũng bốc được), trọng số ×2; không có `origin2` (bản cũ, công tắc tắt) thì không bốc sự kiện riêng; cha mẹ không bị chọn làm "bạn thuở nhỏ".
  - Giao diện: hộp Đời mới hiện xuất thân (2 câu), cha mẹ, gánh nặng và "nhà bạn đang giấu điều gì đó" nếu có bí mật; Bốc lại đổi cả xuất thân và cha mẹ (chạy lại `reincarnate`). Hồ sơ Tổng quan có mục "Xuất thân · tên": mô tả, cha mẹ (tên, còn sống / đã mất), gánh nặng, bí mật "?" (chưa lộ). `tools/life-sim.js` in thêm dòng "Cha mẹ lúc sinh".
  - Kiểm thử: 9 bài mới "Xuất thân (9A)" (tỉ lệ bốc 2.000 lần, start áp đúng cả 8 xuất thân so với cùng hạt giống tắt công tắc, cô nhi, cha mẹ huyết thống và tuổi, cha mẹ sống tiếp, đọc không rng/không ghi, tuổi thơ theo xuất thân và trọng số ×2, A4 đến A6 mở theo cảnh giới/tuổi và `story.jump` ra hộp với cả 8 xuất thân, lưu/tải và bản cũ, công tắc tắt, đầu thai). Sửa 3 bài cũ chỉ vì người chơi nay có đồ khởi đầu hoặc rng đổi: `mkChar` và `freshPlayer` đặt `inv = {}`; bài 8B lưu/tải kết cục cộng khí vận kiểm lần cộng thứ hai thay vì lần đầu (lần đầu phụ thuộc số quay).
  - **Đo 40 hạt giống bật/tắt** (300 năm): hạt 101..140 (đường cơ sở): bật chiến tranh 61,6, diệt vong 9,1, đổi chủ 14,4; tắt 48,0, 7,2, 9,5. Hạt 141..180: bật 55,3, 8,3; tắt 67,4, 10,7. Hai bộ lệch ngược chiều nên là nhiễu rng (cha mẹ chỉ dịch dòng rng, không đổi luật); gộp 80 hạt: bật 58,5 chiến tranh và 8,7 diệt vong, tắt 57,7 và 8,95, đều trong chỉ tiêu 52 và 10 ±25%. **`seeds.json` đã lưu lại sau 9A** (bật); bản trước 9A giữ ở `tools/baseline/seeds-truoc-9A.json`. Chứng minh tắt trùng khít: `node tools/baseline.js --check --origins=off --base=seeds-truoc-9A.json` → 40/40 trùng khít; `--check` thường (bật) → 40/40 trùng bản mới.
  - **life-sim 101-103** (Tự động, tu luyện, 80 năm; dòng nhật ký 407, 403, 429; bản 8B2: 431, 531, 415, không so được vì đời đã khác): 101 Thợ thủ công (chỉ cha), 102 Nông hộ (cha mẹ), 103 Nông hộ (cha mẹ). A4 Vị thế xảy ra ở 55 tuổi cả ba đời; A5 ở 101 và 103 (xong), 102 mất ở 70 tuổi (phàm nhân) nên chưa tới A5.
  - Chạy đầy đủ: 153 bài, 0 lỗi (sau khi sửa 3 bài cũ ở trên). Chưa làm (không thuộc 9A): điều kiện "thọ còn 10%" của A6 và yếu tố vòng quay `nghiep` (đã ghi ở 9A-d); bí mật `biMat` chỉ ghi cờ, chưa lộ; chưa có tin về cha mẹ gửi tới người chơi (thư, Nhật báo); gia tộc, bổn phận, tương thích xương sống chưa làm (Q 8.2, 8.3).
  - Người chơi nên thử: hộp Đời mới (xuất thân, cha mẹ, gánh nặng, Bốc lại), hồ sơ, và để cha mẹ già đi vài chục năm xem tin báo.
- [x] **9B** R1 lõi (gộp 8D) + cơ chế đạo lữ (R2 phần cơ chế; chặng chữ viết ở 9B-d). **9B đã làm (2026-10-20):**
  - *Dữ liệu và hệ*: `js/data/bonds.js` (`D.BOND`: công tắc `on`, loại, giai đoạn, tương hợp, song tu, hôn ước, hệ số) và `js/systems/bond.js` (`TT.bond`). `world.rel[key].d = { t (loại), love, trust, respect, debt, st, since, p ('chinh'|'phu'), sy { y, n, m }, ref, low, nb, by, han, askM }` khởi tạo muộn **chỉ cho cặp có người chơi** (NPC với NPC giữ bản cũ). Cặp thân thiết: |thiện cảm| ≥ 40 hoặc có `rel.k`; tối đa 15 cặp có d (cặp có loại đặc biệt không bị chặn). Bản lưu cũ chuyển **một lần** ở `TT.bond.tick` mỗi tháng: `rel.love` → `d.love`, `rel.k` → `d.t` (dao_lu, ket_nghia, su_do, huyet, thu; không k thì `ban`; `rel.nl` thì `cu`), Tin/Kính suy từ thiện cảm, Oán từ kẻ thù; không đổi `TT.VERSION`. `rel.k` vẫn giữ đồng bộ cho mã cũ (loại mới thuong, hon_uoc, an, cu không có `k`).
  - *API* (`TT.bond`): đọc thuần (không rng, không ghi): `get, bars (virtual khi chưa có d), than, type, label, stage, cond, find, partners, main, compat, compatLabel, willing, grief, dualCount, dualFull, loveRec, holds, owns`; ghi: `ensure, shift ({love,trust,respect,debt}), setType, advance (giai đoạn; bước to/hon/ket cần người kia đồng ý, NPC có thể từ chối), breakup, grieve, promote, betroth, dual, tick (tháng), yearly (năm), addLoveRec`. Các chỗ cũ đọc/ghi `rel.love` đi qua `loveRec`/`addLoveRec` (social, cultivation, famevents); công tắc tắt thì đúng cách cũ.
  - *Đạo lữ*: giai đoạn `gap, men, to, hon, ket, ben, thu (thử thách), ran, biet`; Tình ≥ 25 thì mến; tỏ tình qua hộp "Duyên tình" cũ (NPC tỏ tình thì gật đầu là xong, mình ngỏ thì NPC bốc xác suất `willing` từ Tình, Tin, tương hợp, chênh cảnh giới, số lần từ chối; từ chối ba lần hoặc Tình < 10 thì thành Người cũ); sau tỏ tình 2 tháng tới hộp **lễ kết đạo lữ** (giản dị / tông chứng / tiệc 100 vàng / đợi 12 tháng); 1 chính + tối đa 2 phụ (`d.p`; chính mất hoặc chia tay thì phụ nhiều Tình nhất lên); bỏ giới hạn chênh lệch tuổi 30 cho cặp của người chơi (NPC với NPC giữ); song tu 1 đến 2 buổi mỗi năm, thưởng 100%/60%/20% nhân hệ số tương hợp và Tình, **từ buổi 3 không thụ thai**, hai bên cùng song tu một tháng chỉ đếm một lần, AI bỏ song tu khi đủ 2 buổi, NPC Tình < 35 có 40% từ chối; tương hợp từ bốn trục tính cách (khoảng cách; nóng-nóng dễ cháy, đạo đức gần nhau hợp mạnh), ngũ hành tư chất (sinh/khắc), đạo đang theo, chính tà, hiện chữ Rất hợp / Hợp / Bình thường / Trái tính; **nỗi buồn tuổi thọ** khi chênh ≥ 2 cảnh giới (nhật ký một lần, đạo tâm và Tình giảm nhẹ mỗi 5 năm); mỗi năm Tình/Tin trôi theo ở gần/xa; Tình hoặc Tin thấp liên tục 2 năm thì **rạn nứt** (hộp hòa / chia tay / đợi); NPC đạo lữ tự chủ có thể rời đi (xác suất theo Tình, Tin, tương hợp thấp, số đạo lữ); đạo lữ mất thì **vĩnh biệt** (đạo tâm −5, cờ `mat_dao_lu`); mỗi năm 12% đạo lữ chính ở bên nhau gặp **thử thách chung** (hoạn nạn, gia tộc phản đối, chênh đường; ở bên thì Tin/Tình tăng, né tránh thì giảm). **Hôn ước** chỉ do tông (khi vào tông) hoặc gia tộc (còn cha mẹ sống) ép người chơi chưa có đạo lữ, 0,8% mỗi năm từ 18 đến 45 tuổi, ba nhánh (nhận / từ chối khéo / bỏ trốn 50 vàng, có rủi ro); hạn 36 tháng; người kia tự tìm tới, Tình nảy 14 mỗi năm khi ở gần, Tình ≥ 40 thì tới hộp lễ; quá hạn tự hủy; có nút "Từ hôn".
  - *Truyện*: `fx.bond` và điều kiện `mo.bond`/`khi.bond`, `vai.pick` `'bond'` và `'tinh'`, `lc.toi_tu` (xem danh sách khóa dưới, và chú thích đầu `js/data/story.js`); `story-lint` kiểm đủ; tuyến mẫu `js/data/stories/dl_mau.js` (gặp → tỏ tình → kết; chỉ mở khi có cờ `dl_mau`).
  - *Giao diện*: `js/ui/bond.js`; tab Gia đình (đạo lữ chính trước, mục Hôn ước) và tab Quan hệ (người thân thiết, thẻ chi tiết) hiện nhãn loại + giai đoạn + tương hợp, ba thanh Tình (hồng), Tin (lam ngọc), Kính (vàng) (thanh nào không thuộc loại và dưới 10 thì ẩn) và chip Ơn/Oán. Chưa gộp tab.
  - **Khóa fx/điều kiện mới cho 9B-d viết dữ liệu:**
    - `fx.bond: { vai, love?, trust?, respect?, debt? (cộng dồn, ±100), type?, st? }`; `type` ∈ ban, ket_nghia, dao_lu, thuong, hon_uoc, su_do, huyet, an, thu, cu; `st` ∈ gap, men, to, hon, ket, ben, thu, ran, biet. Thứ tự áp: thanh, loại, giai đoạn. **`st` là to, hon hoặc ket có thể bị NPC từ chối**: lựa chọn đó bắt buộc có `toi_tu` (chặng hoặc `ket:x` khi bị từ chối); không dùng các bước này trong `tre` hay vùng vòng quay (lint chặn). `st` khác (men, ben, thu, ran, biet) áp thẳng, không lùi trên đường chính.
    - Điều kiện `mo.bond` và `khi.bond: { vai?, st?, type?, love?, trust?, respect?, debt? }`: `st` = đã đạt giai đoạn (đường chính gap, men, to, hon, ket, ben, thu tính từ giai đoạn đó trở lên; ran và biet khớp đúng); love/trust/respect = từ ngưỡng; `debt` dương = từ ngưỡng ơn, âm = từ ngưỡng oán; `type` khớp đúng. Ở `khi` bắt buộc có `vai` (theo người ở vai); ở `mo` chỉ cần có một NPC thỏa. Chưa hỗ trợ `bond` trong nhánh `hoac`. Công tắc tắt thì điều kiện bond không bao giờ đủ và `fx.bond` bị bỏ qua.
    - `vai: { khe: { pick: 'bond', bond?: {...}, } }` lấy người thân nhất thỏa (mặc định theo `mo.bond`, không dựng mới); `pick: 'tinh'` lấy người có thể nảy tình (đủ 18 tuổi, không ruột thịt, còn tự do, ưu tiên cùng nơi; `dung_moi` dựng NPC mới khi vắng).
    - `lc.toi_tu`: chỗ đến khi `fx.bond.st` bị từ chối.
    - Sự kiện có sẵn để gọi từ dữ liệu khác: `bond_ket` (lễ), `bond_hon_uoc`, `bond_ran`, `bond_thu_thach`. Cờ `mat_dao_lu` (đã từng mất đạo lữ) để tuyến T9 đọc.
  - *Kiểm thử*: 10 bài mới "Quan hệ và đạo lữ (9B)" (thanh/loại/nhãn và hàm đọc không rng; chuyển bản cũ một lần và trần số cặp; giai đoạn gặp đến vĩnh biệt, 1 chính + 2 phụ, phụ lên thay, chia tay; hộp Duyên tình và lễ; tương hợp đối xứng, nỗi buồn tuổi thọ; song tu giảm thưởng và không thụ thai từ buổi 3; đạo lữ NPC từ chối, rời, rạn nứt, hòa giải, thử thách; hôn ước ba nhánh, hết hạn, từ hôn; fx bond và điều kiện trong story với `dl_mau` cả hai nhánh nhận và từ chối, lint bắt lỗi; lưu/tải, bản lưu cũ, công tắc tắt). Sửa 2 bài cũ chỉ vì ý nghĩa đổi: bài "Đạo lữ" cũ chạy ở `D.BOND.on = false` (kiểm hành vi cũ), bài lint 8B dùng "có ít nhất 3 tuyến bb". Chạy đầy đủ: 163 bài, 0 lỗi; `story-lint` sạch (7 tuyến, 15 chặng).
  - *Cân bằng*: `node tools/baseline.js --check` (bật) và `--check --bond=off` đều **trùng khít 40/40** (baseline chỉ dựng thế giới và chạy thế lực, không đi tới `TT.bond`; thêm cờ `--bond=off` cho `baseline.js`). Dò 24 đời 60 năm (đạo giao du, Tự động): bật có 4 hộp hôn ước, 3 hộp lễ kết, 1 đạo lữ cuối đời, 3 người cũ (hôn ước hết hạn); tắt 0 đạo lữ; không lỗi. Vì Duyên tình cũ vốn hiếm (3 hộp tỏ tình trong 24 đời), chỉ tiêu "60% người chơi kết đạo lữ" (R 10.1) **chưa đạt, cần 9B-d (chặng viết thêm) và đo bằng story-sim**; `life-sim` 101 đến 103 chạy lại (320, 509, 383 dòng): 101 có một hôn ước ở 22 tuổi hết hạn lúc 25.
  - *Chỉnh sau phản hồi (ra đạo lữ khó)*: cặp có thể nảy tình ở cùng nơi được cộng Tình mỗi năm (`D.BOND.rom`: +7, +3 nếu hợp tính) và Tình nhận từ giao du nhân 1,6 (`D.BOND.loveMul`, chỉ cặp của người chơi). Dò 24 đời 60 năm: đạo giao du 21/24 có đạo lữ, đạo tu luyện (mặc định) 4/24; chỉ tiêu R 10.1 (60% chủ động, 35% Tự động) cần đo lại bằng story-sim khi có chặng 9B-d.
  - *Chưa làm / lưu ý*: kháng tâm ma và ngộ của song tu (chỉ có tu vi, đạo tâm, đạo điểm, Tình); xác suất con 10% → 1% theo cảnh giới (thuộc 9C, hiện giữ 1,8% mỗi buổi); lễ không cộng thiện cảm tông/gia tộc, Ơn của khách dự; không có tình đơn phương, tình địch, ghen theo giai đoạn; Quan hệ NPC với NPC giữ cũ; gộp tab Nhân duyên để sau; nút hành động (tặng quà, mời đi chơi, tỏ tình) và lệnh ưu tiên thấp chưa làm.
  - Người chơi nên thử: chọn Thủ công, giao du một NPC cùng nơi, xem hộp tỏ tình, hộp lễ, ba thanh ở tab Gia đình/Quan hệ; thử chờ vài năm xem nỗi buồn tuổi thọ và rạn nứt; tần suất hôn ước (khoảng 0,17 lần mỗi đời) có phiền không.
- [x] **9B-d** (Haiku) chặng chữ đạo lữ: `js/data/stories/dao_lu.js`, 4 tuyến (dl_gap, dl_hon, dl_ben, dl_tan), 12 chặng. **9B-d đã làm (2026-10-20):**
  - *Phủ hành trình*: gặp, mến, tỏ tình (vòng quay rel; NPC có thể từ chối đáp lời), hôn ước bị ép (nhận, khéo từ chối, bỏ trốn; NPC có thể từ chối đính ước hoặc lễ), lễ kết (giản dị, tông chứng, hoãn), ở bên (căn nhà, hai lối tu, kẻ thứ ba, chênh thọ với vòng quay nature), rạn nứt (hòa hoặc chia tay), tang (giữ di vật, dựng miếu, theo người mất).
  - *Nhịp mở*: 8 trên 12 chặng mở theo tháng hoặc tuổi, không cần cảnh giới; 4 chặng chuyện lớn mở từ Trúc Cơ hoặc đến tuổi (`hoac`) để không kẹt. Hôn ước mở với bất kỳ người nào đã đạt `to` (không nhất thiết người của tuyến gặp đầu).
  - *Khóa mềm theo tính cách*: 4 lựa chọn (tudung, xuthe, daoduc, tinh). Hậu quả trễ: 4.
  - *Kiểm*: `story-lint` sạch (11 tuyến, 27 chặng); `run-tests` lọc "đạo lữ" 13 đạt, "9B" 10 đạt, "Truyện" 11 đạt, 0 lỗi.
  - *Life-sim 101 đến 103*: 101 đi qua hôn ước, lễ kết và ở bên rồi chia lối; 102 tới rạn nứt và tang; 103 dừng ở chặng gặp đầu đời. Không lộ khe `{...}`.
  - *Sửa sau life-sim*: chặng đòi Tình ≥ 30 bị kẹt cả đời (đổi sang điều kiện tháng); chặng cảnh giới lớn kẹt nếu không đạt Trúc Cơ (thêm nhánh tuổi).
  - *Chưa làm*: chỉ tiêu R 10.1 (60% kết đạo lữ) **chưa đo** bằng `story-sim`; chưa chạy `baseline --check` vì dữ liệu tuyến không đổi cân bằng thế giới.
- [x] **9K** (Sonnet) Kết nghĩa qua trải nghiệm chung. **9K đã làm (2026-10-20):**
  - *Dữ liệu và hệ*: `D.BOND.mem` (công tắc) và `D.BOND.kn` (trần 8, loại ký ức, ngưỡng kết nghĩa, đồng hành, huynh đệ, tái ngộ) trong `js/data/bonds.js`; `js/systems/bondmem.js` mở rộng `TT.bond`; `js/data/memevents.js` (3 sự kiện). `d.mem = [{ m, a, k, t, w, h }]` ghi trong `world.rel[key].d`, khởi tạo muộn, không đổi `TT.VERSION`; lệnh rủ đi cùng `c.intents`, bạn đồng hành `c.dungeon.ally`.
  - *Ký ức*: `TT.bond.remember(c, o, loai, chu, nang)` (nặng nhân phần cộng Tin/Kính; chặn ghi trùng loại trong `gap` tháng; trần 8, đầy thì bỏ ký ức thường cũ nhất, chỉ khi toàn hoạn nạn mới bỏ hoạn nạn cũ nhất; chữ tự gắn tên nơi nếu thiếu), `shared` (tối đa n người cùng nơi), `mems, hardships, recall` (đọc thuần). 13 loại; hoạn nạn: danh, cuu, the_gioi, luy, mat. **Điểm móc đã gắn**: bí cảnh (`dungeon.enter/finish`, ký ức `bi_canh`; thoát hiểm thành hoạn nạn), đánh nhau (`assist` trong bí cảnh và `rel_ke_thu` Ra tay/Cầu cứu bạn), nhờ giúp (`rel_nho_giup`), nhiệm vụ (`quests.settle` người giao NPC), sự kiện thế giới (`memYearly`: hạn, lũ, dịch hoặc mặt trận ở vùng, tối đa 2 người ở gần, 15% mỗi năm), bạn thuở nhỏ (`childhood.apply`), nghe giảng, luận đạo, đấu giá (`opp_*`), cộng thêm lời thề, giữ lời thề, tái ngộ, mất.
  - *Đồng hành*: `TT.bond.ally(c)` bạn cùng nơi thiện cảm ≥ 40 (p 0,3 theo độ thân; huynh đệ 0,55; được rủ 0,85 và dùng hết lời hẹn); `pickAlly` ở `dungeon.enter`; `assist(c, res, a, foe)` ở mọi trận bí cảnh và kẻ thù tìm đến: trận thua lật thành thắng với xác suất 5 đến 10% (theo độ thân), khi c sắp chết thì bạn chết thay 25% (c còn 1 sinh lực), thắng thì bạn bị thương 15%; `endAlly`: chia 20% vàng và tu vi cho bạn, ghi ký ức. Nút **"Rủ đi cùng"** ở thẻ người (lệnh ưu tiên thấp, hạn 6 tháng, tối đa 2 lệnh, gộp lệnh trùng, hết hạn ghi "Chưa tìm được…", lúc rảnh tự đi tìm nếu cùng vùng).
  - *Kết nghĩa*: `rel_ket_nghia` chỉ ngỏ khi `canSwear` (≥ 3 ký ức chung, ≥ 1 hoạn nạn, thiện cảm ≥ 40, chưa có loại, chưa từ chối) thay ngưỡng thiện cảm 60, từ `social.after` (0,3) và từ `memTick` (0,12 mỗi tháng, hồi 12 tháng); chữ nhắc lại 1 đến 2 ký ức («…» và «…»); nhánh từ chối `nk` giữ nguyên; đồng ý thì loại `ket_nghia` kèm ký ức "lời thề". Công tắc tắt thì về ngưỡng 60 cũ.
  - *Sau kết nghĩa*: huynh đệ cùng vùng tự đến giúp khi `rel_ke_thu` (60%, thưởng giúp 10%); liên lụy thù (4% mỗi năm kẻ thù trút giận lên huynh đệ, bị thương hoặc chết); tặng vàng hoặc Hồi Xuân Đan khi bạn thiếu (hồi 36 tháng); khi chết thêm ký ức "lần cuối" và dòng nhật ký nhắc lại 1 đến 2 ký ức (`world.js` dieNow). Ba sự kiện mới tự viết: **Huynh đệ gặp nạn** (đi cứu / gửi tiền / bỏ mặc, hậu quả trễ 18 đến 36 tháng: huynh đệ nguội thành bạn hoặc hối hận nếu hắn đã mất), **Lợi và nghĩa** (nhận lợi bị khóa mềm khi Đạo đức ≥ 6; giữ lời thề; giả vờ dò, xác suất theo Tin), **Tái ngộ** (≥ 10 năm không gặp, cặp ≥ 2 ký ức và Tin ≥ 30, hiện cả khi chưa kết nghĩa).
  - *Giao diện*: mục **"Kỷ niệm (n/8)"** ở khối chiều sâu quan hệ (hồ sơ cặp, tab Gia đình/Quan hệ, thẻ người); hoạn nạn tô đỏ; `life-sim` in "Kỷ niệm các cặp thân" và `--mem=off`.
  - *Kiểm thử*: 8 bài "Kết nghĩa (9K)" (ký ức ở 8 loại điểm móc, trần 8 và giữ hoạn nạn, đồng hành đúng biên 5 đến 10% đo 6.000 lần, chia lợi phẩm, chết thay, lời hẹn; kết nghĩa không bật/bật, chữ nhắc, từ chối, công tắc; huynh đệ; ba sự kiện mới và hậu quả trễ và khóa mềm; lưu/tải; công tắc tắt: không rng, không ghi). Chạy đầy đủ 171 bài: 169 đạt, **2 lỗi có sẵn không do 9K** (chạy lại sau `git stash` vẫn lỗi y như vậy): "Sửa lõi (8B2): khi hoac chưa đủ" và "Nhịp quyết định" (7,04 lần/phút ở bản trước 9K, 7,06 sau 9K). `story-lint` sạch.
  - *Cân bằng*: `node tools/baseline.js --check` và `--check --mem=off` đều **trùng khít 40/40** (baseline không đi qua hệ người chơi).
  - *life-sim 101-103 (100 năm, Tự động, đạo tu luyện)*: ký ức 4, 4, 0 (cặp 2, 3, 0), **không có kết nghĩa** (tu luyện ít bí cảnh và ít bạn đồng hành; ký ức chủ yếu từ thế sự và nhiệm vụ). Mẫu rộng hơn (hạt 104 đến 109, 2 đạo, 12 đời): ký ức 0 đến 23, kết nghĩa 3/12 đời (đều ở đạo tu luyện), ví dụ 106: kết nghĩa 75 tuổi, cứu hộ 81 tuổi, tặng vàng 92 đến 97, ký ức cuối và nhật ký nhắc lại lúc mất ở 102.
  - *Chưa làm / lưu ý*: bạn đồng hành chỉ đi cùng bí cảnh và trận kẻ thù tìm đến, chưa đi cùng nhiệm vụ (nhiệm vụ chỉ ghi ký ức với người giao là NPC, chưa kiểm "cùng nơi"); ký ức chỉ ghi chung một bản cho cả hai (NPC với NPC không có d); vòng quay yếu tố Tin của "Lợi và nghĩa" thay bằng khóa mềm Đạo đức và xác suất theo Tin (đúng "hoặc" trong yêu cầu); thế sự chủ yếu ghi cho người ruột thịt và người ở cùng nơi nên có thể "cùng chống chọi" với cha mẹ; ký ức tuổi thơ có tuổi ước lượng theo hồi (5, 9, 13). Người chơi nên thử: bấm "Rủ đi cùng" rồi vào bí cảnh; chơi đạo giao du/mạo hiểm xem ký ức và kết nghĩa có đủ đều không (đang khoảng 1/4 đời), nhịp hộp "Huynh đệ gặp nạn", "Lợi và nghĩa", "Tái ngộ".
- [ ] **9C** R3 con cái lõi (khoảng 12 chặng, 5 quyết định mỗi con) + thừa kế + **màn kết đời / bia mộ** (Q 21.1#1).
- [x] **9K** (Sonnet) **Kết nghĩa qua trải nghiệm chung** (chốt 2026-10-20; thay chỗ 9C trong ngân sách, cần 9B; đã làm, xem mục "9K đã làm" ở trên):
  - *Vấn đề*: hiện chỉ cần thiện cảm ≥ 60 là `rel_ket_nghia` bật hộp "hợp nhau thì kết nghĩa", không có gắn bó thật.
  - *Ký ức chung*: cặp người chơi–NPC có `d.mem` (tối đa 8 mục `{ m, loai, chu }`) và điểm **Nghĩa** (dùng thanh Tin và Kính của 9B). Ký ức sinh ra khi **hai người cùng trải qua sự kiện đã có sẵn**, ưu tiên móc vào hệ cũ, ít tạo sự kiện mới: cùng vào bí cảnh (`dungeon.enter`, `opp_bi_canh`), cùng đánh quái hoặc kẻ thù (`combat`, `rel_ke_thu`), giúp nhau lúc khó (`rel_nho_giup`, bị thương, thiếu tiền), cùng làm nhiệm vụ (`quests` hoàn thành cùng nơi), cùng gặp thiên tai, chiến sự, dịch ở vùng (sự kiện thế giới sẵn có), bạn thuở nhỏ `{ban}` của tuổi thơ (ký ức đầu tiên), cùng nghe giảng, luận đạo, đấu giá (`opp_cao_nhan`, `opp_luan_dao`, `opp_dau_gia`). Hoạn nạn (suýt chết, cứu mạng) nặng hơn chuyện vui.
  - *Đồng hành*: khi người chơi đi bí cảnh, đánh nhau, làm nhiệm vụ mà có bạn thân (thiện cảm ≥ 40) cùng nơi, bạn đó có xác suất đi cùng (hoặc người chơi rủ bằng nút ưu tiên thấp theo R 1.1 mục 9): giúp nhẹ (+5 đến +10% thắng, chia chiến lợi phẩm), có thể bị thương hoặc chết thay; cả hai nhận ký ức.
  - *Kết nghĩa*: hộp `rel_ket_nghia` chỉ bật khi có **ít nhất 3 ký ức chung, trong đó ít nhất 1 hoạn nạn** (thay ngưỡng thiện cảm 60); lời ngỏ và lời thề **nhắc lại ký ức** ("Nhớ đêm ở {nơi}, ngươi kéo ta ra khỏi..."); viết lại hộp này.
  - *Sau kết nghĩa* (dùng sự kiện có sẵn, thêm ít): huynh đệ tự đến giúp khi `rel_ke_thu`; bị liên lụy thù của nhau; tặng đồ khi người kia thiếu; tin dữ khi huynh đệ chết (đã có đạo tâm −3, thêm ký ức cuối và dòng nhật ký). Chỉ thêm **3 sự kiện mới**: huynh đệ gặp nạn cầu cứu (đi hay không, có hậu quả trễ), thử thách tình nghĩa (lợi ích lớn đặt cạnh lời thề, vòng quay hoặc khóa theo Đạo đức), tái ngộ sau nhiều năm xa cách.
  - *Hiển thị*: Hồ sơ cặp (tab Quan hệ) có mục "Kỷ niệm" liệt kê ký ức chung; life-sim in ký ức của các cặp thân.
  - *Công tắc* `D.BOND.mem`; tắt thì `--check` trùng khít. Chỉ cặp của người chơi.
- [ ] **(Hoãn theo ý bạn, 2026-10-20) 9C, 9C-d**: con cái, thừa kế, màn kết đời; prompt giữ ở `PROMPT-phien-moi.md` để làm sau.
- **Cổng chơi thử 7 (sửa 2026-10-20):** sau 9K: một đời có xuất thân, tuổi thơ, xương sống A, đạo lữ, kết nghĩa (chưa có con cái và màn kết đời).

- **Hoãn sang Đợt 11 trở đi (chốt 2026-10-19, không làm nghèo lõi):** xương sống B đến E (Q4); xuất thân 9 đến 17; cấy/chuyển tiên thiên (đi cùng T13, T14); NPC bốn trục; R4 dây duyên và giấc mơ đẩy duyên (tạm dùng nhân vật định mệnh đơn giản của Q2); chặng ghép và loại trừ (Q 13.2); bốn tuyến mẫu còn lại; Q9 AI.

### Đợt 10. Người chơi vào cuộc: F5 và S9 (khoảng 3 lượt)
- [ ] **F5** hồ sơ quan hệ của người chơi với từng thế lực (tín nhiệm theo thế lực, tai tiếng, danh vọng theo vùng) ở tab Hồ sơ.
- [ ] **S9**: nhập ngũ, nho quan, sứ giả, cảnh báo phản phệ, nhiệm vụ thế lực đã đủ khung (cần Q2).
- [ ] Nối tín nhiệm (F5) với mạng quan hệ (S1) và tôn giáo (S5).

### Đợt 11. Nội dung truyện: Q5 đến Q7, Q10, S10, R5/R6 (khoảng 18 lượt)
- [ ] **Q5** kỳ ngộ làm lại, kho trope, manh mối, sự kiện lẻ cũ nối chuỗi.
- [ ] **Q6** tuyến thế giới W1 đến W8 nối kinh tế, dân số, hiệp ước, tông, báo; bí cảnh mới.
- [ ] **Q7** tuyến thân phận còn lại (T4, T6 đến T14).
- [ ] **Q10 (mục 24)**: đợt đầu khoảng 70 chặng/sự kiện (T15, T17, T18; W13, W16, W18, W20; cụm 11, 12, 15, 23, 24 và W25; 12 sự kiện nghịch lý), sau đó T16 Thần Chức, T19 đến T22, còn lại.
- [ ] **S10** xung đột tôn giáo, dị giáo, thánh chiến, thanh trừng, sự kiện nghịch lý của chín tông.
- [ ] **R5/R6** giao diện Nhân duyên, nội dung sư đồ, kết nghĩa, thù.
- [ ] `tools/story-sim.js`, `tools/story-lint.js`, trang `so-do-tuyen.html`.
- **Cổng chơi thử 8:** mỗi đợt nhỏ (khoảng 70 chặng) chơi thử, bạn duyệt chữ tôn giáo và Kim Phong, Thanh Xà.

### Đợt 12. Hoàn thiện (S11, Q8) (khoảng 4 lượt)
- [ ] **S11** giao diện (thẻ tông, tab Quốc gia/Tín ngưỡng nếu cần), `so-do-the-gioi.html` vẽ ma trận ân oán và hiệp ước, di động.
- [ ] **Q8** cân bằng toàn bộ, nhịp truyện (Story Director), màn kết đời, công cụ viết nội dung.
- [ ] Đo lại mọi chỉ tiêu (mục 6), chạy đầy đủ `tests.html`, chơi thử máy tính và điện thoại, snapshot.
- [ ] **Q9 (tùy chọn)** AI viết lại chữ và sinh tuyến sau khi bạn chơi thử.

---

## 5. Quy trình mỗi chặng (làm đúng thứ tự, không bỏ bước)
1. Đọc lại mục kế hoạch của chặng và các file sẽ chạm; ghi giả định.
2. Chạy `tools/baseline.js` lấy mốc **trước** (nếu chặng có thể ảnh hưởng thế giới).
3. Viết dữ liệu rồi hệ thống; mọi hàm đọc không gọi `rng`.
4. Thêm bài kiểm thử mới vào `tests.html`; chạy với `?only=` đến khi xanh.
5. So hash đường cơ sở: chặng không đổi cân bằng phải trùng khít; chặng đổi cân bằng thì đo chỉ tiêu (mục 6) và ghi số.
6. Làm giao diện; mở bằng Playwright, chụp màn hình máy tính và di động, kiểm không lỗi console.
7. Chạy đầy đủ `tests.html`.
8. Cập nhật tài liệu: tick chặng, "Đã làm" trong file kế hoạch, `KE-HOACH.md` (bảng tiến độ, nhật ký), `ke-hoach/README.md` nếu đổi trạng thái.
9. Commit rõ ràng (tiếng Việt, một chặng một commit hoặc vài commit nhỏ) kèm dòng đồng tác giả theo hướng dẫn.
10. Đẩy lên GitHub theo `CLAUDE.md`: fetch `main`, merge, push, đồng bộ local.
11. Báo cho bạn: đã làm gì, kiểm thử ra sao (đạt/lỗi, số đo), việc cần bạn chơi thử.

---

## 6. Chỉ tiêu cần giữ (đo lại ở mọi chặng đổi thế giới)
| Chỉ tiêu | Mức | Công cụ |
|---|---|---|
| Chiến tranh mỗi 300 năm (không tính đại chiến) | khoảng 52 (±25%) | `tools/baseline.js` (nhiều hạt giống) |
| Diệt vong mỗi 300 năm | khoảng 10 (±25%) | như trên |
| Đại chiến (chiến tranh tổng, S6b, đo riêng) | tối đa một lần mỗi 150 năm; hạt giống có thể không có | `tools/baseline.js` (in riêng) |
| Triều đổi chủ | 0 đến 16 lần | như trên |
| Phân tầng NPC Trúc Cơ+ theo tư chất | khoảng 2%, 5%, 18% (±10%) | bài đo hiện có (`tools/calib.js`) |
| Nhịp hỏi người chơi | dưới 6 lần mỗi phút | `tools/quest-sim.js`, `story-sim` |
| Mô phỏng 300-400 năm | dưới 1 giây | bài hiệu năng |
| Lãi buôn tối đa (E) | khoảng 25% trung bình | `tools/econ-sim.js` |
| Dân số mọi vùng | trong [0,25 n0; 1,3 cap] | bài F4 |
| Bản lưu cũ | tải được, không lỗi | bài lưu/tải |

---

## 7. Cổng chơi thử (điểm dừng cần bạn tham gia)
| Cổng | Sau đợt | Bạn xem/đáp |
|---|---|---|
| 1 | 1 (S1, F3) | Ma trận quan hệ, hồ sơ cặp, sổ ân oán; xung đột có vui không |
| 2 | 2 (S2) | Thẻ chín tông, nguyên mẫu, công–tội, Âm Hồn nghiêng ác |
| 3 | 4 (S3 đến S5) | Quốc vận, nho khí, thẻ tông, tôn giáo, nơi thờ tự |
| 4 | 5 (E7) | Chơi thử kinh tế (giá, hạn dùng, hội, nhiệm vụ hội, vay, giám định) |
| 5 | 7 (S6 đến S8) | Thế giới 200-300 năm: quân, chiến tranh tổng, liên tông |
| 6 | 8 | Nhân vật mới: tiên thiên, tính cách, khí vận, vòng quay |
| 7 | 9 | Một đời đầy đủ: xuất thân, đạo lữ, con cái, kế thừa |
| 8 | 11 (mỗi đợt nội dung nhỏ) | Duyệt chữ truyện; tôn giáo; Thanh Xà; Kim Phong |
| 9 | 12 | Bản cuối: cân bằng, di động, hiệu năng |

---

## 7b. Kế hoạch theo ngân sách (chốt hướng 2026-10-20: còn khoảng 30 đô)
**Mục tiêu:** một đời đầy đủ chơi được và hay (xuất thân, tuổi thơ, xương sống A trọn 6 mốc, đạo lữ, con cái, kế thừa, màn kết đời) + một gói nội dung đầu. **Không** làm hết kế hoạch gốc (khoảng 63 lượt). Chi phí mỗi phiên là ước lượng thô, giữ khoảng 5 đô dự phòng.

| # | Phiên | Model | Việc | Ước |
|---|---|---|---|---|
| 1 | 8B2 | Sonnet | sửa lõi sau life-sim (mục Đợt 8) | 2 |
| 2 | 9A-d | Haiku | dữ liệu 8 xuất thân, tuổi thơ theo xuất thân, chữ mốc A4 đến A6 | 1 |
| 3 | 9A | Sonnet | hệ xuất thân, nối A4 đến A6 | 3 |
| 4 | 9B | Sonnet | R1 lõi (gộp 8D) + cơ chế đạo lữ | 3 |
| 5 | 9B-d | Haiku | khoảng 12 chặng đạo lữ | 1 |
| 6 | 9K | Sonnet | **kết nghĩa qua trải nghiệm chung** (thay chỗ 9C, chốt 2026-10-20; xem Đợt 9) | 3 |
| 7 | (hoãn) 9C, 9C-d | | con cái, thừa kế, màn kết đời: **để sau theo ý bạn** (chưa muốn làm phần kết) | (3 + 1) |
| 8 | N1 đến N3 | Haiku | **N1 đã làm (2026-10-20)**: T1 `tp_tan_tu`, T2 `tp_dao_tong`, T5 `tp_thuong_nhan`, W1 `tg_chien_su` (5 chặng, 1 vòng quay ở chặng cuối, 2 đến 5 hậu quả trễ mỗi tuyến; `js/data/stories/`, đăng ký trong `js/files.js`); còn N2 và N3 | 3 gói nội dung tuyến (mỗi gói 3 đến 4 tuyến thân phận hoặc thế giới, viết đúng định dạng dữ liệu tuyến của 8B, chạy `story-lint`) | 4 |
| 9 | 8C | Sonnet | tiên thiên v2 bản gọn (tùy, nếu còn tiền) | 2,5 |
| 10 | Hoàn thiện | Sonnet | cân bằng nhịp, sửa lỗi chơi thử, kiểm thử đầy đủ | 2,5 |
| | **Cộng** | | | **khoảng 23** |

**Cắt hoặc để vô thời hạn:** Đợt 10 (F5, S9); xương sống B đến E; R4 dây duyên; Q9 AI; S10, S11; phần lớn mục 24 (chỉ lấy vài tuyến vào gói N); tuyến V hình ảnh (assets).
**Cách tiết kiệm (mọi phiên):** mỗi chặng một phiên mới (không kéo dài phiên); prompt ghi sẵn file và dòng cần đọc; chạy kiểm thử lọc theo từ khóa, chạy đầy đủ một lần cuối; Playwright chỉ chụp 1 đến 2 ảnh cần thiết; không dùng Opus; phiên thiết kế kết thúc sau khi viết xong prompt.
**Chơi thử:** đọc `life-sim` sau mỗi chặng Sonnet; chơi thật sau 9K (Cổng 7, chưa có con cái và màn kết đời).

## 8. Ước lượng tổng và thứ tự ưu tiên khi thiếu thời gian
Đơn vị "lượt" là một đợt làm việc liên tục có kiểm thử.
| Đợt | Nội dung | Lượt |
|---|---|---|
| 0 | Hạ tầng | 0,5 |
| 1 | S1, F3 | 3 |
| 2 | S2 | 2 |
| 3 | S3 | 2 |
| 4 | S4, S5 | 3 |
| 5 | E7 | 2 |
| 6 | S6, S7, F2 sau | 4 |
| 7 | S8 (M5b) | 1,5 |
| 8 | Q0-Q2, R1 | 8 |
| 9 | Q3, Q4, R2, R3, R4 | 12 |
| 10 | F5, S9 | 3 |
| 11 | Q5-Q7, Q10, S10, R5/R6 | 18 |
| 12 | S11, Q8 (+Q9) | 4 |
| **Cộng** |  | **khoảng 63** |

**Nếu phải cắt:** giữ Đợt 0 đến 4 (nền thế giới mới), Đợt 8 (nền nhân vật), rồi Đợt 9 phần R2; để Đợt 11 theo từng gói nhỏ và Q9 cuối cùng.

---

## 9. Rủi ro tổng thể
| Rủi ro | Cách giảm |
|---|---|
| Phạm vi rất lớn, dễ trôi | Cổng chơi thử; mỗi đợt có sản phẩm; cắt theo mục 8 |
| Xung đột sửa chung `factions.js`, `sect.js`, `tests.html` | Thứ tự đợt đã tính; mỗi chặng sửa tối thiểu; commit nhỏ; merge `main` mỗi lần đẩy |
| Đổi cân bằng không để ý | Hash đường cơ sở, chỉ tiêu mục 6, đo bật/tắt |
| Bài kiểm thử chậm (3 phút, sẽ tăng) | `?only=`, tách bài chậm, chạy đầy đủ ở cuối chặng |
| Nội dung nhạy cảm (tôn giáo, nước thật) | S mục 3, duyệt chữ ở cổng chơi thử |
| Bản lưu cũ hỏng | Trường khởi tạo muộn, bài lưu/tải mỗi chặng |
| Q10 (nội dung) quá lớn | Chia gói ~70 chặng, chơi thử từng gói; kho trope (Q 21.5) |
| Môi trường cloud không có giao diện thật | Playwright + ảnh chụp; bạn chơi thử bản thật ở các cổng |

---

## 10. Cần bạn chốt (có mặc định)
1. **Thứ tự đợt** theo mục 3 và 4? (Mặc định: có.)
2. **Nhánh và PR:** mỗi đợt một nhánh và một PR từ `main`, sau khi bạn merge PR #1? Hay tiếp tục dồn vào nhánh `add-game-project`? (Mặc định: merge PR #1 trước, sau đó mỗi đợt một nhánh.)
3. **Đợt nào bạn muốn chơi thử trước**: mặc định sau Đợt 1 để xem ma trận quan hệ.
4. **E7** có gộp giám định/nhiệm vụ hội/vay/bảo hiểm làm một đợt (mặc định) hay làm lẻ?
5. **Q9 (AI)**: giữ tùy chọn cuối cùng? (Mặc định: có.)

---

## 11. Nhật ký làm việc
- 2026-10-18: lập lộ trình tổng thể 13 đợt (0 đến 12) cho Q, R, S, E, F; đối chiếu hiện trạng E (đã code E0 đến E6, còn giám định và nhiệm vụ/vay/bảo hiểm hội), F (đã F1, F2 lõi, F4; còn F3, F5, F2 sau); S1 giao diện gộp vào Biên niên sử theo ý bạn. Chưa code.
- 2026-10-18: **Đợt 0 xong.** `tools/run-tests.js` (Playwright, lọc bài), `tests.html?only=`, `tools/baseline.js` (hash 6 hạt giống, đếm biến cố bằng cách bọc hàm; trung bình 300 năm: 54,7 chiến tranh, 6,7 diệt vong, 5,3 đổi chủ triều), `tools/baseline/seeds.json` (tái lập hai lần cho cùng hash). Chạy đầy đủ `tests.html`: 96 đạt, 0 lỗi, 98 giây. Dùng `sim.html` có sẵn làm trang trống. Lưu ý: sử ký bị cắt ở 300 mục nên đếm biến cố không dựa vào sử ký.
- 2026-10-18: **S1 xong.** Hash 6 hạt giống trùng khít đường cơ sở; `tests.html` 97 đạt, 0 lỗi; mục "Quan hệ thế lực" trong Biên niên sử. Tiếp theo: **F3** (vòng xung đột và hòa giải), rồi Cổng chơi thử 1.
- 2026-10-18: **Đợt 2 (S2) xong** (F3 tạm hoãn theo ý bạn). Tông có giá trị, hành vi, bảy chỉ số, năm chính sách, công–tội, bí mật; `align` nay suy ra từ hành vi; `dao` bật giữa các tông; đo 40 hạt giống: 52,2 chiến tranh, 6,5 diệt vong, 4,5 đổi chủ triều. 98 bài đạt. Tiếp theo: Đợt 3 (S3 quốc vận và nho khí) hoặc F3 nếu bạn muốn.
- 2026-10-18: **Đợt 3 (S3) xong.** Quốc vận, nho khí, thiên mệnh (đổi chủ, chia cắt, thôn tính), phản phệ cơ bản, văn vị dạng dữ liệu; `power` của triều suy ra từ vận và nho (tắt bằng `D.NATION.on = false` thì trùng khít đường cơ sở cũ). Đo 40 hạt giống: trước 52,2 chiến tranh, 6,5 diệt vong, 4,5 đổi chủ; sau 48,1 / 6,2 / 4,5, thêm 1,4 lần mất mệnh mỗi 300 năm. `tests.html` 99 đạt, 0 lỗi. Tiếp theo: Đợt 4 (S4, S5).
- 2026-10-18: **rà soát Đợt 2** tìm ra một lỗi thiết kế (Âm Hồn Giáo hợp với hầu hết các tông vì giá trị ở giữa; số cặp tông thù địch lúc dựng rơi từ 38 xuống 0). Đã thêm số hạng chênh hành vi vào `dao`, đo lại 40 hạt giống: 58,9 chiến tranh, 8,8 diệt vong, 5,0 đổi chủ triều; thêm bài kiểm thử chặn lỗi.
- 2026-10-19: **Đợt 4, S4 xong** (S5 để phiên sau). Trạng thái tông theo thế giới (`world.fac.sx`), `power` suy từ bảy chỉ số, năm chính sách có tác dụng nhỏ có trần, thanh trừng hiếm (sổ ân oán, sử ký, tin), thẻ tông đọc giá trị hiện có; công tắc `D.SECT_MOD.on` tắt thì 40 hạt giống trùng khít từng băm. 40 hạt giống: chiến tranh 53,5 → 52,7, diệt vong 8,2 → 7,8, đổi chủ 4,8 → 5,8, thanh trừng 2,2 mỗi 300 năm mỗi thế giới. `tests.html` 100 đạt, 1 lỗi: bài "Nhịp quyết định" đo 12 hạt giống ra 6,07 lần/phút (bật S4) so với 4,99 (tắt); đo 40 hạt giống ra 5,60 so với 5,44, nên không phải hồi quy thật, nhưng bài 12 hạt giống vẫn đỏ, cần bạn quyết định ngưỡng hoặc cỡ mẫu. Chi tiết ở S mục 15.15.
- 2026-10-18: thêm `ke-hoach/PROMPT-phien-moi.md` (ba prompt cho Đợt 4: 4A Sonnet S4, 4B Haiku dữ liệu tín ngưỡng, 4C Sonnet S5 cơ chế) và mục "Quy ước phiên làm việc" trong `CLAUDE.md` (mỗi phiên một đợt, chạy lần lượt, đọc có chọn lọc, chọn model theo việc).
- 2026-10-19: **Đợt 4, S5 xong** (Đợt 4 trọn vẹn). Tín ngưỡng: ba ô mỗi vùng, quy tắc lồng, đẩy ô yếu nhất, giáo hội, quốc giáo và khoan dung, phái hiếm, 27 nơi thờ tự đăng ký lúc chạy (9 biểu tượng pixel, dịch vụ cầu an, nghe giảng, cứu trợ, chữa bệnh), tín ngưỡng cá nhân, móc nhỏ có trần; công tắc tắt `D.FAITH.on = false` trùng khít 40/40 hạt giống. Đo 40 hạt giống: trước 52,7 chiến tranh, 7,8 diệt vong, 5,8 đổi chủ; sau 49,4 / 6,2 / 4,6 (100 hạt giống: 58,7/8,3/6,3 tắt, 59,2/7,9/6,1 bật). `tests.html` 103 đạt, 0 lỗi. Cổng chơi thử 3 đã sẵn sàng. Tiếp theo: Đợt 5.
- 2026-10-19: **Đợt 5, E7b xong** (giám định ở chợ đen và nhà đấu giá, vay hội có quá hạn, bảo hiểm chuyến buôn có trần, đơn hội; công tắc `D.ECO.hq`; 105 bài đạt; world và giá trùng khít với và không có E7b). Lãi buôn tối đa vẫn 49,2%, cần đo chuyến buôn người chơi.
- 2026-10-19: **Đợt 5, E7a xong** (thuế vào giá theo triều, lễ hội tôn giáo, thuế hương hỏa, quốc vận làm nhỏ cú sốc, khai báo `chien_tong`; công tắc `D.ECO.sx` trùng khít 40 hạt giống cả thế giới và giá; 104 bài đạt). Đo: chiến tranh 49,4 → 47,5, diệt vong 6,2 → 6,0; lãi buôn tối đa 48,5% (chưa đạt 25%). Còn E7b.
- 2026-10-19: Đợt 4 (S4, S5) đã xong ở các phiên khác; mình kiểm lại trên nhánh: 103 bài đạt, đường cơ sở 40 hạt giống trùng khít. Đã thêm prompt Đợt 5 (5A thuế vào giá và móc S, 5B giám định và hội vay, bảo hiểm, nhiệm vụ) vào `PROMPT-phien-moi.md`.
- 2026-10-19: **Đợt 6, S6a xong** (quân lực, phẩm, sát khí, tướng, quân trận, bảng lính tương đương, bản sắc chín triều, `strength()` dùng quân lực; công tắc `D.ARMY.on` trùng khít 40 hạt giống; 106 bài đạt). Đo 40 hạt giống: chiến tranh 47,5 → 54,5; diệt vong 6,0 → 6,8 (vẫn dưới mục tiêu, lệch có sẵn); đổi chủ 4,5 → 10,3 (trong chỉ tiêu, nguyên nhân chưa hiểu hết). S6b (chiến tranh tổng) để phiên sau.
- 2026-10-19: **Đợt 6, S6b xong** (chiến tranh tổng: mở tự động hoặc do Q gọi, 10-18 năm, bốn giai đoạn, hậu quả có trần, phản phệ, tông buộc chọn phe, cú sốc `chien_tong`; công tắc `D.TOTALWAR.on`; 107 bài đạt; đo 40 hạt giống: chiến tranh 57,0, diệt vong 7,7, đổi chủ 9,8, đại chiến 0,6 mỗi thế giới, 0 vi phạm 150 năm). Còn lại: S7, F2 phần sau, cốt truyện Phù Lệnh (Q 24.5b).
- 2026-10-19: **Đợt 7, S8 xong** (liên tông: vai trò tông với triều, thao túng kế vị có phản phệ, ước pháp, giải đấu 4 hoặc 10 năm, đại chiến liên tông có giới hạn, Thiên hạ công ước; công tắc `D.INTERSECT` trùng khít 40/40 mốc S7; 109 bài đạt; đo 40 hạt giống: chiến tranh 51,5 → 48,0, diệt vong 9,4 → 7,2 (dưới dải, gộp 80 hạt giống là 8,95, trong dải), đại chiến liên tông 1,3 mỗi 300 năm). Còn: Cổng chơi thử 5 (thế giới tự chạy 200 đến 300 năm).
- 2026-10-19: **phiên thiết kế Đợt 8**: chốt áp hệ mới chỉ cho người chơi (NPC giữ cũ), chia Đợt 8 thành lát cắt dọc 8A đến 8D, gọn Đợt 9 thành 9A đến 9C (thêm màn kết đời), danh sách hoãn, công cụ `life-sim` và trang thử nghiệm.
- 2026-10-19: **phiên thiết kế Đợt 8 (tiếp)**: chốt đặc tả 8A (tính cách, khí vận, hộp Đời mới), 8A2/8A3 (tuổi thơ ba hồi), 8B (khung tuyến, vòng quay, tuyến A1 đến A3, life-sim); prompt kickoff ở `PROMPT-phien-moi.md`. Tạm dừng thiết kế 8C, 8D cho tới khi code xong 8B; câu hỏi chờ ghi ở mục 8C.
- **2026-10-19** **8A** (Đợt 8) xong: tính cách bốn trục + khí vận v2 cho người chơi, hộp Đời mới, Hồ sơ (xem "8A đã làm" ở Đợt 8). Tắt `D.NATURE.on` trùng khít 40/40; bật cũng trùng khít (baseline không bước người chơi): chiến tranh 48,0, diệt vong 7,2, đổi chủ 9,5. 118 bài đạt. Còn: 8A2/8A3 tuổi thơ, 8B.
- **2026-10-20** **8A3** (Đợt 8) xong: tuổi thơ ba hồi cho người chơi (`TT.childhood`, hộp sự kiện và Tổng kết 12 tuổi, auto cho Tự động/kiểm thử). Tắt `D.CHILDHOOD.on` trùng khít 40/40; bật cũng trùng khít (chiến tranh 48,0, diệt vong 7,2, đổi chủ 9,5). 127 bài đạt. Còn: 8B.
- **2026-10-20** **8B** (Đợt 8) xong: khung truyện `TT.story` và vòng quay `TT.wheel`, tuyến A1 đến A3 (6 chặng, 1 vòng quay, 4 hậu quả trễ), `tools/story-lint.js`, `tools/life-sim.js`. Tắt `D.STORY.on` trùng khít 40/40; bật cũng trùng khít; nhịp quyết định 5,83 hộp/phút sau khi hạ sự kiện lẻ 15% (`evMul`). 137 bài đạt. Còn: 8C, 8D.
- 2026-10-20: **phiên thiết kế Đợt 8 (kết)**: đọc life-sim sau 8B, chốt 8B2 (hạ 60 đến 70% nội dung xuống Luyện Khí trung kỳ, mốc theo cảnh giới hoặc tuổi, chống trôi tính cách, lọc nhật ký); kế hoạch theo ngân sách (mục 7b); chốt 8 xuất thân, mặc định R mục 12, gói N1, N2; viết đủ prompt 8B2, 9A-d, 9A, 9B, 9B-d, 9C, 9C-d, N1/N2.
- 2026-10-20: theo ý bạn, **hoãn 9C, 9C-d** (con cái, kết đời); thay bằng **9K kết nghĩa qua trải nghiệm chung** (móc vào sự kiện có sẵn, chỉ thêm 3 sự kiện); Cổng 7 dời sau 9K; prompt N1/N2 bỏ phụ thuộc vào `kid`.
- 2026-10-20: **N1 đã làm** (Haiku, dữ liệu): bốn tuyến mới trong `js/data/stories/` (`tp_tan_tu`, `tp_dao_tong`, `tp_thuong_nhan`, `tg_chien_su`), 20 chặng, lint sạch 15 tuyến và 47 chặng, `run-tests` lọc "Truyện" 11 đạt; toàn bộ 138 đạt. Life-sim 101-103 (80 năm, số hộp truyện trên cả đời): trước 13 / 14 / 18, sau 16 / 14 / 18. W1 đã chạy hết chuỗi trong đời 101 (mở ở 65 tuổi). **Chưa mở được**: T1, T2, T5, vì điều kiện nghề, tông, không tông chưa có trong `condOk` (chỉ có realm, stage, age, flag, sau, bond, hoac). Cờ tạm `tan_tu`, `dao_tong`, `nghe_thuong` chưa có hệ nào gán. Việc tiếp: thêm điều kiện `job`, `sect` (hoặc gán cờ từ `TT.sect`/nghề), rồi kiểm lại số hộp. `tools/story-lint.js` đã đọc cả thư mục nên không cần đổi.
