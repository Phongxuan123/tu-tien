# Thiết kế lại Nhật ký của bạn

- Trạng thái: Đã code (2026-10-16), chờ bạn chơi thử
- Ngày bắt đầu: 2026-10-16
- Liên quan: `js/ui/panels.js` (renderLog), `js/core/state.js` (TT.log), CSS `#log`, G-nhat-bao.md (khung Thiên hạ sẽ bỏ)

## 1. Mục tiêu và yêu cầu của bạn
"Thiết kế lại nhật ký. Đầu tiên là cho nhật ký chạy ngược lên, và lên kế hoạch hiển thị thông tin kiểu khác cho nó hợp hơn."

## 2. Hiện trạng
- Nhật ký là một danh sách phẳng, 120 mục cuối, cũ ở trên, mới ở dưới, tự cuộn xuống đáy.
- Mỗi mục: cột tuổi + một dòng chữ + dòng "Chi tiết" tuỳ chọn. Có 4 màu theo `cls`: big (đậm), good (xanh), bad (đỏ cam), age (mờ, việc vặt), còn lại là thường.
- Khó đọc vì: việc vặt (đã tới nơi, trang bị đồ, nhóm lò) lẫn với việc lớn (đột phá, kết đạo lữ); không biết mục thuộc mảng nào (tu luyện, tiền bạc, người quen, tông môn...); mốc thời gian chỉ có tuổi; không lọc, không tìm; chỉ giữ 120 mục nên một đời dài là mất.

## 3. Đã làm (bước 1)
- Mục mới nhất nằm trên cùng, cuộn về đầu mỗi khi có mục mới.

## 4. Đề xuất thiết kế (chờ bạn chọn)
**4.1 Gom theo năm.** Tiêu đề nhóm "Năm 3 · 14 tuổi · Luyện Khí tầng 2 · Thanh Hà Thôn" (mới nhất trên cùng); năm cũ tự thu gọn thành một dòng tóm tắt ("5 việc lớn, 2 chuyện xấu, +40 vàng"), bấm để mở.

**4.2 Phân loại bằng biểu tượng.** Thêm trường `cat` cho mỗi mục (ánh xạ từ nội dung hiện có, không phải sửa hết 100 chỗ gọi): Tu luyện, Chiến đấu và thương tích, Tiền bạc và đồ, Người quen và gia đình, Tông môn và nghề, Nhiệm vụ, Khám phá và di chuyển, Thế giới. Mỗi loại có biểu tượng nhỏ (dùng bộ icon pixel sẵn có) ở đầu dòng.

**4.3 Ba mức quan trọng thay cho bốn màu.** Việc lớn: thẻ nổi, chữ đậm, có đường kẻ màu bên trái. Việc thường: một dòng. Việc vặt: một dòng nhỏ mờ, tự gộp khi liền nhau ("Đi lại 3 lần, nhóm lò 2 lần"). Tốt/xấu thể hiện bằng màu đường kẻ chứ không tô cả dòng chữ.

**4.4 Bộ lọc nhanh ở đầu khung.** Các nút: Tất cả / Việc lớn / ★ Đánh dấu / Tu luyện / Người / Tiền / Nhiệm vụ / Chiến đấu. Nhớ lựa chọn lần sau. **Bỏ ô tìm chữ** (bạn đã chọn bỏ).

**4.4b Đánh dấu.** Mỗi mục có nút ☆ ở cuối; bấm thì thành ★ và được ghim. Trong nhật ký chỉ còn nút ☆/★ và nút lọc "★ Đánh dấu". **Danh sách đánh dấu và ghi chú riêng (ví dụ "Phải cứu cậu ấy sau khi lên Trúc Cơ") nằm ở mục "★ Đánh dấu" của Hồ sơ nhân vật** (L-ho-so-nhan-vat.md), không lặp ở nhật ký nữa (đã chốt 2026-10-16). Mục đã đánh dấu không bao giờ bị cắt khỏi nhật ký khi vượt giới hạn (tối đa 60 mục ghim).

**4.5 (Đã bỏ) Dòng "Hôm nay".** Thông tin cơ bản (tuổi, cảnh giới, nơi ở, việc đang làm, nhiệm vụ gần hạn) đã có ở Hồ sơ nhân vật và khung Trạng thái nên nhật ký không lặp lại; khung nhật ký chỉ có bộ lọc và danh sách.

**4.6 Sổ đời (xem lại).** Nút "Sổ đời" mở cửa sổ lớn: dòng thời gian cả đời, chỉ gồm việc lớn (sinh, bái sư, đột phá, kết đạo lữ, mất người thân, chuyển vùng...), có thể xem cả đời trước. Nhật ký chính vẫn nhẹ.

**4.7 Chi tiết.** Dòng "Chi tiết" thu gọn thành nút ⓘ, bấm hoặc rê chuột mới hiện, để danh sách gọn.

**4.8 Dung lượng.** Tăng giới hạn lưu của người chơi (hiện `playerLogCap`), mục việc vặt cũ tự gộp để không phình bản lưu.

## 5. Kỹ thuật
- `TT.log(c, text, cls, note)` giữ nguyên chữ ký; thêm `cat` suy ra từ từ khoá/`cls`, có thể truyền tường minh ở tham số thứ 5 cho chỗ quan trọng. Mục cũ không có `cat` thì hiện loại "Khác".
- `renderLog` dựng theo nhóm năm, chỉ dựng lại nhóm mới nhất; giữ chống nháy bằng key như hiện nay.
- Lưu trong bản lưu như cũ (thêm trường tuỳ chọn, không đổi `TT.VERSION`).

## 6. Các chặng
- [x] Chặng 1: nhật ký mới nhất ở trên cùng
- [x] Chặng 2: gom theo năm + ba mức quan trọng + gộp việc vặt
- [x] Chặng 3: phân loại có biểu tượng + bộ lọc (không có ô tìm)
- [x] Chặng 3b: đánh dấu ★ (mục ghim + ghi chú + lọc), giữ không bị cắt khỏi nhật ký
- [x] Chặng 4: nút ⓘ chi tiết (dòng "Hôm nay" và mục Đánh dấu đã bỏ khỏi nhật ký)
- [x] Chặng 5: Sổ đời (việc lớn cả đời, gồm kiếp trước)
- [x] Kiểm thử trong tests.html (phân loại, mục có sao không bị cắt, NPC không tốn phân loại)
- [ ] Chơi thử máy tính và điện thoại
- [ ] Ghi tóm tắt vào KE-HOACH.md, chụp snapshot

## 7. Cần bạn chốt
1. "Chạy ngược lên" mình hiểu là mục mới nhất ở trên cùng. Nếu bạn muốn nghĩa khác (ví dụ chữ trôi lên như phim, hoặc mới ở dưới nhưng cuộn lên), nói mình.
2. Lấy hết 4.1 đến 4.8 hay chỉ một phần? Mình gợi ý làm 4.1, 4.3, 4.4 trước (đỡ rối nhất), 4.2 ngay sau.
3. Có muốn chuyển nhật ký thành một tab ở khung giữa thay vì khung nhỏ dưới cùng như hiện nay?
4. Khung "Thiên hạ" sẽ đổi theo kế hoạch Nhật báo (G); nhật ký này chỉ nói về nhân vật, không lẫn tin thế giới.

## 8. Nhật ký làm việc
- 2026-10-16: đảo thứ tự hiển thị; viết kế hoạch.
- 2026-10-16: theo ý bạn, bỏ khỏi nhật ký mục "★ Đánh dấu" và khối thông tin cơ bản "Hôm nay" vì Hồ sơ nhân vật đã có; demo cập nhật.
- 2026-10-16: làm demo `uimock-nhatky.html`. Theo ý bạn: bỏ ô tìm, thêm đánh dấu ★ (mục ghim + nút lọc). Hồ sơ nhân vật tách thành kế hoạch riêng L-ho-so-nhan-vat.md.

- 2026-10-16: CODE xong. js/ui/journal.js (vẽ nhật ký, Sổ đời), js/core/state.js (TT.logMeta phân loại lazy, TT.log thêm tham số cat, giữ mục có sao khi cắt, giới hạn người chơi 150 lên 400), index.html (khung nhật ký có bộ lọc và nút Sổ đời), css (.j*). Mục cũ trong bản lưu phân loại muộn, không đổi TT.VERSION. Việc vặt gộp theo từng nhóm năm khi liền nhau và cùng loại.
