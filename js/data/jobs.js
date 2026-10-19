// Dữ liệu nghề nghiệp. Bốn nghề lõi (kiếm khách, thợ rèn, dược sư, phù sư) dùng hệ thiên phú nghề trong craft.js; năm nghề mới
// (thợ mỏ, thợ săn yêu thú, thương nhân, lính đánh thuê, y sư) có cấp và kinh nghiệm riêng ở c.job.lv. Logic ở js/systems/jobs.js.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  // craft: khóa trong D.CRAFTS (nghề lõi). inc: hệ số thu nhập khi kiếm sống. path: đạo hợp nghề (cộng điểm khi máy tự chọn).
  D.JOBS = {
    kiem: { n: 'Kiếm khách', craft: 'kiem', inc: 1.05, path: 'phieu_luu', perk: 'Kiếm đạo cộng công kích và xác suất đột phá theo cấp.', work: 'Bạn nhận việc hộ tống, so kiếm lấy tiền thưởng.' },
    khi: { n: 'Thợ rèn', craft: 'khi', inc: 1.0, path: 'luyen_nghe', perk: 'Luyện pháp khí, tự làm trang bị và pháp bảo bản mệnh.', work: 'Bạn phụ lò rèn kiếm công.' },
    dan: { n: 'Dược sư', craft: 'dan', inc: 1.05, path: 'luyen_nghe', perk: 'Luyện đan dược dùng hoặc bán.', work: 'Bạn bốc thuốc, sắc thuốc thuê cho người ta.' },
    bua: { n: 'Phù sư', craft: 'bua', inc: 1.05, path: 'luyen_nghe', perk: 'Vẽ bùa chú hỗ trợ chiến đấu và đào tẩu.', work: 'Bạn vẽ bùa bình an bán cho dân quanh vùng.' },
    tho_mo: { n: 'Thợ mỏ', inc: 1.0, path: 'kiem_song', perk: 'Làm việc có xác suất đào được khoáng thạch (cấp cao ra quặng tốt hơn).', work: 'Bạn xuống hầm đào quặng.' },
    tho_san: { n: 'Thợ săn yêu thú', inc: 1.15, path: 'phieu_luu', perk: 'Làm việc có xác suất lấy được nanh, da yêu thú dùng để luyện khí.', work: 'Bạn vào rừng săn yêu thú nhỏ.', risk: 0.04 },
    thuong_nhan: { n: 'Thương nhân', inc: 1.3, path: 'kiem_song', perk: 'Mua đồ rẻ hơn (mỗi cấp bớt 1,5%, tối đa 15%) và thu nhập cao nhất trong các nghề phổ thông.', work: 'Bạn buôn bán đường dài.' },
    linh_danh: { n: 'Lính đánh thuê', inc: 1.25, path: 'phieu_luu', perk: 'Thu nhập cao, dễ nổi danh nhưng hay bị thương nhẹ.', work: 'Bạn nhận việc canh gác, dẹp thú dữ cho các thương hội.', risk: 0.05 },
    y_su: { n: 'Y sư', inc: 1.1, path: 'giao_du', perk: 'Nghỉ ngơi hồi sinh lực nhanh hơn (mỗi cấp 6%), làm việc có xác suất thu được linh thảo.', work: 'Bạn chữa bệnh cho dân quanh vùng.' }
  };
  D.JOB_IDS = Object.keys(D.JOBS);
  D.JOB_RANKS = ['Học đồ', 'Thợ', 'Chuyên gia', 'Đại sư'];
  D.JOB_ADAPT = 6;          // tháng đổi nghề chính: thu nhập chỉ còn một nửa
  D.JOB_ORDER_P = 0.5;      // xác suất mỗi tháng làm việc hoàn thành một đơn hàng (nghề chính)
  D.JOB_MAIN_LV = 0.1;      // mỗi cấp tăng 10% thu nhập (nghề chính), 5% (nghề phụ)
})();
