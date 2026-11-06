// Tab "Hồ sơ" (thay tab "Nhân vật" cũ): Tổng quan (thẻ nhân vật, danh vọng, đang theo, người thân cận, kỷ lục), Chỉ số (bảng cũ),
// Thành tựu và mốc đời, Đánh dấu (các mục nhật ký đã ghim, có ghi chú), Kiếp trước. Không lặp lại sinh lực, tu vi, vàng: những số sống ở khung Trạng thái.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h;

  let sub = 'tong', natOpen = '';
  const SUBS = [['tong', 'Tổng quan'], ['chiso', 'Chỉ số'], ['tt', 'Thành tựu'], ['dd', '★ Đánh dấu'], ['kt', 'Kiếp trước']];
  const ROBE = ['#8a8f99', '#3a6ea5', '#2a8a7a', '#c9a23a', '#9a78e0', '#e0709a', '#e8e8f0'];
  const CAT_ICON = { tu: '☯', chien: '⚔', tien: '◈', nguoi: '♥', tong: '⌂', nv: '✦', kp: '➶', the: '☼' };

  const refresh = () => { if (ui.resetSide) ui.resetSide(); ui.markDirty(); };
  const goTab = id => { ui.activeTab = id; refresh(); };

  function avatar(c) {
    const cv = h('canvas', { width: 21, height: 26, class: 'pf-av' }), g = cv.getContext('2d');
    const px = (x, y, w, hh, col) => { g.fillStyle = col; g.fillRect(x, y, w, hh); };
    const robe = ROBE[Math.min(6, c.realm)], hair = ['#1d1d2a', '#4a2f1e', '#2a2a3a', '#6a4a2a'][c.id % 4], fem = c.gender === 'nu', age = TT.age(c);
    px(0, 0, 21, 26, '#1a2748');
    for (let i = 0; i < 14; i++) px((i * 7) % 21, (i * 5) % 11, 1, 1, '#cfd8ff');
    px(0, 21, 21, 5, '#274a3a'); px(0, 21, 21, 1, '#3f7a5a');
    const kid = age < 12;
    const oy = kid ? 3 : 0;
    px(8, 5 + oy, 5, 5, '#e8c9a0'); px(7, 4 + oy, 7, 2, hair);
    if (fem) { px(7, 6 + oy, 1, 7, hair); px(13, 6 + oy, 1, 7, hair); } else { px(7, 6 + oy, 1, 3, hair); px(13, 6 + oy, 1, 3, hair); }
    if (age > 65) px(8, 10 + oy, 5, 1, '#e8e8f0');
    px(9, 7 + oy, 1, 1, '#14110f'); px(11, 7 + oy, 1, 1, '#14110f');
    px(6, 10 + oy, 9, 8 - oy, robe); px(6, 10 + oy, 9, 1, '#ffffff33'); px(9, 10 + oy, 3, 8 - oy, '#00000033');
    if (c.realm >= 1) px(6, 14 + oy, 9, 1, '#e8497c');
    px(5, 11 + oy, 1, 6, '#e8c9a0'); px(15, 11 + oy, 1, 6, '#e8c9a0');
    px(7, 18, 3, 4, '#27304a'); px(11, 18, 3, 4, '#27304a');
    if (c.equip && c.equip.weapon) { px(16, 9, 1, 10, '#c9d2dd'); px(15, 8, 3, 1, '#d9a441'); }
    return cv;
  }

  function topQuests(c) {
    const act = TT.quests.list(c).filter(q => q.state === 'on'), age = TT.age(c);
    const left = q => (q.byAge != null ? q.byAge - age : 99);
    const big = act.slice().sort((a, b) => a.rank - b.rank)[0] || null;
    const soon = act.slice().sort((a, b) => left(a) - left(b))[0] || null;
    return { big, soon, left };
  }
  const tile = (k, v, s, pct, tab, cls) => h('div', { class: 'pf-tile', onclick: tab ? () => goTab(tab) : null },
    h('div', { class: 'k' }, k), h('div', { class: 'v' + (cls ? ' ' + cls : '') }, v), s ? h('div', { class: 's' }, s) : null,
    pct != null ? h('div', { class: 'bar' + (cls === 'bad-txt' ? ' danger' : '') }, h('i', { style: 'width:' + Math.round(pct * 100) + '%' })) : null);

  function buildTong(box, c) {
    const w = TT.world, S = TT.stats, life = S.lifeSpan(c), lives = (w.lives || []).length;
    const reg = TT.map.region(c.region), j = c.job && c.job.main ? D.JOBS[c.job.main] : null;
    const path = c.path && D.PATHS[c.path.id] ? D.PATHS[c.path.id] : null;
    const chips = h('div', { class: 'pf-chips' }, h('span', { class: 'pf-chip o' }, S.realmName(c)));
    if (c.sect) chips.appendChild(h('span', { class: 'pf-chip v' }, D.SECTS[c.sect.id].n + ' · ' + D.SECT_RANKS[c.sect.rank]));
    if (j) chips.appendChild(h('span', { class: 'pf-chip g' }, 'Nghề: ' + j.n));
    if (path) chips.appendChild(h('span', { class: 'pf-chip' }, 'Đạo: ' + path.n));
    const info = h('div', null,
      h('div', { class: 'pf-nm' }, c.name),
      h('div', { class: 'small' }, (c.gender === 'nu' ? 'Nữ' : 'Nam') + ' · ' + TT.age(c) + ' tuổi / thọ nguyên ' + (life === Infinity ? '∞' : life) + ' · Kiếp thứ ' + (lives + 1)),
      h('div', { class: 'small' }, (c.origin ? c.origin.charAt(0).toUpperCase() + c.origin.slice(1) + ' · ' : '') + (reg ? reg.n : '')),
      chips);
    box.appendChild(h('div', { class: 'pf-card' }, avatar(c), info));

    // xuất thân và cha mẹ (9A): tên, còn sống hay đã mất; bí mật còn ẩn thì chỉ hiện dấu hỏi
    const o2 = TT.origin.get(c);
    if (o2) {
      box.appendChild(h('div', { class: 'pf-sec' }, 'Xuất thân · ' + o2.n));
      box.appendChild(h('div', { class: 'small' }, o2.d));
      const ps = TT.origin.parents(c);
      box.appendChild(h('div', { class: 'small' }, h('b', null, 'Cha mẹ: '), ...(ps.length ? ps.map((x, i) => h('span', { class: x.alive ? '' : 'bad-txt' }, (i ? ', ' : '') + x.role + ' ' + (x.c ? x.c.name : '(không rõ)') + (x.alive ? ' (còn sống)' : ' (đã mất)'))) : [o2.cha_me.co ? 'không còn trong thế giới' : 'không có'])));
      box.appendChild(h('div', { class: 'small' }, h('b', null, 'Gánh nặng: '), o2.gom));
      if (c.flags && c.flags.biMat) box.appendChild(h('div', { class: 'small' }, h('b', null, 'Bí mật: '), '?'));
    }

    // tính cách bốn trục và khí vận (8A): bấm một thanh để xem lịch sử đổi
    if (D.NATURE.on) {
      box.appendChild(h('div', { class: 'pf-sec' }, 'Tính cách · ' + TT.nature.summary(c)));
      TT.nature.rows(c).forEach(r => {
        const pct = Math.abs(r.v) / D.NATURE.max * 50, v = Math.round(r.v);
        box.appendChild(h('div', { class: 'pn-row' + (r.recent ? ' recent' : ''), title: r.lo + ' ↔ ' + r.hi + '. Bấm để xem lịch sử đổi.', onclick: () => { natOpen = natOpen === r.id ? '' : r.id; refresh(); } },
          h('div', null, h('b', null, r.n)),
          h('div', { class: 'pn-bar' }, h('i', { class: r.v < 0 ? 'neg' : 'pos', style: (r.v < 0 ? 'right:50%;' : 'left:50%;') + 'width:' + pct + '%' })),
          h('div', null, h('b', { class: 'pn-num' }, (v > 0 ? '+' : '') + v), ' ', h('span', { class: 'small' }, r.label))));
        if (natOpen === r.id) {
          const lg = (c.natureLog || []).filter(e => e.ax === r.id).slice().reverse().slice(0, 8);
          box.appendChild(h('div', { class: 'pn-hist' }, ...(lg.length ? lg.map(e => h('div', null, 'Năm ' + Math.max(0, Math.floor((e.m - c.birthMonth) / 12)) + ': ' + (e.d > 0 ? '+' : '') + e.d + (e.why ? ' (' + e.why + ')' : ''))) : [h('div', null, 'Chưa đổi từ lúc sinh.')])));
        }
      });
      box.appendChild(h('div', { class: 'pf-grid', style: 'margin-top:8px' }, tile('Khí vận', TT.kv.pts(c) + ' điểm', 'chỉ cộng bằng chuyện lớn', null, null)));
    }

    // danh vọng (chuyển từ bảng chỉ số và tab Quan hệ về đây)
    box.appendChild(h('div', { class: 'pf-sec' }, 'Danh vọng'));
    box.appendChild(h('div', { class: 'pf-grid three' },
      tile('Danh vọng', TT.rep.fameName(c), c.rep.danh + ' điểm', null, 'rel'),
      tile('Thiên hướng', TT.rep.alignName(c), 'điểm chính tà ' + Math.round(c.rep.chinh), null, 'rel'),
      tile('Nghiệp', String(c.nghiep), c.nghiep ? 'có thể phải gánh ở kiếp sau' : 'còn sạch', null, 'rel', c.nghiep ? 'bad-txt' : '')));

    // đang theo
    box.appendChild(h('div', { class: 'pf-sec' }, 'Đang theo'));
    const q = topQuests(c), tiles = h('div', { class: 'pf-grid' });
    if (q.big) tiles.appendChild(tile('Nhiệm vụ đứng đầu', q.big.text, q.left(q.big) < 99 ? 'còn ' + Math.max(0, q.left(q.big)) + ' năm · ' + Math.round(TT.quests.progress(c, q.big) * 100) + '%' : '', Math.min(1, TT.quests.progress(c, q.big)), 'goal'));
    else tiles.appendChild(tile('Nhiệm vụ', 'Chưa có', 'mở tab Nhiệm vụ để nhận', null, 'goal'));
    if (q.soon && q.soon !== q.big) tiles.appendChild(tile('Gần hạn nhất', q.soon.text, 'còn ' + Math.max(0, q.left(q.soon)) + ' năm', Math.min(1, TT.quests.progress(c, q.soon)), 'goal', q.left(q.soon) <= 1 ? 'bad-txt' : ''));
    if (j) { const lv = TT.job.level(c, c.job.main); tiles.appendChild(tile('Nghề chính', j.n, TT.job.rank(c, c.job.main) + ' · cấp ' + lv, null, 'job')); } else tiles.appendChild(tile('Nghề', 'Chưa chọn', 'mở tab Nghề', null, 'job'));
    if (c.sect) tiles.appendChild(tile('Tông môn', D.SECT_RANKS[c.sect.rank], 'cống hiến ' + Math.floor(c.sect.contrib), null, 'sect'));
    else tiles.appendChild(tile('Tông môn', 'Tán tu', 'chưa có chỗ dựa', null, 'sect'));
    box.appendChild(tiles);

    // người thân cận
    box.appendChild(h('div', { class: 'pf-sec' }, 'Người thân cận'));
    const close = TT.rel.close(c, 3);
    if (!close.length) box.appendChild(h('div', { class: 'small' }, 'Chưa có ai thân thiết. Hãy giao du, kết bạn.'));
    close.forEach(x => {
      const o = x.c;
      box.appendChild(h('div', { class: 'pf-rel', onclick: () => { ui.selectedPerson = o.id; goTab('rel'); } },
        h('div', { class: 'pf-i' }, o.name.split(' ').slice(-1)[0].charAt(0)),
        h('div', null, h('b', null, o.name), ' ', h('span', { class: 'small' }, TT.rel.label(c, o) + ' · ' + Math.round(x.r.v)),
          h('div', { class: 'small' }, o.alive ? (o.travel ? 'Đang đi đường' : (TT.map.place(o.place) || { n: '?' }).n) : 'Đã mất'))));
    });

    // kỷ lục
    box.appendChild(h('div', { class: 'pf-sec' }, 'Kỷ lục kiếp này'));
    box.appendChild(h('div', { class: 'pf-rec' },
      h('div', null, h('b', null, String(TT.age(c))), h('span', null, 'năm sống')),
      h('div', null, h('b', null, D.REALM_NAMES[c.realm]), h('span', null, 'cảnh giới')),
      h('div', null, h('b', null, String(Object.keys(c.visited || {}).length)), h('span', null, 'nơi đã đến'))));
    box.appendChild(h('div', { class: 'small', style: 'margin-top:10px' }, 'Sinh lực, tu vi, vàng xem ở khung Trạng thái.'));
  }

  function buildChiso(box, c) {
    box.appendChild(h('div', { html: ui.playerPanelHtml(c) }));
  }

  // thành tựu: tính từ trạng thái hiện tại, không cần lưu
  function achievements(c) {
    const age = TT.age(c), done = TT.quests.list(c).filter(q => q.state === 'done').length, vis = Object.keys(c.visited || {}).length;
    const fam = TT.family;
    return [
      ['☯', 'Luyện Khí', 'Đạt cảnh giới Luyện Khí', c.realm >= 1], ['☯', 'Trúc Cơ', 'Đạt cảnh giới Trúc Cơ', c.realm >= 2],
      ['☯', 'Kim Đan', 'Đạt cảnh giới Kim Đan', c.realm >= 3], ['☯', 'Nguyên Anh', 'Đạt cảnh giới Nguyên Anh', c.realm >= 4],
      ['⌂', 'Có chỗ dựa', 'Gia nhập một tông môn', !!c.sect], ['⌂', 'Có nghề', 'Chọn một nghề chính', !!(c.job && c.job.main)],
      ['♥', 'Kết đạo lữ', 'Kết duyên cùng một người', fam.partners(c).length > 0], ['♥', 'Có con cháu', 'Có con', fam.children(c).length > 0],
      ['♥', 'Nhận đồ đệ', 'Có một đồ đệ', fam.disciples(c).length > 0], ['✦', 'Làm nên chuyện', 'Hoàn thành 3 nhiệm vụ (' + Math.min(3, done) + '/3)', done >= 3],
      ['➶', 'Người đi xa', 'Ghé 7 nơi (' + Math.min(7, vis) + '/7)', vis >= 7], ['☼', 'Có tiếng', 'Danh vọng khác "Vô danh"', TT.rep.fameName(c) !== 'Vô danh'],
      ['◈', 'Có của ăn của để', 'Có từ 500 linh thạch trở lên', TT.ls.wealth(c) >= 500], ['☯', 'Trường thọ', 'Sống tới 50 tuổi', age >= 50]
    ];
  }
  function buildTt(box, c) {
    const a = achievements(c);
    box.appendChild(h('div', { class: 'pf-sec' }, 'Danh hiệu (' + a.filter(x => x[3]).length + '/' + a.length + ')'));
    box.appendChild(h('div', { class: 'pf-ach' }, ...a.map(x => h('div', { class: 'pf-ac' + (x[3] ? '' : ' lock') }, h('div', { class: 'i' }, x[0]), h('b', null, x[1]), h('span', null, x[2])))));
    box.appendChild(h('div', { class: 'pf-sec' }, 'Mốc đời gần đây'));
    const big = c.log.filter(e => TT.logMeta(e).lv === 'big').slice(-8).reverse();
    const tl = h('div', { class: 'jr-tl' });
    big.forEach(e => tl.appendChild(h('div', { class: 'jr-it ' + (e.tone || '') }, h('div', { class: 'jr-w' }, Math.max(0, Math.floor((e.m - c.birthMonth) / 12)) + ' tuổi · Tháng ' + (e.m % 12 + 1)), h('div', { class: 'jr-x' }, e.t))));
    if (!big.length) tl.appendChild(h('div', { class: 'small' }, 'Chưa có việc lớn nào.'));
    box.appendChild(tl);
    box.appendChild(h('button', { class: 'sm', style: 'margin-top:8px', onclick: () => ui.openLifeBook && ui.openLifeBook() }, 'Mở Sổ đời'));
  }

  function buildDd(box, c) {
    const ms = c.log.filter(e => e.star).slice().reverse();
    box.appendChild(h('div', { class: 'pf-sec' }, 'Mục đã ghim (' + ms.length + '/60)'));
    if (!ms.length) box.appendChild(h('div', { class: 'small' }, 'Bấm ☆ ở cuối một mục trong Nhật ký để ghim vào đây. Mục ghim không bao giờ bị xóa khỏi nhật ký.'));
    ms.forEach(e => {
      TT.logMeta(e);
      const note = h('div', { class: 'nt', title: 'Bấm để sửa ghi chú', onclick: () => { const v = prompt('Ghi chú cho mục này (bỏ trống để xóa):', e.mark || ''); if (v !== null) { e.mark = v.trim(); if (!e.mark) delete e.mark; refresh(); } } }, e.mark ? '“' + e.mark + '”' : '+ thêm ghi chú');
      if (!e.mark) note.style.opacity = '.55';
      box.appendChild(h('div', { class: 'pf-mk c-' + e.cat },
        h('div', { class: 'jic' }, CAT_ICON[e.cat] || '☼'),
        h('div', null,
          h('div', { class: 'w' }, Math.max(0, Math.floor((e.m - c.birthMonth) / 12)) + ' tuổi · Tháng ' + (e.m % 12 + 1), h('span', { class: 'st', title: 'Bỏ đánh dấu', onclick: () => { e.star = false; delete e.mark; if (ui.journalDirty) ui.journalDirty(); refresh(); } }, '★')),
          h('div', null, e.t), note)));
    });
  }

  function buildKt(box) {
    const lives = (TT.world.lives || []).slice().reverse();
    box.appendChild(h('div', { class: 'pf-sec' }, 'Các kiếp trước'));
    if (!lives.length) { box.appendChild(h('div', { class: 'small' }, 'Đời này là đời đầu tiên của bạn.')); }
    lives.forEach((l, i) => {
      const ends = (l.endings || []).map(id => (D.ENDINGS.find(e => e.id === id) || {}).n).filter(Boolean);
      box.appendChild(h('div', { class: 'pf-life' },
        h('h4', null, 'Kiếp ' + (lives.length - i) + ': ' + l.name),
        h('div', { class: 'small' }, l.age + ' tuổi · ' + D.REALM_NAMES[l.realm] + (l.how === 'ascend' ? ' · phi thăng' : ' · ' + (l.cause || 'qua đời')) + (l.kids ? ' · ' + l.kids + ' con' : '')),
        ends.length ? h('div', { class: 'small' }, 'Kết cục: ' + ends.join(', ')) : null));
    });
    const m = TT.meta && TT.meta.data;
    if (m) box.appendChild(h('div', { class: 'small', style: 'margin-top:8px' }, 'Tổng cộng ' + m.lives + ' kiếp, ' + m.ascended + ' lần phi thăng, cảnh giới cao nhất: ' + D.REALM_NAMES[m.best] + '. Bộ sưu tập kết cục xem ở tab Gia đình.'));
  }

  function keyOf(c) {
    if (sub === 'chiso') return ui.playerPanelHtml(c);
    if (sub === 'tong') {
      const q = topQuests(c);
      return JSON.stringify([natOpen, D.NATURE.on ? [TT.nature.rows(c).map(r => [r.v, r.recent ? 1 : 0]), TT.kv.pts(c), (c.natureLog || []).length] : 0, c.id, TT.age(c), c.realm, c.region, c.sect ? [c.sect.id, c.sect.rank, Math.floor(c.sect.contrib)] : 0, c.job && c.job.main, c.path && c.path.id, c.rep.danh, Math.round(c.rep.chinh), c.nghiep,
        q.big ? [q.big.id, Math.round(TT.quests.progress(c, q.big) * 100)] : 0, q.soon ? [q.soon.id, q.left(q.soon)] : 0,
        TT.rel.close(c, 3).map(x => [x.id, Math.round(x.r.v), x.c.alive, x.c.place]), Object.keys(c.visited || {}).length, c.gender, c.equip && c.equip.weapon]);
    }
    if (sub === 'tt') return JSON.stringify([achievements(c).map(x => x[3] ? 1 : 0), c.log.length, c.log.length ? c.log[c.log.length - 1].m : 0]);
    if (sub === 'dd') return JSON.stringify(c.log.filter(e => e.star).map(e => [e.m, e.t.length, e.mark || '']));
    return JSON.stringify([(TT.world.lives || []).length]);
  }

  ui.addTab({
    id: 'char', label: 'Hồ sơ', live: () => sub === 'chiso',
    key: c => sub + '|' + keyOf(c),
    build(box, c) {
      const bar = h('div', { class: 'pf-tabs' });
      SUBS.forEach(s => bar.appendChild(h('button', { class: sub === s[0] ? 'on' : '', onclick: () => { sub = s[0]; refresh(); } }, s[1])));
      box.appendChild(bar);
      ({ tong: buildTong, chiso: buildChiso, tt: buildTt, dd: buildDd, kt: buildKt })[sub](box, c);
    }
  });
})();
