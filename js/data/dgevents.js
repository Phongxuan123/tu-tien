// Sự kiện thám hiểm nhiều bước (cấm chế, quái vật, kho báu, chỗ nghỉ, thủ lĩnh), lối vào bí cảnh, yêu thú theo chiến thuật,
// và sự kiện dọc đường khi vượt vùng. Các bước thám hiểm là sự kiện thủ công do TT.dungeon mở ra.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};
  const rng = TT.rng;
  const X = k => function () { return TT.ev[k].apply(null, arguments); };
  const xp = X('xp'), gold = X('gold'), hp = X('hp'), NR = X('NR'), lp = X('lp'), kyNgo = X('kyNgo'), dao = X('dao'), G = X('good'), B = X('bad'), item = X('item'), book = X('book');
  const P = p => rng.P(p), RI = (a, b) => rng.RI(a, b);
  const realmName = r => D.REALM_NAMES[r];
  const GONE = 'Cục diện đã thay đổi, chẳng còn gì để làm ở đây.';
  const nodeOf = (c, ctx) => (c.dungeon ? c.dungeon.nodes[ctx.i] : null);

  const hdr = c => {
    const d = c.dungeon;
    return d.name + ' · chặng ' + (d.i + 1) + '/' + d.nodes.length + '. Thu hoạch hiện có: ' + TT.dungeon.lootText(c) + '. Sinh lực ' + Math.round(c.hp) + '/' + TT.stats.hpMax(c) + '.';
  };
  const stepTitle = names => (c, ctx) => (c.dungeon ? 'Chặng ' + (c.dungeon.i + 1) + ': ' + names : names);
  // Rút lui càng sâu càng khó: đường lui có thể bị thứ gì đó chặn lại (đánh thua thì coi như bại trận).
  function retreat(c) {
    const d = c.dungeon, depth = d.i;
    if (depth >= 1 && P(D.DG.ambush * depth)) {
      const pool = D.MONSTERS.filter(m => m.tier <= Math.min(2, Math.floor(depth / 2)) && !m.boss && !m.guard);
      const def = rng.pick(pool), mon = TT.combat.makeMonster(def, Math.min(5, c.realm + (depth >= 3 ? 1 : 0)), D.DG.mob);
      const res = TT.combat.run(c, mon, { lethal: false, tacticA: 'thu', important: true });
      TT.bond.assist(c, res, null, def.n);
      if (!res.win) { const nm = d.name; TT.dungeon.finish(c, 'bai'); return B('Trên đường lui, ' + def.n + ' bất ngờ chặn lại. Bạn thua và phải bỏ chạy khỏi ' + nm + '.'); }
      TT.dungeon.finish(c, 'rut'); return G('Đường lui bị ' + def.n + ' chặn, bạn phải đánh một trận (sinh lực -' + res.dmgA + ') rồi mới thoát ra được.');
    }
    TT.dungeon.finish(c, 'rut'); return 'Bạn quyết định dừng lại khi còn có thể.';
  }
  const rut = { key: 'rut', label: 'Rút lui, mang theo thu hoạch (càng sâu càng dễ bị chặn đường)', kind: 'safe', ai: c => (c.hp < TT.stats.hpMax(c) * 0.4 ? 2.5 : 0.35), run: c => retreat(c) };

  // Dòng chi tiết cho nhật ký sau một trận: đối thủ, sức mạnh hai bên, số hiệp, thương tổn, khắc chế.
  function fightNote(c, mon, def, realm, res) {
    const pa = Math.round(TT.combat.power(c)), pb = Math.round(TT.combat.power(mon));
    return 'Đối thủ ' + def.n + ' (' + realmName(realm) + ', hệ ' + def.elem + '). Sức mạnh bạn ' + pa + ' so với ' + pb + ' · ' + res.rounds + ' hiệp · sinh lực -' + res.dmgA + (res.notes && res.notes.length ? ' · ' + res.notes.join(', ') : '') + '.';
  }
  // Trận đánh trong thám hiểm. tactic: 'cong' | 'thu' | 'chay'.
  function doFight(c, ctx, tactic) {
    const n = nodeOf(c, ctx);
    if (!n) return GONE;
    const def = D.monsterById[n.m], mon = TT.combat.makeMonster(def, n.r, n.f);
    const res = TT.combat.run(c, mon, { lethal: n.lethal, tacticA: tactic === 'chay' ? 'thu' : tactic, flee: tactic === 'chay', important: true });
    TT.bond.assist(c, res, null, def.n); // 9K: bạn đồng hành có thể xoay trận hoặc chết thay
    if (res.fled) { const nm = c.dungeon.name; TT.dungeon.finish(c, 'chay'); return G('Bạn thoát khỏi ' + def.n + ' và chạy ra khỏi ' + nm + '.'); }
    const note = res.notes.length ? ' (' + res.notes.join(', ') + ')' : '';
    if (res.win) {
      const lvl = def.tier;
      TT.dungeon.addLoot(c, { gold: Math.round(RI(6, 18) * (1 + c.realm * 0.6) * (1 + lvl * 0.4)), xp: NR(c) * 0.012 * (1 + lvl) });
      (def.drops || []).forEach(d => { if (P(d[1])) TT.dungeon.addLoot(c, { item: d[0] }); });
      // vật liệu luyện khí: nanh hoặc da mang thuộc tính của quái, khoáng thạch theo bậc
      if (P(0.5 + 0.1 * lvl) && def.elem) TT.dungeon.addLoot(c, { item: TT.gear.matKey(P(0.5) ? 'nanh' : 'da', def.elem, Math.min(3, lvl)) });
      if (lvl >= 1 && P(0.18 * lvl)) TT.dungeon.addLoot(c, { item: lvl >= 2 ? 'huyen_thiet' : 'tinh_thiet' });
      if (n.t === 'boss') {
        TT.dungeon.addLoot(c, { gold: Math.round(RI(35, 80) * (1 + c.realm)), xp: NR(c) * 0.10 });
        TT.dungeon.rollTreasure(c, 1.6, true); TT.dungeon.rollTreasure(c, 1.2, true);
        TT.dungeon.addLoot(c, { item: TT.gear.matKey(P(0.5) ? 'nanh' : 'da', def.elem, 3) }); if (P(0.7)) TT.dungeon.addLoot(c, { item: 'huyen_thiet' }); if (P(0.15)) TT.dungeon.addLoot(c, { item: 'thien_thach' });
        const k = kyNgo(c, 0.18);
        if (k) { TT.log(c, k.t, 'big'); }
      }
      const t = 'Bạn hạ ' + def.n + ' sau ' + res.rounds + ' hiệp, sinh lực -' + res.dmgA + note + '.', fn = fightNote(c, mon, def, n.r, res);
      TT.dungeon.next(c);
      return G(t, fn);
    }
    // thua: đánh tới cùng thì có thể chết
    if (c.hp <= 0 && TT.items.remove(c, 'thoat_than_bua')) { c.hp = 1; TT.dungeon.finish(c, 'bai'); TT.loss.hurt(c, 3); return B('Giữa lúc đối thủ ra đòn chí mạng, Thoát Thân Phù tự bốc cháy và cuốn bạn ra khỏi trận. Bạn thoát chết, nhưng căn cơ tổn hại nặng.'); }
    if (c.hp <= 0 && P(0.3 + Math.max(0, TT.stats.luck(c)) * 0.004)) { c.hp = 1; TT.dungeon.finish(c, 'bai'); TT.loss.hurt(c, 3); return B('Bạn gục trước ' + def.n + ', nhưng thoát chết trong gang tấc nhờ một tia may mắn. Căn cơ tổn hại nặng.'); }
    if (c.hp <= 0) {
      const name = c.dungeon.name; c.dungeon = null;
      TT.life.die(c, 'bỏ mạng trong ' + name + ' dưới tay ' + def.n);
      return B('Bạn ngã xuống trước ' + def.n + '.');
    }
    TT.dungeon.finish(c, 'bai');
    return B('Bạn bại trận trước ' + def.n + ' sau ' + res.rounds + ' hiệp, sinh lực -' + res.dmgA + note + '.', fightNote(c, mon, def, n.r, res));
  }
  // Tỉ lệ sức mạnh giữa người chơi và đối thủ của chặng (để máy biết có nên liều không).
  function ratioOf(c, ctx) {
    const n = ctx && nodeOf(c, ctx);
    if (!n) return 1;
    const mon = TT.combat.makeMonster(D.monsterById[n.m], n.r, n.f);
    return (TT.combat.power(c) * Math.max(0.3, c.hp / TT.stats.hpMax(c))) / TT.combat.power(mon);
  }
  const fightAiCong = (c, ctx) => (c.hp > TT.stats.hpMax(c) * 0.6 ? 1.3 : 0.7) * Math.min(1.5, Math.max(0.3, ratioOf(c, ctx)));
  const fightAiThu = (c, ctx) => (c.hp < TT.stats.hpMax(c) * 0.5 ? 1.7 : 0.6);

  function fightText(c, ctx, boss) {
    const n = nodeOf(c, ctx), def = D.monsterById[n.m];
    const mon = TT.combat.makeMonster(def, n.r, n.f);
    const pa = TT.combat.power(c), pb = TT.combat.power(mon);
    const em = TT.combat.elemMul(c, mon);
    return hdr(c) + '\n' + def.desc + '\nĐối thủ: ' + def.n + ' (' + realmName(n.r) + ', hệ ' + def.elem + '), ' + (pb > pa * 1.2 ? 'mạnh hơn bạn thấy rõ' : pb < pa * 0.8 ? 'yếu hơn bạn' : 'ngang sức bạn') +
      (em >= 1.12 ? '. Thuộc tính của bạn khắc chế nó' : em <= 0.9 ? '. Thuộc tính của bạn bị nó khắc chế' : '') + '.' + (boss && n.lethal ? '\nTrận này đánh tới cùng, thua có thể mất mạng.' : '') +
      '\nChọn chiến thuật: công (gây nhiều, nhận nhiều), thủ (gây ít, nhận ít), hoặc chạy.';
  }
  function fightChoices() {
    return [
      { key: 'cong', label: 'Tấn công mạnh', kind: 'fight', ai: fightAiCong, run: (c, ctx) => doFight(c, ctx, 'cong') },
      { key: 'thu', label: 'Thủ chắc, mài dần', kind: 'fight', ai: fightAiThu, run: (c, ctx) => doFight(c, ctx, 'thu') },
      { key: 'chay', label: 'Bỏ chạy', kind: 'flee', run: (c, ctx) => doFight(c, ctx, 'chay') }
    ];
  }

  function trapStat(c, n) {
    const S = TT.stats;
    if (n.check === 'nl') return S.nl(c);
    if (n.check === 'luck') return 10 + S.luck(c) * 3;
    if (n.check === 'atk') return S.atk(c);
    // elem: hợp thuộc tính vùng thì dễ
    return 8 + TT.map.affinity(c, TT.map.region(c.region)) * 40 + S.nl(c) * 0.3;
  }

  D.EVENTS.push(
    // ---------------- lối vào ----------------
    {
      id: 'dg_loi_vao', tier: 2, w: 1.5, cool: 36, title: 'Lối vào hiểm địa', places: ['bi_canh', 'tan_tich', 'hung_dia'],
      when: c => !TT.dungeon.canEnter(c),
      text: c => { const p = TT.map.place(c.place); return 'Bạn đứng trước lối vào ' + p.n + ' (' + D.PLACE_TYPES[p.type].n + '). Nơi này nhiều cơ duyên nhưng cũng nhiều người không trở ra. Bên trong có nhiều chặng, mỗi chặng một rủi ro; rút lui được nhưng càng đi sâu càng dễ bị chặn đường. Đa số người vào đây không thắng: thua trận phải trả giá bằng thương tích, đồ đạc và cả tu vi.'; },
      choices: [
        { key: 'vao', label: 'Tiến vào thám hiểm', kind: 'risk', run: c => { TT.dungeon.enter(c, c.place); return 'Bạn quyết định thử vận may.'; } },
        { key: 'bo', label: 'Quay đi', kind: 'safe', run: c => 'Bạn nhìn lối vào tối om một lúc rồi quay đi.' }
      ]
    },
    // ---------------- các chặng ----------------
    {
      id: 'dg_trap', tier: 2, manual: true, cool: 0, title: stepTitle('Cấm chế'),
      text: (c, ctx) => { const n = nodeOf(c, ctx); return hdr(c) + '\n' + n.text; },
      choices: [
        {
          key: 'giai', label: 'Tìm cách hóa giải', kind: 'risk', run: (c, ctx) => {
            const n = nodeOf(c, ctx); if (!n) return GONE;
            const st = trapStat(c, n), p = rng.clamp(0.3 + 0.5 * st / (st + n.diff) + TT.stats.luck(c) * 0.005, 0.15, 0.9);
            if (P(p)) { TT.dungeon.addLoot(c, { gold: Math.round(RI(15, 35) * (1 + c.realm * 0.5)) }); TT.dungeon.next(c); return G('Bạn hóa giải được cấm chế, tìm thấy chút của cải bên trong.'); }
            const dmg = Math.round(RI(15, 35) * (1 + c.realm * 0.2) * D.DG.trapDmg); hp(c, -dmg); TT.dungeon.next(c); return B('Cấm chế phản phệ, sinh lực -' + dmg + ', nhưng bạn vẫn lách qua được.');
          }
        },
        {
          key: 'pha', label: 'Dùng sức phá thẳng', kind: 'risk', run: (c, ctx) => {
            const n = nodeOf(c, ctx); if (!n) return GONE;
            const a = TT.stats.atk(c), p = rng.clamp(0.25 + 0.5 * a / (a + n.diff * 1.2), 0.15, 0.85);
            if (P(p)) { TT.dungeon.addLoot(c, { xp: NR(c) * 0.01 }); TT.dungeon.next(c); return G('Bạn phá tan cơ quan bằng sức mạnh thuần túy.'); }
            const dmg = Math.round(RI(25, 50) * (1 + c.realm * 0.2) * D.DG.trapDmg); hp(c, -dmg); TT.dungeon.next(c); return B('Cơ quan nổ tung, sinh lực -' + dmg + '.');
          }
        },
        {
          key: 'vong', label: 'Tìm lối vòng cho chắc', kind: 'safe', run: c => {
            if (P(0.3)) { hp(c, -8); TT.dungeon.next(c); return 'Lối vòng quanh co, bạn trầy xước chút ít (sinh lực -8) nhưng không dính cơ quan.'; }
            TT.dungeon.next(c); return 'Bạn tìm được lối vòng, đi qua an toàn mà không thu được gì.';
          }
        },
        rut
      ]
    },
    {
      id: 'dg_fight', tier: 2, manual: true, cool: 0, title: (c, ctx) => { const n = c.dungeon && nodeOf(c, ctx); return 'Chặng ' + (c.dungeon ? c.dungeon.i + 1 : '') + ': ' + (n ? D.monsterById[n.m].n : 'Giao chiến'); },
      text: (c, ctx) => fightText(c, ctx, false), choices: fightChoices()
    },
    {
      id: 'dg_boss', tier: 3, manual: true, cool: 0, title: (c, ctx) => { const n = c.dungeon && nodeOf(c, ctx); return 'Thủ lĩnh: ' + (n ? D.monsterById[n.m].n : ''); },
      text: (c, ctx) => fightText(c, ctx, true),
      choices: fightChoices().concat([Object.assign({}, rut, { label: 'Lùi lại trước khi giáp mặt, mang theo thu hoạch', ai: (c, ctx) => (c.hp < TT.stats.hpMax(c) * 0.5 || ratioOf(c, ctx) < 0.7 ? 3 : 0.25) })])
    },
    {
      id: 'dg_treasure', tier: 2, manual: true, cool: 0, title: stepTitle('Kho báu'),
      text: (c, ctx) => { const n = nodeOf(c, ctx); return hdr(c) + '\n' + n.text + ' Có vẻ có bẫy canh giữ.'; },
      choices: [
        {
          key: 'lay_het', label: 'Vơ vét hết, chấp nhận rủi ro', kind: 'risk', run: (c, ctx) => {
            const n = nodeOf(c, ctx); if (!n) return GONE;
            if (P(0.35 - TT.stats.luck(c) * 0.005)) {
              const dmg = Math.round(RI(20, 45) * (1 + c.realm * 0.2) * D.DG.trapDmg); hp(c, -dmg);
              TT.dungeon.rollTreasure(c, n.rich, false); TT.dungeon.next(c);
              return B('Bẫy canh giữ phát động, sinh lực -' + dmg + '. Bạn chỉ kịp vơ được một phần.');
            }
            TT.dungeon.rollTreasure(c, n.rich, true);
            const k = kyNgo(c, 0.12, ['tot', 'tu_chat', 'kv', 'xoa']);
            TT.dungeon.next(c);
            return k || G('Bạn vơ vét hết mà không dính bẫy. Thu hoạch lớn.');
          }
        },
        { key: 'lay_it', label: 'Lấy vừa đủ, tránh bẫy', kind: 'safe', run: (c, ctx) => { const n = nodeOf(c, ctx); if (!n) return GONE; TT.dungeon.rollTreasure(c, n.rich, false); TT.dungeon.next(c); return G('Bạn chỉ lấy phần dễ lấy nhất rồi lùi ra. Thu hoạch khiêm tốn nhưng an toàn.'); } },
        rut
      ]
    },
    {
      id: 'dg_rest', tier: 2, manual: true, cool: 0, title: stepTitle('Chỗ nghỉ'),
      text: (c, ctx) => { const n = nodeOf(c, ctx); return hdr(c) + '\n' + n.text; },
      choices: [
        { key: 'nghi', label: 'Nghỉ lấy sức', kind: 'safe', ai: c => (c.hp < TT.stats.hpMax(c) * 0.7 ? 2 : 0.8), run: c => { const g = Math.round(TT.stats.hpMax(c) * 0.4); hp(c, g); TT.dungeon.next(c); return G('Bạn nghỉ ngơi, sinh lực hồi ' + g + '.'); } },
        { key: 'tiep', label: 'Không nghỉ, đi tiếp ngay', kind: 'risk', run: c => { TT.dungeon.next(c); return 'Bạn không dám chần chừ, đi tiếp.'; } },
        rut
      ]
    },

    // ---------------- yêu thú theo chiến thuật (thay sự kiện cũ) ----------------
    {
      id: 'yeu_thu', tier: 2, w: 2, cool: 24, npc: 0.5, title: 'Yêu thú tấn công', when: c => c.realm >= 1,
      setup: c => ({ wild: 1, m: pickWild(c, 0).id }),
      text: c => 'Một con yêu thú lao ra từ bụi rậm, mắt đỏ rực. Chọn chiến thuật: công, thủ hoặc chạy.',
      choices: [
        { key: 'cong', label: 'Tấn công', kind: 'fight', ai: fightAiCong, run: (c, ctx) => wildFight(c, 'cong', 0, null, ctx) },
        { key: 'thu', label: 'Thủ chắc', kind: 'fight', ai: fightAiThu, run: (c, ctx) => wildFight(c, 'thu', 0, null, ctx) },
        { key: 'chay', label: 'Bỏ chạy', kind: 'flee', run: (c, ctx) => wildFight(c, 'chay', 0, null, ctx) }
      ]
    },
    // ---------------- thiên kiếp (từng đợt) ----------------
    {
      id: 'tri_phase', tier: 3, manual: true, cool: 0, title: (c, ctx) => 'Thiên kiếp, đợt ' + (c.tri ? c.tri.phase + 1 : '') + (c.tri ? '/' + c.tri.total : ''),
      text: (c, ctx) => {
        const t = c.tri, dmg = Math.round(TT.stats.hpMax(c) * D.TRI.dmg[t.target]);
        const g = t.guard && TT.world.chars[t.guard];
        return 'Kiếp vân ép xuống, đợt tiếp theo sắp giáng: ước chừng ' + dmg + ' sát thương (sinh lực của bạn ' + Math.round(c.hp) + '/' + TT.stats.hpMax(c) + '). ' +
          'Trong túi: ' + TT.items.count(c, 'ho_than_bua') + ' Hộ Thân Phù, ' + TT.items.count(c, 'hoi_xuan_dan') + ' Hồi Xuân Đan' + (g && g.alive ? '. Hộ pháp ' + g.name + ' đang đứng sau lưng.' : '.') +
          ' Vượt hết các đợt, bạn sẽ đột phá lên ' + D.REALM_NAMES[t.target] + '; gục xuống thì mất mạng (trừ khi nghịch thiên).';
      },
      choices: [
        { key: 'cung', label: 'Cứng đối cứng, dùng thân thể chịu kiếp', kind: 'risk', run: c => TT.tri.strike(c, 'cung') },
        { key: 'bua', label: 'Kích hoạt Hộ Thân Phù (giảm 40%)', kind: 'safe', ai: (c) => (TT.items.has(c, 'ho_than_bua') ? 2 : 0), disabled: c => (TT.items.has(c, 'ho_than_bua') ? false : 'Không có Hộ Thân Phù'), run: c => TT.tri.strike(c, 'bua') },
        { key: 'dan', label: 'Uống Hồi Xuân Đan rồi chịu kiếp', kind: 'safe', ai: (c) => (TT.items.has(c, 'hoi_xuan_dan') && c.hp < TT.stats.hpMax(c) * 0.6 ? 2.5 : 0), disabled: c => (TT.items.has(c, 'hoi_xuan_dan') ? false : 'Không có Hồi Xuân Đan'), run: c => TT.tri.strike(c, 'dan') },
        { key: 'ho', label: 'Nhờ hộ pháp gánh bớt (giảm 25%)', kind: 'help', ai: 1.5, disabled: c => { const g = c.tri && c.tri.guard && TT.world.chars[c.tri.guard]; return g && g.alive ? false : 'Không có hộ pháp'; }, run: c => TT.tri.strike(c, 'ho') }
      ]
    },
    // ---------------- dọc đường vượt vùng ----------------
    {
      id: 'cx_bao', tier: 2, cross: true, manual: true, w: 2, cool: 0, title: 'Bão hư không',
      text: 'Giữa khoảng không bất tận, một cơn bão linh khí cuộn tới. Bạn phải chọn: xuyên qua hay tìm chỗ nấp.',
      choices: [
        { key: 'xuyen', label: 'Xuyên thẳng qua bão', kind: 'risk', run: c => { if (P(lp(c, 0.5) + TT.stats.nl(c) * 0.002)) { xp(c, NR(c) * 0.05); return G('Bạn hấp thụ một phần linh khí cuồng bạo. Tu vi tăng.'); } hp(c, -40); return B('Cơn bão xé nát hộ thể. Sinh lực -40.'); } },
        { key: 'tru', label: 'Nấp vào khe không gian chờ bão qua', kind: 'safe', run: c => { hp(c, -10); return 'Bạn nấp suốt vài ngày. Sinh lực -10 nhưng giữ được mạng.'; } }
      ]
    },
    {
      id: 'cx_yeu_thu', tier: 2, cross: true, manual: true, w: 2, cool: 0, title: 'Yêu thú lang thang', setup: c => ({ m: pickWild(c, 1).id }),
      text: 'Một con yêu thú khổng lồ lang thang giữa hư không phát hiện ra bạn và lao tới.',
      choices: [
        { key: 'cong', label: 'Tấn công', kind: 'fight', ai: fightAiCong, run: (c, ctx) => wildFight(c, 'cong', 1, null, ctx) },
        { key: 'thu', label: 'Thủ chắc', kind: 'fight', ai: fightAiThu, run: (c, ctx) => wildFight(c, 'thu', 1, null, ctx) },
        { key: 'chay', label: 'Bỏ chạy', kind: 'flee', run: (c, ctx) => wildFight(c, 'chay', 1, null, ctx) }
      ]
    },
    {
      id: 'cx_dao_tac', tier: 2, cross: true, manual: true, w: 1.5, cool: 0, title: 'Đạo tặc chặn đường',
      text: c => 'Một đám đạo tặc điều khiển thuyền không gian chặn đường, đòi lộ phí. Chúng có vẻ mạnh ngang bạn.',
      choices: [
        { key: 'tra', label: 'Nộp lộ phí (một phần ba số vàng)', kind: 'pay', run: c => { const g = Math.floor(TT.ls.wealth(c) / 3); gold(c, -g); return 'Bạn nộp ' + g + ' vàng cho chúng qua. Chúng cười rồi biến mất.'; } },
        { key: 'danh', label: 'Đánh trả', kind: 'fight', run: c => wildFight(c, 'cong', 1, 'Đạo tặc') },
        { key: 'chay', label: 'Bỏ chạy', kind: 'flee', run: c => wildFight(c, 'chay', 1, 'Đạo tặc') }
      ]
    },
    {
      id: 'cx_di_tich', tier: 2, cross: true, manual: true, w: 1.5, cool: 0, title: 'Di tích trôi lơ lửng',
      text: 'Một mảnh vỡ của đại lục cổ xưa trôi lơ lửng giữa hư không, trên đó còn sót lại ít kiến trúc đổ nát.',
      choices: [
        {
          key: 'tham', label: 'Hạ xuống thám hiểm', kind: 'risk', run: c => {
            const k = kyNgo(c, 0.2, ['tot', 'tu_chat', 'di', 'lo']);
            if (k) return k;
            if (P(0.55)) { const bk = book(c, 2); gold(c, 60 * (1 + c.realm)); return G('Bạn tìm thấy ít bảo vật' + (bk ? ' và một bí kíp: ' + bk : '') + '.'); }
            hp(c, -30); return B('Cấm chế cổ xưa còn hiệu lực. Sinh lực -30.');
          }
        },
        { key: 'bo', label: 'Bay qua', kind: 'safe', run: c => 'Bạn liếc nhìn rồi bay tiếp, lòng vẫn lấn cấn.' }
      ]
    },
    {
      id: 'cx_thuong_doan', tier: 2, cross: true, manual: true, w: 1.5, cool: 0, title: 'Đoàn buôn đi ngược chiều',
      text: 'Một đoàn thuyền buôn đi ngược chiều, cờ hiệu thương hội lớn. Họ chào bán đan dược và nhận mua hàng thừa của bạn.',
      choices: [
        {
          key: 'mua', label: 'Mua đan dược (150 vàng)', kind: 'pay', disabled: c => (TT.ls.wealth(c) < 150 ? 'Không đủ vàng' : false), run: c => {
            gold(c, -150); const a = item(c, 'pha_canh_dan'), b = item(c, 'hoi_xuan_dan', 2);
            return G('Bạn mua được ' + a + ' và ' + b + ' với giá cao hơn thường.');
          }
        },
        { key: 'ban', label: 'Bán hàng thừa', kind: 'help', run: c => { let g = 0; Object.keys(c.inv || {}).forEach(id => { const d = D.ITEMS[id]; if (d.cat === 'lieu' || d.cat === 'dan' && id !== 'pha_canh_dan' && c.inv[id] > 2) { const n = c.inv[id] - (d.cat === 'dan' ? 2 : 0); g += Math.floor(TT.items.value(c, id) * 0.5) * n; TT.items.remove(c, id, n); } }); gold(c, g); return g ? G('Bạn bán hàng thừa được ' + g + ' vàng.') : 'Bạn chẳng có gì thừa để bán.'; } },
        { key: 'bo', label: 'Không giao dịch', kind: 'safe', run: c => 'Bạn vẫy tay chào rồi đi tiếp.' }
      ]
    },
    {
      id: 'cx_lu_khach', tier: 2, cross: true, manual: true, w: 1.2, cool: 0, title: 'Lữ khách cô độc',
      text: 'Một lữ khách cô độc ngồi trên mảnh đá trôi, nhìn bạn đầy hy vọng. Có vẻ ông ta đã lạc đường từ lâu.',
      choices: [
        { key: 'chuyen', label: 'Dừng lại trò chuyện, chỉ đường', kind: 'help', run: c => { dao(c, 1); const k = kyNgo(c, 0.09, ['lo', 'kv', 'tu_chat']); return k || G('Ông ta cảm kích, kể bạn nghe vài chuyện cũ. Đạo tâm bạn nhẹ đi.'); } },
        { key: 'cuop', label: 'Cướp của ông ta', kind: 'risk', ai: 0.2, run: c => { TT.rep.add(c, 'chinh', -6); if (P(0.7)) { gold(c, 40 * (1 + c.realm)); return B('Bạn cướp được ít của cải, nhưng lòng không yên. Tiếng thơm giảm.'); } hp(c, -20); return B('Lão không phải tay vừa. Bạn bị thương (-20) và mang tiếng xấu.'); } }
      ]
    },
    {
      id: 'cx_tam_ma', tier: 2, cross: true, manual: true, w: 1.5, cool: 0, title: 'Cô độc sinh tâm ma',
      text: 'Nhiều năm trời chỉ có một mình giữa hư không, những ký ức cũ hiện lên rõ ràng và đau đớn.',
      choices: [
        { key: 'doi', label: 'Đối mặt từng ký ức', kind: 'risk', run: c => { const p = rng.clamp(0.4 + (c.daoTam - 50) * 0.008 + TT.stats.mod(c, 'tm') + TT.nature.mods(c).tamMa, 0.1, 0.9); if (P(p)) { dao(c, 3); xp(c, NR(c) * 0.03); return G('Bạn nhìn thẳng vào quá khứ và buông được. Đạo tâm vững hơn.'); } hp(c, -25); dao(c, -3); return B('Ký ức nuốt chửng bạn. Sinh lực -25, đạo tâm tổn thương.'); } },
        { key: 'tinh', label: 'Nhắm mắt tĩnh tâm', kind: 'safe', run: c => 'Bạn tĩnh tâm cho tới khi mọi thứ lắng xuống.' }
      ]
    },
    {
      id: 'cx_linh_khi', tier: 2, cross: true, manual: true, w: 1.5, cool: 0, title: 'Dòng linh khí cuộn chảy',
      text: 'Bạn bắt gặp một dòng linh khí cuộn chảy, mùi vị thuần khiết hiếm gặp.',
      choices: [
        { key: 'ngo', label: 'Dừng lại cảm ngộ', kind: 'help', run: c => { xp(c, NR(c) * 0.06 * (0.7 + TT.ev.ngo(c) * 0.6)); if (c.kind === 'player') TT.tech.practice(c, 3); return G('Bạn hấp thụ dòng linh khí. Tu vi tăng.'); } },
        { key: 'bo', label: 'Không dám trễ nải', kind: 'safe', ai: 0.4, run: c => 'Bạn đi tiếp, không muốn lỡ hành trình.' }
      ]
    },
    {
      id: 'cx_canh_dep', tier: 1, cross: true, manual: true, w: 1.5, cool: 0, title: 'Cảnh sắc vô ngần',
      text: 'Giữa hư không mênh mông, một dải ngân hà rực rỡ trải ra trước mắt.',
      choices: [{ key: 'ok', label: 'Tiếp tục', kind: 'safe', run: c => { dao(c, 1); return G('Bạn ngắm nhìn thật lâu, thấy mình nhỏ bé mà lòng rộng mở. Đạo tâm tăng.'); } }]
    },
    {
      id: 'cx_loi_van', tier: 2, cross: true, manual: true, w: 1, cool: 0, title: 'Lôi vân ngưng tụ',
      text: 'Mây sấm kéo đến ngưng tụ phía trước, như thể thiên địa đang thử thách bạn.',
      choices: [
        { key: 'chiu', label: 'Đứng yên chịu một đạo lôi', kind: 'risk', run: c => { hp(c, -35); xp(c, NR(c) * 0.05); c.trainNl += 0.6; return G('Lôi đình tôi luyện thân thể. Sinh lực -35 nhưng tu vi và niệm lực tăng.'); } },
        { key: 'tranh', label: 'Đi vòng tránh mây', kind: 'safe', run: c => 'Bạn đi vòng, mất thêm chút thời gian nhưng bình an.' }
      ]
    }
  );

  // Yêu thú hoang: mạnh yếu theo nguy hiểm của nơi đang ở (hoặc vùng khi đang trên đường).
  // Chọn trước con yêu thú (để giao diện vẽ đúng con sắp đánh): lưu id trong ctx.m của hộp quyết định.
  function pickWild(c, hard) {
    const st = c.place && !c.travel && !c.cross ? TT.map.placeStats(TT.map.place(c.place)) : { danger: 3 };
    const tier = rng.clamp(Math.floor(st.danger / 2) + (hard ? 1 : 0), 0, 2);
    const pool = D.MONSTERS.filter(m => m.tier === tier && !m.boss && !m.guard);
    return rng.pick(pool.length ? pool : D.MONSTERS.slice(0, 3));
  }
  function wildFight(c, tactic, hard, label, ctx) {
    const def = (ctx && ctx.m && D.monsterById[ctx.m]) || pickWild(c, hard), tier = def.tier;
    // Yêu thú hoang: càng nguy hiểm càng dễ gặp con vượt cảnh giới của bạn một bậc.
    const up = rng.P(D.DG.wildUp + 0.12 * tier + (hard ? 0.2 : 0));
    const mon = TT.combat.makeMonster(def, Math.min(5, c.realm + (up ? 1 : 0)), D.DG.wild * (hard ? 1.05 : 1));
    if (label) mon.name = label;
    const res = TT.combat.run(c, mon, { lethal: false, tacticA: tactic === 'chay' ? 'thu' : tactic, flee: tactic === 'chay', important: c.kind === 'player' });
    const nm = label || def.n;
    if (res.fled) return G('Bạn chạy thoát khỏi ' + nm + '.');
    const note = res.notes.length ? ' (' + res.notes.join(', ') + ')' : '';
    if (res.win) {
      xp(c, NR(c) * 0.015 * (1 + tier)); TT.items.matDrop(c, def, 0.45);
      if (c.kind === 'player' && !label && P(0.5)) { item(c, 'yeu_dan'); return G('Bạn hạ được ' + nm + ' sau ' + res.rounds + ' hiệp' + note + ' và mổ lấy một viên Yêu đan.', fightNote(c, mon, def, mon.realm, res)); }
      gold(c, RI(15, 35) * (1 + c.realm * 0.5));
      return G('Bạn hạ được ' + nm + ' sau ' + res.rounds + ' hiệp' + note + ', thu chút của cải.', fightNote(c, mon, def, mon.realm, res));
    }
    const price = TT.loss.defeat(c, { sev: P(0.4) ? 1 : 0, items: P(0.3) ? 1 : 0 });
    return B(nm + ' mạnh hơn dự đoán. Bạn bị thương (sinh lực -' + res.dmgA + ') rồi thoát thân' + note + '.' + price, fightNote(c, mon, def, mon.realm, res));
  }

  // Thay sự kiện cũ cùng id bằng bản mới (cùng id trong D.EVENTS), và gắn thám hiểm vào các sự kiện bí cảnh cũ.
  const seen = {};
  for (let i = D.EVENTS.length - 1; i >= 0; i--) { const id = D.EVENTS[i].id; if (seen[id]) D.EVENTS.splice(i, 1); else seen[id] = 1; }
  D.EVENTS.forEach(e => { D.eventById[e.id] = e; });
  // Bản mới của yeu_thu đứng sau nên giữ bản cuối; đảm bảo D.eventById trỏ đúng.
  D.eventById.bi_canh_mo.choices[0].run = c => {
    const why = TT.dungeon.canEnter(c);
    if (why) return 'Bạn muốn vào nhưng ' + why.toLowerCase() + '.';
    TT.dungeon.enter(c, c.place, 'bi_canh'); return 'Bạn lao vào bí cảnh vừa lộ diện.';
  };
  D.eventById.opp_bi_canh.choices[0].run = (c, ctx) => {
    const why = TT.dungeon.canEnter(c);
    if (why) return 'Bạn muốn vào nhưng ' + why.toLowerCase() + '.';
    TT.dungeon.enter(c, c.place, 'bi_canh'); return 'Cánh cổng bí cảnh khép lại sau lưng bạn.';
  };
})();

