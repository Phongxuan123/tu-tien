// Dữ liệu hệ nhiệm vụ: ba tầng, bốn bậc độ khó, người giao và các hệ số cân bằng. Logic nằm ở js/systems/quests.js.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.QUEST = {
    // lo/hi: số năm (nhân với 1 + 0,5 * cảnh giới); max: số nhiệm vụ cùng tầng đang chạy
    TIERS: {
      s: { n: 'Ngắn', lo: 2, hi: 4, max: 2 },
      m: { n: 'Trung', lo: 6, hi: 10, max: 1 },
      l: { n: 'Dài', lo: 15, hi: 30, max: 1 }
    },
    ORDER: ['s', 'm', 'l'],
    // hiệu chỉnh tốc độ dự tính theo tầng (đo mô phỏng: tầng ngắn nhiều nhiễu nên phải dự tính thấp hơn để đạt tỉ lệ thành công mong muốn)
    TIER_K: { s: 0.4, m: 0.75, l: 1.1 },
    // f: hệ số so với tốc độ bình thường. Tỉ lệ thành công kỳ vọng ghi ở p (chỉ để hiển thị gợi ý).
    DIFF: [{ n: 'Dễ', f: 0.35, p: 95 }, { n: 'Vừa', f: 0.6, p: 80 }, { n: 'Khó', f: 0.95, p: 55 }, { n: 'Gian nan', f: 1.5, p: 30 }],
    // trọng số bốc độ khó theo người giao
    DIFF_W: { self: [30, 45, 20, 5], npc: [20, 50, 25, 5], sect: [20, 45, 30, 5], fac: [10, 45, 35, 10], heaven: [0, 0, 100, 0] },
    GIVER: { self: 'Bản thân', npc: 'Người quen', sect: 'Tông môn', fac: 'Thế lực', heaven: 'Thiên Đạo' },
    // loại nhiệm vụ cho phép theo người giao
    GIVER_KINDS: {
      self: ['xp', 'realm', 'gold', 'friend', 'explore', 'fame', 'revenge', 'clear', 'order'],
      npc: ['gold', 'xp', 'explore', 'order'],
      sect: ['xp', 'gold', 'realm', 'clear', 'order'],
      fac: ['gold', 'fame', 'clear', 'order'],
      heaven: ['realm', 'fame', 'clear', 'explore']
    },
    KIND_W: { order: 2, xp: 3, gold: 1.5, realm: 1.5, explore: 1, friend: 1, fame: 1, revenge: 1, clear: 1 },
    GIVER_W: { self: 3, npc: 1.5, sect: 2, fac: 1, heaven: 1.5 },
    // nhãn đường theo loại nhiệm vụ; hướng đi nào thì kéo theo nhãn nào
    KIND_TAG: { xp: 'train', realm: 'train', gold: 'coin', friend: 'social', explore: 'explore', fame: 'social', revenge: null, clear: 'explore', order: 'coin', ho_tong: 'explore', doi_no: 'coin', dep_loan: 'social' },
    // nhiệm vụ do thế lực giao theo hiệp ước (F2, js/systems/court.js): chỉ khi D.COURT.on
    FAC_KINDS: ['ho_tong', 'doi_no', 'dep_loan'],
    DIR_TAG: { tu_luyen: 'train', kiem_song: 'coin', phieu_luu: 'explore', giao_du: 'social', luyen_nghe: 'craft', can_bang: null },
    OPPOSE: { train: ['coin', 'social'], coin: ['train', 'explore'], explore: ['coin', 'train'], social: ['train', 'craft'], craft: ['explore', 'social'] },
    ALIGN_BONUS: 1.15, AGAINST_BONUS: 1.2, AGAINST_P: 0.2, AGAINST_P_OTHER: 0.35,
    // trọng số hành động: hạng 1, 2, 3, còn lại; trần cộng thêm chung
    RANK_W: [1, 0.6, 0.4, 0.25], ACT_CAP: 0.4, ACT_STEP: 0.5,
    // loại nhiệm vụ dẫn tới hành động nào
    KIND_ACT: { xp: { train: 1, dual: 0.5 }, realm: { train: 1, dual: 0.5 }, gold: { work: 1 }, friend: { social: 1 }, explore: { seek: 1 }, fame: { seek: 0.6, forge: 0.6, social: 0.4 }, revenge: { forge: 1, seek: 0.6 }, clear: { seek: 0.8, forge: 0.8 }, order: { work: 1, craft: 1 } },
    OFFER_GAP: 18,        // tháng giữa hai lần đề nghị nhiệm vụ mới
    OFFER_KEEP: 4,        // số đề nghị tối đa chờ
    OFFER_LIFE: 48,       // tháng một đề nghị còn hiệu lực
    // tháng tối thiểu kể từ lần xem xét trước, theo lý do mở cửa sổ (giữ nhịp hỏi người chơi thưa)
    REVIEW_MIN: { heaven: 60, done: 144, fail: 144, drop: 144, offer: 180, big: 180, time: 216 },
    URGENT_LEFT: 1 / 3,   // còn bấy nhiêu thời hạn mà tiến độ tụt thì cấp bách
    PEN_CAP: 25,          // đạo tâm mất tối đa mỗi năm vì nhiệm vụ
    EXTEND_YEARS: 0.3,    // gia hạn thêm bấy nhiêu phần thời hạn gốc
    DROP_MUL: 0.7,        // bỏ giữa chừng bị phạt bấy nhiêu phần so với hỏng
    HEAVEN_FAIL_DAO: 20,
    K_XP: 1, K_GOLD: 1    // hệ số hiệu chỉnh sau khi đo mô phỏng
  };
})();
