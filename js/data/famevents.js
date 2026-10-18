// Sự kiện gia đình: tỏ tình và kết đạo lữ, ghen tuông, nợ ân tình, nhận đồ đệ, chuyện nhà. Viết ở mức văn học.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};
  const rng = TT.rng;
  const X = k => function () { return TT.ev[k].apply(null, arguments); };
  const xp = X('xp'), gold = X('gold'), hp = X('hp'), NR = X('NR'), dao = X('dao'), G = X('good'), B = X('bad'), other = X('other');
  const P = p => rng.P(p);
  const GONE = 'Người kia đã không còn ở đây nữa.';
  const realmName = c => D.REALM_NAMES[c.realm];

  D.EVENTS.push(
    {
      id: 'rel_to_tinh', tier: 3, manual: true, cool: 0, title: 'Duyên tình',
      text: (c, ctx) => {
        const o = other(ctx);
        return ctx.initiator
          ? 'Bạn và ' + o.name + ' (' + realmName(o) + ') ngày càng gắn bó. Có những điều bạn đã giấu trong lòng đủ lâu. Có lẽ đã tới lúc ngỏ lời kết đạo lữ.'
          : o.name + ' (' + realmName(o) + ') nhìn bạn, ngập ngừng hồi lâu rồi nói khẽ: "Ta muốn cùng ngươi kết đạo lữ, sớm tối có nhau trên con đường này."';
      },
      choices: [
        {
          key: 'dong_y', label: (c, ctx) => (ctx.initiator ? 'Ngỏ lời kết đạo lữ' : 'Nhận lời kết đạo lữ'), kind: 'help', ai: 1.5, run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            TT.family.pair(c, o); dao(c, 2);
            return G('Hai người trao nhau lời thề dưới trăng. ' + o.name + ' từ nay là đạo lữ của bạn.');
          }
        },
        {
          key: 'tu', label: 'Giữ nguyên là tri kỷ', kind: 'safe', ai: 0.5, run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            const r = TT.rel.get(c, o); if (r) r.love = Math.max(0, (r.love || 0) - 30);
            TT.rel.add(c, o, -4);
            return 'Bạn nói lòng mình chưa thể trao đi. ' + o.name + ' mỉm cười gượng, ánh mắt thoáng vẻ chùng xuống.';
          }
        }
      ]
    },
    {
      id: 'rel_ghen', tier: 2, manual: true, cool: 0, title: 'Hờn ghen',
      text: (c, ctx) => { const o = other(ctx), n = TT.world.chars[ctx.newId]; return o.name + ' nghe tin bạn vừa kết đạo lữ với ' + (n ? n.name : 'người khác') + '. Đôi mắt ' + (o.gender === 'nu' ? 'nàng' : 'chàng') + ' đỏ hoe, chờ một lời giải thích.'; },
      choices: [
        {
          key: 'giai', label: 'Dịu giọng giải thích', kind: 'help', run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            if (P(0.55 + (c.daoTam - 50) * 0.004)) { TT.rel.add(c, o, 6); return G(o.name + ' lặng lẽ nghe hết, rồi thở dài, nắm tay bạn. Sóng gió tạm lắng.'); }
            TT.rel.add(c, o, -12); const r = TT.rel.get(c, o); if (r) r.love = Math.max(0, (r.love || 0) - 15);
            return B(o.name + ' không nghe lọt tai, quay lưng bỏ đi. Tình cảm rạn nứt.');
          }
        },
        {
          key: 'qua', label: 'Tặng quà dỗ dành (50 vàng)', kind: 'pay', disabled: c => (TT.ls.wealth(c) < 50 ? 'Không đủ vàng' : false), run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            gold(c, -50); TT.rel.add(c, o, 5);
            return G(o.name + ' nhận quà, nét mặt dịu xuống dù chưa hết giận.');
          }
        },
        {
          key: 'thang', label: 'Nói thẳng: đại đạo trên hết', kind: 'risk', run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            if (P(0.4)) { TT.rel.add(c, o, -5); return 'Bạn nói thẳng. ' + o.name + ' im lặng thật lâu rồi chấp nhận, dù lòng không nguôi.'; }
            TT.family.unpair(c, o, 'không chịu nổi sự lạnh nhạt'); return B(o.name + ' cười nhạt rồi rời đi. Mối duyên này đến đây là hết.');
          }
        }
      ]
    },
    {
      id: 'rel_doi_no', tier: 2, manual: true, cool: 0, title: 'Nợ ân tình',
      text: (c, ctx) => { const o = other(ctx), d = (c.debts || []).find(x => x.id === o.id); return o.name + ' tìm tới, nhắc lại ân tình xưa' + (d ? ' (' + d.why + ')' : '') + ': "Món nợ này, ' + (ctx.amt || 100) + ' vàng, đã đến lúc tính."'; },
      choices: [
        {
          key: 'tra', label: (c, ctx) => 'Trả nợ (' + (ctx.amt || 100) + ' vàng)', kind: 'pay', disabled: (c, ctx) => (TT.ls.wealth(c) < (ctx.amt || 100) ? 'Không đủ vàng' : false), run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            gold(c, -(ctx.amt || 100)); gold(o, ctx.amt || 100); TT.rel.add(c, o, 8); TT.rep.add(c, 'chinh', 2);
            c.debts = (c.debts || []).filter(x => x.id !== o.id);
            return G('Bạn trả sạch món nợ. ' + o.name + ' gật đầu: "Ân tình đã rõ."');
          }
        },
        {
          key: 'lam', label: 'Làm việc trả công', kind: 'help', run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            hp(c, -10); TT.rel.add(c, o, 5);
            c.debts = (c.debts || []).filter(x => x.id !== o.id);
            return G('Bạn làm việc cho ' + o.name + ' suốt mấy tháng để trả ân. Nợ được xóa, tuy hơi mệt.');
          }
        },
        {
          key: 'quyt', label: 'Quịt nợ', kind: 'risk', ai: 0.3, run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            c.debts = (c.debts || []).filter(x => x.id !== o.id);
            TT.rel.add(c, o, -50); TT.rep.add(c, 'chinh', -4);
            if (P(0.5)) TT.social.makeEnemy(o, c, 'bị quịt nợ ân tình');
            return B('Bạn phủi tay không nhận. ' + o.name + ' nhìn bạn bằng ánh mắt khinh bỉ. Tiếng tăm của bạn bị hoen ố.');
          }
        }
      ]
    },
    {
      id: 'rel_nhan_do', tier: 3, w: 1.5, cool: 120, title: 'Bái sư',
      when: c => c.realm >= 2 && TT.age(c) >= 30 && TT.family.disciples(c).length < TT.family.MAX_DISCIPLES,
      setup: c => {
        let o = TT.social.here(c).find(x => x.kind === 'npc' && x.tier === 'core' && TT.age(x) >= 10 && TT.age(x) <= 30 && !TT.family.canRecruit(c, x));
        if (!o) {
          o = TT.life.spawnNpc(rng.RI(14, 22), c.region);
          if (o) { o.place = c.place; o.dest = null; o.travel = null; if (TT.family.canRecruit(c, o)) o = null; }
        }
        return o ? { otherId: o.id } : null;
      },
      text: (c, ctx) => {
        const o = other(ctx);
        return o.name + ' (' + TT.age(o) + ' tuổi, ' + realmName(o) + ', tư chất ' + o.tuchat.total + ' điểm) quỳ xuống trước mặt bạn: "Xin tiền bối nhận vãn bối làm đồ đệ, vãn bối nguyện hầu hạ suốt đời!"';
      },
      choices: [
        { key: 'nhan', label: 'Nhận làm đồ đệ', kind: 'help', run: (c, ctx) => { const o = other(ctx); if (!o) return GONE; TT.family.recruit(c, o); return G('Bạn nhận ' + o.name + ' làm đồ đệ. Từ nay hai người gắn bó thầy trò.'); } },
        { key: 'tu', label: 'Từ chối khéo', kind: 'safe', ai: 0.6, run: (c, ctx) => { const o = other(ctx); if (o) TT.rel.add(c, o, -2); return 'Bạn nói mình chưa đủ tư cách làm thầy người. Đứa trẻ cúi đầu lui ra.'; } }
      ]
    },
    {
      id: 'fam_gia_dinh', tier: 1, w: 2, cool: 36, title: 'Chuyện nhà',
      when: c => TT.family.partners(c).length > 0 || TT.family.children(c).length > 0,
      text: 'Một buổi chiều yên ả, cả nhà quây quần bên mâm cơm.',
      choices: [{ key: 'ok', label: 'Tiếp tục', kind: 'safe', run: c => { dao(c, 1); hp(c, 8); return G('Tiếng cười nói giản dị làm lòng bạn nhẹ đi. Đạo tâm tăng, sinh lực hồi phục.'); } }]
    },
    {
      id: 'fam_day_con', tier: 2, w: 1.5, cool: 36, title: 'Dạy con',
      when: c => TT.family.children(c).some(k => TT.age(k) >= 6 && TT.age(k) <= 17),
      setup: c => { const k = rng.pick(TT.family.children(c).filter(x => TT.age(x) >= 6 && TT.age(x) <= 17)); return k ? { otherId: k.id } : null; },
      text: (c, ctx) => { const k = other(ctx); return k.name + ' (' + TT.age(k) + ' tuổi) chạy tới, ánh mắt sáng lên: "Cha mẹ ơi, dạy con tu luyện đi!"'; },
      choices: [
        { key: 'day', label: 'Dành thời gian truyền thụ', kind: 'help', run: (c, ctx) => { const k = other(ctx); if (!k) return GONE; k.xp += D.NEED[0] * 0.25; TT.rel.add(c, k, 6); dao(c, 1); return G('Bạn kiên nhẫn chỉ dạy ' + k.name + ' từng nhịp thở. Đứa trẻ tiến bộ thấy rõ, tình cha con thêm khăng khít.'); } },
        { key: 'khong', label: 'Bảo con chờ lớn thêm', kind: 'safe', ai: 0.5, run: (c, ctx) => { const k = other(ctx); if (k) TT.rel.add(c, k, -2); return 'Bạn xoa đầu con và hẹn năm sau. Đứa trẻ hơi thất vọng.'; } }
      ]
    }
  );
  D.EVENTS.forEach(e => { D.eventById[e.id] = e; });
})();
