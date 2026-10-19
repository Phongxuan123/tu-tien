// Quân lực của chín vương triều (S6a, xem ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 5.4 và 7.3).
// Mọi hệ số ở đây chỉnh được; hệ thống ở js/systems/army.js. Tên cổ trang, không dùng tên nước thật.
// Đơn vị: quân số tính bằng người; dân (pop.n) tính bằng vạn nên nhân 10.000.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.ARMY = {
    on: true,                                   // công tắc: tắt thì không có quân lực, strength() như trước S6a (tắt phải trùng khít đường cơ sở)
    ratio: { peace: 0.03, war: 0.06 },          // tỉ lệ lính trên dân (thời bình, thời chiến)
    kho: [0.6, 0.6],                            // hệ số quân số theo kho: 0,6 + 0,6 x kho/100
    field: { peace: 0.08, war: 0.30 },          // tỉ lệ lính ra trận trên tổng quân số
    fieldMax: 90000,                            // trần lính một chiến trường (chặn bởi chiến trường)
    // Phẩm quân theo kho (từ cao xuống thấp).
    ph: [
      { min: 80, n: 'Cấm quân', v: 1.6 },
      { min: 55, n: 'Tinh binh', v: 1.3 },
      { min: 30, n: 'Tân binh', v: 0.9 },
      { min: 0, n: 'Dân binh', v: 0.6 }
    ],
    // Bậc quân lực theo tổng quân số x phẩm (chỉ hiện chữ).
    bac: [
      { min: 150000, n: 'Thiên hạ' },
      { min: 60000, n: 'Hùng hậu' },
      { min: 20000, n: 'Mạnh' },
      { min: 6000, n: 'Vừa' },
      { min: 0, n: 'Yếu' }
    ],
    // Tướng: bậc theo tài người đứng đầu (từ cao xuống thấp); tu sĩ Kim Đan trở lên trong vùng cộng thêm một bậc.
    tuong: [{ min: 70, v: 3 }, { min: 50, v: 2 }, { min: 30, v: 1 }, { min: 0, v: 0 }],
    tuongName: ['Chưa có tướng', 'Tiểu tướng', 'Đại tướng', 'Soái'],
    tuongRealm: 3,                              // cảnh giới tối thiểu để tu sĩ làm tướng (Kim Đan)
    tuongMul: 0.15,                             // mỗi bậc tướng nhân thêm vào chiến lực
    ref: 1.3,                                   // hệ số bù: hệ số quân trung bình đo được của chín triều (mục đích: trung bình về khoảng 1, không đổi cân bằng chung)
    // Sát khí 0..100: tích khi đánh nhau, hao khi nhàn rỗi, thắng trận được thêm.
    satWar: 3, satDecay: 2, satWin: 8, satLose: 4, fallSat: 0.5,
    satWord: [{ min: 70, n: 'sát khí ngút trời' }, { min: 40, n: 'sát khí nặng' }, { min: 15, n: 'sát khí vừa' }, { min: 0, n: 'sát khí nhẹ' }],
    // Quân trận: bậc 1 đến 3, điều kiện (sát khí, quốc vận, kho) phải giữ đủ số năm liên tiếp khi nhàn rỗi; học xong trừ kho một lần, sau đó hao kho mỗi năm.
    tran: [
      { n: 'Hợp Kích Trận', sat: 15, van: 40, kho: 35, years: 3, cost: 8, upkeep: 0.4 },
      { n: 'Sát Khí Trận', sat: 45, van: 55, kho: 45, years: 5, cost: 15, upkeep: 0.9 },
      { n: 'Quốc Vận Đại Trận', sat: 70, van: 75, kho: 55, years: 8, cost: 25, upkeep: 1.6 }
    ],
    // Bản sắc quân theo vùng (S mục 7.3): q nhân quân số ra trận, ph nhân phẩm, sat nhân tốc độ tích sát khí, tiep nhân tiếp tế, tran nhân số năm học trận.
    trait: {
      trung_chau: { n: 'Quân đoàn đế chế', desc: 'quân đông, phẩm trung bình, trận học chậm', q: 1.1, ph: 0.95, sat: 1, tiep: 1, tran: 1.2 },
      dong_hai: { n: 'Thủy quân hải thương', desc: 'tiếp tế qua đường biển, quân ít hơn', q: 0.95, ph: 1, sat: 1, tiep: 1.15, tran: 1 },
      tay_son: { n: 'Sơn binh kiếm trận', desc: 'ít người nhưng tinh nhuệ, trận lập nhanh', q: 0.7, ph: 1.25, sat: 1, tiep: 1, tran: 0.8 },
      nam_lam: { n: 'Nghĩa quân du kích', desc: 'sát khí đậm, tiếp tế mỏng', q: 0.85, ph: 0.9, sat: 1.4, tiep: 0.9, tran: 1 },
      bac_bang: { n: 'Băng kỵ hội làng', desc: 'rất ít người, phẩm cao', q: 0.6, ph: 1.3, sat: 0.8, tiep: 0.85, tran: 1 },
      hoa_son: { n: 'Hỏa khí thường trực', desc: 'quân thường trực, rèn luyện đều', q: 1, ph: 1.15, sat: 1, tiep: 1, tran: 1 },
      hoang_mac: { n: 'Kỵ binh cơ động', desc: 'tiếp tế theo ốc đảo, cơ động', q: 0.9, ph: 1.05, sat: 1, tiep: 1.1, tran: 1 },
      vu_trach: { n: 'Quân hỗn tạp thành bang', desc: 'quân nhiều nguồn, trận hay tan', q: 1.05, ph: 0.9, sat: 1.1, tiep: 1, tran: 1.3 },
      loi_dao: { n: 'Lôi pháo thành bang', desc: 'ít quân, sát khí cao, pháo lôi', q: 0.6, ph: 1.1, sat: 1.5, tiep: 1, tran: 1 }
    },
    // Bảng lính tương đương một tu sĩ (S mục 5.4): need là chiến lực quân cần; các điều kiện phải đủ (trận, tướng, sát khí).
    // Phi Thăng không có giá trị nào của phàm quân.
    cult: [
      { need: 0 },
      { need: 5 },
      { need: 60, tuong: 1 },
      { need: 2000, tr: 1 },
      { need: 30000, tr: 2, tuong: 2 },
      { need: 400000, tr: 2, sat: 60 },
      { need: Infinity }
    ]
  };
})();
