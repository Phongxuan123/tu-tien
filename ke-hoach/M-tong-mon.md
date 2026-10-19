# Thiết kế lại Tông môn (một trụ cột của thế giới)

- Trạng thái: Đang làm. M1, M2, M3, M5a và M7 đã code (2026-10-17); M4 (chính trị nội bộ) hoãn theo ý bạn; liên tông (M5b) đã làm ở S8 (2026-10-19), M6 (lập tông, làm chưởng môn) chờ
- Ngày bắt đầu: 2026-10-16
- Liên quan: `js/data/sects.js`, `js/systems/sect.js`, `js/ui/sect.js`, `js/systems/factions.js` (tông là thế lực kind "tong"), F-hoan-thien-the-gioi.md (F2 nghĩa vụ giữa các thế lực), I-cong-trinh.md (I4/I5: sơn môn, kho cống hiến, hội sở trong phố), A-nhiem-vu.md, B-nghe-nghiep.md, C-nga-re.md

## 1. Yêu cầu của bạn
"Thiết kế lại một trong những trọng tâm chính của thế giới là tông môn."

Hiểu: tông môn phải là xương sống của thế giới tu tiên (nơi sinh ra sức mạnh, nghề, công pháp, chính trị, chiến tranh), chứ không chỉ là "một cái bảng thăng chức".

## 2. Hiện trạng (đọc code ngày 2026-10-16)
- 9 tông môn, mỗi vùng một tông, id tông là id địa điểm. Mỗi tông có tên, chính/tà/trung, thuộc tính hợp, ngưỡng tư chất, mô tả.
- Thành viên: `c.sect = {id, rank, contrib, total, since}`; 5 bậc (ngoại môn, nội môn, chân truyền, trưởng lão, chưởng môn).
- Việc làm trong tông: hành động tháng "nhiệm vụ tông môn" tự chạy, cộng cống hiến và một ít tiền, 3% bị thương. Mọi nhiệm vụ giống nhau.
- Quyền lợi: tu luyện nhanh thêm theo bậc, +2% đột phá mỗi bậc, bổng lộc năm, kho cống hiến (4 món cố định + bí kíp hợp hệ), đại trận truyền tống cho trưởng lão.
- Chính trị: trưởng lão tối đa 3, chưởng môn kế vị theo cảnh giới, tông có thể bị diệt (thành tán tu). Tông tham chiến qua hệ thế lực (`factions.js`: sức mạnh, đoàn kết, quan hệ, chiến tranh).
- Giao diện: một tab "Tông môn" (cống hiến, thăng chức, kho), khối nhỏ ở thông tin địa điểm. Chưa có công trình riêng trong phố.

**Chỗ trống lớn:**
1. Các tông giống nhau về cơ chế (chỉ khác tên, hệ, mô tả). Không có bản sắc: công pháp độc môn, nghề sở trường, luật lệ, cấm kỵ.
2. Không có cấu trúc nội bộ: không có đường/phong (Chấp pháp, Dược, Luyện khí, Tàng kinh, Chiến...). Mọi đệ tử làm cùng một việc.
3. Vòng đời đệ tử mỏng: không có thi tuyển, thử luyện, đại bỉ, sư phụ nội môn, huynh đệ đồng môn.
4. Nhiệm vụ tông là một nút tự chạy, không có lựa chọn, rủi ro, câu chuyện.
5. Chính trị nội bộ gần như không có: phe phái, tranh ngôi, nội gián, phản đồ, trục xuất có lý do.
6. Tông không có tài nguyên riêng (linh mạch, mỏ, kho, nguồn thu thuế), nên sức mạnh chỉ là một con số.
7. Quan hệ liên tông chỉ qua chỉ số thiện cảm; chưa có minh ước, giải đấu liên tông, tranh linh mạch, đại chiến có hậu quả (F2, F3).
8. Người chơi chỉ có hai đường: vào làm đệ tử hoặc tán tu. Không có khách khanh, không có lập tông, không có làm chưởng môn thật sự.

## 3. Đề xuất thiết kế
**Nguyên tắc:** NPC và người chơi dùng chung hệ thống (như hiện nay); số liệu để ở `D.SECTS` và `D.SECT_RULES` cho dễ chỉnh; không đổi `TT.VERSION` (trường mới khởi tạo muộn); giữ nhịp hỏi người chơi ≤ 6 lần/phút.

### 3.1 Bản sắc và đạo thống
Mỗi tông có thêm:
- **Tôn chỉ** (một câu) và **sở trường**: một nghề lõi (luyện đan, luyện khí, trận pháp, ngự thú...), một hệ công pháp độc môn có bí kíp chỉ tông đó bán.
- **Luật lệ và cấm kỵ**: ví dụ Bách Thảo Môn cấm giết người vô cớ; Âm Hồn Giáo không cấm gì nhưng ghét kẻ phản; Kim Phong Môn trọng thắng thua. Vi phạm có hậu quả (phạt cống hiến, giam, trục xuất).
- **Truyền thống**: lễ thu đồ (mỗi 4 năm), đại bỉ (mỗi 5 năm), ngày giỗ tổ sư.
- **Tuyệt học theo bậc:** chân truyền mới được học tuyệt học (công pháp hoặc kỹ năng đặc trưng, không đổi được).

### 3.2 Cấu trúc nội bộ: các đường
Mỗi tông chia 4 đường, đệ tử chọn một khi lên nội môn (đổi được, có phí): **Chấp pháp** (chiến đấu, trấn áp, hộ vệ), **Dược/Luyện** (nghề, vật liệu), **Tàng kinh** (công pháp, ngộ đạo, tin tức), **Ngoại vụ** (buôn bán, ngoại giao, thu thập tin, đi vùng khác). Mỗi đường có nhiệm vụ riêng, thưởng riêng, người đứng đầu riêng (trưởng lão phụ trách).

### 3.3 Nhiệm vụ tông môn thật sự
Thay nút tự chạy bằng **bảng nhiệm vụ tông** (nhận, làm, báo cáo): có độ khó, rủi ro, thời hạn; một số là chuỗi ngắn có lựa chọn (tuần tra, đòi nợ, hộ tống thương đoàn, dò hầm mộ, trị bệnh dịch, giải cứu, tranh mỏ). Dùng chung hệ nhiệm vụ A (loại "tông"), có chế độ Tự động cho người chơi muốn thả trôi.

### 3.4 Vòng đời đệ tử
- **Thi tuyển** (hiện là kiểm tra tư chất) + **thử luyện nhập môn**.
- **Sư phụ nội môn:** nội môn trở lên được trưởng lão hoặc chân truyền nhận làm đồ đệ (nối hệ gia đình/sư đồ đã có); có huynh đệ đồng môn (thiện cảm khởi điểm).
- **Đại bỉ 5 năm một lần:** xếp hạng nội bộ, thắng được thưởng và cơ hội lên bậc; người chơi tự quyết dự thi hay không.
- **Thăng bậc** vẫn theo cảnh giới và cống hiến nhưng thêm điều kiện khác nhau theo tông (một tông đòi thắng đại bỉ, một tông đòi lập công ngoại vụ...).

### 3.5 Chính trị nội bộ
- Mỗi tông có 2 đến 3 **phe** (bảo thủ, cấp tiến, thân triều...) do trưởng lão cầm đầu; đệ tử có thể nghiêng về phe nào.
- Sự kiện: tranh ngôi chưởng môn (hiện chỉ so cảnh giới), nội gián của tông khác, phản đồ, vụ án nội bộ, kẻ ngầm thông tà đạo. Người chơi có thể tham gia, tố giác hoặc làm ngơ (nhịp quyết định tầng 2 hoặc 3).
- Trục xuất và truy sát phản đồ có chuỗi hệ quả với đồng môn.

### 3.6 Kinh tế và tài nguyên của tông
Mỗi tông có **linh mạch, mỏ, kho, đệ tử đóng thuế, cống nạp cho vương triều** (nối F2 và kinh tế E). Tài nguyên quyết định: số đệ tử nuôi được, chất lượng kho cống hiến (giá và loại hàng), khả năng chiến tranh. Tông nghèo thì kho thiếu, đệ tử bỏ đi.

### 3.7 Liên tông và thế giới
- Minh ước, liên minh chính đạo, cấm vận nhau, tranh linh mạch, **giải đấu liên tông** (4 hoặc 10 năm), đại chiến có hậu quả (diệt tông, sáp nhập, đệ tử tản mác thành tán tu có tổ chức).
- Nối với Nhật báo (G): tin chiến tranh, đại bỉ, thay chưởng môn.

### 3.8 Người chơi có nhiều đường
Gia nhập (qua thi tuyển hoặc tiến cử); **khách khanh** (không bậc, không bó buộc, có công thì được thưởng); **nằm vùng** cho tông khác; **phản bội** (mang bí kíp đi, có truy sát); **lập tông riêng** khi đủ cảnh giới và của cải (nhận đồ đệ, xây sơn môn, nuôi tông qua các năm, đệ tử NPC là con cháu và đồ đệ); **làm chưởng môn** có màn hình quản lý (ngân sách, nhận đồ đệ, phái người, đối ngoại).

### 3.9 Giao diện
- Tab "Tông môn" mở rộng thành các mục: Tổng quan, Nhiệm vụ, Đồng môn (sư phụ, huynh đệ, đệ tử mình dạy), Kho và tuyệt học, Chính sự (phe phái, luật lệ), Liên tông (bản đồ quan hệ).
- Khi ở tông môn, phố công trình (I4/I5) có: Sơn môn, Chấp pháp đường, Dược đường, Tàng kinh các, Kho cống hiến, Đài đại bỉ, Điện chưởng môn. Mỗi nhà là một dịch vụ.

## 4. Kỹ thuật (dự kiến)
- Dữ liệu: mở rộng `D.SECTS` (tôn chỉ, sở trường, luật, đường, tuyệt học, truyền thống); thêm `D.SECT_ROLES` (đường), `D.SECT_EVENTS`.
- Hệ thống: tách `sect.js` thành các phần (đệ tử, nhiệm vụ, chính trị, tài nguyên); `c.sect` thêm `line` (đường), `master` (sư phụ), `faction` (phe), `merit`; tông (thế lực) thêm `res` (tài nguyên), `rules`, `fac` (phe).
- Nhiệm vụ: loại "tông" trong `quests.js`; đại bỉ và thi tuyển là sự kiện có lịch (`TT.sect.yearly`).
- Lưu: trường mới khởi tạo lười, không đổi `TT.VERSION`.
- Kiểm thử: kịch bản thi tuyển, thăng bậc, đại bỉ, tranh ngôi, diệt tông; đo cân bằng bằng sim (tỉ lệ đạt Trúc Cơ không tăng quá mức, nhịp hỏi ≤ 6/phút).

## 5. Các chặng (đề xuất, chờ bạn chọn thứ tự)
- [x] M1: bản sắc và đạo thống (tôn chỉ, luật, tuyệt học) + bốn đường nội bộ (chưa làm "sở trường nghề" riêng từng tông)
- [x] M2: bảng nhiệm vụ tông (12 loại việc, 4 đường) + thử luyện nhập môn xuất sắc (thi tuyển giữ như cổng hiện có)
- [x] M3: sư phụ nội môn, danh sách đồng môn, đại bỉ 5 năm một lần
- [ ] M4: chính trị nội bộ: phe phái, tranh ngôi, nội gián, phản đồ (HOÃN, làm sau theo ý bạn)
- [x] M5a: tài nguyên tông (linh mạch, mỏ, kho, cống nạp, chiếm mỏ khi thắng, quyên góp)`n- [x] M5b: liên tông (minh ước, giải đấu liên tông, đại chiến có hậu quả; nối F2, F3), đã làm ở S8 (2026-10-19; S mục 15.20)
- [ ] M6: người chơi: khách khanh, nằm vùng, phản bội, lập tông, làm chưởng môn
- [x] M7: phố tông môn chín công trình đã gắn vào game, nút hành động dời từ tab sang công trình, tab thành "Thẻ đệ tử" (2026-10-17)
- [ ] Kiểm thử, đo cân bằng, chơi thử máy tính và điện thoại, ghi KE-HOACH.md, snapshot

## 6. Cần bạn chốt
1. **Thứ tự và độ sâu.** Mình đề nghị M1 → M2 → M3 trước (tông có bản sắc, việc làm có chất, đệ tử có đời), rồi M4, M7, sau cùng M5, M6. Bạn muốn khác thứ tự không?
2. **Số tông.** Giữ 9 (mỗi vùng một tông) hay mỗi vùng thêm một tông nhỏ (khoảng 18) để có cạnh tranh trong cùng vùng? Mình nghiêng về thêm tông nhỏ ở vùng lớn (Trung Châu, Đông Hải) sau khi M1 xong.
3. **Người chơi lập tông hoặc làm chưởng môn:** là mục tiêu cuối game (M6) hay muốn có sớm?
4. **Đại bỉ và thi tuyển:** để người chơi tự tay chọn từng bước (nhiều lựa chọn) hay chủ yếu tự chạy, chỉ hỏi ở các mốc lớn (như nhịp hiện tại)?
5. **Tà đạo:** tông tà (Âm Hồn Giáo) có luật và con đường riêng (luyện hồn, hiến tế) hay chỉ khác thiên hướng như bây giờ?
6. Có muốn một **demo bên ngoài** (như nhật ký và hồ sơ) cho tab Tông môn mới và sơ đồ cấu trúc một tông trước khi code?

## 7. Nhật ký làm việc
- 2026-10-16: đọc code hiện trạng, viết kế hoạch, chưa code.

- 2026-10-17: bạn bảo làm (chốt theo đề nghị: M1 đến M3 trước, giữ 9 tông, tự chạy ở mốc lớn). CODE: js/data/sects.js (motto, luật D.SECT_LAWS, tuyệt học, D.SECT_LINES bốn đường, D.SECT_TASKS 12 việc, D.SECT_BI), js/systems/sect.js (trial, ensure, mission có đường và tuyệt học, setLine, bảng việc ensureBoard/acceptTask/taskStep, ensureMaster, luật trong yearly, đại bỉ worldYearly/daiBi/daiBiPlayer, autoManage), js/data/sectevents.js (sect_dai_bi thay sect_dau_dai), js/systems/auto.js, js/systems/world.js (lastYContrib, gọi worldYearly), js/ui/sect.js (tab năm mục).
- Quy tắc đã chốt khi code: bốn đường chọn từ nội môn (lần đầu miễn phí, đổi tốn 20 cống hiến, chờ 24 tháng); việc trên bảng chỉ tiến triển khi hành động Kiếm sống, có việc thì việc vặt còn 40%; việc làm xong trả khoảng 1,5 lần việc vặt cùng thời gian; luật tông: cảnh cáo, phạt 20% cống hiến, trục xuất (luật 'lao' chỉ phạt hằng năm, không đuổi); tuyệt học mở ở chân truyền; sư phụ chỉ cộng 3% tu luyện cho người chơi; đại bỉ mỗi tông lệch pha theo tên, phần thưởng NPC giảm một nửa để không đẩy nhanh thăng tiến NPC.
- Lưu ý kiểm thử: bài 'Ngã rẽ: đổi đường...' phụ thuộc hạt giống (cần tư chất cao), đổi từ 133 sang 140 vì thế giới sinh khác sau khi đổi hệ tông.

- 2026-10-17: bạn bảo hoãn chính trị nội bộ, đưa tài nguyên lên làm. CODE M5a: D.SECT_RES và trường mach/mo cho 9 tông (js/data/sects.js); sect.res/resState/resYearly/spoils/donate/priceMul/stipendMul (js/systems/sect.js); factions.tickInternal gọi resYearly, endWar gọi spoils; canJoin chặn người chơi khi kho cạn (trừ mùa tuyển); bổng lộc và giá kho cống hiến theo kho; linh mạch cộng tu luyện cho người chơi (2% mỗi bậc trên 1); chưởng môn thu thuế hoặc chiêu mộ ảnh hưởng kho và thế lực; tab Tông môn: khối Tài nguyên tông, mục Kho có quyên góp (1 hạ phẩm = 3 cống hiến, trần 120 mỗi năm).
- Kho tông dùng luôn chỉ số wealth (0-100) của thế lực nên không thêm lưu trữ mới. Đại bỉ cho người chơi giờ thưa hỏi theo tốc độ thời gian (như sự kiện thường), không hỏi thì tự lên đài nếu đủ sức, để nhịp hỏi giữ dưới 6 lần mỗi phút.

## 9. M7: asset phố tông môn và vai trò mới của tab Tông môn (2026-10-17)
Bạn hỏi: nếu bấm vào công trình đã có hết thông tin thì tab Tông môn còn tác dụng gì? Trả lời và đề xuất chia vai:
- **Công trình = nơi làm việc** (phải đứng ở tông): nhận và bỏ việc, chọn và đổi đường, thăng bậc, đổi đồ, quyên góp, đọc luật và nộp phạt, đăng ký đại bỉ, đặt chuyến vượt vùng bằng trận đài.
- **Tab Tông môn = "Thẻ đệ tử", xem từ xa, không có nút hành động**: thân phận, bậc và tiến độ lên bậc, cống hiến, việc đang làm (bấm để nhảy tới công trình), nhắc việc (cảnh cáo, đại bỉ sắp tới), tuyệt học đang có, sư phụ, tài nguyên và tình hình tông, danh sách các tông bạn biết (cho người chưa vào tông), và mục Vượt vùng (khóa/mở, điều kiện còn thiếu) để lên kế hoạch khi đang ở xa.
- Hiện tab đang chứa cả nút hành động (nhận việc, đổi đồ...) lẫn thông tin, nên trùng với công trình. Khi gắn phố tông môn sẽ dời các nút hành động sang công trình, tab giữ phần theo dõi.

Asset đã vẽ (chưa gắn vào game): Sơn môn (đã có), Chấp pháp đường, Dược đường, Tàng kinh các (gác ba tầng), Ngoại vụ đường, Điện chưởng môn, Kho cống hiến (đã có), Trận đài truyền tống (hai trụ, cổng xoáy xanh ngọc, bệ có rune), Đài đại bỉ (bệ có hàng rào, hai cờ đỏ xanh). Xem ở `asset-tongmon.html` (có chuyển động, rê chuột để làm nổi, phố ví dụ hai trang, bảng việc nào làm ở đâu). Mã: `js/ui/bldart.js` (id chap, duoc, tang, ngoai, dien, tran, bi, cờ `sect: true`).
Chờ bạn góp ý hình. Đồng ý thì bước tiếp: đưa vào `D.PLACE_BLD.tong_mon`, viết dịch vụ cho từng nhà, dời nút từ tab sang, đổi tab thành Thẻ đệ tử, thêm kiểm thử.
## 10. M7 đã gắn vào game (2026-10-17)
- `D.PLACE_BLD.tong_mon` = sơn môn, chấp pháp, dược, tàng kinh, ngoại vụ, điện chưởng môn, kho cống hiến, trận đài, đài đại bỉ (hai trang trong phố: 6 + 3).
- Dịch vụ từng nhà (js/systems/buildings.js, hàm sectService): Sơn môn (thông tin tông, xin gia nhập, rời tông có xác nhận); bốn nhà của bốn đường (theo hoặc đổi đường, nhận việc của đường đó, bỏ dở việc; Chấp pháp thêm nộp phạt xóa một lần cảnh cáo, 40 cống hiến); Điện chưởng môn (lãnh đạo, sư phụ, xin thăng bậc ngay); Kho cống hiến (quyên góp, đổi đồ, giá theo kho tông); Trận đài (đặt chuyến vượt vùng bằng đại trận, có xác nhận); Đài đại bỉ (đếm ngược, kỳ gần nhất). Người ngoài chỉ vào được Sơn môn.
- Tab Tông môn thành "Thẻ đệ tử": bỏ nút nhận việc, đổi đường, rời tông, quyên góp, đổi đồ (mục Kho bỏ hẳn); giữ thân phận, tiến độ lên bậc, tài nguyên tông, việc đang làm, đồng môn, luật và tuyệt học, và mục Vượt vùng (vẫn đặt chuyến được ở đây để thống nhất một chỗ cho mọi lối đi).
- Chế độ Tự động vẫn tự nhận việc và chọn đường như cũ (không phải bước vào nhà).
- Kỹ thuật: `js/data/buildings.js`, `js/systems/buildings.js` (sectService), `js/systems/sect.js` (payFine, petitionPromote), `js/ui/shop.js` (cờ confirm cho nút), `js/ui/sect.js`, `js/ui/bldart.js`; kiểm thử "Phố tông môn".