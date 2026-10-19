// Dân số ẩn theo vùng và hiệp ước giữa các thế lực (F4 và F2, xem ke-hoach/P-nghia-vu-dan-so.md).
// n0: dân số khởi đầu (vạn người), cap: sức chứa, birth: tỉ lệ sinh mỗi năm. Tỉ lệ tử cân bằng quanh n0 (tính trong systems/population.js).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.POP = {
    trung_chau: { n0: 1200, cap: 1500, birth: 0.012 },
    dong_hai: { n0: 800, cap: 1000, birth: 0.020 },
    tay_son: { n0: 300, cap: 400, birth: 0.014 },
    nam_lam: { n0: 700, cap: 900, birth: 0.026 },
    bac_bang: { n0: 60, cap: 90, birth: 0.008 },
    hoa_son: { n0: 350, cap: 450, birth: 0.014 },
    hoang_mac: { n0: 400, cap: 500, birth: 0.019 },
    vu_trach: { n0: 650, cap: 800, birth: 0.022 },
    loi_dao: { n0: 150, cap: 220, birth: 0.012 }
  };
  D.POP_RULES = {
    mood0: 55, food0: 58, foodNoise: 16,
    han: 0.03, lu: 0.025, dich: 0.012,          // xác suất mỗi năm mỗi vùng có thiên tai mới
    shockYears: [1, 3],
    mig: 0.003,                                  // tỉ lệ di cư tối đa mỗi năm theo chênh lệch hấp dẫn
    nMin: 0.25, nMax: 1.3,                       // trần dưới (so với n0) và trần trên (so với cap)
    unrest: 30, riot: 20,                        // dân tâm dưới ngưỡng này: bất ổn, nổi loạn
    warLoss: 0.02, warMood: 3
  };
  // Hiệp ước. base: số điểm "kho" trả mỗi năm khi rate = 1 (rate thường 0,02 đến 0,3).
  D.PACT = {
    base: 20,
    kinds: {
      cong: { n: 'Cống nạp', what: 'nộp cống cho' },
      thue: { n: 'Thuế', what: 'nộp thuế cho' },
      chu_hau: { n: 'Chư hầu', what: 'thần phục và nộp cống cho' },
      bao_ho: { n: 'Bảo hộ', what: 'xin che chở và nộp phí cho' },
      minh_uoc: { n: 'Minh ước', what: 'kết minh với' }
    },
    defy: 60, break: 85,                         // ngưỡng oán: bất tuân, đoạn tuyệt
    chuHauYears: [8, 20], chuHauRate: 0.25, thueRate: 0.06
  };
})();
