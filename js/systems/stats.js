// Chỉ số suy ra từ nhân vật: sinh lực, công kích, niệm lực, tốc độ tu, xác suất đột phá...
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng;
  const S = TT.stats = {};

  // Hiệu chỉnh chỉ số: tiên thiên, trang bị, công pháp và tâm pháp, kiếm đạo (chỉ người chơi có các phần sau).
  S.mod = (c, k) => c.traitIds.reduce((a, id) => a + ((D.traitById[id].m[k]) || 0), 0) +
    (c.kind === 'player' ? TT.items.mod(c, k) + TT.tech.mod(c, k) + TT.craft.mod(c, k) : 0);
  S.hpMax = c => Math.max(20, Math.round((100 + c.realm * 40 + S.mod(c, 'hpMax') + c.trainHp) * (TT.loss ? TT.loss.hpMul(c) : 1)));
  S.atk = c => Math.max(1, Math.round(c.baseAtk + c.realm * 10 + S.mod(c, 'atk') + c.trainAtk));
  S.nl = c => Math.max(1, Math.round(c.baseNl + c.realm * 6 + S.mod(c, 'nl') + c.trainNl));
  // Người chơi (khi D.NATURE.on): điểm khí vận, thụ động tính tối đa 20, cộng phần Mệnh cách của tiên thiên. NPC giữ baseKv.
  S.kv = c => (c.kind === 'player' && D.NATURE.on ? Math.min(TT.kv.pts(c), TT.kv.passiveCap) : c.baseKv) + S.mod(c, 'kv');
  S.luck = c => c.baseLuck + S.mod(c, 'luck') + (TT.nation ? TT.nation.luck(c) : 0);

  // Tư chất: main là điểm thuộc tính cao nhất, n là số thuộc tính chính (>= 5 điểm).
  S.tc = function (c) {
    const ps = c.tuchat.attrs.map(a => a.p);
    return {
      main: Math.max.apply(null, ps),
      n: Math.max(1, ps.filter(p => p >= 5).length),
      total: c.tuchat.total
    };
  };

  S.trainMul = function (c) {
    const t = S.tc(c);
    return Math.max(0.15, (0.4 + t.main / 60) * (1 - 0.06 * (t.n - 1)) + S.mod(c, 'train'));
  };
  S.ngo = c => Math.min(1.5, S.tc(c).main / 150 + S.nl(c) / 100);

  // Giá bổ trợ đột phá tăng theo cảnh giới (tính bằng vàng).
  S.pillCost = c => Math.round(D.AID.pillBase * Math.pow(Math.max(1, c.realm), 1.6));
  S.roomCost = c => Math.round(S.pillCost(c) * D.AID.roomMul);

  // Hộ pháp: người thân thiết đứng ở cùng địa điểm giúp canh giữ khi đột phá (còn sống và có mặt).
  S.guardOf = function (c) {
    const g = c.aid.guard && TT.world.chars[c.aid.guard];
    if (!g || !g.alive || g.travel || g.cross || g.region !== c.region || g.place !== c.place) return null;
    return g;
  };
  S.guardBonus = g => (g ? Math.min(0.08, 0.02 + 0.012 * g.realm) : 0);
  // Nơi đột phá: linh khí dày và bế quan ở tông môn mình giữ chức cao thì thuận lợi hơn (chỉ người chơi biết chọn nơi).
  S.placeBonus = function (c) {
    if (c.kind !== 'player' || !c.place || c.travel || c.cross) return 0;
    const st = TT.map.placeStats(TT.map.place(c.place));
    return Math.max(0, st.linh - 3) * 0.02 + (c.sect && c.sect.id === c.place && c.sect.rank >= 2 ? 0.04 : 0);
  };
  S.tcdCost = c => 1 + c.realm;         // Thiên cơ điểm để nghịch chuyển +10% xác suất đột phá
  S.rerollCost = c => 3 + 2 * c.realm;      // Thiên cơ điểm để đổi lại một lần đột phá thất bại

  // Xác suất đột phá chia thành các phần để người chơi thấy rõ nên bổ trợ ở đâu.
  // Nền tảng thấp từ Trúc Cơ trở đi; muốn cao phải dựa vào nỗ lực, cơ duyên và bổ trợ.
  S.breakParts = function (c) {
    const t = S.tc(c);
    const need = D.NEED[c.realm];
    const over = Math.min(1, Math.max(0, (c.xp - need) / need));
    const surplus = Math.min(5, Math.max(0, c.fortune - D.FORTUNE_NEED[c.realm]));
    const parts = [
      { n: 'Nền tảng cảnh giới', v: c.realm < 2 ? 0.5 - c.realm * 0.06 : D.AID.baseFromTrucCo - (c.realm - 2) * 0.02 },
      { n: 'Nhiều thuộc tính tư chất', v: -0.02 * (t.n - 1) },
      { n: 'Nỗ lực (tu vi tích lũy dư)', v: 0.15 * over },
      { n: 'Cơ duyên dư', v: 0.02 * surplus },
      { n: 'Niệm lực và linh ngộ', v: S.nl(c) * 0.002 + S.ngo(c) * 0.03 },
      { n: 'Vận may', v: S.luck(c) * 0.003 },
      { n: 'Tiên thiên và pháp khí', v: S.mod(c, 'brk') + (c.ring ? 0.05 : 0) },
      { n: 'Tông môn hỗ trợ', v: TT.sect ? TT.sect.breakBonus(c) : 0 },
      { n: 'Thiên phạt (Nghịch Thiên)', v: c.thienPhat ? -0.10 : 0 },
      { n: 'Phản phệ quốc vận', v: TT.nation ? -TT.nation.brkPenalty(c) : 0 },
      { n: 'Thương tích chưa lành', v: -TT.loss.brkPenalty(c) },
      { n: 'Phá Cảnh Đan x' + c.aid.pill, v: D.AID.pillBonus * c.aid.pill },
      { n: 'Động phủ linh khí', v: c.aid.room ? D.AID.roomBonus : 0 },
      { n: 'Ngưng Thần Đan', v: c.aid.ngung ? 0.04 : 0 },
      { n: 'Hộ pháp', v: S.guardBonus(S.guardOf(c)) },
      { n: 'Nơi đột phá', v: S.placeBonus(c) },
      { n: 'Thiên cơ nghịch chuyển', v: c.aid.tcd ? 0.10 : 0 }
    ];
    return parts.filter(p => Math.abs(p.v) > 0.0005);
  };
  // Trần xác suất đột phá: từ Trúc Cơ trở đi dù dồn hết bổ trợ cũng không quá khoảng 46% (không có gì chắc chắn trên đường lên tiên).
  S.breakCap = c => (c.realm >= 2 ? 0.46 : 0.9);
  S.breakChance = c => rng.clamp(S.breakParts(c).reduce((a, p) => a + p.v, 0), 0.03, S.breakCap(c));

  S.lifeSpan = function (c) {
    const L = D.LIFE[c.realm];
    return L === Infinity ? L : Math.max(20, Math.round(L * (1 + S.mod(c, 'life') + (c.ntLife || 0))) + (c.lifeBonus || 0));
  };
  S.need = c => (c.realm < 6 ? D.NEED[c.realm] : Infinity);
  // Đủ tu vi để đột phá (có thể vẫn kẹt bình cảnh nếu thiếu cơ duyên).
  S.canBreak = c => c.realm < 6 && c.xp >= D.NEED[c.realm];
  S.fortuneNeed = c => (c.realm < 6 ? D.FORTUNE_NEED[c.realm] : 0);
  S.gateOk = c => c.fortune >= S.fortuneNeed(c);
  // Sẵn sàng đột phá: đủ tu vi và đủ cơ duyên.
  S.ready = c => S.canBreak(c) && S.gateOk(c);

  // Giai đoạn trong cảnh giới: 0 sơ kỳ, 1 trung kỳ, 2 hậu kỳ (phàm nhân là 0, cảnh giới cuối là 2).
  S.stage = function (c) {
    if (c.realm === 0) return 0;
    if (c.realm >= 6) return 2;
    return Math.min(2, Math.floor(c.xp / D.NEED[c.realm] * 3));
  };
  // Tên cảnh giới kèm sơ/trung/hậu kỳ.
  S.realmName = function (c) {
    const base = D.REALM_NAMES[c.realm];
    if (c.realm === 0 || c.realm >= 6) return base;
    const st = S.stage(c);
    return base + ' ' + D.STAGE_NAMES[st];
  };
})();



