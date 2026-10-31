// Khuôn "Mưu mô" (Xử thế dương), chép từ ke-hoach/Q-khuon-kich-ban.md mục 6 thành dữ liệu (K3a). Cấu trúc theo js/data/khuon/kieu_hanh.js.
// Ghi chú chép (K3a, Haiku):
//   - Khuyết điểm gốc: muu_mo (thuốc "niềm tin" trùng với kds.muu_mo).
//   - Dàn: Quỷ Diện là ke_thu (quân cờ của sư phụ bạn trong lật a); Hàn Thất là guong (dàn huynh); sư phụ là su; mẹ Hàn Thất là than_nhan; người thương (phụ) là ban (dàn thuong).
//   - Phụ: phu[0] = Quỷ Diện (vật quân cờ ngọc đen), phu[1] = người thương (vật chuỗi hạt có sẵn, mục 6 không ghi vật).
//   - Muốn chỉ có một câu gốc: a tong / b vung là biến thể cùng ý, c tan_tu giữ ý gốc.
//   - Kiểu "(ngược)" chưa ghi kiểu cụ thể được chọn theo nghĩa: phần 1 "nhận tội" = phuc_tung; phần 2 "chia vế, kể thật" = tin; phần 3 "báo cho Hàn Thất" = tin; phần 4 "không gửi mật thư" = hy_sinh; phần 5 "đọc to sự thật" = tin (vt nguoc); phần 6 "tin người bạn đi nước" = tin.
//   - Phần 5 "nâng chén như không quen" (dung_khuyet_diem) và "đổi bằng tài sản của tông" (duong_tat) đúng theo mục 6; cảnh phản đòn "Ta có nói trả người sống đâu." đặt trong sau của duong_tat.
//   - Lật (b) có manh P5 ("nhìn bạn rất quen mà không gọi") nhưng lint không cho manh mối ở phần nổ trở đi: dời cue này sang phần 4 (treo).
//   - Khong_ke_ac: "mẹ Hàn Thất hấp hối" đặt ở phần 3 leo (lon, kiểu) để chạy đường builder đã có (bản gốc ghi "phần 3", không ghi chặng).
//   - Nơi cấm "tổng đàn của thế lực kề bên" là cam (mục 6 có ghi "tổng đàn", nên không phải tên tôi đặt).
//   - Thử thách có hạn (tt) đặt ở phần 2 leo "tự kể cho sư phụ" và phần 6 leo.
(function () {
  const D = window.TT.data;

  D.STORY.regKhuon({
    id: 'muu_mo', ten: 'Mưu mô', khuyet_diem: 'muu_mo',
    cau_hoi_trung_tam: 'Người ta sống được với nhau bằng tính toán, hay bằng tin nhau?',
    logline: 'Người muốn nắm mọi sợi dây rồi phát hiện mình đã bị giật bởi chính sợi dây của thầy; người bạn tin nhất vẫn đi vào hang vì tin mình.',
    bay_manh: {
      vet_thuong: [
        { id: 'a', xt: ['p1', 'p2'], vet: 'cha tin bạn bè, bị lừa mất hết',
          canh: 'Cha bạn tin bạn bè như tin anh em, rồi bị họ lừa sạch gia sản; bạn đứng nhìn cha ngồi bệt giữa sân nhà trống.' },
        { id: 'b', xt: ['p5'], vet: 'tin một người lớn, bị bán cho gánh xiếc',
          canh: 'Bạn còn nhỏ tin một người lớn cho đi theo, và bị bán cho một gánh xiếc để lấy mấy đồng bạc lẻ.' },
        { id: 'c', xt: ['p3', 't10'], vet: 'cha làm quan bị chính em ruột tố giác',
          canh: 'Cha bạn làm quan, bị chính em ruột của ông viết giấy tố giác; bạn thấy ông bị dẫn đi và không bao giờ về nữa.' }
      ],
      loi_noi_doi: 'Đừng tin ai; ai cũng là quân cờ.',
      muon: [
        { id: 'a', cho: 'tong', t: 'nắm mọi sợi dây trong tông: phó chưởng môn, rồi người quyết định của cả tông' },
        { id: 'b', cho: 'vung', t: 'nắm mọi sợi dây trong vùng, không ai đi nước nào mà bạn không biết' },
        { id: 'c', cho: 'tan_tu', t: 'nắm mọi sợi dây trong tay mình, không cần ai đứng cạnh' }
      ],
      can: 'đặt cược vào người khác mà không kiểm soát được',
      bong_toi: { vai: 'ke_thu', cach_chon: 'Quỷ Diện, giáo chủ thế lực mạnh kề bên, kẻ thao túng giỏi hơn, coi bạn là quân cờ; ra mắt từ phần 1',
        ra_mat: [
          'Quỷ Diện đeo mặt nạ bạc, nói chuyện nhẹ như đùa, và gọi tên bạn trước khi bạn kịp giới thiệu',
          'Quỷ Diện ngồi bên bàn cờ ở quán trà, đặt một quân cờ ngọc đen xuống và nói như nói chuyện thời tiết',
          'Quỷ Diện đứng sau lưng bạn trong sân, tay chắp sau lưng, mắt lúc nào cũng nhìn theo người đứng cạnh bạn'
        ] },
      guong: { vai: ['huynh'], dd: 'người tin người tới ngây thơ, mỗi đêm vẫn giữ một vế đối của mình' },
      hy_sinh: 'ghế, mạng lưới tin tức, mạng sống'
    },
    dan: { ke_thu: 'ke_thu', guong: ['huynh'], su: 'su', doi_thu: 'doi_thu', than_nhan: 'than_nhan', ban: 'thuong' },
    soi: {
      chinh: { nguoi: 'guong', vat: [
        { id: 've_doi', canh: '{guong} đưa cho bạn một vế câu đối làm mật hiệu, còn vế kia giữ trong tay mình, và hai người cùng nhìn nhau cười.', treo: '{guong} gấp vế đối của mình vào sách, nói rằng ngày nào gặp lại sẽ đối tiếp cho bạn.' }
      ] },
      phu: [
        { nguoi: 'ke_thu', vat: [{ id: 'quan_co_ngoc' }] },
        { nguoi: 'ban', vat: [{ id: 'chuoi_hat' }] }
      ]
    },
    noi: { chinh: 'sơn môn', tong: 'nghị sự đường', cam: ['tổng đàn của thế lực kề bên'] },
    thang_suc_manh: [
      { realm: 0, dinh: 'người đứng đầu ngoại môn' },
      { realm: 1, stage: 0, dinh: 'đệ tử nội môn có tiếng' },
      { realm: 1, stage: 2, dinh: 'đệ nhất nội môn, người được chọn làm chân truyền' },
      { realm: 2, dinh: 'trưởng lão, người đứng đầu một vùng nhỏ' },
      { realm: 3, dinh: 'cái tên người ta nhắc như huyền thoại' }
    ],
    phan: [
      // ---------- Phần 1. Quân cờ đầu: ai gánh tội ----------
      { id: 'quan_co_dau', n: 'Quân cờ đầu', chuc_nang: 'biến cố khởi đầu; ai gánh tội', tuoi: 12, cau_hoi: 'Ai gánh tội?',
        biet: '{ke_thu} đã đứng nhìn từ đầu đến cuối.', thang_vui: 'chưởng sự khen bạn lanh', cai_mat: 'một người bạn cùng phòng, hoặc lòng tin của Hàn Thất',
        chang: {
          moc: { t: 'Vụ mất trộm',
            d: 'Ở ngoại môn, một túi tiền của chưởng sự biến mất khỏi phòng nghị sự. Cả dãy phòng đứng lên đợi người ta tìm ra kẻ lấy túi, và ai cũng liếc nhìn bạn cùng phòng đang đứng im ở cuối hành lang.',
            lc: [
              { key: 'lam_chung', label: 'Đứng ra làm chứng cho bạn cùng phòng', kind: 'help', mat: 'Một lời nói có thể đổi lấy một ghế ngồi.' },
              { key: 'cui_nhin', label: 'Im lặng, nhìn xuống đất', kind: 'safe', mat: 'Một đêm yên ổn trong phòng.' }
            ] },
          leo: { t: 'Chưởng sự',
            d: 'Chưởng sự gọi bạn vào, hỏi ai đã ở gần phòng nghị sự tối qua. Ông nhìn bạn một lúc, rồi mỉm cười như đã tìm ra người có thể dùng được.',
            lc: [
              { key: 'thay_bong', label: 'Nói bạn có thấy một bóng người lạ', kind: 'risk', mat: 'Một lời nói không ai kiểm chứng được.' },
              { key: 'khong_thay', label: 'Nói bạn không thấy gì', kind: 'safe', mat: 'Một sự thật nhạt như nước.' }
            ] },
          cao_trao: { t: 'Ai gánh tội', lon: true, canh: { gio: 'dem', thoi_tiet: 'suong_doc' },
            d: 'Túi tiền đã nằm trong tay bạn cùng phòng, và ai cũng tin đó là kẻ trộm. Hàn Thất đứng bên cạnh bạn, mắt nhìn bạn không chớp, như chờ bạn quyết định ai sẽ gánh tội.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'guong', label: 'Đổ cho bạn cùng phòng', mat: 'Danh của một đứa bạn, và một cái tên bạn để lại.',
                sau: 'Bạn chỉ tay về phía bạn cùng phòng, và cả dãy phòng gật đầu như đã đoán trước. Hàn Thất bước ra khỏi hàng và nói rằng hắn mới là người làm mất túi.',
                hau: 'Chưởng sự khen bạn lanh, và bạn nhớ mãi cái nhìn của bạn cùng phòng.' },
              { kieu: 'phuc_tung', vt: 'nguoc', doi: 'ban', cuu: 'guong', label: 'Nhận tội', mat: 'Chỗ đứng trong dãy phòng, và cái nhục trước mặt mọi người.',
                sau: 'Bạn bước ra giữa sân, cúi đầu nhận là mình đã lấy túi tiền. Chưởng sự quất roi, và mỗi roi đều làm bạn nhớ tới chuyện này.',
                hau: 'Cả dãy phòng nhìn bạn khác đi, và bạn biết mình vừa mua được một chỗ đứng bằng nỗi nhục.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'ban', cuu: 'guong', label: 'Im lặng, không nói gì', mat: 'Một người phải chịu thay sự im lặng của bạn.',
                sau: 'Bạn giữ im lặng, và bạn cùng phòng bị đưa đi trong tiếng khóc. Hàn Thất bước ra nhận tội thay, và không ai hỏi vì sao.',
                hau: 'Từ đó bạn nhớ mãi cảm giác được một người khác đứng ra thay mình.' }
            ] },
          treo: { t: 'Hàn Thất bị phạt quỳ',
            d: 'Hàn Thất bị phạt quỳ giữa sân suốt đêm, và khi bạn đi ngang, hắn cười với bạn như chưa có chuyện gì. Nụ cười ấy làm bạn thấy nợ, và không biết nợ ai.',
            lc: [
              { key: 'mang_nuoc', label: 'Mang nước cho hắn', kind: 'help', mat: 'Một chút công khai, và một người bị nhìn thấy.' },
              { key: 'di_thang', label: 'Đi thẳng, không nhìn', kind: 'safe', mat: 'Một nợ ân không ai nhắc tới.' }
            ] }
        } },
      // ---------- Phần 2. Câu đối: tin hay dùng ----------
      { id: 'cau_doi', n: 'Câu đối', chuc_nang: 'tin hay dùng', tuoi: 30, cau_hoi: 'Tin hay dùng?',
        biet: '{ke_thu} đã nghe chuyện vế đối của bạn.', thang_vui: 'đêm hai người say, đối nhau câu đối', cai_mat: 'lòng tin của Hàn Thất, hoặc một mật hiệu bạn tự dựng',
        chang: {
          moc: { t: 'Nghị sự đường',
            d: 'Bạn được ngồi vào hàng sau trong nghị sự đường, và thấy Quỷ Diện mặc áo đen, tay xoay một quân cờ ngọc đen. Hàn Thất ngồi cạnh bạn, tay gõ nhẹ lên vế đối của mình.',
            lc: [
              { key: 'nhin_qd', label: 'Nhìn Quỷ Diện không chớp', kind: 'risk', mat: 'Một ánh nhìn mà hắn sẽ nhớ.' },
              { key: 'nhin_ban', label: 'Nhìn xuống bàn, không nhìn ai', kind: 'safe', mat: 'Một buổi họp không ai nhớ mặt bạn.' }
            ] },
          leo: { t: 'Thư phòng thầy',
            d: 'Sư phụ gọi bạn vào thư phòng, hỏi về vế đối như hỏi một chuyện nhỏ. Trên bàn, một quân cờ ngọc đen nằm cạnh tách trà còn nóng.',
            lc: [
              { key: 'ke_thay', label: 'Kể cho sư phụ nghe về vế đối', kind: 'risk', mat: 'Một lời kể đã ra khỏi miệng.', tt: { can: { xp: 0.2 }, han: 24 } },
              { key: 'noi_khong', label: 'Nói bạn chẳng nhớ gì', kind: 'safe', mat: 'Một lời dối nhỏ, và sư phụ biết.' }
            ] },
          // Cảnh lớn: kết nghĩa
          cao_trao: { t: 'Kết nghĩa', lon: true, canh: { gio: 'dem', thoi_tiet: 'mua' },
            d: 'Đêm kết nghĩa, hai người ngồi đối diện trên bàn đá, mỗi người giữ một vế đối và chờ người kia đọc. Quỷ Diện đứng ngoài hiên nhìn vào, không ai biết hắn đã nghe được bao nhiêu.',
            kieu: [
              { kieu: 'tin', vt: 'nguoc', doi: 'ke_thu', cuu: 'guong', label: 'Chia vế mật hiệu và kể thật về đời mình', mat: 'Một bí mật bạn giữ từ thuở nhỏ.',
                sau: 'Bạn chia vế đối cho Hàn Thất và kể hết đời mình, từ cái tát của cha đến chuyện bị bán cho gánh xiếc. Hàn Thất nghe, không ngắt lời, và đọc vế đối của mình như một lời hứa.',
                hau: 'Hàn Thất giữ lời thề ấy, và đó là điều duy nhất bạn không tính được.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'guong', cuu: 'guong', label: 'Kết nghĩa giả để dùng', mat: 'Một mối quan hệ dựng lên để lợi dụng người khác.',
                sau: 'Bạn kết nghĩa với Hàn Thất như thể đó là một quân cờ, nói những lời thật được tính toán sẵn. Hàn Thất cười rất tin, và bạn không thấy trong mắt hắn có gì khác ngoài sự tin.',
                hau: 'Hàn Thất tin bạn vì bạn đã cho hắn một lý do để tin, và bạn đã dùng nó.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'guong', cuu: 'ban', label: 'Từ chối kết nghĩa', mat: 'Một người bạn không có ai bên cạnh.',
                sau: 'Bạn đứng dậy và nói chưa có lúc cho chuyện ấy. Hàn Thất nhìn bạn một lúc rồi cất vế đối vào trong áo, không hỏi vì sao.',
                hau: 'Bạn bỏ lỡ một người bạn, và không ai tới thay.' }
            ] },
          treo: { t: 'Quỷ Diện để ý tông bạn',
            d: 'Đêm đó, Quỷ Diện gửi một hộp ngọc đen tới phòng bạn, không kèm một lời nào. Trong hộp chỉ có một quân cờ, mặt dưới khắc tên tông của bạn.',
            lc: [
              { key: 'mo_hop', label: 'Mở hộp, nhìn quân cờ lâu', kind: 'risk', mat: 'Một đêm không ngủ được.' },
              { key: 'cat_hop', label: 'Đóng hộp, cất vào ngăn bàn', kind: 'safe', mat: 'Một món quà bạn chưa hiểu.' }
            ] }
        } },
      // ---------- Phần 3. Nằm vùng: ai đi vào hang (mẹ Hàn Thất hấp hối ở cảnh lớn không có kẻ ác) ----------
      { id: 'nam_vung', n: 'Nằm vùng', chuc_nang: 'ai đi vào hang; mẹ Hàn Thất hấp hối', tuoi: 55, canh: { realm: 1 }, cau_hoi: 'Ai đi vào hang?',
        biet: '{guong} đang ở trong tổng đàn của thế lực kề bên.', thang_vui: 'lần đầu được ngồi nghị sự đường', cai_mat: 'một người bạn, hoặc mẹ Hàn Thất',
        chang: {
          moc: { t: 'Lời đồn tổng đàn',
            d: 'Tin về tổng đàn của thế lực kề bên lan trong tông, rằng ở đó mỗi người bước vào đều phải nộp một bí mật. Bạn nghe mà không tin, cho tới khi thấy Quỷ Diện xoay quân cờ ngọc đen đúng nhịp với lời đồn ấy.',
            lc: [
              { key: 'nghe_het', label: 'Nghe lời đồn tới cuối', kind: 'risk', mat: 'Một đêm không yên ổn.' },
              { key: 'bo_di', label: 'Bỏ đi, không hỏi lại', kind: 'safe', mat: 'Một điều bạn sẽ không bao giờ biết.' }
            ] },
          // Cảnh lớn KHÔNG có kẻ ác (khong_ke_ac): mẹ Hàn Thất hấp hối
          leo: { t: 'Mẹ hấp hối', lon: true, canh: { gio: 'hoang_hon', thoi_tiet: 'suong_doc' },
            d: 'Thư từ thôn dưới núi báo tin mẹ Hàn Thất đang hấp hối, và bà cứ gọi tên con mình. Hàn Thất đang nằm vùng trong tổng đàn, không thể rời đi mà không lộ thân phận.',
            kieu: [
              { kieu: 'tin', vt: 'nguoc', doi: 'than_nhan', cuu: 'guong', label: 'Báo cho Hàn Thất, để hắn tự quyết', mat: 'Thân phận của Hàn Thất, và một người bạn tin bạn.',
                sau: 'Bạn viết một bức thư ngắn gửi vào tổng đàn, chỉ có một dòng về mẹ hắn. Hàn Thất nhận được, và lần đầu tiên thư của hắn không có chữ nào về tin tức.',
                hau: 'Hàn Thất trở về thôn trong đêm, và thân phận của hắn lộ ra trước khi kịp làm gì.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'than_nhan', cuu: 'than_nhan', label: 'Không báo, để bà chết không gặp con', mat: 'Sự an toàn của kế hoạch, và một người mẹ không kịp gặp con.',
                sau: 'Bạn giữ im lặng, và kế hoạch vẫn chạy đúng như đã tính. Vài ngày sau, thư báo về rằng bà đã mất trong đêm, với một cái tên được gọi nhiều lần.',
                hau: 'Thư của Hàn Thất ngày càng thưa.' }
            ] },
          // Cảnh lớn: ai đi vào hang
          cao_trao: { t: 'Ai đi vào hang', lon: true, canh: { gio: 'dem', thoi_tiet: 'mua' },
            d: 'Quỷ Diện đặt trước bạn một danh sách, và trên đó có hai cái tên: Hàn Thất và bạn. Hắn nói rõ rằng chỉ một người được gửi vào tổng đàn, và người còn lại sẽ phải ở lại làm con tin.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'guong', cuu: 'ban', label: 'Gửi Hàn Thất vào tổng đàn', mat: 'Một người bạn không trở về, và một thứ bạn không dám nói tên.',
                sau: 'Bạn gật đầu, và Hàn Thất bước đi trước mà không ngoái lại. Cửa tổng đàn đóng, và tiếng bước chân của hắn tan dần trong sương.',
                hau: 'Tin của Hàn Thất ngày càng thưa, và bạn không hỏi ai về hắn nữa.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ban', cuu: 'guong', label: 'Tự đi vào tổng đàn', mat: 'Ghế, mạng lưới tin tức, và có thể cả mạng sống.',
                sau: 'Bạn bước vào tổng đàn trước khi Hàn Thất kịp nói. Cánh cửa khép lại sau lưng, và bạn nghe thấy tiếng Hàn Thất gọi tên mình rất khẽ.',
                hau: 'Bạn ở trong tổng đàn, và mỗi thư bạn gửi ra đều được đọc trước.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'guong', cuu: 'guong', label: 'Không gửi ai, mất công lớn', mat: 'Một kế hoạch đã dựng lâu, nay đổ.',
                sau: 'Bạn từ chối, và cả dự án nằm im trên bàn. Quỷ Diện mỉm cười, nói rằng hắn sẽ tìm cách khác, rồi đóng sổ lại.',
                hau: 'Hàn Thất không được gửi đi, nhưng cũng không được tha.' }
            ] },
          treo: { t: 'Tin ngày càng thưa',
            d: 'Hàn Thất đã nằm vùng hơn một năm, và thư của hắn ngày càng thưa. Có lần một tờ giấy chỉ viết một chữ "ổn", và chữ ấy làm bạn không thể ngủ.',
            lc: [
              { key: 'viet_hoi', label: 'Viết thư hỏi thẳng', kind: 'risk', mat: 'Một lá thư có thể lộ tất cả.' },
              { key: 'cho_them', label: 'Chờ thêm một chữ nữa', kind: 'safe', mat: 'Một đêm nữa không biết tin gì.' }
            ] }
        } },
      // ---------- Phần 4. Hiệp ước (chiến thắng giả): đổi một người lấy một ghế ----------
      { id: 'hiep_uoc', n: 'Hiệp ước', chuc_nang: 'chiến thắng giả: đổi một người lấy một ghế', tuoi: 85, canh: { realm: 1, stage: 2 }, cau_hoi: 'Đổi một người lấy một ghế?',
        biet: '{ke_thu} biết bạn đã nghe lời thầy.', thang_vui: 'đại tiệc phong phó chưởng môn', cai_mat: 'ghế, hoặc người bạn còn lại',
        chang: {
          moc: { t: 'Phó chưởng môn',
            d: 'Bạn được gọi lên ngồi ghế phó chưởng môn, và tiếng vỗ tay vang lên như mưa đầu hạ. Trên ghế bên cạnh, Quỷ Diện mỉm cười, nói rằng cuộc đời này chỉ có những người biết đổi quân.',
            lc: [
              { key: 'nhan_ghe', label: 'Nhận ghế, cảm ơn mọi người', kind: 'safe', mat: 'Một chỗ ngồi cao hơn tất cả.' },
              { key: 'hoi_qd', label: 'Nhìn Quỷ Diện, hỏi hắn đổi gì', kind: 'risk', mat: 'Một câu hỏi làm nụ cười của hắn tắt đi.' }
            ] },
          leo: { t: 'Mật thư',
            d: 'Một mật thư được đặt trên bàn, nói rằng tổng đàn sẵn sàng ký hiệp ước nếu bạn trao lại thân phận của một người trong nội tông. Chữ ký dưới cùng là của Quỷ Diện, còn cái tên được nhắc tới là Hàn Thất.',
            lc: [
              { key: 'doc_to', label: 'Đọc to mật thư cho cả nghị sự đường', kind: 'risk', mat: 'Một lời đã nói ra không thể thu lại.' },
              { key: 'cat_tay_ao', label: 'Cất mật thư vào tay áo', kind: 'safe', mat: 'Một bí mật bạn tự giữ.' }
            ] },
          // Cảnh lớn: mật thư
          cao_trao: { t: 'Mật thư', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Trong nghị sự đường, bạn cầm mật thư trên tay, và cả hàng ghế đang chờ bạn quyết định. Ngoài cửa, người đưa tin đứng im, không nói gì, chờ câu trả lời cuối cùng.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'guong', cuu: 'ke_thu', label: 'Gửi mật hiệu bán thân phận Hàn Thất, đổi lấy hiệp ước', mat: 'Một người bạn, và chiếc ghế phó chưởng môn bạn đã ngồi.',
                sau: 'Bạn gửi mật hiệu đi bằng chính tay mình, và tiếng cười vang lên trong nghị sự đường. Hiệp ước được ký ngay sau đó, và tên Hàn Thất nằm trong danh sách bị đưa đi.',
                hau: 'Hàn Thất bặt tin, và không ai trong tông dám nhắc tới tên hắn.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'guong', cuu: 'ban', label: 'Không gửi, mất hiệp ước', mat: 'Hiệp ước, và chiếc ghế của bạn.',
                sau: 'Bạn đặt mật thư xuống bàn và nói rằng không ký. Quỷ Diện nhìn bạn một lúc rồi đứng dậy, và cả nghị sự đường lặng đi như bị nước đá tạt.',
                hau: 'Hàn Thất được cứu một lần, và bạn mất một ghế.' },
              { kieu: 'duong_tat', vt: 'dkd', doi: 'guong', cuu: 'ban', label: 'Gửi mật hiệu giả để báo Hàn Thất chạy', mat: 'Một nước đi mà Quỷ Diện sẽ biết.',
                sau: 'Bạn viết một mật hiệu giả, đủ để Hàn Thất hiểu và chạy đi. Quỷ Diện cầm tờ giấy lên, đọc hết, rồi bật cười khẽ.',
                hau: 'Quỷ Diện đã biết nước đi ấy từ đầu, và điều đó bạn sẽ không bao giờ quên.' }
            ] },
          treo: { t: 'Hàn Thất bặt tin',
            d: 'Đại tiệc phong phó chưởng môn đã tàn, và bạn ngồi một mình trong sảnh vắng. Không có thư nào từ Hàn Thất, và cái ghế cạnh bạn đã nguội lạnh từ lâu.',
            lc: [
              { key: 'sai_tim', label: 'Sai người đi tìm', kind: 'risk', mat: 'Một đội người lộ ra trước tông.' },
              { key: 'khong_hoi', label: 'Không hỏi thêm', kind: 'safe', mat: 'Sự im lặng của một người đã đổi người.' }
            ] }
        } },
      // ---------- Phần 5. Người hầu rượu: còn ai tin bạn ----------
      { id: 'nguoi_hau_ruou', n: 'Người hầu rượu', chuc_nang: 'tất cả đã mất; còn ai tin bạn', tuoi: 100, cau_hoi: 'Còn ai tin bạn?',
        biet: '{guong} đã biết mật hiệu đã bị bán.', thang_vui: '(không)', cai_mat: 'minh ước, hoặc tài sản của tông',
        chang: {
          moc: { t: 'Phòng trống',
            d: 'Bạn còn ở sơn môn, nhưng cả nghị sự đường đã đổi người, và chỗ ngồi của bạn giờ dành cho kẻ khác. Trên bàn, vế đối cũ vẫn nằm đó, chữ đã mờ đi vì ngày tháng.',
            lc: [
              { key: 'cat_ve', label: 'Cất vế đối vào túi', kind: 'safe', mat: 'Một kỷ vật không ai đòi.' },
              { key: 'dot_ve', label: 'Đốt vế đối trước mặt mọi người', kind: 'risk', mat: 'Một lời tuyên bố không ai hiểu.' }
            ] },
          leo: { t: 'Quân cờ',
            d: 'Quỷ Diện gửi một ván cờ tới phòng bạn, nói rằng ván này do chính bạn đi trước. Trên bàn cờ, quân cờ ngọc đen nằm đúng chỗ bạn từng đặt, nhưng bạn không nhớ đã đặt nó ở đâu.',
            lc: [
              { key: 'di_nuoc', label: 'Đi nước tiếp theo', kind: 'risk', mat: 'Một nước đi bạn không kiểm soát được.' },
              { key: 'day_ban', label: 'Đẩy bàn cờ đi, không chơi', kind: 'safe', mat: 'Một ván cờ bỏ dở.' }
            ] },
          // Cảnh lớn: Người hầu rượu
          cao_trao: { t: 'Người hầu rượu', lon: true, canh: { gio: 'dem', thoi_tiet: 'mua' },
            d: 'Yến minh ước đang diễn ra trong nghị sự đường, và có một người hầu rượu cầm bình rót cho từng người. Người hầu rượu không ngẩng lên, nhưng bạn thấy chữ trên cổ tay hắn đúng là mật hiệu cũ của bạn.',
            kieu: [
              { kieu: 'tin', vt: 'nguoc', doi: 'guong', cuu: 'guong', label: 'Đọc to sự thật cho cả yến nghe', mat: 'Chỗ ngồi cuối cùng của bạn ở sơn môn.',
                sau: 'Bạn đứng dậy và đọc to chuyện mật hiệu ngày xưa, từng chữ một. Cả yến im bặt, và tiếng bình rượu rơi vỡ dưới chân người hầu.',
                hau: 'Có người bắt đầu tin bạn lại, nhưng không ai dám nói ra.' },
              { kieu: 'duong_tat', vt: 'dkd', doi: 'ban', cuu: 'ke_thu', label: 'Đổi bằng tài sản của tông', mat: 'Một kho bạc tông, và một món nợ không thể trả.',
                sau: 'Bạn gọi quản sự, bảo lấy kho bạc của tông đổi cho người hầu rượu im lặng. Quỷ Diện cười, và nói: "Ta có nói trả người sống đâu."',
                hau: 'Kho bạc còn đó, nhưng từ hôm ấy bạn không dám nhìn vào sổ sách nữa.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'guong', cuu: 'ke_thu', label: 'Nâng chén như không quen người hầu rượu', mat: 'Một người bạn bị bỏ lại trong bóng tối.',
                sau: 'Bạn nâng chén rượu lên, nói như chưa từng quen người hầu ấy. Người hầu rót rượu cho bạn, tay không run, và bạn không dám nhìn vào mắt hắn.',
                hau: 'Từ đó bạn không còn cảm thấy mình đang ngồi trên ghế mình đã mua.' }
            ] },
          treo: { t: 'Minh ước vỡ',
            d: 'Yến minh ước kết thúc mà không ai biết ai đã ký, và tờ minh ước nằm trên bàn, một nửa đã cháy. Bạn nhìn nửa còn lại, và thấy tên mình vẫn chưa có chữ ký.',
            lc: [
              { key: 'ky_nua', label: 'Ký tên vào nửa còn lại', kind: 'risk', mat: 'Một chữ ký không thể rút lại.' },
              { key: 'de_day', label: 'Để tờ giấy nằm đó', kind: 'safe', mat: 'Một ngày không ai hỏi tới.' }
            ] }
        } },
      // ---------- Phần 6. Ván cuối: đặt cược vào người khác được không ----------
      { id: 'van_cuoi', n: 'Ván cuối', chuc_nang: 'đặt cược vào người khác được không; đồng hồ thọ nguyên', tuoi: 115, tho: 0.15, cau_hoi: 'Đặt cược vào người khác được không?',
        biet: 'Ván cờ này đã có người khác đi trước.', thang_vui: 'người bạn tin đi đúng nước', cai_mat: '(kết cục)',
        chang: {
          moc: { t: 'Bàn cờ cuối',
            d: 'Ván cờ cuối được bày trong nghị sự đường, cược cả tông vào một nước đi. Quỷ Diện ngồi đối diện bạn, bình tĩnh như thể đã biết trước mọi nước.',
            lc: [
              { key: 'ngoi_choi', label: 'Ngồi xuống chơi', kind: 'risk', mat: 'Một ván không có đường lui.' },
              { key: 'dung_day', label: 'Đứng dậy, bỏ cuộc', kind: 'safe', mat: 'Một lối thoát không ai trách bạn.' }
            ] },
          leo: { t: 'Thọ nguyên',
            d: 'Thọ nguyên trong ngực bạn chỉ còn một phần nhỏ, và mỗi nước cờ đều phải tính trước bằng đầu óc mệt mỏi. Bạn còn một chút tu vi cuối, vừa đủ để đi nước quyết định hoặc để tin người khác đi thay.',
            lc: [
              { key: 'tu_tinh', label: 'Tự tính hết, đi nước quyết định', kind: 'risk', mat: 'Gần hết phần đời còn lại, nếu tính sai.', tt: { can: { realm: 2 }, han: 120 } },
              { key: 'de_nguoi_khac', label: 'Để người bạn tin đi thay', kind: 'safe', mat: 'Một nước đi không phải của chính bạn.' }
            ] },
          // Cảnh lớn: ván cờ cuối với Quỷ Diện
          cao_trao: { t: 'Ván cờ cuối với Quỷ Diện', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Ván cờ cược cả tông bắt đầu. Quỷ Diện đặt một quân cờ ngọc đen xuống, và nói rằng nước đi kế tiếp sẽ thuộc về người bạn đã chọn tin. Cả nghị sự đường nín thở, chờ nước đi của bạn.',
            kieu: [
              { kieu: 'tin', vt: 'nguoc', doi: 'ke_thu', cuu: 'guong', label: 'Tin một người bạn không kiểm soát được để họ đi nước quyết định', mat: 'Quyền kiểm soát, và chiếc ghế của bạn.',
                sau: 'Bạn gọi tên người bạn cũ, người không còn đứng trong nghị sự đường. Người ấy bước vào, cầm lấy quân cờ và đi nước quyết định mà không nhìn bạn.',
                hau: 'Người bạn ấy đi đúng nước, và bạn không bao giờ biết vì sao họ làm vậy.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ke_thu', cuu: 'ke_thu', label: 'Tự tính hết, thua vì hắn đã tính trước', mat: 'Chút kiêu hãnh cuối cùng của kẻ tự tính.',
                sau: 'Bạn tính từng nước, từng nước đều chắc chắn. Quỷ Diện mỉm cười, đi một nước bạn chưa từng nghĩ tới, và ván cờ kết thúc trước khi bạn kịp thở.',
                hau: 'Cả tông nhớ bạn là người tính giỏi nhất, và cũng là người thua trong chính ván cờ của mình.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ke_thu', cuu: 'guong', label: 'Tự làm quân thí', mat: 'Ghế, mạng lưới tin tức, và có thể cả mạng sống.',
                sau: 'Bạn đặt chính mình lên bàn cờ như một quân thí và tự nguyện bị ăn. Quỷ Diện lấy quân cờ của bạn, không nói gì, và ván cờ lật sang một bên.',
                hau: 'Bạn không còn là kẻ nắm mọi sợi dây, và điều đó làm nhẹ đi một gánh nặng.' }
            ] },
          treo: { t: 'Người bạn đi nước',
            d: 'Ván cờ đã tàn, và người bạn bạn tin cúi xuống đặt quân cờ cuối cùng. Quân cờ ngọc đen nằm trên bàn, không ai nhặt, và cả tông lặng lẽ đứng dậy.',
            lc: [
              { key: 'nhat_quan', label: 'Nhặt quân cờ lên', kind: 'help', mat: 'Một quân cờ mang tên một người.' },
              { key: 'de_quan', label: 'Để nó nằm đó', kind: 'safe', mat: 'Một ván cờ không bao giờ kết thúc.' }
            ] }
        } }
    ],
    // Ba phương án lật (bốc một mỗi đời, nổ ở phần 4 hoặc 5). Chặng "treo" của phần nổ bị thay bằng đoạn sự thật.
    lat: [
      { id: 'a', kieu: 'ke_dung_sau_2', ten: 'Kẻ đứng sau kẻ đứng sau', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 2, o: 'leo', t: 'Sư phụ gọi bạn vào thư phòng, và biết về vế đối trước khi bạn kịp nói.', hieu: 'Sư phụ đã biết câu đối từ đầu.' },
          { phan: 3, o: 'cao_trao', t: 'Sư phụ gợi ý bạn nên gửi Hàn Thất vào tổng đàn, như thể chuyện ấy vốn là của thầy.', hieu: 'Sư phụ là người đã dàn xếp việc gửi Hàn Thất.' },
          { phan: 4, o: 'moc', t: 'Quân cờ ngọc đen trong thư phòng thầy, cùng kiểu với quân cờ của Quỷ Diện.', hieu: 'Quỷ Diện chỉ là quân cờ của sư phụ bạn.' }
        ],
        no: { biet: 'Quỷ Diện chỉ là quân cờ của sư phụ bạn, người đã dạy bạn đừng tin ai.',
          hieu: 'Sư phụ bạn là kẻ đứng sau kẻ đứng sau.',
          d: 'Sư phụ gọi bạn vào thư phòng lần cuối và rót hai chén trà. "Ta dạy ngươi đừng tin ai," ông nói, "vì ta cần ngươi tin ta." Quân cờ ngọc đen đặt giữa bàn, cùng kiểu với quân cờ của Quỷ Diện.',
          lc: [
            { key: 'hoi_thay', label: 'Hỏi thầy vì sao phải làm vậy', kind: 'risk', mat: 'Một câu trả lời bạn không muốn nghe.', flag: 'lat_doi_mat' },
            { key: 'day_chen', label: 'Đẩy chén trà lại, bỏ đi', kind: 'safe', mat: 'Sự thật về người thầy bạn đã tin.', flag: 'lat_quay_di' }
          ] } },
      { id: 'b', kieu: 'huynh_biet_tu_dau', ten: 'Hàn Thất biết mình bị bán từ đầu', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 2, o: 'cao_trao', t: 'Hàn Thất đổi một chữ trong vế đối của mình, rất nhẹ, như thể chỉ để bạn nhận ra.', hieu: 'Hàn Thất đã biết mình sẽ bị bán và để lại dấu cho bạn.' },
          { phan: 3, o: 'treo', t: 'Thư cuối cùng của Hàn Thất có đúng chữ đã đổi ở vế đối, và không có chữ nào khác.', hieu: 'Thư cuối là lời từ biệt đã được viết trước.' },
          { phan: 4, o: 'treo', t: 'Hàn Thất nhìn bạn rất quen, như đã từng gặp, nhưng không gọi tên bạn.', hieu: 'Hàn Thất đã nhận ra bạn, và vẫn đi.' }
        ],
        no: { biet: 'Hàn Thất biết mình bị bán từ đầu và vẫn đi, vì tin bạn có lý do.',
          hieu: 'Hàn Thất đã đi vì tin bạn.',
          d: 'Đêm trước khi mọi thứ lật ngược, một người lạ mang tới cho bạn một vế đối cũ, chữ đã đổi đúng như lời Hàn Thất. Trong góc giấy có một dòng nhỏ: "Ta tin ngươi có lý do." Đó là nét chữ của Hàn Thất.',
          lc: [
            { key: 'nhan_toi', label: 'Gục xuống, nhận mình là kẻ đã bán hắn', kind: 'pay', mat: 'Chỗ đứng cao nhất mà bạn đã tự cho mình.', flag: 'lat_nhan_toi' },
            { key: 'chai_mat', label: 'Nói bạn không nhớ có lý do gì', kind: 'risk', mat: 'Một lần đứng thẳng nhìn người ta.', flag: 'lat_chai_mat' }
          ] } },
      { id: 'c', kieu: 'chinh_ban_la_thu_pham', ten: 'Chính bạn là thủ phạm', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'treo', t: 'Quỷ Diện mang tới một món bánh bạn từng thích hồi nhỏ, và không hỏi bạn có muốn ăn không.', hieu: 'Quỷ Diện biết bạn từ rất lâu, từ trước khi bạn đến tông.' },
          { phan: 3, o: 'cao_trao', t: 'Quỷ Diện nhắc tên làng cũ của bạn, nhẹ như gọi một người quen.', hieu: 'Quỷ Diện là người bạn đã kể chuyện nhà với năm tám tuổi.' },
          { phan: 4, o: 'moc', t: 'Quỷ Diện gọi bạn bằng tên tục, cái tên bạn chỉ nói với một người lạ năm tám tuổi.', hieu: 'Người lạ năm ấy chính là Quỷ Diện.' }
        ],
        no: { biet: 'Năm tám tuổi, bạn vô tình kể chuyện nhà với một người lạ tốt bụng; người lạ ấy là Quỷ Diện, và đó là lý do cha bạn sụp đổ.',
          hieu: 'Chính bạn đã mở đường cho Quỷ Diện.',
          d: 'Quỷ Diện đứng trước bạn trong nghị sự đường vắng, không cười, không đeo mặt nạ. "Năm ngươi tám tuổi, ngươi kể hết chuyện nhà cho ta nghe bằng một cây kẹo đường," hắn nói. "Ta chỉ đi làm việc của ta."',
          lc: [
            { key: 'nhan_ke', label: 'Nhận mình đã kể, cúi đầu', kind: 'pay', mat: 'Chỗ đứng cao nhất mà bạn đã tự cho mình.', flag: 'lat_nhan_toi' },
            { key: 'nhan_nham', label: 'Nói hắn nhầm người rồi', kind: 'risk', mat: 'Một lần đứng thẳng nhìn người ta.', flag: 'lat_chai_mat' }
          ] } }
    ],
    khong_ke_ac: { phan: 3, o: 'leo', ten: 'Mẹ hấp hối' },
    // Kết cục: chọn theo chuỗi kiểu lựa chọn (vt) ở TT.kb.ketKhuon.
    ket: {
      toan_ven: { t: 'Toàn vẹn', kv: 2, dk: { loai: 'nguoc', min: 3, tu_phan: 3, p6: 'hy_sinh' },
        log: '{ten} ngồi đối câu đối với một ghế trống. Vế dưới được viết bằng chữ của Hàn Thất, và {vat} vẫn nằm trên bàn.' },
      doa: { t: 'Đọa', kv: 0, xau: true, dk: { loai: 'dkd', phan: [4, 6] },
        log: '{ten} xếp quân trên bàn cờ, quân nào cũng mang tên một người.' },
      co_doc: { t: 'Cô độc', kv: 1, xau: true, dk: { loai: 'con_lai' },
        log: '{ten} nắm mọi sợi dây, không sợi nào dẫn tới ai.' }
    }
  });
})();
