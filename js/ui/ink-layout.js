// Chỉ sắp xếp các nút gốc: giữ nguyên dữ liệu và trình xử lý của game.
(function () {
  const $ = id => document.getElementById(id);
  function init() {
    const left = $('col-left'), mid = $('col-mid'), right = $('col-right');
    if (!left || !mid || !right) return;
    [[left, 'Hồ sơ và thông tin nhân vật'], [mid, 'Cảnh và nhật ký'], [right, 'Bản đồ và người xung quanh']].forEach(([column, label]) => {
      column.setAttribute('tabindex', '0');
      column.setAttribute('role', 'region');
      column.setAttribute('aria-label', label);
    });
    const menu = document.createElement('div');
    menu.className = 'ink-menu';
    menu.setAttribute('aria-label', 'Các mục tu hành');
    menu.append($('side-tabs')); $('topbar').append(menu);
    mid.prepend($('scene-ph'), $('scene-wrap'));
    right.append($('lifemap-card'));
    const controls = document.querySelector('.bar-controls');
    const options = document.createElement('details'); options.className = 'ink-options';
    const label = document.createElement('summary'); label.textContent = 'Tùy chọn';
    const body = document.createElement('div'); body.className = 'ink-option-body';
    options.append(label, body);
    // Lưu ở ngoài; nhập/xuất, âm thanh, phím tắt và AI vẫn truy cập trong menu.
    const files = document.querySelector('.fgroup');
    controls.append($('btn-save'));
    if (files) body.append(files);
    const audio = $('audio-box'), keys = $('btn-keys'), sell = $('auto-sell');
    if (audio) body.append(audio);
    if (keys) body.append(keys);
    if (sell) body.append(sell.closest('label'));
    controls.append(options);
    document.addEventListener('click', e => {
      if (!options.contains(e.target)) options.open = false;
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') options.open = false;
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
