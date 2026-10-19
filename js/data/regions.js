// Đại địa đồ: 9 vùng lớn. Mỗi vùng có chỉ số nền, môi trường (debuff thường trực), thời tiết (buff và debuff
// theo đợt), tỉ lệ sinh ra, và các bối cảnh xuất thân. Bối cảnh lấy cảm hứng từ đặc trưng thực tế của các
// kiểu quốc gia ngoài đời (mật độ dân số, tỉ lệ sinh, mức giàu nghèo), chỉ để tạo màu sắc, không nhắc tên thật.
//
// linh: linh khí, danger: nguy hiểm, rich: phồn hoa (nền cho địa điểm trong vùng).
// elems: thuộc tính tư chất hợp vùng (tu luyện nhanh hơn tới 80%).
// env.resist: thuộc tính giúp chống chịu môi trường. env.hpDrain: sinh lực mất mỗi tháng nếu không kháng.
// weather[]: chance mỗi tháng, dur tháng kéo dài; danger/hpDrain cộng thêm, travel nhân thời gian đi đường,
// gold/train nhân cho mọi người, elemBuff nhân tốc độ tu luyện cho người hợp thuộc tính.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  const ANY = ['thon_tran', 'thanh_tri', 'ben', 'cho_den', 'cua_ai', 'tram'];

  D.REGIONS = [
    {
      id: 'trung_chau', n: 'Trung Châu', terrain: 'Đồng bằng', color: '#c9a45a', x: 400, y: 280,
      linh: 2, danger: 1, rich: 5, elems: ['Thổ'], birth: 4,
      analog: 'Giống các nước giàu, dân số già, đô thị hóa cao, sinh suất thấp: ít ai được sinh ra ở đây nhưng sinh ra thì thường khá giả.',
      desc: 'Đồng bằng rộng lớn, thành trì san sát, chợ búa tấp nập. An toàn và dễ kiếm sống nhưng linh khí loãng.',
      env: { name: 'Phàm trần', desc: 'Linh khí loãng, tu luyện chậm hơn nhưng buôn bán thịnh vượng.', trainMul: 0.92, goldMul: 1.1, hpDrain: 0, healMul: 1, resist: [] },
      weather: [
        { id: 'thu_hoach', name: 'Mùa thu hoạch', desc: 'Chợ búa nhộn nhịp, dễ kiếm vàng hơn.', chance: 0.06, dur: 3, gold: 1.25 },
        { id: 'chien_loan', name: 'Chiến loạn', desc: 'Hai nước giao tranh, đường sá bất an, buôn bán ế ẩm.', chance: 0.008, dur: 12, danger: 1, gold: 0.8 }
      ],
      origins: [
        { name: 'con viên chức kinh thành', gold: 60, luck: 1, w: 30, types: ['thanh_tri'] },
        { name: 'con thương nhân', gold: 80, luck: 1, w: 25, types: ['thanh_tri', 'thuong_doan'] },
        { name: 'thiếu gia thế gia', gold: 150, luck: 2, w: 20, types: ['thanh_tri'] },
        { name: 'con nhà nông ngoại ô', gold: 10, luck: 0, w: 20, types: ['thon_tran'] },
        { name: 'cô nhi đường phố', gold: 0, luck: 4, w: 5, types: ANY }
      ]
    },
    {
      id: 'dong_hai', n: 'Đông Hải', terrain: 'Biển', color: '#4b88b8', x: 700, y: 280,
      linh: 3, danger: 3, rich: 2, elems: ['Thủy'], birth: 17,
      analog: 'Giống các quần đảo đông dân sống nhờ biển: nhiều ngư dân, thủy thủ, dân đảo.',
      desc: 'Biển cả mênh mông với những đảo nhỏ và ngư thôn. Thủy linh khí dồi dào, sóng gió bất thường.',
      env: { name: 'Ẩm thấp, gió biển', desc: 'Hơi ẩm và gió biển làm người yếu dễ ốm, nhưng thủy khí dồi dào.', trainMul: 1, goldMul: 1, hpDrain: 0.3, healMul: 1, resist: ['Thủy'] },
      weather: [
        { id: 'bao_bien', name: 'Bão biển', desc: 'Sóng lớn gây nguy hiểm và chậm đường đi. Người tu Thủy hấp thụ được thủy khí cuồng bạo.', chance: 0.03, dur: 3, danger: 2, travel: 1.5, elemBuff: { elems: ['Thủy'], train: 1.3 } },
        { id: 'ngu_trieu', name: 'Ngư triều', desc: 'Cá linh dậy sóng, ngư dân bội thu.', chance: 0.03, dur: 2, gold: 1.3 }
      ],
      origins: [
        { name: 'con ngư dân', gold: 8, luck: 0, w: 35, types: ['thon_tran'] },
        { name: 'con thủy thủ thương đoàn', gold: 30, luck: 1, w: 20, types: ['thuong_doan', 'thanh_tri'] },
        { name: 'con nhà buôn cảng', gold: 50, luck: 1, w: 15, types: ['thanh_tri', 'ben'] },
        { name: 'dân đảo biệt lập', gold: 3, luck: 1, w: 18, types: ['bo_toc'] },
        { name: 'cô nhi hải cảng', gold: 0, luck: 4, w: 12, types: ANY }
      ]
    },
    {
      id: 'tay_son', n: 'Tây Thiên Sơn', terrain: 'Núi cao', color: '#8a93a3', x: 100, y: 280,
      linh: 4, danger: 3, rich: 1, elems: ['Kim', 'Phong'], birth: 9,
      analog: 'Giống cao nguyên thưa dân, du mục, đời sống khắc nghiệt, nhiều tín ngưỡng.',
      desc: 'Dãy núi cao chọc trời, gió rít quanh năm, quặng kim loại lộ thiên. Hợp người tu Kim và Phong.',
      env: { name: 'Thiếu khí, gió lạnh', desc: 'Không khí loãng khiến hồi phục chậm và tu luyện hơi khó.', trainMul: 0.95, goldMul: 0.9, hpDrain: 0.4, healMul: 0.6, resist: ['Phong', 'Kim'] },
      weather: [
        { id: 'bao_gio', name: 'Bão gió núi', desc: 'Gió dữ cản đường, nhưng người tu Phong và Kim nhận được kiếm ý trong gió.', chance: 0.03, dur: 2, danger: 1, travel: 1.6, elemBuff: { elems: ['Phong', 'Kim'], train: 1.3 } },
        { id: 'tuyet_lo', name: 'Tuyết lở', desc: 'Tuyết lở chặn đường, rất nguy hiểm.', chance: 0.015, dur: 2, danger: 2, travel: 2 }
      ],
      origins: [
        { name: 'con người chăn ngựa', gold: 6, luck: 0, w: 35, types: ['thon_tran'] },
        { name: 'con thợ mỏ', gold: 10, luck: 0, w: 22, types: ['mo', 'thon_tran'] },
        { name: 'dân bộ tộc ưng', gold: 4, luck: 1, w: 18, types: ['bo_toc'] },
        { name: 'con đệ tử tục gia của tông môn', gold: 25, luck: 2, w: 10, types: ['tong_mon'] },
        { name: 'cô nhi sơn cước', gold: 0, luck: 4, w: 15, types: ANY }
      ]
    },
    {
      id: 'nam_lam', n: 'Nam Lâm', terrain: 'Rừng rậm', color: '#4f8f55', x: 400, y: 480,
      linh: 3, danger: 3, rich: 2, elems: ['Mộc'], birth: 22,
      analog: 'Giống vùng nhiệt đới dân số trẻ, sinh suất cao, sống nhờ nông nghiệp, săn bắt và rừng.',
      desc: 'Rừng nguyên sinh rậm rạp, linh dược mọc đầy, yêu thú rình rập dưới tán lá.',
      env: { name: 'Độc chướng rừng sâu', desc: 'Hơi độc và côn trùng mài mòn sức khỏe, nhưng linh thảo giúp hồi phục nhanh.', trainMul: 1, goldMul: 1, hpDrain: 0.6, healMul: 1.4, resist: ['Mộc'] },
      weather: [
        { id: 'mua_doc', name: 'Mưa độc', desc: 'Mưa mang độc khí, nguy hiểm hơn. Người tu Mộc hấp thụ sinh khí trong mưa.', chance: 0.03, dur: 3, danger: 1, hpDrain: 0.8, elemBuff: { elems: ['Mộc'], train: 1.3 } },
        { id: 'linh_vu', name: 'Linh vũ', desc: 'Mưa linh khí, ai tu luyện cũng thuận lợi hơn.', chance: 0.02, dur: 2, train: 1.15 }
      ],
      origins: [
        { name: 'con thợ săn', gold: 4, luck: 0, w: 38, types: ['thon_tran'] },
        { name: 'con người hái thuốc', gold: 8, luck: 1, w: 22, types: ['thon_tran', 'mo'] },
        { name: 'dân bộ tộc sói', gold: 3, luck: 1, w: 15, types: ['bo_toc'] },
        { name: 'con nhà buôn dược', gold: 40, luck: 1, w: 12, types: ['thuong_doan', 'thanh_tri'] },
        { name: 'cô nhi trong rừng', gold: 0, luck: 4, w: 13, types: ANY }
      ]
    },
    {
      id: 'bac_bang', n: 'Bắc Cực Băng Nguyên', terrain: 'Cực băng', color: '#9cd0e0', x: 400, y: 70,
      linh: 4, danger: 5, rich: 1, elems: ['Băng', 'Thủy'], birth: 3,
      analog: 'Giống vùng cực xa xôi gần như không có người ở: rất ít người sinh ra, ai ở đó đều khắc nghiệt.',
      desc: 'Băng nguyên vô tận, giá rét thấu xương. Linh khí cực mạnh nhưng ít ai sống sót nếu chưa đủ sức.',
      env: { name: 'Giá rét thấu xương', desc: 'Cái lạnh bào mòn sinh lực, cản trở hồi phục và tu luyện nếu không quen.', trainMul: 0.8, goldMul: 0.8, hpDrain: 1.5, healMul: 0.5, resist: ['Băng', 'Thủy', 'Hỏa'] },
      weather: [
        { id: 'bao_tuyet', name: 'Bão tuyết', desc: 'Giá rét tăng gấp bội, đường đi gần như tê liệt. Người tu Băng và Thủy lại hấp thụ được hàn khí cuồng bạo.', chance: 0.05, dur: 3, danger: 1, hpDrain: 2, travel: 2, elemBuff: { elems: ['Băng', 'Thủy'], train: 1.3 } },
        { id: 'cuc_quang', name: 'Cực quang', desc: 'Ánh cực quang kích động linh khí, ai tu luyện cũng thuận lợi.', chance: 0.02, dur: 2, train: 1.4 }
      ],
      origins: [
        { name: 'con thợ săn băng', gold: 3, luck: 0, w: 35, types: ['thon_tran'] },
        { name: 'dân tuyết nhân', gold: 2, luck: 1, w: 22, types: ['bo_toc'] },
        { name: 'con binh sĩ Bắc Hàn', gold: 10, luck: 1, w: 18, types: ['thanh_tri'] },
        { name: 'con người đánh xe trượt tuyết', gold: 25, luck: 1, w: 10, types: ['thuong_doan'] },
        { name: 'cô nhi băng giá', gold: 0, luck: 5, w: 15, types: ANY }
      ]
    },
    {
      id: 'hoa_son', n: 'Hỏa Diệm Sơn', terrain: 'Núi lửa', color: '#c2553a', x: 630, y: 430,
      linh: 4, danger: 4, rich: 1, elems: ['Hỏa', 'Dương'], birth: 8,
      analog: 'Giống vùng núi lửa và công nghiệp nặng: dân số vừa phải, nhiều thợ luyện kim, khai khoáng.',
      desc: 'Núi lửa nhả khói quanh năm, dung nham chảy thành sông. Hỏa linh khí nồng đậm, nóng bỏng và hiểm ác.',
      env: { name: 'Nóng bức, khói độc', desc: 'Nhiệt độ cao và khí lưu huỳnh làm hao sinh lực.', trainMul: 0.95, goldMul: 1, hpDrain: 0.9, healMul: 0.8, resist: ['Hỏa', 'Dương', 'Băng'] },
      weather: [
        { id: 'phun_trao', name: 'Phun trào', desc: 'Núi lửa phun trào, rất nguy hiểm nhưng người tu Hỏa và Dương hấp thụ được hỏa khí cuồng bạo.', chance: 0.03, dur: 2, danger: 2, hpDrain: 1, elemBuff: { elems: ['Hỏa', 'Dương'], train: 1.4 } },
        { id: 'hoa_tinh', name: 'Mùa hỏa tinh', desc: 'Hỏa tinh lộ thiên, thợ mỏ làm ăn khấm khá.', chance: 0.02, dur: 3, gold: 1.3 }
      ],
      origins: [
        { name: 'con thợ rèn', gold: 12, luck: 0, w: 30, types: ['thanh_tri', 'phuong'] },
        { name: 'con thợ mỏ', gold: 8, luck: 0, w: 28, types: ['mo', 'thon_tran'] },
        { name: 'dân bộ tộc thạch hỏa', gold: 3, luck: 1, w: 15, types: ['bo_toc'] },
        { name: 'con đệ tử tục gia luyện khí', gold: 30, luck: 2, w: 10, types: ['tong_mon'] },
        { name: 'cô nhi giữa tro tàn', gold: 0, luck: 4, w: 17, types: ANY }
      ]
    },
    {
      id: 'hoang_mac', n: 'Hoang Mạc Kim Sa', terrain: 'Sa mạc', color: '#d8b45f', x: 170, y: 430,
      linh: 2, danger: 3, rich: 2, elems: ['Kim', 'Dương'], birth: 14,
      analog: 'Giống vùng sa mạc có dân số trẻ, du mục đông nhưng của cải dồn vào một thiểu số nắm nguồn tài nguyên.',
      desc: 'Sa mạc cát vàng bất tận, ban ngày thiêu đốt ban đêm lạnh giá. Cổ thành chôn vùi dưới cát.',
      env: { name: 'Nắng cháy, thiếu nước', desc: 'Khát và nóng khiến sinh lực hao dần.', trainMul: 0.9, goldMul: 1, hpDrain: 0.7, healMul: 0.8, resist: ['Dương', 'Kim', 'Thổ'] },
      weather: [
        { id: 'bao_cat', name: 'Bão cát', desc: 'Cát vùi lấp đường đi, hao sinh lực. Người tu Dương và Kim hấp thụ được khí cuồng bạo.', chance: 0.04, dur: 2, hpDrain: 1.2, travel: 1.6, elemBuff: { elems: ['Dương', 'Kim'], train: 1.3 } },
        { id: 'oc_dao', name: 'Ốc đảo nở hoa', desc: 'Mùa nước tốt, buôn bán và tu luyện thuận lợi.', chance: 0.015, dur: 2, gold: 1.2, train: 1.1 }
      ],
      origins: [
        { name: 'con người du mục', gold: 3, luck: 0, w: 38, types: ['bo_toc'] },
        { name: 'con người đoàn lạc đà', gold: 30, luck: 1, w: 20, types: ['thuong_doan', 'tram'] },
        { name: 'con nhà ốc đảo', gold: 8, luck: 0, w: 28, types: ['thon_tran'] },
        { name: 'tiểu vương tộc', gold: 200, luck: 2, w: 3, types: ['thanh_tri'] },
        { name: 'cô nhi sa mạc', gold: 0, luck: 4, w: 11, types: ANY }
      ]
    },
    {
      id: 'vu_trach', n: 'Vụ Trạch', terrain: 'Đầm lầy', color: '#7a6f9b', x: 170, y: 130,
      linh: 3, danger: 4, rich: 1, elems: ['Âm', 'Mộc'], birth: 15,
      analog: 'Giống vùng châu thổ ngập nước đông dân và nghèo: nhiều người sinh ra nhưng đa số khó khăn.',
      desc: 'Đầm lầy mịt mù sương độc, âm khí nặng nề. Nơi ẩn náu của kẻ muốn tránh đời.',
      env: { name: 'Độc khí, sương mù', desc: 'Khí độc ăn mòn sinh lực, âm khí làm loạn tâm thần.', trainMul: 0.9, goldMul: 0.9, hpDrain: 1.0, healMul: 0.8, resist: ['Âm', 'Mộc'] },
      weather: [
        { id: 'suong_doc', name: 'Sương độc dày', desc: 'Sương độc đặc quánh, hao sinh lực. Người tu Âm và Mộc hấp thụ được âm khí.', chance: 0.05, dur: 3, hpDrain: 1.5, elemBuff: { elems: ['Âm', 'Mộc'], train: 1.3 } },
        { id: 'da_quang', name: 'Dạ quang', desc: 'Đom đóm phát sáng soi đường, tâm thần yên ổn.', chance: 0.02, dur: 2, train: 1.1 }
      ],
      origins: [
        { name: 'con dân sống trên cọc', gold: 2, luck: 0, w: 52, types: ['thon_tran'] },
        { name: 'con người đánh cá đầm', gold: 5, luck: 0, w: 20, types: ['thon_tran', 'ben'] },
        { name: 'con kẻ buôn lậu', gold: 25, luck: 1, w: 12, types: ['cho_den', 'thuong_doan'] },
        { name: 'con tín đồ tà giáo', gold: 10, luck: 1, w: 6, types: ['tong_mon'] },
        { name: 'cô nhi trong đầm', gold: 0, luck: 4, w: 10, types: ANY }
      ]
    },
    {
      id: 'loi_dao', n: 'Lôi Đảo', terrain: 'Đảo giông bão', color: '#8a6fd1', x: 630, y: 130,
      linh: 4, danger: 4, rich: 1, elems: ['Lôi', 'Phong'], birth: 8,
      analog: 'Giống các đảo nhỏ hay gặp thiên tai: dân ít, quen sống dưới thời tiết khắc nghiệt.',
      desc: 'Quần đảo bị giông bão bao phủ, sét đánh không ngừng. Lôi linh khí dày đặc.',
      env: { name: 'Sấm sét, bão từ', desc: 'Sét đánh bất chợt làm hao sinh lực.', trainMul: 1, goldMul: 0.95, hpDrain: 0.5, healMul: 1, resist: ['Lôi', 'Phong'] },
      weather: [
        { id: 'giong_bao', name: 'Giông bão', desc: 'Sét đánh dày đặc, rất nguy hiểm. Người tu Lôi và Phong hấp thụ được lôi khí.', chance: 0.05, dur: 2, danger: 2, travel: 1.6, elemBuff: { elems: ['Lôi', 'Phong'], train: 1.4 } },
        { id: 'troi_quang', name: 'Trời quang hiếm hoi', desc: 'Giông bão tạm lặng, tu luyện thuận lợi.', chance: 0.02, dur: 2, train: 1.15 }
      ],
      origins: [
        { name: 'con ngư dân vùng sấm', gold: 5, luck: 0, w: 38, types: ['thon_tran'] },
        { name: 'dân bộ tộc chim sấm', gold: 3, luck: 1, w: 18, types: ['bo_toc'] },
        { name: 'con thủy binh', gold: 20, luck: 1, w: 15, types: ['thanh_tri'] },
        { name: 'con đệ tử tục gia Lôi Quan', gold: 25, luck: 2, w: 10, types: ['tong_mon'] },
        { name: 'cô nhi giữa giông bão', gold: 0, luck: 4, w: 19, types: ANY }
      ]
    }
  ];

  // Các tuyến vượt vùng. minRealm: cảnh giới tối thiểu để tự thân đi (0 Phàm nhân ... 4 Nguyên Anh, 5 Hóa Thần).
  // years: số năm ở cảnh giới tối thiểu. caravan: có tuyến thương đoàn (đi chậm hơn nhưng yếu hơn cũng đi được).
  D.EDGES = [
    { a: 'trung_chau', b: 'tay_son', minRealm: 5, years: 100, caravan: true },
    { a: 'trung_chau', b: 'dong_hai', minRealm: 4, years: 70, caravan: true },
    { a: 'trung_chau', b: 'nam_lam', minRealm: 4, years: 60, caravan: true },
    { a: 'trung_chau', b: 'bac_bang', minRealm: 5, years: 120, caravan: false },
    { a: 'dong_hai', b: 'loi_dao', minRealm: 5, years: 80, caravan: true },
    { a: 'dong_hai', b: 'hoa_son', minRealm: 4, years: 70, caravan: true },
    { a: 'nam_lam', b: 'hoa_son', minRealm: 4, years: 60, caravan: false },
    { a: 'nam_lam', b: 'hoang_mac', minRealm: 4, years: 70, caravan: true },
    { a: 'tay_son', b: 'hoang_mac', minRealm: 4, years: 70, caravan: true },
    { a: 'tay_son', b: 'vu_trach', minRealm: 4, years: 80, caravan: false },
    { a: 'bac_bang', b: 'vu_trach', minRealm: 5, years: 110, caravan: false },
    { a: 'bac_bang', b: 'loi_dao', minRealm: 5, years: 120, caravan: false }
  ];

  // Điều kiện các lối đi tắt (khắt khe).
  D.SHORTCUT = {
    // Truyền tống trận cổ: tức thì nhưng rất đắt và rất rủi ro.
    portal: { minRealm: 3, gold: 2000, fortune: 12, success: 0.4, failHpLoss: 0.6, failDeath: 0.25 },
    // Thương đoàn: chậm hơn nhưng yếu hơn cũng đi được, tốn rất nhiều vàng.
    caravan: { minRealm: 2, goldPerYear: 30, yearsMul: 0.4 },
    // Giảm thời gian tự thân khi cảnh giới cao hơn mức tối thiểu.
    selfSpeedup: 0.25,
    crossTrainMul: 0.5
  };
})();
