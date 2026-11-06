// Sự kiện của hành trình đạo lữ (R mục 5; Z "9B"): lễ kết đạo lữ, hôn ước bị ép, rạn nứt, thử thách chung. Đều manual:
// TT.bond.tick / TT.bond.yearly kích hoạt khi D.BOND.on. Viết ở mức văn học, không miêu tả chi tiết thân mật.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};
  const rng = TT.rng;
  const X = k => function () { return TT.ev[k].apply(null, arguments); };
  const gold = X('gold'), hp = X('hp'), lp = X('lp'), dao = X('dao'), G = X('good'), B = X('bad'), other = X('other');
  const P = p => rng.P(p);
  const GONE = 'Người kia đã không còn ở đây nữa.';
  const poor = n => c => (TT.ls.wealth(c) < n ? 'Không đủ vàng' : false);
  const he = o => (o.gender === 'nu' ? 'nàng' : 'chàng');

  // Thử thách chung: v = loại. good = ở bên nhau cùng vượt qua (có giá), bad = né tránh.
  const THU = {
    nan: { t: o => o.name + ' lâm trọng bệnh, thuốc thang tốn kém, linh khí trong người ' + he(o) + ' cũng rối loạn. Bạn phải chọn: ở lại hay lo việc của mình.', good: 'Ở lại chăm sóc ngày đêm', cost: 'hp', amt: -18, ok: ' thức trắng nhiều đêm bên giường bệnh, ', bad: 'Nhờ người khác lo, bạn đi làm việc của mình' },
    nha: { t: o => 'Gia đình bạn (hoặc người thân của ' + o.name + ') phản đối mối duyên này, lời ra tiếng vào không dứt. ' + o.name + ' nhìn bạn, chờ một lời khẳng định.', good: 'Đứng ra bênh vực trước mọi người', cost: 'danh', amt: -3, ok: ' nghe bạn nói giữa đông người mà đỏ hoe mắt, ', bad: 'Im lặng, để mọi chuyện tự lắng' },
    duong: { t: o => 'Bạn vừa tiến thêm một bước trên đường tu, còn ' + o.name + ' đứng lại phía sau. Hai người chợt nhận ra con đường của mình đang rẽ khác nhau.', good: 'Chậm lại một nhịp để đi cùng', cost: 'xp', amt: -0.1, ok: ' hiểu rằng bạn đã nhường bước vì mình, ', bad: 'Bước tiếp, hẹn gặp lại ở phía trước' }
  };

  D.EVENTS.push(
    {
      id: 'bond_ket', tier: 2, manual: true, cool: 0, title: 'Lễ kết đạo lữ',
      text: (c, ctx) => { const o = other(ctx); return 'Lời hứa giữa bạn và ' + o.name + ' đã đủ lâu để thành nếp. Đã đến lúc làm lễ, để trời đất và người quanh chứng giám đôi bạn đồng hành trên đường đạo.'; },
      choices: [
        {
          key: 'gian_di', label: 'Lễ giản dị, chỉ hai người', kind: 'help', ai: 1.3, run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            const r = TT.bond.advance(c, o, 'ket', { force: true }); if (!r.ok) return B('Chuyện kết đạo lữ chưa thành.');
            TT.bond.shift(c, o, { trust: 5 }); dao(c, 1);
            return G('Hai người lặng lẽ thắp một nén hương, trao nhau lời thề. ' + o.name + ' từ nay là đạo lữ của bạn.');
          }
        },
        {
          key: 'le_tong', label: 'Xin tông môn chứng giám', kind: 'help', ai: 1, disabled: c => (c.sect ? false : 'Bạn chưa thuộc tông môn nào'), run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            const r = TT.bond.advance(c, o, 'ket', { force: true }); if (!r.ok) return B('Chuyện kết đạo lữ chưa thành.');
            TT.rep.add(c, 'danh', 3); TT.bond.shift(c, o, { respect: 8 }); dao(c, 1);
            return G('Trưởng bối trong tông làm chứng, đồng môn chúc mừng. Lễ không lớn nhưng trang trọng, ' + o.name + ' từ nay là đạo lữ của bạn.');
          }
        },
        {
          key: 'tiec', label: 'Mở tiệc mừng (100 vàng)', kind: 'pay', ai: 0.7, disabled: poor(100), run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            const r = TT.bond.advance(c, o, 'ket', { force: true }); if (!r.ok) return B('Chuyện kết đạo lữ chưa thành.');
            gold(c, -100); TT.rep.add(c, 'danh', 6); TT.bond.shift(c, o, { love: 5 });
            return G('Đèn hoa treo khắp nơi, bạn bè xa gần tới chung vui. ' + o.name + ' từ nay là đạo lữ của bạn, tiếng tăm bạn cũng vang xa thêm một chút.');
          }
        },
        {
          key: 'cho', label: 'Hãy đợi thêm một thời gian', kind: 'safe', ai: 0.4, run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            const d = TT.bond.ensure(c, o); if (d) d.askM = TT.world.months + 12;
            TT.bond.shift(c, o, { love: -3 });
            return 'Bạn nói cần thêm thời gian. ' + o.name + ' gật đầu, nhưng ánh mắt thoáng một nỗi chờ đợi.';
          }
        }
      ]
    },
    {
      id: 'bond_hon_uoc', tier: 2, manual: true, cool: 0, title: 'Hôn ước',
      text: (c, ctx) => {
        const o = other(ctx);
        return (ctx.by === 'tong' ? 'Trưởng lão trong tông đã bàn bạc với bên kia và muốn định hôn ước giữa bạn và ' : 'Gia tộc đã tự bàn và muốn định hôn ước giữa bạn và ') + o.name + ' (' + D.REALM_NAMES[o.realm] + '), vì lợi ích hai bên. Bạn không được hỏi ý kiến trước.';
      },
      choices: [
        {
          key: 'nhan', label: 'Nhận lời hôn ước', kind: 'safe', ai: 1, run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            TT.bond.betroth(c, o, ctx.by || 'toc'); TT.bond.shift(c, o, { respect: 10 });
            return 'Bạn cúi đầu nhận lời. Hôn ước được định, hạn ba năm; tình cảm hai người còn phải nảy nở theo thời gian.';
          }
        },
        {
          key: 'tu', label: 'Từ chối khéo', kind: 'safe', ai: 0.8, run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            TT.rel.add(c, o, -4); TT.rep.add(c, 'danh', -3); dao(c, 1);
            return 'Bạn thưa rõ lòng mình chưa thể nhận hôn sự này. Bên đặt hôn thất vọng, vài lời ra tiếng vào, nhưng không ai ép được bạn gật đầu.';
          }
        },
        {
          key: 'tron', label: 'Bỏ đi, tránh khỏi hôn sự (50 vàng)', kind: 'risk', ai: 0.3, disabled: poor(50), run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            gold(c, -50);
            if (P(lp(c, 0.5))) return G('Bạn rời đi trước khi ai kịp nói gì thêm. Hôn ước không thành, và cũng không ai đuổi theo.');
            TT.rep.add(c, 'danh', -8); TT.rel.add(c, o, -10);
            return B('Bạn bị bắt gặp giữa đường. Chuyện bị đem ra bàn tán, danh tiếng bạn tổn hại nặng.');
          }
        }
      ]
    },
    {
      id: 'bond_ran', tier: 2, manual: true, cool: 0, title: 'Rạn nứt',
      text: (c, ctx) => { const o = other(ctx); return 'Giữa bạn và ' + o.name + ' đã nhiều ngày không nói với nhau một lời trọn vẹn. Chuyện nhỏ thành chuyện lớn, và cả hai đều đang chờ người kia nhún trước.'; },
      choices: [
        {
          key: 'hoa', label: 'Ngồi xuống nói chuyện cho rõ', kind: 'help', ai: 1.3, run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            const d = TT.bond.ensure(c, o); if (!d) return GONE;
            const p = rng.clamp(0.45 + TT.bond.compat(c, o) * 0.2 + (c.daoTam - 50) * 0.003 + d.trust / 100 * 0.2, 0.15, 0.9);
            if (P(p)) { TT.bond.shift(c, o, { love: 12, trust: 10 }); d.st = 'ben'; d.since = TT.world.months; return G('Hai người nói hết những điều giấu trong lòng. ' + o.name + ' nắm tay bạn thật lâu. Giận hờn tan dần.'); }
            TT.bond.shift(c, o, { love: -8, trust: -5 });
            return B('Càng nói càng không hiểu nhau. ' + o.name + ' im lặng một hồi rồi quay đi.');
          }
        },
        {
          key: 'chia', label: 'Chia tay trong êm đẹp', kind: 'safe', ai: 0.4, run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            TT.bond.breakup(c, o, 'hai người chọn đường riêng');
            return 'Bạn và ' + o.name + ' chào nhau lần cuối, không oán trách. Con đường phía trước mỗi người một ngả.';
          }
        },
        {
          key: 'cho', label: 'Để thời gian trả lời', kind: 'safe', ai: 0.6, run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            TT.bond.shift(c, o, { love: -2 });
            return 'Bạn quyết không nói thêm. Khoảng lặng giữa hai người kéo dài, chưa biết rồi sẽ ra sao.';
          }
        }
      ]
    },
    {
      id: 'bond_thu_thach', tier: 2, manual: true, cool: 0, title: 'Thử thách chung',
      text: (c, ctx) => { const o = other(ctx); return THU[ctx.v || 'nan'].t(o); },
      choices: [
        {
          key: 'chung', label: (c, ctx) => THU[ctx.v || 'nan'].good, kind: 'help', ai: 1.3, run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            const t = THU[ctx.v || 'nan'];
            if (t.cost === 'hp') hp(c, t.amt); else if (t.cost === 'danh') TT.rep.add(c, 'danh', t.amt); else c.xp = Math.max(0, c.xp + t.amt * TT.ev.NR(c));
            const d = TT.bond.shift(c, o, { love: 8, trust: 10, respect: 3 }); if (d) { d.st = 'ben'; d.since = TT.world.months; }
            dao(c, 1);
            return G(o.name + t.ok + 'và hiểu rằng người bên cạnh sẽ không bỏ mình lại. Hai người vượt qua được, gắn bó hơn trước.');
          }
        },
        {
          key: 'rieng', label: (c, ctx) => THU[ctx.v || 'nan'].bad, kind: 'safe', ai: 0.5, run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            const d = TT.bond.shift(c, o, { love: -6, trust: -8 }); if (d) { d.st = 'ben'; d.since = TT.world.months; }
            return 'Mọi chuyện rồi cũng qua, nhưng ' + o.name + ' nhớ rất lâu cái cách bạn chọn lúc ấy.';
          }
        }
      ]
    }
  );
  D.EVENTS.forEach(e => { D.eventById[e.id] = e; });
})();
