// Tạo nhân vật (người chơi và NPC dùng chung): tư chất, tiên thiên, chỉ số gốc, tính cách.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng;

  // Tư chất 50-200 điểm (lệch về thấp) chia cho ngũ hành, 8% có thêm một biến dị.
  function rollTuChat() {
    const total = 50 + Math.round(150 * Math.pow(rng.next(), 3.5));
    const nEl = rng.wpick([{ k: 1, w: 15 }, { k: 2, w: 25 }, { k: 3, w: 25 }, { k: 4, w: 20 }, { k: 5, w: 15 }]).k;
    const attrs = rng.shuffle(D.ELEM).slice(0, nEl).map(e => ({ n: e.n, di: false, p: 0 }));
    if (rng.P(0.08)) attrs.push({ n: rng.pick(D.DI).n, di: true, p: 0 });
    const ws = attrs.map(a => Math.pow(0.2 + rng.next(), 2) * (a.di ? 1.5 : 1));
    const sum = ws.reduce((a, b) => a + b, 0);
    attrs.forEach((a, i) => { a.p = Math.max(1, Math.round(total * ws[i] / sum)); });
    const diff = total - attrs.reduce((a, b) => a + b.p, 0);
    let mi = 0;
    attrs.forEach((a, i) => { if (a.p > attrs[mi].p) mi = i; });
    attrs[mi].p = Math.max(1, attrs[mi].p + diff);
    return { total: attrs.reduce((a, b) => a + b.p, 0), attrs };
  }

  // 1-3 tiên thiên, mỗi cái tốt/xấu 50/50, phẩm trắng 60 / xanh 30 / vàng 10.
  function rollTraits() {
    const cnt = rng.wpick([{ k: 1, w: 50 }, { k: 2, w: 35 }, { k: 3, w: 15 }]).k;
    const out = [];
    for (let i = 0; i < cnt; i++) {
      const g = rng.P(0.5) ? 1 : 0;
      const q = rng.wpick([{ q: 0, w: 60 }, { q: 1, w: 30 }, { q: 2, w: 10 }]).q;
      const pool = D.TRAITS.filter(t => t.g === g && t.q === q && out.indexOf(t.id) < 0);
      if (pool.length) out.push(rng.pick(pool).id);
    }
    return out;
  }

  TT.rollTuChat = rollTuChat;
  TT.rollTraits = rollTraits;

  TT.createChar = function (opts) {
    opts = opts || {};
    const w = TT.world;
    const kind = opts.kind || 'npc';
    const gender = opts.gender || (rng.P(0.5) ? 'nam' : 'nu');
    const age = opts.age != null ? opts.age : 12;
    const pool = D.personalities.filter(p => p.weight > 0);
    // Vùng sinh: do người gọi chỉ định, nếu không thì ngẫu nhiên theo tỉ lệ sinh của từng vùng.
    const regionId = opts.region || rng.wpick(D.REGIONS, r => r.birth).id;
    const reg = TT.map.region(regionId);
    const origin = opts.origin || rng.wpick(reg.origins);
    // Địa điểm sinh: theo loại địa điểm của bối cảnh xuất thân (có thể chỉ định sẵn).
    let placeId = opts.place;
    if (!placeId) {
      const cand = TT.map.placesOf(regionId).filter(p => origin.types.indexOf(p.type) >= 0);
      const list = cand.length ? cand : TT.map.placesOf(regionId);
      placeId = rng.pick(list).id;
    }
    // Người chơi (9A): xuất thân v2 bốc bằng băm (muối là trạng thái rng, chỉ đọc) sau mọi lần rút cũ; địa điểm sinh ưu tiên place_types.
    // Các lần rút rng ở trên vẫn giữ nguyên để công tắc tắt trùng khít bản cũ.
    const o2 = kind === 'player' && D.ORIGINS2 && D.ORIGINS2.on ? TT.origin.roll(w.seed != null ? w.seed : 0, w.nextId, rng.getState()) : null;
    if (o2 && !opts.place) placeId = TT.origin.placeFor(o2, regionId, w.nextId, rng.getState()) || placeId;

    const c = {
      id: w.nextId++, kind, tier: opts.tier || (kind === 'player' ? 'player' : 'core'), role: opts.role || null,
      name: TT.genName(gender, opts.surname), gender,
      birthMonth: opts.birthMonth != null ? opts.birthMonth : w.months - age * 12 - rng.RI(0, 11),
      alive: true, ascended: false, deathMonth: null, cause: null,
      realm: 0, xp: 0, hp: 100, gold: origin.gold, origin: origin.name,
      baseAtk: 5 + rng.RI(0, 4), baseNl: 8 + rng.RI(0, 6),
      baseKv: rng.RI(0, 10), baseLuck: rng.RI(0, 4) + origin.luck,
      trainHp: 0, trainAtk: 0, trainNl: 0,
      tuchat: opts.tuchat || rollTuChat(), traitIds: opts.traitIds || rollTraits(),
      personality: kind === 'player' ? 'trung_lap' : rng.wpick(pool, p => p.weight).id,
      direction: 'can_bang', focus: 'train',
      ring: rng.P(0.005), breakDelay: 0, known: { kv: false, luck: false },
      fortune: 0, stuck: false, aid: { pill: 0, room: false, ngung: false, ho: false, guard: 0, tcd: false },
      region: regionId, place: placeId, travel: null, cross: null, dest: null, autoMove: true, taste: {},
      knownRegions: {}, homeRegion: regionId, foreign: false, traveler: null, left: false,
      yXp: 0, yGold: 0, log: [],
      daoTam: 50, daoDiem: 0, tcd: 0, flags: {}, evCool: {}, lastEventMonth: -99, waits: 0, fateCount: 0,
      rules: kind === 'player' ? TT.rules.defaults() : null, ruleNow: '',
      rep: { chinh: 0, danh: 0 }, relIds: {}, vows: [], nghiep: 0, killedBy: 0, huntWait: 0,
      quests: [], qs: null, visited: {}, plan: null, sect: null, yContrib: 0,
      master: 0, parents: opts.parents || [], children: [], debts: [], pregnant: null, lastBirth: -999,
      inv: {}, equip: {}, techs: {}, techMain: '', xinfa: [], craft: null, dungeon: null, dgCool: 0, clears: 0,
      nt: null, ntLife: 0, lifeBonus: 0, thienPhat: false, tri: null, ntCause: ''
    };
    const pers = D.personalityById[c.personality];
    c.align = kind === 'player' ? 0 : rng.clamp(rng.RI(-25, 25) + (pers ? pers.al : 0), -100, 100);
    if (c.place) c.visited[c.place] = 1;
    c.knownRegions[regionId] = true;
    TT.map.ensureTaste(c);
    // Người chơi (8A): tính cách bốn trục bốc bằng băm (muối là trạng thái rng, chỉ đọc), điểm khí vận lấy đúng lần rút baseKv ở trên.
    if (kind === 'player' && D.NATURE.on) { TT.kv.ensure(c); TT.nature.ensure(c, rng.getState()); if (c.ring) TT.kv.add(c, 2, 'Nhẫn'); }
    if (o2) TT.origin.apply(c, o2, origin);
    if (c.ring) c.baseKv += 30;
    c.hp = TT.stats.hpMax(c);
    w.chars[c.id] = c;
    return c;
  };
})();
