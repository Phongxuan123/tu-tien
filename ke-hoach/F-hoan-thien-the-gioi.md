# F. Hoàn thiện thế giới trước khi làm kinh tế

- Trạng thái: Chờ bạn xem sơ đồ rồi chốt (chưa code)
- Ngày lập: 2026-10-16
- Liên quan: `so-do-the-gioi.html` (sơ đồ, số liệu thật của game), `KICH-BAN-THE-GIOI.md` (thế lực), `ke-hoach/E-kinh-te.md` (kinh tế, làm sau khi chốt thế giới)

## 1. Yêu cầu của bạn
Trước khi làm tiền tệ và kinh tế, vẽ sơ đồ thể hiện năng lực và quan hệ trong thế giới để hoàn thiện thế giới trước.

## 2. Đã làm: sơ đồ
Mở `so-do-the-gioi.html` bằng trình duyệt. Có bảy phần: thang cảnh giới và năng lực; bản đồ chín vùng với vương triều, tông, gia tộc; danh sách thế lực (sức mạnh, đoàn kết, của cải, tình trạng, lãnh tụ); mạng quan hệ giữa thế lực; ma trận năng lực của các lực lượng; dòng quyền lực, hàng hóa, tiền bạc; quan hệ giữa người với người. Phần "dự kiến" ghi rõ thứ chưa có trong game (thương hội, hộ vệ).

## 3. Những chỗ trống nhìn thấy từ sơ đồ (đề xuất để hoàn thiện)
1. **Chỉ có ba tầng thế lực** (vương triều, tông, gia tộc). Thiếu tầng kinh tế (thương hội) và tầng tán tu có tổ chức. Tán tu hiện chỉ là người chơi và vài NPC lẻ.
2. **Quan hệ giữa các tầng chưa có "chất"**: vương triều và tông chỉ có chỉ số thiện cảm; chưa có nghĩa vụ rõ (thuế, cống nạp, bảo hộ, đất phong) hay hậu quả (triều đàn áp tông, tông chống triều).
3. **Chiến tranh ít ở thời Thịnh thế**, 25 năm mô phỏng không có cuộc chiến nào; quan hệ chủ yếu tĩnh. Cần vòng căng thẳng - xung đột - hòa giải rõ hơn (tranh địa điểm, tranh nguồn hàng, báo thù đời trước).
4. **Phàm nhân và dân số** không hiện diện như một lực lượng (nguồn thuế, nguồn lính, nguồn tư chất mới).
5. **Quân sự** chỉ là chỉ số sức mạnh chung; chưa phân biệt quân đội triều, cao thủ tông, hộ vệ hội.
6. **Người chơi ở đâu trong sơ đồ**: chưa có nơi "tán tu" của riêng mình (quan hệ với từng thế lực, hồ sơ chính-tà, danh tiếng theo thế lực).
7. **Tin tức và thông tin** (ai biết gì, nghe tin lúc nào) mới có ở tin đồn bí cảnh; chưa phân cấp theo thế lực.

## 4. Bước tiếp theo đề xuất (sau khi bạn xem sơ đồ)
- F1: chốt bộ thế lực (thêm thương hội và cách tán tu có tổ chức), vẽ lại sơ đồ.
- F2: nghĩa vụ và hậu quả giữa vương triều, tông, gia tộc, hội (thuế, cống nạp, bảo hộ, chư hầu, trục xuất).
- F3: vòng xung đột và hòa giải; tần suất chiến tranh theo thời đại.
- F4: dân số ẩn theo vùng (thuế, lính, tư chất mới) làm nền cho kinh tế.
- F5: hồ sơ quan hệ của người chơi với từng thế lực.
- Sau đó mới làm tiền tệ và kinh tế (`E-kinh-te.md`).

## 5. Câu hỏi cho bạn
1. Sơ đồ có đúng hình dung của bạn về thế giới chưa? Thiếu lực lượng nào?
2. Ma trận năng lực (phần 5) có chỗ nào chấm sai?
3. Chỗ trống nào ở mục 3 bạn muốn làm trước?

## 6. Nhật ký làm việc
- 2026-10-16: bạn bảo vẽ sơ đồ năng lực và quan hệ trong thế giới trước rồi mới tính tiền tệ. Dựng `so-do-the-gioi.html` đọc số liệu thật từ game; ghi các chỗ trống.
## 7. F1 đã làm: thương hội vào thế giới (2026-10-16)
- **Thế lực thứ tư** `kind: 'hoi'` trong `world.fac`: 3 thương hội lớn (Vạn Bảo Thương Hội gắn bó vương triều, phủ 6 vùng; Thanh Phong Hành tự do thương mại, phủ 4; Hắc Kim Hội chợ đen, phủ 3), có lãnh tụ, vốn (`wealth`), uy tín (`trust`), hộ vệ (`guard` tối đa 30), ảnh hưởng chính trị với từng triều và tông (`infl`), xu hướng (`agenda`), tỉ phần tự sản xuất (`own` tối đa 12%).
- **Không có quân đội:** bị loại khỏi vòng tuyên chiến, không bao giờ nằm trong `wars`; sức mạnh hiển thị tối đa 30.
- **Mô phỏng cấp năm** (`fac.tickHoi`): vốn theo số vùng phủ, uy tín, thời đại, chiến sự; mở/đóng chi nhánh; đầu cơ tích trữ khi có chiến sự (hội trục lợi hoặc uy tín thấp, ghi `f.shocks` cho kinh tế sau này); cướp đoàn buôn lớn (giảm theo hộ vệ); triều tịch thu khi hội giàu mà thiếu ảnh hưởng; tông cắt hàng sỉ; môi giới hòa nghị hoặc cho vay thời chiến; phá sản và được gây dựng lại sau 12-30 năm; thay lãnh tụ.
- **Giao diện:** tab Biên niên sử có mục Thương hội (vốn, uy tín, hộ vệ, vùng phủ, ảnh hưởng lớn nhất, xu hướng); sơ đồ `so-do-the-gioi.html` hiện hội thật (bản đồ, bảng, mạng quan hệ).
- **API cho kinh tế:** `fac.hoiAt(rid)`, `fac.hoiCover(rid)` (độ phủ 0-1 dùng để ép chênh giá vùng), `world.fac.shocks`.
- **Bản lưu cũ:** `fac.ensureHoi()` tự sinh hội ở lần cập nhật năm kế.
- **Cân bằng đo được** (10 thế giới x 75-120 năm): vốn trung vị khoảng 49 (15-84), số vùng phủ trung bình 3,6, uy tín trung bình 59, hộ vệ tối đa 23, hơn một trăm sự kiện cướp/đóng chi nhánh/môi giới/cắt hàng/tịch thu trong sử ký (khoảng một cuộc mỗi 7-8 năm cho mỗi loại chính), phá sản hiếm (1 trong 10 thế giới).
- **Chưa làm (F2 trở đi):** nghĩa vụ và hậu quả giữa vương triều, tông, gia tộc, hội (thuế, cống nạp, bảo hộ, chư hầu); tán tu có tổ chức; dân số ẩn; hồ sơ quan hệ của người chơi với từng thế lực; tin tức phân cấp.
