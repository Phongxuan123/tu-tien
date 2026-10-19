// Vật phẩm, cửa hàng và nghề chế tác. Túi đồ của nhân vật: c.inv = { idVậtPhẩm: số lượng }, trang bị: c.equip = { weapon, helm, armor, relic }.
// cat: dan (đan dược), bua (bùa chú), khi (pháp khí, có slot), lieu (nguyên liệu), sach (bí kíp), dac (tâm đắc nghề).
// m: hiệu chỉnh chỉ số khi trang bị (hpMax, atk, nl, luck, kv...). value: giá trị gốc tính bằng vàng.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.TIER_NAMES = ['hạ phẩm', 'trung phẩm', 'thượng phẩm', 'cực phẩm'];

  D.ITEMS = {
    // đan dược
    hoi_xuan_dan: { n: 'Hồi Xuân Đan', cat: 'dan', value: 25, desc: 'Uống để hồi một nửa sinh lực tối đa.' },
    tu_khi_dan: { n: 'Tụ Khí Đan', cat: 'dan', value: 70, desc: 'Uống để tăng một phần tu vi của cảnh giới hiện tại.' },
    pha_canh_dan: { n: 'Phá Cảnh Đan', cat: 'dan', value: 0, valueFn: c => TT.stats.pillCost(c), desc: 'Dùng khi đột phá: tăng xác suất thành công. Giá tăng theo cảnh giới.' },
    ngung_than_dan: { n: 'Ngưng Thần Đan', cat: 'dan', value: 160, desc: 'Dùng khi đột phá: giữ tâm thần ổn định, tăng 4% xác suất.' },
    ho_mach_dan: { n: 'Hộ Mạch Đan', cat: 'dan', value: 140, desc: 'Dùng khi đột phá: nếu thất bại thì giảm hẳn tổn thương và nguy cơ tử vong.' },
    // bùa chú
    ho_than_bua: { n: 'Hộ Thân Phù', cat: 'bua', value: 55, desc: 'Tự dùng trong trận chiến quan trọng: giảm 30% sát thương nhận vào.' },
    thoat_than_bua: { n: 'Thoát Thân Phù', cat: 'bua', value: 90, desc: 'Tự dùng khi bỏ chạy: chắc chắn thoát thân.' },
    cong_kich_bua: { n: 'Liệt Diễm Phù', cat: 'bua', value: 75, desc: 'Tự dùng trong trận chiến quan trọng: tăng 30% sát thương gây ra.' },
    // pháp khí: xem gear.js (mẫu kiem_sat, kiem_tinh, ao_da, mu_sat, ngoc_boi... và mã g|, r|, m| tự dựng)
    // nguyên liệu
    linh_thao: { n: 'Linh thảo', cat: 'lieu', value: 6, desc: 'Nguyên liệu luyện đan.' },
    quang_thach: { n: 'Khoáng thạch', cat: 'lieu', value: 8, desc: 'Nguyên liệu luyện khí.' },
    phu_giay: { n: 'Giấy bùa chu sa', cat: 'lieu', value: 7, desc: 'Nguyên liệu vẽ bùa.' },
    yeu_dan: { n: 'Yêu đan', cat: 'lieu', value: 30, desc: 'Nội đan của yêu thú, bán được giá.' },
    // tâm đắc nghề: tăng trần cấp nghề thêm 2 mỗi quyển
    tam_dac_kiem: { n: 'Tâm đắc kiếm đạo', cat: 'dac', craft: 'kiem', value: 400, desc: 'Đọc để nâng trần cấp kiếm đạo thêm 2.' },
    tam_dac_khi: { n: 'Tâm đắc luyện khí', cat: 'dac', craft: 'khi', value: 400, desc: 'Đọc để nâng trần cấp luyện khí thêm 2.' },
    tam_dac_dan: { n: 'Tâm đắc luyện đan', cat: 'dac', craft: 'dan', value: 400, desc: 'Đọc để nâng trần cấp luyện đan thêm 2.' },
    tam_dac_bua: { n: 'Tâm đắc vẽ bùa', cat: 'dac', craft: 'bua', value: 400, desc: 'Đọc để nâng trần cấp vẽ bùa thêm 2.' }
  };
  // Bí kíp công pháp được sinh từ D.TECHS ở techs.js (id "bk_<công pháp>").

  // Hiệu ứng khi dùng (đan dược dùng ngay). Trả về chữ kết quả.
  D.ITEM_USE = {
    hoi_xuan_dan: c => { const g = Math.round(TT.stats.hpMax(c) * 0.5); c.hp = Math.min(TT.stats.hpMax(c), c.hp + g); return 'Bạn uống Hồi Xuân Đan, sinh lực hồi ' + g + '.'; },
    // Dùng nhiều trong một năm thì nhờn thuốc: viên thứ n trong năm chỉ còn 1/(1 + 0,35 x (n - 1)) hiệu quả.
    tu_khi_dan: c => {
      const a = TT.age(c), y = c.pillY && c.pillY.a === a ? c.pillY : (c.pillY = { a, n: 0 }), k = 1 / (1 + 0.35 * y.n); y.n++;
      const g = TT.ev.NR(c) * 0.03 * k; TT.ev.xp(c, g);
      return 'Bạn uống Tụ Khí Đan, tu vi tăng ' + Math.round(g) + (k < 0.99 ? ' (nhờn thuốc, chỉ còn ' + Math.round(k * 100) + '% hiệu quả)' : '') + '.';
    }
  };

  // Chợ theo loại địa điểm: danh sách vật phẩm bán thường xuyên, hệ số giá mua và giá bán lại.
  D.SHOPS = {
    thanh_tri: { buy: 1.0, sell: 0.55, items: ['hoi_xuan_dan', 'tu_khi_dan', 'pha_canh_dan', 'ho_than_bua', 'kiem_sat', 'ao_da', 'mu_vai', 'linh_thao', 'quang_thach', 'phu_giay'], books: [0, 1] },
    thuong_doan: { buy: 0.9, sell: 0.62, items: ['hoi_xuan_dan', 'tu_khi_dan', 'pha_canh_dan', 'ngung_than_dan', 'ho_mach_dan', 'ho_than_bua', 'thoat_than_bua', 'cong_kich_bua', 'kiem_tinh', 'giap_linh', 'mu_sat', 'ngoc_boi', 'lo_linh', 'linh_thao', 'quang_thach', 'phu_giay'], books: [0, 1], dac: true },
    cho_den: { buy: 1.25, sell: 0.5, items: ['pha_canh_dan', 'ngung_than_dan', 'ho_mach_dan', 'thoat_than_bua', 'kiem_linh', 'giap_tien', 'dao_quan', 'phu_truong', 'huyen_thiet', 'lo_bao'], books: [2], dac: true },
    ben: { buy: 1.1, sell: 0.5, items: ['hoi_xuan_dan', 'ho_than_bua', 'linh_thao', 'phu_giay', 'ao_da'], books: [] },
    tram: { buy: 1.15, sell: 0.5, items: ['hoi_xuan_dan', 'linh_thao', 'quang_thach'], books: [] },
    mo: { buy: 0.85, sell: 0.55, items: ['quang_thach', 'tinh_thiet', 'kiem_sat', 'yeu_dan'], books: [] },
    phuong: { buy: 0.9, sell: 0.55, items: ['quang_thach', 'tinh_thiet', 'kiem_sat', 'kiem_tinh', 'giap_linh', 'mu_sat'], books: [] }
  };

  // Nghề chế tác. Cấp 0-10. elems: thuộc tính tư chất hợp. mat: nguyên liệu mỗi lần. sect: tông môn chuyên về nghề (học nhanh, qua cấp 3 cần
  // thành viên tông môn này hoặc tâm đắc). recipes: [cấp tối thiểu, vật phẩm, trọng số].
  D.CRAFTS = {
    kiem: { n: 'Kiếm đạo', elems: ['Kim', 'Phong', 'Lôi'], mat: null, sect: 'ts_kim_phong', desc: 'Rèn luyện kiếm ý: mỗi cấp tăng công kích và xác suất đột phá.' },
    khi: { n: 'Luyện khí', elems: ['Hỏa', 'Kim', 'Thổ', 'Dương'], mat: 'quang_thach', sect: 'hs_liet_hoa', desc: 'Rèn pháp khí để dùng hoặc bán (bản vẽ, vật liệu, lò: xem craft.js).' },
    dan: { n: 'Luyện đan', elems: ['Mộc', 'Thủy', 'Hỏa'], mat: 'linh_thao', sect: 'nl_bach_thao', desc: 'Luyện đan dược để dùng hoặc bán.',
      recipes: [[0, 'hoi_xuan_dan', 5], [2, 'tu_khi_dan', 4], [4, 'ngung_than_dan', 2], [4, 'ho_mach_dan', 2], [5, 'pha_canh_dan', 3]] },
    bua: { n: 'Vẽ bùa', elems: ['Âm', 'Dương', 'Lôi', 'Phong'], mat: 'phu_giay', sect: 'ld_tu_loi', desc: 'Vẽ bùa chú hỗ trợ chiến đấu và đào tẩu.',
      recipes: [[0, 'ho_than_bua', 4], [2, 'thoat_than_bua', 3], [4, 'cong_kich_bua', 3]] }
  };
})();
