// Cảnh pixel thủy mặc, dữ liệu: bảng màu 5 pha và thông số 9 địa hình (khóa theo id vùng trong js/data/regions.js).
// T-Cd chỉ cần sửa / mở rộng tệp này (và các bảng dữ liệu tương tự), không viết thêm cách vẽ.
(function () {
  const sc = window.TT.ui.sc, mkPal = sc.mkPal;

  // ---------- 5 pha ----------
  // Thứ tự 25 màu: sky0 sky1 sky2 mist m1 m2 m3 m4 rockLt rockDk pine pineLt cloudLt cloudMd cloudDk roof roofLt wall wood woodDk gold lamp ink jade sun
  // Số: sunA sunX sunY sunR moonA starA lit fire amb   (lit: đèn sáng, fire: đom đóm, amb: độ tối chung)
  const PHASES = {
    day: mkPal('#86bcc6 #b8dcd2 #f1ecd0 #eaeedd #bed3cb #9fbcb3 #6a8d86 #3b5a58 #86a8a0 #22403f #234f40 #4a8a6a #fffff4 #e2ece4 #b5c8c2 #404f52 #6a7d7e #f2ecd8 #bf3a2e #7e2420 #ecc873 #d8372c #1a2626 #5ee0c4 #fff3c0', [0.85, 150, 42, 10, 0, 0, 0, 0, 0]),
    dusk: mkPal('#35305e #a34f6c #f4a066 #e8a88c #b8788a #8c5a7c #5a4268 #2e2848 #a8707c #1c1830 #2a3a40 #5a6a64 #ffd2a8 #e8a0a0 #a8628a #3a3040 #7a5a70 #e8c4a8 #b8302c #6e1c24 #ffd070 #ff5a38 #1c1626 #6ae8d0 #ffb060', [0.95, 255, 108, 17, 0, 0.15, 0.65, 0.3, 0.3]),
    night: mkPal('#050a1a #0e1b3a #213a5c #36506c #28405e #1d3050 #132238 #0a1424 #3a5878 #060c18 #0e2428 #1f4a48 #7b94b0 #4c647e #2a3c56 #16202c #34465a #4a5a70 #6a2030 #3a1220 #f4d070 #ff6a3a #050a14 #7af4dc #ffffff', [0, 250, 112, 17, 1, 1, 1, 1, 0.55]),
    cave: mkPal('#04040a #0a0a16 #14142a #1c1c38 #101024 #0e0e20 #0b0b1a #080812 #2c2c50 #03030a #0e1630 #1a2a4a #34345c #20203a #10101e #26203a #463c66 #40405e #2a2236 #14101c #a898ff #7a6cff #04040a #8a7aff #c9b8ff', [0, 240, 60, 10, 0, 0, 1, 0.6, 0.55]),
    void: mkPal('#02020a #080818 #18103a #2a2060 #0e0c28 #0a0a20 #080818 #05050f #3a3070 #02020a #120c30 #241a58 #5a4aa0 #30286a #14103a #2a2050 #5a48a0 #4a4080 #2a2048 #120c28 #b0a0ff #8a7aff #03030a #a090ff #c9b8ff', [0, 240, 60, 10, 0, 1, 1, 0.7, 0.5])
  };

  // ---------- 9 địa hình ----------
  // far / mid: lớp tháp núi xa và giữa ({n: số tháp, h: [thấp, cao], w: [hẹp, rộng], st: các kiểu 'pillar' | 'spire' | 'mesa'}).
  // seaY: y của biển mây; sea: độ dày biển mây (0 = không có); water: y mặt nước (biển thật, thay cho biển mây); mistK: độ sương thấp.
  // rock / rockK: màu đá pha vào và mức pha; sky / skyK: lớp màu phủ trời; cloud / cloudK: màu mây pha vào.
  // cap: 'pine' (tùng trên đỉnh) | 'snow' | 'ember' (nứt dung nham) | 'none'. flt: các đỉnh lơ lửng ({x,y,w,up,down,fall,pav}); fallCol: màu thác.
  // ground: 'grass' | 'sand' | 'stone' | 'snow' | 'basalt' | 'dune' | 'mud' | 'violet'; gcol: màu mặt đất.
  // tree: 'pine' | 'bamboo' | 'dead' (tiền cảnh); fx: hạt đặc trưng 'qi' | 'snow' | 'ash' | 'sand' | 'mist' | 'spark'; near: có vách đá hai bên.
  const TERRAIN = {
    trung_chau: { id: 'trung_chau', n: 'plain', name: 'Trung Châu', seed: 11, seaY: 92, sea: 1, mistK: 1,
      far: { n: 24, h: [38, 84], w: [9, 20], st: ['pillar', 'pillar', 'spire'] }, mid: { n: 13, h: [64, 110], w: [12, 24], st: ['pillar', 'mesa', 'pillar', 'spire'] },
      cap: 'pine', flt: [{ x: 332, y: 44, w: 46, up: 12, down: 26, fall: 1, pav: 0 }], near: 1, ground: 'grass', gcol: '#6e9c5c', tree: 'bamboo', fx: 'qi' },
    dong_hai: { id: 'dong_hai', wind: 0.2, n: 'sea', name: 'Đông Hải', seed: 23, seaY: 100, sea: 0.4, water: 98, mistK: 1.1,
      far: { n: 16, h: [24, 62], w: [8, 18], st: ['spire', 'pillar'] }, mid: { n: 8, h: [40, 84], w: [12, 26], st: ['pillar', 'spire', 'mesa'] },
      rock: '#6f8aa0', rockK: 0.2, cap: 'pine', flt: [{ x: 130, y: 40, w: 36, up: 10, down: 20, fall: 1, pav: 0 }], near: 0, ground: 'sand', gcol: '#d8c48a', tree: 'pine', fx: 'mist' },
    tay_son: { id: 'tay_son', wind: 0.25, n: 'mount', name: 'Tây Thiên Sơn', seed: 37, seaY: 98, sea: 1, mistK: 0.8,
      far: { n: 30, h: [48, 98], w: [8, 18], st: ['spire', 'pillar', 'spire'] }, mid: { n: 15, h: [72, 122], w: [11, 22], st: ['spire', 'pillar', 'spire', 'mesa'] },
      rock: '#8a92a8', rockK: 0.25, cap: 'pine', flt: [{ x: 70, y: 36, w: 34, up: 12, down: 22, fall: 0, pav: 0 }, { x: 300, y: 48, w: 58, up: 16, down: 32, fall: 1, pav: 1 }], near: 1, ground: 'stone', gcol: '#7a8090', tree: 'pine', fx: 'qi' },
    nam_lam: { id: 'nam_lam', n: 'forest', name: 'Nam Lâm', seed: 41, seaY: 96, sea: 1.1, mistK: 1.1,
      far: { n: 24, h: [34, 78], w: [10, 22], st: ['pillar', 'mesa', 'pillar'] }, mid: { n: 13, h: [58, 100], w: [14, 26], st: ['pillar', 'mesa', 'pillar'] },
      rock: '#4f8a6a', rockK: 0.3, cap: 'pine', flt: [{ x: 250, y: 46, w: 50, up: 12, down: 28, fall: 1, pav: 0 }], near: 1, ground: 'grass', gcol: '#3f7a46', tree: 'bamboo', fx: 'qi' },
    bac_bang: { id: 'bac_bang', wind: 0.15, n: 'snow', name: 'Bắc Băng', seed: 53, seaY: 98, sea: 0.8, mistK: 0.8,
      far: { n: 24, h: [44, 90], w: [9, 20], st: ['pillar', 'spire', 'pillar'] }, mid: { n: 13, h: [66, 112], w: [12, 24], st: ['pillar', 'mesa', 'spire'] },
      rock: '#9fb4cc', rockK: 0.45, sky: '#bcd8f0', skyK: 0.2, cap: 'snow', flt: [{ x: 190, y: 42, w: 44, up: 12, down: 24, fall: 0, pav: 0 }], near: 1, ground: 'snow', gcol: '#e2ecf4', tree: 'pine', fx: 'snow' },
    hoa_son: { id: 'hoa_son', n: 'volcano', name: 'Hỏa Sơn', seed: 67, seaY: 100, sea: 0.7, mistK: 0.6,
      far: { n: 22, h: [44, 94], w: [9, 18], st: ['spire', 'spire', 'pillar'] }, mid: { n: 13, h: [66, 112], w: [12, 22], st: ['spire', 'mesa', 'pillar'] },
      rock: '#8a3a2a', rockK: 0.45, sky: '#a03a1c', skyK: 0.3, cloud: '#6a4038', cloudK: 0.4, cap: 'ember', flt: [{ x: 300, y: 44, w: 48, up: 14, down: 30, fall: 1, pav: 0 }], fallCol: '#ff7a3a', near: 1, ground: 'basalt', gcol: '#3a2a26', tree: 'dead', fx: 'ash' },
    hoang_mac: { id: 'hoang_mac', wind: 0.15, n: 'desert', name: 'Hoang Mạc', seed: 71, seaY: 104, sea: 0.3, mistK: 0.4,
      far: { n: 14, h: [24, 56], w: [18, 36], st: ['mesa', 'mesa', 'pillar'] }, mid: { n: 8, h: [36, 74], w: [22, 40], st: ['mesa', 'mesa', 'pillar'] },
      rock: '#c49a5a', rockK: 0.55, sky: '#f0c070', skyK: 0.18, cloud: '#f0e0b0', cloudK: 0.3, cap: 'none', flt: [{ x: 140, y: 38, w: 40, up: 10, down: 22, fall: 0, pav: 0 }], near: 1, ground: 'dune', gcol: '#d6b676', tree: 'dead', fx: 'sand' },
    vu_trach: { id: 'vu_trach', n: 'swamp', name: 'Vụ Trạch', seed: 83, seaY: 88, sea: 1.3, mistK: 1.9,
      far: { n: 20, h: [30, 66], w: [10, 22], st: ['pillar', 'pillar', 'spire'] }, mid: { n: 11, h: [44, 84], w: [14, 26], st: ['pillar', 'mesa', 'pillar'] },
      rock: '#4a5a58', rockK: 0.35, sky: '#6a5a88', skyK: 0.18, cloud: '#8a9aa0', cloudK: 0.25, cap: 'none', flt: [{ x: 360, y: 50, w: 44, up: 10, down: 24, fall: 0, pav: 0 }], near: 1, ground: 'mud', gcol: '#3a5a48', tree: 'dead', fx: 'mist' },
    loi_dao: { id: 'loi_dao', wind: 0.25, n: 'storm', name: 'Lôi Đảo', seed: 97, seaY: 94, sea: 1.2, mistK: 1,
      far: { n: 22, h: [40, 90], w: [9, 20], st: ['spire', 'pillar', 'spire'] }, mid: { n: 12, h: [60, 108], w: [12, 24], st: ['spire', 'pillar', 'mesa'] },
      rock: '#5a4a80', rockK: 0.4, sky: '#40305e', skyK: 0.35, cloud: '#4a3a70', cloudK: 0.35, cap: 'none', flt: [{ x: 120, y: 38, w: 40, up: 12, down: 22, fall: 0, pav: 0 }, { x: 340, y: 46, w: 48, up: 14, down: 26, fall: 0, pav: 0 }], near: 1, ground: 'violet', gcol: '#5a4a80', tree: 'dead', fx: 'spark' }
  };
  // kiểu cũ ({n:'mount'}) vẫn tra được: n -> id vùng
  const BYN = {}; Object.keys(TERRAIN).forEach(k => { BYN[TERRAIN[k].n] = TERRAIN[k]; });
  const terrOf = t => !t ? TERRAIN.trung_chau : (t.id && TERRAIN[t.id]) || BYN[t.n] || TERRAIN.trung_chau;

  // ---------- kiểu riêng của chín tông (id tông = id địa điểm; xem js/data/sects.js) ----------
  // land: công trình đặc trưng (js/ui/scene/sect.js); accent: lớp nhấn nền động (fx.accent); roof: màu mái (arch.roofCols); tint: pha màu đá, trời, mây vào bảng màu.
  const SECT_STYLE = {
    ts_kim_phong: { land: 'dai_kiem', accent: 'gio', roof: 'sect', tint: { rock: '#9aa8c0', rockK: 0.15 } },
    nl_bach_thao: { land: 'dan_dinh', accent: 'suong_xanh', roof: 'warm', tint: { sky: '#7ad8a0', skyK: 0.12, cloud: '#b8e8c8', cloudK: 0.2 } },
    vt_am_hon: { land: 'thap_xuong', accent: 'hon_quang', roof: 'ruin', tint: { sky: '#5a2a8a', skyK: 0.35, rock: '#3a2a52', rockK: 0.4, cloud: '#6a4a8a', cloudK: 0.35 } },
    dh_thuy_nguyet: { land: 'cung_bien', accent: 'sao_nuoc', roof: 'sect', tint: {} },
    tc_thanh_van: { land: 'cong_may', accent: '', roof: 'sect', tint: {} },
    bb_huyen_bang: { land: 'cung_bang', accent: 'cuc_quang', roof: 'ice', tint: {} },
    hs_liet_hoa: { land: 'lo_luyen', accent: 'tro', roof: 'plain', tint: {} },
    hm_nhat_luan: { land: 'dai_nhat', accent: 'nang', roof: 'gold', tint: {} },
    ld_tu_loi: { land: 'dao_quan', accent: 'set', roof: 'sect', tint: {} }
  };
  // bố cục nền theo loại nơi (cls): danh sách module trong sc.places (js/ui/scene/place.js, arch.js)
  const CLS_LAYOUT = {
    town: ['town'], tribe: ['tribe'], city: ['city'], port: ['port'], guild: ['market'], market: ['market'], mine: ['mine'], vein: ['vein'],
    secret: ['portal'], ruin: ['ruin'], gate: ['gate'], shrine: ['courtyard'], sect: ['sect']
  };
  // dáng kiến trúc nơi thờ theo id tín ngưỡng (js/ui/scene/shrine.js); chỉ vẽ kiến trúc, không dùng biểu tượng thiêng làm trang trí
  const FAITH_FORM = { phat: 'chua', thien_chua: 'nha_tho', hoi: 'thanh_duong', an_do: 'den_thap', dao_giao: 'dao_quan', nho: 'van_mieu', to_tien: 'tu_duong', than_dao: 'den_than', dan_gian: 'mieu' };

  // ---------- thời tiết vùng (khóa theo id trong js/data/regions.js) ----------
  // tint / k: lớp phủ màu trời, mây, sương (k = mức pha, tối dần về đêm); part: loại hạt (rain, snow, sand, leaf, ash, glow, petal, meteor, splash, aurora, rays, mist);
  // n: mật độ; col: màu hạt (chuỗi hoặc danh sách); wind: -1..1 (gió nghiêng mây, cây tiền cảnh, tà áo, khói); flash: có chớp; fog: sương thấp thêm; war: coi như chiến sự.
  const WEATHER = {
    thu_hoach: { tint: '#e8b858', k: 0.1, part: 'leaf', n: 26, col: ['#e8b838', '#d88a28', '#f0d060'], wind: 0.25 },
    chien_loan: { tint: '#8a2a22', k: 0.2, part: 'ash', n: 30, wind: 0.3, war: true },
    bao_bien: { tint: '#3a4a68', k: 0.3, part: 'rain', n: 150, col: '#9ab4e8', wind: 0.9, flash: true, fog: 0.3 },
    ngu_trieu: { tint: '#5a9ab8', k: 0.06, part: 'splash', n: 30, wind: 0.1 },
    bao_gio: { tint: '#8a98a8', k: 0.15, part: 'leaf', n: 34, col: ['#9ab878', '#c8d098', '#e8e8d0'], wind: 1 },
    tuyet_lo: { tint: '#d8e8f4', k: 0.14, part: 'snow', n: 110, wind: 0.4 },
    mua_doc: { tint: '#5a7a2a', k: 0.25, part: 'rain', n: 100, col: '#9ad84a', wind: 0.2, fog: 0.2 },
    linh_vu: { tint: '#5ae0c0', k: 0.1, part: 'rain', n: 90, col: '#9affd0', wind: 0.1 },
    bao_tuyet: { tint: '#c8d8e8', k: 0.3, part: 'snow', n: 200, wind: 1, fog: 0.35 },
    cuc_quang: { part: 'aurora' },
    phun_trao: { tint: '#8a2a10', k: 0.3, part: 'ash', n: 40, wind: 0.2, ember: true },
    hoa_tinh: { tint: '#8a4a20', k: 0.12, part: 'meteor', n: 8 },
    bao_cat: { tint: '#d8a850', k: 0.32, part: 'sand', n: 120, wind: 1, fog: 0.3 },
    da_quang: { part: 'glow', n: 16, col: '#d8f86a' },
    giong_bao: { tint: '#262040', k: 0.35, part: 'rain', n: 130, col: '#9ab4e8', wind: 0.6, flash: true },
    suong_doc: { tint: '#6a8a4a', k: 0.2, part: 'mist', fog: 0.6 },
    oc_dao: { tint: '#f8d0e0', k: 0.06, part: 'petal', n: 20, wind: 0.15 },
    troi_quang: { tint: '#fff8d0', k: 0.08, part: 'rays' }
  };

  sc.data = { WEATHER, PHASES, TERRAIN, terrOf, SECT_STYLE, CLS_LAYOUT, FAITH_FORM };
})();
