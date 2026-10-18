// Tab "Gia đình": đạo lữ, con cái, đồ đệ, nợ ân tình, sử ký các đời và bộ sưu tập kết cục.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h;

  function where(o) {
    if (!o.alive) return 'đã mất';
    if (o.cross) return 'đang vượt vùng';
    if (o.travel) return 'đang đi tới ' + TT.map.place(o.travel.to).n;
    const pl = TT.map.place(o.place);
    return (pl ? pl.n : '?') + ' · ' + TT.map.region(o.region).n;
  }
  const attrText = c => c.tuchat.attrs.slice().sort((a, b) => b.p - a.p).slice(0, 3).map(a => a.n + ' ' + a.p).join(', ');

  function data(c) {
    const w = TT.world;
    return {
      id: c.id, preg: !!c.pregnant,
      partners: TT.family.partners(c).map(x => [x.id, Math.round(x.r.love || 0), x.c.place, x.c.region, x.c.travel ? 1 : 0]),
      kids: (c.children || []).map(i => { const k = w.chars[i]; return k ? [i, k.alive, TT.age(k), k.realm, k.place] : [i]; }),
      dis: TT.family.disciples(c).map(d => [d.id, d.realm, d.place, TT.age(d)]),
      debts: (c.debts || []).map(d => d.id + ':' + d.amt),
      lives: (w.lives || []).length, meta: Object.keys(TT.meta.data.endings).length + ':' + TT.meta.data.lives
    };
  }

  function person(o, c, extra) {
    const r = TT.rel.get(c, o);
    const card = h('div', { class: 'card' });
    card.appendChild(h('div', { html: '<b>' + ui.esc(o.name) + '</b> <span class="small">(' + (o.gender === 'nu' ? 'nữ' : 'nam') + ', ' + TT.age(o) + ' tuổi, ' + D.REALM_NAMES[o.realm] + ', ' + D.personalityById[o.personality].n + ')</span>' }));
    card.appendChild(h('div', { class: 'small' }, where(o) + (extra ? ' · ' + extra : '')));
    if (o.alive) {
      const row = h('div', { class: 'btns' });
      if (!o.cross && o.place && !c.travel && !c.cross && !(o.region !== c.region)) row.appendChild(h('button', { onclick: () => { const p = TT.player(); p.autoMove = false; TT.map.startTravel(p, o.travel ? o.travel.to : o.place); ui.markDirty(); } }, 'Tìm gặp'));
      row.appendChild(h('button', { onclick: () => { ui.selectedPerson = o.id; ui.markDirty(); } }, 'Chi tiết'));
      card.appendChild(row);
    }
    return { card, r };
  }

  function build(box, c) {
    const w = TT.world;
    box.appendChild(h('h2', null, 'Đạo lữ'));
    const ps = TT.family.partners(c);
    if (!ps.length) box.appendChild(h('div', { class: 'small' }, 'Bạn chưa có đạo lữ. Tình cảm nảy nở qua giao du, tâm sự và các biến cố; khi đủ gắn bó, hai người có thể kết đạo lữ. Bạn được phép có nhiều đạo lữ, nhưng ghen tuông là chuyện khó tránh. Đạo lữ ở cùng chỗ có thể song tu, vừa tu nhanh hơn vừa tăng đạo tâm.'));
    ps.forEach(x => {
      const { card } = person(x.c, c, 'gắn bó ' + Math.round(x.r.love || 0) + '/100');
      card.insertBefore(h('div', { html: '<div class="bar"><i style="width:' + Math.round(x.r.love || 0) + '%"></i></div>' }), card.children[2] || null);
      box.appendChild(card);
    });
    if (c.pregnant) box.appendChild(h('div', { class: 'small good-txt' }, 'Có sinh mệnh nhỏ sắp chào đời.'));

    const kids = (c.children || []).map(i => w.chars[i]).filter(Boolean);
    box.appendChild(h('h2', { style: 'margin-top:14px' }, 'Con cái (' + kids.filter(k => k.alive).length + ' còn sống)'));
    if (!kids.length) box.appendChild(h('div', { class: 'small' }, 'Chưa có con. Con cái thừa hưởng một phần tư chất của bố mẹ (và có thể kế thừa bạn khi bạn mất).'));
    kids.forEach(k => {
      const { card } = person(k, c, 'tư chất ' + k.tuchat.total + ' (' + attrText(k) + ')' + (k.alive && TT.age(k) < 12 ? ' · còn nhỏ' : ''));
      if (!k.alive) card.classList.add('dead');
      box.appendChild(card);
    });

    const dis = TT.family.disciples(c);
    box.appendChild(h('h2', { style: 'margin-top:14px' }, 'Đồ đệ (' + dis.length + '/' + TT.family.MAX_DISCIPLES + ')'));
    if (!dis.length) box.appendChild(h('div', { class: 'small' }, c.realm >= 2 ? 'Chưa có đồ đệ. Có thể gặp người xin bái sư, hoặc chọn người trẻ có tư chất ở cùng chỗ rồi bấm "Nhận đồ đệ" ở thẻ người.' : 'Đạt Trúc Cơ mới nhận được đồ đệ.'));
    dis.forEach(d => box.appendChild(person(d, c, 'tư chất ' + d.tuchat.total + ' (' + attrText(d) + ')').card));

    if (c.debts && c.debts.length) {
      box.appendChild(h('h2', { style: 'margin-top:14px' }, 'Nợ ân tình'));
      c.debts.forEach(d => { const o = w.chars[d.id]; box.appendChild(h('div', { class: 'small bad-txt' }, (o ? o.name : '(người đã mất)') + ': ' + d.amt + ' vàng (' + d.why + ')')); });
    }

    // Sử ký các đời
    box.appendChild(h('h2', { style: 'margin-top:14px' }, 'Sử ký các đời'));
    const lives = w.lives || [];
    if (!lives.length) box.appendChild(h('div', { class: 'small' }, 'Đời này là đời đầu tiên của bạn.'));
    lives.slice(-6).forEach((l, i) => box.appendChild(h('div', { class: 'small' }, 'Kiếp ' + (lives.length - Math.min(6, lives.length) + i + 1) + ': ' + l.name + ', ' + l.age + ' tuổi, ' + D.REALM_NAMES[l.realm] +
      (l.how === 'ascend' ? ', phi thăng' : ', ' + (l.cause || 'qua đời')) + (l.kids ? ', ' + l.kids + ' con' : '') + '.')));
    const m = TT.meta.data;
    box.appendChild(h('div', { class: 'sec' }, 'Bộ sưu tập kết cục (' + Object.keys(m.endings).length + '/' + D.ENDINGS.length + ')'));
    box.appendChild(h('div', { class: 'chips', html: D.ENDINGS.map(e => m.endings[e.id]
      ? '<span class="chip q2" title="Đã đạt ' + m.endings[e.id] + ' lần">' + ui.esc(e.n) + '</span>' : '<span class="chip">???</span>').join('') }));
    box.appendChild(h('div', { class: 'small' }, 'Tổng cộng ' + m.lives + ' kiếp, ' + m.ascended + ' lần phi thăng, cảnh giới cao nhất: ' + D.REALM_NAMES[m.best] + '.'));
  }

  ui.addTab({ id: 'fam', label: 'Gia đình', key: c => JSON.stringify(data(c)), build });
})();
