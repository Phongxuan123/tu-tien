// Thế giới và vòng đời: tạo thế giới, bước thời gian theo tháng, sinh/chết/phi thăng, đầu thai.
// Chỉ vùng mà người chơi đang ở được mô phỏng từng tháng; vùng khác đứng yên và được "bù thời gian" khi người chơi tới.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats;

  const life = TT.life = {};

  // Kết thúc một kiếp của người chơi: ghi sử ký, mở khóa kết cục, hỏi đầu thai hay kế thừa.
  life.endLife = function (c, how) {
    const w = TT.world, age = TT.age(c);
    const endings = TT.meta ? TT.meta.classify(c, how) : [];
    w.lives = w.lives || [];
    w.lives.push({
      name: c.name, age, realm: c.realm, cause: c.cause, how, endings: endings.map(e => e.id),
      year: Math.floor(w.months / 12) - TT.config.startYear + 1, kids: TT.family.children(c).length, kills: c.nghiep
    });
    TT.fac.lifeEnded();
    if (TT.meta) TT.meta.record(endings, c);
    const heirs = TT.family.heirs(c);
    const choices = [{ key: 'reborn', label: 'Đầu thai làm người mới (tư chất có xác suất tốt hơn, không mang theo gì)' }];
    heirs.forEach(h => {
      choices.push({ key: 'heir:' + h.c.id, label: 'Kế thừa ' + h.c.name + ' (' + h.how + ', ' + TT.age(h.c) + ' tuổi, ' + D.REALM_NAMES[h.c.realm] + '), gánh nhân quả đời trước' });
    });
    const karma = [];
    if (c.nghiep) karma.push('nghiệp ' + c.nghiep);
    const foes = TT.rel.list(c).filter(x => x.c && x.c.alive && x.r.k === 'thu').length;
    if (foes) karma.push(foes + ' kẻ thù');
    if (c.debts && c.debts.length) karma.push(c.debts.length + ' nợ ân tình');
    const head = how === 'ascend'
      ? 'Thiên môn mở rộng, bạn phi thăng ở tuổi ' + age + '. Trong 8 tỷ người, bạn là người hiếm hoi làm được.'
      : 'Tuổi ' + age + ': ' + c.cause + '. Cảnh giới đạt được: ' + D.REALM_NAMES[c.realm] + '.';
    const endTxt = endings.length ? '\nKết cục: ' + endings.map(e => e.n).join(', ') + '.' : '';
    TT.decisions.request({
      type: how, charId: c.id, title: how === 'ascend' ? 'Phi thăng!' : 'Đạo tiêu',
      text: head + endTxt + '\nBạn có thể đầu thai làm người mới' + (heirs.length ? ' hoặc để con cháu, đồ đệ kế thừa. Kế thừa thì mang theo nhân quả' +
        (karma.length ? ' (' + karma.join(', ') + ')' : '') + ': ơn, nghiệp, kẻ thù, nợ ân tình đều phải gánh.' : '. Bạn chưa có con hay đồ đệ nào để kế thừa.'),
      choices
    });
  };

  // ---------- chết, phi thăng ----------
  // Cái chết thường đi qua đề nghị Nghịch Thiên (chỉ người chơi, nếu còn lượt và Thiên cơ điểm).
  life.die = function (c, cause) {
    if (!c.alive) return;
    if (c.kind === 'player' && TT.nt.offer(c, cause)) return;
    life.dieNow(c, cause);
  };
  life.dieNow = function (c, cause) {
    if (!c.alive) return;
    c.alive = false;
    c.deathMonth = TT.world.months;
    c.cause = cause;
    const age = TT.age(c);
    TT.log(c, 'Tuổi ' + age + ': ' + cause + '.', 'bad');
    // Người thân thiết của người chơi qua đời: nhật ký ghi lại và đạo tâm tổn thương.
    const pl = TT.player();
    if (pl && pl !== c && pl.alive && pl.relIds && pl.relIds[c.id]) {
      const r = TT.rel.get(pl, c);
      if (r && (r.v >= 40 || (r.k && r.k !== 'thu'))) {
        TT.log(pl, TT.rel.label(pl, c) + ' ' + c.name + ' đã qua đời (' + cause + ').', 'bad');
        TT.ev.dao(pl, r.k === 'ket_nghia' || r.v >= 70 ? -3 : -1);
      }
    }
    if (c.kind === 'player') {
      TT.news('Bạn đã qua đời ở tuổi ' + age + '.', 'bad', [c.id]);
      life.endLife(c, 'death');
    } else {
      const who = (c.role ? c.role + ' ' : '') + c.name;
      TT.news(who + ' (' + D.REALM_NAMES[c.realm] + ') qua đời ở tuổi ' + age + ': ' + cause + '.', c.realm >= 2 ? 'bad' : '', [c.id]);
    }
    // Người giữ chức cao của tông môn qua đời: kế vị. Chức vụ khác của NPC phụ thì dựng người thay.
    if (c.sect && c.sect.rank >= 3) TT.sect.onDeath(c);
    else if (c.kind === 'npc' && c.tier === 'phu' && c.role) life.replaceRole(c);
    TT.bus.emit('death', { id: c.id });
  };

  life.ascend = function (c) {
    c.alive = false;
    c.ascended = true;
    c.deathMonth = TT.world.months;
    c.cause = 'phi thăng';
    const age = TT.age(c);
    TT.log(c, 'Thiên môn mở rộng, bạn bay lên không trung. Phi thăng!', 'big');
    if (c.kind === 'player') {
      TT.news('Bạn đã phi thăng ở tuổi ' + age + '!', 'good', [c.id]);
      life.endLife(c, 'ascend');
    } else {
      TT.news(c.name + ' đã phi thăng ở tuổi ' + age + '!', 'good', [c.id]);
    }
    if (c.sect && c.sect.rank >= 3) TT.sect.onDeath(c);
    TT.bus.emit('death', { id: c.id });
  };

  // ---------- một tháng của một nhân vật ----------
  life.stepChar = function (c) {
    const w = TT.world;
    // Trẻ dưới 12 tuổi chỉ lớn lên (chưa tu luyện, chưa gặp sự kiện).
    if (TT.age(c) < 12 && c.tier !== 'phu') {
      c.focus = 'child'; c.hp = S.hpMax(c);
      if ((w.months - c.birthMonth) % 12 === 0) {
        TT.family.yearly(c);
        if (c.kind === 'player') TT.log(c, 'Tuổi ' + TT.age(c) + ': lớn lên.', 'age');
      }
      return;
    }
    if (c.pregnant && w.months >= c.pregnant.due) TT.family.birth(c);
    if (c.cross) {
      // Đang vượt vùng: chỉ tu luyện ở tốc độ giảm, gặp sự kiện dọc đường.
      c.focus = 'cross';
      TT.cult.monthly(c, 'train');
      TT.cross.step(c);
    } else if (c.travel) {
      // Đang trên đường trong vùng: mất thời gian, không tu luyện hay làm việc.
      c.focus = 'travel';
      TT.cult.monthly(c, 'travel');
      TT.map.stepTravel(c);
    } else {
      c.focus = TT.ai.choose(c);
      TT.cult.monthly(c, c.focus);
    }

    if (c.hp <= 0) {
      const p = c.place ? TT.map.place(c.place) : null;
      return life.die(c, 'thân thể kiệt quệ' + (p ? ' tại ' + p.n : '') + ', gục xuống và không dậy nữa');
    }
    if (!c.travel && !c.cross) {
      TT.events.monthly(c);
      if (!c.alive) return;
      TT.ai.considerMove(c);
      if (c.kind === 'npc' && c.vows.length) { TT.social.hostile(c); if (!c.alive) return; }
    }
    if (c.kind === 'player') { TT.goals.touch(c); TT.report.tick(c); TT.path.tick(c); TT.quests.tick(c); }

    if (c.kind === 'player') {
      if (c.realm >= 2) c.known.luck = true;
      if (c.realm >= 3) c.known.kv = true;
    }

    if (!S.canBreak(c)) c.stuck = false;
    if (S.canBreak(c) && !S.gateOk(c)) {
      if (!c.stuck) {
        c.stuck = true;
        TT.log(c, 'Bình cảnh! Tu vi đã đầy nhưng còn thiếu cơ duyên (' + Math.floor(c.fortune) + '/' + S.fortuneNeed(c) +
          '). Hãy tìm cơ duyên; tu luyện thêm cũng giúp tăng xác suất đột phá.', 'bad');
      }
    } else if (S.ready(c) && w.months >= c.breakDelay && !c.cross) {
      c.stuck = false;
      if (c.kind === 'player') {
        if (!w.pending) TT.decisions.breakthroughFor(c);
      } else if (c.hp >= S.hpMax(c) * 0.6) {
        TT.cult.autoAids(c);
        TT.cult.attemptBreak(c);
        if (!c.alive) return;
      }
    }

    if ((w.months - c.birthMonth) % 12 === 0) {
      const age = TT.age(c);
      if (c.kind === 'player') {
        const parts = [];
        if (c.focus === 'train') parts.push('tu vi +' + Math.round(c.yXp));
        if (c.focus === 'work') parts.push(c.sect ? 'làm nhiệm vụ tông môn, cống hiến +' + Math.round(c.yContrib || 0) : 'vàng +' + Math.round(c.yGold));
        if (c.focus === 'social') parts.push('giao du bạn bè');
        if (c.focus === 'dual') parts.push('song tu cùng đạo lữ, tu vi +' + Math.round(c.yXp));
        if (c.focus === 'craft') parts.push('luyện nghề');
        if (c.focus === 'forge') parts.push('thân thể cường tráng hơn');
        if (c.focus === 'rest') parts.push('dưỡng sức');
        if (c.focus === 'seek') parts.push('rong ruổi tìm cơ duyên');
        if (c.focus === 'travel') parts.push('trên đường di chuyển');
        if (c.focus === 'cross') parts.push('trên đường vượt vùng, tu vi +' + Math.round(c.yXp));
        TT.log(c, 'Tuổi ' + age + ': ' + parts.join(', ') + '.', 'age');
      }
      if (c.kind === 'player') {
        TT.report.close(c);
        if (TT.decisions.mode() === 'tu_dong') TT.auto.assist(c);
      }
      c.lastYContrib = c.yContrib || 0;
      c.yXp = 0; c.yGold = 0; c.yContrib = 0;
      if (c.kind === 'player' && age > 0 && age % 12 === 0) { c.tcd += 1; TT.log(c, 'Tuổi ' + age + ': Thiên cơ điểm +1 (mười hai năm một vòng).', 'good'); }
      TT.social.yearly(c);
      TT.family.yearly(c);
      TT.sect.yearly(c);
      if (c.kind === 'player') TT.goals.yearly(c);
      if (age >= S.lifeSpan(c) && c.alive) life.die(c, 'thọ nguyên cạn kiệt');
    }
  };

  // NPC phụ không tu luyện, chỉ già đi và chết rồi được thay bằng người kế nhiệm cùng chức vụ.
  life.lightStep = function (c) {
    const w = TT.world;
    if ((w.months - c.birthMonth) % 12 !== 0) return;
    if (TT.age(c) >= S.lifeSpan(c)) life.die(c, 'thọ nguyên cạn kiệt');
  };

  // ---------- tạo NPC ----------
  function roleDef(placeType, title) {
    return (D.ROLES[placeType] || []).find(r => r[0] === title) || null;
  }

  life.makeRoleNpc = function (placeId, def) {
    const p = TT.map.place(placeId);
    const realm = rng.RI(def[1], def[2]);
    const lifeLen = D.LIFE[realm];
    const age = realm === 0 ? rng.RI(30, 60) : rng.RI(40, Math.max(41, Math.floor(lifeLen * 0.5)));
    const c = TT.createChar({ kind: 'npc', tier: 'phu', role: def[0], region: p.region, place: placeId, age });
    c.realm = realm;
    c.hp = S.hpMax(c);
    c.gold = rng.RI(20, 200) * (1 + realm);
    if (p.type === 'tong_mon') { // chưởng môn và trưởng lão là thành viên bậc cao của tông môn
      const rank = def[0] === 'Chưởng môn' ? 4 : 3;
      c.sect = { id: placeId, rank, contrib: 0, total: rank === 4 ? 9000 : 3000, since: TT.world.months };
    }
    return c;
  };

  life.replaceRole = function (c) {
    const p = TT.map.place(c.place);
    const def = p && roleDef(p.type, c.role);
    if (def) life.makeRoleNpc(c.place, def);
  };

  // NPC lõi: mô phỏng nền từ 12 tuổi đến tuổi hiện tại; nếu chết giữa chừng thì bốc lại.
  life.spawnNpc = function (age, regionId) {
    const w = TT.world;
    for (let tries = 0; tries < 8; tries++) {
      const c = TT.createChar({ kind: 'npc', age: age, region: regionId });
      const end = w.months;
      const wasQuiet = TT.quiet;
      TT.quiet = true;
      try {
        for (let m = c.birthMonth + 12 * 12 + 1; m <= end && c.alive; m++) {
          w.months = m;
          life.stepChar(c);
        }
      } finally {
        w.months = end;
        TT.quiet = wasQuiet;
      }
      if (c.alive) return c;
      delete w.chars[c.id];
    }
    return null;
  };

  // Du hành giả: NPC có cách vượt vùng (tự thân, truyền tống trận, thương đoàn).
  const TRAVELER_METHODS = [
    { method: 'canh_gioi', label: 'tự thân bay qua', realm: [4, 5], gold: 500 },
    { method: 'tran_phap', label: 'kích hoạt truyền tống trận cổ', realm: [3, 4], gold: 2500 },
    { method: 'thuong_doan', label: 'đi theo thương đoàn', realm: [2, 3], gold: 3000 }
  ];
  life.makeTraveler = function (regionId, placeId, foreignFrom) {
    const m = rng.pick(TRAVELER_METHODS);
    const realm = rng.RI(m.realm[0], m.realm[1]);
    const age = rng.RI(60, Math.max(61, Math.floor(D.LIFE[realm] * 0.4)));
    const c = TT.createChar({ kind: 'npc', tier: 'core', region: regionId, place: placeId, age });
    c.realm = realm;
    c.hp = S.hpMax(c);
    c.gold = m.gold + rng.RI(0, 500);
    c.traveler = { method: m.method, label: m.label };
    if (foreignFrom) { c.foreign = true; c.homeRegion = foreignFrom; }
    return c;
  };

  function aliveCore(regionId) {
    const w = TT.world; let n = 0;
    for (const id in w.chars) {
      const c = w.chars[id];
      if (c.alive && c.kind === 'npc' && c.tier === 'core' && c.region === regionId) n++;
    }
    return n;
  }

  // ---------- vùng: dựng lần đầu và bù thời gian ----------
  life.populateRegion = function (rid) {
    const w = TT.world;
    w.regions = w.regions || {};
    w.regions[rid] = { populated: true, lastMonth: w.months };
    const n = rng.RI(TT.config.coreMin, TT.config.coreMax);
    for (let i = 0; i < n; i++) life.spawnNpc(rng.RI(12, 70), rid);
    TT.map.placesOf(rid).forEach(p => {
      (D.ROLES[p.type] || []).forEach(def => life.makeRoleNpc(p.id, def));
    });
    const nt = rng.RI(1, 3);
    for (let i = 0; i < nt; i++) life.makeTraveler(rid, rng.pick(TT.map.placesOf(rid)).id, null);
    TT.sect.ensureLeaders(rid);
  };

  life.catchUp = function (rid) {
    const w = TT.world, st = w.regions[rid];
    if (!st || st.lastMonth >= w.months) return;
    const now = w.months, wasQuiet = TT.quiet;
    TT.quiet = true;
    try {
      const ids = Object.keys(w.chars);
      ids.forEach(id => {
        const c = w.chars[id];
        if (!c || !c.alive || c.kind !== 'npc' || c.region !== rid) return;
        for (let m = st.lastMonth + 1; m <= now && c.alive; m++) {
          w.months = m;
          if (c.tier === 'phu') life.lightStep(c); else life.stepChar(c);
        }
      });
      w.months = now;
      // Bổ sung dân số cho đủ.
      let guard = 0;
      while (aliveCore(rid) < TT.config.coreMin && guard++ < 30) life.spawnNpc(rng.RI(12, 60), rid);
      TT.sect.ensureLeaders(rid);
    } finally {
      w.months = now;
      TT.quiet = wasQuiet;
    }
    st.lastMonth = now;
  };

  life.enterRegion = function (rid) {
    const w = TT.world;
    w.regions = w.regions || {};
    if (w.weather) delete w.weather[rid];
    if (!w.regions[rid] || !w.regions[rid].populated) life.populateRegion(rid);
    else life.catchUp(rid);
  };

  // Hằng năm trong vùng đang hoạt động: du hành giả rời đi, khách lạ từ vùng khác đến.
  function yearlyRegion(rid) {
    const w = TT.world;
    const reg = TT.map.region(rid);
    const p = TT.player();
    const neighbors = TT.map.macroNeighbors(rid);
    TT.sect.ensureLeaders(rid);
    for (const id of Object.keys(w.chars)) {
      const c = w.chars[id];
      if (!c.alive || c.region !== rid || !c.traveler || c.kind !== 'npc') continue;
      if (rng.P(0.04) && neighbors.length) {
        const to = rng.pick(neighbors).to;
        c.alive = false; c.left = true; c.deathMonth = w.months; c.cause = 'rời vùng';
        TT.news(c.name + ' (' + D.REALM_NAMES[c.realm] + ') đã rời ' + reg.n + ' tới ' + TT.map.region(to).n + ' bằng cách ' + c.traveler.label + '.', '', [c.id]);
      }
    }
    if (neighbors.length && rng.P(0.05)) {
      const from = rng.pick(neighbors).to;
      const gate = TT.map.gateOf(rid);
      const c = life.makeTraveler(rid, gate, from);
      TT.news('Một khách lạ từ ' + TT.map.region(from).n + ' (' + c.name + ', ' + D.REALM_NAMES[c.realm] + ') vừa đến ' + TT.map.place(gate).n + '.', 'good', [c.id]);
      if (p && p.alive && p.region === rid) TT.cross.learn(p, from);
    }
  }

  // ---------- một tháng của cả thế giới ----------
  life.stepWorld = function () {
    const w = TT.world;
    w.months++;
    w.regions = w.regions || {};
    const p = TT.player();
    const active = p && !p.cross ? p.region : null;
    if (active) TT.map.stepWeather(active);

    const ids = Object.keys(w.chars);
    for (const id of ids) {
      const c = w.chars[id];
      if (!c || !c.alive) continue;
      if (c.kind === 'player') { if (c.id === w.playerId) life.stepChar(c); continue; }
      if (c.region !== active) continue;
      if (c.tier === 'phu') life.lightStep(c); else life.stepChar(c);
    }

    if (active) {
      if (aliveCore(active) < TT.config.coreMin && rng.P(0.35)) {
        const c = TT.createChar({ kind: 'npc', age: rng.RI(12, 25), region: active });
        TT.log(c, 'Đến đây tìm đường tu hành.', 'age');
      }
      if (w.months % 12 === 0) yearlyRegion(active);
      if (w.regions[active]) w.regions[active].lastMonth = w.months;
    }
    if (w.months % 12 === 0) { TT.fac.yearly(); TT.sect.worldYearly(); TT.res.yearly(); { const pl0 = TT.player(); if (pl0) TT.hoi.yearly(pl0); } }
    const now = TT.player();
    if (now && !now.cross && w.regions[now.region]) w.regions[now.region].lastMonth = w.months;

    TT.rumors.monthly();
    TT.eco.monthly();
    if (w.months % D.PRESS.period === 0) TT.press.publish();
    { const pl1 = TT.player(); if (pl1) TT.press.monthly(pl1); }

    // Dọn người đã mất hoặc đã rời lâu để bản lưu không phình to (giữ lại người chơi còn nhớ).
    if (w.months % 12 === 0) {
      for (const id of Object.keys(w.chars)) {
        const c = w.chars[id];
        if (c.alive || c.kind !== 'npc') continue;
        const keep = c.left ? 12 * 5 : 12 * 50;
        if (c.deathMonth < w.months - keep && !TT.rel.remembered(c)) { TT.rel.forget(c.id); delete w.chars[id]; }
      }
    }

    if (w.months % TT.config.autosaveMonths === 0) TT.bus.emit('autosave');
    TT.bus.emit('tick');
  };

  // Tạo người chơi mới (kiếp mới): hồi sinh ngẫu nhiên ở một địa điểm của một vùng.
  // opts.boost: đầu thai sau khi chết, tư chất có xác suất tốt hơn (bốc hai lần lấy lần tốt hơn), không mang theo gì.
  life.reincarnate = function (opts) {
    opts = opts || {};
    const w = TT.world;
    const prev = w.playerId != null ? w.chars[w.playerId] : null;
    if (life.keepUndo && !opts.noUndo) { life.undo = TT.save.snapshot(); life.undoOpts = { boost: !!opts.boost }; } // giao diện: để "Bốc lại" quay về trước lúc sinh
    const rid = rng.wpick(D.REGIONS, r => r.birth * TT.pop.birthMul(r.id)).id;
    life.enterRegion(rid);
    const c = TT.createChar({ kind: 'player', age: 12, region: rid });
    if (prev) { // giữ hướng đi và quy tắc nếu-thì người chơi đã chọn
      if (prev.rules) c.rules = JSON.parse(JSON.stringify(prev.rules));
    }
    if (opts.boost) {
      const alt = TT.rollTuChat();
      if (alt.total > c.tuchat.total) c.tuchat = alt;
    }
    w.playerId = c.id;
    // Pháp bảo bản mệnh là thứ duy nhất đi theo qua đầu thai (cấp giảm một nửa).
    const prevRelic = prev && prev.equip && prev.equip.relic && D.ITEMS[prev.equip.relic];
    if (prevRelic && prevRelic.relic) { c.equip = c.equip || {}; c.equip.relic = TT.gear.withLv(prev.equip.relic, Math.floor(prevRelic.lv / 2)); c.relicXp = 0; }
    const reg = TT.map.region(rid), pl = TT.map.place(c.place);
    if (opts.boost) TT.log(c, 'Qua cầu Nại Hà, ký ức kiếp trước tan thành sương, chỉ còn chút phước lành vương lại cho linh hồn.', 'age');
    TT.log(c, 'Bạn được sinh ra là ' + c.origin + ' tại ' + pl.n + ' (' + pl.faction + '), vùng ' + reg.n + '.', 'big');
    TT.log(c, 'Môi trường nơi đây: ' + reg.env.name + '. ' + reg.env.desc);
    TT.log(c, 'Tư chất của bạn: ' + c.tuchat.total + ' điểm (' + c.tuchat.attrs.map(a => a.n + ' ' + a.p).join(', ') + ').');
    if (c.traitIds.length) TT.log(c, 'Tiên thiên: ' + c.traitIds.map(id => D.traitById[id].n).join(', ') + '.');
    if (c.ring) TT.log(c, 'Chiếc nhẫn trên ngón tay bạn phát sáng. Có tiếng thì thầm của một lão gia gia. Mệnh Long Ngạo Thiên!', 'big');
    TT.social.childhood(c);
    if (c.equip && c.equip.relic) TT.log(c, 'Pháp bảo bản mệnh ' + D.ITEMS[c.equip.relic].n + ' theo bạn qua kiếp, nhưng đã yếu đi nhiều.', 'good');
    TT.log(c, 'Bạn bước chân vào con đường tu tiên.', 'age');
    TT.fac.welcome(c);
    TT.news('Một người mới ra đời ở ' + reg.n + ': ' + c.name + ' (bạn).', 'good', [c.id]);
    TT.bus.emit('reincarnate', { id: c.id, kind: 'new', first: !prev });
    // Tuổi thơ (8A3): hộp Đời mới đang mở thì hộp tuổi thơ chạy sau khi xác nhận; không thì chạy tự động (Tự động, kiểm thử).
    if (!(TT.ui && TT.ui.newLife && TT.ui.newLife.isOpen())) TT.childhood.auto(c);
    return c;
  };

  // Kế thừa: người con hoặc đồ đệ thay người chơi tiếp tục, mang theo nhân quả đời trước (ơn, nghiệp, kẻ thù, nợ ân tình).
  life.inherit = function (prev, heir) {
    const w = TT.world, rel = TT.rel;
    heir.kind = 'player'; heir.tier = 'player'; heir.role = null;
    w.playerId = heir.id;
    heir.direction = 'can_bang'; heir.job = null; heir.path = null; heir.pathAsked = false; heir.pathMo = {}; heir.autoMove = true; heir.focus = 'train';
    heir.rules = prev.rules ? JSON.parse(JSON.stringify(prev.rules)) : TT.rules.defaults();
    heir.known = { kv: false, luck: false }; heir.quests = []; heir.qs = null; heir.plan = null; heir.dest = null;
    heir.gold += Math.floor(prev.gold * 0.6);
    heir.tcd += Math.floor(prev.tcd * 0.5);
    heir.daoDiem += Math.floor(prev.daoDiem * 0.3);
    heir.rep = { chinh: Math.round(prev.rep.chinh * 0.5), danh: Math.round(prev.rep.danh * 0.5) };
    heir.nghiep = Math.ceil(prev.nghiep * 0.5);
    heir.ntLife = (prev.ntLife || 0) * 0.5; heir.nt = null; // thọ nguyên đã tổn vì Nghịch Thiên truyền một nửa cho người thừa kế
    heir.debts = (prev.debts || []).map(d => Object.assign({}, d)); // nợ ân tình phải gánh
    // Di vật: túi đồ và trang bị truyền lại; công pháp tu luyện đã sâu (từ tầng 3) để lại thành bí kíp.
    heir.inv = heir.inv || {};
    heir.ls = (heir.ls || 0) + Math.floor((prev.ls || 0) * 0.6); // linh thạch cũng chỉ mang theo 60%, như vàng
    Object.keys(prev.inv || {}).forEach(id => {
      if (D.ITEMS[id] && D.ITEMS[id].cat === 'ls') { const n = Math.floor(prev.inv[id] * 0.6); if (n) heir.inv[id] = (heir.inv[id] || 0) + n; return; }
      heir.inv[id] = (heir.inv[id] || 0) + prev.inv[id];
    });
    Object.keys(prev.equip || {}).forEach(slot => { if (prev.equip[slot]) heir.inv[prev.equip[slot]] = (heir.inv[prev.equip[slot]] || 0) + 1; });
    Object.keys(prev.techs || {}).forEach(id => { if (prev.techs[id].lv >= 3) heir.inv['bk_' + id] = (heir.inv['bk_' + id] || 0) + 1; });
    heir.aid = { pill: 0, room: false, ngung: false, ho: false, guard: 0, tcd: false };
    const favors = [], foes = [];
    rel.list(prev).forEach(x => {
      const o = x.c, r = x.r;
      if (!o || !o.alive || o.id === heir.id) return;
      if (r.debt && r.cred === prev.id) r.cred = heir.id; // người nợ tiền của cha ông giờ nợ người thừa kế
      if (r.k === 'thu') {
        if (r.by === o.id) { // kẻ thù thề báo thù: chuyển sang người thừa kế
          o.vows = (o.vows || []).filter(i => i !== prev.id);
          TT.social.makeEnemy(o, heir, 'mối thù với ' + prev.name);
          foes.push(o.name);
        }
      } else if (r.v >= 40 && o.id !== prev.id) {
        const hr = rel.ensure(heir, o); if (hr.v < 25) hr.v = 25; // ơn của người đi trước
        favors.push(o.name);
      }
    });
    TT.log(heir, 'Bạn kế thừa di sản và nhân quả của ' + prev.name + ' (' + D.REALM_NAMES[prev.realm] + ', mất ở tuổi ' + TT.age(prev) + ').', 'big');
    if (favors.length) TT.log(heir, 'Những người từng thân với ' + prev.name + ' nhớ ơn và sẵn lòng quen biết bạn: ' + favors.slice(0, 5).join(', ') + '.', 'good');
    if (foes.length) TT.log(heir, 'Kẻ thù của ' + prev.name + ' giờ hướng về bạn: ' + foes.slice(0, 5).join(', ') + '.', 'bad');
    if (heir.debts.length) TT.log(heir, 'Bạn phải gánh ' + heir.debts.length + ' khoản nợ ân tình của đời trước.', 'bad');
    if (heir.nghiep) TT.log(heir, 'Nghiệp chướng đời trước để lại: ' + heir.nghiep + '.', 'bad');
    TT.fac.welcome(heir);
    TT.news(heir.name + ' kế thừa di sản của ' + prev.name + '.', 'age', [heir.id, prev.id]);
    TT.bus.emit('reincarnate', { id: heir.id, kind: 'heir' });
    return heir;
  };

  life.createWorld = function (seed) {
    seed = seed != null ? seed : (Date.now() & 0x7fffffff);
    rng.seed(seed);
    TT.world = {
      version: TT.VERSION, seed, months: TT.config.startYear * 12, nextId: 1,
      chars: {}, playerId: null, pending: null, news: [], rngState: 0, regions: {}, weather: {},
      settings: { auto: 'can_bang' }, rel: {}, opps: [], nextOpp: 1, nextGoal: 1, lives: []
    };
    TT.fac.init(TT.world);
    TT.faith.sync(); // nơi thờ tự (S5): chỉ có khi bật tín ngưỡng
    life.reincarnate();
    TT.news('Thế giới tu tiên bắt đầu. Hãy chọn hướng đi cho nhân vật của bạn.', 'age');
    return TT.world;
  };

  // Chạy mô phỏng không cần giao diện (dùng cho kiểm thử và cân bằng). autoPlay: tự chọn mặc định.
  life.simulate = function (months, autoPlay) {
    for (let i = 0; i < months; i++) {
      if (TT.world.pending) {
        if (!autoPlay) return i;
        TT.decisions.resolveDefault();
      }
      life.stepWorld();
    }
    return months;
  };
})();
