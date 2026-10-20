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
    trung_chau: { id: 'trung_chau', n: 'plain', name: 'Trung Châu', seed: 11, seaY: 92, sea: 1, mistK: 1, rock: null, rockK: 0, sky: null, skyK: 0, cloud: null, cloudK: 0, water: null, fallCol: null,
      far: { n: 24, h: [38, 84], w: [9, 20], st: ['pillar', 'pillar', 'spire'] }, mid: { n: 13, h: [64, 110], w: [12, 24], st: ['pillar', 'mesa', 'pillar', 'spire'] },
      cap: 'pine', flt: [{ x: 332, y: 44, w: 46, up: 12, down: 26, fall: 1, pav: 0 }], near: 1, ground: 'grass', gcol: '#6e9c5c', tree: 'bamboo', fx: 'qi' },
    dong_hai: { id: 'dong_hai', n: 'sea', name: 'Đông Hải', seed: 23, seaY: 100, sea: 0.4, water: 98, mistK: 1.1, sky: null, skyK: 0, cloud: null, cloudK: 0, fallCol: null,
      far: { n: 16, h: [24, 62], w: [8, 18], st: ['spire', 'pillar'] }, mid: { n: 8, h: [40, 84], w: [12, 26], st: ['pillar', 'spire', 'mesa'] },
      rock: '#6f8aa0', rockK: 0.2, cap: 'pine', flt: [{ x: 130, y: 40, w: 36, up: 10, down: 20, fall: 1, pav: 0 }], near: 0, ground: 'sand', gcol: '#d8c48a', tree: 'pine', fx: 'mist' },
    tay_son: { id: 'tay_son', n: 'mount', name: 'Tây Thiên Sơn', seed: 37, seaY: 98, sea: 1, mistK: 0.8, sky: null, skyK: 0, cloud: null, cloudK: 0, water: null, fallCol: null,
      far: { n: 30, h: [48, 98], w: [8, 18], st: ['spire', 'pillar', 'spire'] }, mid: { n: 15, h: [72, 122], w: [11, 22], st: ['spire', 'pillar', 'spire', 'mesa'] },
      rock: '#8a92a8', rockK: 0.25, cap: 'pine', flt: [{ x: 70, y: 36, w: 34, up: 12, down: 22, fall: 0, pav: 0 }, { x: 300, y: 48, w: 58, up: 16, down: 32, fall: 1, pav: 1 }], near: 1, ground: 'stone', gcol: '#7a8090', tree: 'pine', fx: 'qi' },
    nam_lam: { id: 'nam_lam', n: 'forest', name: 'Nam Lâm', seed: 41, seaY: 96, sea: 1.1, mistK: 1.1, sky: null, skyK: 0, cloud: null, cloudK: 0, water: null, fallCol: null,
      far: { n: 24, h: [34, 78], w: [10, 22], st: ['pillar', 'mesa', 'pillar'] }, mid: { n: 13, h: [58, 100], w: [14, 26], st: ['pillar', 'mesa', 'pillar'] },
      rock: '#4f8a6a', rockK: 0.3, cap: 'pine', flt: [{ x: 250, y: 46, w: 50, up: 12, down: 28, fall: 1, pav: 0 }], near: 1, ground: 'grass', gcol: '#3f7a46', tree: 'bamboo', fx: 'qi' },
    bac_bang: { id: 'bac_bang', n: 'snow', name: 'Bắc Băng', seed: 53, seaY: 98, sea: 0.8, mistK: 0.8, cloud: null, cloudK: 0, water: null, fallCol: null,
      far: { n: 24, h: [44, 90], w: [9, 20], st: ['pillar', 'spire', 'pillar'] }, mid: { n: 13, h: [66, 112], w: [12, 24], st: ['pillar', 'mesa', 'spire'] },
      rock: '#9fb4cc', rockK: 0.45, sky: '#bcd8f0', skyK: 0.2, cap: 'snow', flt: [{ x: 190, y: 42, w: 44, up: 12, down: 24, fall: 0, pav: 0 }], near: 1, ground: 'snow', gcol: '#e2ecf4', tree: 'pine', fx: 'snow' },
    hoa_son: { id: 'hoa_son', n: 'volcano', name: 'Hỏa Sơn', seed: 67, seaY: 100, sea: 0.7, mistK: 0.6, water: null,
      far: { n: 22, h: [44, 94], w: [9, 18], st: ['spire', 'spire', 'pillar'] }, mid: { n: 13, h: [66, 112], w: [12, 22], st: ['spire', 'mesa', 'pillar'] },
      rock: '#8a3a2a', rockK: 0.45, sky: '#a03a1c', skyK: 0.3, cloud: '#6a4038', cloudK: 0.4, cap: 'ember', flt: [{ x: 300, y: 44, w: 48, up: 14, down: 30, fall: 1, pav: 0 }], fallCol: '#ff7a3a', near: 1, ground: 'basalt', gcol: '#3a2a26', tree: 'dead', fx: 'ash' },
    hoang_mac: { id: 'hoang_mac', n: 'desert', name: 'Hoang Mạc', seed: 71, seaY: 104, sea: 0.3, mistK: 0.4, water: null, fallCol: null,
      far: { n: 14, h: [24, 56], w: [18, 36], st: ['mesa', 'mesa', 'pillar'] }, mid: { n: 8, h: [36, 74], w: [22, 40], st: ['mesa', 'mesa', 'pillar'] },
      rock: '#c49a5a', rockK: 0.55, sky: '#f0c070', skyK: 0.18, cloud: '#f0e0b0', cloudK: 0.3, cap: 'none', flt: [{ x: 140, y: 38, w: 40, up: 10, down: 22, fall: 0, pav: 0 }], near: 1, ground: 'dune', gcol: '#d6b676', tree: 'dead', fx: 'sand' },
    vu_trach: { id: 'vu_trach', n: 'swamp', name: 'Vụ Trạch', seed: 83, seaY: 88, sea: 1.3, mistK: 1.9, water: null, fallCol: null,
      far: { n: 20, h: [30, 66], w: [10, 22], st: ['pillar', 'pillar', 'spire'] }, mid: { n: 11, h: [44, 84], w: [14, 26], st: ['pillar', 'mesa', 'pillar'] },
      rock: '#4a5a58', rockK: 0.35, sky: '#6a5a88', skyK: 0.18, cloud: '#8a9aa0', cloudK: 0.25, cap: 'none', flt: [{ x: 360, y: 50, w: 44, up: 10, down: 24, fall: 0, pav: 0 }], near: 1, ground: 'mud', gcol: '#3a5a48', tree: 'dead', fx: 'mist' },
    loi_dao: { id: 'loi_dao', n: 'storm', name: 'Lôi Đảo', seed: 97, seaY: 94, sea: 1.2, mistK: 1, water: null, fallCol: null,
      far: { n: 22, h: [40, 90], w: [9, 20], st: ['spire', 'pillar', 'spire'] }, mid: { n: 12, h: [60, 108], w: [12, 24], st: ['spire', 'pillar', 'mesa'] },
      rock: '#5a4a80', rockK: 0.4, sky: '#40305e', skyK: 0.35, cloud: '#4a3a70', cloudK: 0.35, cap: 'none', flt: [{ x: 120, y: 38, w: 40, up: 12, down: 22, fall: 0, pav: 0 }, { x: 340, y: 46, w: 48, up: 14, down: 26, fall: 0, pav: 0 }], near: 1, ground: 'violet', gcol: '#5a4a80', tree: 'dead', fx: 'spark' }
  };
  // kiểu cũ ({n:'mount'}) vẫn tra được: n -> id vùng
  const BYN = {}; Object.keys(TERRAIN).forEach(k => { BYN[TERRAIN[k].n] = TERRAIN[k]; });
  const terrOf = t => !t ? TERRAIN.trung_chau : (t.id && TERRAIN[t.id]) || BYN[t.n] || TERRAIN.trung_chau;

  // ---------- danh mục module dùng trong bố cục ----------
  // ok: đã có trong mã (sc.<tên>, hoặc sc.fx.<tên> với drawFlags); todo: T-C dựng, hiện chưa có hoặc đang viết tay trong hàm bố cục cũ.
  const MOD = {
    hall: 'ok', pagoda: 'ok', roof: 'ok', lantern: 'ok', rail: 'ok', glyphs: 'ok', tower: 'ok', pine: 'ok', bpine: 'ok', deadTree: 'ok', clump: 'ok', drawFlags: 'ok', drawRoadside: 'ok',
    fence: 'todo', smoke: 'todo', sign: 'todo', stair: 'todo', stone_lantern: 'todo', balustrade: 'todo', finial: 'todo', sect_gate: 'todo',
    ruin_tower: 'todo', ruin_gate: 'todo', broken_pillar: 'todo', flag_pole: 'todo', wall: 'todo', gate_tower: 'todo', gate_lintel: 'todo', city_gate: 'todo', torch: 'todo',
    hut: 'todo', tent: 'todo', totem: 'todo', campfire: 'todo', pier: 'todo', boat: 'todo', stall: 'todo', cart: 'todo', cart_rail: 'todo', mine_entrance: 'todo',
    crystal_cluster: 'todo', glow: 'todo', portal_arch: 'todo', signpost: 'todo', shrine_building: 'todo', steps: 'todo',
    // công trình đặc trưng của tông (T-C)
    great_sword: 'todo', sword_pit: 'todo', alchemy_furnace: 'todo', herb_terrace: 'todo', bone_tower: 'todo', banner_poles: 'todo', ghost_lamp: 'todo',
    sea_palace: 'todo', curved_bridge: 'todo', moon_pavilion: 'todo', cloud_gate: 'todo', long_stair: 'todo', turtle_stele: 'todo', ice_palace: 'todo', ice_pillar: 'todo',
    forge_in_volcano: 'todo', arena: 'todo', sun_disc: 'todo', ceremony_terrace: 'todo', island_temple: 'todo', thunder_pillar: 'todo'
  };

  // ---------- chín tông: công trình đặc trưng, lớp nhấn, bảng màu, ưu tiên ----------
  // Khóa là id tông trong js/data/sects.js; reg là id vùng trong js/data/regions.js (chín tông ở chín vùng khác nhau).
  // feat: công trình đặc trưng (khóa trong MOD). acc: lớp nhấn nền (kiếm quang, sương xanh, sương tím, sóng biển, mây biển, cực quang, tro lửa, nắng gắt, sét tím).
  // tint: màu pha vào bảng 5 pha, {c: màu, k: mức pha}, áp cho mọi pha. roof: màu ngói. lamp: màu đèn.
  // prio: 1 làm trước ở T-C; 2 làm sau, nếu chưa kịp thì dùng nền vùng và công trình.
  const SECT = {
    ts_kim_phong: { reg: 'tay_son', prio: 1, feat: ['great_sword', 'sword_pit'], acc: 'sword_glint', tint: { c: '#9fc4e8', k: 0.18 }, roof: '#2f5f7a', lamp: '#f0e4a8' },
    nl_bach_thao: { reg: 'nam_lam', prio: 1, feat: ['alchemy_furnace', 'herb_terrace'], acc: 'green_mist', tint: { c: '#8ed08a', k: 0.16 }, roof: '#3f6e4a', lamp: '#ffd080' },
    vt_am_hon: { reg: 'vu_trach', prio: 1, feat: ['bone_tower', 'banner_poles', 'ghost_lamp'], acc: 'ghost_mist', tint: { c: '#6a4a9a', k: 0.3 }, roof: '#2e2040', lamp: '#8affd8' },
    dh_thuy_nguyet: { reg: 'dong_hai', prio: 1, feat: ['sea_palace', 'curved_bridge', 'moon_pavilion'], acc: 'sea_wave', tint: { c: '#7ad6e8', k: 0.2 }, roof: '#3c8aa6', lamp: '#ffe9b0' },
    tc_thanh_van: { reg: 'trung_chau', prio: 2, feat: ['cloud_gate', 'long_stair', 'turtle_stele'], acc: 'cloud_sea', tint: { c: '#dfeee6', k: 0.12 }, roof: '#3f8f7a', lamp: '#ffe6a0' },
    bb_huyen_bang: { reg: 'bac_bang', prio: 2, feat: ['ice_palace', 'ice_pillar'], acc: 'aurora', tint: { c: '#bfe6f5', k: 0.22 }, roof: '#8fd0e8', lamp: '#e0f8ff' },
    hs_liet_hoa: { reg: 'hoa_son', prio: 2, feat: ['forge_in_volcano', 'arena'], acc: 'ember_ash', tint: { c: '#c8502a', k: 0.2 }, roof: '#7a2a1c', lamp: '#ff9a3a' },
    hm_nhat_luan: { reg: 'hoang_mac', prio: 2, feat: ['sun_disc', 'ceremony_terrace'], acc: 'sun_heat', tint: { c: '#e8a838', k: 0.18 }, roof: '#c8862a', lamp: '#ffe08a' },
    ld_tu_loi: { reg: 'loi_dao', prio: 2, feat: ['island_temple', 'thunder_pillar'], acc: 'thunder_flash', tint: { c: '#9a7ae8', k: 0.25 }, roof: '#4a3a7a', lamp: '#d8c8ff' }
  };

  // ---------- thời tiết vùng: 18 thời tiết, khóa là id trong js/data/regions.js ----------
  // sky: màu phủ trời (null = không phủ), k: mức phủ. fall: hạt 'rain' | 'snow' | 'sand' | 'ash' | 'spark' | 'qi' | 'mist' | 'leaf' | 'petal' | 'none'.
  // dens: mật độ hạt 0..1. wind: sức gió 0..1 (nghiêng mây, cây, tà áo). flash: giây giữa hai lần chớp (0 = không chớp). col: màu hạt. aur: 1 có dải cực quang.
  const WEATHER = {
    thu_hoach: { sky: '#f2c46a', k: 0.1, fall: 'leaf', dens: 0.35, wind: 0.3, flash: 0, col: '#e0a040', aur: 0 },
    chien_loan: { sky: '#5a5058', k: 0.2, fall: 'ash', dens: 0.2, wind: 0.3, flash: 0, col: '#8a8078', aur: 0 },
    bao_bien: { sky: '#34465a', k: 0.3, fall: 'rain', dens: 0.7, wind: 0.85, flash: 7, col: '#9ab4e8', aur: 0 },
    ngu_trieu: { sky: '#8fc4cc', k: 0.12, fall: 'mist', dens: 0.3, wind: 0.2, flash: 0, col: '#dff4f4', aur: 0 },
    bao_gio: { sky: '#6a7a8a', k: 0.15, fall: 'leaf', dens: 0.45, wind: 0.9, flash: 0, col: '#9a8a6a', aur: 0 },
    tuyet_lo: { sky: '#dfe8f0', k: 0.2, fall: 'snow', dens: 0.6, wind: 0.8, flash: 0, col: '#ffffff', aur: 0 },
    mua_doc: { sky: '#4a6a30', k: 0.3, fall: 'rain', dens: 0.55, wind: 0.15, flash: 0, col: '#9ad84a', aur: 0 },
    linh_vu: { sky: '#2a5a58', k: 0.25, fall: 'rain', dens: 0.5, wind: 0.2, flash: 9, col: '#9affd0', aur: 0 },
    bao_tuyet: { sky: '#c8d8ea', k: 0.3, fall: 'snow', dens: 0.9, wind: 0.95, flash: 0, col: '#f4f8ff', aur: 0 },
    cuc_quang: { sky: '#1a2a50', k: 0.3, fall: 'spark', dens: 0.15, wind: 0.05, flash: 0, col: '#7af4dc', aur: 1 },
    phun_trao: { sky: '#8a2a10', k: 0.35, fall: 'ash', dens: 0.8, wind: 0.3, flash: 4, col: '#ff9a3a', aur: 0 },
    hoa_tinh: { sky: '#3a1a1a', k: 0.2, fall: 'spark', dens: 0.3, wind: 0.4, flash: 0, col: '#ffb070', aur: 0 },
    bao_cat: { sky: '#f0c070', k: 0.25, fall: 'sand', dens: 0.9, wind: 0.95, flash: 0, col: '#e8cc88', aur: 0 },
    oc_dao: { sky: '#f6e6d0', k: 0.08, fall: 'petal', dens: 0.35, wind: 0.2, flash: 0, col: '#ffc8d8', aur: 0 },
    suong_doc: { sky: '#4a5a40', k: 0.3, fall: 'mist', dens: 0.5, wind: 0.1, flash: 0, col: '#9ad84a', aur: 0 },
    da_quang: { sky: '#101c28', k: 0.35, fall: 'qi', dens: 0.5, wind: 0.05, flash: 0, col: '#d8f86a', aur: 0 },
    giong_bao: { sky: '#40305e', k: 0.35, fall: 'rain', dens: 0.8, wind: 0.9, flash: 3.5, col: '#b8a8ff', aur: 0 },
    troi_quang: { sky: '#bfe6ff', k: 0.05, fall: 'none', dens: 0, wind: 0.1, flash: 0, col: null, aur: 0 }
  };

  // ---------- chín nơi thờ: dáng kiến trúc, khóa là id tín ngưỡng trong js/data/faiths.js ----------
  // noi: tên nơi thờ (khớp noiTho trong faiths.js). Chỉ tả dáng kiến trúc: không vẽ hình thần, không đặt biểu tượng thiêng làm trang trí (S mục 3).
  // plan: 'hall' | 'courtyard' | 'open' | 'stone'. roof: 'curved' | 'steep' | 'dome' | 'tiered' | 'wood' | 'flat'. wall: 'wood' | 'stone' | 'white'.
  // tower: 'bell' | 'minaret' | 'pagoda' | 'none'. gate: 'tam_quan' | 'torii' | 'arch' | 'none'. tree: 'pine' | 'banyan' | 'ginkgo' | 'none'.
  const SHRINE = {
    phat: { noi: 'chùa', plan: 'courtyard', roof: 'curved', wall: 'wood', tower: 'pagoda', gate: 'tam_quan', tree: 'pine' },
    thien_chua: { noi: 'nhà thờ', plan: 'hall', roof: 'steep', wall: 'stone', tower: 'bell', gate: 'arch', tree: 'none' },
    hoi: { noi: 'thánh đường', plan: 'courtyard', roof: 'dome', wall: 'white', tower: 'minaret', gate: 'arch', tree: 'none' },
    an_do: { noi: 'đền', plan: 'hall', roof: 'tiered', wall: 'stone', tower: 'none', gate: 'arch', tree: 'banyan' },
    dao_giao: { noi: 'đạo quán', plan: 'hall', roof: 'tiered', wall: 'wood', tower: 'pagoda', gate: 'none', tree: 'pine' },
    nho: { noi: 'văn miếu', plan: 'courtyard', roof: 'curved', wall: 'wood', tower: 'none', gate: 'tam_quan', tree: 'ginkgo' },
    to_tien: { noi: 'từ đường', plan: 'hall', roof: 'wood', wall: 'wood', tower: 'none', gate: 'none', tree: 'none' },
    than_dao: { noi: 'đền thần', plan: 'open', roof: 'wood', wall: 'wood', tower: 'none', gate: 'torii', tree: 'none' },
    dan_gian: { noi: 'đền', plan: 'stone', roof: 'flat', wall: 'stone', tower: 'none', gate: 'none', tree: 'banyan' }
  };

  // ---------- bố cục theo loại nơi (cls trong js/data/places.js, thêm road và void) ----------
  // Tọa độ 480x144, mặt đất y = GY (124). x: tâm module. h: cao trên mặt đất, dy: lệch so với mặt đất (dương là xuống). w: rộng.
  // m: tên module trong MOD. id: tên để mục khác dùng làm mốc. on: đặt theo mốc (id) trong cùng bố cục, at: vị trí trên mốc.
  // Mỗi mục là một lệnh vẽ thuần dữ liệu. Số liệu lấy từ hàm bố cục cũ (arch.js townLayout, sectLayout, ruinLayout; legacy.js, nhân 2 cho cảnh 240x72 cũ).
  const LAYOUT = {
    town: [
      { m: 'hall', x: 50, dy: 1, w: 32, wh: 13, rh: 9, roof: 'plain', door: 1, plat: 1, eave: 6, lamps: 0 },
      { m: 'hall', x: 146, dy: 1, w: 46, wh: 15, rh: 10, roof: 'plain', door: 1, plat: 1, eave: 6, lamps: 1 },
      { m: 'hall', x: 312, dy: 1, w: 44, wh: 14, rh: 9, roof: 'plain', door: 1, plat: 1, eave: 6, lamps: 0 },
      { m: 'hall', x: 398, dy: 1, w: 34, wh: 13, rh: 8, roof: 'plain', door: 1, plat: 1, eave: 6, lamps: 1 },
      { m: 'smoke', x: 165, h: 44 }, { m: 'smoke', x: 330, h: 40 },
      { m: 'sign', x: 177, h: 40 },
      { m: 'pine', x: 98, h: 22, k: 1 }, { m: 'pine', x: 262, h: 20, k: 1 }, { m: 'pine', x: 440, h: 22, k: 1 },
      { m: 'fence', x0: 78, x1: 124 }, { m: 'fence', x0: 206, x1: 280 }, { m: 'fence', x0: 352, x1: 376 },
      { m: 'lantern', x: 188, h: 22 }
    ],
    city: [
      { m: 'wall', id: 'wall', x: 16, w: 140, h: 36 },
      { m: 'gate_tower', x: 8, w: 24, h: 60 }, { m: 'gate_tower', x: 140, w: 24, h: 60 },
      { m: 'city_gate', on: 'wall', at: 72, w: 56, h: 28 },
      { m: 'torch', x: 52, h: 24 }, { m: 'torch', x: 120, h: 24 }
    ],
    tribe: [
      { m: 'hut', x: 48, w: 44, h: 26 }, { m: 'tent', x: 380, w: 48, h: 24 },
      { m: 'totem', x: 250, h: 44 }, { m: 'campfire', x: 300, h: 6 }
    ],
    port: [
      { m: 'pier', x: 20, w: 104, h: 6 },
      { m: 'boat', x: 128, w: 60, h: 28, mastX: 152 }
    ],
    guild: [
      { m: 'hall', x: 120, dy: 0, w: 60, wh: 16, rh: 12, roof: 'plain', door: 1, plat: 1, eave: 7, lamps: 1 },
      { m: 'flag_pole', x: 220, h: 52, w: 16 }, { m: 'flag_pole', x: 262, h: 46, w: 16 }, { m: 'flag_pole', x: 304, h: 52, w: 16 },
      { m: 'lantern', x: 360, h: 24 }
    ],
    market: [
      { m: 'stall', x: 28, w: 36, col: 'red' }, { m: 'stall', x: 72, w: 36, col: 'blue' }, { m: 'stall', x: 116, w: 36, col: 'gold' },
      { m: 'cart', x: 170, w: 40, h: 14 }, { m: 'lantern', x: 216, h: 22 }
    ],
    mine: [
      { m: 'mine_entrance', x: 28, w: 62, h: 40 },
      { m: 'cart_rail', x0: 90, x1: 160, h: 2 }, { m: 'cart', x: 150, w: 26, h: 12 },
      { m: 'lantern', x: 52, h: 24 }
    ],
    vein: [
      { m: 'crystal_cluster', x: 40, n: 5, step: 16, hmax: 44 },
      { m: 'glow', x: 32, w: 100, h: 52, col: 'lingqi' }
    ],
    secret: [
      { m: 'portal_arch', x: 80, h: 44, rx: 28, ry: 36 }
    ],
    ruin: [
      { m: 'ruin_tower', x: 112, tiers: 4, w0: 28, wh: 12, step: 5, lean: 2, roof: 'ruin' },
      { m: 'ruin_gate', x: 292, h: 40, w: 20 },
      { m: 'broken_pillar', x: 246, h: 22 }, { m: 'broken_pillar', x: 330, h: 30 },
      { m: 'flag_pole', x: 200, h: 52, w: 16, ph: 0 }, { m: 'flag_pole', x: 372, h: 60, w: 16, ph: 1.7 }, { m: 'flag_pole', x: 440, h: 44, w: 20, ph: 3.4 }
    ],
    gate: [
      { m: 'gate_tower', x: 16, w: 44, h: 52 }, { m: 'gate_tower', x: 120, w: 44, h: 52 },
      { m: 'gate_lintel', x: 60, w: 60, h: 14 }
    ],
    sect: [
      { m: 'tower', id: 'tower_l', x: 30, base: 134, w: 100, h: 56, style: 'mesa', rock: 'm4', seed: 91 },
      { m: 'pagoda', x: 80, on: 'tower_l', at: 50, w0: 18, tiers: 5, roof: 'sect' },
      { m: 'pine', x: 34, on: 'tower_l', at: 4, h: [14, 22], k: 0.95 }, { m: 'pine', x: 42, on: 'tower_l', at: 12, h: [14, 22], k: 0.95 },
      { m: 'pine', x: 122, on: 'tower_l', at: 92, h: [14, 22], k: 0.95 }, { m: 'pine', x: 126, on: 'tower_l', at: 96, h: [14, 22], k: 0.95 },
      { m: 'tower', id: 'tower_r', x: 284, base: 136, w: 200, h: 70, style: 'mesa', rock: 'm4', seed: 92 },
      { m: 'hall', id: 'hall_main', x: 372, on: 'tower_r', at: 'plateau', w: 84, wh: 14, rh: 9, roof: 'sect', plat: 1, lamps: 1, door: 1, eave: 8 },
      { m: 'hall', id: 'hall_top', x: 372, on: 'hall_main', dy: 7, w: 46, wh: 9, rh: 8, roof: 'sect', plat: 0, lamps: 0, door: 0, eave: 6 },
      { m: 'finial', x: 372, on: 'hall_top', h: 8, gold: 1 },
      { m: 'hall', x: 446, on: 'tower_r', at: 'plateau', w: 22, wh: 10, rh: 7, roof: 'sect', plat: 0, lamps: 0, eave: 5 },
      { m: 'rail', x0: 302, x1: 330, on: 'tower_r', at: 'plateau', h: 5, step: 9 }, { m: 'rail', x0: 414, x1: 440, on: 'tower_r', at: 'plateau', h: 5, step: 9 },
      { m: 'sign', x: 322, on: 'tower_r', at: 'plateau', h: 28 }, { m: 'sign', x: 422, on: 'tower_r', at: 'plateau', h: 28 },
      { m: 'pine', x: 292, on: 'tower_r', at: 8, h: 22, lean: -0.28, k: 1.2 }, { m: 'pine', x: 474, on: 'tower_r', at: 184, h: 18, lean: 0.3, k: 1.1 },
      { m: 'pine', x: 332, on: 'tower_r', at: 'plateau', h: 14, lean: -0.1, k: 0.9 },
      { m: 'stair', id: 'stair', x0: 190, x1: 292, base: 124, top: 'tower_r' },
      { m: 'rail', x0: 190, x1: 292, on: 'stair', h: 5, step: 12 },
      { m: 'sect_gate', x: 238, on: 'stair', at: 'mid', w: 29, h: 52, gold: 1 },
      { m: 'stone_lantern', x: 140, h: 14 }, { m: 'stone_lantern', x: 170, h: 14 },
      { m: 'balustrade', x0: 0, x1: 120, h: 8 }
    ],
    shrine: [
      { m: 'shrine_building', x: 240, w: 70, h: 40, byFaith: 1 },
      { m: 'steps', x: 240, w: 60, h: 8 },
      { m: 'lantern', x: 150, h: 22 }, { m: 'lantern', x: 330, h: 22 },
      { m: 'pine', x: 90, h: 20, k: 1 }, { m: 'pine', x: 400, h: 20, k: 1 }
    ],
    road: [
      { m: 'drawRoadside', x: 0 },
      { m: 'signpost', x: 260, h: 40 },
      { m: 'pine', x: 110, h: 18, k: 1 }
    ],
    void: []
  };

  sc.data = { PHASES, TERRAIN, terrOf, MOD, SECT, WEATHER, SHRINE, LAYOUT };
})();
