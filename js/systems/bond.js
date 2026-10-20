// Quan hệ có chiều sâu của người chơi (R mục 4, 5; Z "9B"): thanh Tình/Tin/Kính/Ơn oán, loại quan hệ, hành trình đạo lữ.
// Chỉ cặp CÓ NGƯỜI CHƠI; NPC với NPC giữ bản cũ (rel.love, family.pair). Bản ghi d nằm trong world.rel[key].d, khởi tạo muộn
// (bản lưu cũ chuyển một lần: love cũ -> d.love, k cũ -> loại d.t), không đổi TT.VERSION.
// Hàm ĐỌC (get, bars, label, stage, compat, willing, cond, find, partners, grief, dualFull, holds, loveRec) không gọi rng và không ghi dữ liệu.
// Hàm GHI (ensure, shift, setType, advance, breakup, dual, tick, yearly, betroth) chỉ chạy khi D.BOND.on và cặp có người chơi.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, rel = TT.rel;
  const K = () => D.BOND;
  const ch = x => (x && typeof x === 'object' ? x : TT.world.chars[x]);
  const plOf = (a, b) => { a = ch(a); b = ch(b); return a && b ? (a.kind === 'player' ? a : b.kind === 'player' ? b : null) : null; };
  const BARS = ['love', 'trust', 'respect'];
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const rankOf = id => { const r = K().rank[id]; return r == null ? -1 : r; };
  const LINE = () => K().rank.thu; // đường chính tới hết 'thu'; ran và biet là nhánh cuối

  function legacyBars(r) {
    const v = r.v, k = r.k;
    return {
      love: r.love || 0,
      trust: clamp(v * 0.9, 0, 100),
      respect: k === 'su_do' || k === 'huyet' ? clamp(50 + v / 4, 0, 100) : clamp(v * 0.6, 0, 100),
      debt: k === 'thu' ? -clamp(-v, 0, 100) : 0
    };
  }
  const legacyType = r => (r.nl ? 'cu' : K().legacy[r.k] || 'ban');
  const isClose = r => Math.abs(r.v) >= K().deep || !!r.k;
  const countD = c => rel.list(c).filter(x => x.r.d).length;
  const partnersOf = c => TT.family.partners(c);
  const stOk = (cur, want) => {
    if (!cur) return false;
    const w = rankOf(want), r0 = rankOf(cur);
    if (w > LINE()) return cur === want;
    return r0 >= 0 && r0 <= LINE() && r0 >= w;
  };
  function say(pl, text, cls) { if (pl && pl.kind === 'player') TT.log(pl, text, cls || ''); }

  // d mới cho một bản ghi quan hệ (bản lưu cũ hoặc cặp vừa thân thiết); pl là người chơi, o là người kia.
  function init(pl, o, r) {
    const L = legacyBars(r), t = legacyType(r), now = TT.world.months;
    const d = r.d = { t, love: L.love, trust: L.trust, respect: L.respect, debt: L.debt, st: '', since: now };
    if (t === 'dao_lu') {
      d.st = 'ben';
      d.p = partnersOf(pl).some(x => x.r !== r && x.r.d && x.r.d.p === 'chinh') ? 'phu' : 'chinh';
    } else if ((t === 'ban' || t === 'cu') && TT.family.attract(pl, o) > 0) {
      d.st = d.love >= 25 ? 'men' : 'gap';
    }
    return d;
  }

  const bond = TT.bond = {
    // ---------- đọc thuần ----------
    on: () => !!(K() && K().on),
    // Cặp có người chơi thì thuộc hệ này (khi công tắc bật).
    owns(a, b) { return !!(K() && K().on && plOf(a, b)); },
    get(a, b) { if (!K().on) return null; const r = rel.get(a, b); return (r && r.d) || null; },
    // Tình của bản ghi: d.love nếu cặp đã có chiều sâu, ngược lại rel.love cũ (công tắc tắt thì luôn là rel.love).
    loveRec(r) { return K().on && r.d ? r.d.love : (r.love || 0); },
    // Cặp đang trong hành trình (tỏ tình, hôn ước...) thì không bốc lại hộp "Duyên tình" kiểu cũ.
    holds(r) { return !!(K().on && r.d && (rankOf(r.d.st) >= K().rank.to && rankOf(r.d.st) <= LINE() || r.d.t === 'thuong' || r.d.t === 'hon_uoc' || r.d.st === 'ran' || r.d.st === 'biet')); },

    type(a, b) { const r = rel.get(a, b); if (!r) return ''; return K().on && r.d ? r.d.t : legacyType(r); },
    typeName(t) { return (K().types[t] || { n: '' }).n; },
    stage(a, b) { const d = bond.get(a, b); return d && d.st ? K().stageById[d.st] : null; },
    // Ba thanh + ơn oán + các thanh nên hiện. Chưa có d thì suy từ bản cũ (virtual: true).
    bars(a, b) {
      const r = rel.get(a, b); if (!r || !K().on) return null;
      const d = r.d, src = d || legacyBars(r), t = d ? d.t : legacyType(r);
      const want = (K().types[t] || { bars: [] }).bars;
      const show = BARS.filter(k => want.indexOf(k) >= 0 || src[k] >= 10);
      return { love: src.love, trust: src.trust, respect: src.respect, debt: src.debt, t, st: d ? d.st : '', show, virtual: !d };
    },
    // Thân: trung bình có trọng số các thanh theo loại (dùng cho hộp quyết định, bốc người).
    than(a, b) {
      const v = bond.bars(a, b); if (!v) return 0;
      const ks = (K().types[v.t] || { bars: BARS }).bars; const use = ks.length ? ks : BARS;
      return use.reduce((s, k) => s + v[k], 0) / use.length;
    },
    label(a, b) {
      const r = rel.get(a, b);
      if (!r) return 'Chưa quen';
      const d = K().on && r.d;
      if (!d) return rel.label(a, b);
      if (d.t === 'ban') { const l = rel.level(r.v, r); return d.st && d.st !== 'gap' && rankOf(d.st) >= K().rank.men ? l + ' · ' + K().stageById[d.st].n : l; }
      const T = K().types[d.t];
      return T.n + ((d.t === 'dao_lu' || d.t === 'thuong' || d.t === 'hon_uoc') && d.st && !(d.t === 'hon_uoc' && d.st === 'hon') ? ' · ' + K().stageById[d.st].n : '') + (d.t === 'dao_lu' && d.p === 'phu' ? ' (phụ)' : '');
    },

    // Điều kiện theo cặp: spec { type?, st?, love?, trust?, respect?, debt? }.
    cond(c, o, s) {
      const d = bond.get(c, o); if (!d || !s) return false;
      if (s.type && d.t !== s.type) return false;
      if (s.st && !stOk(d.st, s.st)) return false;
      for (let i = 0; i < 3; i++) { const k = BARS[i]; if (s[k] != null && d[k] < s[k]) return false; }
      if (s.debt != null && (s.debt >= 0 ? d.debt < s.debt : d.debt > s.debt)) return false;
      return true;
    },
    // Người (NPC còn sống, đã quen) có cặp thỏa spec, thân nhất trước. taken: mảng id bỏ qua.
    find(c, spec, taken) {
      let best = null, bs = -1;
      rel.list(c).forEach(x => {
        if (!x.c || !x.c.alive || x.c.kind !== 'npc' || !x.r.d || (taken && taken.indexOf(x.id) >= 0)) return;
        if (!bond.cond(c, x.c, spec || {})) return;
        const s = x.r.d.love + x.r.d.trust + x.r.d.respect;
        if (s > bs || (s === bs && best && x.id < best.id)) { bs = s; best = x.c; }
      });
      return best;
    },

    // Đạo lữ còn sống của c, chính trước.
    partners(c) {
      const list = partnersOf(c).slice();
      list.sort((a, b) => ((b.r.d && b.r.d.p === 'chinh') ? 1 : 0) - ((a.r.d && a.r.d.p === 'chinh') ? 1 : 0) || a.id - b.id);
      return list;
    },
    main(c) { return bond.partners(c)[0] || null; },

    // Tương hợp −1..1 (R 5.2): bốn trục tính cách, ngũ hành tư chất, đạo đang theo, chính tà. Đối xứng, không rng.
    compat(a, b) {
      a = ch(a); b = ch(b);
      const C = K().compat, N = TT.nature, va = N.get(a), vb = N.get(b);
      const near = ax => 1 - Math.abs(va[ax] - vb[ax]) / 10;
      let s = C.daoduc * near('daoduc') + C.tudung * near('tudung');
      const ta = va.tinh, tb = vb.tinh; // âm là nóng nảy
      s += C.tinh * (ta <= -3 && tb <= -3 ? -1 : (ta <= -3 && tb >= 3) || (tb <= -3 && ta >= 3) ? 0.7 : ta >= 3 && tb >= 3 ? 0.4 : near('tinh') * 0.5);
      const dx = Math.abs(va.xuthe - vb.xuthe);
      s += C.xuthe * (dx <= 4 ? 0.5 : dx <= 10 ? 0.3 : -0.7);
      const top = c => { const at = c.tuchat && c.tuchat.attrs; return at && at.length ? at.reduce((m, x) => (x.p > m.p ? x : m), at[0]).n : null; };
      const ea = top(a), eb = top(b), SINH = { Kim: 'Thủy', Thủy: 'Mộc', Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim' };
      let es = 0;
      if (ea && eb) es = ea === eb ? 0.3 : SINH[ea] === eb || SINH[eb] === ea ? 0.8 : TT.combat.beats(ea, eb) || TT.combat.beats(eb, ea) ? -0.7 : 0;
      s += C.elem * es;
      s += C.dao * (a.direction === b.direction ? 0.6 : -0.2);
      const gap = Math.abs(TT.rep.alignOf(a) - TT.rep.alignOf(b));
      s += C.chinh * (gap >= 80 ? -1 : gap >= 50 ? -0.5 : gap < 25 ? 0.4 : 0);
      return clamp(s, -1, 1);
    },
    compatLabel(x) { const B = K().compatBands; for (let i = 0; i < B.length; i++) if (x >= B[i][0]) return B[i][1]; return 'Trái tính'; },

    // Người kia có chịu bước 'to' | 'hon' | 'ket' không (xác suất, đọc thuần). NPC đã có đạo lữ khác thì gần như không.
    willing(npc, pl, step) {
      npc = ch(npc); pl = ch(pl);
      const d = bond.get(pl, npc) || { love: 0, trust: 0, ref: 0 };
      if (partnersOf(npc).some(x => x.id !== pl.id)) return 0.02;
      let p = ({ to: 0.12, hon: 0.25, ket: 0.3 })[step] || 0.2;
      p += d.love / 100 * 0.55 + d.trust / 100 * 0.15 + bond.compat(pl, npc) * 0.15 - 0.1 * (d.ref || 0);
      const gap = Math.abs(pl.realm - npc.realm); if (gap > 2) p -= 0.05 * (gap - 2);
      return clamp(p, 0.03, 0.95);
    },
    // Chênh cảnh giới từ grief.realmGap trở lên: { gap, lower: nhân vật cảnh giới thấp hơn } hoặc null ("nỗi buồn tuổi thọ").
    grief(a, b) { a = ch(a); b = ch(b); const g = Math.abs(a.realm - b.realm); return g >= K().grief.realmGap ? { gap: g, lower: a.realm < b.realm ? a : b } : null; },

    // Số lần song tu đã tính trong năm hiện tại của cặp (đọc thuần).
    dualCount(a, b) { const d = bond.get(a, b), y = Math.floor(TT.world.months / 12); return d && d.sy && d.sy.y === y ? d.sy.n : 0; },
    // Đã song tu đủ số lần trong năm (AI bỏ qua hành động song tu).
    dualFull(c) {
      if (!K().on) return false;
      const q = TT.family.partnerHere(c); if (!q || !plOf(c, q)) return false;
      return bond.dualCount(c, q) >= K().songTu.perYear;
    },

    // ---------- ghi ----------
    // Tạo d cho cặp (cần có người chơi). Trả về d hoặc null.
    ensure(a, b) {
      if (!K().on) return null;
      const pl = plOf(a, b); if (!pl) return null;
      a = ch(a); b = ch(b);
      const o = pl === a ? b : a, r = rel.ensure(a, b);
      return r.d || init(pl, o, r);
    },
    // Cộng các thanh (love, trust, respect: 0..100; debt: −100..100).
    shift(a, b, delta, why) {
      const d = bond.ensure(a, b); if (!d) return null;
      BARS.forEach(k => { if (delta[k]) d[k] = clamp(d[k] + delta[k], 0, 100); });
      if (delta.debt) d.debt = clamp(d.debt + delta.debt, -100, 100);
      return d;
    },
    // Cộng Tình trực tiếp lên bản ghi (giữ đúng cách tính cũ khi công tắc tắt hoặc cặp chưa có d).
    addLoveRec(r, x) {
      if (K().on && r.d) r.d.love = clamp(r.d.love + x, 0, 100);
      else r.love = clamp((r.love || 0) + x, 0, 100);
    },
    setType(a, b, t) {
      if (!K().types[t]) return null;
      const d = bond.ensure(a, b); if (!d) return null;
      const r = rel.get(a, b);
      d.t = t; d.since = TT.world.months;
      if (K().legacy[t]) r.k = K().legacy[t];
      else if (K().legacy[r.k] || r.k === 'thu') r.k = '';
      if (t === 'cu') r.nl = 1;
      return d;
    },

    // Đạo lữ vừa kết (family.pair gọi khi cặp có người chơi).
    onPair(a, b, r) {
      const pl = plOf(a, b), o = pl === ch(a) ? ch(b) : ch(a), now = TT.world.months;
      const hasMain = partnersOf(pl).some(x => x.r !== r && x.r.d && x.r.d.p === 'chinh');
      const d = bond.ensure(a, b);
      r.k = 'dao_lu'; r.v = Math.max(r.v, 70); r.m = now; r.nl = 0;
      d.t = 'dao_lu'; d.st = 'ket'; d.since = now; d.low = 0; d.ref = 0; d.p = hasMain ? 'phu' : 'chinh';
      d.love = Math.max(d.love, 60); d.trust = Math.max(d.trust, 40); d.respect = Math.max(d.respect, 30);
      void o;
    },

    // Chuyển giai đoạn. Bước cần người kia (to, hon, ket) có thể bị NPC từ chối: trả { ok:false, refused:true }. o.force bỏ qua xin phép.
    advance(a, b, st, o) {
      o = o || {};
      const pl = plOf(a, b);
      if (!K().on || !pl || !K().stageById[st]) return { ok: false };
      a = ch(a); b = ch(b);
      const other = pl === a ? b : a, d = bond.ensure(pl, other), now = TT.world.months;
      if (K().consent.indexOf(st) >= 0 && stOk(d.st, st) && d.t !== 'cu') return { ok: true, same: true }; // đã đạt rồi
      if (K().consent.indexOf(st) >= 0) {
        if (!other.alive) return { ok: false };
        if (st === 'ket' && partnersOf(pl).filter(x => x.id !== other.id).length >= K().maxPartners) { say(pl, 'Bạn đã có đủ ' + K().maxPartners + ' đạo lữ, không thể kết thêm.', 'bad'); return { ok: false, refused: true, why: 'đủ' }; }
        if (!o.force && other.kind === 'npc' && !rng.P(bond.willing(other, pl, st))) {
          d.ref = (d.ref || 0) + 1;
          d.love = clamp(d.love - (10 + 5 * d.ref), 0, 100); d.trust = clamp(d.trust - 3, 0, 100);
          say(pl, other.name + ' ' + (st === 'to' ? 'lắc đầu trước lời bày tỏ của bạn' : st === 'hon' ? 'không muốn nhận lời hứa hẹn' : 'chưa sẵn lòng kết đạo lữ') + '. Mối quan hệ chùng xuống.', 'bad');
          if (d.love < 10 || d.ref >= 3) { bond.setType(pl, other, 'cu'); d.st = 'ran'; say(pl, 'Từ nay ' + other.name + ' chỉ còn là người cũ.', 'bad'); }
          return { ok: false, refused: true };
        }
      }
      if (!K().stageById[st]) return { ok: false };
      const cur = rankOf(d.st), nw = rankOf(st);
      if (nw <= LINE() && cur <= LINE() && nw < cur && !o.set) return { ok: true, same: true }; // không lùi trên đường chính
      if (st === 'ket') {
        TT.family.pair(pl, other); // sẽ gọi onPair
        return { ok: true };
      }
      d.st = st; d.since = now;
      if (st === 'to') { if (d.t === 'ban' || d.t === 'cu') bond.setType(pl, other, 'thuong'); say(pl, other.name + ' nhận lời tỏ tình của bạn. Hai người đã là của nhau trong lòng.', 'good'); d.askM = now + 2; }
      else if (st === 'hon') { bond.setType(pl, other, 'hon_uoc'); d.han = now + K().hon.han; say(pl, 'Bạn và ' + other.name + ' định ước hôn sự.', 'good'); }
      else if (st === 'men') { if (!d.t) d.t = 'ban'; }
      else if (st === 'ben') { /* ở bên nhau */ }
      else if (st === 'biet') { d.low = 0; }
      return { ok: true };
    },

    // Chia tay (hoặc hủy hôn ước): thành Người cũ, giai đoạn rạn nứt. Đạo lữ chính đi thì đạo lữ phụ lên thay.
    breakup(a, b, why) {
      const pl = plOf(a, b); if (!K().on || !pl) return false;
      a = ch(a); b = ch(b);
      const o = pl === a ? b : a, r = rel.get(pl, o); if (!r) return false;
      const d = bond.ensure(pl, o), wasMain = d.p === 'chinh';
      if (r.k === 'dao_lu') TT.family.unpair(pl, o, why);
      else say(pl, 'Bạn và ' + o.name + ' không còn gắn bó (' + why + ').', 'bad');
      bond.setType(pl, o, 'cu'); d.st = 'ran'; d.p = undefined; d.love = Math.min(d.love, 25); d.low = 0;
      if (wasMain) bond.promote(pl);
      return true;
    },
    // Người mất: giai đoạn vĩnh biệt, đạo tâm lay động; đạo lữ phụ lên thay nếu có.
    grieve(pl, o, d) {
      const wasMain = d.p === 'chinh';
      d.st = 'biet'; d.since = TT.world.months; d.p = undefined;
      if (d.t === 'dao_lu') {
        pl.daoTam = clamp(pl.daoTam - 5, 0, 100); pl.flags = pl.flags || {}; pl.flags.mat_dao_lu = 1;
        say(pl, 'Tin ' + o.name + ' đã mất khiến lòng bạn trống hoang. Đạo tâm bạn lay động, chỉ còn ký ức và những điều chưa kịp nói.', 'bad');
        if (wasMain) bond.promote(pl);
      }
    },
    promote(pl) {
      const ps = partnersOf(pl).filter(x => x.r.d);
      if (!ps.length || ps.some(x => x.r.d.p === 'chinh')) return;
      ps.sort((a, b) => b.r.d.love - a.r.d.love || a.id - b.id);
      ps.forEach((x, i) => { x.r.d.p = i === 0 ? 'chinh' : 'phu'; });
    },

    // Hôn ước do thế lực/gia tộc đặt (chỉ ép người chơi). by: 'tong' | 'toc'.
    betroth(pl, o, by) {
      if (!K().on || pl.kind !== 'player') return null;
      const d = bond.ensure(pl, o);
      bond.setType(pl, o, 'hon_uoc'); d.st = 'hon'; d.by = by; d.han = TT.world.months + K().hon.han; d.love = Math.max(d.love, 5); d.respect = Math.max(d.respect, 20);
      return d;
    },

    // Một buổi song tu giữa c và q (có người chơi): trả hệ số thưởng và quyền thụ thai; null nếu không thuộc hệ này.
    dual(c, q) {
      const pl = plOf(c, q); if (!K().on || !pl) return null;
      const d = bond.ensure(c, q), now = TT.world.months, y = Math.floor(now / 12), S = K().songTu, o = pl === ch(c) ? ch(q) : ch(c);
      if (!d.sy || d.sy.y !== y) d.sy = { y, n: 0, m: -1 };
      const cf = 1 + 0.25 * bond.compat(c, q) + 0.15 * d.love / 100;
      if (d.sy.m === now) return { mult: d.sy.last, cf, conceive: false, repeat: true, d }; // người kia song tu cùng tháng: không đếm hai lần
      if (o.kind === 'npc' && d.love < S.refuseLove && rng.P(S.refuseP)) {
        say(pl, o.name + ' từ chối song tu lần này (' + (bond.compat(c, q) < 0 ? 'hai người chưa hợp tính' : 'lòng chưa thuận') + ').', 'bad');
        d.sy.m = now; d.sy.last = 0;
        return { mult: 0, cf, conceive: false, refused: true, d };
      }
      const n = d.sy.n, mult = S.mult[Math.min(n, S.mult.length - 1)];
      d.sy.n++; d.sy.m = now; d.sy.last = mult;
      return { mult, cf, conceive: n < S.conceiveMax, n, d };
    },

    // ---------- mỗi tháng (người chơi) ----------
    tick(c) {
      if (!K().on || c.kind !== 'player') return;
      const w = TT.world, now = w.months;
      let nd = countD(c);
      rel.list(c).forEach(x => {
        const o = x.c, r = x.r; if (!o) return;
        let d = r.d;
        if (!d) { if (!isClose(r) || (nd >= K().maxClose && !r.k)) return; d = init(c, o, r); nd++; }
        if (!o.alive) { if (d.st !== 'biet' && (d.t === 'dao_lu' || d.t === 'hon_uoc' || d.t === 'thuong' || rankOf(d.st) >= K().rank.to && rankOf(d.st) <= LINE())) bond.grieve(c, o, d); return; }
        // mến nhau: cặp đủ khả năng nảy tình
        if ((d.t === 'ban' || d.t === 'cu') && (d.st === '' || d.st === 'gap') && TT.family.attract(c, o) > 0) {
          if (!d.st && d.love >= 10) d.st = 'gap';
          if (d.st === 'gap' && d.love >= 25) d.st = 'men';
        }
        if (d.st === 'ket' && now - d.since >= 6) d.st = 'ben';
        if (d.st === 'thu' && now - d.since >= 3) d.st = 'ben';
        // hôn ước hết hạn mà chưa thành thì tự hủy
        if (d.t === 'hon_uoc' && d.han && now > d.han && d.st === 'hon') { say(c, 'Hôn ước giữa bạn và ' + o.name + ' đã quá hạn, hai bên coi như không còn ràng buộc.', 'age'); bond.setType(c, o, 'cu'); d.st = 'ran'; d.han = 0; return; }
        // đã hứa hẹn: tới lúc làm lễ kết đạo lữ
        if (!w.pending && !c.travel && !c.cross && ((d.st === 'to' && d.t !== 'dao_lu') || (d.st === 'hon' && d.love >= K().hon.leLove)) && now >= (d.askM || 0) && now - d.since >= 2 && !(c.evCool && c.evCool.bond_ket > now)) {
          if (partnersOf(c).filter(y => y.id !== o.id).length < K().maxPartners) {
            d.askM = now + 12;
            TT.events.fire(c, D.eventById.bond_ket, { otherId: o.id });
          }
        }
      });
    },

    // ---------- mỗi năm (người chơi) ----------
    yearly(c) {
      if (!K().on || c.kind !== 'player') return;
      const w = TT.world, now = w.months, B = K();
      bond.partners(c).forEach(x => {
        const o = x.c, r = x.r, d = r.d || bond.ensure(c, o);
        const near = o.region === c.region && o.place === c.place && !o.travel && !o.cross;
        const cp = bond.compat(c, o);
        d.love = clamp(d.love + (near ? B.drift.near + (cp >= 0.35 ? 1 : 0) : B.drift.far), 0, 100);
        d.trust = clamp(d.trust + (near ? B.drift.trustNear : B.drift.trustFar), 0, 100);
        r.v = clamp(r.v + (near ? 0.2 : -0.1), -100, 100);
        // nỗi buồn tuổi thọ
        const g = bond.grief(c, o);
        if (g && rankOf(d.st) >= B.rank.ket && rankOf(d.st) <= LINE()) {
          d.nb = (d.nb || 0) + 1;
          if (d.nb === 1) say(c, 'Bạn và ' + o.name + ' cách nhau ' + g.gap + ' cảnh giới. Một người sẽ sống lâu hơn nhiều, và cả hai đều hiểu điều đó. Đó là nỗi buồn không ai nói thành lời.', 'age');
          if (d.nb % B.grief.every === 0 || d.nb === 1) { c.daoTam = clamp(c.daoTam - B.grief.daoTam, 0, 100); d.love = clamp(d.love - B.grief.love, 0, 100); }
        }
        // rạn nứt
        if (d.love < B.ran.love || d.trust < B.ran.trust) d.low = (d.low || 0) + 1; else d.low = 0;
        if (d.st === 'ran' && d.love >= 40 && d.trust >= 40) { d.st = 'ben'; d.since = now; say(c, 'Giận hờn dần nguôi: bạn và ' + o.name + ' lại ở bên nhau như trước.', 'good'); }
        // đạo lữ NPC tự chủ: có thể rời đi
        if (o.kind === 'npc') {
          const L = B.leave;
          let p = 0;
          if (d.love < L.love) p += L.pLove;
          if (d.trust < L.trust) p += L.pTrust;
          if (cp < -0.4) p += L.pCompat;
          if (p > 0) {
            p += L.pExtra * Math.max(0, partnersOf(c).length - 1);
            if (d.st === 'ran') p *= 2;
            if (rng.P(Math.min(L.max, p))) { say(c, o.name + ' quyết định rời đi: "Chúng ta đi tới đây thôi."', 'bad'); TT.news(o.name + ' rời đạo lữ ' + c.name + '.', 'bad', [c.id, o.id]); bond.breakup(c, o, o.name + ' không còn muốn ở lại'); return; }
          }
        }
        if (d.low >= B.ran.years && !w.pending) {
          d.low = 0; d.st = 'ran'; d.since = now;
          TT.events.fire(c, D.eventById.bond_ran, { otherId: o.id });
        } else if (d.p === 'chinh' && near && d.st === 'ben' && !w.pending && rng.P(B.thuThach.p)) {
          d.st = 'thu'; d.since = now;
          TT.events.fire(c, D.eventById.bond_thu_thach, { otherId: o.id, v: rng.pick(['nan', 'nha', 'duong']) });
        }
      });
      bond.promote(c);
      // hôn ước: người kia tự tìm tới, ở gần thì Tình nảy dần (R 5.4: chuyện cảm động cũng bắt đầu từ đây)
      rel.list(c).forEach(x => {
        const d = x.r.d, o = x.c;
        if (!d || d.t !== 'hon_uoc' || d.st !== 'hon' || !o || !o.alive) return;
        const near = o.region === c.region && o.place === c.place && !o.travel && !o.cross;
        d.love = clamp(d.love + (near ? B.hon.near : B.hon.far), 0, 100); d.trust = clamp(d.trust + (near ? 4 : 0), 0, 100);
        if (!near && o.kind === 'npc' && o.region === c.region && !o.travel && !o.cross && c.place && rng.P(B.hon.seek)) TT.map.startTravel(o, c.place);
      });
      // hôn ước do thế lực/gia tộc ép (chỉ ép người chơi, luôn có nhánh từ chối)
      const age = TT.age(c), H = B.hon;
      if (!w.pending && age >= H.minAge && age <= H.maxAge && !partnersOf(c).length && !rel.list(c).some(x => x.r.d && x.r.d.t === 'hon_uoc' && x.r.d.st === 'hon') && rng.P(H.p)) {
        const by = c.sect ? 'tong' : (c.parents || []).some(i => { const q = w.chars[i]; return q && q.alive; }) ? 'toc' : null;
        if (!by) return;
        const cand = Object.keys(w.chars).map(k => w.chars[k]).filter(o => o.kind === 'npc' && o.alive && o.tier === 'core' && o.region === c.region && TT.age(o) >= H.minAge && Math.abs(o.realm - c.realm) <= 2 && !partnersOf(o).length && TT.family.eligible(c, o));
        if (!cand.length) return;
        cand.sort((a, b) => Math.abs(TT.age(a) - age) - Math.abs(TT.age(b) - age) || a.id - b.id);
        const o = rng.pick(cand.slice(0, 3));
        TT.events.fire(c, D.eventById.bond_hon_uoc, { otherId: o.id, by });
      }
    }
  };
})();
