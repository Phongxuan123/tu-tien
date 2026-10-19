// Bản đồ hai tầng: đại địa đồ (9 vùng) và bản đồ nhỏ của từng vùng (10 địa điểm).
// Tra cứu, tìm đường trong vùng (Dijkstra), di chuyển mất thời gian, môi trường và thời tiết, hợp thuộc tính.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng;

  const regById = {}, placeById = {}, regPlaces = {}, localAdj = {}, macroAdj = {};
  D.REGIONS.forEach(r => { regById[r.id] = r; regPlaces[r.id] = []; macroAdj[r.id] = []; });
  D.EDGES.forEach(e => { macroAdj[e.a].push({ to: e.b, edge: e }); macroAdj[e.b].push({ to: e.a, edge: e }); });

  Object.keys(D.MAPS).forEach(rid => {
    const m = D.MAPS[rid];
    m.places.forEach(row => {
      const p = { id: row[0], region: rid, n: row[1], type: row[2], faction: row[3], x: 0, y: 0, gate: m.gate === row[0], portal: m.portal === row[0] };
      placeById[p.id] = p;
      regPlaces[rid].push(p);
      localAdj[p.id] = [];
    });
    m.roads.forEach(r => {
      localAdj[r[0]].push({ to: r[1], m: r[2] });
      localAdj[r[1]].push({ to: r[0], m: r[2] });
    });
  });

  // Bố trí cố định các địa điểm trong từng bản đồ nhỏ bằng thuật toán lực (tất định, luôn cho cùng kết quả).
  function layoutRegion(rid) {
    const ps = regPlaces[rid], n = ps.length, idx = {};
    ps.forEach((p, i) => { idx[p.id] = i; });
    const pos = ps.map((p, i) => {
      const a = 2 * Math.PI * i / n;
      return { x: 400 + Math.cos(a) * 220, y: 280 + Math.sin(a) * 170 };
    });
    const edges = D.MAPS[rid].roads.map(r => [idx[r[0]], idx[r[1]], r[2]]);
    for (let it = 0; it < 600; it++) {
      const cool = 1 - it / 600;
      const f = pos.map(() => ({ x: 0, y: 0 }));
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
          const d2 = dx * dx + dy * dy + 0.01, d = Math.sqrt(d2), k = 14000 / d2;
          f[i].x += dx / d * k; f[i].y += dy / d * k;
          f[j].x -= dx / d * k; f[j].y -= dy / d * k;
        }
      }
      edges.forEach(e => {
        const a = pos[e[0]], b = pos[e[1]];
        const dx = b.x - a.x, dy = b.y - a.y, d = Math.sqrt(dx * dx + dy * dy) + 0.01;
        const k = (d - (60 + 40 * e[2])) * 0.06;
        f[e[0]].x += dx / d * k; f[e[0]].y += dy / d * k;
        f[e[1]].x -= dx / d * k; f[e[1]].y -= dy / d * k;
      });
      pos.forEach((p, i) => {
        f[i].x += (400 - p.x) * 0.012; f[i].y += (280 - p.y) * 0.012;
        const lim = 12 * cool + 0.5;
        p.x += Math.max(-lim, Math.min(lim, f[i].x));
        p.y += Math.max(-lim, Math.min(lim, f[i].y));
      });
    }
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    pos.forEach(p => { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); });
    const s = Math.min(620 / Math.max(1, maxX - minX), 400 / Math.max(1, maxY - minY));
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    ps.forEach((p, i) => {
      p.x = Math.round(400 + (pos[i].x - cx) * s);
      p.y = Math.round(280 + (pos[i].y - cy) * s);
    });
  }
  Object.keys(regPlaces).forEach(layoutRegion);

  const statCache = {}, siteIds = {};

  // Nơi thờ tự (S5): đăng ký lúc chạy, không nằm trong D.MAPS và không lưu. Gắn vào địa điểm neo bằng một đường ngắn (nút lá, không làm đổi đường đi khác).
  function siteAt(rid, anchor) {
    const ps = regPlaces[rid], R = 78; let best = null;
    for (let k = 0; k < 8; k++) {
      const a = -Math.PI / 2 + k * Math.PI / 4 + 0.3, x = Math.max(36, Math.min(764, Math.round(anchor.x + Math.cos(a) * R))), y = Math.max(36, Math.min(524, Math.round(anchor.y + Math.sin(a) * R)));
      let d = Infinity; ps.forEach(p => { d = Math.min(d, Math.hypot(p.x - x, p.y - y)); });
      if (!best || d > best.d + 0.5) best = { x, y, d };
    }
    return best;
  }
  function addSite(s) {
    const anchor = placeById[s.anchor]; if (!anchor) return null;
    const pos = siteAt(s.region, anchor), m = D.FAITH ? D.FAITH.site.months : 1;
    const p = { id: s.id, region: s.region, n: s.n, type: 'tho_tu', faction: 'Nơi thờ tự', x: pos.x, y: pos.y, gate: false, portal: false, site: true, anchor: anchor.id, faith: s.faith, rank: s.rank };
    placeById[p.id] = p; regPlaces[s.region].push(p); siteIds[p.id] = true;
    localAdj[p.id] = [{ to: anchor.id, m }]; localAdj[anchor.id].push({ to: p.id, m });
    D.MAPS[s.region].roads.push([p.id, anchor.id, m]);
    return p;
  }
  function removeSite(id) {
    const p = placeById[id]; if (!p) { delete siteIds[id]; return; }
    regPlaces[p.region] = regPlaces[p.region].filter(q => q.id !== id);
    if (localAdj[p.anchor]) localAdj[p.anchor] = localAdj[p.anchor].filter(e => e.to !== id);
    D.MAPS[p.region].roads = D.MAPS[p.region].roads.filter(r => r[0] !== id && r[1] !== id);
    delete localAdj[id]; delete placeById[id]; delete statCache[id]; delete siteIds[id];
  }

  const map = TT.map = {
    region: id => regById[id] || null,
    place: id => placeById[id] || null,
    placesOf: rid => regPlaces[rid] || [],
    gateOf: rid => D.MAPS[rid].gate,
    portalOf: rid => D.MAPS[rid].portal,
    macroNeighbors: rid => macroAdj[rid] || [],
    // Đồng bộ danh sách nơi thờ tự (id, region, n, faith, rank, anchor): thêm nơi mới, bỏ nơi không còn, cập nhật tên và tín ngưỡng. Không dùng rng.
    syncSites(list) {
      const keep = {}; list.forEach(s => { keep[s.id] = 1; });
      Object.keys(siteIds).forEach(id => { if (!keep[id]) removeSite(id); });
      list.forEach(s => { const p = placeById[s.id] || addSite(s); if (p) { p.n = s.n; p.faith = s.faith; p.rank = s.rank; } });
    },
    edgeBetween(a, b) {
      return D.EDGES.find(e => (e.a === a && e.b === b) || (e.a === b && e.b === a)) || null;
    },

    // Chỉ số nền của một địa điểm: kế thừa từ vùng rồi cộng theo loại.
    placeStats(p) {
      if (statCache[p.id]) return statCache[p.id];
      const reg = regById[p.region], t = D.PLACE_TYPES[p.type];
      const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
      return (statCache[p.id] = {
        linh: cl(reg.linh + t.linh, 1, 6),
        danger: cl(reg.danger + t.danger, 0, 6),
        rich: cl(reg.rich + t.rich, 0, 6)
      });
    },

    linhFactor: s => 0.7 + 0.1 * s.linh,
    richFactor: s => 0.7 + 0.15 * s.rich,
    dangerFortune: danger => 1 + 0.15 * danger,

    // Đường ngắn nhất trong cùng một vùng theo số tháng. Trả về { path, months } hoặc null.
    localRoute(from, to) {
      const a = placeById[from], b = placeById[to];
      if (!a || !b || a.region !== b.region) return null;
      const dist = {}, prev = {}, done = {};
      regPlaces[a.region].forEach(p => { dist[p.id] = Infinity; });
      dist[from] = 0;
      for (let i = 0; i < regPlaces[a.region].length; i++) {
        let u = null;
        for (const id in dist) if (!done[id] && (u === null || dist[id] < dist[u])) u = id;
        if (u === null || dist[u] === Infinity) break;
        done[u] = true;
        localAdj[u].forEach(e => {
          if (dist[u] + e.m < dist[e.to]) { dist[e.to] = dist[u] + e.m; prev[e.to] = u; }
        });
      }
      if (dist[to] === Infinity) return null;
      const path = [to];
      while (path[0] !== from) path.unshift(prev[path[0]]);
      return { path, months: dist[to] };
    },
    edgeMonths(a, b) {
      const e = (localAdj[a] || []).find(x => x.to === b);
      return e ? e.m : null;
    },

    // Phần điểm tư chất hợp với danh sách thuộc tính (0..1).
    fraction(c, elems) {
      const total = c.tuchat.total;
      if (!total) return 0;
      let p = 0;
      c.tuchat.attrs.forEach(a => { if (elems.indexOf(a.n) >= 0) p += a.p; });
      return p / total;
    },
    affinity: (c, reg) => map.fraction(c, reg.elems),
    trainBonus: (c, reg) => 1 + 0.8 * map.affinity(c, reg),
    // Kháng môi trường: thuộc tính hợp, niệm lực và cảnh giới.
    resistance(c, reg) {
      const S = TT.stats;
      return rng.clamp(map.fraction(c, reg.env.resist) + S.nl(c) / 250 + c.realm * 0.07, 0, 0.9);
    },

    // ---- Thời tiết ----
    activeWeather(rid) {
      const w = TT.world, cur = w.weather && w.weather[rid];
      if (!cur) return null;
      return { def: regById[rid].weather[cur.i], until: cur.until };
    },
    stepWeather(rid) {
      const w = TT.world;
      w.weather = w.weather || {};
      const reg = regById[rid], cur = w.weather[rid];
      if (cur && w.months >= cur.until) {
        const def = reg.weather[cur.i];
        delete w.weather[rid];
        TT.news('Ở ' + reg.n + ', "' + def.name + '" đã qua.', '', []);
      }
      if (!w.weather[rid]) {
        for (let i = 0; i < reg.weather.length; i++) {
          const def = reg.weather[i];
          if (rng.P(def.chance)) {
            w.weather[rid] = { i, until: w.months + rng.RI(Math.ceil(def.dur * 0.7), Math.ceil(def.dur * 1.3)) };
            const bad = (def.danger || 0) > 0 || (def.hpDrain || 0) > 0 || def.gold < 1;
            TT.news('Ở ' + reg.n + ': ' + def.name + '. ' + def.desc, bad ? 'bad' : 'good', []);
            break;
          }
        }
      }
    },

    // Hiệu ứng tổng hợp của nơi nhân vật đang ở (địa điểm, môi trường, thời tiết).
    effects(c) {
      const reg = regById[c.region];
      const place = c.place && !c.travel ? placeById[c.place] : null;
      const wx = map.activeWeather(c.region), def = wx && wx.def;
      const res = map.resistance(c, reg);
      let stats;
      if (place) stats = map.placeStats(place);
      else stats = { linh: reg.linh, danger: 0, rich: reg.rich }; // đang trên đường: không bị thương theo địa điểm
      const envTrain = 1 - (1 - reg.env.trainMul) * (1 - res);
      let wxTrain = 1;
      if (def) {
        wxTrain = def.train || 1;
        if (def.elemBuff) wxTrain *= 1 + (def.elemBuff.train - 1) * Math.min(1, map.fraction(c, def.elemBuff.elems) * 1.5);
      }
      return {
        reg, place, stats, def, res,
        danger: stats.danger + (def ? (def.danger || 0) : 0) * (place ? 1 : 0) + (place ? TT.fac.dangerAt(c.region) : 0),
        hpDrain: (reg.env.hpDrain + (def ? (def.hpDrain || 0) : 0)) * (1 - res),
        train: envTrain * wxTrain,
        gold: reg.env.goldMul * (def ? (def.gold || 1) : 1) * TT.fac.goldMul(c.region),
        healMul: reg.env.healMul,
        travelMul: def ? (def.travel || 1) : 1
      };
    },

    // ---- Đi lại trong vùng ----
    ensureTaste(c) {
      c.taste = c.taste || {};
      regPlaces[c.region].forEach(p => {
        if (c.taste[p.id] == null) c.taste[p.id] = Math.round(rng.R(0.7, 1.4) * 100) / 100;
      });
    },

    startTravel(c, dest) {
      if (c.travel || c.cross || !c.place || dest === c.place) return false;
      c.zone = null; // rời khu tài nguyên khi lên đường
      const d = placeById[dest];
      if (!d || d.region !== c.region) return false;
      const rt = map.localRoute(c.place, dest);
      if (!rt || rt.path.length < 2) return false;
      const next = rt.path[1], now = TT.world.months;
      const wx = map.activeWeather(c.region);
      const mul = wx && wx.def.travel ? wx.def.travel : 1;
      const m = Math.max(1, Math.round(map.edgeMonths(c.place, next) * mul));
      c.dest = dest;
      c.travel = { from: c.place, to: next, start: now, arrive: now + m };
      TT.log(c, 'Bạn lên đường từ ' + placeById[c.place].n + ' tới ' + placeById[next].n +
        (next !== dest ? ' (đích: ' + placeById[dest].n + ')' : '') + ', mất ' + m + ' tháng.', 'age');
      return true;
    },

    stepTravel(c) {
      const t = c.travel;
      if (!t || TT.world.months < t.arrive) return;
      c.place = t.to;
      c.travel = null;
      TT.log(c, 'Bạn đã tới ' + placeById[c.place].n + '.', 'age');
      if (c.dest && c.dest !== c.place) map.startTravel(c, c.dest);
      else c.dest = null;
    }
  };
})();
