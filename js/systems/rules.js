// Quy tắc nếu-thì của người chơi: nhân vật tự theo quy tắc khi chọn hành động hằng tháng và khi chọn mặc định ở sự kiện.
// Dữ liệu lưu trong nhân vật (c.rules) nên đi theo bản lưu. NPC dùng cách chọn theo tính cách, không dùng quy tắc.
(function () {
  const TT = window.TT = window.TT || {};

  const RULES = TT.rules = {
    // Mô tả cho giao diện: mỗi quy tắc có điều kiện (có thể có giá trị) và hành động chọn được.
    DEFS: [
      { id: 'usePill', text: 'Nếu sinh lực dưới', unit: '%', vals: [25, 35, 45, 55], act: 'và có Hồi Xuân Đan thì uống' },
      { id: 'hpBelow', text: 'Nếu sinh lực dưới', unit: '%', vals: [20, 30, 40, 50, 60], act: 'thì nghỉ ngơi' },
      { id: 'goldBelow', text: 'Nếu tài sản dưới', unit: ' vàng', vals: [20, 50, 100, 200, 500], act: 'thì đi kiếm sống' },
      { id: 'absorb', text: 'Giữ lại', unit: ' linh thạch hạ phẩm', vals: [0, 5, 10, 20, 50, 100], act: 'để dùng, phần dư thì hấp thụ khi tu luyện' },
      { id: 'stuck', text: 'Nếu kẹt bình cảnh (thiếu cơ duyên)', opts: [['seek', 'thì đi tìm cơ duyên'], ['train', 'thì cứ tu luyện tiếp']] },
      { id: 'risk', text: 'Nếu gặp cơ hội nguy hiểm', opts: [['auto', 'thì theo hướng đi'], ['try', 'thì thử vận may'], ['skip', 'thì bỏ qua']] },
      { id: 'threat', text: 'Nếu gặp kẻ thù hoặc yêu thú', opts: [['auto', 'thì theo hướng đi'], ['fight', 'thì ra tay'], ['flee', 'thì chạy']] }
    ],

    defaults() {
      return {
        usePill: { on: true, v: 35 },
        hpBelow: { on: true, v: 30 },
        goldBelow: { on: false, v: 50 },
        absorb: { on: true, v: 10 },
        stuck: { on: true, v: 'seek' },
        risk: { on: false, v: 'auto' },
        threat: { on: false, v: 'auto' }
      };
    },

    ensure(c) {
      if (!c.rules) c.rules = RULES.defaults();
      const d = RULES.defaults();
      Object.keys(d).forEach(k => { if (!c.rules[k]) c.rules[k] = d[k]; });
      return c.rules;
    },

    // Hành động ép buộc theo quy tắc cho tháng này (hoặc null). Ghi một dòng nhật ký khi quy tắc vừa chuyển sang có hiệu lực.
    actionFor(c) {
      const r = RULES.ensure(c);
      const S = TT.stats;
      let act = null, why = '';
      // Có đan thì uống trước khi phải nghỉ (không tốn lượt hành động).
      if (r.usePill.on && c.hp / S.hpMax(c) * 100 < r.usePill.v && TT.items.has(c, 'hoi_xuan_dan')) TT.items.autoHeal(c);
      if (r.hpBelow.on && c.hp / S.hpMax(c) * 100 < r.hpBelow.v) { act = 'rest'; why = 'sinh lực dưới ' + r.hpBelow.v + '%, bạn nghỉ ngơi dưỡng sức'; }
      else if (r.goldBelow.on && TT.ls.wealth(c) < r.goldBelow.v) { act = 'work'; why = 'tài sản dưới ' + r.goldBelow.v + ' vàng, bạn đi kiếm sống'; }
      else if (r.stuck.on && c.stuck && r.stuck.v !== 'auto') {
        act = r.stuck.v === 'train' ? 'train' : 'seek';
        why = act === 'seek' ? 'đang kẹt bình cảnh, bạn đi tìm cơ duyên' : 'đang kẹt bình cảnh, bạn tiếp tục tu luyện';
      }
      const key = act ? act + ':' + why : '';
      if (key !== c.ruleNow) {
        c.ruleNow = key;
        if (act) TT.log(c, 'Quy tắc nếu-thì: ' + why + '.', 'age');
      }
      return act;
    },

    // Chọn lựa chọn của sự kiện theo quy tắc. cands: [{key, kind}]. Trả về key hoặc null (để máy chọn theo hướng đi).
    pickChoice(c, cands) {
      const r = RULES.ensure(c);
      const find = k => { const x = cands.find(y => y.kind === k); return x ? x.key : null; };
      if (r.risk.on && r.risk.v !== 'auto') {
        const k = r.risk.v === 'try' ? find('risk') : find('safe');
        if (k) return k;
      }
      if (r.threat.on && r.threat.v !== 'auto') {
        const k = r.threat.v === 'fight' ? find('fight') : find('flee');
        if (k) return k;
      }
      return null;
    }
  };
})();
