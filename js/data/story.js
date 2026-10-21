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
      chuoi_hat: { n: 'Chuỗi hạt sứt', desc: 'Chuỗi hạt thiếu mất một hạt. Không bán được.' }
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
    arcs: [], arcById: {},
    reg(arc) { D.STORY.arcs.push(arc); D.STORY.arcById[arc.id] = arc; return arc; }
  };
})();
