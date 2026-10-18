// Công pháp (học bằng bí kíp, có cấp luyện 0-9) và tâm pháp (bị động, tốn đạo điểm). Chỉ người chơi dùng.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng;

  const LV_MAX = 9;

  const tech = TT.tech = {
    LV_MAX,
    slots(c) { return 2 + c.realm; },           // số công pháp biết tối đa
    xinfaSlots(c) { return Math.min(4, 1 + Math.floor(c.realm / 2)); },
    known(c) { return Object.keys(c.techs || {}).map(id => ({ t: D.techById[id], lv: c.techs[id].lv, xp: c.techs[id].xp })).filter(x => x.t); },
    main(c) { return c.techMain && c.techs && c.techs[c.techMain] ? D.techById[c.techMain] : null; },
    pts(c, elem) { const a = c.tuchat.attrs.find(x => x.n === elem); return a ? a.p : 0; },
    need(t, lv) { return Math.round(8 * Math.pow(lv + 1, 1.5) * (1 + t.tier * 0.7)); },

    // Có học được không. Trả về lý do (chữ) hoặc false.
    canLearn(c, id) {
      const t = D.techById[id];
      if (!t) return 'Không có công pháp này';
      if (c.techs && c.techs[id]) return 'Đã biết công pháp này';
      if (tech.known(c).length >= tech.slots(c)) return 'Đã biết tối đa ' + tech.slots(c) + ' công pháp';
      if (c.realm < t.realm) return 'Cần cảnh giới ' + D.REALM_NAMES[t.realm] + ' trở lên';
      if (t.elem && tech.pts(c, t.elem) < t.pts) return 'Cần ' + t.pts + ' điểm tư chất hệ ' + t.elem + ' (bạn có ' + tech.pts(c, t.elem) + ')';
      if (t.multi && c.tuchat.attrs.length < t.multi) return 'Cần từ ' + t.multi + ' thuộc tính trở lên';
      return false;
    },
    learn(c, id) {
      const why = tech.canLearn(c, id);
      if (why) return { ok: false, text: why };
      c.techs = c.techs || {}; c.techs[id] = { lv: 0, xp: 0 };
      const t = D.techById[id];
      if (!c.techMain) c.techMain = id;
      TT.log(c, 'Bạn học được công pháp ' + t.n + ' (' + D.TIER_NAMES[t.tier] + ').' + (c.techMain === id ? ' Đặt làm công pháp chính.' : ''), 'big');
      return { ok: true, text: 'Đã học ' + t.n + '.' };
    },
    // Đọc bí kíp: học được thì mất sách, chưa đủ điều kiện thì giữ lại.
    read(c, bookId) {
      const d = D.ITEMS[bookId];
      const r = tech.learn(c, d.tech);
      if (r.ok) TT.items.remove(c, bookId);
      return r;
    },
    setMain(c, id) {
      if (!c.techs || !c.techs[id]) return false;
      c.techMain = id;
      return true;
    },

    // Hệ số tu luyện nhờ công pháp chính (hợp thuộc tính, cấp càng cao càng nhanh).
    trainMul(c) {
      const t = tech.main(c);
      if (!t) return 1;
      const lv = c.techs[t.id].lv;
      const aff = t.elem ? rng.clamp(tech.pts(c, t.elem) / (t.pts * 1.2 + 10), 0.5, 1.2) : 1;
      return 1 + t.train * (0.5 + 0.5 * lv / LV_MAX) * aff;
    },
    // Luyện công pháp chính khi tu luyện (g là tu vi tháng này).
    practice(c, g) {
      const t = tech.main(c);
      if (!t) return;
      const s = c.techs[t.id];
      if (s.lv >= LV_MAX) return;
      s.xp += Math.max(0.2, g) * 0.9;
      if (s.xp >= tech.need(t, s.lv)) {
        s.xp = 0; s.lv++;
        TT.log(c, 'Công pháp ' + t.n + ' đạt tầng ' + s.lv + (s.lv >= LV_MAX ? ' (đại thành)!' : '.'), 'big');
      }
    },
    // Hiệu chỉnh chỉ số: công pháp cộng công kích; tâm pháp cộng theo m.
    mod(c, k) {
      let s = 0;
      if (k === 'atk' && c.techs) {
        const m = tech.main(c);
        if (m) s += m.atk * (c.techs[m.id].lv + 1) / 10;
      }
      (c.xinfa || []).forEach(id => { const x = D.xinfaById[id]; if (x && x.m[k]) s += x.m[k]; });
      return s;
    },

    // ---------- tâm pháp ----------
    canLearnXinfa(c, id) {
      const x = D.xinfaById[id];
      if (!x) return 'Không có tâm pháp này';
      if ((c.xinfa || []).indexOf(id) >= 0) return 'Đã học';
      if ((c.xinfa || []).length >= tech.xinfaSlots(c)) return 'Hết chỗ tâm pháp (' + tech.xinfaSlots(c) + ')';
      if (c.realm < x.realm) return 'Cần cảnh giới ' + D.REALM_NAMES[x.realm];
      if (c.daoTam < x.daoTam) return 'Cần đạo tâm ' + x.daoTam + ' (bạn có ' + Math.round(c.daoTam) + ')';
      if (c.daoDiem < x.cost) return 'Cần ' + x.cost + ' đạo điểm (bạn có ' + Math.floor(c.daoDiem) + ')';
      return false;
    },
    learnXinfa(c, id) {
      const why = tech.canLearnXinfa(c, id);
      if (why) return { ok: false, text: why };
      const x = D.xinfaById[id];
      c.daoDiem -= x.cost; c.xinfa = c.xinfa || []; c.xinfa.push(id);
      TT.log(c, 'Bạn lĩnh ngộ tâm pháp ' + x.n + ' (tốn ' + x.cost + ' đạo điểm).', 'big');
      return { ok: true, text: 'Đã học ' + x.n + '.' };
    },
    forgetXinfa(c, id) {
      c.xinfa = (c.xinfa || []).filter(i => i !== id);
      return { ok: true, text: 'Đã quên tâm pháp (đạo điểm không hoàn lại).' };
    }
  };
})();
