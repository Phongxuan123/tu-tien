// Âm thanh: nhạc nền theo bối cảnh và hiệu ứng nghe từ bus sự kiện.
// Chỉ nghe, không đổi trạng thái mô phỏng, không gọi TT.rng (dùng Math.random riêng). Chỉ nạp cùng giao diện, nên kiểm thử và mô phỏng không đụng tới.
// Cài đặt (bật/tắt, âm lượng) lưu ở localStorage, không nằm trong bản lưu game. Bảng sự kiện: ke-hoach/T-am-thanh.md.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};

  const BASE = 'assets/audio/nhac/';
  // [tên tệp, trọng số]: bài đầu phát nhiều hơn, các bài sau xen kẽ cho đa dạng.
  const LISTS = {
    binh: [['binh-1', 3], ['binh-2', 1], ['binh-3', 1]],
    tong: [['tong-1', 3], ['tong-2', 1]],
    chien: [['chien-1', 3], ['chien-2', 1]]
  };
  const FADE = 3000;          // ms chuyển mượt giữa hai bài
  const CHIEN_HOLD = 30000;   // ms giữ nhạc giao chiến sau một trận quan trọng
  const KEY = 'tt8b_audio';

  let S = { on: true, music: 0.6, sfx: 0.8 };
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) { /* bỏ qua */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* bỏ qua */ } };

  let unlocked = false, chienUntil = 0;

  // ---------------------------------------------------------------- nhạc nền
  const players = [];
  const lastTrack = {};
  let curP = null;

  function pickTrack(mood) {
    const all = LISTS[mood];
    let pool = all.filter(t => t[0] !== lastTrack[mood]);
    if (!pool.length) pool = all;
    let r = Math.random() * pool.reduce((s, t) => s + t[1], 0);
    for (const t of pool) { r -= t[1]; if (r <= 0) return t[0]; }
    return pool[0][0];
  }

  function startTrack(mood) {
    const name = pickTrack(mood);
    lastTrack[mood] = name;
    const el = new Audio(BASE + name + '.ogg');
    el.preload = 'auto'; el.volume = 0;
    const p = { el, mood, name, f: 0, dir: 1, queued: false };
    players.push(p);
    const pr = el.play();
    if (pr && pr.catch) pr.catch(() => { p.dir = -1; p.f = 0; if (curP === p) curP = null; });
    el.addEventListener('error', () => { p.dir = -1; p.f = 0; if (curP === p) curP = null; });
    el.addEventListener('ended', () => { if (curP === p) change(p.mood); });
    return p;
  }

  function change(mood) {
    if (curP) curP.dir = -1;
    curP = startTrack(mood);
  }

  function stopAll() { if (curP) { curP.dir = -1; curP = null; } }

  // Bối cảnh hiện tại: thiên kiếp giữ nguyên nhạc đang phát; thám hiểm hoặc vừa giao chiến thì nhạc giao chiến; ở tông môn thì nhạc tông môn; còn lại là bình.
  function decideMood() {
    const p = TT.player && TT.player();
    if (!p) return 'binh';
    if (p.tri) return curP ? curP.mood : 'binh';
    if (p.dungeon || Date.now() < chienUntil) return 'chien';
    const pl = p.place && !p.travel && !p.cross && TT.map ? TT.map.place(p.place) : null;
    if (pl && pl.type === 'tong_mon') return 'tong';
    return 'binh';
  }

  function poll() {
    if (!S.on || !unlocked) { stopAll(); return; }
    const m = decideMood();
    if (!curP || curP.mood !== m) change(m);
  }

  setInterval(() => {
    for (let i = players.length - 1; i >= 0; i--) {
      const p = players[i];
      p.f = Math.max(0, Math.min(1, p.f + p.dir * 100 / FADE));
      p.el.volume = Math.max(0, Math.min(1, p.f * S.music));
      if (p === curP && !p.queued && p.el.duration && p.el.duration - p.el.currentTime < FADE / 1000 + 0.2) { p.queued = true; change(p.mood); }
      if (p.dir < 0 && p.f <= 0) { p.el.pause(); p.el.removeAttribute('src'); players.splice(i, 1); }
    }
  }, 100);
  setInterval(poll, 1000);

  // ------------------------------------------------------------- hiệu ứng (Web Audio)
  let ctx = null, sfxGain = null, reverb = null, noiseBuf = null;

  function ensureCtx() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    sfxGain = ctx.createGain();
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4;
    sfxGain.connect(comp); comp.connect(ctx.destination);
    const n = Math.floor(ctx.sampleRate * 2.4), ir = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let prev = 0; for (let i = 0; i < n; i++) { const q = i / n; prev += ((Math.random() * 2 - 1) - prev) * (0.55 - 0.5 * q); d[i] = prev * Math.pow(1 - q, 2.4); } }
    reverb = ctx.createConvolver(); reverb.buffer = ir;
    const wet = ctx.createGain(); wet.gain.value = 0.45; reverb.connect(wet); wet.connect(sfxGain);
    const m = Math.floor(ctx.sampleRate * 2); noiseBuf = ctx.createBuffer(1, m, ctx.sampleRate);
    const nd = noiseBuf.getChannelData(0); for (let i = 0; i < m; i++) nd[i] = Math.random() * 2 - 1;
    return ctx;
  }
  const vol = () => Math.pow(S.sfx, 2);
  function send(node, amt) { node.connect(sfxGain); if (amt) { const s = ctx.createGain(); s.gain.value = amt; node.connect(s); s.connect(reverb); } }

  function bell(freq, t, v, dur) {
    dur = dur || 1.6;
    [[1, 1], [2.76, 0.35], [5.4, 0.15]].forEach(p => {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = freq * p[0];
      g.gain.setValueAtTime(v * p[1] * vol(), t); g.gain.exponentialRampToValueAtTime(0.0005, t + dur / p[0] * 1.2);
      o.connect(g); send(g, 0.6); o.start(t); o.stop(t + dur + 0.1);
    });
  }
  function tone(type, f0, f1, t, dur, v) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type;
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    g.gain.setValueAtTime(v * vol(), t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); send(g, 0.3); o.start(t); o.stop(t + dur + 0.05);
  }
  function thud(t, v) { tone('sine', 120, 40, t, 0.4, v); }
  function wood(t, v, pitch) {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'square'; o.frequency.setValueAtTime(pitch, t); o.frequency.exponentialRampToValueAtTime(pitch * 0.6, t + 0.06);
    f.type = 'bandpass'; f.frequency.value = pitch * 1.5; f.Q.value = 4;
    g.gain.setValueAtTime(v * vol(), t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    o.connect(f); f.connect(g); send(g, 0); o.start(t); o.stop(t + 0.12);
  }
  // Nhiễu qua bộ lọc có tần số quét từ f0 tới f1.
  function sweep(type, f0, f1, t, dur, v, q) {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = type; f.Q.value = q || 1;
    f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, v * vol()), t + Math.min(0.06, dur / 3)); g.gain.exponentialRampToValueAtTime(0.0005, t + dur);
    s.connect(f); f.connect(g); send(g, 0.4); s.start(t, Math.random()); s.stop(t + dur + 0.1);
  }
  function thunder(t, v, len) { sweep('lowpass', 900, 50, t, len, v, 0.7); }
  function swell(t, dur, v) {
    [196, 294, 392].forEach(f => {
      const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
      o.type = 'triangle'; o.frequency.value = f; lp.type = 'lowpass'; lp.frequency.setValueAtTime(300, t); lp.frequency.exponentialRampToValueAtTime(2400, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * vol(), t + dur); g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.25);
      o.connect(lp); lp.connect(g); send(g, 0.5); o.start(t); o.stop(t + dur + 0.3);
    });
  }
  const PENT = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
  const hz = (base, n) => base * Math.pow(2, n / 12);
  function arp(base, notes, t, gap, v) { notes.forEach((n, i) => bell(hz(base, n), t + i * gap, v)); }

  const SFX = {
    'dotpha:bat-dau': t => swell(t, 1.4, 0.18),
    'dotpha:thanh-cong': (t, d) => {
      const r = d.realm || 1, n = r >= 6 ? 10 : r >= 3 ? 8 : 5;
      arp(330, PENT.slice(0, n), t, 0.09, 0.28);
      if (r >= 3) bell(165, t, 0.3, 3);
      if (r >= 6) bell(1320, t + 0.9, 0.3, 3);
    },
    'dotpha:that-bai': t => { thud(t, 0.6); tone('sine', 300, 70, t, 0.8, 0.25); bell(110, t, 0.3, 2); },
    'dotpha:doi-lai': t => { sweep('bandpass', 3000, 300, t, 0.4, 0.3, 3); bell(880, t + 0.3, 0.2); },
    'kiep:bat-dau': t => { thunder(t, 0.5, 3); sweep('bandpass', 200, 400, t, 2.5, 0.12, 1); },
    'kiep:set-danh': (t, d) => {
      const k = (d.phase || 1) / (d.total || 3);
      thunder(t, 0.6 + 0.4 * k, 2.5);
      tone('sawtooth', 2200, 60, t, 0.25, 0.2 + 0.15 * k);
      if (d.how === 'bua') { bell(1000, t + 0.1, 0.18); bell(1500, t + 0.14, 0.12); }
      else if (d.how === 'dan') arp(523, [0, 4, 7], t + 0.2, 0.08, 0.2);
      else if (d.how === 'ho') { thud(t + 0.05, 0.4); wood(t + 0.08, 0.3, 500); }
    },
    'kiep:vuot-qua': t => { thunder(t, 0.3, 2); arp(392, [0, 2, 4, 7, 9], t + 1.2, 0.12, 0.28); },
    'kiep:chet': t => { bell(196, t, 0.5, 4); bell(98, t + 0.25, 0.5, 5); tone('sine', 220, 55, t + 0.3, 2.2, 0.18); },
    'chien:bat-dau': t => { thud(t, 0.7); thud(t + 0.18, 0.5); wood(t + 0.1, 0.3, 900); },
    'chien:bua': (t, d) => { if (d.loai === 'cong') sweep('bandpass', 400, 2500, t, 0.5, 0.35, 2); else { bell(1568, t, 0.18); bell(2093, t + 0.05, 0.12); } },
    'chien:ket-thuc': (t, d) => {
      if (d.ended === 'fled') { for (let i = 0; i < 4; i++) wood(t + i * 0.12, 0.2 - i * 0.04, 700); sweep('bandpass', 800, 3000, t, 0.5, 0.2, 1); return; }
      const won = d.player ? d.win : !d.win;
      if (d.ended === 'ko' && won) sweep('bandpass', 600, 5200, t, 0.18, 0.5, 3);
      if (won) arp(523, [0, 7], t + 0.15, 0.14, 0.3);
      else { arp(392, [0, -5], t + 0.15, 0.16, 0.3); thud(t + 0.1, 0.4); }
    }
  };
  // Ưu tiên (1 thấp, 4 rất cao) và thời gian chờ tối thiểu (ms) giữa hai lần phát cùng một âm.
  const RULE = {
    'dotpha:bat-dau': [3, 3000], 'dotpha:thanh-cong': [4, 5000], 'dotpha:that-bai': [3, 5000], 'dotpha:doi-lai': [2, 2000],
    'kiep:bat-dau': [4, 5000], 'kiep:set-danh': [4, 300], 'kiep:vuot-qua': [4, 5000], 'kiep:chet': [4, 5000],
    'chien:bat-dau': [3, 4000], 'chien:bua': [2, 1000], 'chien:ket-thuc': [3, 1000]
  };
  const lastAt = {};

  function play(name, data) {
    if (!S.on || !unlocked || S.sfx <= 0) return;
    const rule = RULE[name], fn = SFX[name];
    if (!rule || !fn) return;
    if (TT.time && TT.time.speed >= 8 && rule[0] < 3) return;   // tốc độ cao: chỉ phát âm ưu tiên Cao trở lên
    const now = Date.now();
    if (lastAt[name] && now - lastAt[name] < rule[1]) return;
    if (!ensureCtx()) return;
    if (ctx.state === 'suspended') ctx.resume();
    lastAt[name] = now;
    try { fn(ctx.currentTime + 0.02, data || {}); } catch (e) { console.error('Lỗi âm thanh "' + name + '":', e); }
  }

  Object.keys(RULE).forEach(name => TT.bus.on(name, d => play(name, d)));
  TT.bus.on('chien:bat-dau', () => { chienUntil = Date.now() + CHIEN_HOLD; });

  // ---------------------------------------------------------------- mở khóa và giao diện
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    ensureCtx(); if (ctx && ctx.state === 'suspended') ctx.resume();
    ['pointerdown', 'keydown'].forEach(ev => window.removeEventListener(ev, unlock, true));
    poll();
  }
  ['pointerdown', 'keydown'].forEach(ev => window.addEventListener(ev, unlock, true));

  function build() {
    const box = document.getElementById('audio-box');
    if (!box || !ui.h) return;
    const h = ui.h;
    const btn = h('button', { id: 'btn-snd', title: 'Bật hoặc tắt âm thanh', onclick: () => { S.on = !S.on; save(); refresh(); if (S.on) { unlock(); poll(); } else stopAll(); } });
    const range = (id, key, label) => h('label', { class: 'lbl', title: label }, label + ' ',
      h('input', { id, type: 'range', min: 0, max: 100, value: Math.round(S[key] * 100), style: 'width:70px', oninput: e => { S[key] = +e.target.value / 100; save(); } }));
    function refresh() { btn.textContent = S.on ? '♪ Âm thanh: Bật' : '♪ Âm thanh: Tắt'; }
    box.appendChild(btn); box.appendChild(range('snd-music', 'music', 'Nhạc')); box.appendChild(range('snd-sfx', 'sfx', 'Hiệu ứng'));
    refresh();
  }
  window.addEventListener('DOMContentLoaded', build);

  // Cho kiểm tra và gỡ lỗi.
  ui.audio = {
    play, state: () => ({ on: S.on, unlocked, mood: curP && curP.mood, track: curP && curP.name, playing: players.length }),
    setMood: m => { chienUntil = m === 'chien' ? Date.now() + CHIEN_HOLD : 0; poll(); }
  };
})();
