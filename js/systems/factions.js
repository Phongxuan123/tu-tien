// Thế giới tự vận động: vương triều, tông môn, gia tộc tu tiên, chiến tranh, diệt môn, tái lập, thời đại và sử ký.
// Mô phỏng cấp năm trên số liệu trừu tượng (world.fac), không động tới mô phỏng từng người; chỉ vùng đang có chiến sự mới ảnh hưởng
// tới NPC (hao hụt nhỏ có trần) và tới người chơi (nguy hiểm, giá cả, sự kiện, triệu tập).
// world.fac = { list: {id: thế lực}, wars: [...], era, nextEra, chron: [...], ruins: {địa điểm: tháng}, tempo, lastEnd }
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng;

  D.ERAS = {
    thinh: { n: 'Thịnh thế', war: 0.5, price: 0.95, train: 1, desc: 'Bốn bể yên bình, tông môn mở rộng, chiến tranh hiếm hoi, vật giá dịu đi.' },
    loan: { n: 'Loạn thế', war: 2.0, price: 1.15, train: 1, desc: 'Cát cứ nổi lên khắp nơi, chiến tranh liên miên, của cải và mạng người đều rẻ.' },
    linh_khi: { n: 'Linh khí phục hồi', war: 1, price: 1, train: 1.1, desc: 'Thiên địa linh khí dâng lên, ai tu luyện cũng thuận lợi hơn.' },
    mat_phap: { n: 'Mạt pháp', war: 1, price: 1.1, train: 0.92, desc: 'Linh khí cạn dần, tu hành khó hơn, linh thạch và đan dược thành thứ đáng giá.' }
  };
  D.FAC = {
    warMax: 3,            // số chiến tranh đồng thời tối đa (nhân thêm theo nhịp thế giới)
    warBase: 0.12,       // xác suất mỗi năm cho một thế lực có kẻ thù đủ hận
    eraYears: [80, 150],
    chronMax: 300,
    gia: 8,               // số gia tộc
    rebuildYears: [15, 40],
    frontDanger: 1,       // nguy hiểm cộng thêm ở vùng chiến tuyến
    frontGold: 0.85,      // hệ số kiếm tiền ở chiến tuyến
    frontPrice: 1.2,      // hệ số giá mua ở chiến tuyến
    npcWarDeath: 0.012    // xác suất tử trận mỗi năm của tu sĩ NPC ở vùng chiến tuyến (vùng đang mô phỏng)
  };
  // Thương hội: giàu, có ảnh hưởng chính trị, không có quân đội. Chi tiết ở ke-hoach/E-kinh-te.md mục 4.
  D.HOI = {
    start: [
      { n: 'Vạn Bảo Thương Hội', tag: 'trung', agenda: 'gan_trieu', reach: 6, home: 'trung_chau' },
      { n: 'Thanh Phong Hành', tag: 'chinh', agenda: 'tu_do', reach: 4 },
      { n: 'Hắc Kim Hội', tag: 'ta', agenda: 'cho_den', reach: 3 }
    ],
    agendaName: { gan_trieu: 'gắn bó vương triều', tu_do: 'tự do thương mại', truc_loi: 'trục lợi chiến tranh', cho_den: 'chợ đen' },
    guardMax: 30,        // hộ vệ đoàn tối đa (tông tới 100): không có quân đội
    powerMax: 30,        // "sức mạnh" hiển thị tối đa
    ownMax: 0.12,        // tỉ phần tự sản xuất tối đa
    reachMax: 7,
    rebuildYears: [12, 30]
  };
  const REASONS = {
    tong: ['tranh một mỏ linh thạch', 'một món nợ máu từ đời trước', 'tranh đoạt một bộ truyền thừa', 'chuyện đệ tử bị sát hại', 'tranh địa bàn thu nhận đệ tử'],
    trieu: ['tranh chấp biên giới', 'tranh quyền kế vị', 'đòi lại thành trì đã mất', 'cống phẩm bị từ chối'],
    gia: ['tranh giành địa bàn làm ăn', 'mối thù truyền kiếp', 'tranh một mạch linh điền']
  };
  const KIND_NAME = { trieu: 'Vương triều', tong: 'Tông môn', gia: 'Gia tộc', hoi: 'Thương hội' };

  const S0 = () => TT.world;
  const reg = rid => TT.map.region(rid);
  const regName = rid => (reg(rid) ? reg(rid).n : rid);
  const yearOf = m => Math.floor(m / 12) - TT.config.startYear + 1;
  const R2 = x => Math.round(x * 10) / 10;

  const fac = TT.fac = {
    KIND_NAME,
    S() { const w = S0(); if (!w.fac) fac.init(w); if (!w.fac.rel2) w.fac.rel2 = {}; return w.fac; }, // rel2: mạng quan hệ nhiều chiều (S1), khởi tạo muộn

    init(w) {
      const f = w.fac = { list: {}, wars: [], era: null, nextEra: null, chron: [], ruins: {}, tempo: 1, lastEnd: w.months, nextWar: 1, rel: {} };
      D.REGIONS.forEach(r => {
        const tag = rng.pick(['chinh', 'chinh', 'trung', 'trung', 'ta']);
        f.list['tr_' + r.id] = mk('tr_' + r.id, 'trieu', 'Vương triều ' + r.n, r.id, null, tag);
      });
      Object.keys(D.SECTS).forEach(id => {
        const d = D.SECTS[id]; f.list[id] = mk(id, 'tong', d.n, TT.sect.regionOf(id), id, d.align);
      });
      const used = {};
      for (let i = 0; i < D.FAC.gia; i++) {
        let s; do { s = rng.pick(D.SURNAMES); } while (used[s] && Object.keys(used).length < D.SURNAMES.length); used[s] = 1;
        const r = rng.pick(D.REGIONS), pl = TT.map.placesOf(r.id).filter(p => ['thon_tran', 'thanh_tri'].indexOf(p.type) >= 0);
        const home = (pl.length ? rng.pick(pl) : TT.map.placesOf(r.id)[0]).id;
        f.list['gt_' + i] = mk('gt_' + i, 'gia', s + ' gia', r.id, home, rng.pick(['chinh', 'trung', 'trung', 'ta']));
      }
      fac.seedHoi(f);
      rng.next(); rng.next(); rng.next(); f.tempo = R2(rng.R(0.6, 1.6)); // nhịp thế giới ngẫu nhiên: êm hay dữ dội tùy hạt giống
      const e = rng.wpick([['thinh', 4], ['loan', 2], ['linh_khi', 2], ['mat_phap', 2]], x => x[1])[0];
      f.era = { id: e, since: w.months, until: w.months + rng.RI(D.FAC.eraYears[0], D.FAC.eraYears[1]) * 12 };
      return f;
    },

    // ---------- truy cập ----------
    get: id => fac.S().list[id] || null,
    list(kind) { const L = fac.S().list; return Object.keys(L).map(k => L[k]).filter(x => !kind || x.kind === kind); },
    alive: f => f && f.state !== 'diệt',
    era() { return D.ERAS[fac.S().era.id]; },
    isRuin: pid => !!fac.S().ruins[pid],
    wars() { return fac.S().wars; },
    warOf(f) { return f.war ? fac.S().wars.find(w => w.id === f.war) : null; },
    sectFac: id => fac.get(id),

    // Tiền chiến tuyến: các vùng đang có chiến sự (chủ yếu vùng nhà của bên bị đánh).
    frontRegions() {
      const out = {};
      fac.S().wars.forEach(w => { out[w.front] = (out[w.front] || 0) + 1; });
      return TT.totalwar.frontRegions(out); // chiến tranh tổng thêm chiến tuyến (S6b)
    },
    atFront(rid) { return !!fac.frontRegions()[rid]; },
    dangerAt(rid) { return (fac.atFront(rid) ? D.FAC.frontDanger : 0) + (TT.pop.unrest(rid) ? 1 : 0) + TT.nation.danger(rid); },
    goldMul(rid) { return fac.atFront(rid) ? D.FAC.frontGold : 1; },
    priceMul(rid) { return (fac.atFront(rid) ? D.FAC.frontPrice : 1) * fac.era().price; },
    trainMul() { return fac.era().train; },
    // Thành viên tông môn đang có chiến tranh thì nhiệm vụ nhiều hơn.
    warBonus(c) { if (!c.sect) return 1; const f = fac.get(c.sect.id); return f && f.war ? 1.3 : 1; },

    // ---------- sử ký ----------
    chron(text, kind, news) {
      const f = fac.S(), w = S0();
      f.chron.push({ m: w.months, t: text, k: kind || '' });
      if (f.chron.length > D.FAC.chronMax) f.chron.splice(0, f.chron.length - D.FAC.chronMax);
      if (news !== false) TT.news(text, kind === 'bad' || kind === 'war' ? 'bad' : kind === 'good' ? 'good' : 'age', []);
      else if (TT.press) TT.press.emit(text, kind === 'bad' || kind === 'war' ? 'bad' : kind === 'good' ? 'good' : 'age', []);
    },

    rel(a, b) {
      const f = fac.S(), k = a.id < b.id ? a.id + '|' + b.id : b.id + '|' + a.id;
      if (f.rel == null) f.rel = {};
      if (f.rel[k] == null) {
        let v = rng.RI(-12, 12);
        if (a.region === b.region) v -= 6;
        if (a.tag === 'chinh' && b.tag === 'ta' || a.tag === 'ta' && b.tag === 'chinh') v -= 22;
        else if (a.tag === b.tag) v += 10;
        f.rel[k] = v;
      }
      return k;
    },
    relV(a, b) { fac.rel(a, b); return TT.diplo.total(a, b); }, // số tổng hợp các chiều (S1: bằng thiện cảm); fac.rel() giữ nguyên thứ tự dùng rng
    // why = [loại ân oán, lời] (tùy chọn): ghi vào sổ ân oán của cặp (TT.diplo.log), không đổi giá trị.
    relAdd(a, b, n, why) { const f = fac.S(), k = fac.rel(a, b); f.rel[k] = rng.clamp(f.rel[k] + n, -100, 100); if (why) TT.diplo.log(a, b, why[0], n, why[1]); },
    near(a, b) { return a.region === b.region || TT.map.macroNeighbors(a.region).some(n => n.to === b.region); },

    // ---------- một năm ----------
    yearly() {
      const f = fac.S(), w = S0();
      fac.tickEra();
      fac.ensureHoi();
      TT.pop.yearly(); // dân số, thiên tai, dân tâm (F4)
      TT.nation.yearly(); // quốc vận, nho khí, thiên mệnh của chín triều (S3)
      TT.army.yearly(); // quân số, sát khí, quân trận, tướng tu sĩ của chín triều (S6a)
      TT.sectmod.yearly(); // chỉ số tông, thanh trừng hiếm (S4)
      TT.faith.yearly(); // tín ngưỡng: ba ô mỗi vùng, giáo hội, quốc giáo, nơi thờ tự (S5)
      fac.list().forEach(x => { if (fac.alive(x)) { if (x.kind === 'hoi') fac.tickHoi(x); else fac.tickInternal(x); } else { fac.tickDead(x); if (x.kind === 'hoi') fac.rebuildHoi(x); } });
      f.shocks = (f.shocks || []).filter(s => s.until > w.months);
      fac.tickRelations();
      TT.pact.yearly(); // hiệp ước: trả, oán, đoạn tuyệt (F2)
      fac.tickWars();
      fac.declareWars();
      TT.totalwar.yearly(); // chiến tranh tổng: mở, hao sức, kết thúc (S6b)
      TT.court.yearly(); // triều chính và F2 phần sau: hoàng quyền, trưng binh, thông gia, thuế thương hội (S7)
      TT.inter.yearly(); // liên tông: tông ↔ triều, ước pháp, giải đấu, Thiên hạ công ước (S8)
      fac.rebuilds();
      fac.spawnClans();
      fac.npcCasualties();
      fac.playerHooks();
    },

    tickEra() {
      const f = fac.S(), w = S0();
      if (!f.nextEra && f.era.until - w.months <= 36) {
        const cur = f.era.id, opts = Object.keys(D.ERAS).filter(k => k !== cur);
        f.nextEra = rng.pick(opts);
        TT.news('Các nhà tinh tượng bàn tán: thiên địa sắp chuyển sang ' + D.ERAS[f.nextEra].n + '.', 'age', []);
      }
      if (w.months >= f.era.until) {
        const id = f.nextEra || rng.pick(Object.keys(D.ERAS).filter(k => k !== f.era.id));
        f.era = { id, since: w.months, until: w.months + Math.round(rng.RI(D.FAC.eraYears[0], D.FAC.eraYears[1]) / Math.max(0.6, f.tempo * 0.8 + 0.2)) * 12 };
        f.nextEra = null;
        fac.chron('Thiên địa đổi thay: bước vào ' + D.ERAS[id].n + '. ' + D.ERAS[id].desc, 'era');
        const pl = TT.player(), E = D.ERAS[id];
        if (pl) TT.log(pl, 'Thiên địa đổi thay: bước vào ' + E.n + '.', 'big', E.desc + ' Chiến tranh x' + E.war + ', vật giá x' + E.price + (E.train !== 1 ? ', tốc độ tu luyện x' + E.train : '') + '.');
      }
    },

    tickInternal(x) {
      const f = fac.S(), w = S0();
      x.leaderAge = (x.leaderAge || 40) + 1;
      // quyền lực hồi về mức trung bình, có nhiễu; chiến tranh và mất đoàn kết kéo xuống
      x.power = rng.clamp(x.power + (52 + TT.nation.powerShift(x) + TT.sectmod.powerShift(x) - x.power) * 0.04 + rng.R(-3.5, 3.5) + (x.unity - 50) * 0.02, 1, 100);
      x.unity = rng.clamp(x.unity + (60 - x.unity) * 0.06 + rng.R(-4, 4) * TT.sectmod.unityMul(x) + TT.faith.stab(x) + TT.court.tongDelta(x), 5, 100);
      x.wealth = rng.clamp(x.wealth + rng.R(-3, 3) + (x.power - 50) * 0.04 + TT.sectmod.wealthTrend(x), 0, 100);
      if (x.kind === 'trieu') TT.pop.taxPull(x); // thuế từ dân kéo kho triều
      if (x.kind === 'tong') TT.sect.resYearly(x); // linh mạch, mỏ, cống nạp kéo kho về mức của tông
      if (x.leaderAge >= 70 && rng.P((x.leaderAge - 68) * 0.04)) fac.succession(x, 'qua đời');
      else if (rng.P(0.012)) fac.succession(x, 'bị ám hại');
      x.state = x.power >= 66 ? 'thịnh' : x.power < 30 || x.unity < 25 ? 'suy' : 'ổn';
      if (x.kind === 'gia' && x.power < 8 && rng.P(0.4)) fac.destroy(x, null, 'suy tàn không người kế nghiệp');
    },
    tickDead(x) { x.deadYears = (x.deadYears || 0) + 1; },

    succession(x, how) {
      const old = x.leader; x.leader = TT.genName(rng.P(0.8) ? 'nam' : 'nu'); x.leaderAge = rng.RI(32, 55);
      x.unity = rng.clamp(x.unity - rng.RI(8, 20), 5, 100);
      if (x.kind === 'trieu' || x.power > 55 || rng.P(0.3)) fac.chron(x.n + ' ' + (how === 'qua đời' ? 'mất ' : 'bị mất ') + 'người đứng đầu (' + old + ' ' + how + '). ' + x.leader + ' lên thay, nội bộ chao đảo.', 'age');
      if (x.kind === 'trieu') TT.court.succeed(x); // thái tử, tranh ngôi, nội chiến nhỏ (S7)
    },

    tickRelations() {
      const L = fac.list().filter(fac.alive);
      L.forEach(a => {
        if (!rng.P(0.4)) return;
        const b = rng.pick(L); if (a === b || !fac.near(a, b)) return;
        let d = rng.RI(-5, 5) + (a.war || b.war ? 0 : 1) - (rng.P(0.03) ? rng.RI(12, 28) : 0); // thỉnh thoảng có xung đột nhỏ làm bạn thành thù
        if (a.tag === b.tag) d += 1; else if (a.tag !== 'trung' && b.tag !== 'trung') d -= 1;
        fac.relAdd(a, b, d, d <= -12 ? ['xung_dot', a.n + ' và ' + b.n + ' xảy ra xung đột'] : null);
        // liên minh: đã thân thiết và chưa có đồng minh
        if (fac.relV(a, b) >= 38 - TT.sectmod.allyCut(a) && a.kind === b.kind && (a.ally || []).indexOf(b.id) < 0 && (a.ally || []).length < 2 && (b.ally || []).length < 2 && rng.P(0.25)) {
          a.ally = (a.ally || []).concat(b.id); b.ally = (b.ally || []).concat(a.id);
          fac.chron(a.n + ' và ' + b.n + ' kết thành đồng minh.', 'good'); TT.diplo.log(a, b, 'ket_minh', 0, 'Kết thành đồng minh');
        }
      });
      // đồng minh đã nguội thì tan
      L.forEach(a => { (a.ally || []).slice().forEach(id => { const b = fac.get(id); if (!b || !fac.alive(b) || fac.relV(a, b) < 20) { a.ally = a.ally.filter(i => i !== id); if (b) b.ally = (b.ally || []).filter(i => i !== a.id); if (b && fac.alive(b)) TT.diplo.log(a, b, 'tan_minh', 0, 'Đồng minh nguội lạnh, tan liên minh'); } }); });
    },

    // ---------- chiến tranh ----------
    maxWars() { const f = fac.S(); return Math.max(1, Math.round(D.FAC.warMax * f.tempo * (fac.era().war >= 2 ? 1.4 : fac.era().war <= 0.5 ? 0.6 : 1))); },
    declareWars() {
      const f = fac.S(), w = S0(), L = rng.shuffle(fac.list().filter(x => x.kind !== 'hoi' && fac.alive(x) && !x.war && x.power >= 15));
      for (const a of L) {
        if (f.wars.length >= fac.maxWars()) break;
        if (a.war) continue;
        const cands = fac.list().filter(b => b.kind !== 'hoi' && b !== a && fac.alive(b) && !b.war && b.power >= 15 && fac.near(a, b) && (a.kind === b.kind || a.region === b.region && (a.kind !== 'trieu' && b.kind !== 'trieu')));
        if (!cands.length) continue;
        cands.sort((x, y) => fac.relV(a, x) - fac.relV(a, y));
        const b = cands[0], r = fac.relV(a, b);
        if (r > -30) continue;
        const p = D.FAC.warBase * f.tempo * fac.era().war * (1 + (-r - 30) / 60) * (a.unity < 40 ? 1.3 : 1) * (a.kind === 'trieu' ? 0.5 : 1) * TT.pact.warBoost(a, b) * TT.sectmod.warMul(a);
        if (rng.P(p)) fac.startWar(a, b);
      }
    },
    startWar(a, b) {
      const f = fac.S(), w = S0();
      const rift = TT.pact.rift(a, b), reason = (rift ? (rift.kind === 'chu_hau' ? 'đòi tự chủ, không chịu thần phục nữa' : 'bất tuân hiệp ước ' + D.PACT.kinds[rift.kind].n.toLowerCase()) : rng.pick(REASONS[a.kind] || REASONS.tong)) + (a.tag !== b.tag && a.tag !== 'trung' && b.tag !== 'trung' ? ' (chính tà bất lưỡng lập)' : '');
      const war = { id: f.nextWar++, a: a.id, b: b.id, start: w.months, dur: rng.RI(1, 8), front: b.region, score: 0, years: 0, sa: [], sb: [], reason };
      // đồng minh đứng về hai phía
      (a.ally || []).forEach(i => { const x = fac.get(i); if (x && fac.alive(x) && !x.war && rng.P(TT.pact.helpP(i, a.id))) { war.sa.push(i); } });
      (b.ally || []).forEach(i => { const x = fac.get(i); if (x && fac.alive(x) && !x.war && rng.P(TT.pact.helpP(i, b.id))) { war.sb.push(i); } });
      a.war = b.war = war.id; war.sa.concat(war.sb).forEach(i => { fac.get(i).war = war.id; });
      f.wars.push(war);
      TT.inter.warStart(war, a, b); // đại chiến liên tông (S8)
      fac.relAdd(a, b, -25, ['chien', a.n + ' tuyên chiến với ' + b.n + ' vì ' + reason]);
      const pl0 = TT.player(); if (pl0 && pl0.region === war.front) TT.log(pl0, 'Chiến loạn bùng lên ở ' + regName(war.front) + ': ' + a.n + ' đánh ' + b.n + '.', 'bad', 'Vì ' + reason + '. Ở vùng chiến tuyến: nguy hiểm +' + D.FAC.frontDanger + ', kiếm tiền -' + Math.round((1 - D.FAC.frontGold) * 100) + '%, giá mua +' + Math.round((D.FAC.frontPrice - 1) * 100) + '%.');
      fac.chron(a.n + ' tuyên chiến với ' + b.n + ' vì ' + reason + '. Chiến sự bùng lên ở ' + regName(war.front) + (war.sa.length + war.sb.length ? ' (có đồng minh tham chiến)' : '') + '.', 'war');
    },
    // S6a: với triều, phần quốc vận của `power` (TT.nation.powerShift) được bỏ đi vì quốc vận đã vào quân lực (TT.army.mul); không đếm đôi.
    strength(x, sup) {
      const A = x.kind === 'trieu' && TT.army.on();
      let s = (x.power - (A ? TT.nation.powerShift(x) : 0)) * (0.55 + 0.45 * x.unity / 100) * (0.8 + 0.4 * x.wealth / 100) * TT.pop.milMul(x) * TT.sectmod.milMul(x) * (A ? TT.army.mul(x) : 1);
      sup.forEach(i => { const y = fac.get(i); if (y) s += y.power * 0.3; });
      return s;
    },
    tickWars() {
      const f = fac.S();
      f.wars.slice().forEach(war => {
        const a = fac.get(war.a), b = fac.get(war.b);
        if (!fac.alive(a) || !fac.alive(b)) { fac.endWar(war, 'draw'); return; }
        war.years++;
        const sa = fac.strength(a, war.sa) + rng.R(-8, 8), sb = fac.strength(b, war.sb) + rng.R(-8, 8);
        war.score = rng.clamp(war.score + (sa - sb) / 6 + TT.inter.warTick(war), -60, 60); // cho mượn quân, cấm vận (S8)
        [[a, war.sa], [b, war.sb]].forEach((pr, i) => {
          const x = pr[0], hard = i === 0 ? Math.max(0, -(sa - sb)) : Math.max(0, sa - sb);
          x.power = rng.clamp(x.power - rng.R(1, 4) - hard * 0.05, 1, 100); x.unity = rng.clamp(x.unity - rng.R(1, 3), 5, 100); x.wealth = rng.clamp(x.wealth - rng.R(1, 4), 0, 100);
          pr[1].forEach(id => { const y = fac.get(id); if (y) y.power = rng.clamp(y.power - rng.R(0.5, 2), 1, 100); });
        });
        if (Math.abs(war.score) >= 25 || a.power < 8 || b.power < 8) fac.endWar(war, a.power < 8 ? 'b' : b.power < 8 ? 'a' : war.score >= 0 ? 'a' : 'b');
        else if (war.years >= war.dur) fac.endWar(war, Math.abs(war.score) >= 10 ? (war.score > 0 ? 'a' : 'b') : 'draw');
        else if (war.years % 3 === 0) fac.chron('Chiến sự giữa ' + a.n + ' và ' + b.n + ' kéo sang năm thứ ' + war.years + (war.score > 8 ? ', ' + a.n + ' đang chiếm ưu thế' : war.score < -8 ? ', ' + b.n + ' đang chiếm ưu thế' : ', bất phân thắng bại') + '.', 'war');
      });
    },
    endWar(war, res) {
      const f = fac.S(), a = fac.get(war.a), b = fac.get(war.b);
      f.wars = f.wars.filter(x => x.id !== war.id);
      [war.a, war.b].concat(war.sa, war.sb).forEach(i => { const x = fac.get(i); if (x && x.war === war.id) x.war = null; });
      TT.inter.warEnd(war, res); // đại chiến liên tông (S8)
      if (res === 'draw') {
        fac.relAdd(a, b, 15, ['hoa_nghi', 'Hòa nghị sau ' + war.years + ' năm chiến tranh']);
        fac.chron('Chiến tranh giữa ' + a.n + ' và ' + b.n + ' kết thúc bằng hòa nghị sau ' + war.years + ' năm.', 'good');
        return;
      }
      const win = res === 'a' ? a : b, lose = res === 'a' ? b : a;
      fac.relAdd(win, lose, -10, ['thang', win.n + ' thắng ' + lose.n + ' sau ' + war.years + ' năm chiến tranh']);
      if (win.kind === 'tong' && lose.kind === 'tong') TT.sect.spoils(win, lose);
      win.power = rng.clamp(win.power + 4, 1, 100); win.wealth = rng.clamp(win.wealth + 8, 0, 100);
      TT.nation.onWarEnd(win, lose);
      TT.army.onWarEnd(win, lose); // sát khí (S6a)
      const pd = 0.42 + (win.power - lose.power) / 220 + (lose.unity < 30 ? 0.15 : 0);
      if (lose.kind !== 'trieu' && (lose.power < 14 || rng.P(pd))) { fac.chron(win.n + ' thắng ' + lose.n + ' sau ' + war.years + ' năm, ' + lose.n + ' bị tiêu diệt.', 'bad', true); fac.destroy(lose, win, 'bị ' + win.n + ' tiêu diệt', true); }
      else if (lose.kind === 'trieu') {
        lose.state = 'suy'; lose.power = 35; lose.unity = 40; const old = lose.n; lose.leader = TT.genName('nam'); lose.leaderAge = 40; lose.tag = rng.pick(['chinh', 'trung', 'ta']);
        fac.chron(win.n + ' thắng ' + old + '. Triều đình đổi chủ, người cầm quyền mới là ' + lose.leader + '.', 'bad');
        TT.sectmod.rulerChanged(lose);
        TT.court.onRuler(lose); // hoàng quyền về mức người mới (S7)
      } else {
        lose.vassal = win.id; lose.power = rng.clamp(lose.power * 0.7, 1, 100); TT.pact.vassalize(lose, win);
        fac.chron(win.n + ' thắng ' + lose.n + ' sau ' + war.years + ' năm, ' + lose.n + ' phải thần phục và nộp cống.', 'bad');
      }
    },

    // ---------- diệt vong và tái lập ----------
    destroy(x, by, why, quiet) {
      const f = fac.S(), w = S0();
      x.state = 'diệt'; x.diedAt = w.months; x.deadYears = 0; x.war = null;
      if (by) TT.diplo.log(by, x, 'diet', 0, by.n + ' tiêu diệt ' + x.n);
      if (by) TT.inter.onDestroy(x, by); // đồng minh bên bị diệt thù bên thắng (S8)
      if (!quiet) fac.chron(x.n + ' ' + why + '.', 'bad');
      if (x.kind === 'tong') {
        f.ruins[x.home] = w.months;
        // thành viên thất tán
        Object.keys(w.chars).forEach(k => {
          const c = w.chars[k];
          if (!c.alive || !c.sect || c.sect.id !== x.id) return;
          if (c.kind === 'player') {
            TT.sect.leave(c, 'tông môn bị tiêu diệt');
            c.flags.sectLost = { id: x.id, month: w.months }; TT.report.mark(c, 'sect', x.n + ' bị tiêu diệt');
            TT.log(c, x.n + ' đã bị tiêu diệt. Bạn trở thành tán tu, không còn chỗ dựa.', 'big');
            TT.loss.hurt(c, 1);
          } else {
            c.sect = null;
            if (c.kind === 'npc' && rng.P(0.25)) TT.life.die(c, 'tử trận khi ' + x.n + ' bị diệt');
          }
        });
        TT.rumors && TT.rumors.refresh && TT.rumors.refresh();
      }
    },
    rebuilds() {
      const f = fac.S(), w = S0();
      fac.list().forEach(x => {
        if (fac.alive(x) || x.kind === 'gia' || x.kind === 'hoi') return;
        const need = (x.rebuildAfter = x.rebuildAfter || rng.RI(D.FAC.rebuildYears[0], D.FAC.rebuildYears[1]));
        if (x.deadYears >= need) {
          x.state = 'ổn'; x.power = 24; x.unity = 45; x.wealth = 15; x.vassal = null; x.ally = [];
          x.leader = TT.genName(rng.P(0.75) ? 'nam' : 'nu'); x.leaderAge = rng.RI(35, 55); x.rebuildAfter = 0;
          x.tag = x.kind === 'tong' ? (rng.P(0.7) ? x.tag : rng.pick(['chinh', 'trung', 'ta'])) : x.tag;
          delete f.ruins[x.home];
          fac.chron('Dư đảng của ' + x.n + ' tái lập môn hộ trên tàn tích cũ, do ' + x.leader + ' đứng đầu.', 'good');
          if (x.kind === 'tong') { TT.sect.ensureLeaders(TT.sect.regionOf(x.home)); }
        }
      });
    },
    spawnClans() {
      const f = fac.S(), w = S0(), alive = fac.list('gia').filter(fac.alive).length;
      if (alive >= D.FAC.gia || !rng.P(0.12 + (D.FAC.gia - alive) * 0.06)) return;
      const dead = fac.list('gia').filter(x => !fac.alive(x) && x.deadYears >= 8);
      if (!dead.length) return;
      const x = rng.pick(dead), r = rng.pick(D.REGIONS), pl = TT.map.placesOf(r.id).filter(p => ['thon_tran', 'thanh_tri'].indexOf(p.type) >= 0);
      const used = fac.list('gia').filter(fac.alive).map(y => y.n);
      let s, g = 0; do { s = rng.pick(D.SURNAMES) + ' gia'; } while (used.indexOf(s) >= 0 && g++ < 30);
      Object.assign(x, { n: s, region: r.id, home: (pl.length ? rng.pick(pl) : TT.map.placesOf(r.id)[0]).id, state: 'ổn', power: 22, unity: 55, wealth: 20, war: null, vassal: null, ally: [], leader: TT.genName('nam'), leaderAge: rng.RI(30, 50), tag: rng.pick(['chinh', 'trung', 'ta']), deadYears: 0, diedAt: 0 });
      fac.chron('Một gia tộc tu tiên mới nổi lên ở ' + regName(x.region) + ': ' + x.n + ' do ' + x.leader + ' đứng đầu.', 'good');
    },

    // ---------- thương hội ----------
    // Thế lực loại thứ tư: trung gian giao thương giữa tông, vương triều và tán tu; đại diện giai cấp tư bản.
    // Giàu và có ảnh hưởng chính trị (infl theo từng thế lực) nhưng KHÔNG có quân đội: không tham chiến, hộ vệ tối đa 30, tự sản xuất tối đa 12%.
    // Trạng thái: wealth (vốn), trust (uy tín), guard (hộ vệ đoàn), reach (các vùng có chi nhánh), infl, agenda, own (tỉ phần tự sản xuất).
    seedHoi(f) {
      const regionsOf = () => D.REGIONS.map(r => r.id);
      D.HOI.start.forEach((s, i) => {
        const all = rng.shuffle(regionsOf()), home = s.home && all.indexOf(s.home) >= 0 ? s.home : all[0];
        const reach = [home].concat(all.filter(r => r !== home)).slice(0, s.reach);
        f.list['hoi_' + i] = mkHoi('hoi_' + i, s.n, home, s.tag, s.agenda, reach, rng.RI(55, 85));
      });
      f.shocks = [];
    },
    // Thế giới cũ (bản lưu trước khi có thương hội) tự sinh hội ở lần cập nhật năm kế.
    ensureHoi() {
      const f = fac.S(); if (!f.list) return;
      if (!Object.keys(f.list).some(k => f.list[k].kind === 'hoi')) fac.seedHoi(f);
      if (!f.shocks) f.shocks = [];
    },
    hoiAt(rid) { return fac.list('hoi').filter(x => fac.alive(x) && x.reach.indexOf(rid) >= 0); },
    // Độ phủ của các thương hội ở một vùng (0-1): dùng ép chênh giá, giảm trần giá khi khan hàng (kinh tế).
    hoiCover(rid) { const L = fac.hoiAt(rid); let c = 0; L.forEach(x => { c += (0.25 + 0.5 * x.trust / 100) * (0.4 + x.wealth / 160); }); return rng.clamp(c, 0, 1); },
    tickHoi(x) {
      const f = fac.S(), w = S0(), era = fac.era(), H = D.HOI;
      x.leaderAge = (x.leaderAge || 40) + 1;
      const warsIn = f.wars.filter(wr => x.reach.indexOf(wr.front) >= 0);
      let inc = x.reach.length * 1.3 * (0.6 + x.trust / 100) * (x.agenda === 'cho_den' ? 1.05 : 1);
      inc *= era.id === 'thinh' ? 1.15 : era.id === 'loan' ? 0.82 : 1;
      let d = (inc - 0.15 * x.guard - 1.0 * x.reach.length) * 0.8 + rng.R(-4.5, 4.5) + (58 - x.wealth) * 0.06;
      d += warsIn.length * (x.agenda === 'truc_loi' ? 3 : -1.5);
      x.wealth = rng.clamp(x.wealth + d, 0, 100);
      x.trust = rng.clamp(x.trust + (62 - x.trust) * 0.05 + rng.R(-2.5, 2.5) + (x.agenda === 'cho_den' ? -0.6 : 0), 5, 100);
      x.unity = rng.clamp(x.unity + (65 - x.unity) * 0.06 + rng.R(-3, 3), 10, 100);
      const gt = rng.clamp(4 + x.wealth * 0.27, 3, H.guardMax); x.guard = rng.clamp(x.guard + (gt - x.guard) * 0.3, 0, H.guardMax);
      x.power = rng.clamp(8 + x.wealth * 0.15 + x.reach.length * 2, 1, H.powerMax); // không phải sức mạnh quân sự, chỉ để hiển thị tầm vóc
      x.own = rng.clamp((x.own || 0.06) + rng.R(-0.01, 0.012), 0.02, H.ownMax);
      // ảnh hưởng chính trị với triều và tông trong vùng phủ
      x.infl = x.infl || {};
      x.reach.forEach(rid => {
        fac.list().filter(t => (t.kind === 'trieu' || t.kind === 'tong') && t.region === rid && fac.alive(t)).forEach(t => {
          const base = 0.04 * x.wealth * (t.kind === 'trieu' ? (x.agenda === 'gan_trieu' ? 1.6 : 1) : 0.7);
          x.infl[t.id] = rng.clamp((x.infl[t.id] || 18) * 0.97 + base + rng.R(-1, 1), 0, 100);
        });
      });
      if (x.leaderAge >= 70 && rng.P((x.leaderAge - 68) * 0.04)) fac.succession(x, 'qua đời');
      else if (rng.P(0.01)) fac.succession(x, 'bị ám hại');
      x.state = x.wealth >= 68 ? 'thịnh' : x.wealth < 22 || x.trust < 28 ? 'suy' : 'ổn';
      const R = rid => regName(rid), pickReach = () => rng.pick(x.reach);
      // mở chi nhánh hoặc co lại
      if (x.wealth > 70 && x.reach.length < H.reachMax && rng.P(0.04)) {
        const near = D.REGIONS.map(r => r.id).filter(r => x.reach.indexOf(r) < 0);
        if (near.length) { const r = rng.pick(near); x.reach.push(r); fac.chron(x.n + ' mở chi nhánh mới ở ' + R(r) + '.', 'good'); }
      } else if (x.wealth < 32 && x.reach.length > 2 && rng.P(0.2)) {
        const r = x.reach.pop(); fac.chron(x.n + ' đóng chi nhánh ở ' + R(r) + ' vì thua lỗ.', 'bad');
      }
      // đầu cơ tích trữ khi có chiến sự
      if (warsIn.length && (x.agenda === 'truc_loi' || x.trust < 50) && rng.P(0.12)) {
        const rid = warsIn[0].front; f.shocks.push({ kind: 'hoiTru', hoi: x.id, region: rid, until: w.months + 9 });
        x.trust = rng.clamp(x.trust - 8, 5, 100); x.wealth = rng.clamp(x.wealth + 4, 0, 100);
        fac.chron(x.n + ' bị tố đầu cơ tích trữ đan dược và bùa ở ' + R(rid) + ' giữa lúc chiến sự.', 'bad');
      } else if (x.wealth < 40 && rng.P(0.05)) { f.shocks.push({ kind: 'hoiXa', hoi: x.id, region: pickReach(), until: w.months + 4 }); }
      // cướp đoàn buôn lớn
      if (rng.P(0.06 * (1 - x.guard / 45))) { x.wealth = rng.clamp(x.wealth - rng.R(5, 10), 0, 100); fac.chron('Đoàn buôn của ' + x.n + ' bị cướp ở ' + R(pickReach()) + ', thiệt hại lớn.', 'bad'); }
      // bị triều tịch thu (giàu mà không có chỗ dựa)
      if (x.wealth > 66) fac.list('trieu').filter(t => fac.alive(t) && x.reach.indexOf(t.region) >= 0 && t.power > 55 && (x.infl[t.id] || 0) < 35).forEach(t => {
        if (!rng.P(0.04)) return;
        x.wealth = rng.clamp(x.wealth - 25, 0, 100); x.reach = x.reach.filter(r => r !== t.region || x.reach.length <= 2); x.trust = rng.clamp(x.trust - 6, 5, 100); fac.relAdd(x, t, -30, ['tich_thu', t.n + ' tịch thu tài sản của ' + x.n]);
        fac.chron(t.n + ' tịch thu phần lớn tài sản của ' + x.n + ' ở ' + R(t.region) + ', viện cớ trốn thuế.', 'bad');
      });
      // tông cắt hàng sỉ
      fac.list('tong').filter(t => fac.alive(t) && x.reach.indexOf(t.region) >= 0 && t.power > 55 && fac.relV(x, t) < -30).forEach(t => {
        if (!rng.P(0.04)) return;
        x.wealth = rng.clamp(x.wealth - 10, 0, 100); x.own = rng.clamp(x.own - 0.02, 0.02, H.ownMax); fac.relAdd(x, t, -8, ['cat_hang', t.n + ' cắt nguồn hàng sỉ của ' + x.n]);
        fac.chron(t.n + ' cắt nguồn hàng sỉ của ' + x.n + ' sau mâu thuẫn về giá và hạn mức.', 'bad');
      });
      // môi giới hòa nghị và cho vay thời chiến
      warsIn.forEach(wr => {
        const a = fac.get(wr.a), b = fac.get(wr.b); if (!a || !b) return;
        const ia = x.infl[a.id] || x.infl[a.region] || 0, ib = x.infl[b.id] || 0;
        if ((x.agenda === 'tu_do' || x.agenda === 'gan_trieu') && Math.max(ia, ib) >= 40 && wr.dur > wr.years && rng.P(0.2)) { wr.dur = wr.years; x.trust = rng.clamp(x.trust + 4, 5, 100); fac.chron(x.n + ' đứng ra môi giới hòa nghị giữa ' + a.n + ' và ' + b.n + '.', 'good'); }
        else if ((x.agenda === 'truc_loi' || x.agenda === 'gan_trieu') && rng.P(0.15)) { const t = rng.P(0.5) ? a : b; x.infl[t.id] = rng.clamp((x.infl[t.id] || 18) + 8, 0, 100); x.wealth = rng.clamp(x.wealth - 4, 0, 100); if (rng.P(0.25)) fac.chron(x.n + ' cho ' + t.n + ' vay để nuôi quân trong chiến sự.', 'age'); }
      });
      // phá sản
      if (x.wealth <= 2) { x.poorYears = (x.poorYears || 0) + 1; if (x.poorYears >= 2) { fac.destroy(x, null, 'phá sản, hội sở bị bán tháo', false); x.poorYears = 0; } } else x.poorYears = 0;
    },
    rebuildHoi(x) {
      const need = (x.rebuildAfter = x.rebuildAfter || rng.RI(D.HOI.rebuildYears[0], D.HOI.rebuildYears[1]));
      if (x.deadYears < need) return;
      Object.assign(x, { state: 'ổn', wealth: 32, trust: 45, unity: 55, guard: 5, power: 12, own: 0.04, infl: {}, ally: [], rebuildAfter: 0, deadYears: 0, poorYears: 0, leader: TT.genName(rng.P(0.75) ? 'nam' : 'nu'), leaderAge: rng.RI(35, 55), agenda: rng.pick(['tu_do', 'truc_loi', 'gan_trieu', 'cho_den']) });
      x.reach = rng.shuffle(D.REGIONS.map(r => r.id)).slice(0, rng.RI(2, 3)); x.region = x.reach[0];
      fac.chron(x.n + ' được ' + x.leader + ' gây dựng lại từ số vốn còn sót, nay phủ ' + x.reach.map(regName).join(', ') + '.', 'good');
    },

    // ---------- tác động lên NPC ----------
    npcCasualties() {
      const w = S0(), p = TT.player(); if (!p) return;
      const fr = fac.frontRegions(); if (!fr[p.region]) return;
      let n = 0;
      Object.keys(w.chars).forEach(k => {
        const c = w.chars[k];
        if (!c.alive || c.kind !== 'npc' || c.region !== p.region || c.realm < 1 || c.tier !== 'core') return;
        if (rng.P(D.FAC.npcWarDeath)) { n++; TT.life.die(c, 'tử trận trong chiến loạn'); }
      });
    },

    // ---------- người chơi vào cuộc ----------
    playerHooks() {
      const w = S0(), c = TT.player();
      if (!c || !c.alive || w.pending || c.cross) return;
      const f = fac.S();
      // triệu tập đệ tử của tông đang có chiến tranh
      if (c.sect && c.realm >= 1) {
        const x = fac.get(c.sect.id), war = x && fac.warOf(x);
        if (war && (c.flags.draftAt || -999) + 24 <= w.months && rng.P(0.7)) { c.flags.draftAt = w.months; TT.events.fire(c, D.eventById.fac_trieu_tap, { warId: war.id }); return; }
      }
      // chiến loạn ở vùng bạn đang ở (K1/N1b: người chơi từ 14 tuổi là gặp, không đòi Luyện Khí; tắt D.STORY.kbOn thì như cũ)
      if (fac.atFront(c.region) && (D.STORY.kbOn ? TT.age(c) >= 14 : c.realm >= 1) && !c.dungeon && (c.flags.warAt || -999) + 36 <= w.months && rng.P(0.45)) { c.flags.warAt = w.months; TT.events.fire(c, D.eventById.fac_chien_loan, {}); }
    },

    // Tóm tắt những gì đã đổi kể từ lần chết trước (dùng khi bắt đầu đời mới).
    lifeEnded() { fac.S().lastEnd = S0().months; },
    sinceSummary(fromMonth) {
      const f = fac.S(), keep = f.chron.filter(e => e.m >= fromMonth && ['war', 'bad', 'good', 'era'].indexOf(e.k) >= 0);
      const big = keep.filter(e => /tiêu diệt|đổi chủ|tái lập|bước vào|thần phục|hòa nghị|nổi lên/.test(e.t));
      return (big.length ? big : keep).slice(-4);
    },
    welcome(c) {
      const f = fac.S(), w = S0();
      if (!w.lives || !w.lives.length) return;
      const L = fac.sinceSummary(f.lastEnd), yrs = Math.floor((w.months - f.lastEnd) / 12);
      const era = fac.era();
      let t = 'Thế giới đã đổi thay. Thời đại hiện nay: ' + era.n + '.';
      if (L.length) t += ' Điều đã đổi: ' + L.map(e => e.t.replace(/\.$/, '')).join('; ') + '.';
      TT.log(c, t, 'big');
    }
  };

  function mkHoi(id, n, region, tag, agenda, reach, wealth) {
    return { id, kind: 'hoi', n, region, home: null, tag, power: rng.RI(10, 22), unity: rng.RI(55, 80), wealth, trust: rng.RI(55, 80), guard: rng.RI(8, 18), own: 0.06, agenda, reach, infl: {}, state: 'ổn', war: null, vassal: null, ally: [], leader: TT.genName(rng.P(0.8) ? 'nam' : 'nu'), leaderAge: rng.RI(35, 60) };
  }
  function mk(id, kind, n, region, home, tag) {
    return { id, kind, n, region, home, tag, power: rng.RI(38, 72), unity: rng.RI(45, 85), wealth: rng.RI(25, 70), state: 'ổn', war: null, vassal: null, ally: [], leader: TT.genName(rng.P(0.8) ? 'nam' : 'nu'), leaderAge: rng.RI(35, 65) };
  }
})();
