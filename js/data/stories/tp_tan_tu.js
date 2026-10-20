// Tuyến thân phận T1 "Gió không thuộc về ai" (Q 11.0, gói N1). Thuần dữ liệu; khung ở js/data/story.js.
// Cờ mở 'tan_tu' (chưa có hệ nào gán): đúng khi không tông, không hội, từ Luyện Khí. Khi engine đọc được nghề/tông/vùng thì thay bằng điều kiện đó.
// Vai 'ban' lấy người đồng kỳ (dong_ky), sẽ đổi sang người có ký ức chung khi 9K xong.
(function () {
  const D = window.TT.data;

  D.STORY.reg({
    id: 'tp_tan_tu', n: 'Gió không thuộc về ai', loai: 'tp',
    mo: { realm: 1, flag: 'tan_tu' },
    vai: { an: { pick: 'gan', dung_moi: true }, lua: { pick: 'gan', dung_moi: true }, ban: { pick: 'dong_ky', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Bữa cơm ân',
        d: 'Đêm đông ngoài thành, bạn đói tới không nhấc nổi chân. {an}, một người xa lạ áo vá, đưa cho bạn một cái bánh còn nóng rồi quay đi, không hỏi tên. "Có nợ thì để sau," hắn nói vậy, rồi lẫn vào sương.',
        khi: { sau: 1 }, han: 12, mac: 'nhan',
        lc: [
          { key: 'nhan', label: 'Nhận bánh, cảm ơn rồi đi', kind: 'safe', ax: { xuthe: 1 },
            fx: { rel: { vai: 'an', d: 10 }, daoTam: 1, flag: 'tt_an' },
            tre: [{ sau: [60, 120], fx: { rel: { vai: 'an', d: 8 } }, log: 'Mùa xuân, bạn gặp lại {an} ở chợ. Hắn chỉ gật đầu, không đòi gì, nhưng bạn thấy món nợ ấy vẫn chưa xong.' }],
            toi: 'c2' },
          { key: 'tra', label: 'Đưa lại vài đồng, nói không muốn nợ ai', kind: 'pay', ax: { xuthe: -1, daoduc: 1 }, gia: { gold: 8 },
            fx: { rel: { vai: 'an', d: 4 }, rep: { danh: 1 }, flag: 'tt_tra' }, toi: 'c2' },
          { key: 'cung', label: 'Từ chối, bảo không cần thương hại', kind: 'flee', ax: { tinh: 1, tudung: -1 },
            gate: { truc: 'daoduc', max: 5, why: 'Lòng bạn còn mềm trước bát cơm của người khác, không nói ra nổi câu từ chối ấy.' },
            fx: { daoTam: -2, rel: { vai: 'an', d: -6 } }, toi: 'c2' }
        ]
      },
      c2: {
        t: 'Chợ tán tu',
        d: 'Chợ tán tu họp dưới một cây khô bên sông. Không có sổ sách, chỉ có luật ngầm: nợ thì khắc dấu lên gỗ, lừa người thì cả chợ tẩy chay. {lua} mời bạn ngồi uống trà, nói đây là người làm ăn tử tế nhất chợ này.',
        khi: { realm: 1, sau: 3 }, han: 18, mac: 'hoc_luat',
        lc: [
          { key: 'hoc_luat', label: 'Học luật ngầm, im lặng quan sát', kind: 'safe', ax: { tinh: 1 },
            fx: { xp: 0.05, daoTam: 1 }, toi: 'c3' },
          { key: 'tin_lua', label: 'Tin lời {lua}, góp vốn làm ăn chung', kind: 'risk', ax: { xuthe: 2, tinh: -1 },
            gate: { truc: 'xuthe', min: 4, why: 'Bạn vẫn giữ khoảng cách với người lạ, chưa dám bỏ vốn cho ai.' },
            fx: { gold: 20, rel: { vai: 'lua', d: 12 }, flag: 'tt_gop' },
            tre: [{ sau: [12, 30], fx: { gold: -30 }, log: 'Thương vụ hóa ra là bẫy. {lua} biến mất cùng một phần vốn. Bạn vẫn nhớ tên hắn, khắc lên gỗ đen như luật chợ.' }],
            toi: 'c3' },
          { key: 'tu_lam', label: 'Bỏ đi một mình, tự làm ăn nhỏ', kind: 'safe', ax: { tudung: 1, xuthe: -1 },
            fx: { gold: 5, daoTam: 1 }, toi: 'c3' }
        ]
      },
      c3: {
        t: 'Mỏ bị chia',
        d: 'Một mỏ linh thạch bìa rừng bị một tông nhỏ và một hội buôn chia nhau. Thợ tán tu bị đuổi khỏi hầm, công bị cắt đôi. {ban} đứng cạnh bạn, mắt đỏ, hỏi bạn định làm gì.',
        khi: { realm: 1, sau: 4 }, han: 12, mac: 'nhin',
        lc: [
          { key: 'nhin', label: 'Nhịn, tìm việc khác mà sống', kind: 'safe', ax: { daoduc: 1, tudung: -1 },
            fx: { daoTam: 2, gold: -10 },
            tre: [{ sau: [36, 72], fx: { rel: { vai: 'ban', d: -8 } }, log: '{ban} trách bạn nhát gan. Từ đó hai người nói chuyện ít hẳn đi.' }],
            toi: 'c4' },
          { key: 'danh', label: 'Đánh trả, đòi lại công', kind: 'fight', ax: { xuthe: -2, tinh: 1 },
            gate: { truc: 'tinh', max: -2, why: 'Bạn điềm tĩnh quá, chưa muốn đem cả mạng ra đổi một bữa công.' },
            fx: { gold: 15, nghiep: 2, rel: { vai: 'ban', d: 10 } },
            tre: [{ sau: [24, 60], fx: { rep: { danh: -1 } }, log: 'Người của tông cũ chờ bạn ở ngã rẽ. Bạn thoát được, nhưng không ai dám thuê bạn nữa.' }],
            toi: 'c4' },
          { key: 'bo_di', label: 'Bỏ mỏ, lên đường xa', kind: 'flee', ax: { tinh: 1 },
            fx: { xp: 0.1, daoTam: -1, flag: 'tt_bo_mo' }, toi: 'c4' }
        ]
      },
      c4: {
        t: 'Ba lời mời',
        d: 'Ba người tìm tới trong cùng một tuần. Đại diện một tông môn hứa chỗ ngồi nếu bạn chịu làm việc vặt. Một người của hội buôn muốn bạn làm mắt cho họ ở chợ. Một viên quan muốn bạn đứng tên trong sổ dân binh. Cả ba đều hứa hậu hĩnh, và có một điều chung: ai nhận thì không còn là tán tu nữa.',
        khi: { realm: 2, sau: 6 }, han: 18, mac: 'giu_tu_do',
        lc: [
          { key: 'nhan_tong', label: 'Nhận lời vào tông làm việc vặt', kind: 'pay', ax: { xuthe: 1, tudung: 1 },
            gia: { gold: 20 }, fx: { rep: { danh: 1 }, flag: 'tt_tong' }, toi: 'ket:tong' },
          { key: 'nhan_hoi', label: 'Nhận việc hội, làm mắt ở chợ', kind: 'risk', ax: { daoduc: -1, xuthe: 1 },
            gate: { truc: 'daoduc', max: 4, why: 'Bạn thấy việc rình người cùng chợ là phản bội, không nhận nổi.' },
            fx: { gold: 30, flag: 'tt_hoi' },
            tre: [{ sau: [48, 96], fx: { rep: { chinh: -1 } }, log: 'Có người trong chợ thấy bạn ghi chép cho hội. Từ đó không ai bán cho bạn món gì quý.' }],
            toi: 'ket:hoi' },
          { key: 'nhan_quan', label: 'Đứng tên sổ dân binh cho quan phủ', kind: 'pay', ax: { daoduc: 1, xuthe: -1 },
            fx: { rep: { chinh: 1 }, flag: 'tt_trieu' }, toi: 'ket:trieu' },
          { key: 'giu_tu_do', label: 'Từ chối cả ba, giữ tự do', kind: 'flee', ax: { tinh: 1, tudung: 1 },
            fx: { daoTam: 4, flag: 'tt_tu_do' }, toi: 'c5' }
        ]
      },
      c5: {
        t: 'Ngày trả nợ',
        d: 'Ân oán cũ dồn về một ngày. {an} đợi bạn ở quán trọ đầu thành. {lua} nhắn người đến, nói bạn còn một khoản chưa thanh. Không ai ép bạn chọn bên, nhưng tán tu cũng cần một kết cục cho chính mình.',
        khi: { realm: 2, sau: 6 }, han: 12, mac: 'bo_qua',
        lc: [
          { key: 'tra_no', label: 'Đứng ra giải quyết cả hai khoản nợ', kind: 'help', ax: { daoduc: 1, xuthe: 1 },
            wheel: {
              vung: [
                { w: 25, n: 'Bị nghiền giữa các thế lực', fx: { gold: -40, daoTam: -4, nghiep: 3 }, toi: 'ket:nghien' },
                { w: 45, n: 'Hòa giải, mỗi bên giữ một món nợ', fx: { daoTam: 2, rep: { chinh: 1 } }, toi: 'ket:hoa' },
                { w: 30, n: 'Trả hết nợ, tiếng vang khắp chợ', fx: { rep: { danh: 3 }, gold: 20 }, toi: 'ket:tu_do' }
              ],
              yeu_to: { loai: 'rel', vai: 'an', tran: 15 }, gia: 2
            } },
          { key: 'bo_qua', label: 'Bỏ đi, không đợi ai đòi nợ', kind: 'flee', ax: { tinh: 1, tudung: 1 },
            fx: { daoTam: 2 }, toi: 'ket:tu_do' }
        ]
      }
    },
    ket: {
      tu_do: { t: 'Tự do vang danh', kv: 1, log: 'Người chợ gọi bạn là "gió", vì không ai giữ được bạn lâu. Tiếng tăm ấy không nặng tay, nhưng cũng không bao giờ rơi.' },
      tong: { t: 'Sa vào một tông', kv: 0, log: 'Bạn mặc áo tông môn, học quy củ của người khác. Đêm nằm, bạn vẫn nhớ mùi gió sông, và tự hỏi mình đã đổi tự do lấy bữa cơm ấm.' },
      hoi: { t: 'Sa vào một hội', kv: 0, log: 'Bạn thành mắt của hội. Mỗi tháng nhận tiền đều đặn, đổi lại là bao nhiêu chuyện không dám nói cho ai.' },
      trieu: { t: 'Đứng tên sổ quan', kv: 0, log: 'Tên bạn nằm trong sổ dân binh. Có lúc được gọi đi đánh giặc, có lúc được gọi về, và lần nào bạn cũng nhớ mình từng là ai.' },
      nghien: { t: 'Bị nghiền giữa các thế lực', kv: 0, log: 'Bạn bị ép từ cả hai phía. Cuối cùng chỉ còn một cái bọc nhỏ trên lưng khi rời chợ.' },
      hoa: { t: 'Mỗi bên giữ một món nợ', kv: 1, log: 'Không ai thắng hẳn, không ai thua hẳn. Bạn đi với một món nợ nhỏ và một lời hứa, và đó là thứ bạn giữ kỹ nhất.' }
    }
  });
})();
