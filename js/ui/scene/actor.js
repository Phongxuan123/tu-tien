// Nhân vật: sprite 16x24 (quay mặt sang phải) phóng 2x, người nhà, kẻ thù; chuyển động đi liên tục nghỉ ngắn,
// bay (lướt thấp, tà áo bay) và ngự kiếm (đứng trên kiếm, vệt kiếm quang) từ Trúc Cơ (c.realm >= 2).
// Biến thể: kid (thấp), elder (tóc bạc, gậy), female (tóc dài), wound (băng đỏ). Trang bị để dành cho phần vật phẩm.
(function () {
  const TT = window.TT, sc = TT.ui.sc, CFG = sc.CFG, W = CFG.W, GY = CFG.GY, K = 2;
  const { mix, clamp, smooth, hash, mulberry, mk } = sc;
  const FY = GY + 14; // y chân khi đứng trên mặt đất

  // ---------- bản đồ ký tự ----------
  // h tóc, s da, e mắt, r áo, R áo tối, t viền áo, w áo trong, b đai, g vàng, j vỏ kiếm, c tua đỏ, k giày, x băng đỏ, W gậy
  const pad16 = s => (s + '................').slice(0, 16);
  const UP = ['.....hh.', '....hhgh', '....hhhhhh', '...hhhhhhhh', '...hhhhhsss', '...hhhhsess', '....hhhssss', '.....hhsss', '.....ttwwtt', '....rrrwwrrr', '...rrrrwwrrrrr', '...Rrrrwwrrrrrr', '...Rrrrwwrrrrrr', '...Rbbbbbbgbrrr', '...RrrrRrrrrrRr'].map(pad16);
  const SK = ['...RrrrRrrrrttt', '...RrrrRrrrrttt', '..RrrrrRrrrrrr', '..RrrrrRrrrrrrr', '.RrrrrrRrrrrrrr', '.RrrrrrRrrrrrrrr', '.tttttttttttttt'].map(pad16);
  const legsRow = (xs, foot) => { const a = Array(16).fill('.'); xs.forEach(x => { a[x] = 'k'; a[x + 1] = 'k'; if (foot) a[x + 2] = 'k'; }); return a.join(''); };
  const shiftRow = (s, d) => d > 0 ? '.'.repeat(d) + s.slice(0, 16 - d) : s.slice(-d) + '.'.repeat(-d);
  const setCh = (m, x, y, ch) => { const r = m[y]; if (r && x >= 0 && x < 16) m[y] = r.slice(0, x) + ch + r.slice(x + 1); };
  const putIfEmpty = (m, x, y, ch) => { const r = m[y]; if (r && x >= 0 && x < 16 && r[x] === '.') m[y] = r.slice(0, x) + ch + r.slice(x + 1); };

  // key: i0 i1 (đứng thở), w0..w3 (đi), f0 f1 (bay), r0 r1 (đứng trên kiếm)
  function charMap(key, v) {
    let sk = SK.slice(), xs = [5, 9], bob = 0;
    if (key === 'i1') bob = 1;
    if (key === 'w0') { sk = sk.map((r, i) => i >= 3 ? shiftRow(r, 1) : r); xs = [4, 10]; }
    if (key === 'w2') { sk = sk.map((r, i) => i >= 3 ? shiftRow(r, -1) : r); xs = [5, 9]; }
    if (key === 'w1' || key === 'w3') { xs = [6, 8]; bob = 1; }
    if (key === 'f0') { sk = sk.map((r, i) => shiftRow(r, -Math.min(5, i + 1))); xs = [2, 4]; }
    if (key === 'f1') { sk = sk.map((r, i) => shiftRow(r, -Math.min(6, i + 2))); xs = [1, 3]; bob = 1; }
    if (key === 'r0') { sk = sk.map((r, i) => i >= 3 ? shiftRow(r, -1) : r); xs = [4, 10]; }
    if (key === 'r1') { sk = sk.map((r, i) => i >= 2 ? shiftRow(r, -2) : shiftRow(r, -1)); xs = [4, 10]; bob = 1; }
    const flying = key[0] === 'f';
    const rows = UP.concat(sk); rows.push(legsRow(xs, false)); rows.push(legsRow(xs, true));
    let m = rows.slice(0, 24);
    if (bob) { m.unshift('.'.repeat(16)); m.splice(24, 1); } // hạ thân một nhịp thở / nhịp bước, giữ chân cố định
    while (m.length < 24) m.push('.'.repeat(16));
    if (bob) { m[22] = legsRow(xs, false); m[23] = legsRow(xs, true); }
    // kiếm đeo sau lưng (không đeo khi đang đứng trên kiếm hay bay)
    if (key[0] !== 'r' && !flying) {
      for (let y = 4; y <= 21; y++) putIfEmpty(m, Math.round(2 - (y - 4) * 2 / 16), y, 'j');
      setCh(m, 2, 1, 'g'); [2, 3].forEach(y => { if (m[y][2] === '.') setCh(m, 2, y, y === 2 ? 'g' : 'c'); });
    }
    if (v.female) for (let y = 6; y <= 14; y++) { putIfEmpty(m, 3, y, 'h'); if (y > 8) putIfEmpty(m, 2, y, 'h'); }
    if (v.wound) { setCh(m, 8, 4, 'x'); setCh(m, 9, 4, 'x'); setCh(m, 10, 4, 'x'); setCh(m, 7, 11, 'x'); setCh(m, 8, 12, 'x'); }
    if (v.elder) for (let y = 9; y <= 23; y++) putIfEmpty(m, 15, y, 'W');
    if (v.kid) { // thấp hơn: bỏ bớt 6 hàng thân và váy, giữ mặt và chân
      const drop = new Set([11, 12, 16, 17, 18, 19]);
      const keep = m.filter((r, i) => !drop.has(i)); while (keep.length < 24) keep.unshift('.'.repeat(16)); m = keep;
    }
    return m;
  }

  const spriteCache = {};
  function sprite(v, key) {
    const ck = [v.robe, v.hair, v.sash, v.skin, v.female ? 1 : 0, v.kid ? 1 : 0, v.elder ? 1 : 0, v.wound ? 1 : 0, key].join('|');
    let c = spriteCache[ck]; if (c) return c;
    const robe = v.robe || '#8a7a66', pc = { h: v.hair || '#17171e', s: v.skin || '#ecc9a2', e: '#1b1b22', r: robe, R: mix(robe, '#000000', 0.38), t: mix(robe, '#ffffff', 0.6), w: '#f4f0e0', b: v.sash || mix(robe, '#c9a24a', 0.7), g: '#ecc873', j: '#5c3c2a', c: '#c8362c', k: '#101014', x: '#d8443a', W: '#8a6a3a' };
    c = mk(16, 24); const q = c.getContext('2d'), m = charMap(key, v);
    m.forEach((row, y) => { for (let x = 0; x < 16; x++) { const ch = row[x]; if (ch !== '.' && pc[ch]) { q.fillStyle = pc[ch]; q.fillRect(x, y, 1, 1); } } });
    if (Object.keys(spriteCache).length > 400) Object.keys(spriteCache).forEach(k => delete spriteCache[k]);
    return spriteCache[ck] = c;
  }

  const REALM_ROBE = ['#8a7a66', '#6aa0d8', '#3fb8b0', '#9a7ae0', '#e0b43a', '#e8497c', '#f4f0e0'];
  const AURA = ['', '', '#8affd8', '#c9a8ff', '#ffe08a', '#ff9ab8', '#ffffff'];
  const HAIRS = ['#17171e', '#3a2418', '#14141c', '#5a3a22'];
  const tc = mk(16, 24), tq = tc.getContext('2d');

  // ---------- trạng thái chuyển động ----------
  // mode: stand | walk | rest | fly | ride; alt: độ cao so với mặt đất (px)
  const P = { x: 240, dir: 1, mode: 'rest', tm: 0, wait: 0.4, tx: 240, alt: 0, excur: 12, ph: 0, rnd: mulberry(4242), cid: null };
  const FOL = []; // người nhà đi theo
  let trailAcc = 0;

  function frozen(s) { return s.boom || s.thunder || s.rise || s.dead; }
  function canSoar(s) { return s.c.realm >= 2; }

  function update(dt, s, ctxInfo) {
    P.tm += dt; P.ph += dt;
    const engaged = !!(s.mon || s.foe), travelling = s.cls === 'road' || s.cls === 'void', inDg = !!s.c.dungeon;
    if (P.cid !== s.c.id) { P.cid = s.c.id; P.x = 240; P.mode = 'rest'; P.wait = 0.3; P.alt = 0; FOL.length = 0; }
    const rnd = P.rnd, soar = canSoar(s) && !inDg;
    let speed = 0, wantAlt = 0, mode = P.mode;
    if (engaged || frozen(s)) { // đứng yên: tại chỗ khi sự kiện, bên trái khi giao chiến
      mode = 'stand'; const tx = engaged ? 96 : P.x; if (Math.abs(P.x - tx) > 1) { P.dir = tx > P.x ? 1 : -1; P.x += P.dir * 40 * dt; mode = 'walk'; } else P.dir = 1;
      if (frozen(s) && !engaged) P.dir = P.dir || 1;
      wantAlt = 0;
    } else if (travelling) { // đi đường: giữ nhân vật ở giữa, cảnh trượt
      P.dir = 1; const tx = soar ? 210 : 200; if (Math.abs(P.x - tx) > 2) { P.x += Math.sign(tx - P.x) * 40 * dt; mode = 'walk'; } else mode = soar ? 'ride' : 'walk';
      if (soar && mode === 'ride') wantAlt = 26 + Math.sin(P.ph * 1.2) * 3;
      if (soar && mode === 'walk') wantAlt = 0;
    } else {
      if (mode === 'ride' || mode === 'fly') { // đang bay / ngự kiếm trên đường ngẫu nhiên
        speed = mode === 'ride' ? 78 : 62; wantAlt = mode === 'ride' ? 30 + Math.sin(P.ph * 1.5) * 4 : 11 + Math.sin(P.ph * 2) * 1.5;
        const left = Math.abs(P.tx - P.x); if (left < 70) wantAlt = 0; // hạ dần khi gần đích
        P.x += P.dir * speed * dt;
        if ((P.dir > 0 && P.x >= P.tx) || (P.dir < 0 && P.x <= P.tx)) { P.x = P.tx; mode = 'rest'; P.tm = 0; P.wait = 0.6 + rnd() * 0.8; P.excur = 14 + rnd() * 12; }
      } else if (mode === 'walk') {
        P.x += P.dir * 26 * dt;
        if ((P.dir > 0 && P.x >= P.tx) || (P.dir < 0 && P.x <= P.tx)) { mode = 'rest'; P.tm = 0; P.wait = 0.4 + rnd() * 1.0; }
      } else { // nghỉ ngắn rồi đi tiếp
        P.excur -= dt;
        if (P.tm > P.wait) {
          const far = soar && P.excur <= 0 && P.alt < 1; let tx, tries = 0;
          do { tx = far ? 40 + rnd() * (W - 80) : 50 + rnd() * (W - 100); tries++; } while (Math.abs(tx - P.x) < (far ? 190 : 70) && tries < 12);
          P.tx = tx; P.dir = tx > P.x ? 1 : -1; P.tm = 0;
          mode = far ? (rnd() < 0.5 ? 'fly' : 'ride') : 'walk';
        }
      }
    }
    P.mode = mode;
    P.alt += (wantAlt - P.alt) * Math.min(1, dt * 4);
    if (P.alt < 0.3 && wantAlt === 0) P.alt = 0;
    P.x = clamp(P.x, 24, W - 24);

    // người nhà đi theo sau người chơi
    const want = s.people.length;
    while (FOL.length < want) FOL.push({ x: P.x - 20 * (FOL.length + 1), dir: 1, tm: Math.random() * 3, moving: false });
    FOL.length = want;
    FOL.forEach((f, i) => {
      f.tm += dt; const gap = 20 + i * 15, tx = clamp(P.x - (engaged ? 1 : P.dir) * gap, 20, W - 20), dx = tx - f.x;
      if (Math.abs(dx) > 3 && !travelling) { f.dir = Math.sign(dx); f.x += f.dir * Math.min(36, Math.abs(dx) * 3 + 14) * dt; f.moving = true; } else { f.moving = false; if (engaged || P.mode === 'stand') f.dir = 1; }
    });

    // vệt kiếm quang khi ngự kiếm, bụi linh khí khi bay
    if (P.mode === 'ride' || P.mode === 'fly') {
      trailAcc += dt * (P.mode === 'ride' ? 90 : 40) * sc.FX();
      while (trailAcc >= 1) {
        trailAcc -= 1; const y = FY - P.alt + (P.mode === 'ride' ? 2 : -22), back = travelling ? -1 : -P.dir;
        sc.fx.emit(P.x + back * (P.mode === 'ride' ? 22 : 10), y + (rnd() - 0.5) * 3, back * (4 + rnd() * 14), (rnd() - 0.5) * 6, 0.5 + rnd() * 0.4, rnd() < 0.5 ? '#7af4dc' : '#ffffff', 1, 0.97);
      }
    }
  }

  function keyFor(mode, tm, moving) {
    if (mode === 'walk') return 'w' + (Math.floor(tm * 7) % 4);
    if (mode === 'fly') return 'f' + (Math.floor(tm * 5) % 2);
    if (mode === 'ride') return 'r' + (Math.floor(tm * 2) % 2);
    return Math.floor(tm / 0.9) % 2 ? 'i1' : 'i0';
  }

  // vẽ một người: x giữa chân, fy y chân; opts: dir, glow, aura, auraCol, t
  function blit(ctx, pal, v, key, x, fy, dir, o) {
    o = o || {};
    const spr = sprite(v, key); tq.clearRect(0, 0, 16, 24); tq.drawImage(spr, 0, 0);
    tq.globalCompositeOperation = 'source-atop'; tq.globalAlpha = clamp(pal.amb * 0.7, 0, 0.5); tq.fillStyle = pal.m3; tq.fillRect(0, 0, 16, 24);
    if (o.glow > 0.01) { tq.globalAlpha = clamp(o.glow, 0, 1); tq.fillStyle = '#d8fff4'; tq.fillRect(0, 0, 16, 24); }
    tq.globalAlpha = 1; tq.globalCompositeOperation = 'source-over';
    const gx = Math.round(x), gfy = Math.round(fy);
    if (o.aura) { const a = 0.14 + 0.08 * Math.sin((o.t || 0) * 2.2 + (o.ph || 0)); ctx.globalAlpha = a; sc.use(ctx); sc.ell(gx, gfy - 22, 20, 28, o.auraCol || '#ffe08a'); ctx.globalAlpha = a * 1.2; sc.ell(gx, gfy - 22, 12, 20, o.auraCol || '#ffe08a'); ctx.globalAlpha = 1; }
    ctx.save(); ctx.translate(gx, gfy);
    const wd = sc.actor.wind || 0; if (Math.abs(wd) > 0.08 && !o.noWind) ctx.transform(1, 0, -wd * 0.16, 1, 0, 0); // gió nghiêng người và tà áo về phía thổi
    ctx.translate(0, -24 * K); if (dir < 0) ctx.scale(-1, 1); ctx.drawImage(tc, 0, 0, 16, 24, -8 * K, 0, 16 * K, 24 * K); ctx.restore();
  }
  const shadow = (ctx, pal, x, y, a) => { ctx.globalAlpha = 0.3 * a; ctx.fillStyle = pal.ink; ctx.fillRect(Math.round(x) - 10, Math.round(y) - 1, 20, 1); ctx.fillRect(Math.round(x) - 7, Math.round(y), 14, 1); ctx.globalAlpha = 1; };
  // kiếm dưới chân + quầng sáng
  function sword(ctx, pal, x, y, dir, len, t) {
    const L = Math.round(len), x0 = Math.round(x) - Math.floor(L / 2);
    ctx.globalAlpha = 0.3; ctx.fillStyle = pal.jade; ctx.fillRect(x0 - 2, y - 2, L + 4, 6); ctx.globalAlpha = 1;
    ctx.fillStyle = '#eaffff'; ctx.fillRect(x0, y, L, 1); ctx.fillStyle = '#7ac4d0'; ctx.fillRect(x0, y + 1, L, 1);
    ctx.fillStyle = '#ecc873'; ctx.fillRect(Math.round(x) - dir * Math.floor(L / 2) - (dir > 0 ? 0 : 2), y - 1, 3, 3); ctx.fillStyle = '#c8362c'; ctx.fillRect(Math.round(x) - dir * (Math.floor(L / 2) + 2), y, 2, 1);
  }

  function playerLook(s) {
    const c = s.c;
    return { robe: REALM_ROBE[Math.min(6, c.realm)], hair: s.elder ? '#d8d8e0' : HAIRS[c.id % 4], sash: c.realm >= 1 ? '#e8497c' : null, female: c.gender === 'nu', kid: s.kid, elder: s.elder, wound: s.wound };
  }
  function kinLook(f, i) {
    const o = f.c, kid = f.k === 'kid' || TT.age(o) < 12;
    return { robe: f.k === 'love' ? '#e87aa0' : f.k === 'dis' ? REALM_ROBE[Math.min(6, o.realm)] : ['#6aa0d8', '#d8b43a', '#8ad88a', '#c88ae0'][o.id % 4], hair: HAIRS[o.id % 4], sash: f.k === 'dis' ? '#e8497c' : null, female: o.gender === 'nu', kid, elder: f.k === 'dan' && TT.age(o) >= 55, wound: false };
  }

  // vẽ người nhà + người chơi + kẻ thù (không vẽ quái, quái do scene.js)
  function draw(ctx, s, pal, t) {
    const c = s.c, engaged = !!(s.mon || s.foe), v = playerLook(s);
    FOL.forEach((f, i) => { const fv = kinLook(s.people[i], i); shadow(ctx, pal, f.x, FY, 1); blit(ctx, pal, fv, f.moving ? 'w' + (Math.floor((f.tm + i) * 7) % 4) : (Math.floor((f.tm + i * 0.4) / 0.9) % 2 ? 'i1' : 'i0'), f.x, FY, f.dir, {}); });
    const key = keyFor(P.mode, P.tm, false), up = Math.round(P.alt);
    const glowing = s.boom ? 0.45 : 0, aura = c.realm >= 2 || s.boom, auraCol = s.boom ? '#ffffff' : AURA[Math.min(6, c.realm)];
    shadow(ctx, pal, P.x, FY, clamp(1 - P.alt / 40, 0.25, 1));
    const dirv = P.mode === 'stand' ? 1 : P.dir;
    if (P.mode === 'ride') { sword(ctx, pal, P.x, FY - up + 2, dirv, 46, t); blit(ctx, pal, v, key, P.x, FY - up + 2, dirv, { aura, auraCol, t, glow: glowing }); }
    else blit(ctx, pal, v, key, P.x, FY - up, dirv, { aura, auraCol, t, glow: glowing });
    if (s.foe) blit(ctx, pal, { robe: '#5a2a3a', hair: '#14141c', sash: '#e8433a', female: s.foe.gender === 'nu', kid: false }, 'i' + (Math.floor(t / 0.9) % 2), 330, FY, -1, { aura: s.foe.realm >= 2, auraCol: '#c04a6a', t, ph: 5 });
  }

  sc.actor = { update, draw, P, FY, FOL, REALM_ROBE, sprite, wind: 0 };
})();
