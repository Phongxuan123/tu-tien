// Đo kinh tế (E0, mở rộng ở E7a): chạy trong trang đã nạp mã (sim.html hoặc index.html):
//   await fetch('/tools/econ-sim.js').then(r => r.text()).then(eval); econSim(seed, năm)
// Mỗi tháng gọi TT.eco.monthly(), mỗi năm gọi TT.fac.yearly() (có quốc vận, tín ngưỡng, dân số như trong game).
// Trả về: hash (băm 63 chỉ số giá sau năm cuối), độ lệch giá TB so với thường, chênh giá giữa vùng, lãi buôn tối đa mỗi chuyến (sau cước), số cú sốc.
// Với in = true thì in ra console. Công cụ đo đường cơ sở: node tools/econ-check.js.
(function () {
  window.econSim = function (seed, years, in_) {
    seed = seed || 1; years = years || 50;
    TT.save.clear(); TT.config.persistMeta = false; TT.config.autosaveMonths = 1e12; TT.time.stop();
    TT.life.createWorld(seed);
    const E = TT.data.ECO, D = TT.data, w = TT.world, rows = [], gaps = [], profit = [];
    let shocks = 0;
    for (let m = 0; m < years * 12; m++) {
      w.months++; if (w.months % 12 === 0) TT.fac.yearly();
      const before = TT.eco.S().sh.length; TT.eco.monthly(); if (TT.eco.S().sh.length > before) shocks++;
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
    // băm 63 chỉ số giá (9 vùng x 7 nhóm), làm tròn 1e-6: đổi một ô là đổi hash
    let h = 2166136261 >>> 0; const cells = [];
    D.REGIONS.forEach(r => E.groups.forEach(g => cells.push(TT.eco.index(r.id, g).toFixed(6))));
    cells.join(',').split('').forEach(ch => { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; });
    const avg = a => a.reduce((x, y) => x + y, 0) / (a.length || 1);
    const res = {
      seed, years, hash: h.toString(16), shocks,
      dev: avg(rows.map(r => r.dev)), gap: avg(gaps.map(r => r.gap)), gapMax: Math.max.apply(null, gaps.map(r => r.gap)),
      profit: avg(profit), profitMax: Math.max.apply(null, profit)
    };
    if (in_) {
      console.log('seed', seed, years, 'năm; cú sốc mới:', shocks, '; hash', res.hash);
      E.groups.forEach(g => console.log(g, 'lệch TB so với thường', avg(rows.filter(r => r.g === g).map(r => r.dev)).toFixed(3), '| chênh vùng TB', avg(gaps.filter(r => r.g === g).map(r => r.gap)).toFixed(2), 'max', Math.max.apply(null, gaps.filter(r => r.g === g).map(r => r.gap)).toFixed(2)));
      console.log('lãi chênh lệch tối đa/chuyến (sau cước) TB', (res.profit * 100).toFixed(1) + '%', 'max', (res.profitMax * 100).toFixed(1) + '%');
    }
    return res;
  };
})();
