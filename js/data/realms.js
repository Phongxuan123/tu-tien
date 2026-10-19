// Cảnh giới, tu vi cần để đột phá, cơ duyên cần để qua bình cảnh và thọ nguyên.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.REALM_NAMES = ['Phàm nhân', 'Luyện Khí', 'Trúc Cơ', 'Kim Đan', 'Nguyên Anh', 'Hóa Thần', 'Phi Thăng'];
  D.NEED = [40, 240, 1000, 6000, 14000, 36000];         // tu vi cần để lên cảnh giới kế tiếp (M7: hạ các bậc cao để một đời Phi Thăng khả thi)
  // Hệ số tốc độ tích lũy tu vi theo cảnh giới hiện tại (ba bậc đầu giữ nguyên 1 + 1,2 x bậc; từ Kim Đan trở đi nhanh hơn).
  D.REALM_MUL = [1, 2.2, 3.4, 6, 8, 14];
  // Tốc độ thời gian tự nhanh dần theo cảnh giới (nhân với tốc độ người chơi chọn), để đời dài không mất hàng giờ.
  D.REALM_SPEED = [1, 1, 1.5, 2, 3, 5, 5];
  D.FORTUNE_NEED = [0, 4, 8, 12, 18, 28];              // cơ duyên cần để vượt bình cảnh lên cảnh giới kế tiếp
  D.LIFE = [70, 130, 260, 520, 1000, 2000, Infinity];  // thọ nguyên theo cảnh giới
  D.STAGE_NAMES = ['sơ kỳ', 'trung kỳ', 'hậu kỳ'];

  // Bổ trợ đột phá. Từ Trúc Cơ trở đi nền tảng thấp, cần nhiều bổ trợ để đủ cao.
  D.AID = {
    baseFromTrucCo: 0.06,  // xác suất nền khi đột phá từ Trúc Cơ (giảm 2% mỗi cảnh giới sau)
    pillBase: 40,          // giá Phá Cảnh Đan ở cảnh giới 1 (vàng), tăng theo cảnh giới
    pillBonus: 0.06,       // mỗi viên cộng thêm
    pillMax: 3,
    roomMul: 2.5,          // giá động phủ linh khí = giá đan x hệ số này
    roomBonus: 0.08
  };

  // Hệ số chung cho tốc độ tích lũy tu vi. Giảm xuống để tu luyện chậm, thêm áp lực.
  D.TRAIN_RATE = 0.50; // đã tính cả hệ số linh khí, môi trường và thuộc tính hợp vùng của bản đồ; nâng từ 0,42 khi thêm hành động giao du
  // Hệ số độ khó riêng của người chơi: người chơi có nhiều thứ NPC không có (hướng đi chuyên tu luyện, công pháp, tâm pháp, tông môn, song tu,
  // đan dược...) nên cần hạ tốc độ để tư chất bình thường vẫn khó đột phá. Chỉnh bằng mô phỏng hàng loạt (xem tests.html, bài đo đời người chơi).
  D.PLAYER_RATE = 0.42;
  // Tu vi tối đa tích lũy được khi đang kẹt bình cảnh, tính theo bội số của tu vi cần thiết.
  D.XP_OVERFLOW_CAP = 2;
})();


