// Khung truyện (Z "Đặc tả 8B", Q 10): cấu hình và sổ đăng ký tuyến. Tuyến là dữ liệu thuần trong js/data/stories/*.js, gọi D.STORY.reg(arc).
// Một tuyến: { id, n, loai: 'bb'|'tp'|'tg', mo: { realm?, age?, flag?, sau? (id tuyến đã xong) }, vai: { khe: { pick: 'gan'|'su'|'dong_ky', dung_moi } }, dau,
//   chang: { id: { t, d, khi: { realm?, age?, sau? (tháng kể từ khi tới chặng) }, han (tháng), mac (key mặc định),
//     lc: [ { key, label, kind, ax, gate?: { truc, min?, max?, why }, gia?: { gold|hp|daoTam|kv }, fx, toi: 'chang'|'ket:x', tre?: [ { sau: [min, max] tháng, fx, log } ], wheel? } ] } },
//   ket: { x: { t, kv, log } } }
// wheel: { vung: [ { w, n, fx, toi } ] (2 đến 4, tổng 100, xếp từ phù hợp ít đến nhiều), yeu_to: { loai: 'nature'|'rel'|'stat', ... , tran }, gia }.
// Điều kiện mo/khi: { realm?, stage? (0 sơ, 1 trung, 2 hậu kỳ, đi kèm realm), age? (tuổi), hoac?: [ điều kiện, ... ] (một nhánh đủ là được, ví dụ cảnh giới HOẶC tuổi) }.
// Chặng có thể có d_pham: chữ thay cho d khi người chơi còn là phàm nhân (realm 0).
// HƯỚNG DẪN VIẾT TUYẾN (8B2): tiến độ cảnh giới chậm là cố ý. 60 đến 70% nội dung hạ xuống "Luyện Khí trung kỳ" ({ realm: 1, stage: 1 }); chỉ 30 đến 40%
//   chuyện rất lớn mới giữ "từ Trúc Cơ" (T13, T14, A4 trở lên). Mốc xương sống mở theo "cảnh giới HOẶC tuổi" (hoac), cái nào trước; chặng cần chữ khác cho phàm nhân thì viết d_pham.
// 9B (quan hệ có chiều sâu, D.BOND): fx.bond: { vai, love?, trust?, respect?, debt? (cộng dồn, ±100), type? (ban|ket_nghia|dao_lu|thuong|hon_uoc|su_do|huyet|an|thu|cu), st? (gap|men|to|hon|ket|ben|thu|ran|biet) }.
//   Bước st = to, hon, ket cần người kia (NPC) đồng ý: lựa chọn đó phải có toi_tu (chặng hoặc kết cục khi bị từ chối). Điều kiện mo/khi: bond: { vai (bắt buộc ở khi), st (đạt giai đoạn đó, đường chính gap..thu; ran/biet khớp đúng), love/trust/respect (từ ngưỡng), debt (dương: từ ngưỡng ơn, âm: từ ngưỡng oán), type }.
//   Ở mo, bond chỉ cần có một người thỏa. vai pick 'bond' lấy người thân nhất thỏa; pick 'tinh' lấy người có thể nảy tình (dung_moi dựng mới khi vắng). Công tắc D.BOND.on tắt thì fx.bond bị bỏ qua và điều kiện bond không bao giờ đủ.
// K1 (bộ máy kịch bản, công tắc D.STORY.kbOn; chi tiết ở Z 7c "K1 đã làm"). Khóa mới của tuyến loai 'kb' (kịch bản theo khuyết điểm) và của mọi tuyến khi kbOn:
//   Tuyến: mau (true: khung mẫu, cho phép 2 phần), mo.kd (khuyết điểm gốc), vai: { k: { pick: 'dan:<vai>' | 'ky_uc' } }, khe_kb: { khe: { the_luc: true } | { vat: [id vật] } } (thêm khe {khe} dùng trong chữ),
//     phan: [ { id, n, tuoi, moc, leo: [1 đến 2 chặng], dao, cao_trao (phải là cảnh lớn), treo } ] (5 đến 7 phần, mau: 2 phần).
//   Chặng: lon (cảnh lớn), canh: { gio: 'dem'|'hoang_hon'|'ngay', thoi_tiet: 'mua'|'tuyet_lo'|'bao_tuyet'|'suong_doc'|'troi_quang'|'giong_bao'|'chien_loan'|'thu_hoach' }, am (chặng ấm, miễn mat),
//     can_gan_bo: { dan, min? } | [ ... ] (tất cả) | { hoac: [ ... ] } (luật ba lần: chưa đủ thì chặng chờ), d_neu: [ { flag, d } ] (chữ thay theo cờ, cờ đầu tiên khớp).
//   Lựa chọn: can: 'cờ' | [cờ] (chỉ hiện khi có cờ; mac không được có), mat (chữ mất, hiện trên hộp), sau + sau_neu: [ { flag, sau } ] (lời dẫn sau lựa chọn, chỉ ở cảnh lớn),
//     thu_thach: { can: { gold?, realm?, nghe: { id, lv }?, cong?, xp? }, han: tháng, tieu?: true (trừ vàng khi đạt), dat, truot } (thay cho toi/wheel), tre: [ { sau: [min, max], chang: 'chặng gặt', log? } ].
//   fx mới: gan_bo { dan, d }, no { dan, d 1..10 }, tra_no 'vai', chet { dan, ngoai_khung? }, roi { dan }, thu { dan, why? }, tong { mat_suat | len_noi_mon | giang | truc_xuat | truy: true }, vat 'id' | '@khe' | { mat: 'id' | '@khe' };
//     cờ 'khinh_giau' | 'khinh_phan' | 'khinh_ta' bật luật gọi tên. Kết cục: xau: true (kết cục xấu hoặc mất mát).
//   Điều kiện (mo, khi): tong (true | false | id), hoi, nghe { id, lv }, dao, xt, vung, nhan, ke_thu, kd.
// AI1a (khuôn và kịch bản cụ thể, công tắc D.STORY.khuonOn; chi tiết ở Z 7d "AI1a đã làm", định dạng khuôn ở js/data/khuon/kieu_hanh.js):
//   D.STORY.kieu (thư viện kiểu lựa chọn → cơ chế fx của K1), D.STORY.khuon / khuonKd (khuôn chính theo khuyết điểm), D.STORY.phu (khuôn phụ), D.STORY.xung (bảng xưng hô).
//   Tuyến sinh từ khuôn (arc.dyn, id kbc_<id>) có thêm: phan[].canh (điều kiện cảnh giới thay tuổi), phan[].tho (còn ≤ tỉ lệ thọ), khe_kb: { khe: { chu: 'chữ' } },
//   lựa chọn: tm (chỉ hiện khi tâm ma), kieu, vt; đích 'ket:@khuon' (kết cục chọn theo chuỗi kiểu lựa chọn); điều kiện tho.
// Chữ có khe {khe} (tên người ở vai, hoặc chữ của khe_kb) và {ten} (tên người chơi). Kiểm bằng tools/story-lint.js (TT.story.lint).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.STORY = {
    on: true,                    // false: mọi thứ chạy như cũ, baseline.js --story=off phải trùng khít
    evMul: 0.3,                 // nhân vào xác suất sự kiện lẻ của người chơi khi bật truyện (hộp truyện chiếm một phần nhịp quyết định)
    logGom: { on: true, rumorMonths: 36 }, // 8B2: gom năm trống (+0) và tin đồn lặp (cùng loại, cùng nơi trong rumorMonths) thành một dòng cuối năm
    gap: 2,                      // tối thiểu 2 tháng giữa hai hộp truyện (tối đa 1 hộp mỗi tháng, giữ nhịp ≤ 6 hộp/phút)
    // Bộ điều nhịp (N1b, sửa bài "Nhịp quyết định" đỏ: 7,11 hộp/phút, rồi 8,48 khi T1, T2, T5, W1 hạ điều kiện mở). Giãn gap, evMul không đủ (đã đo): hộp truyện nằm sẵn trong tuyến.
    // Ngân sách hộp: mỗi hộp "mềm" (truyện, sự kiện lẻ tầng 2, hộp nhiệm vụ) tốn 1 điểm; điểm hồi 1 mỗi `moi` tháng, tối đa `max`. Hết điểm thì hộp truyện chờ (không mất), sự kiện lẻ và hộp
    // nhiệm vụ do máy chọn mặc định thay bạn (như chế độ Tự động, có ghi nhật ký). Sự kiện cần ít nhất `ev` điểm mới được hiện (chừa điểm cho truyện). Vòng quay, lời dẫn, tầng 3 không tính.
    nhip: { on: true, max: 2, moi: 30, ev: 1.5 },
    timeout: 25,                 // giây đếm ngược của hộp chặng ở chế độ Cân bằng
    fit: { hop: 1.1, trai: 0.9 },// độ hợp (TT.nature.affinity) từ hop trở lên là chấm "hợp tính", dưới trai là "trái tính"
    // Khoảng cách tính cách (điểm trục ngược chiều với hướng của lựa chọn, theo lc.ax): từ traiAt thì trái tính (mất đạo tâm), từ khoaAt thì khóa hẳn (không chọn được, hiện lý do).
    traiAt: 4, khoaAt: 7,   // khóa hẳn chỉ ở đầu cực (±7 đến ±10, Q 6.5); 4 đến 6 là trái tính có phí
    trai: { daoTam: 1 },         // phí trái bản tính (Q 6.5): chọn lựa chọn trái tính thì mất bấy nhiêu đạo tâm
    loai: ['bb', 'tp', 'tg', 'kb'],    // bb xương sống, tp tuyến thân phận, tg tuyến thế giới, kb kịch bản theo khuyết điểm (K1)
    kinds: ['risk', 'safe', 'fight', 'flee', 'help', 'pay'],
    picks: ['gan', 'su', 'dong_ky', 'tinh', 'bond', 'ky_uc'], // ky_uc (N1b): người có nhiều ký ức chung nhất (9K), không có thì dong_ky; 'dan:<vai>' (K1) lấy người ở vai của dàn định mệnh // tinh: người có thể nảy tình (đủ 18 tuổi, không ruột thịt, còn tự do); bond: người đã có cặp thân thiết thỏa vai.bond hoặc mo.bond (9B)
    fxKeys: ['gold', 'xp', 'hp', 'daoTam', 'nghiep', 'rep', 'rel', 'flag', 'kv', 'ax', 'bond', 'gan_bo', 'chet', 'roi', 'thu', 'tong', 'vat', 'no', 'tra_no'], // K1: gan_bo, chet, roi, thu, tong, vat, no, tra_no
    giaKeys: ['gold', 'hp', 'daoTam', 'kv'],
    stats: ['realm', 'daoTam', 'kv'],       // chi_so cho yếu tố vòng quay loại stat
    wheel: { zMin: 2, zMax: 4, min: -10, max: 15, giaMin: 1, giaMax: 5, kvHigh: 1 },
    // ---------- K1: bộ máy kịch bản (Q "giọng truyện" mục 2, 3, 4b, 6c, 7). kbOn=false: mọi thứ như trước K1 ----------
    kbOn: true,
    kb: {},                      // khuyết điểm gốc -> id kịch bản xương sống (loai 'kb'); chưa có thì dùng xương sống A cũ (bb_a2 trở đi)
    kbc: {
      giaCT: 24,                 // tối thiểu 24 tháng giữa hai cao trào; không hai cao trào cùng năm
      treTuoi: 3,                // năm: người chơi thụ động mà đã quá tuổi mở phần kế quá chừng này thì phần kế tự mở
      khoaKd: 2,                 // chỉ số phần (0 là phần 1) từ đó khuyết điểm gốc không đổi nữa
      doiKd: 2,                  // trục khác phải vượt trục của khuyết điểm hiện tại ít nhất chừng này điểm mới đổi
      trungDung: 3,              // không trục nào lệch quá chừng này: trung dung
      gb: 3,                     // luật ba lần: gắn bó tối thiểu trước khi nhịp tàn khốc được phép
      pAm: 0.1,                  // xác suất mỗi tháng mỗi người đủ điều kiện (xét bằng băm, không rng): khoảnh khắc ấm, tối đa 1 lần mỗi năm mỗi người
      thuNam: 3,                 // thư gửi tối thiểu cách nhau chừng này năm, mỗi người, khi khác vùng
      sauNhan: 20, sauDong: 40,  // lời dẫn: đọc chừng 20 giây; tự đóng sau 40 giây ở Cân bằng và Tự động (Thủ công chờ bấm Tiếp)
      lonGiay: 45,               // giây đếm ngược của hộp cảnh lớn ở chế độ Cân bằng (chữ dài hơn hộp thường)
      tt: { tieuVang: false },   // thử thách: gold chỉ là ngưỡng, trừ vàng khi đạt chỉ nếu thu_thach.tieu
      noMax: 10                  // nợ cộng dồn tối đa mỗi người
    },
    dan: {
      vai: ['than_nhan', 'ban', 'su', 'doi_thu', 'huynh', 'thuong', 'ke_thu', 'ke_thua'],
      codinh: ['than_nhan', 'ban', 'su', 'doi_thu', 'huynh', 'thuong'], // sáu vai cố định; ke_thu và ke_thua là vai mở (chỉ gán khi truyện đòi: fx.thu, fx.ke_thua, hoặc có kẻ thù thật)
      ten: { than_nhan: 'Thân nhân', ban: 'Bạn thuở nhỏ', su: 'Người dẫn đường', doi_thu: 'Đối thủ', huynh: 'Huynh đệ', thuong: 'Người thương', ke_thu: 'Kẻ thù định mệnh', ke_thua: 'Người kế thừa' }
    },
    // Khuyết điểm gốc (Q mục 1b): trục lệch nhất quyết định. dau: dấu của trục (âm là đầu "lo", dương là đầu "hi").
    kds: {
      boc_dong:  { n: 'Bốc đồng', truc: 'tinh', dau: -1, thuoc: 'nhẫn' },
      tho_o:     { n: 'Thờ ơ', truc: 'tinh', dau: 1, thuoc: 'dám' },
      kieu_hanh: { n: 'Kiêu hãnh', truc: 'xuthe', dau: -1, thuoc: 'sỉ nhục' },
      muu_mo:    { n: 'Mưu mô', truc: 'xuthe', dau: 1, thuoc: 'niềm tin' },
      vi_ky:     { n: 'Vị kỷ', truc: 'daoduc', dau: -1, thuoc: 'vị tha' },
      mem_long:  { n: 'Mềm lòng', truc: 'daoduc', dau: 1, thuoc: 'trách nhiệm' },
      luoi:      { n: 'Lười', truc: 'tudung', dau: -1, thuoc: 'kỷ luật và hy sinh' },
      lanh_lung: { n: 'Lạnh lùng', truc: 'tudung', dau: 1, thuoc: 'tình người' },
      ba_phai:   { n: 'Ba phải', truc: null, dau: 0, thuoc: 'đứng về một phía' }
    },
    // Cờ khinh_* (Q 1c luật 8): fx.flag 'khinh_<x>' ghi điều nhân vật từng khinh. Khi nhân vật làm đúng điều đó (trig), một người trong dàn nói thẳng ra.
    // trig: { gold? (vàng từ), chinh? (chinh khí từ trở xuống), flag? (cờ phản chiếu) }; vai: danh sách vai thử theo thứ tự (người đầu còn sống và có gắn bó ≥ 1).
    goiten: {
      khinh_giau: { trig: { gold: 800 }, vai: ['ban', 'huynh', 'than_nhan', 'su'], d: '{vai} nhìn túi vàng của bạn rồi nhìn bạn. "Ngày trước ngươi chê người giàu bẩn tay. Giờ tay ngươi sạch hơn bọn họ à?"', mat: 'Một phần nể trọng.', rel: -8, danh: -1 },
      khinh_phan: { trig: { flag: 'da_phan' }, vai: ['huynh', 'ban', 'doi_thu', 'su'], d: '{vai} không giận, chỉ cười nhạt. "Ngươi từng khinh kẻ phản bội ra mặt. Nhớ chứ? Giờ ngươi đứng đúng chỗ của hắn."', mat: 'Một người tin bạn.', rel: -10, danh: -1 },
      khinh_ta: { trig: { chinh: -25 }, vai: ['su', 'than_nhan', 'ban', 'doi_thu'], d: '{vai} im lặng rất lâu. "Có thời ngươi nhổ nước bọt khi nghe tên tà tu. Ta chỉ hỏi: ngươi khác họ ở chỗ nào?"', mat: 'Một lời tự bào chữa.', rel: -8, danh: -1 }
    },
    // Vật kỷ niệm (vật phẩm thật trong túi, không bán, không hiến): id -> { n, desc }. Đăng ký vào D.ITEMS ở js/systems/dan.js.
    vat: {
      chan_day: { n: 'Chiếc chăn dày', desc: 'Tấm chăn bạn đã đắp trong một đêm lạnh. Không bán được.' },
      giay_rom: { n: 'Đôi giày rơm', desc: 'Đôi giày mẹ ai đó đan bằng tay. Không bán được.' },
      thu_cu: { n: 'Lá thư cũ', desc: 'Nét chữ đã nhòe, giấy gấp đi gấp lại. Không bán được.' },
      kiem_go: { n: 'Thanh kiếm gỗ', desc: 'Thanh kiếm hai đứa trẻ từng giành nhau. Không bán được.' },
      chuoi_hat: { n: 'Chuỗi hạt sứt', desc: 'Chuỗi hạt thiếu mất một hạt. Không bán được.' },
      // AI1a: vật của khuôn "kiêu hãnh" (sợi chính, sợi phụ gương, sợi phụ thầy)
      bat_su_me: { n: 'Chiếc bát sứ mẻ', desc: 'Miệng bát mẻ một góc, rửa mãi vẫn còn mùi canh nguội. Không bán được.' },
      dep_rom: { n: 'Chiếc dép rơm bẹp', desc: 'Chiếc dép rơm bị giẫm bẹp, vuốt phẳng lại cũng không hết nếp. Không bán được.' },
      dong_xu: { n: 'Đồng xu cũ', desc: 'Một đồng xu bị ném xuống đất, mòn một mặt. Không bán được.' },
      dai_lua: { n: 'Dải lụa buộc chuôi kiếm', desc: 'Dải lụa phai màu, vẫn còn thơm mùi tay ai. Không bán được.' },
      luoc_go: { n: 'Chiếc lược gỗ', desc: 'Chiếc lược gỗ gãy một răng. Không bán được.' },
      kiem_go_su: { n: 'Thanh kiếm gỗ của thầy', desc: 'Thanh kiếm gỗ đầu tiên thầy đưa, cán mòn vì tay người cầm từ trước. Không bán được.' }
    },
    // Khoảnh khắc ấm (t: chữ, {ten} là bạn, {vai} là người ấy; ở: 'gan' cùng nơi, tuoi: [tuổi người chơi từ, đến]) và thư (khác vùng). Mỗi mục +1 gắn bó.
    am: [
      { id: 'ban_khoai', vai: 'ban', ts: 'gan', t: '{vai} để phần bạn nửa củ khoai nướng, vẫn còn ấm.' },
      { id: 'ban_diu', vai: 'ban', ts: 'gan', t: '{vai} dắt bạn ra bờ ruộng, chỉ cho xem tổ chim mới nở. Hai đứa ngồi im cho đến khi trời tối.' },
      { id: 'ban_hat', vai: 'ban', ts: 'gan', t: 'Bạn mệt, {vai} không hỏi gì, chỉ ngồi xuống cạnh bạn bên bậc cửa.' },
      { id: 'tn_com', vai: 'than_nhan', ts: 'gan', t: '{vai} múc cho bạn bát cơm đầy nhất, tự mình ăn phần cháy.' },
      { id: 'tn_ao', vai: 'than_nhan', ts: 'gan', t: '{vai} vá lại cái áo cũ cho bạn dưới ánh đèn dầu, kim chỉ chậm và kỹ.' },
      { id: 'tn_dan', vai: 'than_nhan', ts: 'gan', t: '{vai} dặn đi dặn lại bạn đủ thứ nhỏ nhặt. Bạn nghe mà thấy lòng yên.' },
      { id: 'su_cham', vai: 'su', ts: 'gan', t: '{vai} sửa lại tay bạn cầm bút, không nói lời nào, rồi gật đầu.' },
      { id: 'su_tra', vai: 'su', ts: 'gan', t: '{vai} rót cho bạn chén trà nóng sau buổi học, bảo "uống đi, kẻo nguội".' },
      { id: 'huynh_dua', vai: 'huynh', ts: 'gan', t: '{vai} kể chuyện cười đến nỗi cả phòng ôm bụng, rồi nháy mắt với bạn.' },
      { id: 'huynh_phan', vai: 'huynh', ts: 'gan', t: '{vai} nhường bạn chỗ ngồi gần bếp lửa, bảo mình không lạnh.' },
      { id: 'dt_nhin', vai: 'doi_thu', ts: 'gan', t: '{vai} lườm bạn, nhưng lúc bạn vấp, hắn đưa tay đỡ trước khi kịp nghĩ.' },
      { id: 'th_cuoi', vai: 'thuong', ts: 'gan', t: '{vai} cười với bạn qua khung cửa, như thể ngoài trời chưa từng có mưa.' },
      { id: 'th_dua', vai: 'thuong', ts: 'gan', t: '{vai} để lại cho bạn một nắm hoa dại, không nói là của ai.' }
    ],
    thu: [
      { id: 'th_tn', vai: 'than_nhan', t: '{vai} gửi thư: "Lúa năm nay được mùa. Mẹ vẫn để phòng con như cũ."' },
      { id: 'th_ban', vai: 'ban', t: '{vai} gửi thư: "Ở nhà không có gì lạ. Chỉ là cây hồng trước ngõ năm nay trĩu quả, ta nhớ ngươi."' },
      { id: 'th_su', vai: 'su', t: '{vai} gửi thư, chỉ có một dòng: "Giữ gìn thân thể. Việc đạo không vội."' },
      { id: 'th_huynh', vai: 'huynh', t: '{vai} gửi thư nguệch ngoạc: "Ta ổn. Ngươi có ăn đủ không đấy?"' },
      { id: 'th_dt', vai: 'doi_thu', t: '{vai} gửi thư, chỉ ghi: "Lần sau gặp, ta sẽ thắng." Dưới góc có một vết mực lem, như bàn tay vừa lau vội.' },
      { id: 'th_thuong', vai: 'thuong', t: '{vai} gửi thư và một cánh hoa ép khô: "Ở đây mùa hoa vừa tới."' }
    ],

    // ---------- AI1a: khuôn và kịch bản cụ thể (Q-khuon-kich-ban, Z 7d). khuonOn=false (hoặc kbOn=false): mọi thứ như sau K2 ----------
    khuonOn: true,
    khuon: {},                   // id khuôn chính -> khuôn (js/data/khuon/*.js, D.STORY.regKhuon)
    khuonKd: {},                 // khuyết điểm gốc -> id khuôn chính; chưa có khuôn thì dùng D.STORY.kb (K2) rồi xương sống A cũ
    phu: {},                     // id khuôn phụ -> khuôn phụ (D.STORY.regPhu)
    phuOn: false,                // true: khuôn phụ được mở và thay tuyến viết tay cùng chỗ (phu.thay); mặc định tắt cho tới khi K4 chuyển tuyến cũ
    // Mốc tuổi mở phần mặc định theo nhịp thật (Q-khuon-kich-ban 2.4): phàm nhân đến khoảng 50 tuổi mới vào Luyện Khí, khoảng 130 mới Trúc Cơ; thọ 70/130/260.
    tuoiPhan: [12, 30, 55, 85, 100, 115],
    // Tâm ma (kiểu lựa chọn tam_ma): chỉ hiện khi đạo tâm dưới `daoTam` hoặc đang mang đặc điểm tâm ma.
    tamMa: { daoTam: 35, trait: 'tam_ma' },
    phuGiaYen: 12,               // khuôn phụ chỉ mở khi cao trào chính gần nhất đã cách ≥ chừng này tháng và cao trào chính kế chưa tới hạn; không cao trào phụ nào trùng năm với cao trào chính
    // Thư viện kiểu lựa chọn (Q-khuon-kich-ban mục 0). Cơ chế CỐ ĐỊNH, bộ máy áp; AI/dòng dự phòng chỉ viết nhãn, mat, lời dẫn cho đúng kiểu.
    // ap(P) nhận P = { p (nhãn cờ: '3' cho cao trào phần 3, '3l' cho chặng leo), n (phần 1..6), truc, dau (trục và dấu của khuyết điểm), doi (vai dàn chịu hậu quả), cuu (vai dàn được cứu hoặc gắn bó), slot (vai trong chữ của người chịu hậu quả), truy? }
    // và trả { kind, ax?, fx, tre?, wheel?, tm? } theo khóa fx của K1. Kiểu "ngược khuyết điểm" đẩy trục sang phía kia bằng fx.ax (không qua khóa trái tính, để luôn còn đường chuộc);
    // kiểu thuận khuyết điểm dùng lc.ax cùng chiều khuyết điểm (thuận tay, không phí trái tính, nhưng đẩy sâu thêm).
    kieu: {
      phuc_tung: { n: 'Phục tùng', mo_ta: 'làm theo, chịu nhục để đạt điều cần', mat: 'Một phần sĩ diện.',
        ap: P => ({ kind: 'safe', fx: { rep: { danh: -(P.n >= 4 ? 2 : 1) }, flag: 'nhuc_p' + P.p, ax: P.truc ? { [P.truc]: -P.dau } : undefined } }) },
      chong: { n: 'Chống lại', mo_ta: 'chống lại trực diện', mat: 'Máu, hoặc một người đứng cạnh.',
        ap: P => ({ kind: 'fight', fx: { flag: 'p' + P.p + '_chong' },
          tre: [{ sau: [24, 60], fx: { hp: -12, rel: { vai: P.slot, d: -6 } }, log: '{' + P.slot + '} trả lại đòn năm xưa đúng lúc bạn không đề phòng.' }],
          wheel: { vung: [
            { w: 30, n: 'Bạn thua, bị thương nặng', fx: { hp: -30, daoTam: -2, no: { dan: P.doi, d: 2 } } },
            { w: 40, n: 'Hòa, cả hai đều thương tích', fx: { hp: -12 } },
            { w: 30, n: 'Bạn thắng', fx: { rep: { danh: 1 }, xp: 0.05, no: { dan: P.doi, d: 3 } } }
          ], yeu_to: { loai: 'stat', chi_so: 'realm', tran: 12 }, gia: 2 } }) },
      dao_thoat: { n: 'Đào thoát', mo_ta: 'bỏ chạy, trốn, mang người đi', mat: 'Một người ở lại chịu thay bạn.',
        ap: P => ({ kind: 'flee', fx: Object.assign({ no: { dan: P.doi, d: 3 }, rep: { danh: -1 }, flag: 'p' + P.p + '_dao_thoat' }, P.truy ? { tong: { truy: true } } : {}) }) },
      hy_sinh: { n: 'Hy sinh', mo_ta: 'đổi thứ mình quý lấy người khác', mat: 'Một thứ bạn quý, không lấy lại được.',
        ap: P => ({ kind: 'pay', fx: { xp: -Math.min(0.4, 0.1 + 0.05 * (P.n - 1)), gan_bo: { dan: P.cuu, d: 2 }, daoTam: 1, flag: 'p' + P.p + '_hy_sinh', ax: P.truc ? { [P.truc]: -P.dau } : undefined } }) },
      duong_tat: { n: 'Đường tắt', mo_ta: 'nhanh, bất lương', mat: 'Một món nợ không ghi sổ, nhưng sẽ có người đòi.',
        ap: P => ({ kind: 'risk', fx: { nghiep: 2, no: { dan: P.doi, d: 2 }, flag: 'p' + P.p + '_duong_tat' },
          tre: [{ sau: [24, 60], fx: { daoTam: -3, rep: { danh: -2 } }, log: 'Con đường tắt năm nào đòi lại: một lời đồn, một ánh nhìn, và đêm nào bạn cũng nhớ ra.' }] }) },
      im_lang: { n: 'Im lặng', mo_ta: 'không làm gì, giữ hòa khí', mat: 'Một lời bạn không nói, và một người phải chịu.',
        ap: P => ({ kind: 'safe', fx: { no: { dan: P.doi, d: 2 }, flag: 'p' + P.p + '_im_lang' },
          tre: [{ sau: [24, 60], fx: { rel: { vai: P.slot, d: -4 } }, log: 'Điều bạn đã im lặng năm xưa quay lại, nhẹ như một lời hỏi: "Hôm ấy ngươi ở đâu?"' }] }) },
      tin: { n: 'Tin', mo_ta: 'đặt niềm tin vào một người', mat: 'Một phần cảnh giác; người ấy có thể làm bạn thất vọng.',
        ap: P => ({ kind: 'help', fx: { gan_bo: { dan: P.cuu, d: 2 }, flag: 'p' + P.p + '_tin' } }) },
      dung_khuyet_diem: { n: 'Theo khuyết điểm', mo_ta: 'hành xử đúng khuyết điểm gốc', mat: 'Một lần nữa bạn làm đúng điều khiến bạn ra nông nỗi này.',
        ap: P => ({ kind: 'risk', ax: P.truc ? { [P.truc]: 2 * P.dau } : undefined, fx: { nghiep: 1, flag: 'p' + P.p + '_dung_khuyet_diem' } }) },
      tam_ma: { n: 'Tâm ma', mo_ta: 'lựa chọn của tâm ma, chỉ hiện khi đạo tâm thấp hoặc tâm ma nặng', mat: 'Điều bạn không dám nói ra.', tm: true,
        ap: P => ({ kind: 'risk', tm: true, ax: P.truc ? { [P.truc]: 3 * P.dau } : undefined, fx: { nghiep: 3, daoTam: -4, rep: { chinh: -4 }, no: { dan: P.doi, d: 3 }, flag: 'p' + P.p + '_tam_ma' } }) }
    },
    // Bảng xưng hô (AI1a, mục 5). qh: quan hệ giữa người chơi và một vai trong dàn. ta: người chơi tự xưng; goi: người chơi gọi người ấy; goi_lai: người ấy gọi người chơi; ve: tả người ấy
    // (nam/nu). goi và ve có biến thể theo giới của NGƯỜI ẤY, goi_lai theo giới của NGƯỜI CHƠI (n: nam, f: nữ). Quan hệ đổi theo cờ (fx.flag) hoặc trạng thái thật: xem TT.kb.xungSync.
    xung: {
      mac_dinh: { su: 'su_tro', huynh: 'huynh_de', thuong: 'nguoi_thuong', doi_thu: 'dong_mon', ke_thu: 'ke_thu', than_nhan: 'than_nhan', ban: 'ban' },
      qh: {
        su_tro:       { ta: 'đệ tử', goi: { n: 'sư phụ', f: 'sư phụ' }, goi_lai: 'con', ve: { n: 'ông', f: 'bà' } },
        huynh_de:     { ta: 'đệ', goi: { n: 'sư huynh', f: 'sư tỷ' }, goi_lai: 'sư đệ', ve: { n: 'huynh ấy', f: 'tỷ ấy' } },
        nguoi_thuong: { ta: 'ta', goi: { n: 'chàng', f: 'nàng' }, goi_lai: { n: 'chàng', f: 'nàng' }, ve: { n: 'chàng', f: 'nàng' } },
        dong_mon:     { ta: 'ta', goi: { n: 'ngươi', f: 'ngươi' }, goi_lai: 'ngươi', ve: { n: 'hắn', f: 'nàng' } },
        ke_thu:       { ta: 'ta', goi: { n: 'ngươi', f: 'ngươi' }, goi_lai: 'ngươi', ve: { n: 'hắn', f: 'ả' } },
        than_nhan:    { ta: 'con', goi: { n: 'cha', f: 'mẹ' }, goi_lai: 'con', ve: { n: 'ông', f: 'bà' } },
        ban:          { ta: 'ta', goi: { n: 'cậu', f: 'cậu' }, goi_lai: 'cậu', ve: { n: 'cậu ấy', f: 'cô ấy' } },
        ket_nghia:    { ta: 'đệ', goi: { n: 'huynh', f: 'tỷ' }, goi_lai: 'hiền đệ', ve: { n: 'huynh ấy', f: 'tỷ ấy' } },
        phan_boi:     { ta: 'ta', goi: { n: 'ngươi', f: 'ngươi' }, goi_lai: 'ngươi', ve: { n: 'kẻ ấy', f: 'ả ấy' } },
        phe_su:       { ta: 'ta', goi: { n: 'lão', f: 'bà ta' }, goi_lai: 'ngươi', ve: { n: 'lão', f: 'bà ta' } },
        dao_lu:       { ta: 'ta', goi: { n: 'phu quân', f: 'nương tử' }, goi_lai: { n: 'phu quân', f: 'nương tử' }, ve: { n: 'chàng', f: 'nàng' } }
      },
      // cờ (fx.flag) đổi quan hệ: 'phan_<vai>' phản bội, 'phe_su' phế sư, 'ket_nghia_<vai>' kết nghĩa; sp 'thu' thì ke_thu (xem TT.kb.xungSync)
      co: { phan: 'phan_boi', phe_su: 'phe_su', ket_nghia: 'ket_nghia' }
    },
    arcs: [], arcById: {},
    reg(arc) { D.STORY.arcs.push(arc); D.STORY.arcById[arc.id] = arc; return arc; },
    regKhuon(k) { D.STORY.khuon[k.id] = k; D.STORY.khuonKd[k.khuyet_diem] = k.id; return k; },
    regPhu(k) { D.STORY.phu[k.id] = k; return k; }
  };
})();
