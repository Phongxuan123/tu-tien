// Các bảng giao diện: chỉ số người chơi, nhật ký, tin tức "Thiên hạ", hộp quyết định. Bản đồ ở ui/map.js.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, S = TT.stats, h = ui.h, $ = ui.$;

  const state = { dirty: true, last: 0, logKey: '', newsKey: '', decKey: '' };
  ui.markDirty = () => { state.dirty = true; };
  // Xóa khóa so khớp để các bảng vẽ lại hoàn toàn (khi đổi hoặc nhập thế giới).
  ui.resetCaches = () => { reportKey = ''; state.logKey = ''; state.newsKey = ''; state.decKey = ''; state.dirty = true; if (ui.resetSide) ui.resetSide(); };

  function playerPanel(c) {
    const need = S.need(c);
    const pct = need === Infinity ? 100 : Math.min(100, Math.round(c.xp / need * 100));
    const hm = S.hpMax(c), hpp = Math.round(c.hp / hm * 100);
    const life = S.lifeSpan(c), t = S.tc(c);
    const attrs = c.tuchat.attrs.slice().sort((a, b) => b.p - a.p).map(a =>
      '<div>' + a.n + (a.di ? ' (biến dị)' : '') + ': <b>' + a.p + '</b><div class="bar ' + (a.di ? 'di' : 'el') +
      '"><i style="width:' + Math.min(100, a.p / 2) + '%"></i></div></div>').join('');
    const traits = c.traitIds.length
      ? c.traitIds.map(id => {
        const x = D.traitById[id];
        return '<span class="chip q' + x.q + (x.g ? '' : ' bad') + '" title="' + ui.esc(x.d) + ' (phẩm ' + D.QNAME[x.q] + ')">' +
          (x.g ? '▲ ' : '▼ ') + x.n + '</span>';
      }).join('')
      : '<span class="small">Không có</span>';
    return '<div class="sec">Bạn: ' + ui.esc(c.name) + '</div><div class="grid">' +
      '<div>Tuổi: <b>' + TT.age(c) + '</b> / ' + (life === Infinity ? '∞' : life) + '</div>' +
      '<div>Cảnh giới: <b>' + S.realmName(c) + '</b></div>' +
      (TT.loss.active(c) ? '<div class="bad-txt" title="Giảm sinh lực tối đa, tu luyện chậm, đột phá khó hơn. Nghỉ ngơi lành nhanh gấp đôi.">' + D.WOUND[c.wound.sev].n + ': còn ' + TT.loss.left(c) + ' tháng</div>' : '') +
      '<div>Tu vi: <b>' + Math.floor(c.xp) + '/' + (need === Infinity ? '∞' : need) + '</b><div class="bar"><i style="width:' + pct + '%"></i></div></div>' +
      '<div title="Tiền tệ của giới tu hành, cũng hấp thụ được để tu luyện. 10 vàng = 1 hạ phẩm, mỗi bậc gấp 100 bậc dưới.">Linh thạch: <b>' + TT.ls.purse(c).ls + '</b></div>' +
      '<div title="Tiền lẻ của phàm gian. Tự đổi sang linh thạch khi cần trả giá lớn.">Vàng: <b>' + TT.ls.purse(c).gold + '</b></div>' +
      '<div title="Cần đủ cơ duyên mới vượt được bình cảnh. Tìm cơ duyên để tăng.">Cơ duyên: <b>' + Math.floor(c.fortune) +
      (c.realm < 6 ? '/' + S.fortuneNeed(c) : '') + '</b>' + (c.stuck ? ' <span class="bad-txt">(bình cảnh)</span>' : '') + '</div></div>' +
      '<div class="sec">Chỉ số cơ bản</div><div class="grid">' +
      '<div>Sinh lực: <b>' + Math.round(c.hp) + '/' + hm + '</b><div class="bar hp"><i style="width:' + hpp + '%"></i></div></div>' +
      '<div>Công kích: <b>' + S.atk(c) + '</b></div><div>Niệm lực: <b>' + S.nl(c) + '</b></div></div>' +
      '<div class="sec">Chỉ số ẩn và suy ra</div><div class="grid">' +
      (D.NATURE.on ? '<div title="Tài nguyên tiêu được, chỉ cộng bằng chuyện lớn (kỳ ngộ vận mệnh, nhẫn thật, đột phá từ Kim Đan). Phần thụ động tính tối đa ' + TT.kv.passiveCap + '.">Khí vận: <b>' + TT.kv.pts(c) + ' điểm</b></div>'
        : '<div>Khí vận: <b>' + (c.known.kv ? S.kv(c) : '???') + '</b></div>') +
      '<div>Vận may: <b>' + (c.known.luck ? S.luck(c) : '???') + '</b></div>' +
      '<div title="Tính từ thuộc tính cao nhất">Tốc độ tu: <b>x' + S.trainMul(c).toFixed(2) + '</b></div>' +
      '<div title="Tính từ thuộc tính cao nhất và niệm lực">Linh ngộ: <b>' + S.ngo(c).toFixed(2) + '</b></div></div>' +
      '<div class="sec">Đạo tâm và danh vọng</div><div class="grid">' +
      '<div title="Tăng nhờ luận đạo, làm việc thiện, hoàn thành mục tiêu. Giúp chống tâm ma.">Đạo tâm: <b>' + Math.round(c.daoTam) + '/100</b><div class="bar"><i style="width:' + c.daoTam + '%"></i></div></div>' +
      '<div title="Tiền tệ của đạo hạnh, dùng học tâm pháp ở các mốc sau.">Đạo điểm: <b>' + c.daoDiem + '</b></div>' +
      '<div title="Dùng để đổi lại một lần tung xúc xắc quan trọng (có ở mốc sau).">Thiên cơ điểm: <b>' + c.tcd + '</b></div>' +
      '<div title="Khi sắp chết có thể trả giá để sống tiếp, tối đa ' + D.NT.max + ' lần mỗi đời.">Nghịch Thiên: <b>' + TT.nt.used(c) + '/' + D.NT.max + '</b>' + (c.thienPhat ? ' <span class="bad-txt">(thiên phạt)</span>' : '') + '</div></div>' +
      '<div class="sec">Tư chất: ' + t.total + ' điểm, ' + t.n + ' thuộc tính chính</div><div class="grid">' + attrs + '</div>' +
      '<div class="sec">Tiên thiên</div><div class="chips">' + traits + '</div>' +
      '<div class="sec">Đang làm</div><div><b>' + ui.actionLabel(c) + '</b></div>' +
      '<div class="sec">Vị trí</div><div><b>' + ui.locationLabel(c) + '</b></div>' + envLine(c);
  }

  function renderLog(c) {
    const last = c.log.length ? c.log[c.log.length - 1] : null;
    const key = c.id + ':' + c.log.length + ':' + (last ? last.m + ':' + last.t.length : 0) + ':' + (ui.journalVer ? ui.journalVer() : 0);
    if (key === state.logKey) return;
    state.logKey = key;
    if (ui.initJournal) ui.initJournal();
    if (ui.drawJournal) ui.drawJournal(c);
  }
  ui.journalDirty = () => { state.logKey = ''; state.dirty = true; };

  // Nhãn hành động hiện tại (có tính trường hợp đang trên đường).
  ui.actionLabel = function (c) {
    if (c.cross) {
      return 'Vượt vùng tới ' + TT.cross.regionLabel(c, c.cross.to) + ' (còn khoảng ' + Math.max(0, Math.ceil((c.cross.arrive - TT.world.months) / 12)) + ' năm)';
    }
    if (c.travel) {
      return 'Đi tới ' + TT.map.place(c.travel.to).n + ' (còn ' + Math.max(0, c.travel.arrive - TT.world.months) + ' tháng)';
    }
    if (c.focus === 'work' && c.sect) return 'Nhiệm vụ tông môn';
    if (c.focus === 'child') return 'Đang lớn lên';
    return D.ACTIONS[c.focus] || '';
  };
  ui.locationLabel = function (c) {
    if (c.cross) return 'Đang vượt vùng: ' + TT.map.region(c.cross.from).n + ' → ' + TT.cross.regionLabel(c, c.cross.to);
    const reg = TT.map.region(c.region);
    if (c.travel) return TT.map.place(c.travel.from).n + ' → ' + TT.map.place(c.travel.to).n + ' (' + reg.n + ')';
    return TT.map.place(c.place).n + ' · ' + reg.n;
  };
  // Một dòng tóm tắt môi trường và thời tiết cho bảng chỉ số.
  function envLine(c) {
    if (c.cross) return '<div class="sec">Môi trường</div><div class="small">Đang trên đường vượt vùng.</div>';
    const reg = TT.map.region(c.region), wx = TT.map.activeWeather(c.region);
    return '<div class="sec">Môi trường</div><div><b>' + ui.esc(reg.env.name) + '</b> <span class="small">(kháng ' +
      Math.round(TT.map.resistance(c, reg) * 100) + '%)</span></div>' +
      (wx ? '<div class="small">Thời tiết: <b>' + ui.esc(wx.def.name) + '</b>, còn ' + Math.max(0, wx.until - TT.world.months) + ' tháng</div>' : '');
  }

  // Hộp quyết định dạng cửa sổ nổi (popup): nhãn loại việc, tuổi và năm, tiêu đề, nội dung, khung hoàn cảnh, các lựa chọn đánh số.
  // Tầng 2 có thanh đếm ngược; hết giờ thì máy chọn mặc định (lựa chọn có dấu ★). Phím 1-9 chọn nhanh.
  // Có thể tắt dạng cửa sổ (hiện thành khung thường ở cột giữa) bằng nút cuối cửa sổ, nhớ trong localStorage.
  const popupOn = () => { try { return localStorage.getItem('tt8b_popup') !== '0'; } catch (e) { return true; } };
  const KIND_HINT = { risk: 'Có rủi ro, có thể được nhiều', safe: 'An toàn, ít thu hoạch', fight: 'Ra tay giao chiến', flee: 'Rút lui, tránh xung đột', help: 'Giúp đỡ, tăng thiện cảm', pay: 'Tốn tiền của' };
  function decLabel(d) {
    const id = d.evId || '';
    if (d.type === 'breakthrough') return 'Đột phá';
    if (d.type === 'break_reroll') return 'Thiên mệnh';
    if (d.type === 'nt_offer') return 'Nghịch Thiên';
    if (d.type === 'qreview') return 'Nhiệm vụ';
    if (d.type === 'story') return d.lon ? 'Cảnh lớn' : d.goi ? 'Lời nói thẳng' : 'Truyện';
    if (d.type === 'story_sau') return 'Truyện · lời dẫn';
    if (d.type === 'wheel') return 'Vòng quay vận mệnh';
    if (d.type === 'crossroad') return 'Ngã rẽ';
    if (d.type === 'job') return 'Nghề nghiệp';
    if (d.type === 'death') return 'Đạo tiêu';
    if (d.type === 'ascend') return 'Phi thăng';
    if (/^dg_|^yeu_thu|^cx_yeu/.test(id)) return 'Thám hiểm';
    if (id === 'tri_phase') return 'Thiên kiếp';
    if (/^fac_/.test(id)) return 'Thế cuộc';
    if (/^rel_ke_thu|^rel_tha/.test(id)) return 'Ân oán';
    if (/^sect_/.test(id)) return 'Tông môn';
    return d.tier === 3 ? 'Việc hệ trọng' : 'Giữa dòng đời';
  }
  function renderDecision() {
    const w = TT.world, d = w.pending;
    const key = d ? d.type + ':' + d.charId + ':' + d.rev : '';
    if (key === state.decKey) return;
    state.decKey = key;
    state.decT0 = d && d.timeout ? Date.now() : 0;
    const box = $('decision'), back = $('modal-back'), pop = popupOn();
    box.innerHTML = '';
    if (!d) { box.style.display = 'none'; if (back) back.style.display = 'none'; document.body.classList.remove('has-modal'); if (ui.scene) ui.scene.mirror = null; return; }
    box.style.display = 'block';
    box.classList.toggle('t3', d.tier === 3);
    box.classList.toggle('lon', !!d.lon);
    box.classList.toggle('modal', pop);
    if (back) back.style.display = pop ? 'block' : 'none';
    document.body.classList.toggle('has-modal', pop);
    const c = w.chars[d.charId] || TT.player(), yr = Math.floor(w.months / 12) - TT.config.startYear + 1;
    // đầu cửa sổ: nhãn, tuổi/năm, chọn mức tự động
    const mode = h('select', { class: 'mmode', title: 'Mức tự động', onchange: e => { TT.decisions.setMode(e.target.value); ui.markDirty(); } });
    TT.decisions.MODES.forEach(m => mode.appendChild(h('option', { value: m[0], selected: TT.decisions.mode() === m[0] ? 'selected' : null }, m[1])));
    box.appendChild(h('div', { class: 'mhead' }, h('span', { class: 'mlabel' }, decLabel(d)), h('span', { class: 'mright' }, h('span', { class: 'mmeta' }, TT.age(c) + ' tuổi · năm ' + yr), mode)));
    // cảnh pixel thu nhỏ trong cửa sổ để vẫn thấy yêu thú, kẻ thù, nơi đang đứng khi quyết định
    if (pop && ui.scene) { const mc = h('canvas', { class: 'mscene', width: ui.scene.W, height: ui.scene.H }); box.appendChild(mc); ui.scene.mirror = mc; } else if (ui.scene) ui.scene.mirror = null;
    const body = h('div', { class: 'mbody' });
    body.appendChild(h('h3', { class: 'mtitle' }, d.title));
    String(d.text || '').split('\n').filter(x => x.trim()).forEach(line => body.appendChild(h('p', { class: 'mtext' }, line)));
    // hoàn cảnh hiện tại (để quyết định có cơ sở)
    const S = TT.stats, ctx = ['Sinh lực ' + Math.round(c.hp) + '/' + S.hpMax(c), 'Tu vi ' + Math.floor(c.xp) + '/' + (c.realm < 6 ? D.NEED[Math.min(5, c.realm)] : '∞'), 'Linh thạch ' + (TT.ls ? TT.ls.fmt(TT.ls.wealth(c)) : Math.floor(c.gold))];
    if (TT.loss && TT.loss.active(c)) ctx.push(D.WOUND[c.wound.sev].n + ' còn ' + TT.loss.left(c) + ' tháng');
    if (d.ghi && d.ghi.length) body.appendChild(h('div', { class: 'mghi' }, d.ghi.join(' · '))); // lời dẫn: các thay đổi số hiện nhỏ ở dưới
    body.appendChild(h('div', { class: 'mctx' }, ctx.join(' · ')));
    if (d.opts) {
      d.opts.forEach(o => {
        const row = h('div', { class: 'prep' });
        row.appendChild(h('div', null, o.label));
        if (o.info) row.appendChild(h('div', { class: 'small' }, o.info));
        const bs = h('div', { class: 'btns' });
        o.btns.forEach(b => bs.appendChild(h('button', {
          class: 'sm', disabled: b.disabled ? 'disabled' : null, title: typeof b.disabled === 'string' ? b.disabled : null,
          onclick: () => { TT.decisions.prep(b.key); ui.markDirty(); }
        }, b.label)));
        row.appendChild(bs);
        body.appendChild(row);
      });
    }
    if (d.type === 'wheel' && ui.story) body.appendChild(ui.story.wheelBox(d));
    const def = TT.decisions.safeDefault(d), list = h('div', { class: 'mchoices' });
    d.choices.forEach((ch, i) => {
      const isDef = i === def, hint = ch.why || ch.hint || KIND_HINT[ch.kind] || '';
      const dot = d.type === 'story' && !ch.disabled ? (ch.hop ? h('span', { class: 'fitdot hop', title: 'Hợp tính bạn' }, '● hợp tính') : ch.trai ? h('span', { class: 'fitdot trai', title: 'Trái bản tính của bạn' }, '● trái tính') : null) : null;
      list.appendChild(h('button', {
        class: 'mch' + (isDef && d.timeout ? ' def' : '') + (ch.disabled ? ' off' : ''), disabled: ch.disabled ? 'disabled' : null, title: ch.why || null,
        onclick: () => TT.decisions.resolve(i)
      }, h('span', { class: 'mn' }, String(i + 1)), h('span', { class: 'mt' }, h('b', null, (d.timeout && isDef && d.type !== 'story_sau' ? '★ ' : '') + ch.label), dot, hint ? h('small', null, hint) : null, ch.mat ? h('small', { class: 'mat' }, 'Mất: ' + ch.mat) : null)));
    });
    body.appendChild(list);
    if (d.timeout) {
      body.appendChild(h('div', { class: 'timer' }, h('i', { id: 'dec-timer-bar' })));
      body.appendChild(h('div', { class: 'small', id: 'dec-timer-txt' }, ''));
    } else {
      body.appendChild(h('div', { class: 'small' }, d.type === 'story_sau' ? 'Trò chơi dừng lại; bấm Tiếp khi đọc xong.' : 'Trò chơi dừng lại chờ bạn quyết định.'));
    }
    const foot = h('div', { class: 'mfoot' });
    if (TT.decisions.mode() !== 'thu_cong') foot.appendChild(h('button', { class: 'sm', onclick: () => { TT.decisions.setMode('thu_cong'); state.decKey = ''; ui.markDirty(); } }, 'Tắt tự động quyết định'));
    foot.appendChild(h('button', { class: 'sm', onclick: () => { try { localStorage.setItem('tt8b_popup', pop ? '0' : '1'); } catch (e) { /* bỏ qua */ } state.decKey = ''; ui.markDirty(); } }, pop ? 'Hiện thành khung thường' : 'Hiện dạng cửa sổ'));
    body.appendChild(foot);
    box.appendChild(body);
  }
  // Phím số chọn nhanh khi có hộp quyết định (không bắt khi đang gõ vào ô nhập).
  document.addEventListener('keydown', e => {
    const w = TT.world, d = w && w.pending; if (!d || e.ctrlKey || e.metaKey || e.altKey) return;
    const tg = e.target && e.target.tagName; if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return;
    const i = parseInt(e.key, 10) - 1;
    if (i >= 0 && i < d.choices.length && !d.choices[i].disabled) { e.preventDefault(); TT.decisions.resolve(i); }
  });
  // Cập nhật đếm ngược mỗi vòng vẽ; hết giờ thì chọn mặc định.
  function tickCountdown() {
    const w = TT.world, d = w && w.pending;
    if (!d || !d.timeout || !state.decT0) return;
    const left = d.timeout - (Date.now() - state.decT0) / 1000;
    const bar = $('dec-timer-bar'), txt = $('dec-timer-txt');
    if (bar) bar.style.width = Math.max(0, left / d.timeout * 100) + '%';
    if (txt) {
      const ch = d.choices[TT.decisions.safeDefault(d)];
      txt.textContent = d.type === 'story_sau' ? 'Khung tự đóng sau ' + Math.max(0, Math.ceil(left)) + ' giây (có thể đóng sớm).' : 'Còn ' + Math.max(0, Math.ceil(left)) + ' giây, hết giờ máy sẽ chọn mặc định theo hướng đi: ' + ch.label;
    }
    if (left <= 0) { state.decT0 = 0; TT.decisions.resolveDefault(); ui.markDirty(); }
  }

  // Báo cáo cuối năm: kết quả, nguyên nhân, việc đáng chú ý, cảnh báo.
  let reportKey = '';
  function renderReport(c) {
    const box = $('report'), r = c.report;
    if (!r) { box.style.display = 'none'; return; }
    const key = c.id + ':' + r.age;
    if (key === reportKey) return;
    reportKey = key;
    box.style.display = 'block';
    box.innerHTML = '';
    const det = h('details', { open: 'open' });
    det.appendChild(h('summary', null, 'Báo cáo năm ' + r.age + ' tuổi · ' + r.realm + (r.promoted ? ' (vừa đột phá)' : '')));
    det.appendChild(h('div', { class: 'small', html: ui.esc(r.why) + ' Tiến độ cảnh giới ' + r.xpPct + '%. Tài sản ' + (r.gold >= 0 ? '+' : '-') + TT.ls.fmt(Math.abs(r.gold)) + (r.fame ? ', danh vọng +' + r.fame : '') + '.' }));
    if (r.share.length) det.appendChild(h('div', { class: 'small' }, 'Thời gian: ' + r.share.join(', ') + '.'));
    r.notable.forEach(t => det.appendChild(h('div', { class: 'small' }, '• ' + t)));
    r.warn.forEach(t => det.appendChild(h('div', { class: 'small bad-txt' }, '! ' + t)));
    box.appendChild(det);
  }

  ui.render = function () {
    const w = TT.world;
    if (!w) return;
    const c = TT.player();
    $('date').textContent = TT.dateStr();
    if (c) { $('hdr-age').textContent = TT.age(c); $('hdr-realm').textContent = TT.stats.realmName(c); ui.renderLifeMap(c); }
    ui.renderSide();
    renderLog(c);
    ui.renderMap();
    renderDecision();
    renderReport(c);
    ui.renderPersonCard();
    ui.syncControls();
  };

  ui.playerPanelHtml = playerPanel; // dùng trong tab Hồ sơ, mục Chỉ số (danh vọng, thiên hướng, nghiệp đã chuyển sang mục Tổng quan)

  // Vẽ lại tối đa ~8 lần/giây, chỉ khi có thay đổi. Dùng setTimeout (không dùng requestAnimationFrame)
  // để giao diện vẫn cập nhật khi tab bị ẩn hoặc nằm nền.
  // Thanh tiến độ năm chạy theo thời gian thực giữa hai tháng, không nhảy theo từng tháng.
  function updateYearBar() {
    const w = TT.world, t = TT.time, bar = $('yearbar');
    if (!w || !bar) return;
    const f = t.stepLen > 0 ? Math.min(1, (Date.now() - t.stepAt) / t.stepLen) : 1;
    bar.style.width = ((w.months % 12) + f) / 12 * 100 + '%';
  }

  ui.loop = function () {
    if (state.dirty) {
      state.dirty = false;
      try { ui.render(); } catch (e) { console.error('Lỗi vẽ giao diện:', e); }
    }
    try { updateYearBar(); } catch (e) { console.error('Lỗi thanh năm:', e); }
    try { tickCountdown(); } catch (e) { console.error('Lỗi đếm ngược:', e); }
    setTimeout(ui.loop, 120);
  };

  ['tick', 'log', 'news', 'decision', 'speed', 'reincarnate'].forEach(ev => TT.bus.on(ev, ui.markDirty));
})();
