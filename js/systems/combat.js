// Chiến đấu tự động theo hiệp: so công kích, niệm lực, phòng thủ, may mắn, thuộc tính ngũ hành khắc chế và công pháp.
// Người chơi chỉ chọn chiến thuật tổng quát trước trận: 'cong' (công), 'thu' (thủ), hoặc chạy (opts.flee).
// run(a, b, opts): opts.lethal (đánh tới cùng), opts.tacticA / tacticB, opts.flee (bên A tìm cách thoát), opts.important (tự dùng bùa).
// Kết quả: { win, winner, loser, rounds, ended, dmgA, dmgB, fled, elemA, elemB, notes }
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats;

  const TACTICS = { cong: { dealt: 1.25, taken: 1.15 }, thu: { dealt: 0.8, taken: 0.65 } };

  // Khắc chế: key khắc các thuộc tính trong mảng. Ngũ hành tương khắc cộng thêm vài khắc chế cho các biến dị.
  const KHAC = {
    Kim: ['Mộc'], Mộc: ['Thổ'], Thổ: ['Thủy'], Thủy: ['Hỏa'], Hỏa: ['Kim'],
    Lôi: ['Thủy', 'Âm'], Băng: ['Hỏa', 'Phong'], Phong: ['Thổ', 'Mộc'], Âm: ['Dương'], Dương: ['Âm', 'Băng']
  };
  const beats = (a, b) => (KHAC[a] || []).indexOf(b) >= 0;

  // Thuộc tính chính của một bên: công pháp chính (nếu có) hoặc thuộc tính tư chất cao nhất.
  function mainElem(c) {
    const t = c.kind === 'player' && TT.tech.main(c);
    if (t && t.elem) return t.elem;
    const a = c.tuchat && c.tuchat.attrs.reduce((m, x) => (x.p > m.p ? x : m), c.tuchat.attrs[0]);
    return a ? a.n : null;
  }
  // Hệ số khắc chế khi bên "att" tấn công "def": 1 + 0.25 nếu khắc, 1 - 0.2 nếu bị khắc, tính theo trọng số tư chất của bên phòng thủ.
  function elemMul(att, def) {
    const e = mainElem(att);
    if (!e || !def.tuchat || !def.tuchat.total) return 1;
    let adv = 0;
    def.tuchat.attrs.forEach(x => {
      const w = x.p / def.tuchat.total;
      if (beats(e, x.n)) adv += 0.3 * w * 2;
      else if (beats(x.n, e)) adv -= 0.25 * w * 2;
    });
    const re = att.kind === 'player' && TT.items.relicElem(att);
    if (re) def.tuchat.attrs.forEach(x => { if (beats(re, x.n)) adv += 0.03 * (x.p / def.tuchat.total) * 2; });
    return rng.clamp(1 + adv, 0.78, 1.32);
  }

  function side(c, tactic) {
    return { c, hp: c.hp, max: S.hpMax(c), atk: S.atk(c), nl: S.nl(c), def: c.realm * 4 + c.trainHp * 0.1, t: TACTICS[tactic] || { dealt: 1, taken: 1 } };
  }

  // Sức chiến đấu gần đúng (để NPC cân nhắc có dám đánh không).
  function power(c) { return S.atk(c) + S.nl(c) * 0.25 + c.realm * 6; }

  function hit(a, b) {
    let d = (a.atk * rng.R(0.8, 1.25) + a.nl * 0.25) * a.t.dealt * b.t.taken * elemMul(a.c, b.c);
    if (rng.P(0.06 + Math.max(0, S.luck(a.c)) * 0.004)) d *= 1.8; // đòn chí mạng
    d *= 1 / (1 + b.def / 60);
    return Math.max(1, d);
  }

  const combat = TT.combat = {
    power, elemMul, mainElem, beats,

    // Tạo "quái vật" cho trận đánh (không nằm trong thế giới). def: D.MONSTERS; realm: cảnh giới; f: hệ số sức mạnh.
    makeMonster(def, realm, f) {
      f = (f || 1) * (def.f || 1);
      const hpBase = 100 + realm * 40;
      return {
        id: 0, kind: 'monster', name: def.n, alive: true, realm, gender: 'nam', birthMonth: 0,
        baseAtk: Math.round((6 + rng.RI(0, 3)) * f), baseNl: Math.round((8 + rng.RI(0, 4)) * f), baseKv: 0, baseLuck: 0,
        trainHp: Math.round(hpBase * (f - 1)), trainAtk: 0, trainNl: 0, traitIds: [],
        tuchat: { total: 60, attrs: [{ n: def.elem, di: false, p: 60 }] }, hp: 0, def
      };
    },

    // Đánh một trận. Cả hai bên được cập nhật sinh lực (bên thua không xuống dưới 1 nếu không đánh tới cùng).
    run(ac, bc, opts) {
      opts = opts || {};
      const A = side(ac, opts.tacticA), B = side(bc, opts.tacticB);
      if (bc.kind === 'monster') { bc.hp = B.max; B.hp = B.max; }
      const notes = [];
      // Bùa của người chơi tự dùng trong trận quan trọng (kẻ thù tìm đến, thủ lĩnh...).
      if (opts.important) [[ac, A], [bc, B]].forEach(x => {
        if (x[0].kind !== 'player') return;
        if (TT.items.remove(x[0], 'ho_than_bua')) { x[1].t = { dealt: x[1].t.dealt, taken: x[1].t.taken * 0.7 }; notes.push('Hộ Thân Phù bao quanh'); TT.log(x[0], 'Bạn kích hoạt Hộ Thân Phù, một vầng sáng bao quanh.', 'good'); }
        if (TT.items.remove(x[0], 'cong_kich_bua')) { x[1].t = { dealt: x[1].t.dealt * 1.3, taken: x[1].t.taken }; notes.push('Liệt Diễm Phù bùng cháy'); TT.log(x[0], 'Bạn kích hoạt Liệt Diễm Phù, lửa bùng quanh kiếm.', 'good'); }
      });
      if (opts.edgeB) B.t = { dealt: B.t.dealt * opts.edgeB, taken: B.t.taken }; // kẻ thù có chuẩn bị trước, ra đòn mạnh hơn
      const mulA = elemMul(ac, bc), mulB = elemMul(bc, ac);
      if (mulA >= 1.12) notes.push('thuộc tính của bạn khắc chế đối thủ'); else if (mulA <= 0.9) notes.push('thuộc tính của bạn bị đối thủ khắc chế');
      const startA = A.hp, startB = B.hp;
      // Chạy trốn: thành công thì kết thúc ngay, thất bại thì ăn một đòn rồi buộc phải thủ.
      if (opts.flee) {
        const spdA = S.nl(ac) + ac.realm * 5 + (mainElem(ac) === 'Phong' ? 6 : 0), spdB = S.nl(bc) + bc.realm * 5 + (mainElem(bc) === 'Phong' ? 6 : 0);
        const p = rng.clamp(0.45 + (spdA - spdB) / Math.max(1, spdA + spdB) * 0.8, 0.1, 0.9);
        if (rng.P(p)) return { win: false, fled: true, winner: bc, loser: ac, rounds: 0, ended: 'fled', dmgA: 0, dmgB: 0, notes };
        A.hp -= hit(B, A); A.t = TACTICS.thu; notes.push('chạy không thoát, bị đánh trúng');
      }
      let rounds = 0, ended = 'time';
      const yieldAt = opts.lethal ? 0 : 0.2;
      while (rounds < 14) {
        rounds++;
        B.hp -= hit(A, B);
        if (B.hp <= B.max * yieldAt) { ended = B.hp <= 0 ? 'ko' : 'yield'; break; }
        A.hp -= hit(B, A);
        if (A.hp <= A.max * yieldAt) { ended = A.hp <= 0 ? 'ko' : 'yield'; break; }
      }
      const fa = A.hp / A.max, fb = B.hp / B.max;
      const win = fa === fb ? rng.P(0.5) : fa > fb;
      const floor = opts.lethal ? 0 : 1;
      ac.hp = Math.max(floor, Math.min(ac.hp, A.hp));
      if (bc.kind !== 'monster') bc.hp = Math.max(floor, Math.min(bc.hp, B.hp)); else bc.hp = Math.max(0, B.hp);
      return {
        win, winner: win ? ac : bc, loser: win ? bc : ac, rounds, ended, fled: false,
        dmgA: Math.round(startA - ac.hp), dmgB: Math.round(startB - Math.max(0, B.hp)), elemA: mulA, elemB: mulB, notes
      };
    }
  };
  // Bản cũ: đánh nhanh không chọn chiến thuật.
  combat.quick = combat.run;
})();
