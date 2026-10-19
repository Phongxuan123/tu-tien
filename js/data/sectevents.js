// Sự kiện về tông môn: lời mời gia nhập, mùa tuyển đệ tử (cơ hội có hạn), nhiệm vụ, đại hội so tài, việc của chưởng môn, kế vị.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};
  const rng = TT.rng, R = D.SECT_RULES;
  const X = k => function () { return TT.ev[k].apply(null, arguments); };
  const xp = X('xp'), gold = X('gold'), hp = X('hp'), NR = X('NR'), lp = X('lp'), fight = X('fight'), dao = X('dao'), G = X('good'), B = X('bad'), other = X('other');
  const P = p => rng.P(p);

  function reqText(c, id, bonus) {
    const d = D.SECTS[id], j = TT.sect.canJoin(c, id, bonus);
    return j.ok ? 'Tư chất của bạn đủ điều kiện được nhận.' : 'Điều kiện còn thiếu: ' + j.why.join('; ') + '.';
  }

  // Thử gia nhập (có thể có ưu đãi bonus của mùa tuyển). Trả về kết quả hiển thị.
  function tryJoin(c, id, bonus) {
    c.flags.joinAskAt = TT.world.months;
    const j = TT.sect.canJoin(c, id, bonus);
    if (!j.ok) return B('Người đo tư chất lắc đầu: ' + j.why.join('; ') + '. Bạn đành quay về.');
    TT.sect.join(c, id, bonus);
    return G('Bạn bái nhập ' + D.SECTS[id].n + ' làm ngoại môn đệ tử.');
  }

  D.EVENTS.push(
    {
      id: 'tong_mon_gap', tier: 3, w: 4, cool: 12, title: 'Cổng tông môn', places: ['tong_mon'],
      when: c => !c.sect && !!D.SECTS[c.place] && !(c.flags.expelled && c.flags.expelled[c.place]) && TT.world.months - (c.flags.joinAskAt || -9999) >= R.joinCooldown,
      text: c => 'Bạn đứng trước cổng ' + D.SECTS[c.place].n + ' (' + D.SECT_ALIGN[D.SECTS[c.place].align] + '). ' + D.SECTS[c.place].desc +
        ' Một vị đệ tử tuần tra hỏi: "Ngươi có muốn thử đo tư chất, bái nhập môn hạ không?"\n' + reqText(c, c.place),
      choices: [
        { key: 'thi', label: 'Thử bái nhập', kind: 'help', ai: 1.8, run: c => tryJoin(c, c.place) },
        { key: 'bo', label: 'Chưa muốn ràng buộc', kind: 'safe', run: c => { c.flags.joinAskAt = TT.world.months; return 'Bạn lắc đầu, đi tiếp. Con đường tu hành một mình còn dài.'; } }
      ]
    },
    {
      id: 'opp_tuyen', tier: 3, manual: true, cool: 0, title: 'Mùa tuyển đệ tử',
      text: (c, ctx) => 'Như tin đồn, ' + ctx.sectName + ' mở kỳ tuyển đệ tử. Hàng trăm người xếp hàng chờ đo tư chất. Kỳ này tiêu chuẩn nới lỏng đôi chút.\n' + reqText(c, ctx.sectId, 5),
      choices: [
        { key: 'thi', label: 'Xếp hàng dự tuyển', kind: 'help', ai: 1.8, disabled: c => (c.sect ? 'Đã có tông môn' : false), run: (c, ctx) => tryJoin(c, ctx.sectId, 5) },
        { key: 'bo', label: 'Không dự', kind: 'safe', run: c => 'Bạn đứng xem đám đông một lúc rồi đi.' }
      ]
    },
    {
      // đã có bảng việc tông nên sự kiện ngẫu nhiên này thưa đi để khỏi hỏi thừa
      id: 'sect_nhiem_vu', tier: 2, w: 0.8, cool: 48, title: 'Nhiệm vụ khó của tông môn', when: c => !!c.sect,
      text: c => 'Trưởng lão của ' + D.SECTS[c.sect.id].n + ' gọi bạn lại: "Có một việc khó, ai làm được sẽ ghi công lớn. Nhưng không dễ đâu."',
      choices: [
        {
          key: 'nhan', label: 'Nhận nhiệm vụ', kind: 'risk', run: c => {
            const gain = 40 + 20 * c.sect.rank;
            if (P(lp(c, 0.5) + c.realm * 0.04)) { c.sect.contrib += gain; c.sect.total += gain; gold(c, 30); TT.rep.add(c, 'danh', 2); return G('Bạn hoàn thành nhiệm vụ xuất sắc. Cống hiến +' + gain + ', thưởng 30 vàng.'); }
            hp(c, -35); c.sect.contrib = Math.max(0, c.sect.contrib - 10); return B('Nhiệm vụ thất bại. Sinh lực -35, cống hiến -10.');
          }
        },
        { key: 'tu', label: 'Xin từ chối', kind: 'safe', run: c => { c.sect.contrib = Math.max(0, c.sect.contrib - 5); return 'Trưởng lão cau mày nhưng không ép. Cống hiến -5.'; } }
      ]
    },
    {
      // Đại bỉ năm năm một lần, do TT.sect.worldYearly kích hoạt (không bốc ngẫu nhiên).
      id: 'sect_dai_bi', tier: 2, manual: true, cool: 0, title: 'Đại bỉ tông môn',
      text: (c, ctx) => 'Đại bỉ năm năm một lần của ' + D.SECTS[ctx.sectId].n + ' bắt đầu. Đệ tử ' + D.SECT_BI.groups[ctx.gi] + ' lên đài xếp hạng; hạng cao được thưởng cống hiến và nổi danh trong môn, người thua thường bị thương nhẹ.',
      choices: [
        {
          key: 'du', label: 'Lên đài tranh hạng', kind: 'fight', ai: 1.2, disabled: c => (c.sect ? false : 'Bạn không còn ở tông môn'), run: (c, ctx) => {
            const r = TT.sect.daiBiPlayer(c, ctx);
            if (r.place <= 3) return G('Bạn đứng hạng ' + r.place + '/' + r.of + ' đại bỉ ' + D.SECT_BI.groups[ctx.gi] + '. Cống hiến +' + r.amt + ', danh vọng tăng.');
            return B('Bạn chỉ đứng hạng ' + r.place + '/' + r.of + ' đại bỉ. Cống hiến +' + r.amt + ', sinh lực hao, nhưng học được nhiều.');
          }
        },
        { key: 'xem', label: 'Ngồi xem', kind: 'safe', run: c => { xp(c, NR(c) * 0.01); return 'Bạn ngồi xem các sư huynh đấu, học lỏm được vài chiêu.'; } }
      ]
    },
    {
      id: 'sect_chuong_mon_viec', tier: 2, w: 3, cool: 12, title: 'Việc của chưởng môn', when: c => !!c.sect && c.sect.rank === 4,
      text: c => 'Là chưởng môn ' + D.SECTS[c.sect.id].n + ', bạn phải quyết định hướng đi của tông môn năm nay.',
      choices: [
        { key: 'chieu', label: 'Chiêu mộ đệ tử, mở rộng môn hộ (50 vàng)', kind: 'help', disabled: c => (TT.ls.wealth(c) < 50 ? 'Không đủ vàng' : false), run: c => { gold(c, -50); TT.rep.add(c, 'danh', 4); dao(c, 1); const x = TT.fac.get(c.sect.id); if (x) x.power = Math.min(100, x.power + 2); return G('Tông môn đón thêm nhiều đệ tử mới, thế lực tăng. Danh vọng của bạn tăng.'); } },
        { key: 'bec', label: 'Bế quan tu luyện, giao việc cho trưởng lão', kind: 'safe', run: c => { xp(c, NR(c) * 0.04); return G('Bạn giao việc cho các trưởng lão rồi bế quan. Tu vi tăng.'); } },
        { key: 'thu', label: 'Thu thuế các thôn trấn lân cận', kind: 'risk', run: c => { gold(c, 80 * (1 + c.realm)); TT.rep.add(c, 'chinh', -3); const x = TT.fac.get(c.sect.id); if (x) x.wealth = Math.min(100, x.wealth + 6); return G('Kho tông môn đầy lên, bạn được chia ' + 80 * (1 + c.realm) + ' vàng, nhưng tiếng thơm giảm.'); } }
      ]
    },
    {
      id: 'sect_succession', tier: 3, manual: true, cool: 0, title: 'Tranh ngôi chưởng môn',
      text: (c, ctx) => { const o = other(ctx); return 'Chưởng môn ' + D.SECTS[ctx.sectId].n + ' đã qua đời. Các trưởng lão tranh nhau ngôi vị. Đối thủ lớn nhất của bạn là ' + o.name + ' (' + D.REALM_NAMES[o.realm] + ').'; },
      choices: [
        {
          key: 'tranh', label: 'Tranh ngôi chưởng môn', kind: 'fight', run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive || !c.sect) return 'Cục diện đã thay đổi, chẳng còn gì để tranh.';
            const r = TT.combat.quick(c, o, { lethal: false });
            if (r.win) { TT.sect.makeHead(c); return G('Bạn đánh bại ' + o.name + ' trước toàn thể tông môn.'); }
            TT.sect.makeHead(o); TT.rel.add(c, o, -8);
            return B('Bạn thua ' + o.name + ' sau ' + r.rounds + ' hiệp. Ông ta lên làm chưởng môn.');
          }
        },
        {
          key: 'nhuong', label: 'Ủng hộ ' + 'đối thủ, giữ hòa khí', kind: 'safe', run: (c, ctx) => {
            const o = other(ctx); if (!o || !o.alive) return 'Chẳng còn ai để ủng hộ.';
            TT.sect.makeHead(o); TT.rel.add(c, o, 15); c.sect.contrib += 100; c.sect.total += 100;
            return G('Bạn ủng hộ ' + o.name + ' lên ngôi chưởng môn. Ông ta nhớ ơn bạn, cống hiến +100.');
          }
        }
      ]
    }
  );
  D.EVENTS.forEach(e => { D.eventById[e.id] = e; });
})();
