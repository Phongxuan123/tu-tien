// Cây và tiền cảnh: tùng nghiêng, tre, cây chết, cỏ, cành rủ; lớp tiền cảnh (over) theo loại cây của địa hình.
(function () {
  const sc = window.TT.ui.sc, CFG = sc.CFG, W = CFG.W, H = CFG.H, GY = CFG.GY, B = sc.B;
  const { mix, hash, mulberry, R, P, line, ell, disc } = sc;

  const pineCols = sc.pineCols = (pal, T) => ({ trunk: mix(pal.rockDk, pal.woodDk, 0.35), n: T(pal.pine), nl: T(pal.pineLt), nd: mix(pal.pine, pal.ink, 0.55) });

  function clump(cx, cy, rx, c, r) {
    const ry = Math.max(2, Math.round(rx * 0.4));
    ell(cx, cy + 1, rx, ry, c.nd); ell(cx, cy, rx, ry, c.n); ell(cx - 1, cy - 1, Math.max(1, rx - 2), Math.max(1, ry - 1), c.nl);
    for (let k = 0; k < rx; k++) { const dxp = Math.round((r() * 2 - 1) * rx); P(cx + dxp, cy + ry + 1, c.nd); if (r() < 0.5) P(cx + dxp, cy + ry + 2, c.nd); }
  }
  sc.clump = clump;

  // tùng nghiêng: thân + các tán dẹt
  sc.pine = (x, y, h, lean, c, k, r) => {
    const tx = i => x + Math.round(lean * i + (hash(x + i * 0.3) - 0.5) * 1.4);
    for (let i = 0; i < h; i++) R(tx(i), y - i, k > 1.2 ? 2 : 1, 1, c.trunk);
    [0.3, 0.52, 0.74, 1].forEach((l, j) => {
      const side = j % 2 ? 1 : -1, hh = Math.round(h * l), cy = y - hh, bx = tx(hh);
      const off = j < 3 ? side * Math.round((4 + j) * k) : 0, cx = bx + off, rx = Math.round((6 - j * 0.9) * k);
      if (off) line(bx, cy + 1, cx, cy, c.trunk);
      clump(cx, cy, Math.max(2, rx), c, r);
    });
  };
  // tùng nhỏ cho núi xa
  sc.bpine = (x, y, h, c) => { R(x, y - h, 1, h, c); ell(x, y - h + 1, 2, 1, c); ell(x, y - Math.round(h * 0.55), 3, 1, c); if (h > 6) ell(x, y - Math.round(h * 0.25), 3, 1, c); };

  sc.deadTree = (x, y, h, c, r, lean) => {
    let cx = x;
    for (let i = 0; i < h; i++) {
      cx = x + Math.round(lean * i + Math.sin(i * 0.35) * 2); R(cx, y - i, 2, 1, c);
      if (i > h * 0.3 && i % 9 === 0) { const s = (i / 9) % 2 ? 1 : -1, L = 6 + Math.floor(r() * 8); line(cx, y - i, cx + s * L, y - i - L * 0.7, c); line(cx + s * L, y - i - L * 0.7, cx + s * (L + 3), y - i - L * 1.3, c); line(cx + s * L * 0.6, y - i - L * 0.4, cx + s * L * 0.6 + s * 2, y - i - L, c); }
    }
    line(cx, y - h, cx - 3, y - h - 6, c); line(cx + 1, y - h, cx + 5, y - h - 5, c);
  };

  function bamboo(x, yb, h, pal, T, lean, thick) {
    const c = T(mix('#7aa860', pal.pine, 0.4)), cl = T('#a8c878'), cd = T(mix(pal.pine, pal.ink, 0.35));
    for (let i = 0; i < h; i++) { const xx = x + Math.round(lean * i); R(xx, yb - i, thick, 1, i % 11 === 0 ? cd : (i % 11 === 1 ? cl : c)); }
    for (let k = 0; k < 4; k++) { const ny = yb - h + k * 9, nx = x + Math.round(lean * (h - k * 9)), s = k % 2 ? 1 : -1; for (let j = 0; j < 3; j++) { line(nx, ny + j * 3, nx + s * 9, ny + 6 + j * 3, cd); line(nx + s * 2, ny + j * 3, nx + s * 8, ny + 2 + j * 3, c); } }
  }
  function tufts(y0, h, seed, density, cols) {
    const r = mulberry(seed);
    for (let i = 0; i < density; i++) { const x = Math.floor(r() * W), y = y0 + Math.floor(r() * h), hh = 2 + Math.floor(r() * 4), c = cols[Math.floor(r() * cols.length)]; R(x, y - hh, 1, hh, c); if (r() < 0.6) R(x + 1, y - hh + 1, 1, hh - 1, c); if (r() < 0.4) R(x - 1, y - hh + 2, 1, hh - 2, c); }
  }
  // cành rủ khung cảnh (lá tùng hoặc cành khô)
  function branch(x0, y0, x1, y1, pal, T, r, dead) {
    const trunk = mix(pal.woodDk, pal.ink, 0.6), pc = sc.pineCols(pal, T);
    line(x0, y0, x1, y1, trunk, 2);
    for (let i = 1; i <= 6; i++) {
      const t = i / 6, bx = x0 + (x1 - x0) * t, by = y0 + (y1 - y0) * t, ex = bx - 6 - r() * 6, ey = by + 8 + r() * 10;
      line(bx, by, ex, ey, trunk);
      if (!dead) clump(Math.round(ex), Math.round(ey), 7, pc, r);
    }
  }

  // tiền cảnh theo loại cây; road: bỏ (đường đi dùng vật thể trượt riêng)
  sc.paintOver = (pal, T, terr, cls, mode) => {
    sc.use(B.over.begin(mode));
    if (cls === 'road' || cls === 'void') return;
    const r = mulberry(terr.seed + 900), pc = sc.pineCols(pal, T), tr = mix(pal.rockDk, pal.woodDk, 0.35);
    if (terr.tree === 'bamboo') {
      [[10, 8, 78], [24, 6, 96], [450, 7, 90], [466, 9, 104], [436, 6, 70]].forEach(([x, l, h]) => bamboo(x, H + 6, h, pal, T, l * 0.004 * (x < 100 ? 1 : -1), 2));
      tufts(H - 16, 16, 5, 90, [T('#6a9a50'), T('#4a7a40'), T('#8ab860'), T(mix(pal.pine, pal.ink, 0.3))]);
      branch(480, 2, 392, 12, pal, T, r, false);
    } else if (terr.tree === 'pine') {
      for (let i = 0; i < H + 10; i++) R(-4 + Math.round(Math.sin(i * 0.05) * 3 + i * 0.02), H - i, 11 - Math.min(4, Math.floor(i / 40)), 1, i % 7 === 0 ? mix(tr, pal.ink, 0.4) : tr);
      [[16, 96, 18], [10, 70, 20], [26, 44, 15]].forEach(([x, y, rx]) => { line(5, y + 8, x, y, tr, 2); clump(x + 6, y - 2, rx, pc, r); });
      clump(30, 20, 20, pc, r); clump(54, 12, 16, pc, r); clump(14, 8, 14, pc, r);
      tufts(H - 8, 8, 9, 30, [T('#6a9a50'), T('#8ab860')]);
      branch(480, 2, 400, 10, pal, T, r, false);
    } else {
      const ink = pal.ink, rk = mix(pal.m4, ink, 0.5);
      [[-6, 40, 60], [14, 28, 34], [440, 46, 52], [462, 30, 62]].forEach(([x, w, h]) => { for (let dx = 0; dx < w; dx++) { const u = Math.abs((dx / w) * 2 - 1), t = Math.round(H - h * Math.pow(1 - Math.pow(u, 1.2), 1) - hash(x + dx) * 3); R(x + dx, t, 1, H - t, dx < w * 0.3 ? mix(rk, pal.rockLt, 0.25) : rk); } });
      sc.deadTree(458, H + 2, 96, ink, r, -0.14); sc.deadTree(20, H + 2, 60, ink, r, 0.12);
      for (let i = 0; i < 40; i++) { const x = Math.floor(r() * W), hh = 2 + Math.floor(r() * 4); line(x, H - 1, x + (r() < 0.5 ? -1 : 1), H - hh, rk); }
    }
    if (terr.ground === 'snow') for (let x = 0; x < W; x += 2) R(x, H - 15 + Math.floor(hash(x * 1.3) * 4), 2, 2, T('#f4f8f8'));
    [[70, 8], [350, 6], [230, 5]].forEach(([x, s]) => { ell(x, H - 3, s, Math.round(s * 0.5), T(mix(pal.m3, pal.m4, 0.3))); ell(x - 2, H - 4, Math.round(s * 0.6), Math.round(s * 0.3), T(pal.rockLt)); });
  };

  // vật thể ven đường (trượt khi đi): vẽ thẳng mỗi khung, rẻ vì chỉ vài khối
  sc.drawRoadside = (ctx, pal, T, terr, x0) => {
    sc.use(ctx);
    const tuft = T(mix(pal.pine, pal.pineLt, 0.4)), st = T(mix(pal.m3, pal.rockLt, 0.4)), span = W + 80;
    for (let i = 0; i < 12; i++) {
      const wx = hash(i * 7.7 + terr.seed) * span * 1.6, x = Math.round((((wx - x0) % (span * 1.6)) + span * 1.6) % (span * 1.6)) - 40;
      if (x < -40 || x > W + 10) continue;
      const k = i % 4, y = GY + 14 + (i % 3) * 3;
      if (k === 0) { R(x, y - 9, 1, 9, tuft); R(x + 2, y - 6, 1, 6, tuft); R(x - 2, y - 5, 1, 5, tuft); }
      else if (k === 1) { ell(x, y - 2, 6, 3, st); ell(x - 1, y - 3, 4, 2, T(pal.rockLt)); }
      else if (k === 2) { R(x, y - 22, 2, 22, T(pal.woodDk)); R(x - 6, y - 20, 14, 7, T(pal.wood)); R(x - 4, y - 18, 10, 1, T(pal.gold)); R(x - 4, y - 16, 6, 1, T(pal.gold)); }
      else { R(x, y - 5, 1, 5, tuft); R(x + 1, y - 7, 1, 7, tuft); R(x + 3, y - 4, 1, 4, tuft); }
    }
  };
})();
