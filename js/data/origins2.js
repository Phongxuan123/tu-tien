// Xuất thân v2 (Q 8.1 đến 8.4; 9A-d): tám xuất thân đầu, tổng trọng số 100. Hệ thống bốc, áp và dựng cha mẹ ở js/systems/origin.js (9A).
// Mỗi xuất thân: id, n (tên), w (trọng số), d (2 câu), start { gold, luck?, daoTam?, atk?, nl?, items?: [id ở items.js] },
//   gom (gánh nặng, 1 câu), cha_me { co: còn cha mẹ, tu: cha mẹ có tu hành }, ax (nghiêng tính cách lúc sinh, ±1 đến ±2),
//   bi_mat? (chỉ t1, t10), place_types (loại địa điểm ở places.js hợp với nơi sinh).
// Sự kiện tuổi thơ riêng của từng xuất thân nằm trong js/data/childhood.js, trường origin: ['p1', ...].
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.ORIGINS2 = [
    {
      id: 'p1', n: 'Nông hộ', w: 28,
      d: 'Nhà bạn có mấy sào ruộng và một mái tranh, quanh năm trông trời trông đất. Cha mẹ hiền lành, tay chai sạn nhưng chưa từng để bạn đói.',
      start: { gold: 8, atk: 1, items: ['linh_thao'] },
      gom: 'Cha mẹ cần người làm ruộng, mất mùa hay hạn lụt là cả nhà lao đao.',
      cha_me: { co: true, tu: false },
      ax: { tudung: 1, daoduc: 1 },
      place_types: ['thon_tran', 'bo_toc']
    },
    {
      id: 'p2', n: 'Thợ thủ công, ngư dân, thợ săn', w: 13,
      d: 'Cha mẹ bạn sống bằng đôi tay: lò rèn, mái chèo hay cây cung. Nhà không giàu nhưng mỗi người đều có một món nghề trong tay.',
      start: { gold: 12, atk: 2, items: ['quang_thach'] },
      gom: 'Nhà còn nợ chủ hàng hoặc bang hội địa phương, tới kỳ là phải trả.',
      cha_me: { co: true, tu: false },
      ax: { tudung: 1, tinh: -1 },
      place_types: ['thon_tran', 'ben', 'phuong']
    },
    {
      id: 'p3', n: 'Nhà thương nhân', w: 13,
      d: 'Nhà bạn buôn bán nhỏ, đồng tiền qua tay cha mẹ nhiều hơn qua tay hàng xóm. Từ bé bạn đã quen tiếng bàn tính và cách người ta mặc cả.',
      start: { gold: 45, luck: 1, items: ['phu_giay'] },
      gom: 'Thương vụ của nhà luôn có nợ và đối thủ buôn, một chuyến lỗ là cả nhà chịu.',
      cha_me: { co: true, tu: false },
      ax: { xuthe: 1, tinh: 1 },
      place_types: ['thanh_tri', 'thuong_doan', 'ben']
    },
    {
      id: 'p5', n: 'Cô nhi lang thang', w: 12,
      d: 'Bạn không nhớ mặt cha mẹ, chỉ nhớ những mái hiên và gầm cầu. Ai cho miếng ăn thì bạn nhớ, ai đuổi đi thì bạn cũng nhớ.',
      start: { gold: 0, luck: 3, nl: 1 },
      gom: 'Không ai chống lưng, mạnh thì sống yếu thì bị bắt nạt.',
      cha_me: { co: false, tu: false },
      ax: { xuthe: 2, daoduc: -1 },
      place_types: ['thanh_tri', 'thon_tran', 'cho_den', 'ben']
    },
    {
      id: 't1', n: 'Cha hoặc mẹ là tán tu', w: 12,
      d: 'Cha hoặc mẹ bạn là một tán tu Luyện Khí, đạo hạnh chẳng bao nhiêu nhưng đủ để biết đường nhập môn. Tối nào bạn cũng nghe tiếng thở đều đặn của người ngồi thiền trong gian nhà nhỏ.',
      start: { gold: 10, daoTam: 4, nl: 1, items: ['tu_khi_dan'] },
      gom: 'Cha mẹ tu vi thấp hay bị người ức hiếp, thù cũ của họ có thể tìm tới bạn.',
      cha_me: { co: true, tu: true },
      ax: { tudung: 1, tinh: 1 },
      bi_mat: 'Cha hoặc mẹ bạn từng bị một thế lực lớn truy đuổi và phải bỏ nơi cũ mà đi.',
      place_types: ['thon_tran', 'tram', 'linh_mach']
    },
    {
      id: 't3', n: 'Gia tộc luyện đan', w: 8,
      d: 'Nhà bạn giữ một đan phương truyền qua mấy đời, sân sau có luống thảo dược nhỏ. Mùi thuốc sắc đã thấm vào từng bức tường.',
      start: { gold: 30, nl: 2, items: ['linh_thao', 'hoi_xuan_dan'] },
      gom: 'Linh thảo luôn thiếu, và một số tông nhòm ngó đan phương của nhà.',
      cha_me: { co: true, tu: true },
      ax: { tinh: 1, tudung: 1 },
      place_types: ['thon_tran', 'phuong', 'thanh_tri']
    },
    {
      id: 't6', n: 'Hậu duệ đệ tử tông', w: 8,
      d: 'Cha hoặc mẹ bạn là đệ tử một tông môn, thỉnh thoảng mới về nhà mang theo mùi hương trầm núi. Người trong làng nhìn nhà bạn bằng ánh mắt vừa nể vừa xa.',
      start: { gold: 25, daoTam: 3, nl: 1, items: ['ho_than_bua'] },
      gom: 'Áp lực danh tiếng của cha mẹ trong tông, và kẻ ghen ghét sẵn sàng dò lỗi bạn.',
      cha_me: { co: true, tu: true },
      ax: { xuthe: 1, tudung: 1 },
      place_types: ['tong_mon', 'thon_tran']
    },
    {
      id: 't10', n: 'Gia tộc sa sút', w: 6,
      d: 'Họ của bạn từng có tiếng, nay chỉ còn lại một căn nhà dột và vài món đồ cũ. Người lớn trong nhà nói chuyện khe khẽ, nhắc tới quá khứ như nhắc tới vết thương.',
      start: { gold: 3, luck: 1, daoTam: 4, items: ['phu_giay'] },
      gom: 'Gia tộc bị truy, mang nợ máu và phải giấu họ khi ra ngoài.',
      cha_me: { co: true, tu: false },
      ax: { tinh: -1, xuthe: 1 },
      bi_mat: 'Gia tộc bạn giữ một di vật mà nhiều kẻ sẵn sàng giết người để đoạt.',
      place_types: ['thon_tran', 'tan_tich', 'cho_den']
    }
  ];
  D.ORIGINS2.on = true; // công tắc 9A: false thì người chơi giữ xuất thân cũ ở regions.js và không dựng cha mẹ
  D.ORIGINS2_BY_ID = {};
  D.ORIGINS2.forEach(o => { D.ORIGINS2_BY_ID[o.id] = o; });
})();
