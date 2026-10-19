// Giám định (E7b): đồ mua ở chợ đen và món thắng ở nhà đấu giá có thể là đồ nhái. Người mua không biết cho tới khi trả phí giám định
// (hoặc tầm nhìn cao, insight từ D.ECO.gd.free trở lên, tự thấy dấu hiệu). Lưu ở c.sus = { idVậtPhẩm: { n: món chưa giám định, f: trong đó là đồ nhái } }.
// Độ chính xác tăng theo tầm nhìn thị trường (TT.eco.insight); sai thì nói "thật" với xác suất D.ECO.gd.wrong.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, G = D.ECO.gd;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  TT.gd = {
    acc(c) { return clamp(G.acc0 + G.accK * TT.eco.insight(c), 0, 0.98); },
    fee(c) { return Math.ceil(G.fee * (1 + c.realm)); },
    free(c) { return TT.eco.insight(c) >= G.free; },
    // Ghi nhận một món mua hoặc thắng đấu giá, p là xác suất là đồ nhái (rng dùng ở đây, khi giao dịch).
    // Tầm nhìn đủ cao thì bỏ đồ nhái ngay khi mua (tự thấy dấu hiệu).
    mark(c, id, p) {
      const s = c.sus = c.sus || {}, e = s[id] || (s[id] = { n: 0, f: 0 }); e.n++;
      if (rng.P(p)) e.f++;
      if (e.f > 0 && TT.gd.free(c)) {
        e.f--; e.n--; TT.items.remove(c, id, 1);
        TT.log(c, 'Bạn nhận ra một món ' + D.ITEMS[id].n + ' là đồ nhái và bỏ đi.', 'age');
      }
      if (e.n <= 0) delete s[id];
    },
    // Túi đổi (bán, dùng): số món chưa giám định không vượt số còn trong túi; đồ nhái giảm theo tỉ lệ.
    trim(c, id) {
      const s = c.sus, e = s && s[id]; if (!e) return;
      const k = TT.items.count(c, id); if (e.n > k) e.n = k; if (e.f > e.n) e.f = e.n;
      if (e.n <= 0) delete s[id];
    },
    // Giám định một loại món. Kết quả: 'thật', 'nhái' hoặc 'chưa chắc'. Đồ nhái bị loại khỏi túi khi nhận ra.
    appraise(c, id) {
      if (!D.ECO.hq) return { ok: false, text: 'Chưa mở.' };
      const e = c.sus && c.sus[id]; if (!e) return { ok: false, text: 'Món này không cần giám định.' };
      const free = TT.gd.free(c), fee = free ? 0 : TT.gd.fee(c);
      if (fee && !TT.ls.can(c, fee)) return { ok: false, text: 'Không đủ linh thạch để giám định (cần ' + TT.ls.fmt(fee) + ').' };
      if (fee) TT.ls.pay(c, fee);
      const name = D.ITEMS[id].n; let v;
      if (rng.P(TT.gd.acc(c))) v = e.f > 0 ? 'nhái' : 'thật';
      else v = e.f > 0 && rng.P(G.wrong) ? 'thật' : 'chưa chắc';
      if (v === 'nhái') { TT.items.remove(c, id, e.f); delete c.sus[id]; TT.log(c, name + ' là đồ nhái, bạn bỏ đi phần nhái.', 'bad'); }
      else if (v === 'thật') { delete c.sus[id]; TT.log(c, name + ' được giám định là đồ thật.', 'age'); }
      const txt = v === 'chưa chắc' ? 'Chưa chắc: ' + name + ' khó phân biệt, thử giám định lại.' : (v === 'nhái' ? name + ' là đồ nhái, phần nhái đã bỏ đi.' : name + ' là đồ thật.');
      return { ok: true, verdict: v, text: txt + (fee ? ' (đã trả ' + TT.ls.fmt(fee) + ')' : '') };
    }
  };
})();
