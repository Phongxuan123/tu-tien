// Khuôn "Ba phải" (Trung dung: không trục nào lệch quá 3), chép từ ke-hoach/Q-khuon-kich-ban.md mục 10 thành dữ liệu (K3b). Cấu trúc theo js/data/khuon/kieu_hanh.js.
// Ghi chú chép (K3b, Haiku):
//   - Khuyết điểm gốc: ba_phai (kds.ba_phai, không thuộc trục nào; thuốc "đứng về một phía").
//   - Dàn: Đổng Uy là ke_thu (bóng tối); Lưu Nghĩa là guong (dàn ban); cha/mẹ và người thân là than_nhan; đối thủ đứng cạnh là doi_thu.
//   - Phụ: phu[0] = Đổng Uy (vật hai lá cờ, vật gương của chữ, không dùng khe {vat_guong} trong dd của Lưu Nghĩa); phu[1] = người thân (vật thư cũ có sẵn; mục 10 không ghi vật phụ thứ hai).
//   - Muốn chỉ có một câu gốc: a tong / b vung là biến thể cùng ý, c tan_tu giữ câu gốc.
//   - "(ngược)" không ghi kiểu được chọn theo nghĩa: phần 1 "đứng về phía Lưu Nghĩa" = tin (vt nguoc); phần 2 "xử cho họ đúng lý, mất lòng họ kia" = hy_sinh; phần 4 "từ chối soạn" = hy_sinh; phần 5 "cắm cờ nghĩa quân" = chong; phần 6 "đứng giữa đê, chịu đòn" = hy_sinh.
//   - Phần 3 "không kẻ ác" là cảnh lũ năm Tý, ghi ở cao trào (các kiểu của nó không chứa chong/tam_ma/duong_tat).
//   - Lật (a) và (b) có manh P5 nhưng lint không cho manh mối ở phần nổ trở đi: dời sang phần 4 (treo). Lật (b) đổi cả manh P5 ("lính đọc tên") thành một cue ở phần 4 treo.
//   - Thử thách có hạn (tt) đặt ở phần 2 leo "hỏi Lưu Nghĩa về đoạn đê".
(function () {
  const D = window.TT.data;

  D.STORY.regKhuon({
    id: 'ba_phai', ten: 'Ba phải', khuyet_diem: 'ba_phai',
    cau_hoi_trung_tam: 'Đứng giữa có phải là đứng ở đâu không?',
    logline: 'Người luôn đứng giữa để ai cũng nể, cho tới khi phải chọn một phía và trả giá; người ấy chỉ còn một lá cờ để giữ.',
    bay_manh: {
      vet_thuong: [
        { id: 'a', xt: ['p1', 'p2'], vet: 'cha mẹ cãi nhau, bắt bạn chọn; chọn ai người kia cũng giận',
          canh: 'Cha mẹ cãi nhau suốt đêm, và mỗi lần bạn chọn bên nào, bên kia lại giận bạn. Bạn học được cách vừa lòng cả hai, và không bao giờ đứng về ai.' },
        { id: 'b', xt: ['p5'], vet: 'sống giữa hai băng trẻ ăn xin, theo bên nào cũng bị bên kia đánh',
          canh: 'Cô nhi, bạn sống giữa hai băng trẻ ăn xin. Theo băng nào cũng bị băng kia đánh, nên bạn học cách đứng ở giữa đường.' },
        { id: 'c', xt: ['p3', 't10'], vet: 'cha là trưởng thôn, bị hai họ trong thôn cùng ghét vì xử công bằng',
          canh: 'Cha bạn là trưởng thôn, xử việc công bằng, và chính vì vậy hai họ trong thôn cùng ghét ông.' }
      ],
      loi_noi_doi: 'Không đứng về phía nào thì không ai ghét mình.',
      muon: [
        { id: 'a', cho: 'tong', t: 'được cả hai phía nể, làm người hòa giải trong tông' },
        { id: 'b', cho: 'vung', t: 'được cả hai phía nể, làm người hòa giải trong vùng' },
        { id: 'c', cho: 'tan_tu', t: 'được cả hai phía nể, làm trưởng thôn, người hòa giải' }
      ],
      can: 'chọn và trả giá',
      bong_toi: { vai: 'ke_thu', cach_chon: 'Đổng Uy, tướng triều, chọn phe mạnh dứt khoát, thắng, khinh kẻ không có mặt; ra mắt từ phần 1',
        ra_mat: [
          'Đổng Uy ngồi trên ngựa ở đầu bãi, nhìn đám trẻ tranh nhau như nhìn một trận đánh nhỏ, và nói: "Phe nào mạnh thì đứng về phe ấy."',
          'Đổng Uy mang giáp đen tới sân đình, đặt tay lên thanh kiếm và nói rằng công bằng là thứ người mạnh được phép có',
          'Đổng Uy nhìn hai lá cờ treo trước cổng thôn, và cười như một người đã chọn xong'
        ] },
      guong: { vai: ['ban'], dd: 'thủ lĩnh nghĩa quân, chọn phe vì lý tưởng, chịu mọi giá, nói ít nhưng không bao giờ lùi' },
      hy_sinh: 'sự nể trọng của cả hai phía, thôn, mạng'
    },
    dan: { ke_thu: 'ke_thu', guong: ['ban'], su: 'su', doi_thu: 'doi_thu', than_nhan: 'than_nhan', ban: 'ban' },
    soi: {
      chinh: { nguoi: 'guong', vat: [
        { id: 'dieu_hai_mau', canh: '{guong} cùng bạn thả con diều hai màu lên đê sông, một màu đỏ và một màu xanh, và cả hai đứa cười khi nó bay cao hơn mái đình.', treo: '{guong} cuộn sợi dây diều lại và đưa cho bạn giữ, nói rằng người giữ dây phải biết mình đứng ở đâu.' }
      ] },
      phu: [
        { nguoi: 'ke_thu', vat: [{ id: 'la_co' }] },
        { nguoi: 'doi_thu', vat: [{ id: 'thu_cu' }] }
      ]
    },
    noi: { chinh: 'thôn Vọng Giang', tong: 'sân đình', cam: ['kho thóc bên đê'] },
    thang_suc_manh: [
      { realm: 0, dinh: 'người đứng đầu ngoại môn' },
      { realm: 1, stage: 0, dinh: 'đệ tử nội môn có tiếng' },
      { realm: 1, stage: 2, dinh: 'đệ nhất nội môn, người được chọn làm chân truyền' },
      { realm: 2, dinh: 'trưởng lão, người đứng đầu một vùng nhỏ' },
      { realm: 3, dinh: 'cái tên người ta nhắc như huyền thoại' }
    ],
    phan: [
      // ---------- Phần 1. Con diều: đứng bên ai ----------
      { id: 'con_dieu', n: 'Con diều', chuc_nang: 'biến cố khởi đầu; đứng bên ai', tuoi: 12, cau_hoi: 'Đứng bên ai?',
        biet: '{ke_thu} đã thấy bạn đứng giữa bãi.', thang_vui: 'con diều hai màu bay cao nhất thôn', cai_mat: 'một con diều, hoặc lòng tin của bạn bè',
        chang: {
          moc: { t: 'Bãi thả diều',
            d: 'Chiều đầu hè, hai nhóm trẻ kéo nhau ra bãi đê để thả diều, và tiếng cãi lộn vang khắp bờ sông. Lưu Nghĩa đứng bên nhóm bên phải, còn bạn đứng ở giữa, tay cầm sợi dây diều hai màu của hai đứa làm chung.',
            lc: [
              { key: 'dung_ben_luu', label: 'Đứng về phía Lưu Nghĩa, nói to', kind: 'risk', mat: 'Một tiếng nói làm cả bãi ngoái lại.' },
              { key: 'dung_yen_giua', label: 'Đứng yên giữa bãi, không nói gì', kind: 'safe', mat: 'Một chỗ đứng không ai trách được.' }
            ] },
          leo: { t: 'Đổng Uy trên ngựa',
            d: 'Đổng Uy cưỡi ngựa đi ngang bãi, nhìn đám trẻ như nhìn một trận đánh nhỏ. Hắn không xuống ngựa, chỉ nói một câu rằng phe nào mạnh thì đứng về phe ấy.',
            lc: [
              { key: 'chon_phe_manh', label: 'Đáp lại rằng nên chọn phe mạnh', kind: 'risk', mat: 'Một câu nói làm hắn để ý.' },
              { key: 'cui_dau', label: 'Cúi đầu, không trả lời', kind: 'safe', mat: 'Một khoảnh khắc không ai nhớ.' }
            ] },
          // Cảnh lớn: hai nhóm trẻ tranh bãi
          cao_trao: { t: 'Hai nhóm trẻ tranh bãi', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Hai nhóm trẻ xô vào nhau giữa bãi thả diều, và con diều hai màu đứt dây bay lên trời. Cả bãi nhìn bạn, chờ bạn đứng về phía nào, còn bạn đứng ở giữa, không ai đứng cạnh.',
            kieu: [
              { kieu: 'tin', vt: 'nguoc', doi: 'ban', cuu: 'guong', label: 'Đứng về phía Lưu Nghĩa, nói to', mat: 'Sự yên ổn của người đứng giữa, và bạn của phe kia.',
                sau: 'Bạn bước sang bên Lưu Nghĩa và nói to rằng bãi này là của chung. Nhóm bên kia im lặng, và có đứa nhìn bạn như nhìn kẻ phản bội.',
                hau: 'Lưu Nghĩa nhớ ngày đó, và từ đó tin bạn hơn bất cứ ai.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'ban', label: 'Làm trung gian, chia đôi bãi', mat: 'Sự nể của cả hai bên, và chút công bằng giả.',
                sau: 'Bạn kéo hai nhóm ra hai đầu bãi, vạch đôi đất bằng gót chân. Không bên nào hài lòng, nhưng cả hai đều im.',
                hau: 'Từ đó người lớn gọi bạn là người hòa giải, và bạn không bác bỏ.' },
              { kieu: 'dao_thoat', vt: 'khac', doi: 'ban', cuu: 'guong', label: 'Bỏ về, bỏ lại con diều', mat: 'Con diều, và cả bãi thả.',
                sau: 'Bạn cuộn sợi dây lại và bỏ về nhà. Con diều hai màu vẫn bay trên đầu hai nhóm trẻ, không ai nhặt nó.',
                hau: 'Con diều bay cao nhất thôn, và chẳng ai nhớ nó là của ai.' }
            ] },
          treo: { t: 'Lưu Nghĩa: "Ngươi lúc nào cũng ở giữa."',
            d: 'Sau trận cãi, Lưu Nghĩa đi ngang bạn, không nhìn, chỉ nói rằng bạn lúc nào cũng ở giữa. Câu ấy nhẹ, nhưng bạn nghe như một lưỡi dao chưa rút ra khỏi vỏ.',
            lc: [
              { key: 'hoi_muon_gi', label: 'Hỏi hắn muốn bạn đứng về đâu', kind: 'risk', mat: 'Một câu hỏi không có đáp án dễ chịu.' },
              { key: 'de_han_di', label: 'Để hắn đi, không đáp', kind: 'safe', mat: 'Một khoảng trống giữa hai người.' }
            ] }
        } },
      // ---------- Phần 2. Trưởng thôn: công bằng hay chia đều ----------
      { id: 'truong_thon', n: 'Trưởng thôn', chuc_nang: 'công bằng hay chia đều', tuoi: 30, cau_hoi: 'Công bằng hay chia đều?',
        biet: '{guong} đã nghe tiếng than của hai họ.', thang_vui: 'được tôn làm trưởng thôn', cai_mat: 'chức trưởng thôn, hoặc tình bạn với Lưu Nghĩa',
        chang: {
          moc: { t: 'Sân đình',
            d: 'Hai họ trong thôn đứng hai bên sân đình, mỗi bên kéo theo một đống chứng cứ về nước tưới ruộng. Đổng Uy không có mặt, nhưng người của hắn đứng đầu cổng, im lặng nhìn vào.',
            lc: [
              { key: 'nghe_hai_ben', label: 'Xin nghe cả hai bên rồi quyết', kind: 'help', mat: 'Một buổi chiều dài và mệt.' },
              { key: 'hen_hom_sau', label: 'Hẹn hôm sau trả lời', kind: 'safe', mat: 'Một đêm nữa để không ai hài lòng.' }
            ] },
          leo: { t: 'Đê và nước',
            d: 'Đêm trước, nước đã tràn qua một đoạn đê của họ kia, và cả hai bên đều nói đoạn đê ấy là của mình. Lưu Nghĩa đứng ngoài sân, tay chắp sau lưng, không nói gì.',
            lc: [
              { key: 'hoi_luu_nghia', label: 'Hỏi Lưu Nghĩa đoạn đê của ai', kind: 'risk', mat: 'Một câu hỏi làm hắn quay mặt đi.', tt: { can: { xp: 0.2 }, han: 24 } },
              { key: 'giu_im', label: 'Giữ im, để hai họ tự nói', kind: 'safe', mat: 'Một đêm hai họ tự cãi nhau.' }
            ] },
          // Cảnh lớn: tranh nước
          cao_trao: { t: 'Tranh nước', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Hai họ đứng đối diện trong sân đình, người nào cũng giơ chứng cứ lên cao. Bạn là người phải nói trước, và cả thôn đang nín thở chờ.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ban', cuu: 'guong', label: 'Xử đúng lý, mất lòng họ kia', mat: 'Sự nể trọng của cả một họ.',
                sau: 'Bạn đọc chứng cứ, xét từng dòng, và phán họ đúng. Họ kia đứng dậy bỏ đi, không ai trong sân gọi lại.',
                hau: 'Trưởng thôn nhận được tiếng thơm, và một nửa thôn không còn chào bạn.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'guong', label: 'Chia đều dù sai lý', mat: 'Sự công bằng bạn đã đánh mất, và sự yên ổn của thôn.',
                sau: 'Bạn chia nước đều cho hai họ, không quan tâm đoạn đê ai hỏng. Cả sân reo lên, và người có lý đứng nhìn không nói gì.',
                hau: 'Trưởng thôn của bạn không ai dám cãi, và cũng không ai tin.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'ban', cuu: 'su', label: 'Để quan xử', mat: 'Một việc bạn không quyết, và một người phải chờ.',
                sau: 'Bạn gửi cả hai họ lên quan huyện và không nói thêm lời nào. Quan xử chậm, và người nghèo bên đê là người chờ lâu nhất.',
                hau: 'Quan xử đúng, nhưng quá muộn cho những hộ đã mất mùa.' }
            ] },
          treo: { t: 'Lưu Nghĩa bỏ làng đi',
            d: 'Sáng hôm sau, Lưu Nghĩa đóng cửa nhà, bỏ làng đi về phía núi. Trong sân không còn ai đứng chờ, và bạn không biết hắn đã đi từ lúc nào.',
            lc: [
              { key: 'duoi_theo', label: 'Đuổi theo hắn', kind: 'help', mat: 'Một đường núi dài và không ai dẫn.' },
              { key: 'dong_san_dinh', label: 'Để hắn đi, đóng cửa sân đình', kind: 'safe', mat: 'Một cánh cửa không ai gõ nữa.' }
            ] }
        } },
      // ---------- Phần 3. Đê sông: mở đê nào (cảnh lớn không kẻ ác: lũ năm Tý) ----------
      { id: 'de_song', n: 'Đê sông', chuc_nang: 'lũ năm Tý; mở đê nào', tuoi: 55, canh: { realm: 1 }, cau_hoi: 'Mở đê nào?',
        biet: '{guong} đã đứng ngoài đê suốt đêm.', thang_vui: '(nếu chọn) xóm được cứu dựng miếu cho bạn', cai_mat: 'một xóm, hoặc cả hai xóm',
        chang: {
          moc: { t: 'Nước lên',
            d: 'Nước sông dâng từ đầu đêm, và tiếng chuông báo lũ vang khắp thôn. Đổng Uy đứng trên đê cao, nhìn hai xóm đang kéo nhau chạy, và hỏi bạn miếu thờ ai.',
            lc: [
              { key: 'tra_loi_than', label: 'Trả lời: thờ thần sông', kind: 'help', mat: 'Một câu trả lời không ai cần nghe.' },
              { key: 'chay_xuong', label: 'Không trả lời, chạy xuống xóm', kind: 'safe', mat: 'Một nhịp chạy không ai theo.' }
            ] },
          leo: { t: 'Đường đê',
            d: 'Bạn đi dọc đê và thấy đoạn đê yếu nhất đang rạn từng mảng. Đổng Uy biết rõ đường đê ấy, và chính hắn nói rằng chỉ một cửa xả có thể mở được.',
            lc: [
              { key: 'doi_mo_hai', label: 'Đòi mở cả hai cửa', kind: 'risk', mat: 'Một đòi hỏi không ai đáp được.' },
              { key: 'lay_cuoc', label: 'Nghe lời hắn, đi lấy cuốc', kind: 'safe', mat: 'Một việc làm đúng lúc, và không hỏi thêm.' }
            ] },
          // Cảnh lớn không kẻ ác: lũ năm Tý
          cao_trao: { t: 'Lũ năm Tý', lon: true, canh: { gio: 'dem', thoi_tiet: 'mua' },
            d: 'Chỉ mở được một cửa xả, và nước sẽ tràn qua xóm còn lại. Bạn đứng trên đê với cây cuốc trong tay, còn hai xóm đang nhìn bạn, và không ai dám chạm vào cửa xả trước khi bạn ra lệnh.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ban', cuu: 'guong', label: 'Mở cửa xả cứu xóm trên, để xóm dưới ngập', mat: 'Một xóm bạn không cứu, và chút tin của bạn.',
                sau: 'Bạn mở cửa xả. Nước đổ về xóm dưới, và tiếng la hét vọng lên từ những mái nhà chìm dần.',
                hau: 'Xóm trên được cứu, và bạn không dám đi xuống xóm dưới nữa.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'ban', label: 'Không mở, để trời quyết', mat: 'Hai xóm cùng chịu nước, và chút lương tâm.',
                sau: 'Bạn không mở cửa xả. Nước tự tìm đường qua đoạn đê rạn, và trời quyết thay bạn.',
                hau: 'Trời quyết nhanh hơn bạn tưởng, và không ai còn nhắc tới lựa chọn ấy.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'ban', cuu: 'guong', label: 'Chia nước làm đôi, cả hai cùng ngập một nửa', mat: 'Một nửa nhà của mỗi xóm.',
                sau: 'Bạn đào thêm một rãnh nhỏ để chia nước về hai phía. Cả hai xóm đều ngập, nhưng không xóm nào mất hết.',
                hau: 'Hai xóm dựng lại nhà, và không xóm nào nhớ ai là người chia nước.' }
            ] },
          treo: { t: 'Nghĩa quân đóng gần thôn',
            d: 'Sau lũ, nghĩa quân kéo về đóng gần thôn Vọng Giang, và cờ của họ dựng sát bờ đê. Đổng Uy không xuống ngựa, chỉ nhìn bạn từ xa, như chờ bạn chọn phe.',
            lc: [
              { key: 'gap_luu_nghia', label: 'Đi gặp Lưu Nghĩa', kind: 'risk', mat: 'Một cuộc gặp không ai giữ bí mật.' },
              { key: 'o_trong_thon', label: 'Ở trong thôn, không ra ngoài', kind: 'safe', mat: 'Một chỗ đứng không ai gọi tên.' }
            ] }
        } },
      // ---------- Phần 4. Hòa giải (chiến thắng giả): hòa bằng gì ----------
      { id: 'hoa_giai', n: 'Hòa giải', chuc_nang: 'chiến thắng giả: hòa bằng gì', tuoi: 85, canh: { realm: 1, stage: 2 }, cau_hoi: 'Hòa bằng gì?',
        biet: '{ke_thu} muốn bạn ghi tên vào văn hòa.', thang_vui: 'cả hai phía mời bạn dự tiệc', cai_mat: 'danh tiếng hòa giải, hoặc người của Lưu Nghĩa',
        chang: {
          moc: { t: 'Tiệc hai bên',
            d: 'Cả triều và nghĩa quân cùng mời bạn dự tiệc, hai bàn đặt đối diện nhau giữa sân đình. Ai cũng nâng chén về phía bạn, và ai cũng nhìn xem bạn sẽ ngồi bên nào.',
            lc: [
              { key: 'ngoi_giua', label: 'Ngồi giữa hai bàn', kind: 'safe', mat: 'Một chỗ không thuộc về ai.' },
              { key: 'ngoi_ban_trieu', label: 'Ngồi hẳn vào bàn triều', kind: 'risk', mat: 'Một chỗ có người nhìn bạn như kẻ thắng.' }
            ] },
          leo: { t: 'Văn hòa',
            d: 'Đổng Uy đưa cho bạn một tờ giấy trống, nói rằng bạn soạn văn hòa là hợp nhất. Hắn xin bạn ghi thêm một dòng "ân xá" cho những người đã trốn trong kho thóc.',
            lc: [
              { key: 'viet_dung_y', label: 'Viết văn hòa đúng như hắn muốn', kind: 'risk', mat: 'Một chữ ký không rút lại được.' },
              { key: 'hoi_kho_thoc', label: 'Hỏi lại xem ai đã trốn trong kho', kind: 'safe', mat: 'Một câu hỏi làm không khí nặng hơn.' }
            ] },
          // Cảnh chuẩn văn hòa
          cao_trao: { t: 'Văn hòa', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Bạn cầm bút trước bàn hòa, văn hòa đã viết xong một nửa. Cả hai phía chờ bạn đặt bút xuống, và một danh sách ân xá nằm ngay bên tay bạn.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'guong', cuu: 'ke_thu', label: 'Ký văn có điều khoản giao nộp "kẻ cầm đầu"', mat: 'Một người bị giao nộp, và chiếc ghế hòa giải của bạn.',
                sau: 'Bạn ký tên dưới điều khoản giao nộp. Đổng Uy cầm tờ văn hòa lên, đọc to, và cả sân vỗ tay như vừa xong một trận đánh.',
                hau: 'Có người tìm tới bạn sau đó và nói rằng bạn đã ký tên một người bạn mình.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'guong', cuu: 'ban', label: 'Từ chối soạn văn hòa, đứng dậy bỏ tiệc', mat: 'Chiếc ghế hòa giải, và sự nể của cả hai bên.',
                sau: 'Bạn đặt bút xuống và đứng dậy. Cả hai bàn đều im, và bạn bước ra khỏi sân đình giữa những cái nhìn không ai đoán được.',
                hau: 'Hai phía đều nhớ bạn là người không chịu cúi đầu, và không bên nào mời bạn dự tiệc nữa.' },
              { kieu: 'duong_tat', vt: 'dkd', doi: 'guong', cuu: 'ban', label: 'Soạn hai bản khác nhau cho hai bên', mat: 'Một lời nói dối, và cả hai bên sẽ biết.',
                sau: 'Bạn viết hai bản văn hòa: một cho triều, một cho nghĩa quân, khác nhau ở đúng một điều khoản. Cả hai bên đều vui vẻ ký, nhưng không ai đọc hết bản của bên kia.',
                hau: 'Lưu Nghĩa sớm muộn cũng đọc được bản của triều.' }
            ] },
          treo: { t: 'Kho thóc',
            d: 'Đêm ấy bạn giấu người của Lưu Nghĩa trong kho thóc, mở cửa kho cho họ trốn, và không hỏi họ là ai. Người gác kho nhìn bạn, không nói gì, rồi quay đi.',
            lc: [
              { key: 'cam_den_kiem', label: 'Cầm đèn đi kiểm tra kho', kind: 'risk', mat: 'Một ánh đèn có thể làm lộ tất cả.' },
              { key: 'de_yen', label: 'Để yên, không hỏi gì', kind: 'safe', mat: 'Một đêm không ai biết mình đã làm gì.' }
            ] }
        } },
      // ---------- Phần 5. Hai lá cờ: lá nào ----------
      { id: 'hai_la_co', n: 'Hai lá cờ', chuc_nang: 'tất cả đã mất; đứng về đâu', tuoi: 100, cau_hoi: 'Lá nào?',
        biet: '{guong} đã biết bạn giấu người trong kho.', thang_vui: '(không)', cai_mat: 'chỗ đứng giữa, hoặc người bạn của Lưu Nghĩa',
        chang: {
          moc: { t: 'Sân đình trống',
            d: 'Sân đình trống trơn, người của cả hai phía đã rút đi, chỉ còn lại mấy cây cờ bị bỏ quên. Trong kho thóc có tiếng người thở nhẹ, và bạn biết mình sắp phải đi qua sân để tới đó.',
            lc: [
              { key: 'di_thang', label: 'Đi thẳng qua sân tới kho', kind: 'help', mat: 'Một đoạn đường trống không có ai che.' },
              { key: 'dung_cho_sang', label: 'Đứng ngoài chờ trời sáng', kind: 'safe', mat: 'Một đêm thêm để nghĩ.' }
            ] },
          leo: { t: 'Bản chép',
            d: 'Một lính triều đưa cho bạn một tờ danh sách, đọc tên theo đúng thứ tự bạn đã viết trong văn hòa. Bạn nhận ra trật tự ấy, và biết mình đã vô tình viết ra danh sách này.',
            lc: [
              { key: 'tra_danh_sach', label: 'Trả lại danh sách, hỏi lính ai đưa', kind: 'risk', mat: 'Một câu hỏi không ai muốn trả lời.' },
              { key: 'cat_tay_ao', label: 'Cất danh sách vào tay áo', kind: 'safe', mat: 'Một tờ giấy nhẹ, và một gánh nặng.' }
            ] },
          // Cảnh chuẩn "Hai lá cờ"
          cao_trao: { t: 'Hai lá cờ', lon: true, canh: { gio: 'dem', thoi_tiet: 'suong_doc' },
            d: 'Ở đầu sân đình có hai lá cờ, cờ triều và cờ nghĩa quân, và cả hai đều đang được đưa tới tay bạn. Phản đòn của Lưu Nghĩa vang lên từ bóng tối: "Giờ dẫn ta ra kho thóc."',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'guong', cuu: 'ban', label: 'Cắm cờ triều', mat: 'Chỗ đứng của người đã chọn phe mạnh.',
                sau: 'Bạn cắm lá cờ triều lên cột đình. Lưu Nghĩa đứng im dưới sân, không nói thêm gì, và lính triều reo lên.',
                hau: 'Kho thóc bị lục soát đêm đó, và bạn không cần nhìn xem ai bị dẫn đi.' },
              { kieu: 'chong', vt: 'nguoc', doi: 'su', cuu: 'guong', label: 'Cắm cờ nghĩa quân lên cột đình', mat: 'Chỗ đứng của bạn trong triều, và có lẽ cả mạng.',
                sau: 'Bạn cắm lá cờ nghĩa quân lên cột đình. Cả sân im phắt, và tiếng gió làm lá cờ kêu khẽ.',
                hau: 'Lưu Nghĩa nhìn lá cờ một lúc, rồi cúi đầu, không nói gì.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'guong', cuu: 'ban', label: 'Xin thêm một ngày', mat: 'Một ngày nữa cho hai bên, và cho chính bạn.',
                sau: 'Bạn nói rằng đợi sáng mai. Cả sân đình im lặng, và hai lá cờ được hạ xuống cùng lúc.',
                hau: 'Sáng mai không đến; người trong kho thóc đã đi trước.' }
            ] },
          treo: { t: 'Lưu Nghĩa thấy ai cầm đuốc',
            d: 'Trong đêm, Lưu Nghĩa đứng ngoài kho thóc, nhìn những ngọn đuốc đi qua đê. Hắn không gọi ai, chỉ đếm từng ngọn đuốc cho tới khi sáng.',
            lc: [
              { key: 'dem_cung', label: 'Đứng bên hắn, đếm cùng', kind: 'help', mat: 'Một đêm không ai nói chuyện.' },
              { key: 'quay_vao', label: 'Quay vào trong, không nhìn', kind: 'safe', mat: 'Những ngọn đuốc đi qua bên ngoài.' }
            ] }
        } },
      // ---------- Phần 6. Cờ cuối: lần này đứng ở đâu ----------
      { id: 'co_cuoi', n: 'Cờ cuối', chuc_nang: 'trận cuối ở Vọng Giang; đồng hồ thọ nguyên', tuoi: 115, tho: 0.15, cau_hoi: 'Lần này đứng ở đâu?',
        biet: 'Đứa trẻ Vọng Giang vẫn còn nhớ con diều.', thang_vui: 'một đứa trẻ thả lại con diều hai màu', cai_mat: '(kết)',
        chang: {
          moc: { t: 'Trận cuối ở Vọng Giang',
            d: 'Trận cuối nổ ra ở Vọng Giang, và hai phía đứng đối diện nhau trên đê. Đổng Uy cầm cờ triều, Lưu Nghĩa cầm cờ nghĩa, và không ai nhìn sang phía bạn.',
            lc: [
              { key: 'dung_giua_de', label: 'Đứng giữa đê', kind: 'risk', mat: 'Một chỗ đứng không ai muốn giữ.' },
              { key: 'dung_xa', label: 'Đứng ngoài, xa đê', kind: 'safe', mat: 'Một khoảng cách không ai hiểu.' }
            ] },
          leo: { t: 'Tuổi thọ',
            d: 'Thọ nguyên của bạn chỉ còn một phần nhỏ, đủ để đứng giữa đê thêm một trận. Con diều hai màu của hai đứa trẻ vẫn cuộn trong túi áo bạn, và sợi dây đã mục từ lâu.',
            lc: [
              { key: 'dung_vung', label: 'Dùng nốt tu vi cuối để đứng vững giữa đê', kind: 'risk', mat: 'Gần hết phần đời còn lại, nếu thất bại.', tt: { can: { realm: 2 }, han: 120 } },
              { key: 'lui_ve', label: 'Để tu vi lại, lui về thôn', kind: 'safe', mat: 'Một cơ hội được sống thêm một đời.' }
            ] },
          // Cảnh lớn: trận cuối
          cao_trao: { t: 'Trận cuối', lon: true, canh: { gio: 'dem', thoi_tiet: 'giong_bao' },
            d: 'Hai bên xông vào nhau trên đê, tiếng hò reo vang khắp Vọng Giang. Bạn đứng ở giữa, và cả hai bên đều chờ bạn bước sang một phía.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ban', cuu: 'guong', label: 'Đứng ra giữa, cầm cờ, chịu đòn của cả hai bên bằng tu vi cuối', mat: 'Tu vi cuối cùng và sự nể của cả hai phía.',
                sau: 'Bạn cầm cờ đứng giữa đê, không đỡ đòn, không lùi. Đòn của cả hai phía đổ xuống người bạn, và tiếng hò reo tắt dần.',
                hau: 'Hai phía ngừng tay, và trên đê chỉ còn một lá cờ bạn cắm xuống.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'ban', label: 'Đứng ngoài trận, không bước vào', mat: 'Một trận lớn, và một thôn nhìn bạn đứng nhìn.',
                sau: 'Bạn đứng xa đê, nhìn trận đánh như nhìn một bức tranh. Khi trận tan, bạn không còn ai để bước về phía.',
                hau: 'Hai bên đều không nhớ bạn đã đứng ở đâu.' },
              { kieu: 'tam_ma', vt: 'dkd', doi: 'guong', cuu: 'su', label: 'Dẫn quân triều vào trận', mat: 'Điều bạn không dám nói ra.',
                sau: 'Bạn quay lại vẫy tay, và quân triều tràn qua đê. Lưu Nghĩa đứng sững, nhìn bạn, và không tin nổi.',
                hau: 'Đó là lần cuối bạn còn được gọi là người hòa giải.' }
            ] },
          treo: { t: 'Đứa trẻ thả diều',
            d: 'Sáng hôm sau trận tan, một đứa trẻ Vọng Giang đứng bên đê, tay cầm con diều hai màu vừa được nhặt lên. Nó thả con diều bay lên, và không ai trong thôn dám nói rằng đó là của phe nào.',
            lc: [
              { key: 'nhin_dieu', label: 'Nhìn theo con diều bay', kind: 'help', mat: 'Một khoảnh khắc nhẹ nhõm.' },
              { key: 'di_qua', label: 'Đi qua, không ngoảnh lại', kind: 'safe', mat: 'Một con diều không ai giữ.' }
            ] }
        } }
    ],
    // Ba phương án lật (bốc một mỗi đời, nổ ở phần 4 hoặc 5). Chặng "treo" của phần nổ bị thay bằng đoạn sự thật.
    lat: [
      { id: 'a', kieu: 'con_roi_cua_ke_thu', ten: 'Lưu Nghĩa là con rơi của Đổng Uy', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 2, o: 'leo', t: 'Lưu Nghĩa không biết cha mình là ai, và hắn nói điều ấy như chuyện của người khác.', hieu: 'Lưu Nghĩa không biết cha là ai, và có lẽ người ấy đang tìm hắn.' },
          { phan: 4, o: 'moc', t: 'Đổng Uy hỏi bạn về "thằng nhóc thả diều" ở bãi đê năm nào, giọng nhẹ như hỏi về thời tiết.', hieu: 'Đổng Uy đang tìm đứa trẻ thả diều, chính là Lưu Nghĩa.' },
          { phan: 4, o: 'treo', t: 'Đổng Uy dừng đuốc trước kho thóc, nhìn lâu vào cửa, và không gọi ai vào.', hieu: 'Đổng Uy biết Lưu Nghĩa đang trốn trong kho.' }
        ],
        no: { biet: 'Lưu Nghĩa là con rơi của Đổng Uy; hắn chọn phe nghĩa quân vì không ai nói cho hắn biết cha mình là ai.',
          hieu: 'Lưu Nghĩa là con của Đổng Uy.',
          d: 'Đổng Uy đứng trước kho thóc, không rút kiếm. "Năm ấy ta bỏ con lại bãi đê," hắn nói, giọng khàn đi. "Ta đã nhìn thấy con thả diều, và ta không gọi."',
          lc: [
            { key: 'mo_kho', label: 'Mở cửa kho cho hai cha con gặp nhau', kind: 'help', mat: 'Một lần đứng về phía người không ai đứng về.', flag: 'lat_tha' },
            { key: 'chan_cua', label: 'Đứng chắn trước cửa kho', kind: 'risk', mat: 'Một lần đứng về phía nghĩa quân.', flag: 'lat_trach' }
          ] } },
      { id: 'b', kieu: 'chinh_ban_la_thu_pham', ten: 'Chính bạn là thủ phạm', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 2, o: 'moc', t: 'Bạn lập danh sách các hộ trong thôn để chia nước, và tờ danh sách ấy có tên mọi nhà.', hieu: 'Danh sách của bạn là thứ được dùng để tìm người.' },
          { phan: 4, o: 'leo', t: 'Đổng Uy xin bạn ghi thêm vài cái tên vào văn hòa "cho đủ thủ tục".', hieu: 'Danh sách "ân xá" thực ra là danh sách bắt người.' },
          { phan: 4, o: 'treo', t: 'Lưu Nghĩa cầm một bản chép văn hòa, dòng tên của mình được gạch chéo.', hieu: 'Văn hòa đã được dùng để bắt người trong kho.' }
        ],
        no: { biet: 'Danh sách ân xá bạn soạn kèm văn hòa là danh sách Đổng Uy dùng để bắt nghĩa quân.',
          hieu: 'Chính bạn đã đưa danh sách cho triều.',
          d: 'Lính triều đọc tên theo đúng thứ tự bạn đã viết, từng người một, và nghĩa quân trong kho thóc bị kéo ra. Lưu Nghĩa đứng ở đầu đê với một bản chép trong tay, và không nhìn về phía bạn.',
          lc: [
            { key: 'nhan_soan', label: 'Nhận mình là người soạn danh sách', kind: 'pay', mat: 'Chỗ đứng cao nhất mà bạn đã tự cho mình.', flag: 'lat_nhan_toi' },
            { key: 'noi_thu_tuc', label: 'Nói bạn chỉ soạn văn cho đủ thủ tục', kind: 'risk', mat: 'Một lần đứng thẳng nhìn người ta.', flag: 'lat_chai_mat' }
          ] } },
      { id: 'c', kieu: 'ke_ac_co_ly_do', ten: 'Kẻ ác có lý do', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 2, o: 'leo', t: 'Đổng Uy biết rõ từng khúc đường đê, như người đã đi qua nó từ thuở nhỏ.', hieu: 'Đổng Uy là người Vọng Giang, và đê này là đê của làng hắn.' },
          { phan: 3, o: 'moc', t: 'Đổng Uy hỏi bạn miếu này thờ ai, và khi bạn nói thờ thần sông, hắn chỉ gật đầu.', hieu: 'Đổng Uy biết đến miếu từ thuở nhỏ, và biết ai đã được thờ ở đó.' },
          { phan: 4, o: 'treo', t: 'Đổng Uy đứng trên sân đình rất lâu, nhìn chỗ đất trống nơi nhà cũ của hắn từng đứng.', hieu: 'Nhà cũ của Đổng Uy đã bị giết cả nhà trong đêm lũ, khi cả thôn đứng yên nhìn.' }
        ],
        no: { biet: 'Đổng Uy là người Vọng Giang; năm xưa nhà hắn bị giết khi cả thôn đứng giữa không ai lên tiếng; hắn chọn phe mạnh để không bao giờ bị đứng giữa nữa.',
          hieu: 'Đổng Uy không tin vào sự đứng giữa.',
          d: 'Đổng Uy nói với bạn bằng giọng bình thản. "Năm ấy cả thôn đứng giữa, và nhà ta cháy cả đêm," hắn nói. "Ta sẽ không bao giờ đứng giữa nữa, và ngươi thì đã đứng đó quá lâu."',
          lc: [
            { key: 'hoi_vi_sao', label: 'Hỏi hắn vì sao không nói sớm', kind: 'risk', mat: 'Một câu trả lời muộn màng.', flag: 'lat_doi_mat' },
            { key: 'cui_dau', label: 'Cúi đầu, không trả lời', kind: 'safe', mat: 'Điều hắn sắp nói ra sẽ không bao giờ được nghe.', flag: 'lat_quay_di' }
          ] } }
    ],
    khong_ke_ac: { phan: 3, o: 'cao_trao', ten: 'Lũ năm Tý' },
    // Kết cục: chọn theo chuỗi kiểu lựa chọn (vt) ở TT.kb.ketKhuon.
    ket: {
      toan_ven: { t: 'Toàn vẹn', kv: 2, dk: { loai: 'nguoc', min: 3, tu_phan: 3, p6: 'hy_sinh' },
        log: '{ten} đứng giữa sân đình, trên tay chỉ một lá cờ.' },
      doa: { t: 'Đọa', kv: 0, xau: true, dk: { loai: 'dkd', phan: [4, 6] },
        log: '{ten} soạn văn hòa cho một cuộc chiến mới, và cả hai phía đều cảm ơn.' },
      co_doc: { t: 'Cô độc', kv: 1, xau: true, dk: { loai: 'con_lai' },
        log: 'Cả hai phía đều nể {ten}, và không phía nào nhớ tên.' }
    }
  });
})();
