// Kiến trúc dùng chung (mái cong đầu đao, điện, tháp, lan can, đèn lồng), mặt đất, và bố cục tĩnh theo loại nơi.
// T-A: nơi có phố công trình thì phố vẽ động ở scene.js, còn lại dùng bố cục dưới đây. T-C sẽ thêm công trình đặc trưng theo cls và theo tông.
(function () {
  const sc = window.TT.ui.sc, CFG = sc.CFG, W = CFG.W, H = CFG.H, GY = CFG.GY, B = sc.B;
  const { mix, hash, mulberry, clamp, R, P, line, ell, disc, vgrad } = sc;

  // màu mái: 'plain' ngói đỏ, 'sect' ngói ngọc, 'ruin' đen cháy
  sc.roofCols = (pal, kind) => {
    if (kind === 'sect') { const t = mix(pal.jade, pal.m4, 0.62); return { t, l: mix(pal.jade, pal.cloudLt, 0.45), d: mix(t, pal.ink, 0.4), d2: mix(t, pal.ink, 0.2), sh: mix(pal.wall, pal.ink, 0.6) }; }
    if (kind === 'warm') { const t = mix('#b8703a', pal.m4, 0.3); return { t, l: mix(t, pal.cloudLt, 0.4), d: mix(t, pal.ink, 0.4), d2: mix(t, pal.ink, 0.2), sh: mix(pal.wall, pal.ink, 0.6) }; }
    if (kind === 'ice') { const t = mix('#9fd0e8', pal.m4, 0.35); return { t, l: mix(t, '#ffffff', 0.6), d: mix(t, pal.ink, 0.35), d2: mix(t, pal.ink, 0.15), sh: mix(pal.wall, pal.ink, 0.5) }; }
    if (kind === 'gold') { const t = mix('#d8a838', pal.m4, 0.3); return { t, l: mix(t, '#fff4c0', 0.5), d: mix(t, pal.ink, 0.45), d2: mix(t, pal.ink, 0.22), sh: mix(pal.wall, pal.ink, 0.6) }; }
    if (kind === 'ruin') { const t = mix(pal.roof, pal.ink, 0.3); return { t, l: mix(pal.lamp, pal.roofLt, 0.5), d: pal.ink, d2: mix(t, pal.ink, 0.4), sh: pal.ink }; }
    return { t: pal.roof, l: pal.roofLt, d: mix(pal.roof, pal.ink, 0.45), d2: mix(pal.roof, pal.ink, 0.2), sh: mix(pal.wall, pal.ink, 0.55) };
  };

  // mái cong đầu đao
  function roof(cx, yTop, halfW, h, col, orn) {
    const g = sc.cur(), yb0 = yTop + h + 3;
    for (let dx = -halfW; dx <= halfW; dx++) {
      const d = Math.abs(dx) / halfW, lift = d > 0.78 ? Math.pow((d - 0.78) / 0.22, 2) * h * 0.42 : 0;
      const yt = Math.round(yTop + h * Math.pow(Math.max(0, d - 0.12) / 0.88, 0.62) - lift), yb = Math.round(yb0 - lift * 1.05);
      for (let y = yt; y <= yb; y++) {
        let c = col.t; const rowTile = (y - yt) % 3 === 2, colTile = (dx + halfW) % 3 === 0;
        if (y === yt) c = col.l; else if (y >= yb - 1) c = col.d; else if (rowTile || colTile) c = col.d2 || col.d;
        g.fillStyle = c; g.fillRect(cx + dx, y, 1, 1);
      }
      g.fillStyle = col.sh; g.fillRect(cx + dx, yb + 1, 1, 1);
    }
    if (orn) [-1, 1].forEach(s => { R(cx + s * Math.round(halfW * 0.14) - (s < 0 ? 1 : 0), yTop - 3, 2, 3, orn); P(cx + s * Math.round(halfW * 0.14) + (s < 0 ? -1 : 1), yTop - 4, orn); });
    return yb0;
  }
  sc.roof = roof;

  function lantern(x, y, pal, geo) {
    const lit = pal.lit, body = mix(pal.lamp, '#ffc890', lit * 0.55);
    R(x + 1, y - 3, 1, 3, pal.ink);
    R(x - 1, y, 5, 1, pal.gold); R(x - 1, y + 1, 5, 4, body); R(x, y + 1, 1, 3, mix(body, '#ffe8c0', 0.5)); R(x - 1, y + 5, 5, 1, pal.gold); R(x + 1, y + 6, 1, 3, pal.gold);
    geo.lamps.push({ x: x + 1.5, y: y + 3 });
  }
  sc.lantern = lantern;
  const lattice = (x, y, w, h, col, frame) => { R(x, y, w, h, col); for (let i = 1; i < w; i += 2) R(x + i, y, 1, h, frame); for (let j = 2; j < h; j += 3) R(x, y + j, w, 1, frame); };

  // điện / nhà một tầng mái cong
  function hall(cx, gy, w, wallH, roofH, o, pal, geo) {
    const x0 = cx - Math.floor(w / 2);
    if (o.plat) { R(x0 - 4, gy - 3, w + 8, 3, o.stone); R(x0 - 4, gy - 3, w + 8, 1, o.stoneLt || o.stone); }
    const wy = gy - (o.plat ? 3 : 0) - wallH;
    R(x0, wy, w, wallH, o.wall);
    const n = Math.max(2, Math.round(w / 12)), cols = [];
    for (let i = 0; i <= n; i++) cols.push(Math.round(x0 + i * (w - 2) / n));
    for (let i = 0; i < n; i++) {
      const bx = cols[i] + 2, bw = cols[i + 1] - bx;
      if (bw < 3) continue;
      if (o.door && i === Math.floor(n / 2)) { R(bx, wy + wallH - 10, bw, 10, o.frame); R(bx + 1, wy + wallH - 9, bw - 2, 9, mix(o.frame, pal.ink, 0.45)); R(bx + Math.floor(bw / 2), wy + wallH - 9, 1, 9, o.frame); P(bx + Math.floor(bw / 2) - 1, wy + wallH - 5, pal.gold); P(bx + Math.floor(bw / 2) + 1, wy + wallH - 5, pal.gold); }
      else { const dark = mix(o.wall, pal.ink, 0.72), litc = mix(dark, pal.gold, pal.lit * 0.85); lattice(bx + 1, wy + 4, bw - 2, Math.max(4, wallH - 9), litc, o.frame); }
    }
    cols.forEach(cxp => R(cxp, wy, 2, wallH, o.frame));
    R(x0 - 1, wy, w + 2, 2, o.frame); R(x0, wy + 2, w, 1, mix(o.wall, pal.ink, 0.35));
    const rh = o.eave || 6, ry = wy - roofH + 1;
    roof(cx, ry, Math.floor(w / 2) + rh, roofH, o.roofC, o.orn);
    const eaveY = ry + roofH + 3;
    if (o.lamps) { lantern(x0 - rh + 3, eaveY + 1, pal, geo); lantern(x0 + w + rh - 5, eaveY + 1, pal, geo); }
    return { top: ry, wy, eaveY, x0, x1: x0 + w, halfW: Math.floor(w / 2) + rh };
  }
  sc.hall = hall;

  // tháp nhiều tầng
  function pagoda(cx, gy, w0, tiers, o, pal, geo) {
    let y = gy, w = w0;
    R(cx - Math.floor(w0 / 2) - 4, gy - 3, w0 + 8, 3, o.stone);
    y -= 3;
    for (let i = 0; i < tiers; i++) {
      const wh = i === 0 ? 10 : 8, rh = 6, ww = Math.round(w), x0 = cx - Math.floor(ww / 2);
      R(x0, y - wh, ww, wh, o.wall); R(x0, y - wh, 2, wh, o.frame); R(x0 + ww - 2, y - wh, 2, wh, o.frame); R(x0, y - wh, ww, 2, o.frame);
      if (ww > 10) lattice(x0 + 4, y - wh + 3, ww - 8, wh - 4, mix(o.wall, pal.ink, 0.7), o.frame);
      if (pal.lit > 0.1 && ww > 10) R(x0 + 5, y - wh + 4, ww - 10, wh - 6, mix(mix(o.wall, pal.ink, 0.72), pal.gold, pal.lit * 0.85));
      roof(cx, y - wh - rh + 1, Math.floor(ww / 2) + 6, rh, o.roofC, null);
      if (i === 0 || i === tiers - 1) geo.lamps.push({ x: cx - Math.floor(ww / 2) - 4, y: y - wh + 6 });
      y = y - wh - rh - 2 + 3; w = w * 0.82;
      if (i < tiers - 1) R(cx - Math.floor(w / 2), y - 1, Math.round(w), 3, o.frame);
    }
    R(cx, y - 14, 1, 14, o.gold); for (let k = 0; k < 4; k++) R(cx - 1, y - 12 + k * 3, 3, 1, o.gold); disc(cx, y - 15, 1, o.gold);
    return y - 15;
  }
  sc.pagoda = pagoda;

  // lan can đá chạy theo dốc
  function rail(x0, y0, x1, y1, h, c, cl, step) {
    const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
    line(x0, y0 - h, x1, y1 - h, cl);
    for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, y = y0 + (y1 - y0) * i / n; R(x, y - h, 2, h + 1, c); R(x - 1, y - h - 1, 4, 1, cl); }
  }
  sc.rail = rail;
  // chữ giả trên biển hiệu (chữ không quan trọng)
  function glyphs(x, y, n, col) {
    for (let i = 0; i < n; i++) { const gx = x + i * 5; for (let k = 0; k < 6; k++) { const hx = hash(i * 7 + k * 3 + n), hy = hash(i * 5 + k * 11); if (hx < 0.55) R(gx + Math.floor(hy * 3), y + (k % 4), 1 + Math.floor(hx * 4), 1, col); else R(gx + Math.floor(hx * 4), y + Math.floor(hy * 3), 1, 2 + Math.floor(hy * 2), col); } }
  }
  sc.glyphs = glyphs;

  // ---------- mặt đất ----------
  function drawGround(pal, T, terr, cls, r) {
    const kind = cls === 'sect' ? 'stone' : terr.ground, gcol = cls === 'sect' ? mix(pal.wall, pal.m3, 0.38) : terr.gcol, gc = T(gcol);
    if (cls === 'void') { // cầu hư không: dải sáng mờ
      R(0, GY + 8, W, 2, mix(pal.jade, pal.ink, 0.6)); R(0, GY + 10, W, H, mix(pal.ink, pal.m4, 0.5)); return;
    }
    R(0, GY, W, H - GY, gc); R(0, GY, W, 2, T(mix(gcol, '#ffffff', 0.22))); vgrad(0, GY + 6, W, H - GY - 6, gc, T(mix(gcol, pal.m4, 0.55)), 4);
    if (kind === 'grass') {
      const pc = T(mix(pal.wall, '#b89a6a', 0.5)); R(0, GY + 4, W, 6, pc); for (let x = 0; x < W; x += 2) { const j = Math.floor(hash(x * 0.3) * 2); R(x, GY + 3 + j, 2, 1, pc); R(x, GY + 10 - j, 2, 1, pc); } R(0, GY + 9, W, 1, mix(pc, pal.m4, 0.35));
    } else if (kind === 'stone') {
      const st = gc; for (let row = 0; row < 4; row++) for (let x = (row % 2) * 14; x < W; x += 28) R(x, GY + 4 + row * 5, 1, 5, mix(st, pal.ink, 0.4)); for (let row = 0; row < 4; row++) R(0, GY + 4 + row * 5, W, 1, mix(st, pal.ink, 0.28));
    } else if (kind === 'sand' || kind === 'dune') {
      for (let i = 0; i < 70; i++) { const x = Math.floor(r() * W), y = GY + 3 + Math.floor(r() * (H - GY - 4)); R(x, y, 4 + Math.floor(r() * 10), 1, T(mix(gcol, r() < 0.5 ? '#ffffff' : '#8a6a3a', 0.25))); }
    } else if (kind === 'snow') {
      for (let i = 0; i < 50; i++) { const x = Math.floor(r() * W), y = GY + 3 + Math.floor(r() * (H - GY - 4)); R(x, y, 3 + Math.floor(r() * 7), 1, T(mix(gcol, '#7a98b8', 0.35))); }
    } else if (kind === 'basalt' || kind === 'violet') {
      const col = kind === 'basalt' ? pal.lamp : pal.jade;
      for (let i = 0; i < 26; i++) { let x = Math.floor(r() * W), y = GY + 5 + Math.floor(r() * 12); const c = r() < 0.5 ? col : pal.gold; for (let k = 0; k < 6 + Math.floor(r() * 10); k++) { P(x, y, c); x += r() < 0.6 ? 1 : 0; y += r() < 0.5 ? 1 : (r() < 0.5 ? -1 : 0); y = clamp(y, GY + 3, H - 1); } }
    } else if (kind === 'mud') {
      for (let i = 0; i < 9; i++) { const x = Math.floor(r() * W), y = GY + 6 + Math.floor(r() * 12); ell(x, y, 8 + Math.floor(r() * 8), 1, T(mix(pal.sky1, pal.m4, 0.35))); }
    }
    if (cls === 'road') { const pc = T(mix(pal.wall, '#b89a6a', 0.45)); R(0, GY + 7, W, 8, pc); for (let x = 0; x < W; x += 3) { const j = Math.floor(hash(x * 0.4) * 2); R(x, GY + 6 + j, 3, 1, pc); R(x, GY + 15 - j, 3, 1, pc); } }
  }

  // ---------- bố cục theo loại nơi ----------
  function townLayout(pal, T, geo, r, terr) {
    const hc = { wall: T(pal.wall), frame: T(mix(pal.wood, pal.ink, 0.6)), stone: T(mix(pal.m3, pal.wall, 0.3)), stoneLt: T(mix(pal.m3, pal.wall, 0.55)), roofC: sc.roofCols(pal, 'plain'), door: 1, plat: 1, eave: 6 };
    [[50, 32, 13, 9], [146, 46, 15, 10], [312, 44, 14, 9], [398, 34, 13, 8]].forEach(([cx, w, wh, rh], i) => {
      const hh = hall(cx, GY + 1, w, wh, rh, Object.assign({}, hc, { lamps: i % 2 === 1 }), pal, geo);
      if (i === 1 || i === 2) { geo.smokes.push({ x: hh.x1 - 4, y: hh.top + 4 }); R(hh.x1 - 6, hh.top - 2, 3, 5, T(mix(pal.roof, pal.ink, 0.3))); }
      if (i === 1) { R(hh.x1 + 8, GY - 40, 1, 40, T(pal.woodDk)); R(hh.x1 + 9, GY - 40, 7, 11, T(pal.wood)); glyphs(hh.x1 + 10, GY - 38, 1, T(pal.gold)); }
    });
    const pc = sc.pineCols(pal, T);
    [[98, 22], [262, 20], [440, 22]].forEach(([x, h]) => { if (terr.tree === 'dead') sc.deadTree(x, GY + 1, h, pal.ink, r, 0.1); else sc.pine(x, GY + 1, h, (r() - 0.5) * 0.3, pc, 1, r); });
    const fence = (x0, x1) => { const c = T(mix('#a8c070', pal.m4, 0.15)), cd = T(mix('#7a9850', pal.m4, 0.3)); R(x0, GY - 8, x1 - x0, 1, cd); R(x0, GY - 4, x1 - x0, 1, cd); for (let x = x0; x < x1; x += 4) { R(x, GY - 11, 2, 12, c); P(x, GY - 12, c); R(x + 1, GY - 11, 1, 12, cd); } };
    fence(78, 124); fence(206, 280); fence(352, 376);
    R(189, GY - 16, 3, 16, T(pal.woodDk)); lantern(188, GY - 22, pal, geo); geo.lamps.push({ x: 189.5, y: GY - 19 });
  }

  function ruinLayout(pal, T, geo, r) {
    const ink = pal.ink, edge = mix(pal.lamp, pal.ink, 0.55), bk = mix(pal.m4, ink, 0.55), bl = mix(pal.m3, ink, 0.35), rc = sc.roofCols(pal, 'ruin');
    let cx = 112, y = GY;
    R(cx - 22, y - 3, 44, 4, bk);
    for (let i = 0; i < 4; i++) { const ww = 28 - i * 5, wh = 12, lean = i * 2, x0 = cx - Math.floor(ww / 2) + lean; R(x0, y - 3 - wh, ww, wh, bk); R(x0 + 1, y - 3 - wh, 1, wh, bl); for (let k = 0; k < 2; k++) R(x0 + 4 + k * Math.floor(ww / 2 - 2), y - wh, 4, 6, mix(pal.ink, pal.lamp, pal.lit * 0.85)); roof(cx + lean, y - 3 - wh - 8, Math.floor(ww / 2) + 8, 8, rc, null); y = y - 3 - wh - 8 + 3; cx += lean; }
    R(cx - 2, y - 14, 3, 14, bk); line(cx, y - 14, cx - 6, y - 22, bk); line(cx + 1, y - 14, cx + 8, y - 18, bk);
    geo.lamps.push({ x: 112, y: GY - 10 });
    const gx = 292; R(gx - 22, GY - 40, 6, 40, bk); R(gx + 16, GY - 40, 6, 40, bk); R(gx - 22, GY - 40, 1, 40, bl); R(gx + 16, GY - 40, 1, 40, bl);
    R(gx - 26, GY - 46, 20, 4, bk); R(gx - 26, GY - 46, 20, 1, edge); line(gx - 6, GY - 46, gx + 6, GY - 36, bk, 3); R(gx + 14, GY - 46, 12, 3, bk);
    geo.lamps.push({ x: gx - 12, y: GY - 36 });
    [[200, 52], [372, 60], [440, 44]].forEach(([x, h], i) => { R(x, GY - h, 2, h, bk); R(x - 1, GY - h - 2, 4, 2, pal.gold); geo.flags.push({ x: x + 2, y: GY - h + 1, w: 16 + (i % 2) * 4, h: 22, col: mix(pal.wood, pal.ink, 0.2), ph: i * 1.7 }); });
    [[246, 22], [330, 30]].forEach(([x, h]) => { R(x, GY - h, 2, h, bk); disc(x + 1, GY - h - 3, 3, pal.wall); R(x - 1, GY - h - 3, 1, 1, ink); R(x + 2, GY - h - 3, 2, 1, ink); geo.lamps.push({ x: x + 1, y: GY - h - 3 }); });
  }

  // module bố cục nền đăng ký ở đây (place.js, sect.js thêm các module khác); module trả về hàm thì hàm đó chạy sau khi vẽ mặt đất
  sc.places = sc.places || {};
  sc.places.town = townLayout; sc.places.ruin = ruinLayout;
  sc.groundOf = drawGround;

  // dựng lớp arch (bố cục nền theo cls + mặt đất). Phố công trình bấm được vẽ động ở scene.js, đứng phía trước lớp này.
  sc.paintArch = (pal, T, terr, s, geo, mode) => {
    sc.use(B.arch.begin(mode));
    geo.lamps = []; geo.smokes = []; geo.flags = []; geo.flames = []; geo.rods = [];
    const cls = s.cls, r = mulberry(terr.seed + 900), post = [], style = sc.data.SECT_STYLE[s.sect];
    if (!s.c.dungeon && cls !== 'road' && cls !== 'void') {
      (sc.data.CLS_LAYOUT[cls] || []).forEach(name => { const f = sc.places[name]; if (!f) return; const p = f(pal, T, geo, r, terr, s, style); if (typeof p === 'function') post.push(p); });
    }
    drawGround(pal, T, terr, cls, r);
    post.forEach(f => f());
  };
})();
