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
- [ ] **8A** (Sonnet) Q1.3 tính cách bốn trục + Q1.2 khí vận v2, chỉ cho người chơi; vỏ `S.kv` giữ cho mã cũ.
- [ ] **8B** (Sonnet) Q2 `TT.story` + `TT.wheel` bản tối thiểu, **một tuyến thật** làm mẫu, `story-lint` rút gọn, lệnh nhảy tới chặng, `tools/life-sim.js`.
- [ ] **8C** (Haiku dữ liệu, rồi Sonnet cơ chế) Q1.1 tiên thiên v2, chỉ cho người chơi; trang thử nghiệm.
- [ ] **8D** (Sonnet) R1 lõi: bốn thanh (Tình, Tin, Kính, Ơn oán) và loại quan hệ cho cặp thân thiết của người chơi; chuyển bản lưu cũ.
- **Cổng chơi thử 6:** đọc 3 bản `life-sim` + chơi 15 phút: tính cách đổi theo lựa chọn, vòng quay, tuyến mẫu, tiên thiên mới.

### Đợt 9. Một đời đầy đủ (gọn lại 2026-10-19)
- [ ] **9A** 8 xuất thân đầu (17 sau) + tuổi thơ + xương sống A (6 mốc).
- [ ] **9B** R2 đạo lữ lõi (khoảng 12 chặng: gặp, mến, tỏ tình, kết, thử thách, chia ly/vĩnh biệt).
- [ ] **9C** R3 con cái lõi (khoảng 12 chặng, 5 quyết định mỗi con) + thừa kế + **màn kết đời / bia mộ** (Q 21.1#1).
- **Cổng chơi thử 7:** một đời đầy đủ từ sinh đến chết/kế thừa.
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
