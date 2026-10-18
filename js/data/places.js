// 90 địa điểm của 9 bản đồ nhỏ (mỗi vùng 10 địa điểm) và đường đi giữa chúng.
// Hàng địa điểm: [id, tên, loại, thế lực]. Loại: thanh_tri, thon_tran, ben, tram, thuong_doan, tong_mon, bo_toc,
// linh_mach, bi_canh, tan_tich, hung_dia, mo, phuong, cho_den, cua_ai.
// Mỗi vùng: gate là địa điểm Cửa ải, portal là địa điểm có truyền tống trận cổ.
// Đường đi: [địa điểm A, địa điểm B, số tháng].
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.PLACE_TYPES = {
    thanh_tri: { n: 'Thành trì', linh: 0, danger: -1, rich: 2, cls: 'city' },
    thon_tran: { n: 'Thôn trấn', linh: -1, danger: -1, rich: -1, cls: 'town' },
    ben: { n: 'Bến', linh: 0, danger: 0, rich: 1, cls: 'port' },
    tram: { n: 'Trạm nghỉ', linh: 0, danger: 0, rich: 1, cls: 'port' },
    thuong_doan: { n: 'Thương đoàn', linh: 0, danger: 0, rich: 2, cls: 'guild' },
    tong_mon: { n: 'Tông môn', linh: 1, danger: -1, rich: 0, cls: 'sect' },
    bo_toc: { n: 'Cứ địa bộ tộc', linh: 0, danger: 0, rich: -1, cls: 'tribe' },
    linh_mach: { n: 'Linh mạch', linh: 2, danger: 1, rich: -1, cls: 'vein' },
    bi_canh: { n: 'Bí cảnh', linh: 1, danger: 2, rich: -1, cls: 'secret' },
    tan_tich: { n: 'Tàn tích', linh: 0, danger: 2, rich: -1, cls: 'ruin' },
    hung_dia: { n: 'Hung địa', linh: 0, danger: 2, rich: -1, cls: 'ruin' },
    mo: { n: 'Mỏ', linh: 0, danger: 1, rich: 1, cls: 'mine' },
    phuong: { n: 'Phường', linh: 0, danger: 1, rich: 1, cls: 'mine' },
    cho_den: { n: 'Chợ đen', linh: 0, danger: 1, rich: 1, cls: 'market' },
    cua_ai: { n: 'Cửa ải', linh: 0, danger: 0, rich: 0, cls: 'gate' }
  };

  // Vai trò NPC phụ theo loại địa điểm: [chức danh, cảnh giới thấp nhất, cảnh giới cao nhất]
  D.ROLES = {
    thanh_tri: [['Quan trấn thành', 1, 2], ['Chưởng quầy tửu lâu', 0, 1]],
    thon_tran: [['Trưởng thôn', 0, 1]],
    ben: [['Bến chủ', 0, 1]],
    tram: [['Chủ trạm', 0, 1]],
    thuong_doan: [['Hội trưởng', 2, 3]],
    tong_mon: [['Chưởng môn', 3, 4], ['Trưởng lão', 2, 3], ['Trưởng lão', 2, 3]],
    bo_toc: [['Tộc trưởng', 2, 3]],
    linh_mach: [['Thủ mạch nhân', 2, 3]],
    bi_canh: [['Người canh cửa bí cảnh', 2, 3]],
    tan_tich: [['Lão ẩn sĩ', 1, 2]],
    hung_dia: [['Thợ săn kỳ cựu', 1, 2]],
    mo: [['Cai mỏ', 0, 1]],
    phuong: [['Chủ phường', 1, 2]],
    cho_den: [['Chủ chợ đen', 1, 2]],
    cua_ai: [['Thủ ải', 3, 4]]
  };

  D.MAPS = {
    trung_chau: {
      gate: 'tc_thien_mon', portal: 'tc_co_dao',
      places: [
        ['tc_vinh_do', 'Vĩnh Đô', 'thanh_tri', 'Đại Vĩnh Quốc'],
        ['tc_te_thanh', 'Tề Thành', 'thanh_tri', 'Tề Lương Quốc'],
        ['tc_luc_chau', 'Lục Châu Trấn', 'thon_tran', 'Đại Vĩnh Quốc'],
        ['tc_thanh_ha', 'Thanh Hà Thôn', 'thon_tran', 'Đại Vĩnh Quốc'],
        ['tc_hoang_ha', 'Hoàng Hà Độ', 'ben', 'Đại Vĩnh Quốc'],
        ['tc_van_bao', 'Vạn Bảo Thương Hội', 'thuong_doan', 'Vạn Bảo Thương Hội'],
        ['tc_thanh_van', 'Thanh Vân Tông', 'tong_mon', 'Thanh Vân Tông (chính đạo)'],
        ['tc_hac_thi', 'Hắc Thị', 'cho_den', 'Không thuộc ai'],
        ['tc_co_dao', 'Cổ Đạo Quán', 'tan_tich', 'Đạo quán hoang, có truyền tống trận cổ'],
        ['tc_thien_mon', 'Thiên Môn Quan', 'cua_ai', 'Đại Vĩnh Quốc']
      ],
      roads: [['tc_vinh_do', 'tc_te_thanh', 2], ['tc_vinh_do', 'tc_luc_chau', 1], ['tc_vinh_do', 'tc_hoang_ha', 1], ['tc_vinh_do', 'tc_hac_thi', 1],
        ['tc_vinh_do', 'tc_thien_mon', 2], ['tc_hoang_ha', 'tc_van_bao', 1], ['tc_luc_chau', 'tc_thanh_ha', 1], ['tc_te_thanh', 'tc_thanh_van', 2],
        ['tc_thanh_ha', 'tc_co_dao', 2]]
    },
    dong_hai: {
      gate: 'dh_quan', portal: 'dh_vo_vong',
      places: [
        ['dh_lam_cang', 'Lam Cảng', 'thanh_tri', 'Lam Hải Quốc'],
        ['dh_bach_sa', 'Bạch Sa Ngư Thôn', 'thon_tran', 'Lam Hải Quốc'],
        ['dh_hai_van', 'Hải Vận Thương Đoàn', 'thuong_doan', 'Hải Vận Thương Đoàn'],
        ['dh_thuy_nguyet', 'Thủy Nguyệt Cung', 'tong_mon', 'Thủy Nguyệt Cung (chính đạo)'],
        ['dh_giao_nhan', 'Giao Nhân Đảo', 'bo_toc', 'Giao Nhân tộc'],
        ['dh_hac_phan', 'Hắc Phàm Đảo', 'bo_toc', 'Hải tặc Hắc Phàm'],
        ['dh_trieu_am', 'Triều Âm Động', 'linh_mach', 'Không thuộc ai'],
        ['dh_san_ho', 'San Hô Long Quật', 'bi_canh', 'Không thuộc ai'],
        ['dh_vo_vong', 'Vô Vọng Đảo', 'tan_tich', 'Di tích cổ, có truyền tống trận'],
        ['dh_quan', 'Đông Hải Quan', 'cua_ai', 'Lam Hải Quốc']
      ],
      roads: [['dh_lam_cang', 'dh_bach_sa', 1], ['dh_lam_cang', 'dh_hai_van', 1], ['dh_lam_cang', 'dh_thuy_nguyet', 2], ['dh_lam_cang', 'dh_quan', 2],
        ['dh_bach_sa', 'dh_trieu_am', 1], ['dh_hai_van', 'dh_giao_nhan', 2], ['dh_hai_van', 'dh_hac_phan', 3], ['dh_giao_nhan', 'dh_san_ho', 2],
        ['dh_hac_phan', 'dh_vo_vong', 2]]
    },
    tay_son: {
      gate: 'ts_thien_lo', portal: 'ts_tuyet_linh',
      places: [
        ['ts_son_quan', 'Sơn Quan Thành', 'thanh_tri', 'Thiên Sơn Vương Quốc'],
        ['ts_thien_ma', 'Thiên Mã Trấn', 'thon_tran', 'Thiên Sơn Vương Quốc'],
        ['ts_ma_dao', 'Mã Đạo Thương Đoàn', 'thuong_doan', 'Mã Đạo Thương Đoàn'],
        ['ts_kim_phong', 'Kim Phong Môn', 'tong_mon', 'Kim Phong Môn (kiếm tu)'],
        ['ts_ung_son', 'Ưng Sơn Trại', 'bo_toc', 'Ưng tộc'],
        ['ts_han_thiet', 'Hàn Thiết Mỏ', 'mo', 'Thiên Sơn Vương Quốc'],
        ['ts_van_dinh', 'Vân Đỉnh Phong', 'linh_mach', 'Không thuộc ai'],
        ['ts_thien_kiem', 'Thiên Kiếm Tuyệt Bích', 'bi_canh', 'Không thuộc ai'],
        ['ts_tuyet_linh', 'Tuyết Lĩnh Đạo Quán', 'tan_tich', 'Đạo quán trên tuyết, có truyền tống trận cổ'],
        ['ts_thien_lo', 'Thiên Lộ Quan', 'cua_ai', 'Thiên Sơn Vương Quốc']
      ],
      roads: [['ts_son_quan', 'ts_thien_ma', 1], ['ts_son_quan', 'ts_kim_phong', 2], ['ts_son_quan', 'ts_han_thiet', 2], ['ts_son_quan', 'ts_thien_lo', 3],
        ['ts_thien_ma', 'ts_ma_dao', 1], ['ts_kim_phong', 'ts_van_dinh', 2], ['ts_van_dinh', 'ts_ung_son', 2], ['ts_van_dinh', 'ts_thien_kiem', 3],
        ['ts_han_thiet', 'ts_tuyet_linh', 3]]
    },
    nam_lam: {
      gate: 'nl_quan', portal: 'nl_yeu_thu',
      places: [
        ['nl_thanh_diep', 'Thanh Diệp Thành', 'thanh_tri', 'Thanh Diệp Quốc'],
        ['nl_mang_lam', 'Mãng Lâm Thôn', 'thon_tran', 'Thanh Diệp Quốc'],
        ['nl_duoc_vuong', 'Dược Vương Hội', 'thuong_doan', 'Dược Vương Hội'],
        ['nl_bach_thao', 'Bách Thảo Môn', 'tong_mon', 'Bách Thảo Môn (đan dược)'],
        ['nl_thanh_lang', 'Thanh Lang Doanh', 'bo_toc', 'Thanh Lang tộc'],
        ['nl_linh_duoc', 'Linh Dược Cốc', 'mo', 'Không thuộc ai'],
        ['nl_co_thu', 'Cổ Thụ Vương', 'linh_mach', 'Không thuộc ai'],
        ['nl_me_vu', 'Mê Vụ Lâm', 'bi_canh', 'Không thuộc ai'],
        ['nl_yeu_thu', 'Yêu Thú Chiến Trường', 'hung_dia', 'Chiến trường cổ, có truyền tống trận'],
        ['nl_quan', 'Nam Lâm Quan', 'cua_ai', 'Thanh Diệp Quốc']
      ],
      roads: [['nl_thanh_diep', 'nl_mang_lam', 1], ['nl_thanh_diep', 'nl_duoc_vuong', 1], ['nl_thanh_diep', 'nl_bach_thao', 2], ['nl_thanh_diep', 'nl_quan', 2],
        ['nl_mang_lam', 'nl_thanh_lang', 2], ['nl_bach_thao', 'nl_linh_duoc', 2], ['nl_linh_duoc', 'nl_co_thu', 2], ['nl_thanh_lang', 'nl_yeu_thu', 2],
        ['nl_co_thu', 'nl_me_vu', 3]]
    },
    bac_bang: {
      gate: 'bb_han_phong', portal: 'bb_co_than',
      places: [
        ['bb_han_thanh', 'Hàn Thành', 'thanh_tri', 'Bắc Hàn Vương Quốc'],
        ['bb_phu_bang', 'Phù Băng Thôn', 'thon_tran', 'Bắc Hàn Vương Quốc'],
        ['bb_bang_phach', 'Băng Phách Thương Đoàn', 'thuong_doan', 'Băng Phách Thương Đoàn'],
        ['bb_huyen_bang', 'Huyền Băng Cung', 'tong_mon', 'Huyền Băng Cung'],
        ['bb_tuyet_nhan', 'Tuyết Nhân Doanh', 'bo_toc', 'Tuyết Nhân tộc'],
        ['bb_cuc_quang', 'Cực Quang Đài', 'linh_mach', 'Không thuộc ai'],
        ['bb_van_nien', 'Vạn Niên Băng Động', 'bi_canh', 'Không thuộc ai'],
        ['bb_co_than', 'Cổ Thần Thi Địa', 'tan_tich', 'Xác thần cổ, có truyền tống trận'],
        ['bb_thu_san', 'Thú Săn Trường', 'hung_dia', 'Bầy thú băng'],
        ['bb_han_phong', 'Hàn Phong Quan', 'cua_ai', 'Bắc Hàn Vương Quốc']
      ],
      roads: [['bb_han_thanh', 'bb_phu_bang', 1], ['bb_han_thanh', 'bb_bang_phach', 2], ['bb_han_thanh', 'bb_huyen_bang', 3], ['bb_han_thanh', 'bb_han_phong', 3],
        ['bb_phu_bang', 'bb_thu_san', 2], ['bb_huyen_bang', 'bb_cuc_quang', 3], ['bb_cuc_quang', 'bb_tuyet_nhan', 3], ['bb_cuc_quang', 'bb_van_nien', 3],
        ['bb_tuyet_nhan', 'bb_co_than', 3]]
    },
    hoa_son: {
      gate: 'hs_hac_diem', portal: 'hs_dia_hoa',
      places: [
        ['hs_nham_thanh', 'Nham Thành', 'thanh_tri', 'Chu Nham Quốc'],
        ['hs_tro_thon', 'Tro Thôn', 'thon_tran', 'Chu Nham Quốc'],
        ['hs_hoa_khoang', 'Hỏa Khoáng Hội', 'thuong_doan', 'Hỏa Khoáng Hội'],
        ['hs_liet_hoa', 'Liệt Hỏa Tông', 'tong_mon', 'Liệt Hỏa Tông'],
        ['hs_thach_hoa', 'Thạch Hỏa Tộc Cốc', 'bo_toc', 'Thạch Hỏa tộc'],
        ['hs_luyen_khi', 'Luyện Khí Phường', 'phuong', 'Liệt Hỏa Tông'],
        ['hs_dung_nham', 'Dung Nham Trì', 'linh_mach', 'Không thuộc ai'],
        ['hs_hoa_long', 'Hỏa Long Huyệt', 'bi_canh', 'Không thuộc ai'],
        ['hs_dia_hoa', 'Địa Hỏa Đạo Quán', 'tan_tich', 'Đạo quán trên mạch lửa, có truyền tống trận cổ'],
        ['hs_hac_diem', 'Hắc Diệm Quan', 'cua_ai', 'Chu Nham Quốc']
      ],
      roads: [['hs_nham_thanh', 'hs_tro_thon', 1], ['hs_nham_thanh', 'hs_hoa_khoang', 1], ['hs_nham_thanh', 'hs_liet_hoa', 2], ['hs_nham_thanh', 'hs_hac_diem', 2],
        ['hs_liet_hoa', 'hs_luyen_khi', 1], ['hs_liet_hoa', 'hs_dung_nham', 2], ['hs_dung_nham', 'hs_hoa_long', 3], ['hs_hoa_khoang', 'hs_thach_hoa', 2],
        ['hs_tro_thon', 'hs_dia_hoa', 2]]
    },
    hoang_mac: {
      gate: 'hm_tay_hoang', portal: 'hm_co_thanh',
      places: [
        ['hm_kim_sa', 'Kim Sa Thành', 'thanh_tri', 'Kim Hoàng Sa Quốc'],
        ['hm_oc_dao', 'Ốc Đảo Thôn', 'thon_tran', 'Kim Hoàng Sa Quốc'],
        ['hm_lac_da', 'Lạc Đà Thương Đoàn', 'thuong_doan', 'Lạc Đà Thương Đoàn'],
        ['hm_dich_tram', 'Lạc Đà Dịch Trạm', 'tram', 'Lạc Đà Thương Đoàn'],
        ['hm_nhat_luan', 'Nhật Luân Giáo', 'tong_mon', 'Nhật Luân Giáo'],
        ['hm_sa_lang', 'Sa Lang Doanh', 'bo_toc', 'Sa Lang tộc'],
        ['hm_kim_mo', 'Kim Sa Mỏ', 'mo', 'Kim Hoàng Sa Quốc'],
        ['hm_bao_cat', 'Bão Cát Mê Cung', 'bi_canh', 'Không thuộc ai'],
        ['hm_co_thanh', 'Cổ Thành Chôn Cát', 'tan_tich', 'Thành cổ chôn cát, có truyền tống trận'],
        ['hm_tay_hoang', 'Tây Hoang Quan', 'cua_ai', 'Kim Hoàng Sa Quốc']
      ],
      roads: [['hm_kim_sa', 'hm_oc_dao', 1], ['hm_kim_sa', 'hm_lac_da', 1], ['hm_kim_sa', 'hm_nhat_luan', 2], ['hm_kim_sa', 'hm_tay_hoang', 3],
        ['hm_lac_da', 'hm_dich_tram', 2], ['hm_dich_tram', 'hm_kim_mo', 2], ['hm_dich_tram', 'hm_sa_lang', 3], ['hm_sa_lang', 'hm_bao_cat', 3],
        ['hm_nhat_luan', 'hm_co_thanh', 3]]
    },
    vu_trach: {
      gate: 'vt_quan', portal: 'vt_co_mieu',
      places: [
        ['vt_vu_thanh', 'Vụ Thành', 'thanh_tri', 'Vụ Thành Hội (tự quản)'],
        ['vt_coc_thon', 'Cọc Thôn', 'thon_tran', 'Vụ Thành Hội'],
        ['vt_hac_thi', 'Hắc Thị Trạch', 'cho_den', 'Thương đoàn Thuyền Bóng'],
        ['vt_am_hon', 'Âm Hồn Giáo', 'tong_mon', 'Âm Hồn Giáo (tà đạo)'],
        ['vt_doc_thuy', 'Độc Thủy Tộc Doanh', 'bo_toc', 'Độc Thủy tộc'],
        ['vt_suong_mu', 'Sương Mù Cốc', 'linh_mach', 'Không thuộc ai'],
        ['vt_quy_mo', 'Quỷ Mộ Đầm', 'bi_canh', 'Không thuộc ai'],
        ['vt_co_mieu', 'Cổ Miếu Ma', 'tan_tich', 'Miếu bị ma ám, có truyền tống trận cổ'],
        ['vt_rung_chet', 'Rừng Chết', 'hung_dia', 'Thú ma'],
        ['vt_quan', 'Vụ Trạch Quan', 'cua_ai', 'Vụ Thành Hội']
      ],
      roads: [['vt_vu_thanh', 'vt_coc_thon', 1], ['vt_vu_thanh', 'vt_hac_thi', 1], ['vt_vu_thanh', 'vt_am_hon', 2], ['vt_vu_thanh', 'vt_quan', 3],
        ['vt_coc_thon', 'vt_doc_thuy', 2], ['vt_am_hon', 'vt_suong_mu', 2], ['vt_suong_mu', 'vt_quy_mo', 3], ['vt_hac_thi', 'vt_co_mieu', 2],
        ['vt_doc_thuy', 'vt_rung_chet', 2]]
    },
    loi_dao: {
      gate: 'ld_quan', portal: 'ld_thien_phat',
      places: [
        ['ld_phong_loi', 'Phong Lôi Cảng', 'thanh_tri', 'Phong Lôi Đảo Quốc'],
        ['ld_loi_am', 'Lôi Âm Ngư Thôn', 'thon_tran', 'Phong Lôi Đảo Quốc'],
        ['ld_thuyen_phong', 'Thuyền Phong Thương Đoàn', 'thuong_doan', 'Thuyền Phong Thương Đoàn'],
        ['ld_tu_loi', 'Tử Lôi Quan', 'tong_mon', 'Tử Lôi Quan'],
        ['ld_dieu_sao', 'Lôi Điểu Sào', 'bo_toc', 'Lôi Điểu tộc'],
        ['ld_loi_tri', 'Lôi Trì', 'linh_mach', 'Không thuộc ai'],
        ['ld_mat_bao', 'Mắt Bão', 'bi_canh', 'Không thuộc ai'],
        ['ld_thien_phat', 'Tàn Tích Thiên Phạt', 'tan_tich', 'Di tích cổ, có truyền tống trận'],
        ['ld_da_set', 'Đá Hút Sét Phường', 'phuong', 'Tử Lôi Quan'],
        ['ld_quan', 'Lôi Đảo Quan', 'cua_ai', 'Phong Lôi Đảo Quốc']
      ],
      roads: [['ld_phong_loi', 'ld_loi_am', 1], ['ld_phong_loi', 'ld_thuyen_phong', 1], ['ld_phong_loi', 'ld_tu_loi', 2], ['ld_phong_loi', 'ld_quan', 2],
        ['ld_tu_loi', 'ld_loi_tri', 2], ['ld_loi_tri', 'ld_dieu_sao', 3], ['ld_loi_tri', 'ld_da_set', 2], ['ld_dieu_sao', 'ld_mat_bao', 3],
        ['ld_loi_am', 'ld_thien_phat', 3]]
    }
  };
})();
