// Bộ máy kịch bản (K1, Q "giọng truyện" mục 1b, 4b, 6c, 7, 1c): khuyết điểm gốc (c.story.kd), khe kịch bản, phần và nhịp, Story Director,
// thử thách có hạn, lời dẫn sau lựa chọn của cảnh lớn, luật gọi tên (cờ khinh_*). Dữ liệu thuần trong c.story (khởi tạo muộn):
//   kd, kd_khoa (1: không đổi nữa), phanMax (số phần cao nhất từng vào, 0 là phần 1), ct_at (tháng của cao trào gần nhất);
//   mỗi tuyến c.story.arcs[id]: khe { khe: chữ }, khe_id { khe: id thế lực/vật }, phan, nhip, tt { lc, ch, can, m0, m1, dat, truot, tieu } (thử thách đang chạy).
// Công tắc D.STORY.kbOn. Hàm ĐỌC (kdOf, kd, phanOf, phanText, ttCheck, ttInfo, ttSig, hold) không gọi rng và không ghi dữ liệu.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data;
  const K = () => D.STORY, KC = () => D.STORY.kbc;
  const AXES = ['tinh', 'xuthe', 'daoduc', 'tudung'];
  const NHIP = ['moc', 'leo', 'dao', 'cao_trao', 'treo'];
  const lower = t => t.charAt(0).toLowerCase() + t.slice(1);

  // Chỉ mục chặng -> { i (phần), nhip } của một kịch bản có phan[] (đệm bằng WeakMap, không ghi vào dữ liệu).
  const PM = new WeakMap();
  function phanMap(arc) {
    let m = PM.get(arc); if (m) return m;
    m = {};
    (arc.phan || []).forEach((p, i) => NHIP.forEach(n => [].concat(p[n] || []).forEach(id => { if (!m[id]) m[id] = { i, nhip: n }; })));
    PM.set(arc, m); return m;
  }

  // Thế lực mạnh kề bên trong mô phỏng: tông còn sống cùng vùng hoặc vùng giáp, không phải tông của người chơi; mạnh nhất (gần được ưu tiên).
  function theLuc(c) {
    const near = [c.region].concat(TT.map.macroNeighbors(c.region).map(x => x.to));
    let best = null, bs = -Infinity;
    TT.fac.list('tong').forEach(f => {
      if (!TT.fac.alive(f) || (c.sect && c.sect.id === f.id)) return;
      const i = near.indexOf(f.region); if (i < 0) return;
      const sc = f.power - (i === 0 ? 0 : 15);
      if (sc > bs || (sc === bs && best && f.id < best.id)) { bs = sc; best = f; }
    });
    return best;
  }

  const kb = TT.kb = {
    // ---------- khuyết điểm gốc (đọc thuần): theo trục lệch nhất ----------
    kdOf(c) {
      const N = TT.nature; let best = null, bv = -1;
      AXES.forEach(ax => { const v = N.get(c, ax), a = Math.abs(v); if (a > bv + 1e-9) { bv = a; best = { ax, v }; } });
      if (!best || bv <= KC().trungDung + 1e-9) return 'ba_phai';
      const sg = best.v < 0 ? -1 : 1, T = K().kds;
      return Object.keys(T).find(k => T[k].truc === best.ax && T[k].dau === sg) || 'ba_phai';
    },
    kd: c => (c.story && c.story.kd) || '',
    kdName: c => { const k = kb.kd(c); return k && K().kds[k] ? K().kds[k].n : ''; },
    phanOf: (arc, chId) => phanMap(arc)[chId] || null,
    phanText(arc, st) { const p = arc.phan && arc.phan[st.phan]; return p ? 'Phần ' + (st.phan + 1) + '/' + arc.phan.length + ': ' + p.n : ''; },

    // ---------- thử thách (đọc thuần) ----------
    // Tiến độ: { ok, items: [{ k, n, cur, can, ok }] }
    ttCheck(c, tt) {
      const items = [], can = tt.can || {};
      if (can.gold != null) items.push({ k: 'gold', n: 'Vàng', cur: Math.floor(c.gold), can: can.gold });
      if (can.realm != null) items.push({ k: 'realm', n: 'Cảnh giới', cur: c.realm, can: can.realm, txt: D.REALM_NAMES[Math.min(c.realm, D.REALM_NAMES.length - 1)] + ' / ' + D.REALM_NAMES[can.realm] });
      if (can.nghe) items.push({ k: 'nghe', n: 'Nghề ' + ((D.JOBS[can.nghe.id] || {}).n || can.nghe.id).toLowerCase(), cur: TT.job.level(c, can.nghe.id), can: can.nghe.lv || 1 });
      if (can.cong != null) items.push({ k: 'cong', n: 'Cống hiến tông', cur: c.sect ? Math.floor(c.sect.total) : 0, can: can.cong });
      if (can.xp != null) items.push({ k: 'xp', n: 'Tu vi cảnh giới này', cur: Math.round(c.xp / D.NEED[Math.min(5, c.realm)] * 100) / 100, can: can.xp });
      items.forEach(x => { x.ok = x.cur >= x.can; });
      return { ok: items.length > 0 && items.every(x => x.ok), items };
    },
    ttInfo(c, st) {
      const tt = st.tt, r = kb.ttCheck(c, tt);
      return { lc: tt.lc, ten: tt.ten || '', left: Math.max(0, tt.m1 - TT.world.months), han: tt.m1 - tt.m0, items: r.items };
    },
    ttSig: (c, st) => kb.ttCheck(c, st.tt).items.map(x => x.cur).join(',') + '/' + Math.max(0, st.tt.m1 - TT.world.months),

    // Giữ chặng chờ tới tháng nào (0: không giữ): luật ba lần, khoảng cách giữa hai cao trào, tuổi mở phần. Đọc thuần.
    hold(c, arc, st, ch) {
      const now = TT.world.months, S = c.story, pm = arc.phan ? phanMap(arc)[st.st] : null;
      let h = 0;
      if (ch.can_gan_bo && !TT.dan.ok(c, ch.can_gan_bo)) h = now + 1;
      if (pm && pm.nhip === 'cao_trao' && S.ct_at != null) {
        if (now - S.ct_at < KC().giaCT) h = Math.max(h, S.ct_at + KC().giaCT);
        if (Math.floor(now / 12) === Math.floor(S.ct_at / 12)) h = Math.max(h, (Math.floor(now / 12) + 1) * 12);
      }
      if (pm && pm.nhip === 'moc' && TT.age(c) < (arc.phan[pm.i].tuoi || 0)) h = Math.max(h, now + 1);
      return h;
    },

    // ---------- ghi ----------
    // Mở tuyến: điền khe kịch bản (thế lực mạnh kề bên, vật).
    open(c, arc, st) {
      st.khe = {}; st.khe_id = {};
      Object.keys(arc.khe_kb || {}).forEach(slot => {
        const spec = arc.khe_kb[slot];
        if (spec.the_luc) { const f = theLuc(c); if (f) { st.khe[slot] = f.n; st.khe_id[slot] = f.id; } }
        else if (spec.vat) {
          const id = spec.vat[Math.floor(TT.dan.hash('vat:' + c.id + ':' + c.birthMonth + ':' + slot) * spec.vat.length) % spec.vat.length];
          if (D.STORY.vat[id]) { st.khe[slot] = lower(D.STORY.vat[id].n); st.khe_id[slot] = id; }
        }
      });
    },
    // Vào chặng: ghi phần và nhịp hiện tại.
    enter(c, arc, st, chId) {
      const pm = arc.phan && phanMap(arc)[chId]; if (!pm) return;
      st.phan = pm.i; st.nhip = pm.nhip;
      const S = c.story; if (pm.i > (S.phanMax || 0)) S.phanMax = pm.i;
    },
    // Đã áp một lựa chọn của chặng: cao trào thì ghi mốc để giữ khoảng cách.
    applied(c, arc, st, chId, missed) {
      const pm = arc.phan && phanMap(arc)[chId];
      if (pm && pm.nhip === 'cao_trao') c.story.ct_at = TT.world.months;
    },
    // Story Director: người chơi thụ động mà đã quá tuổi mở phần kế quá treTuoi năm thì phần kế tự mở. Trả true nếu đã nhảy.
    director(c, arc, st) {
      if (st.tt) return false;
      const pm = phanMap(arc)[st.st]; if (!pm) return false;
      const nx = arc.phan[pm.i + 1];
      if (nx && nx.tuoi != null && TT.age(c) >= nx.tuoi + KC().treTuoi) {
        TT.log(c, '[' + arc.n + '] Năm tháng trôi qua mà bạn vẫn chưa kịp làm xong chuyện cũ; chuyện mới đã đến.', 'age');
        TT.story.note(c, st, 'Phần mới mở (chuyện cũ bỏ dở)');
        TT.story.go(c, arc, nx.moc);
        return true;
      }
      return false;
    },
    // Bắt đầu thử thách: lựa chọn không dẫn tới chặng ngay; chặng kế (dat hoặc truot) tới khi đạt hoặc hết hạn.
    ttStart(c, arc, st, ch, lc) {
      const T = lc.thu_thach, now = TT.world.months;
      st.w = null;
      st.tt = { lc: lc.key, ten: TT.story.fmt(c, st, lc.label), ch: st.st, can: JSON.parse(JSON.stringify(T.can)), m0: now, m1: now + T.han, dat: T.dat, truot: T.truot, tieu: !!T.tieu };
      TT.log(c, '[' + arc.n + '] Thử thách bắt đầu: ' + TT.story.fmt(c, st, lc.label) + ' (hạn ' + T.han + ' tháng, xem tab Nhiệm vụ).', 'big');
      TT.story.note(c, st, 'Thử thách: ' + TT.story.fmt(c, st, lc.label));
    },
    ttTick(c) {
      const S = c.story, now = TT.world.months;
      Object.keys(S.arcs).forEach(id => {
        const st = S.arcs[id], arc = TT.story.arcOf(id); if (!st.tt || !arc) return;
        const tt = st.tt, r = kb.ttCheck(c, tt);
        if (r.ok) {
          if (tt.tieu && tt.can.gold) c.gold = Math.max(0, c.gold - tt.can.gold);
          delete st.tt;
          TT.log(c, '[' + arc.n + '] Bạn đã vượt qua thử thách đúng hạn.', 'good');
          TT.story.note(c, st, 'Thử thách: đạt');
          TT.story.go(c, arc, tt.dat);
        } else if (now >= tt.m1) {
          delete st.tt;
          TT.log(c, '[' + arc.n + '] Hết hạn mà bạn chưa đạt thử thách. Chuyện không còn đường quay lại.', 'bad');
          TT.story.note(c, st, 'Thử thách: trượt');
          TT.story.go(c, arc, tt.truot);
        }
      });
    },
    // Lời dẫn sau lựa chọn của cảnh lớn: hộp nối tiếp câu chuyện, thay đổi số hiện nhỏ ở dưới.
    // Thủ công: chờ bấm "Tiếp"; Cân bằng và Tự động: tự đóng sau 40 giây (giữ hộp, có nút đóng). Thời gian game dừng trong lúc hộp mở.
    sau(c, arc, st, ch, lc, rec) {
      if (!ch.lon) return;
      const m = (lc.sau_neu || []).find(x => c.flags[x.flag]), text = m ? m.sau : lc.sau;
      if (!text) return;
      const manual = TT.decisions.mode() === 'thu_cong';
      TT.decisions.request({
        type: 'story_sau', charId: c.id, tier: manual ? 3 : 2, giu: true, timeout: KC().sauDong, arc: arc.id, lon: true,
        title: TT.story.fmt(c, st, ch.t), text: TT.story.fmt(c, st, text), ghi: rec || [], canh: ch.canh ? { gio: ch.canh.gio || '', thoi_tiet: ch.canh.thoi_tiet || '' } : null,
        choices: [{ key: 'tiep', label: manual ? 'Tiếp' : 'Đóng' }], def: 0
      });
    },

    // ---------- luật gọi tên (Q 1c luật 8) ----------
    goiTick(c) {
      const S = c.story, w = TT.world, G = K().goiten;
      if (w.pending || S.box === w.months || w.months - S.box < K().gap || TT.story.quiet()) return;
      for (const kh of Object.keys(G)) {
        if (!c.flags[kh] || c.flags['goi_' + kh]) continue;
        const g = G[kh], t = g.trig || {};
        const hit = (t.gold != null && c.gold >= t.gold) || (t.chinh != null && ((c.rep && c.rep.chinh) || 0) <= t.chinh) || (t.flag && c.flags[t.flag]);
        if (!hit) continue;
        let vai = g.vai.find(v => TT.dan.alive(c, v) && TT.dan.gan(c, v) >= 1) || g.vai.find(v => TT.dan.alive(c, v));
        if (!vai) continue;
        c.flags['goi_' + kh] = w.months; S.box = w.months;
        const o = TT.dan.get(c, vai);
        TT.decisions.request({
          type: 'story', goi: kh, goiVai: vai, charId: c.id, tier: 2, timeout: K().timeout, arc: '', ch: '', title: 'Lời nói thẳng',
          text: g.d.replace(/\{vai\}/g, o.name),
          choices: [{ key: 'nhan', label: 'Nhận lấy lời ấy', kind: 'safe', mat: g.mat }, { key: 'cai', label: 'Cãi lại', kind: 'risk', mat: 'Một người nguội lạnh thêm.' }], def: 0
        });
        return;
      }
    },
    goiChoose(c, d, key) {
      const g = K().goiten[d.goi], o = TT.dan.get(c, d.goiVai); if (!g) return;
      const k = key === 'cai' ? 1.5 : 1;
      if (o) TT.rel.add(c, o, Math.round(g.rel * k), 'bị gọi tên');
      TT.rep.add(c, 'danh', g.danh);
      if (key === 'nhan') c.daoTam = Math.max(0, c.daoTam - 1);
      TT.log(c, (o ? o.name : 'Một người') + ' đã nói thẳng điều bạn từng khinh mà nay chính bạn làm.', 'bad');
      TT.nature.shiftKind(c, key === 'nhan' ? 'safe' : 'risk', 'bị gọi tên', false);
    },

    // ---------- mỗi tháng ----------
    tick(c) {
      const S = c.story; if (!S) return;
      TT.dan.tick(c);
      // khuyết điểm gốc: suy ra ở A1; đổi được nếu trục khác vượt lên rõ ràng, trước khi vào phần thứ ba
      if (S.arcs.bb_a1 || S.kd) {
        if (!S.kd) S.kd = kb.kdOf(c);
        else if (!S.kd_khoa) {
          if ((S.phanMax || 0) >= KC().khoaKd) S.kd_khoa = 1;
          else if (TT.world.months % 12 === 0) {
            const n = kb.kdOf(c);
            if (n !== S.kd) {
              const N = TT.nature, T = K().kds, cur = T[S.kd].truc ? Math.abs(N.get(c, T[S.kd].truc)) : KC().trungDung, nw = T[n].truc ? Math.abs(N.get(c, T[n].truc)) : 0;
              if (nw >= cur + KC().doiKd) S.kd = n;
            }
          }
        }
      }
      kb.ttTick(c);
      kb.goiTick(c);
    }
  };
})();
