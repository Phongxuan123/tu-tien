// Địa thế: núi đá dựng đứng kiểu Quế Lâm (lớp xa, lớp giữa, vách hai bên), đỉnh lơ lửng có rễ đá và thác.
// Mọi lớp xa rộng TW và lặp được, nên khi đi đường cảnh trượt liên tục.
(function () {
  const sc = window.TT.ui.sc, CFG = sc.CFG, TW = CFG.TW, PAD = CFG.PAD, B = sc.B;
  const { mix, hash, mulberry, lerp, R, P, line, ell, disc } = sc;

  // thân một tháp đá: style 'pillar' (cột), 'spire' (nhọn), 'mesa' (bàn); sx = hạt giống theo x gốc để hai bản lặp giống nhau
  function tower(x, base, w, h, style, c, r, sx) {
    sx = sx === undefined ? x : sx;
    const tops = new Array(w), nl = 3 + Math.floor(r() * 3), ledges = [];
    for (let i = 0; i < nl; i++) ledges.push(base - h * (0.15 + r() * 0.65));
    for (let dx = 0; dx < w; dx++) {
      const u = ((dx + 0.5) / w) * 2 - 1, a = Math.abs(u);
      const f = style === 'spire' ? 1 - Math.pow(a, 1.35) : style === 'mesa' ? Math.pow(Math.max(0, 1 - Math.pow(a, 9)), 0.5) : Math.pow(Math.max(0, 1 - Math.pow(a, 5)), 0.55);
      let top = base - f * h;
      if (style === 'spire') top += (hash(sx * 3.1 + dx * 1.7) - 0.5) * 2.4; else top += (a > 0.55 ? Math.floor(hash(sx + dx * 0.37) * 2.4) : 0);
      if (w > 60) top += Math.sin(dx * 0.09 + sx * 0.3) * 2.5 + Math.sin(dx * 0.23 + sx) * 1.2;
      top = Math.min(Math.round(top), base - 1); tops[dx] = top;
      const sk = hash(Math.floor((sx + dx) * 0.55) * 7.3 + sx * 0.01);
      const col = u < -0.3 ? (sk < 0.35 ? c.lt2 : c.lt) : u > 0.32 ? (sk < 0.45 ? c.dk2 : c.dk) : (sk < 0.22 ? c.dk : sk > 0.8 ? c.lt : c.base);
      if (w > 60) {
        for (let y = top; y < base; y += 4) {
          const n = hash((sx + dx) * 0.37 + Math.floor(y / 4) * 5.1), band = hash(Math.floor(y / 9) * 3.3 + sx * 0.01); let cc = col;
          if (n < 0.13) cc = c.dk; else if (n > 0.86) cc = u > 0.32 ? c.base : c.lt2;
          if (band < 0.22 && y % 9 < 4) cc = mix(cc, c.dk2, 0.5);
          R(x + dx, y, 1, Math.min(4, base - y), cc);
        }
      } else R(x + dx, top, 1, base - top, col);
      if (c.cap) { const ch = 2 + Math.floor(hash(sx + dx * 1.9) * 3); R(x + dx, top, 1, Math.min(ch, base - top), c.cap); if (hash(sx * 2 + dx) < 0.3) P(x + dx, top - 1, c.cap); }
      if (hash(sx + dx * 3.7) < 0.13) { const cs = top + 4 + Math.floor(hash(dx + sx) * h * 0.4), cl = 6 + Math.floor(hash(dx * 2 + sx) * h * 0.4); R(x + dx, cs, 1, Math.min(cl, base - cs), c.dk2); }
      if (c.ember && hash(sx * 1.3 + dx * 5.1) < 0.09) { const es = top + 6 + Math.floor(hash(dx * 3 + sx) * h * 0.5); R(x + dx, es, 1, Math.min(3 + Math.floor(hash(dx + sx * 2) * 5), Math.max(0, base - es)), c.ember); }
    }
    ledges.forEach(y => {
      const s = Math.floor(r() * w * 0.4), e = s + Math.floor(w * (0.3 + r() * 0.55));
      for (let dx = s; dx < Math.min(e, w); dx++) if (tops[dx] < y - 3 && (dx + Math.floor(y)) % 7 !== 0) { P(x + dx, y, c.dk2); P(x + dx, y + 1, c.lt2); }
      if (c.cap && w > 10) for (let k = 0; k < 2; k++) { const dx = s + Math.floor(r() * (e - s)); if (dx < w && tops[dx] < y - 6) sc.bpine(x + dx, y, 3 + Math.floor(r() * 4), c.cap); }
    });
    if (c.snow) for (let dx = 0; dx < w; dx++) { const d = Math.min(3, Math.max(1, Math.round((tops[dx] < base - h * 0.6 ? 3 : 1)))); R(x + dx, tops[dx], 1, d, c.snow); if (dx > 0 && Math.abs(tops[dx] - tops[dx - 1]) > 1) R(x + dx, tops[dx], 1, 5, c.snow); }
    return tops;
  }
  sc.tower = tower;

  // màu đá theo lớp (key: m1..m4), ct: độ tương phản
  const rockCols = sc.rockCols = (pal, key, ct, terr) => ({
    base: pal[key], lt: mix(pal[key], pal.rockLt, 0.5 * ct), lt2: mix(pal[key], pal.rockLt, 0.85 * ct), dk: mix(pal[key], pal.rockDk, 0.42 * ct), dk2: mix(pal[key], pal.rockDk, 0.66 * ct),
    cap: terr.cap === 'pine' ? mix(pal[key], pal.pine, 0.3 + 0.35 * ct) : null,
    snow: terr.cap === 'snow' ? mix(pal.cloudLt, pal.mist, 0.15) : null,
    ember: terr.cap === 'ember' ? mix('#ff7a3a', pal.lamp, 0.3) : null
  });

  function genTowers(r, o) {
    const a = [], step = TW / o.n;
    for (let i = 0; i < o.n; i++) a.push({ x: Math.round(i * step + (r() - 0.5) * step * 0.9), w: Math.round(lerp(o.w[0], o.w[1], r())), h: Math.round(lerp(o.h[0], o.h[1], Math.pow(r(), 0.8))), st: o.st[Math.floor(r() * o.st.length)], s: Math.floor(r() * 1000) });
    return a.sort((p, q) => q.h - p.h);
  }
  const geoCache = {};
  sc.geoFor = terr => geoCache[terr.id] || (geoCache[terr.id] = (() => { const r = mulberry(terr.seed); return { far: genTowers(r, terr.far), mid: genTowers(r, terr.mid) }; })());

  // một lớp tháp lặp quanh TW
  function paintTowerLayer(buf, pal, terr, list, key, ct, base, mistA, tinyPine, mode) {
    sc.use(buf.begin(mode));
    const c = rockCols(pal, key, ct, terr);
    list.forEach(t => {
      [0, TW, -TW].forEach(o => {
        const xx = t.x + o; if (xx + t.w < 0 || xx > TW) return;
        const tops = tower(xx, base, t.w, t.h, t.st, c, mulberry(t.s), t.x);
        if (tinyPine && terr.cap !== 'ember') { const rp = mulberry(t.s + 1), m = mix(pal.pine, pal[key], 0.45), n = Math.floor(t.w / 7); for (let i = 0; i < n; i++) { const dx = 2 + Math.floor(rp() * (t.w - 4)); if (t.st !== 'spire' && tops[dx] < base - 8) sc.bpine(xx + dx, tops[dx] + 1, 4 + Math.floor(rp() * 5), m); } }
      });
    });
    const g = sc.cur(); g.globalCompositeOperation = 'source-atop';
    for (let i = 0; i < 7; i++) { g.globalAlpha = mistA * Math.pow(i / 6, 1.05); g.fillStyle = pal.mist; g.fillRect(0, 14 + i * 17, TW, 18); }
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  }
  sc.paintFar = (pal, terr, mode) => paintTowerLayer(B.far, pal, terr, sc.geoFor(terr).far, 'm1', 0.35, 116, 0.7 * terr.mistK, false, mode);
  sc.paintMid = (pal, terr, mode) => paintTowerLayer(B.mid, pal, terr, sc.geoFor(terr).mid, 'm2', 0.6, 124, 0.45 * terr.mistK, true, mode);

  // đỉnh lơ lửng: đỉnh bàn, thân treo ngược, rễ đá, cây, đình; thác ghi vào geo.falls
  sc.paintFloat = (pal, T, terr, geo, mode) => {
    sc.use(B.flt.begin(mode)); geo.falls = [];
    const cc = rockCols(pal, 'm3', 0.9, terr), list = [];
    terr.flt.forEach((f, i) => { list.push({ f, o: 0, i }); list.push({ f: Object.assign({}, f, { x: f.x + 480, w: Math.round(f.w * 0.85), up: Math.round(f.up * 0.9), pav: 0 }), o: 480, i: i + 10 }); });
    list.forEach(({ f, i }) => {
      const r = mulberry(70 + i * 13 + terr.seed), x0 = f.x - Math.floor(f.w / 2);
      [0, TW, -TW].forEach(o => {
        const xo = x0 + o; if (xo + f.w < 0 || xo > TW) return;
        const rr = mulberry(70 + i * 13 + terr.seed), tops = tower(xo, f.y, f.w, f.up, 'mesa', cc, rr, x0);
        for (let dx = 0; dx < f.w; dx++) { // thân treo ngược
          const u = (dx + 0.5) / f.w * 2 - 1, a = Math.abs(u), d = Math.round(f.down * Math.pow(Math.max(0, 1 - Math.pow(a, 1.5)), 1.1) + (hash(f.x + dx) - 0.5) * 3);
          R(xo + dx, f.y, 1, Math.max(1, d), u < -0.25 ? cc.lt : u > 0.3 ? cc.dk2 : cc.dk);
        }
        for (let k = 0; k < 6; k++) { // rễ đá treo
          const rx = xo + 3 + Math.floor(rr() * (f.w - 6)), L = 8 + Math.floor(rr() * 14); let xx = rx; const u = (rx - xo) / f.w * 2 - 1, y0 = f.y + Math.round(f.down * Math.pow(Math.max(0, 1 - Math.pow(Math.abs(u), 1.5)), 1.1));
          for (let q = 0; q < L; q++) { if (q % 5 === 4) xx += rr() < 0.5 ? -1 : 1; R(xx, y0 + q, q < L * 0.5 ? 2 : 1, 1, cc.dk2); }
        }
        for (let k = 0; k < 5; k++) {
          const dx = 3 + Math.floor(rr() * (f.w - 6));
          if (terr.tree === 'dead') sc.deadTree(xo + dx, tops[dx] + 1, 8 + Math.floor(rr() * 6), pal.ink, rr, (rr() - 0.5) * 0.3);
          else if (!(f.pav && Math.abs(dx - f.w / 2) < 9)) sc.pine(xo + dx, tops[dx] + 1, 9 + Math.floor(rr() * 7), (rr() - 0.5) * 0.5, sc.pineCols(pal, T), 0.6, rr);
        }
        if (f.pav) sc.hall(xo + Math.floor(f.w / 2), tops[Math.floor(f.w / 2)] + 1, 14, 7, 6, { plat: 0, eave: 4, lamps: 0, stone: mix(pal.wall, pal.m3, 0.45), wall: pal.wall, frame: pal.wood, roofC: sc.roofCols(pal, 'plain') }, pal, { lamps: [] });
      });
      if (f.fall) geo.falls.push({ x: x0 + f.w - 8, y: f.y - 1 });
    });
    const g = sc.cur(); g.globalCompositeOperation = 'source-atop'; g.globalAlpha = 0.1; g.fillStyle = pal.mist; g.fillRect(0, 0, TW, CFG.H); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  };

  // vách đá lớn hai bên khung cảnh (cố định, không trượt theo đường đi)
  sc.paintNear = (pal, T, terr, mode) => {
    sc.use(B.near.begin(mode));
    const cl = [{ x: -8, w: 66, h: 86 }, { x: 428, w: 100, h: 64 }], c = rockCols(pal, 'm3', 1, terr), pc = sc.pineCols(pal, T);
    cl.forEach((n, i) => {
      const r = mulberry(300 + i * 17 + terr.seed), tops = tower(n.x + PAD, 140, n.w, n.h, 'mesa', c, r);
      for (let k = 0; k < 5; k++) { // vách đá: các vệt dọc sáng / tối
        const dx = 3 + Math.floor(r() * (n.w - 6)), top = tops[dx] + 4, L = 8 + Math.floor(r() * 24); R(n.x + PAD + dx, top, 1, L, mix(c.base, c.dk2, 0.7)); R(n.x + PAD + dx + 1, top + 1, 1, L - 2, c.lt);
      }
      for (let k = 0; k < 4; k++) {
        const dx = Math.floor(n.w * (k / 4) + r() * n.w / 4), x = n.x + PAD + dx, side = (n.x < CFG.W / 2) ? 1 : -1;
        if (dx >= n.w) continue;
        if (terr.tree === 'dead') sc.deadTree(x, tops[dx] + 1, 18 + Math.floor(r() * 12), pal.ink, r, side * 0.25);
        else sc.pine(x, tops[dx] + 1, 18 + Math.floor(r() * 14), side * (0.2 + r() * 0.35), pc, 1.25, r);
      }
    });
    const g = sc.cur(); g.globalCompositeOperation = 'source-atop'; g.globalAlpha = 0.14; g.fillStyle = pal.mist; g.fillRect(0, 0, B.near.w, CFG.H); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
  };

  // thác nước (động): off = độ trượt của lớp đỉnh lơ lửng
  sc.drawFalls = (ctx, pal, t, off, terr, geo) => {
    sc.use(ctx);
    const col = terr.fallCol || mix(pal.cloudLt, pal.jade, 0.12), hi = terr.fallCol ? '#ffd8a0' : mix(col, '#ffffff', 0.7), y1 = terr.seaY + 8;
    (geo.falls || []).forEach(f => {
      const x = Math.round((((f.x - off) % TW) + TW) % TW);
      [x, x - TW].forEach(xx => {
        if (xx < -12 || xx > CFG.W + 12) return;
        for (let y = f.y; y < y1; y++) {
          const u = (y - f.y) / (y1 - f.y), w = u < 0.08 ? 3 : u < 0.7 ? 4 : 5, o = Math.round(Math.sin(y * 0.22 + t * 0.6) * 0.7);
          ctx.globalAlpha = (1 - Math.pow(u, 2.6)) * 0.97; ctx.fillStyle = col; ctx.fillRect(xx + o, y, w, 1);
          ctx.fillStyle = (((y + Math.floor(t * 38)) % 8) < 3) ? hi : mix(col, '#ffffff', 0.35); ctx.fillRect(xx + o + 1, y, w - 2, 1);
          ctx.globalAlpha *= 0.55; ctx.fillStyle = mix(pal.m3, pal.ink, 0.3); ctx.fillRect(xx + o - 1, y, 1, 1);
        }
        ctx.globalAlpha = 0.5; for (let k = 0; k < 5; k++) { const ph = t * 0.9 + k * 1.3; disc(xx + 2 + Math.round(Math.sin(ph) * 6), y1 - 3 + Math.round(Math.cos(ph) * 2), 3 + (k % 3), terr.fallCol ? '#ff9a70' : pal.cloudLt); }
        ctx.globalAlpha = 0.6; for (let k = 0; k < 3; k++) disc(xx + 1 + k * 2 - 2, f.y + 1, 1, hi);
        ctx.globalAlpha = 1;
      });
    });
  };
})();
