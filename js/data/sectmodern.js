// Tông môn "hiện đại hóa" (S2): giá trị, hành vi, bảy chỉ số, năm chính sách, công–tội, bí mật, bộ máy tên cổ trang.
// Nguyên mẫu gợi ý nằm ở các chú thích bên dưới (chỉ để thiết kế, KHÔNG xuất hiện trong chữ của game: tên nước thật không dùng).
// Bổ sung thẳng vào D.SECTS[id]; các trường cũ (align, elems, law, secret...) giữ nguyên.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  // Năm trục giá trị: -100..100. Hai đầu mỗi trục.
  D.SECT_GT = {
    keys: ['tu', 'ca', 'doi', 'mo', 'tin'],
    axes: { tu: ['Tự do', 'Trật tự'], ca: ['Cá nhân', 'Tập thể'], doi: ['Truyền thống', 'Đổi mới'], mo: ['Khép kín', 'Mở cửa'], tin: ['Thế tục', 'Tín ngưỡng'] }
  };
  // Hành vi (nhan): -100 tàn nhẫn .. 100 nhân đạo. Không phải nhãn, đổi theo việc tông làm; nhãn chính/trung/tà suy ra từ đây (xem TT.sect.alignId).
  D.SECT_NHAN = { chinh: 15, ta: -30 }; // từ 15 trở lên: chính đạo; từ -30 trở xuống: tà đạo; còn lại: trung lập (giữ nguyên phân loại cũ)
  // Bảy chỉ số 0..100.
  D.SECT_STATS = { keys: ['kt', 'qs', 'kh', 'vh', 'ng', 'on', 'tt'], names: { kt: 'Kinh tế', qs: 'Quân sự', kh: 'Khoa học pháp thuật', vh: 'Văn hóa mềm', ng: 'Ngoại giao', on: 'Ổn định nội bộ', tt: 'Thông tin' } };
  // Năm chính sách.
  D.SECT_POLICY = {
    keys: ['theche', 'kinhte', 'quansu', 'doingoai', 'nhantai'],
    names: { theche: 'Thể chế', kinhte: 'Kinh tế', quansu: 'Quân sự', doingoai: 'Đối ngoại', nhantai: 'Nhân tài' },
    opt: {
      theche: { tap_quyen: 'Tập quyền chưởng môn', hoi_dong: 'Hội đồng trưởng lão', bau_cu: 'Bầu chọn trong hàng ngũ', than_quyen: 'Thần quyền', the_tap: 'Thế tập' },
      kinhte: { ke_hoach: 'Kế hoạch', thi_truong: 'Thị trường tự do', hon_hop: 'Hỗn hợp', tu_luc: 'Tự lực khép kín', tai_nguyen: 'Dựa tài nguyên' },
      quansu: { thuong_truc: 'Thường trực tinh nhuệ', nghia_vu: 'Nghĩa vụ toàn tông', thue_ngoai: 'Thuê ngoài', phong_thu: 'Chỉ phòng thủ' },
      doingoai: { banh_truong: 'Bành trướng', lien_minh: 'Liên minh', trung_lap: 'Trung lập', co_lap: 'Cô lập', buon_ban: 'Buôn bán' },
      nhantai: { thi_tuyen: 'Thi tuyển', huyet_thong: 'Huyết thống', mo_cua: 'Mở cửa', bao_lanh: 'Bảo lãnh và tiến cử' }
    }
  };
  // Tên cổ trang của các nhà trong phố tông môn (mỗi tông một bộ): id công trình -> tên hiển thị. Nhà nào không ghi thì dùng tên chung.
  // `them`: các cơ quan đặc trưng chưa có dịch vụ riêng (sẽ mở ở các chặng sau): { n, desc }.
  D.SECT_CORE_ORGS = {
    chap: 'Chấp Pháp Đường', duoc: 'Đan Các', tang: 'Tàng Kinh Các', ngoai: 'Ngoại Vụ Đường', khoc: 'Tài Các'
  };

  // Dữ liệu từng tông. gt theo thứ tự D.SECT_GT.keys; chiso theo D.SECT_STATS.keys; chinhsach theo D.SECT_POLICY.keys.
  const M = {
    // Nguyên mẫu: đế quốc quan liêu tập quyền, thi cử lâu đời.
    tc_thanh_van: {
      gt: [65, 55, 10, -5, -35], nhan: 30, chiso: [68, 55, 58, 66, 52, 62, 72], chinhsach: ['tap_quyen', 'hon_hop', 'thuong_truc', 'lien_minh', 'thi_tuyen'],
      phongcach: 'Một tông lớn quy củ như triều đình: nhiều tầng quan, thi tuyển công khai, kế hoạch dài hơi cho cả vùng.',
      cong: ['Nhận đông đệ tử phàm nhân nhất vùng, mở thư viện cho dân.', 'Lo trị thủy, đường sá và kho lương cho vùng Trung Châu.', 'Thi tuyển công bằng, người hàn vi cũng có đường lên.'],
      toi: ['Niêm phong sách và tin bị cho là bất lợi.', 'Ép đồng thuận, nhồi khuôn đệ tử vào một nếp nghĩ.', 'Khuyến khích đệ tử tố giác lẫn nhau.'],
      bimat: 'Một đời chưởng môn từng ém một trận dịch để giữ yên ổn: cứu được nhiều người, nhưng giấu cả sự thật.',
      them: [{ n: 'Thiên Cơ Các', desc: 'Giữ tin tức của tông và kiểm soát tin đồn.' }, { n: 'Mật Các', desc: 'Giám sát nội bộ.' }],
      coquan: { tang: 'Học Cung Tàng Kinh Các' }
    },
    // Nguyên mẫu: đảo quốc tinh xảo, trọng truyền thống và kỷ luật tập thể.
    dh_thuy_nguyet: {
      gt: [45, 60, 25, -45, 20], nhan: 35, chiso: [60, 48, 72, 74, 42, 70, 50], chinhsach: ['hoi_dong', 'tu_luc', 'phong_thu', 'trung_lap', 'bao_lanh'],
      phongcach: 'Cung điện nữ tu trên biển, giỏi chế tác tinh xảo, giữ lễ nghi và kỷ luật chung như một nếp sống.',
      cong: ['Chế tác bền đẹp, từng cứu nhiều ngư dân gặp bão.', 'Lễ nghi hòa nhã, giữ gìn nghề thủ công cổ.', 'Kỷ luật tập thể giúp cứu hộ trên biển rất giỏi.'],
      toi: ['Bảo thủ, từ chối cải cách.', 'Áp lực tập thể khiến đệ tử kiệt sức.', 'Khép kín với người ngoài, thế hệ trẻ ít dần.'],
      bimat: 'Một điều lệ cũ từng khiến một phái cải cách bị im lặng, nhiều người tài lặng lẽ bỏ đi.',
      them: [{ n: 'Hải Vụ Đường', desc: 'Thủy quân nhỏ mà tinh, canh giữ vùng biển.' }, { n: 'Lễ Đường', desc: 'Giữ lễ nghi và truyền thống.' }, { n: 'Y Quán', desc: 'Chữa trị người gặp nạn trên biển.' }],
      coquan: { duoc: 'Khí Các', ngoai: 'Hải Vụ Đường' }
    },
    // Nguyên mẫu: cường quốc kỹ nghệ, kỷ luật, quy trình.
    ts_kim_phong: {
      gt: [70, 30, 35, 5, -20], nhan: 18, chiso: [66, 72, 70, 48, 50, 68, 46], chinhsach: ['tap_quyen', 'hon_hop', 'thuong_truc', 'lien_minh', 'thi_tuyen'],
      phongcach: 'Kiếm tu kỷ luật và kỹ nghệ: mọi việc đi theo quy trình, mọi mẻ kiếm phải đúng chuẩn.',
      cong: ['Kỹ thuật kiếm trận chuẩn mực, nhiều đời giữ tiếng.', 'Pháp quyền rõ ràng, giữ lời hiệp ước.', 'Kiếm bền, giúp dân vùng núi tự vệ.'],
      toi: ['Quan liêu cứng, coi quy trình hơn con người.', 'Từng dùng "trật tự" để gây họa trong một cuộc chiến cũ.', 'Hà khắc với người không đạt chuẩn.'],
      bimat: 'Một người từng bị Phù Các từ chối quyền luyện chế phù vì thiếu "phù căn" dù cố gắng nhiều năm, rồi âm thầm lên đến chức chưởng môn và phát động cuộc chiến chưa từng có.',
      them: [{ n: 'Trận Các', desc: 'Thiết kế kiếm trận và đại trận hộ sơn.' }, { n: 'Phù Các', desc: 'Giữ dòng "Chuẩn phù", cần phù căn mới được học.' }],
      coquan: { duoc: 'Khí Các' }
    },
    // Nguyên mẫu: quốc gia đông dân, đa dạng, mạnh y dược và học thuật.
    nl_bach_thao: {
      gt: [0, 10, 20, 30, 60], nhan: 40, chiso: [52, 40, 66, 70, 60, 48, 44], chinhsach: ['hoi_dong', 'thi_truong', 'phong_thu', 'buon_ban', 'mo_cua'],
      phongcach: 'Tông luyện đan đông người, nhiều phái cùng sống chung, mạnh về thuốc và học vấn nhưng thủ tục chậm.',
      cong: ['Cứu dân bằng y dược, mở Y Quán khắp vùng.', 'Nhiều trường phái tranh luận cởi mở.', 'Nhân tài đông, ai có duyên với cỏ cây đều được nhận.'],
      toi: ['Phân tầng: đan sư đứng trên thảo dân.', 'Thủ tục chậm, bất bình đẳng.', 'Độc quyền bí phương, đẩy giá thuốc.'],
      bimat: 'Một trận dịch từng bị ém vì lợi ích, nhiều người chết mà không ai biết.',
      them: [{ n: 'Y Quán', desc: 'Chữa bệnh và chống dịch.' }, { n: 'Học Cung', desc: 'Đào tạo nhiều phái dược.' }],
      coquan: { duoc: 'Đan Các' }
    },
    // Nguyên mẫu: cường quốc rộng lớn, nhiều tài nguyên, khắc nghiệt.
    bb_huyen_bang: {
      gt: [60, 40, -5, -40, 10], nhan: -5, chiso: [56, 76, 60, 44, 40, 52, 68], chinhsach: ['the_tap', 'tai_nguyen', 'thuong_truc', 'co_lap', 'bao_lanh'],
      phongcach: 'Cung điện băng rộng lớn và khắc nghiệt: quyền lực tập trung, quân đông, sống bằng linh thạch và băng ngọc.',
      cong: ['Bền bỉ giữa thiên tai, che chở vùng biên.', 'Giữ khoa học nền tảng của băng và thủy.', 'Kiên cường khi bị xâm lăng.'],
      toi: ['Quyền lực tập trung, tham nhũng kéo dài.', 'Dùng tài nguyên làm vũ khí chính trị.', 'Đàn áp tiếng nói bất đồng.'],
      bimat: 'Kho linh thạch bị biển thủ qua nhiều đời, quân thực ra yếu hơn vẻ ngoài.',
      them: [{ n: 'Quân Doanh', desc: 'Doanh trại thường trực của tông.' }, { n: 'Mật Các', desc: 'Tai mắt trong và ngoài tông.' }],
      coquan: { ngoai: 'Dịch Trạm' }
    },
    // Nguyên mẫu: cường quốc công nghiệp, cá nhân, đổi mới.
    hs_liet_hoa: {
      gt: [-35, -60, 70, 55, 15], nhan: 8, chiso: [76, 70, 76, 72, 62, 42, 58], chinhsach: ['bau_cu', 'thi_truong', 'thue_ngoai', 'banh_truong', 'mo_cua'],
      phongcach: 'Tông luyện khí nóng tính và ham đổi mới: cạnh tranh giữa các lò, hút nhân tài khắp nơi, ít ai chịu nghe ai.',
      cong: ['Đổi mới liên tục và nhận người từ mọi xuất thân.', 'Cứu trợ hào phóng khi thiên tai.', 'Kỹ nghệ luyện khí lan ra cho cả vùng.'],
      toi: ['Giàu nghèo cách biệt, phe cánh chia rẽ.', 'Hay can thiệp xa gây hậu quả khó lường.', 'Chạy theo lợi nhuận.'],
      bimat: 'Một lò luyện khí từng gây ô nhiễm nghiêm trọng và bị che giấu.',
      them: [{ n: 'Thiên Cơ Các', desc: 'Truyền tin và khuếch trương tiếng tăm.' }, { n: 'Tài Các', desc: 'Huy động vốn và bảo hiểm cho các lò.' }],
      coquan: { duoc: 'Khí Các', khoc: 'Tài Các' }
    },
    // Nguyên mẫu: các nhà nước sa mạc thần quyền, văn minh cổ, tài nguyên quý.
    hm_nhat_luan: {
      gt: [55, 45, -30, -20, 85], nhan: 5, chiso: [64, 56, 46, 56, 46, 58, 52], chinhsach: ['than_quyen', 'tai_nguyen', 'nghia_vu', 'lien_minh', 'huyet_thong'],
      phongcach: 'Giáo phái thờ mặt trời giữa sa mạc: tôn ti rõ ràng, học thuật cổ, hiếu khách, sống nhờ linh thạch và thương lộ.',
      cong: ['Giữ học thuật cổ về thiên văn và y.', 'Hiếu khách: khách là thượng khách.', 'Chia linh thạch cho đền chùa và cứu trợ.'],
      toi: ['Hạn chế tự do tư tưởng và cải cách.', 'Phụ thuộc xuất khẩu linh thạch.', 'Ưu tiên tín đồ khi chia việc và chức vị.'],
      bimat: 'Một giáo chủ từng giấu một phát hiện thiên văn trái giáo lý.',
      them: [{ n: 'Thiên Văn Đài', desc: 'Quan sát tinh tượng, chọn ngày lễ.' }, { n: 'Mật Các', desc: 'Giữ kín những điều trái giáo lý.' }, { n: 'Y Quán', desc: 'Y học cổ của sa mạc.' }],
      coquan: { tang: 'Thiên Văn Tàng Kinh Các' }
    },
    // Nguyên mẫu: hãn quốc chinh phục, nghiêng về ác nhưng không thuần ác.
    vt_am_hon: {
      gt: [50, 50, 5, 10, 25], nhan: -45, chiso: [40, 78, 50, 30, 44, 56, 70], chinhsach: ['tap_quyen', 'tai_nguyen', 'nghia_vu', 'banh_truong', 'mo_cua'],
      phongcach: 'Giáo phái u tối do một hãn đứng đầu: thăng người theo tài không theo xuất thân, kỷ luật sắt, sống bằng cống nạp và chinh phạt.',
      cong: ['Tuyển người theo tài, không hỏi xuất thân.', 'Khoan dung tín ngưỡng của kẻ chịu thần phục, giữ bưu trạm và an ninh thương lộ.'],
      toi: ['Đồ thành kháng cự để cảnh cáo, lấy hồn người luyện hồn nô.', 'Khủng bố tâm lý, bắt cống nặng.', 'Cướp bóc thương lộ khi cần.', 'Thanh trừng không nương tay.'],
      bimat: 'Nghi lễ luyện hồn thực ra giữ hồn người chết không tan, một kiểu an ủi méo mó của vị hãn đầu tiên.',
      them: [{ n: 'Hồn Kỵ Doanh', desc: 'Kỵ binh cơ động cùng hồn nô.' }, { n: 'Mật Các', desc: 'Tai mắt trong mọi thành bị chinh phục.' }],
      coquan: { ngoai: 'Dịch Trạm', chap: 'Hình Đường' }
    },
    // Nguyên mẫu: đảo quốc hải dương, pháp quyền, thương mại, đế quốc cũ.
    ld_tu_loi: {
      gt: [20, -10, 10, 25, -15], nhan: 20, chiso: [66, 60, 58, 62, 74, 64, 62], chinhsach: ['hoi_dong', 'thi_truong', 'phong_thu', 'lien_minh', 'thi_tuyen'],
      phongcach: 'Đạo quán trên đảo giông bão: hội đồng trưởng lão tranh luận công khai, trọng luật, thương mại và thủy quân.',
      cong: ['Pháp luật được tôn trọng ở mức tương đối.', 'Thủy quân bảo vệ thương lộ.', 'Tranh luận công khai, nghe được tiếng nói khác.'],
      toi: ['Kiêu ngạo của một đế quốc cũ.', 'Vơ vét chư hầu bằng cống nạp.', '"Chia để trị" giữa các thế lực.'],
      bimat: 'Một hiệp ước cũ từng bị bội để lấy lợi.',
      them: [{ n: 'Hải Vụ Đường', desc: 'Thủy quân và thương vụ.' }, { n: 'Pháp Đường', desc: 'Xét xử theo luật.' }, { n: 'Trận Các', desc: 'Lôi trận phòng thủ đảo.' }],
      coquan: { ngoai: 'Hải Vụ Đường', chap: 'Pháp Đường' }
    }
  };
  Object.keys(M).forEach(id => {
    const d = D.SECTS[id]; if (!d) return;
    Object.assign(d, M[id], { nhan0: M[id].nhan });
    // `align` là nhãn SUY RA từ hành vi `nhan` (ngưỡng ở D.SECT_NHAN) của THẾ GIỚI đang chạy (world.fac.sx, xem systems/sectmod.js).
    // Thế giới chưa có bản ghi thì dùng giá trị khởi đầu d.nhan; mọi chỗ cũ đọc d.align vẫn chạy.
    Object.defineProperty(d, 'align', { enumerable: true, configurable: true, get() {
      const s = TT.world && TT.world.fac && TT.world.fac.sx && TT.world.fac.sx[id];
      const n = s ? s.nhan : d.nhan;
      return n >= D.SECT_NHAN.chinh ? 'chinh' : n <= D.SECT_NHAN.ta ? 'ta' : 'trung';
    } });
  });

  // Mô hình tông (S4): sức mạnh suy từ chỉ số, tác dụng nhỏ có trần của năm chính sách, thanh trừng nội bộ hiếm.
  // Mọi hệ số chỉnh được ở đây. on = false: mọi hệ số trung tính, thanh trừng không xảy ra (tools/baseline.js --sect=off).
  D.SECT_MOD = {
    on: true,
    // power suy từ trung bình bảy chỉ số: 0,9 điểm cho mỗi điểm lệch khỏi 58,6 (trung bình khởi đầu của chín tông, hệ số bù).
    power: { kStat: 0.9, statMid: 58.6 },
    // Chỉ số kéo về mức khởi đầu mỗi năm (pull); ổn định nội bộ (on) theo đoàn kết (onUnity điểm cho mỗi điểm đoàn kết trên 60).
    stat: { pull: 0.03, onUnity: 0.5 },
    qsK: 0.1,                                   // quân sự (chỉ số) thêm vào sức mạnh đánh nhau: ±10% ở 0 và 100
    cap: { mul: [0.8, 1.2], mil: [0.85, 1.15], drift: 1, ally: 6 },   // trần các hệ số (nhân, quân sự, cộng của cải, ngưỡng minh ước)
    // Năm chính sách, theo thứ tự D.SECT_POLICY.keys. Mỗi dòng một chính sách.
    theche: { tap_quyen: 0.7, hoi_dong: 1.1, bau_cu: 1.3, than_quyen: 0.8, the_tap: 1 },        // nhân biến động ngẫu nhiên của đoàn kết
    kinhte: { ke_hoach: 0, thi_truong: 0.5, hon_hop: 0.2, tu_luc: -0.3, tai_nguyen: 0.3 },     // cộng vào của cải mỗi năm (điểm)
    quansu: { thuong_truc: 1.08, nghia_vu: 1.05, thue_ngoai: 0.98, phong_thu: 1.02 },          // nhân sức mạnh khi đánh nhau
    doingoai: { banh_truong: 1.2, lien_minh: 1, trung_lap: 0.9, co_lap: 0.85, buon_ban: 0.8 },   // nhân xác suất gây chiến
    doingoaiMinh: { lien_minh: 6, buon_ban: 3, co_lap: -6 },                                    // hạ (âm: nâng) ngưỡng thân thiết để kết minh
    nhantai: { thi_tuyen: 1, huyet_thong: 0.8, mo_cua: 1.25, bao_lanh: 1.1 },                   // nhân xác suất đệ tử xin gia nhập
    // Thanh trừng nội bộ: khi ổn định (on) thấp hoặc triều vùng đổi chủ. Mỗi tông tối đa một lần mỗi cdMin..cdMax năm.
    purge: {
      cdMin: 80, cdMax: 150,
      onBelow: 34, chance: 0.07,                // on dưới ngưỡng: mỗi năm có chance (băm, không rng)
      rulerYears: 6, rulerChance: 0.1,          // triều vùng đổi chủ trong vài năm gần đây: mỗi năm có rulerChance
      gtTu: 12, gtCa: 8,                        // giá trị: thêm trật tự và tập thể
      nhanCut: [8, 15],                         // hành vi tàn nhẫn thêm (điểm)
      onGain: 10, ttGain: 5,                    // ổn định và thông tin tăng ngay (kiểm soát)
      unityHit: 10, powerCut: 4,                // đoàn kết và sức mạnh giảm
      kill: [1, 3]                              // số đệ tử NPC bị trục khỏi tông (không đụng nhân vật người chơi)
    }
  };

  // Gia tộc (8): kiểu theo thứ tự id gt_0..gt_7 (không dùng rng). Hội (3) và 9 vương triều: nguyên mẫu để hiển thị mô tả.
  D.GIA_KIEU = {
    order: ['tai_phiet', 'tai_phiet', 'tai_phiet', 'thuong_gia', 'thuong_gia', 'thuong_gia', 'hoc_thuat', 'hoc_thuat'],
    info: {
      tai_phiet: { n: 'Tài phiệt', desc: 'Gia tộc giàu có nhiều đời: cho triều vay, nuôi nghệ nhân và nhà nghiên cứu, có tiếng nói chính trị lớn.' },
      thuong_gia: { n: 'Thương gia', desc: 'Dòng tộc đi buôn đường dài: nắm đường dây, hôn nhân để mở đường, tin tức thương lộ.' },
      hoc_thuat: { n: 'Thế gia học thuật', desc: 'Gia tộc nhiều đời giữ sách và học vấn: ít quân nhưng nhiều tiếng nói, làm cố vấn cho triều.' }
    }
  };
  D.HOI_STYLE = ['Hội đồng thương gia của một đô thị đầm phá cổ, đội tàu và kho lớn, thân với triều.', 'Liên minh nhiều thành thị buôn bán tự trị, chung luật thương mại, ít quân.', 'Cảng tự do hỗn tạp: buôn lậu, ngân phiếu ngầm, quyền lực ẩn sau chợ đen.'];
  D.NATION_STYLE = {
    trung_chau: 'Văn trị cao, quân đông nhưng phẩm trung bình, triều chính phức tạp.',
    dong_hai: 'Thủy quân và thương nghiệp, đê điều, thuế thương mại.',
    tay_son: 'Sơn binh tinh nhuệ, kiếm trận, tăng lữ, ít dân.',
    nam_lam: 'Nghĩa quân, độc dược, du kích, khó chinh phục.',
    bac_bang: 'Băng kỵ, hội đồng làng, rất ít dân nhưng phẩm cao.',
    hoa_son: 'Hỏa khí và kỹ nghệ rèn, quân thường trực.',
    hoang_mac: 'Kỵ binh cơ động, thiên văn, ốc đảo là then chốt.',
    vu_trach: 'Quân hỗn tạp, âm khí, nhiều tà tu cung phụng, thành bang tự trị.',
    loi_dao: 'Lôi pháo và thủy quân, thành bang đối địch, ít quân nhưng sát khí cao.'
  };
})();
