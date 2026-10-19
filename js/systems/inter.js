// Liên tông (S8, ke-hoach/S-quoc-gia-tong-mon-ton-giao.md mục 9): tông ↔ triều (quốc sư, cung phụng, ngoài vòng pháp luật, thao túng kế vị),
// ước pháp của minh ước liên tông, giải đấu 4 hoặc 10 năm, đại chiến liên tông (triều đứng ngoài hay nhúng tay), Thiên hạ công ước.
// Lưu ở world.fac.inter = { roles: {id tông: vai trò}, giai: { cycle, next, ent, last, tuCach }, cong: {vùng: năm ký | -1 khi bị phá}, lastBig: tháng }, khởi tạo muộn; không đổi TT.VERSION.
//
// QUY TẮC (S mục 15.2): các hàm ĐỌC (on, peekS, roleOf, manip, armyMul, helpBonus, mineAdd, warTick-không, describe, giaiOpen, sig...) không gọi rng và không khởi tạo.
// Hàm GHI dùng băm (TT.nation.hn) cho quyết định hằng năm; rng chỉ dùng khi bốc thăm giải đấu và trong tickWars đã có sẵn.
// D.INTERSECT.on = false thì mọi hàm ghi không làm gì và mọi hàm đọc trả về trung tính (đường cơ sở trùng khít).
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, K = D.INTERSECT, rng = TT.rng;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const hn = (...a) => TT.nation.hn(...a);
  const yn = () => Math.floor(TT.world.months / 12);
  const near = rid => { const pl = TT.player(); return !!(pl && pl.region === rid); };
  const trieuOf = rid => TT.fac.list('trieu').find(t => t.region === rid && TT.fac.alive(t)) || null;
  const tongOf = rid => TT.fac.list('tong').filter(t => t.region === rid && TT.fac.alive(t)).sort((p, q) => q.power - p.power || (p.id < q.id ? -1 : 1))[0] || null;
  const alliesOf = x => (x.ally || []).map(id => TT.fac.get(id)).filter(y => y && y.kind === 'tong' && TT.fac.alive(y));
  const pactsOf = id => (TT.fac.S().pacts || []).filter(p => p.a === id || p.b === id);
  const sameP = (q, a, b) => (q.a === a.id && q.b === b.id) || (q.a === b.id && q.b === a.id);
  const EMPTY = { roles: {}, giai: null, cong: {}, lastBig: -99999 };

  const inter = TT.inter = {
    on() { return !!K.on; },
    trieuOfRegion: rid => trieuOf(rid),
    // Đọc: không tạo gì (EMPTY là bản dùng chung, không ghi vào).
    peekS() { return TT.fac.S().inter || EMPTY; },
    // Ghi: tạo muộn.
    S() { const f = TT.fac.S(); if (!f.inter) f.inter = { roles: {}, giai: null, cong: {}, lastBig: -99999 }; return f.inter; },

    // ---------- đọc ----------
    roleOf(t) { return (inter.on() && inter.peekS().roles[t.id]) || 'tu_do'; },
    // Quốc sư: quân lực triều nhân thêm (trong army.mul).
    armyMul(x) {
      if (!inter.on() || x.kind !== 'trieu') return 1;
      const t = tongOf(x.region); return t && inter.roleOf(t) === 'quoc_su' ? 1 + K.role.armyBonus : 1;
    },
    // Tông thao túng kế vị: tông quốc sư hoặc cung phụng đủ mạnh; trả về tông (hoặc null) theo băm riêng cho mỗi lần kế vị.
    manip(x) {
      if (!inter.on() || x.kind !== 'trieu') return null;
      const t = tongOf(x.region); if (!t || t.power < K.manip.power) return null;
      if (['quoc_su', 'cung_phung'].indexOf(inter.roleOf(t)) < 0) return null;
      return hn('thaotung', x.id, TT.world.months) < K.manip.p ? t : null;
    },
    // Ước pháp làm đồng minh giúp nhau thêm khi lâm chiến (pact.helpP).
    helpBonus(xId, aId) {
      if (!inter.on()) return 0;
      return pactsOf(xId).some(p => p.kind === 'uoc_phap' && (p.a === aId || p.b === aId)) ? K.uoc.help : 0;
    },
    // Chia mỏ: tông có ước pháp nhận thêm một phần số mỏ của bạn (sect.resYearly).
    mineAdd(id) {
      if (!inter.on()) return 0;
      return pactsOf(id).filter(p => p.kind === 'uoc_phap').reduce((s, p) => {
        const o = TT.fac.get(p.a === id ? p.b : p.a); return s + (o && o.res ? o.res.mo : 0) * K.uoc.share;
      }, 0);
    },
    giaiOpen() {
      const g = inter.peekS().giai; const m = TT.world.months;
      return !!(inter.on() && g && g.next > m && g.next - m <= 12);
    },
    entered(c) { const g = inter.peekS().giai; return !!(g && c.sect && g.ent.indexOf(c.sect.id) >= 0); },
    // Mô tả cho giao diện: chữ và bậc, không số.
    describe(t) {
      const role = inter.roleOf(t), tr = trieuOf(t.region);
      return { roleKey: role, role: K.roles[role].n, roleDesc: K.roles[role].desc, trieu: tr ? tr.n : null };
    },
    // Các cặp có ước pháp (cho giao diện).
    uocPairs() {
      return (TT.fac.S().pacts || []).filter(p => p.kind === 'uoc_phap').map(p => [TT.fac.get(p.a), TT.fac.get(p.b)]).filter(q => q[0] && q[1] && TT.fac.alive(q[0]) && TT.fac.alive(q[1]));
    },
    // Đại chiến liên tông đang diễn ra.
    bigWars() { return TT.fac.S().wars.filter(w => w.lt); },
    // Dấu hiệu thay đổi cho khóa vẽ lại giao diện.
    sig() {
      const S = inter.peekS(), F = TT.fac.S();
      return Object.keys(S.roles).map(k => k + S.roles[k]).join(',') + '|' + JSON.stringify(S.cong) + '|' +
        (S.giai ? S.giai.next + ':' + S.giai.ent.join('+') + ':' + (S.giai.last ? S.giai.last.win : '') : '') + '|' +
        F.wars.filter(w => w.lt).map(w => w.id + w.stance).join(',') + '|' + (F.pacts || []).filter(p => p.kind === 'uoc_phap' || p.kind === 'bong').length;
    },

    // ---------- ghi ----------
    // Một năm: vai trò tông và triều, ước pháp, giải đấu, Thiên hạ công ước. Gọi sau TT.court.yearly (S7).
    yearly() {
      if (!inter.on()) return;
      const y = yn();
      TT.fac.list('trieu').forEach(tr => { if (TT.fac.alive(tr)) inter.roleStep(tr, y); });
      inter.uocStep(y);
      inter.giaiStep();
      inter.congStep(y);
    },
    // Một tông (mạnh nhất vùng) đổi vai trò hằng năm theo triều và tình thế.
    roleStep(tr, y) {
      const t = tongOf(tr.region); if (!t) return;
      const C = TT.court.peek(tr), role = inter.roleOf(t), R = K.role;
      if (role === 'tu_do') {
        if (C.hq >= R.coopHq && t.power >= R.coopPower && t.wealth >= R.coopWealth && hn('vaitro', t.id, y) < R.coop) inter.setRole(t, t.power >= R.quocSu && C.sach !== 'cam' ? 'quoc_su' : 'cung_phung');
        else if (t.power >= K.outlaw.power && C.hq < K.outlaw.hq && hn('ngoaiphap', t.id, y) < K.outlaw.p) inter.setRole(t, 'ngoai_phap');
      } else if (role === 'ngoai_phap') {
        const E = TT.court.ent(tr); E.hq = clamp(E.hq - R.drain, 0, 100);
        if (C.hq >= K.punish.hq && hn('trungphat', t.id, y) < K.punish.p) {
          t.power = clamp(t.power - K.punish.power, 1, 100); t.wealth = clamp(t.wealth - K.punish.wealth, 0, 100);
          TT.diplo.log(tr, t, 'trung_phat', 0, 'Triều trừng phạt ' + t.n + ' vì ngoài vòng pháp luật');
          inter.setRole(t, 'tu_do');
        }
      } else if ((C.sach === 'cam' || C.hq < R.fallHq) && hn('ruttui', t.id, y) < R.fallP) inter.setRole(t, 'tu_do');
      else if (role === 'quoc_su' && t.power < R.quocSuMin) inter.setRole(t, 'tu_do');
    },
    // Đổi vai trò: cung phụng có hiệp ước bổng; ngoài vòng pháp luật phá Thiên hạ công ước đang có hiệu lực.
    setRole(t, to) {
      const S = inter.S(), from = inter.roleOf(t), tr = trieuOf(t.region);
      if (from === to) return;
      S.roles[t.id] = to;
      const P = TT.pact.S();
      for (let i = P.length - 1; i >= 0; i--) if (P[i].kind === 'bong' && P[i].b === t.id) P.splice(i, 1); // giữ nguyên mảng, không gán lại
      if (to === 'cung_phung' && tr) { const p = TT.pact.add('bong', tr.id, t.id, { rate: K.bong.rate, strain: K.bong.strain }); if (p) p.rate = K.bong.rate; }
      const who = tr ? tr.n : 'triều';
      const text = {
        quoc_su: t.n + ' được ' + who + ' mời làm quốc sư, giữ pháp trận của nước.',
        cung_phung: t.n + ' nhận bổng cung phụng từ ' + who + '.',
        tu_do: t.n + ' từ tạ chức, không còn ràng buộc với ' + who + '.',
        ngoai_phap: t.n + ' ngoài vòng pháp luật, không còn chịu ' + who + ' quản.'
      }[to];
      if (to === 'ngoai_phap' && S.cong[t.region] !== undefined && S.cong[t.region] !== -1) inter.breach(t, tr);
      TT.fac.chron(text, to === 'ngoai_phap' ? 'bad' : to === 'quoc_su' ? 'good' : 'age', near(t.region));
    },
    // Vi phạm Thiên hạ công ước: công ước vỡ, tông bị truy cứu; đồng minh tông ghét bên phạm.
    breach(t, tr) {
      const S = inter.S();
      S.cong[t.region] = -1;
      t.power = clamp(t.power - K.cong.power, 1, 100); t.unity = clamp(t.unity - K.cong.unity, 5, 100);
      if (tr) TT.fac.relAdd(tr, t, K.cong.allyRel, ['vi_uoc', t.n + ' vi phạm Thiên hạ công ước, quân triều truy cứu']);
      alliesOf(t).forEach(y => TT.fac.relAdd(y, t, K.cong.allyRel, ['vi_uoc', y.n + ' truy cứu ' + t.n + ' vì vi phạm Thiên hạ công ước']));
      TT.fac.chron('Thiên hạ công ước ở ' + TT.map.region(t.region).n + ' bị phá vỡ: ' + t.n + ' ngoài vòng pháp luật, tông môn và quân đội cùng truy cứu.', 'bad', near(t.region));
    },
    // Minh ước giữa hai tông: thêm ước pháp (năm đầu tiên có xác suất), bỏ khi minh ước tan hoặc quan hệ nguội.
    uocStep(y) {
      const f = TT.fac, L = TT.pact.S();
      for (let i = L.length - 1; i >= 0; i--) { // giữ nguyên mảng: dỡ ước pháp không còn minh ước hoặc quan hệ nguội
        const p = L[i]; if (p.kind !== 'uoc_phap') continue;
        const a = f.get(p.a), b = f.get(p.b);
        if (!a || !b || !f.alive(a) || !f.alive(b)) { L.splice(i, 1); continue; }
        const keep = L.some(q => q.kind === 'minh_uoc' && sameP(q, a, b)) && f.relV(a, b) >= K.uoc.keep;
        if (keep) continue;
        L.splice(i, 1); TT.fac.chron('Ước pháp giữa ' + a.n + ' và ' + b.n + ' tan vỡ.', 'age', near(a.region) || near(b.region));
      }
      L.filter(p => p.kind === 'minh_uoc').forEach(p => {
        const a = f.get(p.a), b = f.get(p.b);
        if (!a || !b || !f.alive(a) || !f.alive(b) || a.kind !== 'tong' || b.kind !== 'tong') return;
        if (L.some(q => q.kind === 'uoc_phap' && sameP(q, a, b))) return;
        if (f.relV(a, b) < K.uoc.min || hn('uocphap', a.id, b.id, y) >= K.uoc.p) return;
        const q = TT.pact.add('uoc_phap', a.id, b.id, { strain: 0 }); if (q) q.rate = 0; // không trả kho: ước pháp là lời hứa, không phải cống
        TT.fac.chron(a.n + ' và ' + b.n + ' ký ước pháp: cùng phòng thủ, chia mỏ, cho mượn đệ tử.', 'good', near(a.region) || near(b.region));
      });
      // lời ước có tác dụng hằng năm: cho mượn đệ tử khi một bên lâm chiến, bên kia bớt sức
      inter.uocPairs().forEach(q => {
        const [a, b] = q;
        if (a.war && !b.war) { b.power = clamp(b.power - K.uoc.lend * 0.5, 1, 100); a.power = clamp(a.power + K.uoc.lend, 1, 100); }
        else if (b.war && !a.war) { a.power = clamp(a.power - K.uoc.lend * 0.5, 1, 100); b.power = clamp(b.power + K.uoc.lend, 1, 100); }
      });
    },
    // Giải đấu: lịch lập muộn; đến kỳ thì tổ chức, rồi lên lịch kỳ sau.
    giaiS() {
      const S = inter.S();
      if (!S.giai) { const cycle = K.giai.cycles[hn('giaicycle') < 0.5 ? 0 : 1]; S.giai = { cycle, next: TT.world.months + cycle * 12, ent: [], last: null, tuCach: {} }; }
      return S.giai;
    },
    giaiStep() {
      const G = inter.giaiS();
      if (TT.world.months < G.next) return;
      inter.contest(G);
      G.next += G.cycle * 12; G.ent = [];
    },
    // Bốc thăm người thắng theo sức mạnh, đoàn kết, vai trò và báo danh; thắng thì cộng uy tín, thưởng mỏ và tư cách; bên bảo trợ được quan hệ tốt hơn.
    contest(G) {
      const f = TT.fac, L = f.list('tong').filter(f.alive);
      if (L.length < 2) return;
      const ents = G.ent.map(id => f.get(id)).filter(t => t && t.kind === 'tong' && f.alive(t));
      const cand = L.filter(t => t.power >= K.giai.min || ents.indexOf(t) >= 0).sort((p, q) => q.power - p.power || (p.id < q.id ? -1 : 1));
      const list = cand.slice(0, K.giai.max);
      ents.forEach(e => { if (list.indexOf(e) < 0 && list.length < K.giai.max) list.push(e); });
      if (list.length < 2) { f.chron('Giải đấu liên tông không đủ tông dự thi, kỳ này bỏ qua.', 'age'); return; }
      const hosts = f.list('trieu').filter(f.alive).sort((p, q) => q.power - p.power);
      const minh = L.slice().sort((p, q) => (q.ally || []).length - (p.ally || []).length || q.power - p.power || (p.id < q.id ? -1 : 1))[0];
      const host = hn('giaihost', yn()) < 0.5 && hosts.length ? hosts[0] : (minh && (minh.ally || []).length ? minh : hosts[0] || minh);
      const w = list.map(t => Math.max(1, t.power * 0.6 + t.unity * 0.4 + (inter.roleOf(t) === 'quoc_su' ? K.giai.quocSuBonus : 0) + (ents.indexOf(t) >= 0 ? K.giai.entryBonus : 0)));
      let r = rng.R(0, w.reduce((s, v) => s + v, 0)), win = list[list.length - 1];
      for (let i = 0; i < list.length; i++) { r -= w[i]; if (r < 0) { win = list[i]; break; } }
      win.power = clamp(win.power + K.giai.power, 1, 100); win.unity = clamp(win.unity + K.giai.unity, 5, 100);
      if (D.SECTS[win.id]) { const res = TT.sect.res(win.id); if (res && res.mo < 3) res.mo++; }
      G.tuCach[win.id] = TT.world.months + K.giai.tuCachYears * 12;
      if (host && host !== win) TT.fac.relAdd(win, host, K.giai.rel, ['giai_thang', win.n + ' đoạt giải đấu liên tông do ' + host.n + ' bảo trợ']);
      G.last = { m: TT.world.months, win: win.id, host: host ? host.id : null };
      f.chron(win.n + ' đoạt giải đấu liên tông do ' + (host ? host.n : 'triều đình') + ' bảo trợ, được thêm tư cách minh chủ và một mỏ.', 'good');
      const pl = TT.player();
      if (pl && pl.sect && ents.indexOf(f.get(pl.sect.id)) >= 0) TT.log(pl, 'Tông của bạn ' + (win.id === pl.sect.id ? 'đoạt giải đấu liên tông!' : 'dự giải đấu liên tông nhưng chưa đoạt giải.'), win.id === pl.sect.id ? 'big' : 'good');
    },
    // Người chơi báo danh (hoặc rút tên) cho tông của mình trong năm trước kỳ giải.
    enter(c) {
      if (!c.sect) return { ok: false, text: 'Bạn chưa thuộc tông môn nào.' };
      if (!inter.giaiOpen()) return { ok: false, text: 'Chưa đến kỳ báo danh giải đấu liên tông.' };
      const G = inter.giaiS(), i = G.ent.indexOf(c.sect.id);
      if (i >= 0) { G.ent.splice(i, 1); return { ok: true, text: 'Tông của bạn đã rút tên khỏi giải đấu.' }; }
      G.ent.push(c.sect.id);
      return { ok: true, text: 'Tông của bạn đã báo danh dự thi giải đấu liên tông.' };
    },
    // Thiên hạ công ước: quốc sư hoặc cung phụng và triều cùng vùng có xác suất ký mỗi năm.
    congStep(y) {
      const S = inter.S();
      TT.fac.list('trieu').filter(TT.fac.alive).forEach(tr => {
        if (S.cong[tr.region] !== undefined) return;
        const t = tongOf(tr.region); if (!t) return;
        if (['quoc_su', 'cung_phung'].indexOf(inter.roleOf(t)) < 0) return;
        if (hn('cong', tr.region, y) >= K.cong.p) return;
        S.cong[tr.region] = TT.world.months;
        TT.diplo.log(tr, t, 'cong_uoc', 0, 'Ký Thiên hạ công ước: tu sĩ cao không đánh phàm');
        TT.fac.chron(tr.n + ' và ' + t.n + ' ký Thiên hạ công ước: tu sĩ cao không đánh phàm.', 'good', near(tr.region));
      });
    },
    // Tông thao túng kế vị (S7): nâng người của mình. Quốc vận triều còn cao thì tông chịu phản phệ; vận mạt thì trơn tru.
    backlash(x, t) {
      const van = TT.nation.view(x).van;
      if (van >= K.manip.vanBack) {
        t.unity = clamp(t.unity - K.manip.unity, 5, 100); t.power = clamp(t.power - K.manip.cost, 1, 100);
        TT.fac.relAdd(t, x, K.manip.rel, ['thao_tung', t.n + ' nâng người của mình lên ngôi ở ' + x.n]);
        TT.fac.chron(t.n + ' thao túng kế vị ở ' + x.n + ', nhưng quốc vận triều còn cao nên bị phản phệ, uy tín tổn.', 'bad', near(x.region));
      } else {
        t.power = clamp(t.power + K.manip.gain, 1, 100);
        TT.fac.chron(t.n + ' nâng người của mình lên ngôi ở ' + x.n + ' khi quốc vận đã mạt, không ai dám trách.', 'age', near(x.region));
      }
    },
    // Đại chiến liên tông: khi hai tông đánh nhau, triều vùng đứng ngoài hay nhúng tay (theo hoàng quyền và băm); giới hạn một lần mỗi `gap` năm.
    warStart(war, a, b) {
      war.stance = 'dung_ngoai';
      if (!inter.on() || a.kind !== 'tong' || b.kind !== 'tong') return;
      const S = inter.S(), W = K.war, tr = trieuOf(b.region), m = TT.world.months;
      if (!tr || m - S.lastBig < W.gap * 12) return;
      const hq = TT.court.peek(tr).hq, r = hn('lienchien', war.id, m);
      let st = null;
      if (hq >= W.hqNhung && r < W.nhung) st = 'nhung_tay';
      else if (r < W.nhung + W.cam) st = 'cam_van';
      else if (hq >= W.hqBoth && r < W.nhung + W.cam + W.both) st = 'danh_ca_hai';
      if (!st) return;
      war.stance = st; war.lt = 1; S.lastBig = m;
      if (st === 'nhung_tay') war.side = (a.power >= b.power ? a : b).id;
      const side = war.side === a.id ? a : b, other = side === a ? b : a;
      const text = { nhung_tay: tr.n + ' cho mượn quân, ủng hộ ' + side.n + ' trong cuộc chiến với ' + other.n + '.', cam_van: tr.n + ' ban lệnh cấm vận cả ' + a.n + ' và ' + b.n + '.', danh_ca_hai: tr.n + ' đem quân đánh cả ' + a.n + ' lẫn ' + b.n + '.' }[st];
      TT.fac.chron('Đại chiến liên tông: ' + text, 'war', near(tr.region));
    },
    // Mỗi năm đại chiến liên tông: cộng điểm chiến cho bên được cho mượn quân (trả về điểm để cộng vào war.score); cấm vận và đánh cả hai trừ kho và sức.
    warTick(war) {
      if (!inter.on() || !war.lt) return 0;
      const a = TT.fac.get(war.a), b = TT.fac.get(war.b); if (!a || !b) return 0;
      const W = K.war;
      if (war.stance === 'cam_van') { a.wealth = clamp(a.wealth - W.embargo, 0, 100); b.wealth = clamp(b.wealth - W.embargo, 0, 100); return 0; }
      if (war.stance === 'danh_ca_hai') { a.power = clamp(a.power - W.bothCost, 1, 100); b.power = clamp(b.power - W.bothCost, 1, 100); return 0; }
      if (war.stance === 'nhung_tay' && war.side) return war.side === war.a ? W.bias : -W.bias;
      return 0;
    },
    // Kết thúc chiến tranh giữa hai tông (gọi từ endWar): đại chiến liên tông để lại dấu ở triều và mạng đồng minh bên thua.
    warEnd(war, res) {
      if (!inter.on() || !war.lt) return;
      const f = TT.fac, a = f.get(war.a), b = f.get(war.b); if (!a || !b) return;
      const win = res === 'a' ? a : res === 'b' ? b : null, lose = win === a ? b : a;
      const tr = trieuOf(b.region);
      if (tr && TT.court.on()) { const E = TT.court.ent(tr); E.hq = clamp(E.hq - K.war.hqLoss, 0, 100); }
      if (win) alliesOf(lose).filter(y => y !== win).forEach(y => f.relAdd(y, win, K.war.lienLuy, ['lien_luy', y.n + ' liên lụy khi ' + win.n + ' thắng ' + lose.n]));
      f.chron('Đại chiến liên tông giữa ' + a.n + ' và ' + b.n + ' kết thúc ' + (win ? 'với ' + win.n + ' thắng' : 'bằng hòa nghị') + ', triều ' + (tr ? tr.n : '') + ' ' + K.stance[war.stance] + '.', 'war');
    },
    // Tông bị tông khác diệt: đồng minh của bên bị diệt thù bên thắng (mạng quan hệ lan ra).
    onDestroy(x, by) {
      if (!inter.on() || x.kind !== 'tong' || !by || by.kind !== 'tong') return;
      alliesOf(x).filter(y => y !== by).forEach(y => TT.fac.relAdd(y, by, K.war.lienLuy, ['lien_luy', y.n + ' thù ' + by.n + ' vì ' + x.n + ' bị diệt']));
    }
  };
})();
