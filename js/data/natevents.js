// Sự kiện nghịch lý của bốn tông (tm_*): Thanh Vân, Kim Phong, Liệt Hỏa, Âm Hồn. Mỗi sự kiện có 3 lựa chọn, nhãn ghi rõ giá.
// Chưa gắn vào game: nạp vào D.NATEVENTS. Khi có cơ chế gọi, ghép vào D.EVENTS và đăng ký D.eventById như facevents.js.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};
  const rng = TT.rng;
  const X = k => function () { return TT.ev[k].apply(null, arguments); };
  const xp = X('xp'), hp = X('hp'), NR = X('NR'), lp = X('lp'), dao = X('dao'), gold = X('gold'), G = X('good'), B = X('bad');
  const P = p => rng.P(p);
  // Trần: mọi lượng tính theo cảnh giới đều bị kẹp trong "max".
  const lim = (n, max) => Math.min(n, max);
  const tien = (c, base, max) => lim(base * (1 + c.realm), max);
  // Giá: danh = danh vọng; nghiệp = rep chính–tà; đạo tâm = dao; quan hệ với tông = cống hiến; thời gian = tu vi lỡ đi.
  const danh = (c, n) => TT.rep.add(c, 'danh', n);
  const nghiep = (c, n) => TT.rep.add(c, 'chinh', n);
  const cong = (c, n) => { if (c.sect) { c.sect.contrib = Math.max(0, c.sect.contrib + n); if (n > 0) c.sect.total += n; } };
  const thoiGian = (c, k) => xp(c, -Math.max(0, Math.min(c.xp, NR(c) * k)));

  D.NATEVENTS = D.NATEVENTS || [];
  D.NATEVENTS.push(
    // ---------- Thanh Vân Tông (chính đạo, quy củ ôn hòa) ----------
    {
      id: 'tm_tv_1', tier: 3, manual: true, cool: 0, title: 'Kho sách bị niêm',
      when: c => !!c.sect && c.sect.id === 'tc_thanh_van',
      text: () => 'Thiên Cơ Các niêm phong kho sách cổ với lý do "bất lợi cho nhân tâm", và treo lệnh cấm đệ tử bước vào. Trong kho còn nhiều bản chép tay bạn từng mong đọc. Người giữ chìa khóa khẽ nói: "Muốn xem thì tự liệu, đừng để ta biết."',
      choices: [
        {
          key: 'tuan', label: 'Tuân lệnh, chờ kỳ mở niêm (mất thời gian, đạo tâm +1)', kind: 'safe', run: c => {
            thoiGian(c, 0.01); dao(c, 1);
            return G('Bạn đợi tới kỳ mở niêm. Tu vi chậm đi một chút, nhưng tâm tính trầm hơn. Đạo tâm +1.');
          }
        },
        {
          key: 'len', label: 'Lén chép một quyển trong đêm (rủi ro: thương -10, cống hiến -10)', kind: 'risk', run: c => {
            if (P(lp(c, 0.55))) {
              xp(c, lim(NR(c) * 0.02, 60)); dao(c, -1);
              return G('Bạn chép xong một quyển mà không ai hay biết. Tu vi tăng nhẹ, nhưng lương tâm bứt rứt. Đạo tâm -1.');
            }
            hp(c, -10); cong(c, -10);
            return B('Người coi kho bắt quả tang. Sinh lực -10, các trưởng lão ghi tên bạn vào sổ phạt, cống hiến -10.');
          }
        },
        {
          key: 'to', label: 'Tố công khai lên báo tông (quan hệ với tông -10; danh +3)', kind: 'help', run: c => {
            danh(c, 3); nghiep(c, 2); cong(c, -10);
            return G('Bạn đọc to tội của Thiên Cơ Các trước toàn môn. Danh +3, nghiệp chính +2. Nhưng đồng môn lạnh nhạt, cống hiến -10.');
          }
        }
      ]
    },
    {
      id: 'tm_tv_2', tier: 3, manual: true, cool: 0, title: 'Bảng vàng gian lận',
      when: c => !!c.sect && c.sect.id === 'tc_thanh_van',
      text: () => 'Kỳ khảo hạch nhập môn vừa xong, bảng vàng dán đầy tên người đỗ. Bạn biết rõ có kẻ đã mua đề từ tay một trưởng sự, và người mua là con cháu một nhà có tiếng trong môn. Người bán chỉ là một ghi chép nhỏ, sẽ là kẻ gánh tội nếu chuyện vỡ lở.',
      choices: [
        {
          key: 'to', label: 'Tố giác trước Chấp Pháp Đường (cống hiến -8, nghiệp +3)', kind: 'help', run: c => {
            nghiep(c, 3); danh(c, 1); cong(c, -8);
            return G('Chấp Pháp Đường xét lại cả kỳ thi. Nghiệp chính +3, danh +1. Nhưng nhà kia ghi hận, bạn bị đồng môn cô lập, cống hiến -8.');
          }
        },
        {
          key: 'im', label: 'Im lặng cho qua (đạo tâm -1)', kind: 'safe', run: c => {
            dao(c, -1);
            return 'Bạn quay đi, coi như không thấy. Lòng nặng thêm một chút. Đạo tâm -1.';
          }
        },
        {
          key: 'chia', label: 'Nhận phần chia từ người mua đề (nhận tiền, nghiệp -3)', kind: 'risk', run: c => {
            const t = tien(c, 20, 80);
            gold(c, t); nghiep(c, -3);
            return G('Bạn nhận ' + t + ' vàng đút lót. Nghiệp chính -3, và từ nay bạn biết mình đã mua chuộc lương tâm.');
          }
        }
      ]
    },
    {
      id: 'tm_tv_3', tier: 3, manual: true, cool: 0, title: 'Làng bị ém tin dịch',
      when: c => !!c.sect && c.sect.id === 'tc_thanh_van',
      text: () => 'Một thôn ngoài núi phát dịch, nhưng Chấp Pháp Đường đã có lệnh giữ kín để tránh hoảng loạn. Một đệ tử trẻ tìm đến bạn, mặt tái xanh: sáng nay đã có ba đứa trẻ trong làng chết. "Sư huynh, đừng để họ chết vì một cái lệnh không được nói," cậu ta van nài.',
      choices: [
        {
          key: 'bao', label: 'Báo cho làng biết (cống hiến -12, phạm lệnh)', kind: 'help', run: c => {
            nghiep(c, 3); danh(c, 2); cong(c, -12);
            return G('Bạn báo cho làng đề phòng, và vài người kịp đưa trẻ con lên núi tránh. Nghiệp chính +3, danh +2. Nhưng đã phạm lệnh, cống hiến -12.');
          }
        },
        {
          key: 'tuan', label: 'Tuân lệnh, im lặng (đạo tâm -2)', kind: 'safe', run: c => {
            dao(c, -2); cong(c, 5);
            return 'Bạn giữ lệnh và im lặng. Trưởng lão khen bạn biết giữ quy củ, cống hiến +5. Trong lòng nặng như đá, đạo tâm -2.';
          }
        },
        {
          key: 'mang', label: 'Tự mang thuốc vào thôn trong đêm (tiền 40, thương -15)', kind: 'pay',
          disabled: c => (TT.ls.wealth(c) < 40 ? 'Không đủ vàng' : false), run: c => {
            gold(c, -40); hp(c, -15); nghiep(c, 2);
            return G('Bạn mua thuốc, lặng lẽ vào thôn. Tốn 40 vàng và sinh lực -15 vì nhiễm khí độc, nhưng nghiệp chính +2.');
          }
        }
      ]
    },
    {
      id: 'tm_tv_4', tier: 3, manual: true, cool: 0, title: 'Phiếu đồng thuận',
      when: c => !!c.sect && c.sect.id === 'tc_thanh_van',
      text: () => 'Trưởng lão trao bạn một tờ phiếu đồng thuận cho chủ trương mới: đệ tử không ký sẽ bị đưa xuống ngoại môn. Chủ trương nghe thì có lý, nhưng điều khoản cuối cho phép môn phái ghi tên người khác vào danh sách trục xuất. Cả điện đều chờ bạn đặt bút trước.',
      choices: [
        {
          key: 'ky', label: 'Ký theo, không sửa một chữ (nghiệp -2, cống hiến +8)', kind: 'safe', run: c => {
            cong(c, 8); nghiep(c, -2);
            return 'Bạn ký tên. Cống hiến +8, trưởng lão gật đầu. Nghiệp chính -2 vì đã đồng lõa.';
          }
        },
        {
          key: 'tuchoi', label: 'Từ chối, chịu xuống ngoại môn (cống hiến -20)', kind: 'safe', run: c => {
            cong(c, -20); danh(c, 1);
            return B('Bạn gạch tên mình, bị đẩy xuống ngoại môn. Cống hiến -20, nhưng trong giang hồ có người nhắc tới bạn là kẻ ngay thẳng. Danh +1.');
          }
        },
        {
          key: 'ghi', label: 'Ký kèm ghi chú phản đối (rủi ro: cống hiến -6)', kind: 'risk', run: c => {
            if (P(lp(c, 0.5))) { danh(c, 1); dao(c, 1); return G('Ghi chú của bạn được đọc to trong điện. Danh +1, đạo tâm +1, dù không ai đổi quyết định.'); }
            cong(c, -6);
            return B('Trưởng lão gạt ghi chú của bạn đi trước mặt mọi người. Cống hiến -6.');
          }
        }
      ]
    },

    // ---------- Kim Phong Môn (chính đạo, kiếm tu khắt khe) ----------
    {
      id: 'tm_kp_1', tier: 3, manual: true, cool: 0, title: 'Quy trình hay lương tâm',
      when: c => !!c.sect && c.sect.id === 'ts_kim_phong',
      text: () => 'Kim Phong Môn ra lệnh thu hồi toàn bộ kiếm lỗi đã bán cho dân ba làng, đúng quy trình: đo, ghi, thu, trừ tiền. Quy trình không sai, nhưng cả ba làng vừa trải qua mất mùa, và kiếm là kế sinh nhai cuối cùng của họ. Trong sổ, người bị thu nhiều nhất đều là những hộ nghèo nhất.',
      choices: [
        {
          key: 'thi', label: 'Thi hành đúng quy trình (nhận tiền, nghiệp -2)', kind: 'safe', run: c => {
            const t = tien(c, 20, 60);
            gold(c, t); nghiep(c, -2); cong(c, 5);
            return G('Bạn làm đúng từng bước. Được thưởng ' + t + ' vàng phí thu hồi, cống hiến +5. Nghiệp chính -2.');
          }
        },
        {
          key: 'trai', label: 'Làm trái lệnh, lén trả kiếm cho dân (tiền 30; thất bại thì thương -10, cống hiến -12)', kind: 'risk',
          disabled: c => (TT.ls.wealth(c) < 30 ? 'Không đủ vàng' : false), run: c => {
            gold(c, -30); nghiep(c, 3);
            if (P(lp(c, 0.6))) { danh(c, 2); return G('Bạn lén trả kiếm cho các hộ nghèo, không ai biết ngoài họ. Danh +2, nghiệp chính +3, nhưng tốn 30 vàng.'); }
            hp(c, -10); cong(c, -12);
            return B('Có người tố. Bạn bị phạt roi, sinh lực -10, cống hiến -12, dù nghiệp chính đã +3.');
          }
        },
        {
          key: 'bao', label: 'Báo trên, để trưởng lão quyết (đạo tâm -1)', kind: 'safe', run: c => {
            cong(c, 2); dao(c, -1);
            return 'Bạn đem sổ lên trình bày rồi lui ra. Trưởng lão ghi nhận việc bạn báo trên, cống hiến +2. Đạo tâm -1 vì lòng chùn bước.';
          }
        }
      ]
    },
    {
      id: 'tm_kp_2', tier: 3, manual: true, cool: 0, title: 'Mẻ kiếm chuẩn',
      when: c => !!c.sect && c.sect.id === 'ts_kim_phong',
      text: () => 'Một mẻ kiếm đúc cho đợt giao hàng bị phát hiện có tạp chất, và kẻ gian lận là sư đệ mà bạn quý nhất. Nếu mẻ ấy bị loại, cả xưởng sẽ bị trừ lương một năm. Hắn nhìn bạn không nói gì, chỉ đẩy về phía bạn một túi bạc nhỏ.',
      choices: [
        {
          key: 'to', label: 'Tố lên chưởng môn (cống hiến -6, nghiệp +3)', kind: 'help', run: c => {
            nghiep(c, 3); danh(c, 2); cong(c, -6);
            return G('Bạn trình bằng chứng lên chưởng môn. Nghiệp chính +3, danh +2. Sư đệ bị phạt và oán bạn, cống hiến -6.');
          }
        },
        {
          key: 'che', label: 'Che giấu cho sư đệ (nghiệp -3, cống hiến +4)', kind: 'safe', run: c => {
            nghiep(c, -3); cong(c, 4);
            return 'Bạn nhận lời giữ kín. Sư đệ cảm kích, cống hiến +4, nhưng sổ sách của bạn đã có một vết đen. Nghiệp chính -3.';
          }
        },
        {
          key: 'sua', label: 'Sửa giúp mẻ kiếm, nhận túi bạc (mất thời gian, đạo tâm -2)', kind: 'risk', run: c => {
            const t = tien(c, 40, 120);
            thoiGian(c, 0.02); gold(c, t); dao(c, -2);
            return G('Bạn thức trắng hai đêm để rèn lại mẻ kiếm. Nhận ' + t + ' vàng bạc, tu vi lỡ mất một chút. Đạo tâm -2.');
          }
        }
      ]
    },
    {
      id: 'tm_kp_3', tier: 3, manual: true, cool: 0, title: 'Hồ sơ niêm kín',
      when: c => !!c.sect && c.sect.id === 'ts_kim_phong',
      text: () => 'Trong ngăn tủ niêm kín của Kim Phong Môn, bạn tìm thấy hồ sơ của một người bị từ chối nhận vào môn nhiều năm trước, lý do đóng bằng con dấu đỏ không ghi rõ. Phía sau tờ hồ sơ là nét chữ của chính vị trưởng lão đã ra quyết định. Ngoài hành lang, tiếng bước chân đang tiến lại gần.',
      choices: [
        {
          key: 'mo', label: 'Mở ra đọc hết (đạo tâm -2; rủi ro: cống hiến -8)', kind: 'risk', run: c => {
            dao(c, -2);
            if (P(lp(c, 0.5))) { xp(c, lim(NR(c) * 0.02, 60)); return G('Bạn đọc nhanh và nhớ được vài dòng then chốt. Tu vi tăng nhẹ, nhưng tay bạn còn run. Đạo tâm -2.'); }
            cong(c, -8);
            return B('Bạn vừa khép tủ thì bị trưởng lão bắt gặp. Cống hiến -8, và lời giải thích của bạn chẳng ai tin.');
          }
        },
        {
          key: 'trinh', label: 'Đưa lên trưởng lão (nhận tiền, cống hiến +8)', kind: 'safe', run: c => {
            const t = tien(c, 20, 60);
            cong(c, 8); gold(c, t);
            return G('Trưởng lão xem qua rồi đóng lại, khen bạn thận trọng. Cống hiến +8, được thưởng ' + t + ' vàng. Bạn không hỏi thêm.');
          }
        },
        {
          key: 'dot', label: 'Đốt hồ sơ, coi như chưa thấy (nghiệp -2)', kind: 'safe', run: c => {
            nghiep(c, -2);
            return 'Bạn đốt tờ hồ sơ trong bếp lò. Mùi giấy cháy bốc lên, không ai hay biết. Nghiệp chính -2 vì đã che một vết nhơ của môn.';
          }
        }
      ]
    },
    {
      id: 'tm_kp_4', tier: 3, manual: true, cool: 0, title: 'Giữ hiệp ước dù thiệt',
      when: c => !!c.sect && c.sect.id === 'ts_kim_phong',
      text: () => 'Kim Phong Môn ký hiệp ước với môn phái láng giềng, nay điều khoản đã thiệt hơn dự tính: phải nhường mỏ sắt phía tây. Trưởng lão nói: "Lời đã hứa thì phải giữ, mất lời là mất hết." Có người đề nghị sửa một chữ trong bản chép để lấy lại mỏ.',
      choices: [
        {
          key: 'giu', label: 'Giữ đúng hiệp ước (tiền 20, danh +2)', kind: 'safe', run: c => {
            gold(c, -20); danh(c, 2); cong(c, 4);
            return G('Bạn đứng ra nhận lời, nhường mỏ sắt cho láng giềng. Mất 20 vàng tiền thu của mỏ, danh +2, cống hiến +4.');
          }
        },
        {
          key: 'lach', label: 'Lách bằng một chữ mập mờ (nghiệp -3; thắng thì có tiền, thua thì danh -3)', kind: 'risk', run: c => {
            nghiep(c, -3);
            if (P(lp(c, 0.5))) { const t = tien(c, 40, 120); gold(c, t); return G('Chữ mập mờ qua mắt được, bạn đòi lại một phần mỏ bằng khoản bồi thường ' + t + ' vàng. Nghiệp chính -3.'); }
            danh(c, -3); cong(c, -8);
            return B('Sứ giả láng giềng đọc ra chữ gian, Kim Phong Môn mất mặt. Danh -3, cống hiến -8.');
          }
        },
        {
          key: 'pha', label: 'Xé hiệp ước, lấy mỏ bằng kiếm (thương -20, nghiệp -4)', kind: 'fight', run: c => {
            const t = tien(c, 60, 200);
            hp(c, -20); nghiep(c, -4); gold(c, t);
            return G('Bạn rút kiếm, đánh tan đội canh mỏ và chiếm lại mỏ sắt. Thu về ' + t + ' vàng, nhưng sinh lực -20 và nghiệp chính -4.');
          }
        }
      ]
    },

    // ---------- Liệt Hỏa Tông (trung, nóng tính, giỏi luyện khí) ----------
    {
      id: 'tm_lh_1', tier: 3, manual: true, cool: 0, title: 'Lò nổ che giấu',
      when: c => !!c.sect && c.sect.id === 'hs_liet_hoa',
      text: () => 'Ở lò luyện phía đông vừa xảy ra một vụ nổ nhỏ. Người ta chôn ba xác dưới sân và báo cho gia đình rằng họ mất vì "sự cố luyện đan". Trong bể nước dưới lò, bạn thấy nước đỏ đặc, và cỏ quanh đó đã úa cả.',
      choices: [
        {
          key: 'to', label: 'Tố lên trưởng lão luyện khí (cống hiến -10, nghiệp +3)', kind: 'help', run: c => {
            nghiep(c, 3); danh(c, 2); cong(c, -10);
            return G('Bạn trình bày mọi chứng cứ. Trưởng lão xử lại lò luyện, bạn được tiếng ngay thẳng: nghiệp +3, danh +2. Nhưng bạn bị đuổi khỏi xưởng, cống hiến -10.');
          }
        },
        {
          key: 'che', label: 'Che giấu, không nói gì (nghiệp -4, cống hiến +6)', kind: 'safe', run: c => {
            nghiep(c, -4); dao(c, -2); cong(c, 6);
            return 'Bạn quay đi, im lặng. Cống hiến +6 vì không gây rắc rối cho ai, nhưng nghiệp chính -4 và đạo tâm -2.';
          }
        },
        {
          key: 'den', label: 'Lặng lẽ bỏ tiền đền bù cho gia đình nạn nhân (tiền 50, nghiệp +2)', kind: 'pay',
          disabled: c => (TT.ls.wealth(c) < 50 ? 'Không đủ vàng' : false), run: c => {
            gold(c, -50); nghiep(c, 2); dao(c, 1);
            return G('Bạn gửi 50 vàng cho ba gia đình, không ghi tên mình. Nghiệp chính +2, đạo tâm +1. Lòng bớt áy náy phần nào.');
          }
        }
      ]
    },
    {
      id: 'tm_lh_2', tier: 3, manual: true, cool: 0, title: 'Cuộc đua phát minh',
      when: c => !!c.sect && c.sect.id === 'hs_liet_hoa',
      text: () => 'Một đồng môn vừa trình lên trưởng lão bản vẽ luyện khí mới, nhưng bạn biết ý tưởng ấy là của chính bạn, đã ghi trong sổ tay từ mấy tháng trước. Trong điện ai cũng khen ngợi bản vẽ. Hắn nhìn bạn và cười, như thể chẳng có chuyện gì.',
      choices: [
        {
          key: 'to', label: 'Đưa bằng chứng ra, tố cắp đề tài (cống hiến -6, danh +3)', kind: 'help', run: c => {
            danh(c, 3); nghiep(c, 2); cong(c, -6);
            return G('Bạn trình sổ tay có ghi ngày tháng. Danh +3, nghiệp chính +2. Đồng môn bị phạt và oán bạn, cống hiến -6.');
          }
        },
        {
          key: 'bat', label: 'Bắt chước, làm lại bản vẽ bán cho xưởng khác (tiền, nghiệp -2)', kind: 'risk', run: c => {
            const t = tien(c, 30, 90);
            gold(c, t); nghiep(c, -2);
            return G('Bạn đổi vài chi tiết rồi bán phương án cho một xưởng khác, nhận ' + t + ' vàng. Nghiệp chính -2.');
          }
        },
        {
          key: 'hop', label: 'Đề nghị cùng hoàn thiện, chia công (mất thời gian, cống hiến +6)', kind: 'safe', run: c => {
            thoiGian(c, 0.02); cong(c, 6); danh(c, 1); dao(c, 1);
            return 'Bạn và hắn ngồi lại suốt nửa tháng. Bản vẽ tốt hơn gấp bội, cả hai được ghi công. Tu vi chậm một chút, cống hiến +6, danh +1, đạo tâm +1.';
          }
        }
      ]
    },
    {
      id: 'tm_lh_3', tier: 3, manual: true, cool: 0, title: 'Cứu trợ hay lợi nhuận',
      when: c => !!c.sect && c.sect.id === 'hs_liet_hoa',
      text: () => 'Một trận cháy rừng vừa thiêu trụi ba thôn quanh chân núi, lương thực và thuốc men tăng giá gấp mấy lần. Kho đan dược của xưởng dư nhiều, và thương khách đang xếp hàng chờ mua với giá gấp đôi. Trưởng lão nói nhỏ: "Lần này, kẻ bán rẻ là kẻ ngốc."',
      choices: [
        {
          key: 'mien', label: 'Phát không cho dân các thôn (tiền 30, danh +4)', kind: 'help',
          disabled: c => (TT.ls.wealth(c) < 30 ? 'Không đủ vàng' : false), run: c => {
            gold(c, -30); danh(c, 4); nghiep(c, 2);
            return G('Bạn mở kho phát đan dược và lương khô không lấy tiền. Mất 30 vàng giá trị hàng hóa, danh +4, nghiệp chính +2.');
          }
        },
        {
          key: 'dat', label: 'Bán đắt, thu lợi lớn (nhận tiền lớn, danh -3, nghiệp -4)', kind: 'risk', run: c => {
            const t = tien(c, 60, 200);
            gold(c, t); danh(c, -3); nghiep(c, -4);
            return 'Bạn thu về ' + t + ' vàng. Nhưng tiếng xấu lan đi khắp chợ, danh -3, nghiệp chính -4.';
          }
        },
        {
          key: 'vua', label: 'Bán giá vừa phải, đủ lời (nhận tiền nhỏ, nghiệp +1)', kind: 'safe', run: c => {
            const t = tien(c, 20, 60);
            gold(c, t); nghiep(c, 1);
            return G('Bạn bán với giá công bằng, đủ lời để xưởng vận hành. Nhận ' + t + ' vàng, nghiệp chính +1.');
          }
        }
      ]
    },
    {
      id: 'tm_lh_4', tier: 3, manual: true, cool: 0, title: 'Can thiệp xa',
      when: c => !!c.sect && c.sect.id === 'hs_liet_hoa',
      text: () => 'Thương hội phương bắc đang tranh một mối buôn than đá với một xưởng nhỏ của dân làng. Môn chủ nhắn: "Đi dạy cho chúng biết ai mới là chủ thị trường." Đi thì được thưởng hậu, nhưng làng ấy chỉ có vài chục người, và trong đó có một đứa trẻ đang đốt than phụ mẹ.',
      choices: [
        {
          key: 'di', label: 'Đi dẹp xưởng làng (thương -15, nghiệp -4; nhận tiền lớn)', kind: 'fight', run: c => {
            const t = tien(c, 50, 150);
            hp(c, -15); gold(c, t); nghiep(c, -4); danh(c, 2);
            return G('Bạn đánh tan xưởng làng và được thưởng ' + t + ' vàng. Danh +2, nghiệp chính -4, sinh lực -15.');
          }
        },
        {
          key: 'ngan', label: 'Khuyên can, không ra tay (cống hiến -10)', kind: 'safe', run: c => {
            cong(c, -10); nghiep(c, 3); dao(c, 1);
            return 'Bạn đứng ra nói với môn chủ rằng việc này không xứng với môn phái. Môn chủ giận, cống hiến -10. Nghiệp chính +3, đạo tâm +1.';
          }
        },
        {
          key: 'doi', label: 'Đòi bồi thường cho cả hai bên (mất thời gian; có thể nhận tiền)', kind: 'risk', run: c => {
            thoiGian(c, 0.02);
            if (P(lp(c, 0.5))) { const t = tien(c, 30, 90); gold(c, t); nghiep(c, 1); return G('Hai bên nhượng bộ, bạn thu được ' + t + ' vàng bồi thường. Nghiệp chính +1.'); }
            cong(c, -4);
            return B('Thương hội từ chối thẳng, môn chủ phàn nàn bạn làm việc chậm. Cống hiến -4.');
          }
        }
      ]
    },

    // ---------- Âm Hồn Giáo (tà đạo, nghiêng tối hơn nhưng còn nét người) ----------
    {
      id: 'tm_ah_1', tier: 3, manual: true, cool: 0, title: 'Thành kháng cự',
      when: c => !!c.sect && c.sect.id === 'vt_am_hon',
      text: () => 'Hãn chủ ra lệnh đồ một tòa thành dám chống lại Âm Hồn Giáo, để cảnh cáo những nơi khác. Trên tường thành, một đứa trẻ đang vẫy tay gọi cha. Nếu bạn không ra tay, kẻ khác sẽ thay bạn, và lệnh vẫn được thi hành.',
      choices: [
        {
          key: 'thi', label: 'Thi hành lệnh, tế hồn cảnh cáo (nhận tiền lớn, nghiệp -6, đạo tâm -3)', kind: 'fight', run: c => {
            const t = tien(c, 80, 200);
            nghiep(c, -6); dao(c, -3); gold(c, t);
            return 'Bạn dẫn đội vào thành. Trận ấy kết thúc trong một đêm, và hồn người bị luyện thành hồn nô. Bạn nhận ' + t + ' vàng chiến lợi. Nghiệp chính -6, đạo tâm -3.';
          }
        },
        {
          key: 'can', label: 'Can hãn chủ, xin tha thành (rủi ro: thương -20, cống hiến -6)', kind: 'risk', run: c => {
            if (P(lp(c, 0.4))) { nghiep(c, 3); cong(c, 4); return G('Hãn chủ nể mặt bạn, tha cho tòa thành với điều kiện nộp đủ lương. Nghiệp chính +3, cống hiến +4.'); }
            hp(c, -20); cong(c, -6);
            return B('Hãn chủ cho rằng bạn yếu lòng, quất bạn một trận. Sinh lực -20, cống hiến -6. Tòa thành vẫn bị đồ.');
          }
        },
        {
          key: 'tron', label: 'Trốn khỏi thành, bỏ mặc lệnh (danh -2, cống hiến -8)', kind: 'flee', run: c => {
            danh(c, -2); cong(c, -8); dao(c, 1);
            return 'Bạn lẩn đi trong đêm, để lại lệnh bài. Đồng môn gọi bạn là kẻ nhát gan: danh -2, cống hiến -8. Nhưng lòng nhẹ đi đôi chút, đạo tâm +1.';
          }
        }
      ]
    },
    {
      id: 'tm_ah_2', tier: 3, manual: true, cool: 0, title: 'Hồn nô',
      when: c => !!c.sect && c.sect.id === 'vt_am_hon',
      text: () => 'Sau trận đánh ở đồi cạn, các đệ tử mang về một lô hồn chưa tan để luyện nô. Trong đống hồn ấy có một hồn gọi tên một đứa con nhỏ, chưa kịp nói hết câu. Người phụ trách bảo bạn: "Nhận mà luyện, đừng để nó lạc đường."',
      choices: [
        {
          key: 'nhan', label: 'Nhận lô hồn về luyện (đạo tâm -3, được tu vi)', kind: 'safe', run: c => {
            dao(c, -3); xp(c, lim(NR(c) * 0.03, 80));
            return G('Bạn mang lô hồn về luyện, tu vi tăng nhờ hấp thụ âm khí. Đạo tâm -3, và đêm ấy bạn không ngủ được.');
          }
        },
        {
          key: 'cuu', label: 'Thả riêng hồn gọi con về phía làng (rủi ro: thương -15, cống hiến -10)', kind: 'risk', run: c => {
            if (P(lp(c, 0.5))) { nghiep(c, 3); dao(c, 1); return G('Bạn lặng lẽ thả hồn ấy đi trước khi người khác để ý. Nghiệp chính +3, đạo tâm +1. Không ai biết chuyện này ngoài bạn.'); }
            hp(c, -15); cong(c, -10);
            return B('Người phụ trách phát hiện chiếc lồng trống. Bạn bị phạt roi: sinh lực -15, cống hiến -10.');
          }
        },
        {
          key: 'bao', label: 'Giao hồn ấy cho người phụ trách (nghiệp -4, cống hiến +6)', kind: 'help', run: c => {
            nghiep(c, -4); cong(c, 6);
            return 'Bạn mang hồn kia giao lên, đúng quy củ. Người phụ trách gật đầu, cống hiến +6. Nghiệp chính -4.';
          }
        }
      ]
    },
    {
      id: 'tm_ah_3', tier: 3, manual: true, cool: 0, title: 'Hãn thăng người ngoài theo tài',
      when: c => !!c.sect && c.sect.id === 'vt_am_hon',
      text: () => 'Hãn chủ vừa đề bạt một kẻ lưu lạc từ nơi khác lên làm đường chủ, dù hắn chưa từng quỳ dưới cờ của môn phái. Trong điện ai cũng xì xào. Kẻ ấy tìm đến bạn trước tiên, và nói rằng hắn không cần chức, chỉ muốn có người cùng tìm đường về.',
      choices: [
        {
          key: 'on', label: 'Nhận ơn hãn chủ, phục tùng hết lòng (cống hiến +8, nghiệp -3)', kind: 'safe', run: c => {
            cong(c, 8); nghiep(c, -3);
            return G('Bạn tỏ rõ trung thành trước mặt hãn chủ. Cống hiến +8, nghiệp chính -3. Từ nay người ngoài nhìn bạn như tay sai của hãn.');
          }
        },
        {
          key: 'ghen', label: 'Ghen ghét, xúi người khác chống lại kẻ mới (cống hiến +4, nghiệp -5)', kind: 'safe', run: c => {
            cong(c, 4); nghiep(c, -5);
            return 'Bạn khéo léo thổi gió, kẻ mới bị cô lập. Cống hiến +4, nghiệp chính -5. Đêm ấy, ánh mắt hắn nhìn bạn không còn như trước.';
          }
        },
        {
          key: 'ket', label: 'Kết thân, cùng nhau làm việc (cống hiến -3, đạo tâm +2)', kind: 'safe', run: c => {
            cong(c, -3); dao(c, 2); nghiep(c, 2);
            return G('Bạn ngồi uống rượu với hắn đến sáng, nghe hắn kể về làng quê đã mất. Hãn chủ không vui, cống hiến -3. Nhưng đạo tâm +2, nghiệp chính +2.');
          }
        }
      ]
    },
    {
      id: 'tm_ah_4', tier: 3, manual: true, cool: 0, title: 'Lễ tưởng niệm',
      when: c => !!c.sect && c.sect.id === 'vt_am_hon',
      text: () => 'Giữa đêm tế lễ, một vong hồn nữ tử vẫn quanh quẩn bên bàn thờ, không chịu tan như những hồn khác. Các đệ tử trẻ ngờ rằng nàng còn chấp niệm với một người đã chết trong trận ở Vụ Trạch. Người coi lễ nói: "Giữ được hồn, mới giữ được sức mạnh của môn." Nhưng ánh mắt nàng đang nhìn bạn.',
      choices: [
        {
          key: 'giu', label: 'Ở lại giữ lễ, giữ hồn không tan (đạo tâm -3, nghiệp -2; cống hiến +5)', kind: 'safe', run: c => {
            dao(c, -3); nghiep(c, -2); cong(c, 5);
            return 'Bạn ở lại đến hết lễ, hồn nữ tử bị giữ trong trận. Cống hiến +5, nghiệp chính -2, đạo tâm -3.';
          }
        },
        {
          key: 'giai', label: 'Phá lễ, giải thoát hồn (rủi ro: thương -20, cống hiến -10)', kind: 'risk', run: c => {
            if (P(lp(c, 0.5))) { nghiep(c, 4); dao(c, 3); return G('Bạn đánh tan trận pháp, hồn nữ tử bay lên trước khi ai kịp ngăn. Nghiệp chính +4, đạo tâm +3. Lễ tế hôm sau không ai nhắc tới nàng nữa.'); }
            hp(c, -20); cong(c, -10);
            return B('Giáo chủ nghiêm phạt. Sinh lực -20, cống hiến -10, và hồn nữ tử vẫn không được giải thoát.');
          }
        },
        {
          key: 'che', label: 'Che giấu, để nàng tự tan (cống hiến -4)', kind: 'safe', run: c => {
            cong(c, -4); dao(c, 2); nghiep(c, 1);
            return 'Bạn không nói gì, chỉ để cửa mở đêm ấy. Nàng nhẹ nhàng tan đi. Cống hiến -4, đạo tâm +2, nghiệp chính +1.';
          }
        }
      ]
    }
  );
})();
