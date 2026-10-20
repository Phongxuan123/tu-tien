// Xương sống A "Phàm nhân hướng đạo", ba mốc đầu (Q 9.1; Z "Đặc tả 8B"): A1 Mầm xanh, A2 Ngưỡng cửa, A3 Nền móng.
// Thuần dữ liệu; xem khung ở js/data/story.js. Giọng đời thường pha nhẹ, nghiêm ở chuyện lớn (A3).
(function () {
  const D = window.TT.data;

  D.STORY.reg({
    id: 'bb_a1', n: 'Mầm xanh', loai: 'bb',
    mo: { age: 12 },
    vai: { dan: { pick: 'su', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Người dẫn đường',
        d: 'Mười hai tuổi, bạn đã đủ lớn để nghe người ta bàn chuyện tu hành. {dan}, người trong vùng có chút đạo hạnh, nhìn bạn khá lâu rồi hỏi bạn có muốn học đường nhập môn không. Con đường này bước lên rồi thì khó quay lại.',
        khi: { sau: 1 }, han: 12, mac: 'tu_hoc',
        lc: [
          { key: 'theo_su', label: 'Xin theo {dan} học đạo', kind: 'help', ax: { daoduc: 1, xuthe: 1 },
            fx: { rel: { vai: 'dan', d: 18 }, daoTam: 2, flag: 'a1_su' }, toi: 'c2' },
          { key: 'xin_tong', label: 'Nộp lễ xin vào một tông môn nhỏ', kind: 'pay', ax: { xuthe: 2 }, gia: { gold: 10 },
            fx: { rep: { danh: 1 }, xp: 0.1, flag: 'a1_tong' }, toi: 'c2' },
          { key: 'tu_hoc', label: 'Từ chối, tự học theo sách cũ', kind: 'risk', ax: { tudung: 2, xuthe: -1 },
            fx: { daoTam: 3, xp: 0.05, flag: 'a1_tu' }, toi: 'c2' }
        ]
      },
      c2: {
        t: 'Đêm đầu tiên nản lòng',
        d: 'Mấy tháng đầu, bạn chẳng thấy linh khí đâu, chỉ thấy đau lưng mỏi gối. Đêm nay mưa dột, chăn lạnh, bạn tự hỏi liệu mình có đang đuổi theo một giấc mơ hão. Chuyện này không ai gánh thay bạn được.',
        khi: { sau: 8 }, han: 18, mac: 'hoi_thay',
        lc: [
          { key: 'cam_rang', label: 'Cắn răng ngồi tiếp tới sáng', kind: 'safe', ax: { tudung: 2 },
            gate: { truc: 'tudung', min: -8, why: 'Bạn buông thả quá, khó mà ngồi nổi cả đêm.' },
            fx: { daoTam: 3, xp: 0.08 }, toi: 'ket:vung' },
          { key: 'hoi_thay', label: 'Sáng ra chạy sang nhà {dan} xin lời khuyên', kind: 'help', ax: { daoduc: 1 },
            fx: { rel: { vai: 'dan', d: 8 }, daoTam: 1 }, toi: 'ket:co_thay' },
          { key: 'bo_cuoc', label: 'Bỏ hẳn, đi chơi cho khuây', kind: 'flee', ax: { tudung: -2, tinh: 1 },
            gate: { truc: 'tudung', max: 5, why: 'Bạn khắc kỷ quá, đã nhóm lửa thì khó mà bỏ ngang.' },
            fx: { daoTam: -3 }, toi: 'ket:buong' }
        ]
      }
    },
    ket: {
      vung: { t: 'Bước chân đầu vững', kv: 0, log: 'Mầm xanh qua được đêm mưa đầu tiên. Bạn thôi hỏi mình có hợp với con đường này không, chỉ hỏi mai ngồi bao lâu.' },
      co_thay: { t: 'Có người đỡ lưng', kv: 0, log: 'Lời của {dan} không thần kỳ, nhưng sau bữa cháo nóng bạn thấy việc tu hành bớt cô độc đi nhiều.' },
      buong: { t: 'Buông rồi nhặt lại', kv: 0, log: 'Bạn bỏ cuộc được ba hôm rồi lại lẳng lặng ngồi xuống chỗ cũ. Chẳng ai nhắc, mà bạn thì nhớ.' }
    }
  });

  D.STORY.reg({
    id: 'bb_a2', n: 'Ngưỡng cửa', loai: 'bb',
    mo: { sau: 'bb_a1', realm: 1 },
    vai: { ban: { pick: 'gan', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Hai ngả',
        d: 'Luồng linh khí đầu tiên chạm vào kinh mạch: bạn hiểu mình vừa bước qua một ngưỡng không quay lại. Cũng ngày ấy tin quê báo về, ruộng mất mùa, nhà cần người làm. {ban} lại nói ở phương xa có người nhắc tới một cơ duyên, ai tới trước thì được.',
        khi: { sau: 1 }, han: 18, mac: 'o_lai',
        lc: [
          { key: 'o_lai', label: 'Về quê giúp nhà qua mùa này', kind: 'help', ax: { daoduc: 2 },
            fx: { daoTam: 1, rel: { vai: 'ban', d: 10 }, flag: 'a2_nha' },
            tre: [{ sau: [48, 96], fx: { daoTam: 2 }, log: 'Đến mùa gặt, bạn chợt nhớ cánh đồng năm cũ và thấy lòng ấm lại. Việc đáng làm thì ít khi làm uổng.' }],
            toi: 'c2' },
          { key: 'roi_que', label: 'Rời quê theo tin cơ duyên', kind: 'risk', ax: { tinh: -1, xuthe: -1 },
            gate: { truc: 'daoduc', max: 8, why: 'Lòng bạn nặng tình nhà tới mức không nỡ đi.' },
            fx: { xp: 0.12, daoTam: -1, flag: 'a2_di' },
            tre: [{ sau: [36, 84], fx: { rel: { vai: 'ban', d: -12 } }, log: 'Một lá thư từ quê tới muộn, chỉ có vài dòng ngắn: nhà vẫn ổn, nhưng không ai nhắc tên bạn trong thư. Bạn đọc lại hai lần.' }],
            toi: 'c2' },
          { key: 'dua_nha', label: 'Đưa cả nhà cùng đi', kind: 'pay', ax: { xuthe: 1, daoduc: 1 }, gia: { gold: 30 },
            fx: { rep: { danh: 1 }, daoTam: 2, flag: 'a2_ca_nha' }, toi: 'c2' }
        ]
      },
      c2: {
        t: 'Cái giá của lựa chọn',
        d: 'Bạn đã chọn, và cái giá của lựa chọn ấy bắt đầu hiện hình. Không ai bắt bạn phải nói ra, nhưng đêm nay bạn cần quyết định sẽ mang chuyện này theo mình bằng cách nào.',
        khi: { sau: 6 }, han: 12, mac: 'ghi_nho',
        lc: [
          { key: 'ghi_nho', label: 'Ghi nhớ trong lòng rồi tu tiếp', kind: 'safe', ax: { tudung: 1 }, fx: { daoTam: 2 }, toi: 'ket:vung' },
          { key: 'viet_thu', label: 'Viết một lá thư gửi {ban}', kind: 'help', ax: { daoduc: 1 }, fx: { rel: { vai: 'ban', d: 8 } }, toi: 'ket:co_thu' }
        ]
      }
    },
    ket: {
      vung: { t: 'Đứng vững trên ngưỡng cửa', kv: 0, log: 'Bạn bước hẳn vào con đường tu hành, mang theo một chuyện nhà không nói ra. Có những thứ chỉ cất được, không bỏ được.' },
      co_thu: { t: 'Còn một sợi dây', kv: 0, log: 'Thư gửi đi, chưa chắc có thư về, nhưng sợi dây với người quen cũ chưa đứt hẳn.' }
    }
  });

  D.STORY.reg({
    id: 'bb_a3', n: 'Nền móng', loai: 'bb',
    mo: { sau: 'bb_a2', realm: 2 },
    vai: { dich: { pick: 'dong_ky', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Kẻ xin tha',
        d: 'Trúc Cơ thành rồi, đạo tâm bạn mới bắt đầu bị thử. Trên đường về, bạn gặp {dich}, người đồng kỳ từng tranh với bạn một món cơ duyên, nay nằm bên đường thương nặng. Hắn thở dốc, bảo hắn sai rồi, xin bạn tha. Chỉ cần một nhát, mối họa này chấm dứt. Nhưng kẻ trước mặt bạn thật sự đang hối.',
        khi: { realm: 2, sau: 1 }, han: 18, mac: 'ne',
        lc: [
          { key: 'tha', label: 'Tha cho {dich}', kind: 'help', ax: { daoduc: 2 },
            gate: { truc: 'daoduc', min: -6, why: 'Lòng bạn cứng như đá, nhìn hắn chỉ thấy mối họa chưa dứt. Bạn không tha nổi.' },
            fx: { nghiep: -3, daoTam: -1, rep: { chinh: 2 }, rel: { vai: 'dich', d: 20 }, flag: 'a3_tha' },
            tre: [{ sau: [36, 120], fx: { gold: 40, rel: { vai: 'dich', d: 15 } }, log: '{dich} tìm tới, đặt xuống một túi nhỏ: "Mạng này ta nhớ." Hắn không nói thêm gì, mà bạn biết lời ấy là thật.' }],
            toi: 'c2' },
          { key: 'giet', label: 'Ra tay, không để lại hậu họa', kind: 'fight', ax: { daoduc: -2, tinh: -1 },
            gate: { truc: 'daoduc', max: 6, why: 'Bạn nhân hậu quá, tay không nâng nổi lưỡi kiếm.' },
            fx: { nghiep: 5, daoTam: 2, rep: { chinh: -3 }, rel: { vai: 'dich', d: -40 }, flag: 'a3_giet' },
            tre: [{ sau: [24, 96], fx: { hp: -15 }, log: 'Một người lạ mặt đầy hận tìm tới, tự xưng thân nhân của kẻ bạn đã giết. Bạn thoát được, nhưng không nhẹ nhõm.' }],
            toi: 'c2' },
          { key: 'ne', label: 'Quay đi như không thấy gì', kind: 'flee', ax: { tinh: 1, tudung: -1 },
            fx: { daoTam: -2, flag: 'a3_ne' }, toi: 'c2' }
        ]
      },
      c2: {
        t: 'Tâm ma',
        d: 'Đêm nào bạn cũng thấy lại cảnh ấy. Tâm ma không hung dữ, nó chỉ khẽ hỏi: nếu đã khác đi thì bạn còn là bạn không? Trúc Cơ không giải được câu này thì đạo tâm sẽ mòn dần, không cần ai ra tay.',
        khi: { sau: 3 }, han: 24, mac: 'tranh',
        lc: [
          { key: 'doi_mat', label: 'Ngồi xuống đối mặt với nó', kind: 'risk', ax: { tudung: 1 }, fx: {},
            wheel: {
              vung: [
                { w: 25, n: 'Tâm ma thắng thế', fx: { daoTam: -8, hp: -20, nghiep: 2 }, toi: 'ket:sa' },
                { w: 45, n: 'Vượt qua nhưng mang sẹo', fx: { daoTam: 2, xp: 0.1 }, toi: 'ket:qua_gia' },
                { w: 30, n: 'Tâm sáng như gương', fx: { daoTam: 6, xp: 0.2 }, toi: 'ket:sang' }
              ],
              yeu_to: { loai: 'nature', truc: 'tudung', huong: 1, tran: 15 }, gia: 3
            } },
          { key: 'tranh', label: 'Bế quan, không nghĩ tới chuyện ấy nữa', kind: 'safe', ax: { tinh: 1 },
            fx: { daoTam: -3, xp: 0.05 }, toi: 'ket:tranh' }
        ]
      }
    },
    ket: {
      sa: { t: 'Sa vào tâm ma', kv: 0, log: 'Bạn gục xuống trong bóng tối của chính mình. Sáng ra bạn vẫn là bạn, chỉ là nhẹ đi một góc đạo tâm không biết có tìm lại được không.' },
      qua_gia: { t: 'Qua được, mang sẹo', kv: 1, log: 'Bạn đứng dậy khi trời hửng. Vết sẹo trong lòng vẫn còn, nhưng giờ bạn biết chỗ nào dễ đau và đừng giẫm vào đó.' },
      sang: { t: 'Tâm sáng như gương', kv: 1, log: 'Bạn nhìn thẳng vào nó và nó lui đi. Từ nay nền móng của bạn vững hơn nhiều người cùng cảnh giới.' },
      tranh: { t: 'Né, chưa giải', kv: 0, log: 'Bạn đóng cửa bế quan, ép mình quên. Chuyện ấy không biến mất, chỉ nằm chờ ở một chỗ tối hơn.' }
    }
  });
})();
