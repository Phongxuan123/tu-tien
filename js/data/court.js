// Triều chính (S7, ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 5.5) và phần còn lại của F2: trưng binh theo chư hầu, nhiệm vụ thế lực, thông gia, thuế thương hội.
// Mọi hệ số ở đây chỉnh được; hệ thống ở js/systems/court.js. Tên cổ trang, không dùng tên nước thật.
// D.COURT.on = false thì mọi thứ trong file này tắt, thế giới trùng khít mốc trước S7 (xem tools/baseline.js --court=off).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.COURT = {
    on: true,
    start: [42, 62],                            // hoàng quyền khởi đầu (băm theo hạt giống và triều, không dùng rng)
    // ----- Hoàng quyền 0..100 -----
    hq: {
      pull: 0.15, base: 55,
      tai: 0.22, de: 0.18, leadMid: 50,         // tài và đức của người đứng đầu kéo hoàng quyền
      quyen: 0.3, quyenMid: 35,                 // thế gia mạnh kéo hoàng quyền xuống
      war: -5,                                  // đang có chiến tranh
      noise: 2.5,                               // nhiễu mỗi năm (băm)
      strong: 65, weak: 35,                     // mạnh (vững) và yếu (dưới)
      newRuler: 45,                             // người mới lên ngôi (đổi chủ, chia cắt, thua trận)
      faith: -6                                 // triều đổi quốc giáo: quyền thần lợi dụng
    },
    // Tác dụng hoàng quyền lên quốc vận (mỗi năm).
    vanStrong: 0.4, vanWeak: -0.6,
    luc: { quyen: 60, hq: 40, d: -0.5 },        // thế gia mạnh mà hoàng quyền dưới 40: triều lục đục
    // Bậc thế gia trong triều (quyền = sức mạnh gia tộc mạnh nhất cùng vùng; đọc, không lưu).
    quyenBand: [{ min: 60, n: 'thế gia mạnh' }, { min: 30, n: 'thế gia vừa' }, { min: 1, n: 'thế gia yếu' }, { min: 0, n: 'không có thế gia lớn' }],
    // Thái tử: sau `delay` năm chưa lập thì mỗi năm có `p` xác suất lập.
    heir: { delay: 6, p: 0.25 },
    // Kế vị: xác suất tranh ngôi = base, thêm khi hoàng quyền yếu, thế gia đủ mạnh, chưa lập thái tử; trần max.
    succ: { base: 0.15, weak: 0.35, quyen: 0.15, noHeir: 0.2, max: 0.8, hqPeace: 4, hqHeir: 5, hqTong: 10, hqQuyen: 15, quyenWin: 55 },
    // Nội chiến nhỏ (có trần): chỉ khi tranh ngôi lúc hoàng quyền dưới hqMax, thế gia từ quyenMin; mỗi triều tối đa một lần trong `years` năm.
    civil: { hqMax: 35, quyenMin: 50, years: 60, p: 0.5, power: 0.85, mood: 6, unity: 8 },
    // Quốc sách với tu sĩ: đổi mỗi `every` năm (lệch theo triều), đổi hiếm.
    sach: {
      every: 40, p: 0.3,                          // xét mỗi `every` năm, đổi với xác suất p (đổi hiếm)
      kinds: {
        tu_do: { n: 'Tự do', desc: 'tu sĩ đi lại không hạn chế, thuế nhẹ, dễ loạn.', van: 0, tong: 0, ta: 0, tuong: false },
        chieu_du: { n: 'Chiêu dụ', desc: 'tu sĩ được cung phụng làm tướng; quốc vận nhỉnh, tông trong vùng bớt bất mãn.', van: 0.3, tong: -0.2, ta: 0, tuong: true },
        han_che: { n: 'Hạn chế', desc: 'tu sĩ phải đăng ký, cấm tư đấu trong thành; tà khí bớt, tông bất mãn.', van: 0.1, tong: -0.3, ta: -6, tuong: false },
        cam: { n: 'Cấm', desc: 'cấm tu sĩ tụ tập và đi lại; tà tu ẩn náu, dân oán, tông bất mãn nặng.', van: -0.8, tong: -0.8, ta: 4, tuong: false }
      },
      // trọng số cơ bản và điều chỉnh theo tình thế (hoàng quyền, thế gia, quốc vận)
      w: { tu_do: 3, chieu_du: 1.5, han_che: 1.5, cam: 0.7 },
      weak: { cam: 2, han_che: 1 },                 // hoàng quyền yếu
      quyen: { chieu_du: 2 },                       // thế gia mạnh muốn tu sĩ cung phụng
      van: { chieu_du: 1, tu_do: 1 },               // quốc vận cao
      vanLow: { cam: 1.5 }                          // quốc vận thấp
    },
    // ----- Trưng binh theo chư hầu (F2): khi bên chủ có chiến tranh, chư hầu là vương triều gửi quân.
    levy: { ratio: 0.25, cap: 6000, strain: 2, decay: 0.5, mulMax: 0.25 },
    // ----- Nhiệm vụ thế lực (F2): tỉ lệ đề nghị có nhiệm vụ thế lực thay cho nhiệm vụ thường khi người giao là thế lực.
    questP: 0.35,
    // ----- Thông gia (hon_uoc): hai bên đồng minh, quan hệ đủ tốt, mỗi năm có xác suất `p`.
    marry: { p: 0.04, min: 40, rel: 12, years: 30, strain: 10 },
    // ----- Thuế thương hội: thương hội nộp một tỉ phần kho cho triều của vùng nó đặt.
    hoiTax: 0.02, hoiStrain: 6
  };

  // Hai loại hiệp ước mới (F2): thông gia và thuế thương hội. Loại cũ ở js/data/population.js.
  Object.assign(D.PACT.kinds, {
    hon_uoc: { n: 'Thông gia', what: 'kết thông gia với' },
    thue_hoi: { n: 'Thuế thương hội', what: 'nộp thuế thương hội cho' }
  });
})();
