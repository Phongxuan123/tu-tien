// Nhật báo "Thiên Cơ Báo" (xem ke-hoach/G-nhat-bao.md): bốn năm ra một số tổng san, đăng ký theo tháng, người bán báo hỏi mỗi bốn năm.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.PRESS = {
    name: 'Thiên Cơ Báo', owner: 'thương hội', period: 48,           // tháng giữa hai số
    fee: 0.4, feeRealm: 0.6,                                         // hạ phẩm mỗi tháng: fee x (1 + feeRealm x cảnh giới)
    richYears: 30,                                                   // chỉ hỏi khi tài sản đủ trụ chừng này năm
    oldMul: 1.2,                                                     // số cũ: phí bốn năm x 1,2
    poolCap: 700, issuesKeep: 8, ownedKeep: 8,
    wrong: 0.08, maybe: 0.12,                                        // tỉ lệ tin "chưa xác nhận" và "khá chắc" (tin quan trọng luôn đã kiểm chứng)
    secs: { timeline: 18, the: 12, tong: 10, dan: 8, hiep: 8, bi: 6, gia: 10, nguoi: 8, mine: 6 },
    conf: { v: 'đã kiểm chứng', k: 'khá chắc', u: 'chưa xác nhận' },
    kinds: { the: 'Thế cuộc và chiến sự', tong: 'Tông môn', dan: 'Dân sinh', hiep: 'Hiệp ước và thuế', bi: 'Bí cảnh và kỳ ngộ', gia: 'Giá cả và thương hội', nguoi: 'Nhân vật', khac: 'Tin khác' }
  };
})();
