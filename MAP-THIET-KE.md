# Thiết kế bản đồ lồng nhau: 9 vùng lớn, mỗi vùng một bản đồ nhỏ cố định

Cập nhật: 2026-10-15. Trạng thái: bản thiết kế để bạn duyệt, **chưa code**. Tên riêng đều là tên tự đặt.

## 1. Cấu trúc hai tầng

- **Đại địa đồ (tầng 1):** 9 vùng lớn như đã có (Trung Châu, Đông Hải, Tây Thiên Sơn, Nam Lâm, Bắc Cực Băng Nguyên, Hỏa Diệm Sơn, Hoang Mạc Kim Sa, Vụ Trạch, Lôi Đảo). Các vùng cách nhau rất xa.
- **Bản đồ nhỏ (tầng 2):** mỗi vùng lớn là một bản đồ nhỏ cố định gồm **10 địa điểm** nối với nhau bằng đường đi (1–3 tháng mỗi chặng). Mọi chuyện thường ngày (tu luyện, kiếm sống, kết bạn, vào tông môn, săn bí cảnh) diễn ra trong bản đồ nhỏ của vùng mình.
- **Sinh ra:** hồi sinh ngẫu nhiên tại **một địa điểm** của **một bản đồ nhỏ** nào đó (xuất thân quyết định loại địa điểm, xem mục 6).
- **Chỉ biết nơi mình ở:** lúc đầu người chơi chỉ thấy bản đồ nhỏ của vùng mình. Các vùng khác trên đại địa đồ hiện là "???" cho đến khi nghe tin đồn hoặc tới nơi.
- **Vượt vùng rất khó:** đi từ vùng này sang vùng khác cần cảnh giới cao và hàng chục đến cả trăm năm (mục 5). Vì vậy đa số nhân vật sống và chết trong vùng mình sinh ra. Nơi sinh ra định đoạt phần lớn số phận ("1 trong 8 tỷ").

## 2. Các loại địa điểm

| Loại | Vai trò trong game |
|---|---|
| Thành trì | Phồn hoa, kiếm vàng dễ, chợ mua bổ trợ, tuyển người, tin tức. Tương đối an toàn. Là kinh đô của một quốc gia. |
| Thôn trấn | Nghèo, an toàn, nơi sinh ra của đa số người thường. Linh khí thấp. |
| Tông môn | Gia nhập, học công pháp, nhận nhiệm vụ, đổi bí kíp. Linh khí cao bên trong. Có chính/tà. |
| Cứ địa bộ tộc | Công pháp và vật phẩm riêng, thường đề phòng người ngoài. |
| Thương đoàn | Mạng lưới buôn bán, việc hộ tống, đi lại giữa các thành, giá tốt cho bổ trợ. |
| Linh mạch | Linh khí rất cao, tu luyện nhanh nhưng bị tranh giành, hay có người canh giữ. |
| Bí cảnh | Sự kiện nhiều bước, rủi ro cao, nhiều cơ duyên. |
| Tàn tích / Hung địa | Kho báu hoặc thú dữ, nguy hiểm, cơ duyên ngẫu nhiên. |
| Mỏ / Phường | Nguyên liệu, nghề thủ công (luyện khí, đào khoáng). |
| Cửa ải | **Điểm duy nhất** để rời vùng sang vùng khác (và là nơi tới khi vượt vùng đến). |

Thế lực (không phải địa điểm, nhưng sở hữu địa điểm): **quốc gia** (sở hữu thành trì và thôn trấn), **tông môn**, **thương đoàn**, **bộ tộc**. Mỗi thế lực có phe chính/tà/trung lập, sức mạnh, quan hệ với nhau. Sẽ gắn vào hệ thống tông môn và quan hệ ở M2, M3.

## 3. Chín bản đồ nhỏ

Quy ước: mỗi vùng có 10 địa điểm, đường đi chính (số tháng), thế lực và nét đặc trưng. Danh sách đường đi đầy đủ sẽ đưa vào dữ liệu khi code.

### 3.1 Trung Châu (đồng bằng, phồn hoa nhất)
Thế lực: **Đại Vĩnh Quốc** (đế quốc phàm nhân, trung lập), **Tề Lương Quốc** (nhỏ, hiếu chiến), **Vạn Bảo Thương Hội**, **Thanh Vân Tông** (chính đạo).

| Địa điểm | Loại | Ghi chú |
|---|---|---|
| Vĩnh Đô | Thành trì | Kinh đô Đại Vĩnh Quốc, chợ lớn nhất, mọi đường đều về đây. |
| Tề Thành | Thành trì | Thủ phủ Tề Lương Quốc, nhiều lính, hay có chiến sự. |
| Lục Châu Trấn | Thôn trấn | Vựa lúa của vùng. |
| Thanh Hà Thôn | Thôn trấn | Làng nghèo ven sông. |
| Hoàng Hà Độ | Bến sông | Bến đò đông thương nhân. |
| Vạn Bảo Thương Hội | Thương đoàn | Trụ sở thương hội lớn nhất đại địa đồ. |
| Thanh Vân Tông | Tông môn | Tông môn hạng trung, nhận nhiều đệ tử phàm nhân. |
| Hắc Thị | Chợ đen | Giá bổ trợ khác chợ thường, có hàng cấm. |
| Cổ Đạo Quán | Tàn tích | Đạo quán hoang, cơ duyên nhỏ. |
| Thiên Môn Quan | Cửa ải | Điểm rời vùng, nối với cả bốn vùng lân cận. |

Đường chính: Vĩnh Đô nối Tề Thành 2, Lục Châu Trấn 1, Hoàng Hà Độ 1, Hắc Thị 1, Thiên Môn Quan 2. Hoàng Hà Độ nối Vạn Bảo Thương Hội 1. Lục Châu Trấn nối Thanh Hà Thôn 1. Tề Thành nối Thanh Vân Tông 2. Thanh Hà Thôn nối Cổ Đạo Quán 2.

### 3.2 Đông Hải (biển, thủy linh khí)
Thế lực: **Lam Hải Quốc**, **Hải Vận Thương Đoàn**, **Thủy Nguyệt Cung** (chính đạo), **Giao Nhân tộc**, hải tặc Hắc Phàm.

| Địa điểm | Loại | Ghi chú |
|---|---|---|
| Lam Cảng | Thành trì | Cảng lớn, kinh đô Lam Hải Quốc. |
| Bạch Sa Ngư Thôn | Thôn trấn | Làng chài bờ cát trắng. |
| Hải Vận Thương Đoàn | Thương đoàn | Đội thuyền buôn đi khắp các đảo. |
| Thủy Nguyệt Cung | Tông môn | Tu Thủy, nhiều nữ tu. |
| Giao Nhân Đảo | Cứ địa bộ tộc | Hải tộc Giao Nhân, bí ẩn. |
| Hắc Phàm Đảo | Cứ địa | Sào huyệt hải tặc, vô pháp. |
| Triều Âm Động | Linh mạch | Hang ven biển, thủy khí dồi dào, chỉ vào được khi thủy triều xuống. |
| San Hô Long Quật | Bí cảnh | Hang ngầm dưới đáy biển. |
| Vô Vọng Đảo | Tàn tích | Đảo hoang với di tích cổ. |
| Đông Hải Quan | Cửa ải | Bến vượt biển rời vùng. |

Đường chính (đi thuyền): Lam Cảng nối Bạch Sa 1, Hải Vận 1, Thủy Nguyệt 2, Đông Hải Quan 2. Bạch Sa nối Triều Âm 1. Hải Vận nối Giao Nhân Đảo 2, Hắc Phàm 3. Giao Nhân nối San Hô 2. Hắc Phàm nối Vô Vọng 2.

### 3.3 Tây Thiên Sơn (núi cao, Kim và Phong)
Thế lực: **Thiên Sơn Vương Quốc**, **Mã Đạo Thương Đoàn**, **Kim Phong Môn** (kiếm tu), **Ưng tộc**.

| Địa điểm | Loại | Ghi chú |
|---|---|---|
| Sơn Quan Thành | Thành trì | Thành xây dựa vách núi, kinh đô Thiên Sơn Vương Quốc. |
| Thiên Mã Trấn | Thôn trấn | Trạm ngựa trên đường núi. |
| Mã Đạo Thương Đoàn | Thương đoàn | Đoàn ngựa thồ qua các đèo. |
| Kim Phong Môn | Tông môn | Tông môn kiếm tu, khắt khe. |
| Ưng Sơn Trại | Cứ địa bộ tộc | Ưng tộc canh giữ đỉnh cao. |
| Hàn Thiết Mỏ | Mỏ | Quặng kim loại lộ thiên. |
| Vân Đỉnh Phong | Linh mạch | Đỉnh trên mây, gió lớn, linh khí dày. |
| Thiên Kiếm Tuyệt Bích | Bí cảnh | Vách đá cắm đầy kiếm cổ. |
| Tuyết Lĩnh Đạo Quán | Tàn tích | Đạo quán trên tuyết. |
| Thiên Lộ Quan | Cửa ải | Cổng lớn dẫn ra ngoài vùng (hướng Trung Châu). |

Đường chính: Sơn Quan Thành nối Thiên Mã Trấn 1, Kim Phong Môn 2, Hàn Thiết Mỏ 2, Thiên Lộ Quan 3. Thiên Mã Trấn nối Mã Đạo Thương Đoàn 1. Kim Phong Môn nối Vân Đỉnh Phong 2. Vân Đỉnh Phong nối Ưng Sơn Trại 2, Thiên Kiếm Tuyệt Bích 3. Hàn Thiết Mỏ nối Tuyết Lĩnh Đạo Quán 3.

### 3.4 Nam Lâm (rừng rậm, Mộc)
Thế lực: **Thanh Diệp Quốc**, **Dược Vương Hội**, **Bách Thảo Môn** (đan dược), **Thanh Lang tộc**.

| Địa điểm | Loại | Ghi chú |
|---|---|---|
| Thanh Diệp Thành | Thành trì | Thành trên tán cây, người và yêu cùng sống. |
| Mãng Lâm Thôn | Thôn trấn | Thôn của thợ săn. |
| Dược Vương Hội | Thương đoàn | Hội buôn dược liệu, đan dược. |
| Bách Thảo Môn | Tông môn | Chuyên luyện đan, hiền hòa. |
| Thanh Lang Doanh | Cứ địa bộ tộc | Tộc Sói xanh, hiếu chiến. |
| Linh Dược Cốc | Mỏ/khu hái | Thung lũng linh dược, thú dữ canh giữ. |
| Cổ Thụ Vương | Linh mạch | Cây cổ thụ ngàn năm tỏa linh khí. |
| Mê Vụ Lâm | Bí cảnh | Rừng sương mù, lạc đường. |
| Yêu Thú Chiến Trường | Hung địa | Nơi yêu thú tranh lãnh địa. |
| Nam Lâm Quan | Cửa ải | Lối ra khỏi rừng. |

Đường chính: Thanh Diệp Thành nối Mãng Lâm Thôn 1, Dược Vương Hội 1, Bách Thảo Môn 2, Nam Lâm Quan 2. Mãng Lâm Thôn nối Thanh Lang Doanh 2. Bách Thảo Môn nối Linh Dược Cốc 2. Linh Dược Cốc nối Cổ Thụ Vương 2. Thanh Lang Doanh nối Yêu Thú Chiến Trường 2. Cổ Thụ Vương nối Mê Vụ Lâm 3.

### 3.5 Bắc Cực Băng Nguyên (cực băng, nguy hiểm nhất)
Thế lực: **Bắc Hàn Vương Quốc** (nhỏ), **Băng Phách Thương Đoàn**, **Huyền Băng Cung**, **Tuyết Nhân tộc**.

| Địa điểm | Loại | Ghi chú |
|---|---|---|
| Hàn Thành | Thành trì | Thành duy nhất còn sống sót trong giá rét, kinh đô Bắc Hàn. |
| Phù Băng Thôn | Thôn trấn | Làng dựng trên tảng băng trôi. |
| Băng Phách Thương Đoàn | Thương đoàn | Đoàn xe trượt tuyết. |
| Huyền Băng Cung | Tông môn | Tu Băng, lạnh lùng. |
| Tuyết Nhân Doanh | Cứ địa bộ tộc | Tuyết Nhân tộc chịu lạnh giỏi. |
| Cực Quang Đài | Linh mạch | Dưới cực quang, linh khí cực mạnh. |
| Vạn Niên Băng Động | Bí cảnh | Hang băng nghìn năm. |
| Cổ Thần Thi Địa | Tàn tích | Xác thần cổ đóng băng. |
| Thú Săn Trường | Hung địa | Bầy thú băng. |
| Hàn Phong Quan | Cửa ải | Lối ra khỏi băng nguyên. |

Đường chính: Hàn Thành nối Phù Băng Thôn 1, Băng Phách Thương Đoàn 2, Huyền Băng Cung 3, Hàn Phong Quan 3. Phù Băng Thôn nối Thú Săn Trường 2. Huyền Băng Cung nối Cực Quang Đài 3. Cực Quang Đài nối Tuyết Nhân Doanh 3, Vạn Niên Băng Động 3. Tuyết Nhân Doanh nối Cổ Thần Thi Địa 3.

### 3.6 Hỏa Diệm Sơn (núi lửa, Hỏa và Dương)
Thế lực: **Chu Nham Quốc**, **Hỏa Khoáng Hội**, **Liệt Hỏa Tông**, **Thạch Hỏa tộc**.

| Địa điểm | Loại | Ghi chú |
|---|---|---|
| Nham Thành | Thành trì | Thành xây bằng đá núi lửa, kinh đô Chu Nham Quốc. |
| Tro Thôn | Thôn trấn | Làng sống nhờ tro núi lửa. |
| Hỏa Khoáng Hội | Thương đoàn | Buôn khoáng và hỏa tinh. |
| Liệt Hỏa Tông | Tông môn | Nóng tính, giỏi luyện khí. |
| Thạch Hỏa Tộc Cốc | Cứ địa bộ tộc | Bộ tộc đá chịu lửa. |
| Luyện Khí Phường | Phường | Xưởng luyện pháp khí lớn. |
| Dung Nham Trì | Linh mạch | Hồ dung nham, hỏa khí nồng đậm. |
| Hỏa Long Huyệt | Bí cảnh | Hang rồng lửa, rất nguy hiểm. |
| Địa Hỏa Đạo Quán | Tàn tích | Đạo quán trên mạch lửa ngầm. |
| Hắc Diệm Quan | Cửa ải | Ải khói đen rời vùng. |

Đường chính: Nham Thành nối Tro Thôn 1, Hỏa Khoáng Hội 1, Liệt Hỏa Tông 2, Hắc Diệm Quan 2. Liệt Hỏa Tông nối Luyện Khí Phường 1, Dung Nham Trì 2. Dung Nham Trì nối Hỏa Long Huyệt 3. Hỏa Khoáng Hội nối Thạch Hỏa Tộc Cốc 2. Tro Thôn nối Địa Hỏa Đạo Quán 2.

### 3.7 Hoang Mạc Kim Sa (sa mạc, Kim và Dương)
Thế lực: **Kim Hoàng Sa Quốc**, **Lạc Đà Thương Đoàn**, **Nhật Luân Giáo**, **Sa Lang tộc**, đám sa tặc.

| Địa điểm | Loại | Ghi chú |
|---|---|---|
| Kim Sa Thành | Thành trì | Thành ốc đảo, kinh đô Kim Hoàng Sa Quốc. |
| Ốc Đảo Thôn | Thôn trấn | Làng quanh giếng nước. |
| Lạc Đà Thương Đoàn | Thương đoàn | Đoàn lạc đà vượt sa mạc. |
| Lạc Đà Dịch Trạm | Trạm nghỉ | Trạm dừng chân của đoàn buôn. |
| Nhật Luân Giáo | Tông môn | Thờ mặt trời, tu Dương. |
| Sa Lang Doanh | Cứ địa bộ tộc | Tộc du mục Sói cát. |
| Kim Sa Mỏ | Mỏ | Mỏ cát vàng chứa kim khí. |
| Bão Cát Mê Cung | Bí cảnh | Mê cung sống dậy theo bão. |
| Cổ Thành Chôn Cát | Tàn tích | Thành cổ bị cát vùi. |
| Tây Hoang Quan | Cửa ải | Ải biên cương rời vùng. |

Đường chính: Kim Sa Thành nối Ốc Đảo Thôn 1, Lạc Đà Thương Đoàn 1, Nhật Luân Giáo 2, Tây Hoang Quan 3. Lạc Đà Thương Đoàn nối Lạc Đà Dịch Trạm 2. Lạc Đà Dịch Trạm nối Kim Sa Mỏ 2, Sa Lang Doanh 3. Sa Lang Doanh nối Bão Cát Mê Cung 3. Nhật Luân Giáo nối Cổ Thành Chôn Cát 3.

### 3.8 Vụ Trạch (đầm lầy, Âm và Mộc)
Thế lực: **không có quốc gia** (Vụ Thành Hội tự quản), thương đoàn **Thuyền Bóng**, **Âm Hồn Giáo** (tà), **Độc Thủy tộc**.

| Địa điểm | Loại | Ghi chú |
|---|---|---|
| Vụ Thành | Thành trì | Thành lụp xụp trên cọc, do hội đồng cai quản. |
| Cọc Thôn | Thôn trấn | Làng dựng trên cọc giữa đầm. |
| Hắc Thị Trạch | Chợ đen | Thương đoàn Thuyền Bóng buôn lậu ở đây. |
| Âm Hồn Giáo | Tông môn | Tà đạo, luyện hồn. |
| Độc Thủy Tộc Doanh | Cứ địa bộ tộc | Tộc dùng độc. |
| Sương Mù Cốc | Linh mạch | Âm khí dày đặc. |
| Quỷ Mộ Đầm | Bí cảnh | Vùng đầm đầy mộ cổ. |
| Cổ Miếu Ma | Tàn tích | Miếu bị ma ám. |
| Rừng Chết | Hung địa | Cây khô, thú ma. |
| Vụ Trạch Quan | Cửa ải | Cầu cổ xuyên đầm, lối rời vùng. |

Đường chính (đi thuyền hoặc đường cọc): Vụ Thành nối Cọc Thôn 1, Hắc Thị Trạch 1, Âm Hồn Giáo 2, Vụ Trạch Quan 3. Cọc Thôn nối Độc Thủy Tộc Doanh 2. Âm Hồn Giáo nối Sương Mù Cốc 2. Sương Mù Cốc nối Quỷ Mộ Đầm 3. Hắc Thị Trạch nối Cổ Miếu Ma 2. Độc Thủy Tộc Doanh nối Rừng Chết 2.

### 3.9 Lôi Đảo (đảo giông bão, Lôi và Phong)
Thế lực: **Phong Lôi Đảo Quốc**, **Thuyền Phong Thương Đoàn**, **Tử Lôi Quan**, **Lôi Điểu tộc**.

| Địa điểm | Loại | Ghi chú |
|---|---|---|
| Phong Lôi Cảng | Thành trì | Cảng giữa giông bão, kinh đô Phong Lôi Đảo Quốc. |
| Lôi Âm Ngư Thôn | Thôn trấn | Làng chài sống nhờ sấm sét. |
| Thuyền Phong Thương Đoàn | Thương đoàn | Đội thuyền cưỡi gió. |
| Tử Lôi Quan | Tông môn | Tu Lôi, kỷ luật nghiêm. |
| Lôi Điểu Sào | Cứ địa bộ tộc | Tộc chim sấm. |
| Lôi Trì | Linh mạch | Hồ sét, lôi khí dồi dào. |
| Mắt Bão | Bí cảnh | Tâm bão yên tĩnh nhưng ẩn nguy hiểm. |
| Tàn Tích Thiên Phạt | Tàn tích | Di tích nơi trời giáng tội xưa. |
| Đá Hút Sét Phường | Mỏ/phường | Khai thác đá dẫn sét. |
| Lôi Đảo Quan | Cửa ải | Bến rời đảo. |

Đường chính (đi thuyền): Phong Lôi Cảng nối Lôi Âm Ngư Thôn 1, Thuyền Phong Thương Đoàn 1, Tử Lôi Quan 2, Lôi Đảo Quan 2. Tử Lôi Quan nối Lôi Trì 2. Lôi Trì nối Lôi Điểu Sào 3, Đá Hút Sét Phường 2. Lôi Điểu Sào nối Mắt Bão 3. Lôi Âm Ngư Thôn nối Tàn Tích Thiên Phạt 3.

## 4. Chỉ số theo địa điểm (cho code sau này)

Mỗi địa điểm có chỉ số riêng: **linh khí, nguy hiểm, phồn hoa**, kế thừa nền từ vùng lớn rồi điều chỉnh theo loại:
- Thành trì: phồn hoa +2, nguy hiểm -1.
- Thôn trấn: phồn hoa -1, nguy hiểm -1, linh khí -1.
- Linh mạch: linh khí +2, nguy hiểm +1.
- Bí cảnh, tàn tích, hung địa: nguy hiểm +2, cơ duyên cao.
- Tông môn: linh khí +1, nguy hiểm -1 (đối với thành viên).
Hiệu ứng "hợp thuộc tính" của vùng (tu luyện nhanh hơn tới 80%) giữ nguyên, áp dụng tại các địa điểm trong vùng.

## 5. Vượt vùng

Chỉ khởi hành từ **Cửa ải** của vùng, và đến nơi ở Cửa ải của vùng đích. Cảnh giới tối thiểu và số năm để đi (là con số tạm, chỉnh được):

| Tuyến | Cảnh giới tối thiểu | Số năm |
|---|---|---|
| Trung Châu và Tây Thiên Sơn | Hóa Thần | 100 |
| Trung Châu và Đông Hải | Nguyên Anh | 70 |
| Trung Châu và Nam Lâm | Nguyên Anh | 60 |
| Trung Châu và Bắc Cực Băng Nguyên | Hóa Thần | 120 |
| Đông Hải và Lôi Đảo | Hóa Thần | 80 |
| Đông Hải và Hỏa Diệm Sơn | Nguyên Anh | 70 |
| Nam Lâm và Hỏa Diệm Sơn | Nguyên Anh | 60 |
| Nam Lâm và Hoang Mạc Kim Sa | Nguyên Anh | 70 |
| Tây Thiên Sơn và Hoang Mạc Kim Sa | Nguyên Anh | 70 |
| Tây Thiên Sơn và Vụ Trạch | Nguyên Anh | 80 |
| Bắc Cực và Vụ Trạch | Hóa Thần | 110 |
| Bắc Cực và Lôi Đảo | Hóa Thần | 120 |

- Nếu cảnh giới cao hơn mức tối thiểu thì đi nhanh hơn (đề xuất giảm 25% mỗi cảnh giới).
- Trong lúc vượt vùng, nhân vật **tu luyện ở 50% tốc độ**, không làm việc được, và gặp các sự kiện dọc đường (kỳ ngộ, nguy hiểm). Phải đủ thọ nguyên.
- **Lối đi tắt (ý tưởng, chưa chốt):** truyền tống trận cổ rất hiếm, thương đoàn lớn có thuyền hoặc đội bay, tông môn lớn có đại trận cho thành viên. Cho phép nhân vật yếu hơn vượt vùng với cái giá lớn (vàng, nhân tình, cơ duyên).
- NPC cũng tuân thủ: NPC cảnh giới đủ cao mới có thể sang vùng khác, nên người mạnh nhất có thể "biến mất" sang vùng khác và để lại tin đồn.

## 6. Nơi sinh ra

Hồi sinh ngẫu nhiên, trước hết chọn vùng (đều nhau, hoặc theo dân số), sau đó chọn địa điểm theo xuất thân:
- Con nhà nông: thôn trấn.
- Con thương nhân: thành trì hoặc thương đoàn.
- Thiếu gia thế gia: thành trì (kinh đô quốc gia).
- Cô nhi lang thang: bất kỳ nơi nào (kể cả bộ tộc, bến, tông môn).
- Nhỏ xác suất sinh ra trong cứ địa bộ tộc hoặc tông môn (con em trong đó).

## 7. Tác động lên phần đã code và kế hoạch triển khai

Phần bản đồ đã có (9 nút, đi 3–4 tháng) sẽ **trở thành đại địa đồ**, nhưng quy tắc đi lại giữa các nút đổi hoàn toàn (mục 5). Vị trí nhân vật đổi từ `region` thành `(vùng, địa điểm)`.

| Bước | Nội dung |
|---|---|
| A | Dữ liệu 9 bản đồ nhỏ (90 địa điểm, đường đi, chỉ số). |
| B | Vị trí hai tầng, đi lại trong vùng, AI chọn nơi ở theo địa điểm. |
| C | Vượt vùng: điều kiện cảnh giới, thời gian, sự kiện dọc đường. |
| D | Giao diện: đại địa đồ (vùng chưa biết hiện "???") và bản đồ nhỏ của vùng đang ở. |
| E | Dân số: tăng NPC lên khoảng 15–20 mỗi vùng (khoảng 150–180 tổng) và mô phỏng thô cho vùng xa người chơi. |
| F | Gắn thế lực (quốc gia, tông môn, thương đoàn, bộ tộc) vào địa điểm; chính/tà. |
| G | Cân bằng lại nhịp tu luyện và nguy hiểm theo từng loại địa điểm. |

## 8. Câu hỏi cần bạn chốt

1. 10 địa điểm mỗi vùng, loại và tên như trên có ổn không? Muốn thêm/bớt loại địa điểm nào?
2. **Vượt vùng**: bảng cảnh giới và số năm có đúng ý bạn? Có cho phép lối đi tắt (truyền tống trận, thương đoàn, tông môn) không?
3. Trong lúc vượt vùng: tu luyện 50%, gặp sự kiện dọc đường; chấp nhận được không, hay muốn bỏ qua luôn bằng "tua nhanh"?
4. Nơi sinh ra: vùng chọn đều nhau (mỗi vùng 1/9) hay theo dân số (Trung Châu đông hơn)? Điều này quyết định bao nhiêu người "sinh ra ở Cực Bắc" so với "sinh ra ở Trung Châu".
5. Số NPC: tăng lên 150–180 (15–20 mỗi vùng) được chưa?


## 9. Quyết định đã chốt (2026-10-15) và tình trạng

| # | Quyết định | Tình trạng |
|---|---|---|
| 1 | Mỗi vùng có môi trường riêng (debuff thường trực) và thời tiết có cả lợi lẫn hại (ví dụ Bắc Cực có bão tuyết gây hại nhưng người tu Băng, Thủy hấp thụ được hàn khí, và cực quang có lợi cho mọi người). | Đã làm: `js/data/regions.js`, `js/systems/map.js`. |
| 2 | Có lối đi tắt (truyền tống trận cổ, thương đoàn, đại trận tông môn) nhưng điều kiện khắt khe. | Truyền tống trận và thương đoàn đã làm; đại trận tông môn đang khóa, chờ hệ thống tông môn (M3). |
| 3 | Vượt vùng: tu luyện 50%, gặp sự kiện dọc đường. | Đã làm: `js/systems/crossing.js` (sự kiện hiện đơn giản: cơ duyên, bị thương). |
| 4 | Nơi sinh theo tỉ lệ sinh riêng từng vùng, lấy cảm hứng từ đặc trưng quốc gia ngoài đời. Trung Châu đông dân nhưng tỉ lệ sinh thấp (4%), nên sinh ra ở đó là cơ hội hiếm và thường khá giả. | Đã làm: Trung Châu 4%, Đông Hải 17%, Tây Thiên Sơn 9%, Nam Lâm 22%, Bắc Cực 3%, Hỏa Diệm Sơn 8%, Hoang Mạc 14%, Vụ Trạch 15%, Lôi Đảo 8%. Mỗi vùng có 5 bối cảnh xuất thân riêng. |
| 5 | NPC chỉ cần làm cho vùng mình ở: 15-20 NPC lõi cộng NPC phụ (chức vụ cố định); thêm vài NPC có thể vượt vùng bằng nhiều cách. | Đã làm: chỉ vùng người chơi ở được mô phỏng, vùng khác dựng khi tới và được "bù thời gian" khi quay lại; du hành giả rời đi, khách lạ từ vùng khác tới và tiết lộ vùng của họ cho bạn. |

### Số liệu cân bằng hiện tại (mô phỏng 20 thế giới, 100 năm)
NPC lõi đạt Trúc Cơ trở lên: tư chất thấp khoảng 4%, khá 10%, cao 19%. Hệ số tu luyện chung (`TRAIN_RATE`) đặt 0,42 để bù ảnh hưởng của linh khí, môi trường và thuộc tính hợp vùng.

### Chưa làm trong thiết kế này
Gắn tông môn và thế lực vào hệ thống thành viên, NPC thân thiết có trạng thái tình cảm (M2, M3), sự kiện dọc đường phong phú hơn, cân bằng chi tiết theo loại địa điểm.
