// Đo kinh tế (E0): chạy trong console của index.html sau khi nạp:
//   await fetch('/tools/econ-sim.js').then(r => r.text()).then(eval); econSim(seed, năm)
// In: độ lệch giá trung bình theo nhóm, chênh giá giữa các vùng, lãi buôn chênh lệch tối đa mỗi tháng (sau cước), số cú sốc.
(function () {
  window.econSim = function (seed, years) {
    seed = seed || 1; years = years || 50;
    TT.save.clear(); TT.config.persistMeta = false; TT.config.autosaveMonths = 1e12; TT.time.stop();
    TT.life.createWorld(seed);
    const E = TT.data.ECO, D = TT.data, w = TT.world, rows = [], gaps = [], profit = [];
    let shocks = 0;
    for (let m = 0; m < years * 12; m++) {
      w.months++; const before = TT.eco.S().sh.length; TT.eco.monthly(); if (TT.eco.S().sh.length > before) shocks++;
      if (m % 12 === 0) {
        E.groups.forEach(g => {
          const rel = D.REGIONS.map(r => TT.eco.rel(r.id, g)); rows.push({ g, dev: rel.reduce((a, x) => a + Math.abs(x - 1), 0) / rel.length });
          gaps.push({ g, gap: Math.max.apply(null, rel) / Math.min.apply(null, rel) });
        });
        // lãi mua rẻ bán đắt trên các cạnh nối nhau, trừ cước ước lượng
        let best = 0;
        D.EDGES.forEach(e => E.groups.forEach(g => [[e.a, e.b], [e.b, e.a]].forEach(p => {
          const cuoc = e.caravan ? 0.12 : 0.22; const buy = TT.eco.index(p[0], g) * (1 + 0.05), sell = TT.eco.index(p[1], g) * (1 - 0.025);
          best = Math.max(best, sell / buy - 1 - cuoc);
        })));
        profit.push(best);
      }
    }
    const avg = a => a.reduce((x, y) => x + y, 0) / (a.length || 1);
    console.log('seed', seed, years, 'năm; cú sốc mới:', shocks);
    E.groups.forEach(g => console.log(g, 'lệch TB so với thường', avg(rows.filter(r => r.g === g).map(r => r.dev)).toFixed(3), '| chênh vùng TB', avg(gaps.filter(r => r.g === g).map(r => r.gap)).toFixed(2), 'max', Math.max.apply(null, gaps.filter(r => r.g === g).map(r => r.gap)).toFixed(2)));
    console.log('lãi chênh lệch tối đa/chuyến (sau cước) TB', (avg(profit) * 100).toFixed(1) + '%', 'max', (Math.max.apply(null, profit) * 100).toFixed(1) + '%');
  };
})();
