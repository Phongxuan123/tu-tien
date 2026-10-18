// Dân số ẩn theo vùng (F4): không mô phỏng từng người, mỗi năm tính một lần cho 9 vùng. Lưu ở world.pop[vùng] = { n, mood, food, mig, g, riot }.
// Đầu ra: thuế (kéo "kho" của vương triều), quân số (nhân vào sức mạnh khi đánh nhau), nơi sinh của người mới, dân tâm (bất ổn, nổi loạn), thiên tai, di cư.
// Khởi tạo muộn và không dùng số ngẫu nhiên khi khởi tạo nên không đổi hạt giống hay bản lưu cũ.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, P = D.POP, R = D.POP_RULES;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const regName = rid => (TT.map.region(rid) ? TT.map.region(rid).n : rid);
  const deathOf = rid => P[rid].birth * 0.84 - 0.0062; // cân bằng quanh n0 (đã trừ phần hao do thiên tai, dịch, chiến tranh) khi mùa màng trung bình

  const pop = TT.pop = {
    S() {
      const w = TT.world; if (!w) return null;
      if (!w.pop) { w.pop = {}; D.REGIONS.forEach(r => { w.pop[r.id] = { n: P[r.id].n0, mood: R.mood0, food: R.food0, mig: 0, g: 0, riot: false }; }); }
      return w.pop;
    },
    get(rid) { const s = pop.S(); return s ? s[rid] : null; },
    // Hệ số nơi sinh: vùng đông hơn mức khởi đầu thì sinh nhiều người mới hơn (giữ trong 0,6-1,6).
    birthMul(rid) { const g = pop.get(rid); return g ? clamp(Math.sqrt(g.n / P[rid].n0), 0.6, 1.6) : 1; },
    // Sức mạnh quân sự phụ theo dân số của triều (đông dân thì nuôi được nhiều lính).
    milMul(x) { const g = x.kind === 'trieu' ? pop.get(x.region) : null; return g ? 0.75 + 0.12 * Math.log2(1 + g.n / 200) : 1; },
    // Kho mục tiêu của vương triều theo thuế: dân đông và yên thì giàu.
    taxTarget(rid) { const g = pop.get(rid); return g ? clamp(15 + 18 * Math.log2(1 + g.n / 200) * (0.5 + g.mood / 100), 10, 90) : 50; },
    taxPull(x) { if (x.kind === 'trieu') x.wealth = clamp(x.wealth + (pop.taxTarget(x.region) - x.wealth) * 0.12, 0, 100); },
    unrest(rid) { const g = pop.get(rid); return !!g && g.mood < R.unrest; },
    shocksAt(rid) { const f = TT.fac.S(), m = TT.world.months; return (f.shocks || []).filter(s => s.region === rid && s.until > m && (s.kind === 'han' || s.kind === 'lu' || s.kind === 'dich')); },

    // Chữ mô tả cho giao diện.
    describe(rid) {
      const g = pop.get(rid); if (!g) return null;
      const tai = g.n / P[rid].cap;
      return {
        size: tai > 0.85 ? 'đông đúc' : tai > 0.55 ? 'vừa phải' : 'thưa thớt',
        trend: g.g > 0.004 ? 'đang tăng' : g.g < -0.004 ? 'đang giảm' : 'ổn định',
        mood: g.mood >= 65 ? 'thịnh vượng' : g.mood >= R.unrest + 10 ? 'yên ổn' : g.mood >= R.riot ? 'bất mãn' : 'loạn',
        shocks: pop.shocksAt(rid).map(s => ({ han: 'hạn hán', lu: 'lũ lụt', dich: 'dịch bệnh' })[s.kind]),
        n: g.n, mood_v: g.mood
      };
    },

    // Một năm: thiên tai, mùa màng, sinh, tử, di cư, dân tâm, loạn.
    yearly() {
      const s = pop.S(), f = TT.fac.S(), w = TT.world, fr = TT.fac.frontRegions(), era = TT.fac.era(), pl = TT.player();
      f.shocks = f.shocks || [];
      const ids = D.REGIONS.map(r => r.id), delta = {};
      ids.forEach(rid => { delta[rid] = 0; });
      // thiên tai mới
      ids.forEach(rid => {
        [['han', R.han, 'Hạn hán kéo dài'], ['lu', R.lu, 'Lũ lụt lớn'], ['dich', R.dich, 'Dịch bệnh lan rộng']].forEach(x => {
          if (f.shocks.some(sh => sh.kind === x[0] && sh.region === rid && sh.until > w.months)) return;
          if (!rng.P(x[1])) return;
          f.shocks.push({ kind: x[0], region: rid, until: w.months + rng.RI(R.shockYears[0], R.shockYears[1]) * 12 });
          TT.fac.chron(x[2] + ' ở ' + regName(rid) + ', dân chúng khốn đốn.', 'bad', !!(pl && pl.region === rid));
        });
      });
      // di cư: dân đi từ nơi kém hấp dẫn sang nơi hấp dẫn hơn qua các tuyến liền kề
      const attr = rid => { const g = s[rid], r = TT.map.region(rid); return g.mood / 100 - 0.5 * (g.n / P[rid].cap) + 0.15 * r.rich / 6; };
      D.EDGES.forEach(e => {
        [[e.a, e.b], [e.b, e.a]].forEach(pr => {
          const d = attr(pr[1]) - attr(pr[0]); if (d <= 0) return;
          const flow = s[pr[0]].n * R.mig * Math.min(1, d) * (e.caravan ? 1.5 : 1);
          delta[pr[0]] -= flow; delta[pr[1]] += flow;
        });
      });
      ids.forEach(rid => {
        const g = s[rid], p = P[rid], sh = pop.shocksAt(rid), war = fr[rid] || 0;
        const han = sh.some(x => x.kind === 'han'), lu = sh.some(x => x.kind === 'lu'), dich = sh.some(x => x.kind === 'dich');
        g.food = clamp(R.food0 + rng.R(-R.foodNoise, R.foodNoise) - (han ? 28 : 0) - (lu ? 22 : 0), 5, 100);
        const tai = g.n / p.cap;
        const sinh = g.n * p.birth * (0.6 + 0.4 * g.food / 100) * (1 - 0.5 * Math.max(0, tai - 0.8));
        const tu = g.n * (deathOf(rid) + 0.01 * (1 - g.food / 100) + war * R.warLoss + (dich ? 0.03 : 0) + 0.02 * Math.max(0, tai - 1));
        const before = g.n;
        g.n = clamp(g.n + sinh - tu + delta[rid], p.n0 * R.nMin, p.cap * R.nMax);
        g.g = (g.n - before) / before; g.mig = delta[rid];
        g.mood = clamp(g.mood + (R.mood0 - g.mood) * 0.08 - war * R.warMood + (g.food - R.food0) * 0.05 + (era.id === 'thinh' ? 0.8 : era.id === 'loan' ? -0.8 : 0), 0, 100);
        // nổi loạn
        if (g.mood < R.riot && !g.riot) {
          g.riot = true; TT.fac.chron('Dân chúng ' + regName(rid) + ' nổi loạn vì đói khổ và chiến tranh.', 'bad', !!(pl && pl.region === rid));
        } else if (g.mood > R.unrest + 15) g.riot = false;
        if (g.riot) {
          const tr = TT.fac.list('trieu').find(t => t.region === rid && TT.fac.alive(t));
          if (tr) { tr.unity = clamp(tr.unity - 6, 5, 100); tr.power = clamp(tr.power - 2, 1, 100); if (rng.P(0.1)) TT.fac.succession(tr, 'bị lật đổ trong loạn dân'); }
        }
      });
    }
  };
})();
