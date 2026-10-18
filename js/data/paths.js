// Dữ liệu ngã rẽ cuộc đời: các con đường (đạo) và mốc xuất hiện. Logic ở js/systems/path.js.
// Khóa của đường trùng khóa D.DIRECTIONS (trọng số hành động hằng tháng vẫn lấy từ đó); "can_bang" chỉ dùng cho NPC và trước ngã rẽ đầu tiên.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.PATHS = {
    tu_luyen: {
      n: 'Khổ tu', tag: 'train',
      gain: ['Tu vi nhanh hơn 25%', 'Hợp bế quan, ít bị phân tâm'],
      lose: ['Quan hệ nhạt (giao du kém 40%)', 'Ít kỳ ngộ (giảm 20%)', 'Kiếm sống kém 10%'],
      mods: { train: 1.25, social: 0.6, fortune: 0.8, gold: 0.9 }
    },
    kiem_song: {
      n: 'Kiếm sống', tag: 'coin',
      gain: ['Thu nhập cao hơn 35%', 'Của cải tích lũy nhanh'],
      lose: ['Tu vi chậm 15%'],
      mods: { gold: 1.35, train: 0.85 }
    },
    phieu_luu: {
      n: 'Phiêu lưu', tag: 'explore',
      gain: ['Kỳ ngộ gấp đôi', 'Hay gặp tin đồn, bí cảnh'],
      lose: ['Tu vi chậm 10%', 'Dễ gặp hiểm nguy hơn 25%'],
      mods: { fortune: 2, train: 0.9, risk: 1.25 }
    },
    giao_du: {
      n: 'Giao du', tag: 'social',
      gain: ['Quan hệ lên nhanh gấp rưỡi', 'Hay được người quen giúp'],
      lose: ['Tu vi chậm 15%'],
      mods: { social: 1.5, train: 0.85 }
    },
    luyen_nghe: {
      n: 'Luyện nghề', tag: 'craft',
      gain: ['Nghề lên nhanh hơn 60%', 'Thu nhập từ nghề khá hơn 10%'],
      lose: ['Tu vi chậm 15%'],
      mods: { craft: 1.6, train: 0.85, gold: 1.1 }
    }
  };
  D.PATH_IDS = Object.keys(D.PATHS);

  // Thành thạo theo số năm đã đi (cấp 0-5), mỗi cấp tăng 10% phần chênh lệch có lợi của đường.
  D.PATH_LV_YEARS = [0, 3, 8, 15, 25, 40];
  D.PATH_LV_STEP = 0.1;
  D.PATH_ADAPT = 12;       // tháng thích nghi sau khi đổi đường: phần lợi giảm một nửa
  D.PATH_COOL = 8;         // năm tối thiểu giữa hai ngã rẽ (trừ ngã rẽ đầu và bỏ đạo)
  D.PATH_LONG = 25;        // năm tối đa không có ngã rẽ
  D.PATH_QUIT_DAO = 6;     // đạo tâm mất khi bỏ đạo (cộng thêm 2 mỗi cấp thành thạo)
  D.PATH_QUIT_KEEP = 0.5;  // phần số tháng thành thạo giữ lại khi bỏ đạo

  D.CROSS_WHY = {
    start: 'Bạn vừa tròn mười hai tuổi, đã đến lúc chọn con đường sống cho mình.',
    realm: 'Vừa đột phá cảnh giới, tầm nhìn mở rộng và bạn cân nhắc lại con đường của mình.',
    sect: 'Gia nhập một mái nhà mới, bạn cân nhắc lại hướng đi.',
    love: 'Có người đồng hành bên cạnh, bạn nghĩ lại về con đường của mình.',
    hurt: 'Vừa trải qua một trận thương nặng, bạn tự hỏi mình có đi đúng đường không.',
    clear: 'Vừa vượt qua một cửa hiểm, bạn nhìn lại con đường đã chọn.',
    time: 'Đã nhiều năm trôi qua, bạn dừng chân nghĩ về con đường phía trước.',
    abandon: 'Bạn đã dứt khoát rời bỏ con đường cũ và cần chọn một đường mới.'
  };
})();
