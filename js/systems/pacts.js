// Hiệp ước giữa các thế lực (F2): cống nạp của tông cho vương triều, thuế của gia tộc, chư hầu của bên thua trận, minh ước (theo đồng minh), bảo hộ.
// world.fac.pacts = [{ id, kind, a (bên gánh), b (bên hưởng), rate, since, until, strain (oán 0-100), defy }]. world.fac.rifts = các mối đoạn tuyệt gần đây (kéo theo chiến tranh).
// Mỗi năm bên gánh trả "điểm kho" = rate x D.PACT.base; thiếu thì oán tăng, oán cao thì bất tuân rồi đoạn tuyệt, sinh lý do chiến tranh.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, K = D.PACT;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const pact = TT.pact = {
    S() {
      const f = TT.fac.S();
      if (!f.pacts) { f.pacts = []; f.pid = 1; f.rifts = []; pact.seed(f); }
      if (!f.rifts) f.rifts = [];
      return f.pacts;
    },
    add(kind, a, b, o) {
      const f = TT.fac.S(); o = o || {};
      if (f.pacts.some(p => p.kind === kind && p.a === a && p.b === b)) return null;
      const p = { id: f.pid++, kind, a, b, rate: o.rate || 0.05, since: TT.world.months, until: o.until || 0, strain: o.strain != null ? o.strain : 8, defy: false };
      f.pacts.push(p); return p;
    },
    congRate: (a, b) => clamp(0.03 + 0.10 * (b.power - a.power) / 100, 0.02, 0.15),
    // Dựng hiệp ước ban đầu cho thế giới (và cho thế giới cũ lần đầu chạy qua).
    seed(f) {
      const trieu = r => TT.fac.list('trieu').find(t => t.region === r && TT.fac.alive(t));
      TT.fac.list('tong').filter(TT.fac.alive).forEach(t => { const tr = trieu(t.region); if (tr) pact.add('cong', t.id, tr.id, { rate: pact.congRate(t, tr), strain: rng.RI(4, 18) }); });
      TT.fac.list('gia').filter(TT.fac.alive).forEach(g => { const tr = trieu(g.region); if (tr) pact.add('thue', g.id, tr.id, { rate: K.thueRate, strain: rng.RI(4, 14) }); });
      TT.fac.list().filter(TT.fac.alive).forEach(x => {
        if (x.vassal) { const w = TT.fac.get(x.vassal); if (w && TT.fac.alive(w)) pact.add('chu_hau', x.id, w.id, { rate: K.chuHauRate, until: TT.world.months + rng.RI(K.chuHauYears[0], K.chuHauYears[1]) * 12 }); }
      });
    },
    // Chư hầu thật khi thua trận (gọi từ endWar).
    vassalize(lose, win) {
      pact.S();
      const p = pact.add('chu_hau', lose.id, win.id, { rate: K.chuHauRate, strain: 15, until: TT.world.months + rng.RI(K.chuHauYears[0], K.chuHauYears[1]) * 12 });
      if (p) TT.fac.relAdd(lose, win, -5, ['than_phuc', lose.n + ' thần phục ' + win.n]);
    },
    // Minh ước theo đồng minh (ally) hiện có.
    sync(f) {
      const L = TT.fac.list().filter(TT.fac.alive), seen = {};
      L.forEach(a => (a.ally || []).forEach(id => {
        const b = TT.fac.get(id); if (!b || !TT.fac.alive(b)) return;
        const lo = a.id < b.id ? a : b, hi = lo === a ? b : a, k = lo.id + '|' + hi.id; if (seen[k]) return; seen[k] = 1;
        pact.add('minh_uoc', lo.id, hi.id, { rate: 0 });
      }));
      f.pacts = f.pacts.filter(p => p.kind !== 'minh_uoc' || seen[p.a + '|' + p.b]);
      f.pacts.forEach(p => { if (p.kind === 'minh_uoc') { const a = TT.fac.get(p.a), b = TT.fac.get(p.b); p.strain = clamp(60 - TT.fac.relV(a, b), 0, 100); } });
    },
    // Xác suất đồng minh x ra tay giúp a khi a lâm chiến: oán thấp thì giúp.
    helpP(xId, aId) {
      const L = pact.S(), same = q => (q.a === xId && q.b === aId) || (q.a === aId && q.b === xId);
      const p = L.find(q => q.kind === 'minh_uoc' && same(q));
      const hon = L.some(q => q.kind === 'hon_uoc' && same(q)) ? 0.08 : 0; // thông gia khiến đồng minh giúp thêm một chút (S7)
      return (p ? clamp(0.85 - p.strain / 160, 0.25, 0.9) : 0.6) + hon;
    },
    // Mối đoạn tuyệt gần đây giữa hai thế lực (cả hai chiều); trả về { m } hoặc null.
    rift(a, b) {
      const f = TT.fac.S(), w = TT.world; if (!f.rifts) return null;
      return f.rifts.find(r => ((r.a === a.id && r.b === b.id) || (r.a === b.id && r.b === a.id)) && w.months - r.m <= 72) || null;
    },
    warBoost(a, b) { return pact.rift(a, b) ? 2.2 : 1; },

    // Một năm: trả, thiếu, oán, bất tuân, đoạn tuyệt, hết hạn.
    yearly() {
      pact.S(); const f = TT.fac.S(), w = TT.world, B = K.base;
      pact.sync(f);
      f.rifts = f.rifts.filter(r => w.months - r.m <= 72);
      f.pacts = f.pacts.filter(p => {
        const a = TT.fac.get(p.a), b = TT.fac.get(p.b);
        if (!a || !b || !TT.fac.alive(a) || !TT.fac.alive(b)) { if (p.kind === 'chu_hau' && a && TT.fac.alive(a)) a.vassal = null; return false; }
        if (p.kind === 'minh_uoc') return true;
        if (p.until && w.months >= p.until) { // hết hạn: chư hầu tự chủ
          if (p.kind === 'chu_hau') { a.vassal = null; TT.fac.chron(a.n + ' thoát khỏi vòng thần phục ' + b.n + ', tự chủ trở lại.', 'age'); }
          return false;
        }
        const base = p.rate * B, want = p.defy ? 0 : base;
        const paid = Math.min(want, Math.max(0, a.wealth - 8));
        a.wealth = clamp(a.wealth - paid, 0, 100); b.wealth = clamp(b.wealth + paid * 0.8, 0, 100);
        if (D.COURT.on && p.kind !== 'minh_uoc' && p.kind !== 'hon_uoc') p.owed = (p.owed || 0) * 0.85 + Math.max(0, base - paid); // nợ cống còn lại, giảm dần (S7: nhiệm vụ đòi nợ)
        if (p.defy) p.strain = Math.min(100, p.strain + 4);
        else if (base - paid > 0.3 * base) p.strain = Math.min(100, p.strain + 6 + 6 * (base - paid) / base);
        else p.strain = Math.max(0, p.strain - 3);
        // bên hưởng có bổn phận bảo vệ khi bên gánh đang có chiến sự
        if (!p.defy && (p.kind === 'cong' || p.kind === 'bao_ho') && a.war && b.power > a.power && rng.P(0.4)) { // b bỏ mặc
          p.strain = Math.min(100, p.strain + 5); TT.fac.relAdd(a, b, -3, ['bo_mac', b.n + ' bỏ mặc ' + a.n + ' lúc lâm chiến']);
        } else if (!p.defy && (p.kind === 'cong' || p.kind === 'bao_ho') && a.war && b.power > a.power) a.power = clamp(a.power + 1.5, 1, 100);
        // gánh nặng: kho thấp và còn nộp thì thêm oán; chư hầu lâu năm cũng oán
        if (p.kind === 'chu_hau') p.strain = Math.min(100, p.strain + 2);
        if (!p.defy && p.strain >= K.defy) {
          p.defy = true; TT.diplo.log(a, b, 'bat_tuan', 0, a.n + ' ngừng ' + K.kinds[p.kind].what.replace(/ cho$/, '') + ' ' + b.n);
          TT.fac.chron(a.n + ' ngừng ' + K.kinds[p.kind].what.replace(/ cho$/, '') + ' ' + b.n + ', bất tuân hiệp ước.', 'bad');
        }
        if (p.defy && b.power > a.power * 1.1 && rng.P(0.25)) { // bên hưởng trừng phạt
          a.wealth = clamp(a.wealth - 5, 0, 100); a.power = clamp(a.power - 2, 1, 100); TT.fac.relAdd(a, b, -8, ['trung_phat', b.n + ' trừng phạt ' + a.n + ' vì bất tuân']);
          if (rng.P(0.4)) TT.fac.chron(b.n + ' trừng phạt ' + a.n + ' vì bất tuân.', 'war');
        }
        if (p.strain >= K.break) { // đoạn tuyệt
          f.rifts.push({ a: p.a, b: p.b, m: w.months, kind: p.kind });
          TT.fac.relAdd(a, b, -40, ['doan_tuyet', a.n + ' đoạn tuyệt với ' + b.n + ' (hiệp ước ' + K.kinds[p.kind].n.toLowerCase() + ' tan vỡ)']);
          if (p.kind === 'chu_hau') a.vassal = null;
          TT.fac.chron(a.n + ' đoạn tuyệt với ' + b.n + ', hiệp ước ' + K.kinds[p.kind].n.toLowerCase() + ' tan vỡ.', 'bad');
          return false;
        }
        return true;
      });
      // thế lực rất yếu nhờ che chở: gia nhập bảo hộ của thế lực mạnh cùng loại trong vùng
      TT.fac.list('tong').filter(t => TT.fac.alive(t) && t.power < 24 && !f.pacts.some(p => p.kind === 'bao_ho' && p.a === t.id)).forEach(t => {
        if (!rng.P(0.08)) return;
        const s = TT.fac.list('tong').filter(x => x !== t && TT.fac.alive(x) && x.region === t.region && x.power > 55 && TT.fac.relV(t, x) > -10)[0];
        if (s && pact.add('bao_ho', t.id, s.id, { rate: 0.1 })) TT.fac.chron(t.n + ' xin ' + s.n + ' che chở và chịu nộp phí bảo hộ.', 'age');
      });
    },

    // ---------- đọc cho giao diện ----------
    name: p => { const a = TT.fac.get(p.a), b = TT.fac.get(p.b); return K.kinds[p.kind].n + ': ' + (a ? a.n : '?') + ' ' + (p.kind === 'minh_uoc' ? 'và' : '→') + ' ' + (b ? b.n : '?'); },
    // Hiệp ước liên quan đến một thế lực.
    of(id) { pact.S(); return TT.fac.S().pacts.filter(p => p.a === id || p.b === id); },
    // Hiệp ước của một vùng (triều và các bên trong vùng).
    inRegion(rid) {
      pact.S(); return TT.fac.S().pacts.filter(p => { const a = TT.fac.get(p.a), b = TT.fac.get(p.b); return (a && a.region === rid) || (b && b.region === rid); });
    },
    mood: p => (p.defy ? 'bất tuân' : p.strain >= 40 ? 'căng thẳng' : p.strain >= 20 ? 'có oán' : 'êm thấm')
  };
})();
