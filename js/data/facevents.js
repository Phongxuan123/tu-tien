// Sự kiện thế lực kéo người chơi vào cuộc: lệnh triệu tập khi tông môn có chiến tranh, và chiến loạn ở vùng bạn đang ở.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};
  const rng = TT.rng;
  const X = k => function () { return TT.ev[k].apply(null, arguments); };
  const xp = X('xp'), hp = X('hp'), NR = X('NR'), lp = X('lp'), dao = X('dao'), G = X('good'), B = X('bad'), item = X('item');
  const P = p => rng.P(p), RI = (a, b) => rng.RI(a, b);
  const warOf = ctx => (ctx && ctx.warId ? TT.fac.S().wars.find(w => w.id === ctx.warId) : null);
  const sideOf = (c, war) => (war && c.sect ? (c.sect.id === war.a || war.sa.indexOf(c.sect.id) >= 0 ? 'a' : 'b') : null);

  D.EVENTS.push(
    {
      id: 'fac_trieu_tap', tier: 2, manual: true, cool: 0, title: 'Lệnh triệu tập của tông môn',
      text: (c, ctx) => {
        const war = warOf(ctx), s = c.sect && D.SECTS[c.sect.id];
        if (!war || !s) return 'Tông môn truyền lệnh triệu tập đệ tử ra tiền tuyến.';
        const a = TT.fac.get(war.a), b = TT.fac.get(war.b), me = sideOf(c, war) === 'a' ? a : b, foe = me === a ? b : a;
        const lead = (war.score >= 0 ? a : b) === me ? 'đang giữ thế thượng phong' : 'đang thất thế';
        return s.n + ' đang giao tranh với ' + foe.n + ' (vì ' + war.reason + '), ' + lead + '. Trưởng lão ban lệnh triệu tập các đệ tử có thể chiến đấu ra tiền tuyến ở ' + TT.map.region(war.front).n +
          '. Ra trận có công lớn nhưng cũng nhiều rủi ro; ở hậu phương thì an toàn mà công ít; bỏ trốn thì mang tiếng phản môn.';
      },
      choices: [
        {
          key: 'ra', label: 'Ra trận cùng tông môn', kind: 'fight', ai: (c) => (c.hp > TT.stats.hpMax(c) * 0.7 ? 1.2 : 0.4), run: (c, ctx) => {
            const war = warOf(ctx), side = sideOf(c, war);
            const mon = TT.combat.makeMonster({ n: 'Chiến tướng phe địch', elem: rng.pick(['Kim', 'Hỏa', 'Thủy', 'Mộc', 'Thổ']), f: 1 }, Math.min(5, c.realm + (P(0.3) ? 1 : 0)), 1.12);
            const res = TT.combat.run(c, mon, { lethal: false, tacticA: 'cong', important: true });
            const push = side === 'a' ? 1 : -1;
            if (res.win) {
              const gain = Math.round(40 * (1 + c.realm * 0.5)); if (c.sect) { c.sect.contrib += gain; c.sect.total += gain; }
              TT.rep.add(c, 'danh', 4); TT.ls.gain(c, 2 * (1 + c.realm)); if (war) war.score += 4 * push;
              return G('Bạn chém hạ chiến tướng phe địch sau ' + res.rounds + ' hiệp, sinh lực -' + res.dmgA + '. Công trận được ghi nhận: cống hiến +' + gain + ', danh vọng tăng, thưởng linh thạch.');
            }
            if (c.sect) c.sect.contrib = Math.max(0, c.sect.contrib - 20);
            if (war) war.score -= 2 * push;
            const price = TT.loss.defeat(c, { sev: 2, xp: 0.1, items: 1 });
            return B('Bạn thua một trận ở tiền tuyến sau ' + res.rounds + ' hiệp, sinh lực -' + res.dmgA + ' và phải rút về. Mất mặt, mất cống hiến.' + price);
          }
        },
        {
          key: 'hau', label: 'Xin ở lại hậu phương lo lương thảo', kind: 'safe', ai: (c) => (c.hp < TT.stats.hpMax(c) * 0.6 ? 2 : 0.7), run: (c, ctx) => {
            const gain = Math.round(10 * (1 + c.realm * 0.4)); if (c.sect) { c.sect.contrib += gain; c.sect.total += gain; }
            return 'Bạn ở lại hậu phương lo lương thảo và dược liệu. Cống hiến +' + gain + ', không lập được công lớn.';
          }
        },
        {
          key: 'tron', label: 'Bỏ trốn khỏi tông môn', kind: 'flee', ai: 0.1, run: (c, ctx) => {
            const id = c.sect && c.sect.id; if (!id) return 'Bạn chẳng còn thuộc tông môn nào để mà trốn.';
            TT.sect.leave(c, 'đào ngũ khi tông môn lâm chiến'); c.flags.expelled = c.flags.expelled || {}; c.flags.expelled[id] = true;
            TT.rep.add(c, 'chinh', -5); TT.rep.add(c, 'danh', -5); dao(c, -2);
            return B('Bạn lẳng lặng rời tông môn trong đêm. Từ nay bị coi là kẻ đào ngũ: tiếng xấu, và không còn được nhận lại.');
          }
        }
      ]
    },
    {
      id: 'fac_chien_loan', tier: 2, manual: true, cool: 0, title: 'Chiến loạn lan tới',
      text: (c) => {
        const w = TT.fac.S().wars.find(x => x.front === c.region);
        return 'Chiến sự' + (w ? ' giữa ' + TT.fac.get(w.a).n + ' và ' + TT.fac.get(w.b).n : '') + ' lan tới ' + TT.map.region(c.region).n + '. Đường sá bất an, giá cả leo thang, binh lính và tu sĩ lai vãng khắp nơi. Có người tìm cách kiếm lợi, có người lo chạy loạn.';
      },
      choices: [
        {
          key: 'ho_tong', label: 'Nhận việc hộ tống đoàn thương nhân qua vùng loạn', kind: 'risk', run: c => {
            if (P(lp(c, 0.6))) { const g = 2.5 * (1 + c.realm); TT.ls.gain(c, g); return G('Chuyến hộ tống êm xuôi nhưng đầy hồi hộp. Bạn nhận ' + TT.ls.fmt(g * D.LS.RATE) + ' tiền công, giá cao vì ai cũng sợ.'); }
            hp(c, -25); const price = TT.loss.defeat(c, { sev: 1, items: 1 });
            return B('Đoàn bị cướp giữa đường. Bạn liều mạng bảo vệ nhưng sinh lực -25 và mất công không.' + price);
          }
        },
        {
          key: 'chien_truong', label: 'Lượm lặt bảo vật nơi chiến trường vừa tan', kind: 'risk', run: c => {
            if (P(lp(c, 0.45))) { const g = 4 * (1 + c.realm); TT.ls.gain(c, g); const it = P(0.4) ? item(c, 'hoi_xuan_dan') : null; xp(c, NR(c) * 0.02); return G('Giữa xác người và binh khí gãy, bạn nhặt được ít linh thạch (' + TT.ls.fmt(g * D.LS.RATE) + ')' + (it ? ' và một ' + it : '') + '.'); }
            hp(c, -30); const price = TT.loss.defeat(c, { sev: P(0.5) ? 2 : 1, items: 1 });
            return B('Một toán lính còn sót lại phát hiện và đuổi giết bạn. Sinh lực -30.' + price);
          }
        },
        {
          key: 'lanh', label: 'Lánh vào làng xa chờ yên', kind: 'safe', ai: 0.6, run: c => { dao(c, 1); return 'Bạn lánh vào một ngôi làng hẻo lánh cho tới khi chiến sự lắng xuống. Tâm tĩnh hơn, nhưng lỡ mất nhiều cơ hội.'; }
        }
      ]
    }
  );
  ['fac_trieu_tap', 'fac_chien_loan'].forEach(id => { D.eventById[id] = D.EVENTS.find(e => e.id === id); });
})();
