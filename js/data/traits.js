// 20 tiên thiên: 10 tốt, 10 xấu; phẩm q: 0 trắng, 1 xanh, 2 vàng. g: 1 tốt, 0 xấu.
// m là các hiệu chỉnh: hpMax, atk, nl, kv, luck, gold, train, brk, life.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.TRAITS = [
    { id: 'than_cuong', n: 'Thân cường', g: 1, q: 0, d: 'Sinh lực tối đa +20', m: { hpMax: 20 } },
    { id: 'mat_tinh', n: 'Mắt tinh', g: 1, q: 0, d: 'Công kích +3', m: { atk: 3 } },
    { id: 'tay_kheo', n: 'Tay khéo', g: 1, q: 0, d: 'Kiếm vàng nhiều hơn 30%', m: { gold: 0.3 } },
    { id: 'tam_tinh', n: 'Tâm tĩnh', g: 1, q: 0, d: 'Niệm lực +5', m: { nl: 5 } },
    { id: 'menh_hao', n: 'Mệnh hảo', g: 1, q: 0, d: 'Vận may +3', m: { luck: 3 } },
    { id: 'ngo_tinh', n: 'Ngộ tính cao', g: 1, q: 1, d: 'Tu luyện nhanh hơn 25%', m: { train: 0.25 } },
    { id: 'phuc_duyen', n: 'Phúc duyên', g: 1, q: 1, d: 'Khí vận +8', m: { kv: 8 } },
    { id: 'cot_cach', n: 'Cốt cách thượng thừa', g: 1, q: 1, d: 'Công kích +6, sinh lực tối đa +30', m: { atk: 6, hpMax: 30 } },
    { id: 'dao_the', n: 'Thiên sinh đạo thể', g: 1, q: 2, d: 'Tu luyện nhanh hơn 50%, đột phá dễ hơn 8%', m: { train: 0.5, brk: 0.08 } },
    { id: 'dai_khi_van', n: 'Đại khí vận giả', g: 1, q: 2, d: 'Khí vận +20, vận may +8', m: { kv: 20, luck: 8 } },
    { id: 'the_nhuoc', n: 'Thể nhược', g: 0, q: 0, d: 'Sinh lực tối đa -20', m: { hpMax: -20 } },
    { id: 'vung_ve', n: 'Vụng về', g: 0, q: 0, d: 'Kiếm vàng ít hơn 30%', m: { gold: -0.3 } },
    { id: 'hay_quen', n: 'Hay quên', g: 0, q: 0, d: 'Niệm lực -4', m: { nl: -4 } },
    { id: 'xui_xeo', n: 'Xui xẻo', g: 0, q: 0, d: 'Vận may -3', m: { luck: -3 } },
    { id: 'luoi_bieng', n: 'Lười biếng', g: 0, q: 0, d: 'Tu luyện chậm hơn 10%', m: { train: -0.1 } },
    { id: 'tam_ma', n: 'Tâm ma quấn thân', g: 0, q: 1, d: 'Đột phá khó hơn 10%', m: { brk: -0.1 } },
    { id: 'tho_ngan', n: 'Thọ ngắn', g: 0, q: 1, d: 'Thọ nguyên giảm 15%', m: { life: -0.15 } },
    { id: 'da_benh', n: 'Đa bệnh', g: 0, q: 1, d: 'Sinh lực tối đa -30, hay đổ bệnh', m: { hpMax: -30 } },
    { id: 'thien_co_ghet', n: 'Thiên cơ ghét bỏ', g: 0, q: 2, d: 'Khí vận -20, vận may -8', m: { kv: -20, luck: -8 } },
    { id: 'menh_co_tinh', n: 'Mệnh cô tinh', g: 0, q: 2, d: 'Tu luyện chậm hơn 30%, vận may -5', m: { train: -0.3, luck: -5 } }
  ];
  D.traitById = {};
  D.TRAITS.forEach(t => { D.traitById[t.id] = t; });
  D.QNAME = ['trắng', 'xanh', 'vàng'];
})();
