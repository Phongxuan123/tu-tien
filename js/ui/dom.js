// Hàm dựng DOM nhỏ gọn dùng cho các bảng giao diện.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};

  ui.$ = id => document.getElementById(id);

  // h('div', { class: 'x', onclick: fn }, 'chữ', childNode, ...)
  ui.h = function (tag, attrs) {
    const el = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), v);
        else if (k === 'class') el.className = v;
        else if (k === 'html') el.innerHTML = v;
        else el.setAttribute(k, v);
      }
    }
    for (let i = 2; i < arguments.length; i++) {
      const ch = arguments[i];
      if (ch == null || ch === false) continue;
      el.appendChild(typeof ch === 'string' || typeof ch === 'number' ? document.createTextNode(String(ch)) : ch);
    }
    return el;
  };

  // 14 tháng -> '1 năm 2 tháng'; dưới 24 tháng giữ nguyên số tháng.
  ui.monthsText = m => { m = Math.round(m); if (m < 24) return m + ' tháng'; const y = Math.floor(m / 12), r = m % 12; return y + ' năm' + (r ? ' ' + r + ' tháng' : ''); };

  ui.esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
})();
