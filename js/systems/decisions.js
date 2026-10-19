// Quyết định của người chơi: ba tầng.
//   Tầng 1: máy tự quyết, chỉ ghi nhật ký. Tầng 2: hộp chọn có đếm ngược, hết giờ thì máy chọn mặc định.
//   Tầng 3: dừng hẳn chờ người chơi. Mức tự động (world.settings.auto) dịch chuyển các tầng này.
// world.pending lưu được vào bản lưu nên chỉ chứa dữ liệu thuần (key của lựa chọn); xử lý nằm ở handlers.
// Hộp "Chuẩn bị đột phá" có thêm các hàng bổ trợ (d.opts) với nút bật/tắt từng thứ; mỗi lần bấm hộp được dựng lại (replace).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, S = TT.stats;

  // Bổ trợ cho lần đột phá: thao tác theo key. Thao tác có thể hoàn lại (bấm ngược lại thì trả đồ, vàng, Thiên cơ điểm).
  function prep(c, key) {
    const A = c.aid;
    if (key === 'pill+') TT.cult.commitPill(c);
    else if (key === 'pill-') TT.cult.uncommitPill(c);
    else if (key === 'room+') TT.cult.buyRoom(c);
    else if (key === 'room-') { if (A.room) { A.room = false; c.gold += S.roomCost(c); } }
    else if (key === 'ngung+') { if (!A.ngung && TT.items.remove(c, 'ngung_than_dan')) A.ngung = true; }
    else if (key === 'ngung-') { if (A.ngung) { A.ngung = false; TT.items.add(c, 'ngung_than_dan'); } }
    else if (key === 'ho+') { if (!A.ho && TT.items.remove(c, 'ho_mach_dan')) A.ho = true; }
    else if (key === 'ho-') { if (A.ho) { A.ho = false; TT.items.add(c, 'ho_mach_dan'); } }
    else if (key === 'tcd+') { if (!A.tcd && c.tcd >= S.tcdCost(c)) { c.tcd -= S.tcdCost(c); A.tcd = true; } }
    else if (key === 'tcd-') { if (A.tcd) { A.tcd = false; c.tcd += S.tcdCost(c); } }
    else if (key.indexOf('guard:') === 0) A.guard = +key.slice(6) || 0;
  }

  const handlers = {
    // key: 'go' đột phá, 'wait' tích lũy thêm. Các bổ trợ chọn qua TT.decisions.prep.
    breakthrough(d, i) {
      const c = TT.world.chars[d.charId];
      if (!c || !c.alive) return;
      const key = d.choices[i].key;
      if (key === 'go') { c.waits = 0; TT.cult.attemptBreak(c); }
      else {
        c.waits = (c.waits || 0) + 1;
        c.breakDelay = TT.world.months + 12;
        TT.log(c, 'Bạn quyết định tích lũy thêm một năm trước khi đột phá (bổ trợ đã chuẩn bị vẫn được giữ).', 'age');
      }
    },
    break_reroll(d, i) {
      const c = TT.world.chars[d.charId];
      if (!c || !c.alive) return;
      TT.cult.rerollBreak(c, d.choices[i].key === 'doi');
    },
    nt_offer(d, i) {
      const c = TT.world.chars[d.charId];
      if (!c) return;
      TT.nt.resolve(c, d.choices[i].key === 'cai');
    },
    event(d, i) {
      const c = TT.world.chars[d.charId];
      if (!c || !c.alive) return;
      TT.events.apply(c, D.eventById[d.evId], d.choices[i].key, d.ctx);
    },
    job(d, i) {
      const c = TT.world.chars[d.charId];
      if (!c || !c.alive) return;
      const key = d.choices[i].key; if (key) TT.job.set(c, 'main', key);
    },
    crossroad(d, i) {
      const c = TT.world.chars[d.charId];
      if (!c || !c.alive) return;
      TT.path.choose(c, d.choices[i].key, d.why);
    },
    qreview(d, i) {
      const c = TT.world.chars[d.charId];
      if (!c || !c.alive) return;
      if (d.choices[i].key === 'apply') TT.quests.applyAdvice(c);
    },
    press(d, i) {
      const c = TT.world.chars[d.charId];
      if (c && c.alive && d.choices[i].key === 'sub') TT.press.subscribe(c);
    },
    death: rebirth,
    ascend: rebirth
  };

  // Hết một kiếp: đầu thai mới (có thưởng tư chất) hoặc kế thừa con cháu, đồ đệ (mang nhân quả).
  function rebirth(d, i) {
    const w = TT.world, prev = w.chars[d.charId], key = d.choices[i].key || '';
    if (key.indexOf('heir:') === 0) {
      const heir = w.chars[+key.slice(5)];
      if (heir && heir.alive && prev) return TT.life.inherit(prev, heir);
    }
    TT.life.reincarnate({ boost: true });
  }

  TT.decisions = {
    // Mức tự động: 'thu_cong' hỏi nhiều, 'can_bang' mặc định, 'tu_dong' chỉ dừng ở việc trọng đại.
    MODES: [['thu_cong', 'Thủ công'], ['can_bang', 'Cân bằng'], ['tu_dong', 'Tự động']],
    mode() { const w = TT.world; return (w && w.settings && w.settings.auto) || 'can_bang'; },
    setMode(m) { TT.world.settings = TT.world.settings || {}; TT.world.settings.auto = m; TT.bus.emit('decision', TT.world.pending); },

    // Tạo yêu cầu quyết định cho người chơi (chỉ giữ một cái tại một thời điểm).
    request(d) {
      const w = TT.world;
      if (w.pending && w.pending.type === 'death') return; // đã chết thì không hỏi gì khác
      let tier = d.tier || 3;
      const mode = TT.decisions.mode();
      const multi = d.choices.length > 1;
      if (mode === 'thu_cong' && multi && tier < 3) tier++;
      // Máy tự chọn ngay: tầng 1, hoặc tầng 2 ở chế độ tự động, hoặc tầng 3 cho phép tự động ở chế độ tự động.
      if (tier === 1 || (mode === 'tu_dong' && (tier === 2 || (tier === 3 && d.autoOk)))) {
        const i = TT.decisions.safeDefault(d);
        const h = handlers[d.type];
        if (h) h(d, i);
        return;
      }
      // Đang có quyết định khác chờ thì bỏ qua cái mới (sẽ được xét lại sau), trừ chết và phi thăng: luôn thay thế
      // quyết định đang chờ vì nhân vật đã không còn để mà quyết nữa. Hộp chuẩn bị đột phá tự thay chính nó (replace).
      const same = d.replace && w.pending && w.pending.type === d.type && w.pending.charId === d.charId;
      if (w.pending && !same && d.type !== 'ascend' && d.type !== 'death') return;
      d.tier = tier;
      d.timeout = tier === 2 ? (d.timeout || 12) : 0;
      w.decRev = (w.decRev || 0) + 1; // để giao diện biết hộp quyết định đã đổi nội dung
      d.rev = w.decRev;
      w.pending = d;
      TT.bus.emit('decision', d);
    },

    // Chỉ số lựa chọn mặc định, bỏ qua các lựa chọn bị vô hiệu.
    safeDefault(d) {
      const i = d.def || 0;
      if (d.choices[i] && !d.choices[i].disabled) return i;
      const j = d.choices.findIndex(ch => !ch.disabled);
      return j < 0 ? 0 : j;
    },

    // Bật/tắt một bổ trợ trong hộp chuẩn bị đột phá rồi dựng lại hộp.
    prep(key) {
      const w = TT.world, d = w.pending;
      if (d && d.type === 'qreview') return TT.quests.reviewAct(key);
      if (!d || d.type !== 'breakthrough') return;
      const c = w.chars[d.charId];
      if (!c || !c.alive) return;
      prep(c, key);
      TT.decisions.breakthroughFor(c, true);
    },

    // Các hàng bổ trợ hiển thị trong hộp chuẩn bị đột phá.
    prepRows(c) {
      const A = c.aid, max = D.AID.pillMax, has = id => TT.items.count(c, id);
      const pillCost = S.pillCost(c), roomCost = S.roomCost(c);
      const pillOk = A.pill < max && (has('pha_canh_dan') > 0 || TT.ls.can(c, pillCost));
      const guards = TT.cult.guardCandidates(c);
      const g = S.guardOf(c);
      return [
        {
          label: 'Phá Cảnh Đan ' + A.pill + '/' + max + ' (+' + Math.round(D.AID.pillBonus * 100) + '% mỗi viên)',
          info: 'Trong túi: ' + has('pha_canh_dan') + ' · mua thêm: ' + TT.ls.fmt(pillCost) + '/viên',
          btns: [{ key: 'pill+', label: 'Thêm một viên', disabled: !pillOk }, { key: 'pill-', label: 'Bớt một viên', disabled: A.pill <= 0 }]
        },
        {
          label: 'Động phủ linh khí (+' + Math.round(D.AID.roomBonus * 100) + '%): ' + (A.room ? 'đã thuê' : 'chưa thuê'),
          info: 'Thuê: ' + TT.ls.fmt(roomCost),
          btns: [{ key: 'room+', label: 'Thuê', disabled: A.room || !TT.ls.can(c, roomCost) }, { key: 'room-', label: 'Hủy thuê', disabled: !A.room }]
        },
        {
          label: 'Ngưng Thần Đan (+4%): ' + (A.ngung ? 'sẽ dùng' : 'chưa dùng'), info: 'Trong túi: ' + has('ngung_than_dan'),
          btns: [{ key: 'ngung+', label: 'Dùng', disabled: A.ngung || has('ngung_than_dan') < 1 }, { key: 'ngung-', label: 'Không dùng', disabled: !A.ngung }]
        },
        {
          label: 'Hộ Mạch Đan (giảm tổn thương và nguy cơ chết nếu thất bại): ' + (A.ho ? 'sẽ dùng' : 'chưa dùng'), info: 'Trong túi: ' + has('ho_mach_dan'),
          btns: [{ key: 'ho+', label: 'Dùng', disabled: A.ho || has('ho_mach_dan') < 1 }, { key: 'ho-', label: 'Không dùng', disabled: !A.ho }]
        },
        {
          label: 'Hộ pháp: ' + (g ? g.name + ' (+' + Math.round(S.guardBonus(g) * 100) + '%)' : 'chưa mời'),
          info: guards.length ? 'Người thân thiết đang ở cùng chỗ có thể canh giữ cho bạn (cũng bị thương nếu thất bại).' : 'Chưa có người thân thiết nào ở cùng địa điểm.',
          btns: guards.map(x => ({ key: 'guard:' + x.id, label: x.name + ' (' + D.REALM_NAMES[x.realm] + ')', disabled: A.guard === x.id })).concat(A.guard ? [{ key: 'guard:0', label: 'Không mời' }] : [])
        },
        {
          label: 'Thiên cơ nghịch chuyển (+10%): ' + (A.tcd ? 'đã dùng' : 'chưa dùng'), info: 'Tốn ' + S.tcdCost(c) + ' Thiên cơ điểm (bạn có ' + c.tcd + '). Thất bại còn có thể đổi lại bằng ' + S.rerollCost(c) + ' điểm.',
          btns: [{ key: 'tcd+', label: 'Dùng', disabled: A.tcd || c.tcd < S.tcdCost(c) }, { key: 'tcd-', label: 'Hoàn lại', disabled: !A.tcd }]
        }
      ];
    },

    breakthroughFor(c, replace) {
      const next = D.REALM_NAMES[c.realm + 1];
      if (TT.decisions.mode() === 'tu_dong' && !replace) TT.cult.autoPrep(c);
      const pct = v => (v >= 0 ? '+' : '') + Math.round(v * 100) + '%';
      const lines = S.breakParts(c).map(p => '  ' + p.n + ': ' + pct(p.v));
      const chance = S.breakChance(c);
      const ho = c.aid.ho, g = S.guardOf(c);
      const pDeath = TT.cult.failDeath(c, ho, g);
      const choices = [
        { key: 'go', label: 'Bắt đầu đột phá lên ' + next + ' (' + Math.round(chance * 100) + '%)' },
        { key: 'wait', label: 'Tích lũy thêm một năm' }
      ];
      // Mặc định cho chế độ tự động: chờ thêm khi xác suất quá thấp, còn lại thì đột phá.
      const def = chance < 0.12 && (c.waits || 0) < 3 ? 1 : 0;
      TT.decisions.request({
        type: 'breakthrough', charId: c.id, tier: 3, autoOk: true, replace: !!replace,
        title: 'Chuẩn bị đột phá lên ' + next,
        text: 'Tu vi và cơ duyên đã đủ. Xác suất thành công hiện là ' + Math.round(chance * 100) + '%.\n' + lines.join('\n') +
          '\nNếu thất bại: hao tu vi, mất một nửa cơ duyên đã dùng, mất bổ trợ; nguy cơ tử vong khoảng ' + Math.round(pDeath * 100) + '%. Tài sản hiện có: ' + TT.ls.fmt(TT.ls.wealth(c)) + '.' +
          '\nChọn các bổ trợ bên dưới (mỗi thứ hiện rõ phần xác suất cộng thêm) rồi bắt đầu, hoặc chờ thêm.',
        choices, def, opts: TT.decisions.prepRows(c)
      });
    },

    resolve(i) {
      const w = TT.world, d = w.pending;
      if (!d || !d.choices[i] || d.choices[i].disabled) return;
      w.pending = null;
      const h = handlers[d.type];
      if (h) h(d, i);
      TT.bus.emit('decision', null);
    },

    // Hết giờ đếm ngược hoặc chạy mô phỏng tự động: chọn lựa chọn mặc định.
    resolveDefault() {
      const d = TT.world.pending;
      if (d) TT.decisions.resolve(TT.decisions.safeDefault(d));
    }
  };
})();
