// Khuôn PHỤ mẫu (AI1a, loại the_gioi): chiến sự tới làng, dựa tuyến viết tay W1 (js/data/stories/tg_chien_su.js). Chuyển thành khuôn để AI viết chữ lúc chơi như khuôn chính;
// K4 sẽ chuyển dần các tuyến viết tay khác theo đúng định dạng này. Công tắc D.STORY.phuOn (mặc định tắt): bật thì khuôn phụ mở và thay tuyến `thay`.
//
// ĐỊNH DẠNG KHUÔN PHỤ (story-lint kiểm bằng TT.kb.lintPhu):
//   id, ten, loai: 'than_phan' | 'the_gioi' | 'quan_he', thay (id tuyến viết tay mà khuôn này thay khi phuOn),
//   mo: điều kiện mở theo K1 (khóa thân phận N1b: tong, hoi, nghe, dao, xt, vung, nhan, ke_thu, kd; hoặc cờ biến cố mô phỏng: flag),
//   vai: { <vai trong chữ>: <vai dàn> } (than_nhan, ban, su, doi_thu, huynh, thuong, ke_thu, ke_thua: người ở vai lấy từ dàn định mệnh),
//   do_vao: { phan: số phần của khuôn chính mà tuyến phụ đổ vào, flag: cờ đặt khi xong (khuôn chính đọc cờ này trong `bien`), fx: hậu quả gieo cho dàn khi xong, hat: chữ gieo cho AI },
//   phan: [ 2 đến 3 × { id, n, cau_hoi, chang: { moc, leo, cao_trao } } ] (3 chặng mỗi phần; lc của moc và leo như khuôn chính; cao_trao.kieu: [ { kieu (thư viện), vt, doi, cuu, label, mat, sau, hau, ket?, fx_them? } ]),
//   ket: { <id>: { t, kv, xau?, log } } (≥ 2); kiểu nào của cao trào phần cuối có `ket` thì dẫn thẳng tới kết cục ấy.
// Story Director: tối đa MỘT tuyến phụ nóng; chỉ mở trong khoảng yên giữa hai cao trào chính (D.STORY.phuGiaYen); cao trào phụ không trùng năm với cao trào chính.
(function () {
  const D = window.TT.data;

  D.STORY.regPhu({
    id: 'phu_chien_su', ten: 'Lửa tới làng', loai: 'the_gioi', thay: 'tg_chien_su',
    mo: { flag: 'warAt' },
    vai: { than_nhan: 'than_nhan', ban: 'ban', huynh: 'huynh' },
    do_vao: { phan: 3, flag: 'phu_chien_su_xong', fx: { gan_bo: { dan: 'ban', d: 1 } }, hat: 'đêm lửa ở làng, mùi khói bám trong tóc nhiều năm' },
    phan: [
      { id: 'tin_bao', n: 'Tin báo', cau_hoi: 'Làng có giữ được không?',
        chang: {
          moc: { t: 'Tin báo đường xa',
            d: 'Tin chiến sự truyền về qua đường buôn: quân triều và quân một hầu quốc đã giao trận ở phía tây. Người làng bàn chuyện trưng thu lương trước, tới lượt trai tráng sau. {than_nhan} đứng lặng ở ngưỡng cửa, tay vẫn cầm chiếc rá.',
            lc: [
              { key: 'cho_tin', label: 'Chờ xem tin tức rồi tính', kind: 'safe', mat: 'Thời gian chuẩn bị.' },
              { key: 'chuan_bi', label: 'Cất lương, tìm chỗ trốn cho cả nhà', kind: 'help', mat: 'Vài ngày công và mấy đồng bạc.' }
            ] },
          leo: { t: 'Lính bại trận',
            d: 'Ba tháng sau, đoàn lính bại trận rút qua làng, đói và dễ nổi nóng. Họ đòi gạo, và có kẻ bắt đầu nói chuyện đốt kho để chặn quân địch. {ban} kéo tay áo bạn: "Cậu làm gì đi chứ."',
            lc: [
              { key: 'chia_gao', label: 'Chia gạo cho dân cùng nấu', kind: 'help', mat: 'Một phần lương dự trữ của nhà bạn.', fx_them: { gold: -25 } },
              { key: 'giu_kho', label: 'Giữ kho, không cho ai đụng vào', kind: 'safe', mat: 'Lòng người trong làng.' }
            ] },
          cao_trao: { t: 'Đêm lửa', lon: true, canh: { gio: 'dem', thoi_tiet: 'chien_loan' },
            d: 'Đêm ấy kho gạo cháy. Lửa liếm lên mái nhà đầu làng, và {than_nhan} còn ở trong. Tiếng la, tiếng ngựa, tiếng kẻ đào ngũ trèo tường, và chỉ đủ thời gian cứu một thứ.',
            kieu: [
              { kieu: 'hy_sinh', vt: 'nguoc', doi: 'than_nhan', cuu: 'than_nhan', label: 'Lao vào lửa cứu {than_nhan}', mat: 'Sức khỏe, và phần lương thực còn lại.',
                sau: 'Bạn xông vào qua khói, vác người ấy ra khi mái nhà đổ xuống phía sau. Tay bạn bỏng nặng. Người ấy cứ nắm áo bạn mà không nói được lời nào.', hau: 'Vết bỏng trên tay bạn không bao giờ lành hẳn.' },
              { kieu: 'dao_thoat', vt: 'khac', doi: 'ban', cuu: 'than_nhan', label: 'Đưa cả nhà chạy lên núi, bỏ làng lại', mat: 'Những người còn ở lại, và tiếng gọi sau lưng.',
                sau: 'Bạn dẫn mọi người ra cổng khi lửa chưa kịp cắt đường. Từ trên sườn núi nhìn xuống, làng cháy như một ngọn đuốc lớn. {ban} đứng cạnh bạn, và không nhìn bạn.', hau: '{ban} không nhắc, nhưng nhớ rất rõ ai đã chạy.' },
              { kieu: 'chong', vt: 'khac', doi: 'huynh', cuu: 'than_nhan', label: 'Cầm gậy giữ cổng kho, đánh lùi lũ đào ngũ', mat: 'Máu, và một vết thương không băng được.', hau: 'Dân làng nhớ người đã đứng ở cổng kho đêm ấy.' }
            ] }
        } },
      { id: 'sang_sau', n: 'Sáng sau', cau_hoi: 'Làng còn là làng không?',
        chang: {
          moc: { t: 'Tro nguội',
            d: 'Sáng sau, khói còn bay thẳng lên trời. {ban} ngồi trên nền nhà đen, ôm một cái nồi méo, không khóc. Trên mặt đất, dấu chân ngựa chồng lên dấu chân người.',
            lc: [
              { key: 'dung_day', label: 'Kéo {ban} đứng dậy, bắt tay dọn', kind: 'help', mat: 'Một ngày không nghỉ.' },
              { key: 'o_im', label: 'Ngồi xuống cạnh, không nói gì', kind: 'safe', mat: 'Thời gian dựng lại.' }
            ] },
          leo: { t: 'Quan tới',
            d: 'Hai ngày sau, một viên quan nhỏ tới kiểm kê thiệt hại. Hắn nói triều sẽ cấp lương cứu tế, nhưng phải có người đứng tên nhận thay cả làng.',
            lc: [
              { key: 'dung_ten', label: 'Đứng tên nhận thay cả làng', kind: 'pay', mat: 'Trách nhiệm với từng nhà, và một khoản nợ với triều.', fx_them: { rep: { danh: 1 } } },
              { key: 'tu_choi', label: 'Từ chối, bảo người khác làm', kind: 'safe', mat: 'Lương cứu tế cho vài nhà.' }
            ] },
          cao_trao: { t: 'Dời hay ở', lon: true, canh: { gio: 'hoang_hon', thoi_tiet: 'suong_doc' },
            d: 'Dân làng chia hai phe: một phe muốn dời lên núi, một phe muốn ở lại dựng nền cũ. Họ nhìn bạn, người từng đi xa và thấy nhiều, và chờ bạn nói một lời. {ban} đứng ở phía sau, mắt không rời bạn.',
            kieu: [
              { kieu: 'tin', vt: 'nguoc', doi: 'ban', cuu: 'ban', label: 'Theo ý {ban}: ở lại dựng làng trên nền cũ', mat: 'Sự an toàn của việc lên núi.', ket: 'hoa_nghi',
                sau: 'Bạn nói theo ý {ban}, và tiếng nói của bạn kéo cả phe còn lưỡng lự. Mùa sau, mái nhà đầu tiên được dựng lên bằng gỗ nhà cháy.', hau: '{ban} nhìn bạn khác đi sau ngày ấy.' },
              { kieu: 'im_lang', vt: 'khac', doi: 'ban', cuu: 'ban', label: 'Im lặng để dân làng tự quyết', mat: 'Người đang chờ một lời của bạn.', ket: 'that_thu',
                sau: 'Không ai quyết. Hai phe tách ra: một phe lên núi, một phe ở lại, và mùa đông ập tới làm cả hai thưa dần.', hau: 'Làng cũ chỉ còn cái tên.' },
              { kieu: 'duong_tat', vt: 'dkd', doi: 'ban', cuu: 'ban', label: 'Thương lượng với quân triều: nhận lương, ký cam kết dời cả làng', mat: 'Món nợ không ghi sổ, và sự tin cậy của dân làng.', ket: 'that_thu',
                sau: 'Bạn ký, và lương đến. Cả làng dời đi trong im lặng, và nhiều người nhìn bạn như nhìn người đã bán nền nhà của họ.', hau: 'Dân làng nhận lương và không bao giờ nhắc tên bạn.' }
            ] }
        } }
    ],
    ket: {
      hoa_nghi: { t: 'Làng dựng lại', kv: 1, log: 'Mùa gặt sau, khói bếp lại bay lên từ những mái nhà mới dựng. Dân làng nói tên bạn khi kể chuyện đêm lửa.' },
      that_thu: { t: 'Làng tan', kv: 0, xau: true, log: 'Làng cũ chỉ còn nền đất và vài cây cau. Người trong làng tản đi khắp nơi, nhắc về bạn bằng giọng khó đoán.' }
    }
  });
})();
