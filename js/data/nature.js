// Tính cách bốn trục của người chơi (Q 6, Z "Đặc tả 8A"): −10 đến +10, 0 là Trung dung. NPC giữ nhãn cũ (D.personalities).
// on = false thì mọi thứ chạy như cũ (cả khí vận người chơi), dùng để chứng minh bằng baseline.js --nature=off.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.NATURE = {
    on: true,
    // Bốn trục; lo/hi là nhãn năm dải (cực âm, thiên âm, trung dung, thiên dương, cực dương); ngưỡng dải ở cut.
    axes: [
      { id: 'tinh', n: 'Tính tình', lo: 'Nóng nảy', hi: 'Điềm tĩnh', bands: ['Nóng nảy bộc phát', 'Hơi nóng nảy', 'Trung dung', 'Khá điềm tĩnh', 'Điềm tĩnh nhẫn nại'],
        up: 'bạn đã bớt nóng nảy', down: 'bạn đã nóng nảy hơn' },
      { id: 'xuthe', n: 'Xử thế', lo: 'Cương trực', hi: 'Khéo léo', bands: ['Cương trực thẳng thừng', 'Hơi cương trực', 'Trung dung', 'Khá khéo léo', 'Khéo léo mưu lược'],
        up: 'bạn đã khéo léo hơn', down: 'bạn đã thẳng thắn hơn' },
      { id: 'daoduc', n: 'Đạo đức', lo: 'Vị kỷ', hi: 'Nhân hậu', bands: ['Tàn nhẫn vị kỷ', 'Hơi vị kỷ', 'Trung dung', 'Khá nhân hậu', 'Nhân hậu trọng nghĩa'],
        up: 'lòng bạn đã nhân hậu hơn', down: 'lòng bạn đã chai lì hơn' },
      { id: 'tudung', n: 'Tu dưỡng', lo: 'Buông thả', hi: 'Khắc kỷ', bands: ['Buông thả phóng túng', 'Hơi buông thả', 'Trung dung', 'Khá khắc kỷ', 'Khắc kỷ chuyên tâm'],
        up: 'bạn đã khắc kỷ hơn', down: 'bạn đã buông thả hơn' }
    ],
    // Dải theo giá trị làm tròn: −10..−7 cực âm, −6..−3 thiên âm, −2..+2 trung dung, +3..+6 thiên dương, +7..+10 cực dương.
    cut: [-7, -3, 3, 7],        // r ≤ −7 | r ≤ −3 | r < 3 | r < 7 | còn lại
    max: 10,
    // Bốc lúc sinh: mỗi trục trong ±roll (dồn nhẹ về giữa), ít nhất minAxes trục có |v| ≥ minAbs.
    roll: { max: 8, minAxes: 2, minAbs: 3 },
    budget: 4,                  // ngân sách chỉnh ở hộp "Đời mới"
    yearCap: 3, bigCap: 6,      // trần dịch mỗi trục mỗi năm (biến cố lớn: bigCap)
    extremeMul: 0.3,            // đi tiếp vào dải cực thì đổi chậm hơn (8B2: 0,6 → 0,3 để không trôi hết về một cực)
    dailyMul: 0.5,              // dịch trục từ sự kiện thường ngày (không phải chặng truyện, không phải tuổi thơ) nhân hệ số này (8B2)
    autoRandom: true,           // người chơi ở Tự động/Cân bằng: chọn mặc định bốc ngẫu nhiên theo trọng số độ hợp, quy tắc nếu-thì vẫn đè (8B2)
    logCap: 30,
    recentMonths: 12,           // vừa đổi gần đây (hiện xanh)
    // Nhãn kind của lựa chọn → hướng dịch trục (độ ±0,25 đến 1, Q 6.4).
    kindAx: {
      risk: { tinh: -0.5 }, safe: { tinh: 0.3 }, fight: { xuthe: -0.4, tinh: -0.4 },
      flee: { tinh: 0.4 }, help: { daoduc: 0.6 }, pay: { xuthe: 0.4 }
    },
    // Chuyển nhãn cũ (D.personalities) sang bốn trục (Q 6.8): dùng cho bản lưu cũ và để suy nhãn cũ từ trục.
    legacy: {
      can_cu: { tudung: 5 }, tham_lam: { daoduc: -4, xuthe: 4 }, lieu_linh: { tinh: -6 },
      hien_hoa: { daoduc: 5, tinh: 4 }, kieu_ngao: { tinh: -4, xuthe: -5 }, muu_mo: { xuthe: 6, daoduc: -3 }
    },
    legacyMin: 3,               // trục lệch nhất dưới ngưỡng này thì nhãn cũ là "Bình thường"
    legacyJitter: 2,            // bản lưu cũ: dịch thêm ngẫu nhiên (băm) ±2 quanh bảng chuyển
    // Tác động số (trần ±10% ở đầu cực): độ liều nhân vào bold, tâm ma cộng vào xác suất đối mặt thành công.
    mod: { bold: 0.10, tamMa: 0.10 },
    // Độ hợp tính cách của một lựa chọn: s ∈ [−1, 1]; hợp thì nhân lên (tối đa 1+aff), trái thì chia.
    aff: 1.2
  };
})();
