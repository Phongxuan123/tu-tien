// Khoảnh khắc lớn trong đời: đột phá (boom), thiên kiếp (thunder), phi thăng (rise), chết (dead). T-A giữ hiệu ứng cũ, chỉ chỉnh tỉ lệ cho 480x144.
// T-B sẽ làm đẹp lại (linh khí hút về, vòng sáng, mây xoáy).
(function () {
  const sc = window.TT.ui.sc, CFG = sc.CFG, W = CFG.W, H = CFG.H, GY = CFG.GY, hash = sc.hash;

  // lớp phủ trên cùng: hạt phi thăng, ánh đột phá, tối đêm
  function over(ctx, s, pal, t) {
    const red = sc.reduced;
    if (s.rise) { ctx.fillStyle = '#ffe9a0'; ctx.globalAlpha = 0.5; for (let i = 0; i < 20 * sc.FX(); i++) ctx.fillRect(Math.round(200 + hash(i) * 80), Math.round(H - ((t * 22 + i * 18) % H)), 2, 6); ctx.globalAlpha = 1; }
    if (s.boom) { ctx.globalAlpha = red ? 0.06 : 0.18 + 0.12 * Math.sin(t * 2.7); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    if (pal.amb > 0.4) { ctx.globalAlpha = 0.12; ctx.fillStyle = '#05060f'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  }
  sc.events = { over };
})();
