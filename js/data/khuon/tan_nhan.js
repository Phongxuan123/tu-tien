// Khuôn "Tàn nhẫn" (Đạo đức âm: vị kỷ đến ác), chép từ ke-hoach/Q-khuon-kich-ban.md mục 3 thành dữ liệu (K3a). Cấu trúc theo js/data/khuon/kieu_hanh.js (ĐỊNH DẪN DẠNG KHUÔN ở đó).
// Ghi chú chép (K3a, Haiku):
//   - Khuyết điểm gốc: vi_ky (thuốc "vị tha" trùng với kds.vi_ky).
//   - Mục 3 không ghi lc cho mốc/leo/treo và không ghi "cái mất"/"phần thang_vui" đủ cho mọi phần: các lựa chọn đó được viết theo đúng giọng khuôn "kiêu hãnh" (kịch bản cụ thể bốc từ đây).
//   - "Muốn" chỉ có một câu gốc; câu gốc giữ ở phương án c (tan_tu), hai phương án a, b là biến thể cùng ý theo phạm vi (tông, vùng).
//   - Kiểu "(ngược)" chưa ghi kiểu cụ thể được chọn theo nghĩa: phần 1 "chia đôi" = hy_sinh; phần 2 "bỏ đi" = dao_thoat (vt nguoc, để lint có ngược); phần 4 "để hắn đánh mình" = phuc_tung; phần 5 "tự kể cho nàng trước" = phuc_tung; phần 6 "tin" (uống chén, cảm ơn).
//   - Phần 5 "cầm dao (tam_ma hoặc dung_khuyet_diem)": chọn tam_ma (vt dkd), vì chỉ tam_ma là tâm ma và đúng lint một kiểu tâm ma.
//   - Phụ phải có vật cho mỗi người (builder dùng soi.phu[0] làm vật gương, soi.phu[1] làm vật thầy): kẻ báo thù dùng thu_cu (lá thư cũ có sẵn), lão tổ dùng con_dao_te.
//   - Lật nổ ở phần 4 hoặc 5 (lint); manh mối không cài ở phần 5 trở đi.
(function () {
  const D = window.TT.data;

  D.STORY.regKhuon({
    id: 'tan_nhan', ten: 'Tàn nhẫn', khuyet_diem: 'vi_ky',
    cau_hoi_trung_tam: 'Mạng người khác đáng giá bao nhiêu khi đặt cạnh con đường của mình?',
    logline: 'Kẻ đi lên từ cái đói đổi mạng người lấy tu vi từng bậc; khi đứng trên tất cả thì thứ người ấy đã không coi là người vẫn còn sống, và là thứ duy nhất có thể cứu hắn.',
    bay_manh: {
      vet_thuong: [
        { id: 'a', xt: ['p1', 'p2'], vet: 'cả nhà chết vì nhà bên giấu gạo',
          canh: 'Năm đói, cả nhà bạn chết dần trong túp lều, còn nhà bên cạnh chất đầy gạo mà không chịu cho một bát nào.' },
        { id: 'b', xt: ['p5'], vet: 'bị bỏ lại giữa đường khi phát bệnh, sống nhờ cướp',
          canh: 'Năm mười tuổi bạn phát bệnh giữa đường và bị bỏ lại đó, không ai đỡ dậy, và bạn phải sống nhờ cướp cho tới khi đủ lớn để cướp lại.' },
        { id: 'c', xt: ['p3', 't10'], vet: 'cha bị bạn thân lừa hết gia sản rồi treo cổ',
          canh: 'Bạn thân của cha đã lừa hết gia sản, và một đêm cha bạn treo cổ trên xà nhà; bạn đứng ngoài cửa, không dám vào.' }
      ],
      loi_noi_doi: 'Thế gian ăn thịt người; ta ăn trước thì ta sống.',
      muon: [
        { id: 'a', cho: 'tong', t: 'không ai trong {noi} lấy được gì của mình' },
        { id: 'b', cho: 'vung', t: 'không ai trong vùng lấy được gì của mình' },
        { id: 'c', cho: 'tan_tu', t: 'mạnh tới mức không ai lấy được gì của mình' }
      ],
      can: 'thấy người khác là người',
      bong_toi: { vai: 'su', cach_chon: 'Huyết Thủ lão tổ, người dạy ma công, đã "ăn" hết mọi thứ kể cả đồ đệ cũ; ra mắt từ phần 2 (bái sư)',
        ra_mat: [
          'lão tổ ngồi trên chiếu cói, lau con dao tế, nói như nói chuyện thời tiết: "Kẻ yếu đằng nào cũng chết."',
          'lão tổ đếm từng đứa trẻ đói trong sân bằng ngón tay, đếm xong thì gật đầu với bạn như người chọn đồ',
          'lão tổ đặt bát cháo trước mặt bạn, như người ta đặt cho chó ăn, và bảo bạn ăn đi cho chóng lớn'
        ] },
      guong: { vai: ['ke_thua', 'huynh'], dd: 'đứa trẻ sống sót từ việc ác của chính bạn, ngây thơ, lúc nào cũng ở cạnh bạn' },
      hy_sinh: 'ma công, tu vi, mạng'
    },
    dan: { ke_thu: 'ke_thu', guong: ['ke_thua', 'huynh'], su: 'su', doi_thu: 'doi_thu', than_nhan: 'than_nhan', ban: 'ban' },
    soi: {
      chinh: { nguoi: 'guong', vat: [
        { id: 'luoc_bac', canh: '{guong} cúi nhặt chiếc lược bạc của mẹ mình từ đống tro của thôn cháy, vuốt bụi rồi cài lên tóc.', treo: '{guong} đưa chiếc lược bạc cho bạn giữ, nói rằng mẹ bảo khi thấy ai bị bỏ lại thì nhớ chải tóc cho họ.' }
      ] },
      phu: [
        { nguoi: 'ke_thu', vat: [{ id: 'thu_cu' }] },
        { nguoi: 'su', vat: [{ id: 'con_dao_te' }] }
      ]
    },
    noi: { chinh: 'thôn Thạch Khê', tong: 'động phủ ma tu', cam: ['động phủ ma tu'] },
    thang_suc_manh: [
      { realm: 0, dinh: 'người đứng đầu ngoại môn' },
      { realm: 1, stage: 0, dinh: 'đệ tử nội môn có tiếng' },
      { realm: 1, stage: 2, dinh: 'đệ nhất nội môn, người được chọn làm chân truyền' },
      { realm: 2, dinh: 'trưởng lão, người đứng đầu một vùng nhỏ' },
      { realm: 3, dinh: 'cái tên người ta nhắc như huyền thoại' }
    ],
    phan: [
      // ---------- Phần 1. Miếng ăn: biến cố khởi đầu; miếng ăn đổi bằng gì ----------
      { id: 'mieng_an', n: 'Miếng ăn', chuc_nang: 'biến cố khởi đầu; miếng ăn đổi bằng gì', tuoi: 12, cau_hoi: 'Bạn sống bằng gì?',
        biet: '{su} đã để mắt tới bạn từ đêm đầu.', thang_vui: 'lần đầu no bụng', cai_mat: 'phần ăn của một đứa nhỏ hơn',
        chang: {
          moc: { t: 'Đêm đói trong thôn',
            d: 'Thôn Thạch Khê đói tới mức người ta ăn cả lá khô. Bạn đi qua một đám trẻ ngồi xổm dưới gốc đa, và lão tổ đứng xa dưới bóng cây, nhìn chúng như nhìn ruộng lúa chín.',
            lc: [
              { key: 'nhin_di', label: 'Quay đi, không nhìn đám trẻ', kind: 'safe', mat: 'Một đêm yên, và sự quên sau này.' },
              { key: 'ngoi_xuong', label: 'Ngồi xuống chia cho đám trẻ một ít rễ cây', kind: 'help', mat: 'Phần ăn của chính bạn sẽ ít đi.' }
            ] },
          leo: { t: 'Cái bánh bao',
            d: 'Một đứa nhỏ hơn bạn cầm cái bánh bao vừa xin được, đưa lên miệng mà mắt không rời khỏi bạn. Bạn đói tới mức tay đã đưa ra trước khi kịp nghĩ.',
            lc: [
              { key: 'giat_banh', label: 'Giật lấy cái bánh rồi chạy', kind: 'risk', mat: 'Một món nợ không ghi sổ, nhưng sẽ có người đòi.' },
              { key: 'nhin_banh', label: 'Rụt tay lại, nuốt nước bọt', kind: 'safe', mat: 'Cơn đói còn nguyên.' }
            ] },
          cao_trao: { t: 'Miếng ăn cuối', lon: true, canh: { gio: 'dem', thoi_tiet: 'suong_doc' },
            d: 'Cuối mùa đói chỉ còn một cái bánh trong cả thôn, và đứa nhỏ hơn đứng đối diện bạn, mắt đỏ, bụng lép. Lão tổ đứng bên gốc đa như chờ xem bạn chọn gì.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'ban', label: 'Giật bánh của đứa nhỏ hơn', mat: 'Một cái bánh, và một đứa trẻ không bao giờ quên mặt bạn.',
                sau: 'Bạn giật cái bánh khỏi tay nó. Nó ngã xuống bậc đá, khóc không thành tiếng, và bạn đi qua mà không ngoái lại.',
                hau: '{ban} đã nhớ mặt bạn, và lớn lên với cái tên bạn trong miệng.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ban', cuu: 'ban', label: 'Chia đôi cái bánh', mat: 'Phần no của bạn, nửa đêm ấy.',
                sau: 'Bạn bẻ đôi cái bánh và đưa cho nó nửa to hơn. Nó nhìn bạn rất lâu, rồi cắn từng miếng nhỏ như sợi phần ăn này sẽ biến mất.',
                hau: '{ban} đã nợ bạn nửa cái bánh, và chưa bao giờ biết phải trả bằng gì.' },
              { kieu: 'dao_thoat', vt: 'khac', doi: 'ban', cuu: 'ban', label: 'Bỏ chạy, ôm cái bánh đi', mat: 'Lương tâm nhẹ được một đêm.',
                sau: 'Bạn quay lưng chạy vào bóng tối, ôm cái bánh trước ngực. Đứa nhỏ ở lại dưới gốc đa, và tiếng khóc của nó theo bạn tới tận đầu thôn.',
                hau: 'Đêm đó bạn no bụng, còn {ban} ngủ cạnh gốc đa với cái bụng rỗng.' }
            ] },
          treo: { t: 'Lão tổ gọi bạn lại',
            d: 'Lão tổ không nói gì khi bạn đi ngang, chỉ đưa cho bạn một cái bánh khác, còn nóng. Ông nhìn bạn ăn như nhìn một con chó con biết cắn.',
            lc: [
              { key: 'an', label: 'Ăn cái bánh, không hỏi', kind: 'safe', mat: 'Cơn đói không bao giờ đi hết.' },
              { key: 'hoi', label: 'Hỏi vì sao ông ta cho bạn', kind: 'risk', mat: 'Một câu trả lời bạn không muốn nghe.' }
            ] }
        } },
      // ---------- Phần 2. Bái sư: đổi gì để mạnh; lão tổ nhận bạn làm đồ đệ ----------
      { id: 'bai_su', n: 'Bái sư', chuc_nang: 'đổi gì để mạnh; lão tổ nhận bạn làm đồ đệ', tuoi: 30, cau_hoi: 'Bạn trả gì để mạnh?',
        biet: 'Lão tổ đã biết bạn sẽ làm gì khi bị dồn đến đường cùng.', thang_vui: 'ma công tiến vọt', cai_mat: 'một người lạ, hoặc lời hứa với lòng mình',
        chang: {
          moc: { t: 'Động phủ dưới chân núi',
            d: 'Bạn theo lão tổ vào động phủ, nơi có mùi thuốc và mùi máu cũ. {su} đưa cho bạn một bộ áo đen và một cái bát sắt, nói đó là của người đệ tử trước đã chết vì ăn quá nhiều.',
            lc: [
              { key: 'mac_ao', label: 'Mặc bộ áo đen, không hỏi người cũ là ai', kind: 'safe', mat: 'Một bộ áo ấm, và một khoảng trống trong lòng.' },
              { key: 'hoi_ten', label: 'Hỏi tên người đệ tử trước', kind: 'risk', mat: 'Một câu trả lời lạnh như đá.' }
            ] },
          leo: { t: 'Bài thở đầu tiên',
            d: 'Ma công đầu tiên bắt bạn học một bài thở: hút vào hơi của người đang hấp hối. {su} đứng bên, không nhìn bạn, chỉ đếm nhịp bằng ngón tay gõ lên thành bát.',
            lc: [
              { key: 'hoc_het', label: 'Học theo đến cùng', kind: 'help', mat: 'Ma công tiến nhanh, và mùi máu dần quen.', tt: { can: { xp: 0.25 }, han: 36 } },
              { key: 'dung_lai', label: 'Dừng lại, thở bằng hơi của mình', kind: 'safe', mat: 'Tiến bộ chậm, nhưng vẫn còn là bạn.' }
            ] },
          cao_trao: { t: 'Bài nhập môn', lon: true, canh: { gio: 'dem', thoi_tiet: 'suong_doc' },
            d: 'Đêm nhập môn, lão tổ đẩy một người lạ vào giữa sân và bảo bạn ra tay trước khi trời sáng. Người ấy cầm một gói muối và cười, không biết mình sắp chết.',
            kieu: [
              { kieu: 'duong_tat', vt: 'dkd', doi: 'ban', cuu: 'su', label: 'Ra tay giết người lạ ngay trong đêm', mat: 'Một mạng người, và một phần bạn vẫn gọi là lương tâm.',
                sau: 'Người lạ ngã xuống, gói muối rơi bên cạnh. Lão tổ gật đầu, và tiếng gật ấy nặng như một lời khen.',
                hau: '{su} gọi bạn là đứa biết làm việc.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'su', cuu: 'su', label: 'Giết một con thú thay người, rồi nói dối thầy rằng mình đã giết người', mat: 'Lời nói dối đầu tiên với thầy.',
                sau: 'Bạn đưa đầu con thú cho lão tổ và nói đó là người. Lão tổ nhìn cái đầu một lúc rất lâu, rồi cất vào túi áo mà không nói gì.',
                hau: 'Lão tổ chưa hỏi lại, nhưng ông đã biết.' },
              { kieu: 'dao_thoat', vt: 'nguoc', doi: 'ban', cuu: 'su', label: 'Bỏ đi, không ra tay với người lạ', mat: 'Chỗ đứng của kẻ được chọn, và giá phải trả cho lương tâm.',
                sau: 'Bạn quay lưng bỏ đi, sau lưng là tiếng lão tổ cười khẽ. Người lạ đứng đó, không hiểu vì sao mình được tha.',
                hau: 'Lão tổ ghi tên bạn vào sổ những kẻ không đủ tư chất, và không bao giờ xóa.' }
            ] },
          treo: { t: 'Lò cần ba trăm',
            d: 'Lão tổ nói một câu rất nhẹ: "Lò cần ba trăm." Rồi ông đưa cho bạn một cái bát sắt rỗng để đựng cơm.',
            lc: [
              { key: 'hoi_lo', label: 'Hỏi lò cần người như thế nào', kind: 'risk', mat: 'Một câu hỏi đã đẩy bạn vào tầm mắt của ông ấy.' },
              { key: 'cat_bat', label: 'Nhận bát sắt, không nói gì', kind: 'safe', mat: 'Một bát cơm rỗng, và một lời hứa thầm.' }
            ] }
        } },
      // ---------- Phần 3. Thạch Khê: ba trăm mạng đổi một cảnh giới; người phàm trong dàn bắt đầu chết già ----------
      { id: 'thach_khe', n: 'Thạch Khê', chuc_nang: 'ba trăm mạng đổi một cảnh giới', tuoi: 55, canh: { realm: 1 }, cau_hoi: 'Ba trăm mạng đổi một cảnh giới?',
        biet: '{guong} đã nghe tên thôn này từ trước khi gặp bạn.', thang_vui: '(nếu làm) Luyện Khí tiến vọt', cai_mat: 'ba trăm mạng người, hoặc lương tâm của chính bạn',
        chang: {
          moc: { t: 'Lời đồn cây đa',
            d: 'Đường xuống thôn Thạch Khê có một cây đa đầu thôn, dải vải đỏ treo kín cành. Lão tổ không đi theo, chỉ dặn bạn đi một mình và đừng để ai thấy mặt.',
            lc: [
              { key: 'nghe_don', label: 'Lắng nghe lời đồn trong thôn', kind: 'risk', mat: 'Giấc ngủ yên ổn.' },
              { key: 'bo_ngoai_tai', label: 'Bỏ ngoài tai, đi thẳng xuống', kind: 'safe', mat: 'Một lối đi tắt, nếu bạn cần đến nó.' }
            ] },
          leo: { t: 'Túi lửa',
            d: 'Trước khi xuống núi, lão tổ đưa cho bạn một túi lửa và một danh sách các nhà trong thôn, chữ viết rất đẹp. Bạn cầm danh sách mà không hỏi vì sao chữ lại đẹp như vậy.',
            lc: [
              { key: 'doc_ten', label: 'Đọc từng cái tên trước khi cất', kind: 'safe', mat: 'Những cái tên in sâu vào đầu bạn.' },
              { key: 'cat_luon', label: 'Nhận túi lửa, cất danh sách vào túi', kind: 'risk', mat: 'Một đêm không biết mình đang làm gì.' }
            ] },
          cao_trao: { t: 'Đêm Thạch Khê', lon: true, canh: { gio: 'dem', thoi_tiet: 'mua' },
            d: 'Đêm ấy bạn đứng trước cổng thôn, túi lửa trong tay và danh sách trong túi. Tiếng hát ru vang lên từ một căn nhà gần cây đa, và bạn không biết mình đang nghe điều gì.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'guong', label: 'Đồ sát cả thôn', mat: 'Ba trăm mạng, và phần người còn lại trong bạn.',
                sau: 'Lửa lan qua mái tranh. Người ta chạy ra và bị đuổi quay lại vào lửa, đến sáng cả thôn chỉ còn tiếng gió thổi qua cây đa.',
                hau: 'Lúc tàn cuộc, {guong} nhặt được một đứa bé dưới bậc đá và ôm chặt không buông.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'su', cuu: 'guong', label: 'Dừng ở cổng thôn và chịu phạt thay cho cả thôn', mat: 'Tu vi của bạn, và một đêm roi vọt trước mặt cả đội.',
                sau: 'Bạn quỳ ở cổng thôn. Roi của lão tổ quất xuống lưng, và trong thôn tiếng khóc lặng dần.',
                hau: 'Từ đó lão tổ không dám nhắc chuyện Thạch Khê trước mặt bạn.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'ban', cuu: 'guong', label: 'Tha một nửa, đếm từng nhà', mat: 'Một nửa thôn, và sự im lặng của chính bạn.',
                sau: 'Bạn chỉ đốt một nửa căn nhà, nửa còn lại bạn đứng nhìn rồi quay đi. Không ai biết bạn đã tha ai.',
                hau: 'Nửa thôn sống sót mang theo một lời nguyền, và không ai nói với bạn điều đó.' }
            ] },
          treo: { t: 'Đứa bé trong vòng tay',
            d: 'Sáng hôm sau, đứa bé nhặt được dưới bậc đá nằm trong vòng tay {guong}, và người ấy gọi bạn là ân nhân. Bạn không biết nói gì, chỉ thấy con dao vẫn còn ấm trong túi.',
            lc: [
              { key: 'nhan_be', label: 'Nhận đứa bé, đặt tên cho nó', kind: 'help', mat: 'Một gánh nặng, và một người phải thương.' },
              { key: 'giao_lao', label: 'Giao đứa bé cho lão tổ, không nói gì', kind: 'risk', mat: 'Một đêm nữa mà lương tâm không yên.' }
            ] }
        } },
      // ---------- Phần 4. Mười năm trà (chiến thắng giả): lên đỉnh; người con của Thạch Khê tìm tới ----------
      { id: 'muoi_nam_tra', n: 'Mười năm trà', chuc_nang: 'chiến thắng giả: mười năm yên; người con của Thạch Khê tìm tới', tuoi: 85, canh: { realm: 1, stage: 2 }, cau_hoi: 'Kẻ mạnh có còn ai không?',
        biet: '{ke_thu} đã nghe tên bạn trong thôn cũ.', thang_vui: 'A Liên pha chén trà ngon nhất.', cai_mat: 'thọ nguyên, hoặc sự tin của A Liên',
        chang: {
          moc: { t: 'Mười năm trà',
            d: 'Mười năm yên ổn, bạn sống trong động phủ với một chén trà mỗi buổi sáng. A Liên pha trà, và bạn chưa bao giờ hỏi nàng học pha ở đâu.',
            lc: [
              { key: 'uong_het', label: 'Uống hết chén trà, khen ngon', kind: 'safe', mat: 'Một buổi sáng bình yên.' },
              { key: 'hoi_nang', label: 'Đặt chén xuống, hỏi nàng học pha ở đâu', kind: 'risk', mat: 'Một câu hỏi bạn đã trì hoãn quá lâu.' }
            ] },
          leo: { t: 'Người lạ ở cổng',
            d: 'Một người đàn ông lạ đứng ở cổng động, tay cầm một mảnh vải cũ, mắt đỏ. Hắn nói mình là con của người đã mất trong đêm Thạch Khê, và không chịu đi.',
            lc: [
              { key: 'moi_vao', label: 'Mời người ấy vào uống trà', kind: 'help', mat: 'Một chén trà cho kẻ đến đòi nợ.' },
              { key: 'duoi_di', label: 'Bảo hắn đi, không nghe thêm', kind: 'risk', mat: 'Điều hắn sắp nói sẽ không bao giờ được nghe.' }
            ] },
          cao_trao: { t: 'Người con của Thạch Khê', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Người con của Thạch Khê đứng giữa sân động phủ, ngay trước mặt A Liên, và nói từng chữ về đêm ba trăm mạng. A Liên đứng yên với chén trà trong tay, có lẽ không hiểu hết lời người ấy, nhưng hiểu đủ.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ke_thu', cuu: 'guong', label: 'Giết hắn ngay trước mặt A Liên', mat: 'Thêm một mạng, và một đôi mắt không bao giờ tha thứ.',
                sau: 'Con dao rút ra nhanh hơn tiếng nói. Người con của Thạch Khê ngã xuống, và A Liên đặt chén trà xuống đất mà không kêu lên tiếng nào.',
                hau: '{guong} không bao giờ pha trà lần nữa, và bạn không hỏi vì sao.' },
              { kieu: 'phuc_tung', vt: 'nguoc', doi: 'ke_thu', cuu: 'guong', label: 'Để hắn đánh mình, không đỡ', mat: 'Sĩ diện và chút sức lực cuối.',
                sau: 'Bạn đứng yên. Nắm đấm của hắn đập vào mặt bạn, rồi vào ngực, và bạn không lùi nửa bước. A Liên khóc không thành tiếng, và bạn mong nàng đừng khóc.',
                hau: 'Bạn còn nhớ đòn ấy đau ở đâu, nhưng không nhớ nó đau thế nào.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'guong', cuu: 'guong', label: 'Nói dối A Liên rằng người ấy nhầm người', mat: 'Một lời nói dối với người duy nhất còn tin bạn.',
                sau: 'Bạn nói người ấy nhầm, rằng mình chưa từng đến Thạch Khê. A Liên nhìn bạn lâu, rồi quay vào trong mà không hỏi thêm.',
                hau: '{guong} đã tin bạn, và bạn biết lần này nàng tin là vì không còn cách nào khác.' }
            ] },
          treo: { t: 'Lão tổ đến đòi phần',
            d: 'Đêm sau, lão tổ bước qua cổng động như người đi đòi nợ cũ. Ông nhìn bạn một lúc rồi nói phần của ông vẫn còn đó, và ông đã đợi lâu.',
            lc: [
              { key: 'tra_phan', label: 'Đưa phần cho lão, không nói gì', kind: 'pay', mat: 'Một phần đan điền, và một phần đời.' },
              { key: 'duoi_lao', label: 'Bảo chưa tới lúc, đuổi lão về', kind: 'risk', mat: 'Lão sẽ không bao giờ quên sự khinh thường ấy.' }
            ] }
        } },
      // ---------- Phần 5. Vật tế: tất cả đã mất; đảo vai; thêm một người thì khác gì ----------
      { id: 'vat_te', n: 'Vật tế', chuc_nang: 'tất cả đã mất; đảo vai; thêm một người thì khác gì', tuoi: 100, cau_hoi: 'Thêm một người thì khác gì?',
        biet: '{guong} đã biết chuyện đêm ở Thạch Khê.', thang_vui: '(không)', cai_mat: 'A Liên, hoặc chút người còn lại trong bạn',
        chang: {
          moc: { t: 'Bàn tế',
            d: 'Bàn tế được bày giữa động, con dao tế đặt chính giữa, bên cạnh là một chén nước chưa uống. Lão tổ đứng bên, hỏi bạn đã đủ ba trăm cái tên chưa, và bạn không trả lời được.',
            lc: [
              { key: 'ngoi_cho', label: 'Ngồi xuống bàn tế, chờ lệnh', kind: 'safe', mat: 'Một chỗ ngồi cho người đã đi quá xa.' },
              { key: 'bo_di', label: 'Bỏ bàn, bước ra cửa động', kind: 'risk', mat: 'Lão tổ sẽ không quên bạn dám bỏ đi.' }
            ] },
          leo: { t: 'Một người nữa',
            d: 'Đứa nhỏ đầu tiên được dẫn tới bàn tế không khóc, chỉ nhìn chén nước. A Liên đứng ở cửa động, và bạn thấy nàng đang run.',
            lc: [
              { key: 'nhin_nang', label: 'Nhìn về phía A Liên', kind: 'help', mat: 'Một ánh nhìn mà lão tổ nhớ.' },
              { key: 'nhin_dao', label: 'Nhìn con dao tế', kind: 'risk', mat: 'Điều bạn đang nghĩ tới.' }
            ] },
          cao_trao: { t: 'Vật tế thứ ba trăm lẻ một', lon: true, canh: { gio: 'dem', thoi_tiet: 'mua' },
            d: 'Đêm ấy đứa trẻ thứ ba trăm lẻ một được đặt lên bàn tế, và con dao tế nằm trong tay bạn. Lão tổ đứng sau, nói rất khẽ rằng ông đã chờ tới lúc này để xem bạn chọn gì.',
            kieu: [
              { kieu: 'tam_ma', vt: 'dkd', doi: 'doi_thu', cuu: 'guong', label: 'Cầm dao, đâm người đứng trước mặt', mat: 'Điều bạn không dám nói ra.',
                sau: 'Lưỡi dao vào ngực trước khi bạn kịp nghĩ. Tiếng nói trong đầu bạn bỗng im bặt, và chỉ còn lại tiếng gió thổi qua động.',
                hau: '{guong} không còn nhìn bạn bằng ánh mắt cũ.' },
              { kieu: 'phuc_tung', vt: 'nguoc', doi: 'guong', cuu: 'guong', label: 'Tự kể cho nàng nghe trước', mat: 'Phần còn lại của sĩ diện.',
                sau: 'Bạn quay sang A Liên và kể từ đêm cháy, từ cây đa, đến tiếng hát ru. Nàng nghe hết, không khóc, chỉ đặt tay lên tay bạn như đặt lên một con dao đang run.',
                hau: 'A Liên vẫn ở cạnh bạn, nhưng nàng không còn gọi bạn là ân nhân.' },
              { kieu: 'chong', vt: 'khac', doi: 'su', cuu: 'guong', label: 'Lao vào lão tổ', mat: 'Máu, hoặc một người đứng cạnh.',
                hau: 'Bạn đã lao vào lão tổ giữa động, và A Liên đứng che cho một đứa trẻ.' }
            ] },
          treo: { t: 'Thôn được dựng lại',
            d: 'Người sống sót về thôn Thạch Khê dựng lại mái nhà bằng gỗ của cây đa. Bạn nghe tin ấy trong động, và không biết mình nên mừng hay chịu thêm một lần nữa.',
            lc: [
              { key: 'gui_tien', label: 'Gửi tiền về giúp dựng thôn', kind: 'help', mat: 'Một phần của cải, và một lời cảm ơn không bao giờ tới.' },
              { key: 'khong_hoi', label: 'Không gửi gì, không hỏi thêm', kind: 'safe', mat: 'Sự im lặng mà thôn đã trả giá để có.' }
            ] }
        } },
      // ---------- Phần 6. Ba trăm cái tên: kẻ đã giết ba trăm người còn cứu được ai; đồng hồ thọ nguyên ----------
      { id: 'ba_tram_ten', n: 'Ba trăm cái tên', chuc_nang: 'kẻ đã giết ba trăm người còn cứu được ai; đồng hồ thọ nguyên', tuoi: 115, tho: 0.15, cau_hoi: 'Kẻ đã giết ba trăm người còn cứu được ai?',
        biet: 'Đệ tử mới của lão tổ là một đứa trẻ đói như bạn năm xưa.', thang_vui: 'Một đứa trẻ trong thôn mời bạn bát cháo.', cai_mat: '(kết cục)',
        chang: {
          moc: { t: 'Thôn mới',
            d: 'Lão tổ đã dựng một thôn mới bên sườn núi, và bạn được đưa tới canh cửa. Thọ nguyên trong ngực bạn mỏng như sợi chỉ, và bạn đếm từng ngày như đếm những cái tên trong sổ.',
            lc: [
              { key: 'dung_canh', label: 'Đứng cạnh đám trẻ trong thôn', kind: 'help', mat: 'Một giấc ngủ yên ngoài hàng rào.' },
              { key: 'len_tuong', label: 'Lên đầu hàng rào xem tình hình', kind: 'risk', mat: 'Chỗ đứng cuối cùng, nhìn thấy mọi thứ.' }
            ] },
          // Cảnh lớn KHÔNG có kẻ ác (khong_ke_ac): A Liên già, chén trà cuối
          leo: { t: 'Chén trà cuối', lon: true, canh: { gio: 'dem', thoi_tiet: 'suong_doc' },
            d: 'A Liên, sáu mươi mấy tuổi, già và yếu, đứng trước cửa phòng bạn từ sáng sớm. Nàng pha một chén trà, tay run, và đưa cho bạn như đưa cho một người mà nàng vẫn còn thương.',
            kieu: [
              { kieu: 'tin', vt: 'nguoc', doi: 'guong', cuu: 'guong', label: 'Uống hết chén trà, nói cảm ơn nàng', mat: 'Chút tự trọng cuối cùng của kẻ đã mất hết.',
                sau: 'Bạn uống từng ngụm, nàng nhìn bạn như nhìn đứa con đã đi xa từ lâu. Bạn nói "cảm ơn" lần đầu tiên sau nhiều năm, và giọng bạn nghe lạ.',
                hau: 'Nàng nhớ lời cảm ơn ấy trong những năm cuối cùng của đời mình.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'guong', cuu: 'guong', label: 'Uống trong im lặng rồi đi, không ngoái lại', mat: 'Lời cảm ơn bạn không nói ra được.',
                sau: 'Bạn uống hết chén, đặt xuống và bước đi. Phía sau, A Liên đứng yên như pho tượng cũ bên cửa.',
                hau: 'Nàng hiểu sự im lặng ấy, như đã hiểu từ lâu.' }
            ] },
          cao_trao: { t: 'Ba trăm cái tên', lon: true, canh: { gio: 'dem', thoi_tiet: 'giong_bao' },
            d: 'Đêm thứ ba ở thôn mới, một đứa trẻ gầy trơ xương trèo qua hàng rào với bó đuốc trong tay, mắt đỏ như đã khóc từ lâu. Đứa trẻ đói như bạn năm xưa, và lão tổ đứng sau nó, không nói câu nào.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'doi_thu', cuu: 'guong', label: 'Chặn hắn bằng nốt tu vi cuối', mat: 'Chút tu vi cuối cùng, và những năm còn lại của bạn.',
                sau: 'Chút khí cuối rời khỏi bạn như hơi thở rời bình lạnh. Đứa trẻ khựng lại giữa hàng rào, bó đuốc rơi xuống đất và tắt.',
                hau: 'Đứa trẻ sống sót, nhưng không bao giờ nhớ được tên bạn.' },
              { kieu: 'duong_tat', vt: 'dkd', doi: 'doi_thu', cuu: 'su', label: 'Dạy hắn ma công, đổi lấy cả làng', mat: 'Một đứa trẻ khác sẽ đi con đường bạn đã đi.',
                sau: 'Bạn cầm tay đứa trẻ dạy nó bài thở đầu tiên, rồi nói làng sẽ được tha nếu nó chịu nghe. Lão tổ đứng sau mỉm cười như đã đoán trước.',
                hau: 'Đứa trẻ tin bạn, và bạn không biết nó sẽ thành ai.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'doi_thu', cuu: 'guong', label: 'Giết hắn', mat: 'Một mạng nữa, và chính bạn không còn phân biệt nổi.',
                sau: 'Bạn đâm đứa trẻ trước khi nó kịp đốt. Lão tổ không nói gì, chỉ cúi xuống nhặt bó đuốc đã tắt.',
                hau: 'Trong thôn không ai hỏi bạn đã giết ai; họ chỉ nhớ bạn đã đứng ở cổng.' }
            ] },
          treo: { t: 'Bát cháo',
            d: 'Sáng hôm sau, một đứa trẻ trong thôn mang tới cho bạn một bát cháo loãng, nói bằng giọng sợ hãi rằng bà nó bảo người già phải được ăn trước. Bạn nhìn bát cháo, không biết mình có đáng nhận nó hay không.',
            lc: [
              { key: 'an_chao', label: 'Ăn hết bát cháo', kind: 'help', mat: 'Chút ấm cuối cùng của một đời.' },
              { key: 'day_lai', label: 'Đẩy bát cháo lại, bảo đứa trẻ ăn đi', kind: 'safe', mat: 'Lời chào của một người không phải cúi.' }
            ] }
        } }
    ],
    // Ba phương án lật (bốc một mỗi đời, nổ ở phần 4 hoặc 5). Chặng "treo" của phần nổ bị thay bằng đoạn sự thật.
    lat: [
      { id: 'a', kieu: 'chinh_ban_la_thu_pham', ten: 'Chính bạn là thủ phạm', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'treo', t: 'Trong đêm đói, bạn nghe một người phụ nữ hát khẽ một bài ru ở góc thôn, giọng nghe quen đến lạ.', hieu: 'Người hát ru là mẹ bạn, còn sống trong đêm Thạch Khê.' },
          { phan: 3, o: 'moc', t: 'Cây đa đầu thôn có một vết khắc tên bạn hồi nhỏ, nhưng trong đêm ấy bạn không thấy nó.', hieu: 'Thạch Khê là làng cũ của bạn, và bạn đã đến đó trước khi biết.' },
          { phan: 4, o: 'moc', t: 'A Liên hát đúng bài ru ấy khi pha trà, và hát tới câu cuối thì dừng lại.', hieu: 'A Liên đã nghe bài ru ấy từ mẹ bạn.' }
        ],
        no: { biet: 'Thạch Khê là làng cũ của mẹ bạn; người phụ nữ hát ru là mẹ bạn, và bạn đã đốt chính làng mình.',
          hieu: 'Bạn là kẻ đã đốt làng mẹ mình.',
          d: 'Sáng hôm ấy lão tổ gọi bạn ra hậu viện, chỉ cho bạn một bà già gầy guộc đang nấu cháo dưới gốc đa. "Mẹ ngươi đấy," lão nói, rồi quay đi như chưa từng nói gì.',
          lc: [
            { key: 'nhin_me', label: 'Đi tới, gọi một tiếng mẹ', kind: 'risk', mat: 'Một người mẹ có thể không nhận ra con mình.', flag: 'lat_doi_mat' },
            { key: 'quay_di', label: 'Quay lưng đi, không nhận', kind: 'safe', mat: 'Đứa con bạn từng là.', flag: 'lat_quay_di' }
          ] } },
      { id: 'b', kieu: 'a_lien_biet_tu_dau', ten: 'A Liên biết từ đầu', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 3, o: 'treo', t: 'Đêm đó A Liên không hỏi về chiếc lược; nàng chỉ đưa lại cho bạn và lặng lẽ quay đi.', hieu: 'A Liên đã biết chiếc lược là của ai, và đêm ấy bạn đã làm gì.' },
          { phan: 4, o: 'moc', t: 'A Liên pha một vị trà đắng lạ, và không giải thích vì sao.', hieu: 'Vị đắng ấy là vị nàng đã uống khi chờ bạn ở Thạch Khê.' },
          { phan: 4, o: 'leo', t: 'A Liên hỏi bạn về đêm cháy ở Thạch Khê, rồi im lặng rất lâu khi bạn không trả lời.', hieu: 'A Liên không muốn nghe câu trả lời, vì nàng đã biết.' }
        ],
        no: { biet: 'A Liên biết bạn là kẻ đã đốt Thạch Khê ngay từ đêm cháy, và ở lại chờ ngày giết bạn rồi không nỡ.',
          hieu: 'A Liên đã chờ ngày trả thù và không đành lòng.',
          d: 'Đêm cuối, A Liên đặt con dao lên bàn rồi đẩy nó ra xa. "Ta đợi ngươi mấy chục năm," nàng nói, "mà không nỡ." Bạn không biết nàng đang nói về ai.',
          lc: [
            { key: 'tha', label: 'Nắm tay nàng, nói bạn không trách', kind: 'help', mat: 'Chút phẫn nộ bạn đáng được có.', flag: 'lat_tha' },
            { key: 'trach', label: 'Quay mặt đi, nói bạn không cần ai thương hại', kind: 'safe', mat: 'Người duy nhất đã vì bạn mà giấu một điều.', flag: 'lat_trach' }
          ] } },
      { id: 'c', kieu: 'lao_to_la_cha', ten: 'Lão tổ là cha ruột bạn', phan_no: 4, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'treo', t: 'Một người lạ bỏ lại túi gạo bên đường rồi đi, không ngoái lại, và bạn nhớ mãi dáng lưng ấy.', hieu: 'Người lạ ấy là lão tổ, người đã bỏ bạn một lần rồi trở lại.' },
          { phan: 2, o: 'leo', t: 'Lão tổ gọi bạn bằng cái tên tục, cái tên bạn chưa nói với ai trong động này.', hieu: 'Lão tổ biết tên tục của bạn từ trước khi bạn vào động.' },
          { phan: 3, o: 'moc', t: 'Trên cán con dao tế có khắc một họ, cùng họ với bạn, và lão tổ đã đưa nó cho bạn từ đầu.', hieu: 'Con dao tế khắc họ của bạn, và lão tổ là người khắc.' }
        ],
        no: { biet: 'Lão tổ là cha ruột bạn; ông bỏ bạn cho đói để rèn ra một kẻ không bao giờ phải nhờ ai.',
          hieu: 'Lão tổ là cha ruột bạn.',
          d: 'Lão tổ gọi bạn vào Hình đường lần cuối và rót hai chén trà. "Ta bỏ ngươi giữa đường năm ấy," ông nói, "vì ta muốn một kẻ không bao giờ phải nhờ ai." Ông nhìn bạn như nhìn chính mình thuở nhỏ.',
          lc: [
            { key: 'nhan_cha', label: 'Quỳ xuống nhận cha', kind: 'pay', mat: 'Cái tên bạn đã tự đặt cho mình, và phải bỏ.', flag: 'lat_nhan_toi' },
            { key: 'chai_mat', label: 'Nói ông không phải cha, rồi bỏ đi', kind: 'risk', mat: 'Một lần đứng thẳng nhìn người ta.', flag: 'lat_chai_mat' }
          ] } }
    ],
    khong_ke_ac: { phan: 6, o: 'leo', ten: 'A Liên, chén trà cuối' },
    // Kết cục: chọn theo chuỗi kiểu lựa chọn (vt) ở TT.kb.ketKhuon.
    ket: {
      toan_ven: { t: 'Toàn vẹn', kv: 2, dk: { loai: 'nguoc', min: 3, tu_phan: 3, p6: 'hy_sinh' },
        log: '{ten} không còn tu vi, quét lá ở thôn Thạch Khê mới. Trẻ con không biết {ten} là ai, và {vat} vẫn nằm trong túi áo.' },
      doa: { t: 'Đọa', kv: 0, xau: true, dk: { loai: 'dkd', phan: [4, 6] },
        log: '{ten} ngồi chỗ lão tổ. Một đứa trẻ đói quỳ trước lò đan, và {ten} không ngẩng lên.' },
      co_doc: { t: 'Cô độc', kv: 1, xau: true, dk: { loai: 'con_lai' },
        log: 'Chén trà nguội, không còn ai pha. {ten} còn sống, và không ai nhớ {ten} đã từng là ai.' }
    }
  });
})();
