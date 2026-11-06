// Gia đình: đạo lữ (được nhiều đạo lữ), song tu, con cái thừa hưởng một phần tư chất, đồ đệ, nợ ân tình, người kế thừa.
// Quan hệ đạo lữ là rel.k = 'dao_lu' (rec.love là độ gắn bó yêu đương), sư đồ là 'su_do', ruột thịt là 'huyet'.
// Nội dung về tình cảm và sinh con viết ở mức văn học, không miêu tả chi tiết.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats, rel = TT.rel;

  const MAX_KIDS = 4, MAX_DISCIPLES = 5;
  const aliveChar = id => { const c = TT.world.chars[id]; return c && c.alive ? c : null; };

  const family = TT.family = {
    MAX_KIDS, MAX_DISCIPLES,

    isKin(a, b) {
      if (a.id === b.id) return true;
      const pa = a.parents || [], pb = b.parents || [];
      if (pa.indexOf(b.id) >= 0 || pb.indexOf(a.id) >= 0) return true;
      return pa.some(x => pb.indexOf(x) >= 0); // anh chị em
    },
    // Độ hợp để nảy sinh tình cảm: khác giới là 1, cùng giới hiếm hơn. 0 nghĩa là không thể.
    attract(a, b) {
      if (family.isKin(a, b)) return 0;
      if (TT.age(a) < 18 || TT.age(b) < 18) return 0;
      if (!TT.bond.owns(a, b) && Math.abs(TT.age(a) - TT.age(b)) > 30) return 0; // cặp của người chơi: bỏ giới hạn chênh lệch tuổi (R 1.1)
      return a.gender !== b.gender ? 1 : 0.2;
    },
    // Có thể là đối tượng yêu đương không (NPC chỉ một đạo lữ, người chơi được nhiều).
    eligible(a, b) {
      if (!a.alive || !b.alive || family.attract(a, b) <= 0) return false;
      const r = rel.get(a, b);
      if (r && r.k === 'dao_lu') return false;
      if (TT.bond.owns(a, b) && family.partners(a.kind === 'player' ? a : b).length >= D.BOND.maxPartners) return false; // 1 chính + tối đa 2 phụ
      if (a.kind === 'npc' && family.partners(a).length >= 1) return false;
      if (b.kind === 'npc' && family.partners(b).length >= 1) return false;
      return true;
    },

    partners(c) { return rel.list(c).filter(x => x.r.k === 'dao_lu' && x.c && x.c.alive); },
    partnerHere(c) {
      if (!c.place || c.travel || c.cross) return null;
      const x = family.partners(c).find(y => !y.c.travel && !y.c.cross && y.c.region === c.region && y.c.place === c.place);
      return x ? x.c : null;
    },
    partnerAt(c, placeId) {
      return family.partners(c).some(y => !y.c.travel && !y.c.cross && y.c.region === c.region && y.c.place === placeId);
    },
    children(c) { return (c.children || []).map(aliveChar).filter(Boolean); },
    disciples(c) { return rel.list(c).filter(x => x.r.k === 'su_do' && x.c && x.c.alive && x.c.master === c.id).map(x => x.c); },

    // ---------- đạo lữ ----------
    pair(a, b) {
      const r = rel.ensure(a, b);
      if (TT.bond.owns(a, b)) TT.bond.onPair(a, b, r); // cặp của người chơi: thanh Tình/Tin/Kính, đạo lữ chính hoặc phụ
      else { r.k = 'dao_lu'; r.love = 100; r.v = Math.max(r.v, 70); r.m = TT.world.months; }
      const pl = a.kind === 'player' ? a : (b.kind === 'player' ? b : null);
      if (pl) {
        const o = pl === a ? b : a;
        TT.log(pl, 'Bạn và ' + o.name + ' kết làm đạo lữ, nguyện cùng nhau trên đường tu hành.', 'big'); TT.report.mark(pl, 'love', 'Kết đạo lữ với ' + o.name);
        TT.news(pl.name + ' và ' + o.name + ' kết làm đạo lữ.', 'good', [pl.id, o.id]);
        // Các đạo lữ khác biết chuyện: ghen tuông
        const others = family.partners(pl).filter(x => x.c !== o);
        others.forEach(x => rel.add(pl, x.c, -10));
        if (others.length && !TT.world.pending && rng.P(0.7)) TT.events.fire(pl, D.eventById.rel_ghen, { otherId: rng.pick(others).c.id, newId: o.id });
      } else if (a.realm >= 2 || b.realm >= 2) {
        TT.news(a.name + ' và ' + b.name + ' kết làm đạo lữ.', 'good', [a.id, b.id]);
      }
    },
    unpair(a, b, why) {
      const r = rel.get(a, b);
      if (!r || r.k !== 'dao_lu') return;
      r.k = ''; r.love = 0; r.v = Math.min(r.v, 10); r.nl = 1;
      const pl = a.kind === 'player' ? a : (b.kind === 'player' ? b : null);
      if (pl) { const o = pl === a ? b : a; TT.log(pl, 'Bạn và ' + o.name + ' không còn là đạo lữ (' + why + ').', 'bad'); TT.ev.dao(pl, -2); }
    },

    // ---------- con cái ----------
    // Con thừa hưởng một phần tư chất: 75% từ lần bốc ngẫu nhiên, 25% từ bố mẹ (trung bình theo từng thuộc tính).
    mixTuChat(roll, parents) {
      const map = {};
      roll.attrs.forEach(a => { map[a.n] = { n: a.n, di: a.di, p: a.p * 0.75 }; });
      parents.forEach(par => par.tuchat.attrs.forEach(a => {
        if (!map[a.n]) map[a.n] = { n: a.n, di: a.di, p: 0 };
        map[a.n].p += a.p * 0.25 / parents.length * rng.R(0.6, 1.4);
      }));
      let attrs = Object.keys(map).map(k => map[k]).filter(a => Math.round(a.p) >= 3);
      // thuộc tính biến dị của bố mẹ có thể truyền lại
      const diPar = [].concat.apply([], parents.map(p => p.tuchat.attrs.filter(a => a.di)));
      if (diPar.length && !attrs.some(a => a.di) && rng.P(0.3)) { const d = rng.pick(diPar); attrs.push({ n: d.n, di: true, p: Math.max(8, Math.round(d.p * 0.4)) }); }
      if (!attrs.length) attrs = roll.attrs.map(a => ({ n: a.n, di: a.di, p: a.p }));
      attrs.forEach(a => { a.p = Math.max(1, Math.round(a.p)); });
      const total = Math.min(220, attrs.reduce((s, a) => s + a.p, 0));
      return { total, attrs };
    },
    mixTraits(parents) {
      const out = TT.rollTraits();
      parents.forEach(par => par.traitIds.forEach(id => {
        const t = D.traitById[id];
        if (out.indexOf(id) < 0 && rng.P(t.g ? 0.15 : 0.06)) out.push(id);
      }));
      return out.slice(0, 4);
    },

    conceive(mother, father) {
      mother.pregnant = { father: father.id, due: TT.world.months + 9 };
      if (mother.kind === 'player' || father.kind === 'player') {
        const pl = mother.kind === 'player' ? mother : father, o = pl === mother ? father : mother;
        TT.log(pl, pl === mother ? 'Bạn có tin vui: trong người đã có sinh mệnh nhỏ bé.' : o.name + ' báo tin vui: hai người sắp có con.', 'good');
      }
    },

    birth(m) {
      const w = TT.world, f = m.pregnant ? w.chars[m.pregnant.father] : null;
      m.pregnant = null; m.lastBirth = w.months;
      const parents = f ? [f, m] : [m];
      const gender = rng.P(0.5) ? 'nam' : 'nu';
      const kid = TT.createChar({
        kind: 'npc', tier: 'core', age: 0, birthMonth: w.months, gender, region: m.region, place: m.place,
        surname: TT.surnameOf((f || m).name), tuchat: family.mixTuChat(TT.rollTuChat(), parents), traitIds: family.mixTraits(parents)
      });
      kid.gold = 0; kid.parents = parents.map(p => p.id); kid.hp = 60;
      parents.forEach(p => {
        p.children = p.children || []; p.children.push(kid.id);
        const r = rel.ensure(p, kid); r.k = 'huyet'; r.v = rng.RI(60, 85);
        (p.children || []).forEach(sid => { if (sid !== kid.id && w.chars[sid]) { const sr = rel.ensure(kid, w.chars[sid]); sr.k = 'huyet'; sr.v = Math.max(sr.v, 40); } });
      });
      const pl = parents.find(p => p.kind === 'player');
      if (pl) {
        TT.log(pl, 'Một sinh mệnh mới chào đời: ' + kid.name + ' (' + (gender === 'nu' ? 'con gái' : 'con trai') + '), tư chất ' + kid.tuchat.total + ' điểm (' +
          kid.tuchat.attrs.map(a => a.n + ' ' + a.p).join(', ') + ').', 'big');
        TT.news(pl.name + ' vừa có thêm một người con: ' + kid.name + '.', 'good', [pl.id, kid.id]);
      }
      return kid;
    },

    // ---------- đồ đệ ----------
    canRecruit(m, d) {
      if (!m.alive || !d.alive || d.master || m.id === d.id) return 'Không thể';
      if (m.realm < 2) return 'Cần đạt Trúc Cơ mới nhận được đồ đệ';
      if (d.realm >= m.realm) return 'Đối phương không kém bạn về cảnh giới';
      if (family.disciples(m).length >= MAX_DISCIPLES) return 'Đã đủ ' + MAX_DISCIPLES + ' đồ đệ';
      if (family.isKin(m, d)) return 'Là người nhà';
      return false;
    },
    recruit(m, d) {
      d.master = m.id;
      const r = rel.ensure(m, d); r.k = 'su_do'; r.v = Math.max(r.v, 50);
      if (m.kind === 'player') { TT.log(m, d.name + ' bái bạn làm sư phụ. Bạn có thêm một đồ đệ.', 'big'); TT.news(m.name + ' nhận ' + d.name + ' làm đồ đệ.', 'good', [m.id, d.id]); }
      else if (m.realm >= 3) TT.news(m.name + ' nhận ' + d.name + ' làm đồ đệ.', '', [m.id, d.id]);
    },
    // Tu luyện nhanh hơn nhờ có sư phụ chỉ điểm (sư phụ phải mạnh hơn).
    masterBonus(c) {
      if (!c.master) return 1;
      const m = TT.world.chars[c.master];
      if (!m || !m.alive || m.realm <= c.realm) return 1;
      return 1.15 + (m.region === c.region && m.place === c.place ? 0.1 : 0);
    },

    // ---------- nợ ân tình ----------
    addDebt(c, creditor, amt, why) {
      c.debts = c.debts || [];
      c.debts.push({ id: creditor.id, amt: Math.round(amt), why });
      TT.log(c, 'Bạn nợ ' + creditor.name + ' một ân tình (' + why + '), ước chừng ' + Math.round(amt) + ' vàng. Sớm muộn họ sẽ tới đòi.', 'age');
    },

    // ---------- người kế thừa ----------
    heirs(c) {
      const kids = family.children(c).sort((a, b) => TT.age(b) - TT.age(a));
      const dis = family.disciples(c).filter(d => TT.age(d) >= 8);
      return kids.map(k => ({ c: k, how: 'con' })).concat(dis.map(d => ({ c: d, how: 'đồ đệ' })));
    },

    // ---------- hằng năm ----------
    yearly(c) {
      const w = TT.world;
      // đạo lữ ở xa lâu thì nhạt dần; tình cảm hết thì chia tay
      family.partners(c).forEach(x => {
        if (TT.bond.owns(c, x.c)) return; // cặp của người chơi: TT.bond.yearly lo (trôi thanh, rạn nứt, đạo lữ NPC tự chủ)
        const r = x.r;
        const apart = x.c.region !== c.region || x.c.place !== c.place;
        if (apart) r.love = Math.max(0, (r.love || 0) - 2);
        else r.love = Math.min(100, (r.love || 0) + 1);
        if (c.kind === 'npc' && r.love < 25 && r.v < 30 && rng.P(0.3)) family.unpair(c, x.c, 'tình cảm đã nhạt');
      });
      if (c.kind === 'player') TT.bond.yearly(c);
      // trẻ nhỏ đi theo cha mẹ nếu cha mẹ còn sống ở vùng khác chỗ
      if (TT.age(c) < 12 && c.parents) {
        const par = c.parents.map(aliveChar).find(Boolean);
        if (par && par.region === c.region && par.place && !par.travel && par.place !== c.place) c.place = par.place;
      }
      // người chơi: nợ ân tình được đòi
      if (c.kind === 'player' && c.debts && c.debts.length && !w.pending) {
        const d = c.debts.find(x => { const o = aliveChar(x.id); return o && o.region === c.region && !o.cross; });
        if (d && rng.P(0.3)) TT.events.fire(c, D.eventById.rel_doi_no, { otherId: d.id, amt: d.amt });
      }
      // NPC mạnh tự nhận đồ đệ
      if (c.kind === 'npc' && c.tier === 'core' && c.realm >= 2 && TT.age(c) >= 35 && c.place && !c.travel && family.disciples(c).length < 2 && rng.P(0.05)) {
        const cand = TT.social.here(c).find(o => o.kind === 'npc' && o.tier === 'core' && TT.age(o) >= 12 && TT.age(o) <= 30 && !family.canRecruit(c, o));
        if (cand) family.recruit(c, cand);
      }
    }
  };
})();
