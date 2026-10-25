// Công cụ thử nghiệm: bảng chỉnh nhân vật (js/ui/devpanel.js). Tắt (mặc định) thì giao diện không được nạp, game y như cũ.
// Bật bằng ?dev=1 trên đường dẫn hoặc ô "Thử nghiệm" ở thanh điều khiển (nhớ trong localStorage khóa tt8b_dev). files.js đã đọc cùng điều kiện này.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.DEV = { on: !!window.TT_DEV_ON };
})();
