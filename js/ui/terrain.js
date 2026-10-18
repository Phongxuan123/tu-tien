// Vẽ nền địa hình cho "Bản đồ vùng": mỗi vùng một kiểu (đồng bằng, biển đảo, núi, rừng, băng nguyên, núi lửa, sa mạc, đầm lầy, đảo giông bão),
// tạo bằng nhiễu giá trị (value noise) với hạt giống theo id vùng nên luôn giống nhau. Nền được vẽ một lần vào canvas, cache lại, rồi dán vào SVG
// như một ảnh; chữ, đường, địa điểm vẽ đè lên bằng SVG nên phóng to vẫn nét. Địa điểm nào cũng có "vết" riêng trên nền (ruộng quanh thành,
// ánh sáng quanh linh mạch, khói tím quanh bí cảnh...).
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};

  const W = 800, H = 560, S = 3;

  const CFG = {
    trung_chau: { mode: 'plain', river: true, names: ['Trung Nguyên Bình Địa', 'Hoàng Hà', 'Gò Thanh Vân'] },
    dong_hai: { mode: 'sea', names: ['Đông Hải', 'Vịnh Lam', 'Quần Đảo Giao Nhân'] },
    tay_son: { mode: 'mountain', names: ['Thiên Sơn', 'Tuyết Lĩnh', 'Hẻm Gió Rít'] },
    nam_lam: { mode: 'forest', river: true, names: ['Rừng Mê Vụ', 'Cổ Thụ Lâm', 'Thung Linh Dược'] },
    bac_bang: { mode: 'ice', names: ['Băng Nguyên Vô Tận', 'Hồ Cực Quang', 'Đồng Tuyết'] },
    hoa_son: { mode: 'lava', names: ['Hỏa Diệm Sơn', 'Sông Dung Nham', 'Hố Tro Tàn'] },
    hoang_mac: { mode: 'desert', names: ['Biển Cát Kim Sa', 'Đụn Cát Vàng', 'Ốc Đảo Xa'] },
    vu_trach: { mode: 'swamp', names: ['Đầm Sương Độc', 'Bãi Lau Âm', 'Rừng Cọc'] },
    loi_dao: { mode: 'stormsea', names: ['Biển Giông', 'Quần Đảo Sấm', 'Vực Sét'] }
  };

  function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function mulberry(a) {
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  function noiseMaker(seed) {
    const r = mulberry(seed), tab = new Float32Array(65536);
    for (let i = 0; i < 65536; i++) tab[i] = r();
    const g = (x, y) => tab[((y & 255) << 8) | (x & 255)];
    const sm = t => t * t * (3 - 2 * t);
    function n2(x, y) {
      const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi);
      const a = g(xi, yi), b = g(xi + 1, yi), c = g(xi, yi + 1), d = g(xi + 1, yi + 1);
      return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
    }
    function fbm(x, y, o) {
      let s = 0, a = 0.5, f = 1, t = 0;
      for (let i = 0; i < (o || 4); i++) { s += a * n2(x * f, y * f); t += a; a *= 0.5; f *= 2.03; }
      return s / t;
    }
    return { n2, fbm };
  }
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const norm = v => clamp((v - 0.28) / 0.44, 0, 1);
  function ramp(stops, t) {
    if (t <= stops[0][0]) return stops[0][1];
    for (let i = 1; i < stops.length; i++) {
      if (t <= stops[i][0]) {
        const a = stops[i - 1], b = stops[i], k = (t - a[0]) / (b[0] - a[0] || 1);
        return [a[1][0] + (b[1][0] - a[1][0]) * k, a[1][1] + (b[1][1] - a[1][1]) * k, a[1][2] + (b[1][2] - a[1][2]) * k];
      }
    }
    return stops[stops.length - 1][1];
  }
  const mix = (c1, c2, k) => [c1[0] + (c2[0] - c1[0]) * k, c1[1] + (c2[1] - c1[1]) * k, c1[2] + (c2[2] - c1[2]) * k];
  const rgb = c => 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')';

  const RAMP = {
    plain: [[0, [104, 150, 78]], [0.45, [137, 172, 86]], [0.7, [176, 176, 100]], [0.9, [150, 136, 96]], [1, [128, 114, 88]]],
    forest: [[0, [38, 78, 44]], [0.5, [50, 102, 56]], [0.8, [68, 124, 66]], [1, [92, 138, 74]]],
    mountain: [[0, [92, 110, 78]], [0.3, [118, 120, 100]], [0.55, [138, 138, 136]], [0.78, [182, 186, 194]], [1, [246, 248, 251]]],
    ice: [[0, [196, 224, 238]], [0.5, [222, 238, 246]], [0.8, [240, 248, 252]], [1, [255, 255, 255]]],
    lava: [[0, [40, 32, 30]], [0.5, [68, 50, 42]], [0.8, [98, 68, 52]], [1, [130, 94, 68]]],
    desert: [[0, [186, 146, 82]], [0.5, [212, 176, 104]], [1, [228, 200, 138]]],
    swamp: [[0, [72, 86, 56]], [0.5, [92, 106, 64]], [1, [112, 120, 82]]],
    land: [[0, [214, 198, 142]], [0.1, [120, 168, 92]], [0.55, [84, 138, 78]], [1, [112, 146, 96]]],
    stormland: [[0, [150, 150, 170]], [0.12, [102, 104, 138]], [0.6, [86, 88, 124]], [1, [122, 120, 156]]],
    shallow: [[0, [92, 164, 206]], [1, [20, 66, 112]]],
    stormwater: [[0, [70, 92, 150]], [1, [18, 28, 62]]]
  };

  const ISLE_R = { thanh_tri: 105, tong_mon: 80, thuong_doan: 76, cua_ai: 72 };

  // ---------- nền (pixel) ----------
  function baseLayer(rid, cfg, places, nz) {
    const mode = cfg.mode, N = W * H;
    const hgt = new Float32Array(N), water = new Uint8Array(N), dmin = new Float32Array(N);
    const img = new ImageData(W, H), d = img.data;
    const rnd = mulberry(hashStr(rid + 'river'));
    // sông: đi qua các bến nếu có
    let river = null;
    if (cfg.river) {
      const pts = [[-20, 150 + rnd() * 240]];
      places.filter(p => p.type === 'ben').forEach(p => pts.push([p.x, p.y]));
      pts.push([W + 20, 120 + rnd() * 300]);
      pts.sort((a, b) => a[0] - b[0]);
      river = [];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1], n = Math.max(2, Math.round((b[0] - a[0]) / 70));
        for (let k = 0; k < n; k++) {
          const t = k / n; river.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + (k ? (rnd() - 0.5) * 50 : 0)]);
        }
      }
      river.push(pts[pts.length - 1]);
    }
    const riverDist = (x, y) => {
      let best = 1e9;
      for (let i = 0; i < river.length - 1; i++) {
        const a = river[i], b = river[i + 1], dx = b[0] - a[0], dy = b[1] - a[1];
        const t = clamp(((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy + 1e-6), 0, 1);
        const ex = a[0] + dx * t - x, ey = a[1] + dy * t - y, dd = ex * ex + ey * ey;
        if (dd < best) best = dd;
      }
      return Math.sqrt(best);
    };
    const sea = mode === 'sea' || mode === 'stormsea';
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = y * W + x, o = i * 4;
        let dm = 1e9, isl = 0;
        for (let k = 0; k < places.length; k++) {
          const p = places[k], dx = x - p.x, dy = y - p.y, dd = Math.sqrt(dx * dx + dy * dy);
          if (dd < dm) dm = dd;
          if (sea) { const R = ISLE_R[p.type] || 62, v = 1 - dd / R; if (v > isl) isl = v; }
        }
        dmin[i] = dm;
        const f = nz.fbm(x / 150, y / 150, 5);
        let c, hh = norm(f), wat = 0;
        if (mode === 'plain') {
          c = ramp(RAMP.plain, hh);
          if (hh > 0.82) c = mix(c, [118, 108, 84], 0.4);
          c = mix(c, [168, 150, 100], clamp(1 - dm / 34, 0, 0.5));
          if (river) {
            const rd = riverDist(x, y) + (nz.n2(x / 38, y / 38) - 0.5) * 9, w = 6 + nz.n2(x / 90, y / 90) * 5;
            if (rd < w) { wat = 1; c = mix([84, 150, 200], [42, 100, 160], clamp(1 - rd / w, 0, 1)); } else if (rd < w + 3.5) c = mix(c, [214, 200, 150], 0.7);
          }
        } else if (mode === 'forest') {
          c = ramp(RAMP.forest, hh);
          c = mix(c, [118, 150, 84], clamp(1 - dm / 44, 0, 0.6));
          if (river) {
            const rd = riverDist(x, y) + (nz.n2(x / 38, y / 38) - 0.5) * 8, w = 4 + nz.n2(x / 90, y / 90) * 3;
            if (rd < w) { wat = 1; c = mix([80, 150, 170], [40, 100, 130], clamp(1 - rd / w, 0, 1)); } else if (rd < w + 2.5) c = mix(c, [150, 160, 100], 0.6);
          }
        } else if (mode === 'mountain') {
          const rg = 1 - Math.abs(2 * nz.fbm(x / 110 + 9, y / 110 + 4, 4) - 1);
          hh = (0.55 * hh + 0.45 * rg * rg);
          hh *= 0.3 + 0.7 * Math.min(1, dm / 85);
          c = ramp(RAMP.mountain, clamp(hh * 1.15, 0, 1));
        } else if (mode === 'ice') {
          c = ramp(RAMP.ice, hh);
          const lake = nz.fbm(x / 120 + 30, y / 120 + 11, 4) + clamp(1 - dm / 50, 0, 1) * 0.3;
          if (lake < 0.33) { wat = 1; c = mix([130, 190, 222], [96, 160, 204], clamp((0.33 - lake) * 7, 0, 1)); }
          const cr = Math.abs(nz.fbm(x / 60 + 50, y / 60 + 7, 3) - 0.5);
          if (cr < 0.006 && dm > 24 && !wat) c = mix(c, [120, 160, 196], 0.55);
        } else if (mode === 'lava') {
          c = ramp(RAMP.lava, hh);
          const rv = Math.abs(nz.fbm(x / 105 + 3, y / 105 + 21, 4) - 0.5) + clamp(1 - dm / 42, 0, 1) * 0.1;
          if (rv < 0.015) c = mix([255, 150, 50], [255, 214, 110], clamp(1 - rv / 0.015, 0, 1));
          else if (rv < 0.036) c = mix(c, [210, 70, 30], (0.036 - rv) / 0.021 * 0.7);
        } else if (mode === 'desert') {
          c = ramp(RAMP.desert, hh);
          const ph = (x * 0.8 + y * 0.45) / 24 + nz.fbm(x / 130, y / 130, 3) * 4.5, fr = ph - Math.floor(ph);
          c = fr < 0.7 ? mix(c, [244, 222, 160], (fr / 0.7) * 0.35) : mix(c, [150, 108, 60], ((fr - 0.7) / 0.3) * 0.5);
          if (hh > 0.8) c = mix(c, [168, 120, 76], 0.35);
        } else if (mode === 'swamp') {
          const v = f + clamp(1 - dm / 48, 0, 1) * 0.35;
          if (v < 0.47) {
            wat = 1; c = mix([46, 62, 76], [96, 122, 128], clamp((0.47 - v) * 7, 0, 1));
            c = mix(c, [120, 140, 100], 1 - clamp((0.47 - v) * 22, 0, 1) * 1);
          } else c = ramp(RAMP.swamp, hh);
        } else { // sea / stormsea
          const v = isl + (f - 0.5) * 0.6;
          const storm = mode === 'stormsea';
          if (v > 0.22) {
            const e = clamp((v - 0.22) / 0.55, 0, 1);
            c = ramp(storm ? RAMP.stormland : RAMP.land, e); hh = e;
          } else {
            wat = 1; const dep = clamp((0.22 - v) / 0.6, 0, 1);
            c = ramp(storm ? RAMP.stormwater : RAMP.shallow, dep);
            if (v > 0.15) c = mix(c, storm ? [150, 170, 220] : [170, 220, 232], (v - 0.15) / 0.07 * 0.6);
          }
        }
        hgt[i] = hh; water[i] = wat;
        d[o] = c[0]; d[o + 1] = c[1]; d[o + 2] = c[2]; d[o + 3] = 255;
      }
    }
    // đổ bóng (ánh sáng từ góc trên-trái)
    const K = { mountain: 7, lava: 3, plain: 2.2, forest: 2.4, desert: 1.8, ice: 2, swamp: 1.4 }[mode] || (sea ? 2.2 : 2);
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x; if (water[i]) continue;
        const sh = 1 + (hgt[i - W - 1] - hgt[i + W + 1]) * K, o = i * 4;
        d[o] = clamp(d[o] * sh, 0, 255); d[o + 1] = clamp(d[o + 1] * sh, 0, 255); d[o + 2] = clamp(d[o + 2] * sh, 0, 255);
      }
    }
    return { img, hgt, water, dmin, river };
  }

  // ---------- hoạ tiết ----------
  function tree(ctx, x, y, s, dark, light) {
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x + 1, y + 3 * s, 3.4 * s, 1.5 * s, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#4a3322'; ctx.fillRect(x - 0.6 * s, y, 1.2 * s, 3 * s);
    ctx.fillStyle = dark; ctx.beginPath(); ctx.arc(x, y - 1 * s, 3.6 * s, 0, 7); ctx.fill();
    ctx.fillStyle = light; ctx.beginPath(); ctx.arc(x - 1 * s, y - 2 * s, 2 * s, 0, 7); ctx.fill();
  }
  function pine(ctx, x, y, s, dark, light) {
    ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(x + 1, y + 3 * s, 3 * s, 1.2 * s, 0, 0, 7); ctx.fill();
    ctx.fillStyle = dark;
    for (let k = 0; k < 3; k++) { const yy = y + 2 * s - k * 2.6 * s, w = (3.4 - k * 0.8) * s; ctx.beginPath(); ctx.moveTo(x - w, yy); ctx.lineTo(x + w, yy); ctx.lineTo(x, yy - 3.4 * s); ctx.fill(); }
    ctx.fillStyle = light; ctx.beginPath(); ctx.moveTo(x - 0.4, y - 4 * s); ctx.lineTo(x, y - 6 * s); ctx.lineTo(x + 0.4, y - 4 * s); ctx.fill();
  }
  function peak(ctx, x, y, s, snow) {
    const w = 11 * s, hgt = 14 * s;
    ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(x + 3, y + 1, w * 0.9, 2.5 * s, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#7b7f86'; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.lineTo(x, y - hgt); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#9ea3ab'; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.lineTo(x, y - hgt); ctx.lineTo(x - 1.5 * s, y); ctx.closePath(); ctx.fill();
    if (snow) { ctx.fillStyle = '#f4f7fb'; ctx.beginPath(); ctx.moveTo(x - 4 * s, y - hgt + 5.2 * s); ctx.lineTo(x, y - hgt); ctx.lineTo(x + 4 * s, y - hgt + 5.2 * s); ctx.lineTo(x + 1.5 * s, y - hgt + 4 * s); ctx.lineTo(x - 1 * s, y - hgt + 5.4 * s); ctx.closePath(); ctx.fill(); }
  }
  function hill(ctx, x, y, s) {
    ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(x + 2, y + 1, 9 * s, 2.5 * s, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#7e9a58'; ctx.beginPath(); ctx.ellipse(x, y, 8 * s, 4.6 * s, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#a2b672'; ctx.beginPath(); ctx.ellipse(x - 2 * s, y - 1 * s, 4 * s, 2.4 * s, 0, Math.PI, 0); ctx.fill();
  }
  function volcano(ctx, x, y, s) {
    const w = 18 * s, hg = 20 * s;
    ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(x + 4, y + 1, w, 3 * s, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#3a2b27'; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.lineTo(x - 4 * s, y - hg); ctx.lineTo(x + 4 * s, y - hg); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#54403a'; ctx.beginPath(); ctx.moveTo(x - w, y); ctx.lineTo(x - 4 * s, y - hg); ctx.lineTo(x - 7 * s, y - hg + 6 * s); ctx.lineTo(x - 5 * s, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ff9a30'; ctx.beginPath(); ctx.ellipse(x, y - hg, 4.4 * s, 1.6 * s, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#ff7a20'; ctx.lineWidth = 1.2 * s; ctx.beginPath(); ctx.moveTo(x + 1, y - hg); ctx.quadraticCurveTo(x + 6 * s, y - hg * 0.5, x + 5 * s, y - 2); ctx.stroke();
    ctx.fillStyle = 'rgba(70,60,58,.55)';
    for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(x + 2 + k * 4 * s, y - hg - 5 * s - k * 5 * s, (3 + k) * s, 0, 7); ctx.fill(); }
  }
  function dune(ctx, x, y, s) {
    ctx.strokeStyle = 'rgba(150,108,56,.55)'; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(x, y + 8 * s, 9 * s, Math.PI * 1.15, Math.PI * 1.9); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,240,190,.5)'; ctx.beginPath(); ctx.arc(x - 1, y + 7 * s, 9 * s, Math.PI * 1.2, Math.PI * 1.7); ctx.stroke();
  }
  function cactus(ctx, x, y, s) {
    ctx.fillStyle = '#5f8a4c'; ctx.fillRect(x - 1 * s, y - 5 * s, 2 * s, 7 * s); ctx.fillRect(x - 3.4 * s, y - 3 * s, 1.6 * s, 3 * s); ctx.fillRect(x + 1.8 * s, y - 4 * s, 1.6 * s, 3 * s);
    ctx.fillRect(x - 3.4 * s, y - 1.6 * s, 2.4 * s, 1.4 * s); ctx.fillRect(x + 1 * s, y - 2.6 * s, 2.4 * s, 1.4 * s);
  }
  function snowMound(ctx, x, y, s) {
    ctx.fillStyle = 'rgba(120,160,200,.35)'; ctx.beginPath(); ctx.ellipse(x + 2, y + 1, 8 * s, 2 * s, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#fbfdff'; ctx.beginPath(); ctx.ellipse(x, y, 7 * s, 3.4 * s, 0, Math.PI, 0); ctx.fill();
  }
  function shard(ctx, x, y, s) {
    ctx.fillStyle = '#a9dcf0'; ctx.beginPath(); ctx.moveTo(x - 2 * s, y); ctx.lineTo(x - 0.5 * s, y - 8 * s); ctx.lineTo(x + 0.5 * s, y - 5 * s); ctx.lineTo(x + 3 * s, y - 9 * s); ctx.lineTo(x + 3.5 * s, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e6f7ff'; ctx.beginPath(); ctx.moveTo(x - 0.5 * s, y - 8 * s); ctx.lineTo(x + 0.5 * s, y - 5 * s); ctx.lineTo(x, y); ctx.lineTo(x - 2 * s, y); ctx.closePath(); ctx.fill();
  }
  function reed(ctx, x, y, s) {
    ctx.strokeStyle = '#6e7d46'; ctx.lineWidth = 0.9;
    for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(x + k * 1.6 * s, y + 2 * s); ctx.lineTo(x + k * 2.6 * s, y - 6 * s); ctx.stroke(); }
    ctx.fillStyle = '#8a6a3c'; ctx.fillRect(x - 0.6 * s, y - 6.4 * s, 1.2 * s, 2.4 * s); ctx.fillRect(x + 1.8 * s, y - 6.4 * s, 1.2 * s, 2.4 * s);
  }
  function deadTree(ctx, x, y, s) {
    ctx.strokeStyle = '#3c3a38'; ctx.lineWidth = 1.2; ctx.beginPath();
    ctx.moveTo(x, y + 3 * s); ctx.lineTo(x, y - 5 * s); ctx.moveTo(x, y - 2 * s); ctx.lineTo(x - 3 * s, y - 5 * s); ctx.moveTo(x, y - 3 * s); ctx.lineTo(x + 2.6 * s, y - 6 * s); ctx.stroke();
  }
  function lily(ctx, x, y, s) { ctx.fillStyle = '#6b8a4c'; ctx.beginPath(); ctx.ellipse(x, y, 3 * s, 1.5 * s, 0, 0, 7); ctx.fill(); }
  function wave(ctx, x, y, s, col) {
    ctx.strokeStyle = col; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.moveTo(x - 4 * s, y); ctx.quadraticCurveTo(x - 2 * s, y - 2.4 * s, x, y); ctx.quadraticCurveTo(x + 2 * s, y + 2.4 * s, x + 4 * s, y); ctx.stroke();
  }
  function ship(ctx, x, y, s) {
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x + 1, y + 3, 5 * s, 1.2 * s, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#6a4a30'; ctx.beginPath(); ctx.moveTo(x - 5 * s, y); ctx.lineTo(x + 5 * s, y); ctx.lineTo(x + 3 * s, y + 2.6 * s); ctx.lineTo(x - 3 * s, y + 2.6 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#f2ead6'; ctx.beginPath(); ctx.moveTo(x, y - 8 * s); ctx.lineTo(x + 4 * s, y - 1 * s); ctx.lineTo(x, y - 1 * s); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#d9d0b8'; ctx.beginPath(); ctx.moveTo(x - 0.8, y - 6 * s); ctx.lineTo(x - 3.6 * s, y - 1 * s); ctx.lineTo(x - 0.8, y - 1 * s); ctx.closePath(); ctx.fill();
  }
  function cloud(ctx, x, y, s) {
    ctx.fillStyle = 'rgba(40,46,84,.5)';
    [[0, 0, 9], [8, -2, 7], [-8, 1, 7], [3, -5, 7]].forEach(a => { ctx.beginPath(); ctx.ellipse(x + a[0] * s, y + a[1] * s, a[2] * s, a[2] * 0.6 * s, 0, 0, 7); ctx.fill(); });
  }
  function bolt(ctx, x, y, s) {
    ctx.fillStyle = 'rgba(255,240,150,.9)'; ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(x, y - 10 * s); ctx.lineTo(x - 4 * s, y); ctx.lineTo(x - 0.5 * s, y); ctx.lineTo(x - 3 * s, y + 9 * s); ctx.lineTo(x + 4 * s, y - 2 * s); ctx.lineTo(x + 0.5 * s, y - 2 * s); ctx.lineTo(x + 3 * s, y - 10 * s); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  function field(ctx, x, y, w, h, a, b) {
    ctx.fillStyle = a; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = b;
    for (let yy = y + 1; yy < y + h; yy += 3) ctx.fillRect(x, yy, w, 1.2);
    ctx.strokeStyle = 'rgba(70,56,30,.5)'; ctx.lineWidth = 0.6; ctx.strokeRect(x, y, w, h);
  }

  // ---------- vết riêng của từng loại địa điểm ----------
  function glow(ctx, x, y, r, c0, c1) {
    const g = ctx.createRadialGradient(x, y, 2, x, y, r); g.addColorStop(0, c0); g.addColorStop(1, c1);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  }
  function placeMark(ctx, p, cfg, rnd) {
    const mode = cfg.mode, sea = mode === 'sea' || mode === 'stormsea', t = p.type, x = p.x, y = p.y;
    const f1 = mode === 'desert' ? '#cdb06a' : '#c8b26a', f2 = mode === 'desert' ? '#b79a52' : '#9bb065';
    switch (t) {
      case 'thanh_tri': {
        if (!sea) glow(ctx, x, y, 40, 'rgba(210,190,140,.75)', 'rgba(210,190,140,0)');
        if (mode === 'plain' || mode === 'forest' || mode === 'swamp') {
          for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283 + 0.3, r = 52 + rnd() * 14; field(ctx, x + Math.cos(a) * r - 9, y + Math.sin(a) * r * 0.8 - 6, 18, 12, k % 2 ? f1 : f2, 'rgba(60,70,20,.25)'); }
        }
        break;
      }
      case 'thon_tran': {
        glow(ctx, x, y, 30, 'rgba(200,180,130,.6)', 'rgba(200,180,130,0)');
        if (mode === 'plain' || mode === 'forest' || mode === 'swamp') for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283 + 1, r = 34 + rnd() * 8; field(ctx, x + Math.cos(a) * r - 7, y + Math.sin(a) * r * 0.8 - 5, 14, 10, k % 2 ? f1 : f2, 'rgba(60,70,20,.25)'); }
        break;
      }
      case 'ben': case 'tram': {
        if (!sea) {
          ctx.fillStyle = 'rgba(210,196,150,.85)'; ctx.beginPath(); ctx.ellipse(x - 30, y + 14, 30, 17, 0.2, 0, 7); ctx.fill();
          ctx.fillStyle = mode === 'swamp' ? '#58707a' : '#4f8fc4'; ctx.beginPath(); ctx.ellipse(x - 30, y + 14, 25, 12, 0.2, 0, 7); ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(x - 34, y + 13, 6, 0, 3); ctx.stroke();
        }
        break;
      }
      case 'thuong_doan': case 'phuong': glow(ctx, x, y, 34, 'rgba(214,190,130,.7)', 'rgba(214,190,130,0)'); break;
      case 'tong_mon': {
        glow(ctx, x, y, 56, 'rgba(240,230,170,.45)', 'rgba(240,230,170,0)');
        ctx.strokeStyle = 'rgba(255,250,200,.28)'; ctx.lineWidth = 1.2;
        [28, 40].forEach(r => { ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.7, 0, 0, 7); ctx.stroke(); });
        break;
      }
      case 'bo_toc': {
        glow(ctx, x, y, 34, 'rgba(120,88,56,.6)', 'rgba(120,88,56,0)');
        for (let k = 0; k < 4; k++) { const a = k / 4 * 6.283 + 0.7, tx = x + Math.cos(a) * 30, ty = y + Math.sin(a) * 22; ctx.fillStyle = k % 2 ? '#b0783e' : '#8a5a34'; ctx.beginPath(); ctx.moveTo(tx - 5, ty + 3); ctx.lineTo(tx, ty - 6); ctx.lineTo(tx + 5, ty + 3); ctx.closePath(); ctx.fill(); }
        break;
      }
      case 'linh_mach': {
        glow(ctx, x, y, 66, 'rgba(150,215,255,.8)', 'rgba(120,190,255,0)');
        ctx.strokeStyle = 'rgba(230,248,255,.6)'; ctx.lineWidth = 1;
        for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(x, y, 20 + k * 11, 0, 7); ctx.stroke(); }
        for (let k = 0; k < 8; k++) { const a = rnd() * 6.283, r = 22 + rnd() * 34; ctx.fillStyle = 'rgba(235,250,255,.9)'; ctx.fillRect(x + Math.cos(a) * r, y + Math.sin(a) * r, 1.6, 1.6); }
        break;
      }
      case 'bi_canh': {
        glow(ctx, x, y, 60, 'rgba(190,120,255,.7)', 'rgba(170,100,240,0)');
        ctx.strokeStyle = 'rgba(235,205,255,.55)'; ctx.lineWidth = 1.1; ctx.beginPath();
        for (let a = 0; a < 12; a += 0.2) { const r = 4 + a * 4; const px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * 0.8; if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
        ctx.stroke();
        break;
      }
      case 'hung_dia': {
        glow(ctx, x, y, 52, 'rgba(120,20,20,.6)', 'rgba(120,20,20,0)');
        for (let k = 0; k < 9; k++) { const a = rnd() * 6.283, r = 14 + rnd() * 30; ctx.fillStyle = 'rgba(232,224,204,.85)'; ctx.fillRect(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.8, 2.4, 1.2); }
        break;
      }
      case 'tan_tich': {
        glow(ctx, x, y, 40, 'rgba(150,146,134,.7)', 'rgba(150,146,134,0)');
        for (let k = 0; k < 5; k++) { const a = k / 5 * 6.283, r = 24 + rnd() * 8, px = x + Math.cos(a) * r, py = y + Math.sin(a) * r * 0.8, hh = 4 + rnd() * 6; ctx.fillStyle = '#bdb8a6'; ctx.fillRect(px - 2, py - hh, 4, hh); ctx.fillStyle = '#8f8b7c'; ctx.fillRect(px + 0.5, py - hh, 1.5, hh); }
        break;
      }
      case 'mo': {
        glow(ctx, x, y, 38, 'rgba(110,100,92,.75)', 'rgba(110,100,92,0)');
        for (let k = 0; k < 10; k++) { const a = rnd() * 6.283, r = 14 + rnd() * 24; ctx.fillStyle = k % 3 ? '#4d4743' : '#a6a29c'; ctx.beginPath(); ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r * 0.8, 1.6 + rnd() * 1.6, 0, 7); ctx.fill(); }
        break;
      }
      case 'cho_den': glow(ctx, x, y, 34, 'rgba(40,30,60,.65)', 'rgba(40,30,60,0)'); break;
      case 'cua_ai': {
        ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(x - 36, y + 12, 72, 6);
        ctx.fillStyle = '#9b958a'; ctx.fillRect(x - 36, y + 4, 72, 10);
        ctx.fillStyle = '#c0baae'; for (let k = 0; k < 8; k++) ctx.fillRect(x - 36 + k * 9.5, y, 5, 5);
        break;
      }
    }
  }

  // ---------- rắc hoạ tiết ----------
  function scatter(ctx, cfg, base, places, nz, rnd) {
    const { water, hgt, dmin } = base, mode = cfg.mode;
    const pts = [];
    const spacing = { forest: 8, mountain: 17, plain: 15, ice: 20, lava: 24, desert: 26, swamp: 12, sea: 28, stormsea: 30 }[mode];
    const want = { forest: 1300, mountain: 300, plain: 140, ice: 120, lava: 40, desert: 90, swamp: 260, sea: 70, stormsea: 70 }[mode];
    const cell = spacing, gw = Math.ceil(W / cell), gh = Math.ceil(H / cell), grid = {};
    const ok = (x, y) => { const cx = (x / cell) | 0, cy = (y / cell) | 0; for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const q = grid[(cy + b) * gw + cx + a]; if (q && (q[0] - x) * (q[0] - x) + (q[1] - y) * (q[1] - y) < spacing * spacing) return false; } return true; };
    for (let tries = 0; tries < want * 14 && pts.length < want; tries++) {
      const x = 8 + rnd() * (W - 16), y = 10 + rnd() * (H - 20), i = (y | 0) * W + (x | 0);
      if (dmin[i] < (mode === 'forest' ? 26 : 34)) continue;
      const wat = water[i], h = hgt[i];
      if (mode === 'sea' || mode === 'stormsea') { if (!wat) { if (rnd() < 0.8) continue; } }
      else if (mode === 'swamp') { if (wat && rnd() < 0.4) continue; }
      else if (wat) continue;
      if (mode === 'plain' && nz.fbm(x / 55 + 4, y / 55, 3) < 0.55 && h < 0.78) continue;
      if (mode === 'mountain' && h < 0.4) continue;
      if (mode === 'forest' && nz.fbm(x / 40 + 8, y / 40, 3) < 0.34) continue;
      if (!ok(x, y)) continue;
      grid[((y / cell) | 0) * gw + ((x / cell) | 0)] = [x, y];
      pts.push([x, y, h, wat, rnd()]);
    }
    pts.sort((a, b) => a[1] - b[1]);
    pts.forEach(q => {
      const x = q[0], y = q[1], h = q[2], wat = q[3], r = q[4], s = 0.8 + r * 0.5;
      switch (mode) {
        case 'plain': h > 0.78 ? hill(ctx, x, y, s) : (r < 0.7 ? tree(ctx, x, y, s, '#3d7a3c', '#68a653') : pine(ctx, x, y, s, '#2f6a38', '#7fb26a')); break;
        case 'forest': r < 0.5 ? tree(ctx, x, y, s, '#24592d', '#4d9a4c') : pine(ctx, x, y, s, '#1f4d2b', '#5aa05a'); break;
        case 'mountain': h > 0.62 ? peak(ctx, x, y, 0.7 + h * 0.7, h > 0.74) : (r < 0.4 ? pine(ctx, x, y, s * 0.9, '#35563f', '#6d9a68') : peak(ctx, x, y, 0.55 + r * 0.35, false)); break;
        case 'ice': r < 0.5 ? snowMound(ctx, x, y, s) : shard(ctx, x, y, s); break;
        case 'lava': r < 0.35 ? volcano(ctx, x, y, 0.8 + r) : peak(ctx, x, y, 0.5 + r * 0.3, false); break;
        case 'desert': r < 0.55 ? dune(ctx, x, y, s) : (r < 0.8 ? cactus(ctx, x, y, s) : peak(ctx, x, y, 0.45, false)); break;
        case 'swamp': wat ? lily(ctx, x, y, s) : (r < 0.6 ? reed(ctx, x, y, s) : deadTree(ctx, x, y, s)); break;
        case 'sea': wat ? (r < 0.15 ? ship(ctx, x, y, 0.8) : wave(ctx, x, y, s, 'rgba(235,248,255,.45)')) : (r < 0.5 ? pine(ctx, x, y, s * 0.9, '#2f6a44', '#6aa86a') : tree(ctx, x, y, s * 0.9, '#3d7a4c', '#74b064')); break;
        case 'stormsea': wat ? (r < 0.22 ? cloud(ctx, x, y, s) : r < 0.38 ? bolt(ctx, x, y, s * 0.8) : wave(ctx, x, y, s, 'rgba(180,196,255,.4)')) : (r < 0.5 ? peak(ctx, x, y, 0.5, false) : deadTree(ctx, x, y, s)); break;
      }
    });
    // sương mù tím cho đầm lầy
    if (mode === 'swamp') {
      for (let k = 0; k < 14; k++) glow(ctx, rnd() * W, rnd() * H, 60 + rnd() * 60, 'rgba(150,130,190,.22)', 'rgba(150,130,190,0)');
    }
    if (mode === 'ice') for (let k = 0; k < 8; k++) glow(ctx, rnd() * W, rnd() * H, 70, 'rgba(200,255,240,.14)', 'rgba(200,255,240,0)');
    if (mode === 'lava') for (let k = 0; k < 10; k++) glow(ctx, rnd() * W, rnd() * H, 80, 'rgba(60,50,50,.28)', 'rgba(60,50,50,0)');
  }

  // ---------- dựng toàn bộ ----------
  const cache = {};
  function build(rid, places, cb) {
    const cfg = CFG[rid]; if (!cfg) return null;
    const t0 = Date.now();
    const nz = noiseMaker(hashStr(rid)), rnd = mulberry(hashStr(rid + 'decor'));
    const base = baseLayer(rid, cfg, places, nz);
    const small = document.createElement('canvas'); small.width = W; small.height = H;
    small.getContext('2d').putImageData(base.img, 0, 0);
    const cv = document.createElement('canvas'); cv.width = W * S; cv.height = H * S;
    const ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(small, 0, 0, W * S, H * S);
    ctx.setTransform(S, 0, 0, S, 0, 0);
    places.forEach(p => placeMark(ctx, p, cfg, rnd));
    scatter(ctx, cfg, base, places, nz, rnd);
    // viền tối
    const g = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, W * 0.72);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.45)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // tên địa danh: chọn chỗ trống xa địa điểm nhất
    const labels = [], names = cfg.names.slice();
    names.forEach((name, idx) => {
      let best = null, bs = -1;
      const mg = 50 + name.length * 6;
      for (let y = 60; y < H - 50; y += 18) for (let x = mg; x < W - mg; x += 22) {
        let sc = 1e9; places.forEach(p => { sc = Math.min(sc, Math.hypot(p.x - x, (p.y - y) * 1.3)); });
        labels.forEach(l => { sc = Math.min(sc, Math.hypot(l.x - x, (l.y - y) * 1.3) * 0.7); });
        if (sc > bs) { bs = sc; best = { x, y, name }; }
      }
      // sông: đặt tên sông ở giữa dòng
      if (name === 'Hoàng Hà' && base.river) { const m = base.river[Math.floor(base.river.length / 2)]; best = { x: m[0], y: m[1] - 12, name }; }
      if (best) labels.push(best);
    });
    const out = { labels, url: null, ms: Date.now() - t0 };
    cache[rid] = out;
    cv.toBlob(b => { out.url = URL.createObjectURL(b); cb && cb(out); }, 'image/jpeg', 0.9);
    return out;
  }

  ui.terrain = {
    has: rid => !!CFG[rid],
    mode: rid => CFG[rid] && CFG[rid].mode,
    // trả về {labels, url|null}; cb được gọi khi ảnh sẵn sàng
    get(rid, places, cb) {
      const c = cache[rid];
      if (c) { if (c.url) cb && cb(c); else c.wait = (c.wait || []).concat(cb || []); return c; }
      const o = build(rid, places, res => { cb && cb(res); (o.wait || []).forEach(f => f && f(res)); });
      return o;
    }
  };
})();
