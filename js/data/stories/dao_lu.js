// Tuyến đạo lữ (9B-d): 4 tuyến, 12 chặng (dl_gap, dl_hon, dl_ben, dl_tan). Chỉ dữ liệu; khung ở js/data/story.js, mẫu ở dl_mau.js.
// Hành trình: gặp → mến → tỏ tình (vòng quay: rel) → hôn ước bị ép (có nhánh từ chối, bỏ trốn) → lễ kết → ở bên → chia đường tu, kẻ thứ ba
//   → chênh thọ (vòng quay: nature) → rạn nứt → hòa hoặc chia tay → tang (kể gián tiếp).
// 8 trên 12 chặng mở từ Luyện Khí trung kỳ trở xuống (theo tháng hoặc tuổi); 4 chặng chuyện lớn (h2, c3, c4, d2) mở từ Trúc Cơ hoặc đến tuổi (hoac), cái nào trước, để không kẹt.
// Chữ ngắn, giọng pha nhẹ, nghiêm ở chuyện lớn; tên NPC chỉ qua khe vai.
(function () {
  const D = window.TT.data;

  D.STORY.reg({
    id: 'dl_gap', n: 'Duyên gặp nơi chợ đêm', loai: 'tp',
    mo: { age: 16 },
    vai: { nguoi: { pick: 'tinh', dung_moi: true } },
    dau: 'g1',
    chang: {
      g1: {
        t: 'Chợ đêm',
        d: 'Chợ đêm phố cổ đông nghẹt người. Giữa tiếng rao và mùi bánh nóng, bạn thấy {nguoi} đứng ở quầy đèn lồng, lật từng chiếc như đang tìm một thứ đã mất. Người ấy ngẩng lên, cười một cái rồi quay đi.',
        khi: { age: 16 }, han: 12, mac: 'xa',
        lc: [
          { key: 'lai_gan', label: 'Bước lại hỏi {nguoi} đang tìm gì', kind: 'help', ax: { xuthe: 1 },
            fx: { bond: { vai: 'nguoi', love: 20, trust: 12, st: 'men' } }, toi: 'g2' },
          { key: 'xa', label: 'Mua một chiếc đèn rồi đi', kind: 'safe', ax: { tinh: 1 },
            fx: { bond: { vai: 'nguoi', love: -3 } }, toi: 'ket:xa' }
        ]
      },
      g2: {
        t: 'Quen dần',
        d: 'Mấy mùa qua, bạn và {nguoi} quen nhau đủ để biết lúc nào người kia im lặng vì mệt, lúc nào vì có điều muốn nói. Đôi khi chỉ một câu hỏi thăm cũng làm ngày của cả hai sáng thêm.',
        khi: { sau: 3, bond: { vai: 'nguoi', st: 'men' } }, han: 24, mac: 'giu_ke',
        lc: [
          { key: 'noi_chuyen', label: 'Hỏi thăm chuyện nhà {nguoi}', kind: 'help', ax: { daoduc: 1 },
            fx: { bond: { vai: 'nguoi', love: 6, trust: 6 } }, toi: 'g3' },
          { key: 'giu_ke', label: 'Giữ khoảng cách cho khỏi vướng víu', kind: 'safe', ax: { tudung: 1 },
            fx: { bond: { vai: 'nguoi', trust: 3 } }, toi: 'ket:xa' }
        ]
      },
      g3: {
        t: 'Đêm rằm',
        d: 'Đêm rằm, hai người ngồi trên mái đình. Lời muốn nói đã nghẹn nơi cổ họng nhiều lần, và lần này bạn thấy nó sắp tuôn ra.',
        khi: { sau: 2, bond: { vai: 'nguoi', st: 'men' } }, han: 24, mac: 'giu_trong_long',
        lc: [
          { key: 'noi_ra', label: 'Nói ra lòng mình', kind: 'risk', ax: { daoduc: 1, xuthe: -1 },
            gate: { truc: 'tudung', max: 5, why: 'Bạn cẩn trọng quá, lời đã đến môi vẫn nuốt xuống.' },
            fx: { flag: 'dl_toi' },
            wheel: {
              vung: [
                { w: 35, n: 'Lời vụng về, người kia bật cười rồi đỏ mặt', fx: { bond: { vai: 'nguoi', love: 6, trust: 4 } }, toi: 'g4' },
                { w: 40, n: 'Lời chân thật, người kia lặng đi một lúc lâu', fx: { bond: { vai: 'nguoi', love: 3 } }, toi: 'g4' },
                { w: 25, n: 'Lời bị cắt ngang, chỉ kịp nói nửa câu', fx: { bond: { vai: 'nguoi', love: -2 } }, toi: 'ket:xa' }
              ],
              yeu_to: { loai: 'rel', vai: 'nguoi', tran: 12 }, gia: 2
            } },
          { key: 'giu_trong_long', label: 'Giữ trong lòng, để đêm trôi qua', kind: 'safe', ax: { tudung: 2 },
            fx: { bond: { vai: 'nguoi', trust: 2 } }, toi: 'ket:xa' }
        ]
      },
      g4: {
        t: 'Câu trả lời',
        d: 'Lời đã nói ra, giờ chỉ còn việc hai người có dám đi cùng nhau. {nguoi} nhìn bạn, chờ một câu trả lời cho phần đời còn lại.',
        khi: { sau: 1 }, han: 24, mac: 'hoan',
        lc: [
          { key: 'nhan_loi', label: 'Đưa tay, nhận lời {nguoi}', kind: 'help', ax: { daoduc: 1 },
            fx: { bond: { vai: 'nguoi', love: 8, trust: 6, st: 'to' } }, toi: 'ket:hua', toi_tu: 'ket:tu_choi' },
          { key: 'hoan', label: 'Xin thêm thời gian để nghĩ', kind: 'safe', ax: { tudung: 1 },
            fx: { bond: { vai: 'nguoi', love: -2 } }, toi: 'ket:xa' }
        ]
      }
    },
    ket: {
      hua: { t: 'Lời hẹn chợ đêm', kv: 0, log: 'Bạn và {nguoi} hẹn mùa sau lại ra chợ đêm. Chưa ai dám gọi đó là đính ước, nhưng cả hai đều nhớ.' },
      tu_choi: { t: 'Lời không có hồi âm', kv: 0, log: '{nguoi} khẽ lắc đầu, nói rất nhẹ rằng bây giờ chưa phải lúc. Bạn gật đầu, và đèn lồng ngoài kia vẫn sáng.' },
      xa: { t: 'Duyên chưa đủ', kv: 0, log: 'Bạn và {nguoi} rồi đi hai ngả. Có những người chỉ gặp nhau trong một đêm chợ.' }
    }
  });

  D.STORY.reg({
    id: 'dl_hon', n: 'Hôn ước bị ép', loai: 'tp',
    mo: { sau: 'dl_gap', bond: { st: 'to' } },
    vai: { nguoi: { pick: 'bond', bond: { st: 'to' } }, ep: { pick: 'su', dung_moi: true } },
    dau: 'h1',
    chang: {
      h1: {
        t: 'Lệnh từ trên',
        d: '{ep} tìm tới tận cửa với lệnh của tông môn: đính ước bạn với {nguoi} để đổi lấy một suất thăng tiến. Lệnh nói là ân huệ, bạn nghe ra là sợi dây. {nguoi} đứng sau lưng, không nói gì, chỉ nhìn bạn chờ xem bạn chọn đường nào.',
        khi: { sau: 1 }, han: 18, mac: 'nhan',
        lc: [
          { key: 'nhan', label: 'Nhận đính ước, đi tới ngày lễ', kind: 'help', ax: { xuthe: 1 },
            fx: { bond: { vai: 'nguoi', type: 'hon_uoc', st: 'hon' } }, toi: 'h2', toi_tu: 'ket:tu_choi' },
          { key: 'tu_hon', label: 'Khéo từ chối trước mặt {ep}', kind: 'risk', ax: { xuthe: -2, daoduc: 1 },
            gate: { truc: 'xuthe', min: -4, why: 'Bạn không đủ cứng để nói không với lệnh của cả một tông môn.' },
            fx: { bond: { vai: 'nguoi', love: -10 }, rel: { vai: 'ep', d: -15 } }, toi: 'ket:tu_hon',
            tre: [{ sau: [24, 60], fx: { rel: { vai: 'ep', d: -8 } }, log: '{ep} không quên chuyện hôm ấy. Có lần gặp ngoài đường, ánh mắt của người ấy lạnh đi một chút.' }] },
          { key: 'bo_tron', label: 'Đêm đó cùng {nguoi} bỏ trốn', kind: 'flee', ax: { tudung: -2, tinh: 1 }, gia: { gold: 50 },
            fx: { bond: { vai: 'nguoi', love: 5, trust: -3 }, flag: 'dl_tron' }, toi: 'ket:bo',
            tre: [{ sau: [36, 96], fx: { rel: { vai: 'ep', d: -20 } }, log: 'Tông môn truy tìm đôi người trốn lệnh. Tin báo về muộn, nhưng không ai quên tên bạn trong sổ đen.' }] }
        ]
      },
      h2: {
        t: 'Ngày lễ đã định',
        d: 'Lễ định vào tháng mười. Tông môn muốn một buổi lễ lớn, {nguoi} chỉ muốn một buổi lễ nhỏ. Bạn đứng giữa hai điều ấy và phải chọn cách mình muốn bước vào đời người kia.',
        khi: { sau: 3, hoac: [{ realm: 2 }, { age: 40 }] }, han: 24, mac: 'hoan',
        lc: [
          { key: 'le_gian', label: 'Lễ giản dị, chỉ hai người và một nén hương', kind: 'help', ax: { daoduc: 1 },
            fx: { bond: { vai: 'nguoi', st: 'ket', type: 'dao_lu', love: 10, trust: 8 } }, toi: 'ket:ket', toi_tu: 'ket:tu_choi' },
          { key: 'le_tong', label: 'Lễ tông chứng, mời trưởng lão và đồng môn', kind: 'pay', ax: { xuthe: 1 }, gia: { gold: 100 },
            fx: { rep: { danh: 1 }, bond: { vai: 'nguoi', st: 'ket', type: 'dao_lu', love: 6, trust: 4 } }, toi: 'ket:ket', toi_tu: 'ket:tu_choi' },
          { key: 'hoan', label: 'Hoãn lễ, nói còn việc tu hành', kind: 'safe', ax: { tudung: 2 },
            fx: { bond: { vai: 'nguoi', love: -3 } }, toi: 'ket:hoan' }
        ]
      }
    },
    ket: {
      ket: { t: 'Lễ đã thành', kv: 1, log: 'Ngày lễ không quá lớn cũng không quá nhỏ. Bạn và {nguoi} bước vào đời nhau bằng một ngày cả hai đều không hối.' },
      tu_hon: { t: 'Lệnh bị khước từ', kv: 0, log: 'Bạn từ chối lệnh tông môn bằng lời khéo nhất có thể. {ep} đi, không ngoảnh lại, còn chuyện sau này chưa ai biết.' },
      bo: { t: 'Đêm chạy trốn', kv: 0, log: 'Hai người rời thành trong đêm, không kịp chào ai. Điều ấy đúng hay sai, chỉ thời gian mới trả lời.' },
      hoan: { t: 'Lễ để lại đó', kv: 0, log: 'Lễ hoãn rồi lại hoãn. Hai người vẫn gặp nhau, nhưng chữ "đạo lữ" chưa bao giờ được gọi thành tiếng.' },
      tu_choi: { t: 'Người kia không đồng ý', kv: 0, log: '{nguoi} nhìn bạn rất lâu rồi nói không thể bước vào một lễ không do lòng mình. Bạn không trách được ai.' }
    }
  });

  D.STORY.reg({
    id: 'dl_ben', n: 'Ở bên nhau', loai: 'tp',
    mo: { sau: 'dl_hon', bond: { st: 'ket' } },
    vai: { nguoi: { pick: 'bond', bond: { st: 'ket' } }, ke: { pick: 'dong_ky', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Căn nhà nhỏ',
        d: 'Căn nhà nhỏ ngoài thành có một cây hòe và một bếp lò hay tắt. {nguoi} học nấu cơm bằng cách làm cháy nồi, còn bạn học cách kiên nhẫn đứng nhìn nồi cháy. Có những ngày chỉ vậy cũng đủ.',
        khi: { sau: 1 }, han: 12, mac: 'song_chung',
        lc: [
          { key: 'song_chung', label: 'Cùng dọn về, chia việc nhà', kind: 'help', ax: { daoduc: 1 },
            fx: { bond: { vai: 'nguoi', love: 6, trust: 4, st: 'ben' } }, toi: 'c2' },
          { key: 'tach_ra', label: 'Mỗi người một phòng, mỗi người một việc', kind: 'safe', ax: { tudung: 1 },
            fx: { bond: { vai: 'nguoi', love: -4, st: 'ben' } }, toi: 'c2' }
        ]
      },
      c2: {
        t: 'Hai lối tu',
        d: 'Đạo của {nguoi} rẽ về phía bình yên, còn của bạn muốn đi xa hơn. Mỗi đêm hai người ngồi đối diện nhau, và mỗi đêm nói ít đi một chút.',
        khi: { sau: 6 }, han: 18, mac: 'cung_di',
        lc: [
          { key: 'theo_duong', label: 'Nói thẳng: bạn muốn đi xa hơn', kind: 'risk', ax: { xuthe: 1, tinh: -1 },
            fx: { bond: { vai: 'nguoi', love: -3, st: 'thu' }, daoTam: 2 }, toi: 'c3' },
          { key: 'cung_di', label: 'Nhường một bước, đi theo đường người kia chọn', kind: 'help', ax: { tinh: 1 },
            fx: { bond: { vai: 'nguoi', love: 4, trust: 4, st: 'thu' }, daoTam: -1 }, toi: 'c3' }
        ]
      },
      c3: {
        t: 'Kẻ thứ ba',
        d: 'Đồng kỳ {ke} của tông môn, người vốn nổi tiếng tài giỏi, bắt đầu hay xuất hiện bên cạnh {nguoi}. Lời khen có vẻ thật lòng, nhưng ánh mắt thì không. Bạn phải quyết nên tin ai.',
        khi: { sau: 12, hoac: [{ realm: 2 }, { age: 45 }] }, han: 18, mac: 'tin_nguoi',
        lc: [
          { key: 'tin_nguoi', label: 'Tin người bạn đời, không để tâm {ke}', kind: 'help', ax: { daoduc: 1 },
            fx: { bond: { vai: 'nguoi', trust: 10, love: 4 } }, toi: 'c4' },
          { key: 'nghi_ngo', label: 'Lặng lẽ để ý, nghi ngờ {nguoi}', kind: 'risk', ax: { tudung: 1 },
            gate: { truc: 'daoduc', max: 6, why: 'Bạn không nhẫn tâm nghi người mình thương, dù trong lòng đã có gợn.' },
            fx: { bond: { vai: 'nguoi', trust: -12, love: -6 } }, toi: 'c4',
            tre: [{ sau: [24, 60], fx: { bond: { vai: 'nguoi', trust: -6 } }, log: 'Một đêm tỉnh giấc, bạn thấy {nguoi} ngồi im bên cửa sổ, và biết mình đã làm người kia buồn lâu hơn bạn tưởng.' }] },
          { key: 'tu_ke', label: 'Gặp {ke} nói thẳng cho rõ', kind: 'fight', ax: { xuthe: 2 },
            fx: { rel: { vai: 'ke', d: -15 }, bond: { vai: 'nguoi', trust: 6 } }, toi: 'c4' }
        ]
      },
      c4: {
        t: 'Chênh thọ',
        d: 'Bạn đã bước vào Trúc Cơ, còn {nguoi} vẫn dừng ở chỗ cũ. Thọ nguyên chênh nhau mấy chục năm. Một buổi sáng, {nguoi} nói khẽ: "Mình còn đủ thời gian để đi chung đường không?"',
        khi: { sau: 6, hoac: [{ realm: 2 }, { age: 60 }] }, han: 24, mac: 'giu',
        lc: [
          { key: 'giu', label: 'Giữ người ấy lại, dù đường phía trước còn dài và xa', kind: 'risk', ax: { tinh: 2 }, fx: {},
            wheel: {
              vung: [
                { w: 30, n: 'Hai người cùng ở lại, cùng chịu phần thiệt', fx: { bond: { vai: 'nguoi', love: 6, trust: 6 } }, toi: 'ket:ben_lau' },
                { w: 40, n: 'Giữ được, nhưng mỗi năm lại xa thêm một chút', fx: { bond: { vai: 'nguoi', love: -4, st: 'ran' } }, toi: 'ket:ran' },
                { w: 30, n: 'Buông tay để người kia tìm đường đi xa hơn', fx: { bond: { vai: 'nguoi', love: -8, type: 'cu' } }, toi: 'ket:chia' }
              ],
              yeu_to: { loai: 'nature', truc: 'tinh', huong: 1, tran: 12 }, gia: 3
            } },
          { key: 'buong', label: 'Nói lời chia tay, không cần thử', kind: 'flee', ax: { tudung: 2 },
            fx: { bond: { vai: 'nguoi', love: -6, type: 'cu' } }, toi: 'ket:chia' }
        ]
      }
    },
    ket: {
      ben_lau: { t: 'Bền như cây hòe', kv: 1, log: 'Hai người cùng ở lại. Đường tu còn xa, nhưng từ nay bạn không còn sợ đi một mình.' },
      ran: { t: 'Đèn vẫn sáng, lòng đã xa', kv: 0, log: 'Hai người vẫn dưới một mái nhà, nhưng mỗi tối ngồi một đầu bàn. Có thứ gì đó đã đứt đi lúc nào không hay.' },
      chia: { t: 'Hai lối đi riêng', kv: 0, log: '{nguoi} thu xếp hành trang, không khóc, cũng không quay đầu. Cây hòe trong sân vẫn xanh như mọi năm.' }
    }
  });

  D.STORY.reg({
    id: 'dl_tan', n: 'Rạn nứt và tang', loai: 'tp',
    mo: { sau: 'dl_ben', bond: { st: 'ran' } },
    vai: { nguoi: { pick: 'bond', bond: { st: 'ran' } } },
    dau: 'd1',
    chang: {
      d1: {
        t: 'Vết nứt',
        d: 'Tin đồn về lối sống của bạn truyền đi khắp nơi, và {nguoi} không còn tin như trước. Mỗi lời chào đều nặng thêm một tiếng thở dài. Chuyện này không thể gác mãi.',
        khi: { sau: 1 }, han: 24, mac: 'chia_tay',
        lc: [
          { key: 'noi_chuyen', label: 'Ngồi xuống nói hết mọi chuyện', kind: 'help', ax: { daoduc: 2 },
            fx: { bond: { vai: 'nguoi', trust: 6, love: 4, st: 'ben' } }, toi: 'd2' },
          { key: 'chia_tay', label: 'Nói chia tay cho xong', kind: 'risk', ax: { tudung: 2, tinh: -1 },
            fx: { bond: { vai: 'nguoi', love: -10, type: 'cu' } }, toi: 'ket:chia' }
        ]
      },
      d2: {
        t: 'Tin dữ từ nơi xa',
        d: 'Mùa đông năm ấy, tin dữ đến. Người đưa thư đứng ngoài cổng, không dám bước vào. {nguoi} đã đi, không kịp nói lời cuối. Ngọn đèn trên bàn thờ nhỏ cháy lâu hơn bạn tưởng.',
        khi: { sau: 60, hoac: [{ realm: 2 }, { age: 70 }] }, han: 24, mac: 'giu_di_vat',
        lc: [
          { key: 'giu_di_vat', label: 'Giữ lại di vật, thắp hương mỗi năm', kind: 'safe', ax: { daoduc: 1 },
            fx: { daoTam: -3, flag: 'dl_tang', bond: { vai: 'nguoi', st: 'biet' } }, toi: 'ket:giu',
            tre: [{ sau: [60, 120], fx: { daoTam: 4 }, log: 'Ngày giỗ năm nào bạn cũng thắp một nén hương. Đến một lúc, bạn nhớ người ấy bằng nụ cười nhiều hơn nước mắt.' }] },
          { key: 'lap_mieu', label: 'Dựng một miếu nhỏ bên đường cho người ấy', kind: 'pay', ax: { daoduc: 2 }, gia: { gold: 80 },
            fx: { daoTam: 2, rep: { danh: 1 }, flag: 'dl_mieu', bond: { vai: 'nguoi', st: 'biet' } }, toi: 'ket:mieu' },
          { key: 'theo_nguoi', label: 'Bỏ cả đời tu hành, đi theo nơi người ấy đi', kind: 'flee', ax: { tinh: 2 },
            gate: { truc: 'tinh', min: 5, why: 'Lòng bạn chưa sâu đến mức bỏ hết đời mình theo người đã khuất.' },
            fx: { daoTam: -12, nghiep: 2, bond: { vai: 'nguoi', st: 'biet' } }, toi: 'ket:theo' }
        ]
      }
    },
    ket: {
      giu: { t: 'Đèn thờ không tắt', kv: 0, log: 'Bạn giữ chiếc khăn và chiếc trâm cũ. Có những người không cần nói gì mà vẫn ở lại trong đời ta.' },
      mieu: { t: 'Miếu nhỏ bên đường', kv: 1, log: 'Miếu không lớn, chỉ có một bát nước và một ngọn đèn. Người qua đường ghé vào thắp hương, không biết ai đã ở đây.' },
      theo: { t: 'Đạo tâm lặng hẳn', kv: 0, log: 'Bạn đóng cửa đạo quán, không còn đi xa nữa. Thời gian trôi qua như nước dưới đáy giếng.' },
      chia: { t: 'Hai ngả xa', kv: 0, log: 'Vết nứt không được hàn lại. Hai người đi về hai hướng, và lần này không ai quay đầu.' }
    }
  });
})();
