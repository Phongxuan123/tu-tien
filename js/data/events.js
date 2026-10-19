// Sự kiện ngẫu nhiên. Mỗi sự kiện:
//   id, title, tier (1 tự động ghi nhật ký / 2 hộp chọn có đếm ngược / 3 dừng hẳn), w (trọng số, số hoặc hàm),
//   when(c) điều kiện, places[] (loại địa điểm), regions[] (vùng), npc (hệ số cho NPC, 0 = chỉ người chơi),
//   cool (số tháng chờ trước khi lặp lại), once, text (chuỗi hoặc hàm), choices[].
// Mỗi lựa chọn: key, label, kind ('risk' liều, 'safe' an toàn, 'fight' đánh, 'flee' chạy, 'help' giúp, 'pay' tốn tiền),
//   ai (trọng số cho máy chọn mặc định), disabled(c) trả về true hoặc lý do, run(c) trả về chuỗi hoặc {t, cls}.
// Hàm trợ giúp nằm ở TT.ev (js/systems/events.js).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};
  const rng = TT.rng;
  const X = k => function () { return TT.ev[k].apply(null, arguments); };
  const xp = X('xp'), gold = X('gold'), hp = X('hp'), NR = X('NR'), lp = X('lp'), fight = X('fight'), kyNgo = X('kyNgo'),
    addTuChat = X('addTuChat'), dao = X('dao'), G = X('good'), B = X('bad'), frac = X('frac'), ngo = X('ngo'), item = X('item'), book = X('book');
  const P = p => rng.P(p), RI = (a, b) => rng.RI(a, b);

  D.EVENTS = [
    // ---------------- đổi đời (tầng 3) ----------------
    {
      id: 'nhan_la', tier: 3, w: 3, cool: 9999, title: 'Chiếc nhẫn kỳ lạ',
      when: c => !c.ring && c.realm <= 2 && !c.flags.nhanBo,
      text: 'Ven đường bạn nhặt được một chiếc nhẫn cũ, hơi ấm lạ thường. Có tiếng thì thầm: "Tiểu tử, ta là đại năng ngàn năm trước..."',
      choices: [
        {
          key: 'deo', label: 'Đeo vào', kind: 'risk', run: c => {
            if (P(lp(c, 0.4))) { c.ring = true; if (c.kind === 'player' && D.NATURE.on) TT.kv.add(c, 2, 'Nhẫn'); else c.baseKv += 15; xp(c, NR(c) * 0.06); return G('Lão gia gia là thật! Ông truyền cho bạn công pháp. Từ nay tu luyện nhanh hơn rõ rệt.'); }
            gold(c, -20); return B('Chiếc nhẫn là đồ giả của gã lừa đảo. Bạn mất 20 vàng.');
          }
        },
        { key: 'vut', label: 'Vứt đi', kind: 'safe', run: c => { c.flags.nhanBo = true; return 'Bạn vứt nhẫn đi. Cẩn tắc vô áy náy.'; } }
      ]
    },
    // ---------------- tầng 2 ----------------
    {
      id: 'lao_gia_gia', tier: 2, w: 3, cool: 60, title: 'Lão gia gia lên lớp', when: c => c.ring,
      text: 'Giọng nói trong nhẫn vang lên: "Tiểu tử, hôm nay ta kể cho ngươi nghe chuyện hồi ta còn là thiên hạ đệ nhất..."',
      choices: [
        { key: 'nghe', label: 'Chăm chú nghe', kind: 'safe', run: c => { xp(c, NR(c) * 0.04 * (0.7 + ngo(c) * 0.6)); return G('Bạn học được vài điều quý giá giữa mười điều khoác lác.'); } },
        { key: 'ngu', label: 'Giả vờ ngủ gật', kind: 'risk', ai: 0.4, run: c => 'Lão gia gia thở dài một tiếng rồi im lặng cả tháng.' }
      ]
    },
    {
      id: 'tu_hon', tier: 2, w: 2, cool: 600, title: 'Từ hôn', when: c => c.realm <= 1 && TT.age(c) < 50,
      text: 'Thiếu chủ một gia tộc lớn đến tận nơi, ném xuống tờ giấy từ hôn. Hình như bạn chưa từng đính hôn với ai, nhưng họ cứ khăng khăng.',
      choices: [
        { key: 'ngao', label: '"Ba mươi năm Hà Đông, ba mươi năm Hà Tây!"', kind: 'risk', run: c => { xp(c, NR(c) * 0.04); dao(c, 1); return G('Cả sảnh cười ồ lên, nhưng uất khí hóa thành động lực. Tu vi tăng.'); } },
        { key: 'ky', label: 'Ký giấy rồi đi', kind: 'safe', run: c => { gold(c, 10); return 'Bạn nhận 10 vàng đền bù và rời đi, nhẹ nhõm bất ngờ.'; } }
      ]
    },
    {
      id: 'thieu_chu', tier: 2, w: 2, cool: 36, title: 'Thiếu chủ ngạo mạn', when: c => c.realm >= 1,
      setup: c => { const o = TT.social.npcHere(c, c.realm, c.realm + 1); return o ? { otherId: o.id } : null; },
      text: (c, ctx) => { const o = TT.ev.other(ctx); return o.name + ' (' + D.REALM_NAMES[o.realm] + '), một thiếu chủ nổi tiếng ngạo mạn, chặn đường bạn: "Phế vật như ngươi cũng xứng ở đây sao?"'; },
      choices: [
        {
          key: 'danh', label: 'Đánh trả', kind: 'fight', run: (c, ctx) => {
            const o = TT.ev.other(ctx), r = TT.combat.quick(c, o, { lethal: false });
            if (r.win) {
              gold(c, 25); c.baseLuck++; TT.rel.add(c, o, -10); TT.rep.add(c, 'danh', 2);
              if (rng.P(0.35)) TT.social.makeEnemy(o, c, 'bị bạn đánh bại trước mặt người khác');
              return G('Bạn đánh ' + o.name + ' bầm dập sau ' + r.rounds + ' hiệp. Thu được 25 vàng, vận may tăng.');
            }
            TT.rel.add(c, o, -5); return B(o.name + ' mạnh hơn dự đoán. Sinh lực -' + r.dmgA + '.');
          }
        },
        { key: 'nhin', label: 'Nhẫn nhịn', kind: 'flee', run: (c, ctx) => { const o = TT.ev.other(ctx); dao(c, 1); TT.rel.add(c, o, -3); return 'Bạn cúi đầu bỏ đi. ' + o.name + ' cười hả hê. Bạn ghi nhớ trong lòng.'; } }
      ]
    },
    {
      id: 'bi_canh_mo', tier: 2, w: 0.6, cool: 60, title: 'Bí cảnh mở ra', when: c => c.realm >= 1,
      text: 'Một bí cảnh cổ xưa xuất hiện gần đây. Nhiều người lao vào, không ít người không ra.',
      choices: [
        {
          key: 'vao', label: 'Tiến vào', kind: 'risk', run: c => {
            const r = rng.next() - S_luck(c) * 0.005;
            if (r < 0.4) { xp(c, NR(c) * 0.06); gold(c, 30); return G('Bạn tìm được bảo vật! Tu vi tăng mạnh, thêm 30 vàng.'); }
            if (r < 0.7) return 'Bí cảnh trống rỗng, chỉ còn mạng nhện và tiếng gió.';
            hp(c, -50); return B('Bạn bị cấm chế đánh trọng thương. Sinh lực -50.');
          }
        },
        { key: 'bo', label: 'Bỏ qua', kind: 'safe', run: c => 'Bạn không mạo hiểm. Sống lâu mới làm được việc lớn.' }
      ]
    },
    {
      id: 'thuong_nhan_dan', tier: 2, w: 1.2, cool: 60, title: 'Thương nhân bán đan', when: c => TT.ls.wealth(c) >= 30,
      text: 'Một thương nhân bí ẩn mời bạn mua "đan dược tuyệt thế", giá chỉ 30 vàng.',
      choices: [
        {
          key: 'mua', label: 'Mua (30 vàng)', kind: 'risk', run: c => {
            gold(c, -30);
            if (P(lp(c, 0.65))) { xp(c, NR(c) * 0.05); return G('Đan dược thật! Tu vi tăng lên.'); }
            hp(c, -20); return B('Đan dược giả, bạn đau bụng. Sinh lực -20.');
          }
        },
        { key: 'tu', label: 'Từ chối', kind: 'safe', run: c => 'Bạn bỏ đi. Nghe nói người sau mua được hàng thật.' }
      ]
    },
    {
      id: 'yeu_thu', tier: 2, w: 2, cool: 24, npc: 0.5, title: 'Yêu thú tấn công', when: c => c.realm >= 1,
      text: 'Một con yêu thú lao ra từ bụi rậm, mắt đỏ rực.',
      choices: [
        {
          key: 'chien', label: 'Chiến đấu', kind: 'fight', run: c => {
            if (fight(c, 6 + c.realm * 12)) {
              xp(c, NR(c) * 0.015);
              if (c.kind === 'player' && P(0.5)) { item(c, 'yeu_dan'); return G('Bạn hạ được nó và mổ lấy một viên Yêu đan, đem bán được giá.'); }
              gold(c, 20); return G('Bạn hạ được nó, thu yêu đan bán được 20 vàng.');
            }
            hp(c, -45); return B('Bạn bị thương nặng. Sinh lực -45.');
          }
        },
        { key: 'chay', label: 'Bỏ chạy', kind: 'flee', run: c => { hp(c, -10); return B('Bạn chạy thoát nhưng bị cào rách vai. Sinh lực -10.'); } }
      ]
    },
    {
      id: 'benh_tat', tier: 2, w: c => (c.traitIds.indexOf('da_benh') >= 0 ? 5 : 2), cool: 36, npc: 0.5, title: 'Bệnh tật', when: c => c.realm === 0,
      text: 'Bạn đổ bệnh nặng. Thân phàm nhân mong manh hơn bạn nghĩ.',
      choices: [
        { key: 'chua', label: 'Chữa trị (20 vàng)', kind: 'pay', run: c => { if (TT.ls.wealth(c) >= 20) { gold(c, -20); return G('Thầy thuốc chữa khỏi cho bạn.'); } hp(c, -40); return B('Bạn không đủ tiền. Sinh lực -40.'); } },
        { key: 'chiu', label: 'Chịu đựng', kind: 'safe', ai: 0.6, run: c => { hp(c, -30); dao(c, 1); return B('Bạn nghiến răng chịu đựng. Sinh lực -30.'); } }
      ]
    },
    {
      id: 'cao_nhan', tier: 2, w: 1.5, cool: 60, npc: 0.3, title: 'Cao nhân chỉ điểm',
      text: 'Một lão nhân áo vải ngồi bên đường gọi bạn lại: "Tiểu hữu, ta thấy ngươi có duyên."',
      choices: [
        {
          key: 'nghe', label: 'Lắng nghe', kind: 'help', run: c => {
            xp(c, NR(c) * 0.055 * (0.7 + ngo(c) * 0.6)); c.baseLuck++;
            const k = kyNgo(c, 0.1, ['tu_chat', 'lo', 'kv']);
            return k || G('Lời chỉ điểm khiến bạn sáng ra nhiều điều. Tu vi tăng, vận may tăng.');
          }
        },
        { key: 'nghi', label: 'Nghi ngờ bỏ đi', kind: 'safe', ai: 0.3, run: c => 'Có thể ông ấy là cao nhân thật. Cũng có thể là kẻ bán thuốc dạo.' }
      ]
    },
    {
      id: 'thay_tuong', tier: 2, w: 2, cool: 120, title: 'Thầy tướng xem số', when: c => !c.known.kv || !c.known.luck,
      text: 'Một thầy tướng ngồi dưới gốc cây, nhìn chằm chằm vào trán bạn rồi gọi: "Lại đây, ta xem cho miễn phí."',
      choices: [
        {
          key: 'xem', label: 'Để ông xem', kind: 'help', run: c => {
            c.known.kv = true; c.known.luck = true;
            let r = 'Thầy tướng phán: khí vận của bạn là ' + TT.stats.kv(c) + ', vận may là ' + TT.stats.luck(c) + '.';
            const k = kyNgo(c, 0.1, ['xoa']);
            if (k) return { t: r + ' ' + k.t, cls: 'big' };
            return G(r);
          }
        },
        { key: 'khong', label: 'Không tin', kind: 'safe', ai: 0.3, run: c => 'Bạn lắc đầu bỏ đi. Thầy tướng lẩm bẩm gì đó sau lưng.' }
      ]
    },
    {
      id: 'linh_tuyen', tier: 2, w: 1.5, cool: 60, npc: 0.3, title: 'Linh tuyền ẩn mình', when: c => c.realm >= 1,
      text: 'Bạn phát hiện một dòng suối nhỏ tỏa linh khí mờ ảo giữa rừng sâu.',
      choices: [
        {
          key: 'uong', label: 'Uống thử', kind: 'risk', run: c => {
            const k = kyNgo(c, 0.14, ['tu_chat', 'di']);
            if (k) return k;
            if (P(0.5)) { xp(c, NR(c) * 0.025); return G('Bạn uống một ngụm, linh khí chảy khắp cơ thể. Tu vi tăng.'); }
            hp(c, 10); return 'Chỉ là nước suối thường, nhưng uống vào cũng khoan khoái.';
          }
        },
        { key: 'bo', label: 'Bỏ qua', kind: 'safe', ai: 0.4, run: c => 'Bạn nghi có bẫy nên đi tiếp.' }
      ]
    },
    {
      id: 'co_dong_phu', tier: 2, w: 1, cool: 96, npc: 0.2, title: 'Cổ động phủ', when: c => c.realm >= 1,
      text: 'Sau một trận mưa lớn, vách núi sạt lở, lộ ra cửa vào của động phủ bỏ hoang.',
      choices: [
        {
          key: 'kham', label: 'Khám phá', kind: 'risk', run: c => {
            const k = kyNgo(c, 0.14, ['tot', 'xoa']);
            if (k) return k;
            const r = rng.next();
            if (r < 0.45) {
              xp(c, NR(c) * 0.05); TT.ls.gain(c, 1.5);
              const bk = P(0.3) ? book(c, 1) : null;
              return G('Bạn tìm được ít linh thạch và tâm đắc tu luyện. Tu vi tăng, thêm 1,5 linh thạch.' + (bk ? ' Trong góc phòng còn một cuốn sách cũ: ' + bk + '!' : ''));
            }
            if (r < 0.7) return 'Động phủ trống rỗng, chỉ có xương người.';
            hp(c, -30); return B('Cấm chế còn hiệu lực. Sinh lực -30.');
          }
        },
        { key: 'quay', label: 'Quay đi', kind: 'safe', ai: 0.4, run: c => 'Bạn không chắc nên bỏ đi.' }
      ]
    },
    {
      id: 'dao_quan', tier: 2, w: 1, cool: 120, npc: 0.2, title: 'Đạo quán hoang', when: c => !c.known.kv,
      text: 'Bạn gặp một đạo quán hoang tàn. Bàn thờ còn lư hương nghi ngút.',
      choices: [
        {
          key: 'thap', label: 'Thắp hương cầu nguyện', kind: 'help', run: c => {
            const k = kyNgo(c, 0.15, ['kv']);
            if (k) return k;
            dao(c, 1); return 'Hương cháy hết, không có gì xảy ra. Lòng bạn nhẹ đi đôi chút.';
          }
        },
        { key: 'di', label: 'Đi tiếp', kind: 'safe', ai: 0.5, run: c => 'Bạn bỏ qua đạo quán.' }
      ]
    },
    // ---------------- mới: theo địa điểm ----------------
    {
      id: 'cho_phien', tier: 2, w: 2, cool: 36, title: 'Chợ phiên náo nhiệt', places: ['thanh_tri', 'ben', 'thuong_doan', 'tram'], when: c => TT.ls.wealth(c) >= 15,
      text: 'Chợ phiên đông nghẹt người. Một sạp bày toàn đồ cổ, chủ sạp chào: "Món này năm xưa của đại tu sĩ, chỉ 15 vàng thôi!"',
      choices: [
        {
          key: 'mua', label: 'Mua thử (15 vàng)', kind: 'risk', run: c => {
            gold(c, -15);
            const k = kyNgo(c, 0.06, ['tot', 'lo']);
            if (k) return k;
            if (P(lp(c, 0.45))) { gold(c, 45); return G('Hóa ra là đồ thật, bạn bán lại được 45 vàng.'); }
            return B('Chỉ là đồ nhái. Bạn mất 15 vàng nhưng được bài học.');
          }
        },
        { key: 'xem', label: 'Chỉ xem rồi đi', kind: 'safe', run: c => 'Bạn dạo một vòng, nghe được vài tin đồn thú vị rồi đi.' }
      ]
    },
    {
      id: 'hac_thi_hang', tier: 2, w: 3, cool: 48, title: 'Hàng lạ ở chợ đen', places: ['cho_den'], when: c => TT.ls.wealth(c) >= 40,
      text: 'Một kẻ trùm kín mặt rỉ tai: "Ngọc giản này khắc tâm đắc của một tu sĩ đã chết. Bốn mươi vàng, không trả giá."',
      choices: [
        {
          key: 'mua', label: 'Mua ngọc giản (40 vàng)', kind: 'risk', run: c => {
            gold(c, -40);
            const k = kyNgo(c, 0.08, ['tot', 'tu_chat']);
            if (k) return k;
            if (P(lp(c, 0.4))) {
              xp(c, NR(c) * 0.06);
              const bk = book(c, 1);
              return G('Ngọc giản là thật, bạn ngộ ra nhiều điều. Tu vi tăng.' + (bk ? ' Bên trong còn ghi lại một công pháp: ' + bk + '.' : ''));
            }
            return B('Ngọc giản rỗng, bạn bị lừa mất 40 vàng.');
          }
        },
        { key: 'tu', label: 'Từ chối', kind: 'safe', run: c => 'Kẻ lạ biến mất vào bóng tối nhanh như lúc xuất hiện.' }
      ]
    },
    {
      id: 'luan_dao', tier: 2, w: 1.5, cool: 48, title: 'Luận đạo giữa đường', when: c => c.realm >= 1,
      setup: c => { const o = TT.social.npcHere(c, 1, c.realm + 1); return o ? { otherId: o.id } : null; },
      text: (c, ctx) => { const o = TT.ev.other(ctx); return o.name + ' (' + D.REALM_NAMES[o.realm] + ') chắp tay: "Tại hạ muốn cùng đạo hữu luận đạo một phen, thắng thua không thù oán."'; },
      choices: [
        {
          key: 'nhan', label: 'Nhận lời luận đạo', kind: 'risk', run: (c, ctx) => {
            const o = TT.ev.other(ctx);
            const nl = TT.stats.nl(c), p = nl / (nl + 14 + c.realm * 6) + dao_edge(c);
            if (P(rng.clamp(p, 0.15, 0.9))) { xp(c, NR(c) * 0.035); dao(c, 2); c.daoDiem += 1; TT.rel.add(c, o, 8); return G('Hai bên tranh luận suốt một đêm, bạn thắng một nước cờ hiểm. Tu vi tăng, đạo tâm vững hơn, và ' + o.name + ' nể bạn hơn.'); }
            dao(c, -2); TT.rel.add(c, o, 3); return B('Bạn bị ' + o.name + ' hỏi đến cứng họng. Đạo tâm dao động đôi chút.');
          }
        },
        { key: 'tu', label: 'Khéo từ chối', kind: 'safe', ai: 0.5, run: c => 'Bạn chắp tay xin lỗi rồi đi tiếp, không thắng cũng không thua.' }
      ]
    },
    {
      id: 'tho_san', tier: 2, w: 1.5, cool: 36, title: 'Thợ săn rủ đi cùng', places: ['thon_tran', 'mo'],
      text: 'Một đám thợ săn trong vùng rủ bạn vào núi săn một con lợn rừng thành tinh, chia chác đều.',
      choices: [
        {
          key: 'di', label: 'Đi cùng', kind: 'risk', run: c => {
            if (P(lp(c, 0.6))) { gold(c, 30); c.trainAtk += 0.5; return G('Cả nhóm hạ được nó. Bạn chia 30 vàng và quen tay hơn.'); }
            hp(c, -25); return B('Con vật húc bạn văng xuống khe. Sinh lực -25.');
          }
        },
        { key: 'tu', label: 'Từ chối', kind: 'safe', run: c => 'Bạn ở lại, nghe đám thợ săn khoe chiến công vào chiều hôm sau.' }
      ]
    },
    {
      id: 'ho_tong', tier: 2, w: 2, cool: 36, title: 'Thương đoàn thuê hộ tống', places: ['thuong_doan', 'tram', 'ben'], when: c => TT.stats.atk(c) >= 8,
      text: 'Chủ một đoàn xe đang thiếu người hộ tống qua đoạn đường vắng: "Trả công hậu hĩnh, tu sĩ như ngươi đi cùng thì chúng ta yên tâm."',
      choices: [
        {
          key: 'nhan', label: 'Nhận việc', kind: 'risk', run: c => {
            if (P(0.75)) { const g = 40 + 10 * c.realm; gold(c, g); return G('Chuyến đi êm xuôi. Bạn nhận ' + g + ' vàng tiền công.'); }
            hp(c, -30); return B('Đoàn bị cướp chặn đường. Bạn đẩy lui được chúng nhưng bị thương, sinh lực -30.');
          }
        },
        { key: 'tu', label: 'Từ chối', kind: 'safe', run: c => 'Bạn nói còn việc riêng. Đoàn xe lên đường mà không có bạn.' }
      ]
    },
    {
      id: 'hai_cot', tier: 2, w: 2, cool: 48, title: 'Hài cốt tu sĩ', places: ['tan_tich', 'hung_dia', 'bi_canh'], when: c => c.realm >= 1,
      text: 'Giữa đống đổ nát, một bộ hài cốt tu sĩ vẫn ngồi xếp bằng, túi trữ vật còn nguyên bên hông.',
      choices: [
        {
          key: 'lay', label: 'Lấy túi trữ vật', kind: 'risk', run: c => {
            const k = kyNgo(c, 0.1, ['tot', 'tu_chat']);
            if (k) return k;
            if (P(0.55)) {
              TT.ls.gain(c, 4);
              const bk = P(0.3) ? book(c, 1) : null;
              return G('Trong túi có ít linh thạch. Bạn thu được 4 linh thạch.' + (bk ? ' Kèm theo một quyển sách còn nguyên: ' + bk + '.' : ''));
            }
            hp(c, -30); c.baseLuck -= 1; return B('Một đạo oán niệm còn sót phản kích. Sinh lực -30, vận may giảm.');
          }
        },
        { key: 'chon', label: 'Chôn cất tử tế', kind: 'help', ai: 0.7, run: c => { dao(c, 2); c.baseLuck += 1; return G('Bạn đào huyệt chôn cất. Lòng thanh thản, đạo tâm vững hơn, vận may tăng.'); } }
      ]
    },
    {
      id: 'linh_thu', tier: 2, w: 1.2, cool: 60, npc: 0.2, title: 'Linh thú bị thương', places: ['linh_mach', 'bi_canh', 'hung_dia', 'mo', 'tan_tich'],
      text: 'Một con linh thú nhỏ nằm co ro bên suối, chân rỉ máu, ánh mắt van lơn nhìn bạn.',
      choices: [
        {
          key: 'giup', label: 'Băng bó cho nó', kind: 'help', run: c => {
            const k = kyNgo(c, 0.1, ['kv', 'tot']);
            if (k) return k;
            if (P(0.75)) { c.baseLuck += 2; dao(c, 1); return G('Nó cọ vào tay bạn rồi chạy đi. Vận may của bạn tăng.'); }
            hp(c, -15); return B('Nó hoảng sợ, cắn bạn một cái. Sinh lực -15.');
          }
        },
        { key: 'bo', label: 'Mặc kệ', kind: 'safe', run: c => 'Bạn đi tiếp, không ngoảnh lại.' }
      ]
    },
    {
      id: 'nguoi_xin', tier: 2, w: 1.5, cool: 36, title: 'Người ăn xin', places: ['thon_tran', 'thanh_tri', 'ben'], when: c => TT.ls.wealth(c) >= 5,
      text: 'Một cụ già gầy guộc chìa chiếc bát mẻ ra trước mặt bạn. Quanh đó chẳng ai ngoảnh lại.',
      choices: [
        {
          key: 'cho', label: 'Cho 5 vàng', kind: 'help', run: c => {
            gold(c, -5); dao(c, 1);
            const k = kyNgo(c, 0.05, ['kv', 'tu_chat']);
            return k || G('Cụ già gật đầu cảm tạ. Lòng bạn nhẹ đi, đạo tâm tăng chút ít.');
          }
        },
        { key: 'di', label: 'Làm ngơ đi tiếp', kind: 'safe', run: c => 'Bạn đi qua, trong lòng thoáng chút áy náy.' }
      ]
    },
    {
      id: 'ke_trom', tier: 2, w: 1.5, cool: 36, title: 'Kẻ móc túi', places: ['thanh_tri', 'cho_den', 'ben', 'thuong_doan'], when: c => TT.ls.wealth(c) >= 10,
      text: 'Bạn chợt thấy túi tiền nhẹ bẫng. Một bóng người đang len qua đám đông, chạy về phía ngõ hẻm.',
      choices: [
        {
          key: 'duoi', label: 'Đuổi theo', kind: 'fight', run: c => {
            if (fight(c, 5 + c.realm * 8)) { gold(c, 10); return G('Bạn túm được gã, lấy lại tiền và thêm chút tiền phạt.'); }
            gold(c, -10); hp(c, -5); return B('Gã chạy thoát, còn quăng gạch trúng bạn. Mất 10 vàng.');
          }
        },
        { key: 'bo', label: 'Bỏ qua', kind: 'flee', run: c => { gold(c, -10); return B('Bạn tặc lưỡi cho qua. Mất 10 vàng.'); } }
      ]
    },
    {
      id: 'tam_ma', tier: 2, w: c => (c.stuck ? 4 : 1.5), cool: 48, npc: 0.25, title: 'Tâm ma quấy nhiễu', when: c => c.realm >= 1,
      text: 'Đang ngồi tĩnh tọa, bóng dáng chính bạn hiện lên giữa màn sương, thì thầm những điều bạn sợ nhất.',
      choices: [
        {
          key: 'doi', label: 'Đối mặt tâm ma', kind: 'risk', run: c => {
            const p = rng.clamp(0.35 + (c.daoTam - 50) * 0.008 + TT.stats.nl(c) * 0.003 + TT.stats.mod(c, 'tm') + TT.nature.mods(c).tamMa, 0.1, 0.9);
            if (P(p)) { dao(c, 3); xp(c, NR(c) * 0.03); c.daoDiem += 1; return G('Bạn nhìn thẳng vào nó, màn sương tan đi. Đạo tâm vững vàng hơn, tu vi tăng.'); }
            hp(c, -30); dao(c, -3); return B('Tâm ma áp đảo, khí huyết nghịch chuyển. Sinh lực -30, đạo tâm tổn thương.');
          }
        },
        { key: 'tinh', label: 'Tĩnh tâm niệm chú', kind: 'safe', run: c => { hp(c, -5); return 'Bạn niệm chú tĩnh tâm cho đến khi bóng ảo tan đi. Mất chút sức nhưng bình an.'; } }
      ]
    },
    // ---------------- mới: tầng 1, ghi nhật ký ----------------
    {
      id: 'thue_kho', tier: 1, w: 2, cool: 12, title: 'Việc làm thuê', when: c => c.realm >= 1,
      text: 'Một nhà giàu thuê bạn trông kho nửa tháng.',
      choices: [{ key: 'ok', label: 'Tiếp tục', kind: 'safe', run: c => { const g = RI(8, 20) * (1 + c.realm); gold(c, g); return 'Việc làm thuê: bạn nhận ' + g + ' vàng.'; } }]
    },
    {
      id: 'sao_bang', tier: 1, w: 1.2, cool: 36, npc: 0.2, title: 'Sao băng',
      text: 'Một vệt sao băng xé ngang bầu trời đêm.',
      choices: [{
        key: 'ok', label: 'Tiếp tục', kind: 'safe', run: c => {
          const k = kyNgo(c, 0.07, ['kv', 'lo']);
          if (k) return k;
          dao(c, 1); return 'Bạn ngắm sao băng một lúc lâu, nhớ lại ước nguyện thuở nhỏ. Lòng thấy bình yên.';
        }
      }]
    },
    {
      id: 'le_hoi', tier: 1, w: 1.2, cool: 24, title: 'Lễ hội làng', places: ['thon_tran', 'thanh_tri'],
      text: 'Dân làng mở hội mừng mùa.',
      choices: [{ key: 'ok', label: 'Tiếp tục', kind: 'safe', run: c => { hp(c, 10); gold(c, RI(2, 6)); return G('Bạn góp vui với dân làng, ăn no uống đủ. Sinh lực hồi phục, nhặt được ít tiền lẻ.'); } }]
    },
    {
      id: 'tinh_ngo', tier: 1, w: 2, cool: 18, title: 'Thông suốt',
      when: c => c.focus === 'train' && c.realm < 6,
      text: 'Đang tu luyện, bỗng một nút thắt trong công pháp được tháo gỡ.',
      choices: [{ key: 'ok', label: 'Tiếp tục', kind: 'safe', run: c => { xp(c, NR(c) * 0.015 * (0.7 + ngo(c) * 0.6)); return G('Bạn chợt thông suốt một điểm khó trong công pháp. Tu vi tăng thêm.'); } }]
    },
    // ---------------- mới: đặc trưng từng vùng ----------------
    {
      id: 'trung_binh', tier: 2, w: 1.5, cool: 120, title: 'Quan phủ trưng binh', regions: ['trung_chau'], when: c => c.realm <= 1,
      text: 'Hai nước giao tranh, quan phủ đi từng nhà bắt tráng đinh tòng quân. Tên bạn có trong sổ.',
      choices: [
        { key: 'nop', label: 'Nộp 30 vàng xin miễn', kind: 'pay', disabled: c => (TT.ls.wealth(c) < 30 ? 'Không đủ vàng' : false), run: c => { gold(c, -30); return 'Bạn nộp bạc cho viên lại. Tên bạn được gạch khỏi sổ.'; } },
        {
          key: 'di', label: 'Đi lính một mùa', kind: 'risk', run: c => {
            c.trainAtk += 1.5; c.trainHp += 2; gold(c, 15);
            if (P(0.3)) { hp(c, -40); return B('Bạn rèn luyện được nhiều nhưng bị thương trong một trận đụng độ. Sinh lực -40.'); }
            hp(c, -10); return G('Một mùa lính cho bạn thân thể rắn rỏi hơn và 15 vàng quân lương.');
          }
        }
      ]
    },
    {
      id: 'ngu_linh', tier: 2, w: 1.5, cool: 60, title: 'Đoàn thuyền cá linh', regions: ['dong_hai'], places: ['thon_tran', 'ben', 'thanh_tri'],
      text: 'Một đoàn thuyền chuẩn bị ra khơi bắt cá linh, thiếu người chèo. Mùa này cá béo nhưng sóng dữ.',
      choices: [
        {
          key: 'di', label: 'Theo thuyền ra khơi', kind: 'risk', run: c => {
            if (P(0.75)) { const g = 20 * (1 + c.realm); gold(c, g); return G('Cá đầy khoang. Bạn chia được ' + g + ' vàng.'); }
            hp(c, -35); return B('Gặp sóng lớn giữa khơi, bạn suýt rơi xuống biển. Sinh lực -35.');
          }
        },
        { key: 'o', label: 'Ở lại bờ', kind: 'safe', run: c => 'Bạn nhìn đoàn thuyền xa dần, không biết là may hay rủi.' }
      ]
    },
    {
      id: 'kiem_y', tier: 2, w: 1.5, cool: 60, title: 'Kiếm ý trong gió núi', regions: ['tay_son'], when: c => c.realm >= 1,
      text: 'Gió núi rít qua vách đá cắm đầy kiếm gãy, âm thanh nghe như một bài kiếm quyết cổ.',
      choices: [
        {
          key: 'ngo', label: 'Ngồi xuống cảm ngộ', kind: 'risk', run: c => {
            const p = rng.clamp(0.3 + frac(c, ['Kim', 'Phong']) * 0.5 + TT.stats.nl(c) * 0.002, 0.15, 0.85);
            if (P(p)) { xp(c, NR(c) * 0.05); c.trainAtk += 1; return G('Bạn nắm bắt được một tia kiếm ý. Tu vi và công kích đều tăng.'); }
            hp(c, -15); return B('Kiếm khí trong gió cứa vào kinh mạch. Sinh lực -15.');
          }
        },
        { key: 'di', label: 'Chỉ nghe rồi đi', kind: 'safe', run: c => 'Bạn nghe một lúc rồi đi, lòng chợt thấy trống trải.' }
      ]
    },
    {
      id: 'duoc_thao', tier: 2, w: 1.5, cool: 48, title: 'Dược thảo quý', regions: ['nam_lam'],
      text: 'Giữa tán lá, một gốc dược thảo hiếm tỏa mùi thơm. Nhưng gần đó có dấu chân thú dữ.',
      choices: [
        {
          key: 'hai', label: 'Hái dược thảo', kind: 'risk', run: c => {
            if (P(lp(c, 0.55))) {
              if (c.kind === 'player' && P(0.4)) return G('Bạn hái được nguyên gốc và vài cây linh thảo khác: ' + item(c, 'linh_thao', 3) + ' (đủ để luyện đan).');
              if (P(0.5)) { gold(c, 45); return G('Bạn hái được nguyên gốc, bán cho tiệm dược được 45 vàng.'); }
              c.trainHp += 3; return G('Bạn nhai ngay tại chỗ, thân thể ấm lên, sinh lực tối đa tăng.');
            }
            hp(c, -30); return B('Thú dữ xuất hiện! Bạn thoát được nhưng bị thương, sinh lực -30.');
          }
        },
        { key: 'bo', label: 'Không dám liều', kind: 'safe', run: c => 'Bạn nhìn gốc dược thảo lần cuối rồi lặng lẽ rời đi.' }
      ]
    },
    {
      id: 'tuyet_lac', tier: 2, w: 1.5, cool: 48, title: 'Lạc giữa bão tuyết', regions: ['bac_bang'],
      text: 'Bão tuyết nổi lên bất ngờ, che mất mọi dấu đường. Bạn phải quyết định ngay.',
      choices: [
        { key: 'cho', label: 'Đào hố chờ bão tan', kind: 'safe', run: c => { hp(c, -15); return 'Bạn nằm co trong hố tuyết suốt hai ngày. Sinh lực -15 nhưng giữ được mạng.'; } },
        {
          key: 'tim', label: 'Liều tìm đường', kind: 'risk', run: c => {
            if (P(0.45)) { hp(c, 35); xp(c, NR(c) * 0.02); return G('Bạn vấp phải một suối nước nóng giữa băng nguyên! Hồi phục sinh lực, tu vi tăng chút ít.'); }
            hp(c, -40); return B('Bạn lạc đường, suýt chết cóng. Sinh lực -40.');
          }
        }
      ]
    },
    {
      id: 'lo_ren', tier: 2, w: 1.5, cool: 60, title: 'Lò rèn bỏ hoang', regions: ['hoa_son'], when: c => c.realm >= 1,
      text: 'Một lò rèn cổ bỏ hoang, than bên trong vẫn đỏ rực suốt trăm năm.',
      choices: [
        {
          key: 'toi', label: 'Dùng lửa tôi luyện thân thể', kind: 'risk', run: c => {
            const p = rng.clamp(0.45 + frac(c, ['Hỏa', 'Dương']) * 0.4, 0.2, 0.9);
            if (P(p)) { c.trainAtk += 2; c.trainHp += 3; return G('Lửa cổ tôi luyện gân cốt. Công kích và sinh lực tối đa đều tăng.'); }
            hp(c, -30); return B('Lửa cháy quá dữ, bạn bị bỏng nặng. Sinh lực -30.');
          }
        },
        { key: 'di', label: 'Không dám động vào', kind: 'safe', run: c => 'Bạn nhìn ngọn lửa một lúc rồi lắc đầu bỏ đi.' }
      ]
    },
    {
      id: 'ao_anh', tier: 2, w: 1.5, cool: 48, title: 'Ốc đảo ảo ảnh', regions: ['hoang_mac'],
      text: 'Phía chân trời hiện ra một ốc đảo xanh mướt. Nước của bạn đã cạn.',
      choices: [
        {
          key: 'duoi', label: 'Đuổi theo ốc đảo', kind: 'risk', run: c => {
            if (P(lp(c, 0.4))) { hp(c, 30); gold(c, 10); return G('Là ốc đảo thật! Bạn uống no nước, còn nhặt được ít tiền của đoàn buôn bỏ lại.'); }
            hp(c, -30); return B('Chỉ là ảo ảnh. Bạn kiệt sức giữa cát nóng. Sinh lực -30.');
          }
        },
        { key: 'di', label: 'Đi theo hướng cũ', kind: 'safe', run: c => { hp(c, -5); return 'Bạn nén cơn khát đi tiếp. Sinh lực -5.'; } }
      ]
    },
    {
      id: 'den_ma', tier: 2, w: 1.5, cool: 60, title: 'Đèn ma trong đầm', regions: ['vu_trach'], when: c => c.realm >= 1,
      text: 'Một ngọn đèn xanh lơ lửng giữa sương, chập chờn dẫn về phía đầm sâu.',
      choices: [
        {
          key: 'theo', label: 'Theo ngọn đèn', kind: 'risk', run: c => {
            const k = kyNgo(c, 0.1, ['tot', 'tu_chat']);
            if (k) return k;
            if (P(0.5)) { gold(c, 35); return G('Ngọn đèn dẫn bạn tới một chiếc quan tài chìm, bên trong có ít châu báu. Bạn thu được 35 vàng.'); }
            hp(c, -25); return B('Bạn lạc giữa đầm, bị âm khí xâm thực. Sinh lực -25.');
          }
        },
        { key: 'tranh', label: 'Quay lưng bỏ đi', kind: 'safe', run: c => 'Bạn quay lưng đi thật nhanh, không dám nhìn lại.' }
      ]
    },
    {
      id: 'set_danh', tier: 2, w: 1.5, cool: 48, title: 'Sét đánh gần', regions: ['loi_dao'], when: c => c.realm >= 1,
      text: 'Một tia sét lớn giáng xuống tảng đá cách bạn vài bước, lôi quang còn quẩn quanh mặt đất.',
      choices: [
        {
          key: 'hung', label: 'Hứng lôi khí', kind: 'risk', run: c => {
            const hasDi = c.tuchat.attrs.some(a => a.di);
            if (!hasDi && P(0.08)) {
              const d = TT.ev.awakenDi(c, 'Lôi');
              if (d) return { t: '✦ Kỳ ngộ! Lôi khí thấm vào huyết mạch, bạn thức tỉnh thuộc tính biến dị hệ Lôi!', cls: 'big' };
            }
            const p = rng.clamp(0.35 + frac(c, ['Lôi', 'Phong']) * 0.5, 0.2, 0.9);
            if (P(p)) { xp(c, NR(c) * 0.06); c.trainNl += 0.5; return G('Lôi khí rèn luyện kinh mạch. Tu vi và niệm lực tăng.'); }
            hp(c, -40); return B('Lôi khí quá mạnh đánh bạn ngã quỵ. Sinh lực -40.');
          }
        },
        { key: 'tranh', label: 'Lùi ra xa', kind: 'safe', run: c => 'Bạn lùi ra xa, nhìn lôi quang tản dần trong mưa.' }
      ]
    }
  ];

  // Tham chiếu hàm trợ giúp dùng muộn (TT.stats nạp sau).
  function S_luck(c) { return TT.stats.luck(c); }
  // Chênh lệch đạo tâm so với mức nền 50 cũng ảnh hưởng thắng thua khi luận đạo.
  function dao_edge(c) { return (c.daoTam - 50) * 0.003; }

  D.eventById = {};
  D.EVENTS.forEach(e => { D.eventById[e.id] = e; });

  // Bảng kết quả kỳ ngộ (5-15% mỗi sự kiện đủ điều kiện). Dùng chung cho nhiều sự kiện.
  D.FATE = [
    { id: 'tu_chat', w: 30 },
    { id: 'di', w: 12 },
    { id: 'xoa', w: 18 },
    { id: 'tot', w: 14 },
    { id: 'kv', w: 16 },
    { id: 'lo', w: 10 },
    { id: 'phap_bao', w: 9 }
  ];
})();
