// Cái giá của thất bại: thương tích kéo dài, mất đồ, tổn hại tu vi, pháp khí vỡ. Chỉ áp cho người chơi (NPC chết hoặc thắng thẳng).
// Thương tích c.wound = { sev, until }: giảm sinh lực tối đa và tốc độ tu luyện cho tới khi tự lành (nghỉ ngơi lành nhanh gấp đôi).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng;

  D.WOUND = [
    null,
    { n: 'Thương tích nhẹ', months: 8, hp: 0.10, train: 0.15, brk: 0.02 },
    { n: 'Trọng thương', months: 18, hp: 0.20, train: 0.30, brk: 0.05 },
    { n: 'Căn cơ tổn hại', months: 36, hp: 0.30, train: 0.45, brk: 0.08 }
  ];

  const loss = TT.loss = {
    active(c) { return c.wound && c.wound.until > TT.world.months ? c.wound : null; },
    def(c) { const w = loss.active(c); return w ? D.WOUND[w.sev] : null; },
    hpMul(c) { const d = loss.def(c); return d ? 1 - d.hp : 1; },
    trainMul(c) { const d = loss.def(c); return d ? 1 - d.train : 1; },
    brkPenalty(c) { const d = loss.def(c); return d ? d.brk : 0; },
    left(c) { const w = loss.active(c); return w ? w.until - TT.world.months : 0; },

    // Bị thương nặng thêm: giữ mức cao hơn, thời gian cộng dồn một phần.
    hurt(c, sev) {
      if (c.kind !== 'player' || !sev) return '';
      const cur = loss.active(c), now = TT.world.months;
      const s = cur ? Math.min(3, Math.max(cur.sev, sev) + (cur.sev === sev && sev < 3 ? 1 : 0)) : sev;
      const until = Math.max(cur ? cur.until : 0, now + D.WOUND[s].months);
      c.wound = { sev: s, until }; if (s >= 2) TT.report.mark(c, 'hurt', D.WOUND[s].n);
      c.hp = Math.min(c.hp, TT.stats.hpMax(c));
      TT.log(c, D.WOUND[s].n + ': sinh lực tối đa -' + Math.round(D.WOUND[s].hp * 100) + '%, tu luyện chậm ' + Math.round(D.WOUND[s].train * 100) + '% trong ' + (until - now) + ' tháng (nghỉ ngơi lành nhanh gấp đôi).', 'bad');
      return D.WOUND[s].n;
    },
    // Nghỉ ngơi một tháng lành thêm một tháng.
    rested(c) { const w = loss.active(c); if (w) w.until -= 1; },

    // Hậu quả thất bại. o: { sev, xp (phần trăm tu vi hiện có), items (số món), gear (xác suất vỡ pháp khí) }. Trả về mô tả ngắn.
    defeat(c, o) {
      if (c.kind !== 'player') return '';
      const out = [];
      if (o.xp && c.xp > 0) { const l = Math.floor(c.xp * o.xp); if (l > 0) { c.xp -= l; out.push('tu vi -' + l); } }
      for (let i = 0; i < (o.items || 0); i++) {
        const ids = Object.keys(c.inv || {}).filter(id => { const d = D.ITEMS[id]; return d && ['dan', 'bua', 'lieu'].indexOf(d.cat) >= 0; });
        if (!ids.length) break;
        const id = rng.pick(ids), d = D.ITEMS[id], n = d.cat === 'lieu' ? Math.max(1, Math.ceil(c.inv[id] / 2)) : 1;
        TT.items.remove(c, id, n); out.push('mất ' + n + ' ' + d.n);
      }
      if (o.gear && rng.P(o.gear)) {
        const slots = Object.keys(c.equip || {}).filter(s => c.equip[s] && s !== 'relic'); // pháp bảo bản mệnh bền, không vỡ
        if (slots.length) { const s = rng.pick(slots), d = D.ITEMS[c.equip[s]]; c.equip[s] = null; c.hp = Math.min(c.hp, TT.stats.hpMax(c)); out.push(d.n + ' vỡ nát'); }
      }
      const w = loss.hurt(c, o.sev || 0); if (w) out.push(w.toLowerCase());
      if (out.length) TT.log(c, 'Cái giá của thất bại: ' + out.join(', ') + '.', 'bad');
      return out.length ? ' Cái giá: ' + out.join(', ') + '.' : '';
    }
  };
})();
