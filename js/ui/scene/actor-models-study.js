// Bản thử dùng hai mẫu đã duyệt; không nạp trong danh sách game chính.
(function () {
  const sc = TT.ui.sc, actor = Object.assign({}, sc.actor), oldSprite = actor.sprite, oldDraw = actor.draw;
  const atlas = new Image(), femaleAtlas = new Image(), frames = [[], []];
  let ready = false;
  atlas.onload = function () {
    const source = document.createElement('canvas');
    source.width = atlas.width; source.height = atlas.height;
    const g = source.getContext('2d', { willReadFrequently: true });
    g.drawImage(atlas, 0, 0);
    g.drawImage(femaleAtlas, 0, femaleAtlas.height / 2, femaleAtlas.width, femaleAtlas.height / 2, 0, source.height / 2, source.width, source.height / 2);
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
      const scale = Math.min(152 / height, 92 / width);
      bounds.forEach(b => {
        const canvas = document.createElement('canvas'); canvas.width = 96; canvas.height = 160;
        const q = canvas.getContext('2d', { willReadFrequently: true }); q.imageSmoothingEnabled = false;
        const w = (b.right - b.left + 1) * scale, h = (b.bottom - b.top + 1) * scale;
        q.drawImage(source, b.left, b.top, b.right - b.left + 1, b.bottom - b.top + 1, Math.round((96 - w) / 2), Math.round(159 - h), Math.round(w), Math.round(h));
        frames[row].push(canvas);
      });
    }
    // Nữ vén mái, hở thái dương; nam vẫn dùng atlas gốc.
    // Khóa toàn bộ đầu, tóc trước và cổ từ Bước 1, cùng tọa độ ở mọi bước.
    const head = frames[1][0];
    let headPixels = null;
    try { headPixels = head.getContext('2d').getImageData(0, 0, 96, 64); } catch (e) { /* file:// */ }
    frames[1].forEach(canvas => {
      if (!headPixels && canvas === head) return;
      const q = canvas.getContext('2d'); q.imageSmoothingEnabled = false;
      q.clearRect(0, 0, 96, 64);
      if (headPixels) q.putImageData(headPixels, 0, 0);
      else q.drawImage(head, 0, 0, 96, 64, 0, 0, 96, 64);
    });
    ready = true;
    window.dispatchEvent(new Event('ink-model-ready'));
  };
  atlas.onerror = () => { document.getElementById('model-status').textContent = 'Không tải được mẫu nhân vật. Hãy tải lại trang.'; };
  femaleAtlas.onload = () => { atlas.src = 'assets/characters/cultivators-study.png?v=approved-face-6'; };
  femaleAtlas.onerror = atlas.onerror;
  femaleAtlas.src = 'assets/characters/cultivators-open-temple.png?v=7';
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
    ctx.beginPath(); ctx.ellipse(x, fy, 9, 1.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
    ctx.translate(Math.round(x), Math.round(fy));
    if (dir < 0) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, 0, 0, 96, 160, -15, -50, 30, 50);
    // Ánh môi trường như các lớp cảnh gốc; không làm sáng riêng nhân vật.
    ctx.restore();
  }
  actor.sprite = sprite;
  let castAt = -Infinity;
  actor.castFormation = function () { if (!ready || performance.now() - castAt < 6200) return false; castAt = performance.now(); return true; };
  actor.isCasting = () => performance.now() - castAt < 6200;
  function sword(ctx, x, y, angle, scale, alpha) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(scale, scale); ctx.globalAlpha = alpha;
    ctx.fillStyle = '#394f4b'; ctx.fillRect(-2, -17, 4, 20);
    ctx.fillStyle = '#dbe7d7'; ctx.beginPath(); ctx.moveTo(0, -22); ctx.lineTo(1, -17); ctx.lineTo(1, 1); ctx.lineTo(-1, 1); ctx.lineTo(-1, -17); ctx.fill();
    ctx.fillStyle = '#af9563'; ctx.fillRect(-4, 2, 8, 2); ctx.fillRect(-1, 4, 2, 5); ctx.restore();
  }
  function formation(ctx, p, age) {
    if (age < 0 || age > 6.2) return;
    const x = p.x, ground = actor.FY, fade = Math.min(1, age * 2, (6.2 - age) * 2);
    ctx.save(); ctx.globalAlpha = fade;
    // Trận đồ nằm trên mặt đất; kiếm có đường bay riêng, không đổi mặt nhân vật.
    ctx.fillStyle = '#122a28'; ctx.globalAlpha = fade * .22;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalAlpha = fade * .8; ctx.strokeStyle = '#bba678'; ctx.lineWidth = .7;
    for (const radius of [36, 47]) { ctx.beginPath(); ctx.ellipse(x, ground, radius, radius * .19, 0, 0, Math.PI * 2); ctx.stroke(); }
    for (let i = 0; i < 8; i++) {
      const a = i * Math.PI / 4 + age * .28;
      ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 37, ground + Math.sin(a) * 7);
      ctx.lineTo(x + Math.cos(a + Math.PI * .75) * 37, ground + Math.sin(a + Math.PI * .75) * 7); ctx.stroke();
    }
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6 + Math.min(age, 3) * .65;
      const rise = Math.min(1, age / 1.3), release = Math.max(0, Math.min(1, (age - 3.1 - i * .055) / .75));
      const sx = x + Math.cos(a) * 43, sy = ground - 30 + Math.sin(a) * 14;
      const tx = x + 125, ty = ground - 23;
      const px = sx + (tx - sx) * release, py = ground - (ground - sy) * rise + (ty - sy) * release;
      const angle = release > 0 ? Math.atan2(ty - sy, tx - sx) + Math.PI / 2 : Math.sin(age * 2 + i) * .12;
      if (release < 1) {
        ctx.globalAlpha = fade * .25; ctx.strokeStyle = '#a7c8b4'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(px, py + 10); ctx.stroke();
        sword(ctx, px, py, angle, .65, fade * (1 - release * .65));
      }
    }
    const hit = age - 3.75;
    if (hit > 0 && hit < 1.3) {
      ctx.globalAlpha = (1 - hit / 1.3) * .85; ctx.strokeStyle = '#cbb78a';
      ctx.beginPath(); ctx.ellipse(x + 125, ground - 23, 6 + hit * 28, 10 + hit * 21, 0, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 14; i++) { const a = i * 2.4; ctx.fillStyle = i % 2 ? '#9c4f42' : '#d0c295'; ctx.fillRect(x + 125 + Math.cos(a) * hit * 37, ground - 23 + Math.sin(a) * hit * 25, 1, 2); }
    }
    ctx.restore();
  }
  actor.draw = function (ctx, s, pal, t) {
    if (!ready) return oldDraw(ctx, s, pal, t);
    const p = actor.P, fy = actor.FY - Math.round(p.alt);
    actor.FOL.forEach((f, i) => {
      const person = s.people[i]; if (!person) return;
      drawOne(ctx, pal, person.c.gender === 'nu' ? 1 : 0, f.x, actor.FY, f.dir, f.moving ? 'walk' : 'rest', f.tm);
    });
    if (p.mode === 'ride') {
      ctx.save(); ctx.fillStyle = '#b5d5d0'; ctx.fillRect(p.x - 12, fy + 1, 24, 1);
      ctx.fillStyle = '#a49a70'; ctx.fillRect(p.x - p.dir * 10, fy, 2, 2); ctx.restore();
    }
    drawOne(ctx, pal, s.c.gender === 'nu' ? 1 : 0, p.x, fy, p.dir, p.mode, p.tm);
    formation(ctx, p, (performance.now() - castAt) / 1000);
  };
  actor.modelReady = () => ready;
  sc.actor = actor;
})();
