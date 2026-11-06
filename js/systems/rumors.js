// Tin đồn và cơ hội có hạn: báo trước để người chơi lập kế hoạch (đi đâu, chuẩn bị gì, rủ ai).
// world.opps: [{ id, kind, region, place, open, close, name, text, done, info }]. Cơ hội mở trong [open, close] (tháng tuyệt đối).
// Nếu người chơi có mặt tại địa điểm trong khoảng đó thì sự kiện tương ứng nổ ra; không thì lỡ mất.
// Kẻ thù đang tìm tới (kind 'ke_thu') cũng hiện như một tin báo trước.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng;

  // Các loại cơ hội: types là loại địa điểm có thể diễn ra; lead là số tháng báo trước; dur là thời gian mở cửa.
  const KINDS = {
    bi_canh: { ev: 'opp_bi_canh', w: 3, types: ['bi_canh', 'hung_dia', 'tan_tich'], lead: [10, 30], dur: [3, 6], tag: 'Bí cảnh', verb: 'sắp mở cửa' },
    cao_nhan: { ev: 'opp_cao_nhan', w: 2, types: ['tong_mon', 'thanh_tri', 'linh_mach', 'tan_tich'], lead: [6, 18], dur: [2, 4], tag: 'Cao nhân', verb: 'sẽ tới giảng đạo' },
    dau_gia: { ev: 'opp_dau_gia', w: 2, types: ['thanh_tri', 'thuong_doan', 'cho_den'], lead: [6, 18], dur: [2, 3], tag: 'Đấu giá', verb: 'sắp tổ chức phiên đấu giá' },
    luan_dao: { ev: 'opp_luan_dao', w: 2, types: ['thanh_tri', 'tong_mon', 'linh_mach'], lead: [8, 24], dur: [2, 4], tag: 'Luận đạo', verb: 'sắp có đại hội luận đạo' },
    tuyen: { ev: 'opp_tuyen', w: 2.5, types: ['tong_mon'], lead: [6, 24], dur: [3, 6], tag: 'Tuyển đệ tử', verb: 'sắp mở kỳ tuyển đệ tử', noSect: true }
  };

  const rumors = TT.rumors = {
    KINDS,

    active() { return (TT.world.opps || []).filter(o => !o.done); },

    // Thời gian (tháng) đi từ chỗ nhân vật tới một địa điểm cùng vùng, hoặc null.
    routeMonths(c, placeId) {
      if (!c.place || c.region !== TT.map.place(placeId).region) return null;
      if (c.place === placeId) return 0;
      const rt = TT.map.localRoute(c.place, placeId);
      return rt ? rt.months : null;
    },

    add(o) {
      const w = TT.world;
      w.opps = w.opps || [];
      w.nextOpp = (w.nextOpp || 1);
      o.id = w.nextOpp++; o.done = false; o.info = o.info || {};
      w.opps.push(o);
      return o;
    },

    // Mỗi tháng, ở vùng người chơi đang ở: có thể xuất hiện tin đồn mới, cơ hội tới hạn hoặc hết hạn.
    monthly() {
      const w = TT.world, p = TT.player();
      if (!p || !p.alive || p.cross) return;
      w.opps = w.opps || [];
      const act = rumors.active().filter(o => o.region === p.region && o.kind !== 'ke_thu');
      if (act.length < 2 && rng.P(0.025)) rumors.spawn(p);
      const now = w.months;
      w.opps.forEach(o => {
        if (o.done) return;
        if (o.kind === 'ke_thu') {
          const e = w.chars[o.info.enemyId];
          const r = e && TT.rel.get(p, e);
          if (!e || !e.alive || !r || r.k !== 'thu' || now > o.close) o.done = true;
          return;
        }
        if (now >= o.open && !o.opened) {
          o.opened = true;
          if (o.kind === 'bi_canh') TT.dungeon.npcRush(o.region, o.name);
          else TT.news(o.name + ' đã mở. Tu sĩ khắp nơi đổ về ' + TT.map.place(o.place).n + '.', 'age', []);
        }
        if (now >= o.open && now <= o.close && o.region === p.region && p.place === o.place && !p.travel) {
          if (w.pending) return; // đợi tháng sau
          o.done = true; p.plan = p.plan === o.id ? null : p.plan;
          const sd = D.SECTS[o.place];
          TT.events.fire(p, D.eventById[KINDS[o.kind].ev], { oppId: o.id, name: o.name, place: TT.map.place(o.place).n, sectId: o.place, sectName: sd ? sd.n : '' });
        } else if (now > o.close) {
          o.done = true;
          if (p.plan === o.id) { p.plan = null; TT.log(p, 'Bạn đã lỡ cơ hội: ' + o.name + '.', 'bad'); }
        }
      });
      if (w.opps.length > 20) w.opps = w.opps.filter(o => !o.done || now - o.close < 24);
    },

    spawn(p) {
      const w = TT.world, rid = p.region;
      const kinds = Object.keys(KINDS).map(k => ({ k, w: KINDS[k].w }));
      for (let t = 0; t < 4; t++) {
        const k = rng.wpick(kinds).k, def = KINDS[k];
        if (def.noSect && p.sect) continue; // đã có tông môn thì không có tin tuyển đệ tử cho mình
        const cand = TT.map.placesOf(rid).filter(pl => def.types.indexOf(pl.type) >= 0 && !(def.noSect && p.flags.expelled && p.flags.expelled[pl.id]));
        if (!cand.length) continue;
        const place = rng.pick(cand);
        if (rumors.active().some(o => o.place === place.id)) continue;
        const open = w.months + rng.RI(def.lead[0], def.lead[1]);
        const close = open + rng.RI(def.dur[0], def.dur[1]);
        const name = def.tag === 'Bí cảnh' ? place.n : def.tag + ' ở ' + place.n;
        const lead = open - w.months;
        const text = 'Tin đồn: ' + (def.tag === 'Bí cảnh' ? place.n : def.tag + ' tại ' + place.n) + ' ' + def.verb + ' sau khoảng ' + Math.round(lead / 12 * 10) / 10 + ' năm.';
        const o = rumors.add({ kind: k, region: rid, place: place.id, open, close, name, text });
        TT.news(text, 'age', []);
        const G = D.STORY && D.STORY.logGom, key = k + ':' + place.id;
        p.rumorSeen = p.rumorSeen || {};
        if (G && G.on && p.rumorSeen[key] != null && w.months - p.rumorSeen[key] < G.rumorMonths * 1) {
          (p.qRumor = p.qRumor || []).push(name); // tin lặp: không ghi riêng, gộp vào dòng cuối năm (world.js)
        } else TT.log(p, text, 'age');
        p.rumorSeen[key] = w.months;
        return o;
      }
      return null;
    },

    // Kẻ thù bắt đầu đi tìm người chơi: báo trước thời gian dự kiến tới nơi.
    enemyComing(enemy, target, dest) {
      const w = TT.world;
      const ex = rumors.active().find(o => o.kind === 'ke_thu' && o.info.enemyId === enemy.id);
      const eta = enemy.travel ? Math.max(1, enemy.travel.arrive - w.months) : 1;
      let total = eta;
      if (enemy.travel && enemy.travel.to !== dest) { const rt = TT.map.localRoute(enemy.travel.to, dest); total += rt ? rt.months : 0; }
      if (ex) { ex.open = w.months + total; ex.close = w.months + total + 24; ex.place = dest; return; }
      const name = 'Kẻ thù ' + enemy.name;
      const o = rumors.add({
        kind: 'ke_thu', region: enemy.region, place: dest, open: w.months + total, close: w.months + total + 24, name,
        text: 'Có tin ' + enemy.name + ' (' + D.REALM_NAMES[enemy.realm] + ') đang đi tìm bạn, dự kiến tới nơi sau khoảng ' + total + ' tháng.', info: { enemyId: enemy.id }
      });
      TT.news(o.text, 'bad', [enemy.id]);
      TT.log(target, o.text, 'bad');
    },

    // Người chơi tự động lập kế hoạch tới cơ hội, tùy hướng đi (người thích phiêu lưu hay đi, người chuyên tu luyện ít đi).
    planFor(c) {
      if (c.plan) {
        const o = (TT.world.opps || []).find(x => x.id === c.plan);
        if (!o || o.done || TT.world.months > o.close) { c.plan = null; return false; }
        if (c.place !== o.place) { c.dest = o.place; TT.map.startTravel(c, o.place); }
        return true;
      }
      if (!c.autoMove || !rng.P(0.08)) return false;
      const dir = D.DIRECTIONS[c.direction] || D.DIRECTIONS.can_bang;
      const list = rumors.active().filter(o => o.kind !== 'ke_thu' && o.region === c.region);
      for (const o of list) {
        const m = rumors.routeMonths(c, o.place);
        if (m == null || TT.world.months + m > o.close) continue;
        const p = rng.clamp(0.2 * dir.bold * (o.kind === 'bi_canh' ? 1 : 0.6), 0.04, 0.6);
        if (rng.P(p)) { rumors.setPlan(c, o); return true; }
      }
      return false;
    },

    setPlan(c, o) {
      c.plan = o.id;
      TT.log(c, 'Bạn quyết định tới ' + TT.map.place(o.place).n + ' để dự: ' + o.name + '.', 'age');
      if (c.place !== o.place) { c.dest = o.place; TT.map.startTravel(c, o.place); }
    }
  };
})();
