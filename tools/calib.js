// Công cụ cân bằng chạy trong console của index.html (không dùng ở bản chơi): nạp bằng
//   await fetch('/tools/calib.js').then(r => r.text()).then(eval)
// rồi gọi calib(PLAYER_RATE, số_đời, hạt_giống_đầu, hướng_đi) để đo phân bố cảnh giới của người chơi tự động ("Tự động", hướng chuyên tu luyện).
(function () {
  TT.save.clear(); TT.config.persistMeta = false; TT.config.autosaveMonths = 1e12; TT.time.stop();
  const origStep = window.__origStep || (window.__origStep = TT.life.stepChar);
  // fast(true): bỏ qua mô phỏng NPC cho nhanh (chỉ đo tiến trình của người chơi)
  window.fast = on => { TT.life.stepChar = on ? function (c) { if (c.kind !== 'player') return; return origStep.apply(this, arguments); } : origStep; };
  window.natLife = function (seed, dir, opts) {
    opts = opts || {};
    TT.life.createWorld(seed); const w = TT.world; w.settings.auto = 'tu_dong'; const p = TT.player(); p.direction = dir || 'tu_luyen';
    if (opts.total) p.tuchat = { total: opts.total, attrs: [{ n: 'Kim', di: false, p: opts.total }] };
    const tot = p.tuchat.total; let last = 0; const at = {}; let yearsToPT = null;
    for (let m = 0; m < (opts.maxMonths || 30000); m++) {
      if (w.pending) { const d = w.pending; if (d.type === 'death' || d.type === 'ascend') break; TT.decisions.resolveDefault(); }
      TT.life.stepWorld();
      if (TT.player() !== p) break;
      if (p.realm !== last) { at[p.realm] = TT.age(p); last = p.realm; }
    }
    return { total: tot, n: p.tuchat.attrs.length, realm: p.realm, age: TT.age(p), pt: !!p.ascended, cause: p.cause, at };
  };
  window.calib = function (rate, n, s0, dir, opts) {
    if (rate != null) TT.data.PLAYER_RATE = rate;
    const cnt = [0, 0, 0, 0, 0, 0, 0], pts = [], causes = {};
    for (let s = s0; s < s0 + n; s++) { const r = window.natLife(s, dir, opts); cnt[r.realm]++; if (r.pt) pts.push(r.age); else if (r.realm >= 2) causes[r.cause] = (causes[r.cause] || 0) + 1; }
    const atLeast = cnt.map((_, i) => Math.round(cnt.slice(i).reduce((a, b) => a + b, 0) / n * 100) + '%');
    return 'rate ' + TT.data.PLAYER_RATE + ' ≥cảnh giới 0..6: ' + atLeast.join(' ') + ' | Phi Thăng tuổi: ' + pts.join(',');
  };
  return 'calib ok';
})();
