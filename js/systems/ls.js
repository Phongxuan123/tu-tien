// Linh thạch: tiền tệ chính của giới tu hành, đồng thời hấp thụ được để tu luyện.
// Kho của nhân vật: c.gold (vàng, tiền lẻ của phàm gian, 10 vàng = 1 linh thạch hạ phẩm), c.ls (số linh thạch hạ phẩm),
// và linh thạch trung, thượng, cực phẩm nằm trong túi đồ (ls_trung, ls_thuong, ls_cuc; mỗi bậc gấp 100 lần bậc dưới).
// Mọi giá cả trong game vẫn tính bằng "đơn vị vàng"; ls.pay tự quy đổi nên NPC (chỉ có vàng) không bị ảnh hưởng.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng;

  D.LS = {
    RATE: 10,                                   // vàng cho 1 linh thạch hạ phẩm
    NAMES: ['hạ phẩm', 'trung phẩm', 'thượng phẩm', 'cực phẩm'],
    MUL: [1, 100, 10000, 1000000],              // giá trị theo hạ phẩm
    IDS: [null, 'ls_trung', 'ls_thuong', 'ls_cuc'],
    // Bậc linh thạch tối thiểu để hấp thụ trọn vẹn theo cảnh giới (0 phàm .. 6 phi thăng); thấp hơn thì hiệu quả giảm mạnh.
    NEED_TIER: [0, 0, 0, 1, 1, 2, 2],
    LOW_EFF: 0.35,                              // hiệu quả mỗi bậc thiếu hụt
    // Hiệu quả: bằng 50% Tụ Khí Đan trên cùng giá trị (Tụ Khí Đan 70 vàng cho 3% nhu cầu cảnh giới).
    ABSORB: 0.5 * 0.03 / 70 * 10,               // phần nhu cầu cảnh giới cho mỗi linh thạch hạ phẩm (khoảng 0,214%)
    AUTO_CAP: 0.5,                              // hấp thụ tự động mỗi tháng tối đa bằng 50% tu vi tháng đó
    MANUAL_CAP: 0.25,                           // hấp thụ tay: tối đa 25% nhu cầu cảnh giới mỗi lần
    MANUAL_COOL: 3                              // tháng nghỉ giữa hai lần hấp thụ tay
  };
  D.ITEMS.ls_trung = { n: 'Linh thạch trung phẩm', cat: 'ls', tier: 1, value: 1000, desc: 'Tiền tệ của đại tu sĩ, ẩn chứa linh khí đậm đặc. Bằng 100 hạ phẩm.' };
  D.ITEMS.ls_thuong = { n: 'Linh thạch thượng phẩm', cat: 'ls', tier: 2, value: 100000, desc: 'Báu vật hiếm gặp. Bằng 100 trung phẩm.' };
  D.ITEMS.ls_cuc = { n: 'Linh thạch cực phẩm', cat: 'ls', tier: 3, value: 10000000, desc: 'Gần như chỉ có trong truyền thuyết. Bằng 100 thượng phẩm.' };

  const L = D.LS, round1 = x => Math.round(x * 100) / 100; // lưu tới 2 số lẻ

  const ls = TT.ls = {
    stock: c => c.ls || 0,
    stones(c, t) { return t === 0 ? Math.floor(c.ls || 0) : TT.items.count(c, L.IDS[t]); },
    // Tổng tài sản quy ra vàng.
    wealth(c) {
      let w = c.gold + (c.ls || 0) * L.RATE;
      for (let t = 1; t <= 3; t++) w += TT.items.count(c, L.IDS[t]) * L.MUL[t] * L.RATE;
      return w;
    },
    can: (c, v) => ls.wealth(c) >= v,
    // Trả v (đơn vị vàng): vàng lẻ trước, rồi hạ phẩm, rồi đập linh thạch bậc cao và nhận lại tiền thối bằng hạ phẩm.
    pay(c, v) {
      v = Math.ceil(v);
      if (v <= 0) return true;
      if (!ls.can(c, v)) return false;
      const g = Math.min(c.gold, v); c.gold -= g; v -= g;
      if (v > 0 && c.ls) { const take = Math.min(c.ls, v / L.RATE); c.ls = round1(c.ls - take); v -= take * L.RATE; }
      for (let t = 1; t <= 3 && v > 0.0001; t++) {
        const id = L.IDS[t], val = L.MUL[t] * L.RATE;
        while (v > 0.0001 && TT.items.count(c, id) > 0) {
          TT.items.remove(c, id);
          if (val > v) { ls.addLS(c, (val - v) / L.RATE); v = 0; } else v -= val;
        }
      }
      return true;
    },
    // Tiêu tối đa v (không đủ thì tiêu hết), dùng cho các sự kiện mất của.
    spend(c, v) { const x = Math.min(v, ls.wealth(c)); ls.pay(c, x); return x; },
    addLS(c, n) { c.ls = round1((c.ls || 0) + n); },
    // Nhận thu nhập bằng linh thạch hạ phẩm (n có thể lẻ); tính vào báo cáo năm.
    gain(c, n) { ls.addLS(c, n); c.yGold = (c.yGold || 0) + n * L.RATE; },
    gainStone(c, t, n) { n = n || 1; if (t === 0) { ls.gain(c, n); return; } TT.items.add(c, L.IDS[t], n); c.yGold = (c.yGold || 0) + n * L.MUL[t] * L.RATE; },

    // Chữ hiển thị cho một khoản v vàng: nhỏ thì "vàng", còn lại theo bậc linh thạch.
    fmt(v) {
      v = Math.round(v * 10) / 10;
      if (v < L.RATE) return v + ' vàng';
      const lt = v / L.RATE;
      for (let t = 3; t >= 1; t--) if (lt >= L.MUL[t]) return (Math.round(lt / L.MUL[t] * 10) / 10) + ' linh thạch ' + L.NAMES[t];
      return (Math.round(lt * 10) / 10) + ' linh thạch';
    },
    // Số dư dạng ngắn cho bảng nhân vật.
    purse(c) {
      const parts = [];
      for (let t = 3; t >= 1; t--) { const n = TT.items.count(c, L.IDS[t]); if (n) parts.push(n + ' ' + L.NAMES[t]); }
      if ((c.ls || 0) > 0) parts.push(Math.floor(c.ls * 10) / 10 + ' hạ phẩm');
      return { ls: parts.join(', ') || '0', gold: Math.floor(c.gold) };
    },

    // ---------- quy đổi (không hao tổn) ----------
    toLS(c, n) { if (c.gold < n * L.RATE) return { ok: false, text: 'Không đủ vàng.' }; c.gold -= n * L.RATE; ls.addLS(c, n); return { ok: true, text: 'Đã đổi ' + n * L.RATE + ' vàng lấy ' + n + ' linh thạch hạ phẩm.' }; },
    toGold(c, n) { if ((c.ls || 0) < n) return { ok: false, text: 'Không đủ linh thạch hạ phẩm.' }; c.ls = round1(c.ls - n); c.gold += n * L.RATE; return { ok: true, text: 'Đã đổi ' + n + ' linh thạch hạ phẩm lấy ' + n * L.RATE + ' vàng.' }; },
    // Ghép 100 viên bậc t-1 thành 1 viên bậc t, hoặc tách 1 viên bậc t thành 100 viên bậc t-1.
    merge(c, t) {
      if (t < 1 || t > 3) return { ok: false, text: 'Không ghép được.' };
      if (ls.stones(c, t - 1) < 100) return { ok: false, text: 'Cần 100 linh thạch ' + L.NAMES[t - 1] + '.' };
      if (t === 1) c.ls = round1(c.ls - 100); else TT.items.remove(c, L.IDS[t - 1], 100);
      TT.items.add(c, L.IDS[t]);
      return { ok: true, text: 'Đã ghép thành 1 linh thạch ' + L.NAMES[t] + '.' };
    },
    split(c, t) {
      if (t < 1 || t > 3 || !TT.items.remove(c, L.IDS[t])) return { ok: false, text: 'Không có linh thạch ' + L.NAMES[t] + '.' };
      if (t === 1) ls.addLS(c, 100); else TT.items.add(c, L.IDS[t - 1], 100);
      return { ok: true, text: 'Đã tách thành 100 linh thạch ' + L.NAMES[t - 1] + '.' };
    },

    // ---------- hấp thụ tu hành ----------
    // Tu vi nhận được từ một viên linh thạch bậc t ở cảnh giới hiện tại.
    perStone(c, t) {
      const need = L.NEED_TIER[Math.min(c.realm, 6)];
      const eff = t >= need ? 1 : Math.pow(L.LOW_EFF, need - t);
      return TT.ev.NR(c) * L.ABSORB * L.MUL[t] * eff;
    },
    // Hấp thụ n viên bậc t với giới hạn cap tu vi. Chỉ lấy số viên mà cảnh giới còn chịu nổi. Trả về {n, xp}.
    absorb(c, t, cap) {
      if (c.realm >= 6 || cap <= 0) return { n: 0, xp: 0 };
      const per = ls.perStone(c, t), have = ls.stones(c, t);
      const n = Math.min(have, Math.floor(cap / per));
      if (n < 1) return { n: 0, xp: 0, tooRich: have > 0 && per > cap };
      if (t === 0) c.ls = round1(c.ls - n); else TT.items.remove(c, L.IDS[t], n);
      const xp = per * n;
      TT.ev.xp(c, xp);
      c.absorbed = (c.absorbed || 0) + n * L.MUL[t];
      return { n, xp };
    },
    // Hằng tháng khi tu luyện: hấp thụ hạ phẩm dư ra ngoài mức giữ lại theo quy tắc. tuvi: tu vi tháng này.
    autoAbsorb(c, tuvi) {
      if (c.kind !== 'player' || c.realm >= 6 || !c.ls) return 0;
      const r = TT.rules.ensure(c).absorb;
      if (!r.on) return 0;
      const spare = c.ls - r.v;
      if (spare < 1) return 0;
      const per = ls.perStone(c, 0);
      const cap = Math.min(tuvi * L.AUTO_CAP, per * Math.floor(spare));
      const o = ls.absorb(c, 0, cap);
      return o.xp;
    },
    // Hấp thụ bằng tay một bậc linh thạch (nút trong hành trang).
    manual(c, t) {
      const w = TT.world;
      if (c.realm >= 6) return { ok: false, text: 'Cảnh giới của bạn không cần hấp thụ nữa.' };
      if (c.absorbAt && c.absorbAt > w.months) return { ok: false, text: 'Linh khí vừa hấp thụ chưa tiêu hóa hết, hãy chờ thêm ' + (c.absorbAt - w.months) + ' tháng.' };
      if (ls.stones(c, t) < 1) return { ok: false, text: 'Không có linh thạch ' + L.NAMES[t] + '.' };
      const o = ls.absorb(c, t, TT.ev.NR(c) * L.MANUAL_CAP);
      if (!o.n) return { ok: false, text: o.tooRich ? 'Linh khí quá tinh thuần, cảnh giới hiện tại chưa chịu nổi một viên linh thạch ' + L.NAMES[t] + '.' : 'Không hấp thụ được.' };
      c.absorbAt = w.months + L.MANUAL_COOL;
      const t1 = 'Bạn hấp thụ ' + o.n + ' linh thạch ' + L.NAMES[t] + ', tu vi +' + Math.round(o.xp) + '.';
      TT.log(c, t1, 'good', 'Mỗi viên cho ' + Math.round(ls.perStone(c, t)) + ' tu vi ở cảnh giới này (tối đa 25% nhu cầu cảnh giới mỗi lần, nghỉ ' + L.MANUAL_COOL + ' tháng).');
      return { ok: true, text: t1 };
    }
  };
})();
