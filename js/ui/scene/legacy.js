// Phần vẽ cũ giữ lại ở T-A: công trình khối cho các loại nơi chưa có bố cục mới (thành, hầm mỏ, bến, chợ, cổng ải, linh mạch, bí cảnh) và
// nội thất hầm mộ / bí cảnh / tàn tích / hung địa. Vẽ theo tọa độ cũ 240x72 rồi phóng 2x (đặt mặt đất cũ GY=54 khớp mặt đất mới).
// T-C thay các công trình khối bằng module kiến trúc; T-D dọn phần nội thất.
(function () {
  const sc = window.TT.ui.sc, CFG = sc.CFG, hash = sc.hash, mix = sc.mix;
  const LW = 240, LH = 72, LGY = 54, K = 2, OY = CFG.GY - LGY * K;
  const R = (x, y, w, h, c) => sc.R(x, y, w, h, c);
  const alpha = a => { sc.cur().globalAlpha = a; };

  // bảng màu kiểu cũ suy ra từ bảng màu mới
  const compat = pal => ({ soil: mix(pal.m4, pal.ink, 0.4), tint: pal.m3, ta: pal.amb * 0.6, lit: pal.lit > 0.1 ? 1 : 0, sky: [pal.sky0, pal.sky1, pal.sky2] });
  const withScale = fn => { const g = sc.cur(); g.save(); g.setTransform(K, 0, 0, K, 0, OY); try { fn(); } finally { g.restore(); } };
  const GY = LGY;

  const lit = (p, x, y, w, h) => { if (p.lit) { R(x, y, w, h, '#ffd36a'); alpha(0.18); R(x - 1, y - 1, w + 2, h + 2, '#ffd36a'); alpha(1); } else R(x, y, w, h, '#4a6a8a'); };
  function house(x, p, w, big) {
    const h = big ? 17 : 13, wall = mix('#7a5a3a', p.soil, 0.2), r1 = mix('#c9a24a', p.tint, 0.15 * p.ta * 2), r2 = mix('#a8832e', p.tint, 0.15 * p.ta * 2);
    R(x, GY - h, w, h, wall); R(x, GY - 2, w, 2, mix(wall, '#000000', 0.25));
    for (let r = 0; r < 9; r++) R(x - 3 + r, GY - h - r - 1, w + 6 - 2 * r, 1, r % 2 ? r2 : r1);
    R(x + Math.floor(w / 2) - 2, GY - 8, 4, 8, '#2e2014'); lit(p, x + 3, GY - h + 4, 3, 3); if (w > 22) lit(p, x + w - 7, GY - h + 4, 3, 3);
  }
  function city(x, p) {
    const wall = mix('#7c7a86', p.soil, 0.15), dark = mix(wall, '#000000', 0.3);
    R(x, GY - 18, 70, 18, wall); for (let i = 0; i < 70; i += 6) R(x + i, GY - 21, 3, 3, wall);
    [x - 4, x + 62].forEach(tx => { R(tx, GY - 30, 12, 30, wall); R(tx - 2, GY - 34, 16, 4, dark); for (let i = 0; i < 12; i += 4) R(tx - 2 + i, GY - 37, 3, 3, dark); lit(p, tx + 4, GY - 24, 3, 4); });
    R(x + 28, GY - 14, 14, 14, '#1a1410'); R(x + 30, GY - 16, 10, 2, '#1a1410');
    [x + 18, x + 52].forEach(lx => { R(lx, GY - 12, 1, 4, '#3a2a20'); R(lx - 1, GY - 9, 3, 4, '#d8443a'); if (p.lit) { alpha(0.3); R(lx - 3, GY - 11, 7, 8, '#ff9a4a'); alpha(1); } });
  }
  function portal(x) {
    for (let a = 0; a < 40; a++) { const ang = a / 40 * Math.PI * 2; R(x + 20 + Math.cos(ang) * 14, GY - 22 + Math.sin(ang) * 18, 2, 2, a % 2 ? '#b58aff' : '#6ae0ff'); }
    alpha(0.25); R(x + 8, GY - 38, 24, 36, '#8a6aff'); alpha(1);
  }
  function mine(x, p) { R(x, GY - 20, 3, 20, '#6a4a2a'); R(x + 24, GY - 20, 3, 20, '#6a4a2a'); R(x - 2, GY - 22, 31, 3, '#7a5a34'); R(x + 5, GY - 14, 16, 14, '#08080c'); R(x + 34, GY - 6, 12, 5, '#5a5a66'); R(x + 36, GY - 2, 3, 2, '#222'); R(x + 43, GY - 2, 3, 2, '#222'); lit(p, x + 12, GY - 18, 2, 2); }
  function port(x) { R(x, GY + 4, 52, 3, '#7a5a34'); for (let i = 0; i < 6; i++) R(x + 2 + i * 9, GY + 7, 2, 8, '#5a3e22'); R(x + 54, GY + 6, 30, 5, '#6a4426'); R(x + 66, GY - 14, 1, 20, '#ccaaaa'); R(x + 67, GY - 12, 12, 10, '#e8dcc0'); }
  function market(x) { ['#d8443a', '#3a8ad8', '#d8b43a'].forEach((c, i) => { const sx = x + i * 22; R(sx, GY - 10, 2, 10, '#5a3e22'); R(sx + 16, GY - 10, 2, 10, '#5a3e22'); for (let k = 0; k < 18; k += 3) R(sx + k, GY - 16, 3, 5, (k / 3) % 2 ? c : mix(c, '#ffffff', 0.5)); R(sx + 3, GY - 3, 12, 3, '#3a2a1c'); }); }
  function tent(x, p) { const c = mix('#a88a5a', p.tint, 0.2); for (let r = 0; r < 12; r++) R(x + r, GY - r - 1, 24 - 2 * r, 1, r % 2 ? c : mix(c, '#000000', 0.15)); R(x + 10, GY - 5, 4, 5, '#241810'); alpha(0.7); R(x + 34, GY - 6, 3, 5, '#ff9a2a'); R(x + 35, GY - 9, 1, 3, '#ffd23a'); alpha(1); }
  function vein(x) { for (let i = 0; i < 5; i++) { const h = 8 + hash(i * 3) * 14, cx = x + i * 8; for (let r = 0; r < h; r++) R(cx + (r < h / 2 ? 0 : 1), GY - r, 4 - Math.floor(r / (h / 3)), 1, ['#5ad8ff', '#8ae8ff', '#c8f4ff'][r % 3]); } alpha(0.22); R(x - 4, GY - 26, 50, 26, '#5ad8ff'); alpha(1); }
  function gate(x, p) { const wall = mix('#7a7a86', p.soil, 0.2); R(x, GY - 26, 22, 26, wall); R(x + 52, GY - 26, 22, 26, wall); R(x + 22, GY - 26, 30, 7, wall); R(x + 24, GY - 19, 26, 19, '#0f0d12'); for (let i = 0; i < 22; i += 4) { R(x + i, GY - 29, 3, 3, wall); R(x + 52 + i, GY - 29, 3, 3, wall); } }

  // công trình khối tĩnh cho cls chưa có bố cục mới; vẽ vào lớp arch hiện hành
  function struct(cls, pal) {
    const p = compat(pal);
    withScale(() => {
      if (cls === 'tribe') { house(24, p, 22, false); tent(190, p); }
      else if (cls === 'city') city(8, p);
      else if (cls === 'secret') portal(20);
      else if (cls === 'mine') mine(14, p);
      else if (cls === 'port') port(10);
      else if (cls === 'market' || cls === 'guild') market(14);
      else if (cls === 'vein') vein(20);
      else if (cls === 'gate') gate(8, p);
    });
  }

  // ---------- bên trong hầm mộ, bí cảnh, tàn tích, hung địa (động) ----------
  function interior(ctx, s, pal, t) {
    sc.use(ctx);
    const frame = t * 9, p = compat(pal), k = s.dgkind;
    const A = ({ bi_canh: ['#2a2a78', '#6a6aff', '#8affff'], tan_tich: ['#4a3a28', '#8a6a44', '#ffb04a'], hung_dia: ['#3a1216', '#8a2a30', '#ff5a3a'] })[k] || ['#222', '#444', '#888'];
    const sky1 = ({ bi_canh: '#16164a', tan_tich: '#2a2016', hung_dia: '#2e0e12' })[k] || p.sky[1];
    ctx.save(); ctx.setTransform(K, 0, 0, K, 0, OY);
    ctx.fillStyle = '#05050a'; ctx.fillRect(0, -OY / K - 1, LW, LH + OY / K + 4);
    R(0, -9, LW, LGY + 9, mix(sky1, '#000000', 0.15));
    for (let x = 0; x < LW; x += 2) { const h = 6 + hash(x * 0.37 + (k === 'hung_dia' ? 2 : 1)) * (k === 'tan_tich' ? 4 : 10); R(x, -9, 2, h + 9, A[0]); if (k !== 'tan_tich' && hash(x * 1.7) > 0.8) R(x, h, 1, 2 + hash(x) * 4, A[0]); }
    if (k === 'bi_canh') {
      for (let i = 0; i < 9; i++) { const cx = hash(i * 4.1) * LW, ch = 6 + hash(i * 2.2) * 12, up = i % 2; for (let r = 0; r < ch; r++) R(cx + (r % 2), up ? r : GY - r - 1, 3 - Math.floor(r / (ch / 3)), 1, [A[1], A[2], A[1]][r % 3]); alpha(0.14 + 0.08 * Math.sin(frame * 0.15 + i)); R(cx - 3, up ? 0 : GY - ch - 3, 9, ch + 3, A[2]); alpha(1); }
      for (let i = 0; i < 14; i++) { alpha(0.5 + 0.5 * Math.sin(frame * 0.12 + i * 2)); R(hash(i * 3.3) * LW + Math.sin(frame * 0.04 + i) * 5, 10 + hash(i * 1.9) * 36 + Math.cos(frame * 0.05 + i) * 3, 1, 1, A[2]); alpha(1); }
    } else if (k === 'tan_tich') {
      for (let i = 0; i < 6; i++) { const cx = 18 + i * 42, ph = hash(i * 5.1); R(cx, GY - 30 + ph * 14, 6, 30 - ph * 14, A[1]); R(cx - 1, GY - 31 + ph * 14, 8, 2, mix(A[1], '#ffffff', 0.2)); if (ph > 0.5) R(cx + 6, GY - 8, 3, 2, A[0]); }
      for (let i = 0; i < 3; i++) { const tx = 60 + i * 70; R(tx, GY - 24, 2, 8, '#3a2a1a'); const f = Math.sin(frame * 0.6 + i * 3) > 0 ? 1 : 0; R(tx - 1, GY - 30 - f, 4, 6 + f, '#ff8a2a'); R(tx, GY - 28, 2, 3, '#ffe08a'); alpha(0.14); R(tx - 14, GY - 42, 30, 40, '#ff9a3a'); alpha(1); }
      for (let x = 0; x < LW; x += 12) R(x, GY - 1, 11, 1, mix(A[0], '#000000', 0.2));
    } else {
      for (let x = 0; x < LW; x += 8) { const sh = 4 + hash(x * 0.7) * 9; for (let r = 0; r < sh; r++) R(x + 3 - Math.floor(r * 0.3), GY - r - 1, Math.max(1, 5 - Math.floor(r * 0.5)), 1, A[0]); }
      for (let i = 0; i < 7; i++) { const bx = hash(i * 6.3) * (LW - 20) + 6; R(bx, GY - 2, 6, 2, '#d8d0b8'); R(bx + 1, GY - 4, 2, 2, '#d8d0b8'); R(bx + 4, GY - 3, 3, 1, '#b8b098'); }
      alpha(0.12 + 0.06 * Math.sin(frame * 0.1)); R(0, 18, LW, GY - 18, '#ff3a2a'); alpha(1);
      for (let i = 0; i < 5; i++) if (Math.floor((frame + i * 17) / 24) % 5 !== 0) { const ex = hash(i * 2.9) * LW; R(ex, 14 + hash(i * 7.7) * 20, 2, 1, '#ff3a3a'); R(ex + 4, 14 + hash(i * 7.7) * 20, 2, 1, '#ff3a3a'); }
    }
    R(0, GY, LW, LH - GY + 2, mix(p.soil, A[0], 0.5)); R(0, GY, LW, 2, mix(A[1], '#000000', 0.35));
    const n = s.node ? s.node.t : '';
    if (n === 'treasure') {
      for (let i = 0; i < 2; i++) { const cx = 150 + i * 26; R(cx, GY - 10, 16, 10, '#7a4a22'); R(cx, GY - 10, 16, 3, '#9a6a32'); R(cx + 7, GY - 8, 2, 4, '#ffd23a'); R(cx, GY - 6, 16, 1, '#ffd23a'); alpha(0.25 + 0.12 * Math.sin(frame * 0.2 + i)); R(cx - 6, GY - 20, 28, 22, '#ffd23a'); alpha(1); }
      for (let i = 0; i < 6; i++) R(146 + hash(i * 3) * 50, GY - 1, 2, 1, '#ffd23a');
    } else if (n === 'rest') {
      R(150, GY - 1, 40, 4, '#2a6ad8'); R(152, GY - 2, 36, 2, '#6ab4ff'); for (let i = 0; i < 6; i++) { alpha(0.7); R(154 + hash(i * 5) * 30, GY - 4 - ((frame * 0.6 + i * 9) % 18), 1, 1, '#c8f0ff'); alpha(1); }
    } else if (n === 'trap') {
      alpha(0.35 + 0.25 * Math.sin(frame * 0.2)); R(140, GY - 2, 50, 3, A[2]); R(152, GY - 5, 26, 1, A[2]); R(158, GY - 8, 14, 1, A[2]); alpha(1);
      for (let i = 0; i < 5; i++) { R(196, 14 + i * 7, 6, 1, '#12121a'); if (Math.floor(frame / 12 + i) % 5 === 0) R(190, 14 + i * 7, 6, 1, '#d8d8e8'); }
    }
    if (s.node && s.node.t === 'boss') { alpha(0.16 + 0.08 * Math.sin(frame * 0.1)); R(0, -OY / K, LW, LH + OY / K, '#ff2a2a'); alpha(1); }
    ctx.restore();
  }

  sc.legacy = { struct, interior, K, OY };
})();
