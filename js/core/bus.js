// Kênh sự kiện đơn giản: các hệ thống phát sự kiện, giao diện và nhật ký lắng nghe.
(function () {
  const TT = window.TT = window.TT || {};
  const handlers = {};

  TT.bus = {
    on(ev, fn) { (handlers[ev] = handlers[ev] || []).push(fn); },
    off(ev, fn) { handlers[ev] = (handlers[ev] || []).filter(f => f !== fn); },
    emit(ev, data) {
      const list = handlers[ev];
      if (!list) return;
      for (const fn of list.slice()) {
        try { fn(data); } catch (e) { console.error('Lỗi xử lý sự kiện "' + ev + '":', e); }
      }
    }
  };
})();
