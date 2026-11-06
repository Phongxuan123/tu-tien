// Dáng kiến trúc chín nơi thờ tự (chỉ vẽ kiến trúc, đúng dáng từng loại; không dùng biểu tượng thiêng làm trang trí).
// Gọi từ phố công trình (street.js): sc.shrine.draw(ctx, form, cx, gy, pal, T, col, roof). Hình theo FAITH_FORM ở data.js.
(function () {
  const sc = window.TT.ui.sc;
  const { mix, R, P, ell, disc } = sc;

  const roofOf = c => ({ t: c, l: mix(c, '#ffffff', 0.35), d: mix(c, '#000000', 0.4), d2: mix(c, '#000000', 0.2), sh: '#1a1410' });
  const dummy = () => ({ lamps: [], smokes: [], flags: [], flames: [] });
  const arch = (x, y, w, h, c) => { R(x, y + 2, w, h - 2, c); R(x + 1, y + 1, w - 2, 1, c); if (w > 4) R(x + 2, y, w - 4, 1, c); };

  const FORMS = {
    // chùa: tháp ba tầng mái cong, chóp nhọn
    chua(g, cx, gy, pal, T, col, roof) {
      sc.pagoda(cx, gy, 24, 3, { stone: T('#8a8070'), wall: T(mix(col, '#f2ecd8', 0.5)), frame: T(mix(col, '#000000', 0.4)), roofC: roofOf(T(roof)), gold: T(col) }, pal, g);
    },
    // nhà thờ: gian chính mái dốc, tháp chuông có chóp, cửa sổ vòm
    nha_tho(g, cx, gy, pal, T) {
      const wall = T('#e8e4dc'), dk = T('#5a6a8a'), lt = pal.lit > 0.1 ? mix('#2a3a5a', '#ffd870', pal.lit * 0.8) : T('#4a6a8a');
      R(cx - 8, gy - 30, 30, 30, wall); R(cx - 8, gy - 30, 1, 30, T('#fff'));
      for (let i = 0; i < 16; i++) R(cx - 12 + i, gy - 30 - 16 + i, 40 - i * 2 + 0, 1, i % 3 ? dk : T('#3a4a6a'));
      R(cx - 12, gy - 31, 40, 2, dk);
      R(cx - 28, gy - 44, 16, 44, wall); R(cx - 28, gy - 44, 1, 44, T('#fff'));
      for (let i = 0; i < 20; i++) R(cx - 28 + Math.floor(i / 3) * 1, gy - 44 - i, Math.max(2, 16 - Math.floor(i * 0.8)), 1, dk);
      arch(cx - 23, gy - 38, 6, 10, lt); arch(cx - 3, gy - 22, 6, 12, lt); arch(cx + 8, gy - 22, 6, 12, lt); arch(cx + 16, gy - 22, 6, 12, lt);
      ell(cx + 7, gy - 38, 4, 4, lt); arch(cx - 6, gy - 12, 12, 12, '#2a1c14');
    },
    // thánh đường: khối vuông, mái vòm, hai tháp nhọn mảnh, cửa vòm
    thanh_duong(g, cx, gy, pal, T) {
      const wall = T('#f0e8c0'), dome = T('#2a8a6a'), dd = mix(dome, pal.ink, 0.35), lt = pal.lit > 0.1 ? mix('#1a4a3a', '#ffe08a', pal.lit * 0.7) : T('#2a6a5a');
      R(cx - 18, gy - 24, 36, 24, wall); R(cx - 18, gy - 24, 36, 2, T('#fff')); ell(cx, gy - 24, 16, 14, dome);
      sc.cur().fillStyle = wall; sc.cur().fillRect(cx - 17, gy - 24, 34, 1); R(cx - 12, gy - 26, 12, 3, dd); ell(cx - 4, gy - 30, 6, 5, mix(dome, '#fff', 0.25));
      R(cx - 1, gy - 46, 2, 8, T('#e8c24a')); disc(cx, gy - 47, 2, T('#e8c24a'));
      [-27, 27].forEach(dx => { R(cx + dx - 3, gy - 52, 6, 52, wall); R(cx + dx - 3, gy - 52, 1, 52, T('#fff')); R(cx + dx - 4, gy - 40, 8, 2, T('#c8c0a0')); ell(cx + dx, gy - 56, 4, 5, dome); R(cx + dx, gy - 66, 1, 6, T('#e8c24a')); });
      arch(cx - 6, gy - 16, 12, 16, '#16302a'); arch(cx - 15, gy - 18, 5, 9, lt); arch(cx + 10, gy - 18, 5, 9, lt);
    },
    // đền tháp bậc: tháp nhọn nhiều bậc, hiên cột phía trước
    den_thap(g, cx, gy, pal, T, col) {
      const c = T(col), cl = mix(c, '#fff', 0.35), cd = mix(c, pal.ink, 0.4);
      R(cx - 28, gy - 10, 56, 10, T('#e8d9b0')); R(cx - 28, gy - 10, 56, 1, T('#fff'));
      for (let i = 0; i < 6; i++) { const w = 34 - i * 5, y = gy - 10 - i * 8; R(cx - w / 2, y - 8, w, 8, i % 2 ? cl : c); R(cx - w / 2, y - 8, w, 1, mix(c, '#fff', 0.55)); R(cx - w / 2, y - 1, w, 1, cd); R(cx - 1, y - 6, 2, 3, cd); }
      R(cx - 1, gy - 62, 2, 8, T('#e8c24a')); disc(cx, gy - 63, 2, T('#e8c24a'));
      for (let x = cx - 24; x < cx + 24; x += 12) R(x, gy - 10, 3, 10, cd); arch(cx - 4, gy - 9, 8, 9, '#2a1c14');
    },
    // đạo quán: điện mái cong, cửa sổ tròn, hai đèn trụ
    dao_quan(g, cx, gy, pal, T, col, roof) {
      const h = sc.hall(cx, gy, 36, 14, 9, { wall: T('#f4f0e0'), frame: T(roof), stone: T('#8a8070'), roofC: roofOf(T(roof)), door: 1, plat: 1, eave: 8, orn: T('#e8c24a') }, pal, g);
      disc(cx, h.top + 22, 4, T(mix(col, '#000', 0.5))); R(cx - 36, gy - 18, 2, 18, T('#8a8070')); R(cx + 34, gy - 18, 2, 18, T('#8a8070')); R(cx - 38, gy - 22, 6, 4, T(col)); R(cx + 32, gy - 22, 6, 4, T(col));
    },
    // văn miếu: cổng ba gian phía trước, điện hai tầng mái phía sau
    van_mieu(g, cx, gy, pal, T, col, roof) {
      const rc = roofOf(T(roof)), o = { wall: T('#e8d9a0'), frame: T(col), stone: T('#8a8070'), roofC: rc, plat: 0, eave: 7 };
      sc.hall(cx, gy - 12, 40, 14, 9, Object.assign({}, o, { door: 0 }), pal, g); sc.hall(cx, gy - 36, 26, 8, 7, Object.assign({}, o, { door: 0 }), pal, g);
      sc.hall(cx, gy, 50, 11, 6, Object.assign({}, o, { door: 1, plat: 1 }), pal, g);
    },
    // từ đường: nhà thấp rộng mái sâu, lư hương trước hiên
    tu_duong(g, cx, gy, pal, T, col, roof) {
      sc.hall(cx, gy, 46, 11, 7, { wall: T('#e8d9a0'), frame: T('#5a3a1a'), stone: T('#8a8070'), roofC: roofOf(T(roof)), door: 1, plat: 1, eave: 9 }, pal, g);
      R(cx - 5, gy - 8, 10, 6, T('#a8743a')); R(cx - 6, gy - 9, 12, 2, T('#c8944a')); R(cx - 2, gy - 14, 1, 5, T('#e8e0d0')); R(cx + 1, gy - 15, 1, 6, T('#e8e0d0'));
    },
    // đền thần: cổng hai cột hai xà cong, điện nhỏ mái dốc phía sau
    den_than(g, cx, gy, pal, T, col, roof) {
      const red = T('#d83a2a');
      sc.hall(cx, gy - 4, 24, 10, 8, { wall: T('#f0ead8'), frame: T('#7a4a2a'), stone: T('#8a8070'), roofC: roofOf(T('#5a4a3a')), door: 1, plat: 0, eave: 5 }, pal, g);
      R(cx - 26, gy - 34, 3, 34, red); R(cx + 23, gy - 34, 3, 34, red); R(cx - 31, gy - 38, 62, 4, T('#1a1a1a')); R(cx - 33, gy - 41, 6, 3, T('#1a1a1a')); R(cx + 27, gy - 41, 6, 3, T('#1a1a1a')); R(cx - 28, gy - 28, 56, 3, red);
    },
    // miếu dân gian: miếu nhỏ tường đỏ, lư hương, cột phướn
    mieu(g, cx, gy, pal, T, col, roof) {
      sc.hall(cx, gy, 30, 12, 8, { wall: T('#c8442a'), frame: T('#6a2a1a'), stone: T('#8a8070'), roofC: roofOf(T('#7a5a3a')), door: 1, plat: 1, eave: 7 }, pal, g);
      R(cx + 24, gy - 40, 1, 40, T('#6a4a2a')); R(cx + 25, gy - 40, 7, 10, T('#e8c24a')); R(cx - 6, gy - 9, 12, 5, T('#8a8f98')); R(cx - 7, gy - 10, 14, 2, T('#b8bec8'));
    }
  };

  sc.shrine = { draw(ctx, form, cx, gy, pal, T, col, roof) { sc.use(ctx); (FORMS[form] || FORMS.mieu)(dummy(), cx, gy, pal, T, col || '#8a7a5a', roof || '#4a3a20'); }, FORMS };
})();
