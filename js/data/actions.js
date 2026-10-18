// Hành động hằng tháng, hướng đi của người chơi, tính cách và xuất thân.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  // dual (song tu) chỉ được bốc khi đang ở cùng địa điểm với đạo lữ. craft (luyện nghề) chỉ người chơi.
  D.ACTIONS = { train: 'Tu luyện', forge: 'Rèn thể', work: 'Kiếm sống', seek: 'Tìm cơ duyên', rest: 'Nghỉ ngơi', social: 'Giao du', dual: 'Song tu', craft: 'Luyện nghề' };

  // Trọng số cơ bản của từng hành động theo hướng đi.
  // bold: mức dám liều khi chọn mặc định ở các sự kiện (nhân với bold của tính cách).
  D.DIRECTIONS = {
    can_bang: { n: 'Cân bằng', bold: 1, w: { train: 3, forge: 2, work: 2, seek: 2, rest: 1, social: 1.5, dual: 2, craft: 1 } },
    tu_luyen: { n: 'Chuyên tu luyện', bold: 0.75, w: { train: 6, forge: 1.5, work: 1, seek: 1, rest: 1, social: 0.4, dual: 4, craft: 0.4 } },
    kiem_song: { n: 'Kiếm sống', bold: 0.85, w: { train: 1.5, forge: 1, work: 5, seek: 2, rest: 1, social: 1.2, dual: 1, craft: 2 } },
    phieu_luu: { n: 'Phiêu lưu', bold: 1.7, w: { train: 2, forge: 1.5, work: 1, seek: 5, rest: 1, social: 1, dual: 1, craft: 0.3 } },
    giao_du: { n: 'Giao du', bold: 1.1, w: { train: 2, forge: 1, work: 1.5, seek: 1.5, rest: 1, social: 6, dual: 3, craft: 0.5 } },
    luyen_nghe: { n: 'Luyện nghề', bold: 0.9, w: { train: 2.5, forge: 1, work: 1.5, seek: 1, rest: 1, social: 0.6, dual: 2, craft: 6 } }
  };

  // weight là xác suất bốc tính cách khi sinh NPC; w là hệ số nhân lên trọng số hành động; bold: mức dám liều;
  // al: lệch thiên hướng chính/tà (cộng vào c.align của NPC, từ -100 tà đến +100 chính).
  D.personalities = [
    { id: 'can_cu', n: 'Cần cù', weight: 20, bold: 0.9, al: 10, w: { train: 1.6, forge: 1.2, work: 1, seek: 0.7, rest: 1, social: 0.7 } },
    { id: 'tham_lam', n: 'Tham lam', weight: 15, bold: 1.25, al: -15, w: { train: 0.8, forge: 0.8, work: 2, seek: 1.2, rest: 0.8, social: 1 } },
    { id: 'lieu_linh', n: 'Liều lĩnh', weight: 15, bold: 1.8, al: 0, w: { train: 1, forge: 1.4, work: 0.7, seek: 2, rest: 0.5, social: 1.1 } },
    { id: 'hien_hoa', n: 'Hiền hòa', weight: 20, bold: 0.6, al: 25, w: { train: 1, forge: 0.8, work: 1.2, seek: 0.8, rest: 1.6, social: 1.6 } },
    { id: 'kieu_ngao', n: 'Kiêu ngạo', weight: 15, bold: 1.45, al: -5, w: { train: 1.4, forge: 1.6, work: 0.5, seek: 1.3, rest: 0.6, social: 0.6 } },
    { id: 'muu_mo', n: 'Mưu mô', weight: 15, bold: 1, al: -20, w: { train: 1.2, forge: 1, work: 1.5, seek: 1.3, rest: 0.9, social: 1.3 } },
    { id: 'trung_lap', n: 'Bình thường', weight: 0, bold: 1, al: 0, w: {} }
  ];
  D.personalityById = {};
  D.personalities.forEach(p => { D.personalityById[p.id] = p; });

  D.origins = [
    { name: 'con nhà nông', gold: 5, luck: 0, w: 50 },
    { name: 'con thương nhân', gold: 40, luck: 1, w: 25 },
    { name: 'thiếu gia thế gia', gold: 100, luck: 2, w: 10 },
    { name: 'cô nhi lang thang', gold: 0, luck: 4, w: 15 }
  ];
})();
