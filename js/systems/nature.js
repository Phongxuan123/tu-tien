// Tính cách bốn trục của người chơi (Q 6, Z "Đặc tả 8A"). Chỉ người chơi có c.nature; NPC giữ nhãn cũ và chỉ có hàm ánh xạ đọc.
// Quy tắc: hàm đọc không gọi rng và không khởi tạo dữ liệu (ensure/shift mới ghi); bốc lúc sinh bằng băm, không đụng rng.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data;
  const N = () => D.NATURE;
  const IDS = ['tinh', 'xuthe', 'daoduc', 'tudung'];
  const on = c => !!(c && c.kind === 'player' && N().on);
  const r2 = v => Math.round(v * 100) / 100;

  // Băm chuỗi (FNV-1a) và bộ số giả ngẫu nhiên riêng (mulberry32): hoàn toàn tách khỏi TT.rng.
  function hash(str) { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function mk(seed) {
    let a = seed | 0;
    return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const worldSeed = () => (TT.world && TT.world.seed != null ? TT.world.seed : 0);

  // Bốc bốn trục từ (hạt giống thế giới, id, muối): mỗi trục trong ±roll.max, dồn nhẹ về giữa, ít nhất minAxes trục có |v| ≥ minAbs.
  function rollVec(seed, id, salt) {
    const K = N().roll, r = mk(hash(seed + ':' + id + ':' + (salt || 0) + ':nature'));
    const v = IDS.map(() => Math.round(((r() * 2 - 1) + (r() * 2 - 1)) / 2 * K.max));
    const sgn = IDS.map(() => (r() < 0.5 ? -1 : 1)), extra = IDS.map(() => Math.floor(r() * 3));
    const order = IDS.map((x, i) => i).sort((a, b) => Math.abs(v[b]) - Math.abs(v[a]) || a - b);
    for (let k = 0; k < K.minAxes; k++) {
      const i = order[k];
      if (Math.abs(v[i]) < K.minAbs) v[i] = (v[i] !== 0 ? Math.sign(v[i]) : sgn[i]) * Math.min(K.max, K.minAbs + extra[i]);
    }
    const o = {}; IDS.forEach((x, i) => { o[x] = v[i]; }); return o;
  }
  // Nhãn cũ → bốn trục (Q 6.8); jit = có dịch thêm theo băm (bản lưu cũ của người chơi).
  function legacyVec(personality, jit, seed, id) {
    const o = { tinh: 0, xuthe: 0, daoduc: 0, tudung: 0 }, L = N().legacy[personality];
    if (L) Object.keys(L).forEach(k => { o[k] = L[k]; });
    if (jit) { const r = mk(hash(seed + ':' + id + ':legacy')), J = N().legacyJitter; IDS.forEach(k => { o[k] = Math.max(-N().max, Math.min(N().max, o[k] + Math.round((r() * 2 - 1) * J))); }); }
    return o;
  }
  // Suy nhãn cũ từ bốn trục: nhãn có véc-tơ gần nhất; trục lệch nhất dưới legacyMin thì "Bình thường".
  function legacyLabel(v) {
    if (Math.max.apply(null, IDS.map(k => Math.abs(v[k]))) < N().legacyMin) return 'trung_lap';
    let best = 'trung_lap', bd = Infinity;
    Object.keys(N().legacy).forEach(id => {
      const p = legacyVec(id, false); let d = 0; IDS.forEach(k => { d += (v[k] - p[k]) * (v[k] - p[k]); });
      if (d < bd) { bd = d; best = id; }
    });
    return best;
  }
  function bandIdx(v) {
    const r = Math.round(v), C = N().cut;
    return r <= C[0] ? 0 : r <= C[1] ? 1 : r < C[2] ? 2 : r < C[3] ? 3 : 4;
  }
  const axisOf = id => N().axes.find(a => a.id === id);

  const nat = TT.nature = {
    IDS,
    rollVec, legacyVec, legacyLabel, bandIdx,

    // Giá trị bốn trục (đọc thuần: chưa có c.nature thì suy ra, không lưu).
    get(c, ax) {
      let v = c.nature;
      if (!v) v = c.kind === 'player' ? (c.personality === 'trung_lap' ? rollVec(worldSeed(), c.id, 0) : legacyVec(c.personality, true, worldSeed(), c.id)) : legacyVec(c.personality, false);
      return ax ? v[ax] : v;
    },
    // Khởi tạo muộn cho người chơi (bản lưu cũ, người kế thừa, người vừa sinh). salt: muối của lần bốc (trạng thái rng lúc sinh, chỉ đọc).
    ensure(c, salt) {
      if (!on(c)) return null;
      if (!c.nature) {
        c.nature = c.personality === 'trung_lap' ? rollVec(worldSeed(), c.id, salt || 0) : legacyVec(c.personality, true, worldSeed(), c.id);
        c.natureLog = c.natureLog || [];
        c.personality = legacyLabel(c.nature);
      }
      return c.nature;
    },
    band(c, ax) { return bandIdx(nat.get(c, ax)); },
    label(c, ax) { return axisOf(ax).bands[nat.band(c, ax)]; },
    // Nhãn gọn: hai trục lệch nhất (từ 3 trở lên), ví dụ "Nóng nảy, cương trực".
    summary(c) {
      const v = nat.get(c), pick = IDS.filter(k => Math.abs(Math.round(v[k])) >= N().roll.minAbs).sort((a, b) => Math.abs(v[b]) - Math.abs(v[a])).slice(0, 2);
      if (!pick.length) return 'Trung dung';
      const w = pick.map(k => (v[k] < 0 ? axisOf(k).lo : axisOf(k).hi));
      return w[0] + (w[1] ? ', ' + w[1].toLowerCase() : '');
    },
    // Danh sách để vẽ: { id, n, v, band, label, recent (vừa đổi trong recentMonths) }.
    rows(c) {
      const v = nat.get(c), m = TT.world ? TT.world.months : 0, lg = c.natureLog || [];
      return N().axes.map(a => ({ id: a.id, n: a.n, lo: a.lo, hi: a.hi, v: v[a.id], band: bandIdx(v[a.id]), label: a.bands[bandIdx(v[a.id])], recent: lg.some(e => e.ax === a.id && e.m >= m - N().recentMonths) }));
    },

    // Dịch một trục có quán tính (đi tiếp vào dải cực chậm hơn, đạo tâm, cảnh giới, tuổi cao) và trần mỗi năm. Trả về mức dịch thật.
    shift(c, ax, d, why, big) {
      if (!on(c) || !d || IDS.indexOf(ax) < 0) return 0;
      const K = N(), n = nat.ensure(c), cur = n[ax], w = TT.world;
      let k = 1;
      if (Math.abs(cur) >= -K.cut[0] && Math.sign(d) === Math.sign(cur)) k *= K.extremeMul;
      k *= 1 - Math.max(0, (c.daoTam - 50)) / 250;
      k *= 1 - 0.04 * Math.min(c.realm, 5);
      if (TT.age(c) > 60) k *= 0.85;
      d *= k;
      const yr = Math.floor(w.months / 12), free = big === 'free'; // 'free': tuổi thơ (8A3), không tính trần năm và không ghi nhật ký đổi dải từng lần
      if (!c.natureYr || c.natureYr.y !== yr) c.natureYr = { y: yr };
      const cap = big ? K.bigCap : K.yearCap, used = c.natureYr[ax] || 0;
      if (!free) d = Math.max(-cap, Math.min(cap, used + d)) - used;
      const nv = Math.max(-K.max, Math.min(K.max, cur + d));
      d = nv - cur;
      if (Math.abs(d) < 0.01) return 0;
      if (!free) c.natureYr[ax] = used + d;
      const b0 = bandIdx(cur);
      n[ax] = r2(nv);
      const b1 = bandIdx(n[ax]);
      c.natureLog = c.natureLog || [];
      c.natureLog.push({ m: w.months, ax, d: r2(d), why: why || '' });
      if (c.natureLog.length > K.logCap) c.natureLog.splice(0, c.natureLog.length - K.logCap);
      c.personality = legacyLabel(n);
      if (b1 !== b0 && !free) {
        const a = axisOf(ax);
        TT.log(c, 'Tính cách đổi: ' + a.n + ' của ' + (d > 0 ? a.up : a.down) + ', nay là "' + a.bands[b1] + '".', 'age');
      }
      return r2(d);
    },
    // Lựa chọn của người chơi dịch trục theo kind (bảng D.NATURE.kindAx); ch.ax (nếu có) đè bảng.
    shiftKind(c, kind, why, big) {
      if (!on(c)) return;
      const m = N().kindAx[kind]; if (!m) return;
      Object.keys(m).forEach(k => nat.shift(c, k, m[k] * N().dailyMul, why || kind, big));
    },

    // Độ hợp tính cách của một lựa chọn { kind, ax? }: 1 là trung tính; hợp thì lên đến 1 + aff, trái thì xuống 1 / (1 + aff).
    affinity(c, choice) {
      const dir = (choice && choice.ax) || (choice && N().kindAx[choice.kind]);
      if (!dir) return 1;
      const v = nat.get(c); let s = 0, t = 0;
      Object.keys(dir).forEach(k => { s += v[k] / N().max * dir[k]; t += Math.abs(dir[k]); });
      s = t ? s / t : 0;
      return s >= 0 ? 1 + N().aff * s : 1 / (1 + N().aff * -s);
    },
    // Tác động số nhỏ, trần ±10% ở đầu cực: bold nhân vào độ liều; tamMa cộng vào xác suất đối mặt tâm ma thành công.
    mods(c) {
      if (!on(c)) return { bold: 1, tamMa: 0 };
      const v = nat.get(c), K = N().mod, M = N().max;
      return { bold: 1 - K.bold * v.tinh / M, tamMa: K.tamMa * (v.tinh + v.tudung) / (2 * M) };
    },

    // Phân điểm chỉnh: ngân sách pts điểm cộng/trừ; trả về vec mới (không đổi vec cũ). Máy phân vào trục lệch nhất, tràn sang trục kế.
    autoAlloc(vec, pts) {
      const o = Object.assign({}, vec); let left = pts == null ? N().budget : pts;
      const order = IDS.slice().sort((a, b) => Math.abs(o[b]) - Math.abs(o[a]) || IDS.indexOf(a) - IDS.indexOf(b));
      for (let i = 0; i < order.length && left > 0; i++) {
        const k = order[i], s = o[k] < 0 ? -1 : 1, room = N().max - Math.abs(o[k]), take = Math.min(room, left);
        o[k] += s * take; left -= take;
      }
      return o;
    },
    // Đặt bốn trục cho người chơi (hộp "Đời mới"): cập nhật nhãn cũ.
    set(c, vec) {
      if (!on(c)) return;
      nat.ensure(c);
      IDS.forEach(k => { c.nature[k] = Math.max(-N().max, Math.min(N().max, Math.round(vec[k]))); });
      c.personality = legacyLabel(c.nature);
    }
  };
})();
