// Khởi động: tải bản lưu nếu có, nếu không thì tạo thế giới mới; chạy giao diện và đồng hồ game.
(function () {
  const TT = window.TT;
  const ui = TT.ui;

  function boot() {
    if (!TT.save.load()) {
      TT.life.createWorld();
      TT.save.write();
    }
    ui.buildControls();
    ui.render();
    TT.time.start();
    ui.loop();
    ui.childhood.resume(); // tải bản lưu giữa chừng tuổi thơ
  }

  window.addEventListener('DOMContentLoaded', boot);
})();
