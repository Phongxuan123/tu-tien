// Bộ máy quyết định: nhân vật tự chọn hành động và nơi ở (trong vùng của mình). Người chơi và NPC dùng chung,
// khác nhau ở chỗ hướng đi của người chơi do người chơi đặt còn NPC do tính cách.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats;

  function prefs(c) {
    const dir = D.DIRECTIONS[c.direction] || D.DIRECTIONS.can_bang;
    const pers = D.personalityById[c.personality] || D.personalityById.trung_lap;
    const w = {};
    Object.keys(D.ACTIONS).forEach(a => { w[a] = dir.w[a] * ((pers.w && pers.w[a]) || 1); });
    return w;
  }

  // Số người đang ở từng địa điểm (tính lại mỗi lần cân nhắc di chuyển).
  let crowd = {};
  function countCrowd(regionId) {
    crowd = {};
    const chars = TT.world.chars;
    for (const id in chars) {
      const x = chars[id];
      if (x.alive && x.region === regionId && !x.travel && !x.cross && x.place) crowd[x.place] = (crowd[x.place] || 0) + 1;
    }
  }

  // Điểm hấp dẫn của một địa điểm với nhân vật: hợp việc muốn làm, trừ nguy hiểm vượt sức, đường xa, đông người.
  function placeScore(c, p, from, reg) {
    const w = prefs(c), map = TT.map;
    const st = map.placeStats(p);
    const sum = w.train + w.work + w.seek + w.forge * 0.5 + w.social * 0.8;
    let s = (w.train * map.linhFactor(st) * map.trainBonus(c, reg) +
      w.work * map.richFactor(st) +
      w.seek * map.dangerFortune(st.danger) +
      w.forge * 0.5 +
      w.social * 0.8 * (0.6 + 0.12 * Math.min(8, crowd[p.id] || 0))) / sum;
    const risk = st.danger * 10 / (S.atk(c) + S.nl(c) * 0.3);
    const hpr = c.hp / S.hpMax(c);
    s /= 1 + risk * (hpr < 0.5 ? 0.6 : 0.25);
    s *= (c.taste && c.taste[p.id]) || 1;          // sở thích riêng với từng nơi
    if (c.sect && p.id === c.sect.id) s *= 1.4;    // thành viên tông môn thích ở lại tông môn
    if (TT.family.partnerAt(c, p.id)) s *= 1.6;    // muốn ở gần đạo lữ
    s /= 1 + 0.03 * (crowd[p.id] || 0);            // đông người thì cạnh tranh tài nguyên
    if (c.kind === 'player' && TT.quests && !(c.visited && c.visited[p.id])) s *= 1 + 2 * TT.quests.exploreBias(c); // đang có nhiệm vụ khám phá
    if (p.id !== from) {
      const rt = map.localRoute(from, p.id);
      s /= 1 + 0.04 * (rt ? rt.months : 99);
    }
    return s;
  }

  TT.ai = {
    choose(c) {
      if (c.kind === 'player') { const forced = TT.rules.actionFor(c); if (forced) return forced; }
      const dir = D.DIRECTIONS[c.direction] || D.DIRECTIONS.can_bang;
      const pers = D.personalityById[c.personality] || D.personalityById.trung_lap;
      const hpr = c.hp / S.hpMax(c);
      const hasPartner = !!TT.family.partnerHere(c) && !TT.bond.dualFull(c); // song tu: đủ số lần trong năm thì thôi (cặp của người chơi, R 5.3)
      const qm = c.kind === 'player' && TT.quests ? TT.quests.actMul(c) : {};
      const list = Object.keys(D.ACTIONS).map(a => {
        if (a === 'dual' && !hasPartner) return { a, w: 0 };   // song tu chỉ khi đạo lữ có mặt
        if (a === 'craft' && c.kind !== 'player') return { a, w: 0 }; // chỉ người chơi luyện nghề
        let w = dir.w[a] * ((pers.w && pers.w[a]) || 1) * (qm[a] || 1);
        if (hpr < 0.35) w *= a === 'rest' ? 6 : 0.3;   // sinh lực thấp: ưu tiên nghỉ
        else if (hpr > 0.9 && a === 'rest') w *= 0.2;  // khỏe mạnh: ít khi nghỉ
        if (a === c.focus) w *= 2;                     // quán tính, tránh đổi hành động liên tục
        return { a, w };
      });
      return rng.wpick(list, x => x.w).a;
    },

    // Thỉnh thoảng cân nhắc đổi nơi ở trong vùng. Người chơi chỉ tự di chuyển khi bật "Tự di chuyển".
    considerMove(c) {
      if (c.travel || c.cross || !c.place) return;
      if (c.kind === 'player') { if (TT.rumors.planFor(c)) return; }
      else if (c.huntWait <= TT.world.months && TT.social.hunt(c)) return; // thề báo thù thì đi tìm kẻ thù trước
      if (c.kind === 'player' && !c.autoMove) {
        if (c.dest && c.dest !== c.place) TT.map.startTravel(c, c.dest);
        return;
      }
      if (c.dest && c.dest !== c.place) { TT.map.startTravel(c, c.dest); return; }
      // Đạo lữ ở nơi khác trong vùng thì tìm về bên nhau
      if (c.kind === 'npc' && c.tier === 'core' && rng.P(0.08)) {
        const far = TT.family.partners(c).find(x => x.c.region === c.region && !x.c.travel && !x.c.cross && x.c.place && x.c.place !== c.place);
        if (far && TT.map.startTravel(c, far.c.place)) return;
      }
      if (!rng.P(0.06 + (c.kind === 'player' && TT.quests ? 0.12 * TT.quests.exploreBias(c) : 0))) return;
      countCrowd(c.region);
      const reg = TT.map.region(c.region);
      const cur = TT.map.place(c.place);
      const curScore = placeScore(c, cur, c.place, reg) * 1.2; // ngại đổi chỗ: cần hơn hẳn mới đi
      let best = null, bestScore = curScore;
      TT.map.placesOf(c.region).forEach(p => {
        if (p.id === c.place) return;
        const sc = placeScore(c, p, c.place, reg);
        if (sc > bestScore) { best = p; bestScore = sc; }
      });
      if (best) TT.map.startTravel(c, best.id);
    }
  };
})();
