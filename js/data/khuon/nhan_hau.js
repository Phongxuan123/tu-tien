// Khuôn "Nhân hậu" (Đạo đức dương, mềm yếu), chép từ ke-hoach/Q-khuon-kich-ban.md mục 4 thành dữ liệu (K3a). Cấu trúc theo js/data/khuon/kieu_hanh.js.
// Ghi chú chép (K3a, Haiku):
//   - Khuyết điểm gốc: mem_long (thuốc "trách nhiệm" trùng với kds.mem_long).
//   - Dàn: Hà (trưởng lão) đóng cả ke_thu (bóng tối) lẫn su (thầy); Tần Diệp là gương (dàn doi_thu); cháu gái Hà là doi_thu (dàn thuong); Lục Tam là ban (dàn huynh); mẹ là than_nhan.
//   - Mục 4 không ghi lc mốc/leo/treo và một số "cái mất": viết theo giọng khuôn kiêu hãnh. "Thử thách có hạn" (tt) đặt ở phần 2, leo (bắt buộc ít nhất một).
//   - Kiểu "(ngược)" chưa ghi kiểu cụ thể được chọn theo nghĩa: phần 1 "đưa Tần Diệp" = chong; phần 2 "kể cho Lục Tam" = tin (vt nguoc); phần 3 "làm chứng" = chong; phần 4 "không ký" = hy_sinh; phần 5 "đọc to danh sách" = hy_sinh; phần 6 "chặn bằng tu vi cuối" = hy_sinh (đã dùng trong mục 6 như chung).
//   - Kiểu "tin" (đưa thầy) và "dao_thoat" (trốn cùng hắn) có vt dkd vì đúng khuyết điểm mềm lòng; "im" (phần 3, phần 1) đúng theo mục 4.
//   - Phần 2 "nhịp" của bản gốc (đêm trước ngày lên nội môn) là cao trào; "thử thách" ghi ở lc tri_dich (leo).
//   - Phần 3: "móc phần 3: mẹ mất" của bản gốc được đặt ở leo (lon, kiểu) để đi đường đã chạy của lint/builder (moc có kieu không chạy qua src.lc).
//   - Chưa mã hóa: "nhịp 2 cướp lại mẹ" (phần 5 của bản gốc) — không rõ là gì nên bỏ qua; cần bạn chỉ rõ.
(function () {
  const D = window.TT.data;

  D.STORY.regKhuon({
    id: 'nhan_hau', ten: 'Nhân hậu', khuyet_diem: 'mem_long',
    cau_hoi_trung_tam: 'Có nên im lặng trước cái ác để giữ cho nhiều người được yên?',
    logline: 'Người muốn học y để cứu mẹ và cứu thôn, rồi nhận ra chữ ký của mình đã đưa những đệ tử nghèo đi chết; người ấy chỉ còn cách trả lại từng cái tên.',
    bay_manh: {
      vet_thuong: [
        { id: 'a', xt: ['p1', 'p2'], vet: 'nhường gạo cho em, em vẫn chết, mẹ bảo "con không có lỗi gì"',
          canh: 'Năm đói, bạn nhường phần gạo của mình cho em gái, nhưng em vẫn chết trong tay bạn; mẹ ôm bạn và bảo "con không có lỗi gì".' },
        { id: 'b', xt: ['p5'], vet: 'bà lão cho ăn nhờ chết vì bệnh, người làng bảo "không phải lỗi của mày"',
          canh: 'Bà lão cho bạn ăn nhờ khi bạn còn là cô nhi; khi bà chết vì bệnh, người làng xì xào rồi bảo bạn "không phải lỗi của mày".' },
        { id: 'c', xt: ['p3', 't10'], vet: 'cha tha nợ cho người nghèo đến phá sản, mẹ vẫn bảo cha là người tốt',
          canh: 'Cha tha hết nợ cho người nghèo, đến khi nhà mình phá sản; mẹ vẫn nói cha là người tốt.' }
      ],
      loi_noi_doi: 'Không làm ai đau thì mình không có lỗi.',
      muon: [
        { id: 'a', cho: 'tong', t: 'học y ở nội môn để chữa bệnh phổi cho mẹ và cứu thôn' },
        { id: 'b', cho: 'vung', t: 'học y để chữa bệnh phổi cho mẹ và cứu người trong vùng' },
        { id: 'c', cho: 'tan_tu', t: 'chữa bệnh phổi cho mẹ và cứu thôn, không cần ai biết tên mình' }
      ],
      can: 'trách nhiệm (im lặng cũng là một lựa chọn)',
      bong_toi: { vai: 'ke_thu', cach_chon: 'trưởng lão Hà, người hiền nhất tông, ba mươi năm ký danh sách đệ tử nghèo nộp cho thế lực mạnh kề bên làm lò đỉnh; ra mắt từ phần 1',
        ra_mat: [
          'trưởng lão Hà, râu bạc và giọng ôn tồn, đưa cho bạn chiếc bánh và dặn đừng lo cho ai',
          'trưởng lão Hà đứng bên sân, nhìn đám đệ tử nghèo xếp hàng và gật đầu như xem thời tiết',
          'trưởng lão Hà cầm bút son, ký nhanh một dòng tên rồi cẩn thận gấp tờ giấy lại'
        ] },
      guong: { vai: ['doi_thu'], dd: 'người giữ công lý không có lòng thương, nói ít và luôn đứng thẳng' },
      hy_sinh: 'nội môn, người thầy, công pháp thầy dạy'
    },
    dan: { ke_thu: 'su', guong: ['doi_thu'], su: 'su', doi_thu: 'thuong', than_nhan: 'than_nhan', ban: 'huynh' },
    soi: {
      chinh: { nguoi: 'su', vat: [
        { id: 'but_son', canh: '{su} ký một dòng bằng cây bút son đỏ rồi đưa cho bạn, mỉm cười như đưa một món quà.', treo: '{su} lấy lại cây bút son, lau sạch đầu bút rồi cất vào tay áo, không nói gì.' }
      ] },
      phu: [
        { nguoi: 'ban', vat: [{ id: 'chan_day' }] },
        { nguoi: 'doi_thu', vat: [{ id: 'chuoi_hat' }] }
      ]
    },
    noi: { chinh: 'ngoại môn', tong: 'sơn môn', cam: ['thư phòng trưởng lão'] },
    thang_suc_manh: [
      { realm: 0, dinh: 'người đứng đầu ngoại môn' },
      { realm: 1, stage: 0, dinh: 'đệ tử nội môn có tiếng' },
      { realm: 1, stage: 2, dinh: 'đệ nhất nội môn, người được chọn làm chân truyền' },
      { realm: 2, dinh: 'trưởng lão, người đứng đầu một vùng nhỏ' },
      { realm: 3, dinh: 'cái tên người ta nhắc như huyền thoại' }
    ],
    phan: [
      // ---------- Phần 1. Chiếc chăn: tin ai ----------
      { id: 'chiec_chan', n: 'Chiếc chăn', chuc_nang: 'biến cố khởi đầu; tin ai', tuoi: 12, cau_hoi: 'Tin ai?',
        biet: 'Trong đôi giày bỏ quên có một mảnh giấy, và chưa ai đọc hết.', thang_vui: 'Hà bỏ tiền mua thuốc cho mẹ bạn; Tết cả phòng.', cai_mat: 'một đứa bạn bị đuổi khỏi phòng, hoặc chút tin của bạn',
        chang: {
          moc: { t: 'Đôi giày bỏ quên',
            d: 'Đêm đầu tiên ở ngoại môn, bạn nhặt được một đôi giày cũ bỏ quên trong góc phòng. Trong giày có một mảnh giấy nhỏ, và chữ viết trên đó nguệch ngoạc như vội vàng.',
            lc: [
              { key: 'mang_tra', label: 'Mang đôi giày trả lại cho chủ', kind: 'help', mat: 'Một chút công sức vô ích.' },
              { key: 'cat_giay', label: 'Cất đôi giày đi, không đọc', kind: 'safe', mat: 'Một mảnh giấy vẫn nằm im trong túi.' }
            ] },
          leo: { t: 'Thư xin thuốc',
            d: 'Mẹ bạn ho ra máu trong thư, và bạn đọc đi đọc lại câu hỏi xin thuốc. Trưởng lão {su} đã hứa gửi thuốc, nhưng thư cuối cùng vẫn chưa có tin.',
            lc: [
              { key: 'viet_thu', label: 'Viết thư xin thầy gửi thuốc gấp', kind: 'help', mat: 'Một đêm không ngủ chờ hồi âm.' },
              { key: 'cho_them', label: 'Chờ thêm một mùa nữa', kind: 'safe', mat: 'Mẹ bạn còn đủ sức đợi.' }
            ] },
          cao_trao: { t: 'Mảnh giấy cứu', lon: true, canh: { gio: 'dem', thoi_tiet: 'mua' },
            d: 'Mảnh giấy ghi chữ "cứu" nằm trong đôi giày bỏ quên, và chữ ấy không rõ là cứu ai. Bạn đứng giữa phòng với mảnh giấy trong tay, biết rằng ai cầm nó trước sẽ quyết định một người sống hay chết.',
            kieu: [
              { kieu: 'tin', vt: 'dkd', doi: 'ban', cuu: 'su', label: 'Đưa mảnh giấy cho thầy', mat: 'Niềm tin vào người hiền nhất tông, và một lần bạn không nhìn kỹ nét chữ.',
                sau: 'Thầy đọc mảnh giấy rất chậm, rồi gật đầu và bảo sẽ lo việc này. Ông cất mảnh giấy vào tay áo, và bạn thấy nhẹ lòng vì được tin.',
                hau: '{su} đã nhận lấy việc này, và bạn không hỏi thêm.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'ban', cuu: 'ban', label: 'Giấu mảnh giấy đi, không đưa cho ai', mat: 'Một người phải chịu thay sự im lặng của bạn.',
                sau: 'Bạn gấp mảnh giấy bỏ vào túi và đêm ấy không ngủ. Người bạn cùng phòng thở đều bên cạnh, không biết mình đang bị giấu điều gì.',
                hau: 'Điều bạn đã giấu vẫn còn nằm trong túi áo.' },
              { kieu: 'chong', vt: 'nguoc', doi: 'su', cuu: 'guong', label: 'Đưa mảnh giấy cho Tần Diệp, và để hắn xem trước mặt thầy', mat: 'Mối quan hệ với thầy, và sự yên ổn của cả phòng.',
                sau: 'Bạn đặt mảnh giấy lên bàn trước mặt Tần Diệp và đọc to chữ "cứu" để cả phòng nghe. Thầy đứng sau lưng, không nói một lời, và tiếng thở của ông nặng hơn bình thường.',
                hau: 'Tần Diệp đọc mảnh giấy rất lâu, rồi nói một câu bạn không quên: "Có người đã không đủ dũng cảm để viết tên mình."' }
            ] },
          treo: { t: 'Thầy cất mảnh giấy',
            d: 'Hôm sau thầy gọi bạn vào thư phòng, hỏi về mảnh giấy như hỏi về thời tiết. Ông đã cất nó vào hộp gỗ, và cái hộp ấy bạn không bao giờ thấy lại.',
            lc: [
              { key: 'hoi_thay', label: 'Hỏi thầy đã làm gì với mảnh giấy', kind: 'risk', mat: 'Một câu hỏi thầy không thích nghe.' },
              { key: 'cam_on', label: 'Cảm ơn thầy, rồi đi', kind: 'safe', mat: 'Sự yên tâm giả của một đứa trẻ.' }
            ] }
        } },
      // ---------- Phần 2. Danh sách: nói hay im ----------
      { id: 'danh_sach', n: 'Danh sách', chuc_nang: 'đêm trước ngày lên nội môn; nói hay im', tuoi: 30, cau_hoi: 'Nói hay im?',
        biet: '{ban} đã nghe tên mình có trong một danh sách.', thang_vui: 'trị được dịch cho nửa thôn', cai_mat: 'lời hứa với Lục Tam, hoặc sự bình yên của thôn',
        chang: {
          moc: { t: 'Cây thuốc đầu thôn',
            d: 'Dịch lan xuống thôn dưới núi, và bạn được cử đi hái thuốc cùng các đệ tử khác. Lục Tam đi bên cạnh, tay ôm tấm chăn dày, nói ước gì được thấy biển.',
            lc: [
              { key: 'hai_den_khuya', label: 'Đi hái thuốc đến khuya', kind: 'help', mat: 'Những đêm lẽ ra để ngủ.' },
              { key: 've_som', label: 'Về sớm, nghỉ ngơi', kind: 'safe', mat: 'Một đêm yên, và một người thôn không được cứu.' }
            ] },
          leo: { t: 'Thôn dưới núi',
            d: 'Thôn dưới núi đang có người chết mỗi đêm, và thầy thuốc trong tông chỉ còn vài người. Bạn nhận một danh sách thuốc cần gấp, và không biết liệu mình có trị được hết không.',
            lc: [
              { key: 'tri_dich', label: 'Ở lại trị dịch cho cả nửa thôn', kind: 'help', mat: 'Sức khỏe và những đêm không ngủ.', tt: { can: { xp: 0.2 }, han: 24 } },
              { key: 've_tong', label: 'Về tông trước khi dịch lan thêm', kind: 'safe', mat: 'Lời nhắc của chính bạn rằng mình chưa đủ sức.' }
            ] },
          cao_trao: { t: 'Đêm trước ngày lên nội môn', lon: true, canh: { gio: 'dem', thoi_tiet: 'suong_doc' },
            d: 'Đêm trước ngày lên nội môn, Lục Tam đến tìm bạn với bọc đồ nhỏ và một lá thư chưa kịp niêm phong. Hắn đứng ở cửa phòng, chờ bạn nói một câu, và câu ấy có thể đẩy hắn đi hoặc giữ hắn lại.',
            kieu: [
              { kieu: 'im_lang', vt: 'khac', doi: 'ban', cuu: 'ban', label: 'Viết thư cho thầy, không nói gì với Lục Tam', mat: 'Một người bạn bị bỏ lại, và lá thư nằm im trong ngăn bàn.',
                sau: 'Bạn viết thư ngắn cho thầy về chuyện thuốc men và không nhắc tới danh sách. Lục Tam nhìn bạn một lúc, rồi quay đi cùng bọc đồ.',
                hau: 'Lục Tam không về nữa, và bạn không bao giờ biết hắn đã đi đâu.' },
              { kieu: 'tin', vt: 'nguoc', doi: 'ban', cuu: 'ban', label: 'Kể hết cho Lục Tam về danh sách', mat: 'Sự bình yên của người đã biết và không nói ra.',
                sau: 'Bạn kể hết cho hắn nghe về danh sách và chữ ký của thầy. Lục Tam im lặng rất lâu, rồi nói hắn sẽ đi thay em trai mình.',
                hau: 'Bạn đã nói thật với một người, và người ấy giữ im lặng suốt đời vì bạn.' },
              { kieu: 'dao_thoat', vt: 'dkd', doi: 'su', cuu: 'ban', label: 'Trốn cùng Lục Tam, bỏ lại danh sách và thầy', mat: 'Danh của một đệ tử ngoan, và người thầy phải chịu thay.',
                sau: 'Hai người rời tông lúc canh ba qua khe núi phía sau. Phía xa, ánh đèn trong thư phòng thầy vẫn sáng, và bạn không dám nhìn lại.',
                hau: 'Thầy bị hỏi tội thay bạn, và bạn không bao giờ biết thầy đã đáp gì.' }
            ] },
          treo: { t: 'Lục Tam không về',
            d: 'Sáng hôm sau, Lục Tam không về phòng. Chiếc chăn dày của hắn vẫn xếp gọn trên giường, và trên đó có một dòng chữ nhỏ: "xin chăm sóc em tôi".',
            lc: [
              { key: 'di_tim', label: 'Đi tìm Lục Tam', kind: 'risk', mat: 'Một đường đi không có điểm dừng.' },
              { key: 'giu_chan', label: 'Giữ chiếc chăn, không đi tìm', kind: 'safe', mat: 'Một lời hứa ngầm với người đã đi.' }
            ] }
        } },
      // ---------- Phần 3. Nhân chứng: cứu ai; mẹ mất ở cảnh lớn không có kẻ ác ----------
      { id: 'nhan_chung', n: 'Nhân chứng', chuc_nang: 'cứu ai; phiên chấp pháp; người phàm trong dàn chết già', tuoi: 55, canh: { realm: 1 }, cau_hoi: 'Cứu ai?',
        biet: '{ban} đã đọc được nét chữ trên mảnh giấy.', thang_vui: 'đêm vò rượu với Tần Diệp', cai_mat: 'một đệ tử nghèo, hoặc lương tâm của chính bạn',
        chang: {
          moc: { t: 'Lối vào thư phòng',
            d: 'Bạn đi qua thư phòng của thầy để tới phiên chấp pháp, và thấy những ngăn kéo khép kín. Trên bàn có một cây bút son đã mòn đầu, và mùi mực thoảng ra từ một cuốn sổ mở dở.',
            lc: [
              { key: 'liec_so', label: 'Liếc vào cuốn sổ mở dở', kind: 'risk', mat: 'Một cái tên bạn không muốn nhận ra.' },
              { key: 'di_qua', label: 'Đi qua, không nhìn', kind: 'safe', mat: 'Một điều bạn không biết, và đó là sự yên lòng.' }
            ] },
          // Cảnh lớn KHÔNG có kẻ ác (khong_ke_ac): mẹ mất, lời cuối "con không có lỗi gì"
          leo: { t: 'Mẹ trên giường bệnh', lon: true, canh: { gio: 'hoang_hon', thoi_tiet: 'suong_doc' },
            d: 'Thư từ thôn đến muộn: mẹ bạn đã mất trong đêm, lời cuối là "con không có lỗi gì". Bạn đọc đi đọc lại dòng chữ ấy, và không biết nó là lời an ủi hay một lời kết tội.',
            kieu: [
              { kieu: 'tin', vt: 'nguoc', doi: 'than_nhan', cuu: 'than_nhan', label: 'Nắm tay mẹ, tin lời mẹ rằng con không có lỗi', mat: 'Chút nhẹ lòng cuối cùng, và một lời tha thứ bạn chưa đáng nhận.',
                sau: 'Bạn nắm tay mẹ và khóc không thành tiếng. Mẹ mở mắt nhìn bạn một lúc, rồi nhắm lại như đã yên tâm.',
                hau: 'Bạn giữ lời mẹ suốt những năm sau, và không dám nghĩ mình có lỗi nữa.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'than_nhan', cuu: 'than_nhan', label: 'Im lặng nghe lời cuối, không đáp', mat: 'Một câu trả lời bạn không bao giờ nói được.',
                sau: 'Bạn chỉ gật đầu, và lời cuối của mẹ tan vào tiếng gió ngoài cửa. Bạn không nói mình đã biết điều gì.',
                hau: 'Mẹ mất với một câu chưa được đáp, và bạn biết chính mình là người đã để nó như vậy.' }
            ] },
          cao_trao: { t: 'Phiên chấp pháp', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Phiên chấp pháp mở ra, danh sách đệ tử nghèo được đọc lên từng cái tên. Thầy ngồi hàng đầu không nói một lời, còn bạn là người duy nhất biết vì sao có một cái tên lạ trong đó.',
            kieu: [
              { kieu: 'chong', vt: 'nguoc', doi: 'su', cuu: 'guong', label: 'Đứng lên làm chứng trước toàn tông', mat: 'Chỗ đứng trong tông, và có lẽ cả mạng.',
                sau: 'Bạn đứng dậy và nói rõ từng chữ về danh sách ba mươi năm. Cả sân nhìn bạn, và Tần Diệp gật đầu một lần.',
                hau: 'Thầy không nhìn bạn khi bạn bước xuống; Tần Diệp đứng đợi bạn ở cửa.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'su', label: 'Im lặng, để phiên kết thúc như mọi lần', mat: 'Một đệ tử nghèo bị đẩy lên lò đỉnh, và lương tâm bạn nhẹ đi một chút.',
                sau: 'Bạn cúi đầu, và phiên chấp pháp kết thúc trong im lặng. Có người khóc ở cuối sân, và bạn không quay lại nhìn.',
                hau: 'Im lặng là thứ bạn quen làm nhất từ đó.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'ban', cuu: 'su', label: 'Nói nửa lời, rằng có vài đệ tử đã tự nguyện đi', mat: 'Một nửa sự thật, và cái tên bạn để lại.',
                sau: 'Bạn nói có vài đệ tử đã tự nguyện đi, và không nhắc tới danh sách. Thầy khẽ gật đầu, như nhẹ nhõm vì bạn không nói thêm.',
                hau: 'Người ta nhớ bạn là kẻ biết nói vừa đủ.' }
            ] },
          treo: { t: 'Gói di vật về thôn',
            d: 'Gói di vật về tới tông vài ngày sau: một bộ áo cũ, một hộp kẹo đường và một mảnh giấy ghi "đừng làm lớn chuyện". Bạn cầm mảnh giấy đó rất lâu.',
            lc: [
              { key: 'dot_giay', label: 'Đốt mảnh giấy, không để ai thấy', kind: 'risk', mat: 'Lời dặn cuối cùng của mẹ, bị đốt đi.' },
              { key: 'cat_nguc', label: 'Cất vào ngực áo', kind: 'safe', mat: 'Một lời dặn bạn không làm được.' }
            ] }
        } },
      // ---------- Phần 4. Bút son (chiến thắng giả): lên đỉnh; quyền và danh sách ----------
      { id: 'but_son', n: 'Bút son', chuc_nang: 'chiến thắng giả: làm gì khi có quyền', tuoi: 85, canh: { realm: 1, stage: 2 }, cau_hoi: 'Làm gì khi có quyền?',
        biet: '{guong} đã gặp người đầu tiên trong danh sách.', thang_vui: 'đám cưới với cháu gái Hà', cai_mat: 'danh của bạn, hoặc tên của một đệ tử',
        chang: {
          moc: { t: 'Tờ danh sách đầu tiên',
            d: 'Chiếc bút son của thầy nằm trên bàn thư phòng, còn tờ danh sách đầu tiên mang tên bạn đang chờ bạn ký. Bạn cầm bút lên rồi đặt xuống, và nhìn cây bút son đã mòn đầu vì nhiều năm ký tên.',
            lc: [
              { key: 'ky_ten', label: 'Ký tên mình xuống dưới', kind: 'risk', mat: 'Một tên nữa trong danh sách.' },
              { key: 'gap_giay', label: 'Gấp tờ giấy lại, không ký', kind: 'safe', mat: 'Chiếc ghế chưa thuộc về bạn.' }
            ] },
          leo: { t: 'Đám cưới',
            d: 'Cháu gái Hà tới thư phòng báo tin thầy đã đồng ý cho hai người thành thân. Nàng cười rất nhẹ, và bạn không biết nụ cười ấy là vui hay là gánh nặng.',
            lc: [
              { key: 'nhan_loi', label: 'Nhận lời, cảm ơn thầy', kind: 'help', mat: 'Một đám cưới không có người đứng chung.' },
              { key: 'hoi_nang', label: 'Hỏi nàng có muốn không', kind: 'safe', mat: 'Một câu hỏi làm nàng khựng lại.' }
            ] },
          cao_trao: { t: 'Đại điển ký danh sách', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Đại điển ký danh sách mới: cả sân đứng dưới bậc, còn bạn đứng trên bậc với cây bút son trong tay. Tờ giấy đầu tiên được đặt trước mặt bạn, và mọi người đều đang chờ bạn ký.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ban', cuu: 'su', label: 'Ký tên', mat: 'Một danh sách nữa, và một cái tên không còn quay lại được.',
                sau: 'Bạn ký. Nét son đỏ kéo dài như vết máu trên giấy, và không ai trong sân dám nói gì.',
                hau: 'Chữ ký của bạn nằm ở đầu danh sách, và từ đó không ai còn gọi bạn là người tốt.' },
              { kieu: 'duong_tat', vt: 'dkd', doi: 'ban', cuu: 'su', label: 'Ký, nhưng đổi tên một đứa trẻ bằng tên Tần Diệp', mat: 'Một mối nợ không ghi trên giấy, và một người sẽ đòi.',
                sau: 'Bạn ký, và đổi tên trên một dòng bằng nét son vội vàng. Tần Diệp nhìn dòng chữ ấy rất lâu mà không nói gì.',
                hau: 'Tần Diệp không bao giờ nhắc chuyện đó, nhưng mỗi lần gặp bạn, hắn đều nhìn xuống tay bạn trước.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ban', cuu: 'su', label: 'Không ký, đặt bút son xuống và đứng lên khỏi bậc', mat: 'Chiếc ghế và chút danh bạn vừa có.',
                sau: 'Bạn đặt bút son xuống bàn và bước xuống bậc giữa sân. Thầy nhìn bạn một lúc, rồi cúi xuống nhặt tờ giấy và tự ký tên mình vào đó.',
                hau: 'Danh sách vẫn được nộp, nhưng không có tên bạn, và bạn biết mình đã không cứu được ai.' }
            ] },
          treo: { t: 'Đòi gấp đôi',
            d: 'Đêm sau đại điển, thế lực ngoài tường cử người tới đòi gấp đôi số đệ tử. Người truyền lời đứng ở cổng sơn môn, không vào, chỉ để lại một tờ giấy trắng với một dấu son đỏ.',
            lc: [
              { key: 'mo_cong', label: 'Mở cổng, nghe người ấy nói', kind: 'risk', mat: 'Một lời đe dọa được nghe tận tai.' },
              { key: 'dong_cong', label: 'Đóng cổng, không trả lời', kind: 'safe', mat: 'Một đêm yên, và một đòi hỏi chưa được đáp.' }
            ] }
        } },
      // ---------- Phần 5. Đại hội: bỏ gì; tất cả đã mất ----------
      { id: 'dai_hoi', n: 'Đại hội', chuc_nang: 'tất cả đã mất; đảo vai; bỏ gì', tuoi: 100, cau_hoi: 'Bỏ gì?',
        biet: '{guong} đã biết tên người đầu tiên trong danh sách.', thang_vui: '(không)', cai_mat: 'sĩ diện, hoặc một đệ tử nữa',
        chang: {
          moc: { t: 'Sơn môn sau mưa',
            d: 'Sau một trận mưa lớn, sân sơn môn đầy bùn và giấy ướt rã. Tần Diệp đứng giữa sân, gọi tên bạn và không chờ bạn trả lời.',
            lc: [
              { key: 'ra_doi_mat', label: 'Bước ra đối diện Tần Diệp', kind: 'help', mat: 'Một ánh nhìn bạn không né được nữa.' },
              { key: 'vong_di', label: 'Đi vòng qua hành lang', kind: 'safe', mat: 'Một lối đi không ai nhìn thấy.' }
            ] },
          leo: { t: 'Ghế trống',
            d: 'Thầy hỏi bạn có muốn ngồi vào ghế trưởng lão hay không, giọng nhỏ như sợ người khác nghe thấy. Bên ngoài, Tần Diệp đứng đợi trong mưa mà không bước vào.',
            lc: [
              { key: 'nhan_ghe', label: 'Nhận ghế, không hỏi lý do', kind: 'risk', mat: 'Chỗ ngồi của người đã ký nhiều hơn bạn.' },
              { key: 'tu_choi', label: 'Từ chối, nói muốn về ngoại môn', kind: 'safe', mat: 'Một đời ở chỗ thấp hơn.' }
            ] },
          cao_trao: { t: 'Quỳ xuống nhặt lên và ký đi', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Đại hội toàn tông: thầy đứng trên bậc với một tập danh sách dày như gối, còn Tần Diệp đứng dưới bậc, im lặng như lưỡi kiếm chưa rút. Cây bút son rơi xuống đất, và cả sân nhìn bạn, chờ bạn quỳ xuống nhặt lên.',
            kieu: [
              { kieu: 'phuc_tung', vt: 'dkd', doi: 'ban', cuu: 'su', label: 'Quỳ xuống, nhặt lên và ký đi', mat: 'Phần sĩ diện còn lại, và cái nhìn của cả sân.',
                sau: 'Bạn quỳ xuống, nhặt cây bút son lên, và đặt tay lên tờ giấy. Không ai trong sân lên tiếng, chỉ có Tần Diệp nhắm mắt lại.',
                hau: 'Bạn đã ký lần cuối, và không ai còn phải chờ bạn quỳ xuống nữa.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'su', cuu: 'ban', label: 'Đứng dậy, đọc to danh sách ba mươi năm trước toàn tông', mat: 'Danh dự của chính bạn, và chỗ đứng cuối cùng.',
                sau: 'Bạn đọc từng cái tên, từng ngày ký, từng lời hứa của thầy. Sân im lặng, và tiếng đọc của bạn nghe như đá va vào nhau.',
                hau: 'Từ đó không ai gọi bạn là người hiền nữa, nhưng họ nhớ tên những người đã bị đưa đi.' },
              { kieu: 'chong', vt: 'khac', doi: 'su', cuu: 'guong', label: 'Rút kiếm, chỉ thẳng vào thầy', mat: 'Máu, hoặc một người đứng cạnh.',
                hau: 'Tần Diệp bước lên đứng cạnh bạn, không nói gì.' }
            ] },
          treo: { t: 'Sơn môn lung lay',
            d: 'Sau đại hội, sơn môn lung lay như tờ giấy ướt, và thầy đưa cho bạn chiếc ghế trưởng lão còn trống. Bạn nghe tiếng chân người đi qua hành lang, và không biết mình đang đứng trên ghế của ai.',
            lc: [
              { key: 'ngoi_ghe', label: 'Ngồi xuống ghế của Hà', kind: 'risk', mat: 'Một chỗ ngồi chưa ai ngồi yên.' },
              { key: 'day_ghe', label: 'Đẩy ghế lại, rời sơn môn', kind: 'safe', mat: 'Một lối đi về phía biển.' }
            ] }
        } },
      // ---------- Phần 6. Biển: trận cuối giữ thôn; đồng hồ thọ nguyên ----------
      { id: 'bien', n: 'Biển', chuc_nang: 'trận cuối giữ thôn; đồng hồ thọ nguyên', tuoi: 115, tho: 0.15, cau_hoi: 'Đánh hay không?',
        biet: 'Lục Tam từng ước được thấy biển.', thang_vui: 'đệ tử đầu tiên của tông mới', cai_mat: '(kết cục)',
        chang: {
          moc: { t: 'Thôn dưới núi',
            d: 'Thôn dưới núi đã bị bao vây, và tông mới dựng vội bằng gỗ từ những ngôi nhà cũ. Bạn đứng nhìn chân trời, và nghĩ đến một người từng ước được thấy biển.',
            lc: [
              { key: 'dung_ngoai', label: 'Đứng ngoài hàng rào giữ thôn', kind: 'help', mat: 'Chỗ đứng đầu tiên trước trận.' },
              { key: 'vao_trong', label: 'Vào trong, nghỉ trước trận', kind: 'safe', mat: 'Một đêm nghỉ trước khi mọi thứ đổ xuống.' }
            ] },
          leo: { t: 'Đồng hồ thọ nguyên',
            d: 'Thọ nguyên trong ngực bạn còn chưa đến một phần bảy, và tay bạn run mỗi khi cầm bút son. Bạn còn một chút tu vi cuối, vừa đủ để giữ thôn hoặc để nuôi người khác.',
            lc: [
              { key: 'dot_can', label: 'Dốc cạn để giữ trận', kind: 'risk', mat: 'Gần hết phần đời còn lại, nếu thất bại.', tt: { can: { realm: 2 }, han: 120 } },
              { key: 'danh_cho_nho', label: 'Dành lại cho đệ tử nhỏ', kind: 'safe', mat: 'Một cơ hội cuối cùng được sống thêm một đời.' }
            ] },
          cao_trao: { t: 'Trận cuối giữ thôn', lon: true, canh: { gio: 'dem', thoi_tiet: 'giong_bao' },
            d: 'Đêm trận cuối, quân ngoài tường thổi tù và, và sân tông mới chỉ còn vài người đứng vững. {su} đứng trên tường gỗ với tờ danh sách cuối cùng, còn {guong} đứng dưới chân tường với thanh kiếm đã mòn.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'su', cuu: 'guong', label: 'Dùng nốt tu vi cuối để giữ thôn', mat: 'Những năm còn lại, và chút sức mạnh cuối.',
                sau: 'Chút khí cuối rời khỏi bạn như hơi thở qua song cửa. Hàng rào gỗ đứng vững một lúc, và bạn thấy thôn sáng dần lên sau lưng.',
                hau: '{guong} nói một câu rất khẽ, rồi đứng vững cạnh bạn.' },
              { kieu: 'chong', vt: 'khac', doi: 'su', cuu: 'guong', label: 'Đem tông mới ra đối diện, dẫn cả sân xông lên', mat: 'Máu, và một đám trẻ đứng sau lưng bạn.',
                hau: 'Tông mới giữ được cổng thôn, nhưng đệ tử đầu tiên của nó đã nằm xuống.' },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'su', cuu: 'guong', label: 'Ký thêm danh sách, đưa đệ tử nhỏ nhất ra hàng rào thay cho mình', mat: 'Một danh sách nữa, và một mạng nữa.',
                sau: 'Bạn ký thêm một dòng, rồi đưa đệ tử nhỏ nhất ra trước hàng rào. Thầy nhìn đứa trẻ ấy một lúc, và không nói gì.',
                hau: 'Đứa trẻ sống sót, nhưng không bao giờ được cho biết tên bạn.' }
            ] },
          treo: { t: 'Đệ tử đầu tiên',
            d: 'Sáng hôm sau, trận đã tan, một đệ tử nhỏ đứng trước bạn và cúi chào như đã được dạy từ lâu. Bạn nhìn quanh, tìm một chỗ để đặt tay, rồi thấy chiếc chăn dày của Lục Tam vẫn còn trên vai đứa trẻ.',
            lc: [
              { key: 'do_day', label: 'Đưa tay đỡ đứa trẻ dậy', kind: 'help', mat: 'Chút ấm cuối cùng của một đời.' },
              { key: 'quay_di', label: 'Quay đi, đếm lại danh sách', kind: 'risk', mat: 'Một con số không bao giờ đủ.' }
            ] }
        } }
    ],
    // Ba phương án lật (bốc một mỗi đời, nổ ở phần 4 hoặc 5). Chặng "treo" của phần nổ bị thay bằng đoạn sự thật.
    lat: [
      { id: 'a', kieu: 'ke_dung_sau', ten: 'Người thầy hiền là kẻ ký', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'treo', t: 'Hôm sau thầy gọi bạn vào thư phòng, hỏi về mảnh giấy như hỏi về thời tiết, rồi cất nó vào hộp gỗ.', hieu: 'Thầy biết mảnh giấy ấy từ trước khi nó về tay bạn.' },
          { phan: 2, o: 'leo', t: 'Trên danh sách có dấu son đỏ của thầy, nhưng nét son mờ như đã bị lau.', hieu: 'Thầy đã ký danh sách, và đã cố xóa dấu vết của mình.' },
          { phan: 3, o: 'cao_trao', t: 'Thầy ngồi hàng đầu phiên chấp pháp và không nói một lời nào.', hieu: 'Thầy là người có thể cứu, và đã chọn không cứu.' }
        ],
        no: { biet: 'Thầy hiền nhất tông là người ký danh sách đệ tử nghèo suốt ba mươi năm, để tông không bị thôn tính.',
          hieu: 'Thầy là kẻ ký danh sách.',
          d: 'Thầy gọi bạn vào thư phòng lần cuối và rót hai chén trà. "Ba mươi năm nay ta ký tên mình xuống dưới," ông nói, giọng nhẹ như kể chuyện của người khác. "Ta chỉ muốn tông còn đó."',
          lc: [
            { key: 'hoi_thay', label: 'Hỏi thẳng thầy đã ký bao nhiêu tên', kind: 'risk', mat: 'Một câu trả lời bạn không muốn nghe.', flag: 'lat_doi_mat' },
            { key: 'quay_di', label: 'Quay lưng đi, không hỏi', kind: 'safe', mat: 'Sự thật về người thầy bạn đã tin.', flag: 'lat_quay_di' }
          ] } },
      { id: 'b', kieu: 'tu_di_thay', ten: 'Lục Tam tự đi thay em trai', phan_no: 4, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'moc', t: 'Lục Tam hỏi bạn, lên nội môn có được gửi thư về nhà không, rồi cười như đùa.', hieu: 'Lục Tam đã định đi đâu đó và không muốn bạn biết.' },
          { phan: 2, o: 'cao_trao', t: 'Lục Tam nhờ bạn viết thư, nhưng không ký tên mình vào cuối thư.', hieu: 'Lục Tam đã tính trước việc mình sẽ không về.' },
          { phan: 3, o: 'treo', t: 'Em trai Lục Tam xuất hiện ở thôn dưới núi, nhìn bạn rất lâu rồi bỏ đi.', hieu: 'Em trai hắn vẫn còn sống, và người được cứu là em trai hắn.' }
        ],
        no: { biet: 'Lục Tam đã biết mình nằm trong danh sách và tự đi thay em trai mình.',
          hieu: 'Lục Tam đã đi thay em trai.',
          d: 'Đêm sau khi mọi thứ lật ngược, bạn tìm thấy bọc đồ cũ của Lục Tam ở cửa hậu. Bên trong có một mảnh giấy: "Em tôi không có lỗi gì. Đổi tôi đi." Chữ viết ấy là của chính hắn.',
          lc: [
            { key: 'tim_hoi', label: 'Đi tìm em trai hắn để hỏi', kind: 'risk', mat: 'Một đứa trẻ không biết gì về anh mình.', flag: 'lat_tha' },
            { key: 'ngoi_nhin', label: 'Ngồi xuống với bọc đồ, không đi đâu', kind: 'safe', mat: 'Lời hứa ngầm với một người đã đi.', flag: 'lat_trach' }
          ] } },
      { id: 'c', kieu: 'chinh_ban_la_thu_pham', ten: 'Chính bạn là thủ phạm', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'leo', t: 'Nét chữ trên mảnh giấy "cứu" nghiêng về một phía, giống hệt chữ của một người bạn đã thấy ở cổng tông.', hieu: 'Người viết mảnh giấy là anh trai Tần Diệp.' },
          { phan: 2, o: 'cao_trao', t: 'Tần Diệp hỏi bạn có thấy anh của hắn đâu không, giọng bình thản như hỏi về thời tiết.', hieu: 'Anh của Tần Diệp đã biến mất ngay đêm bạn đưa mảnh giấy cho thầy.' },
          { phan: 3, o: 'moc', t: 'Tần Diệp nhìn đôi giày bạn cất trong túi, rồi nhìn đi chỗ khác mà không nói gì.', hieu: 'Đôi giày ấy là của anh hắn; chính bạn đã đem đi.' }
        ],
        no: { biet: 'Anh trai Tần Diệp là người viết mảnh giấy "cứu"; bạn đã đưa mảnh giấy cho thầy, và người ấy biến mất ngay đêm đó.',
          hieu: 'Chính bạn đã đưa anh hắn đến chỗ chết.',
          d: 'Đêm ấy Tần Diệp đứng trước mặt bạn, không rút kiếm, không khóc. "Anh tôi viết mảnh giấy ấy," hắn nói. "Anh ấy đã tin người đưa nó lên." Bạn nhớ ra chính tay mình đã đưa nó cho thầy.',
          lc: [
            { key: 'nhan_toi', label: 'Nhận mình là người đưa mảnh giấy', kind: 'pay', mat: 'Chỗ đứng cao nhất mà bạn đã tự cho mình.', flag: 'lat_nhan_toi' },
            { key: 'chai_mat', label: 'Nói bạn không biết gì về anh hắn', kind: 'risk', mat: 'Một lần đứng thẳng nhìn người ta.', flag: 'lat_chai_mat' }
          ] } }
    ],
    khong_ke_ac: { phan: 3, o: 'leo', ten: 'Mẹ mất, lời cuối' },
    // Kết cục: chọn theo chuỗi kiểu lựa chọn (vt) ở TT.kb.ketKhuon.
    ket: {
      toan_ven: { t: 'Toàn vẹn', kv: 2, dk: { loai: 'nguoc', min: 3, tu_phan: 3, p6: 'hy_sinh' },
        log: '{ten} không còn tu vi. Bạn mang chiếc chăn dày của Lục Tam ra tận biển, và đứng đó đến khi trời tối.' },
      doa: { t: 'Đọa', kv: 0, xau: true, dk: { loai: 'dkd', phan: [4, 6] },
        log: '{ten} xoa đầu một đệ tử trẻ và nói "đừng làm lớn chuyện".' },
      co_doc: { t: 'Cô độc', kv: 1, xau: true, dk: { loai: 'con_lai' },
        log: '{ten} còn sống, nhưng không còn ai để đưa ra biển.' }
    }
  });
})();
