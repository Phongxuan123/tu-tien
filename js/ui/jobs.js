// Tab "Nghề": nghề chính và nghề phụ (cấp, bậc, kinh nghiệm, thu nhập), chọn hoặc đổi nghề, số đơn hàng đã làm.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h;

  function jobData(c) {
    const j = c.job || {};
    return { id: c.id, main: j.main, sub: j.sub, done: j.done, adapt: j.adapt > TT.world.months, realm: c.realm,
      lv: D.JOB_IDS.map(id => TT.job.level(c, id)).join(), xp: [j.main, j.sub].map(id => id ? Math.round(TT.job.xpInfo(c, id).xp / 4) : 0).join(), pending: !!TT.world.pending };
  }
  function refresh() { if (ui.resetSide) ui.resetSide(); ui.markDirty(); }
  function btn(label, fn, off, cls) { return h('button', { class: 'sm' + (cls ? ' ' + cls : ''), disabled: off ? 'disabled' : null, onclick: () => { fn(); refresh(); } }, label); }

  function slotCard(c, slot, id) {
    const T = TT.job, card = h('div', { class: 'card' });
    const title = slot === 'main' ? 'Nghề chính' : 'Nghề phụ';
    if (!id) { card.appendChild(h('div', { html: '<b>' + title + '</b> <span class="small">(chưa chọn)</span>' })); return card; }
    const d = D.JOBS[id], lv = T.level(c, id), cap = T.cap(c, id), xi = T.xpInfo(c, id);
    card.appendChild(h('div', { html: '<b>' + title + ': ' + ui.esc(d.n) + '</b> <span class="small">' + T.rank(c, id) + ' · cấp ' + lv + '/' + cap + '</span>' }));
    card.appendChild(h('div', { html: '<div class="bar"><i style="width:' + (lv >= cap ? 100 : Math.round(xi.xp / xi.need * 100)) + '%"></i></div>' }));
    card.appendChild(h('div', { class: 'small' }, d.perk));
    card.appendChild(h('div', { class: 'small' }, 'Thu nhập khi kiếm sống: x' + (slot === 'main' ? d.inc * (1 + D.JOB_MAIN_LV * lv) : 1 + (d.inc - 1) * 0.5 + D.JOB_MAIN_LV * 0.5 * lv).toFixed(2) + (lv >= cap ? ' · đã chạm trần cấp theo cảnh giới' : '')));
    return card;
  }

  function buildJobs(box, c) {
    const T = TT.job, j = T.ensure(c);
    box.appendChild(h('h2', null, 'Nghề nghiệp'));
    box.appendChild(h('div', { class: 'small' }, 'Nghề chính cho thu nhập và kỹ năng riêng, nghề phụ cho một nửa. Làm việc ("Kiếm sống") hoặc luyện nghề sẽ lên kinh nghiệm và hoàn thành đơn hàng; đơn hàng là nguồn nhiệm vụ nghề. Cấp nghề bị cảnh giới giới hạn.'));
    if (TT.world.months < j.adapt) box.appendChild(h('div', { class: 'small bad-txt' }, 'Đang làm quen nghề mới: thu nhập giảm một nửa trong ' + (j.adapt - TT.world.months) + ' tháng.'));
    box.appendChild(slotCard(c, 'main', j.main));
    box.appendChild(slotCard(c, 'sub', j.sub));
    box.appendChild(h('div', { class: 'small' }, 'Đơn hàng đã hoàn thành: ' + (j.done || 0)));
    box.appendChild(h('div', { class: 'sec' }, 'Các nghề'));
    D.JOB_IDS.forEach(id => {
      const d = D.JOBS[id], lv = T.level(c, id), isMain = j.main === id, isSub = j.sub === id;
      const card = h('div', { class: 'card' });
      card.appendChild(h('div', { html: '<b>' + ui.esc(d.n) + '</b> <span class="small">' + (lv ? T.rank(c, id) + ' · cấp ' + lv : 'chưa học') + (d.craft ? ' · nghề lõi' : '') + '</span>' }));
      card.appendChild(h('div', { class: 'small' }, d.perk));
      const row = h('div', { class: 'btns' });
      row.appendChild(btn(isMain ? 'Đang là nghề chính' : 'Làm nghề chính', () => T.set(c, 'main', id), isMain || !!TT.world.pending));
      row.appendChild(btn(isSub ? 'Đang là nghề phụ' : 'Làm nghề phụ', () => T.set(c, 'sub', id), isSub || isMain || !!TT.world.pending));
      if (isMain || isSub) row.appendChild(btn('Bỏ nghề này', () => T.set(c, isMain ? 'main' : 'sub', null), !!TT.world.pending, 'danger'));
      card.appendChild(row);
      box.appendChild(card);
    });
  }
  ui.addTab({ id: 'job', label: 'Nghề', key: c => JSON.stringify(jobData(c)), build: buildJobs });
})();
