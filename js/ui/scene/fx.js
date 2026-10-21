// Hạt và hiệu ứng nền: linh khí, hạt đặc trưng của địa hình (tuyết, tro, cát), khói, đom đóm, ánh đèn, cờ, thời tiết, vệt kiếm quang.
// Mật độ nhân với sc.FX() khi bật giảm hiệu ứng.
(function () {
  const sc = window.TT.ui.sc, CFG = sc.CFG, W = CFG.W, H = CFG.H, GY = CFG.GY;
  const { mix, hash, mulberry, clamp, disc } = sc;

  const PT = [], rnd = mulberry(12345), FF = [];
  { const f = mulberry(78); for (let i = 0; i < 34; i++) FF.push({ x: f() * W, y: 84 + f() * 40, ph: f() * 6.28, sp: 0.2 + f() * 0.3, a: 6 + f() * 16, b: 4 + f() * 8, bl: 1 + f() * 2 }); }
  let acc = { qi: 0, fall: 0, smoke: 0 };
  const MAXP = 600;

  // phát một hạt tự do (vệt kiếm, bụi...): k 3 = hạt có trọng lực nhẹ và ma sát
  function emit(x, y, vx, vy, life, col, sz, drag, grav) { if (PT.length < MAXP) PT.push({ k: 3, x, y, vx, vy, g: grav || 0, dr: drag || 1, l: 0, m: life, col, sz: sz || 1 }); }
  function burst(x, y, n, cols, sp, g0, life, sz) { for (let i = 0; i < n; i++) { const a = rnd() * 6.283, v = sp * (0.3 + rnd() * 0.9); emit(x, y, Math.cos(a) * v, Math.sin(a) * v - sp * 0.15, life * (0.6 + rnd() * 0.6), cols[Math.floor(rnd() * cols.length)], sz, 0.985, g0); } }

  function reset() { PT.length = 0; acc = { qi: 0, fall: 0, smoke: 0 }; }

  function spawnQi() { PT.push({ k: 0, x: rnd() * W, y: 56 + rnd() * (GY - 40), vx: (rnd() - 0.5) * 3, vy: -(4 + rnd() * 8), l: 0, m: 5 + rnd() * 5, ph: rnd() * 6.28, s: rnd(), c: rnd() < 0.7 ? 0 : 1 }); }
  function spawnFall(kind) {
    if (kind === 'snow') PT.push({ k: 1, kind, x: -10 + rnd() * (W + 40), y: -4, vx: 3 + rnd() * 6, vy: 12 + rnd() * 10, l: 0, m: 14, ph: rnd() * 6.28, s: rnd() });
    else if (kind === 'ash') PT.push({ k: 1, kind, x: -10 + rnd() * (W + 40), y: -4, vx: 6 + rnd() * 8, vy: 7 + rnd() * 8, l: 0, m: 16, ph: rnd() * 6.28, s: rnd() });
    else if (kind === 'sand') PT.push({ k: 1, kind, x: -10, y: 40 + rnd() * (GY - 30), vx: 55 + rnd() * 45, vy: 2 + rnd() * 4, l: 0, m: 9, ph: rnd() * 6.28, s: rnd() });
    else if (kind === 'spark') PT.push({ k: 1, kind, x: rnd() * W, y: 20 + rnd() * 80, vx: 0, vy: 0, l: 0, m: 0.5 + rnd() * 0.5, ph: 0, s: rnd() });
  }

  // bước mô phỏng hạt; s = trạng thái cảnh
  function step(dt, s, geo) {
    const f = sc.FX(), terr = s.terr, w = sc.weather.wind(s), prof = sc.weather.profile(s);
    acc.qi += dt * 10 * f; while (acc.qi > 1) { acc.qi -= 1; spawnQi(); }
    const rate = ({ snow: 9, ash: 6, sand: 7, spark: 1.5 })[terr.fx] || 0;
    if (rate) { acc.fall += dt * rate * f; while (acc.fall > 1) { acc.fall -= 1; spawnFall(terr.fx); } }
    if (s.war || (prof && prof.war)) { acc.war = (acc.war || 0) + dt; if (acc.war > 0.18) { acc.war = 0; sc.weather.WAR_X.forEach(x => PT.push({ k: 2, big: 1, x: x + rnd() * 6 - 3, y: GY - 12, vx: 5 + w * 24, vy: -(12 + rnd() * 6), l: 0, m: 6.5, ph: 0, s: rnd() })); } }
    acc.smoke += dt; if (acc.smoke > 0.45) { acc.smoke = 0; (geo.smokes || []).forEach(m => PT.push({ k: 2, x: m.x + rnd() * 2, y: m.y, vx: 3 + rnd() * 2, vy: -(7 + rnd() * 3), l: 0, m: 3.4, ph: 0, s: rnd() })); }
    for (let i = PT.length - 1; i >= 0; i--) {
      const p = PT[i]; p.l += dt;
      if (p.k === 3) { p.vy += (p.g || 0) * dt; if (p.dr !== 1) { const d = Math.pow(p.dr, dt * 60); p.vx *= d; p.vy *= d; } p.x += p.vx * dt; p.y += p.vy * dt; }
      else p.x += (p.vx + (p.k === 2 ? 0 : w * 14) + (p.k === 0 ? Math.sin(p.l * 1.3 + p.ph) * 5 : p.k === 1 && p.kind === 'snow' ? Math.sin(p.l * 1.7 + p.ph) * 7 : 0)) * dt, p.y += p.vy * dt;
      if (p.l >= p.m || p.y > H + 4 || p.x > W + 20 || (p.k !== 3 && p.y < -8) || p.x < -30) { PT[i] = PT[PT.length - 1]; PT.pop(); }
    }
  }

  function draw(ctx, pal, t, terr) {
    const jade = pal.jade, white = mix(pal.cloudLt, '#ffffff', 0.5);
    for (let i = 0; i < PT.length; i++) {
      const p = PT[i], x = Math.round(p.x), y = Math.round(p.y), f = Math.min(p.l / 0.6, 1) * Math.min((p.m - p.l) / 1.2, 1);
      if (p.k === 0) {
        const big = p.s > 0.78; ctx.globalAlpha = f * (0.55 + 0.4 * Math.sin(t * 3 + p.ph)) * 0.95; ctx.fillStyle = p.c ? white : jade;
        ctx.fillRect(x, y, 1, 1); if (big) { ctx.globalAlpha *= 0.6; ctx.fillRect(x - 1, y, 3, 1); ctx.fillRect(x, y - 1, 1, 3); ctx.globalAlpha *= 0.35; ctx.fillStyle = jade; ctx.fillRect(x - 2, y - 2, 5, 5); }
      } else if (p.k === 1) {
        ctx.globalAlpha = Math.min(1, f * 1.5);
        if (p.kind === 'snow') { ctx.fillStyle = '#f4f8ff'; const z = p.s > 0.7 ? 2 : 1; ctx.fillRect(x, y, z, z); }
        else if (p.kind === 'ash') { ctx.fillStyle = p.s < 0.25 ? '#ff9a3a' : p.s < 0.6 ? '#6a5a5a' : '#a89a96'; ctx.fillRect(x, y, p.s < 0.25 ? 2 : 1, p.s < 0.25 ? 2 : 1); }
        else if (p.kind === 'sand') { ctx.globalAlpha = Math.min(0.7, f); ctx.fillStyle = '#e8cc88'; ctx.fillRect(x, y, 3 + Math.floor(p.s * 3), 1); }
        else if (p.kind === 'spark') { ctx.globalAlpha = 0.6 * (1 - p.l / p.m); ctx.fillStyle = '#d8d0ff'; ctx.fillRect(x, y, 1, 1 + Math.floor(p.s * 4)); }
      } else if (p.k === 2) {
        const u = p.l / p.m; ctx.globalAlpha = (p.big ? 0.8 : 0.55) * (1 - u) * Math.min(1, p.l * 3); ctx.fillStyle = p.big ? mix('#4a4650', pal.ink, 0.2 + pal.amb * 0.3) : mix(pal.cloudLt, pal.mist, 0.3); const r = (p.big ? 2 : 1) + Math.floor(u * (p.big ? 7 : 3)); ctx.fillRect(x - r, y - r, r * 2 + 1, r * 2 + 1);
      } else if (p.k === 3) {
        const u = 1 - p.l / p.m; ctx.globalAlpha = clamp(u * 1.5, 0, 1); ctx.fillStyle = p.col; ctx.fillRect(x, y, p.sz, p.sz);
      }
    }
    ctx.globalAlpha = 1;
  }

  function drawFireflies(ctx, pal, t, terr) {
    if (pal.fire < 0.03) return;
    const hot = terr.n === 'volcano', col = hot ? '#ff9a4a' : '#e8ff8a', cor = hot ? '#ffd8a0' : '#fffbd0';
    FF.forEach(f => { const x = Math.round(f.x + Math.sin(t * f.sp + f.ph) * f.a), y = Math.round(f.y + Math.cos(t * f.sp * 1.3 + f.ph) * f.b), bl = Math.pow(Math.max(0, Math.sin(t * f.bl + f.ph * 3)), 2) * pal.fire;
      if (bl < 0.05) return; ctx.globalAlpha = bl * 0.3; ctx.fillStyle = col; ctx.fillRect(x - 1, y - 1, 3, 3); ctx.globalAlpha = bl; ctx.fillStyle = cor; ctx.fillRect(x, y, 1, 1); });
    ctx.globalAlpha = 1;
  }

  // ánh đèn lồng: quầng ba bậc nhấp nháy
  function drawLamps(ctx, pal, t, geo) {
    if (pal.lit < 0.05 && !(geo.lamps || []).some(l => l.always)) return; sc.use(ctx);
    (geo.lamps || []).forEach((l, i) => {
      const fl = sc.reduced ? 1 : 0.85 + 0.15 * Math.sin(t * 6.3 + i * 2.3) * Math.sin(t * 2.1 + i), a = (l.always ? Math.max(0.6, pal.lit) : pal.lit) * fl, c1 = l.c || '#ffb070';
      ctx.globalAlpha = a * 0.06; disc(l.x, l.y, 16, c1); ctx.globalAlpha = a * 0.1; disc(l.x, l.y, 11, c1); ctx.globalAlpha = a * 0.18; disc(l.x, l.y, 6, c1); ctx.globalAlpha = a * 0.5; disc(l.x, l.y, 1, '#fff0c8');
    });
    ctx.globalAlpha = 1;
  }
  function drawFlags(ctx, pal, t, geo) {
    (geo.flags || []).forEach(f => { for (let i = 0; i < f.w; i++) { const off = sc.reduced ? 0 : Math.round(Math.sin(t * 3.4 - i * 0.5 + f.ph) * (1 + i * 0.12)), hh = Math.round(f.h * (1 - i / f.w * 0.35)) - (hash(i * 3 + f.ph * 10) < 0.3 ? 3 : 0) - (i % 5 === 4 ? 5 : 0); ctx.fillStyle = i % 4 === 0 ? mix(f.col, pal.ink, 0.35) : f.col; ctx.fillRect(Math.round(f.x) + i, Math.round(f.y) + off, 1, Math.max(2, hh)); } });
  }

  // lửa đan đỉnh / lò luyện (động): ngọn lửa ba lớp
  function drawFlames(ctx, pal, t, geo) {
    (geo.flames || []).forEach((f, i) => {
      const hw = Math.round(f.w / 2); sc.use(ctx);
      ctx.globalAlpha = 0.18 + 0.06 * Math.sin(t * 5 + i); disc(f.x, f.y - 6, 18, '#ff8a2a'); ctx.globalAlpha = 1;
      for (let k = -hw; k <= hw; k += 2) {
        const e = 1 - Math.abs(k) / hw, h = Math.round(4 + (sc.reduced ? 1 : Math.sin(t * 9 + k * 1.3 + i) + 1) * 2.5 + e * 9);
        ctx.fillStyle = '#d8321c'; ctx.fillRect(Math.round(f.x + k), Math.round(f.y - h), 2, h);
        ctx.fillStyle = '#ff8a2a'; ctx.fillRect(Math.round(f.x + k), Math.round(f.y - h * 0.7), 2, Math.round(h * 0.7));
        ctx.fillStyle = '#ffe07a'; ctx.fillRect(Math.round(f.x + k), Math.round(f.y - h * 0.4), 2, Math.round(h * 0.4));
      }
    });
  }

  // lớp nhấn nền riêng từng tông (động): gió + kiếm quang, sương xanh, hồn quang, cực quang, tro, nắng, sét
  function accent(ctx, kind, pal, t, geo) {
    if (!kind) return; const f = sc.FX(); sc.use(ctx);
    if (kind === 'gio') {
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 14 * f; i++) { const y = 14 + hash(i * 3.3) * 84, sp = 110 + hash(i) * 90, x = (((hash(i * 7.1) * W - t * sp) % (W + 40)) + W + 40) % (W + 40) - 20; ctx.globalAlpha = 0.3; ctx.fillRect(Math.round(x), Math.round(y), 14 + Math.floor(hash(i * 2) * 18), 1); }
      const k = Math.floor(t / 2.2), ph = (t / 2.2) - k; if (ph < 0.18 && !sc.reduced) { const x0 = 60 + hash(k * 1.7) * 360, y0 = 12 + hash(k * 3.1) * 40; ctx.globalAlpha = 1 - ph / 0.18; sc.line(x0, y0, x0 + 26, y0 + 8, '#eaffff', 1); sc.line(x0 - 6, y0 - 2, x0, y0, '#7af4dc', 1); }
      ctx.globalAlpha = 1;
    } else if (kind === 'suong_xanh') {
      for (let i = 0; i < 4; i++) { ctx.globalAlpha = 0.09; ctx.fillStyle = '#8ae8a0'; ctx.fillRect(0, GY - 50 + i * 12 + Math.round(Math.sin(t * 0.4 + i) * 3), W, 12); }
      for (let i = 0; i < 18 * f; i++) { const x = hash(i * 9.1) * W + Math.sin(t * 0.5 + i) * 14, y = 60 + hash(i * 4.2) * 60 + Math.cos(t * 0.6 + i) * 6, b = Math.pow(Math.max(0, Math.sin(t * 1.3 + i * 2)), 2); ctx.globalAlpha = 0.2 + b * 0.8; ctx.fillStyle = '#d8ffa0'; ctx.fillRect(Math.round(x), Math.round(y), 1, 1); ctx.globalAlpha = b * 0.25; ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3); }
      ctx.globalAlpha = 1;
    } else if (kind === 'hon_quang') {
      for (let i = 0; i < 3; i++) { ctx.globalAlpha = 0.1; ctx.fillStyle = '#8a3ac8'; ctx.fillRect(0, GY - 36 + i * 11, W, 12); }
      for (let i = 0; i < 16 * f; i++) { const yy = (((t * (8 + hash(i) * 8) + hash(i * 3) * 120) % 120)), y = GY - yy, x = hash(i * 6.1) * W + Math.sin(t * 1.2 + i) * 8; ctx.globalAlpha = Math.min(1, yy / 20) * (1 - yy / 130); ctx.fillStyle = i % 3 ? '#7af4dc' : '#d8b8ff'; ctx.fillRect(Math.round(x), Math.round(y), 1, 2); ctx.fillRect(Math.round(x) - 1, Math.round(y) + 2, 3, 1); }
      ctx.globalAlpha = 1;
    } else if (kind === 'sao_nuoc') {
      for (let i = 0; i < 26 * f; i++) { const x = hash(i * 5.7) * W, y = 100 + hash(i * 2.9) * 22, b = Math.pow(Math.max(0, Math.sin(t * 1.8 + i * 3)), 3); ctx.globalAlpha = b * 0.9; ctx.fillStyle = '#ffffff'; ctx.fillRect(Math.round(x), Math.round(y), 2, 1); }
      ctx.globalAlpha = 1;
    } else if (kind === 'cuc_quang') {
      if (pal.amb > 0.2) for (let i = 0; i < 3; i++) for (let x = 0; x < W; x += 2) { const y = 10 + i * 8 + Math.sin(x * 0.04 + t * 0.5 + i) * 6; ctx.globalAlpha = 0.18; ctx.fillStyle = ['#4af0a0', '#6ad0ff', '#b08aff'][i]; ctx.fillRect(x, Math.round(y), 2, 14); }
      ctx.globalAlpha = 1;
    } else if (kind === 'tro') {
      for (let i = 0; i < 22 * f; i++) { const yy = ((t * (10 + hash(i) * 14) + hash(i * 3) * 120) % 120), x = hash(i * 6.1) * W + Math.sin(t + i) * 6; ctx.globalAlpha = 0.9 * (1 - yy / 130); ctx.fillStyle = i % 3 ? '#ff9a3a' : '#ffd060'; ctx.fillRect(Math.round(x), Math.round(GY - yy), 1, 1); }
      ctx.globalAlpha = 1;
    } else if (kind === 'nang') {
      ctx.globalAlpha = 0.07 + 0.03 * Math.sin(t * 0.8); ctx.fillStyle = '#ffd060'; ctx.fillRect(0, 0, W, 90); ctx.globalAlpha = 1;
      if (pal.amb < 0.4) for (let i = 0; i < 6; i++) { ctx.globalAlpha = 0.07; sc.line(380 + i * 4, 40, 300 + i * 40, GY, '#fff0a0', 2); } ctx.globalAlpha = 1;
    } else if (kind === 'set') {
      const k = Math.floor(t / 3.3), ph = t / 3.3 - k, rods = geo.rods || [];
      if (rods.length && ph < 0.16 && !sc.reduced) { const r = rods[k % rods.length], a = 1 - ph / 0.16; ctx.globalAlpha = a * 0.15; ctx.fillStyle = '#d8d0ff'; ctx.fillRect(0, 0, W, 90); ctx.globalAlpha = a; let x = r.x + (hash(k) - 0.5) * 40, y = 0; while (y < r.y) { const nx = x + (r.x - x) * 0.25 + (hash(k * 7 + y) - 0.5) * 12; sc.line(x, y, nx, y + 8, '#ffffff', 1); x = nx; y += 8; } ctx.globalAlpha = 1; }
    }
  }

  sc.fx = { drawFlames, accent, PT, step, draw, reset, emit, burst, drawFireflies, drawLamps, drawFlags, rnd };
})();
