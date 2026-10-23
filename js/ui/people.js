// Các tab "Quan hệ" và "Nhiệm vụ & tin đồn", cùng thẻ chi tiết một người (cột phải).
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, S = TT.stats, h = ui.h, $ = ui.$;

  ui.selectedPerson = null;

  function whereIs(o) {
    if (!o.alive) return o.ascended ? 'đã phi thăng' : o.left ? 'đã rời vùng' : 'đã qua đời';
    if (o.cross) return 'đang vượt vùng';
    if (o.travel) return 'đang đi tới ' + TT.map.place(o.travel.to).n;
    const pl = TT.map.place(o.place);
    return (pl ? pl.n : '?') + (TT.map.region(o.region) ? ' · ' + TT.map.region(o.region).n : '');
  }

  function relBar(v) {
    const pct = Math.round((v + 100) / 2);
    return '<div class="bar rel"><i class="' + (v >= 0 ? 'pos' : 'neg') + '" style="width:' + pct + '%"></i></div>';
  }

  // ---------- tab Quan hệ ----------
  function relData(c) {
    return {
      id: c.id, danh: c.rep.danh, chinh: c.rep.chinh, nghiep: c.nghiep,
      close: TT.rel.close(c, 7).map(x => [x.id, Math.round(x.r.v), x.r.k, x.c.alive, x.c.place, x.c.travel ? x.c.travel.to : '', x.c.realm, TT.age(x.c), ui.bondKey(c, x.c)]),
      hunters: Object.keys(TT.world.chars).filter(i => { const o = TT.world.chars[i]; return o.alive && o.vows && o.vows.indexOf(c.id) >= 0 && o.region === c.region; }).length
    };
  }
  function buildRel(box, c) {
    box.appendChild(h('h2', null, 'Danh vọng và thiên hướng'));
    box.appendChild(h('div', { class: 'small', html:
      'Danh vọng: <b>' + TT.rep.fameName(c) + '</b> (' + c.rep.danh + ' điểm) · Thiên hướng: <b>' + TT.rep.alignName(c) + '</b> (' + Math.round(c.rep.chinh) + ') · Nghiệp: <b>' + c.nghiep + '</b>' }));
    const hunters = relData(c).hunters;
    if (hunters) box.appendChild(h('div', { class: 'small bad-txt' }, 'Có ' + hunters + ' kẻ thù đang ở cùng vùng và nhớ mối thù với bạn.'));
    const close = TT.rel.close(c, 7);
    box.appendChild(h('h2', { style: 'margin-top:12px' }, 'Người thân thiết (' + close.length + '/7)'));
    if (!close.length) box.appendChild(h('div', { class: 'small' }, 'Chưa có ai thân thiết. Hãy giao du, kết bạn: mỗi người bạn có tình trạng tình cảm riêng, và người qua đường có thể trở nên thân thiết qua các sự kiện.'));
    close.forEach(x => {
      const o = x.c, r = x.r;
      const card = h('div', { class: 'card' + (r.k === 'thu' ? ' enemy' : '') });
      card.appendChild(h('div', { html: '<b>' + ui.esc(o.name) + '</b> <span class="small">(' + D.REALM_NAMES[o.realm] + ', ' + TT.age(o) + ' tuổi, ' + D.personalityById[o.personality].n + ')</span>' }));
      card.appendChild(h('div', { class: 'small', html: '<b class="' + (r.v >= 0 && r.k !== 'thu' ? 'good-txt' : 'bad-txt') + '">' + TT.bond.label(c, o) + '</b> (' + Math.round(r.v) + ') · ' + whereIs(o) + (r.k === 'thu' && r.why ? ' · ' + ui.esc(r.why) : '') }));
      const bb = ui.bondBlock(c, o);
      card.appendChild(bb || h('div', { html: relBar(r.v) }));
      const row = h('div', { class: 'btns' });
      if (o.alive && !o.cross && o.place && !c.travel && !c.cross) {
        row.appendChild(h('button', { onclick: () => { const p = TT.player(); p.autoMove = false; TT.map.startTravel(p, o.travel ? o.travel.to : o.place); ui.markDirty(); } }, 'Tìm gặp'));
      }
      row.appendChild(h('button', { onclick: () => { ui.selectedPerson = o.id; ui.markDirty(); } }, 'Chi tiết'));
      card.appendChild(row);
      box.appendChild(card);
    });
    const others = TT.rel.list(c).filter(x => x.c && x.c.alive && close.indexOf(x) < 0).sort((a, b) => Math.abs(b.r.v) - Math.abs(a.r.v)).slice(0, 10);
    if (others.length) {
      box.appendChild(h('h2', { style: 'margin-top:12px' }, 'Người đã quen'));
      box.appendChild(h('div', { html: '<table><tbody>' + others.map(x => '<tr><td>' + ui.esc(x.c.name) + '</td><td>' + TT.rel.label(c, x.c) + '</td><td>' + Math.round(x.r.v) +
        '</td><td class="small">' + whereIs(x.c) + '</td></tr>').join('') + '</tbody></table>' }));
    }
  }
  ui.addTab({ id: 'rel', label: 'Quan hệ', key: c => JSON.stringify(relData(c)), build: buildRel });

  // ---------- tab Nhiệm vụ và tin đồn ----------
  function goalData(c) {
    const m = TT.world.months, qs = TT.quests.qs(c);
    return {
      id: c.id, age: TT.age(c), lock: qs.lock,
      q: TT.quests.list(c).filter(q => q.state === 'on').map(q => [q.id, q.rank, q.d, q.byAge, q.urgent ? 1 : 0, Math.round(TT.quests.progress(c, q) * 50)]),
      off: qs.offers.map(o => o.text),
      recent: TT.quests.list(c).filter(q => q.state !== 'on').slice(-4).map(q => q.id + q.state),
      opps: TT.rumors.active().filter(o => o.region === c.region || o.kind === 'ke_thu').map(o => [o.id, Math.floor((o.open - m) / 3), Math.floor((o.close - m) / 3)]),
      plan: c.plan, n: Object.keys(TT.rel.list(c)).length, story: TT.story.sig(c)
    };
  }
  function buildGoals(box, c) {
    ui.buildQuests(box, c);

    box.appendChild(h('h2', { style: 'margin-top:14px' }, 'Tin đồn và cơ hội có hạn'));
    const opps = TT.rumors.active().filter(o => o.region === c.region || o.kind === 'ke_thu');
    if (!opps.length) box.appendChild(h('div', { class: 'small' }, 'Chưa có tin đồn nào. Nghe ngóng ở thành trì, chợ và tông môn sẽ biết thêm.'));
    const m = TT.world.months;
    opps.forEach(o => {
      const card = h('div', { class: 'card' + (o.kind === 'ke_thu' ? ' enemy' : '') });
      const pl = TT.map.place(o.place);
      let when;
      if (m < o.open) when = 'mở sau khoảng ' + (o.open - m >= 12 ? Math.round((o.open - m) / 12 * 10) / 10 + ' năm' : (o.open - m) + ' tháng');
      else when = 'đang mở, còn ' + Math.max(0, o.close - m) + ' tháng';
      if (o.kind === 'ke_thu') when = m < o.open ? 'dự kiến tới sau ' + (o.open - m) + ' tháng' : 'đã tới gần';
      card.appendChild(h('div', { html: '<b>' + ui.esc(o.name) + '</b>' }));
      card.appendChild(h('div', { class: 'small' }, (o.kind === 'ke_thu' ? 'Hướng về ' : 'Tại ') + (pl ? pl.n : '?') + ' · ' + when));
      if (o.kind !== 'ke_thu') {
        const mo = TT.rumors.routeMonths(c, o.place);
        if (mo != null) card.appendChild(h('div', { class: 'small' }, 'Từ chỗ bạn đi mất ' + mo + ' tháng.'));
        const planned = c.plan === o.id;
        card.appendChild(h('button', {
          class: planned ? 'on' : 'primary',
          onclick: () => { const p = TT.player(); if (planned) { p.plan = null; p.dest = null; } else TT.rumors.setPlan(p, o); ui.markDirty(); }
        }, planned ? 'Hủy kế hoạch' : 'Lập kế hoạch tới dự'));
      }
      box.appendChild(card);
    });
  }
  ui.addTab({ id: 'goal', label: 'Nhiệm vụ', key: c => JSON.stringify(goalData(c)), build: buildGoals });

  // ---------- thẻ chi tiết một người ở cột phải ----------
  ui.selectPerson = function (id) { ui.selectedPerson = id; ui.markDirty(); };

  const ACTS = [['chuyen', 'Trò chuyện'], ['tang_qua', 'Tặng quà'], ['luan_dao', 'Luận đạo'], ['tranh', 'Thách đấu']];
  let cardKey = '';
  ui.renderPersonCard = function () {
    const box = $('person-card'), p = TT.player();
    const o = ui.selectedPerson ? TT.world.chars[ui.selectedPerson] : null;
    if (!box) return;
    if (!o || !p) { box.style.display = 'none'; cardKey = ''; return; }
    const near = o.alive && !o.travel && !o.cross && !p.travel && !p.cross && o.region === p.region && o.place === p.place;
    const r = TT.rel.get(p, o);
    const key = [o.id, o.alive, near, r ? Math.round(r.v) + r.k : '', p.manualMonth === TT.world.months, TT.ls.wealth(p) >= 30, o.travel ? 1 : 0, o.place, ui.bondKey(p, o), TT.bond.asked(p, o) ? 1 : 0].join('|');
    if (key === cardKey) return;
    cardKey = key;
    box.style.display = 'block';
    box.innerHTML = '';
    box.appendChild(h('div', { class: 'btns', style: 'justify-content:space-between' },
      h('h2', { style: 'margin:0' }, o.name + (o.role ? ' · ' + o.role : '')),
      h('button', { onclick: () => { ui.selectedPerson = null; ui.markDirty(); } }, 'Đóng')));
    box.appendChild(h('div', { class: 'small', html:
      D.REALM_NAMES[o.realm] + ' · ' + TT.age(o) + ' tuổi · ' + (o.gender === 'nu' ? 'nữ' : 'nam') + ' · tính ' + D.personalityById[o.personality].n.toLowerCase() +
      ' · ' + TT.rep.alignName(o).toLowerCase() + ' · ' + TT.rep.fameName(o).toLowerCase() + '<br>' + whereIs(o) }));
    if (o.id === p.id) return;
    box.appendChild(h('div', { html: '<div class="sec">Quan hệ với bạn</div><b class="' + (r && r.v >= 0 && r.k !== 'thu' ? 'good-txt' : 'bad-txt') + '">' + TT.bond.label(p, o) + '</b>' + (r ? ' (' + Math.round(r.v) + ')' + relBar(r.v) : '') +
      (r && r.k === 'thu' && r.why ? '<div class="small">' + ui.esc(r.why) + '</div>' : '') }));
    const bb = ui.bondBlock(p, o); if (bb) box.appendChild(bb);
    if (o.alive && o.vows && o.vows.indexOf(p.id) >= 0) box.appendChild(h('div', { class: 'small bad-txt' }, o.name + ' đang nhớ mối thù với bạn.'));
    if (!o.alive) return;
    const row = h('div', { class: 'btns', style: 'margin-top:8px' });
    const used = p.manualMonth === TT.world.months;
    const acts = ACTS.slice();
    if (TT.family.eligible(p, o) && (r ? r.v : 0) >= 35) acts.splice(1, 0, ['tam_su', 'Tâm sự']);
    acts.forEach(a => {
      const dis = !near || used || (a[0] === 'tang_qua' && TT.ls.wealth(p) < 30) || ((a[0] === 'luan_dao' || a[0] === 'tranh') && (p.realm < 1 || o.realm < 1));
      row.appendChild(h('button', { disabled: dis ? 'disabled' : null, onclick: () => manual(a[0], o.id) }, a[1]));
    });
    const why = TT.family.canRecruit(p, o);
    if (o.tier === 'core' && !why && TT.age(o) <= TT.age(p) - 10) {
      row.appendChild(h('button', { disabled: near ? null : 'disabled', onclick: () => { TT.family.recruit(TT.player(), o); ui.markDirty(); } }, 'Nhận đồ đệ'));
    }
    if (TT.bond.memOn() && o.tier === 'core' && o.realm >= 1 && (r ? r.v : 0) >= D.BOND.kn.ally.minV) {
      const asked = TT.bond.asked(p, o);
      row.appendChild(h('button', { title: 'Hẹn rủ người này đi cùng chuyến sau (lệnh ưu tiên thấp, hạn ' + D.BOND.kn.ally.askHan + ' tháng)', disabled: asked ? 'disabled' : null, onclick: () => { const q = TT.bond.invite(TT.player(), o); if (!q.ok) TT.log(TT.player(), q.why, 'age'); ui.markDirty(); } }, asked ? 'Đã hẹn đi cùng' : 'Rủ đi cùng'));
    }
    box.appendChild(row);
    if (o.master === p.id) box.appendChild(h('div', { class: 'small good-txt' }, 'Là đồ đệ của bạn.'));
    box.appendChild(h('div', { class: 'small' }, near ? (used ? 'Mỗi tháng chỉ chủ động giao tiếp được một lần.' : 'Bạn đang ở cùng nơi, có thể chủ động giao tiếp (mỗi tháng một lần).') : 'Phải ở cùng địa điểm mới giao tiếp được.'));
  };

  function manual(id, oid) {
    const p = TT.player(), o = TT.world.chars[oid];
    if (!p || !o || !p.alive || TT.world.pending || p.manualMonth === TT.world.months) return;
    p.manualMonth = TT.world.months;
    const r = TT.social.interact(p, o, id);
    TT.social.after(p, o, r);
    ui.markDirty();
  }
})();
