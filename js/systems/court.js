// Triều chính (S7, ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 5.5) và phần còn lại của F2: hoàng quyền, kế vị và tranh ngôi, thế gia trong triều, quốc sách với tu sĩ, quốc giáo gắn triều;
// trưng binh theo chư hầu, thông gia (hon_uoc), thuế thương hội (thue_hoi). Nhiệm vụ thế lực (ho_tong, doi_no, dep_loan) nằm ở js/systems/quests.js và gọi các hàm đọc ở đây.
// Lưu ở world.fac.nat[id triều].court = { hq, heir, heirAt, sach, sachAt, civilAt, vien }, khởi tạo muộn (thế giới cũ có ở năm kế tiếp), không đổi TT.VERSION.
//
// QUY TẮC (S mục 15.2): các hàm ĐỌC (on, peek, quyen, hqWord, quyenWord, sachOf, chieuDu, vanDelta, tongDelta, taAdd, levyMul, describe, sig, pactById, questPact) không gọi rng và không khởi tạo.
// Hàm GHI dùng băm (TT.nation.hn) thay rng. Kế vị (succeed) đi sau fac.succession vốn đã gọi rng; phần thêm chỉ dùng băm.
// D.COURT.on = false thì mọi hàm ghi không làm gì và mọi hàm đọc trả về trung tính (đường cơ sở trùng khít).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, K = D.COURT;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const tierOf = (list, v) => list.find(t => v >= t.min) || list[list.length - 1];
  const regName = rid => (TT.map.region(rid) ? TT.map.region(rid).n : rid);
  const hn = (...a) => TT.nation.hn(...a);
  const yn = () => Math.floor(TT.world.months / 12);
  const near = rid => { const pl = TT.player(); return !!(pl && pl.region === rid); };
  const trieuOf = rid => TT.fac.list('trieu').find(t => t.region === rid) || null;
  const DEF = { hq: 50, heir: 0, heirAt: 0, sach: 'tu_do', sachAt: 0, civilAt: -9999, vien: 0 };

  const court = TT.court = {
    on() { return !!K.on; },
    // Bản ghi triều chính hiện có (đọc, không tạo).
    peek(x) { const e = TT.nation.peek(x.id); return (e && e.court) || DEF; },
    // Bản ghi triều chính (ghi: tạo muộn, hoàng quyền khởi đầu theo băm).
    ent(x) {
      const e = TT.nation.ent(x);
      if (!e.court) { const s = K.start; e.court = Object.assign({}, DEF, { hq: Math.round(s[0] + (s[1] - s[0]) * hn('hq0', x.id)), heirAt: TT.world.months, sachAt: TT.world.months }); }
      return e.court;
    },
    // Thế gia trong triều: sức mạnh của gia tộc mạnh nhất cùng vùng (đọc, không lưu).
    quyen(x) {
      let g = 0; TT.fac.list('gia').forEach(y => { if (y.region === x.region && TT.fac.alive(y) && y.power > g) g = y.power; });
      return clamp(g, 0, 100);
    },
    quyenWord(q) { return tierOf(K.quyenBand, q).n; },
    hqWord(v) { return v >= K.hq.strong ? 'mạnh' : v < K.hq.weak ? 'yếu' : 'vừa'; },
    sachOf(x) { return court.peek(x).sach; },
    chieuDu(x) { return !!K.on && court.sachOf(x) === 'chieu_du'; },

    // Tác dụng lên quốc vận hằng năm của triều: hoàng quyền mạnh hoặc yếu, thế gia lục đục, quốc sách.
    vanDelta(x) {
      if (!K.on || x.kind !== 'trieu') return 0;
      const C = court.peek(x), H = K.hq;
      let d = C.hq >= H.strong ? K.vanStrong : C.hq < H.weak ? K.vanWeak : 0;
      if (court.quyen(x) >= K.luc.quyen && C.hq < K.luc.hq) d += K.luc.d;
      return d + K.sach.kinds[C.sach].van;
    },
    // Quốc sách với tu sĩ làm đổi độ đoàn kết của tông trong vùng.
    tongDelta(t) {
      if (!K.on || t.kind !== 'tong') return 0;
      const tr = trieuOf(t.region); return tr ? K.sach.kinds[court.peek(tr).sach].tong : 0;
    },
    // Quốc sách với tu sĩ làm đổi tà khí của vùng (cấm thì tà tu ẩn náu, hạn chế thì bớt).
    taAdd(rid) { if (!K.on) return 0; const tr = trieuOf(rid); return tr ? K.sach.kinds[court.peek(tr).sach].ta : 0; },
    // Hệ số quân lực nhờ trưng binh chư hầu (trong army.mul); tối đa 1 + mulMax.
    levyMul(x) {
      if (!K.on || x.kind !== 'trieu') return 1;
      const v = court.peek(x).vien; if (!v) return 1;
      const tot = TT.army.soldiers(x, !!x.war) || 1;
      return 1 + Math.min(K.levy.mulMax, v / tot);
    },
    // Mô tả cho giao diện: chữ và bậc, không số.
    describe(x) {
      const C = court.peek(x), q = court.quyen(x);
      return { hqWord: court.hqWord(C.hq), heir: !!C.heir, quyen: court.quyenWord(q), sachKey: C.sach, sach: K.sach.kinds[C.sach], civil: C.civilAt > -9999 && TT.world.months - C.civilAt < K.civil.years * 12 };
    },
    sig() { return TT.fac.list('trieu').map(x => { const d = court.describe(x); return d.hqWord + (d.heir ? 1 : 0) + d.quyen + d.sachKey + (d.civil ? 1 : 0); }).join('/'); },
    pactById(id) { return TT.pact.S().find(p => p.id === id) || null; },
    // Hiệp ước mà bên gánh ở vùng rid (cống, thuế, chư hầu): mode 'ok' còn hiệu lực, 'owed' đang nợ từ ba điểm trở lên.
    questPact(rid, kinds, mode) {
      const f = TT.fac;
      return TT.pact.S().find(p => {
        if (kinds.indexOf(p.kind) < 0) return false;
        const a = f.get(p.a), b = f.get(p.b);
        if (!a || !b || !f.alive(a) || !f.alive(b) || a.region !== rid) return false;
        return mode === 'owed' ? (p.owed || 0) >= 3 : !p.defy;
      }) || null;
    },

    // ---------- ghi ----------
    // Một năm: hoàng quyền, thái tử, quốc sách; sau đó trưng binh, thông gia, thuế thương hội.
    yearly() {
      if (!K.on) return;
      TT.fac.list('trieu').forEach(x => { if (TT.fac.alive(x)) court.step(x); });
      court.levy();
      court.marriages();
      court.hoiTax();
    },
    step(x) {
      const e = TT.nation.ent(x), C = court.ent(x), H = K.hq, y = yn();
      const q = court.quyen(x);
      const target = H.base + H.tai * (e.tai - H.leadMid) + H.de * (e.de - H.leadMid) - H.quyen * (q - H.quyenMid) + (x.war ? H.war : 0);
      C.hq = clamp(C.hq + (target - C.hq) * H.pull + (hn('hq', x.id, y) - 0.5) * 2 * H.noise, 0, 100);
      if (!C.heir && TT.world.months - C.heirAt >= K.heir.delay * 12 && hn('thaitu', x.id, y) < K.heir.p) C.heir = 1; // lập thái tử lặng lẽ, không vào sử ký
      if (y % K.sach.every === Math.floor(hn('sachoff', x.id) * K.sach.every)) court.choose(x, C, e, q, y);
    },
    // Quốc sách với tu sĩ: chọn theo trọng số và tình thế (băm, không rng); chỉ đổi khi khác chiều cũ.
    choose(x, C, e, q, y) {
      const S = K.sach, w = Object.assign({}, S.w);
      const add = m => Object.keys(m).forEach(k => { w[k] += m[k]; });
      if (C.hq < K.hq.weak) add(S.weak);
      if (q >= 60) add(S.quyen);
      if (e.van >= 60) add(S.van);
      if (e.van < 35) add(S.vanLow);
      const keys = Object.keys(w), tot = keys.reduce((a, k) => a + w[k], 0);
      let r = hn('sach', x.id, y) * tot, pick = keys[keys.length - 1];
      for (const k of keys) { r -= w[k]; if (r < 0) { pick = k; break; } }
      if (pick === C.sach || hn('sachdoi', x.id, y) >= S.p) return;
      C.sach = pick; C.sachAt = TT.world.months;
      const kd = S.kinds[pick], text = x.n + ' ban quốc sách với tu sĩ: ' + kd.n + ' (' + kd.desc + ')';
      TT.nation.note(e, 'sach', text);
      TT.fac.chron(text, pick === 'cam' ? 'bad' : 'age', near(x.region));
    },
    // Gọi từ fac.succession sau khi đổi người đứng đầu (chỉ vương triều): thái tử nối ngôi, tranh ngôi, nội chiến nhỏ có trần.
    succeed(x) {
      if (!K.on || x.kind !== 'trieu') return;
      const e = TT.nation.ent(x), C = court.ent(x), S = K.succ, H = K.hq, q = court.quyen(x), y = yn();
      const hadHeir = !!C.heir;
      C.heir = 0; C.heirAt = TT.world.months;
      const p = clamp(S.base + (C.hq < H.weak ? S.weak * (H.weak - C.hq) / H.weak : 0) + (q >= K.civil.quyenMin ? S.quyen : 0) + (hadHeir ? 0 : S.noHeir), 0, S.max);
      if (hn('tranh', x.id, TT.world.months) >= p) { C.hq = clamp(C.hq + S.hqPeace, 0, 100); return; } // êm: hoàng quyền được củng cố nhẹ
      let who;
      if (q >= S.quyenWin && q > C.hq) { who = 'the'; C.hq = clamp(C.hq - S.hqQuyen, 0, 100); }
      else if (hadHeir) { who = 'thaitu'; C.hq = clamp(C.hq - S.hqHeir, 0, 100); }
      else { who = 'tong'; C.hq = clamp(C.hq - S.hqTong, 0, 100); }
      const what = { the: 'thế gia đưa người lên ngôi, tranh ngôi trong triều', thaitu: 'thái tử nối ngôi nhưng các phe vẫn tranh giành', tong: 'tông thất tranh ngôi, triều đình rối ren' }[who];
      let civil = false;
      if (C.hq < K.civil.hqMax && q >= K.civil.quyenMin && TT.world.months - C.civilAt >= K.civil.years * 12 && hn('noichien', x.id, y) < K.civil.p) {
        civil = true; C.civilAt = TT.world.months;
        x.power = clamp(x.power * K.civil.power, 1, 100); x.unity = clamp(x.unity - K.civil.unity, 5, 100);
        const g = TT.pop.get(x.region); if (g) g.mood = clamp(g.mood - K.civil.mood, 0, 100);
      }
      const text = what + (civil ? '; nội chiến nhỏ nổ ra ở ' + regName(x.region) + ', dân ly tán' : '');
      TT.nation.note(e, civil ? 'noi_chien' : 'tranh_ngoi', text);
      TT.fac.chron(x.n + ': ' + text + '.', civil ? 'bad' : 'age', near(x.region));
    },
    // Đổi chủ (mất mệnh, chia cắt, thua trận): hoàng quyền về mức người mới, thái tử chưa lập.
    onRuler(x) {
      if (!K.on || x.kind !== 'trieu') return;
      const C = court.ent(x);
      C.hq = K.hq.newRuler; C.heir = 0; C.heirAt = TT.world.months;
    },
    // Triều đổi quốc giáo (gọi từ faith.js): quyền thần lợi dụng, hoàng quyền và dân tâm tổn.
    onFaith(t) {
      if (!K.on) return;
      const C = court.ent(t), g = TT.pop.get(t.region);
      C.hq = clamp(C.hq + K.hq.faith, 0, 100);
      if (g) g.mood = clamp(g.mood - 4, 0, 100);
      TT.nation.note(TT.nation.ent(t), 'quoc_giao', 'Đổi quốc giáo: quyền thần lợi dụng, hoàng quyền tổn.');
    },
    // Trưng binh: khi bên chủ có chiến tranh, chư hầu là vương triều gửi quân (vien tích vào bên chủ, giảm nửa mỗi năm); chư hầu oán thêm.
    levy() {
      const f = TT.fac;
      f.list('trieu').forEach(x => { if (f.alive(x)) { const C = court.ent(x); C.vien = C.vien * K.levy.decay; if (C.vien < 1) C.vien = 0; } });
      TT.pact.S().forEach(p => {
        if (p.kind !== 'chu_hau' || p.defy) return;
        const a = f.get(p.a), b = f.get(p.b);
        if (!a || !b || a.kind !== 'trieu' || b.kind !== 'trieu' || !f.alive(a) || !f.alive(b) || !b.war) return;
        const amt = Math.min(K.levy.cap, TT.army.stateOf(a).q * K.levy.ratio), C = court.ent(b);
        C.vien = clamp(C.vien + amt, 0, K.levy.cap);
        p.strain = Math.min(100, p.strain + K.levy.strain);
      });
    },
    // Thông gia: hai thế lực đồng minh, quan hệ đủ tốt, mỗi năm có xác suất nhỏ kết hôn ước; quan hệ tăng và hiệp ước hết hạn sau một thời gian.
    marriages() {
      const f = TT.fac, M = K.marry, P = TT.pact.S(), y = yn();
      f.list().filter(x => f.alive(x) && (x.kind === 'trieu' || x.kind === 'tong')).forEach(a => {
        (a.ally || []).forEach(id => {
          const b = f.get(id);
          if (!b || !f.alive(b) || (b.kind !== 'trieu' && b.kind !== 'tong') || b.id < a.id) return;
          if (f.relV(a, b) < M.min || P.some(p => p.kind === 'hon_uoc' && ((p.a === a.id && p.b === b.id) || (p.a === b.id && p.b === a.id)))) return;
          if (hn('honuoc', a.id, b.id, y) >= M.p) return;
          TT.pact.add('hon_uoc', a.id, b.id, { rate: 0, until: TT.world.months + M.years * 12, strain: M.strain });
          f.relAdd(a, b, M.rel, ['thong_gia', a.n + ' kết thông gia với ' + b.n]);
          f.chron(a.n + ' kết thông gia với ' + b.n + ', hai nhà thêm thân thiết.', 'good', near(a.region) || near(b.region));
        });
      });
    },
    // Thuế thương hội: mỗi thương hội nộp một tỉ phần kho cho triều của vùng nó đặt (hiệp ước thue_hoi, tạo muộn).
    hoiTax() {
      const f = TT.fac;
      f.list('hoi').forEach(h => {
        if (!f.alive(h)) return;
        const tr = trieuOf(h.region); if (!tr || !f.alive(tr)) return;
        TT.pact.add('thue_hoi', h.id, tr.id, { rate: K.hoiTax, strain: K.hoiStrain });
      });
    }
  };
})();
