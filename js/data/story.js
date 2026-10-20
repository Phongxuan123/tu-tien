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
// Chữ có khe {khe} (tên người ở vai) và {ten} (tên người chơi). Kiểm bằng tools/story-lint.js (TT.story.lint).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.STORY = {
    on: true,                    // false: mọi thứ chạy như cũ, baseline.js --story=off phải trùng khít
    evMul: 0.3,                 // nhân vào xác suất sự kiện lẻ của người chơi khi bật truyện (hộp truyện chiếm một phần nhịp quyết định)
    logGom: { on: true, rumorMonths: 36 }, // 8B2: gom năm trống (+0) và tin đồn lặp (cùng loại, cùng nơi trong rumorMonths) thành một dòng cuối năm
    gap: 2,                      // tối thiểu 2 tháng giữa hai hộp truyện (tối đa 1 hộp mỗi tháng, giữ nhịp ≤ 6 hộp/phút)
    timeout: 25,                 // giây đếm ngược của hộp chặng ở chế độ Cân bằng
    fit: { hop: 1.1, trai: 0.9 },// độ hợp (TT.nature.affinity) từ hop trở lên là chấm "hợp tính", dưới trai là "trái tính"
    // Khoảng cách tính cách (điểm trục ngược chiều với hướng của lựa chọn, theo lc.ax): từ traiAt thì trái tính (mất đạo tâm), từ khoaAt thì khóa hẳn (không chọn được, hiện lý do).
    traiAt: 4, khoaAt: 7,   // khóa hẳn chỉ ở đầu cực (±7 đến ±10, Q 6.5); 4 đến 6 là trái tính có phí
    trai: { daoTam: 1 },         // phí trái bản tính (Q 6.5): chọn lựa chọn trái tính thì mất bấy nhiêu đạo tâm
    loai: ['bb', 'tp', 'tg'],    // bb xương sống, tp tuyến thân phận, tg tuyến thế giới
    kinds: ['risk', 'safe', 'fight', 'flee', 'help', 'pay'],
    picks: ['gan', 'su', 'dong_ky'],
    fxKeys: ['gold', 'xp', 'hp', 'daoTam', 'nghiep', 'rep', 'rel', 'flag', 'kv', 'ax'],
    giaKeys: ['gold', 'hp', 'daoTam', 'kv'],
    stats: ['realm', 'daoTam', 'kv'],       // chi_so cho yếu tố vòng quay loại stat
    wheel: { zMin: 2, zMax: 4, min: -10, max: 15, giaMin: 1, giaMax: 5, kvHigh: 1 },
    arcs: [], arcById: {},
    reg(arc) { D.STORY.arcs.push(arc); D.STORY.arcById[arc.id] = arc; return arc; }
  };
})();
