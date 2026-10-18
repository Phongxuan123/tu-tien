# Kế hoạch tổng: "1 trong 8 tỷ: Tu Tiên"

Cập nhật: 2026-10-17 · Kiểm thử tự động: **97/97 đạt** (`tests.html`) · Nhịp hỏi người chơi: 5,5 lần/phút (mục tiêu dưới 6).

> **Cách đọc file này.** Đây là trang tổng, chỉ ghi *cái gì đã làm, cái gì chưa, xem chi tiết ở đâu*. Chi tiết thiết kế và nhật ký từng tính năng nằm trong thư mục [`ke-hoach/`](ke-hoach/README.md) (mỗi tính năng một file). Toàn bộ nhật ký cũ (M0 đến M7, số liệu, mặc định) được giữ nguyên văn ở [`ke-hoach/_nhat-ky-goc.md`](ke-hoach/_nhat-ky-goc.md).
> Ký hiệu: ☑ đã làm và có kiểm thử · ☐ chưa làm · ◐ làm một phần · cột "Bạn kiểm" để bạn tích sau khi chơi thử.

## Mục lục
1. [Tầm nhìn và nguyên tắc](#1-tầm-nhìn-và-nguyên-tắc)
2. [Bảng tiến độ theo nhóm](#2-bảng-tiến-độ-theo-nhóm)
3. [Danh sách để bạn kiểm lại (cách thử từng mục)](#3-danh-sách-để-bạn-kiểm-lại)
4. [Quyết định đã chốt](#4-quyết-định-đã-chốt)
5. [Hàng đợi: việc chưa làm, xếp theo gợi ý](#5-hàng-đợi-việc-chưa-làm)
6. [Câu hỏi đang chờ bạn trả lời](#6-câu-hỏi-đang-chờ-bạn-trả-lời)
7. [Kiến trúc, công cụ, trang xem thử](#7-kiến-trúc-công-cụ-trang-xem-thử)
8. [Rủi ro](#8-rủi-ro)
9. [Nhật ký thay đổi theo ngày](#9-nhật-ký-thay-đổi-theo-ngày)
10. [Tài liệu liên quan](#10-tài-liệu-liên-quan)

---

## 1. Tầm nhìn và nguyên tắc
Game web mô phỏng cuộc đời tu tiên bằng chữ chạy theo thời gian, lấy cảm hứng từ cấu trúc của Quỷ Cốc Bát Hoang (nguồn tham khảo chưa kiểm chứng, số liệu tự đặt). Chạy bằng cách mở `index.html`, thẻ `<script>` thường, không cần cài gì.

1. **Sinh ra ngẫu nhiên** ("1 trong 8 tỷ"): tư chất, tiên thiên, xuất thân.
2. **Người chơi chọn hướng đi**, nhân vật tự quyết hằng tháng; game dừng hỏi ở khoảnh khắc lớn (ba tầng quyết định).
3. **Thế giới tự sống**: NPC dùng chung bộ máy với người chơi; thế lực, chiến tranh, thời đại tự vận động.
4. **Kỳ ngộ** làm mỗi đời đặc biệt; **chết thì đầu thai hoặc kế thừa** (nhân quả mang sang kiếp sau).
5. **Nội dung gốc**, chỉ tiếng Việt, không chép tên hay văn bản của tác phẩm nào.
6. Ngoài phạm vi: hành động thời gian thực, đồ họa 3D, nhiều người chơi, kiếm tiền.

Mục tiêu nhịp: một đời Phi Thăng khoảng 20 đến 30 phút thật; khoảng 2 đến 6 lựa chọn có ý nghĩa mỗi phút; không để dài quá 30 giây không có gì làm hay xem.

---

## 2. Bảng tiến độ theo nhóm

### 2.1 Nền tảng và vòng đời (mốc M0 đến M8)
| Mục | Xong | Bạn kiểm | Chi tiết |
|---|---|---|---|
| M0 Sườn: vòng lặp tháng, bus sự kiện, lưu/tải, 20 NPC tự sống | ☑ | ☐ | nhật ký gốc §13 |
| M1 Sự kiện (36), kỳ ngộ, ba tầng quyết định, quy tắc nếu-thì, mức tự động | ☑ | ☐ | nhật ký gốc §13, §12 |
| M2 Quan hệ, giao du, kẻ thù báo thù, tin đồn, cơ hội có hạn, danh tiếng | ☑ | ☐ | nhật ký gốc §13 |
| M3 Tông môn đợt 1 (9 tông, 5 chức vị, cống hiến, đại trận) | ☑ | ☐ | nhật ký gốc §13; làm lại ở 2.5 |
| M4 Gia đình: đạo lữ, song tu, con cái, đồ đệ, nợ ân tình, kế thừa hoặc đầu thai | ☑ | ☐ | nhật ký gốc §13 |
| M5 Túi đồ, chợ, công pháp, tâm pháp, thiên phú nghề, chuẩn bị đột phá, Thiên cơ điểm | ☑ | ☐ | nhật ký gốc §13 |
| M6 Chiến đấu theo hiệp (ngũ hành khắc chế), bí cảnh nhiều chặng, sự kiện dọc đường | ☑ | ☐ | nhật ký gốc §13 |
| M7 Nghịch Thiên Cải Mệnh, thiên kiếp, nhịp thời gian, cân bằng, báo cáo cuối năm, di động | ☑ | ☐ | nhật ký gốc §13 |
| M8 Pháp bảo bản mệnh (trong mục trang bị) | ☑ | ☐ | nhật ký gốc §20 |
| M8 Yêu thú đồng hành, khí linh, phong thủy, trận pháp | ☐ | | chưa có kế hoạch riêng |
| Hệ linh thạch (4 bậc, hấp thụ, quy đổi) | ☑ | ☐ | nhật ký gốc §16 |
| Hầm mộ khó hơn, cái giá thất bại (thương tích, mất đồ) | ☑ | ☐ | nhật ký gốc §17 |
| Trang bị 4 ô, phẩm chất, luyện khí mới | ☑ | ☐ | nhật ký gốc §20 |
| Luyện đan bớt "quá mạnh" (giảm nguyên liệu, tỉ lệ) | ☑ | ☐ | nhật ký gốc §25 |

### 2.2 Nhiệm vụ, đạo, nghề (bước A, B, C)
| Mục | Xong | Bạn kiểm | Chi tiết |
|---|---|---|---|
| A. Hệ nhiệm vụ thay mục tiêu (3 tầng, 4 độ khó, bảng kéo thả, xem xét định kỳ) | ☑ | ☐ | [A-nhiem-vu](ke-hoach/A-nhiem-vu.md) |
| B. Nghề nghiệp (9 nghề, nghề chính/phụ, đơn hàng) | ☑ | ☐ | [B-nghe-nghiep](ke-hoach/B-nghe-nghiep.md) |
| C. Ngã rẽ cuộc đời, 5 con đường thay ô "Hướng đi" | ☑ | ☐ | [C-nga-re](ke-hoach/C-nga-re.md) |
| D. Kỳ ngộ có cốt truyện (gộp vào Q) | ☐ | | [D-ky-ngo](ke-hoach/D-ky-ngo.md) |
| R. Nhân duyên và quan hệ: đạo lữ (hành trình), con cái (một đời người), sư đồ, dây duyên, gộp tab Quan hệ + Gia đình | ☐ | Chờ bạn duyệt, chưa code | [R-nhan-duyen](ke-hoach/R-nhan-duyen.md) |
| Q. Làm mới cốt truyện, lựa chọn, kỳ ngộ (tuyến truyện, nhân quả, manh mối, tuyến thế giới) | ☐ | Chờ bạn duyệt, chưa code | [Q-cot-truyen](ke-hoach/Q-cot-truyen.md) |

### 2.3 Thế giới và bản đồ
| Mục | Xong | Bạn kiểm | Chi tiết |
|---|---|---|---|
| Bản đồ hai tầng: 9 vùng x 10 địa điểm, vượt vùng, môi trường, thời tiết | ☑ | ☐ | [MAP-THIET-KE](MAP-THIET-KE.md) |
| Thế giới tự vận động: vương triều, tông, gia tộc, chiến tranh, thời đại | ☑ | ☐ | nhật ký gốc §18, [KICH-BAN-THE-GIOI](KICH-BAN-THE-GIOI.md) |
| Sơ đồ thế giới (năng lực, quan hệ) | ☑ | ☐ | `so-do-the-gioi.html` |
| F1 Thương hội là thế lực thứ tư | ☑ | ☐ | [F-hoan-thien-the-gioi](ke-hoach/F-hoan-thien-the-gioi.md) |
| F2 Nghĩa vụ giữa các thế lực: hiệp ước (cống nạp, thuế, chư hầu, minh ước, bảo hộ), oán, bất tuân, đoạn tuyệt (lõi, hiển thị ở Nha môn và Điện chưởng môn) | ☑ | ☐ | [P-nghia-vu-dan-so](ke-hoach/P-nghia-vu-dan-so.md) mục 11 |
| F2 phần sau: nhiệm vụ do thế lực giao, thuế vào giá, sơ đồ vẽ hiệp ước, F5 tín nhiệm | ☐ | | P mục 11 |
| F4 Dân số ẩn theo vùng (thuế kéo kho triều, quân số, nơi sinh, dân tâm, nổi loạn, thiên tai, di cư) | ☑ | ☐ | [P-nghia-vu-dan-so](ke-hoach/P-nghia-vu-dan-so.md) mục 11 |
| F3 Vòng xung đột và hòa giải; F5 hồ sơ quan hệ của người chơi với từng thế lực | ☐ | | F mục 4 (F5 gộp vào P mục 4.4) |
| Bản đồ vùng có địa hình (9 kiểu), biểu tượng, đường cong, phóng to, kéo, toàn màn hình | ☑ | ☐ | [J-ban-do-vung](ke-hoach/J-ban-do-vung.md) |
| Tài nguyên bản đồ (5 loại, kho hao và hồi, nghề thu theo nơi) | ☑ | ☐ | [N-tai-nguyen-ban-do](ke-hoach/N-tai-nguyen-ban-do.md) |
| Khu tài nguyên + đường mòn vạch đứt, đi tới khu, thu hoạch không cần nghề | ☑ | ☐ | N mục 9 |
| Đại địa đồ (9 vùng) làm đẹp như bản đồ vùng | ☐ | | J mục 5 (bạn bảo chưa cần) |
| Nhật báo "Thiên Cơ Báo" bốn năm một số, thay khung Thiên hạ | ☑ | G1 đến G5 (rút gọn: chưa có nhiệm vụ từ truy nã, chưa chấm báo mới) | [G-nhat-bao](ke-hoach/G-nhat-bao.md) |
| Phát triển thành trì (bảng tin chợ, bậc thành) | ☐ | | [H-phat-trien-thanh-tri](ke-hoach/H-phat-trien-thanh-tri.md) |
| S. Hệ thống Quốc gia, Tông môn hiện đại (theo nguyên mẫu quốc gia thật) và Tôn giáo: quốc vận, nho khí, quân trận, mạng quan hệ nhiều chiều, thể chế và chỉ số tông, 9 tín ngưỡng thật; làm chung M5b; nội dung sự kiện ở Q mục 24 | ☐ | Chờ bạn duyệt, chưa code | [S-quoc-gia-tong-mon-ton-giao](ke-hoach/S-quoc-gia-tong-mon-ton-giao.md) |
| Z. Lộ trình triển khai tổng thể 13 đợt cho Q, R, S, E (phần tồn: giám định, nhiệm vụ/vay/bảo hiểm hội, thuế vào giá), F (phần tồn: F3, F5, F2 sau) | ☐ | Chờ bạn duyệt, chưa code | [Z-lo-trinh-trien-khai](ke-hoach/Z-lo-trinh-trien-khai.md) |
| S1 Mạng quan hệ nhiều chiều: sổ ân oán, bậc quan hệ, ma trận và hồ sơ cặp trong Biên niên sử (không đổi cân bằng) | ☑ | ☐ | [S-quoc-gia-tong-mon-ton-giao](ke-hoach/S-quoc-gia-tong-mon-ton-giao.md) mục 15.12 |

### 2.4 Kinh tế và công trình
| Mục | Xong | Bạn kiểm | Chi tiết |
|---|---|---|---|
| E. Kinh tế: kế hoạch bản 6 (giá 63 chỉ số, cung cầu từ thế giới, hạn dùng, kênh mua có sức nặng, thiện cảm hội, gia nhập hội, E0 đến E6 một mạch) | ☑ | E0 đến E6 | [E-kinh-te](ke-hoach/E-kinh-te.md) mục A.17: giá 63 ô, hạn dùng, hội, thuế. Chưa: giám định, vay/bảo hiểm hội |
| Asset: biểu tượng vật phẩm, 22 công trình pixel | ☑ | ☐ | [I-cong-trinh](ke-hoach/I-cong-trinh.md), `asset-xem.html` |
| I2 Phố công trình trong màn hình nhân vật (hover, bấm vào nhà) | ☑ | ☐ | I mục 13 |
| I3 Cửa hàng mới: mua bán chỉ ở cửa hàng, hạn mức tháng, kho hàng, hàng rong, dịch vụ | ☑ | ☐ | I mục 13 |
| I4 Võ đài, kho đồ, hầm mỏ, bến tàu, nhà đấu giá, tòa soạn (hiện báo "sẽ mở ở bản sau") | ☐ | | I |
| I5 Tích hợp hội sở, tòa soạn theo thế lực | ☐ | | I |

### 2.5 Tông môn làm lại (trụ cột)
| Mục | Xong | Bạn kiểm | Chi tiết |
|---|---|---|---|
| M1 Bản sắc: tôn chỉ, luật tông (cảnh cáo, phạt, đuổi), tuyệt học, bốn đường | ☑ | ☐ | [M-tong-mon](ke-hoach/M-tong-mon.md) |
| M2 Bảng việc tông (12 việc), thử luyện nhập môn xuất sắc | ☑ | ☐ | M-tong-mon |
| M3 Sư phụ nội môn, đồng môn, đại bỉ năm năm một lần | ☑ | ☐ | M-tong-mon |
| M4 Chính trị nội bộ (phe phái, tranh ngôi, nội gián, phản đồ) | ☐ | | hoãn theo ý bạn |
| M5a Tài nguyên tông (linh mạch, mỏ, kho, cống nạp, chiếm mỏ, quyên góp) | ☑ | ☐ | M-tong-mon mục 8 |
| M5b Liên tông (minh ước, giải đấu, đại chiến có hậu quả) | ☐ | | M-tong-mon, nối F2 |
| M6 Người chơi lập tông, làm chưởng môn, khách khanh, nằm vùng | ☐ | | M-tong-mon |
| M7 Phố tông môn 9 công trình, dịch vụ thật, tab Tông môn thành "Thẻ đệ tử" | ☑ | ☐ | M-tong-mon mục 9 và 10, `asset-tongmon.html` |

### 2.6 Giao diện
| Mục | Xong | Bạn kiểm | Chi tiết |
|---|---|---|---|
| Cảnh pixel ở đầu cột trái (nơi ở, vùng, thời tiết, yêu thú, hiểm địa) | ☑ | ☐ | nhật ký gốc §19 |
| Hộp quyết định dạng cửa sổ nổi, phím 1-9 | ☑ | ☐ | nhật ký gốc §21 |
| Bố cục mới, khung nổi, bản đồ cuộc đời | ☑ | ☐ | nhật ký gốc §22 |
| Nhật ký mới: gom năm, 3 mức, biểu tượng, lọc, gộp việc vặt, ☆ đánh dấu, Sổ đời | ☑ | ☐ | [K-nhat-ky](ke-hoach/K-nhat-ky.md), `uimock-nhatky.html` |
| Hồ sơ nhân vật: Tổng quan (ảnh pixel, danh vọng), Chỉ số, Thành tựu, Đánh dấu, Kiếp trước | ☑ | ☐ | [L-ho-so-nhan-vat](ke-hoach/L-ho-so-nhan-vat.md), `uimock-hoso.html` |
| Cột phải gọn: chỉ còn tên nơi, nút đi tới, "Người ở đây"; thông tin vào công trình đại diện | ☑ | ☐ | [O-khu-thong-tin-ban-do](ke-hoach/O-khu-thong-tin-ban-do.md) |
| Dải môi trường và thời tiết dưới bản đồ; Vượt vùng chuyển sang tab Tông môn, khóa tới khi đủ điều kiện | ☑ | ☐ | O mục 2 |
| Sửa lỗi bảng trái không cập nhật sau khi bấm Trang bị hay Đọc học | ☑ | ☐ | `js/ui/side.js` |
| 11 ý tưởng cho khu dưới bản đồ (lộ trình, dải "Sắp tới", nhiều lớp bản đồ, sương mù khám phá...) | ☐ | | O mục 3 |
| Ô ghi chú và "Tạm gác lại" trong hộp quyết định; dải kiếp trước trên bản đồ cuộc đời | ☐ | | nhật ký gốc §21, §22 |

### 2.7 Công cụ và kiểm thử
| Mục | Xong | Bạn kiểm | Chi tiết |
|---|---|---|---|
| `tests.html` 93 bài (lõi, cân bằng, tông, tài nguyên, nhật ký, công trình...) | ☑ | ☐ | mở bằng trình duyệt, chờ khoảng 3 phút |
| `sim.html`, `tools/quest-sim.js`, `tools/calib.js`, `tools/dgsim.js` (đo cân bằng) | ☑ | | thư mục `tools/` |
| `tools/snapshot.ps1` (nén bản sao theo mốc vào `game-tu-tien-snapshots`) | ☑ | | không có git |
| Chơi thử trên điện thoại thật | ☐ | | mới kiểm khung 375px trong trình duyệt |

---

## 3. Danh sách để bạn kiểm lại
Chỉ liệt kê các mục làm từ 2026-10-16 trở lại đây (các mục cũ hơn đã qua nhiều đợt thử). Mở `index.html` (hoặc `http://localhost:8765/` nếu dùng `serve.ps1`). Tích khi bạn thấy đúng.

- [ ] **Bản đồ vùng đẹp:** vào cột phải, đổi qua lại các vùng khi sang vùng khác; cuộn chuột phóng to, kéo để di chuyển, nút ◎ ⟲ ⛶, Esc để thoát toàn màn hình.
- [ ] **Tài nguyên trên bản đồ:** huy hiệu tròn dưới tên địa điểm, nút ◈ bật tắt; rê chuột lên địa điểm thấy linh khí, nguy hiểm, phồn hoa.
- [ ] **Khu tài nguyên:** các nút nét đứt nối bằng đường mòn vạch đứt; đứng ở địa điểm chủ, bấm khu, "Đi tới khu"; ở khu chọn "Kiếm sống" thì có vật liệu, không mua bán được; lên đường thì tự rời khu.
- [ ] **Cột phải gọn:** chọn một địa điểm thấy tên và nút "Đi tới"; "Người ở đây" vẫn đủ; thông tin chi tiết chỉ hiện khi bước vào công trình đại diện (Sơn môn, Nhà trưởng thôn, Nha môn, Lều tộc trưởng, Cổng ải).
- [ ] **Dải môi trường và thời tiết** nằm ngay dưới bản đồ.
- [ ] **Vượt vùng** nằm ở tab Tông môn: khung "Đang khóa" kèm điều kiện thiếu; đủ điều kiện thì mở; cổng ải và trận đài có nút xuất phát.
- [ ] **Nhật ký mới:** mục mới nhất ở trên; gom theo tuổi; bấm tên năm để thu/mở; ba mức quan trọng; lọc; gộp việc vặt; ⓘ chi tiết; ☆ đánh dấu; nút Sổ đời.
- [ ] **Tab Hồ sơ** (thay "Nhân vật"): Tổng quan có ảnh pixel và danh vọng; Chỉ số; Thành tựu; Đánh dấu (sửa ghi chú); Kiếp trước.
- [ ] **Tông môn, bảng việc và đường:** vào tông, lên nội môn thì chọn đường ở nhà của đường; nhận việc ở nhà đúng đường; chọn "Kiếm sống" thì việc tiến triển; nộp phạt, xin thăng bậc, quyên góp và đổi đồ ở Kho cống hiến.
- [ ] **Phố tông môn:** đứng ở tông thấy 9 nhà (hai trang, nút ◀ ▶); rê chuột nổi nhà; bấm vào mở dịch vụ; người ngoài tông chỉ vào được Sơn môn.
- [ ] **Tab Tông môn = Thẻ đệ tử:** chỉ theo dõi, không còn nút nhận việc hay đổi đồ.
- [ ] **Đại bỉ:** sau vài năm trong tông, tới kỳ thì có hộp hỏi (nội môn trở lên) hoặc tự thi (ngoại môn).
- [ ] **Cửa hàng và hạn mức** (đợt trước): mua bán chỉ ở cửa hàng; hàng rong thỉnh thoảng ghé.
- [ ] **Sửa lỗi bảng trái:** bấm Trang bị hoặc Đọc học rồi xem bảng tự cập nhật, không cần đổi tab.
- [ ] **Dân số và hiệp ước:** vào thành, mở Nha môn, đọc dòng dân số, dân tâm, thiên tai và danh sách hiệp ước trong vùng; vào tông, mở Điện chưởng môn, xem hiệp ước của tông; theo dõi biên niên và Thiên hạ xem có tin hạn hán, dịch, bất tuân, đoạn tuyệt.
- [ ] **Chế độ Tự động:** để chạy vài đời, kiểm tra nhịp hỏi không dày và tông môn tự chọn đường, nhận việc.

---

## 4. Quyết định đã chốt
| Chủ đề | Quyết định |
|---|---|
| Thời gian | Cân bằng số liệu + tốc độ tự nhanh dần theo cảnh giới + nút Tua |
| Tư chất | 5 ngũ hành + 5 biến dị |
| Kế thừa | Đầu thai mới (tư chất khá hơn) hoặc kế thừa con, đồ đệ (mang nhân quả) |
| Nghịch Thiên | Tối đa 3 lần mỗi đời, giá tăng dần |
| NPC thân thiết | 5 đến 7 NPC có trạng thái tình cảm; còn lại là người qua đường, có thể giữ vai cố định |
| Bản đồ | Có bản đồ hai tầng, hiển thị vị trí |
| Ngôn ngữ, nội dung | Chỉ tiếng Việt; giữ đầy đủ song tu, thù hận, cái chết ở mức văn học |
| Hướng đi | Năm con đường chọn ở ngã rẽ; bỏ "Cân bằng" |
| Mua bán | Chỉ ở nơi có cửa hàng; mỗi cửa hàng bán và thu đúng nhóm hàng |
| Nhật báo | Chỉ một tờ (Thiên Cơ Báo), bốn năm một số |
| Nhật ký và hồ sơ | Nhật ký mới nhất ở trên, không có ô tìm; đánh dấu quản lý ở Hồ sơ; giữ ảnh pixel; Tổng quan đứng đầu và có danh vọng |
| Cột phải | Chỉ còn tên nơi và Người ở đây; thông tin vào công trình đại diện |
| Tông môn | Công trình là nơi làm việc, tab Tông môn là thẻ theo dõi; hoãn chính trị nội bộ, làm tài nguyên trước |
| Vượt vùng | Nằm ở tab Tông môn, khóa tới khi đủ điều kiện |
| Số liệu cân bằng | Chi tiết ở nhật ký gốc §14 (mặc định cần duyệt kỹ nhất: `PLAYER_RATE` 0,42 và trần đột phá 46%) |

---

## 5. Hàng đợi: việc chưa làm
Gợi ý thứ tự (bạn đổi tùy ý):

1. **Chơi thử và gửi phản hồi** các mục ở mục 3 (đặc biệt phố tông môn, khu tài nguyên, nhật ký).
2. **D. Kỳ ngộ có cốt truyện** (đã có kế hoạch, chờ làm).
3. **S Hệ thống Quốc gia** (kế hoạch chờ bạn duyệt, [S-quoc-gia-tong-mon-ton-giao](ke-hoach/S-quoc-gia-tong-mon-ton-giao.md)); **M5b Liên tông** gộp vào chặng S5 của S, dùng lại hiệp ước F2 (minh ước, giải đấu); phần còn lại của F2 (nhiệm vụ thế lực, F5) ở [P](ke-hoach/P-nghia-vu-dan-so.md) mục 11.
4. **Khu dưới bản đồ:** dải "Sắp tới", nhiều lớp bản đồ (thế lực, nguy hiểm), bộ lập lộ trình (O mục 3).
5. **E Kinh tế** (nền F2, F4, tài nguyên đã xong; kế hoạch bản 5 chờ bạn duyệt) và **G Nhật báo**.
6. **I4/I5**: võ đài, kho đồ, hầm mỏ, bến tàu, nhà đấu giá, tòa soạn.
7. **M6 Lập tông, làm chưởng môn** và **M4 chính trị nội bộ** (hoãn).
8. **M8 còn lại:** yêu thú đồng hành, khí linh, phong thủy, trận pháp.
9. **Kỹ thuật:** NPC thu hoạch tài nguyên và tranh chấp khu; chơi thử điện thoại thật.

---

## 6. Câu hỏi đang chờ bạn trả lời
1. Công trình "Sơn môn" trong phố nhân vật đã gắn; có muốn đổi hình theo biểu tượng cổng dịch chuyển như trên bản đồ không? (O mục 6)
2. Mục Vượt vùng trong tab Tông môn vẫn có nút xuất phát; có muốn bỏ để chỉ xuất phát ở Trận đài và Cổng ải? (M mục 10)
3. Khu dưới bản đồ: chọn ý tưởng nào làm trước trong 11 ý (O mục 3)?
4. Tông môn: giữ 9 tông hay thêm tông nhỏ ở vùng lớn? Lập tông ở cuối game hay sớm? (M mục 6)
5. Chủ địa điểm nên đổi chủ khi thắng trận (hiện chỉ chiếm "mỏ" ở mức tông)? (N mục 7)
6. Cốt truyện (Q): xem ke-hoach/Q-cot-truyen.md mục 20 (câu hỏi còn mở, có mặc định) và mục 21 (gợi ý bổ sung) rồi cho làm Q1 trở đi.
7. Nhật báo: chơi thử tab Nhật báo (đăng ký, đọc số, mua số cũ) và cho biết cần chỉnh gì.
8. Kinh tế: chơi thử giá, hạn dùng, hội; cho mình biết cần chỉnh gì (giá, hạn dùng, cướp, đấu giá).
9. Quốc gia, Tông môn hiện đại, Tôn giáo (S): xem ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 13 (9 câu còn lại, có mặc định).

---

## 7. Kiến trúc, công cụ, trang xem thử
- **Cấu trúc:** `js/core` (state, rng, bus, time, save), `js/data` (dữ liệu: cảnh giới, vùng, địa điểm, tông, vật phẩm, sự kiện, công trình, tài nguyên...), `js/systems` (luật chơi), `js/ui` (giao diện). Thứ tự nạp ở `js/files.js` (thêm file chỉ sửa một chỗ). Không ES module.
- **Quy ước:** id thế giới `window.TT`; trường mới khởi tạo muộn nên không đổi `TT.VERSION` (bản lưu cũ vẫn dùng được từ phiên bản 13); `TT.rng` có hạt giống nên cùng hạt cho cùng kết quả.
- **Kiểm thử:** `tests.html` (chạy tuần tự từng bài). Đo cân bằng: `sim.html`, `tools/*.js`. Lưu ý một vài bài phụ thuộc hạt giống (đã nới ở bài ngã rẽ và bài NPC sinh con).
- **Snapshot:** `powershell -File tools\snapshot.ps1 -Name <tên>` (đã lưu nhiều mốc, mới nhất `M7-pho-tong-mon-vao-game`).
- **Trang xem thử (không ảnh hưởng game):** `asset-xem.html` (biểu tượng, công trình), `asset-tongmon.html` (phố tông môn), `uimock-nhatky.html`, `uimock-hoso.html`, `uimock-kinhte.html`, `uimock-nhatbao.html`, `uimock-congtrinh.html`, `so-do-the-gioi.html`, `scenetest.html`, `spritetest.html`.
- **Bản cũ giữ tham chiếu:** `tu-tien-prototype.html`, `tu-tien.html`.

---

## 8. Rủi ro
| Rủi ro | Cách giảm |
|---|---|
| Phạm vi quá lớn | Làm theo mốc, mỗi mốc chơi được; mỗi tính năng một file kế hoạch riêng |
| Cân bằng khó | Mô phỏng hàng loạt; số liệu để trong `data/`; bài kiểm thử đo nhịp và tỉ lệ đột phá |
| Bài kiểm thử phụ thuộc hạt giống | Dùng mẫu đủ lớn hoặc hạt giống cố định; ghi chú trong bài |
| Tự động quá nhiều thì thụ động | Ba tầng quyết định, mức tự động chỉnh được, báo cáo cuối năm |
| Bản lưu hỏng sau cập nhật | Trường mới khởi tạo muộn; nút xuất/nhập JSON; snapshot theo mốc |
| Bản quyền | Nội dung tự viết, tên tự sinh |

---

## 9. Nhật ký thay đổi theo ngày
**2026-10-15** Làm M0 đến M7 trong một ngày; bản đồ hai tầng; thế lực và chiến tranh; linh thạch; hầm mộ khó hơn; trang bị và luyện khí; giao diện mới (cảnh pixel, hộp quyết định, bố cục, bản đồ cuộc đời). Chi tiết: nhật ký gốc.

**2026-10-16**
- A nhiệm vụ; B nghề; C ngã rẽ; luyện đan bớt mạnh.
- F1 thương hội; kế hoạch E (kinh tế), G (nhật báo), H (thành trì), I (công trình).
- Asset vật phẩm và công trình; I2 phố công trình; I3 cửa hàng mới và hạn mức.
- Bản đồ vùng có địa hình và phóng to (J).
- Sửa lỗi bảng trái không cập nhật; nhật ký mới nhất ở trên.

**2026-10-17**
- Nhật ký mới (K) và Hồ sơ nhân vật (L).
- Tông môn làm lại: M1 đến M3, tài nguyên tông (M5a), phố tông môn và Thẻ đệ tử (M7).
- Tài nguyên trên bản đồ và khu tài nguyên đường mòn vạch đứt (N).
- Gọn khu thông tin dưới bản đồ, thông tin vào công trình đại diện, Vượt vùng sang tab Tông môn, địa điểm tông dùng biểu tượng cổng dịch chuyển (O).
- Kế hoạch kinh tế bản 5 rồi bản 6 sau khi gộp quyết định của bạn (mục A của ke-hoach/E-kinh-te.md).
- Kế hoạch chi tiết F2 và F4 (ke-hoach/P-nghia-vu-dan-so.md), rồi làm lõi F4 (dân số ẩn) và F2 (hiệp ước).
- Kinh tế E0 đến E4b: giá theo cung cầu, cú sốc, hạn dùng, thiện cảm và gia nhập thương hội, kết thân ở chợ, đồ nhái chợ đen, cướp đường, nhà đấu giá.
- Nhật báo Thiên Cơ Báo (G1 đến G5): bỏ khung Thiên hạ, thêm tab Nhật báo, số tổng san bốn năm, đăng ký theo tháng.
- **2026-10-18** Kế hoạch R (nhân duyên, đạo lữ, con cái) tách khỏi Q; chờ duyệt.
- **2026-10-18** Kế hoạch làm mới cốt truyện, lựa chọn, kỳ ngộ (Q), thay D; chờ duyệt.
- **2026-10-18** Kế hoạch S gộp (Quốc gia, Tông môn hiện đại theo nguyên mẫu quốc gia thật, Tôn giáo) và thêm nội dung sự kiện, chuỗi sự kiện, giáo sĩ, Thần Chức đạo vào Q mục 24; chờ duyệt.
- **2026-10-18** Lộ trình triển khai tổng thể Q, R, S, E, F (13 đợt, hạ tầng, cổng chơi thử, chỉ tiêu); S1 giao diện gộp vào Biên niên sử; chờ duyệt rồi bắt đầu Đợt 0.
- **2026-10-18** Đợt 0 (công cụ chạy kiểm thử, đường cơ sở) và **S1** (mạng quan hệ nhiều chiều, ma trận trong Biên niên sử) xong: 97 bài đạt, hash cơ sở trùng khít.
- Sắp xếp lại file kế hoạch tổng này; nhật ký cũ chuyển nguyên văn vào `ke-hoach/_nhat-ky-goc.md`.

---

## 10. Tài liệu liên quan
- [`ke-hoach/README.md`](ke-hoach/README.md): bảng các file kế hoạch từng tính năng (A đến O) và trạng thái.
- [`ke-hoach/_nhat-ky-goc.md`](ke-hoach/_nhat-ky-goc.md): nhật ký gốc đầy đủ (số liệu M0-M7, mặc định tự chọn, linh thạch, hầm mộ, trang bị, giao diện).
- [`MAP-THIET-KE.md`](MAP-THIET-KE.md): thiết kế bản đồ hai tầng. [`KICH-BAN-THE-GIOI.md`](KICH-BAN-THE-GIOI.md): kịch bản thế lực và chiến tranh. [`CREDITS.md`](CREDITS.md): ghi công tài nguyên bên ngoài (Kenney CC0).
