// Tuyến thế giới W1 "Lửa tới làng" (Q 12, gói N1): chiến sự lan tới vùng bạn, pha tin báo → lửa tới → đêm lửa (làng bị phá) → sáng sau → hòa nghị hoặc thất thủ.
// Mở khi cờ 'warAt' (đặt bởi sự kiện chiến loạn lan tới, js/systems/factions.js: fac_chien_loan) và đã Luyện Khí.
// Thuần dữ liệu; khung ở js/data/story.js.
(function () {
  const D = window.TT.data;

  D.STORY.reg({
    id: 'tg_chien_su', n: 'Lửa tới làng', loai: 'tg',
    mo: { realm: 1, flag: 'warAt' },
    vai: { truong: { pick: 'gan', dung_moi: true }, linh: { pick: 'gan', dung_moi: true }, ban: { pick: 'dong_ky', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Tin báo đường xa',
        d: 'Tin chiến sự truyền về qua đường buôn: quân triều và quân một hầu quốc đã giao trận ở phía tây. Người làng bàn tán rằng lương sẽ bị trưng thu trước, rồi tới lượt trai tráng. {truong} gọi dân làng họp dưới gốc đa.',
        khi: { sau: 1 }, han: 12, mac: 'cho_tin',
        lc: [
          { key: 'cho_tin', label: 'Chờ xem tin tức rồi tính', kind: 'safe', ax: { tudung: 1 },
            fx: { daoTam: 1 }, toi: 'c2' },
          { key: 'nhap_ngu', label: 'Ghi tên nhập ngũ tạm, nhận lương', kind: 'risk', ax: { tinh: -1, xuthe: 1 },
            fx: { gold: 20, flag: 'w1_linh' },
            tre: [{ sau: [24, 48], fx: { hp: -15 }, log: 'Đội tạm bị phục kích ở cầu đá. Bạn sống sót nhờ một cú xô bất ngờ. Lương vẫn đủ, nhưng giấc ngủ thì không.' }],
            toi: 'c2' },
          { key: 'buon_luong', label: 'Mua lương khô, bán lại cho quân', kind: 'risk', ax: { xuthe: 2, daoduc: -1 },
            fx: { gold: 40, rep: { danh: -1 } },
            tre: [{ sau: [12, 36], fx: { rep: { chinh: -1 } }, log: 'Lương khô bán lại đắt gấp đôi. Dân làng nhớ tên người đã bán, và nhớ lâu.' }],
            toi: 'c2' }
        ]
      },
      c2: {
        t: 'Lửa tới',
        d: 'Ba tháng sau, đoàn lính bại trận rút qua làng. Họ không còn lương, đòi dân nộp gạo, và có kẻ bắt đầu nói chuyện đốt kho để cầm chân địch. {linh}, một thủ lĩnh đào ngũ, đứng trước cửa kho, nhìn bạn như chờ bạn quyết.',
        khi: { sau: 3 }, han: 12, mac: 'chia_gao',
        lc: [
          { key: 'giu_gao', label: 'Giữ gạo trong kho, không cho ai đụng vào', kind: 'risk', ax: { tudung: 2, daoduc: -1 },
            fx: { daoTam: -2, rep: { danh: -1 }, flag: 'w1_giu_gao' },
            tre: [{ sau: [12, 30], fx: { hp: -20 }, log: 'Lính đào ngũ kéo đến giữa đêm đòi gạo. Bạn bị đánh, kho còn nguyên, nhưng tiếng xin của đứa trẻ hôm ấy bạn không quên được.' }],
            toi: 'c3' },
          { key: 'chia_gao', label: 'Chia gạo cho dân cùng nấu', kind: 'help', ax: { daoduc: 2 },
            gia: { gold: 25 }, fx: { rep: { chinh: 1 }, daoTam: 2, flag: 'w1_chia' },
            tre: [{ sau: [36, 72], fx: { gold: 15 }, log: 'Dân làng gom tiền góp lại để trả ơn, dù không ai đòi. Từ đó chợ làng luôn chừa chỗ cho bạn bày hàng.' }],
            toi: 'c3' },
          { key: 'di_truoc', label: 'Dắt người thân rời làng trước', kind: 'flee', ax: { tinh: 1, xuthe: 1 },
            fx: { xp: 0.1, flag: 'w1_di' },
            tre: [{ sau: [24, 60], fx: { rel: { vai: 'ban', d: -8 } }, log: '{ban} không nói gì khi bạn đi trước, nhưng lần gặp sau, hắn không còn hỏi bạn đi đâu.' }],
            toi: 'c3' }
        ]
      },
      c3: {
        t: 'Đêm lửa',
        d: 'Quân địch vào làng nửa đêm. {truong} gọi người trốn xuống hầm, còn {linh} giữ cửa cùng vài người. {ban} nắm tay bạn, hỏi có chạy không.',
        khi: { sau: 4 }, han: 12, mac: 'xuong_ham',
        lc: [
          { key: 'co_giup', label: 'Đứng lại cùng {linh} giữ cửa', kind: 'fight', ax: { tudung: -1, daoduc: 2 },
            gate: { truc: 'tudung', min: -2, why: 'Bạn sợ quá, chân không nhấc nổi lên.' },
            fx: { rel: { vai: 'linh', d: 15 }, xp: 0.15, hp: -25 },
            tre: [{ sau: [24, 60], fx: { rep: { danh: 2 } }, log: 'Tên những người giữ cửa đêm ấy được ghi vào sổ làng. Tên bạn đứng cạnh chữ "giữ cửa".' }],
            toi: 'c4' },
          { key: 'xuong_ham', label: 'Xuống hầm cùng {truong}, dẫn người đi trước', kind: 'safe', ax: { daoduc: 1, tudung: 1 },
            fx: { rel: { vai: 'truong', d: 12 }, daoTam: 1 },
            tre: [{ sau: [36, 72], fx: { gold: -10 }, log: 'Năm sau, {truong} nhờ bạn quản kho làng. Bạn hiểu đó là lời cầu xin, không phải lời mời.' }],
            toi: 'c4' },
          { key: 'chay', label: 'Chạy một mình khỏi làng', kind: 'flee', ax: { tinh: 1, tudung: -1 },
            gate: { truc: 'daoduc', max: 6, why: 'Lòng bạn không cho phép bỏ làng mà chạy một mình.' },
            fx: { daoTam: -3, flag: 'w1_chay' },
            tre: [{ sau: [48, 96], fx: { rel: { vai: 'ban', d: -15 } }, log: '{ban} không bao giờ nhắc đêm ấy, nhưng từ đó hai người nói chuyện như người xa lạ.' }],
            toi: 'c4' }
        ]
      },
      c4: {
        t: 'Sáng sau',
        d: 'Sáng hôm sau, làng còn vài chục mái nhà. Quan phủ tới ghi tên người sống sót, và bảo ai chịu nộp lương thì được cấp đất ở tỉnh khác. Lời ấy có thể là lối thoát, cũng có thể là cái bẫy.',
        khi: { realm: 2, sau: 2 }, han: 12, mac: 'nhan_dat',
        lc: [
          { key: 'nhan_dat', label: 'Nhận đất ở tỉnh khác, rời làng', kind: 'pay', ax: { tudung: 1, xuthe: 1 },
            gia: { gold: 30 }, fx: { rep: { chinh: 1 }, flag: 'w1_dat' }, toi: 'c5' },
          { key: 'to_quan', label: 'Tố cáo quan phủ bán đất cho người có tiền', kind: 'risk', ax: { daoduc: 2, xuthe: -1 },
            gate: { truc: 'daoduc', min: 2, why: 'Bạn còn sợ quan, chưa dám đứng ra nói một câu thật.' },
            fx: { rep: { danh: 2 }, nghiep: -1 },
            tre: [{ sau: [18, 42], fx: { rep: { chinh: -2 } }, log: 'Quan phủ đổi cái tên trong sổ, và bạn bị ghi vào danh sách gây rối.' }],
            toi: 'c5' },
          { key: 'lo_tu', label: 'Ở lại làng, lặng lẽ dựng lại nhà', kind: 'safe', ax: { daoduc: 1, tinh: 1 },
            fx: { daoTam: 2, gold: -10 }, toi: 'ket:lo_tu' }
        ]
      },
      c5: {
        t: 'Hòa nghị hoặc thất thủ',
        d: 'Trong tháng thứ ba, hai bên ngồi xuống bàn hòa ở thành cũ. Đồn rằng ai giúp dân qua chiến loạn sẽ được nhắc tên trên bia. Quân ấy có thể thắng, có thể thất thủ, còn bạn chỉ quyết được việc mình mang gì đến bàn.',
        khi: { realm: 2, sau: 3 }, han: 12, mac: 'lui_ve',
        lc: [
          { key: 'bao_cao', label: 'Mang chứng cứ của dân làng đến bàn hòa', kind: 'help', ax: { daoduc: 1, xuthe: 1 },
            wheel: {
              vung: [
                { w: 25, n: 'Thất thủ, bạn mất nhà', fx: { gold: -40, hp: -20, nghiep: 1 }, toi: 'ket:mat_nha' },
                { w: 45, n: 'Thoát cùng vài người, hòa nghị lệch', fx: { daoTam: 2, rep: { chinh: 1 } }, toi: 'ket:thoat' },
                { w: 30, n: 'Cứu được cả làng', fx: { rep: { danh: 3 }, daoTam: 4 }, toi: 'ket:cuu_lang' }
              ],
              yeu_to: { loai: 'nature', truc: 'daoduc', huong: 1, tran: 15 }, gia: 2
            } },
          { key: 'lui_ve', label: 'Lui về làng, không dính vào bàn hòa', kind: 'safe', ax: { tudung: 1 },
            fx: { daoTam: 1 }, toi: 'ket:thoat' }
        ]
      }
    },
    ket: {
      mat_nha: { t: 'Mất nhà', kv: 0, log: 'Làng cháy trong một đêm. Bạn còn lại một bọc quần áo và cái tên đã nằm trong tin báo. Nhà thì không còn.' },
      thoat: { t: 'Thoát cùng vài người', kv: 0, log: 'Bạn dẫn vài người sống sót ra khỏi vùng lửa. Chiến sự không dừng lại vì bạn, nhưng những người đi cùng bạn thì còn sống.' },
      cuu_lang: { t: 'Cứu được cả làng', kv: 1, log: 'Dân làng dựng một tấm bia gỗ nhỏ ở đầu đê, khắc tên những người giữ cửa đêm ấy. Tên bạn nằm ở dòng đầu.' },
      lo_tu: { t: 'Lặng lẽ dựng lại nhà', kv: 0, log: 'Bạn không đứng về phía nào. Căn nhà cũ mọc lại chậm rãi, và mỗi lần nhìn mái ngói mới, bạn nhớ có những thứ không cứu được.' }
    }
  });
})();
