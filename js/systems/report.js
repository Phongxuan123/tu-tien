// Báo cáo cuối năm của người chơi: tóm tắt kết quả và nguyên nhân (nhờ đâu mà tu vi tăng, vàng đổi thế nào), việc đáng chú ý,
// cảnh báo hạn chót, để thấy lựa chọn của mình có tác dụng. Lưu ở c.report (dữ liệu thuần).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, S = TT.stats;

  const report = TT.report = {
    // Gọi mỗi tháng sau khi nhân vật hành động.
    tick(c) {
      c.yr = c.yr || { months: {}, xp0: c.xp, gold0: TT.ls.wealth(c), realm0: c.realm, fame0: c.rep.danh, hp: 0, n: 0 };
      c.yr.months[c.focus] = (c.yr.months[c.focus] || 0) + 1;
      c.yr.hp += c.hp / S.hpMax(c); c.yr.n++;
    },

    // Gọi vào sinh nhật hằng năm, trước khi đặt lại bộ đếm năm.
    close(c) {
      const y = c.yr; if (!y) return;
      const w = TT.world, now = w.months;
      const share = Object.keys(y.months).map(k => [k, y.months[k]]).sort((a, b) => b[1] - a[1]);
      const label = k => ({ child: 'lớn lên', travel: 'đi đường', cross: 'vượt vùng' }[k] || (k === 'work' && c.sect ? 'nhiệm vụ tông môn' : D.ACTIONS[k] || k)).toLowerCase();
      // nguyên nhân tu vi
      const bonuses = [];
      const tm = TT.tech.trainMul(c); if (tm > 1.001) bonuses.push('công pháp +' + Math.round((tm - 1) * 100) + '%');
      const sb = TT.sect.trainBonus(c); if (sb > 1.001) bonuses.push('tông môn +' + Math.round((sb - 1) * 100) + '%');
      const mb = TT.family.masterBonus(c); if (mb > 1.001) bonuses.push('sư phụ +' + Math.round((mb - 1) * 100) + '%');
      if (c.ring) bonuses.push('chiếc nhẫn +50%');
      const need = S.need(c);
      const xpGain = c.realm === y.realm0 ? c.xp - y.xp0 : 0;
      // mọi việc đáng kể trong năm (kể cả kết quả lựa chọn có cls thường hoặc tốt), tối đa 12 mục gần nhất; bỏ việc vặt (cls age)
      const notable = c.log.filter(x => x.m > now - 12 && x.cls !== 'age').slice(-12).map(x => x.t.length > 160 ? x.t.slice(0, 157) + '...' : x.t);
      // cảnh báo
      const warn = [];
      TT.quests.active(c).forEach(g => { const left = g.byAge - TT.age(c); if (left <= Math.max(1, Math.round((g.byAge - g.startAge) / 3))) warn.push('Nhiệm vụ "' + g.text + '" chỉ còn ' + Math.max(0, left) + ' năm (đang ' + Math.round(TT.quests.progress(c, g) * 100) + '%).'); });
      TT.rumors.active().forEach(o => { if (o.kind === 'ke_thu') warn.push(o.text); else if (o.region === c.region && o.open - now <= 18 && o.open >= now) warn.push(o.name + ' sắp mở sau ' + (o.open - now) + ' tháng.'); });
      const life = S.lifeSpan(c);
      if (life !== Infinity && life - TT.age(c) <= 10) warn.push('Thọ nguyên chỉ còn khoảng ' + Math.max(0, life - TT.age(c)) + ' năm.');
      if (TT.loss.active(c)) warn.push(D.WOUND[c.wound.sev].n + ' còn ' + TT.loss.left(c) + ' tháng: sinh lực tối đa và tốc độ tu luyện đang giảm, nên nghỉ ngơi cho mau lành.');
      if (c.stuck) warn.push('Đang kẹt bình cảnh: thiếu cơ duyên (' + Math.floor(c.fortune) + '/' + S.fortuneNeed(c) + ').');
      const avgHp = y.n ? y.hp / y.n : 1;
      if (avgHp < 0.5) warn.push('Sinh lực trung bình cả năm chỉ ' + Math.round(avgHp * 100) + '%, nên nghỉ ngơi nhiều hơn.');
      c.report = {
        age: TT.age(c), realm: D.REALM_NAMES[c.realm], promoted: c.realm > y.realm0,
        xp: Math.round(xpGain), xpPct: need === Infinity ? 100 : Math.min(100, Math.round(c.xp / need * 100)),
        gold: Math.round(TT.ls.wealth(c) - y.gold0), fame: c.rep.danh - y.fame0,
        share: share.slice(0, 4).map(x => label(x[0]) + ' ' + x[1] + ' tháng'), bonuses, notable, warn,
        why: xpGain > 0 ? 'Tu vi +' + Math.round(xpGain) + (share.length ? ' chủ yếu nhờ ' + label(share[0][0]) : '') + (bonuses.length ? ' (' + bonuses.join(', ') + ')' : '') + '.' : (c.realm > y.realm0 ? 'Bạn đã đột phá, tu vi đặt lại.' : 'Năm nay tu vi không tăng.')
      };
      // điểm năm cho bản đồ cuộc đời (0 tệ, 1 tốt): nền 0,5, cộng theo tiến độ tu vi và việc tốt, trừ theo việc xấu, thương tích, sức khỏe yếu
      const recent = c.log.filter(x => x.m > now - 12), goods = recent.filter(x => x.cls === 'good').length, bads = recent.filter(x => x.cls === 'bad').length;
      const prog = need === Infinity ? 0 : Math.min(0.3, xpGain / need * 3);
      const sc = Math.max(0, Math.min(1, 0.5 + prog + (c.realm > y.realm0 ? 0.25 : 0) + Math.min(0.15, goods * 0.03) - Math.min(0.4, bads * 0.07) - (avgHp < 0.5 ? 0.1 : 0) - (TT.loss.active(c) ? 0.08 : 0)));
      c.life = c.life || { y: {}, m: {} }; c.life.y[TT.age(c)] = Math.round(sc * 100) / 100;
      c.yr = null;
    },
    // Ghi một mốc đời (chấm vàng trên bản đồ cuộc đời).
    mark(c, kind, text) {
      if (!c || c.kind !== 'player') return;
      c.life = c.life || { y: {}, m: {} };
      const a = TT.age(c); (c.life.m[a] = c.life.m[a] || []).push({ k: kind, t: text });
      if (TT.quests) TT.quests.event(c, kind);
      if (TT.path) TT.path.event(c, kind);
    }
  };
})();
