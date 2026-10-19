// Quan hệ giữa các cặp nhân vật (thiện cảm -100..100, đối xứng, lưu ở world.rel) và danh tiếng.
// Bản ghi quan hệ: { v: thiện cảm, k: loại đặc biệt ('thu' kẻ thù, 'ket_nghia', 'dao_lu', 'su_do', 'huyet'), m: tháng tương tác
// gần nhất, f: tháng quen đầu tiên, by: id người thề báo thù (nếu k = 'thu'), n: số lần tương tác }.
// Mỗi nhân vật giữ c.relIds (tập id người đã quen) để duyệt nhanh.
(function () {
  const TT = window.TT = window.TT || {};
  const rng = TT.rng;

  const idOf = x => (typeof x === 'object' ? x.id : x);
  const keyOf = (a, b) => (a < b ? a + ':' + b : b + ':' + a);

  const rel = TT.rel = {
    LEVELS: [[-1000, -60, 'Kẻ thù'], [-60, -25, 'Ghét bỏ'], [-25, 15, 'Xa lạ'], [15, 40, 'Quen biết'], [40, 70, 'Bạn bè'], [70, 1000, 'Tri kỷ']],
    KIND_NAMES: { thu: 'Kẻ thù', ket_nghia: 'Kết nghĩa', dao_lu: 'Đạo lữ', su_do: 'Sư đồ', huyet: 'Ruột thịt' },

    get(a, b) { return (TT.world.rel && TT.world.rel[keyOf(idOf(a), idOf(b))]) || null; },
    v(a, b) { const r = rel.get(a, b); return r ? r.v : 0; },

    ensure(a, b) {
      const w = TT.world, ia = idOf(a), ib = idOf(b), key = keyOf(ia, ib);
      w.rel = w.rel || {};
      let r = w.rel[key];
      if (!r) {
        r = w.rel[key] = { v: 0, k: '', m: w.months, f: w.months, by: 0, n: 0 };
        const ca = w.chars[ia], cb = w.chars[ib];
        if (ca) { ca.relIds = ca.relIds || {}; ca.relIds[ib] = 1; }
        if (cb) { cb.relIds = cb.relIds || {}; cb.relIds[ia] = 1; }
      }
      return r;
    },

    level(v, r) {
      if (r && r.k === 'thu') return 'Kẻ thù';
      for (const l of rel.LEVELS) if (v >= l[0] && v < l[1]) return l[2];
      return 'Xa lạ';
    },
    // Nhãn đầy đủ cho giao diện: loại đặc biệt trước, rồi mức thiện cảm.
    label(a, b) {
      const r = rel.get(a, b);
      if (!r) return 'Chưa quen';
      if (r.k && rel.KIND_NAMES[r.k] && r.k !== 'thu') return rel.KIND_NAMES[r.k];
      return rel.level(r.v, r);
    },

    // Cộng thiện cảm (đối xứng). Trả về { r, before, after } để người gọi so sánh mức.
    add(a, b, d, why) {
      const r = rel.ensure(a, b), before = rel.level(r.v, r);
      r.v = rng.clamp(r.v + d, -100, 100);
      r.m = TT.world.months; r.n++;
      return { r, before, after: rel.level(r.v, r), why };
    },
    setKind(a, b, k, by) {
      const r = rel.ensure(a, b);
      r.k = k; if (by != null) r.by = by;
      return r;
    },

    // Mọi quan hệ của một nhân vật: [{ id, c (nhân vật hoặc null nếu đã bị xóa), r }]
    list(c) {
      const w = TT.world, out = [];
      for (const id in (c.relIds || {})) {
        const r = w.rel[keyOf(c.id, +id)];
        if (r) out.push({ id: +id, c: w.chars[id] || null, r });
      }
      return out;
    },

    // Những người thân thiết (tối đa n): bạn thân, kết nghĩa, đạo lữ, sư đồ, kẻ thù không đội trời chung.
    // Điểm xếp hạng dựa trên mức độ gắn bó (|thiện cảm|) và loại quan hệ đặc biệt; người đã mất vẫn được nhớ.
    close(c, n) {
      const scored = rel.list(c).filter(x => x.c).map(x => {
        const sp = x.r.k && x.r.k !== 'thu' ? 60 : 0;
        const enemy = x.r.k === 'thu' ? 40 : 0;
        const s = Math.abs(x.r.v) + sp + enemy;
        return { x, s, ok: x.r.v >= 40 || x.r.v <= -60 || !!x.r.k };
      }).filter(y => y.ok);
      scored.sort((a, b) => b.s - a.s);
      return scored.slice(0, n || 7).map(y => y.x);
    },

    // Có nên giữ nhân vật đã mất trong thế giới (người chơi còn nhớ) hay không.
    remembered(c) {
      const p = TT.player();
      if (!p || !p.relIds || !p.relIds[c.id]) return false;
      const r = rel.get(p, c);
      return !!r && (Math.abs(r.v) >= 40 || !!r.k);
    },

    // Xóa mọi bản ghi quan hệ của một nhân vật (khi bị dọn khỏi thế giới).
    forget(id) {
      const w = TT.world, c = w.chars[id];
      if (!c || !c.relIds) return;
      for (const oid in c.relIds) {
        delete w.rel[keyOf(id, +oid)];
        const o = w.chars[oid];
        if (o && o.relIds) delete o.relIds[id];
      }
      c.relIds = {};
    }
  };

  // ---------- danh tiếng ----------
  // rep.chinh: -100 (tà) .. 100 (chính); rep.danh: danh vọng (tăng dần, càng lớn càng nổi tiếng).
  const FAME = [[800, 'Danh chấn thiên hạ'], [300, 'Lừng lẫy một phương'], [100, 'Nổi danh'], [30, 'Có chút tiếng tăm'], [0, 'Vô danh']];
  const rep = TT.rep = {
    add(c, k, n) {
      c.rep = c.rep || { chinh: 0, danh: 0 };
      if (k === 'chinh') c.rep.chinh = rng.clamp(c.rep.chinh + n, -100, 100);
      else if (k === 'danh') {
        const before = rep.fameName(c);
        c.rep.danh = Math.max(0, c.rep.danh + n);
        if (c.kind === 'player' && rep.fameName(c) !== before) {
          TT.log(c, 'Danh tiếng của bạn lên một bậc: ' + rep.fameName(c) + '.', 'big');
          TT.news('Giang hồ bắt đầu nhắc tới ' + c.name + ': ' + rep.fameName(c) + '.', 'good', [c.id]);
        }
      }
    },
    fameName(c) { const d = (c.rep && c.rep.danh) || 0; for (const f of FAME) if (d >= f[0]) return f[1]; return 'Vô danh'; },
    alignName(c) {
      const a = c.kind === 'player' ? ((c.rep && c.rep.chinh) || 0) : c.align;
      return a >= 40 ? 'Chính đạo' : a >= 12 ? 'Thiên về chính' : a <= -40 ? 'Tà đạo' : a <= -12 ? 'Thiên về tà' : 'Trung lập';
    },
    // Thiên hướng chính/tà của một nhân vật (người chơi: theo hành vi, NPC: theo tính cách).
    alignOf(c) { return c.kind === 'player' ? ((c.rep && c.rep.chinh) || 0) : (c.align || 0); }
  };
})();
