// Mục "Quan hệ thế lực" trong tab Biên niên sử (S1): ma trận quan hệ, hồ sơ cặp và hồ sơ thế lực.
// Chỉ hiện bậc và chữ (không hiện số). Chỉ hiện thế lực ở vùng người chơi đã biết. Mọi hàm đọc không gọi rng (xem systems/diplo.js).
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, K = D.DIPLO, h = ui.h;

  const sel = ui.diploSel = { open: false, kind: 'tc', a: null, b: null };
  const FILTERS = [['tc', 'Triều và tông', ['trieu', 'tong']], ['trieu', 'Triều', ['trieu']], ['tong', 'Tông', ['tong']], ['gia', 'Gia tộc', ['gia']], ['hoi', 'Hội', ['hoi']], ['all', 'Tất cả', null]];
  const yr = m => Math.floor(m / 12) - TT.config.startYear + 1;
  const short = x => x.n.replace(/^Vương triều /, '');

  // Thế lực người chơi biết: cùng vùng đã đặt chân tới, tông của mình, hội có chi nhánh ở vùng đã biết.
  function known(c, x) {
    const kr = c.knownRegions || {};
    if (c.sect && c.sect.id === x.id) return true;
    return x.kind === 'hoi' ? (x.reach || []).some(r => kr[r]) : !!kr[x.region];
  }

  // Khóa vẽ lại: thêm vào khóa của tab Biên niên sử.
  ui.diploKey = function (c) {
    const f = TT.fac.S(); let n = 0;
    Object.keys(f.rel2 || {}).forEach(k => { n += f.rel2[k].an.length; });
    return '|' + Object.keys(ui.cardOpen || {}).filter(k => ui.cardOpen[k]).join(',') + (sel.open ? 1 : 0) + sel.kind + (sel.a || '') + (sel.b || '') + ':' + n + ':' + Object.keys(c.knownRegions || {}).length + ':' + (f.pacts || []).length;
  };

  function cellColor(t) {
    const k = Math.min(1, Math.abs(t) / 70);
    return t >= 0 ? 'rgba(52,195,138,' + (0.08 + 0.55 * k).toFixed(2) + ')' : 'rgba(224,86,79,' + (0.08 + 0.6 * k).toFixed(2) + ')';
  }
  const trustWord = v => (v >= 75 ? 'rất tin' : v >= 55 ? 'tin được' : v >= 35 ? 'dè dặt' : 'ngờ vực');
  const fearWord = v => (v >= 40 ? 'rất e dè' : v >= 12 ? 'e dè' : v > -12 ? 'ngang ngửa' : v > -40 ? 'coi nhẹ' : 'coi thường');

  function bar(pct, cls) { return h('div', { class: 'bar' + (cls ? ' ' + cls : '') }, h('i', { style: 'width:' + Math.max(2, Math.min(100, pct)) + '%' })); }

  function pairCard(a, b) {
    const L = TT.diplo.level(a, b), p = TT.diplo.peek(a, b), hist = TT.diplo.history(a, b);
    const card = h('div', { class: 'card' });
    card.appendChild(h('div', { html: '<b>' + ui.esc(short(a)) + '</b> ⇄ <b>' + ui.esc(short(b)) + '</b>' }));
    card.appendChild(h('div', { class: (L.cls === 'good' ? 'good-txt' : L.cls === 'bad' ? 'bad-txt' : '') }, L.n + (L.war ? ' · đang đánh nhau' : '') + (L.ally ? ' · có minh ước' : '')));
    card.appendChild(bar(50 + L.total / 2, L.cls === 'bad' ? 'hp' : ''));
    if (p.fresh && !hist.length) card.appendChild(h('div', { class: 'small' }, 'Hai bên chưa có giao thiệp đáng kể; quan hệ chỉ theo nền chung (vùng, chính tà).'));
    card.appendChild(h('div', { class: 'small' }, 'Tín nhiệm: ' + trustWord(p.tin) + '. ' + short(a) + ' ' + fearWord(TT.diplo.cua(a, b)) + ' ' + short(b) + '; ' + short(b) + ' ' + fearWord(TT.diplo.cua(b, a)) + ' ' + short(a) + '.'));
    const tags = TT.diplo.pactTag(a, b);
    if (tags.length) card.appendChild(h('div', { class: 'small' }, 'Hiệp ước: ' + tags.map(t => short(a) + ' ' + t.replace(' ' + b.n, ' ' + short(b))).join('; ') + '.'));
    card.appendChild(h('div', { class: 'sec' }, 'Sổ ân oán'));
    if (!hist.length) card.appendChild(h('div', { class: 'small' }, 'Chưa có ghi chép.'));
    hist.forEach(e => {
      const def = K.kinds[e.k] || {};
      card.appendChild(h('div', { class: 'small ' + (def.tone === 'good' ? 'good-txt' : def.tone === 'bad' ? 'bad-txt' : '') }, 'Năm ' + yr(e.m) + ' · ' + (def.n || e.k) + ': ' + e.t + (e.heir ? ' · thù truyền đời' : '')));
    });
    return card;
  }

  function factionCard(c, x) {
    const o = TT.diplo.of(x), card = h('div', { class: 'card' });
    const names = L => L.filter(y => known(c, y)).map(short).join(', ') || 'không rõ';
    card.appendChild(h('div', { html: '<b>' + ui.esc(x.n) + '</b> <span class="small">· ' + ui.esc(TT.fac.KIND_NAME[x.kind]) + ' · ' + ui.esc(TT.map.region(x.region).n) + '</span>' }));
    card.appendChild(h('div', { class: 'small' }, 'Thân thiết: ' + names(o.friends) + '.'));
    card.appendChild(h('div', { class: 'small' }, 'Bất hòa: ' + names(o.foes) + '.'));
    if (o.allies.length) card.appendChild(h('div', { class: 'small' }, 'Minh ước: ' + names(o.allies) + '.'));
    if (o.enemies.length) card.appendChild(h('div', { class: 'small bad-txt' }, 'Đang đánh nhau với: ' + names(o.enemies) + '.'));
    if (o.lords.length) card.appendChild(h('div', { class: 'small' }, 'Phải nộp cho hoặc nhờ che chở bởi: ' + names(o.lords) + '.'));
    if (o.vassals.length) card.appendChild(h('div', { class: 'small' }, 'Có chư hầu hoặc bên nộp cho: ' + names(o.vassals) + '.'));
    return card;
  }

  ui.buildDiplo = function (parent, c) {
    const box = h('div', { id: 'diplo-sec' }); parent.appendChild(box);
    box.appendChild(h('div', { class: 'sec lnk', onclick: () => { sel.open = !sel.open; } }, (sel.open ? '▾ ' : '▸ ') + 'Quan hệ thế lực' + (sel.open ? '' : ' (bấm để mở)')));
    if (!sel.open) return;
    const F = FILTERS.find(x => x[0] === sel.kind) || FILTERS[0];
    const bar0 = h('div', { class: 'small', style: 'display:flex;flex-wrap:wrap;gap:4px 10px;margin:4px 0' });
    FILTERS.forEach(x => bar0.appendChild(h('span', { class: x[0] === sel.kind ? 'good-txt' : 'lnk', onclick: () => { sel.kind = x[0]; sel.a = sel.b = null; } }, x[1])));
    box.appendChild(bar0);
    const M = TT.diplo.matrix(F[2], x => known(c, x));
    if (M.list.length < 2) { box.appendChild(h('div', { class: 'small' }, 'Bạn chưa biết đủ thế lực ở nhóm này (đi qua các vùng khác để biết thêm).')); return; }
    box.appendChild(h('div', { class: 'small' }, 'Màu xanh là thân, đỏ là bất hòa; ◆ minh ước, • hiệp ước, ✕ đang đánh nhau. Bấm một ô để xem hồ sơ cặp, bấm tên để xem hồ sơ thế lực. Chỉ hiện thế lực ở vùng bạn đã biết.'));
    const tbl = h('table', { style: 'border-collapse:collapse;font-size:11px' });
    const head = h('tr', null, h('th', null, ''));
    M.list.forEach((x, j) => head.appendChild(h('th', { style: 'padding:1px 3px;color:var(--dim);font-weight:400', title: x.n }, String(j + 1))));
    tbl.appendChild(head);
    M.list.forEach((x, i) => {
      const row = h('tr', null, h('td', { class: 'lnk', style: 'white-space:nowrap;padding:1px 6px 1px 0' + (sel.a === x.id && !sel.b ? ';color:var(--gold)' : ''), title: x.n, onclick: () => { sel.a = x.id; sel.b = null; } }, (i + 1) + '. ' + short(x)));
      M.list.forEach((y, j) => {
        const cell = M.cells[i][j];
        if (!cell) { row.appendChild(h('td', { style: 'width:20px;height:20px;background:var(--panel2)' })); return; }
        const pick = (sel.a === x.id && sel.b === y.id) || (sel.a === y.id && sel.b === x.id);
        row.appendChild(h('td', { title: short(x) + ' / ' + short(y) + ': ' + cell.n, style: 'width:20px;height:20px;text-align:center;cursor:pointer;background:' + cellColor(cell.total) + (pick ? ';outline:2px solid var(--gold)' : cell.war ? ';outline:2px solid var(--red)' : ''), onclick: () => { sel.a = x.id; sel.b = y.id; } }, cell.war ? '✕' : cell.ally ? '◆' : cell.pact ? '•' : ''));
      });
      tbl.appendChild(row);
    });
    box.appendChild(h('div', { style: 'overflow:auto;max-width:100%;margin:6px 0' }, tbl));
    const A = sel.a && TT.fac.get(sel.a), B = sel.b && TT.fac.get(sel.b);
    if (A && B && TT.fac.alive(A) && TT.fac.alive(B)) box.appendChild(pairCard(A, B));
    else if (A && TT.fac.alive(A)) box.appendChild(factionCard(c, A));
  };
})();
