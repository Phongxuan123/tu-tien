// Quốc vận và nho khí (S3): thanh bậc ở Nha môn, dòng trong thẻ triều và mục "Quốc gia" của tab Biên niên sử. Quân lực (S6a) hiện ở thẻ triều, chữ và bậc.
// Chỉ đọc (xem systems/nation.js): không gọi rng, không khởi tạo dữ liệu. Hiện chữ và thanh bậc, không hiện số.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, K = D.NATION, h = ui.h;

  const sel = ui.nationSel = { open: false };
  const yr = m => Math.floor(m / 12) - TT.config.startYear + 1;
  const clsOf = t => (t.cls === 'good' ? 'good-txt' : t.cls === 'bad' ? 'bad-txt' : '');
  const taWord = v => (v >= K.ta.dangerAt ? 'nặng' : v >= 22 ? 'đáng kể' : v >= 8 ? 'nhẹ' : 'không đáng kể');

  // Thanh bậc quốc vận: năm vùng màu (Mạt, Suy, Bình, Thịnh, Rồng bay) và một mốc đứng ở mức hiện tại.
  function tierBar(v, tiers) {
    const bar = h('div', { class: 'tierbar', title: tiers.slice().reverse().map(t => t.n).join(' · ') });
    bar.appendChild(h('i', { style: 'left:' + Math.max(1, Math.min(99, Math.round(v))) + '%' }));
    return bar;
  }

  // Hai thanh cho một vùng (quốc vận và nho khí), dùng ở Nha môn.
  ui.nationBars = function (rid) {
    const x = TT.fac.list('trieu').find(t => t.region === rid); if (!x) return null;
    const d = TT.nation.describe(x), box = h('div', { class: 'nation-bars' });
    box.appendChild(h('div', { class: 'small', html: '<b>Quốc vận:</b> <span class="' + clsOf(d.tier) + '">' + ui.esc(d.tier.n) + '</span> · ' + ui.esc(d.tier.desc) }));
    box.appendChild(tierBar(d.van, K.tiers.slice().reverse()));
    box.appendChild(h('div', { class: 'small', html: '<b>Nho khí:</b> <span class="' + clsOf(d.nhoTier) + '">' + ui.esc(d.nhoTier.n) + '</span> · long mạch: ' + ui.esc(d.machName.toLowerCase()) + ' · tà khí trong vùng ' + taWord(d.taKhi) }));
    box.appendChild(tierBar(d.nho, K.nhoTiers.slice().reverse()));
    if (!d.init) box.appendChild(h('div', { class: 'small' }, 'Triều đình chưa có sổ ghi chép năm nay, hãy quay lại sau.'));
    return box;
  };

  // Một dòng ngắn trong thẻ triều.
  ui.nationLine = function (x) {
    const d = TT.nation.describe(x);
    return h('div', { class: 'small', html: 'Quốc vận <span class="' + clsOf(d.tier) + '">' + ui.esc(d.tier.n) + '</span> · nho khí <span class="' + clsOf(d.nhoTier) + '">' + ui.esc(d.nhoTier.n) + '</span>' + (d.tier.id === 'mat' ? ' · <span class="bad-txt">sắp mất mệnh</span>' : '') });
  };

  ui.nationKey = function () {
    const S = (TT.world.fac && TT.world.fac.nat) || {}; let n = 0;
    Object.keys(S).forEach(k => { n += S[k].falls * 7 + S[k].hist.length; });
    return '|n' + (sel.open ? 1 : 0) + ':' + n + (TT.army.on() ? '|' + TT.army.sig() : '');
  };

  ui.buildNation = function (box, c) {
    const sec = h('div', { id: 'nation-sec' }); box.appendChild(sec);
    sec.appendChild(h('div', { class: 'sec lnk', onclick: () => { sel.open = !sel.open; } }, (sel.open ? '▾ ' : '▸ ') + 'Quốc gia: quốc vận và nho khí' + (sel.open ? '' : ' (bấm để mở)')));
    if (!sel.open) return;
    sec.appendChild(h('div', { class: 'small' }, 'Quốc vận là khí số của cả nước, nho khí là sức văn trị và chính khí. Quốc vận dưới mức Suy ba năm liền thì mất mệnh trời: đổi chủ, chia cắt hoặc bị thôn tính.'));
    TT.fac.list('trieu').forEach(x => {
      const d = TT.nation.describe(x), card = h('div', { class: 'card' });
      card.appendChild(h('div', { html: '<b>' + ui.esc(x.n) + '</b> <span class="small">· ' + ui.esc(TT.map.region(x.region).n) + (x.vassal ? ' · chư hầu của ' + ui.esc((TT.fac.get(x.vassal) || {}).n || '?') : '') + '</span>' }));
      card.appendChild(h('div', { class: 'small', html: 'Quốc vận: <b class="' + clsOf(d.tier) + '">' + ui.esc(d.tier.n) + '</b>' + (d.low > 0 ? ' · <span class="bad-txt">đã ' + d.low + ' năm cùng mạt</span>' : '') }));
      card.appendChild(tierBar(d.van, K.tiers.slice().reverse()));
      card.appendChild(h('div', { class: 'small', html: 'Nho khí: <b class="' + clsOf(d.nhoTier) + '">' + ui.esc(d.nhoTier.n) + '</b>' + (d.khoaAt ? ' · khoa thi gần nhất năm ' + yr(d.khoaAt * 12) : '') }));
      card.appendChild(tierBar(d.nho, K.nhoTiers.slice().reverse()));
      card.appendChild(h('div', { class: 'small' }, 'Long mạch: ' + d.machName + ' · tà khí trong vùng ' + taWord(d.taKhi) + ' · đã ' + (d.falls ? 'mất mệnh ' + d.falls + ' lần' : 'chưa mất mệnh lần nào')));
      if (TT.army.on()) {
        const a = TT.army.describe(x);
        card.appendChild(h('div', { class: 'small', html: 'Quân lực: <b>' + ui.esc(a.bac) + '</b> · ' + ui.esc(a.ph) + ' · tướng: ' + ui.esc(a.tuong) + ' · trận: ' + ui.esc(a.tran) + ' · ' + ui.esc(a.sat) }));
        card.appendChild(h('div', { class: 'small' }, 'Bản sắc quân: ' + a.trait + ' (' + TT.army.trait(x.region).desc + ')'));
      }
      d.hist.slice(-3).reverse().forEach(e => card.appendChild(h('div', { class: 'small bad-txt' }, 'Năm ' + yr(e.m) + ': ' + e.t)));
      sec.appendChild(card);
    });
  };
})();
