// Giao diện truyện (8B): hộp vòng quay SVG (nằm trong hộp quyết định, js/ui/panels.js) và mục "Truyện của đời bạn" ở tab Nhiệm vụ.
// Hộp chặng dùng lại hộp quyết định (nhãn "Truyện", chấm hợp/trái tính, khóa có lý do). Thời gian dừng nhờ w.pending.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const h = ui.h;
  const NS = 'http://www.w3.org/2000/svg';
  const svg = (tag, a) => { const e = document.createElementNS(NS, tag); Object.keys(a || {}).forEach(k => e.setAttribute(k, a[k])); return e; };
  const reduced = () => { try { return localStorage.getItem('tt_reduce') === '1' || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; } };
  const COLORS = { 2: ['#a8473f', '#3f8a5a'], 3: ['#a8473f', '#c9a14a', '#3f8a5a'], 4: ['#a8473f', '#c98a4a', '#b9b24a', '#3f8a5a'] };
  const pt = (cx, cy, r, deg) => { const a = (deg - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };

  // Hộp vòng quay: vòng chia vùng theo màu (thấp → cao: đỏ → xanh), kim xoay tới số (khoảng 1,5 giây; giảm hiệu ứng thì hiện ngay), chú thích vùng.
  function wheelBox(d) {
    const box = h('div', { class: 'wheel-box' });
    const S = 220, R = 96, cx = S / 2, cy = S / 2, s = svg('svg', { viewBox: '0 0 ' + S + ' ' + S, class: 'wheel-svg', role: 'img', 'aria-label': 'Vòng quay vận mệnh' });
    const col = COLORS[d.zones.length] || COLORS[3];
    let acc = 0;
    d.zones.forEach((z, i) => {
      const a0 = acc * 3.6, a1 = (acc + z.w) * 3.6; acc += z.w;
      const p0 = pt(cx, cy, R, a0), p1 = pt(cx, cy, R, a1), big = a1 - a0 > 180 ? 1 : 0;
      const sl = svg('path', { d: 'M' + cx + ' ' + cy + ' L' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) + ' A' + R + ' ' + R + ' 0 ' + big + ' 1 ' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2) + ' Z', fill: col[i], stroke: '#0c1117', 'stroke-width': 2, opacity: d.st === 'done' && d.zone !== i ? '0.45' : '1' });
      s.appendChild(sl);
      const m = pt(cx, cy, R * 0.62, (a0 + a1) / 2), t = svg('text', { x: m[0].toFixed(1), y: m[1].toFixed(1), 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill: '#fff', 'font-size': 13, 'font-weight': 700 });
      t.textContent = z.w + '%'; s.appendChild(t);
    });
    s.appendChild(svg('circle', { cx, cy, r: 10, fill: '#0c1117', stroke: '#eef2f7', 'stroke-width': 2 }));
    const kim = svg('g', { class: 'wheel-kim' });
    kim.appendChild(svg('path', { d: 'M' + cx + ' ' + (cy - R - 8) + ' L' + (cx - 8) + ' ' + (cy - R + 12) + ' L' + (cx + 8) + ' ' + (cy - R + 12) + ' Z', fill: '#eef2f7', stroke: '#0c1117', 'stroke-width': 1.5 }));
    kim.appendChild(svg('line', { x1: cx, y1: cy, x2: cx, y2: cy - R + 12, stroke: '#eef2f7', 'stroke-width': 3 }));
    const deg = d.st === 'done' ? d.num * 3.6 : 0;
    kim.style.transformOrigin = cx + 'px ' + cy + 'px';
    kim.style.transformBox = 'view-box';
    if (d.st === 'done' && !reduced()) {
      kim.style.transform = 'rotate(0deg)'; kim.style.transition = 'transform 1.5s cubic-bezier(.15,.7,.2,1)';
      setTimeout(() => { kim.style.transform = 'rotate(' + (deg + 720) + 'deg)'; }, 40);
    } else kim.style.transform = 'rotate(' + deg + 'deg)';
    s.appendChild(kim);
    box.appendChild(s);
    const leg = h('div', { class: 'wheel-leg' });
    let a0 = 0;
    d.zones.forEach((z, i) => {
      leg.appendChild(h('div', { class: 'wl' + (d.st === 'done' && d.zone === i ? ' on' : '') }, h('i', { style: 'background:' + col[i] }), h('span', null, a0 + '–' + (a0 + z.w) + ': ' + z.n)));
      a0 += z.w;
    });
    box.appendChild(leg);
    box.appendChild(h('div', { class: 'wheel-num small' }, d.st === 'done' ? 'Số quay: ' + d.num + ' (kim chỉ tại ' + d.num + '/100)' : 'Chưa quay. Điểm yếu tố ' + (d.mod > 0 ? '+' : '') + d.mod + '.'));
    return box;
  }

  // Mục "Truyện của đời bạn" ở tab Nhiệm vụ: tuyến đang đi, chặng đã qua, hậu quả đang chờ (ghi mơ hồ).
  function build(box, c) {
    box.appendChild(h('h2', { style: 'margin-top:14px' }, 'Truyện của đời bạn'));
    const rows = TT.story.rows(c);
    if (!rows.length) { box.appendChild(h('div', { class: 'small' }, 'Chuyện của đời bạn mới bắt đầu.')); return; }
    rows.forEach(r => {
      const card = h('div', { class: 'card story-card' });
      card.appendChild(h('div', { class: 'qtop' }, h('b', null, r.n), h('span', { class: 'qchip ' + (r.state === 'xong' ? 'ok' : 't-1') }, r.state === 'xong' ? 'Đã xong' : 'Đang đi')));
      if (r.state === 'xong') card.appendChild(h('div', { class: 'small' }, 'Kết cục: ' + r.ket));
      else if (r.cur) card.appendChild(h('div', { class: 'small' }, 'Chặng hiện tại: ' + r.cur));
      r.log.forEach(t => card.appendChild(h('div', { class: 'small' }, '• ' + t)));
      box.appendChild(card);
    });
    if (TT.story.pendingDue(c) > 0) box.appendChild(h('div', { class: 'small', style: 'margin-top:6px' }, 'Có điều gì đó đang tới...'));
  }

  ui.story = { wheelBox, build };
})();
