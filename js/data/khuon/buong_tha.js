// Khuôn "Buông thả" (Tu dưỡng âm), chép từ ke-hoach/Q-khuon-kich-ban.md mục 8 thành dữ liệu (K3b). Cấu trúc theo js/data/khuon/kieu_hanh.js.
// Ghi chú chép (K3b, Haiku):
//   - Khuyết điểm gốc: luoi (thuốc "kỷ luật và hy sinh" trùng với kds.luoi).
//   - Thang sức mạnh cho Lạc Vân đã sửa theo Q mục 8 (phần 5: Lạc Vân vượt bạn một bậc; cảnh "Kẻ chạy chậm nhất" ghi trong chữ dòng cao trào). Thang chung dùng thang_suc_manh mặc định; cảnh giới thật do bộ máy quyết định.
//   - Dàn: Tô Lão Lục là ke_thu; Lạc Vân là guong (dàn doi_thu); Vô Vi không có trong khuôn này; người thương (thuong) là phụ, dùng chữ ban.
//   - Phụ: phu[0] = Tô Lão Lục (vật con xúc xắc); phu[1] = người thương (vật chuỗi hạt có sẵn, mục 8 không ghi vật).
//   - Muốn chỉ có một câu gốc: a tong / b vung là biến thể cùng ý, c tan_tu giữ câu gốc.
//   - "(ngược)" không ghi kiểu được chọn theo nghĩa: phần 1 "ở lại dạy Lạc Vân" = hy_sinh; phần 2 "đi thi" = hy_sinh, "nhường suất" = tin (vt nguoc; kiểu hy_sinh đã dùng cho "đi thi" nên không lặp khóa trong một cao trào); phần 3 "trả bằng tửu lâu" = hy_sinh; phần 4 "đóng quán đi luyện" = hy_sinh; phần 5 "chạy làm mồi" = hy_sinh (kèm nhịp 2 đốt tửu lâu trong nhãn); phần 6 "giữ cổng bằng tu vi cuối" = hy_sinh.
//   - Phần 3 "không kẻ ác": cha hoặc mẹ chết già trong đêm bạn ở sòng, ghi ở chặng leo lớn (tin / im_lang). Mục 8 đặt cái chết ở treo; đã đưa lên leo để chặng không kẻ ác là cảnh lớn.
//   - Tâm ma 🜏 (P3, P6) chưa mã hóa thành kiểu riêng.
//   - Lật (a) và (c) có manh P5 nhưng lint không cho manh mối ở phần nổ trở đi: dời sang phần 4 (moc / treo).
//   - Thử thách có hạn (tt) đặt ở phần 1 leo "ở lại luyện cùng hắn" và phần 6 leo.
(function () {
  const D = window.TT.data;

  D.STORY.regKhuon({
    id: 'buong_tha', ten: 'Buông thả', khuyet_diem: 'luoi',
    cau_hoi_trung_tam: 'Một đời vui có đáng không, khi lúc cần thì trong tay không có gì?',
    logline: 'Kẻ sống cho đêm hội và bàn bạc, bán dần những thứ người khác đã đổ mồ hôi để giữ; khi trấn cần một người giữ cổng, người còn đứng đó là người bạn đã bỏ lại.',
    bay_manh: {
      vet_thuong: [
        { id: 'a', xt: ['p1', 'p2'], vet: 'cha mẹ khổ cả đời, chết khi chưa được hưởng ngày nào',
          canh: 'Cha mẹ bạn làm lụng cả đời và chết trước khi kịp được ăn một bữa no. Bạn đứng bên mộ và nghĩ rằng sống khổ như thế thì sống để làm gì.' },
        { id: 'b', xt: ['p5'], vet: 'chỉ được no vào những đêm hội làng',
          canh: 'Cô nhi, bạn chỉ được ăn no vào những đêm hội làng, khi người ta thương tình chia cho bát cháo. Những ngày còn lại, bụng bạn đói.' },
        { id: 'c', xt: ['p3', 't10'], vet: 'cha tu khổ sáu mươi năm không đột phá, chết trong căn nhà dột',
          canh: 'Cha bạn tu khổ sáu mươi năm mà không đột phá, và chết trong căn nhà dột giữa mùa mưa.' }
      ],
      loi_noi_doi: 'Khổ luyện là phí đời; vui được lúc nào hay lúc ấy.',
      muon: [
        { id: 'a', cho: 'tong', t: 'một tửu lâu đông khách ngay trong tông, bạn bè và tiếng cười' },
        { id: 'b', cho: 'vung', t: 'một tửu lâu đông khách nhất trấn, bạn bè và tiếng cười' },
        { id: 'c', cho: 'tan_tu', t: 'một tửu lâu đông khách, bạn bè và tiếng cười' }
      ],
      can: 'kỷ luật, và bỏ cái vui của mình vì người khác',
      bong_toi: { vai: 'ke_thu', cach_chon: 'Tô Lão Lục, chủ sòng, bạn rượu cũ, buông thả tới cùng: nợ nần đến mức bán bớt phòng gác của trấn cho đám săn yêu; ra mắt từ phần 1',
        ra_mat: [
          'Tô Lão Lục ôm vò rượu ngồi trên bậc cửa sòng, vỗ vai bạn và nói "Vui đi, còn sống mà."',
          'Tô Lão Lục xóc xúc xắc trên bàn gỗ, cười to, và đẩy một đống bạc về phía bạn như đẩy một món đồ chơi',
          'Tô Lão Lục ghé tai bạn thì thầm chuyện bán một phòng gác, rồi cười như vừa kể một trò đùa'
        ] },
      guong: { vai: ['doi_thu'], dd: 'người cùng khóa khổ luyện đến khô khốc, không biết cười, lúc nào cũng luyện kiếm đến khi tay chảy máu' },
      hy_sinh: 'tửu lâu, cái vui, mạng'
    },
    dan: { ke_thu: 'ke_thu', guong: ['doi_thu'], su: 'su', doi_thu: 'doi_thu', than_nhan: 'than_nhan', ban: 'thuong' },
    soi: {
      chinh: { nguoi: 'guong', vat: [
        { id: 'kiem_go', canh: '{guong} cầm thanh kiếm gỗ bạn đã dạy hắn cầm năm mười hai tuổi, tay đã chai đến không còn cảm thấy đau.', treo: '{guong} đặt thanh kiếm gỗ lên bàn và nói rằng thứ bạn để lại thì cứ để nó nằm đó.' }
      ] },
      phu: [
        { nguoi: 'ke_thu', vat: [{ id: 'xuc_sac' }] },
        { nguoi: 'ban', vat: [{ id: 'chuoi_hat' }] }
      ]
    },
    noi: { chinh: 'trấn Lạc Hà', tong: 'tửu lâu', cam: ['sòng bạc sau cổng trấn'] },
    thang_suc_manh: [
      { realm: 0, dinh: 'người đứng đầu ngoại môn' },
      { realm: 1, stage: 0, dinh: 'đệ tử nội môn có tiếng' },
      { realm: 1, stage: 2, dinh: 'đệ nhất nội môn, người được chọn làm chân truyền' },
      { realm: 2, dinh: 'trưởng lão, người đứng đầu một vùng nhỏ' },
      { realm: 3, dinh: 'cái tên người ta nhắc như huyền thoại' }
    ],
    phan: [
      // ---------- Phần 1. Hội làng: học hay chơi ----------
      { id: 'hoi_lang', n: 'Hội làng', chuc_nang: 'biến cố khởi đầu; học hay chơi', tuoi: 12, cau_hoi: 'Học hay chơi?',
        biet: '{ke_thu} đã rủ bạn đi chơi từ trước.', thang_vui: 'cả làng múa lân, bạn được đội đầu lân', cai_mat: 'một buổi khảo hạch, hoặc một người bạn',
        chang: {
          moc: { t: 'Sân hội',
            d: 'Đêm hội làng sáng rực đèn, tiếng trống vang khắp trấn Lạc Hà. Tô Lão Lục vẫy tay gọi bạn từ bàn rượu, còn Lạc Vân đứng cạnh thanh kiếm gỗ, lặng lẽ nhìn về phía võ trường.',
            lc: [
              { key: 'ra_ban', label: 'Ra bàn rượu uống với Tô Lão Lục', kind: 'risk', mat: 'Một đêm vui, và một lời rủ rê không lùi được.' },
              { key: 'dung_lai', label: 'Đứng lại với Lạc Vân', kind: 'safe', mat: 'Một đêm nhạt, và một người vẫn đợi bạn.' }
            ] },
          leo: { t: 'Khảo hạch',
            d: 'Buổi khảo hạch nội môn trùng đúng đêm hội, và ai vắng mặt sẽ mất suất. Lạc Vân đã xếp hàng từ sớm, còn bạn chưa quyết định đi đâu.',
            lc: [
              { key: 'nho_hap', label: 'Nhờ Lạc Vân đi thay', kind: 'risk', mat: 'Một suất không phải của chính bạn.' },
              { key: 'luyen_cung', label: 'Ở lại, luyện cùng hắn đến tối', kind: 'help', mat: 'Những đêm hội không còn ai nhớ.', tt: { can: { xp: 0.2 }, han: 24 } }
            ] },
          cao_trao: { t: 'Đêm hội và khảo hạch', lon: true, canh: { gio: 'dem', thoi_tiet: 'troi_quang' },
            d: 'Đêm hội và buổi khảo hạch trùng nhau, trống hội vang từ đầu trấn tới cuối võ trường. Lạc Vân đứng ở cổng võ trường một mình, và bạn đứng giữa hai nơi, không biết bước về phía nào.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'guong', cuu: 'ban', label: 'Đi hội, bỏ khảo hạch', mat: 'Một đêm vui, và suất của bạn.',
                sau: 'Bạn quay lưng với võ trường và bước vào đám đông. Tiếng trống hội át đi tiếng gọi của Lạc Vân từ phía sau.',
                hau: 'Cả làng nhớ bạn là người đội đầu lân, và không ai nhớ bạn đã bỏ khảo hạch.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'guong', cuu: 'guong', label: 'Ở lại dạy Lạc Vân cầm kiếm', mat: 'Cả đêm hội, và cái vui bạn vốn chờ.',
                sau: 'Bạn đứng cạnh Lạc Vân và chỉ cho hắn cách nắm kiếm. Tiếng trống hội vọng tới, còn hắn không ngẩng lên, chỉ nói: "Làm lại."',
                hau: 'Lạc Vân nhớ mãi bàn tay bạn đặt lên tay hắn đêm ấy.' },
              { kieu: 'duong_tat', vt: 'dkd', doi: 'guong', cuu: 'ban', label: 'Rủ hắn trốn đi hội cùng', mat: 'Một món nợ không ghi sổ, nhưng sẽ có người đòi.',
                sau: 'Bạn kéo tay Lạc Vân qua cổng võ trường, rồi cả hai cùng chạy vào đám đông. Hắn cười lần đầu tiên sau nhiều năm, và bạn không biết đó là điều tốt hay xấu.',
                hau: 'Không ai kể lại chuyện đêm ấy cho Lạc Vân nghe.' }
            ] },
          treo: { t: 'Lạc Vân giữ thanh kiếm gỗ',
            d: 'Sáng hôm sau, Lạc Vân vẫn giữ thanh kiếm gỗ, lau nó từng đường một. Hắn không hỏi bạn đi đâu tối qua, và điều đó làm bạn khó chịu hơn bất kỳ lời trách nào.',
            lc: [
              { key: 'hoi_sao_khong_trach', label: 'Hỏi hắn vì sao không trách', kind: 'risk', mat: 'Một câu hỏi không có đáp án dễ chịu.' },
              { key: 'noi_mot_dem', label: 'Nói bạn đi chơi vì chỉ một đêm', kind: 'safe', mat: 'Một lời biện hộ nhẹ như gió.' }
            ] }
        } },
      // ---------- Phần 2. Tửu lâu: vốn để làm gì ----------
      { id: 'tuu_lau', n: 'Tửu lâu', chuc_nang: 'vốn để làm gì; thi vào nội môn hay mở quán', tuoi: 30, cau_hoi: 'Vốn để làm gì?',
        biet: '{ke_thu} đã để mắt tới số vốn của bạn.', thang_vui: 'đêm khai trương, Lạc Vân uống chén đầu tiên rồi đi', cai_mat: 'suất nội môn, hoặc vốn của bạn',
        chang: {
          moc: { t: 'Quán mới',
            d: 'Bạn mở một tửu lâu nhỏ ở đầu chợ Lạc Hà, treo đèn lồng đỏ và đặt bàn dài. Khách đến đông hơn bạn tưởng, và tiếng cười trong quán làm bạn thấy đời dễ thở.',
            lc: [
              { key: 'moi_khach', label: 'Mời thêm khách uống chung', kind: 'help', mat: 'Một rượu nữa, và một đêm nữa không ngủ.' },
              { key: 'dem_so', label: 'Đếm lại sổ sách', kind: 'safe', mat: 'Những con số không đổi.' }
            ] },
          leo: { t: 'Thi vào nội môn',
            d: 'Thư mời thi nội môn đến đúng lúc quán đông khách nhất. Lạc Vân đã gửi đơn và đang đợi bạn ký tên bảo lãnh.',
            lc: [
              { key: 'ky_bao_lanh', label: 'Ký bảo lãnh cho hắn', kind: 'help', mat: 'Một chữ ký không phải của bạn để giữ.' },
              { key: 'de_han_lo', label: 'Để hắn tự lo', kind: 'safe', mat: 'Một lối thoát không ai trách.' }
            ] },
          // Cảnh lớn: vốn và suất thi
          cao_trao: { t: 'Vốn và suất thi', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Vốn bạn tích cóp suốt mười năm đặt trước mặt bạn, còn suất nội môn chỉ còn một. Lạc Vân đứng bên bàn, không nói gì, chờ bạn quyết định dùng vốn cho cái gì.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'guong', cuu: 'ban', label: 'Dùng vốn mở tửu lâu', mat: 'Suất vào nội môn của bạn, và cái vui bạn chọn.',
                sau: 'Bạn đẩy số vốn về phía thợ xây, và đêm đó quán mới treo thêm một hàng đèn đỏ. Lạc Vân nhìn bạn một lúc rồi đi thi một mình.',
                hau: 'Tửu lâu đông khách suốt mùa, và Lạc Vân không bao giờ đến uống rượu ở đó.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'guong', cuu: 'ban', label: 'Đi thi, để vốn lại cho quán', mat: 'Vốn tích cóp của bạn.',
                sau: 'Bạn gửi số vốn cho người thợ xây rồi đi thi. Quán mới không ai trông, và tiếng cười trong quán nhỏ dần theo từng ngày.',
                hau: 'Quán đóng cửa một mùa, và bạn không còn đủ vốn để mở lại.' },
              { kieu: 'tin', vt: 'nguoc', doi: 'ban', cuu: 'guong', label: 'Nhường suất cho Lạc Vân', mat: 'Suất nội môn, thứ bạn đã chờ lâu.',
                sau: 'Bạn đẩy tờ đơn thi về phía Lạc Vân và nói rằng hắn cần hơn. Hắn nhìn bạn rất lâu, rồi cầm tờ đơn đi mà không cảm ơn.',
                hau: 'Lạc Vân nợ bạn một suất, và không biết trả bằng gì.' }
            ] },
          treo: { t: 'Sòng bên cạnh',
            d: 'Tô Lão Lục mở sòng ngay bên cạnh quán mới, treo đèn đỏ sáng hơn cả đèn của bạn. Khách đi ngang qua quán bạn rồi ghé sang sòng, và tiếng xúc xắc vang qua vách.',
            lc: [
              { key: 'sang_song', label: 'Sang sòng xem', kind: 'risk', mat: 'Một ván đầu tiên dễ mê.' },
              { key: 'dong_cua_so', label: 'Đóng cửa sổ lại', kind: 'safe', mat: 'Tiếng xúc xắc vẫn lọt qua vách.' }
            ] }
        } },
      // ---------- Phần 3. Sổ nợ: ai trả (cảnh lớn không kẻ ác: cha hoặc mẹ chết già) ----------
      { id: 'so_no', n: 'Sổ nợ', chuc_nang: 'ai trả; cha hoặc mẹ chết già trong đêm bạn ở sòng', tuoi: 55, canh: { realm: 1 }, cau_hoi: 'Ai trả?',
        biet: '{ke_thu} đã ghi tên bạn vào sổ nợ.', thang_vui: '(nếu giữ quán) đêm Trung thu đông khách nhất', cai_mat: 'cha hoặc mẹ, hoặc quán',
        chang: {
          moc: { t: 'Sổ nợ',
            d: 'Tô Lão Lục đưa cho bạn một cuốn sổ nợ dày, trên trang đầu ghi tên bạn với một số tiền lớn. Bạn đọc đi đọc lại, rồi thấy chữ ký của chính mình dưới dòng ấy.',
            lc: [
              { key: 'ky_them', label: 'Ký thêm một dòng nữa', kind: 'risk', mat: 'Một dòng không ai đọc lại.' },
              { key: 'dong_so', label: 'Đóng sổ lại, không đọc tiếp', kind: 'safe', mat: 'Một trang bị bỏ qua.' }
            ] },
          // Cảnh lớn KHÔNG có kẻ ác (khong_ke_ac): cha hoặc mẹ chết già
          leo: { t: 'Cha mẹ chết già', lon: true, canh: { gio: 'hoang_hon', thoi_tiet: 'mua' },
            d: 'Thư về từ thôn báo rằng cha hoặc mẹ đã mất trong đêm bạn ở sòng. Người nhắn tin đứng ở cổng quán, không vào, chỉ đưa thư rồi đi.',
            kieu: [
              { kieu: 'tin', vt: 'nguoc', doi: 'than_nhan', cuu: 'than_nhan', label: 'Viết thư về, kể hết chuyện nợ nần cho người ở nhà', mat: 'Sĩ diện của một đứa con đã đi xa.',
                sau: 'Bạn viết một lá thư dài, kể từ cái sổ nợ đến đêm ở sòng. Người nhà đọc xong, không trách bạn, chỉ nói rằng mong bạn về.',
                hau: 'Bạn giữ lá thư ấy bên người suốt những năm sau.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'than_nhan', cuu: 'than_nhan', label: 'Không viết, để chuyện đó trôi qua', mat: 'Một người mất đi mà bạn không nói được lời nào.',
                sau: 'Bạn gấp thư lại và quay về bàn bạc, không trả lời. Tiếng xúc xắc tiếp tục vang lên sau lưng bạn.',
                hau: 'Bạn không bao giờ biết người ấy có đợi bạn về không.' }
            ] },
          // Cảnh lớn: ai trả nợ
          cao_trao: { t: 'Ai trả nợ', lon: true, canh: { gio: 'dem', thoi_tiet: 'suong_doc' },
            d: 'Chủ sòng ép bạn trả nợ trước khi trời sáng, và danh sách người nợ đã dài đến cuối trang. Tô Lão Lục đứng bên cạnh, cười như chuyện đó không đáng gì.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ke_thu', cuu: 'ban', label: 'Trả bằng tửu lâu', mat: 'Quán bạn gây dựng bằng cả tuổi trẻ.',
                sau: 'Bạn đặt khế quán lên bàn, và Tô Lão Lục nhận lấy mà không cảm ơn. Đèn đỏ của quán tắt dần từ cửa vào.',
                hau: 'Bạn không còn nơi nào để đón khách, và tiếng cười cũng không còn chỗ ở.' },
              { kieu: 'duong_tat', vt: 'dkd', doi: 'ke_thu', cuu: 'ke_thu', label: 'Để hắn bán đất của người khác', mat: 'Đất của người không liên quan, và một món nợ sẽ có người đòi.',
                sau: 'Bạn gật đầu, và Tô Lão Lục ký tên vào tờ giấy bán đất phía đông trấn, không ai trong trấn biết. Hắn cười, và đưa cho bạn một chén rượu.',
                hau: 'Mảnh đất ấy bị bán cho đám săn yêu, và không ai nhắc tới bạn trong chuyện đó.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ke_thu', cuu: 'ban', label: 'Say cho quên', mat: 'Một đêm không nhớ gì, và cả việc mình đã ký gì.',
                sau: 'Bạn uống hết chén này đến chén khác, cho tới khi tiếng xúc xắc chỉ còn là tiếng vọng. Sáng ra, sổ nợ vẫn nằm đó với một dòng mới.',
                hau: 'Từ đêm đó bạn ngủ cạnh chai rượu, và không mơ được gì.' }
            ] },
          treo: { t: 'Đêm Trung thu',
            d: 'Đêm Trung thu, quán bạn đông khách nhất vùng, người ta đứng cả ra đường. Nhưng trong quán không ai hỏi vì sao bạn cầm chén rượu mà tay run.',
            lc: [
              { key: 'uong_them', label: 'Uống thêm một chén', kind: 'risk', mat: 'Một chén nữa để quên đêm nay.' },
              { key: 'dat_chen', label: 'Đặt chén xuống, đi ra ngoài', kind: 'safe', mat: 'Một đêm trăng sáng không ai đi cùng.' }
            ] }
        } },
      // ---------- Phần 4. Ông chủ (chiến thắng giả): cái vui có giữ được trấn không ----------
      { id: 'ong_chu', n: 'Ông chủ', chuc_nang: 'chiến thắng giả: cái vui có giữ được trấn không', tuoi: 85, canh: { realm: 1, stage: 2 }, cau_hoi: 'Cái vui có giữ được trấn không?',
        biet: '{guong} đã đòi bạn cùng luyện trận giữ trấn.', thang_vui: 'tửu lâu đông nhất vùng, ai cũng quý', cai_mat: 'tửu lâu, hoặc Lạc Vân',
        chang: {
          moc: { t: 'Tửu lâu đông nhất vùng',
            d: 'Tửu lâu của bạn đông nhất vùng, ai đi qua trấn cũng ghé uống một chén. Bạn đứng trên gác, nhìn xuống sân đầy tiếng cười, và thấy mình hạnh phúc theo cách bạn từng tin là đúng.',
            lc: [
              { key: 'nang_chen', label: 'Nâng chén mời khách', kind: 'safe', mat: 'Một buổi tối không ai hỏi về ngày mai.' },
              { key: 'xuong_bep', label: 'Xuống bếp hỏi về bạc', kind: 'risk', mat: 'Một con số không ai muốn nghe.' }
            ] },
          leo: { t: 'Lời xin của Lạc Vân',
            d: 'Lạc Vân đến tìm bạn lúc gần sáng, mắt thâm vì luyện kiếm cả đêm. Hắn nói về thú triều ở vùng núi, và xin bạn ba năm để cùng luyện trận giữ trấn.',
            lc: [
              { key: 'hua_sau', label: 'Hứa sẽ luyện, nhưng để sau', kind: 'risk', mat: 'Một lời hứa không ngày.' },
              { key: 'noi_thang', label: 'Nói thẳng, quán không thể đóng', kind: 'safe', mat: 'Một sự thật làm hắn quay đi.' }
            ] },
          // Cảnh lớn: Lạc Vân xin ba năm
          cao_trao: { t: 'Lạc Vân xin ba năm', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Lạc Vân đứng giữa sân quán, trước mặt khách đang uống rượu, và đề nghị bạn đóng cửa ba năm để cùng luyện trận. Cả quán im lặng, chờ bạn chọn giữa cái vui và cái khó.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'guong', cuu: 'ban', label: 'Từ chối, mở thêm quán', mat: 'Cái vui của cả trấn, và một người bạn không được giữ.',
                sau: 'Bạn từ chối rồi bảo người làm khai thêm một chi nhánh. Lạc Vân nhìn bạn lâu, rồi cầm thanh kiếm gỗ đi ra cổng, không ngoái lại.',
                hau: 'Trấn có thêm một quán, nhưng không có thêm một người giữ cổng.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'guong', cuu: 'ban', label: 'Đóng quán, đi luyện cùng hắn', mat: 'Tửu lâu, và cả mùa vui của cả trấn.',
                sau: 'Bạn khóa cửa tửu lâu, trả hết khách về, và đi theo Lạc Vân lên núi. Hàng đèn đỏ sau lưng tắt dần, còn tiếng kiếm gỗ bắt đầu vang lên.',
                hau: 'Bạn không còn tửu lâu, nhưng có một người để cùng đứng gác.' },
              { kieu: 'duong_tat', vt: 'dkd', doi: 'guong', cuu: 'ke_thu', label: 'Đưa tiền thay công', mat: 'Một món nợ không ghi sổ, và ai đó sẽ đòi.',
                sau: 'Bạn đặt một túi bạc lên bàn và bảo Lạc Vân đi thuê người khác luyện. Hắn nhìn túi bạc, rồi nhìn bạn, và cười một tiếng rất khẽ.',
                hau: 'Tô Lão Lục mua rượu bằng bạc lạ, và hỏi bạn có nhớ túi bạc ấy từ đâu ra không.' }
            ] },
          treo: { t: 'Tô Lão Lục mua rượu bằng bạc lạ',
            d: 'Sau cuộc nói chuyện, Tô Lão Lục mang tới cho bạn một bình rượu, trả bằng thứ bạc lạ mà chưa ai trong trấn từng thấy. Hắn nói đây là bạc của một người bạn cũ, và bạn không hỏi thêm.',
            lc: [
              { key: 'uong_luon', label: 'Nhận bình rượu, uống luôn', kind: 'risk', mat: 'Một bình rượu lạ với vị không quen.' },
              { key: 'do_ruou', label: 'Đổ rượu đi, không uống', kind: 'safe', mat: 'Một bạc lạ nằm im trong túi.' }
            ] }
        } },
      // ---------- Phần 5. Kẻ chạy chậm nhất: chạy được không ----------
      { id: 'ke_chay_cham', n: 'Kẻ chạy chậm nhất', chuc_nang: 'tất cả đã mất; chạy được không', tuoi: 100, cau_hoi: 'Chạy được không?',
        biet: '{guong} vẫn còn giữ thanh kiếm gỗ.', thang_vui: '(không)', cai_mat: 'tửu lâu, cái vui, hoặc Lạc Vân',
        chang: {
          moc: { t: 'Tiếng chuông trấn',
            d: 'Chuông báo thú triều vang lên từ đỉnh trấn, và cả quán rượu chạy ra đường trong tiếng la hét. Bạn đứng yên trong quán vắng, chân không nhúc nhích được.',
            lc: [
              { key: 'chay_theo_dam', label: 'Chạy ra theo đám đông', kind: 'risk', mat: 'Một đoạn đường đông đúc và hoảng loạn.' },
              { key: 'dung_trong_quan', label: 'Đứng yên trong quán', kind: 'safe', mat: 'Một quán vắng và một đêm dài.' }
            ] },
          leo: { t: 'Kẻ chạy chậm nhất',
            d: 'Đám khách chạy trước nhất, còn bạn đi sau cùng, tay vẫn cầm một bình rượu. Trên cổng trấn có một bóng người đứng yên, và bạn nhận ra dáng đứng của Lạc Vân.',
            lc: [
              { key: 'bo_binh', label: 'Bỏ bình rượu, chạy về cổng', kind: 'help', mat: 'Một đôi chân không còn đủ nhanh.' },
              { key: 'om_binh', label: 'Ôm bình rượu, đi theo đám đông', kind: 'safe', mat: 'Một bình rượu và một đêm trốn chạy.' }
            ] },
          // Cảnh chuẩn "Kẻ chạy chậm nhất": Lạc Vân đã vượt bạn một bậc cảnh giới (thang sức mạnh đã sửa)
          cao_trao: { t: 'Kẻ chạy chậm nhất', lon: true, canh: { gio: 'dem', thoi_tiet: 'giong_bao' },
            d: 'Thú triều tràn qua cổng trấn, và Lạc Vân đã vượt bạn một bậc cảnh giới, đứng trước cổng với thanh kiếm gỗ. Bạn là người chạy chậm nhất, và cổng phụ bạn từng giữ chìa khóa vẫn chưa được khóa.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ban', cuu: 'guong', label: 'Chạy ra làm mồi, rồi đốt tửu lâu chắn đường', mat: 'Mạng của bạn, và chút thời gian Lạc Vân cần.',
                sau: 'Bạn chạy ra giữa đường, hét lớn để thú quay về phía mình. Ngay sau đó bạn đốt tửu lâu để chắn lối vào trấn, và Lạc Vân giữ được cổng trong khoảnh khắc ấy.',
                hau: 'Lạc Vân không bao giờ nói ra, nhưng hắn nhìn về phía bạn trước khi quay lại cổng.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'ban', label: 'Xuống hầm với khách, khóa cửa lại', mat: 'Mấy người khách và chút lương tâm còn lại.',
                sau: 'Bạn kéo khách xuống hầm rượu và khóa cửa lại. Tiếng thú gầm vọng trên đầu, và bạn ngồi đó, nghe tiếng gỗ nứt.',
                hau: 'Khách trong hầm sống sót, nhưng không ai còn gọi bạn là ông chủ.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'guong', cuu: 'ke_thu', label: 'Bảo Lạc Vân tự làm mồi', mat: 'Một người bạn phải chịu thay sự im lặng của bạn.',
                sau: 'Bạn đứng nhìn hắn một lúc, không nói gì, rồi quay đi. Lạc Vân hiểu, và hắn đứng yên trước cổng, không lùi bước.',
                hau: 'Hắn không bao giờ nhắc chuyện đó, và bạn cũng không nhắc.' }
            ] },
          treo: { t: 'Lạc Vân trọng thương',
            d: 'Sáng hôm sau, người ta khiêng Lạc Vân về trấn, máu thấm qua tấm vải phủ. Trên tay hắn vẫn nắm chặt thanh kiếm gỗ, và chưa ai dám gỡ ra.',
            lc: [
              { key: 'quy_ben_giuong', label: 'Quỳ bên giường, nắm tay hắn', kind: 'help', mat: 'Một lời xin lỗi không ai nghe.' },
              { key: 'dung_ngoai_cua', label: 'Đứng ngoài cửa, không vào', kind: 'risk', mat: 'Một ánh nhìn theo bạn suốt đêm.' }
            ] }
        } },
      // ---------- Phần 6. Đèn cuối: lần này đứng được bao lâu ----------
      { id: 'den_cuoi', n: 'Đèn cuối', chuc_nang: 'thú triều lớn hơn, không còn Lạc Vân; đồng hồ thọ nguyên', tuoi: 115, tho: 0.15, cau_hoi: 'Lần này đứng được bao lâu?',
        biet: 'Lạc Vân đã để lại một đệ tử nhỏ.', thang_vui: 'đệ tử nhỏ của Lạc Vân đưa bạn thanh kiếm gỗ', cai_mat: '(kết cục)',
        chang: {
          moc: { t: 'Thú triều lớn',
            d: 'Thú triều lần này lớn hơn những lần trước, và không còn Lạc Vân đứng ở cổng. Đèn trên tường thành chỉ còn lác đác vài ngọn, và bạn đếm được số người còn lại trong trấn bằng một bàn tay.',
            lc: [
              { key: 'len_tuong', label: 'Lên tường thành giữ đèn', kind: 'help', mat: 'Chỗ đứng cuối cùng nhìn thấy mọi thứ.' },
              { key: 'xuong_ham', label: 'Xuống hầm với những người còn lại', kind: 'safe', mat: 'Một hầm tối và tiếng thở của người khác.' }
            ] },
          leo: { t: 'Thanh kiếm gỗ',
            d: 'Đứa đệ tử nhỏ của Lạc Vân đứng bên bạn, tay cầm thanh kiếm gỗ quá to so với người nó. Bạn còn một chút tu vi cuối, đủ để giữ cổng một lúc hoặc để đưa người chạy.',
            lc: [
              { key: 'dot_giu_cong', label: 'Dốc hết tu vi giữ cổng', kind: 'risk', mat: 'Gần hết phần đời còn lại, nếu thất bại.', tt: { can: { realm: 2 }, han: 120 } },
              { key: 'dua_nguoi_chay', label: 'Dành tu vi để đưa đệ tử chạy', kind: 'safe', mat: 'Một cơ hội cuối cùng được sống thêm một đời.' }
            ] },
          // Cảnh lớn: giữ cổng
          cao_trao: { t: 'Giữ cổng', lon: true, canh: { gio: 'dem', thoi_tiet: 'giong_bao' },
            d: 'Thú triều đập vào cổng trấn, và bạn đứng sau hàng rào gỗ mục với thanh kiếm gỗ trong tay. Phía sau, đệ tử nhỏ vẫn đứng cạnh bạn, không chạy, và bạn phải chọn cách giữ nó.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ke_thu', cuu: 'ban', label: 'Giữ cổng bằng tu vi cuối', mat: 'Tu vi cuối cùng, và những năm còn lại của bạn.',
                sau: 'Chút khí cuối rời khỏi bạn. Cổng gỗ đứng thêm một hơi thở, đủ để người cuối cùng trong trấn chạy qua.',
                hau: 'Đệ tử nhỏ được đưa ra khỏi trấn, và không bao giờ quên thanh kiếm gỗ.' },
              { kieu: 'dao_thoat', vt: 'khac', doi: 'ban', cuu: 'guong', label: 'Chạy đi cùng đám đông', mat: 'Cổng trấn và những người còn ở lại.',
                sau: 'Bạn chạy, mang theo đệ tử nhỏ và thanh kiếm gỗ. Sau lưng, tiếng cổng gỗ vỡ kéo dài như tiếng khóc.',
                hau: 'Bạn sống sót, và không ai trong trấn còn gọi bạn là người gác cổng.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'su', label: 'Mở cổng phụ cho khách quen chạy trước', mat: 'Một cổng bạn từng giữ chìa, và một lời hứa bị bỏ lại.',
                sau: 'Bạn mở cổng phụ, và khách quen chạy lên trước. Thú theo khe cổng phụ vào trấn, và bạn không biết mình đã mở cho ai.',
                hau: 'Từ đêm ấy cổng phụ không bao giờ khóa lại nữa.' }
            ] },
          treo: { t: 'Thanh kiếm được trao lại',
            d: 'Đệ tử nhỏ của Lạc Vân đưa cho bạn thanh kiếm gỗ, và bảo đó là vật của sư phụ nó để lại. Nó không khóc, chỉ đứng thẳng và chờ bạn nhận.',
            lc: [
              { key: 'nhan_kiem', label: 'Nhận lấy, cầm lên', kind: 'help', mat: 'Một thanh kiếm nhẹ hơn bạn tưởng.' },
              { key: 'day_kiem_lai', label: 'Đẩy kiếm lại, không nhận', kind: 'safe', mat: 'Một đứa trẻ đứng một mình.' }
            ] }
        } }
    ],
    // Ba phương án lật (bốc một mỗi đời, nổ ở phần 4 hoặc 5). Chặng "treo" của phần nổ bị thay bằng đoạn sự thật.
    lat: [
      { id: 'a', kieu: 'dong_minh_tay_trong', ten: 'Tô Lão Lục bán trấn', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 3, o: 'cao_trao', t: 'Tô Lão Lục hỏi bạn giờ đổi gác ở cổng trấn, như hỏi chuyện vui.', hieu: 'Tô Lão Lục đang tìm lúc cổng trấn không ai canh.' },
          { phan: 4, o: 'treo', t: 'Tô Lão Lục mang bạc lạ tới đúng ngày trấn đổi thuế, và không ai hỏi bạc từ đâu ra.', hieu: 'Bạc lạ là tiền bán trấn.' },
          { phan: 4, o: 'moc', t: 'Ngày đổi gác ở cổng trấn, một chỗ gác bị bỏ trống theo lệnh từ sổ của Tô Lão Lục.', hieu: 'Cổng gác bỏ trống là việc đã được sắp đặt.' }
        ],
        no: { biet: 'Tô Lão Lục bán trấn cho đám săn yêu, và hắn đã tính trước mọi thứ.',
          hieu: 'Tô Lão Lục là kẻ bán trấn.',
          d: 'Đêm trước thú triều, Tô Lão Lục ngồi trong sòng với một bàn bài trống. "Trấn này không còn ai giữ cổng," hắn nói, "nên ta bán nó cho người biết trả giá." Hắn đẩy một tập giấy về phía bạn và cười.',
          lc: [
            { key: 'xe_giay', label: 'Xé tập giấy, đuổi hắn đi', kind: 'risk', mat: 'Một lần đứng thẳng nhìn người ta.', flag: 'lat_doi_mat' },
            { key: 'cam_giay', label: 'Im lặng, cầm tập giấy về', kind: 'safe', mat: 'Sự thật về người bạn cũ của bạn.', flag: 'lat_quay_di' }
          ] } },
      { id: 'b', kieu: 'lac_van_giu_loi_hua', ten: 'Lạc Vân giữ lời hứa với bạn', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'moc', t: 'Trước khi bạn đi hội, Lạc Vân nói: "Ta sẽ giữ cổng cho cả hai."', hieu: 'Lạc Vân đã hứa giữ cổng cho bạn từ năm mười hai tuổi.' },
          { phan: 2, o: 'leo', t: 'Lạc Vân để lại thanh kiếm gỗ ở quán, cạnh bàn tính sổ, không nói lời nào.', hieu: 'Lạc Vân không muốn bạn quên lời hứa.' },
          { phan: 4, o: 'moc', t: 'Lạc Vân gọi bạn là "người giữ cổng thứ hai" trước mặt khách, và cười như chuyện đùa.', hieu: 'Lời hứa vẫn còn trong hắn, và hắn luôn tin bạn sẽ giữ.' }
        ],
        no: { biet: 'Lạc Vân khổ luyện suốt đời vì một lời hứa với bạn, và chưa bao giờ trách bạn bỏ lỡ.',
          hieu: 'Lời hứa của Lạc Vân vẫn còn nguyên.',
          d: 'Đêm trước thú triều, Lạc Vân ngồi đối diện bạn trong quán vắng, thanh kiếm gỗ đặt giữa bàn. "Ta vẫn đứng ở cổng," hắn nói, "còn ngươi thì nhớ đi về đâu."',
          lc: [
            { key: 'nhan_hua', label: 'Nhận lời hứa, đứng dậy đi theo hắn', kind: 'help', mat: 'Chút phẫn nộ bạn đáng được có.', flag: 'lat_tha' },
            { key: 'bo_hua', label: 'Nói lời hứa đã cũ, bỏ đi', kind: 'risk', mat: 'Người duy nhất đã vì bạn mà giữ cổng.', flag: 'lat_trach' }
          ] } },
      { id: 'c', kieu: 'chinh_ban_la_thu_pham', ten: 'Chính bạn là thủ phạm', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 3, o: 'treo', t: 'Bạn giữ chìa cổng phụ để đón khách quen, và chìa ấy nặng hơn bạn tưởng trong túi áo.', hieu: 'Bạn đang giữ chìa cổng phụ, cổng mà thú sẽ đi qua.' },
          { phan: 4, o: 'moc', t: 'Trên đất bên cổng phụ có dấu chân thú, và dấu ấy đã có từ trước đêm thú triều lần đầu.', hieu: 'Cổng phụ đã mở cho thú từ rất lâu.' },
          { phan: 4, o: 'treo', t: 'Một khách quen tới quán, nhìn bạn một lúc rồi nói: "Hôm đó chính ông mở cổng cho tôi chạy."', hieu: 'Người khách ấy nhớ rõ đêm bạn mở cổng phụ.' }
        ],
        no: { biet: 'Đêm thú triều lần đầu, bạn say và mở cổng phụ cho khách quen; thú vào trấn từ đó.',
          hieu: 'Chính bạn là người mở cổng.',
          d: 'Đêm trước thú triều, bạn đứng một mình bên cổng phụ, chìa khóa trong tay và rượu còn nóng trong bụng. Có một bóng người đi qua khe cổng, và bạn nhận ra mình đã mở cổng cho hắn từ lâu.',
          lc: [
            { key: 'nhan_mo_cong', label: 'Nhận mình đã mở cổng, cúi đầu', kind: 'pay', mat: 'Chỗ đứng cao nhất mà bạn đã tự cho mình.', flag: 'lat_nhan_toi' },
            { key: 'noi_nham', label: 'Nói khách kia nhầm người rồi', kind: 'risk', mat: 'Một lần đứng thẳng nhìn người ta.', flag: 'lat_chai_mat' }
          ] } }
    ],
    khong_ke_ac: { phan: 3, o: 'leo', ten: 'Cha mẹ chết già' },
    // Kết cục: chọn theo chuỗi kiểu lựa chọn (vt) ở TT.kb.ketKhuon.
    ket: {
      toan_ven: { t: 'Toàn vẹn', kv: 2, dk: { loai: 'nguoc', min: 3, tu_phan: 3, p6: 'hy_sinh' },
        log: '{ten} đứng gác ở cổng trấn mỗi đêm, tay cầm thanh kiếm gỗ.' },
      doa: { t: 'Đọa', kv: 0, xau: true, dk: { loai: 'dkd', phan: [4, 6] },
        log: '{ten} rót rượu cho kẻ đã bán trấn, trong tửu lâu sáng đèn suốt đêm thú triều.' },
      co_doc: { t: 'Cô độc', kv: 1, xau: true, dk: { loai: 'con_lai' },
        log: 'Quán đông khách, và không ai trong đó biết tên {ten}.' }
    }
  });
})();
