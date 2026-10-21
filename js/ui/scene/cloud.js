// Biển mây, sương thấp và mặt nước biển (Đông Hải). Các lớp lặp rộng TW, trượt theo thời gian / đường đi.
(function () {
  const sc = window.TT.ui.sc, CFG = sc.CFG, TW = CFG.TW, W = CFG.W, GY = CFG.GY, B = sc.B;
  const { mix, hash, mulberry, ell, line, R, vgrad } = sc;

  // vẽ lặp các cụm tại cx, cx-TW, cx+TW để mép nối liền
  const wrapPts = (pts, fn) => pts.forEach(p => [0, -TW, TW].forEach(o => { if (p.cx + o + p.r >= 0 && p.cx + o - p.r <= TW) fn(p, Math.round(p.cx + o)); }));

  // biển mây (nhiều tầng): terr.sea = độ dày
  sc.paintSea = (pal, terr, mode) => {
    sc.use(B.sea.begin(mode));
    if (terr.sea <= 0) return;
    const r = mulberry(500 + terr.seed), h = 96, top = 12, pts = [], cn = Math.max(8, Math.round(36 * Math.min(1.3, terr.sea)));
    const cd = pal.cloudDk, cm = pal.cloudMd, cl = pal.cloudLt;
    for (let i = 0; i < cn; i++) { const rx = Math.round(15 + r() * 15), ry = Math.round(6 + r() * 5); pts.push({ cx: i * (TW / cn) + (r() * 12 - 6), cy: Math.round(top + ry * 0.8 + r() * 8 + (i % 3) * 3), r: rx, ry, a: r() * 20 - 10 }); }
    wrapPts(pts, (p, x) => ell(x, p.cy + 4, p.r, p.ry, cd)); R(0, top + 22, TW, h, cd);
    wrapPts(pts, (p, x) => ell(x, p.cy + 1, p.r, p.ry, cm)); vgrad(0, top + 20, TW, 44, cm, cd, 5);
    wrapPts(pts, (p, x) => ell(x - 3, p.cy - 2, Math.round(p.r * 0.72), Math.round(p.ry * 0.65), cl));
    wrapPts(pts, (p, x) => { ell(x + Math.round(p.a), p.cy - p.ry + 1, Math.round(p.r * 0.4), Math.max(2, Math.round(p.ry * 0.55)), cl); ell(x + Math.round(p.a) - 2, p.cy - p.ry - 1, Math.round(p.r * 0.22), 2, mix(cl, '#ffffff', 0.5)); });
    const g = sc.cur(); g.globalCompositeOperation = 'destination-out'; for (let b = 0; b < 6; b++) { g.globalAlpha = (b + 1) / 7; g.fillRect(0, h - 36 + b * 6, TW, 6); } g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  };

  // dải mây sát đất (phía trước, trôi nhanh)
  sc.paintFront = (pal, terr, mode) => {
    sc.use(B.front.begin(mode));
    const r = mulberry(600 + terr.seed), pts = [];
    for (let i = 0; i < 30; i++) { const rad = Math.round(6 + r() * 8); pts.push({ cx: i * 32 + (r() * 14 - 7), cy: Math.round(14 + r() * 8), r: rad }); }
    wrapPts(pts, (p, x) => ell(x, p.cy + 3, p.r * 2, Math.round(p.r * 0.55), pal.cloudDk)); wrapPts(pts, (p, x) => ell(x, p.cy + 1, p.r * 2, Math.round(p.r * 0.55), pal.cloudMd)); wrapPts(pts, (p, x) => ell(x - 3, p.cy - 1, p.r * 1.3, Math.round(p.r * 0.35), pal.cloudLt));
    const g = sc.cur(); g.globalCompositeOperation = 'destination-out'; for (let b = 0; b < 4; b++) { g.globalAlpha = (b + 1) / 6; g.fillRect(0, 30 + b * 3, TW, 3); } g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  };

  // sương thấp (mờ): terr.mistK dày hơn ở Vụ Trạch
  sc.paintFog = (pal, terr, mode) => {
    sc.use(B.fog.begin(mode));
    const r = mulberry(800 + terr.seed), g = sc.cur(), mc = pal.mist, n = Math.round(16 * Math.max(0.5, terr.mistK));
    for (let i = 0; i < n; i++) { const cx = Math.round(r() * TW), cy = 12 + Math.floor(r() * 12), rx = 34 + Math.floor(r() * 56), ry = 3 + Math.floor(r() * 4); [0, -TW, TW].forEach(o => { g.globalAlpha = 0.4; ell(cx + o, cy, rx, ry, mc); g.globalAlpha = 0.5; ell(cx + o - 6, cy - 1, Math.round(rx * 0.65), Math.max(1, ry - 1), mc); g.globalAlpha = 0.7; ell(cx + o - 10, cy - 1, Math.round(rx * 0.35), Math.max(1, ry - 2), mix(mc, '#ffffff', 0.5)); }); }
    g.globalAlpha = 1;
  };

  // mặt nước biển thật (tĩnh): dải màu + vệt sáng bằng ô cờ
  sc.paintWater = (pal, terr, mode) => {
    sc.use(B.water.begin(mode));
    if (!terr.water) return;
    const r = mulberry(900 + terr.seed), h = 48;
    vgrad(0, 0, TW, h, mix(pal.sky2, pal.mist, 0.5), mix(pal.jade, pal.m4, 0.62), 4);
    R(0, 0, TW, 2, mix(pal.mist, '#ffffff', 0.35));
    for (let i = 0; i < 140; i++) { const x = Math.floor(r() * TW), y = 3 + Math.floor(Math.pow(r(), 0.8) * (h - 5)), l = 4 + Math.floor(r() * 18); R(x, y, l, 1, mix(pal.cloudLt, pal.jade, 0.45 + r() * 0.3)); if (r() < 0.4) R(x + 3, y + 1, Math.max(2, l - 6), 1, mix(pal.cloudDk, pal.jade, 0.3)); }
  };

  // sóng và bóng trăng trên mặt nước (động)
  sc.drawWater = (ctx, pal, t, terr, off) => {
    if (!terr.water) return;
    const wy = terr.water, red = sc.reduced;
    sc.use(ctx);
    for (let i = 0; i < 46; i++) {
      const y = wy + 4 + hash(i * 3.1) * (GY - wy - 3), sp = 3 + hash(i * 1.7) * 7 * (red ? 0.3 : 1), x = (((hash(i * 5.3) * W + t * sp + off * 0.8) % (W + 40)) + W + 40) % (W + 40) - 20, l = 3 + Math.floor(hash(i * 2.3) * 8);
      ctx.globalAlpha = 0.35 + 0.35 * Math.sin(t * 1.4 + i); ctx.fillStyle = mix(pal.cloudLt, '#ffffff', 0.3); ctx.fillRect(Math.round(x), Math.round(y), l, 1);
    }
    ctx.globalAlpha = 1;
    if (sc.moon && pal.moonA > 0.05) { // cột sáng trăng
      const mx = sc.moon.x;
      for (let y = wy + 2; y < GY + 2; y += 2) { const w = 3 + Math.round(Math.sin(y * 0.9 + t * 2.2) * 2) + Math.floor((y - wy) / 5); ctx.globalAlpha = pal.moonA * (0.55 - (y - wy) / 70); ctx.fillStyle = '#f2efd8'; ctx.fillRect(mx - Math.floor(w / 2) + Math.round(Math.sin(y * 0.4 + t) * 1.5), y, w, 1); }
      ctx.globalAlpha = 1;
    } else if (pal.sunA > 0.05) {
      const sx = Math.round(pal.sunX + (hash((sc.yearNow || 0) * 1.3) - 0.5) * 120);
      for (let y = wy + 2; y < GY + 2; y += 2) { const w = 3 + Math.round(Math.sin(y * 0.9 + t * 2.2) * 2) + Math.floor((y - wy) / 5); ctx.globalAlpha = pal.sunA * (0.5 - (y - wy) / 70); ctx.fillStyle = pal.sun; ctx.fillRect(sx - Math.floor(w / 2), y, w, 1); }
      ctx.globalAlpha = 1;
    }
  };
})();
