// Quốc vận, nho khí và long mạch của chín vương triều (S3). Lưu ở world.fac.nat[id triều] = { van, nho, mach, de, tai, lead, low, falls, vt, vtAt, khoaAt, hist: [ { m, k, t } ] }.
//
// QUY TẮC (S mục 15.2): các hàm ĐỌC (peek, view, tier, nhoTier, taKhi, danger, luck, moodMul, powerShift, describe, warn, brkPenalty, vanVi, hao) không gọi rng
// và không khởi tạo dữ liệu; chưa có bản ghi thì trả mặc định xác định. Hàm GHI (yearly, onWarEnd, backlash, atone, setVan) không dùng rng cho phần số;
// nhiễu hằng năm lấy từ băm (hạt giống, năm, id) nên bật/tắt hệ thống không làm lệch dòng số ngẫu nhiên. Chỉ khi mất mệnh mới gọi rng (đặt tên người cầm quyền mới).
// D.NATION.on = false làm cả hệ thống đứng yên (yearly không làm gì, mọi hệ số bằng 1 hoặc 0) nên thế giới trùng khít đường cơ sở trước S3.
// Trường mới khởi tạo muộn, không đổi TT.VERSION; thế giới cũ có bản ghi ở năm kế tiếp.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, K = D.NATION;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const r1 = v => Math.round(v * 10) / 10;
  const regName = rid => (TT.map.region(rid) ? TT.map.region(rid).n : rid);

  // Số xác định trong [0, 1) theo (hạt giống, các phần tử): thay cho rng ở các chỗ cần nhiễu mà không đụng dòng số ngẫu nhiên.
  function hn() {
    let s = String((TT.world && TT.world.seed) || 0);
    for (let i = 0; i < arguments.length; i++) s += '|' + arguments[i];
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    h ^= h >>> 15; h = Math.imul(h, 2246822519) >>> 0; h ^= h >>> 13; h = Math.imul(h, 3266489917) >>> 0; h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  const tierOf = (list, v) => list.find(t => v >= t.min) || list[list.length - 1];
  const trieuOf = rid => TT.fac.list('trieu').find(t => t.region === rid) || null;

  const nat = TT.nation = {
    hn,
    // ---------- đọc (không rng, không khởi tạo) ----------
    peek(id) { const f = TT.world && TT.world.fac; return (f && f.nat && f.nat[id]) || null; },
    // Giá trị hiện có của một triều (mặc định khi chưa có bản ghi: giữa các bậc, không đổi gì).
    view(x) {
      const e = x && nat.peek(x.id);
      return e ? { van: e.van, nho: e.nho, mach: e.mach, de: e.de, tai: e.tai, init: true } : { van: 50, nho: 50, mach: x ? (K.mach[x.region] != null ? K.mach[x.region] : 2) : 2, de: 50, tai: 50, init: false };
    },
    viewAt(rid) { const x = trieuOf(rid); return x ? nat.view(x) : null; },
    tier(v) { return tierOf(K.tiers, v); },
    nhoTier(v) { return tierOf(K.nhoTiers, v); },
    machName(m) { return K.machNames[clamp(Math.round(m), 0, K.machNames.length - 1)]; },
    // Suy sức mạnh: độ lệch mục tiêu `power` của triều theo quốc vận và nho khí (đã bù bằng vanMid, nhoMid).
    powerShift(x) {
      if (!K.on || x.kind !== 'trieu') return 0;
      const v = nat.view(x); if (!v.init) return 0;
      return K.power.kVan * (v.van - K.power.vanMid) + K.power.kNho * (v.nho - K.power.nhoMid);
    },
    // Dân tâm hồi nhanh khi vận cao, chậm khi vận thấp (nhân vào tốc độ hồi).
    moodMul(rid) {
      if (!K.on) return 1;
      const v = nat.viewAt(rid); if (!v || !v.init) return 1;
      return clamp(1 + K.pop.moodK * (v.van - 50) / 50, K.pop.moodMin, K.pop.moodMax);
    },
    // Tà khí của một vùng 0..100: tà tông, loạn dân, chiến sự, đói; nho khí cao trấn bớt.
    taRaw(rid) {
      const T = K.ta, f = TT.fac;
      let s = 0;
      f.list('tong').forEach(x => { if (x.region === rid && f.alive(x) && x.tag === 'ta') s += T.perSect * (0.5 + 0.5 * clamp(x.power, 0, 100) / 60); });
      const g = TT.world.pop && TT.world.pop[rid];
      if (g) { if (g.riot) s += T.riot; if (g.food < K.nho.hungerBelow) s += T.hunger; }
      if (f.atFront(rid)) s += T.front;
      s += TT.court.taAdd(rid); // quốc sách với tu sĩ (S7)
      return s;
    },
    taKhi(rid) {
      const v = nat.viewAt(rid), nho = v ? v.nho : 50;
      return clamp(nat.taRaw(rid) * (1 - K.ta.nhoCut * nho / 100), 0, 100);
    },
    // Nguy hiểm cộng thêm cho người chơi ở vùng (nước vận Mạt hoặc tà khí nặng); tối đa +1 (S mục 5.2, 5.3).
    danger(rid) {
      if (!K.on) return 0;
      const v = nat.viewAt(rid);
      if (v && v.init && v.van < K.effect.dangerMatBelow) return 1;
      return nat.taKhi(rid) >= K.ta.dangerAt ? 1 : 0;
    },
    // May mắn nền của người chơi theo quốc vận nơi đang ở (nhỏ).
    luck(c) {
      if (!K.on || !c || c.kind !== 'player') return 0;
      const v = nat.viewAt(c.region); if (!v || !v.init) return 0;
      return v.van >= 80 ? K.effect.luckRong : v.van >= 60 ? K.effect.luckThinh : 0;
    },
    // Phạt xác suất đột phá còn hiệu lực do phản phệ.
    brkPenalty(c) { const p = c && c.flags && c.flags.phanPhe; return p && p.until > TT.world.months ? p.brk : 0; },
    // Văn vị và hạo nhiên khí của cá nhân (mức dữ liệu).
    vanVi(c) { return clamp((c && c.van) | 0, 0, K.vanVi.length - 1); },
    vanViName(c) { return K.vanVi[nat.vanVi(c)].n; },
    hao(c) { return K.vanVi[nat.vanVi(c)].hao; },
    // Cảnh báo trước khi làm việc gây họa (không đổi gì): { scale, severe, text }.
    warn(c, rid, kind) {
      const B = K.backlash, def = B.kinds[kind]; if (!def) return null;
      const v = nat.viewAt(rid), sc = nat.scale(v ? v.van : 50);
      const lv = sc < 0.3 ? 'gần như không có' : sc < 0.7 ? 'nhẹ' : sc < 1.05 ? 'vừa' : 'nặng';
      return { scale: sc, severe: (v ? v.van : 50) >= B.warnBelow && sc >= 1.05, text: 'Nếu ' + def.n + ' ở ' + regName(rid) + ', phản phệ ' + lv + ' (nghiệp báo, đạo tâm tổn, khó đột phá một thời gian).' };
    },
    scale(van) { const B = K.backlash; return van < K.mat.below ? B.scaleMinMat : clamp(van / B.vanScale, B.scaleMinMat, B.scaleMax); },
    // Mô tả cho giao diện (không số cho người chơi ở bản chữ; số dùng vẽ thanh).
    describe(x) {
      const v = nat.view(x), e = nat.peek(x.id), t = nat.tier(v.van), n = nat.nhoTier(v.nho);
      return { van: v.van, nho: v.nho, mach: v.mach, tier: t, nhoTier: n, machName: nat.machName(v.mach), de: v.de, tai: v.tai, low: e ? e.low : 0, falls: e ? e.falls : 0, hist: e ? e.hist : [], khoaAt: e ? e.khoaAt : 0, taKhi: nat.taKhi(x.region), init: v.init };
    },

    // ---------- ghi ----------
    S() { const f = TT.fac.S(); if (!f.nat) f.nat = {}; return f.nat; },
    ent(x) {
      const S = nat.S(); let e = S[x.id];
      if (!e) {
        const A = K.start;
        e = S[x.id] = { van: Math.round(A.van[0] + (A.van[1] - A.van[0]) * hn('van0', x.id)), nho: Math.round(A.nho[0] + (A.nho[1] - A.nho[0]) * hn('nho0', x.id)), mach: K.mach[x.region] != null ? K.mach[x.region] : 2, de: 50, tai: 50, lead: null, low: 0, falls: 0, vt: null, vtAt: -9999, khoaAt: 0, hist: [] };
        e.vt = nat.tier(e.van).id;
      }
      return e;
    },
    // Tính đức và tài của người đứng đầu từ tên (xác định); đổi người thì tính lại.
    leader(x, e) {
      if (e.lead === x.leader) return;
      e.lead = x.leader;
      e.de = Math.round(20 + 60 * hn('de', x.id, x.leader)); e.tai = Math.round(20 + 60 * hn('tai', x.id, x.leader));
    },
    note(e, kind, text) { e.hist.push({ m: TT.world.months, k: kind, t: text }); while (e.hist.length > K.mat.histMax) e.hist.shift(); },

    // Một năm cho cả chín triều. Gọi sau TT.pop.yearly() và trước tickInternal.
    yearly() {
      if (!K.on) return;
      TT.fac.list('trieu').forEach(x => { if (TT.fac.alive(x)) nat.step(x); });
    },
    step(x) {
      const f = TT.fac.S(), w = TT.world, e = nat.ent(x), g = TT.pop.get(x.region), yn = Math.floor(w.months / 12), era = f.era.id;
      nat.leader(x, e);
      const V = K.van, N = K.nho, war = !!x.war, front = TT.fac.atFront(x.region);
      const shocks = Math.min(V.shockMax, TT.pop.shocksAt(x.region).length);
      const defy = Math.min(V.defyMax, (f.pacts || []).filter(p => p.b === x.id && p.defy).length);
      // quốc vận
      const target = V.base + V.mood * (g.mood - V.moodMid) + V.nho * (e.nho - V.nhoMid) + V.mach * (e.mach - V.machMid) + V.lead * (e.de + e.tai - V.leadMid);
      let dv = (target - e.van) * V.pull + (war ? V.war : 0) + (front ? V.front : 0) + (g.riot ? V.riot : 0) + shocks * V.shock + defy * V.defy + (V.era[era] || 0) + TT.faith.vanDelta(x) + TT.court.vanDelta(x) + (hn('vn', x.id, yn) - 0.5) * 2 * V.noise;
      e.van = clamp(e.van + dv, 0, 100);
      // nho khí
      const nt = N.base + N.lead * (e.tai - 50) + N.mood * (g.mood - V.moodMid);
      let dn = (nt - e.nho) * N.pull + (war ? N.war : 0) + (g.riot ? N.riot : 0) + (g.food < N.hungerBelow ? N.hunger : 0) + (N.era[era] || 0) + (hn('nn', x.id, yn) - 0.5) * 2 * N.noise;
      if ((yn + Math.floor(hn('khoa', x.id) * N.khoa.every)) % N.khoa.every === 0 && !war && !g.riot) { dn += N.khoa.gain; e.khoaAt = yn; }
      e.nho = clamp(e.nho + dn, 0, 100);
      // báo tin khi vào bậc Rồng bay hoặc Mạt (cách nhau ít nhất 12 năm để không làm ngập sử ký)
      const t = nat.tier(e.van), pl = TT.player(), near = !!(pl && pl.region === x.region);
      if (t.id !== e.vt) {
        if ((t.id === 'rong_bay' || t.id === 'mat') && yn - e.vtAt >= 12) {
          e.vtAt = yn;
          TT.fac.chron(t.id === 'rong_bay' ? x.n + ' đang lúc quốc vận như rồng bay, quốc thái dân an.' : x.n + ' quốc vận đã tới lúc cùng mạt, lòng dân ly tán, e rằng sắp mất mệnh.', t.id === 'rong_bay' ? 'good' : 'bad', near || t.id === 'mat');
        }
        e.vt = t.id;
      }
      // thiên mệnh
      if (e.van < K.mat.below) e.low++; else e.low = 0;
      if (e.low >= K.mat.years) nat.fall(x, e);
    },
    // Mất mệnh: đổi chủ, chia cắt hoặc bị thôn tính. Thế giới luôn đủ chín triều có chủ (triều không bao giờ bị xóa).
    fall(x, e) {
      const M = K.mat, f = TT.fac;
      const cand = f.list('trieu').filter(y => y !== x && f.alive(y) && !y.vassal && y.power > x.power && f.near(x, y)).sort((a, b) => b.power - a.power)[0] || null;
      const w = { doi_chu: M.w.doi_chu, chia_cat: M.w.chia_cat, thon_tinh: cand ? M.w.thon_tinh : 0 };
      let r = hn('fall', x.id, TT.world.months) * (w.doi_chu + w.chia_cat + w.thon_tinh), kind = 'doi_chu';
      if ((r -= w.doi_chu) >= 0) kind = (r -= w.chia_cat) < 0 ? 'chia_cat' : 'thon_tinh';
      const old = x.leader, pl = TT.player(), near = !!(pl && pl.region === x.region);
      let text;
      if (kind === 'thon_tinh') {
        x.power = clamp(x.power * M.annexPower, 1, 100); x.unity = M.annexUnity; x.vassal = cand.id;
        x.leader = TT.genName('nam'); x.leaderAge = 40;
        TT.pact.vassalize(x, cand);
        const c = nat.ent(cand); c.van = clamp(c.van + 5, 0, 100);
        text = x.n + ' mất mệnh trời, bị ' + cand.n + ' thôn tính; ' + x.leader + ' phải thần phục làm chư hầu.';
      } else if (kind === 'chia_cat') {
        x.power = clamp(x.power * M.cutPower, 1, 100); x.unity = Math.min(x.unity, M.cutUnity); x.wealth = clamp(x.wealth * M.cutWealth, 0, 100);
        const g = TT.pop.get(x.region); if (g) g.mood = clamp(g.mood - M.cutMood, 0, 100);
        x.leader = TT.genName('nam'); x.leaderAge = 40;
        text = x.n + ' mất mệnh trời, đất nước chia cắt: một nửa cát cứ tự xưng, triều đình chỉ còn giữ được ' + x.leader + ' cùng nửa giang sơn.';
      } else {
        x.power = 35; x.unity = 40; x.leader = TT.genName('nam'); x.leaderAge = 40; x.tag = rng.pick(['chinh', 'trung', 'ta']);
        text = x.n + ' mất mệnh trời, ' + old + ' bị phế truất. Người cầm quyền mới là ' + x.leader + '.';
        TT.sectmod.rulerChanged(x);
      }
      x.state = 'suy';
      e.van = M.vanAfter[kind]; e.nho = clamp(e.nho - M.nhoLoss, 0, 100); e.low = 0; e.falls++; e.vt = nat.tier(e.van).id; e.vtAt = Math.floor(TT.world.months / 12);
      TT.army.onFall(x, e); // quân tan rã một phần (S6a)
      TT.court.onRuler(x); // hoàng quyền về mức người mới, thái tử chưa lập (S7)
      nat.note(e, kind, text);
      TT.fac.chron(text, 'bad', true);
      if (pl && near) TT.log(pl, 'Thiên mệnh đã đổi: ' + text, 'big');
    },
    // Gọi từ endWar khi một triều thua hoặc thắng trận.
    onWarEnd(win, lose) {
      if (!K.on) return;
      const V = K.van;
      if (win.kind === 'trieu') { const e = nat.ent(win); e.van = clamp(e.van + V.winGain, 0, 100); }
      if (lose.kind === 'trieu') {
        const e = nat.ent(lose); e.van = clamp(e.van - V.loseLoss, 0, 100); e.nho = clamp(e.nho - 2, 0, 100);
        nat.note(e, 'bai', 'Bại trận trước ' + win.n + '.');
      }
    },
    // Phản phệ khi tu sĩ c gây họa cho phàm triều ở vùng rid (kind: giet_vua, danh_tan_quan, tan_sat, pha_long_mach); mag 0,2 đến 2.
    // Mức tỉ lệ với quốc vận nước đó, có trần; nước vận Mạt gần như hết phản phệ. Việc gây họa cũng làm quốc vận (và long mạch) giảm.
    backlash(c, rid, kind, mag) {
      const B = K.backlash, def = B.kinds[kind], x = trieuOf(rid); if (!def || !c || !x) return null;
      mag = clamp(mag == null ? 1 : mag, 0.2, 2);
      const e = nat.ent(x), sc = nat.scale(e.van), w = TT.world;
      const out = { nghiep: Math.min(B.cap.nghiep, Math.round(def.nghiep * mag * sc)), dao: Math.min(B.cap.dao, Math.round(def.dao * mag * sc)), brk: Math.min(B.cap.brk, r1(def.brk * mag * sc * 100) / 100) };
      c.nghiep = (c.nghiep || 0) + out.nghiep; c.daoTam = clamp((c.daoTam == null ? 50 : c.daoTam) - out.dao, 0, 100);
      c.flags = c.flags || {};
      const old = c.flags.phanPhe && c.flags.phanPhe.until > w.months ? c.flags.phanPhe.brk : 0;
      c.flags.phanPhe = { until: w.months + B.years * 12, brk: Math.min(B.cap.brk, r1((old + out.brk) * 100) / 100) };
      e.van = clamp(e.van - (B.vanHit[kind] || 0) * mag, 0, 100);
      if (B.machHit[kind]) e.mach = clamp(e.mach - B.machHit[kind], 0, 5);
      nat.note(e, 'phan_phe', 'Có tu sĩ ' + def.n + ' ở ' + regName(rid) + '.');
      if (out.nghiep || out.dao) TT.log(c, 'Phản phệ quốc vận: ' + def.n + ' ở ' + regName(rid) + ' khiến nghiệp +' + out.nghiep + ', đạo tâm -' + out.dao + ', đột phá khó hơn ' + Math.round(out.brk * 100) + '% trong ' + B.years + ' năm.', 'bad');
      return out;
    },
    // Chuộc tội bằng việc thiện hoặc tế lễ: giảm nghiệp, rút ngắn thời gian khó đột phá.
    atone(c) {
      const B = K.backlash.atone; if (!c) return null;
      const before = c.nghiep || 0; c.nghiep = Math.max(0, before - B.nghiep);
      const p = c.flags && c.flags.phanPhe; if (p) p.until = Math.max(TT.world.months, p.until - B.years * 12);
      return { nghiep: before - c.nghiep };
    },
    setVan(c, n) { c.van = clamp(n | 0, 0, K.vanVi.length - 1); }
  };
})();
