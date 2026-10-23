// Khuôn "Kiêu hãnh" (Xử thế âm: cương trực đến kiêu ngạo), chép từ ke-hoach/Q-khuon-kich-ban.md mục 2 thành dữ liệu (AI1a). Khuôn KHÔNG chứa chữ truyện dài:
// chỉ có dòng dự phòng 2 đến 3 câu cho mỗi chặng (dùng khi chưa có chữ AI và trong kiểm thử). Bộ cụ thể hóa (js/systems/khuon.js, TT.kb.make) bốc phương án bằng băm,
// gán vai từ dàn, sinh kịch bản cụ thể c.story.kbc rồi dựng thành tuyến của K1.
//
// ĐỊNH DẪN DẠNG KHUÔN (K3 viết tám khuôn còn lại theo đúng định dạng này; story-lint kiểm bằng TT.kb.lintKhuon):
//   id, ten, khuyet_diem (khóa D.STORY.kds), cau_hoi_trung_tam, logline,
//   bay_manh: { vet_thuong: [ { id, xt: [id xuất thân], vet, canh } ] (2 đến 3 phương án, chọn theo xuất thân rồi băm),
//               loi_noi_doi, muon: [ { id, cho: 'tong'|'vung'|'tan_tu', t } ], can, bong_toi: { vai, cach_chon, ra_mat: [ chữ ] }, guong: { vai: [vai dàn thử theo thứ tự], dd }, hy_sinh },
//   dan: { <vai trong chữ>: <vai dàn> } (ke_thu, guong, su, doi_thu, than_nhan, ban; guong lấy 'thuong' nếu có đạo lữ, không thì 'huynh'),
//   soi: { chinh: { nguoi, vat: [ { id, canh, treo } ] }, phu: [ { nguoi, vat: [ { id } ] } ] (tối đa 2 sợi phụ) },
//   noi: { chinh (khi chưa có tông, phần 1 và 2), tong (khi chưa có tông ở phần 3 trở đi), cam: [ chữ ] } (tên tông lấy từ mô phỏng khi chơi; nơi cấm: chữ dự phòng, AI1b thay bằng nơi thật trong vùng),
//   thang_suc_manh: [ { realm, stage?, dinh } ] (quy "đỉnh" theo cảnh giới thật; mục 2.4),
//   phan: [ 6 × { id, n, chuc_nang, tuoi, canh?: điều kiện cảnh giới thay tuổi, tho?: còn ≤ tỉ lệ thọ, cau_hoi, biet, thang_vui, cai_mat,
//                 chang: { moc, leo, cao_trao, treo } } ] (4 chặng mỗi phần; mỗi chặng { t, d (dòng dự phòng 2 đến 3 câu), d_pham?, lon?, canh?, can_gan_bo?, ep?, bien?, lc: [...] }),
//     lc của moc/leo/treo: { key, label, mat, kind, kieu?, tt?: thu_thach, fx_them? }; lc của cao_trao nằm trong chang.cao_trao.kieu: [ { kieu, vt: 'nguoc'|'dkd'|'khac', doi, cuu, label, mat, sau, hau, fx_them? } ],
//     vt 'nguoc' = đi ngược khuyết điểm (có giá thật), 'dkd' = dùng khuyết điểm (gồm cả tam_ma). Mỗi cao trào phải có ≥ 1 nguoc và ≥ 1 dkd (story-lint),
//   lat: [ 2 đến 3 × { id, kieu, ten, phan_no, o_no: 'treo', manh_moi: [ ≥ 3 × { phan, o, t, hieu } ] (các phần < phan_no), no: { d, lc: [2], biet, hieu } } ],
//   khong_ke_ac: { phan, o } (chặng lớn không có kẻ ác: không được chứa kiểu chong, tam_ma, duong_tat),
//   ket: { <id>: { t, kv, xau?, log, dk } } với dk: 'nguoc' { min, tu_phan, p6 } | 'dkd' { phan: [..] } | 'con_lai'.
// Khe chữ (slot) dùng trong dòng dự phòng: {ten}, {ke_thu}, {guong}, {su}, {doi_thu}, {than_nhan}, {ban} (tên người ở vai); {vat}, {vat_guong}, {vat_su} (tên vật);
//   {vet}, {vet_canh}, {muon}, {vat_canh}, {vat_treo}, {ke_thu_ra_mat}, {guong_dd}, {noi}, {noi_cam}, {dinh}, {the_luc}, {guong_goi}, {ke_thu_ve} (chữ do bước cụ thể hóa điền).
(function () {
  const D = window.TT.data;

  D.STORY.regKhuon({
    id: 'kieu_hanh', ten: 'Bát cơm thừa', khuyet_diem: 'kieu_hanh',
    cau_hoi_trung_tam: 'Giá trị của một người nằm ở thứ hắn có, hay ở cách hắn đối xử với kẻ không có gì?',
    logline: 'Kẻ muốn đứng trên tất cả vì từng bị giẫm, nhưng mỗi bậc hắn leo đều giẫm lên một người; khi rơi xuống đáy, kẻ duy nhất có thể kéo hắn lên là người hắn từng giẫm nặng nhất, và kẻ đó đã học cách giẫm từ chính hắn.',
    bay_manh: {
      vet_thuong: [
        { id: 'a', xt: ['p1', 'p2'], vet: 'bị con nhà giàu bắt quỳ trước cổng học đường',
          canh: 'Năm mười tuổi, một đứa con nhà giàu bắt bạn quỳ trước cổng học đường vì tội đi chân đất vào sân, cả trường đứng xem mà không ai nói gì.' },
        { id: 'b', xt: ['p5'], vet: 'bị đánh vì ăn cắp một cái bánh mà mình không lấy',
          canh: 'Năm mười tuổi, bạn bị lôi ra giữa chợ đánh vì tội ăn cắp một cái bánh mà bạn không hề lấy, không ai bênh bạn, và kẻ lấy thật đứng trong đám đông xem.' },
        { id: 'c', xt: ['p3', 't10'], vet: 'thấy cha bị chủ nợ tát trước mặt mình',
          canh: 'Năm mười tuổi, bạn đứng nhìn chủ nợ tát cha mình trước cửa tiệm giữa phố, cha cúi đầu cười lấy lòng, và bạn đã hiểu nụ cười ấy còn nhục hơn cái tát.' }
      ],
      loi_noi_doi: 'Chỉ kẻ mạnh mới không bị giẫm.',
      muon: [
        { id: 'a', cho: 'tong', t: 'thành đệ nhất đệ tử rồi chân truyền kế vị của {noi}' },
        { id: 'b', cho: 'vung', t: 'đứng đầu bảng thiên kiêu của cả vùng' },
        { id: 'c', cho: 'tan_tu', t: 'thành người không ai dám động tới' }
      ],
      can: 'khiêm nhường: thấy giá trị của người không có gì',
      bong_toi: { vai: 'ke_thu', cach_chon: 'dựng từ một tạp dịch, đệ tử ngoại môn nghèo hoặc người hầu cùng nơi; mở ở phần 1',
        ra_mat: [
          'đứa tạp dịch gầy trơ xương, lúc nào cũng đi sau cùng, vừa quét vừa lẩm bẩm: "Quét sạch rồi thì chẳng ai bắt lỗi nữa."',
          'đứa ngoại môn nghèo nhất phòng, ăn phần cơm thừa của người khác, khẽ nói: "Ta ăn sau cũng được."',
          'đứa hầu bưng nước, bàn tay nứt nẻ, mắt lúc nào cũng cúi mà thấy hết mọi thứ, vừa đặt xô xuống vừa nói: "Thưa, nước đây ạ."'
        ] },
      guong: { vai: ['thuong', 'huynh'], dd: 'người nhường nhịn đến mức tự hạ mình, lúc nào cũng mang theo {vat_guong}' },
      hy_sinh: 'danh, kiếm tâm (công pháp chính), có thể cả mạng'
    },
    dan: { ke_thu: 'ke_thu', guong: ['thuong', 'huynh'], su: 'su', doi_thu: 'doi_thu', than_nhan: 'than_nhan', ban: 'ban' },
    soi: {
      chinh: { nguoi: 'ke_thu', vat: [
        { id: 'bat_su_me', canh: '{ke_thu} bưng chiếc bát sứ mẻ miệng đi ngang, vấp chân, nước canh bắn lên ống tay áo bạn.', treo: '{ke_thu} cúi xuống nhặt mảnh bát mẻ, cất vào ngực áo như thứ quý nhất mình có.' },
        { id: 'dep_rom', canh: 'chiếc dép rơm của {ke_thu} văng ra, đập vào gấu áo bạn, để lại một vết bùn.', treo: '{ke_thu} nhặt chiếc dép rơm bị giẫm bẹp, vuốt phẳng lại, mang đi như mang một lời thề.' },
        { id: 'dong_xu', canh: '{ke_thu} chìa tay xin bạn một đồng, và bạn ném xuống đất một đồng xu như ném cho kẻ ăn mày.', treo: '{ke_thu} nhặt đồng xu bạn đã ném, lau vào vạt áo rồi cất đi mà không nói một lời.' }
      ] },
      phu: [
        { nguoi: 'guong', vat: [{ id: 'dai_lua' }, { id: 'luoc_go' }] },
        { nguoi: 'su', vat: [{ id: 'kiem_go_su' }] }
      ]
    },
    noi: { chinh: 'học đường trong trấn', tong: 'tông môn', cam: ['Kiếm trủng', 'cấm địa sau núi', 'ngôi mộ cổ ở bìa rừng'] },
    // "Đỉnh" theo cảnh giới thật của người chơi (mục 2.4). ke_thu luôn cao hơn người chơi đúng một bậc ở phần 5.
    thang_suc_manh: [
      { realm: 0, dinh: 'người đứng đầu ngoại môn' },
      { realm: 1, stage: 0, dinh: 'đệ tử nội môn có tiếng' },
      { realm: 1, stage: 2, dinh: 'đệ nhất nội môn, người được chọn làm chân truyền' },
      { realm: 2, dinh: 'trưởng lão, người đứng đầu một vùng nhỏ' },
      { realm: 3, dinh: 'cái tên người ta nhắc như huyền thoại' }
    ],
    phan: [
      // ---------- Phần 1. Bậc thang: biến cố khởi đầu, lời nói dối có lợi ----------
      { id: 'bac_thang', n: 'Bậc thang', chuc_nang: 'biến cố khởi đầu; lời nói dối có lợi', tuoi: 12, cau_hoi: 'Bạn có leo lên được không?',
        biet: '{ke_thu} không quên.', thang_vui: 'Lần đầu bạn đứng đầu kỳ khảo hạch; cả phòng cõng bạn về.', cai_mat: 'danh của kẻ yếu; mầm thù',
        chang: {
          moc: { t: 'Cổng học đường',
            d: '{vet_canh} Từ hôm ấy bạn thề không bao giờ cúi đầu nữa. Hôm nay bạn đứng ở {noi}, và thấy {ke_thu}, {ke_thu_ra_mat}',
            lc: [
              { key: 'ghi', label: 'Nhìn hắn một lúc, ghi nhớ khuôn mặt ấy', kind: 'safe', mat: 'Một chút thanh thản: bạn sẽ nhớ mặt hắn rất lâu.' },
              { key: 'bo_qua', label: 'Bước qua như không thấy', kind: 'safe', mat: 'Một dịp biết hắn từ sớm.' }
            ] },
          leo: { t: 'Kỳ khảo hạch',
            d: 'Kỳ khảo hạch đến. Ai đứng đầu sẽ được thầy chú ý, kẻ cuối bảng phải ở lại quét dọn thêm một năm. {ke_thu} cũng có tên trong danh sách, ở dòng cuối cùng.',
            lc: [
              { key: 'dot_suc', label: 'Dốc hết sức, quyết đứng đầu', kind: 'safe', mat: 'Ba năm không ngơi nghỉ, và thời gian dành cho bạn cũ.', tt: { can: { xp: 0.25 }, han: 36 } },
              { key: 'vua_du', label: 'Học vừa đủ, giữ sức', kind: 'safe', mat: 'Ngôi đầu có thể rơi vào tay người khác.' }
            ] },
          cao_trao: { t: 'Trước cổng học đường', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' },
            d: 'Kết quả dán ngoài cổng: bạn đứng đầu, sân đông nghẹt, và đúng lúc ấy {vat_canh} Có người bật cười, cũng có một đứa bước ra đứng cạnh {ke_thu}; bạn nhớ rất rõ tiếng cười ấy nghe thế nào từ phía bị cười, và bây giờ đến lượt bạn chọn.',
            kieu: [
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ke_thu', cuu: 'ke_thu', label: 'Bắt hắn quỳ xuống lau cho sạch, trước mặt mọi người', mat: 'Danh của một đứa trẻ chẳng còn gì, và một mầm thù bạn vừa gieo.',
                sau: 'Hắn quỳ, lau bằng chính tay áo mình. Không ai cười nữa. Bạn thấy mình cao lên một tấc, và thấy mắt hắn không cúi xuống dù đầu đã cúi.',
                hau: '{ke_thu} đã quen việc bị bạn bắt cúi, và không còn cúi như trước.', fx_them: { thu: { dan: 'ke_thu', why: 'bị bạn bắt quỳ trước đám đông' } } },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ke_thu', cuu: 'ke_thu', label: 'Bảo mọi người thôi cười, nhận cái vụng về là của mình', mat: 'Mặt mũi trước cả sân, và ngôi đầu vừa đạt bỗng nhẹ đi.',
                sau: 'Tiếng cười tắt như bị bóp cổ. {ke_thu} ngẩng lên nhìn bạn rất lâu, không cảm ơn. Bạn không hiểu vì sao ánh mắt ấy khiến bạn khó chịu hơn cả tiếng cười.',
                hau: '{ke_thu} đã nhận một ân huệ mà hắn chưa biết đáp lại bằng gì.' },
              { kieu: 'chong', vt: 'khac', doi: 'ke_thu', cuu: 'ke_thu', label: 'Đánh gục đứa vừa đứng ra bênh hắn', mat: 'Máu, và một người bạn tương lai.',
                hau: 'Đứa từng bị bạn đánh ở sân học đã nhớ, và không bao giờ nhắc.' }
            ] },
          treo: { t: 'Vật bị nhặt lại',
            d: 'Chiều tối, sân vắng. {vat_treo} Hắn đi mà không ngoái lại, và bạn có cảm giác thứ vừa được cất đi không phải là một món đồ.',
            lc: [
              { key: 'goi_lai', label: 'Gọi hắn lại, bắt buông xuống', kind: 'risk', mat: 'Chút phong độ; hắn sẽ ghi nhớ.' },
              { key: 'mac_ke', label: 'Mặc kệ, bỏ về', kind: 'safe', mat: 'Một dịp nhìn rõ hắn.' }
            ] }
        } },
      // ---------- Phần 2. Ngôi đầu: đối thủ ngang tài, gương xuất hiện, chạy đua vào Luyện Khí ----------
      { id: 'ngoi_dau', n: 'Ngôi đầu', chuc_nang: 'đối thủ ngang tài; gương xuất hiện; chạy đua vào Luyện Khí', tuoi: 30, cau_hoi: 'Ai xứng đứng đầu?',
        biet: '{guong} thương bạn, và {ke_thu} đã vào Luyện Khí trước bạn.', thang_vui: 'Đêm hai người ngồi mài kiếm chung.', cai_mat: 'suất nội môn, hoặc lòng tin của gương',
        chang: {
          moc: { t: 'Đêm mài kiếm',
            d: 'Bao năm trôi qua, bạn vẫn đứng đầu, nhưng không còn là người duy nhất giỏi. {guong}, {guong_dd}, ngồi mài kiếm cạnh bạn mỗi đêm và chưa bao giờ hỏi vì sao bạn không cười. {doi_thu} ở bên kia sân, giỏi ngang bạn và biết điều đó.',
            lc: [
              { key: 'cung_mai', label: 'Ngồi mài kiếm cùng {guong}', kind: 'help', mat: 'Những đêm lẽ ra dùng để tu luyện.', fx_them: { gan_bo: { dan: 'guong', d: 1 } } },
              { key: 'mai_mot_minh', label: 'Mang kiếm ra mài một mình', kind: 'safe', mat: 'Một người đồng hành.' }
            ] },
          leo: { t: 'Hạn chót của người phàm',
            d: 'Ba mươi tuổi, nhiều người phàm đã thôi mơ chuyện cảm khí. Thọ nguyên người thường chỉ bảy mươi năm, bạn đã đi qua gần nửa, và kỳ tuyển vào nội môn năm nay chỉ có một suất. Ai chưa chạm được ngưỡng khí cảm sẽ mất tư cách dự.',
            lc: [
              { key: 'tu_gap', label: 'Bế quan luyện gấp, không nhìn lại', kind: 'risk', mat: 'Sức khỏe, và vài năm bạn không nhìn lại.', fx_them: { hp: -10, xp: 0.1 } },
              { key: 'nho_chi', label: 'Nhờ {guong} chỉ cách vận khí', kind: 'help', mat: 'Một phần tự trọng: bạn đã nhờ người ấy.', fx_them: { gan_bo: { dan: 'guong', d: 1 } } }
            ] },
          cao_trao: { t: 'Tranh một suất', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' }, can_gan_bo: { dan: 'guong', min: 3 },
            d: 'Chỉ còn một suất vào nội môn, và người đứng đối diện bạn trên võ đài là {guong}. Người ấy hạ kiếm thấp hơn thường lệ, không phải vì yếu mà vì biết bạn cần nó hơn. Cả sân im lặng chờ bạn.',
            kieu: [
              { kieu: 'duong_tat', vt: 'dkd', doi: 'guong', cuu: 'guong', label: 'Ra đòn hiểm, kết thúc trận trong ba chiêu', mat: 'Lòng tin của {guong}, và một lần bạn không nhìn thẳng vào mắt người ấy.',
                sau: 'Người ấy không kịp đỡ. Tiếng reo vang lên, và bạn thấy mình đứng trên một bậc thang vừa dựng bằng lưng người khác. {guong} gượng dậy, nhặt kiếm, và cười như chưa có gì xảy ra.',
                hau: '{guong} vẫn cười với bạn, nhưng nụ cười ấy không còn tới được mắt.', fx_them: { gan_bo: { dan: 'guong', d: -3 }, tong: { len_noi_mon: true } } },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'guong', cuu: 'guong', label: 'Hạ kiếm, nhường suất cho người ấy', mat: 'Suất vào nội môn, thứ bạn đã chờ mười mấy năm.',
                sau: 'Bạn hạ kiếm trước khi chạm vào người ấy. {guong} nhìn bạn rất lâu như nhìn một người lạ, rồi cúi xuống nhận lấy. Đêm ấy không ai đến mài kiếm cùng ai.',
                hau: '{guong} nợ bạn một thứ, và người ấy không biết trả bằng gì.', fx_them: { tong: { mat_suat: true } } },
              { kieu: 'dao_thoat', vt: 'khac', doi: 'guong', cuu: 'guong', label: 'Nhận thua trước khi giao kiếm, bước ra khỏi sân', mat: 'Danh của kẻ chưa bao giờ thua, và cả lòng tin lẫn suất nội môn.',
                sau: 'Bạn bước ra khỏi sân trong tiếng xì xào. Không ai gọi bạn lại. Chỉ một người nhìn theo, và đó là kẻ vừa thắng mà không cần ra đòn.',
                hau: 'Cả {noi} nhớ ngày bạn bước ra khỏi sân.', fx_them: { tong: { mat_suat: true } } }
            ] },
          treo: { t: 'Tin dữ buổi tối',
            d: 'Tối ấy tin lan khắp {noi}: {ke_thu} đã vào Luyện Khí, trước bạn, và không ai biết hắn làm bằng cách nào. Hắn đi ngang qua bạn trong sân, đầu không còn cúi.',
            lc: [
              { key: 'hoi_cho_ra', label: 'Chặn hắn lại, hỏi cho ra lẽ', kind: 'risk', mat: 'Một chút kiêu hãnh: bạn đã phải hỏi.' },
              { key: 'lam_nhu_khong', label: 'Làm như không nghe', kind: 'safe', mat: 'Một dịp biết sự thật sớm.' }
            ] }
        } },
      // ---------- Phần 3. Cấm địa: đổi gì để không bao giờ thua; người phàm trong dàn bắt đầu chết già ----------
      { id: 'cam_dia', n: 'Cấm địa', chuc_nang: 'đổi gì để không bao giờ thua; người phàm trong dàn bắt đầu chết già', tuoi: 55, canh: { realm: 1 }, cau_hoi: 'Bạn đổi gì để không bao giờ thua?',
        biet: '{guong} giấu một điều.', thang_vui: 'Thắng trận tông chiến (nếu học cấm thuật), cả tông mở tiệc.', cai_mat: 'tuổi thọ, danh, hoặc gương',
        chang: {
          moc: { t: 'Lời đồn về nơi cấm',
            d: 'Bạn đã chạm Luyện Khí, muộn hơn người ta tưởng và sớm hơn hầu hết đồng lứa. Nhưng {ke_thu} đã ở trên bạn một bậc, và trong {noi} người ta bắt đầu nhắc về {noi_cam} như một lối đi tắt nguy hiểm. {guong} ngồi cạnh bạn, tay mân mê {vat_guong}, rồi bỗng im lặng.',
            d_pham: 'Năm mươi lăm tuổi mà bạn vẫn là phàm nhân, thọ nguyên chỉ còn mười lăm năm. Trong {noi} người ta bắt đầu nhắc về {noi_cam} như một lối đi tắt nguy hiểm, và {guong} ngồi cạnh bạn, tay mân mê {vat_guong}, rồi bỗng im lặng.',
            lc: [
              { key: 'nghe_don', label: 'Lắng nghe lời đồn về nơi cấm', kind: 'risk', mat: 'Giấc ngủ yên ổn.' },
              { key: 'bo_ngoai_tai', label: 'Bỏ ngoài tai', kind: 'safe', mat: 'Một lối đi tắt, nếu bạn cần đến nó.' }
            ] },
          // Cảnh lớn KHÔNG có kẻ ác (bắt buộc một lần mỗi đời): thời gian và sĩ diện
          leo: { t: 'Người cũ ở quê', lon: true, canh: { gio: 'hoang_hon', thoi_tiet: 'suong_doc' },
            d: 'Bạn về quê một lần. {ban} đã bạc đầu, mắt mờ, đứng trước hiên nheo mắt hỏi: "Cậu là con nhà ai thế?" Không ai trong làng còn nhớ đứa trẻ từng thề không cúi đầu; chỉ còn tên bạn trên bia công đức của {noi}, và nó không nhắc tới ai ở đây.',
            bien: [
              { khi: { sp: ['ban', 'chet'] }, d: 'Bạn về quê một lần. Nhà {ban} đã đóng cửa; một ông già hàng xóm chỉ cho bạn nấm mồ sau vườn, cỏ đã phủ quá đầu gối. Không ai trong làng còn nhớ đứa trẻ từng thề không cúi đầu.' },
              { khi: { flag: 'phu_chien_su_xong' }, d: 'Bạn về quê một lần, sau những năm loạn lạc. {ban} đã bạc đầu, mắt mờ, đứng giữa nền nhà cháy dở nheo mắt hỏi: "Cậu là con nhà ai thế?" Không ai còn nhớ đứa trẻ từng thề không cúi đầu; chỉ còn tên bạn trên bia công đức của {noi}.' }
            ],
            kieu: [
              { kieu: 'im_lang', vt: 'khac', doi: 'ban', cuu: 'ban', label: 'Nói mình chỉ là người qua đường, không nhận', mat: 'Người bạn cuối cùng của thuở bạn chưa kiêu.',
                sau: 'Bạn nói một lời xin lỗi vì đã làm phiền rồi quay đi. Sau lưng, giọng già run run gọi nhầm một cái tên. Bạn không ngoái lại, và đó là điều bạn nhớ nhất về chuyến về quê ấy.',
                hau: 'Bạn đã để người bạn cuối cùng của thuở nhỏ quên mình, và chính mình quên theo.' },
              { kieu: 'tin', vt: 'nguoc', doi: 'ban', cuu: 'ban', label: 'Kể hết cho {ban} nghe, dù người ấy còn nghe được hay không', mat: 'Sĩ diện của người đã mất nhiều năm để dựng nên nó.',
                sau: 'Bạn ngồi xuống bậc cửa và kể từ cái bánh, cái bát, đến những đêm ở nơi cấm. Người ấy nghe, không hiểu hết, và vỗ nhẹ lên tay bạn như vỗ một đứa trẻ. Bạn ngồi đó đến khi trời tối.',
                hau: 'Bạn đã kể hết cho một người nghe mà không phán xét, lần đầu tiên sau rất nhiều năm.' }
            ] },
          cao_trao: { t: 'Đêm ở nơi cấm', lon: true, canh: { gio: 'dem', thoi_tiet: 'suong_doc' },
            d: 'Đêm ấy bạn đứng trước {noi_cam}. Bên trong có một thứ tiền bối tà đạo để lại: môn cấm thuật cho người không bao giờ chịu thua, cái giá là tuổi thọ. Trận tông chiến sắp tới, {ke_thu} đã đứng bên kia chiến tuyến, và {guong} đứng sau lưng bạn từ lúc nào.',
            kieu: [
              { kieu: 'duong_tat', vt: 'dkd', doi: 'guong', cuu: 'guong', label: 'Bước vào, học môn cấm thuật', mat: 'Mấy năm tuổi thọ, và một phần bạn vẫn gọi là lương tâm.',
                sau: 'Cánh cửa đá khép lại sau lưng. Thứ bạn nhận được nóng như than và nhẹ như hơi thở. Sáng ra bạn mạnh hơn, và tóc bạc thêm một mảng.',
                hau: 'Bạn mạnh hơn, nhanh hơn, và không ai thấy chỗ tóc bạc dưới mũ.', fx_them: { xp: 0.2, hp: -15 } },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'guong', cuu: 'guong', label: 'Quay lưng bỏ đi, chịu thua trận tông chiến', mat: 'Trận lớn của {noi}, và danh của kẻ chưa từng thua.',
                sau: 'Bạn đi ngược về phía ánh đèn. Trận tông chiến thua, tên bạn bị gạch khỏi bảng. {guong} chờ ở cửa, không nói gì, chỉ đưa bạn chén nước còn ấm.',
                hau: 'Bạn thua một trận, và có người ở lại chờ bạn.', fx_them: { rep: { danh: -2 } } },
              { kieu: 'im_lang', vt: 'khac', doi: 'guong', cuu: 'guong', label: 'Im lặng, để {guong} bước vào thay', mat: 'Một người bạn thương, và sự im lặng của chính bạn.',
                sau: '{guong} nhìn bạn một lúc, rồi tự cầm đèn đi vào. Bạn đứng ở cửa đếm từng hơi thở. Khi người ấy ra, tay trống, mắt không chịu nhìn bạn.',
                hau: '{guong} bước ra khỏi nơi cấm khác hẳn lúc bước vào.' }
            ] },
          treo: { t: 'Điều được giấu',
            d: 'Sau trận, {noi} mở tiệc hay chìm trong im lặng, tùy việc bạn đã chọn. {guong} nói có chuyện muốn kể, nhìn {vat_guong} trong tay rồi thôi. Bạn thấy người ấy đang giấu một điều.',
            lc: [
              { key: 'gang_hoi', label: 'Gặng hỏi tới cùng', kind: 'risk', mat: 'Sự yên tĩnh của một đêm.' },
              { key: 'de_yen', label: 'Để người ấy giữ điều ấy', kind: 'safe', mat: 'Một sự thật có thể cứu bạn.' }
            ] }
        } },
      // ---------- Phần 4. Đỉnh (chiến thắng giả): lên đỉnh, cấm thuật phản phệ ----------
      { id: 'dinh', n: 'Đỉnh', chuc_nang: 'chiến thắng giả: lên đỉnh; cấm thuật phản phệ', tuoi: 85, canh: { realm: 1, stage: 2 }, cau_hoi: 'Đứng trên đỉnh thì thấy gì?',
        biet: '{ke_thu} là người duy nhất không bất ngờ.', thang_vui: 'Sáng hôm đại điển, một gói quà từ quê gửi lên.', cai_mat: 'đan điền, ghế, hoặc lương tâm',
        chang: {
          moc: { t: 'Gói quà từ quê',
            d: 'Sáng hôm đại điển phong chân truyền, một gói quà từ quê được gửi lên, do tay {ban} gói: vài củ khoai nướng và một nắm hạt giống. Hôm nay bạn là {dinh}, và gói quà nhỏ ấy là thứ duy nhất khiến tay bạn run.',
            bien: [{ khi: { sp: ['ban', 'chet'] }, d: 'Sáng hôm đại điển phong chân truyền, con cháu {ban} mang lên một gói quà kèm lời dặn lúc lâm chung: vài củ khoai nướng và một nắm hạt giống. Hôm nay bạn là {dinh}, và gói quà nhỏ ấy là thứ duy nhất khiến tay bạn run.' }],
            lc: [
              { key: 'mo_goi', label: 'Mở ra ngay, ăn một củ khoai', kind: 'help', mat: 'Chút oai vệ ngày đại điển.' },
              { key: 'cat_di', label: 'Cất đi, sau đại điển hẵng xem', kind: 'safe', mat: 'Hơi ấm của một người cũ.' }
            ] },
          leo: { t: 'Cấm thuật phản phệ',
            d: 'Đêm trước đại điển, cấm thuật bắt đầu phản phệ: đan điền co lại từng nhịp, khí đảo ngược lên cổ. Bạn giấu được thầy thuốc, giấu được {guong}, và không giấu nổi cơn đau.',
            lc: [
              { key: 'nuot_thuoc', label: 'Nuốt thuốc giảm đau, gắng qua đêm', kind: 'safe', mat: 'Vài năm thọ nguyên về sau.', fx_them: { hp: -10 } },
              { key: 'nho_guong', label: 'Nhờ {guong} giúp, nói thật một phần', kind: 'help', mat: 'Một bí mật bạn đã giữ rất lâu.', fx_them: { gan_bo: { dan: 'guong', d: 1 } } }
            ] },
          cao_trao: { t: 'Đại điển phong chân truyền', lon: true, canh: { gio: 'ngay', thoi_tiet: 'troi_quang' }, can_gan_bo: { dan: 'doi_thu', min: 0 },
            ep: { hp: -25, xp: -0.15 },
            d: 'Đại điển, cả {noi} đứng dưới bậc, kiếm tôn già đặt tay lên vai bạn. Đúng lúc ấy phản phệ vỡ ra: đan điền chấn động, máu trào khóe miệng, mọi ánh mắt dừng lại ở bạn. Từ {dinh} đến kẻ bị nghi ngờ chỉ cách nhau một hơi thở.',
            kieu: [
              { kieu: 'duong_tat', vt: 'dkd', doi: 'guong', cuu: 'guong', label: 'Nuốt máu xuống, gượng đứng thẳng, nói đó là hạ khí thông thường', mat: 'Cơ hội sống ngay thẳng; sự thật sẽ có người đòi.',
                sau: 'Bạn lau máu bằng tay áo và mỉm cười. Kiếm tôn gật đầu. Tiếng reo vang lên. Chỉ có hai người trong sân không vỗ tay: {guong} và {ke_thu}.',
                hau: 'Bạn đã đứng trên đỉnh bằng một lời nói dối, và mỗi ngày phải đứng thẳng thêm một lần nữa.' },
              { kieu: 'phuc_tung', vt: 'nguoc', doi: 'ke_thu', cuu: 'guong', label: 'Quỳ xuống, thú nhận trước toàn tông', mat: 'Ghế chân truyền, và tiếng tăm của cả một đời.',
                sau: 'Bạn quỳ trên bậc đá, nói hết từng chữ về đêm ở {noi_cam}. Sân im như chưa từng có đại điển. Kiếm tôn nhìn bạn rất lâu rồi gỡ tay khỏi vai bạn.',
                hau: 'Bạn mất ghế chân truyền, nhưng lần đầu sau nhiều năm bạn ngủ không mộng.', fx_them: { tong: { giang: true } } },
              { kieu: 'tam_ma', vt: 'dkd', doi: 'doi_thu', cuu: 'guong', label: 'Đổ cho {doi_thu}: bảo hắn bỏ độc vào chén trà của bạn', mat: 'Điều bạn không dám nói ra.',
                sau: 'Lời nói ra dễ như hơi thở. {doi_thu} bị lôi đi giữa tiếng la ó, mắt nhìn bạn không tin nổi. Bạn đứng thẳng, và không ai thấy bàn tay bạn run.',
                hau: '{doi_thu} không bao giờ nhìn bạn nữa, kể cả khi hắn hết cơ hội nhìn.', fx_them: { thu: { dan: 'doi_thu', why: 'bị bạn vu oan giữa đại điển' } } }
            ] },
          treo: { t: 'Người không bất ngờ',
            d: 'Đêm sau đại điển, bạn đứng một mình trên bậc thang vắng. {ke_thu} đi ngang, dừng lại, không chào, chỉ nhìn bạn như nhìn một cái cây đã mục trong ruột từ lâu. "Ta đợi ngày này lâu rồi," hắn nói.',
            lc: [
              { key: 'hoi', label: 'Hỏi hắn đã biết từ bao giờ', kind: 'risk', mat: 'Vẻ thản nhiên của người đứng trên đỉnh.' },
              { key: 'quat', label: 'Quát bảo hắn đi', kind: 'safe', mat: 'Sự thật hắn sắp nói ra.' }
            ] }
        } },
      // ---------- Phần 5. Bát cơm thừa: tất cả đã mất, đảo vai ----------
      { id: 'bat_com', n: 'Bát cơm thừa', chuc_nang: 'tất cả đã mất; đảo vai', tuoi: 100, cau_hoi: 'Bạn còn gì khi không còn gì?',
        biet: '{ke_thu} đã học tất cả từ bạn.', thang_vui: '(không có; phần tối nhất)', cai_mat: 'gương, hoặc phần còn lại của sĩ diện',
        chang: {
          moc: { t: 'Tất cả đã mất',
            d: 'Bạn không còn là {dinh}. Ghế đã thuộc về người khác, đan điền vẫn đau âm ỉ, và {noi} giờ do {ke_thu} nắm trong tay. Không ai trục xuất bạn; họ chỉ thôi chào, và để phần cơm của bạn nguội ở cuối bàn.',
            lc: [
              { key: 'o_lai', label: 'Ở lại, nhận phần cơm nguội', kind: 'safe', mat: 'Phần sĩ diện còn sót.' },
              { key: 'doi_cho', label: 'Đòi lại chỗ ngồi cũ', kind: 'risk', mat: 'Những ngày yên lặng.' }
            ] },
          leo: { t: 'Hình đường',
            d: '{ke_thu} cho gọi bạn vào Hình đường, nơi bạn từng bước qua như bước qua sân nhà. Hắn rót trà chậm rãi, từng động tác rất giống động tác của bạn ngày trước. "Ta học tất cả từ ngươi," hắn nói, giọng không giận.',
            lc: [
              { key: 'nghe_het', label: 'Ngồi xuống nghe hắn nói hết', kind: 'safe', mat: 'Chút kiêu hãnh cuối của người từng đứng đầu.' },
              { key: 'hoi_ly', label: 'Hỏi vì sao hắn không giết bạn', kind: 'risk', mat: 'Sự thương hại bạn không muốn nhận.' }
            ] },
          cao_trao: { t: 'Bát cơm thừa', lon: true, canh: { gio: 'dem', thoi_tiet: 'mua' }, can_gan_bo: [{ dan: 'guong', min: 0 }, { dan: 'ke_thu', min: 0 }],
            d: 'Đêm ấy {ke_thu} sai người đặt trước mặt bạn một bát cơm thừa, cơm nguội trộn nước canh, đặt xuống nền đá giữa sân như người ta đặt cho chó. Cả {noi} đứng xem, quân của {the_luc} ngoài tường chờ tin sơn môn sụp, và hắn nói: "Ăn đi, ta học cách đặt bát từ ngươi."',
            kieu: [
              { kieu: 'phuc_tung', vt: 'nguoc', doi: 'ke_thu', cuu: 'guong', label: 'Quỳ xuống, ăn hết bát cơm', mat: 'Phần sĩ diện còn lại, và cái nhìn của cả sơn môn.',
                sau: 'Bạn quỳ xuống. Cơm nguội và mặn chát. Bạn ăn từng miếng, mắt nhìn vào bát chứ không nhìn ai. Khi bát sạch, không ai cười. Một đệ tử trẻ quay đi, tay che miệng.',
                hau: 'Bạn đã ăn hết bát cơm, và người ta nhìn bạn khác đi, theo cách bạn chưa gặp bao giờ.' },
              { kieu: 'chong', vt: 'dkd', doi: 'ke_thu', cuu: 'guong', label: 'Hất bát cơm, chộp lấy kiếm của kẻ đứng gần nhất', mat: 'Một người bạn còn lại, nếu máu đổ.', fx_them: { roi: { dan: 'guong' } },
                hau: 'Bạn đã vung kiếm giữa sân, và {guong} đã đi mà không nói một lời.' },
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ke_thu', cuu: 'guong', label: 'Đứng thẳng, xin hắn giết bạn thay cho những người khác', mat: 'Mạng bạn, nếu hắn nhận lời.',
                sau: 'Bạn không cúi xuống. "Ta xin ngươi," bạn nói, và đó là lần đầu bạn xin ai điều gì. Cả sân chết lặng. {ke_thu} nhìn bạn rất lâu rồi quay đi mà không trả lời.',
                hau: '{ke_thu} không giết bạn, và không ai trong sân hiểu vì sao.' },
              { kieu: 'tam_ma', vt: 'dkd', doi: 'ke_thu', cuu: 'guong', label: 'Đêm nay, vào phòng {ke_thu}, kết thúc mọi chuyện bằng một nhát dao', mat: 'Điều bạn không dám nói ra.',
                sau: 'Bạn nắm dao, và nhát dao ấy đâm lệch một tấc vì bàn tay bạn run. {ke_thu} mở mắt, không kêu, chỉ nhìn bạn như nhìn một điều hắn đã chờ từ lâu.',
                hau: 'Từ đêm ấy {ke_thu} không còn quay lưng lại với bạn, và bạn cũng không dám ngủ.', fx_them: { thu: { dan: 'ke_thu', why: 'bị bạn đâm lén trong đêm' } } }
            ] },
          treo: { t: 'Tiếng vây ngoài tường',
            d: 'Sáng hôm sau chuông báo động vang lên không đúng giờ. Quân của {the_luc} đã bao quanh chân núi, cờ đen dựng kín sườn đồi, và {ke_thu} đứng trên tường thành, mặt không còn giống người từng cúi đầu năm nào.',
            lc: [
              { key: 'ra_tuong', label: 'Lên tường thành nhận phần việc', kind: 'help', mat: 'Chỗ ẩn nấp cuối cùng.' },
              { key: 'o_trong', label: 'Ở lại trong Hình đường', kind: 'safe', mat: 'Tiếng nói của người còn có thể hành động.' }
            ] }
        } },
      // ---------- Phần 6. Trận cuối: kẻ mất hết cho đi được gì; đồng hồ thọ nguyên ----------
      { id: 'tran_cuoi', n: 'Trận cuối', chuc_nang: 'kẻ mất hết cho đi được gì; đồng hồ thọ nguyên', tuoi: 115, tho: 0.15, cau_hoi: 'Kẻ đã mất hết còn cho đi được gì?',
        biet: '(kết đời)', thang_vui: 'Đệ tử nhỏ nhất của tông nhận ra bạn và cúi chào.', cai_mat: '(kết cục)',
        chang: {
          moc: { t: 'Trận vây',
            d: 'Trận vây đã sang ngày thứ chín. Cơm trong kho cạn, đệ tử nhỏ nhất của {noi} còn chưa cao hơn cánh cổng. Bạn đã sống lâu hơn hầu hết những người từng biết bạn, và hơi thọ nguyên trong ngực mỏng như sợi chỉ.',
            lc: [
              { key: 'dung_canh', label: 'Đứng cạnh đám đệ tử nhỏ', kind: 'help', mat: 'Một giấc ngủ yên trong hậu viện.' },
              { key: 'len_tran', label: 'Lên trận nhãn xem tình hình', kind: 'risk', mat: 'Chỗ đứng an toàn.' }
            ] },
          leo: { t: 'Đồng hồ thọ nguyên',
            d: 'Thọ nguyên Luyện Khí là một trăm ba mươi năm, và bạn đã đi qua phần lớn. Chỉ Trúc Cơ mới kéo đời người dài thêm một lần nữa, và cánh cửa ấy còn rất xa. Bạn có thể dốc cạn những gì còn lại để thử, hoặc để chúng nuôi sống người khác.',
            lc: [
              { key: 'dot_pha', label: 'Dốc cạn để thử chạm Trúc Cơ', kind: 'risk', mat: 'Gần hết phần đời còn lại, nếu thất bại.', tt: { can: { realm: 2 }, han: 120 } },
              { key: 'buong', label: 'Buông, dành sức cho người khác', kind: 'safe', mat: 'Cơ hội cuối cùng được sống thêm một đời.' }
            ] },
          cao_trao: { t: 'Kẻ giữ trận', lon: true, canh: { gio: 'dem', thoi_tiet: 'giong_bao' }, can_gan_bo: { dan: 'ke_thu', min: 0 },
            d: '{ke_thu} một mình giữ trận nhãn, áo đẫm máu, hơi thở đứt từng đoạn: hắn sắp chết, và trận sẽ vỡ trong vòng một nén hương. Hắn nhìn bạn, không cầu xin, chỉ nói: "Ngươi muốn gì thì làm, ta không còn sức giữ nữa." Bạn chỉ còn một chút tu vi cuối, vừa đủ để cứu hắn hoặc để cứu danh của mình.',
            bien: [
              { khi: { flag: 'lat_doi_mat' }, d: '{ke_thu} một mình giữ trận nhãn, áo đẫm máu, hơi thở đứt từng đoạn: hắn sắp chết, và trận sẽ vỡ trong vòng một nén hương. Bạn nhớ mình từng được gọi là đá mài, và đá mài cũng có quyền chọn mài vào ai. Bạn chỉ còn một chút tu vi cuối, vừa đủ để cứu hắn hoặc để cứu danh của mình.' },
              { khi: { flag: 'lat_quay_di' }, d: '{ke_thu} một mình giữ trận nhãn, áo đẫm máu, hơi thở đứt từng đoạn: hắn sắp chết, và trận sẽ vỡ trong vòng một nén hương. Bạn nhớ mình đã quay lưng với sự thật năm nào, và biết mình quay lưng được thêm một lần. Bạn chỉ còn một chút tu vi cuối, vừa đủ để cứu hắn hoặc để cứu danh của mình.' },
              { khi: { flag: 'lat_tha' }, d: '{ke_thu} một mình giữ trận nhãn, áo đẫm máu, hơi thở đứt từng đoạn: hắn sắp chết, và trận sẽ vỡ trong vòng một nén hương. {guong} từng nói thà bạn mạnh mà chết sớm; hôm nay bạn mới hiểu mạnh để làm gì. Bạn chỉ còn một chút tu vi cuối, vừa đủ để cứu hắn hoặc để cứu danh của mình.' },
              { khi: { flag: 'lat_trach' }, d: '{ke_thu} một mình giữ trận nhãn, áo đẫm máu, hơi thở đứt từng đoạn: hắn sắp chết, và trận sẽ vỡ trong vòng một nén hương. Bạn đã quay mặt trước lòng thương xót cuối cùng của {guong}, và tự hỏi lần này có khác không. Bạn chỉ còn một chút tu vi cuối, vừa đủ để cứu hắn hoặc để cứu danh của mình.' },
              { khi: { flag: 'lat_nhan_toi' }, d: '{ke_thu} một mình giữ trận nhãn, áo đẫm máu, hơi thở đứt từng đoạn: hắn sắp chết, và trận sẽ vỡ trong vòng một nén hương. Bạn đã nhận câu đùa năm xưa là của bạn, và người đang hấp hối là em của kẻ bạn đã giết bằng nó. Bạn chỉ còn một chút tu vi cuối, vừa đủ để cứu hắn hoặc để cứu danh của mình.' },
              { khi: { flag: 'lat_chai_mat' }, d: '{ke_thu} một mình giữ trận nhãn, áo đẫm máu, hơi thở đứt từng đoạn: hắn sắp chết, và trận sẽ vỡ trong vòng một nén hương. Bạn đã nói mình quên chuyện năm xưa, nhưng người trước mặt thì không quên. Bạn chỉ còn một chút tu vi cuối, vừa đủ để cứu hắn hoặc để cứu danh của mình.' }
            ],
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'ke_thu', cuu: 'ke_thu', label: 'Đưa nốt chút tu vi cuối, cứu hắn và giữ trận', mat: 'Cơ hội chạm Trúc Cơ, và những năm cuối cùng.',
                sau: 'Chút khí cuối rời khỏi bạn như hơi thở rời bình lạnh. Trận nhãn sáng lên. {ke_thu} ngẩng đầu, lần đầu nhìn bạn như một con người, rồi gục xuống. Bạn không còn biết tay mình nóng hay lạnh.',
                hau: 'Bạn không còn tu vi, và {ke_thu} sống nhờ phần khí cuối của bạn.', fx_them: { xp: -0.5, vat: '@vat' } },
              { kieu: 'im_lang', vt: 'khac', doi: 'ke_thu', cuu: 'ke_thu', label: 'Đứng nhìn, để hắn chết', mat: 'Một con người trước mặt, và chút tình đồng môn cuối cùng.',
                sau: 'Bạn đứng yên. Hắn không chửi, chỉ nhắm mắt như đã đoán trước. Khi trận nhãn tắt, bạn thấy mình sống thêm một khắc và trơ trọi thêm một đời.',
                hau: 'Hắn chết trong im lặng, bạn sống trong im lặng, và hai điều ấy giống nhau hơn bạn nghĩ.', fx_them: { chet: { dan: 'ke_thu' } } },
              { kieu: 'dung_khuyet_diem', vt: 'dkd', doi: 'ke_thu', cuu: 'ke_thu', label: 'Giành lấy trận nhãn, nhận công giữ trận về mình', mat: 'Chút danh dự cuối cùng của kẻ biết xấu hổ.',
                sau: 'Bạn giật trận nhãn khỏi tay hắn và đứng thẳng giữa ánh sáng. Cả sơn môn thấy bạn, không thấy hắn nằm dưới chân bạn. Bạn lại là {dinh}, chỉ là lần này không còn ai đáng để bạn khoe.',
                hau: 'Bạn lại đứng trên đỉnh, và không có ai ở dưới để nhìn.', fx_them: { chet: { dan: 'ke_thu' }, rep: { danh: 2 } } }
            ] },
          treo: { t: 'Lời chào của đứa nhỏ',
            d: 'Sáng hôm sau trận vây tan. Đệ tử nhỏ nhất của {noi} đứng trước bạn, ngước nhìn rất lâu, rồi chắp tay cúi chào như chưa từng có ai dạy nó phải cúi. Bạn nhìn quanh, tìm một thứ để đặt tay lên.',
            lc: [
              { key: 'chao_lai', label: 'Cúi chào lại đứa trẻ', kind: 'help', mat: 'Chút kiêu hãnh cuối cùng.' },
              { key: 'quay_di', label: 'Quay đi, không nhận lời chào', kind: 'safe', mat: 'Lời chào của một người không phải cúi.' }
            ] }
        } }
    ],
    // Ba phương án lật (bốc một mỗi đời, nổ ở phần 4 hoặc 5). Chặng "treo" của phần nổ bị thay bằng đoạn sự thật; hai lựa chọn sau đó đặt cờ để cao trào phần 6 đổi hình.
    lat: [
      { id: 'a', kieu: 'ke_dung_sau', ten: 'Người thầy tạo ra cả hai', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'cao_trao', t: 'Giữa sân hôm ấy, {su} đứng ở hiên, nhìn hết từ đầu đến cuối mà không nói một lời ngăn.', hieu: '{su} đứng đó là để xem {ke_thu} có chịu nổi hay không.' },
          { phan: 2, o: 'treo', t: 'Người ta bảo {ke_thu} được nhận vào nơi tốt nhất của {noi} dù tư chất chẳng đủ, và chỉ {su} ký tên.', hieu: 'Từ ngày ấy {su} đã chọn {ke_thu}, trước khi bạn kịp hiểu vì sao.' },
          { phan: 3, o: 'moc', t: '{guong} đưa bạn xem {vat_guong} và nói đó là quà của {su} từ ngày còn nhỏ, chẳng rõ vì sao.', hieu: 'Cả {guong} cũng nằm trong tay {su} từ trước khi bạn gặp.' }
        ],
        no: { biet: '{su} đã cố ý để bạn giẫm {ke_thu}, để rèn hắn thành thanh kiếm thứ hai của tông; bạn chỉ là đá mài.',
          hieu: '{su} đã sắp đặt cả hai từ sân học năm ấy.',
          d: '{su} gọi bạn vào phòng trà lần cuối, rót hai chén như mọi lần. "Ta chưa từng dạy ngươi thua, vì ta cần một thanh kiếm; và ta cần một viên đá để mài thanh kiếm thứ hai. Năm ấy ở sân, ta đã không ngăn. Ngươi là đá mài tốt nhất ta từng có." Bạn nhìn {ke_thu} đứng ngoài cửa, và hiểu hắn cũng đã nghe thấy.',
          lc: [
            { key: 'chat_van', label: 'Hỏi thẳng {su}: ông có từng thương ai trong hai người', kind: 'risk', mat: 'Một điều bạn không muốn nghe trả lời.', flag: 'lat_doi_mat' },
            { key: 'quay_di', label: 'Quay lưng đi, không hỏi', kind: 'safe', mat: 'Sự thật về người thầy bạn đã tin.', flag: 'lat_quay_di' }
          ] } },
      { id: 'b', kieu: 'dong_minh_tay_trong', ten: 'Gương đưa cấm thuật cho bạn', phan_no: 4, o_no: 'treo',
        manh_moi: [
          { phan: 2, o: 'leo', t: '{guong} biết đường vào {noi_cam} rõ như đường về phòng mình. Bạn hỏi, người ấy chỉ cười bảo ngày nhỏ đi lạc.', hieu: '{guong} đã đi tìm cách cho bạn từ rất sớm.' },
          { phan: 3, o: 'treo', t: 'Đêm trước trận tông chiến, {guong} khóc, trước khi bạn thắng chứ không phải sau.', hieu: '{guong} khóc vì biết bạn sẽ thắng, và biết bạn sẽ trả giá bằng gì.' },
          { phan: 3, o: 'moc', t: 'Mùi nhang của {noi_cam} thoảng ra từ {vat_guong} của {guong}.', hieu: '{guong} đã vào nơi cấm trước bạn.' }
        ],
        no: { biet: '{guong} đã đưa cấm thuật cho bạn, vì biết bạn không bao giờ chịu thua, và thà để bạn mạnh mà chết sớm còn hơn sống mà nhục.',
          hieu: '{guong} đã đưa bạn tới cấm thuật vì thương, không phải vì ác.',
          d: 'Đêm sau đại điển, bạn đứng một mình trên bậc thang vắng. {ke_thu} đi ngang, nhìn bạn như nhìn một cái cây đã mục trong ruột rồi bỏ đi. Một lát sau {guong} đến, mắt đỏ. "Là ta," người ấy nói. "Ta đã đưa {guong_goi} tới nơi ấy. Ta biết {guong_goi} sẽ không bao giờ chịu thua, và ta thà {guong_goi} mạnh mà chết sớm còn hơn sống mà nhục." Người ấy đặt {vat_guong} xuống trước mặt bạn, hơi nhang cũ thoảng lên.',
          lc: [
            { key: 'tha', label: 'Nắm tay người ấy, nói bạn không trách', kind: 'help', mat: 'Chút phẫn nộ bạn đáng được có.', flag: 'lat_tha', fx_them: { gan_bo: { dan: 'guong', d: 3 } } },
            { key: 'trach', label: 'Quay mặt đi, nói bạn không cần ai thương hại', kind: 'safe', mat: 'Người duy nhất đã vì bạn mà giấu một điều.', flag: 'lat_trach', fx_them: { gan_bo: { dan: 'guong', d: -3 } } }
          ] } },
      { id: 'c', kieu: 'chinh_ban_la_thu_pham', ten: 'Chính bạn là thủ phạm', phan_no: 5, o_no: 'treo',
        manh_moi: [
          { phan: 1, o: 'treo', t: 'Khi nhặt xong, {ke_thu} nói đúng tên làng quê bạn, rồi đi trước khi bạn kịp hỏi vì sao hắn biết.', hieu: '{ke_thu} đã biết bạn là ai từ lúc ấy.' },
          { phan: 2, o: 'treo', t: '{ke_thu} chặn bạn ở cuối hành lang, hỏi một câu không đầu không đuôi: "Ngươi còn nhớ cổng học đường không?"', hieu: 'Câu hỏi ấy là về cổng làng, nơi một người đã chết vì lời đùa của bạn.' },
          { phan: 4, o: 'leo', t: '{ke_thu} đặt {vat} lên bàn trước mặt bạn; ở đáy có khắc một chữ nhỏ, chữ tên một cái làng bạn nghe quen mà không nhớ.', hieu: 'Chữ khắc là tên làng của người đã chết vì lời đùa của bạn.' }
        ],
        no: { biet: 'Kẻ đã hạ nhục bạn năm mười tuổi chết vì một câu nói đùa của bạn lan khắp làng; {ke_thu} là em của người ấy, vào tông chỉ để tìm bạn.',
          hieu: '{ke_thu} đến vì người anh đã chết vì lời đùa của bạn.',
          d: 'Đêm ấy {ke_thu} nói hết, giọng rất đều: "Kẻ đã hạ nhục ngươi năm mười tuổi là anh ta. Anh ta chết vì một câu đùa của ngươi lan khắp làng. Ta vào {noi} để tìm kẻ đã nói câu ấy." Bạn nhớ ra câu đùa đó, và nụ cười sau nó.',
          lc: [
            { key: 'nhan_toi', label: 'Nhận tội, nói bạn xin chịu', kind: 'pay', mat: 'Chỗ đứng cao nhất mà bạn đã tự cho mình.', flag: 'lat_nhan_toi', fx_them: { rep: { danh: -1 } } },
            { key: 'chai_mat', label: 'Nói bạn đã quên, và lỗi không ở bạn', kind: 'risk', mat: 'Một lần đứng thẳng nhìn người ta.', flag: 'lat_chai_mat' }
          ] } }
    ],
    khong_ke_ac: { phan: 3, o: 'leo', ten: 'Người cũ ở quê không nhận ra bạn' },
    // Kết cục: chọn theo chuỗi kiểu lựa chọn (vt) ở TT.kb.ketKhuon. Hình ảnh khép lại đối lập hình ảnh mở đầu.
    ket: {
      toan_ven: { t: 'Toàn vẹn', kv: 2, dk: { loai: 'nguoc', min: 3, tu_phan: 3, p6: 'hy_sinh' },
        log: '{ten} không còn tu vi. Bạn rửa sạch {vat} dưới vòi nước lạnh, rửa mãi như rửa một điều không thể sạch, rồi đặt nó xuống cạnh giường {ke_thu}, nơi hắn đang thở những hơi đầu tiên sau trận.' },
      doa: { t: 'Đọa', kv: 0, xau: true, dk: { loai: 'dkd', phan: [4, 6] },
        log: '{ten} ngồi ở ghế cao nhất của {noi}. Một tạp dịch quỳ lau sàn dưới chân, và bạn không nhìn xuống.' },
      co_doc: { t: 'Cô độc', kv: 1, xau: true, dk: { loai: 'con_lai' },
        log: '{ten} còn sống, và đứng đầu {noi} trống vắng. Không ai còn nhớ bạn từng bị ai giẫm, hay từng giẫm ai.' }
    }
  });
})();
