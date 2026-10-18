// Mạng quan hệ nhiều chiều giữa các thế lực (S1): hệ số, bậc quan hệ và các loại ân oán ghi vào sổ.
// `tinh` (thiện cảm) vẫn lưu ở world.fac.rel như cũ; các chiều khác ở world.fac.rel2[cặp] cùng sổ ân oán.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.DIPLO = {
    logMax: 12,                                   // số mục ân oán tối đa mỗi cặp
    // Trọng số khi gộp thành số tổng hợp `relV`. S1 chỉ dùng `tinh`; từ S2 bật `dao` (0,3) cho các cặp tông có giá trị.
    w: { tinh: 1, loi: 0, dao: 0.3, thong: 0 },
    // `dao` giữa hai tông suy từ khoảng cách giá trị (bình quân |chênh| trên 5 trục): gần hơn mức giữa thì thân, xa hơn thì khắc.
    daoMid: 40, daoK: 1.5, daoMax: 60,
    dimName: { tinh: 'Thiện cảm', loi: 'Lợi ích', dao: 'Đạo thống', thong: 'Thông gia', tin: 'Tín nhiệm', cua: 'Kiêng dè' },
    // Bậc quan hệ theo số tổng hợp (từ cao xuống thấp); 'dong_minh' và 'chien' ghi đè khi đúng điều kiện.
    levels: [
      { min: 35, id: 'than_huu', n: 'Thân hữu', cls: 'good' },
      { min: 12, id: 'hoa_hao', n: 'Hòa hảo', cls: 'good' },
      { min: -11, id: 'trung_lap', n: 'Trung lập', cls: '' },
      { min: -34, id: 'lanh_nhat', n: 'Lạnh nhạt', cls: 'bad' },
      { min: -59, id: 'bat_hoa', n: 'Bất hòa', cls: 'bad' },
      { min: -79, id: 'thu_dich', n: 'Thù địch', cls: 'bad' },
      { min: -101, id: 'tu_thu', n: 'Tử thù', cls: 'bad' }
    ],
    ally: { id: 'dong_minh', n: 'Đồng minh', cls: 'good' },
    // Các loại ân oán. tone: tốt/xấu/trung tính; heir: thù truyền đời (giữ lâu hơn khi sổ đầy); tin: thay đổi `tin` của cặp.
    kinds: {
      xung_dot: { n: 'Xung đột', tone: 'bad' },
      ket_minh: { n: 'Kết minh', tone: 'good', tin: 4 },
      tan_minh: { n: 'Đồng minh tan', tone: 'bad' },
      chien: { n: 'Tuyên chiến', tone: 'bad', tin: -4 },
      hoa_nghi: { n: 'Hòa nghị', tone: 'good', tin: 5 },
      thang: { n: 'Thắng trận', tone: 'bad' },
      than_phuc: { n: 'Thần phục', tone: 'bad' },
      diet: { n: 'Bị diệt', tone: 'bad', heir: true },
      bo_mac: { n: 'Bị bỏ mặc', tone: 'bad', tin: -6 },
      bat_tuan: { n: 'Bất tuân', tone: 'bad', tin: -12 },
      trung_phat: { n: 'Bị trừng phạt', tone: 'bad' },
      doan_tuyet: { n: 'Đoạn tuyệt', tone: 'bad', tin: -25 },
      tich_thu: { n: 'Bị tịch thu', tone: 'bad' },
      cat_hang: { n: 'Cắt hàng', tone: 'bad' }
    },
    // Nhãn hiệp ước (nhìn từ bên gánh `a` và bên hưởng `b`).
    pactLabel: { cong: ['nộp cống cho', 'nhận cống của'], thue: ['nộp thuế cho', 'thu thuế của'], chu_hau: ['chư hầu của', 'có chư hầu'], bao_ho: ['được bảo hộ bởi', 'bảo hộ'], minh_uoc: ['minh ước với', 'minh ước với'] },
    kindOrder: ['trieu', 'tong', 'gia', 'hoi']
  };
})();
