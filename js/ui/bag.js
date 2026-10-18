// Tab "Hành trang" (trang bị, túi đồ, chợ, nghề) và tab "Công pháp" (công pháp, tâm pháp).
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h;

  const say = t => ui.say && ui.say(t);
  const act = fn => () => { const r = fn(); if (r && r.text) say(r.text); ui.markDirty(); };

  function bagData(c) {
    const cr = c.craft;
    return {
      id: c.id, gold: Math.floor(c.gold / 5), ls: Math.floor((c.ls || 0) * 2), absorbAt: c.absorbAt > TT.world.months ? c.absorbAt : 0, inv: c.inv, equip: c.equip, place: c.place && !c.travel ? c.place : '', shops: TT.bld.shopsAt(c).join(), realm: c.realm,
      craft: cr ? [cr.focus, cr.kiem.lv, cr.khi.lv, cr.dan.lv, cr.bua.lv, cr.cap, [cr.kiem, cr.khi, cr.dan, cr.bua].map(x => Math.floor(x.xp / 10))] : 0,
      sect: c.sect ? c.sect.rank : -1, hp: c.hp >= TT.stats.hpMax(c), proj: cr && cr.proj ? cr.proj.left : 0, forge: forge, rl: Math.floor(c.relicXp || 0), furn: cr ? TT.craft.furnaceTier(c) : 0, mats: cr ? Object.keys(c.inv || {}).filter(i => D.ITEMS[i] && (D.ITEMS[i].mat || D.ITEMS[i].ore || i === 'yeu_dan')).map(i => i + c.inv[i]).join() : ''
    };
  }
  const forge = { slot: 'weapon', tier: 0, stat: 'atk' };

  function itemRow(c, id, n, inMarket) {
    const d = D.ITEMS[id], v = TT.items.value(c, id);
    const row = h('div', { class: 'card' });
    row.appendChild(h('div', { class: 'ihead' }, ui.icon(id, 36), h('div', { html: '<b>' + ui.esc(d.n) + '</b> x' + n + ' <span class="small">(giá trị ' + TT.ls.fmt(v) + (d.gear ? ', phẩm ' + D.GEAR.TIERS[d.tier] : d.mat || d.ore || d.cat === 'lo' ? ', bậc ' + d.tier : d.tier != null && d.cat !== 'ls' ? ', ' + D.TIER_NAMES[d.tier] : '') + ')</span>' })));
    row.appendChild(h('div', { class: 'small' }, d.desc));
    if (TT.items.life(id)) { const r = Math.max(1, Math.round(TT.items.remaining(c, id))); row.appendChild(h('div', { class: 'small' + (r <= D.ECO.decay.last ? ' bad' : '') }, 'Còn dùng được ' + r + ' tháng' + (r <= D.ECO.decay.last ? ' (sắp hỏng, bán chỉ còn ' + Math.round(D.ECO.decay.floor * 100) + '% giá)' : '') + '.')); }
    const bs = h('div', { class: 'btns' });
    if (d.cat === 'khi') {
      const why = TT.items.canEquip(c, id);
      bs.appendChild(h('button', { class: 'sm', disabled: why ? 'disabled' : null, title: why || null, onclick: act(() => TT.items.equip(TT.player(), id)) }, 'Trang bị'));
    } else if (d.cat === 'sach') {
      const why = TT.tech.canLearn(c, d.tech);
      bs.appendChild(h('button', { class: 'sm', disabled: why ? 'disabled' : null, title: why || null, onclick: act(() => TT.items.use(TT.player(), id)) }, 'Đọc học'));
    } else if (d.cat === 'dac') {
      bs.appendChild(h('button', { class: 'sm', onclick: act(() => TT.items.use(TT.player(), id)) }, 'Đọc'));
    } else if (d.cat === 'ls') {
      bs.appendChild(h('button', { class: 'sm', title: 'Hấp thụ để tu luyện (nghỉ ' + D.LS.MANUAL_COOL + ' tháng giữa hai lần). Cảnh giới thấp không chịu nổi linh thạch quá cao.', onclick: act(() => TT.ls.manual(TT.player(), d.tier)) }, 'Hấp thụ'));
      bs.appendChild(h('button', { class: 'sm', onclick: act(() => TT.ls.split(TT.player(), d.tier)) }, 'Tách thành ' + D.LS.NAMES[d.tier - 1]));
    } else if (id === 'hoi_xuan_dan' || id === 'tu_khi_dan') {
      bs.appendChild(h('button', { class: 'sm', onclick: act(() => TT.items.use(TT.player(), id)) }, 'Uống'));
    }
    if (TT.items.life(id) && c.sect) {
      const pl = TT.map.place(c.place), here = pl && pl.type === 'tong_mon' && !c.travel && !c.cross;
      bs.appendChild(h('button', { class: 'sm', disabled: here ? null : 'disabled', title: here ? 'Hiến cả chồng cho kho tông, đổi lấy cống hiến (chung trần quyên mỗi năm)' : 'Phải đang ở tông môn của bạn', onclick: act(() => TT.sect.donateItem(TT.player(), id, n)) }, 'Hiến tông'));
    }
    row.appendChild(bs);
    return row;
  }

  function buildBag(box, c) {
    box.appendChild(h('h2', null, 'Trang bị'));
    const eg = h('div', { class: 'grid' });
    Object.keys(D.EQUIP_SLOTS).forEach(slot => {
      const id = c.equip && c.equip[slot], d = id && D.ITEMS[id];
      const cell = h('div', null, d ? ui.icon(id, 32) : null, h('div', { class: 'small' }, D.EQUIP_SLOTS[slot] + (D.GEAR.STAT[slot] ? ' · ' + D.GEAR.STAT_NAME[D.GEAR.STAT[slot]] : '')),
        h('div', { html: d ? '<b>' + ui.esc(d.n) + '</b> <span class="small">+' + TT.gear.pct1(d.pct) + ' ' + D.GEAR.STAT_NAME[d.stat] + '</span>' : '<span class="small">(trống)</span>' }));
      if (d) cell.appendChild(h('button', { class: 'sm', onclick: act(() => TT.items.unequip(TT.player(), slot)) }, 'Tháo'));
      eg.appendChild(cell);
    });
    box.appendChild(eg);

    box.appendChild(h('h2', { style: 'margin-top:12px' }, 'Linh thạch và quy đổi'));
    const pu = TT.ls.purse(c);
    box.appendChild(h('div', { class: 'small' }, 'Linh thạch: ' + pu.ls + ' · vàng lẻ: ' + pu.gold + '. 10 vàng = 1 hạ phẩm; mỗi bậc gấp 100 bậc dưới. Hấp thụ được để tu luyện với hiệu quả bằng một nửa đan dược cùng giá, và cảnh giới càng cao càng cần linh thạch bậc cao (hạ phẩm kém hiệu quả). Quy tắc tự hấp thụ hạ phẩm ở tab Quy tắc.' + (c.absorbAt > TT.world.months ? ' Đang tiêu hóa linh khí, còn ' + (c.absorbAt - TT.world.months) + ' tháng.' : '')));
    const xb = h('div', { class: 'btns', style: 'margin:6px 0' });
    xb.appendChild(h('button', { class: 'sm', onclick: act(() => TT.ls.toLS(TT.player(), Math.max(1, Math.floor(TT.player().gold / D.LS.RATE)))) }, 'Đổi hết vàng lẻ ra hạ phẩm'));
    xb.appendChild(h('button', { class: 'sm', onclick: act(() => TT.ls.toGold(TT.player(), 1)) }, '1 hạ phẩm → ' + D.LS.RATE + ' vàng'));
    for (let t = 1; t <= 3; t++) xb.appendChild(h('button', { class: 'sm', onclick: act(() => TT.ls.merge(TT.player(), t)) }, '100 ' + D.LS.NAMES[t - 1] + ' → 1 ' + D.LS.NAMES[t]));
    box.appendChild(xb);

    box.appendChild(h('h2', { style: 'margin-top:12px' }, 'Túi đồ'));
    const list = TT.items.list(c);
    if (!list.length) box.appendChild(h('div', { class: 'small' }, 'Túi trống. Vật phẩm có từ chợ, sự kiện, bí cảnh, tông môn hoặc tự chế tác. Đan dược, bùa và trang bị giúp ích rất nhiều lúc đột phá và chiến đấu.'));
    list.forEach(x => box.appendChild(itemRow(c, x.id, x.n)));

    // Mua bán không còn ở đây: bấm vào công trình (cửa hàng) trong màn hình nhân vật để mua bán.
    const shops = TT.bld.shopsAt(c);
    const hint = h('div', { class: 'card' }, h('b', null, 'Mua bán'), h('div', { class: 'small' }, shops.length ? 'Nơi này có cửa hàng: ' + shops.map(s => TT.bld.name(s)).join(', ') + '. Bấm vào ngôi nhà trong màn hình nhân vật (hoặc nút dưới) để mua bán. Mỗi cửa hàng chỉ thu mua nhóm hàng của mình và có hạn mức giao dịch mỗi tháng.' : 'Chỉ mua bán được ở nơi có cửa hàng (thành, thôn trấn, bến, mỏ, chợ đen, thương đoàn). Nơi bạn đứng không có, hoặc bạn đang trên đường.'));
    if (shops.length) hint.appendChild(h('div', { class: 'btns' }, ...shops.slice(0, 5).map(s => h('button', { class: 'sm', onclick: () => ui.shop && ui.shop.open(s) }, TT.bld.name(s)))));
    box.appendChild(hint);

    // Bản vẽ luyện khí: chọn ô, phẩm, xem vật liệu cần và bắt đầu nhóm lò.
    const cr0 = TT.craft.ensure(c), lvK = cr0.khi.lv;
    box.appendChild(h('h2', { style: 'margin-top:14px' }, 'Lò luyện khí'));
    box.appendChild(h('div', { class: 'small' }, 'Luyện khí cấp ' + lvK + ' · lò ' + (['đất (không phẩm)', 'linh phẩm', 'bảo phẩm', 'tiên phẩm'][TT.craft.furnaceTier(c)]) + (TT.craft.diaHoa(c) ? ' · nơi này có địa hỏa (thêm 5% thành công)' : '') + '. Phẩm càng cao càng cần cấp nghề, cảnh giới, khoáng thạch bậc cao, vật liệu yêu thú và linh thạch làm nhiên liệu. Đặt hướng đi hoặc "Luyện nghề này" để máy tự chọn bản vẽ mỗi tháng.'));
    if (cr0.proj) {
      const pj = cr0.proj, nm = pj.slot === 'relic' ? D.GEAR.RELIC_NAMES[pj.stat || 'atk'][pj.tier] : D.GEAR.NAMES[pj.slot][pj.tier];
      box.appendChild(h('div', { class: 'card' }, h('div', { html: '<b>Đang luyện: ' + ui.esc(nm) + '</b> <span class="small">(phẩm ' + D.GEAR.TIERS[pj.tier] + (pj.elem ? ', hệ ' + pj.elem : '') + ') · còn ' + pj.left + '/' + pj.total + ' tháng</span>' }),
        h('div', { html: '<div class="bar"><i style="width:' + Math.round((1 - pj.left / pj.total) * 100) + '%"></i></div>' }),
        h('div', { class: 'small' }, 'Cần có hành động "Luyện nghề" mỗi tháng thì lò mới tiến triển.')));
    } else {
      const sel = (opts, cur, on) => { const s = h('select', { onchange: e => on(e.target.value) }); opts.forEach(o => s.appendChild(h('option', { value: o[0], selected: String(o[0]) === String(cur) ? 'selected' : null }, o[1]))); return s; };
      const row = h('div', { class: 'btns', style: 'margin:6px 0' });
      row.appendChild(sel(Object.keys(D.EQUIP_SLOTS).map(k => [k, D.EQUIP_SLOTS[k]]), forge.slot, v => { forge.slot = v; ui.markDirty(); }));
      row.appendChild(sel([0, 1, 2, 3].map(t => [t, 'Phẩm ' + D.GEAR.TIERS[t]]), forge.tier, v => { forge.tier = +v; ui.markDirty(); }));
      if (forge.slot === 'relic') row.appendChild(sel(['atk', 'hpMax', 'nl'].map(k => [k, 'Tăng ' + D.GEAR.STAT_NAME[k]]), forge.stat, v => { forge.stat = v; ui.markDirty(); }));
      box.appendChild(row);
      const spec = { slot: forge.slot, tier: forge.tier, stat: forge.slot === 'relic' ? forge.stat : null }, r = TT.craft.recipe(spec), why = TT.craft.why(c, spec);
      const lines = [D.ITEMS[r.ore.id].n + ' x' + r.ore.n + ' (có ' + TT.items.count(c, r.ore.id) + ')', r.part ? 'Nanh hoặc da yêu thú bậc ' + r.part.minTier + '+ x1' + (r.part.kind === 'nanh' ? ' (nanh)' : r.part.kind === 'da' ? ' (da)' : '') : null, r.dan ? 'Yêu đan x' + r.dan + ' (có ' + TT.items.count(c, 'yeu_dan') + ')' : null, 'Nhiên liệu ' + r.fuel + ' linh thạch hạ phẩm', r.months + ' tháng · cấp nghề ' + r.lv + '+ · ' + D.REALM_NAMES[r.realm] + '+'].filter(Boolean);
      box.appendChild(h('div', { class: 'small', html: lines.map(ui.esc).join('<br>') }));
      if (why) box.appendChild(h('div', { class: 'small bad-txt' }, why));
      box.appendChild(h('button', { class: 'sm', disabled: why ? 'disabled' : null, onclick: act(() => TT.craft.start(TT.player(), spec)) }, 'Nhóm lò luyện'));
    }
    // Nghề
    box.appendChild(h('h2', { style: 'margin-top:14px' }, 'Thiên phú nghề'));
    const cr = TT.craft.ensure(c);
    box.appendChild(h('div', { class: 'small' }, 'Chọn một nghề để luyện (hành động "Luyện nghề", nên đặt hướng đi "Luyện nghề"). Cấp 0-10; qua cấp 3 cần ở tông môn chuyên nghề (bậc nội môn trở lên) hoặc tâm đắc, và còn bị cảnh giới giới hạn.'));
    TT.craft.IDS.forEach(id => {
      const d = D.CRAFTS[id], st = cr[id], cap = TT.craft.cap(c, id), sel = (cr.focus || TT.craft.bestFocus(c)) === id;
      const card = h('div', { class: 'card' });
      card.appendChild(h('div', { html: '<b>' + d.n + '</b> cấp ' + st.lv + '/' + cap + (sel ? ' <span class="good-txt">· đang luyện</span>' : '') +
        ' <span class="small">· thiên phú x' + TT.craft.aptitude(c, id).toFixed(2) + ' (hợp: ' + d.elems.join(', ') + ')</span>' }));
      card.appendChild(h('div', { class: 'small' }, d.desc + (d.mat ? ' Cần ' + D.ITEMS[d.mat].n + ' (có ' + TT.items.count(c, d.mat) + ').' : '') +
        (TT.craft.specialist(c, id) ? ' Tông môn của bạn chuyên nghề này (trần +4).' : ' Tông môn chuyên: ' + D.SECTS[d.sect].n + '.')));
      const need = TT.craft.need(st.lv);
      card.appendChild(h('div', { html: '<div class="bar"><i style="width:' + (st.lv >= cap ? 100 : Math.min(100, st.xp / need * 100)) + '%"></i></div>' }));
      if (!sel) card.appendChild(h('button', { class: 'sm', onclick: () => { TT.craft.ensure(TT.player()).focus = id; ui.markDirty(); } }, 'Luyện nghề này'));
      box.appendChild(card);
    });
  }
  ui.addTab({ id: 'bag', label: 'Hành trang', key: c => JSON.stringify(bagData(c)), build: buildBag });

  // ---------- Công pháp ----------
  function techData(c) {
    return { id: c.id, realm: c.realm, techs: c.techs, main: c.techMain, xinfa: c.xinfa, dd: Math.floor(c.daoDiem), dt: Math.floor(c.daoTam), inv: Object.keys(c.inv || {}).filter(i => i.indexOf('bk_') === 0).join(), attrs: c.tuchat.attrs.map(a => a.n + a.p).join() };
  }
  function buildTech(box, c) {
    box.appendChild(h('h2', null, 'Công pháp (' + TT.tech.known(c).length + '/' + TT.tech.slots(c) + ')'));
    box.appendChild(h('div', { class: 'small' }, 'Công pháp chính làm tu luyện nhanh hơn và cộng công kích; càng luyện lâu cấp càng cao (0-9). Học bằng bí kíp: tìm ở sự kiện, bí cảnh, chợ, kho cống hiến tông môn. Cần đủ điểm tư chất hệ tương ứng và cảnh giới.'));
    const known = TT.tech.known(c);
    if (!known.length) box.appendChild(h('div', { class: 'small' }, 'Bạn chưa biết công pháp nào. Công pháp "Dưỡng Khí Thổ Nạp Thuật" ai cũng học được, bí kíp của nó có bán ở chợ.'));
    known.forEach(k => {
      const t = k.t, isMain = c.techMain === t.id, need = TT.tech.need(t, k.lv);
      const card = h('div', { class: 'card' });
      card.appendChild(h('div', { html: '<b>' + ui.esc(t.n) + '</b> <span class="small">(' + D.TIER_NAMES[t.tier] + (t.elem ? ', hệ ' + t.elem : ', phổ thông') + ') · tầng ' + k.lv + '/' + TT.tech.LV_MAX + (isMain ? ' <span class="good-txt">· chính</span>' : '') + '</span>' }));
      card.appendChild(h('div', { class: 'small' }, t.desc + (isMain ? ' Tu luyện nhanh hơn ' + Math.round((TT.tech.trainMul(c) - 1) * 100) + '%, công kích +' + (t.atk * (k.lv + 1) / 10).toFixed(1) + '.' : '')));
      card.appendChild(h('div', { html: '<div class="bar"><i style="width:' + (k.lv >= TT.tech.LV_MAX ? 100 : Math.min(100, k.xp / need * 100)) + '%"></i></div>' }));
      if (!isMain) card.appendChild(h('button', { class: 'sm', onclick: () => { TT.tech.setMain(TT.player(), t.id); ui.markDirty(); } }, 'Đặt làm công pháp chính'));
      box.appendChild(card);
    });
    // Bí kíp trong túi
    const books = TT.items.list(c).filter(x => x.d.cat === 'sach');
    if (books.length) {
      box.appendChild(h('div', { class: 'sec' }, 'Bí kíp trong túi'));
      books.forEach(x => {
        const why = TT.tech.canLearn(c, x.d.tech);
        const row = h('div', { class: 'card' });
        row.appendChild(h('div', { html: '<b>' + ui.esc(x.d.n) + '</b> x' + x.n }));
        if (why) row.appendChild(h('div', { class: 'small bad-txt' }, why));
        row.appendChild(h('button', { class: 'sm', disabled: why ? 'disabled' : null, onclick: act(() => TT.items.use(TT.player(), x.id)) }, 'Đọc học'));
        box.appendChild(row);
      });
    }
    // Danh mục công pháp đủ điều kiện về tư chất (để biết nên tìm sách nào)
    const cand = D.TECHS.filter(t => !(c.techs && c.techs[t.id]) && (!t.elem || TT.tech.pts(c, t.elem) >= t.pts * 0.6));
    if (cand.length) {
      box.appendChild(h('div', { class: 'sec' }, 'Công pháp hợp tư chất bạn (nên tìm bí kíp)'));
      box.appendChild(h('div', { class: 'small', html: cand.map(t => '<b>' + ui.esc(t.n) + '</b> (' + D.TIER_NAMES[t.tier] + (t.elem ? ', hệ ' + t.elem + ' từ ' + t.pts + ' điểm' : '') +
        (c.realm < t.realm ? ', cần ' + D.REALM_NAMES[t.realm] : '') + ')').join('<br>') }));
    }

    // Tâm pháp
    box.appendChild(h('h2', { style: 'margin-top:14px' }, 'Tâm pháp (' + (c.xinfa || []).length + '/' + TT.tech.xinfaSlots(c) + ')'));
    box.appendChild(h('div', { class: 'small' }, 'Tâm pháp là bị động, học bằng đạo điểm (đạo điểm có từ luận đạo, song tu, mục tiêu, sự kiện). Bạn có ' + Math.floor(c.daoDiem) + ' đạo điểm, đạo tâm ' + Math.round(c.daoTam) + '. Chỗ học tăng theo cảnh giới.'));
    D.XINFA.forEach(x => {
      const has = (c.xinfa || []).indexOf(x.id) >= 0, why = has ? false : TT.tech.canLearnXinfa(c, x.id);
      const card = h('div', { class: 'card' });
      card.appendChild(h('div', { html: '<b>' + ui.esc(x.n) + '</b> <span class="small">(' + x.cost + ' đạo điểm, đạo tâm từ ' + x.daoTam + ', ' + D.REALM_NAMES[x.realm] + ')</span>' + (has ? ' <span class="good-txt">· đã học</span>' : '') }));
      card.appendChild(h('div', { class: 'small' }, x.desc));
      if (has) card.appendChild(h('button', { class: 'sm', onclick: () => { if (confirm('Quên tâm pháp ' + x.n + '? Đạo điểm đã tốn không hoàn lại.')) { TT.tech.forgetXinfa(TT.player(), x.id); ui.markDirty(); } } }, 'Quên'));
      else {
        card.appendChild(h('button', { class: 'sm', disabled: why ? 'disabled' : null, title: why || null, onclick: act(() => TT.tech.learnXinfa(TT.player(), x.id)) }, 'Học'));
        if (why) card.appendChild(h('div', { class: 'small bad-txt' }, why));
      }
      box.appendChild(card);
    });
  }
  ui.addTab({ id: 'tech', label: 'Công pháp', key: c => JSON.stringify(techData(c)), build: buildTech });
})();
