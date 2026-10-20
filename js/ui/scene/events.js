// Khoảnh khắc lớn trong đời: đột phá (boom), thiên kiếp (thunder), phi thăng (rise), chết (dead). T-A giữ hiệu ứng cũ, chỉ chỉnh tỉ lệ cho 480x144.
// T-B sẽ làm đẹp lại (linh khí hút về, vòng sáng, mây xoáy).
(function () {
  const sc = window.TT.ui.sc, CFG = sc.CFG, W = CFG.W, H = CFG.H, GY = CFG.GY, hash = sc.hash;

  // lớp phủ trên cùng: sét + chớp, hạt phi thăng, ánh đột phá, tối đêm
  function over(ctx, s, pal, t) {
    const red = sc.reduced, fr = t * 9;
    const storm = s.thunder || s.terr.n === 'storm' || s.wid === 'giong_bao';
    if (storm) {
      const slot = Math.floor(fr / 8);
      if (slot % 9 === 0) {
        const k = (fr / 8) - slot; // 0..1 trong lúc chớp
        ctx.globalAlpha = (red ? 0.1 : 0.35) * (1 - k); ctx.fillStyle = '#d8e4ff'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1;
        if (!red && k < 0.7) { const bx = 80 + hash(slot) * 320; ctx.fillStyle = '#fffbd8'; for (let y = 0; y < GY; y += 6) ctx.fillRect(Math.round(bx + Math.sin(y) * 8), y, 3, 6); }
      }
    }
    if (s.rise) { ctx.fillStyle = '#ffe9a0'; ctx.globalAlpha = 0.5; for (let i = 0; i < 20 * sc.FX(); i++) ctx.fillRect(Math.round(200 + hash(i) * 80), Math.round(H - ((t * 22 + i * 18) % H)), 2, 6); ctx.globalAlpha = 1; }
    if (s.boom) { ctx.globalAlpha = red ? 0.06 : 0.18 + 0.12 * Math.sin(t * 2.7); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    if (pal.amb > 0.4) { ctx.globalAlpha = 0.12; ctx.fillStyle = '#05060f'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  }
  sc.events = { over };
})();
