// Công pháp theo thuộc tính (có yêu cầu điểm tư chất và cảnh giới) và tâm pháp (bị động, tốn đạo điểm).
// Tên đều tự đặt. tier 0-3 (trắng, xanh, vàng, tím). Công pháp chính làm tu luyện nhanh hơn và cộng công kích; cấp luyện 0-9.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  // pts: điểm tư chất tối thiểu ở thuộc tính tương ứng; realm: cảnh giới tối thiểu.
  const T = [
    ['duong_khi', 'Dưỡng Khí Thổ Nạp Thuật', null, 0, 0, 'Pháp môn căn bản của mọi tu sĩ, ai học cũng được.'],
    ['ngu_hanh', 'Ngũ Hành Dung Hòa Quyết', null, 1, 1, 'Dành cho người tạp linh căn, dung hợp nhiều thuộc tính (cần từ 3 thuộc tính trở lên).'],
    ['han_thiet', 'Hàn Thiết Quyết', 'Kim', 0, 15, 'Luyện khí kim cương, thân cứng như sắt.'],
    ['tinh_mang', 'Tinh Mang Kiếm Pháp', 'Kim', 1, 35, 'Kiếm pháp sắc lạnh, kiếm khí như sao băng.'],
    ['thanh_dang', 'Thanh Đằng Công', 'Mộc', 0, 15, 'Dẫn sinh khí cây cỏ vào kinh mạch.'],
    ['van_moc', 'Vạn Mộc Hồi Xuân Kinh', 'Mộc', 1, 35, 'Hồi phục thần tốc, sinh sôi không dứt.'],
    ['luu_thuy', 'Lưu Thủy Tâm Kinh', 'Thủy', 0, 15, 'Tâm như nước chảy, tu luyện êm dịu bền bỉ.'],
    ['trieu_am', 'Triều Âm Đạo Quyết', 'Thủy', 1, 35, 'Mượn thế sóng triều, khi dâng khi lặng.'],
    ['xich_diem', 'Xích Diệm Công', 'Hỏa', 0, 15, 'Luyện hỏa khí, nóng bỏng mà dữ dội.'],
    ['phan_thien', 'Phần Thiên Chân Kinh', 'Hỏa', 1, 35, 'Hỏa diệm thiêu đốt cả trời.'],
    ['hau_tho', 'Hậu Thổ Trầm Công', 'Thổ', 0, 15, 'Vững như đất dày, tu hành vững chắc.'],
    ['son_nhac', 'Sơn Nhạc Bất Động Quyết', 'Thổ', 1, 35, 'Thân như núi, bất động trước mọi đòn.'],
    ['tat_phong', 'Tật Phong Bộ Pháp', 'Phong', 0, 15, 'Thân pháp nhanh như gió.'],
    ['ngu_phong', 'Ngự Phong Chân Quyết', 'Phong', 1, 35, 'Cưỡi gió mà đi, ý động phong sinh.'],
    ['tu_tieu', 'Tử Tiêu Lôi Quyết', 'Lôi', 1, 30, 'Dẫn lôi khí tôi luyện thân thể.'],
    ['cuu_thien', 'Cửu Thiên Dẫn Lôi Pháp', 'Lôi', 2, 55, 'Gọi sấm sét chín tầng trời.'],
    ['huyen_bang', 'Huyền Băng Quyết', 'Băng', 1, 30, 'Băng khí thấu xương, tâm lạnh như tuyết.'],
    ['cuc_han', 'Cực Hàn Chân Kinh', 'Băng', 2, 55, 'Hàn khí cực điểm, đóng băng vạn vật.'],
    ['u_minh', 'U Minh Quyết', 'Âm', 1, 30, 'Mượn âm khí, ẩn hiện như quỷ mị.'],
    ['hon_phach', 'Hồn Phách Luyện Pháp', 'Âm', 2, 55, 'Luyện hồn phách, thao túng thần thức.'],
    ['liet_duong', 'Liệt Dương Công', 'Dương', 1, 30, 'Hút dương khí, nóng rực như mặt trời nhỏ.'],
    ['thai_duong', 'Thái Dương Chân Kinh', 'Dương', 2, 55, 'Thái dương thần công, chiếu sáng vạn dặm.'],
    ['thien_cuong', 'Thiên Cương Địa Sát Quyết', null, 2, 1, 'Pháp môn thượng thừa, cần nền tảng vững (từ Trúc Cơ).'],
    ['hu_khong', 'Hư Không Đại Pháp', null, 3, 1, 'Đạo pháp tối cao, chỉ dành cho cường giả (từ Kim Đan).']
  ];
  const BASE_TRAIN = [0.08, 0.18, 0.30, 0.45];
  const REQ_REALM = [0, 1, 2, 3];
  D.TECHS = T.map(r => ({
    id: r[0], n: r[1], elem: r[2], tier: r[3], pts: r[4], desc: r[5],
    realm: r[0] === 'ngu_hanh' ? 1 : REQ_REALM[r[3]], multi: r[0] === 'ngu_hanh' ? 3 : 0,
    train: BASE_TRAIN[r[3]], atk: 2 + 3 * r[3]
  }));
  D.techById = {};
  D.TECHS.forEach(t => { D.techById[t.id] = t; });

  // Bí kíp công pháp = vật phẩm "bk_<id>". Giá theo phẩm.
  const BOOK_VALUE = [60, 250, 900, 3000];
  D.TECHS.forEach(t => {
    D.ITEMS['bk_' + t.id] = { n: 'Bí kíp: ' + t.n, cat: 'sach', tech: t.id, tier: t.tier, value: BOOK_VALUE[t.tier], desc: 'Đọc để học công pháp ' + t.n + ' (' + D.TIER_NAMES[t.tier] + '). ' + t.desc };
  });

  // Tâm pháp: cost đạo điểm, req đạo tâm và cảnh giới, m là hiệu chỉnh chỉ số (brk, nl, hpMax, luck, train, life, tm = chống tâm ma).
  D.XINFA = [
    { id: 'tinh_tam', n: 'Tĩnh Tâm Chú', cost: 5, daoTam: 0, realm: 0, m: { nl: 5 }, desc: 'Niệm lực +5.' },
    { id: 'kim_cang', n: 'Kim Cang Bất Hoại Tâm Pháp', cost: 12, daoTam: 0, realm: 1, m: { hpMax: 40 }, desc: 'Sinh lực tối đa +40.' },
    { id: 'thien_nhan', n: 'Thiên Nhãn Thông', cost: 15, daoTam: 40, realm: 1, m: { luck: 4, kv: 4 }, desc: 'Vận may +4, khí vận +4.' },
    { id: 'pha_chuong', n: 'Phá Chướng Tâm Kinh', cost: 20, daoTam: 50, realm: 2, m: { brk: 0.05 }, desc: 'Xác suất đột phá +5%.' },
    { id: 'ho_dao', n: 'Hộ Đạo Tâm Ấn', cost: 14, daoTam: 55, realm: 1, m: { tm: 0.15 }, desc: 'Chống tâm ma: tăng 15% cơ hội đối mặt tâm ma thành công.' },
    { id: 'vong_tinh', n: 'Thái Thượng Vong Tình', cost: 25, daoTam: 70, realm: 2, m: { train: 0.12 }, desc: 'Tu luyện nhanh hơn 12%.' },
    { id: 'truong_sinh', n: 'Trường Sinh Quyết', cost: 30, daoTam: 60, realm: 3, m: { life: 0.1 }, desc: 'Thọ nguyên +10%.' },
    { id: 'thien_dao', n: 'Thiên Đạo Cảm Ứng', cost: 40, daoTam: 80, realm: 3, m: { brk: 0.04, train: 0.08 }, desc: 'Xác suất đột phá +4%, tu luyện nhanh hơn 8%.' }
  ];
  D.xinfaById = {};
  D.XINFA.forEach(x => { D.xinfaById[x.id] = x; });
})();
