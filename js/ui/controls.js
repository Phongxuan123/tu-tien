// Thanh điều khiển: tốc độ thời gian, hướng đi, lưu/tải/xuất/nhập, thế giới mới.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h, $ = ui.$;

  let built = false;
  const speedBtns = {};
  let pathLbl = null, pathQuit = null, autoSelect = null;

  ui.buildControls = function () {
    if (built) return;
    built = true;
    const sp = $('speed-box');
    TT.time.SPEEDS.forEach(n => {
      const b = h('button', { onclick: () => TT.time.setSpeed(n) }, n === 0 ? '⏸' : 'x' + n);
      speedBtns[n] = b;
      sp.appendChild(b);
    });

    // Thời gian chậm sau mỗi lựa chọn, nhớ lại ở lần chơi sau.
    try { const s = localStorage.getItem('tt8b_slowms'); if (s !== null && !isNaN(+s)) TT.config.afterChoiceMs = +s; } catch (e) { /* bỏ qua */ }
    const slowSel = h('select', { title: 'Sau mỗi lựa chọn, thế giới chạy chậm trong khoảng này để bạn kịp đọc kết quả', onchange: e => {
      TT.config.afterChoiceMs = +e.target.value;
      try { localStorage.setItem('tt8b_slowms', e.target.value); } catch (err) { /* bỏ qua */ }
    } });
    [[0, 'Không chậm'], [3000, 'Chậm 3 giây'], [5000, 'Chậm 5 giây'], [10000, 'Chậm 10 giây']].forEach(o => slowSel.appendChild(h('option', { value: o[0] }, o[1])));
    slowSel.value = String(TT.config.afterChoiceMs);
    sp.appendChild(slowSel);

    // Đạo hiện tại hiện dạng nhãn (chọn ở các ngã rẽ), có nút bỏ đạo giữa chừng (mất đạo tâm và thành thạo).
    pathLbl = h('span', { class: 'pname' });
    pathQuit = h('button', {
      class: 'sm', title: 'Bỏ đạo giữa chừng',
      onclick: () => {
        const p = TT.player(); if (!p || !TT.path.get(p)) return;
        if (TT.world.pending) { $('msg').textContent = 'Hãy xử lý quyết định đang chờ trước.'; return; }
        if (!confirm('Bỏ đạo ' + TT.path.name(p) + ' giữa chừng? Mất ' + TT.path.quitCost(p) + ' đạo tâm và một nửa phần thành thạo, rồi chọn đường mới ngay.')) return;
        TT.path.abandon(p); ui.markDirty();
      }
    }, 'bỏ đạo');
    $('dir-box').appendChild(pathLbl); $('dir-box').appendChild(pathQuit);

    autoSelect = h('select', {
      title: 'Thủ công: hỏi nhiều hơn. Cân bằng: hỏi việc quan trọng, hết giờ máy tự chọn. Tự động: chỉ dừng ở việc trọng đại.',
      onchange: e => { TT.decisions.setMode(e.target.value); ui.markDirty(); }
    });
    TT.decisions.MODES.forEach(m => autoSelect.appendChild(h('option', { value: m[0] }, m[1])));
    $('auto-box').appendChild(autoSelect);

    $('btn-skip').onclick = () => { TT.time.skip(); ui.markDirty(); };
    $('tab-local').onclick = () => ui.setMapView('local');
    $('tab-macro').onclick = () => ui.setMapView('macro');

    $('auto-move').onchange = e => {
      const p = TT.player();
      if (p) { p.autoMove = e.target.checked; if (p.autoMove) p.dest = p.travel ? p.dest : null; ui.markDirty(); }
    };

    $('btn-save').onclick = () => { $('msg').textContent = TT.save.write() ? 'Đã lưu.' : 'Không lưu được (trình duyệt chặn lưu trữ).'; };
    $('btn-export').onclick = () => TT.save.exportFile();
    $('btn-import').onclick = () => $('file-input').click();
    $('file-input').onchange = e => {
      const f = e.target.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        try {
          TT.save.importText(String(rd.result));
          $('msg').textContent = 'Đã nhập bản lưu.';
          ui.resetCaches();
          ui.markDirty();
        } catch (err) { $('msg').textContent = 'Lỗi: ' + err.message; }
      };
      rd.readAsText(f);
      e.target.value = '';
    };
    $('btn-new').onclick = () => {
      if (!confirm('Tạo thế giới mới? Thế giới hiện tại sẽ bị thay thế.')) return;
      TT.life.createWorld();
      TT.save.write();
      ui.resetCaches();
      ui.markDirty();
    };
  };

  ui.syncControls = function () {
    TT.time.SPEEDS.forEach(n => speedBtns[n].classList.toggle('on', TT.time.speed === n));
    const p = TT.player();
    if (p && pathLbl) {
      const pt = TT.path.get(p), tip = pt ? D.PATHS[pt.id].gain.join('; ') + '. ' + D.PATHS[pt.id].lose.join('; ') + '.' : 'Sẽ chọn ở ngã rẽ kế tiếp.';
      const txt = pt ? D.PATHS[pt.id].n + ' · ' + TT.path.years(p) + ' năm · cấp ' + TT.path.lv(p) : 'chưa chọn';
      if (pathLbl.textContent !== txt) pathLbl.textContent = txt;
      pathLbl.title = tip; pathQuit.style.display = pt ? '' : 'none';
    }
    if (autoSelect && autoSelect.value !== TT.decisions.mode()) autoSelect.value = TT.decisions.mode();
    if (p && $('auto-move').checked !== p.autoMove) $('auto-move').checked = p.autoMove;
    const waiting = TT.world && TT.world.pending;
    $('btn-skip').disabled = !!waiting || TT.time.skipping;
    const sc = TT.config.timeScale(p);
    $('status').textContent = waiting ? 'Đang chờ quyết định của bạn' : TT.time.skipping ? 'Đang tua tới sự kiện kế tiếp...' :
      (TT.time.speed === 0 ? 'Đang tạm dừng' : 'Đang chạy' + (sc > 1 && !(p && p.cross) ? ' (thời gian nhanh gấp ' + sc + ' ở cảnh giới này)' : ''));
  };
})();
