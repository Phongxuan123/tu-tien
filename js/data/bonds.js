// Quan hệ có chiều sâu (R mục 4, 5; Z "9B"): cấu hình thanh, loại, giai đoạn đạo lữ, tương hợp, song tu. Chỉ cho cặp CỦA NGƯỜI CHƠI.
// Bản ghi world.rel[key].d = { t (loại), love, trust, respect, debt, st (giai đoạn), since (tháng), p ('chinh'|'phu'), sy { y, n } (song tu trong năm), ref, low, nb, by, han }.
// Khóa fx của chặng truyện: bond: { vai, love?, trust?, respect?, debt? (cộng dồn, ±100), st? (giai đoạn), type? (loại) }.
// Điều kiện mo/khi: bond: { vai? (khi), st? (đạt giai đoạn), love?/trust?/respect? (từ ngưỡng này), debt? (dương: từ ngưỡng ơn; âm: từ ngưỡng oán), type? }.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.BOND = {
    on: true,                 // false: mọi thứ chạy như cũ (rel.love, family.pair...), baseline.js --bond=off phải trùng khít
    deep: 40,                 // |thiện cảm| từ ngưỡng này (hoặc có loại đặc biệt) là cặp thân thiết, được khởi tạo d
    maxClose: 15,             // tối đa số cặp thân thiết có d cho mỗi người chơi (cặp có loại đặc biệt không bị chặn)
    maxPartners: 3,           // 1 đạo lữ chính + tối đa 2 phụ (R 5.5)
    adult: 18,                // chỉ cần đủ tuổi trưởng thành (đã bỏ giới hạn chênh lệch tuổi 30, R 1.1)
    // Loại quan hệ (R 4.2). bars: thanh hiện cho loại này (thanh khác chỉ hiện khi từ 10 trở lên).
    types: {
      ban: { n: 'Bạn bè', bars: ['trust'] },
      ket_nghia: { n: 'Kết nghĩa', bars: ['trust', 'respect'] },
      dao_lu: { n: 'Đạo lữ', bars: ['love', 'trust', 'respect'] },
      thuong: { n: 'Người thương', bars: ['love'] },
      hon_uoc: { n: 'Hôn ước', bars: ['respect'] },
      su_do: { n: 'Sư đồ', bars: ['respect', 'trust'] },
      huyet: { n: 'Ruột thịt', bars: ['love', 'respect'] },
      an: { n: 'Ân nhân', bars: [] },
      thu: { n: 'Kẻ thù', bars: [] },
      cu: { n: 'Người cũ', bars: ['love'] }
    },
    legacy: { dao_lu: 'dao_lu', ket_nghia: 'ket_nghia', su_do: 'su_do', huyet: 'huyet', thu: 'thu' }, // rel.k cũ -> loại mới
    // Giai đoạn đạo lữ (R 5.1). Đường chính theo thứ tự (rank); ran và biet là nhánh cuối (chỉ khớp đúng). 'thu' (thử thách) nằm trên 'ben'.
    stages: [
      { id: 'gap', n: 'Gặp gỡ' }, { id: 'men', n: 'Mến nhau' }, { id: 'to', n: 'Đã tỏ tình' }, { id: 'hon', n: 'Hôn ước' },
      { id: 'ket', n: 'Mới kết đạo lữ' }, { id: 'ben', n: 'Ở bên nhau' }, { id: 'thu', n: 'Thử thách' }, { id: 'ran', n: 'Rạn nứt' }, { id: 'biet', n: 'Vĩnh biệt' }
    ],
    consent: ['to', 'hon', 'ket'],    // các bước cần người kia (NPC) đồng ý: có thể bị từ chối
    // Tần suất và thưởng (R 5.3): lần 1 trong năm 100%, lần 2 60%, lần 3 trở đi 20% (không thụ thai từ lần 3).
    songTu: { mult: [1, 0.6, 0.2], conceiveMax: 2, perYear: 2, refuseLove: 35, refuseP: 0.4 },
    // Tương hợp (R 5.2): trọng số của từng thành phần, cộng lại rồi kẹp −1..1.
    compat: { daoduc: 0.34, tinh: 0.16, xuthe: 0.14, tudung: 0.08, elem: 0.1, dao: 0.08, chinh: 0.1 },
    compatBands: [[0.35, 'Rất hợp'], [0.1, 'Hợp'], [-0.2, 'Bình thường'], [-2, 'Trái tính']],
    // Nỗi buồn tuổi thọ: chênh từ này cảnh giới thì mỗi năm đạo tâm người chơi giảm nhẹ, tình giảm nhẹ.
    grief: { realmGap: 2, daoTam: 1, love: 1, every: 5 },
    // Tình, Tin, Kính trôi theo năm cho đạo lữ của người chơi: ở cùng nơi thì tăng, xa nhau thì nhạt.
    // rom: Tình tăng mỗi năm của cặp có thể nảy tình (gặp gỡ, mến nhau) khi ở cùng nơi; loveMul: nhân Tình nhận được từ giao du của cặp người chơi.
    rom: { near: 7, compat: 3 }, loveMul: 1.6,
    drift: { near: 2, far: -3, trustNear: 1, trustFar: -1 },
    // Rạn nứt: Tình hoặc Tin dưới ngưỡng liên tục lowYears năm thì chuyển giai đoạn rạn nứt, hỏi người chơi.
    ran: { love: 30, trust: 25, years: 2 },
    // NPC đạo lữ tự chủ: xác suất mỗi năm rời đi.
    leave: { love: 25, trust: 25, pLove: 0.25, pTrust: 0.15, pCompat: 0.1, pExtra: 0.05, max: 0.5 },
    // Hôn ước do thế lực/gia tộc ép người chơi (R 5.4): xác suất mỗi năm và hạn (tháng).
    // near/far: Tình tăng mỗi năm của cặp hôn ước khi ở gần/xa nhau (người kia tự tìm tới); leLove: Tình đủ để làm lễ kết đạo lữ.
    hon: { p: 0.008, minAge: 18, maxAge: 45, han: 36, near: 14, far: 1, leLove: 40, seek: 0.5 },
    // Thử thách chung (R 5.3): xác suất mỗi năm cho đạo lữ chính ở bên nhau.
    thuThach: { p: 0.12 },
    // ---- 9K: kết nghĩa qua trải nghiệm chung. mem = công tắc ký ức/đồng hành (false: như 9B, baseline --mem=off phải trùng khít).
    mem: true,
    kn: {
      cap: 8,           // tối đa ký ức mỗi cặp; đầy thì bỏ ký ức thường cũ nhất trước, giữ hoạn nạn (hn)
      minV: 15,         // thiện cảm tối thiểu để một người có thể thành ký ức chung
      // loại ký ức: n (nhãn), trust/respect (cộng khi ghi, nhân với "nặng"), hn (hoạn nạn), gap (tháng, chặn ghi trùng loại)
      types: {
        bi_canh: { n: 'Bí cảnh', trust: 4, respect: 3, hn: 0, gap: 6 },
        danh: { n: 'Đánh nhau', trust: 3, respect: 4, hn: 1, gap: 3 },
        cuu: { n: 'Cứu giúp', trust: 5, respect: 4, hn: 1, gap: 3 },
        nho: { n: 'Nhờ giúp', trust: 5, respect: 1, hn: 0, gap: 6 },
        nhiem_vu: { n: 'Nhiệm vụ', trust: 3, respect: 2, hn: 0, gap: 6 },
        the_gioi: { n: 'Thế sự', trust: 3, respect: 2, hn: 1, gap: 36 },
        ban_nho: { n: 'Thuở nhỏ', trust: 4, respect: 0, hn: 0, gap: 12 },
        giang: { n: 'Cùng nghe', trust: 2, respect: 1, hn: 0, gap: 12 },
        nghia: { n: 'Giữ lời thề', trust: 6, respect: 6, hn: 0, gap: 6 },
        the: { n: 'Lời thề', trust: 8, respect: 6, hn: 0, gap: 0 },
        tai_ngo: { n: 'Tái ngộ', trust: 4, respect: 3, hn: 0, gap: 12 },
        luy: { n: 'Gánh thay', trust: 4, respect: 3, hn: 1, gap: 12 },
        mat: { n: 'Lần cuối', trust: 0, respect: 0, hn: 1, gap: 0 }
      },
      swear: { n: 3, hn: 1, v: 40, p: 0.12, cool: 12 },     // kết nghĩa: ≥ n ký ức chung, ≥ hn hoạn nạn, thiện cảm ≥ v; p: xác suất mỗi tháng nếu đủ
      // đồng hành: bạn thân cùng nơi (thiện cảm ≥ minV) đi cùng
      ally: { minV: 40, p: 0.3, pBro: 0.55, pAsk: 0.85, bonus: [0.05, 0.10], share: 0.2, hurt: 0.15, hurtHp: 0.3, die: 0.25, askHan: 6, ru: 24 },
      // sau kết nghĩa
      bro: { help: 0.6, helpBonus: [0.1, 0.16], luy: 0.04, luyDie: 0.15, gift: 0.35, giftGap: 36, nan: 0.06, loi: 0.035, loiGap: 120, world: 0.15 },
      taiNgo: { years: 10, v: 30 }
    }
  };
  D.BOND.rank = {}; D.BOND.stages.forEach((s, i) => { D.BOND.rank[s.id] = i; });
  D.BOND.stageById = {}; D.BOND.stages.forEach(s => { D.BOND.stageById[s.id] = s; });
})();
