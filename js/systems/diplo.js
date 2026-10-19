// Mạng quan hệ nhiều chiều giữa các thế lực (S1). Thiện cảm `tinh` vẫn nằm ở world.fac.rel (cặp "a|b", a < b theo id);
// các chiều khác và sổ ân oán nằm ở world.fac.rel2[cặp] = { loi, dao, thong, tin, an: [ { m, k, v, t, by, heir? } ] }.
//
// QUY TẮC QUAN TRỌNG: các hàm ĐỌC (peek, total, level, history, of, matrix...) không bao giờ gọi rng và không khởi tạo cặp,
// vì fac.rel() dùng rng ở lần đầu một cặp được hỏi; nếu giao diện làm việc đó thì diễn biến thế giới đổi theo việc người chơi mở tab nào.
// Các hàm GHI (log, add) cũng không gọi rng. Cặp chưa có chuyện không có bản ghi, peek trả mặc định xác định.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, K = D.DIPLO;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  const diplo = TT.diplo = {
    R2() { const f = TT.fac.S(); if (!f.rel2) f.rel2 = {}; return f.rel2; },
    key: (a, b) => (a.id < b.id ? a.id + '|' + b.id : b.id + '|' + a.id),

    // Thiện cảm khởi điểm nếu cặp chưa từng được hỏi: cùng công thức với fac.rel() nhưng bỏ phần ngẫu nhiên (xác định, không rng).
    tagBase(a, b) {
      let v = 0;
      if (a.region === b.region) v -= 6;
      if ((a.tag === 'chinh' && b.tag === 'ta') || (a.tag === 'ta' && b.tag === 'chinh')) v -= 22;
      else if (a.tag === b.tag) v += 10;
      return v;
    },

    // Đạo thống nền giữa hai thế lực: hiện chỉ có giữa hai tông (từ khoảng cách giá trị gt), còn lại 0. Suy ra, không lưu, không rng.
    daoBase(a, b) {
      if (a.kind !== 'tong' || b.kind !== 'tong') return 0;
      const da = TT.sectmod.view(a.id), db = TT.sectmod.view(b.id); // giá trị và hành vi của thế giới đang chạy (S4)
      let s = 0; for (let i = 0; i < 5; i++) s += Math.abs(da.gt[i] - db.gt[i]);
      const pen = Math.max(0, Math.abs(da.nhan - db.nhan) - K.daoNhanFree) * K.daoNhanK; // chênh hành vi (nhan)
      return Math.round(clamp((K.daoMid - s / 5) * K.daoK - pen, -K.daoMax, K.daoMax));
    },
    // Đọc một cặp, không khởi tạo gì. fresh = true nghĩa là cặp chưa từng có chuyện (thiện cảm là mặc định suy ra).
    peek(a, b) {
      const f = TT.fac.S(), k = diplo.key(a, b), raw = f.rel && f.rel[k], r2 = f.rel2 && f.rel2[k];
      return { k, tinh: raw != null ? raw : diplo.tagBase(a, b), fresh: raw == null, loi: r2 ? r2.loi : 0, dao: (r2 ? r2.dao : 0) + diplo.daoBase(a, b), thong: r2 ? r2.thong : 0, tin: r2 ? r2.tin : 60, an: r2 ? r2.an : [] };
    },
    // Số tổng hợp -100..100. S1: chỉ `tinh` có trọng số nên bằng đúng giá trị cũ.
    total(a, b) {
      const p = diplo.peek(a, b), w = K.w;
      return clamp(p.tinh * w.tinh + w.loi * p.loi + w.dao * p.dao + w.thong * p.thong, -100, 100);
    },

    // ---------- ghi ----------
    // Ghi một mục vào sổ ân oán của cặp. v: mức đã cộng vào thiện cảm (để hiển thị). Không dùng rng.
    log(a, b, kind, v, text) {
      const def = K.kinds[kind] || { n: kind, tone: '' }, R = diplo.R2(), k = diplo.key(a, b);
      const r = R[k] || (R[k] = { loi: 0, dao: 0, thong: 0, tin: 60, an: [] });
      const e = { m: TT.world.months, k: kind, v: Math.round((v || 0) * 10) / 10, t: String(text || def.n).slice(0, 200), by: a.id };
      if (def.heir) e.heir = 1;
      r.an.push(e);
      // Sổ đầy: bỏ mục thường cũ nhất (không bỏ mục vừa ghi); toàn thù truyền đời thì bỏ mục cũ nhất.
      while (r.an.length > K.logMax) { let i = r.an.findIndex((x, idx) => !x.heir && idx < r.an.length - 1); if (i < 0) i = 0; r.an.splice(i, 1); }
      if (def.tin) r.tin = clamp(r.tin + def.tin, 0, 100);
      return e;
    },
    // Cộng một chiều. 'tinh' đi qua fac.relAdd (giữ nguyên logic cũ); chiều khác kẹp [-100, 100].
    add(a, b, dim, n, why) {
      if (dim === 'tinh') { TT.fac.relAdd(a, b, n, why); return; }
      const R = diplo.R2(), k = diplo.key(a, b), r = R[k] || (R[k] = { loi: 0, dao: 0, thong: 0, tin: 60, an: [] });
      r[dim] = clamp((r[dim] || 0) + n, dim === 'tin' ? 0 : -100, 100);
      if (why) diplo.log(a, b, why[0], n, why[1]);
    },

    // ---------- đọc ----------
    history(a, b) { return diplo.peek(a, b).an.slice().reverse(); },
    isWar(a, b) { return TT.fac.S().wars.some(w => (w.a === a.id && w.b === b.id) || (w.a === b.id && w.b === a.id)); },
    isAlly: (a, b) => (a.ally || []).indexOf(b.id) >= 0,
    // Hiệp ước giữa hai thế lực (không khởi tạo hiệp ước nếu chưa có: tránh gọi rng của pact.seed).
    pactsBetween(a, b) {
      return (TT.fac.S().pacts || []).filter(p => (p.a === a.id && p.b === b.id) || (p.a === b.id && p.b === a.id));
    },
    pactTag(a, b) {
      return diplo.pactsBetween(a, b).filter(p => p.kind !== 'minh_uoc').map(p => {
        const L = K.pactLabel[p.kind]; return a.id === p.a ? (L ? L[0] : p.kind) + ' ' + b.n : (L ? L[1] : p.kind) + ' ' + b.n;
      });
    },
    level(a, b) {
      const t = diplo.total(a, b), war = diplo.isWar(a, b), ally = diplo.isAlly(a, b);
      let lv = K.levels.find(l => t >= l.min) || K.levels[K.levels.length - 1];
      if (ally && t > -35) lv = K.ally;
      return { id: lv.id, n: lv.n, cls: lv.cls, total: t, war, ally, pacts: diplo.pactsBetween(a, b) };
    },
    // a kiêng dè b (suy ra từ sức mạnh, không lưu): dương = e dè, âm = coi thường.
    cua: (a, b) => clamp((b.power - a.power) * 1.2, -100, 100),
    describe(a, b) {
      const L = diplo.level(a, b), last = diplo.peek(a, b).an.slice(-1)[0];
      return L.n + (L.war ? ' (đang đánh nhau)' : '') + (last ? ' · gần đây: ' + last.t : '');
    },

    // Bạn, thù, chủ, chư hầu, đồng minh của một thế lực. Chỉ tính thế lực còn sống.
    of(x) {
      const alive = TT.fac.list().filter(y => y !== x && TT.fac.alive(y)), rows = alive.map(y => ({ y, t: diplo.total(x, y) })).sort((p, q) => q.t - p.t);
      const pacts = (TT.fac.S().pacts || []).filter(p => p.a === x.id || p.b === x.id), by = id => TT.fac.get(id);
      return {
        friends: rows.filter(r => r.t >= 12).slice(0, 4).map(r => r.y),
        foes: rows.filter(r => r.t <= -12).slice(-4).reverse().map(r => r.y),
        allies: (x.ally || []).map(by).filter(y => y && TT.fac.alive(y)),
        enemies: TT.fac.S().wars.filter(w => w.a === x.id || w.b === x.id).map(w => by(w.a === x.id ? w.b : w.a)).filter(Boolean),
        lords: pacts.filter(p => p.a === x.id && (p.kind === 'chu_hau' || p.kind === 'cong' || p.kind === 'bao_ho')).map(p => by(p.b)).filter(Boolean),
        vassals: pacts.filter(p => p.b === x.id && (p.kind === 'chu_hau' || p.kind === 'cong' || p.kind === 'bao_ho')).map(p => by(p.a)).filter(Boolean)
      };
    },
    // Ma trận cho giao diện/kiểm thử: ids (đã sắp theo loại rồi vùng) và cells[i][j].
    matrix(kinds, filter) {
      const order = k => K.kindOrder.indexOf(k), rIdx = r => D.REGIONS.findIndex(x => x.id === r);
      const L = TT.fac.list().filter(x => TT.fac.alive(x) && (!kinds || kinds.indexOf(x.kind) >= 0) && (!filter || filter(x)))
        .sort((p, q) => order(p.kind) - order(q.kind) || rIdx(p.region) - rIdx(q.region) || (p.id < q.id ? -1 : 1));
      const cells = L.map(a => L.map(b => {
        if (a === b) return null;
        const lv = diplo.level(a, b); return { total: lv.total, id: lv.id, cls: lv.cls, war: lv.war, ally: lv.ally, pact: lv.pacts.length > 0, n: lv.n };
      }));
      return { ids: L.map(x => x.id), list: L, cells };
    }
  };
})();
