// Tab "Tông môn" (nhiều mục: Tổng quan, Việc tông, Đồng môn, Kho, Luật và tuyệt học) và khối thông tin tông môn ở địa điểm (có nút xin gia nhập).
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h;

  let sub = 'tq';
  const SUBS = [['tq', 'Tổng quan'], ['nv', 'Việc tông'], ['dm', 'Đồng môn'], ['lu', 'Luật và tuyệt học'], ['vv', 'Vượt vùng'], ['lt', 'Liên tông']];
  const refresh = () => { if (ui.resetSide) ui.resetSide(); ui.markDirty(); };

  function sectPlaceOf(rid) { return TT.map.placesOf(rid).find(p => p.type === 'tong_mon') || null; }

  function reqLine(c, id) {
    const j = TT.sect.canJoin(c, id);
    return j.ok ? '<span class="good-txt">Bạn đủ điều kiện gia nhập.</span>' : '<span class="bad-txt">Chưa đủ: ' + ui.esc(j.why.join('; ')) + '.</span>';
  }

  function joinNow(id) {
    const c = TT.player(), d = D.SECTS[id];
    if (!c || c.sect) return;
    const j = TT.sect.canJoin(c, id);
    if (!j.ok) { ui.say(j.why.join('; ')); return; }
    if (!confirm('Gia nhập ' + d.n + '? Bạn sẽ làm ngoại môn đệ tử, được nhận việc và bổng lộc, nhưng phải giữ hòa hợp với tôn chỉ ' + D.SECT_ALIGN[d.align].toLowerCase() + ' và luật tông: ' + D.SECT_LAWS[d.law].n + '.')) return;
    c.flags.joinAskAt = TT.world.months;
    TT.sect.join(c, id);
    ui.markDirty(); if (ui.shop && ui.shop.render) ui.shop.render();
  }

  // Dòng bản sắc của một tông (tôn chỉ, luật, tuyệt học).
  function identHtml(d) {
    const law = D.SECT_LAWS[d.law];
    return (d.motto ? '<div class="small"><i>“' + ui.esc(d.motto) + '”</i></div>' : '') +
      (law ? '<div class="small">Luật: <b>' + ui.esc(law.n) + '</b>. ' + ui.esc(law.desc) + '</div>' : '') +
      (d.secret ? '<div class="small">Tuyệt học (chân truyền): <b>' + ui.esc(d.secret.n) + '</b>. ' + ui.esc(d.secret.desc) + '</div>' : '');
  }

  // Khối hiện ở thông tin địa điểm khi đó là một tông môn.
  ui.sectPlaceBlock = function (p, pl) {
    const d = D.SECTS[pl.id], box = h('div', { class: 'card' });
    box.appendChild(h('div', { html: '<b>' + ui.esc(d.n) + '</b> · ' + D.SECT_ALIGN[d.align] + ' · hợp: ' + d.elems.join(', ') }));
    box.appendChild(h('div', { class: 'small' }, d.desc));
    box.appendChild(h('div', { html: identHtml(d) }));
    const rs = TT.sect.res(pl.id);
    if (rs) box.appendChild(h('div', { class: 'small', html: 'Linh mạch: <b>' + '★'.repeat(rs.mach) + '☆'.repeat(3 - rs.mach) + '</b> · Mỏ: <b>' + '◆'.repeat(rs.mo) + '◇'.repeat(3 - rs.mo) + '</b> · Kho: <b>' + TT.sect.resName(pl.id) + '</b>' }));
    const head = TT.sect.head(pl.id);
    if (head) box.appendChild(h('div', { class: 'small', html: 'Chưởng môn: <b>' + ui.esc(head.name) + '</b> (' + D.REALM_NAMES[head.realm] + ') · ' + TT.sect.members(pl.id).length + ' đệ tử trong vùng' }));
    if (p.sect && p.sect.id === pl.id) {
      box.appendChild(h('div', { class: 'small good-txt' }, 'Bạn là ' + D.SECT_RANKS[p.sect.rank] + ' của tông môn này.'));
    } else if (!p.sect) {
      box.appendChild(h('div', { class: 'small', html: reqLine(p, pl.id) }));
      if (p.place === pl.id && !p.travel && !p.cross) {
        box.appendChild(h('button', { class: 'primary', disabled: TT.sect.canJoin(p, pl.id).ok ? null : 'disabled', onclick: () => joinNow(pl.id) }, 'Xin gia nhập'));
      } else box.appendChild(h('div', { class: 'small' }, 'Phải có mặt ở đây mới xin gia nhập được.'));
    }
    return box;
  };

  function data(c) {
    const s = c.sect;
    const base = {
      id: c.id, region: c.region, place: c.place, travel: !!c.travel, rep: Math.round(c.rep.chinh / 10), realm: c.realm,
      aid: [c.aid.pill, c.aid.room, c.hp >= TT.stats.hpMax(c)],
      known: Object.keys(c.knownRegions || {}).sort().join(','), exp: Object.keys(c.flags.expelled || {}).join(','), sub,
      cross: c.cross ? 1 : (c.travel ? 0 : TT.cross.options(c).map(o => o.key + o.ok + o.why.length).join(',')), tcd: c.tcd
    };
    if (!s) return base;
    base.sect = [s.id, s.rank, Math.floor(s.contrib / 5), Math.floor(s.total / 20), s.line, s.warn, s.idleY, s.master, s.done];
    base.task = s.task ? [s.task.tid, s.task.left] : null;
    base.board = (s.board || []).map(t => t.tid + t.dur + ':' + t.contrib).join();
    base.bi = TT.sect.biNext(s.id);
    const rs = TT.sect.res(s.id), fx = TT.fac.get(s.id);
    base.res = rs && fx ? [rs.mach, rs.mo, Math.round(fx.wealth / 3), s.donY || 0, Math.floor(TT.ls.wealth(c) / 50)] : null;
    base.mates = sub === 'dm' ? TT.sect.members(s.id).map(m => m.id + ':' + m.sect.rank + ':' + (m.sect.line || '')).join() : '';
    return base;
  }

  const stat = (k, v, s) => h('div', { class: 'pf-tile' }, h('div', { class: 'k' }, k), h('div', { class: 'v' }, v), s ? h('div', { class: 's' }, s) : null);

  function buildTq(box, c) {
    const s = c.sect, d = D.SECTS[s.id], R = D.SECT_RULES, ln = s.line ? D.SECT_LINES[s.line] : null;
    box.appendChild(h('div', { html: D.SECT_ALIGN[d.align] + ' · hợp: ' + d.elems.join(', ') + '<br>Chức vị: <b>' + D.SECT_RANKS[s.rank] + '</b>' + identHtml(d) }));
    box.appendChild(h('div', { class: 'grid', style: 'margin-top:8px', html:
      '<div title="Dùng để đổi vật phẩm ở kho cống hiến.">Cống hiến: <b>' + Math.floor(s.contrib) + '</b></div>' +
      '<div title="Tổng cống hiến cả đời trong tông môn, dùng để xét thăng chức.">Tổng cống hiến: <b>' + Math.floor(s.total) + '</b></div>' +
      '<div>Bổng lộc: <b>' + TT.ls.fmt(Math.round(R.stipend[s.rank] * (1 + 0.3 * c.realm))) + '/năm</b></div>' +
      '<div>Tu luyện: <b>+' + Math.round((TT.sect.trainBonus(c) - 1) * 100) + '%</b></div>' +
      '<div>Hỗ trợ đột phá: <b>+' + Math.round(TT.sect.breakBonus(c) * 100) + '%</b></div>' +
      '<div>Việc tông đã làm: <b>' + (s.done || 0) + '</b></div>' }));

    // tài nguyên tông
    const rs = TT.sect.res(s.id), x = TT.fac.get(s.id);
    box.appendChild(h('div', { class: 'sec' }, 'Tài nguyên tông'));
    if (rs && x) {
      const st = TT.sect.resState(s.id), mulS = D.SECT_RES.stipendMul[st], mulP = D.SECT_RES.priceMul[st];
      box.appendChild(h('div', { class: 'grid', html:
        '<div title="Nguồn linh khí của tông. Mỗi bậc trên 1 cộng thêm ' + Math.round(D.SECT_RES.trainPerMach * 100) + '% tu luyện cho bạn.">Linh mạch: <b>' + '★'.repeat(rs.mach) + '☆'.repeat(3 - rs.mach) + '</b></div>' +
        '<div title="Mỏ và ruộng thuốc cho tông thu nhập.">Mỏ, ruộng: <b>' + '◆'.repeat(rs.mo) + '◇'.repeat(3 - rs.mo) + '</b></div>' +
        '<div>Kho tông: <b class="' + (st === 0 ? 'bad-txt' : st === 3 ? 'good-txt' : '') + '">' + D.SECT_RES.names[st] + '</b> (' + Math.round(x.wealth) + '/100)<div class="bar ' + (st === 0 ? 'danger' : 'hp') + '"><i style="width:' + Math.round(x.wealth) + '%"></i></div></div>' }));
      box.appendChild(h('div', { class: 'small' }, 'Kho quyết định bổng lộc (x' + mulS + '), giá ở kho cống hiến (x' + mulP + ')' + (st === 0 ? ' và tông tạm ngừng nhận đệ tử mới' : '') + '. Kho đầy lên nhờ linh mạch, mỏ và chiến thắng; vơi đi vì cống nạp vương triều và chiến tranh. Bạn có thể quyên góp ở Kho cống hiến.'));
    }

    // đường trong tông
    box.appendChild(h('div', { class: 'sec' }, 'Đường trong tông'));
    if (s.rank < 1) box.appendChild(h('div', { class: 'small' }, 'Lên nội môn mới được chọn một trong bốn đường: Chấp pháp, Dược và luyện, Tàng kinh, Ngoại vụ.'));
    else {
      box.appendChild(h('div', { class: 'small' }, ln ? 'Đang theo: ' + ln.n + '. ' + ln.desc : 'Bạn chưa chọn đường. Chọn lần đầu miễn phí; đổi sau tốn ' + D.SECT_BI.lineChangeCost + ' cống hiến và phải chờ ' + D.SECT_BI.lineChangeCool + ' tháng.'));
      box.appendChild(h('div', { class: 'small' }, 'Chọn hoặc đổi đường ở Điện chưởng môn hoặc nhà của đường đó (phải đứng ở tông).'));
    }

    const nx = TT.sect.nextRank(c);
    if (nx) {
      const pr = Math.min(1, s.total / nx.req.contrib);
      box.appendChild(h('div', { class: 'sec' }, 'Lên ' + D.SECT_RANKS[nx.rank]));
      box.appendChild(h('div', { html: '<div class="bar"><i style="width:' + Math.round(pr * 100) + '%"></i></div>' }));
      box.appendChild(h('div', { class: 'small ' + (nx.ok ? 'good-txt' : '') }, nx.ok ? 'Đủ điều kiện: sẽ tự được thăng cuối năm, hoặc xin ngay ở Điện chưởng môn.' : 'Còn thiếu: ' + nx.why.join('; ') + '.'));
    } else if (s.rank === 3) box.appendChild(h('div', { class: 'small', style: 'margin-top:8px' }, 'Bạn đã là trưởng lão. Ngôi chưởng môn chỉ có khi chưởng môn qua đời hoặc rời vị. Trưởng lão được dùng đại trận truyền tống của tông môn (xem ở bản đồ khi đứng tại tông môn).'));
    else box.appendChild(h('div', { class: 'small', style: 'margin-top:8px' }, 'Bạn là chưởng môn. Mỗi năm có việc tông môn cần bạn quyết.'));

    const head = TT.sect.head(s.id), els = TT.sect.elders(s.id).filter(x => x !== head);
    if (c.region === TT.sect.regionOf(s.id)) {
      box.appendChild(h('div', { class: 'sec' }, 'Lãnh đạo'));
      box.appendChild(h('div', { class: 'small', html: (head ? 'Chưởng môn: <b>' + ui.esc(head.name) + '</b> (' + D.REALM_NAMES[head.realm] + ')' : 'Chưởng môn: (chưa có)') +
        (els.length ? '<br>Trưởng lão: ' + els.map(e => '<b>' + ui.esc(e.name) + '</b> (' + D.REALM_NAMES[e.realm] + ')').join(', ') : '') }));
    }
  }

  function taskCard(c, t, idx) {
    const def = TT.sect.taskDef(t), L = D.SECT_LINES[t.line], s = c.sect, left = Math.max(0, t.due - TT.world.months);
    const card = h('div', { class: 'card' });
    card.appendChild(h('div', { html: '<b>' + ui.esc(def.n) + '</b> <span class="small">· ' + L.n + ' · ' + t.dur + ' tháng · rủi ro ' + (def.risk >= 1.3 ? 'cao' : def.risk >= 0.8 ? 'vừa' : 'thấp') + '</span>' }));
    card.appendChild(h('div', { class: 'small' }, def.text));
    card.appendChild(h('div', { class: 'small', html: 'Thưởng: <b>' + t.contrib + ' cống hiến</b>, ' + TT.ls.fmt(t.pay) + (t.line === 'duoc' ? ', linh thảo' : t.line === 'tang' ? ', tu vi' : '') + ' · còn ' + left + ' tháng trên bảng' + (t.line === s.line ? ' · hợp đường của bạn' : '') }));
    card.appendChild(h('div', { class: 'small' }, 'Nhận việc này ở ' + (ui.bld && ui.bld.defs[t.line] ? ui.bld.defs[t.line].n : L.n) + ' (khi đứng ở tông).'));
    return card;
  }

  function buildNv(box, c) {
    const s = c.sect;
    box.appendChild(h('div', { class: 'small' }, 'Việc trên bảng chỉ tiến triển khi bạn chọn hành động "Kiếm sống" (làm việc tông môn). Có việc thì việc vặt hằng tháng chỉ còn 40%. Chế độ Tự động tự nhận việc.'));
    box.appendChild(h('div', { class: 'sec' }, 'Việc đang làm'));
    if (s.task) {
      const def = TT.sect.taskDef(s.task), done = s.task.dur - s.task.left;
      box.appendChild(h('div', { class: 'card' },
        h('div', { html: '<b>' + ui.esc(def.n) + '</b> <span class="small">· ' + done + '/' + s.task.dur + ' tháng</span>' }),
        h('div', { html: '<div class="bar"><i style="width:' + Math.round(done / s.task.dur * 100) + '%"></i></div>' }),
        h('div', { class: 'small' }, def.text + ' Thưởng: ' + s.task.contrib + ' cống hiến, ' + TT.ls.fmt(s.task.pay) + '.'),
        c.focus === 'work' ? null : h('div', { class: 'small bad-txt' }, 'Bạn đang không làm việc tông môn nên việc chưa tiến triển.'),
        h('div', { class: 'small' }, 'Muốn bỏ dở thì vào nhà của đường đó ở tông.')));
    } else box.appendChild(h('div', { class: 'small' }, 'Bạn đang rảnh. Chọn một việc bên dưới, rồi tới tông nhận ở nhà của đường đó.'));
    box.appendChild(h('div', { class: 'sec' }, 'Bảng việc của tông'));
    if (!s.board || !s.board.length) box.appendChild(h('div', { class: 'small' }, 'Bảng đang trống, sẽ có việc mới trong vài tháng.'));
    else s.board.forEach((t, i) => box.appendChild(taskCard(c, t, i)));
  }

  function buildDm(box, c) {
    const s = c.sect, d = D.SECTS[s.id], inRegion = c.region === TT.sect.regionOf(s.id);
    box.appendChild(h('div', { class: 'sec' }, 'Sư phụ nội môn'));
    const ms = s.master ? TT.world.chars[s.master] : null;
    if (ms && ms.alive && ms.sect && ms.sect.id === s.id) box.appendChild(h('div', { class: 'small', html: '<b>' + ui.esc(ms.name) + '</b> (' + TT.stats.realmName(ms) + ') · ' + TT.rel.label(c, ms) + ' · tu luyện thêm 3% nhờ được chỉ dạy.' }));
    else box.appendChild(h('div', { class: 'small' }, s.rank < 1 ? 'Lên nội môn sẽ có một người đứng ra chỉ dạy (trưởng lão hoặc chân truyền cảnh giới cao hơn).' : s.rank > 2 ? 'Bạn đã tự lập, không cần sư phụ.' : 'Chưa có ai nhận. Cuối năm tông sẽ tìm người phù hợp.'));
    box.appendChild(h('div', { class: 'sec' }, 'Đại bỉ'));
    box.appendChild(h('div', { class: 'small' }, 'Năm năm một lần, ba nhóm (ngoại môn, nội môn, chân truyền). Kỳ tới sau khoảng ' + TT.sect.biNext(s.id) + ' năm. Hạng cao được thưởng cống hiến và danh vọng.'));
    box.appendChild(h('div', { class: 'sec' }, 'Đồng môn' + (inRegion ? '' : ' (chỉ thấy khi ở cùng vùng)')));
    if (!inRegion) { box.appendChild(h('div', { class: 'small' }, 'Bạn đang ở xa ' + d.n + '.')); return; }
    const mates = TT.sect.members(s.id).filter(m => m !== c).sort((a, b) => (b.sect.rank - a.sect.rank) || (b.realm - a.realm) || (a.id - b.id));
    if (!mates.length) box.appendChild(h('div', { class: 'small' }, 'Chưa thấy ai.'));
    mates.slice(0, 20).forEach(m => {
      const L = m.sect.line ? D.SECT_LINES[m.sect.line].n : '';
      box.appendChild(h('div', { class: 'pf-rel', onclick: () => { ui.selectedPerson = m.id; ui.markDirty(); } },
        h('div', { class: 'pf-i' }, m.name.split(' ').slice(-1)[0].charAt(0)),
        h('div', null, h('b', null, m.name), ' ', h('span', { class: 'small' }, D.SECT_RANKS[m.sect.rank] + (L ? ' · ' + L : '') + ' · ' + TT.stats.realmName(m)),
          h('div', { class: 'small' }, TT.rel.label(c, m)))));
    });
    if (mates.length > 20) box.appendChild(h('div', { class: 'small' }, '... và ' + (mates.length - 20) + ' người nữa.'));
  }


  function buildLu(box, c) {
    const s = c.sect, d = D.SECTS[s.id], law = D.SECT_LAWS[d.law], sec = d.secret;
    box.appendChild(h('div', { class: 'sec' }, 'Luật tông'));
    box.appendChild(h('div', { html: '<b>' + ui.esc(law.n) + '</b><div class="small">' + ui.esc(law.desc) + ' Lần đầu phạm bị cảnh cáo, lần hai bị phạt cống hiến, lần ba bị trục xuất' + (d.law === 'lao' ? ' (riêng luật này chỉ bị phạt, không bị đuổi)' : '') + '.</div>' }));
    box.appendChild(h('div', { class: 'small ' + (s.warn ? 'bad-txt' : 'good-txt'), style: 'margin-top:4px' }, s.warn ? 'Số lần cảnh cáo hiện có: ' + s.warn + '. Một năm yên ổn sẽ bớt một lần.' : 'Bạn chưa phạm luật.'));
    if (s.rank >= 3) box.appendChild(h('div', { class: 'small' }, 'Từ trưởng lão trở lên không bị xét luật này.'));
    box.appendChild(h('div', { class: 'sec' }, 'Tuyệt học'));
    if (sec) {
      const on = s.rank >= 2;
      box.appendChild(h('div', { class: 'card' },
        h('div', { html: '<b>' + ui.esc(sec.n) + '</b> <span class="small">' + (on ? '· đang có hiệu lực' : '· mở khi lên Chân truyền') + '</span>' }),
        h('div', { class: 'small' }, sec.desc)));
    }
    box.appendChild(h('div', { class: 'sec' }, 'Tôn chỉ'));
    box.appendChild(h('div', { class: 'small' }, '“' + d.motto + '”'));
  }

  function buildMember(box, c) {
    const s = TT.sect.ensure(c), d = D.SECTS[s.id];
    box.appendChild(h('h2', null, 'Thẻ đệ tử · ' + d.n));
    box.appendChild(h('div', { class: 'small' }, 'Tab này để theo dõi từ xa. Muốn làm việc (nhận việc, đổi đồ, thăng bậc, đổi đường...) hãy tới tông và bước vào các công trình.'));
    const bar = h('div', { class: 'pf-tabs' });
    SUBS.forEach(x => bar.appendChild(h('button', { class: sub === x[0] ? 'on' : '', onclick: () => { sub = x[0]; refresh(); } }, x[1])));
    box.appendChild(bar);
    if (!({ tq: 1, nv: 1, dm: 1, lu: 1, vv: 1, lt: 1 })[sub]) sub = 'tq';
    ({ tq: buildTq, nv: buildNv, dm: buildDm, lu: buildLu, vv: buildVv, lt: buildLt })[sub](box, c);
  }
  ui.openSectTab = function (s) { if (s) sub = s; ui.activeTab = 'sect'; refresh(); };
  function buildVv(box, c) { box.appendChild(ui.crossSection(c)); }
  function buildLt(box, c) { ui.interBlock(box, c, true); }

  function buildNonMember(box, c) {
    box.appendChild(h('h2', null, 'Tông môn'));
    box.appendChild(h('div', { class: 'small' }, 'Bạn chưa thuộc tông môn nào. Vào tông môn được bổng lộc, việc làm, tu luyện nhanh hơn, và đổi cống hiến lấy vật phẩm; đổi lại phải giữ hợp tôn chỉ và luật tông. Hãy tới tông môn để xin gia nhập, hoặc chờ tin đồn tuyển đệ tử.'));
    box.appendChild(h('div', { class: 'sec' }, 'Các tông môn bạn biết'));
    D.REGIONS.filter(r => TT.cross.knows(c, r.id)).forEach(r => {
      const pl = sectPlaceOf(r.id);
      if (!pl) return;
      const d = D.SECTS[pl.id];
      const card = h('div', { class: 'card' });
      card.appendChild(h('div', { html: '<b>' + ui.esc(d.n) + '</b> <span class="small">· ' + ui.esc(r.n) + ' · ' + D.SECT_ALIGN[d.align] + ' · hợp: ' + d.elems.join(', ') + '</span>' }));
      card.appendChild(h('div', { class: 'small' }, d.desc));
      card.appendChild(h('div', { html: identHtml(d) }));
      card.appendChild(h('div', { class: 'small', html: reqLine(c, pl.id) }));
      if (c.place === pl.id && !c.travel && !c.cross) card.appendChild(h('button', { class: 'primary', disabled: TT.sect.canJoin(c, pl.id).ok ? null : 'disabled', onclick: () => joinNow(pl.id) }, 'Xin gia nhập'));
      else if (c.region === r.id && !c.cross) card.appendChild(h('button', { onclick: () => { const p = TT.player(); p.autoMove = false; TT.map.startTravel(p, pl.id); ui.markDirty(); } }, 'Đi tới tông môn'));
      box.appendChild(card);
    });
    box.appendChild(ui.crossSection(c));
    ui.interBlock(box, c, false); // liên tông (S8): ai cũng xem được
  }

  ui.say = function (t) { const m = ui.$('msg'); if (m) m.textContent = t; };

  ui.addTab({ id: 'sect', label: 'Tông môn', key: c => JSON.stringify(data(c)) + (TT.inter ? TT.inter.sig() : ''), build: (box, c) => (c.sect ? buildMember(box, c) : buildNonMember(box, c)) });
})();
