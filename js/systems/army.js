// Quân lực của chín vương triều (S6a): quân số theo dân và kho, phẩm, sát khí, tướng, quân trận, và bảng lính tương đương tu sĩ.
// Lưu ở world.fac.nat[id triều].army = { sat, tr, trN, tuongTu }, khởi tạo muộn trong yearly (không đổi TT.VERSION; thế giới cũ không có thì mặc định).
//
// QUY TẮC (S mục 15.2): các hàm ĐỌC (on, peek, soldiers, phOf, tuongRank, cl, vsCultivator, stateOf, mul, describe, sig) không gọi rng
// và không khởi tạo dữ liệu. Hàm GHI (yearly, step, onWarEnd, onFall) cũng không gọi rng: sát khí, trận và tướng tu sĩ đều xác định theo số liệu có sẵn.
// D.ARMY.on = false (hoặc D.NATION.on = false) thì mọi hàm trả về trung tính, không ghi gì, và strength() như trước S6a (đường cơ sở trùng khít).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, K = D.ARMY;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const tierOf = (list, v) => list.find(t => v >= t.min) || list[list.length - 1];
  const regName = rid => (TT.map.region(rid) ? TT.map.region(rid).n : rid);
  const DEF = { sat: 0, tr: 0, trN: 0, tuongTu: false };
  const trieuOf = rid => TT.fac.list('trieu').find(t => t.region === rid) || null;

  const army = TT.army = {
    on() { return !!(K.on && D.NATION.on); },
    // Bản ghi quân lực hiện có (đọc, không tạo).
    peek(x) { const e = TT.nation.peek(x.id); return (e && e.army) || DEF; },
    trait(rid) { return K.trait[rid] || { n: '', desc: '', q: 1, ph: 1, sat: 1, tiep: 1, tran: 1 }; },

    // Quân số tổng theo dân (vạn) và kho; thời chiến tỉ lệ cao hơn.
    soldiers(x, war) {
      const g = TT.pop.get(x.region); if (!g) return 0;
      return g.n * 10000 * (war ? K.ratio.war : K.ratio.peace) * (K.kho[0] + K.kho[1] * x.wealth / 100) * this.trait(x.region).q;
    },
    // Phẩm quân: theo kho, nhân bản sắc vùng.
    phOf(x) { return tierOf(K.ph, x.wealth).v * this.trait(x.region).ph; },
    // Bậc tướng: theo tài người đứng đầu, tu sĩ Kim Đan trong vùng cộng thêm một bậc (tối đa Soái).
    tuongRank(x, tuongTu) {
      const r = tierOf(K.tuong, TT.nation.view(x).tai).v + (tuongTu ? 1 : 0);
      return Math.min(3, r);
    },
    // Chiến lực quân (CL) của một trạng thái: q x phẩm x trận x sát khí x quốc vận x tiếp tế x tướng.
    // arm = { q, ph, tr, sat, qv (quốc vận 0..100), tiep, tuong }.
    cl(arm) {
      return arm.q * arm.ph * (1 + 0.5 * arm.tr) * (1 + 0.3 * arm.sat / 100) * (0.7 + 0.6 * arm.qv / 100) * arm.tiep * (1 + K.tuongMul * arm.tuong);
    },
    // Quân lực có thắng một tu sĩ cảnh giới realm (0 đến 6) không: đủ chiến lực và đủ điều kiện (trận, tướng, sát khí). Hàm thuần, không rng.
    // Trả về { win, cl, need, ratio, why }; why là lý do thua điều kiện (chữ) khi win = false.
    vsCultivator(arm, realm) {
      const R = K.cult[clamp(realm | 0, 0, K.cult.length - 1)], c = this.cl(arm);
      const why = c < R.need ? 'chiến lực quân chưa đủ'
        : arm.tr < (R.tr || 0) ? 'thiếu quân trận'
        : arm.tuong < (R.tuong || 0) ? 'thiếu tướng'
        : arm.sat < (R.sat || 0) ? 'sát khí chưa đủ'
        : null;
      return { win: !why, cl: c, need: R.need, ratio: R.need > 0 && isFinite(R.need) ? c / R.need : 0, why };
    },
    // Trạng thái quân của một vương triều đang chạy (đọc): số lính ra trận q, chiến lực cl, và các bậc.
    stateOf(x) {
      const A = this.peek(x), v = TT.nation.view(x);
      const war = !!x.war, tuong = this.tuongRank(x, A.tuongTu), tiep = (0.7 + 0.3 * x.wealth / 100) * this.trait(x.region).tiep;
      const total = this.soldiers(x, war);
      const q = Math.min(total * (war ? K.field.war : K.field.peace), K.fieldMax);
      const arm = { q, ph: this.phOf(x), tr: A.tr, sat: A.sat, qv: v.van, tiep, tuong };
      return { x, war, total, q, arm, cl: this.cl(arm), tuong, tuongTu: A.tuongTu, tr: A.tr, sat: A.sat };
    },
    // Hệ số nhân sức mạnh của triều trong strength(): phẩm, trận, sát khí, quốc vận và tướng (quân số đã nằm trong milMul của dân).
    mul(x) {
      if (!this.on() || x.kind !== 'trieu') return 1;
      const A = this.peek(x), v = TT.nation.view(x);
      const tiep = (0.7 + 0.3 * x.wealth / 100) * this.trait(x.region).tiep, tuong = this.tuongRank(x, A.tuongTu);
      return clamp(this.phOf(x) * (1 + 0.5 * A.tr) * (1 + 0.3 * A.sat / 100) * (0.7 + 0.6 * v.van / 100) * tiep * (1 + K.tuongMul * tuong) / K.ref * TT.court.levyMul(x), 0.4, 1.6); // trưng binh chư hầu (S7)
    },
    // Mô tả cho giao diện: chỉ chữ và bậc, không số.
    describe(x) {
      const s = this.stateOf(x), t = s.tr > 0 ? K.tran[s.tr - 1].n : 'chưa lập trận';
      return {
        bac: tierOf(K.bac, s.total * this.phOf(x)).n,
        ph: tierOf(K.ph, x.wealth).n,
        tuong: K.tuongName[s.tuong] + (s.tuongTu ? ', có tu sĩ cung phụng' : ''),
        tran: t,
        sat: tierOf(K.satWord, s.sat).n,
        trait: this.trait(x.region).n
      };
    },
    // Chuỗi tóm tắt cho khóa làm mới giao diện.
    sig() { return TT.fac.list('trieu').map(x => { const d = this.describe(x); return d.bac + d.tran + d.tuong + d.sat; }).join('/'); },

    // ---------- ghi ----------
    // Bản ghi quân lực (tạo muộn khi cần).
    ent(x) { const e = TT.nation.ent(x); return e.army || (e.army = { sat: 0, tr: 0, trN: 0, tuongTu: false }); },
    // Một năm cho cả chín triều. Gọi sau TT.nation.yearly().
    yearly() {
      if (!this.on()) return;
      const cult = {}, chars = TT.world.chars || {};
      Object.keys(chars).forEach(id => { const c = chars[id]; if (c.kind === 'npc' && c.realm >= K.tuongRealm && c.region) cult[c.region] = true; });
      TT.fac.list('trieu').forEach(x => { if (TT.fac.alive(x)) this.step(x, !!cult[x.region] || TT.court.chieuDu(x)); });
    },
    step(x, tuongTu) {
      const e = TT.nation.ent(x), A = this.ent(x), T = K.tran, tr = this.trait(x.region);
      A.tuongTu = tuongTu;
      A.sat = clamp(A.sat + (x.war ? K.satWar * tr.sat : -K.satDecay), 0, 100);
      if (!x.war && A.tr < T.length) {
        const nx = T[A.tr], ok = A.sat >= nx.sat && e.van >= nx.van && x.wealth >= nx.kho;
        A.trN = ok ? A.trN + 1 : 0;
        if (A.trN >= Math.round(nx.years * tr.tran)) {
          A.tr++; A.trN = 0; x.wealth = clamp(x.wealth - nx.cost, 0, 100);
          const text = x.n + ' lập ' + nx.n + ' ở ' + regName(x.region) + '.', pl = TT.player();
          TT.nation.note(e, 'tran', text); TT.fac.chron(text, 'good', !!(pl && pl.region === x.region));
        }
      }
      if (A.tr > 0) x.wealth = clamp(x.wealth - T[A.tr - 1].upkeep, 0, 100); // trận hao kho mỗi năm
    },
    // Gọi từ endWar sau khi nước thắng và thua được xác định.
    onWarEnd(win, lose) {
      if (!this.on()) return;
      if (win.kind === 'trieu') { const A = this.ent(win); A.sat = clamp(A.sat + K.satWin, 0, 100); }
      if (lose.kind === 'trieu') { const A = this.ent(lose); A.sat = clamp(A.sat + K.satLose, 0, 100); }
    },
    // Gọi khi triều mất mệnh: sát khí giảm một nửa, trận mất một bậc (quân tan rã một phần).
    onFall(x, e) {
      if (!this.on() || !e.army) return;
      e.army.sat = Math.round(e.army.sat * K.fallSat); e.army.tr = Math.max(0, e.army.tr - 1); e.army.trN = 0;
    }
  };
})();
