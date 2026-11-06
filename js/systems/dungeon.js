// Thám hiểm bí cảnh, tàn tích, hung địa: chuỗi nhiều bước (cấm chế, quái vật, kho báu, chỗ nghỉ, thủ lĩnh), mỗi bước một hộp quyết định
// có rủi ro. Có thể rút lui bất cứ lúc nào (giữ thu hoạch), bại trận thì mất nửa, đánh tới cùng ở thủ lĩnh có thể mất mạng.
// Trạng thái ở c.dungeon (dữ liệu thuần nên lưu được): { place, kind, name, nodes[], i, loot, startHp }.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats;

  const KIND_BY_TYPE = { bi_canh: 'bi_canh', tan_tich: 'tan_tich', hung_dia: 'hung_dia' };

  const dungeon = TT.dungeon = {
    kindOf(placeId) { const p = TT.map.place(placeId); if (p && TT.fac.isRuin(placeId)) return 'tan_tich'; return p ? KIND_BY_TYPE[p.type] || null : null; },

    // Có vào được không. Trả về lý do (chữ) hoặc false.
    canEnter(c) {
      if (c.dungeon) return 'Đang thám hiểm';
      if (c.realm < 1) return 'Cần đạt Luyện Khí mới dám vào nơi hiểm yếu';
      if (c.hp < S.hpMax(c) * 0.5) return 'Sinh lực dưới một nửa, hãy dưỡng thương trước';
      if ((c.dgCool || 0) > TT.world.months) return 'Vừa thám hiểm xong, cần nghỉ ngơi thêm ' + ((c.dgCool || 0) - TT.world.months) + ' tháng';
      return false;
    },

    // Chọn quái cho một bước. Thích quái hợp thuộc tính vùng (60%).
    pickMonster(kind, c, depth, boss) {
      const reg = TT.map.region(c.region);
      let tierLo, tierHi;
      if (boss) { tierLo = 3; tierHi = 3; } else { tierLo = 0; tierHi = Math.min(2, Math.floor(depth / 2) + (kind === 'hung_dia' ? 1 : 0)); }
      let pool = D.MONSTERS.filter(m => m.tier >= tierLo && m.tier <= tierHi && !(m.boss && !boss) && (kind === 'tan_tich' || !m.guard || boss));
      if (kind === 'tan_tich' && boss) pool = D.MONSTERS.filter(m => m.guard || (m.boss && m.elem === 'Âm'));
      const local = pool.filter(m => reg.elems.indexOf(m.elem) >= 0);
      if (local.length && rng.P(0.6)) pool = local;
      return rng.pick(pool);
    },

    monsterRealm(c, tpl, depth, boss) {
      // Phần lẻ là xác suất quái vượt cảnh giới người chơi một bậc (vượt một bậc là chênh lệch rất lớn).
      const x = tpl.lead + depth * D.DG.depthStep + (boss ? D.DG.bossStep : 0), fl = Math.floor(x);
      return rng.clamp(c.realm + fl + (rng.P(x - fl) ? 1 : 0), 0, 5);
    },

    // Dựng dãy bước (dữ liệu thuần) cho một lần thám hiểm.
    generate(kind, c) {
      const tpl = D.DUNGEONS[kind], nodes = [];
      tpl.steps.forEach((pool, depth) => {
        const t = rng.pick(pool);
        if (t === 'trap') {
          const tt = rng.pick(D.TRAP_TEXTS);
          nodes.push({ t: 'trap', text: tt[0], check: tt[1], diff: (10 + 9 * c.realm + depth * 3) * D.DG.trap });
        } else if (t === 'treasure') nodes.push({ t: 'treasure', text: rng.pick(D.TREASURE_TEXTS), rich: 1 + depth * 0.25 });
        else if (t === 'rest') nodes.push({ t: 'rest', text: rng.pick(D.REST_TEXTS) });
        else {
          const boss = t === 'boss', m = dungeon.pickMonster(kind, c, depth, boss);
          const elite = !boss && rng.P(D.DG.eliteP * (1 + depth * 0.25));
          nodes.push({ t, m: m.id, r: dungeon.monsterRealm(c, tpl, depth, boss) + (elite && rng.P(0.3) ? 1 : 0), f: (boss ? D.DG.boss : D.DG.mob) * (elite ? D.DG.eliteMul : 1), elite, lethal: boss ? !!tpl.lethalBoss : kind === 'hung_dia' && depth >= 2 });
        }
      });
      return nodes;
    },

    enter(c, placeId, kindOverride) {
      const kind = kindOverride || dungeon.kindOf(placeId) || 'bi_canh';
      const tpl = D.DUNGEONS[kind], pl = TT.map.place(placeId);
      c.dungeon = {
        place: placeId, kind, name: kindOverride && !dungeon.kindOf(placeId) ? tpl.n + ' vừa lộ diện gần ' + (pl ? pl.n : '') : (pl ? pl.n : tpl.n),
        nodes: dungeon.generate(kind, c), i: 0, loot: { gold: 0, xp: 0, items: {} }, startHp: Math.round(c.hp)
      };
      TT.log(c, tpl.intro + ' (' + c.dungeon.name + ', ' + c.dungeon.nodes.length + ' chặng)', 'big');
      TT.bond.pickAlly(c); // 9K: bạn thân cùng nơi có thể đi cùng
      dungeon.present(c);
      return c.dungeon;
    },

    node(c) { return c.dungeon ? c.dungeon.nodes[c.dungeon.i] : null; },

    // Mở hộp quyết định cho bước hiện tại.
    present(c) {
      const n = dungeon.node(c);
      if (!n) { dungeon.finish(c, 'xong'); return; }
      TT.events.fire(c, D.eventById['dg_' + n.t], { i: c.dungeon.i });
    },
    next(c) {
      if (!c.dungeon) return;
      c.dungeon.i++;
      if (c.dungeon.i >= c.dungeon.nodes.length) dungeon.finish(c, 'xong'); else dungeon.present(c);
    },

    addLoot(c, o) {
      const l = c.dungeon.loot;
      if (o.gold) l.gold += o.gold;
      if (o.xp) l.xp += o.xp;
      if (o.item) l.items[o.item] = (l.items[o.item] || 0) + (o.n || 1);
    },
    lootText(c) {
      const l = c.dungeon.loot, parts = [];
      if (l.gold) parts.push(TT.ls.fmt(l.gold));
      if (l.xp) parts.push('tu vi +' + Math.round(l.xp));
      Object.keys(l.items).forEach(id => parts.push(D.ITEMS[id].n + (l.items[id] > 1 ? ' x' + l.items[id] : '')));
      return parts.length ? parts.join(', ') : 'chưa có gì';
    },

    // Phần thưởng ngẫu nhiên của kho báu (rich: hệ số giàu có, full: lấy hết hay lấy ít).
    rollTreasure(c, rich, full) {
      const mul = rich * (full ? 1.6 : 0.8), r = c.realm;
      dungeon.addLoot(c, { gold: Math.round(rng.RI(15, 35) * (1 + r * 0.7) * mul), xp: TT.ev.NR(c) * 0.03 * mul });
      const x = rng.next();
      if (x < 0.5) dungeon.addLoot(c, { item: rng.wpick([['hoi_xuan_dan', 4], ['tu_khi_dan', 3], ['pha_canh_dan', r >= 1 ? 2 : 0], ['ho_than_bua', 2], ['linh_thao', 2]].filter(a => a[1] > 0), a => a[1])[0], n: 1 });
      else if (x < 0.75) {
        const pool = Object.keys(D.ITEMS).filter(id => D.ITEMS[id].cat === 'khi' && D.ITEMS[id].tier <= (r >= 3 ? 2 : r >= 1 ? 1 : 0) && !(D.ITEMS[id].minRealm > r + 1));
        if (pool.length) dungeon.addLoot(c, { item: rng.pick(pool) });
      } else {
        const bk = D.TECHS.filter(t => t.tier <= (r >= 2 ? 2 : 1) && !(c.techs && c.techs[t.id]) && (!t.elem || TT.tech.pts(c, t.elem) >= t.pts * 0.5));
        if (bk.length) dungeon.addLoot(c, { item: 'bk_' + rng.pick(bk).id });
      }
    },

    // Kết thúc thám hiểm: 'xong' (thông quan), 'rut' (rút lui), 'chay' (bỏ chạy), 'bai' (bại trận, mất nửa thu hoạch).
    finish(c, how) {
      const dg = c.dungeon;
      if (!dg) return;
      const allyNote = TT.bond.endAlly(c, dg, how); // 9K: chia chiến lợi phẩm cho bạn đồng hành (trước khi tính thu hoạch)
      const keep = how === 'bai' ? 0.5 : how === 'chay' ? 0.7 : 1, l = dg.loot;
      c.dungeon = null; c.dgCool = TT.world.months + 12;
      const gold = Math.round(l.gold * keep), xp = l.xp * keep;
      if (gold) TT.ls.gain(c, gold / D.LS.RATE); // tiền của hầm mộ là linh thạch
      if (xp) TT.ev.xp(c, xp);
      const got = [];
      Object.keys(l.items).forEach(id => {
        const n = Math.max(how === 'bai' ? 0 : 1, Math.round(l.items[id] * keep));
        if (n > 0) { TT.items.add(c, id, n); got.push(D.ITEMS[id].n + (n > 1 ? ' x' + n : '')); }
      });
      const parts = [];
      if (how === 'xong') { const bonus = dungeon.stoneBonus(c, dg); if (bonus.length) parts.push(bonus.join(', ')); }
      if (gold) parts.push(TT.ls.fmt(gold)); if (xp) parts.push('tu vi +' + Math.round(xp)); if (got.length) parts.push(got.join(', '));
      const done = dg.i >= dg.nodes.length || how === 'xong';
      let price = '';
      if (how === 'bai') price = TT.loss.defeat(c, { sev: rng.P(0.55) ? 1 : 2, xp: 0.12, items: rng.P(0.5) ? 2 : 1, gear: 0.3 });
      else if (how === 'chay') price = TT.loss.defeat(c, { sev: rng.P(0.3) ? 1 : 0, items: rng.P(0.4) ? 1 : 0 });
      const head = { xong: 'Bạn thông quan ' + dg.name + '!', rut: 'Bạn rút lui khỏi ' + dg.name + ' đúng lúc.', chay: 'Bạn bỏ chạy khỏi ' + dg.name + ' với những gì còn giữ được.', bai: 'Bạn bại trận và tháo chạy khỏi ' + dg.name + ', mất nửa thu hoạch.' }[how];
      if (how === 'chay') parts.push('rơi mất 30% thu hoạch khi chạy');
      if (allyNote) parts.push(allyNote);
      TT.log(c, head + ' Thu hoạch: ' + (parts.length ? parts.join('; ') : 'tay trắng') + '.', how === 'xong' ? 'big' : how === 'bai' ? 'bad' : 'good');
      if (how === 'xong') { TT.report.mark(c, 'clear', 'Thông quan ' + dg.name); TT.rep.add(c, 'danh', 6 + c.realm * 3); c.tcd += 1; TT.log(c, 'Thiên cơ điểm +1.', 'good'); c.clears = (c.clears || 0) + 1; }
      else if (dg.i >= 2) TT.rep.add(c, 'danh', 2);
      return how;
    },

    // Thông quan được thưởng linh thạch. Trung phẩm trở lên chỉ có ở cảnh giới Nguyên Anh trở đi (xác suất thấp), hạ cảnh giới chỉ có hạ phẩm.
    stoneBonus(c, dg) {
      const out = [], r = c.realm, L = D.LS;
      const low = rng.RI(1, 3) * (1 + r);
      TT.ls.gain(c, low); out.push(TT.ls.fmt(low * L.RATE));
      if (r >= 4 && rng.P(dg.kind === 'hung_dia' ? 0.4 : 0.25)) { TT.ls.gainStone(c, 1, 1); out.push('1 linh thạch trung phẩm'); }
      if (r >= 5 && rng.P(0.03)) { TT.ls.gainStone(c, 2, 1); out.push('1 linh thạch thượng phẩm'); }
      return out;
    },

    // Khi bí cảnh mở ra (tin đồn): vài tu sĩ NPC trong vùng đổ vào thử vận, có người không ra.
    npcRush(rid, name) {
      const w = TT.world, cand = Object.keys(w.chars).map(k => w.chars[k]).filter(c => c.alive && c.kind === 'npc' && c.tier === 'core' && c.region === rid && c.realm >= 1 && !c.cross);
      if (!cand.length) return;
      const n = Math.min(cand.length, rng.RI(2, 5));
      let dead = 0, rich = 0;
      rng.shuffle(cand).slice(0, n).forEach(c => {
        const p = rng.clamp(0.55 + c.realm * 0.06 - 0.1, 0.25, 0.9);
        if (rng.P(p)) { c.gold += rng.RI(20, 80) * (1 + c.realm); TT.ev.xp(c, TT.ev.NR(c) * 0.03); rich++; }
        else if (rng.P(0.35)) { dead++; TT.life.die(c, 'bỏ mạng trong ' + name); }
        else c.hp = Math.max(1, c.hp * 0.4);
      });
      TT.news(name + ' mở cửa: ' + n + ' tu sĩ trong vùng đổ vào, ' + rich + ' người thu hoạch khá' + (dead ? ', ' + dead + ' người không bao giờ trở ra' : '') + '.', dead ? 'bad' : 'age', []);
    }
  };
})();


