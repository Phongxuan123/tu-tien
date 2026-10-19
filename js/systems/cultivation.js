// Tác động hằng tháng của từng hành động (có tính địa điểm, môi trường và thời tiết), và đột phá.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats;
  const M = 1 / 12;

  function heal(c, n) { c.hp = rng.clamp(c.hp + n, 0, S.hpMax(c)); }
  // Khí vận cao thì gặp cơ duyên dễ hơn (khí vận âm không làm giảm dưới mức cơ bản).
  function kvFactor(c) { return 1 + Math.max(0, S.kv(c)) * 0.02; }
  function gainFortune(c, text) {
    c.fortune += 1;
    TT.log(c, text + ' (cơ duyên ' + Math.floor(c.fortune) + ').', 'good');
  }

  // Tu vi cộng thêm trong một tháng tu luyện (địa điểm, tông môn, sư phụ, vượt vùng đều tính vào).
  function trainGain(c, E, crossing) {
    const place = E ? TT.map.linhFactor(E.stats) * TT.map.trainBonus(c, E.reg) * E.train * TT.sect.trainBonus(c) : 1;
    const crossMul = crossing ? D.SHORTCUT.crossTrainMul : 1;
    return rng.RI(4, 8) * (D.REALM_MUL[Math.min(5, c.realm)]) * S.trainMul(c) * (c.ring ? 1.5 : 1) * D.TRAIN_RATE * place * crossMul * TT.family.masterBonus(c) * TT.tech.trainMul(c) * TT.fac.trainMul() * (c.kind === 'player' ? D.PLAYER_RATE * TT.loss.trainMul(c) * TT.path.mods(c).train : 1) * M;
  }
  const freshAid = () => ({ pill: 0, room: false, ngung: false, ho: false, guard: 0, tcd: false });

  const cult = TT.cult = {
    // Áp dụng hành động của tháng này. Địa điểm, môi trường và thời tiết lấy từ TT.map.effects.
    // Khi đang vượt vùng (c.cross) chỉ tu luyện ở tốc độ giảm, không có hiệu ứng địa điểm.
    monthly(c, action) {
      const crossing = !!c.cross;
      if (c.kind === 'player') TT.items.relicGrow(c, action === 'train' || action === 'dual');
      const E = crossing ? null : TT.map.effects(c);
      const hereName = E && E.place ? E.place.n : '';
      if (action === 'dual' && !TT.family.partnerHere(c)) action = 'train'; // đạo lữ đã đi vắng thì tu luyện một mình
      if (action === 'craft' && c.kind !== 'player') action = 'work';
      if (action === 'train') {
        const g = trainGain(c, E, crossing);
        c.xp += g; c.yXp += g; c.trainNl += 0.04;
        if (c.kind === 'player') { TT.tech.practice(c, g); TT.ls.autoAbsorb(c, g); }
        if (c.realm >= 1 && rng.P(0.02 * (1 - Math.min(0.8, S.nl(c) / 100)) * M)) {
          heal(c, -40);
          TT.log(c, 'Tẩu hỏa nhập ma! Khí huyết nghịch chuyển, bạn mất 40 sinh lực.', 'bad');
        }
      } else if (action === 'dual') {
        // Song tu: cùng đạo lữ tu luyện, nhanh hơn một chút, tăng đạo tâm và đạo điểm, vững thêm tình cảm.
        const q = TT.family.partnerHere(c);
        const g = trainGain(c, E, false) * 1.3;
        c.xp += g; c.yXp += g; c.trainNl += 0.05;
        if (c.kind === 'player') { TT.tech.practice(c, g); TT.ls.autoAbsorb(c, g); }
        TT.ev.dao(c, 0.25); c.daoDiem += 0.15;
        const r = TT.rel.get(c, q);
        if (r) { r.love = Math.min(100, (r.love || 0) + 1); r.v = Math.min(100, r.v + 0.2); }
        const m = c.gender === 'nu' ? c : q, f = m === c ? q : c;
        if (m.gender === 'nu' && f.gender === 'nam' && !m.pregnant && TT.age(m) >= 18 && TT.age(m) <= 48 && (m.children || []).length < TT.family.MAX_KIDS &&
          TT.world.months - (m.lastBirth || -999) > 24 && rng.P(0.018)) {
          TT.family.conceive(m, f);
        }
      } else if (action === 'craft') {
        TT.craft.monthly(c); TT.job.craftMonth(c);
      } else if (action === 'forge') {
        c.trainAtk += 0.15 * (1 + c.realm * 0.3);
        c.trainHp += 0.5;
        heal(c, 1);
      } else if (action === 'work' && c.sect) {
        TT.res.zoneWork(c);
        TT.job.work(c);
        TT.sect.mission(c); // thành viên tông môn làm nhiệm vụ thay cho kiếm sống
      } else if (action === 'work') {
        TT.res.zoneWork(c);
        TT.job.work(c);
        const g = rng.RI(4, 12) * (1 + c.realm) * (c.kind === 'player' ? TT.path.mods(c).gold * TT.job.incomeMul(c) : 1) * Math.max(0.2, 1 + S.mod(c, 'gold')) * (E ? TT.map.richFactor(E.stats) * E.gold : 1) * M;
        if (c.kind === 'player' && c.realm >= 1) TT.ls.gain(c, g / D.LS.RATE); // tu sĩ kiếm sống bằng linh thạch
        else { c.gold += g; c.yGold += g; }
      } else if (action === 'rest') {
        TT.loss.rested(c);
        heal(c, 35 * M * (E ? E.healMul : 1) * TT.job.healMul(c));
      } else if (action === 'social') {
        TT.social.act(c);
        c.gold += rng.RI(0, 2) * (1 + c.realm) * M;
      } else if (action === 'seek') {
        c.gold += rng.RI(0, 6) * (1 + c.realm) * M;
        const g = rng.RI(0, 3) * (1 + c.realm * 0.5) * D.TRAIN_RATE * M;
        c.xp += g; c.yXp += g;
        if (c.realm < 6 && rng.P(0.05 * kvFactor(c) * (c.kind === 'player' ? TT.path.mods(c).fortune : 1) * (E ? TT.map.dangerFortune(E.danger) : 1))) {
          gainFortune(c, 'Rong ruổi tìm kiếm, bạn gặp được một cơ duyên');
        }
      }
      if (c.zone) TT.res.zoneMonth(c); // ở khu tài nguyên giữa hoang dã có thể gặp nguy hiểm
      // Cơ duyên cũng có thể đến tình cờ dù bạn đang làm gì (hiếm hơn nhiều).
      if (action !== 'seek' && c.realm < 6 && rng.P(0.004 * kvFactor(c) * (c.kind === 'player' ? TT.path.mods(c).fortune : 1))) gainFortune(c, 'Tình cờ gặp một cơ duyên');
      // Tu vi tích lũy dư khi kẹt bình cảnh có giới hạn.
      if (c.realm < 6) {
        const cap = D.NEED[c.realm] * D.XP_OVERFLOW_CAP;
        if (c.xp > cap) c.xp = cap;
      }
      if (E) {
        // Môi trường khắc nghiệt hao sinh lực mỗi tháng (kháng bằng thuộc tính hợp, niệm lực, cảnh giới).
        if (E.hpDrain > 0) heal(c, -E.hpDrain);
        // Nơi nguy hiểm: yếu hơn mối đe dọa thì dễ bị thương (nghỉ ngơi ít bị hơn).
        if (E.danger > 0) {
          const ratio = E.danger * 10 / (S.atk(c) + S.nl(c) * 0.3);
          const pInj = rng.clamp(0.007 * E.danger * ratio * (action === 'rest' ? 0.3 : 1) * (c.kind === 'player' ? TT.path.mods(c).risk : 1), 0, 0.3);
          if (rng.P(pInj)) {
            const dmg = rng.RI(8, 22);
            heal(c, -dmg);
            TT.log(c, 'Bị thương ở ' + hereName + ', sinh lực -' + dmg + '.', 'bad');
          }
        }
      }
      heal(c, 0.4 * (E ? E.healMul : 1));
    },

    // Mua Phá Cảnh Đan bằng vàng và dùng luôn (tối đa D.AID.pillMax viên cho mỗi lần đột phá).
    buyPill(c) {
      if (c.aid.pill >= D.AID.pillMax || TT.ls.wealth(c) < S.pillCost(c)) return false;
      TT.ls.pay(c, S.pillCost(c));
      c.aid.pill++;
      TT.log(c, 'Bạn dùng một viên Phá Cảnh Đan, xác suất đột phá tăng ' + Math.round(D.AID.pillBonus * 100) + '%.', 'good');
      return true;
    },
    // Dùng một viên Phá Cảnh Đan cho lần đột phá này: người chơi ưu tiên viên trong túi, không có thì mua ở giá thường.
    commitPill(c) {
      if (c.aid.pill >= D.AID.pillMax) return false;
      if (c.kind === 'player' && TT.items.has(c, 'pha_canh_dan')) {
        TT.items.remove(c, 'pha_canh_dan'); c.aid.pill++;
        TT.log(c, 'Bạn chuẩn bị một viên Phá Cảnh Đan (trong túi), xác suất đột phá tăng ' + Math.round(D.AID.pillBonus * 100) + '%.', 'good');
        return true;
      }
      return cult.buyPill(c);
    },
    uncommitPill(c) {
      if (c.aid.pill <= 0) return false;
      c.aid.pill--; if (c.kind === 'player') TT.items.add(c, 'pha_canh_dan'); else c.gold += S.pillCost(c);
      return true;
    },
    // Thuê động phủ linh khí để đột phá (một lần cho mỗi lần đột phá).
    buyRoom(c) {
      if (c.aid.room || TT.ls.wealth(c) < S.roomCost(c)) return false;
      TT.ls.pay(c, S.roomCost(c));
      c.aid.room = true;
      TT.log(c, 'Bạn thuê động phủ linh khí để đột phá, xác suất tăng ' + Math.round(D.AID.roomBonus * 100) + '%.', 'good');
      return true;
    },
    // NPC có tiền thì tự dùng bổ trợ trước khi đột phá.
    autoAids(c) {
      if (c.realm < 2) return;
      while (cult.buyPill(c)) { /* mua đến khi hết tiền hoặc đủ */ }
      cult.buyRoom(c);
    },
    // Chuẩn bị tự động cho người chơi (chế độ Tự động): dùng hết đan trong túi, thuê động phủ nếu dư dả, mời hộ pháp thân nhất đang có mặt,
    // dùng Thiên cơ điểm nếu còn dư để đổi lại khi thất bại.
    autoPrep(c) {
      while (c.aid.pill < D.AID.pillMax && TT.items.has(c, 'pha_canh_dan')) cult.commitPill(c);
      if (c.aid.pill < D.AID.pillMax && TT.ls.wealth(c) >= S.pillCost(c) * 3) cult.commitPill(c);
      if (!c.aid.room && TT.ls.wealth(c) >= S.roomCost(c) * 3) cult.buyRoom(c);
      if (!c.aid.ngung && TT.items.has(c, 'ngung_than_dan')) { TT.items.remove(c, 'ngung_than_dan'); c.aid.ngung = true; }
      if (!c.aid.ho && TT.items.has(c, 'ho_mach_dan')) { TT.items.remove(c, 'ho_mach_dan'); c.aid.ho = true; }
      if (!c.aid.guard) {
        const g = cult.guardCandidates(c)[0];
        if (g) c.aid.guard = g.id;
      }
      if (!c.aid.tcd && c.tcd >= S.tcdCost(c) + S.rerollCost(c)) { c.tcd -= S.tcdCost(c); c.aid.tcd = true; }
    },
    // Những người thân thiết đang ở cùng địa điểm, có thể làm hộ pháp (mạnh nhất trước).
    guardCandidates(c) {
      return TT.rel.list(c).filter(x => x.c && x.c.alive && !x.c.travel && !x.c.cross && x.r.v >= 30 && x.r.k !== 'thu' &&
        x.c.region === c.region && x.c.place === c.place && x.c.realm >= 1).map(x => x.c).sort((a, b) => b.realm - a.realm).slice(0, 5);
    },
    // Hoàn trả mọi bổ trợ đã chuẩn bị (khi người chơi hủy hoặc hộp bị bỏ).
    resetAid(c) {
      while (c.aid.pill > 0) cult.uncommitPill(c);
      if (c.aid.room) c.gold += S.roomCost(c);
      if (c.aid.ngung) TT.items.add(c, 'ngung_than_dan');
      if (c.aid.ho) TT.items.add(c, 'ho_mach_dan');
      if (c.aid.tcd) c.tcd += S.tcdCost(c);
      c.aid = freshAid();
    },

    // Thử đột phá lên cảnh giới kế tiếp. Trả về true nếu thành công.
    attemptBreak(c) {
      if (!S.ready(c)) return false;
      const p = S.breakChance(c);
      const cost = S.fortuneNeed(c);
      const ho = c.aid.ho, guard = S.guardOf(c);
      c.aid = freshAid(); // bổ trợ chỉ dùng một lần cho mỗi lần đột phá
      const parts = S.breakParts(c).slice().sort((a, b) => Math.abs(b.v) - Math.abs(a.v)).slice(0, 5).map(x => x.n + ' ' + (x.v >= 0 ? '+' : '') + Math.round(x.v * 100) + '%').join(', ');
      c.brkNote = 'Xác suất thành công ' + Math.round(p * 100) + '% (trần ' + Math.round(S.breakCap(c) * 100) + '%). Các phần chính: ' + parts + '.';
      TT.log(c, 'Bạn bắt đầu đột phá lên ' + D.REALM_NAMES[c.realm + 1] + (guard ? ', ' + guard.name + ' hộ pháp bên cạnh' : '') + '...', 'age');
      if (rng.P(p)) return cult.breakSuccess(c, cost, guard, false, ho);
      // Thất bại: người chơi còn Thiên cơ điểm thì được đổi lại một lần tung (tầng 3).
      if (c.kind === 'player' && c.tcd >= S.rerollCost(c)) {
        c.pendingBreak = { p, cost, ho, guard: guard ? guard.id : 0 };
        TT.decisions.request({
          type: 'break_reroll', charId: c.id, tier: 3, title: 'Đột phá thất bại?',
          text: 'Thiên kiếp quét qua, khí tức hỗn loạn. Bạn có thể dùng ' + S.rerollCost(c) + ' Thiên cơ điểm (đang có ' + c.tcd + ') để đổi lại một lần tung xúc xắc, với cùng xác suất ' + Math.round(p * 100) + '%.',
          choices: [{ key: 'doi', label: 'Dùng Thiên cơ điểm để đổi lại' }, { key: 'thoi', label: 'Chấp nhận thất bại' }], def: 0
        });
        return false;
      }
      return cult.breakFail(c, cost, ho, guard);
    },

    // Đổi lại một lần tung bằng Thiên cơ điểm (gọi từ hộp quyết định).
    rerollBreak(c, doIt) {
      const pb = c.pendingBreak; c.pendingBreak = null;
      if (!pb) return false;
      const guard = pb.guard ? TT.world.chars[pb.guard] : null;
      if (doIt && c.tcd >= S.rerollCost(c)) {
        c.tcd -= S.rerollCost(c);
        TT.log(c, 'Bạn dùng Thiên cơ điểm để đổi lại. Thiên cơ xoay chuyển...', 'big');
        if (rng.P(pb.p)) return cult.breakSuccess(c, pb.cost, guard && guard.alive ? guard : null, false, pb.ho);
      }
      return cult.breakFail(c, pb.cost, pb.ho, guard && guard.alive ? guard : null);
    },

    // passed: đã vượt thiên kiếp (gọi lại từ TT.tri). Từ Kim Đan trở lên phải qua thiên kiếp trước khi lên cảnh giới.
    breakSuccess(c, cost, guard, passed, ho) {
      if (!passed && TT.tri.needs(c.realm + 1)) {
        if (!TT.tri.start(c, cost, guard, ho)) return false; // người chơi đang vượt kiếp, hoặc NPC không qua nổi
      }
      {
        c.fortune -= cost;
        c.realm++;
        c.xp = 0;
        c.breakDelay = 0;
        c.stuck = false;
        c.hp = S.hpMax(c);
        TT.log(c, 'Đột phá thành công! Bạn đã đạt cảnh giới ' + D.REALM_NAMES[c.realm] + '.', 'big', c.brkNote); c.brkNote = null; TT.report.mark(c, 'realm', 'Đột phá lên ' + D.REALM_NAMES[c.realm]);
        TT.rep.add(c, 'danh', c.realm * 6);
        if (c.kind === 'player') { c.tcd += c.realm; TT.log(c, 'Thiên cơ điểm +' + c.realm + '.', 'good'); }
        if (guard) { TT.rel.add(c, guard, 6); TT.log(c, guard.name + ' hộ pháp trọn vẹn, ơn này bạn ghi nhớ.', 'good'); }
        // sư phụ được thơm lây khi đồ đệ đột phá
        const mst = c.master && TT.world.chars[c.master];
        if (mst && mst.alive && c.realm >= 2) {
          TT.rep.add(mst, 'danh', c.realm * 3); mst.daoDiem += 1;
          if (mst.kind === 'player') TT.log(mst, 'Đồ đệ ' + c.name + ' đột phá lên ' + D.REALM_NAMES[c.realm] + '. Bạn mừng thầm.', 'good');
        }
        if (c.kind !== 'player' && c.realm >= 2) {
          TT.news(c.name + ' đột phá lên ' + D.REALM_NAMES[c.realm] + '.', 'good', [c.id]);
        }
        if (c.realm >= 6) TT.life.ascend(c);
        else TT.log(c, 'Thọ nguyên tăng lên ' + S.lifeSpan(c) + ' tuổi.', 'good');
        return true;
      }
    },

    // Nguy cơ tử vong khi đột phá thất bại (Hộ Mạch Đan giảm mạnh, hộ pháp giảm vừa).
    failDeath(c, ho, guard) { return (c.realm < 2 ? 0.06 + c.realm * 0.02 : (0.16 + c.realm * 0.04)) * (ho ? 0.35 : 1) * (guard ? 0.7 : 1); },

    // Thất bại: hao tu vi, sinh lực và cháy mất một nửa cơ duyên đã dùng. Hộ Mạch Đan giảm hẳn tổn thương và nguy cơ chết,
    // hộ pháp giảm nguy cơ chết nhưng bị thương theo.
    breakFail(c, cost, ho, guard) {
      const burn = Math.ceil(cost / 2);
      c.fortune -= burn;
      c.xp *= ho ? 0.8 : 0.6;
      c.breakDelay = TT.world.months + 12;
      const dmg = ho ? 12 : 35;
      heal(c, -dmg);
      TT.log(c, 'Đột phá thất bại! Tu vi hao tổn, sinh lực -' + dmg + (burn ? ', mất ' + burn + ' cơ duyên' : '') + (ho ? ' (Hộ Mạch Đan đã giảm bớt tổn thương)' : '') + '.', 'bad', c.brkNote); c.brkNote = null;
      if (guard) {
        guard.hp = Math.max(1, guard.hp - 15); TT.rel.add(c, guard, 6);
        TT.log(c, guard.name + ' đỡ giúp bạn một phần thiên uy và bị thương.', 'age');
      }
      const pDeath = cult.failDeath(c, ho, guard);
      if (rng.P(pDeath)) TT.life.die(c, 'thiên lôi giáng xuống, thân tử đạo tiêu');
      else if (c.hp <= 0) TT.life.die(c, 'thương thế quá nặng sau đột phá thất bại');
      return false;
    }
  };
})();



