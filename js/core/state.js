// Cấu hình chung, trạng thái thế giới và các hàm tiện ích dùng khắp nơi.
(function () {
  const TT = window.TT = window.TT || {};

  TT.VERSION = 13;     // tăng khi cấu trúc bản lưu thay đổi
  TT.data = TT.data || {}; // dữ liệu tĩnh (cảnh giới, tiên thiên, tên...)
  TT.world = null;         // trạng thái thế giới hiện tại
  TT.quiet = false;        // true khi mô phỏng nền: không ghi nhật ký/tin tức

  TT.config = {
    monthMs: 5000 / 12,    // 1 năm game = 5 giây thật ở tốc độ x1
    startYear: 100,        // thế giới bắt đầu ở "năm 100" để tuổi sinh không âm
    coreMin: 15,           // số NPC lõi tối thiểu mỗi vùng đã có người ở
    coreMax: 20,           // số NPC lõi khi dựng vùng lần đầu
    autosaveMonths: 12,
    newsCap: 150,
    playerLogCap: 400,
    npcLogCap: 20,
    // Hệ số tốc độ thời gian. Đang vượt vùng thì chạy nhanh hơn nhiều vì hành trình kéo dài hàng chục năm.
    // M7 sẽ làm tốc độ tự nhanh dần theo cảnh giới.
    timeScale(player) {
      if (!player) return 1;
      if (player.cross) return 10;
      if (TT.age(player) < 12) return 6;
      return (TT.data.REALM_SPEED && TT.data.REALM_SPEED[Math.min(6, player.realm)]) || 1;
    }
  };

  TT.age = c => Math.floor((TT.world.months - c.birthMonth) / 12);
  TT.player = () => (TT.world ? TT.world.chars[TT.world.playerId] : null);

  TT.dateStr = function () {
    const m = TT.world.months;
    return 'Năm ' + (Math.floor(m / 12) - TT.config.startYear + 1) + ', tháng ' + (m % 12 + 1);
  };

  // note: dòng chi tiết nhỏ hiện dưới mục nhật ký (số liệu, nguyên nhân), không bắt buộc.
  // Phân loại mục nhật ký theo từ khoá để nhật ký hiện biểu tượng, lọc theo loại. Mục cũ trong bản lưu không có trường này nên phân loại muộn (lazy).
  const CAT_RULES = [
    ['nv', /nhiệm vụ|mục tiêu|đơn hàng/],
    ['chien', /bị thương|trọng thương|sinh lực -|tẩu hỏa|thiên kiếp|giao chiến|tập kích|thoi thóp|y quán|thương thế|thua|giết|truy sát|cướp/],
    ['tien', /luyện khí thành|luyện .*thất bại|nhóm lò|thu thập|nguyên liệu|vật liệu|phế phẩm/],
    ['tu', /đột phá|tu vi|cảnh giới|công pháp|tâm pháp|bế quan|tu luyện|đạo tâm|thiên cơ điểm|bình cảnh|đạo điểm|ngộ/],
    ['tong', /tông|nội môn|ngoại môn|trưởng lão|chưởng môn|cống hiến|nghề|đệ tử/],
    ['nguoi', /kết bạn|đạo lữ|bái|sư phụ|đồ đệ|sinh mệnh|người bạn|kẻ thù|giao du|thiện cảm|con của|chào đời|gia đình|cha |mẹ |hôn|tình/],
    ['tien', /bán|mua|linh thạch|vàng|trang bị|giá|hạ phẩm|kiếm tiền|nợ/],
    ['kp', /đã tới|đến đây|bí cảnh|tàn tích|vượt vùng|truyền tống|lên đường|khám phá|sinh ra|dọc đường|hầm/],
    ['the', /thiên địa|thế lực|chiến tranh|vương|triều|tin đồn|thương hội|thời đại|diệt/]
  ];
  const BAD_BIG = /thất bại|không vượt|chết|mất|bị bắt|trọng thương|tiêu diệt|nghiệp|bỏ mạng|đạo tiêu|không qua/;
  const GOOD_BIG = /thành công|hoàn thành|đột phá|kết|được|thăng|bái|nhận|phi thăng|chào đời|tin vui/;
  TT.logMeta = function (e) {
    if (e.cat) return e;
    const t = (e.t || '').toLowerCase();
    e.cat = 'the';
    for (const r of CAT_RULES) if (r[1].test(t)) { e.cat = r[0]; break; }
    e.lv = e.cls === 'big' ? 'big' : e.cls === 'age' ? 'minor' : 'norm';
    e.tone = e.cls === 'good' ? 'good' : e.cls === 'bad' ? 'bad' : e.cls === 'big' ? (BAD_BIG.test(t) ? 'bad' : GOOD_BIG.test(t) ? 'good' : '') : '';
    return e;
  };

  // note: dòng chi tiết nhỏ hiện dưới mục nhật ký (số liệu, nguyên nhân), không bắt buộc. Mục có sao (e.star) không bao giờ bị cắt khỏi nhật ký.
  TT.log = function (c, text, cls, note, cat) {
    if (TT.quiet || !c) return;
    const e = { m: TT.world.months, t: text, cls: cls || '' }; if (note) e.note = note; if (cat) e.cat = cat;
    if (c.kind === 'player') TT.logMeta(e);
    c.log.push(e);
    const cap = c.kind === 'player' ? TT.config.playerLogCap : TT.config.npcLogCap;
    if (c.log.length > cap) {
      let over = c.log.length - cap;
      if (c.kind === 'player' && over > 0) {
        const keep = [];
        for (let i = 0; i < c.log.length; i++) { if (over > 0 && !c.log[i].star) over--; else keep.push(c.log[i]); }
        c.log.length = 0; Array.prototype.push.apply(c.log, keep);
      } else c.log.splice(0, over);
    }
    TT.bus.emit('log', { id: c.id });
  };

  TT.news = function (text, cls, ids) {
    if (TT.quiet) return;
    const w = TT.world;
    w.news.push({ m: w.months, t: text, cls: cls || '', ids: ids || [] });
    if (w.news.length > TT.config.newsCap) w.news.splice(0, w.news.length - TT.config.newsCap);
    if (TT.press) TT.press.emit(text, cls, ids);
    TT.bus.emit('news', { text });
  };
})();
