// Kinh tế: nhóm hàng, độ co giãn, đặc sản vùng, hạn dùng, hệ số kênh mua, thuế, thương hội (xem ke-hoach/E-kinh-te.md mục A).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.ECO = {
    groups: ['dan', 'bua', 'thao', 'khoang', 'khi', 'sach', 'yeu'],
    names: { dan: 'Đan dược', bua: 'Bùa chú', thao: 'Linh thảo', khoang: 'Khoáng thạch', khi: 'Khí cụ', sach: 'Sách công pháp', yeu: 'Yêu liệu' },
    // độ co giãn cầu (e) và cung (es) theo nhóm
    e: { dan: 0.4, bua: 0.7, thao: 0.6, khoang: 0.5, khi: 1.1, sach: 1.5, yeu: 0.6 },
    es: { dan: 0.6, bua: 0.7, thao: 1.0, khoang: 0.9, khi: 0.8, sach: 0.5, yeu: 0.9 },
    // đặc sản vùng: nhóm rẻ và nhóm đắt hơn mức chung
    spec: {
      trung_chau: { cheap: ['sach', 'khi'], dear: ['thao', 'yeu'] }, dong_hai: { cheap: ['yeu', 'thao'], dear: ['khoang', 'bua'] },
      tay_son: { cheap: ['khoang', 'khi'], dear: ['thao', 'dan'] }, nam_lam: { cheap: ['thao', 'yeu'], dear: ['khi', 'khoang'] },
      bac_bang: { cheap: ['yeu'], dear: ['thao', 'dan', 'khi'] }, hoa_son: { cheap: ['khoang', 'khi'], dear: ['thao', 'bua'] },
      hoang_mac: { cheap: ['khoang'], dear: ['thao', 'dan', 'yeu'] }, vu_trach: { cheap: ['thao', 'yeu'], dear: ['khi', 'sach'] },
      loi_dao: { cheap: ['bua'], dear: ['thao', 'dan', 'khoang'] }
    },
    cheapMul: 0.86, dearMul: 1.16,
    adj: 0.18,                 // tốc độ giá về cân bằng mỗi tháng
    pMin: 0.45, pMax: 3,       // sàn và trần chỉ số giá (trần hạ theo độ phủ thương hội)
    press: { buy: 0.015, sell: 0.02, capUp: 0.3, capDown: 0.4, rec: 0.08 }, // mua dồn đẩy giá, bán dồn trượt giá, hồi 8%/tháng
    hist: 48,                  // số tháng giữ lịch sử giá
    // hệ số giá theo kênh mua (cạnh tranh nhẹ): chợ thường, cửa hàng chuyên, thương hội, chợ đen, hàng rong
    chan: { cho: 1.0, dan: 1.06, khi: 1.06, bua: 1.06, thu: 1.06, hoi: 0.93, den: 0.9, rong: 1.0 }, jitter: 0.04,
    tax: { base: 0.05, min: 0.03, max: 0.18 },
    // hạn dùng (tháng): chỉ túi đồ người chơi; giá trị bán giảm dần, 3 tháng cuối còn 40% giá gốc
    life: { dan: 18, bua: 24, thao: 12 }, decay: { last: 3, floor: 0.4 },
    // cú sốc ngẫu nhiên nối vào thế cuộc. lead: số tháng báo trước. d, s: nhân cầu và cung theo nhóm ('*' là mọi nhóm)
    shocks: {
      dot_pha: { n: 'mùa đột phá', chance: 0.0045, lead: [1, 3], dur: 4, d: { dan: 1.25, bua: 1.07 }, text: 'Mùa đột phá sắp tới, ai cũng tìm đan dược' },
      thu_hoach: { n: 'mùa thu hoạch', chance: 0.006, lead: [1, 2], dur: 6, s: { thao: 1.3 }, text: 'Mùa thu hoạch linh thảo bội thu' },
      tong_mo: { n: 'tông mở kho', chance: 0.004, lead: [1, 1], dur: 3, s: { dan: 1.4, bua: 1.3 }, text: 'Tông môn mở kho bán rộng đan dược và bùa' },
      duong_chan: { n: 'đường buôn phong tỏa', chance: 0.0035, lead: [0, 1], dur: 8, s: { '*': 0.72 }, text: 'Đường buôn bị phong tỏa, hàng không tới' }
    },
    // thương hội: thiện cảm
    hoi: {
      repBuy: 0.05, repCap: 6, decayAfter: 12, decay: 0.5,                  // cộng khi mua ở hội theo giá; trần mỗi tháng; sau bao nhiêu tháng không giao dịch thì trôi
      discount: 0.08, levels: [[0, 'khách'], [26, 'quen mặt'], [46, 'tin cậy'], [66, 'thân thiết']],
      join: { wealth: [200, 1000], rep: 46, ranks: ['Khách', 'Hội viên', 'Quản sự', 'Chấp sự', 'Hội trưởng'], tradeLevel: 3, tradeEarn: [3000, 30000], tradeRep: 26 },
      fee: 5, rankVol: [0, 800, 4000, 15000, 60000], sellFee: [0.05, 0.04, 0.03, 0.025, 0.02]
    },
    rob: { minValue: 150, base: 0.05, perValue: 20000, max: 0.5, loss: [0.25, 0.6] }, // cướp đường: hạ phẩm tối thiểu, xác suất nền, thêm theo giá trị hàng, trần, tỉ lệ mất
    nhai: 0.1,                // xác suất đồ nhái ở chợ đen
    dgia: { lots: 3, bids: [1.0, 1.25, 1.6], rivalMin: 0.9, rivalMax: 1.7 }
  };
})();
