// Nhật báo (G1 đến G3, G5): kho tin gom từ TT.news, xuất bản số tổng san mỗi 48 tháng, đăng ký theo tháng, người bán báo hỏi mỗi bốn năm.
// Lưu: world.press = { pool: [tin], issues: [số], no }; người chơi c.press = { sub, since, owned: [số], gift, asked }. Khởi tạo muộn.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, P = D.PRESS;
  const hash = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 100003; return h / 100003; };
  const yr = m => Math.floor(m / 12) - TT.config.startYear + 1;
  let regRe = null;
  const regionIn = text => {
    if (!regRe) regRe = D.REGIONS.map(r => [r.id, r.n]);
    for (let i = 0; i < regRe.length; i++) if (text.indexOf(regRe[i][1]) >= 0) return regRe[i][0];
    return '';
  };
  const kindOf = (t, cls, mine) => {
    if (/đắt|rẻ hẳn|giá |mùa |đường buôn|thương hội|tích trữ|xả hàng/.test(t)) return 'gia';
    if (/hạn hán|lũ lụt|dịch bệnh|nổi loạn|dân tâm|đói/.test(t)) return 'dan';
    if (/cống|chư hầu|hiệp ước|bất tuân|đoạn tuyệt|thuế|minh ước/.test(t)) return 'hiep';
    if (/tuyên chiến|chiến sự|chiến tranh|hòa nghị|diệt|đồng minh|thời đại|thiên địa|đổi thay/.test(t)) return 'the';
    if (/bí cảnh|kỳ ngộ|tàn tích|hầm mộ|hung địa/.test(t)) return 'bi';
    if (/tông|chưởng môn|đệ tử|đại bỉ|trưởng lão/.test(t)) return 'tong';
    return mine || cls ? 'nguoi' : 'khac';
  };

  const press = TT.press = {
    S() { const w = TT.world; if (!w) return null; if (!w.press) w.press = { pool: [], issues: [], no: 0 }; return w.press; },
    // ---------- kho tin ----------
    emit(text, cls, ids) {
      const s = press.S(); if (!s || !text) return;
      const pl = TT.player(), mine = !!(pl && ids && ids.indexOf(pl.id) >= 0);
      let imp = cls === 'bad' || cls === 'war' ? 3 : cls === 'good' ? 2 : 1;
      if (/diệt|thời đại|thiên địa|tuyên chiến|chấm dứt|hòa nghị/.test(text)) imp = Math.max(imp, 4);
      if (mine) imp = Math.max(imp, 3);
      s.pool.push({ m: TT.world.months, t: text, k: kindOf(text, cls, ids && ids.length), r: regionIn(text), i: imp, p: mine ? 1 : 0 });
      if (s.pool.length > P.poolCap) { // bỏ tin ít quan trọng nhất trong nửa cũ
        const cut = s.pool.length - P.poolCap, old = s.pool.slice(0, Math.floor(s.pool.length / 2)).sort((a, b) => a.i - b.i || a.m - b.m).slice(0, cut);
        s.pool = s.pool.filter(x => old.indexOf(x) < 0);
      }
    },
    fee(c) { return P.fee * (1 + P.feeRealm * c.realm); }, // hạ phẩm mỗi tháng
    feeGold(c) { return press.fee(c) * TT.data.LS.RATE; },
    // ---------- xuất bản ----------
    conf(x, no) { if (x.i >= 3) return 'v'; const h = hash(x.t + no); return h < P.wrong ? 'u' : h < P.wrong + P.maybe ? 'k' : 'v'; },
    publish() {
      const s = press.S(), w = TT.world, to = w.months, from = to - P.period, E = D.ECO;
      if (!s) return null;
      const no = ++s.no, prev = s.issues[s.issues.length - 1];
      const part = s.pool.filter(x => x.m > from && x.m <= to);
      const pick = (kind, cap) => part.filter(x => x.k === kind).sort((a, b) => b.i - a.i || a.m - b.m).slice(0, cap).sort((a, b) => a.m - b.m);
      const it = x => ({ t: x.t, c: press.conf(x, no), m: x.m, r: x.r, p: x.p });
      const secs = [];
      const add = (id, n, list) => { if (list.length) secs.push({ id, n, items: list }); };
      // tin tổng hợp từ số liệu (không cần sự kiện): giá, dân sinh, tông, hiệp ước
      const gen = (k, t, r) => ({ t, c: 'v', m: 0, r: r || '', p: 0, k });
      const extra = { gia: [], dan: [], tong: [], hiep: [] };
      const movers = D.REGIONS.map(r => E.groups.map(g => { const ser = TT.eco.series(r.id, g).slice(-P.period); return ser.length > 1 ? [r, g, (ser[ser.length - 1] / ser[0] - 1) * 100] : null; }).filter(Boolean)).reduce((a, b) => a.concat(b), []).sort((a, b) => Math.abs(b[2]) - Math.abs(a[2])).slice(0, 5);
      movers.forEach(x => { if (Math.abs(x[2]) >= 4) extra.gia.push(gen('gia', E.names[x[1]] + ' ở ' + x[0].n + (x[2] > 0 ? ' đắt lên ' : ' rẻ đi ') + Math.round(Math.abs(x[2])) + '% so với đầu kỳ.', x[0].id)); });
      D.REGIONS.forEach(r => { const g = TT.pop.get(r.id); if (g && g.mood < 40) extra.dan.push(gen('dan', 'Dân tâm ' + r.n + ' xuống thấp (' + Math.round(g.mood) + '), quan phủ lo ngại.', r.id)); if (g && g.n < D.POP[r.id].n0 * 0.8) extra.dan.push(gen('dan', 'Dân số ' + r.n + ' chỉ còn ' + Math.round(g.n / D.POP[r.id].n0 * 100) + '% mức khởi đầu.', r.id)); });
      TT.fac.list('tong').filter(TT.fac.alive).sort((a, b) => b.power - a.power).slice(0, 3).forEach((x, i) => extra.tong.push(gen('tong', x.n + ' (' + TT.map.region(x.region).n + ') ' + (i === 0 ? 'là tông mạnh nhất thiên hạ' : 'đứng hàng ' + (i + 1) + ' về sức mạnh') + ', sức mạnh ' + Math.round(x.power) + '.', x.region)));
      (TT.pact.S() || []).filter(p => p.kind !== 'minh_uoc').slice(0, 4).forEach(p => extra.hiep.push(gen('hiep', 'Hiệp ước: ' + TT.pact.name(p) + ' (' + TT.pact.mood(p) + ').')));
      ['gia', 'dan', 'tong', 'hiep'].forEach(k => extra[k].forEach(x => { if (part.filter(y => y.k === k).length < P.secs[k]) part.push({ m: 0, t: x.t, k, r: x.r, i: 1, p: 0 }); }));
      add('timeline', 'Dòng thời gian bốn năm', part.filter(x => x.m).sort((a, b) => b.i - a.i || a.m - b.m).slice(0, P.secs.timeline).sort((a, b) => a.m - b.m).map(it));
      ['the', 'tong', 'dan', 'hiep', 'bi', 'gia', 'nguoi'].forEach(k => add(k, P.kinds[k], pick(k, P.secs[k]).map(it)));
      const pl = TT.player();
      const mine = part.filter(x => x.p).sort((a, b) => b.i - a.i).slice(0, P.secs.mine).sort((a, b) => a.m - b.m).map(it);
      add('mine', 'Có liên quan đến bạn', mine);
      // truy nã
      const wanted = TT.rumors ? TT.rumors.active().filter(o => o.kind === 'ke_thu').slice(0, 6).map(o => ({ t: o.name, c: 'v', m: to, r: o.region || '', p: 0 })) : [];
      add('wanted', 'Truy nã và treo thưởng', wanted);
      // đính chính: các tin "chưa xác nhận" của số trước
      const corr = [];
      if (prev) prev.secs.forEach(sc => sc.items.forEach(x => { if (x.c === 'u' && corr.length < 3) corr.push({ t: 'Số ' + prev.no + ' đưa tin "' + x.t.slice(0, 70) + (x.t.length > 70 ? '…' : '') + '" khi chưa xác nhận; nay ' + (hash(x.t + 'dc') < 0.6 ? 'đã được xác nhận' : 'xác định là tin sai, xin đính chính') + '.', c: 'v', m: to, r: '', p: 0 }); }));
      add('corr', 'Đính chính', corr);
      // bảng giá và biểu đồ (rel so với mức thường, nhân 100)
      const rows = [], ch = {};
      D.REGIONS.forEach(r => {
        ch[r.id] = {};
        E.groups.forEach(g => {
          const ser = TT.eco.series(r.id, g).slice(-P.period), rel = v => Math.round(v / TT.eco.spec(r.id, g) * 100);
          if (ser.length < 2) { rows.push([r.id, g, rel(TT.eco.index(r.id, g)), rel(TT.eco.index(r.id, g)), 100, 100]); ch[r.id][g] = [rel(TT.eco.index(r.id, g))]; return; }
          const vals = ser.map(rel);
          rows.push([r.id, g, vals[0], vals[vals.length - 1], Math.max.apply(null, vals), Math.min.apply(null, vals)]);
          const pts = []; for (let i = 0; i < 12; i++) { const a = Math.floor(i * vals.length / 12), b = Math.max(a + 1, Math.floor((i + 1) * vals.length / 12)); pts.push(Math.round(vals.slice(a, b).reduce((x, y) => x + y, 0) / (b - a))); }
          ch[r.id][g] = pts;
        });
      });
      // nhân vật mạnh nhất
      const rank = Object.keys(w.chars).map(k => w.chars[k]).filter(c => c.alive && c.kind === 'npc' && c.realm >= 1).sort((a, b) => b.realm - a.realm || (b.xp || 0) - (a.xp || 0)).slice(0, 10).map(c => [c.name, c.realm, c.region, Math.floor(c.age)]);
      // dân sinh và thuế
      const reg = D.REGIONS.map(r => { const g = TT.pop.get(r.id); return [r.id, g ? Math.round(g.n / D.POP[r.id].n0 * 100) : 100, g ? Math.round(g.mood) : 55, Math.round(TT.eco.tax(r.id) * 100)]; });
      const pacts = (TT.pact.S() || []).filter(p => p.kind !== 'minh_uoc').slice(0, 8).map(p => TT.pact.name(p) + ' (' + TT.pact.mood(p) + ')');
      // dự báo
      const fc = [];
      D.REGIONS.forEach(r => {
        TT.eco.upcoming(r.id).forEach(u => fc.push(u.text + ' ở ' + r.n + ' (sau khoảng ' + u.in + ' tháng).'));
        TT.pop.shocksAt(r.id).forEach(sh => fc.push(({ han: 'Hạn hán', lu: 'Lũ lụt', dich: 'Dịch bệnh' })[sh.kind] + ' ở ' + r.n + ' còn kéo dài, giá linh thảo và đan dược có thể lệch.'));
        if (TT.pop.unrest(r.id)) fc.push('Dân tâm ' + r.n + ' bất ổn, nguy cơ nổi loạn.');
      });
      TT.fac.S().wars.forEach(wr => { const a = TT.fac.get(wr.a), b = TT.fac.get(wr.b); if (a && b) fc.push('Chiến sự ' + a.n + ' và ' + b.n + ' ở ' + TT.map.region(wr.front).n + ' chưa ngã ngũ; vùng này giá đan, bùa, khí cụ sẽ còn cao.'); });
      if (TT.fac.S().nextEra) fc.push('Các nhà tinh tượng báo thiên địa sắp chuyển sang ' + D.ERAS[TT.fac.S().nextEra].n + '.');
      // xã luận
      const nWar = part.filter(x => /tuyên chiến/.test(x.t)).length, nDie = part.filter(x => /diệt/.test(x.t)).length, shocks = part.filter(x => x.k === 'gia').length;
      let mv = null; rows.forEach(r => { const d = r[3] - r[2]; if (!mv || Math.abs(d) > Math.abs(mv[0])) mv = [d, r]; });
      const edit = 'Bốn năm qua thiên hạ ' + (nWar + nDie > 2 ? 'không yên: ' + nWar + ' cuộc tuyên chiến, ' + nDie + ' vụ diệt vong' : nWar + nDie ? 'tương đối bình ổn, chỉ có ' + (nWar ? nWar + ' cuộc tuyên chiến' : nDie + ' vụ diệt vong') : 'yên ả') + '. ' +
        (mv ? E.names[mv[1][1]] + ' ở ' + TT.map.region(mv[1][0]).n + ' ' + (mv[0] > 0 ? 'đắt lên ' : 'rẻ đi ') + Math.abs(mv[0]) + '% so với đầu kỳ, là biến động giá lớn nhất.' : '') + ' Thiên Cơ Báo nhận định: thương lộ còn thông thì giá còn quay về mức thường; ai nắm tin sớm, kẻ ấy có lợi.';
      const issue = { no, from, to, edit, secs, rows, ch, rank, reg, pacts, fc: fc.slice(0, 10), n: secs.reduce((a, x) => a + x.items.length, 0) };
      s.issues.push(issue); if (s.issues.length > P.issuesKeep) s.issues.shift();
      // phân phát cho người chơi đang đăng ký, rồi hỏi
      if (pl) { const ps = press.ensure(pl); if (ps.sub) press.own(pl, no); else press.offer(pl); TT.log(pl, 'Thiên Cơ Báo số ' + no + ' vừa phát hành (bốn năm từ năm ' + yr(from) + ' tới năm ' + yr(to) + ').', 'age'); }
      s.pool = s.pool.filter(x => x.m > from - 12); // giữ thêm một năm để tin chuỗi không bị mất
      return issue;
    },
    // ---------- người chơi ----------
    ensure(c) { if (!c.press) c.press = { sub: false, since: 0, owned: [], gift: false, asked: -999 }; return c.press; },
    issue(no) { const s = press.S(); return s ? s.issues.find(x => x.no === no) || null : null; },
    own(c, no) { const ps = press.ensure(c); if (ps.owned.indexOf(no) < 0) { ps.owned.push(no); if (ps.owned.length > P.ownedKeep) ps.owned.shift(); } },
    owned(c) { return press.ensure(c).owned.map(press.issue).filter(Boolean); },
    nextIn() { return P.period - (TT.world.months % P.period); },
    subscribe(c) { const ps = press.ensure(c); ps.sub = true; ps.since = TT.world.months; TT.log(c, 'Bạn đăng ký ' + P.name + ' (' + TT.ls.fmt(press.feeGold(c)) + ' mỗi tháng).', 'age'); return { ok: true, text: 'Đã đăng ký ' + P.name + '.' }; },
    cancel(c) { const ps = press.ensure(c); ps.sub = false; TT.log(c, 'Bạn hủy đăng ký ' + P.name + '.', 'age'); return { ok: true, text: 'Đã hủy đăng ký.' }; },
    // Mua một số cũ ở nơi có chợ: phí bốn năm x 1,2.
    buyOld(c, no) {
      const is = press.issue(no); if (!is) return { ok: false, text: 'Số này không còn.' };
      if (press.ensure(c).owned.indexOf(no) >= 0) return { ok: false, text: 'Bạn đã có số này.' };
      if (!TT.market.typeOf(c)) return { ok: false, text: 'Chỉ mua số cũ ở nơi có cửa hàng.' };
      const price = Math.round(press.feeGold(c) * P.period * P.oldMul);
      if (!TT.ls.can(c, price)) return { ok: false, text: 'Không đủ linh thạch (cần ' + TT.ls.fmt(price) + ').' };
      TT.ls.pay(c, price); press.own(c, no); TT.log(c, 'Bạn mua ' + P.name + ' số ' + no + ' với giá ' + TT.ls.fmt(price) + '.', 'age');
      return { ok: true, text: 'Đã mua số ' + no + '.' };
    },
    oldPrice(c) { return Math.round(press.feeGold(c) * P.period * P.oldMul); },
    monthly(c) {
      const ps = c.press; if (!ps || !ps.sub) return;
      const f = press.feeGold(c);
      if (TT.ls.can(c, f)) TT.ls.pay(c, f); else { ps.sub = false; TT.log(c, 'Hết tiền, ' + P.name + ' tạm ngưng đăng ký (các số đã mua vẫn giữ).', 'bad'); }
    },
    // Người bán báo: mỗi bốn năm, chỉ khi tài sản đủ trụ 30 năm phí.
    canOffer(c) { return TT.ls.wealth(c) >= P.richYears * 12 * press.feeGold(c); },
    offer(c) {
      const ps = press.ensure(c); if (ps.sub || !press.canOffer(c)) return;
      ps.asked = TT.world.months;
      const last = TT.world.press.issues[TT.world.press.issues.length - 1];
      let gift = '';
      if (!ps.gift && last) { ps.gift = true; press.own(c, last.no); gift = ' Anh ta để lại biếu bạn số ' + last.no + ' để xem thử.'; }
      TT.decisions.request({
        type: 'press', charId: c.id, tier: 2, def: 1, timeout: 12,
        title: 'Người bán báo ghé qua',
        text: 'Một người bán báo của ' + P.name + ' (' + P.owner + ') gõ cửa, mời bạn đăng ký nhận báo. Mỗi bốn năm một số tổng san dày: dòng thời gian, thế cuộc, giá cả, dân sinh, hiệp ước, dự báo.' + gift +
          '\nPhí ' + TT.ls.fmt(press.feeGold(c)) + ' mỗi tháng, trừ tự động; hết tiền thì tự ngưng, số đã mua vẫn giữ. Bạn có thể hủy bất cứ lúc nào ở tab Nhật báo.',
        choices: [{ key: 'sub', label: 'Đăng ký ' + P.name }, { key: 'no', label: 'Chưa cần' }]
      });
    }
  };
})();
