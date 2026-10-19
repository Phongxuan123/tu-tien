// Đồng hồ game: mỗi "tháng" game là một bước. Tạm dừng khi có quyết định chờ người chơi.
// Tốc độ tự nhanh dần theo cảnh giới (TT.config.timeScale). Nút "Tua" chạy nhanh tới sự kiện kế tiếp (có hộp quyết định) hoặc tối đa vài năm.
(function () {
  const TT = window.TT = window.TT || {};
  let timer = null;

  TT.time = {
    speed: 1, // 0 = tạm dừng
    SPEEDS: [0, 1, 2, 4, 8, 16],
    skipping: false,
    skipLeft: 0,
    SKIP_MAX_MONTHS: 12 * 15,   // tua tối đa 15 năm game mỗi lần bấm
    slowUntil: 0,               // mốc thời gian thực (ms) hết đoạn làm chậm sau lựa chọn

    setSpeed(n) {
      TT.time.skipping = false;
      TT.time.speed = n;
      TT.bus.emit('speed', n);
    },

    // Gọi khi người chơi vừa chọn xong: thế giới chạy chậm một lúc để kịp đọc kết quả.
    slowAfterChoice() {
      if (TT.config.afterChoiceMs > 0) TT.time.slowUntil = Date.now() + TT.config.afterChoiceMs;
    },

    // Tua tới sự kiện kế tiếp: chạy hết tốc độ cho tới khi có hộp quyết định hoặc hết giới hạn.
    skip() {
      if (!TT.world || TT.world.pending) return;
      TT.time.skipping = true; TT.time.skipLeft = TT.time.SKIP_MAX_MONTHS;
      TT.bus.emit('speed', TT.time.speed);
    },

    start() {
      clearTimeout(timer);
      const loop = () => {
        const w = TT.world, t = TT.time;
        let delay = 200;
        if (w && t.skipping) {
          // chạy từng đợt nhỏ để giao diện không bị đơ
          for (let i = 0; i < 6 && t.skipLeft > 0 && !w.pending; i++) { TT.life.stepWorld(); t.skipLeft--; }
          if (w.pending || t.skipLeft <= 0) { t.skipping = false; TT.bus.emit('speed', t.speed); }
          delay = 0;
        } else if (w && !w.pending && t.speed > 0) {
          TT.life.stepWorld();
          const p = TT.player();
          const scale = TT.config.timeScale(p);
          const slow = Date.now() < t.slowUntil ? TT.config.afterChoiceSlow : 1;
          delay = TT.config.monthMs / (t.speed * scale * slow);
        }
        timer = setTimeout(loop, delay);
      };
      timer = setTimeout(loop, TT.config.monthMs);
    },

    stop() { clearTimeout(timer); }
  };
})();
