// Quốc vận, nho khí và long mạch của chín vương triều (S3, xem ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 5.1 đến 5.3).
// Mọi hệ số ở đây chỉnh được; hệ thống ở js/systems/nation.js. Tên cổ trang, không dùng tên nước thật.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.NATION = {
    on: true,                                   // công tắc: bật thì sức mạnh `power` của triều lệch theo quốc vận và nho khí (tắt để đo so sánh)
    // Bậc quốc vận (từ cao xuống thấp).
    tiers: [
      { min: 80, id: 'rong_bay', n: 'Rồng bay', cls: 'good', desc: 'Quốc thái dân an, ít thiên tai, vua tôi đồng lòng.' },
      { min: 60, id: 'thinh', n: 'Thịnh', cls: 'good', desc: 'Ổn định, thu thuế tốt.' },
      { min: 35, id: 'binh', n: 'Bình', cls: '', desc: 'Bình thường.' },
      { min: 15, id: 'suy', n: 'Suy', cls: 'bad', desc: 'Thiên tai nhiều, dân bất mãn, triều đình lục đục.' },
      { min: 0, id: 'mat', n: 'Mạt', cls: 'bad', desc: 'Sắp mất mệnh.' }
    ],
    // Bậc nho khí.
    nhoTiers: [
      { min: 75, id: 'chinh_khi', n: 'Chính khí rạng', cls: 'good' },
      { min: 55, id: 'van_thinh', n: 'Văn phong thịnh', cls: 'good' },
      { min: 35, id: 'le_nghia', n: 'Lễ nghĩa tạm giữ', cls: '' },
      { min: 15, id: 'van_suy', n: 'Văn đạo suy', cls: 'bad' },
      { min: 0, id: 'phe_van', n: 'Phế văn', cls: 'bad' }
    ],
    // Long mạch (0 đến 5) của từng vùng: mạch tốt thì vận hồi nhanh (nối chặng N về sau).
    mach: { trung_chau: 4, dong_hai: 3, tay_son: 5, nam_lam: 3, bac_bang: 2, hoa_son: 4, hoang_mac: 2, vu_trach: 1, loi_dao: 3 },
    machNames: ['Mạch cạn', 'Mạch yếu', 'Mạch thường', 'Mạch khá', 'Mạch tốt', 'Long mạch hưng vượng'],
    start: { van: [42, 66], nho: [38, 62] },    // khoảng khởi đầu (chọn xác định theo hạt giống và vùng, không dùng rng)

    // ----- Quốc vận hằng năm -----
    van: {
      pull: 0.18,                               // tốc độ kéo về mức mục tiêu
      base: 55,                                 // mục tiêu khi dân tâm bình thường, nho khí vừa, mạch thường, vua tầm thường
      mood: 0.45, moodMid: 55,                  // dân tâm lệch so với 55 nhân hệ số
      nho: 0.18, nhoMid: 50,                    // nho khí
      mach: 3.5, machMid: 2.5,                  // long mạch
      lead: 0.3, leadMid: 100,                 // đức + tài của người đứng đầu (mỗi cái 0..100)
      war: -1.5,                                // mỗi năm đang có chiến tranh
      front: -1,                              // chiến tuyến đặt trên đất nước mình (bị đánh)
      riot: -3,                                 // đang có loạn dân
      shock: -1.5, shockMax: 2,                 // mỗi thiên tai (tối đa 2 cái)
      defy: -0.5, defyMax: 3,                   // mỗi hiệp ước bị bất tuân (tối đa 3 cái)
      era: { thinh: 1.5, loan: -1.5, linh_khi: 0.8, mat_phap: -0.6 },
      noise: 3.0,                               // nhiễu mỗi năm (xác định theo hạt giống, không dùng rng)
      winGain: 3, loseLoss: 8, lawfulGain: 2    // thắng, thua trận; thắng khi đối phương gây hấn trước
    },
    // ----- Nho khí hằng năm -----
    nho: {
      pull: 0.1,
      base: 50, lead: 0.1,                      // người đứng đầu hiếu học (tài) và đức kéo nho khí
      mach: 0, mood: 0.1,
      war: -1.2, riot: -2.5, hunger: -1, hungerBelow: 42, // mất mùa kéo dài (độ no của dân)
      era: { thinh: 1.2, loan: -1.2, linh_khi: 0.5, mat_phap: -0.4 },
      khoa: { every: 3, gain: 3 },              // khoa cử 3 năm một lần
      noise: 1.5
    },
    // ----- Thiên mệnh -----
    mat: {
      below: 15, years: 3,                      // quốc vận dưới ngưỡng trong chừng ấy năm liên tiếp thì mất mệnh
      // trọng số kết cục: đổi chủ, chia cắt, thôn tính (thôn tính cần một triều láng giềng mạnh hơn)
      w: { doi_chu: 5, chia_cat: 3, thon_tinh: 3 },
      vanAfter: { doi_chu: 45, chia_cat: 38, thon_tinh: 35 },
      nhoLoss: 8,
      cutPower: 0.55, cutWealth: 0.7, cutUnity: 30, cutMood: 10,
      annexPower: 0.6, annexUnity: 35,
      histMax: 8
    },
    // ----- Suy `power` từ quốc vận và nho khí (hệ số bù để trung bình không đổi) -----
    power: { kVan: 0.22, kNho: 0.10, vanMid: 55, nhoMid: 58 },
    pop: { moodK: 0.4, moodMin: 0.8, moodMax: 1.3 },   // dân tâm hồi nhanh khi vận cao (nhân vào tốc độ hồi 0,08)
    // ----- Tà khí vùng (nho khí trấn tà) -----
    ta: { perSect: 18, riot: 10, front: 8, hunger: 6, nhoCut: 0.65, dangerAt: 45 },
    // ----- Tác dụng lên người chơi (nhỏ, có trần) -----
    effect: { dangerMatBelow: 15, luckThinh: 1, luckRong: 2 },
    // ----- Phản phệ (S mục 5.2): tu sĩ gây họa cho phàm triều bị nghiệp báo, tỉ lệ theo quốc vận nước đó -----
    backlash: {
      kinds: {
        giet_vua: { n: 'giết vua', nghiep: 8, dao: 12, brk: 0.12 },
        danh_tan_quan: { n: 'đánh tan quân triều', nghiep: 4, dao: 6, brk: 0.07 },
        tan_sat: { n: 'tàn sát phàm dân', nghiep: 6, dao: 10, brk: 0.10 },
        pha_long_mach: { n: 'phá long mạch', nghiep: 10, dao: 15, brk: 0.15 }
      },
      vanScale: 70,                             // quốc vận bằng mức này thì phản phệ đúng 100%
      scaleMax: 1.3, scaleMinMat: 0.1,           // trần; nước vận Mạt gần như hết phản phệ
      cap: { nghiep: 20, dao: 25, brk: 0.2 },   // trần mỗi lần
      years: 10,                                // thời gian khó đột phá
      warnBelow: 25,                            // cảnh báo trước khi quốc vận còn cao hơn mức này (nặng)
      vanHit: { giet_vua: 12, danh_tan_quan: 5, tan_sat: 8, pha_long_mach: 25 },
      machHit: { pha_long_mach: 1 },
      atone: { nghiep: 2, years: 1 }            // việc thiện, tế lễ chuộc bớt
    },
    // ----- Văn vị và hạo nhiên khí của cá nhân (mức dữ liệu) -----
    vanVi: [
      { n: 'Dân thường', hao: 0 },
      { n: 'Đồng sinh', hao: 2 },
      { n: 'Tú tài', hao: 5 },
      { n: 'Cử nhân', hao: 9 },
      { n: 'Tiến sĩ', hao: 15 },
      { n: 'Đại nho', hao: 24 },
      { n: 'Thánh nhân', hao: 40 }
    ]
  };
})();
