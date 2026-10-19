// Ngã rẽ cuộc đời: người chơi không chọn "hướng đi" từ danh sách nữa mà chọn một con đường (đạo) tại các mốc (tuổi 12, đột phá,
// vào tông, có đạo lữ, thương nặng, thông quan bí cảnh, lâu không đổi). Bỏ đạo giữa chừng được nhưng mất đạo tâm và thành thạo.
// Khóa đường = c.direction (để AI, sự kiện, tin đồn vẫn dùng D.DIRECTIONS); trạng thái ở c.path = { id, since, mo, adapt, last, n, want }.
// TT.path.mods(c) trả hệ số hiệu ứng (train, gold, social, fortune, craft, risk) cho các hệ thống khác.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng;

  const NEUTRAL = { train: 1, gold: 1, social: 1, fortune: 1, craft: 1, risk: 1 };
  const yearsOf = mo => mo / 12;

  const path = TT.path = {
    get(c) { return c && c.path && D.PATHS[c.path.id] ? c.path : null; },
    // Cấp thành thạo 0-5 theo số năm đã đi.
    lv(c) {
      const p = path.get(c); if (!p) return 0;
      let lv = 0; D.PATH_LV_YEARS.forEach((y, i) => { if (yearsOf(p.mo) >= y) lv = i; });
      return lv;
    },
    years(c) { const p = path.get(c); return p ? Math.floor(yearsOf(p.mo)) : 0; },
    name(c) { const p = path.get(c); return p ? D.PATHS[p.id].n : 'chưa chọn'; },
    tag(c) { const p = path.get(c); return p ? D.PATHS[p.id].tag : null; },

    // Hệ số hiệu ứng của đường hiện tại. Phần có lợi tăng theo thành thạo, giảm nửa khi đang thích nghi; phần bất lợi giữ nguyên.
    mods(c) {
      const p = path.get(c); if (!p || c.kind !== 'player') return NEUTRAL;
      const def = D.PATHS[p.id].mods, lv = path.lv(c), adapt = TT.world.months < p.adapt;
      const out = Object.assign({}, NEUTRAL);
      Object.keys(def).forEach(k => {
        let v = def[k]; const good = k === 'risk' ? v < 1 : v > 1;
        if (good) { const dev = (v - 1) * (1 + D.PATH_LV_STEP * lv) * (adapt ? 0.5 : 1); v = 1 + dev; }
        out[k] = v;
      });
      return out;
    },

    // Đặt đường mới. Giữ phần thành thạo cũ nếu từng đi đường này.
    set(c, id, why) {
      const w = TT.world, old = path.get(c);
      c.pathMo = c.pathMo || {};
      if (old) c.pathMo[old.id] = Math.max(c.pathMo[old.id] || 0, old.mo);
      const changed = !old || old.id !== id;
      const mo = old && old.id === id ? old.mo : (c.pathMo[id] || 0);
      c.path = { id, since: changed ? w.months : old.since, mo, adapt: changed && old ? w.months + D.PATH_ADAPT : 0, last: w.months, n: (old ? old.n : 0) + 1, want: '' };
      c.direction = id;
      if (changed) TT.report.mark(c, 'path', 'Ngã rẽ: đạo ' + D.PATHS[id].n);
      if (TT.quests && TT.quests.onPath) TT.quests.onPath(c, changed);
      return changed;
    },

    // Bỏ đạo giữa chừng: mất đạo tâm, mất một nửa thành thạo, rồi chọn đường mới ngay.
    quitCost(c) { const p = path.get(c); return p ? D.PATH_QUIT_DAO + 2 * path.lv(c) : 0; },
    abandon(c) {
      const p = path.get(c); if (!p || TT.world.pending) return false;
      const cost = path.quitCost(c); TT.ev.dao(c, -cost);
      c.pathMo = c.pathMo || {}; c.pathMo[p.id] = Math.floor(p.mo * D.PATH_QUIT_KEEP);
      TT.log(c, 'Bạn bỏ đạo ' + D.PATHS[p.id].n.toLowerCase() + ' giữa chừng.', 'bad', 'Đạo tâm -' + cost + ', mất một nửa phần thành thạo (còn giữ ' + path.years({ path: { id: p.id, mo: c.pathMo[p.id] } }) + ' năm).');
      c.path = null; c.direction = 'can_bang';
      path.request(c, 'abandon');
      return true;
    },

    // ---------- hộp ngã rẽ ----------
    describe(id) { const d = D.PATHS[id]; return 'Được: ' + d.gain.join('; ') + '. Mất: ' + d.lose.join('; ') + '.'; },
    // Máy chọn thay người chơi: hợp tính cách, tư chất, nghề, nhiệm vụ đang ưu tiên, và giữ đường cũ cho vững.
    autoWeights(c) {
      const pers = D.personalityById[c.personality] || D.personalityById.trung_lap, cur = path.get(c);
      const top = TT.quests ? TT.quests.sorted(c)[0] : null;
      const w = {};
      D.PATH_IDS.forEach(id => {
        let v = 1; const d = D.PATHS[id];
        if (cur && cur.id === id) v += 1.2;
        if (id === 'tu_luyen') v += c.tuchat.total / 90 + (pers.w && pers.w.train ? pers.w.train - 1 : 0);
        if (id === 'kiem_song') v += TT.ls.wealth(c) < 100 * (1 + c.realm) ? 1.2 : 0.2;
        if (id === 'phieu_luu') v += (pers.bold || 1) > 1.3 ? 1.2 : 0.2;
        if (id === 'giao_du') v += pers.w && pers.w.social ? pers.w.social - 0.8 : 0.3;
        if (id === 'luyen_nghe') v += c.craft ? Math.max(0, TT.craft.aptitude(c, TT.craft.bestFocus(c)) - 0.9) * 1.5 : 0.2;
        if (top && top.tag === d.tag) v += 1.2;
        w[id] = Math.max(0.1, v);
      });
      return w;
    },
    request(c, why) {
      if (c.kind !== 'player' || TT.world.pending) return false;
      const cur = path.get(c), w = path.autoWeights(c), ids = D.PATH_IDS.slice();
      const choices = [];
      if (cur) choices.push({ key: cur.id, label: 'Tiếp tục đạo ' + D.PATHS[cur.id].n + ' (đã đi ' + path.years(c) + ' năm, thành thạo cấp ' + path.lv(c) + ')', why: path.describe(cur.id) });
      ids.forEach(id => { if (!cur || cur.id !== id) choices.push({ key: id, label: (cur ? 'Đổi sang đạo ' : 'Chọn đạo ') + D.PATHS[id].n + (c.pathMo && c.pathMo[id] ? ' (từng đi, còn nhớ ' + Math.floor(c.pathMo[id] / 12) + ' năm)' : ''), why: path.describe(id) }); });
      const pick = rng.wpick(choices.map(x => ({ k: x.key, w: w[x.key] })), x => x.w).k;
      const def = Math.max(0, choices.findIndex(x => x.key === pick));
      const switchNote = cur ? ' Đổi sang đường khác ở ngã rẽ này không bị phạt, nhưng mười hai tháng đầu phần lợi giảm một nửa.' : '';
      TT.decisions.request({
        type: 'crossroad', charId: c.id, tier: 3, autoOk: true, why,
        title: cur ? 'Ngã rẽ cuộc đời' : 'Chọn con đường của bạn',
        text: (D.CROSS_WHY[why] || D.CROSS_WHY.time) + '\nMỗi đường cho bạn một thế mạnh và một cái giá; càng đi lâu càng thành thạo.' + switchNote + '\nĐang theo: ' + (cur ? D.PATHS[cur.id].n : 'chưa có') + '.',
        choices, def
      });
      if (cur && TT.world.pending && TT.world.pending.type === 'crossroad') cur.last = TT.world.months;
      return true;
    },
    choose(c, key, why) {
      const old = path.get(c), changed = path.set(c, key, why);
      if (changed) TT.log(c, (old ? 'Ngã rẽ: bạn đổi sang đạo ' : 'Bạn chọn đạo ') + D.PATHS[key].n.toLowerCase() + '.', 'big', path.describe(key));
      if (changed && (key === 'kiem_song' || key === 'luyen_nghe') && TT.job) TT.job.offer(c, key);
      else TT.log(c, 'Ngã rẽ: bạn vẫn kiên định với đạo ' + D.PATHS[key].n.toLowerCase() + ' (đã đi ' + path.years(c) + ' năm).', 'age');
    },

    // ---------- chu kỳ ----------
    // Báo một mốc đời (từ TT.report.mark): nếu đủ thời gian kể từ ngã rẽ trước thì mở ngã rẽ ở lần kiểm tra sau.
    event(c, kind) {
      if (c.kind !== 'player') return;
      const p = path.get(c); if (!p) return;
      const why = ({ realm: 'realm', sect: 'sect', love: 'love', hurt: 'hurt', clear: 'clear' })[kind]; if (!why) return;
      if (TT.world.months - p.last < D.PATH_COOL * 12) return;
      if (!p.want) p.want = why;
    },
    tick(c) {
      if (c.kind !== 'player' || !c.alive) return;
      const w = TT.world, p = path.get(c);
      if (p) { p.mo++; if (c.direction !== p.id) c.direction = p.id; }
      if (w.pending || c.cross) return;
      if (!p) { path.adopt(c); if (!path.get(c)) { if (TT.age(c) >= 12 && !c.pathAsked) { c.pathAsked = true; path.request(c, 'start'); } } return; }
      if (p.want) { const why = p.want; p.want = ''; path.request(c, why); return; }
      if (w.months - p.last >= D.PATH_LONG * 12) path.request(c, 'time');
    },
    // Dùng cho bản lưu cũ: nhân vật đã có hướng đi từ trước thì coi như đã chọn đường đó.
    adopt(c) {
      if (c.kind !== 'player' || path.get(c)) return;
      if (D.PATHS[c.direction]) { const w = TT.world; c.path = { id: c.direction, since: w.months, mo: 0, adapt: 0, last: w.months, n: 1, want: '' }; c.pathAsked = true; }
    }
  };
})();
