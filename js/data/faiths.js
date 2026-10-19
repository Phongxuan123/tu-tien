// Tín ngưỡng khởi đầu (S5): chín tín ngưỡng tên thật, quy tắc lồng, ba ô mỗi vùng, nơi thờ tự (ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 8).
// Viết như cơ chế xã hội (đóng góp và căng thẳng), không phán đúng sai về niềm tin. Kẻ cực đoan chỉ là một cá nhân hoặc một phái.
// Chỉ là dữ liệu, chưa nối vào mô phỏng. Id vùng trùng với D.REGIONS; tên nước thật không xuất hiện trong chữ.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  // Mỗi vùng có đúng ba ô; ô 1 là tôn giáo mạnh nhất vùng.
  D.FAITH_SLOTS = 3;

  // long: các tín ngưỡng được lồng vào cùng ô (đối xứng: A lồng B thì B lồng A).
  // docQuyen: độc chiếm một ô, không lồng và tín đồ không kiêm tín ngưỡng khác.
  // phuc: hiệu ứng nhỏ cho tín đồ, hệ số là tỉ lệ và có trần.
  D.FAITHS = [
    {
      id: 'phat', n: 'Phật giáo', docQuyen: false,
      loi: 'Từ bi, nghiệp và luân hồi, con đường giải thoát khỏi khổ đau.',
      dongGop: 'Giảm nghiệp, cứu khổ, hòa giải xung đột, nuôi dưỡng học thuật và nối đầu thai.',
      cangThang: 'Chùa lớn giàu đất đai dễ bị thế lực khác ghen tị; các phái có thể tranh nhau cách giải thích kinh điển.',
      phai: [
        { n: 'Đại thừa', mo: 'Truyền thống bồ tát đạo, nhiều kinh điển và lối tu tập đa dạng.' },
        { n: 'Nguyên thủy', mo: 'Giữ kinh điển cổ và giới luật chặt chẽ.' },
        { n: 'Mật tông', mo: 'Nghi quỹ, chú nguyện và truyền thừa mật truyền.' }
      ],
      long: ['to_tien', 'dao_giao', 'nho', 'than_dao', 'dan_gian', 'an_do'],
      gioi: ['Giữ ngũ giới: không sát sinh, không trộm cắp, không tà dâm, không nói dối, không uống rượu.', 'Tôn trọng tăng đoàn và cư xử đúng mực trong chùa.'],
      phuc: { moTa: 'Lễ cầu an và tụng kinh giúp tĩnh tâm, đạo tâm tăng thêm theo tỉ lệ.', heSo: 0.02, tran: 0.05 },
      nghiLe: ['Tụng kinh buổi sáng và tối', 'Lễ Phật Đản và lễ cầu an'],
      noiTho: 'chùa', tuDong: 'am'
    },
    {
      id: 'thien_chua', n: 'Thiên Chúa giáo', docQuyen: true,
      loi: 'Yêu thương, cứu rỗi và tin vào một Thiên Chúa; cộng đồng giáo hội có tổ chức chặt chẽ.',
      dongGop: 'Y tế, giáo dục, cứu trợ và mạng lưới giáo hội trải rộng qua nhiều vùng.',
      cangThang: 'Niềm tin độc tôn khó chung ô với tôn giáo khác; tranh phái và giằng co giữa giáo quyền với quyền thế tục. Một cá nhân hay phái cực đoan không đại diện cho cả giáo hội.',
      phai: [
        { n: 'Công giáo', mo: 'Giáo hội tập trung dưới quyền giáo hoàng và giám mục.' },
        { n: 'Chính thống', mo: 'Các giáo hội Đông phương, tôn trọng các công đồng đầu tiên.' },
        { n: 'Tin Lành', mo: 'Nhấn mạnh Kinh Thánh, các cộng đoàn địa phương tự quản.' }
      ],
      long: [],
      gioi: ['Dự thánh lễ ngày Chúa nhật.', 'Giữ lời thề hôn nhân và tôn trọng đời sống gia đình.'],
      phuc: { moTa: 'Chăm sóc người bệnh của giáo hội giúp người bị thương mau hồi phục hơn, theo tỉ lệ.', heSo: 0.03, tran: 0.05 },
      nghiLe: ['Thánh lễ ngày Chúa nhật', 'Lễ Giáng sinh và Phục sinh'],
      noiTho: 'nhà thờ', tuDong: 'nhà nguyện'
    },
    {
      id: 'hoi', n: 'Hồi giáo', docQuyen: true,
      loi: 'Một Thượng Đế, năm trụ cột (kinh, cầu nguyện, nhịn chay, bố thí, hành hương) và cộng đồng gắn bó.',
      dongGop: 'Bố thí, thương mại công bằng, học thuật và hiếu khách; mạng lưới đoàn kết trải qua nhiều vùng.',
      cangThang: 'Niềm tin độc tôn khó chung ô; tranh phái; giáo luật và luật thế tục đôi khi chồng lấn. Một cá nhân hay phái cực đoan không đại diện cho cả cộng đồng.',
      phai: [
        { n: 'Sunni', mo: 'Nhánh đông nhất, theo truyền thống của cộng đồng và các học phái luật.' },
        { n: 'Shia', mo: 'Nhánh tin rằng quyền lãnh đạo cộng đồng thuộc về thân thuộc gần của Tiên tri.' }
      ],
      long: [],
      gioi: ['Cầu nguyện đúng giờ.', 'Kiêng thịt heo và rượu.'],
      phuc: { moTa: 'Bố thí và mạng lưới cộng đồng giúp giảm giá lương thực khi buôn bán trong vùng, theo tỉ lệ.', heSo: 0.02, tran: 0.04 },
      nghiLe: ['Cầu nguyện năm lần mỗi ngày', 'Nhịn chay tháng Ramadan và lễ Eid'],
      noiTho: 'thánh đường', tuDong: 'nhà nguyện'
    },
    {
      id: 'an_do', n: 'Ấn Độ giáo', docQuyen: false,
      loi: 'Dharma, karma, luân hồi và nhiều hình tướng của thần linh; truyền thống triết học và nghi lễ lâu đời.',
      dongGop: 'Nghi lễ và lễ hội phong phú, yoga và thiền định, triết học và thơ ca.',
      cangThang: 'Phân tầng xã hội theo truyền thống còn nặng ở một số nơi, khiến cải cách vấp phải kháng cự; sức nặng tập quán làm việc đổi mới chậm.',
      phai: [
        { n: 'Vaishnava', mo: 'Thờ Vishnu và các hóa thân của Ngài.' },
        { n: 'Shaiva', mo: 'Thờ Shiva trong nhiều hình tướng.' },
        { n: 'Shakta', mo: 'Thờ Nữ thần (Shakti) dưới nhiều hình tướng.' }
      ],
      long: ['phat', 'dan_gian', 'to_tien'],
      gioi: ['Giữ bổn phận theo dharma và tuổi đời.', 'Tôn trọng nơi thờ tự, cởi giày khi vào đền.'],
      phuc: { moTa: 'Nghi lễ và tụng niệm giúp tu vi tăng thêm nhẹ khi có thầy hướng dẫn, theo tỉ lệ.', heSo: 0.02, tran: 0.04 },
      nghiLe: ['Dâng lễ hằng ngày cho thần trong nhà', 'Lễ Diwali (hội ánh sáng)'],
      noiTho: 'đền', tuDong: 'miếu'
    },
    {
      id: 'dao_giao', n: 'Đạo giáo', docQuyen: false,
      loi: 'Thuận theo tự nhiên, dưỡng sinh, tĩnh tâm và tu luyện để sống hài hòa với đạo.',
      dongGop: 'Tu dưỡng cá nhân, y học và dưỡng sinh, luyện đan; nối với Đan Các.',
      cangThang: 'Phần huyền bí dễ bị lợi dụng để trục lợi; đồng bóng và phù chú bị lạm dụng ở nơi xa xôi.',
      phai: [
        { n: 'Chính Nhất', mo: 'Phái lễ nghi, phù chú và đàn tràng.' },
        { n: 'Toàn Chân', mo: 'Phái trọng tu tâm tính, tĩnh tọa và luyện nội đan.' }
      ],
      long: ['phat', 'nho', 'to_tien', 'than_dao', 'dan_gian'],
      gioi: ['Thuận tự nhiên, ít ham muốn.', 'Giữ tâm thanh tịnh, không lợi dụng người tin.'],
      phuc: { moTa: 'Luyện đan và dưỡng sinh giúp sinh lực hồi nhanh hơn khi nghỉ ngơi, theo tỉ lệ.', heSo: 0.03, tran: 0.05 },
      nghiLe: ['Lễ cầu an và cúng sao', 'Tĩnh tọa và luyện khí buổi sớm'],
      noiTho: 'đạo quán', tuDong: 'am'
    },
    {
      id: 'nho', n: 'Nho giáo', docQuyen: false,
      loi: 'Nhân, nghĩa, lễ, trí, tín; hiếu kính và trị quốc bằng đạo đức.',
      dongGop: 'Khoa cử, quan chế, văn đạo và lễ nghĩa; nối với nho khí của triều đình.',
      cangThang: 'Nặng thứ bậc và truyền thống, dễ bảo thủ; tranh chấp giữa chính thống và tân Nho về cách hiểu kinh điển.',
      phai: [
        { n: 'Chính thống', mo: 'Theo chú giải kinh điển truyền thống.' },
        { n: 'Tân Nho', mo: 'Tiếp thu tư tưởng mới, kết hợp với triết học và học vấn thực tế.' }
      ],
      long: ['to_tien', 'dao_giao', 'phat'],
      gioi: ['Giữ lễ, tôn trọng thứ bậc và học vấn.', 'Tu thân trước khi trị người.'],
      phuc: { moTa: 'Khoa cử và lễ nghĩa giúp nho khí tăng thêm nhẹ, theo tỉ lệ.', heSo: 0.02, tran: 0.04 },
      nghiLe: ['Tế lễ Đức Khổng Tử', 'Lễ khai giảng và lễ trưởng thành'],
      noiTho: 'văn miếu', tuDong: 'miếu'
    },
    {
      id: 'to_tien', n: 'Thờ cúng tổ tiên', docQuyen: false,
      loi: 'Hiếu kính, giỗ kỵ và dòng tộc; ghi nhớ người đã khuất qua nghi thức đều đặn.',
      dongGop: 'Gắn kết dòng họ và gia tộc, giữ gia phả, nối với các quan hệ gia tộc.',
      cangThang: 'Nặng huyết thống, dễ kỳ thị người ngoài; tranh chấp hương hỏa giữa các chi.',
      phai: [],
      long: ['phat', 'an_do', 'dao_giao', 'nho', 'than_dao', 'dan_gian'],
      gioi: ['Làm giỗ đúng kỳ và giữ hiếu với cha mẹ.', 'Giữ gia phả và tôn trọng người lớn trong họ.'],
      phuc: { moTa: 'Giỗ tổ và gia phả giúp tình thân dòng họ bền chặt hơn, theo tỉ lệ.', heSo: 0.03, tran: 0.05 },
      nghiLe: ['Giỗ tổ và giỗ kỵ', 'Cúng ngày Tết và ngày rằm'],
      noiTho: 'từ đường', tuDong: 'miếu'
    },
    {
      id: 'than_dao', n: 'Thần đạo', docQuyen: false,
      loi: 'Thờ kami và các thần của thiên nhiên; tịnh hóa để giữ sạch và hòa hợp với đất trời.',
      dongGop: 'Gắn bó cộng đồng làng xã, lễ mùa và tôn trọng thiên nhiên, bảo vệ rừng và nguồn nước.',
      cangThang: 'Gắn chặt với quyền lực nơi quốc gia; nếu một phái bảo thủ bị lợi dụng thì dễ sinh bài ngoại. Điều đó không đại diện cho cả cộng đồng.',
      phai: [
        { n: 'Thần xã', mo: 'Lễ nghi quanh các đền thần lớn.' },
        { n: 'Thần đạo dân gian', mo: 'Lễ mùa và tín ngưỡng làng xã.' }
      ],
      long: ['phat', 'dao_giao', 'to_tien', 'dan_gian'],
      gioi: ['Tịnh hóa trước khi vào nơi thờ.', 'Tôn trọng rừng núi và nguồn nước.'],
      phuc: { moTa: 'Lễ mùa và hòa hợp với thiên nhiên giúp sức bền khi đi đường xa, theo tỉ lệ.', heSo: 0.02, tran: 0.04 },
      nghiLe: ['Lễ mùa ở đền thần', 'Tịnh hóa bằng nước và muối'],
      noiTho: 'đền thần', tuDong: 'miếu'
    },
    {
      id: 'dan_gian', n: 'Tín ngưỡng dân gian', docQuyen: false,
      loi: 'Thờ thần núi sông, vạn vật hữu linh và thầy cúng; gắn với đời sống làng quê và tài nguyên.',
      dongGop: 'Bảo vệ tài nguyên và nguồn nước, chữa bệnh theo kinh nghiệm dân gian, hiểu biết về yêu thú.',
      cangThang: 'Dễ bị các giáo lớn gạt ra ngoài; khai mỏ hay mở đường có thể đụng đến nơi linh thiêng.',
      phai: [],
      long: ['phat', 'an_do', 'dao_giao', 'to_tien', 'than_dao'],
      gioi: ['Kính nơi linh thiêng, không xâm phạm.', 'Không khai thác quá mức tài nguyên thiêng.'],
      phuc: { moTa: 'Thầy cúng và thần linh địa phương giúp thu hoạch tài nguyên nhỏ dồi dào hơn, theo tỉ lệ.', heSo: 0.03, tran: 0.05 },
      nghiLe: ['Cúng đình và cầu mùa đầu năm', 'Cúng thầy chữa bệnh và cầu an'],
      noiTho: 'đền', tuDong: 'miếu'
    }
  ];

  // Ba ô khởi đầu của chín vùng (bảng 8.3). Ô 1 là mạnh nhất; long là tục lồng tùy chọn, tối đa một.
  // Bắc Cực là vùng bac_bang trong D.REGIONS.
  D.FAITH_START = {
    trung_chau: [{ chinh: 'nho', long: 'to_tien' }, { chinh: 'phat', long: 'dao_giao' }, { chinh: 'thien_chua' }],
    dong_hai: [{ chinh: 'than_dao', long: 'phat' }, { chinh: 'dan_gian', long: 'dao_giao' }, { chinh: 'thien_chua' }],
    tay_son: [{ chinh: 'phat', long: 'dan_gian' }, { chinh: 'an_do' }, { chinh: 'dao_giao' }],
    nam_lam: [{ chinh: 'phat', long: 'to_tien' }, { chinh: 'dan_gian' }, { chinh: 'an_do' }],
    bac_bang: [{ chinh: 'dan_gian' }, { chinh: 'thien_chua' }, { chinh: 'phat' }],
    hoa_son: [{ chinh: 'hoi' }, { chinh: 'thien_chua' }, { chinh: 'dao_giao' }],
    hoang_mac: [{ chinh: 'hoi' }, { chinh: 'dan_gian' }, { chinh: 'phat' }],
    vu_trach: [{ chinh: 'to_tien', long: 'dan_gian' }, { chinh: 'an_do' }, { chinh: 'phat' }],
    loi_dao: [{ chinh: 'dan_gian', long: 'than_dao' }, { chinh: 'thien_chua' }, { chinh: 'dao_giao' }]
  };
})();
