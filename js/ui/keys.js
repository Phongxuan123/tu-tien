// Phím tắt: chọn nhanh và xác nhận ở hộp quyết định, đổi lại (reroll), tạm dừng, tua, đổi tốc độ, chuyển tab, tắt tiếng.
// Phím số 1-9 chọn lựa chọn đã có ở panels.js. Ở đây là các phím còn lại. Chỉ bắt phím khi không gõ vào ô nhập chữ.
// Danh sách và cách dùng: ke-hoach/U-phim-tat.md.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const h = ui.h, $ = ui.$;

  // Khóa lựa chọn (choice.key) theo vai trò, dùng chung cho mọi hộp.
  const CONFIRM = ['ok', 'nhan', 'quay'];   // Tiếp tục, nhận kết quả, quay
  const REROLL = ['doi', 'lai'];            // đổi lại bằng Thiên cơ điểm, quay lại vòng quay
  const DECLINE = ['thoi'];                 // chấp nhận thất bại, không đổi
  const SPEED_KEYS = { '0': 0, '1': 1, '2': 2, '3': 4, '4': 8, '5': 16 };
  const TAB_KEYS = { c: 'char', b: 'bag', q: 'goal', k: 'tech', x: 'rel', s: 'sect', f: 'fam', j: 'job', n: 'press', l: 'history' };
  const GUARD_MS = 250;     // vừa hiện hộp mới thì chưa nhận Enter/Space, tránh bấm đúp lỡ bỏ qua

  let sel = null, shownAt = 0, lastSpeed = 1, helpEl = null;

  TT.bus.on('decision', () => { sel = null; shownAt = Date.now(); });

  const say = t => { const m = $('msg'); if (m) m.textContent = t; };
  const typing = e => {
    const t = e.target; if (!t) return false;
    const tag = t.tagName;
    if (tag === 'TEXTAREA' || tag === 'SELECT' || t.isContentEditable) return true;
    return tag === 'INPUT' && !/^(checkbox|radio|range|button|submit)$/.test(t.type);
  };
  const blur = () => { const a = document.activeElement; if (a && a !== document.body && a.blur) a.blur(); };
  const find = (d, keys) => d.choices.findIndex(ch => !ch.disabled && keys.indexOf(ch.key) >= 0);
  const pick = (i) => { TT.decisions.resolve(i); ui.markDirty(); };

  function mark(i) {
    document.querySelectorAll('#decision .mch').forEach((b, j) => b.classList.toggle('kbsel', j === i));
  }
  function moveSel(d, dir) {
    const ok = d.choices.map((c, i) => c.disabled ? -1 : i).filter(i => i >= 0); if (!ok.length) return;
    let p = sel == null ? -1 : ok.indexOf(sel);
    p = p < 0 ? (dir > 0 ? 0 : ok.length - 1) : (p + dir + ok.length) % ok.length;
    sel = ok[p]; mark(sel);
  }

  // Gợi ý phím cho hộp quyết định đang mở (hiện ở chân hộp).
  function hint(d) {
    const n = d.choices.length, p = ['Phím: 1–' + n + ' chọn nhanh'];
    if (n === 1 || find(d, CONFIRM) >= 0) p.push('Enter hoặc Space xác nhận'); else p.push('↑↓ rồi Enter để chọn');
    if (find(d, REROLL) >= 0) p.push('R đổi lại');
    if (find(d, DECLINE) >= 0) p.push('Esc không đổi');
    return p.join(' · ');
  }

  function decisionKey(e, d) {
    const k = e.key;
    if (k === 'Enter' || k === ' ') {
      e.preventDefault(); blur();
      if (e.repeat || Date.now() - shownAt < GUARD_MS) return;
      let i = d.choices.length === 1 && !d.choices[0].disabled ? 0 : find(d, CONFIRM);
      if (i < 0 && sel != null && !d.choices[sel].disabled) i = sel;
      if (i >= 0) { pick(i); return; }
      sel = TT.decisions.safeDefault(d); mark(sel);
      say('Bấm Enter lần nữa để chọn: ' + d.choices[sel].label);
    } else if (k === 'ArrowDown' || k === 'ArrowUp') {
      if (d.choices.length > 1) { e.preventDefault(); moveSel(d, k === 'ArrowDown' ? 1 : -1); }
    } else if (k === 'r' || k === 'R') {
      const i = find(d, REROLL); if (i >= 0 && !e.repeat) { e.preventDefault(); pick(i); }
    } else if (k === 'Escape' || k === 'n' || k === 'N') {
      const i = find(d, DECLINE); if (i >= 0 && !e.repeat) { e.preventDefault(); pick(i); }
    }
  }

  function cycle(list, cur, dir) { const i = list.indexOf(cur); return list[((i < 0 ? 0 : i) + dir + list.length) % list.length]; }

  function globalKey(e) {
    const k = e.key, lk = k.length === 1 ? k.toLowerCase() : k;
    if (k === ' ') {
      e.preventDefault(); blur(); if (e.repeat) return;
      const t = TT.time; if (!t) return;
      if (t.speed > 0) { lastSpeed = t.speed; t.setSpeed(0); say('Tạm dừng. Space để chạy tiếp.'); } else { t.setSpeed(lastSpeed || 1); say('Chạy tiếp.'); }
      ui.markDirty();
    } else if (SPEED_KEYS[k] !== undefined) {
      e.preventDefault(); const v = SPEED_KEYS[k]; if (v > 0) lastSpeed = v; TT.time.setSpeed(v); say(v ? 'Tốc độ x' + v : 'Tạm dừng.'); ui.markDirty();
    } else if (lk === 't') {
      const b = $('btn-skip'); if (b && !b.disabled) { e.preventDefault(); b.click(); }
    } else if (lk === 'm') {
      const b = $('btn-snd'); if (b) { e.preventDefault(); b.click(); say(b.textContent); }
    } else if (lk === 'a') {
      const ids = TT.decisions.MODES.map(m => m[0]), nx = cycle(ids, TT.decisions.mode(), 1);
      e.preventDefault(); TT.decisions.setMode(nx); say('Mức tự động: ' + TT.decisions.MODES.find(m => m[0] === nx)[1]); ui.markDirty();
    } else if (k === 'ArrowLeft' || k === 'ArrowRight') {
      const ids = ui.tabIds ? ui.tabIds() : []; if (!ids.length) return;
      e.preventDefault(); ui.gotoTab(cycle(ids, ui.activeTab, k === 'ArrowRight' ? 1 : -1));
    } else if (TAB_KEYS[lk] && ui.hasTab && ui.hasTab(TAB_KEYS[lk])) {
      e.preventDefault(); ui.gotoTab(TAB_KEYS[lk]);
    } else if (k === 'Escape' && helpEl && helpEl.style.display !== 'none') {
      toggleHelp(false);
    }
  }

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key.toLowerCase() === 's') {
      e.preventDefault(); const b = $('btn-save'); if (b) b.click(); return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey || typing(e)) return;
    const w = TT.world; if (!w) return;
    if (e.key === '?' || e.key === 'F1') { e.preventDefault(); toggleHelp(); return; }
    if (e.key === 'Escape' && helpEl && helpEl.style.display !== 'none') { toggleHelp(false); return; }
    if (w.pending) decisionKey(e, w.pending); else globalKey(e);
  });
  // Space nhả ra không được kích hoạt nút đang giữ tiêu điểm.
  document.addEventListener('keyup', e => { if (e.key === ' ' && !typing(e) && document.activeElement && document.activeElement.tagName === 'BUTTON') e.preventDefault(); });

  // ---------------------------------------------------------------- bảng phím tắt
  const ROWS = [
    ['Khi có hộp quyết định', [
      ['1 – 9', 'Chọn lựa chọn theo số'], ['Enter / Space', 'Xác nhận (Tiếp tục, nhận kết quả, quay). Hộp nhiều lựa chọn: Enter chọn mục đang sáng'],
      ['↑ ↓', 'Di chuyển mục sáng'], ['R', 'Đổi lại: dùng Thiên cơ điểm, quay lại vòng quay'], ['Esc hoặc N', 'Không đổi, chấp nhận kết quả']]],
    ['Bình thường', [
      ['Space', 'Tạm dừng hoặc chạy tiếp'], ['0 – 5', 'Tạm dừng, x1, x2, x4, x8, x16'], ['T', 'Tua tới sự kiện kế tiếp'],
      ['A', 'Đổi mức tự động (thủ công, cân bằng, tự động)'], ['M', 'Bật hoặc tắt âm thanh'], ['← →', 'Chuyển tab bên trái'],
      ['C B Q K X', 'Hồ sơ, Hành trang, Nhiệm vụ, Công pháp, Quan hệ'], ['S F J N L', 'Tông môn, Gia đình, Nghề, Nhật báo, Biên niên sử'],
      ['Ctrl + S', 'Lưu game'], ['? hoặc F1', 'Mở bảng này']]]
  ];
  function toggleHelp(force) {
    if (!helpEl) {
      helpEl = h('div', { id: 'keys-help', role: 'dialog', 'aria-label': 'Phím tắt', onclick: e => { if (e.target === helpEl) toggleHelp(false); } });
      const card = h('div', { class: 'kh-card' }, h('h2', null, 'Phím tắt'));
      ROWS.forEach(g => {
        card.appendChild(h('h3', null, g[0]));
        const t = h('div', { class: 'kh-rows' });
        g[1].forEach(r => { t.appendChild(h('kbd', null, r[0])); t.appendChild(h('span', null, r[1])); });
        card.appendChild(t);
      });
      card.appendChild(h('div', { class: 'small' }, 'Không bắt phím khi bạn đang gõ vào ô nhập chữ. Bấm ngoài khung hoặc Esc để đóng.'));
      helpEl.appendChild(card); document.body.appendChild(helpEl);
    }
    const on = force === undefined ? helpEl.style.display === 'none' || !helpEl.style.display : force;
    helpEl.style.display = on ? 'flex' : 'none';
  }
  window.addEventListener('DOMContentLoaded', () => { const b = $('btn-keys'); if (b) b.onclick = () => toggleHelp(); });

  ui.keys = { hint, toggleHelp };
})();
