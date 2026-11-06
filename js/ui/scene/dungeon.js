// Nội thất bí cảnh, tàn tích, hung địa (phase cave), vẽ ở độ phân giải đầy đủ: lớp tĩnh dựng một lần (nền, cấu trúc + sàn, tiền cảnh),
// lớp động (ánh tinh thể, lửa đuốc, hồn lửa, đom đóm) và hiệu ứng theo loại ô (kho báu, suối nghỉ, cạm bẫy, thủ lĩnh).
(function () {
  const sc = window.TT.ui.sc, CFG = sc.CFG, W = CFG.W, H = CFG.H, GY = CFG.GY, B = sc.B;
  const { mix, hash, mulberry, R, P, line, ell, disc, vgrad } = sc;

  const KIND = {
    bi_canh: { bg: ['#05051a', '#10104a'], rock: '#0a0a2c', rl: '#2a2a78', floor: '#0a0a2a', acc: ['#2a2a78', '#6a6aff', '#8affff'] },
    tan_tich: { bg: ['#120c06', '#34261a'], rock: '#1a1208', rl: '#4a3a28', floor: '#241a10', acc: ['#4a3a28', '#8a6a44', '#ffb04a'] },
    hung_dia: { bg: ['#10050a', '#3a1218'], rock: '#1a0a0e', rl: '#4a1a22', floor: '#1e0a0e', acc: ['#3a1216', '#8a2a30', '#ff5a3a'] }
  };
  const kindOf = k => KIND[k] || KIND.bi_canh;

  // trần có nhũ đá lởm chởm
  function ceiling(kd, seed, depth, col, lt) {
    const r = mulberry(seed);
    for (let x = 0; x < W; x++) { const h = depth + Math.sin(x * 0.05 + seed) * 4 + hash(x * 0.37 + seed) * 8; R(x, 0, 1, h, col); }
    for (let i = 0; i < 26; i++) { const x = Math.floor(r() * W), L = 8 + Math.floor(r() * 26), w = 3 + Math.floor(r() * 6); for (let y = 0; y < L; y++) { const hw = Math.round(w / 2 * (1 - y / L)); R(x - hw, depth + 4 + y, hw * 2 + 1, 1, y % 5 === 0 ? lt : col); R(x - hw, depth + 4 + y, 1, 1, lt); } }
  }
  function crystal(x, base, w, h, up, cols, lean) {
    for (let i = 0; i < h; i++) { const hw = Math.max(0, Math.round(w / 2 * (1 - Math.pow(i / h, 1.4)))), xx = x + Math.round(lean * i), y = up ? base - i : base + i; R(xx - hw, y, hw * 2 + 1, 1, i % 6 === 0 ? cols[2] : cols[1]); R(xx - hw, y, 1, 1, '#ffffff'); R(xx + hw, y, 1, 1, cols[0]); }
  }

  // dựng các lớp tĩnh. geo: lamps (ánh sáng), flames (đuốc)
  function paint(pal, kind, geo, mode) {
    const kd = kindOf(kind), A = kd.acc, r = mulberry(kind.length * 13 + 5);
    geo.lamps = []; geo.flames = []; geo.smokes = []; geo.flags = []; geo.rods = []; geo.eyes = [];
    // nền
    sc.use(B.sky.begin(mode)); sc.cur().clearRect(0, 0, W, H);
    vgrad(0, 0, W, GY, kd.bg[0], kd.bg[1], 6);
    // cấu trúc giữa + sàn
    sc.use(B.arch.begin(mode)); sc.cur().clearRect(0, 0, W, H);
    if (kind === 'bi_canh') {
      for (let i = 0; i < 12; i++) crystal(Math.floor(r() * W), GY, 8 + Math.floor(r() * 6), 30 + Math.floor(r() * 36), true, [mix(A[0], '#000', 0.4), mix(A[1], A[0], 0.5), mix(A[2], A[1], 0.4)], (r() - 0.5) * 0.1);
      ceiling(kd, 3, 12, mix(kd.rock, kd.rl, 0.3), kd.rl);
      for (let i = 0; i < 9; i++) { const x = 20 + i * 52 + Math.floor(r() * 20), h = 22 + Math.floor(r() * 40); crystal(x, GY, 10 + Math.floor(r() * 5), h, true, [mix(A[0], '#000', 0.3), A[1], A[2]], (r() - 0.5) * 0.15); geo.lamps.push({ x, y: GY - h * 0.55, c: '#8affff', always: true }); }
      for (let i = 0; i < 6; i++) { const x = 30 + i * 80 + Math.floor(r() * 30), h = 14 + Math.floor(r() * 24); crystal(x, 14, 8, h, false, [mix(A[0], '#000', 0.3), A[1], A[2]], 0); geo.lamps.push({ x, y: 14 + h * 0.5, c: '#a0a0ff', always: true }); }
    } else if (kind === 'tan_tich') {
      for (let x = 0; x < W; x += 48) { R(x, 18, 46, GY - 18, mix(kd.floor, '#3a2a1a', 0.5)); for (let y = 18; y < GY; y += 9) R(x, y, 46, 1, mix(kd.floor, '#000', 0.3)); }
      for (let i = 0; i < 5; i++) { const cx = 40 + i * 100; ell(cx, 40, 34, 26, '#0a0704'); R(cx - 34, 40, 68, GY - 40, '#0a0704'); }
      ceiling(kd, 9, 10, mix(kd.rock, kd.rl, 0.3), kd.rl);
      [[24, 80], [120, 90], [210, 40], [300, 90], [380, 80], [452, 60]].forEach(([cx, h], i) => {
        const top = GY - h; R(cx - 9, top, 18, h, A[1]); R(cx - 9, top, 3, h, mix(A[1], '#ffffff', 0.25)); R(cx + 5, top, 4, h, mix(A[1], '#000', 0.4)); for (let y = top + 6; y < GY; y += 11) R(cx - 9, y, 18, 1, mix(A[1], '#000', 0.35));
        R(cx - 12, top - 4, 24, 5, mix(A[1], '#fff', 0.15)); R(cx - 12, GY - 4, 24, 4, mix(A[1], '#000', 0.2));
        if (h > 70) { R(cx - 1, top + 14, 2, 6, '#3a2a1a'); geo.flames.push({ x: cx, y: top + 12, w: 8 }); geo.lamps.push({ x: cx, y: top + 8, c: '#ffb04a', always: true }); }
        if (h < 70) for (let k = 0; k < 6; k++) R(cx - 14 + Math.floor(r() * 28), GY - 2 - Math.floor(r() * 5), 3 + Math.floor(r() * 4), 2, A[1]);
      });
    } else { // hung_dia
      ceiling(kd, 17, 16, mix(kd.rock, kd.rl, 0.4), kd.rl);
      for (let x = 0; x < W; x += 9) { const sh = 8 + hash(x * 0.7) * 26; for (let y = 0; y < sh; y++) { const hw = Math.max(1, Math.round(5 - y * 0.18)); R(x + 3 - hw, GY - y - 1, hw * 2, 1, y % 6 === 0 ? kd.rl : kd.rock); } }
      for (let i = 0; i < 7; i++) { const bx = 20 + hash(i * 6.3) * (W - 60), ribs = 4; for (let k = 0; k < ribs; k++) { line(bx + k * 5, GY - 2, bx + k * 5 + 2, GY - 12, '#d8d0b8'); line(bx + k * 5 + 2, GY - 12, bx + k * 5 + 6, GY - 5, '#d8d0b8'); } disc(bx - 6, GY - 5, 4, '#d8d0b8'); R(bx - 8, GY - 6, 2, 2, kd.rock); R(bx - 5, GY - 6, 2, 2, kd.rock); }
      for (let i = 0; i < 6; i++) geo.eyes.push({ x: 30 + hash(i * 2.9) * (W - 60), y: 30 + hash(i * 7.7) * 50, ph: i * 17 });
    }
    // sàn
    R(0, GY, W, H - GY, kd.floor); R(0, GY, W, 2, mix(A[1], '#000', 0.35)); vgrad(0, GY + 4, W, H - GY - 4, kd.floor, mix(kd.floor, '#000', 0.6), 4);
    if (kind === 'tan_tich') for (let x = 0; x < W; x += 24) { R(x, GY + 3, 1, H - GY - 3, mix(kd.floor, '#000', 0.4)); }
    if (kind === 'tan_tich') for (let y = GY + 6; y < H; y += 6) R(0, y, W, 1, mix(kd.floor, '#000', 0.3));
    if (kind === 'hung_dia') for (let i = 0; i < 16; i++) { let x = Math.floor(r() * W), y = GY + 4 + Math.floor(r() * 12); for (let k = 0; k < 8 + Math.floor(r() * 10); k++) { P(x, y, A[2]); x += r() < 0.6 ? 1 : 0; y += r() < 0.5 ? 1 : (r() < 0.5 ? -1 : 0); y = Math.max(GY + 2, Math.min(H - 1, y)); } }
    if (kind === 'bi_canh') for (let i = 0; i < 40; i++) R(Math.floor(r() * W), GY + 3 + Math.floor(r() * 16), 3 + Math.floor(r() * 10), 1, mix(A[1], kd.floor, 0.55));
    // tiền cảnh: nhũ đá lớn hai góc trên
    sc.use(B.over.begin(mode)); sc.cur().clearRect(0, 0, W, H);
    [[-6, 70, 46], [W - 54, 80, 38], [W - 150, 40, 18]].forEach(([x, w, h], i) => { for (let dx = 0; dx < w; dx++) { const u = Math.abs((dx / w) * 2 - 1), l = Math.round(h * (1 - Math.pow(u, 1.5)) + hash(x + dx) * 4); R(x + dx, 0, 1, l, mix(kd.rock, '#000', 0.4)); if (dx % 6 === 0) R(x + dx, 0, 1, Math.max(0, l - 4), kd.rock); } });
  }

  // hiệu ứng động + theo loại ô; ctx đã chứa nền và cấu trúc
  function drawFx(ctx, s, pal, t, geo) {
    sc.use(ctx);
    const kind = s.dgkind, kd = kindOf(kind), A = kd.acc, f = sc.FX();
    if (kind === 'bi_canh') {
      for (let i = 0; i < 26 * f; i++) { const x = hash(i * 3.3) * W + Math.sin(t * 0.5 + i) * 8, y = 20 + hash(i * 1.9) * 100 + Math.cos(t * 0.6 + i) * 5; ctx.globalAlpha = 0.4 + 0.5 * Math.sin(t * 1.4 + i * 2); ctx.fillStyle = A[2]; ctx.fillRect(Math.round(x), Math.round(y), 1, 1); }
      ctx.globalAlpha = 1;
    } else if (kind === 'tan_tich') {
      for (let i = 0; i < 18 * f; i++) { const x = (hash(i * 4.4) * W + t * 3) % W, y = 14 + (hash(i * 2.2) * 100 + t * 2 * (1 + hash(i))) % 110; ctx.globalAlpha = 0.25; ctx.fillStyle = '#e8c890'; ctx.fillRect(Math.round(x), Math.round(y), 1, 1); }
      ctx.globalAlpha = 1;
    } else {
      ctx.globalAlpha = 0.1 + 0.05 * Math.sin(t * 1.2); ctx.fillStyle = '#ff2a2a'; ctx.fillRect(0, 36, W, GY - 36); ctx.globalAlpha = 1;
      (geo.eyes || []).forEach(e => { if (Math.floor((t * 9 + e.ph) / 24) % 5 === 0) return; ctx.fillStyle = '#ff3a3a'; ctx.fillRect(Math.round(e.x), Math.round(e.y), 3, 2); ctx.fillRect(Math.round(e.x) + 8, Math.round(e.y), 3, 2); });
      for (let i = 0; i < 24 * f; i++) { const yy = (t * (10 + hash(i) * 12) + hash(i * 3) * 100) % 100; ctx.globalAlpha = 0.8 * (1 - yy / 110); ctx.fillStyle = i % 3 ? '#ff7a2a' : '#ffd060'; ctx.fillRect(Math.round(hash(i * 6.1) * W + Math.sin(t + i) * 5), Math.round(GY - yy), 1, 1); }
      ctx.globalAlpha = 1;
    }
    // loại ô
    const n = s.node ? s.node.t : '', fr = t * 9;
    if (n === 'treasure') {
      for (let i = 0; i < 2; i++) { const cx = 316 + i * 52; R(cx, GY - 18, 34, 18, '#7a4a22'); R(cx, GY - 18, 34, 6, '#9a6a32'); R(cx + 15, GY - 14, 4, 8, '#ffd23a'); R(cx, GY - 10, 34, 2, '#ffd23a'); ctx.globalAlpha = 0.22 + 0.1 * Math.sin(fr * 0.2 + i); disc(cx + 17, GY - 14, 26, '#ffd23a'); ctx.globalAlpha = 1; }
      ctx.fillStyle = '#ffd23a'; for (let i = 0; i < 8; i++) ctx.fillRect(Math.round(300 + hash(i * 3) * 110), GY - 1, 3, 1);
    } else if (n === 'rest') {
      R(300, GY - 1, 90, 8, '#1a4ab8'); R(304, GY - 3, 82, 4, '#6ab4ff'); ell(345, GY + 1, 44, 4, '#2a6ad8');
      for (let i = 0; i < 9; i++) { ctx.globalAlpha = 0.8; ctx.fillStyle = '#c8f0ff'; ctx.fillRect(Math.round(306 + hash(i * 5) * 70), Math.round(GY - 6 - ((fr * 1.2 + i * 9) % 34)), 1, 1); } ctx.globalAlpha = 1;
    } else if (n === 'trap') {
      ctx.globalAlpha = 0.3 + 0.25 * Math.sin(fr * 0.2); ell(345, GY + 3, 50, 5, A[2]); ell(345, GY + 3, 32, 3, A[2]); ctx.globalAlpha = 1;
      for (let i = 0; i < 5; i++) { R(396, 28 + i * 14, 12, 2, '#12121a'); if (Math.floor(fr / 12 + i) % 5 === 0) R(384, 28 + i * 14, 12, 2, '#d8d8e8'); }
    }
    if (n === 'boss' && !sc.reduced) { ctx.globalAlpha = 0.14 + 0.08 * Math.sin(fr * 0.1); ctx.fillStyle = '#ff2a2a'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  }
  sc.dungeon = { paint, drawFx };
})();
