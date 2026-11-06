// Khuôn "Khắc kỷ" (Tu dưỡng dương), chép từ ke-hoach/Q-khuon-kich-ban.md mục 9 thành dữ liệu (K3b). Cấu trúc theo js/data/khuon/kieu_hanh.js.
// Ghi chú chép (K3b, Haiku):
//   - Khuyết điểm gốc: lanh_lung (thuốc "tình người" trùng với kds.lanh_lung).
//   - Dàn: Băng Lạc là bong_toi (chữ su, dàn su); A Mộc là guong (dàn ban, phàm nhân); con nuôi là than_nhan (dàn ke_thua, vai mở); kẻ bắt cóc là ke_thu.
//   - Phụ: phu[0] = A Mộc (vật con thuyền nan, vật gương); phu[1] = con nuôi (vật lá thư cũ có sẵn).
//   - Đã sửa theo Q mục 9: "Cửa quan" ghi "bảy ngày nữa là Trúc Cơ", lúc khoảng 100 tuổi, thọ Luyện Khí còn khoảng 30 năm, người bị bắt là đứa con nuôi; "Viên Diên Thọ Đan" để dành cho lần xung kích Trúc Cơ.
//   - Muốn chỉ có một câu gốc: a tong / b vung là biến thể cùng ý, c tan_tu giữ câu gốc.
//   - "(ngược)" không ghi kiểu được chọn theo nghĩa: phần 1 "chôn nó và khóc" = tin; phần 2 "nhận" = tin; phần 3 "đưa đan" = hy_sinh; phần 4 "đọc hết một trăm lá" = tin; phần 5 "phá quan" = hy_sinh; phần 6 "ngồi với người còn lại" = tin.
//   - Phần 3 "không kẻ ác" là A Mộc đang bệnh, chặng leo lớn. Mục 9 ghi "A Mộc chết" ở phần 3; đưa cái chết lên treo (đứa trẻ mồ côi) để cảnh không kẻ ác còn A Mộc sống.
//   - Tâm ma 🜏 (P4, P5) chưa mã hóa thành kiểu riêng.
//   - Lật (a), (c) có manh P5 nhưng lint không cho manh mối ở phần nổ trở đi: dời sang phần 4 (treo).
//   - Thử thách có hạn (tt) đặt ở phần 2 leo "trả lại cành liễu" và phần 6 leo.
(function () {
  const D = window.TT.data;

  D.STORY.regKhuon({
    id: 'khac_ky', ten: 'Khắc kỷ', khuyet_diem: 'lanh_lung',
    cau_hoi_trung_tam: 'Trường sinh để làm gì, nếu không còn ai để sống cùng?',
    logline: 'Kẻ dứt tình để lên đường tu tiên; khi đứa con nuôi bị bắt vì một lá thư bạn đốt không đọc, bạn mới hiểu mình đã dứt cả những thứ đáng giữ.',
    bay_manh: {
      vet_thuong: [
        { id: 'a', xt: ['p1', 'p2'], vet: 'mẹ bỏ đi theo người khác, bạn học rằng thương là xiềng',
          canh: 'Mẹ bạn bỏ đi theo một người khác khi bạn còn nhỏ. Bạn đứng ở cửa nhà và học được một điều: thương ai là tự xích mình vào người ấy.' },
        { id: 'b', xt: ['p5'], vet: 'thương một con chó, nó chết, bạn khóc ba ngày rồi thề không thương gì nữa',
          canh: 'Cô nhi, bạn thương một con chó gầy ở đầu chợ. Một buổi sáng nó chết giữa đường, bạn khóc ba ngày rồi thề sẽ không thương gì nữa.' },
        { id: 'c', xt: ['p3', 't10'], vet: 'cha bỏ tu vì vợ con, già chết nghèo; mẹ bảo "giá ông ấy đừng vì chúng ta"',
          canh: 'Cha bạn bỏ tu vì vợ con, già chết trong nghèo khó. Mẹ đứng bên mộ và nói khẽ: "Giá ông ấy đừng vì chúng ta."' }
      ],
      loi_noi_doi: 'Trần duyên là xiềng xích; dứt được mới lên được.',
      muon: [
        { id: 'a', cho: 'tong', t: 'Trúc Cơ trước khi cạn thọ, rồi lên tới đỉnh tông môn' },
        { id: 'b', cho: 'vung', t: 'Trúc Cơ trước khi cạn thọ, rồi vượt cả vùng' },
        { id: 'c', cho: 'tan_tu', t: 'Trúc Cơ trước khi cạn thọ, rồi xa hơn nữa' }
      ],
      can: 'tình người; sống cùng ai đó còn hơn sống lâu một mình',
      bong_toi: { vai: 'su', cach_chon: 'sư tôn Băng Lạc, đã hiến cả gia tộc cho đạo; ra mắt từ phần 1 qua lời dạy',
        ra_mat: [
          'sư tôn Băng Lạc đứng trên bậc động phủ, nói rất khẽ rằng "tình là sợi xích, cắt đi mới bay được"',
          'sư tôn Băng Lạc nhìn bạn từ đầu tới chân, không một nét mặt, rồi gật đầu như chọn một món đồ',
          'sư tôn Băng Lạc đốt một bức thư cũ ngay trước mặt bạn và nói: "Đốt đi là hết."'
        ] },
      guong: { vai: ['ban'], dd: 'phàm nhân sống trọn tình người, chết nghèo, không hối tiếc, lúc nào cũng cầm {vat_guong}' },
      hy_sinh: 'cơ hội Trúc Cơ, tuổi thọ'
    },
    dan: { ke_thu: 'ke_thu', guong: ['ban'], su: 'su', doi_thu: 'doi_thu', than_nhan: 'ke_thua', ban: 'ban' },
    soi: {
      chinh: { nguoi: 'su', vat: [
        { id: 'chieu_thien_bang', canh: '{su} trải chiếu thiền băng ra giữa động, ngồi xuống, và không quay đầu lại khi bạn bước vào.', treo: '{su} gấp chiếu thiền băng lại, cất đi, và nói rằng nó chỉ dành cho người không còn tình.' }
      ] },
      phu: [
        { nguoi: 'guong', vat: [{ id: 'thuyen_nan' }] },
        { nguoi: 'than_nhan', vat: [{ id: 'thu_cu' }] }
      ]
    },
    noi: { chinh: 'làng bên sông', tong: 'động phủ bế quan', cam: ['động phủ băng'] },
    thang_suc_manh: [
      { realm: 0, dinh: 'người đứng đầu ngoại môn' },
      { realm: 1, stage: 0, dinh: 'đệ tử nội môn có tiếng' },
      { realm: 1, stage: 2, dinh: 'đệ nhất nội môn, người được chọn làm chân truyền' },
      { realm: 2, dinh: 'trưởng lão, người đứng đầu một vùng nhỏ' },
      { realm: 3, dinh: 'cái tên người ta nhắc như huyền thoại' }
    ],
    phan: [
      // ---------- Phần 1. Con chó: khóc hay đứng dậy ----------
      { id: 'con_cho', n: 'Con chó', chuc_nang: 'biến cố khởi đầu; khóc hay đứng dậy', tuoi: 12, cau_hoi: 'Khóc hay đứng dậy?',
        biet: '{su} đã thấy bạn khóc ba ngày.', thang_vui: 'A Mộc cõng bạn qua sông mùa lũ', cai_mat: 'một con chó, hoặc nước mắt của bạn',
        chang: {
          moc: { t: 'Con chó gầy',
            d: 'Con chó gầy ở đầu chợ, thứ bạn vẫn chia cho nửa cái bánh mỗi sáng, nằm im bên bờ mương. Bạn quỳ xuống, gọi nó hai lần, rồi thấy nó không ngẩng lên nữa.',
            lc: [
              { key: 'om_xac', label: 'Ôm xác nó về phía bờ sông', kind: 'help', mat: 'Một đường đi nặng và lạnh.' },
              { key: 'di_qua', label: 'Đi qua, không ngoái lại', kind: 'safe', mat: 'Một con chó không ai nhớ tên.' }
            ] },
          leo: { t: 'Ba ngày khóc',
            d: 'Bạn khóc suốt ba ngày, không ăn, không nói. A Mộc đứng ngoài cửa, mang nước tới rồi để lại, không gõ cửa.',
            lc: [
              { key: 'mo_cua', label: 'Mở cửa, nhận nước', kind: 'help', mat: 'Một lần để người khác vào.' },
              { key: 'dong_cua', label: 'Đóng chặt cửa, thề không khóc nữa', kind: 'risk', mat: 'Một lời thề bạn sẽ phải giữ.' }
            ] },
          // Cảnh lớn: con chó chết
          cao_trao: { t: 'Con chó chết', lon: true, canh: { gio: 'hoang_hon', thoi_tiet: 'mua' },
            d: 'Con chó đã chết, nằm trên nền đất ẩm dưới gốc liễu. Bạn đứng nhìn, và trong lòng có một tiếng nói rất nhỏ bảo bạn đừng thương ai nữa.',
            kieu: [
              { kieu: 'tin', vt: 'nguoc', doi: 'ban', cuu: 'guong', label: 'Chôn nó và khóc', mat: 'Chút tình còn sót lại, và sự tự chủ của bạn.',
                sau: 'Bạn đào đất bằng tay, chôn con chó dưới gốc liễu, và khóc đến khi không còn nước mắt.',
                hau: 'Bạn nhớ chỗ đó suốt đời, và vẫn quay lại mỗi khi trời mưa.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'su', label: 'Bỏ đi luyện ngay', mat: 'Một con chó không ai chôn.',
                sau: 'Bạn quay lưng, đi thẳng lên động phủ luyện công. Con chó nằm lại bên mương, và bạn không ngoái lại.',
                hau: 'Trong động, bạn luyện đến quên cả tên con chó.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'ban', cuu: 'guong', label: 'Nhờ A Mộc chôn giùm', mat: 'Một việc bạn không làm, và một người phải làm thay.',
                sau: 'Bạn đưa tay gọi A Mộc. Ông lặng lẽ cầm cuốc ra gốc liễu, không hỏi bạn một câu.',
                hau: 'A Mộc không bao giờ nói bạn đã nhờ ông chôn con chó ấy.' }
            ] },
          treo: { t: 'Băng Lạc nhận bạn',
            d: 'Sáng hôm sau, sư tôn Băng Lạc gọi bạn lên động phủ và nhận làm đệ tử. Ông không hỏi về con chó, chỉ đặt tay lên trán bạn và nói: "Tốt, ngươi đã học được cái cần học."',
            lc: [
              { key: 'quy_nhap_mon', label: 'Quỳ xuống nhận lễ nhập môn', kind: 'help', mat: 'Một lễ nghi lạnh như đá.' },
              { key: 'hoi_con_cho', label: 'Hỏi ông vì sao biết chuyện con chó', kind: 'risk', mat: 'Một câu hỏi không có đáp án ấm.' }
            ] }
        } },
      // ---------- Phần 2. Người thương: nhận hay từ ----------
      { id: 'nguoi_thuong', n: 'Người thương', chuc_nang: 'lời tỏ tình; nhận hay từ', tuoi: 30, cau_hoi: 'Nhận hay từ?',
        biet: '{su} đã biết người ấy đến tìm bạn.', thang_vui: '(nếu nhận) một mùa xuân bên sông', cai_mat: 'một mối tình, hoặc sự nể trọng của sư tôn',
        chang: {
          moc: { t: 'Bên sông',
            d: 'Mùa xuân về bên sông, hoa liễu rơi xuống mặt nước, và A Mộc đứng cạnh bạn như mọi lần. Có một cô gái làng đứng cách đó không xa, tay cầm giỏ cá, nhìn bạn rất lâu.',
            lc: [
              { key: 'den_gan', label: 'Đến gần, hỏi tên cô gái', kind: 'risk', mat: 'Một cái tên có thể làm bạn quên đạo.' },
              { key: 'quay_ve', label: 'Quay đi, về động phủ', kind: 'safe', mat: 'Một mùa xuân không có ai.' }
            ] },
          leo: { t: 'Lời hỏi',
            d: 'Cô gái đến trước động phủ, đưa cho bạn một cành liễu và nói rằng nàng muốn đợi bạn ra khỏi đạo. Băng Lạc đứng sau cửa động, không nghe thấy, hoặc giả vờ như không nghe.',
            lc: [
              { key: 'nhan_lieu', label: 'Nhận cành liễu, hẹn một ngày', kind: 'help', mat: 'Một lời hẹn không biết khi nào thành.' },
              { key: 'tra_lieu', label: 'Trả lại cành liễu, nói đường tu không có chỗ cho người khác', kind: 'risk', mat: 'Một câu nói làm nàng quay đi.', tt: { can: { xp: 0.2 }, han: 24 } }
            ] },
          // Cảnh lớn: lời tỏ tình
          cao_trao: { t: 'Lời tỏ tình', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Cô gái đứng giữa bờ đê, nói từng chữ muốn bạn nhận lời. Bạn đứng trước nàng, một bên là đạo, một bên là mùa xuân, và không ai ngoài bạn biết mình sẽ chọn gì.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'su', label: 'Từ chối vì đạo', mat: 'Một mùa xuân, và chút ấm của người đứng trước mặt bạn.',
                sau: 'Bạn nói rằng đường tu không có chỗ cho ai, rồi quay đi. Cô gái đứng yên, không khóc, và cành liễu trôi theo dòng sông.',
                hau: 'Băng Lạc nhìn bạn lâu, như vừa được xác nhận điều gì.' },
              { kieu: 'tin', vt: 'nguoc', doi: 'ban', cuu: 'ban', label: 'Nhận lời, cùng nàng đi qua mùa xuân', mat: 'Lời đạo đã hứa, và một phần của đời tu.',
                sau: 'Bạn nắm tay cô gái, và cả hai đi dọc bờ sông đến khi trời tối. Mùa xuân đó, bạn quên mất đạo là gì.',
                hau: 'Bạn nhớ mùa xuân ấy, và không bao giờ hối tiếc, dù đạo không tha thứ.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'ban', cuu: 'ban', label: 'Hẹn sau khi Trúc Cơ', mat: 'Một lời hẹn không biết còn kịp không.',
                sau: 'Bạn nói sẽ trở lại sau khi Trúc Cơ, và cô gái gật đầu, không tin cũng không từ chối. Cành liễu được cắm bên bờ sông.',
                hau: 'Cành liễu lớn thành cây, và bạn không bao giờ quay lại đó.' }
            ] },
          treo: { t: 'Băng Lạc lạnh với bạn',
            d: 'Sau chuyện bên sông, Băng Lạc không gọi bạn vào động trong ba tháng. Khi gặp lại, ông nhìn bạn như nhìn một người đã rời khỏi đạo.',
            lc: [
              { key: 'quy_xin_loi', label: 'Quỳ xin lỗi sư tôn', kind: 'help', mat: 'Một lời xin lỗi không được đáp.' },
              { key: 'giu_im', label: 'Giữ im, không biện bạch', kind: 'safe', mat: 'Sự im lặng của người đã chọn đạo.' }
            ] }
        } },
      // ---------- Phần 3. Viên Diên Thọ Đan: cho ai năm tháng của mình (cảnh lớn không kẻ ác: A Mộc đang bệnh) ----------
      { id: 'dien_tho_dan', n: 'Viên Diên Thọ Đan', chuc_nang: 'cho ai năm tháng của mình; A Mộc đang bệnh', tuoi: 55, canh: { realm: 1 }, cau_hoi: 'Cho ai năm tháng của mình?',
        biet: '{guong} đã già, và tóc đã bạc hết.', thang_vui: 'A Mộc nắm tay bạn: "Thằng ngốc."', cai_mat: 'năm tháng của bạn, hoặc một người bạn sắp đi',
        chang: {
          moc: { t: 'Làng bên sông',
            d: 'Bạn trở về làng bên sông và thấy A Mộc ngồi trước cửa nhà, đầu bạc trắng. Ông nhìn bạn một lúc, rồi cười, không hỏi bạn đã đi đâu những năm qua.',
            lc: [
              { key: 'ngoi_canh', label: 'Ngồi xuống cạnh ông', kind: 'help', mat: 'Một buổi chiều không cần lời.' },
              { key: 'dung_ngoai', label: 'Đứng ngoài, nói bạn đi ngang', kind: 'safe', mat: 'Một lời nói dối nhỏ.' }
            ] },
          // Cảnh lớn KHÔNG có kẻ ác (khong_ke_ac): A Mộc đang bệnh
          leo: { t: 'Bệnh của A Mộc', lon: true, canh: { gio: 'hoang_hon', thoi_tiet: 'suong_doc' },
            d: 'A Mộc đang nằm trong căn nhà gỗ, thở chậm dần, và thọ nguyên phàm nhân đã cạn từ lâu. Ông nói rằng ông không tiếc gì, chỉ tiếc mình chưa nói được hết chuyện con sông.',
            kieu: [
              { kieu: 'tin', vt: 'nguoc', doi: 'guong', cuu: 'guong', label: 'Nắm tay ông, nói rõ mình là ai', mat: 'Lớp vỏ lạnh lùng của bạn, và sự thật phải nói ra.',
                sau: 'Bạn nắm tay A Mộc và kể hết mình là ai, từ con chó tới ba ngày khóc. Ông nghe, không ngắt lời, và cười như đã biết từ lâu.',
                hau: 'A Mộc không bao giờ trách bạn; ông chỉ bảo bạn đừng đi ra bờ sông nữa.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'guong', cuu: 'guong', label: 'Không nói gì, ngồi cạnh ông đến hết đêm', mat: 'Một lời không được nói ra.',
                sau: 'Bạn ngồi cạnh A Mộc, không nói gì. Sáng ra, hơi thở của ông đã dừng, còn tay ông vẫn đặt trên tay bạn.',
                hau: 'Bạn không bao giờ biết ông có muốn nghe lời nào không.' }
            ] },
          // Cảnh lớn: Viên Diên Thọ Đan
          cao_trao: { t: 'Viên Diên Thọ Đan', lon: true, canh: { gio: 'dem', thoi_tiet: 'mua' },
            d: 'Viên Diên Thọ Đan nằm trong lòng bàn tay bạn, là thứ đan để dành cho lần xung kích Trúc Cơ sau này. A Mộc nhìn viên đan, rồi nhìn bạn, và nói rằng ông không cần thêm năm nào nữa.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'guong', cuu: 'guong', label: 'Đưa đan cho ông', mat: 'Cơ hội Trúc Cơ, và những năm đời của bạn.',
                sau: 'Bạn đặt viên đan vào tay A Mộc. Ông đẩy lại, bảo bạn cất đi, nhưng bạn đã buông tay, và viên đan đã thuộc về ông.',
                hau: 'Ông sống thêm được vài tháng, và không bao giờ biết viên đan ấy quý thế nào.' },
              { kieu: 'tin', vt: 'khac', doi: 'guong', cuu: 'guong', label: 'Nói cho ông biết bạn là ai và đã đi đâu', mat: 'Danh tính của một người đã cắt đứt tình người.',
                sau: 'Bạn kể từ đêm bên sông tới những năm bế quan. A Mộc nghe hết, rồi gật đầu, và không hỏi thêm điều gì.',
                hau: 'Ông nói lời cuối cùng với bạn bằng giọng nhẹ như gió.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'guong', cuu: 'guong', label: 'Để lại vàng rồi về', mat: 'Những đồng vàng thay cho lời nói.',
                sau: 'Bạn đặt túi vàng lên bàn và quay đi. A Mộc nhìn theo, không gọi lại.',
                hau: 'Túi vàng nằm đó, và ông không bao giờ dùng đến.' }
            ] },
          treo: { t: 'Đứa trẻ mồ côi',
            d: 'Sau đêm ấy, bạn nhặt một đứa trẻ mồ côi ở đầu làng, và nó theo bạn về động phủ mà không hỏi tên. Băng Lạc nhìn đứa trẻ rất lâu, không nói gì, và đặt một cuốn sách lên bàn.',
            lc: [
              { key: 'nhan_nuoi', label: 'Nhận nuôi nó', kind: 'help', mat: 'Một gánh nặng, và một người phải thương.' },
              { key: 'dua_ve_lang', label: 'Đưa nó về làng, nhờ người khác', kind: 'safe', mat: 'Một đứa trẻ không còn ở cạnh bạn.' }
            ] }
        } },
      // ---------- Phần 4. Lá thư (chiến thắng giả): đọc hay đốt ----------
      { id: 'la_thu', n: 'Lá thư', chuc_nang: 'chiến thắng giả: đọc hay đốt', tuoi: 85, canh: { realm: 1, stage: 2 }, cau_hoi: 'Đọc hay đốt?',
        biet: '{than_nhan} viết thư về mỗi tháng.', thang_vui: 'đạt Luyện Khí đỉnh phong, Băng Lạc gật đầu lần đầu', cai_mat: 'lá thư, hoặc tình cảm của đứa con nuôi',
        chang: {
          moc: { t: 'Đỉnh phong',
            d: 'Luyện Khí đỉnh phong, bạn ngồi trên bậc đá trong động, cảm thấy khí chảy đều như nước sông. Mười năm qua bạn không để ý tới ai, và điều đó làm bạn thấy mình mạnh.',
            lc: [
              { key: 'ngoi_them', label: 'Ngồi thiền thêm một ngày', kind: 'safe', mat: 'Một ngày nữa không có ai gọi.' },
              { key: 'ra_cua_dong', label: 'Đứng dậy, ra cửa động', kind: 'help', mat: 'Một ngọn gió bạn đã quên.' }
            ] },
          leo: { t: 'Lá thư thứ chín mươi chín',
            d: 'Đứa con nuôi viết thư đều mỗi tháng, và lá thư thứ chín mươi chín nằm trên bàn bạn. Trong thư có một dòng nhỏ: "Có người lạ hỏi thăm con." Bạn đọc một lần rồi đặt xuống.',
            lc: [
              { key: 'doc_cu', label: 'Đọc hết các thư cũ', kind: 'risk', mat: 'Một đêm không yên.' },
              { key: 'de_sang_ben', label: 'Đặt thư sang một bên', kind: 'safe', mat: 'Một lá thư bị đẩy ra xa.' }
            ] },
          // Cảnh lớn: lá thư thứ một trăm
          cao_trao: { t: 'Lá thư thứ một trăm', lon: true, canh: { gio: 'dem', thoi_tiet: 'suong_doc' },
            d: 'Lá thư thứ một trăm đến tay bạn đúng đêm bạn bắt đầu bế quan xung kích. Trong phong thư là một mảnh giấy cháy dở, và bạn không biết mình sẽ đốt nó hay đọc hết.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'than_nhan', cuu: 'su', label: 'Đốt không đọc, như mọi lá trước', mat: 'Một đứa trẻ bị bỏ lại ngoài cửa.',
                sau: 'Bạn ném phong thư vào lò. Lá thư cháy đen, và bạn quay lại bậc đá, không nhìn ra cửa.',
                hau: 'Đứa con nuôi vẫn viết thư, đều đặn như trước.' },
              { kieu: 'tin', vt: 'nguoc', doi: 'than_nhan', cuu: 'than_nhan', label: 'Đọc hết một trăm lá trong một đêm', mat: 'Đêm không tu luyện, và một khoảnh khắc chậm tiến.',
                sau: 'Bạn đọc từng lá, từng dòng, cho tới khi trời sáng. Đến lá cuối, bạn không còn đủ sức đứng dậy khỏi ghế.',
                hau: 'Bạn nhớ từng cái tên trong thư, và không còn quên được.' },
              { kieu: 'duong_tat', vt: 'dkd', doi: 'than_nhan', cuu: 'su', label: 'Gửi người xuống đưa tiền', mat: 'Một món nợ không ghi sổ, và đứa trẻ sẽ không biết đó là của ai.',
                sau: 'Bạn gọi một đệ tử, đưa cho túi bạc và bảo đi xuống làng bên sông. Đệ tử đi, nhưng không ai dặn nó phải hỏi điều gì.',
                hau: 'Túi bạc đến nơi, và không ai biết ai đã gửi.' }
            ] },
          treo: { t: 'Bạn bế quan',
            d: 'Bạn bước vào mật thất, khóa cửa đá, và bắt đầu xung kích Trúc Cơ. Trong bóng tối, bạn vẫn nghe thấy tiếng giấy lật, như ai đó đang đọc thư ở ngoài cửa.',
            lc: [
              { key: 'mo_cua_da', label: 'Mở cửa đá, nhìn ra', kind: 'risk', mat: 'Một nhịp bế quan bị phá.' },
              { key: 'giu_cua_da', label: 'Giữ cửa đá, tiếp tục', kind: 'safe', mat: 'Một tiếng giấy lật không ai đáp.' }
            ] }
        } },
      // ---------- Phần 5. Cửa quan: bảy ngày hay một mạng (bản đã sửa: Trúc Cơ, con nuôi bị bắt) ----------
      { id: 'cua_quan', n: 'Cửa quan', chuc_nang: 'bảy ngày hay một mạng; con nuôi sống hoặc chết', tuoi: 100, cau_hoi: 'Bảy ngày hay một mạng?',
        biet: '{than_nhan} đã bị người lạ hỏi thăm từ trước.', thang_vui: '(không)', cai_mat: 'con nuôi, hoặc cơ hội Trúc Cơ',
        chang: {
          moc: { t: 'Mật thất',
            d: 'Trong mật thất, khí Trúc Cơ đã đến cửa, và chỉ còn bảy ngày nữa là bạn thành. Thọ Luyện Khí chỉ còn khoảng ba mươi năm, và bạn tính từng ngày như tính tiền.',
            lc: [
              { key: 'ngoi_tiep', label: 'Ngồi tiếp, không ra ngoài', kind: 'safe', mat: 'Bảy ngày không một tiếng động.' },
              { key: 'mo_xem_tin', label: 'Mở cửa đá, xem tin tức', kind: 'risk', mat: 'Một khe hở trong bảy ngày.' }
            ] },
          leo: { t: 'Tin từ thôn',
            d: 'Một đệ tử đưa tin từ làng bên sông: có người lạ đã đưa đứa con nuôi đi vào rừng từ sáng. Đệ tử đứng ở cửa đá, chờ bạn trả lời, còn bạn chỉ còn bảy ngày để chọn.',
            lc: [
              { key: 'cho_nguoi_di', label: 'Cho người đi tìm ngay', kind: 'help', mat: 'Một đội người lộ ra trước tông.' },
              { key: 'o_lai_mat_that', label: 'Ở lại mật thất, tiếp tục', kind: 'safe', mat: 'Bảy ngày của bạn không đổi.' }
            ] },
          // Cảnh lớn: Cửa quan (bản đã sửa)
          cao_trao: { t: 'Cửa quan', lon: true, canh: { gio: 'dem', thoi_tiet: 'giong_bao' },
            d: 'Bảy ngày nữa là Trúc Cơ, và đứa con nuôi của bạn đã bị bắt ở làng bên sông. Bạn đứng trước cửa đá, một bên là con đường thành đạo, một bên là tiếng gọi của đứa trẻ mà bạn đã nhận nuôi.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'than_nhan', cuu: 'su', label: 'Tiếp tục bế quan', mat: 'Đứa trẻ ở bên ngoài, và trái tim bạn.',
                sau: 'Bạn khép cửa đá và ngồi xuống. Tiếng gọi của đứa trẻ vọng qua khe đá, rồi dần nhỏ đi.',
                hau: 'Đứa trẻ sống hay chết, bạn không bao giờ biết chắc.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'than_nhan', cuu: 'than_nhan', label: 'Phá quan, mất cơ hội Trúc Cơ', mat: 'Bảy ngày tu luyện và cơ hội thành đạo.',
                sau: 'Bạn phá cửa đá, khí ngược lên cổ. Bạn chạy ra cửa mà không kịp nhìn lại mật thất đã vỡ.',
                hau: 'Bạn không bao giờ thành Trúc Cơ, và đứa con nuôi trở về trong tay người khác.' },
              { kieu: 'phuc_tung', vt: 'nguoc', doi: 'than_nhan', cuu: 'su', label: 'Xin sư tôn cứu đứa trẻ', mat: 'Sĩ diện, và chút tự trọng cuối cùng.',
                sau: 'Bạn quỳ trước cửa động, xin Băng Lạc đi cứu đứa trẻ. Ông nhìn bạn lâu, rồi đưa một đạo phù mà không nói gì.',
                hau: 'Ông không bao giờ nhắc lại chuyện đạo phù ấy, và bạn cũng không dám hỏi.' }
            ] },
          treo: { t: 'Con nuôi sống hoặc chết',
            d: 'Khi bạn ra khỏi mật thất, đứa con nuôi đã được đưa về làng hoặc đã nằm trong rừng, tùy việc bạn đã chọn. Băng Lạc đứng ở cửa, và ông hỏi: "Ngươi đã thành Trúc Cơ, hay chưa?"',
            lc: [
              { key: 'tra_loi_chua', label: 'Trả lời: chưa thành', kind: 'risk', mat: 'Một lời thừa nhận không ai muốn nghe.' },
              { key: 'khong_tra_loi', label: 'Không trả lời, bước đi', kind: 'safe', mat: 'Một khoảng im lặng của người không còn lời.' }
            ] }
        } },
      // ---------- Phần 6. Người báo tin: thành Trúc Cơ rồi báo cho ai; đồng hồ thọ nguyên ----------
      { id: 'nguoi_bao_tin', n: 'Người báo tin', chuc_nang: 'thành Trúc Cơ rồi báo cho ai; đồng hồ thọ nguyên', tuoi: 115, tho: 0.15, cau_hoi: 'Thành Trúc Cơ rồi báo cho ai?',
        biet: '{than_nhan} vẫn nhớ tên bạn.', thang_vui: 'con nuôi gọi bạn là "cha"', cai_mat: '(kết cục)',
        chang: {
          moc: { t: 'Thọ cạn',
            d: 'Thọ nguyên trong bạn chỉ còn một phần mỏng, và bạn đã không còn đủ sức bước xa khỏi động. Bên bờ sông, đứa con nuôi đang đứng đợi, tay cầm một cây sào tre.',
            lc: [
              { key: 'buoc_ra_song', label: 'Bước ra bờ sông', kind: 'help', mat: 'Một đoạn đường ngắn và rất lâu.' },
              { key: 'ngoi_trong_dong', label: 'Ngồi trong động, chờ', kind: 'safe', mat: 'Một chờ đợi không có điểm cuối.' }
            ] },
          leo: { t: 'Đồng hồ thọ',
            d: 'Chỉ còn một chút thọ nguyên, đủ để thử xung kích Trúc Cơ thêm một lần, hoặc để cứu đứa con nuôi. Bạn cầm trong tay một viên đan cũ, không biết đã cất từ bao giờ.',
            lc: [
              { key: 'xung_kich_cuoi', label: 'Xung kích Trúc Cơ lần cuối', kind: 'risk', mat: 'Gần hết phần đời còn lại, nếu thất bại.', tt: { can: { realm: 2 }, han: 120 } },
              { key: 'dung_thu_cuu', label: 'Dùng chút thọ cứu đứa trẻ', kind: 'safe', mat: 'Một cơ hội chạm Trúc Cơ bị bỏ lại.' }
            ] },
          // Cảnh lớn: người báo tin (đêm cuối)
          cao_trao: { t: 'Đêm cuối', lon: true, canh: { gio: 'dem', thoi_tiet: 'suong_doc' },
            d: 'Đêm cuối, đứa con nuôi nằm trên giường gỗ với hơi thở yếu, còn bạn đứng bên mép giường với viên đan và lời hứa cũ. Băng Lạc đứng ngoài cửa, không bước vào, như đã biết bạn sẽ chọn gì.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'than_nhan', cuu: 'than_nhan', label: 'Dùng chút thọ còn lại cứu con nuôi', mat: 'Thọ nguyên cuối cùng và cơ hội Trúc Cơ.',
                sau: 'Bạn đặt tay lên ngực đứa trẻ, và chút thọ cuối cùng chảy sang. Hơi thở của nó đều lại, còn bạn ngã xuống bên giường.',
                hau: 'Con nuôi gọi bạn là "cha" lần đầu tiên, khi nó đã biết mình được cứu.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'than_nhan', cuu: 'su', label: 'Xung kích Trúc Cơ lần cuối', mat: 'Cơ hội cuối cùng, và một đứa trẻ nằm một mình.',
                sau: 'Bạn ngồi xuống, nhắm mắt, và dẫn khí theo kinh mạch. Trong lúc đó, nhịp thở của đứa trẻ nhỏ dần, và bạn không mở mắt ra.',
                hau: 'Bạn không thành Trúc Cơ, và cũng không bao giờ biết đứa trẻ đã đi lúc nào.' },
              { kieu: 'tin', vt: 'nguoc', doi: 'than_nhan', cuu: 'than_nhan', label: 'Ngồi bên giường, cầm tay đứa trẻ tới hết', mat: 'Mọi cơ hội còn lại của bạn.',
                sau: 'Bạn đặt viên đan xuống bàn, nắm lấy tay đứa trẻ và ngồi đó cho tới khi trời sáng. Nó không mở mắt, nhưng bàn tay nó vẫn nắm chặt tay bạn.',
                hau: 'Bạn không thành Trúc Cơ, nhưng đêm ấy có người ở cạnh bạn đến cuối.' }
            ] },
          treo: { t: 'Khi đứa trẻ gọi là cha',
            d: 'Sáng hôm sau, một đứa trẻ đứng trước cửa động, tay cầm thanh sào tre, ngước lên nhìn bạn và chắp tay như đã được dạy. Nó nói một tiếng rất khẽ, và đợi bạn đáp.',
            lc: [
              { key: 'dap_con', label: 'Đáp lại bằng một tiếng "con"', kind: 'help', mat: 'Một tiếng gọi không ai dạy trước.' },
              { key: 'quay_vao_dong', label: 'Quay vào động, không đáp', kind: 'safe', mat: 'Một khoảng im lặng dài.' }
            ] }
        } }
    ],
    // Ba phương án lật (bốc một mỗi đời, nổ ở phần 4 hoặc 5). Chặng "treo" của phần nổ bị thay bằng đoạn sự thật.
    lat: [
      { id: 'a', kieu: 'su_dung_vu_bat', ten: 'Băng Lạc dựng vụ bắt cóc', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'treo', t: 'Băng Lạc gọi bạn lên động phủ đêm ấy, nói về con chó, như thể đã biết mọi việc từ trước.', hieu: 'Băng Lạc đã theo dõi bạn từ rất sớm.' },
          { phan: 3, o: 'leo', t: 'Trên thư từ làng bên sông có dấu ấn của một phù nhỏ, loại phù chỉ Băng Lạc mới có.', hieu: 'Băng Lạc có liên hệ với người gửi thư.' },
          { phan: 4, o: 'moc', t: 'Băng Lạc biết tên con nuôi của bạn trước khi bạn kể cho ông.', hieu: 'Băng Lạc đã biết con nuôi từ trước đó.' },
          { phan: 4, o: 'treo', t: 'Một người lạ đưa cho bạn một đạo phù bị bóp nát, và nói rằng đó là thứ sư tôn gửi tới.', hieu: 'Người bắt cóc nhận lệnh từ sư tôn.' }
        ],
        no: { biet: 'Băng Lạc dựng vụ bắt cóc để thử bạn có dứt được tình người không; ông tin rằng người thành Trúc Cơ phải không còn lưu luyến.',
          hieu: 'Băng Lạc đã dựng vụ bắt cóc để thử bạn.',
          d: 'Băng Lạc đứng trước cửa mật thất, không cầm kiếm, không cầm phù. "Ta muốn xem ngươi có dứt được không," ông nói. "Đứa trẻ ấy không có gì liên quan tới đạo của ngươi. Ta chỉ dựng nó để thử ngươi."',
          lc: [
            { key: 'quy_nhan_thua', label: 'Quỳ xuống nhận mình thất bại', kind: 'pay', mat: 'Chỗ đứng cao nhất mà bạn đã tự cho mình.', flag: 'lat_nhan_toi' },
            { key: 'buoc_qua', label: 'Nói bạn đã dứt, và bước qua ông', kind: 'risk', mat: 'Một lần đứng thẳng nhìn người ta.', flag: 'lat_chai_mat' }
          ] } },
      { id: 'b', kieu: 'a_moc_biet_tu_dau', ten: 'A Mộc biết bạn là ai', phan_no: 4, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'treo', t: 'A Mộc cõng bạn qua sông mùa lũ, và khi đặt bạn xuống bờ, ông nói nhẹ như gió: "Ngươi nặng hơn trước nhiều."', hieu: 'A Mộc đã nhận ra bạn từ lâu, từ thuở bạn còn nhỏ.' },
          { phan: 3, o: 'cao_trao', t: 'A Mộc nhìn bạn rất lâu trước khi bạn đi, như đang nhìn một điều đã mất từ lâu.', hieu: 'A Mộc biết bạn là đứa trẻ năm xưa, và giả như không biết.' },
          { phan: 3, o: 'treo', t: 'Khi bạn đi khỏi làng, A Mộc gọi khẽ tên tục của bạn, nhưng không đủ lớn để bạn quay lại.', hieu: 'A Mộc luôn biết tên bạn, và chọn không nhận.' }
        ],
        no: { biet: 'A Mộc biết bạn là ai từ đầu, và giả như không nhận để bạn khỏi áy náy.',
          hieu: 'A Mộc đã biết bạn từ lâu.',
          d: 'A Mộc đưa bạn tới bên mộ cũ dưới gốc liễu, nơi con chó được chôn năm nào. "Ta không nhận ngươi, vì ta sợ ngươi sẽ không đi nữa," ông nói. "Giờ ngươi đã đi xa rồi, ta nói được."',
          lc: [
            { key: 'hoi_sao_giau', label: 'Hỏi ông vì sao giấu', kind: 'risk', mat: 'Một câu trả lời muộn màng.', flag: 'lat_doi_mat' },
            { key: 'cui_o_lai', label: 'Cúi đầu, lặng lẽ ở lại', kind: 'help', mat: 'Một nơi bạn không còn muốn rời.', flag: 'lat_tha' }
          ] } },
      { id: 'c', kieu: 'chinh_ban_la_thu_pham', ten: 'Chính bạn là thủ phạm', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 4, o: 'leo', t: 'Trong thư của đứa con nuôi có một dòng nhỏ: "Có người lạ hỏi thăm con." Bạn đọc một lần rồi đặt xuống.', hieu: 'Lá thư đã báo trước vụ bắt, và bạn không đọc hết.' },
          { phan: 4, o: 'cao_trao', t: 'Mảnh giấy cháy dở trong phong thư chỉ còn lại một chữ: "lạ".', hieu: 'Mảnh giấy cháy dở là lời cảnh báo bạn đã đốt.' },
          { phan: 4, o: 'treo', t: 'Kẻ bắt cóc nói với bạn: "Chúng tôi đã chờ ngài trả lời từ lâu."', hieu: 'Bạn là người đã không trả lời lá thư ấy.' },
          { phan: 3, o: 'treo', t: 'Đứa trẻ mồ côi ở đầu làng nói có người lạ đã hỏi tên nó từ trước khi bạn nhận nuôi.', hieu: 'Người lạ đã để mắt tới đứa trẻ từ trước khi bạn nhận nuôi nó.' }
        ],
        no: { biet: 'Một lá thư bạn đốt không đọc ở phần 4 báo trước vụ bắt; người đứng sau là chính bạn, vì đã không trả lời.',
          hieu: 'Chính bạn là thủ phạm.',
          d: 'Đêm con nuôi bị bắt, bạn đứng trong mật thất, nghe tiếng gọi vọng từ xa. Trong tay bạn là một mảnh giấy cháy dở, và bạn nhớ ra đã đốt phong thư ấy mà không đọc hết.',
          lc: [
            { key: 'nhan_dot_thu', label: 'Nhận mình đã đốt thư, cúi đầu', kind: 'pay', mat: 'Chỗ đứng cao nhất mà bạn đã tự cho mình.', flag: 'lat_nhan_toi' },
            { key: 'noi_khong_biet', label: 'Nói bạn không biết đứa trẻ bị bắt vì đâu', kind: 'risk', mat: 'Một lần đứng thẳng nhìn người ta.', flag: 'lat_chai_mat' }
          ] } }
    ],
    khong_ke_ac: { phan: 3, o: 'leo', ten: 'A Mộc đang bệnh' },
    // Kết cục: chọn theo chuỗi kiểu lựa chọn (vt) ở TT.kb.ketKhuon.
    ket: {
      toan_ven: { t: 'Toàn vẹn', kv: 2, dk: { loai: 'nguoc', min: 3, tu_phan: 3, p6: 'hy_sinh' },
        log: '{ten} già đi như người phàm bên sông, còn đứa con nuôi chèo thuyền nan đưa {ten} qua sông.' },
      doa: { t: 'Đọa', kv: 0, xau: true, dk: { loai: 'dkd', phan: [4, 6] },
        log: '{ten} thành Trúc Cơ trong động phủ băng, và không ai để báo tin.' },
      co_doc: { t: 'Cô độc', kv: 1, xau: true, dk: { loai: 'con_lai' },
        log: '{ten} sống thêm một trăm năm, và đọc lại một trăm lá thư.' }
    }
  });
})();
