// Tín ngưỡng (S5, ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 8). Lưu ở world.fac.faith = { v, slots: { vùng: [ { chinh, long, share } x3 ] }, pend: { vùng: { tín ngưỡng: sức ép } },
// church: { tín ngưỡng: { luc, huong, ky, phai: [ { k, n, m } ] } }, lord: { id triều hoặc tông: { faith, khoan } }, hist: [ { m, k, t } ] }.
// Mỗi vùng có đúng ba ô, ô = tín ngưỡng chính + tối đa một tục lồng tương thích; Thiên Chúa giáo và Hồi giáo độc chiếm ô; tỉ phần ba ô cộng lại bằng 1 và xếp giảm dần (ô 1 mạnh nhất).
// Nơi thờ tự (`tho_tu`): ba nơi mỗi vùng ứng với ba ô, đăng ký vào bản đồ lúc chạy (TT.map.syncSites), không lưu; thứ hạng ô đổi thì đại điện đổi chủ.
//
// QUY TẮC (S mục 15.2): hàm ĐỌC không gọi rng và không khởi tạo dữ liệu (chưa có thì trả mặc định suy ra xác định). Nhiễu và quyết định ngẫu nhiên lấy từ băm (hạt giống, năm, id),
// không dùng rng, nên bật/tắt không làm lệch dòng số ngẫu nhiên. D.FAITH.on = false làm cả hệ thống đứng yên (không có nơi thờ tự, mọi móc trả 0), thế giới trùng khít đường cơ sở cũ.
// Trường mới khởi tạo muộn, không đổi TT.VERSION. Viết tôn trọng: tín ngưỡng là cơ chế xã hội, kẻ cực đoan chỉ là một cá nhân hoặc một phái.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, K = D.FAITH, F = D.FAITHS, hn = (...a) => TT.nation.hn(...a);
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const byId = {}; F.forEach(f => { byId[f.id] = f; });
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const REL = ['phat', 'an_do', 'dao_giao', 'than_dao'];          // tôn giáo thể chế: chịu thế tục hóa khi nho khí cao
  const SEC = ['nho', 'to_tien'];                                  // vững thêm khi nho khí cao
  const trieuOf = rid => TT.fac.list('trieu').find(t => t.region === rid) || null;
  const word = (list, v) => (list.find(x => v >= x.min) || list[list.length - 1]).n;
  const pre = () => (TT.world && TT.world.fac && TT.world.fac.faith) || null;

  // Ba ô khởi đầu của một vùng: từ D.FAITH_START với biến thiên theo hạt giống (băm, không rng). Dùng cho cả khởi tạo lẫn đọc khi chưa có dữ liệu.
  function initSlots(rid) {
    const st = D.FAITH_START[rid], A = K.start;
    let sh = st.map((s, i) => A.base[i] * (1 + (hn('fs', rid, i) - 0.5) * 2 * A.jitter));
    const tot = sh.reduce((a, b) => a + b, 0); sh = sh.map(v => v / tot);
    const slots = st.map((s, i) => ({ chinh: s.chinh, long: s.long || null, share: sh[i] }));
    const used = {}; slots.forEach(s => { used[s.chinh] = 1; if (s.long) used[s.long] = 1; });
    slots.forEach((s, i) => {
      if (s.long && hn('fdl', rid, i) < A.dropLong) { delete used[s.long]; s.long = null; }
      else if (!s.long && !byId[s.chinh].docQuyen && hn('fal', rid, i) < A.addLong) {
        const cand = byId[s.chinh].long.filter(x => !used[x] && !byId[x].docQuyen);
        if (cand.length) { s.long = cand[Math.floor(hn('fac', rid, i) * cand.length)]; used[s.long] = 1; }
      }
    });
    return slots.sort((a, b) => b.share - a.share);
  }
  // Chuẩn hóa ba ô: mỗi ô tối thiểu minShare, tổng đúng bằng 1 (các ô còn lại co giãn theo tỉ lệ).
  function normalize(sl) {
    let low = {};
    for (let k = 0; k < 3; k++) {
      const free = sl.filter((x, i) => !low[i]), fixed = Object.keys(low).length * K.minShare, tot = free.reduce((a, b) => a + Math.max(0, b.share), 0);
      let again = false;
      sl.forEach((x, i) => { if (low[i]) { x.share = K.minShare; return; } x.share = tot > 0 ? Math.max(0, x.share) / tot * (1 - fixed) : (1 - fixed) / free.length; if (x.share < K.minShare) { low[i] = 1; again = true; } });
      if (!again) break;
    }
    sl.forEach((x, i) => { if (low[i]) x.share = K.minShare; });
    const t2 = sl.reduce((a, b) => a + b.share, 0); sl.forEach(x => { x.share /= t2; });
  }
  const khoanTarget = (id, faith, nho) => clamp(K.khoan.base + (faith && byId[faith] && byId[faith].docQuyen ? K.khoan.docQuyen : 0) + K.khoan.nho * (nho - 50) + (hn('fk', id) - 0.5) * 2 * K.khoan.noise, K.khoan.min, K.khoan.max);

  const faith = TT.faith = {
    byId,
    // ---------- đọc (không rng, không khởi tạo) ----------
    peek: pre,
    slotsOf(rid) { const s = pre(); return s && s.slots[rid] ? s.slots[rid] : initSlots(rid); },
    church(fid) { const s = pre(), c = s && s.church[fid]; return c || { luc: 50, huong: 30, ky: Math.round((K.church.kyInit[0] + K.church.kyInit[1]) / 2), phai: [] }; },
    // Quốc giáo và khoan dung của một triều hoặc tông.
    lord(x) {
      const s = pre(), e = s && s.lord[x.id]; if (e) return e;
      if (x.kind === 'trieu') return { faith: faith.slotsOf(x.region)[0].chinh, khoan: Math.round(khoanTarget(x.id, faith.slotsOf(x.region)[0].chinh, 50)) };
      const d = K.sect[x.id]; return d ? { faith: d[0], khoan: d[1] } : { faith: null, khoan: 50 };
    },
    // Tỉ phần của một tín ngưỡng trong vùng (tính cả tục lồng chung ô).
    shareOf(fid, rid) {
      let v = 0;
      faith.slotsOf(rid).forEach(s => { if (s.chinh === fid) v += s.share * (s.long ? 1 - K.longShare : 1); else if (s.long === fid) v += s.share * K.longShare; });
      return v;
    },
    inRegion(fid, rid) { return faith.slotsOf(rid).some(s => s.chinh === fid || s.long === fid); },
    followers(fid) {
      let v = 0;
      D.REGIONS.forEach(r => { const g = TT.world.pop && TT.world.pop[r.id], n = g ? g.n : D.POP[r.id].n0; v += n * faith.shareOf(fid, r.id); });
      return v;
    },
    totalPop() { let v = 0; D.REGIONS.forEach(r => { const g = TT.world.pop && TT.world.pop[r.id]; v += g ? g.n : D.POP[r.id].n0; }); return v; },
    // Mức sùng đạo bình quân của vùng 0..1 (theo sức giáo hội).
    religiosity(rid) { let v = 0; faith.slotsOf(rid).forEach(s => { v += s.share * (0.5 + faith.church(s.chinh).luc / 200); }); return v; },
    word: (list, v) => word(list, v),
    lucWord: v => word(K.levels, v),
    khoanWord: v => word(K.khoanWords, v),
    // Thứ hạng giáo hội theo sức mạnh (mạnh nhất trước).
    ranking() { return F.map(f => ({ id: f.id, luc: faith.church(f.id).luc })).sort((a, b) => b.luc - a.luc || (a.id < b.id ? -1 : 1)); },

    // Móc nhỏ có trần: dân tâm đỡ tụt khi thiên tai (cộng mỗi năm).
    moodSupport(rid) {
      if (!K.on || !pre()) return 0;
      const g = TT.world.pop && TT.world.pop[rid]; if (!g) return 0;
      const crisis = faith.crisis(rid);
      return crisis > 0 ? Math.min(K.hook.moodCap, K.hook.mood * faith.religiosity(rid) * crisis * 2) : 0;
    },
    crisis(rid) {
      const g = TT.world.pop && TT.world.pop[rid]; if (!g) return 0;
      const sh = TT.world.fac ? (TT.world.fac.shocks || []).filter(s => s.region === rid && s.until > TT.world.months && (s.kind === 'han' || s.kind === 'lu' || s.kind === 'dich')).length : 0;
      return clamp(Math.max(0, (45 - g.mood) / 45) + 0.5 * sh, 0, 1.5);
    },
    // Quốc giáo hợp lòng dân cộng nhẹ ổn định nội bộ của triều; đàn áp nặng trừ nhẹ (cộng mỗi năm vào đoàn kết).
    stab(x) {
      if (!K.on || !pre() || x.kind !== 'trieu') return 0;
      const L = faith.lord(x), sh = L.faith ? faith.shareOf(L.faith, x.region) : 0;
      let v = K.hook.stab * (Math.min(1, sh / 0.4) - K.hook.mid);
      const pe = faith.persecuted(x); if (pe > 0) v -= K.hook.stab * 0.8 * pe;
      return clamp(v, -K.hook.stabCap, K.hook.stabCap);
    },
    // Mức đàn áp 0..1: triều khoan dung thấp mà phần lớn dân theo tín ngưỡng khác quốc giáo.
    persecuted(x) {
      const L = faith.lord(x), S = K.shift; if (L.khoan >= S.persecBelow || !L.faith) return 0;
      let other = 0; faith.slotsOf(x.region).forEach(s => { if (s.chinh !== L.faith && s.long !== L.faith) other += s.share; });
      return clamp((S.persecBelow - L.khoan) / S.persecBelow * Math.min(1, other / 0.5), 0, 1);
    },
    // Quốc giáo hợp lòng dân cộng quốc vận (nối S3), đàn áp trừ.
    vanDelta(x) {
      if (!K.on || !pre() || x.kind !== 'trieu') return 0;
      const L = faith.lord(x), sh = L.faith ? faith.shareOf(L.faith, x.region) : 0;
      return clamp(K.hook.van * (Math.min(1, sh / 0.4) - K.hook.vanMid) - K.hook.van * faith.persecuted(x), -K.hook.vanCap, K.hook.vanCap);
    },

    // ---------- tín ngưỡng cá nhân (c.faith, c.tam), đọc suy ra khi chưa có ----------
    personal(c) {
      if (c && c.faith !== undefined) return { faith: c.faith, tam: c.tam | 0, set: true };
      const sl = faith.slotsOf(c.region), r = hn('pf', c.id), r2 = hn('pt', c.id);
      let acc = 0, pick = sl[0];
      for (const s of sl) { acc += s.share; if (r * 1 <= acc) { pick = s; break; } }
      const fid = pick.long && hn('pl', c.id) < K.longShare ? pick.long : pick.chinh;
      return { faith: fid, tam: r2 < K.tamStart[0] ? 0 : r2 < K.tamStart[1] ? 1 : 2, set: false };
    },
    tamName: t => K.tam[clamp(t | 0, 0, 2)],
    phuc(c) { const p = faith.personal(c), f = p.faith && byId[p.faith]; return f ? Math.min(f.phuc.tran, f.phuc.heSo * (p.tam | 0)) : 0; },
    // Hai người khác tín ngưỡng? (cờ hôn nhân khác đạo cho chặng R, chưa có hộp quyết định)
    mixed(a, b) {
      const pa = faith.personal(a), pb = faith.personal(b);
      return { mixed: !!pa.faith && !!pb.faith && pa.faith !== pb.faith, a: pa.faith, b: pb.faith, mono: !!((pa.faith && byId[pa.faith].docQuyen) || (pb.faith && byId[pb.faith].docQuyen)) };
    },
    // Nơi thờ tự gần nhất trong vùng (gợi ý cho giao diện).
    hint(c) {
      if (!c || !c.place || c.travel || c.cross || c.dungeon) return '';
      const here = TT.map.place(c.place); if (!here) return '';
      if (here.type === 'tho_tu') return '';
      let best = null;
      TT.map.placesOf(c.region).forEach(p => { if (p.type !== 'tho_tu') return; const rt = TT.map.localRoute(c.place, p.id); if (rt && (!best || rt.months < best.m || (rt.months === best.m && p.rank < best.p.rank))) best = { p, m: rt.months }; });
      return best ? 'Nơi thờ tự gần đây: ' + best.p.n + ' (cách ' + best.m + ' tháng đường).' : '';
    },
    // Tên và nội dung các nơi thờ tự của một vùng theo ô hiện có (không đăng ký gì).
    siteDefs(rid) {
      const reg = TT.map.region(rid), sl = faith.slotsOf(rid), anchors = [];
      K.site.anchorTypes.forEach(t => TT.map.placesOf(rid).forEach(p => { if (p.type === t && !p.site) anchors.push(p.id); }));
      const seen = {};
      return sl.map((s, i) => {
        const f = byId[s.chinh]; let n;
        if (i === 0) n = cap(f.noiTho) + ' lớn ' + reg.n;
        else { n = cap(f.tuDong) + ' ' + reg.n; seen[f.tuDong] = (seen[f.tuDong] || 0) + 1; if (seen[f.tuDong] > 1) n += ' (phụ)'; }
        return { id: 'tt_' + rid + '_' + (i + 1), region: rid, n, faith: s.chinh, rank: i + 1, anchor: anchors.length ? anchors[i % anchors.length] : null };
      }).filter(d => d.anchor);
    },
    // Mô tả một vùng cho giao diện.
    view(rid) {
      const sl = faith.slotsOf(rid), tr = trieuOf(rid), L = tr ? faith.lord(tr) : null, sd = faith.siteDefs(rid);
      return { slots: sl.map((s, i) => ({ rank: i + 1, chinh: s.chinh, long: s.long, share: s.share, site: (sd[i] || {}).n || '' })), lord: L, lordWord: L ? faith.khoanWord(L.khoan) : '' };
    },

    // ---------- ghi ----------
    S() {
      const f = TT.fac.S(); if (!f.faith) faith.init(f);
      return f.faith;
    },
    init(f) {
      const s = f.faith = { v: 1, slots: {}, pend: {}, church: {}, lord: {}, hist: [] };
      D.REGIONS.forEach(r => { s.slots[r.id] = initSlots(r.id); s.pend[r.id] = {}; });
      F.forEach(x => { s.church[x.id] = { luc: Math.round(35 + 30 * hn('fl', x.id)), huong: 30, ky: Math.round(K.church.kyInit[0] + (K.church.kyInit[1] - K.church.kyInit[0]) * hn('fy', x.id)), phai: [] }; });
      TT.fac.list('trieu').forEach(t => { const top = s.slots[t.region][0].chinh; s.lord[t.id] = { faith: top, khoan: Math.round(khoanTarget(t.id, top, 50)) }; });
      Object.keys(K.sect).forEach(id => { s.lord[id] = { faith: K.sect[id][0], khoan: K.sect[id][1] }; });
      return s;
    },
    note(text, kind) { const s = faith.S(), h = s.hist; h.push({ m: TT.world.months, k: kind || '', t: text }); while (h.length > 12) h.shift(); },

    yearly() {
      if (!K.on) return;
      const s = faith.S(), w = TT.world, yn = Math.floor(w.months / 12), pl = TT.player();
      let changed = false;
      const persecuted = {};
      D.REGIONS.forEach(r => {
        const rid = r.id, sl = s.slots[rid], tr = trieuOf(rid), L = tr && s.lord[tr.id], g = TT.pop.get(rid), nho = tr ? TT.nation.view(tr).nho : 50, near = !!(pl && pl.region === rid);
        const crisis = faith.crisis(rid), S = K.shift, topBefore = sl[0].chinh;
        const sects = TT.fac.list('tong').filter(x => x.region === rid && TT.fac.alive(x));
        const secX = nho > S.secularFrom ? (nho - S.secularFrom) / (100 - S.secularFrom) : 0;
        const pe = tr ? faith.persecuted(tr) : 0;
        sl.forEach(sx => {
          const f = sx.chinh, ch = s.church[f], lucF = (ch.luc - 50) / 50;
          let d = S.mission * lucF + S.crisis * crisis * lucF + (hn('fn', rid, f, yn) - 0.5) * 2 * S.noise;
          if (L && (L.faith === f || L.faith === sx.long)) d += S.patron;
          sects.forEach(x => { const sl2 = s.lord[x.id]; if (sl2 && (sl2.faith === f || sl2.faith === sx.long)) d += S.sectPatron * clamp(x.power, 0, 100) / 60; });
          if (L && L.faith && L.faith !== f && L.faith !== sx.long && pe > 0) { d -= S.persec * pe; persecuted[f] = (persecuted[f] || 0) + 1; }
          if (secX > 0) { if (SEC.indexOf(f) >= 0) d += 0.5 * S.secular * secX; else if (REL.indexOf(f) >= 0 || byId[f].docQuyen) d -= S.secular * secX; }
          sx.share += d + S.revert * (1 / 3 - sx.share);
        });
        // tín ngưỡng mới vào
        const used = {}; sl.forEach(sx => { used[sx.chinh] = 1; if (sx.long) used[sx.long] = 1; });
        const E = K.entry, pend = s.pend[rid] || (s.pend[rid] = {});
        const nb = TT.map.macroNeighbors(rid);
        F.forEach(f => {
          if (used[f.id]) { delete pend[f.id]; return; }
          let p = 0; nb.forEach(n => { p += faith.shareOf(f.id, n.to); });
          p = E.k * p * s.church[f.id].luc / 60 + (hn('fe', rid, f.id, yn) - 0.5) * 2 * E.noise;
          const v = (pend[f.id] || 0) * E.decay + Math.max(0, p);
          if (v > 0.002) pend[f.id] = v; else delete pend[f.id];
        });
        let best = null; Object.keys(pend).forEach(f => { if (!best || pend[f] > pend[best] || (pend[f] === pend[best] && f < best)) best = f; });
        const weak = sl.reduce((a, b) => (b.share < a.share ? b : a), sl[0]);
        if (best && pend[best] >= Math.max(E.min, weak.share * E.ratio)) {
          const fb = byId[best];
          const host = !fb.docQuyen && sl.find(sx => !sx.long && !byId[sx.chinh].docQuyen && byId[sx.chinh].long.indexOf(best) >= 0);
          if (host && hn('fj', rid, best, yn) < E.joinLong) {
            host.long = best; host.share += pend[best] * 0.3;
            const t = fb.n + ' hòa vào ' + byId[host.chinh].n + ' ở ' + r.n + ', tín đồ giữ cả hai nếp tu.';
            TT.fac.chron(t, 'age', false); faith.note(t, 'long');
          } else {
            const old = weak.chinh, ns = Math.max(weak.share, pend[best]);
            weak.chinh = best; weak.long = null; weak.share = ns;
            const t = fb.n + ' đã có chỗ đứng ở ' + r.n + '; ' + byId[old].n + ' chỉ còn những tín đồ rải rác, không còn là một trong ba nếp tu lớn của vùng.';
            TT.fac.chron(t, 'age', near); faith.note(t, 'day');
          }
          delete pend[best]; changed = true;
        }
        // chuẩn hóa: mỗi ô tối thiểu minShare, tổng bằng 1, xếp giảm dần
        normalize(sl);
        sl.sort((a, b) => b.share - a.share || (a.chinh < b.chinh ? -1 : 1));
        if (sl[0].chinh !== topBefore) {
          const t = 'Đại điện ' + r.n + ' đổi chủ: ' + byId[sl[0].chinh].n + ' nay đông tín đồ nhất vùng, ' + byId[topBefore].n + ' lùi xuống.';
          TT.fac.chron(t, 'age', near); faith.note(t, 'dai_dien'); changed = true;
        }
        if (g && !sl.every(sx => isFinite(sx.share))) throw new Error('tỉ phần tín ngưỡng không hợp lệ ở ' + rid);
      });
      // giáo hội: sức mạnh, hương hỏa, nghiêm giới, phái
      const tp = faith.totalPop();
      F.forEach(f => {
        const ch = s.church[f.id], C = K.church, fs = faith.followers(f.id) / tp;
        let state = 0; TT.fac.list('trieu').forEach(t => { if (s.lord[t.id] && s.lord[t.id].faith === f.id) state++; });
        const lucT = clamp(C.lucBase + C.lucFollow * fs + C.lucState * state, 5, 100);
        ch.luc = clamp(ch.luc + (lucT - ch.luc) * C.lucPull, 5, 100);
        ch.huong = clamp(ch.huong + (clamp(ch.luc * (0.5 + ch.ky / 200), 0, 100) - ch.huong) * C.huongPull, 0, 100);
        ch.ky = clamp(ch.ky + (persecuted[f.id] ? C.kyUp : -C.kyDown), C.kyMin, C.kyMax);
        const P = K.phai;
        if (ch.phai.length < P.max) {
          const reform = ch.ky > 65 && (TT.fac.list('trieu').reduce((a, t) => a + (s.lord[t.id] ? s.lord[t.id].khoan : 50), 0) / 9) > 60;
          const p = P.p * (1 + (persecuted[f.id] ? P.persecMul : 0)) * (reform ? 2 : 1) * (ch.luc > 60 ? 1.5 : 1);
          if (hn('fp', f.id, yn) < p) {
            let kind = persecuted[f.id] ? 'cuc_doan' : reform ? 'cai_cach' : 'phai', nm;
            if (kind === 'phai') { const un = f.phai.filter(x => !ch.phai.some(y => y.n === x.n)); if (!un.length) kind = 'cai_cach'; else nm = un[Math.floor(hn('fpn', f.id, yn) * un.length)].n; }
            if (kind !== 'phai') { nm = P[kind]; if (ch.phai.some(y => y.n === nm)) nm = null; }
            if (nm) {
              ch.phai.push({ k: kind, n: nm, m: w.months }); if (kind === 'cuc_doan') ch.ky = clamp(ch.ky + P.kyShift, C.kyMin, C.kyMax); if (kind === 'cai_cach') ch.ky = clamp(ch.ky - P.kyShift, C.kyMin, C.kyMax);
              const t = (kind === 'phai' ? 'Trong ' + f.n + ' nổi lên một nhánh riêng: ' + nm + '.' : kind === 'cai_cach' ? 'Trong ' + f.n + ' có tiếng nói đòi cải cách giáo luật, hình thành ' + nm.toLowerCase() + '.' : 'Trước sức ép, một bộ phận của ' + f.n + ' siết giới luật chặt hơn, thành ' + nm.toLowerCase() + '.');
              TT.fac.chron(t, 'age', false); faith.note(t, 'phai');
            }
          }
        }
      });
      // quốc giáo và khoan dung của triều
      TT.fac.list('trieu').forEach(t => {
        const L = s.lord[t.id] || (s.lord[t.id] = { faith: s.slots[t.region][0].chinh, khoan: 55 }), top = s.slots[t.region][0], nho = TT.nation.view(t).nho;
        if (L.faith !== top.chinh && L.faith !== top.long && hn('fsw', t.id, yn) < K.state.switchP) {
          const old = L.faith; L.faith = top.chinh; changed = true;
          const near = !!(pl && pl.region === t.region), tx = t.n + ' đổi quốc giáo sang ' + byId[top.chinh].n + (old ? ' (trước theo ' + byId[old].n + ')' : '') + '.';
          TT.fac.chron(tx, 'age', near); faith.note(tx, 'quoc_giao');
        }
        L.khoan = clamp(L.khoan + (khoanTarget(t.id, L.faith, nho) - L.khoan) * K.khoan.pull, K.khoan.min, K.khoan.max);
      });
      // thuế hương hỏa (E7a): một phần nhỏ hương hỏa của các ô nộp về kho triều vùng đó (không phân biệt quốc giáo)
      if (D.ECO && D.ECO.sx) D.REGIONS.forEach(r => {
        const tr = trieuOf(r.id); if (!tr || !TT.fac.alive(tr)) return;
        let v = 0; faith.slotsOf(r.id).forEach(sl => { v += sl.share * faith.church(sl.chinh).huong; });
        tr.wealth = clamp(tr.wealth + D.ECO.tithe.k * v, 0, 100);
      });
      faith.sync();
    },

    // Đăng ký ba nơi thờ tự mỗi vùng vào bản đồ (theo ô hiện có). Gọi khi tạo hoặc tải thế giới và sau khi ô đổi. Không dùng rng.
    sync() {
      const list = [];
      if (K.on || pre()) { faith.S(); D.REGIONS.forEach(r => faith.siteDefs(r.id).forEach(d => list.push(d))); }
      TT.map.syncSites(list);
    },

    // ---------- tín ngưỡng cá nhân: ghi ----------
    ensureChar(c) { if (c.faith === undefined) { const d = faith.personal(c); c.faith = d.faith; c.tam = d.tam; } return c; },
    // Theo (hoặc đổi sang) một tín ngưỡng; fid = null là thế tục. Đổi đạo là việc lớn: ghi cờ để các chặng sau tính quan hệ.
    convert(c, fid, tam) {
      const before = faith.personal(c);
      c.faith = fid; c.tam = fid ? clamp(tam == null ? 1 : tam, 0, 2) : 0; c.flags = c.flags || {};
      if (before.faith !== fid) c.flags.faithChanged = { from: before.faith, to: fid, m: TT.world.months };
      return c;
    },
    keepVow(c) {
      faith.ensureChar(c); c.flags = c.flags || {}; const g = c.flags.gioi || (c.flags.gioi = { kept: 0, broke: 0, at: -999 });
      if (!c.faith || c.tam < 1) return false;
      g.kept++;
      if (TT.world.months - g.at >= 12) { g.at = TT.world.months; c.daoTam = clamp((c.daoTam == null ? 50 : c.daoTam) + 1, 0, 100); return true; }
      return false;
    },
    breakVow(c) {
      faith.ensureChar(c); c.flags = c.flags || {}; const g = c.flags.gioi || (c.flags.gioi = { kept: 0, broke: 0, at: -999 });
      if (!c.faith || c.tam < 1) return false;
      g.broke++; c.daoTam = clamp((c.daoTam == null ? 50 : c.daoTam) - 2 * c.tam, 0, 100);
      c.flags.faithShun = { until: TT.world.months + K.service.shunMonths };      // cộng đồng xa lánh một thời gian (cờ dữ liệu)
      return true;
    },
    // Phật giáo cấm sát sinh: tín đồ (đã chọn đạo, tin sơ trở lên) giết người thì phạm giới. Chỉ tác động nhân vật đã có c.faith.
    onKill(c) { if (K.on && c.faith === 'phat' && c.tam >= 1) faith.breakVow(c); },
    markMixed(c, partner) { c.flags = c.flags || {}; const m = faith.mixed(c, partner); c.flags.faithMix = m.mixed ? { with: partner.id, m: TT.world.months, mono: m.mono } : null; return m; }
  };
})();
