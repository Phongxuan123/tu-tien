// Tuyến thân phận T5 "Một chuyến buôn" (Q 11.0, gói N1). Thuần dữ liệu; khung ở js/data/story.js.
// Mở (N1b): từ 14 tuổi và (nghề thương nhân cấp 1, hoặc hội viên thương hội, hoặc xuất thân nhà thương nhân p3). Vai 'ban', 'doi' lấy người có nhiều ký ức chung nhất (ky_uc), không có thì người đồng kỳ.
(function () {
  const D = window.TT.data;

  D.STORY.reg({
    id: 'tp_thuong_nhan', n: 'Một chuyến buôn', loai: 'tp',
    mo: { age: 14, hoac: [{ nghe: { id: 'thuong_nhan', lv: 1 } }, { hoi: true }, { xt: ['p3'] }] },
    vai: { doi: { pick: 'ky_uc', dung_moi: true }, moi: { pick: 'gan', dung_moi: true }, ban: { pick: 'ky_uc', dung_moi: true } },
    dau: 'c1',
    chang: {
      c1: {
        t: 'Chuyến buôn đầu',
        d: 'Chuyến đầu tiên của bạn là một xe thuê chở thuốc và vải lên phía bắc. {ban} đi cùng, mang theo cây đao cùn. Đến đèo Đá Đen, ba kẻ cướp chặn đường. Cả đoàn nhìn bạn, chờ một quyết định.',
        khi: { sau: 1 }, han: 12, mac: 'dua_tien',
        lc: [
          { key: 'dua_tien', label: 'Đưa hết tiền mua đường, giữ mạng', kind: 'pay', ax: { tudung: -1, daoduc: 1 },
            gia: { gold: 25 }, fx: { daoTam: 1, rel: { vai: 'ban', d: 6 } }, toi: 'c2' },
          { key: 'thuong_luong', label: 'Thương lượng, chia nửa số hàng', kind: 'safe', ax: { xuthe: 2 },
            gate: { truc: 'xuthe', min: 0, why: 'Bạn không đủ khéo để nói chuyện với bọn cướp, đành đưa tiền cho xong.' },
            fx: { gold: -15, rep: { danh: 1 } }, toi: 'c2' },
          { key: 'ra_tay', label: 'Rút đao, đứng cạnh {ban} mà đánh', kind: 'fight', ax: { xuthe: -2, tinh: -1 },
            gate: { truc: 'tudung', min: 2, why: 'Bạn chưa đủ tự tin cầm đao, mắt cứ nhìn về phía xe.' },
            fx: { xp: 0.1, hp: -10, rel: { vai: 'ban', d: 12 }, gold: 20 },
            tre: [{ sau: [12, 30], fx: { rep: { danh: 1 } }, log: 'Tin đoàn buôn đánh lui ba tên cướp lan đi khắp các chợ phía bắc. Chủ hàng từ đó nhớ mặt bạn.' }],
            toi: 'c2' }
        ]
      },
      c2: {
        t: 'Đối thủ hạ giá',
        d: 'Ở chợ phía nam, {doi} bán vải rẻ hơn giá vốn của bạn gần ba phần. Khách bỏ bạn mà đi, kho đã đầy. Hắn nhắn lại một câu: "Ai chịu lỗ lâu hơn thì thắng."',
        khi: { realm: 1, sau: 3 }, han: 15, mac: 'chiu_lo',
        lc: [
          { key: 'chiu_lo', label: 'Chịu lỗ, đợi hắn hết vốn', kind: 'risk', ax: { tudung: 2, tinh: -1 },
            fx: { gold: -30, daoTam: -1, rel: { vai: 'doi', d: -10 } },
            tre: [{ sau: [18, 40], fx: { gold: 40 }, log: '{doi} thua trận giá, rút khỏi chợ phía nam. Bạn gom được hàng rẻ, nhưng số vàng đã mất thì không lấy lại được.' }],
            toi: 'c3' },
          { key: 'gap_doi', label: 'Gặp riêng {doi}, bàn chia chợ', kind: 'safe', ax: { xuthe: 2 },
            gate: { truc: 'xuthe', min: 2, why: 'Bạn không quen bàn chuyện với kẻ đối đầu, mở miệng là thành cãi.' },
            fx: { rel: { vai: 'doi', d: 14 }, rep: { danh: 1 } },
            tre: [{ sau: [30, 60], fx: { gold: 20 }, log: 'Hai bên ký một giao kèo miệng: không phá giá nhau nữa. Mùa gặt năm sau, {doi} gửi bạn một túi hạt giống kèm lời chào.' }],
            toi: 'c3' },
          { key: 'ha_gia', label: 'Hạ giá theo, bán cho hết hàng', kind: 'risk', ax: { daoduc: -1, xuthe: 1 },
            gate: { truc: 'daoduc', max: 4, why: 'Bạn ngại kéo giá cả chợ xuống chỉ để giành khách, lòng không chịu nổi.' },
            fx: { gold: 15, nghiep: 1, rel: { vai: 'doi', d: -20 } }, toi: 'c3' }
        ]
      },
      c3: {
        t: 'Cơ hội độc quyền',
        d: 'Một trận lũ chặn đường bắc, giá muối và thuốc trong vùng vọt lên gấp ba. {moi}, người mối của hội, tìm bạn: nếu nhập hết hàng còn lại và không bán cho ai khác trong nửa năm, lợi nhuận sẽ lớn. Nhưng dân quanh vùng sẽ đói.',
        khi: { realm: 1, sau: 4 }, han: 12, mac: 'nhap_vua',
        lc: [
          { key: 'nhap_vua', label: 'Nhập vừa đủ, bán cho dân giá công bằng', kind: 'safe', ax: { daoduc: 2 },
            fx: { gold: 10, rep: { danh: 1 }, daoTam: 2 }, toi: 'c4' },
          { key: 'doc_quyen', label: 'Độc quyền, nâng giá gấp đôi', kind: 'risk', ax: { daoduc: -2, xuthe: 2 },
            gate: { truc: 'daoduc', max: 3, why: 'Nhìn dân đói mà bạn không bóp nổi giá của họ.' },
            fx: { gold: 80, nghiep: 3, rel: { vai: 'moi', d: 8 } },
            tre: [{ sau: [18, 42], fx: { rep: { danh: -2 } }, log: 'Người vùng ấy không quên tên hiệu buôn của bạn. Một đêm, cửa tiệm bị ném đá.' }],
            toi: 'c4' },
          { key: 'tu_choi', label: 'Từ chối, bỏ mối của hội', kind: 'flee', ax: { tinh: 1, daoduc: 1 },
            fx: { daoTam: 2, rel: { vai: 'moi', d: -8 } }, toi: 'c4' }
        ]
      },
      c4: {
        t: 'Hợp đồng sinh tử',
        d: 'Hội và triều đang bàn một hợp đồng thuế muối và phí qua ải. Cần một thương nhân đứng ra ký bảo đảm. {moi} đặt tờ giấy trước mặt bạn, nhấn mạnh rằng chỉ một cái tên được ghi vào sổ. Lợi lớn nếu thành, nhưng nếu lỡ, người ký sẽ gánh hết.',
        khi: { sau: 6, hoac: [{ realm: 1, stage: 1 }, { age: 30 }] }, han: 18, mac: 'tu_choi',
        lc: [
          { key: 'ky', label: 'Ký tên bảo đảm', kind: 'risk', ax: { xuthe: 2, tudung: 1 },
            fx: { rep: { danh: 3 }, rel: { vai: 'moi', d: 10 }, flag: 'nt_ky' },
            tre: [
              { sau: [36, 96], fx: { gold: -60 }, log: 'Hợp đồng vỡ giữa chừng vì một trận lũ không ai đoán trước. Bạn trả phần của mình, rồi trả thay một phần của hội.' },
              { sau: [60, 120], fx: { rep: { chinh: 1 } }, log: 'Sổ triều ghi tên bạn là người giữ lời khi cả hai bên đều tìm cách trốn.' }
            ],
            toi: 'c5' },
          { key: 'ban_tay', label: 'Đứng giữa hòa giải, lấy tiếng', kind: 'help', ax: { daoduc: 1, xuthe: 1 },
            gate: { truc: 'xuthe', min: 1, why: 'Bạn chưa đủ khéo để đứng giữa hai bên vừa nói vừa cười.' },
            fx: { rep: { danh: 2 }, rel: { vai: 'doi', d: 8 } }, toi: 'c5' },
          { key: 'tu_choi', label: 'Từ chối, để hội tự lo', kind: 'flee', ax: { daoduc: 1, tinh: 1 },
            fx: { daoTam: 2 },
            tre: [{ sau: [24, 48], fx: { rel: { vai: 'moi', d: -12 } }, log: 'Hội không trả thù. Họ chỉ không mời bạn nữa.' }],
            toi: 'c5' }
        ]
      },
      c5: {
        t: 'Đế chế nhỏ, hay bị nuốt',
        d: 'Mười năm buôn bán, bạn có một cửa tiệm, vài chuyến xe, và một chuỗi nợ dài. Sáng nay, hội đề nghị mua lại toàn bộ. {doi} thì mời bạn hợp tác mở thêm chi nhánh. {ban} hỏi bạn có còn nhớ chuyến xe đầu tiên trên đèo Đá Đen không.',
        khi: { sau: 6, hoac: [{ realm: 1, stage: 1 }, { age: 40 }] }, han: 12, mac: 'ban_het',
        lc: [
          { key: 'hop_tac', label: 'Hợp tác với {doi} mở rộng đế chế nhỏ', kind: 'risk', ax: { xuthe: 2, daoduc: -1 },
            wheel: {
              vung: [
                { w: 30, n: 'Phá sản giữa chừng', fx: { gold: -50, nghiep: 2 }, toi: 'ket:pha_san' },
                { w: 35, n: 'Bị hội nuốt chửng trong êm ả', fx: { rep: { chinh: -1 }, gold: 20 }, toi: 'ket:bi_nuot' },
                { w: 35, n: 'Thành một đế chế nhỏ có tên', fx: { rep: { danh: 3 }, gold: 60 }, toi: 'ket:de_che' }
              ],
              yeu_to: { loai: 'nature', truc: 'xuthe', huong: 1, tran: 15 }, gia: 2
            } },
          { key: 'ban_het', label: 'Bán hết cho hội, rút lui', kind: 'flee', ax: { tinh: 1, tudung: -1 },
            fx: { gold: 50 }, toi: 'ket:rut' },
          { key: 'giu_tiem', label: 'Giữ cửa tiệm, bán lẻ qua ngày', kind: 'safe', ax: { tudung: 1 },
            fx: { daoTam: 1, gold: 5 }, toi: 'ket:nho' }
        ]
      }
    },
    ket: {
      de_che: { t: 'Một đế chế nhỏ có tên', kv: 1, log: 'Người ta nhắc tới tên tiệm bạn trong các chợ phía bắc. Bạn không phải thương gia lớn nhất, nhưng là người ít ai dám coi thường.' },
      pha_san: { t: 'Phá sản giữa chừng', kv: 0, log: 'Kho đóng, xe bán, chỉ còn một cuốn sổ nợ. Bạn bắt đầu lại từ một gánh hàng rong, và học được rằng lãi lỗ đều có giá của nó.' },
      bi_nuot: { t: 'Bị hội nuốt', kv: 0, log: 'Hội mua lại tiệm bằng một hợp đồng đẹp đẽ. Bạn còn giữ một khoản tiền, nhưng không còn giữ được tên mình trên cửa hàng.' },
      rut: { t: 'Rút lui an toàn', kv: 0, log: 'Bạn bán hết, trả nợ, và mang ít tiền về quê. Có người chê bạn không dám liều, nhưng bạn biết mình đã chọn gì.' },
      nho: { t: 'Sống qua ngày', kv: 0, log: 'Cửa tiệm nhỏ dần, nhưng bạn vẫn mở cửa mỗi sáng. Không ai nhớ chuyện làm ăn lớn của bạn, còn khách quen thì vẫn gọi bạn là chủ.' }
    }
  });
})();
