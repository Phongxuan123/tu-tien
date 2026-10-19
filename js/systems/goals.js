// Mục tiêu đời của người chơi: có thanh tiến độ và hạn (tuổi). Hoàn thành được thưởng, trễ hạn bị phạt đạo tâm.
// Mỗi mục tiêu là dữ liệu thuần { id, kind, target, byAge, startAge, text }; logic của từng loại nằm ở KINDS.
// Các mốc sau thêm loại mới (tông môn, đạo lữ, nghề...) bằng cách gắn thêm vào TT.goals.KINDS.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats;

  const FAME_STEPS = [[30, 'Có chút tiếng tăm'], [100, 'Nổi danh'], [300, 'Lừng lẫy một phương'], [800, 'Danh chấn thiên hạ']];

  // Ước lượng tu vi tích lũy mỗi năm theo hướng đi hiện tại (để đặt hạn hợp lý).
  function xpPerYear(c) {
    const E = TT.map.effects(c);
    const place = TT.map.linhFactor(E.stats) * TT.map.trainBonus(c, E.reg) * E.train;
    const dir = D.DIRECTIONS[c.direction] || D.DIRECTIONS.can_bang;
    let tot = 0; Object.keys(dir.w).forEach(k => { tot += dir.w[k]; });
    const share = dir.w.train / tot;
    return Math.max(0.05, 6 * (1 + c.realm * 1.2) * S.trainMul(c) * D.TRAIN_RATE * place * share);
  }

  const KINDS = {
    realm: {
      make(c) {
        const target = c.realm + 1;
        if (target > 6) return null;
        const yrs = (D.NEED[c.realm] - c.xp) / xpPerYear(c);
        const fort = Math.max(0, D.FORTUNE_NEED[c.realm] - c.fortune) / 0.35;
        const total = Math.ceil(Math.max(yrs, fort) * 1.3 + 3);
        const age = TT.age(c);
        if (age + total > S.lifeSpan(c) - 2 || total > 80) return null;
        return { kind: 'realm', target, byAge: age + total, text: 'Đột phá lên ' + D.REALM_NAMES[target] };
      },
      progress: (c, g) => Math.min(1, (c.realm + Math.min(1, c.xp / D.NEED[Math.min(5, c.realm)])) / g.target),
      done: (c, g) => c.realm >= g.target,
      reward: { dao: 3, tcd: 2, danh: 5 }
    },
    gold: {
      make(c) {
        const target = Math.max(100, Math.round((TT.ls.wealth(c) * 2 + 60) / 50) * 50);
        return { kind: 'gold', target, byAge: TT.age(c) + 15, text: 'Tích lũy ' + TT.ls.fmt(target) + ' tài sản' };
      },
      progress: (c, g) => Math.min(1, TT.ls.wealth(c) / g.target),
      done: (c, g) => TT.ls.wealth(c) >= g.target,
      reward: { dao: 1, tcd: 1, danh: 1 }
    },
    friend: {
      make(c) {
        const have = TT.rel.list(c).filter(x => x.c && x.r.v >= 40).length;
        const target = Math.max(3, have + 2);
        return { kind: 'friend', target, byAge: TT.age(c) + 15, text: 'Có ' + target + ' bạn bè thân thiết' };
      },
      progress: (c, g) => Math.min(1, friends(c) / g.target),
      done: (c, g) => friends(c) >= g.target,
      reward: { dao: 3, tcd: 1, danh: 2 }
    },
    explore: {
      make(c) {
        const n = TT.map.placesOf(c.region).length;
        return { kind: 'explore', target: n, region: c.region, byAge: TT.age(c) + 15, text: 'Đi khắp ' + n + ' địa điểm của ' + TT.map.region(c.region).n };
      },
      progress: (c, g) => Math.min(1, visitedIn(c, g.region) / g.target),
      done: (c, g) => visitedIn(c, g.region) >= g.target,
      reward: { dao: 2, tcd: 2, danh: 3 }
    },
    fame: {
      make(c) {
        const danh = (c.rep && c.rep.danh) || 0;
        const st = FAME_STEPS.find(s => s[0] > danh);
        if (!st) return null;
        return { kind: 'fame', target: st[0], byAge: TT.age(c) + 20, text: 'Đạt danh vọng "' + st[1] + '" (' + st[0] + ' điểm)' };
      },
      progress: (c, g) => Math.min(1, ((c.rep && c.rep.danh) || 0) / g.target),
      done: (c, g) => ((c.rep && c.rep.danh) || 0) >= g.target,
      reward: { dao: 2, tcd: 2, danh: 0 }
    },
    revenge: {
      make(c) {
        const e = TT.rel.list(c).find(x => x.c && x.c.alive && x.r.k === 'thu' && x.r.by !== c.id);
        if (!e) return null;
        return { kind: 'revenge', target: e.id, byAge: TT.age(c) + 12, text: 'Giải quyết mối thù với ' + e.c.name };
      },
      progress: (c, g) => (KINDS.revenge.done(c, g) ? 1 : 0),
      done(c, g) {
        const o = TT.world.chars[g.target], r = o && TT.rel.get(c, o);
        return !o || !o.alive || !r || r.k !== 'thu';
      },
      reward: { dao: 3, tcd: 3, danh: 4 }
    }
  };

  function friends(c) { return TT.rel.list(c).filter(x => x.c && x.r.v >= 40).length; }
  function visitedIn(c, rid) {
    let n = 0;
    TT.map.placesOf(rid).forEach(p => { if (c.visited && c.visited[p.id]) n++; });
    return n;
  }

  const goals = TT.goals = {
    KINDS,
    MAX: 3,

    kindLabel: { realm: 'Cảnh giới', gold: 'Của cải', friend: 'Bạn bè', explore: 'Khám phá', fame: 'Danh tiếng', revenge: 'Ân oán' },

    // Ghi nhận nhân vật đã ghé địa điểm (cho mục tiêu khám phá).
    touch(c) {
      if (c.place && !c.travel && !c.cross) { c.visited = c.visited || {}; c.visited[c.place] = 1; }
    },

    progress(c, g) { const k = KINDS[g.kind]; return k ? k.progress(c, g) : 0; },
    active(c) { return (c.goals || []).filter(g => g.state === 'on'); },

    suggest(c) {
      const have = goals.active(c).map(g => g.kind);
      const order = ['realm', 'gold', 'friend', 'explore', 'fame', 'revenge'];
      // Hướng đi quyết định mục tiêu nào được ưu tiên đề xuất đầu.
      const first = { tu_luyen: 'realm', kiem_song: 'gold', phieu_luu: 'explore', giao_du: 'friend', can_bang: 'realm' }[c.direction] || 'realm';
      order.sort((a, b) => (a === first ? -1 : 0) - (b === first ? -1 : 0));
      const out = [];
      order.forEach(k => {
        if (out.length >= 3 || have.indexOf(k) >= 0) return;
        const g = KINDS[k].make(c);
        if (g) out.push(g);
      });
      return out;
    },

    accept(c, g) {
      if (!g || goals.active(c).length >= goals.MAX) return false;
      c.goals = c.goals || [];
      const w = TT.world;
      w.nextGoal = (w.nextGoal || 1);
      const goal = Object.assign({ id: w.nextGoal++, startAge: TT.age(c), state: 'on' }, g);
      c.goals.push(goal);
      TT.log(c, 'Mục tiêu đời mới: ' + goal.text + ' (trước ' + goal.byAge + ' tuổi).', 'big');
      return true;
    },

    // Hỏi người chơi chọn mục tiêu (tầng 2). Trả về true nếu đã tạo hộp quyết định.
    prompt(c) {
      if (goals.active(c).length >= goals.MAX) return false;
      const sug = goals.suggest(c);
      if (!sug.length) return false;
      c.goalPromptAt = TT.world.months;
      const choices = sug.map(g => ({ key: g.kind, label: g.text + ' (trước ' + g.byAge + ' tuổi)' }));
      choices.push({ key: 'none', label: 'Chưa muốn đặt mục tiêu' });
      TT.decisions.request({
        type: 'goal', charId: c.id, tier: 2, title: 'Chọn mục tiêu đời',
        text: 'Mục tiêu giúp bạn có đích để hướng tới: có thanh tiến độ và hạn chót. Hoàn thành được thưởng đạo tâm, đạo điểm và Thiên cơ điểm; trễ hạn sẽ làm đạo tâm tổn thương. Bạn có thể giữ tối đa ' + goals.MAX + ' mục tiêu.',
        choices, def: 0, sug, timeout: 15
      });
      return true;
    },

    // Mỗi năm: xét hoàn thành hoặc trễ hạn, rồi đề nghị mục tiêu mới nếu đang trống.
    yearly(c) {
      const age = TT.age(c);
      goals.active(c).forEach(g => {
        const k = KINDS[g.kind];
        if (!k) { g.state = 'fail'; return; }
        if (k.done(c, g)) {
          g.state = 'done';
          const r = k.reward;
          TT.ev.dao(c, r.dao); c.tcd += r.tcd; c.daoDiem += r.dao;
          if (r.danh) TT.rep.add(c, 'danh', r.danh);
          TT.log(c, 'Hoàn thành mục tiêu: ' + g.text + '! Đạo tâm +' + r.dao + ', Thiên cơ điểm +' + r.tcd + '.', 'big');
          TT.news(c.name + ' đã đạt được một mục tiêu đời: ' + g.text + '.', 'good', [c.id]);
        } else if (age > g.byAge) {
          g.state = 'fail';
          TT.ev.dao(c, -2);
          TT.log(c, 'Trễ hạn mục tiêu: ' + g.text + '. Đạo tâm tổn thương chút ít.', 'bad');
        }
      });
      if (c.goals && c.goals.length > 12) c.goals = c.goals.filter(g => g.state === 'on').concat(c.goals.filter(g => g.state !== 'on').slice(-6));
      if (!c.alive || TT.world.pending) return;
      const since = TT.world.months - (c.goalPromptAt || -999);
      if (goals.active(c).length === 0 && since >= 36) goals.prompt(c);
      else if (goals.active(c).length < goals.MAX && since >= 12 * 15) goals.prompt(c);
    }
  };
})();
