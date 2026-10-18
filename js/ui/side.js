// Khung tab bên trái. Mỗi tab đăng ký bằng ui.addTab({ id, label, html(c) } (chuỗi HTML, chỉ vẽ lại khi đổi)
// hoặc { id, label, key(c), build(box, c) } (dựng DOM, chỉ dựng lại khi key đổi, dùng cho tab có nút bấm).
// Tab có nút bấm không được dựng lại khi con trỏ đang nằm trên nó, để cú bấm không bị mất giữa chừng.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const h = ui.h, $ = ui.$;

  const tabs = [];
  let built = false, lastKey = '', lastTab = '', forced = false, clickHook = false;
  const btnEls = {};

  ui.addTab = function (def) { tabs.push(def); };
  ui.activeTab = 'char';

  function buildBar() {
    const bar = $('side-tabs');
    bar.innerHTML = '';
    tabs.forEach(t => {
      const b = h('button', { onclick: () => { ui.activeTab = t.id; lastKey = ''; ui.markDirty(); } }, t.label);
      btnEls[t.id] = b;
      bar.appendChild(b);
    });
    built = true;
  }

  ui.renderSide = function () {
    const c = TT.player();
    if (!c || !$('side-body')) return;
    if (!built) buildBar();
    if (!clickHook) { // sau một cú bấm trong tab, cho phép dựng lại ngay dù con trỏ còn nằm trên (nút đã chạy xong rồi)
      clickHook = true;
      $('side-body').addEventListener('click', () => { forced = true; ui.markDirty(); });
    }
    tabs.forEach(t => btnEls[t.id].classList.toggle('on', t.id === ui.activeTab));
    const def = tabs.find(t => t.id === ui.activeTab) || tabs[0];
    const box = $('side-body');
    if (def.html) {
      const html = def.html(c);
      const key = def.id + '|' + html;
      if (key !== lastKey) { lastKey = key; box.innerHTML = html; }
      return;
    }
    const key = def.id + '|' + def.key(c);
    const tabChanged = def.id !== lastTab;
    if (key === lastKey && !tabChanged) return;
    if (!tabChanged && !forced && !(def.live && def.live(c)) && box.matches(':hover') && lastKey) return; // đợi con trỏ rời đi
    forced = false; lastKey = key; lastTab = def.id;
    box.innerHTML = '';
    def.build(box, c);
  };

  // Khi đổi thế giới hoặc nhập bản lưu.
  ui.resetSide = function () { lastKey = ''; lastTab = ''; };
})();
