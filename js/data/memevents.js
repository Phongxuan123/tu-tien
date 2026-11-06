// Ba sự kiện của kết nghĩa (Z "9K"): Huynh đệ gặp nạn, Lợi và nghĩa, Tái ngộ. Đều manual: TT.bond.memYearly / memTick kích hoạt khi D.BOND.mem.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};
  const rng = TT.rng;
  const X = k => function () { return TT.ev[k].apply(null, arguments); };
  const gold = X('gold'), hp = X('hp'), dao = X('dao'), G = X('good'), B = X('bad'), other = X('other');
  const P = p => rng.P(p), RI = (a, b) => rng.RI(a, b);
  const GONE = 'Người kia đã không còn ở đây nữa.';
  const poor = n => c => (TT.ls.wealth(c) < n ? 'Không đủ vàng' : false);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const place = c => { const p = c.place && TT.map.place(c.place); return p ? p.n : 'nơi này'; };

  const NAN = {
    benh: o => o.name + ', huynh đệ kết nghĩa của bạn, gửi tin báo: bệnh nặng, e khó qua khỏi mùa này.',
    vay: o => 'Một mảnh giấy nhàu nát tới tay bạn, chữ của ' + o.name + ': "Bị vây ở nơi xa. Cứu."',
    no: o => o.name + ' mắc nợ lớn, chủ nợ ép đến cùng đường, nhắn bạn một câu: "Đệ không biết nhờ ai nữa."'
  };

  D.EVENTS.push(
    {
      id: 'bond_nan', tier: 3, manual: true, cool: 0, title: 'Huynh đệ gặp nạn',
      text: (c, ctx) => { const o = other(ctx); return NAN[ctx.v || 'benh'](o) + '\nĐi là bỏ dở việc đang làm, còn không đi thì không biết hắn có chờ được đến khi người khác tới.'; },
      choices: [
        {
          key: 'di', label: 'Bỏ hết, đi cứu ngay', kind: 'help', ai: 1.4, run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            hp(c, -15);
            const p = clamp(0.55 + (c.realm - o.realm) * 0.1 + TT.stats.luck(c) * 0.005, 0.3, 0.9);
            if (P(p)) {
              TT.bond.shift(c, o, { trust: 8, respect: 6, debt: 20 }); dao(c, 1);
              TT.bond.remember(c, o, 'cuu', 'Băng qua ngàn dặm cứu huynh đệ ' + o.name, 3);
              return G('Bạn tới kịp. ' + o.name + ' nắm tay bạn rất lâu, không nói được câu nào. Từ nay hắn nợ bạn một mạng.');
            }
            o.hp = Math.max(1, o.hp * 0.4);
            TT.bond.remember(c, o, 'cuu', 'Liều thân tới cứu huynh đệ ' + o.name + ', không trọn vẹn', 2);
            if (P(0.35)) { TT.life.die(o, 'qua đời trong vòng tay huynh đệ ' + c.name); return B('Bạn tới nơi thì đã muộn một bước. ' + o.name + ' trút hơi thở cuối trong vòng tay bạn.'); }
            return B('Bạn tới nơi thì cả hai đều thương tích đầy mình, nhưng cả hai còn sống.');
          }
        },
        {
          key: 'gui', label: 'Gửi tiền và thư, nhờ người ở gần giúp (50 vàng)', kind: 'pay', ai: 0.8, disabled: poor(50), run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            gold(c, -50); gold(o, 50);
            TT.bond.shift(c, o, { trust: 2 });
            if (P(0.55)) { TT.bond.remember(c, o, 'nho', 'Gửi tiền giúp huynh đệ ' + o.name + ' qua cơn khốn đốn', 1); return G('Tiền và thư tới nơi. ' + o.name + ' vượt qua, nhắn lại: "Đệ biết huynh không tới được."'); }
            TT.bond.shift(c, o, { trust: -3 });
            return B('Thư đi mà không có hồi âm. Bạn chỉ biết cầu mong.');
          }
        },
        {
          key: 'bo', label: 'Không đi, việc của mình quan trọng hơn', kind: 'safe', ai: 0.2, run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            TT.bond.shift(c, o, { trust: -10, respect: -10 });
            const d = TT.bond.get(c, o); if (d) d.late = { m: TT.world.months + RI(18, 36) };
            if (P(0.35)) { TT.life.die(o, 'bỏ mình trong cơn hoạn nạn không ai tới cứu'); return B('Bạn tiếp tục việc của mình. Rất lâu sau, tin ' + o.name + ' không qua khỏi mới tới.'); }
            return 'Bạn gửi một lời hỏi thăm qua loa rồi quay lại việc của mình. Không biết ' + o.name + ' có thấy bạn chu đáo hay không.';
          }
        }
      ]
    },
    {
      id: 'bond_loi_nghia', tier: 3, manual: true, cool: 0, title: 'Lợi và nghĩa',
      text: (c, ctx) => {
        const o = other(ctx), amt = 150 * (1 + c.realm);
        return 'Một thế lực ở ' + place(c) + ' gửi người tìm bạn, nói nhỏ: ' + amt + ' vàng, chỉ cần bạn cho biết nơi ' + o.name + ' ẩn mình. Món lợi nằm trên bàn, lời thề kết nghĩa nằm trong lòng.';
      },
      choices: [
        {
          key: 'loi', label: c => 'Nhận lợi, bán tin về huynh đệ (' + 150 * (1 + c.realm) + ' vàng)', kind: 'risk', ai: 0,
          disabled: c => (TT.nature.get(c, 'daoduc') >= 6 ? 'Quá trái bản tính: bạn không thể làm vậy.' : false), run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            gold(c, 150 * (1 + c.realm)); TT.rep.add(c, 'chinh', -6); dao(c, -4);
            TT.bond.shift(c, o, { trust: -100, respect: -50, debt: -60 }); TT.bond.setType(c, o, 'ban');
            if (P(0.5)) TT.social.makeEnemy(o, c, 'bị huynh đệ bán đứng');
            return B('Bạn nhận vàng. Từ đó, mỗi lần nghĩ đến chén rượu thề, trong ngực bạn lại nghe một tiếng nứt rất khẽ.');
          }
        },
        {
          key: 'nghia', label: 'Từ chối, giữ lời thề', kind: 'help', ai: 1.2, run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            dao(c, 2); TT.rep.add(c, 'chinh', 3); TT.bond.shift(c, o, { trust: 8, respect: 8 });
            TT.bond.remember(c, o, 'nghia', 'Từ chối món lợi lớn để giữ lời thề với ' + o.name, 2);
            return G('Bạn đẩy túi vàng trở lại. Người kia nhún vai bỏ đi. Bạn không nói gì với ' + o.name + ', nhưng lời thề giờ nặng thêm một phần.');
          }
        },
        {
          key: 'muu', label: 'Giả vờ nhận lời để dò đối phương', kind: 'risk', ai: 0.4, run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            const d = TT.bond.get(c, o), p = clamp(0.35 + (d ? d.trust : 0) / 200 + TT.stats.luck(c) * 0.004, 0.2, 0.8);
            if (P(p)) {
              gold(c, Math.round(50 * (1 + c.realm))); TT.rep.add(c, 'danh', 3); TT.bond.shift(c, o, { trust: 5 });
              TT.bond.remember(c, o, 'nghia', 'Lật mưu kẻ muốn hại huynh đệ ' + o.name, 2);
              return G('Bạn khéo léo dò ra kẻ đứng sau và bẻ gãy mưu đồ trước khi chúng kịp ra tay. ' + o.name + ' nghe chuyện, im lặng rồi rót đầy chén cho bạn.');
            }
            hp(c, -20); TT.bond.shift(c, o, { trust: -6 });
            return B('Mưu bị lật ngược, bạn bị thương mà ' + o.name + ' lại nghe tin rằng bạn đã nhận vàng. Hắn chưa tin, nhưng cũng chưa hết nghi.');
          }
        }
      ]
    },
    {
      id: 'bond_tai_ngo', tier: 2, manual: true, cool: 0, title: 'Tái ngộ',
      text: (c, ctx) => {
        const o = other(ctx), rc = TT.bond.recall(c, o, 1);
        return 'Sau ' + (ctx.yrs || 10) + ' năm xa cách, ' + o.name + ' đứng trước cửa bạn ở ' + place(c) + ', mái tóc đã khác xưa.' + (rc ? ' Bạn nhớ lại ' + rc + '.' : '');
      },
      choices: [
        {
          key: 'ruou', label: 'Mở tiệc rượu, thức trắng đêm ôn chuyện cũ (20 vàng)', kind: 'help', ai: 1.2, disabled: poor(20), run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            gold(c, -20); dao(c, 1); TT.bond.shift(c, o, { trust: 6, respect: 3 });
            TT.bond.remember(c, o, 'tai_ngo', 'Gặp lại sau ' + (ctx.yrs || 10) + ' năm, uống say như thuở nào', 1);
            return G('Hai người kể nhau nghe mười năm đã qua. Bình minh lên, cả hai đều thấy nhẹ lòng.');
          }
        },
        {
          key: 'giup', label: 'Hỏi han hoàn cảnh, tặng một món quà (50 vàng)', kind: 'pay', ai: 0.8, disabled: poor(50), run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return GONE;
            gold(c, -50); gold(o, 50); TT.bond.shift(c, o, { trust: 4, debt: 15 });
            TT.bond.remember(c, o, 'tai_ngo', 'Gặp lại sau ' + (ctx.yrs || 10) + ' năm, giúp bạn cũ một tay', 1);
            return G('Bạn nhận ra ' + o.name + ' đã khổ nhiều năm qua. Món quà nhỏ nhưng đủ để hắn đứng thẳng lưng.');
          }
        },
        {
          key: 'lanh', label: 'Chào hỏi qua loa', kind: 'safe', ai: 0.2, run: (c, ctx) => {
            const o = other(ctx); if (!o) return GONE;
            TT.bond.shift(c, o, { trust: -5, respect: -3 });
            return 'Bạn và ' + o.name + ' nói vài câu xã giao. Cả hai đều biết có điều gì đó đã khác đi.';
          }
        }
      ]
    }
  );
  D.EVENTS.forEach(e => { D.eventById[e.id] = e; });
})();
