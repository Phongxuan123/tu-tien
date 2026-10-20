// Khung truyện của người chơi (Z "Đặc tả 8B", Q 10): tuyến là đồ thị chặng, mở theo điều kiện, chặng có hạn (quá hạn tự đi theo `mac`),
// lựa chọn có khóa mềm (`gate`, hiện lý do), phí (`gia`) và phí trái tính, hậu quả trễ (`tre`) chín sau vài năm, kết cục cộng khí vận.
// Trạng thái c.story = { arcs: { id: { st, since, ready, w, vai, log, ket } }, due: [ { m, arc, fx, log } ], done: [], box } khởi tạo muộn.
// Hộp truyện là w.pending { type: 'story' } thuần dữ liệu (lưu/tải giữa chặng được); vòng quay ở js/systems/wheel.js.
// Hàm đọc (get, rows, fit, check, lint, sig) không gọi rng và không ghi dữ liệu. Công tắc D.STORY.on.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data;
  const K = () => D.STORY;
  const on = c => !!(c && c.kind === 'player' && K() && K().on);
  const EMPTY = { arcs: {}, due: [], done: [], box: -99 };
  const AXES = ['tinh', 'xuthe', 'daoduc', 'tudung'];
  const SLOT = /\{([a-z_]+)\}/g;

  const arcOf = id => K().arcById[id];
  const stOf = (c, id) => (c.story || EMPTY).arcs[id] || null;

  // Thay khe {khe} bằng tên người ở vai (hoặc "người ấy"), {ten} bằng tên người chơi.
  function fmt(c, st, text) {
    return String(text || '').replace(SLOT, (m, k) => {
      if (k === 'ten') return c.name;
      const id = st && st.vai && st.vai[k], o = id && TT.world.chars[id];
      return o ? o.name : 'người ấy';
    });
  }

  function condOk(c, k) {
    if (!k) return true;
    if (k.realm != null && c.realm < k.realm) return false;
    if (k.age != null && TT.age(c) < k.age) return false;
    if (k.flag && !c.flags[k.flag]) return false;
    if (k.sau && typeof k.sau === 'string') { const s = stOf(c, k.sau); if (!s || !s.ket) return false; }
    return true;
  }

  // ---------- vai: ưu tiên NPC có sẵn ở gần, chỉ dựng mới khi không có ----------
  function candidates(c, spec, taken) {
    const w = TT.world, age = TT.age(c);
    let list = Object.keys(w.chars).map(k => w.chars[k]).filter(o => o.kind === 'npc' && o.alive && !o.left && o.tier === 'core' && o.region === c.region && o.id !== c.id && taken.indexOf(o.id) < 0);
    const here = o => (o.place === c.place ? 0 : 1);
    if (spec.pick === 'su') list = list.filter(o => TT.age(o) >= 25).sort((a, b) => here(a) - here(b) || b.realm - a.realm || a.id - b.id);
    else if (spec.pick === 'dong_ky') list = list.filter(o => Math.abs(TT.age(o) - age) <= 8 && TT.age(o) >= 12).sort((a, b) => Math.abs(TT.age(a) - age) - Math.abs(TT.age(b) - age) || here(a) - here(b) || a.id - b.id);
    else list = list.filter(o => TT.age(o) >= 9).sort((a, b) => here(a) - here(b) || TT.rel.v(c, b) - TT.rel.v(c, a) || a.id - b.id);
    return list;
  }
  function pickNpc(c, spec, taken) {
    const cand = candidates(c, spec, taken);
    if (cand.length) return cand[0];
    if (!spec.dung_moi) return null;
    const age = TT.age(c), rng = TT.rng;
    const n = TT.life.spawnNpc(spec.pick === 'su' ? rng.RI(28, 42) : spec.pick === 'dong_ky' ? Math.max(13, age + rng.RI(-2, 3)) : rng.RI(14, 40), c.region);
    if (n) { n.place = c.place; n.dest = null; n.travel = null; }
    return n;
  }
  function bindVai(c, arc, st) {
    st.vai = st.vai || {};
    const taken = Object.keys(st.vai).map(k => st.vai[k]);
    Object.keys(arc.vai || {}).forEach(k => {
      const cur = st.vai[k] && TT.world.chars[st.vai[k]];
      if (cur && cur.alive) return;
      const n = pickNpc(c, arc.vai[k], taken);
      if (n) { st.vai[k] = n.id; taken.push(n.id); }
    });
  }

  // ---------- hiệu ứng ----------
  function fxApply(c, st, fx, why) {
    if (!fx) return;
    const S = TT.stats;
    if (fx.gold) c.gold = Math.max(0, c.gold + fx.gold);
    if (fx.xp) c.xp = Math.max(0, c.xp + fx.xp * D.NEED[Math.min(5, c.realm)]);
    if (fx.hp) c.hp = Math.max(1, Math.min(S.hpMax(c), c.hp + fx.hp));
    if (fx.daoTam) c.daoTam = Math.max(0, Math.min(100, c.daoTam + fx.daoTam));
    if (fx.nghiep) c.nghiep = Math.max(0, (c.nghiep || 0) + fx.nghiep);
    if (fx.rep) Object.keys(fx.rep).forEach(k => TT.rep.add(c, k, fx.rep[k]));
    if (fx.rel) { const o = st && st.vai && TT.world.chars[st.vai[fx.rel.vai]]; if (o) TT.rel.add(c, o, fx.rel.d, why); }
    if (fx.flag) [].concat(fx.flag).forEach(f => { c.flags[f] = 1; });
    if (fx.kv) { if (fx.kv > 0) TT.kv.add(c, fx.kv, why); else if (TT.kv.can(c, -fx.kv)) TT.kv.spend(c, -fx.kv, why); }
    if (fx.ax) Object.keys(fx.ax).forEach(a => TT.nature.shift(c, a, fx.ax[a], why, true));
  }

  // ---------- lựa chọn ----------
  // Trạng thái của một lựa chọn (đọc thuần): { disabled, why, fit, trai, hop, giaText }.
  function check(c, st, lc) {
    const o = { disabled: false, why: '', fit: TT.nature.affinity(c, lc), giaText: '' };
    const g = lc.gate;
    if (g) {
      const v = Math.round(TT.nature.get(c, g.truc));
      if ((g.min != null && v < g.min) || (g.max != null && v > g.max)) { o.disabled = true; o.why = fmt(c, st, g.why); }
    }
    const a = lc.gia;
    if (a) {
      const parts = [];
      if (a.gold) { parts.push(a.gold + ' vàng'); if (!o.disabled && c.gold < a.gold) { o.disabled = true; o.why = 'Cần ' + a.gold + ' vàng (bạn có ' + Math.floor(c.gold) + ').'; } }
      if (a.hp) { parts.push(a.hp + ' sinh lực'); if (!o.disabled && c.hp <= a.hp) { o.disabled = true; o.why = 'Sinh lực không đủ để trả giá này.'; } }
      if (a.daoTam) parts.push(a.daoTam + ' đạo tâm');
      if (a.kv) { parts.push(a.kv + ' khí vận'); if (!o.disabled && !TT.kv.can(c, a.kv)) { o.disabled = true; o.why = 'Cần ' + a.kv + ' điểm khí vận (bạn có ' + TT.kv.pts(c) + ').'; } }
      o.giaText = 'Giá: ' + parts.join(', ');
    }
    o.hop = o.fit >= K().fit.hop; o.trai = o.fit < K().fit.trai;
    return o;
  }

  // Dữ liệu hộp chặng (thuần dữ liệu để lưu vào w.pending).
  function build(c, arc, chId) {
    const ch = arc.chang[chId], st = stOf(c, arc.id);
    const choices = ch.lc.map(lc => {
      const k = check(c, st, lc);
      let hint = lc.wheel ? 'Chọn thế này sẽ có vòng quay.' : '';
      if (k.giaText) hint = (hint ? hint + ' ' : '') + k.giaText + '.';
      if (k.trai && !k.disabled) hint = (hint ? hint + ' ' : '') + 'Trái tính (giá: ' + K().trai.daoTam + ' đạo tâm).';
      return { key: lc.key, label: fmt(c, st, lc.label), disabled: k.disabled, why: k.why, fit: Math.round(k.fit * 100) / 100, hop: k.hop, trai: k.trai, hint, wheel: !!lc.wheel };
    });
    let def = -1, bv = -Infinity;
    choices.forEach((x, i) => { if (!x.disabled && x.fit > bv + 1e-9) { bv = x.fit; def = i; } });
    return { type: 'story', charId: c.id, tier: 2, timeout: K().timeout, arc: arc.id, ch: chId, title: fmt(c, st, ch.t), text: fmt(c, st, ch.d), choices, def: def < 0 ? 0 : def };
  }

  function note(c, st, text) { st.log = st.log || []; st.log.push(text); if (st.log.length > 20) st.log.shift(); }

  // Tới chặng kế hoặc kết cục.
  function go(c, arc, toi) {
    const st = stOf(c, arc.id); if (!st) return;
    st.w = null;
    if (/^ket:/.test(toi)) return finish(c, arc, st, toi.slice(4));
    st.st = toi; st.since = TT.world.months; st.ready = null;
  }
  function finish(c, arc, st, x) {
    const k = arc.ket[x]; st.st = null; st.ket = x;
    const S = ensure(c); S.done.push(arc.id);
    TT.log(c, '[' + arc.n + '] ' + fmt(c, st, k.log), 'big');
    note(c, st, k.t);
    if (k.kv > 0) TT.kv.addOnce(c, 'arc_' + arc.id, k.kv, 'truyện ' + arc.n);
    TT.bus.emit('story', { id: c.id, arc: arc.id, ket: x });
  }

  function ensure(c) {
    if (!on(c)) return null;
    if (!c.story) c.story = { arcs: {}, due: [], done: [], box: -99 };
    return c.story;
  }

  function openArc(c, arc) {
    const S = ensure(c), w = TT.world;
    const st = S.arcs[arc.id] = { st: arc.dau, since: w.months, ready: null, w: null, vai: {}, log: [], ket: null };
    bindVai(c, arc, st);
    return st;
  }

  // Một tháng của người chơi: chín hậu quả trễ, mở tuyến đủ điều kiện, đưa chặng tới hạn vào hộp hoặc tự đi theo `mac`.
  function tick(c) {
    const S = ensure(c); if (!S) return;
    const w = TT.world, now = w.months;
    // hậu quả trễ
    for (let i = S.due.length - 1; i >= 0; i--) {
      const d = S.due[i]; if (d.m > now) continue;
      S.due.splice(i, 1);
      const st = stOf(c, d.arc);
      fxApply(c, st, d.fx, 'hậu quả');
      TT.log(c, fmt(c, st, d.log), 'age');
    }
    // mở tuyến
    K().arcs.forEach(arc => { if (!S.arcs[arc.id] && condOk(c, arc.mo)) openArc(c, arc); });
    Object.keys(S.arcs).forEach(id => {
      const arc = arcOf(id), st = S.arcs[id]; if (!arc || !st.st) return;
      const ch = arc.chang[st.st]; if (!ch) return;
      const k = ch.khi || {};
      if (st.w) { if (!w.pending) wheelAgain(c, arc, st); return; } // đang chờ vòng quay mà hộp bị mất: dựng lại
      if (!condOk(c, { realm: k.realm, age: k.age })) return;
      if (st.ready == null) st.ready = st.since + (k.sau || 0);
      if (now < st.ready) return;
      if (now - st.ready > ch.han) { // quá hạn: tự đi theo mặc định
        const lc = ch.lc.find(x => x.key === ch.mac) || ch.lc[0];
        TT.log(c, '[' + arc.n + '] Bạn lỡ mất dịp "' + fmt(c, st, ch.t) + '" và mọi chuyện tự trôi theo hướng cũ.', 'age');
        note(c, st, fmt(c, st, ch.t) + ' (bỏ lỡ)');
        return apply(c, arc, st.st, lc.key, true);
      }
      if (w.pending || S.box === now || now - S.box < K().gap) return;
      bindVai(c, arc, st);
      S.box = now;
      TT.decisions.request(build(c, arc, st.st));
    });
  }

  function wheelAgain(c, arc, st) {
    const ch = arc.chang[st.st], lc = ch && ch.lc.find(x => x.key === st.w);
    if (lc && lc.wheel) TT.wheel.begin(c, arc.id, st.st, lc.key); else st.w = null;
  }

  // Áp một lựa chọn của chặng (từ hộp, hoặc mặc định khi quá hạn).
  function apply(c, arc, chId, key, missed) {
    const st = stOf(c, arc.id), ch = arc.chang[chId];
    if (!st || st.st !== chId || !ch) return false;
    const lc = ch.lc.find(x => x.key === key) || ch.lc[0];
    const k = check(c, st, lc);
    // phí
    const g = lc.gia;
    if (g) {
      if (g.gold) c.gold = Math.max(0, c.gold - g.gold);
      if (g.hp) c.hp = Math.max(1, c.hp - g.hp);
      if (g.daoTam) c.daoTam = Math.max(0, c.daoTam - g.daoTam);
      if (g.kv) TT.kv.spend(c, g.kv, 'truyện ' + arc.n);
    }
    if (k.trai && !missed) { c.daoTam = Math.max(0, c.daoTam - K().trai.daoTam); TT.log(c, 'Chọn trái bản tính, bạn dằn vặt một hồi: đạo tâm -' + K().trai.daoTam + '.', 'age'); }
    Object.keys(lc.ax || {}).forEach(a => TT.nature.shift(c, a, lc.ax[a], ch.t, true));
    fxApply(c, st, lc.fx, arc.n);
    (lc.tre || []).forEach(t => {
      const S = ensure(c);
      S.due.push({ m: TT.world.months + TT.rng.RI(t.sau[0], t.sau[1]), arc: arc.id, fx: t.fx, log: t.log });
    });
    TT.log(c, '[' + arc.n + '] ' + fmt(c, st, ch.t) + ': ' + fmt(c, st, lc.label) + '.', 'age');
    if (!missed) note(c, st, fmt(c, st, ch.t) + ': ' + fmt(c, st, lc.label));
    if (lc.wheel) { st.w = lc.key; TT.wheel.begin(c, arc.id, chId, lc.key); } else go(c, arc, lc.toi);
    return true;
  }

  const story = TT.story = {
    AXES,
    on, ensure, fmt, go, applyFx: fxApply,
    arcOf, stOf,
    check: (c, arcId, lcKey, chId) => { const arc = arcOf(arcId), st = stOf(c, arcId), ch = arc.chang[chId || (st && st.st)]; return check(c, st, ch.lc.find(x => x.key === lcKey)); },
    get: c => c.story || EMPTY,

    tick(c) { if (on(c)) tick(c); },

    // Handler của hộp 'story' (decisions.js).
    choose(c, d, key) { const arc = arcOf(d.arc); if (arc) apply(c, arc, d.ch, key, false); },

    // Nhảy tới một chặng (lệnh console, thử nghiệm): mở tuyến nếu chưa, đặt chặng, đưa hộp ngay. Trả về true nếu có hộp hoặc đã xử lý.
    jump(arcId, chId) {
      const c = TT.player(), arc = arcOf(arcId);
      if (!c || !arc || !arc.chang[chId] || !ensure(c)) return false;
      if (TT.world.pending) { console.warn('TT.story.jump: đang có hộp quyết định, hãy chọn xong rồi nhảy.'); return false; }
      const st = openArc(c, arc); delete c.story.arcs[arc.id].ket;
      st.st = chId; st.since = TT.world.months; st.ready = TT.world.months; st.ket = null;
      c.story.done = c.story.done.filter(x => x !== arc.id);
      c.story.box = TT.world.months;
      TT.decisions.request(build(c, arc, chId));
      return true;
    },

    // Danh sách để vẽ mục "Truyện của đời bạn": [{ id, n, state: 'dang'|'xong', cur (tên chặng), log[], ket }] và số hậu quả đang chờ.
    rows(c) {
      const S = c.story || EMPTY;
      return Object.keys(S.arcs).map(id => {
        const arc = arcOf(id), st = S.arcs[id]; if (!arc) return null;
        const ch = st.st && arc.chang[st.st];
        return { id, n: arc.n, loai: arc.loai, state: st.ket ? 'xong' : 'dang', cur: ch ? fmt(c, st, ch.t) : '', log: (st.log || []).slice(), ket: st.ket ? arc.ket[st.ket].t : '' };
      }).filter(Boolean);
    },
    pendingDue: c => (c.story || EMPTY).due.length,
    // Chữ ký rẻ để giao diện biết khi nào vẽ lại tab.
    sig(c) { const S = c.story || EMPTY; return Object.keys(S.arcs).map(id => id + ':' + S.arcs[id].st + ':' + (S.arcs[id].log || []).length + ':' + (S.arcs[id].ket || '')).join('|') + '#' + S.due.length; },

    // Kiểm toàn bộ D.STORY.arcs (tools/story-lint.js gọi bản này): trả về danh sách lỗi (rỗng là sạch).
    lint(arcs) {
      const P = K(), errs = [], ids = {}, num = v => typeof v === 'number' && isFinite(v);
      arcs = arcs || P.arcs;
      arcs.forEach(a => { ids[a.id] = a; });
      const FX = P.fxKeys, str = v => typeof v === 'string' && v.trim().length > 0;
      arcs.forEach(arc => {
        const E = m => errs.push(arc.id + ': ' + m);
        if (!str(arc.id) || !/^[a-z0-9_]+$/.test(arc.id)) E('id không hợp lệ');
        if (arcs.filter(x => x.id === arc.id).length > 1) E('id trùng');
        if (!str(arc.n)) E('thiếu tên n');
        if (P.loai.indexOf(arc.loai) < 0) E('loai không hợp lệ: ' + arc.loai);
        const mo = arc.mo || {};
        Object.keys(mo).forEach(k => { if (['realm', 'age', 'flag', 'sau'].indexOf(k) < 0) E('mo có khóa lạ: ' + k); });
        if (mo.sau && !ids[mo.sau]) E('mo.sau trỏ tuyến không có: ' + mo.sau);
        if (!Object.keys(mo).length) E('mo rỗng (tuyến sẽ mở ngay khi sinh)');
        const vai = arc.vai || {};
        Object.keys(vai).forEach(k => { if (P.picks.indexOf(vai[k].pick) < 0) E('vai ' + k + ': pick không hợp lệ'); });
        const ch = arc.chang || {}, ket = arc.ket || {};
        if (!ch[arc.dau]) E('dau trỏ chặng không có: ' + arc.dau);
        if (!Object.keys(ket).length) E('thiếu ket');
        const slotsOk = (t, where) => { String(t).replace(SLOT, (m, k) => { if (k !== 'ten' && !vai[k]) E(where + ': khe {' + k + '} không có trong vai'); return m; }); };
        const dest = (t, where) => {
          if (!str(t)) return E(where + ': thiếu toi');
          if (/^ket:/.test(t)) { if (!ket[t.slice(4)]) E(where + ': kết cục không có: ' + t); } else if (!ch[t]) E(where + ': chặng không có: ' + t);
        };
        const fxCheck = (fx, where) => {
          Object.keys(fx || {}).forEach(k => {
            const v = fx[k];
            if (FX.indexOf(k) < 0) return E(where + ': fx khóa không cho phép: ' + k);
            if (k === 'rep') { Object.keys(v).forEach(x => { if (x !== 'chinh' && x !== 'danh') E(where + ': rep.' + x); else if (!num(v[x])) E(where + ': rep.' + x + ' không phải số'); }); }
            else if (k === 'rel') { if (!vai[v.vai]) E(where + ': rel trỏ vai không có: ' + v.vai); if (!num(v.d)) E(where + ': rel.d không phải số'); }
            else if (k === 'flag') { if (![].concat(v).every(str)) E(where + ': flag phải là chuỗi'); }
            else if (k === 'ax') { Object.keys(v).forEach(x => { if (AXES.indexOf(x) < 0) E(where + ': ax trục lạ ' + x); else if (!num(v[x])) E(where + ': ax.' + x); }); }
            else if (!num(v)) E(where + ': fx.' + k + ' không phải số');
          });
        };
        const reach = {}, stack = [arc.dau];
        while (stack.length) {
          const id = stack.pop(); if (reach[id] || !ch[id]) continue; reach[id] = 1;
          ch[id].lc.forEach(lc => { if (lc.toi && !/^ket:/.test(lc.toi)) stack.push(lc.toi); if (lc.wheel) lc.wheel.vung.forEach(z => { if (z.toi && !/^ket:/.test(z.toi)) stack.push(z.toi); }); });
        }
        Object.keys(ch).forEach(id => {
          const c0 = ch[id], W = arc.id + '/' + id, e = m => errs.push(W + ': ' + m);
          if (!str(c0.t)) e('thiếu t'); else slotsOk(c0.t, W);
          if (!str(c0.d)) e('thiếu d'); else slotsOk(c0.d, W);
          if (!reach[id]) e('chặng không tới được từ dau');
          const khi = c0.khi || {};
          Object.keys(khi).forEach(k => { if (['realm', 'age', 'sau'].indexOf(k) < 0) e('khi có khóa lạ: ' + k); else if (!num(khi[k])) e('khi.' + k + ' không phải số'); });
          if (!(num(c0.han) && c0.han > 0)) e('han phải là số tháng > 0');
          const lcs = c0.lc || [];
          if (lcs.length < 2 || lcs.length > 4) e('cần 2 đến 4 lựa chọn, có ' + lcs.length);
          if (!lcs.some(x => x.key === c0.mac)) e('mac không trỏ lựa chọn có: ' + c0.mac);
          const mac = lcs.find(x => x.key === c0.mac); if (mac && mac.gate) e('mac không được bị khóa mềm');
          const keys = {};
          lcs.forEach(lc => {
            const L = W + '/' + lc.key, le = m => errs.push(L + ': ' + m);
            if (!str(lc.key) || keys[lc.key]) le('key thiếu hoặc trùng'); keys[lc.key] = 1;
            if (!str(lc.label)) le('thiếu label'); else slotsOk(lc.label, L);
            if (P.kinds.indexOf(lc.kind) < 0) le('kind không hợp lệ: ' + lc.kind);
            Object.keys(lc.ax || {}).forEach(a => { if (AXES.indexOf(a) < 0) le('ax trục lạ ' + a); else if (!num(lc.ax[a]) || Math.abs(lc.ax[a]) > 3) le('ax.' + a + ' phải trong ±3'); });
            if (lc.gate) {
              const g = lc.gate;
              if (AXES.indexOf(g.truc) < 0) le('gate.truc không hợp lệ');
              if (g.min == null && g.max == null) le('gate cần min hoặc max');
              if ((g.min != null && !num(g.min)) || (g.max != null && !num(g.max))) le('gate min/max phải là số');
              if (!str(g.why)) le('gate thiếu lý do (why)'); else slotsOk(g.why, L);
            }
            if (lc.gia) Object.keys(lc.gia).forEach(k => { if (P.giaKeys.indexOf(k) < 0) le('gia khóa lạ: ' + k); else if (!(num(lc.gia[k]) && lc.gia[k] > 0)) le('gia.' + k + ' phải > 0'); });
            fxCheck(lc.fx, L);
            (lc.tre || []).forEach((t, i) => {
              if (!Array.isArray(t.sau) || t.sau.length !== 2 || !num(t.sau[0]) || !num(t.sau[1]) || t.sau[0] < 1 || t.sau[1] < t.sau[0] || t.sau[1] > 240) le('tre[' + i + '].sau phải là [min, max] tháng trong 1..240');
              fxCheck(t.fx, L + '/tre' + i);
              if (!str(t.log)) le('tre[' + i + '] thiếu log'); else slotsOk(t.log, L);
            });
            if (lc.wheel && lc.toi) le('có cả wheel lẫn toi');
            if (!lc.wheel) dest(lc.toi, L);
            else {
              const wh = lc.wheel, Z = P.wheel, v = wh.vung || [];
              if (v.length < Z.zMin || v.length > Z.zMax) le('wheel cần ' + Z.zMin + ' đến ' + Z.zMax + ' vùng');
              if (v.reduce((a, z) => a + z.w, 0) !== 100) le('wheel: tổng độ rộng vùng phải bằng 100');
              v.forEach((z, i) => { if (!(num(z.w) && z.w > 0)) le('wheel vùng ' + i + ': w phải > 0'); if (!str(z.n)) le('wheel vùng ' + i + ': thiếu n'); fxCheck(z.fx, L + '/vung' + i); dest(z.toi, L + '/vung' + i); });
              const y = wh.yeu_to;
              if (!y || ['nature', 'rel', 'stat'].indexOf(y.loai) < 0) le('wheel: đúng một yeu_to loại nature, rel hoặc stat');
              else {
                if (y.loai === 'nature') { if (AXES.indexOf(y.truc) < 0) le('yeu_to.truc không hợp lệ'); if (y.huong !== 1 && y.huong !== -1) le('yeu_to.huong phải là +1 hoặc -1'); }
                if (y.loai === 'rel' && !vai[y.vai]) le('yeu_to.vai không có trong vai');
                if (y.loai === 'stat' && P.stats.indexOf(y.chi_so) < 0) le('yeu_to.chi_so không hợp lệ');
                if (!(num(y.tran) && y.tran > 0 && y.tran <= Z.max)) le('yeu_to.tran phải trong (0, ' + Z.max + ']');
              }
              if (!(Number.isInteger(wh.gia) && wh.gia >= Z.giaMin && wh.gia <= Z.giaMax)) le('wheel.gia phải là số nguyên ' + Z.giaMin + '..' + Z.giaMax);
            }
          });
        });
        Object.keys(ket).forEach(x => {
          const k = ket[x];
          if (!str(k.t)) errs.push(arc.id + '/ket/' + x + ': thiếu t');
          if (!(num(k.kv) && k.kv >= 0 && k.kv <= 2)) errs.push(arc.id + '/ket/' + x + ': kv phải trong 0..2');
          if (!str(k.log)) errs.push(arc.id + '/ket/' + x + ': thiếu log'); else slotsOk(k.log, arc.id + '/ket/' + x);
        });
      });
      return errs;
    }
  };
})();
