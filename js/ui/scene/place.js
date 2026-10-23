// Bố cục nền theo loại nơi (cls): thành, bộ tộc, bến, chợ / thương đoàn, mỏ, linh mạch, bí cảnh, cửa ải, nơi thờ.
// Mỗi module vẽ vào lớp arch (đằng sau phố công trình), cao hơn mái phố nên vẫn nhìn thấy khi có phố. Đăng ký trong sc.places;
// cls nào dùng module nào nằm ở data.js (CLS_LAYOUT).
(function () {
  const sc = window.TT.ui.sc, CFG = sc.CFG, W = CFG.W, GY = CFG.GY, H = CFG.H;
  const { mix, hash, R, P, line, ell, disc } = sc;
  const P_ = sc.places = sc.places || {};

  const stoneCols = (pal, T) => ({ stone: T(mix(pal.wall, pal.m3, 0.35)), lt: T(mix(pal.wall, '#fff', 0.3)), dk: T(mix(pal.wall, pal.m4, 0.55)) });

  // tường thành: gạch, lỗ châu mai
  function wall(x0, x1, top, c, pal) {
    R(x0, top, x1 - x0, GY - top, c.stone); R(x0, top, x1 - x0, 2, c.lt);
    for (let y = top + 6; y < GY; y += 6) R(x0, y, x1 - x0, 1, mix(c.stone, pal.ink, 0.28));
    for (let row = 0; row < Math.floor((GY - top) / 6); row++) for (let x = x0 + (row % 2) * 8; x < x1; x += 16) R(x, top + row * 6, 1, 6, mix(c.stone, pal.ink, 0.3));
    for (let x = x0; x < x1 - 4; x += 10) { R(x, top - 4, 6, 4, c.stone); R(x, top - 4, 6, 1, c.lt); }
  }
  function towerHall(cx, gy, w, tiers, pal, T, geo, rc, opt) {
    let y = gy;
    for (let i = 0; i < tiers; i++) {
      const ww = Math.round(w * Math.pow(0.78, i)), h = sc.hall(cx, y, ww, i === 0 ? 14 : 10, 8, { wall: T(pal.wall), frame: T(mix(pal.wood, pal.ink, 0.5)), stone: T(pal.m3), roofC: rc, door: i === 0 && opt.door, plat: 0, eave: 6, lamps: i === 0 && opt.lamps, orn: i === tiers - 1 ? pal.gold : null }, pal, geo);
      y = h.top + 7;
    }
    return y;
  }

  // ----- thành trì: tường, lầu cổng nhiều tầng, tháp góc, dãy mái ngói phía sau, đèn giăng -----
  P_.city = (pal, T, geo, r, terr) => {
    const c = stoneCols(pal, T), rc = sc.roofCols(pal, 'plain');
    for (let i = 0; i < 9; i++) { const x = 24 + i * 56 + (i % 2) * 8; sc.hall(x, GY - 34, 28 + (i % 3) * 6, 8, 6 + (i % 2), { wall: T(pal.wall), frame: T(pal.woodDk), stone: c.stone, roofC: rc, eave: 5 }, pal, { lamps: [] }); }
    wall(0, W, GY - 32, c, pal);
    const top = towerHall(240, GY - 32, 70, 3, pal, T, geo, rc, { door: false, lamps: true });
    R(222, GY - 22, 36, 22, '#12100c'); ell(240, GY - 22, 18, 7, '#12100c'); R(240, GY - 20, 1, 20, '#2a2218');
    [60, 420].forEach(x => towerHall(x, GY - 32, 36, 2, pal, T, geo, rc, { door: false, lamps: true }));
    for (let x = 90; x < 400; x += 38) if (Math.abs(x - 240) > 50) sc.lantern(x, GY - 28, pal, geo);
    R(240, top - 8, 1, 8, T(pal.gold)); disc(240, top - 9, 2, T(pal.gold));
    [[120, 52], [360, 52]].forEach(([x, h], i) => { R(x, GY - 32 - h, 2, h, T(pal.woodDk)); geo.flags.push({ x: x + 2, y: GY - 32 - h + 1, w: 18, h: 14, col: i ? '#3a78d8' : '#d8302a', ph: i * 2 }); });
  };

  // ----- cửa ải: hai bức tường dày, lầu ải, cờ -----
  P_.gate = (pal, T, geo, r, terr) => {
    const c = stoneCols(pal, T), rc = sc.roofCols(pal, 'plain');
    wall(0, 170, GY - 40, c, pal); wall(310, W, GY - 40, c, pal);
    R(170, GY - 52, 140, 52, c.stone); R(170, GY - 52, 140, 2, c.lt); for (let x = 170; x < 310; x += 10) R(x, GY - 56, 6, 4, c.stone);
    R(214, GY - 30, 52, 30, '#0e0c10'); ell(240, GY - 30, 26, 8, '#0e0c10'); for (let x = 216; x < 264; x += 6) R(x, GY - 30, 1, 30, '#2a2630');
    sc.hall(240, GY - 52, 90, 12, 9, { wall: T(pal.wall), frame: T(pal.woodDk), stone: c.stone, roofC: rc, lamps: true, orn: pal.gold, eave: 7, door: false }, pal, geo);
    [[40, 60], [440, 60]].forEach(([x, h], i) => { R(x, GY - 40 - h, 2, h, T(pal.woodDk)); geo.flags.push({ x: x + 2, y: GY - 40 - h + 1, w: 20, h: 16, col: '#c8362c', ph: i * 1.5 }); });
  };

  // ----- cứ địa bộ tộc: lều da, cột tô-tem, lửa trại -----
  function tent(x, w, h, col, pal, T) {
    const c = T(col), cd = mix(c, pal.ink, 0.35), cl = mix(c, '#ffffff', 0.25);
    for (let i = 0; i < h; i++) { const hw = Math.round(w / 2 * (1 - i / h)); R(x - hw, GY - 1 - i, hw * 2 + 1, 1, i % 4 === 3 ? cd : c); R(x - hw, GY - 1 - i, 1, 1, cl); }
    R(x - 3, GY - 12, 7, 12, '#14100c'); for (let k = 0; k < 4; k++) R(x - w / 4 + k * 6, GY - h + 8, 3, 3, mix(c, '#d8302a', 0.6)); R(x, GY - h - 8, 1, 8, T('#4a3020')); R(x + 1, GY - h - 8, 6, 3, '#d8302a');
  }
  P_.tribe = (pal, T, geo, r) => {
    [[70, 56, 44, '#a88a5a'], [160, 64, 52, '#9a7a4a'], [330, 60, 48, '#b09060'], [420, 52, 42, '#a08050']].forEach(([x, w, h, col]) => tent(x, w, h, col, pal, T));
    const x = 245, base = GY, cols = ['#c8362c', '#ecc873', '#3a8a6a', '#c8362c', '#3a78d8'];
    R(x - 3, base - 76, 7, 76, T('#6a4a2a'));
    cols.forEach((cc, i) => { R(x - 5, base - 72 + i * 14, 11, 8, T(cc)); R(x - 3, base - 70 + i * 14, 2, 2, '#14100c'); R(x + 1, base - 70 + i * 14, 2, 2, '#14100c'); R(x - 2, base - 66 + i * 14, 5, 1, '#14100c'); });
    R(x - 9, base - 66, 5, 3, T('#c8362c')); R(x + 5, base - 66, 5, 3, T('#c8362c'));
    for (let i = 0; i < 6; i++) { const a = i / 6 * 3.14; line(x - 30, base, x - 24 + Math.cos(a) * 8, base - 10 - Math.sin(a) * 4, T('#3a2a1c')); }
    geo.lamps.push({ x: 202, y: GY - 6, c: '#ffa040', always: true }); R(198, GY - 3, 9, 3, '#3a2a1c'); R(200, GY - 7, 5, 4, '#ff8a2a'); R(201, GY - 9, 3, 3, '#ffe08a');
  };

  // ----- bến: mặt nước phía sau, cầu tàu, thuyền buồm -----
  P_.port = (pal, T, geo, r, terr) => {
    const water = mix(pal.jade, pal.m4, 0.5), top = GY - 16;
    R(0, top, W, 16, water); R(0, top, W, 2, mix(pal.cloudLt, water, 0.4));
    for (let i = 0; i < 40; i++) R(Math.floor(hash(i * 3.1) * W), top + 3 + Math.floor(hash(i * 5.3) * 12), 4 + Math.floor(hash(i * 2.2) * 8), 1, mix(water, pal.cloudLt, 0.4));
    const boat = (x, s, col) => {
      R(x, GY - 14 - 6 * s, 2, 40 * s, T('#4a3020')); const sw = (i) => R(x + 2, GY - 14 - 6 * s + i, Math.round((30 - i * 0.5) * s), 1, T(col));
      for (let i = 0; i < 28 * s; i++) sw(i + 2); line(x + 2, GY - 12, x + 2 + 30 * s, GY - 12 - 36 * s, T('#4a3020'));
      R(x - 14 * s, GY - 14, 56 * s, 5, T('#6a4426')); R(x - 12 * s, GY - 9, 52 * s, 2, T('#3a2410'));
    };
    boat(90, 1, '#e8dcc0'); boat(300, 0.8, '#d8b060'); boat(410, 0.9, '#e8dcc0');
    R(150, GY - 8, 90, 3, T('#7a5a34')); for (let x = 154; x < 240; x += 14) { R(x, GY - 8, 3, 12, T('#5a3e22')); }
    geo.lamps.push({ x: 152, y: GY - 14 }); sc.lantern(150, GY - 22, pal, geo);
  };

  // ----- chợ, thương đoàn: dãy cờ hiệu, lán mái sọc, xe hàng -----
  P_.market = (pal, T, geo, r) => {
    ['#d8443a', '#3a8ad8', '#d8b43a', '#3a9a6a', '#8a4ad8'].forEach((col, i) => {
      const x = 50 + i * 90, h = 70 + (i % 2) * 18; R(x, GY - h, 2, h, T('#4a3020')); R(x - 1, GY - h - 2, 4, 2, T(pal.gold));
      geo.flags.push({ x: x + 2, y: GY - h + 2, w: 22, h: 26, col: T(col), ph: i * 1.3 });
    });
    [[28, '#d8443a'], [150, '#3a8ad8'], [290, '#d8b43a'], [410, '#3a9a6a']].forEach(([x, col]) => {
      R(x, GY - 22, 2, 22, T('#5a3e22')); R(x + 28, GY - 22, 2, 22, T('#5a3e22'));
      for (let k = 0; k < 30; k += 5) R(x + k, GY - 30, 5, 8, (k / 5) % 2 ? T(col) : T(mix(col, '#ffffff', 0.55)));
      R(x + 2, GY - 6, 26, 6, T('#3a2a1c')); R(x + 5, GY - 10, 5, 4, T('#c8902a')); R(x + 14, GY - 9, 5, 3, T('#8ab860'));
    });
    R(220, GY - 14, 30, 8, T('#7a5a34')); ell(228, GY - 4, 5, 5, T('#3a2a1c')); ell(244, GY - 4, 5, 5, T('#3a2a1c')); R(214, GY - 12, 8, 2, T('#7a5a34'));
  };

  // ----- mỏ: cửa hầm khung gỗ, xe goòng; linh mạch: trụ linh thạch phát sáng -----
  P_.mine = (pal, T, geo, r, terr) => {
    const rk = T(mix(pal.m3, pal.rockLt, 0.2)), rd = T(mix(pal.m4, pal.ink, 0.3));
    for (let x = 40; x < 330; x++) { const u = (x - 185) / 145, h = Math.round(70 * Math.pow(Math.max(0, 1 - u * u), 0.6) + (hash(x * 0.4) - 0.5) * 4); R(x, GY - h, 1, h, hash(x * 0.9) < 0.3 ? rd : rk); }
    R(155, GY - 34, 60, 34, '#08080c'); ell(185, GY - 34, 30, 10, '#08080c');
    R(150, GY - 44, 5, 44, T('#6a4a2a')); R(215, GY - 44, 5, 44, T('#6a4a2a')); R(148, GY - 48, 74, 5, T('#7a5a34'));
    R(250, GY - 10, 34, 6, T('#5a5a66')); ell(257, GY - 2, 4, 4, '#222'); ell(277, GY - 2, 4, 4, '#222'); R(246, GY - 12, 42, 2, T('#7a5a34')); for (let k = 0; k < 6; k++) R(254 + k * 5, GY - 15, 4, 3, T('#c8a050'));
    geo.lamps.push({ x: 150, y: GY - 40, c: '#ffb070', always: true });
  };
  P_.vein = (pal, T, geo) => {
    for (let i = 0; i < 9; i++) {
      const h = 30 + hash(i * 3.7) * 50, cx = 40 + i * 48 + hash(i) * 12, w = 7 + Math.floor(hash(i * 2.1) * 5);
      for (let r = 0; r < h; r++) { const hw = Math.round(w / 2 * (1 - Math.pow(r / h, 1.6))); R(cx - hw, GY - r, hw * 2 + 1, 1, ['#5ad8ff', '#8ae8ff', '#c8f4ff'][Math.floor(r / 3) % 3]); R(cx - hw, GY - r, 1, 1, '#e8fbff'); }
      geo.lamps.push({ x: cx, y: GY - h * 0.5, c: '#6ae0ff', always: true });
    }
  };

  // ----- bí cảnh: cổng đá và xoáy linh khí -----
  P_.portal = (pal, T, geo) => {
    const x = 240, st = stoneCols(pal, T);
    for (let a = 0; a < 70; a++) { const an = a / 70 * Math.PI * 2; R(x + Math.cos(an) * 30, GY - 52 + Math.sin(an) * 38, 2, 2, a % 2 ? '#b58aff' : '#6ae0ff'); }
    sc.cur().globalAlpha = 0.3; ell(x, GY - 52, 26, 34, '#8a6aff'); ell(x, GY - 52, 16, 22, '#c8b0ff'); sc.cur().globalAlpha = 1;
    [x - 42, x + 36].forEach(px => { R(px, GY - 96, 7, 96, st.stone); R(px, GY - 96, 1, 96, st.lt); R(px + 6, GY - 96, 1, 96, st.dk); });
    R(x - 48, GY - 102, 96, 8, st.stone); R(x - 48, GY - 102, 96, 1, st.lt); sc.glyphs(x - 16, GY - 100, 7, T('#b58aff'));
    geo.lamps.push({ x, y: GY - 52, c: '#b58aff', always: true }); geo.lamps.push({ x: x - 40, y: GY - 98, c: '#6ae0ff', always: true });
  };

  // ----- sân nơi thờ: tường thấp, đèn đá, cây; công trình thờ là nhà bấm được ở phố -----
  P_.courtyard = (pal, T, geo, r, terr) => {
    const c = stoneCols(pal, T), pc = sc.pineCols(pal, T);
    R(0, GY - 8, W, 8, c.stone); R(0, GY - 8, W, 2, c.lt); for (let x = 6; x < W; x += 24) { R(x, GY - 14, 5, 8, c.stone); R(x - 1, GY - 15, 7, 2, c.lt); }
    [[60, 36], [180, 30], [300, 34], [430, 38]].forEach(([x, h]) => { if (terr.tree === 'dead') sc.deadTree(x, GY - 6, h, pal.ink, r, 0.05); else sc.pine(x, GY - 6, h, (r() - 0.5) * 0.3, pc, 1, r); });
    [120, 360].forEach(x => { R(x, GY - 20, 4, 14, c.stone); R(x - 2, GY - 26, 8, 6, c.stone); R(x - 1, GY - 25, 6, 3, T(pal.gold)); R(x - 3, GY - 28, 10, 2, c.lt); geo.lamps.push({ x: x + 2, y: GY - 23 }); });
  };
})();
