// Khung truyện của người chơi (Z "Đặc tả 8B", Q 10): tuyến là đồ thị chặng, mở theo điều kiện, chặng có hạn (quá hạn tự đi theo `mac`),
// lựa chọn có khóa mềm (`gate`, hiện lý do), phí (`gia`) và phí trái tính, hậu quả trễ (`tre`) chín sau vài năm, kết cục cộng khí vận.
// Trạng thái c.story = { arcs: { id: { st, since, ready, w, vai, log, ket } }, due: [ { m, arc, fx, log } ], done: [], box } khởi tạo muộn.
// Hộp truyện là w.pending { type: 'story' } thuần dữ liệu (lưu/tải giữa chặng được); vòng quay ở js/systems/wheel.js.
// Hàm đọc (get, rows, fit, check, lint, sig) không gọi rng và không ghi dữ liệu. Công tắc D.STORY.on.
// K1 (bộ máy kịch bản, công tắc D.STORY.kbOn): thêm điều kiện thân phận, vai ky_uc và dan:<vai>, các khóa fx của dàn định mệnh (js/systems/dan.js),
// khuyết điểm gốc, phần và cao trào, thử thách, cảnh lớn + lời dẫn (js/systems/kb.js). Tắt kbOn thì chạy đúng như trước K1.
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
      if (st && st.khe && st.khe[k]) return st.khe[k]; // K1: khe kịch bản (thế lực, vật)
      const id = st && st.vai && st.vai[k], o = id && TT.world.chars[id];
      return o ? o.name : 'người ấy';
    });
  }

  function condOk(c, k, st) {
    if (!k) return true;
    if (k.hoac && !k.hoac.some(x => condOk(c, x, st))) return false; // hoặc: một trong các nhánh đủ là được (ví dụ cảnh giới hoặc tuổi)
    if (k.realm != null && c.realm < k.realm) return false;
    if (k.stage != null && k.realm != null && c.realm === k.realm && TT.stats.stage(c) < k.stage) return false; // giai đoạn chỉ tính trong đúng cảnh giới `realm`
    if (k.age != null && TT.age(c) < k.age) return false;
    if (k.flag && !c.flags[k.flag]) return false;
    if (k.sau && typeof k.sau === 'string') { const s = stOf(c, k.sau); if (!s || !s.ket) return false; }
    // N1b: điều kiện thân phận. tong (true có tông | false không tông | id tông), hoi (hội viên thương hội), nghe ({ id, lv }), dao (id đường), xt (xuất thân), vung, nhan (có nhẫn), ke_thu (có kẻ thù còn sống), kd (khuyết điểm gốc).
    if (k.tong !== undefined && (k.tong === true ? !c.sect : k.tong === false ? !!c.sect : !(c.sect && c.sect.id === k.tong))) return false;
    if (k.hoi !== undefined && !!(TT.hoi && TT.hoi.member(c)) !== !!k.hoi) return false;
    if (k.nghe && TT.job.level(c, k.nghe.id) < (k.nghe.lv || 1)) return false;
    if (k.dao && !(c.path && c.path.id === k.dao)) return false;
    if (k.xt && [].concat(k.xt).indexOf(c.origin2) < 0) return false;
    if (k.vung && [].concat(k.vung).indexOf(c.region) < 0) return false;
    if (k.nhan !== undefined && !!c.ring !== !!k.nhan) return false;
    if (k.ke_thu !== undefined && TT.rel.list(c).some(x => x.r.k === 'thu' && x.c && x.c.alive) !== !!k.ke_thu) return false;
    if (k.kd && [].concat(k.kd).indexOf((c.story || EMPTY).kd) < 0) return false;
    if (k.bond) { // 9B: theo cặp thân thiết. Ở khi: vai đã bốc; ở mo (chưa có vai) hoặc không ghi vai: có ai đó thỏa là đủ.
      const o = st && st.vai && k.bond.vai && TT.world.chars[st.vai[k.bond.vai]];
      if (k.bond.vai && st) { if (!o || !TT.bond.cond(c, o, k.bond)) return false; } else if (!TT.bond.find(c, k.bond)) return false;
    }
    return true;
  }

  // ---------- vai: ưu tiên NPC có sẵn ở gần, chỉ dựng mới khi không có ----------
  function candidates(c, spec, taken) {
    const w = TT.world, age = TT.age(c);
    let list = Object.keys(w.chars).map(k => w.chars[k]).filter(o => o.kind === 'npc' && o.alive && !o.left && o.tier === 'core' && o.region === c.region && o.id !== c.id && taken.indexOf(o.id) < 0);
    const here = o => (o.place === c.place ? 0 : 1);
    if (spec.pick === 'su') list = list.filter(o => TT.age(o) >= 25).sort((a, b) => here(a) - here(b) || b.realm - a.realm || a.id - b.id);
    else if (spec.pick === 'dong_ky') list = list.filter(o => Math.abs(TT.age(o) - age) <= 8 && TT.age(o) >= 12).sort((a, b) => Math.abs(TT.age(a) - age) - Math.abs(TT.age(b) - age) || here(a) - here(b) || a.id - b.id);
    else if (spec.pick === 'tinh') list = list.filter(o => TT.age(o) >= 18 && TT.family.eligible(c, o)).sort((a, b) => here(a) - here(b) || TT.rel.v(c, b) - TT.rel.v(c, a) || a.id - b.id); // người có thể nảy tình
    else list = list.filter(o => TT.age(o) >= 9).sort((a, b) => here(a) - here(b) || TT.rel.v(c, b) - TT.rel.v(c, a) || a.id - b.id);
    return list;
  }
  // Người có nhiều ký ức chung nhất với c (9K), không bắt người đã lấy.
  function kyUc(c, taken) {
    let best = null, bn = 0;
    TT.rel.list(c).forEach(x => { const o = x.c; if (!o || !o.alive || o.kind !== 'npc' || taken.indexOf(o.id) >= 0) return; const n = TT.bond.mems(c, o).length; if (n > bn || (n === bn && n > 0 && best && o.id < best.id)) { bn = n; best = o; } });
    return best;
  }
  function pickNpc(c, spec, taken, arc) {
    if (/^dan:/.test(spec.pick)) return TT.dan.dung(c, spec.pick.slice(4)); // K1: người ở vai của dàn định mệnh (dựng nếu chưa có)
    if (spec.pick === 'ky_uc') { const o = kyUc(c, taken); if (o) return o; spec = Object.assign({}, spec, { pick: 'dong_ky' }); }
    if (spec.pick === 'bond') return TT.bond.find(c, spec.bond || (arc && arc.mo && arc.mo.bond) || {}, taken); // người đã có cặp thân thiết thỏa điều kiện (không dựng mới)
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
      const n = pickNpc(c, arc.vai[k], taken, arc);
      if (n) { st.vai[k] = n.id; taken.push(n.id); }
    });
  }

  // ---------- hiệu ứng ----------
  let REC = null; // danh sách dòng "đã đổi" cho khung lời dẫn (K1), null khi không ghi
  const ghi = t => { if (REC) REC.push(t); };
  const sgn = v => (v > 0 ? '+' : '') + v;
  const isKb = c => !!(on(c) && K().kbOn);
  const vatId = (st, v) => (typeof v === 'string' && v.charAt(0) === '@' ? (st && st.khe_id && st.khe_id[v.slice(1)]) || '' : v);
  function fxApply(c, st, fx, why) {
    if (!fx) return;
    const S = TT.stats;
    if (fx.gold) { c.gold = Math.max(0, c.gold + fx.gold); ghi('Vàng ' + sgn(fx.gold)); }
    if (fx.xp) { c.xp = Math.max(0, c.xp + fx.xp * D.NEED[Math.min(5, c.realm)]); ghi('Tu vi ' + (fx.xp > 0 ? 'tăng' : 'giảm')); }
    if (fx.hp) { c.hp = Math.max(1, Math.min(S.hpMax(c), c.hp + fx.hp)); ghi('Sinh lực ' + sgn(fx.hp)); }
    if (fx.daoTam) { c.daoTam = Math.max(0, Math.min(100, c.daoTam + fx.daoTam)); ghi('Đạo tâm ' + sgn(fx.daoTam)); }
    if (fx.nghiep) { c.nghiep = Math.max(0, (c.nghiep || 0) + fx.nghiep); ghi('Nghiệp ' + sgn(fx.nghiep)); }
    if (fx.rep) Object.keys(fx.rep).forEach(k => { TT.rep.add(c, k, fx.rep[k]); ghi((k === 'danh' ? 'Danh ' : 'Chính khí ') + sgn(fx.rep[k])); });
    if (fx.rel) { const o = st && st.vai && TT.world.chars[st.vai[fx.rel.vai]]; if (o) { TT.rel.add(c, o, fx.rel.d, why); ghi('Thiện cảm với ' + o.name + ' ' + sgn(fx.rel.d)); } }
    if (fx.flag) [].concat(fx.flag).forEach(f => { c.flags[f] = 1; });
    if (fx.kv) { if (fx.kv > 0) TT.kv.add(c, fx.kv, why); else if (TT.kv.can(c, -fx.kv)) TT.kv.spend(c, -fx.kv, why); ghi('Khí vận ' + sgn(fx.kv)); }
    if (fx.ax) Object.keys(fx.ax).forEach(a => TT.nature.shift(c, a, fx.ax[a], why, true));
    if (isKb(c)) { // K1: hậu quả thật lên người trong dàn định mệnh, vật kỷ niệm, bậc tông
      const dn = v => TT.dan.name(c, v), dd = TT.dan;
      if (fx.gan_bo && dd.gain(c, fx.gan_bo.dan, fx.gan_bo.d, why)) ghi('Gắn bó với ' + dn(fx.gan_bo.dan) + ' ' + sgn(fx.gan_bo.d));
      if (fx.no) { dd.no(c, fx.no.dan, fx.no.d); ghi('Nợ với ' + dn(fx.no.dan) + ' ' + sgn(fx.no.d)); }
      if (fx.tra_no && dd.traNo(c, fx.tra_no)) ghi('Đã trả nợ với ' + dn(fx.tra_no));
      if (fx.vat) {
        const nhan = typeof fx.vat === 'object' ? false : true, id = vatId(st, nhan ? fx.vat : fx.vat.mat);
        if (id && dd.vat(c, id, nhan)) ghi((nhan ? 'Nhận ' : 'Mất ') + D.ITEMS[id].n);
      }
      if (fx.tong) dd.tong(c, fx.tong).forEach(ghi);
      if (fx.chet) { const n = dn(fx.chet.dan); if (dd.chet(c, fx.chet.dan, fx.chet.ngoai_khung)) ghi(n + ' đã mất'); }
      if (fx.roi) { const n = dn(fx.roi.dan); if (dd.roi(c, fx.roi.dan)) ghi(n + ' bỏ đi'); }
      if (fx.thu) { const n = dn(fx.thu.dan); if (dd.thu(c, fx.thu.dan, fx.thu.why)) ghi(n + ' trở thành kẻ thù'); }
    }
    if (fx.bond) { // 9B: thanh Tình/Tin/Kính/Ơn oán, loại, giai đoạn. Bước tỏ tình/hôn ước/kết có thể bị NPC từ chối: trả { refused } để lc.toi_tu rẽ nhánh.
      const b = fx.bond, o = st && st.vai && TT.world.chars[st.vai[b.vai]];
      if (o && TT.bond.on()) {
        TT.bond.shift(c, o, b, why);
        if (b.type) TT.bond.setType(c, o, b.type);
        if (b.st && TT.bond.advance(c, o, b.st).refused) return { refused: true };
      }
    }
  }

  // ---------- lựa chọn ----------
  // Trạng thái của một lựa chọn (đọc thuần): { disabled, why, fit, trai, hop, giaText }.
  // Trục lệch nhiều nhất so với hướng của lc.ax: { v: số điểm ngược chiều (≥ 0), why }.
  function oppose(c, lc) {
    let best = { v: 0, why: '' };
    Object.keys(lc.ax || {}).forEach(k => {
      const d = lc.ax[k], val = TT.nature.get(c, k), o = -Math.sign(d) * Math.round(val);
      if (d && o > best.v) { const a = D.NATURE.axes.find(x => x.id === k); best = { v: o, why: a.n + ' ' + (val > 0 ? '+' : '') + Math.round(val) + ', lựa chọn này nghiêng về ' + (d > 0 ? a.hi : a.lo).toLowerCase() }; }
    });
    return best;
  }

  function check(c, st, lc, mac) {
    const o = { disabled: false, why: '', fit: TT.nature.affinity(c, lc), giaText: '' };
    const g = lc.gate;
    if (g) {
      const v = Math.round(TT.nature.get(c, g.truc));
      if ((g.min != null && v < g.min) || (g.max != null && v > g.max)) { o.disabled = true; o.why = fmt(c, st, g.why); }
    }
    const a = lc.gia;
    if (a) {
      const parts = [];
      // Lựa chọn mặc định (mac) không bao giờ bị khóa vì thiếu giá: thiếu thì trả hết phần mình có (nếu không, hộp có thể không còn lựa chọn nào bấm được và treo mãi).
      const mc = lc.key === mac;
      if (a.gold) { parts.push(a.gold + ' vàng'); if (!mc && !o.disabled && c.gold < a.gold) { o.disabled = true; o.why = 'Cần ' + a.gold + ' vàng (bạn có ' + Math.floor(c.gold) + ').'; } }
      if (a.hp) { parts.push(a.hp + ' sinh lực'); if (!mc && !o.disabled && c.hp <= a.hp) { o.disabled = true; o.why = 'Sinh lực không đủ để trả giá này.'; } }
      if (a.daoTam) parts.push(a.daoTam + ' đạo tâm');
      if (a.kv) { parts.push(a.kv + ' khí vận'); if (!mc && !o.disabled && !TT.kv.can(c, a.kv)) { o.disabled = true; o.why = 'Cần ' + a.kv + ' điểm khí vận (bạn có ' + TT.kv.pts(c) + ').'; } }
      o.giaText = 'Giá: ' + parts.join(', ');
    }
    // Khoảng cách tính cách: điểm trục ngược chiều hướng lựa chọn. Đủ xa thì khóa (trừ lựa chọn mặc định `mac`, để luôn còn đường đi).
    const dist = oppose(c, lc);
    o.dist = dist.v;
    if (!o.disabled && dist.v >= K().khoaAt && lc.key !== mac) { o.disabled = true; o.why = 'Quá trái bản tính (' + dist.why + '): bạn không thể làm vậy.'; }
    o.hop = o.fit >= K().fit.hop; o.trai = dist.v >= K().traiAt;
    return o;
  }

  // Chữ của chặng: d_neu (K1, thay theo cờ) trước, rồi d_pham cho phàm nhân, rồi d.
  function dText(c, ch) {
    const m = isKb(c) && (ch.d_neu || []).find(x => c.flags[x.flag]);
    return m ? m.d : (c.realm === 0 && ch.d_pham ? ch.d_pham : ch.d);
  }
  const canOk = (c, lc) => !lc.can || [].concat(lc.can).every(f => c.flags[f]); // K1: lựa chọn chỉ hiện khi có cờ
  // Dữ liệu hộp chặng (thuần dữ liệu để lưu vào w.pending).
  function build(c, arc, chId) {
    const ch = arc.chang[chId], st = stOf(c, arc.id), kb = isKb(c);
    const choices = ch.lc.filter(lc => !kb || canOk(c, lc)).map(lc => {
      const k = check(c, st, lc, ch.mac);
      let hint = lc.wheel ? 'Chọn thế này sẽ có vòng quay.' : lc.thu_thach ? 'Chọn thế này là nhận một thử thách có hạn.' : '';
      if (k.giaText) hint = (hint ? hint + ' ' : '') + k.giaText + '.';
      if (k.trai && !k.disabled) hint = (hint ? hint + ' ' : '') + 'Trái tính (giá: ' + K().trai.daoTam + ' đạo tâm).';
      const o = { key: lc.key, label: fmt(c, st, lc.label), disabled: k.disabled, why: k.why, fit: Math.round(k.fit * 100) / 100, hop: k.hop, trai: k.trai, hint, wheel: !!lc.wheel };
      if (kb && lc.mat) o.mat = fmt(c, st, lc.mat);
      return o;
    });
    let def = -1, bv = -Infinity;
    choices.forEach((x, i) => { if (!x.disabled && x.fit > bv + 1e-9) { bv = x.fit; def = i; } });
    const d = { type: 'story', charId: c.id, tier: 2, timeout: kb && ch.lon ? K().kbc.lonGiay : K().timeout, arc: arc.id, ch: chId, title: fmt(c, st, ch.t), text: fmt(c, st, dText(c, ch)), choices, def: def < 0 ? 0 : def };
    if (kb && ch.lon) { d.lon = true; if (ch.canh) d.canh = { gio: ch.canh.gio || '', thoi_tiet: ch.canh.thoi_tiet || '' }; }
    return d;
  }

  function note(c, st, text) { st.log = st.log || []; st.log.push(text); if (st.log.length > 20) st.log.shift(); }

  // Tới chặng kế hoặc kết cục.
  function go(c, arc, toi) {
    const st = stOf(c, arc.id); if (!st) return;
    st.w = null;
    if (/^ket:/.test(toi)) return finish(c, arc, st, toi.slice(4));
    st.st = toi; st.since = TT.world.months; st.ready = null;
    if (isKb(c)) TT.kb.enter(c, arc, st, toi);
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
    if (isKb(c)) TT.kb.open(c, arc, st);
    bindVai(c, arc, st);
    if (isKb(c)) TT.kb.enter(c, arc, st, arc.dau);
    return st;
  }

  // Tuyến có được mở không: điều kiện mo; kịch bản kiểu kb chỉ mở khi D.STORY.kb[khuyết điểm] trỏ tới nó; có kịch bản thì xương sống A cũ (từ A2) nhường chỗ.
  function canOpen(c, arc, S) {
    if (!condOk(c, arc.mo)) return false;
    if (!isKb(c)) return arc.loai !== 'kb';
    const kb = K().kb[S.kd];
    if (arc.loai === 'kb') return !!kb && kb === arc.id;
    if (arc.loai === 'bb' && arc.id !== 'bb_a1' && kb && K().arcById[kb]) return false;
    return true;
  }

  // Một tháng của người chơi: chín hậu quả trễ, mở tuyến đủ điều kiện, đưa chặng tới hạn vào hộp hoặc tự đi theo `mac`.
  function tick(c) {
    const S = ensure(c); if (!S) return;
    const w = TT.world, now = w.months, KB = isKb(c);
    // hậu quả trễ (tre.chang: chặng gặt, mở chặng đó khi tuyến còn đang đi và không vướng thử thách, vòng quay hay hộp khác; chưa được thì chờ)
    for (let i = S.due.length - 1; i >= 0; i--) {
      const d = S.due[i]; if (d.m > now) continue;
      const st = stOf(c, d.arc);
      if (d.chang) {
        const arc = arcOf(d.arc);
        if (!arc || !st || st.ket || !st.st || !arc.chang[d.chang]) { S.due.splice(i, 1); continue; }
        if (st.tt || st.w || w.pending) continue;
        S.due.splice(i, 1);
        if (d.log) TT.log(c, fmt(c, st, d.log), 'age');
        go(c, arc, d.chang);
        continue;
      }
      S.due.splice(i, 1);
      fxApply(c, st, d.fx, 'hậu quả');
      TT.log(c, fmt(c, st, d.log), 'age');
    }
    if (KB) TT.kb.tick(c);
    // mở tuyến
    K().arcs.forEach(arc => { if (!S.arcs[arc.id] && canOpen(c, arc, S)) openArc(c, arc); });
    Object.keys(S.arcs).forEach(id => {
      const arc = arcOf(id), st = S.arcs[id]; if (!arc || !st.st) return;
      if (KB && st.tt) return; // đang làm thử thách: kb.tick xử lý
      const ch = arc.chang[st.st]; if (!ch) return;
      const k = ch.khi || {};
      if (st.w) { if (!w.pending) wheelAgain(c, arc, st); return; } // đang chờ vòng quay mà hộp bị mất: dựng lại
      if (KB && arc.phan && !w.pending && TT.kb.director(c, arc, st)) return; // phần mở theo tuổi khi người chơi thụ động
      if (!condOk(c, k, st)) return;
      if (st.ready == null) st.ready = st.since + (k.sau || 0);
      if (KB) { const hold = TT.kb.hold(c, arc, st, ch); if (hold > st.ready) st.ready = hold; } // luật ba lần, khoảng cách giữa hai cao trào, tuổi mở phần
      if (now < st.ready) return;
      if (now - st.ready > ch.han) { // quá hạn: tự đi theo mặc định
        const lc = ch.lc.find(x => x.key === ch.mac) || ch.lc[0];
        TT.log(c, '[' + arc.n + '] Bạn lỡ mất dịp "' + fmt(c, st, ch.t) + '" và mọi chuyện tự trôi theo hướng cũ.', 'age');
        note(c, st, fmt(c, st, ch.t) + ' (bỏ lỡ)');
        return apply(c, arc, st.st, lc.key, true);
      }
      if (w.pending || S.box === now || now - S.box < K().gap || quiet()) return;
      bindVai(c, arc, st);
      S.box = now;
      TT.decisions.request(build(c, arc, st.st));
    });
  }

  // Điều nhịp: hộp truyện chờ khi ngân sách hộp (D.STORY.nhip) chưa đủ 1 điểm. Chế độ Thủ công không bị giới hạn.
  const quiet = () => { const N = K().nhip; return !!(N && N.on && TT.decisions.mode() !== 'thu_cong' && TT.decisions.ngan() < 1); };
  function wheelAgain(c, arc, st) {
    const ch = arc.chang[st.st], lc = ch && ch.lc.find(x => x.key === st.w);
    if (lc && lc.wheel) TT.wheel.begin(c, arc.id, st.st, lc.key); else st.w = null;
  }

  // Áp một lựa chọn của chặng (từ hộp, hoặc mặc định khi quá hạn).
  function apply(c, arc, chId, key, missed) {
    const st = stOf(c, arc.id), ch = arc.chang[chId];
    if (!st || st.st !== chId || !ch) return false;
    const lc = ch.lc.find(x => x.key === key) || ch.lc[0];
    const k = check(c, st, lc, ch.mac), KB = isKb(c);
    // phí
    const g = lc.gia;
    if (g) {
      if (g.gold) c.gold = Math.max(0, c.gold - g.gold);
      if (g.hp) c.hp = Math.max(1, c.hp - g.hp);
      if (g.daoTam) c.daoTam = Math.max(0, c.daoTam - g.daoTam);
      if (g.kv && TT.kv.can(c, g.kv)) TT.kv.spend(c, g.kv, 'truyện ' + arc.n);
    }
    if (k.trai && !missed) { c.daoTam = Math.max(0, c.daoTam - K().trai.daoTam); TT.log(c, 'Chọn trái bản tính, bạn dằn vặt một hồi: đạo tâm -' + K().trai.daoTam + '.', 'age'); }
    Object.keys(lc.ax || {}).forEach(a => TT.nature.shift(c, a, lc.ax[a], ch.t, true));
    REC = KB ? [] : null;
    let fr, rec;
    try { fr = fxApply(c, st, lc.fx, arc.n); } finally { rec = REC; REC = null; }
    (lc.tre || []).forEach(t => {
      const S = ensure(c);
      S.due.push(t.chang ? { m: TT.world.months + TT.rng.RI(t.sau[0], t.sau[1]), arc: arc.id, chang: t.chang, log: t.log } : { m: TT.world.months + TT.rng.RI(t.sau[0], t.sau[1]), arc: arc.id, fx: t.fx, log: t.log });
    });
    TT.log(c, '[' + arc.n + '] ' + fmt(c, st, ch.t) + ': ' + fmt(c, st, lc.label) + '.', 'age');
    if (!missed) note(c, st, fmt(c, st, ch.t) + ': ' + fmt(c, st, lc.label));
    if (KB) TT.kb.applied(c, arc, st, chId, missed);
    if (KB && lc.thu_thach) TT.kb.ttStart(c, arc, st, ch, lc);
    else if (lc.wheel) { st.w = lc.key; TT.wheel.begin(c, arc.id, chId, lc.key); } else go(c, arc, fr && fr.refused && lc.toi_tu ? lc.toi_tu : lc.toi);
    if (KB && !missed && !lc.wheel) TT.kb.sau(c, arc, st, ch, lc, rec); // lời dẫn sau lựa chọn của cảnh lớn
    return true;
  }

  // Các luật đo được của cẩm nang Q mục 8 (K1): trả danh sách lỗi dạng "luật (chi tiết)". Đọc thuần, chỉ đọc dữ liệu tuyến.
  const BIG = fx => !!fx && ((fx.gold || 0) >= 100 || (fx.xp || 0) >= 0.25 || (fx.kv || 0) >= 1 || (fx.daoTam || 0) >= 5 || (fx.tong && fx.tong.len_noi_mon) || ((fx.rep && fx.rep.danh) || 0) >= 3); // phần thưởng lớn
  function measure(arc) {
    const out = [], ch = arc.chang || {}, ids = Object.keys(ch), str = v => typeof v === 'string' && v.trim().length > 0;
    const set = {}, read = {};
    const fxs = lc => [lc.fx].concat((lc.tre || []).map(t => t.fx), lc.wheel ? lc.wheel.vung.map(z => z.fx) : []).filter(Boolean);
    const destsOf = lc => {
      const o = [lc.toi, lc.toi_tu].concat(lc.wheel ? lc.wheel.vung.map(z => z.toi) : [], lc.thu_thach ? [lc.thu_thach.dat, lc.thu_thach.truot] : []).filter(Boolean);
      return o.filter((x, i) => o.indexOf(x) === i);
    };
    if (arc.mo && arc.mo.flag) read[arc.mo.flag] = 1;
    let noMat = [], big = [], tt = 0, re = 0, tk = [];
    ids.forEach(id => {
      const c0 = ch[id];
      (c0.d_neu || []).forEach(x => { read[x.flag] = 1; });
      const dsts = {}; let vic = [];
      c0.lc.forEach(lc => {
        if (!c0.am && !str(lc.mat)) noMat.push(id + '/' + lc.key);
        if (lc.can) [].concat(lc.can).forEach(f => { read[f] = 1; });
        (lc.sau_neu || []).forEach(x => { read[x.flag] = 1; });
        if (lc.thu_thach) tt++;
        fxs(lc).forEach(fx => {
          if (fx.flag) [].concat(fx.flag).forEach(f => { set[f] = 1; });
          ['chet', 'roi', 'thu'].forEach(k => { if (fx[k]) vic.push(fx[k].dan); });
        });
        if (fxs(lc).some(BIG) && !str(lc.mat) && !lc.thu_thach && !(lc.tre || []).length) big.push(id + '/' + lc.key);
        destsOf(lc).forEach(d => { dsts[d] = 1; });
      });
      if (Object.keys(dsts).length >= 2) re++;
      if (vic.length) {
        const need = vic.filter((v, i) => vic.indexOf(v) === i), g = c0.can_gan_bo, has = [];
        const walk = x => { if (Array.isArray(x)) x.forEach(walk); else if (x && x.hoac) x.hoac.forEach(walk); else if (x && x.dan) has.push(x.dan); };
        walk(g);
        const lack = need.filter(v => has.indexOf(v) < 0);
        if (lack.length) tk.push(id + ' (thiếu ' + lack.join(', ') + ')');
      }
    });
    const nset = Object.keys(set), nread = Object.keys(read).filter(f => set[f]);
    if (noMat.length) out.push('lựa chọn thiếu mat (' + noMat.length + ': ' + noMat.slice(0, 4).join(', ') + (noMat.length > 4 ? '...' : '') + '; chặng ấm cần am: true)');
    if (nset.length < 2 || nread.length < 2) out.push('cờ đặt và đọc lại ít hơn 2 (đặt ' + nset.length + ', đọc lại ' + nread.length + ')');
    if (ids.length && re / ids.length < 0.5) out.push('chặng rẽ dưới 50% (' + re + '/' + ids.length + ')');
    const ks = Object.keys(arc.ket || {}), xau = ks.filter(k => arc.ket[k].xau).length;
    if (ks.length < 2) out.push('cần ít nhất 2 kết cục (có ' + ks.length + ')');
    if (ks.length && xau * 3 < ks.length) out.push('kết cục xấu dưới 1/3 (' + xau + '/' + ks.length + ')');
    if (tk.length) out.push('nhịp tàn khốc thiếu can_gan_bo (' + tk.join('; ') + ')');
    if (tt < 1) out.push('chưa có thử thách có hạn nào (thu_thach)');
    if (big.length) out.push('phần thưởng lớn "bấm là được" (' + big.join(', ') + '; cần mat, thu_thach hoặc tre)');
    return out;
  }

  const story = TT.story = {
    AXES,
    on, isKb, quiet, ensure, fmt, go, applyFx: fxApply, note, pickNpc, bindVai, condOk,
    arcOf, stOf,
    check: (c, arcId, lcKey, chId) => { const arc = arcOf(arcId), st = stOf(c, arcId), ch = arc.chang[chId || (st && st.st)]; return check(c, st, ch.lc.find(x => x.key === lcKey), ch.mac); },
    get: c => c.story || EMPTY,

    tick(c) { if (on(c)) tick(c); },

    // Handler của hộp 'story' (decisions.js).
    choose(c, d, key) { if (d.goi) return TT.kb.goiChoose(c, d, key); const arc = arcOf(d.arc); if (arc) apply(c, arc, d.ch, key, false); },

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
        const kb = isKb(c);
        return { id, n: arc.n, loai: arc.loai, state: st.ket ? 'xong' : 'dang', cur: ch ? fmt(c, st, ch.t) : '', log: (st.log || []).slice(), ket: st.ket ? arc.ket[st.ket].t : '',
          phan: kb && arc.phan && !st.ket ? TT.kb.phanText(arc, st) : '', tt: kb && st.tt ? TT.kb.ttInfo(c, st) : null };
      }).filter(Boolean);
    },
    pendingDue: c => (c.story || EMPTY).due.length,
    // Chữ ký rẻ để giao diện biết khi nào vẽ lại tab.
    sig(c) { const S = c.story || EMPTY; return Object.keys(S.arcs).map(id => id + ':' + S.arcs[id].st + ':' + (S.arcs[id].log || []).length + ':' + (S.arcs[id].ket || '') + (S.arcs[id].tt ? ':' + TT.kb.ttSig(c, S.arcs[id]) : '')).join('|') + '#' + S.due.length + (S.dan ? '#' + Object.keys(S.gb || {}).map(k => S.gb[k]).join(',') : ''); },

    // Kiểm toàn bộ D.STORY.arcs (tools/story-lint.js gọi bản này): trả về danh sách lỗi (rỗng là sạch).
    // Kịch bản kiểu mới (có phan[]) còn chịu các luật đo được của cẩm nang Q mục 8 (xem measure); tuyến cũ chỉ có cảnh báo (story.warn).
    lint(arcs) {
      const P = K(), errs = [], ids = {}, num = v => typeof v === 'number' && isFinite(v);
      arcs = arcs || P.arcs;
      arcs.forEach(a => { ids[a.id] = a; });
      const FX = P.fxKeys, str = v => typeof v === 'string' && v.trim().length > 0;
      const DAN = (P.dan && P.dan.vai) || [], COND = ['realm', 'stage', 'age', 'hoac', 'tong', 'hoi', 'nghe', 'dao', 'xt', 'vung', 'nhan', 'ke_thu', 'kd'];
      const TONG = ['mat_suat', 'len_noi_mon', 'giang', 'truc_xuat', 'truy'];
      arcs.forEach(arc => {
        const E = m => errs.push(arc.id + ': ' + m);
        if (!str(arc.id) || !/^[a-z0-9_]+$/.test(arc.id)) E('id không hợp lệ');
        if (arcs.filter(x => x.id === arc.id).length > 1) E('id trùng');
        if (!str(arc.n)) E('thiếu tên n');
        if (P.loai.indexOf(arc.loai) < 0) E('loai không hợp lệ: ' + arc.loai);
        const mo = arc.mo || {};
        const bondCond = (b, where, needVai) => { // điều kiện bond: { vai?, st?, type?, love?, trust?, respect?, debt? }
          if (!b || typeof b !== 'object' || !Object.keys(b).length) return E(where + '.bond rỗng');
          Object.keys(b).forEach(x => {
            if (['vai', 'st', 'type', 'love', 'trust', 'respect', 'debt'].indexOf(x) < 0) E(where + '.bond có khóa lạ: ' + x);
            else if (x === 'vai') { if (!(arc.vai || {})[b.vai]) E(where + '.bond.vai trỏ vai không có: ' + b.vai); }
            else if (x === 'st') { if (!D.BOND.stageById[b.st]) E(where + '.bond.st không hợp lệ: ' + b.st); }
            else if (x === 'type') { if (!D.BOND.types[b.type]) E(where + '.bond.type không hợp lệ: ' + b.type); }
            else if (!num(b[x])) E(where + '.bond.' + x + ' không phải số');
          });
          if (needVai && !b.vai) E(where + '.bond cần vai (chặng đã có vai, khóa điều kiện theo người ở vai)');
        };
        const condLint = (k, where, add) => {
          Object.keys(k).forEach(x => {
            const v = k[x];
            if (COND.concat(add).indexOf(x) < 0) return E(where + ' có khóa lạ: ' + x);
            if (x === 'realm' || x === 'stage' || x === 'age' || (x === 'sau' && where !== 'mo')) { if (!num(v)) E(where + '.' + x + ' không phải số'); }
            else if (x === 'tong') { if (typeof v !== 'boolean' && !str(v)) E(where + '.tong phải là true, false hoặc id tông'); }
            else if (x === 'hoi' || x === 'nhan' || x === 'ke_thu') { if (typeof v !== 'boolean') E(where + '.' + x + ' phải là true hoặc false'); }
            else if (x === 'nghe') { if (!v || !str(v.id) || !(num(v.lv) && v.lv >= 1)) E(where + '.nghe phải là { id, lv >= 1 }'); else if (D.JOBS && !D.JOBS[v.id]) E(where + '.nghe.id không có: ' + v.id); }
            else if (x === 'dao') { if (!str(v)) E(where + '.dao phải là id đường'); }
            else if (x === 'xt' || x === 'vung') { if (![].concat(v).every(str)) E(where + '.' + x + ' phải là chữ hoặc mảng chữ'); }
            else if (x === 'kd') { if (![].concat(v).every(y => P.kds && P.kds[y])) E(where + '.kd không phải khuyết điểm gốc: ' + v); }
          });
          if (k.bond !== undefined) bondCond(k.bond, where, where !== 'mo');
          if (k.stage != null && k.realm == null) E(where + ': stage cần đi kèm realm');
          if (k.stage != null && !(k.stage >= 0 && k.stage <= 2)) E(where + '.stage phải 0, 1 hoặc 2');
          if (k.hoac !== undefined) {
            if (!Array.isArray(k.hoac) || k.hoac.length < 2) E(where + '.hoac cần mảng từ 2 nhánh'); else k.hoac.forEach((x, i) => { if (!x || typeof x !== 'object' || !Object.keys(x).length) E(where + '.hoac[' + i + '] rỗng'); else condLint(x, where + '.hoac[' + i + ']', []); });
          }
        };
        condLint(mo, 'mo', ['flag', 'sau', 'bond']);
        if (mo.sau && !ids[mo.sau]) E('mo.sau trỏ tuyến không có: ' + mo.sau);
        if (!Object.keys(mo).length) E('mo rỗng (tuyến sẽ mở ngay khi sinh)');
        const vai = arc.vai || {}, khe = arc.khe_kb || {};
        Object.keys(vai).forEach(k => {
          const pk = vai[k].pick;
          if (/^dan:/.test(pk)) { if (DAN.indexOf(pk.slice(4)) < 0) E('vai ' + k + ': pick ' + pk + ' không phải vai của dàn'); if (vai[k].dung_moi) E('vai ' + k + ': pick dan không dựng mới (dàn tự dựng)'); }
          else if (P.picks.indexOf(pk) < 0) E('vai ' + k + ': pick không hợp lệ');
          if (pk === 'bond') { if (!vai[k].bond && !(mo.bond && Object.keys(mo.bond).length)) E('vai ' + k + ': pick bond cần vai.bond hoặc mo.bond'); if (vai[k].dung_moi) E('vai ' + k + ': pick bond không dựng mới'); }
        });
        Object.keys(khe).forEach(k => {
          const sp = khe[k];
          if (!/^[a-z_]+$/.test(k) || vai[k] || k === 'ten') E('khe_kb ' + k + ': tên không hợp lệ hoặc trùng vai');
          if (!sp || (!sp.the_luc && !sp.vat)) E('khe_kb ' + k + ': cần the_luc: true hoặc vat: [id, ...]');
          else if (sp.vat && (!Array.isArray(sp.vat) || !sp.vat.length || !sp.vat.every(id => P.vat && P.vat[id]))) E('khe_kb ' + k + ': vat phải là mảng id vật kỷ niệm có trong D.STORY.vat');
        });
        const ch = arc.chang || {}, ket = arc.ket || {};
        if (!ch[arc.dau]) E('dau trỏ chặng không có: ' + arc.dau);
        if (!Object.keys(ket).length) E('thiếu ket');
        const slotsOk = (t, where) => { String(t).replace(SLOT, (m, k) => { if (k !== 'ten' && !vai[k] && !khe[k]) E(where + ': khe {' + k + '} không có trong vai hoặc khe_kb'); return m; }); };
        const dest = (t, where) => {
          if (!str(t)) return E(where + ': thiếu toi');
          if (/^ket:/.test(t)) { if (!ket[t.slice(4)]) E(where + ': kết cục không có: ' + t); } else if (!ch[t]) E(where + ': chặng không có: ' + t);
        };
        const danOk = (v, where) => { if (DAN.indexOf(v) < 0) E(where + ': dan không phải vai của dàn: ' + v); };
        const vatOk = (v, where) => { if (!str(v)) return E(where + ': vat phải là id'); if (v.charAt(0) === '@') { if (!khe[v.slice(1)] || !khe[v.slice(1)].vat) E(where + ': vat ' + v + ' không có trong khe_kb'); } else if (!(P.vat && P.vat[v])) E(where + ': vat không có trong D.STORY.vat: ' + v); };
        const fxCheck = (fx, where, late) => {
          Object.keys(fx || {}).forEach(k => {
            const v = fx[k];
            if (FX.indexOf(k) < 0) return E(where + ': fx khóa không cho phép: ' + k);
            if (k === 'rep') { Object.keys(v).forEach(x => { if (x !== 'chinh' && x !== 'danh') E(where + ': rep.' + x); else if (!num(v[x])) E(where + ': rep.' + x + ' không phải số'); }); }
            else if (k === 'bond') {
              Object.keys(v).forEach(x => {
                if (['vai', 'love', 'trust', 'respect', 'debt', 'st', 'type'].indexOf(x) < 0) E(where + ': bond khóa lạ ' + x);
                else if (x === 'vai') { if (!vai[v.vai]) E(where + ': bond trỏ vai không có: ' + v.vai); }
                else if (x === 'st') { if (!D.BOND.stageById[v.st]) E(where + ': bond.st không hợp lệ: ' + v.st); }
                else if (x === 'type') { if (!D.BOND.types[v.type]) E(where + ': bond.type không hợp lệ: ' + v.type); }
                else if (!num(v[x]) || Math.abs(v[x]) > 100) E(where + ': bond.' + x + ' phải là số trong ±100');
              });
              if (!v.vai) E(where + ': bond thiếu vai');
              if (late && D.BOND.consent.indexOf(v.st) >= 0) E(where + ': bond.st ' + v.st + ' cần người kia đồng ý, chỉ dùng trong fx của lựa chọn (có toi_tu), không dùng ở tre hay vùng vòng quay');
            }
            else if (k === 'rel') { if (!vai[v.vai]) E(where + ': rel trỏ vai không có: ' + v.vai); if (!num(v.d)) E(where + ': rel.d không phải số'); }
            else if (k === 'flag') { if (![].concat(v).every(str)) E(where + ': flag phải là chuỗi'); }
            else if (k === 'ax') { Object.keys(v).forEach(x => { if (AXES.indexOf(x) < 0) E(where + ': ax trục lạ ' + x); else if (!num(v[x])) E(where + ': ax.' + x); }); }
            else if (k === 'gan_bo') { danOk(v.dan, where + ': gan_bo'); if (!(num(v.d) && Math.abs(v.d) >= 1 && Math.abs(v.d) <= 10)) E(where + ': gan_bo.d phải trong ±1..10'); }
            else if (k === 'no') { danOk(v.dan, where + ': no'); if (!(num(v.d) && v.d >= 1 && v.d <= 10)) E(where + ': no.d phải trong 1..10'); }
            else if (k === 'tra_no') danOk(v, where + ': tra_no');
            else if (k === 'chet') { danOk(v.dan, where + ': chet'); if (v.ngoai_khung !== undefined && typeof v.ngoai_khung !== 'boolean') E(where + ': chet.ngoai_khung phải là true/false'); }
            else if (k === 'roi') danOk(v.dan, where + ': roi');
            else if (k === 'thu') { danOk(v.dan, where + ': thu'); if (v.why !== undefined && !str(v.why)) E(where + ': thu.why phải là chữ'); }
            else if (k === 'tong') { Object.keys(v).forEach(x => { if (TONG.indexOf(x) < 0) E(where + ': tong khóa lạ ' + x); else if (v[x] !== true) E(where + ': tong.' + x + ' phải là true'); }); if (!Object.keys(v).length) E(where + ': tong rỗng'); }
            else if (k === 'vat') { if (v && typeof v === 'object') vatOk(v.mat, where + ': vat.mat'); else vatOk(v, where + ': vat'); }
            else if (!num(v)) E(where + ': fx.' + k + ' không phải số');
          });
        };
        const ganOk = (g, where) => {
          if (Array.isArray(g)) { if (!g.length) E(where + ': can_gan_bo mảng rỗng'); return g.forEach(x => ganOk(x, where)); }
          if (g && g.hoac) { if (!Array.isArray(g.hoac) || g.hoac.length < 2) E(where + ': can_gan_bo.hoac cần mảng từ 2 nhánh'); else g.hoac.forEach(x => ganOk(x, where)); return; }
          if (!g || DAN.indexOf(g.dan) < 0) E(where + ': can_gan_bo.dan không phải vai của dàn'); else if (g.min !== undefined && !(num(g.min) && g.min >= 1 && g.min <= 30)) E(where + ': can_gan_bo.min phải trong 1..30');
        };
        const edges = lc => { // mọi nơi một lựa chọn có thể dẫn tới
          const o = [];
          if (lc.toi) o.push(lc.toi); if (lc.toi_tu) o.push(lc.toi_tu);
          if (lc.wheel) lc.wheel.vung.forEach(z => { if (z.toi) o.push(z.toi); });
          if (lc.thu_thach) { o.push(lc.thu_thach.dat); o.push(lc.thu_thach.truot); }
          return o;
        };
        const reach = {}, stack = [arc.dau];
        while (stack.length) {
          const id = stack.pop(); if (reach[id] || !ch[id]) continue; reach[id] = 1;
          ch[id].lc.forEach(lc => { edges(lc).forEach(t => { if (t && !/^ket:/.test(t)) stack.push(t); }); (lc.tre || []).forEach(t => { if (t.chang) stack.push(t.chang); }); });
        }
        Object.keys(ch).forEach(id => {
          const c0 = ch[id], W = arc.id + '/' + id, e = m => errs.push(W + ': ' + m);
          if (!str(c0.t)) e('thiếu t'); else slotsOk(c0.t, W);
          if (!str(c0.d)) e('thiếu d'); else slotsOk(c0.d, W);
          if (!reach[id]) e('chặng không tới được từ dau');
          if (c0.d_pham !== undefined) { if (!str(c0.d_pham)) e('d_pham phải là chữ'); else slotsOk(c0.d_pham, W + '/d_pham'); }
          if (c0.d_neu !== undefined) { if (!Array.isArray(c0.d_neu) || !c0.d_neu.length) e('d_neu phải là mảng { flag, d }'); else c0.d_neu.forEach((x, i) => { if (!x || !str(x.flag) || !str(x.d)) e('d_neu[' + i + '] cần flag và d'); else slotsOk(x.d, W + '/d_neu' + i); }); }
          if (c0.lon !== undefined && typeof c0.lon !== 'boolean') e('lon phải là true/false');
          if (c0.am !== undefined && typeof c0.am !== 'boolean') e('am phải là true/false');
          if (c0.canh !== undefined) { const cn = c0.canh; if (!c0.lon) e('canh chỉ dùng ở cảnh lớn (lon: true)'); if (!cn || typeof cn !== 'object' || (cn.gio === undefined && cn.thoi_tiet === undefined)) e('canh cần gio và/hoặc thoi_tiet'); else { if (cn.gio !== undefined && ['dem', 'hoang_hon', 'ngay'].indexOf(cn.gio) < 0) e('canh.gio phải là dem, hoang_hon hoặc ngay'); if (cn.thoi_tiet !== undefined && ['mua', 'tuyet_lo', 'bao_tuyet', 'suong_doc', 'troi_quang', 'giong_bao', 'chien_loan', 'thu_hoach'].indexOf(cn.thoi_tiet) < 0) e('canh.thoi_tiet không có: ' + cn.thoi_tiet); } }
          if (c0.can_gan_bo !== undefined) ganOk(c0.can_gan_bo, W);
          condLint(c0.khi || {}, W + '/khi', ['sau', 'bond']);
          if (!(num(c0.han) && c0.han > 0)) e('han phải là số tháng > 0');
          const lcs = c0.lc || [];
          if (lcs.length < 2 || lcs.length > 4) e('cần 2 đến 4 lựa chọn, có ' + lcs.length);
          if (!lcs.some(x => x.key === c0.mac)) e('mac không trỏ lựa chọn có: ' + c0.mac);
          const mac = lcs.find(x => x.key === c0.mac); if (mac && mac.gate) e('mac không được bị khóa mềm'); if (mac && mac.can) e('mac không được có can (lựa chọn mặc định phải luôn hiện)');
          if (c0.lon && lcs.some(x => !x.wheel && !str(x.sau))) e('cảnh lớn: mỗi lựa chọn (không vòng quay) cần lời dẫn sau');
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
            if (lc.can !== undefined && ![].concat(lc.can).every(str)) le('can phải là cờ hoặc mảng cờ');
            if (lc.mat !== undefined) { if (!str(lc.mat)) le('mat phải là chữ'); else slotsOk(lc.mat, L + '/mat'); }
            if (lc.sau !== undefined) { if (!c0.lon) le('sau chỉ dùng ở cảnh lớn (lon: true)'); if (lc.wheel) le('sau không dùng cùng wheel'); if (!str(lc.sau)) le('sau phải là chữ'); else slotsOk(lc.sau, L + '/sau'); }
            if (lc.sau_neu !== undefined) { if (!str(lc.sau)) le('sau_neu cần có sau mặc định'); if (!Array.isArray(lc.sau_neu)) le('sau_neu phải là mảng { flag, sau }'); else lc.sau_neu.forEach((x, i) => { if (!x || !str(x.flag) || !str(x.sau)) le('sau_neu[' + i + '] cần flag và sau'); else slotsOk(x.sau, L + '/sau_neu' + i); }); }
            if (lc.gia) Object.keys(lc.gia).forEach(k => { if (P.giaKeys.indexOf(k) < 0) le('gia khóa lạ: ' + k); else if (!(num(lc.gia[k]) && lc.gia[k] > 0)) le('gia.' + k + ' phải > 0'); });
            fxCheck(lc.fx, L);
            (lc.tre || []).forEach((t, i) => {
              if (!Array.isArray(t.sau) || t.sau.length !== 2 || !num(t.sau[0]) || !num(t.sau[1]) || t.sau[0] < 1 || t.sau[1] < t.sau[0] || t.sau[1] > 240) le('tre[' + i + '].sau phải là [min, max] tháng trong 1..240');
              if (t.chang !== undefined) { if (!ch[t.chang]) le('tre[' + i + '].chang không có: ' + t.chang); if (t.fx) le('tre[' + i + '] có chang thì không có fx'); if (t.log !== undefined) { if (!str(t.log)) le('tre[' + i + '].log phải là chữ'); else slotsOk(t.log, L); } }
              else { fxCheck(t.fx, L + '/tre' + i, true); if (!str(t.log)) le('tre[' + i + '] thiếu log'); else slotsOk(t.log, L); }
            });
            if (lc.thu_thach !== undefined) {
              const T = lc.thu_thach, ck = ['gold', 'realm', 'nghe', 'cong', 'xp'];
              if (lc.wheel || lc.toi) le('thu_thach không dùng cùng wheel hoặc toi'); if (lc.toi_tu !== undefined) le('thu_thach không dùng cùng toi_tu');
              if (!T || !T.can || !Object.keys(T.can).length) le('thu_thach.can rỗng');
              else Object.keys(T.can).forEach(x => {
                if (ck.indexOf(x) < 0) le('thu_thach.can khóa lạ: ' + x);
                else if (x === 'nghe') { if (!T.can.nghe || !str(T.can.nghe.id) || !(num(T.can.nghe.lv) && T.can.nghe.lv >= 1)) le('thu_thach.can.nghe phải là { id, lv >= 1 }'); else if (D.JOBS && !D.JOBS[T.can.nghe.id]) le('thu_thach.can.nghe.id không có: ' + T.can.nghe.id); }
                else if (!(num(T.can[x]) && T.can[x] > 0)) le('thu_thach.can.' + x + ' phải > 0');
              });
              if (T && !(num(T.han) && T.han >= 1 && T.han <= 240)) le('thu_thach.han phải là số tháng trong 1..240');
              if (T) { dest(T.dat, L + '/thu_thach.dat'); dest(T.truot, L + '/thu_thach.truot'); if (T.tieu !== undefined && typeof T.tieu !== 'boolean') le('thu_thach.tieu phải là true/false'); if (T.tieu && !(T.can && T.can.gold)) le('thu_thach.tieu chỉ có nghĩa khi can.gold'); }
            }
            if (lc.wheel && lc.toi) le('có cả wheel lẫn toi');
            if (lc.toi_tu !== undefined) { if (lc.wheel) le('toi_tu không dùng cùng wheel'); else dest(lc.toi_tu, L + '/toi_tu'); if (!(lc.fx && lc.fx.bond && D.BOND.consent.indexOf(lc.fx.bond.st) >= 0)) le('toi_tu chỉ có nghĩa khi fx.bond.st là to, hon hoặc ket'); }
            else if (lc.fx && lc.fx.bond && D.BOND.consent.indexOf(lc.fx.bond.st) >= 0) le('fx.bond.st ' + lc.fx.bond.st + ' có thể bị từ chối: cần toi_tu (chặng/kết cục khi bị từ chối)');
            if (!lc.wheel && lc.thu_thach === undefined) dest(lc.toi, L);
            else if (lc.wheel) {
              const wh = lc.wheel, Z = P.wheel, v = wh.vung || [];
              if (v.length < Z.zMin || v.length > Z.zMax) le('wheel cần ' + Z.zMin + ' đến ' + Z.zMax + ' vùng');
              if (v.reduce((a, z) => a + z.w, 0) !== 100) le('wheel: tổng độ rộng vùng phải bằng 100');
              v.forEach((z, i) => { if (!(num(z.w) && z.w > 0)) le('wheel vùng ' + i + ': w phải > 0'); if (!str(z.n)) le('wheel vùng ' + i + ': thiếu n'); fxCheck(z.fx, L + '/vung' + i, true); dest(z.toi, L + '/vung' + i); });
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
          if (k.xau !== undefined && typeof k.xau !== 'boolean') errs.push(arc.id + '/ket/' + x + ': xau phải là true/false');
        });
        // phần và nhịp (kịch bản kiểu mới)
        if (arc.phan !== undefined) {
          const ph = arc.phan, KB = P.kbc;
          if (!Array.isArray(ph) || ph.length < (arc.mau ? 2 : 5) || ph.length > 7) E('phan cần ' + (arc.mau ? '2 (khung mẫu) hoặc 5' : '5') + ' đến 7 phần, có ' + (Array.isArray(ph) ? ph.length : 0));
          else {
            const seen = {}; let lastAge = -1;
            ph.forEach((p, i) => {
              const W = 'phan[' + i + ']';
              if (!str(p.id) || !str(p.n)) E(W + ': cần id và n');
              if (p.tuoi !== undefined) { if (!num(p.tuoi) || p.tuoi < lastAge) E(W + '.tuoi phải là số tăng dần'); else lastAge = p.tuoi; }
              const one = (n, v) => { if (!str(v)) E(W + '.' + n + ': cần id chặng'); else if (!ch[v]) E(W + '.' + n + ': chặng không có: ' + v); else if (seen[v]) E(W + '.' + n + ': chặng ' + v + ' đã thuộc phần/nhịp khác'); else seen[v] = 1; };
              one('moc', p.moc); one('dao', p.dao); one('cao_trao', p.cao_trao); one('treo', p.treo);
              if (!Array.isArray(p.leo) || p.leo.length < 1 || p.leo.length > 2) E(W + '.leo cần 1 đến 2 chặng'); else p.leo.forEach(v => one('leo', v));
              if (ch[p.cao_trao] && !ch[p.cao_trao].lon) E(W + '.cao_trao: chặng ' + p.cao_trao + ' phải là cảnh lớn (lon: true)');
            });
            if (ph[0] && ph[0].moc !== arc.dau) E('chặng dau phải là moc của phần đầu');
          }
          measure(arc).forEach(m => errs.push(arc.id + ': ' + m));
        }
      });
      return errs;
    },

    // Số đo của một tuyến theo mục 8 cẩm nang (dùng cho lint và cảnh báo): trả danh sách lỗi đo được.
    measure(arc) { return measure(arc); },
    // Cảnh báo cho tuyến cũ (không có phan[]): mỗi tuyến một dòng gom các luật đo được chưa đạt. Không phải lỗi.
    warn(arcs) {
      return (arcs || K().arcs).filter(a => a.phan === undefined).map(a => { const m = measure(a); return m.length ? a.id + ': ' + m.map(x => x.split(' (')[0]).join('; ') : ''; }).filter(Boolean);
    }
  };
})();
