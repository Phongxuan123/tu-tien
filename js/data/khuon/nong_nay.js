// Khuôn "Nóng nảy" (Tính tình âm), chép từ ke-hoach/Q-khuon-kich-ban.md mục 5 thành dữ liệu (K3a). Cấu trúc theo js/data/khuon/kieu_hanh.js.
// Ghi chú chép (K3a, Haiku):
//   - Khuyết điểm gốc: boc_dong (thuốc "nhẫn" trùng với kds.boc_dong).
//   - Dàn: Triệu Liệt là ke_thu; lão Mộc là guong (dàn su) và cũng là su; Triệu Kỳ là doi_thu; Tiểu Đào là than_nhan.
//   - Phụ: phu[0] = lão Mộc (vật cái đục gỗ, vật gương), phu[1] = Tiểu Đào (vật dây tóc đỏ).
//   - Muốn chỉ có một câu gốc: a tong / b vung là biến thể cùng ý, c tan_tu giữ nguyên câu gốc.
//   - Kiểu "(ngược)" chưa ghi kiểu cụ thể được chọn theo nghĩa: phần 1 "dừng ở cú đầu, bị cười là hèn" = phuc_tung; phần 2 "dừng ở đòn cuối" = hy_sinh; phần 3 "làm trong cảnh đứng yên trước quan tài" = phuc_tung; phần 4 "nhận thua trước toàn tông" = phuc_tung; phần 5 "đứng yên" = im_lang (vt nguoc), "bẻ tay hắn" = chong (dkd), "quỳ xin chịu thay bằng đan điền" = hy_sinh (nguoc); phần 6 "buông tay cho hắn đánh" = phuc_tung.
//   - Phần 5 "nhịp 2 có tam_ma 🜏" được ghi thành một lựa chọn tam_ma (đâm trước khi hắn đếm tới chín). Lint cho phép.
//   - Lật (c) có phần nổ 5 nhưng manh P5 ("hắn gọi Tiểu Đào bằng tên em hắn") được dời sang phần 4 (treo) vì lint không cho manh mối ở phần nổ trở đi.
//   - Khong_ke_ac: "lão Mộc chết già" (bản gốc ghi phần 3 hoặc 4) được đặt ở phần 4 leo (lon, kiểu) để chạy đường builder đã có.
//   - Nơi cấm (cam) "hậu sơn có lò rèn cũ" là tên tôi đặt (bản gốc không ghi); cần bạn duyệt.
//   - Thử thách có hạn (tt) đặt ở phần 2 leo "luyện gấp cho trận đấu".
(function () {
  const D = window.TT.data;

  D.STORY.regKhuon({
    id: 'nong_nay', ten: 'Nóng nảy', khuyet_diem: 'boc_dong',
    cau_hoi_trung_tam: 'Sức mạnh nằm ở cú đánh, hay ở lúc dừng tay?',
    logline: 'Người học đánh để không ai dám coi thường mình và em gái; mỗi cú đánh trước lại kéo thêm một món nợ, cho tới khi người từng bị đánh hóa ra là người duy nhất hiểu mình.',
    bay_manh: {
      vet_thuong: [
        { id: 'a', xt: ['p1', 'p2'], vet: 'cha nóng nảy, kẻ đánh trước là kẻ được yên',
          canh: 'Cha bạn nóng như lửa lò, mỗi lần có ai cãi là ông đánh trước rồi mới nói lý lẽ. Bạn học được rằng kẻ đánh trước là kẻ được yên.' },
        { id: 'b', xt: ['p5'], vet: 'bị bắt nạt tới khi đánh trả mới được để yên',
          canh: 'Ở trại trẻ mồ côi, bạn bị bắt nạt hết ngày này sang ngày khác, cho tới một buổi chiều bạn cầm đá đánh trả và không ai dám đụng vào bạn nữa.' },
        { id: 'c', xt: ['p3', 't10'], vet: 'cha thợ rèn nhịn bọn thu thuế tới mất cả lò, rồi chết trong nhục',
          canh: 'Bọn thu thuế kéo tới lò rèn, và cha bạn cúi đầu nhịn hết lần này tới lần khác. Đến khi mất cả lò, ông chết trong nhục, còn bạn đứng nhìn từ góc xưởng.' }
      ],
      loi_noi_doi: 'Ai đánh trước, kẻ đó không bị đánh.',
      muon: [
        { id: 'a', cho: 'tong', t: 'không ai trong tông dám coi thường bạn và em gái' },
        { id: 'b', cho: 'vung', t: 'không ai trong vùng dám coi thường bạn và em gái' },
        { id: 'c', cho: 'tan_tu', t: 'không ai dám coi thường bạn và em gái' }
      ],
      can: 'nhẫn',
      bong_toi: { vai: 'ke_thu', cach_chon: 'Triệu Liệt, anh trai của người bạn từng đánh phế, để cơn giận đốt cả một đời; ra mắt từ phần 1',
        ra_mat: [
          'Triệu Liệt, vai rộng và mắt đỏ, đứng trước cổng võ trường quát tên một đứa nhỏ tới mức cả sân im lặng',
          'Triệu Liệt cầm roi đứng bên sân luyện, mỗi lần có người vấp là hắn quất một roi không nói lời nào',
          'Triệu Liệt xoay cổ tay rắc rắc, nhìn bạn từ đầu tới chân, rồi nhổ một bãi nước bọt xuống đất'
        ] },
      guong: { vai: ['su'], dd: 'thợ đẽo gỗ ẩn thân, điềm tĩnh tới mức bị cho là hèn, lúc nào cũng cầm {vat_guong}' },
      hy_sinh: 'đan điền, danh "Liệt Quyền"'
    },
    dan: { ke_thu: 'ke_thu', guong: ['su'], su: 'su', doi_thu: 'doi_thu', than_nhan: 'than_nhan', ban: 'ban' },
    soi: {
      chinh: { nguoi: 'ke_thu', vat: [
        { id: 'cay_sao_truc', canh: '{ke_thu} nhặt cây sáo trúc của em mình từ đất bùn, thổi thử một tiếng lệch rồi im.', treo: '{ke_thu} cầm cây sáo trúc trong tay, không thổi, chỉ nhìn các lỗ sáo như nhìn một vết thương.' }
      ] },
      phu: [
        { nguoi: 'guong', vat: [{ id: 'cai_duc_go' }] },
        { nguoi: 'than_nhan', vat: [{ id: 'day_toc_do' }] }
      ]
    },
    noi: { chinh: 'võ trường', tong: 'võ trường của tông', cam: ['hậu sơn có lò rèn cũ'] },
    thang_suc_manh: [
      { realm: 0, dinh: 'người đứng đầu ngoại môn' },
      { realm: 1, stage: 0, dinh: 'đệ tử nội môn có tiếng' },
      { realm: 1, stage: 2, dinh: 'đệ nhất nội môn, người được chọn làm chân truyền' },
      { realm: 2, dinh: 'trưởng lão, người đứng đầu một vùng nhỏ' },
      { realm: 3, dinh: 'cái tên người ta nhắc như huyền thoại' }
    ],
    phan: [
      // ---------- Phần 1. Nắm đấm: bảo vệ hay hả giận ----------
      { id: 'nam_dam', n: 'Nắm đấm', chuc_nang: 'biến cố khởi đầu; bảo vệ hay hả giận', tuoi: 12, cau_hoi: 'Bảo vệ hay hả giận?',
        biet: '{ke_thu} đã nghe chuyện bạn đánh nhau ở chợ.', thang_vui: 'Tiểu Đào cười, buộc dây tóc đỏ lên tay bạn.', cai_mat: 'một đứa nhỏ bị đánh, hoặc chút danh nhỏ của bạn',
        chang: {
          moc: { t: 'Bờ ao sau trại',
            d: 'Chiều hôm ấy, bạn đi qua bờ ao sau trại và thấy em gái mình, Tiểu Đào, bị bốn đứa lớn hơn đẩy xuống nước. Tiếng cười của chúng vang khắp bờ, còn nàng ngoi lên, ho sặc sụa.',
            lc: [
              { key: 'di_qua', label: 'Đi qua, không dừng', kind: 'safe', mat: 'Một đêm không phải nghe tiếng khóc của em.' },
              { key: 'nhat_da', label: 'Nhặt một hòn đá lên trong tay', kind: 'risk', mat: 'Một cái cớ cho cơn giận bốc lên.' }
            ] },
          leo: { t: 'Bàn tay đẫm nước',
            d: 'Tiểu Đào ho sặc sụa, tay vẫn nắm chặt sợi dây tóc đỏ đã ướt sũng. Bạn nhìn sợi dây ấy, và thấy cơn giận trong ngực mình vừa có một cái cớ.',
            lc: [
              { key: 'cho_em', label: 'Cởi áo khoác đưa cho em, không nói gì', kind: 'help', mat: 'Lần đầu tiên bạn không đánh ai.' },
              { key: 'hoi_ho', label: 'Bước tới kẻ cầm đầu, hỏi vì sao', kind: 'risk', mat: 'Một câu hỏi mà hắn không định trả lời.' }
            ] },
          cao_trao: { t: 'Kẻ bắt nạt Tiểu Đào', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Kẻ đứng đầu bốn đứa, cao hơn bạn một cái đầu, đang nắm cổ áo Tiểu Đào giữa bờ ao, và cả trại đứng xem. Cơn giận bốc lên như lửa lò, và bạn biết mình chỉ còn một cú đánh để chọn.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'doi_thu', cuu: 'than_nhan', label: 'Đánh đến khi hắn không dậy được', mat: 'Danh tiếng hung dữ của bạn, và một đứa trẻ nằm không dậy nổi.',
                sau: 'Bạn đánh liên tiếp, không đếm, cho tới khi kẻ kia nằm bất động dưới đất. Ai đó hét lên, và tiếng hét ấy không làm bạn dừng lại.',
                hau: 'Tiểu Đào nhìn bạn như nhìn một điều lạ, rồi nắm tay bạn kéo về phía trại.' },
              { kieu: 'phuc_tung', vt: 'nguoc', doi: 'doi_thu', cuu: 'than_nhan', label: 'Dừng ở cú đầu, bị cả trại cười là hèn', mat: 'Danh của một đứa trẻ hay đánh, và chút tự trọng.',
                sau: 'Cú đấm dừng lại giữa không trung. Cả trại cười, và tiếng cười ấy rơi xuống bạn như nước ao lạnh.',
                hau: 'Bạn bị gọi là hèn suốt một mùa, và bạn không cãi lại một lời nào.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'than_nhan', cuu: 'than_nhan', label: 'Gọi người lớn tới, không ra tay', mat: 'Lần đầu bạn để người khác xử thay mình.',
                sau: 'Bạn quay lại gọi người lớn trong trại, và đứng yên ngoài bờ ao trong lúc họ chạy tới. Kẻ kia bò dậy trong nước, nhìn bạn bằng ánh mắt không quên.',
                hau: 'Bạn đã để người khác đứng ra, và lần sau bạn không định để ai làm việc đó nữa.' }
            ] },
          treo: { t: 'Thằng bé không về',
            d: 'Tối ấy, thằng bé bị đánh không về phòng ngủ, và chỗ giường của nó trống. Tiểu Đào ngồi bên cửa, nhìn bạn lâu rồi cười khẽ, như muốn nói điều gì mà chưa dám nói.',
            lc: [
              { key: 'hoi_em', label: 'Hỏi Tiểu Đào vì sao cười', kind: 'safe', mat: 'Một câu trả lời nhẹ như gió.' },
              { key: 'ra_ngoai', label: 'Đi tìm thằng bé ngoài trại', kind: 'risk', mat: 'Một đêm lạnh ngoài sân.' }
            ] }
        } },
      // ---------- Phần 2. Một câu khích: thắng một trận đáng giá gì ----------
      { id: 'mot_cau_khich', n: 'Một câu khích', chuc_nang: 'thắng một trận đáng giá gì', tuoi: 30, cau_hoi: 'Thắng một trận đáng giá gì?',
        biet: '{guong} đã thấy bạn đánh người ở bờ ao năm xưa.', thang_vui: '(nếu thắng) suất nội môn', cai_mat: 'đan điền của một người, hoặc suất nội môn của bạn',
        chang: {
          moc: { t: 'Võ trường',
            d: 'Võ trường của tông náo nhiệt từ sáng sớm, các đệ tử xếp hàng đợi gọi tên. Triệu Kỳ đứng ở góc sân, tay vuốt cây sáo trúc, và khi thấy bạn đến, hắn nhếch mép cười.',
            lc: [
              { key: 'nhin_lai', label: 'Nhìn lại hắn, không lên tiếng', kind: 'safe', mat: 'Một ánh nhìn không ai hiểu.' },
              { key: 'noi_cau', label: 'Nói một câu cho hắn nghe', kind: 'risk', mat: 'Một lời đã nói ra không thể rút lại.' }
            ] },
          leo: { t: 'Lão Mộc nhìn bạn',
            d: 'Lão Mộc ngồi bên gốc cây đẽo gỗ, không ngẩng lên khi bạn đi qua. Ông chỉ nói một câu rất nhỏ: "Đục nặng quá thì khắc không sâu."',
            lc: [
              { key: 'luyen_gap', label: 'Luyện gấp cho trận đấu', kind: 'risk', mat: 'Vài năm không nghỉ, và đan điền rát.', tt: { can: { xp: 0.25 }, han: 36 } },
              { key: 'di_thang', label: 'Đi thẳng, không để ý', kind: 'safe', mat: 'Lời dặn của ông trôi đi cùng gió.' }
            ] },
          // Cảnh lớn: Triệu Kỳ khích
          cao_trao: { t: 'Đấu trường', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Triệu Kỳ bước lên đài, cười nói to rằng bạn đã đánh người ở bờ ao năm xưa, và khích bạn lên đài đánh một trận. Cả võ trường ồn ào, chờ bạn trả lời.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'doi_thu', cuu: 'guong', label: 'Đánh vỡ đan điền hắn', mat: 'Một đời của một người em, và tiếng reo của cả trường.',
                sau: 'Bạn lao lên, một đòn vào bụng, một đòn vào ngực. Triệu Kỳ gục xuống đài, miệng sùi bọt, và tiếng reo tắt lịm.',
                hau: 'Triệu Kỳ không bao giờ đứng vững được như trước; Triệu Liệt cũng không bao giờ tha cho bạn.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'doi_thu', cuu: 'guong', label: 'Dừng ở đòn cuối, thua trận và mất suất', mat: 'Suất nội môn, thứ bạn đã chờ lâu.',
                sau: 'Bạn dừng tay khi kiếm đã chạm cổ áo đối phương. Trọng tài hô to bạn thua, và Triệu Kỳ đứng dậy, nhìn bạn như không tin.',
                hau: 'Triệu Kỳ không cảm ơn bạn, nhưng từ hôm đó hắn không khích ai nữa.' },
              { kieu: 'dao_thoat', vt: 'khac', doi: 'doi_thu', cuu: 'than_nhan', label: 'Bỏ võ đài, bước xuống trước khi đấu', mat: 'Suất nội môn, và cái danh bạn đã cố giữ.',
                sau: 'Bạn bước xuống khỏi đài trong tiếng la ó, không ai chặn bạn lại. Tiểu Đào đứng cuối sân, nhìn bạn đi như nhìn một người đã thua trước khi đánh.',
                hau: 'Người ta vẫn nhắc chuyện bạn bỏ võ đài, và bạn không bao giờ cãi.' }
            ] },
          treo: { t: 'Triệu Kỳ thành phế nhân',
            d: 'Tối ấy, người ta khiêng Triệu Kỳ về phòng với đan điền vỡ nát. Triệu Liệt đứng cạnh giường em, không khóc, không nói, chỉ nhìn bạn qua khung cửa.',
            lc: [
              { key: 'vao_tham', label: 'Bước vào thăm Triệu Kỳ', kind: 'help', mat: 'Một lời xin lỗi không ai nghe.' },
              { key: 'quay_di', label: 'Quay đi, không vào', kind: 'risk', mat: 'Một ánh nhìn của Triệu Liệt theo bạn suốt đêm.' }
            ] }
        } },
      // ---------- Phần 3. Cây sáo: bạn nợ gì một người đã chết ----------
      { id: 'cay_sao', n: 'Cây sáo', chuc_nang: 'bạn nợ gì một người đã chết', tuoi: 55, canh: { realm: 1 }, cau_hoi: 'Bạn nợ gì một người đã chết?',
        biet: 'Triệu Kỳ đã chết sau ba năm, và không ai nói rõ vì sao.', thang_vui: 'lão Mộc dạy bạn đẽo một con chim gỗ', cai_mat: 'một người em, hoặc lòng tin của Triệu Liệt',
        chang: {
          moc: { t: 'Tin báo',
            d: 'Tin Triệu Kỳ treo cổ trong phòng lan khắp trại trước khi trời sáng. Trên bàn có một đoạn dây roi cũ, và bên cạnh là cây sáo trúc của hắn, lỗ sáo còn đọng nước.',
            lc: [
              { key: 'chay_toi', label: 'Chạy tới phòng Triệu Kỳ', kind: 'risk', mat: 'Một cảnh bạn sẽ không quên.' },
              { key: 'nam_im', label: 'Nằm im trong giường, không nghe', kind: 'safe', mat: 'Một buổi sáng không ai kể cho bạn.' }
            ] },
          leo: { t: 'Roi',
            d: 'Lão Mộc đưa cho bạn một cái đục gỗ nhỏ và bảo đẽo cho xong một cái mặt chim trước khi nghĩ đến chuyện khác. Bạn cầm đục trên tay, nghe tiếng roi quất vọng lại từ hậu sơn.',
            lc: [
              { key: 'dut_go', label: 'Đẽo, không ngẩng lên', kind: 'safe', mat: 'Những đường đục đều đặn, như một lời hứa không ai nghe.' },
              { key: 'bo_duc', label: 'Đặt đục xuống, đi tìm tiếng roi', kind: 'risk', mat: 'Một đường đi về phía tiếng khóc.' }
            ] },
          // Cảnh lớn: đám tang Triệu Kỳ
          cao_trao: { t: 'Đám tang Triệu Kỳ', lon: true, canh: { gio: 'hoang_hon', thoi_tiet: 'mua' },
            d: 'Đám tang Triệu Kỳ được làm ở sân võ trường, quan tài đặt giữa sân và đèn nến cháy suốt đêm. Triệu Liệt đứng ở đầu quan tài, mắt không rời khỏi bạn, và cả trại chờ xem bạn làm gì.',
            kieu: [
              { kieu: 'phuc_tung', vt: 'nguoc', doi: 'ke_thu', cuu: 'than_nhan', label: 'Quỳ xuống thắp nhang trước mặt Triệu Liệt', mat: 'Lòng kiêu hãnh, và một đêm không ngủ.',
                sau: 'Bạn quỳ trước quan tài, thắp ba nén nhang và cúi đầu sát đất. Triệu Liệt nhìn bạn rất lâu, rồi quay đi như không muốn thấy nữa.',
                hau: 'Từ đó Triệu Liệt không đánh bạn, nhưng cũng không gọi bạn bằng tên.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'ke_thu', cuu: 'than_nhan', label: 'Không đến, ở lại trong phòng', mat: 'Một người em không được tiễn.',
                sau: 'Bạn nằm trong phòng, nghe tiếng trống đám tang vọng qua tường. Tiểu Đào đến ngồi cạnh bạn và không hỏi vì sao bạn không đi.',
                hau: 'Bạn không bao giờ kể cho ai biết vì sao mình không đến.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ke_thu', cuu: 'guong', label: 'Đến và đánh nhau với Triệu Liệt ngay trước quan tài', mat: 'Thêm một cơn giận, và một cây đục không kịp rút ra.',
                sau: 'Bạn lao lên, tay không kịp nắm cây đục. Triệu Liệt đẩy bạn ngã vào quan tài, và tiếng đổ vỡ vang khắp sân.',
                hau: 'Đêm đó lão Mộc đứng trước bạn và không nói một lời nào.' }
            ] },
          treo: { t: 'Triệu Liệt giữ cây sáo',
            d: 'Sau đám tang, Triệu Liệt vẫn giữ cây sáo trúc của em mình, không ai dám hỏi hắn đòi lại. Hắn cầm nó khi đi ngang qua bạn, và không thổi.',
            lc: [
              { key: 'hoi_thoi', label: 'Hỏi hắn có định thổi không', kind: 'risk', mat: 'Một câu hỏi bạn không đáng được trả lời.' },
              { key: 'cui_di', label: 'Cúi đầu, đi qua', kind: 'safe', mat: 'Sự im lặng của những người còn sống.' }
            ] }
        } },
      // ---------- Phần 4. Liệt Quyền (chiến thắng giả): kẻ không ai dám đụng có còn ai không ----------
      { id: 'liet_quyen', n: 'Liệt Quyền', chuc_nang: 'chiến thắng giả: kẻ không ai dám đụng có còn ai không', tuoi: 85, canh: { realm: 1, stage: 2 }, cau_hoi: 'Kẻ không ai dám đụng có còn ai không?',
        biet: '{guong} đã biết bạn sẽ đi đến đâu.', thang_vui: 'danh hiệu "Liệt Quyền", cả tông nể', cai_mat: 'đan điền, danh, hoặc Tiểu Đào',
        chang: {
          moc: { t: 'Danh hiệu',
            d: 'Bạn được gọi là Liệt Quyền, và cả tông đứng dậy khi bạn đi qua. Tiểu Đào vẫn ở trong làng, không biết mình có được gọi tên bạn trong những lời tán tụng ấy hay không.',
            lc: [
              { key: 'nhan_chuc', label: 'Nhận lời chúc mừng của cả tông', kind: 'safe', mat: 'Một chỗ đứng cao hơn tất cả.' },
              { key: 'den_lang', label: 'Đến thăm Tiểu Đào ở làng', kind: 'help', mat: 'Một chuyến đi làm mất mặt trước tông.' }
            ] },
          // Cảnh lớn KHÔNG có kẻ ác (khong_ke_ac): lão Mộc chết già
          leo: { t: 'Lão Mộc chết già', lon: true, canh: { gio: 'hoang_hon', thoi_tiet: 'suong_doc' },
            d: 'Lão Mộc chết già trong nhà gỗ sau trại, thọ nguyên đã cạn từ lâu. Trên bàn, con chim gỗ vẫn chưa đẽo xong, và cây đục nằm cạnh một tấm vải đã ố màu.',
            kieu: [
              { kieu: 'tin', vt: 'nguoc', doi: 'guong', cuu: 'guong', label: 'Nắm tay lão Mộc, nghe ông nói về làng bạn', mat: 'Một lời xin lỗi bạn chưa nói được.',
                sau: 'Lão Mộc mở mắt nhìn bạn, giọng khàn khàn, và kể về một bờ ao có cây liễu già. Bạn không hiểu vì sao ông kể chuyện ấy, cho tới khi ông nhắm mắt lại.',
                hau: 'Con chim gỗ dở dang vẫn nằm trên bàn, và bạn đẽo nốt nó vào đêm đó.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'guong', cuu: 'guong', label: 'Đứng ngoài cửa, không vào', mat: 'Lần cuối bạn không đến gần người đã dạy mình.',
                sau: 'Bạn đứng ngoài cửa nhà gỗ, nghe tiếng thở của ông chậm dần. Khi cửa mở, lão Mộc đã đi, còn con chim gỗ vẫn chưa xong.',
                hau: 'Bạn không bao giờ biết ông có định nói điều gì với bạn không.' }
            ] },
          // Cảnh lớn: Triệu Liệt khiêu chiến
          cao_trao: { t: 'Triệu Liệt khiêu chiến công khai', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Triệu Liệt gửi thư thách đấu công khai, viết bằng nét chữ lớn và nguệch ngoạc như đang cố nén cơn giận. Trên đài, hắn đứng đối diện bạn với đôi mắt đỏ, cả tông ngồi kín khán đài, và hắn chỉ xoay cổ tay rắc rắc, chờ bạn ra đòn trước.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ke_thu', cuu: 'ban', label: 'Đánh trong cơn giận, thắng nhưng làm chết một người đứng xem', mat: 'Danh hiệu của bạn, và một mạng người trên khán đài.',
                sau: 'Bạn lao vào như lửa cháy rừng. Triệu Liệt ngã xuống, nhưng một đệ tử đứng quá gần sân bị kiếm gãy xuyên qua, và tiếng la hét át cả tiếng reo.',
                hau: 'Cả tông nể bạn vì chiến thắng, và cũng sợ bạn vì cái chết ấy.' },
              { kieu: 'phuc_tung', vt: 'nguoc', doi: 'ke_thu', cuu: 'than_nhan', label: 'Nhận thua trước toàn tông', mat: 'Danh hiệu Liệt Quyền, và ánh mắt của cả tông.',
                sau: 'Bạn quỳ xuống trước đài và nói bạn thua, rồi bước xuống không ngoái lại. Triệu Liệt nhìn bạn rất lâu, và lần đầu tiên hắn không cười.',
                hau: 'Tiểu Đào nghe tin ấy và khóc vì bạn, lần đầu tiên sau nhiều năm.' },
              { kieu: 'duong_tat', vt: 'dkd', doi: 'ke_thu', cuu: 'ban', label: 'Đánh lén trước trận', mat: 'Một món nợ không ghi sổ, nhưng sẽ có người đòi.',
                sau: 'Trước khi hắn bước lên đài, bạn chặn hắn ở hành lang và đánh một đòn vào sau gáy. Triệu Liệt loạng choạng, và cả tông vẫn nghĩ hắn đã thua công bằng.',
                hau: 'Mỗi lần đi qua hành lang đó, bạn đều nghe lại một tiếng va đập nhỏ.' }
            ] },
          treo: { t: 'Tiểu Đào mất tích',
            d: 'Sáng hôm sau, Tiểu Đào không về làng. Người ta chỉ thấy sợi dây tóc đỏ của nàng rơi trên đường mòn xuống núi, đã sờn màu và đứt một đoạn.',
            lc: [
              { key: 'di_tim', label: 'Đi tìm Tiểu Đào ngay', kind: 'help', mat: 'Một đường mòn dài và lạnh.' },
              { key: 'cho_ve', label: 'Chờ thêm, nghĩ nàng sẽ về', kind: 'safe', mat: 'Một buổi chiều nữa yên ổn.' }
            ] }
        } },
      // ---------- Phần 5. Chín cái tát: đứng yên được không ----------
      { id: 'chin_cai_tat', n: 'Chín cái tát', chuc_nang: 'tất cả đã mất; đứng yên được không', tuoi: 100, cau_hoi: 'Đứng yên được không?',
        biet: '{ke_thu} đã nghe tên bạn trong miệng Tiểu Đào.', thang_vui: '(không)', cai_mat: 'sĩ diện, hoặc chút nhẫn cuối cùng',
        chang: {
          moc: { t: 'Mất ghế',
            d: 'Bạn đã mất danh hiệu, đan điền đau âm ỉ mỗi khi trời trở gió, và võ trường giờ thuộc về người khác. Lão Mộc đã mất, nên bạn ngồi một mình bên cửa trại, đẽo nốt con chim gỗ chưa xong.',
            lc: [
              { key: 'ngoi_canh', label: 'Ngồi cạnh bàn, đẽo cùng con chim', kind: 'help', mat: 'Chút bình yên sau cùng.' },
              { key: 'ra_khoi_trai', label: 'Đi ra khỏi trại, không quay lại', kind: 'risk', mat: 'Một con đường không có ai đợi.' }
            ] },
          leo: { t: 'Roi cũ',
            d: 'Triệu Liệt cho gọi bạn ra sân sau, nơi hắn từng đánh em mình bằng roi. Hắn cầm cây roi trong tay, và bạn không biết hắn muốn bạn đứng yên hay chạy đi.',
            lc: [
              { key: 'dung_yen', label: 'Đứng yên, nhìn hắn', kind: 'safe', mat: 'Một ánh nhìn đủ để hắn nhớ.' },
              { key: 'chay_di', label: 'Chạy đi, không quay lại', kind: 'risk', mat: 'Một lần bỏ chạy mà không ai nhìn thấy.' }
            ] },
          // Cảnh lớn: "Chín cái tát"
          cao_trao: { t: 'Chín cái tát', lon: true, canh: { gio: 'dem', thoi_tiet: 'suong_doc' },
            d: 'Triệu Liệt đứng trước mặt bạn, giơ tay lên đánh cái tát đầu tiên, rồi cái thứ hai, và đếm to từng cái. Lão Mộc đã mất, nhưng cái đục gỗ của ông vẫn nằm trong tay bạn.',
            kieu: [
              { kieu: 'im_lang', vt: 'nguoc', doi: 'ke_thu', cuu: 'ban', label: 'Đứng yên, để hắn đếm hết chín cái tát', mat: 'Chín cái tát, và sự nhẫn bạn chưa bao giờ có.',
                sau: 'Bạn đứng thẳng, không né, không đỡ. Cái tát thứ chín làm đầu bạn quay đi, nhưng bạn vẫn đứng.',
                hau: 'Triệu Liệt không đếm tiếp, và hắn quay đi với đôi tay run.' },
              { kieu: 'chong', vt: 'dkd', doi: 'ke_thu', cuu: 'guong', label: 'Bẻ tay hắn ngay trước khi cái tát thứ hai rơi xuống', mat: 'Một cú bẻ đau, và một cơn giận chưa nguội.',
                sau: 'Bạn chộp lấy cổ tay Triệu Liệt và bẻ mạnh. Tiếng xương kêu nhỏ, và hắn quỳ xuống đất, mắt vẫn không rời mắt bạn.',
                hau: 'Triệu Liệt không bao giờ nhắc chuyện cổ tay ấy, nhưng hắn luôn giữ tay trong áo khi gặp bạn.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ke_thu', cuu: 'than_nhan', label: 'Quỳ xuống, xin hắn lấy đan điền của bạn thay cho người khác', mat: 'Đan điền, và chút sức mạnh cuối cùng của bạn.',
                sau: 'Bạn quỳ xuống trước mặt Triệu Liệt, ngửa cổ ra và nói rõ rằng hắn có thể lấy đan điền của bạn để thay cho những người bạn đã làm hại. Sân im phắt, và lão Mộc không còn ở đó để quay mặt đi.',
                hau: 'Đan điền của bạn không còn, và cái tên Liệt Quyền chỉ còn là chuyện cũ.' },
              { kieu: 'tam_ma', vt: 'dkd', doi: 'ke_thu', cuu: 'guong', label: 'Rút cây đục, đâm vào cổ hắn trước khi hắn đếm tới chín', mat: 'Điều bạn không dám nói ra.',
                sau: 'Lưỡi đục đi vào cổ Triệu Liệt chậm hơn bạn nghĩ. Hắn nhìn bạn, không kêu, chỉ đếm nốt con số cuối cùng trong im lặng.',
                hau: 'Bạn không còn đẽo chim gỗ nữa, và không dám hỏi vì sao.' }
            ] },
          treo: { t: 'Tiểu Đào không nhìn bạn',
            d: 'Tiểu Đào về làng từ sáng sớm và không quay lại trại. Khi gặp bạn ngoài cổng, nàng nhìn bạn một lúc rất lâu, rồi cúi xuống chỉnh lại sợi dây tóc đã sờn màu trên tay.',
            lc: [
              { key: 'goi_lai', label: 'Gọi nàng lại, hỏi vì sao', kind: 'risk', mat: 'Một câu hỏi làm nàng đứng lại.' },
              { key: 'de_di', label: 'Để nàng đi, không gọi', kind: 'safe', mat: 'Một người em không còn nhìn bạn như trước.' }
            ] }
        } },
      // ---------- Phần 6. Lửa cuối: dừng tay lần cuối; đồng hồ thọ nguyên ----------
      { id: 'lua_cuoi', n: 'Lửa cuối', chuc_nang: 'dừng tay lần cuối; đồng hồ thọ nguyên', tuoi: 115, tho: 0.15, cau_hoi: 'Dừng tay lần cuối?',
        biet: 'Triệu Liệt đã nghe tin làng của Tiểu Đào đang cháy.', thang_vui: 'con của Tiểu Đào thổi một khúc sáo', cai_mat: '(kết cục)',
        chang: {
          moc: { t: 'Lửa ở xa',
            d: 'Từ trên núi bạn thấy khói bốc lên từ làng của Tiểu Đào, và tiếng chuông báo động vang vọng qua thung lũng. Thọ nguyên trong người bạn đã mỏng như giấy, và tay bạn không còn đủ sức cầm một cây đục.',
            lc: [
              { key: 'chay_xuong', label: 'Chạy xuống làng ngay', kind: 'risk', mat: 'Đoạn đường dốc và lửa sắp tới.' },
              { key: 'cho_tin', label: 'Đứng trên núi, chờ tin', kind: 'safe', mat: 'Một đêm không phải nhìn thấy lửa gần.' }
            ] },
          leo: { t: 'Đồng hồ thọ',
            d: 'Bạn còn một chút tu vi cuối, đủ để dập một đám lửa hoặc để đứng trước Triệu Liệt một lần nữa. Lão Mộc đã mất từ lâu, và con chim gỗ dở dang vẫn nằm trên bàn trong nhà gỗ.',
            lc: [
              { key: 'dot_can', label: 'Dốc cạn tu vi để dập lửa', kind: 'risk', mat: 'Gần hết phần đời còn lại, nếu thất bại.', tt: { can: { realm: 2 }, han: 120 } },
              { key: 'de_chay', label: 'Để lửa cháy, quay về nhà gỗ', kind: 'safe', mat: 'Cơ hội cuối cùng được sống thêm một đời.' }
            ] },
          // Cảnh lớn: Triệu Liệt già, đốt làng của Tiểu Đào
          cao_trao: { t: 'Triệu Liệt già đốt làng', lon: true, canh: { gio: 'dem', thoi_tiet: 'giong_bao' },
            d: 'Triệu Liệt đã già, tóc bạc và tay run, nhưng lửa vẫn bốc lên từ làng của Tiểu Đào dưới chân núi. Hắn đứng trên đồi, cầm đuốc, và nhìn bạn như chờ bạn chọn gì.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ke_thu', cuu: 'than_nhan', label: 'Dập lửa bằng tu vi cuối', mat: 'Cơ hội chạm Trúc Cơ, và những năm cuối cùng.',
                sau: 'Chút khí cuối rời khỏi bạn như hơi thở rời bình lạnh. Ngọn lửa đầu làng tắt dần, và Triệu Liệt đứng yên như chưa từng cầm đuốc.',
                hau: 'Bạn không còn tu vi, và làng của Tiểu Đào sống được nhờ phần khí cuối của bạn.' },
              { kieu: 'phuc_tung', vt: 'nguoc', doi: 'ke_thu', cuu: 'than_nhan', label: 'Buông tay cho hắn đánh mình đến hả giận', mat: 'Chút sức lực cuối, và danh của kẻ không bao giờ chịu thua.',
                sau: 'Bạn đứng yên, không giơ tay. Triệu Liệt đánh bạn tới khi hả giận, rồi hắn ngồi xuống đất khóc như một đứa trẻ bị bỏ quên.',
                hau: 'Bạn không còn đứng vững như trước, nhưng lần đầu tiên bạn không thấy thù hận trong mắt ai.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ke_thu', cuu: 'than_nhan', label: 'Đánh hắn đến chết', mat: 'Một mạng người già, và cơn giận bạn không bao giờ hết.',
                sau: 'Bạn lao lên, đánh tới khi Triệu Liệt không còn đứng dậy được, rồi đánh thêm một lần nữa. Đuốc rơi xuống cỏ, và ngọn lửa dưới chân núi vẫn cháy.',
                hau: 'Không ai trong làng biết ai đã dập lửa, và không ai nhớ tên bạn.' }
            ] },
          treo: { t: 'Khúc sáo',
            d: 'Sáng hôm sau, con của Tiểu Đào đứng trước cổng trại và thổi một khúc sáo lệch âm. Tiếng sáo vang lên giữa đống tro, và không ai trong trại dám ngắt lời.',
            lc: [
              { key: 'nghe_het', label: 'Đứng nghe đến hết khúc', kind: 'help', mat: 'Chút ấm cuối cùng của một đời.' },
              { key: 'quay_di', label: 'Quay đi, không nghe', kind: 'safe', mat: 'Khúc sáo ở lại một mình.' }
            ] }
        } }
    ],
    // Ba phương án lật (bốc một mỗi đời, nổ ở phần 4 hoặc 5). Chặng "treo" của phần nổ bị thay bằng đoạn sự thật.
    lat: [
      { id: 'a', kieu: 'chinh_ban_la_thu_pham', ten: 'Chính bạn là thủ phạm', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'treo', t: 'Thằng bé bị bạn đánh tối ấy không về phòng, và người ta thấy một cây sáo trúc nằm bên bờ ao.', hieu: 'Thằng bé ấy là Triệu Kỳ, em của Triệu Liệt.' },
          { phan: 2, o: 'cao_trao', t: 'Triệu Kỳ hỏi bạn còn nhớ bờ ao không, ngay trước khi đòn đầu rơi xuống.', hieu: 'Triệu Kỳ là kẻ bạn đã đánh năm mười hai tuổi.' },
          { phan: 3, o: 'cao_trao', t: 'Quan tài của Triệu Kỳ có một vết sẹo trên trán, và bạn nhận ra vết ấy từ lâu.', hieu: 'Vết sẹo là dấu cú đánh năm xưa của bạn.' }
        ],
        no: { biet: 'Triệu Kỳ là em của Triệu Liệt; cú đánh năm mười hai tuổi của bạn đã khiến hắn trở thành người như hôm nay.',
          hieu: 'Chính bạn là thủ phạm của chuyện Triệu Kỳ.',
          d: 'Đêm trước đại điển, Triệu Liệt gọi bạn ra bờ ao. Hắn đứng bên mép nước và nói rất khẽ: "Em tôi không bao giờ thổi sáo sau hôm ấy. Ngươi đã làm nó sợ."',
          lc: [
            { key: 'nhan_toi', label: 'Nhận lỗi, quỳ xuống bờ ao', kind: 'pay', mat: 'Chỗ đứng cao nhất mà bạn đã tự cho mình.', flag: 'lat_nhan_toi' },
            { key: 'chai_mat', label: 'Nói bạn đã quên chuyện năm xưa', kind: 'risk', mat: 'Một lần đứng thẳng nhìn người ta.', flag: 'lat_chai_mat' }
          ] } },
      { id: 'b', kieu: 'lao_mo_giet_cha', ten: 'Lão Mộc là kẻ giết cha bạn', phan_no: 4, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'moc', t: 'Ở bờ ao, bạn thấy một người thợ già có vết bỏng lò rèn chạy vụt qua, rồi biến mất sau hàng cây.', hieu: 'Lão Mộc có vết bỏng từ lò rèn của cha bạn.' },
          { phan: 3, o: 'leo', t: 'Lão Mộc nghe bạn nhắc tới làng cũ thì né đi, và chỉ nói rằng đất nào cũng có người chết vì giận.', hieu: 'Lão Mộc biết làng cũ của bạn và biết người đã chết ở đó.' },
          { phan: 3, o: 'treo', t: 'Cái đục gỗ của lão Mộc có khắc một cái tên nhỏ ở cán, và tên ấy là tên cha bạn.', hieu: 'Lão Mộc đã giết cha bạn bằng chính cây đục này.' }
        ],
        no: { biet: 'Lão Mộc là kẻ năm xưa giết cha bạn trong cơn giận; ông nhẫn nhịn năm mươi năm để chuộc tội.',
          hieu: 'Lão Mộc là người đã giết cha bạn.',
          d: 'Lão Mộc không chờ bạn hỏi. Ông đặt cây đục xuống bàn và nói từng chữ: "Năm ấy ta đánh cha ngươi bằng chính cây đục này, vì một câu nói. Năm mươi năm ta nhẫn nhịn để chuộc lỗi." Rồi ông đưa tay ra, chờ bạn đánh.',
          lc: [
            { key: 'nam_tay', label: 'Nắm lấy tay ông, không đánh', kind: 'help', mat: 'Chút phẫn nộ bạn đáng được có.', flag: 'lat_tha' },
            { key: 'day_ra', label: 'Đẩy tay ông ra, bỏ đi', kind: 'risk', mat: 'Người duy nhất đã vì bạn mà giấu một điều.', flag: 'lat_trach' }
          ] } },
      { id: 'c', kieu: 'ke_ac_co_ly_do', ten: 'Kẻ ác có lý do', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 3, o: 'cao_trao', t: 'Lưng Triệu Kỳ trong quan tài đầy những vết roi cũ, chồng lên nhau như một tấm lưới.', hieu: 'Triệu Kỳ bị roi suốt nhiều năm, và người cầm roi là anh hắn.' },
          { phan: 4, o: 'moc', t: 'Triệu Liệt không bao giờ thổi cây sáo, dù cây sáo vẫn nằm trong tay hắn suốt mấy năm.', hieu: 'Triệu Liệt không dám thổi sáo vì nhớ tiếng em mình.' },
          { phan: 4, o: 'treo', t: 'Triệu Liệt gọi Tiểu Đào bằng tên em trai hắn, rồi im lặng khi nhận ra mình vừa nói gì.', hieu: 'Triệu Liệt đang nhìn Tiểu Đào như nhìn em mình.' }
        ],
        no: { biet: 'Triệu Kỳ treo cổ vì chính Triệu Liệt ép em tập lại bằng roi; Triệu Liệt đổ cơn hận của mình lên bạn.',
          hieu: 'Kẻ ác này có lý do, và lý do ấy là chính hắn.',
          d: 'Triệu Liệt đứng trước bạn trên sân sau, không cầm roi. "Ta ép nó tập lại bằng roi, mỗi ngày, cho tới khi nó không dám thổi sáo nữa," hắn nói. "Rồi ngươi đến, và ta đổ hết lên ngươi."',
          lc: [
            { key: 'hoi_sao', label: 'Hỏi hắn vì sao không nói sớm', kind: 'risk', mat: 'Một câu trả lời muộn màng.', flag: 'lat_doi_mat' },
            { key: 'de_di', label: 'Để hắn đi, không nói gì', kind: 'safe', mat: 'Điều hắn sắp nói ra sẽ không bao giờ được nghe.', flag: 'lat_quay_di' }
          ] } }
    ],
    khong_ke_ac: { phan: 4, o: 'leo', ten: 'Lão Mộc chết già' },
    // Kết cục: chọn theo chuỗi kiểu lựa chọn (vt) ở TT.kb.ketKhuon.
    ket: {
      toan_ven: { t: 'Toàn vẹn', kv: 2, dk: { loai: 'nguoc', min: 3, tu_phan: 3, p6: 'hy_sinh' },
        log: '{ten} ngồi đẽo nốt con chim gỗ của lão Mộc, và tay không còn run nữa.' },
      doa: { t: 'Đọa', kv: 0, xau: true, dk: { loai: 'dkd', phan: [4, 6] },
        log: '{ten} tát một đệ tử vì một câu nói, và nghe trong đầu có ai đó đang đếm.' },
      co_doc: { t: 'Cô độc', kv: 1, xau: true, dk: { loai: 'con_lai' },
        log: '{ten} thắng mọi trận, còn sợi dây tóc đỏ đã mục từ lâu.' }
    }
  });
})();
