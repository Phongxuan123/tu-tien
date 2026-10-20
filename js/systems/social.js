// Giao tiếp giữa các nhân vật: hành động "giao du" hằng tháng (nhân vật tự quyết), kết thù và báo thù, đấu tay đôi, giết người.
// NPC dùng cùng bộ máy này với người chơi; chỉ khi người chơi dính vào mới có hộp quyết định (xem data/relevents.js).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats;
  const rel = TT.rel, rep = TT.rep;

  // Những cặp tính cách dễ xung khắc.
  const CLASH = {
    kieu_ngao: ['kieu_ngao', 'muu_mo', 'lieu_linh'], hien_hoa: ['tham_lam', 'muu_mo'], tham_lam: ['hien_hoa', 'kieu_ngao'],
    muu_mo: ['hien_hoa', 'kieu_ngao'], lieu_linh: ['kieu_ngao', 'can_cu'], can_cu: ['lieu_linh']
  };

  function here(c) {
    if (!c.place || c.travel || c.cross) return [];
    const w = TT.world, out = [];
    for (const id in w.chars) {
      const o = w.chars[id];
      if (o !== c && o.alive && o.region === c.region && o.place === c.place && !o.travel && !o.cross) out.push(o);
    }
    return out;
  }

  // Độ hợp nhau (-1..1): cùng tính cách và cùng thiên hướng chính/tà thì hợp, tính cách xung khắc thì kỵ.
  function compat(a, b) {
    let s = 0;
    if (a.personality === b.personality) s += 0.15;
    if ((CLASH[a.personality] || []).indexOf(b.personality) >= 0) s -= 0.4;
    s -= Math.abs(rep.alignOf(a) - rep.alignOf(b)) / 200;
    return rng.clamp(s + rng.R(-0.25, 0.25), -1, 1);
  }

  const NR = c => TT.ev.NR(c);

  // Các kiểu tương tác. w(a, b, k): trọng số (k = độ hợp). run(a, b, k) trả về { dv, text } (a là người chủ động).
  const INTS = [
    { id: 'chuyen', w: () => 4, run: (a, b, k) => ({ dv: rng.RI(2, 6) * (1 + k * 0.6), text: 'trò chuyện cùng {B}' }) },
    {
      id: 'luan_dao', w: (a, b, k) => (a.realm >= 1 && b.realm >= 1 ? 2 * Math.max(0.2, 0.6 + k * 0.4) : 0),
      run: (a, b, k) => {
        TT.ev.xp(a, NR(a) * 0.004); TT.ev.xp(b, NR(b) * 0.004); a.daoDiem += 1; b.daoDiem += 1;
        return { dv: rng.RI(3, 6), text: 'cùng {B} luận đạo suốt đêm, cả hai đều có thu hoạch' };
      }
    },
    {
      id: 'tang_qua', w: a => (TT.ls.wealth(a) >= 30 ? 1.2 : 0),
      run: a => {
        const g = rng.RI(5, 15) * (1 + a.realm);
        TT.ev.gold(a, -g);
        return { dv: 6 + Math.round(g / 10), text: 'tặng {B} ' + g + ' vàng', gift: g };
      }
    },
    { id: 'cai_va', w: (a, b, k) => 0.12 + Math.max(0, -k) * 3, run: () => ({ dv: -rng.RI(4, 10), text: 'cãi nhau với {B} một trận' }) },
    {
      id: 'tranh', w: (a, b, k) => (a.realm >= 1 && b.realm >= 1 && Math.abs(a.realm - b.realm) <= 1 ? 1.2 * (0.4 + Math.max(0, -k) * 2) : 0),
      run: (a, b) => {
        const r = TT.combat.quick(a, b, { lethal: false });
        rep.add(r.winner, 'danh', 1);
        return { dv: -rng.RI(5, 10), text: 'tranh chấp với {B} rồi động thủ thử sức, ' + (r.winner === a ? 'thắng' : 'thua') };
      }
    },
    {
      id: 'tam_su', w: (a, b, k) => (TT.rel.v(a, b) >= 35 && TT.family.eligible(a, b) ? 1.6 * TT.family.attract(a, b) * Math.max(0.2, 0.6 + k) : 0),
      run: () => ({ dv: rng.RI(4, 9), love: rng.RI(8, 16), text: 'tâm sự cùng {B} dưới trăng, hai bên thấy gần nhau hơn' })
    },
    {
      id: 'hop_tac', w: (a, b, k) => (a.realm >= 1 && b.realm >= 1 ? 1.2 * Math.max(0.1, 0.5 + k) : 0),
      run: (a, b) => {
        const g = rng.RI(10, 25) * (1 + a.realm);
        TT.ev.gold(a, g); TT.ev.gold(b, g);
        if (rng.P(0.25)) { TT.ev.hp(a, -rng.RI(5, 12)); TT.ev.hp(b, -rng.RI(5, 12)); }
        return { dv: 6, text: 'cùng {B} đi làm một vụ nhỏ, mỗi người chia ' + g + ' vàng' };
      }
    }
  ];

  const social = TT.social = {
    here, compat, INTS,

    // Người đang ở cùng địa điểm, đánh giá mức dễ gặp: bạn cũ, kẻ thù và người mới quen dễ xuất hiện hơn.
    pickTarget(c, list) {
      const ws = list.map(o => {
        let w = 1;
        const r = rel.get(c, o);
        if (r) w += r.v >= 15 ? 3 : r.k === 'thu' ? 2 : 0.5; else w += 1.5;
        if (Math.abs(c.realm - o.realm) > 2) w *= 0.3;
        if (o.tier === 'phu') w *= 0.7;
        return w;
      });
      let tot = 0; ws.forEach(x => { tot += x; });
      let r = rng.next() * tot;
      for (let i = 0; i < list.length; i++) { r -= ws[i]; if (r <= 0) return list[i]; }
      return list[list.length - 1];
    },

    // Thực hiện một tương tác (forcedId để người chơi chủ động chọn). Trả về { int, dv, res, ... }.
    interact(a, b, forcedId) {
      const k = compat(a, b);
      let int;
      if (forcedId) int = INTS.find(x => x.id === forcedId);
      else int = rng.wpick(INTS.map(x => ({ x, w: Math.max(0, x.w(a, b, k)) })).filter(y => y.w > 0), y => y.w).x;
      const out = int.run(a, b, k);
      const res = rel.add(a, b, out.dv, int.id);
      // Tình cảm yêu đương chỉ nảy nở giữa những cặp có thể (đủ tuổi, không ruột thịt, còn tự do).
      if (TT.family.eligible(a, b)) {
        const gain = out.love != null ? out.love : { luan_dao: 2, tang_qua: 3, hop_tac: 3, chuyen: 1, cai_va: -5, tranh: -3 }[int.id] || 0;
        TT.bond.addLoveRec(res.r, gain * TT.family.attract(a, b) * TT.bond.loveMul(a, b));
      }
      const pl = a.kind === 'player' ? a : (b.kind === 'player' ? b : null);
      // NPC tự tìm người chơi chỉ được ghi vào nhật ký khi có điều đáng chú ý, để nhật ký không bị tràn.
      const notable = a.kind === 'player' || res.after !== res.before || out.dv <= -6 || !!out.gift;
      if (pl && notable) {
        const subj = a.kind === 'player' ? 'Bạn' : a.name;
        const text = out.text.replace('{B}', b.kind === 'player' ? 'bạn' : b.name);
        const place = TT.map.place(a.place);
        const other = pl === a ? b : a;
        let line = subj + ' ' + text + (place ? ' ở ' + place.n : '') + '.';
        if (res.after !== res.before) line += ' Quan hệ với ' + other.name + ' giờ là: ' + rel.label(pl, other) + '.';
        TT.log(pl, line, out.dv >= 0 ? (res.after !== res.before ? 'good' : '') : 'bad');
      }
      return { int, dv: out.dv, res, k, gift: out.gift };
    },

    // Hành động "giao du" của một tháng.
    act(c) {
      const list = here(c);
      if (!list.length) {
        if (c.kind === 'player') TT.log(c, 'Bạn muốn giao du nhưng nơi này vắng vẻ, chẳng gặp ai.', 'age');
        return;
      }
      const t = social.pickTarget(c, list);
      const r = social.interact(c, t);
      if (c.kind === 'player' && r.dv > 0) { const sm = TT.path.mods(c).social; if (sm !== 1) rel.add(c, t, r.dv * (sm - 1)); } // đường đi ảnh hưởng tốc độ thân thiết
      social.after(c, t, r);
    },

    // Hệ quả sau tương tác: kết thù, và các hộp quyết định cho người chơi (kết nghĩa, va chạm, nhờ vả, làm quen).
    after(a, b, r) {
      const rec = r.res.r, w = TT.world;
      const pl = a.kind === 'player' ? a : (b.kind === 'player' ? b : null);
      const other = pl === a ? b : a;
      if (rec.v <= -60 && !rec.k && b.tier !== 'phu' && a.tier !== 'phu') {
        // ai chịu thiệt hơn thì ghi hận: kẻ yếu thế hơn thề báo thù (hoặc người bị tranh chấp thua)
        const avenger = pl ? other : (rng.P(0.5) ? a : b);
        const target = avenger === a ? b : a;
        social.makeEnemy(avenger, target, 'mâu thuẫn không thể hóa giải');
        return;
      }
      // Hai NPC đủ tình cảm thì tự nên đạo lữ
      if (!pl && rec.love >= 60 && !rec.k && !rec.nl && TT.family.eligible(a, b) && rng.P(0.5)) { TT.family.pair(a, b); return; }
      if (!pl || w.pending || other.tier === 'phu' && other.realm === 0) return;
      const ev = (id, p, extra) => { if (rng.P(p)) TT.events.fire(pl, D.eventById[id], Object.assign({ otherId: other.id }, extra || {})); };
      if (TT.bond.loveRec(rec) >= 60 && !rec.k && !rec.nl && !TT.bond.holds(rec) && TT.family.eligible(pl, other)) ev('rel_to_tinh', 0.6, { initiator: a === pl ? 1 : 0 });
      else if ((TT.bond.memOn() ? TT.bond.canSwear(pl, other) : rec.v >= 60) && !rec.k && !rec.nk) ev('rel_ket_nghia', 0.3); // 9K: kết nghĩa cần ký ức chung và hoạn nạn
      else if ((r.int.id === 'cai_va' || r.int.id === 'tranh') && rec.v <= -20) ev('rel_xung_dot', 0.4);
      else if (rec.n <= 1 && other.tier === 'core') ev('rel_gap_nguoi', 0.12);
      else if (rec.v >= 15 && rec.v < 70 && TT.ls.wealth(other) < TT.ls.wealth(pl) * 0.5) ev('rel_nho_giup', 0.08, { amt: rng.RI(15, 40) * (1 + pl.realm) });
    },

    // ---------- kẻ thù và báo thù ----------
    makeEnemy(avenger, target, why) {
      const r = rel.setKind(avenger, target, 'thu', avenger.id);
      r.v = Math.min(r.v, -70); r.why = why;
      if (avenger.kind !== 'player') {
        avenger.vows = avenger.vows || [];
        if (avenger.vows.indexOf(target.id) < 0) avenger.vows.push(target.id);
      }
      const pl = avenger.kind === 'player' ? avenger : (target.kind === 'player' ? target : null);
      if (pl) {
        const other = pl === avenger ? target : avenger;
        TT.log(pl, pl === avenger ? 'Bạn thề không đội trời chung với ' + other.name + ' (' + why + ').' : other.name + ' đã ghi hận bạn (' + why + '). Từ nay hắn là kẻ thù, có thể tìm đến báo thù.', 'bad');
        TT.news(avenger.name + ' và ' + target.name + ' kết thù với nhau (' + why + ').', 'bad', [avenger.id, target.id]);
      } else if (avenger.realm >= 2 || target.realm >= 2) {
        TT.news(avenger.name + ' thề báo thù ' + target.name + ' (' + why + ').', 'bad', [avenger.id, target.id]);
      }
    },

    // NPC thề báo thù tìm tới nơi kẻ thù đang ở. Trả về true nếu đã dùng lượt di chuyển của tháng này.
    hunt(c) {
      if (!c.vows || !c.vows.length || c.travel || c.cross) return false;
      const w = TT.world;
      for (const tid of c.vows) {
        const t = w.chars[tid];
        if (!t || !t.alive || t.region !== c.region || t.cross) continue;
        if (c.realm + 1 < t.realm) continue; // quá yếu so với kẻ thù: chưa dám đi, cứ tu luyện
        const dest = t.travel ? t.travel.to : t.place;
        if (!dest || c.place === dest) return true;
        if (!rng.P(0.5)) return false;
        if (TT.map.startTravel(c, dest)) {
          if (t.kind === 'player') TT.rumors.enemyComing(c, t, dest);
          return true;
        }
      }
      return false;
    },

    // Mỗi tháng, NPC thề báo thù đang ở cùng chỗ với kẻ thù thì có thể ra tay.
    hostile(c) {
      if (!c.vows || !c.vows.length || c.travel || c.cross) return;
      const w = TT.world;
      if (c.huntWait > w.months) return;
      c.vows = c.vows.filter(tid => {
        const t = w.chars[tid], r = t && rel.get(c, t);
        return t && t.alive && r && r.k === 'thu';
      });
      for (const tid of c.vows) {
        const t = w.chars[tid];
        if (t.region !== c.region || t.travel || t.cross || t.place !== c.place) continue;
        if (!rng.P(0.22)) continue;
        if (t.kind === 'player') {
          if (!w.pending) TT.events.fire(t, D.eventById.rel_ke_thu, { otherId: c.id });
        } else if (c.realm + 1 >= t.realm) {
          social.duel(c, t, { lethal: true, why: 'báo thù' });
        }
        return;
      }
    },

    // Đấu tay đôi. lethal: đánh tới cùng, bên thua kiệt sức thì chết.
    duel(a, b, opts) {
      opts = opts || {};
      const r = TT.combat.quick(a, b, opts);
      if (opts.lethal && r.loser.hp <= 0) social.kill(r.winner, r.loser, opts.why || 'tử chiến');
      return r;
    },

    // killer giết victim: danh tiếng, nghiệp, và bạn bè người chết thề báo thù.
    kill(killer, victim, why) {
      if (!victim.alive) return;
      const rr = rel.get(killer, victim), feud = !!rr && rr.k === 'thu';
      victim.killedBy = killer.id;
      TT.life.die(victim, 'bị ' + killer.name + ' giết (' + why + ')');
      rep.add(killer, 'chinh', feud ? -1 : -8);
      rep.add(killer, 'danh', 2 + victim.realm * 3);
      if (!feud) killer.nghiep = (killer.nghiep || 0) + 1;
      if (killer.faith && TT.faith) TT.faith.onKill(killer); // tín đồ giữ giới sát sinh mà giết người thì phạm giới (S5)
      if (killer.kind === 'player' || victim.kind === 'player' || killer.realm >= 2 || victim.realm >= 2) {
        TT.news(killer.name + ' đã giết ' + victim.name + ' (' + why + ').', 'bad', [killer.id, victim.id]);
      }
      for (const x of rel.list(victim)) {
        const f = x.c;
        if (!f || !f.alive || f.id === killer.id || f.tier === 'phu') continue;
        if (x.r.v >= 40 || x.r.k === 'huyet' || x.r.k === 'dao_lu' || x.r.k === 'su_do') {
          if (f.kind !== 'player' && f.realm + 2 < killer.realm) continue; // quá yếu để dám báo thù
          social.makeEnemy(f, killer, 'báo thù cho ' + victim.name);
        }
      }
    },

    // Tìm hoặc dựng một NPC lõi ở cùng địa điểm (cho sự kiện cần một nhân vật cụ thể).
    npcHere(c, minRealm, maxRealm) {
      const cand = here(c).filter(o => o.kind === 'npc' && o.tier === 'core' && o.realm >= (minRealm || 0) && o.realm <= (maxRealm == null ? 9 : maxRealm));
      if (cand.length && rng.P(0.7)) return rng.pick(cand);
      const n = TT.life.spawnNpc(rng.RI(16, 45), c.region);
      if (n) { n.place = c.place; n.dest = null; n.travel = null; }
      return n;
    },

    // Bạn thuở nhỏ: vài NPC cùng địa điểm lúc vừa sinh ra.
    childhood(c) {
      const list = here(c).filter(o => o.kind === 'npc' && o.tier === 'core' && TT.age(o) >= 9 && TT.age(o) <= 28);
      rng.shuffle(list).slice(0, 2).forEach(o => {
        const r = rel.ensure(c, o); r.v = rng.RI(26, 36);
        TT.log(c, 'Bạn có một người bạn thuở nhỏ ở đây: ' + o.name + '.', 'age');
      });
    },

    // Mỗi năm: vài mối thù nguôi dần, quan hệ lâu không gặp phai nhạt, dọn bớt quan hệ yếu.
    yearly(c) {
      const w = TT.world;
      const lst = rel.list(c);
      lst.forEach(x => {
        const r = x.r;
        if (r.k === 'thu' && c.kind !== 'player' && r.by === c.id && x.c && x.c.alive && rng.P(0.04) && r.v > -90) {
          r.k = ''; r.v = -40; r.by = 0;
          if (c.vows) c.vows = c.vows.filter(i => i !== x.id);
        }
        if (!r.k && w.months - r.m > 36 && Math.abs(r.v) > 1) r.v -= Math.sign(r.v) * 1;
      });
      if (lst.length > 30) {
        lst.filter(x => !x.r.k && Math.abs(x.r.v) < 12).sort((a, b) => a.r.m - b.r.m).slice(0, lst.length - 30)
          .forEach(x => { delete w.rel[x.id < c.id ? x.id + ':' + c.id : c.id + ':' + x.id]; delete c.relIds[x.id]; if (x.c && x.c.relIds) delete x.c.relIds[c.id]; });
      }
    }
  };
})();
