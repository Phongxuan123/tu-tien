// Tài nguyên trên bản đồ: mỗi địa điểm có mức (0-3) cho các loại tài nguyên thu được. Mức sinh ra tất định từ loại địa điểm, vùng và mã địa điểm.
// linh (linh mạch) đọc từ chỉ số linh khí của địa điểm; ls, ore, herb, beast thu được bằng nghề và việc nhặt vật liệu (xem systems/resources.js).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.RES_IDS = ['linh', 'ls', 'ore', 'herb', 'beast'];
  D.RES = {
    linh: { n: 'Linh mạch', icon: '✧', col: '#6aa8ff', desc: 'Linh khí dày, tu luyện nhanh hơn (xem chỉ số linh khí).', short: 'mạch' },
    ls: { n: 'Mỏ linh thạch', icon: '◈', col: '#e8b84a', desc: 'Có linh thạch thô. Thợ mỏ thỉnh thoảng nhặt được một ít.', short: 'linh thạch' },
    ore: { n: 'Khoáng thạch', icon: '▲', col: '#a3adbb', desc: 'Quặng để luyện khí. Thợ mỏ và người luyện khí thu được nhiều hơn.', short: 'quặng' },
    herb: { n: 'Linh thảo', icon: '✿', col: '#6fd88a', desc: 'Dược liệu để luyện đan. Y sư và người luyện đan thu được nhiều hơn.', short: 'dược liệu' },
    beast: { n: 'Yêu thú', icon: 'Ψ', col: '#ef6a5a', desc: 'Nơi thú dữ sinh sống: nanh, da, nội đan. Thợ săn thu được nhiều hơn, cũng nguy hiểm hơn.', short: 'yêu thú' }
  };
  // Mức cơ bản theo loại địa điểm (địa điểm không có trong bảng thì không có tài nguyên).
  D.RES_BASE = {
    mo: { ls: 1, ore: 3 }, phuong: { ore: 2 }, linh_mach: { ls: 2, herb: 1 }, bi_canh: { herb: 2, beast: 2, ls: 1 }, hung_dia: { beast: 3, ore: 1 },
    tan_tich: { ls: 1, ore: 1 }, bo_toc: { beast: 2, herb: 1 }, thon_tran: { herb: 1, beast: 1 }
  };
  // Cộng thêm theo vùng (chỉ áp cho tài nguyên có sẵn; thôn trấn và cứ địa được mở thêm loại đặc sản của vùng).
  D.RES_REGION = {
    trung_chau: {}, dong_hai: { beast: 1 }, tay_son: { ore: 1 }, nam_lam: { herb: 1, beast: 1 }, bac_bang: { beast: 1 },
    hoa_son: { ore: 1, ls: 1 }, hoang_mac: { ls: 1 }, vu_trach: { herb: 1 }, loi_dao: {}
  };
  // Khu tài nguyên: vệ tinh nối với địa điểm chủ bằng đường mòn (vẽ vạch đứt trên bản đồ).
  D.RES_ZONE = {
    perRegion: 6, dist: 80, minGap: 46,
    names: {
      ore: ['Vỉa quặng', 'Hang quặng', 'Mỏ hoang'], herb: ['Bãi thảo dược', 'Thung linh thảo', 'Rừng thuốc'],
      beast: ['Săn trường', 'Rừng thú', 'Hang yêu thú'], ls: ['Vỉa linh thạch', 'Mạch linh thạch']
    },
    danger: { ore: 1, herb: 1, beast: 3, ls: 2 }
  };
  D.RES_RULES = {
    mul: [0.35, 0.7, 1.15, 1.7],   // hệ số thu hoạch theo mức (mức 0 vẫn lượm lặt được chút ít)
    regen: 12,                     // kho tài nguyên hồi mỗi năm (trên 100)
    takeOre: 1.5, takeHerb: 1.5, takeBeast: 2, takeLs: 1, // hao kho mỗi lần thu được vật phẩm
    lsGain: 0.03                   // xác suất mỗi tháng thợ mỏ nhặt được linh thạch thô (nhân hệ số), chỉ ở nơi có mỏ linh thạch
  };
})();
