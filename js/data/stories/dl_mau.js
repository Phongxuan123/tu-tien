// Tuyến đạo lữ KHUNG MẪU (9B, để kiểm; 3 chặng: gặp, tỏ tình, kết). Chỉ mở khi có cờ `dl_mau` (không tự mở trong lúc chơi bình thường).
// Dùng fx.bond (thanh, giai đoạn), điều kiện khi.bond, pick 'tinh' và toi_tu (NPC từ chối). Các tuyến đạo lữ thật viết ở 9B-d theo mẫu này.
(function () {
  const D = window.TT.data;

  D.STORY.reg({
    id: 'dl_mau', n: 'Duyên đầu (mẫu)', loai: 'tp',
    mo: { flag: 'dl_mau' },
    vai: { nguoi: { pick: 'tinh', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Gặp gỡ',
        d: 'Giữa chốn đông người, bạn bắt gặp {nguoi} đang đứng một mình, ánh mắt nhìn xa xăm như chưa từng thuộc về nơi nào. Chỉ một thoáng, mà bạn nhớ mãi.',
        khi: { age: 18 }, han: 12, mac: 'lai_gan',
        lc: [
          { key: 'lai_gan', label: 'Bước lại làm quen với {nguoi}', kind: 'help', ax: { xuthe: 1 },
            fx: { bond: { vai: 'nguoi', love: 20, trust: 12, st: 'men' } }, toi: 'c2' },
          { key: 'xa', label: 'Chỉ nhìn từ xa rồi đi', kind: 'safe', ax: { tinh: 1 },
            fx: { bond: { vai: 'nguoi', love: -3 } }, toi: 'ket:xa' }
        ]
      },
      c2: {
        t: 'Lời chưa nói',
        d: 'Mùa đã qua mấy lượt. Bạn và {nguoi} quen nhau đủ để biết lúc nào người kia im lặng vì mệt, lúc nào vì có điều muốn nói. Có những lời giấu mãi cũng thành gánh.',
        khi: { sau: 3, bond: { vai: 'nguoi', st: 'men', love: 25 } }, han: 24, mac: 'chua_noi',
        lc: [
          { key: 'ngo_loi', label: 'Nói thật lòng mình với {nguoi}', kind: 'risk', ax: { daoduc: 1, xuthe: -1 },
            fx: { bond: { vai: 'nguoi', love: 8, st: 'to' } }, toi: 'c3', toi_tu: 'ket:tu_choi' },
          { key: 'chua_noi', label: 'Giữ lại trong lòng, chưa vội nói', kind: 'safe', ax: { tudung: 1 },
            fx: { bond: { vai: 'nguoi', trust: 4 } }, toi: 'ket:xa' }
        ]
      },
      c3: {
        t: 'Một lời thề',
        d: 'Lời đã nói ra, giờ chỉ còn việc cả hai có dám đi cùng nhau hay không. {nguoi} nhìn bạn, chờ một câu trả lời cho phần đời còn lại.',
        khi: { sau: 2, bond: { vai: 'nguoi', st: 'to', love: 40 } }, han: 24, mac: 'hoan',
        lc: [
          { key: 'ket_dao_lu', label: 'Cùng {nguoi} kết làm đạo lữ', kind: 'help', ax: { daoduc: 1 },
            fx: { bond: { vai: 'nguoi', love: 10, trust: 8, st: 'ket' }, daoTam: 2 }, toi: 'ket:ben', toi_tu: 'ket:tu_choi' },
          { key: 'hoan', label: 'Xin thêm thời gian', kind: 'safe', ax: { tudung: 1 },
            fx: { bond: { vai: 'nguoi', love: -2 } }, toi: 'ket:xa' }
        ]
      }
    },
    ket: {
      ben: { t: 'Đôi người một đường', kv: 1, log: 'Bạn và {nguoi} cùng nhau bước lên con đường dài. Từ nay mỗi chặng đạo đều có thêm một người chia sẻ.' },
      tu_choi: { t: 'Lời không có hồi âm', kv: 0, log: '{nguoi} khẽ lắc đầu. Bạn hiểu có những tấm lòng không đổi được dù cố tới đâu, và tiếp tục đi.' },
      xa: { t: 'Duyên chưa đủ', kv: 0, log: 'Bạn và {nguoi} rồi cũng đi hai ngả. Có những người chỉ gặp một đoạn đường.' }
    }
  });
})();
