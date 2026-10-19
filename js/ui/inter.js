// Mục "Liên tông" (S8) trong tab Tông môn: vai trò với triều, giải đấu và báo danh, ước pháp, Thiên hạ công ước, đại chiến liên tông.
// Chỉ chữ và bậc, không số. Mọi hàm đọc không gọi rng (xem systems/inter.js).
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, K = D.INTERSECT, h = ui.h;

  const nm = x => (x ? x.n : '?');

  // Giải đấu: chữ về thời điểm và người bảo trợ, không năm, không số.
  function giaiText() {
    const G = TT.inter.peekS().giai;
    if (!TT.inter.on() || !G) return 'Giải đấu liên tông chưa khai mở.';
    const m = TT.world.months, parts = [];
    if (TT.inter.giaiOpen()) parts.push('Giải đấu liên tông sắp diễn ra trong năm tới; tông nào muốn dự thì báo danh trước kỳ.');
    else if (G.next - m > 12) parts.push('Giải đấu liên tông còn xa, chưa đến lúc báo danh.');
    else parts.push('Giải đấu liên tông đang chờ kỳ diễn ra.');
    if (G.last) {
      const w = TT.fac.get(G.last.win), host = TT.fac.get(G.last.host);
      parts.push('Kỳ trước ' + nm(w) + ' đoạt giải' + (host ? ', do ' + nm(host) + ' bảo trợ' : '') + '.');
    }
    return parts.join(' ');
  }

  // Thiên hạ công ước theo từng vùng có triều: chữ "có hiệu lực", "đã bị phá vỡ".
  function congRows() {
    const S = TT.inter.peekS(), out = [];
    TT.fac.list('trieu').filter(TT.fac.alive).forEach(tr => {
      const v = S.cong[tr.region];
      if (v === undefined) return;
      out.push(TT.map.region(tr.region).n + ': Thiên hạ công ước ' + (v === -1 ? 'đã bị phá vỡ' : 'đang có hiệu lực') + '.');
    });
    return out;
  }

  function warRows() {
    return TT.inter.bigWars().map(w => {
      const a = TT.fac.get(w.a), b = TT.fac.get(w.b), tr = a && b ? TT.inter.trieuOfRegion(b.region) : null;
      return nm(a) + ' và ' + nm(b) + ' đang đánh nhau; triều ' + (tr ? nm(tr) : '') + ' ' + K.stance[w.stance] + '.';
    });
  }

  function line(box, t, cls) { box.appendChild(h('div', { class: 'small' + (cls ? ' ' + cls : '') }, t)); }

  ui.interBlock = function (box, c, member) {
    const I = TT.inter;
    if (!I || !I.on()) return;
    box.appendChild(h('div', { class: 'sec' }, 'Liên tông'));

    // Vai trò của tông mình với triều (chỉ thành viên)
    const mine = member && c.sect ? TT.fac.get(c.sect.id) : null;
    if (mine) {
      const d = I.describe(mine);
      box.appendChild(h('div', { class: 'card' },
        h('div', { html: '<b>' + ui.esc(mine.n) + '</b> <span class="small">· ' + ui.esc(d.role) + '</span>' }),
        h('div', { class: 'small' }, d.roleDesc + (d.trieu ? ' Triều ' + ui.esc(d.trieu.replace(/^Vương triều /, '')) + ' đặt ở vùng này.' : ''))));
    }

    // Giải đấu liên tông
    const giai = h('div', { class: 'card' }, h('div', { html: '<b>Giải đấu liên tông</b>' }));
    line(giai, giaiText());
    if (mine && I.giaiOpen()) {
      giai.appendChild(h('button', {
        onclick: () => { const r = I.enter(c); if (ui.say) ui.say(r.text); ui.markDirty(); }
      }, I.entered(c) ? 'Rút tên khỏi giải' : 'Báo danh dự thi'));
    }
    box.appendChild(giai);

    // Minh ước và ước pháp
    const uoc = I.uocPairs();
    const minh = h('div', { class: 'card' }, h('div', { html: '<b>Ước pháp giữa các tông</b>' }));
    if (!uoc.length) line(minh, 'Chưa có tông nào ký ước pháp. Các minh ước vẫn chỉ là lời kết giao.');
    uoc.forEach(q => line(minh, nm(q[0]) + ' và ' + nm(q[1]) + ': cùng phòng thủ, chia mỏ, cho mượn đệ tử.'));
    box.appendChild(minh);

    // Thiên hạ công ước
    const rows = congRows();
    const cong = h('div', { class: 'card' }, h('div', { html: '<b>Thiên hạ công ước</b>' }));
    if (!rows.length) line(cong, 'Chưa có điều ước nào được ký: tu sĩ cao chưa cam kết không đánh phàm.');
    rows.forEach(t => line(cong, t, t.indexOf('bị phá') >= 0 ? 'bad-txt' : 'good-txt'));
    box.appendChild(cong);

    // Đại chiến liên tông đang diễn ra
    const wars = warRows();
    const big = h('div', { class: 'card' }, h('div', { html: '<b>Đại chiến liên tông</b>' }));
    if (!wars.length) line(big, 'Hiện không có đại chiến liên tông nào.');
    wars.forEach(t => line(big, t, 'bad-txt'));
    box.appendChild(big);
  };

})();
