// Khối thám hiểm ở thông tin địa điểm: bí cảnh, tàn tích, hung địa có nút "Thám hiểm".
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h;

  ui.dungeonBlock = function (p, pl) {
    const kind = TT.dungeon.kindOf(pl.id);
    if (!kind) return null;
    const tpl = D.DUNGEONS[kind], st = TT.map.placeStats(pl);
    const box = h('div', { class: 'card' });
    box.appendChild(h('div', { html: '<b>' + ui.esc(tpl.n) + '</b> <span class="small">· nhiều chặng, nguy hiểm ' + st.danger + '/6' + (tpl.lethalBoss ? ', thủ lĩnh cuối có thể đánh tới cùng' : '') + '</span>' }));
    box.appendChild(h('div', { class: 'small' }, 'Mỗi chặng là một lựa chọn có rủi ro (cấm chế, quái vật, kho báu, chỗ nghỉ, thủ lĩnh). Có thể rút lui bất cứ lúc nào để giữ thu hoạch; bại trận thì mất nửa; thông quan được thưởng lớn và Thiên cơ điểm.'));
    const why = TT.dungeon.canEnter(p);
    if (p.place !== pl.id || p.travel || p.cross) box.appendChild(h('div', { class: 'small' }, 'Phải có mặt ở đây mới thám hiểm được.'));
    else {
      box.appendChild(h('button', {
        class: 'primary', disabled: why ? 'disabled' : null, title: why || null,
        onclick: () => { if (confirm('Thám hiểm ' + pl.n + '?\nBạn có thể rút lui giữa chừng, nhưng thua trận thì mất nửa thu hoạch, và đánh tới cùng với thủ lĩnh có thể mất mạng.')) { TT.dungeon.enter(TT.player(), pl.id); ui.markDirty(); } }
      }, 'Thám hiểm'));
      if (why) box.appendChild(h('div', { class: 'small bad-txt' }, why));
    }
    return box;
  };
})();
