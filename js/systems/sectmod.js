// Trạng thái tông theo từng thế giới (S4). world.fac.sx[idTông] = { nhan, chiso[7], chinhsach[5], gt[5], last }:
// khởi đầu copy từ D.SECTS (dữ liệu chung chỉ là giá trị khởi đầu). world.fac.sxRuler[vùng] = năm triều vùng đó đổi chủ.
// Thế giới cũ chưa có sx thì đọc ra giá trị khởi đầu; trường mới khởi tạo muộn, không đổi TT.VERSION.
//
// QUY TẮC (S mục 15.2): các hàm ĐỌC (peek, view, powerShift, unityMul, wealthTrend, milMul, warMul, allyCut, recruitMul) không gọi rng
// và không khởi tạo gì. S, rulerChanged, yearly, purge là hàm GHI: không dùng rng; thanh trừng dùng băm (TT.nation.hn) thay rng.
// D.SECT_MOD.on = false: mọi hệ số trung tính (1 hoặc 0), yearly không làm gì, nên thế giới trùng khít đường cơ sở trước S4.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, K = D.SECT_MOD;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const hn = function () { return TT.nation.hn.apply(null, arguments); };
  const yearNow = () => Math.floor(TT.world.months / 12);
  const POL = D.SECT_POLICY.keys, ON = D.SECT_STATS.keys.indexOf('on'), TTI = D.SECT_STATS.keys.indexOf('tt'), QS = D.SECT_STATS.keys.indexOf('qs');
  const alignOf = n => (n >= D.SECT_NHAN.chinh ? 'chinh' : n <= D.SECT_NHAN.ta ? 'ta' : 'trung');
  const ALIGN_NAME = { chinh: 'chính đạo', ta: 'tà đạo', trung: 'trung lập' };
  // Hệ số từ một bảng theo chính sách (không có thì 1), kẹp trong cap.
  const mulOf = (tbl, v, cap) => (tbl[v] == null ? 1 : clamp(tbl[v], cap[0], cap[1]));

  const sm = TT.sectmod = {
    // ---------- đọc (không rng, không khởi tạo) ----------
    peek(id) { const f = TT.world && TT.world.fac; return (f && f.sx && f.sx[id]) || null; },
    // Giá trị hiện có của tông trong thế giới đang chạy. Mảng là tham chiếu: người gọi không được sửa.
    view(id) {
      const s = sm.peek(id), d = D.SECTS[id];
      return s ? { nhan: s.nhan, chiso: s.chiso, chinhsach: s.chinhsach, gt: s.gt, last: s.last, init: true }
        : { nhan: d.nhan, chiso: d.chiso, chinhsach: d.chinhsach, gt: d.gt, last: 0, init: false };
    },
    // Chính sách đang có của tông (chuỗi khóa, ví dụ 'tap_quyen').
    policy(id, key) { return sm.view(id).chinhsach[POL.indexOf(key)]; },

    // ---------- ghi ----------
    // Bản ghi của tông trong thế giới đang chạy; chưa có thì copy từ giá trị khởi đầu (không rng).
    S(id) {
      const f = TT.fac.S(); if (!f.sx) f.sx = {};
      let s = f.sx[id];
      if (!s) { const d = D.SECTS[id]; s = f.sx[id] = { nhan: d.nhan, chiso: d.chiso.slice(), chinhsach: d.chinhsach.slice(), gt: d.gt.slice(), last: 0 }; }
      return s;
    },
    // Triều vùng đổi chủ: các tông trong vùng đó nhớ năm (cho thanh trừng).
    rulerChanged(x) {
      if (!K.on || !x) return;
      const f = TT.fac.S(); if (!f.sxRuler) f.sxRuler = {};
      f.sxRuler[x.region] = yearNow();
    },

    // ---------- sức mạnh, của cải, quân sự, đối ngoại, nhân tài (đọc) ----------
    // Độ lệch mục tiêu `power` của tông theo trung bình bảy chỉ số (đã bù bằng statMid).
    powerShift(x) {
      if (!K.on || !x || x.kind !== 'tong') return 0;
      const c = sm.view(x.id).chiso; let s = 0; for (let i = 0; i < c.length; i++) s += c[i];
      return K.power.kStat * (s / c.length - K.power.statMid);
    },
    // Biến động ngẫu nhiên của đoàn kết nhân theo thể chế.
    unityMul(x) { return !K.on || !x || x.kind !== 'tong' ? 1 : mulOf(K.theche, sm.policy(x.id, 'theche'), K.cap.mul); },
    // Cộng vào của cải mỗi năm theo kinh tế.
    wealthTrend(x) {
      if (!K.on || !x || x.kind !== 'tong') return 0;
      const t = K.kinhte[sm.policy(x.id, 'kinhte')];
      return t == null ? 0 : clamp(t, -K.cap.drift, K.cap.drift);
    },
    // Nhân sức mạnh khi đánh nhau: chính sách quân sự nhân thêm quân sự (chỉ số), có trần.
    milMul(x) {
      if (!K.on || !x || x.kind !== 'tong') return 1;
      const v = sm.view(x.id), pol = mulOf(K.quansu, sm.policy(x.id, 'quansu'), K.cap.mul);
      return clamp(pol * (1 + K.qsK * (v.chiso[QS] - 50) / 50), K.cap.mil[0], K.cap.mil[1]);
    },
    // Nhân xác suất gây chiến theo đối ngoại.
    warMul(x) { return !K.on || !x || x.kind !== 'tong' ? 1 : mulOf(K.doingoai, sm.policy(x.id, 'doingoai'), K.cap.mul); },
    // Hạ ngưỡng thân thiết để kết minh (âm nghĩa là nâng).
    allyCut(x) {
      if (!K.on || !x || x.kind !== 'tong') return 0;
      const t = K.doingoaiMinh[sm.policy(x.id, 'doingoai')];
      return t == null ? 0 : clamp(t, -K.cap.ally, K.cap.ally);
    },
    // Nhân xác suất đệ tử NPC xin gia nhập theo nhân tài.
    recruitMul(id) { return !K.on || !D.SECTS[id] ? 1 : mulOf(K.nhantai, sm.policy(id, 'nhantai'), K.cap.mul); },

    // ---------- hằng năm ----------
    // Gọi một lần mỗi năm (factions.yearly, sau quốc vận): chỉ số kéo về mức khởi đầu, rồi xét thanh trừng.
    yearly() {
      if (!K.on) return;
      const yn = yearNow();
      TT.fac.list('tong').forEach(x => {
        if (!TT.fac.alive(x)) return;
        const s = sm.S(x.id), base = D.SECTS[x.id].chiso, P = K.stat;
        s.chiso.forEach((v, i) => {
          const target = i === ON ? base[i] + P.onUnity * (x.unity - 60) : base[i];
          s.chiso[i] = clamp(v + (target - v) * P.pull, 0, 100);
        });
        if (sm.purgeDue(x, s, yn)) sm.purge(x, s, yn);
      });
    },
    // Có đến lúc thanh trừng không: đủ năm từ lần trước (băm trong [cdMin, cdMax]) và một trong hai điều kiện, đều xác định theo băm.
    purgeDue(x, s, yn) {
      const P = K.purge, cd = P.cdMin + Math.floor(hn('ttcd', x.id, s.last) * (P.cdMax - P.cdMin + 1));
      if (yn - s.last < cd) return false;
      const ry = TT.fac.S().sxRuler, rr = ry && ry[x.region];
      if (rr != null && yn - rr <= P.rulerYears && hn('ttr', x.id, yn) < P.rulerChance) return true;
      return s.chiso[ON] < P.onBelow && hn('ttp', x.id, yn) < P.chance;
    },
    // Thanh trừng: đổi giá trị, nhãn, chính sách, đoàn kết, sức mạnh; trục đệ tử NPC; ghi sử ký (kèm tin), sổ ân oán.
    purge(x, s, yn) {
      const P = K.purge, id = x.id, pl = TT.player();
      const oldAlign = alignOf(s.nhan);
      s.last = yn;
      s.gt[0] = clamp(s.gt[0] + P.gtTu, -100, 100); s.gt[1] = clamp(s.gt[1] + P.gtCa, -100, 100);
      s.nhan = clamp(s.nhan - (P.nhanCut[0] + Math.floor(hn('ttn', id, yn) * (P.nhanCut[1] - P.nhanCut[0] + 1))), -100, 100);
      s.chinhsach[POL.indexOf('theche')] = 'tap_quyen';
      s.chiso[ON] = clamp(s.chiso[ON] + P.onGain, 0, 100); s.chiso[TTI] = clamp(s.chiso[TTI] + P.ttGain, 0, 100);
      x.unity = clamp(x.unity - P.unityHit, 5, 100); x.power = clamp(x.power - P.powerCut, 1, 100);
      const newAlign = alignOf(s.nhan);
      if (x.tag !== newAlign) x.tag = newAlign;
      const npcs = TT.sect.members(id).filter(c => c.kind !== 'player' && c.sect.rank < 3);
      const kill = Math.min(npcs.length, P.kill[0] + Math.floor(hn('ttk', id, yn) * (P.kill[1] - P.kill[0] + 1)));
      npcs.slice(0, kill).forEach(c => TT.sect.leave(c, 'bị thanh trừng nội bộ'));
      let text = x.n + ' nổi lên đợt thanh trừng nội bộ: ' + (kill ? kill + ' đệ tử bị trục khỏi môn, ' : '') + 'thể chế chuyển sang tập quyền, lòng người ly tán.';
      if (newAlign !== oldAlign) text += ' Danh tiếng từ ' + ALIGN_NAME[oldAlign] + ' nghiêng sang ' + ALIGN_NAME[newAlign] + '.';
      // sổ ân oán: ghi với thế lực có quan hệ xấu nhất (kẻ có thể lợi dụng nội loạn)
      let rival = null, worst = 1e9;
      TT.fac.list().forEach(y => { if (y === x || y.kind === 'hoi' || !TT.fac.alive(y)) return; const t = TT.diplo.total(x, y); if (t < worst) { worst = t; rival = y; } });
      if (rival) TT.diplo.log(x, rival, 'thanh_trung', 0, text);
      TT.fac.chron(text, 'bad', true);
      if (pl && pl.sect && pl.sect.id === id) TT.log(pl, text, 'bad');
      return { kill, from: oldAlign, to: newAlign };
    }
  };
})();
