// Chiến tranh tổng (S6b): nhiều phe, nhiều chiến tuyến, 10 đến 18 năm, có giai đoạn và điều kiện kết. Xem ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 5.6 và 15.18.
// Lưu ở world.fac.tw (đang diễn ra, null nếu không có), world.fac.twAt (tháng mở gần nhất), world.fac.twN (số lần đã mở), world.fac.twLast (kết cục gần nhất).
// Chiến tranh tổng KHÔNG gọi startWar nên không tính vào chỉ tiêu 52 chiến tranh mỗi 300 năm (đo riêng trong tools/baseline.js).
//
// QUY TẮC (S mục 15.2): các hàm ĐỌC (on, cur, phaseOf, frontRegions, parts, names, fronts) không gọi rng và không khởi tạo gì (không gọi TT.fac.S() vì có thể dựng thế giới).
// Hàm GHI (yearly, maybeOpen, start, tick, settle) chỉ dùng rng khi mở, khi đổi giai đoạn và khi kết thúc; D.TOTALWAR.on = false thì yearly không làm gì và không gọi rng.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, K = D.TOTALWAR;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const regName = rid => (TT.map.region(rid) ? TT.map.region(rid).n : rid);
  const KIND_OF_END = { het_suc: 'hai bên đều hết sức', thien_menh: 'một trụ cột mất mệnh trời', het_thoi_gian: 'đã đủ năm tháng', mot_phe_thang: 'một bên đã thắng thế rõ' };

  const totalwar = TT.totalwar = {
    on() { return !!K.on; },
    // Chiến tranh tổng đang diễn ra (đọc): null nếu tắt hoặc không có.
    cur() { const f = TT.world && TT.world.fac; return (K.on && f && f.tw) || null; },
    // Giai đoạn theo số năm đã trôi qua (đọc): bùng nổ, giằng co, kiệt sức, nghị hòa.
    phaseOf(tw) {
      const P = K.phases, y = tw.years;
      return y <= P.bung ? 'bung_no' : y <= tw.dur - P.kiet - P.nghi ? 'giang_co' : y <= tw.dur - P.nghi ? 'kiet_suc' : 'nghi_hoa';
    },
    // Chiến tuyến của chiến tranh tổng được cộng vào frontRegions (chiến sự ở vùng, dân số, quốc vận, giá cả đều dùng chung).
    frontRegions(out) { const tw = this.cur(); if (tw) tw.fronts.forEach(rid => { out[rid] = (out[rid] || 0) + 1; }); return out; },
    // Các bên còn sống (đọc).
    parts(tw) { return Object.keys(tw.side).map(id => TT.fac.get(id)).filter(x => x && TT.fac.alive(x)); },
    names(tw, side) {
      const L = this.parts(tw).filter(x => tw.side[x.id] === side).sort((p, q) => q.power - p.power).map(x => x.n);
      return L.slice(0, 3).join(', ') + (L.length > 3 ? ' cùng ' + (L.length - 3) + ' bên khác' : '');
    },
    fronts(tw) { return tw.fronts.map(regName).join(', '); },

    // Một năm: đang có chiến tranh thì tiến một năm; chưa có thì xem có mở không. Gọi trong fac.yearly sau tickWars và declareWars.
    yearly() {
      if (!K.on) return;
      const f = TT.fac.S();
      if (f.tw) this.tick(f, f.tw); else this.maybeOpen(f);
    },
    // Điều kiện mở: đủ số triều có quốc vận suy cùng lúc, chỉ mở lại sau gapYears (chỉ tiêu 150 năm).
    maybeOpen(f) {
      const O = K.open, w = TT.world;
      if (f.twAt != null && w.months - f.twAt < O.gapYears * 12) return;
      const weak = TT.fac.list('trieu').filter(x => TT.fac.alive(x) && TT.nation.view(x).van < O.weakVan).length;
      if (weak < O.weakCount) return;
      if (rng.P(O.chance * (O.eraMul[f.era.id] || 1) * (1 + 0.5 * (weak - O.weakCount)))) this.start({ auto: true });
    },

    // Mở chiến tranh tổng. opts: { force (bỏ chỉ tiêu 150 năm, dùng cho Q), name, reason, anchors: [id, id] (hai bên chính), auto }.
    // Trả về bản ghi chiến tranh, hoặc null nếu tắt, đang có chiến tranh, chưa đủ bên, hoặc chưa đủ năm kể từ lần trước.
    start(opts) {
      opts = opts || {};
      if (!K.on) return null;
      const f = TT.fac.S(), w = TT.world;
      if (f.tw) return null;
      if (!opts.force && f.twAt != null && w.months - f.twAt < K.open.gapYears * 12) return null;
      const L = TT.fac.list().filter(x => (x.kind === 'trieu' || x.kind === 'tong') && TT.fac.alive(x) && !x.war);
      if (L.length < K.sides.min) return null;
      const bySt = L.slice().sort((p, q) => q.power - p.power || (p.id < q.id ? -1 : 1));
      let a = opts.anchors && TT.fac.get(opts.anchors[0]), b = opts.anchors && TT.fac.get(opts.anchors[1]);
      if (!a || !b || a === b || L.indexOf(a) < 0 || L.indexOf(b) < 0) { // hai bên chính: mạnh nhất, và kẻ thù nhất với nó trong tám bên kế
        a = bySt[0]; b = bySt.slice(1, 9).sort((p, q) => TT.fac.relV(a, p) - TT.fac.relV(a, q))[0];
      }
      // Các bên khác buộc chọn phe theo quan hệ với hai bên chính (S1).
      const N = rng.RI(K.sides.min, K.sides.max), side = {};
      side[a.id] = 'a'; side[b.id] = 'b';
      bySt.filter(x => x !== a && x !== b).slice(0, N - 2).forEach(x => { side[x.id] = TT.fac.relV(x, a) >= TT.fac.relV(x, b) ? 'a' : 'b'; });
      // Chiến tuyến: vùng của các bên, xen kẽ hai phe, đủ số chiến tuyến.
      const parts = Object.keys(side).map(id => TT.fac.get(id)).sort((p, q) => q.power - p.power);
      const A = parts.filter(x => side[x.id] === 'a'), B = parts.filter(x => side[x.id] === 'b'), order = [];
      for (let i = 0; i < Math.max(A.length, B.length); i++) { if (A[i]) order.push(A[i]); if (B[i]) order.push(B[i]); }
      const nF = rng.RI(K.sides.fronts[0], K.sides.fronts[1]), fronts = [];
      order.forEach(x => { if (fronts.length < nF && fronts.indexOf(x.region) < 0) fronts.push(x.region); });
      while (fronts.length < nF) { const r = rng.pick(D.REGIONS).id; if (fronts.indexOf(r) < 0) fronts.push(r); }

      f.twN = (f.twN || 0) + 1;
      const tw = {
        id: f.twN, n: opts.name || rng.pick(K.names), start: w.months, dur: rng.RI(K.years[0], K.years[1]), years: 0, phase: 'bung_no',
        side, anchors: [a.id, b.id], fronts, score: 0, hurt: {}, pop0: {}, fall0: [a, b].map(x => { const e = TT.nation.peek(x.id); return e ? e.falls : 0; }),
        reason: opts.reason || rng.pick(K.reasons), auto: !!opts.auto
      };
      parts.forEach(x => { x.war = 'tw' + tw.id; });
      fronts.forEach(rid => { const g = TT.pop.get(rid); tw.pop0[rid] = g ? g.n : 0; TT.eco.raise('chien_tong', rid, 0); });
      f.tw = tw; f.twAt = w.months;
      TT.fac.relAdd(a, b, -25, ['chien', a.n + ' và ' + b.n + ' khai mở ' + tw.n]);
      TT.fac.chron(tw.n + ' bùng nổ: phe ' + this.names(tw, 'a') + ' đánh phe ' + this.names(tw, 'b') + ', chiến tuyến mở ở ' + this.fronts(tw) + '. Lý do: ' + tw.reason + '.', 'war');
      const pl = TT.player();
      if (pl && fronts.indexOf(pl.region) >= 0) TT.log(pl, 'Chiến tranh tổng ' + tw.n + ' nổ ra ngay nơi bạn đứng.', 'bad', 'Nguy hiểm, giá cả và triệu tập đều đổi trong nhiều năm tới.');
      return tw;
    },

    // Một năm của chiến tranh đang có: hao sức, dân chiến tuyến, điểm lệch, rồi kiểm tra điều kiện kết.
    tick(f, tw) {
      tw.years++;
      const ph = this.phaseOf(tw), wear = K.wear[ph], B = K.base, parts = this.parts(tw);
      parts.forEach(x => {
        const h = tw.hurt[x.id] || 0, dp = Math.min(B.power * wear * rng.R(0.7, 1.3), Math.max(0, K.cap.hurtPower - h));
        tw.hurt[x.id] = h + dp;
        x.power = clamp(x.power - dp, 1, 100);
        x.wealth = clamp(x.wealth - B.wealth * wear, 0, 100);
        x.unity = clamp(x.unity - B.unity * wear, 5, 100);
      });
      // dân vùng chiến tuyến: F4 đã tính hao vì chiến sự; ở đây chỉ chặn không cho giảm quá trần
      tw.fronts.forEach(rid => {
        const g = TT.pop.get(rid), floor = (tw.pop0[rid] || 0) * (1 - K.cap.pop);
        if (g && g.n < floor) g.n = floor;
        if (ph !== 'nghi_hoa') TT.eco.raise('chien_tong', rid, 0); // cú sốc giá, trong mười hai tháng mỗi năm
      });
      const sum = s => parts.filter(x => tw.side[x.id] === s).reduce((t, x) => t + TT.fac.strength(x, []), 0);
      const sA = sum('a'), sB = sum('b'), r = (sA - sB) / Math.max(1e-6, sA + sB);
      tw.score = clamp(tw.score * 0.75 + r * 0.25, -1, 1);

      // điều kiện kết: thiên mệnh (bên chính mất mệnh hoặc bị diệt), hết sức, một phe thắng, hết năm
      const fell = [0, 1].filter(i => { const x = TT.fac.get(tw.anchors[i]), e = TT.nation.peek(tw.anchors[i]); return !x || !TT.fac.alive(x) || (!!e && e.falls > tw.fall0[i]); });
      if (fell.length) return this.settle(f, tw, 'thien_menh', fell.length === 2 ? null : fell[0] === 0 ? 'b' : 'a');
      const avg = parts.reduce((t, x) => t + x.power, 0) / Math.max(1, parts.length);
      if ((ph === 'kiet_suc' || ph === 'nghi_hoa') && avg < K.exhaust) return this.settle(f, tw, 'het_suc', this.lean(tw));
      if (tw.years >= K.win.from && Math.abs(tw.score) >= K.win.score) return this.settle(f, tw, 'mot_phe_thang', tw.score > 0 ? 'a' : 'b');
      if (tw.years >= tw.dur) return this.settle(f, tw, 'het_thoi_gian', this.lean(tw));

      if (ph !== tw.phase) { tw.phase = ph; this.phaseNote(tw, ph); }
    },
    lean(tw) { return tw.score >= K.draw ? 'a' : tw.score <= -K.draw ? 'b' : null; },
    phaseNote(tw, ph) {
      const text = {
        giang_co: tw.n + ' bước vào giai đoạn giằng co: các chiến tuyến ở ' + this.fronts(tw) + ' chưa ngã ngũ.',
        kiet_suc: tw.n + ' kéo dài, lương thảo cạn, dân các vùng ' + this.fronts(tw) + ' khốn đốn.',
        nghi_hoa: tw.n + ' đến lúc nghị hòa: sứ giả qua lại, chiến sự tạm lắng.'
      }[ph];
      if (text) TT.fac.chron(text, ph === 'nghi_hoa' ? 'age' : 'war');
    },

    // Kết thúc: hòa (win = null) hoặc một bên thắng. Hậu quả có trần (K.cap), sát khí và phản phệ, quan hệ các bên.
    settle(f, tw, kind, win) {
      const cap = K.cap, parts = this.parts(tw), w = TT.world, pl = TT.player();
      let winBoss = win ? parts.filter(x => tw.side[x.id] === win).sort((p, q) => q.power - p.power)[0] : null;
      if (!winBoss) win = null;
      parts.forEach(x => { if (x.war === 'tw' + tw.id) x.war = null; });
      f.tw = null;
      f.twLast = { kind, win, n: tw.n, years: tw.years, at: w.months };
      const why = KIND_OF_END[kind];
      if (!win) {
        const p = TT.fac.get(tw.anchors[0]), q = TT.fac.get(tw.anchors[1]);
        if (p && q && TT.fac.alive(p) && TT.fac.alive(q)) TT.fac.relAdd(p, q, 15, ['hoa_nghi', 'Hòa nghị sau ' + tw.n]);
        TT.fac.chron(tw.n + ' khép lại bằng hòa nghị vì ' + why + '. Các phe lui binh, đất đai giữ nguyên.', 'good');
        if (pl && tw.fronts.indexOf(pl.region) >= 0) TT.log(pl, tw.n + ' khép lại bằng hòa nghị.', 'big');
        return;
      }
      const lose = parts.filter(x => tw.side[x.id] !== win).sort((p, q) => p.power - q.power);
      TT.fac.chron(tw.n + ' khép lại vì ' + why + ': phe ' + this.names(tw, win) + ' thắng, phe ' + this.names(tw, win === 'a' ? 'b' : 'a') + ' phải nhận thua.', 'bad');
      // diệt vong: tông yếu nhất của phe thua, có trần
      let nd = 0, ns = 0, nc = 0;
      lose.forEach(x => { if (x.kind === 'tong' && x.power < 25 && nd < cap.destroy) { nd++; TT.fac.destroy(x, winBoss, 'bị tiêu diệt trong ' + tw.n, false); } });
      // triều phe thua: triều mạnh nhất bị chia cắt, các triều còn lại đổi chủ, đều có trần
      lose.filter(x => x.kind === 'trieu' && TT.fac.alive(x)).sort((p, q) => q.power - p.power).forEach(x => {
        if (ns < cap.chiaCat) { ns++; this.split(tw, x); } else if (nc < cap.doiChu) { nc++; this.rulerChange(tw, x); }
      });
      // thắng thua: sát khí (S6a) và quan hệ
      winBoss.power = clamp(winBoss.power + 4, 1, 100); winBoss.wealth = clamp(winBoss.wealth + 6, 0, 100);
      lose.forEach(x => {
        if (!TT.fac.alive(x)) return;
        TT.fac.relAdd(winBoss, x, -10, ['thang', winBoss.n + ' thắng ' + x.n + ' trong ' + tw.n]);
        if (x.kind === 'trieu' && TT.army.on()) TT.army.onWarEnd(winBoss, x);
      });
      // phản phệ: triều có sát khí cao thì lòng dân chùng xuống, tông liên quan mất đoàn kết
      parts.forEach(x => {
        if (!TT.fac.alive(x)) return;
        if (x.kind === 'tong') { x.unity = clamp(x.unity - Math.min(cap.backlashUnity, 3), 5, 100); return; }
        if (x.kind !== 'trieu' || !TT.army.on()) return;
        const e = TT.nation.ent(x), A = TT.army.ent(x);
        if (A.sat < K.sat) return;
        e.van = clamp(e.van - Math.min(cap.backlashVan, 1 + (A.sat - K.sat) / 8), 0, 100); A.sat = Math.round(A.sat / 2);
        TT.nation.note(e, 'phan_phe', 'Sát khí trong ' + tw.n + ' phản lại, lòng dân chùng xuống.');
      });
      if (pl && tw.fronts.indexOf(pl.region) >= 0) TT.log(pl, tw.n + ' khép lại: phe ' + winBoss.n + ' thắng.', 'big');
    },
    // Chia cắt: một nửa giang sơn cát cứ tự xưng (cùng hệ số với mất mệnh chia cắt, S3).
    split(tw, x) {
      const M = D.NATION.mat, e = TT.nation.ent(x), g = TT.pop.get(x.region);
      x.power = clamp(x.power * M.cutPower, 1, 100); x.unity = Math.min(x.unity, M.cutUnity); x.wealth = clamp(x.wealth * M.cutWealth, 0, 100);
      if (g) g.mood = clamp(g.mood - M.cutMood, 0, 100);
      x.state = 'suy'; x.leader = TT.genName('nam'); x.leaderAge = 40;
      e.van = M.vanAfter.chia_cat;
      const text = x.n + ' bị chia cắt trong ' + tw.n + ': một nửa đất cát cứ tự xưng, ' + x.leader + ' giữ phần còn lại.';
      TT.nation.note(e, 'chia_cat', text); TT.fac.chron(text, 'bad');
      TT.sectmod.rulerChanged(x);
      TT.court.onRuler(x); // hoàng quyền về mức người mới (S7)
},
    // Đổi chủ: người đứng đầu bị phế, người mới lên thay (cùng hệ số với mất mệnh đổi chủ, S3).
    rulerChange(tw, x) {
      const M = D.NATION.mat, e = TT.nation.ent(x), old = x.leader;
      x.power = 35; x.unity = 40; x.state = 'suy'; x.leader = TT.genName('nam'); x.leaderAge = 40; x.tag = rng.pick(['chinh', 'trung', 'ta']);
      e.van = M.vanAfter.doi_chu;
      const text = x.n + ' thua trong ' + tw.n + ': ' + old + ' bị phế, ' + x.leader + ' lên thay.';
      TT.nation.note(e, 'doi_chu', text); TT.fac.chron(text, 'bad');
      TT.sectmod.rulerChanged(x);
      TT.court.onRuler(x); // hoàng quyền về mức người mới (S7)
}
  };
})();
