// Cảnh pixel art ở đầu cột giữa: phản ánh nơi ở, vùng, thời tiết, chiến sự, gia đình và cảnh giới của nhân vật.
// Vẽ hoàn toàn bằng canvas (độ phân giải 240x72 phóng lên bằng CSS), bầu trời, núi, nhà, người đều tự vẽ bằng khối;
// cây, nấm, xương rồng, đèn... lấy từ gói Kenney Pixel Platformer (CC0, xem CREDITS.md) rồi nhuộm màu theo giờ trong ngày.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data;

  const W = 240, H = 72, GY = 54; // GY: y của mặt đất
  const SHEET = 'assets/cc0/kenney-pixel-platformer/Tilemap/tilemap_packed.png', TILE = 18, COLS = 20;
  const T = { sprout1: 124, sprout2: 125, pine: 126, cactus: 127, mushroom: 128, lamp: 129, sign: 84, fence: 106, snowman: 145 };

  // ---------- bảng màu theo giờ ----------
  const PHASES = {
    night: { sky: ['#0a0e1f', '#161c3a', '#2a3260'], far: '#1b2640', near: '#14201c', ground: '#16221a', soil: '#22180f', tint: '#7d8dc4', ta: 0.42, glow: '#f3e8a0', stars: 1, lit: 1 },
    dusk: { sky: ['#2b2152', '#8a4570', '#e8905a'], far: '#4a2f55', near: '#34283a', ground: '#2e2a22', soil: '#2a1c14', tint: '#c69a9a', ta: 0.3, glow: '#ffd08a', stars: 0.3, lit: 1 },
    day: { sky: ['#4f9fe0', '#86cdf2', '#d4efff'], far: '#6aa68a', near: '#4a8a62', ground: '#4f8040', soil: '#6a4a2e', tint: '#ffffff', ta: 0, glow: '#fff3a0', stars: 0, lit: 0 },
    cave: { sky: ['#07070d', '#0d0d18', '#14141f'], far: '#12121c', near: '#0d0d14', ground: '#15151c', soil: '#0f0f15', tint: '#6a6a90', ta: 0.5, glow: '#7a6cff', stars: 0, lit: 1 },
    void: { sky: ['#03030a', '#0a0a1e', '#150f32'], far: '#0a0a1e', near: '#0a0a1e', ground: '#0a0a1e', soil: '#0a0a1e', tint: '#8a7aff', ta: 0.4, glow: '#c9b8ff', stars: 1, lit: 1 }
  };
  const TERRAIN = {
    trung_chau: { n: 'plain' }, dong_hai: { n: 'sea', ground: '#d8c48a', soil: '#b89c62' }, tay_son: { n: 'mount', ground: '#6a7080', soil: '#4a4f5c', far: '#58607a', near: '#444b60' },
    nam_lam: { n: 'forest', ground: '#2f6a3a', soil: '#4a3a24' }, bac_bang: { n: 'snow', ground: '#e2ecf4', soil: '#b9c8d8', far: '#9fb4cc', near: '#c8d8e8' },
    hoa_son: { n: 'volcano', ground: '#3a2a26', soil: '#2a1c18', far: '#4a2420', near: '#331a18' }, hoang_mac: { n: 'desert', ground: '#d6b676', soil: '#b8924e', far: '#c49a5a', near: '#d2a966' },
    vu_trach: { n: 'swamp', ground: '#3a5a48', soil: '#2a3a30', far: '#3a4a50', near: '#2c3c40' }, loi_dao: { n: 'storm', ground: '#5a4a80', soil: '#3a2f58', far: '#473a70', near: '#352b58' }
  };

  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const toHex = a => '#' + a.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
  const hash = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

  let forced = null, cv, ctx, props, pctx, sheet = new Image(), sheetOk = false, cap, frame = 0, st = null, pal = null, last = 0;
  sheet.onload = () => { sheetOk = true; }; sheet.src = SHEET;

  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const sprite = (idx, x, y, s) => { // vẽ ô Kenney lên lớp props (được nhuộm màu sau)
    if (!sheetOk) return; const sx = (idx % COLS) * TILE, sy = Math.floor(idx / COLS) * TILE, sz = Math.round(TILE * (s || 1));
    pctx.drawImage(sheet, sx, sy, TILE, TILE, Math.round(x), Math.round(y), sz, sz);
  };

  // ---------- trạng thái cảnh từ dữ liệu game ----------
  function readState() {
    const w = TT.world, c = TT.player && TT.player(); if (!w || !c) return null;
    const reg = TT.map.region(c.region), pl = c.place && !c.travel && !c.cross ? TT.map.place(c.place) : null;
    const cls = c.dungeon ? 'secret' : c.cross ? 'void' : c.travel ? 'road' : pl ? (D.PLACE_TYPES[pl.type] || {}).cls || 'town' : 'town';
    const wx = TT.map.activeWeather ? TT.map.activeWeather(c.region) : null, wid = wx && wx.def ? wx.def.id : '';
    const year = Math.floor(w.months / 12), hsh = hash(year + 7), pend = w.pending;
    let phase = hsh < 0.42 ? 'night' : hsh < 0.7 ? 'dusk' : 'day';
    if (c.dungeon || (pl && (pl.type === 'hung_dia' || pl.type === 'bi_canh') && !c.dungeon && false)) phase = 'cave';
    if (c.cross) phase = 'void';
    const life = TT.stats.lifeSpan(c), age = TT.age(c), fam = [];
    if (!c.dungeon && !c.cross) {
      try { TT.family.partners(c).forEach(x => fam.push({ k: 'love', c: x.c })); } catch (e) { /* chưa có */ }
      try { TT.family.children(c).forEach(x => fam.push({ k: 'kid', c: x })); } catch (e) { /* chưa có */ }
      try { TT.family.disciples(c).forEach(x => fam.push({ k: 'dis', c: x })); } catch (e) { /* chưa có */ }
    }
    let monId = null, foe = null; const node = c.dungeon ? c.dungeon.nodes[c.dungeon.i] || null : null;
    if (pend && pend.type === 'event') {
      if ((pend.evId === 'dg_fight' || pend.evId === 'dg_boss') && c.dungeon && pend.ctx) { const n = c.dungeon.nodes[pend.ctx.i]; if (n) monId = n.m; }
      else if ((pend.evId === 'yeu_thu' || pend.evId === 'cx_yeu_thu') && pend.ctx) monId = pend.ctx.m || null;
      else if (pend.evId === 'rel_ke_thu' && pend.ctx && pend.ctx.otherId) foe = w.chars[pend.ctx.otherId] || null;
    }
    const eqd = slot => { const id = c.equip && c.equip[slot], d = id && D.ITEMS[id]; return d ? { t: d.tier, e: d.elem || '' } : null; };
    const geo = { w: eqd('weapon'), h: eqd('helm'), a: eqd('armor'), r: eqd('relic') };
    const people = fam.filter(f => f.c && f.c.alive && f.c.region === c.region && (!f.c.place || f.c.place === c.place) && !f.c.travel).slice(0, 5);
    // công trình của nơi đang đứng: hiện thành phố với các nhà bấm được (tối đa PAGE nhà mỗi phố)
    if (c.place !== lastPlace) { lastPlace = c.place; pageNow = 0; }
    const bl = !c.dungeon && !c.cross && !c.travel && pl && TT.bld ? TT.bld.at(c) : [], pages = Math.max(1, Math.ceil(bl.length / PAGE)), page = Math.min(pageNow, pages - 1), vis = bl.slice(page * PAGE, page * PAGE + PAGE);
    return {
      key: [c.id, c.region, c.place, !!c.travel, !!c.cross, !!c.dungeon, phase, wid, c.realm, c.gender, age < 12, age / (life === Infinity ? 1e9 : life) > 0.72, !!TT.loss.active(c), people.map(p => p.c.id).join(), TT.fac.atFront(c.region), pend ? (pend.evId || pend.type) : '', monId, foe ? foe.id : '', node ? node.t : '', c.dungeon ? c.dungeon.kind : '', JSON.stringify(geo), vis.join(), page, pages].join('|'),
      geo, bl, vis, page, pages,
      mon: monId, foe, node, dgkind: c.dungeon ? c.dungeon.kind : '',
      c, reg, pl, cls, wid, phase, terr: (TERRAIN[c.region] || TERRAIN.trung_chau), kid: age < 12, elder: life !== Infinity && age / life > 0.72, wound: !!TT.loss.active(c), people, war: TT.fac.atFront(c.region),
      boom: pend && pend.type === 'breakthrough', thunder: pend && pend.evId === 'tri_phase', rise: pend && pend.type === 'ascend', dead: pend && pend.type === 'death', year
    };
  }

  // ---------- vẽ nền ----------
  function palette(s) {
    const base = PHASES[s.phase], t = s.terr;
    const p = { sky: base.sky.slice(), far: t.far && s.phase !== 'cave' && s.phase !== 'void' ? mix(t.far, base.far, s.phase === 'day' ? 0.1 : 0.55) : base.far, near: t.near && s.phase !== 'cave' ? mix(t.near, base.near, s.phase === 'day' ? 0.1 : 0.55) : base.near,
      ground: t.ground && s.phase !== 'cave' && s.phase !== 'void' ? mix(t.ground, base.ground, s.phase === 'day' ? 0.05 : 0.6) : base.ground, soil: t.soil && s.phase !== 'cave' ? mix(t.soil, base.soil, s.phase === 'day' ? 0.05 : 0.6) : base.soil,
      tint: base.tint, ta: base.ta, glow: base.glow, stars: base.stars, lit: base.lit };
    if (s.c.dungeon) p.sky = ({ bi_canh: ['#0a0a22', '#16164a', '#24246c'], tan_tich: ['#16110c', '#2a2016', '#3d2e1e'], hung_dia: ['#160709', '#2e0e12', '#4a1519'] })[s.dgkind] || p.sky;
    if (s.war && !s.c.dungeon) p.sky = [mix(p.sky[0], '#401418', 0.4), mix(p.sky[1], '#6a2a22', 0.4), mix(p.sky[2], '#b04a2a', 0.45)];
    if (s.terr.n === 'volcano') p.sky = [mix(p.sky[0], '#301010', 0.4), mix(p.sky[1], '#702418', 0.35), mix(p.sky[2], '#c4501e', 0.4)];
    if (s.terr.n === 'storm' || s.wid === 'giong_bao') p.sky = p.sky.map(c => mix(c, '#262040', 0.45));
    if (s.dead) { p.sky = p.sky.map(c => mix(c, '#000000', 0.5)); p.ta = 0.55; }
    return p;
  }
  function lerpPal(a, b, k) {
    if (!a) return b; const o = {};
    Object.keys(b).forEach(key => {
      if (Array.isArray(b[key])) o[key] = b[key].map((c, i) => mix(a[key][i], c, k));
      else if (typeof b[key] === 'string') o[key] = mix(a[key], b[key], k); else o[key] = a[key] + (b[key] - a[key]) * k;
    });
    return o;
  }

  function sky(s, p) {
    const bands = 9, hh = GY / bands;
    for (let i = 0; i < bands; i++) { const t = i / (bands - 1); R(0, i * hh, W, Math.ceil(hh) + 1, t < 0.5 ? mix(p.sky[0], p.sky[1], t * 2) : mix(p.sky[1], p.sky[2], (t - 0.5) * 2)); }
    if (p.stars > 0.05) for (let i = 0; i < 46; i++) { const x = hash(i * 3.1) * W, y = hash(i * 5.7) * (GY - 14), tw = (frame / 6 + i * 2) % 9 < 1; if (hash(i * 1.3) < p.stars) R(x, y, 1, 1, tw ? '#ffffff' : '#9aa6d8'); }
    if (s.phase === 'void') { for (let i = 0; i < 30; i++) { const y = hash(i * 9.1) * GY, x = (hash(i * 4.4) * W - frame * (1 + hash(i) * 3)) % W; R((x + W) % W, y, 4 + hash(i * 2) * 8, 1, '#c9b8ff'); } return; }
    if (s.phase === 'cave') return;
    // mặt trăng hoặc mặt trời
    const mx = 40 + hash(s.year * 1.7) * 150, my = s.phase === 'dusk' ? 28 : 12, r = 5;
    for (let dy = -r - 2; dy <= r + 2; dy++) for (let dx = -r - 2; dx <= r + 2; dx++) { const d = Math.hypot(dx, dy); if (d <= r) R(mx + dx, my + dy, 1, 1, p.glow); else if (d <= r + 2) { ctx.globalAlpha = 0.18; R(mx + dx, my + dy, 1, 1, p.glow); ctx.globalAlpha = 1; } }
    if (s.phase === 'night') R(mx + 1, my - 2, 2, 2, mix(p.glow, '#c0b070', 0.5));
    // mây
    const cloudCol = s.phase === 'day' ? '#ffffff' : mix(p.sky[1], '#8a94b8', 0.55);
    for (let i = 0; i < 4; i++) { const cx = ((hash(i * 7.7) * W * 1.4 - frame * (0.04 + hash(i) * 0.05)) % (W + 60) + W + 60) % (W + 60) - 30, cy = 6 + hash(i * 3.3) * 22, cw = 26 + hash(i * 5.5) * 20; R(cx, cy, cw, 4, cloudCol); R(cx + 5, cy - 3, cw * 0.55, 3, cloudCol); R(cx - 3, cy + 3, cw * 0.8, 2, mix(cloudCol, p.sky[1], 0.4)); }
    if (s.wid === 'cuc_quang') for (let i = 0; i < 3; i++) for (let x = 0; x < W; x += 2) { const y = 10 + i * 6 + Math.sin(x * 0.06 + frame * 0.08 + i) * 4; ctx.globalAlpha = 0.28; R(x, y, 2, 9, ['#4af0a0', '#6ad0ff', '#b08aff'][i]); ctx.globalAlpha = 1; }
  }
  function hills(s, p, scroll) {
    if (s.phase === 'void') return;
    const sea = s.terr.n === 'sea';
    for (let layer = 0; layer < 2; layer++) {
      const col = layer ? p.near : p.far, amp = layer ? 7 : 12, base = layer ? 6 : 14, f1 = layer ? 0.09 : 0.045, sp = scroll * (layer ? 0.9 : 0.4);
      for (let x = 0; x < W; x++) {
        let h = base + Math.sin((x + sp) * f1 + s.year * 0.3 + layer) * amp * 0.5 + Math.sin((x + sp) * f1 * 2.3 + layer * 2) * amp * 0.25;
        if (s.terr.n === 'mount' || s.cls === 'sect') h += Math.abs(Math.sin((x + sp) * 0.025 + layer)) * 14;
        if (s.terr.n === 'desert') h = base * 0.6 + Math.sin((x + sp) * f1 * 0.7 + layer) * amp * 0.35;
        if (s.terr.n === 'volcano' && layer === 0) h += Math.max(0, 22 - Math.abs(((x + sp) % 120) - 60)) * 0.7;
        if (sea && layer === 1) h = 0;
        R(x, GY - h, 1, h + 1, col);
      }
    }
    if (s.terr.n === 'volcano') for (let i = 0; i < 3; i++) { const lx = (60 + i * 70 - scroll * 0.4 + W) % W; ctx.globalAlpha = 0.5 + 0.3 * Math.sin(frame * 0.2 + i); R(lx, GY - 22 + i * 2, 2, 6, '#ff7a2a'); ctx.globalAlpha = 1; }
  }
  function ground(s, p, scroll) {
    R(0, GY, W, H - GY, p.soil); R(0, GY, W, 3, p.ground);
    for (let i = 0; i < 40; i++) { const x = (hash(i * 2.3) * W - scroll) % W; R((x + W) % W, GY + 4 + hash(i * 6.1) * (H - GY - 6), 2, 1, mix(p.soil, '#000000', 0.25)); }
    if (s.terr.n === 'sea' || s.cls === 'port') {
      const top = GY + 6; R(0, top, W, H - top, mix('#1f4f86', p.sky[2], 0.15 + (s.phase === 'day' ? 0 : -0.1))); for (let x = 0; x < W; x += 6) R((x + frame * 0.4) % W, top + 2 + (x % 3) * 3, 3, 1, mix('#7fc0ff', p.sky[2], 0.4));
    }
    if (s.wid === 'suong_doc' || s.terr.n === 'swamp') { for (let i = 0; i < 5; i++) { ctx.globalAlpha = 0.18; R(((i * 60 + frame * 0.3) % (W + 40)) - 20, GY - 4, 44, 6, '#9ab8a8'); ctx.globalAlpha = 1; } }
  }

  // ---------- công trình ----------
  const lit = (p, x, y, w, h) => { if (p.lit) { R(x, y, w, h, '#ffd36a'); ctx.globalAlpha = 0.18; R(x - 1, y - 1, w + 2, h + 2, '#ffd36a'); ctx.globalAlpha = 1; } else R(x, y, w, h, '#4a6a8a'); };
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
    [x + 18, x + 52].forEach((lx, i) => { R(lx, GY - 12, 1, 4, '#3a2a20'); R(lx - 1, GY - 9, 3, 4, '#d8443a'); if (p.lit) { ctx.globalAlpha = 0.25 + 0.1 * Math.sin(frame * 0.3 + i); R(lx - 3, GY - 11, 7, 8, '#ff9a4a'); ctx.globalAlpha = 1; } });
  }
  function sect(x, p, scroll) {
    const red = mix('#b03a3a', p.soil, 0.15), dark = mix('#2e2024', p.soil, 0.1);
    for (let i = 0; i < 6; i++) R(x - 6 + i * 2, GY - 2 - i * 2, 56 - i * 4, 2, mix('#8a8a96', p.soil, 0.3 + i * 0.05));
    R(x + 4, GY - 32, 4, 30, red); R(x + 34, GY - 32, 4, 30, red);
    R(x - 4, GY - 36, 50, 3, dark); R(x - 1, GY - 40, 44, 3, dark); R(x + 6, GY - 44, 30, 3, dark);
    R(x + 8, GY - 30, 26, 3, red); lit(p, x + 18, GY - 28, 6, 5);
    R(x + 40, GY - 50, 1, 20, '#d8c8a0'); const wv = Math.sin(frame * 0.3) > 0 ? 1 : 0; R(x + 41, GY - 50, 8 + wv, 5, '#e8497c');
  }
  function cave(x, p) {
    for (let dy = 0; dy < 28; dy++) { const wd = Math.round(Math.sqrt(Math.max(0, 1 - (dy / 28) * (dy / 28))) * 30); R(x + 30 - wd, GY - dy, wd * 2, 1, dy < 4 ? '#1a1a24' : '#0b0b12'); }
    for (let i = 0; i < 9; i++) R(x - 6 + i * 8, GY - 30 + Math.abs(4 - i) * 3, 8, 4, mix('#3a3a4a', p.soil, 0.2));
    if (p.lit) { const k = Math.floor(frame / 20) % 6 === 0; R(x + 24, GY - 8, 2, 2, k ? '#222' : '#ff4a4a'); R(x + 34, GY - 8, 2, 2, k ? '#222' : '#ff4a4a'); }
  }
  function portal(x, p) {
    for (let a = 0; a < 40; a++) { const ang = a / 40 * Math.PI * 2 + frame * 0.05; R(x + 20 + Math.cos(ang) * 14, GY - 22 + Math.sin(ang) * 18, 2, 2, a % 2 ? '#b58aff' : '#6ae0ff'); }
    ctx.globalAlpha = 0.25; R(x + 8, GY - 38, 24, 36, '#8a6aff'); ctx.globalAlpha = 1;
  }
  function ruins(x, p) { const st = mix('#8a8a90', p.soil, 0.3); [[0, 18], [10, 10], [22, 24], [34, 6], [44, 15]].forEach(c => { R(x + c[0], GY - c[1], 5, c[1], st); R(x + c[0] - 1, GY - c[1], 7, 2, mix(st, '#ffffff', 0.15)); }); R(x + 14, GY - 3, 10, 3, st); }
  function mine(x, p) { R(x, GY - 20, 3, 20, '#6a4a2a'); R(x + 24, GY - 20, 3, 20, '#6a4a2a'); R(x - 2, GY - 22, 31, 3, '#7a5a34'); R(x + 5, GY - 14, 16, 14, '#08080c'); R(x + 34, GY - 6, 12, 5, '#5a5a66'); R(x + 36, GY - 2, 3, 2, '#222'); R(x + 43, GY - 2, 3, 2, '#222'); lit(p, x + 12, GY - 18, 2, 2); }
  function port(x, p) { R(x, GY + 4, 52, 3, '#7a5a34'); for (let i = 0; i < 6; i++) R(x + 2 + i * 9, GY + 7, 2, 8, '#5a3e22'); const bob = Math.round(Math.sin(frame * 0.12)); R(x + 54, GY + 6 + bob, 30, 5, '#6a4426'); R(x + 66, GY - 14 + bob, 1, 20, '#caa'); R(x + 67, GY - 12 + bob, 12, 10, '#e8dcc0'); }
  function market(x, p) { ['#d8443a', '#3a8ad8', '#d8b43a'].forEach((c, i) => { const sx = x + i * 22; R(sx, GY - 10, 2, 10, '#5a3e22'); R(sx + 16, GY - 10, 2, 10, '#5a3e22'); for (let k = 0; k < 18; k += 3) R(sx + k, GY - 16, 3, 5, (k / 3) % 2 ? c : mix(c, '#ffffff', 0.5)); R(sx + 3, GY - 3, 12, 3, '#3a2a1c'); }); }
  function tent(x, p) { const c = mix('#a88a5a', p.tint, 0.2); for (let r = 0; r < 12; r++) R(x + r, GY - r - 1, 24 - 2 * r, 1, r % 2 ? c : mix(c, '#000000', 0.15)); R(x + 10, GY - 5, 4, 5, '#241810'); if (p.lit || true) { ctx.globalAlpha = 0.5 + 0.3 * Math.sin(frame * 0.4); R(x + 34, GY - 6, 3, 5, '#ff9a2a'); R(x + 35, GY - 9, 1, 3, '#ffd23a'); ctx.globalAlpha = 1; } }
  function vein(x, p) { for (let i = 0; i < 5; i++) { const h = 8 + hash(i * 3) * 14, cx = x + i * 8; for (let r = 0; r < h; r++) R(cx + (r < h / 2 ? 0 : 1), GY - r, 4 - Math.floor(r / (h / 3)), 1, ['#5ad8ff', '#8ae8ff', '#c8f4ff'][r % 3]); } ctx.globalAlpha = 0.18 + 0.08 * Math.sin(frame * 0.2); R(x - 4, GY - 26, 50, 26, '#5ad8ff'); ctx.globalAlpha = 1; }
  function gate(x, p) { const wall = mix('#7a7a86', p.soil, 0.2); R(x, GY - 26, 22, 26, wall); R(x + 52, GY - 26, 22, 26, wall); R(x + 22, GY - 26, 30, 7, wall); R(x + 24, GY - 19, 26, 19, '#0f0d12'); for (let i = 0; i < 22; i += 4) { R(x + i, GY - 29, 3, 3, wall); R(x + 52 + i, GY - 29, 3, 3, wall); } }

  // ---------- bên trong hầm mộ, bí cảnh, tàn tích, hung địa ----------
  function interior(s, p) {
    const k = s.dgkind, A = ({ bi_canh: ['#2a2a78', '#6a6aff', '#8affff'], tan_tich: ['#4a3a28', '#8a6a44', '#ffb04a'], hung_dia: ['#3a1216', '#8a2a30', '#ff5a3a'] })[k] || ['#222', '#444', '#888'];
    R(0, 0, W, GY, mix(p.sky[1], '#000000', 0.15));
    for (let x = 0; x < W; x += 2) { const h = 6 + hash(x * 0.37 + (k === 'hung_dia' ? 2 : 1)) * (k === 'tan_tich' ? 4 : 10); R(x, 0, 2, h, A[0]); if (k !== 'tan_tich' && hash(x * 1.7) > 0.8) R(x, h, 1, 2 + hash(x) * 4, A[0]); }
    if (k === 'bi_canh') {
      for (let i = 0; i < 9; i++) { const cx = hash(i * 4.1) * W, ch = 6 + hash(i * 2.2) * 12, up = i % 2; for (let r = 0; r < ch; r++) R(cx + (r % 2), up ? r : GY - r - 1, 3 - Math.floor(r / (ch / 3)), 1, [A[1], A[2], A[1]][r % 3]); ctx.globalAlpha = 0.14 + 0.08 * Math.sin(frame * 0.15 + i); R(cx - 3, up ? 0 : GY - ch - 3, 9, ch + 3, A[2]); ctx.globalAlpha = 1; }
      for (let i = 0; i < 14; i++) { ctx.globalAlpha = 0.5 + 0.5 * Math.sin(frame * 0.12 + i * 2); R(hash(i * 3.3) * W + Math.sin(frame * 0.04 + i) * 5, 10 + hash(i * 1.9) * 36 + Math.cos(frame * 0.05 + i) * 3, 1, 1, A[2]); ctx.globalAlpha = 1; }
    } else if (k === 'tan_tich') {
      for (let i = 0; i < 6; i++) { const cx = 18 + i * 42, ph = hash(i * 5.1); R(cx, GY - 30 + ph * 14, 6, 30 - ph * 14, A[1]); R(cx - 1, GY - 31 + ph * 14, 8, 2, mix(A[1], '#ffffff', 0.2)); if (ph > 0.5) R(cx + 6, GY - 8, 3, 2, A[0]); }
      for (let i = 0; i < 3; i++) { const tx = 60 + i * 70; R(tx, GY - 24, 2, 8, '#3a2a1a'); const f = Math.sin(frame * 0.6 + i * 3) > 0 ? 1 : 0; R(tx - 1, GY - 30 - f, 4, 6 + f, '#ff8a2a'); R(tx, GY - 28, 2, 3, '#ffe08a'); ctx.globalAlpha = 0.14; R(tx - 14, GY - 42, 30, 40, '#ff9a3a'); ctx.globalAlpha = 1; }
      for (let x = 0; x < W; x += 12) R(x, GY - 1, 11, 1, mix(A[0], '#000000', 0.2));
    } else {
      for (let x = 0; x < W; x += 8) { const sh = 4 + hash(x * 0.7) * 9; for (let r = 0; r < sh; r++) R(x + 3 - Math.floor(r * 0.3), GY - r - 1, Math.max(1, 5 - Math.floor(r * 0.5)), 1, A[0]); }
      for (let i = 0; i < 7; i++) { const bx = hash(i * 6.3) * (W - 20) + 6; R(bx, GY - 2, 6, 2, '#d8d0b8'); R(bx + 1, GY - 4, 2, 2, '#d8d0b8'); R(bx + 4, GY - 3, 3, 1, '#b8b098'); }
      ctx.globalAlpha = 0.12 + 0.06 * Math.sin(frame * 0.1); R(0, 18, W, GY - 18, '#ff3a2a'); ctx.globalAlpha = 1;
      for (let i = 0; i < 5; i++) if (Math.floor((frame + i * 17) / 24) % 5 !== 0) { const ex = hash(i * 2.9) * W; R(ex, 14 + hash(i * 7.7) * 20, 2, 1, '#ff3a3a'); R(ex + 4, 14 + hash(i * 7.7) * 20, 2, 1, '#ff3a3a'); }
    }
    R(0, GY, W, H - GY, mix(p.soil, A[0], 0.5)); R(0, GY, W, 2, mix(A[1], '#000000', 0.35));
    const n = s.node ? s.node.t : '';
    if (n === 'treasure') {
      for (let i = 0; i < 2; i++) { const cx = 150 + i * 26; R(cx, GY - 10, 16, 10, '#7a4a22'); R(cx, GY - 10, 16, 3, '#9a6a32'); R(cx + 7, GY - 8, 2, 4, '#ffd23a'); R(cx, GY - 6, 16, 1, '#ffd23a'); ctx.globalAlpha = 0.25 + 0.12 * Math.sin(frame * 0.2 + i); R(cx - 6, GY - 20, 28, 22, '#ffd23a'); ctx.globalAlpha = 1; }
      for (let i = 0; i < 6; i++) R(146 + hash(i * 3) * 50, GY - 1, 2, 1, '#ffd23a');
    } else if (n === 'rest') {
      R(150, GY - 1, 40, 4, '#2a6ad8'); R(152, GY - 2, 36, 2, '#6ab4ff'); for (let i = 0; i < 6; i++) { ctx.globalAlpha = 0.7; R(154 + hash(i * 5) * 30, GY - 4 - ((frame * 0.6 + i * 9) % 18), 1, 1, '#c8f0ff'); ctx.globalAlpha = 1; }
    } else if (n === 'trap') {
      const pulse = 0.35 + 0.25 * Math.sin(frame * 0.2); ctx.globalAlpha = pulse; R(140, GY - 2, 50, 3, A[2]); R(152, GY - 5, 26, 1, A[2]); R(158, GY - 8, 14, 1, A[2]); ctx.globalAlpha = 1;
      for (let i = 0; i < 5; i++) { R(196, 14 + i * 7, 6, 1, '#12121a'); if (Math.floor(frame / 12 + i) % 5 === 0) R(190, 14 + i * 7, 6, 1, '#d8d8e8'); }
    }
    if (s.node && s.node.t === 'boss') { ctx.globalAlpha = 0.16 + 0.08 * Math.sin(frame * 0.1); R(0, 0, W, H, '#ff2a2a'); ctx.globalAlpha = 1; }
  }
  // ---------- đồ trang trí (Kenney) ----------
  function scenery(s, p, scroll) {
    const n = s.terr.n, cls = s.cls; const put = (idx, x, s2, dy) => sprite(idx, ((x - scroll) % (W + 30) + W + 30) % (W + 30) - 15, GY - 17 * (s2 || 1) + (dy || 0) + 1, s2 || 1);
    const treeSet = n === 'forest' ? 9 : n === 'plain' ? 3 : n === 'snow' || n === 'mount' ? 4 : n === 'swamp' ? 3 : 2;
    for (let i = 0; i < treeSet; i++) { const x = hash(i * 5.3 + s.year * 0.01) * W; if (cls === 'city' || cls === 'sect' || cls === 'secret' || cls === 'ruin') { if (i % 2) continue; } put(n === 'desert' || n === 'volcano' ? T.cactus : n === 'swamp' ? T.mushroom : T.pine, x < 90 && cls !== 'road' ? x + 150 : x, n === 'forest' ? 1.3 : 1); }
    for (let i = 0; i < 4; i++) put(i % 2 ? T.sprout1 : T.sprout2, hash(i * 8.8) * W, 1);
    if (cls === 'city' || cls === 'town' || cls === 'market' || cls === 'port') { put(T.lamp, 86, 1); put(T.lamp, 150, 1); }
    if (cls === 'road') { put(T.sign, 40, 1); put(T.sign, 190, 1); }
    if (n === 'snow') put(T.snowman, 200, 1);
  }

  // ---------- người ----------
  const TIER_COL = ['#9a8a74', '#7ab8e8', '#e8c24a', '#fff6d8'], ELEM_COL = { Kim: '#f0e08a', 'Mộc': '#7ae068', 'Thủy': '#5aaaf0', 'Hỏa': '#ff8a4a', 'Thổ': '#c8a068', Phong: '#a0ecd8', 'Lôi': '#f8e85a', 'Băng': '#cdeeff', 'Âm': '#b48af0', 'Dương': '#ffc85a' };
  const REALM_ROBE = ['#8a7a66', '#6aa0d8', '#3fb8b0', '#9a7ae0', '#e0b43a', '#e8497c', '#f4f0e0'];
  function person(x, fy, o, walking) {
    const kid = o.kid, hgt = kid ? 12 : 19, y = fy - hgt + (o.slump ? 2 : 0), xx = Math.round(x);
    const skin = o.skin || '#e8b88a', hair = o.elder ? '#d8d8e0' : (o.hair || '#241a18'), robe = o.robe || '#8a7a66', dark = mix(robe, '#000000', 0.38), light = mix(robe, '#ffffff', 0.2);
    if (o.aura) { const k = 0.16 + 0.1 * Math.sin(frame * 0.25 + (o.ph || 0)); ctx.globalAlpha = k; R(xx - 5, y - 5, 18, hgt + 10, o.auraCol || '#ffe08a'); R(xx - 2, y - 2, 12, hgt + 4, o.auraCol || '#ffe08a'); ctx.globalAlpha = 1; }
    R(xx - 1, fy, 10, 1, 'rgba(0,0,0,0.28)'); // bóng dưới chân
    if (kid) {
      R(xx + 1, y, 5, 5, skin); R(xx + 1, y, 5, 2, hair); R(xx + 2, y + 3, 1, 1, '#2a1c18'); R(xx + 4, y + 3, 1, 1, '#2a1c18');
      R(xx, y + 5, 7, 4, robe); R(xx + 3, y + 5, 1, 4, light); R(xx + 1, y + 9, 2, 3, dark); R(xx + 4, y + 9, 2, 3, dark); return;
    }
    // đầu và tóc
    R(xx + 1, y, 6, 6, skin); R(xx + 1, y, 6, 2, hair); R(xx, y + 1, 1, o.female ? 8 : 3, hair); R(xx + 7, y + 1, 1, o.female ? 8 : 3, hair);
    if (o.female) R(xx + 1, y, 6, 3, hair);
    R(xx + 2, y + 3, 1, 1, '#2a1c18'); R(xx + 5, y + 3, 1, 1, '#2a1c18'); if (o.wound) R(xx + 3, y + 5, 2, 1, '#a02828');
    // thân áo, tay áo
    R(xx, y + 6, 8, 8, robe); R(xx - 1, y + 7, 1, 5, robe); R(xx + 8, y + 7, 1, 5, robe); R(xx + 3, y + 6, 2, 8, light);
    if (o.sash) R(xx, y + 10, 8, 1, o.sash);
    const ge = o.gear;
    if (ge) {
      if (ge.a) { R(xx - 1, y + 6, 10, 2, TIER_COL[ge.a.t]); R(xx + 2, y + 13, 4, 1, TIER_COL[ge.a.t]); }
      if (ge.h) { R(xx, y - 1, 8, 2, TIER_COL[ge.h.t]); R(xx + 3, y - 3, 2, 2, TIER_COL[ge.h.t]); }
      if (ge.w) { const wc = TIER_COL[ge.w.t], ec = ge.w.e ? ELEM_COL[ge.w.e] : null; R(xx + 10, y + 1, 1, 12, wc); R(xx + 10, y - 1, 1, 2, ec || '#ffffff'); R(xx + 9, y + 13, 3, 1, '#6a4a2a'); R(xx + 10, y + 14, 1, 2, '#3a2a1a'); if (ec) { ctx.globalAlpha = 0.25 + 0.15 * Math.sin(frame * 0.3); R(xx + 9, y - 1, 3, 14, ec); ctx.globalAlpha = 1; } }
      if (ge.r) { const rc = ge.r.e ? ELEM_COL[ge.r.e] : '#cfe8ff', by = y - 6 + Math.round(Math.sin(frame * 0.2 + (o.ph || 0)) * 1.5); ctx.globalAlpha = 0.3; R(xx + 12, by - 2, 7, 7, rc); ctx.globalAlpha = 1; R(xx + 14, by, 3, 3, rc); R(xx + 15, by - 1, 1, 5, '#ffffff'); }
    }
    if (o.female) { R(xx - 1, y + 13, 10, 2, robe); R(xx - 1, y + 14, 10, 1, dark); }
    const step = walking ? (Math.floor(frame / 3) % 2) : 0;
    R(xx + 1 + step, y + 14, 2, 5, dark); R(xx + 5 - step, y + 14, 2, 5, dark);
    if (o.elder && !(o.gear && o.gear.w)) { R(xx + 10, y + 7, 1, 12, '#8a6a3a'); R(xx + 9, y + 7, 2, 1, '#8a6a3a'); }
    if (o.wound) { R(xx + 2, y + 8, 4, 1, '#d8443a'); R(xx + 3, y + 7, 2, 3, '#d8443a'); }
  }  function figures(s, p, walking, engaged) {
    const c = s.c, list = [], realmCol = REALM_ROBE[Math.min(6, c.realm)], hairs = ['#241a18', '#3a2418', '#14141c', '#5a3a22'];
    const me = { key: 'me', kid: s.kid, elder: s.elder, female: c.gender === 'nu', robe: realmCol, sash: c.realm >= 1 ? '#e8497c' : null, hair: hairs[c.id % 4], wound: s.wound, slump: s.wound, gear: s.geo, aura: c.realm >= 2 || s.boom, auraCol: s.boom ? '#ffffff' : ['', '', '#8affd8', '#c9a8ff', '#ffe08a', '#ff9ab8', '#ffffff'][Math.min(6, c.realm)], ph: 0 };
    list.push(me);
    s.people.forEach((f, i) => { const o = f.c; list.push({ key: o.id, kid: f.k === 'kid' || TT.age(o) < 12, elder: false, female: o.gender === 'nu', robe: f.k === 'love' ? '#e87aa0' : f.k === 'dis' ? REALM_ROBE[Math.min(6, o.realm)] : ['#6aa0d8', '#d8b43a', '#8ad88a', '#c88ae0'][o.id % 4], hair: hairs[o.id % 4], ph: i * 3 + 2, sash: f.k === 'dis' ? '#e8497c' : null }); });
    const n = list.length, gap = 16, total = n * gap, x0 = engaged ? 44 : Math.round((W - total) / 2) + 4;
    // người chơi đứng giữa nhóm
    const order = list.slice(1); order.splice(Math.floor(order.length / 2), 0, list[0]);
    order.forEach((o, i) => person(x0 + i * gap + (o.kid ? 3 : 0), GY + 10 + (o.kid ? 1 : 0), o, walking));
  }

  // ---------- hiệu ứng ----------
  function weather(s, p) {
    const w = s.wid, rain = ['mua_doc', 'linh_vu', 'bao_bien', 'giong_bao'].indexOf(w) >= 0, snow = ['bao_tuyet', 'tuyet_lo'].indexOf(w) >= 0 || (s.terr.n === 'snow' && s.phase !== 'cave');
    if (rain) for (let i = 0; i < 60; i++) { const x = (hash(i * 3.3) * W + frame * 1.2) % W, y = (hash(i * 6.6) * H + frame * 5) % H; R(x, y, 1, 3, w === 'linh_vu' ? '#9affd0' : w === 'mua_doc' ? '#9ad84a' : '#9ab4e8'); }
    if (snow) for (let i = 0; i < 50; i++) { const x = (hash(i * 4.4) * W + Math.sin(frame * 0.05 + i) * 4 + W) % W, y = (hash(i * 7.7) * H + frame * 1.1) % H; R(x, y, 1, 1, '#ffffff'); }
    if (w === 'bao_cat') for (let i = 0; i < 50; i++) { const x = (hash(i * 5.5) * W + frame * 4) % W, y = hash(i * 2.2) * H; R(x, y, 2, 1, '#d8b66a'); }
    if (w === 'da_quang') for (let i = 0; i < 12; i++) { const x = hash(i * 9.9) * W + Math.sin(frame * 0.05 + i) * 6, y = GY - 4 - hash(i * 1.1) * 26 + Math.cos(frame * 0.07 + i) * 3; ctx.globalAlpha = 0.5 + 0.5 * Math.sin(frame * 0.2 + i); R(x, y, 1, 1, '#d8f86a'); ctx.globalAlpha = 1; }
    if (w === 'phun_trao' || s.terr.n === 'volcano') for (let i = 0; i < 10; i++) { const x = hash(i * 2.9) * W, y = GY - ((frame * 1.5 + i * 11) % 40); R(x, y, 1, 1, '#ff9a3a'); }
    if (s.war) for (let i = 0; i < 3; i++) for (let k = 0; k < 9; k++) { ctx.globalAlpha = 0.45 - k * 0.04; R(150 + i * 28 + Math.sin(frame * 0.05 + k) * 2, GY - 10 - k * 4 - (frame * 0.3 + i * 5) % 6, 6 + k, 4, '#5a5660'); ctx.globalAlpha = 1; }
    if (s.thunder || s.terr.n === 'storm' || w === 'giong_bao') { if (Math.floor(frame / 8) % 9 === 0) { ctx.globalAlpha = 0.35; R(0, 0, W, H, '#d8e4ff'); ctx.globalAlpha = 1; const bx = 40 + hash(Math.floor(frame / 8)) * 160; for (let y = 0; y < GY; y += 4) R(bx + Math.sin(y) * 4, y, 2, 4, '#fffbd8'); } }
    if (s.rise) for (let i = 0; i < 20; i++) { ctx.globalAlpha = 0.5; R(100 + hash(i) * 40, H - ((frame * 1.2 + i * 9) % H), 1, 4, '#ffe9a0'); ctx.globalAlpha = 1; }
  }

  // ---------- phố công trình ----------
  const PAGE = 6; let lay = [], hoverIdx = -1, ov = null, pageNow = 0, lastPlace = null;
  function streetLayout(vis) { const n = vis.length, bw = 30, gap = 8, total = n * bw + (n - 1) * gap, x0 = Math.round((W - total) / 2); return vis.map((id, i) => ({ id, x: x0 + i * (bw + gap), w: bw })); }
  function drawStreet(s) { lay = streetLayout(s.vis); lay.forEach((b, i) => ui.bld.draw(pctx, b.id, b.x, GY + 2, b.w, { hover: hoverIdx === i, frame })); }
  function setPage(p) { pageNow = Math.max(0, p); st = null; }
  // nhãn tên công trình là chữ HTML nằm trên canvas (rõ nét), kèm nút chuyển phố
  function overlay() {
    if (!ov) return; ov.innerHTML = ''; const s = st;
    if (!s || !s.vis || !s.vis.length || !ui.bld) { lay = []; return; }
    lay = streetLayout(s.vis);
    lay.forEach((b, i) => { const el = document.createElement('div'); el.className = 'bl'; el.dataset.i = i; el.textContent = ui.bld.nameOf(b.id); el.style.left = ((b.x + b.w / 2) / W * 100) + '%'; el.style.top = ((GY + 5) / H * 100) + '%'; ov.appendChild(el); });
    if (s.pages > 1) {
      const mk = (txt, cls, fn) => { const b = document.createElement('button'); b.className = 'pg ' + cls; b.textContent = txt; b.onclick = e => { e.stopPropagation(); fn(); }; ov.appendChild(b); };
      if (s.page > 0) mk('◀', 'l', () => setPage(s.page - 1)); if (s.page < s.pages - 1) mk('▶', 'r', () => setPage(s.page + 1));
      const t = document.createElement('div'); t.className = 'pgtxt'; t.textContent = 'Phố ' + (s.page + 1) + '/' + s.pages; ov.appendChild(t);
    }
  }
  function hitIdx(e) { const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H; for (let i = 0; i < lay.length; i++) { const b = lay[i]; if (x >= b.x - 3 && x <= b.x + b.w + 3 && y >= 6 && y <= GY + 14) return i; } return -1; }

  // ---------- vòng vẽ ----------
  function draw() {
    if (!ctx) return; if (!st) return;
    const s = st, target = palette(s); pal = lerpPal(pal, target, 0.12);
    const walking = s.cls === 'road' && !s.dead, scroll = walking ? frame * 0.5 : 0;
    ctx.clearRect(0, 0, W, H); pctx.clearRect(0, 0, W, H);
    const inDg = !!s.c.dungeon;
    if (inDg) interior(s, pal); else { sky(s, pal); hills(s, pal, scroll); ground(s, pal, scroll); }
    const cls = s.cls;
    const street = !inDg && s.vis && s.vis.length && ui.bld;
    if (inDg) { /* nội thất đã vẽ */ } else if (street) drawStreet(s); else if (cls === 'town' || cls === 'tribe') { house(24, pal, 22, false); house(184, pal, 18, false); if (cls === 'tribe') tent(190, pal); }
    else if (cls === 'city') city(8, pal); else if (cls === 'sect') sect(20, pal, scroll);
    else if (cls === 'ruin') ruins(160, pal); else if (cls === 'secret') portal(20, pal);
    else if (cls === 'mine') mine(14, pal); else if (cls === 'port') port(10, pal); else if (cls === 'market' || cls === 'guild') market(14, pal);
    else if (cls === 'vein') vein(20, pal); else if (cls === 'gate') gate(8, pal);
    if (s.phase !== 'void' && !inDg && !street) scenery(s, pal, scroll);
    // nhuộm lớp props theo giờ trong ngày
    pctx.globalCompositeOperation = 'source-atop'; pctx.globalAlpha = pal.ta; pctx.fillStyle = pal.tint; pctx.fillRect(0, 0, W, H); pctx.globalAlpha = 1; pctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(props, 0, 0);
    const engaged = !!(s.mon || s.foe);
    figures(s, pal, walking, engaged);
    if (s.mon && ui.sprites) { const def = D.monsterById[s.mon], boss = def && def.boss; ui.sprites.monster(R, s.mon, boss ? 178 : 170, GY + 10, frame); }
    if (s.foe) person(166, GY + 10, { robe: '#5a2a3a', sash: '#e8433a', hair: '#14141c', female: s.foe.gender === 'nu', aura: s.foe.realm >= 2, auraCol: '#c04a6a', ph: 5 }, false);
    weather(s, pal);
    if (s.boom) { ctx.globalAlpha = 0.18 + 0.12 * Math.sin(frame * 0.3); R(0, 0, W, H, '#ffffff'); ctx.globalAlpha = 1; }
    if (pal.ta > 0.3) { ctx.globalAlpha = 0.12; R(0, 0, W, H, '#05060f'); ctx.globalAlpha = 1; }
  }
  function caption() {
    if (!cap || !st) return;
    const s = st, c = s.c, pl = s.pl, wx = s.wid && s.reg.weather ? (s.reg.weather.find(x => x.id === s.wid) || {}).name : '';
    const where = c.dungeon ? c.dungeon.name : c.cross ? 'Giữa hư không' : c.travel ? 'Trên đường · ' + s.reg.n : pl ? pl.n + ' · ' + s.reg.n : s.reg.n;
    cap.textContent = where + (wx ? ' · ' + wx : '') + (s.war ? ' · chiến loạn' : '') + ' · ' + ({ night: 'đêm', dusk: 'hoàng hôn', day: 'ban ngày', cave: 'tối tăm', void: 'hư không' }[s.phase]);
  }
  function tick() {
    if (document.hidden) return; frame++;
    try {
      if (forced) { st = forced; } else if (frame % 3 === 0 || !st) { const ns = readState(); if (ns && (!st || ns.key !== st.key)) { st = ns; caption(); overlay(); } else if (ns) st.c = ns.c; }
      draw();
      if (ui.scene && ui.scene.mirror && ui.scene.mirror.isConnected) { const mx = ui.scene.mirror.getContext('2d'); mx.imageSmoothingEnabled = false; mx.drawImage(cv, 0, 0); }
    } catch (e) { if (!tick.warned) { tick.warned = true; console.error('scene', e); } }
  }
  function init() {
    props = document.createElement('canvas'); props.width = W; props.height = H; pctx = props.getContext('2d'); pctx.imageSmoothingEnabled = false;
    cv = document.getElementById('scene'); cap = document.getElementById('scene-cap'); if (!cv) return;
    cv.width = W; cv.height = H; ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
    // sân khấu bọc canvas để đặt nhãn công trình lên trên, bắt chuột rê và bấm vào công trình
    const stage = document.createElement('div'); stage.className = 'sc-stage'; cv.parentNode.insertBefore(stage, cv); stage.appendChild(cv);
    ov = document.createElement('div'); ov.className = 'sc-ov'; stage.appendChild(ov);
    cv.addEventListener('mousemove', e => { const i = hitIdx(e); if (i !== hoverIdx) { hoverIdx = i; cv.style.cursor = i >= 0 ? 'pointer' : ''; cv.title = i >= 0 ? ui.bld.nameOf(lay[i].id) + ': ' + ui.bld.defs[lay[i].id].desc : ''; ov.querySelectorAll('.bl').forEach(el => el.classList.toggle('h', +el.dataset.i === i)); } });
    cv.addEventListener('mouseleave', () => { hoverIdx = -1; ov.querySelectorAll('.bl.h').forEach(el => el.classList.remove('h')); });
    cv.addEventListener('click', e => { if (TT.world && TT.world.pending) return; const i = hitIdx(e); if (i >= 0 && ui.shop) ui.shop.open(lay[i].id); });
    setInterval(tick, 110); // khoảng 9 khung hình mỗi giây, đủ cho pixel art
  }
  // Dùng cho kiểm thử và xem thử: ép một trạng thái cảnh, vẽ ngay không chờ hoạt hình.
  function preview(s, frames, target) {
    const keep = cv, kctx = ctx; if (target) { cv = target; ctx = target.getContext('2d'); ctx.imageSmoothingEnabled = false; }
    st = s; pal = palette(s); for (let i = 0; i < (frames || 1); i++) { frame++; draw(); }
    const out = cv; cv = keep; ctx = kctx; return out;
  }
  ui.scene = { mirror: null, setPage, layout: () => lay, init, W, H, state: () => st, draw, readState, palette, preview, force: s => { forced = s; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
