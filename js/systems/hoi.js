// Thương hội đối với người chơi (E4): thiện cảm với từng hội (0-100), hội viên và bậc, hai đường gia nhập, quyền lợi, phí hằng năm,
// cùng việc kết thân ở chợ. Lưu ở c.hoi = { rep: {hộiId: điểm}, last: {hộiId: tháng}, vol: tổng giao dịch với hội, m: {id, rank, since, owed} }.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, E = D.ECO, H = E.hoi;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const hash = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };

  const hoi = TT.hoi = {
    S(c) { if (!c.hoi) c.hoi = { rep: {}, last: {}, vol: 0, m: null, mo: { m: -1, v: 0 } }; return c.hoi; },
    // Hội lớn nhất đang hoạt động ở vùng (đối tác chính của hội sở ở đó).
    leadAt(rid) { const L = TT.fac.hoiAt(rid).slice().sort((a, b) => b.trust * b.wealth - a.trust * a.wealth); return L[0] || null; },
    rep(c, id) { return (hoi.S(c).rep[id]) || 0; },
    levelName(r) { let n = H.levels[0][1]; H.levels.forEach(l => { if (r >= l[0]) n = l[1]; }); return n; },
    add(c, id, d) { const s = hoi.S(c); s.rep[id] = clamp((s.rep[id] || 0) + d, 0, 100); s.last[id] = TT.world.months; return s.rep[id]; },
    member(c) { const m = c.hoi && c.hoi.m; if (!m) return null; const x = TT.fac.get(m.id); return x && TT.fac.alive(x) ? m : null; },
    // Quyền lợi hội viên (giảm giá, phí bán, vay, bảo hiểm, đơn): chỉ khi là hội viên và không quá hạn nợ hội (E7b).
    perk(c) { const m = hoi.member(c), L = c.hoi && c.hoi.loan; return m && !(L && L.od) ? m : null; },
    rankName(c) { const m = hoi.member(c); return m ? H.join.ranks[m.rank] : ''; },
    // Giảm giá khi mua ở hội sở: theo thiện cảm với hội đang đứng, cộng quyền lợi hội viên.
    discount(c) {
      const lead = hoi.leadAt(c.region); if (!lead) return 0;
      const m = hoi.perk(c);
      return H.discount * hoi.rep(c, lead.id) / 100 + (m && m.id === lead.id ? 0.02 + 0.01 * m.rank : 0);
    },
    sellFee(c) { const lead = hoi.leadAt(c.region), m = hoi.perk(c); return m && lead && m.id === lead.id ? H.sellFee[m.rank] : H.sellFee[0]; },
    // Mua bán qua hội làm tăng thiện cảm (có trần mỗi tháng) và tổng giao dịch.
    onTrade(c, value, buying) {
      const lead = hoi.leadAt(c.region); if (!lead) return;
      const s = hoi.S(c), now = TT.world.months; if (s.mo.m !== now) s.mo = { m: now, v: 0 };
      s.vol += value;
      const gain = Math.min(H.repCap - s.mo.v, value * H.repBuy / 10); // 10 vàng ~ 0,05 điểm
      if (gain > 0) { s.mo.v += gain; hoi.add(c, lead.id, gain); }
    },
    // Điều kiện gia nhập hội (A.15). Trả { ok, path, rank, why: [...] }.
    canJoin(c, id) {
      const x = TT.fac.get(id), why = [], s = hoi.S(c);
      if (!x || !TT.fac.alive(x) || x.kind !== 'hoi') return { ok: false, why: ['Hội không còn'] };
      if (hoi.member(c)) why.push('Bạn đã là hội viên một hội');
      const rep = hoi.rep(c, id), wealth = TT.ls.wealth(c), j = H.join, R = D.LS.RATE;
      // đường 1: người thường
      const w0 = j.wealth[0] * R, w1 = j.wealth[1] * R;
      const p1 = { ok: wealth >= w0 && rep >= j.rep, rank: wealth >= w1 ? 1 : 0, why: [] };
      if (wealth < w0) p1.why.push('cần tài sản từ ' + TT.ls.fmt(w0)); if (rep < j.rep) p1.why.push('cần thiện cảm với hội từ ' + j.rep + ' (đang ' + Math.round(rep) + ')');
      // đường 2: Thương nhân (nghề)
      const lvl = TT.job ? TT.job.level(c, 'thuong_nhan') : 0, hasJob = c.job && (c.job.main === 'thuong_nhan' || c.job.sub === 'thuong_nhan'), earn = c.tradeEarn || 0, e0 = j.tradeEarn[0], e1 = j.tradeEarn[1];
      const p2 = { ok: !!hasJob && lvl >= j.tradeLevel && earn >= e0 && rep >= j.tradeRep, rank: earn >= e1 ? 2 : 1, why: [] };
      if (!hasJob) p2.why.push('chưa theo nghề Thương nhân'); else {
        if (lvl < j.tradeLevel) p2.why.push('cấp Thương nhân cần từ ' + j.tradeLevel + ' (đang ' + lvl + ')');
        if (earn < e0) p2.why.push('doanh thu buôn bán cần từ ' + TT.ls.fmt(e0) + ' (đang ' + TT.ls.fmt(earn) + ')');
        if (rep < j.tradeRep) p2.why.push('cần thiện cảm từ ' + j.tradeRep + ' (đang ' + Math.round(rep) + ')');
      }
      const ok = why.length === 0 && (p1.ok || p2.ok);
      const best = p2.ok && (!p1.ok || p2.rank >= p1.rank) ? 'thuong_nhan' : 'thuong';
      return { ok, path: best, rank: best === 'thuong_nhan' ? p2.rank : p1.rank, why: why.concat(ok ? [] : ['Đường người thường: ' + (p1.why.join('; ') || 'đủ') + '.', 'Đường Thương nhân: ' + (p2.why.join('; ') || 'đủ') + '.']), p1, p2 };
    },
    join(c, id) {
      const r = hoi.canJoin(c, id); if (!r.ok) return { ok: false, text: r.why.join(' ') };
      const s = hoi.S(c), x = TT.fac.get(id);
      s.m = { id, rank: r.rank, since: TT.world.months, owed: 0 };
      TT.log(c, 'Bạn gia nhập ' + x.n + ' với bậc ' + H.join.ranks[r.rank] + '.', 'big');
      TT.news(c.name + ' trở thành ' + H.join.ranks[r.rank].toLowerCase() + ' của ' + x.n + '.', 'good', [c.id]);
      return { ok: true, text: 'Bạn là ' + H.join.ranks[r.rank].toLowerCase() + ' của ' + x.n + '.' };
    },
    leave(c) { const m = hoi.member(c); if (!m) return { ok: false, text: 'Bạn không ở hội nào.' }; const x = TT.fac.get(m.id); c.hoi.m = null; hoi.add(c, m.id, -15); TT.log(c, 'Bạn rời ' + (x ? x.n : 'hội') + '. Thiện cảm giảm.', 'age'); return { ok: true, text: 'Đã rời hội.' }; },
    // Mỗi năm: phí hội viên, lên bậc theo giao dịch và thiện cảm, thiện cảm trôi khi lâu không giao dịch.
    yearly(c) {
      const s = hoi.S(c), now = TT.world.months, m = hoi.member(c);
      Object.keys(s.rep).forEach(id => { if (now - (s.last[id] || 0) > H.decayAfter) s.rep[id] = Math.max(0, s.rep[id] - H.decay * 12 / 2); });
      const L = s.loan;
      if (L) {
        L.int += L.p * D.ECO.loan.rate;
        if (!L.od && now >= L.due && hoi.owed(c) > 0) { L.od = true; TT.log(c, 'Khoản vay hội đã quá hạn: mất quyền lợi hội viên và thiện cảm giảm mỗi năm đến khi trả hết.', 'bad'); }
        if (L.od) hoi.add(c, L.hid, -D.ECO.loan.overRep);
      }
      if (!m) { if (s.m) s.m = null; return; }
      const x = TT.fac.get(m.id), fee = H.fee * (m.rank + 1) * D.LS.RATE;
      if (TT.ls.can(c, fee)) { TT.ls.spend(c, fee); m.owed = 0; } else { m.owed++; hoi.add(c, m.id, -8); TT.log(c, 'Bạn chưa nộp phí hội viên cho ' + x.n + '. Thiện cảm giảm.', 'bad'); if (m.owed >= 2) { s.m = null; TT.log(c, x.n + ' khai trừ bạn vì nợ phí hai năm.', 'bad'); return; } }
      const need = H.rankVol[m.rank + 1];
      if (m.rank < 4 && need != null && s.vol >= need && hoi.rep(c, m.id) >= 46 + 8 * m.rank) { m.rank++; TT.log(c, 'Bạn được ' + x.n + ' thăng lên ' + H.join.ranks[m.rank].toLowerCase() + '.', 'big'); }
    },

    // ---------- vay hội (E7b) ----------
    loanLimit(c) { const m = hoi.perk(c); return m ? D.ECO.loan.limit[m.rank] * D.LS.RATE : 0; },
    owed(c) { const L = c.hoi && c.hoi.loan; return L ? L.p + L.int : 0; },
    borrow(c, v) {
      if (!D.ECO.hq) return { ok: false, text: 'Chưa mở.' };
      const s = hoi.S(c), m = hoi.perk(c), lim = hoi.loanLimit(c);
      if (!m) return { ok: false, text: 'Chỉ hội viên không nợ hội mới được vay.' };
      if (s.loan) return { ok: false, text: 'Bạn còn khoản vay, trả hết rồi mới vay thêm.' };
      v = Math.floor(v); if (v < 1 || v > lim) return { ok: false, text: 'Hạn mức vay của bậc ' + H.join.ranks[m.rank].toLowerCase() + ' là ' + TT.ls.fmt(lim) + '.' };
      s.loan = { hid: m.id, p: v, int: 0, due: TT.world.months + D.ECO.loan.term, od: false };
      TT.ev.gold(c, v); TT.log(c, 'Bạn vay ' + TT.ls.fmt(v) + ' của ' + TT.fac.get(m.id).n + ', hạn trả sau ' + D.ECO.loan.term / 12 + ' năm.', 'age');
      return { ok: true, text: 'Đã vay ' + TT.ls.fmt(v) + '. Trả đủ trước hạn để khỏi mất quyền lợi.' };
    },
    repay(c, v) {
      const s = hoi.S(c), L = s.loan; if (!L) return { ok: false, text: 'Bạn không có khoản nợ nào.' };
      let pay = Math.min(Math.ceil(v), hoi.owed(c));
      if (!TT.ls.can(c, pay)) return { ok: false, text: 'Không đủ linh thạch để trả (cần ' + TT.ls.fmt(pay) + ').' };
      TT.ls.pay(c, pay);
      const di = Math.min(pay, L.int); L.int -= di; L.p -= pay - di;
      if (L.p <= 0 && L.int <= 0) { s.loan = null; return { ok: true, text: 'Đã trả hết nợ hội.' }; }
      return { ok: true, text: 'Đã trả ' + TT.ls.fmt(pay) + '. Còn nợ ' + TT.ls.fmt(hoi.owed(c)) + '.' };
    },

    // ---------- bảo hiểm chuyến buôn (E7b) ----------
    cargoValue(c) { let v = 0; Object.keys(c.inv || {}).forEach(id => { const g = TT.eco.group(id); if (g && D.ECO.cargo.indexOf(g) >= 0) v += TT.items.value(c, id) * c.inv[id]; }); return v; },
    insure(c) {
      if (!D.ECO.hq) return { ok: false, text: 'Chưa mở.' };
      const s = hoi.S(c), I = D.ECO.ins;
      if (!hoi.perk(c)) return { ok: false, text: 'Chỉ hội viên không nợ hội mới mua được bảo hiểm.' };
      if (s.ins) return { ok: false, text: 'Chuyến này bạn đã có bảo hiểm.' };
      const v = hoi.cargoValue(c); if (v <= 0) return { ok: false, text: 'Bạn không mang hàng buôn nào.' };
      const prem = Math.ceil(v * I.rate); if (!TT.ls.can(c, prem)) return { ok: false, text: 'Không đủ linh thạch đóng phí (cần ' + TT.ls.fmt(prem) + ').' };
      TT.ls.pay(c, prem); s.ins = { v, cap: Math.ceil(v * I.cap), cover: I.cover, prem };
      return { ok: true, text: 'Đã mua bảo hiểm cho hàng trị giá ' + TT.ls.fmt(v) + ', phí ' + TT.ls.fmt(prem) + '.' };
    },
    // Tới nơi: hết hiệu lực. Nếu dọc đường bị cướp (lost) thì bồi thường một phần, không quá trần.
    claim(c, lost) {
      const s = c.hoi, p = s && s.ins; if (!p) return; s.ins = null;
      if (!(lost > 0)) return;
      const pay = Math.min(p.cap, Math.ceil(lost * p.cover)); TT.ev.gold(c, pay);
      TT.log(c, 'Bảo hiểm bồi thường ' + TT.ls.fmt(pay) + ' cho hàng buôn bị cướp.', 'good');
    },

    // ---------- đơn hội (E7b) ----------
    // Bảng đơn của một hội trong quý: tất định theo hội và quý (không dùng rng).
    // Món đại diện của nhóm (không có giá theo người): dùng để định thưởng đơn.
    repItem(g) { return Object.keys(D.ITEMS).find(x => TT.eco.group(x) === g && !D.ITEMS[x].valueFn); },
    board(hid) {
      const J = D.ECO.jobs, q = Math.floor(TT.world.months / 3), G = D.ECO.groups, out = [];
      for (let i = 0; i < J.n; i++) {
        const h = hash(hid + '|' + q + '|' + i), qty = J.qty[Math.floor(h / 31) % J.qty.length];
        const g = G[Math.floor(h / 7) % G.length], d = D.ITEMS[hoi.repItem(g)], unit = d ? d.value : 10;
        out.push({ i, q, hid, kind: h % 2 ? 'giao' : 'thu_mua', g, qty, reward: Math.max(1, Math.round(qty * J.bonus * unit)), rep: J.rep });
      }
      return out;
    },
    accept(c, hid, i) {
      if (!D.ECO.hq) return { ok: false, text: 'Chưa mở.' };
      const m = hoi.perk(c), s = hoi.S(c);
      if (!m || m.id !== hid) return { ok: false, text: 'Chỉ hội viên của hội này mới nhận đơn.' };
      if (s.job) return { ok: false, text: 'Bạn đang làm một đơn rồi, hết quý hoặc xong đơn đó mới nhận đơn khác.' };
      const b = hoi.board(hid)[i]; if (!b) return { ok: false, text: 'Đơn không còn.' };
      s.job = { hid, q: b.q, i, kind: b.kind, g: b.g, need: b.qty, got: 0, reward: b.reward, rep: b.rep, fail: D.ECO.jobs.failRep };
      TT.log(c, 'Bạn nhận đơn của ' + TT.fac.get(hid).n + ': ' + hoi.jobText(s.job) + '.', 'age');
      return { ok: true, text: 'Đã nhận đơn. ' + hoi.jobText(s.job) + '.' };
    },
    jobText(J) { return (J.kind === 'giao' ? 'Giao' : 'Thu mua') + ' ' + J.need + ' ' + D.ECO.names[J.g] + ' ở hội sở (còn ' + (J.need - J.got) + ')'; },
    // Mua hoặc bán ở hội sở của hội đang đơn: cộng tiến độ; đủ thì thưởng.
    progress(c, id, n, buying) {
      if (c.kind !== 'player' || !c.hoi || !c.hoi.job) return;
      const s = c.hoi, J = s.job, lead = hoi.leadAt(c.region);
      if (!lead || lead.id !== J.hid || TT.eco.group(id) !== J.g || (J.kind === 'thu_mua') !== !!buying) return;
      J.got = Math.min(J.need, J.got + n);
      if (J.got < J.need) return;
      TT.ev.gold(c, J.reward); hoi.add(c, J.hid, J.rep); s.vol += J.reward; s.job = null;
      TT.log(c, 'Bạn hoàn thành đơn, được thưởng ' + TT.ls.fmt(J.reward) + ' và thiện cảm tăng.', 'good');
    },
    // Hết quý thì đơn hỏng: thiện cảm giảm (gọi mỗi tháng).
    tick(c) {
      const J = c.hoi && c.hoi.job; if (!J || J.q === Math.floor(TT.world.months / 3)) return;
      c.hoi.job = null; hoi.add(c, J.hid, -J.fail);
      TT.log(c, 'Đơn hội hết hạn quý, bạn bị trừ thiện cảm.', 'bad');
    },
  };

  // Kết thân ở chợ: mua đều ở chợ thì có cơ hội thân thêm với người đang ở đó (dùng hệ quan hệ sẵn có).
  TT.eco.chat = function (c, price) {
    if (c.kind !== 'player') return;
    const trader = c.job && (c.job.main === 'thuong_nhan' || c.job.sub === 'thuong_nhan');
    const p = Math.min(0.12, 0.04 + price / 4000) * (trader ? 1.5 : 1);
    if (!rng.P(p)) return;
    const w = TT.world, here = Object.keys(w.chars).map(k => w.chars[k]).filter(x => x.alive && x.kind === 'npc' && x.place === c.place && !x.travel && !x.cross && !x.cross);
    if (!here.length) return;
    const o = rng.pick(here); TT.rel.add(c, o, 5);
    TT.log(c, 'Mua bán ở chợ, bạn chuyện trò với ' + o.name + ' và thân thêm một chút.', 'age');
  };
})();
