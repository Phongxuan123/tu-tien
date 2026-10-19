// Nghề nghiệp của người chơi: một nghề chính, một nghề phụ. Có cấp và bậc (học đồ, thợ, chuyên gia, đại sư), thu nhập khi kiếm sống,
// kỹ năng riêng của từng nghề, và "đơn hàng" làm nguồn nhiệm vụ nghề (kind 'order' trong quests.js).
// Bốn nghề lõi dùng cấp trong c.craft (craft.js); năm nghề mới lưu cấp ở c.job.lv. Trạng thái: c.job = { main, sub, adapt, lv, done, asked }.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats;

  const need = lv => Math.round(30 * Math.pow(lv + 1, 1.6));
  const rankOf = lv => D.JOB_RANKS[lv >= 8 ? 3 : lv >= 5 ? 2 : lv >= 2 ? 1 : 0];

  const job = TT.job = {
    ensure(c) { if (!c.job) c.job = { main: null, sub: null, adapt: 0, lv: {}, done: 0, asked: false }; return c.job; },
    def(id) { return D.JOBS[id]; },
    isCraft(id) { return !!(D.JOBS[id] && D.JOBS[id].craft); },
    level(c, id) {
      if (!D.JOBS[id]) return 0;
      if (D.JOBS[id].craft) return TT.craft.level(c, D.JOBS[id].craft);
      const st = c.job && c.job.lv[id]; return st ? st.lv : 0;
    },
    cap(c, id) { return D.JOBS[id].craft ? TT.craft.cap(c, D.JOBS[id].craft) : Math.min(10, 3 + 2 * c.realm); },
    rank(c, id) { return rankOf(job.level(c, id)); },
    xpInfo(c, id) {
      if (D.JOBS[id].craft) { if (!c.craft) return { xp: 0, need: TT.craft.need(0) }; const st = c.craft[D.JOBS[id].craft]; return { xp: st.xp, need: TT.craft.need(st.lv) }; }
      const st = c.job.lv[id] || { lv: 0, xp: 0 }; return { xp: st.xp, need: need(st.lv) };
    },
    addXp(c, id, g) {
      if (D.JOBS[id].craft) { TT.craft.addXp(c, D.JOBS[id].craft, g); return; }
      const j = job.ensure(c), st = j.lv[id] = j.lv[id] || { lv: 0, xp: 0 }, cap = job.cap(c, id);
      if (st.lv >= cap) { st.xp = Math.min(st.xp, need(st.lv)); return; }
      st.xp += g;
      while (st.lv < cap && st.xp >= need(st.lv)) {
        st.xp -= need(st.lv); st.lv++;
        TT.log(c, D.JOBS[id].n + ' đạt cấp ' + st.lv + ' (' + rankOf(st.lv) + ')!', 'big');
      }
    },

    // Chọn nghề chính hoặc phụ. Đổi nghề chính thì thu nhập giảm một nửa trong vài tháng; cấp nghề cũ vẫn giữ.
    set(c, slot, id) {
      const j = job.ensure(c);
      if (id && !D.JOBS[id]) return false;
      if (slot === 'main') {
        if (j.main === id) return false;
        if (id && j.sub === id) j.sub = j.main;
        const had = j.main; j.main = id;
        if (had) j.adapt = TT.world.months + D.JOB_ADAPT;
        if (id && D.JOBS[id].craft) { TT.craft.ensure(c).focus = D.JOBS[id].craft; }
        if (id) TT.log(c, 'Bạn chọn nghề chính: ' + D.JOBS[id].n + ' (' + job.rank(c, id) + ').', 'big', D.JOBS[id].perk + (had ? ' Thu nhập giảm một nửa trong ' + D.JOB_ADAPT + ' tháng làm quen.' : ''));
      } else {
        if (id ? (j.sub === id || j.main === id) : !j.sub) return false;
        j.sub = id;
        if (id) TT.log(c, 'Bạn học thêm nghề phụ: ' + D.JOBS[id].n + '.', 'age', D.JOBS[id].perk);
      }
      if (TT.report) TT.report.mark(c, 'job', 'Nghề: ' + (id ? D.JOBS[id].n : 'bỏ nghề'));
      return true;
    },
    mainId(c) { return c.job && c.job.main; },

    // Hệ số thu nhập khi kiếm sống: nghề chính nhân đủ, nghề phụ một nửa; đang làm quen nghề mới thì giảm một nửa.
    incomeMul(c) {
      const j = c.job; if (!j || c.kind !== 'player') return 1;
      let m = 1;
      if (j.main) m *= D.JOBS[j.main].inc * (1 + D.JOB_MAIN_LV * job.level(c, j.main));
      if (j.sub) m *= 1 + (D.JOBS[j.sub].inc - 1) * 0.5 + D.JOB_MAIN_LV * 0.5 * job.level(c, j.sub);
      if (TT.world.months < j.adapt) m = 1 + (m - 1) * 0.5;
      return m;
    },
    buyMul(c) { const j = c.job; if (!j || c.kind !== 'player') return 1; const lv = (j.main === 'thuong_nhan' ? job.level(c, 'thuong_nhan') : j.sub === 'thuong_nhan' ? job.level(c, 'thuong_nhan') * 0.5 : 0); return 1 - Math.min(0.15, 0.015 * lv); },
    healMul(c) { const j = c.job; if (!j || c.kind !== 'player') return 1; const lv = j.main === 'y_su' ? job.level(c, 'y_su') : j.sub === 'y_su' ? job.level(c, 'y_su') * 0.5 : 0; return 1 + 0.06 * lv; },
    // Tốc độ đơn hàng dự tính mỗi năm cho nghề chính (dùng để chia độ khó nhiệm vụ đơn hàng).
    orderRate(c) {
      const j = c.job; if (!j || !j.main) return 0;
      const dir = D.DIRECTIONS[c.direction] || D.DIRECTIONS.can_bang; let tot = 0; Object.keys(dir.w).forEach(k => { tot += dir.w[k]; });
      const share = (dir.w.work + (job.isCraft(j.main) ? dir.w.craft : 0)) / tot;
      return Math.max(0.4, share * 12 * D.JOB_ORDER_P);
    },

    // Một tháng kiếm sống: lên kinh nghiệm nghề, hưởng kỹ năng nghề, có thể xong một đơn hàng.
    work(c) {
      const j = c.job; if (!j || c.kind !== 'player' || (!j.main && !j.sub)) return;
      [['main', 1], ['sub', 0.5]].forEach(a => {
        const id = j[a[0]]; if (!id) return;
        const d = D.JOBS[id], k = a[1];
        job.addXp(c, id, rng.RI(2, 4) * (1 + 0.1 * job.level(c, id)) * k);
        if (a[0] === 'main' && rng.P(D.JOB_ORDER_P)) j.done++;

        const lv = job.level(c, id);
        // thu hoạch phụ thuộc tài nguyên tại chỗ đang đứng (xem systems/resources.js)
        if (id === 'tho_mo') {
          if (rng.P(Math.min(0.9, 0.35 * k * TT.res.power(c, 'ore')))) { const t = lv >= 6 && rng.P(0.25) ? 2 : lv >= 3 && rng.P(0.5) ? 1 : 0; TT.items.add(c, TT.craft.ORE[t], t === 0 ? 2 : 1); TT.res.take(c, 'ore', D.RES_RULES.takeOre); if (rng.P(0.25)) TT.log(c, d.work + ' Bạn đào được ' + D.ITEMS[TT.craft.ORE[t]].n + '.', 'age'); }
          if (TT.res.level(c, 'ls') > 0 && rng.P(D.RES_RULES.lsGain * k * TT.res.power(c, 'ls'))) { TT.ls.gain(c, 1); TT.res.take(c, 'ls', D.RES_RULES.takeLs * 5); TT.log(c, d.work + ' Bạn nhặt được một hạ phẩm linh thạch thô từ vỉa mỏ.', 'good'); }
        }
        if (id === 'tho_san' && rng.P(Math.min(0.9, 0.3 * k * TT.res.power(c, 'beast')))) {
          TT.res.take(c, 'beast', D.RES_RULES.takeBeast);
          const main = c.tuchat.attrs.reduce((m, x) => (x.p > m.p ? x : m), c.tuchat.attrs[0]);
          const key = TT.gear.matKey(rng.P(0.5) ? 'nanh' : 'da', main.n, Math.min(3, Math.floor(lv / 3)));
          if (D.ITEMS[key]) { TT.items.add(c, key); if (rng.P(0.3)) TT.log(c, d.work + ' Bạn lấy được ' + D.ITEMS[key].n + '.', 'age'); }
        }
        if (id === 'y_su' && rng.P(Math.min(0.9, 0.2 * k * TT.res.power(c, 'herb')))) { TT.items.add(c, 'linh_thao'); TT.res.take(c, 'herb', D.RES_RULES.takeHerb); }
        if (d.risk && rng.P(d.risk * k * TT.path.mods(c).risk)) {
          const dmg = 6 * (1 + c.realm); TT.ev.hp(c, -dmg);
          TT.log(c, d.work + ' Gặp chuyện bất trắc, bạn bị thương (sinh lực -' + dmg + ').', 'bad');
        }
        if (id === 'linh_danh' && rng.P(0.06 * k)) TT.rep.add(c, 'danh', 1);
      });
    },
    // Một tháng luyện nghề: nếu nghề chính là nghề lõi thì cũng tính đơn hàng.
    craftMonth(c) {
      const j = c.job; if (!j || !j.main || !job.isCraft(j.main) || c.kind !== 'player') return;
      if (rng.P(D.JOB_ORDER_P * 0.8)) j.done++;
    },

    // ---------- chọn nghề ----------
    weights(c) {
      const pt = TT.path.get(c) ? TT.path.get(c).id : null, w = {};
      D.JOB_IDS.forEach(id => {
        const d = D.JOBS[id]; let v = 1;
        if (d.path === pt) v += 1.2;
        if (d.craft) v += Math.max(0, TT.craft.aptitude(c, d.craft) - 0.8) * 1.6;
        if (id === 'linh_danh' || id === 'tho_san') v += Math.min(1, S.atk(c) / 40) * 0.6;
        if (id === 'thuong_nhan' && TT.ls.wealth(c) > 80) v += 0.4;
        w[id] = Math.max(0.1, v);
      });
      return w;
    },
    offer(c, why) {
      if (c.kind !== 'player' || TT.world.pending) return false;
      const j = job.ensure(c); if (j.main || j.asked) return false;
      j.asked = true;
      const w = job.weights(c), ids = D.JOB_IDS.slice().sort((a, b) => w[b] - w[a]).slice(0, 5);
      const choices = ids.map(id => ({ key: id, label: 'Làm ' + D.JOBS[id].n.toLowerCase(), why: D.JOBS[id].perk }));
      choices.push({ key: '', label: 'Chưa chọn nghề', why: 'Có thể chọn sau trong tab Nghề.' });
      TT.decisions.request({
        type: 'job', charId: c.id, tier: 2, timeout: 20, why,
        title: 'Chọn một nghề để kiếm sống',
        text: 'Một nghề chính cho bạn thu nhập tốt hơn, kỹ năng riêng và là nguồn đơn hàng (nhiệm vụ nghề). Bạn còn có thể học thêm một nghề phụ. Nghề lõi (kiếm khách, thợ rèn, dược sư, phù sư) cần thiên phú hợp thuộc tính; nghề phổ thông ai cũng làm được.',
        choices, def: 0
      });
      return true;
    }
  };
})();
