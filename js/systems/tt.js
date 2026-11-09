// Tiên thiên làm mới của người chơi (Q-tien-thien.md): bốc lúc sinh bằng băm (không gọi TT.rng), ẩn và thức tỉnh, hiệu ứng số, bộ luật truyện
// (mục 4), tiên thiên hiển thị của người trong dàn (mục 7), chuyển bản lưu cũ (mục 9). Công tắc D.TIEN_THIEN_RULES.on: tắt thì người chơi dùng
// c.traitIds cũ như trước. NPC luôn giữ traitIds.
// Dữ liệu người chơi (khởi tạo ở createChar, hoặc migrate cho bản lưu cũ/người kế thừa): c.tt = [ { id, an (1: còn ẩn), thuc_tinh_luc (tháng thức tỉnh, null khi ẩn), used?, tc? } ].
// Hàm ĐỌC (list, has, owns, luat, mul, mod, hieu_ung, ids, vai, vaiName, danLife) không gọi rng và không ghi dữ liệu.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data;
  const R = () => D.TIEN_THIEN_RULES;
  const PHAM = ['Thường', 'Hiếm', 'Quý', 'Thiên'], MAU = ['trắng', 'xanh', 'vàng', 'đỏ'];
  const NHOM_N = { the: 'Thể', cot: 'Cốt', dong: 'Đồng', huyet: 'Huyết', menh: 'Mệnh', tam: 'Tâm', tai: 'Tài', duyen: 'Duyên', di: 'Dị', tat: 'Tật' };
  // Luật ngoài dữ liệu (mục 3, 3b có nêu nhưng tienthien.js chỉ ghi chữ), và lời nguyền có số.
  const EXTRA = { mat_tinh: { tim: 1.15 }, kiem_cot: { chien: 1.08 }, kiem_tam_bam_sinh: { chien: 1.05 }, mui_thinh_thao_duoc: {} };
  const NGUYEN_M = { chi_am_chi_duong_the: { life: -0.15 }, thong_linh: { life: -0.10 }, thien_cong: { train: -0.15 } };
  const WHEEL = { phuc_duyen: 3, thien_menh_chi_tu: 6 };
  const KIEP = [
    'Bạn thấy một người áo trắng quỳ trước tế đàn, tay run run nâng một thanh kiếm gãy.',
    'Bạn nghe tiếng chuông của một ngôi chùa không còn trên đời, và tên bạn được gọi bằng một cái tên khác.',
    'Bạn thấy mình cầm một chiếc ấn đỏ giữa trận tuyết, và có người gọi bạn là sư huynh.',
    'Bạn nhớ mùi thuốc sắc trong một căn phòng đóng kín, và một lời hứa chưa kịp nói với ai.',
    'Bạn thấy một con thuyền nhỏ rời bến trong sương, người trên thuyền quay lại nhìn bạn rất lâu.',
    'Bạn nhớ một đêm lửa cháy khắp núi, và tiếng một người gọi tên bạn rồi im bặt.'
  ];
  const VAI_NHAN = { than_nhan: ['người nhà'], ban: ['bạn thuở nhỏ'], su: ['sư phụ'], doi_thu: ['đối thủ'], huynh: ['người đi đường', 'thương hội', 'thầy thuốc', 'thợ săn'], thuong: ['người thương'], ke_thu: ['kẻ thù'], ke_thua: ['sư phụ', 'người đi đường'] };

  function hash(str) { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function mk(seed) {
    let a = seed | 0;
    return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const worldSeed = () => (TT.world && TT.world.seed != null ? TT.world.seed : 0);
  const def = id => D.tienThienById && D.tienThienById[id];
  const on = c => !!(c && c.kind === 'player' && R() && R().on);
  const act = c => on(c) && Array.isArray(c.tt);
  const luatOf = e => Object.assign({}, (def(e.id) || {}).luat || {}, EXTRA[e.id] || {});
  const lower = t => t.charAt(0).toLowerCase() + t.slice(1);

  // Chọn theo trọng số với bộ số r (mulberry32): items = [{ w, v }].
  function wpick(r, items) {
    const tot = items.reduce((a, x) => a + x.w, 0); let x = r() * tot;
    for (const it of items) { x -= it.w; if (x < 0) return it.v; }
    return items.length ? items[items.length - 1].v : null;
  }

  const tt = TT.tt = {
    on, active: act, PHAM, MAU, NHOM_N, hash, mk,
    name: id => (def(id) || { n: id }).n,
    phamName: id => PHAM[(def(id) || { p: 0 }).p],

    // ---------- đọc thuần ----------
    list: c => (act(c) ? c.tt : []),
    owns: (c, id) => act(c) && c.tt.some(e => e.id === id),            // có (kể cả còn ẩn)
    has: (c, id) => act(c) && c.tt.some(e => e.id === id && !e.an),     // có và đã thức tỉnh
    hidden: c => (act(c) ? c.tt.filter(e => e.an) : []),
    // Luật truyện/mô phỏng đã thức tỉnh: số (tích các hệ số) | true | false.
    luat(c, k) {
      if (!act(c)) return false;
      let num = null, bool = false;
      c.tt.forEach(e => {
        if (e.an) return;
        const v = luatOf(e)[k]; if (v === undefined || v === false) return;
        if (typeof v === 'number') num = num == null ? v : num * v; else bool = true;
      });
      return num != null ? num : (bool ? true : false);
    },
    mul(c, k) { const v = tt.luat(c, k); return typeof v === 'number' ? v : 1; },
    // Hiệu chỉnh số khóa k (hpMax, atk, nl, kv, luck, gold, train, brk, life) của tiên thiên đã thức tỉnh (kể cả lời nguyền có số).
    mod(c, k) {
      if (!act(c)) return 0;
      let s = 0;
      c.tt.forEach(e => { if (!e.an) { const t = def(e.id); s += ((t && t.m && t.m[k]) || 0) + ((NGUYEN_M[e.id] || {})[k] || 0); } });
      if (k === 'train') s = Math.min(s, 0.5); // phẩm Thiên không đẩy tốc độ tu vượt +50%
      return s;
    },
    hieu_ung(c) {
      const o = {}; ['hpMax', 'atk', 'nl', 'kv', 'luck', 'gold', 'train', 'brk', 'life'].forEach(k => { const v = tt.mod(c, k); if (v) o[k] = v; });
      return o;
    },
    wheelBonus(c) { let s = 0; if (act(c)) c.tt.forEach(e => { if (!e.an && WHEEL[e.id]) s += WHEEL[e.id]; }); return s; },
    // Id kiểu cũ (D.traitById) mà các hệ cũ đọc: người chơi mới → tiên thiên đã thức tỉnh trùng id cũ (tam_ma, da_benh...); còn lại c.traitIds.
    ids: c => (act(c) ? c.tt.filter(e => !e.an && D.traitById[e.id]).map(e => e.id) : ((c && c.traitIds) || [])),
    hasOld: (c, id) => tt.ids(c).indexOf(id) >= 0,
    lines(c) { // chữ nhật ký lúc sinh
      const l = tt.list(c).filter(e => !e.an).map(e => def(e.id).n);
      const h = tt.hidden(c).length;
      return (l.length ? l.join(', ') : 'chưa rõ') + (h ? ' (còn ' + h + ' điều bạn chưa hiểu về chính mình)' : '');
    },
    // Thọ nguyên của người trong dàn ngắn đi 20% khi người chơi mang Mệnh cô tinh (luật `co`).
    danLife(c) {
      if (!c || c.kind !== 'npc' || !TT.player) return 1;
      const p = TT.player(); if (!p || !act(p) || !p.story || !p.story.dan) return 1;
      if (!tt.luat(p, 'co')) return 1;
      const d = p.story.dan; return Object.keys(d).some(v => d[v] === c.id) ? 0.8 : 1;
    },
    // Tiên thiên hiển thị của người ở vai trong dàn (mục 7): đọc thuần, bốc bằng băm theo (người chơi, người ấy, vai).
    vai(c, vai, npc) {
      if (!act(c)) return null;
      const o = npc || (TT.dan && TT.dan.get(c, vai)); if (!o) return null;
      const labels = VAI_NHAN[vai] || [], r = mk(hash(worldSeed() + ':' + c.id + ':' + c.birthMonth + ':' + o.id + ':' + vai + ':ttv'));
      const pool = D.TIEN_THIEN.map(t => ({ w: (t.vai || []).some(x => labels.indexOf(x) >= 0) ? 4 * (t.p >= 2 ? 0.25 : 1) : (t.p >= 2 ? 0.1 : 1) * (t.o === 'tat' ? 0.3 : 1), v: t }));
      return wpick(r, pool);
    },
    vaiName(c, vai, npc) { const t = tt.vai(c, vai, npc); return t ? t.n : ''; },
    // Khe {tt_vai}: tiên thiên (viết thường) của người đầu tiên ở vai trong tuyến.
    slotVai(c, st) {
      if (!act(c) || !st || !st.vai) return '';
      const ks = Object.keys(st.vai);
      for (const k of ks) {
        const o = TT.world.chars[st.vai[k]]; if (!o) continue;
        const dv = TT.dan && c.story && c.story.dan ? Object.keys(c.story.dan).find(v => c.story.dan[v] === o.id) : null;
        const t = tt.vai(c, dv || 'huynh', o); if (t) return lower(t.n);
      }
      return '';
    },

    // ---------- bốc lúc sinh (mục 6): băm, không gọi rng ----------
    roll(c, salt) {
      const Rr = R(), r = mk(hash(worldSeed() + ':' + c.id + ':' + (salt || 0) + ':tt')), now = TT.world ? TT.world.months : 0;
      const tags = c.origin2 ? [c.origin2] : [];
      const wThe = t => ((t.the || []).some(x => tags.indexOf(x) >= 0) ? Rr.trongSoThe : 1);
      const chuan = D.TIEN_THIEN.filter(t => t.o !== 'tat'), tat = D.TIEN_THIEN.filter(t => t.o === 'tat');
      const n = wpick(r, Object.keys(Rr.soChuan).map(k => ({ w: Rr.soChuan[k], v: +k })));
      const used = {}, out = []; let qt = 0, giam = false;
      const mkE = t => { const hid = r() < (t.an || 0); return { id: t.id, an: hid ? 1 : 0, thuc_tinh_luc: hid ? null : now }; };
      for (let i = 0; i < n; i++) {
        const rate = p => Rr.phamTiLe[p] * (giam && Rr.giamMotNua.indexOf(p) >= 0 ? 0.5 : 1) * (p >= 2 && qt >= Rr.tranQuyThien ? 0 : 1);
        const pool = p => chuan.filter(t => t.p === p && !used[t.o]);
        let p = wpick(r, [0, 1, 2, 3].map(x => ({ w: rate(x), v: x })));
        let cand = pool(p);
        if (!cand.length) { // phẩm ấy hết nhóm trống: lùi về phẩm còn nhóm trống, ưu tiên phẩm thấp hơn
          for (const q of [p - 1, p - 2, p - 3, p + 1].filter(x => x >= 0 && x <= 3)) { if ((q < 2 || rate(q) > 0) && pool(q).length) { p = q; cand = pool(q); break; } }
          if (!cand.length) break;
        }
        const t = wpick(r, cand.map(x => ({ w: wThe(x), v: x })));
        used[t.o] = 1; if (t.p >= 2) { qt++; giam = true; }
        out.push(mkE(t));
      }
      const nt = wpick(r, Object.keys(Rr.soTat).map(k => ({ w: Rr.soTat[k], v: +k })));
      const tp = tat.slice();
      for (let i = 0; i < nt && tp.length; i++) {
        const t = wpick(r, tp.map(x => ({ w: wThe(x), v: x }))); tp.splice(tp.indexOf(t), 1);
        out.push({ id: t.id, an: 0, thuc_tinh_luc: now });
      }
      c.tt = out;
      out.forEach(e => { if (!e.an) tt.applyWake(c, e, true); });
      return out;
    },

    // ---------- chuyển bản lưu cũ (mục 9) ----------
    migrate(c) {
      if (!c || c.kind !== 'player' || !R() || !R().on || Array.isArray(c.tt)) return false;
      const map = R().chuyenBanCu; c.tt = [];
      (c.traitIds || []).forEach(id => { const n = map[id]; if (n && def(n) && !c.tt.some(x => x.id === n)) c.tt.push({ id: n, an: 0, thuc_tinh_luc: TT.world ? TT.world.months : 0 }); });
      return true;
    },
    migrateAll() { if (TT.world) Object.keys(TT.world.chars).forEach(k => tt.migrate(TT.world.chars[k])); },
    old2new: id => (R().chuyenBanCu || {})[id] || '',

    // ---------- ghi: thức tỉnh, thêm, mất ----------
    // Hiệu ứng một lần khi thức tỉnh (silent: lúc sinh, không ghi nhật ký).
    applyWake(c, e, silent) {
      if (e.id === 'dao_tam_vung') c.daoTam = Math.min(100, c.daoTam + 10);
      if (e.id === 'ngu_hanh_linh_the' && !e.tc && c.tuchat && c.tuchat.attrs.length) {
        const a = c.tuchat.attrs.slice().sort((x, y) => y.p - x.p)[0]; a.p += 15; c.tuchat.total += 15; e.tc = 15; e.tcN = a.n;
      }
      if (c.hp != null && TT.stats) c.hp = Math.min(TT.stats.hpMax(c), Math.max(c.hp, 1));
    },
    undoWake(c, e) {
      if (e.id === 'ngu_hanh_linh_the' && e.tc) { const a = c.tuchat.attrs.find(x => x.n === e.tcN) || c.tuchat.attrs[0]; const d = Math.min(e.tc, a.p - 1); a.p -= d; c.tuchat.total -= d; e.tc = 0; }
      if (e.id === 'dao_tam_vung') c.daoTam = Math.max(0, c.daoTam - 10);
    },
    // Thức tỉnh một tiên thiên ẩn: id chỉ định, hoặc cái mạnh nhất (phẩm cao nhất, hòa thì thứ tự bốc). Trả mục hoặc null.
    wakeOne(c, why, id) {
      if (!act(c)) return null;
      const hid = c.tt.filter(e => e.an && (!id || e.id === id)); if (!hid.length) return null;
      const e = hid.slice().sort((a, b) => def(b.id).p - def(a.id).p)[0];
      e.an = 0; e.thuc_tinh_luc = TT.world.months; tt.applyWake(c, e, false);
      const t = def(e.id);
      TT.log(c, 'Tiên thiên thức tỉnh' + (why ? ' (' + why + ')' : '') + ': «' + t.n + '» (phẩm ' + PHAM[t.p].toLowerCase() + '). ' + t.d + (t.nguyen ? ' Lời nguyền: ' + t.nguyen : ''), 'big');
      if (TT.report && TT.report.mark) TT.report.mark(c, 'tt', 'Tiên thiên thức tỉnh: ' + t.n);
      return e;
    },
    // Mỗi tiên thiên ẩn thức tỉnh với xác suất p (băm theo tháng + nhãn, không gọi rng). Trả số cái đã thức tỉnh.
    wakeRoll(c, p, tag) {
      if (!act(c)) return 0;
      let n = 0; const m = TT.world.months;
      c.tt.filter(e => e.an).forEach(e => { if (mk(hash(worldSeed() + ':' + c.id + ':' + m + ':' + tag + ':' + e.id))() < p && tt.wakeOne(c, tag, e.id)) n++; });
      return n;
    },
    // Đột phá thành công (mục 5): 50% thức tỉnh một tiên thiên; luật `thien_do` làm một người trong dàn gặp họa.
    onBreak(c) {
      if (!act(c)) return;
      if (tt.hidden(c).length && mk(hash(worldSeed() + ':' + c.id + ':' + TT.world.months + ':brk'))() < (R().cuaThucTinh.dotPha || 0.5)) tt.wakeOne(c, 'đột phá');
      if (tt.luat(c, 'thien_do')) tt.hoa(c, 'thiên đố anh tài');
    },
    // Họa lên một người trong dàn (không chết): thương, bệnh hoặc mất của; bốc bằng băm.
    hoa(c, why) {
      const ppl = TT.dan && TT.dan.on(c) ? TT.dan.people(c) : []; if (!ppl.length) return null;
      const r = mk(hash(worldSeed() + ':' + c.id + ':' + TT.world.months + ':hoa:' + why)), o = ppl[Math.floor(r() * ppl.length) % ppl.length], k = Math.floor(r() * 3);
      if (k === 0) { o.hp = Math.max(1, Math.round((o.hp || 50) * 0.6)); TT.log(c, o.name + ' bỗng bị thương nặng, người ta nói đó là cái giá của vận may bạn (' + why + ').', 'bad'); }
      else if (k === 1) { o.hp = Math.max(1, Math.round((o.hp || 50) * 0.75)); TT.log(c, o.name + ' đổ bệnh sau mỗi bước tiến của bạn (' + why + ').', 'bad'); }
      else { o.gold = Math.max(0, Math.round((o.gold || 0) * 0.6)); TT.log(c, o.name + ' mất đi một phần của cải ngay khi bạn đắc ý (' + why + ').', 'bad'); }
      return o;
    },
    // Mỗi tháng (gọi từ dan.tick): hết năm thì `hut_van` làm xui nhỏ một người trong dàn.
    yearly(c) {
      if (!act(c) || TT.world.months % 12 !== 0 || !tt.luat(c, 'hut_van')) return;
      if (mk(hash(worldSeed() + ':' + c.id + ':' + TT.world.months + ':hutvan'))() < 0.35) tt.hoa(c, 'hút vận');
    },
    // Thêm một tiên thiên (đã thức tỉnh) nếu nhóm còn trống. Trả mục hoặc null.
    add(c, id, why) {
      const t = def(id); if (!act(c) || !t || c.tt.some(e => e.id === id)) return null;
      if (t.o !== 'tat') {
        if (c.tt.some(e => def(e.id).o === t.o)) return null;
        if (t.p >= 2 && c.tt.filter(e => def(e.id).p >= 2 && def(e.id).o !== 'tat').length >= R().tranQuyThien) return null;
      }
      const e = { id, an: 0, thuc_tinh_luc: TT.world.months }; c.tt.push(e); tt.applyWake(c, e, false);
      if (why) TT.log(c, 'Tiên thiên «' + t.n + '» (' + PHAM[t.p].toLowerCase() + ') ' + why + '.', 'good');
      return e;
    },
    // Kỳ ngộ "tiên thiên tốt": chọn ngẫu nhiên (gọi rng) trong phẩm ≤ maxP, nhóm còn trống, không tật. Trả tiên thiên hoặc null.
    addRandom(c, maxP) {
      if (!act(c) || c.tt.filter(e => def(e.id).o !== 'tat').length >= 3) return null;
      const used = {}; c.tt.forEach(e => { used[def(e.id).o] = 1; });
      const q = c.tt.filter(e => def(e.id).p >= 2 && def(e.id).o !== 'tat').length >= R().tranQuyThien;
      const pool = D.TIEN_THIEN.filter(t => t.o !== 'tat' && !used[t.o] && t.p <= maxP && !(t.p >= 2 && q));
      if (!pool.length) return null;
      const t = TT.rng.pick(pool); tt.add(c, t.id); return t;
    },
    // Cầu nối cho mã cũ dùng id tật kiểu cũ (D.traitById): bỏ / thêm một tiên thiên theo id cũ, đúng bộ đang dùng của người chơi.
    dropOld(c, id) {
      if (!act(c)) { c.traitIds = (c.traitIds || []).filter(t => t !== id); return true; }
      const i = c.tt.findIndex(e => e.id === id || e.id === tt.old2new(id)); if (i < 0) return false;
      tt.undoWake(c, c.tt[i]); c.tt.splice(i, 1); return true;
    },
    addOld(c, id) {
      if (!act(c)) { if ((c.traitIds || []).indexOf(id) >= 0) return false; c.traitIds.push(id); return true; }
      const n = tt.old2new(id); return !!(n && tt.add(c, n));
    },
    // Dữ liệu để vẽ Hồ sơ/Đời mới (đọc thuần): groups (chỉ nhóm có tiên thiên đã lộ, theo thứ tự 9 nhóm), tat (hàng tật), hidden (ô ??? kèm dấu hiệu).
    view(c) {
      const o = { groups: [], tat: [], hidden: [] }; if (!act(c)) return o;
      const card = e => { const t = def(e.id); return { id: t.id, n: t.n, p: t.p, pham: PHAM[t.p], mau: MAU[t.p], d: t.d, nguyen: t.nguyen || '', o: t.o }; };
      R().nhom.forEach(g => { const l = c.tt.filter(e => !e.an && def(e.id).o === g).map(card); if (l.length) o.groups.push({ o: g, n: NHOM_N[g], items: l }); });
      o.tat = c.tt.filter(e => !e.an && def(e.id).o === 'tat').map(card);
      o.hidden = c.tt.filter(e => e.an).map(e => ({ id: e.id, dau: def(e.id).dau || 'Có điều gì đó trong người bạn chưa lộ ra.' }));
      return o;
    },
    chipHtml(x, esc) { return '<span class="chip q' + x.p + (x.o === 'tat' ? ' bad' : '') + '" title="' + esc(x.d + ' (phẩm ' + x.pham.toLowerCase() + ', ' + x.mau + ')' + (x.nguyen ? ' Lời nguyền: ' + x.nguyen : '')) + '">' + esc(x.n) + '</span>'; },
    hasBad: c => act(c) && c.tt.some(e => def(e.id).o === 'tat'),
    removeBad(c) {
      if (!act(c)) return null;
      const bad = c.tt.filter(e => def(e.id).o === 'tat'); if (!bad.length) return null;
      const e = TT.rng.pick(bad); c.tt.splice(c.tt.indexOf(e), 1); return def(e.id);
    },
    // Mất tiên thiên (fx.tt_mat, Nghịch Thiên): id chỉ định hoặc cái phẩm cao nhất đã thức tỉnh (không tính tật). Trả tiên thiên hoặc null.
    lose(c, id, why) {
      if (!act(c)) return null;
      let e;
      if (id) e = c.tt.find(x => x.id === id);
      else e = c.tt.filter(x => def(x.id).o !== 'tat' && !x.an).sort((a, b) => def(b.id).p - def(a.id).p)[0] || c.tt.filter(x => def(x.id).o !== 'tat')[0];
      if (!e) return null;
      tt.undoWake(c, e); c.tt.splice(c.tt.indexOf(e), 1);
      const t = def(e.id);
      if (why) TT.log(c, 'Bạn mất tiên thiên «' + t.n + '» (' + why + ').', 'bad');
      if (c.hp != null) c.hp = Math.min(c.hp, TT.stats.hpMax(c));
      return t;
    },
    // Ép thức tỉnh/ẩn (bảng 🛠).
    force(c, id, hide) {
      if (!act(c)) return false; const e = c.tt.find(x => x.id === id); if (!e) return false;
      if (hide) { if (!e.an) { tt.undoWake(c, e); e.an = 1; e.thuc_tinh_luc = null; } return true; }
      return !!tt.wakeOne(c, 'ép bằng bảng 🛠', id) || !e.an;
    },

    // ---------- luật mô phỏng và truyện cần ghi ----------
    // Chết: Phượng huyết (niet_ban) sống lại một lần, mất tu vi cảnh giới đang ở và quên một người trong dàn. Trả true nếu đã cứu.
    nietBan(c) {
      if (!act(c)) return false;
      const e = c.tt.find(x => !x.an && !x.used && luatOf(x).niet_ban); if (!e) return false;
      e.used = 1; c.xp = 0; c.hp = TT.stats.hpMax(c); c.alive = true;
      let forgot = '';
      if (TT.dan && TT.dan.on(c) && c.story && c.story.gb) {
        const gb = c.story.gb, v = Object.keys(gb).filter(k => gb[k] > 0).sort((a, b) => gb[b] - gb[a])[0];
        if (v) { gb[v] = 0; const o = TT.dan.get(c, v); forgot = ' Bạn quên hẳn ' + (o ? o.name : 'một người') + ' (người ấy vẫn nhớ bạn).'; }
      }
      TT.log(c, 'NIẾT BÀN! Ngọn lửa phượng hoàng kéo bạn trở về từ cõi chết, tu vi của cảnh giới này tan hết.' + forgot, 'big');
      return true;
    },
    // Người trong dàn sắp chết vì bệnh hoặc thương: Thần y thủ (cuu) cứu một lần. Trả true nếu đã cứu.
    cuu(npc, cause) {
      if (!npc || npc.kind === 'player' || !TT.player || !/bệnh|thương|ốm/.test(cause || '')) return false;
      const p = TT.player(); if (!p || !act(p) || !p.story || !p.story.dan) return false;
      if (!Object.keys(p.story.dan).some(v => p.story.dan[v] === npc.id)) return false;
      const e = p.tt.find(x => !x.an && !x.used && luatOf(x).cuu); if (!e) return false;
      e.used = 1; npc.hp = Math.max(30, Math.round(npc.hp || 30));
      TT.log(p, 'Tay y của bạn kéo ' + npc.name + ' trở về từ cửa tử.', 'big');
      return true;
    },
    // Vật phẩm cao do người chơi làm ra kéo kẻ tranh đoạt (Thiên công): dựng một kẻ thù cùng vùng, mức nhẹ.
    tranhDoat(c, itemName) {
      if (!act(c) || !tt.luat(c, 'tranh_doat')) return;
      if (mk(hash(worldSeed() + ':' + c.id + ':' + TT.world.months + ':td'))() >= 0.5) return;
      const n = TT.life.spawnNpc(Math.max(16, TT.age(c) + TT.rng.RI(-4, 8)), c.region);
      if (n) { n.place = c.place; n.dest = null; n.travel = null; TT.social.makeEnemy(n, c, 'thèm khát ' + itemName); TT.log(c, n.name + ' để mắt tới ' + itemName + ' của bạn và không chịu bỏ qua.', 'bad'); }
    },
    // Mở một phần (chặng mở): thấy trước, giấc mơ, ký ức kiếp trước. P: phần của khuôn/kịch bản (trường thay, mo tùy chọn).
    moPhan(c, P, i, st) {
      if (!act(c) || !P) return;
      const f = s => (TT.story && TT.story.fmt ? TT.story.fmt(c, st, s) : s);
      st = st || {}; st.ttMo = st.ttMo || {}; if (st.ttMo[i]) return; st.ttMo[i] = 1;
      if (tt.luat(c, 'thay_truoc') && P.thay) TT.log(c, 'Thiên nhãn: ' + f(P.thay), 'age');
      if (tt.luat(c, 'mo_bao') && (P.mo || P.thay)) TT.log(c, 'Một giấc mơ mơ hồ: ' + f(P.mo || P.thay), 'age');
      if (tt.luat(c, 'tien_kiep')) TT.log(c, 'Ký ức kiếp trước: ' + KIEP[(hash(worldSeed() + ':' + c.id + ':' + i + ':kiep') >>> 0) % KIEP.length], 'age');
    }
  };
})();
