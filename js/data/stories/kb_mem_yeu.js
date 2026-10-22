// Kịch bản khuyết điểm "Đạo đức dương (nhân hậu, mềm yếu)", 6 phần theo dàn cảnh bản 2 (Q-giong-truyen mục 4b). Chạm K2a (khung + chặng nhỏ); K2b viết chữ 6 cảnh cao trào.
// CÒN TODO K2b: 6 cảnh lớn (lon: true): a4 (Mảnh giấy), b4 (Đêm trước ngày lên nội môn), c4 (Phiên chấp pháp), d4 (Bút son), e4 (Đại hội toàn tông), f4 (Trận cuối).
//   Mỗi cảnh: d: 'TODO K2b: <tóm tắt>' và mọi lựa chọn có sau: 'TODO K2b' (không wheel). Cấu trúc (khi, can_gan_bo, canh, lc, key, label, kind, ax, fx, mat, toi, tre, wheel) đã đủ.
// CHƯA ĐĂNG KÝ vào D.STORY.kb.mem_long (để người chơi thật không gặp chữ TODO). K2b: khi hết TODO thì thêm dòng D.STORY.kb.mem_long = 'kb_mem_yeu' ở cuối tệp.
//
// Câu hỏi trung tâm: "Có nên im lặng trước cái ác để giữ cho nhiều người được yên?" Mục tiêu của bạn: học y đạo ở nội môn để chữa bệnh phổi cho {than_nhan} và trị dịch cho thôn dưới núi.
// Dàn: {su} = bóng tối (người hiền ký danh sách, ba mươi năm trước từng im như bạn sắp im); {doi_thu} = gương đối lập (đúng mà không biết thương); {huynh} = nạn nhân tin hệ thống;
//   {ban} + {than_nhan} = người chọn không biết để sống nổi (đám đông đồng lõa: "cả thôn sống nhờ cái tông ấy"); {thuong} = cháu của {su}, bị cuốn vào; {the_luc} = sức mạnh trần trụi trong mô phỏng.
//
// CHUỖI "VÌ... NÊN..." (nối từng phần):
//   P1 -> P2: vì {su} cứu mẹ bạn nên bạn nợ ơn, vì nợ ơn nên bạn tin {su} hơn tin mảnh giấy "cứu"; {su} cất mảnh giấy đi, nên chuyện không ai nhắc tới nhưng bạn đã thấy một lần.
//   P2 -> P3: vì bạn đã im ở đêm trước ngày lên nội môn nên {huynh} đi mà không biết, và bạn mang lá thư chữ của mình đi theo hắn; vì {huynh} không về nên {doi_thu} đi tìm sổ kho.
//   P3 -> P4: vì bạn nghi nhầm cha {doi_thu} nên phiên chấp pháp phế một người nửa vô tội; vì bạn làm chứng (hay im) nên {thuong}, cháu của {su}, nhận chăm bạn và bạn không thể coi {su} là người ngoài.
//   P4 -> P5: vì {su} chọn bạn kế nhiệm để trói bạn nên bạn ký (hay không ký) cây bút son; vì ký (hay không ký) nên phần 5 bạn còn (hay mất) đường lui và {the_luc} đòi gấp đôi.
//   P5 -> P6: vì lá thư có chữ bạn trở về tay mẹ {huynh} nên đại hội toàn tông không còn là chuyện của người khác; vì tố giác (hay kế nhiệm, hay ra tay) nên sơn môn vỡ, hoặc bạn ngồi vào ghế của {su}.
//   P6 -> kết: vì phần 5 nên phần 6 là trận chiến thật với {the_luc} hoặc một danh sách mới; vì bạn đã trả giá (hay đã né) ở các phần trước nên hình ảnh khép lại là đưa {vat} ra biển, xoa đầu đệ tử "đừng làm lớn chuyện", hoặc ngồi một mình.
//
// CÂU HỎI "SAO KHÔNG CỨ...?" VÀ CHỖ ĐÃ CHẶN:
//   - Sao không báo lên trên? Người ở trên chính là {su}: người duy nhất bạn tin lại là người ký danh sách (a4, d3).
//   - Sao không nói ngay cho {huynh}? Nói thì hắn tưởng bạn ghen (b4 'ke'), mà không có bằng chứng thì không ai tin (b3: nét son có thể giả).
//   - Sao không đem mảnh giấy cho {doi_thu} từ đầu? Bạn ghét hắn, còn {su} vừa cứu mẹ bạn: tin hắn là phản người ơn (a4).
//   - Sao {doi_thu} không tự đi kiện? Hắn cần nhân chứng, chỉ bạn từng thấy danh sách (c1); và sổ kho do cha chính hắn giữ nên hắn dễ bị coi là vu cáo (c3).
//   - Sao không bỏ trốn? Bạn đi thì thôn dưới núi mất người trị dịch, mẹ mất nguồn thuốc (a2, b2); bỏ đi mở kết cục "bỏ cuộc" (xấu) ở mọi phần.
//   - Sao không giết {su} ngay? Giết là đường tắt: thành kẻ phản sư, {thuong} mất, {the_luc} vẫn đòi người (e4).
//   - Sao không nhờ tông khác? Cả thôn sống nhờ tông này và {the_luc} đóng quân ở biên vùng: đổi tông là đổi chủ cho {the_luc} (b1, d2, e2).
//
// NHỊP: mỗi phần đủ móc (moc), leo thang (leo), đảo (dao), cao trào (cao_trao, lon), treo (treo); "thắng/vui thật" ở chặng ấm (am: true) mỗi phần, mồi giả ở c3 (nghi cha {doi_thu}), hé lộ ở d3,
//   chặng gặt lá thư (g_thu) ở phần 5, thử thách có hạn ở b2 và c2, ba kết cục tron/doa/co_doc cùng bo_cuoc.
// Kiểu lựa chọn cao trào: a4 tin ai; b4 nói hay im; c4 cứu ai; d4 làm gì khi có quyền; e4 bỏ gì; f4 đánh hay không (có vòng quay).
(function () {
  const D = window.TT.data;

  D.STORY.reg({
    id: 'kb_mem_yeu', n: 'Chiếc chăn và cây bút son', loai: 'kb',
    mo: { kd: 'mem_long' },
    vai: {
      huynh: { pick: 'dan:huynh' }, ban: { pick: 'dan:ban' }, su: { pick: 'dan:su' },
      doi_thu: { pick: 'dan:doi_thu' }, than_nhan: { pick: 'dan:than_nhan' }, thuong: { pick: 'dan:thuong' }
    },
    khe_kb: { the_luc: { the_luc: true }, vat: { vat: ['chan_day', 'giay_rom', 'kiem_go', 'chuoi_hat'] } },
    dau: 'a1',
    phan: [
      { id: 'p1', n: 'Chiếc chăn', tuoi: 12, moc: 'a1', leo: ['a2'], dao: 'a3', cao_trao: 'a4', treo: 'a5' },
      { id: 'p2', n: 'Danh sách', tuoi: 18, moc: 'b1', leo: ['b2'], dao: 'b3', cao_trao: 'b4', treo: 'b5' },
      { id: 'p3', n: 'Nhân chứng', tuoi: 25, moc: 'c1', leo: ['c2'], dao: 'c3', cao_trao: 'c4', treo: 'c5' },
      { id: 'p4', n: 'Hòa khí', tuoi: 35, moc: 'd1', leo: ['d2'], dao: 'd3', cao_trao: 'd4', treo: 'd5' },
      { id: 'p5', n: 'Tất cả đã mất', tuoi: 50, moc: 'e1', leo: ['e2'], dao: 'e3', cao_trao: 'e4', treo: 'e5' },
      { id: 'p6', n: 'Biển', tuoi: 70, moc: 'f1', leo: ['f2'], dao: 'f3', cao_trao: 'f4', treo: 'f5' }
    ],
    chang: {
      // ================= PHẦN 1: CHIẾC CHĂN (12 đến 18) =================
      a1: {
        t: 'Đêm đầu ở ngoại môn', am: true,
        d: 'Mười đứa trẻ nằm chung một phản, gió lùa qua khe ván. {huynh} đẩy sang phía bạn {vat} hắn mang từ nhà: "Ta quen lạnh rồi." Trong ngực áo bạn là lá thư chiều nay của thầy lang, nói bệnh phổi của {than_nhan} đã ra máu.',
        khi: { sau: 0 }, han: 6, mac: 'nhan',
        lc: [
          { key: 'nhan', label: 'Nhận lấy, hứa sẽ trả hắn một thứ tốt hơn', kind: 'safe', ax: { daoduc: 1 }, fx: { gan_bo: { dan: 'huynh', d: 2 }, vat: '@vat', flag: 'hua_vat' }, mat: 'Một lời hứa.', toi: 'a2' },
          { key: 'chung', label: 'Kéo hắn vào đắp chung', kind: 'help', ax: { tinh: 1 }, fx: { gan_bo: { dan: 'huynh', d: 1 } }, toi: 'a2' }
        ]
      },
      a2: {
        t: 'Món nợ thuốc',
        d: '{su} gọi bạn ra sau buổi học. Ông đã nghe chuyện nhà bạn, và đặt xuống bàn một gói thuốc có giá bằng nửa năm bổng lộc. "Cầm lấy. Việc của con cứ học cho tốt." Ông không nhắc lại lần nào.',
        khi: { sau: 6 }, han: 6, mac: 'nhan_on',
        lc: [
          { key: 'nhan_on', label: 'Nhận thuốc, cúi đầu tạ ơn', kind: 'safe', ax: { xuthe: 1 }, fx: { gan_bo: { dan: 'su', d: 2 }, no: { dan: 'su', d: 3 }, flag: 'nhan_on_su' }, mat: 'Một món nợ ân. Người cho không đòi, nhưng người nhận biết.', toi: 'a3' },
          { key: 'tu_lo', label: 'Từ chối, tự tìm cách', kind: 'pay', ax: { tudung: 1 }, fx: { daoTam: -1, flag: 'tu_lo_thuoc' }, mat: 'Mẹ bạn có thể không đợi được.', toi: 'a2b' }
        ]
      },
      a2b: {
        t: 'Cơn ho đêm',
        d: 'Thư thứ hai tới, nét chữ vội. {than_nhan} không ngủ được vì ho, thầy lang bảo chỉ còn một cách. Bạn nhìn sang phòng {su}, đèn vẫn sáng.',
        khi: { sau: 1 }, han: 6, mac: 'quay_lai',
        lc: [
          { key: 'quay_lai', label: 'Đến xin gói thuốc hôm trước', kind: 'safe', ax: { xuthe: 1 }, fx: { gan_bo: { dan: 'su', d: 2 }, no: { dan: 'su', d: 3 }, flag: 'nhan_on_su' }, mat: 'Lời từ chối ban đầu, và một chút tự trọng.', toi: 'a3' },
          { key: 'chiu', label: 'Viết thư bảo mẹ cố nhịn, chờ bạn học xong', kind: 'safe', ax: { tudung: 1 }, fx: { daoTam: -2, flag: 'tu_lo_thuoc' }, mat: 'Thêm một mùa đông cho {than_nhan}.', toi: 'a3' }
        ]
      },
      a3: {
        t: 'Đôi giày bỏ quên',
        d: 'Quét phòng cuối dãy, bạn thấy đôi giày của một đệ tử vừa "lên nội môn", đất đỏ ngoài cổng còn bám ở mũi. Trong lót giày có mảnh giấy gấp tư, một chữ viết vội: "cứu". Bạn chưa kể với ai.',
        khi: { sau: 12 }, han: 6, mac: 'giu',
        lc: [
          { key: 'giu', label: 'Cất mảnh giấy vào ngực áo', kind: 'safe', ax: { tinh: 1 }, fx: { flag: 'co_giay' }, mat: 'Một bí mật bạn không đủ sức giữ.', toi: 'a4' },
          { key: 'hoi_huynh', label: 'Đưa cho {huynh} xem', kind: 'help', ax: { daoduc: 1 }, fx: { gan_bo: { dan: 'huynh', d: 1 }, flag: 'huynh_biet' }, mat: 'Thêm một người cùng biết, thêm một người cùng sợ.', toi: 'a4' }
        ]
      },
      a4: {
        t: 'Mảnh giấy', lon: true, canh: { gio: 'dem', thoi_tiet: 'mua' },
        d: 'TODO K2b: Đêm mưa đầu mùa, bạn cầm mảnh giấy "cứu" và phải chọn tin ai: đưa {su} (người vừa cứu mẹ bạn), giấu đi chờ xem, hay đưa {doi_thu}, kẻ bạn ghét nhưng đang âm thầm tìm chuyện này. Đồng hồ: sáng mai có đợt "lên nội môn" mới.',
        khi: { sau: 18 }, han: 6, mac: 'giau',
        lc: [
          { key: 'dua_su', label: 'Đưa {su}', kind: 'safe', ax: { xuthe: 1 }, fx: { gan_bo: { dan: 'su', d: 1 }, flag: 'dua_giay' }, mat: 'Mảnh giấy này, và niềm tin duy nhất bạn có vào người đã cứu mẹ bạn.', sau: 'TODO K2b', toi: 'a4w' },
          { key: 'giau', label: 'Giấu đi, chờ xem', kind: 'safe', ax: { tinh: 1 }, fx: { flag: 'giau_giay' }, mat: 'Thời gian, và có thể một người trong danh sách.', sau: 'TODO K2b', toi: 'a4w' },
          { key: 'dua_doi_thu', label: 'Đưa {doi_thu}', kind: 'risk', ax: { daoduc: 1, xuthe: -2 }, fx: { gan_bo: { dan: 'doi_thu', d: 2 }, flag: 'dua_doi_thu', rel: { vai: 'su', d: -5 } }, mat: 'Người ơn của bạn sẽ coi đó là phản bội.', sau: 'TODO K2b', toi: 'a5' }
        ]
      },
      a4w: {
        t: 'Cái Tết ở ngoại môn', am: true,
        d: 'Tin từ thôn: {than_nhan} ăn được cháo, ho ít đi. Đêm giao thừa cả phòng góp mỗi người một nắm gạo nấu chung một nồi, {huynh} diễn trò làm mọi người cười đến rớt nước mắt.',
        khi: { sau: 2 }, han: 6, mac: 'ngoi_lai',
        lc: [
          { key: 'ngoi_lai', label: 'Ngồi lại cùng mọi người đến sáng', kind: 'help', ax: { tinh: 1 }, fx: { gan_bo: { dan: 'huynh', d: 1 }, daoTam: 1 }, toi: 'a5' },
          { key: 'viet_thu', label: 'Viết thư báo tin vui cho {than_nhan}', kind: 'safe', ax: { daoduc: 1 }, fx: { gan_bo: { dan: 'than_nhan', d: 1 } }, toi: 'a5' }
        ]
      },
      a5: {
        t: 'Một trò đùa của đệ tử nghịch',
        d: 'Mảnh giấy không còn trong tay bạn. Nếu {su} đã nhận, ông cười: "Trò đùa của đệ tử nghịch." Từ hôm ấy {doi_thu} nhìn bạn bằng nửa con mắt, như nhìn một người đã chọn xong.',
        d_neu: [
          { flag: 'dua_giay', d: '{su} xem mảnh giấy, cười nhẹ: "Trò đùa của đệ tử nghịch." Ông cất vào tay áo. Từ hôm ấy {doi_thu} nhìn bạn bằng nửa con mắt, như nhìn một người đã chọn xong.' },
          { flag: 'dua_doi_thu', d: '{doi_thu} cầm mảnh giấy, không cảm ơn. {su} gọi bạn lên, hỏi rất nhẹ: "Con có điều gì muốn nói với thầy không?"' },
          { flag: 'giau_giay', d: 'Mảnh giấy trong ngực áo bạn nặng thêm mỗi ngày. {doi_thu} hình như đã biết bạn đang giấu gì.' }
        ],
        khi: { sau: 4 }, han: 6, mac: 'quen',
        lc: [
          { key: 'nghi', label: 'Nghi, nhưng chưa nói ra', kind: 'safe', ax: { tinh: 1 }, fx: { flag: 'nghi_su' }, mat: 'Từ nay mỗi lần {su} cười, bạn đều phải nhớ.', toi: 'b1' },
          { key: 'quen', label: 'Tự bảo đó chỉ là trò đùa', kind: 'safe', ax: { daoduc: -1 }, fx: { flag: 'quen_chuyen' }, mat: 'Một câu hỏi bạn đã chọn không hỏi.', toi: 'b1' },
          { key: 'bo_di', label: 'Rời tông, về thôn', kind: 'flee', ax: { tudung: -2 }, fx: { tong: { truc_xuat: true } }, mat: 'Con đường học y, và nguồn thuốc của mẹ.', toi: 'ket:bo_cuoc' }
        ]
      },

      // ================= PHẦN 2: DANH SÁCH (18 đến 25) =================
      b1: {
        t: 'Dịch dưới chân núi',
        d: 'Tin từ thôn: dịch sốt quét qua, ba nhà đầu làng đóng cửa. Trên biên vùng {the_luc} đóng quân, đường xuống núi bị chặn nửa ngày. {ban} nhờ người nhắn: "Làng cần thầy thuốc, không cần tiên."',
        khi: { sau: 0 }, han: 6, mac: 'o_lai',
        lc: [
          { key: 've_thon', label: 'Xin phép về thôn giúp dân', kind: 'help', ax: { daoduc: 1 }, fx: { gan_bo: { dan: 'ban', d: 2 }, flag: 've_thon' }, mat: 'Một mùa tu luyện, và có thể đợt chọn lên nội môn năm nay.', toi: 'b2' },
          { key: 'o_lai', label: 'Ở lại tông, gửi bạc và thuốc về', kind: 'safe', ax: { xuthe: 1 }, fx: { gold: -30, flag: 'o_lai_tong' }, mat: 'Bạn không có mặt khi {ban} cần.', toi: 'b2' }
        ]
      },
      b2: {
        t: 'Học y cho đến nơi',
        d: 'Thầy lang già dưới thôn dạy bạn được nửa mùa rồi mất tiếng. Sách y của ông vẫn còn, cần mua hoặc cần tự học; hạn hai năm trước khi dịch quay lại. Nửa thôn sống hay chết tùy bạn có đủ tay nghề hay không.',
        khi: { sau: 3 }, han: 6, mac: 'xin_su',
        lc: [
          { key: 'hoc_y', label: 'Học y thuật cho đến nơi', kind: 'safe', ax: { tudung: 2 }, mat: 'Hai năm bạn hầu như không tu được. Trượt thì dịch quay lại, thôn đón nó không có thuốc.', thu_thach: { can: { nghe: { id: 'y_su', lv: 1 } }, han: 24, dat: 'b2w', truot: 'b2x' } },
          { key: 'mua_sach', label: 'Mua trọn bộ sách y của lão thầy lang', kind: 'pay', ax: { tudung: 1 }, mat: 'Số bạc dành dụm bao năm, và hạn hai năm vẫn không đổi.', thu_thach: { can: { gold: 150 }, han: 24, tieu: true, dat: 'b2w', truot: 'b2x' } },
          { key: 'xin_su', label: 'Nhờ {su} gửi thuốc về thay bạn', kind: 'safe', ax: { xuthe: 1 }, fx: { no: { dan: 'su', d: 2 }, flag: 'nhan_thuoc_su' }, mat: 'Thêm một món ân. Và thôn sẽ chỉ nhớ tên {su}.', toi: 'b3' }
        ]
      },
      b2w: {
        t: 'Thôn qua dịch', am: true,
        d: 'Mùa dịch qua, nhà nào cũng còn người. Bà lão đầu làng mang ra một rổ trứng gà, bảo "thầy nhỏ" ăn lấy sức. {ban} ngồi cạnh bạn trên bậc cửa, không nói gì, cho đến khi trời tối.',
        khi: { sau: 1 }, han: 6, mac: 'nhan_trung',
        lc: [
          { key: 'nhan_trung', label: 'Nhận rổ trứng, chia cho cả xóm', kind: 'help', ax: { daoduc: 1 }, fx: { gan_bo: { dan: 'ban', d: 2 }, daoTam: 2, flag: 'cuu_thon' }, toi: 'b3' },
          { key: 'ngoi_im', label: 'Ngồi cạnh {ban} đến khuya', kind: 'safe', ax: { tinh: 1 }, fx: { gan_bo: { dan: 'ban', d: 2 }, flag: 'cuu_thon' }, toi: 'b3' }
        ]
      },
      b2x: {
        t: 'Dịch quay lại',
        d: 'Hạn đã hết, bạn chưa đủ tay nghề. Tin từ thôn: dịch trở lại, mười hai nhà có người nằm. {ban} không trách, chỉ nhắn bạn đừng về kẻo lây.',
        khi: { sau: 0 }, han: 6, mac: 'chiu',
        lc: [
          { key: 'chiu', label: 'Ở lại, tự nhủ năm sau sẽ khác', kind: 'safe', ax: { tinh: 1 }, fx: { daoTam: -2, flag: 'tuot_y' }, mat: 'Một phần thôn đã chờ bạn mà không đợi được.', toi: 'b3' },
          { key: 've_cung', label: 'Về thôn ngay, dù không còn kịp', kind: 'help', ax: { daoduc: 1 }, fx: { gan_bo: { dan: 'ban', d: 2 }, daoTam: -1, flag: 'tuot_y' }, mat: 'Đường tu của bạn lại chậm thêm một mùa.', toi: 'b2w' }
        ]
      },
      b3: {
        t: 'Danh sách trong thư phòng',
        d: 'Dọn thư phòng, bạn thấy cuốn danh sách đệ tử "được chọn lên nội môn" suốt ba mươi năm. Tên {huynh} ở dòng thứ bảy, son của {su}, nhưng nét son loang, như có ai bắt chước. {doi_thu} đứng ngoài cửa sổ, cũng đang nhìn.',
        khi: { sau: 12 }, han: 6, mac: 'chep',
        lc: [
          { key: 'chep', label: 'Chép lại tên các đệ tử', kind: 'risk', ax: { daoduc: 1 }, fx: { flag: 'co_ban_chep' }, mat: 'Nếu bị bắt gặp, bạn không có lời nào để giải thích.', toi: 'b4' },
          { key: 'hoi_doi_thu', label: 'Hỏi thẳng {doi_thu} đang tìm gì', kind: 'help', ax: { xuthe: -1 }, fx: { gan_bo: { dan: 'doi_thu', d: 1 }, flag: 'doi_thu_biet' }, mat: 'Một người bạn không ưa sẽ biết bạn cũng đã biết.', toi: 'b4' }
        ]
      },
      b4: {
        t: 'Đêm trước ngày lên nội môn', lon: true, canh: { gio: 'dem', thoi_tiet: 'mua' },
        can_gan_bo: { dan: 'huynh', min: 3 },
        d: 'TODO K2b: Mưa đầu mùa, đêm cuối ở ngoại môn. {huynh} gói đồ (đôi giày rơm mẹ hắn đan, cái lược gãy răng) và nhờ bạn viết thư về cho mẹ hắn; chiều nay bạn đã thấy tên hắn ở dòng thứ bảy, sáu cái tên bên trên chưa ai gửi thư về. Chọn nói hay im; sáng mai hắn đi.',
        khi: { sau: 12 }, han: 6, mac: 'viet',
        lc: [
          { key: 'viet', label: 'Viết nốt, gấp thư lại, đưa hắn', kind: 'safe', ax: { daoduc: -1, xuthe: 1 }, fx: { flag: ['thu_chu_ban', 'im_danh_sach'], no: { dan: 'huynh', d: 5 } },
            mat: 'Giữ hòa khí. Lá thư này sẽ về tới thôn, cùng với một thứ khác.', sau: 'TODO K2b', toi: 'b5' },
          { key: 'ke', label: 'Đặt bút xuống, kể cho hắn về tờ danh sách', kind: 'risk', ax: { daoduc: 2, xuthe: -2 }, fx: { flag: 'ke_danh_sach', gan_bo: { dan: 'huynh', d: 2 }, rel: { vai: 'su', d: -20 } },
            mat: 'Hắn có thể không tin. {su} sẽ biết là bạn đã nói.', sau: 'TODO K2b', toi: 'b5' },
          { key: 'tron', label: 'Xé thư, bảo hắn đêm nay trốn khỏi tông', kind: 'risk', ax: { daoduc: 3, tinh: -2 }, gate: { truc: 'tinh', max: 6, why: 'Bạn quá nhẫn nhịn để làm một việc liều như thế.' },
            fx: { flag: 'tron_cung', tong: { truy: true }, gan_bo: { dan: 'huynh', d: 3 } }, mat: 'Đào tẩu đệ tử bị truy. Bạn là người cuối cùng thấy hắn.', sau: 'TODO K2b', toi: 'ket:bo_cuoc' }
        ]
      },
      b5: {
        t: 'Hắn không về',
        d: 'Mùa lúa chín, thư từ thôn lên hỏi tin {huynh}. Bạn đứng ở cổng ngoại môn rất lâu, cổng nội môn không ai ra, không ai vào. {doi_thu} đi ngang, không nhìn bạn, chỉ nói đủ để bạn nghe: "Ta sẽ tìm cho ra."',
        khi: { sau: 6 }, han: 6, mac: 'cho',
        lc: [
          { key: 'cho', label: 'Chờ thêm một mùa', kind: 'safe', ax: { tinh: 1 }, fx: { flag: 'cho_huynh' }, mat: 'Một mùa nữa, và thêm một lá thư không có hồi âm.', toi: 'c1' },
          { key: 'hoi_su', label: 'Hỏi {su} thẳng', kind: 'risk', ax: { daoduc: 1 }, fx: { rel: { vai: 'su', d: -6 }, flag: 'hoi_su_som' }, mat: '{su} sẽ trả lời bằng nụ cười quen thuộc.', toi: 'c1' },
          { key: 'bo_di', label: 'Rời tông đi tìm hắn', kind: 'flee', ax: { daoduc: 1, tudung: -2 }, fx: { tong: { truc_xuat: true } }, mat: 'Tất cả những gì bạn đã học ở đây.', toi: 'ket:bo_cuoc' }
        ]
      },

      // ================= PHẦN 3: NHÂN CHỨNG (25 đến 35) =================
      c1: {
        t: 'Sổ kho',
        d: '{doi_thu} tìm bạn sau buổi học, giọng thấp: hắn có bằng chứng, và nó dẫn tới sổ kho do cha hắn giữ. "Ta biết ngươi thấy danh sách. Ta cần một nhân chứng, không cần một người bạn."',
        khi: { sau: 0 }, han: 6, mac: 'nghe',
        lc: [
          { key: 'nghe', label: 'Nghe hắn nói hết', kind: 'safe', ax: { xuthe: -1 }, fx: { gan_bo: { dan: 'doi_thu', d: 1 }, flag: 'nghe_doi_thu' }, mat: 'Một buổi chiều, và một cái tên bạn không còn quên được.', toi: 'c2' },
          { key: 'tranh', label: 'Bảo hắn đừng kéo bạn vào', kind: 'safe', ax: { xuthe: 2 }, fx: { rel: { vai: 'doi_thu', d: -6 }, flag: 'tranh_doi_thu' }, mat: 'Hắn sẽ đi tìm người khác, hoặc đi một mình.', toi: 'c3' }
        ]
      },
      c2: {
        t: 'Ba bằng chứng',
        d: 'Muốn lên tiếng phải có ba thứ: sổ xuất kho, lời người coi kho cũ, và bản đối chiếu. Mỗi thứ tốn tiền, tốn công, tốn cả nguy cơ bị phát hiện. {doi_thu} chỉ đủ sức lo một thứ; hắn nhìn bạn không chớp mắt.',
        khi: { sau: 3 }, han: 6, mac: 'dung_ngoai',
        lc: [
          { key: 'gom', label: 'Cùng hắn gom đủ trong ba năm', kind: 'help', ax: { daoduc: 1 }, mat: 'Ba năm bổng lộc, và nhiều đêm mất ngủ.', thu_thach: { can: { gold: 200 }, han: 36, tieu: true, dat: 'c3', truot: 'c2x' } },
          { key: 'dung_ngoai', label: 'Giao hết cho {doi_thu}, bạn đứng ngoài', kind: 'safe', ax: { xuthe: 2 }, fx: { rel: { vai: 'doi_thu', d: -3 }, flag: 'dung_ngoai' }, mat: 'Nếu hắn thất bại, bạn không có quyền trách.', toi: 'c3' }
        ]
      },
      c2x: {
        t: 'Thiếu một mảnh',
        d: 'Hạn đã hết, bạn thiếu một bằng chứng. {doi_thu} không nói gì, chỉ cuộn sổ lại, nhìn bạn như nhìn một cái ghế trống.',
        khi: { sau: 0 }, han: 6, mac: 'lam_tiep',
        lc: [
          { key: 'lam_tiep', label: 'Cùng hắn liều đi tiếp với hai bằng chứng', kind: 'risk', ax: { daoduc: 1, tinh: -1 }, fx: { flag: 'thieu_chung', rep: { danh: -1 } }, mat: 'Một vụ kiện có thể sụp ngay khi mở.', toi: 'c3' },
          { key: 'dung', label: 'Nói thẳng là bạn dừng ở đây', kind: 'safe', ax: { xuthe: 1 }, fx: { rel: { vai: 'doi_thu', d: -8 }, flag: 'dung_ngoai' }, mat: 'Một người từng tin bạn một lần.', toi: 'c3' }
        ]
      },
      c3: {
        t: 'Cha của hắn',
        d: 'Sổ kho đối chiếu xong, và người ký xuất kho là cha của {doi_thu}, chấp sự kho. {doi_thu} ngồi lặng rất lâu: "Có thể ông ấy bị ép." Hắn nói như tự nhủ. Chỉ có hai người trong phòng dám nhìn thẳng vào cái tên ấy.',
        khi: { sau: 12 }, han: 6, mac: 'tin',
        lc: [
          { key: 'tin', label: 'Tin hắn, vì hắn dám đứng ra', kind: 'help', ax: { daoduc: 1 }, fx: { gan_bo: { dan: 'doi_thu', d: 2 }, flag: 'tin_doi_thu' }, mat: 'Nếu hắn sai, bạn là người cùng sai.', toi: 'c4' },
          { key: 'nghi_cha', label: 'Nói: bằng chứng chưa đủ để chỉ vào cha hắn', kind: 'safe', ax: { xuthe: 1 }, fx: { flag: 'nghi_cha' }, mat: 'Hắn sẽ tự hỏi vì sao bạn nghi cha hắn mà không nghi ai khác.', toi: 'c4' }
        ]
      },
      c4: {
        t: 'Phiên chấp pháp', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
        can_gan_bo: { dan: 'doi_thu', min: 3 },
        d: 'TODO K2b: Phiên chấp pháp toàn tông. {doi_thu} bị buộc tội vu cáo cha mình; chỉ bạn từng thấy danh sách và đủ bằng chứng để làm chứng. Làm chứng thì cứu {doi_thu} nhưng cha hắn (vô tội một nửa) bị phế; im thì {doi_thu} bị phế tu vi. Chọn cứu ai.',
        khi: { sau: 12 }, han: 6, mac: 'im',
        lc: [
          { key: 'lam_chung', label: 'Làm chứng, nói hết điều bạn thấy', kind: 'risk', ax: { daoduc: 2, xuthe: -2 }, fx: { gan_bo: { dan: 'doi_thu', d: 3 }, flag: 'lam_chung_doi_thu', rel: { vai: 'su', d: -8 } },
            mat: 'Cha {doi_thu}, vô tội một nửa, sẽ bị phế. {su} sẽ biết bạn đứng về phía nào.', sau: 'TODO K2b', toi: 'c4w' },
          { key: 'im', label: 'Im lặng, nhìn xuống chân', kind: 'safe', ax: { daoduc: -1 }, fx: { roi: { dan: 'doi_thu' }, no: { dan: 'doi_thu', d: 6 }, flag: 'im_phien' },
            mat: '{doi_thu} bị phế tu vi và rời tông. Hắn sẽ biết bạn đã không nói.', sau: 'TODO K2b', toi: 'c5' },
          { key: 'noi_nua', label: 'Nói một nửa sự thật', kind: 'safe', ax: { xuthe: 1 }, fx: { no: { dan: 'doi_thu', d: 3 }, flag: 'noi_nua' },
            mat: 'Cả hai đều mất một nửa, và không ai thật sự biết bạn đứng ở đâu.', sau: 'TODO K2b', toi: 'c5' }
        ]
      },
      c4w: {
        t: 'Vò rượu', am: true,
        d: 'Tối ấy, {doi_thu} xách một vò rượu lên mái nhà ngoại môn, đặt xuống cạnh bạn. Hai người ghét nhau suốt từ ngày đầu uống chung một chén, không nói chuyện gì. Lần đầu bạn thấy hắn cười.',
        khi: { sau: 1 }, han: 6, mac: 'uong',
        lc: [
          { key: 'uong', label: 'Cạn chén, ngồi lại đến khi trăng lặn', kind: 'help', ax: { tinh: 1 }, fx: { gan_bo: { dan: 'doi_thu', d: 2 }, daoTam: 2 }, toi: 'c5' },
          { key: 'ke', label: 'Kể cho hắn nghe chiếc chăn của {huynh}', kind: 'safe', ax: { daoduc: 1 }, fx: { gan_bo: { dan: 'doi_thu', d: 1 } }, toi: 'c5' }
        ]
      },
      c5: {
        t: 'Bát cháo của {thuong}',
        d: 'Bạn ốm nhiều ngày sau phiên ấy. {thuong}, cháu của {su}, xuống chăm, mang bát cháo và không nói nhiều. Bạn chưa kịp nghĩ ra vì sao người này tử tế với mình.',
        d_neu: [{ flag: 'im_phien', d: '{doi_thu} đã rời tông trong đêm, không ai ra tiễn. Chỉ có {thuong}, cháu của {su}, mang bát cháo tới, không hỏi gì.' }],
        khi: { sau: 3 }, han: 6, mac: 'nhan',
        lc: [
          { key: 'nhan', label: 'Nhận bát cháo, cảm ơn', kind: 'safe', ax: { daoduc: 1 }, fx: { gan_bo: { dan: 'thuong', d: 2 }, flag: 'quen_thuong' }, mat: 'Người này là cháu của {su}; từ nay bạn phải nhớ điều đó.', toi: 'd1' },
          { key: 'tranh', label: 'Tránh mặt, bảo mình cần tĩnh dưỡng', kind: 'safe', ax: { xuthe: 1 }, fx: { flag: 'tranh_thuong' }, mat: 'Một người tử tế, và có thể một cơ hội.', toi: 'd1' },
          { key: 'bo_di', label: 'Rời tông, đi theo {doi_thu}', kind: 'flee', ax: { daoduc: 1, tudung: -2 }, fx: { tong: { truc_xuat: true } }, mat: 'Y đạo bạn học đến nửa đường.', toi: 'ket:bo_cuoc' }
        ]
      },

      // ================= PHẦN 4: HÒA KHÍ (35 đến 50) =================
      d1: {
        t: 'Áo nội môn',
        d: 'Mười năm sau bạn mặc áo nội môn, trị bệnh cho cả sơn môn; người ta gọi bạn là thầy thuốc hiền nhất tông. {su} chọn bạn kế nhiệm. {thuong} đưa bạn xem ngày lành.',
        khi: { sau: 0 }, han: 6, mac: 'nhan',
        lc: [
          { key: 'nhan', label: 'Nhận lời kế nhiệm, định ngày cưới', kind: 'safe', ax: { xuthe: 1 }, fx: { gan_bo: { dan: 'thuong', d: 2 }, flag: 'nhan_ke_nhiem' }, mat: 'Đứng ở chỗ người ta muốn bạn đứng.', toi: 'd2' },
          { key: 'hoan', label: 'Xin hoãn, bảo mình chưa xứng', kind: 'safe', ax: { tinh: 1 }, fx: { flag: 'hoan_ke_nhiem' }, mat: 'Một lời hứa với {thuong}; {su} sẽ nhớ sự do dự này.', toi: 'd3' }
        ]
      },
      d2: {
        t: 'Người đòi gấp đôi',
        d: '{the_luc} đòi gấp đôi số đệ tử "chọn" nộp lên vì chiến sự ở biên vùng. {su} im lặng suốt buổi họp, rồi nhìn sang bạn.',
        khi: { sau: 12 }, han: 6, mac: 'giu_im',
        lc: [
          { key: 'doi_xem', label: 'Nói với {su} bạn muốn xem danh sách', kind: 'risk', ax: { daoduc: 1 }, fx: { flag: 'doi_xem_ds', rel: { vai: 'su', d: -5 } }, mat: '{su} sẽ biết bạn đã biết từ lâu.', toi: 'd3' },
          { key: 'giu_im', label: 'Giữ im, chờ họp xong', kind: 'safe', ax: { daoduc: -1 }, fx: { flag: 'giu_im_hop' }, mat: 'Một cái gật đầu ngầm.', toi: 'd3' }
        ]
      },
      d3: {
        t: 'Con hiểu ta mà',
        d: '{su} rót trà, hỏi bạn có muốn nghe một chuyện cũ không. Ba mươi năm trước, cái tên đầu tiên trên danh sách là huynh đệ thân nhất của ông; ông im lặng, và tông còn. Ông kể bằng giọng người đọc sổ chợ. "Con hiểu ta mà. Ta chưa từng làm ai đau."',
        khi: { sau: 12 }, han: 6, mac: 'nghe',
        lc: [
          { key: 'nghe', label: 'Nghe đến hết', kind: 'safe', ax: { tinh: 1 }, fx: { flag: 'nghe_su_ke' }, mat: 'Từ giờ bạn không còn quyền nói mình không biết.', toi: 'd4' },
          { key: 'hoi_dong', label: 'Hỏi: những người ở dòng thứ bảy đã đi đâu?', kind: 'risk', ax: { daoduc: 2 }, fx: { rel: { vai: 'su', d: -10 }, flag: 'hoi_su' }, mat: '{su} sẽ trả lời, bằng sự bình thản đáng sợ.', toi: 'd4' }
        ]
      },
      d4: {
        t: 'Bút son', lon: true, canh: { gio: 'hoang_hon' },
        d: 'TODO K2b: {su} đặt trước bạn cuốn danh sách đệ tử và cây bút son; tên đầu tiên trong danh sách kỳ này là một đứa trẻ bạn từng chữa dịch. {the_luc} đóng quân ở biên vùng, tông cần hứa với họ một số người ("tông còn thì ngàn người còn"). Chọn làm gì khi có quyền: ký / ký nhưng đổi tên / không ký.',
        khi: { sau: 12 }, han: 6, mac: 'ky',
        lc: [
          { key: 'ky', label: 'Ký', kind: 'safe', ax: { daoduc: -2 }, fx: { flag: 'da_ky', gan_bo: { dan: 'su', d: 2 }, vat: { mat: '@vat' } }, mat: 'Một cái tên, và vật bạn giữ từ thuở nhỏ.', sau: 'TODO K2b', toi: 'd4w' },
          { key: 'doi_ten', label: 'Ký, nhưng đổi tên đứa trẻ bạn từng chữa bằng một cái tên khác', kind: 'risk', ax: { daoduc: 2, xuthe: -1 }, fx: { flag: 'doi_ten_tre', tong: { giang: true }, gan_bo: { dan: 'thuong', d: 1 } }, mat: 'Ghế nội môn. Và một người khác sẽ thế chỗ đứa trẻ.', sau: 'TODO K2b', toi: 'd4w' },
          { key: 'khong_ky', label: 'Đặt bút xuống', kind: 'risk', ax: { daoduc: 3, xuthe: -2 }, fx: { flag: 'khong_ky', tong: { truc_xuat: true } }, mat: 'Tông, ghế, và người thầy nuôi bạn.', sau: 'TODO K2b', toi: 'd5' }
        ]
      },
      d4w: {
        t: 'Áo mới của mẹ', am: true,
        d: 'Ngày về thôn, {than_nhan} sờ lên vạt áo nội môn của bạn, cười hiền: "Ừ, áo này ấm." Bà không hỏi bạn làm gì ở trên ấy, chỉ rót nước sôi pha nước mật ong.',
        khi: { sau: 1 }, han: 6, mac: 'ngoi',
        lc: [
          { key: 'ngoi', label: 'Ngồi cạnh bà đến khi bà ngủ', kind: 'help', ax: { daoduc: 1 }, fx: { gan_bo: { dan: 'than_nhan', d: 2 } }, toi: 'd5' },
          { key: 'ke', label: 'Kể bà nghe về {thuong}', kind: 'safe', ax: { tinh: 1 }, fx: { gan_bo: { dan: 'than_nhan', d: 1 }, daoTam: 1 }, toi: 'd5' }
        ]
      },
      d5: {
        t: 'Đèn ở thư phòng',
        d: 'Tin từ biên vùng: {the_luc} đã nâng giá. Đêm ấy {su} không gọi bạn, và đèn thư phòng sáng đến gần sáng.',
        d_neu: [{ flag: 'khong_ky', d: '{su} không gọi bạn nữa. Ông đang gặp người khác ở thư phòng, và đèn ở phòng {thuong} tắt từ sớm.' }],
        khi: { sau: 4 }, han: 6, mac: 'nhin',
        lc: [
          { key: 'nhin', label: 'Nhìn, chưa làm gì', kind: 'safe', ax: { tinh: 1 }, fx: { flag: 'nhin_im' }, mat: 'Thêm một mùa cho cả hai phía cùng chờ.', toi: 'e1' },
          { key: 'tim_thuong', label: 'Tìm {thuong} nói chuyện', kind: 'help', ax: { daoduc: 1 }, fx: { gan_bo: { dan: 'thuong', d: 2 } }, mat: 'Một câu chuyện có thể không còn đường quay lại.', toi: 'e1' },
          { key: 'bo_di', label: 'Rời tông trong đêm', kind: 'flee', ax: { tudung: -2 }, fx: { tong: { truc_xuat: true } }, mat: 'Bao nhiêu năm bạn dựng danh tiếng ở đây.', toi: 'ket:bo_cuoc' }
        ]
      },

      // ================= PHẦN 5: TẤT CẢ ĐÃ MẤT (50 đến 70) =================
      e1: {
        t: 'Gói di vật',
        d: 'Mẹ của {huynh} mang lên tông gói di vật hắn gửi về, cả {vat} đã bạc màu. Bà không biết chữ; lá thư bà cất kỹ nhất, bà nhờ bạn đọc cho bà nghe.',
        khi: { sau: 0 }, han: 6, mac: 'nhan_goi',
        lc: [
          { key: 'nhan_goi', label: 'Nhận gói di vật, hẹn đọc thư cho bà', kind: 'safe', ax: { daoduc: 1 }, fx: { flag: 'nhan_goi_vat' }, mat: 'Một lá thư, và giọng bạn đọc nó.', tre: [{ sau: [6, 18], chang: 'g_thu', log: 'Mẹ {huynh} lại tới, tay cầm lá thư gấp vuông vức.' }], toi: 'e2' },
          { key: 'nho_ai', label: 'Nhờ một đệ tử khác đọc thay', kind: 'safe', ax: { xuthe: 1 }, fx: { flag: 'nho_doc_thu' }, mat: 'Một người lạ sẽ đọc chữ của bạn cho bà.', tre: [{ sau: [6, 18], chang: 'g_thu', log: 'Mẹ {huynh} lại tới, tay cầm lá thư gấp vuông vức.' }], toi: 'e2' }
        ]
      },
      g_thu: {
        t: 'Lá thư cũ',
        d: 'Bạn mở lá thư ra: nét chữ bạn quen. Bà ngồi đối diện, hai tay đặt trên đầu gối, chờ.',
        d_neu: [
          { flag: 'thu_chu_ban', d: 'Bạn mở lá thư ra. Nét chữ chính tay bạn viết đêm mưa năm xưa: "Con được ăn cơm trắng. Sang năm con về đưa mẹ đi xem biển." Bà ngồi nghe, tay vuốt mép áo, thỉnh thoảng gật đầu như nghe tin vui.' },
          { flag: 'ke_danh_sach', d: 'Lá thư chỉ có hai dòng, nét chữ của {huynh}: "Ngươi nói đúng. Ta chỉ chậm một đêm." Bà nhìn bạn, không hiểu, chờ bạn giải thích.' }
        ],
        khi: { sau: 0 }, han: 6, mac: 'im',
        lc: [
          { key: 'tra_vat', label: 'Giữ lời hứa năm xưa, trả {vat} cho bà', kind: 'help', ax: { daoduc: 1 }, can: 'hua_vat', fx: { daoTam: 3, vat: { mat: '@vat' } }, mat: 'Vật kỷ niệm cuối cùng của những ngày ấy.', toi: 'e2' },
          { key: 'noi_that', label: 'Nói thật với bà', kind: 'risk', ax: { daoduc: 3 }, can: 'im_danh_sach', fx: { nghiep: -1, daoTam: -3, flag: 'noi_that_me' }, mat: 'Niềm tin cuối cùng của một bà mẹ.', toi: 'e2' },
          { key: 'im', label: 'Không nói gì, để lại ít bạc rồi đi', kind: 'safe', fx: { gold: -50, flag: 'im_me' }, mat: 'Không gì cả. Đó mới là điều nặng nhất.', toi: 'e2' }
        ]
      },
      e2: {
        t: 'Cả thôn sống nhờ cái tông',
        d: '{ban} từ thôn lên, ngồi trước mặt bạn rất lâu. "Cả thôn sống nhờ cái tông ấy. Ngươi đừng làm gì." Mùa đông ấy {than_nhan} mất; lời cuối của bà bạn còn nghe rõ: "Con không có lỗi gì."',
        khi: { sau: 18 }, han: 6, mac: 'hua',
        lc: [
          { key: 'hua', label: 'Hứa với {ban} sẽ không làm gì', kind: 'safe', ax: { daoduc: -1 }, fx: { gan_bo: { dan: 'ban', d: 2 }, daoTam: -2, flag: 'hua_ban' }, mat: 'Một lời hứa với người thân nhất. Bạn biết mình sắp phá nó.', toi: 'e3' },
          { key: 'chua_hua', label: 'Bảo {ban}: bạn chưa hứa', kind: 'risk', ax: { daoduc: 2 }, fx: { flag: 'chua_hua' }, mat: '{ban} sẽ nhìn bạn như nhìn người lạ.', toi: 'e3' }
        ]
      },
      e3: {
        t: 'Danh sách cuối',
        d: 'Bạn thấy danh sách kỳ này: bảy cái tên, trong đó có một đứa trẻ bạn từng chữa dịch bằng chính tay mình. Cuối danh sách đã chừa sẵn chỗ cho chữ ký của bạn.',
        khi: { sau: 12 }, han: 6, mac: 'ghi_ten',
        lc: [
          { key: 'ghi_ten', label: 'Ghi nhớ từng cái tên', kind: 'help', ax: { daoduc: 1 }, fx: { flag: 'nho_ten' }, mat: 'Thứ bạn sẽ không bao giờ quên được.', toi: 'e4' },
          { key: 'ngoanh_di', label: 'Gấp lại, coi như chưa thấy', kind: 'safe', ax: { daoduc: -1 }, fx: { flag: 'ngoanh_di' }, mat: 'Bảy cái tên.', toi: 'e4' }
        ]
      },
      e4: {
        t: 'Đại hội toàn tông', lon: true, canh: { gio: 'ngay', thoi_tiet: 'giong_bao' },
        can_gan_bo: [{ dan: 'thuong', min: 3 }, { dan: 'su', min: 3 }],
        d: 'TODO K2b: Đại hội toàn tông ngày ký danh sách cuối. Bạn là người kế nhiệm của {su}, đứng trước cả sơn môn. Có thể đứng lên tố giác (mất công pháp {su} dạy, mất ghế, phá đời {thuong}, thôn có thể bị {the_luc} trả thù), im lặng kế nhiệm, hoặc vào phòng {su} trong đêm (đường tắt: nhanh, thành kẻ phản sư). Chọn bỏ gì.',
        khi: { sau: 12 }, han: 6, mac: 'ke_nhiem',
        lc: [
          { key: 'to_giac', label: 'Đứng lên tố giác', kind: 'risk', ax: { daoduc: 3, xuthe: -2 }, fx: { flag: 'to_giac', tong: { truc_xuat: true }, roi: { dan: 'thuong' }, gan_bo: { dan: 'ban', d: -2 } },
            mat: 'Công pháp {su} dạy, ghế của bạn, và có thể {thuong}. Thôn dưới núi có thể bị {the_luc} trả thù.', sau: 'TODO K2b', toi: 'e4w' },
          { key: 'ke_nhiem', label: 'Im lặng, nhận ghế kế nhiệm', kind: 'safe', ax: { daoduc: -2, xuthe: 1 }, fx: { flag: 'ke_nhiem_im', gan_bo: { dan: 'su', d: 2 }, rep: { chinh: -2 } },
            mat: 'Bảy cái tên trong danh sách, và con người cũ của bạn.', sau: 'TODO K2b', toi: 'e5' },
          { key: 'giet_su', label: 'Vào phòng {su} trong đêm', kind: 'fight', ax: { daoduc: -2, tinh: -2 }, gate: { truc: 'daoduc', max: 4, why: 'Tay bạn không làm nổi việc ấy.' },
            fx: { flag: 'giet_su', chet: { dan: 'su', ngoai_khung: true }, roi: { dan: 'thuong' }, nghiep: 3 },
            mat: 'Nhanh, và bạn thành kẻ phản sư trong mắt cả tông; {thuong} sẽ không ở lại.', sau: 'TODO K2b', toi: 'e5' }
        ]
      },
      e4w: {
        t: 'Đứa trẻ ở cổng núi', am: true,
        d: 'Đứa trẻ cuối danh sách ngồi bên cổng núi, hai chân đung đưa. Bạn đã chép tên nó sang một cuốn sổ khác. Nó nhận củ khoai nướng bạn đưa bằng hai tay, còn nóng.',
        khi: { sau: 1 }, han: 6, mac: 'dua_khoai',
        lc: [
          { key: 'dua_khoai', label: 'Ngồi xuống cạnh nó, chờ nó ăn xong', kind: 'help', ax: { daoduc: 1 }, fx: { daoTam: 3, flag: 'cuu_tre' }, toi: 'e5' },
          { key: 'dua_ten', label: 'Dắt nó xuống thôn gửi cho {ban}', kind: 'safe', ax: { tinh: 1 }, fx: { gan_bo: { dan: 'ban', d: 2 }, flag: 'cuu_tre' }, toi: 'e5' }
        ]
      },
      e5: {
        t: 'Sơn môn đêm ấy',
        d: 'Chuông sơn môn không còn điểm đều như trước. Bạn đứng ở sân, nghe tiếng chân người chạy qua sân sau, rồi im.',
        d_neu: [
          { flag: 'to_giac', d: 'Tối hôm ấy chuông sơn môn đổ từng hồi. {thuong} thu dọn đồ, không nói lời tạm biệt. {su} đóng cửa thư phòng, và không ai thấy ông ra.' },
          { flag: 'ke_nhiem_im', d: 'Bạn ngồi vào ghế của {su}; ông nhìn bạn từ cửa, gật đầu như người trao xong một việc nhà.' },
          { flag: 'giet_su', d: 'Cả tông gọi tên bạn bằng hai chữ không ai muốn nghe. Cây bút son còn trên bàn.' }
        ],
        khi: { sau: 4 }, han: 6, mac: 'tiep',
        lc: [
          { key: 'tiep', label: 'Đi tiếp con đường đã chọn', kind: 'safe', ax: { tinh: 1 }, fx: { flag: 'di_tiep' }, mat: 'Một đêm không ngủ, và một con đường không có đường lui.', toi: 'f1' },
          { key: 'bo_di', label: 'Rời tông ngay đêm nay', kind: 'flee', ax: { tudung: -2 }, fx: { tong: { truc_xuat: true } }, mat: 'Những gì bạn đã chọn ở lại.', toi: 'ket:bo_cuoc' }
        ]
      },

      // ================= PHẦN 6: BIỂN (70 trở đi) =================
      f1: {
        t: 'Hậu quả',
        d: 'Chuyện bạn đã chọn trở lại, theo cách không ai báo trước.',
        d_neu: [
          { flag: 'to_giac', d: '{the_luc} đã tràn qua đèo, và thôn dưới núi nằm ngay đường họ tới. {ban} gửi lời: "Ngươi muốn cái đúng. Đây là giá."' },
          { flag: 'ke_nhiem_im', d: 'Một đệ tử trẻ hỏi bạn danh sách này chỉ cần ký là xong phải không, giọng nhẹ như hỏi giờ ăn cơm. Bạn nghe lại chính mình ba mươi năm trước.' },
          { flag: 'giet_su', d: 'Người ta kể nhau nghe về kẻ đã giết thầy mình. Có người đến xin bạn tha cho họ, có người đến xin bạn đừng để họ biết bạn là ai.' }
        ],
        khi: { sau: 0 }, han: 6, mac: 'nhin',
        lc: [
          { key: 'nhin', label: 'Nhìn kỹ đến cùng', kind: 'safe', ax: { daoduc: 1 }, fx: { flag: 'nhin_ky' }, mat: 'Từ nay bạn không còn chỗ nào để giấu.', toi: 'f2' },
          { key: 'ne', label: 'Nhận như một chuyện thường', kind: 'safe', ax: { daoduc: -1 }, fx: { flag: 'ne_hau_qua' }, mat: 'Cơ hội cuối để làm khác.', toi: 'f3' }
        ]
      },
      f2: {
        t: 'Danh sách mới, hay tông mới',
        d: 'Bạn còn ít năm. Một nhóm đệ tử nghèo, những đứa bạn từng cứu khỏi danh sách, đến xin được theo bạn. Hoặc có người đưa bạn một danh sách khác, mới tinh, mực chưa khô.',
        khi: { sau: 12 }, han: 6, mac: 'ky_them',
        lc: [
          { key: 'lap_tong', label: 'Dựng một tông nhỏ cho những đứa trẻ ấy', kind: 'help', ax: { daoduc: 2 }, fx: { gold: -80, daoTam: 2, flag: 'lap_tong' }, mat: 'Của cải còn lại và những năm cuối đời.', toi: 'f3' },
          { key: 'ky_them', label: 'Ký thêm danh sách, tự nhủ là lần cuối', kind: 'safe', ax: { daoduc: -2 }, fx: { flag: 'ky_them' }, mat: 'Thêm bảy cái tên, và lời tự nhủ.', toi: 'f4' }
        ]
      },
      f3: {
        t: 'Hộp gỗ cũ',
        d: 'Trong đêm, bạn mở chiếc hộp gỗ cũ. {vat} vẫn nằm đó, bạc màu, và bạn nghe lại tiếng cười của {huynh} trong căn phòng chật mười đứa trẻ. Nếu bạn không làm gì, nó cũng chỉ là một món đồ.',
        khi: { sau: 12 }, han: 6, mac: 'cat_di',
        lc: [
          { key: 'mang_di', label: 'Gói {vat} lại, mang theo', kind: 'help', ax: { daoduc: 1 }, fx: { flag: 'mang_vat' }, mat: 'Một thứ nặng hơn sức bạn còn lại.', toi: 'f4' },
          { key: 'cat_di', label: 'Cất vào hộp, khép nắp', kind: 'safe', ax: { daoduc: -1 }, fx: { flag: 'cat_vat' }, mat: 'Một lời hứa chưa trả.', toi: 'f4' }
        ]
      },
      f4: {
        t: 'Trận cuối', lon: true, canh: { gio: 'hoang_hon', thoi_tiet: 'chien_loan' },
        d: 'TODO K2b: {the_luc} đã tới chân núi, thôn dưới núi ở ngay đường họ tiến. Bạn đã ngoài bảy mươi. Chọn đánh hay không: giữ thôn bằng chính tu vi của bạn (vòng quay), đưa tông mới ra đối diện {the_luc}, hoặc ký danh sách để họ rút quân.',
        khi: { sau: 12 }, han: 6, mac: 'ky_danh_sach',
        lc: [
          { key: 'giu_thon', label: 'Giữ thôn bằng chính tu vi của bạn', kind: 'fight', ax: { daoduc: 2, tinh: 1 }, mat: 'Phần còn lại của đời bạn.',
            wheel: { vung: [ { w: 55, n: 'Thôn mất một nửa', fx: { daoTam: -2 }, toi: 'f5' }, { w: 45, n: 'Thôn vẫn còn', fx: { daoTam: 2, gan_bo: { dan: 'ban', d: 3 } }, toi: 'f4w' } ],
              yeu_to: { loai: 'stat', chi_so: 'realm', tran: 12 }, gia: 3 } },
          { key: 'dua_tong_moi', label: 'Đưa tông mới ra đối diện {the_luc}', kind: 'risk', ax: { daoduc: 2, xuthe: -1 }, can: 'lap_tong', fx: { flag: 'tong_moi_ra' }, mat: 'Những đứa trẻ bạn đã gom lại.', sau: 'TODO K2b', toi: 'f4w' },
          { key: 'ky_danh_sach', label: 'Ký danh sách để {the_luc} rút quân', kind: 'safe', ax: { daoduc: -3 }, fx: { flag: 'ky_cuoi', vat: { mat: '@vat' } }, mat: 'Thêm một danh sách, và vật bạn giữ từ thuở nhỏ.', sau: 'TODO K2b', toi: 'f5' }
        ]
      },
      f4w: {
        t: 'Đệ tử đầu tiên', am: true,
        d: 'Mùa sau, một đệ tử nghèo của tông mới gõ cửa, tay cầm thư đậu nội môn do chính bạn ký. Bạn đọc hai lần. Đứa trẻ cười toe, thiếu mất một cái răng cửa.',
        khi: { sau: 4 }, han: 6, mac: 'dua_thu',
        lc: [
          { key: 'dua_thu', label: 'Viết thư tiến cử cho đứa trẻ tiếp theo', kind: 'help', ax: { daoduc: 1 }, fx: { daoTam: 3, flag: 'tien_cu' }, toi: 'f5' },
          { key: 'vuot_dau', label: 'Xoa đầu nó: "Đi đi."', kind: 'safe', ax: { tinh: 1 }, fx: { daoTam: 2 }, toi: 'f5' }
        ]
      },
      f5: {
        t: 'Hình ảnh khép lại',
        d: 'Chiều tà. Bạn đứng ở nơi cao nhất còn đi được, nhìn xuống con đường mình đã đi. Gió mang theo mùi muối, hoặc là bạn tưởng thế.',
        khi: { sau: 4 }, han: 6, mac: 'doa',
        lc: [
          { key: 'tron', label: 'Mang {vat} ra bờ biển', kind: 'help', ax: { daoduc: 2 }, can: 'to_giac', mat: 'Cuộc đời cũ, và sự yên tâm của kẻ không làm gì.', toi: 'ket:tron' },
          { key: 'co_doc', label: 'Ngồi một mình ở cổng núi', kind: 'safe', ax: { tinh: 1 }, can: 'giet_su', mat: 'Người cuối cùng còn chờ bạn.', toi: 'ket:co_doc' },
          { key: 'doa', label: 'Xoa đầu một đệ tử trẻ: "Đừng làm lớn chuyện."', kind: 'safe', ax: { daoduc: -2 }, mat: 'Chính con người cũ của bạn.', toi: 'ket:doa' }
        ]
      }
    },
    ket: {
      tron: { t: 'Toàn vẹn', kv: 2, log: 'Bạn đưa {vat} ra bờ biển, một mình, nhẹ như người vừa trả xong món nợ lớn nhất. Sóng không hỏi gì cả.' },
      doa: { t: 'Đọa', kv: 0, xau: true, log: 'Bạn xoa đầu một đứa trẻ và nói: đừng làm lớn chuyện. Cây bút son nằm trong tay áo bạn từ lúc nào, bạn không nhớ.' },
      co_doc: { t: 'Cô độc', kv: 1, xau: true, log: 'Bạn sống, còn lại một mình, và không còn ai để đưa {vat} ra biển.' },
      bo_cuoc: { t: 'Bỏ cuộc', kv: 0, xau: true, log: 'Bạn rời tông, mang theo những điều chưa kịp nói với {huynh}.' }
    }
  });
})();
