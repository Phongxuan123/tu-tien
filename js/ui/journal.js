// Nhật ký của bạn (bản mới): mục mới nhất ở trên cùng, gom theo năm (tuổi), ba mức quan trọng (việc lớn / thường / vặt),
// biểu tượng theo loại, bộ lọc, gộp việc vặt liền nhau, nút ⓘ xem chi tiết, nút ☆ đánh dấu, và "Sổ đời" (chỉ việc lớn, kèm các kiếp trước).
// Danh sách đánh dấu và thông tin cơ bản nằm ở tab Hồ sơ, không lặp ở đây.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h, $ = ui.$;

  const CATS = { tu: ['☯', 'Tu luyện'], chien: ['⚔', 'Chiến đấu'], tien: ['◈', 'Tiền bạc, đồ'], nguoi: ['♥', 'Người quen'], tong: ['⌂', 'Tông môn, nghề'], nv: ['✦', 'Nhiệm vụ'], kp: ['➶', 'Khám phá, đi lại'], the: ['☼', 'Thế giới, khác'] };
  const FILTERS = [['all', 'Tất cả'], ['big', 'Việc lớn'], ['star', '★ Đánh dấu'], ['tu', '☯ Tu luyện'], ['nguoi', '♥ Người'], ['tien', '◈ Tiền'], ['nv', '✦ Nhiệm vụ'], ['chien', '⚔ Chiến đấu']];
  const MERGE_NAME = { kp: 'Đi lại', tong: 'Việc tông môn, nghề', tien: 'Luyện nghề, trang bị', tu: 'Tu luyện', nguoi: 'Giao du', chien: 'Chữa trị', nv: 'Việc nhiệm vụ', the: 'Việc vặt' };
  const MAX_STAR = 60;

  let filt = 'all', openYear = {}, openInfo = new WeakSet(), merged = new WeakSet(), owner = -1, ver = 0, note = '';
  try { const s = localStorage.getItem('tt8b_jfilt'); if (s && FILTERS.some(f => f[0] === s)) filt = s; } catch (e) { /* bỏ qua */ }

  ui.journalVer = () => ver;
  function bump() { ver++; if (ui.journalDirty) ui.journalDirty(); }
  const ageAt = (c, m) => Math.max(0, Math.floor((m - c.birthMonth) / 12));
  const monthName = (m) => 'Tháng ' + (m % 12 + 1);

  function passes(e) {
    if (filt === 'big') return e.lv === 'big';
    if (filt === 'star') return !!e.star;
    if (filt !== 'all') return e.cat === filt;
    return true;
  }

  function evNode(c, e) {
    TT.logMeta(e);
    const d = h('div', { class: 'jev ' + (e.lv === 'big' ? 'big' : e.lv === 'minor' ? 'minor' : 'norm') + ' ' + (e.tone || '') + ' c-' + e.cat });
    const ic = h('div', { class: 'jic', title: CATS[e.cat][1] }, CATS[e.cat][0]);
    const tx = h('div', { class: 'jtx' }, e.t);
    const star = h('span', { class: 'jstar' + (e.star ? ' on' : ''), title: e.star ? 'Bỏ đánh dấu' : 'Đánh dấu mục này (xem lại ở tab Hồ sơ)', onclick: ev => {
      ev.stopPropagation();
      if (!e.star && c.log.filter(x => x.star).length >= MAX_STAR) { note = 'Đã đánh dấu tối đa ' + MAX_STAR + ' mục, hãy bỏ bớt.'; bump(); return; }
      e.star = !e.star; if (!e.star) delete e.mark; note = ''; bump();
    } }, e.star ? '★' : '☆');
    tx.appendChild(star);
    if (e.note) {
      tx.appendChild(h('span', { class: 'jinfo', title: 'Chi tiết', onclick: ev => { ev.stopPropagation(); if (openInfo.has(e)) openInfo.delete(e); else openInfo.add(e); bump(); } }, 'i'));
      if (openInfo.has(e)) tx.appendChild(h('div', { class: 'jdet' }, e.note));
    }
    d.appendChild(ic);
    d.appendChild(h('div', null, h('div', { class: 'jmo' }, monthName(e.m) + ' · ' + ageAt(c, e.m) + ' tuổi'), tx));
    return d;
  }

  function draw(c) {
    const box = $('log'), bar = $('log-filters'), nt = $('log-note');
    if (!box) return;
    if (owner !== c.id) { owner = c.id; openYear = {}; openInfo = new WeakSet(); merged = new WeakSet(); }
    if (bar) {
      bar.innerHTML = '';
      FILTERS.forEach(f => bar.appendChild(h('button', { class: 'sm' + (filt === f[0] ? ' on' : ''), onclick: () => { filt = f[0]; try { localStorage.setItem('tt8b_jfilt', filt); } catch (e) { /* bỏ qua */ } bump(); } }, f[1])));
    }
    if (nt) nt.textContent = note;
    const st = box.scrollTop;
    box.innerHTML = '';
    const all = c.log.slice(-400);
    const groups = {};
    all.forEach(e => { TT.logMeta(e); const a = ageAt(c, e.m); (groups[a] = groups[a] || []).push(e); });
    const ages = Object.keys(groups).map(Number).sort((a, b) => b - a);
    const topAge = ages.length ? ages[0] : 0;
    let shown = 0;
    ages.forEach(a => {
      const g = groups[a], items = g.filter(passes).reverse();
      if (!items.length) return;
      shown += items.length;
      const bigN = g.filter(e => e.lv === 'big').length, goodN = g.filter(e => e.tone === 'good').length, badN = g.filter(e => e.tone === 'bad').length;
      const isOpen = openYear[a] !== undefined ? openYear[a] : (a === topAge || filt !== 'all');
      box.appendChild(h('div', { class: 'jyr', onclick: () => { openYear[a] = !isOpen; bump(); } },
        h('span', { class: 'jtg' }, isOpen ? '▾' : '▸'), h('span', { class: 'jyt' }, a + ' tuổi'),
        h('span', { class: 'jys' }, 'Năm ' + (a + 1) + (a === topAge ? ' · hiện tại' : '')),
        h('span', { class: 'jsum' }, h('span', { class: 'k' }, '★ ' + bigN), h('span', { class: 'g' }, '▲ ' + goodN), h('span', { class: 'b' }, '▼ ' + badN))));
      if (!isOpen) return;
      let i = 0;
      while (i < items.length) {
        const e = items[i];
        if (e.lv === 'minor') {
          let j = i; while (j < items.length && items[j].lv === 'minor' && items[j].cat === e.cat) j++;
          const run = items.slice(i, j);
          if (run.length >= 2) {
            if (merged.has(run[0])) {
              run.forEach(r => box.appendChild(evNode(c, r)));
              box.appendChild(h('div', { class: 'jmerge', onclick: () => { merged.delete(run[0]); bump(); } }, '▴ gộp lại'));
            } else {
              box.appendChild(h('div', { class: 'jmerge c-' + e.cat, onclick: () => { merged.add(run[0]); bump(); } },
                h('div', { class: 'jic' }, CATS[e.cat][0]), h('span', null, MERGE_NAME[e.cat] + ' ×' + run.length + ' · bấm để bung')));
            }
            i = j; continue;
          }
        }
        box.appendChild(evNode(c, e)); i++;
      }
    });
    if (!shown) box.appendChild(h('div', { class: 'jempty' }, filt === 'star' ? 'Chưa đánh dấu mục nào. Bấm ☆ ở cuối một mục để ghim.' : 'Không có mục nào khớp.'));
    box.scrollTop = st;
  }
  ui.drawJournal = draw;

  // ---------- Sổ đời ----------
  let back = null, book = null;
  function openBook() {
    const c = TT.player(); if (!c) return;
    if (!back) {
      back = h('div', { class: 'jr-back', onclick: e => { if (e.target === back) closeBook(); } });
      book = h('div', { class: 'jr-book' }); back.appendChild(book); document.body.appendChild(back);
      document.addEventListener('keydown', e => { if (back.classList.contains('on') && e.key === 'Escape') { e.stopPropagation(); closeBook(); } }, true);
    }
    book.innerHTML = '';
    book.appendChild(h('div', { class: 'jr-hd' }, h('h3', null, 'Sổ đời của ' + c.name), h('button', { class: 'sm', onclick: closeBook }, 'Đóng ✕')));
    book.appendChild(h('div', { class: 'small' }, 'Chỉ những việc lớn của kiếp này, từ mới đến cũ. Các kiếp trước ở cuối.'));
    const tl = h('div', { class: 'jr-tl' });
    c.log.filter(e => TT.logMeta(e).lv === 'big').slice().reverse().forEach(e => {
      tl.appendChild(h('div', { class: 'jr-it ' + (e.tone || '') }, h('div', { class: 'jr-w' }, ageAt(c, e.m) + ' tuổi · ' + monthName(e.m)), h('div', { class: 'jr-x' }, e.t)));
    });
    if (!tl.firstChild) tl.appendChild(h('div', { class: 'small' }, 'Chưa có việc lớn nào.'));
    book.appendChild(tl);
    const lives = (TT.world.lives || []).slice().reverse();
    if (lives.length) {
      book.appendChild(h('div', { class: 'jr-sep' }, 'Kiếp trước'));
      lives.forEach((l, i) => book.appendChild(h('div', { class: 'jr-life' },
        h('b', null, 'Kiếp ' + (lives.length - i) + ': ' + l.name), h('div', { class: 'small' }, l.age + ' tuổi · ' + D.REALM_NAMES[l.realm] + (l.how === 'ascend' ? ' · phi thăng' : ' · ' + (l.cause || 'qua đời')) + (l.kids ? ' · ' + l.kids + ' con' : '')))));
    }
    back.classList.add('on');
  }
  function closeBook() { if (back) back.classList.remove('on'); }
  ui.openLifeBook = openBook;

  // nút trên đầu khung
  function init() {
    const b = $('log-book'); if (b && !b._on) { b._on = true; b.onclick = openBook; }
  }
  ui.initJournal = init;
})();
