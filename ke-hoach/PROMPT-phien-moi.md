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

---

# ĐỢT 5 (E7: kinh tế còn tồn, nối với S)

Trạng thái lúc viết (2026-10-19): Đợt 0 đến 4 đã xong (S1 đến S5), F3 vẫn hoãn; 103 bài kiểm thử đạt, đường cơ sở 40 hạt giống. Chạy lần lượt **5A (Sonnet) → 5B (Sonnet)**; 5B không phụ thuộc 5A nhưng cùng sửa `tests.html` nên đừng chạy song song.

## 5A. Sonnet: thuế vào giá và móc S vào kinh tế

```
Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `add-game-project` (trả lời tiếng Việt, ngắn gọn). Đọc CLAUDE.md của repo trước (quy ước làm việc và push).

Đọc có chọn lọc (grep -n "^#" rồi đọc đúng mục):
- ke-hoach/Z-lo-trinh-trien-khai.md: mục 2, mục 5, mục 6, "Đợt 5".
- ke-hoach/E-kinh-te.md: A.2, A.3, A.12 đến A.14, A.17 (chỉ tiêu và trạng thái E đã làm).
- ke-hoach/S-quoc-gia-tong-mon-ton-giao.md: 15.14 (S3), 15.16 (S5, mục tín ngưỡng) và mục 8.6.
- Mã: js/systems/eco.js, js/data/eco.js, js/systems/buildings.js (dịch vụ Nha môn), js/systems/nation.js, js/systems/faith.js, js/systems/population.js, tools/econ-sim.js.

NHIỆM VỤ: Đợt 5 phần "thuế vào giá" và "móc S vào kinh tế".
1. Thuế vào giá theo triều: giá mua nhân (1 + thuế_suất_vùng x 0,15). thuế_suất đọc từ triều của vùng, dân tâm (F4) và quốc vận (S3): chiến sự hoặc dân tâm thấp thì cao, vận cao thì dịu. Hiện ở dịch vụ Nha môn (chữ và bậc, không số). Đừng đếm đôi với thuế kéo kho triều của population.js (`taxPull`): chỉ thêm tác động lên giá, hoặc nối hai chiều có chủ ý và ghi rõ.
2. Móc S: (a) lễ hội tôn giáo theo tín ngưỡng ô 1 của vùng tạo cầu tạm thời cho một vài nhóm hàng (đan, bùa, thảo...) vào các tháng lễ; (b) một phần nhỏ thuế tôn giáo chảy về kho triều; (c) quốc vận cao làm biên độ cú sốc giá nhỏ lại (có trần, có công tắc); (d) khai báo sẵn loại cú sốc `chien_tong` để chiến tranh tổng (S6) gọi sau, chưa kích hoạt.
3. Công tắc tắt D.ECO.sx = false (hoặc tên tương tự) làm mọi móc này bằng 1 hoặc 0: bằng chứng trùng khít: `node tools/baseline.js --check` và một phép kiểm cho kinh tế (mở rộng tools/econ-sim.js để in hash chỉ số giá 63 ô sau N năm cho vài hạt giống, lưu mốc, tắt thì phải trùng).
4. Đo lại E bằng tools/econ-sim.js: lãi buôn tối đa trung bình quanh 25%, chênh giá giữa vùng, số cú sốc; ghi số trước và sau. Đo 40 hạt giống 101 đến 140 trước và sau cho chỉ tiêu thế giới.

Quy tắc: hàm đọc không gọi rng; không đổi TT.VERSION; trường mới khởi tạo muộn; chữ tiếng Việt, tên nước thật không xuất hiện, tôn giáo viết tôn trọng. Bài kiểm thử mới: thuế vào giá đúng công thức và trong khoảng, lễ hội chỉ đúng tháng, tắt thì trùng khít, lưu/tải, bản cũ, hiệu năng. Chạy đầy đủ `node tools/run-tests.js`; kiểm giao diện bằng Playwright (Nha môn, máy tính và điện thoại). Ghi "E7a đã làm" (E-kinh-te.md mục A.18), cập nhật Z và KE-HOACH.md, rồi push theo CLAUDE.md. Báo ngắn gọn: đã làm, số kiểm thử, số đo, việc cần tôi chơi thử, điều chưa làm.
```

## 5B. Sonnet: giám định, và hội (nhiệm vụ, vay, bảo hiểm)

```
Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `add-game-project` (trả lời tiếng Việt, ngắn gọn). Đọc CLAUDE.md của repo trước. Nếu phiên 5A chưa đẩy xong thì dừng và báo tôi (cùng sửa tests.html).

Đọc có chọn lọc: ke-hoach/Z-lo-trinh-trien-khai.md "Đợt 5"; ke-hoach/E-kinh-te.md A.13 đến A.17 (nhất là A.15 quyền lợi theo bậc hội và "Chưa làm: giám định, nhiệm vụ/vay/bảo hiểm hội"). Xem js/systems/hoi.js (86 dòng), js/systems/eco.js, js/systems/buildings.js (nhà đấu giá, chợ đen, đồ nhái), js/systems/crossing.js (TT.cross.robbery), js/ui/shop.js (cửa sổ hội), js/data/eco.js.

NHIỆM VỤ: Đợt 5 phần E còn tồn.
1. Giám định: dịch vụ ở nhà đấu giá và chợ đen: trả phí để biết đồ có phải hàng nhái không (thông tin bất cân xứng); Thương nhân cấp cao và hội viên tự thấy dấu hiệu; có xác suất giám định sai nhỏ ở bậc thấp; kết quả cho thấy "thật", "nhái", "chưa chắc".
2. Hội: (a) nhiệm vụ hội (bảng đơn của hội: giao hàng, hộ tống, thu mua; thưởng tiền, thiện cảm, bậc); (b) vay hội (hạn mức theo bậc, lãi hằng năm, hạn trả, quá hạn thì thiện cảm giảm và mất quyền lợi, không phá sản người chơi tức thì); (c) bảo hiểm chuyến buôn (phí theo phần trăm giá trị hàng, bồi thường một phần khi bị cướp ở TT.cross.robbery, trần bồi thường).
3. Giao diện riêng trong cửa sổ hội (js/ui/shop.js): các mục Nhiệm vụ, Vay, Bảo hiểm, chỉ hiện chữ và bậc, nút rõ ràng; trên điện thoại không tràn ngang.
4. Công tắc tắt và bằng chứng: tắt thì kinh tế và thế giới trùng khít đường cơ sở (baseline --check và hash chỉ số giá của econ-sim, như phiên 5A).

Quy tắc: hàm đọc không gọi rng; không đổi TT.VERSION; trường mới khởi tạo muộn; chữ tiếng Việt cổ trang. Bài kiểm thử mới: giám định đúng và sai theo bậc, vay và trả và quá hạn, bảo hiểm bồi thường có trần, nhiệm vụ hội nhận và hoàn thành, lưu/tải, bản cũ, tắt thì trùng khít. Chạy đầy đủ `node tools/run-tests.js`; kiểm giao diện bằng Playwright. Đo lại tools/econ-sim.js (lãi buôn tối đa trung bình quanh 25%) trước và sau. Ghi "E7b đã làm" (E-kinh-te.md mục A.19), cập nhật Z và KE-HOACH.md, rồi push theo CLAUDE.md. Báo ngắn gọn.
```

## Sau Đợt 5: Cổng chơi thử 4
Bạn chơi thử kinh tế (giá, thuế ở Nha môn, lễ hội, giám định, hội vay và bảo hiểm). Sau đó mới chạy **Đợt 6** (S6 quân đội và chiến tranh tổng, S7 triều chính, F2 phần sau); mình sẽ soạn prompt Đợt 6 khi bạn xác nhận Đợt 5 ổn.

---

# Đợt 6: Quân đội, chiến tranh tổng, triều chính (S6, S7, F2 phần sau)

Chạy lần lượt **5B (nếu chưa) → 6A → 6B → 6C**, mỗi phiên một lượt, không song song (cùng sửa `tests.html`, `factions.js`, `tools/baseline/seeds.json`). Cả ba dùng Sonnet. 6A đổi cân bằng chủ ý (đo 40 hạt giống trước và sau). Chạy 6A trước 5B cũng được nhưng đừng chạy cùng lúc.

## 6A. Sonnet: S6a quân lực, phẩm, sát khí, tướng, quân trận

```
Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `add-game-project` (trả lời tiếng Việt, ngắn gọn). Đọc CLAUDE.md của repo trước. Trước khi bắt đầu: `git fetch origin add-game-project` và chắc chắn không có phiên khác đang đẩy.

Đọc có chọn lọc (grep -n "^#" rồi đọc đúng mục):
- ke-hoach/Z-lo-trinh-trien-khai.md: mục 2, 5, 6 và "Đợt 6".
- ke-hoach/S-quoc-gia-tong-mon-ton-giao.md: 5.4 (quân đội và quân trận), 7.3 (bản sắc 9 vương triều), 10.3 (chỉ tiêu), 15.2, 15.14 (S3 đã làm).
- Mã: js/systems/nation.js (power, văn vị, phản phệ), js/systems/factions.js (strength, chiến tranh), js/data/nation*.js, js/systems/combat.js, js/systems/diplo.js.

NHIỆM VỤ S6a: quân đội làm sức mạnh đặc biệt, có thể đối kháng tu sĩ nhưng khó.
1. Quân lực của mỗi triều: số quân theo dân và kho, phẩm quân (tân binh, tinh binh, cấm quân...), sát khí tích theo chiến sự, tướng (có bậc, có thể là tu sĩ), quân trận (trận đồ gom khí của quân, có điều kiện và hao tổn). Bản sắc quân của 9 triều theo bảng 7.3 (không nêu tên nước thật).
2. Bảng lính tương đương tu sĩ: Luyện Khí/Trúc Cơ yếu hơn một đội lính tinh; Kim Đan bị đại quân có trận vây thì thua; Hóa Thần thắng đại quân nhỏ nhưng thua đại quân có trận và sát khí cao. Làm thành hàm thuần (không rng) `TT.army.vsCultivator(...)`, dùng được cho combat sau này.
3. `strength()` của triều dùng quân lực (thay hoặc gộp có chủ ý, ghi rõ), không đếm đôi với `nat.power`.
4. Công tắc tắt D.ARMY.on=false: thế giới trùng khít đường cơ sở (`node tools/baseline.js --check`). Bật thì đo 40 hạt giống 101-140 trước và sau (chiến tranh khoảng 52 và diệt vong khoảng 10 mỗi 300 năm, sai số 25%), ghi số.
5. Giao diện tối thiểu: thẻ triều trong Biên niên sử hiện bậc quân lực, tướng, trận (chữ và bậc, không số).

Quy tắc: hàm đọc không gọi rng, không khởi tạo dữ liệu; trường mới khởi tạo muộn; không đổi TT.VERSION; chữ tiếng Việt, tên nước thật không xuất hiện. Kiểm thử mới: bảng lính tương đương, tắt thì trùng khít, lưu/tải, bản cũ, hiệu năng (300 năm dưới 1 giây). Chạy đầy đủ `node tools/run-tests.js`; kiểm giao diện Playwright. Ghi "S6a đã làm" vào S mục 15.17, cập nhật Z và KE-HOACH.md, `node tools/baseline.js --save` nếu có chủ ý đổi cân bằng, rồi push theo CLAUDE.md. Báo ngắn gọn: đã làm, số kiểm thử, số đo, việc cần tôi chơi thử, điều chưa làm.
```

## 6B. Sonnet: S6b engine chiến tranh tổng

```
Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `add-game-project` (tiếng Việt, ngắn gọn). Đọc CLAUDE.md trước. Nếu 6A chưa đẩy xong thì dừng và báo tôi.

Đọc có chọn lọc: ke-hoach/Z-lo-trinh-trien-khai.md "Đợt 6"; ke-hoach/S-quoc-gia-tong-mon-ton-giao.md 5.6 (chiến tranh tổng), 15.14 và mục "S6a đã làm"; ke-hoach/Q-cot-truyen.md mục 24.5b (Đại chiến Phù Lệnh, chỉ đọc mục này bằng grep -n rồi offset/limit); E-kinh-te.md A.18 (cú sốc `chien_tong` đã khai báo). Mã: js/systems/factions.js, pacts.js, nation.js, army (6A), eco.js.

NHIỆM VỤ S6b: engine chiến tranh tổng.
1. Khung chiến tranh đa bên: nhiều phe, nhiều chiến tuyến, kéo dài 10-18 năm, có giai đoạn (bùng nổ, giằng co, kiệt sức, nghị hòa), điều kiện mở (do sự kiện Q hoặc điều kiện thế giới như quốc vận suy nhiều nước cùng lúc), điều kiện kết (hết sức, một phe thắng, thiên mệnh).
2. Hậu quả: diệt vong, đổi chủ, chia cắt có trần; sát khí và phản phệ có trần; kích hoạt cú sốc giá `chien_tong` ở E; dân số giảm theo F4; tông môn buộc chọn phe theo quan hệ S1.
3. Tách thống kê: chiến tranh tổng không tính vào "52 chiến tranh/300 năm"; chỉ tiêu riêng: tối đa một đại chiến mỗi 150 năm (mặc định), có thể không bao giờ xảy ra ở một số hạt giống. Đo 40 hạt giống, ghi số.
4. Công tắc D.TOTALWAR.on=false: trùng khít đường cơ sở. Hàm đọc không rng. Cung cấp API cho Q (`TT.totalwar.start(opts)`) nhưng chưa viết cốt truyện Phù Lệnh.
5. Nhật báo/Biên niên sử hiện tin theo giai đoạn (chữ cổ trang).

Kiểm thử: chiến tranh tổng không phá chỉ tiêu thường, phản phệ có trần, kết thúc đúng điều kiện, lưu/tải giữa chiến tranh, tắt thì trùng khít, hiệu năng. Chạy đầy đủ run-tests, baseline --check (tắt) và đo (bật). Ghi "S6b đã làm" vào S mục 15.18, cập nhật Z và KE-HOACH.md, push theo CLAUDE.md. Báo ngắn gọn.
```

## 6C. Sonnet: S7 triều chính + F2 phần sau

```
Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `add-game-project` (tiếng Việt, ngắn gọn). Đọc CLAUDE.md trước. Nếu 6B chưa đẩy xong thì dừng và báo tôi.

Đọc có chọn lọc: ke-hoach/Z-lo-trinh-trien-khai.md "Đợt 6"; ke-hoach/S-quoc-gia-tong-mon-ton-giao.md 5.5 (triều chính, quốc sách), 8.6, 15.14, 15.16; ke-hoach/F-*.md (F2 phần còn lại, grep "Chưa làm"). Mã: js/systems/nation.js, factions.js, pacts.js, faith.js, quests.js, population.js.

NHIỆM VỤ:
1. S7 triều chính: hoàng quyền (mạnh/yếu), kế vị (có tranh ngôi, có thể sinh nội chiến nhỏ có trần), thế gia trong triều, quốc sách với tu sĩ (chiêu dụ, hạn chế, cấm), quốc giáo gắn triều (đổi quốc giáo có hệ quả). Dùng dữ liệu S3/S5 sẵn có, trường mới khởi tạo muộn.
2. F2 phần sau: trưng binh gắn hiệp ước (liên quan quân lực S6), nhiệm vụ do thế lực giao qua hệ nhiệm vụ A (hộ tống thu cống, đòi nợ cống, dẹp loạn), thông gia (`hon_uoc`), thuế thương hội.
3. Công tắc D.COURT.on=false trùng khít; đo 40 hạt giống khi bật (chỉ tiêu 52 chiến tranh/10 diệt vong, sai số 25%).
4. Giao diện: thẻ triều thêm hàng triều chính (chữ và bậc); nhiệm vụ mới hiện trong bảng nhiệm vụ hiện có.

Quy tắc như 6A/6B. Kiểm thử: kế vị, tranh ngôi có trần, quốc sách, trưng binh, nhiệm vụ thế lực nhận và trả, tắt thì trùng khít, lưu/tải, bản cũ. Chạy đầy đủ run-tests. Ghi "S7 đã làm" vào S mục 15.19, đánh dấu Đợt 6 trong Z, cập nhật KE-HOACH.md, push theo CLAUDE.md. Báo ngắn gọn.
```

## Sau Đợt 6: Cổng chơi thử 4 (nếu chưa)
Chơi thử kinh tế và quân sự; sau đó mới đến Đợt 7 (M5b Liên tông).

---

# Đợt 8: Nền nhân vật, làm theo lát cắt dọc (thiết kế chốt 2026-10-19, xem Z "Đợt 8")

Thứ tự: **8A (Sonnet)** → **8B (Sonnet)** → **8C (Haiku dữ liệu, rồi Sonnet)** → **8D (Sonnet)** → Cổng chơi thử 6. Điều kiện chung: PR thiết kế Đợt 8 (nhánh `thiet-ke-dot-8`) đã merge vào `main`. Nhánh code: đầu Đợt 8 tạo lại `add-game-project` từ `origin/main` (`git fetch origin main && git checkout -B add-game-project origin/main`); các chặng sau trong Đợt 8 tiếp tục trên nhánh đó; mở PR nháp nếu chưa có.

## 8A. Sonnet: tính cách bốn trục + khí vận v2 (chỉ người chơi) + hộp "Đời mới"

```
Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `main` (trả lời tiếng Việt, ngắn gọn, xưng "mình", gọi tôi là "bạn"). Đọc CLAUDE.md của repo trước. Tạo lại nhánh `add-game-project` từ origin/main nếu nhánh đó chưa có commit Đợt 8 (nếu đã có thì làm tiếp trên đó).

Đọc có chọn lọc (grep -n "^#" rồi đọc đúng mục, KHÔNG đọc nguyên Q):
- ke-hoach/Z-lo-trinh-trien-khai.md: mục 2, 5, "Đợt 8" (nhất là "Đặc tả 8A": đây là bản chốt, ưu tiên hơn Q khi khác nhau).
- ke-hoach/Q-cot-truyen.md: mục 6.2, 6.4, 6.8, 6.9 (tính cách), 5.2, 5.3, 5.6 (khí vận), 20.1 (đã chốt).
- Mã: js/systems/character.js (createChar, dòng ~40-95: baseKv, personality, ring), js/systems/world.js (life.reincarnate ~400, life.createWorld ~486), js/systems/stats.js (S.kv), js/systems/events.js (dòng 75-170: rate, kyNgo kv, boldOf, chooseIndex), js/systems/cultivation.js (kvFactor), js/systems/crossing.js:96, js/ui/panels.js:40, js/ui/controls.js (btn-new ~78), js/systems/rules.js (pickChoice), js/data/traits.js (m.kv).

NHIỆM VỤ (đúng "Đặc tả 8A" trong Z; chỉ người chơi, NPC giữ nguyên):
1. js/data/nature.js (D.NATURE: on, trục, dải và nhãn, ánh xạ kind → hướng, bảng chuyển nhãn cũ, hệ số độ liều/tâm ma có trần) và js/systems/nature.js (TT.nature: ensure (khởi tạo muộn, băm không rng), get, band, label, summary, shift có quán tính và trần năm, affinity(c, choice), mods(c)). Thêm vào js/files.js đúng thứ tự.
2. Bốc tính cách người chơi lúc sinh: ±8 mỗi trục, ít nhất 2 trục |v| ≥ 3, bằng băm (hạt giống thế giới + id), KHÔNG gọi rng. Nhãn cũ c.personality của người chơi suy từ trục (để boldOf, path.js, social.js cũ vẫn đọc được).
3. Mọi lựa chọn của người chơi dịch trục theo kind (trong luồng fire/resolve của events.js và decisions.js); nhật ký khi đổi dải; c.natureLog 30 mục. chooseIndex của người chơi dùng affinity thay bold khi D.NATURE.on. Chưa khóa mềm, chưa phí trái tính.
4. Khí vận: js/systems/kv.js (TT.kv: ensure, add(c, n, nguồn), spend, log). c.kvPts lấy từ chính baseKv đã rút (không rút thêm); không trần. S.kv của người chơi = min(kvPts, 20) + S.mod(c,'kv'); NPC giữ công thức cũ. Thay nguồn: kỳ ngộ vận mệnh +2, Nhẫn thật +2, đột phá Kim Đan trở lên +1 mỗi cảnh giới (một lần). Không cộng theo thời gian. Bản lưu cũ: kvPts = max(0, round(baseKv)).
5. Giao diện: Hồ sơ có khối Tính cách (bốn thanh −10..+10, nhãn dải, xanh khi vừa đổi, bấm xem lịch sử) và "Khí vận: N điểm". Hộp "Đời mới" (overlay giao diện, KHÔNG dùng w.pending): hiện kết quả bốc; ngân sách 4 điểm +/−; nếu không chỉnh mà bấm Bắt đầu thì máy phân 4 điểm vào trục lệch nhất; nút "Bốc lại" không giới hạn (thế giới mới: createWorld với hạt giống mới; khi đầu thai: bốc lại người chơi). Hiện khi tạo thế giới (btn-new và lần đầu) và khi đầu thai; không hiện khi con kế thừa; không hiện trong chế độ Tự động và kiểm thử.

Quy tắc: hàm đọc không gọi rng, không khởi tạo dữ liệu; không đổi TT.VERSION. Công tắc D.NATURE.on = false (gồm cả phần khí vận người chơi) thì `node tools/baseline.js --check` phải trùng khít; thêm cờ --nature=off cho baseline như các cờ cũ. Bật thì đo 40 hạt giống 101-140 (chiến tranh, diệt vong, đổi chủ) trước và sau, lưu lại seeds.json bằng --save nếu thế giới lệch, ghi số.
Kiểm thử mới trong tests.html (nhóm "Tính cách và khí vận (8A)"): bốc không trung dung hết và không gọi rng (rng state trước/sau bằng nhau), dải và nhãn, quán tính và trần năm, ánh xạ kind, chooseIndex theo affinity, kvPts = baseKv cũ, không trần, S.kv thụ động trần 20, không tăng theo thời gian (chạy 80 năm không sự kiện), nguồn cộng, bản lưu cũ, lưu/tải, công tắc tắt. Chạy `node tools/run-tests.js` đầy đủ. Kiểm giao diện hộp Đời mới và Hồ sơ bằng Playwright (máy tính và điện thoại), không lỗi console.
Cuối: ghi "8A đã làm" (Z, mục Đợt 8; Q mục 22 nhật ký), cập nhật KE-HOACH.md, commit, push theo CLAUDE.md, mở PR nháp nếu chưa có. Báo ngắn gọn: đã làm, số kiểm thử, số đo, việc cần tôi chơi thử, điều chưa làm.
```

## 8A2. Haiku: dữ liệu tuổi thơ (chỉ dữ liệu, chạy được trước hoặc sau 8A)

```
Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `add-game-project` (trả lời tiếng Việt, ngắn gọn, xưng "mình", gọi tôi là "bạn"). Đọc CLAUDE.md của repo trước.

Đọc: ke-hoach/Z-lo-trinh-trien-khai.md mục "Đợt 8", phần "Đặc tả tuổi thơ" và "Đặc tả 8A" (tên bốn trục: tinh, xuthe, daoduc, tudung; −10..+10). Xem js/data/events.js (30 dòng đầu) để biết kiểu viết `kind` và giọng chữ; js/data/traits.js để biết id các tật (g: 0).

NHIỆM VỤ: chỉ viết DỮ LIỆU js/data/childhood.js, không sửa hệ thống.
- D.CHILDHOOD = { on: true, p2: 0.5, p3: 0.5, cap: { atk: 6, nl: 6, hp: 30, luck: 3, daoTam: 10, tuchat: 1, kv: 1, bad: 1 }, ev: [...] }.
- ev: 24 sự kiện trở lên, mỗi hồi (hoi: 1, 2, 3) ít nhất 8. Mỗi sự kiện: { id: 'th_...', hoi, w (trọng số 1 đến 3), t (tiêu đề ngắn), d (2 đến 3 câu, có thể dùng khe {ban} là tên bạn thuở nhỏ, chỉ khi có trường needBan: true), ch: [2 hoặc 3 lựa chọn] }.
- Mỗi lựa chọn: { key, label, kind (risk/safe/fight/flee/help/pay hoặc kind mới đã giải thích trong chú thích), ax: { trục: ±1..±3 } (1 hoặc 2 trục), fx: { 1 đến 2 hiệu ứng trong: atk, nl, hp, gold, luck, daoTam, tuchat, kv, wake, bad, ban }, r (1 câu kết quả) }. tuchat và kv chỉ xuất hiện ở tối đa 3 lựa chọn mỗi loại trong cả bộ; mỗi lựa chọn có cái được và (nếu lợi lớn) cái mất.
- Nội dung: Hồi 1 (0 đến 3 tuổi) là chuyện sơ sinh, bệnh, điềm lạ, cha mẹ; Hồi 2 (4 đến 7) là chơi đùa, bạn bè, học chữ, lần đầu thấy tu sĩ; Hồi 3 (8 đến 11) là việc nhà, đánh nhau, giữ lời, thử tư chất, gặp tán tu. Giọng đời thường pha nhẹ, chuyện buồn kể nhẹ nhàng. Không tên nước thật. Không cần biết xuất thân (bản theo xuất thân làm ở 9A).
- Thêm vào js/files.js trong nhóm js/data. Thêm bài kiểm thử trong tests.html "Dữ liệu tuổi thơ (8A2)": mỗi hồi ≥ 8 sự kiện, id không trùng, mỗi sự kiện 2 đến 3 lựa chọn, ax chỉ dùng bốn trục và trong ±3, fx chỉ dùng khóa cho phép và 1 đến 2 khóa, bad trỏ đúng id tật, needBan khớp với khe {ban}, số lần dùng tuchat/kv ≤ 3.

Kiểm: `node tools/run-tests.js` đạt toàn bộ, `node tools/baseline.js --check` trùng khít. Commit, push theo CLAUDE.md. Báo: số sự kiện mỗi hồi, kết quả kiểm thử.
```

## 8A3. Sonnet: nối tuổi thơ vào hộp Đời mới (cần 8A và 8A2)

```
Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `add-game-project` (trả lời tiếng Việt, ngắn gọn, xưng "mình", gọi tôi là "bạn"). Đọc CLAUDE.md. Điều kiện: 8A và 8A2 đã có trên nhánh (thiếu thì dừng và báo tôi).

Đọc: Z mục "Đợt 8" (Đặc tả 8A, Đặc tả tuổi thơ, mục "8A đã làm"); js/data/childhood.js; js/systems/nature.js; mã hộp Đời mới do 8A viết; js/systems/world.js (life.reincarnate, TT.social.childhood).

NHIỆM VỤ: js/systems/childhood.js (TT.childhood: plan(c) bốc danh sách sự kiện ba hồi bằng băm, không gọi TT.rng; apply(c, ev, choice) áp ax qua TT.nature.shift (không tính trần năm) và fx có kẹp theo D.CHILDHOOD.cap cộng dồn trong c.childFx; auto(c) chọn theo affinity; summary(c)). Giao diện: sau khi xác nhận hộp Đời mới thì hiện lần lượt hộp từng sự kiện (tiêu đề hồi, chữ, lựa chọn có chấm "hợp tính"), rồi hộp Tổng kết 12 tuổi (đổi tính cách, chỉ số, tóm tắt từng hồi; nút "Đầu thai lại" và "Vào đời"). Ghi nhật ký tóm tắt. Chế độ Tự động và kiểm thử: chạy auto, không hiện hộp. Không dùng w.pending.

Quy tắc như 8A. Công tắc D.CHILDHOOD.on = false thì `--check` trùng khít (thêm cờ --childhood=off). Bật thì đo 40 hạt giống, ghi số. Kiểm thử "Tuổi thơ (8A3)": số sự kiện mỗi hồi theo p2/p3 (đo trên 2.000 lần bốc: khoảng 1,75 mỗi hồi), không lặp, không gọi rng, kẹp trần, auto chọn theo affinity, lưu/tải, công tắc. Playwright: cả luồng Đời mới → ba hồi → Tổng kết trên máy tính và điện thoại.
Cuối: ghi "8A3 đã làm" vào Z, Q mục 22; KE-HOACH.md; push theo CLAUDE.md. Báo ngắn gọn.
```

## 8B. Sonnet: khung tuyến `TT.story` + vòng quay `TT.wheel` + tuyến mẫu A1-A3 + life-sim (cần 8A; tốt nhất sau 8A3)

```
Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `add-game-project` (trả lời tiếng Việt, ngắn gọn, xưng "mình", gọi tôi là "bạn"). Đọc CLAUDE.md. Điều kiện: 8A đã có trên nhánh (TT.nature, TT.kv); thiếu thì dừng và báo tôi.

Đọc có chọn lọc: Z mục "Đợt 8" (Đặc tả 8A, Đặc tả 8B là bản chốt, các mục "đã làm"); Q mục 7 (vòng quay, 7.2 đến 7.8), 9.1 (xương sống A), 10 (kiến trúc tuyến), 6.5 (khóa mềm, phí trái tính); js/systems/decisions.js (cả file, 217 dòng: handlers, w.pending thuần dữ liệu), js/systems/events.js 120-250 (chooseIndex, cách đưa hộp), js/ui/quests.js, js/systems/cultivation.js 215-240 (đột phá), tools/baseline.js (mẫu chạy Playwright cho life-sim).

NHIỆM VỤ: đúng "Đặc tả 8B".
1. js/systems/story.js (TT.story) và js/systems/wheel.js (TT.wheel), handler 'story' và 'wheel' trong decisions.js; gọi tick tháng của story chỉ cho người chơi; mọi hàm đọc không gọi rng.
2. js/data/stories/bb_a.js: tuyến A1 đến A3 (mỗi mốc 1 đến 2 chặng, 2 đến 4 lựa chọn, có gate và gia ở vài lựa chọn, 1 vòng quay ở A3, ít nhất 2 hậu quả trễ, kết cục cộng khí vận theo Q 5.3). Chữ tự viết ngắn gọn, giọng pha, nghiêm ở chuyện lớn.
3. Giao diện: hộp chặng (nhãn Truyện, chấm hợp/trái tính, khóa có lý do), hộp vòng quay SVG, mục "Truyện của đời bạn" trong tab Nhiệm vụ; dừng thời gian ở x8/x16 khi có hộp.
4. tools/story-lint.js (chạy được bằng node, kiểm toàn bộ D.STORY.arcs), lệnh TT.story.jump, tools/life-sim.js (`node tools/life-sim.js --seed=101 [--years=80]`, ra tools/life-sim/101.txt; thêm thư mục vào .gitignore trừ 3 tệp mẫu cho hạt giống 101, 102, 103).

Quy tắc: không đổi TT.VERSION, trường mới khởi tạo muộn; công tắc D.STORY.on = false thì `node tools/baseline.js --check` trùng khít (cờ --story=off). Bật thì đo 40 hạt giống trước/sau và nhịp quyết định (bài "Nhịp quyết định" phải vẫn < 6 lần/phút). Kiểm thử "Truyện và vòng quay (8B)": story-lint sạch, mở tuyến đúng điều kiện, hạn tự tiến theo mac, hậu quả trễ chín đúng khoảng, gate và gia, vai lấy NPC có sẵn, vòng quay (tổng 100, một yếu tố, điểm trong [−10, +15], quay lại 1 lần, trừ khí vận, chặn vùng cao nhất và khi thiếu điểm, +1 khi vùng cao nhất), lưu/tải giữa chặng và giữa vòng quay, công tắc. Playwright: hộp chặng, vòng quay, tab Nhiệm vụ trên máy tính và điện thoại.
Cuối: ghi "8B đã làm" vào Z, Q mục 22; KE-HOACH.md; push theo CLAUDE.md. Báo ngắn gọn, kèm đường dẫn 3 tệp life-sim mẫu để tôi đọc.
```

## 8B2. Sonnet: sửa lõi sau khi đọc life-sim (cần 8B)

```
Repo: Phongxuan123/tu-tien. Gắn repo, clone nhánh `main` (trả lời tiếng Việt, ngắn gọn, xưng "mình", gọi tôi là "bạn"). Đọc CLAUDE.md. Làm trên nhánh `add-game-project` (tạo lại từ origin/main nếu PR Đợt 8 đã merge; nếu chưa merge thì checkout origin/add-game-project). TIẾT KIỆM: chỉ đọc đúng phần ghi dưới đây, chạy kiểm thử lọc theo từ khóa, chạy đầy đủ một lần cuối, Playwright tối đa 1 ảnh.

Đọc: Z mục "Đợt 8" phần "8B2" (bản chốt) và "8B đã làm"; js/data/story.js; js/data/stories/bb_a.js; js/systems/story.js (phần mở tuyến và kiểm điều kiện mo/khi); js/systems/nature.js (shift, quán tính, affinity); js/systems/events.js chooseIndex (dòng ~120-145); js/systems/stats.js 95-105 (sơ/trung/hậu kỳ); nơi ghi dòng tổng kết năm và tin đồn (grep "Tuổi ' +" và "Tin đồn").

NHIỆM VỤ (đúng "8B2"):
1. Điều kiện `stage` (0 sơ, 1 trung, 2 hậu kỳ) và `tuoi` cho mo/khi, ghép "cảnh giới HOẶC tuổi" (mo: { hoac: [ {realm, stage}, {age} ] } hoặc dạng tương đương gọn); cập nhật story-lint. Sửa bb_a: A2 Luyện Khí hoặc 18 tuổi; A3 Luyện Khí trung kỳ hoặc 35 tuổi; thêm d_pham cho chặng cần chữ khác khi còn phàm nhân. Ghi quy ước "60 đến 70% nội dung hạ xuống Luyện Khí trung kỳ" vào chú thích đầu js/data/story.js làm hướng dẫn viết tuyến.
2. Chống trôi: quán tính dải cực 0,3; dịch trục từ sự kiện thường ngày (không phải chặng truyện, không phải tuổi thơ) nhân 0,5; chooseIndex của người chơi ở chế độ Tự động/Cân bằng chọn ngẫu nhiên theo trọng số affinity (quy tắc nếu-thì vẫn đè). Hệ số để trong D.NATURE.
3. Lọc nhật ký: gom dòng tổng kết năm không có gì (+0) và tin đồn lặp (cùng loại, cùng nơi trong 3 năm) thành một dòng cuối năm.

Kiểm: `node tools/story-lint.js` sạch; `node tools/baseline.js --check` trùng khít (baseline không bước người chơi); bài kiểm thử mới "Sửa lõi (8B2)": điều kiện hoặc-tuổi, stage, quán tính 0,3, Tự động không luôn chọn hợp nhất (đo 500 lần), lọc nhật ký; bài 8A/8B cũ vẫn đạt (sửa bài nếu chỉ do hệ số đổi, ghi rõ). Chạy lại `node tools/life-sim.js` cho 101, 102, 103: không đời nào có cả bốn trục ở dải cực, A1 đến A3 đều xảy ra trong 40 năm đầu; dòng nhật ký giảm rõ. Chạy đầy đủ run-tests một lần cuối.
Cuối: ghi "8B2 đã làm" vào Z (kèm số dòng nhật ký trước/sau, tính cách cuối 3 đời), Q mục 22; push theo CLAUDE.md. Báo ngắn gọn.
```

---

# Đợt 9 và gói nội dung (theo ngân sách, Z mục 7b; chốt 2026-10-20)

Thứ tự: 8B2 → **9A-d (Haiku)** → **9A (Sonnet)** → **9B (Sonnet)** → **9B-d (Haiku)** → **9C (Sonnet)** → **9C-d (Haiku)** → Cổng chơi thử 7 → **N1, N2 (Haiku)** → (8C nếu còn tiền) → hoàn thiện. Mọi phiên: nhánh `add-game-project` (tạo lại từ origin/main nếu PR trước đã merge, nếu chưa thì checkout origin/add-game-project); TIẾT KIỆM: chỉ đọc đúng phần ghi, kiểm thử lọc theo từ khóa, chạy đầy đủ một lần cuối, Playwright tối đa 1 ảnh; trả lời tiếng Việt, ngắn gọn, xưng "mình", gọi tôi là "bạn"; đọc CLAUDE.md trước; cuối phiên ghi "… đã làm" vào Z (mục Đợt 9 hoặc 7b), push theo CLAUDE.md, báo ngắn gọn.

## 9A-d. Haiku: dữ liệu 8 xuất thân, tuổi thơ theo xuất thân, chữ mốc A4 đến A6

```
Repo: Phongxuan123/tu-tien. Gắn repo, làm theo dòng "Mọi phiên" ở đầu mục Đợt 9 trong ke-hoach/PROMPT-phien-moi.md.
Đọc: Q mục 8.1 đến 8.4 (grep -n "^#" rồi đọc theo offset), 9.1 (xương sống A), Z mục "8B2" (hạ cảnh giới, mốc theo tuổi); js/data/childhood.js (định dạng sự kiện tuổi thơ); js/data/stories/bb_a.js (định dạng tuyến, đã có A1 đến A3); js/data/story.js (chú thích hướng dẫn viết tuyến).

NHIỆM VỤ, chỉ DỮ LIỆU (không sửa js/systems):
1. js/data/origins2.js: D.ORIGINS2 gồm 8 xuất thân: p1 Nông hộ (28), p2 Thợ thủ công, ngư dân, thợ săn (13), p3 Nhà thương nhân (13), p5 Cô nhi lang thang (12), t1 Cha hoặc mẹ là tán tu (12), t3 Gia tộc luyện đan (8), t6 Hậu duệ đệ tử tông (8), t10 Gia tộc sa sút (6) (số trong ngoặc là trọng số). Mỗi cái: { id, n, w, d (2 câu), start: { gold, luck?, daoTam?, atk?, nl?, items?: [id có thật trong js/data/items.js] }, gom: chuỗi gánh nặng 1 câu, cha_me: { co: true/false (cô nhi false), tu: true/false }, ax: { trục: ±1..±2 } (nghiêng tính cách lúc sinh), bi_mat?: 1 câu (chỉ t10, t1 có thể), place_types: [loại địa điểm phù hợp, lấy từ js/data/places.js] }.
2. Thêm vào js/data/childhood.js mảng D.CHILDHOOD.ev các sự kiện có trường `origin: ['p1', ...]`: mỗi xuất thân 3 sự kiện (ít nhất 1 mỗi hồi cho p5, t3, t10), cùng định dạng và trần như sự kiện chung.
3. js/data/stories/bb_a.js: thêm tuyến bb_a4 (Vị thế: biến cố thế giới kéo vào, chọn phe / đứng ngoài / lợi dụng), bb_a5 (Đạo quả: thu đồ, lập nghiệp, đồng kỳ trở lại), bb_a6 (Thiên môn: kết đời, vòng quay 4 vùng đọa ma / tọa hóa để lại truyền thừa / ẩn thế / phi thăng, yếu tố nhân quả: dùng stat 'nghiep' ngược chiều hoặc rep). Mở: A4 Trúc Cơ hoặc 55 tuổi, A5 tuổi 75 hoặc Kim Đan, A6 thọ còn 10% hoặc Hóa Thần (dùng điều kiện "hoặc" và stage do 8B2 làm; đọc story.js phần mo để dùng đúng khóa). Mỗi mốc 1 đến 2 chặng, 2 đến 4 lựa chọn, có d_pham khi người chơi còn phàm nhân, ít nhất 1 hậu quả trễ mỗi mốc, kết cục cộng khí vận theo Q 5.3.
Kiểm: `node tools/story-lint.js` sạch; bài kiểm thử "Dữ liệu xuất thân (9A-d)" (đủ 8, tổng trọng số 100, items có thật, place_types có thật, mỗi xuất thân 3 sự kiện tuổi thơ hợp lệ); run-tests lọc "tuổi thơ|xuất thân|8B" rồi đầy đủ; baseline --check trùng khít. Ghi "9A-d đã làm". Push.
```

## 9A. Sonnet: hệ xuất thân, cha mẹ thật, nối A4 đến A6

```
Repo: Phongxuan123/tu-tien. Gắn repo, làm theo dòng "Mọi phiên" ở đầu mục Đợt 9 trong ke-hoach/PROMPT-phien-moi.md. Điều kiện: 9A-d đã có trên nhánh.
Đọc: Q mục 8.2, 8.4, 8.5; Z "8B2", "9A-d đã làm"; js/data/origins2.js; js/systems/character.js (createChar, origin hiện tại lấy từ reg.origins); js/systems/world.js (life.reincarnate); js/systems/childhood.js (plan: bốc sự kiện); js/ui/newlife.js; js/systems/family.js (cách tạo quan hệ huyết thống, parents, children).

NHIỆM VỤ (chỉ người chơi; NPC giữ origin cũ):
1. Bốc xuất thân người chơi theo D.ORIGINS2 bằng băm (không gọi rng), áp start và ax; c.origin2 = id; c.origin (chữ hiển thị) đổi theo. Địa điểm sinh ưu tiên place_types. Công tắc D.ORIGINS2.on.
2. Cha mẹ là NPC thật khi cha_me.co: dựng 1 đến 2 NPC (TT.life.spawnNpc hoặc createChar, tuổi 30 đến 50, tu theo cha_me.tu), quan hệ huyết thống với người chơi, sống tiếp trong thế giới (có thể chết). Vì việc này rút rng, đặt SAU mọi lần rút cũ của reincarnate và ghi rõ; đo 40 hạt giống bật/tắt.
3. Tuổi thơ bốc thêm sự kiện có origin khớp (ưu tiên trọng số ×2). Hộp Đời mới hiện xuất thân, cha mẹ, gánh nặng; Bốc lại đổi cả xuất thân.
4. Bí mật (bi_mat) ghi cờ c.flags.biMat để tuyến sau đọc; chưa cần lộ.
5. Hồ sơ hiện xuất thân và cha mẹ (tên, còn sống).
Kiểm thử "Xuất thân (9A)": tỉ lệ bốc gần trọng số (2.000 lần, băm), không gọi rng khi đọc, start áp đúng, cô nhi không có cha mẹ, cha mẹ có quan hệ huyết thống, tuổi thơ có sự kiện theo xuất thân, A4 đến A6 mở đúng (TT.story.jump và mô phỏng tuổi), lưu/tải, bản lưu cũ không vỡ, công tắc tắt trùng khít. life-sim 101-103 chạy lại, ghi vào Z. Ghi "9A đã làm". Push.
```

## 9B. Sonnet: R1 lõi + cơ chế đạo lữ

```
Repo: Phongxuan123/tu-tien. Gắn repo, làm theo dòng "Mọi phiên" ở đầu mục Đợt 9 trong ke-hoach/PROMPT-phien-moi.md.
Đọc: R mục 1.1 (đã chốt, gồm mục 10), 4.1, 4.2, 5.1 đến 5.5, 10, 12 (mọi câu theo mặc định, đã chốt 2026-10-20); Z mục 7b; js/systems/relations.js (TT.rel), js/systems/family.js (song tu, kết đạo lữ, mixTraits), js/data/relevents.js (hộp Duyên tình cũ), js/systems/story.js (applyFx, vai) và js/data/story.js.

NHIỆM VỤ (chỉ cặp của người chơi; NPC với NPC giữ cũ):
1. R1 lõi: world.rel[key].d = { love, trust, respect, debt, st, since } khởi tạo muộn cho cặp thân thiết của người chơi (|v| ≥ 40 hoặc có loại đặc biệt); loại chính theo R 4.2 (ban, ket_nghia, dao_lu, thuong, hon_uoc, su_do, huyet, an, thu, cu); chuyển bản lưu cũ một lần (love cũ → d.love, k cũ → loại). TT.bond: get, bars, label, shift, setType. Hàm đọc không gọi rng.
2. Đạo lữ: giai đoạn (gặp, mến, tỏ tình, hôn ước tùy, kết, ở bên, thử thách, rạn nứt hoặc vĩnh biệt) lưu ở d.st; 1 chính + tối đa 2 phụ; tương hợp từ bốn trục tính cách (khoảng cách) và đạo; song tu 1 đến 2 lần mỗi năm, thưởng giảm dần khi nhiều lần; chênh cảnh giới gây "nỗi buồn tuổi thọ"; đạo lữ NPC tự chủ (có thể từ chối, rời). Hôn ước chỉ do thế lực/gia tộc ép người chơi, có nhánh từ chối.
3. Mở rộng fx của story: bond: { vai, love?, trust?, respect?, debt?, st?, type? } và điều kiện mo/khi theo bond (vai đạt giai đoạn hoặc thanh). Tuyến đạo lữ sẽ viết bằng dữ liệu (phiên 9B-d), nên chỉ cần 1 tuyến khung mẫu ngắn (3 chặng: gặp, tỏ tình, kết) trong js/data/stories/dl_mau.js để kiểm.
4. Giao diện: tab Gia đình/Quan hệ hiện ba thanh (Tình, Tin, Kính) và chip Ơn/Oán cho cặp thân thiết, giai đoạn đạo lữ. Chưa gộp tab (để sau).
Công tắc D.BOND.on; tắt thì baseline --check trùng khít. Kiểm thử "Quan hệ và đạo lữ (9B)": thanh, loại, chuyển bản cũ, giai đoạn, tương hợp, song tu giảm thưởng, đạo lữ NPC từ chối được, fx bond trong story, lưu/tải, công tắc. story-lint sạch. Ghi "9B đã làm" (kèm danh sách khóa fx/điều kiện mới để 9B-d viết dữ liệu). Push.
```

## 9B-d. Haiku: khoảng 12 chặng đạo lữ (dữ liệu tuyến)

```
Repo: Phongxuan123/tu-tien. Gắn repo, làm theo dòng "Mọi phiên" ở đầu mục Đợt 9 trong ke-hoach/PROMPT-phien-moi.md. Điều kiện: 9B đã có trên nhánh.
Đọc: Z "9B đã làm" (khóa fx và điều kiện bond); R mục 5.1 đến 5.5, 3 (mục tiêu 6: văn học, không miêu tả thân mật, đau thương kể gián tiếp); js/data/story.js (hướng dẫn viết tuyến); js/data/stories/dl_mau.js và bb_a.js (mẫu).
NHIỆM VỤ: chỉ DỮ LIỆU js/data/stories/dao_lu.js: 3 đến 4 tuyến, tổng khoảng 12 chặng, phủ hành trình gặp → mến → tỏ tình → (hôn ước bị ép, có nhánh từ chối) → kết đạo lữ → ở bên → thử thách (chia đường tu, kẻ thứ ba, chênh thọ) → rạn nứt và hòa giải hoặc chia tay → vĩnh biệt (tang, kể gián tiếp). Có 2 vòng quay (ví dụ lời tỏ tình, giữ hay buông khi chênh thọ, yếu tố rel hoặc nature), ít nhất 3 hậu quả trễ, khóa mềm theo tính cách ở vài lựa chọn. 60 đến 70% chặng mở từ Luyện Khí trung kỳ trở xuống (theo hướng dẫn). Chữ ngắn, giọng pha, nghiêm ở chuyện lớn; tên NPC qua khe vai.
Kiểm: story-lint sạch; run-tests lọc "đạo lữ|9B|Truyện"; chạy life-sim 101-103 (in đời có chặng đạo lữ hay không). Ghi "9B-d đã làm". Push.
```

## 9C. Sonnet: con cái, thừa kế, màn kết đời

```
Repo: Phongxuan123/tu-tien. Gắn repo, làm theo dòng "Mọi phiên" ở đầu mục Đợt 9 trong ke-hoach/PROMPT-phien-moi.md. Điều kiện: 9B đã có trên nhánh.
Đọc: R mục 6.1 đến 6.7, 12 (mặc định đã chốt); Q mục 21.1 ý 1 (màn kết đời, bia mộ); Z "9B đã làm"; js/systems/family.js (thụ thai, sinh, mixTraits, tối đa con); js/systems/world.js (life.inherit, chết, đầu thai); js/ui/newlife.js.
NHIỆM VỤ (con của người chơi):
1. Thụ thai: ý định có con (cờ người chơi, mặc định theo tính cách), xác suất 10% mỗi buổi song tu ở Phàm nhân/Luyện Khí giảm dần về 1% ở cảnh giới cao; tối đa 2 con cả đời (gồm con nuôi); thai kỳ có rủi ro hiếm (kể gián tiếp). Thay xác suất 1,8%/tháng cũ cho người chơi; NPC giữ cũ.
2. Con có bốn trục tính cách (băm từ cha mẹ + nhiễu), xuất thân thừa hưởng từ cha mẹ (gia tộc của người chơi), giai đoạn (sơ sinh, thơ ấu, thiếu niên, lập nghiệp) và 5 điểm quyết định (giáo dưỡng 6-8 tuổi, vào tu hành 12, nổi loạn, lập nghiệp, thừa kế) dưới dạng chặng truyện (fx mới: kid: { id/vai, ax, st }); phần còn lại chạy theo tính cách. Bond cha mẹ-con dùng TT.bond (9B).
3. Thừa kế: di chúc (chọn trước người nhận gia sản, di vật; mặc định theo năng lực và quan hệ); khi kế thừa con mang theo ơn, oán, nợ, di vật rõ ràng (nối life.inherit).
4. Màn kết đời: khi chết hoặc phi thăng, hộp tóm tắt đời (xuất thân, tuổi thơ, xương sống đến mốc nào và kết cục, tuyến đã qua, đạo lữ, con, tính cách đầu/cuối, khí vận kiếm/tiêu, dòng bia mộ: đạo hiệu + một câu ghép từ dữ liệu D.EPITAPH), lưu vào Sổ đời (w.lives). Có nút "Kế thừa" / "Đầu thai".
5. 1 tuyến khung mẫu ngắn js/data/stories/con_mau.js (2 chặng) để kiểm.
Công tắc D.KID.on; tắt thì baseline --check trùng khít. Kiểm thử "Con cái và kết đời (9C)": xác suất theo cảnh giới, tối đa 2, tính cách con, 5 điểm quyết định, di chúc và kế thừa mang ơn oán, màn kết đời có đủ mục và lưu Sổ đời, lưu/tải, công tắc. Ghi "9C đã làm" (kèm khóa fx/điều kiện mới cho 9C-d). Push.
```

## 9C-d. Haiku: khoảng 12 chặng con cái + chữ bia mộ

```
Repo: Phongxuan123/tu-tien. Gắn repo, làm theo dòng "Mọi phiên" ở đầu mục Đợt 9 trong ke-hoach/PROMPT-phien-moi.md. Điều kiện: 9C đã có trên nhánh.
Đọc: Z "9C đã làm"; R mục 6.2 đến 6.6; js/data/story.js (hướng dẫn); js/data/stories/con_mau.js, dao_lu.js (mẫu).
NHIỆM VỤ: chỉ DỮ LIỆU: js/data/stories/con_cai.js khoảng 12 chặng phủ 5 điểm quyết định (mỗi điểm 2 đến 3 lựa chọn, có 1 vòng quay ở "nổi loạn" hoặc "thừa kế", yếu tố rel cha mẹ-con), thai kỳ (1 chặng, rủi ro kể gián tiếp), con gặp nạn hoặc thành danh (hậu quả trễ của giáo dưỡng, ít nhất 2). Bổ sung D.EPITAPH (khoảng 40 mảnh câu theo kết cục, tính cách cuối, chuyện lớn) để ghép dòng bia mộ.
Kiểm: story-lint sạch; run-tests lọc "con|9C"; life-sim 101-103 với 120 năm, ghi đời nào có con, kết đời ra sao. Ghi "9C-d đã làm". Push. Sau phiên này là Cổng chơi thử 7: báo tôi chơi thử một đời đầy đủ.
```

## N1, N2. Haiku: gói nội dung tuyến (sau Cổng 7)

```
Repo: Phongxuan123/tu-tien. Gắn repo, làm theo dòng "Mọi phiên" ở đầu mục Đợt 9 trong ke-hoach/PROMPT-phien-moi.md.
Gói: N1 = T1 Tán tu, T2 Đệ tử tông, T5 Thương nhân, tuyến thế giới W1 (làng bị phá). N2 = T3 Đan sư, T9 Báo thù, chuỗi Nhẫn (chuyển từ sự kiện cũ c.ring, Q 14.3), tuyến thế giới W3. (Ghi gói đang làm ở dòng đầu khi dán prompt.)
Đọc: Q mục 11.0 và đúng mục con của từng tuyến trong gói (grep tên tuyến), 12 (tuyến thế giới tương ứng), 7.5 (ví dụ vòng quay), 13.3 (dàn nhân vật); js/data/story.js (hướng dẫn, khóa fx và điều kiện, gồm bond và kid); mẫu bb_a.js, dao_lu.js.
NHIỆM VỤ: chỉ DỮ LIỆU, mỗi tuyến một tệp js/data/stories/<id>.js, 4 đến 6 chặng, 1 vòng quay ở chặng cuối, ít nhất 2 hậu quả trễ, khóa mềm theo tính cách, điều kiện mở theo nghề/đạo/tông/vùng sẵn có (đọc tên trường trong js/data/jobs.js, paths.js, sects.js khi cần); 60 đến 70% chặng mở từ Luyện Khí trung kỳ trở xuống. Tuyến thế giới mở khi biến cố thế giới tương ứng xảy ra (đọc tên sự kiện/cú sốc trong js/data/eco.js hoặc natevents.js; nếu chưa có móc phù hợp thì mở theo điều kiện vùng + xác suất thấp và ghi chú để phiên hoàn thiện nối).
Kiểm: story-lint sạch; run-tests lọc "Truyện"; life-sim 101-103 (đếm số hộp truyện mỗi đời, mục tiêu tăng rõ so với trước gói; nhịp dưới 6 hộp/phút). Ghi "N1 đã làm" (hoặc N2) vào Z mục 7b. Push.
```
