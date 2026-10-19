// Công trình theo loại nơi, quy mô (hạn mức giao dịch), và cửa hàng bán/thu mua gì. Hình vẽ ở js/ui/bldart.js, logic ở js/systems/buildings.js.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  // Bộ công trình mặc định theo loại địa điểm (thương hội 'hoi' chỉ có khi có hội phủ vùng đó; 'rong' (hàng rong) xuất hiện ngẫu nhiên theo quý).
  D.PLACE_BLD = {
    thanh_tri: ['quan', 'cho', 'dan', 'khi', 'bua', 'thu', 'hoi', 'dgia', 'vo', 'yq', 'tuu', 'kho'],
    thon_tran: ['thon', 'cho', 'yq', 'tro'],
    ben: ['tau', 'cho', 'tro'],
    tram: ['tro', 'cho'],
    thuong_doan: ['hoi', 'cho', 'dan', 'khi', 'bua', 'thu', 'kho', 'tuu'],
    tong_mon: ['son', 'chap', 'duoc', 'tang', 'ngoai', 'dien', 'khoc', 'tran', 'bi'], // phố tông môn: hai trang (6 + 3)
    bo_toc: ['lang'],
    linh_mach: [], bi_canh: ['cua'], tan_tich: ['cua'], hung_dia: ['cua'],
    mo: ['ham', 'cho', 'khi'],
    phuong: ['khi', 'cho', 'ham'],
    cho_den: ['den', 'tuu'],
    cua_ai: ['ai'],
    tho_tu: [] // công trình là 'tho_' + id tín ngưỡng của nơi (xem TT.bld.at)
  };
  // Quy mô nơi: quyết định hạn mức giao dịch mỗi tháng (vàng x (1 + cảnh giới)) và lượng hàng tồn.
  D.PLACE_SIZE = { thanh_tri: 'thanh', thuong_doan: 'thanh', mo: 'tran', phuong: 'tran', cho_den: 'tran', thon_tran: 'lang', ben: 'lang', tram: 'lang', bo_toc: 'lang', tho_tu: 'lang' };
  D.TRADE_LIMIT = { lang: 50, tran: 150, thanh: 600, rong: 40 };
  D.STOCK_MUL = { lang: 0.5, tran: 1, thanh: 2, rong: 0.5 };
  // Nơi có thể gặp hàng rong (xác suất mỗi quý) và nơi chắc chắn không (thành lớn đã có chợ).
  D.RONG = { tram: 0.35, ben: 0.3, thon_tran: 0.3, bo_toc: 0.3, tan_tich: 0.25, hung_dia: 0.2, linh_mach: 0.2, mo: 0.15, phuong: 0.15 };

  // Hàng bán của từng cửa hàng (id vật phẩm). Sách và tâm đắc của Thư các, hàng chợ đen thêm sách phẩm cao, hàng rong chọn ngẫu nhiên.
  D.BSELL = {
    cho: ['hoi_xuan_dan', 'linh_thao', 'quang_thach', 'phu_giay', 'ao_da', 'mu_vai', 'kiem_sat'],
    dan: { thanh_tri: ['hoi_xuan_dan', 'tu_khi_dan', 'pha_canh_dan', 'linh_thao'], thuong_doan: ['hoi_xuan_dan', 'tu_khi_dan', 'pha_canh_dan', 'ngung_than_dan', 'ho_mach_dan', 'linh_thao'], def: ['hoi_xuan_dan', 'tu_khi_dan', 'linh_thao'] },
    khi: { thanh_tri: ['kiem_sat', 'ao_da', 'mu_vai', 'quang_thach'], thuong_doan: ['kiem_sat', 'kiem_tinh', 'ao_da', 'giap_linh', 'mu_vai', 'mu_sat', 'ngoc_boi', 'phu_truong', 'quang_thach', 'tinh_thiet', 'lo_linh'], phuong: ['kiem_sat', 'kiem_tinh', 'giap_linh', 'mu_sat', 'quang_thach', 'tinh_thiet'], mo: ['kiem_sat', 'quang_thach', 'tinh_thiet'], def: ['kiem_sat', 'quang_thach'] },
    bua: { thanh_tri: ['ho_than_bua', 'phu_giay'], thuong_doan: ['ho_than_bua', 'thoat_than_bua', 'cong_kich_bua', 'phu_giay'], def: ['ho_than_bua', 'phu_giay'] },
    hoi: ['hoi_xuan_dan', 'tu_khi_dan', 'linh_thao', 'quang_thach', 'tinh_thiet', 'phu_giay', 'yeu_dan'],
    den: ['pha_canh_dan', 'ngung_than_dan', 'ho_mach_dan', 'thoat_than_bua', 'kiem_linh', 'giap_tien', 'dao_quan', 'phu_truong', 'huyen_thiet', 'lo_bao', 'yeu_dan']
  };
  D.RONG_POOL = ['hoi_xuan_dan', 'tu_khi_dan', 'linh_thao', 'ho_than_bua', 'ngung_than_dan', 'tinh_thiet', 'yeu_dan', 'phu_giay', 'quang_thach', 'thoat_than_bua'];
  // Cửa hàng là loại có mua bán; còn lại là dịch vụ.
  D.SHOP_IDS = ['cho', 'dan', 'khi', 'bua', 'thu', 'hoi', 'den', 'rong'];
  D.SHOPS.rong = { buy: 1.2, sell: 0.4, items: [], books: [] }; // để mã cũ không lỗi khi gặp nơi chỉ có hàng rong
})();
