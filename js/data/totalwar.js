// Chiến tranh tổng (S6b, xem ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 5.6 và 15.18): đa bên, nhiều chiến tuyến, 10 đến 18 năm.
// Mọi con số chỉnh được; hệ thống ở js/systems/totalwar.js. Tên cổ trang, không dùng tên nước thật.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.TOTALWAR = {
    on: true,                                   // công tắc: tắt thì không có chiến tranh tổng, không gọi rng, đường cơ sở trùng khít (S6a)
    // Mở: điều kiện thế giới (quốc vận suy ở nhiều nước cùng lúc) hoặc Q gọi TT.totalwar.start().
    open: {
      weakVan: 40,                              // quốc vận dưới mức này thì triều được tính là suy
      weakCount: 4,                             // đủ bao nhiêu triều suy cùng lúc thì mới có thể mở
      chance: 0.03,                             // xác suất mỗi năm khi đủ điều kiện
      eraMul: { loan: 1.5, mat_phap: 1.5 },     // thời loạn, mạt pháp dễ mở hơn
      gapYears: 150                             // chỉ tiêu: tối đa một đại chiến mỗi 150 năm (Q gọi tay thì bỏ qua)
    },
    // Số bên và chiến tuyến.
    sides: { min: 6, max: 9, fronts: [3, 4] },
    years: [10, 18],                            // tổng số năm
    // Giai đoạn theo số năm đã trôi qua: bùng nổ (2 năm đầu), giằng co, kiệt sức (3 năm trước nghị hòa), nghị hòa (2 năm cuối).
    phases: { bung: 2, kiet: 3, nghi: 2 },
    phaseName: { bung_no: 'bùng nổ', giang_co: 'giằng co', kiet_suc: 'kiệt sức', nghi_hoa: 'nghị hòa' },
    // Hao mỗi năm theo giai đoạn (nhân vào hao cơ bản bên dưới).
    wear: { bung_no: 1.0, giang_co: 1.6, kiet_suc: 2.2, nghi_hoa: 0.5 },
    base: { power: 0.9, wealth: 0.8, unity: 0.6 },
    win: { score: 0.45, from: 3 },              // một phe thắng khi điểm lệch đủ lớn sau năm thứ `from`
    draw: 0.2,                                  // điểm lệch dưới mức này khi hết năm thì là hòa nghị lớn
    exhaust: 38,                                // sức mạnh trung bình các bên dưới mức này (kiệt sức hoặc nghị hòa) thì hết sức
    cap: {
      pop: 0.25,                                // dân một vùng chiến tuyến không giảm quá 25% (dân giảm theo F4, có trần)
      hurtPower: 30,                            // sức mạnh một bên mất tối đa trong một trận lớn
      destroy: 2,                               // số tông bị diệt tối đa khi kết thúc
      doiChu: 2,                                // số triều đổi chủ tối đa khi kết thúc
      chiaCat: 1,                               // số triều bị chia cắt tối đa khi kết thúc
      backlashVan: 6,                           // phản phệ: quốc vận triều có sát khí cao giảm tối đa
      backlashUnity: 5                          // phản phệ: tông có liên quan giảm đoàn kết tối đa
    },
    sat: 60,                                    // sát khí từ mức này trở lên thì bị phản phệ khi kết thúc
    names: ['Đại loạn Bát Hoang', 'Đại chiến Tứ Hải', 'Đại chiến Vạn Tông', 'Đại loạn Cửu Châu'],
    reasons: ['các triều cùng suy yếu, cát cứ nổi lên', 'quốc vận suy sụp khắp nơi', 'tranh giành đất thiêng và truyền thừa']
  };
})();
