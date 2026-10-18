// Thương hội đối với người chơi (E4): thiện cảm với từng hội (0-100), hội viên và bậc, hai đường gia nhập, quyền lợi, phí hằng năm,
// cùng việc kết thân ở chợ. Lưu ở c.hoi = { rep: {hộiId: điểm}, last: {hộiId: tháng}, vol: tổng giao dịch với hội, m: {id, rank, since, owed} }.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, E = D.ECO, H = E.hoi;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const hoi = TT.hoi = {
    S(c) { if (!c.hoi) c.hoi = { rep: {}, last: {}, vol: 0, m: null, mo: { m: -1, v: 0 } }; return c.hoi; },
    // Hội lớn nhất đang hoạt động ở vùng (đối tác chính của hội sở ở đó).
    leadAt(rid) { const L = TT.fac.hoiAt(rid).slice().sort((a, b) => b.trust * b.wealth - a.trust * a.wealth); return L[0] || null; },
    rep(c, id) { return (hoi.S(c).rep[id]) || 0; },
    levelName(r) { let n = H.levels[0][1]; H.levels.forEach(l => { if (r >= l[0]) n = l[1]; }); return n; },
    add(c, id, d) { const s = hoi.S(c); s.rep[id] = clamp((s.rep[id] || 0) + d, 0, 100); s.last[id] = TT.world.months; return s.rep[id]; },
    member(c) { const m = c.hoi && c.hoi.m; if (!m) return null; const x = TT.fac.get(m.id); return x && TT.fac.alive(x) ? m : null; },
    rankName(c) { const m = hoi.member(c); return m ? H.join.ranks[m.rank] : ''; },
    // Giảm giá khi mua ở hội sở: theo thiện cảm với hội đang đứng, cộng quyền lợi hội viên.
    discount(c) {
      const lead = hoi.leadAt(c.region); if (!lead) return 0;
      const m = hoi.member(c);
      return H.discount * hoi.rep(c, lead.id) / 100 + (m && m.id === lead.id ? 0.02 + 0.01 * m.rank : 0);
    },
    sellFee(c) { const lead = hoi.leadAt(c.region), m = hoi.member(c); return m && lead && m.id === lead.id ? H.sellFee[m.rank] : H.sellFee[0]; },
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
      if (!m) { if (s.m) s.m = null; return; }
      const x = TT.fac.get(m.id), fee = H.fee * (m.rank + 1) * D.LS.RATE;
      if (TT.ls.can(c, fee)) { TT.ls.spend(c, fee); m.owed = 0; } else { m.owed++; hoi.add(c, m.id, -8); TT.log(c, 'Bạn chưa nộp phí hội viên cho ' + x.n + '. Thiện cảm giảm.', 'bad'); if (m.owed >= 2) { s.m = null; TT.log(c, x.n + ' khai trừ bạn vì nợ phí hai năm.', 'bad'); return; } }
      const need = H.rankVol[m.rank + 1];
      if (m.rank < 4 && need != null && s.vol >= need && hoi.rep(c, m.id) >= 46 + 8 * m.rank) { m.rank++; TT.log(c, 'Bạn được ' + x.n + ' thăng lên ' + H.join.ranks[m.rank].toLowerCase() + '.', 'big'); }
    }
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
