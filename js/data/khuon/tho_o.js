// Khuôn "Thờ ơ" (Tính tình dương, điềm tĩnh), chép từ ke-hoach/Q-khuon-kich-ban.md mục 7 thành dữ liệu (K3b). Cấu trúc theo js/data/khuon/kieu_hanh.js.
// Ghi chú chép (K3b, Haiku):
//   - Khuyết điểm gốc: tho_o (thuốc "dám" trùng với kds.tho_o).
//   - Dàn: Vô Vi là ke_thu (bóng tối) và su (thầy); Hạ Lam là guong (thuong hoặc doi_thu); bạn thuở nhỏ là ban (thôn Hạ Khê).
//   - Phụ: phu[0] = Hạ Lam (vật đèn lồng giấy, vật gương); phu[1] = bạn thuở nhỏ (vật giày rơm có sẵn, mục 7 không ghi vật).
//   - Muốn chỉ có một câu gốc: a tong / b vung là biến thể cùng ý, c tan_tu giữ câu gốc.
//   - "(ngược)" không ghi kiểu được chọn theo nghĩa: phần 1 "nhảy xuống sông" = chong (theo mục 7); phần 2 "tự đi xem" = chong; phần 3 "phá quan sớm" = hy_sinh (mất một bậc tiến); phần 4 "đi ngay" = hy_sinh; phần 5 "lao xuống" = chong; phần 6 "đưa dân chạy, bỏ tông" là dao_thoat (vt khac).
//   - Phần 3 là "không kẻ ác": bạn thuở nhỏ chết già khi bạn ra quan muộn một ngày; ghi ở cao trào vì cao trào đó (hy_sinh/dung_khuyet_diem) không chứa kiểu bị cấm.
//   - Tâm ma 🜏 (P4, P5) chưa mã hóa thành kiểu riêng: mục 7 chỉ ghi "để Hạ Lam đi một mình rồi tự nhủ 'nàng sẽ ổn'" — đã ghi ở kiểu im_lang của P4.
//   - Lật (b) có manh P5 ("tờ lá vàng có tên người báo tin") nhưng lint không cho manh mối ở phần nổ trở đi: dời sang phần 4 (treo).
//   - Thử thách có hạn (tt) đặt ở phần 2 leo "bảo người báo tin chờ".
(function () {
  const D = window.TT.data;

  D.STORY.regKhuon({
    id: 'tho_o', ten: 'Thờ ơ', khuyet_diem: 'tho_o',
    cau_hoi_trung_tam: 'Không làm gì có phải là vô tội?',
    logline: 'Người đứng ngoài mọi chuyện vì chờ đủ chắc; mỗi lần chờ là một người không kịp được cứu, cho tới khi chính người ấy phải đứng trước việc không còn kịp.',
    bay_manh: {
      vet_thuong: [
        { id: 'a', xt: ['p1', 'p2'], vet: 'lần đầu lao xuống sông cứu người, cả hai suýt chết và người kia chết',
          canh: 'Năm mười tuổi bạn lần đầu lao xuống sông cứu người. Cả hai suýt chết đuối, và người kia chết ngay trên bãi cát trước mặt bạn.' },
        { id: 'b', xt: ['p5'], vet: 'chạy theo đám đông bị đánh, đứng ngoài thì yên',
          canh: 'Năm mười tuổi bạn chạy theo đám đông đánh một người lạ ở chợ, rồi nhận ra đứng ngoài thì yên. Bạn đã học được điều ấy.' },
        { id: 'c', xt: ['p3', 't10'], vet: 'cha liều đột phá và chết, mẹ bảo "phải chi ông ấy chờ"',
          canh: 'Cha bạn liều đột phá khi chưa đủ chắc và chết ngay trong phòng tu. Mẹ đứng bên giường, nói khẽ: "Phải chi ông ấy chờ."' }
      ],
      loi_noi_doi: 'Chờ đủ chắc rồi mới làm; đứng ngoài thì không sai.',
      muon: [
        { id: 'a', cho: 'tong', t: 'tu đạo thanh tịnh trong tông, không vướng víu ai' },
        { id: 'b', cho: 'vung', t: 'tu đạo thanh tịnh trong vùng, không vướng víu ai' },
        { id: 'c', cho: 'tan_tu', t: 'tu đạo thanh tịnh, không vướng víu' }
      ],
      can: 'dám làm khi chưa chắc',
      bong_toi: { vai: 'ke_thu', cach_chon: 'sư tổ Vô Vi, "đạo là không vội", nhìn thế gian sụp đổ và gọi đó là đạo; ra mắt từ phần 1',
        ra_mat: [
          'sư tổ Vô Vi ngồi bên bờ sông, nhìn đứa trẻ vùng vẫy mà không đứng dậy, và nói: "Đạo là không vội."',
          'sư tổ Vô Vi đặt chén trà xuống, nhìn cả đám đệ tử đang chạy về phía làng cháy, và gật đầu như xem thời tiết',
          'sư tổ Vô Vi xoa đầu bạn, dịu dàng như người cha, và nói rằng chờ cũng là một cách thương người'
        ] },
      guong: { vai: ['thuong', 'doi_thu'], dd: 'tán tu bốc đồng, làm sai nhiều mà cứu được người, lúc nào cũng cầm {vat_guong}' },
      hy_sinh: 'sự thanh tịnh, tu vi, mạng'
    },
    dan: { ke_thu: 'su', guong: ['thuong', 'doi_thu'], su: 'su', doi_thu: 'doi_thu', than_nhan: 'than_nhan', ban: 'ban' },
    soi: {
      chinh: { nguoi: 'su', vat: [
        { id: 'chen_tra', canh: '{ke_thu} rót chén trà thứ nhất, đẩy về phía bạn, và không ngẩng lên khi bạn đứng dậy.', treo: '{ke_thu} cất chén trà vào túi áo, nói rằng thứ gì đã rót thì không cần uống để biết nó nguội.' }
      ] },
      phu: [
        { nguoi: 'guong', vat: [{ id: 'den_long' }] },
        { nguoi: 'ban', vat: [{ id: 'giay_rom' }] }
      ]
    },
    noi: { chinh: 'thôn Hạ Khê', tong: 'đỉnh núi của tông', cam: ['hậu sơn, nơi có dấu trận cổ'] },
    thang_suc_manh: [
      { realm: 0, dinh: 'người đứng đầu ngoại môn' },
      { realm: 1, stage: 0, dinh: 'đệ tử nội môn có tiếng' },
      { realm: 1, stage: 2, dinh: 'đệ nhất nội môn, người được chọn làm chân truyền' },
      { realm: 2, dinh: 'trưởng lão, người đứng đầu một vùng nhỏ' },
      { realm: 3, dinh: 'cái tên người ta nhắc như huyền thoại' }
    ],
    phan: [
      // ---------- Phần 1. Bờ sông: nhảy hay gọi người ----------
      { id: 'bo_song', n: 'Bờ sông', chuc_nang: 'biến cố khởi đầu; nhảy hay gọi người', tuoi: 12, cau_hoi: 'Nhảy hay gọi người?',
        biet: '{ke_thu} đứng bên bờ bên kia và thấy tất cả.', thang_vui: 'cả thôn mời cơm, nếu bạn cứu được người', cai_mat: 'một đứa trẻ, hoặc lòng tin của bạn',
        chang: {
          moc: { t: 'Tiếng kêu trên sông',
            d: 'Chiều hôm ấy bạn đi qua bờ sông và nghe tiếng kêu từ giữa dòng nước xiết. Một đứa trẻ đang vùng vẫy cách bờ không xa, còn người lớn trên bờ đứng nhìn.',
            lc: [
              { key: 'dung_xem', label: 'Đứng nhìn, chờ người khác ra tay', kind: 'safe', mat: 'Một buổi chiều yên ổn, và một tiếng kêu không ai nghe.' },
              { key: 'chay_tim_sao', label: 'Chạy đi tìm sào tre', kind: 'help', mat: 'Vài nhịp chậm mà đứa trẻ không có.' }
            ] },
          leo: { t: 'Vô Vi bên bờ kia',
            d: 'Vô Vi đứng bên bờ kia, chắp tay sau lưng, không nhúc nhích. Đứa trẻ chìm xuống rồi lại ngoi lên, và tiếng kêu của nó lúc gần lúc xa.',
            lc: [
              { key: 'hoi_su_to', label: 'Hỏi sư tổ có nên cứu không', kind: 'risk', mat: 'Một câu hỏi làm ông nhìn bạn lâu hơn.' },
              { key: 'cho_them', label: 'Chờ thêm một nhịp nữa', kind: 'safe', mat: 'Thêm một nhịp, và một đứa trẻ đang chìm.' }
            ] },
          cao_trao: { t: 'Đứa trẻ rơi xuống sông', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Đứa trẻ rơi xuống sông đúng lúc bạn đứng ở mép bờ, và dòng nước kéo nó ra giữa. Cả bờ hét lên, và chỉ có bạn còn đủ gần để chọn.',
            kieu: [
              { kieu: 'chong', vt: 'nguoc', doi: 'ban', cuu: 'guong', label: 'Nhảy xuống sông', mat: 'Sức lực của bạn, và có thể cả mạng.',
                sau: 'Bạn lao xuống dòng nước xiết, vươn tay về phía đứa trẻ. Hai thân người va vào nhau giữa dòng, và cả hai cùng bị cuốn đi một đoạn.',
                hau: 'Đứa trẻ được kéo lên bờ, và bạn không còn đủ sức đứng dậy nữa.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'ban', label: 'Chạy đi gọi người lớn', mat: 'Một khoảnh khắc chờ, và đứa trẻ có thể không kịp.',
                sau: 'Bạn chạy lên làng gọi người. Khi cả thôn kéo ra bờ, đứa trẻ đã nằm trên cát, không còn cử động.',
                hau: 'Cha mẹ đứa trẻ không trách bạn, và bạn không tha thứ được cho mình.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'ban', cuu: 'su', label: 'Đứng nhìn', mat: 'Một đứa trẻ không kịp được cứu, và lương tâm bạn lặng đi.',
                sau: 'Bạn đứng yên trên bờ. Nước cuốn đứa trẻ đi, và Vô Vi quay sang nhìn bạn, không nói gì.',
                hau: 'Cả thôn kể chuyện bạn đứng nhìn, và bạn không cãi lại.' }
            ] },
          treo: { t: 'Vô Vi ở bờ bên kia',
            d: 'Chiều tối, người ta vớt được đứa trẻ lên bờ, còn Vô Vi vẫn đứng bên kia sông, không động đậy. Ông nói một câu nhẹ như gió: "Không ai cần đến ta."',
            lc: [
              { key: 'hoi_vi_sao', label: 'Hỏi ông vì sao không động', kind: 'risk', mat: 'Một câu trả lời bạn không muốn nghe.' },
              { key: 'im_di', label: 'Im lặng, đi về', kind: 'safe', mat: 'Một đêm không ai nhắc tới chuyện sông.' }
            ] }
        } },
      // ---------- Phần 2. Dấu trận: chờ thêm hay đi xem ----------
      { id: 'dau_tran', n: 'Dấu trận', chuc_nang: 'chờ thêm hay đi xem', tuoi: 30, cau_hoi: 'Chờ thêm hay đi xem?',
        biet: '{ke_thu} đã biết tên trận nằm ở hậu sơn.', thang_vui: 'tâm tĩnh, đột phá dễ', cai_mat: 'một người trong thôn, hoặc thời gian của bạn',
        chang: {
          moc: { t: 'Lá vàng dưới cửa',
            d: 'Sáng sớm, bạn thấy một lá vàng úp trên chén trà ngoài hiên, và lá ấy không rụng từ cây nào trong tông. Trong thôn Hạ Khê có người nói đêm qua thấy ánh sáng ở hậu sơn.',
            lc: [
              { key: 'nhat_la', label: 'Nhặt lá vàng lên xem', kind: 'risk', mat: 'Một chiếc lá mang mùi đất lạ.' },
              { key: 'up_lai', label: 'Úp lại chén trà, đi tiếp', kind: 'safe', mat: 'Một buổi sáng nhẹ nhõm.' }
            ] },
          leo: { t: 'Người báo tin',
            d: 'Một người trẻ trong thôn chạy lên tìm bạn, nói rằng hậu sơn có dấu trận lạ, vạch dưới đất theo lối bút quen. Hắn đứng thở hổn hển, chờ bạn đi cùng.',
            lc: [
              { key: 'bao_cho', label: 'Bảo hắn chờ, chưa vội', kind: 'risk', mat: 'Một lời chờ mà không ai biết sẽ dài đến đâu.', tt: { can: { xp: 0.2 }, han: 24 } },
              { key: 'di_cung', label: 'Đi cùng hắn ngay', kind: 'help', mat: 'Một buổi chiều mệt, và một người bên cạnh.' }
            ] },
          cao_trao: { t: 'Dấu trận ở hậu sơn', lon: true, canh: { gio: 'dem', thoi_tiet: 'suong_doc' },
            d: 'Dấu trận nằm trên nền đá hậu sơn, vẽ bằng một lối bút quen mà bạn nhận ra. Trời sắp tối, và người báo tin đứng chờ bên bạn, không dám bước vào vòng vẽ.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'su', label: 'Chờ cho chắc rồi mới vào', mat: 'Một đêm nữa cho thôn Hạ Khê.',
                sau: 'Bạn đứng ngoài vòng vẽ, đợi trời sáng hẳn. Khi bạn bước vào, dấu trận đã sáng lên, và người báo tin không còn đứng bên cạnh.',
                hau: 'Từ đêm đó bạn không bao giờ quên cảm giác "chờ thêm một chút".' },
              { kieu: 'chong', vt: 'nguoc', doi: 'su', cuu: 'guong', label: 'Tự bước vào vòng vẽ', mat: 'Sự an toàn của bạn, và một đêm không ngủ.',
                sau: 'Bạn bước qua vạch đá, đứng giữa dấu trận và nhìn thẳng vào các nét vẽ. Dấu trận chấn động, và bạn phải dùng hết sức để đứng vững.',
                hau: 'Bạn biết dấu trận này, và biết rằng nó có thể được phá từ bên trong.' },
              { kieu: 'tin', vt: 'khac', doi: 'ban', cuu: 'su', label: 'Báo lên tông, tin vào người đứng đầu', mat: 'Thời gian, và lời nói của một người trẻ.',
                sau: 'Bạn đi báo Vô Vi. Ông nghe xong, bảo rằng đừng vội, rồi không nói thêm lời nào.',
                hau: 'Đêm ấy không ai lên hậu sơn nữa.' }
            ] },
          treo: { t: 'Đèn Hạ Khê tắt',
            d: 'Đêm ấy, một ngọn đèn ở Hạ Khê tắt. Bạn đứng trên đỉnh núi, nhìn xuống và đếm được một, hai, rồi ba căn nhà đã tối.',
            lc: [
              { key: 'chay_xuong', label: 'Chạy xuống thôn ngay', kind: 'help', mat: 'Đoạn đường dốc và đêm lạnh.' },
              { key: 'dung_yen', label: 'Đứng yên, không xuống', kind: 'safe', mat: 'Một đêm nhìn đèn tắt từ trên cao.' }
            ] }
        } },
      // ---------- Phần 3. Chén thứ nhất: đi muộn một ngày có sao không (cảnh lớn không kẻ ác: bạn thuở nhỏ) ----------
      { id: 'chen_thu_nhat', n: 'Chén thứ nhất', chuc_nang: 'đi muộn một ngày có sao không; bạn thuở nhỏ hấp hối', tuoi: 55, canh: { realm: 1 }, cau_hoi: 'Đi muộn một ngày có sao không?',
        biet: '{ban} đã ốm từ mùa đông.', thang_vui: 'Hạ Lam kéo bạn đi hội đèn', cai_mat: 'một người bạn thuở nhỏ, hoặc một bậc tiến',
        chang: {
          moc: { t: 'Bế quan',
            d: 'Bạn bế quan trong mật thất từ đầu mùa, và đếm ngày bằng những vạch trên vách đá. Hạ Lam đứng ngoài cửa, không gõ, chỉ để lại một ngọn đèn lồng giấy đã tắt.',
            lc: [
              { key: 'mo_cua', label: 'Mở cửa, hỏi nàng đứng đó làm gì', kind: 'risk', mat: 'Một nhịp bế quan bị bỏ dở.' },
              { key: 'giu_cua', label: 'Giữ cửa đá, tiếp tục', kind: 'safe', mat: 'Một vạch nữa trên vách.' }
            ] },
          // Cảnh lớn KHÔNG có kẻ ác (khong_ke_ac): bạn thuở nhỏ chết già khi bạn ra quan muộn một ngày
          leo: { t: 'Thư từ thôn', d: 'Thư từ thôn Hạ Khê đến muộn: bạn thuở nhỏ đã ốm từ mùa đông và chưa qua được mùa xuân. Người viết thư nói rằng ông ấy vẫn gọi tên bạn mỗi chiều, như chờ bạn ra khỏi cửa đá.',
            lc: [
              { key: 'doc_thu', label: 'Đọc thư tới dòng cuối', kind: 'safe', mat: 'Một lá thư đã quá muộn để đáp.' },
              { key: 'cat_thu', label: 'Cất thư đi, sau khi ra quan', kind: 'risk', mat: 'Một lời hẹn không giữ được.' }
            ] },
          cao_trao: { t: 'Bạn thuở nhỏ hấp hối', lon: true, canh: { gio: 'hoang_hon', thoi_tiet: 'suong_doc' },
            d: 'Đến ngày bạn đáng ra phải ra quan, bạn thuở nhỏ đang hấp hối ở thôn dưới núi. Bạn đứng trước cửa đá, một bên là ngày xuất quan đã định, một bên là một người chờ bạn từ đầu đông.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ban', cuu: 'ban', label: 'Phá quan sớm, mất một bậc tiến', mat: 'Một bậc tiến, và một khoảng thanh tịnh bạn đã giữ bấy lâu.',
                sau: 'Bạn phá cửa đá, khí chạy ngược trong kinh mạch. Bạn lao xuống thôn trong đêm, và bậc tiến đã mất sau lưng.',
                hau: 'Bạn kịp đến, nhưng người bạn thuở nhỏ chỉ kịp nắm tay bạn một lần.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'ban', label: 'Ra quan đúng hạn', mat: 'Một người bạn không được tiễn, và một đêm yên tĩnh.',
                sau: 'Bạn giữ đúng hạn, ra khỏi cửa đá khi trời sáng. Tin báo đến lúc bạn vừa bước ra, và người bạn đã đi trước đó một đêm.',
                hau: 'Bạn nhớ mãi chữ "đúng hạn" trong lá thư cuối cùng của ông ấy.' }
            ] },
          treo: { t: 'Chén trà thứ nhất',
            d: 'Sau tang lễ, Vô Vi rót cho bạn chén trà thứ nhất, và nói rằng ai đi muộn một ngày thì vẫn còn kịp uống trà. Bạn nhìn chén trà, không biết nó nóng hay đã nguội.',
            lc: [
              { key: 'uong_tra', label: 'Uống một hơi', kind: 'safe', mat: 'Vị đắng nhẹ, và một buổi chiều lặng.' },
              { key: 'de_tra', label: 'Đặt chén xuống, không uống', kind: 'risk', mat: 'Một lời từ chối không ai hiểu.' }
            ] }
        } },
      // ---------- Phần 4. Tĩnh Tâm (chiến thắng giả): thanh tịnh để làm gì ----------
      { id: 'tinh_tam', n: 'Tĩnh Tâm', chuc_nang: 'chiến thắng giả: thanh tịnh để làm gì', tuoi: 85, canh: { realm: 1, stage: 2 }, cau_hoi: 'Thanh tịnh để làm gì?',
        biet: '{guong} đã biết tên trận nằm ở đâu.', thang_vui: 'được tôn là "Tĩnh Tâm chân nhân"', cai_mat: 'tình bạn của Hạ Lam, hoặc danh tiếng',
        chang: {
          moc: { t: 'Đại điển',
            d: 'Đại điển tôn bạn làm Tĩnh Tâm chân nhân, và cả tông đứng dậy chúc mừng. Hạ Lam đứng cuối hàng, không nói gì, và mắt nàng không rời chiếc đèn lồng giấy trong tay.',
            lc: [
              { key: 'nhan_chuc', label: 'Nhận lời chúc, không nhìn ai', kind: 'safe', mat: 'Một chỗ đứng cao hơn tất cả.' },
              { key: 'nam_tay', label: 'Bước xuống, nắm tay Hạ Lam', kind: 'help', mat: 'Một cử chỉ không đúng nghi lễ.' }
            ] },
          leo: { t: 'Lời xin',
            d: 'Hạ Lam tìm bạn trong thư phòng, đặt lên bàn sơ đồ dấu trận và xin bạn cùng phá trận. Nàng nói nhỏ, như thể sợ bạn sẽ từ chối.',
            lc: [
              { key: 'doi_chac', label: 'Nói phải đợi đủ chắc đã', kind: 'safe', mat: 'Một lời hứa không ngày.' },
              { key: 'hoi_chac', label: 'Hỏi nàng có chắc không', kind: 'risk', mat: 'Một câu hỏi làm nàng im lặng.' }
            ] },
          cao_trao: { t: 'Phá trận', lon: true, canh: { gio: 'dem', thoi_tiet: 'mua' },
            d: 'Hạ Lam đứng trước trận đồ, đèn lồng giấy đã thắp, và chỉ cần một chữ của bạn là nàng bước vào. Bạn đứng sau lưng nàng, còn tông môn đang đợi bạn trả lời.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'guong', cuu: 'ban', label: 'Chờ đủ chắc rồi mới phá trận', mat: 'Một đêm nữa cho Hạ Khê, và một người bạn đi một mình.',
                sau: 'Bạn đứng yên, đợi thêm một lúc để chắc. Hạ Lam bước vào một mình, đèn lồng sáng lên rồi tắt.',
                hau: 'Bạn không bao giờ nói với ai rằng mình đã đợi thêm một lúc.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'guong', cuu: 'guong', label: 'Đi ngay cùng nàng, bỏ cả cảnh giới', mat: 'Cảnh giới đã nắm, và sự thanh tịnh bạn giữ bấy lâu.',
                sau: 'Bạn rút kiếm, chạy theo nàng vào trận. Nàng quay lại, mỉm cười, và bạn không thấy được cái chết ở đâu trong nụ cười ấy.',
                hau: 'Bạn không còn là người thanh tịnh, nhưng có người đi cùng bạn đến cuối.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'guong', cuu: 'guong', label: 'Để nàng đi một mình, tự nhủ "nàng sẽ ổn"', mat: 'Một người đi vào trận, và lời tự nhủ của chính bạn.',
                sau: 'Bạn đứng yên sau lưng nàng, không bước theo. Bạn nói với mình rằng nàng sẽ ổn, và tiếng bước chân nàng tan dần trong trận.',
                hau: 'Bạn nhớ câu tự nhủ ấy suốt đời, và nó không bao giờ trở thành sự thật.' }
            ] },
          treo: { t: 'Đèn lồng treo cổng',
            d: 'Sáng hôm sau, đèn lồng giấy của Hạ Lam được treo lên cổng tông, nhưng không ai thắp. Bạn đứng nhìn một lúc lâu, rồi quay vào trong mà không hỏi ai.',
            lc: [
              { key: 'thap_den', label: 'Đứng lại, thắp đèn', kind: 'help', mat: 'Một ngọn đèn nhỏ và muộn.' },
              { key: 'quay_vao', label: 'Quay vào, không hỏi', kind: 'safe', mat: 'Một cổng tông không ai nhìn lên.' }
            ] }
        } },
      // ---------- Phần 5. Ba chén trà: còn kịp không ----------
      { id: 'ba_chen_tra', n: 'Ba chén trà', chuc_nang: 'tất cả đã mất; còn kịp không', tuoi: 100, cau_hoi: 'Còn kịp không?',
        biet: '{ke_thu} vẫn ngồi đó, rót trà.', thang_vui: '(không)', cai_mat: 'chén trà, hoặc sự thanh tịnh cuối cùng',
        chang: {
          moc: { t: 'Bàn trà',
            d: 'Vô Vi đặt ba chén trà trước mặt bạn, chén nào cũng còn bốc hơi. Ông nói "Còn nóng." rồi nhìn xuống sân, nơi đèn Hạ Khê đang tắt từng ngọn.',
            lc: [
              { key: 'uong_chen_dau', label: 'Uống chén thứ nhất', kind: 'help', mat: 'Một ngụm trà còn ấm.' },
              { key: 'khong_cham', label: 'Không chạm vào chén nào', kind: 'safe', mat: 'Ba chén trà nguội dần trên bàn.' }
            ] },
          leo: { t: 'Đèn tắt',
            d: 'Từ đỉnh núi, bạn thấy đèn Hạ Khê tắt thêm một ngọn. Hạ Lam đang ở đâu đó dưới chân núi, và bạn không biết nàng còn sống hay không.',
            lc: [
              { key: 'xuong_nui', label: 'Xuống núi ngay', kind: 'risk', mat: 'Con đường dốc, và một nhịp phá vỡ thanh tịnh.' },
              { key: 'doi_nguoi_bao', label: 'Đợi người báo về', kind: 'safe', mat: 'Thêm một lúc không biết gì.' }
            ] },
          // Cảnh chuẩn "Ba chén trà" ("Còn nóng.")
          cao_trao: { t: 'Ba chén trà', lon: true, canh: { gio: 'dem', thoi_tiet: 'suong_doc' },
            d: 'Vô Vi đẩy cả ba chén về phía bạn và hỏi bạn chọn chén nào. Chén nào cũng còn nóng, và ngoài sân, đèn Hạ Khê vẫn đang tắt từng ngọn một.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'su', label: 'Uống', mat: 'Chút bình yên của một người không vội.',
                sau: 'Bạn uống hết chén trà. Vị đắng lan xuống bụng, và đèn Hạ Khê tắt thêm một ngọn.',
                hau: 'Vô Vi mỉm cười, như vừa được xác nhận điều gì đó.' },
              { kieu: 'chong', vt: 'nguoc', doi: 'su', cuu: 'ban', label: 'Lao xuống núi, bỏ cả ba chén', mat: 'Đường xuống núi dài và tối.',
                sau: 'Bạn hất đổ bàn, lao xuống dốc theo lối tắt. Tiếng chén vỡ vang sau lưng, và Vô Vi không đuổi theo.',
                hau: 'Bạn đến Hạ Khê khi trời đã sáng, và trong thôn chỉ còn một nửa người.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'ban', cuu: 'su', label: 'Hỏi hai chén kia của ai', mat: 'Một câu hỏi làm Vô Vi im lặng.',
                sau: 'Bạn hỏi hai chén còn lại là của ai. Vô Vi không trả lời, chỉ đẩy hai chén về phía người đệ tử trẻ đang quỳ bên cạnh.',
                hau: 'Đệ tử trẻ uống chén ấy, và không ai nhớ tên nó.' }
            ] },
          treo: { t: 'Hạ Khê mất một nửa',
            d: 'Sáng hôm sau, người ta kể lại rằng nửa thôn Hạ Khê đã tắt đèn. Bạn ngồi trên đỉnh núi với chén trà nguội, và không biết mình đã uống chén nào.',
            lc: [
              { key: 'cam_chen', label: 'Cầm chén nguội lên uống', kind: 'risk', mat: 'Vị nguội như chính thôn ấy.' },
              { key: 'do_chen', label: 'Đổ chén nguội xuống đất', kind: 'safe', mat: 'Một chút hối hận nhỏ.' }
            ] }
        } },
      // ---------- Phần 6. Chén thứ tư: lần này dám chưa ----------
      { id: 'chen_thu_tu', n: 'Chén thứ tư', chuc_nang: 'trận lớn nuốt cả vùng; lần này dám chưa; đồng hồ thọ nguyên', tuoi: 115, tho: 0.15, cau_hoi: 'Lần này dám chưa?',
        biet: 'Đệ tử nhỏ của tông đã thắp đèn lồng giấy.', thang_vui: 'một đứa trẻ Hạ Khê thắp đèn lồng giấy', cai_mat: '(kết cục)',
        chang: {
          moc: { t: 'Trận nuốt vùng',
            d: 'Trận lớn bắt đầu nuốt cả vùng, từng thôn một tắt đèn theo hướng gió. Thọ nguyên trong ngực bạn đã mỏng, và bạn biết mình chỉ còn một lần ra tay.',
            lc: [
              { key: 'dung_ngoai', label: 'Đứng ngoài nhìn trận lan', kind: 'safe', mat: 'Một chỗ đứng không ai trách.' },
              { key: 'xuong_bao', label: 'Chạy xuống các thôn báo tin', kind: 'help', mat: 'Một đoạn đường dài và đêm chưa tắt đèn.' }
            ] },
          leo: { t: 'Tu vi cuối', d: 'Bạn còn một chút tu vi cuối, đủ để phá một mắt trận hoặc để nuôi người chạy trốn. Đệ tử nhỏ nhất của tông đang đứng sau lưng bạn, tay nắm chặt một đèn lồng giấy.',
            lc: [
              { key: 'pha_mat_tran', label: 'Dốc hết tu vi để phá mắt trận', kind: 'risk', mat: 'Gần hết phần đời còn lại, nếu thất bại.', tt: { can: { realm: 2 }, han: 120 } },
              { key: 'de_chay', label: 'Để tu vi lại cho người chạy', kind: 'safe', mat: 'Cơ hội cuối cùng được sống thêm một đời.' }
            ] },
          // Cảnh lớn: trận cuối
          cao_trao: { t: 'Trận cuối', lon: true, canh: { gio: 'dem', thoi_tiet: 'giong_bao' },
            d: 'Trận đồ sáng lên khắp vùng, và người ta không còn chạy được nữa. Dưới bậc đá, người trẻ nhất trong tông đứng nhìn bạn, chờ bạn quyết định dám làm gì.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'doi_thu', cuu: 'guong', label: 'Phá trận bằng tu vi cuối', mat: 'Chút tu vi cuối cùng, và những năm còn lại.',
                sau: 'Chút khí cuối rời khỏi bạn. Mắt trận vỡ thành ánh sáng, và trận đồ tắt dần từ đỉnh núi xuống chân núi.',
                hau: 'Người dân đi qua cổng trận khi trời vừa sáng.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'doi_thu', cuu: 'su', label: 'Rót trà cho đệ tử trẻ, dạy "đạo là không vội"', mat: 'Một đứa trẻ học điều sai, và trận vẫn sáng.',
                sau: 'Bạn rót trà, đẩy chén về phía đứa trẻ và nói "đạo là không vội". Đứa trẻ cầm chén, và trận đồ vẫn sáng thêm một vòng.',
                hau: 'Đứa trẻ nhớ câu ấy suốt đời, và không bao giờ hỏi vì sao.' },
              { kieu: 'dao_thoat', vt: 'khac', doi: 'su', cuu: 'ban', label: 'Đưa dân chạy, bỏ tông', mat: 'Tông môn phía sau, và cái danh bạn đã giữ.',
                sau: 'Bạn dẫn dân chạy qua khe núi, bỏ lại tông môn phía sau. Vô Vi đứng trên đỉnh, không quay lại nhìn ai.',
                hau: 'Người dân sống sót, nhưng tông môn từ đó không ai nhắc tới tên bạn.' }
            ] },
          treo: { t: 'Đèn lồng của đứa trẻ',
            d: 'Một đứa trẻ Hạ Khê thắp một đèn lồng giấy trên đống đá đổ, và ánh đèn nhỏ đến mức chỉ bạn nhìn thấy. Nó ngước lên nhìn bạn, rồi giơ đèn cao hơn.',
            lc: [
              { key: 'che_gio', label: 'Đưa tay che gió cho ngọn đèn', kind: 'help', mat: 'Chút ấm cuối cùng của một đời.' },
              { key: 'quay_mat', label: 'Quay mặt đi, để đèn tự tắt', kind: 'safe', mat: 'Một ngọn đèn không ai nhìn.' }
            ] }
        } }
    ],
    // Ba phương án lật (bốc một mỗi đời, nổ ở phần 4 hoặc 5). Chặng "treo" của phần nổ bị thay bằng đoạn sự thật.
    lat: [
      { id: 'a', kieu: 'ke_dung_sau', ten: 'Vô Vi là người dựng trận', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 2, o: 'leo', t: 'Dấu trận vẽ theo một lối bút mà Vô Vi vẫn dùng khi viết chữ trong sổ tông.', hieu: 'Vô Vi đã vẽ dấu trận ấy từ trước.' },
          { phan: 3, o: 'treo', t: 'Lá vàng úp trên chén trà là lá của cây hậu sơn, cây mà chỉ Vô Vi biết lối tới.', hieu: 'Vô Vi đã đi qua hậu sơn và đặt dấu.' },
          { phan: 4, o: 'moc', t: 'Vô Vi nói đúng tên trận khi nghe Hạ Lam nhắc tới, dù bạn chưa từng nghe tên ấy.', hieu: 'Vô Vi biết trận từ trước khi nó được dựng.' }
        ],
        no: { biet: 'Vô Vi là người dựng trận, và ông đứng nhìn để bạn tự chọn mà không ngăn.',
          hieu: 'Vô Vi là người dựng trận.',
          d: 'Đêm sau đại điển, Vô Vi gọi bạn ra hậu sơn. Ông đứng cạnh dấu trận, không che giấu gì, và nói: "Ta dựng trận này từ năm bạn mười tuổi. Ta chỉ muốn xem ngươi có đủ dám không."',
          lc: [
            { key: 'hoi_vi', label: 'Hỏi ông vì sao phải làm vậy', kind: 'risk', mat: 'Một câu trả lời bạn không muốn nghe.', flag: 'lat_doi_mat' },
            { key: 'xuong_nui', label: 'Quay lưng đi xuống núi', kind: 'safe', mat: 'Sự thật về người sư tổ bạn đã tin.', flag: 'lat_quay_di' }
          ] } },
      { id: 'b', kieu: 'chinh_ban_la_thu_pham', ten: 'Chính bạn là thủ phạm', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 2, o: 'leo', t: 'Người báo tin rời khỏi thôn ngay sau khi bạn bảo hắn chờ, và hắn không kịp gọi tên mình.', hieu: 'Người báo tin là người đầu tiên bị trận nuốt.' },
          { phan: 3, o: 'leo', t: 'Người báo tin không về, và sân nhà hắn trong thôn vẫn còn đôi giày rơm bỏ ngoài cửa.', hieu: 'Người báo tin không bao giờ trở về; bạn là người đã bảo hắn chờ.' },
          { phan: 4, o: 'treo', t: 'Trong sổ tông có một cái tên bị gạch chéo, và đó là tên người báo tin ở Hạ Khê.', hieu: 'Tên người báo tin là người đầu tiên chết trong trận.' }
        ],
        no: { biet: 'Người báo tin đầu tiên chết trong trận, và bạn là người đã bảo hắn chờ.',
          hieu: 'Chính bạn là thủ phạm.',
          d: 'Sáng sớm, Vô Vi đặt một tờ lá vàng lên chén trà trước mặt bạn. Trên tờ lá có một cái tên bạn đã nghe lần đầu hôm có dấu trận, cái tên của người báo tin.',
          lc: [
            { key: 'nhan_bao_cho', label: 'Nhận là mình đã bảo hắn chờ', kind: 'pay', mat: 'Chỗ đứng cao nhất mà bạn đã tự cho mình.', flag: 'lat_nhan_toi' },
            { key: 'noi_tu_di', label: 'Nói người đó tự đi, không phải lỗi của bạn', kind: 'risk', mat: 'Một lần đứng thẳng nhìn người ta.', flag: 'lat_chai_mat' }
          ] } },
      { id: 'c', kieu: 'ke_ac_co_ly_do', ten: 'Kẻ ác có lý do', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'treo', t: 'Một người lớn tuổi trên bờ kể chuyện con ma dưới núi, và ông nói ai đèn tắt thì người đó sẽ bị gọi.', hieu: 'Dưới núi có một yêu vật đang bị trấn.' },
          { phan: 3, o: 'leo', t: 'Mỗi khi đèn trong thôn tắt, đất dưới núi rung nhẹ, như có thứ gì đang thở.', hieu: 'Trận trấn yêu vật, và yêu vật ăn sinh khí của một thôn mỗi năm.' },
          { phan: 4, o: 'moc', t: 'Sách cổ của tông có một trang nói về "trấn sơn", và trang ấy đã bị xé mất một nửa.', hieu: 'Tông đã biết việc trấn yêu từ lâu và chọn thôn nhỏ nhất.' }
        ],
        no: { biet: 'Trận trấn một yêu vật dưới núi; mỗi năm nó ăn sinh khí một thôn, và Vô Vi chọn thôn nhỏ nhất.',
          hieu: 'Vô Vi chọn thôn nhỏ nhất để trấn yêu.',
          d: 'Vô Vi đứng trên đỉnh núi, nhìn xuống Hạ Khê đang tắt đèn. "Dưới chân núi có thứ phải được ăn," ông nói, "ta chọn thôn nhỏ nhất vì nó ít người nhất để mất." Ông không xin bạn tha thứ, chỉ đợi bạn quyết định.',
          lc: [
            { key: 'doi_pha_tran', label: 'Đòi phá trận ngay trước mặt ông', kind: 'risk', mat: 'Một trận đấu không có người thắng.', flag: 'lat_doi_mat' },
            { key: 'de_ong_noi', label: 'Để ông nói hết, rồi quay đi', kind: 'safe', mat: 'Lời nói dối có lý, và một sự thật không ai muốn.', flag: 'lat_quay_di' }
          ] } }
    ],
    khong_ke_ac: { phan: 3, o: 'cao_trao', ten: 'Bạn thuở nhỏ chết già' },
    // Kết cục: chọn theo chuỗi kiểu lựa chọn (vt) ở TT.kb.ketKhuon.
    ket: {
      toan_ven: { t: 'Toàn vẹn', kv: 2, dk: { loai: 'nguoc', min: 3, tu_phan: 3, p6: 'hy_sinh' },
        log: '{ten} tu vi đã cạn, rót trà cho chính mình ở Hạ Khê, và đèn trong thôn sáng đủ.' },
      doa: { t: 'Đọa', kv: 0, xau: true, dk: { loai: 'dkd', phan: [4, 6] },
        log: '{ten} đẩy chén trà sang một đệ tử trẻ: "Còn nóng."' },
      co_doc: { t: 'Cô độc', kv: 1, xau: true, dk: { loai: 'con_lai' },
        log: 'Trên bàn còn bốn chén, và không ai ngồi.' }
    }
  });
})();
