// Kinh tế (E1 đến E4): 63 chỉ số giá (9 vùng x 7 nhóm hàng) cập nhật mỗi tháng theo cung và cầu lấy từ thế giới (tài nguyên, dân số, tông, chiến sự,
// thời đại, thiên tai, thương hội), cú sốc có báo trước, thương hội ép chênh giá giữa vùng, thuế theo vương triều, tin giá. Lưu ở world.eco, khởi tạo muộn.
// Giá một món = giá trị nền x hệ số loại nơi (D.SHOPS) x chỉ số giá vùng-nhóm x hệ số kênh x (1 + thuế) x (1 + sức ép mua bán dồn).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, E = D.ECO;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const hash = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };
  const ORES = ['quang_thach', 'tinh_thiet', 'huyen_thiet', 'thien_thach'];
  const regName = rid => (TT.map.region(rid) ? TT.map.region(rid).n : rid);

  const eco = TT.eco = {
    // ---------- nhóm hàng của một vật phẩm ----------
    group(id) {
      const d = D.ITEMS[id]; if (!d) return null;
      switch (d.cat) {
        case 'dan': return 'dan'; case 'bua': return 'bua'; case 'khi': case 'lo': return 'khi'; case 'sach': case 'dac': return 'sach';
        case 'lieu':
          if (id === 'linh_thao') return 'thao';
          if (id === 'phu_giay') return 'bua';
          if (id === 'yeu_dan' || d.part) return 'yeu';
          return 'khoang';
        default: return null;
      }
    },
    spec(rid, g) { const s = E.spec[rid] || {}; return (s.cheap || []).indexOf(g) >= 0 ? E.cheapMul : (s.dear || []).indexOf(g) >= 0 ? E.dearMul : 1; },
    // ---------- trạng thái ----------
    S() {
      const w = TT.world; if (!w) return null;
      if (!w.eco) {
        w.eco = { p: {}, h: {}, press: {}, sh: [], why: {}, note: {}, d: {}, s: {} };
        D.REGIONS.forEach(r => { w.eco.p[r.id] = {}; w.eco.h[r.id] = {}; w.eco.why[r.id] = {}; w.eco.d[r.id] = {}; w.eco.s[r.id] = {}; E.groups.forEach(g => { w.eco.p[r.id][g] = eco.spec(r.id, g); w.eco.h[r.id][g] = []; w.eco.d[r.id][g] = 1; w.eco.s[r.id][g] = 1; }); });
      }
      return w.eco;
    },
    // Chỉ số giá hiện tại của nhóm ở một vùng (1 = mức chung; đặc sản vùng đã gộp sẵn).
    index(rid, g) { const s = eco.S(); return s && s.p[rid] && s.p[rid][g] != null ? s.p[rid][g] : 1; },
    // So với mức bình thường của chính vùng đó (đã bỏ đặc sản): 1,3 nghĩa là đắt hơn thường 30%.
    rel(rid, g) { return eco.index(rid, g) / eco.spec(rid, g); },
    series(rid, g) { const s = eco.S(); return (s && s.h[rid] && s.h[rid][g]) || []; },
    supply(rid, g) { const s = eco.S(); return s ? s.s[rid][g] : 1; },
    demand(rid, g) { const s = eco.S(); return s ? s.d[rid][g] : 1; },
    why(rid, g) { const s = eco.S(); return s && s.why[rid] ? s.why[rid][g] || '' : ''; },
    // Sức ép mua bán dồn (âm khi bán dồn, dương khi mua dồn).
    press(rid, g) { const s = eco.S(); return (s && s.press[rid + '|' + g]) || 0; },
    push(rid, g, delta) { const s = eco.S(); if (!s) return; const k = rid + '|' + g; s.press[k] = clamp((s.press[k] || 0) + delta, -E.press.capDown, E.press.capUp); },

    // ---------- thuế (từ vương triều) ----------
    tax(rid) {
      const tr = TT.fac.list('trieu').find(t => t.region === rid && TT.fac.alive(t)), g = TT.pop.get(rid);
      let t = E.tax.base + (tr ? 0.10 * (1 - tr.wealth / 100) : 0.04) + (TT.fac.atFront(rid) ? 0.04 : 0) + (g && g.riot ? 0.02 : 0);
      TT.pact.S(); TT.fac.S().pacts.forEach(p => { if (p.defy) { const a = TT.fac.get(p.a); if (a && a.region === rid) t += 0.005; } });
      return clamp(t, E.tax.min, E.tax.max);
    },

    // ---------- kênh mua và giá một món ----------
    fresh(c, id) { // 1 nếu không hỏng; giảm dần theo hạn dùng; 3 tháng cuối còn 40%
      const r = TT.items.remaining ? TT.items.remaining(c, id) : null; if (r == null) return 1;
      const L = TT.items.life(id), last = E.decay.last;
      if (r <= last) return E.decay.floor;
      return E.decay.floor + (1 - E.decay.floor) * clamp((r - last) / Math.max(1, L - last), 0, 1);
    },
    // Hệ số nhỏ theo kênh, nơi và quý để các cửa hàng cùng nhóm cạnh tranh nhẹ (tất định, không dùng số ngẫu nhiên của thế giới).
    chan(c, bld) {
      const base = E.chan[bld] || 1, h = hash((c.place || '') + bld + Math.floor(TT.world.months / 3)) / 100003;
      return base * (1 + (h - 0.5) * 2 * E.jitter);
    },
    // Hệ số giá mua so với giá trị nền (chưa gồm D.SHOPS.buy).
    buyMul(c, id, bld) {
      const g = eco.group(id); if (!g) return 1;
      const rid = c.region, hoiOff = bld === 'hoi' && TT.hoi ? TT.hoi.discount(c) : 0;
      return eco.index(rid, g) * eco.chan(c, bld) * (1 + eco.tax(rid)) * (1 + eco.press(rid, g)) * (1 - hoiOff);
    },
    sellMul(c, id, bld) {
      const g = eco.group(id); if (!g) return 1;
      const rid = c.region, fee = bld === 'hoi' && TT.hoi ? TT.hoi.sellFee(c) : 0;
      return eco.index(rid, g) * (1 - eco.tax(rid) * 0.5) * (1 + eco.press(rid, g)) * eco.fresh(c, id) * (1 - fee);
    },

    // ---------- cung và cầu ----------
    ra(rid, kind) { // sức cung tài nguyên còn lại của vùng so với lúc đầy kho (0-1,2)
      let base = 0, cur = 0;
      TT.map.placesOf(rid).forEach(p => { const lv = TT.res.levels(p.id)[kind] || 0; base += lv; cur += lv * (0.4 + 0.6 * TT.res.stock(p.id, kind) / 100); });
      TT.res.zones(rid).forEach(z => { if (z.kind !== kind) return; base += z.lv; cur += z.lv * (0.4 + 0.6 * TT.res.stock(z.id, kind) / 100); });
      return base > 0 ? cur / base : 1;
    },
    sectIdx(rid) {
      const L = TT.fac.list('tong').filter(t => t.region === rid); if (!L.length) return 1;
      return L.reduce((a, t) => a + (TT.fac.alive(t) ? clamp(t.wealth / 55, 0.3, 1.6) : 0.15), 0) / L.length;
    },
    shockMul(rid, g, kind, now) { // kind 'd' hoặc 's'; chỉ cú sốc đã bắt đầu
      let m = 1; const s = eco.S();
      s.sh.forEach(x => { if (x.region !== rid || x.start > now || x.until <= now) return; const t = E.shocks[x.kind]; const v = t && t[kind]; if (!v) return; m *= (v[g] != null ? v[g] : v['*'] != null ? v['*'] : 1); });
      return m;
    },

    // ---------- một tháng ----------
    monthly() {
      const s = eco.S(), w = TT.world, now = w.months, f = TT.fac.S(); if (!s) return;
      f.shocks = f.shocks || [];
      // cú sốc mới (có báo trước) và dọn cú sốc hết hạn
      s.sh = s.sh.filter(x => x.until > now);
      D.REGIONS.forEach(r => {
        Object.keys(E.shocks).forEach(k => {
          const t = E.shocks[k]; if (!rng.P(t.chance) || s.sh.some(x => x.kind === k && x.region === r.id)) return;
          const lead = rng.RI(t.lead[0], t.lead[1]);
          s.sh.push({ kind: k, region: r.id, start: now + lead, until: now + lead + t.dur, said: false });
        });
      });
      s.sh.forEach(x => { // thông báo khi bắt đầu
        if (x.said || x.start > now) return; x.said = true;
        const pl = TT.player(), t = E.shocks[x.kind];
        TT.fac.chron(t.text + ' ở ' + regName(x.region) + '.', 'age', !!(pl && pl.region === x.region));
      });
      const pr = {};
      D.REGIONS.forEach(r => {
        const rid = r.id, g0 = TT.pop.get(rid), pop = g0 ? g0.n / D.POP[rid].n0 : 1, mood = g0 ? g0.mood : 55;
        const front = TT.fac.atFront(rid), era = TT.fac.era(), sh = TT.pop.shocksAt(rid);
        const han = sh.some(x => x.kind === 'han'), lu = sh.some(x => x.kind === 'lu'), dich = sh.some(x => x.kind === 'dich');
        const hoiTru = f.shocks.some(x => x.kind === 'hoiTru' && x.region === rid && x.until > now), hoiXa = f.shocks.some(x => x.kind === 'hoiXa' && x.region === rid && x.until > now);
        const rift = (f.rifts || []).some(x => { const a = TT.fac.get(x.a), b = TT.fac.get(x.b); return (a && a.kind === 'trieu' && a.region === rid) || (b && b.kind === 'trieu' && b.region === rid); });
        const si = eco.sectIdx(rid), raH = eco.ra(rid, 'herb'), raO = eco.ra(rid, 'ore'), raB = eco.ra(rid, 'beast');
        const delta = TT.fac.hoiCover(rid), ds = {}, ss = {}, why = {};
        const S = {
          thao: 0.7 * raH + 0.3 * pop, khoang: 0.8 * raO + 0.2 * pop, yeu: 0.8 * raB + 0.2 * pop,
          dan: 0.55 * si + 0.3 * pop + 0.15 * raH, bua: 0.5 * si + 0.35 * pop + 0.15, khi: 0.45 * si + 0.3 * pop + 0.25 * raO, sach: 0.7 * si + 0.3 * pop
        };
        const dm = (0.9 + mood / 500) * era.price;
        E.groups.forEach(g => {
          let d = pop * dm, sp = S[g];
          if (front) { d *= ({ dan: 1.6, bua: 1.6, khi: 1.25, yeu: 1.1 })[g] || 1; if (g === 'dan' || g === 'bua') why[g] = 'chiến sự'; }
          if (dich && g === 'dan') { d *= 1.4; why[g] = why[g] || 'dịch bệnh'; }
          if (han && g === 'thao') { sp *= 0.6; why[g] = 'hạn hán'; }
          if (lu && g === 'thao') { sp *= 0.8; why[g] = 'lũ lụt'; }
          if (hoiTru) { sp *= 0.85; why[g] = why[g] || 'thương hội tích trữ'; }
          if (hoiXa) { sp *= 1.3; why[g] = why[g] || 'thương hội xả hàng'; }
          if (rift && (g === 'khoang' || g === 'yeu' || g === 'khi')) { sp *= 0.82; why[g] = why[g] || 'ải đóng, thuế tăng'; }
          const dd = eco.shockMul(rid, g, 'd', now), sm = eco.shockMul(rid, g, 's', now);
          if (dd !== 1) { d *= dd; why[g] = why[g] || (dd > 1 ? 'mùa đột phá' : ''); }
          if (sm !== 1) { sp *= sm; why[g] = why[g] || (sm > 1 ? 'tông mở kho hoặc mùa bội thu' : 'đường buôn phong tỏa'); }
          if (si < 0.5 && (g === 'dan' || g === 'sach')) why[g] = why[g] || 'tông đóng kho hoặc suy tàn';
          ds[g] = d; ss[g] = Math.max(0.15, sp);
        });
        s.d[rid] = ds; s.s[rid] = ss; s.why[rid] = why;
        E.groups.forEach(g => {
          const star = clamp(eco.spec(rid, g) * Math.pow(ds[g] / ss[g], 1 / (E.e[g] + E.es[g])), E.pMin, E.pMax - delta);
          const prev = s.p[rid][g], next = clamp(prev + E.adj * (star - prev) + prev * rng.R(-0.015, 0.015), E.pMin, E.pMax - delta);
          s.p[rid][g] = next; pr[rid + '|' + g] = next;
        });
      });
      // thương hội ép chênh giá giữa vùng (arbitrage): hàng chảy từ nơi rẻ sang nơi đắt, bớt cước
      D.EDGES.forEach(e => {
        E.groups.forEach(g => {
          [[e.a, e.b], [e.b, e.a]].forEach(pair => {
            const hi = pair[0], lo = pair[1], ph = s.p[hi][g], pl = s.p[lo][g];
            const cuoc = (e.caravan ? 0.12 : 0.22) + (TT.fac.atFront(hi) || TT.fac.atFront(lo) ? 0.06 : 0);
            const gap = ph / eco.spec(hi, g) - (pl / eco.spec(lo, g)) * (1 + cuoc); if (gap <= 0) return;
            const k = (0.05 + 0.3 * TT.fac.hoiCover(hi)) * gap;
            s.p[hi][g] = clamp(s.p[hi][g] - k * 0.6 * eco.spec(hi, g), E.pMin, E.pMax); s.p[lo][g] = clamp(s.p[lo][g] + k * 0.4 * eco.spec(lo, g), E.pMin, E.pMax);
          });
        });
      });
      // lịch sử, hồi sức ép, tin giá
      const pl = TT.player();
      if (pl && pl.alive !== false) TT.items.tick(pl);
      D.REGIONS.forEach(r => E.groups.forEach(g => {
        const h = s.h[r.id][g]; h.push(Math.round(s.p[r.id][g] * 1000) / 1000); if (h.length > E.hist) h.shift();
        const k = r.id + '|' + g; if (s.press[k]) { s.press[k] *= (1 - E.press.rec); if (Math.abs(s.press[k]) < 0.002) delete s.press[k]; }
        const rl = eco.rel(r.id, g), key = r.id + g;
        s.note = s.note || {};
        if (Math.abs(rl - 1) > 0.32 && (s.note[key] || -999) + 18 <= now) {
          s.note[key] = now; const cause = s.why[r.id][g];
          TT.fac.chron(E.names[g] + ' ở ' + regName(r.id) + (rl > 1 ? ' đang đắt vọt' : ' đang rẻ hẳn') + (cause ? ' (' + cause + ')' : '') + '.', 'age', !!(pl && pl.region === r.id));
        }
      }));
    },
    // Tóm tắt giá một vùng cho Nha môn: những nhóm lệch nhiều nhất so với bình thường.
    board(rid) {
      return E.groups.map(g => ({ g, rel: eco.rel(rid, g), why: eco.why(rid, g) })).sort((a, b) => Math.abs(b.rel - 1) - Math.abs(a.rel - 1));
    },
    // Cú sốc sắp xảy ra ở vùng (cho người có tin sớm).
    upcoming(rid) { const s = eco.S(), now = TT.world.months; return s.sh.filter(x => x.region === rid && x.start > now).map(x => ({ kind: x.kind, in: x.start - now, text: E.shocks[x.kind].text })); },
    // Cấp "nhìn thấu" thị trường: nghề Thương nhân cộng bậc hội, tối đa 5.
    insight(c) {
      let lv = 0;
      if (c.job && TT.job) { lv = c.job.main === 'thuong_nhan' ? TT.job.level(c, 'thuong_nhan') : c.job.sub === 'thuong_nhan' ? Math.floor(TT.job.level(c, 'thuong_nhan') * 0.6) : 0; }
      lv = Math.min(5, Math.floor(lv / 2));
      if (TT.hoi && TT.hoi.member(c)) lv = Math.min(5, lv + 1);
      return lv;
    }
  };
})();
