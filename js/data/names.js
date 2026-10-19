// Sinh tên ngẫu nhiên kiểu tu tiên từ các âm tiết chung, không lấy tên nhân vật có sẵn.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.SURNAMES = [
    'Lâm', 'Tiêu', 'Tống', 'Hạ', 'Thẩm', 'Giang', 'Bạch', 'Liễu', 'Cố', 'Phương',
    'Ngụy', 'Tạ', 'Cung', 'Trình', 'Khúc', 'Đoàn', 'Úc', 'Mộ Dung', 'Âu Dương', 'Thượng Quan'
  ];
  D.MIDDLE = {
    nam: ['Thiên', 'Vũ', 'Hạo', 'Minh', 'Phong', 'Trạch', 'Dật', 'Khải'],
    nu: ['Thanh', 'Tuyết', 'Linh', 'Nguyệt', 'Yên', 'Ngưng', 'Mặc', 'Tâm']
  };
  D.GIVEN = {
    nam: ['Nhiên', 'Tuấn', 'Bác', 'Huyền', 'Triết', 'Lạc', 'Sơn', 'Hiên', 'Dương', 'Khê'],
    nu: ['Dao', 'Lam', 'Vi', 'Hy', 'Liên', 'Thư', 'Hà', 'Nghi', 'Ninh', 'Doanh']
  };

  // Họ của một cái tên (xử lý họ kép như "Mộ Dung").
  TT.surnameOf = function (name) {
    const s = D.SURNAMES.find(x => name.indexOf(x + ' ') === 0);
    return s || name.split(' ')[0];
  };

  // surname: giữ họ của cha cho con cái.
  TT.genName = function (gender, surname) {
    const r = TT.rng;
    const g = gender === 'nu' ? 'nu' : 'nam';
    const parts = [surname || r.pick(D.SURNAMES)];
    if (r.P(0.65)) parts.push(r.pick(D.MIDDLE[g]));
    parts.push(r.pick(D.GIVEN[g]));
    return parts.join(' ');
  };
})();
