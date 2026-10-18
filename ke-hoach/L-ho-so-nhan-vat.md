# Hồ sơ nhân vật

- Trạng thái: Đã code (2026-10-16), chờ bạn chơi thử
- Ngày bắt đầu: 2026-10-16
- Liên quan: K-nhat-ky.md (nhật ký mới, đánh dấu, sổ đời), tab "Nhân vật" cũ (js/ui/panels.js), khung nổi Trạng thái (js/ui/dock.js), bản đồ cuộc đời (js/ui/lifemap.js), Biên niên sử (js/ui/history.js)

## 1. Mục tiêu và yêu cầu của bạn
"Đưa kế hoạch chính luôn phần hồ sơ nhân vật đi. Có mấy cái thông tin đã có ở chỗ khác rồi như phần trạng thái hay nhật ký mới, chuẩn bị làm à?"

Hiểu: cần một nơi duy nhất tóm gọn "nhân vật này là ai, đã làm gì, đang ở đâu", gom thông tin đang rải rác, chứ không đẻ thêm bản sao.

## 2. Thông tin hiện đang nằm ở đâu (để khỏi trùng)
| Thông tin | Đang ở | Hướng xử lý |
|---|---|---|
| Sinh lực, tu vi, vàng, tốc độ tu (số sống) | Khung nổi Trạng thái | Giữ nguyên, hồ sơ không lặp lại |
| Tư chất, tiên thiên, đạo tâm, danh vọng, nghiệp, môi trường | Tab "Nhân vật" | Chuyển nguyên khối vào hồ sơ, mục "Chỉ số" (không viết lại) |
| Việc đã xảy ra | Nhật ký (khung dưới) | Giữ ở khung dưới (bản mới, chỉ lọc + danh sách + nút ☆). Danh sách "Đánh dấu" và khối thông tin cơ bản được chuyển hẳn sang hồ sơ (chốt 2026-10-16), nhật ký không lặp lại |
| Quan hệ, gia đình | Tab "Quan hệ", "Gia đình" | Hồ sơ chỉ hiện 3 người thân cận nhất, bấm để sang tab |
| Nghề, đạo, nhiệm vụ | Tab "Nghề", chip "Đạo", tab "Nhiệm vụ" | Hồ sơ hiện một dòng tóm tắt mỗi thứ |
| Hành trình tuổi | Bản đồ cuộc đời | Giữ nguyên |
| Sử thế giới | Biên niên sử | Không liên quan, giữ nguyên |

## 3. Đề xuất thiết kế
Tab "Nhân vật" đổi thành **"Hồ sơ"**, gồm các mục (thanh con ở đầu tab):
1. **Tổng quan:** tên, giới, tuổi/thọ nguyên, kiếp thứ mấy, xuất thân, cảnh giới, tông môn/nghề/đạo, nơi ở, nhiệm vụ lớn đang theo. Ba người thân cận. Một dòng kỷ lục (cảnh giới cao nhất kiếp này, số năm sống, vàng nhiều nhất).
2. **Chỉ số:** nội dung tab "Nhân vật" cũ, giữ nguyên.
3. **Thành tựu và mốc:** danh hiệu, mốc đột phá, mốc đời (từ "Sổ đời" của nhật ký).
4. **Đánh dấu:** các mục nhật ký bạn ghim (xem K-nhat-ky.md), có thể ghi chú.
5. **Kiếp trước:** tóm tắt các kiếp (tuổi mất, cảnh giới, di sản để lại).

Nhật ký không chuyển vào hồ sơ để vẫn thấy khi đang xem tab khác; hồ sơ chỉ là nơi tổng hợp và xem lại.

## 4. Kỹ thuật
- Đổi `ui.addTab({ id:'char' ...})` thành tab có thanh con; thêm hàm dựng "Tổng quan", "Thành tựu", "Kiếp trước" dùng dữ liệu có sẵn (`c.log` mục `big`, `c.pastLives` nếu đã có hoặc tạo mới).
- Dữ liệu kiếp trước: kiểm tra `world.js` (kế thừa) xem đã lưu gì; chỉ thêm trường tuỳ chọn, không đổi `TT.VERSION`.
- Đánh dấu dùng chung trường `star` và `mark` của mục nhật ký (K-nhat-ky.md).

## 5. Các chặng
- [x] Chặng 1: chuyển tab "Nhân vật" thành "Hồ sơ" có thanh con, mục Chỉ số = nội dung cũ
- [x] Chặng 2: mục Tổng quan (có ảnh pixel, danh vọng, đang theo, người thân cận, kỷ lục)
- [x] Chặng 3: mục Đánh dấu (sau khi nhật ký có sao)
- [x] Chặng 4: mục Thành tựu và mốc, mục Kiếp trước
- [ ] Kiểm thử, chơi thử máy tính và điện thoại, ghi KE-HOACH.md, snapshot

## 6. Còn mở / cần chốt
1. Có đồng ý gộp tab "Nhân vật" thành "Hồ sơ" như trên, hay giữ "Nhân vật" và thêm tab "Hồ sơ" riêng?
2. Mục "Kiếp trước" có cần ngay, hay để sau khi làm hệ kế thừa kỹ hơn?
3. Muốn thêm ảnh đại diện pixel của nhân vật ở đầu hồ sơ (dùng sprite có sẵn) không?

## 7. Nhật ký làm việc
- 2026-10-16: viết kế hoạch, chưa code.

- 2026-10-16: bạn chốt: giữ ảnh pixel, Tổng quan đứng đầu và gồm danh vọng, không thêm mục khác. CODE xong: js/ui/profile.js (tab Hồ sơ thay tab Nhân vật cũ), js/ui/panels.js (bảng chỉ số xuất ra ui.playerPanelHtml, bỏ ba dòng danh vọng/thiên hướng/nghiệp), js/ui/side.js (cờ live cho mục Chỉ số vẫn cập nhật khi rê chuột). Thành tựu tính từ trạng thái hiện tại (14 danh hiệu), không lưu thêm dữ liệu.
