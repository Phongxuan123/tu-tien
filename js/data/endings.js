// Kết cục của một kiếp. Mỗi kiếp có thể mở khóa nhiều kết cục; bộ sưu tập được giữ qua các thế giới (localStorage riêng).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};
  const cause = c => c.cause || '';

  D.ENDINGS = [
    { id: 'phi_thang', n: 'Phi thăng', test: (c, how) => how === 'ascend' },
    { id: 'tho_chung', n: 'Thọ chung chính tẩm', test: c => /thọ nguyên/.test(cause(c)) },
    { id: 'bi_giet', n: 'Chết dưới tay người khác', test: c => /giết/.test(cause(c)) },
    { id: 'bao_thu', n: 'Chết dưới tay kẻ báo thù', test: c => /báo thù/.test(cause(c)) },
    { id: 'dot_pha', n: 'Hồn tiêu giữa lúc đột phá', test: c => /thiên lôi|đột phá/.test(cause(c)) },
    { id: 'kiet_suc', n: 'Kiệt sức giữa chốn hiểm', test: c => /kiệt quệ/.test(cause(c)) },
    { id: 'truyen_tong', n: 'Bỏ mạng nơi truyền tống trận', test: c => /truyền tống|đại trận/.test(cause(c)) },
    { id: 'bien_co', n: 'Không qua khỏi một biến cố', test: c => /sự kiện/.test(cause(c)) },
    { id: 'nghiep', n: 'Nghiệp chướng quấn thân', test: c => c.nghiep >= 3 },
    { id: 'chuong_mon', n: 'Chưởng môn một thời', test: c => !!c.sect && c.sect.rank === 4 },
    { id: 'dai_gia_dinh', n: 'Con cháu đầy đàn', test: c => TT.family.children(c).length >= 3 },
    { id: 'do_de', n: 'Đồ đệ đầy cửa', test: c => TT.family.disciples(c).length >= 3 },
    { id: 'nhieu_dao_lu', n: 'Phong lưu đạo lữ', test: c => TT.family.partners(c).length >= 2 },
    { id: 'danh_chan', n: 'Danh chấn thiên hạ', test: c => c.rep.danh >= 800 },
    { id: 'nguyen_anh', n: 'Đạt tới Nguyên Anh', test: c => c.realm >= 4 }
  ];
  D.endingById = {};
  D.ENDINGS.forEach(e => { D.endingById[e.id] = e; });
})();
