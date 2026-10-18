# T. Tông môn "hiện đại" theo nguyên mẫu quốc gia thật, và hệ thống Tôn giáo

- Trạng thái: Chờ duyệt (mới có kế hoạch, chưa code)
- Ngày lập: 2026-10-18
- Liên quan: [M-tong-mon](M-tong-mon.md) (tông môn: bản sắc, đường, luật, tài nguyên), [S-quoc-gia](S-quoc-gia.md) (quốc vận, nho khí, quân đội, mạng quan hệ), [P-nghia-vu-dan-so](P-nghia-vu-dan-so.md) (dân số, hiệp ước), [E-kinh-te](E-kinh-te.md), [G-nhat-bao](G-nhat-bao.md), [Q-cot-truyen](Q-cot-truyen.md), [R-nhan-duyen](R-nhan-duyen.md), `js/data/sects.js`, `js/systems/sect.js`, `js/systems/factions.js`

## 1. Yêu cầu của bạn
1. Các tông môn có **tính hiện đại hơn**.
2. Lấy **nguyên mẫu từ một số quốc gia tiêu biểu có thật ngoài đời**, và **không có quốc gia nào thuần thiện hay thuần ác**.
3. Phát triển thêm một hệ thống đi kèm là **tôn giáo**.

**Cách mình hiểu (mặc định, bạn chỉnh ở mục 9):**
- "Hiện đại hơn" là về **tổ chức, thể chế, kinh tế, thông tin, ngoại giao** của tông (một tông giống một "quốc gia thu nhỏ" có bộ máy, chính sách, lợi ích), còn thẩm mỹ vẫn là tu tiên cổ trang. Không thêm xe, súng, điện thoại.
- Nguyên mẫu quốc gia chỉ là **kim chỉ nam để thiết kế**. Trong game, tên, văn bản, sự kiện đều là nội dung gốc, tên giả, không chép tên hay sự kiện thời sự thật, không gắn nhãn xấu hay tốt cho một nước thật. Mỗi nguyên mẫu chỉ lấy **đặc điểm cấu trúc** (cách tổ chức, thế mạnh, điểm yếu), và luôn có đủ cả hai mặt.

## 2. Hiện trạng (đọc code `sects.js`, `sect.js`, `factions.js`)
- 9 tông, mỗi tông có `align`: `chinh` (chính đạo), `trung` (trung lập), `ta` (tà đạo). 5 tông chính, 3 tông trung, 1 tông tà (Âm Hồn Giáo).
- `align` được dùng ở: điều kiện gia nhập (`sect.js` dòng 38-40), cộng trừ điểm thiên hướng (dòng 112), trục xuất vì "hành vi tà ác" hay "nghi là người chính đạo" (dòng 295-304), tag của thế lực (`factions.js`), tính quan hệ (cùng tag +10, khác tag -22, chính tà đối nghịch).
- Mỗi tông đã có tôn chỉ, luật tông, tuyệt học, 4 đường (M1).
- **Vấn đề:** thang chính/tà một chiều khiến Âm Hồn Giáo là "ác" còn năm tông chính là "thiện" ngay từ đầu. Tông chỉ khác nhau ở thuộc tính ngũ hành và vài hệ số nhỏ. Chưa có thể chế, kinh tế, đối ngoại, thông tin, tín ngưỡng của riêng tông.

## 3. Thiết kế: tông môn hiện đại hóa

### 3.1 Thay thang "chính–tà" bằng nhiều trục giá trị
Mỗi tông có `gt` (giá trị), 5 trục từ -100 đến 100:
| Trục | Hai đầu |
|---|---|
| `tu` Trật tự và tự do | Tập quyền, kỷ luật ⟷ Tự do, phân quyền |
| `ca` Tập thể và cá nhân | Cộng đồng trên hết ⟷ Cá nhân trên hết |
| `doi` Truyền thống và đổi mới | Giữ nếp cũ ⟷ Thử cái mới, nghiên cứu |
| `mo` Mở cửa và khép kín | Đón người ngoài, thương mại ⟷ Biệt lập, tự lực |
| `tin` Thế tục và tín ngưỡng | Lý trí, thực dụng ⟷ Thần quyền, tâm linh |

Thêm một trục **hành vi** `nhan` (nhân đạo ⟷ tàn nhẫn), nhưng nó **không gán nhãn** cho tông; nó **thay đổi theo việc tông làm** (thanh trừng, nô dịch, cứu trợ, tàn sát, giúp dân), và hiển thị bằng lời mô tả công-tội ở 3.3. Một tông có thể có hành vi tốt hôm nay và xấu mai.

**Với người chơi và NPC:** thiên hướng `rep.chinh` được giữ (một chiều, cho nhật ký) nhưng thêm hồ sơ giá trị `gt` hình thành từ lựa chọn (cùng 5 trục). Tông nhận hay đuổi người dựa vào **độ hợp giá trị** thay vì chính/tà:
- Hợp: gia nhập dễ, thiện cảm sẵn, đồng môn mến.
- Lệch ít: bị để ý, nhiệm vụ nhạy cảm không giao.
- Lệch nhiều: không gia nhập, hoặc nằm trong diện bị nghi (nằm vùng) và bị trục xuất khi lộ.

**Tương thích:** `align` cũ vẫn tồn tại như **nhãn suy ra** (tính từ `gt`) để code và kiểm thử cũ chạy; chuyển dần mọi chỗ dùng `align` sang `gt` trong chặng T1. Quan hệ giữa hai thế lực (S1) dùng chiều `dao` tính từ độ gần của hai bộ `gt`.

### 3.2 Chỉ số đa chiều và thể chế: mỗi tông như một "quốc gia thu nhỏ"
Mỗi tông có 7 chỉ số (0-100), `power` cũ được **suy ra** từ đây (có hệ số bù để giữ cân bằng, như S 3.9):
| Chỉ số | Ý nghĩa |
|---|---|
| `kt` Kinh tế | Của cải, tài nguyên, thương mại |
| `qs` Quân sự | Lực lượng chiến đấu, trận pháp |
| `kh` Khoa học pháp thuật | Nghiên cứu, luyện đan, luyện khí, công pháp mới |
| `vh` Văn hóa mềm | Uy tín, sức hút, ảnh hưởng tư tưởng |
| `ng` Ngoại giao | Liên minh, mạng lưới, đàm phán |
| `on` Ổn định nội bộ | Đoàn kết, ít phe phái, thấp thì dễ nổi loạn (nối M4 hoãn) |
| `tt` Thông tin | Tình báo, truyền thông, kiểm soát tin đồn |

Năm **chính sách** (mỗi cái chọn một, đổi hiếm và đắt, có hậu quả dài):
1. **Thể chế:** tập quyền chưởng môn, hội đồng trưởng lão, bầu cử trong hàng ngũ, thần quyền, thế tập.
2. **Kinh tế:** kế hoạch, thị trường tự do, hỗn hợp, tự lực khép kín, dựa tài nguyên.
3. **Quân sự:** thường trực tinh nhuệ, nghĩa vụ toàn tông, thuê ngoài, chỉ phòng thủ.
4. **Đối ngoại:** bành trướng, liên minh, trung lập, cô lập, buôn bán.
5. **Nhân tài:** thi tuyển, huyết thống, mở cửa, bảo lãnh và tiến cử.

Chính sách thay các `law` hiện có (cảnh cáo, phạt, trục xuất) ở chỗ: `law` vẫn là luật ứng xử của đệ tử, còn chính sách là đường lối của cả tông. Chúng quyết định hệ số cho nhiệm vụ, tuyển người, đường lên chức, chi phí, đối ngoại.

**Bộ máy hiện đại của tông** (đặt tên lại và thêm thân thể cho 4 đường M1, không phá chúng):
| Đường cũ | Cơ quan hiện đại hơn | Thêm |
|---|---|---|
| Chấp pháp | An ninh và Pháp chế | Điều tra, tòa nội bộ, giám sát (nối `tt`) |
| Dược/Luyện | Viện Nghiên cứu và Sản xuất | Đề tài, bằng sáng chế (công pháp mới), nhà xưởng |
| Tàng kinh | Học viện và Thư khố | Đào tạo, tuyển chọn, kiểm duyệt hay cởi mở |
| Ngoại vụ | Ngoại giao và Thương vụ | Đại sứ, thương hội, tình báo ngoại |
Thêm hai cơ quan nhỏ: **Kinh tài** (kho, thuế, quyên góp, nợ) và **Truyền thông** (bảng tin tông, tin ra Nhật báo G). Mỗi cơ quan là một công trình trong phố tông môn (M7), có dịch vụ thật.

### 3.3 Nguyên mẫu quốc gia cho chín tông (đề xuất)
Bảng dưới là **cảm hứng thiết kế** cho chín tông hiện có; tên và chi tiết trong game là nội dung gốc. Mỗi dòng nêu **thế mạnh**, **điểm yếu cấu trúc**, và **tình thế khó xử** (nơi tông phải chọn giữa lợi ích và nguyên tắc). Không dòng nào toàn thiện hay toàn ác.

| Tông | Nguyên mẫu gợi ý | Thế mạnh | Điểm yếu cấu trúc | Tình thế khó xử |
|---|---|---|---|---|
| Thanh Vân Tông (Trung Châu) | Quốc gia tập quyền, quan liêu, thi cử lâu đời (kiểu Trung Hoa) | Quy hoạch dài hạn, hạ tầng, tuyển người đông, ổn định | Kiểm soát thông tin, áp lực đồng thuận, nhồi khuôn | Giữ ổn định thì phải hạn chế tiếng nói trái chiều |
| Thủy Nguyệt Cung (Đông Hải) | Đảo quốc tinh xảo, trọng truyền thống và kỷ luật tập thể (kiểu Nhật Bản) | Chế tác tinh xảo, hải quân, lễ nghi, đoàn kết | Bảo thủ, áp lực tập thể, ít người trẻ, khép với người ngoài | Giữ nếp cũ hay mở cửa để nhận người |
| Kim Phong Môn (Tây Thiên Sơn) | Cường quốc kỹ nghệ, kỷ luật, quy trình (kiểu Phổ/Đức) | Kỹ thuật, trận pháp, kỷ luật, pháp quyền | Quan liêu cứng, nặng ký ức một thời dùng trật tự gây họa | Hiệu quả quân sự đối lại thận trọng đạo đức |
| Bách Thảo Môn (Nam Lâm) | Quốc gia đông dân, đa dạng, mạnh y dược và học thuật (kiểu Ấn Độ) | Y dược, nhân tài đông, nhiều trường phái, dân chủ rộng | Phân tầng đẳng cấp, bất bình đẳng, thủ tục chậm | Cứu người đại trà hay giữ thứ bậc cũ |
| Huyền Băng Cung (Bắc Cực) | Cường quốc rộng lớn, nhiều tài nguyên, khắc nghiệt (kiểu Nga) | Tài nguyên, bền bỉ, quân sự, khoa học cơ bản | Quyền lực tập trung, tham nhũng, phụ thuộc xuất khẩu tài nguyên | Giữ ảnh hưởng bằng sức mạnh hay bằng thỏa thuận |
| Liệt Hỏa Tông (Hỏa Diệm Sơn) | Cường quốc công nghiệp, cá nhân chủ nghĩa, đổi mới (kiểu Mỹ) | Hút nhân tài khắp nơi, đổi mới, doanh nghiệp, sức mạnh mềm | Bất bình đẳng, chia rẽ nội bộ, hay can thiệp xa | Tự do kinh doanh đối lại công bằng; có nên can thiệp |
| Nhật Luân Giáo (Hoang Mạc) | Các nhà nước sa mạc thần quyền, văn minh cổ, tài nguyên quý (kiểu Iran, vùng Vịnh) | Học thuật cổ, hiếu khách, tài nguyên linh thạch, tôn ti vững | Hạn chế tự do tư tưởng, phụ thuộc xuất khẩu tài nguyên | Giữ giáo lý hay cho phép cải cách |
| Âm Hồn Giáo (Vụ Trạch) | Nhà nước khép kín, quân sự hóa, tự lực (kiểu Triều Tiên) | Đoàn kết cực cao, chịu đựng, tự lực, nghi lễ tưởng niệm sâu | Cô lập, đàn áp, thiếu thốn, khó đổi mới | Sống còn đối lại tự do và nhân quyền của đệ tử |
| Tử Lôi Quan (Lôi Đảo) | Đảo quốc nhỏ, pháp trị nghiêm, hiệu quả (kiểu Singapore) | Pháp quyền, thương mại, hành chính sạch, kỷ luật | Hạn chế tự do tranh luận, đắt đỏ, phụ thuộc bên ngoài | Trật tự đối lại tự do |

**Nguyên tắc cân bằng đạo đức:**
- Mỗi tông có **sổ Công–Tội** (`cong`, `toi`): 3 điều đáng khen và 3 điều đáng chê, cộng 1 **bí mật** (một vết nhơ hay một việc tốt chưa ai biết, lộ ra qua tin tức hoặc nhiệm vụ). Người chơi không thấy hết từ đầu; phải trải nghiệm.
- Hiện thực hóa **Âm Hồn Giáo** không còn là "tà đạo mặc định": trong sổ Công có thật (che chở kẻ bị bỏ rơi, tưởng niệm tử sĩ), sổ Tội cũng có thật (luyện hồn, đàn áp). Tông chính đạo cũ cũng có Tội thật (ví dụ Thanh Vân đàn áp tiếng nói lạ, Kim Phong thờ quy trình hơn con người).
- **Sự kiện nghịch lý** của từng tông: mỗi tông có 4 đến 6 sự kiện khi nó đứng trước tình thế khó xử ở bảng trên; lựa chọn của tông (NPC) hoặc của người chơi (nếu đủ bậc) đổi `gt`, `nhan` và các chỉ số.

### 3.4 Các nguyên mẫu mở rộng (không bắt buộc)
- **8 gia tộc:** có thể dùng nguyên mẫu "gia tộc tài phiệt", "dòng tộc thương gia", "thế gia học thuật".
- **3 thương hội:** gợi ý các đô thị thương mại cổ.
- **9 vương triều (S):** bản sắc ở S mục 3.5 có thể đồng bộ với bảng trên khi làm.
- Nguyên mẫu **có thể đổi** (ví dụ thêm Việt Nam, Pháp, Brazil, Israel, Anh...). Bạn chọn ở mục 9.

## 4. Tôn giáo: hệ thống đi kèm

### 4.1 Nguyên tắc
- Tôn giáo là **lớp phủ** lên mọi thế lực, vùng và người, không thay thế tông môn. Một tông có thể có quốc giáo; một vùng có nhiều tín ngưỡng sống chung.
- Mọi tôn giáo trong game là **nội dung gốc, tên giả**, gợi từ các truyền thống có thật nhưng không đại diện một tôn giáo cụ thể, không đánh giá đúng sai về niềm tin thật. Mỗi tôn giáo đều có **mặt sáng** và **mặt tối**, cũng như quốc gia ở trên.
- Giữ nguyên tắc: **cấp năm, rẻ, tất định theo hạt giống**, lưu bằng trường khởi tạo muộn (không đổi `TT.VERSION`).

### 4.2 Bảy tín ngưỡng khởi đầu (đề xuất)
| Tín ngưỡng | Giáo lý lõi | Mặt sáng | Mặt tối | Hợp với |
|---|---|---|---|---|
| **Thiên Đạo giáo** | Thuận theo tự nhiên, vô vi, tu dưỡng bản thân | Bình an, giảm tâm ma, khuyến khích tu | Dễ thờ ơ trước khổ nạn xã hội | Thủy Nguyệt, Huyền Băng |
| **Giác Ngộ giáo** | Từ bi, nghiệp báo, luân hồi | Giảm nghiệp, cứu khổ, nối hệ đầu thai | Thụ động, chùa chiền giàu, giáo sĩ hư danh | Bách Thảo, dân phàm |
| **Quang Minh giáo** | Một đấng tối cao, giáo luật, giáo hội tập quyền | Tổ chức mạnh, cứu trợ, đoàn kết | Cứng nhắc, dị giáo bị ép, thánh chiến | Nhật Luân |
| **Tổ Tiên đạo** | Hiếu kính tổ tiên, cúng giỗ, dòng tộc | Gắn kết gia tộc, nối R (nhân duyên) | Nặng huyết thống, kỳ thị người ngoài | Gia tộc, Thanh Vân |
| **Vạn Vật Linh giáo** | Thần núi, rừng, sông; thờ thiên nhiên | Bảo vệ tài nguyên, hòa hợp, hiểu yêu thú | Mê tín, cản đào mỏ, đánh nhau với tông | Bách Thảo, Nam Lâm |
| **Minh Hồn giáo** | Người sống và người chết nối nhau, tưởng niệm | Chăm sóc thân nhân người mất, thông linh | Dễ bị lợi dụng luyện hồn, bị sợ hãi | Âm Hồn |
| **Thần Chức đạo** | Thờ thần linh bản địa, hương hỏa nuôi thần | Thần tích che chở làng, đường tu "thần chức" | Thần tham hương hỏa, mê muội tín đồ | Lôi Đảo, Liệt Hỏa |
Thêm **Nho học** không tính là tôn giáo, nhưng nối với nho khí (S): lối sống thế tục có lễ nghĩa; người không theo tôn giáo nào có thể theo Nho học (xem 4.5).

### 4.3 Dữ liệu và công thức
`world.fac.faith`:
- `share[vùng][tín ngưỡng]`: tỉ lệ tín đồ, tổng mỗi vùng bằng 1.
- `church[tín ngưỡng]`: `{ luc, huong, ky, phai }` với `luc` (sức mạnh giáo hội), `huong` (hương hỏa tích lũy), `ky` (độ nghiêm giới luật), `phai` (các phái: chính thống, cải cách, cực đoan).
- Mỗi thế lực: `faith` (quốc giáo hoặc tín ngưỡng chính), `khoan` (khoan dung 0-100, nghĩa là có đàn áp tôn giáo khác hay không).

**Mỗi năm (`TT.faith.yearly`):**
```
share dịch chuyển = truyền_giáo(luc) + ủng_hộ_thế_lực(quốc giáo) + khủng_hoảng(mood thấp, thiên tai: người ta tìm đến đức tin)
                  - đàn_áp(khoan thấp) - cải_cách_thế_tục(nho khí cao, khoa học cao)
huong = tín_đồ x thành_tâm x (1 + thần_tích) - chi_nuôi_giáo_sĩ
luc   = f(tín_đồ, huong, hiệp_ước_với_triều)
```
- **Hương hỏa** nuôi: giáo sĩ, công trình, cứu trợ thiên tai (tăng dân tâm), và (với Thần Chức đạo) nuôi thần tích.
- Chu kỳ cải cách: giáo hội cực đoan hóa khi bị đàn áp, cải cách khi khoan dung cao và giáo luật cứng; có xác suất rẽ nhánh thành **phái mới** hoặc **dị giáo** (hiếm).

### 4.4 Tôn giáo làm gì trong thế giới
1. **Dân tâm và dân số (F4):** niềm tin giúp dân tâm đỡ tụt khi thiên tai; chùa chiền cứu trợ giảm tử vong; giáo hội lớn kiếm tín đồ từ vùng khủng hoảng.
2. **Thế lực (S, M):** quốc giáo cộng nhẹ `on` (ổn định) và `vh`, nhưng khoan dung thấp thì tăng nguy cơ dị giáo nổi loạn. Quan hệ giữa hai thế lực thêm chiều **đạo** (S 3.7): cùng tín ngưỡng thì thân, khác tín ngưỡng thì dè chừng, thánh chiến là lý do chiến tranh mới.
3. **Kinh tế (E):** đền chùa giàu và có đất; lễ hội tạo cầu; thuế tôn giáo là nguồn cho triều, hoặc là điểm tranh chấp.
4. **Nho khí và quốc vận (S):** nho khí cao thúc đẩy thế tục hóa, giáo hội phản ứng; quốc giáo hợp triều thì cộng quốc vận, đàn áp giáo mạnh thì trừ.
5. **Chiến tranh:** thánh chiến (đánh vì đức tin), giáo hội làm hòa giải viên hoặc cung cấp dân quân; giáo sĩ tham gia tế lễ trước trận (cộng `sat` hay quân tâm).
6. **Tin tức (G):** lễ hội lớn, thần tích, cải cách, dị giáo, thánh chiến lên Nhật báo.

### 4.5 Người chơi chạm vào tôn giáo ở đâu
- **Tín ngưỡng cá nhân:** `c.faith` và `c.tam` (mức sùng đạo): Thế tục (mặc định) / Tin sơ / Sùng đạo / Giáo sĩ. Có thể cải đạo (một lựa chọn lớn, ảnh hưởng quan hệ).
- **Giữ giới và nghi lễ:** mỗi tín ngưỡng có vài giới (ví dụ Giác Ngộ cấm sát sinh vô cớ; Tổ Tiên đạo cúng giỗ; Minh Hồn giỗ tử sĩ). Giữ giới cộng đạo tâm, giảm tâm ma, giảm nghiệp (nối `c.nghiep`); phạm giới trừ đạo tâm và bị cộng đồng xa lánh. Nghi lễ tốn thời gian và tiền, nhưng cho thiện cảm.
- **Giáo sĩ:** người đủ sùng đạo vào hàng giáo sĩ (thầy tu, tế sư, linh mục tương đương), nhận bổng, giữ đền, làm lễ, cứu trợ; thăng bậc theo công đức và hương hỏa. Giáo hội là một con đường sự nghiệp thay thế tông môn (nối B, nghề).
- **Thần chức đạo (đường tu mới, tùy chọn):** tu sĩ nhận hương hỏa từ tín đồ để thăng tu vi nhanh hơn một mức, đổi lại bị ràng buộc bởi nguyện vọng của tín đồ (nhiệm vụ) và dễ sa vào mê muội nếu tham hương hỏa. Cân bằng: tăng tốc có trần, không thay đột phá.
- **Hôn nhân khác đạo (nối R):** đạo lữ khác tín ngưỡng thì có xung đột hay hòa giải, ảnh hưởng con cái và gia tộc.
- **Sự kiện:** lễ hội, thần tích, bị dị giáo truy đuổi, cứu trợ ở chùa, tranh luận giáo lý, truy nã giáo phái, thánh chiến triệu tập (ngang với triệu tập của tông).
- **Gia nhập tông:** tông có quốc giáo thì đòi (hoặc ưu tiên) tín đồ; khác đạo thì khó nhập hơn, hoặc nhập được nếu khoan dung cao.

### 4.6 Tông môn và tôn giáo gặp nhau
- Nhật Luân Giáo: giáo hội Quang Minh; tông có hương hỏa và nhiều tín đồ ngoài đệ tử. Trục `tin` rất cao.
- Âm Hồn Giáo: gắn Minh Hồn giáo; có nghi lễ tưởng niệm sâu.
- Các tông còn lại: mỗi tông có tôn giáo chính hoặc theo thế tục (Liệt Hỏa, Tử Lôi), với `khoan` khác nhau.
- Tông thế tục mạnh (Liệt Hỏa kiểu cá nhân và đổi mới) có thể xung đột với giáo hội ở vùng nó đặt chân.

## 5. Kỹ thuật (dự kiến)
- **Dữ liệu:** `js/data/sects.js` (thêm `gt`, `cong`, `toi`, `bimat`, `nguyenmau`, chính sách mặc định, chỉ số khởi đầu), `js/data/faiths.js` (bảy tín ngưỡng, giới, nghi lễ, giáo sĩ, phái), `js/data/sectpol.js` (chính sách và tác động), `js/data/sectevents2.js` (sự kiện nghịch lý và sự kiện tôn giáo).
- **Hệ thống:** `js/systems/sectpol.js` (chỉ số đa chiều, chính sách, `power` suy ra), `js/systems/faith.js` (`TT.faith`: share, hương hỏa, giáo hội, phái), `js/ui/faith.js` (tab hoặc mục "Tín ngưỡng"), mở rộng `js/ui/sect.js` (thể chế, chỉ số, sổ Công–Tội, chính sách).
- **Sửa:** `sect.js` (bỏ phụ thuộc `align` dần, chuyển sang độ hợp `gt`), `factions.js` (chiều đạo trong quan hệ, `power` suy ra, lý do chiến tranh thánh chiến), `character.js` (trường `faith`, `tam`, `gt`), `rules.js` (luật tông thêm giới tôn giáo), `population.js` (đọc `share`).
- **Lưu:** `world.fac.faith` và trường mới trong từng thế lực/nhân vật khởi tạo muộn; **không đổi `TT.VERSION`**; thế giới cũ tự dựng ở năm kế (tông cũ lấy `gt` suy ra từ `align`, giáo phái chia theo vùng).
- **Tương thích:** `D.SECTS[id].align` và `D.SECT_ALIGN` giữ nguyên để các bài kiểm thử cũ chạy; `gt` mới điền thêm.
- **Kiểm thử mới:** `gt` hợp lệ cho cả chín tông; `power` suy ra sát `power` cũ; sổ Công–Tội đủ 3+3+1; mô phỏng 400 năm nhiều hạt giống không lỗi; `share` mỗi vùng tổng bằng 1; không giáo hội chết hết; thánh chiến sinh đúng điều kiện; người chơi đổi đạo có hậu quả; lưu/tải giữ nguyên.

## 6. Các chặng (mỗi chặng chạy và kiểm thử được)
- [ ] **T0 Duyệt:** bạn xác nhận cách hiểu "hiện đại" (mục 1), chọn nguyên mẫu (mục 3.3, 3.4), trả lời mục 9.
- [ ] **T1 Giá trị và công–tội:** thêm `gt`, `cong`, `toi`, `bimat` cho chín tông; `align` thành nhãn suy ra; chuyển điều kiện gia nhập và trục xuất sang độ hợp `gt`; hiển thị mô tả mới ở dịch vụ tông. (Chưa đổi cân bằng.)
- [ ] **T2 Chỉ số đa chiều và chính sách:** bảy chỉ số, năm chính sách, `power` suy ra có hệ số bù, đo cân bằng bật/tắt như S 3.9; sự kiện nghịch lý đợt 1.
- [ ] **T3 Bộ máy hiện đại:** đặt tên lại bốn cơ quan, thêm Kinh tài và Truyền thông; dịch vụ thật trong phố tông môn (M7).
- [ ] **T4 Tôn giáo lõi:** bảy tín ngưỡng, `share` theo vùng, giáo hội và hương hỏa, quốc giáo của thế lực; sử ký và tin tức.
- [ ] **T5 Người chơi vào tôn giáo:** tín ngưỡng cá nhân, giới và nghi lễ, giáo sĩ, cải đạo, sự kiện; cân bằng nhịp hỏi.
- [ ] **T6 Xung đột và cải cách:** dị giáo, phái mới, thánh chiến, khoan dung; nối ma trận quan hệ (S1) chiều `dao`.
- [ ] **T7 Thần Chức đạo (tùy chọn):** đường tu hương hỏa cho người chơi.
- [ ] **T8 Giao diện và hoàn thiện:** thẻ tông (radar chỉ số, trục giá trị, công–tội), tab Tín ngưỡng, sơ đồ thế giới, di động; đo lại toàn bộ chỉ tiêu.
- [ ] Kiểm thử trong `tests.html`
- [ ] Đo cân bằng bằng mô phỏng
- [ ] Chơi thử trên trình duyệt (máy tính và điện thoại)
- [ ] Ghi tóm tắt vào `KE-HOACH.md`, chụp snapshot

Ước lượng: T1 khoảng 1 lượt làm việc; T2 khoảng 1,5; T3 khoảng 1; T4 khoảng 1,5; T5 khoảng 1,5; T6 khoảng 1,5; T7, T8 tùy lựa chọn.

## 7. Thứ tự với S (quốc gia) và M5b
- **T1 và T2** làm trước hay song song S1: cả hai cùng cần `dao` (đạo thống) trong ma trận quan hệ. Đề xuất: **S1 → T1 → T2 → S2 → T4 → S3 → S5 (M5b) → T5, T6**.
- M5b dùng được chính sách đối ngoại, chỉ số ngoại giao, quốc giáo để quyết liên minh và chiến tranh.
- Q (cốt truyện) và R (nhân duyên) hưởng lợi ngay từ `cong`/`toi`/`bimat` và tôn giáo (làm mầm chuyện, hôn nhân khác đạo).

## 8. Rủi ro
| Rủi ro | Cách giảm |
|---|---|
| Nhạy cảm khi lấy nguyên mẫu nước và tôn giáo thật | Chỉ lấy đặc điểm cấu trúc, tên giả, không sự kiện thời sự, không đánh giá đúng sai; mỗi bên đều có công và tội; bạn duyệt từng nguyên mẫu |
| Quá phức tạp, người chơi không đọc được | Hiển thị bằng chữ và thẻ (radar nhỏ, mấy dòng công–tội), số chi tiết ẩn; phần sâu ở thẻ tông và tab Tín ngưỡng |
| Lệch cân bằng khi `power` suy ra từ chỉ số | Hệ số bù; đo bật/tắt cho 12 hạt giống; giữ ~52 chiến tranh và 10 diệt vong mỗi 300 năm (±25%) |
| Nhịp hỏi người chơi tăng | Mọi hộp mới qua kênh tầng 2 có sẵn, trần ngân sách nhịp |
| Gỡ `align` hỏng code cũ | Giữ `align` như nhãn suy ra; chuyển từng chỗ dùng, mỗi chỗ có bài kiểm thử |
| Tôn giáo thành "buff" nhàm | Mỗi tín ngưỡng có giá phải trả (giới luật, hương hỏa, xung đột) và hậu quả |
| Bản lưu cũ | Trường khởi tạo muộn, dựng lại ở năm kế |

## 9. Cần bạn chốt (mỗi câu có mặc định)
1. **"Hiện đại hơn"** nghĩa là gì? (a) Chỉ tổ chức, thể chế, kinh tế, thông tin, ngoại giao nhưng vẫn cổ trang (mặc định); (b) cả thẩm mỹ và công nghệ (có thiết bị, phương tiện kiểu hiện đại); (c) hỗn hợp có chọn lọc.
2. **Chín nguyên mẫu ở 3.3** có hợp ý bạn không? Muốn đổi, thêm (Việt Nam, Pháp, Anh, Brazil, Israel...) hay bỏ nước nào? Mặc định giữ bảng này.
3. **Bao nhiêu nước làm nguyên mẫu?** Chín (mỗi tông một) như đề xuất, hay ít hơn mà sâu hơn?
4. **Âm Hồn Giáo:** vẫn là thế lực "u tối" với công–tội cân bằng (mặc định), hay đổi hẳn bản sắc?
5. **Tôn giáo có là thế lực** (có sức mạnh, xuất hiện trong ma trận quan hệ S1) hay chỉ là lớp phủ? (Mặc định: lớp phủ, riêng ba giáo hội lớn nhất cũng vào ma trận.)
6. **Số tín ngưỡng khởi đầu:** bảy (mặc định) hay ít hơn/nhiều hơn?
7. **Thần Chức đạo** (tu bằng hương hỏa) làm ở đợt này (T7) hay để sau?
8. **Tông có bị "thanh trừng"** (thay đổi lớn về `gt` và chính sách khi hỗn loạn) không? Mặc định có, hiếm.
9. **Thứ tự:** S1 → T1 → T2 → S2 → T4... như mục 7, hay làm T trước S?
10. **Hiển thị:** cho người chơi thấy số cụ thể hay chỉ bậc/chữ? (Mặc định: bậc và chữ.)

## 10. Nhật ký làm việc
- 2026-10-18: đọc `sects.js`, `sect.js`, `factions.js`, M-tong-mon mục 3; viết kế hoạch T, chưa code. Chờ bạn duyệt mục 9.

## 11. Kết quả và việc để sau
(Chưa làm.)
