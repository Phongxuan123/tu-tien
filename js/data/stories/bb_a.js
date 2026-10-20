// Xương sống A "Phàm nhân hướng đạo", sáu mốc (Q 9.1; Z "Đặc tả 8B", 9A-d): A1 Mầm xanh, A2 Ngưỡng cửa, A3 Nền móng, A4 Vị thế, A5 Đạo quả, A6 Thiên môn.
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
    mo: { sau: 'bb_a1', hoac: [{ realm: 1 }, { age: 18 }] }, // Luyện Khí hoặc 18 tuổi, cái nào trước
    vai: { ban: { pick: 'gan', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Hai ngả',
        d: 'Luồng linh khí đầu tiên chạm vào kinh mạch: bạn hiểu mình vừa bước qua một ngưỡng không quay lại. Cũng ngày ấy tin quê báo về, ruộng mất mùa, nhà cần người làm. {ban} lại nói ở phương xa có người nhắc tới một cơ duyên, ai tới trước thì được.',
        d_pham: 'Mười tám tuổi, bạn vẫn chưa cảm được chút linh khí nào, mà cũng không nỡ bỏ ý định tu hành. Cũng dạo ấy tin quê báo về, ruộng mất mùa, nhà cần người làm. {ban} lại nói ở phương xa có người nhắc tới một cơ duyên, ai tới trước thì được. Đi hay ở, bạn phải chọn.',
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
    mo: { sau: 'bb_a2', hoac: [{ realm: 1, stage: 1 }, { age: 35 }] }, // Luyện Khí trung kỳ hoặc 35 tuổi, cái nào trước
    vai: { dich: { pick: 'dong_ky', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Kẻ xin tha',
        d: 'Tu vi đã có nền, đạo tâm bạn mới bắt đầu bị thử. Trên đường về, bạn gặp {dich}, người đồng kỳ từng tranh với bạn một món cơ duyên, nay nằm bên đường thương nặng. Hắn thở dốc, bảo hắn sai rồi, xin bạn tha. Chỉ cần một nhát, mối họa này chấm dứt. Nhưng kẻ trước mặt bạn thật sự đang hối.',
        d_pham: 'Ba mươi lăm tuổi, bạn vẫn là người thường, nhưng đạo tâm bắt đầu bị thử. Trên đường về, bạn gặp {dich}, người từng tranh với bạn một món cơ duyên, nay nằm bên đường thương nặng. Hắn thở dốc, bảo hắn sai rồi, xin bạn tha. Chỉ cần một nhát, mối họa này chấm dứt. Nhưng kẻ trước mặt bạn thật sự đang hối.',
        khi: { sau: 1 }, han: 18, mac: 'ne',
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
        d: 'Đêm nào bạn cũng thấy lại cảnh ấy. Tâm ma không hung dữ, nó chỉ khẽ hỏi: nếu đã khác đi thì bạn còn là bạn không? Nền móng không giải được câu này thì đạo tâm sẽ mòn dần, không cần ai ra tay.',
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

  // A4 Vị thế (Q 9.1): biến cố thế giới kéo vào. Trúc Cơ hoặc 55 tuổi.
  D.STORY.reg({
    id: 'bb_a4', n: 'Vị thế', loai: 'bb',
    mo: { sau: 'bb_a3', hoac: [{ realm: 2 }, { age: 55 }] }, // Trúc Cơ hoặc 55 tuổi, cái nào trước
    vai: { quen: { pick: 'gan', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Cơn sóng đổi thế cuộc',
        d: 'Chiến sự lan tới vùng bạn đang ở, quan binh và các tông môn đều cử người đi chiêu mộ người tài. {quen}, người quen lâu năm của bạn, tìm đến, bảo ai cũng phải chọn một phía vì đứng giữa cũng là một cách chọn. Đạo hạnh của bạn giờ đã đủ để người ta nhìn tới.',
        d_pham: 'Đến tuổi này bạn đã quen mặt cả vùng. Chiến sự lan tới, quan binh về làng chiêu người, tông môn cũng cử kẻ đi dò xét. {quen}, người quen lâu năm, tìm đến bảo ai cũng phải chọn một phía vì đứng giữa cũng là một cách chọn.',
        khi: { sau: 1 }, han: 18, mac: 'dung_ngoai',
        lc: [
          { key: 'chon_phe', label: 'Đứng về phía người đang cần mình', kind: 'fight', ax: { daoduc: 1, xuthe: -1 },
            fx: { rep: { danh: 2 }, rel: { vai: 'quen', d: 15 }, daoTam: 1, flag: 'a4_phe' },
            tre: [{ sau: [24, 72], fx: { rep: { chinh: 1 }, rel: { vai: 'quen', d: 8 } }, log: 'Người từng được bạn che chở nhắc tên bạn trong buổi tế cuối năm. Không ai bắt họ làm vậy.' }],
            toi: 'c2' },
          { key: 'dung_ngoai', label: 'Đóng cửa đứng ngoài cuộc', kind: 'safe', ax: { tinh: 1, tudung: 1 },
            fx: { daoTam: 1, flag: 'a4_ngoai' },
            tre: [{ sau: [36, 96], fx: { rep: { danh: -1 } }, log: 'Mùa đói tới, có người nói bạn từng làm ngơ lúc cả vùng cần một bàn tay. Bạn nghe được, không biện bạch.' }],
            toi: 'c2' },
          { key: 'loi_dung', label: 'Nhân thế loạn mà kiếm lợi', kind: 'risk', ax: { daoduc: -2, xuthe: 1 },
            gate: { truc: 'daoduc', max: 7, why: 'Bạn nhân hậu tới mức không nỡ trục lợi trên đầu kẻ khác.' },
            fx: { gold: 80, nghiep: 3, rep: { danh: -1 }, flag: 'a4_loi' },
            tre: [{ sau: [36, 96], fx: { hp: -12, rep: { chinh: -1 } }, log: 'Một kẻ từng chịu thiệt vì bạn tìm đến tận cửa, mắt đỏ ngầu. Bạn thoát, nhưng ai cũng biết chuyện.' }],
            toi: 'c2' }
        ]
      },
      c2: {
        t: 'Khi khói tan',
        d: 'Cơn loạn đã yên, người ta bắt đầu kể lại chuyện cũ theo cách riêng của họ. Có kẻ muốn ghi công, có kẻ muốn tính nợ, và bạn phải quyết định mình đứng ở đâu trong những lời kể ấy.',
        khi: { sau: 6 }, han: 12, mac: 'tu_choi',
        lc: [
          { key: 'nhan_danh', label: 'Nhận lấy tiếng tăm người ta gán cho', kind: 'safe', ax: { xuthe: 1 },
            fx: { rep: { danh: 1 } }, toi: 'ket:danh' },
          { key: 'tu_choi', label: 'Từ chối mọi lời khen, lặng lẽ rút về', kind: 'safe', ax: { tinh: 1, tudung: 1 },
            fx: { daoTam: 2 }, toi: 'ket:lang' },
          { key: 'tra_no', label: 'Dốc vàng gỡ oán, trả ơn cho xong', kind: 'pay', ax: { daoduc: 1 }, gia: { gold: 40 },
            fx: { nghiep: -2, rep: { chinh: 1 } }, toi: 'ket:sach_no' }
        ]
      }
    },
    ket: {
      danh: { t: 'Có tên trong chuyện cũ', kv: 0, log: 'Tên bạn được truyền miệng, lúc khen lúc chê. Bạn hiểu rằng danh tiếng không phải của mình, nó chỉ là bóng của mình trên lời người khác.' },
      lang: { t: 'Lặng lẽ rút về', kv: 0, log: 'Bạn khép cửa, để chuyện cũ trôi theo sương. Có người cho là cao nhân, có người cho là kẻ nhát, bạn không đính chính bên nào.' },
      sach_no: { t: 'Nợ đã sạch', kv: 0, log: 'Bạn trả xong những gì phải trả. Nhẹ túi hơn, nhưng đêm ngủ cũng yên hơn nhiều.' }
    }
  });

  // A5 Đạo quả (Q 9.1): thu đồ, lập nghiệp, đồng kỳ trở lại. Tuổi 75 hoặc Kim Đan.
  D.STORY.reg({
    id: 'bb_a5', n: 'Đạo quả', loai: 'bb',
    mo: { sau: 'bb_a4', hoac: [{ age: 75 }, { realm: 3 }] }, // 75 tuổi hoặc Kim Đan, cái nào trước
    vai: { tro: { pick: 'gan', dung_moi: true }, cu: { pick: 'dong_ky', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Người xin học',
        d: 'Một buổi sáng, {tro} quỳ trước cửa động phủ của bạn, xin được nhận làm đồ đệ. Người ấy không có tư chất hơn người, chỉ có một lòng bền bỉ. Cùng ngày, thư của {cu}, người đồng kỳ năm xưa, báo sắp trở lại vùng này.',
        d_pham: 'Một buổi sáng, {tro} đứng trước cửa nhà bạn, xin được học nghề và học cả cách sống từ bạn. Người ấy không giỏi giang gì, chỉ có một lòng bền bỉ. Cùng ngày, thư của {cu}, bạn cũ năm xưa, báo sắp trở lại vùng này.',
        khi: { sau: 1 }, han: 18, mac: 'doc_hanh',
        lc: [
          { key: 'thu_do', label: 'Nhận {tro} làm đồ đệ', kind: 'help', ax: { daoduc: 1, xuthe: -1 },
            fx: { rel: { vai: 'tro', d: 25 }, daoTam: 1, flag: 'a5_do' },
            tre: [{ sau: [36, 120], fx: { rep: { danh: 1 }, rel: { vai: 'tro', d: 10 } }, log: '{tro} làm nên chuyện nhỏ ở một nơi xa, người ta hỏi nghe ai dạy mà khéo thế. Cái tên bạn được nhắc lại.' }],
            toi: 'c2' },
          { key: 'lap_nghiep', label: 'Dựng một mái nhà cho người đến sau', kind: 'pay', ax: { xuthe: 1, daoduc: 1 }, gia: { gold: 60 },
            fx: { rep: { danh: 2 }, daoTam: 1, flag: 'a5_nghiep' },
            tre: [{ sau: [24, 96], fx: { gold: 50 }, log: 'Mái nhà bạn dựng có người ghé nghỉ rồi để lại chút bạc tạ ơn. Bạn không đòi, và đó là điều lạ nhất.' }],
            toi: 'c2' },
          { key: 'doc_hanh', label: 'Từ chối, giữ lối độc hành', kind: 'safe', ax: { tudung: 1, tinh: 1 },
            fx: { daoTam: 2, xp: 0.05, flag: 'a5_doc' }, toi: 'c2' }
        ]
      },
      c2: {
        t: 'Bạn cũ trở lại',
        d: '{cu} tới, tóc đã điểm bạc, mang theo một gói quà nhỏ và nhiều chuyện chưa nói hết. Hai người từng tranh nhau, từng cứu nhau, và giờ ngồi đối diện mà chẳng ai biết bắt đầu từ đâu. Thời gian không còn nhiều để chần chừ.',
        khi: { sau: 6 }, han: 18, mac: 'quay_di',
        lc: [
          { key: 'giu_nghiep', label: 'Cùng {cu} gây dựng nghiệp chung', kind: 'help', ax: { xuthe: 1, daoduc: 1 },
            fx: { rel: { vai: 'cu', d: 18 }, rep: { danh: 1 } }, toi: 'ket:lap_nghiep' },
          { key: 'giao_lai', label: 'Giao lại những gì mình có cho đời sau', kind: 'help', ax: { daoduc: 2 },
            fx: { daoTam: 3, rel: { vai: 'cu', d: 8 } }, toi: 'ket:nhuong' },
          { key: 'quay_di', label: 'Tiễn {cu} đi, tiếp tục một mình', kind: 'safe', ax: { tinh: 1, tudung: 1 },
            fx: { daoTam: 2 }, toi: 'ket:doc_hanh' }
        ]
      }
    },
    ket: {
      lap_nghiep: { t: 'Một cơ nghiệp nhỏ', kv: 1, log: 'Bạn và {cu} dựng nên một nơi để người sau có chỗ nương. Nó không lớn, nhưng đủ khiến bạn nghĩ mình không đi qua đời này vô ích.' },
      nhuong: { t: 'Trao lại cho đời sau', kv: 1, log: 'Bạn đặt hết vào tay người đến sau, không giữ gì cho mình. Nhẹ đến lạ, như vừa trút được chiếc gánh đã mang nhiều năm.' },
      doc_hanh: { t: 'Một mình trên đường', kv: 0, log: 'Bạn tiễn bạn cũ ra tới đầu ngõ, vẫy tay. Con đường phía trước chỉ còn bạn đi, và bạn thấy quen với điều đó.' }
    }
  });

  // A6 Thiên môn (Q 9.1): kết đời. Hóa Thần hoặc đã già tới mức thọ sắp cạn (xấp xỉ 117 tuổi, 10% thọ Luyện Khí).
  D.STORY.reg({
    id: 'bb_a6', n: 'Thiên môn', loai: 'bb',
    mo: { sau: 'bb_a5', hoac: [{ realm: 5 }, { age: 117 }] },
    vai: { ke: { pick: 'gan', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Cánh cửa cuối cùng',
        d: 'Bạn nghe trong người có một tiếng nứt rất khẽ, như cánh cửa cũ bị gió lay. Thiên kiếp, hay thọ nguyên, hay cả hai, đang đứng ở ngưỡng cửa chờ bạn. Mọi nhân quả đã gieo suốt đời này sắp đến lúc được gặt.',
        d_pham: 'Bạn thấy mình ngày một chậm đi, tiếng thở cũng khẽ hơn xưa. Trong đêm tĩnh, bạn nghe thấy một tiếng gọi rất xa, không biết của đất hay của trời. Mọi nhân quả đã gieo suốt đời này sắp đến lúc được gặt.',
        khi: { sau: 1 }, han: 24, mac: 'an_the',
        lc: [
          { key: 'vuot_kiep', label: 'Tiến thẳng vào cánh cửa', kind: 'risk', ax: { tudung: 1, tinh: -1 }, fx: {},
            wheel: {
              vung: [
                { w: 20, n: 'Đọa ma', fx: { nghiep: 6, daoTam: -15, hp: -30 }, toi: 'ket:doa_ma' },
                { w: 25, n: 'Ẩn thế', fx: { daoTam: 3 }, toi: 'ket:an_the' },
                { w: 30, n: 'Tọa hóa để lại truyền thừa', fx: { rep: { danh: 2 } }, toi: 'ket:toa_hoa' },
                { w: 25, n: 'Phi thăng', fx: { daoTam: 10, xp: 0.3 }, toi: 'ket:phi_thang' }
              ],
              yeu_to: { loai: 'nature', truc: 'daoduc', huong: 1, tran: 12 }, gia: 4
            } },
          { key: 'toa_hoa', label: 'Chủ động tọa hóa, để lại truyền thừa', kind: 'help', ax: { daoduc: 1, xuthe: -1 },
            fx: { rep: { danh: 1 }, daoTam: 3, flag: 'a6_toa_hoa' }, toi: 'c2' },
          { key: 'an_the', label: 'Lánh vào nơi vắng, bỏ mặc thiên môn', kind: 'flee', ax: { tinh: 1, xuthe: 1 },
            fx: { daoTam: 2, flag: 'a6_an_the' },
            tre: [{ sau: [24, 60], fx: { rep: { danh: -1 } }, log: 'Tin về bạn thưa dần rồi tắt hẳn. Người ta nói về bạn như nói về một ngọn núi xa: biết có, không biết ở đâu.' }],
            toi: 'ket:an_the' }
        ]
      },
      c2: {
        t: 'Lời di nguyện',
        d: 'Bạn cho gọi {ke}, người sẽ tiếp nối những gì bạn để lại. Những điều bạn biết, những nợ bạn mang, những hối tiếc bạn chưa nói với ai, tất cả cần được đặt xuống trước khi nhắm mắt.',
        khi: { sau: 2 }, han: 12, mac: 'chon_loc',
        lc: [
          { key: 'truyen_het', label: 'Truyền hết cho {ke}, không giữ lại gì', kind: 'help', ax: { daoduc: 2 },
            fx: { rel: { vai: 'ke', d: 25 }, nghiep: -2 }, toi: 'ket:toa_hoa' },
          { key: 'chon_loc', label: 'Chỉ để lại vài điều, giấu phần còn lại', kind: 'safe', ax: { xuthe: 1, tinh: 1 },
            fx: { rel: { vai: 'ke', d: 8 } }, toi: 'ket:toa_hoa_kin' }
        ]
      }
    },
    ket: {
      doa_ma: { t: 'Đọa ma', kv: 0, log: 'Nhân quả cũ ập xuống cùng lúc. Bạn không còn nhận ra tiếng mình trong cơn gió, chỉ còn hơi lạnh của chấp niệm bám vào xương.' },
      an_the: { t: 'Ẩn thế', kv: 1, log: 'Bạn khép cửa động, để thiên hạ quên tên mình. Trời đất vẫn ở đó, bạn vẫn ở đó, chỉ không ai còn gọi.' },
      toa_hoa: { t: 'Tọa hóa, để lại truyền thừa', kv: 2, log: 'Bạn tọa hóa trong yên tĩnh, để lại những gì đáng để lại. Người sau nhận lấy, và bạn thôi lo nghĩ.' },
      toa_hoa_kin: { t: 'Tọa hóa, giữ một bí mật', kv: 1, log: 'Bạn nhắm mắt, mang theo điều chưa kể. Người sau nhận phần được trao và tự đoán phần còn thiếu.' },
      phi_thang: { t: 'Phi thăng', kv: 2, log: 'Cánh cửa mở ra, bạn bước qua mà không ngoái lại. Phía sau là cả một đời, phía trước là điều chưa ai kể được.' }
    }
  });
})();
