// Cửa sổ cửa hàng và dịch vụ: mở khi bấm vào một công trình trong màn hình nhân vật. Cửa hàng có hai tab Mua và Bán, lưới vật phẩm có
// biểu tượng, bảng chi tiết, hạn mức giao dịch tháng này. Công trình dịch vụ (y quán, quán trọ, tửu lâu, quan phủ, cổng...) hiện nút việc làm được.
// Khi cửa sổ mở, thời gian tạm dừng (trả lại tốc độ cũ khi đóng).
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h;

  let back = null, panel = null, cur = null, mode = 'buy', sel = null, msg = '', filter = '', prevSpeed = null;

  function ensure() {
    if (back) return;
    back = h('div', { class: 'shop-back', onclick: e => { if (e.target === back) close(); } });
    panel = h('div', { class: 'shop-panel' }); back.appendChild(panel); document.body.appendChild(back);
    document.addEventListener('keydown', e => { if (back.classList.contains('on') && e.key === 'Escape') { e.stopPropagation(); close(); } }, true);
  }
  function open(id) {
    const c = TT.player(); if (!c || (TT.world && TT.world.pending)) return;
    if (!TT.bld.at(c).includes(id)) return;
    ensure(); cur = id; mode = 'buy'; sel = null; msg = ''; filter = '';
    if (prevSpeed == null && TT.time) { prevSpeed = TT.time.speed; if (TT.time.setSpeed) TT.time.setSpeed(0); }
    back.classList.add('on'); render();
  }
  function close() {
    if (!back) return; back.classList.remove('on');
    if (prevSpeed != null && TT.time && TT.time.setSpeed && TT.time.speed === 0) TT.time.setSpeed(prevSpeed);
    prevSpeed = null; ui.markDirty && ui.markDirty();
  }
  const def = id => (ui.bld && ui.bld.defs[id]) || { n: id, desc: '' };

  function head(c) {
    const d = def(cur), pl = TT.map.place(c.place);
    return h('div', { class: 'shop-head' }, h('div', null, h('b', { class: 'shop-title' }, (ui.bld && ui.bld.nameOf ? ui.bld.nameOf(cur) : d.n)), h('span', { class: 'small' }, ' · ' + (pl ? pl.n : '')), h('div', { class: 'small' }, d.desc)),
      h('button', { class: 'sm', onclick: close }, 'Đóng ✕'));
  }

  function renderService(c) {
    panel.innerHTML = ''; panel.appendChild(head(c));
    const s = TT.bld.service(c, cur);
    panel.appendChild(h('p', { class: 'shop-text' }, s.text));
    if (s.note) panel.appendChild(h('p', { class: 'small' }, s.note));
    if (s.van && ui.nationBars) { const nb = ui.nationBars(s.van); if (nb) panel.appendChild(nb); }
    if (s.info && ui.placeInfo) panel.appendChild(ui.placeInfo(c, TT.map.place(c.place))); // thông tin nơi đang đứng, chỉ xem được ở công trình đại diện
    if (msg) panel.appendChild(h('div', { class: 'shop-msg' }, msg));
    const row = h('div', { class: 'btns', style: 'margin-top:8px' });
    s.options.forEach(o => row.appendChild(h('button', {
      disabled: o.disabled ? 'disabled' : null, title: typeof o.disabled === 'string' ? o.disabled : null,
      onclick: () => { if (o.confirm && !confirm(o.confirm)) return; const t = o.run(c); if (o.close) { close(); return; } msg = t || ''; render(); }
    }, o.label + (typeof o.disabled === 'string' ? ' (' + o.disabled + ')' : ''))));
    panel.appendChild(row);
  }

  function slot(id, label, price, qty, off, on, tip) {
    const el = h('div', { class: 'slot' + (on ? ' sel' : '') + (off ? ' off' : ''), title: tip || null, onclick: () => { sel = id; render(); } },
      ui.icon(id, 44), h('div', { class: 'sn' }, label), h('div', { class: 'sp' }, price != null ? TT.ls.fmt(price) : ''), qty != null ? h('div', { class: 'sq' }, 'x' + qty) : null);
    return el;
  }

  // Đường giá 36 tháng gần nhất (SVG nhỏ).
  function spark(vals) {
    if (vals.length < 2) return null;
    const mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), W = 150, H = 34, rg = Math.max(0.05, mx - mn);
    const pts = vals.map((v, i) => (i * W / (vals.length - 1)).toFixed(1) + ',' + (H - 3 - (v - mn) / rg * (H - 6)).toFixed(1)).join(' ');
    const el = document.createElement('div'); el.innerHTML = '<svg width="' + W + '" height="' + H + '" style="background:rgba(255,255,255,.05);border-radius:4px"><polyline fill="none" stroke="#e8c36a" stroke-width="1.5" points="' + pts + '"/></svg>';
    return el.firstChild;
  }
  // Thông tin thị trường của một món theo "tầm nhìn" thương nhân (0 đến 5).
  function marketInfo(c, id) {
    const E = D.ECO, g = TT.eco.group(id); if (!g) return null;
    const box = h('div', { class: 'small', style: 'margin-top:8px;padding:6px;border:1px solid rgba(255,255,255,.12);border-radius:6px' });
    const lv = TT.eco.insight(c), rid = c.region, rel = TT.eco.rel(rid, g), ser = TT.eco.series(rid, g);
    const word = rel > 1.25 ? 'đắt hơn thường' : rel < 0.8 ? 'rẻ hơn thường' : 'quanh mức thường';
    box.appendChild(h('div', null, E.names[g] + ' ở vùng này: ' + word + (lv >= 1 ? ' (' + Math.round(rel * 100) + '% mức thường)' : '') + '.'));
    if (lv >= 1 && ser.length > 3) { const d = ser[ser.length - 1] - ser[Math.max(0, ser.length - 4)]; box.appendChild(h('div', null, 'Xu hướng 3 tháng: ' + (d > 0.03 ? 'đang lên' : d < -0.03 ? 'đang xuống' : 'đi ngang') + '.')); }
    if (lv >= 2) { const s = spark(ser); if (s) box.appendChild(s); }
    if (lv >= 3) { const w = TT.eco.why(rid, g); if (w) box.appendChild(h('div', null, 'Nguyên nhân: ' + w + '.')); }
    if (lv >= 4) {
      const best = D.REGIONS.filter(r => r.id !== rid).map(r => ({ n: r.n, rel: TT.eco.rel(r.id, g) })).sort((a, b) => a.rel - b.rel);
      box.appendChild(h('div', null, 'Rẻ nhất: ' + best[0].n + ' (' + Math.round(best[0].rel * 100) + '%). Đắt nhất: ' + best[best.length - 1].n + ' (' + Math.round(best[best.length - 1].rel * 100) + '%).'));
    }
    if (lv >= 5) { const up = TT.eco.upcoming(rid); if (up.length) box.appendChild(h('div', null, 'Tin sớm: ' + up.map(x => x.text + ' (sau ' + x.in + ' tháng)').join('; ') + '.')); }
    if (lv < 5) box.appendChild(h('div', { style: 'opacity:.6' }, 'Theo nghề Thương nhân và vào thương hội để nhìn rõ thị trường hơn.'));
    return box;
  }
  // Bảng thương hội ở hội sở: thiện cảm, bậc hội viên, gia nhập hoặc rời.
  function hoiPanel(c) {
    const lead = TT.hoi.leadAt(c.region); if (!lead) return null;
    const m = TT.hoi.member(c), rep = TT.hoi.rep(c, lead.id), box = h('div', { class: 'shop-lim', style: 'margin:6px 0' });
    box.appendChild(h('div', null, lead.n + ': thiện cảm ' + Math.round(rep) + ' (' + TT.hoi.levelName(rep) + '), giảm giá mua ' + Math.round(TT.hoi.discount(c) * 100) + '%, phí bán ' + Math.round(TT.hoi.sellFee(c) * 100) + '%. ' + (m ? 'Bạn là ' + TT.hoi.rankName(c).toLowerCase() + ' của ' + (TT.fac.get(m.id) || {}).n + '.' : 'Bạn chưa là hội viên.')));
    const row = h('div', { class: 'btns', style: 'margin-top:4px' });
    if (m) row.appendChild(h('button', { class: 'sm', onclick: () => { if (confirm('Rời hội? Thiện cảm sẽ giảm.')) { msg = TT.hoi.leave(c).text; render(); } } }, 'Rời hội'));
    else { const cj = TT.hoi.canJoin(c, lead.id); row.appendChild(h('button', { class: 'sm', disabled: cj.ok ? null : 'disabled', onclick: () => { msg = TT.hoi.join(c, lead.id).text; render(); } }, 'Xin gia nhập hội')); if (!cj.ok) box.appendChild(h('div', { class: 'small' }, cj.why.join(' '))); }
    box.appendChild(row);
    return box;
  }

  // Nhiệm vụ, vay và bảo hiểm của hội sở (E7b): chỉ chữ, bậc và nút.
  function hoiDeals(c, lead) {
    const box = h('div', { class: 'shop-lim', style: 'margin:6px 0' }), s = TT.hoi.S(c), perk = TT.hoi.perk(c);
    const act = r => { msg = r.text; render(); };
    if (!D.ECO.hq) return null;
    if (!perk) {
      box.appendChild(h('div', null, 'Nhiệm vụ, vay và bảo hiểm chỉ dành cho hội viên không nợ hội.' + (s.loan && s.loan.od ? ' Khoản vay của bạn đã quá hạn, hãy trả hết trước.' : ' Bạn chưa là hội viên của ' + lead.n + '.')));
      if (s.loan) box.appendChild(h('div', { class: 'btns', style: 'margin-top:4px' }, h('button', { class: 'sm', onclick: () => act(TT.hoi.repay(c, TT.hoi.owed(c))) }, 'Trả hết nợ (' + TT.ls.fmt(TT.hoi.owed(c)) + ')')));
      return box;
    }
    box.appendChild(h('div', null, 'Bậc của bạn: ' + TT.hoi.rankName(c).toLowerCase() + '.'));
    // đơn hội
    box.appendChild(h('div', { style: 'margin-top:6px;font-weight:bold' }, 'Nhiệm vụ hội'));
    if (s.job && s.job.hid === perk.id) box.appendChild(h('div', null, 'Đang làm: ' + TT.hoi.jobText(s.job) + '. Thưởng ' + TT.ls.fmt(s.job.reward) + ', thiện cảm +' + s.job.rep + '.'));
    else if (s.job) box.appendChild(h('div', { class: 'small' }, 'Bạn đang làm một đơn khác.'));
    TT.hoi.board(lead.id).forEach(b => {
      const ok = !s.job && lead.id === perk.id;
      box.appendChild(h('div', { class: 'btns', style: 'margin-top:4px' }, h('span', null, (b.kind === 'giao' ? 'Giao ' : 'Thu mua ') + b.qty + ' ' + D.ECO.names[b.g] + ', thưởng ' + TT.ls.fmt(b.reward)),
        h('button', { class: 'sm', disabled: ok ? null : 'disabled', onclick: () => act(TT.hoi.accept(c, lead.id, b.i)) }, 'Nhận đơn')));
    });
    // vay
    box.appendChild(h('div', { style: 'margin-top:8px;font-weight:bold' }, 'Vay hội'));
    const lim = TT.hoi.loanLimit(c);
    if (s.loan) {
      box.appendChild(h('div', null, 'Đang nợ ' + TT.ls.fmt(TT.hoi.owed(c)) + ' (gốc ' + TT.ls.fmt(s.loan.p) + ', lãi ' + TT.ls.fmt(s.loan.int) + '). ' + (s.loan.od ? 'Đã quá hạn.' : 'Còn ' + Math.max(0, s.loan.due - TT.world.months) + ' tháng để trả.')));
      box.appendChild(h('div', { class: 'btns', style: 'margin-top:4px' }, h('button', { class: 'sm', onclick: () => act(TT.hoi.repay(c, TT.hoi.owed(c))) }, 'Trả hết nợ')));
    } else {
      box.appendChild(h('div', { class: 'small' }, 'Hạn mức theo bậc: ' + TT.ls.fmt(lim) + '. Lãi ' + Math.round(D.ECO.loan.rate * 100) + '% mỗi năm, trả trong hai năm.'));
      box.appendChild(h('div', { class: 'btns', style: 'margin-top:4px' },
        h('button', { class: 'sm', onclick: () => act(TT.hoi.borrow(c, Math.floor(lim / 2))) }, 'Vay một nửa'),
        h('button', { class: 'sm', onclick: () => act(TT.hoi.borrow(c, lim)) }, 'Vay hết hạn mức')));
    }
    // bảo hiểm
    box.appendChild(h('div', { style: 'margin-top:8px;font-weight:bold' }, 'Bảo hiểm chuyến buôn'));
    if (s.ins) box.appendChild(h('div', null, 'Chuyến tới đây đã có bảo hiểm: bồi thường tới ' + TT.ls.fmt(s.ins.cap) + ' nếu bị cướp.'));
    else {
      const v = TT.hoi.cargoValue(c);
      box.appendChild(h('div', { class: 'small' }, v > 0 ? 'Hàng buôn trong túi trị giá ' + TT.ls.fmt(v) + '. Phí ' + Math.round(D.ECO.ins.rate * 100) + '%, bồi thường tới ' + Math.round(D.ECO.ins.cap * 100) + '% giá trị hàng.' : 'Bạn chưa mang hàng buôn nào.'));
      box.appendChild(h('div', { class: 'btns', style: 'margin-top:4px' }, h('button', { class: 'sm', disabled: v > 0 ? null : 'disabled', onclick: () => act(TT.hoi.insure(c)) }, 'Mua bảo hiểm chuyến này')));
    }
    return box;
  }

  // Giám định đồ chợ đen và đấu giá chưa rõ thật giả (E7b).
  function gdPanel(c) {
    const ids = Object.keys(c.sus || {}), box = h('div', { class: 'shop-lim', style: 'margin:6px 0' });
    box.appendChild(h('div', null, 'Giám định: đồ mua ở chợ đen hoặc thắng đấu giá có thể là đồ nhái. ' + (TT.gd.free(c) ? 'Với tầm nhìn của bạn, giám định miễn phí.' : 'Phí ' + TT.ls.fmt(TT.gd.fee(c)) + ' mỗi lần, có thể không chắc.')));
    if (!ids.length) box.appendChild(h('div', { class: 'small' }, 'Túi bạn không có món nào cần giám định.'));
    ids.forEach(id => box.appendChild(h('div', { class: 'btns', style: 'margin-top:4px' }, h('span', null, D.ITEMS[id].n + ' (' + c.sus[id].n + ' món)'),
      h('button', { class: 'sm', onclick: () => { msg = TT.gd.appraise(c, id).text; render(); } }, 'Giám định'))));
    return box;
  }

  function renderShop(c) {
    panel.innerHTML = ''; panel.appendChild(head(c));
    const buysTxt = TT.bld.buysText(cur), rows = TT.market.stock(c, cur), left = TT.bld.left(c), lim = TT.bld.limitOf(c);
    panel.appendChild(h('div', { class: 'shop-bar' },
      h('button', { class: mode === 'buy' ? 'on' : '', onclick: () => { mode = 'buy'; sel = null; msg = ''; render(); } }, 'Mua'),
      h('button', { class: mode === 'sell' ? 'on' : '', onclick: () => { mode = 'sell'; sel = null; msg = ''; render(); } }, 'Bán'),
      h('span', { class: 'small' }, 'Tài sản: ' + TT.ls.fmt(TT.ls.wealth(c)))));
    panel.appendChild(h('div', { class: 'shop-lim' + (left < lim * 0.1 ? ' bad' : '') }, 'Hạn mức giao dịch tháng này ở nơi này: còn ' + TT.ls.fmt(left) + ' trên ' + TT.ls.fmt(lim) + '. ' + (mode === 'sell' ? 'Cửa hàng này chỉ thu: ' + buysTxt + '.' : 'Hàng ở đây có hạn, hết thì chờ tháng sau họ nhập thêm.')));
    if (cur === 'hoi' && TT.hoi) { const hp = hoiPanel(c); if (hp) panel.appendChild(hp); const lead = TT.hoi.leadAt(c.region); if (lead) { const hd = hoiDeals(c, lead); if (hd) panel.appendChild(hd); } }
    if (cur === 'den' && D.ECO.hq && TT.gd) panel.appendChild(gdPanel(c));
    const grid = h('div', { class: 'shop-grid' });
    let list;
    if (mode === 'buy') list = rows.map(r => ({ id: r.id, n: D.ITEMS[r.id].n, price: r.price, qty: r.qty, ok: r.qty > 0 && TT.ls.can(c, r.price) }));
    else list = TT.items.list(c).filter(x => D.ITEMS[x.id].cat !== 'ls').map(x => { const ok = TT.bld.buys(cur, x.id); return { id: x.id, n: D.ITEMS[x.id].n, price: ok ? TT.market.sellPrice(c, x.id, cur) : null, qty: x.n, ok, tip: ok ? null : 'Cửa hàng này không thu mua món này' }; });
    if (!list.some(x => x.id === sel)) sel = list.length ? list[0].id : null;
    list.forEach(x => grid.appendChild(slot(x.id, x.n, x.price, x.qty, !x.ok, x.id === sel, x.tip)));
    if (!list.length) grid.appendChild(h('div', { class: 'small' }, mode === 'buy' ? 'Cửa hàng không có gì để bán.' : 'Túi bạn không có gì để bán ở đây.'));
    const det = h('div', { class: 'shop-det' });
    const it = list.find(x => x.id === sel);
    if (it) {
      const d = D.ITEMS[it.id];
      det.appendChild(ui.icon(it.id, 72));
      det.appendChild(h('div', { html: '<b>' + ui.esc(d.n) + '</b>' }));
      det.appendChild(h('div', { class: 'small' }, (d.gear ? 'Phẩm ' + D.GEAR.TIERS[d.tier] : d.tier != null && d.cat !== 'ls' ? D.TIER_NAMES[d.tier] : '') + (d.elem ? ' · hệ ' + d.elem : '')));
      det.appendChild(h('div', { class: 'small' }, d.desc));
      det.appendChild(h('div', { style: 'margin:6px 0' }, (mode === 'buy' ? 'Giá mua: ' : 'Giá bán: ') + (it.price != null ? TT.ls.fmt(it.price) : '—') + ' / món'));
      det.appendChild(h('div', { class: 'small' }, mode === 'buy' ? 'Cửa hàng còn: ' + it.qty : 'Trong túi bạn: ' + it.qty));
      if (mode === 'sell' && TT.items.life(it.id)) { const r = TT.items.remaining(c, it.id), f = TT.eco.fresh(c, it.id); det.appendChild(h('div', { class: 'small' + (r <= 3 ? ' bad' : '') }, 'Còn dùng được ' + Math.max(1, Math.round(r)) + ' tháng' + (f < 1 ? ' · giá bán chỉ còn ' + Math.round(f * 100) + '% vì sắp hết hạn' : '') + '.')); }
      if (mode === 'buy' && TT.items.life(it.id)) det.appendChild(h('div', { class: 'small' }, 'Hạn dùng ' + TT.items.life(it.id) + ' tháng kể từ lúc mua; càng gần hạn càng mất giá, 3 tháng cuối còn 40%.'));
      const mi = marketInfo(c, it.id); if (mi) det.appendChild(mi);
      const bt = h('div', { class: 'btns', style: 'margin-top:6px' });
      [1, 5, 10, 'hết'].forEach(n => {
        const k = n === 'hết' ? it.qty : n; if (n !== 'hết' && k > it.qty) return; if (n === 'hết' && it.qty <= 1) return;
        bt.appendChild(h('button', { class: 'sm', disabled: it.ok ? null : 'disabled', onclick: () => {
          let done = 0, last = '';
          for (let i = 0; i < k; i++) { const r = mode === 'buy' ? TT.market.buy(c, it.id, cur) : TT.market.sell(c, it.id, 1, cur); last = r.text; if (!r.ok) break; done++; }
          msg = done ? (mode === 'buy' ? 'Đã mua ' : 'Đã bán ') + done + ' ' + d.n + (done < k ? '. ' + last : '.') : last; render();
        } }, (mode === 'buy' ? 'Mua ' : 'Bán ') + (n === 'hết' ? 'hết' : n)));
      });
      det.appendChild(bt);
      if (!it.ok && mode === 'sell') det.appendChild(h('div', { class: 'shop-lim bad', style: 'margin-top:8px' }, 'Cửa hàng này không thu mua món này. Hãy mang tới đúng cửa hàng (Đan các cho đan dược, Khí phô cho khí cụ, Phù trai cho bùa, Thư các cho sách).'));
      if (!it.ok && mode === 'buy') det.appendChild(h('div', { class: 'shop-lim bad', style: 'margin-top:8px' }, it.qty > 0 ? 'Bạn chưa đủ linh thạch.' : 'Hết hàng.'));
    }
    if (mode === 'sell') det.appendChild(h('div', { class: 'btns', style: 'margin-top:10px' }, h('button', { class: 'sm', onclick: () => { const n = TT.market.autoSell(c); msg = 'Đã bán ' + n + ' món hàng thừa (giữ lại vài món dùng được).'; render(); } }, 'Bán đồ thừa')));
    panel.appendChild(h('div', { class: 'shop-cols' }, grid, det));
    if (msg) panel.appendChild(h('div', { class: 'shop-msg' }, msg));
  }

  function render() {
    const c = TT.player(); if (!c) return close();
    if (!back || !back.classList.contains('on')) return;
    if (!TT.bld.at(c).includes(cur)) { close(); return; }
    if (TT.bld.isShop(cur)) renderShop(c); else renderService(c);
  }
  ui.shop = { open, close, render };
})();
