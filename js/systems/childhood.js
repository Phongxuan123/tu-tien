// Tuổi thơ ba hồi của người chơi (Z "Đặc tả tuổi thơ", 8A3): bốc danh sách sự kiện bằng băm (không gọi TT.rng), áp lựa chọn
// (dịch trục qua TT.nature.shift, hiệu ứng chỉ số kẹp theo D.CHILDHOOD.cap cộng dồn trong c.childFx), tự chọn theo độ hợp tính cách.
// Hộp giao diện nằm ở js/ui/childhood.js; hộp chỉ là giao diện, không dùng w.pending. Công tắc D.CHILDHOOD.on.
// Dữ liệu người chơi: c.child = { steps, i, nat0, gold0, ban, done }, c.childFx (cộng dồn đã áp), c.childLog (tóm tắt từng bước).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data;
  const C = () => D.CHILDHOOD;
  const on = c => !!(c && c.kind === 'player' && C() && C().on);
  const HOI = { 1: '0 đến 3 tuổi', 2: '4 đến 7 tuổi', 3: '8 đến 11 tuổi' };
  const FXN = { atk: 'Công', nl: 'Linh lực', hp: 'Sinh lực', gold: 'Vàng', luck: 'May mắn', daoTam: 'Đạo tâm', tuchat: 'Tư chất', kv: 'Khí vận', bad: 'Tật' };

  // Băm chuỗi (FNV-1a) và bộ số giả ngẫu nhiên riêng (mulberry32): hoàn toàn tách khỏi TT.rng.
  function hash(str) { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function mk(seed) {
    let a = seed | 0;
    return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const evById = id => C().ev.find(e => e.id === id);
  // Sự kiện theo xuất thân (9A): không có origin là sự kiện chung; có origin thì chỉ bốc khi trùng c.origin2 (không có xuất thân v2 thì không bốc), trọng số ×2.
  const mine = (e, c) => !e.origin || (!!c.origin2 && e.origin.indexOf(c.origin2) >= 0);
  const wOf = e => (e.origin ? e.w * 2 : e.w);
  const sgn = v => (v < 0 ? -1 : 1);

  // Bạn thuở nhỏ (TT.social.childhood): NPC còn sống (không phải cha mẹ, 9A) có thiện cảm ≥ 20 với người chơi; chọn theo băm, đọc thuần.
  function friends(c) {
    const w = TT.world; if (!w || !c.relIds) return [];
    return Object.keys(c.relIds).map(Number).sort((a, b) => a - b).filter(id => { const o = w.chars[id]; return o && o.kind === 'npc' && o.alive && (c.parents || []).indexOf(id) < 0 && TT.rel.v(c, o) >= 20; });
  }

  const ch = TT.childhood = {
    HOI, FXN,
    on,
    // Danh sách sự kiện ba hồi: [{ hoi, evs: [{ id, ban }] }]. Đọc thuần, không gọi rng, không ghi dữ liệu.
    // Sự kiện 1 luôn có; sự kiện 2 với xác suất p2; sự kiện 3 (khi đã có 2) với xác suất p3. Không lặp trong một đời.
    plan(c) {
      const K = C(), seed = (TT.world && TT.world.seed != null ? TT.world.seed : 0) + ':' + c.id + ':' + c.birthMonth + ':' + c.name;
      const r = mk(hash(seed + ':childhood')), fr = friends(c), used = {}, out = [];
      const ban = fr.length ? fr[Math.floor(r() * fr.length)] : 0;
      [1, 2, 3].forEach(hoi => {
        const u2 = r(), u3 = r(); // luôn rút đủ hai số để các hồi sau không lệch
        const n = 1 + (u2 < K.p2 ? 1 + (u3 < K.p3 ? 1 : 0) : 0), evs = [];
        for (let k = 0; k < n; k++) {
          const cand = K.ev.filter(e => e.hoi === hoi && !used[e.id] && (!e.needBan || ban) && mine(e, c));
          if (!cand.length) break;
          const tot = cand.reduce((a, e) => a + wOf(e), 0); let x = r() * tot, pick = cand[cand.length - 1];
          for (const e of cand) { x -= wOf(e); if (x < 0) { pick = e; break; } }
          used[pick.id] = 1; evs.push({ id: pick.id, ban: pick.needBan ? ban : 0 });
        }
        out.push({ hoi, evs });
      });
      return out;
    },

    // Chữ của sự kiện (khe {ban} thay bằng tên bạn thuở nhỏ).
    text(ev, banId) {
      const o = banId && TT.world.chars[banId];
      return ev.d.replace(/\{ban\}/g, o ? o.name : 'người bạn');
    },

    // Bắt đầu tuổi thơ: lưu danh sách bước. Trả về c.child (hoặc null khi tắt / đã bắt đầu).
    begin(c) {
      if (!on(c) || c.child) return c.child || null;
      const steps = []; ch.plan(c).forEach(h => h.evs.forEach(e => steps.push({ hoi: h.hoi, id: e.id, ban: e.ban })));
      c.child = { steps, i: 0, nat0: Object.assign({}, TT.nature.get(c)), gold0: c.gold, done: false };
      c.childFx = {}; c.childLog = [];
      return c.child;
    },
    // Bước hiện tại { hoi, ev, ban } hoặc null khi hết.
    current(c) {
      const k = c.child; if (!k || k.done || k.i >= k.steps.length) return null;
      const s = k.steps[k.i]; return { hoi: s.hoi, ev: evById(s.id), ban: s.ban, i: k.i, n: k.steps.length };
    },
    pending: c => !!(c && c.child && !c.child.done),

    // Hợp tính cách của lựa chọn (chấm "hợp tính" ở hộp: > 1 là hợp) và lựa chọn máy chọn (hợp nhất, hòa thì lựa chọn đầu).
    fit(c, choice) { return TT.nature.affinity(c, choice); },
    pick(c, ev) {
      let best = 0, bv = -Infinity;
      ev.ch.forEach((x, i) => { const a = ch.fit(c, x); if (a > bv + 1e-9) { bv = a; best = i; } });
      return best;
    },

    // Áp hiệu ứng chỉ số: cộng dồn c.childFx, kẹp theo D.CHILDHOOD.cap; trả về mức thật đã áp.
    fx(c, key, d, ban) {
      const K = C().cap, fx = c.childFx = c.childFx || {}, k = c.child;
      if (key === 'wake') return 0; // chờ 8C
      if (key === 'ban') {
        const o = ban && TT.world.chars[ban]; if (!o) return 0;
        const r = TT.rel.ensure(c, o), v = Math.max(-100, Math.min(100, r.v + d)); const got = v - r.v; r.v = v; fx.ban = (fx.ban || 0) + got; return got;
      }
      if (key === 'bad') {
        if ((fx.bad || 0) >= K.bad || !D.traitById[d] || c.traitIds.indexOf(d) >= 0) return 0;
        c.traitIds.push(d); fx.bad = (fx.bad || 0) + 1; fx.badId = d; return 1;
      }
      const cur = fx[key] || 0; let lo = -(K[key] != null ? K[key] : 0), hi = K[key] != null ? K[key] : 0;
      if (key === 'gold') { lo = -(k ? k.gold0 : c.gold); hi = k ? k.gold0 : c.gold; }
      if (key === 'tuchat') lo = 0;
      let got = Math.max(lo, Math.min(hi, cur + d)) - cur;
      if (key === 'gold') got = Math.max(got, -c.gold); // vàng không âm
      if (key === 'daoTam') got = Math.max(0, Math.min(100, c.daoTam + got)) - c.daoTam;
      if (!got) return 0;
      fx[key] = cur + got;
      if (key === 'atk') c.baseAtk += got;
      else if (key === 'nl') c.baseNl += got;
      else if (key === 'hp') c.trainHp += got;
      else if (key === 'gold') c.gold += got;
      else if (key === 'luck') c.baseLuck += got;
      else if (key === 'daoTam') c.daoTam += got;
      else if (key === 'tuchat') { const a = c.tuchat.attrs.slice().sort((x, y) => y.p - x.p)[0]; a.p += got; c.tuchat.total += got; }
      else if (key === 'kv') {
        if (TT.kv.ensure(c)) { if (got > 0) TT.kv.add(c, got, 'tuổi thơ'); else { c.kvPts = Math.max(0, c.kvPts + got); TT.kv.note(c, got, 'tuổi thơ'); } } else c.baseKv += got;
      }
      return got;
    },

    // Áp một lựa chọn của sự kiện hiện tại (choice: chỉ số, key hoặc đối tượng). Trả về { choice, r, fx } và nhích sang bước kế.
    apply(c, ev, choice, ban) {
      if (!on(c)) return null;
      const ci = typeof choice === 'number' ? choice : typeof choice === 'string' ? ev.ch.findIndex(x => x.key === choice) : ev.ch.indexOf(choice);
      const x = ev.ch[ci >= 0 ? ci : 0];
      Object.keys(x.ax || {}).forEach(a => TT.nature.shift(c, a, x.ax[a], 'tuổi thơ', 'free'));
      const got = {};
      Object.keys(x.fx || {}).forEach(k => { const g = ch.fx(c, k, x.fx[k], ban); if (g) got[k] = g; });
      c.childLog = c.childLog || [];
      c.childLog.push({ hoi: ev.hoi, id: ev.id, t: ev.t, label: x.label, r: x.r, fx: got });
      if (c.child && !c.child.done) c.child.i++;
      c.hp = TT.stats.hpMax(c);
      return { choice: x, r: x.r, fx: got };
    },

    // Kết thúc: ghi nhật ký tóm tắt (một dòng mỗi hồi và một dòng chỉ số).
    finish(c) {
      if (!c.child || c.child.done) return;
      c.child.done = true;
      [1, 2, 3].forEach(h => {
        const l = (c.childLog || []).filter(e => e.hoi === h);
        if (l.length) TT.log(c, 'Tuổi thơ (' + HOI[h] + '): ' + l.map(e => e.t + ' — ' + e.label).join('; ') + '.', 'age');
      });
      const s = ch.summary(c);
      if (s.stats.length) TT.log(c, 'Tuổi thơ để lại: ' + s.stats.map(x => x.n + ' ' + (x.v > 0 ? '+' : '') + x.v).join(', ') + '.', 'age');
      if (s.nature.length) TT.log(c, 'Tính cách sau tuổi thơ: ' + TT.nature.summary(c) + '.', 'age');
      c.hp = TT.stats.hpMax(c);
    },
    // Chạy hết tuổi thơ: chọn theo độ hợp tính cách, không hộp (chế độ Tự động và kiểm thử).
    auto(c) {
      if (!on(c)) return null;
      if (!c.child) ch.begin(c);
      let s, guard = 0;
      while (!c.child.done && (s = ch.current(c)) && guard++ < 20) ch.apply(c, s.ev, ch.pick(c, s.ev), s.ban);
      ch.finish(c);
      return ch.summary(c);
    },

    // Tổng kết (đọc thuần): đổi tính cách, chỉ số nhận được, tóm tắt từng hồi.
    summary(c) {
      const k = c.child || {}, now = TT.nature.get(c), n0 = k.nat0 || now, fx = c.childFx || {}, lg = c.childLog || [];
      const nature = TT.nature.IDS.map(a => ({ id: a, from: n0[a], to: now[a], d: Math.round((now[a] - n0[a]) * 100) / 100 })).filter(x => x.d);
      const stats = Object.keys(FXN).filter(key => fx[key]).map(key => ({ k: key, n: FXN[key], v: key === 'bad' ? 1 : fx[key], bad: key === 'bad' ? D.traitById[fx.badId] : null }));
      const hoi = [1, 2, 3].map(h => ({ hoi: h, age: HOI[h], lines: lg.filter(e => e.hoi === h) }));
      return { nature, stats, hoi, ban: fx.ban || 0 };
    }
  };
})();
