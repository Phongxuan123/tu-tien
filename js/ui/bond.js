// Khối "chiều sâu quan hệ" (9B, R 4.1): ba thanh Tình, Tin, Kính, chip Ơn/Oán, loại và giai đoạn đạo lữ, tương hợp. Chỉ cho cặp thân thiết của người chơi.
// Dùng ở tab Gia đình (đạo lữ) và Quan hệ (người thân thiết). Thanh nào không có thì ẩn.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h;
  const NAMES = { love: 'Tình', trust: 'Tin', respect: 'Kính' };
  const TIPS = { love: 'Gắn bó yêu thương', trust: 'Tin tưởng, giao phó bí mật', respect: 'Nể trọng' };

  // Chữ ký rẻ để tab biết khi nào vẽ lại.
  ui.bondKey = function (c, o) {
    const v = TT.bond.bars(c, o);
    return v ? [v.t, v.st, Math.round(v.love), Math.round(v.trust), Math.round(v.respect), Math.round(v.debt)].join(',') : '';
  };

  // Trả về phần tử DOM (hoặc null nếu công tắc tắt / chưa quen).
  ui.bondBlock = function (c, o) {
    const v = TT.bond.bars(c, o);
    if (!v) return null;
    const box = h('div', { class: 'bond' });
    const d = TT.bond.get(c, o);
    const romance = v.t === 'dao_lu' || v.t === 'thuong' || v.t === 'hon_uoc' || (v.st && v.st !== '');
    const head = [TT.bond.label(c, o)];
    if (romance && o.alive) head.push('tương hợp: ' + TT.bond.compatLabel(TT.bond.compat(c, o)).toLowerCase());
    if (d && d.t === 'hon_uoc' && d.han) head.push('hạn ' + Math.max(0, d.han - TT.world.months) + ' tháng');
    box.appendChild(h('div', { class: 'small' }, head.join(' · ')));
    v.show.forEach(k => {
      const n = Math.round(v[k]);
      box.appendChild(h('div', { class: 'bondrow', title: TIPS[k], html: '<span class="small">' + NAMES[k] + '</span><div class="bar bd-' + k + '"><i style="width:' + n + '%"></i></div><span class="small">' + n + '</span>' }));
    });
    const debt = Math.round(v.debt);
    if (Math.abs(debt) >= 5) box.appendChild(h('div', { class: 'chips' }, h('span', { class: 'chip ' + (debt > 0 ? 'q2' : 'bad'), title: debt > 0 ? 'Ân tình bạn đã chịu hoặc đã cho' : 'Mối oán chưa hóa giải' }, (debt > 0 ? 'Ơn ' : 'Oán ') + Math.abs(debt))));
    return box;
  };
})();
