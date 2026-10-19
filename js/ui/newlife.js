// Hộp "Đời mới" (8A): hiện kết quả bốc lúc sinh (tư chất, tiên thiên, khí vận, bốn trục tính cách) khi tạo thế giới và khi đầu thai.
// Chỉ là lớp phủ giao diện: không dùng world.pending, không chặn simulate; đồng hồ game dừng trong lúc mở (TT.time.hold).
// Không hiện ở chế độ Tự động, khi con kế thừa, và trong kiểm thử (không nạp giao diện).
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h;

  let back = null, mode = 'life', draft = null, rerolls = 0;
  // Dựng sẵn thông tin để Bốc lại khi đầu thai: chụp thế giới trước khi sinh (chỉ khi giao diện bật).
  TT.life.keepUndo = true;

  function close() {
    if (back) { back.remove(); back = null; }
    draft = null; TT.time.hold = false; TT.bus.emit('speed', TT.time.speed);
  }

  const vec = () => { const o = {}; TT.nature.IDS.forEach(k => { o[k] = Math.max(-D.NATURE.max, Math.min(D.NATURE.max, draft.base[k] + (draft.d[k] || 0))); }); return o; };
  const used = () => TT.nature.IDS.reduce((a, k) => a + Math.abs(draft.d[k] || 0), 0);

  function nudge(k, s) {
    const cur = draft.d[k] || 0, left = D.NATURE.budget - used();
    if ((s > 0 && cur >= 0) || (s < 0 && cur <= 0)) { if (left <= 0 || Math.abs(draft.base[k] + cur + s) > D.NATURE.max) return; }
    draft.d[k] = cur + s;
    render();
  }

  function reroll() {
    rerolls++;
    if (mode === 'world') {
      TT.life.createWorld(Math.floor(Math.random() * 0x7fffffff)); // sự kiện reincarnate mở lại hộp với người chơi mới
      TT.save.write(); ui.resetCaches(); ui.markDirty();
    } else if (TT.life.undo) {
      TT.save.restore(TT.life.undo); // quay lại trước lúc sinh, đốt vài số để lần bốc sau khác
      for (let i = 0; i < rerolls * 3 + 1; i++) TT.rng.next();
      TT.life.reincarnate(Object.assign({}, TT.life.undoOpts, { noUndo: true }));
      ui.resetCaches(); ui.markDirty();
    }
  }

  function start() {
    const c = TT.player(); if (!c) return close();
    let v = vec();
    if (used() === 0) v = TT.nature.autoAlloc(draft.base, D.NATURE.budget);
    TT.nature.set(c, v);
    TT.log(c, 'Tính cách lúc sinh: ' + TT.nature.summary(c) + '.', 'age');
    close(); TT.save.write(); ui.resetCaches(); ui.markDirty();
  }

  function row(c, a, v) {
    const pct = Math.abs(v) / D.NATURE.max * 50, d = draft.d[a.id] || 0;
    const band = TT.nature.bandIdx(v), cls = d ? ' chg' : '';
    return h('div', { class: 'nl-row' },
      h('div', { class: 'nl-k' }, h('b', null, a.n), h('span', { class: 'small' }, a.lo + ' ↔ ' + a.hi)),
      h('div', { class: 'nl-bar' + cls, title: a.n + ': ' + v }, h('i', { class: v < 0 ? 'neg' : 'pos', style: (v < 0 ? 'right:50%;' : 'left:50%;') + 'width:' + pct + '%' })),
      h('div', { class: 'nl-v' }, h('b', null, (v > 0 ? '+' : '') + v), h('span', { class: 'small' }, a.bands[band])),
      h('div', { class: 'nl-btn' },
        h('button', { class: 'sm', 'aria-label': 'Giảm ' + a.n, onclick: () => nudge(a.id, -1) }, '−'),
        h('button', { class: 'sm', 'aria-label': 'Tăng ' + a.n, onclick: () => nudge(a.id, 1) }, '+')));
  }

  function render() {
    const c = TT.player(); if (!c) return close();
    const v = vec(), t = c.tuchat, reg = TT.map.region(c.region), pl = TT.map.place(c.place);
    const attrs = t.attrs.slice().sort((x, y) => y.p - x.p).map(x => x.n + ' ' + x.p).join(', ');
    const traits = c.traitIds.length ? c.traitIds.map(id => { const x = D.traitById[id]; return h('span', { class: 'chip q' + x.q + (x.g ? '' : ' bad'), title: x.d }, (x.g ? '▲ ' : '▼ ') + x.n); }) : [h('span', { class: 'small' }, 'Không có')];
    const left = D.NATURE.budget - used();
    const card = h('div', { class: 'nl-card', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Đời mới' },
      h('div', { class: 'nl-title' }, 'Đời mới'),
      h('div', { class: 'small' }, mode === 'world' ? 'Thế giới mới đã dựng xong. Đây là người bạn sẽ sống thay.' : 'Bạn đã đầu thai. Đây là kiếp mới của bạn.'),
      h('div', { class: 'nl-who' }, h('b', null, c.name), ' · ' + (c.gender === 'nu' ? 'nữ' : 'nam') + ', ' + TT.age(c) + ' tuổi'),
      h('div', { class: 'small' }, c.origin + ' · ' + (pl ? pl.n : '') + (reg ? ' · vùng ' + reg.n : '')),
      h('div', { class: 'nl-sec' }, 'Tư chất ' + t.total + ' điểm'),
      h('div', { class: 'small' }, attrs),
      h('div', { class: 'nl-sec' }, 'Tiên thiên'), h('div', { class: 'chips' }, ...traits),
      h('div', { class: 'nl-sec' }, 'Khí vận'),
      h('div', null, h('b', null, TT.kv.pts(c) + ' điểm'), h('span', { class: 'small' }, ' · tiêu được ở chuyện lớn, chỉ cộng bằng chuyện lớn' + (c.ring ? ' · có chiếc nhẫn lạ' : ''))),
      h('div', { class: 'nl-sec' }, 'Tính cách (−10 đến +10)'),
      ...D.NATURE.axes.map(a => row(c, a, v[a.id])),
      h('div', { class: 'small nl-budget' }, 'Điểm chỉnh còn lại: ' + left + '/' + D.NATURE.budget + '. Bấm + hoặc − để dồn điểm vào một trục. Nếu không chỉnh gì, máy sẽ dồn ' + D.NATURE.budget + ' điểm vào trục lệch nhất.'),
      h('div', { class: 'nl-foot' },
        h('button', { onclick: reroll, title: mode === 'world' ? 'Dựng lại thế giới với hạt giống mới' : 'Đầu thai lại, bốc người mới' }, 'Bốc lại'),
        h('button', { class: 'primary', onclick: start }, 'Bắt đầu')));
    if (!back) { back = h('div', { class: 'nl-back' }); document.body.appendChild(back); }
    back.innerHTML = ''; back.appendChild(card);
  }

  ui.newLife = {
    isOpen: () => !!back,
    open(m) {
      mode = m; rerolls = m === 'world' && back ? rerolls : 0;
      const c = TT.player(); if (!c) return;
      draft = { base: Object.assign({}, TT.nature.get(c)), d: {} };
      TT.time.hold = true;
      render();
    },
    close
  };

  // Mở khi tạo thế giới hoặc đầu thai (không phải kế thừa); bỏ qua ở chế độ Tự động.
  TT.bus.on('reincarnate', d => {
    if (!d || d.kind !== 'new' || !D.NATURE.on) return;
    if (TT.decisions.mode() === 'tu_dong') { if (back) close(); return; }
    ui.newLife.open(d.first ? 'world' : 'life');
  });
})();
