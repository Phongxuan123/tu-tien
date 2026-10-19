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
