// Bộ máy sự kiện: hàm trợ giúp cho dữ liệu sự kiện (TT.ev), kỳ ngộ, chọn sự kiện hằng tháng và chọn mặc định.
// Người chơi: sự kiện tầng 1 tự chạy ghi nhật ký, tầng 2 hộp chọn đếm ngược, tầng 3 dừng hẳn (xem decisions.js).
// NPC dùng chung dữ liệu nhưng tự chọn (có trọng số ngẫu nhiên) và chỉ gặp các sự kiện có npc > 0.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats;

  // ---------- hàm trợ giúp ----------
  const ev = TT.ev = {
    xp(c, n) { c.xp += n; c.yXp += n; },
    gold(c, n) { if (n < 0) { TT.ls.spend(c, -n); return; } c.gold += n; c.yGold += n; },
    // Sinh lực: người chơi bị một sự kiện đánh tới mức chết thì còn thoi thóp 1 điểm (sự kiện không giết người chơi ngay tại chỗ;
    // chỉ bệnh thương dai dẳng, kẻ thù, đột phá thất bại... mới giết). NPC thì chết thật.
    hp(c, n) {
      if (n < 0 && c.kind === 'player' && c.hp + n <= 0) {
        c.hp = Math.min(c.hp, 1);
        TT.log(c, 'Bạn suýt bỏ mạng, chỉ còn thoi thóp một hơi tàn. Hãy dưỡng thương ngay!', 'bad');
        return;
      }
      c.hp = rng.clamp(c.hp + n, 0, S.hpMax(c));
    },
    NR(c) { return D.NEED[Math.min(c.realm, 5)]; },
    lp(c, p) { return rng.clamp(p + S.luck(c) * 0.01, 0.02, 0.95); },
    // Đánh nhanh một đối thủ có sức mạnh "enemy". M6 sẽ thay bằng chiến đấu theo hiệp.
    fight(c, enemy) {
      const a = S.atk(c);
      return rng.P(rng.clamp(a / (a + enemy) + S.luck(c) * 0.005, 0.05, 0.95));
    },
    dao(c, n) { c.daoTam = rng.clamp(c.daoTam + n, 0, 100); },
    // Tặng vật phẩm vào túi (chỉ người chơi dùng túi). Trả về tên để ghép vào chữ.
    item(c, id, n) {
      if (c.kind === 'player') TT.items.add(c, id, n || 1);
      return D.ITEMS[id].n + (n > 1 ? ' x' + n : '');
    },
    // Tặng một bí kíp công pháp ngẫu nhiên (phẩm tối đa maxTier). Trả về tên bí kíp hoặc null (NPC không có túi).
    book(c, maxTier) {
      if (c.kind !== 'player') return null;
      const pool = D.TECHS.filter(t => t.tier <= maxTier && !(c.techs && c.techs[t.id]) && (!t.elem || TT.tech.pts(c, t.elem) >= t.pts * 0.5));
      if (!pool.length) return null;
      const t = rng.pick(pool);
      TT.items.add(c, 'bk_' + t.id);
      return D.ITEMS['bk_' + t.id].n;
    },
    other(ctx) { return ctx && ctx.otherId ? TT.world.chars[ctx.otherId] : null; },
    frac(c, elems) { return TT.map.fraction(c, elems); },
    ngo(c) { return S.ngo(c); },
    good(t, note) { return { t, cls: 'good', note }; },
    bad(t, note) { return { t, cls: 'bad', note }; },
    big(t) { return { t, cls: 'big' }; },

    // Cộng điểm tư chất vào thuộc tính cao nhất. Trả về tên thuộc tính.
    addTuChat(c, n) {
      const at = c.tuchat.attrs; let mi = 0;
      at.forEach((a, i) => { if (a.p > at[mi].p) mi = i; });
      at[mi].p += n; c.tuchat.total += n;
      return at[mi].n;
    },
    // Thức tỉnh một thuộc tính biến dị (nếu chưa có). Trả về tên hoặc false.
    awakenDi(c, name) {
      if (c.tuchat.attrs.some(a => a.di)) return false;
      const d = name ? D.DI.find(x => x.n === name) : rng.pick(D.DI);
      const p = rng.RI(15, 30);
      c.tuchat.attrs.push({ n: d.n, di: true, p }); c.tuchat.total += p;
      return d.n;
    },
    addGoodTrait(c) {
      const maxQ = rng.P(0.12) ? 2 : 1;
      const pool = D.TRAITS.filter(t => t.g === 1 && t.q <= maxQ && c.traitIds.indexOf(t.id) < 0);
      if (!pool.length) return null;
      const t = rng.pick(pool); c.traitIds.push(t.id); return t;
    },
    removeBadTrait(c) {
      const bad = c.traitIds.filter(id => !D.traitById[id].g);
      if (!bad.length) return null;
      const id = rng.pick(bad); c.traitIds.splice(c.traitIds.indexOf(id), 1); return D.traitById[id];
    },

    // Kỳ ngộ: với xác suất p (cộng thêm theo khí vận) xảy ra một đổi vận. "only" giới hạn loại kết quả.
    // Trả về {t, cls} hoặc null nếu không có kỳ ngộ.
    kyNgo(c, p, only) {
      p = rng.clamp(p + Math.max(0, S.kv(c)) * 0.001, 0, 0.6);
      if (!rng.P(p)) return null;
      const opts = D.FATE.filter(f => (!only || only.indexOf(f.id) >= 0) && FATE[f.id].ok(c));
      if (!opts.length) return null;
      const f = rng.wpick(opts);
      const text = FATE[f.id].run(c);
      c.fateCount = (c.fateCount || 0) + 1;
      if (c.kind !== 'player') TT.news(c.name + ' vừa gặp một kỳ ngộ.', 'good', [c.id]);
      return { t: '✦ Kỳ ngộ! ' + text, cls: 'big' };
    }
  };

  const FATE = {
    tu_chat: { ok: () => true, run: c => { const a = ev.addTuChat(c, rng.RI(6, 18)); return 'Linh khí tẩy luyện kinh mạch, tư chất hệ ' + a + ' tăng mạnh!'; } },
    di: { ok: c => !c.tuchat.attrs.some(a => a.di), run: c => 'Huyết mạch ẩn thức tỉnh, bạn có thêm thuộc tính biến dị hệ ' + ev.awakenDi(c) + '!' },
    xoa: { ok: c => c.traitIds.some(id => !D.traitById[id].g), run: c => 'Nghiệp chướng "' + ev.removeBadTrait(c).n + '" được hóa giải, bạn nhẹ người hẳn!' },
    tot: {
      ok: c => c.traitIds.length < 5,
      run: c => { const t = ev.addGoodTrait(c); return t ? 'Bạn nhận được tiên thiên "' + t.n + '" (phẩm ' + D.QNAME[t.q] + ')!' : 'Linh quang chợt lóe rồi tắt.'; }
    },
    kv: { ok: () => true, run: c => { c.baseKv += rng.RI(3, 8); c.known.kv = true; return 'Khí vận của bạn tăng lên rõ rệt, và bạn cảm nhận được nó.'; } },
    // Nhặt được một pháp bảo (phẩm theo cảnh giới, hệ theo thuộc tính chính). Chỉ người chơi có túi đồ; NPC coi như chưa có gì.
    phap_bao: {
      ok: c => c.kind === 'player',
      run: c => {
        const hi = c.realm >= 4 ? 3 : c.realm >= 3 ? 2 : c.realm >= 1 ? 1 : 0, tier = Math.max(0, Math.min(hi, hi - (rng.P(0.45) ? 1 : 0)));
        const a = c.tuchat.attrs.reduce((m, x) => (x.p > m.p ? x : m), c.tuchat.attrs[0]);
        const stat = rng.pick(['atk', 'hpMax', 'nl']), id = TT.gear.relicKey(stat, tier, 0.3 + rng.next() * 0.65, a.n, 0);
        TT.items.add(c, id);
        return 'Giữa cơ duyên, bạn nhặt được một pháp bảo: ' + D.ITEMS[id].n + '. Hãy đeo nó làm bản mệnh, nó sẽ lớn lên cùng bạn.';
      }
    },
    lo: {
      ok: c => !c.known.kv || !c.known.luck,
      run: c => { c.known.kv = true; c.known.luck = true; return 'Bạn nhìn thấu vận mệnh của mình: khí vận ' + S.kv(c) + ', vận may ' + S.luck(c) + '.'; }
    }
  };

  function classify(t) {
    if (/Sinh lực -|mất |bị thương|bị lừa|thất bại|đồ nhái|nguy hiểm/.test(t)) return 'bad';
    if (/tăng|nhận |hóa giải|xóa |thức tỉnh|thu được/.test(t)) return 'good';
    return '';
  }

  // ---------- chọn mặc định ----------
  function boldOf(c) {
    const dir = D.DIRECTIONS[c.direction] || D.DIRECTIONS.can_bang;
    const pers = D.personalityById[c.personality] || D.personalityById.trung_lap;
    return dir.bold * (pers.bold || 1);
  }

  // Chọn lựa chọn mặc định: quy tắc nếu-thì của người chơi trước, rồi tới hướng đi/tính cách. random=true cho NPC.
  function chooseIndex(c, e, choices, random, ctx) {
    const cand = [];
    choices.forEach((ch, i) => { if (!ch.disabled) cand.push({ i, ch, def: e.choices[i] }); });
    if (!cand.length) return 0;
    if (c.kind === 'player') {
      const key = TT.rules.pickChoice(c, cand.map(x => ({ key: x.ch.key, kind: x.def.kind })));
      if (key) { const hit = cand.find(x => x.ch.key === key); if (hit) return hit.i; }
    }
    const b = boldOf(c), hpr = c.hp / S.hpMax(c);
    const ws = cand.map(x => {
      let w = typeof x.def.ai === 'function' ? x.def.ai(c, ctx || {}) : (x.def.ai != null ? x.def.ai : 1);
      const k = x.def.kind;
      if (k === 'risk' || k === 'fight') w *= b;
      else if (k === 'safe' || k === 'flee') w /= b;
      if ((k === 'risk' || k === 'fight') && hpr < 0.4) w *= 0.35;
      if (k === 'pay' && TT.ls.wealth(c) < 60) w *= 0.6;
      return w;
    });
    if (random) {
      let tot = 0; ws.forEach(w => { tot += w; });
      let r = rng.next() * tot;
      for (let j = 0; j < cand.length; j++) { r -= ws[j]; if (r <= 0) return cand[j].i; }
      return cand[cand.length - 1].i;
    }
    let best = 0;
    ws.forEach((w, j) => { if (w > ws[best]) best = j; });
    return cand[best].i;
  }

  const events = TT.events = {
    // Xác suất có sự kiện trong một tháng.
    rate(c) {
      const seek = c.focus === 'seek';
      let p = (seek ? 0.05 : 0.009) + Math.max(0, S.kv(c)) * (seek ? 0.0015 : 0.0003);
      p = rng.clamp(p, 0.004, 0.18);
      if (c.kind !== 'player') p *= 0.15; // NPC gặp ít sự kiện hơn để giữ nhịp tu luyện của thế giới
      else p /= Math.sqrt(TT.config.timeScale(c)); // thời gian chạy nhanh dần thì sự kiện mỗi năm thưa đi, số hộp hỏi mỗi phút thật không vọt lên
      return p;
    },

    eligible(c) {
      const w = TT.world, list = [];
      const place = c.place && !c.travel && !c.cross ? TT.map.place(c.place) : null;
      for (let i = 0; i < D.EVENTS.length; i++) {
        const e = D.EVENTS[i];
        if (e.manual) continue; // sự kiện do hệ thống khác kích hoạt (quan hệ, cơ hội), không bốc ngẫu nhiên
        if (c.kind !== 'player' && !(e.npc > 0)) continue;
        if (e.places && (!place || e.places.indexOf(place.type) < 0)) continue;
        if (e.regions && e.regions.indexOf(c.region) < 0) continue;
        if (c.evCool[e.id] && c.evCool[e.id] > w.months) continue;
        if (e.when && !e.when(c)) continue;
        let wt = typeof e.w === 'function' ? e.w(c) : e.w;
        if (c.kind !== 'player') wt *= e.npc;
        if (wt > 0) list.push({ e, w: wt });
      }
      return list;
    },

    monthly(c) {
      const w = TT.world;
      if (c.travel || c.cross) return;
      if (c.kind === 'player' && w.pending) return;
      if (c.lastEventMonth > w.months - 3) return; // tránh dồn dập
      if (!rng.P(events.rate(c))) return;
      const list = events.eligible(c);
      if (!list.length) return;
      events.fire(c, rng.wpick(list, x => x.w).e);
    },

    // Sự kiện dọc đường khi đang vượt vùng (chỉ người chơi).
    fireCross(c) {
      const list = D.EVENTS.filter(e => e.cross && (!e.when || e.when(c))).map(e => ({ e, w: typeof e.w === 'function' ? e.w(c) : (e.w || 1) }));
      if (list.length) events.fire(c, rng.wpick(list, x => x.w).e);
    },

    // Kích hoạt một sự kiện cho nhân vật (người chơi: qua hộp quyết định; NPC: tự chọn ngay).
    // ctx: dữ liệu thuần đi kèm (ví dụ { otherId } cho sự kiện về một người cụ thể), được lưu cùng quyết định.
    fire(c, e, ctx) {
      const w = TT.world;
      ctx = ctx || {};
      if (e.setup && !ctx.otherId) { // sự kiện cần một nhân vật cụ thể: tìm hoặc dựng NPC, không được thì hủy
        const s = e.setup(c);
        if (!s) return;
        ctx = s;
      }
      c.evCool[e.id] = w.months + (e.cool != null ? e.cool : 24);
      c.lastEventMonth = w.months;
      const choices = e.choices.map(ch => {
        const dis = ch.disabled ? ch.disabled(c, ctx) : false;
        return { key: ch.key, label: typeof ch.label === 'function' ? ch.label(c, ctx) : ch.label, kind: ch.kind, disabled: !!dis, why: typeof dis === 'string' ? dis : '' };
      });
      if (c.kind !== 'player') {
        const idx = chooseIndex(c, e, choices, true, ctx);
        events.apply(c, e, choices[idx].key, ctx);
        return;
      }
      TT.decisions.request({
        type: 'event', charId: c.id, evId: e.id, tier: e.tier || 2, ctx,
        title: typeof e.title === 'function' ? e.title(c, ctx) : e.title, text: typeof e.text === 'function' ? e.text(c, ctx) : e.text,
        choices, def: chooseIndex(c, e, choices, false, ctx), timeout: 12
      });
    },

    // Thực hiện một lựa chọn, ghi nhật ký, xử lý tử vong.
    apply(c, e, key, ctx) {
      const ch = e.choices.find(x => x.key === key) || e.choices[0];
      const r = ch.run(c, ctx || {});
      const res = typeof r === 'string' ? { t: r, cls: classify(r) } : r;
      const title = typeof e.title === 'function' ? e.title(c, ctx || {}) : e.title;
      const prefix = e.tier === 1 ? (typeof e.text === 'function' ? e.text(c, ctx || {}) : e.text) + ' ' : '[' + title + '] ';
      TT.log(c, prefix + res.t, res.cls, res.note);
      if (c.hp <= 0 && c.alive) TT.life.die(c, 'không qua khỏi sự kiện "' + title + '"');
      return res;
    },

    defaultIndex: chooseIndex
  };
})();
