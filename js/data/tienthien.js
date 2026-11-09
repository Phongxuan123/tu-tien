// Tiên thiên làm mới (Q-tien-thien.md mục 2, 3, 3b, 4, 5, 6, 9). Chỉ dữ liệu, không có logic.
// Cấu trúc: { id, n, o (ô), p (0 Thường | 1 Hiếm | 2 Quý | 3 Thiên), d (mô tả 1 câu, gồm hiệu ứng),
//   m (hiệu chỉnh số, khóa có trong S.mod: hpMax, atk, nl, kv, luck, gold, train, brk, life),
//   luat (object: khóa luật mục 4 -> giá trị; giá trị là hệ số nhân (×) hoặc true),
//   nguyen (lời nguyền, bắt buộc với p ≥ 2), an (xác suất bị ẩn lúc sinh), dau (dấu hiệu khi còn ẩn),
//   the (thẻ xuất thân ưa, mục 2), vai (vai trong dàn, mục 7) }
// Hiệu ứng số ghi bằng m; hiệu ứng không có khóa trong S.mod chỉ nằm ở d, chờ chặng TT đấu nối.
// Số trong nguyen (ví dụ thọ −15%) chỉ là chữ, chặng TT chuyển thành m hoặc luat khi bật.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.TIEN_THIEN = [
    // ---- Thể ----
    { id: 'than_nhu_sat', n: 'Thân như sắt', o: 'the', p: 0, d: 'Sinh lực tối đa +25.', m: { hpMax: 25 }, luat: {}, an: 0, the: ['p1', 't1'], vai: ['bạn thuở nhỏ'] },
    { id: 'coc_nhuc_mau_lanh', n: 'Cốt nhục mau lành', o: 'the', p: 1, d: 'Thương tật lành nhanh (thời gian ×0,6), sinh lực tối đa +15.', m: { hpMax: 15 }, luat: { lanh: 0.6 }, an: 0.4, dau: 'Vết xước trên người bạn thường khép lại trước khi bạn kịp nhìn.', the: ['p1', 't3'], vai: ['đối thủ'] },
    { id: 'ngu_hanh_linh_the', n: 'Ngũ hành linh thể', o: 'the', p: 2, d: 'Tư chất hệ cao nhất +15, tu luyện nhanh hơn 20%.', m: { train: 0.2 }, luat: { yeu: 1.3 }, nguyen: 'Hương linh thể dẫn dụ yêu thú: gặp yêu thú, quái nhiều hơn 30%.', an: 0.7, dau: 'Đứng gần linh khí, người bạn lúc nóng lúc lạnh không theo lẽ thường.', the: ['p2', 't6'], vai: ['sư phụ'] },
    { id: 'chi_am_chi_duong_the', n: 'Chí âm / Chí dương chi thể', o: 'the', p: 3, d: 'Tu luyện nhanh hơn 45%, đột phá dễ hơn 6%.', m: { train: 0.45, brk: 0.06 }, luat: { 'san:lo_dinh': true }, nguyen: 'Lò đỉnh trời sinh: thọ nguyên giảm 15%; ma tu và tà tông săn bạn làm lò đỉnh.', an: 0.8, dau: 'Kẻ tu tà nhìn bạn như nhìn một món đồ quý, rồi nhẹ nhàng lùi đi.', the: ['p5', 't10'], vai: ['đối thủ'] },

    // ---- Cốt ----
    { id: 'cot_cach_kha', n: 'Cốt cách khá', o: 'cot', p: 0, d: 'Công kích +4, tu luyện nhanh hơn 5%.', m: { atk: 4, train: 0.05 }, luat: {}, an: 0, the: ['p2', 't3'], vai: ['bạn thuở nhỏ'] },
    { id: 'kiem_cot', n: 'Kiếm cốt', o: 'cot', p: 1, d: 'Công kích +8; thắng trận +8%.', m: { atk: 8 }, luat: {}, an: 0.4, dau: 'Tay bạn hay tự cầm kiếm mà không ai dạy, và thanh kiếm dường như biết bạn.', the: ['p2', 't1'], vai: ['đối thủ'] },
    { id: 'dao_cot', n: 'Đạo cốt', o: 'cot', p: 2, d: 'Đột phá dễ hơn 8%, tu luyện nhanh hơn 20%, tâm ma giảm 20%.', m: { brk: 0.08, train: 0.2 }, luat: { 'san:dao_cot': true }, nguyen: 'Bị thèm khát: kẻ tu tà muốn đào cốt của bạn.', an: 0.7, dau: 'Có kẻ nhìn bạn quá lâu ở chợ, rồi lặng lẽ biến mất trong đám đông.', the: ['p3', 't6'], vai: ['sư phụ'] },
    { id: 'tien_cot', n: 'Tiên cốt', o: 'cot', p: 3, d: 'Đột phá dễ hơn 12%, thọ nguyên tăng 20%.', m: { brk: 0.12, life: 0.2 }, luat: { thien_do: true }, nguyen: 'Thiên đố anh tài: mỗi lần đột phá thành công, một người trong dàn gặp họa (thương, bệnh, mất của; không chết nếu chưa đủ luật ba lần).', an: 0.8, dau: 'Mỗi lần bạn tiến một bước lớn, người gần bạn lại gặp chuyện không may.', the: ['p3', 't10'], vai: ['đối thủ', 'bạn thuở nhỏ'] },

    // ---- Đồng ----
    { id: 'mat_tinh', n: 'Mắt tinh', o: 'dong', p: 0, d: 'Công kích +3; tìm thấy tài nguyên và đồ rơi nhiều hơn 15%.', m: { atk: 3 }, luat: {}, an: 0, the: ['p2', 't6'], vai: ['bạn thuở nhỏ'] },
    { id: 'thien_ly_nhi', n: 'Thiên lý nhĩ', o: 'dong', p: 1, d: 'Ở cảnh lớn hiện thêm một dòng "điều bạn nghe được".', m: {}, luat: { nghe: true }, an: 0.4, dau: 'Đôi khi bạn nghe thấy tiếng gọi từ rất xa, không rõ là của ai.', the: ['p3', 't1'], vai: ['sư phụ'] },
    { id: 'linh_giac', n: 'Linh giác', o: 'dong', p: 1, d: 'Né nguy hiểm +20% (sự kiện xấu, phục kích).', m: {}, luat: { ne: 1.2 }, an: 0.4, dau: 'Bạn hay quay đầu lại trước khi có tiếng động, dù chưa ai đến.', the: ['p1', 't3'], vai: ['người đi đường'] },
    { id: 'trung_dong', n: 'Trùng đồng', o: 'dong', p: 2, d: 'Niệm lực +8; mỗi manh mối của cú lật được đánh dấu ngay khi gặp.', m: { nl: 8 }, luat: { manh: true, 'san:mat': true }, nguyen: 'Bị săn: kẻ muốn móc mắt bạn (tuyến phụ "kẻ săn mắt"); dùng nhiều thì đau đầu, mỗi lần đánh dấu manh mối đạo tâm giảm 1.', an: 0.7, dau: 'Đôi lúc nhìn vào gương, bạn thấy mắt mình có hai đồng tử.', the: ['p3', 't6'], vai: ['kẻ thù'] },
    { id: 'thien_nhan', n: 'Thiên nhãn', o: 'dong', p: 3, d: 'Mỗi phần thấy trước một dòng mơ hồ về cao trào sắp tới.', m: {}, luat: { manh: true, thay_truoc: true }, nguyen: 'Thấy mà không đổi được: khi cao trào đến đúng như đã thấy, đạo tâm giảm 3 và tâm ma tăng.', an: 0.8, dau: 'Có lúc bạn thấy một cảnh chưa xảy ra, rồi quên ngay khi tỉnh.', the: ['p5', 't10'], vai: ['sư phụ'] },

    // ---- Huyết ----
    { id: 'ho_huyet', n: 'Hồ huyết', o: 'huyet', p: 1, d: 'Thiện cảm khi gặp người tăng; người thương xuất hiện sớm hơn.', m: {}, luat: { duyen: true }, an: 0.4, dau: 'Có người nhìn bạn lâu hơn bình thường, dù bạn chưa quen họ.', the: ['p2', 't3'], vai: ['người thương'] },
    { id: 'long_huyet', n: 'Long huyết', o: 'huyet', p: 2, d: 'Sinh lực tối đa +40, công kích +6, thọ nguyên tăng 10%.', m: { hpMax: 40, atk: 6, life: 0.1 }, luat: {}, nguyen: 'Máu rồng nóng: tính tình bị kéo dần về phía nóng nảy; tông chính đạo nghi kỵ bạn (thiện cảm khởi đầu thấp).', an: 0.7, dau: 'Bạn dễ sôi máu hơn trước, và có người không ưa bạn ngay từ lần gặp đầu.', the: ['p1', 't1'], vai: ['đối thủ'] },
    { id: 'phuong_huyet', n: 'Phượng huyết', o: 'huyet', p: 3, d: 'Chết một lần thì sống lại.', m: {}, luat: { niet_ban: true }, nguyen: 'Cái giá của niết bàn: mất toàn bộ tu vi của cảnh giới đang ở và quên hẳn một người trong dàn (gắn bó về 0, người ấy nhớ bạn).', an: 0.8, dau: 'Bạn từng chết một lần mà không nhớ, và có người nhìn bạn như đang nhìn người đã mất.', the: ['p5', 't6'], vai: ['người thương', 'sư phụ'] },

    // ---- Mệnh ----
    { id: 'menh_hao', n: 'Mệnh hảo', o: 'menh', p: 0, d: 'Vận may +3.', m: { luck: 3 }, luat: {}, an: 0, the: ['p2', 't1'], vai: ['bạn thuở nhỏ'] },
    { id: 'phuc_duyen', n: 'Phúc duyên', o: 'menh', p: 1, d: 'Khí vận khởi đầu +2; mọi vòng quay +3 (vẫn trần +15).', m: { kv: 2, luck: 3 }, luat: {}, an: 0.4, dau: 'Những việc nhỏ thường trôi chảy hơn bạn tính, như nhặt được đúng lúc.', the: ['p1', 't3'], vai: ['người đi đường'] },
    { id: 'dai_khi_van', n: 'Đại khí vận', o: 'menh', p: 2, d: 'Khí vận khởi đầu +4; kỳ ngộ ×1,5.', m: { kv: 4 }, luat: { ky_ngo: 1.5, hut_van: true }, nguyen: 'Hút vận người khác: người trong dàn gặp xui nhỏ thường hơn (mất của, thương nhẹ).', an: 0.7, dau: 'Người quanh bạn hay than rằng mình gặp xui mà không rõ vì sao.', the: ['p2', 't6'], vai: ['thương hội', 'bạn thuở nhỏ'] },
    { id: 'menh_co_tinh', n: 'Mệnh cô tinh', o: 'menh', p: 2, d: 'Tu luyện nhanh hơn 25%, khí vận +3.', m: { train: 0.25, kv: 3 }, luat: { co: true }, nguyen: 'Cô tinh: người trong dàn chết sớm hơn; luật ba lần hạ còn hai.', an: 0.7, dau: 'Càng ở gần bạn lâu, người ta càng hay gặp chuyện không lành.', the: ['p5', 't10'], vai: ['người thương'] },
    { id: 'thien_menh_chi_tu', n: 'Thiên mệnh chi tử', o: 'menh', p: 3, d: 'Mọi vòng quay +6; kỳ ngộ ×2.', m: { luck: 6 }, luat: { ky_ngo: 2, thien_mang: true }, nguyen: 'Thiên Đạo nhìn bạn: kẻ thù định mệnh dựng sớm và mạnh hơn một bậc; thiên kiếp khó hơn.', an: 0.8, dau: 'Thiên hạ dường như đang chờ điều gì ở bạn, và có một bóng người luôn đứng xa.', the: ['p3', 't10'], vai: ['kẻ thù'] },

    // ---- Tâm ----
    { id: 'tam_tinh', n: 'Tâm tĩnh', o: 'tam', p: 0, d: 'Niệm lực +5, tâm ma giảm 15%.', m: { nl: 5 }, luat: {}, an: 0, the: ['p3', 't6'], vai: ['sư phụ'] },
    { id: 'ngo_tinh', n: 'Ngộ tính', o: 'tam', p: 1, d: 'Tu luyện nhanh hơn 15%.', m: { train: 0.15 }, luat: {}, an: 0.4, dau: 'Bạn hiểu một điều nhanh hơn người khác, đôi khi hơn cả thầy mình.', the: ['p2', 't1'], vai: ['sư phụ'] },
    { id: 'dao_tam_vung', n: 'Đạo tâm vững', o: 'tam', p: 1, d: 'Đạo tâm khởi đầu +10; tính cách trôi chậm hơn và lựa chọn tâm ma khó hiện hơn.', m: {}, luat: { vung: 0.7 }, an: 0.4, dau: 'Có những lúc lòng bạn yên lặng đến lạ, như mặt hồ không gợn.', the: ['p3', 't6'], vai: ['sư phụ'] },
    { id: 'that_khieu_linh_lung', n: 'Thất khiếu linh lung', o: 'tam', p: 2, d: 'Tu luyện nhanh hơn 25%, học công pháp nhanh.', m: { train: 0.25 }, luat: { da_tu: 1.3 }, nguyen: 'Đa tư: tính cách dễ đổi (×1,3); đạo tâm thấp thì tâm ma đến nhiều hơn.', an: 0.7, dau: 'Bạn hay thấy mình khác đi sau mỗi lần ngồi thiền, dù không muốn.', the: ['p1', 't3'], vai: ['sư phụ', 'đối thủ'] },
    { id: 'vo_tinh_dao_tam', n: 'Vô tình đạo tâm', o: 'tam', p: 3, d: 'Đột phá dễ hơn 10%, miễn tâm ma.', m: { brk: 0.1 }, luat: { vo_tinh: 0.5 }, nguyen: 'Không biết thương: gắn bó tăng chậm một nửa; lựa chọn "hy sinh vì người khác" bị khóa khi gắn bó dưới 3.', an: 0.8, dau: 'Bạn nhìn người thân khóc mà lòng vẫn lặng, rồi tự hỏi mình có thiếu gì không.', the: ['p5', 't10'], vai: ['sư phụ', 'đối thủ'] },

    // ---- Tài (nhóm ngoài) ----
    { id: 'tay_kheo', n: 'Tay khéo', o: 'tai', p: 0, d: 'Nghề khí và bùa +15%; vàng kiếm được +10%.', m: { gold: 0.1 }, luat: { nghe_khi: 1.15, nghe_bua: 1.15 }, an: 0, the: ['p2', 't6'], vai: ['thương hội'] },
    { id: 'mui_thinh_thao_duoc', n: 'Mũi thính thảo dược', o: 'tai', p: 0, d: 'Nghề đan +15%; tìm linh thảo nhiều hơn 20%.', m: {}, luat: { nghe_dan: 1.15, tim: 1.2 }, an: 0, the: ['p1', 't3'], vai: ['thầy thuốc'] },
    { id: 'co_khieu_buon', n: 'Có khiếu buôn', o: 'tai', p: 0, d: 'Mua rẻ hơn 5%, bán đắt hơn 5%; thiện cảm thương hội tăng.', m: { gold: 0.05 }, luat: {}, an: 0, the: ['p3', 't1'], vai: ['thương hội'] },
    { id: 'kiem_tam_bam_sinh', n: 'Kiếm tâm bẩm sinh', o: 'tai', p: 1, d: 'Nghề kiếm +25%; thắng trận +5%.', m: {}, luat: { nghe_kiem: 1.25 }, an: 0.4, dau: 'Tay bạn hay siết chặt lại khi nghe tiếng thép chạm nhau.', the: ['p2', 't1'], vai: ['đối thủ'] },
    { id: 'dan_tam', n: 'Đan tâm', o: 'tai', p: 1, d: 'Luyện đan thành công nhiều hơn; thỉnh thoảng phẩm đan cao hơn một bậc.', m: {}, luat: { nghe_dan: 1.2 }, an: 0.4, dau: 'Mùi thuốc sắc luôn khiến bạn tỉnh táo hơn người khác.', the: ['p3', 't3'], vai: ['thầy thuốc'] },
    { id: 'phu_thu', n: 'Phù thủ', o: 'tai', p: 1, d: 'Nghề bùa +25%, vẽ bùa nhanh gấp rưỡi.', m: {}, luat: { nghe_bua: 1.25 }, an: 0.4, dau: 'Nét mực bạn vẽ đôi khi tự dừng đúng chỗ, như có ai hướng dẫn.', the: ['p1', 't6'], vai: ['sư phụ'] },
    { id: 'than_y_thu', n: 'Thần y thủ', o: 'tai', p: 2, d: 'Nghề y +40%; cứu được một người trong dàn khỏi một lần chết vì bệnh hoặc thương.', m: {}, luat: { nghe_y_su: 1.4, cuu: true, y_gia: true, lanh: 1.5 }, nguyen: 'Y giả không tự y: thương tật của chính bạn lành chậm ×1,5; người cầu y tìm đến không dứt (sự kiện cầu cứu tốn thời gian, từ chối thì mất danh).', an: 0.7, dau: 'Người lạ hay tìm đến bạn khi trong nhà có người ốm, dù bạn chưa từng hỏi thăm.', the: ['p3', 't6'], vai: ['thầy thuốc'] },
    { id: 'thien_cong', n: 'Thiên công', o: 'tai', p: 3, d: 'Mọi nghề +40%; thỉnh thoảng làm ra vật phẩm phẩm cao hiếm.', m: {}, luat: { nghe_kiem: 1.4, nghe_khi: 1.4, nghe_dan: 1.4, nghe_bua: 1.4, nghe_tho_mo: 1.4, nghe_tho_san: 1.4, nghe_thuong_nhan: 1.4, nghe_linh_danh: 1.4, nghe_y_su: 1.4, tranh_doat: true }, nguyen: 'Vật hơn người: mỗi món phẩm cao bạn làm ra kéo tới một kẻ tranh đoạt; nghề ăn mất thời gian tu (tu luyện giảm 15%).', an: 0.8, dau: 'Đồ bạn làm ra thường bền hơn đồ người khác, đến mức có người trả giá lạ.', the: ['p5', 't10'], vai: ['thương hội', 'kẻ thù'] },

    // ---- Duyên (nhóm ngoài) ----
    { id: 'mieng_ngot', n: 'Miệng ngọt', o: 'duyen', p: 0, d: 'Thiện cảm khi giao du tăng 20%.', m: {}, luat: {}, an: 0, the: ['p2', 't1'], vai: ['thương hội'] },
    { id: 'mat_mui_de_tin', n: 'Mặt mũi dễ tin', o: 'duyen', p: 0, d: 'Thuyết phục, mặc cả, lừa dễ hơn; người ta hay nhờ vả bạn.', m: {}, luat: {}, an: 0, the: ['p1', 't3'], vai: ['người đi đường'] },
    { id: 'quy_nhan_phu_tro', n: 'Quý nhân phù trợ', o: 'duyen', p: 1, d: 'Mỗi phần kịch bản có một lần người lạ giúp ở cửa ải; thử thách có hạn giảm 20% yêu cầu.', m: {}, luat: { quy_nhan: 0.8 }, an: 0.4, dau: 'Khi bạn sắp bế tắc, một người xa lạ thường xuất hiện đúng lúc.', the: ['p3', 't6'], vai: ['người đi đường'] },
    { id: 'khi_chat_lanh_tu', n: 'Khí chất lãnh tụ', o: 'duyen', p: 1, d: 'Thu đồ đệ dễ; công đóng góp tông +15%; thăng bậc tông nhanh hơn.', m: {}, luat: {}, an: 0.4, dau: 'Người khác thường đứng về phía bạn trước khi bạn kịp mở lời.', the: ['p2', 't10'], vai: ['đối thủ'] },
    { id: 'dao_hoa', n: 'Đào hoa', o: 'duyen', p: 2, d: 'Nhiều người nảy tình với bạn.', m: {}, luat: { duyen: 2, dao_hoa: true }, nguyen: 'Nợ tình: người bị bạn từ chối có thể thành tình địch hoặc kẻ thù; đạo lữ dễ ghen, gắn bó với đạo lữ khó giữ.', an: 0.7, dau: 'Ánh nhìn của người lạ dừng ở bạn lâu hơn mức lịch sự.', the: ['p1', 't6'], vai: ['người thương'] },
    { id: 'hiep_danh', n: 'Hiệp danh', o: 'duyen', p: 2, d: 'Danh vọng tăng gấp đôi khi làm việc nghĩa.', m: {}, luat: { hiep_danh: true }, nguyen: 'Danh lớn thì giặc nhiều: kẻ thách đấu, kẻ ghen danh tìm tới; từ chối người cầu cứu thì mất danh gấp đôi.', an: 0.7, dau: 'Tên bạn đôi khi được nhắc đến ở nơi bạn chưa từng đặt chân.', the: ['p2', 't3'], vai: ['kẻ thù', 'đối thủ'] },

    // ---- Dị (nhóm ngoài) ----
    { id: 'ngu_it', n: 'Ngủ ít', o: 'di', p: 0, d: 'Nghỉ ngơi ngắn hơn; tu luyện nhanh hơn 5%.', m: { train: 0.05 }, luat: {}, an: 0, the: ['p1', 't1'], vai: ['người đi đường'] },
    { id: 'giac_mo_bao_truoc', n: 'Giấc mơ báo trước', o: 'di', p: 1, d: 'Mỗi phần có một giấc mơ mơ hồ về điều sắp tới.', m: {}, luat: { mo_bao: true }, an: 0.4, dau: 'Bạn hay thức giữa đêm với cảm giác vừa quên mất một điều quan trọng.', the: ['p3', 't10'], vai: ['sư phụ'] },
    { id: 'thu_ngu', n: 'Thú ngữ', o: 'di', p: 1, d: 'Yêu thú ít tấn công (gặp yêu thú giảm 25%); có thể thuần một linh thú qua sự kiện.', m: {}, luat: { yeu: 0.75 }, an: 0.4, dau: 'Chim rừng và thú hoang thường đứng im khi bạn đi qua.', the: ['p1', 't3'], vai: ['thợ săn'] },
    { id: 'thong_linh', n: 'Thông linh', o: 'di', p: 2, d: 'Ở chặng gặt và cao trào, người trong dàn đã chết có thể "nói" một câu.', m: {}, luat: { thong_linh: true }, nguyen: 'Âm khí: thọ nguyên giảm 10%; tâm ma đến nhiều hơn; tà tông luyện hồn để ý bạn.', an: 0.7, dau: 'Đôi lúc bạn nghe tiếng thở dài từ phía sau, nhưng không có ai.', the: ['p5', 't10'], vai: ['kẻ thù'] },
    { id: 'bach_doc_bat_xam', n: 'Bách độc bất xâm', o: 'di', p: 2, d: 'Miễn độc (mưa độc, độc trong sự kiện); sống khỏe ở vùng đầm độc.', m: {}, luat: {}, nguyen: 'Thuốc cũng không vào: đan dược hồi phục và đột phá chỉ còn nửa hiệu quả.', an: 0.7, dau: 'Mùi đầm lầy không làm bạn khó chịu như người khác, và chén thuốc đắng nào cũng nhạt như nước.', the: ['p3', 't1'], vai: ['thầy thuốc'] },
    { id: 'luan_hoi_ky_uc', n: 'Luân hồi ký ức', o: 'di', p: 3, d: 'Khởi đầu nhớ một công pháp kiếp trước; mỗi phần hé lộ một mảnh ký ức kiếp trước.', m: {}, luat: { tien_kiep: true, thien_mang: true }, nguyen: 'Nợ kiếp trước: kẻ thù kiếp trước tìm đến (kẻ thù định mệnh dựng sớm); tính cách bị kéo dần về phía tính cách kiếp trước.', an: 0.8, dau: 'Có những cảnh bạn chưa từng đến mà thấy quen đến nhói lòng.', the: ['p5', 't6'], vai: ['kẻ thù', 'sư phụ'] },

    // ---- Tật (không chiếm ô; an = 0) ----
    { id: 'the_nhuoc', n: 'Thể nhược', o: 'tat', p: 0, d: 'Sinh lực tối đa −20.', m: { hpMax: -20 }, luat: {}, an: 0, the: ['p1', 't3'], vai: ['người nhà'] },
    { id: 'luoi_bieng', n: 'Lười biếng', o: 'tat', p: 0, d: 'Tu luyện chậm hơn 10%.', m: { train: -0.1 }, luat: {}, an: 0, the: ['p2', 't1'], vai: ['bạn thuở nhỏ'] },
    { id: 'xui_xeo', n: 'Xui xẻo', o: 'tat', p: 0, d: 'Vận may −3.', m: { luck: -3 }, luat: {}, an: 0, the: ['p5', 't3'], vai: ['người đi đường'] },
    { id: 'hay_quen', n: 'Hay quên', o: 'tat', p: 0, d: 'Niệm lực −4; "Nhìn lại" sau cú lật thiếu một manh mối.', m: { nl: -4 }, luat: {}, an: 0, the: ['p2', 't6'], vai: ['người nhà'] },
    { id: 'da_benh', n: 'Đa bệnh', o: 'tat', p: 1, d: 'Sinh lực tối đa −25, hay đổ bệnh.', m: { hpMax: -25 }, luat: {}, an: 0, dau: 'Bạn hay mệt không rõ lý do dù đã nghỉ đủ.', the: ['p5', 't3'], vai: ['người nhà'] },
    { id: 'tho_ngan', n: 'Thọ ngắn', o: 'tat', p: 1, d: 'Thọ nguyên giảm 15%.', m: { life: -0.15 }, luat: {}, an: 0, dau: 'Người già trong làng hay nhìn bạn với vẻ tiếc nuối.', the: ['p5', 't10'], vai: ['người nhà'] },
    { id: 'tam_ma', n: 'Tâm ma quấn thân', o: 'tat', p: 1, d: 'Đột phá khó hơn 6%; lựa chọn tâm ma hiện cả khi đạo tâm chưa thấp.', m: { brk: -0.06 }, luat: { tam_ma: true }, an: 0, dau: 'Trong giấc ngủ bạn thường nghe tiếng ai đó gọi tên mình.', the: ['p5', 't6'], vai: ['kẻ thù'] }
  ];

  D.tienThienById = {};
  D.TIEN_THIEN.forEach(t => { D.tienThienById[t.id] = t; });

  // Luật bốc và chuyển bản cũ (mục 4, 5, 6, 9). Tỉ lệ là xác suất mỗi lần bốc.
  D.TIEN_THIEN_RULES = {
    // Công tắc: true thì người chơi dùng c.tt (tiên thiên làm mới); false thì dùng c.traitIds cũ như trước. NPC luôn dùng traitIds.
    on: true,
    // Tỉ lệ phẩm (p -> xác suất). Mỗi lần bốc ra Quý hoặc Thiên thì tỉ lệ phẩm ấy giảm một nửa ở lần bốc sau.
    phamTiLe: { 0: 0.50, 1: 0.30, 2: 0.15, 3: 0.05 },
    giamMotNua: [2, 3],
    // Số tiên thiên chuẩn lúc sinh (1/2/3) và số tật (0/1/2). Chỉ người chơi; NPC giữ cách cũ.
    soChuan: { 1: 0.50, 2: 0.35, 3: 0.15 },
    soTat: { 0: 0.55, 1: 0.35, 2: 0.10 },
    // Trần: tổng số Quý và Thiên của một người tối đa 3.
    tranQuyThien: 3,
    // 9 nhóm (ô); mỗi người tối đa một tiên thiên mỗi nhóm; tật không chiếm nhóm.
    nhom: ['the', 'cot', 'dong', 'huyet', 'menh', 'tam', 'tai', 'duyen', 'di'],
    // Trọng số ×2 khi thẻ xuất thân khớp mục "the" của tiên thiên.
    trongSoThe: 2,
    // Ẩn lúc sinh theo phẩm (an trong từng mục, đây là bản tóm tắt để kiểm).
    anTheoPham: { 0: 0, 1: 0.4, 2: 0.7, 3: 0.8 },
    // Cửa thức tỉnh (mục 5): tuổi thơ (wake), Tổng kết 12 tuổi (mỗi mục ẩn 30%), đột phá thành công (50%), cảnh lớn (fx.tt_thuc).
    cuaThucTinh: { tongKet12: 0.3, dotPha: 0.5, canhLon: 'fx.tt_thuc', tuoiTho: 'wake' },
    // Mất chỉ qua hậu quả truyện.
    matTai: 'fx.tt_mat',
    // Bảng chuyển bản lưu cũ (mục 9): id cũ (traitIds) -> id mới (c.tt). Tật cùng tên giữ id.
    chuyenBanCu: {
      than_cuong: 'than_nhu_sat',
      mat_tinh: 'mat_tinh',
      tay_kheo: 'mat_tinh',
      tam_tinh: 'tam_tinh',
      menh_hao: 'menh_hao',
      ngo_tinh: 'ngo_tinh',
      phuc_duyen: 'phuc_duyen',
      cot_cach: 'cot_cach_kha',
      dao_the: 'dao_cot',
      dai_khi_van: 'dai_khi_van',
      menh_co_tinh: 'menh_co_tinh',
      the_nhuoc: 'the_nhuoc',
      hay_quen: 'hay_quen',
      xui_xeo: 'xui_xeo',
      luoi_bieng: 'luoi_bieng',
      tam_ma: 'tam_ma',
      tho_ngan: 'tho_ngan',
      da_benh: 'da_benh'
    }
  };
})();
