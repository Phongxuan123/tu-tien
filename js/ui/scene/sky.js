// Trời: dải màu, sao, mặt trời / trăng, mây cao.
(function () {
  const sc = window.TT.ui.sc, CFG = sc.CFG, W = CFG.W, TW = CFG.TW, B = sc.B;
  const { mix, hash, mulberry, ell, line, disc, R, vgrad } = sc;

  // sao: hạt giống cố định
  const STARS = [];
  { const r = mulberry(77); for (let i = 0; i < 120; i++) STARS.push({ x: Math.floor(r() * W), y: Math.floor(Math.pow(r(), 1.3) * 86), b: r() < 0.1, ph: r() * 6.28, sp: 0.8 + r() * 2 }); }

  sc.paintSky = (pal, mode) => {
    sc.use(B.sky.begin(mode));
    sc.cur().clearRect(0, 0, W, CFG.H);
    vgrad(0, 0, W, 60, pal.sky0, pal.sky1, 6); vgrad(0, 60, W, 70, pal.sky1, pal.sky2, 6); R(0, 130, W, CFG.H - 130, pal.sky2);
  };

  // dải mây cao, xếp mảnh lặp rộng TW
  sc.paintHigh = (pal, seed, mode) => {
    sc.use(B.high.begin(mode));
    const r = mulberry(700 + seed);
    for (let i = 0; i < 16; i++) {
      const cx = Math.round(r() * TW), cy = 6 + Math.floor(r() * 40), rx = 24 + Math.floor(r() * 46), ry = 1 + Math.floor(r() * 3);
      [0, -TW, TW].forEach(o => { ell(cx + o, cy + 2, rx, ry, mix(pal.cloudMd, pal.sky1, 0.3)); ell(cx + o, cy, rx, ry, pal.cloudLt); ell(cx + o + rx * 0.5, cy - ry, rx * 0.6, Math.max(1, ry - 1), pal.cloudLt); line(cx + o - rx - 8, cy + 1, cx + o - rx, cy, pal.cloudLt); line(cx + o + rx, cy + 1, cx + o + rx + 12, cy + 2, pal.cloudLt); });
    }
  };

  // sao, mặt trời, trăng (động: nhấp nháy)
  sc.drawSkyObjs = (ctx, pal, t, s) => {
    sc.use(ctx);
    const red = sc.reduced, year = s ? s.year : 0, void_ = s && s.phase === 'void';
    if (pal.starA > 0.02) {
      STARS.forEach(st => { const tw = 0.45 + 0.55 * Math.pow(Math.max(0, Math.sin(red ? st.ph : t * st.sp + st.ph)), 2); ctx.globalAlpha = pal.starA * tw * (1 - st.y / 110); ctx.fillStyle = '#eef4ff'; ctx.fillRect(st.x, st.y, 1, 1); if (st.b && tw > 0.7) { ctx.globalAlpha *= 0.6; ctx.fillRect(st.x - 1, st.y, 3, 1); ctx.fillRect(st.x, st.y - 1, 1, 3); } });
      ctx.globalAlpha = 1;
    }
    if (void_) { // vệt sao bay ngang khi xuyên hư không
      const sp = red ? 20 : 90;
      for (let i = 0; i < 26; i++) { const y = hash(i * 9.1) * sc.CFG.GY, x = (((hash(i * 4.4) * W - t * sp * (0.4 + hash(i) * 1.2)) % W) + W) % W; ctx.globalAlpha = 0.6; ctx.fillStyle = '#c9b8ff'; ctx.fillRect(Math.round(x), Math.round(y), 5 + Math.floor(hash(i * 2) * 14), 1); }
      ctx.globalAlpha = 1;
    }
    if (pal.sunA > 0.02) { // mặt trời: quầng dạng bậc
      const sx = Math.round(pal.sunX + (hash(year * 1.3) - 0.5) * 120), sy = Math.round(pal.sunY), r = Math.round(pal.sunR);
      [r * 2.4, r * 1.8, r * 1.35].forEach((rad, i) => { ctx.globalAlpha = pal.sunA * [0.08, 0.12, 0.2][i]; disc(sx, sy, Math.round(rad), pal.sun); });
      ctx.globalAlpha = pal.sunA * 0.92; disc(sx, sy, r, pal.sun); ctx.globalAlpha = 1;
    }
    if (pal.moonA > 0.02) {
      const mx = 90 + Math.round(hash(year * 1.7) * 300), my = 34, r = 15;
      ctx.globalAlpha = pal.moonA * 0.08; disc(mx, my, 30, '#cfe4ff'); ctx.globalAlpha = pal.moonA * 0.13; disc(mx, my, 23, '#cfe4ff'); ctx.globalAlpha = pal.moonA * 0.2; disc(mx, my, 19, '#dfeeff');
      ctx.globalAlpha = pal.moonA; disc(mx, my, r, '#f2efd8'); ctx.globalAlpha = pal.moonA * 0.8; disc(mx - 5, my - 4, 4, '#d6d6c0'); disc(mx + 5, my + 5, 3, '#d6d6c0'); disc(mx + 3, my - 7, 2, '#dcdcc8'); disc(mx - 7, my + 6, 2, '#dcdcc8');
      ctx.globalAlpha = pal.moonA * 0.5; disc(mx + 8, my + 1, 6, '#c8c8b4'); ctx.globalAlpha = 1;
      sc.moon = { x: mx, y: my };
    } else sc.moon = null;
  };
})();
