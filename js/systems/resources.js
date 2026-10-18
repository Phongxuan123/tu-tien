// Tài nguyên trên bản đồ: mức của từng địa điểm, kho tài nguyên hao khi thu hoạch và hồi theo năm, chủ sở hữu, hệ số thu hoạch cho nghề và luyện nghề.
// Kho lưu ở world.resNodes[địa điểm][loại] (0-100), khởi tạo muộn nên không đổi phiên bản bản lưu.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, RR = D.RES_RULES;

  const hash = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h; };
  const cache = {}, zoneCache = {}, zoneById = {};
  const sc = s => (hash(s) * 48271) % 2147483647; // trộn thêm để các mã chỉ khác nhau chữ số cuối không cho kết quả gần nhau

  const res = TT.res = {
    // Mức tài nguyên của một địa điểm: { linh, ls, ore, herb, beast } (0-3).
    levels(placeId) {
      if (cache[placeId]) return cache[placeId];
      if (placeId.charAt(1) === ':') { const z = res.zone(placeId), o = { linh: 0, ls: 0, ore: 0, herb: 0, beast: 0 }; if (z) o[z.kind] = z.lv; return (cache[placeId] = o); }
      const pl = TT.map.place(placeId), out = { linh: 0, ls: 0, ore: 0, herb: 0, beast: 0 };
      if (!pl) return out;
      const st = TT.map.placeStats(pl);
      out.linh = Math.max(0, Math.min(3, st.linh - 4)); // chỉ nơi linh khí từ 5/6 mới hiện là linh mạch
      const base = pl.type === 'tong_mon' ? res.sectBase(placeId) : (D.RES_BASE[pl.type] || {}), rg = D.RES_REGION[pl.region] || {};
      ['ls', 'ore', 'herb', 'beast'].forEach(k => {
        const b = base[k] || 0, h = hash(placeId + k);
        let v = 0;
        if (b > 0) { v = b + (rg[k] || 0) + (h % 5 === 0 ? -1 : h % 7 === 0 ? 1 : 0); v = Math.max(1, Math.min(3, v)); }
        else if ((pl.type === 'thon_tran' || pl.type === 'bo_toc') && (rg[k] || 0) > 0 && h % 3 !== 0) v = 1;
        out[k] = v;
      });
      cache[placeId] = out;
      return out;
    },
    // Tông môn: quặng theo số mỏ của tông, dược liệu theo hệ Mộc và Thủy.
    sectBase(id) {
      const d = D.SECTS[id]; if (!d) return {};
      const herb = id === 'nl_bach_thao' ? 3 : d.elems.indexOf('Mộc') >= 0 ? 2 : d.elems.indexOf('Thủy') >= 0 ? 1 : 0;
      return { ore: Math.min(3, d.mo || 0), herb, ls: id === 'bb_huyen_bang' ? 1 : 0 };
    },
    // Kho còn lại (0-100) của một loại tại một địa điểm.
    stock(placeId, kind) {
      const w = TT.world; if (!w) return 100;
      const n = w.resNodes && w.resNodes[placeId];
      return n && n[kind] != null ? n[kind] : 100;
    },
    // Tổng quan để hiển thị: mỗi loại có mức, kho. Chỉ liệt kê loại có mức > 0.
    list(placeId) {
      const lv = res.levels(placeId);
      return D.RES_IDS.filter(k => lv[k] > 0).map(k => ({ id: k, lv: lv[k], stock: k === 'linh' ? 100 : res.stock(placeId, k) }));
    },
    // Chủ của địa điểm: tông môn nếu là tông, thế lực có nhà ở đó (gia tộc), còn lại là vương triều của vùng.
    owner(placeId) {
      const pl = TT.map.place(placeId); if (!pl || !TT.world || !TT.world.fac) return null;
      const L = TT.fac.list(), own = L.find(x => (x.kind === 'tong' || x.kind === 'gia') && x.home === placeId && TT.fac.alive(x));
      if (own) return own;
      if (pl.type === 'tong_mon') return null;
      return L.find(x => x.kind === 'trieu' && x.region === pl.region && TT.fac.alive(x)) || null;
    },
    // Hệ số thu hoạch của người chơi ở chỗ đang đứng (0,35 nếu chỉ lượm lặt; cạn kho thì giảm mạnh).
    power(c, kind) {
      const pid = res.siteId(c);
      if (!pid) return RR.mul[0];
      const lv = res.levels(pid)[kind] || 0, st = res.stock(pid, kind);
      return RR.mul[lv] * (st < 15 ? 0.3 : 0.4 + 0.6 * st / 100);
    },
    // Nơi đang thu hoạch: khu tài nguyên nếu đang ở khu, không thì địa điểm đang đứng (null nếu đang đi đường).
    siteId(c) {
      const z = res.zoneOf(c); if (z) return z.id;
      return c.place && !c.travel && !c.cross ? c.place : null;
    },
    level(c, kind) { const pid = res.siteId(c); return pid ? res.levels(pid)[kind] || 0 : 0; },
    // Hao kho khi thu được vật phẩm ở chỗ đang đứng.
    take(c, kind, amt) {
      const pid = res.siteId(c), w = TT.world;
      if (!pid || !res.level(c, kind)) return;
      w.resNodes = w.resNodes || {};
      const n = w.resNodes[pid] = w.resNodes[pid] || {};
      n[kind] = Math.max(0, (n[kind] != null ? n[kind] : 100) - amt);
    },

    // ---------- khu tài nguyên (vệ tinh của địa điểm, nối bằng đường mòn) ----------
    // Mỗi vùng có vài khu ngoài các địa điểm chính: vỉa quặng, bãi thảo dược, săn trường, vỉa linh thạch. Giàu hơn địa điểm thường (mức 2-3),
    // nhưng không có cửa hàng, nguy hiểm hơn, và phải đi từ địa điểm chủ (mất thời gian). Sinh tất định theo vùng và vị trí địa điểm.
    zones(rid) {
      if (zoneCache[rid]) return zoneCache[rid];
      const places = TT.map.placesOf(rid), out = [], rg = D.RES_REGION[rid] || {};
      if (!places.length) return (zoneCache[rid] = out);
      const hosts = places.filter(p => ['thon_tran', 'bo_toc', 'tong_mon', 'mo', 'linh_mach', 'tan_tich', 'phuong', 'thanh_tri'].indexOf(p.type) >= 0);
      const W = { ore: 1 + (rg.ore || 0) * 1.5, herb: 1 + (rg.herb || 0) * 1.5, beast: 1 + (rg.beast || 0) * 1.5, ls: 0.5 + (rg.ls || 0) * 1.5 }, kinds = Object.keys(W);
      const used = {};
      for (let i = 0; i < D.RES_ZONE.perRegion && hosts.length; i++) {
        const h0 = sc(rid + 'z' + i), host = hosts[(h0 + i * 7) % hosts.length];
        if (used[host.id] >= 2) continue;
        let tot = 0; kinds.forEach(k => { tot += W[k]; });
        let r = (sc(rid + 'k' + i) % 1000) / 1000 * tot, kind = kinds[0];
        for (const k of kinds) { r -= W[k]; if (r <= 0) { kind = k; break; } }
        // chọn hướng có nhiều chỗ trống nhất quanh địa điểm chủ
        let best = null;
        for (let a = 0; a < 16; a++) {
          const ang = (a + (h0 % 16) / 16) / 16 * Math.PI * 2, x = host.x + Math.cos(ang) * D.RES_ZONE.dist, y = host.y + Math.sin(ang) * D.RES_ZONE.dist;
          if (x < 60 || x > 740 || y < 70 || y > 515) continue;
          let md = 1e9; places.forEach(p => { md = Math.min(md, Math.hypot(p.x - x, p.y - y)); }); out.forEach(z => { md = Math.min(md, Math.hypot(z.x - x, z.y - y) * 1.1); });
          if (!best || md > best.md) best = { x, y, md };
        }
        if (!best || best.md < D.RES_ZONE.minGap) continue;
        used[host.id] = (used[host.id] || 0) + 1;
        const lv = 2 + (sc(rid + 'l' + i) % 3 === 0 ? 1 : 0), reg = TT.map.region(rid);
        out.push({
          id: 'z:' + rid + ':' + i, rid, kind, lv, host: host.id, x: Math.round(best.x), y: Math.round(best.y), months: 1,
          n: D.RES_ZONE.names[kind][sc(rid + 'n' + i) % D.RES_ZONE.names[kind].length] + ' ' + host.n.split(' ').slice(0, 2).join(' '),
          danger: Math.min(4, D.RES_ZONE.danger[kind] + (reg ? Math.floor(reg.danger / 3) : 0))
        });
      }
      zoneCache[rid] = out;
      zoneCache[rid].forEach(z => { zoneById[z.id] = z; });
      return out;
    },
    zone(id) { if (zoneById[id]) return zoneById[id]; const p = String(id).split(':'); if (p[0] !== 'z' || !D.MAPS[p[1]]) return null; res.zones(p[1]); return zoneById[id] || null; },
    zonesAt(placeId) { const pl = TT.map.place(placeId); return pl ? res.zones(pl.region).filter(z => z.host === placeId) : []; },
    // Khu người chơi đang ở (đã tới nơi), hoặc null.
    zoneOf(c) {
      const z = c && c.zone; if (!z || c.travel || c.cross || c.place !== z.host || TT.world.months < z.arrive) return null;
      return res.zone(z.id);
    },
    goZone(c, zid) {
      const z = res.zone(zid);
      if (!z) return { ok: false, text: 'Không có khu này.' };
      if (c.travel || c.cross || c.place !== z.host) return { ok: false, text: 'Phải đứng ở ' + TT.map.place(z.host).n + ' mới đi tới khu này.' };
      if (c.dungeon) return { ok: false, text: 'Đang trong bí cảnh.' };
      c.zone = { id: z.id, host: z.host, arrive: TT.world.months + z.months }; c.autoMove = false; c.dest = null;
      TT.log(c, 'Bạn đi theo đường mòn tới ' + z.n + ' (' + z.months + ' tháng).', 'age');
      return { ok: true, text: 'Bạn lên đường tới ' + z.n + '. Ở đó không có cửa hàng, nguy hiểm hơn, nhưng thu hoạch ' + D.RES[z.kind].short + ' nhiều hơn.' };
    },
    leaveZone(c) {
      if (!c.zone) return { ok: false, text: 'Bạn không ở khu nào.' };
      const z = res.zone(c.zone.id); c.zone = null;
      if (z) TT.log(c, 'Bạn rời ' + z.n + ', quay lại ' + TT.map.place(z.host).n + '.', 'age');
      return { ok: true, text: 'Bạn đã quay về.' };
    },
    // Mỗi tháng ở khu: có thể gặp nguy hiểm.
    zoneMonth(c) {
      const z = res.zoneOf(c); if (!z) return;
      if (rng.P(0.015 * z.danger * (c.kind === 'player' ? TT.path.mods(c).risk : 1))) {
        const dmg = Math.round(6 * (1 + c.realm) * (0.6 + 0.2 * z.danger)); TT.ev.hp(c, -dmg);
        TT.log(c, 'Ở ' + z.n + ', bạn gặp ' + (z.kind === 'beast' ? 'thú dữ' : z.kind === 'herb' ? 'độc trùng' : 'sập hầm, đá lở') + ', sinh lực -' + dmg + '.', 'bad');
      }
    },
    // Làm việc ở khu: ai cũng lượm được chút nguyên liệu của khu (không cần nghề), nghề đúng loại thu thêm qua jobs.work.
    zoneWork(c) {
      const z = res.zoneOf(c); if (!z || c.kind !== 'player') return;
      const pw = res.power(c, z.kind), R = D.RES_RULES;
      if (z.kind === 'ore' && rng.P(Math.min(0.9, 0.3 * pw))) { TT.items.add(c, TT.craft.ORE[0], 2); res.take(c, 'ore', R.takeOre); }
      else if (z.kind === 'herb' && rng.P(Math.min(0.9, 0.3 * pw))) { TT.items.add(c, 'linh_thao', 2); res.take(c, 'herb', R.takeHerb); }
      else if (z.kind === 'beast' && rng.P(Math.min(0.9, 0.2 * pw))) { TT.items.add(c, 'yeu_dan'); res.take(c, 'beast', R.takeBeast); }
      else if (z.kind === 'ls' && rng.P(Math.min(0.5, 0.05 * pw))) { TT.ls.gain(c, 1); res.take(c, 'ls', R.takeLs * 5); TT.log(c, 'Bạn nhặt được một hạ phẩm linh thạch thô ở ' + z.n + '.', 'good'); }
    },
    // Mỗi năm kho hồi dần.
    yearly() {
      const w = TT.world; if (!w || !w.resNodes) return;
      Object.keys(w.resNodes).forEach(pid => {
        const n = w.resNodes[pid];
        Object.keys(n).forEach(k => { n[k] = Math.min(100, n[k] + RR.regen); if (n[k] >= 100) delete n[k]; });
        if (!Object.keys(n).length) delete w.resNodes[pid];
      });
    },
    // Số lượng thế lực kiểm soát tài nguyên theo vùng (để hiển thị).
    summary(rid) {
      const out = { linh: 0, ls: 0, ore: 0, herb: 0, beast: 0 };
      TT.map.placesOf(rid).forEach(p => { const lv = res.levels(p.id); D.RES_IDS.forEach(k => { out[k] += lv[k]; }); });
      return out;
    }
  };
})();
