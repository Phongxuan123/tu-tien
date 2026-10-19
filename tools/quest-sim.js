// Đo cân bằng hệ nhiệm vụ. Chạy trong console của sim.html:
//   await fetch('/tools/quest-sim.js').then(r => r.text()).then(eval)
// rồi: qsim(số_đời, hạt_giống_đầu, hướng_đi, { total: tư chất, accept: true })  -> bảng tỉ lệ xong/hỏng/bỏ theo tầng, độ khó, người giao
//      rateCheck(số_đời, hạt_giống_đầu, hướng_đi)  -> so tốc độ tu vi thật với ước lượng xpEst (để chỉnh D.QUEST.K_XP)
(function () {
  TT.save.clear(); TT.config.persistMeta = false; TT.config.autosaveMonths = 1e12; TT.time.stop();
  const origStep = window.__origStep || (window.__origStep = TT.life.stepChar);
  window.fast = on => { TT.life.stepChar = on ? function (c) { if (c.kind !== 'player') return; return origStep.apply(this, arguments); } : origStep; };
  const Q = TT.quests;

  window.qlife = function (seed, dir, opts) {
    opts = opts || {};
    TT.life.createWorld(seed); const w = TT.world; w.settings.auto = 'tu_dong'; const p = TT.player(); p.direction = dir || 'can_bang';
    if (opts.total) p.tuchat = { total: opts.total, attrs: [{ n: 'Kim', di: false, p: opts.total }] };
    const seen = {}, ended = [], yrs = []; let reviews = 0;
    let lastAge = -1;
    for (let m = 0; m < (opts.maxMonths || 30000); m++) {
      if (w.pending) { const d = w.pending; if (d.type === 'death' || d.type === 'ascend') break; if (d.type === 'qreview') reviews++; TT.decisions.resolveDefault(); }
      TT.life.stepWorld();
      if (TT.player() !== p) break;
      if (opts.accept !== false) Q.qs(p).offers.slice().forEach(o => Q.accept(p, o));
      const a = TT.age(p);
      if (a !== lastAge) {
        lastAge = a;
        yrs.push({ a, realm: p.realm, L: Q.lvl(p), est: Q.xpEst(p), w: TT.ls.wealth(p), d: (p.rep && p.rep.danh) || 0 });
        Q.list(p).forEach(q => { if (q.state !== 'on' && !seen[q.id]) { seen[q.id] = 1; ended.push({ tier: q.tier, giver: q.giver.t, d: q.d, kind: q.kind, state: q.state, f: q.f, rel: q.rel, y0: q.y0, realm: p.realm }); } });
      }
    }
    Q.list(p).forEach(q => { if (q.state !== 'on' && !seen[q.id]) { seen[q.id] = 1; ended.push({ tier: q.tier, giver: q.giver.t, d: q.d, kind: q.kind, state: q.state, f: q.f, rel: q.rel, y0: q.y0, realm: p.realm }); } });
    return { ended, yrs, age: TT.age(p), realm: p.realm, reviews, pen: Q.qs(p).stats };
  };

  const pct = (a, b) => (b ? Math.round(a / b * 100) + '%' : '-');
  window.qsim = function (n, s0, dir, opts) {
    const all = []; let reviews = 0, years = 0;
    for (let s = s0; s < s0 + n; s++) { const r = window.qlife(s, dir, opts); all.push(...r.ended); reviews += r.reviews; years += r.age; }
    const grp = (key) => {
      const g = {};
      all.forEach(x => { const k = typeof key === 'function' ? key(x) : x[key]; (g[k] = g[k] || { done: 0, fail: 0, drop: 0, n: 0 })[x.state]++; g[k].n++; });
      return Object.keys(g).sort().map(k => k + ': n=' + g[k].n + ' xong ' + pct(g[k].done, g[k].n) + ' hỏng ' + pct(g[k].fail, g[k].n) + ' bỏ ' + pct(g[k].drop, g[k].n)).join('\n  ');
    };
    return 'đời ' + n + ', tổng tuổi ' + years + ', cửa sổ xem xét ' + reviews + ' (' + (reviews / years * 12).toFixed(2) + ' lần/12 năm), nhiệm vụ đã kết thúc ' + all.length +
      '\nTheo tầng:\n  ' + grp('tier') + '\nTheo độ khó:\n  ' + grp(x => ['Dễ', 'Vừa', 'Khó', 'Gian nan'][x.d]) + '\nTheo người giao:\n  ' + grp('giver') +
      '\nTheo loại:\n  ' + grp('kind') + '\nTầng x độ khó:\n  ' + grp(x => x.tier + '/' + ['Dễ', 'Vừa', 'Khó', 'GN'][x.d]);
  };

  // So tốc độ tu vi thật (tăng L trong 5 năm kế tiếp, bỏ các năm đột phá trượt) với ước lượng.
  window.rateCheck = function (n, s0, dir, opts) {
    const byRealm = {};
    for (let s = s0; s < s0 + n; s++) {
      const r = window.qlife(s, dir, Object.assign({ accept: false }, opts || {}));
      for (let i = 0; i + 5 < r.yrs.length; i++) {
        const a = r.yrs[i], b = r.yrs[i + 5]; if (a.realm >= 3) continue;
        const act = (b.L - a.L) / (b.a - a.a); (byRealm[a.realm] = byRealm[a.realm] || []).push(act / a.est);
      }
    }
    return Object.keys(byRealm).map(k => { const v = byRealm[k].sort((x, y) => x - y); return 'cảnh giới ' + k + ': n=' + v.length + ' thật/ước lượng trung vị ' + v[Math.floor(v.length / 2)].toFixed(2) + ' (25%: ' + v[Math.floor(v.length * 0.25)].toFixed(2) + ', 75%: ' + v[Math.floor(v.length * 0.75)].toFixed(2) + ')'; }).join('\n');
  };
  return 'quest-sim ok';
})();
