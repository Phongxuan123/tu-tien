// Bảng chỉnh nhân vật (công cụ thử nghiệm). Chỉ được nạp khi D.DEV.on (files.js). Hệ nào chưa có thì khối tương ứng ẩn.
// TT.dev: các hàm ghi (chỉ chạy khi bấm nút), không phụ thuộc DOM nên kiểm thử gọi thẳng được. Vẽ bảng chỉ đọc, không gọi rng, không khởi tạo dữ liệu.
// Dấu vết: TT.world.devUsed = true (khởi tạo muộn, không đổi TT.VERSION) và mỗi chỉnh sửa ghi một dòng nhật ký loại 'dev'.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, S = TT.stats;
  const dev = TT.dev = {};

  const P = () => TT.player();
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sgn = v => (v > 0 ? '+' : '') + v;

  // ---------- có hệ nào thì hiện khối đó ----------
  dev.has = {
    nature: () => !!(TT.nature && TT.nature.ensure && D.NATURE && D.NATURE.on),
    kv: () => !!(TT.kv && TT.kv.ensure && D.NATURE && D.NATURE.on),
    ls: () => !!TT.ls,
    hoi: () => !!(TT.hoi && TT.fac && D.ECO && D.ECO.hoi),
    story: () => !!(TT.story && D.STORY && D.STORY.on && D.STORY.arcs),
    rel: () => !!TT.rel,
    bond: () => !!(TT.bond && TT.bond.ensure && D.BOND && D.BOND.on)
  };
  // Danh sách khối đang có (đọc thuần).
  dev.sections = function () {
    const h = dev.has, out = ['basic', 'tuchat', 'traits'];
    if (h.nature()) out.push('nature');
    if (h.kv()) out.push('kv');
    out.push('identity');
    if (h.rel()) out.push('rel');
    if (h.story()) out.push('story');
    out.push('time', 'life');
    return out;
  };

  // ---------- dấu vết ----------
  dev.mark = function (p, text) {
    TT.world.devUsed = true;
    TT.log(p, '[Thử nghiệm] ' + text, '', null, 'dev');
    const e = p.log[p.log.length - 1]; // TT.log không tính lv/tone khi đã có cat
    if (e && e.cat === 'dev' && !e.lv) { e.lv = 'norm'; e.tone = ''; }
    return true;
  };
  dev.hpFix = p => { p.hp = clamp(p.hp, 1, S.hpMax(p)); };

  // ---------- khối Cơ bản ----------
  const FIELDS = {
    xp: { n: 'Tu vi', lo: 0, hi: 1e9, get: p => Math.round(p.xp), set: (p, v) => { p.xp = Math.round(v); } },
    hp: { n: 'Sinh lực', lo: 1, hi: 1e7, get: p => Math.round(p.hp), set: (p, v) => { p.hp = Math.min(Math.round(v), S.hpMax(p)); } },
    atk: { n: 'Công kích', lo: 1, hi: 1e6, get: p => S.atk(p), set: (p, v) => { p.baseAtk += Math.round(v) - S.atk(p); } },
    nl: { n: 'Niệm lực', lo: 1, hi: 1e6, get: p => S.nl(p), set: (p, v) => { p.baseNl += Math.round(v) - S.nl(p); } },
    gold: { n: 'Vàng', lo: 0, hi: 1e12, get: p => Math.round(p.gold), set: (p, v) => { p.gold = Math.round(v); } },
    ls: { n: 'Linh thạch', lo: 0, hi: 1e9, has: () => !!TT.ls, get: p => p.ls || 0, set: (p, v) => { p.ls = Math.round(v * 100) / 100; } },
    daoTam: { n: 'Đạo tâm', lo: 0, hi: 100, get: p => Math.round(p.daoTam), set: (p, v) => { p.daoTam = Math.round(v); } },
    nghiep: { n: 'Nghiệp', lo: 0, hi: 1e6, get: p => p.nghiep, set: (p, v) => { p.nghiep = Math.round(v); } },
    chinh: { n: 'Chính tà', lo: -1000, hi: 1000, get: p => p.rep.chinh, set: (p, v) => { p.rep.chinh = Math.round(v); } },
    danh: { n: 'Danh', lo: -1000, hi: 1000, get: p => p.rep.danh, set: (p, v) => { p.rep.danh = Math.round(v); } },
    luck: { n: 'Vận may', lo: -50, hi: 100, get: p => S.luck(p), set: (p, v) => { p.baseLuck += Math.round(v) - S.luck(p); } },
    age: { n: 'Tuổi', lo: 0, hi: 5000, get: p => TT.age(p), set: (p, v) => { p.birthMonth = TT.world.months - Math.round(v) * 12; } }
  };
  dev.FIELDS = FIELDS;
  dev.fields = () => Object.keys(FIELDS).filter(k => !FIELDS[k].has || FIELDS[k].has());

  dev.set = function (key, val) {
    const p = P(), f = FIELDS[key];
    val = Number(val);
    if (!p || !f || !isFinite(val) || (f.has && !f.has())) return false;
    val = clamp(val, f.lo, f.hi);
    f.set(p, val);
    if (key === 'age') dev.hpFix(p);
    dev.mark(p, f.n + ' → ' + (key === 'chinh' || key === 'danh' ? sgn(val) : val));
    return true;
  };

  dev.stageOf = p => (p.realm >= 1 && p.realm <= 5 ? Math.min(2, Math.floor(p.xp / D.NEED[p.realm] * 3)) : 0);
  // Đặt cảnh giới và giai đoạn (0 sơ, 1 trung, 2 hậu); tu vi đặt đúng đầu giai đoạn, sinh lực đầy.
  dev.setRealm = function (realm, stage) {
    const p = P(); realm = Math.round(Number(realm)); stage = clamp(Math.round(Number(stage) || 0), 0, 2);
    if (!p || !(realm >= 0 && realm <= 5)) return false;
    p.realm = realm;
    p.xp = realm >= 1 ? Math.ceil(D.NEED[realm] * stage / 3) : 0;
    p.stuck = false;
    p.hp = S.hpMax(p);
    dev.mark(p, 'Cảnh giới → ' + D.REALM_NAMES[realm] + (realm >= 1 ? ' ' + D.STAGE_NAMES[stage] : ''));
    return true;
  };

  // ---------- Tư chất, tiên thiên ----------
  dev.setAttr = function (i, v) {
    const p = P(), a = p && p.tuchat.attrs[i]; v = Math.round(Number(v));
    if (!a || !isFinite(v)) return false;
    a.p = clamp(v, 1, 300);
    p.tuchat.total = p.tuchat.attrs.reduce((s, x) => s + x.p, 0);
    dev.mark(p, 'Tư chất ' + a.n + ' → ' + a.p + ' (tổng ' + p.tuchat.total + ')');
    return true;
  };
  dev.setTcTotal = function (t) {
    const p = P(); t = Math.round(Number(t));
    if (!p || !isFinite(t)) return false;
    t = clamp(t, p.tuchat.attrs.length, 900);
    const at = p.tuchat.attrs, sum = at.reduce((s, x) => s + x.p, 0);
    at.forEach(a => { a.p = Math.max(1, Math.round(a.p * t / sum)); });
    let mi = 0; at.forEach((a, i) => { if (a.p > at[mi].p) mi = i; });
    at[mi].p = Math.max(1, at[mi].p + t - at.reduce((s, x) => s + x.p, 0));
    p.tuchat.total = at.reduce((s, x) => s + x.p, 0);
    dev.mark(p, 'Tư chất tổng → ' + p.tuchat.total);
    return true;
  };
  dev.rerollTuchat = function () {
    const p = P(); if (!p) return false;
    p.tuchat = TT.rollTuChat();
    dev.mark(p, 'Bốc lại tư chất → tổng ' + p.tuchat.total);
    return true;
  };
  dev.toggleTrait = function (id) {
    const p = P(), t = D.traitById && D.traitById[id]; if (!p || !t) return false;
    const i = p.traitIds.indexOf(id);
    if (i >= 0) p.traitIds.splice(i, 1); else p.traitIds.push(id);
    dev.hpFix(p);
    dev.mark(p, 'Tiên thiên «' + t.n + '» → ' + (i >= 0 ? 'bỏ' : 'thêm'));
    return true;
  };

  // ---------- Tính cách, khí vận ----------
  dev.setNature = function (ax, v) {
    const p = P(); v = Number(v);
    if (!p || !dev.has.nature() || !isFinite(v) || TT.nature.IDS.indexOf(ax) < 0) return false;
    v = clamp(Math.round(v * 2) / 2, -D.NATURE.max, D.NATURE.max);
    const n = TT.nature.ensure(p, 0);
    n[ax] = v;
    if (TT.nature.legacyLabel) p.personality = TT.nature.legacyLabel(n);
    const a = D.NATURE.axes.find(x => x.id === ax);
    dev.mark(p, a.n + ' → ' + sgn(v));
    return true;
  };
  dev.setKv = function (n) {
    const p = P(); n = Math.round(Number(n));
    if (!p || !dev.has.kv() || !isFinite(n) || !TT.kv.ensure(p)) return false;
    n = clamp(n, 0, 9999);
    const d = n - p.kvPts; p.kvPts = n;
    if (d) TT.kv.note(p, d, 'thử nghiệm');
    dev.mark(p, 'Khí vận → ' + n + ' điểm');
    return true;
  };

  // ---------- Thân phận ----------
  dev.sectList = () => Object.keys(D.SECTS).filter(id => !(TT.fac && TT.fac.isRuin && TT.fac.isRuin(id)));
  dev.joinSect = function (id, rank) {
    const p = P(); rank = clamp(Math.round(Number(rank) || 0), 0, D.SECT_RANKS.length - 1);
    if (!p || !D.SECTS[id]) return false;
    if (p.sect) TT.sect.leave(p, 'thử nghiệm');
    TT.sect.join(p, id, 0);
    p.sect.rank = rank;
    dev.mark(p, 'Tông môn → ' + D.SECTS[id].n + ' (' + D.SECT_RANKS[rank] + ')');
    return true;
  };
  dev.leaveSect = function () {
    const p = P(); if (!p || !p.sect) return false;
    TT.sect.leave(p, 'thử nghiệm');
    dev.mark(p, 'Rời tông môn');
    return true;
  };
  dev.hoiList = () => (dev.has.hoi() ? TT.fac.list('hoi').filter(x => TT.fac.alive(x)) : []);
  dev.joinHoi = function (id, rank) {
    const p = P(), x = dev.has.hoi() && TT.fac.get(id);
    if (!p || !x) return false;
    const ranks = D.ECO.hoi.join.ranks; rank = clamp(Math.round(Number(rank) || 0), 0, ranks.length - 1);
    TT.hoi.S(p).m = { id, rank, since: TT.world.months, owed: 0 };
    dev.mark(p, 'Hội viên thương hội «' + x.n + '» → ' + ranks[rank]);
    return true;
  };
  dev.leaveHoi = function () {
    const p = P(); if (!p || !p.hoi || !p.hoi.m) return false;
    p.hoi.m = null;
    dev.mark(p, 'Rời thương hội');
    return true;
  };
  dev.setJob = function (id, lv) {
    const p = P(), j = D.JOBS && D.JOBS[id]; lv = clamp(Math.round(Number(lv) || 0), 0, 10);
    if (!p || !j || !TT.job) return false;
    TT.job.set(p, 'main', id);
    if (j.craft) { const st = TT.craft.ensure(p)[j.craft]; st.lv = lv; st.xp = 0; } else { TT.job.ensure(p).lv[id] = { lv, xp: 0 }; }
    dev.mark(p, 'Nghề «' + j.n + '» → cấp ' + lv);
    return true;
  };
  dev.setPath = function (id) {
    const p = P(); if (!p || !D.PATHS || !D.PATHS[id] || !TT.path) return false;
    TT.path.set(p, id, 'thử nghiệm');
    dev.mark(p, 'Đạo → ' + D.PATHS[id].n);
    return true;
  };
  dev.goTo = function (rid, pid) {
    const p = P(), pl = TT.map.place(pid);
    if (!p || !pl || pl.region !== rid) return false;
    p.travel = null; p.cross = null; p.dest = null;
    TT.life.enterRegion(rid);
    p.region = rid; p.place = pid; p.visited[pid] = 1;
    if (TT.cross && TT.cross.learn) TT.cross.learn(p, rid); else p.knownRegions[rid] = true;
    TT.map.ensureTaste(p);
    dev.mark(p, 'Dịch chuyển → ' + TT.map.region(rid).n + ', ' + pl.n);
    return true;
  };

  // ---------- Quan hệ ----------
  dev.peers = function () {
    const p = P(); if (!p || !dev.has.rel()) return [];
    return TT.rel.list(p).filter(x => x.c && x.c.alive && x.c.kind === 'npc');
  };
  dev.setRel = function (oid, v) {
    const p = P(), o = TT.world.chars[oid]; v = Number(v);
    if (!p || !o || !isFinite(v)) return false;
    TT.rel.ensure(p, o).v = clamp(Math.round(v), -100, 100);
    dev.mark(p, 'Thiện cảm với ' + o.name + ' → ' + sgn(clamp(Math.round(v), -100, 100)));
    return true;
  };
  const BARS = { love: 'Tình', trust: 'Tin', respect: 'Kính', debt: 'Ơn oán' };
  dev.BARS = BARS;
  dev.setBar = function (oid, key, v) {
    const p = P(), o = TT.world.chars[oid]; v = Number(v);
    if (!p || !o || !BARS[key] || !isFinite(v) || !dev.has.bond()) return false;
    const d = TT.bond.ensure(p, o); if (!d) return false;
    d[key] = clamp(Math.round(v), key === 'debt' ? -100 : 0, 100);
    dev.mark(p, BARS[key] + ' với ' + o.name + ' → ' + d[key]);
    return true;
  };
  dev.setMem = function (oid, n) {
    const p = P(), o = TT.world.chars[oid]; n = Math.round(Number(n));
    const types = D.BOND && D.BOND.mem && D.BOND.kn && D.BOND.kn.types ? Object.keys(D.BOND.kn.types) : (TT.bond && TT.bond.memTypes ? Object.keys(TT.bond.memTypes) : []);
    if (!p || !o || !isFinite(n) || !dev.has.bond()) return false;
    const d = TT.bond.ensure(p, o); if (!d) return false;
    d.mem = d.mem || [];
    n = clamp(n, 0, 8);
    if (n > d.mem.length && !types.length) return false;
    while (d.mem.length > n) d.mem.pop();
    while (d.mem.length < n) d.mem.push({ m: TT.world.months, a: TT.age(p), k: types[0], t: 'chuyện cùng trải qua (thử nghiệm)', w: 1, h: 0 });
    dev.mark(p, 'Ký ức chung với ' + o.name + ' → ' + n);
    return true;
  };
  // Dựng một người đồng kỳ cùng nơi, đã quen (thiện cảm +30).
  dev.spawnPeer = function () {
    const p = P(); if (!p || !dev.has.rel()) return null;
    const c = TT.createChar({ kind: 'npc', tier: 'core', region: p.region, place: p.place, age: clamp(TT.age(p), 14, 60) });
    c.realm = p.realm; c.xp = p.xp; c.hp = S.hpMax(c);
    TT.rel.add(p, c, 30);
    dev.mark(p, 'Dựng NPC đồng kỳ «' + c.name + '» cùng nơi');
    return c;
  };

  // ---------- Truyện ----------
  dev.jump = function (arcId, chId) {
    const p = P(); if (!p || !dev.has.story()) return false;
    const ok = TT.story.jump(arcId, chId);
    if (ok) dev.mark(p, 'Nhảy tới chặng ' + arcId + '/' + chId);
    return ok;
  };
  // AI1a: ép khuyết điểm gốc (khóa) để thử kịch bản; có khuôn thì dựng ngay kịch bản cụ thể (TT.kb.make), tuyến chính mở ở tuổi phần 1.
  dev.setKd = function (kd) {
    const p = P(); if (!p || !dev.has.story() || !D.STORY.kds[kd]) return false;
    TT.story.ensure(p); if (!p.story) return false;
    p.story.kd = kd; p.story.kd_khoa = 1;
    if (D.STORY.khuonOn && D.STORY.khuonKd[kd] && !p.story.kbc && TT.kb.make) TT.kb.make(p);
    dev.mark(p, 'Ép khuyết điểm gốc «' + D.STORY.kds[kd].n + '»' + (p.story.kbc ? ' (đã dựng kịch bản cụ thể)' : ''));
    return true;
  };
  dev.setFlag = function (name, on) {
    const p = P(); name = String(name || '').trim();
    if (!p || !name) return false;
    if (on) p.flags[name] = 1; else delete p.flags[name];
    dev.mark(p, 'Cờ «' + name + '» → ' + (on ? 'bật' : 'tắt'));
    return true;
  };
  dev.ripen = function () {
    const p = P(); if (!p || !p.story || !p.story.due) return 0;
    const n = p.story.due.length;
    p.story.due.forEach(d => { d.m = TT.world.months; });
    if (n) dev.mark(p, 'Chín ngay ' + n + ' hậu quả trễ (xử lý ở tháng kế)');
    return n;
  };

  // ---------- Thời gian, nhân vật ----------
  dev.advance = function (years) {
    const p = P(); years = Math.round(Number(years));
    if (!p || !(years > 0)) return 0;
    TT.time.setSpeed(0);
    dev.mark(p, 'Tua ' + years + ' năm');
    return TT.life.simulate(years * 12, true);
  };
  dev.pause = () => { TT.time.setSpeed(0); return true; };

  function clearEndBox() {
    const w = TT.world;
    if (w.pending && (w.pending.type === 'death' || w.pending.type === 'ascend')) w.pending = null;
  }
  dev.reincarnate = function () {
    clearEndBox();
    TT.life.reincarnate({ noUndo: true });
    const p = P(); dev.mark(p, 'Đầu thai lại');
    return p;
  };
  dev.revive = function () {
    const p = P(); if (!p || p.alive) return false;
    p.alive = true; p.ascended = false; p.deathMonth = null; p.cause = null; p.hp = S.hpMax(p);
    if (TT.age(p) >= S.lifeSpan(p)) p.birthMonth = TT.world.months - (S.lifeSpan(p) - 1) * 12;
    clearEndBox();
    dev.mark(p, 'Hồi sinh');
    return true;
  };
  // Bất tử: chặn cái chết của người chơi (life.die và life.dieNow bọc lại lúc bật lần đầu, không sửa file hệ thống).
  let wrapped = false;
  dev.guard = function () {
    if (wrapped || !TT.life) return;
    wrapped = true;
    ['die', 'dieNow'].forEach(k => {
      const orig = TT.life[k];
      TT.life[k] = function (c, cause) {
        const w = TT.world;
        if (w && w.devImmortal && c.kind === 'player' && c.id === w.playerId && c.alive) { c.hp = Math.max(c.hp, S.hpMax(c)); return; }
        return orig.apply(this, arguments);
      };
    });
  };
  dev.setImmortal = function (on) {
    const p = P(); if (!p) return false;
    dev.guard();
    TT.world.devImmortal = !!on;
    dev.mark(p, 'Bất tử → ' + (on ? 'bật' : 'tắt'));
    return true;
  };
  dev.immortal = () => !!(TT.world && TT.world.devImmortal);
  // Bản lưu có bật bất tử thì bọc lại ngay khi nạp.
  TT.bus.on('tick', () => { if (TT.world && TT.world.devImmortal) dev.guard(); });

  // ---------- giao diện ----------
  const st = { open: false, sec: { basic: true }, rid: null, pid: null, sect: null, hoi: null, job: null, path: null, peer: null, arc: null, ch: null, msg: '' };
  let panel = null, body = null, msgEl = null;

  let cssDone = false;
  function css() {
    if (cssDone) return; cssDone = true;
    const s = document.createElement('style');
    s.textContent = '#dev-panel{position:fixed;z-index:9999;top:70px;right:12px;width:min(94vw,420px);max-height:80vh;display:flex;flex-direction:column;background:#161b24;color:#d5dde8;border:1px solid #3a4a60;border-radius:10px;box-shadow:0 8px 30px #0009;font-size:13px}' +
      '#dev-panel .dh{display:flex;align-items:center;gap:8px;padding:6px 10px;cursor:move;touch-action:none;border-bottom:1px solid #2a3444;user-select:none}#dev-panel .dh b{flex:1}' +
      '#dev-panel .db{overflow:auto;padding:6px 10px 10px}#dev-panel details{border-bottom:1px solid #263041;padding:4px 0}#dev-panel summary{cursor:pointer;font-weight:600;padding:4px 0}' +
      '#dev-panel .r{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;margin:3px 0}#dev-panel .r>span{min-width:96px;color:#9fb0c6}' +
      '#dev-panel input[type=number],#dev-panel input[type=text]{width:84px;background:#0f131a;color:#d5dde8;border:1px solid #2a3444;border-radius:6px;padding:3px 6px}' +
      '#dev-panel button,#dev-panel select{padding:3px 8px;font-size:12px}#dev-panel .tr{display:inline-block;margin:2px 6px 2px 0}#dev-panel .m{color:#8fd19e;min-height:16px;padding:2px 10px}' +
      '#dev-panel .sm{color:#7f8da3;font-size:11px}@media(max-width:600px){#dev-panel{top:auto;bottom:0;right:0;left:0;width:auto;max-height:70vh;border-radius:10px 10px 0 0}}';
    document.head.appendChild(s);
  }

  function say(t) { st.msg = t; if (msgEl) msgEl.textContent = t; }
  // Chạy một thao tác ghi rồi vẽ lại; lỗi hiện ra chứ không làm hỏng trang.
  function act(fn, okText) {
    try {
      const r = fn(P());
      say(r === false ? 'Không áp dụng được.' : (okText || 'Đã áp dụng.'));
      ui.resetCaches && ui.resetCaches();
      ui.markDirty && ui.markDirty();
    } catch (e) { say('Lỗi: ' + e.message); console.warn(e); }
    draw();
  }

  function draw() {
    if (!body) return;
    const h = ui.h, p = P();
    body.innerHTML = '';
    if (!p) { body.appendChild(h('div', null, 'Chưa có nhân vật.')); return; }
    const sec = (id, title, build) => {
      const d = h('details', { ontoggle: e => { st.sec[id] = d.open; } }, h('summary', null, title));
      if (st.sec[id]) d.open = true;
      build(d); body.appendChild(d);
    };
    const num = (v, w) => h('input', { type: 'number', value: v, step: 'any', style: w ? 'width:' + w + 'px' : null });
    const sel = (opts, cur, onch) => {
      const s = h('select', { onchange: e => onch(e.target.value) });
      opts.forEach(o => s.appendChild(h('option', { value: o[0], selected: String(o[0]) === String(cur) ? 'selected' : null }, o[1])));
      return s;
    };
    const row = (label, ...els) => h('div', { class: 'r' }, h('span', null, label), ...els);
    const setRow = (box, key, label) => { const i = num(FIELDS[key].get(p)); box.appendChild(row(label || FIELDS[key].n, i, h('button', { onclick: () => act(() => dev.set(key, i.value)) }, 'Đặt'))); };

    // Cơ bản: một nút Áp dụng cho cả khối, hoặc đặt từng dòng
    sec('basic', 'Cơ bản', box => {
      const rs = sel(D.REALM_NAMES.slice(0, 6).map((n, i) => [i, n]), p.realm, () => {});
      const ss = sel(D.STAGE_NAMES.map((n, i) => [i, n]), dev.stageOf(p), () => {});
      box.appendChild(row('Cảnh giới', rs, ss, h('button', { onclick: () => act(() => dev.setRealm(rs.value, ss.value)) }, 'Đặt')));
      const inputs = {};
      dev.fields().forEach(k => {
        const i = inputs[k] = num(FIELDS[k].get(p));
        const extra = k === 'hp' ? [h('button', { onclick: () => act(q => dev.set('hp', S.hpMax(q))) }, 'Đầy')] : [];
        box.appendChild(row(FIELDS[k].n, i, h('button', { onclick: () => act(() => dev.set(k, i.value)) }, 'Đặt'), ...extra));
      });
      box.appendChild(h('button', { onclick: () => act(q => {
        if (+rs.value !== q.realm || +ss.value !== dev.stageOf(q)) dev.setRealm(rs.value, ss.value);
        dev.fields().forEach(k => { if (inputs[k].value !== '' && Number(inputs[k].value) !== FIELDS[k].get(q)) dev.set(k, inputs[k].value); });
      }) }, 'Áp dụng cả khối'));
    });

    sec('tuchat', 'Tư chất', box => {
      const t = num(p.tuchat.total);
      box.appendChild(row('Tổng', t, h('button', { onclick: () => act(() => dev.setTcTotal(t.value)) }, 'Đặt')));
      p.tuchat.attrs.forEach((a, i) => {
        const x = num(a.p);
        box.appendChild(row(a.n + (a.di ? ' (dị)' : ''), x, h('button', { onclick: () => act(() => dev.setAttr(i, x.value)) }, 'Đặt')));
      });
      box.appendChild(h('button', { onclick: () => act(() => dev.rerollTuchat()) }, 'Bốc lại tư chất'));
    });

    sec('traits', 'Tiên thiên (' + p.traitIds.length + ')', box => {
      D.TRAITS.forEach(t => {
        const on = p.traitIds.indexOf(t.id) >= 0;
        box.appendChild(h('label', { class: 'tr', title: t.d }, h('input', { type: 'checkbox', checked: on ? 'checked' : null, onchange: () => act(() => dev.toggleTrait(t.id)) }), ' ' + t.n + (t.g ? '' : ' ✗')));
      });
    });

    if (dev.has.nature()) sec('nature', 'Tính cách', box => {
      const v = TT.nature.get(p);
      D.NATURE.axes.forEach(a => {
        const i = h('input', { type: 'range', min: -D.NATURE.max, max: D.NATURE.max, step: 0.5, value: v[a.id], style: 'width:120px' });
        const val = h('b', null, sgn(v[a.id]));
        i.oninput = () => { val.textContent = sgn(+i.value); };
        box.appendChild(row(a.n + ' (' + a.lo + '↔' + a.hi + ')', i, val, h('button', { onclick: () => act(() => dev.setNature(a.id, i.value)) }, 'Đặt')));
      });
    });

    if (dev.has.kv()) sec('kv', 'Khí vận', box => {
      const i = num(TT.kv.pts(p));
      box.appendChild(row('Điểm khí vận', i, h('button', { onclick: () => act(() => dev.setKv(i.value)) }, 'Đặt')));
    });

    sec('identity', 'Thân phận', box => {
      // Tông môn
      const sects = dev.sectList().map(id => [id, D.SECTS[id].n]);
      st.sect = st.sect || sects[0][0];
      const rk = sel(D.SECT_RANKS.map((n, i) => [i, n]), p.sect ? p.sect.rank : 0, () => {});
      box.appendChild(row('Tông (' + (p.sect ? D.SECTS[p.sect.id].n + ', ' + D.SECT_RANKS[p.sect.rank] : 'không') + ')', sel(sects, st.sect, v => { st.sect = v; }), rk,
        h('button', { onclick: () => act(() => dev.joinSect(st.sect, rk.value)) }, 'Vào/đổi'), h('button', { onclick: () => act(() => dev.leaveSect()) }, 'Rời')));
      // Thương hội
      if (dev.has.hoi()) {
        const hs = dev.hoiList().map(x => [x.id, x.n]);
        if (hs.length) {
          st.hoi = st.hoi || hs[0][0];
          const ranks = D.ECO.hoi.join.ranks, m = p.hoi && p.hoi.m, hr = sel(ranks.map((n, i) => [i, n]), m ? m.rank : 0, () => {});
          box.appendChild(row('Thương hội (' + (m ? ranks[m.rank] : 'không') + ')', sel(hs, st.hoi, v => { st.hoi = v; }), hr,
            h('button', { onclick: () => act(() => dev.joinHoi(st.hoi, hr.value)) }, 'Vào'), h('button', { onclick: () => act(() => dev.leaveHoi()) }, 'Rời')));
        }
      }
      // Nghề
      if (TT.job && D.JOBS) {
        const js = Object.keys(D.JOBS).map(id => [id, D.JOBS[id].n]);
        st.job = st.job || js[0][0];
        const lv = num(TT.job.level(p, st.job), 56);
        box.appendChild(row('Nghề (' + (p.job && p.job.main && D.JOBS[p.job.main] ? D.JOBS[p.job.main].n : 'chưa') + ')', sel(js, st.job, v => { st.job = v; draw(); }), lv,
          h('button', { onclick: () => act(() => dev.setJob(st.job, lv.value)) }, 'Đặt nghề + cấp')));
      }
      // Đạo
      if (TT.path && D.PATHS) {
        const ps = Object.keys(D.PATHS).map(id => [id, D.PATHS[id].n]);
        st.path = st.path || ps[0][0];
        box.appendChild(row('Đạo', sel(ps, st.path, v => { st.path = v; }), h('button', { onclick: () => act(() => dev.setPath(st.path)) }, 'Đặt')));
      }
      // Dịch chuyển
      st.rid = st.rid || p.region;
      const places = TT.map.placesOf(st.rid).map(x => [x.id, x.n]);
      if (!places.some(x => x[0] === st.pid)) st.pid = places.length ? places[0][0] : null;
      box.appendChild(row('Dịch chuyển', sel(D.REGIONS.map(r => [r.id, r.n]), st.rid, v => { st.rid = v; st.pid = null; draw(); }), sel(places, st.pid, v => { st.pid = v; }),
        h('button', { onclick: () => act(() => dev.goTo(st.rid, st.pid)) }, 'Đi')));
    });

    if (dev.has.rel()) sec('rel', 'Quan hệ', box => {
      const L = dev.peers();
      if (!L.length) box.appendChild(h('div', { class: 'sm' }, 'Chưa quen NPC nào còn sống.'));
      else {
        if (!L.some(x => String(x.c.id) === String(st.peer))) st.peer = L[0].c.id;
        box.appendChild(row('Người', sel(L.map(x => [x.c.id, x.c.name + ' · ' + D.REALM_NAMES[x.c.realm]]), st.peer, v => { st.peer = v; draw(); })));
        const o = TT.world.chars[st.peer], r = TT.rel.get(p, o);
        const i = num(r ? r.v : 0);
        box.appendChild(row('Thiện cảm', i, h('button', { onclick: () => act(() => dev.setRel(o.id, i.value)) }, 'Đặt')));
        if (dev.has.bond()) {
          const d = TT.bond.get(p, o) || {};
          Object.keys(dev.BARS).forEach(k => {
            const x = num(d[k] != null ? d[k] : 0);
            box.appendChild(row(dev.BARS[k], x, h('button', { onclick: () => act(() => dev.setBar(o.id, k, x.value)) }, 'Đặt')));
          });
          const m = num(d.mem ? d.mem.length : 0);
          box.appendChild(row('Ký ức chung (0-8)', m, h('button', { onclick: () => act(() => dev.setMem(o.id, m.value)) }, 'Đặt')));
        }
      }
      box.appendChild(h('button', { onclick: () => act(() => !!dev.spawnPeer()) }, 'Dựng NPC đồng kỳ cùng nơi'));
    });

    if (dev.has.story()) sec('story', 'Truyện', box => {
      const arcs = D.STORY.arcs.map(a => [a.id, a.n]);
      st.arc = st.arc || arcs[0][0];
      const arc = D.STORY.arcs.find(a => a.id === st.arc);
      const chs = Object.keys(arc.chang).map(id => [id, id + ' · ' + String(arc.chang[id].t).replace(/\{[a-z]+\}/g, '…').slice(0, 28)]);
      if (!arc.chang[st.ch]) st.ch = arc.dau;
      box.appendChild(row('Tuyến', sel(arcs, st.arc, v => { st.arc = v; st.ch = null; draw(); })));
      box.appendChild(row('Chặng', sel(chs, st.ch, v => { st.ch = v; }), h('button', { onclick: () => act(() => dev.jump(st.arc, st.ch)) }, 'Nhảy tới')));
      const kdSel = sel(Object.keys(D.STORY.kds).map(k => [k, D.STORY.kds[k].n + (D.STORY.khuonKd[k] ? ' (có khuôn)' : '')]), st.kd || (p.story && p.story.kd) || 'kieu_hanh', v => { st.kd = v; });
      box.appendChild(row('Khuyết điểm', kdSel, h('button', { onclick: () => act(() => dev.setKd(st.kd || (p.story && p.story.kd) || 'kieu_hanh')) }, 'Ép')));
      const rows = TT.story.rows(p);
      if (rows.length) box.appendChild(h('div', { class: 'sm' }, rows.map(x => x.n + ': ' + (x.state === 'dang' ? x.cur : 'xong')).join(' | ')));
      const fn = h('input', { type: 'text', placeholder: 'tên cờ', style: 'width:130px' });
      box.appendChild(row('Cờ', fn, h('button', { onclick: () => act(() => dev.setFlag(fn.value, true)) }, 'Bật'), h('button', { onclick: () => act(() => dev.setFlag(fn.value, false)) }, 'Tắt')));
      const fl = Object.keys(p.flags).filter(k => p.flags[k]);
      if (fl.length) box.appendChild(h('div', { class: 'sm' }, 'Đang bật: ' + fl.join(', ')));
      box.appendChild(h('button', { onclick: () => act(() => dev.ripen() > 0) }, 'Chín ngay hậu quả trễ (' + TT.story.pendingDue(p) + ')'));
    });

    sec('time', 'Thời gian', box => {
      const r = h('div', { class: 'r' });
      [1, 5, 10, 20].forEach(n => r.appendChild(h('button', { onclick: () => act(() => dev.advance(n) >= 0, 'Đã tua ' + n + ' năm.') }, 'Tua ' + n + ' năm')));
      r.appendChild(h('button', { onclick: () => act(() => dev.pause(), 'Đã tạm dừng.') }, '⏸ Tạm dừng'));
      box.appendChild(r);
    });

    sec('life', 'Nhân vật', box => {
      const r = h('div', { class: 'r' });
      r.appendChild(h('button', { onclick: () => { if (confirm('Đầu thai lại? Kiếp hiện tại sẽ bỏ.')) act(() => !!dev.reincarnate()); } }, 'Đầu thai lại'));
      if (!p.alive) r.appendChild(h('button', { onclick: () => act(() => dev.revive()) }, 'Hồi sinh'));
      r.appendChild(h('button', { class: dev.immortal() ? 'on' : null, onclick: () => act(() => dev.setImmortal(!dev.immortal())) }, 'Bất tử: ' + (dev.immortal() ? 'BẬT' : 'tắt')));
      box.appendChild(r);
      box.appendChild(h('div', { class: 'sm' }, 'Bất tử chặn chết vì thọ hay trận của người chơi; chỉ có tác dụng khi bật.'));
    });
  }

  dev.open = function () {
    if (!panel || !panel.isConnected) build();
    st.open = true; panel.style.display = ''; draw();
  };
  dev.close = function () { st.open = false; if (panel) panel.style.display = 'none'; };

  function build() {
    css();
    const h = ui.h;
    msgEl = h('div', { class: 'm' }, st.msg);
    body = h('div', { class: 'db' });
    const head = h('div', { class: 'dh' }, h('b', null, '🛠 Chỉnh nhân vật (thử nghiệm)'),
      h('button', { onclick: () => draw(), title: 'Đọc lại số liệu' }, '⟳'), h('button', { onclick: dev.close }, '✕'));
    panel = h('div', { id: 'dev-panel' }, head, msgEl, body);
    document.body.appendChild(panel);
    // kéo bằng tiêu đề (chuột và cảm ứng)
    let ox = 0, oy = 0, drag = false;
    head.addEventListener('pointerdown', e => {
      if (e.target.tagName === 'BUTTON') return;
      const r = panel.getBoundingClientRect(); drag = true; ox = e.clientX - r.left; oy = e.clientY - r.top;
      panel.style.right = 'auto'; panel.style.bottom = 'auto'; panel.style.left = r.left + 'px'; panel.style.top = r.top + 'px';
      head.setPointerCapture(e.pointerId);
    });
    head.addEventListener('pointermove', e => { if (drag) { panel.style.left = clamp(e.clientX - ox, 0, innerWidth - 60) + 'px'; panel.style.top = clamp(e.clientY - oy, 0, innerHeight - 40) + 'px'; } });
    head.addEventListener('pointerup', () => { drag = false; });
  }

  // Gắn nút 🛠 nổi ở góc dưới trái (luôn thấy, kể cả khi hộp "Đời mới" đang phủ thanh điều khiển); trả về false nếu tắt.
  dev.mount = function () {
    if (!D.DEV || !D.DEV.on || !document.body) return false;
    if (document.getElementById('btn-dev')) return true;
    css();
    const b = ui.h('button', { id: 'btn-dev', title: 'Bảng chỉnh nhân vật (thử nghiệm)', onclick: () => (st.open ? dev.close() : dev.open()) }, '🛠');
    b.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:10000;width:44px;height:44px;font-size:20px;border-radius:50%;border:1px solid #c9a35a;background:#161b24;color:#d5dde8;cursor:pointer;box-shadow:0 2px 10px #0008';
    document.body.appendChild(b);
    return true;
  };
  window.addEventListener('DOMContentLoaded', () => dev.mount());
})();
