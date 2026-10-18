// Tab "Nhật báo": thư viện các số đã mua, đăng ký; bấm Đọc thì mở tờ báo toàn màn hình (giấy, mục lục, hai cột, bảng giá, biểu đồ).
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h, P = D.PRESS;
  let back = null, curNo = 0, chReg = null, chGrp = 'dan', msg = '', prevSpeed = null;
  const yr = m => Math.floor(m / 12) - TT.config.startYear + 1;
  const BADGE = { v: ['đã kiểm chứng', 'b-ok'], k: ['khá chắc', 'b-mid'], u: ['chưa xác nhận', 'b-low'] };

  function chartSvg(vals, label) {
    const W = 600, H = 130, mn = Math.min.apply(null, vals.concat([100])), mx = Math.max.apply(null, vals.concat([100])), rg = Math.max(10, mx - mn);
    const x = i => 30 + (W - 40) * i / Math.max(1, vals.length - 1), y = v => 10 + (H - 28) * (1 - (v - mn) / rg);
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;margin-top:6px"><line x1="30" x2="' + (W - 10) + '" y1="' + y(100) + '" y2="' + y(100) + '" stroke="#7a6a50" stroke-dasharray="4 3"/><polyline fill="none" stroke="#7a3b2e" stroke-width="2.2" points="' + vals.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1)).join(' ') + '"/><text x="30" y="' + (H - 3) + '" font-size="10" fill="#6a5a40">đầu kỳ</text><text x="' + (W - 10) + '" y="' + (H - 3) + '" font-size="10" fill="#6a5a40" text-anchor="end">cuối kỳ</text><text x="4" y="' + (y(mx) + 4) + '" font-size="10" fill="#6a5a40">' + mx + '%</text><text x="4" y="' + (y(mn) + 4) + '" font-size="10" fill="#6a5a40">' + mn + '%</text><text x="' + (W - 12) + '" y="' + (y(100) - 3) + '" font-size="10" fill="#6a5a40" text-anchor="end">mức thường 100%</text></svg><div class="qty">' + label + '</div>';
  }
  function art(x) {
    const b = BADGE[x.c] || BADGE.v;
    return '<div class="art"><p>' + (x.m ? '<b>Năm ' + yr(x.m) + '.</b> ' : '') + ui.esc(x.t) + '</p>' + (x.p ? '<span class="badge b-rel">liên quan bạn</span>' : '') + '<span class="badge ' + b[1] + '">' + b[0] + '</span></div>';
  }

  function paperHtml(c, is) {
    const E = D.ECO, regs = D.REGIONS, reg = chReg || c.region, secHead = (id, n, k) => '<div class="sech" id="ps_' + id + '">' + n + (k ? ' <span class="qty">(' + k + ')</span>' : '') + '</div>';
    let s = '<div class="mast"><div class="t">THIÊN CƠ BÁO</div><div class="s">Tổng san bốn năm · giá cả, đường buôn, thế cuộc · do ' + P.owner + ' ra</div></div>' +
      '<div class="meta"><span>Số ' + is.no + ' · năm ' + yr(is.from) + ' đến năm ' + yr(is.to) + '</span><span>' + is.n + ' tin · 4 bảng · biểu đồ giá</span></div>';
    s += secHead('edit', 'Xã luận') + '<div class="ed">' + ui.esc(is.edit) + '</div>';
    is.secs.forEach(sc => {
      s += secHead(sc.id, sc.n, sc.items.length + (sc.id === 'timeline' ? ' mốc' : ' tin'));
      if (sc.id === 'timeline') s += '<div class="tl">' + sc.items.map(x => '<div><b>Năm ' + yr(x.m) + '</b> ' + ui.esc(x.t) + '</div>').join('') + '</div>';
      else s += '<div class="cols">' + sc.items.map(art).join('') + '</div>';
    });
    // bảng giá và biểu đồ
    s += secHead('gia_bang', 'Bảng giá và thị trường') + '<div class="qty">Vùng: <select id="p-reg">' + regs.map(r => '<option value="' + r.id + '"' + (r.id === reg ? ' selected' : '') + '>' + r.n + '</option>').join('') + '</select> Nhóm hàng: <select id="p-grp">' + E.groups.map(g => '<option value="' + g + '"' + (g === chGrp ? ' selected' : '') + '>' + E.names[g] + '</option>').join('') + '</select></div>';
    const ser = is.ch[reg] && is.ch[reg][chGrp]; if (ser) s += chartSvg(ser, 'Giá ' + E.names[chGrp].toLowerCase() + ' ở ' + TT.map.region(reg).n + ' so với mức thường của vùng, theo bốn năm.');
    s += '<table class="pt"><tr><th>Nhóm hàng (' + TT.map.region(reg).n + ')</th><th>Đầu kỳ</th><th>Cuối kỳ</th><th>Đỉnh</th><th>Đáy</th></tr>' + is.rows.filter(r => r[0] === reg).map(r => '<tr><td>' + E.names[r[1]] + '</td><td>' + r[2] + '%</td><td class="' + (r[3] > r[2] + 5 ? 'up' : r[3] < r[2] - 5 ? 'dn' : '') + '">' + r[3] + '%</td><td>' + r[4] + '%</td><td>' + r[5] + '%</td></tr>').join('') + '</table>';
    s += secHead('xh', 'Tu sĩ nổi bật', is.rank.length + ' người') + '<table class="pt"><tr><th>Hạng</th><th>Tu sĩ</th><th>Cảnh giới</th><th>Vùng</th><th>Tuổi</th></tr>' + is.rank.map((r, i) => '<tr><td>' + (i + 1) + '</td><td style="text-align:left">' + ui.esc(r[0]) + '</td><td>' + D.REALM_NAMES[r[1]] + '</td><td>' + ((TT.map.region(r[2]) || { n: '?' }).n) + '</td><td>' + r[3] + '</td></tr>').join('') + '</table>';
    s += secHead('dsx', 'Dân sinh và thuế các vùng') + '<table class="pt"><tr><th>Vùng</th><th>Dân số</th><th>Dân tâm</th><th>Thuế chợ</th></tr>' + is.reg.map(r => '<tr><td>' + TT.map.region(r[0]).n + '</td><td>' + r[1] + '%</td><td>' + r[2] + '</td><td>' + r[3] + '%</td></tr>').join('') + '</table>';
    if (is.pacts.length) s += '<div class="qty" style="margin-top:6px">Hiệp ước đáng chú ý: ' + is.pacts.map(ui.esc).join('; ') + '.</div>';
    s += secHead('dubao', 'Dự báo bốn năm tới', is.fc.length) + (is.fc.length ? '<div class="cols">' + is.fc.map(x => '<div class="art"><p>' + ui.esc(x) + '</p><span class="badge b-mid">nhận định</span></div>').join('') + '</div>' : '<div class="qty">Chưa thấy dấu hiệu lớn.</div>');
    return s;
  }

  function toc(is) {
    const items = [['edit', 'Xã luận']].concat(is.secs.map(sc => [sc.id, sc.n])).concat([['gia_bang', 'Bảng giá'], ['xh', 'Tu sĩ nổi bật'], ['dsx', 'Dân sinh và thuế'], ['dubao', 'Dự báo']]);
    return items.map(x => '<a data-t="ps_' + x[0] + '">' + x[1] + '</a>').join('');
  }

  function ensure() {
    if (back) return;
    back = h('div', { class: 'paper-back' }); document.body.appendChild(back);
    document.addEventListener('keydown', e => { if (back.classList.contains('on') && e.key === 'Escape') { e.stopPropagation(); close(); } }, true);
  }
  function open(no) {
    const c = TT.player(); if (!c) return; ensure(); curNo = no;
    if (prevSpeed == null && TT.time) { prevSpeed = TT.time.speed; if (TT.time.setSpeed) TT.time.setSpeed(0); }
    back.classList.add('on'); render(); back.scrollTop = 0;
  }
  function close() {
    if (!back) return; back.classList.remove('on');
    if (prevSpeed != null && TT.time && TT.time.setSpeed && TT.time.speed === 0) TT.time.setSpeed(prevSpeed);
    prevSpeed = null; curNo = 0;
  }
  function render() {
    const c = TT.player(), is = TT.press.issue(curNo); if (!c || !is) return close();
    const top = back.scrollTop;
    back.innerHTML = '';
    back.appendChild(h('div', { class: 'paper-top' }, h('b', { style: 'color:#dbe4ee' }, 'Nhật báo · số ' + is.no), h('button', { class: 'sm', onclick: close }, 'Đóng ✕')));
    const wrap = h('div', { class: 'paperwrap' }), tocEl = h('div', { class: 'toc' }), paper = h('div', { class: 'paper' });
    tocEl.innerHTML = '<b>Mục lục</b><div class="small" style="margin-bottom:4px">Năm ' + yr(is.from) + ' đến ' + yr(is.to) + '</div>' + toc(is);
    paper.innerHTML = paperHtml(c, is);
    wrap.appendChild(tocEl); wrap.appendChild(paper); back.appendChild(wrap);
    tocEl.querySelectorAll('a').forEach(a => { a.onclick = () => { const t = back.querySelector('#' + a.getAttribute('data-t')); if (t) back.scrollTo({ top: t.offsetTop - 40, behavior: 'smooth' }); }; });
    const rs = back.querySelector('#p-reg'), gs = back.querySelector('#p-grp');
    if (rs) rs.onchange = e => { chReg = e.target.value; render(); };
    if (gs) gs.onchange = e => { chGrp = e.target.value; render(); };
    back.scrollTop = top;
  }
  ui.press = { open, close };

  function build(box, c) {
    const ps = TT.press.ensure(c), owned = TT.press.owned(c), all = TT.world.press ? TT.world.press.issues : [];
    box.appendChild(h('h2', null, P.name));
    const st = h('div', { class: 'card' });
    st.appendChild(h('div', { class: 'small' }, 'Số tới sau khoảng ' + TT.press.nextIn() + ' tháng (bốn năm một số). Phí ' + TT.ls.fmt(TT.press.feeGold(c)) + ' mỗi tháng.'));
    st.appendChild(h('div', { class: ps.sub ? 'good-txt' : 'small' }, ps.sub ? 'Đang đăng ký (từ năm ' + yr(ps.since) + '). Tiền trừ tự động mỗi tháng.' : 'Chưa đăng ký. Người bán báo sẽ ghé mỗi bốn năm nếu bạn đủ giàu; hoặc đăng ký ngay bên dưới.'));
    const row = h('div', { class: 'btns' });
    if (ps.sub) row.appendChild(h('button', { class: 'sm', onclick: () => { msg = TT.press.cancel(c).text; ui.markDirty(); } }, 'Hủy đăng ký'));
    else row.appendChild(h('button', { class: 'sm', onclick: () => { msg = TT.press.subscribe(c).text; ui.markDirty(); } }, 'Đăng ký ' + P.name));
    st.appendChild(row); box.appendChild(st);
    if (msg) box.appendChild(h('div', { class: 'small good-txt' }, msg));
    box.appendChild(h('div', { class: 'sec' }, 'Các số đã mua (' + owned.length + ')'));
    if (!owned.length) box.appendChild(h('div', { class: 'small' }, 'Bạn chưa có số nào. Số đầu tiên ra sau khi thế giới chạy đủ bốn năm.'));
    owned.slice().reverse().forEach(is => box.appendChild(h('div', { class: 'card' }, h('div', { html: '<b>Số ' + is.no + '</b> <span class="small">· năm ' + yr(is.from) + ' đến ' + yr(is.to) + ' · ' + is.n + ' tin</span>' }),
      h('button', { class: 'sm', onclick: () => open(is.no) }, 'Đọc'))));
    const buyable = all.filter(is => !owned.some(o => o.no === is.no));
    if (buyable.length) {
      box.appendChild(h('div', { class: 'sec' }, 'Số cũ có thể mua (' + TT.ls.fmt(TT.press.oldPrice(c)) + ' mỗi số, mua ở nơi có cửa hàng)'));
      buyable.slice().reverse().forEach(is => box.appendChild(h('div', { class: 'small' }, 'Số ' + is.no + ' (năm ' + yr(is.from) + ' đến ' + yr(is.to) + ') ', h('button', { class: 'sm', onclick: () => { msg = TT.press.buyOld(c, is.no).text; ui.markDirty(); } }, 'Mua'))));
    }
  }
  ui.addTab({ id: 'press', label: 'Nhật báo', key: c => { const ps = c.press || {}; return c.id + ':' + (ps.owned || []).join() + ':' + ps.sub + ':' + msg + ':' + (TT.world.press ? TT.world.press.no : 0) + ':' + Math.floor(TT.world.months / 12); }, build });
})();
