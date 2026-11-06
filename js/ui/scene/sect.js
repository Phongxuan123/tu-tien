// Chín tông môn: khung chung (vách đá hai bên, nền đá, bậc đá dài, sơn môn) + MỘT công trình đặc trưng riêng mỗi tông + lớp nhấn nền động.
// Kiểu từng tông nằm ở data.js (SECT_STYLE, khóa theo id tông). Thêm tông mới: thêm dòng dữ liệu + một hàm vào LAND bên dưới.
(function () {
  const sc = window.TT.ui.sc, CFG = sc.CFG, W = CFG.W, GY = CFG.GY, H = CFG.H;
  const { mix, hash, mulberry, R, P, line, ell, disc } = sc;

  const steel = (pal, T) => { const st = T(mix('#8fa6bc', pal.m3, 0.1)); return { st, hi: mix(st, '#ffffff', 0.6), sh: mix(st, pal.m4, 0.5) }; };

  // bậc đá dài lên núi + sơn môn (từ demo-tongmon); gy = mặt nền điện phía trên
  function stairsGate(S, pal, T, geo, o) {
    const { mc, stone, stoneLt: lt, stoneDk: dk, gy } = S, sx0 = 190, sx1 = 292, sy0 = GY - 2, sy1 = gy + 1, sf = x => sy0 - (x - sx0) * (sy0 - sy1) / (sx1 - sx0);
    for (let x = sx0; x < sx1; x++) { const yy = Math.round(sf(Math.floor((x - sx0) / 6) * 6 + sx0)); for (let y = yy; y < 134; y += 4) { const n = hash(x * 0.41 + y * 0.13); R(x, y, 1, Math.min(4, 134 - y), n < 0.2 ? mc.dk2 : n > 0.85 ? mc.lt : (x - sx0) < 14 ? mc.base : mc.dk); } }
    for (let x = sx0; x < sx1; x += 6) { const yy = Math.round(sf(x)); R(x, yy, 6, 2, lt); R(x, yy + 2, 6, 2, dk); R(x, yy + 2, 1, 2, stone); }
    sc.rail(sx0, sy0 - 4, sx1, sy1 - 4, 5, stone, lt, 12);
    const gx = 238, py = x => Math.round(sf(Math.floor((x - sx0) / 6) * 6 + sx0));
    [gx - 12, gx + 6].forEach(x => { R(x, py(x) - 30, 5, 34, T(mix(pal.wall, '#fff', 0.2))); R(x, py(x) - 30, 1, 34, lt); R(x + 4, py(x) - 30, 1, 34, dk); R(x - 1, py(x) - 1, 7, 2, dk); R(x - 1, py(x) - 33, 7, 3, stone); if (o.tip) { R(x + 1, py(x) - 36, 3, 3, lt); R(x + 2, py(x) - 38, 1, 2, lt); } });
    R(gx - 15, py(gx) - 40, 29, 4, T(pal.wood)); R(gx - 15, py(gx) - 44, 29, 1, T(pal.gold));
    sc.roof(gx - 1, py(gx) - 52, 19, 7, S.rc, T(pal.gold));
    R(gx - 6, py(gx) - 31, 11, 8, T(pal.woodDk)); R(gx - 5, py(gx) - 30, 9, 6, T(pal.ink)); sc.glyphs(gx - 4, py(gx) - 29, 2, T(pal.gold));
    sc.lantern(gx - 16, py(gx) - 36, pal, geo); sc.lantern(gx + 10, py(gx) - 36, pal, geo);
    [140, 170].forEach(x => { R(x, GY - 14, 3, 14, stone); R(x - 2, GY - 18, 7, 4, stone); R(x - 1, GY - 17, 5, 2, T(pal.gold)); R(x - 3, GY - 20, 9, 2, lt); R(x - 1, GY - 22, 5, 2, stone); geo.lamps.push({ x: x + 1.5, y: GY - 16 }); });
    const bal = (x0, x1) => { R(x0, GY - 8, x1 - x0, 2, lt); R(x0, GY - 6, x1 - x0, 1, dk); for (let x = x0; x < x1; x += 12) { R(x, GY - 10, 3, 11, stone); R(x - 1, GY - 11, 5, 2, lt); } };
    bal(0, 120);
  }

  // khung chung: vách trái (x lx, rộng lw) cao lh, vách phải + nền điện; trả về các màu và độ cao nền
  function stage(pal, T, geo, r, terr, style, o) {
    o = o || {};
    const stone = T(mix(pal.wall, pal.m3, 0.3)), stoneLt = T(mix(pal.wall, '#fff', 0.35)), stoneDk = T(mix(pal.wall, pal.m4, 0.55));
    const mc = sc.rockCols(pal, 'm4', 1, terr), rc = sc.roofCols(pal, style.roof), pc = sc.pineCols(pal, T);
    const lx = o.lx === undefined ? 30 : o.lx, lw = o.lw || 100, tl = sc.tower(lx, 134, lw, o.lh || 56, 'mesa', mc, mulberry(91 + (o.seed || 0)));
    const tr = sc.tower(284, 136, 200, 70, 'mesa', mc, mulberry(92 + (o.seed || 0)));
    let ly = 999; for (let k = 10; k < lw - 10; k++) ly = Math.min(ly, tl[k]); ly += 1;
    let gy = 999; for (let k = 20; k < 190; k++) gy = Math.min(gy, tr[k]); gy += 1;
    R(296, gy - 2, 184, 3, stone); R(296, gy - 2, 184, 1, stoneLt);
    const oh = { stone, stoneLt, wall: T(pal.wall), frame: T(pal.wood), roofC: rc, plat: 1, lamps: 1, door: 1, orn: T(pal.gold), gold: T(pal.gold), eave: 7 };
    return { stone, stoneLt, stoneDk, mc, rc, pc, tl, tr, lx, lw, ly, gy, oh };
  }
  const finish = (S, pal, T, geo, r, o) => { sc.pine(300, S.tr[16] + 1, 20, -0.3, S.pc, 1.15, r); sc.pine(476, S.tr[190] + 1, 18, 0.3, S.pc, 1.05, r); stairsGate(S, pal, T, geo, o || {}); };

  const LAND = {
    // ---------- Kim Phong Môn: đại kiếm cắm đỉnh núi, kiếm trủng, tháp kiếm ----------
    dai_kiem(pal, T, geo, r, terr, style) {
      const S = stage(pal, T, geo, r, terr, style), sw = { st: T('#aebfd4'), hi: '#f4fbff', sh: T('#5a7088') }, { gy, tl } = S;
      const pt = sc.pagoda(80, tl[50] + 1, 20, 3, { stone: S.stone, wall: T(pal.wall), frame: S.oh.frame, roofC: S.rc, gold: T(pal.gold) }, pal, geo);
      R(79, pt - 26, 3, 20, sw.hi); R(81, pt - 26, 1, 20, sw.st); P(80, pt - 28, sw.hi); R(76, pt - 9, 9, 2, T(pal.gold));
      for (const dx of [4, 12, 92, 96]) sc.pine(30 + dx, tl[dx] + 1, 14 + Math.floor(r() * 8), (dx < 50 ? -1 : 1) * 0.3, S.pc, 0.95, r);
      const gxs = 392;
      for (let y = 16; y < gy + 4; y++) { // lưỡi đại kiếm
        const ol = mix(sw.sh, pal.ink, 0.6); R(gxs - 7, y, 1, 1, ol); R(gxs + 6, y, 1, 1, ol); R(gxs - 6, y, 12, 1, sw.st); R(gxs - 6, y, 3, 1, sw.hi); R(gxs + 3, y, 3, 1, sw.sh); R(gxs - 1, y, 2, 1, mix(sw.st, sw.sh, 0.55));
        if ((y - 16) % 11 === 5) { P(gxs, y, pal.jade); P(gxs - 3, y, pal.jade); P(gxs + 3, y, pal.jade); }
      }
      R(gxs - 16, 12, 33, 4, T(pal.gold)); R(gxs - 16, 10, 3, 3, T(pal.gold)); R(gxs + 15, 10, 3, 3, T(pal.gold)); R(gxs - 16, 15, 33, 1, mix(T(pal.gold), pal.ink, 0.4)); disc(gxs, 14, 2, pal.jade);
      R(gxs - 2, 3, 5, 9, T(pal.woodDk)); for (let y = 4; y < 12; y += 2) R(gxs - 2, y, 5, 1, T(pal.gold)); disc(gxs, 2, 3, T(pal.gold));
      geo.lamps.push({ x: gxs, y: 30 }); geo.lamps.push({ x: gxs, y: 52 });
      const small = (x, L, lean) => { for (let i = 0; i < L; i++) { const xx = x + Math.round(lean * i); R(xx, gy - 1 - i, 1, 1, sw.hi); R(xx + 1, gy - 1 - i, 1, 1, sw.st); } const hx = x + Math.round(lean * L), hy = gy - 1 - L; R(hx - 2, hy, 5, 1, T(pal.gold)); R(hx, hy - 3, 1, 3, T(pal.woodDk)); P(hx, hy - 4, T(pal.gold)); };
      [[354, 14, -0.1], [362, 20, 0.05], [372, 12, 0.1], [412, 18, -0.05], [422, 13, 0.1], [432, 21, -0.08], [444, 14, 0.06], [456, 18, 0], [468, 12, 0.1]].forEach(a => small(a[0], a[1], a[2]));
      const h1 = sc.hall(322, gy, 44, 13, 9, Object.assign({}, S.oh), pal, geo); R(322, h1.top - 8, 1, 8, sw.hi); P(322, h1.top - 9, sw.hi);
      finish(S, pal, T, geo, r, { tip: 1 });
    },
    // ---------- Bách Thảo Môn: đan đỉnh có lửa, vườn dược liệu bậc thang, Dược Các hồ lô ----------
    dan_dinh(pal, T, geo, r, terr, style) {
      const S = stage(pal, T, geo, r, terr, style, { lx: 14, lw: 150, lh: 58, seed: 4 }), { gy, tl } = S, ly = S.ly;
      S.oh.wall = T(mix(pal.wall, '#f8e0b0', 0.3));
      R(18, ly - 1, 142, 2, T(mix('#7a5a38', pal.m4, 0.2)));
      const pt = sc.pagoda(48, ly, 18, 3, { stone: S.stone, wall: S.oh.wall, frame: S.oh.frame, roofC: S.rc, gold: T(pal.gold) }, pal, geo);
      disc(48, pt - 6, 3, T('#c8402a')); disc(48, pt - 11, 2, T('#c8402a')); P(47, pt - 12, T('#ffd8a0'));
      const ling = (x, y, s) => { R(x, y - s * 2, Math.max(1, Math.round(s / 2)), s * 2, T(pal.wall)); ell(x, y - s * 2, Math.round(s * 1.6), Math.round(s * 0.9), T('#b8301c')); ell(x - 1, y - s * 2 - 1, Math.round(s), Math.max(1, Math.round(s * 0.5)), T('#e0603c')); P(x - s, y - s * 2, T('#ffe8c8')); P(x + 1, y - s * 2 - 1, T('#ffe8c8')); P(x + s, y - s * 2, T('#ffe8c8')); };
      [[84, 3], [96, 2], [108, 3], [122, 2], [134, 3], [146, 2]].forEach(a => ling(a[0], ly, a[1]));
      for (let x = 80; x < 158; x += 5) { P(x, ly - 2 - (x % 3), T(['#e87aa8', '#f4d060', '#a07ae8'][(x / 5 | 0) % 3])); P(x + 1, ly - 3, T('#4f9a4a')); }
      R(70, ly - 12, 2, 12, T(pal.woodDk)); R(150, ly - 12, 2, 12, T(pal.woodDk)); R(70, ly - 13, 82, 1, T(pal.woodDk));
      for (let x = 76; x < 148; x += 8) { R(x, ly - 12, 1, 5, T('#c8902a')); disc(x, ly - 6, 1, T('#d8a040')); }
      sc.pine(24, tl[10] + 1, 16, -0.25, S.pc, 1, r);
      // vườn bậc thang xanh dưới vách trái (nhìn thấy qua khe phố)
      for (let i = 0; i < 4; i++) R(14 + i * 6, ly + 6 + i * 9, 130 - i * 8, 3, T(mix('#4f9a4a', pal.m4, 0.25)));
      const brz = T(mix('#a8743a', pal.m3, 0.15)), bl = mix(brz, '#ffe0a0', 0.45), bd = mix(brz, pal.ink, 0.55), gd = T(pal.gold);
      const cauldron = (x, y, k) => {
        const w = Math.round(18 * k), h = Math.round(14 * k);
        [-0.75, -0.2, 0.55].forEach(f => { R(x + Math.round(w * f) - 2, y - 8, 4, 8, bd); R(x + Math.round(w * f) - 2, y - 8, 1, 8, brz); });
        ell(x, y - h - 4, w, h, bd); ell(x - 1, y - h - 5, w - 1, h - 1, brz); ell(x - 5, y - h - 8, Math.round(w * 0.5), Math.round(h * 0.45), bl);
        R(x - w - 2, y - 2 * h - 6, w * 2 + 5, 4, brz); R(x - w - 2, y - 2 * h - 6, w * 2 + 5, 1, bl); R(x - w - 2, y - 2 * h - 3, w * 2 + 5, 1, bd);
        ell(x, y - 2 * h - 6, w - 2, 3, '#3a1008'); ell(x, y - 2 * h - 6, w - 5, 2, mix('#ff6a2a', '#ffd060', 0.4));
        [-1, 1].forEach(sg => { R(x + sg * (w + 3) - (sg < 0 ? 3 : 0), y - 2 * h - 12, 3, 9, brz); R(x + sg * (w + 3) - (sg < 0 ? 3 : 0), y - 2 * h - 12, 3, 2, bl); });
        for (let i = -w + 4; i < w - 3; i += 4) { R(x + i, y - h - 4, 2, 1, gd); R(x + i + 1, y - h - 1, 1, 2, gd); }
        geo.flames.push({ x, y: y - 2 * h - 6, w: w * 1.3 }); geo.lamps.push({ x, y: y - 2 * h - 12 }); geo.lamps.push({ x, y: y - h }); geo.smokes.push({ x: x + 3, y: y - 2 * h - 14 });
      };
      R(318, gy - 5, 54, 4, S.stone); R(318, gy - 5, 54, 1, S.stoneLt); R(324, gy - 8, 42, 3, S.stoneDk);
      cauldron(345, gy - 8, 1.25);
      const h1 = sc.hall(432, gy, 58, 14, 10, Object.assign({}, S.oh, { eave: 8 }), pal, geo); R(432, h1.top - 7, 1, 7, T(pal.gold)); disc(432, h1.top - 8, 2, T('#c8402a'));
      cauldron(396, gy, 0.55);
      R(470, gy - 22, 4, 22, S.stoneDk); geo.smokes.push({ x: 472, y: gy - 24 });
      finish(S, pal, T, geo, r, { tip: 0 });
    },
    // ---------- Âm Hồn Giáo: tháp xương, cờ chiêu hồn, đèn ma xanh ----------
    thap_xuong(pal, T, geo, r, terr, style) {
      const S = stage(pal, T, geo, r, terr, style, { seed: 8 }), { gy, tl } = S, bone = T(mix(pal.wall, '#e8e0d0', 0.4)), bd = mix(bone, pal.ink, 0.55), ink = pal.ink;
      const ghost = (x, y) => geo.lamps.push({ x, y, c: '#7af4dc', always: true });
      // tháp xương bên phải: các tầng thu nhỏ, hàng sọ
      let y = gy - 2, w = 56; const bx = 392;
      for (let i = 0; i < 5; i++) {
        const h = 16; R(bx - w / 2, y - h, w, h, bone); R(bx - w / 2, y - h, w, 2, mix(bone, '#fff', 0.35)); R(bx - w / 2, y - 2, w, 2, bd);
        for (let k = 0; k < Math.floor(w / 9); k++) { const sx = bx - w / 2 + 4 + k * 9; disc(sx + 3, y - 9, 3, mix(bone, '#fff', 0.2)); R(sx + 1, y - 9, 1, 2, ink); R(sx + 4, y - 9, 1, 2, ink); R(sx + 2, y - 5, 3, 1, ink); }
        R(bx - w / 2 - 3, y - h - 2, w + 6, 3, mix(S.rc.t, ink, 0.4)); for (let k = 0; k < 4; k++) { R(bx - w / 2 - 3 + k * Math.floor((w + 6) / 4), y - h - 6, 2, 4, bd); }
        y -= h + 3; w = Math.round(w * 0.8);
      }
      R(bx, y - 18, 2, 18, bd); line(bx + 1, y - 18, bx + 1, y - 26, bone); ghost(bx + 1, y - 22);
      [bx - 24, bx + 24].forEach(x => { ghost(x, gy - 40); R(x, gy - 40, 1, 40, bd); });
      // cờ chiêu hồn rách + đèn ma dọc nền
      [[330, 70], [452, 62], [300, 54]].forEach(([x, h], i) => { R(x, gy - h, 2, h, bd); R(x - 1, gy - h - 2, 4, 2, T(pal.gold)); geo.flags.push({ x: x + 2, y: gy - h + 1, w: 20, h: 26, col: mix('#6a2a8a', ink, 0.3), ph: i * 1.9 }); });
      for (let x = 310; x < 470; x += 26) { R(x, gy - 10, 2, 10, bd); ghost(x + 1, gy - 12); }
      // pagoda đổ bên trái, nghiêng, mái đen
      const pt = sc.pagoda(80, tl[50] + 1, 20, 3, { stone: S.stone, wall: bone, frame: S.oh.frame, roofC: S.rc, gold: T(pal.gold) }, pal, geo);
      R(80, pt - 16, 1, 16, bd); ghost(80, pt - 12);
      [32, 60, 100, 118].forEach(x => { sc.deadTree(x, tl[Math.min(99, Math.max(0, x - 30))] + 1, 12 + Math.floor(r() * 8), ink, r, (r() - 0.5) * 0.3); });
      const h1 = sc.hall(322, gy, 44, 13, 9, Object.assign({}, S.oh, { wall: bone }), pal, geo); R(322, h1.top - 8, 1, 8, bd); disc(322, h1.top - 10, 3, bone); R(320, h1.top - 11, 1, 2, ink); R(323, h1.top - 11, 1, 2, ink);
      finish(S, pal, T, geo, r, { tip: 0 });
    },
    // ---------- Thủy Nguyệt Cung: cung điện trên mặt biển, cầu cong, lầu ngắm trăng ----------
    cung_bien(pal, T, geo, r, terr, style) {
      const stone = T(mix(pal.wall, pal.m3, 0.3)), lt = T(mix(pal.wall, '#fff', 0.4)), dk = T(mix(pal.wall, pal.m4, 0.55)), rc = sc.roofCols(pal, style.roof), deck = 96;
      const oh = { stone, stoneLt: lt, wall: T(pal.wall), frame: T(mix(pal.wood, '#2a4a80', 0.5)), roofC: rc, plat: 0, lamps: 1, door: 1, orn: T(pal.gold), gold: T(pal.gold), eave: 8 };
      // bệ nổi trên cọc đá giữa nước
      R(150, deck, 330, 4, stone); R(150, deck, 330, 1, lt); R(150, deck + 3, 330, 1, dk);
      for (let x = 156; x < 478; x += 22) { R(x, deck + 4, 5, GY - deck - 2, dk); R(x, deck + 4, 1, GY - deck - 2, stone); }
      for (let x = 150; x < 478; x += 12) { R(x, deck - 6, 3, 7, stone); R(x - 1, deck - 7, 5, 2, lt); } R(150, deck - 5, 330, 2, lt);
      const h1 = sc.hall(320, deck - 6, 92, 18, 12, oh, pal, geo); R(320, h1.top - 8, 1, 8, T(pal.gold)); disc(320, h1.top - 9, 2, T(pal.gold));
      sc.hall(200, deck - 6, 40, 12, 9, Object.assign({}, oh, { lamps: 0, door: 0, eave: 6 }), pal, geo);
      sc.pagoda(440, deck - 6, 24, 5, { stone, wall: T(pal.wall), frame: oh.frame, roofC: rc, gold: T(pal.gold) }, pal, geo);
      // cầu cong bắc từ bờ trái
      for (let x = 20; x <= 150; x++) { const u = (x - 20) / 130, y = Math.round(GY - 6 - Math.sin(u * Math.PI) * 24 - u * (GY - deck - 6) * 0.0 - u * 10); R(x, y, 1, 3, stone); R(x, y, 1, 1, lt); if (x % 10 === 0) { R(x, y - 6, 2, 6, lt); R(x - 1, y - 7, 4, 1, lt); } if (x % 6 === 0) R(x, y + 3, 1, GY - y - 3, mix(dk, pal.m4, 0.4)); }
      geo.lamps.push({ x: 150, y: deck - 14 }); sc.lantern(148, deck - 22, pal, geo); sc.lantern(480 - 10, deck - 22, pal, geo);
      R(0, GY - 14, 20, 14, T(mix(pal.m4, pal.rockLt, 0.3)));
    },
    // ---------- Thanh Vân Tông: cổng mây, bậc đá dài, rùa đá đội bia ----------
    cong_may(pal, T, geo, r, terr, style) {
      const S = stage(pal, T, geo, r, terr, style, { seed: 2 }), { gy } = S, sh = T(mix(pal.m3, pal.wall, 0.4));
      const pt = sc.pagoda(80, S.tl[50] + 1, 20, 4, { stone: S.stone, wall: T(pal.wall), frame: S.oh.frame, roofC: S.rc, gold: T(pal.gold) }, pal, geo);
      const h1 = sc.hall(380, gy, 84, 14, 9, S.oh, pal, geo); sc.hall(380, h1.top + 7, 46, 9, 8, Object.assign({}, S.oh, { plat: 0, lamps: 0, door: 0 }), pal, geo);
      ell(150, gy + 6, 22, 9, sh); ell(150, gy + 3, 18, 7, T(mix(pal.m3, pal.wall, 0.55))); R(166, gy + 4, 10, 5, sh); ell(176, gy + 4, 4, 3, sh); R(132, gy + 9, 6, 4, sh); R(160, gy + 9, 6, 4, sh);
      R(144, gy - 36, 12, 38, S.stoneLt); R(144, gy - 36, 12, 2, S.stone); R(144, gy - 36, 1, 38, S.stone); sc.glyphs(146, gy - 30, 2, T(pal.gold));
      for (let x = 300; x < 470; x += 34) R(x, gy - 14, 2, 14, S.stoneLt);
      void pt; finish(S, pal, T, geo, r, { tip: 1 });
    },
    // ---------- Huyền Băng Cung: cung băng tinh thể, cột băng ----------
    cung_bang(pal, T, geo, r, terr, style) {
      const S = stage(pal, T, geo, r, terr, style, { seed: 6 }), { gy } = S, ice = T('#bfe4f4'), il = '#f4fcff', id = mix(ice, pal.m4, 0.45);
      const crystal = (x, base, w, h, lean) => { for (let i = 0; i < h; i++) { const hw = Math.max(0, Math.round(w / 2 * (1 - Math.pow(i / h, 1.4)))), xx = x + Math.round(lean * i); R(xx - hw, base - i, hw * 2 + 1, 1, i % 7 === 0 ? mix(ice, il, 0.5) : ice); R(xx - hw, base - i, 1, 1, il); R(xx + hw, base - i, 1, 1, id); } };
      [[330, 14, 60, 0.05], [352, 10, 80, -0.08], [374, 16, 100, 0.02], [398, 12, 72, 0.08], [420, 10, 56, -0.05], [446, 14, 66, 0.04]].forEach(a => crystal(a[0], gy - 1, a[1], a[2], a[3]));
      const h1 = sc.hall(372, gy, 62, 12, 9, Object.assign({}, S.oh, { wall: T('#dcecf4') }), pal, geo); R(372, h1.top - 7, 1, 7, il);
      [60, 100].forEach((x, i) => crystal(x, S.tl[Math.min(99, x)] ? S.ly : S.ly, 12, 36 + i * 10, 0));
      sc.pagoda(80, S.tl[50] + 1, 16, 3, { stone: S.stone, wall: T('#dcecf4'), frame: S.oh.frame, roofC: S.rc, gold: T(pal.gold) }, pal, geo);
      [150, 170].forEach(x => { R(x, GY - 26, 5, 26, ice); R(x, GY - 26, 1, 26, il); R(x + 4, GY - 26, 1, 26, id); });
      finish(S, pal, T, geo, r, { tip: 1 });
    },
    // ---------- Liệt Hỏa Tông: lò luyện trong núi lửa, võ đài ----------
    lo_luyen(pal, T, geo, r, terr, style) {
      const S = stage(pal, T, geo, r, terr, style, { seed: 3 }), { gy } = S, ink = pal.ink, red = T('#a8301f');
      R(326, gy - 36, 128, 36, S.mc.dk); R(326, gy - 36, 128, 2, S.mc.lt); ell(390, gy - 16, 38, 16, '#1a0804'); ell(390, gy - 13, 30, 12, mix('#ff6a2a', '#ffd060', 0.3)); ell(390, gy - 10, 20, 7, '#ffd060');
      geo.flames.push({ x: 390, y: gy - 6, w: 40 }); geo.lamps.push({ x: 390, y: gy - 16, c: '#ff8a3a', always: true }); geo.smokes.push({ x: 392, y: gy - 38 });
      R(322, gy - 40, 136, 5, red); R(322, gy - 40, 136, 1, T('#ff8a5a'));
      sc.hall(472, gy, 34, 12, 9, Object.assign({}, S.oh, { lamps: 0, eave: 5 }), pal, geo);
      // võ đài bên trái
      const ly = S.ly; R(40, ly - 8, 110, 8, S.stone); R(40, ly - 8, 110, 1, S.stoneLt); R(40, ly - 20, 2, 12, red); R(148, ly - 20, 2, 12, red); R(40, ly - 18, 110, 1, red); R(40, ly - 12, 110, 1, red);
      for (let i = 0; i < 3; i++) { R(60 + i * 24, ly - 24, 2, 16, T('#4a3020')); R(55 + i * 24, ly - 24, 12, 2, T('#c8c8d0')); }
      geo.flags.push({ x: 41, y: ly - 56, w: 22, h: 16, col: '#d8302a', ph: 0 }); R(40, ly - 56, 2, 36, T('#4a3020'));
      finish(S, pal, T, geo, r, { tip: 0 });
    },
    // ---------- Nhật Luân Giáo: đài nhật luân, điện bậc thang ----------
    dai_nhat(pal, T, geo, r, terr, style) {
      const S = stage(pal, T, geo, r, terr, style, { seed: 5 }), { gy } = S, gold = T('#e8b838'), gl = '#fff0a0';
      for (let i = 0; i < 3; i++) { const w = 120 - i * 28; R(380 - w / 2, gy - 6 - i * 6, w, 6, i % 2 ? S.stoneLt : S.stone); R(380 - w / 2, gy - 6 - i * 6, w, 1, mix(S.stoneLt, '#fff', 0.4)); }
      const cy = gy - 28; disc(380, cy, 11, gold); disc(380, cy, 8, mix(gold, gl, 0.5)); disc(380, cy, 4, gl);
      for (let a = 0; a < 16; a++) { const an = a / 16 * Math.PI * 2; line(380 + Math.cos(an) * 14, cy + Math.sin(an) * 14, 380 + Math.cos(an) * 20, cy + Math.sin(an) * 20, gold, 2); }
      geo.lamps.push({ x: 380, y: cy, c: '#ffd060', always: true });
      sc.hall(460, gy, 40, 12, 8, Object.assign({}, S.oh, { lamps: 0 }), pal, geo); sc.hall(300, gy, 40, 12, 8, Object.assign({}, S.oh, { lamps: 0 }), pal, geo);
      sc.pagoda(80, S.tl[50] + 1, 20, 3, { stone: S.stone, wall: T(pal.wall), frame: S.oh.frame, roofC: S.rc, gold: gold }, pal, geo);
      finish(S, pal, T, geo, r, { tip: 1 });
    },
    // ---------- Tử Lôi Quan: đạo quán, cột dẫn lôi ----------
    dao_quan(pal, T, geo, r, terr, style) {
      const S = stage(pal, T, geo, r, terr, style, { seed: 7 }), { gy } = S, met = T('#9aa0c0'), mh = '#e8ecff';
      const h1 = sc.hall(372, gy, 66, 14, 9, S.oh, pal, geo); disc(372, h1.top + 20, 4, T(pal.ink)); R(371, h1.top - 8, 2, 8, met);
      [316, 436].forEach(x => { const top = gy - 44; R(x, top, 3, 44, met); R(x, top, 1, 44, mh); R(x - 5, top + 12, 13, 2, met); R(x - 4, top + 24, 11, 2, met); R(x - 3, top + 36, 9, 2, met); R(x - 2, top - 8, 7, 3, met); R(x, top - 14, 2, 6, mh); geo.rods.push({ x: x + 1, y: top - 14 }); geo.lamps.push({ x: x + 1, y: top - 12, c: '#c8b0ff', always: true }); });
      sc.pagoda(80, S.tl[50] + 1, 18, 3, { stone: S.stone, wall: T(pal.wall), frame: S.oh.frame, roofC: S.rc, gold: T(pal.gold) }, pal, geo);
      finish(S, pal, T, geo, r, { tip: 1 });
    }
  };

  // module đăng ký vào bố cục: cls 'sect'
  sc.places.sect = (pal, T, geo, r, terr, s, style) => {
    const f = style && LAND[style.land];
    if (f) return f(pal, T, geo, r, terr, style);
    const st = { roof: 'sect' }, S = stage(pal, T, geo, r, terr, st); // tông chưa có kiểu riêng: khung chung
    sc.pagoda(80, S.tl[50] + 1, 18, 4, { stone: S.stone, wall: T(pal.wall), frame: S.oh.frame, roofC: S.rc, gold: T(pal.gold) }, pal, geo);
    const h1 = sc.hall(372, S.gy, 84, 14, 9, S.oh, pal, geo); sc.hall(372, h1.top + 7, 46, 9, 8, Object.assign({}, S.oh, { plat: 0, lamps: 0, door: 0 }), pal, geo);
    finish(S, pal, T, geo, r, { tip: 0 });
  };
  sc.sectLand = LAND;
})();
