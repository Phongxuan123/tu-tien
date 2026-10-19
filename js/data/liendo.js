// Liên tông (S8, ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 9): tầng thứ ba của mạng quan hệ S1, cắm vào S1 đến S7.
// Tông ↔ triều (vai trò), ước pháp của minh ước, giải đấu 4 hoặc 10 năm, đại chiến liên tông, Thiên hạ công ước.
// Mọi hệ số ở đây chỉnh được; hệ thống ở js/systems/inter.js. Tên cổ trang, không dùng tên nước thật.
// D.INTERSECT.on = false thì mọi thứ trong file này tắt, thế giới trùng khít mốc trước S8 (xem tools/baseline.js --intersect=off).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.INTERSECT = {
    on: true,
    // ----- Vai trò của tông với triều vùng nó đặt (một tông mạnh nhất mỗi vùng giữ vai trò) -----
    roles: {
      tu_do: { n: 'Tự do', desc: 'tông giữ nếp cũ, không ràng buộc với triều.' },
      quoc_su: { n: 'Quốc sư', desc: 'giữ pháp trận của nước; quân trận của triều được thêm sức.' },
      cung_phung: { n: 'Cung phụng', desc: 'nhận bổng từ kho triều; lúc kế vị có thể nâng người của mình lên ngôi.' },
      ngoai_phap: { n: 'Ngoài vòng pháp luật', desc: 'không chịu triều quản; buôn lậu ngầm, hoàng quyền triều bị bào mòn.' }
    },
    role: {
      coop: 0.06,                                 // mỗi năm: tông tự do được mời (triều đủ mạnh, tông đủ giàu và mạnh)
      coopHq: 50, coopPower: 35, coopWealth: 40,
      quocSu: 60, quocSuMin: 45,                  // sức mạnh để làm quốc sư (và dưới mức này thì rút về tự do)
      fallHq: 35, fallP: 0.1,                     // triều yếu hoặc đổi quốc sách cấm: quốc sư, cung phụng có thể rút về tự do
      armyBonus: 0.06,                            // quốc sư: hệ số quân lực của triều (army.mul) nhân thêm
      drain: 1                                    // ngoài vòng pháp luật: hoàng quyền triều giảm mỗi năm
    },
    outlaw: { p: 0.04, power: 62, hq: 35 },        // tông mạnh, triều yếu: có thể thành ngoài vòng pháp luật
    punish: { p: 0.25, hq: 50, power: 8, wealth: 5 }, // triều đủ mạnh thì trừng phạt, tông trở về tự do
    bong: { rate: 0.04, strain: 6 },              // cung phụng: triều trả bổng qua hiệp ước `bong`
    // ----- Tông thao túng kế vị (S7): nâng người của mình; chịu phản phệ khi quốc vận triều còn cao -----
    manip: { power: 50, p: 0.5, vanBack: 45, unity: 10, cost: 5, rel: -20, gain: 3 },
    // ----- Minh ước liên tông: ước pháp (cùng phòng thủ, chia mỏ, cho mượn đệ tử) trên hiệp ước minh_uoc sẵn có -----
    uoc: { min: 40, keep: 20, p: 0.2, help: 0.1, share: 0.5, lend: 0.5 },
    // ----- Giải đấu liên tông: chu kỳ 4 hoặc 10 năm; bảo trợ bởi triều mạnh nhất hoặc minh chủ -----
    giai: {
      cycles: [4, 10], min: 30, max: 8,
      power: 3, unity: 4,                         // thắng: sức mạnh và đoàn kết tăng
      quocSuBonus: 5, entryBonus: 4,              // điểm cộng khi bốc thăm
      tuCachYears: 10,                            // tư cách minh chủ kéo dài
      rel: 8                                      // quan hệ với bên bảo trợ
    },
    // ----- Đại chiến liên tông: chiến tranh giữa hai tông mà triều đứng ngoài hoặc nhúng tay -----
    war: {
      gap: 150,                                   // tối đa một đại chiến liên tông mỗi 150 năm
      hqNhung: 55, hqBoth: 65,                    // hoàng quyền đủ để cho mượn quân, đánh cả hai
      nhung: 0.4, cam: 0.25, both: 0.1,           // xác suất (băm): cho mượn quân, cấm vận, đánh cả hai; còn lại đứng ngoài
      bias: 2.5,                                  // cho mượn quân: điểm chiến cộng mỗi năm về phía bên được giúp
      embargo: 2, bothCost: 1.5,                  // cấm vận: kho hai bên mỗi năm; đánh cả hai: sức mạnh hai bên mỗi năm
      hqLoss: 2,                                  // triều mất uy mỗi đại chiến
      lienLuy: -12                                // đồng minh của bên thua thù với bên thắng
    },
    // ----- Thiên hạ công ước: tông (quốc sư, cung phụng) và triều ký, cấm tu sĩ cao đánh phàm -----
    cong: { p: 0.08, power: 8, unity: 10, allyRel: -20 }, // vi phạm: tông bị truy cứu, đồng minh tông ghét
    // Cách gọi trong game
    stance: { nhung_tay: 'cho mượn quân', cam_van: 'cấm vận', danh_ca_hai: 'đánh cả hai', dung_ngoai: 'đứng ngoài' }
  };

  // Loại ân oán mới (sổ ân oán của diplo, S1).
  Object.assign(D.DIPLO.kinds, {
    giai_thang: { n: 'Thắng giải đấu liên tông', tone: 'good', tin: 6 },
    thao_tung: { n: 'Thao túng kế vị', tone: 'bad', tin: -8 },
    cong_uoc: { n: 'Ký Thiên hạ công ước', tone: 'good', tin: 4 },
    vi_uoc: { n: 'Vi phạm Thiên hạ công ước', tone: 'bad', tin: -15 },
    lien_luy: { n: 'Liên lụy đại chiến', tone: 'bad' }
  });
  Object.assign(D.DIPLO.pactLabel, {
    bong: ['trả bổng cho', 'nhận bổng từ'],
    uoc_phap: ['ước pháp với', 'ước pháp với']
  });
  // Hai loại hiệp ước mới: bổng cung phụng (triều trả tông) và ước pháp (giữa hai tông minh ước).
  Object.assign(D.PACT.kinds, {
    bong: { n: 'Bổng cung phụng', what: 'trả bổng cho' },
    uoc_phap: { n: 'Ước pháp', what: 'ước pháp với' }
  });
})();
