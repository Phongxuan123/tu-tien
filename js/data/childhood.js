// Tuổi thơ ba hồi (Z "Đặc tả tuổi thơ", 8A2). Mỗi sự kiện: id, hoi (1: 0 đến 3 tuổi, 2: 4 đến 7, 3: 8 đến 11),
//   w (trọng số 1 đến 3), t (tiêu đề), d (2 đến 3 câu; khe {ban} là tên bạn thuở nhỏ, chỉ khi needBan: true), ch (2 hoặc 3 lựa chọn).
// Mỗi lựa chọn: key, label, kind (risk liều, safe an toàn, fight đánh, flee chạy, help giúp, pay tốn tiền),
//   ax (dịch trục tinh, xuthe, daoduc, tudung; ±1 đến ±3, 1 hoặc 2 trục), fx (1 đến 2 hiệu ứng: atk, nl, hp, gold, luck,
//   daoTam, tuchat, kv, wake, bad = id tật ở traits.js, ban = thiện cảm với bạn thuở nhỏ), r (kết quả một câu).
// tuchat và kv chỉ xuất hiện ở tối đa 3 lựa chọn mỗi loại trong cả bộ. Trần cộng dồn nằm ở cap, kẹp khi áp (js/systems/childhood.js).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.CHILDHOOD = {
    on: true,
    p2: 0.5,                    // xác suất có sự kiện 2 trong hồi
    p3: 0.5,                    // xác suất có sự kiện 3 (khi đã có sự kiện 2)
    cap: { atk: 6, nl: 6, hp: 30, luck: 3, daoTam: 10, tuchat: 1, kv: 1, bad: 1 },
    ev: [
      // ---------------- Hồi 1: 0 đến 3 tuổi ----------------
      {
        id: 'th_tieng_khoc', hoi: 1, w: 3, t: 'Tiếng khóc đầu đời',
        d: 'Đêm bạn chào đời, trời mưa rả rích. Bà mụ bảo trẻ khóc to thì sống dai, nhưng bạn lặng im một lúc lâu khiến cả nhà thót tim.',
        ch: [
          { key: 'vo', label: 'Vỗ lưng cho khóc', kind: 'risk', ax: { tinh: -1 }, fx: { hp: 5 }, r: 'Bạn bật khóc oang oang, bà mụ thở phào và bảo thân thể bạn khỏe hơn người thường.' },
          { key: 'cho', label: 'Để yên chờ', kind: 'safe', ax: { tudung: 1 }, fx: { nl: 1 }, r: 'Một lát sau bạn tự thở, rồi khóc nhè nhẹ trong vòng tay mẹ.' }
        ]
      },
      {
        id: 'th_sot_dem', hoi: 1, w: 3, t: 'Cơn sốt ba đêm',
        d: 'Năm bạn hai tuổi, bạn sốt cao suốt ba đêm liền. Thầy lang bốc thuốc đắng, mẹ thức canh không chợp mắt.',
        ch: [
          { key: 'uong', label: 'Uống thuốc đắng cho hết', kind: 'safe', ax: { tudung: 1 }, fx: { hp: 6, bad: 'the_nhuoc' }, r: 'Bạn khỏi sốt, nhưng người nhẹ bẫng và hay mệt vặt từ đó.' },
          { key: 'cau', label: 'Mẹ cầu khấn ngoài miếu', kind: 'pay', ax: { daoduc: 1 }, fx: { gold: -5, hp: 2 }, r: 'Thầy lang bảo bạn khỏi nhờ thuốc. Dù vậy mẹ thấy lòng nhẹ hẳn.' }
        ]
      },
      {
        id: 'th_dieu_la', hoi: 1, w: 2, t: 'Con chim bên bậu cửa',
        d: 'Sáng hôm sau ngày sinh, người ta thấy một con chim sẻ xám đậu trên bậu cửa, nhìn chằm chằm vào nôi bạn. Hàng xóm xì xào là điềm lành, còn bà lão đầu làng chỉ lắc đầu.',
        ch: [
          { key: 'cuoi', label: 'Cười với con chim', kind: 'risk', ax: { tinh: 1 }, fx: { wake: 1, luck: 1 }, r: 'Con chim vỗ cánh bay đi. Trong lòng bạn có điều gì khẽ rung lên, nhưng bạn chưa hiểu là gì.' },
          { key: 'ngo', label: 'Ngó lơ, để mẹ lo', kind: 'safe', ax: { xuthe: 1 }, fx: { nl: 1 }, r: 'Mọi người bàn tán mấy ngày rồi quên, còn bạn thì ngủ ngon.' }
        ]
      },
      {
        id: 'th_me_hat', hoi: 1, w: 2, t: 'Tiếng hát ru',
        d: 'Tối nào mẹ cũng hát ru bằng giọng khàn khàn, có câu nhắc đến quê cũ đã mất. Hôm nay mẹ hát lạc giọng rồi lặng đi giữa chừng.',
        ch: [
          { key: 'om', label: 'Nằm nghe, nín khóc', kind: 'safe', ax: { tinh: 1 }, fx: { nl: 2 }, r: 'Bạn ngủ ngoan, và tiếng hát ấy là thứ bạn nhớ nhất thời thơ ấu.' },
          { key: 'doi', label: 'Khóc đòi hát tiếp', kind: 'risk', ax: { tinh: -2 }, fx: { daoTam: 2, nl: -1 }, r: 'Mẹ hát lại, giọng run run. Bạn thương mẹ nhưng cũng thấy mình làm mẹ buồn.' }
        ]
      },
      {
        id: 'th_dau_mua', hoi: 1, w: 2, t: 'Năm mất mùa',
        d: 'Năm đói kém, nhà chỉ còn nửa bát cháo. Mẹ đẩy phần của mình sang bạn, còn đứa trẻ hàng xóm thì khóc đòi ăn ngoài ngõ.',
        ch: [
          { key: 'nhuong', label: 'Nhường lại nửa bát', kind: 'help', ax: { daoduc: 2 }, fx: { daoTam: 3, hp: -2 }, r: 'Bạn đói mà lòng dịu lại. Mẹ vuốt đầu bạn và không nói gì.' },
          { key: 'an', label: 'Húp hết phần mình', kind: 'safe', ax: { daoduc: -1 }, fx: { hp: 4 }, r: 'Bạn no bụng, nhưng ánh mắt đứa bé ngoài ngõ cứ theo bạn mãi.' }
        ]
      },
      {
        id: 'th_nga_gieng', hoi: 1, w: 2, t: 'Ngã bên miệng giếng',
        d: 'Bạn trượt chân ngã khỏi bậu giếng, xước cả trán. Bà vú bế về, đắp lá rồi thở dài nhìn vết thương.',
        ch: [
          { key: 'chiu', label: 'Cắn răng chịu đau', kind: 'risk', ax: { tudung: 2 }, fx: { hp: 2, atk: 1 }, r: 'Vết sẹo nhỏ trên trán làm bạn thành đứa gan lì, ai cũng để ý.' },
          { key: 'khoc', label: 'Khóc ầm lên', kind: 'safe', ax: { tinh: -2 }, fx: { nl: -2 }, r: 'Bạn khóc đến mệt rồi ngủ thiếp đi, mấy hôm sau đầu óc còn lơ mơ.' }
        ]
      },
      {
        id: 'th_chay_nen', hoi: 1, w: 1, t: 'Đêm đổ ngọn đèn',
        d: 'Một đêm cuối đông, ngọn đèn dầu đổ bên nôi. Lửa liếm vào chiếu cói, may hàng xóm kịp kéo tới dập.',
        ch: [
          { key: 'cuu', label: 'Lao vào dập lửa', kind: 'risk', ax: { daoduc: 2, tinh: -1 }, fx: { hp: -4, daoTam: 3 }, r: 'Tay bạn bỏng rát, nhưng người lớn trong làng gọi bạn là đứa trẻ có lòng.' },
          { key: 'lui', label: 'Nép vào góc tường', kind: 'flee', ax: { tudung: 2 }, fx: { nl: 2 }, r: 'Bạn chỉ biết ôm chặt chăn. Lửa tắt, và bạn học được chữ sợ.' }
        ]
      },
      {
        id: 'th_thay_boi', hoi: 1, w: 2, t: 'Thầy bói xem số',
        d: 'Thầy bói đi ngang nhà xem mệnh cho bạn, bảo đứa trẻ này có số gánh nặng. Mẹ mời chén nước, rồi lén bỏ thêm đồng tiền vào tay thầy.',
        ch: [
          { key: 'ghi', label: 'Ghi nhớ lời thầy', kind: 'safe', ax: { tudung: 2 }, fx: { daoTam: 3 }, r: 'Từ nhỏ bạn đã biết dè dặt, lòng cũng cứng cỏi hơn đôi chút.' },
          { key: 'cuoi', label: 'Cười ha hả khi thầy đi', kind: 'risk', ax: { tinh: 2 }, fx: { luck: -1, atk: 1 }, r: 'Thầy bói quay lại nhìn bạn lâu thật lâu. Mấy năm sau bạn mới thấy lạnh sống lưng.' }
        ]
      },
      {
        id: 'th_vu_di', hoi: 1, w: 2, t: 'Vú nuôi xin về quê',
        d: 'Bà vú nuôi bạn từ khi mới sinh xin về quê lấy chồng. Bạn bám chặt vạt áo bà không chịu buông.',
        ch: [
          { key: 'niu', label: 'Níu lại không cho đi', kind: 'risk', ax: { tinh: -2 }, fx: { nl: 1, daoTam: -2 }, r: 'Bà ở lại thêm vài ngày, nhưng bạn đã học được rằng níu kéo không giữ được ai.' },
          { key: 'vay', label: 'Buông tay vẫy chào', kind: 'safe', ax: { daoduc: 2, tinh: 1 }, fx: { daoTam: 2 }, r: 'Bà khóc, bạn cũng khóc, nhưng bà đi nhẹ lòng hơn.' }
        ]
      },

      // ---------------- Hồi 2: 4 đến 7 tuổi ----------------
      {
        id: 'th_ban_trom', hoi: 2, w: 3, needBan: true, t: 'Bạn bị bắt quả tang',
        d: 'Ở đầu xóm có {ban}, cùng tuổi bạn, hay rủ đi bắt cá ở suối. Hôm nay {ban} bị bắt quả tang hái trộm trái cây của nhà giàu.',
        ch: [
          { key: 'nhan', label: 'Nhận là mình rủ', kind: 'help', ax: { daoduc: 2 }, fx: { ban: 2, gold: -3 }, r: 'Bạn bị phạt ba bữa không được ăn quà, nhưng hai đứa vẫn là bạn.' },
          { key: 'im', label: 'Đứng yên không nói', kind: 'safe', ax: { xuthe: 2 }, fx: { ban: -1 }, r: 'Bạn thoát chuyện, nhưng từ đó hai đứa nói chuyện ít hẳn đi.' }
        ]
      },
      {
        id: 'th_hoc_chu', hoi: 2, w: 3, t: 'Thầy đồ dạy chữ',
        d: 'Thầy đồ gõ thước lên bảng, bắt cả lớp đọc theo. Bạn viết được chữ đầu tiên nhưng nét xiêu vẹo, bị cả lớp cười ồ.',
        ch: [
          { key: 'luyen', label: 'Ngồi luyện viết đến khuya', kind: 'safe', ax: { tudung: 2 }, fx: { nl: 3 }, r: 'Nét chữ dần đều đặn, và trí nhớ của bạn cũng sắc hơn.' },
          { key: 'choi', label: 'Bỏ đi chơi với bọn trẻ', kind: 'flee', ax: { tudung: -2 }, fx: { luck: 1, bad: 'hay_quen' }, r: 'Bạn vui cả buổi, nhưng chữ vẫn xiêu và bài học thì quên sạch.' }
        ]
      },
      {
        id: 'th_thay_tu', hoi: 2, w: 3, t: 'Lần đầu thấy tu sĩ',
        d: 'Một vị tu sĩ áo nâu đi qua đầu làng, dừng bên giếng xin nước uống. Ông nhìn bạn một lúc rồi mỉm cười, không nói lời nào.',
        ch: [
          { key: 'chao', label: 'Cúi đầu chào thật lễ', kind: 'safe', ax: { daoduc: 2 }, fx: { daoTam: 3 }, r: 'Ông gật đầu đáp lễ. Bạn không hiểu vì sao, nhưng thấy lòng nhẹ đi.' },
          { key: 'hoi', label: 'Hỏi tu là làm gì', kind: 'risk', ax: { xuthe: -2, tinh: -1 }, fx: { nl: 3 }, r: 'Ông đáp bằng một câu đố. Bạn nghĩ mãi, đầu óc như mở thêm một ngăn mới.' }
        ]
      },
      {
        id: 'th_tran_bong', hoi: 2, w: 2, t: 'Trận đá cầu',
        d: 'Trong trận đá cầu cuối năm, bạn bị một đứa lớn hơn xô ngã. Cả bọn đứng nhìn, có đứa cười khúc khích.',
        ch: [
          { key: 'dung', label: 'Đứng dậy đánh lại', kind: 'fight', ax: { tinh: -2, tudung: -1 }, fx: { atk: 2, hp: -3 }, r: 'Bạn thua nhưng không khóc. Đứa lớn hơn từ đó nể bạn ba phần.' },
          { key: 'bo', label: 'Phủi quần bỏ về', kind: 'flee', ax: { tinh: 2 }, fx: { daoTam: 2 }, r: 'Bạn đi thẳng về nhà, chẳng ai nói được gì bạn.' }
        ]
      },
      {
        id: 'th_suoi_ca', hoi: 2, w: 2, needBan: true, t: 'Bắt cá ở suối',
        d: '{ban} rủ bạn xuống suối bắt cá, bảo đá tuy trơn nhưng ai cũng đi qua được. {ban} trượt chân, cả người lao xuống nước xiết.',
        ch: [
          { key: 'keo', label: 'Lao xuống kéo lên', kind: 'help', ax: { daoduc: 3 }, fx: { ban: 2, hp: -2 }, r: 'Hai đứa ướt như chuột lột, nhưng từ đó thân nhau hơn.' },
          { key: 'ho', label: 'Đứng trên bờ hô hoán', kind: 'safe', ax: { xuthe: 1, daoduc: -1 }, fx: { ban: -1 }, r: 'Người lớn chạy ra kịp lúc. Bạn về nhà mà lòng vẫn nặng.' }
        ]
      },
      {
        id: 'th_tran_trau', hoi: 2, w: 2, t: 'Con trâu đi lạc',
        d: 'Bạn được giao dắt trâu ra đồng. Đến chiều, con trâu già không chịu về, cứ thế đi thẳng vào rừng tre.',
        ch: [
          { key: 'tim', label: 'Vào rừng tìm', kind: 'risk', ax: { tinh: -1, tudung: 1 }, fx: { atk: 2, hp: -2 }, r: 'Bạn tìm được trâu sau nửa buổi, và thuộc đường trong rừng tre từ đó.' },
          { key: 've', label: 'Về báo cha mẹ', kind: 'safe', ax: { tudung: -1 }, fx: { nl: 1 }, r: 'Cha đi tìm đến tối mới về, con trâu nằm ngủ bên bờ. Bạn bị mắng, nhưng cả nhà thở phào.' }
        ]
      },
      {
        id: 'th_keo_chua', hoi: 2, w: 2, t: 'Gian hàng kẹo',
        d: 'Trong ngày hội làng, gian hàng kẹo mạch nha bày ngay cạnh cổng chùa. Bạn đói, đứng nhìn thèm rỏ dãi.',
        ch: [
          { key: 'mua', label: 'Mua một viên kẹo', kind: 'pay', ax: { tudung: -2 }, fx: { gold: -4, hp: 2 }, r: 'Kẹo ngọt tan trong miệng. Đồng tiền cuối cùng của bạn cũng hết theo.' },
          { key: 'quay', label: 'Quay đi về nhà', kind: 'safe', ax: { tudung: 2 }, fx: { daoTam: 2 }, r: 'Bạn về với bụng đói, nhưng thấy mình có chút cứng cỏi.' }
        ]
      },
      {
        id: 'th_co_tuong', hoi: 2, w: 2, t: 'Ván cờ dưới gốc đa',
        d: 'Ông lão đánh cờ dưới gốc đa thấy bạn đứng xem lâu, bèn gọi lại. Ông bảo bạn đánh thử một ván.',
        ch: [
          { key: 'danh', label: 'Đánh hết sức', kind: 'risk', ax: { xuthe: 2, tinh: -1 }, fx: { nl: 2, tuchat: 1 }, r: 'Bạn thua mà vẫn thấy nước cờ hiện ra trước mắt. Ông gật đầu, bảo bạn có căn.' },
          { key: 'nhuong', label: 'Nhường ông hai quân', kind: 'help', ax: { daoduc: 1, xuthe: 1 }, fx: { daoTam: 2 }, r: 'Ông biết bạn nhường, cười mà không nói. Bạn cũng học được cách nhìn người.' }
        ]
      },
      {
        id: 'th_phao_no', hoi: 2, w: 1, t: 'Quả pháo kẹt',
        d: 'Cuối năm, bọn trẻ đốt pháo bên bờ ruộng. Một quả pháo bị kẹt, bạn cầm lên xem thì nó nổ ngay trước mặt.',
        ch: [
          { key: 'chay', label: 'Ném đi và chạy', kind: 'flee', ax: { tinh: -1 }, fx: { hp: -2, nl: 1 }, r: 'Bạn chạy nhanh, chỉ xước xát chút ít. Nhưng mẹ cấm đốt pháo cả năm.' },
          { key: 'dung', label: 'Đứng sững, bình tĩnh', kind: 'risk', ax: { tudung: 2, tinh: 1 }, fx: { daoTam: 3 }, r: 'May là pháo tắt giữa chừng. Bạn bình tĩnh đến lạ, khiến cả bọn nể.' }
        ]
      },

      // ---------------- Hồi 3: 8 đến 11 tuổi ----------------
      {
        id: 'th_ganh_nuoc', hoi: 3, w: 3, t: 'Gánh nước mùa khô',
        d: 'Năm bạn tám tuổi, mẹ giao việc gánh nước suốt mùa khô. Đôi vai non nớt đau nhừ, mà đường ra giếng xa lắm.',
        ch: [
          { key: 'ganh', label: 'Gánh cho đủ thùng', kind: 'safe', ax: { tudung: 3 }, fx: { hp: 3, atk: 1 }, r: 'Vai bạn chai dần, sức khỏe tốt lên hẳn.' },
          { key: 'do', label: 'Đổ bớt đi bán lấy tiền', kind: 'risk', ax: { tudung: -2, daoduc: -1 }, fx: { gold: 4 }, r: 'Bạn lén bán nước cho hàng xóm lấy vài đồng. Mẹ biết, im lặng một lúc lâu.' }
        ]
      },
      {
        id: 'th_bo_ben_do', hoi: 3, w: 3, t: 'Đánh nhau ở bến đò',
        d: 'Ở bến đò, hai đứa lớn giành nhau một con cá. Một đứa quay sang đẩy bạn ngã nhào xuống bùn.',
        ch: [
          { key: 'danh', label: 'Xông vào đánh', kind: 'fight', ax: { tinh: -2, xuthe: -1 }, fx: { atk: 3, hp: -4 }, r: 'Bạn giành được con cá nhưng máu mũi chảy đầy áo.' },
          { key: 'can', label: 'Lùi lại gọi người lớn', kind: 'safe', ax: { xuthe: 2, daoduc: 1 }, fx: { nl: 2 }, r: 'Người lớn ra can. Bạn thoát, nhưng cả bọn chê bạn nhát.' },
          { key: 'nhuong', label: 'Nhường con cá', kind: 'help', ax: { daoduc: 2 }, fx: { daoTam: 3 }, r: 'Bạn đi về tay không, nhưng lòng nhẹ đi kỳ lạ.' }
        ]
      },
      {
        id: 'th_giu_loi', hoi: 3, w: 3, needBan: true, t: 'Lời hứa với bạn',
        d: '{ban} nhờ bạn giữ hộ hộp gỗ đựng tiền để dành mua sách. Chiều hôm đó, có đứa hứa cho bạn cái diều đẹp nếu đổi được cái hộp.',
        ch: [
          { key: 'giu', label: 'Giữ lời, không đổi', kind: 'safe', ax: { daoduc: 3, tudung: 1 }, fx: { ban: 2, daoTam: 2 }, r: 'Bạn mất một cái diều, nhưng được một người bạn tin cậy.' },
          { key: 'doi', label: 'Đổi lấy diều', kind: 'risk', ax: { daoduc: -3 }, fx: { gold: 3, ban: -2 }, r: 'Bạn có cái diều đẹp mấy ngày, còn bạn kia thì không còn tin bạn như trước.' }
        ]
      },
      {
        id: 'th_thu_tu_chat', hoi: 3, w: 2, t: 'Thử tư chất',
        d: 'Ở đầu làng có lão tu sĩ hay thử tư chất cho trẻ con. Bạn đứng trước chậu nước, ông bảo nhìn vào mặt nước rồi đọc tên mình.',
        ch: [
          { key: 'nhin', label: 'Nhìn chăm chú vào nước', kind: 'risk', ax: { tinh: 1, tudung: 1 }, fx: { nl: 4, wake: 1 }, r: 'Mặt nước gợn lên như có tiếng gọi. Lão tu sĩ lặng lẽ ghi gì đó vào sổ.' },
          { key: 'nham', label: 'Nhắm mắt không nhìn', kind: 'safe', ax: { tudung: -1 }, fx: { luck: 2 }, r: 'Ông không nói gì. Bạn thấy mình vừa tránh được một việc phiền toái lớn.' }
        ]
      },
      {
        id: 'th_tan_tu', hoi: 3, w: 3, t: 'Gặp tán tu bên sông',
        d: 'Bên sông có một tán tu áo rách, ngồi nhóm lửa nấu nồi cháo đạm bạc. Thấy bạn đứng nhìn lâu, ông mời một bát.',
        ch: [
          { key: 'an', label: 'Nhận bát cháo, hỏi chuyện', kind: 'safe', ax: { tinh: 2 }, fx: { daoTam: 3, nl: 1 }, r: 'Ông nói tu hành không phải là trốn đời. Bạn nhớ câu đó nhiều năm.' },
          { key: 'xin', label: 'Xin ông truyền pháp môn', kind: 'risk', ax: { xuthe: 2, tudung: 2 }, fx: { tuchat: 1, hp: -2 }, r: 'Ông nhìn bạn một lúc rồi dạy một hơi thở. Bạn ngồi tập đến tối, mệt lả.' }
        ]
      },
      {
        id: 'th_trong_kho', hoi: 3, w: 2, t: 'Trông kho gạo',
        d: 'Cha giao bạn trông kho gạo suốt đêm. Gần nửa đêm, có tiếng động khe khẽ ngoài cửa kho.',
        ch: [
          { key: 'mo', label: 'Mở cửa xem', kind: 'risk', ax: { tinh: -2 }, fx: { atk: 1, nl: -1 }, r: 'Chỉ là con chó hoang đói. Nhưng bạn đã biết thế nào là sợ thật sự.' },
          { key: 'giu', label: 'Đứng canh đến sáng', kind: 'safe', ax: { tudung: 3 }, fx: { nl: 2, luck: 1 }, r: 'Trời sáng, cha về thấy bạn đứng gác suốt đêm. Cha không khen, chỉ gật đầu.' }
        ]
      },
      {
        id: 'th_chia_tay', hoi: 3, w: 2, needBan: true, t: 'Bạn sắp đi xa',
        d: '{ban} sắp theo cha đi buôn xa. Đêm trước ngày đi, hai đứa ngồi bên bờ đê đếm sao.',
        ch: [
          { key: 'hua', label: 'Hứa sẽ gặp lại', kind: 'safe', ax: { tinh: 1, daoduc: 1 }, fx: { ban: 2 }, r: 'Hai đứa thề gặp lại. Lời thề ấy bạn còn giữ đến lúc trưởng thành.' },
          { key: 'lanh', label: 'Quay lưng bỏ về', kind: 'risk', ax: { tinh: -2, daoduc: -2 }, fx: { ban: -2, daoTam: -2 }, r: 'Bạn về nhà một mình, và thấy lòng mình lạnh đi một chút.' }
        ]
      },
      {
        id: 'th_co_bac', hoi: 3, w: 2, t: 'Xóc đĩa bên đường',
        d: 'Trên bãi đất trống, mấy gã thanh niên chơi xóc đĩa. Một đứa nhỏ hơn bạn bị gọi vào chơi, đưa cả đồng tiền mẹ cho mua muối.',
        ch: [
          { key: 'can', label: 'Chạy tới can lại', kind: 'risk', ax: { daoduc: 2, tinh: -1 }, fx: { hp: -2, bad: 'xui_xeo' }, r: 'Bọn gã quát đuổi, bạn bị đẩy ngã. Đồng tiền kia cũng mất theo.' },
          { key: 'bao', label: 'Chạy về báo mẹ', kind: 'safe', ax: { xuthe: 2 }, fx: { nl: 1, kv: 1 }, r: 'Mẹ nghe xong ngồi lặng hồi lâu, rồi bảo bạn đã làm đúng.' }
        ]
      },
      {
        id: 'th_thi_chay', hoi: 3, w: 1, t: 'Thi chạy ra đầu đê',
        d: 'Ngày hội, làng tổ chức cuộc thi chạy ra đầu đê. Bạn không phải người nhanh nhất, nhưng quyết tâm chạy đến cùng.',
        ch: [
          { key: 'hetsuc', label: 'Chạy hết sức', kind: 'risk', ax: { tudung: 2, tinh: -1 }, fx: { atk: 2, kv: 1 }, r: 'Bạn về thứ hai, mệt rũ rượi. Ai cũng thấy bạn bền bỉ.' },
          { key: 'cham', label: 'Chạy đều, giữ hơi', kind: 'safe', ax: { tudung: 1 }, fx: { luck: 1 }, r: 'Bạn về giữa đoàn, chẳng ai để ý và bạn cũng không bị ngã.' }
        ]
      }
    ]
  };
})();
