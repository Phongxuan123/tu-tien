// Khí vận v2 của người chơi (Q 5, Z "Đặc tả 8A"): điểm khí vận c.kvPts là tài nguyên, chỉ cộng bằng chuyện lớn, không trần, không cộng theo thời gian.
// Khởi đầu lấy đúng lần rút baseKv lúc sinh. S.kv của người chơi = min(kvPts, 20) + phần Mệnh cách của tiên thiên. NPC giữ baseKv.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data;
  const LOG_CAP = 20;
  const on = c => !!(c && c.kind === 'player' && D.NATURE && D.NATURE.on);

  const kv = TT.kv = {
    passiveCap: 20,
    // Số điểm hiện có (đọc thuần: bản lưu cũ chưa có kvPts thì suy từ baseKv, không lưu).
    pts(c) { return c.kvPts != null ? c.kvPts : Math.max(0, Math.round(c.baseKv)); },
    ensure(c) {
      if (!on(c)) return false;
      if (c.kvPts == null) c.kvPts = Math.max(0, Math.round(c.baseKv));
      if (!c.kvLog) c.kvLog = [];
      return true;
    },
    can(c, n) { return on(c) && kv.pts(c) >= n; },
    log(c) { return c.kvLog || []; },
    note(c, d, src) {
      c.kvLog.push({ m: TT.world.months, d, src: src || '' });
      if (c.kvLog.length > LOG_CAP) c.kvLog.splice(0, c.kvLog.length - LOG_CAP);
    },
    // Cộng điểm từ một chuyện lớn; trả về số điểm đã cộng (0 nếu không phải người chơi hoặc công tắc tắt).
    add(c, n, src) {
      if (!kv.ensure(c) || !(n > 0)) return 0;
      c.kvPts += n; kv.note(c, n, src);
      TT.log(c, 'Khí vận +' + n + (src ? ' (' + src + ')' : '') + '.', 'good');
      return n;
    },
    // Cộng một lần theo khóa (mỗi cảnh giới một lần...).
    addOnce(c, key, n, src) {
      if (!kv.ensure(c)) return 0;
      const k = 'kv_' + key;
      if (c.flags[k]) return 0;
      c.flags[k] = 1;
      return kv.add(c, n, src);
    },
    // Tiêu điểm (vòng quay quay lại, về sau đổi hướng chặng): không tiêu khi thiếu.
    spend(c, n, src) {
      if (!kv.ensure(c) || !(n > 0) || c.kvPts < n) return false;
      c.kvPts -= n; kv.note(c, -n, src);
      return true;
    }
  };
})();
