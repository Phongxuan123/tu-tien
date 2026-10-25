// Túi đồ, trang bị và chợ. Túi đồ là bảng { idVậtPhẩm: số lượng } trong nhân vật (c.inv), trang bị ở c.equip.
// NPC không dùng túi đồ (giữ nhịp thế giới), chỉ người chơi.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats;

  const items = TT.items = {
    def: id => D.ITEMS[id] || null,
    value(c, id) { const d = D.ITEMS[id]; return Math.round(d.valueFn ? d.valueFn(c) : d.value); },
    count(c, id) { return (c.inv && c.inv[id]) || 0; },
    has(c, id) { return items.count(c, id) > 0; },
    // Hạn dùng (tháng) của đan dược, bùa và linh thảo; null nếu không hỏng. Mỗi chồng vật phẩm có một đồng hồ riêng (c.invExp).
    life(id) { const d = D.ITEMS[id]; if (!d) return null; const g = d.cat === 'dan' ? 'dan' : d.cat === 'bua' || id === 'phu_giay' ? 'bua' : id === 'linh_thao' ? 'thao' : null; return g ? D.ECO.life[g] : null; },
    remaining(c, id) { const L = items.life(id); if (!L || !items.has(c, id)) return null; const e = c.invExp && c.invExp[id]; return e == null ? L : e; },
    // Thêm k món vào chồng đang có n món: thời gian còn lại cộng thêm theo tỉ lệ k/(n+k) của hạn dùng, không quá hạn tối đa.
    add(c, id, n) {
      c.inv = c.inv || {}; n = n || 1;
      const L = items.life(id);
      if (L && c.kind === 'player') {
        const have = c.inv[id] || 0, r = have > 0 ? items.remaining(c, id) : 0;
        c.invExp = c.invExp || {}; c.invExp[id] = Math.min(L, r + L * n / (have + n));
      }
      c.inv[id] = (c.inv[id] || 0) + n;
    },
    remove(c, id, n) {
      n = n || 1;
      if (items.count(c, id) < n) return false;
      c.inv[id] -= n;
      if (c.inv[id] <= 0) { delete c.inv[id]; if (c.invExp) delete c.invExp[id]; }
      if (c.sus && c.sus[id] && TT.gd) TT.gd.trim(c, id);
      return true;
    },
    // Chồng sắp hỏng (còn 3 tháng trở xuống, thử mỗi tháng): chế độ Cân bằng và Tự động tự xử lý nếu đang ở nơi làm được: ở tông thì hiến kho tông, ở nơi có cửa hàng thu thì bán.
    autoRescue(c, id) {
      if (TT.decisions && TT.decisions.mode() === 'thu_cong') return false;
      const d = D.ITEMS[id]; if (!d) return false;
      const pl = TT.map.place(c.place);
      if (c.sect && pl && pl.type === 'tong_mon' && !c.travel && !c.cross) { const r = TT.sect.donateItem(c, id, c.inv[id]); if (r.ok) return true; }
      if (market.typeOf(c) && market.buyerOf(c, id)) { const r = market.sell(c, id, c.inv[id]); if (r.ok) { TT.log(c, 'Thấy ' + d.n + ' sắp hỏng, bạn tự bán bớt.', 'age'); return !items.has(c, id); } }
      return false;
    },
    // Mỗi tháng của người chơi: hạn dùng giảm 1; báo khi còn 3 tháng; hết hạn thì hỏng cả chồng.
    tick(c) {
      c.invExp = c.invExp || {};
      Object.keys(c.inv || {}).forEach(id => {
        if (!items.life(id)) return;
        const r = items.remaining(c, id) - 1; c.invExp[id] = r;
        const nm = D.ITEMS[id].n;
        if (r <= 0) { TT.log(c, c.inv[id] + ' ' + nm + ' đã hết hạn và hỏng.', 'bad'); delete c.inv[id]; delete c.invExp[id]; }
        else if (r <= D.ECO.decay.last && items.autoRescue(c, id)) { /* đã tự xử lý */ }
        else if (r <= D.ECO.decay.last && r + 1 > D.ECO.decay.last) TT.log(c, nm + ' sắp hết hạn (còn ' + D.ECO.decay.last + ' tháng), nên dùng hoặc bán sớm.', 'age');
      });
    },
    // Danh sách trong túi, xếp theo loại.
    list(c) {
      const order = ['ls', 'dan', 'bua', 'khi', 'lo', 'sach', 'dac', 'lieu'];
      return Object.keys(c.inv || {}).filter(id => D.ITEMS[id]).sort((a, b) =>
        order.indexOf(D.ITEMS[a].cat) - order.indexOf(D.ITEMS[b].cat) || D.ITEMS[a].n.localeCompare(D.ITEMS[b].n)).map(id => ({ id, n: c.inv[id], d: D.ITEMS[id] }));
    },

    // Tổng hiệu chỉnh chỉ số của trang bị (hpMax, atk, nl, luck, kv...).
    // Thưởng từ trang bị: phần trăm của sức mạnh gốc, mỗi món vào chỉ số riêng (xem gear.js). Trần 30% mỗi món, pháp bảo bản mệnh thêm tối đa 15%.
    mod(c, k) {
      const e = c.equip;
      if (!e || (k !== 'atk' && k !== 'hpMax' && k !== 'nl')) return 0;
      let pct = 0;
      for (const slot in D.EQUIP_SLOTS) { const d = e[slot] && D.ITEMS[e[slot]]; if (d && d.stat === k) pct += d.pct; }
      return pct ? TT.gear.base(c, k) * pct : 0;
    },
    // Pháp bảo bản mệnh đang đeo (định nghĩa) hoặc null.
    relic(c) { const id = c.equip && c.equip.relic; return id ? D.ITEMS[id] : null; },
    relicElem(c) { const d = items.relic(c); return d ? d.elem : null; },
    // Pháp bảo lớn lên theo thời gian đeo (gọi mỗi tháng): mỗi cấp +1,5%, bị cảnh giới giới hạn.
    relicGrow(c, train) {
      const id = c.equip && c.equip.relic, d = id && D.ITEMS[id];
      if (!d || !d.relic) return;
      const cap = Math.min(D.GEAR.RELIC_LV, c.realm * 2);
      if (d.lv >= cap) return;
      c.relicXp = (c.relicXp || 0) + (train ? 1 : 0.5);
      const need = Math.round(8 * Math.pow(d.lv + 1, 1.5));
      if (c.relicXp >= need) {
        c.relicXp -= need;
        const nid = TT.gear.withLv(id, d.lv + 1); c.equip.relic = nid;
        TT.log(c, D.ITEMS[nid].n + ' lớn lên: ' + D.ITEMS[nid].desc.split('. ')[1], 'good');
      }
    },
    // Vật liệu rơi từ yêu thú: nanh hoặc da mang thuộc tính của nó (người chơi mới có túi). Trả về tên vật phẩm hoặc ''.
    matDrop(c, def, p) {
      if (c.kind !== 'player' || !def || !def.elem || !rng.P(p == null ? 0.5 : p)) return '';
      const id = TT.gear.matKey(rng.P(0.5) ? 'nanh' : 'da', def.elem, Math.min(3, def.tier || 0));
      items.add(c, id); return D.ITEMS[id].n;
    },
    canEquip(c, id) {
      const d = D.ITEMS[id];
      if (!d || d.cat !== 'khi') return 'Không phải pháp khí';
      if (d.minRealm && c.realm < d.minRealm) return 'Cần cảnh giới ' + D.REALM_NAMES[d.minRealm] + ' trở lên';
      return false;
    },
    equip(c, id) {
      const why = items.canEquip(c, id);
      if (why) return { ok: false, text: why };
      if (!items.remove(c, id)) return { ok: false, text: 'Không có vật phẩm này' };
      const d = D.ITEMS[id];
      c.equip = c.equip || {};
      if (c.equip[d.slot]) items.add(c, c.equip[d.slot]);
      c.equip[d.slot] = id;
      c.hp = Math.min(c.hp, S.hpMax(c));
      TT.log(c, 'Bạn trang bị ' + d.n + '.', 'age');
      return { ok: true, text: 'Đã trang bị ' + d.n + '.' };
    },
    unequip(c, slot) {
      const id = c.equip && c.equip[slot];
      if (!id) return { ok: false, text: 'Chưa trang bị gì' };
      items.add(c, id); c.equip[slot] = null; c.hp = Math.min(c.hp, S.hpMax(c)); if (slot === 'relic') c.relicXp = 0;
      return { ok: true, text: 'Đã tháo ' + D.ITEMS[id].n + '.' };
    },

    // Dùng một vật phẩm trong túi. Đan dược dùng ngay; bí kíp học công pháp; tâm đắc nâng trần nghề; pháp khí thì trang bị.
    use(c, id) {
      const d = D.ITEMS[id];
      if (!d || !items.has(c, id)) return { ok: false, text: 'Không có vật phẩm này' };
      if (D.ITEM_USE[id]) { items.remove(c, id); const t = D.ITEM_USE[id](c); TT.log(c, t, 'good'); return { ok: true, text: t }; }
      if (d.cat === 'sach') return TT.tech.read(c, id);
      if (d.cat === 'dac') return TT.craft.readDac(c, id);
      if (d.cat === 'khi') return items.equip(c, id);
      if (d.cat === 'ls') return TT.ls.manual(c, d.tier);
      if (d.cat === 'dan' || d.cat === 'bua') return { ok: false, text: 'Vật phẩm này được dùng đúng lúc: ' + (d.cat === 'dan' ? 'khi đột phá (ở hộp chuẩn bị).' : 'tự động trong trận chiến hoặc khi bỏ chạy.') };
      return { ok: false, text: 'Chưa dùng được vật phẩm này' };
    },
    // Dùng tự động khi sinh lực thấp (theo quy tắc). Trả về true nếu đã dùng.
    autoHeal(c) {
      if (!items.has(c, 'hoi_xuan_dan')) return false;
      return items.use(c, 'hoi_xuan_dan').ok;
    }
  };

  // ---------- chợ ----------
  // Mua bán chỉ diễn ra ở CỬA HÀNG (công trình, xem buildings.js): mỗi cửa hàng có kho, danh sách bán, nhóm hàng thu mua riêng,
  // và mọi giao dịch trong tháng bị giới hạn bởi hạn mức của nơi. Không có cửa hàng ở nơi đứng thì không mua bán được.
  const market = TT.market = {
    // Loại nơi (khóa D.SHOPS) nếu nơi đang đứng có cửa hàng; 'rong' nếu chỉ có hàng rong; null nếu không mua bán được.
    typeOf(c) {
      if (!c.place || c.travel || c.cross || c.dungeon) return null;
      const shops = TT.bld.shopsAt(c); if (!shops.length) return null;
      const p = TT.map.place(c.place);
      return p && D.SHOPS[p.type] && D.SHOPS[p.type].buy ? p.type : 'rong';
    },
    // Cửa hàng ở nơi đang đứng, và cửa hàng cụ thể bán/thu món này.
    shops(c) { return TT.bld.shopsAt(c); },
    // Không chỉ định cửa hàng thì chọn nơi bán rẻ nhất / thu cao nhất (còn hàng).
    sellerOf(c, id, bld) {
      const t = market.typeOf(c), L = (bld ? [bld] : TT.bld.shopsAt(c)).filter(b => TT.bld.shopsAt(c).indexOf(b) >= 0 && TT.bld.sells(c, b).indexOf(id) >= 0);
      return L.sort((a, b) => market.buyPrice(c, id, t, a) - market.buyPrice(c, id, t, b))[0] || null;
    },
    buyerOf(c, id, bld) {
      const L = (bld ? [bld] : TT.bld.shopsAt(c)).filter(b => TT.bld.shopsAt(c).indexOf(b) >= 0 && TT.bld.buys(b, id));
      return L.sort((a, b) => market.sellPrice(c, id, b) - market.sellPrice(c, id, a))[0] || null;
    },
    sells(c, id) { return !!market.sellerOf(c, id); },
    // Danh sách bán ở nơi nhân vật đứng (gộp mọi cửa hàng, giữ giá thấp nhất): [{ id, price, bld, qty }]
    stock(c, bld) {
      const t = market.typeOf(c); if (!t) return [];
      const seen = {}, out = [];
      (bld ? [bld] : TT.bld.shopsAt(c)).forEach(b => {
        const st = TT.bld.state(c, b);
        TT.bld.sells(c, b).forEach(id => {
          const row = { id, bld: b, price: market.buyPrice(c, id, t, b), qty: st.q[id] };
          if (!seen[id] || row.price < seen[id].price) { if (seen[id]) out.splice(out.indexOf(seen[id]), 1); seen[id] = row; out.push(row); }
        });
      });
      return out;
    },
    // Giá mua của người chơi (t: loại nơi; b: cửa hàng, hàng rong đắt hơn).
    buyPrice(c, id, t, b) {
      const sh = D.SHOPS[t || market.typeOf(c)] || D.SHOPS.rong;
      return Math.max(1, Math.ceil(items.value(c, id) * (b === 'rong' ? D.SHOPS.rong.buy : sh.buy) * TT.eco.buyMul(c, id, b || 'cho') * (TT.job ? TT.job.buyMul(c) : 1)));
    },
    sellPrice(c, id, b) {
      const t = market.typeOf(c);
      if (D.ITEMS[id].cat === 'ls') return items.value(c, id);
      const sell = b === 'rong' ? D.SHOPS.rong.sell : (t && D.SHOPS[t] ? D.SHOPS[t].sell : 0.4);
      return Math.max(1, Math.floor(items.value(c, id) * sell * (b ? TT.bld.sellBonus(b) : 1) * TT.eco.sellMul(c, id, b || 'cho')));
    },
    // Sau giao dịch: mua dồn đẩy giá lên, bán dồn kéo giá xuống; thương hội ghi nhớ; chợ có thể kết thân.
    after(c, id, b, value, n, buying) {
      const g = TT.eco.group(id);
      if (b === 'hoi' && D.ECO.hq && TT.hoi) TT.hoi.progress(c, id, n, buying); // đơn hội (E7b)
      if (g) TT.eco.push(c.region, g, (buying ? D.ECO.press.buy : -D.ECO.press.sell) * n);
      if (b === 'hoi') TT.hoi.onTrade(c, value, buying);
      if (b === 'cho' && buying) TT.eco.chat(c, value);
      if (!buying) c.tradeEarn = (c.tradeEarn || 0) + value;
    },
    // Mua một món: cần cửa hàng bán món đó, còn hàng, đủ tiền, còn hạn mức tháng.
    buy(c, id, bld) {
      const t = market.typeOf(c);
      if (!t) return { ok: false, text: 'Ở đây không có cửa hàng nào để mua.' };
      const b = market.sellerOf(c, id, bld);
      if (!b) return { ok: false, text: 'Không cửa hàng nào ở đây bán món đó.' };
      const st = TT.bld.state(c, b), price = market.buyPrice(c, id, t, b);
      if (!(st.q[id] > 0)) return { ok: false, text: 'Cửa hàng hết món này, chờ tháng sau họ nhập thêm.' };
      if (!TT.ls.can(c, price)) return { ok: false, text: 'Không đủ linh thạch (cần ' + TT.ls.fmt(price) + ').' };
      if (price > TT.bld.left(c)) return { ok: false, text: 'Đã gần hết hạn mức giao dịch tháng này (còn ' + TT.ls.fmt(TT.bld.left(c)) + ').' };
      TT.ls.pay(c, price); st.q[id]--; TT.bld.spend(c, price);
      // chợ đen có thể bán đồ nhái; Thương nhân giỏi nhìn ra (giảm xác suất theo tầm nhìn thị trường)
      if (!D.ECO.hq && b === 'den' && D.ITEMS[id].cat !== 'ls' && rng.P(D.ECO.nhai * (1 - 0.15 * TT.eco.insight(c)))) {
        TT.log(c, 'Món ' + D.ITEMS[id].n + ' mua ở chợ đen hóa ra là đồ nhái, bạn mất ' + TT.ls.fmt(price) + '.', 'bad');
        return { ok: true, text: 'Đồ nhái! Bạn bị lừa, mất ' + TT.ls.fmt(price) + '.', bld: b };
      }
      items.add(c, id);
      if (b === 'den' && D.ECO.hq) TT.gd.mark(c, id, D.ECO.nhai * (1 - 0.15 * TT.eco.insight(c))); // E7b: đồ chợ đen chưa giám định, có thể là đồ nhái
      market.after(c, id, b, price, 1, true);
      TT.log(c, 'Bạn mua ' + D.ITEMS[id].n + ' ở ' + TT.bld.name(b).toLowerCase() + ', giá ' + TT.ls.fmt(price) + '.', 'age');
      return { ok: true, text: 'Đã mua ' + D.ITEMS[id].n + '.', bld: b };
    },
    // Bán n món: chỉ cửa hàng thu nhóm hàng đó mới mua; bị cắt bớt nếu vượt hạn mức tháng.
    sell(c, id, n, bld) {
      n = n || 1;
      const t = market.typeOf(c);
      if (!t) return { ok: false, text: 'Ở đây không có cửa hàng nào để bán.' };
      if (!items.has(c, id)) return { ok: false, text: 'Không có vật phẩm này.' };
      const b = market.buyerOf(c, id, bld);
      if (!b) return { ok: false, text: 'Không cửa hàng nào ở đây thu mua món này (' + D.ITEMS[id].n + ').' };
      const unit = market.sellPrice(c, id, b), left = TT.bld.left(c);
      n = Math.min(n, items.count(c, id), Math.floor(left / unit));
      if (n < 1) return { ok: false, text: 'Đã hết hạn mức giao dịch tháng này (còn ' + TT.ls.fmt(left) + ').' };
      const price = unit * n, st = TT.bld.state(c, b);
      items.remove(c, id, n); TT.ev.gold(c, price); TT.bld.spend(c, price); market.after(c, id, b, price, n, false);
      if (TT.bld.sells(c, b).indexOf(id) >= 0) st.q[id] = Math.min(TT.bld.baseQty(c, id) * 3, (st.q[id] || 0) + n);
      TT.log(c, 'Bạn bán ' + n + ' ' + D.ITEMS[id].n + ' ở ' + TT.bld.name(b).toLowerCase() + ', được ' + TT.ls.fmt(price) + '.', 'age');
      return { ok: true, text: 'Đã bán, nhận ' + TT.ls.fmt(price) + '.', n, bld: b };
    },
    // Bán bớt hàng thừa khi đang ở chợ: giữ vài món dùng được và nguyên liệu, trang bị món tốt nhất rồi bán phần còn lại.
    // Không bao giờ bán bí kíp và tâm đắc.
    autoSell(c) {
      if (!market.typeOf(c)) return 0;
      items.autoEquip(c);
      let n = 0;
      Object.keys(c.inv || {}).forEach(id => {
        const d = D.ITEMS[id];
        if (!d || d.cat === 'sach' || d.cat === 'dac' || d.cat === 'ls' || d.cat === 'lo' || d.relic || d.ky) return;
        const keep = d.cat === 'lieu' ? (d.ore || d.mat ? 12 : 8) : d.cat === 'khi' ? 0 : 3;
        const extra = c.inv[id] - keep;
        if (extra > 0) { const r = market.sell(c, id, extra); if (r.ok) n += r.n; }
      });
      return n;
    }
  };

  // Tự trang bị món tốt hơn (theo phần trăm cộng) nếu đủ cảnh giới, mỗi ô một món; chuyển đồ ô bùa cũ (nếu có) về túi.
  items.autoEquip = function (c) {
    c.equip = c.equip || {};
    if (c.equip.charm) { items.add(c, c.equip.charm); delete c.equip.charm; }
    const cand = Object.keys(c.inv || {}).filter(id => D.ITEMS[id] && D.ITEMS[id].cat === 'khi' && !items.canEquip(c, id));
    Object.keys(D.EQUIP_SLOTS).forEach(slot => {
      const best = cand.filter(id => D.ITEMS[id].slot === slot).sort((a, b) => D.ITEMS[b].pct - D.ITEMS[a].pct)[0];
      const cur = c.equip[slot];
      if (best && (!cur || D.ITEMS[cur].pct < D.ITEMS[best].pct)) items.equip(c, best);
    });
  };})();
