// Hệ số của hệ tín ngưỡng (S5, xem ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 8). Danh sách tín ngưỡng và ô khởi đầu ở js/data/faiths.js.
// Hệ thống ở js/systems/faith.js. Viết như cơ chế xã hội, không phán đúng sai về niềm tin (mục 3, nguyên tắc 7).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.FAITH = {
    on: true,                                   // công tắc: tắt thì hệ thống đứng yên, không có nơi thờ tự, mọi móc trả 0 (đo bật/tắt)
    minShare: 0.05,                             // mỗi ô luôn còn ít nhất chừng này
    // Khởi đầu: tỉ phần ba ô quanh 0,5 / 0,3 / 0,2 có biến thiên theo hạt giống (băm); đôi khi bỏ hoặc thêm tục lồng.
    start: { base: [0.5, 0.3, 0.2], jitter: 0.2, dropLong: 0.25, addLong: 0.2 },
    longShare: 0.25,                            // phần của tục lồng trong ô (tín đồ kiêm hai tín ngưỡng)
    // Dịch chuyển tỉ phần mỗi năm (đơn vị: tỉ phần của vùng).
    shift: {
      mission: 0.012,                           // truyền giáo, nhân (luc - 50) / 50
      patron: 0.012,                            // triều vùng lấy tín ngưỡng này làm quốc giáo
      sectPatron: 0.006,                        // mỗi tông trong vùng theo tín ngưỡng này (nhân sức mạnh tông / 60)
      crisis: 0.008,                            // dân tâm thấp hoặc thiên tai: người ta tìm đến đức tin của giáo hội mạnh
      persec: 0.02, persecBelow: 40,            // triều khoan dung thấp đè tín ngưỡng không phải quốc giáo
      secular: 0.012, secularFrom: 62,          // nho khí cao thúc đẩy thế tục hóa: giáo hội thể chế mất, Nho giáo và thờ tổ tiên vững
      revert: 0.02,                             // kéo nhẹ về thế cân bằng 1/3 (thiểu số vẫn còn chỗ đứng, không ai độc chiếm hẳn)
      noise: 0.015
    },
    // Tín ngưỡng mới vào vùng: sức ép từ vùng láng giềng tích lại (pend), đủ mạnh thì đẩy ô yếu nhất hoặc lồng vào một ô tương thích.
    entry: { k: 0.025, decay: 0.85, min: 0.12, ratio: 0.85, joinLong: 0.5, noise: 0.01 },
    church: { lucPull: 0.15, lucBase: 25, lucFollow: 140, lucState: 8, huongPull: 0.2, kyInit: [30, 70], kyUp: 0.6, kyDown: 0.2, kyMin: 10, kyMax: 95 },
    khoan: { pull: 0.05, min: 5, max: 95, base: 55, docQuyen: -12, nho: 0.15, noise: 8 },
    state: { switchP: 0.04 },                   // xác suất mỗi năm triều đổi quốc giáo theo ô 1 của vùng khi đang lệch
    // Phái và dị giáo (rất hiếm): cực đoan hóa khi bị đàn áp, cải cách khi khoan dung cao mà giáo luật cứng.
    phai: { p: 0.0008, persecMul: 3, max: 3, kyShift: 10, cuc_doan: 'Phái nghiêm khắc', cai_cach: 'Phái cải cách' },
    // Móc nhỏ có trần.
    hook: { mood: 0.3, moodCap: 0.6, stab: 0.5, stabCap: 0.6, van: 0.8, vanCap: 1, mid: 0.9, vanMid: 0.97 }, // mid: mức hợp lòng dân được coi là bình thường (hệ số bù, để trung bình gần 0)
    // Nơi thờ tự (loại địa điểm `tho_tu`): ba nơi mỗi vùng, thứ tự theo ô.
    site: { months: 1, anchorTypes: ['thanh_tri', 'thon_tran', 'ben', 'tram', 'bo_toc'] },
    // Tín ngưỡng cá nhân: mức sùng đạo.
    tam: ['Thế tục', 'Tin sơ', 'Sùng đạo'],
    tamStart: [0.2, 0.85],                      // băm dưới 0,2: thế tục; dưới 0,85: tin sơ; còn lại sùng đạo
    // Dịch vụ ở nơi thờ tự.
    service: { feeLe: 1, feeKinh: 2, feeChua: 8, daoLe: 2, daoKinh: 1, daoHuongHuong: 2, huongHuongMonths: 60, kinhForTamMa: 3, leForTam: 12, shunMonths: 24 },
    // Quốc giáo và khoan dung ban đầu của chín tông (null: thế tục). S mục 8.6 (7).
    sect: {
      tc_thanh_van: ['nho', 75], dh_thuy_nguyet: ['than_dao', 60], ts_kim_phong: [null, 55], nl_bach_thao: ['phat', 70],
      bb_huyen_bang: ['dan_gian', 60], hs_liet_hoa: [null, 40], hm_nhat_luan: ['hoi', 35], vt_am_hon: ['to_tien', 50], ld_tu_loi: [null, 55]
    },
    levels: [{ min: 75, n: 'rất mạnh' }, { min: 55, n: 'mạnh' }, { min: 35, n: 'vừa' }, { min: 0, n: 'còn nhỏ yếu' }],
    khoanWords: [{ min: 70, n: 'rất khoan dung' }, { min: 50, n: 'khoan dung' }, { min: 30, n: 'nghiêm ngặt' }, { min: 0, n: 'khắt khe' }]
  };
})();
