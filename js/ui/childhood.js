// Hộp tuổi thơ (8A3): sau khi xác nhận hộp Đời mới, hiện lần lượt từng sự kiện ba hồi, rồi hộp Tổng kết lúc 12 tuổi.
// Chỉ là lớp phủ giao diện: không dùng world.pending, đồng hồ game dừng bằng TT.time.hold. Logic ở js/systems/childhood.js.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h;
  let back = null, shown = null; // shown: kết quả lựa chọn vừa bấm { choice, r, fx } (hiện chữ kết quả trước khi sang sự kiện kế)

  function close() {
    if (back) { back.remove(); back = null; }
    shown = null; TT.time.hold = false; TT.bus.emit('speed', TT.time.speed);
  }
  function done() { close(); TT.save.write(); ui.resetCaches(); ui.markDirty(); }
  function frame(card) {
    if (!back) { back = h('div', { class: 'nl-back' }); document.body.appendChild(back); }
    back.innerHTML = ''; back.appendChild(card);
  }
  const fxText = fx => Object.keys(fx || {}).map(k => (TT.childhood.FXN[k] || (k === 'ban' ? 'Bạn thuở nhỏ' : k)) + (k === 'bad' ? '' : ' ' + (fx[k] > 0 ? '+' : '') + fx[k])).join(', ');

  const f1 = v => { v = Math.round(v * 10) / 10; return (v > 0 ? '+' : '') + v; };

  function step() {
    const c = TT.player(); if (!c) return close();
    const s = TT.childhood.current(c);
    if (!s) { TT.childhood.finish(c); return summary(); }
    shown = null; TT.time.hold = true;
    const best = TT.childhood.pick(c, s.ev);
    const opts = s.ev.ch.map((x, i) => {
      const fit = TT.childhood.fit(c, x), good = fit > 1.05;
      return h('button', { class: 'ch-opt', 'data-key': x.key, onclick: () => choose(s, i) },
        h('span', { class: 'ch-dot' + (good ? ' on' : ''), title: good ? 'Hợp tính cách của bạn' : '' }, good ? '●' : '○'),
        h('span', null, x.label), good ? h('span', { class: 'small ch-fit' }, 'hợp tính') : null);
    });
    frame(h('div', { class: 'nl-card ch-card', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Tuổi thơ' },
      h('div', { class: 'small' }, 'Hồi ' + s.hoi + ' · ' + TT.childhood.HOI[s.hoi] + ' · sự kiện ' + (s.i + 1) + '/' + s.n),
      h('div', { class: 'nl-title' }, s.ev.t),
      h('p', { class: 'ch-text' }, TT.childhood.text(s.ev, s.ban)),
      h('div', { class: 'ch-opts' }, ...opts),
      h('div', { class: 'small nl-budget' }, '● là lựa chọn hợp tính cách của bạn (' + TT.nature.summary(c) + ').')));
  }

  function choose(s, i) {
    const c = TT.player(); if (!c) return close();
    const r = TT.childhood.apply(c, s.ev, i, s.ban);
    shown = r;
    frame(h('div', { class: 'nl-card ch-card', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Kết quả' },
      h('div', { class: 'small' }, 'Hồi ' + s.hoi + ' · ' + s.ev.t),
      h('p', { class: 'ch-text' }, r.r),
      h('div', { class: 'small' }, fxText(r.fx) || 'Không đổi chỉ số.'),
      h('div', { class: 'nl-foot' }, h('button', { class: 'primary', 'data-act': 'next', onclick: step }, 'Tiếp'))));
  }

  function summary() {
    const c = TT.player(); if (!c) return close();
    const s = TT.childhood.summary(c), A = D.NATURE.axes;
    const nat = s.nature.length ? s.nature.map(x => { const a = A.find(y => y.id === x.id); return h('div', null, h('b', null, a.n + ': '), f1(x.from) + ' → ' + f1(x.to), h('span', { class: 'small' }, ' (' + a.bands[TT.nature.bandIdx(x.to)] + ')')); }) : [h('div', { class: 'small' }, 'Tính cách giữ nguyên.')];
    const st = s.stats.length ? s.stats.map(x => h('span', { class: 'chip' + (x.bad ? ' bad' : ''), title: x.bad ? x.bad.d : '' }, x.bad ? '▼ ' + x.bad.n : x.n + ' ' + (x.v > 0 ? '+' : '') + x.v)) : [h('span', { class: 'small' }, 'Không có.')];
    const hoi = s.hoi.map(x => h('div', { class: 'ch-hoi' }, h('b', null, 'Hồi ' + x.hoi + ' (' + x.age + ')'),
      ...x.lines.map(l => h('div', { class: 'small' }, l.t + ' — ' + l.label))));
    frame(h('div', { class: 'nl-card ch-card', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Tổng kết tuổi thơ' },
      h('div', { class: 'nl-title' }, 'Tổng kết 12 tuổi'),
      h('div', { class: 'nl-who' }, h('b', null, c.name), ' · ' + TT.nature.summary(c)),
      h('div', { class: 'nl-sec' }, 'Tính cách đã đổi'), ...nat,
      h('div', { class: 'nl-sec' }, 'Nhận được'), h('div', { class: 'chips' }, ...st),
      h('div', { class: 'nl-sec' }, 'Ba hồi'), ...hoi,
      h('div', { class: 'nl-foot' },
        h('button', { 'data-act': 'again', onclick: again, title: 'Bốc lại cả đời' }, 'Đầu thai lại'),
        h('button', { class: 'primary', 'data-act': 'enter', onclick: done }, 'Vào đời'))));
  }

  // "Đầu thai lại": bốc lại cả đời (hộp Đời mới mở lại như khi bấm Bốc lại, rồi lại ba hồi).
  function again() { close(); ui.newLife.reroll(); }

  ui.childhood = {
    isOpen: () => !!back,
    // Gọi sau khi xác nhận hộp Đời mới: bắt đầu ba hồi (tắt công tắc hoặc không phải người chơi thì bỏ qua).
    start() {
      const c = TT.player(); if (!c || !TT.childhood.on(c)) return false;
      TT.childhood.begin(c); step(); return true;
    },
    // Tải bản lưu giữa chừng tuổi thơ: mở tiếp từ bước đang dở.
    resume() { const c = TT.player(); if (c && TT.childhood.pending(c) && TT.decisions.mode() !== 'tu_dong') { step(); return true; } return false; },
    close
  };
})();
