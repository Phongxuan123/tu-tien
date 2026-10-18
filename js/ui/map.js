// Bản đồ hai tầng (SVG): "Bản đồ vùng" cho các địa điểm trong vùng đang ở, "Đại địa đồ" cho 9 vùng lớn.
// Vùng chưa biết hiện là "???". Có chi tiết địa điểm/vùng, danh sách người, đi tới nơi khác và vượt vùng.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, S = TT.stats, h = ui.h, $ = ui.$;
  const NS = 'http://www.w3.org/2000/svg';

  ui.mapView = 'local';
  ui.selectedPlace = null;
  ui.selectedRegion = null;

  let svgKey = '', headKey = '', peopleHtml = '';
  let nodeEls = {}, countEls = {}, resEls = {}, zoneEls = {}, marker = null, ring = null, curRegionForLocal = null;
  ui.selectedZone = null;
  ui.mapRes = true; // lớp tài nguyên trên bản đồ vùng
  try { if (localStorage.getItem('tt8b_mapres') === '0') ui.mapRes = false; } catch (e) { /* bỏ qua */ }

  const TYPE_COLOR = {
    city: '#c9a45a', town: '#9a8f7e', port: '#4b88b8', guild: '#d9a441', sect: '#6fa86b', tribe: '#b57edc',
    vein: '#6a9ac4', secret: '#c4553f', ruin: '#8a7f6a', mine: '#8a93a3', market: '#7a6f9b', gate: '#e8e8e8'
  };

  function sv(tag, attrs, text) {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (text != null) el.textContent = text;
    return el;
  }
  function clearSvg() { const s = $('map-svg'); while (s.firstChild) s.removeChild(s.firstChild); nodeEls = {}; countEls = {}; resEls = {}; zoneEls = {}; marker = null; ring = null; }

  function makeMarker(svg) {
    marker = sv('g', { class: 'marker' });
    marker.appendChild(sv('circle', { r: 9, fill: '#d9a441', stroke: '#14110f', 'stroke-width': 2 }));
    marker.appendChild(sv('text', { y: -14, 'text-anchor': 'middle', class: 'marker-lbl' }, 'Bạn'));
    svg.appendChild(marker);
  }

  // ---------- biểu tượng địa điểm (vẽ bằng hình đơn giản, cỡ khoảng ±11) ----------
  function placeIcon(cls, col) {
    const g = sv('g', {});
    const add = (tag, a) => { a.stroke = a.stroke || '#14110f'; a['stroke-width'] = a['stroke-width'] || 1; a.fill = a.fill || col; g.appendChild(sv(tag, a)); };
    switch (cls) {
      case 'city': // thành có tường và tháp
        add('rect', { x: -10, y: -3, width: 20, height: 12 });
        [-10, -3.5, 3].forEach(x => add('rect', { x, y: -8, width: 5, height: 6 }));
        add('rect', { x: -2.5, y: 2, width: 5, height: 7, fill: '#14110f' }); break;
      case 'town': // nhà mái dốc
        add('rect', { x: -7, y: -1, width: 14, height: 9 });
        add('path', { d: 'M-9 -1 L0 -9 L9 -1 Z', fill: '#8a5a34' });
        add('rect', { x: -2, y: 3, width: 4, height: 5, fill: '#14110f' }); break;
      case 'port': // thuyền buồm
        add('path', { d: 'M-9 3 L9 3 L6 8 L-6 8 Z', fill: '#6a4a30' });
        add('path', { d: 'M0 -9 L7 1 L0 1 Z', fill: '#f2ead6' });
        add('line', { x1: 0, y1: -9, x2: 0, y2: 3 }); break;
      case 'guild': // quầy buôn với đồng tiền
        add('rect', { x: -9, y: -1, width: 18, height: 9 });
        add('path', { d: 'M-10 -1 L-7 -8 L7 -8 L10 -1 Z', fill: '#c0392b' });
        add('circle', { cx: 0, cy: 4, r: 2.6, fill: '#f6d46b' }); break;
      case 'sect': // cổng dịch chuyển: hai trụ đá, xà ngang, vòng xoáy ở giữa
        add('rect', { x: -11, y: -9, width: 4, height: 18, fill: '#8f8a80' });
        add('rect', { x: 7, y: -9, width: 4, height: 18, fill: '#8f8a80' });
        add('rect', { x: -12, y: -11, width: 24, height: 4, fill: '#b9b3a6' });
        add('ellipse', { cx: 0, cy: 0.5, rx: 5.4, ry: 8, fill: '#1c4a30' });
        add('path', { d: 'M0 -6 A4.2 5.6 0 1 1 -4 0 A2.2 3 0 1 1 0 -2.6', fill: 'none', stroke: '#c8ffd6', 'stroke-width': 1.5 }); break;
      case 'tribe': // lều
        add('path', { d: 'M-10 8 L0 -9 L10 8 Z', fill: '#a8703e' });
        add('path', { d: 'M-2 8 L0 0 L2 8 Z', fill: '#14110f' });
        add('line', { x1: 0, y1: -9, x2: 0, y2: -12 }); break;
      case 'vein': // tinh thể
        add('path', { d: 'M0 -11 L7 -2 L3 9 L-3 9 L-7 -2 Z', fill: '#8fd0ff' });
        add('path', { d: 'M0 -11 L-3 -1 L0 9 M0 -11 L3 -1 L0 9', fill: 'none', stroke: '#e6f6ff', 'stroke-width': 0.8 }); break;
      case 'secret': // cổng xoáy
        add('circle', { cx: 0, cy: 0, r: 9, fill: '#6b2a8a' });
        add('path', { d: 'M0 -6 A6 6 0 1 1 -6 0 A3.5 3.5 0 1 1 0 -2.5', fill: 'none', stroke: '#e9c8ff', 'stroke-width': 1.5 }); break;
      case 'ruin': // cột đổ
        add('rect', { x: -9, y: -7, width: 4, height: 15, fill: '#bdb8a6' });
        add('rect', { x: -1.5, y: -2, width: 4, height: 10, fill: '#a39e8c' });
        add('rect', { x: 6, y: 1, width: 4, height: 7, fill: '#bdb8a6' });
        add('path', { d: 'M-9 -7 L-4 -9 L-5 -7', fill: '#bdb8a6' }); break;
      case 'mine': // cuốc chim và cửa hầm
        add('path', { d: 'M-10 8 L-5 -4 L5 -4 L10 8 Z', fill: '#6b6660' });
        add('path', { d: 'M-3 8 L-3 1 Q0 -2 3 1 L3 8 Z', fill: '#14110f' }); break;
      case 'market': // quầy hàng tối
        add('rect', { x: -9, y: 0, width: 18, height: 8, fill: '#2f2a44' });
        add('path', { d: 'M-10 0 L-8 -7 L8 -7 L10 0 Z', fill: '#6b5fa8' });
        add('circle', { cx: 0, cy: 4, r: 1.8, fill: '#f6d46b' }); break;
      default: // cửa ải: cổng vòm
        add('rect', { x: -10, y: -6, width: 20, height: 14, fill: '#9b958a' });
        add('path', { d: 'M-4 8 L-4 0 Q0 -5 4 0 L4 8 Z', fill: '#14110f' });
        [-10, 5].forEach(x => add('rect', { x, y: -9, width: 5, height: 4, fill: '#c0baae' }));
    }
    return g;
  }

  // ---------- đường cong giữa hai địa điểm ----------
  let roadCtl = {};
  function ctlOf(a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
    let hs = 7; const key = a.id < b.id ? a.id + b.id : b.id + a.id;
    for (let i = 0; i < key.length; i++) hs = (hs * 31 + key.charCodeAt(i)) % 1009;
    const bend = ((hs % 100) / 100 - 0.5) * 0.34 * len;
    return { x: (a.x + b.x) / 2 - dy / len * bend, y: (a.y + b.y) / 2 + dx / len * bend };
  }
  function quad(a, c, b, t) { const u = 1 - t; return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y }; }

  // ---------- dựng SVG ----------
  function buildLocal(rid) {
    const svg = $('map-svg');
    clearSvg(); roadCtl = {};
    const places = TT.map.placesOf(rid);
    const seaMode = ui.terrain && /sea$/.test(ui.terrain.mode(rid) || '');
    // nền địa hình
    let labelLayer = null;
    if (ui.terrain && ui.terrain.has(rid)) {
      const img = sv('image', { x: 0, y: 0, width: 800, height: 560, preserveAspectRatio: 'none' });
      svg.appendChild(img);
      const wait = sv('text', { x: 400, y: 280, class: 'node-terrain', 'text-anchor': 'middle' }, 'Đang vẽ địa hình…');
      svg.appendChild(wait);
      const t = ui.terrain.get(rid, places, res => { if (res.url) img.setAttribute('href', res.url); if (wait.parentNode) wait.parentNode.removeChild(wait); });
      if (t.url) { img.setAttribute('href', t.url); svg.removeChild(wait); }
      labelLayer = sv('g', { class: 'geo-layer' });
      t.labels.forEach(l => labelLayer.appendChild(sv('text', { x: l.x, y: l.y, class: 'geo' }, l.name)));
    }
    D.MAPS[rid].roads.forEach(r => {
      const a = TT.map.place(r[0]), b = TT.map.place(r[1]), c = ctlOf(a, b);
      roadCtl[a.id + '>' + b.id] = c; roadCtl[b.id + '>' + a.id] = c;
      const d = 'M' + a.x + ' ' + a.y + ' Q' + c.x.toFixed(1) + ' ' + c.y.toFixed(1) + ' ' + b.x + ' ' + b.y;
      if (!ui.terrain || !ui.terrain.has(rid)) { svg.appendChild(sv('path', { d, fill: 'none', class: 'edge' })); } else if (seaMode) {
        svg.appendChild(sv('path', { d, class: 'lane' }));
      } else { svg.appendChild(sv('path', { d, class: 'road-o' })); svg.appendChild(sv('path', { d, class: 'road-i' })); }
      const m = quad(a, c, b, 0.5);
      svg.appendChild(sv('text', { x: m.x, y: m.y + 3, class: 'road-lbl' }, r[2] + ' th'));
    });
    const zones = ui.mapRes ? TT.res.zones(rid) : [];
    zones.forEach(z => { // đường mòn tới khu tài nguyên: vạch đứt
      const h0 = TT.map.place(z.host), d = D.RES[z.kind];
      svg.appendChild(sv('line', { x1: h0.x, y1: h0.y, x2: z.x, y2: z.y, class: 'trail-o' }));
      svg.appendChild(sv('line', { x1: h0.x, y1: h0.y, x2: z.x, y2: z.y, class: 'trail', stroke: d.col }));
      svg.appendChild(sv('text', { x: (h0.x + z.x) / 2, y: (h0.y + z.y) / 2 - 4, class: 'road-lbl' }, z.months + ' th'));
    });
    if (labelLayer) svg.appendChild(labelLayer);
    places.forEach(pl => {
      const cls = D.PLACE_TYPES[pl.type].cls, col = TYPE_COLOR[cls];
      const g = sv('g', { class: 'node' });
      const ps = TT.map.placeStats(pl);
      g.appendChild(sv('title', {}, pl.n + ' · ' + D.PLACE_TYPES[pl.type].n + ' — Linh khí ' + ps.linh + '/6 · Nguy hiểm ' + ps.danger + '/6 · Phồn hoa ' + ps.rich + '/6' + (pl.type === 'tong_mon' ? ' · cổng truyền tống' : '')));
      g.appendChild(sv('circle', { cx: pl.x, cy: pl.y, r: 24, class: 'hit' }));
      g.appendChild(sv('circle', { cx: pl.x, cy: pl.y, r: 15.5, class: 'plate', fill: 'rgba(16,13,10,.78)', stroke: col, 'stroke-width': pl.gate || pl.portal ? 3 : 2, 'stroke-dasharray': pl.portal ? '4 3' : '0' }));
      const ic = placeIcon(cls, col); ic.setAttribute('transform', 'translate(' + pl.x + ',' + pl.y + ') scale(0.95)'); ic.setAttribute('pointer-events', 'none');
      g.appendChild(ic);
      g.appendChild(sv('text', { x: pl.x, y: pl.y + 30, class: 'node-name', 'text-anchor': 'middle' }, pl.n.length > 18 ? pl.n.slice(0, 17) + '…' : pl.n));
      g.appendChild(sv('text', { x: pl.x, y: pl.y + 42, class: 'node-terrain', 'text-anchor': 'middle' }, D.PLACE_TYPES[pl.type].n));
      const cnt = sv('text', { x: pl.x, y: pl.y - 22, class: 'node-count', 'text-anchor': 'middle' }, '');
      g.appendChild(cnt);
      if (ui.mapRes) {
        const lst = TT.res.list(pl.id), rs = lst.map(r => 4.5 + 1.5 * r.lv), total = rs.reduce((a, r) => a + 2 * r + 3, -3);
        let bx = pl.x - total / 2; resEls[pl.id] = {};
        lst.forEach((r, i) => {
          const R = rs[i], d = D.RES[r.id], b = sv('g', { class: 'rbadge', transform: 'translate(' + (bx + R) + ',' + (pl.y + 56) + ')' });
          b.appendChild(sv('title', {}, d.n + ' mức ' + r.lv + '/3' + (r.id === 'linh' ? '' : ' · kho ' + Math.round(r.stock) + '%')));
          b.appendChild(sv('circle', { r: R, fill: d.col, stroke: '#0d1117', 'stroke-width': 1.2 }));
          b.appendChild(sv('text', { y: R * 0.38, class: 'rb-ico', 'text-anchor': 'middle', 'font-size': Math.round(R * 1.15) }, d.icon));
          g.appendChild(b); resEls[pl.id][r.id] = b; bx += 2 * R + 3;
        });
      }
      g.addEventListener('click', () => { ui.selectedPlace = pl.id; ui.selectedZone = null; headKey = ''; ui.markDirty(); });
      svg.appendChild(g);
      nodeEls[pl.id] = g; countEls[pl.id] = cnt;
    });
    zones.forEach(z => { // nút khu tài nguyên
      const d = D.RES[z.kind], g = sv('g', { class: 'node zone' });
      g.appendChild(sv('circle', { cx: z.x, cy: z.y, r: 18, class: 'hit' }));
      g.appendChild(sv('circle', { cx: z.x, cy: z.y, r: 10 + z.lv, class: 'plate', fill: 'rgba(16,13,10,.82)', stroke: d.col, 'stroke-width': 2, 'stroke-dasharray': '3 2.5' }));
      g.appendChild(sv('text', { x: z.x, y: z.y + 4, class: 'rb-ico', fill: d.col, 'text-anchor': 'middle', 'font-size': 13, style: 'fill:' + d.col }, d.icon));
      g.appendChild(sv('text', { x: z.x, y: z.y + 26, class: 'node-name zone-name', 'text-anchor': 'middle' }, z.n.length > 22 ? z.n.slice(0, 21) + '…' : z.n));
      g.appendChild(sv('text', { x: z.x, y: z.y + 37, class: 'node-terrain', 'text-anchor': 'middle' }, d.n + ' ' + '★'.repeat(z.lv)));
      g.addEventListener('click', () => { ui.selectedZone = z.id; headKey = ''; ui.markDirty(); });
      svg.appendChild(g); zoneEls[z.id] = g;
    });
    const rg = TT.map.region(rid);
    svg.appendChild(sv('text', { x: 14, y: 26, class: 'geo-title' }, rg.n + ' · ' + rg.terrain));
    if (ui.mapRes) { // chú giải tài nguyên
      const lg = sv('g', { class: 'res-legend', transform: 'translate(14,' + (560 - 16) + ')' });
      let x = 0;
      D.RES_IDS.forEach(k => {
        const d = D.RES[k];
        lg.appendChild(sv('circle', { cx: x + 6, cy: -3, r: 6, fill: d.col, stroke: '#0d1117', 'stroke-width': 1 }));
        lg.appendChild(sv('text', { x: x + 6, y: 0.5, class: 'rb-ico', 'text-anchor': 'middle', 'font-size': 8 }, d.icon));
        const t = sv('text', { x: x + 16, y: 0, class: 'rl-txt' }, d.n); lg.appendChild(t); x += 22 + d.n.length * 5.6;
      });
      svg.appendChild(lg);
    }
    ring = sv('circle', { r: 21, class: 'sel-ring', fill: 'none' });
    svg.appendChild(ring);
    makeMarker(svg);
  }

  function buildCrossing() {
    const svg = $('map-svg');
    clearSvg();
    svg.appendChild(sv('text', { x: 400, y: 260, class: 'node-name', 'text-anchor': 'middle' }, 'Bạn đang trên đường vượt vùng.'));
    svg.appendChild(sv('text', { x: 400, y: 290, class: 'node-terrain', 'text-anchor': 'middle' }, 'Xem tiến độ ở Đại địa đồ.'));
  }

  function buildMacro(p) {
    const svg = $('map-svg');
    clearSvg();
    D.EDGES.forEach(e => {
      const a = TT.map.region(e.a), b = TT.map.region(e.b);
      svg.appendChild(sv('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, class: 'edge' }));
      const mine = !p.cross && (e.a === p.region || e.b === p.region);
      if (mine) {
        svg.appendChild(sv('text', { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 4, class: 'edge-lbl', 'text-anchor': 'middle' },
          D.REALM_NAMES[e.minRealm] + ' · ' + e.years + ' năm'));
      }
    });
    D.REGIONS.forEach(r => {
      const known = TT.cross.knows(p, r.id);
      const g = sv('g', { class: 'node' });
      g.appendChild(sv('circle', { cx: r.x, cy: r.y, r: 34, class: 'plate', fill: known ? r.color : '#555', 'fill-opacity': known ? 0.35 : 0.2, stroke: known ? r.color : '#777', 'stroke-width': 2 }));
      g.appendChild(sv('text', { x: r.x, y: r.y - 2, class: 'node-name', 'text-anchor': 'middle' }, known ? r.n : '???'));
      g.appendChild(sv('text', { x: r.x, y: r.y + 12, class: 'node-terrain', 'text-anchor': 'middle' }, known ? r.terrain : 'chưa biết'));
      g.addEventListener('click', () => { ui.selectedRegion = r.id; headKey = ''; ui.markDirty(); });
      svg.appendChild(g);
      nodeEls[r.id] = g;
    });
    ring = sv('circle', { r: 40, class: 'sel-ring', fill: 'none' });
    svg.appendChild(ring);
    makeMarker(svg);
  }

  // ---------- người ở một địa điểm ----------
  function peopleAt(placeId) {
    const w = TT.world;
    return Object.keys(w.chars).map(k => w.chars[k]).filter(c => c.alive && !c.travel && !c.cross && c.place === placeId);
  }

  // ---------- vị trí chấm "Bạn" ----------
  function localPos(p) {
    if (p.travel) {
      const a = TT.map.place(p.travel.from), b = TT.map.place(p.travel.to);
      const t = Math.min(1, Math.max(0, (TT.world.months - p.travel.start) / Math.max(1, p.travel.arrive - p.travel.start)));
      const c = roadCtl[a.id + '>' + b.id];
      if (c) return quad(a, c, b, t);
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    if (p.zone && TT.res) { // đang đi tới hoặc đang ở khu tài nguyên
      const z = TT.res.zone(p.zone.id), h0 = z && TT.map.place(z.host);
      if (z && h0 && p.place === z.host) {
        if (TT.res.zoneOf(p)) return { x: z.x + 14, y: z.y - 14 };
        const t = Math.min(1, Math.max(0, 1 - (p.zone.arrive - TT.world.months) / Math.max(1, z.months)));
        return { x: h0.x + (z.x - h0.x) * t, y: h0.y + (z.y - h0.y) * t };
      }
    }
    const pl = TT.map.place(p.place);
    return { x: pl.x + 20, y: pl.y - 20 };
  }
  function macroPos(p) {
    if (p.cross) {
      const a = TT.map.region(p.cross.from), b = TT.map.region(p.cross.to);
      const t = Math.min(1, Math.max(0, (TT.world.months - p.cross.start) / Math.max(1, p.cross.arrive - p.cross.start)));
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    }
    const r = TT.map.region(p.region);
    return { x: r.x + 26, y: r.y - 26 };
  }

  const bar = (label, v, cls, max) => '<div>' + label + ': <b>' + (Math.round(v * 10) / 10) + '/' + (max || 5) + '</b><div class="bar ' + cls +
    '"><i style="width:' + Math.min(100, v / (max || 5) * 100) + '%"></i></div></div>';

  // Khối tài nguyên của một địa điểm (mức, kho còn lại, chủ).
  function resHtml(pl) {
    const lst = TT.res.list(pl.id); if (!lst.length) return '';
    const own = TT.res.owner(pl.id);
    return '<div class="small pres"><b>Tài nguyên</b>' + (own ? ' (thuộc ' + ui.esc(own.n) + ')' : '') + ': ' + lst.map(r => {
      const d = D.RES[r.id], pct = r.id === 'linh' ? 100 : Math.round(r.stock);
      return '<span title="' + ui.esc(d.desc + (r.id === 'linh' ? '' : ' Kho còn ' + pct + '%, hao khi thu hoạch, hồi dần mỗi năm.')) + '"><span style="color:' + d.col + '">' + d.icon + '</span> ' + d.n + ' ' + '★'.repeat(r.lv) +
        (r.id !== 'linh' && pct < 60 ? ' <span class="' + (pct < 30 ? 'bad-txt' : 'dim') + '">(kho ' + pct + '%)</span>' : '') + '</span>';
    }).join(' · ') + '</div>';
  }

  // Dải môi trường và thời tiết của vùng đang đứng, nằm ngay dưới bản đồ.
  let envKey = '';
  function renderEnv(p) {
    const box = $('map-env'); if (!box) return;
    if (p.cross) { if (envKey !== 'x') { envKey = 'x'; box.innerHTML = ''; } return; }
    const reg = TT.map.region(p.region), wx = TT.map.activeWeather(reg.id), res = TT.map.resistance(p, reg);
    const key = reg.id + '|' + (wx ? wx.def.id + (wx.until - TT.world.months) : '') + '|' + Math.round(res * 100);
    if (key === envKey) return; envKey = key;
    let html = '<div><b>Môi trường:</b> ' + ui.esc(reg.env.name) + ' <span class="dim">(kháng ' + Math.round(res * 100) + '%' + (reg.env.resist.length ? ', hợp ' + reg.env.resist.join(', ') : '') + ')</span> — ' + ui.esc(reg.env.desc) + '</div>';
    if (wx) {
      const d = wx.def, bad = [], good = [];
      if (d.danger) bad.push('nguy hiểm +' + d.danger); if (d.hpDrain) bad.push('hao sinh lực +' + d.hpDrain + '/tháng'); if (d.travel) bad.push('đi đường chậm x' + d.travel); if (d.gold && d.gold < 1) bad.push('kiếm vàng giảm');
      if (d.train) good.push('tu luyện x' + d.train); if (d.gold && d.gold > 1) good.push('kiếm vàng x' + d.gold); if (d.elemBuff) good.push('người tu ' + d.elemBuff.elems.join('/') + ' tu luyện x' + d.elemBuff.train);
      html += '<div><b>Thời tiết:</b> ' + ui.esc(d.name) + ' <span class="dim">(còn ' + Math.max(0, wx.until - TT.world.months) + ' tháng)</span> — ' + ui.esc(d.desc) +
        (bad.length ? ' <span class="bad-txt">Bất lợi: ' + bad.join(', ') + '.</span>' : '') + (good.length ? ' <span class="good-txt">Có lợi: ' + good.join(', ') + '.</span>' : '') + '</div>';
    } else html += '<div><b>Thời tiết:</b> bình thường.</div>';
    box.innerHTML = html;
  }

  function envHtml(p, reg) {
    const res = TT.map.resistance(p, reg);
    const wx = TT.map.activeWeather(reg.id);
    let html = '<div class="sec">Môi trường · ' + ui.esc(reg.env.name) + '</div>' +
      '<p class="small">' + ui.esc(reg.env.desc) + ' Kháng của bạn: <b>' + Math.round(res * 100) + '%</b>' +
      (reg.env.resist.length ? ' (hợp: ' + reg.env.resist.join(', ') + ')' : '') + '.</p>';
    if (wx) {
      const d = wx.def;
      const bad = [];
      if (d.danger) bad.push('nguy hiểm +' + d.danger);
      if (d.hpDrain) bad.push('hao sinh lực +' + d.hpDrain + '/tháng');
      if (d.travel) bad.push('đi đường chậm x' + d.travel);
      if (d.gold && d.gold < 1) bad.push('kiếm vàng giảm');
      const good = [];
      if (d.train) good.push('tu luyện x' + d.train);
      if (d.gold && d.gold > 1) good.push('kiếm vàng x' + d.gold);
      if (d.elemBuff) good.push('người tu ' + d.elemBuff.elems.join('/') + ' tu luyện x' + d.elemBuff.train);
      html += '<p class="small"><b>Thời tiết: ' + ui.esc(d.name) + '</b> (còn ' + Math.max(0, wx.until - TT.world.months) + ' tháng). ' + ui.esc(d.desc) +
        (bad.length ? ' <span class="bad-txt">Bất lợi: ' + bad.join(', ') + '.</span>' : '') +
        (good.length ? ' <span class="good-txt">Có lợi: ' + good.join(', ') + '.</span>' : '') + '</p>';
    } else {
      html += '<p class="small">Thời tiết: bình thường.</p>';
    }
    return html;
  }

  function crossBlock(p) {
    const opts = TT.cross.options(p);
    const box = h('div', { class: 'cross' });
    if (!opts.length) return box;
    box.appendChild(h('p', { class: 'small' }, 'Rời vùng này rất khó và tốn nhiều năm. Điều kiện khắt khe, đọc kỹ trước khi đi.'));
    opts.forEach(o => {
      const blk = h('div', { class: 'opt' + (o.ok ? '' : ' off') });
      blk.appendChild(h('b', null, o.title));
      blk.appendChild(h('div', { class: 'small' }, o.note));
      const cost = [];
      if (o.gold) cost.push(TT.ls.fmt(o.gold));
      if (o.fortune) cost.push(o.fortune + ' cơ duyên');
      if (o.contrib) cost.push(o.contrib + ' cống hiến');
      if (cost.length) blk.appendChild(h('div', { class: 'small' }, 'Chi phí: ' + cost.join(', ') + '.'));
      if (!o.ok) blk.appendChild(h('div', { class: 'small bad-txt' }, 'Chưa đủ: ' + o.why.join('; ') + '.'));
      else blk.appendChild(h('div', { class: 'small good-txt' }, 'Đủ điều kiện.'));
      blk.appendChild(h('button', {
        class: o.ok ? 'primary' : '', disabled: o.ok ? null : 'disabled',
        onclick: () => {
          const pl = TT.player();
          let msg = o.title + '\n' + o.note;
          if (cost.length) msg += '\nChi phí: ' + cost.join(', ') + ' (mất cả khi thất bại).';
          if (o.years && TT.age(pl) + o.years >= S.lifeSpan(pl)) msg += '\nCẢNH BÁO: thọ nguyên của bạn có thể không đủ cho hành trình này.';
          if (!confirm(msg + '\nXác nhận?')) return;
          const r = TT.cross.start(pl, o.key);
          $('msg').textContent = r.text;
          headKey = ''; ui.markDirty();
        }
      }, o.years ? 'Xuất phát (' + o.years + ' năm)' : 'Kích hoạt'));
      if (o.method === 'tran_phap' && o.ok && p.tcd >= 3) {
        blk.appendChild(h('button', {
          onclick: () => {
            const pl = TT.player();
            if (!confirm(o.title + '\nDùng 3 Thiên cơ điểm để tăng 20% xác suất thành công?\nChi phí khác: ' + cost.join(', ') + ' (mất cả khi thất bại).\nXác nhận?')) return;
            const r = TT.cross.start(pl, o.key, { tcd: true });
            $('msg').textContent = r.text; headKey = ''; ui.markDirty();
          }
        }, 'Kích hoạt kèm Thiên cơ (+20%, 3 điểm)'));
      }
      box.appendChild(blk);
    });
    return box;
  }

  // Thông tin một khu tài nguyên: tài nguyên, nguy hiểm, nút đi tới hoặc rời khu.
  function headZone(p, z) {
    const box = $('region-head'); box.innerHTML = '';
    const d = D.RES[z.kind], host = TT.map.place(z.host), st = Math.round(TT.res.stock(z.id, z.kind));
    box.appendChild(h('div', { html:
      '<div class="sec"><span style="color:' + d.col + '">' + d.icon + '</span> ' + ui.esc(z.n) + ' · khu tài nguyên</div>' +
      '<p class="small">Đường mòn từ <b>' + ui.esc(host.n) + '</b> mất ' + z.months + ' tháng. ' + ui.esc(d.desc) + ' Không có cửa hàng hay chỗ nghỉ.</p>' +
      '<div class="grid"><div>' + d.n + ': <b>' + '★'.repeat(z.lv) + '☆'.repeat(3 - z.lv) + '</b></div>' +
      '<div>Kho còn: <b>' + st + '%</b><div class="bar ' + (st < 30 ? 'danger' : 'hp') + '"><i style="width:' + st + '%"></i></div></div>' +
      '<div>Nguy hiểm: <b>' + z.danger + '/6</b><div class="bar danger"><i style="width:' + Math.min(100, z.danger / 6 * 100) + '%"></i></div></div></div>' +
      '<p class="small">Ở đây hành động "Kiếm sống" lượm được ' + d.short + ' (không cần nghề), nghề đúng loại thu nhiều hơn. Kho hao khi thu hoạch và hồi dần mỗi năm.</p>' }));
    const row = h('div', { class: 'btns' }), z0 = p.zone && p.zone.id === z.id;
    if (p.cross || p.travel) row.appendChild(h('span', { class: 'small' }, 'Bạn đang trên đường, chưa đi khu được.'));
    else if (z0) {
      row.appendChild(h('span', { class: 'small' }, TT.res.zoneOf(p) ? 'Bạn đang ở khu này.' : 'Bạn đang trên đường mòn tới đây.'));
      row.appendChild(h('button', { onclick: () => { const r = TT.res.leaveZone(TT.player()); $('msg').textContent = r.text; headKey = ''; ui.markDirty(); } }, 'Rời khu, quay về ' + host.n));
    } else if (p.place !== z.host) row.appendChild(h('span', { class: 'small' }, 'Phải tới ' + host.n + ' trước, rồi mới đi theo đường mòn.'));
    else row.appendChild(h('button', { class: 'primary', onclick: () => { const r = TT.res.goZone(TT.player(), z.id); $('msg').textContent = r.text; headKey = ''; ui.markDirty(); } }, 'Đi tới khu (' + z.months + ' tháng)'));
    box.appendChild(row);
  }

  // Thông tin chi tiết một nơi (chỉ khi đứng ở đó, mở từ công trình đại diện: sơn môn, nhà trưởng thôn, nha môn, lều tộc trưởng, cửa ải).
  ui.placeInfo = function (p, pl) {
    const box = h('div', { class: 'placeinfo' });
    if (!pl) return box;
    const reg = TT.map.region(pl.region), st = TT.map.placeStats(pl);
    const wx = TT.map.activeWeather(reg.id);
    const danger = st.danger + (wx && wx.def.danger ? wx.def.danger : 0);
    const aff = TT.map.affinity(p, reg);
    const chip = (k, v, cls, tip) => '<span class="chip' + (cls ? ' ' + cls : '') + '" title="' + ui.esc(tip || '') + '">' + k + ' <b>' + v + '</b></span>';
    box.appendChild(h('div', { html:
      '<p class="small">Thế lực: ' + ui.esc(pl.faction) + (pl.gate ? ' · Cửa ải: nơi duy nhất để rời vùng' : '') + (pl.portal ? ' · Có truyền tống trận cổ' : '') + '</p>' +
      '<div class="chips pchips">' + chip('Linh khí', st.linh + '/6', '', 'Linh khí càng cao tu luyện càng nhanh') + chip('Nguy hiểm', danger + '/6', danger >= 4 ? 'bad' : '', 'Nguy cơ gặp thú dữ, kẻ cướp, thương tích') +
      chip('Phồn hoa', st.rich + '/6', '', 'Buôn bán, kiếm tiền dễ hơn') + chip('Hợp tư chất', Math.round(aff * 100) + '%', '', 'Vùng hợp hệ ' + reg.elems.join(', ') + ': tu luyện nhanh thêm ' + Math.round(aff * 80) + '%') + '</div>' +
      resHtml(pl) }));
    const zs = TT.res.zonesAt(pl.id);
    if (zs.length) box.appendChild(h('div', { class: 'small', html: '<b>Khu tài nguyên quanh đây</b> (bấm trên bản đồ để đi): ' + zs.map(z => '<span style="color:' + D.RES[z.kind].col + '">' + D.RES[z.kind].icon + '</span> ' + ui.esc(z.n) + ' ' + '★'.repeat(z.lv)).join(' · ') }));
    if (D.SECTS[pl.id]) box.appendChild(ui.sectPlaceBlock(p, pl));
    return box;
  };

  // Phần đầu cột thông tin khi chọn một địa điểm: chỉ tên và nút đi tới. Muốn xem chi tiết nơi đang ở thì vào công trình đại diện.
  function headLocal(p, pl) {
    const box = $('region-head');
    box.innerHTML = '';
    const reg = TT.map.region(pl.region);
    box.appendChild(h('div', { html: '<div class="sec">' + ui.esc(pl.n) + ' · ' + D.PLACE_TYPES[pl.type].n + ' · ' + ui.esc(reg.n) + '</div>' }));
    const row = h('div', { class: 'btns' });
    if (p.cross) row.appendChild(h('span', { class: 'small' }, 'Bạn đang vượt vùng.'));
    else if (p.travel) row.appendChild(h('span', { class: 'small' }, 'Bạn đang trên đường, chưa đổi hướng được.'));
    else if (pl.id === p.place) row.appendChild(h('span', { class: 'small' }, 'Bạn đang ở đây.' + (REP_BLD[pl.type] ? ' Vào ' + REP_BLD[pl.type] + ' (màn hình nhân vật) để xem chi tiết.' : '')));
    else {
      const rt = TT.map.localRoute(p.place, pl.id);
      row.appendChild(h('button', {
        class: 'primary',
        onclick: () => {
          const x = TT.player();
          if (!x || x.travel || x.cross) return;
          x.autoMove = false;
          TT.map.startTravel(x, pl.id);
          headKey = ''; ui.markDirty();
        }
      }, 'Đi tới ' + pl.n + (rt ? ' (' + rt.months + ' tháng)' : '')));
    }
    box.appendChild(row);
  }
  const REP_BLD = { tong_mon: 'Sơn môn', thon_tran: 'Nhà trưởng thôn', thanh_tri: 'Nha môn', bo_toc: 'Lều tộc trưởng', cua_ai: 'Cửa ải' };
  // Mục "Vượt vùng" nay nằm ở tab Tông môn (xem ui/sect.js). Còn khóa thì chỉ nói thiếu gì; đủ điều kiện một lối đi thì mở đủ các lối.
  ui.crossSection = function (p) {
    const box = h('div', { class: 'cross' });
    box.appendChild(h('div', { class: 'sec' }, 'Vượt vùng'));
    if (p.cross) { box.appendChild(h('p', { class: 'small' }, 'Bạn đang trên đường vượt vùng, xem tiến độ ở Đại địa đồ.')); return box; }
    const opts = p.travel ? [] : TT.cross.options(p);
    if (!opts.length) { box.appendChild(h('p', { class: 'small' }, p.travel ? 'Bạn đang trên đường.' : 'Từ chỗ này không có lối vượt vùng. Hãy tới cửa ải, nơi có truyền tống trận cổ hoặc đại trận của tông môn.')); return box; }
    if (!opts.some(o => o.ok)) {
      box.appendChild(h('div', { class: 'lockbox' },
        h('b', null, 'Đang khóa'),
        h('div', { class: 'small' }, 'Rời vùng rất khó và tốn nhiều năm. Mở khóa khi bạn đủ điều kiện của một trong các lối đi dưới đây:'),
        ...opts.map(o => h('div', { class: 'small' }, h('b', null, o.title + ': '), 'thiếu ' + o.why.join('; ') + '.'))));
      return box;
    }
    box.appendChild(crossBlock(p));
    return box;
  };

  function headMacro(p, r) {
    const box = $('region-head');
    box.innerHTML = '';
    const known = TT.cross.knows(p, r.id);
    if (!known) {
      box.appendChild(h('div', { html: '<div class="sec">Vùng chưa biết</div><p class="small">Bạn chưa nghe tin gì về vùng này. ' +
        'Khách từ vùng khác tới hoặc chính chuyến đi sẽ cho bạn biết thêm.</p>' }));
    } else {
      box.appendChild(h('div', { html:
        '<div class="sec">' + ui.esc(r.n) + ' · ' + r.terrain + '</div><p class="small">' + ui.esc(r.desc) + '</p>' +
        '<div class="grid">' + bar('Linh khí', r.linh, 'el', 6) + bar('Nguy hiểm', r.danger, 'danger', 6) + bar('Phồn hoa', r.rich, 'hp', 6) + '</div>' +
        '<p class="small">Hợp thuộc tính: <b>' + r.elems.join(', ') + '</b>.</p>' + envHtml(p, r)
      }));
    }
    const e = p.cross ? null : TT.map.edgeBetween(p.region, r.id);
    if (e) {
      box.appendChild(h('p', { class: 'small' }, 'Tuyến từ vùng bạn ở: cần ' + D.REALM_NAMES[e.minRealm] + ' để tự thân đi, khoảng ' + e.years + ' năm' +
        (e.caravan ? '; có tuyến thương đoàn.' : '; không có tuyến thương đoàn.')));
    }
    const row = h('div', { class: 'btns' });
    if (!p.cross && r.id === p.region) {
      row.appendChild(h('button', { class: 'primary', onclick: () => { ui.mapView = 'local'; ui.selectedPlace = null; headKey = ''; svgKey = ''; ui.markDirty(); } }, 'Xem bản đồ vùng'));
    }
    box.appendChild(row);
  }

  function renderPeople(p) {
    let list = [], title = 'Người ở đây';
    if (ui.mapView === 'local' && !p.cross && ui.selectedPlace) {
      list = peopleAt(ui.selectedPlace);
      title = TT.map.place(ui.selectedPlace).n;
    }
    list.sort((a, b) => (b.kind === 'player') - (a.kind === 'player') || (b.tier === 'phu') - (a.tier === 'phu') || b.realm - a.realm || a.id - b.id);
    const relCell = c => {
      if (c.kind === 'player') return '—';
      const r = TT.rel.get(p, c);
      if (!r) return '<span class="small">chưa quen</span>';
      return '<span class="' + (r.k === 'thu' ? 'bad-txt' : r.v >= 40 ? 'good-txt' : '') + '">' + TT.rel.label(p, c) + '</span>';
    };
    const rows = list.map(c =>
      '<tr data-id="' + c.id + '" class="person ' + (c.kind === 'player' ? 'me' : '') + (ui.selectedPerson === c.id ? ' sel' : '') + '"><td>' + ui.esc(c.name) + (c.kind === 'player' ? ' (bạn)' : '') +
      (c.role ? '<div class="small">' + ui.esc(c.role) + '</div>' : c.sect ? '<div class="small">' + D.SECT_RANKS[c.sect.rank] + ' · ' + ui.esc(D.SECTS[c.sect.id].n) + '</div>' : '') + (c.foreign ? '<div class="small">khách từ vùng khác</div>' : '') +
      '</td><td>' + TT.age(c) + '</td><td>' + S.realmName(c) + '</td><td>' + relCell(c) + '</td><td>' + (c.tier === 'phu' ? '—' : ui.actionLabel(c)) + '</td><td>' +
      D.personalityById[c.personality].n + '</td></tr>').join('');
    const html = list.length
      ? '<table><thead><tr><th>Tên</th><th>Tuổi</th><th>Cảnh giới</th><th>Quan hệ</th><th>Đang làm</th><th>Tính cách</th></tr></thead><tbody>' + rows + '</tbody></table>'
      : '<p class="small">Chưa có ai ở đây.</p>';
    if (html !== peopleHtml) {
      peopleHtml = html;
      $('region-people').innerHTML = html;
      $('region-people').querySelectorAll('tr[data-id]').forEach(tr => { tr.onclick = () => ui.selectPerson(+tr.dataset.id); });
    }
    $('region-count').textContent = '(' + title + ': ' + list.length + ' người)';
  }

  // ---------- phóng to, kéo, thu nhỏ ----------
  const VW = 800, VH = 560, ZMAX = 6;
  let view = { x: 0, y: 0, w: VW, h: VH }, zoomInited = false, moved = false;
  const ptrs = {};
  function setView(v) {
    v.w = Math.max(VW / ZMAX, Math.min(VW, v.w)); v.h = v.w * VH / VW;
    v.x = Math.max(0, Math.min(VW - v.w, v.x)); v.y = Math.max(0, Math.min(VH - v.h, v.y));
    view = v; const svg = $('map-svg');
    svg.setAttribute('viewBox', [v.x, v.y, v.w, v.h].map(n => Math.round(n * 100) / 100).join(' '));
    svg.style.touchAction = v.w < VW - 1 ? 'none' : 'pan-y';
    svg.style.setProperty('--zs', Math.pow(VW / v.w, -0.4).toFixed(3));
    const z = $('map-zoom'); if (z) z.textContent = Math.round(VW / v.w * 100) + '%';
  }
  function toSvg(cx, cy) {
    const svg = $('map-svg'), m = svg.getScreenCTM(); if (!m) return { x: view.x + view.w / 2, y: view.y + view.h / 2 };
    const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy; const q = pt.matrixTransform(m.inverse()); return { x: q.x, y: q.y };
  }
  function zoomAt(f, sx, sy) { // f > 1 phóng to; (sx, sy) là điểm giữ yên trong toạ độ SVG
    const w = Math.max(VW / ZMAX, Math.min(VW, view.w / f)), k = w / view.w;
    setView({ x: sx - (sx - view.x) * k, y: sy - (sy - view.y) * k, w, h: 0 });
  }
  function zoomCenter(f) { zoomAt(f, view.x + view.w / 2, view.y + view.h / 2); }
  function focusMe() {
    const p = TT.player(); if (!p) return;
    const pos = ui.mapView === 'macro' ? macroPos(p) : (p.cross ? { x: 400, y: 280 } : localPos(p));
    const w = VW / 3; setView({ x: pos.x - w / 2, y: pos.y - w * VH / VW / 2, w, h: 0 });
  }
  function resetView() { setView({ x: 0, y: 0, w: VW, h: VH }); }
  function toggleFull() {
    const box = $('map-box'); box.classList.toggle('full');
    const on = box.classList.contains('full'); $('map-full').textContent = on ? '✕' : '⛶'; $('map-full').title = on ? 'Thu nhỏ (Esc)' : 'Toàn màn hình';
    ui.mapFull = on; infoDirty = true; ui.markDirty();
  }
  let infoDirty = true;
  function initZoom() {
    if (zoomInited) return; zoomInited = true;
    const svg = $('map-svg'), ctl = $('map-ctl');
    const mk = (id, txt, title, fn) => { const b = h('button', { id, title, type: 'button', onclick: fn }, txt); ctl.appendChild(b); return b; };
    mk('map-in', '+', 'Phóng to', () => zoomCenter(1.5));
    ctl.appendChild(h('div', { id: 'map-zoom', class: 'small', style: 'text-align:center;background:rgba(20,17,15,.82);border-radius:6px;padding:2px 0;font-size:10px' }, '100%'));
    mk('map-out', '−', 'Thu nhỏ', () => zoomCenter(1 / 1.5));
    mk('map-me', '◎', 'Về chỗ bạn', focusMe);
    const rb = mk('map-resbtn', '◈', 'Hiện hoặc ẩn lớp tài nguyên (mỏ, dược liệu, yêu thú...)', () => {
      ui.mapRes = !ui.mapRes; try { localStorage.setItem('tt8b_mapres', ui.mapRes ? '1' : '0'); } catch (e) { /* bỏ qua */ }
      $('map-resbtn').style.opacity = ui.mapRes ? '1' : '0.5'; svgKey = ''; ui.markDirty();
    });
    rb.style.opacity = ui.mapRes ? '1' : '0.5';
    mk('map-reset', '⟲', 'Xem cả bản đồ', resetView);
    mk('map-full', '⛶', 'Toàn màn hình', toggleFull);
    svg.addEventListener('wheel', e => {
      e.preventDefault(); const q = toSvg(e.clientX, e.clientY); zoomAt(e.deltaY < 0 ? 1.25 : 1 / 1.25, q.x, q.y);
    }, { passive: false });
    svg.addEventListener('pointerdown', e => {
      ptrs[e.pointerId] = { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY };
      moved = false;
    });
    svg.addEventListener('pointermove', e => {
      const q = ptrs[e.pointerId]; if (!q) return;
      const ids = Object.keys(ptrs);
      if (ids.length === 2) { // chụm hai ngón
        const o = ptrs[ids.find(i => +i !== e.pointerId)];
        const d0 = Math.hypot(q.x - o.x, q.y - o.y), d1 = Math.hypot(e.clientX - o.x, e.clientY - o.y);
        q.x = e.clientX; q.y = e.clientY;
        if (d0 > 8 && d1 > 8) { const mid = toSvg((e.clientX + o.x) / 2, (e.clientY + o.y) / 2); zoomAt(d1 / d0, mid.x, mid.y); moved = true; }
        return;
      }
      const dx = e.clientX - q.x, dy = e.clientY - q.y;
      if (!moved && Math.hypot(e.clientX - q.sx, e.clientY - q.sy) < 5) return;
      if (view.w >= VW - 1 && !svg.classList.contains('drag') && e.pointerType === 'touch') return; // đang xem cả bản đồ, để trang cuộn
      moved = true; svg.classList.add('drag');
      const m = svg.getScreenCTM(); if (!m) return;
      setView({ x: view.x - dx / m.a, y: view.y - dy / m.d, w: view.w, h: 0 });
      q.x = e.clientX; q.y = e.clientY;
    });
    const up = e => { delete ptrs[e.pointerId]; if (!Object.keys(ptrs).length) svg.classList.remove('drag'); };
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up); svg.addEventListener('pointerleave', up);
    svg.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
    svg.addEventListener('dblclick', e => { const q = toSvg(e.clientX, e.clientY); zoomAt(2, q.x, q.y); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('map-box').classList.contains('full')) { e.stopPropagation(); toggleFull(); } }, true);
  }

  // thanh thông tin khi xem toàn màn hình
  function renderInfo(p) {
    const box = $('map-info'); if (!ui.mapFull) { if (box.innerHTML) box.innerHTML = ''; return; }
    const pl = ui.mapView === 'local' && !p.cross && ui.selectedPlace ? TT.map.place(ui.selectedPlace) : null;
    const key = pl ? pl.id + '|' + p.place + '|' + (p.travel ? 1 : 0) : 'x';
    if (key === box._k && !infoDirty) return; box._k = key; infoDirty = false;
    box.innerHTML = '';
    if (!pl) { box.appendChild(h('span', { class: 'small' }, 'Bấm vào một địa điểm để xem.')); return; }
    const st = TT.map.placeStats(pl), reg = TT.map.region(pl.region);
    box.appendChild(h('div', { html: '<b>' + ui.esc(pl.n) + '</b> · ' + D.PLACE_TYPES[pl.type].n + ' · ' + ui.esc(reg.n) +
      '<div class="small">Thế lực: ' + ui.esc(pl.faction) + (pl.gate ? ' · Cửa ải' : '') + (pl.portal ? ' · Truyền tống trận cổ' : '') + '</div>' +
      '<div class="small">Linh khí ' + st.linh + '/6 · Nguy hiểm ' + st.danger + '/6 · Phồn hoa ' + st.rich + '/6</div>' +
      '<div class="small">' + (TT.res.list(pl.id).filter(r => r.id !== 'linh').map(r => '<span style="color:' + D.RES[r.id].col + '">' + D.RES[r.id].icon + '</span> ' + D.RES[r.id].n + ' ' + '★'.repeat(r.lv)).join(' · ') || 'Không có tài nguyên thu hoạch') + '</div>' }));
    if (pl.id === p.place && !p.travel) box.appendChild(h('div', { class: 'small' }, 'Bạn đang ở đây.'));
    else if (!p.travel && !p.cross) {
      const rt = TT.map.localRoute(p.place, pl.id);
      box.appendChild(h('button', { class: 'primary', style: 'margin-top:6px', onclick: () => {
        const x = TT.player(); if (!x || x.travel || x.cross) return; x.autoMove = false; TT.map.startTravel(x, pl.id); headKey = ''; infoDirty = true; ui.markDirty();
      } }, 'Đi tới ' + pl.n + (rt ? ' (' + rt.months + ' tháng)' : '')));
    }
  }

  ui.setMapView = function (v) {
    ui.mapView = v; headKey = ''; svgKey = ''; ui.markDirty();
  };

  ui.renderMap = function () {
    const p = TT.player();
    if (!p) return;
    $('tab-local').classList.toggle('on', ui.mapView === 'local');
    $('tab-macro').classList.toggle('on', ui.mapView === 'macro');

    // Dựng lại SVG khi đổi chế độ xem, đổi vùng, hoặc bắt đầu/kết thúc vượt vùng.
    const key = ui.mapView + ':' + (ui.mapView === 'local' ? p.region : 'm') + ':' + (p.cross ? 'x' : '') + (ui.mapRes ? 'r' : '') + ':' +
      (ui.mapView === 'macro' ? Object.keys(p.knownRegions || {}).sort().join(',') : '');
    initZoom(); renderEnv(p);
    if (key !== svgKey) {
      svgKey = key; headKey = ''; resetView();
      if (ui.mapView === 'local') {
        if (p.cross) buildCrossing(); else { buildLocal(p.region); ui.selectedPlace = p.place; curRegionForLocal = p.region; }
      } else buildMacro(p);
    }

    if (ui.mapView === 'local') {
      if (p.cross) {
        $('region-head').innerHTML = '<div class="sec">Đang vượt vùng</div><p class="small">Bạn đang đi từ ' + ui.esc(TT.map.region(p.cross.from).n) + ' tới ' +
          ui.esc(TT.cross.regionLabel(p, p.cross.to)) + ', còn khoảng ' + Math.max(0, Math.ceil((p.cross.arrive - TT.world.months) / 12)) + ' năm.</p>';
        renderPeople(p);
        return;
      }
      if (!ui.selectedPlace || !TT.map.place(ui.selectedPlace) || TT.map.place(ui.selectedPlace).region !== p.region) ui.selectedPlace = p.place;
      const sel = TT.map.place(ui.selectedPlace);
      TT.map.placesOf(p.region).forEach(pl => {
        const n = peopleAt(pl.id).filter(c => c.kind === 'npc').length;
        countEls[pl.id].textContent = n ? n + ' người' : '';
        const re = resEls[pl.id]; // kho cạn thì mờ biểu tượng
        if (re) Object.keys(re).forEach(k => { const st = k === 'linh' ? 100 : TT.res.stock(pl.id, k); re[k].setAttribute('opacity', st < 30 ? 0.4 : st < 60 ? 0.75 : 1); });
      });
      const selz = ui.selectedZone && zoneEls[ui.selectedZone] ? TT.res.zone(ui.selectedZone) : null;
      if (ui.selectedZone && !selz) ui.selectedZone = null;
      if (selz) { ring.setAttribute('cx', selz.x); ring.setAttribute('cy', selz.y); } else { ring.setAttribute('cx', sel.x); ring.setAttribute('cy', sel.y); }
      const pos = localPos(p);
      marker.setAttribute('transform', 'translate(' + pos.x + ',' + pos.y + ')');
      const wx = TT.map.activeWeather(p.region);
      const hk = ['l', sel.id, p.place, p.travel ? p.travel.to : '', p.autoMove, wx ? wx.def.id : '', TT.cross.options(p).map(o => o.key + o.ok).join(','),
        p.sect ? p.sect.id + p.sect.rank : '', TT.sect.canJoin(p, sel.id).ok, !!TT.dungeon.canEnter(p), Math.floor(TT.ls.wealth(p) / 50),
        selz ? selz.id + (p.zone ? p.zone.id + p.zone.arrive : '') + Math.round(TT.res.stock(selz.id, selz.kind) / 5) : ''].join('|');
      if (hk !== headKey) { headKey = hk; if (selz) headZone(p, selz); else headLocal(p, sel); }
      renderPeople(p);
      renderInfo(p);
    } else {
      renderInfo(p);
      if (!ui.selectedRegion) ui.selectedRegion = p.region;
      const sel = TT.map.region(ui.selectedRegion);
      ring.setAttribute('cx', sel.x); ring.setAttribute('cy', sel.y);
      const pos = macroPos(p);
      marker.setAttribute('transform', 'translate(' + pos.x + ',' + pos.y + ')');
      const hk = ['m', sel.id, p.region, p.cross ? p.cross.to : '', TT.cross.knows(p, sel.id)].join('|');
      if (hk !== headKey) { headKey = hk; headMacro(p, sel); }
      $('region-people').innerHTML = '';
      $('region-count').textContent = '';
    }
  };
})();
