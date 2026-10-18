// Vượt vùng: rời bản đồ nhỏ của một vùng sang vùng khác. Rất khó: cần cảnh giới cao và nhiều năm,
// hoặc đi tắt bằng truyền tống trận cổ hay thương đoàn với điều kiện khắt khe.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats, SC = D.SHORTCUT;

  const cross = TT.cross = {
    knows: (c, rid) => !!(c.knownRegions && c.knownRegions[rid]),
    learn(c, rid) { c.knownRegions = c.knownRegions || {}; c.knownRegions[rid] = true; },
    // Tên vùng nếu đã biết; nếu chưa thì chỉ nói hướng so với vùng đang ở (để phân biệt các vùng chưa biết).
    regionLabel(c, rid) {
      if (cross.knows(c, rid)) return TT.map.region(rid).n;
      const from = TT.map.region(c.cross ? c.cross.from : c.region), to = TT.map.region(rid);
      if (!from || !to || from.id === to.id) return 'Vùng chưa biết';
      const deg = Math.atan2(-(to.y - from.y), to.x - from.x) * 180 / Math.PI; // 0 = Đông, 90 = Bắc
      const names = ['Đông', 'Đông Bắc', 'Bắc', 'Tây Bắc', 'Tây', 'Tây Nam', 'Nam', 'Đông Nam'];
      const idx = Math.round(((deg + 360) % 360) / 45) % 8;
      return 'Vùng chưa biết (phía ' + names[idx] + ')';
    },

    // Các cách vượt vùng khả dụng tại địa điểm hiện tại của nhân vật.
    options(c) {
      if (!c.place || c.travel || c.cross) return [];
      const place = TT.map.place(c.place);
      const out = [];
      TT.map.macroNeighbors(c.region).forEach(nb => {
        const e = nb.edge, to = nb.to, label = cross.regionLabel(c, to);
        if (place.gate) {
          const speed = Math.max(0.5, 1 - SC.selfSpeedup * Math.max(0, c.realm - e.minRealm));
          const years = Math.round(e.years * speed);
          const why = [];
          if (c.realm < e.minRealm) why.push('Cần cảnh giới ' + D.REALM_NAMES[e.minRealm] + ' trở lên');
          out.push({
            key: 'tu_than:' + to, method: 'tu_than', to, label, years, gold: 0, fortune: 0,
            title: 'Tự thân vượt vùng tới ' + label, ok: why.length === 0, why,
            note: 'Mất ' + years + ' năm, tu luyện trên đường ở ' + Math.round(SC.crossTrainMul * 100) + '% tốc độ, không làm việc được, gặp sự kiện dọc đường.'
          });
        }
        if (place.type === 'thuong_doan' && e.caravan) {
          const years = Math.max(1, Math.ceil(e.years * SC.caravan.yearsMul));
          const gold = SC.caravan.goldPerYear * e.years;
          const why = [];
          if (c.realm < SC.caravan.minRealm) why.push('Cần cảnh giới ' + D.REALM_NAMES[SC.caravan.minRealm] + ' trở lên');
          if (!TT.ls.can(c, gold)) why.push('Cần ' + TT.ls.fmt(gold) + ' (đang có ' + TT.ls.fmt(TT.ls.wealth(c)) + ')');
          out.push({
            key: 'thuong_doan:' + to, method: 'thuong_doan', to, label, years, gold, fortune: 0,
            title: 'Đi theo thương đoàn tới ' + label, ok: why.length === 0, why,
            note: 'Mất ' + years + ' năm theo đoàn thương nhân, được hộ tống nên ít nguy hiểm hơn. Tốn rất nhiều vàng.'
          });
        }
        if (place.portal) {
          const P = SC.portal, why = [];
          if (c.realm < P.minRealm) why.push('Cần cảnh giới ' + D.REALM_NAMES[P.minRealm] + ' trở lên');
          if (!TT.ls.can(c, P.gold)) why.push('Cần ' + TT.ls.fmt(P.gold) + ' (đang có ' + TT.ls.fmt(TT.ls.wealth(c)) + ')');
          if (c.fortune < P.fortune) why.push('Cần ' + P.fortune + ' cơ duyên (đang có ' + Math.floor(c.fortune) + ')');
          out.push({
            key: 'tran_phap:' + to, method: 'tran_phap', to, label, years: 0, gold: P.gold, fortune: P.fortune,
            title: 'Kích hoạt truyền tống trận cổ tới ' + label, ok: why.length === 0, why,
            note: 'Tới nơi tức thì nhưng chỉ thành công khoảng ' + Math.round(P.success * 100) + '%. Thất bại thì mất hết chi phí, bị trọng thương và có thể chết.'
          });
        }
      });
      if (place.type === 'tong_mon') {
        const T = D.SECT_RULES.portal;
        TT.map.macroNeighbors(c.region).forEach(nb => {
          const why = [];
          const own = c.sect && c.sect.id === place.id;
          if (!own) why.push('Chỉ đệ tử của tông môn này mới được dùng đại trận');
          else if (c.sect.rank < T.minRank) why.push('Cần chức vị ' + D.SECT_RANKS[T.minRank] + ' trở lên (bạn là ' + D.SECT_RANKS[c.sect.rank] + ')');
          if (own && c.sect.contrib < T.contrib) why.push('Cần ' + T.contrib + ' cống hiến (đang có ' + Math.floor(c.sect.contrib) + ')');
          if (!TT.ls.can(c, T.gold)) why.push('Cần ' + TT.ls.fmt(T.gold) + ' (đang có ' + TT.ls.fmt(TT.ls.wealth(c)) + ')');
          out.push({
            key: 'tong_mon:' + nb.to, method: 'tong_mon', to: nb.to, label: cross.regionLabel(c, nb.to), years: 0, gold: T.gold, fortune: 0, contrib: T.contrib,
            title: 'Đại trận của tông môn tới ' + cross.regionLabel(c, nb.to), ok: why.length === 0, why,
            note: 'Tới nơi tức thì, khá an toàn (thành công khoảng ' + Math.round(T.success * 100) + '%). Tốn ' + T.contrib + ' cống hiến và ' + TT.ls.fmt(T.gold) + '. Chỉ trưởng lão trở lên được dùng.'
          });
        });
      }
      return out;
    },

    // Bắt đầu vượt vùng theo tuỳ chọn. Trả về { ok, text }.
    // opts.tcd: dùng 3 Thiên cơ điểm để tăng 20% xác suất thành công của truyền tống trận.
    start(c, key, opts) {
      opts = opts || {};
      const opt = cross.options(c).find(o => o.key === key);
      if (!opt) return { ok: false, text: 'Tuỳ chọn không còn khả dụng.' };
      if (!opt.ok) return { ok: false, text: opt.why.join('; ') };
      const w = TT.world, toReg = TT.map.region(opt.to);
      if (opt.gold) TT.ls.pay(c, opt.gold);
      if (opt.method === 'tran_phap') {
        const P = SC.portal;
        c.fortune -= P.fortune;
        let boost = 0;
        if (opts.tcd && c.tcd >= 3) { c.tcd -= 3; boost = 0.2; TT.log(c, 'Bạn dùng 3 Thiên cơ điểm để nghiêng thiên cơ về phía mình.', 'big'); }
        const p = rng.clamp(P.success + boost + S.luck(c) * 0.01 + S.kv(c) * 0.002, 0.05, 0.95);
        if (rng.P(p)) {
          TT.log(c, 'Truyền tống trận bùng sáng, bạn bị cuốn qua hư không tới ' + toReg.n + '.', 'big');
          cross.arrive(c, opt.to, TT.map.portalOf(opt.to));
          return { ok: true, text: 'Thành công.' };
        }
        c.hp = Math.max(0, c.hp - S.hpMax(c) * P.failHpLoss);
        TT.log(c, 'Truyền tống trận sụp đổ giữa chừng! Bạn mất hết chi phí và bị trọng thương.', 'bad');
        if (c.hp <= 0 || rng.P(P.failDeath)) TT.life.die(c, 'bỏ mạng khi kích hoạt truyền tống trận cổ');
        return { ok: true, text: 'Thất bại.' };
      }
      if (opt.method === 'tong_mon') {
        const T = D.SECT_RULES.portal;
        c.sect.contrib -= T.contrib;
        if (rng.P(rng.clamp(T.success + S.luck(c) * 0.002, 0.5, 0.98))) {
          TT.log(c, 'Đại trận của tông môn sáng lên, bạn bước qua và tới ' + toReg.n + ' trong chớp mắt.', 'big');
          cross.arrive(c, opt.to, TT.map.gateOf(opt.to));
          return { ok: true, text: 'Thành công.' };
        }
        c.hp = Math.max(1, c.hp - S.hpMax(c) * T.failHpLoss);
        TT.log(c, 'Đại trận bị nhiễu loạn giữa chừng, bạn bị hất ngược về tông môn và bị thương nặng. Chi phí đã mất.', 'bad');
        return { ok: true, text: 'Thất bại.' };
      }
      const years = opt.years;
      c.cross = {
        from: c.region, to: opt.to, method: opt.method, start: w.months, arrive: w.months + years * 12,
        toPlace: TT.map.gateOf(opt.to), years
      };
      c.place = null; c.travel = null; c.dest = null; c.focus = 'cross';
      TT.log(c, 'Bạn lên đường vượt vùng tới ' + opt.label + ', hành trình kéo dài ' + years + ' năm.', 'big');
      TT.news('Bạn rời ' + TT.map.region(c.cross.from).n + ' để vượt vùng, ước tính ' + years + ' năm.', 'age', [c.id]);
      return { ok: true, text: 'Đã lên đường.' };
    },

    // Một tháng trên đường vượt vùng.
    step(c) {
      const x = c.cross, w = TT.world;
      if (!x) return;
      if (w.months >= x.arrive) { cross.arrive(c, x.to, x.toPlace); return; }
      if ((w.months - x.start) % 12 === 0 && w.months > x.start && c.kind === 'player') {
        // Người chơi: mỗi năm có thể gặp một sự kiện dọc đường (đa dạng hơn, có chọn lựa). Thương đoàn hộ tống nên ít rủi ro hơn.
        if (!w.pending && rng.P(x.method === 'thuong_doan' ? 0.35 : 0.5)) TT.events.fireCross(c);
      } else if ((w.months - x.start) % 12 === 0 && w.months > x.start) {
        const mult = x.method === 'thuong_doan' ? 0.6 : 1;
        if (rng.P(0.08)) { c.fortune += 1; TT.log(c, 'Dọc đường bạn gặp một cơ duyên (cơ duyên ' + Math.floor(c.fortune) + ').', 'good'); }
        if (rng.P(0.06 * mult)) {
          const dmg = rng.RI(20, 60);
          c.hp = Math.max(0, c.hp - dmg);
          TT.log(c, 'Dọc đường gặp nguy hiểm, bạn bị thương, sinh lực -' + dmg + '.', 'bad');
        }
      }
    },

    // Cướp đường: người chơi mang nhiều hàng buôn qua vùng có thể bị cướp một phần. Thương đoàn hộ tống và bậc hội giảm rủi ro.
    robbery(c, method) {
      if (c.kind !== 'player' || !TT.eco || method === 'tran_phap' || method === 'tong_mon') return;
      const kinds = { dan: 1, bua: 1, thao: 1, khoang: 1, yeu: 1 }; let val = 0; const ids = [];
      Object.keys(c.inv || {}).forEach(id => { const g = TT.eco.group(id); if (g && kinds[g]) { val += TT.items.value(c, id) * c.inv[id]; ids.push(id); } });
      const D0 = TT.data.ECO.rob;
      if (val < D0.minValue * TT.data.LS.RATE) return;
      let p = Math.min(D0.max, D0.base + val / (D0.perValue * TT.data.LS.RATE)) * (method === 'thuong_doan' ? 0.4 : 1) * (1 - 0.1 * (TT.hoi.member(c) ? TT.hoi.member(c).rank + 1 : 0)) * (1 - 0.06 * Math.min(4, c.realm));
      if (!rng.P(Math.max(0.02, p))) return;
      const frac = rng.R(D0.loss[0], D0.loss[1]); let lost = 0;
      ids.forEach(id => { const n = Math.floor(c.inv[id] * frac); if (n > 0) { TT.items.remove(c, id, n); lost += TT.items.value(c, id) * n; } });
      if (lost > 0) TT.log(c, 'Dọc đường bọn cướp chặn lại, bạn mất khoảng ' + Math.round(frac * 100) + '% hàng buôn (trị giá ' + TT.ls.fmt(lost) + ').', 'bad');
    },

    arrive(c, rid, placeId) {
      const from = c.cross ? c.cross.from : c.region;
      cross.robbery(c, c.cross && c.cross.method);
      c.region = rid;
      c.place = placeId;
      c.cross = null;
      c.travel = null;
      c.dest = null;
      c.focus = 'train';
      cross.learn(c, rid);
      TT.map.ensureTaste(c);
      TT.life.enterRegion(rid);
      const reg = TT.map.region(rid);
      TT.log(c, 'Bạn đã tới ' + reg.n + ' (' + TT.map.place(placeId).n + ').', 'big');
      TT.news('Bạn đã vượt từ ' + TT.map.region(from).n + ' tới ' + reg.n + '.', 'good', [c.id]);
    }
  };
})();
