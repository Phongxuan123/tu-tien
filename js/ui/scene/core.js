// Cảnh pixel thủy mặc, phần lõi dùng chung: cấu hình kích thước (một chỗ), bút vẽ pixel, bảng màu, bộ đệm lớp có chuyển cảnh mượt, đo khung.
// Mọi module cảnh (js/ui/scene/*.js) gắn vào TT.ui.sc; js/ui/scene.js ghép lại và giữ API TT.ui.scene.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const sc = ui.sc = ui.sc || {};

  // ---------- cấu hình: đổi kích thước cảnh chỉ sửa ở đây ----------
  // W, H: độ phân giải canvas (CSS phóng lên). GY: y của mặt đất. TW: bề rộng mảnh lặp của các lớp xa. PAD: lề dư. FPS: số khung mỗi giây.
  const CFG = sc.CFG = { W: 480, H: 144, GY: 124, TW: 960, PAD: 24, FPS: 30 };
  const W = CFG.W, H = CFG.H;

  // ---------- tiện ích ----------
  const clamp = sc.clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const lerp = sc.lerp = (a, b, t) => a + (b - a) * t;
  const smooth = sc.smooth = t => t * t * (3 - 2 * t);
  const hexCache = {};
  const px = h => hexCache[h] || (hexCache[h] = [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
  const toHex = sc.toHex = a => '#' + a.map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
  const mix = sc.mix = (a, b, t) => { const A = px(a), B = px(b); return toHex([A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t]); };
  // bộ số ngẫu nhiên riêng cho hình (không dùng rng của mô phỏng)
  sc.mulberry = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  sc.hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
  sc.strSeed = str => { let h = 7; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0; return Math.abs(h); };
  const mk = sc.mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

  // ---------- bút vẽ pixel (vẽ lên sc.g, đặt bằng sc.use) ----------
  let g = null;
  sc.use = c => { g = c; return c; };
  sc.cur = () => g;
  const rr = Math.round;
  const R = sc.R = (x, y, w, h, c) => { if (w <= 0 || h <= 0) return; g.fillStyle = c; g.fillRect(rr(x), rr(y), w, h); };
  sc.P = (x, y, c) => { g.fillStyle = c; g.fillRect(rr(x), rr(y), 1, 1); };
  sc.disc = (cx, cy, r, c) => { g.fillStyle = c; cx = rr(cx); cy = rr(cy); for (let dy = -r; dy <= r; dy++) { const hw = Math.floor(Math.sqrt(r * r - dy * dy + r * 0.6)); g.fillRect(cx - hw, cy + dy, hw * 2 + 1, 1); } };
  sc.ell = (cx, cy, rx, ry, c) => { g.fillStyle = c; cx = rr(cx); cy = rr(cy); for (let dy = -ry; dy <= ry; dy++) { const hw = Math.floor(rx * Math.sqrt(Math.max(0, 1 - dy * dy / (ry * ry + 0.01))) + 0.5); g.fillRect(cx - hw, cy + dy, hw * 2 + 1, 1); } };
  sc.line = (x0, y0, x1, y1, c, w) => {
    w = w || 1; g.fillStyle = c; x0 = rr(x0); y0 = rr(y0); x1 = rr(x1); y1 = rr(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy;
    for (let n = 0; n < 2000; n++) { g.fillRect(x0, y0, w, w); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
  };
  const patCache = {};
  sc.dither = (x, y, w, h, c) => { // lưới ô cờ 50%
    let p = patCache[c]; if (!p) { const t = mk(2, 2), q = t.getContext('2d'); q.fillStyle = c; q.fillRect(0, 0, 1, 1); q.fillRect(1, 1, 1, 1); p = patCache[c] = g.createPattern(t, 'repeat'); }
    g.fillStyle = p; g.fillRect(x, y, w, h);
  };
  sc.vgrad = (x, y, w, h, c0, c1, bh) => { // dải màu theo bậc, rìa bậc có ô cờ
    bh = bh || 6; const n = Math.ceil(h / bh);
    for (let i = 0; i < n; i++) {
      const yy = y + i * bh, hh = Math.min(bh, y + h - yy), c = mix(c0, c1, (i + 0.5) / n), cn = mix(c0, c1, Math.min(1, (i + 1.5) / n));
      R(x, yy, w, hh, c); if (i < n - 1 && hh >= 2) sc.dither(x, yy + hh - 2, w, 2, cn);
    }
  };

  // ---------- bảng màu: 25 sắc + vài số, đổi theo pha / địa hình ----------
  const KEYS = sc.KEYS = ['sky0', 'sky1', 'sky2', 'mist', 'm1', 'm2', 'm3', 'm4', 'rockLt', 'rockDk', 'pine', 'pineLt', 'cloudLt', 'cloudMd', 'cloudDk', 'roof', 'roofLt', 'wall', 'wood', 'woodDk', 'gold', 'lamp', 'ink', 'jade', 'sun'];
  const NUMS = sc.NUMS = ['sunA', 'sunX', 'sunY', 'sunR', 'moonA', 'starA', 'lit', 'fire', 'amb'];
  sc.mkPal = (s, n) => { const o = {}, a = s.split(' '); KEYS.forEach((k, i) => o[k] = a[i]); NUMS.forEach((k, i) => o[k] = n[i]); return o; };
  sc.lerpPal = (a, b, t) => { const o = {}; KEYS.forEach(k => o[k] = t <= 0 ? a[k] : t >= 1 ? b[k] : mix(a[k], b[k], t)); NUMS.forEach(k => o[k] = lerp(a[k], b[k], t)); return o; };

  // ---------- bộ đệm lớp + chuyển cảnh mượt ----------
  // fade.v chạy 0..1 sau mỗi lần dựng lại lớp tĩnh. Chế độ: 0 = lớp mới hiện dần lên trên lớp cũ (đổi giờ), 1 = hòa chéo (đổi địa hình), 2 = thay ngay.
  const fade = sc.fade = { v: 1, dur: 1.3 };
  sc.Buf = class Buf {
    constructor(w, h) { this.w = w; this.h = h; this.cur = mk(w, h); this.prev = mk(w, h); this.has = false; this.mode = 0; }
    begin(mode) { const t = this.prev; this.prev = this.cur; this.cur = t; this.has = true; this.mode = mode; const c = this.cur.getContext('2d'); c.clearRect(0, 0, this.w, this.h); return c; }
    draw(ctx, x, y, a) {
      a = a === undefined ? 1 : a;
      if (fade.v < 1 && this.has && this.mode !== 2) {
        const e = smooth(fade.v);
        ctx.globalAlpha = this.mode === 1 ? a * (1 - e) : a; ctx.drawImage(this.prev, x, y);
        ctx.globalAlpha = a * e; ctx.drawImage(this.cur, x, y);
      } else { ctx.globalAlpha = a; ctx.drawImage(this.cur, x, y); }
      ctx.globalAlpha = 1;
    }
  };
  // các lớp tĩnh (dựng một lần theo khóa, mỗi khung chỉ chép lên canvas)
  sc.B = {
    sky: new sc.Buf(W, H), high: new sc.Buf(CFG.TW, 60), far: new sc.Buf(CFG.TW, H), mid: new sc.Buf(CFG.TW, H), flt: new sc.Buf(CFG.TW, H),
    near: new sc.Buf(W + CFG.PAD * 2, H), sea: new sc.Buf(CFG.TW, 96), water: new sc.Buf(CFG.TW, 48), front: new sc.Buf(CFG.TW, 44), fog: new sc.Buf(CFG.TW, 34),
    arch: new sc.Buf(W, H), over: new sc.Buf(W, H)
  };
  // vẽ một lớp lặp (rộng TW) trượt theo off px
  sc.strip = (ctx, buf, off, y, a) => { const TW = CFG.TW; const x = -(((Math.round(off) % TW) + TW) % TW); buf.draw(ctx, x, y, a); if (x + TW < W) buf.draw(ctx, x + TW, y, a); };

  // ---------- đo khung (hiện khi ?debug=1) ----------
  const perf = sc.perf = { a: [], n: 0, avg: 0, p95: 0, max: 0, rebuild: 0, rebuilds: 0 };
  sc.perfRec = ms => {
    perf.a.push(ms); if (perf.a.length > 240) perf.a.shift(); perf.n++;
    if (perf.n % 15 === 0) { const s = perf.a.slice().sort((x, y) => x - y); perf.avg = s.reduce((p, c) => p + c, 0) / s.length; perf.p95 = s[Math.floor(s.length * 0.95)]; perf.max = s[s.length - 1]; }
  };

  // ---------- giảm hiệu ứng (prefers-reduced-motion) ----------
  const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  sc.reduced = !!(mq && mq.matches);
  if (mq && mq.addEventListener) mq.addEventListener('change', e => { sc.reduced = e.matches; });
  sc.FX = () => sc.reduced ? 0.35 : 1; // hệ số mật độ hạt / biên độ rung
})();
