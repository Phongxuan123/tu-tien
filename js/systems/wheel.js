// Vòng quay vận mệnh (Z "Đặc tả 8B", Q 7): quyết định người chơi không được chọn. Số = clamp(rng 0..100 + điểm yếu tố, 0, 100) rơi vào một vùng
// (xếp từ phù hợp ít đến nhiều). Đúng một yếu tố, điểm trong [−10, +15]. Quay lại tối đa 1 lần, tốn `gia` điểm khí vận (TT.kv.spend), không ở vùng cao
// nhất, không khi thiếu điểm; không bao giờ tự quay lại; vùng cao nhất mà không quay lại thì +1 khí vận. Hộp là w.pending { type: 'wheel' } thuần dữ liệu
// (lưu/tải giữa chừng được), hai giai đoạn: st 'wait' (chờ quay) rồi st 'done' (đã ra số: nhận hoặc quay lại). Hàm đọc không gọi rng.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data;
  const Z = () => D.STORY.wheel;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const sgn = v => (v > 0 ? '+' : '') + v;

  function specOf(arcId, chId, lcKey) {
    const arc = D.STORY.arcById[arcId], ch = arc && arc.chang[chId], lc = ch && ch.lc.find(x => x.key === lcKey);
    return lc && lc.wheel ? { arc, ch, lc, wh: lc.wheel } : null;
  }

  const wheel = TT.wheel = {
    // Vùng chứa số num (0..100): vùng i chứa [tổng w trước, tổng w trước + w), vùng cuối gồm cả 100.
    zoneAt(vung, num) {
      let acc = 0;
      for (let i = 0; i < vung.length; i++) { acc += vung[i].w; if (num < acc) return i; }
      return vung.length - 1;
    },

    // Điểm cộng của yếu tố: { pts (số nguyên trong [−10, tran]), why }. Đọc thuần.
    factor(c, wh, st) {
      const y = wh.yeu_to, N = TT.nature, K = Z(); let pts = 0, why = '';
      if (y.loai === 'nature') {
        const a = D.NATURE.axes.find(x => x.id === y.truc), v = N.get(c, y.truc);
        pts = 1.5 * v * y.huong; why = a.n + ' ' + sgn(Math.round(v * 10) / 10) + ', bạn ' + N.label(c, y.truc).toLowerCase();
      } else if (y.loai === 'rel') {
        const o = st && st.vai && TT.world.chars[st.vai[y.vai]], v = o ? TT.rel.v(c, o) : 0;
        pts = v >= 0 ? v * 0.15 : v * 0.10; why = o ? 'thiện cảm với ' + o.name + ' (' + TT.rel.label(c, o) + ')' : 'chưa có mối quan hệ nào';
      } else {
        if (y.chi_so === 'realm') { pts = c.realm * 3; why = 'cảnh giới ' + D.REALM_NAMES[c.realm]; }
        else if (y.chi_so === 'daoTam') { pts = (c.daoTam - 50) * 0.3; why = 'đạo tâm ' + Math.round(c.daoTam); }
        else { pts = TT.kv.pts(c) * 3; why = 'khí vận ' + TT.kv.pts(c) + ' điểm'; }
      }
      pts = clamp(Math.round(pts), K.min, Math.min(y.tran, K.max));
      return { pts, why };
    },

    // Còn quay lại được không (đọc thuần): { ok, why }.
    canReroll(c, d) {
      const spec = specOf(d.arc, d.ch, d.lc); if (!spec) return { ok: false, why: '' };
      if (d.rerolls >= 1) return { ok: false, why: 'Đã quay lại một lần rồi.' };
      if (d.zone === spec.wh.vung.length - 1) return { ok: false, why: 'Đã ở vùng phù hợp nhất, không cần quay lại.' };
      if (!TT.kv.can(c, spec.wh.gia)) return { ok: false, why: 'Cần ' + spec.wh.gia + ' điểm khí vận (bạn có ' + TT.kv.pts(c) + ').' };
      return { ok: true, why: '' };
    },

    // Dữ liệu hộp ở giai đoạn 'wait' hoặc 'done' (thuần dữ liệu).
    make(c, d0) {
      const spec = specOf(d0.arc, d0.ch, d0.lc), st = TT.story.stOf(c, d0.arc), wh = spec.wh;
      const d = Object.assign({ rerolls: 0, st: 'wait', roll: null, num: null, zone: null }, d0, { type: 'wheel', charId: c.id, tier: 2, timeout: 12 });
      delete d.rev;
      const f = wheel.factor(c, wh, st);
      d.mod = f.pts; d.modWhy = f.why; d.gia = wh.gia;
      d.zones = wh.vung.map(z => ({ w: z.w, n: z.n }));
      d.title = TT.story.fmt(c, st, spec.ch.t) + ': vòng quay vận mệnh';
      const K = TT.kv.pts(c);
      d.kvHave = K;
      if (d.st === 'wait') {
        d.text = 'Bạn đã chọn "' + TT.story.fmt(c, st, spec.lc.label) + '". Phần còn lại không do bạn quyết, số phận sẽ quay.\nYếu tố: ' + f.why + ' (' + sgn(f.pts) + ' điểm vào số quay).\nKhí vận của bạn: ' + K + ' điểm.';
        d.choices = [{ key: 'quay', label: 'Quay' }];
        d.def = 0;
      } else {
        const z = wh.vung[d.zone], rr = wheel.canReroll(c, d);
        d.text = 'Số quay: ' + d.num + ' (' + d.roll + ' ' + sgn(d.mod) + ' từ yếu tố) → "' + z.n + '".\nYếu tố: ' + f.why + ' (' + sgn(f.pts) + ' điểm).\nKhí vận của bạn: ' + K + ' điểm.' +
          (rr.ok ? '\nQuay lại sẽ tốn ' + wh.gia + ' trong ' + K + ' điểm khí vận. Số mới có thể thấp hơn, và không hoàn lại.' : '');
        d.choices = [
          { key: 'nhan', label: 'Nhận kết quả: ' + z.n },
          { key: 'lai', label: 'Quay lại (−' + wh.gia + ' khí vận)', disabled: !rr.ok, why: rr.why }
        ];
        d.def = 0;
      }
      return d;
    },

    // Bắt đầu vòng quay cho lựa chọn lcKey của chặng chId (hộp giai đoạn 'wait').
    begin(c, arcId, chId, lcKey) {
      if (!specOf(arcId, chId, lcKey)) return false;
      TT.decisions.request(wheel.make(c, { arc: arcId, ch: chId, lc: lcKey }));
      return true;
    },

    // Quay: số mới thay hẳn số cũ.
    spin(c, d) {
      const spec = specOf(d.arc, d.ch, d.lc), roll = TT.rng.RI(0, 100);
      const num = clamp(roll + d.mod, 0, 100), zone = wheel.zoneAt(spec.wh.vung, num);
      TT.log(c, 'Vòng quay: ' + num + ' → vùng "' + spec.wh.vung[zone].n + '" (yếu tố ' + d.modWhy + ', ' + sgn(d.mod) + ').', 'age');
      return { roll, num, zone };
    },

    // Chốt kết quả: +1 khí vận nếu trúng vùng cao nhất mà không quay lại, áp hiệu ứng vùng, sang chặng kế hoặc kết cục.
    resolve(c, d) {
      const spec = specOf(d.arc, d.ch, d.lc), z = spec.wh.vung[d.zone], st = TT.story.stOf(c, d.arc);
      if (d.zone === spec.wh.vung.length - 1 && d.rerolls === 0) TT.kv.add(c, Z().kvHigh, 'vòng quay vùng cao nhất');
      TT.log(c, '[' + spec.arc.n + '] ' + z.n + '.', 'big');
      st.log = st.log || []; st.log.push('Vòng quay ' + d.num + ': ' + z.n);
      TT.story.applyFx(c, st, z.fx, spec.arc.n);
      TT.story.go(c, spec.arc, z.toi);
    },

    // Handler của hộp 'wheel' (decisions.js): key quay | nhan | lai.
    act(c, d, key) {
      if (!specOf(d.arc, d.ch, d.lc)) return;
      if (d.st === 'wait') {
        const r = wheel.spin(c, d);
        return TT.decisions.request(wheel.make(c, Object.assign({}, d, r, { st: 'done', rerolls: 0 })));
      }
      if (key === 'lai') {
        const rr = wheel.canReroll(c, d), spec = specOf(d.arc, d.ch, d.lc);
        if (!rr.ok) return TT.decisions.request(wheel.make(c, d));
        TT.kv.spend(c, spec.wh.gia, 'quay lại vòng quay');
        const r = wheel.spin(c, d);
        return TT.decisions.request(wheel.make(c, Object.assign({}, d, r, { st: 'done', rerolls: d.rerolls + 1 })));
      }
      wheel.resolve(c, d);
    }
  };
})();
