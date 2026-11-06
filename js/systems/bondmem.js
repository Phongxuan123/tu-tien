// Kết nghĩa qua trải nghiệm chung (Z "9K", R 4.2): ký ức chung của cặp thân (d.mem), đồng hành (ally), huynh đệ sau kết nghĩa.
// Mở rộng TT.bond (nạp sau bond.js). Chỉ cặp CÓ NGƯỜI CHƠI. Công tắc D.BOND.mem: tắt thì mọi hàm ghi trả null/false trước khi gọi rng;
// hàm đọc (mems, hardships, recall, canSwear, brothers, memOn) không gọi rng và không ghi dữ liệu.
// Ký ức: d.mem = [{ m (tháng), a (tuổi người chơi), k (loại), t (chữ, có tên nơi), w (nặng), h (1: hoạn nạn) }], tối đa D.BOND.kn.cap.
// Đồng hành trong thám hiểm: c.dungeon.ally = { id, asked }. Lệnh ưu tiên thấp: c.intents = [{ loai: 'ru', dich, tu, han }].
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data, rng = TT.rng, rel = TT.rel, bond = TT.bond;
  const K = () => D.BOND, M = () => D.BOND.kn;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const ch = x => (x && typeof x === 'object' ? x : TT.world.chars[x]);
  const plOf = (a, b) => { a = ch(a); b = ch(b); return a && b ? (a.kind === 'player' ? a : b.kind === 'player' ? b : null) : null; };
  const on = () => !!(K() && K().on && K().mem);
  const near = (c, o) => !!(o.alive && !o.travel && !o.cross && !c.travel && !c.cross && o.region === c.region && o.place === c.place);
  const placeOf = c => { if (c.dungeon) return c.dungeon.name; const p = c.place && TT.map.place(c.place); return p ? p.n : 'giữa đường'; };
  const wealthOf = c => TT.ls.wealth(c);
  const say = (pl, text, cls) => TT.log(pl, text, cls || '');

  Object.assign(bond, {
    // ---------- đọc thuần ----------
    memOn: on,
    mems(a, b) { const d = bond.get(a, b); return d && d.mem ? d.mem : []; },
    hardships(a, b) { return bond.mems(a, b).filter(x => x.h).length; },
    // 1 đến n ký ức để nhắc lại: hoạn nạn gần nhất trước, rồi ký ức nặng nhất còn lại. Trả chuỗi «…», «…».
    recall(a, b, n) {
      const ms = bond.mems(a, b).slice(); if (!ms.length) return '';
      const hn = ms.filter(x => x.h).sort((x, y) => y.m - x.m), rest = ms.filter(x => !x.h).sort((x, y) => y.w - x.w || y.m - x.m);
      return hn.concat(rest).slice(0, n || 2).map(x => '«' + x.t + '»').join(' và ');
    },
    // Đủ ký ức để kết nghĩa: ≥ swear.n ký ức chung, ≥ swear.hn hoạn nạn, thiện cảm đủ; chưa có loại, chưa từ chối.
    canSwear(a, b) {
      if (!on()) return false;
      const r = rel.get(a, b), d = r && r.d, S = M().swear;
      if (!d || !d.mem || r.k || r.nk || r.nl || d.t !== 'ban') return false;
      return d.mem.length >= S.n && d.mem.filter(x => x.h).length >= S.hn && r.v >= S.v;
    },
    // Huynh đệ kết nghĩa còn sống của c (tùy chọn: cùng vùng, không phải người bị loại).
    brothers(c, opts) {
      opts = opts || {};
      return rel.list(c).filter(x => x.c && x.c.alive && x.c.kind === 'npc' && x.r.d && x.r.d.t === 'ket_nghia' && x.c !== opts.not && (!opts.region || (x.c.region === c.region && !x.c.travel && !x.c.cross))).map(x => x.c);
    },

    // ---------- ký ức ----------
    // Ghi một ký ức chung của c (người chơi) với o. nang: hệ số nặng (mặc định 1) nhân phần cộng Tin/Kính. Trả mục ký ức hoặc null.
    remember(c, o, loai, chu, nang) {
      if (!on()) return null;
      c = ch(c); o = ch(o);
      const pl = plOf(c, o); if (!pl || !o) return null;
      const other = pl === c ? o : c, T = M().types[loai];
      if (!T || other.kind !== 'npc' || (!other.alive && loai !== 'mat')) return null;
      const r = rel.get(pl, other); if (!r || r.v < M().minV) return null;
      if (!r.d && !r.k && rel.list(pl).filter(x => x.r.d).length >= K().maxClose) return null;
      const d = bond.ensure(pl, other); if (!d) return null;
      const now = TT.world.months; d.mem = d.mem || [];
      if (T.gap && d.mem.some(x => x.k === loai && now - x.m < T.gap)) return null;
      const w = nang == null ? 1 : nang, pn = placeOf(pl);
      const e = { m: now, a: TT.age(pl), k: loai, t: chu.indexOf(pn) >= 0 ? chu : chu + ' ở ' + pn, w, h: T.hn ? 1 : 0 };
      d.mem.push(e); d.seen = now;
      while (d.mem.length > M().cap) {
        let i = d.mem.findIndex(x => !x.h);              // bỏ ký ức thường cũ nhất; chỉ khi toàn hoạn nạn mới bỏ hoạn nạn cũ nhất
        if (i < 0) i = 0;
        d.mem.splice(i, 1);
      }
      if (T.trust || T.respect) bond.shift(pl, other, { trust: T.trust * w, respect: T.respect * w });
      return e;
    },
    // Ghi ký ức với tối đa n người ở cùng nơi mà c quen (thiện cảm ≥ minV), ví dụ nghe giảng, luận đạo, đấu giá.
    shared(c, loai, chu, n) {
      if (!on() || c.kind !== 'player') return 0;
      const folks = TT.social.here(c).filter(o => o.kind === 'npc' && o.tier === 'core' && rel.v(c, o) >= M().minV);
      let k = 0;
      rng.shuffle(folks).slice(0, n || 2).forEach(o => { if (bond.remember(c, o, loai, chu.replace('{ten}', o.name))) k++; });
      return k;
    },

    // ---------- lệnh ưu tiên thấp: "Rủ đi cùng" ----------
    invite(c, o) {
      if (!on() || c.kind !== 'player' || !o || !o.alive || o.kind !== 'npc') return { ok: false, why: 'Không rủ được.' };
      const A = M().ally, now = TT.world.months;
      if (rel.v(c, o) < A.minV) return { ok: false, why: 'Chưa đủ thân để rủ đi cùng.' };
      c.intents = (c.intents || []).filter(x => x.han > now);
      const have = c.intents.find(x => x.loai === 'ru' && x.dich === o.id);
      if (have) { have.han = now + A.askHan; return { ok: true, same: true }; }
      if (c.intents.length >= 2) return { ok: false, why: 'Bạn đang có hai lời hẹn chưa xong.' };
      c.intents.push({ loai: 'ru', dich: o.id, tu: now, han: now + A.askHan });
      say(c, 'Bạn hẹn rủ ' + o.name + ' đi cùng chuyến sau' + (near(c, o) ? '.' : ', và sẽ tìm tới ' + o.name + ' khi rảnh.'), 'age');
      return { ok: true };
    },
    asked(c, o) { return !!(c.intents || []).find(x => x.loai === 'ru' && x.dich === o.id && x.han > TT.world.months); },

    // ---------- đồng hành ----------
    // Chọn bạn đi cùng (người chơi, ở cùng nơi, thiện cảm ≥ minV). Trả { c, asked } hoặc null. Có rng (xác suất đi cùng).
    ally(c, opts) {
      if (!on() || c.kind !== 'player') return null;
      const A = M().ally, now = TT.world.months;
      const cand = TT.social.here(c).filter(o => o.kind === 'npc' && o.tier === 'core' && o.realm >= 1 && o.hp > 0 && rel.v(c, o) >= A.minV && !(opts && opts.not === o));
      if (!cand.length) return null;
      cand.sort((x, y) => bond.than(c, y) - bond.than(c, x) || x.id - y.id);
      const ask = cand.find(o => bond.asked(c, o));
      if (ask) {
        c.intents = c.intents.filter(x => !(x.loai === 'ru' && x.dich === ask.id));
        if (rng.P(A.pAsk)) return { c: ask, asked: 1 };
        say(c, ask.name + ' đang bận việc riêng nên không đi cùng được.', 'age');
        return null;
      }
      const top = cand[0], dd = rel.get(c, top).d, p = dd && dd.t === 'ket_nghia' ? A.pBro : A.p * clamp(bond.than(c, top) / 60, 0.5, 1.3);
      return rng.P(p) ? { c: top, asked: 0 } : null;
    },
    // Xác suất giúp thắng của một người đồng hành (đọc thuần): bonus[0] đến bonus[1] theo độ thân.
    allyBonus(c, a) { const B = M().ally.bonus; return B[0] + (B[1] - B[0]) * clamp(bond.than(c, a) / 100, 0, 1); },
    dgAlly(c) { const a = c.dungeon && c.dungeon.ally && TT.world.chars[c.dungeon.ally.id]; return a && a.alive ? a : null; },
    // Vào bí cảnh: chọn bạn đi cùng (nếu có).
    pickAlly(c) {
      if (!c.dungeon) return null;
      const r = bond.ally(c); if (!r) return null;
      c.dungeon.ally = { id: r.c.id, asked: r.asked, hurt: 0, saved: 0 };
      say(c, r.c.name + (r.asked ? ' nhận lời bạn rủ' : ' không yên tâm để bạn đi một mình') + ' và cùng bạn vào ' + c.dungeon.name + '.', 'good');
      return r.c;
    },
    // Sau một trận: bạn đồng hành giúp (đổi thua thành thắng theo xác suất), đỡ đòn chết thay, hoặc bị thương. Trả res (đã sửa).
    // a: bạn đồng hành; foe: tên đối thủ. Với bí cảnh a lấy từ c.dungeon.ally; trận lẻ (kẻ thù tìm đến) truyền a.
    assist(c, res, a, foe, extra) {
      if (!on() || c.kind !== 'player' || res.fled) return res;
      a = a || bond.dgAlly(c); if (!a || !a.alive) return res;
      const A = M().ally, dg = c.dungeon && c.dungeon.ally, bonus = (extra != null ? extra : 0) + bond.allyBonus(c, a);
      if (!res.win) {
        if (rng.P(bonus)) {
          res.win = true; res.winner = c; res.assisted = 1; if (c.hp < 1) c.hp = 1;
          say(c, a.name + ' lao vào đỡ cho bạn, xoay chuyển cuộc giao chiến' + (foe ? ' với ' + foe : '') + '.', 'good');
          bond.remember(c, a, 'danh', 'Sát cánh đỡ đòn' + (foe ? ' trước ' + foe : ''), 1.5);
          if (dg) dg.hurt++;
          return res;
        }
        if (c.hp <= 0 && rng.P(A.die)) {
          c.hp = 1; res.saved = 1;
          bond.remember(c, a, 'cuu', 'Bị ' + a.name + ' che chắn, đổi mạng', 3);
          if (dg) dg.saved = 1;
          TT.life.die(a, 'chết thay ' + c.name + (foe ? ' trước ' + foe : ''));
          say(c, a.name + ' đẩy bạn ra, nhận trọn đòn chí mạng. Bạn sống sót, còn ' + a.name + ' thì không.', 'bad');
          return res;
        }
        return res;
      }
      if (rng.P(A.hurt)) { a.hp = Math.max(1, a.hp - TT.stats.hpMax(a) * A.hurtHp); if (dg) dg.hurt++; say(c, a.name + ' bị thương khi hộ vệ bên bạn.', 'age'); }
      return res;
    },
    // Hết thám hiểm: chia chiến lợi phẩm cho bạn đồng hành, ghi ký ức. Trả chữ ghi chú hoặc ''.
    endAlly(c, dg, how) {
      if (!on() || !dg || !dg.ally) return '';
      const a = TT.world.chars[dg.ally.id]; if (!a) return '';
      let note = '';
      if (a.alive) {
        const sh = M().ally.share, l = dg.loot, g = Math.round(l.gold * sh), x = l.xp * sh;
        l.gold -= g; l.xp -= x; a.gold = (a.gold || 0) + g; if (x) TT.ev.xp(a, x);
        note = 'chia ' + Math.round(sh * 100) + '% cho ' + a.name;
        const hard = how === 'bai' || how === 'chay' || dg.ally.hurt > 0;
        const e = bond.remember(c, a, 'bi_canh', (hard ? 'Cùng thoát hiểm khỏi ' : 'Cùng vượt ') + dg.name, hard ? 1.5 : 1);
        if (hard && e) e.h = 1;
      }
      return note;
    },
    // Trận đơn lẻ với kẻ thù tìm đến: huynh đệ tự đến giúp (bro.help), không thì bạn thân cùng nơi. Trả { a, bro } hoặc null.
    duelHelper(c, foe) {
      if (!on() || c.kind !== 'player') return null;
      const B = M().bro, bros = bond.brothers(c, { region: 1, not: foe });
      if (bros.length && rng.P(B.help)) { const a = bros.sort((x, y) => rel.v(c, y) - rel.v(c, x) || x.id - y.id)[0]; say(c, 'Nghe tin bạn gặp nạn, huynh đệ ' + a.name + ' tự chạy tới.', 'good'); return { a, bro: 1 }; }
      const r = bond.ally(c, { not: foe });
      return r ? { a: r.c, bro: 0 } : null;
    },

    // ---------- huynh đệ: khi chết, nặng lòng ----------
    // Huynh đệ mất: thêm ký ức cuối và dòng nhật ký nhắc lại. Gọi từ life.dieNow.
    farewell(pl, c, cause) {
      if (!on()) return false;
      const d = bond.get(pl, c); if (!d || d.t !== 'ket_nghia' || d.farewell) return false;
      d.farewell = 1;
      const rc = bond.recall(pl, c, 2);
      bond.remember(pl, c, 'mat', 'Ngày ' + c.name + ' ra đi (' + cause + ')', 1);
      say(pl, 'Huynh đệ ' + c.name + ' đã khuất' + (rc ? '. Bạn nhớ lại ' + rc + '.' : '.') + ' Lời thề năm xưa chỉ còn bạn giữ.', 'bad');
      return true;
    },

    // ---------- mỗi tháng ----------
    memTick(c) {
      if (!on() || c.kind !== 'player') return;
      const w = TT.world, now = w.months, S = M().swear, free = !w.pending && !c.travel && !c.cross && !c.dungeon;
      // lời hẹn: hết hạn thì bỏ; chưa cùng nơi thì lúc rảnh đi tìm
      if (c.intents && c.intents.length) {
        c.intents = c.intents.filter(x => {
          const o = w.chars[x.dich];
          if (!o || !o.alive) return false;
          if (now > x.han) { say(c, 'Chưa tìm được dịp rủ ' + o.name + ' đi cùng.', 'age'); return false; }
          if (free && !near(c, o) && o.region === c.region && o.place && !o.travel && !o.cross && !c.plan && !c.dest && rng.P(0.5)) TT.map.startTravel(c, o.place);
          return true;
        });
      }
      rel.list(c).forEach(x => {
        const o = x.c, d = x.r.d; if (!o || !d) return;
        // hậu quả trễ của việc bỏ rơi huynh đệ gặp nạn
        if (d.late && now >= d.late.m) {
          const L = d.late; d.late = null;
          if (!o.alive) { c.daoTam = clamp(c.daoTam - 4, 0, 100); say(c, 'Lá thư cầu cứu của ' + o.name + ' vẫn nằm đáy hòm. Bạn không tha thứ được cho mình. Đạo tâm -4.', 'bad'); }
          else { bond.shift(c, o, { trust: -15, respect: -15 }); bond.setType(c, o, 'ban'); say(c, o.name + ' hay chuyện bạn không đến, chỉ nói một câu: "Tình huynh đệ có lẽ chỉ đến thế." Chén rượu thề năm xưa đã nguội.', 'bad'); }
          void L;
        }
        if (!o.alive || !d.mem) return;
        const nr = near(c, o);
        // tái ngộ sau ≥ taiNgo.years năm không gặp
        if (nr && d.seen != null && now - d.seen >= M().taiNgo.years * 12 && d.mem.length >= 2 && d.trust >= M().taiNgo.v) {
          if (free && !(c.evCool && c.evCool.bond_tai_ngo > now)) { const yrs = Math.floor((now - d.seen) / 12); d.seen = now; TT.events.fire(c, D.eventById.bond_tai_ngo, { otherId: o.id, yrs }); return; }
          return;
        }
        if (nr) d.seen = now;
        // đủ ký ức chung thì kết nghĩa tự nảy ra (không chỉ qua giao du)
        if (free && bond.canSwear(c, o) && (d.swM || 0) <= now && rng.P(S.p)) { d.swM = now + S.cool; TT.events.fire(c, D.eventById.rel_ket_nghia, { otherId: o.id }); }
      });
    },

    // ---------- mỗi năm ----------
    memYearly(c) {
      if (!on() || c.kind !== 'player') return;
      const w = TT.world, now = w.months, B = M().bro, free = () => !w.pending && !c.dungeon && !c.travel && !c.cross;
      // sự kiện thế giới ở vùng (hạn, lũ, dịch, mặt trận): cùng chống chọi với người thân thiết ở gần
      const shock = TT.pop.shocksAt(c.region)[0], front = TT.fac.atFront(c.region);
      if (shock || front) {
        const word = front ? 'chiến loạn' : ({ han: 'hạn hán', lu: 'lũ lụt', dich: 'dịch bệnh' })[shock.kind];
        const pals = rel.list(c).filter(x => x.c && x.c.alive && x.c.kind === 'npc' && x.r.d && x.r.v >= 40 && near(c, x.c)).sort((a, b) => b.r.v - a.r.v || a.id - b.id).slice(0, 2);
        pals.forEach(x => { if (rng.P(B.world)) bond.remember(c, x.c, 'the_gioi', 'Cùng nhau chống chọi ' + word, 1.2); });
      }
      bond.brothers(c).forEach(o => {
        const r = rel.get(c, o), d = r.d, nr = near(c, o), rc = o.region === c.region;
        // tặng đồ khi thiếu
        if (rc && wealthOf(c) < 15 * (1 + c.realm) && wealthOf(o) > wealthOf(c) * 3 && now - (d.giftM || -999) >= B.giftGap && rng.P(B.gift)) {
          d.giftM = now;
          if (c.hp < TT.stats.hpMax(c) * 0.4) { TT.items.add(c, 'hoi_xuan_dan'); say(c, 'Huynh đệ ' + o.name + ' gửi tới một viên Hồi Xuân Đan: "Thấy sắc mặt đệ chẳng ổn."', 'good'); }
          else { const g = 25 * (1 + c.realm); TT.ev.gold(c, g); TT.ev.gold(o, -g); say(c, 'Huynh đệ ' + o.name + ' nghe bạn túng thiếu, âm thầm gửi ' + g + ' vàng: "Sau này khá giả thì trả, không thì thôi."', 'good'); }
          bond.shift(c, o, { trust: 3, debt: -8 }); bond.remember(c, o, 'nho', 'Được huynh đệ ' + o.name + ' đỡ lúc túng thiếu', 1);
        }
        // liên lụy thù: kẻ thù của bạn trút giận lên huynh đệ
        const foes = rel.list(c).filter(x => x.c && x.c.alive && x.r.k === 'thu' && x.c !== o && x.c.region === o.region);
        if (foes.length && rng.P(B.luy)) {
          const f = foes[0].c;
          bond.shift(c, o, { debt: -10 });
          if (o.realm < f.realm && rng.P(B.luyDie)) { say(c, 'Huynh đệ ' + o.name + ' bị ' + f.name + ' ra tay vì dính dáng đến bạn, không qua khỏi.', 'bad'); bond.remember(c, o, 'luy', 'Huynh đệ gánh thay mối thù với ' + f.name, 2); TT.life.die(o, 'bị ' + f.name + ' trả thù liên lụy vì tình huynh đệ với ' + c.name); }
          else { o.hp = Math.max(1, o.hp * 0.5); say(c, 'Kẻ thù ' + f.name + ' trút giận lên huynh đệ ' + o.name + ' của bạn. Hắn bị thương nhưng không một lời trách móc.', 'bad'); bond.remember(c, o, 'luy', 'Huynh đệ gánh thay mối thù với ' + f.name, 1.5); }
          return;
        }
        if (!free() || (d.late)) return;
        if (rng.P(B.nan)) { TT.events.fire(c, D.eventById.bond_nan, { otherId: o.id, v: rng.pick(['benh', 'vay', 'no']) }); return; }
        if (nr && now - (d.loiM || -999) >= B.loiGap && rng.P(B.loi)) { d.loiM = now; TT.events.fire(c, D.eventById.bond_loi_nghia, { otherId: o.id }); }
      });
    }
  });
})();
