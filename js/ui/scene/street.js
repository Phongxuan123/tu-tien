// Phố công trình bấm được trên nền mới: mỗi nhà vẽ bằng kiến trúc mái cong (arch.hall) rồi gọi biểu tượng treo cửa của bldart (ui.bld.icon).
// Công trình có hình riêng (võ đài, sơn môn, tàng kinh các...) dùng ui.bld.draw phóng 2x; nơi thờ dùng dáng kiến trúc ở shrine.js.
// Vẽ lên canvas phố độ phân giải cảnh (480x144); đáy mỗi nhà ở y = gy.
(function () {
  const TT = window.TT, sc = TT.ui.sc;
  const { mix, R } = sc;
  const roofOf = c => ({ t: c, l: mix(c, '#ffffff', 0.35), d: mix(c, '#000000', 0.4), d2: mix(c, '#000000', 0.2), sh: '#1a1410' });

  // công trình có hình riêng, vẽ bằng kiến trúc mới (cx giữa, gy đáy); trả về true nếu có hình mới
  const SP = {
    son(c) { const { cx, gy, pal, T, d } = c, st = T('#8a8070'), lt = T('#c8c0a8'), rc = roofOf(T(d.roof)); [-22, 17].forEach(dx => { R(cx + dx, gy - 40, 6, 40, T(mix(d.col, '#f2ecd8', 0.4))); R(cx + dx, gy - 40, 1, 40, lt); R(cx + dx - 1, gy - 2, 8, 3, st); }); R(cx - 24, gy - 46, 48, 5, T('#6a3a1a')); sc.roof(cx, gy - 62, 28, 12, rc, T('#e8c24a')); R(cx - 14, gy - 36, 28, 36, '#16100c'); sc.glyphs(cx - 8, gy - 30, 3, T('#e8c24a')); return true; },
    tang(c) { const { cx, gy, pal, T, d } = c; sc.pagoda(cx, gy, 24, 3, { stone: T('#8a8070'), wall: T(mix(d.col, '#f2ecd8', 0.5)), frame: T(mix(d.col, '#000000', 0.4)), roofC: roofOf(T(d.roof)), gold: T('#e8c24a') }, pal, { lamps: [] }); return true; },
    dien(c) { const { cx, gy, pal, T, d } = c, o = { wall: T(mix(d.col, '#f2ecd8', 0.45)), frame: T(mix(d.col, '#000000', 0.4)), stone: T('#8a8070'), roofC: roofOf(T(d.roof)), eave: 7, orn: T('#e8c24a'), door: 1 }, g = { lamps: [] }; const h = sc.hall(cx, gy, 44, 20, 12, Object.assign({ plat: 1 }, o), pal, g); sc.hall(cx, h.top + 7, 26, 9, 8, Object.assign({}, o, { door: 0 }), pal, g); return true; },
    vo(c) { const { cx, gy, T } = c; R(cx - 28, gy - 8, 56, 8, T('#8a7a5a')); R(cx - 28, gy - 8, 56, 1, T('#c8b890')); [-27, 25].forEach(dx => R(cx + dx, gy - 30, 3, 22, T('#4a3020'))); R(cx - 27, gy - 28, 54, 1, T('#c8362c')); R(cx - 27, gy - 19, 54, 1, T('#c8362c')); R(cx - 6, gy - 48, 2, 40, T('#4a3020')); R(cx - 4, gy - 48, 16, 9, T('#c8362c')); return true; },
    tau(c) { const { cx, gy, T } = c; R(cx - 28, gy - 6, 56, 4, T('#7a5a34')); for (let x = -26; x < 28; x += 12) R(cx + x, gy - 2, 3, 6, T('#5a3e22')); R(cx - 2, gy - 52, 2, 46, T('#4a3020')); for (let i = 0; i < 38; i++) R(cx, gy - 50 + i, Math.max(1, 22 - Math.floor(i * 0.5)), 1, T('#e8dcc0')); R(cx - 18, gy - 10, 40, 5, T('#6a4426')); return true; },
    ai(c) { const { cx, gy, pal, T, d } = c; const st = T('#767684'); R(cx - 28, gy - 36, 14, 36, st); R(cx + 14, gy - 36, 14, 36, st); R(cx - 28, gy - 36, 56, 5, T('#8a8a98')); for (let x = -28; x < 28; x += 10) R(cx + x, gy - 41, 6, 5, T('#8a8a98')); R(cx - 14, gy - 26, 28, 26, '#14121a'); sc.hall(cx, gy - 36, 52, 6, 8, { wall: T('#c8c0a8'), frame: T('#6a3a1a'), stone: st, roofC: roofOf(T(d.roof)), eave: 5, plat: 0 }, pal, { lamps: [] }); return true; },
    cua(c) { const { cx, gy, T } = c; [-20, 14].forEach(dx => { R(cx + dx, gy - 44, 7, 44, T('#3a2a5a')); R(cx + dx, gy - 44, 1, 44, T('#6a52a0')); }); R(cx - 24, gy - 50, 48, 7, T('#4a3270')); sc.cur().globalAlpha = 0.55; sc.ell(cx, gy - 22, 14, 22, '#b878ff'); sc.ell(cx, gy - 22, 8, 14, '#f0d8ff'); sc.cur().globalAlpha = 1; return true; },
    ham(c) { const { cx, gy, T } = c; for (let x = -30; x < 30; x++) { const u = x / 30, h = Math.round(46 * Math.sqrt(Math.max(0, 1 - u * u))); R(cx + x, gy - h, 1, h, T(hash(x) < 0.3 ? '#4a3a30' : '#6a5a4a')); } R(cx - 12, gy - 22, 24, 22, '#08080c'); R(cx - 15, gy - 28, 4, 28, T('#6a4a2a')); R(cx + 11, gy - 28, 4, 28, T('#6a4a2a')); R(cx - 16, gy - 30, 32, 4, T('#7a5a34')); return true; },
    den(c) { const { cx, gy, pal, T } = c; sc.hall(cx, gy, 40, 16, 10, { wall: T('#2a1f3a'), frame: T('#16101f'), stone: T('#2a2a3a'), roofC: roofOf(T('#2a1f3a')), eave: 7, plat: 0, door: 1 }, pal, { lamps: [] }); R(cx - 6, gy - 30, 4, 3, '#d8302a'); R(cx + 3, gy - 30, 4, 3, '#d8302a'); return true; },
    rong(c) { const { cx, gy, T } = c; R(cx - 18, gy - 12, 36, 10, T('#8a5a2a')); R(cx - 18, gy - 12, 36, 2, T('#b07a3a')); R(cx - 20, gy - 38, 2, 28, T('#6a4a2a')); R(cx + 18, gy - 38, 2, 28, T('#6a4a2a')); for (let k = 0; k < 40; k += 5) R(cx - 20 + k, gy - 42, 5, 8, (k / 5) % 2 ? T('#f0e8d0') : T('#d8553a')); ell0(cx - 12, gy - 3, T); ell0(cx + 12, gy - 3, T); return true; },
    lang(c) { const { cx, gy, T } = c; for (let i = 0; i < 46; i++) { const hw = Math.round(24 * (1 - i / 46)); R(cx - hw, gy - 1 - i, hw * 2 + 1, 1, i % 5 === 4 ? T('#7a5a3a') : T('#a07a4a')); } R(cx - 4, gy - 16, 8, 16, '#14100c'); R(cx, gy - 58, 1, 12, T('#4a3020')); R(cx + 1, gy - 58, 8, 5, T('#58b36a')); return true; },
    tran(c) { const { cx, gy, T } = c; sc.ell(cx, gy - 4, 30, 6, T('#6a6a70')); sc.ell(cx, gy - 6, 26, 4, T('#8a8a92')); sc.cur().globalAlpha = 0.6; sc.ell(cx, gy - 6, 20, 3, '#6af0c8'); sc.cur().globalAlpha = 1; [-22, 20].forEach(dx => { R(cx + dx, gy - 34, 4, 30, T('#8f8a80')); R(cx + dx - 1, gy - 36, 6, 3, T('#b9b3a6')); }); sc.cur().globalAlpha = 0.4; R(cx - 18, gy - 32, 36, 26, '#2fd8a8'); sc.cur().globalAlpha = 1; return true; },
    bi(c) { const { cx, gy, T } = c; R(cx - 30, gy - 10, 60, 10, T('#8a7a5a')); R(cx - 30, gy - 12, 60, 3, T('#c8b890')); R(cx - 10, gy - 11, 20, 2, T('#b0382a')); [-28, 26].forEach(dx => R(cx + dx, gy - 40, 2, 30, T('#4a3020'))); R(cx - 26, gy - 40, 16, 8, T('#d8302a')); R(cx + 10, gy - 40, 16, 8, T('#3a78d8')); return true; }
  };
  const hash = sc.hash, ell0 = (x, y, T) => sc.ell(x, y, 4, 4, T('#3a2a1c'));

  function draw(ctx, id, x, gy, w, opt, pal, T) {
    const bld = TT.ui.bld, d = bld && bld.defs[id]; if (!d) return;
    opt = opt || {}; const f = opt.frame || 0, cx = x + Math.round(w / 2);
    sc.use(ctx);
    if (id.indexOf('tho_') === 0) {
      if (opt.hover) { ctx.globalAlpha = 0.3; R(x - 6, gy - 92, w + 12, 96, '#ffd870'); ctx.globalAlpha = 1; }
      const faith = d.faith, form = sc.data.FAITH_FORM[faith];
      sc.shrine.draw(ctx, form, cx, gy, pal, T, d.col, d.roof); return;
    }
    if (SP[id]) { if (opt.hover) { ctx.globalAlpha = 0.3; R(x - 4, gy - 96, w + 8, 100, '#ffd870'); ctx.globalAlpha = 1; } if (SP[id]({ cx, gy, pal, T, d })) return; }
    if (bld.special.indexOf(id) >= 0) { ctx.save(); ctx.scale(2, 2); bld.draw(ctx, id, x / 2, gy / 2, w / 2, { hover: opt.hover, frame: f }); ctx.restore(); return; }
    if (opt.hover) { ctx.globalAlpha = 0.3; R(x - 4, gy - 96, w + 8, 100, '#ffd870'); ctx.globalAlpha = 1; }
    const tall = d.h >= 34, g = { lamps: [], smokes: [], flags: [], flames: [] };
    const hh = sc.hall(cx, gy, 42, tall ? 22 : 19, tall ? 14 : 12, { wall: T(mix(d.col, '#f2ecd8', 0.5)), frame: T(mix(d.col, '#000000', 0.35)), stone: T('#8a8070'), roofC: roofOf(T(d.roof)), door: 1, plat: 0, eave: 8, lamps: false }, pal, g);
    ctx.save(); ctx.scale(2, 2); bld.icon(ctx, id, cx / 2, hh.top / 2 - 21, f); ctx.restore();
  }
  sc.street = { draw };
})();
