// Bản đồ cuộc đời: mỗi ô là một năm (hoặc nhiều năm khi thọ nguyên dài, tối đa khoảng 100 ô). Màu ô theo năm sống tốt hay tệ (tính từ báo cáo cuối năm),
// viền hồng là hiện tại, viền trắng là thọ nguyên, viền nét đứt là thọ nguyên nếu lên cảnh giới kế, chấm vàng là mốc (đột phá, vào tông, kết đạo lữ...).
// Dữ liệu: c.life = { y: { tuổi: điểm 0..1 }, m: { tuổi: [{ k, t }] } } ghi bởi TT.report.close và TT.report.mark.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, S = TT.stats, h = ui.h;

  let lastKey = '';
  function scaleFor(life) { const L = life === Infinity ? 700 : life; return [1, 2, 5, 10, 20].find(p => Math.ceil(L / p) <= 100) || 20; }
  const GOOD = ['#1f5a56', '#256b66', '#2d7a74', '#33908a', '#3fb8b0'];

  ui.renderLifeMap = function (c) {
    const box = document.getElementById('lifemap-card'); if (!box || !c) return;
    const age = TT.age(c), life = S.lifeSpan(c), L = c.life || { y: {}, m: {} };
    const next = c.realm < 6 ? S.lifeSpan(Object.assign({}, c, { realm: c.realm + 1 })) : life;
    const key = [c.id, age, life, next, Object.keys(L.y).length, Object.keys(L.m).length].join('|');
    if (key === lastKey) return;
    lastKey = key;
    const per = scaleFor(Math.max(life === Infinity ? 0 : life, next === Infinity ? 0 : next, age + 1));
    const total = Math.min(100, Math.ceil(Math.max(Math.min(next, 9999), life === Infinity ? 0 : life, age + 1) / per));
    box.innerHTML = '';
    box.appendChild(h('div', { style: 'display:flex;justify-content:space-between;align-items:baseline' }, h('h2', null, 'Bản đồ cuộc đời'), h('span', { class: 'cap' }, '1 ô = ' + per + ' năm')));
    const grid = h('div', { class: 'lm' });
    for (let i = 0; i < total; i++) {
      const a0 = i * per, a1 = a0 + per - 1, cell = h('i');
      const scores = []; let marks = [];
      for (let a = a0; a <= a1; a++) { if (L.y[a] != null) scores.push(L.y[a]); if (L.m[a]) marks = marks.concat(L.m[a].map(m => m.t)); }
      let cls = '';
      if (scores.length) { const avg = scores.reduce((x, y) => x + y, 0) / scores.length; cell.style.background = avg < 0.38 ? '#6a3040' : avg < 0.5 ? '#3e3a4a' : GOOD[Math.min(4, Math.floor((avg - 0.5) / 0.5 * 5))]; }
      if (age >= a0 && age <= a1) cls = 'cur';
      else if (life !== Infinity && life - 1 >= a0 && life - 1 <= a1) cls = 'end';
      else if (next !== Infinity && next !== life && next - 1 >= a0 && next - 1 <= a1) cls = 'end2';
      if (marks.length) cls += ' m';
      cell.className = cls;
      cell.title = (per === 1 ? 'Tuổi ' + a0 : 'Tuổi ' + a0 + '-' + a1) + (scores.length ? ' · điểm năm ' + Math.round(scores.reduce((x, y) => x + y, 0) / scores.length * 100) + '/100' : (a0 > age ? ' · chưa tới' : '')) + (marks.length ? '\n' + marks.join('\n') : '');
      grid.appendChild(cell);
    }
    box.appendChild(grid);
    const lg = h('div', { class: 'legend' });
    [['#1c2530', 'chưa tới'], ['#2d7a74', 'năm tốt'], ['#6a3040', 'năm tệ']].forEach(x => lg.appendChild(h('span', null, h('u', { style: 'background:' + x[0] }), x[1])));
    lg.appendChild(h('span', null, h('u', { style: 'outline:2px solid #e8497c' }), 'hiện tại'));
    if (life !== Infinity) lg.appendChild(h('span', null, h('u', { style: 'outline:2px solid #e8edf3' }), 'thọ nguyên ' + life));
    if (next !== life && next !== Infinity) lg.appendChild(h('span', null, h('u', { style: 'outline:2px dashed #7a8aa0' }), 'nếu lên ' + D.REALM_NAMES[c.realm + 1] + ': ' + next));
    box.appendChild(lg);
    box.appendChild(h('div', { class: 'small', style: 'margin-top:8px' }, 'Chấm vàng: năm đột phá, vào tông, kết đạo lữ, thương nặng. Rê chuột vào ô để xem.'));
  };
  ui.resetLifeMap = function () { lastKey = ''; };
})();
