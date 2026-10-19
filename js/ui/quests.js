// Bảng nhiệm vụ: danh sách ưu tiên kéo thả (nút ▲▼ cho điện thoại), nhiệm vụ cấp bách nhãn đỏ, đề nghị chờ, lịch sử gần đây.
// Dùng bởi tab "Nhiệm vụ" trong people.js. Mọi thao tác gọi vào TT.quests rồi đánh dấu vẽ lại.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h, Q = D.QUEST;

  const GIVER_CLS = { self: 'g-self', npc: 'g-npc', sect: 'g-sect', fac: 'g-fac', heaven: 'g-heaven' };

  // Dựng lại tab ngay dù con trỏ đang nằm trên (nếu không, thứ tự mới chỉ hiện sau khi rời chuột).
  function refresh() { if (ui.resetSide) ui.resetSide(); ui.markDirty(); }
  function btn(label, fn, o) {
    o = o || {};
    return h('button', { class: 'sm' + (o.cls ? ' ' + o.cls : ''), disabled: o.off ? 'disabled' : null, title: o.title || null, onclick: e => { e.stopPropagation(); fn(); refresh(); } }, label);
  }
  function chips(q) {
    const s = h('div', { class: 'qchips' });
    s.appendChild(h('span', { class: 'qchip t-' + q.tier }, Q.TIERS[q.tier].n));
    s.appendChild(h('span', { class: 'qchip ' + GIVER_CLS[q.giver.t] }, Q.GIVER[q.giver.t] + (q.giver.t === 'npc' || q.giver.t === 'sect' ? ': ' + q.giver.name : '')));
    s.appendChild(h('span', { class: 'qchip d-' + q.d }, Q.DIFF[q.d].n));
    if (q.rel === 1) s.appendChild(h('span', { class: 'qchip ok' }, 'hợp đạo'));
    if (q.rel === -1) s.appendChild(h('span', { class: 'qchip bad' }, 'ngược đạo'));
    if (q.urgent) s.appendChild(h('span', { class: 'qchip urgent' }, 'cấp bách'));
    return s;
  }

  ui.buildQuests = function (box, c) {
    const T = TT.quests, s = T.qs(c), act = T.sorted(c), age = TT.age(c);
    const head = h('div', { class: 'qhead' });
    head.appendChild(h('h2', null, 'Nhiệm vụ (' + act.length + ' đang chạy)'));
    const tools = h('div', { class: 'btns' });
    tools.appendChild(btn(s.lock ? 'Mở khóa thứ tự' : 'Khóa thứ tự', () => { s.lock = !s.lock; }, { title: 'Khóa thì máy không tự đẩy nhiệm vụ cấp bách lên đầu, chỉ nhắc.' }));
    tools.appendChild(btn('Tự sắp xếp', () => T.autoSort(c), { off: !act.length || s.lock }));
    tools.appendChild(btn('Xem xét', () => { T.review(c); }, { off: !!TT.world.pending || (!act.length && !s.offers.length) }));
    head.appendChild(tools);
    box.appendChild(head);
    box.appendChild(h('div', { class: 'small' }, 'Nhân vật dồn sức cho nhiệm vụ đứng đầu: kéo để đổi thứ tự (hoặc dùng ▲ ▼). Mỗi tầng ngắn/trung/dài có chỗ riêng. Thiên Đạo thỉnh thoảng ban "đại nguyện" riêng, không đổi độ khó được.'));
    if (!act.length) box.appendChild(h('div', { class: 'small', style: 'margin:8px 0' }, 'Bạn chưa nhận nhiệm vụ nào. Đề nghị sẽ xuất hiện theo thời gian (từ bản thân, người quen, tông môn, thế lực).'));

    const listEl = h('div', { class: 'qlist' });
    let dragId = null;
    act.forEach((q, i) => {
      const k = TT.quests.K[q.kind], p = Math.round(T.progress(c, q) * 100), left = q.byAge - age, fixed = k.fixed || q.giver.t === 'heaven';
      const card = h('div', { class: 'card qcard' + (q.urgent ? ' urgent' : '') + (q.giver.t === 'heaven' ? ' heaven' : ''), draggable: s.lock ? null : 'true' });
      card.dataset.id = q.id;
      card.addEventListener('dragstart', e => { dragId = q.id; card.classList.add('dragging'); try { e.dataTransfer.setData('text/plain', String(q.id)); } catch (x) { /* bỏ qua */ } });
      card.addEventListener('dragend', () => { card.classList.remove('dragging'); listEl.querySelectorAll('.over').forEach(x => x.classList.remove('over')); });
      card.addEventListener('dragover', e => { if (dragId != null) { e.preventDefault(); card.classList.add('over'); } });
      card.addEventListener('dragleave', () => card.classList.remove('over'));
      card.addEventListener('drop', e => {
        e.preventDefault(); card.classList.remove('over');
        const mv = T.byId(c, dragId); dragId = null;
        if (mv && mv !== q) { T.moveTo(c, mv, i); refresh(); }
      });
      card.appendChild(h('div', { class: 'qtop' },
        h('span', { class: 'qrank' }, '#' + q.rank),
        h('b', { class: 'qtext' }, q.text),
        h('span', { class: 'qmove' }, btn('▲', () => T.move(c, q, -1), { off: i === 0 || s.lock }), btn('▼', () => T.move(c, q, 1), { off: i === act.length - 1 || s.lock }))));
      card.appendChild(chips(q));
      card.appendChild(h('div', { html: '<div class="bar"><i style="width:' + p + '%"></i></div>' }));
      card.appendChild(h('div', { class: 'small ' + (left <= Math.max(1, (q.byAge - q.startAge) / 3) ? 'bad-txt' : '') }, p + '% · hạn trước ' + q.byAge + ' tuổi (còn ' + Math.max(0, left) + ' năm)' + (q.ext ? ' · đã gia hạn ' + q.ext + ' lần' : '')));
      card.appendChild(h('div', { class: 'small' }, 'Thưởng: ' + T.rewardText(q) + '. Nếu ' + T.penText(q) + '.'));
      const a = T.advice(c, q);
      if (a.act !== 'keep') card.appendChild(h('div', { class: 'small qadv' }, 'Gợi ý: ' + a.why + '.'));
      const row = h('div', { class: 'btns' });
      row.appendChild(btn('Lên đầu', () => T.moveTo(c, q, 0), { off: q.rank === 1 || s.lock }));
      row.appendChild(btn('Hạ độ khó', () => T.setDiff(c, q, q.d - 1), { off: fixed || q.d <= 0 }));
      row.appendChild(btn('Nâng độ khó', () => T.setDiff(c, q, q.d + 1), { off: fixed || q.d >= 3 }));
      row.appendChild(btn('Gia hạn', () => T.extend(c, q), { off: q.ext >= 2, title: 'Đổi lại: ' + T.extendCost(q) + ', thưởng giảm 15%.' }));
      if (q.urgent && q.was) row.appendChild(btn('Đặt về chỗ cũ', () => T.restore(c, q), { off: s.lock }));
      row.appendChild(btn('Bỏ', () => { if (confirm('Bỏ nhiệm vụ này? ' + T.penText(q))) T.drop(c, q); }, { cls: 'danger' }));
      card.appendChild(row);
      listEl.appendChild(card);
    });
    box.appendChild(listEl);

    if (s.offers.length) {
      box.appendChild(h('div', { class: 'sec' }, 'Đề nghị đang chờ (' + s.offers.length + ')'));
      s.offers.forEach(o => {
        const free = T.slotsFree(c, o.tier, o.giver.t) > 0;
        const card = h('div', { class: 'card qcard offer' });
        card.appendChild(h('div', { class: 'qtop' }, h('b', { class: 'qtext' }, o.text)));
        card.appendChild(chips(o));
        card.appendChild(h('div', { class: 'small' }, 'Hạn trước ' + o.byAge + ' tuổi · khoảng ' + Q.DIFF[o.d].p + '% thành công · Thưởng: ' + T.rewardText(o) + '. Nếu ' + T.penText(o) + '.'));
        card.appendChild(h('div', { class: 'btns' }, btn('Nhận', () => T.accept(c, o), { off: !free, title: free ? null : 'Hết chỗ cho tầng này: bỏ bớt một nhiệm vụ cùng tầng.' }), btn('Từ chối', () => T.decline(c, o))));
        box.appendChild(card);
      });
    }

    const done = T.list(c).filter(q => q.state !== 'on').slice(-5).reverse();
    if (done.length) {
      box.appendChild(h('div', { class: 'sec' }, 'Gần đây'));
      done.forEach(q => box.appendChild(h('div', { class: 'small ' + (q.state === 'done' ? 'good-txt' : 'bad-txt') }, (q.state === 'done' ? 'Xong' : q.state === 'drop' ? 'Đã bỏ' : 'Hỏng') + ' (' + q.endAge + ' tuổi): ' + q.text)));
    }
    const st = s.stats;
    if (st.done + st.fail + st.drop) box.appendChild(h('div', { class: 'small' }, 'Cả đời này: xong ' + st.done + ', hỏng ' + st.fail + ', bỏ ' + st.drop + '.'));
  };
})();
