// Thiên phú nghề: kiếm đạo, luyện khí, luyện đan, vẽ bùa. Cấp 0-10, kinh nghiệm riêng, yêu cầu thuộc tính tư chất và niệm lực.
// Qua cấp 3 cần thành viên tông môn chuyên nghề (nâng trần thêm 4) hoặc tâm đắc (mỗi quyển nâng trần thêm 2). Chỉ người chơi dùng.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats;

  const IDS = ['kiem', 'khi', 'dan', 'bua'];
  const need = lv => Math.round(30 * Math.pow(lv + 1, 1.6));

  const craft = TT.craft = {
    IDS, need,
    ensure(c) {
      if (!c.craft) { c.craft = { cap: {}, focus: '' }; IDS.forEach(id => { c.craft[id] = { lv: 0, xp: 0 }; c.craft.cap[id] = 0; }); }
      return c.craft;
    },
    level(c, id) { return c.craft ? c.craft[id].lv : 0; },
    // Thiên phú: hợp thuộc tính và niệm lực thì học nhanh (0,4 tới 1,8).
    aptitude(c, id) {
      const frac = TT.map.fraction(c, D.CRAFTS[id].elems);
      return rng.clamp(0.4 + frac * 1.0 + S.nl(c) / 250, 0.4, 1.8);
    },
    specialist(c, id) { return !!(c.sect && D.CRAFTS[id].sect === c.sect.id && c.sect.rank >= 1); },
    // Trần cấp hiện tại: 3 cơ bản, +4 nếu ở tông môn chuyên nghề, +2 mỗi quyển tâm đắc; tối đa 10, và còn bị cảnh giới giới hạn.
    cap(c, id) {
      const cr = craft.ensure(c);
      const raw = 3 + (craft.specialist(c, id) ? 4 : 0) + 2 * (cr.cap[id] || 0);
      return Math.min(10, raw, 2 + c.realm * 2);
    },
    bestFocus(c) {
      let best = IDS[0], bv = -1;
      IDS.forEach(id => { const v = craft.aptitude(c, id); if (v > bv) { bv = v; best = id; } });
      return best;
    },

    // Kiếm đạo cộng công kích và xác suất đột phá theo cấp.
    mod(c, k) {
      if (!c.craft) return 0;
      const lv = c.craft.kiem.lv;
      if (k === 'atk') return lv * 1.2;
      if (k === 'brk') return lv * 0.004;
      return 0;
    },

    readDac(c, itemId) {
      const id = D.ITEMS[itemId].craft, cr = craft.ensure(c);
      if ((cr.cap[id] || 0) >= 4) return { ok: false, text: 'Tâm đắc nghề này bạn đã nghiền ngẫm hết.' };
      TT.items.remove(c, itemId);
      cr.cap[id] = (cr.cap[id] || 0) + 1;
      TT.log(c, 'Bạn nghiền ngẫm ' + D.ITEMS[itemId].n + ', trần cấp ' + D.CRAFTS[id].n.toLowerCase() + ' tăng thêm 2.', 'good');
      return { ok: true, text: 'Trần cấp nghề đã nâng.' };
    },

    // Số nguyên liệu cho một lần làm: bằng 55% giá trị món chia giá một nguyên liệu, tối thiểu 2.
    matNeed(c, itemId, matId) {
      const v = TT.items.value(c, itemId), m = Math.max(1, D.ITEMS[matId].value);
      return Math.min(40, Math.max(2, Math.ceil(v * 0.55 / m)));
    },
    // Chọn công thức làm được ở cấp hiện tại.
    pickRecipe(c, id) {
      const lv = craft.level(c, id);
      const opts = (D.CRAFTS[id].recipes || []).filter(r => lv >= r[0] && !(D.ITEMS[r[1]].minRealm > c.realm + 1));
      return opts.length ? rng.wpick(opts, r => r[2] + (lv - r[0]) * 0.3) : null;
    },

    // ================= Luyện khí: bản vẽ, vật liệu, lò, thành bại =================
    ORE: ['quang_thach', 'tinh_thiet', 'huyen_thiet', 'thien_thach'],
    LV: [0, 3, 6, 9], MONTHS: [1, 3, 6, 12], FUEL: [1, 3, 10, 40], BASE_P: [0.9, 0.75, 0.6, 0.45], ORE_N: [3, 4, 5, 6],
    // Yêu cầu của một bản vẽ: { slot, tier, stat? } -> chi tiết cần có.
    recipe(spec) {
      const t = spec.tier, relic = spec.slot === 'relic';
      const part = relic ? { kind: 'any', minTier: Math.max(1, t), n: 1 } : t >= 2 ? { kind: spec.slot === 'weapon' ? 'nanh' : 'da', minTier: t - 1, n: 1 } : null;
      return {
        ore: { id: craft.ORE[t], n: Math.round(craft.ORE_N[t] * (relic ? 1.5 : 1)) }, part, dan: relic ? 3 : t === 1 ? 1 : t === 3 ? 2 : 0,
        fuel: craft.FUEL[t] * (relic ? 2 : 1), months: Math.round(craft.MONTHS[t] * (relic ? 1.5 : 1)), lv: relic ? Math.max(8, craft.LV[t]) : craft.LV[t], realm: D.GEAR.REQ[t]
      };
    },
    furnaceTier(c) { return TT.items.has(c, 'lo_tien') ? 3 : TT.items.has(c, 'lo_bao') ? 2 : TT.items.has(c, 'lo_linh') ? 1 : 0; },
    diaHoa(c) {
      const pl = c.place && !c.travel ? TT.map.place(c.place) : null, rg = TT.map.region(c.region);
      return !!((pl && (pl.type === 'mo' || pl.type === 'phuong')) || (rg && (rg.elems.indexOf('Hỏa') >= 0 || rg.elems.indexOf('Dương') >= 0)));
    },
    // Tìm vật liệu yêu thú dùng được trong túi (bậc đủ, ưu tiên cùng hệ với thuộc tính chính, dùng bậc thấp nhất đủ).
    findPart(c, need) {
      const a = c.tuchat.attrs.reduce((m, x) => (x.p > m.p ? x : m), c.tuchat.attrs[0]);
      const ids = Object.keys(c.inv || {}).filter(id => { const d = D.ITEMS[id]; return d && d.mat && d.tier >= need.minTier && (need.kind === 'any' || d.part === need.kind); });
      ids.sort((x, y) => (D.ITEMS[x].tier - D.ITEMS[y].tier) || ((D.ITEMS[y].elem === a.n) - (D.ITEMS[x].elem === a.n)));
      return ids[0] || null;
    },
    // Lý do chưa luyện được (chữ) hoặc false.
    why(c, spec) {
      const r = craft.recipe(spec), lv = craft.level(c, 'khi');
      if (spec.slot === 'relic' && spec.tier > 2 && lv < 10) return 'Pháp bảo bậc tiên cần luyện khí cấp 10';
      if (lv < r.lv) return 'Cần luyện khí cấp ' + r.lv + ' (bạn cấp ' + lv + ')';
      if (c.realm < r.realm) return 'Phẩm ' + D.GEAR.TIERS[spec.tier] + ' cần ' + D.REALM_NAMES[r.realm] + ' trở lên mới luyện được';
      if (TT.items.count(c, r.ore.id) < r.ore.n) return 'Thiếu ' + D.ITEMS[r.ore.id].n + ' (cần ' + r.ore.n + ', có ' + TT.items.count(c, r.ore.id) + ')';
      if (r.part && !craft.findPart(c, r.part)) return 'Thiếu ' + (r.part.kind === 'nanh' ? 'nanh' : r.part.kind === 'da' ? 'da' : 'nanh hoặc da') + ' yêu thú bậc ' + r.part.minTier + ' trở lên';
      if (TT.items.count(c, 'yeu_dan') < r.dan) return 'Thiếu Yêu đan (cần ' + r.dan + ')';
      if (!TT.ls.can(c, r.fuel * D.LS.RATE)) return 'Thiếu linh thạch làm nhiên liệu (cần ' + r.fuel + ' hạ phẩm)';
      return false;
    },
    // Bắt đầu một bản vẽ: trừ vật liệu và nhiên liệu ngay, rồi chờ đủ số tháng.
    start(c, spec) {
      const cr = craft.ensure(c);
      if (cr.proj) return { ok: false, text: 'Lò đang luyện dở một món khác.' };
      const w = craft.why(c, spec); if (w) return { ok: false, text: w };
      const r = craft.recipe(spec), part = r.part ? craft.findPart(c, r.part) : null;
      TT.items.remove(c, r.ore.id, r.ore.n); if (part) TT.items.remove(c, part); if (r.dan) TT.items.remove(c, 'yeu_dan', r.dan);
      TT.ls.pay(c, r.fuel * D.LS.RATE);
      const main = c.tuchat.attrs.reduce((m, x) => (x.p > m.p ? x : m), c.tuchat.attrs[0]);
      cr.proj = { slot: spec.slot, tier: spec.tier, stat: spec.stat || null, left: r.months, total: r.months, elem: part ? D.ITEMS[part].elem : (spec.slot === 'relic' ? main.n : null), part: !!part };
      cr.focus = 'khi';
      const nm = spec.slot === 'relic' ? D.GEAR.RELIC_NAMES[spec.stat || 'atk'][spec.tier] : D.GEAR.NAMES[spec.slot][spec.tier];
      TT.log(c, 'Bạn nhóm lò luyện ' + nm + ' (phẩm ' + D.GEAR.TIERS[spec.tier] + '), cần ' + r.months + ' tháng.', 'age');
      return { ok: true, text: 'Đã nhóm lò, cần ' + r.months + ' tháng.' };
    },
    // Hoàn thành món đang luyện: thành công, thất bại hoặc nổ lò.
    finish(c) {
      const cr = craft.ensure(c), pj = cr.proj, lv = craft.level(c, 'khi'), req = craft.recipe(pj).lv, apt = craft.aptitude(c, 'khi'), furn = craft.furnaceTier(c);
      cr.proj = null;
      const p = rng.clamp(craft.BASE_P[pj.tier] + 0.04 * (lv - req) + 0.1 * (apt - 1) + 0.05 * furn + (craft.diaHoa(c) ? 0.05 : 0), 0.15, 0.97);
      const nm = pj.slot === 'relic' ? D.GEAR.RELIC_NAMES[pj.stat || 'atk'][pj.tier] : D.GEAR.NAMES[pj.slot][pj.tier];
      if (rng.P(p)) {
        const q = rng.clamp(0.2 + rng.next() * 0.6 + 0.03 * (lv - req) + 0.1 * (apt - 1) + (pj.part ? 0.08 : 0) + 0.05 * furn, 0, 0.995);
        const id = pj.slot === 'relic' ? TT.gear.relicKey(pj.stat || 'atk', pj.tier, q, pj.elem, 0) : TT.gear.key(pj.slot, pj.tier, q, pj.elem);
        TT.items.add(c, id); c.craftMade = (c.craftMade || 0) + 1;
        TT.log(c, 'Luyện khí thành công: ' + D.ITEMS[id].n + '. ' + D.ITEMS[id].desc.split('. ').slice(0, pj.slot === 'relic' ? 2 : 1).join('. '), 'big', 'Xác suất thành công ' + Math.round(p * 100) + '% (cấp nghề ' + lv + ', thiên phú x' + apt.toFixed(2) + ', lò bậc ' + furn + (craft.diaHoa(c) ? ', có địa hỏa' : '') + '). Chất lượng ' + Math.round(q * 100) + '/100 trong phẩm.');
        return { ok: true, id };
      }
      if (rng.P(0.35)) {
        const dmg = 6 * (1 + pj.tier); TT.ev.hp(c, -dmg); const w = pj.tier >= 2 && rng.P(0.4) ? TT.loss.hurt(c, 1) : '';
        TT.log(c, 'Nổ lò! ' + nm + ' tan thành tro, bạn bị thương (sinh lực -' + dmg + ').' + (w ? ' ' + w + '.' : ''), 'bad', 'Xác suất thành công chỉ ' + Math.round(p * 100) + '% (cấp nghề ' + lv + ', cần ' + req + '); thất bại nặng có 35% nổ lò.');
      } else TT.log(c, 'Luyện ' + nm + ' thất bại, vật liệu hóa phế phẩm.', 'bad', 'Xác suất thành công ' + Math.round(p * 100) + '% (cấp nghề ' + lv + ', cần ' + req + '). Nâng cấp nghề, dùng lò tốt hơn hoặc luyện ở nơi có địa hỏa để tăng.');
      return { ok: false };
    },
    // Máy tự chọn bản vẽ tốt nhất làm được: ưu tiên cải thiện ô yếu nhất.
    autoPick(c) {
      const lv = craft.level(c, 'khi'); let best = null;
      ['weapon', 'armor', 'helm', 'relic'].forEach(slot => {
        const cur = c.equip && c.equip[slot], curP = cur ? D.ITEMS[cur].pct : 0;
        for (let t = 3; t >= 0; t--) {
          const spec = { slot, tier: t, stat: slot === 'relic' ? rng.pick(['atk', 'hpMax', 'nl']) : null };
          if (craft.why(c, spec)) continue;
          const mid = slot === 'relic' ? D.GEAR.RELIC_BASE[t] * 1.0 : (D.GEAR.PCT[t][0] + D.GEAR.PCT[t][1]) / 2;
          if (mid > curP + 0.01 && (!best || mid - curP > best.gain)) best = { spec, gain: mid - curP };
          break;
        }
      });
      return best && best.spec;
    },
    // Một tháng luyện khí theo quy trình mới.
    khiMonth(c) {
      const cr = craft.ensure(c), st = cr.khi, apt = craft.aptitude(c, 'khi');
      let gain = rng.RI(3, 6) * apt * (craft.specialist(c, 'khi') ? 1.3 : 1);
      if (!cr.proj) { const spec = craft.autoPick(c); if (spec) craft.start(c, spec); }
      if (cr.proj) {
        cr.proj.left--;
        if (cr.proj.left <= 0) craft.finish(c);
      } else {
        // chưa đủ vật liệu: đi tìm hoặc mua khoáng thạch
        gain *= 0.5;
        const t = TT.market.typeOf(c);
        const tierW = st.lv >= 6 && rng.P(0.25) ? 2 : st.lv >= 3 && rng.P(0.6) ? 1 : 0, ore = craft.ORE[tierW];
        if (t && TT.market.sells(c, ore) && TT.ls.can(c, TT.market.buyPrice(c, ore, t) * 3)) { TT.market.buy(c, ore); TT.market.buy(c, ore); TT.market.buy(c, ore); }
        else if (rng.P(Math.min(0.95, 0.6 * TT.res.power(c, 'ore') / 1.15))) { TT.items.add(c, tierW >= 1 && !craft.diaHoa(c) ? craft.ORE[0] : ore, tierW >= 1 ? 1 : 2); TT.res.take(c, 'ore', D.RES_RULES.takeOre); if (rng.P(0.2)) TT.log(c, 'Bạn đi thu thập khoáng thạch để luyện khí.', 'age'); }
      }
      craft.addXp(c, 'khi', gain);
      if (TT.market.typeOf(c)) TT.market.autoSell(c);
      return true;
    },

    // Một tháng luyện nghề. Trả về true nếu có làm gì.
    monthly(c) {
      const cr = craft.ensure(c);
      const id = cr.focus || craft.bestFocus(c), d = D.CRAFTS[id], st = cr[id];
      if (id === 'khi') return craft.khiMonth(c);
      const apt = craft.aptitude(c, id);
      let gain = rng.RI(3, 6) * apt * (craft.specialist(c, id) ? 1.3 : 1);
      if (d.mat) {
        // Cần nguyên liệu: lượng tính theo giá trị món làm ra (khoảng 55% giá bán), nên chế đồ quý không còn lãi vô lý.
        // Có sẵn thì dùng, ở chợ thì mua thêm, không thì đi tìm (chậm).
        const r = craft.pickRecipe(c, id);
        const n = r ? craft.matNeed(c, r[1], d.mat) : 2;
        const have = TT.items.count(c, d.mat);
        if (have < n) {
          const t = TT.market.typeOf(c), lack = n - have;
          const price = t ? TT.market.buyPrice(c, d.mat, t) : 0;
          if (t && TT.market.sells(c, d.mat) && TT.ls.wealth(c) >= price * lack * 1.2) { for (let i = 0; i < lack; i++) if (!TT.market.buy(c, d.mat).ok) break; }
          if (TT.items.count(c, d.mat) < n) { // không mua đủ (hết hàng, hết hạn mức, không có cửa hàng): đi tìm chậm
            gain *= 0.3;
            const rk = d.mat === 'linh_thao' ? 'herb' : null, pw = rk ? TT.res.power(c, rk) / 1.15 : 1;
            if (rng.P(Math.min(0.95, 0.5 * pw))) { TT.items.add(c, d.mat); if (rk) TT.res.take(c, rk, D.RES_RULES.takeHerb); if (rng.P(0.3)) TT.log(c, 'Bạn đi thu thập ' + D.ITEMS[d.mat].n + ' để luyện nghề.', 'age'); }
            craft.addXp(c, id, gain);
            return true;
          }
        }
        TT.items.remove(c, d.mat, n);
        if (r) {
          const lv = st.lv, p = rng.clamp(0.5 + 0.04 * (lv - r[0]) + apt * 0.1, 0.3, 0.92);
          if (rng.P(p)) {
            const qty = 1 + (rng.P(0.1 + lv * 0.01) ? 1 : 0);
            TT.items.add(c, r[1], qty);
            c.craftMade = (c.craftMade || 0) + qty;
            if (rng.P(0.35) || qty > 1) TT.log(c, d.n + ' thành công: ' + D.ITEMS[r[1]].n + (qty > 1 ? ' x' + qty : '') + '.', 'good');
          } else if (rng.P(0.3)) TT.log(c, d.n + ' thất bại, nguyên liệu hao mất.', 'bad');
        }
      }
      craft.addXp(c, id, gain);
      if (TT.market.typeOf(c)) TT.market.autoSell(c);
      return true;
    },

    addXp(c, id, g) {
      const cr = craft.ensure(c), st = cr[id], cap = craft.cap(c, id);
      if (c.kind === 'player') g *= TT.path.mods(c).craft;
      if (st.lv >= cap) { st.xp = Math.min(st.xp, need(st.lv)); if (!cr.warned || cr.warned !== id + st.lv) { cr.warned = id + st.lv; TT.log(c, D.CRAFTS[id].n + ' đã chạm trần cấp ' + st.lv + '. Cần ' + (craft.specialist(c, id) ? 'tâm đắc' : 'thành viên tông môn chuyên nghề hoặc tâm đắc') + ' và cảnh giới cao hơn để tiến thêm.', 'age'); } return; }
      st.xp += g;
      while (st.lv < cap && st.xp >= need(st.lv)) {
        st.xp -= need(st.lv); st.lv++;
        TT.log(c, D.CRAFTS[id].n + ' đạt cấp ' + st.lv + '!', 'big');
      }
    }
  };
})();
