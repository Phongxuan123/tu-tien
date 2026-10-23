// Thời tiết vùng và chiến sự: lớp hạt theo dữ liệu (data.js WEATHER, khóa theo id thời tiết), gió, chớp, sương thêm, khói chiến loạn.
// Không giữ trạng thái: mỗi hạt tính từ hạt giống cố định và thời gian, nên rẻ và không đụng rng của mô phỏng.
(function () {
  const sc = window.TT.ui.sc, CFG = sc.CFG, W = CFG.W, H = CFG.H, GY = CFG.GY, hash = sc.hash, mix = sc.mix;

  const profile = s => (s.wid && sc.data.WEATHER[s.wid]) || null;
  // gió -1..1 (dương: thổi sang phải); giảm một nửa khi bật giảm hiệu ứng
  const wind = s => { const p = profile(s), t = sc.data.terrOf(s.terr); const w = p && p.wind !== undefined ? p.wind : (t.wind || 0); return w * (sc.reduced ? 0.5 : 1); };
  const colOf = (p, i) => Array.isArray(p.col) ? p.col[i % p.col.length] : (p.col || '#ffffff');

  // chiến sự: ba cột khói bay theo gió và quầng lửa dưới chân (hạt khói do fx.step phát, quầng vẽ ở đây)
  const WAR_X = [300, 356, 412];
  function warGlow(ctx, t) {
    for (let i = 0; i < WAR_X.length; i++) { const a = 0.22 + 0.1 * Math.sin(t * 5 + i * 2) * (sc.reduced ? 0.3 : 1); ctx.globalAlpha = a; ctx.fillStyle = '#ff7a2a'; sc.use(ctx); sc.disc(WAR_X[i], GY - 4, 10, '#ff7a2a'); ctx.globalAlpha = a * 1.4; sc.disc(WAR_X[i], GY - 3, 4, '#ffd060'); }
    ctx.globalAlpha = 1;
  }

  // chớp: một nhịp mỗi 8 giây, tắt dần; bỏ khi giảm hiệu ứng (chỉ còn ánh mờ)
  function flash(ctx, t) {
    const per = 8, k = ((t % per) / per) * 9; if (k >= 1) return;
    ctx.globalAlpha = (sc.reduced ? 0.08 : 0.35) * (1 - k); ctx.fillStyle = '#d8e4ff'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
    if (!sc.reduced && k < 0.7) { const bx = 80 + hash(Math.floor(t / per)) * 320; ctx.fillStyle = '#fffbd8'; for (let y = 0; y < GY; y += 6) ctx.fillRect(Math.round(bx + Math.sin(y) * 8), y, 3, 6); }
  }

  function draw(ctx, s, pal, t) {
    const p = profile(s), f = sc.FX(), w = wind(s);
    if (s.war || (p && p.war)) warGlow(ctx, t);
    const flashOn = (p && p.flash) || s.terr.n === 'storm' || s.thunder;
    if (flashOn) flash(ctx, t);
    if (!p) return;
    const n = Math.round((p.n || 0) * f), lean = w * 0.45;
    sc.use(ctx);
    if (p.part === 'rain') {
      ctx.fillStyle = colOf(p, 0);
      for (let i = 0; i < n; i++) { const y = (hash(i * 6.6) * H + t * 290) % H, x = (((hash(i * 3.3) * (W + 120) + y * lean * 1.4 + t * w * 40) % (W + 120)) + W + 120) % (W + 120) - 60; ctx.fillRect(Math.round(x), Math.round(y), 1, 3); if (Math.abs(w) > 0.4) ctx.fillRect(Math.round(x + Math.sign(w)), Math.round(y) + 3, 1, 2); }
      ctx.globalAlpha = 0.5; for (let i = 0; i < n / 8; i++) { const ph = (t * 2.2 + hash(i * 1.9) * 5) % 1; ctx.globalAlpha = 0.6 * (1 - ph); ctx.fillRect(Math.round(hash(i * 8.1) * W), GY + 5 + Math.floor(hash(i * 2.7) * (H - GY - 6)), 2 + Math.round(ph * 3), 1); } ctx.globalAlpha = 1;
    } else if (p.part === 'snow') {
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < n; i++) { const sp = 18 + hash(i * 1.3) * 26, y = (hash(i * 7.7) * H + t * sp) % H, x = (((hash(i * 4.4) * W + Math.sin(t * 1.4 + i) * 6 + t * w * 50) % W) + W) % W, z = hash(i * 2.2) > 0.8 ? 2 : 1; ctx.fillRect(Math.round(x), Math.round(y), z, z); }
    } else if (p.part === 'sand') {
      ctx.fillStyle = '#e0bc72'; for (let i = 0; i < n; i++) { const x = (((hash(i * 5.5) * W + t * (110 + hash(i) * 70) * Math.sign(w || 1)) % W) + W) % W; ctx.globalAlpha = 0.45 + 0.4 * hash(i * 9.1); ctx.fillRect(Math.round(x), Math.round(20 + hash(i * 2.2) * (H - 20)), 3 + Math.floor(hash(i * 3.1) * 4), 1); } ctx.globalAlpha = 1;
    } else if (p.part === 'leaf') {
      for (let i = 0; i < n; i++) { const x = (((hash(i * 5.1) * (W + 40) + t * (30 + hash(i) * 40) * (w || 1)) % (W + 40)) + W + 40) % (W + 40) - 20, y = (hash(i * 7.3) * H + t * (14 + hash(i * 2) * 10) + Math.sin(t * 2 + i) * 6) % H; ctx.fillStyle = colOf(p, i); ctx.fillRect(Math.round(x), Math.round(y), 2, Math.sin(t * 5 + i) > 0 ? 1 : 2); }
    } else if (p.part === 'petal') {
      ctx.fillStyle = '#f8b8d0'; for (let i = 0; i < n; i++) { const x = (((hash(i * 5.1) * W + t * 12 * (w || 1) + Math.sin(t + i) * 10) % W) + W) % W, y = (hash(i * 7.3) * H + t * 10) % H; ctx.fillRect(Math.round(x), Math.round(y), 2, 1); }
    } else if (p.part === 'ash') {
      for (let i = 0; i < n; i++) { const x = (((hash(i * 5.5) * W + t * (6 + hash(i) * 8) * (w || 1)) % W) + W) % W, y = (hash(i * 2.2) * H + t * (8 + hash(i * 4) * 8)) % H; ctx.fillStyle = hash(i * 7) < 0.7 ? '#8a8286' : '#4a4448'; ctx.fillRect(Math.round(x), Math.round(y), 1, 1); }
      if (p.ember) { ctx.fillStyle = '#ff9a3a'; for (let i = 0; i < n / 2; i++) ctx.fillRect(Math.round(hash(i * 2.9) * W + Math.sin(t + i) * 4), Math.round(GY - ((t * 18 + i * 22) % 100)), 2, 2); }
    } else if (p.part === 'glow') {
      for (let i = 0; i < n; i++) { const x = hash(i * 9.9) * W + Math.sin(t * 0.5 + i) * 10, y = GY - 8 - hash(i * 1.1) * 52 + Math.cos(t * 0.7 + i) * 6, b = 0.5 + 0.5 * Math.sin(t * 1.8 + i); ctx.globalAlpha = b * 0.3; ctx.fillStyle = colOf(p, 0); ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 4, 4); ctx.globalAlpha = b; ctx.fillRect(Math.round(x), Math.round(y), 2, 2); } ctx.globalAlpha = 1;
    } else if (p.part === 'meteor') {
      for (let i = 0; i < Math.max(2, n * f); i++) { const ph = ((t * 0.6 + hash(i * 3.3) * 7) % 3) / 1.1; if (ph > 1) continue; const x0 = hash(i * 8.2) * W, x = x0 + ph * 80, y = 4 + ph * 70 + hash(i) * 20; ctx.globalAlpha = 1 - ph; for (let k = 0; k < 10; k++) { ctx.fillStyle = k < 2 ? '#fff0c0' : '#ff8a3a'; ctx.fillRect(Math.round(x - k * 1.2), Math.round(y - k * 0.9), 1, 1); } } ctx.globalAlpha = 1;
    } else if (p.part === 'splash') {
      const wy = (sc.data.terrOf(s.terr).water || GY - 20) + 3; ctx.fillStyle = '#ffffff';
      for (let i = 0; i < n; i++) { const b = Math.pow(Math.max(0, Math.sin(t * 2.2 + i * 3.7)), 4); if (b < 0.2) continue; const x = hash(i * 6.1) * W, y = wy + hash(i * 3.3) * (GY - wy - 2); ctx.globalAlpha = b; ctx.fillRect(Math.round(x), Math.round(y - b * 4), 1, Math.round(1 + b * 3)); ctx.fillRect(Math.round(x) - 1, Math.round(y), 3, 1); } ctx.globalAlpha = 1;
    } else if (p.part === 'aurora') {
      if (pal.amb > 0.2) for (let i = 0; i < 3; i++) for (let x = 0; x < W; x += 2) { const y = 10 + i * 8 + Math.sin(x * 0.04 + t * 0.5 + i) * 6; ctx.globalAlpha = 0.22; ctx.fillStyle = ['#4af0a0', '#6ad0ff', '#b08aff'][i]; ctx.fillRect(x, Math.round(y), 2, 16); } ctx.globalAlpha = 1;
    } else if (p.part === 'rays') {
      for (let i = 0; i < 5; i++) { ctx.globalAlpha = 0.06 + 0.03 * Math.sin(t * 0.7 + i); sc.line(120 + i * 70, 0, 60 + i * 80, GY, '#fff4b0', 6); } ctx.globalAlpha = 1;
    }
  }

  // màu phủ trời: dùng ở bảng màu (scene.js) để cùng khóa dựng lại lớp tĩnh
  const tintOf = s => { const p = profile(s); return p && p.tint ? { color: p.tint, k: p.k } : null; };
  sc.weather = { profile, wind, draw, tintOf, WAR_X };
})();
