// Công cụ đo độ khó hầm mộ trong console của index.html (không dùng khi chơi): nạp bằng
//   await fetch('/tools/dgsim.js').then(r => r.text()).then(eval)
// rồi gọi dgsim('bi_canh' | 'tan_tich' | 'hung_dia', cảnh_giới, số_lượt, gear) với gear = 0 là tay không (không pháp khí, không công pháp).
// Người chơi do máy chọn mặc định (cùng bộ trọng số ai của các lựa chọn), nên đây chỉ là mốc so sánh, không phải người chơi giỏi.
(function () {
  window.dgsim = function (kind, realm, n, gear) {
    const S = TT.stats, places = { bi_canh: 'nl_me_vu', tan_tich: 'tc_co_dao', hung_dia: 'nl_yeu_thu' };
    TT.life.createWorld(1002); TT.config.autosaveMonths = 1e12; TT.time.stop();
    const cnt = { xong: 0, rut: 0, chay: 0, bai: 0, chet: 0, treo: 0 }; let wounded = 0, items0 = 0, items1 = 0;
    const orig = TT.dungeon.finish; let how = null; TT.dungeon.finish = function (c, h) { how = h; return orig.apply(this, arguments); };
    try {
      for (let i = 0; i < n; i++) {
        const c = TT.createChar({ kind: 'player', age: 20 }); Object.assign(c, { realm, gold: 100, direction: 'can_bang' });
        c.tuchat = { total: 90, attrs: [{ n: 'Kim', di: false, p: 55 }, { n: 'Thủy', di: false, p: 35 }] };
        c.region = TT.map.place(places[kind]).region; c.place = places[kind]; c.travel = null; c.cross = null; c.personality = 'trung_lap';
        if (gear !== 0) {
          TT.items.add(c, 'kiem_tinh'); TT.items.equip(c, 'kiem_tinh'); TT.items.add(c, 'ao_da'); TT.items.equip(c, 'ao_da');
          TT.items.add(c, 'ho_than_bua', 2); TT.items.add(c, 'hoi_xuan_dan', 3); c.techs = { han_thiet: { lv: 3, xp: 0 } }; c.techMain = 'han_thiet';
        }
        c.rules = TT.rules.defaults(); c.hp = S.hpMax(c); c.baseKv = 0;
        how = null; TT.world.pending = null; c.dgCool = 0; TT.dungeon.enter(c, c.place, kind);
        for (let g = 0; g < 30 && c.dungeon && c.alive; g++) { if (!TT.world.pending) break; TT.decisions.resolveDefault(); }
        if (!c.alive) how = 'chet'; cnt[how || 'treo']++; if (c.wound) wounded++; TT.world.pending = null;
      }
    } finally { TT.dungeon.finish = orig; }
    const pct = k => Math.round(cnt[k] / n * 100) + '%';
    return kind + ' r' + realm + (gear === 0 ? ' tay không' : '') + ': thông quan ' + pct('xong') + ', rút ' + pct('rut') + ', chạy ' + pct('chay') + ', bại ' + pct('bai') + ', chết ' + pct('chet') + ' | thương tích ' + Math.round(wounded / n * 100) + '%';
  };
  // Người chơi "tính toán": công khi khỏe, thủ khi yếu, uống đan, nghỉ ở chỗ nghỉ, lấy vừa đủ khi yếu, rút khi dưới nửa sinh lực. Dùng so với dgsim.
  window.smartsim = function (kind, realm, n) {
    const S = TT.stats, places = { bi_canh: 'nl_me_vu', tan_tich: 'tc_co_dao', hung_dia: 'nl_yeu_thu' };
    TT.life.createWorld(1002); TT.time.stop(); const cnt = { xong: 0, rut: 0, chay: 0, bai: 0, chet: 0, treo: 0 };
    const orig = TT.dungeon.finish; let how = null; TT.dungeon.finish = function (c, h) { how = h; return orig.apply(this, arguments); };
    try {
      for (let i = 0; i < n; i++) {
        const c = TT.createChar({ kind: 'player', age: 20 }); Object.assign(c, { realm, gold: 100, direction: 'can_bang' });
        c.tuchat = { total: 90, attrs: [{ n: 'Kim', di: false, p: 55 }, { n: 'Thủy', di: false, p: 35 }] };
        c.region = TT.map.place(places[kind]).region; c.place = places[kind]; c.travel = null; c.cross = null; c.personality = 'trung_lap';
        TT.items.add(c, 'kiem_tinh'); TT.items.equip(c, 'kiem_tinh'); TT.items.add(c, 'ao_da'); TT.items.equip(c, 'ao_da');
        TT.items.add(c, 'ho_than_bua', 2); TT.items.add(c, 'hoi_xuan_dan', 3); c.techs = { han_thiet: { lv: 3, xp: 0 } }; c.techMain = 'han_thiet';
        c.rules = TT.rules.defaults(); c.hp = S.hpMax(c); c.baseKv = 0; how = null; TT.world.pending = null; c.dgCool = 0; TT.dungeon.enter(c, c.place, kind);
        for (let g = 0; g < 40 && c.dungeon && c.alive; g++) {
          const d = TT.world.pending; if (!d) break;
          if (c.hp / S.hpMax(c) < 0.45 && TT.items.has(c, 'hoi_xuan_dan')) TT.items.use(c, 'hoi_xuan_dan');
          const keys = d.choices.map(x => x.key), hf = c.hp / S.hpMax(c);
          const pick = (...ks) => { for (const k of ks) { const j = keys.indexOf(k); if (j >= 0) return j; } return 0; };
          let j;
          if (keys.includes('cong')) j = hf < 0.5 ? pick('rut', 'thu', 'chay') : (hf < 0.7 ? pick('thu', 'cong') : pick('cong', 'thu'));
          else if (keys.includes('nghi')) j = pick('nghi');
          else if (keys.includes('giai')) j = pick('giai', 'vong');
          else if (keys.includes('lay_het')) j = hf > 0.7 ? pick('lay_het', 'lay_it') : pick('lay_it');
          else j = 0;
          TT.decisions.resolve(j);
        }
        if (!c.alive) how = 'chet'; cnt[how || 'treo']++; TT.world.pending = null;
      }
    } finally { TT.dungeon.finish = orig; }
    const pct = k => Math.round(cnt[k] / n * 100) + '%';
    return 'TÍNH TOÁN ' + kind + ' r' + realm + ': thông quan ' + pct('xong') + ', rút ' + pct('rut') + ', chạy ' + pct('chay') + ', bại ' + pct('bai') + ', chết ' + pct('chet') + ', treo ' + cnt.treo;
  };  return 'dgsim ok';
})();
