# Kịch bản: thế giới tự vận động (thế lực, lịch sử, thời đại)

Bản nháp để bạn duyệt trước khi code. Chưa có gì trong game thay đổi.

## 1. Mục tiêu trải nghiệm

- Thế giới có **câu chuyện của riêng nó**, không chờ người chơi. Bạn nghe tin tông môn A đánh tông môn B, vài chục năm sau A suy tàn, thế lực mới nổi lên.
- Khi **đầu thai hoặc kế thừa**, bạn bước vào một thế giới đã đổi: bản đồ quyền lực khác, người thù xưa đã thành tro bụi hoặc đã làm chưởng môn.
- Người chơi **bị cuốn vào** (bị triệu tập, tị nạn, đứng phe, hưởng lợi) nhưng không bắt buộc đóng vai chính. Thế giới vẫn chạy khi bạn lơ đi.
- Chi phí máy thấp: các thế lực chỉ chạy mô phỏng **cấp năm**, không mô phỏng từng người.

## 2. Ba tầng thế lực

| Tầng | Số lượng | Vai trò |
|---|---|---|
| **Vương triều** | 9 (mỗi vùng một) | Cai trị phàm nhân: thuế, quân đội, ổn định. Quyết định chiến loạn, giá cả, cửa ải. |
| **Tông môn** | 9 (đã có) | Nơi tu sĩ tụ họp: tranh chấp, liên minh, diệt môn, sinh ra tông mới. |
| **Gia tộc tu tiên** | khoảng 8 | Quy mô nhỏ, truyền đời; gắn với một địa điểm; thường phụ thuộc tông hoặc triều. |

Mỗi thế lực là một bản ghi nhỏ trong `world.factions`:

- `power` (sức mạnh 0-100), `wealth` (của cải), `unity` (đoàn kết/ổn định)
- `leader` (id NPC lõi, có tên, có thể chết, kế vị như hệ kế vị tông môn đã có)
- `home` (địa điểm trụ sở), `holds` (các địa điểm đang nắm)
- `rel` (quan hệ với từng thế lực khác, -100 đến 100, ghi lý do gần nhất)
- `state`: **thịnh** / **ổn** / **suy** / **diệt**
- `tag`: chính / tà / trung lập (lấy từ tông môn), với triều và gia tộc thì tự đặt

Quy tắc đồng bộ: `power` của tông môn **lấy gốc từ sức mạnh thật** của các thành viên NPC (tổng cảnh giới cao nhất, số trưởng lão, chưởng môn) cộng nhiễu, để chiến tranh không lệch hẳn với thế giới NPC đang mô phỏng.

## 3. Vòng đời của thế lực (cấp năm)

Mỗi năm game, với mọi thế lực:

1. **Biến động nội bộ:** power và unity dao động theo chưởng môn/lãnh tụ (qua đời thì unity tụt, kế vị tranh giành), mùa màng, thiên tai trong vùng.
2. **Quan hệ:** gần nhau, khác tag, tranh một địa điểm giàu thì quan hệ xấu đi. Có chung kẻ thù hoặc hôn nhân/cứu giúp thì tốt lên.
3. **Quyết định lớn (xác suất, theo tình hình):** gây chiến, xin hòa, liên minh, thu phục, chiếm địa điểm, chia tách, diệt môn.
4. **Hệ quả được ghi vào sử ký** (Biên niên sử) và phát thành tin Thiên hạ.

### Chiến tranh
- Có hai bên (có thể kèm đồng minh), **thời lượng 1-8 năm**, một **chiến tuyến** (vùng hoặc vài địa điểm).
- Mỗi năm mỗi bên thắng/thua tùy power, unity, đồng minh, may rủi. Kết thúc khi một bên mất địa điểm nhà chính, power cạn, hoặc hòa.
- Kết cục: **hòa nghị** (bồi thường), **chiếm địa điểm** (đổi chủ), **thần phục** (chư hầu), **diệt môn** (state = diệt, thành viên tán loạn).
- Hiệu ứng lên vùng chiến tuyến: thời tiết **Chiến loạn** liên tục (đã có), nguy hiểm tăng, giá chợ tăng, cửa ải siết hoặc đóng, thương đoàn đình trệ.

### Sinh và diệt
- **Diệt môn:** trưởng lão/đệ tử còn sống thành tán tu, một số mang hận thù với kẻ thắng (dùng hệ kẻ thù sẵn có). Địa điểm thành **tàn tích** (có thể mở thành hầm mộ, nối với hệ bí cảnh sẵn có).
- **Tông mới nổi:** một đại năng NPC (Kim Đan trở lên) lập tông ở địa điểm trống. Tên tự sinh, tag chính hoặc tà, cần đủ đệ tử mới thành thế lực chính thức.
- **Gia tộc thăng cấp** thành tông khi đủ mạnh, **gia tộc diệt vong** khi mất người kế nghiệp.

## 4. Thời đại (kỷ nguyên)

Mỗi **80-150 năm game** thế giới chuyển sang một thời đại, tác động toàn cục. Người chơi nhiều đời sẽ thấy rõ.

| Thời đại | Tác động chính |
|---|---|
| **Thịnh thế** | Chiến tranh ít, giá thấp, sự kiện hòa bình nhiều, tông môn mở rộng tuyển đệ tử. |
| **Loạn thế** | Chiến tranh nhiều, kẻ thù và thương vong tăng, nhưng cống hiến chiến công và nhiều cơ hội. |
| **Linh khí phục hồi** | Tu luyện nhanh hơn, tỉ lệ kỳ ngộ tăng nhẹ, xuất hiện thiên kiêu mới. |
| **Mạt pháp** | Linh khí cạn, linh thạch đắt, đột phá khó hơn chút, khuyến khích đi hầm mộ. |

Thời đại chuyển theo chuỗi có xác suất (không cố định thứ tự). Có tin đồn báo hiệu trước 1-3 năm.

## 5. Người chơi tương tác thế nào

1. **Nghe tin:** tin Thiên hạ và tin đồn, như hiện nay nhưng có chiều sâu (có nguyên nhân, chuỗi sự kiện).
2. **Thành viên tông môn bị triệu tập:** hộp quyết định tầng 2 khi tông tham chiến: ra trận (rủi ro, thưởng cống hiến và danh vọng lớn), xin ở lại hậu phương (an toàn, mất chút uy tín), hoặc bỏ trốn (mất tư cách, có thể bị truy nã).
3. **Dân thường/tán tu:** tị nạn khỏi chiến tuyến, nhận việc vận chuyển/hộ tống, bán đồ lúc khan hiếm, tham gia đoàn lính đánh thuê.
4. **Đứng phe:** có hộp chọn ủng hộ một bên (cống nạp, nhận ân huệ), ảnh hưởng quan hệ với NPC phe kia.
5. **Hưởng lợi sau chiến tranh:** nhặt bảo vật ở tàn tích, nhận đệ tử mồ côi, mua rẻ vật tư.
6. **Đời sau:** khi đầu thai/kế thừa, màn chào ghi tóm tắt "Điều đã đổi" và có tab **Biên niên sử** xem sử ký.

Người chơi **không** điều khiển thế lực trong đợt này. (Làm chưởng môn, lập tông là hướng mở rộng sau.)

## 6. Kịch bản mẫu (để hình dung)

> **Năm 12.** Hai tông ở Trung Châu tranh một mỏ linh thạch. Quan hệ xuống -40, tin đồn "hai tông giương cung".
> **Năm 14.** Tông A tuyên chiến. Vùng chiến tuyến vào Chiến loạn, giá đan tăng 20%. Bạn là đệ tử ngoại môn của tông A và nhận lệnh triệu tập.
> **Năm 17.** Chưởng môn tông B chết trận, unity tụt. Tông A chiếm hai địa điểm, tông B xin thần phục.
> **Năm 18.** Hòa nghị. Một trưởng lão tông B không phục, mang đệ tử ra lập tông mới ở vùng hẻo lánh.
> **Năm 90.** Bạn mất, đầu thai. Màn chào: "Tông A nay là bá chủ Trung Châu, tông B đã diệt, tông mới họ Lý đang lên. Thời đại: Loạn thế."

## 7. Kỹ thuật và cân bằng

- **Dữ liệu:** `js/data/factions.js` (định nghĩa 9 triều, 8 gia tộc, bảng lý do và mẫu tin), `js/systems/factions.js` (mô phỏng cấp năm, chiến tranh, thời đại), `js/data/histevents.js` (hộp quyết định liên quan người chơi), `js/ui/history.js` (tab Biên niên sử).
- Lưu trong `world.factions`, `world.era`, `world.chronicle` (danh sách sự kiện có năm). Tăng `VERSION`.
- Chạy cấp năm cho mọi thế lực, chi phí gần như không đáng kể. Không đụng vòng mô phỏng NPC.
- **Giữ cân bằng NPC:** chiến tranh chỉ ảnh hưởng NPC trong phạm vi đã được mô phỏng (vùng của người chơi); tỉ lệ tử vong thêm do chiến tranh nhỏ và có trần, để mục tiêu 4/10/19% không lệch quá. Kiểm lại bằng phép đo phân tầng hiện có.
- **Nhịp quyết định:** thêm tối đa 1 hộp liên quan thế lực mỗi 3-5 năm game ở tốc độ x1, nhằm giữ nhịp 5-6 hộp/phút đã chốt.
- **Kiểm thử:** thế lực không chết hết hay không ai thắng mãi; mô phỏng 500 năm không lỗi; không có thế lực mồ côi; tông diệt thì thành viên có chỗ đi; save/load giữ nguyên; mỗi thời đại có thể gặp.

## 8. Các bước làm (mỗi bước chạy và kiểm thử được)

1. **Khung thế lực:** dữ liệu, mô phỏng cấp năm (quan hệ, power, unity), sử ký, tab Biên niên sử, tin Thiên hạ.
2. **Chiến tranh:** tuyên chiến, diễn tiến, kết cục (hòa, chiếm, thần phục, diệt), hiệu ứng lên vùng và giá.
3. **Sinh/diệt:** diệt môn và tán tu, tàn tích, tông mới, gia tộc thăng/diệt.
4. **Thời đại:** bốn thời đại và tác động toàn cục, báo hiệu bằng tin đồn.
5. **Người chơi vào cuộc:** hộp quyết định triệu tập/tị nạn/đứng phe, tóm tắt "Điều đã đổi" khi đầu thai.
6. **Cân bằng và hoàn thiện:** mô phỏng dài, đo lại NPC và người chơi, mobile, cập nhật KE-HOACH.

## 9. Mặc định mình tự chọn (cần bạn duyệt)

- 9 vương triều (một vùng một), 9 tông hiện có, 8 gia tộc.
- Chiến tranh kéo dài 1-8 năm, khoảng 1 cuộc/vùng mỗi 30-60 năm.
- Thời đại đổi mỗi 80-150 năm, 4 loại như trên.
- Người chơi **không** điều khiển thế lực trong đợt này.
- Tối đa 1 hộp quyết định liên quan thế lực mỗi 3-5 năm game.
- Diệt môn là có thật (tông có thể biến mất vĩnh viễn), nhưng luôn có thế lực mới thay chỗ để thế giới không trống.
- Tông mà người chơi đang là thành viên **không bị diệt** khi bạn còn là thành viên chính thức bậc cao (từ nội môn) trong 5 năm đầu gia nhập, để không mất toàn bộ tiến trình đột ngột; bạn vẫn có thể thấy nó suy yếu và phải chọn đường đi.

## 10. Câu hỏi mở cho bạn

1. Bạn có muốn **tông của người chơi có thể bị diệt thật** (mất tư cách, chạy loạn) không, hay chỉ suy yếu tới mức tối thiểu?
2. Thế giới **mạnh tay** (nhiều biến cố, dễ có thiên tai chiến tranh) hay **êm** (vài biến cố lớn mỗi đời)?
3. Có muốn đợt sau cho **người chơi làm chưởng môn/lập tông** để dùng luôn hệ thế lực này không?


## 11. Đã làm và chưa làm (cập nhật sau khi code)

**Đã làm** (`js/systems/factions.js`, `js/data/facevents.js`, `js/ui/history.js`, tab "Biên niên sử"):
- 9 vương triều, 9 tông môn, 8 gia tộc; sức mạnh, đoàn kết, của cải, người đứng đầu (qua đời hoặc bị ám hại thì kế vị), quan hệ giữa các thế lực, liên minh.
- Chiến tranh 1-8 năm (đồng minh có thể tham chiến), kết thúc bằng hòa nghị, thần phục, đổi triều (vương triều không bao giờ diệt) hoặc diệt môn (tông, gia tộc). Có xung đột nhỏ bất chợt khiến bạn thành thù.
- Diệt môn thật: tông của người chơi cũng có thể bị diệt (người chơi mất tông, thành tán tu, bị thương nhẹ), địa điểm thành tàn tích thám hiểm được, không gia nhập được. Sau 15-40 năm dư đảng tái lập. Gia tộc diệt thì có gia tộc mới nổi lên.
- Thời đại: Thịnh thế, Loạn thế, Linh khí phục hồi, Mạt pháp, đổi mỗi 80-150 năm (có điềm báo trước 3 năm). Ảnh hưởng chiến tranh, giá, tốc độ tu luyện (±8-10%, cho cả NPC lẫn người chơi).
- Nhịp thế giới ngẫu nhiên theo hạt giống (0,6 đến 1,6): thế giới êm hoặc dữ dội.
- Chiến tuyến: nguy hiểm +1, kiếm tiền -15%, giá mua +20%; NPC trong vùng đang mô phỏng có thêm 1,2% tử trận mỗi năm.
- Người chơi vào cuộc: lệnh triệu tập (ra trận, hậu phương, bỏ trốn) khi tông của bạn có chiến tranh, và "Chiến loạn lan tới" (hộ tống, lượm bảo vật, lánh) khi bạn ở vùng chiến tuyến. Nhiệm vụ tông môn +30% cống hiến lúc có chiến tranh.
- Khi đầu thai hoặc kế thừa, nhật ký có "Điều đã đổi" (những biến cố lớn từ lúc bạn chết). Tab Biên niên sử xem thời đại, chiến sự, thế lực và sử ký 40 mục gần nhất.

**Chưa làm** (để các đợt sau cùng tuyến kịch bản):
- Cửa ải siết hoặc đóng khi có chiến tranh, và chọn đứng về phe nào khi không thuộc tông.
- Nhân vật cố định có cốt truyện (đại năng, ma đầu, thiên kiêu), sự kiện riêng theo địa danh.
- Tông mới hoàn toàn (hiện chỉ tái lập tông cũ), chiếm địa điểm đổi chủ, đại hội luận võ định kỳ.
