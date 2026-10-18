// Công trình của từng nơi: cửa hàng (có kho riêng, thu mua đúng nhóm hàng, hạn mức giao dịch mỗi tháng) và dịch vụ (y quán, quán trọ, tửu lâu...).
// Dữ liệu ở js/data/buildings.js; hình vẽ ở js/ui/bldart.js; mua bán thật nằm ở TT.market (items.js) và dùng các hàm ở đây.
// Trạng thái lưu: world.shop[nơi|cửa hàng] = { m: tháng cập nhật, q: { id: số lượng tồn } }; c.trade = { m: tháng, spent: vàng đã giao dịch }.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data;

  const hashStr = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 1000003; return h; };
  const frac = n => { const s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s); };

  // ---------- công trình trong tông môn: nơi làm việc của đệ tử (tab Tông môn chỉ để theo dõi) ----------
  const SECT_BLD = ['son', 'chap', 'duoc', 'tang', 'ngoai', 'dien', 'khoc', 'tran', 'bi'];
  const LINE_OF = { chap: 'chap', duoc: 'duoc', tang: 'tang', ngoai: 'ngoai' };
  function sectService(c, id, out) {
    const d = D.SECTS[c.place], mine = c.sect && c.sect.id === c.place, s = mine ? TT.sect.ensure(c) : null, L = LINE_OF[id];
    const opt = (label, run, o) => out.options.push(Object.assign({ label, run }, o || {}));
    if (id === 'son') {
      out.info = true; out.text = 'Cổng sơn môn của ' + d.n + '. Người ngoài xin nhập môn ở đây; đệ tử đi các nhà khác để làm việc.';
      if (s && s.rank < 4) opt('Rời tông môn', c2 => { TT.sect.leave(c2, 'tự xin rời'); return 'Bạn đã rời ' + d.n + '.'; }, { confirm: 'Rời ' + d.n + '? Mọi cống hiến sẽ mất' + (s.rank >= 3 ? ', và bỏ chức vị cao là phản bội, chưởng môn sẽ ghi hận.' : '.') });
      return;
    }
    if (!s) { out.text = (id === 'tran' ? 'Trận đài của ' + d.n : 'Nơi này') + ' chỉ dành cho đệ tử của tông. Hãy xin nhập môn ở Sơn môn.'; return; }
    if (L) { // bốn nhà của bốn đường
      const LD = D.SECT_LINES[L];
      out.text = LD.desc + ' ' + ({ chap: 'Luật tông: ' + D.SECT_LAWS[d.law].n + '.', duoc: 'Linh thảo và lò đan của tông ở đây.', tang: 'Tuyệt học của tông: ' + (d.secret ? d.secret.n : '') + (s.rank >= 2 ? ' (bạn đã học).' : ' (mở khi lên Chân truyền).'), ngoai: 'Tin tức, thư từ, thương đoàn của tông đi qua đây.' })[L];
      if (s.warn) out.note = 'Bạn đang bị cảnh cáo ' + s.warn + ' lần vì phạm luật tông.';
      if (s.rank < 1) out.note = (out.note ? out.note + ' ' : '') + 'Ngoại môn chưa chọn đường, nhưng vẫn nhận việc được. Lên nội môn sẽ chọn đường.';
      else if (s.line === L) out.note = (out.note ? out.note + ' ' : '') + 'Bạn đang theo đường này.';
      else opt('Theo đường ' + LD.n + (s.line ? ' (đổi tốn ' + D.SECT_BI.lineChangeCost + ' cống hiến)' : ' (miễn phí lần đầu)'), c2 => TT.sect.setLine(c2, L).text);
      if (L === 'chap' && s.warn) opt('Nộp phạt xóa một lần cảnh cáo (40 cống hiến)', c2 => TT.sect.payFine(c2).text);
      if (s.task) {
        const td = TT.sect.taskDef(s.task);
        out.note = (out.note ? out.note + ' ' : '') + 'Việc đang làm: ' + td.n + ' (' + (s.task.dur - s.task.left) + '/' + s.task.dur + ' tháng; chỉ tiến triển khi "Kiếm sống").';
        opt('Bỏ dở việc đang làm (cống hiến -10)', c2 => TT.sect.abandonTask(c2).text, { confirm: 'Bỏ dở việc này? Cống hiến -10.' });
      }
      (s.board || []).forEach((t, i) => {
        if (t.line !== L) return;
        const td = TT.sect.taskDef(t);
        opt('Nhận việc: ' + td.n + ' (' + t.dur + ' tháng, +' + t.contrib + ' cống hiến, ' + TT.ls.fmt(t.pay) + ')', c2 => TT.sect.acceptTask(c2, (c2.sect.board || []).indexOf(t)).text, { disabled: s.task ? 'Đang có việc chưa xong' : false });
      });
      if (!(s.board || []).some(t => t.line === L)) out.note = (out.note ? out.note + ' ' : '') + 'Bảng việc của đường này đang trống, vài tháng nữa sẽ có việc mới.';
      return;
    }
    if (id === 'dien') {
      const head = TT.sect.head(d.id || c.place), nx = TT.sect.nextRank(c), ms = s.master ? TT.world.chars[s.master] : null;
      out.text = 'Điện chưởng môn của ' + d.n + '. ' + (head ? 'Chưởng môn: ' + head.name + ' (' + TT.stats.realmName(head) + '). ' : '') + 'Bạn là ' + D.SECT_RANKS[s.rank] + '.';
      out.note = (ms && ms.alive ? 'Sư phụ của bạn: ' + ms.name + ' (' + TT.stats.realmName(ms) + '). ' : '') + (nx ? (nx.ok ? 'Bạn đủ điều kiện lên ' + D.SECT_RANKS[nx.rank] + '.' : 'Lên ' + D.SECT_RANKS[nx.rank] + ' còn thiếu: ' + nx.why.join('; ') + '.') : '');
      const pcs = TT.pact.of(c.place).map(p => TT.pact.name(p) + ' (' + TT.pact.mood(p) + ')');
      if (pcs.length) out.note = (out.note ? out.note + ' ' : '') + 'Hiệp ước của tông: ' + pcs.join('; ') + '.';
      if (nx) opt('Xin thăng ' + D.SECT_RANKS[nx.rank], c2 => TT.sect.petitionPromote(c2).text, { disabled: nx.ok ? false : 'Chưa đủ điều kiện' });
      return;
    }
    if (id === 'khoc') {
      out.text = 'Kho cống hiến của tông: đổi cống hiến lấy vật phẩm. Cống hiến hiện có ' + Math.floor(s.contrib) + '. Kho tông đang ' + TT.sect.resName(d.id || c.place).toLowerCase() + ' nên giá nhân x' + TT.sect.priceMul(c.place) + '.';
      const P = D.SECT_RES, left = Math.max(0, P.donateCap - (s.donY || 0));
      out.note = 'Quyên góp: 1 hạ phẩm được ' + P.donateRate + ' cống hiến, năm nay còn quyên được ' + left + ' cống hiến.';
      [5, 10, 30].forEach(n => opt('Quyên ' + n + ' hạ phẩm', c2 => TT.sect.donate(c2, n).text, { disabled: n * P.donateRate > left ? 'Hết hạn mức năm' : (!TT.ls.can(c, n * D.LS.RATE) ? 'Không đủ linh thạch' : false) }));
      TT.sect.shopList(c).forEach(item => { const why = TT.sect.shopState(c, item); opt('Đổi: ' + item.n + ' (' + item.cost + ' cống hiến)', c2 => TT.sect.buy(c2, item.id).text, { disabled: why || false }); });
      return;
    }
    if (id === 'tran') {
      out.text = 'Trận đài truyền tống của ' + d.n + '. Chỉ trưởng lão trở lên đủ cống hiến và linh thạch mới dùng được; đi là tới nơi tức thì, khá an toàn.';
      const opts = TT.cross.options(c);
      if (!opts.length) out.note = 'Hiện không có lối đi nào từ đây.';
      opts.forEach(o => opt((o.ok ? 'Xuất phát: ' : 'Chưa đủ: ') + o.title + ' (' + TT.ls.fmt(o.gold) + (o.contrib ? ', ' + o.contrib + ' cống hiến' : '') + ')', c2 => TT.cross.start(c2, o.key).text, { disabled: o.ok ? false : o.why.join('; '), close: true, confirm: o.title + '\n' + o.note + '\nXác nhận?' }));
      return;
    }
    if (id === 'bi') {
      out.text = 'Đài đại bỉ của ' + d.n + '. Năm năm một lần, ba nhóm: ngoại môn, nội môn, chân truyền. Kỳ tới sau khoảng ' + TT.sect.biNext(c.place) + ' năm. Tới kỳ, bạn sẽ được mời lên đài (nội môn trở lên được hỏi, ngoại môn tự thi).';
      const rec = TT.world.sectBi && TT.world.sectBi[c.place];
      out.note = rec ? 'Kỳ gần nhất: năm ' + rec.year + ' (nhóm ' + D.SECT_BI.groups[sectGroup(c)] + ' có ' + ((rec.scores[sectGroup(c)] || []).length) + ' đối thủ ghi danh).' : 'Chưa có kỳ đại bỉ nào được ghi.';
    }
  }
  const sectGroup = c => Math.min(2, c.sect.rank);
  const bld = TT.bld = {
    sizeOf(placeId) { const p = TT.map.place(placeId); return (p && D.PLACE_SIZE[p.type]) || 'lang'; },
    isShop: id => D.SHOP_IDS.indexOf(id) >= 0,
    // Hàng rong ghé nơi này trong quý hiện tại? (xác định theo nơi và quý, không dùng bộ sinh số ngẫu nhiên của thế giới)
    rongHere(placeId, months) {
      const p = TT.map.place(placeId); if (!p) return false;
      const pr = D.RONG[p.type]; if (!pr) return false;
      return frac(hashStr(placeId) + Math.floor(months / 3) * 7.31) < pr;
    },
    // Công trình của nơi nhân vật đang đứng (theo loại nơi, hội phủ vùng, hàng rong) (rỗng khi đang đi đường, vượt vùng, trong bí cảnh).
    at(c) {
      if (!c || !c.place || c.travel || c.cross || c.dungeon || (c.zone && TT.res.zoneOf(c))) return []; // ở khu tài nguyên giữa hoang dã thì không có công trình
      const p = TT.map.place(c.place); if (!p) return [];
      const list = D.PLACE_BLD[p.type] || [], out = [];
      list.forEach(id => { if (id === 'hoi' && !TT.fac.hoiAt(c.region).length) return; out.push(id); });
      if (bld.rongHere(c.place, TT.world.months)) out.unshift('rong');
      return out;
    },
    shopsAt(c) { return bld.at(c).filter(bld.isShop); },
    name: id => (TT.ui && TT.ui.bld && TT.ui.bld.defs[id] ? TT.ui.bld.defs[id].n : id),

    // Hàng bán của một cửa hàng ở nơi nhân vật đang đứng.
    sells(c, id) {
      const p = TT.map.place(c.place), reg = TT.map.region(c.region);
      let src = D.BSELL[id] || []; if (!Array.isArray(src)) src = src[p.type] || src.def || [];
      let ids = src.slice();
      if (id === 'thu' || id === 'den') {
        const tiers = id === 'thu' ? [0, 1] : [2];
        D.TECHS.forEach(tc => {
          if (tiers.indexOf(tc.tier) < 0) return;
          if (id === 'thu' && tc.elem && reg.elems.indexOf(tc.elem) < 0 && tc.tier < 2) return; // sách thuộc tính chỉ bán ở vùng hợp thuộc tính
          ids.push('bk_' + tc.id);
        });
        if (id === 'thu') ['tam_dac_kiem', 'tam_dac_khi', 'tam_dac_dan', 'tam_dac_bua'].forEach(i => ids.push(i));
      }
      if (id === 'rong') { // chọn 5 món theo nơi và quý
        const base = hashStr(c.place) + Math.floor(TT.world.months / 3) * 13, pool = D.RONG_POOL.slice(), out = [];
        for (let i = 0; i < 5 && pool.length; i++) { const k = Math.floor(frac(base + i * 3.7) * pool.length); out.push(pool.splice(k, 1)[0]); }
        ids = out;
      }
      return ids.filter(i => D.ITEMS[i]);
    },
    // Cửa hàng này có thu mua món này không?
    buys(id, itemId) {
      const d = D.ITEMS[itemId]; if (!d || d.cat === 'ls') return false;
      switch (id) {
        case 'cho': return d.cat === 'dan' || d.cat === 'bua' || d.cat === 'lieu' || (d.cat === 'khi' && !d.relic && d.tier === 0);
        case 'dan': return d.cat === 'dan' || itemId === 'linh_thao';
        case 'khi': return (d.cat === 'khi' && !d.relic) || !!d.ore || (d.cat === 'lieu' && !!d.part) || d.cat === 'lo';
        case 'bua': return d.cat === 'bua' || itemId === 'phu_giay';
        case 'thu': return d.cat === 'sach';
        case 'hoi': return d.cat === 'dan' || d.cat === 'bua' || d.cat === 'lieu';
        case 'den': return (d.cat === 'lieu' && (itemId === 'yeu_dan' || !!d.part)) || d.cat === 'sach' || (d.cat === 'khi' && !d.relic && d.tier >= 1);
        case 'rong': return d.cat !== 'dac' && !d.relic && d.cat !== 'lo';
        default: return false;
      }
    },
    // Nhóm hàng cửa hàng thu mua, để hiển thị.
    buysText(id) {
      return ({ cho: 'đan dược, bùa, nguyên liệu, khí cụ phàm', dan: 'đan dược, linh thảo', khi: 'khí cụ, khoáng thạch, nanh và da yêu thú, lò', bua: 'bùa chú, giấy bùa', thu: 'sách công pháp', hoi: 'đan dược, bùa, nguyên liệu (theo lô)', den: 'yêu đan, yêu liệu, sách, khí cụ linh phẩm trở lên', rong: 'hầu hết mọi thứ, giá thấp' })[id] || 'không thu mua';
    },
    // Hệ số giá bán cho cửa hàng (so với loại chợ cũ): chợ chung trả thấp hơn cửa hàng chuyên.
    sellBonus: id => (id === 'cho' ? 0.9 : id === 'rong' ? 1 : id === 'hoi' ? 1.05 : 1),

    // ---------- kho hàng ----------
    baseQty(c, id) {
      const v = Math.max(1, TT.items.value(c, id)), mul = D.STOCK_MUL[bld.sizeOf(c.place)] || 1;
      const g = TT.eco.group(id), sup = g ? Math.max(0.5, Math.min(1.5, TT.eco.supply(c.region, g))) : 1;
      return Math.max(1, Math.round(120 / Math.pow(v, 0.6) * mul * sup));
    },
    state(c, id) {
      const w = TT.world; w.shop = w.shop || {};
      const key = c.place + '|' + id; let s = w.shop[key];
      const ids = bld.sells(c, id), now = w.months;
      if (!s) { s = w.shop[key] = { m: now, q: {} }; ids.forEach(i => { s.q[i] = bld.baseQty(c, i); }); }
      else if (s.m !== now) { // hồi hàng: mỗi tháng thêm 25% lượng gốc
        const k = now - s.m; s.m = now;
        ids.forEach(i => { const b = bld.baseQty(c, i); s.q[i] = Math.min(b * 3, (s.q[i] == null ? b : s.q[i]) + Math.ceil(b * 0.25 * k)); });
      } else ids.forEach(i => { if (s.q[i] == null) s.q[i] = bld.baseQty(c, i); });
      return s;
    },

    // ---------- hạn mức giao dịch mỗi tháng ----------
    limitOf(c) {
      const sz = bld.at(c).indexOf('rong') >= 0 && bld.shopsAt(c).length === 1 ? 'rong' : bld.sizeOf(c.place);
      return Math.round((D.TRADE_LIMIT[sz] || 20) * (1 + c.realm));
    },
    used(c) { const t = c.trade; return t && t.m === TT.world.months ? t.spent : 0; },
    left(c) { return Math.max(0, bld.limitOf(c) - bld.used(c)); },
    spend(c, v) { c.trade = c.trade && c.trade.m === TT.world.months ? c.trade : { m: TT.world.months, spent: 0 }; c.trade.spent += v; },

    // Món đấu giá của quý (cố định theo nơi và quý): giá khởi điểm theo giá trị x chỉ số giá vùng, người đối địch trả ngẫu nhiên cố định.
    auctionLots(c) {
      const q = Math.floor(TT.world.months / 3), A = D.ECO.dgia;
      if (!bld._pool) bld._pool = Object.keys(D.ITEMS).filter(id => { const d = D.ITEMS[id]; return !d.relic && ((d.cat === 'khi' && d.tier >= 1) || (d.cat === 'sach' && id.indexOf('bk_') === 0) || id === 'yeu_dan' || d.cat === 'dac'); });
      const out = [], used = {};
      for (let i = 0; i < A.lots; i++) {
        const h0 = frac(hashStr(c.place) + q * 3.7 + i * 11.3); let k = Math.floor(h0 * bld._pool.length), n = 0;
        while (used[k] && n++ < bld._pool.length) k = (k + 1) % bld._pool.length;
        used[k] = 1; const id = bld._pool[k], g = TT.eco.group(id);
        const base = TT.items.value(c, id) * (g ? TT.eco.index(c.region, g) : 1) * 1.1;
        out.push({ id, base, rival: A.rivalMin + (A.rivalMax - A.rivalMin) * frac(hashStr(c.place + id) + q * 5.1 + i) });
      }
      return out;
    },

    // ---------- dịch vụ ----------
    // Trả { title, text, options: [{ label, run(c) -> chữ, disabled }] } cho công trình không phải cửa hàng.
    service(c, id) {
      const d = TT.ui && TT.ui.bld ? TT.ui.bld.defs[id] : { n: id, desc: '' };
      const pay = (fee, fn) => () => { if (!TT.ls.can(c, fee)) return 'Không đủ linh thạch (cần ' + TT.ls.fmt(fee) + ').'; TT.ls.pay(c, fee); return fn() + ' (đã trả ' + TT.ls.fmt(fee) + ')'; };
      const out = { title: d.n, text: d.desc, options: [], note: '' };
      if (id === 'yq') {
        const sev = TT.loss.active(c) ? c.wound.sev : 0, fee = Math.ceil(18 * (1 + c.realm) * (1 + sev * 0.8)), hurt = c.hp < TT.stats.hpMax(c) || sev > 0;
        out.text = 'Thầy thuốc xem mạch, bốc thuốc, châm cứu. Chữa dứt thương tích và hồi đầy sinh lực.';
        out.options.push({ label: 'Chữa trị (' + TT.ls.fmt(fee) + ')', disabled: hurt ? false : 'Bạn đang khỏe mạnh', run: pay(fee, () => { c.wound = null; c.hp = TT.stats.hpMax(c); TT.log(c, 'Bạn đến y quán chữa trị, thương thế lành hẳn.', 'good'); return 'Thương thế đã lành, sinh lực đầy.'; }) });
      } else if (id === 'tro') {
        const fee = Math.ceil(3 * (1 + c.realm)), done = c.flags && c.flags.troAt === TT.world.months;
        out.text = 'Một đêm yên giấc, ăn bữa nóng, hồi khoảng 40% sinh lực tối đa. Mỗi tháng nghỉ được một lần.';
        out.options.push({ label: 'Nghỉ một đêm (' + TT.ls.fmt(fee) + ')', disabled: done ? 'Tháng này bạn đã nghỉ rồi' : (c.hp >= TT.stats.hpMax(c) ? 'Bạn đang khỏe mạnh' : false), run: pay(fee, () => { c.flags = c.flags || {}; c.flags.troAt = TT.world.months; c.hp = Math.min(TT.stats.hpMax(c), c.hp + TT.stats.hpMax(c) * 0.4); return 'Bạn nghỉ một đêm, khỏe lên nhiều.'; }) });
      } else if (id === 'tuu') {
        const fee = Math.ceil(2 * (1 + c.realm)), ops = TT.rumors ? TT.rumors.active().filter(o => o.region === c.region || o.kind === 'ke_thu') : [];
        out.text = 'Tửu lâu đông người, ai cũng có chuyện để kể.';
        out.options.push({ label: 'Nghe ngóng tin đồn (' + TT.ls.fmt(fee) + ')', run: pay(fee, () => ops.length ? 'Nghe được: ' + ops.slice(0, 3).map(o => o.name).join('; ') + '.' : 'Hôm nay chẳng có tin gì đáng kể.') });
        const hoi = TT.fac.hoiAt(c.region);
        if (hoi.length) out.note = 'Người ta kháo nhau: vùng này có ' + hoi.map(h => h.n).join(', ') + ' buôn bán.';
      } else if (id === 'thon') {
        out.info = true;
        const ops = TT.rumors ? TT.rumors.active().filter(o => o.region === c.region || o.kind === 'ke_thu') : [];
        out.text = 'Trưởng thôn mời bạn chén trà, kể chuyện làng và những điều ông nghe được từ khách qua đường.';
        out.options.push({ label: 'Hỏi thăm tin tức trong vùng', run: () => (ops.length ? 'Trưởng thôn kể: ' + ops.slice(0, 3).map(o => o.name).join('; ') + '.' : 'Trưởng thôn lắc đầu: dạo này làng yên ắng, chẳng có tin gì.') });
      } else if (id === 'dgia') {
        const A = D.ECO.dgia, q = Math.floor(TT.world.months / 3), lots = bld.auctionLots(c), w = TT.world; w.dg = w.dg || {};
        out.text = 'Mỗi quý nhà đấu giá đưa ra ' + A.lots + ' món quý. Bạn ra giá một lần cho mỗi món: giá cao thì dễ thắng nhưng đắt, thua thì không mất tiền. Các tay chơi khác trả giá ngẫu nhiên nên không chắc thắng.';
        lots.forEach((lot, i) => {
          const key = c.place + '|' + q + '|' + i, done = w.dg[key];
          A.bids.forEach(m => {
            const price = Math.round(lot.base * m);
            out.options.push({ label: D.ITEMS[lot.id].n + ': ra giá ' + TT.ls.fmt(price) + ' (x' + m + ')', disabled: done ? (done === 'win' ? 'Đã thắng' : 'Đã ra giá') : (!TT.ls.can(c, price) ? 'Không đủ linh thạch' : false), run: () => {
              w.dg[key] = 'lose';
              if (m >= lot.rival) { TT.ls.pay(c, price); w.dg[key] = 'win'; TT.items.add(c, lot.id); TT.log(c, 'Bạn thắng đấu giá ' + D.ITEMS[lot.id].n + ' với giá ' + TT.ls.fmt(price) + '.', 'good'); return 'Thắng! ' + D.ITEMS[lot.id].n + ' thuộc về bạn.'; }
              TT.log(c, 'Bạn thua đấu giá ' + D.ITEMS[lot.id].n + ' vì có người trả cao hơn.', 'age'); return 'Có người trả cao hơn, bạn thua (không mất tiền).';
            } });
          });
        });
      } else if (id === 'lang') {
        out.info = true;
        out.text = 'Tộc trưởng tiếp khách bên bếp lửa, kể về nguồn gốc cứ địa và những quy tắc của bộ tộc.';
      } else if (id === 'quan') {
        out.info = true;
        const tr = TT.fac.get('tr_' + c.region), war = TT.fac.atFront(c.region), hoi = TT.fac.hoiAt(c.region);
        out.text = (tr ? tr.n + ' (' + tr.state + ', lãnh tụ ' + tr.leader + ')' : 'Quan phủ địa phương') + '. ' + (war ? 'Vùng đang có chiến sự, cửa ải siết, giá cả tăng.' : 'Vùng đang yên ổn.') + (hoi.length ? ' Thương hội có mặt: ' + hoi.map(h => h.n).join(', ') + '.' : '') + ' Thời đại: ' + TT.fac.era().n + '.';
        const kt = TT.rumors ? TT.rumors.active().filter(o => o.kind === 'ke_thu') : [];
        if (kt.length) out.note = 'Bảng truy nã: ' + kt.slice(0, 3).map(o => o.name).join('; ') + '.';
        const pd = TT.pop.describe(c.region);
        if (pd) out.note = (out.note ? out.note + ' ' : '') + 'Dân số vùng ' + pd.size + ', ' + pd.trend + '; dân tâm ' + pd.mood + (pd.shocks.length ? ' (đang có ' + pd.shocks.join(', ') + ')' : '') + '.';
        const bd = TT.eco.board(c.region).filter(x => Math.abs(x.rel - 1) > 0.15).slice(0, 3);
        out.note += (out.note ? ' ' : '') + 'Thuế chợ ' + Math.round(TT.eco.tax(c.region) * 100) + '%. Bảng giá: ' + (bd.length ? bd.map(x => D.ECO.names[x.g] + (x.rel > 1 ? ' đắt ' : ' rẻ ') + Math.round(Math.abs(x.rel - 1) * 100) + '%' + (x.why ? ' (' + x.why + ')' : '')).join('; ') : 'giá cả ổn định') + '.';
        const ps = TT.pact.inRegion(c.region).filter(p => p.kind !== 'minh_uoc').slice(0, 6);
        if (ps.length) out.note += ' Hiệp ước trong vùng: ' + ps.map(p => TT.pact.name(p) + ' (' + TT.pact.mood(p) + ')').join('; ') + '.';
      } else if (SECT_BLD.indexOf(id) >= 0) {
        sectService(c, id, out);
      } else if (id === 'cua') {
        const why = TT.dungeon.canEnter(c);
        out.text = 'Lối vào nơi hiểm yếu (bí cảnh, tàn tích, hung địa). Bạn có thể rút lui giữa chừng, nhưng thua trận thì mất nửa thu hoạch, và đánh tới cùng với thủ lĩnh có thể mất mạng.';
        out.options.push({ label: 'Thám hiểm ' + TT.map.place(c.place).n, disabled: why || false, run: () => { TT.dungeon.enter(c, c.place); return ''; }, close: true });
      } else if (id === 'ai') {
        out.info = true;
        out.text = 'Cửa ải giữa các vùng. Lối vượt vùng (đi bộ, truyền tống, đại trận tông) nằm ở mục "Vượt vùng" của tab Tông môn, và chỉ mở khi bạn đủ điều kiện.';
        out.options.push({ label: 'Xem lối vượt vùng (tab Tông môn)', run: () => { if (TT.ui && TT.ui.openSectTab) TT.ui.openSectTab('vv'); return ''; }, close: true });
      } else out.note = 'Công trình này sẽ mở ở bản sau (võ đài, kho, hầm mỏ, bến tàu, nhà đấu giá, tòa soạn).';
      return out;
    }
  };
})();
