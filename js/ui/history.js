// Tab "Biên niên sử": thời đại, chiến sự, các thế lực và sử ký của thế giới.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h;

  const yr = m => Math.floor(m / 12) - TT.config.startYear + 1;
  const stateCls = { 'thịnh': 'good-txt', 'suy': 'bad-txt', 'diệt': 'bad-txt' };

  function build(box, c) {
    const f = TT.fac.S(), now = TT.world.months, era = TT.fac.era();
    box.appendChild(h('h2', null, 'Biên niên sử'));
    box.appendChild(h('div', { class: 'card' },
      h('div', { html: '<b>Thời đại: ' + ui.esc(era.n) + '</b> <span class="small">(từ năm ' + yr(f.era.since) + ')</span>' }),
      h('div', { class: 'small' }, era.desc),
      f.nextEra ? h('div', { class: 'small bad-txt' }, 'Có điềm báo: thiên địa sắp chuyển sang ' + D.ERAS[f.nextEra].n + '.') : null));

    box.appendChild(h('div', { class: 'sec' }, 'Chiến sự đang diễn ra'));
    if (!f.wars.length) box.appendChild(h('div', { class: 'small' }, 'Hiện không có chiến tranh nào.'));
    f.wars.forEach(w => {
      const a = TT.fac.get(w.a), b = TT.fac.get(w.b), pct = Math.round(50 + w.score / 60 * 50);
      box.appendChild(h('div', { class: 'card' },
        h('div', { html: '<b>' + ui.esc(a.n) + '</b> đấu với <b>' + ui.esc(b.n) + '</b>' }),
        h('div', { class: 'small' }, 'Chiến tuyến: ' + TT.map.region(w.front).n + ' · năm thứ ' + w.years + ' · vì ' + w.reason),
        h('div', { html: '<div class="bar"><i style="width:' + Math.max(2, Math.min(98, pct)) + '%"></i></div>' }),
        h('div', { class: 'small' }, 'Thế cuộc: ' + (w.score > 8 ? a.n + ' nhỉnh hơn' : w.score < -8 ? b.n + ' nhỉnh hơn' : 'bất phân thắng bại'))));
    });

    ['trieu', 'tong', 'gia', 'hoi'].forEach(k => {
      box.appendChild(h('div', { class: 'sec' }, TT.fac.KIND_NAME[k] + (k === 'tong' ? ' (nơi tu sĩ tụ họp)' : k === 'hoi' ? ' (trung gian giao thương, giàu nhưng không có quân đội)' : '')));
      TT.fac.list(k).forEach(x => {
        const mine = c.sect && c.sect.id === x.id;
        const row = h('div', { class: 'card' },
          h('div', { html: '<b>' + ui.esc(x.n) + '</b>' + (mine ? ' <span class="good-txt">· tông của bạn</span>' : '') + ' <span class="small">· ' + ui.esc(TT.map.region(x.region).n) + ' · <span class="' + (stateCls[x.state] || '') + '">' + x.state + '</span>' + (x.war ? ' · <span class="bad-txt">đang giao chiến</span>' : '') + (x.vassal ? ' · chư hầu của ' + ui.esc((TT.fac.get(x.vassal) || {}).n || '?') : '') + '</span>' }));
        if (TT.fac.alive(x)) {
          row.appendChild(h('div', { html: '<div class="bar"><i style="width:' + Math.round(k === 'hoi' ? x.wealth : x.power) + '%"></i></div>' }));
          if (k === 'hoi') {
            const top = Object.keys(x.infl || {}).sort((a, b) => x.infl[b] - x.infl[a]).slice(0, 2).map(i => (TT.fac.get(i) || {}).n + ' ' + Math.round(x.infl[i])).join(', ');
            row.appendChild(h('div', { class: 'small' }, 'Đứng đầu: ' + x.leader + ' · vốn ' + Math.round(x.wealth) + ' · uy tín ' + Math.round(x.trust) + ' · hộ vệ ' + Math.round(x.guard) + '/' + D.HOI.guardMax + ' · xu hướng: ' + D.HOI.agendaName[x.agenda]));
            row.appendChild(h('div', { class: 'small' }, 'Phủ: ' + x.reach.map(r => TT.map.region(r).n).join(', ') + (top ? ' · ảnh hưởng nhiều nhất: ' + top : '')));
          } else row.appendChild(h('div', { class: 'small' }, 'Đứng đầu: ' + x.leader + ' · sức mạnh ' + Math.round(x.power) + ' · đoàn kết ' + Math.round(x.unity) + (x.ally && x.ally.length ? ' · đồng minh: ' + x.ally.map(i => (TT.fac.get(i) || {}).n).join(', ') : '')));
        } else if (k === 'tong') row.appendChild(h('div', { class: 'small' }, 'Đã bị tiêu diệt, chỉ còn tàn tích (có thể thám hiểm).'));
        if (TT.fac.alive(x) && ui.factionStyle) ui.factionStyle(row, x, k, c);
        box.appendChild(row);
      });
    });

    if (ui.buildDiplo) ui.buildDiplo(box, c); // mục "Quan hệ thế lực" (S1)
    box.appendChild(h('div', { class: 'sec' }, 'Sử ký (' + f.chron.length + ' mục)'));
    f.chron.slice(-40).reverse().forEach(e => box.appendChild(h('div', { class: 'small' }, 'Năm ' + yr(e.m) + ': ' + e.t)));
  }
  ui.addTab({ id: 'history', label: 'Biên niên sử', key: c => { const f = TT.fac.S(); return c.id + ':' + f.chron.length + ':' + f.wars.length + ':' + f.era.id + ':' + Math.floor(TT.world.months / 12) + ':' + (c.sect ? c.sect.id : '') + (ui.diploKey ? ui.diploKey(c) : ''); }, build });
})();
