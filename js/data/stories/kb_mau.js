// Kịch bản KHUNG MẪU (K1), không phải kịch bản thật: 2 phần, mỗi phần năm nhịp (moc, leo, dao, cao_trao, treo) và một cảnh lớn, dùng ĐỦ các khóa mới của bộ máy
// để kiểm thử và để phiên K2 (viết kịch bản "mềm yếu" đầy đủ) nhìn vào mà viết theo. Chữ ngắn, giọng chỉ đủ dùng.
// Mở: chỉ khi D.STORY.kb[khuyết điểm của người chơi] trỏ tới 'kb_mau' (mặc định bảng kb rỗng nên không bao giờ mở trong lúc chơi thật; kiểm thử đặt D.STORY.kb.mem_long = 'kb_mau').
// Khóa dùng: loai 'kb', mau (cho phép 2 phần), mo.kd, vai pick 'dan:<vai>', khe_kb (the_luc, vat), phan[], chặng: am, lon, canh, can_gan_bo, d_neu;
// lựa chọn: can, mat, sau, sau_neu, thu_thach, tre.chang, fx.gan_bo / no / tra_no / chet / roi / thu / tong / vat ('@vat' = vật của khe), cờ khinh_giau; kết cục: xau.
(function () {
  const D = window.TT.data;

  D.STORY.reg({
    id: 'kb_mau', n: 'Khung mẫu (K1)', loai: 'kb', mau: true,
    mo: { kd: 'mem_long' },
    vai: {
      huynh: { pick: 'dan:huynh' }, ban: { pick: 'dan:ban' }, su: { pick: 'dan:su' },
      doi_thu: { pick: 'dan:doi_thu' }, than_nhan: { pick: 'dan:than_nhan' }, thuong: { pick: 'dan:thuong' }
    },
    khe_kb: { the_luc: { the_luc: true }, vat: { vat: ['chan_day', 'giay_rom', 'kiem_go'] } },
    dau: 'c1',
    phan: [
      { id: 'p1', n: 'Chiếc chăn', tuoi: 12, moc: 'c1', leo: ['c2', 'c2x'], dao: 'c3', cao_trao: 'c4', treo: 'c5' },
      { id: 'p2', n: 'Bút son', tuoi: 30, moc: 'c6', leo: ['c7'], dao: 'c8', cao_trao: 'c9', treo: 'c10' }
    ],
    chang: {
      // ---------- phần 1 ----------
      c1: {
        t: 'Đêm đầu ở ngoại môn', am: true,
        d: 'Mười đứa trẻ nằm chung một phản, gió lùa qua khe ván. {huynh} trở mình, đẩy sang phía bạn {vat} hắn mang từ nhà. "Ta quen lạnh rồi." Răng hắn đánh vào nhau suốt đêm.',
        khi: { sau: 0 }, han: 6, mac: 'nhan',
        lc: [
          { key: 'nhan', label: 'Nhận lấy, hứa sẽ trả hắn một thứ tốt hơn', kind: 'safe', ax: { daoduc: 1 }, fx: { gan_bo: { dan: 'huynh', d: 2 }, vat: '@vat', flag: 'hua_vat' }, mat: 'Một lời hứa.', toi: 'c2' },
          { key: 'chung', label: 'Kéo hắn vào đắp chung', kind: 'help', ax: { tinh: 1 }, fx: { gan_bo: { dan: 'huynh', d: 1 } }, toi: 'c2' }
        ]
      },
      c2: {
        t: 'Món nợ thuốc',
        d: 'Thầy lang lắc đầu: bệnh của {than_nhan} chữa được, nhưng phải có Tử Sâm trăm năm, giá bằng ba năm bổng lộc ngoại môn. {doi_thu} có thừa số vàng ấy; hắn đã nói, chỉ cần bạn xin.',
        khi: { sau: 1 }, han: 6, mac: 'tu_kiem',
        lc: [
          { key: 'tu_kiem', label: 'Tự kiếm đủ trong hai năm', kind: 'safe', ax: { tudung: 2 }, mat: 'Hai năm không tu được bao nhiêu. Và có thể vẫn không kịp.', thu_thach: { can: { gold: 300 }, han: 24, tieu: true, dat: 'c3', truot: 'c2x' } },
          { key: 'xin', label: 'Cúi đầu xin {doi_thu}', kind: 'pay', ax: { xuthe: 3 }, fx: { gold: 300, rep: { danh: -2 }, no: { dan: 'doi_thu', d: 3 }, flag: 'xin_doi_thu' },
            tre: [{ sau: [12, 24], fx: { rel: { vai: 'doi_thu', d: -4 } }, log: '{doi_thu} nhắc lại chuyện cũ trước mặt người khác, giọng rất nhẹ.' }],
            mat: 'Cả ngoại môn sẽ nhớ cảnh này. {doi_thu} cũng vậy, và hắn sẽ đòi.', toi: 'c3' }
        ]
      },
      c2x: {
        t: 'Hết hạn',
        d: 'Hạn đã hết, bạn chưa gom đủ. {than_nhan} không trách, chỉ nói bà đã quen.',
        khi: { sau: 0 }, han: 6, mac: 'chiu',
        lc: [
          { key: 'chiu', label: 'Chịu, ở lại làm tiếp', kind: 'safe', ax: { tinh: 1 }, fx: { daoTam: -2, flag: 'tuot_han' }, mat: 'Một người đã chờ bạn quá lâu.', toi: 'c3' },
          { key: 'bo_hoc', label: 'Bỏ tông về nhà', kind: 'flee', ax: { tudung: -2 }, fx: { tong: { truc_xuat: true } }, mat: 'Con đường tu hành, vì một món nợ.', toi: 'ket:bo_cuoc' }
        ]
      },
      c3: {
        t: 'Mảnh giấy',
        d: 'Trong đôi giày một đệ tử "lên nội môn" bỏ quên có mảnh giấy ghi một chữ: "cứu". Chữ đã nhòe.',
        d_neu: [{ flag: 'xin_doi_thu', d: 'Trong đôi giày một đệ tử "lên nội môn" bỏ quên có mảnh giấy ghi một chữ: "cứu". {doi_thu} đứng sau lưng bạn từ lúc nào, chìa tay: "Đưa đây. Ngươi còn nợ ta."' }],
        khi: { sau: 1 }, han: 6, mac: 'giau',
        lc: [
          { key: 'dua_su', label: 'Đưa {su}', kind: 'safe', ax: { xuthe: 1 }, fx: { gan_bo: { dan: 'su', d: 1 }, flag: 'dua_giay' }, mat: 'Người duy nhất bạn tin; mảnh giấy này sẽ không quay lại.', toi: 'c4' },
          { key: 'giau', label: 'Giấu đi, chờ xem', kind: 'safe', ax: { tinh: 1 }, fx: { flag: 'giau_giay' }, mat: 'Thời gian, và có thể một người.', toi: 'c4' },
          { key: 'roi_di', label: 'Rời tông ngay đêm nay', kind: 'flee', ax: { daoduc: -1 }, fx: { tong: { truy: true } }, mat: 'Tất cả những gì đã có.', toi: 'ket:bo_cuoc' }
        ]
      },
      c4: {
        t: 'Đêm trước ngày lên nội môn', lon: true, canh: { gio: 'dem', thoi_tiet: 'mua' },
        can_gan_bo: { dan: 'huynh', min: 3 },
        d: 'Mưa đầu mùa. Dầu trong đèn sắp cạn. {huynh} gói đồ: đôi giày rơm mẹ hắn đan, cái lược gãy răng. Chiều nay trong thư phòng bạn đã thấy tên hắn ở dòng thứ bảy, có son của {su}; sáu cái tên bên trên chưa ai gửi thư về. "Ta nhờ ngươi viết cho mẹ ta mấy dòng." Bạn mài mực. Sáng mai hắn đi.',
        khi: { sau: 1 }, han: 6, mac: 'viet',
        lc: [
          { key: 'viet', label: 'Viết nốt, gấp thư lại, đưa hắn', kind: 'safe', ax: { daoduc: -1, xuthe: 1 }, fx: { flag: ['thu_chu_ban', 'im_danh_sach'], no: { dan: 'huynh', d: 5 } },
            mat: 'Giữ hòa khí. Lá thư này sẽ về tới thôn, cùng với một thứ khác.',
            sau: 'Hắn cầm lá thư bằng hai tay, cất vào ngực áo. Sáng hôm sau trời tạnh; bạn đứng ở cổng nhìn hắn theo người nội môn lên bậc đá. Đêm ấy bạn ngủ rất ngon. Đó là điều về sau bạn không tha thứ được cho mình.',
            sau_neu: [{ flag: 'hua_vat', sau: 'Hắn cầm lá thư bằng hai tay, cất vào ngực áo, cạnh chỗ bạn nhét {vat} cho hắn mang theo. Sáng hôm sau trời tạnh. Đến bậc thứ một trăm thì không nhìn thấy nữa.' }],
            tre: [{ sau: [12, 24], chang: 'c_gat', log: 'Một lá thư tới, nét chữ ấy bạn quen.' }], toi: 'c5' },
          { key: 'ke', label: 'Đặt bút xuống, kể cho hắn về tờ danh sách', kind: 'risk', ax: { daoduc: 2, xuthe: -2 }, fx: { flag: 'ke_danh_sach', gan_bo: { dan: 'huynh', d: 2 }, rel: { vai: 'su', d: -20 } },
            mat: 'Hắn có thể không tin. {su} sẽ biết là bạn đã nói.',
            sau: 'Hắn nghe hết, không ngắt lời. Rồi hắn cười, cái cười của người vừa được mời bát cơm mà người mời bảo cơm có độc. "Ngươi ghen à?" Gần sáng chỗ nằm của hắn trống.', toi: 'c5' },
          { key: 'tron', label: 'Xé thư, bảo hắn đêm nay trốn khỏi tông', kind: 'risk', ax: { daoduc: 3, tinh: -2 }, gate: { truc: 'tinh', max: 6, why: 'Bạn quá nhẫn nhịn để làm một việc liều như thế.' },
            fx: { flag: 'tron_cung', tong: { truy: true }, gan_bo: { dan: 'huynh', d: 3 } }, mat: 'Đào tẩu đệ tử bị truy. Ngươi là người cuối cùng thấy hắn.',
            sau: 'Hai người lội suối trong mưa, giày rơm tuột mất một chiếc. Đến bìa rừng hắn dừng lại, nhìn về phía thôn. "Mẹ ta thì sao?" Bạn không trả lời được.', toi: 'ket:bo_cuoc' }
        ]
      },
      c5: {
        t: 'Tin từ xa',
        can_gan_bo: { hoac: [{ dan: 'huynh', min: 3 }, { dan: 'ban', min: 3 }] },
        d: 'Hai tin tới cùng một ngày, từ hai phía. Một tin nói {huynh} gặp chuyện ở nội môn. Một tin nói {ban} đã nhờ người gửi lời cuối cho bạn. Bạn chỉ kịp đọc một.',
        khi: { sau: 2 }, han: 6, mac: 'huynh',
        lc: [
          { key: 'huynh', label: 'Đọc tin về {huynh}', kind: 'safe', fx: { chet: { dan: 'huynh', ngoai_khung: true }, flag: 'chon_huynh' }, mat: '{ban} sẽ chờ một lời không bao giờ tới.', toi: 'c6' },
          { key: 'ban', label: 'Đọc lời cuối của {ban}', kind: 'help', fx: { roi: { dan: 'ban' }, flag: 'chon_ban' }, mat: '{huynh} một mình đối mặt với điều bạn không biết.', toi: 'c6' }
        ]
      },
      // ---------- phần 2 ----------
      c6: {
        t: 'Suất nội môn',
        d: 'Mười năm sau, tông có một suất lên nội môn. {su} gọi bạn vào, rót trà. "Con hiểu ta mà."',
        khi: { sau: 2 }, han: 6, mac: 'nhuong',
        lc: [
          { key: 'nhan_suat', label: 'Nhận suất, cúi đầu tạ ơn', kind: 'safe', ax: { xuthe: 1 }, fx: { tong: { len_noi_mon: true }, gan_bo: { dan: 'su', d: 2 } }, mat: 'Đứng ở chỗ người ta muốn bạn đứng.', toi: 'c7' },
          { key: 'nhuong', label: 'Nhường lại cho người khác', kind: 'help', ax: { daoduc: 1 }, fx: { tong: { mat_suat: true }, daoTam: 2 }, mat: 'Ghế nội môn, và tiếng thơm của kẻ biết điều.', toi: 'c7' }
        ]
      },
      c7: {
        t: 'Kẻ từng đỡ bạn',
        can_gan_bo: { dan: 'doi_thu', min: 3 },
        d: '{doi_thu} tìm tới, không còn lườm. Hắn nói hắn cần bạn làm chứng một chuyện, và hắn chưa quên món nợ cũ.',
        khi: { sau: 1 }, han: 6, mac: 'giup',
        lc: [
          { key: 'giup', label: 'Làm chứng, coi như trả nợ', kind: 'help', ax: { daoduc: 1 }, fx: { tra_no: 'doi_thu', gan_bo: { dan: 'doi_thu', d: 2 } }, mat: 'Một lần đứng về phía hắn trước cả tông.', toi: 'c8' },
          { key: 'tu_choi', label: 'Từ chối, bảo mình không dính vào', kind: 'safe', ax: { xuthe: 2 }, fx: { thu: { dan: 'doi_thu', why: 'bị bạn bỏ mặc' }, flag: 'bo_doi_thu' }, mat: 'Hắn không bao giờ nhờ ai thêm lần nữa. Có thể hắn thành kẻ thù.', toi: 'c8' }
        ]
      },
      c8: {
        t: 'Lời bạn từng nói',
        d: 'Trong bữa tiệc mừng, một người nhắc bạn từng chê kẻ giàu bẩn tay. Bây giờ bạn là người cầm chén lớn nhất.',
        khi: { sau: 1 }, han: 6, mac: 'cuoi',
        lc: [
          { key: 'chua', label: 'Nói thẳng rằng ngày xưa bạn chê người giàu', kind: 'safe', ax: { daoduc: 1 }, fx: { flag: 'khinh_giau' }, mat: 'Một lời tự vạch mặt mình.', toi: 'c9' },
          { key: 'cuoi', label: 'Cười xòa cho qua', kind: 'safe', ax: { xuthe: 1 }, fx: { daoTam: -1 }, mat: 'Một chút tự trọng.', toi: 'c9' },
          { key: 'bo_ve', label: 'Bỏ tiệc, rời tông', kind: 'flee', fx: { flag: 'khinh_giau', tong: { giang: true } }, mat: 'Cái ghế mới ngồi.', toi: 'ket:co_doc' }
        ]
      },
      c9: {
        t: 'Bút son', lon: true, canh: { gio: 'hoang_hon' },
        can_gan_bo: { dan: 'su', min: 3 },
        d: '{su} đặt trước mặt bạn cuốn danh sách và cây bút son. Tên đầu tiên bạn không biết. Ngoài hiên, {the_luc} đóng quân ở biên vùng, tông cần hứa với họ một số người. "Tông còn thì ngàn người còn."',
        khi: { sau: 1 }, han: 6, mac: 'ky',
        lc: [
          { key: 'ky', label: 'Ký', kind: 'safe', ax: { daoduc: -2 }, fx: { flag: 'da_ky', vat: { mat: '@vat' }, gan_bo: { dan: 'su', d: 2 } }, mat: 'Một cái tên, và vật bạn giữ từ thuở nhỏ.',
            sau: 'Bạn ký. Nét son khô nhanh hơn bạn nghĩ. Đêm ấy bạn đặt {vat} lên bậu cửa sổ, và sáng ra thấy nó bám sương.', toi: 'c10' },
          { key: 'doi_ten', label: 'Ký, nhưng đổi tên đứa trẻ bạn từng chữa bằng một cái tên khác', kind: 'risk', ax: { daoduc: 2 }, fx: { flag: 'doi_ten_tre', tong: { giang: true }, gan_bo: { dan: 'thuong', d: 1 } }, mat: 'Ghế nội môn. Và một người khác sẽ thế chỗ đứa trẻ.',
            sau: 'Bạn viết một tên khác, tay hơi run. {su} nhìn bạn rất lâu nhưng không nói gì; cuốn danh sách được khép lại.', toi: 'c10' },
          { key: 'khong_ky', label: 'Đặt bút xuống', kind: 'risk', ax: { daoduc: 3, xuthe: -2 }, fx: { flag: 'khong_ky', tong: { truc_xuat: true } }, mat: 'Tông, ghế, và người thầy nuôi bạn.',
            sau: 'Cây bút lăn khỏi mép bàn. Không ai nhặt. Cánh cửa mở ra, gió từ hiên thổi vào, mang theo mùi khói biên giới.', toi: 'c10' }
        ]
      },
      c10: {
        t: 'Hình ảnh khép lại',
        d: 'Chiều tà, bạn nhìn lại phía sau. Mọi thứ bạn đã chọn ở đó, im lặng như {vat}.',
        khi: { sau: 2 }, han: 6, mac: 'doa',
        lc: [
          { key: 'tron', label: 'Mang vật cũ ra bờ biển', kind: 'help', ax: { daoduc: 2 }, can: 'khong_ky', mat: 'Cuộc đời cũ.', toi: 'ket:tron' },
          { key: 'chuoc', label: 'Quay về tông chịu tội', kind: 'safe', ax: { daoduc: 1 }, mat: 'Tự do, và tiếng tăm.', toi: 'ket:chuoc' },
          { key: 'doa', label: 'Xoa đầu một đệ tử trẻ: "Đừng làm lớn chuyện."', kind: 'safe', ax: { daoduc: -2 }, mat: 'Chính con người cũ của bạn.', toi: 'ket:doa' }
        ]
      },
      // ---------- chặng gặt (mở bằng tre.chang từ c4) ----------
      c_gat: {
        t: 'Lá thư cũ',
        d: 'Bạn nhận được một lá thư gấp vuông vức.',
        d_neu: [
          { flag: 'thu_chu_ban', d: 'Lá thư gấp vuông vức, nét chữ chính tay bạn viết năm xưa, nay về với một vết ố. Người nhận chưa kịp mở đã mất.' },
          { flag: 'ke_danh_sach', d: 'Lá thư của {huynh}: "Ngươi nói đúng. Ta chỉ chậm một đêm."' }
        ],
        khi: { sau: 0 }, han: 6, mac: 'im',
        lc: [
          { key: 'tra_vat', label: 'Giữ lời hứa năm xưa, trả {vat}', kind: 'help', ax: { daoduc: 1 }, can: 'hua_vat', fx: { daoTam: 3, vat: { mat: '@vat' } }, mat: 'Vật kỷ niệm cuối cùng của những ngày ấy.', toi: 'ket:tron' },
          { key: 'noi_that', label: 'Nói thật với người nhận', kind: 'risk', ax: { daoduc: 3 }, can: 'im_danh_sach', fx: { nghiep: -1, daoTam: -3 }, mat: 'Niềm tin cuối cùng của một người.', toi: 'ket:chuoc' },
          { key: 'im', label: 'Không nói gì, để lại ít bạc rồi đi', kind: 'safe', fx: { gold: -20 }, mat: 'Không gì cả. Đó mới là điều nặng nhất.', toi: 'ket:doa' }
        ]
      }
    },
    ket: {
      tron: { t: 'Toàn vẹn', kv: 1, log: 'Bạn đưa vật cũ ra bờ biển, một mình, nhẹ như người vừa trả xong món nợ lớn nhất.' },
      chuoc: { t: 'Chuộc lỗi', kv: 0, log: 'Bạn quay về chịu tội. Không ai khen, nhưng đêm ấy bạn ngủ yên.' },
      doa: { t: 'Đọa', kv: 0, xau: true, log: 'Bạn ngồi vào ghế của người đã dạy bạn, và ký thêm một danh sách.' },
      bo_cuoc: { t: 'Bỏ cuộc', kv: 0, xau: true, log: 'Bạn rời tông, mang theo những điều chưa kịp nói với {huynh}.' },
      co_doc: { t: 'Cô độc', kv: 0, xau: true, log: 'Bạn sống, còn lại một mình, và không còn ai để đưa {vat} ra biển.' }
    }
  });
})();
