// Hệ nhiệm vụ của người chơi (thay hệ mục tiêu cũ). Ba tầng ngắn/trung/dài, bốn bậc độ khó tính theo tốc độ thật của nhân vật,
// phần thưởng và hình phạt tùy người giao (bản thân, người quen, tông môn, thế lực, Thiên Đạo), bảng ưu tiên có thứ tự,
// nhiệm vụ cấp bách tự lên đầu, và cửa sổ "Xem xét nhiệm vụ" định kỳ. Dữ liệu cấu hình ở js/data/quests.js.
// Lưu: c.quests = [nhiệm vụ] (mọi trạng thái, cắt bớt cái cũ); c.qs = { h: lịch sử mẫu, offers, lock, rev, off, pen, heavenAt, stats }.
// Nhiệm vụ là dữ liệu thuần; logic từng loại nằm ở K. Tương thích tên cũ: TT.goals.touch/active/progress/yearly.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats, Q = D.QUEST;

  const clamp01 = x => Math.max(0, Math.min(1, x));
  const r1 = x => Math.round(x * 10) / 10;
  const friends = c => TT.rel.list(c).filter(x => x.c && x.r.v >= 40).length;
  const visitedIn = (c, rid) => { let n = 0; TT.map.placesOf(rid).forEach(p => { if (c.visited && c.visited[p.id]) n++; }); return n; };
  const danh = c => (c.rep && c.rep.danh) || 0;
  const need = c => (c.realm < 6 ? D.NEED[Math.min(5, c.realm)] : Infinity);
  const lvl = c => (c.realm >= 6 ? 6 : c.realm + Math.min(1, c.xp / need(c)));
  const tierIdx = t => Q.ORDER.indexOf(t);

  // ---------- tốc độ thật của nhân vật ----------
  // Ước lượng tu vi mỗi năm (theo hướng đi hiện tại), tính theo phần nhu cầu cảnh giới.
  function xpEst(c) {
    if (c.realm >= 6) return 0.001;
    const E = TT.map.effects(c);
    const place = TT.map.linhFactor(E.stats) * TT.map.trainBonus(c, E.reg) * E.train;
    const dir = D.DIRECTIONS[c.direction] || D.DIRECTIONS.can_bang;
    let tot = 0; Object.keys(dir.w).forEach(k => { tot += dir.w[k]; });
    const share = dir.w.train / tot;
    const xp = 6 * (1 + c.realm * 1.2) * S.trainMul(c) * D.TRAIN_RATE * place * share;
    return Math.max(0.004, xp / need(c));
  }
  // Trung vị mức tăng mỗi năm của một chỉ số trong lịch sử mẫu (ít bị lệch bởi khoản lớn bất thường).
  function med(h, key) {
    const v = [];
    for (let i = 1; i < h.length; i++) v.push((h[i][key] - h[i - 1][key]) / Math.max(1, h[i].a - h[i - 1].a));
    v.sort((x, y) => x - y); return v.length ? v[Math.floor(v.length / 2)] : 0;
  }
  function rates(c) {
    const h = qs(c).h, K = Q;
    const est = xpEst(c) * K.K_XP;
    const fW = 3 * Math.pow(4, c.realm) * K.K_GOLD, fD = 0.3 * (1 + c.realm);
    let rL = est, rW = fW, rD = fD;
    if (h.length >= 3) {
      const a = h[Math.max(0, h.length - 6)], b = h[h.length - 1], dy = Math.max(1, b.a - a.a);
      rL = 0.5 * est + 0.5 * Math.min(3 * est, Math.max(0.7 * est, (b.L - a.L) / dy));
      rW = 0.5 * fW + 0.5 * Math.max(0.3 * fW, med(h, 'w') * K.K_GOLD);
      rD = 0.5 * fD + 0.5 * Math.max(0.3 * fD, med(h, 'd'));
    }
    return { rL, rW, rD, rF: 0.1, rE: 0.35 };
  }

  // ---------- loại nhiệm vụ ----------
  // build(c, y, f, R) trả { f, y?, q } hoặc null; f thực tế = yêu cầu / (tốc độ x số năm). prog/done đọc trạng thái hiện tại.
  const K = {
    xp: {
      tiers: 'sml', n: 'Tu vi',
      build(c, y, f, R) {
        if (c.realm >= 6) return null;
        const L0 = lvl(c), cap = c.realm + 1;
        const gain = Math.min(R.rL * y * f, cap - L0);
        if (gain < 0.03) return null;
        const fe = gain / (R.rL * y);
        return { f: fe, q: { base: L0, target: L0 + gain, text: 'Tích lũy tu vi thêm ' + Math.round(gain * 100) + '% nhu cầu của ' + D.REALM_NAMES[c.realm] } };
      },
      prog: (c, q) => clamp01((lvl(c) - q.base) / (q.target - q.base)),
      done: (c, q) => lvl(c) >= q.target - 1e-9
    },
    realm: {
      tiers: 'ml', n: 'Cảnh giới',
      build(c, y, f, R) {
        const target = c.realm + 1;
        if (target > 6 || c.realm >= 5) return null;
        const needYr = Math.max((target - lvl(c)) / R.rL, Math.max(0, D.FORTUNE_NEED[c.realm] - c.fortune) / 0.35);
        return { f, need: needYr, q: { base: lvl(c), target, text: 'Đột phá lên ' + D.REALM_NAMES[target] } };
      },
      prog: (c, q) => clamp01((lvl(c) - q.base) / (q.target - q.base)),
      done: (c, q) => c.realm >= q.target
    },
    gold: {
      tiers: 'sml', n: 'Của cải',
      build(c, y, f, R) {
        const w0 = TT.ls.wealth(c), gain = Math.max(30, Math.round(R.rW * y * f / 10) * 10);
        return { f: gain / (R.rW * y), q: { base: w0, target: w0 + gain, text: 'Tích lũy thêm ' + TT.ls.fmt(gain) + ' tài sản (đạt ' + TT.ls.fmt(w0 + gain) + ')' } };
      },
      prog: (c, q) => clamp01((TT.ls.wealth(c) - q.base) / (q.target - q.base)),
      done: (c, q) => TT.ls.wealth(c) >= q.target
    },
    friend: {
      tiers: 'ml', n: 'Bạn bè',
      build(c, y, f, R) {
        if (y < 6) return null;
        const have = friends(c), n = Math.max(1, Math.round(R.rF * y * f));
        return { f: n / (R.rF * y), q: { base: have, target: have + n, text: 'Có thêm ' + n + ' bạn thân thiết (đủ ' + (have + n) + ')' } };
      },
      prog: (c, q) => clamp01((friends(c) - q.base) / (q.target - q.base)),
      done: (c, q) => friends(c) >= q.target
    },
    explore: {
      tiers: 'sml', n: 'Khám phá',
      build(c, y, f, R) {
        const total = TT.map.placesOf(c.region).length, v = visitedIn(c, c.region), rem = total - v;
        if (rem < 2) return null;
        const take = Math.min(rem, Math.max(2, Math.round(R.rE * y * f)));
        return { f: take / (R.rE * y), q: { base: v, target: v + take, region: c.region, text: 'Ghé thêm ' + take + ' địa điểm mới ở ' + TT.map.region(c.region).n } };
      },
      prog: (c, q) => clamp01((visitedIn(c, q.region) - q.base) / (q.target - q.base)),
      done: (c, q) => visitedIn(c, q.region) >= q.target
    },
    fame: {
      tiers: 'ml', n: 'Danh tiếng',
      build(c, y, f, R) {
        const gain = Math.max(3, Math.round(R.rD * y * f));
        return { f: gain / (R.rD * y), q: { base: danh(c), target: danh(c) + gain, text: 'Tăng danh vọng thêm ' + gain + ' điểm' } };
      },
      prog: (c, q) => clamp01((danh(c) - q.base) / (q.target - q.base)),
      done: (c, q) => danh(c) >= q.target
    },
    // Đơn hàng nghề: cần có nghề chính; tiến độ là số đơn đã làm xong (c.job.done), xong đơn khi kiếm sống hoặc luyện nghề.
    order: {
      tiers: 'sm', n: 'Đơn hàng',
      build(c, y, f, R, giver, tier) {
        const j = c.job; if (!j || !j.main) return null;
        const r = TT.job.orderRate(c) * Q.TIER_K[tier], n = Math.max(1, Math.round(r * y * f));
        const jn = D.JOBS[j.main].n.toLowerCase();
        return { f: n / Math.max(0.2, r * y), q: { base: j.done, target: j.done + n, job: j.main, tag: TT.job.isCraft(j.main) ? 'craft' : 'coin', text: 'Hoàn thành ' + n + ' đơn hàng nghề ' + jn } };
      },
      prog: (c, q) => clamp01(((c.job ? c.job.done : 0) - q.base) / (q.target - q.base)),
      done: (c, q) => !!c.job && c.job.done >= q.target
    },
    revenge: {
      tiers: 'm', n: 'Ân oán',
      build(c) {
        const e = TT.rel.list(c).find(x => x.c && x.c.alive && x.r.k === 'thu' && x.r.by !== c.id);
        if (!e) return null;
        return { f: 0.95, q: { base: 0, target: e.id, text: 'Giải quyết mối thù với ' + e.c.name } };
      },
      prog: (c, q) => (K.revenge.done(c, q) ? 1 : 0),
      done(c, q) { const o = TT.world.chars[q.target], r = o && TT.rel.get(c, o); return !o || !o.alive || !r || r.k !== 'thu'; },
      fixed: true
    },
    clear: {
      tiers: 'ml', n: 'Bí cảnh',
      build(c) {
        if (c.realm < 1) return null;
        const b = c.clears || 0;
        return { f: 1.5, q: { base: b, target: b + 1, text: 'Thông quan thêm một bí cảnh' } };
      },
      prog: (c, q) => ((c.clears || 0) >= q.target ? 1 : 0),
      done: (c, q) => (c.clears || 0) >= q.target,
      fixed: true
    },
    // Nhiệm vụ do thế lực giao theo hiệp ước (S7, F2): chỉ khi D.COURT.on. Tiến độ ghi trong q.got, không đổi theo cảnh giới.
    // Hộ tống cống: có mặt trong vùng của đoàn cống trong n năm.
    ho_tong: {
      tiers: 'ml', n: 'Hộ tống cống phẩm', fixed: true, keep: true,
      build(c, y, f) {
        const p = D.COURT.on && TT.court.questPact(c.region, ['cong', 'thue', 'chu_hau'], 'ok'); if (!p) return null;
        const n = Math.max(2, Math.round(y / 3)), a = TT.fac.get(p.a), b = TT.fac.get(p.b);
        return { f, gname: b.n, q: { base: 0, target: n, got: 0, pact: p.id, region: c.region, text: 'Hộ tống đoàn cống của ' + a.n + ' sang ' + b.n + ', đi cùng ' + n + ' năm trong vùng ' + TT.map.region(c.region).n } };
      },
      prog: (c, q) => clamp01((q.got || 0) / q.target),
      done: (c, q) => (q.got || 0) >= q.target,
      step(c, q) { if (c.region === q.region) q.got = (q.got || 0) + 1; }
    },
    // Đòi nợ cống: thu lại phần cống còn nợ (p.owed) khi có mặt trong vùng; thu được thì bên hưởng được một phần.
    doi_no: {
      tiers: 'ml', n: 'Đòi nợ cống', fixed: true, keep: true,
      build(c, y, f) {
        const p = D.COURT.on && TT.court.questPact(c.region, ['cong', 'thue', 'chu_hau'], 'owed'); if (!p) return null;
        const n = Math.max(3, Math.min(Math.round(p.owed), Math.round(y * 0.8))), a = TT.fac.get(p.a), b = TT.fac.get(p.b);
        return { f, gname: b.n, q: { base: 0, target: n, got: 0, pact: p.id, region: c.region, text: 'Đòi lại ' + n + ' điểm cống còn nợ của ' + a.n + ' cho ' + b.n } };
      },
      prog: (c, q) => clamp01((q.got || 0) / q.target),
      done: (c, q) => (q.got || 0) >= q.target,
      step(c, q) {
        const p = TT.court.pactById(q.pact); if (!p || c.region !== q.region || !(p.owed > 0) || q.got >= q.target) return;
        const take = Math.min(p.owed, q.target - (q.got || 0), 3), b = TT.fac.get(p.b);
        p.owed -= take; q.got = (q.got || 0) + take;
        if (b) b.wealth = Math.max(0, Math.min(100, b.wealth + take * 0.6));
      }
    },
    // Dẹp loạn: có mặt trong vùng đang loạn dân trong n năm; mỗi năm có mặt thì dân bớt bất mãn một chút.
    dep_loan: {
      tiers: 'sm', n: 'Dẹp loạn', fixed: true, keep: true,
      build(c, y, f) {
        if (!D.COURT.on || !TT.pop.unrest(c.region)) return null;
        const n = Math.max(2, Math.round(y * 0.4));
        return { f, q: { base: 0, target: n, got: 0, region: c.region, text: 'Dẹp loạn dân ở ' + TT.map.region(c.region).n + ', có mặt ở đó ' + n + ' năm' } };
      },
      prog: (c, q) => clamp01((q.got || 0) / q.target),
      done: (c, q) => (q.got || 0) >= q.target,
      step(c, q) { if (c.region === q.region) { q.got = (q.got || 0) + 1; const g = TT.pop.get(q.region); if (g) g.mood = Math.min(100, g.mood + 3); } }
    }
  };

  // ---------- lưu trữ ----------
  function qs(c) {
    if (!c.qs) c.qs = { h: [], offers: [], lock: false, rev: TT.world.months, off: -999, pen: { a: -1, v: 0 }, heavenAt: -999, stats: { done: 0, fail: 0, drop: 0 }, want: '' };
    return c.qs;
  }
  const list = c => (c.quests = c.quests || []);
  const active = c => list(c).filter(q => q.state === 'on');
  const byId = (c, id) => list(c).find(q => q.id === id);
  const sorted = c => active(c).sort((a, b) => a.rank - b.rank);
  function renumber(c) { sorted(c).forEach((q, i) => { q.rank = i + 1; }); }

  function pathTag(c) { return Q.DIR_TAG[c.direction] || null; }
  function relation(c, tag) {
    const p = pathTag(c);
    if (!p || !tag) return 0;
    if (tag === p) return 1;
    return (Q.OPPOSE[p] || []).indexOf(tag) >= 0 ? -1 : 0;
  }
  function diffIdx(f) { let b = 0; Q.DIFF.forEach((d, i) => { if (Math.abs(d.f - f) < Math.abs(Q.DIFF[b].f - f)) b = i; }); return b; }

  // ---------- thưởng phạt ----------
  function rewardFor(c, q, R, y) {
    const ti = tierIdx(q.tier), f2 = q.f * q.f, uL = R.rL * y, uW = R.rW * y, g = q.giver.t, rw = {};
    if (g === 'self') { rw.xpL = (q.kind === 'xp' || q.kind === 'realm') ? 0 : Math.min(0.2, 0.2 * uL * f2); rw.dao = [1, 2, 4][ti]; rw.tcd = [0, 1, 2][ti]; rw.danh = [0, 1, 3][ti]; }
    else if (g === 'npc') { rw.gold = Math.max(20, 0.6 * uW * f2); rw.rel = 8 + 4 * ti; rw.dao = 1; }
    else if (g === 'sect') { rw.cong = 25 * (1 + c.realm) * [1, 3, 8][ti] * f2; rw.danh = [0, 1, 2][ti]; }
    else if (g === 'fac') { rw.gold = Math.max(30, 0.8 * uW * f2); rw.danh = [1, 3, 6][ti]; }
    else { rw.tcd = 3 + Math.round(2 * q.f); rw.dao = 8; rw.xpL = Math.min(0.2, 0.1 * (1 + uL)); }
    const lf = Math.max(0.6, Math.min(2, q.f / 0.8)); // phần thưởng không theo tiền/tu vi tăng thẳng theo độ khó
    ['dao', 'tcd', 'danh', 'rel'].forEach(k => { if (rw[k]) rw[k] *= lf; });
    const m = q.rel === 1 ? Q.ALIGN_BONUS : q.rel === -1 ? Q.AGAINST_BONUS : 1;
    Object.keys(rw).forEach(k => { rw[k] = k === 'xpL' ? Math.round(rw[k] * m * 1000) / 1000 : Math.max(0, Math.round(rw[k] * m)); });
    return rw;
  }
  function rewardText(q) {
    const r = q.rew, t = [];
    if (r.xpL) t.push('tu vi +' + Math.round(r.xpL * 100) + '% cảnh giới');
    if (r.gold) t.push(TT.ls.fmt(r.gold));
    if (r.cong) t.push('cống hiến +' + r.cong);
    if (r.danh) t.push('danh vọng +' + r.danh);
    if (r.rel) t.push('thân thiết với ' + q.giver.name + ' +' + r.rel);
    if (r.dao) t.push('đạo tâm +' + r.dao);
    if (r.tcd) t.push('Thiên cơ điểm +' + r.tcd);
    return t.join(', ') || 'không có';
  }
  function penText(q) {
    const g = q.giver.t, ti = tierIdx(q.tier);
    if (g === 'self') return 'bỏ giữa chừng: đạo tâm -' + (1 + ti);
    if (g === 'npc') return 'hỏng hoặc bỏ: thân thiết với ' + q.giver.name + ' -' + (6 + 3 * ti);
    if (g === 'sect') return 'hỏng hoặc bỏ: mất ' + Math.round((q.rew.cong || 0) / 2) + ' cống hiến, mất danh vọng';
    if (g === 'fac') return 'hỏng hoặc bỏ: mất ' + (q.rew.danh || 1) + ' danh vọng';
    return 'hỏng hoặc bỏ: đạo tâm -' + Q.HEAVEN_FAIL_DAO + ' và thiên phạt nhẹ';
  }
  function daoLoss(c, n) {
    const s = qs(c), a = TT.age(c);
    if (s.pen.a !== a) s.pen = { a, v: 0 };
    const take = Math.max(0, Math.min(n, Q.PEN_CAP - s.pen.v));
    s.pen.v += take; if (take) TT.ev.dao(c, -take);
    return take;
  }
  function sectName(c) { const p = c.sect && TT.map.place(c.sect.id); return p ? p.n : 'tông môn'; }

  // Kết thúc một nhiệm vụ: 'done' | 'fail' | 'drop' (bỏ). Áp thưởng hoặc phạt theo người giao.
  function settle(c, q, state, why) {
    const s = qs(c), ti = tierIdx(q.tier), g = q.giver.t, r = q.rew || {}, mul = state === 'drop' ? Q.DROP_MUL : 1;
    q.state = state; q.endAge = TT.age(c); s.stats[state]++;
    if (state === 'done') {
      if (r.xpL && c.realm < 6) c.xp = Math.min(need(c), c.xp + r.xpL * need(c));
      if (r.gold) TT.ls.gain(c, r.gold / D.LS.RATE);
      if (r.cong && c.sect) { c.sect.contrib += r.cong; c.sect.total += r.cong; }
      if (r.danh) TT.rep.add(c, 'danh', r.danh);
      if (r.tcd) c.tcd += r.tcd;
      if (r.dao) { TT.ev.dao(c, r.dao); c.daoDiem += r.dao; }
      const o = g === 'npc' && TT.world.chars[q.giver.id];
      if (o && r.rel) TT.rel.add(c, o, r.rel, 'hoàn thành việc nhờ');
      if (o && o.kind === 'npc') TT.bond.remember(c, o, 'nhiem_vu', 'Làm xong việc ' + o.name + ' nhờ', 1); // 9K
      TT.log(c, 'Hoàn thành nhiệm vụ: ' + q.text + '.', 'big', 'Người giao: ' + q.giver.name + ' · Thưởng: ' + rewardText(q) + '.');
      TT.news(c.name + ' hoàn thành một nhiệm vụ ' + Q.TIERS[q.tier].n.toLowerCase() + ': ' + q.text + '.', 'good', [c.id]);
      TT.report.mark(c, 'quest', 'Xong: ' + q.text);
    } else {
      let lost = [];
      if (g === 'self') { if (state === 'drop') { const t = daoLoss(c, 1 + ti); if (t) lost.push('đạo tâm -' + t); } }
      else if (g === 'npc') {
        const o = TT.world.chars[q.giver.id]; const d = Math.round((6 + 3 * ti) * mul);
        if (o) TT.rel.add(c, o, -d, 'bỏ lỡ việc nhờ'); lost.push('thân thiết -' + d);
      } else if (g === 'sect') {
        const d = Math.round((r.cong || 0) / 2 * mul);
        if (c.sect) { c.sect.contrib = Math.max(0, c.sect.contrib - d); lost.push('cống hiến -' + d); }
        TT.rep.add(c, 'danh', -Math.max(1, ti)); lost.push('danh vọng -' + Math.max(1, ti));
      } else if (g === 'fac') {
        const d = Math.max(1, Math.round((r.danh || 1) * mul)); TT.rep.add(c, 'danh', -d); lost.push('danh vọng -' + d);
      } else {
        const t = daoLoss(c, Math.round(Q.HEAVEN_FAIL_DAO * mul)); if (t) lost.push('đạo tâm -' + t);
        TT.loss.hurt(c, 1); lost.push('thiên phạt nhẹ');
        s.heavenAt = TT.world.months;
      }
      TT.log(c, (state === 'drop' ? 'Bỏ nhiệm vụ: ' : 'Nhiệm vụ thất bại: ') + q.text + '.', 'bad', (why ? why + ' · ' : '') + 'Người giao: ' + q.giver.name + (lost.length ? ' · Mất: ' + lost.join(', ') + '.' : '.'));
      TT.report.mark(c, 'quest', (state === 'drop' ? 'Bỏ: ' : 'Hỏng: ') + q.text);
    }
    if (g === 'heaven' && state === 'done') s.heavenAt = TT.world.months;
    renumber(c);
    Q_.want(c, state);
  }

  // ---------- sinh nhiệm vụ ----------
  function slotsFree(c, tier, giver) {
    const n = active(c).filter(q => q.tier === tier && (q.giver.t === 'heaven') === (giver === 'heaven')).length;
    return (giver === 'heaven' ? 1 : Q.TIERS[tier].max) - n;
  }
  function pickDiff(giver) {
    const w = Q.DIFF_W[giver]; let t = 0; w.forEach(x => { t += x; }); let r = rng.R(0, t);
    for (let i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) return i; }
    return 1;
  }
  function giverInfo(c, t) {
    if (t === 'self') return { t, name: 'bản thân' };
    if (t === 'heaven') return { t, name: 'Thiên Đạo' };
    if (t === 'sect') return c.sect ? { t, name: sectName(c) } : null;
    if (t === 'fac') return { t, name: 'thế lực ' + TT.map.region(c.region).n };
    const fr = TT.rel.list(c).filter(x => x.c && x.c.alive && x.r.v >= 40 && x.r.k !== 'thu');
    if (!fr.length) return null;
    const x = rng.pick(fr); return { t, id: x.id, name: x.c.name };
  }

  // Dựng một nhiệm vụ (chưa nhận). Trả null nếu không dựng nổi.
  function make(c, tier, gt, kind) {
    const k = K[kind], gi = giverInfo(c, gt); if (!k || !gi || k.tiers.indexOf(tier) < 0) return null;
    const R = rates(c), tk = Q.TIER_K[tier]; R.rL *= tk; R.rW *= tk; R.rD *= tk; R.rE *= tk;
    const T = Q.TIERS[tier], sc = 1 + 0.5 * c.realm, age = TT.age(c), lifeLeft = S.lifeSpan(c) - age;
    let y = rng.RI(Math.ceil(T.lo * sc), Math.floor(T.hi * sc));
    const f0 = Q.DIFF[gt === 'heaven' ? 2 : pickDiff(gt)].f;
    const res = k.build(c, y, f0, R, gt, tier);
    if (!res) return null;
    let f = res.f;
    if (res.need != null) {
      y = Math.max(Math.ceil(T.lo * sc), Math.min(Math.floor(T.hi * sc), Math.round(res.need / f0)));
      f = res.need / y;
    }
    if (f < 0.2 || f > 1.8) return null;
    if (y > lifeLeft - 2) return null;
    if (gt === 'heaven' && (f < 0.7 || f > 1.3)) return null;
    const tag = res.q.tag || Q.KIND_TAG[kind];
    const q = Object.assign({ kind, tier, giver: gi, f, d: diffIdx(f), startAge: age, byAge: age + y, y0: y, tag, rel: relation(c, tag), state: 'on', rank: 99, ext: 0, urgent: false }, res.q);
    if (gt === 'heaven') q.d = 2;
    if (res.gname) q.giver.name = res.gname; // nhiệm vụ thế lực: tên bên được hưởng cống (S7)
    q.rew = rewardFor(c, q, R, y);
    return q;
  }

  // Nhật ký quyết định giao: xác suất bốc người giao và loại.
  function offerOne(c) {
    const s = qs(c), age = TT.age(c);
    const tiers = Q.ORDER.filter(t => slotsFree(c, t, 'self') > 0 && !s.offers.some(o => o.tier === t && o.giver.t !== 'heaven'));
    if (!tiers.length) return false;
    for (let i = 0; i < 10; i++) {
      const tier = rng.wpick(tiers.map(t => ({ t, w: { s: 3, m: 2, l: 1 }[t] })), x => x.w).t;
      const givers = Object.keys(Q.GIVER_W).filter(g => g !== 'heaven' && (g !== 'sect' || c.sect) && (g !== 'fac' || c.realm >= 1 || danh(c) >= 20));
      const gt = rng.wpick(givers.map(g => ({ g, w: Q.GIVER_W[g] })), x => x.w).g;
      let kinds = Q.GIVER_KINDS[gt].filter(kd => K[kd].tiers.indexOf(tier) >= 0);
      if (!kinds.length) continue;
      const pAgainst = gt === 'self' ? Q.AGAINST_P : Q.AGAINST_P_OTHER;
      const bad = kinds.filter(kd => relation(c, Q.KIND_TAG[kd]) === -1), good = kinds.filter(kd => relation(c, Q.KIND_TAG[kd]) !== -1);
      let pool = kinds;
      if (bad.length && good.length) pool = rng.P(pAgainst) ? bad : good;
      // thế lực có hiệp ước với vùng thì đôi khi giao nhiệm vụ theo hiệp ước (S7, F2)
      let q = gt === 'fac' && D.COURT.on && rng.P(D.COURT.questP) ? make(c, tier, 'fac', rng.pick(Q.FAC_KINDS)) : null;
      if (!q) q = make(c, tier, gt, rng.wpick(pool.map(kd => ({ kd, w: Q.KIND_W[kd] || 1 })), x => x.w).kd);
      if (!q) continue;
      if (s.offers.some(o => o.kind === q.kind && o.giver.t === q.giver.t)) continue;
      q.exp = TT.world.months + Q.OFFER_LIFE;
      s.offers.push(q);
      return true;
    }
    return false;
  }
  function heavenQuest(c) {
    const s = qs(c);
    if (slotsFree(c, 'l', 'heaven') <= 0 || TT.age(c) < 20 || c.realm >= 5) return null;
    if (TT.world.months - s.heavenAt < 12 * 8) return null;
    for (let i = 0; i < 8; i++) { const q = make(c, 'l', 'heaven', i < 3 ? 'realm' : rng.pick(Q.GIVER_KINDS.heaven)); if (q) return q; }
    return null;
  }

  // ---------- hành động của người chơi / máy ----------
  function accept(c, q) {
    if (!q) return false;
    const s = qs(c); const i = s.offers.indexOf(q);
    if (slotsFree(c, q.tier, q.giver.t) <= 0) return false;
    if (i >= 0) s.offers.splice(i, 1);
    const w = TT.world; w.nextQuest = (w.nextQuest || 1);
    q.id = w.nextQuest++; q.state = 'on'; q.startAge = TT.age(c); q.rank = 99; q.exp = 0;
    // đề nghị có thể chờ lâu: tính lại mốc đầu và hạn theo lúc nhận
    q.byAge = q.startAge + q.y0;
    if (q.kind !== 'revenge' && !K[q.kind].keep) {
      const d = q.target - q.base, cur = q.kind === 'gold' ? TT.ls.wealth(c) : q.kind === 'friend' ? friends(c) : q.kind === 'explore' ? visitedIn(c, q.region) : q.kind === 'fame' ? danh(c) : q.kind === 'clear' ? (c.clears || 0) : q.kind === 'order' ? (c.job ? c.job.done : 0) : lvl(c);
      q.base = cur; if (q.kind !== 'realm') q.target = cur + d;
      if (q.kind === 'gold') q.text = 'Tích lũy thêm ' + TT.ls.fmt(Math.round(d / 10) * 10) + ' tài sản (đạt ' + TT.ls.fmt(q.target) + ')';
      if (q.kind === 'friend') q.text = 'Có thêm ' + Math.round(d) + ' bạn thân thiết (đủ ' + Math.round(q.target) + ')';
    }
    list(c).push(q);
    if (q.giver.t === 'heaven') q.rank = 0;
    renumber(c);
    if (q.rel === -1 && q.giver.t === 'self') { /* tự nhận việc ngược đạo: không phạt */ }
    else if (q.rel === -1) { const t = daoLoss(c, 1); void t; }
    TT.log(c, 'Nhận nhiệm vụ ' + Q.TIERS[q.tier].n.toLowerCase() + ': ' + q.text + ' (trước ' + q.byAge + ' tuổi).', 'big',
      'Người giao: ' + q.giver.name + ' · Độ khó: ' + Q.DIFF[q.d].n + (q.rel === -1 ? ' · ngược đạo' : q.rel === 1 ? ' · hợp đạo' : '') + ' · Thưởng: ' + rewardText(q) + '.');
    return true;
  }
  function decline(c, q) { const s = qs(c), i = s.offers.indexOf(q); if (i >= 0) s.offers.splice(i, 1); }
  function drop(c, q) { if (q && q.state === 'on') settle(c, q, 'drop'); }
  function setDiff(c, q, di) {
    const k = K[q.kind]; if (!k || k.fixed || q.giver.t === 'heaven') return false;
    di = Math.max(0, Math.min(3, di)); if (di === q.d) return false;
    const nf = Q.DIFF[di].f, ratio = nf / q.f, m = (nf * nf) / (q.f * q.f);
    let d = (q.target - q.base) * ratio;
    if (q.kind === 'friend' || q.kind === 'explore') d = Math.max(q.kind === 'explore' ? 2 : 1, Math.round(d));
    if (q.kind === 'fame') d = Math.max(3, Math.round(d));
    if (q.kind === 'xp') d = Math.min(d, q.base % 1 === 0 ? 1 : Math.ceil(q.base) - q.base);
    q.target = q.base + d; q.f = nf; q.d = di;
    // xpL, gold, cong tăng theo bình phương hệ số khó; đạo tâm, Thiên cơ điểm, danh vọng, thân thiết chỉ theo tỉ lệ thẳng
    Object.keys(q.rew).forEach(key => {
      const mm = (key === 'xpL' || key === 'gold' || key === 'cong') ? m : ratio;
      q.rew[key] = key === 'xpL' ? Math.round(q.rew[key] * mm * 1000) / 1000 : Math.max(q.rew[key] ? 1 : 0, Math.round(q.rew[key] * mm));
    });
    q.text = q.text.replace(/\d+(?=% nhu cầu)/, Math.round(d * 100)).replace(/thêm \d+ (bạn|địa điểm|điểm)/, (mm, w) => 'thêm ' + Math.round(d) + ' ' + w);
    if (q.kind === 'gold') q.text = 'Tích lũy thêm ' + TT.ls.fmt(Math.round(d / 10) * 10) + ' tài sản (đạt ' + TT.ls.fmt(q.target) + ')';
    TT.log(c, 'Đổi độ khó nhiệm vụ "' + q.text + '" thành ' + Q.DIFF[di].n + '.', 'age', 'Mục tiêu và phần thưởng được tính lại theo độ khó mới.');
    return true;
  }
  function extendCost(q) {
    const g = q.giver.t;
    return g === 'self' ? 'đạo tâm -1' : g === 'npc' ? 'thân thiết -3' : g === 'sect' ? 'mất 10% phần thưởng và 1 danh vọng' : g === 'fac' ? 'danh vọng -1' : 'đạo tâm -5';
  }
  function extend(c, q) {
    if (!q || q.state !== 'on' || q.ext >= 2) return false;
    const g = q.giver.t, add = Math.max(1, Math.round(q.y0 * Q.EXTEND_YEARS));
    if (g === 'self') daoLoss(c, 1);
    else if (g === 'npc') { const o = TT.world.chars[q.giver.id]; if (o) TT.rel.add(c, o, -3, 'xin gia hạn'); }
    else if (g === 'sect' || g === 'fac') TT.rep.add(c, 'danh', -1);
    else daoLoss(c, 5);
    Object.keys(q.rew).forEach(key => { if (key !== 'xpL') q.rew[key] = Math.round(q.rew[key] * 0.85); else q.rew[key] = Math.round(q.rew[key] * 850) / 1000; });
    q.byAge += add; q.ext++; q.urgent = false;
    TT.log(c, 'Gia hạn thêm ' + add + ' năm cho nhiệm vụ: ' + q.text + '.', 'age', 'Đổi lại: ' + extendCost(q) + ', thưởng giảm 15%.');
    return true;
  }
  function move(c, q, dir) {
    const l = sorted(c), i = l.indexOf(q), j = i + dir; if (i < 0 || j < 0 || j >= l.length) return;
    l.splice(i, 1); l.splice(j, 0, q); l.forEach((x, n) => { x.rank = n + 1; });
  }
  function moveTo(c, q, idx) { const l = sorted(c).filter(x => x !== q); l.splice(Math.max(0, Math.min(l.length, idx)), 0, q); l.forEach((x, n) => { x.rank = n + 1; }); }
  function score(c, q) {
    const age = TT.age(c), el = (age - q.startAge) / Math.max(1, q.byAge - q.startAge);
    return (q.urgent ? 100 : 0) + (q.giver.t === 'heaven' ? 30 : 0) + el * 25 + (q.giver.t === 'self' ? 0 : 8) + (2 - tierIdx(q.tier));
  }
  function autoSort(c) { sorted(c).sort((a, b) => score(c, b) - score(c, a)).forEach((q, n) => { q.rank = n + 1; }); }

  // Gợi ý cho một nhiệm vụ: { act, why }.
  function advice(c, q) {
    const age = TT.age(c), tot = Math.max(1, q.byAge - q.startAge), el = clamp01((age - q.startAge) / tot), p = K[q.kind].prog(c, q);
    const proj = el < 0.15 ? 1 : p / el, g = q.giver.t;
    if (q.urgent && p < 0.9 && q.rank > 1) return { act: 'top', why: 'sắp hết hạn mà còn chậm, nên ưu tiên lên đầu' };
    if (proj < 0.55 && el > 0.5) {
      if (g === 'self' && !K[q.kind].fixed && q.d > 0) return { act: 'easier', why: 'khó kịp (dự kiến ' + Math.round(Math.min(1, proj) * 100) + '%), nên hạ độ khó' };
      if (q.ext < 2) return { act: 'extend', why: 'khó kịp, nên gia hạn' };
      return { act: 'drop', why: 'gần như không kịp' };
    }
    if (proj < 0.8 && el > 0.3) return q.rank > 1 ? { act: 'top', why: 'hơi chậm, nên đẩy lên ưu tiên cao' } : { act: 'keep', why: 'hơi chậm nhưng đã ở đầu danh sách' };
    if (proj > 1.3 && el > 0.3 && g === 'self' && !K[q.kind].fixed && q.d < 3) return { act: 'harder', why: 'đang vượt tiến độ, có thể nâng độ khó để thưởng nhiều hơn' };
    return { act: 'keep', why: 'đang đúng tiến độ' };
  }
  function doAct(c, q, act) {
    if (act === 'top') moveTo(c, q, 0);
    else if (act === 'easier') setDiff(c, q, q.d - 1);
    else if (act === 'harder') setDiff(c, q, q.d + 1);
    else if (act === 'extend') extend(c, q);
    else if (act === 'drop') drop(c, q);
    else if (act === 'up') move(c, q, -1);
    else if (act === 'down') move(c, q, 1);
  }

  // ---------- xem xét ----------
  function want(c, why) { if (c.kind !== 'player') return; const s = qs(c); if (!s.want) s.want = why; }

  function acceptBest(c) {
    // nhận các đề nghị còn chỗ, ưu tiên hợp đạo, bỏ cái ngược đạo nếu đang có việc khác
    const s = qs(c);
    s.offers.slice().sort((a, b) => b.rel - a.rel).forEach(o => {
      if (o.rel === -1 && active(c).length >= 2) { decline(c, o); return; }
      if (!accept(c, o)) decline(c, o);
    });
  }
  function applyAdvice(c) {
    sorted(c).forEach(q => { const a = advice(c, q); if (a.act !== 'keep') doAct(c, q, a.act); });
    acceptBest(c); // giữ nguyên thứ tự người chơi đã xếp; chỉ nút "Tự sắp xếp" mới xếp lại cả bảng
  }

  function reviewRows(c) {
    const rows = [], age = TT.age(c);
    sorted(c).forEach(q => {
      const a = advice(c, q), left = q.byAge - age, p = Math.round(K[q.kind].prog(c, q) * 100), fixed = K[q.kind].fixed || q.giver.t === 'heaven';
      rows.push({
        label: '#' + q.rank + ' · ' + Q.TIERS[q.tier].n + ' · ' + q.text + (q.urgent ? ' · CẤP BÁCH' : ''),
        info: q.giver.name + ' · ' + Q.DIFF[q.d].n + ' · ' + p + '% · còn ' + Math.max(0, left) + ' năm · Gợi ý: ' + a.why + ' (' + penText(q) + ')',
        btns: [
          { key: 'qa:top:' + q.id, label: 'Lên đầu', disabled: q.rank === 1 },
          { key: 'qa:easier:' + q.id, label: 'Hạ độ khó', disabled: fixed || q.d <= 0 },
          { key: 'qa:harder:' + q.id, label: 'Nâng độ khó', disabled: fixed || q.d >= 3 },
          { key: 'qa:extend:' + q.id, label: 'Gia hạn (' + extendCost(q) + ')', disabled: q.ext >= 2 },
          { key: 'qa:drop:' + q.id, label: 'Bỏ' }
        ]
      });
    });
    qs(c).offers.forEach((o, i) => {
      rows.push({
        label: 'Đề nghị: ' + Q.TIERS[o.tier].n + ' · ' + o.text + (o.rel === -1 ? ' · NGƯỢC ĐẠO' : o.rel === 1 ? ' · hợp đạo' : ''),
        info: o.giver.name + ' · ' + Q.DIFF[o.d].n + ' (khoảng ' + Q.DIFF[o.d].p + '% thành công) · hạn ' + o.byAge + ' tuổi · Thưởng: ' + rewardText(o) + ' · ' + penText(o),
        btns: [
          { key: 'qo:acc:' + i, label: 'Nhận', disabled: slotsFree(c, o.tier, o.giver.t) <= 0 ? 'Hết chỗ cho tầng này: bỏ bớt một nhiệm vụ cùng tầng.' : false },
          { key: 'qo:no:' + i, label: 'Từ chối' }
        ]
      });
    });
    return rows;
  }
  const REASON = {
    done: 'Bạn vừa hoàn thành một nhiệm vụ.', fail: 'Một nhiệm vụ vừa thất bại.', drop: 'Bạn vừa bỏ một nhiệm vụ.', offer: 'Có nhiệm vụ mới được đề nghị.',
    big: 'Vừa có biến cố lớn trong đời bạn.', time: 'Đã lâu bạn chưa xem lại các nhiệm vụ.', heaven: 'Thiên Đạo ban cho bạn một đại nguyện.'
  };
  function review(c, replace) {
    const s = qs(c), rows = reviewRows(c);
    if (!rows.length && !replace) return false;
    const why = s.want || 'time';
    TT.decisions.request({
      type: 'qreview', charId: c.id, tier: 2, timeout: 20, replace: !!replace,
      title: 'Xem xét nhiệm vụ',
      text: (REASON[why] || REASON.time) + ' Xem lại thứ tự ưu tiên, độ khó và thời hạn. Nhân vật sẽ dồn sức cho nhiệm vụ đứng đầu. Nhấn "Áp dụng gợi ý" để máy chỉnh giúp.' +
        '\nĐang chạy ' + active(c).length + ' nhiệm vụ' + (s.offers.length ? ', ' + s.offers.length + ' đề nghị chờ' : '') + '.',
      choices: [{ key: 'apply', label: 'Áp dụng gợi ý của máy' }, { key: 'ok', label: 'Giữ như đã chỉnh' }], def: 0, opts: rows
    });
    if (!replace) { s.rev = TT.world.months; s.want = ''; }
    return true;
  }
  function reviewAct(key) {
    const w = TT.world, d = w.pending; if (!d || d.type !== 'qreview') return;
    const c = w.chars[d.charId]; if (!c) return;
    const p = key.split(':');
    if (p[0] === 'qa') { const q = byId(c, +p[2]); if (q) doAct(c, q, p[1]); }
    else if (p[0] === 'qo') { const o = qs(c).offers[+p[2]]; if (o) { if (p[1] === 'acc') accept(c, o); else decline(c, o); } }
    review(c, true);
  }

  // ---------- chu kỳ ----------
  function sample(c) {
    const s = qs(c);
    s.h.push({ a: TT.age(c), L: lvl(c), w: TT.ls.wealth(c), d: danh(c) });
    if (s.h.length > 8) s.h.shift();
  }
  function checkUrgent(c) {
    const age = TT.age(c), s = qs(c);
    active(c).forEach(q => {
      const tot = Math.max(1, q.byAge - q.startAge), el = (age - q.startAge) / tot, left = 1 - el, p = K[q.kind].prog(c, q);
      const behind = p < el * 0.8;
      if (left <= Q.URGENT_LEFT && behind && !q.urgent) {
        q.urgent = true;
        let moved = false;
        if (!s.lock) { q.was = q.rank; moveTo(c, q, 0); moved = true; }
        TT.log(c, 'Nhiệm vụ cấp bách: ' + q.text + '.', 'bad', 'Còn ' + Math.max(0, q.byAge - age) + ' năm, tiến độ ' + Math.round(p * 100) + '%. ' + (moved ? 'Đã đẩy lên đầu danh sách ưu tiên (có thể đặt về chỗ cũ trong tab Nhiệm vụ).' : 'Danh sách đang khóa nên chỉ nhắc.'));
        want(c, 'big');
      } else if (q.urgent && !behind && left > Q.URGENT_LEFT * 0.9) q.urgent = false;
    });
  }
  const Q_ = {
    K, rates, lvl, xpEst, slotsFree, make, active, list, sorted, byId, qs, advice, doAct, settle, accept, decline, drop, setDiff, extend, move, moveTo, autoSort,
    applyAdvice, review, reviewRows, reviewAct, want, penText, rewardText, extendCost, pathTag, relation, tierIdx,
    kindLabel: { xp: 'Tu vi', realm: 'Cảnh giới', gold: 'Của cải', friend: 'Bạn bè', explore: 'Khám phá', fame: 'Danh tiếng', revenge: 'Ân oán', clear: 'Bí cảnh', order: 'Đơn hàng', ho_tong: 'Hộ tống cống', doi_no: 'Đòi nợ cống', dep_loan: 'Dẹp loạn' },
    progress: (c, q) => { const k = K[q.kind]; return k ? k.prog(c, q) : 0; },
    restore(c, q) { if (q && q.was) { moveTo(c, q, q.was - 1); q.was = 0; } },

    // Mức nhân vật muốn đi tới nơi chưa từng ghé (0..1) khi có nhiệm vụ khám phá trong vùng đang ở.
    exploreBias(c) {
      let b = 0;
      sorted(c).forEach((q, i) => { if (q.kind === 'explore' && q.region === c.region) b += Q.RANK_W[Math.min(i, Q.RANK_W.length - 1)] * (q.urgent ? 1.5 : 1); });
      return Math.min(1, b);
    },

    // Hệ số nhân lên trọng số hành động của người chơi theo thứ tự ưu tiên nhiệm vụ.
    actMul(c) {
      const add = {};
      sorted(c).forEach((q, i) => {
        const w = Q.RANK_W[Math.min(i, Q.RANK_W.length - 1)] * (q.urgent ? 1.5 : 1), map = Q.KIND_ACT[q.kind] || {};
        Object.keys(map).forEach(a => { add[a] = (add[a] || 0) + w * Q.ACT_STEP * map[a]; });
      });
      const mul = {};
      Object.keys(add).forEach(a => { mul[a] = 1 + Math.min(Q.ACT_CAP, add[a]); });
      return mul;
    },

    // Báo có biến cố lớn (gọi từ TT.report.mark): mở cửa sổ xem xét khi tiện.
    event(c, kind) { /* biến cố lớn đã mở ngã rẽ (path.js), không mở thêm cửa sổ nhiệm vụ để giữ nhịp hỏi thưa */ },

    // Mỗi tháng: nếu có lý do xem xét và không vướng quyết định khác thì mở cửa sổ.
    tick(c) {
      const s = qs(c), w = TT.world; if (w.pending || !c.alive) return;
      const since = w.months - s.rev;
      if (s.want && since >= (Q.REVIEW_MIN[s.want] || 60)) { if (!review(c)) s.want = ''; }
      else if (!s.want && since >= Q.REVIEW_MIN.time && (active(c).length || s.offers.length)) { s.want = 'time'; }
    },

    // Mỗi năm: lấy mẫu tốc độ, xét hoàn thành/trễ hạn/cấp bách, đề nghị nhiệm vụ mới, Thiên Đạo ban đại nguyện.
    yearly(c) {
      const s = qs(c), age = TT.age(c), w = TT.world;
      sample(c);
      active(c).forEach(q => {
        const k = K[q.kind];
        if (!k) { q.state = 'fail'; return; }
        if (k.step) k.step(c, q); // tiến độ theo năm (nhiệm vụ thế lực)
        if (k.done(c, q)) settle(c, q, 'done');
        else if (age >= q.byAge) settle(c, q, 'fail', 'Hết thời hạn.');
      });
      if (list(c).length > 24) c.quests = list(c).filter(q => q.state === 'on').concat(list(c).filter(q => q.state !== 'on').slice(-10));
      s.offers = s.offers.filter(o => o.exp > w.months);
      checkUrgent(c);
      if (age >= 12 && c.alive) {
        const hq = heavenQuest(c);
        if (hq && accept(c, hq)) { TT.log(c, 'Thiên Đạo ban đại nguyện: ' + hq.text + ' (trước ' + hq.byAge + ' tuổi).', 'big', 'Hoàn thành được Thiên cơ điểm và đạo tâm; bỏ dở hoặc thất bại sẽ tổn đạo tâm nặng và chịu thiên phạt nhẹ.'); want(c, 'heaven'); }
        if (w.months - s.off >= Q.OFFER_GAP && s.offers.length < Q.OFFER_KEEP) { if (offerOne(c)) { s.off = w.months; want(c, 'offer'); } }
      }
      if (!s.lock && !active(c).some(q => q.urgent)) { /* giữ thứ tự người chơi đã đặt */ }
    },
    // Đổi đường: tính lại nhãn hợp/ngược đạo, nhắc xem xét, và đề nghị sẵn một nhiệm vụ hợp đường mới.
    onPath(c, changed) {
      active(c).forEach(q => { q.rel = relation(c, q.tag); });
      qs(c).offers.forEach(o => { o.rel = relation(c, o.tag); });
      const tag = pathTag(c); if (!tag) return;
      const s = qs(c); let n = 0;
      for (let i = 0; i < 12 && n < 2; i++) {
        const tier = n === 0 ? 's' : 'm';
        if (slotsFree(c, tier, 'self') <= 0 || s.offers.some(o => o.tier === tier && o.giver.t === 'self')) continue;
        const kinds = Q.GIVER_KINDS.self.filter(kd => Q.KIND_TAG[kd] === tag && K[kd].tiers.indexOf(tier) >= 0);
        if (!kinds.length) break;
        const q = make(c, tier, 'self', rng.pick(kinds));
        if (q && !s.offers.some(o => o.kind === q.kind)) { q.exp = TT.world.months + Q.OFFER_LIFE; s.offers.push(q); n++; }
      }
    },
    touch(c) { if (c.place && !c.travel && !c.cross) { c.visited = c.visited || {}; c.visited[c.place] = 1; } },
    reset(c) { c.quests = []; c.qs = null; }
  };
  TT.quests = Q_;
  // Tên cũ cho phần còn lại của mã.
  TT.goals = { touch: Q_.touch, active: Q_.active, progress: Q_.progress, yearly: Q_.yearly, kindLabel: Q_.kindLabel };
})();
