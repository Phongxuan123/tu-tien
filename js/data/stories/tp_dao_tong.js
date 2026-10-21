// Tuyến thân phận T2 "Dưới mái ngói sơn môn" (Q 11.0, gói N1). Thuần dữ liệu; khung ở js/data/story.js.
// Cờ mở 'dao_tong' (chưa có hệ nào gán): đúng khi đã vào tông (ngoại môn trở lên). Khi engine đọc được c.sect thì thay bằng điều kiện đó.
// Vai 'huynh' lấy người đồng kỳ (dong_ky); khi 9K xong thì ưu tiên người có ký ức chung.
(function () {
  const D = window.TT.data;

  D.STORY.reg({
    id: 'tp_dao_tong', n: 'Dưới mái ngói sơn môn', loai: 'tp',
    mo: { realm: 1, flag: 'dao_tong' },
    vai: { su: { pick: 'su', dung_moi: true }, huynh: { pick: 'dong_ky', dung_moi: true }, phan: { pick: 'gan', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Ngày đầu nhập môn',
        d: 'Bạn được xếp vào ngoại môn, ngủ chung phòng với mười đệ tử khác. {huynh} là người đầu tiên đưa bạn chiếc chăn dày hơn. Cũng hắn là người đầu tiên khẽ bảo: "Đừng đứng gần {phan}, kẻo rước họa vào thân."',
        khi: { sau: 1 }, han: 12, mac: 'theo_huynh',
        lc: [
          { key: 'theo_huynh', label: 'Theo {huynh} làm quen khắp ngoại môn', kind: 'safe', ax: { xuthe: 1 },
            fx: { rel: { vai: 'huynh', d: 12 }, daoTam: 1, flag: 'dt_huynh' }, toi: 'c2' },
          { key: 'can_phan', label: 'Đứng ra can {phan} khi hắn bắt nạt đệ tử mới', kind: 'help', ax: { daoduc: 2 },
            fx: { rel: { vai: 'phan', d: -8 }, daoTam: 2 },
            tre: [{ sau: [36, 72], fx: { rel: { vai: 'phan', d: -10 } }, log: '{phan} nhớ mặt bạn. Lần phát linh thảo cuối tháng, tên bạn bị xếp xuống cuối bảng.' }],
            toi: 'c2' },
          { key: 'im_lang', label: 'Cúi đầu, lo phần việc của mình', kind: 'safe', ax: { tudung: 1, tinh: 1 },
            fx: { daoTam: -1 },
            tre: [{ sau: [24, 48], fx: { rel: { vai: 'huynh', d: -6 } }, log: '{huynh} hỏi bạn có phải đã thấy chuyện bất bình mà làm ngơ không. Bạn đáp là không, và thấy câu đáp ấy nhạt nhẽo.' }],
            toi: 'c2' }
        ]
      },
      c2: {
        t: 'Thử luyện',
        d: 'Kỳ thử luyện đầu tiên: đệ tử cùng vào rừng sau núi hái linh thảo, ai về đủ số thì lên nội môn. Giữa đường, {huynh} sa vào bẫy đá cũ, gãy chân. Bạn còn đủ sức kéo hắn đi, nhưng như vậy sẽ mất suất lên nội môn.',
        khi: { realm: 1, sau: 3 }, han: 18, mac: 'nho_vay',
        lc: [
          { key: 'keo', label: 'Cõng {huynh} về, bỏ suất thăng tiến', kind: 'help', ax: { daoduc: 2, tinh: 1 },
            fx: { rel: { vai: 'huynh', d: 20 }, daoTam: 2, rep: { danh: 1 } }, toi: 'c3' },
          { key: 'bo_lai', label: 'Bỏ lại, tự hái đủ linh thảo về trước', kind: 'risk', ax: { xuthe: 2, daoduc: -1 },
            gate: { truc: 'daoduc', max: 5, why: 'Lòng bạn chưa đủ lạnh để bỏ người cùng khóa lại giữa rừng.' },
            fx: { xp: 0.1, rel: { vai: 'huynh', d: -15 }, flag: 'dt_bo_huynh' },
            tre: [{ sau: [12, 36], fx: { rel: { vai: 'huynh', d: -10 } }, log: '{huynh} được người khác cứu về. Tên bạn không bị ghi vào sổ phạt, nhưng ở ngoại môn, chuyện không ai nói ra vẫn lan đi.' }],
            toi: 'c3' },
          { key: 'nho_vay', label: 'Nhờ hai đệ tử khác khiêng về cùng', kind: 'safe', ax: { xuthe: 1 },
            fx: { gold: -5, rel: { vai: 'huynh', d: 4 } }, toi: 'c3' }
        ]
      },
      c3: {
        t: 'Bí mật trong thư phòng',
        d: 'Trong thư phòng ngoại môn, bạn thấy danh sách đệ tử mất tích năm trước, có con dấu của tông chủ. {su} bước vào, không hỏi bạn đã thấy gì, chỉ đặt tay lên vai bạn: "Có những chuyện, biết rồi thì phải gánh." {huynh} đứng ngoài cửa, chờ câu trả lời.',
        khi: { realm: 1, sau: 4 }, han: 12, mac: 'giu_kin',
        lc: [
          { key: 'giu_kin', label: 'Giữ kín, coi như không thấy gì', kind: 'safe', ax: { tudung: 1, tinh: 1 },
            fx: { daoTam: -2, rel: { vai: 'su', d: 8 }, flag: 'dt_kin' },
            tre: [{ sau: [60, 120], fx: { rel: { vai: 'su', d: 6 }, rep: { chinh: 1 } }, log: '{su} trao cho bạn một miếng ngọc bình an, bảo đó là phần thưởng cho sự im lặng năm ấy.' }],
            toi: 'c4' },
          { key: 'noi_ra', label: 'Đem chuyện nói với {huynh}', kind: 'risk', ax: { daoduc: 2, xuthe: -1 },
            fx: { rel: { vai: 'huynh', d: 10 }, flag: 'dt_noi' },
            tre: [{ sau: [18, 48], fx: { rel: { vai: 'su', d: -15 }, daoTam: -1 }, log: 'Tin lọt ra ngoài. {su} bị phạt quỳ trước cổng sơn môn ba ngày. Bạn không bị trách, nhưng đám đệ tử nhìn bạn khác đi.' }],
            toi: 'c4' },
          { key: 'doi_vang', label: 'Đòi tông trả vàng để im lặng', kind: 'pay', ax: { xuthe: 2, daoduc: -2 },
            gate: { truc: 'daoduc', max: 3, why: 'Bạn không đành đem sự im lặng ra đổi chác, dù số vàng có hấp dẫn đến đâu.' },
            fx: { gold: 40, rel: { vai: 'su', d: -10 }, rep: { danh: -1 }, flag: 'dt_doi_vang' },
            tre: [{ sau: [48, 96], fx: { nghiep: 2 }, log: 'Vàng tiêu hết, nhưng mỗi lần trong tông có chuyện không minh bạch, bạn là người đầu tiên bị nghi.' }],
            toi: 'c4' }
        ]
      },
      c4: {
        t: 'Đại bỉ và phe phái',
        d: 'Đại bỉ mùa thu chia tông thành hai phe. Phe {su} giữ nếp cũ; phe trưởng lão trẻ muốn mở cửa cho các nhà khác. Ai đứng về phía nào sẽ được nhớ rất lâu. Bạn được gọi lên đài, đối thủ là {huynh}.',
        khi: { realm: 2, sau: 6 }, han: 18, mac: 'thang_tay',
        lc: [
          { key: 'thang_tay', label: 'Nhường {huynh} một trận', kind: 'safe', ax: { daoduc: 1, xuthe: 1 },
            fx: { rel: { vai: 'huynh', d: 10 }, rep: { danh: -1 }, daoTam: 1 },
            tre: [{ sau: [12, 24], fx: { rel: { vai: 'su', d: -6 } }, log: 'Đám trưởng lão nhìn ra kẻ nhường, không ai nói thẳng, nhưng từ đó không ai gọi bạn đi theo nữa.' }],
            toi: 'c5' },
          { key: 'thang_that', label: 'Đánh hết sức, thắng gọn', kind: 'fight', ax: { xuthe: -1, tinh: -1 },
            gate: { truc: 'tinh', max: -2, why: 'Bạn điềm tĩnh, không muốn dồn người cùng khóa tới chỗ gục hẳn trên đài.' },
            fx: { rep: { danh: 2 }, rel: { vai: 'huynh', d: -20 }, nghiep: 1 },
            tre: [{ sau: [24, 60], fx: { rel: { vai: 'huynh', d: -10 } }, log: '{huynh} không còn đùa với bạn chuyện đài đấu, nhưng sáng nào cũng đến chào.' }],
            toi: 'c5' },
          { key: 'dung_phe', label: 'Đứng về phe trưởng lão trẻ', kind: 'risk', ax: { xuthe: 1, daoduc: -1 },
            fx: { rep: { chinh: 1 }, rel: { vai: 'su', d: -20 }, flag: 'dt_phe_tre' },
            tre: [{ sau: [36, 96], fx: { rel: { vai: 'phan', d: -10 } }, log: 'Sau đại bỉ, {phan} được ghế trong hội nghị tông. Hắn không gây sự với bạn, chỉ lặng lẽ không để tên bạn vào danh sách thi kế tiếp.' }],
            toi: 'c5' }
        ]
      },
      c5: {
        t: 'Mùa đông trong nhà chính',
        d: 'Tông chủ gọi bạn vào nhà chính. Ông hỏi bạn muốn ở lại, đi, hay chọn một con đường khác. Lời hỏi không có vẻ đe dọa, nhưng {phan} đứng sau cửa, và bạn nghe rõ tiếng hắn thở.',
        khi: { realm: 2, sau: 3 }, han: 12, mac: 'roi_tong',
        lc: [
          { key: 'o_lai', label: 'Ở lại, nhận việc tông giao', kind: 'help', ax: { xuthe: 1, daoduc: 1 },
            wheel: {
              vung: [
                { w: 15, n: 'Bị trục xuất, mang hận', fx: { rep: { danh: -2 }, nghiep: 2 }, toi: 'ket:tru_xuat' },
                { w: 25, n: 'Rời tông trong êm đẹp', fx: { daoTam: 2 }, toi: 'ket:roi_em' },
                { w: 35, n: 'Giữ ghế, nhưng mang cái giá', fx: { gold: -20, rel: { vai: 'phan', d: -10 } }, toi: 'ket:giu_ghe' },
                { w: 25, n: 'Được tin dùng, kế vị', fx: { rep: { danh: 3 }, rel: { vai: 'su', d: 15 } }, toi: 'ket:ke_vi' }
              ],
              yeu_to: { loai: 'rel', vai: 'su', tran: 15 }, gia: 3
            } },
          { key: 'roi_tong', label: 'Xin rời tông trong êm đẹp', kind: 'flee', ax: { tinh: 1, daoduc: 1 },
            fx: { flag: 'dt_roi' }, toi: 'ket:roi_em' },
          { key: 'to_cao', label: 'Tố cáo tông giấu chuyện đệ tử mất tích', kind: 'risk', ax: { daoduc: 2, xuthe: -2 },
            gate: { truc: 'daoduc', min: 3, why: 'Bạn chưa đủ gan để đứng ra tố cáo cả một tông môn.' },
            fx: { rep: { chinh: 2 }, nghiep: -1, flag: 'dt_to_cao' }, toi: 'ket:to_cao' }
        ]
      }
    },
    ket: {
      tru_xuat: { t: 'Trục xuất, mang hận', kv: 0, log: 'Cổng sơn môn đóng sau lưng bạn. Bạn mang theo một món hận, và nghe tiếng chuông ngoài núi đổi nhịp lúc nào không hay.' },
      roi_em: { t: 'Rời tông trong êm đẹp', kv: 0, log: 'Bạn xuống núi với bộ đồ cũ và tờ giấy chứng nhận ngoại môn. Không ai tiễn, nhưng cũng không ai níu.' },
      giu_ghe: { t: 'Giữ ghế, mang cái giá', kv: 0, log: 'Bạn ở lại, nhận việc mỗi ngày, và mỗi tháng nghe người ta xì xào sau lưng. Ghế của bạn vững, nhưng cái giá không nhỏ.' },
      ke_vi: { t: 'Được tin dùng, kế vị', kv: 1, log: 'Tông chủ trao cho bạn một tấm lệnh bài cũ. Tông môn có thêm một người gánh, và bạn cũng có thêm một người phải đề phòng.' },
      to_cao: { t: 'Tố cáo cả một tông', kv: 1, log: 'Chuyện được đưa ra trước chính đạo. Tông bị răn, và người mất tích được tìm lại đôi chút. Bạn không còn đường về sơn môn.' }
    }
  });
})();
