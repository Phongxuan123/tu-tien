// Cảnh pixel thủy mặc ở đầu cột giữa: phản ánh nơi ở, vùng, thời tiết, chiến sự, gia đình và cảnh giới của nhân vật.
// Tệp này chỉ ghép các lớp trong js/ui/scene/ (core, data, sky, land, cloud, arch, place, sect, shrine, street, fg, fx, weather, dungeon, actor, events) và giữ API TT.ui.scene
// (W, H, mirror, setPage, layout, readState, palette, preview, force...). Kích thước cảnh cấu hình ở js/ui/scene/core.js (CFG).
// Vẽ hoàn toàn bằng mã, không tải ảnh. Lớp tĩnh dựng một lần theo khóa; mỗi khung (30/s, dừng khi tab ẩn) chỉ vẽ lớp động.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, sc = ui.sc, CFG = sc.CFG, W = CFG.W, H = CFG.H, GY = CFG.GY, PAD = CFG.PAD, B = sc.B;
  const { mix, hash, smooth, lerpPal } = sc;
  const DATA = sc.data;

  let forced = null, cv, ctx, cap, ov, stage, dbg, st = null, frame = 0, rafId = 0, lastT = 0;
  let palFrom = null, palTo = null, palCur = null, built = { sky: '', arch: '', terr: '', cls: '' }, buildOk = false;
  const geo = { lamps: [], smokes: [], flags: [], falls: [] };
  const clock = { t: 0, drift: 0, travel: 0, sway: 0, wind: 0 };

  // ---------- trạng thái cảnh từ dữ liệu game ----------
  const PAGE = 6; let lay = [], hoverIdx = -1, pageNow = 0, lastPlace = null;
  function readState() {
    const w = TT.world, c = TT.player && TT.player(); if (!w || !c) return null;
    const reg = TT.map.region(c.region), pl = c.place && !c.travel && !c.cross ? TT.map.place(c.place) : null;
    const cls = c.dungeon ? 'secret' : c.cross ? 'void' : c.travel ? 'road' : pl ? (D.PLACE_TYPES[pl.type] || {}).cls || 'town' : 'town';
    const wx = TT.map.activeWeather ? TT.map.activeWeather(c.region) : null, wid = wx && wx.def ? wx.def.id : '';
    const year = Math.floor(w.months / 12), hsh = hash(year + 7), pend = w.pending;
    let phase = hsh < 0.42 ? 'night' : hsh < 0.7 ? 'dusk' : 'day';
    if (c.dungeon) phase = 'cave';
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
    const geoEq = { w: eqd('weapon'), h: eqd('helm'), a: eqd('armor'), r: eqd('relic') };
    const people = fam.filter(f => f.c && f.c.alive && f.c.region === c.region && (!f.c.place || f.c.place === c.place) && !f.c.travel).slice(0, 5);
    // công trình của nơi đang đứng: hiện thành phố với các nhà bấm được (tối đa PAGE nhà mỗi phố)
    if (c.place !== lastPlace) { lastPlace = c.place; pageNow = 0; }
    const bl = !c.dungeon && !c.cross && !c.travel && pl && TT.bld ? TT.bld.at(c) : [], pages = Math.max(1, Math.ceil(bl.length / PAGE)), page = Math.min(pageNow, pages - 1), vis = bl.slice(page * PAGE, page * PAGE + PAGE);
    return {
      key: [c.id, c.region, c.place, !!c.travel, !!c.cross, !!c.dungeon, phase, wid, c.realm, c.gender, age < 12, age / (life === Infinity ? 1e9 : life) > 0.72, !!TT.loss.active(c), people.map(p => p.c.id).join(), TT.fac.atFront(c.region), pend ? (pend.evId || pend.type) : '', monId, foe ? foe.id : '', node ? node.t : '', c.dungeon ? c.dungeon.kind : '', JSON.stringify(geoEq), vis.join(), page, pages].join('|'),
      geo: geoEq, bl, vis, page, pages,
      mon: monId, foe, node, dgkind: c.dungeon ? c.dungeon.kind : '',
      sect: pl && pl.type === 'tong_mon' ? pl.id : '', c, reg, pl, cls, wid, phase, terr: (DATA.TERRAIN[c.region] || DATA.TERRAIN.trung_chau), kid: age < 12, elder: life !== Infinity && age / life > 0.72, wound: !!TT.loss.active(c), people, war: TT.fac.atFront(c.region),
      boom: pend && pend.type === 'breakthrough', thunder: pend && pend.evId === 'tri_phase', rise: pend && pend.type === 'ascend', dead: pend && pend.type === 'death', year
    };
  }

  // ---------- bảng màu theo pha + địa hình + chiến sự + giông + chết ----------
  const palCache = {};
  const stormy = s => s.terr.n === 'storm';
  function palette(s) {
    const terr0 = DATA.terrOf(s.terr), ph = DATA.PHASES[s.phase] ? s.phase : 'day', dg = !!(s.c && s.c.dungeon), st0 = DATA.SECT_STYLE[s.sect], terr = st0 && st0.tint ? Object.assign({}, terr0, st0.tint) : terr0;
    const key = [terr.id, ph, s.sect || '', s.wid || '', s.war && !dg ? 1 : 0, stormy(s) ? 1 : 0, s.dead ? 1 : 0].join('|');
    if (palCache[key]) return palCache[key];
    const base = DATA.PHASES[ph], p = Object.assign({}, base), amb = base.amb, plain = ph === 'cave' || ph === 'void';
    if (!plain) {
      if (terr.rock) { const tint = mix(terr.rock, base.ink, amb * 0.75); ['m1', 'm2', 'm3', 'm4', 'rockLt'].forEach(k => { p[k] = mix(base[k], mix(tint, base[k], 0.4), terr.rockK); }); }
      if (terr.sky) { const tint = mix(terr.sky, base.ink, amb * 0.75); ['sky0', 'sky1', 'sky2'].forEach((k, i) => { p[k] = mix(base[k], tint, terr.skyK * [0.8, 1, 1.1][i]); }); }
      if (terr.cloud) { const tint = mix(terr.cloud, base.ink, amb * 0.75); ['cloudLt', 'cloudMd', 'cloudDk'].forEach((k, i) => { p[k] = mix(base[k], tint, terr.cloudK * [0.6, 1, 0.8][i]); }); p.mist = mix(base.mist, tint, terr.cloudK * 0.5); }
    }
    const wt = sc.weather.tintOf(s);
    if (wt && !plain) { const tint = mix(wt.color, base.ink, amb * 0.75); ['sky0', 'sky1', 'sky2'].forEach((k, i) => { p[k] = mix(p[k], tint, wt.k * [0.8, 1, 1.1][i]); }); p.mist = mix(p.mist, tint, wt.k * 0.6); ['cloudLt', 'cloudMd', 'cloudDk'].forEach(k => { p[k] = mix(p[k], tint, wt.k * 0.7); }); }
    if (s.war && !dg) { p.sky0 = mix(p.sky0, '#401418', 0.4); p.sky1 = mix(p.sky1, '#6a2a22', 0.4); p.sky2 = mix(p.sky2, '#b04a2a', 0.45); p.mist = mix(p.mist, '#8a4a3a', 0.2); }
    if (stormy(s) && !plain) { ['sky0', 'sky1', 'sky2', 'mist'].forEach(k => { p[k] = mix(p[k], '#262040', 0.45); }); ['cloudLt', 'cloudMd', 'cloudDk'].forEach(k => { p[k] = mix(p[k], '#262040', 0.3); }); }
    if (s.dead) { ['sky0', 'sky1', 'sky2'].forEach(k => { p[k] = mix(p[k], '#000000', 0.5); }); p.amb = Math.max(p.amb, 0.55); }
    return palCache[key] = p;
  }
  // màu cho vật thể tĩnh: tối dần về đêm
  const tintFn = pal => c => mix(mix(c, pal.mist, 0.1 * (1 - pal.amb)), pal.m4, pal.amb * 0.65);
  // địa hình dùng để vẽ: hư không đổi sang biển mây tím
  const VOID_T = { sea: 1.2, water: 0, seaY: 96, mistK: 1, near: 0, cap: 'none', tree: 'dead', seed: 131, fltKey: 'm1', flt: [{ x: 110, y: 52, w: 34, up: 8, down: 22, fall: 0 }, { x: 300, y: 40, w: 46, up: 10, down: 28, fall: 0 }, { x: 420, y: 62, w: 24, up: 6, down: 16, fall: 0 }] };
  const effTerr = s => s.phase === 'void' ? Object.assign({}, DATA.terrOf(s.terr), VOID_T) : DATA.terrOf(s.terr);

  // ---------- dựng lớp tĩnh khi khóa đổi ----------
  function keysOf(s) {
    const terr = effTerr(s), dg = !!s.c.dungeon;
    const sky = dg ? 'dg|' + s.dgkind : [terr.id, s.phase, s.sect || '', s.wid || '', s.war ? 1 : 0, stormy(s) ? 1 : 0, s.dead ? 1 : 0].join('|');
    return { sky, arch: sky + '|' + s.cls + '|' + (s.vis && s.vis.length ? 1 : 0), terr: terr.id + '|' + s.phase, cls: s.cls };
  }
  function build(s, force) {
    const k = keysOf(s), dg = !!s.c.dungeon, terr = effTerr(s);
    if (!force && k.sky === built.sky && k.arch === built.arch) return;
    if (!inPreview) pv = null;
    const t0 = performance.now(), first = !palTo || force;
    const skyChanged = k.sky !== built.sky, target = palette(s);
    if (skyChanged) {
      palFrom = first || !palCur ? target : palCur; palTo = target;
      sc.fade.v = first ? 1 : 0;
    }
    const mode = first ? 2 : (skyChanged ? (k.terr !== built.terr ? 1 : 0) : 2), T = tintFn(palTo);
    if (!dg) {
      if (skyChanged) {
        geo.falls = []; const p = palTo;
        sc.paintSky(p, mode, s.phase === 'void'); sc.paintHigh(p, terr.seed, mode);
        if (s.phase === 'void') { sc.use(B.far.begin(mode)); sc.use(B.mid.begin(mode)); sc.paintFloat(p, T, terr, geo, mode); sc.use(B.near.begin(mode)); }
        else { sc.paintFar(p, terr, mode); sc.paintMid(p, terr, mode); sc.paintFloat(p, T, terr, geo, mode); sc.paintNear(p, T, terr, mode); }
        sc.paintSea(p, terr, mode); sc.paintWater(p, terr, mode); sc.paintFront(p, terr, mode); sc.paintFog(p, terr, mode);
      }
      sc.paintArch(palTo, T, terr, s, geo, skyChanged ? mode : 2); sc.paintOver(palTo, T, terr, s.cls, skyChanged ? mode : 2);
    } else if (skyChanged) { geo.falls = []; sc.dungeon.paint(palTo, s.dgkind, geo, mode); }
    if (!dg && (s.war || (sc.weather.profile(s) && sc.weather.profile(s).war))) sc.weather.WAR_X.forEach(x => geo.lamps.push({ x, y: GY - 8, c: '#ff7a2a', always: true }));
    built = k; sc.fx.reset();
    sc.perf.rebuild = performance.now() - t0; sc.perf.rebuilds++;
  }

  // ---------- phố công trình ----------
  let streetCv, streetX, streetLast = -1, streetDirty = true;
  function streetLayout(vis) { const n = vis.length, bw = 60, gap = 16, total = n * bw + (n - 1) * gap, x0 = Math.round((W - total) / 2); return vis.map((id, i) => ({ id, x: x0 + i * (bw + gap), w: bw })); }
  function drawStreet(c2, s, pal, t) {
    lay = streetLayout(s.vis);
    if (t - streetLast > 0.1 || streetDirty) { // nhà vẽ ở tọa độ cũ 240x72 (mỗi nhà 30), rồi phóng 2x: giữ hoạt ảnh của ui.bld ở khoảng 10 khung/s
      streetLast = t; streetDirty = false; streetX.clearRect(0, 0, W, H);
      const T = tintFn(pal); lay.forEach((b, i) => sc.street.draw(streetX, b.id, b.x, GY + 4, b.w, { hover: hoverIdx === i, frame: Math.floor(t * 9) }, pal, T));
      streetX.globalCompositeOperation = 'source-atop'; streetX.globalAlpha = pal.amb * 0.55; streetX.fillStyle = mix(pal.m3, pal.sky1, 0.3); streetX.fillRect(0, 0, W, H); streetX.globalAlpha = 1; streetX.globalCompositeOperation = 'source-over';
    }
    c2.drawImage(streetCv, 0, 0);
  }
  function setPage(p) { pageNow = Math.max(0, p); st = null; }
  // nhãn tên công trình là chữ HTML nằm trên canvas (rõ nét), kèm nút chuyển phố
  function overlay() {
    if (!ov) return; ov.innerHTML = ''; const s = st;
    if (!s || !s.vis || !s.vis.length || !ui.bld) { lay = []; return; }
    lay = streetLayout(s.vis);
    lay.forEach((b, i) => { const el = document.createElement('div'); el.className = 'bl'; el.dataset.i = i; el.textContent = ui.bld.nameOf(b.id); el.style.left = ((b.x + b.w / 2) / W * 100) + '%'; el.style.top = ((GY + 7) / H * 100) + '%'; ov.appendChild(el); });
    if (s.pages > 1) {
      const mk = (txt, cls, fn) => { const b = document.createElement('button'); b.className = 'pg ' + cls; b.textContent = txt; b.onclick = e => { e.stopPropagation(); fn(); }; ov.appendChild(b); };
      if (s.page > 0) mk('◀', 'l', () => setPage(s.page - 1)); if (s.page < s.pages - 1) mk('▶', 'r', () => setPage(s.page + 1));
      const t = document.createElement('div'); t.className = 'pgtxt'; t.textContent = 'Phố ' + (s.page + 1) + '/' + s.pages; ov.appendChild(t);
    }
  }
  function hitIdx(e) { const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H; for (let i = 0; i < lay.length; i++) { const b = lay[i]; if (x >= b.x - 6 && x <= b.x + b.w + 6 && y >= 12 && y <= GY + 28) return i; } return -1; }

  // ---------- cập nhật động và vẽ một khung ----------
  function advance(dt, s) {
    clock.t += dt; const f = sc.FX();
    clock.wind = sc.weather.wind(s); sc.actor.wind = clock.wind;
    clock.drift += dt * f * (1 + Math.abs(clock.wind) * 2.5) * (clock.wind < 0 ? -1 : 1);
    sc.yearNow = s.year;
    const trav = (s.cls === 'road' || s.cls === 'void') && !s.mon && !s.foe && !(s.boom || s.thunder || s.rise || s.dead);
    const A = sc.actor.P;
    if (trav) clock.travel += dt * (A.mode === 'ride' ? 72 : A.mode === 'walk' ? 38 : 0) * (sc.reduced ? 0.4 : 1);
    clock.sway = sc.reduced ? 0 : Math.sin(clock.t * 0.06) * 10;
    if (sc.fade.v < 1) { sc.fade.v = Math.min(1, sc.fade.v + dt / sc.fade.dur); palCur = lerpPal(palFrom, palTo, smooth(sc.fade.v)); } else palCur = palTo;
    sc.actor.update(dt, s);
    if (!s.c.dungeon) sc.fx.step(dt, s, geo);
  }
  // cây tiền cảnh nghiêng theo gió: chia lớp thành các dải ngang, dải càng cao càng lệch (đáy cố định)
  function drawOver(c2, w, t) {
    if (Math.abs(w) < 0.06) { B.over.draw(c2, 0, 0); return; }
    const sway = w * (3.5 + Math.sin(t * 1.7) * 0.8), band = 12;
    for (let y = 0; y < H; y += band) { const off = Math.round(sway * (1 - (y + band / 2) / H)), h = Math.min(band, H - y); c2.save(); c2.beginPath(); c2.rect(0, y, W, h); c2.clip(); B.over.draw(c2, off, 0); c2.restore(); }
  }
  function render(s, c2) {
    const pal = palCur || palTo, t = clock.t, terr = effTerr(s), dg = !!s.c.dungeon, trav = s.cls === 'road' || s.cls === 'void', cam = clock.travel + clock.sway, dr = clock.drift, w = clock.wind;
    const T = tintFn(pal), strip = (b, off, y, a) => sc.strip(c2, b, off, y, a), prof = sc.weather.profile(s);
    c2.setTransform(1, 0, 0, 1, 0, 0); c2.globalAlpha = 1;
    if (dg) {
      B.sky.draw(c2, 0, 0); B.arch.draw(c2, 0, 0);
      sc.fx.drawLamps(c2, pal, t, geo); sc.fx.drawFlames(c2, pal, t, geo); sc.dungeon.drawFx(c2, s, pal, t, geo);
    } else {
      B.sky.draw(c2, 0, 0); sc.drawSkyObjs(c2, pal, t, s);
      strip(B.high, dr * 2.2 + cam * 0.04, 4, 0.85);
      if (s.phase !== 'void') strip(B.far, cam * 0.15, 0, 1);
      if (terr.sea > 0 && !terr.water) strip(B.sea, dr * 1.8 + 420 + cam * 0.5, terr.seaY - 40, 0.8);
      if (s.phase !== 'void') strip(B.mid, cam * 0.25, 0, 1);
      strip(B.flt, cam * 0.32, 0, 1); sc.drawFalls(c2, pal, t, cam * 0.32, terr, geo);
      if (terr.water) { strip(B.water, 0, terr.water, 1); sc.drawWater(c2, pal, t, terr, cam); }
      if (terr.sea > 0) strip(B.sea, dr * 3.2 + cam * 0.8, terr.seaY - 14, 1);
      if (terr.near && !trav) B.near.draw(c2, -PAD + Math.round(clock.sway * 0.4), 0);
      strip(B.front, dr * 6.5 + 300 + cam, GY - 40, 0.92);
      B.arch.draw(c2, 0, 0);
      strip(B.fog, dr * 9 + cam * 1.2, GY - 22, 0.5);
      if (prof && prof.fog) { strip(B.fog, dr * 5 + 150, GY - 34, prof.fog); strip(B.fog, -dr * 6 + 320, GY - 12, prof.fog * 0.8); }
      if (s.vis && s.vis.length && ui.bld && !trav) drawStreet(c2, s, pal, t);
      sc.fx.drawLamps(c2, pal, t, geo); sc.fx.drawFlags(c2, pal, t, geo); sc.fx.drawFlames(c2, pal, t, geo);
      sc.fx.drawFireflies(c2, pal, t, terr);
      { const sty = DATA.SECT_STYLE[s.sect]; if (sty) sc.fx.accent(c2, sty.accent, pal, t, geo); }
      if (s.cls === 'road') sc.drawRoadside(c2, pal, T, terr, cam);
    }
    sc.actor.draw(c2, s, pal, t);
    if (s.mon && ui.sprites) { sc.use(c2); const def = D.monsterById[s.mon], boss = def && def.boss; ui.sprites.monster(sc.R, s.mon, boss ? 356 : 340, sc.actor.FY, Math.floor(t * 9), boss ? 6 : 4); }
    if (dg) drawOver(c2, 0, t); else drawOver(c2, w, t);
    if (!dg) { sc.fx.draw(c2, pal, t, terr); strip(B.fog, -dr * 7 + 500 - cam * 1.5, GY - 8, 0.16); }
    if (!dg) sc.weather.draw(c2, s, pal, t);
    sc.events.over(c2, s, pal, t);
  }

  function caption() {
    if (!cap || !st) return;
    const s = st, c = s.c, pl = s.pl, wx = s.wid && s.reg.weather ? (s.reg.weather.find(x => x.id === s.wid) || {}).name : '';
    const where = c.dungeon ? c.dungeon.name : c.cross ? 'Giữa hư không' : c.travel ? 'Trên đường · ' + s.reg.n : pl ? pl.n + ' · ' + s.reg.n : s.reg.n;
    cap.textContent = where + (wx ? ' · ' + wx : '') + (s.war ? ' · chiến loạn' : '') + ' · ' + ({ night: 'đêm', dusk: 'hoàng hôn', day: 'ban ngày', cave: 'tối tăm', void: 'hư không' }[s.phase]);
  }

  // ---------- vòng lặp ----------
  function tick(dt) {
    const t0 = performance.now();
    try {
      if (forced) { if (st !== forced) { st = forced; streetDirty = true; } }
      else if (frame % 9 === 0 || !st) { const ns = readState(); if (ns && (!st || ns.key !== st.key)) { st = ns; streetDirty = true; caption(); overlay(); } else if (ns) st.c = ns.c; }
      frame++;
      if (st) {
        build(st);
        advance(dt, st); render(st, ctx);
        const m = ui.scene && ui.scene.mirror;
        if (m && m.isConnected) { const mx = m.getContext('2d'); mx.imageSmoothingEnabled = false; mx.drawImage(cv, 0, 0); }
      }
    } catch (e) { if (!tick.warned) { tick.warned = true; console.error('scene', e); } }
    sc.perfRec(performance.now() - t0);
    if (dbg && frame % 15 === 0) dbg.textContent = 'vẽ ' + sc.perf.avg.toFixed(2) + ' ms (p95 ' + sc.perf.p95.toFixed(2) + ', max ' + sc.perf.max.toFixed(2) + ')\ndựng lại ' + sc.perf.rebuild.toFixed(1) + ' ms (' + sc.perf.rebuilds + ' lần)\nhạt ' + sc.fx.PT.length + ' · ' + CFG.W + 'x' + CFG.H;
  }
  function loop(now) {
    rafId = requestAnimationFrame(loop);
    if (document.hidden) { lastT = now; return; }
    const step = 1000 / CFG.FPS;
    if (now - lastT < step - 2) return;
    const dt = Math.min(0.1, Math.max(0.001, (now - lastT) / 1000)); lastT = now; tick(dt);
  }
  function init() {
    cv = document.getElementById('scene'); cap = document.getElementById('scene-cap'); if (!cv) return;
    cv.width = W; cv.height = H; ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
    streetCv = sc.mk(W, H); streetX = streetCv.getContext('2d'); streetX.imageSmoothingEnabled = false;
    // sân khấu bọc canvas để đặt nhãn công trình lên trên, bắt chuột rê và bấm vào công trình
    stage = document.createElement('div'); stage.className = 'sc-stage'; cv.parentNode.insertBefore(stage, cv); stage.appendChild(cv);
    ov = document.createElement('div'); ov.className = 'sc-ov'; stage.appendChild(ov);
    if (/[?&]debug=1/.test(location.search)) { dbg = document.createElement('div'); dbg.className = 'sc-dbg'; stage.appendChild(dbg); }
    cv.addEventListener('mousemove', e => { const i = hitIdx(e); if (i !== hoverIdx) { hoverIdx = i; streetDirty = true; cv.style.cursor = i >= 0 ? 'pointer' : ''; cv.title = i >= 0 ? ui.bld.nameOf(lay[i].id) + ': ' + ui.bld.defs[lay[i].id].desc : ''; ov.querySelectorAll('.bl').forEach(el => el.classList.toggle('h', +el.dataset.i === i)); } });
    cv.addEventListener('mouseleave', () => { hoverIdx = -1; streetDirty = true; ov.querySelectorAll('.bl.h').forEach(el => el.classList.remove('h')); });
    cv.addEventListener('click', e => { if (TT.world && TT.world.pending) return; const i = hitIdx(e); if (i >= 0 && ui.shop) ui.shop.open(lay[i].id); });
    document.addEventListener('visibilitychange', () => { lastT = performance.now(); });
    lastT = performance.now(); rafId = requestAnimationFrame(loop);
  }
  // Dùng cho kiểm thử và xem thử: ép một trạng thái cảnh, dựng ngay (không chuyển mượt) rồi chạy `frames` khung.
  // Gọi lại với cùng đối tượng s thì không dựng lại lớp tĩnh.
  let pv = null, inPreview = false; const EMPTY = () => ({ sky: '', arch: '', terr: '', cls: '' });
  function preview(s, frames, target) {
    const keepCv = cv, keepCtx = ctx, keepSt = st;
    if (!streetCv) { streetCv = sc.mk(W, H); streetX = streetCv.getContext('2d'); streetX.imageSmoothingEnabled = false; }
    if (target) { cv = target; ctx = target.getContext('2d'); ctx.imageSmoothingEnabled = false; }
    inPreview = true; st = s;
    if (!pv || pv.s !== s) { built = EMPTY(); palTo = null; palCur = null; streetDirty = true; build(s, true); palCur = palTo; sc.fade.v = 1; pv = { s, built, palTo }; }
    else { built = pv.built; palTo = pv.palTo; palCur = palTo; sc.fade.v = 1; }
    const n = Math.max(1, frames || 1);
    for (let i = 0; i < n; i++) { advance(1 / CFG.FPS, s); if (i === n - 1) render(s, ctx); }
    const out = cv; cv = keepCv; ctx = keepCtx; st = keepSt; built = EMPTY(); palTo = null; palCur = null; inPreview = false; // ép dựng lại cảnh thật ở khung kế
    return out;
  }
  ui.scene = { mirror: null, setPage, layout: () => lay, init, W, H, GY, state: () => st, draw: () => { if (st) render(st, ctx); }, readState, palette, preview, force: s => { forced = s; }, perf: sc.perf, config: CFG, setReduced: sc.setReduced };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
