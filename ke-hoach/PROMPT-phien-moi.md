# Prompt cho các phiên làm việc mới

Dán từng prompt vào một phiên mới (theo đúng thứ tự). Quy ước chung nằm trong `CLAUDE.md` của repo (phiên mới tự đọc), nên prompt chỉ nêu việc cụ thể.
Trạng thái lúc viết (2026-10-18): Đợt 0, 1 (S1), 2 (S2), 3 (S3) **đã xong**; F3 hoãn. Nhánh làm việc: `add-game-project`. Kiểm thử: 100 bài đạt.

Thứ tự đề nghị cho **Đợt 4**: **4A (Sonnet)** → **4B (Haiku)** → **4C (Sonnet)**. 4A độc lập với 4B và 4C; 4C cần dữ liệu của 4B.

---

## 4A. Sonnet: S4 Chỉ số tông, chính sách, hành vi theo từng thế giới

```
Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `add-game-project` (trả lời tiếng Việt, ngắn gọn). Đọc CLAUDE.md của repo trước (quy ước làm việc và push).

Đọc có chọn lọc (dùng grep -n "^#" rồi đọc đúng mục):
- ke-hoach/Z-lo-trinh-trien-khai.md: mục 2, mục 5, "Đợt 4".
- ke-hoach/S-quoc-gia-tong-mon-ton-giao.md: mục 6.1 đến 6.4 (giá trị, bảy chỉ số, năm chính sách, thanh trừng), 15.2 (không đụng rng), 15.13 và 15.14 (S2, S3 đã làm; nhất là ghi chú "nhan hiện là hằng số của dữ liệu chung").
- js/data/sectmodern.js, js/systems/nation.js (mẫu cách làm công tắc tắt và dữ liệu khởi tạo muộn dùng băm thay rng), js/systems/factions.js, js/systems/sect.js.

NHIỆM VỤ: Đợt 4 phần S4 (chưa làm tôn giáo).
1. Chuyển trạng thái tông theo TỪNG THẾ GIỚI: world.fac.sx[idTông] = { nhan, chiso[7], chinhsach[5], gt[5], last } khởi tạo muộn từ D.SECTS (dữ liệu chung chỉ là giá trị khởi đầu). Sửa thuộc tính `align` (getter trong js/data/sectmodern.js) để đọc `nhan` của thế giới đang chạy nếu có, nếu không thì dùng giá trị khởi đầu; mọi chỗ cũ đọc d.align phải vẫn chạy và kiểm thử cũ vẫn đạt. Bài kiểm thử: hai thế giới khác nhau không ảnh hưởng nhau.
2. `power` của tông suy ra từ bảy chỉ số (hệ số bù để trung bình giống power cũ, đo độ lệch) và công tắc tắt (D.SECT_MOD.on = false thì `node tools/baseline.js --sect=off --check` phải trùng khít đường cơ sở trước chặng này; tham khảo cách `--nation=off` đã làm ở S3).
3. Tác dụng nhỏ, có trần của năm chính sách lên mô phỏng sẵn có (thể chế lên biến động đoàn kết, kinh tế lên xu hướng của cải, quân sự lên sức mạnh khi đánh nhau, đối ngoại lên xác suất kết minh hoặc gây chiến, nhân tài lên số đệ tử nhận). Mỗi hệ số một dòng trong D.SECT_MOD để chỉnh được.
4. Thanh trừng nội bộ (hiếm): khi chỉ số `on` thấp hoặc triều đổi chủ, mỗi tông tối đa khoảng 1 lần mỗi 80 đến 150 năm; đổi gt, nhan, chính sách, đoàn kết, mất người; ghi sử ký, tin tức, sổ ân oán (TT.diplo.log); chưa làm hộp quyết định cho người chơi (để Q).
5. Thẻ tông (js/ui/sectcard.js) đọc giá trị hiện tại của thế giới thay vì dữ liệu tĩnh.

Quy tắc: hàm đọc không gọi rng; không đổi TT.VERSION; chỉ khi thật sự cần rng thì dùng sau cùng và nêu rõ. Đo 40 hạt giống 101 đến 140 trước và sau (chiến tranh, diệt vong, đổi chủ triều, số lần thanh trừng), lập lại tools/baseline/seeds.json bằng --save. Chạy đầy đủ `node tools/run-tests.js`. Kiểm giao diện bằng Playwright (máy tính và điện thoại). Ghi mục "S4 đã làm" (15.15) vào S-quoc-gia-tong-mon-ton-giao.md, cập nhật Z và KE-HOACH.md, rồi push theo CLAUDE.md. Báo ngắn gọn: đã làm, số kiểm thử, số đo, điều chưa làm.
```

---

## 4B. Haiku: dữ liệu tín ngưỡng (S5, chỉ dữ liệu, chưa gắn vào game)

```
Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `add-game-project` (trả lời tiếng Việt, ngắn gọn). Đọc CLAUDE.md của repo trước.

Đọc đúng các mục (dùng grep -n "^#" rồi đọc theo offset): ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 3 (nguyên tắc 5 đến 7, rất quan trọng về cách viết tôn giáo thật), mục 8.1 đến 8.4, và bảng 8.3 (chín vùng, ba ô khởi đầu). Xem js/data/sectmodern.js và js/data/nation.js để biết kiểu viết dữ liệu và cách đăng ký.

NHIỆM VỤ: chỉ viết DỮ LIỆU, không sửa hệ thống mô phỏng (không sửa factions.js, pacts.js, nation.js, diplo.js...). Tạo js/data/faiths.js:
- D.FAITHS: chín tín ngưỡng tên thật (Phật giáo, Thiên Chúa giáo, Hồi giáo, Ấn Độ giáo, Đạo giáo, Nho giáo, thờ cúng tổ tiên, Thần đạo, tín ngưỡng dân gian) với các trường: id, n, loi (cốt lõi, 1 câu), dongGop (đóng góp trong game), cangThang (căng thẳng trong game), phai (các phái: tên và mô tả ngắn), long (id các tín ngưỡng LỒNG được; Thiên Chúa giáo và Hồi giáo là [] và docQuyen: true), gioi (2 đến 3 giới, viết tôn trọng), phuc (một hiệu ứng nhỏ có trần, mô tả bằng chữ và hệ số), nghiLe (2 nghi lễ), noiTho (tên nơi thờ tự: chùa, nhà thờ, thánh đường, đền, đạo quán, văn miếu, từ đường, đền thần, miếu), tuDong (dạng nơi thờ nhỏ: miếu, am, nhà nguyện).
- D.FAITH_START: bảng ba ô khởi đầu của chín vùng theo bảng 8.3 (mỗi ô có chinh và long tùy chọn), D.FAITH_SLOTS = 3.
- Viết tôn trọng: mô tả như cơ chế xã hội (đóng góp và căng thẳng), không phán đúng sai về niềm tin, không biến cả một tôn giáo thành phản diện; kẻ cực đoan chỉ là một cá nhân hoặc một phái. Tên nước thật không xuất hiện trong chữ.
- Thêm vào js/files.js sau js/data/nation.js (chỉ dữ liệu, an toàn). Thêm bài kiểm thử cú pháp trong tests.html "Dữ liệu tín ngưỡng (S5)": đủ chín tín ngưỡng, đủ trường, quy tắc lồng đối xứng (nếu A lồng với B thì B lồng với A), Thiên Chúa giáo và Hồi giáo không lồng với ai, mỗi vùng đúng 3 ô khởi đầu và các tín ngưỡng trong ô tồn tại, một ô chỉ lồng tối đa một tục tương thích, chữ không chứa tên nước thật.

Kiểm: `node tools/run-tests.js` phải vẫn đạt toàn bộ và `node tools/baseline.js --check` phải trùng khít (dữ liệu chưa được dùng). Commit và push theo CLAUDE.md. Báo ngắn gọn: số tín ngưỡng, số dòng dữ liệu, kết quả kiểm thử.
```

---

## 4C. Sonnet: S5 Tôn giáo lõi (cơ chế, nơi thờ tự, giao diện)

```
Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `add-game-project` (trả lời tiếng Việt, ngắn gọn). Đọc CLAUDE.md của repo trước. Điều kiện: phiên 4B đã đẩy js/data/faiths.js lên nhánh (nếu chưa có, dừng và báo tôi).

Đọc có chọn lọc: ke-hoach/Z-lo-trinh-trien-khai.md "Đợt 4", ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 3 (nguyên tắc), 8 (tôn giáo: 8.3 ba ô và quy tắc lồng, 8.4 nơi thờ tự, 8.5 công thức, 8.6, 8.7), 15.2, 15.14 (S3 đã làm; mẫu công tắc tắt và băm thay rng). Xem js/data/faiths.js, js/systems/nation.js, js/data/places.js, js/data/buildings.js, js/ui/bldart.js, js/ui/diplo.js.

NHIỆM VỤ: Đợt 4 phần S5.
1. js/systems/faith.js (TT.faith), world.fac.faith khởi tạo muộn: ba ô mỗi vùng (ô = tín ngưỡng chính + tối đa một tục lồng tương thích; Thiên Chúa giáo và Hồi giáo độc chiếm một ô, không lồng), khởi đầu theo D.FAITH_START có biến thiên theo hạt giống (băm, không rng), share mỗi vùng tổng bằng 1; mỗi năm share dịch chuyển (truyền giáo, ủng hộ của thế lực, khủng hoảng dân tâm, đàn áp, thế tục hóa theo nho khí); đẩy ô yếu nhất khi tín ngưỡng mới vào đủ mạnh (kèm tin tức); giáo hội có luc, huong (hương hỏa), ky; quốc giáo và khoan dung cho mỗi triều và tông; phái hoặc dị giáo rất hiếm. Công tắc tắt D.FAITH.on = false và `node tools/baseline.js --faith=off --check` phải trùng khít đường cơ sở trước chặng.
2. Nơi thờ tự: loại địa điểm mới `tho_tu` (đại điện ở mỗi vùng thuộc ô 1; miếu hoặc am cho ô 2 và 3), thêm AN TOÀN cho bản lưu cũ (khởi tạo muộn), biểu tượng pixel theo tín ngưỡng trong js/ui/bldart.js, dịch vụ thật: cầu an (đạo tâm, giảm nghiệp), nghe giảng hoặc tụng kinh (tâm ma), cứu trợ và tị nạn, chữa bệnh; đổi chủ đại điện khi thứ hạng ô đổi.
3. Tín ngưỡng cá nhân (c.faith, c.tam: thế tục, tin sơ, sùng đạo), giữ giới, nghi lễ, hành hương, hôn nhân khác đạo (chỉ dữ liệu cờ, chưa làm hộp quyết định). CHƯA làm giáo sĩ và Thần Chức đạo (đã chuyển sang Q mục 24).
4. Giao diện: mục "Tín ngưỡng" gập được trong tab Biên niên sử (ba ô mỗi vùng đã biết, đại điện, tín ngưỡng cá nhân) và gợi ý nơi thờ tự trong phố công trình; chỉ hiện chữ và thanh.
5. Móc nhỏ có trần: tôn giáo giúp dân tâm đỡ tụt khi thiên tai; quốc giáo cộng nhẹ ổn định.

Quy tắc: viết tôn trọng (S mục 3), không phản diện hóa tôn giáo; hàm đọc không gọi rng; không đổi TT.VERSION. Bài kiểm thử: tổng share bằng 1, không quá 3 ô, quy tắc lồng, đẩy ô yếu nhất, đại điện đúng chủ, lưu/tải, bản cũ, tắt thì trùng khít, chữ không nhắc tên nước thật, hiệu năng. Đo 40 hạt giống 101 đến 140 trước và sau; lập lại tools/baseline/seeds.json. Chạy đầy đủ `node tools/run-tests.js`; kiểm giao diện bằng Playwright (máy tính, điện thoại). Ghi "S5 đã làm" (15.16) vào S-quoc-gia-tong-mon-ton-giao.md, cập nhật Z và KE-HOACH.md, rồi push theo CLAUDE.md. Báo ngắn gọn.
```

---

## Cổng chơi thử 3 (sau 4C)
Bạn xem: thẻ tông (chỉ số, chính sách, thanh trừng), mục "Tín ngưỡng" và nơi thờ tự ở vài vùng, một vòng đời ở vùng có đại điện.
