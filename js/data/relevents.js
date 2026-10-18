// Sự kiện về quan hệ giữa người với người và các cơ hội có hạn (tin đồn báo trước). Đều manual: do hệ thống xã hội
// hoặc hệ thống tin đồn kích hoạt, không bốc ngẫu nhiên. ctx.otherId là người liên quan, ctx.name/place là chữ của cơ hội.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};
  const rng = TT.rng;
  const X = k => function () { return TT.ev[k].apply(null, arguments); };
  const xp = X('xp'), gold = X('gold'), hp = X('hp'), NR = X('NR'), lp = X('lp'), kyNgo = X('kyNgo'), dao = X('dao'),
    G = X('good'), B = X('bad'), other = X('other');
  const P = p => rng.P(p), RI = (a, b) => rng.RI(a, b);
  const realmName = c => D.REALM_NAMES[c.realm];
  const persName = c => D.personalityById[c.personality].n.toLowerCase();
  const GONE = 'Người kia đã không còn ở đây nữa.';

  D.EVENTS.push(
    // ---------------- quan hệ ----------------
    {
      id: 'rel_ket_nghia', tier: 2, manual: true, cool: 0, title: 'Kết nghĩa',
      text: (c, ctx) => { const o = other(ctx); return o.name + ' (' + realmName(o) + ', tính ' + persName(o) + ') ngỏ lời: "Đạo hữu với ta hợp nhau như vậy, chi bằng kết nghĩa huynh đệ, sống chết có nhau?"'; },
      choices: [
        {
          key: 'ket', label: 'Đồng ý kết nghĩa', kind: 'help', run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            TT.rel.add(c, o, 15); TT.rel.setKind(c, o, 'ket_nghia'); dao(c, 2);
            return G('Hai người cắt máu ăn thề. ' + o.name + ' từ nay là huynh đệ kết nghĩa của bạn, đạo tâm bạn vững thêm.');
          }
        },
        {
          key: 'tu', label: 'Khéo từ chối', kind: 'safe', ai: 0.5, run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            TT.rel.add(c, o, -4); TT.rel.get(c, o).nk = 1; // đã từ chối thì không ngỏ lại
            return 'Bạn nói đường tu còn dài, chưa dám nhận lời. ' + o.name + ' thoáng tiếc nuối rồi cười xòa.';
          }
        }
      ]
    },
    {
      id: 'rel_xung_dot', tier: 2, manual: true, cool: 0, title: 'Va chạm',
      text: (c, ctx) => { const o = other(ctx); return o.name + ' (' + realmName(o) + ') nói những lời khó nghe ngay trước mặt mọi người, hàm ý coi thường bạn.'; },
      choices: [
        { key: 'nhuong', label: 'Nuốt giận cho qua', kind: 'safe', run: (c, ctx) => { const o = other(ctx); if (!o) return GONE; TT.rel.add(c, o, -2); TT.rep.add(c, 'chinh', 1); dao(c, 1); return 'Bạn nén giận, quay đi. Đạo tâm vững thêm một chút nhưng lòng vẫn nặng trĩu.'; } },
        {
          key: 'doi', label: 'Đối đầu thử sức', kind: 'fight', run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            const r = TT.combat.quick(c, o, { lethal: false });
            if (r.win) {
              TT.rep.add(c, 'danh', 2); TT.rel.add(c, o, -8);
              if (P(0.3)) TT.social.makeEnemy(o, c, 'bị bạn đánh bại giữa chốn đông người');
              return G('Bạn đánh bại ' + o.name + ' sau ' + r.rounds + ' hiệp. Danh tiếng của bạn tăng lên.');
            }
            TT.rel.add(c, o, -3); return B(o.name + ' mạnh hơn bạn. Bạn thua sau ' + r.rounds + ' hiệp, sinh lực -' + r.dmgA + '.');
          }
        },
        {
          key: 'hoa', label: 'Mời rượu hòa giải (10 vàng)', kind: 'help', disabled: c => (TT.ls.wealth(c) < 10 ? 'Không đủ vàng' : false), run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            gold(c, -10); TT.rel.add(c, o, 8); TT.rep.add(c, 'chinh', 1);
            return G('Một chén rượu hóa giải hiềm khích. ' + o.name + ' gật đầu, thái độ dịu đi.');
          }
        }
      ]
    },
    {
      id: 'rel_nho_giup', tier: 2, manual: true, cool: 0, title: 'Nhờ giúp đỡ',
      text: (c, ctx) => { const o = other(ctx); return o.name + ' đang túng quẫn, ngập ngừng ngỏ lời mượn bạn ' + (ctx.amt || 20) + ' vàng, hẹn khi nào khá giả sẽ trả.'; },
      choices: [
        {
          key: 'giup', label: (c, ctx) => 'Cho mượn ' + (ctx.amt || 20) + ' vàng', kind: 'help', disabled: (c, ctx) => (TT.ls.wealth(c) < (ctx.amt || 20) ? 'Không đủ vàng' : false), run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            const amt = ctx.amt || 20;
            gold(c, -amt); gold(o, amt); TT.rel.add(c, o, 12); TT.rep.add(c, 'chinh', 2);
            const r = TT.rel.get(c, o); r.debt = amt; r.cred = c.id;
            return G('Bạn cho ' + o.name + ' mượn ' + amt + ' vàng. Họ cảm kích ra mặt, nợ ân tình này được ghi nhớ.');
          }
        },
        { key: 'tu', label: 'Từ chối', kind: 'safe', ai: 0.6, run: (c, ctx) => { const o = other(ctx); if (!o) return GONE; TT.rel.add(c, o, -6); return 'Bạn nói mình cũng chẳng dư dả. Ánh mắt ' + o.name + ' thoáng buồn.'; } }
      ]
    },
    {
      id: 'rel_gap_nguoi', tier: 2, manual: true, cool: 0, title: 'Người có duyên',
      text: (c, ctx) => { const o = other(ctx); return o.name + ' (' + realmName(o) + ', tính ' + persName(o) + ') tình cờ bắt chuyện, hai bên nói rất hợp ý.'; },
      choices: [
        {
          key: 'quen', label: 'Làm quen kỹ hơn', kind: 'help', run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            TT.rel.add(c, o, 18);
            return G('Bạn và ' + o.name + ' trò chuyện rất lâu. Quan hệ thân thiết hơn nhiều, giờ hai người là: ' + TT.rel.label(c, o) + '.');
          }
        },
        { key: 'bo', label: 'Lịch sự cáo từ', kind: 'safe', ai: 0.5, run: (c, ctx) => 'Bạn khéo léo cáo từ. Có lẽ duyên phận chưa tới.' }
      ]
    },
    {
      id: 'rel_ke_thu', tier: 3, manual: true, cool: 0, title: 'Kẻ thù tìm đến',
      text: (c, ctx) => {
        const o = other(ctx), r = TT.rel.get(c, o);
        return o.name + ' (' + realmName(o) + ') chặn đường bạn: "Món nợ ' + ((r && r.why) || 'xưa') + ', hôm nay ta đến đòi!"' +
          '\nSinh lực của bạn: ' + Math.round(c.hp) + '/' + TT.stats.hpMax(c) + '. Hắn mạnh ' + (TT.combat.power(o) > TT.combat.power(c) * 1.2 ? 'hơn bạn thấy rõ' : TT.combat.power(o) < TT.combat.power(c) * 0.8 ? 'yếu hơn bạn' : 'ngang bạn') + '.';
      },
      choices: [
        {
          key: 'danh', label: 'Ra tay giao chiến', kind: 'fight', run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            const r = TT.combat.quick(c, o, { lethal: false, important: true, edgeB: D.DG.hunter });
            if (r.win) {
              TT.rep.add(c, 'danh', 3);
              if (o.alive) TT.events.fire(c, D.eventById.rel_tha_giet, { otherId: o.id });
              return G('Bạn đánh gục ' + o.name + ' sau ' + r.rounds + ' hiệp, sinh lực -' + r.dmgA + '.');
            }
            return afterLose(c, o, r);
          }
        },
        {
          key: 'chay', label: 'Bỏ chạy', kind: 'flee', run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            if (TT.items.remove(c, 'thoat_than_bua')) {
              o.huntWait = TT.world.months + 8;
              return G('Bạn xé Thoát Thân Phù, một đạo kim quang cuốn bạn đi xa. ' + o.name + ' mất dấu một thời gian, nhưng mối thù vẫn còn.');
            }
            const p = rng.clamp(0.28 + (c.realm - o.realm) * 0.12 + TT.stats.nl(c) * 0.003 + TT.stats.luck(c) * 0.01, 0.1, 0.85);
            if (P(p)) { o.huntWait = TT.world.months + 8; hp(c, -5); return G('Bạn thoát thân trong gang tấc. ' + o.name + ' mất dấu một thời gian, nhưng mối thù vẫn còn.'); }
            hp(c, -15);
            const r = TT.combat.quick(c, o, { lethal: false, tacticA: 'thu' });
            if (r.win) { if (o.alive) TT.events.fire(c, D.eventById.rel_tha_giet, { otherId: o.id }); return G('Bạn bị chặn lại, đành quay đầu liều mạng và thắng.'); }
            return afterLose(c, o, r);
          }
        },
        {
          key: 'xin', label: 'Xin hòa giải (đền bù)', kind: 'safe', ai: 0.5, disabled: c => (TT.ls.wealth(c) < 30 ? 'Không đủ vàng' : false), run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            const cost = Math.min(TT.ls.wealth(c), RI(40, 100) * (1 + c.realm));
            gold(c, -cost);
            if (P(0.35 + (TT.rep.alignOf(o) > 0 ? 0.2 : 0))) {
              const r = TT.rel.get(c, o); r.k = ''; r.v = -30; r.by = 0; o.vows = (o.vows || []).filter(i => i !== c.id);
              return G('Bạn đền bù ' + cost + ' vàng và nhận lỗi. ' + o.name + ' im lặng một lúc rồi bỏ đi: mối thù tạm gác lại.');
            }
            o.huntWait = TT.world.months + 6;
            return B('Bạn đền bù ' + cost + ' vàng nhưng ' + o.name + ' chỉ cười lạnh nhận lấy rồi bỏ đi, nói rằng chuyện chưa xong.');
          }
        },
        {
          key: 'ban', label: 'Cầu cứu bạn thân ở gần', kind: 'help', disabled: c => (allyHere(c) ? false : 'Không có bạn thân ở đây'), run: (c, ctx) => {
            const o = other(ctx), a = allyHere(c); if (!o || !a) return GONE;
            const r = TT.combat.quick(a, o, { lethal: false });
            TT.rel.add(c, a, 10);
            TT.family.addDebt(c, a, 80 * (1 + a.realm), 'ra tay giúp bạn trước kẻ thù');
            if (r.win) { o.huntWait = TT.world.months + 12; return G(a.name + ' kịp tới, đẩy lùi ' + o.name + '. Bạn nợ ân tình bạn thân này.'); }
            hp(a, -10); return B(a.name + ' không địch nổi ' + o.name + '. Hai người đành rút lui, ' + o.name + ' vẫn còn đó.');
          }
        }
      ]
    },
    {
      id: 'rel_tha_giet', tier: 3, manual: true, cool: 0, title: 'Kẻ thù nằm dưới chân',
      text: (c, ctx) => { const o = other(ctx); return o.name + ' đã gục dưới tay bạn, sinh lực thoi thóp. Hắn nhìn bạn không chớp mắt. Tha hay giết là do bạn.'; },
      choices: [
        {
          key: 'tha', label: 'Tha mạng', kind: 'help', run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            dao(c, 2); TT.rep.add(c, 'chinh', 3);
            const r = TT.rel.get(c, o);
            if (r) { r.v = Math.max(r.v, -45) + 20; if (r.v > -60) { r.k = ''; r.by = 0; o.vows = (o.vows || []).filter(i => i !== c.id); } }
            return G('Bạn buông tay, để ' + o.name + ' đi. Hắn đứng im rất lâu. Có lẽ mối thù này đã nhẹ đi, có lẽ chưa.');
          }
        },
        {
          key: 'giet', label: 'Giết để trừ hậu họa', kind: 'fight', run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            dao(c, -2);
            o.hp = 0; TT.social.kill(c, o, 'trừ hậu họa');
            return B('Bạn ra tay dứt khoát. ' + o.name + ' không còn nữa. Bạn thấy lòng nặng hơn, và biết rằng bạn bè hắn sẽ không quên.');
          }
        }
      ]
    },
    // ---------------- cơ hội có hạn (tin đồn báo trước) ----------------
    {
      id: 'opp_bi_canh', tier: 2, manual: true, cool: 0, title: 'Bí cảnh mở cửa',
      text: (c, ctx) => ctx.name + ' đã mở cửa như tin đồn. Quanh lối vào, đủ hạng người chen chúc, kẻ háo hức, kẻ lo âu. Cửa chỉ mở trong thời gian ngắn.',
      choices: [
        {
          key: 'vao', label: 'Tiến vào bí cảnh', kind: 'risk', run: c => {
            const k = kyNgo(c, 0.16, ['tot', 'tu_chat', 'di', 'xoa']);
            if (k) { xp(c, NR(c) * 0.03); return k; }
            const r = rng.next() - TT.stats.luck(c) * 0.005 - 0.05;
            if (r < 0.45) {
              xp(c, NR(c) * 0.07); gold(c, 40 * (1 + c.realm)); TT.rep.add(c, 'danh', 2);
              const bk = P(0.4) ? TT.ev.book(c, c.realm >= 2 ? 2 : 1) : null;
              return G('Bạn đoạt được bảo vật trong bí cảnh! Tu vi tăng mạnh, thu thêm ' + 40 * (1 + c.realm) + ' vàng.' + (bk ? ' Trong đống đổ nát còn một bí kíp: ' + bk + '!' : ''));
            }
            if (r < 0.7) return 'Bí cảnh chỉ còn những gian phòng trống, đã có người nhanh chân hơn bạn.';
            hp(c, -45); return B('Cấm chế của bí cảnh đánh bạn trọng thương. Sinh lực -45.');
          }
        },
        { key: 'bo', label: 'Đứng ngoài xem', kind: 'safe', run: c => 'Bạn đứng ngoài nhìn người ta ra vào, không dám liều.' }
      ]
    },
    {
      id: 'opp_cao_nhan', tier: 2, manual: true, cool: 0, title: 'Cao nhân giảng đạo',
      text: (c, ctx) => 'Như tin đồn, một vị cao nhân đang giảng đạo ở ' + ctx.place + '. Người nghe đông đảo, có người mang lễ vật tới xin thụ giáo.',
      choices: [
        {
          key: 'nghe', label: 'Dâng lễ vật (20 vàng) nghe giảng', kind: 'help', disabled: c => (TT.ls.wealth(c) < 20 ? 'Không đủ vàng' : false), run: c => {
            gold(c, -20); xp(c, NR(c) * 0.08 * (0.7 + TT.ev.ngo(c) * 0.6)); dao(c, 2); TT.rep.add(c, 'danh', 1);
            const k = kyNgo(c, 0.12, ['tu_chat', 'lo', 'kv', 'xoa']);
            return k || G('Bạn nghe giảng trọn ba ngày, ngộ ra nhiều điều. Tu vi tăng, đạo tâm vững hơn.');
          }
        },
        { key: 'bo', label: 'Không đủ lễ vật, đứng ngoài nghe lỏm', kind: 'safe', ai: 0.4, run: c => { xp(c, NR(c) * 0.01); return 'Bạn đứng xa nghe lỏm được vài câu. Tu vi tăng chút ít.'; } }
      ]
    },
    {
      id: 'opp_dau_gia', tier: 2, manual: true, cool: 0, title: 'Phiên đấu giá',
      text: (c, ctx) => 'Phiên đấu giá ở ' + ctx.place + ' có một lô Phá Cảnh Đan, nghe nói giá hời hơn chợ thường.',
      choices: [
        {
          key: 'mua', label: c => 'Đấu giá một viên Phá Cảnh Đan (' + TT.ls.fmt(Math.round(TT.stats.pillCost(c) * 0.7)) + ')', kind: 'pay',
          disabled: c => (TT.ls.wealth(c) < Math.round(TT.stats.pillCost(c) * 0.7) ? 'Không đủ vàng' : false),
          run: c => { gold(c, -Math.round(TT.stats.pillCost(c) * 0.7)); TT.items.add(c, 'pha_canh_dan'); return G('Bạn đấu giá được một viên Phá Cảnh Đan giá hời, cất vào túi để dùng khi đột phá.'); }
        },
        { key: 'xem', label: 'Chỉ xem náo nhiệt', kind: 'safe', run: c => { const k = kyNgo(c, 0.05, ['lo', 'kv']); return k || 'Bạn xem người ta tranh nhau trả giá, nghe được kha khá chuyện giang hồ.'; } }
      ]
    },
    {
      id: 'opp_luan_dao', tier: 2, manual: true, cool: 0, title: 'Đại hội luận đạo',
      text: (c, ctx) => 'Đại hội luận đạo ở ' + ctx.place + ' bắt đầu. Các tu sĩ trong vùng tụ về, ai cũng muốn nghe và được nghe.',
      choices: [
        {
          key: 'du', label: 'Lên đài luận đạo', kind: 'risk', run: c => {
            const nl = TT.stats.nl(c), p = rng.clamp(nl / (nl + 16 + c.realm * 6) + (c.daoTam - 50) * 0.003, 0.15, 0.85);
            const folks = TT.social.here(c).filter(o => o.tier === 'core');
            rng.shuffle(folks).slice(0, 2).forEach(o => TT.rel.add(c, o, 12));
            if (P(p)) { xp(c, NR(c) * 0.05); dao(c, 2); c.daoDiem += 2; TT.rep.add(c, 'danh', 4); return G('Bạn bác được nhiều người, tiếng tăm nổi lên. Tu vi, đạo tâm tăng và quen thêm vài người.'); }
            dao(c, -2); return B('Bạn bị hỏi đến cứng họng. Đạo tâm dao động, nhưng cũng quen thêm vài người.');
          }
        },
        { key: 'xem', label: 'Ngồi dưới nghe', kind: 'safe', run: c => { xp(c, NR(c) * 0.015); return 'Bạn ngồi dưới lắng nghe, lượm lặt được ít điều hay.'; } }
      ]
    }
  );

  // Bên thua: kẻ thù chưa chắc đã giết. Thế lực mạnh và hiếu sát thì giết, còn lại lấy tiền rồi đi.
  function afterLose(c, o, r) {
    const kill = o.realm >= c.realm - 1 && P(0.62 - TT.rep.alignOf(o) * 0.003);
    if (kill) {
      c.hp = 0;
      TT.social.kill(o, c, 'báo thù');
      return B('Bạn thua sau ' + r.rounds + ' hiệp và không gượng dậy nổi.');
    }
    const take = Math.floor(TT.ls.wealth(c) * 0.5);
    gold(c, -take); TT.rel.add(c, o, 10); o.huntWait = TT.world.months + 18;
    const price = TT.loss.defeat(c, { sev: 2, xp: 0.15, items: 2, gear: 0.35 });
    return B('Bạn thua sau ' + r.rounds + ' hiệp. ' + o.name + (take > 0 ? ' lấy ' + TT.ls.fmt(take) + ' rồi bỏ đi, bảo rằng đây mới chỉ là lãi.' : ' nhìn túi tiền trống rỗng của bạn, cười nhạt rồi bỏ đi, bảo rằng sẽ còn quay lại.') + price);
  }

  // Một người bạn thân (thiện cảm >= 40) đang ở cùng địa điểm với người chơi.
  function allyHere(c) {
    const list = TT.social.here(c);
    return list.find(o => o.tier === 'core' && TT.rel.v(c, o) >= 40 && o.realm >= 1) || null;
  }

  D.EVENTS.forEach(e => { D.eventById[e.id] = e; });
})();
