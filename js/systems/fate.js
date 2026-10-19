// Nghịch Thiên Cải Mệnh và Thiên kiếp.
// Nghịch Thiên: khi sắp chết (hết sinh lực, bị giết, thiên kiếp, hết thọ nguyên) người chơi có thể trả giá để sống tiếp.
//   Tối đa D.NT.max lần mỗi đời; mỗi lần đắt hơn (Thiên cơ điểm, nghiệp, đạo tâm, thọ nguyên, tiên thiên, tư chất).
//   Đầu thai làm người mới thì không mang theo; kế thừa thì người thừa kế gánh một nửa nghiệp và thọ nguyên đã tổn.
// Thiên kiếp: đột phá lên Kim Đan trở lên sau khi thành công phải vượt kiếp nhiều đợt; người chơi chọn cách chống đỡ từng đợt.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats;

  // Số liệu Nghịch Thiên (chỉnh được). Chỉ số mảng = số lần đã dùng trong đời (0, 1, 2).
  D.NT = {
    max: 3,
    tcd: [3, 5, 8],                  // Thiên cơ điểm cần
    nghiep: [3, 6, 12],
    dao: [-10, -15, -20],
    life: [-0.10, -0.15, -0.25],     // giảm thọ nguyên tối đa (cộng dồn)
    revive: 0.35,                    // sống lại với phần sinh lực này
    extend: 12,                      // hết thọ nguyên thì kéo dài thêm bấy nhiêu năm
    desc: [
      'Giá: 3 Thiên cơ điểm, 3 nghiệp, đạo tâm -10, thọ nguyên tối đa -10%.',
      'Giá: 5 Thiên cơ điểm, mất một tiên thiên tốt (hoặc 15% tư chất), 6 nghiệp, đạo tâm -15, thọ nguyên -15%.',
      'Giá: 8 Thiên cơ điểm, mất 30% tư chất, 12 nghiệp, đạo tâm -20, thọ nguyên -25%, và thiên phạt: đột phá khó hơn 10% mãi mãi.'
    ]
  };

  const nt = TT.nt = {
    used: c => (c.nt && c.nt.used) || 0,
    // Có thể cải mệnh không (cho người chơi, theo số lần và Thiên cơ điểm). Trả về false hoặc lý do.
    canUse(c) {
      const k = nt.used(c);
      if (k >= D.NT.max) return 'Đã dùng hết ' + D.NT.max + ' lần Nghịch Thiên trong đời này';
      if (c.tcd < D.NT.tcd[k]) return 'Cần ' + D.NT.tcd[k] + ' Thiên cơ điểm (bạn có ' + c.tcd + ')';
      return false;
    },
    // Gọi từ life.die: nếu có thể và người chơi muốn thì tạm hoãn cái chết. Trả về true nếu đã hoãn (đang hỏi).
    offer(c, cause) {
      if (c.kind !== 'player' || /phi thăng|Nghịch Thiên/.test(cause) || TT.world.pending && TT.world.pending.type === 'nt_offer') return false;
      if (nt.canUse(c)) return false;
      const k = nt.used(c), old = /thọ nguyên/.test(cause);
      c.hp = Math.max(1, c.hp);
      c.ntCause = cause;
      TT.decisions.request({
        type: 'nt_offer', charId: c.id, tier: 3, title: 'Nghịch Thiên Cải Mệnh',
        text: 'Tử khí đã phủ kín: ' + cause + '. Bạn có thể nghịch thiên cải mệnh, đoạt lại một mạng ' + (old ? '(kéo dài thọ nguyên thêm ' + D.NT.extend + ' năm)' : '(sống lại với ' + Math.round(D.NT.revive * 100) + '% sinh lực)') +
          '.\nLần thứ ' + (k + 1) + '/' + D.NT.max + '. ' + D.NT.desc[k] + '\nThiên đạo ghi nhớ mọi thứ bạn đã mượn.',
        choices: [{ key: 'cai', label: 'Nghịch Thiên Cải Mệnh (' + D.NT.tcd[k] + ' Thiên cơ điểm)' }, { key: 'chet', label: 'Chấp nhận số phận' }], def: 1
      });
      return true;
    },
    // Thực hiện cải mệnh (trả giá) hoặc chết thật.
    resolve(c, use) {
      const cause = c.ntCause || 'tử vong'; c.ntCause = '';
      if (!use) { TT.life.dieNow(c, cause); return false; }
      const k = nt.used(c);
      c.tcd -= D.NT.tcd[k];
      c.nt = c.nt || { used: 0 };
      c.nt.used++;
      c.nghiep += D.NT.nghiep[k];
      TT.ev.dao(c, D.NT.dao[k]);
      c.ntLife = (c.ntLife || 0) + D.NT.life[k];
      const costs = ['nghiệp +' + D.NT.nghiep[k], 'đạo tâm ' + D.NT.dao[k], 'thọ nguyên ' + Math.round(D.NT.life[k] * 100) + '%'];
      if (k === 1) {
        const good = c.traitIds.filter(id => D.traitById[id].g).sort((a, b) => D.traitById[b].q - D.traitById[a].q)[0];
        if (good) { c.traitIds.splice(c.traitIds.indexOf(good), 1); costs.push('mất tiên thiên "' + D.traitById[good].n + '"'); }
        else { nt.shrinkTuChat(c, 0.85); costs.push('mất 15% tư chất'); }
      } else if (k === 2) {
        nt.shrinkTuChat(c, 0.7); c.thienPhat = true; costs.push('mất 30% tư chất', 'thiên phạt');
      }
      if (/thọ nguyên/.test(cause)) {
        const need = TT.age(c) - S.lifeSpan(c) + D.NT.extend;
        c.lifeBonus = (c.lifeBonus || 0) + Math.max(D.NT.extend, need);
      } else c.hp = Math.max(1, Math.round(S.hpMax(c) * D.NT.revive));
      c.dungeon = null; c.cross = c.cross; // đang vượt vùng thì vẫn tiếp tục
      TT.log(c, 'NGHỊCH THIÊN CẢI MỆNH! Bạn đoạt lại mạng sống từ tay thiên đạo. Cái giá: ' + costs.join(', ') + '.', 'big');
      TT.news(c.name + ' đã nghịch thiên cải mệnh lần thứ ' + c.nt.used + '.', 'bad', [c.id]);
      return true;
    },
    shrinkTuChat(c, f) {
      c.tuchat.attrs.forEach(a => { a.p = Math.max(1, Math.round(a.p * f)); });
      c.tuchat.total = c.tuchat.attrs.reduce((s, a) => s + a.p, 0);
    }
  };

  // ---------- Thiên kiếp ----------
  // Sau khi đột phá thành công lên realm Kim Đan trở lên: 3 đợt (4 đợt khi phi thăng). Sát thương mỗi đợt = phần trăm sinh lực tối đa.
  D.TRI = {
    dmg: { 3: 0.34, 4: 0.38, 5: 0.42, 6: 0.46 },   // theo cảnh giới đạt được
    phases: realm => (realm >= 6 ? 4 : 3),
    npcDeath: realm => 0.06 + 0.03 * realm
  };

  const tri = TT.tri = {
    needs: realm => realm >= 3,
    phaseDmg(c) { return TT.stats.hpMax(c) * D.TRI.dmg[c.tri.target] * rng.R(0.8, 1.2) * (c.tri.ho ? 0.75 : 1) * (c.thienPhat ? 1.1 : 1); },

    // Người chơi: bắt đầu thiên kiếp (đã qua xác suất đột phá). NPC: xử lý ngay.
    start(c, cost, guard, ho) {
      const target = c.realm + 1;
      if (c.kind !== 'player') {
        if (rng.P(D.TRI.npcDeath(target))) { TT.log(c, 'Thiên kiếp quá mạnh, bạn không vượt qua nổi.', 'bad'); TT.life.die(c, 'chết trong thiên kiếp'); return false; }
        return true;
      }
      c.tri = { target, cost, guard: guard ? guard.id : 0, ho: !!ho, phase: 0, total: D.TRI.phases(target), hp0: Math.round(c.hp) };
      TT.log(c, 'Mây kiếp đen kịt cuộn trên đầu, sấm sét ngưng tụ. Thiên kiếp lên ' + D.REALM_NAMES[target] + ' sắp giáng xuống: ' + c.tri.total + ' đợt!', 'big');
      tri.present(c);
      return false;
    },
    present(c) {
      TT.events.fire(c, D.eventById.tri_phase, { phase: c.tri.phase });
    },
    // Một đợt kiếp giáng xuống với cách chống đỡ đã chọn. Trả về chữ kết quả.
    strike(c, how) {
      let dmg = tri.phaseDmg(c);
      const notes = [];
      if (how === 'bua') {
        if (TT.items.remove(c, 'ho_than_bua')) { dmg *= 0.6; notes.push('Hộ Thân Phù đỡ bớt 40%'); } else notes.push('không còn Hộ Thân Phù');
      } else if (how === 'dan') {
        if (TT.items.remove(c, 'hoi_xuan_dan')) { const g = Math.round(TT.stats.hpMax(c) * 0.5); c.hp = Math.min(TT.stats.hpMax(c), c.hp + g); notes.push('uống Hồi Xuân Đan (+' + g + ' sinh lực)'); } else notes.push('không còn Hồi Xuân Đan');
      } else if (how === 'ho') {
        const g = c.tri.guard && TT.world.chars[c.tri.guard];
        if (g && g.alive) { dmg *= 0.75; g.hp = Math.max(1, g.hp - 10); notes.push(g.name + ' đứng ra gánh bớt'); }
      }
      dmg = Math.round(dmg);
      c.hp -= dmg;
      c.tri.phase++;
      const txt = 'Đợt kiếp ' + c.tri.phase + '/' + c.tri.total + ' giáng xuống: sinh lực -' + dmg + (notes.length ? ' (' + notes.join(', ') + ')' : '') + '.';
      if (c.hp <= 0) {
        const target = c.tri.target; c.tri = null;
        c.hp = 0;
        TT.life.die(c, 'chết trong thiên kiếp lên ' + D.REALM_NAMES[target]);
        return TT.ev.bad(txt + ' Bạn không chịu nổi.');
      }
      if (c.tri.phase >= c.tri.total) {
        const g = c.tri.guard && TT.world.chars[c.tri.guard], cost = c.tri.cost;
        c.tri = null;
        TT.log(c, txt, 'big');
        TT.cult.breakSuccess(c, cost, g && g.alive ? g : null, true);
        return TT.ev.good('Bạn vượt qua thiên kiếp, hấp thụ thiên địa chi lực!');
      }
      tri.present(c);
      return TT.ev.good(txt);
    }
  };
})();


