// Bản thử dùng hai mẫu đã duyệt; không nạp trong danh sách game chính.
(function () {
  const sc = TT.ui.sc, actor = Object.assign({}, sc.actor), oldSprite = actor.sprite, oldDraw = actor.draw;
  const atlas = new Image(), frames = [[], []];
  let ready = false;
  atlas.onload = function () {
    const source = document.createElement('canvas');
    source.width = atlas.width; source.height = atlas.height;
    const g = source.getContext('2d', { willReadFrequently: true });
    g.drawImage(atlas, 0, 0);
    let pixels = null;
    // Trang file:// có thể chặn đọc pixel; vẫn vẽ atlas theo ô chuẩn.
    try { pixels = g.getImageData(0, 0, source.width, source.height).data; } catch (e) { /* dùng lưới */ }
    const cellW = source.width / 4, cellH = source.height / 2;
    // Tìm đường chân và khung hình thật trong từng ô, bỏ khoảng trong suốt.
    for (let row = 0; row < 2; row++) {
      const bounds = [];
      for (let col = 0; col < 4; col++) {
        const x0 = Math.round(col * cellW), y0 = Math.round(row * cellH);
        if (!pixels) {
          bounds.push({ left: x0 + Math.round(cellW * .16), right: x0 + Math.round(cellW * .84), top: y0, bottom: Math.round(y0 + cellH * .99) - 1 });
          continue;
        }
        let left = source.width, right = -1, top = source.height, bottom = -1;
        for (let y = y0; y < Math.round((row + 1) * cellH); y++) {
          for (let x = x0; x < Math.round((col + 1) * cellW); x++) {
            if (pixels[(y * source.width + x) * 4 + 3] < 40) continue;
            left = Math.min(left, x); right = Math.max(right, x);
            top = Math.min(top, y); bottom = Math.max(bottom, y);
          }
        }
        bounds.push({ left, right, top, bottom });
      }
      const height = Math.max(...bounds.map(b => b.bottom - b.top + 1));
      const width = Math.max(...bounds.map(b => b.right - b.left + 1));
      const scale = Math.min(76 / height, 46 / width);
      bounds.forEach(b => {
        const canvas = document.createElement('canvas'); canvas.width = 48; canvas.height = 80;
        const q = canvas.getContext('2d'); q.imageSmoothingEnabled = false;
        const w = (b.right - b.left + 1) * scale, h = (b.bottom - b.top + 1) * scale;
        q.drawImage(atlas, b.left, b.top, b.right - b.left + 1, b.bottom - b.top + 1, Math.round((48 - w) / 2), Math.round(79 - h), Math.round(w), Math.round(h));
        frames[row].push(canvas);
      });
    }
    // Mặt nữ dùng chung phần đầu từ Bước 1 ở mọi khung, tránh đổi nét khi đi.
    const head = frames[1][0];
    frames[1].slice(1).forEach(canvas => {
      const q = canvas.getContext('2d'); q.imageSmoothingEnabled = false;
      q.clearRect(0, 0, 48, 25);
      q.drawImage(head, 0, 0, 48, 25, 0, 0, 48, 25);
    });
    ready = true;
    window.dispatchEvent(new Event('ink-model-ready'));
  };
  atlas.onerror = () => { document.getElementById('model-status').textContent = 'Không tải được mẫu nhân vật. Hãy tải lại trang.'; };
  atlas.src = 'assets/characters/cultivators-face-study.png';
  function sprite(v, key) {
    if (!ready) return oldSprite(v, key);
    const index = key[0] === 'w' ? Number(key.slice(1)) % 4 : 1;
    return frames[v.female ? 1 : 0][index];
  }
  function drawOne(ctx, pal, row, x, fy, dir, mode, tm) {
    const index = mode === 'walk' ? Math.floor(tm * 7) % 4 : 1;
    const image = frames[row][index];
    ctx.save();
    ctx.globalAlpha = .3; ctx.fillStyle = pal.ink;
    ctx.beginPath(); ctx.ellipse(x, fy, 18, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.translate(Math.round(x), Math.round(fy));
    if (dir < 0) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, 48, 80, -30, -100, 60, 100);
    // Ánh môi trường như các lớp cảnh gốc; không làm sáng riêng nhân vật.
    ctx.restore();
  }
  actor.sprite = sprite;
  actor.draw = function (ctx, s, pal, t) {
    if (!ready) return oldDraw(ctx, s, pal, t);
    const p = actor.P, fy = actor.FY - Math.round(p.alt);
    actor.FOL.forEach((f, i) => {
      const person = s.people[i]; if (!person) return;
      drawOne(ctx, pal, person.c.gender === 'nu' ? 1 : 0, f.x, actor.FY, f.dir, f.moving ? 'walk' : 'rest', f.tm);
    });
    if (p.mode === 'ride') {
      ctx.save(); ctx.fillStyle = '#b5d5d0'; ctx.fillRect(p.x - 23, fy + 1, 46, 1);
      ctx.fillStyle = '#a49a70'; ctx.fillRect(p.x - p.dir * 20, fy, 3, 3); ctx.restore();
    }
    drawOne(ctx, pal, s.c.gender === 'nu' ? 1 : 0, p.x, fy, p.dir, p.mode, p.tm);
  };
  actor.modelReady = () => ready;
  sc.actor = actor;
})();
