// Tông môn: gia nhập, chức vị (ngoại môn, nội môn, chân truyền, trưởng lão, chưởng môn), nhiệm vụ và cống hiến,
// kho cống hiến, bổng lộc, trục xuất, kế vị. Thành viên là nhân vật có c.sect = { id, rank, contrib, total, since }.
// contrib là điểm cống hiến dùng để đổi vật phẩm (tiêu được), total là tổng cống hiến cả đời trong tông môn (xét thăng chức).
// NPC dùng chung hệ thống này: NPC lõi tự gia nhập, làm nhiệm vụ, thăng chức; NPC phụ giữ chức trưởng lão/chưởng môn cố định.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, S = TT.stats, R = D.SECT_RULES;

  function mainAttr(c) { return c.tuchat.attrs.reduce((a, b) => (b.p > a.p ? b : a), c.tuchat.attrs[0]); }

  const sect = TT.sect = {
    def: id => D.SECTS[id] || null,
    of(c) { return c.sect ? D.SECTS[c.sect.id] : null },
    rankName(c) { return c.sect ? D.SECT_RANKS[c.sect.rank] : '' },
    regionOf(id) { const p = TT.map.place(id); return p ? p.region : null; },

    members(id) {
      const out = [], chars = TT.world.chars;
      for (const k in chars) { const c = chars[k]; if (c.alive && c.sect && c.sect.id === id) out.push(c); }
      return out;
    },
    elders(id) { return sect.members(id).filter(c => c.sect.rank === 3); },
    head(id) { return sect.members(id).find(c => c.sect.rank === 4) || null; },

    // Tên cổ trang của một nhà trong phố tông môn theo từng tông (Đan Các, Khí Các...); null nếu không phải nhà của tông.
    bldName(bid, sectId) {
      const pl = TT.player(), d = D.SECTS[sectId || (pl && pl.place)];
      if (!d || !D.SECT_CORE_ORGS[bid]) return null;
      return (d.coquan && d.coquan[bid]) || D.SECT_CORE_ORGS[bid];
    },

    // Thuộc tính chính của nhân vật có hợp thuộc tính của tông môn không.
    fitElem(c, d) { return d.elems.indexOf(mainAttr(c).n) >= 0; },

    // Điều kiện gia nhập. Trả về { ok, why: [...] }.
    canJoin(c, id, bonus) {
      const d = D.SECTS[id], why = [];
      if (!d) return { ok: false, why: ['Không có tông môn này'] };
      if (TT.fac.isRuin(id)) return { ok: false, why: [d.n + ' đã bị tiêu diệt, chỉ còn tàn tích'] };
      if (c.sect) why.push('Đang là đệ tử của ' + D.SECTS[c.sect.id].n);
      if (c.flags.expelled && c.flags.expelled[id]) why.push('Từng bị trục khỏi tông môn này');
      const need = d.minMain - (sect.fitElem(c, d) ? 8 : 0) - (bonus || 0), main = S.tc(c).main;
      if (main < need) why.push('Tư chất chưa đủ: cần thuộc tính chính từ ' + Math.max(0, need) + ' điểm, bạn có ' + main);
      if (c.kind === 'player' && !bonus && sect.resState(id) === 0) why.push(d.n + ' đang khánh kiệt, tạm không nhận thêm đệ tử');
      const al = TT.rep.alignOf(c);
      if (d.align === 'chinh' && al <= -30) why.push('Tiếng xấu của bạn khiến chính đạo không dung');
      if (d.align === 'ta' && al >= 45) why.push('Tà đạo nghi ngờ bạn là người của chính đạo');
      return { ok: why.length === 0, why };
    },

    // Thử luyện nhập môn: tư chất vượt xa ngưỡng thì "xuất sắc" (được thưởng khởi điểm và được chưởng môn để mắt).
    trial(c, id, bonus) {
      const d = D.SECTS[id], need = Math.max(0, d.minMain - (sect.fitElem(c, d) ? 8 : 0) - (bonus || 0));
      const margin = S.tc(c).main - need;
      return { margin, great: margin >= 15 };
    },

    // Bảo đảm các trường của M1-M3 có đủ (bản lưu cũ chưa có).
    ensure(c) {
      const s = c.sect; if (!s) return null;
      if (s.line === undefined) { s.line = null; s.master = null; s.warn = 0; s.idleY = 0; s.task = null; s.board = []; s.boardAt = -9999; s.lineAt = -9999; s.done = 0; }
      return s;
    },

    join(c, id, bonus) {
      const d = D.SECTS[id], tr = sect.trial(c, id, bonus);
      c.sect = { id, rank: 0, contrib: 0, total: 0, since: TT.world.months };
      sect.ensure(c);
      c.yContrib = 0; TT.report.mark(c, 'sect', 'Gia nhập ' + d.n);
      TT.log(c, 'Bạn được ' + d.n + ' nhận làm ngoại môn đệ tử. Từ nay có chỗ dựa, có nhiệm vụ và có thể đổi cống hiến lấy vật phẩm.', 'big');
      if (tr.great) { c.sect.contrib = c.sect.total = 40; if (c.kind === 'player') TT.log(c, 'Thử luyện nhập môn: bạn làm xuất sắc, chưởng môn để mắt tới. Cống hiến khởi điểm +40.', 'good'); }
      if (c.kind === 'player') TT.news(c.name + ' gia nhập ' + d.n + ' (' + D.SECT_ALIGN[d.align] + ').', 'good', [c.id]);
      // Quen biết chưởng môn và trưởng lão
      const h = sect.head(id);
      if (h && c.kind === 'player') TT.rel.add(c, h, tr.great ? 10 : 5);
      if (c.kind === 'player') sect.ensureBoard(c);
    },

    leave(c, why) {
      if (!c.sect) return;
      const id = c.sect.id, d = D.SECTS[id], rank = c.sect.rank;
      c.sect = null;
      c.flags.leftSect = TT.world.months;
      TT.log(c, 'Bạn rời ' + d.n + (why ? ' (' + why + ')' : '') + '. Mọi cống hiến coi như bỏ lại.', 'age');
      if (rank >= 3) { // bỏ chức vị cao là phản bội, chưởng môn ghi hận
        const h = sect.head(id);
        if (h && h !== c && h.kind !== 'player') TT.social.makeEnemy(h, c, 'bỏ tông môn khi giữ chức ' + D.SECT_RANKS[rank].toLowerCase());
      }
      if (c.kind === 'player') TT.news(c.name + ' rời ' + d.n + '.', '', [c.id]);
    },

    expel(c, why) {
      if (!c.sect) return;
      const id = c.sect.id, d = D.SECTS[id], rank = c.sect.rank;
      c.sect = null;
      c.flags.expelled = c.flags.expelled || {}; c.flags.expelled[id] = true;
      TT.log(c, d.n + ' trục xuất bạn khỏi tông môn (' + why + ').', 'bad');
      TT.ev.dao(c, -3);
      if (c.kind === 'player') TT.news(c.name + ' bị ' + d.n + ' trục xuất (' + why + ').', 'bad', [c.id]);
      if (rank >= 2) {
        const h = sect.head(id);
        if (h && h !== c && h.kind !== 'player') TT.social.makeEnemy(h, c, 'bị trục khỏi tông môn');
      }
    },

    // Hiệu ứng tháng khi làm nhiệm vụ tông môn (thay cho hành động "kiếm sống" của thành viên).
    // Tuyệt học của tông (chỉ từ Chân truyền trở lên) và đường đang theo.
    secretOf(c) { const s = c.sect; if (!s || s.rank < 2) return {}; const d = D.SECTS[s.id]; return (d && d.secret) || {}; },
    lineDef(c) { const s = c.sect; return (s && s.line && D.SECT_LINES[s.line]) || { contrib: 1, pay: 1, hurt: 1, train: 0 }; },

    mission(c) {
      const s = sect.ensure(c), d = D.SECTS[s.id], player = c.kind === 'player';
      const ln = sect.lineDef(c), sec = sect.secretOf(c);
      const mul = player && s.task ? 0.4 : 1; // đang nhận việc trên bảng thì việc vặt chỉ còn chút ít
      const gain = rng.RI(1, 3) * (1 + 0.6 * c.realm) * (1 + 0.5 * s.rank) * TT.fac.warBonus(c) * ln.contrib * (sec.contrib || 1) * mul;
      s.contrib += gain; s.total += gain; c.yContrib = (c.yContrib || 0) + gain;
      const pay = rng.RI(1, 4) * (1 + c.realm) * 0.5 * ln.pay * (sec.pay || 1) * mul;
      if (player) TT.ls.gain(c, pay / D.LS.RATE); else TT.ev.gold(c, pay);
      TT.rep.add(c, 'chinh', d.align === 'chinh' ? 0.15 : d.align === 'ta' ? -0.25 : 0);
      if (rng.P(0.03 * ln.hurt * (sec.hurt != null ? sec.hurt : 1))) {
        const dmg = rng.RI(8, 20);
        TT.ev.hp(c, -dmg);
        TT.log(c, 'Đang làm nhiệm vụ của ' + d.n + ', bạn bị thương, sinh lực -' + dmg + '.', 'bad');
      }
      // đặc trưng từng đường
      if (s.line === 'tang' && rng.P(0.04)) TT.ev.xp(c, TT.ev.NR(c) * 0.02);
      if (s.line === 'duoc' && player && rng.P(0.06)) TT.items.add(c, 'linh_thao');
      if (player) { sect.pruneBoard(c); if (s.task) sect.taskStep(c); else sect.ensureBoard(c); }
    },

    // Hệ số tu luyện của thành viên (bậc cao hơn, hợp thuộc tính thì nhanh hơn; đường Tàng kinh, tuyệt học và sư phụ cộng thêm).
    trainBonus(c) {
      if (!c.sect) return 1;
      const d = D.SECTS[c.sect.id];
      const mach = c.kind === 'player' ? D.SECT_RES.trainPerMach * ((sect.res(c.sect.id) || { mach: 1 }).mach - 1) : 0;
      return 1 + R.trainPerRank * (c.sect.rank + 1) + (sect.fitElem(c, d) ? R.elemBonus : 0) + sect.lineDef(c).train + (sect.secretOf(c).train || 0) + (sect.masterBonus(c) ? 0.03 : 0) + mach;
    },
    breakBonus(c) { return c.sect ? R.breakPerRank * Math.min(4, c.sect.rank) + (sect.secretOf(c).brk || 0) : 0; },

    // ---------- bốn đường ----------
    setLine(c, id, free) {
      const s = sect.ensure(c), d = D.SECT_LINES[id], B = D.SECT_BI;
      if (!s || !d) return { ok: false, text: 'Không có đường này.' };
      if (s.rank < 1) return { ok: false, text: 'Phải lên nội môn mới chọn đường.' };
      if (s.line === id) return { ok: false, text: 'Bạn đang theo đường này.' };
      const first = !s.line, cost = first || free ? 0 : B.lineChangeCost;
      if (!first && !free && TT.world.months - s.lineAt < B.lineChangeCool) return { ok: false, text: 'Mới đổi đường, chờ ' + (B.lineChangeCool - (TT.world.months - s.lineAt)) + ' tháng nữa.' };
      if (s.contrib < cost) return { ok: false, text: 'Đổi đường tốn ' + cost + ' cống hiến.' };
      s.contrib -= cost; s.line = id; s.lineAt = TT.world.months;
      if (s.task && s.task.line !== id) { /* việc đang làm vẫn tiếp tục */ }
      TT.log(c, 'Bạn theo đường ' + d.n + ' của ' + D.SECTS[s.id].n + '.', 'age');
      return { ok: true, text: 'Bạn theo đường ' + d.n + '.' };
    },
    pickLine(c) { // NPC hoặc chế độ tự động chọn đường theo trọng số của tông
      const d = D.SECTS[c.sect.id], w = d.lineW || [1, 1, 1, 1];
      let jobLine = null; const j = c.job && c.job.main; if (j === 'dan' || j === 'khi' || j === 'bua' || j === 'y_su') jobLine = 'duoc'; else if (j === 'thuong_nhan') jobLine = 'ngoai'; else if (j === 'kiem' || j === 'linh_danh') jobLine = 'chap';
      const list = D.SECT_LINE_IDS.map((id, i) => ({ id, w: w[i] * (id === jobLine ? 2.5 : 1) }));
      return rng.wpick(list, x => x.w).id;
    },

    // ---------- bảng nhiệm vụ tông ----------
    pruneBoard(c) {
      const s = sect.ensure(c), m = TT.world.months;
      s.board = s.board.filter(t => t.due > m);
    },
    ensureBoard(c) {
      const s = sect.ensure(c); if (!s || c.kind !== 'player') return;
      const m = TT.world.months, B = D.SECT_BI;
      if (s.board.length && m - s.boardAt < B.boardMonths / 2) return;
      s.boardAt = m; s.board = [];
      const pool = D.SECT_TASKS.slice();
      for (let i = 0; i < B.boardSize && pool.length; i++) {
        const t = rng.wpick(pool.map(x => ({ t: x, w: s.line ? (x.line === s.line ? 3 : 1) : 1 })), x => x.w).t;
        pool.splice(pool.indexOf(t), 1);
        const dur = rng.RI(t.dur[0], t.dur[1]), ln = D.SECT_LINES[t.line], sec = sect.secretOf(c);
        const base = dur * 2 * (1 + 0.6 * c.realm) * (1 + 0.5 * s.rank);
        s.board.push({
          tid: t.id, line: t.line, dur, left: dur, need: c.realm,
          contrib: Math.round(base * 1.5 * t.diff * ln.contrib * (sec.contrib || 1) * (t.line === s.line ? 1.1 : 1)),
          pay: Math.round(dur * 2.5 * (1 + c.realm) * 0.5 * t.diff * 1.5 * ln.pay * (sec.pay || 1)), // vàng, đổi ra linh thạch khi nhận
          due: m + B.boardMonths
        });
      }
    },
    taskDef: t => D.SECT_TASKS.find(x => x.id === t.tid) || { n: '?', text: '', diff: 1, risk: 1 },
    acceptTask(c, idx) {
      const s = sect.ensure(c);
      if (!s) return { ok: false, text: 'Bạn chưa vào tông môn.' };
      if (s.task) return { ok: false, text: 'Bạn đang có việc chưa xong.' };
      const t = s.board[idx]; if (!t) return { ok: false, text: 'Việc này không còn.' };
      s.board.splice(idx, 1); s.task = t;
      TT.log(c, 'Bạn nhận việc tông môn: ' + sect.taskDef(t).n + ' (' + t.dur + ' tháng).', 'age');
      return { ok: true, text: 'Đã nhận việc. Chỉ tiến triển khi bạn "Kiếm sống" (làm việc tông môn).' };
    },
    abandonTask(c) {
      const s = sect.ensure(c); if (!s || !s.task) return { ok: false, text: 'Không có việc nào.' };
      const nm = sect.taskDef(s.task).n; s.task = null; s.contrib = Math.max(0, s.contrib - 10);
      TT.log(c, 'Bạn bỏ dở việc tông môn "' + nm + '". Cống hiến -10.', 'bad');
      return { ok: true, text: 'Đã bỏ việc, cống hiến -10.' };
    },
    taskStep(c) {
      const s = c.sect, t = s.task; if (!t) return;
      t.left--;
      if (t.left > 0) return;
      const def = sect.taskDef(t), d = D.SECTS[s.id], S2 = TT.stats;
      const hurt = c.hp < S2.hpMax(c) * 0.5;
      const p = rng.clamp(0.66 + 0.1 * (c.realm - t.need) + (t.line === s.line ? 0.08 : 0) - 0.12 * (def.diff - 1) + 0.02 * s.rank - (hurt ? 0.1 : 0), 0.2, 0.95);
      s.task = null; s.done = (s.done || 0) + 1;
      if (rng.P(p)) {
        s.contrib += t.contrib; s.total += t.contrib; c.yContrib = (c.yContrib || 0) + t.contrib;
        TT.ls.gain(c, t.pay / D.LS.RATE);
        const extra = [];
        if (t.line === 'duoc') { const n = rng.RI(2, 5); TT.items.add(c, 'linh_thao', n); extra.push(n + ' linh thảo'); }
        if (t.line === 'tang') { TT.ev.xp(c, TT.ev.NR(c) * 0.04); extra.push('tu vi tăng'); }
        if (t.line === 'chap') { TT.rep.add(c, 'danh', 2); extra.push('danh vọng +2'); }
        if (t.line === 'ngoai') { TT.rep.add(c, 'danh', 1); extra.push('danh vọng +1'); }
        TT.log(c, 'Hoàn thành việc tông: ' + def.n + '. Cống hiến +' + t.contrib + ', thưởng ' + TT.ls.fmt(t.pay) + (extra.length ? ', ' + extra.join(', ') : '') + '.', 'good');
      } else {
        const dmg = rng.P(0.6 * def.risk) ? rng.RI(8, 20) : 0;
        const keep = Math.round(t.contrib * 0.2); s.contrib += keep; s.total += keep;
        if (dmg) TT.ev.hp(c, -dmg);
        TT.log(c, 'Việc tông "' + def.n + '" thất bại.' + (dmg ? ' Sinh lực -' + dmg + '.' : '') + ' Chỉ ghi được ' + keep + ' cống hiến công sức.', 'bad');
      }
    },

    // Nộp phạt ở Chấp pháp đường: xóa một lần cảnh cáo.
    payFine(c) {
      const s = sect.ensure(c); if (!s || !(s.warn > 0)) return { ok: false, text: 'Bạn không có cảnh cáo nào.' };
      if (s.contrib < 40) return { ok: false, text: 'Nộp phạt cần 40 cống hiến.' };
      s.contrib -= 40; s.warn--;
      TT.log(c, 'Bạn nộp phạt ở Chấp pháp đường, xóa một lần cảnh cáo. Cống hiến -40.', 'age');
      return { ok: true, text: 'Đã nộp phạt, còn ' + s.warn + ' lần cảnh cáo.' };
    },
    // Xin thăng bậc ngay ở Điện chưởng môn (thay vì chờ cuối năm).
    petitionPromote(c) {
      const nx = sect.nextRank(c);
      if (!nx) return { ok: false, text: 'Bạn không còn bậc nào để xin thăng.' };
      if (!nx.ok) return { ok: false, text: 'Còn thiếu: ' + nx.why.join('; ') + '.' };
      sect.tryPromote(c); return { ok: true, text: 'Bạn được thăng ' + D.SECT_RANKS[c.sect.rank] + '.' };
    },

    // ---------- sư phụ nội môn ----------
    masterBonus(c) { const s = c.sect; if (!s || c.kind !== 'player' || !s.master) return false; const m = TT.world.chars[s.master]; return !!(m && m.alive && m.sect && m.sect.id === s.id); },
    ensureMaster(c) {
      const s = sect.ensure(c); if (!s || s.rank < 1 || s.rank > 2 || sect.masterBonus(c)) return;
      const cand = sect.members(s.id).filter(m => m !== c && m.kind !== 'player' && m.sect.rank >= 2 && m.realm > c.realm)
        .sort((a, b) => ((b.sect.line === s.line) - (a.sect.line === s.line)) || (a.realm - b.realm) || (a.id - b.id));
      if (!cand.length) { s.master = null; return; }
      const m = cand[0]; s.master = m.id;
      TT.rel.add(c, m, 12);
      TT.log(c, m.name + ' (' + TT.stats.realmName(m) + ') nhận bạn làm đồ đệ nội môn, chỉ dạy thêm. Tu luyện nhanh thêm 3%.', 'good');
    },

    // Điều kiện lên bậc kế tiếp (trừ chưởng môn, chỉ có qua kế vị).
    nextRank(c) {
      if (!c.sect || c.sect.rank >= 3) return null;
      const n = c.sect.rank + 1, req = R.promote[n], why = [];
      if (c.realm < req.realm) why.push('cần cảnh giới ' + D.REALM_NAMES[req.realm]);
      if (c.sect.total < req.contrib) why.push('cần ' + req.contrib + ' cống hiến (có ' + Math.floor(c.sect.total) + ')');
      if (n === 3 && sect.elders(c.sect.id).length >= R.elderSlots) why.push('các ghế trưởng lão đã đủ người');
      return { rank: n, req, why, ok: why.length === 0 };
    },

    tryPromote(c) {
      const nx = sect.nextRank(c);
      if (!nx || !nx.ok) return false;
      c.sect.rank = nx.rank;
      const d = D.SECTS[c.sect.id];
      sect.ensure(c);
      if (c.kind === 'npc' && nx.rank >= 1 && !c.sect.line) c.sect.line = sect.pickLine(c);
      TT.log(c, 'Bạn được thăng làm ' + D.SECT_RANKS[nx.rank] + ' của ' + d.n + '!', 'big');
      if (c.kind === 'player' && nx.rank === 1) TT.log(c, 'Từ nội môn, bạn được chọn một trong bốn đường của tông (xem tab Tông môn).', 'age');
      if (c.kind === 'player' && nx.rank === 2) TT.log(c, 'Chân truyền được học tuyệt học của tông: ' + (d.secret ? d.secret.n : '') + '.', 'good');
      TT.rep.add(c, 'danh', nx.rank * 4);
      if (nx.rank >= 2 && (c.kind === 'player' || nx.rank >= 3)) TT.news(c.name + ' được thăng ' + D.SECT_RANKS[nx.rank] + ' của ' + d.n + '.', 'good', [c.id]);
      return true;
    },

    // Mỗi năm: bổng lộc, thăng chức, kiểm tra hợp ý (chính tà), NPC tự xin gia nhập.
    yearly(c) {
      if (c.sect) {
        const s = c.sect, d = D.SECTS[s.id];
        const pay = Math.round(R.stipend[s.rank] * (1 + 0.3 * c.realm) * (c.kind === 'player' ? sect.stipendMul(s.id) : 1));
        s.donY = 0;
        if (c.kind === 'player') { TT.ls.gain(c, pay / D.LS.RATE); TT.log(c, 'Bổng lộc hằng năm của ' + d.n + ': ' + TT.ls.fmt(pay) + '.', 'age'); } else TT.ev.gold(c, pay);
        while (sect.tryPromote(c)) { /* có thể lên liền nhiều bậc nếu đủ điều kiện */ }
        const al = TT.rep.alignOf(c);
        if (c.kind === 'player') {
          sect.ensure(c); sect.pruneBoard(c); sect.ensureBoard(c); sect.ensureMaster(c);
          // luật tông: lần 1 cảnh cáo, lần 2 phạt cống hiến, lần 3 trục xuất
          s.idleY = (c.lastYContrib || 0) > 0 ? 0 : (s.idleY || 0) + 1;
          const law = D.SECT_LAWS[d.law];
          if (law && s.rank < 3 && law.test(c)) {
            s.warn = (s.warn || 0) + 1;
            if (s.warn >= 3 && d.law === 'lao') s.warn = 2; // lười thì bị phạt hằng năm chứ không bị đuổi
            if (s.warn === 1) TT.log(c, d.n + ' cảnh cáo bạn phạm luật tông: ' + law.n + '.', 'bad');
            else if (s.warn === 2) { const f = Math.floor(s.contrib * 0.2); s.contrib -= f; TT.log(c, d.n + ' phạt bạn vì lại phạm luật "' + law.n + '". Cống hiến -' + f + '.', 'bad'); }
            else { s.warn = 0; sect.expel(c, 'phạm luật tông nhiều lần: ' + law.n); return; }
          } else if (s.warn > 0) s.warn--;
        }
        if (c.kind === 'player' && s.rank < 4) {
          if (d.align === 'chinh' && al <= -50) sect.expel(c, 'hành vi tà ác, trái với chính đạo');
          else if (d.align === 'ta' && al >= 50) sect.expel(c, 'bị nghi là người của chính đạo');
        }
        return;
      }
      if (c.kind === 'npc' && c.tier === 'core' && c.place && !c.travel) {
        const d = D.SECTS[c.place];
        if (d && TT.age(c) >= 13 && TT.age(c) <= 60 && rng.P(0.12 * TT.sectmod.recruitMul(c.place))) {
          const al = TT.rep.alignOf(c);
          const like = d.align === 'chinh' ? al >= -10 : d.align === 'ta' ? al <= 10 : true;
          if (like && sect.canJoin(c, c.place).ok) sect.join(c, c.place);
        }
      }
    },

    // ---------- chức vị bỏ trống và kế vị ----------
    // Mỗi tông môn luôn có chưởng môn và ít nhất 2 trưởng lão: thiếu thì dựng NPC phụ giữ chức.
    ensureLeaders(rid) {
      TT.map.placesOf(rid).forEach(p => {
        if (p.type !== 'tong_mon' || TT.fac.isRuin(p.id)) return;
        if (!sect.head(p.id)) {
          const el = sect.elders(p.id);
          if (el.length) sect.appointHead(p.id);
          else TT.life.makeRoleNpc(p.id, ['Chưởng môn', 3, 4]);
        }
        let n = sect.elders(p.id).length, guard = 0;
        while (n < 2 && guard++ < 3) { if (!sect.fillElder(p.id)) { TT.life.makeRoleNpc(p.id, ['Trưởng lão', 2, 3]); } n = sect.elders(p.id).length; }
      });
    },

    // Chọn trưởng lão mạnh nhất lên làm chưởng môn (người chơi thì được hỏi nếu là ứng viên thực sự).
    appointHead(id) {
      const el = sect.elders(id).sort((a, b) => (b.realm - a.realm) || (b.sect.total - a.sect.total));
      if (!el.length) return null;
      const w = TT.world, pl = TT.player();
      const best = el[0];
      if (pl && pl.alive && pl.sect && pl.sect.id === id && pl.sect.rank === 3 && el.indexOf(pl) >= 0 && !w.pending) {
        if (best === pl) { sect.makeHead(pl); return pl; }
        if (pl.realm + 1 >= best.realm) { TT.events.fire(pl, D.eventById.sect_succession, { sectId: id, otherId: best.id }); return null; }
      }
      const win = best === pl ? (el[1] || null) : best; // người chơi vắng chọn thì NPC mạnh nhất
      if (win) sect.makeHead(win);
      return win;
    },

    makeHead(c) {
      const d = D.SECTS[c.sect.id];
      c.sect.rank = 4;
      if (c.tier === 'phu') c.role = 'Chưởng môn';
      TT.log(c, 'Bạn trở thành chưởng môn của ' + d.n + '!', 'big');
      TT.news(c.name + ' trở thành tân chưởng môn của ' + d.n + '.', 'good', [c.id]);
      TT.rep.add(c, 'danh', 15);
    },

    // Thăng thành viên đủ điều kiện nhất lên trưởng lão khi thiếu người. Trả về true nếu đã có người.
    fillElder(id) {
      const cand = sect.members(id).filter(c => c.sect.rank === 2 && c.realm >= R.promote[3].realm && c.sect.total >= R.promote[3].contrib * 0.6);
      if (!cand.length) return false;
      cand.sort((a, b) => (b.realm - a.realm) || (b.sect.total - a.sect.total));
      const c = cand[0];
      c.sect.rank = 3;
      TT.log(c, 'Bạn được đề cử làm trưởng lão của ' + D.SECTS[id].n + '.', 'big');
      TT.news(c.name + ' trở thành trưởng lão của ' + D.SECTS[id].n + '.', 'good', [c.id]);
      return true;
    },

    // Chưởng môn hoặc trưởng lão qua đời.
    onDeath(c) {
      if (!c.sect) return;
      const id = c.sect.id, rank = c.sect.rank;
      c.sect.rank = 0; // không còn tính vào chức vị
      if (rank === 4) { if (!sect.appointHead(id)) { /* chưa có ai: ensureLeaders sẽ bù */ } }
      else if (rank === 3) sect.fillElder(id);
      sect.ensureLeaders(sect.regionOf(id));
    },

    // ---------- đại bỉ (năm năm một lần mỗi tông, lệch pha theo tông) ----------
    biScore(c) { return c.realm * 100 + TT.stats.atk(c) + rng.RI(0, 30); },
    biGroup(c) { return Math.min(2, c.sect.rank); },
    biYear(id) { let h = 0; for (let i = 0; i < id.length; i++) h += id.charCodeAt(i); return h % D.SECT_BI.every; },
    // Số năm nữa tới kỳ đại bỉ kế tiếp (tính từ đầu năm thế giới hiện tại).
    biNext(id) { const y = Math.floor(TT.world.months / 12), e = D.SECT_BI.every; let n = y + 1; while (n % e !== sect.biYear(id)) n++; return n - y; },
    worldYearly() {
      const w = TT.world, year = Math.floor(w.months / 12);
      if (year < 1) return;
      Object.keys(D.SECTS).forEach(id => {
        if (TT.fac.isRuin(id) || year % D.SECT_BI.every !== sect.biYear(id)) return;
        sect.daiBi(id);
      });
    },
    daiBi(id) {
      const w = TT.world, B = D.SECT_BI, d = D.SECTS[id], pl = TT.player();
      w.sectBi = w.sectBi || {};
      const rec = w.sectBi[id] = { year: Math.floor(w.months / 12), scores: {} };
      const groups = [[], [], []];
      sect.members(id).filter(c => c.sect.rank <= 2).forEach(c => groups[sect.biGroup(c)].push(c));
      groups.forEach((g, gi) => {
        const npcs = g.filter(c => c.kind !== 'player');
        if (!npcs.length) return;
        const ranked = npcs.map(c => ({ c, s: sect.biScore(c) })).sort((a, b) => b.s - a.s);
        rec.scores[gi] = ranked.map(x => x.s);
        ranked.slice(0, 3).forEach((x, i) => { const amt = Math.round(B.reward[i] * (1 + 0.5 * x.c.sect.rank) * (1 + 0.3 * x.c.realm) * 0.5); x.c.sect.contrib += amt; x.c.sect.total += amt; });
        if (gi >= 1 && ranked.length >= 2) TT.news(ranked[0].c.name + ' đoạt hạng nhất đại bỉ ' + B.groups[gi] + ' của ' + d.n + '.', '', [ranked[0].c.id]);
        if (pl && pl.alive && pl.sect && pl.sect.id === id && sect.biGroup(pl) === gi && !w.pending && !pl.travel && !pl.cross && D.eventById.sect_dai_bi) {
          // thời gian chạy nhanh thì thưa hỏi đi (giống tần suất sự kiện thường); không hỏi thì tự lên đài nếu đủ sức
          const ev = D.eventById.sect_dai_bi, ctx = { sectId: id, gi };
          if (gi >= 1 && rng.P(1 / Math.sqrt(TT.config.timeScale(pl)))) TT.events.fire(pl, ev, ctx); // ngoại môn tự lên đài, từ nội môn mới hỏi
          else if (pl.hp >= TT.stats.hpMax(pl) * 0.5) TT.events.apply(pl, ev, 'du', ctx);
        }
      });
    },
    daiBiPlayer(c, ctx) {
      const w = TT.world, rec = w.sectBi && w.sectBi[ctx.sectId], scores = (rec && rec.scores[ctx.gi]) || [], B = D.SECT_BI;
      const me = sect.biScore(c), place = 1 + scores.filter(x => x > me).length;
      const amt = Math.round(B.reward[Math.min(3, place - 1)] * (1 + 0.5 * c.sect.rank) * (1 + 0.3 * c.realm));
      c.sect.contrib += amt; c.sect.total += amt;
      if (place <= 3) TT.rep.add(c, 'danh', 4 - place); else TT.ev.hp(c, -rng.RI(5, 15));
      return { place, amt, of: scores.length + 1 };
    },

    // ---------- tài nguyên tông (M5) ----------
    // Kho của tông là wealth (0-100) của thế lực; linh mạch và mỏ kéo kho về mức cao hơn, chiến tranh và cống nạp kéo xuống.
    res(id) {
      const x = TT.fac.get(id); if (!x) return null;
      if (!x.res) { const d = D.SECTS[id]; x.res = { mach: d.mach || 1, mo: d.mo || 0 }; }
      return x.res;
    },
    resState(id) { const x = TT.fac.get(id), P = D.SECT_RES, w = x ? x.wealth : 50; return w >= P.rich ? 3 : w >= P.ok ? 2 : w >= P.hungry ? 1 : 0; },
    resName(id) { return D.SECT_RES.names[sect.resState(id)]; },
    stipendMul(id) { return D.SECT_RES.stipendMul[sect.resState(id)]; },
    priceMul(id) { return D.SECT_RES.priceMul[sect.resState(id)]; },
    resYearly(x) { // mỗi năm cho thế lực tông (gọi từ factions.tickInternal)
      const P = D.SECT_RES, r = sect.res(x.id); if (!r) return;
      const target = P.wealthBase + P.perMach * r.mach + P.perMo * r.mo;
      x.wealth = rng.clamp(x.wealth + (target - x.wealth) * P.drift, 0, 100);
      // cống nạp cho vương triều nay do hiệp ước (systems/pacts.js) tính
      if (r.mach > 1 && rng.P(P.machLoss)) { r.mach--; TT.fac.chron('Linh mạch của ' + x.n + ' cạn dần, tông môn suy yếu.', 'bad'); }
      else if (r.mo < 3 && x.wealth > 50 && rng.P(P.moGain)) { r.mo++; TT.fac.chron(x.n + ' khai mở thêm một mỏ mới, kho tông thêm đầy.', 'good'); }
    },
    spoils(win, lose) { // thắng trận thì chiếm mỏ (hoặc hiếm hơn là cướp linh mạch) của kẻ thua
      const a = sect.res(win.id), b = sect.res(lose.id); if (!a || !b) return;
      if (b.mo > 0 && a.mo < 3) { b.mo--; a.mo++; TT.fac.chron(win.n + ' chiếm một mỏ của ' + lose.n + '.', 'war'); }
      else if (b.mach > 1 && a.mach < 3 && rng.P(0.3)) { b.mach--; a.mach++; TT.fac.chron(win.n + ' cướp một nhánh linh mạch của ' + lose.n + '.', 'war'); }
    },
    // Hiến vật phẩm (đan, bùa, thảo sắp hỏng) cho kho tông: giá trị đổi ra hạ phẩm x tỉ lệ quyên x 1,2; chung trần quyên mỗi năm.
    donateItem(c, id, n) {
      const s = sect.ensure(c), P = D.SECT_RES;
      if (!s) return { ok: false, text: 'Bạn chưa vào tông môn.' };
      n = Math.min(n || 1, TT.items.count(c, id)); if (n < 1) return { ok: false, text: 'Không có vật phẩm này.' };
      const hp = TT.items.value(c, id) * n / D.LS.RATE, room = P.donateCap - (s.donY || 0);
      const gain = Math.min(Math.floor(hp * P.donateRate * 1.2), room);
      if (gain < 1) return { ok: false, text: room < 1 ? 'Năm nay bạn đã quyên đủ trần cống hiến.' : 'Món này giá trị quá nhỏ để quyên.' };
      TT.items.remove(c, id, n); s.donY = (s.donY || 0) + gain; s.contrib += gain; s.total += gain;
      const x = TT.fac.get(s.id); if (x) x.wealth = rng.clamp(x.wealth + hp * 0.05, 0, 100);
      TT.log(c, 'Bạn hiến ' + n + ' ' + D.ITEMS[id].n + ' cho kho ' + D.SECTS[s.id].n + '. Cống hiến +' + gain + '.', 'good');
      return { ok: true, text: 'Đã hiến ' + n + ' ' + D.ITEMS[id].n + ', cống hiến +' + gain + '.' };
    },
    donate(c, n) { // quyên n hạ phẩm cho kho tông, đổi lấy cống hiến
      const s = sect.ensure(c), P = D.SECT_RES;
      if (!s) return { ok: false, text: 'Bạn chưa vào tông môn.' };
      const gold = n * D.LS.RATE, gain = n * P.donateRate;
      if (!TT.ls.can(c, gold)) return { ok: false, text: 'Không đủ linh thạch.' };
      if ((s.donY || 0) + gain > P.donateCap) return { ok: false, text: 'Mỗi năm chỉ quyên được tối đa ' + P.donateCap + ' cống hiến (còn ' + Math.max(0, P.donateCap - (s.donY || 0)) + ').' };
      TT.ls.spend(c, gold); s.donY = (s.donY || 0) + gain; s.contrib += gain; s.total += gain;
      const x = TT.fac.get(s.id); if (x) x.wealth = rng.clamp(x.wealth + n * 0.05, 0, 100);
      TT.log(c, 'Bạn quyên ' + n + ' hạ phẩm cho kho ' + D.SECTS[s.id].n + '. Cống hiến +' + gain + '.', 'good');
      return { ok: true, text: 'Đã quyên ' + n + ' hạ phẩm, cống hiến +' + gain + '.' };
    },

    // Chế độ Tự động: tự chọn đường, tự nhận việc trên bảng.
    autoManage(c) {
      const s = sect.ensure(c); if (!s) return;
      if (s.rank >= 1 && !s.line) sect.setLine(c, sect.pickLine(c));
      sect.pruneBoard(c); sect.ensureBoard(c);
      if (!s.task && s.board.length) {
        let bi = -1, bs = -1;
        s.board.forEach((t, i) => { const sc = t.contrib / (1 + 0.5 * sect.taskDef(t).risk) * (t.line === s.line ? 1.2 : 1); if (sc > bs) { bs = sc; bi = i; } });
        if (bi >= 0) sect.acceptTask(c, bi);
      }
    },

    // ---------- kho cống hiến ----------
    // Mục cố định cộng bí kíp công pháp hợp thuộc tính của tông môn (phẩm cao cần bậc cao) và tâm đắc nghề chuyên môn.
    shopList(c) {
      let list = D.SECT_SHOP.slice();
      const d = c.sect && D.SECTS[c.sect.id];
      if (!d) return list;
      const pm = sect.priceMul(c.sect.id), scale = L => L.map(it => Object.assign({}, it, { cost: Math.max(1, Math.round(it.cost * pm)) }));
      D.TECHS.forEach(t => {
        if (t.tier > 1 || !t.elem || d.elems.indexOf(t.elem) < 0) return;
        list.push({
          id: 'bk_' + t.id, n: 'Bí kíp: ' + t.n, cost: 100 + 200 * t.tier, minRank: t.tier, desc: 'Học công pháp ' + t.n + ' (' + D.TIER_NAMES[t.tier] + ', hệ ' + t.elem + ').',
          can: () => false, run: ch => { TT.items.add(ch, 'bk_' + t.id); return 'Bạn đổi được bí kíp ' + t.n + ' (trong túi, hãy đọc để học).'; }
        });
      });
      Object.keys(D.CRAFTS).forEach(cid => {
        if (D.CRAFTS[cid].sect !== c.sect.id) return;
        list.push({
          id: 'tam_dac_' + cid, n: 'Tâm đắc ' + D.CRAFTS[cid].n.toLowerCase(), cost: 500, minRank: 2, desc: 'Nâng trần cấp ' + D.CRAFTS[cid].n.toLowerCase() + ' thêm 2 khi đọc.',
          can: () => false, run: ch => { TT.items.add(ch, 'tam_dac_' + cid); return 'Bạn đổi được tâm đắc nghề (trong túi).'; }
        });
      });
      return scale(list); // giá đổi theo độ giàu của kho tông
    },
    shopState(c, item) {
      if (!c.sect) return 'Chưa vào tông môn';
      if (c.place !== c.sect.id || c.travel) return 'Phải có mặt ở tông môn';
      if (c.sect.rank < item.minRank) return 'Cần bậc ' + D.SECT_RANKS[item.minRank];
      if (c.sect.contrib < item.cost) return 'Thiếu cống hiến (' + Math.floor(c.sect.contrib) + '/' + item.cost + ')';
      const w = item.can ? item.can(c) : false;
      return w || false;
    },
    buy(c, id) {
      const item = sect.shopList(c).find(x => x.id === id);
      if (!item) return { ok: false, text: 'Không có mục này.' };
      const why = sect.shopState(c, item);
      if (why) return { ok: false, text: why };
      c.sect.contrib -= item.cost;
      const text = item.run(c);
      TT.log(c, text + ' (cống hiến -' + item.cost + ')', 'good');
      return { ok: true, text };
    }
  };
})();
