// Tông môn: dùng các địa điểm loại "tong_mon" có sẵn trong places.js (mỗi vùng một tông môn, id tông môn là id địa điểm).
// align: 'chinh' chính đạo, 'ta' tà đạo, 'trung' trung lập. elems: thuộc tính hợp (đệ tử hợp thuộc tính được ưu tiên và tu nhanh hơn).
// minMain: điểm tư chất cao nhất tối thiểu để được nhận (hợp thuộc tính của tông thì được giảm).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.SECTS = {
    tc_thanh_van: { n: 'Thanh Vân Tông', align: 'chinh', elems: ['Thổ', 'Mộc'], minMain: 0, desc: 'Tông môn hạng trung ở Trung Châu, nhận nhiều đệ tử phàm nhân, quy củ ôn hòa.' },
    dh_thuy_nguyet: { n: 'Thủy Nguyệt Cung', align: 'chinh', elems: ['Thủy', 'Băng'], minMain: 22, desc: 'Cung điện trên biển Đông Hải, chuyên tu Thủy, đa phần là nữ tu.' },
    ts_kim_phong: { n: 'Kim Phong Môn', align: 'chinh', elems: ['Kim', 'Phong'], minMain: 30, desc: 'Tông môn kiếm tu ở Tây Thiên Sơn, tuyển người rất khắt khe.' },
    nl_bach_thao: { n: 'Bách Thảo Môn', align: 'chinh', elems: ['Mộc', 'Thủy'], minMain: 15, desc: 'Tông môn luyện đan ở Nam Lâm, hiền hòa, nhận người có duyên với cỏ cây.' },
    bb_huyen_bang: { n: 'Huyền Băng Cung', align: 'trung', elems: ['Băng', 'Thủy'], minMain: 25, desc: 'Cung điện băng lạnh lùng ở Bắc Cực, không phân chính tà, chỉ trọng thực lực.' },
    hs_liet_hoa: { n: 'Liệt Hỏa Tông', align: 'trung', elems: ['Hỏa', 'Dương'], minMain: 20, desc: 'Tông môn nóng tính ở Hỏa Diệm Sơn, giỏi luyện khí và đánh nhau.' },
    hm_nhat_luan: { n: 'Nhật Luân Giáo', align: 'trung', elems: ['Dương', 'Hỏa', 'Kim'], minMain: 20, desc: 'Giáo phái thờ mặt trời giữa sa mạc, tu Dương, tôn ti rõ ràng.' },
    vt_am_hon: { n: 'Âm Hồn Giáo', align: 'ta', elems: ['Âm', 'Mộc'], minMain: 15, desc: 'Tà đạo ở Vụ Trạch, luyện hồn và âm khí, không hỏi xuất thân, chỉ hỏi dám làm gì.' },
    ld_tu_loi: { n: 'Tử Lôi Quan', align: 'chinh', elems: ['Lôi', 'Phong'], minMain: 25, desc: 'Đạo quán tu Lôi ở Lôi Đảo, kỷ luật nghiêm minh.' }
  };

  D.SECT_ALIGN = { chinh: 'Chính đạo', ta: 'Tà đạo', trung: 'Trung lập' };
  D.SECT_RANKS = ['Ngoại môn đệ tử', 'Nội môn đệ tử', 'Chân truyền đệ tử', 'Trưởng lão', 'Chưởng môn'];

  // Số liệu chức vị (chỉnh được).
  D.SECT_RULES = {
    // Điều kiện lên từng bậc: cảnh giới và cống hiến tối thiểu (chỉ số = bậc muốn lên).
    promote: [null, { realm: 1, contrib: 120 }, { realm: 2, contrib: 700 }, { realm: 3, contrib: 2500 }],
    stipend: [8, 20, 60, 150, 300],  // bổng lộc mỗi năm theo bậc (nhân (1 + 0,3 x cảnh giới))
    elderSlots: 3,                   // số trưởng lão tối đa của một tông môn (kể cả NPC chức vụ)
    trainPerRank: 0.05,              // tu luyện nhanh thêm mỗi bậc (bậc 0 vẫn được 5%)
    elemBonus: 0.10,                 // thêm nếu thuộc tính chính hợp tông môn
    breakPerRank: 0.02,              // cộng vào xác suất đột phá mỗi bậc (tối đa 4 bậc)
    // Đại trận truyền tống của tông môn cho trưởng lão trở lên.
    portal: { minRank: 3, contrib: 1500, gold: 300, success: 0.92, failHpLoss: 0.4 },
    joinCooldown: 60                 // sau khi từ chối lời mời gia nhập, nhiều tháng sau mới bị hỏi lại
  };

  // ---------- Bản sắc từng tông (M1) ----------
  // motto: tôn chỉ. law: luật tông (xem D.SECT_LAWS). secret: tuyệt học, tự mở khi lên Chân truyền (bậc 2):
  //   train/brk cộng vào tu luyện và đột phá, hurt giảm xác suất bị thương khi làm nhiệm vụ, pay tăng bổng và thưởng tiền, contrib tăng cống hiến.
  // lineW: tỉ trọng NPC chọn bốn đường (chap, duoc, tang, ngoai) khi lên nội môn.
  const IDENT = {
    tc_thanh_van: { mach: 1, mo: 2, motto: 'Hòa thuận là gốc, cần cù là đạo.', law: 'sat', secret: { n: 'Hậu Thổ Hộ Thân', desc: 'Khi làm nhiệm vụ ít bị thương hơn một nửa, đột phá thêm 3%.', hurt: 0.5, brk: 0.03 }, lineW: [2, 3, 2, 3] },
    dh_thuy_nguyet: { mach: 2, mo: 1, motto: 'Tâm tĩnh như nước, kiếm mềm như sóng.', law: 'chinh', secret: { n: 'Nguyệt Hoa Tâm Pháp', desc: 'Tu luyện nhanh thêm 6%.', train: 0.06 }, lineW: [2, 2, 4, 2] },
    ts_kim_phong: { mach: 2, mo: 2, motto: 'Kiếm đi một đường, người thắng giữ ghế.', law: 'lao', secret: { n: 'Kiếm Tâm Thông Minh', desc: 'Đột phá thêm 4%, ít bị thương khi làm nhiệm vụ.', brk: 0.04, hurt: 0.8 }, lineW: [5, 1, 2, 1] },
    nl_bach_thao: { mach: 2, mo: 1, motto: 'Cứu người là tu, hại người là bỏ.', law: 'sat', secret: { n: 'Bách Thảo Hồi Xuân', desc: 'Ít bị thương hơn 70% khi làm nhiệm vụ, bổng thêm 30%.', hurt: 0.3, pay: 1.3 }, lineW: [1, 5, 2, 2] },
    bb_huyen_bang: { mach: 3, mo: 0, motto: 'Băng không hỏi chính tà, chỉ hỏi ngươi mạnh bao nhiêu.', law: 'lao', secret: { n: 'Huyền Băng Phong Ấn', desc: 'Tu luyện nhanh thêm 5%, đột phá thêm 2%.', train: 0.05, brk: 0.02 }, lineW: [3, 1, 4, 2] },
    hs_liet_hoa: { mach: 2, mo: 2, motto: 'Lửa luyện sắt, trận luyện người.', law: 'lao', secret: { n: 'Liệt Hỏa Trui Luyện', desc: 'Tiền thưởng nhiệm vụ thêm 30%, đột phá thêm 3%.', pay: 1.3, brk: 0.03 }, lineW: [3, 3, 1, 3] },
    hm_nhat_luan: { mach: 1, mo: 1, motto: 'Trên có Thái Dương, dưới có tôn ti.', law: 'lao', secret: { n: 'Thái Dương Chiếu Mệnh', desc: 'Tu luyện nhanh thêm 6%.', train: 0.06 }, lineW: [3, 2, 3, 2] },
    vt_am_hon: { mach: 2, mo: 0, motto: 'Không hỏi xuất thân, chỉ hỏi dám làm gì.', law: 'lao', secret: { n: 'Âm Hồn Dẫn Lộ', desc: 'Cống hiến nhận được thêm 20%, tu luyện thêm 4%.', contrib: 1.2, train: 0.04 }, lineW: [3, 1, 3, 3] },
    ld_tu_loi: { mach: 2, mo: 1, motto: 'Sét không chờ ai, kỷ luật không chờ ai.', law: 'chinh', secret: { n: 'Tử Lôi Khai Thiên', desc: 'Đột phá thêm 5%.', brk: 0.05 }, lineW: [4, 1, 3, 2] }
  };
  Object.keys(IDENT).forEach(id => { Object.assign(D.SECTS[id], IDENT[id]); });

  // Tài nguyên tông (M5): mach = linh mạch 1 đến 3 (cho tu luyện), mo = mỏ và ruộng thuốc 0 đến 3 (cho thu nhập). Kho của tông chính là "wealth" (0-100) của thế lực.
  D.SECT_RES = {
    wealthBase: 22, perMach: 14, perMo: 9, drift: 0.15,   // kho trôi về mức 22 + 14 x mạch + 9 x mỏ
    tribute: 2,                 // cống nạp hằng năm cho vương triều mạnh trong vùng
    machLoss: 0.02, moGain: 0.03,
    hungry: 20, ok: 40, rich: 70,                           // ngưỡng kho: cạn kiệt, eo hẹp, ổn định, dồi dào
    names: ['Cạn kiệt', 'Eo hẹp', 'Ổn định', 'Dồi dào'],
    stipendMul: [0.5, 0.75, 1, 1.15], priceMul: [1.5, 1.2, 1, 0.9],
    trainPerMach: 0.02,        // người chơi: mỗi bậc linh mạch trên 1 cộng thêm vào tu luyện
    donateRate: 3, donateCap: 120   // quyên 1 hạ phẩm được 3 cống hiến, tối đa 120 cống hiến mỗi năm
  };

  // Luật tông: kiểm tra mỗi năm với người chơi. Phạm luật: lần 1 cảnh cáo, lần 2 phạt cống hiến, lần 3 trục xuất; mỗi năm yên thì giảm một lần cảnh cáo.
  D.SECT_LAWS = {
    sat: { n: 'Cấm sát sinh vô cớ', desc: 'Nghiệp từ 3 trở lên là phạm luật.', test: c => c.nghiep >= 3 },
    lao: { n: 'Phải ra sức vì tông', desc: 'Ba năm liền không đóng góp gì cho tông là phạm luật.', test: c => (c.sect.idleY || 0) >= 3 },
    chinh: { n: 'Giữ lòng chính đạo', desc: 'Điểm thiên hướng từ -30 trở xuống là phạm luật.', test: c => TT.rep.alignOf(c) <= -30 }
  };

  // Bốn đường trong tông (chọn khi lên nội môn). contrib, pay nhân vào cống hiến và tiền; hurt nhân xác suất bị thương; train cộng tu luyện.
  D.SECT_LINES = {
    chap: { n: 'Chấp pháp', desc: 'Tuần tra, trấn áp, hộ vệ. Nhiều công, dễ bị thương, tiếng tăm lớn.', contrib: 1.15, pay: 0.9, hurt: 1.5, train: 0 },
    duoc: { n: 'Dược và luyện', desc: 'Thu hái, luyện đan, luyện khí cho tông. Ít nguy hiểm, bổng khá, hay có linh thảo.', contrib: 1.0, pay: 1.3, hurt: 0.6, train: 0 },
    tang: { n: 'Tàng kinh', desc: 'Chép, giữ và nghiên cứu điển tịch. Ít công, nhưng tu luyện nhanh hơn và hay ngộ ra.', contrib: 0.9, pay: 0.9, hurt: 0.4, train: 0.04 },
    ngoai: { n: 'Ngoại vụ', desc: 'Giao thiệp, buôn bán, thu thập tin tức. Tiền nhiều, quen biết rộng.', contrib: 1.0, pay: 1.6, hurt: 0.8, train: 0 }
  };
  D.SECT_LINE_IDS = ['chap', 'duoc', 'tang', 'ngoai'];

  // Nhiệm vụ trên bảng tông (M2). dur: số tháng làm việc tông môn; diff nhân thưởng và rủi ro; risk: xác suất thất bại bị thương.
  D.SECT_TASKS = [
    { id: 'tuan_tra', line: 'chap', n: 'Tuần tra ranh giới', text: 'Dẫn một nhóm đệ tử tuần tra quanh địa phận tông môn, đuổi yêu thú và kẻ lạ mặt.', dur: [2, 4], diff: 1.0, risk: 1.0 },
    { id: 'truy_na', line: 'chap', n: 'Truy bắt kẻ phản đồ', text: 'Truy bắt một kẻ đã bỏ trốn khi mang theo của cải của tông.', dur: [3, 6], diff: 1.5, risk: 1.6 },
    { id: 'ho_ve', line: 'chap', n: 'Hộ vệ đoàn đệ tử ra ngoài', text: 'Hộ vệ đệ tử mới ra ngoài thử luyện, đừng để họ bỏ mạng.', dur: [2, 4], diff: 1.1, risk: 1.0 },
    { id: 'hai_thuoc', line: 'duoc', n: 'Hái linh thảo cho dược đường', text: 'Vào núi hái linh thảo theo danh sách của dược đường.', dur: [2, 3], diff: 0.9, risk: 0.6 },
    { id: 'luyen_dan', line: 'duoc', n: 'Phụ lò luyện đan', text: 'Phụ trông lò, canh lửa cho trưởng lão luyện một mẻ đan lớn.', dur: [3, 5], diff: 1.2, risk: 0.5 },
    { id: 'tri_benh', line: 'duoc', n: 'Chữa bệnh cho dân thôn', text: 'Xuống thôn dưới chân núi chữa một trận bệnh dịch, giữ tiếng tốt cho tông.', dur: [2, 4], diff: 1.0, risk: 0.7 },
    { id: 'chep_kinh', line: 'tang', n: 'Chép lại điển tịch cũ', text: 'Chép lại điển tịch sắp mục nát ở Tàng kinh các.', dur: [2, 4], diff: 0.8, risk: 0.3 },
    { id: 'tra_cuu', line: 'tang', n: 'Tra cứu tung tích một truyền thừa', text: 'Lục tìm trong sách cũ tung tích một bộ truyền thừa thất lạc.', dur: [3, 5], diff: 1.2, risk: 0.5 },
    { id: 'day_nhap_mon', line: 'tang', n: 'Dạy đệ tử nhập môn', text: 'Dạy bài học đầu tiên cho lứa đệ tử mới.', dur: [2, 3], diff: 0.9, risk: 0.2 },
    { id: 'thu_mua', line: 'ngoai', n: 'Thu mua vật liệu cho tông', text: 'Đi các chợ trấn thu mua vật liệu theo đơn của kho tông.', dur: [2, 4], diff: 1.0, risk: 0.8 },
    { id: 'ngoai_giao', line: 'ngoai', n: 'Đưa thư giao hảo', text: 'Mang quốc thư và lễ vật tới một thế lực lân cận, giữ hòa khí.', dur: [3, 5], diff: 1.3, risk: 0.9 },
    { id: 'dong_hanh', line: 'ngoai', n: 'Hộ tống thương đoàn của tông', text: 'Đi cùng thương đoàn của tông qua vùng nguy hiểm.', dur: [3, 6], diff: 1.4, risk: 1.3 }
  ];

  // Đại bỉ năm năm một lần: nhóm thi theo bậc (ngoại môn, nội môn, chân truyền).
  D.SECT_BI = { every: 5, groups: ['ngoại môn', 'nội môn', 'chân truyền'], reward: [80, 50, 30, 10], boardMonths: 12, boardSize: 4, lineChangeCost: 20, lineChangeCool: 24 };

  // Kho cống hiến: đổi điểm cống hiến lấy vật phẩm. Mốc sau (công pháp, vật phẩm) thêm mục mới vào đây.
  D.SECT_SHOP = [
    { id: 'pill', n: 'Phá Cảnh Đan', cost: 90, minRank: 0, desc: 'Cất vào túi, dùng khi đột phá để tăng xác suất.', can: () => false, run: c => { TT.items.add(c, 'pha_canh_dan'); return 'Bạn đổi được một viên Phá Cảnh Đan (trong túi).'; } },
    { id: 'heal', n: 'Linh dược chữa thương', cost: 40, minRank: 0, desc: 'Hồi đầy sinh lực.', can: c => (c.hp >= TT.stats.hpMax(c) ? 'Sinh lực đã đầy' : false), run: c => { c.hp = TT.stats.hpMax(c); return 'Bạn uống linh dược, thương thế lành hẳn.'; } },
    { id: 'tamdac', n: 'Tâm đắc của tiền bối', cost: 80, minRank: 1, desc: 'Tăng một phần tu vi và 1 đạo điểm.', can: () => false, run: c => { TT.ev.xp(c, TT.ev.NR(c) * 0.06); c.daoDiem += 1; return 'Bạn nghiền ngẫm tâm đắc của tiền bối, tu vi tăng.'; } },
    { id: 'dongphu', n: 'Mượn động phủ tông môn', cost: 160, minRank: 1, desc: 'Dùng động phủ linh khí cho lần đột phá tới.', can: c => (c.aid.room ? 'Đã có động phủ' : false), run: c => { c.aid.room = true; return 'Bạn được mượn động phủ linh khí của tông môn.'; } }
  ];
})();
