// Mục "Tín ngưỡng" trong tab Biên niên sử (S5): ba ô mỗi vùng đã biết, đại điện, giáo hội lớn và tín ngưỡng của bạn.
// Chỉ hiện chữ và thanh (không hiện số). Chỉ đọc (xem systems/faith.js): không gọi rng, không khởi tạo dữ liệu. Viết tôn trọng, không phán đúng sai về niềm tin.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, K = D.FAITH, h = ui.h;

  const sel = ui.faithSel = { open: false };
  const fn = id => (TT.faith.byId[id] ? TT.faith.byId[id].n : '?');
  const yr = m => Math.floor(m / 12) - TT.config.startYear + 1;
  const bar = (pct, cls) => h('div', { class: 'bar' + (cls ? ' ' + cls : '') }, h('i', { style: 'width:' + Math.max(2, Math.min(100, Math.round(pct))) + '%' }));

  ui.faithKey = function (c) {
    const s = TT.faith.peek(); let n = 0;
    if (s) { n = (s.hist || []).length * 5 + Object.keys(s.church).reduce((a, k) => a + s.church[k].phai.length, 0); D.REGIONS.forEach(r => { n += Math.round(s.slots[r.id][0].share * 20) + (s.slots[r.id][0].chinh.length); }); }
    return '|f' + (sel.open ? 1 : 0) + ':' + n + ':' + (c.faith || '') + (c.tam || '') + ':' + Object.keys(c.knownRegions || {}).length;
  };

  function slotLine(s) {
    return fn(s.chinh) + (s.long ? ' + ' + fn(s.long) + ' (lồng)' : '');
  }

  function mineCard(c) {
    const me = TT.faith.personal(c), f = me.faith ? TT.faith.byId[me.faith] : null, card = h('div', { class: 'card' });
    card.appendChild(h('div', { html: '<b>Tín ngưỡng của bạn</b>' }));
    if (!f) { card.appendChild(h('div', { class: 'small' }, 'Bạn sống thế tục, chưa theo tín ngưỡng nào. Đến nơi thờ tự trong vùng để nghe giảng và tìm hiểu.')); return card; }
    card.appendChild(h('div', { class: 'small', html: ui.esc(f.n) + ' · <b>' + ui.esc(TT.faith.tamName(me.tam)) + '</b>' + (me.set ? '' : ' <span class="small">(theo nếp quanh vùng bạn sống)</span>') }));
    card.appendChild(h('div', { class: 'small' }, f.loi));
    card.appendChild(h('div', { class: 'small' }, 'Giới: ' + f.gioi.join(' ')));
    card.appendChild(h('div', { class: 'small' }, 'Nghi lễ: ' + f.nghiLe.join('; ') + '.'));
    card.appendChild(h('div', { class: 'small' }, 'Phúc: ' + f.phuc.moTa));
    card.appendChild(h('div', { class: 'small' }, 'Điều cần lưu ý: ' + f.cangThang));
    const fl = c.flags || {}, g = fl.gioi;
    if (g && (g.kept || g.broke)) card.appendChild(h('div', { class: 'small' }, 'Bạn đã giữ giới ' + g.kept + ' lần' + (g.broke ? ', phạm giới ' + g.broke + ' lần' : '') + '.'));
    if (fl.faithShun && fl.faithShun.until > TT.world.months) card.appendChild(h('div', { class: 'small bad-txt' }, 'Vì phạm giới, người cùng đạo đang giữ khoảng cách với bạn một thời gian.'));
    if (fl.hanhHuongAt != null) card.appendChild(h('div', { class: 'small' }, 'Lần hành hương gần nhất: năm ' + yr(fl.hanhHuongAt) + '.'));
    if (fl.faithMix) card.appendChild(h('div', { class: 'small' }, 'Bạn kết duyên với người khác tín ngưỡng' + (fl.faithMix.mono ? ' (một bên theo tín ngưỡng độc nhất, cần hòa giải)' : '') + '.'));
    return card;
  }

  ui.buildFaith = function (box, c) {
    const sec = h('div', { id: 'faith-sec' }); box.appendChild(sec);
    sec.appendChild(h('div', { class: 'sec lnk', onclick: () => { sel.open = !sel.open; } }, (sel.open ? '▾ ' : '▸ ') + 'Tín ngưỡng' + (sel.open ? '' : ' (bấm để mở)')));
    if (!sel.open) return;
    if (!K.on && !TT.faith.peek()) { sec.appendChild(h('div', { class: 'small' }, 'Chưa có tín ngưỡng nào được ghi nhận trong thế giới này.')); return; }
    sec.appendChild(h('div', { class: 'small' }, 'Mỗi vùng có ba nếp tín ngưỡng lớn (ô); hai nếp hợp nhau có thể lồng vào một ô. Nếp đông tín đồ nhất đặt đại điện ở vùng. Chỉ hiện những vùng bạn đã biết.'));
    sec.appendChild(mineCard(c));
    const kr = c.knownRegions || {};
    D.REGIONS.forEach(r => {
      if (!kr[r.id]) return;
      const v = TT.faith.view(r.id), card = h('div', { class: 'card' });
      card.appendChild(h('div', { html: '<b>' + ui.esc(r.n) + '</b>' }));
      v.slots.forEach(s => {
        card.appendChild(h('div', { class: 'small', html: 'Ô ' + s.rank + ': <b>' + ui.esc(slotLine(s)) + '</b>' + (s.site ? ' · ' + ui.esc(s.site) : '') }));
        card.appendChild(bar(s.share * 100, s.rank === 1 ? '' : s.rank === 2 ? 'el' : 'di'));
      });
      if (v.lord) card.appendChild(h('div', { class: 'small' }, 'Triều đình theo ' + (v.lord.faith ? fn(v.lord.faith) : 'thế tục') + ', ' + v.lordWord + '.'));
      sec.appendChild(card);
    });
    const top = TT.faith.ranking().slice(0, 3), box2 = h('div', { class: 'card' });
    box2.appendChild(h('div', { html: '<b>Ba giáo hội lớn nhất thiên hạ</b>' }));
    top.forEach(t => {
      const f = TT.faith.byId[t.id], ch = TT.faith.church(t.id);
      box2.appendChild(h('div', { class: 'small', html: '<b>' + ui.esc(f.n) + '</b> · sức ' + ui.esc(TT.faith.lucWord(t.luc)) + ' · giữ giới ' + (ch.ky >= 65 ? 'nghiêm' : ch.ky >= 40 ? 'vừa phải' : 'thoáng') + (ch.phai.length ? ' · nhánh: ' + ui.esc(ch.phai.map(p => p.n).join(', ')) : '') }));
      box2.appendChild(h('div', { class: 'small' }, 'Đóng góp: ' + f.dongGop));
    });
    sec.appendChild(box2);
    const hist = (TT.faith.peek() && TT.faith.peek().hist) || [];
    hist.slice(-4).reverse().forEach(e => sec.appendChild(h('div', { class: 'small' }, 'Năm ' + yr(e.m) + ': ' + e.t)));
  };
})();
