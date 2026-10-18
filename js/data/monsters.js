// Quái vật và thủ vệ gặp ở bí cảnh, hung địa, tàn tích và dọc đường. tier 0-3 (yếu tới thủ lĩnh). f: hệ số sức mạnh so với người cùng cảnh giới.
// guard: thủ vệ tàn tích, boss: thủ lĩnh cuối. drops: [[vật phẩm, xác suất]].
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.MONSTERS = [
    { id: 'soi_gio', n: 'Sói gió', elem: 'Phong', tier: 0, f: 0.8, drops: [['yeu_dan', 0.25]], desc: 'Một bầy sói lông xám xông ra, nhanh như gió.' },
    { id: 'ran_doc', n: 'Rắn độc rừng sâu', elem: 'Mộc', tier: 0, f: 0.78, drops: [['linh_thao', 0.4]], desc: 'Một con rắn khổng lồ lặng lẽ trườn tới, nanh nhỏ độc.' },
    { id: 'heo_rung', n: 'Lợn rừng thành tinh', elem: 'Thổ', tier: 0, f: 0.85, drops: [['yeu_dan', 0.3]], desc: 'Một con lợn rừng cao bằng người húc tung bụi cỏ.' },
    { id: 'cop_bang', n: 'Hổ tuyết', elem: 'Băng', tier: 1, f: 0.92, drops: [['yeu_dan', 0.45]], desc: 'Hổ trắng như tuyết, mỗi bước chân đều để lại băng giá.' },
    { id: 'hoa_than', n: 'Thằn lằn lửa', elem: 'Hỏa', tier: 1, f: 0.9, drops: [['quang_thach', 0.4], ['yeu_dan', 0.3]], desc: 'Thằn lằn đỏ rực nhả ra những đốm lửa.' },
    { id: 'loi_ung', n: 'Ưng sét', elem: 'Lôi', tier: 1, f: 0.95, drops: [['yeu_dan', 0.45]], desc: 'Một con ưng sà xuống, cánh nó lấp lóe tia sét.' },
    { id: 'thuy_xa', n: 'Giao long con', elem: 'Thủy', tier: 1, f: 0.92, drops: [['yeu_dan', 0.45]], desc: 'Giao long nhỏ trồi lên từ nước, vảy xanh biếc.' },
    { id: 'kim_giap', n: 'Ong giáp vàng', elem: 'Kim', tier: 1, f: 0.9, drops: [['quang_thach', 0.5]], desc: 'Bầy ong khổng lồ vỏ cứng như kim loại vo ve quanh bạn.' },
    { id: 'am_hon', n: 'Oán hồn', elem: 'Âm', tier: 2, f: 1.0, drops: [['phu_giay', 0.5]], desc: 'Một oán hồn lờ mờ lướt tới, hơi lạnh thấu xương.' },
    { id: 'phuong_non', n: 'Hỏa phượng non', elem: 'Dương', tier: 2, f: 1.0, drops: [['yeu_dan', 0.5], ['quang_thach', 0.3]], desc: 'Một con phượng non rực lửa lao xuống bảo vệ tổ.' },
    { id: 'thu_ve', n: 'Thủ vệ cổ (tượng đá)', elem: 'Thổ', tier: 2, f: 1.08, guard: true, drops: [['quang_thach', 0.6]], desc: 'Tượng đá canh cửa bỗng mở mắt, bước xuống bệ.' },
    { id: 'kiem_linh', n: 'Kiếm linh', elem: 'Kim', tier: 2, f: 1.08, guard: true, drops: [['quang_thach', 0.5]], desc: 'Những thanh kiếm cổ tự rời vỏ, kết thành một bóng kiếm.' },
    { id: 'long_huyet', n: 'Long huyết thú', elem: 'Hỏa', tier: 3, f: 1.15, boss: true, drops: [['yeu_dan', 1]], desc: 'Thủ lĩnh của nơi này hiện thân: thú mang huyết mạch rồng, lửa phun ngút trời.' },
    { id: 'co_tu', n: 'Linh hồn cổ tu', elem: 'Âm', tier: 3, f: 1.15, boss: true, drops: [['phu_giay', 1]], desc: 'Tàn hồn của một tu sĩ cổ đại ngồi trên đài cao, mở mắt nhìn bạn.' },
    { id: 'bang_vuong', n: 'Băng vương thú', elem: 'Băng', tier: 3, f: 1.15, boss: true, drops: [['yeu_dan', 1]], desc: 'Con thú khổng lồ phủ băng dày trăm năm thức dậy giữa tiếng gầm.' },
    { id: 'loi_long', n: 'Lôi long', elem: 'Lôi', tier: 3, f: 1.2, boss: true, drops: [['yeu_dan', 1]], desc: 'Một con rồng sấm cuộn mình giữa tầng mây trong động, sét giáng như mưa.' }
  ];
  D.monsterById = {};
  D.MONSTERS.forEach(m => { D.monsterById[m.id] = m; });

  // Độ khó thám hiểm (chỉnh bằng mô phỏng, xem KE-HOACH mục 17): hệ số sức mạnh quái thường và thủ lĩnh, tăng cảnh giới quái theo chặng,
  // tỉ lệ quái đầu đàn, độ khó cấm chế và sát thương cạm bẫy.
  D.DG = { mob: 0.86, boss: 0.93, depthStep: 0.05, bossStep: 0.15, eliteP: 0.18, eliteMul: 1.12, trap: 1.3, trapDmg: 1.4, wild: 1.12, wildUp: 0.15, hunter: 1.15, ambush: 0.11 };

  // Mẫu bí cảnh. steps: dãy loại bước (fight, trap, treasure, rest, boss); lead: mức nguy hiểm tương đối tới cảnh giới quái.
  D.DUNGEONS = {
    bi_canh: { n: 'Bí cảnh', minRealm: 1, lead: 0.05, steps: [['trap', 'fight'], ['fight', 'trap'], ['treasure', 'rest'], ['fight'], ['boss']], lethalBoss: true,
      intro: 'Cổng bí cảnh sáng lên một vầng linh quang. Bạn hít sâu rồi bước vào, linh khí đặc quánh quanh người.' },
    tan_tich: { n: 'Tàn tích', minRealm: 1, lead: 0.1, steps: [['trap'], ['treasure', 'fight'], ['trap', 'fight'], ['boss']], lethalBoss: false,
      intro: 'Bạn lách qua đống đá đổ nát và đi sâu vào lòng tàn tích. Bụi trăm năm bốc lên theo từng bước chân.' },
    hung_dia: { n: 'Hung địa', minRealm: 1, lead: 0.15, steps: [['fight'], ['fight', 'rest'], ['fight'], ['boss']], lethalBoss: true,
      intro: 'Nơi đây thú dữ nuôi dòng giống từ ngàn năm. Mỗi bước đi đều có thể là bước cuối cùng.' }
  };

  D.TRAP_TEXTS = [
    ['Một đạo cấm chế cổ chặn lối, linh quang lập lòe như mắt thú.', 'nl'],
    ['Sàn đá rung lên, những mũi tên đá ẩn trong tường chực bắn ra.', 'luck'],
    ['Hành lang tràn ngập sương độc, cần có cách qua.', 'elem'],
    ['Một bức tượng đá hỏi ba câu đố cổ, sai thì cơ quan nổ tung.', 'nl'],
    ['Lối đi bị một khối đá khổng lồ chắn kín, bên kia có ánh sáng.', 'atk'],
    ['Nền đất dưới chân bỗng mềm nhũn thành vũng lầy hút người.', 'luck']
  ];
  D.TREASURE_TEXTS = [
    'Một gian phòng đầy rương cổ, ánh linh thạch lấp lánh trong bóng tối.',
    'Giữa đại sảnh, một bệ đá đặt chiếc túi trữ vật của chủ nhân xưa.',
    'Trong hốc đá, một gốc dược thảo ngàn năm tỏa hương nồng nàn.',
    'Dưới lớp bụi, một bộ binh khí cổ vẫn còn lóe sáng.'
  ];
  D.REST_TEXTS = [
    'Một góc tĩnh lặng có dòng suối linh khí nhỏ, có thể dừng lại lấy sức.',
    'Phía sau một cánh cửa đá, căn phòng nhỏ yên ắng lạ thường.'
  ];
})();


