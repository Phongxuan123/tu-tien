// Dàn định mệnh (K1, Q "giọng truyện" mục 2, 3, 6c): 6 vai cố định (than_nhan, ban, su, doi_thu, huynh, thuong) và 2 vai mở (ke_thu, ke_thua)
// của người chơi, điểm gắn bó, luật ba lần, khoảnh khắc ấm và thư, vật kỷ niệm, các hậu quả thật lên người trong dàn (chết, bỏ đi, thành kẻ thù, nợ).
// Dữ liệu thuần trong c.story (khởi tạo muộn): dan { vai: idNPC }, sp { vai: 'chet'|'roi'|'thu' } (số phận: vai đã có số phận thì không bốc lại),
// gb { vai: điểm }, amY { vai: { am: năm, thu: năm } } (năm của khoảnh khắc ấm/thư gần nhất), no [ { vai, d } ] (sổ nợ).
// Công tắc D.STORY.kbOn. Hàm ĐỌC (get, id, alive, gan, ok, people, rows, nhap) không gọi rng và không ghi dữ liệu.
// Hàm ghi dựng người mới dùng TT.rng (spawn NPC), khoảnh khắc ấm chọn bằng băm cố định, không rút rng.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data;
  const K = () => D.STORY, KC = () => D.STORY.kbc;
  const on = c => !!(c && c.kind === 'player' && K() && K().on && K().kbOn);
  const EMPTY = { dan: {}, sp: {}, gb: {}, amY: {}, no: [] };
  const S = c => c.story || EMPTY;
  const hash = str => { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return (h >>> 0) / 4294967296; };
  const yearOf = () => Math.floor(TT.world.months / 12);

  // Đăng ký vật kỷ niệm vào D.ITEMS: vật phẩm thật, không bán, không hiến (cat 'ky_niem').
  Object.keys(K().vat || {}).forEach(id => { if (!D.ITEMS[id]) D.ITEMS[id] = { n: K().vat[id].n, cat: 'ky_niem', ky: true, value: 0, valueFn: () => 0, desc: K().vat[id].desc }; });

  function ensure(c) {
    if (!on(c)) return null;
    const s = TT.story.ensure(c); if (!s) return null;
    if (!s.dan) { s.dan = {}; s.sp = {}; s.gb = {}; s.amY = {}; s.no = []; }
    return s;
  }
  const name = (c, vai) => { const o = dan.get(c, vai); return o ? o.name : 'người ấy'; };

  // Người đã trùng hồi ức "bạn thuở nhỏ" (9K ký ức loại ban_nho), rồi người quen thân từ nhỏ.
  function banNho(c, taken) {
    let best = null;
    TT.rel.list(c).forEach(x => {
      const o = x.c; if (!o || !o.alive || o.kind !== 'npc' || taken.indexOf(o.id) >= 0 || (c.parents || []).indexOf(o.id) >= 0) return;
      const ok = TT.bond.mems(c, o).some(m => m.k === 'ban_nho') || x.r.v >= 20;
      if (ok && (!best || x.r.v > best.v || (x.r.v === best.v && o.id < best.o.id))) best = { o, v: x.r.v };
    });
    return best && best.o;
  }

  // Tìm (hoặc dựng) người ở vai. Trả NPC hoặc null. dung_moi chỉ cho vai cố định cần người nền.
  function find(c, vai, taken) {
    const sty = TT.story;
    if (vai === 'than_nhan') {
      const ps = TT.origin.parents(c).filter(x => x.c && x.alive && taken.indexOf(x.c.id) < 0);
      if (ps.length) return ps[0].c;
      const n = TT.life.spawnNpc(TT.rng.RI(38, 54), c.region); // cô nhi hoặc cha mẹ đã mất: có người nuôi, người thân còn lại
      if (n) { n.place = c.place; n.dest = null; n.travel = null; }
      return n;
    }
    if (vai === 'ban') {
      const b = banNho(c, taken); if (b) return b;
      return sty.pickNpc(c, { pick: 'dong_ky', dung_moi: true }, taken, null);
    }
    if (vai === 'su') return sty.pickNpc(c, { pick: 'su', dung_moi: true }, taken, null);
    if (vai === 'doi_thu') return sty.pickNpc(c, { pick: 'dong_ky', dung_moi: true }, taken, null);
    if (vai === 'huynh') return sty.pickNpc(c, { pick: 'ky_uc', dung_moi: true }, taken, null);
    if (vai === 'thuong') return TT.bond.main(c);
    if (vai === 'ke_thu') {
      let best = null;
      TT.rel.list(c).forEach(x => { if (x.r.k === 'thu' && x.c && x.c.alive && x.c.kind === 'npc' && taken.indexOf(x.c.id) < 0 && (!best || x.r.v < best.r.v)) best = x; });
      if (!best && c.story && c.story.kbc && c.story.kbc.dung_ke_thu) { // AI1a: kịch bản cụ thể cần kẻ bóng tối ra mắt từ phần 1: dựng người cùng nơi, cùng lứa
        const n = TT.life.spawnNpc(Math.max(13, TT.age(c) + TT.rng.RI(-2, 3)), c.region);
        if (n) { n.place = c.place; n.dest = null; n.travel = null; }
        return n;
      }
      return best && best.c;
    }
    if (vai === 'ke_thua') return TT.family.disciples(c).filter(o => taken.indexOf(o.id) < 0)[0] || null;
    return null;
  }

  const dan = TT.dan = {
    on, ensure, yearOf, hash,

    // ---------- đọc thuần ----------
    id: (c, vai) => S(c).dan[vai] || 0,
    get: (c, vai) => { const id = S(c).dan[vai]; return id ? TT.world.chars[id] || null : null; },
    alive: (c, vai) => { const o = dan.get(c, vai); return !!(o && o.alive); },
    sp: (c, vai) => S(c).sp[vai] || '',
    gan: (c, vai) => S(c).gb[vai] || 0,
    name,
    // Điều kiện luật ba lần: spec là { dan, min? } | [spec, ...] (tất cả) | { hoac: [spec, ...] } (một trong).
    ok(c, spec) {
      if (!spec) return true;
      if (Array.isArray(spec)) return spec.every(x => dan.ok(c, x));
      if (spec.hoac) return spec.hoac.some(x => dan.ok(c, x));
      return dan.gan(c, spec.dan) >= (spec.min != null ? spec.min : KC().gb);
    },
    // Người trong dàn đang ở cùng vùng, để hiện trên cảnh: [NPC].
    people(c) {
      const out = [];
      Object.keys(S(c).dan).forEach(v => { const o = dan.get(c, v); if (o && o.alive && !o.left && out.indexOf(o) < 0) out.push(o); });
      return out;
    },
    // Dòng cho tab Nhiệm vụ: [{ vai, ten, n (tên vai), gb, sp, alive }].
    rows(c) {
      const s = S(c);
      return K().dan.vai.filter(v => s.dan[v] || s.sp[v]).map(v => { const o = dan.get(c, v); return { vai: v, n: K().dan.ten[v], ten: o ? o.name : '?', gb: s.gb[v] || 0, sp: s.sp[v] || '', alive: !!(o && o.alive && !o.left) }; });
    },
    nhap: (c) => S(c).no.slice(),

    // ---------- ghi ----------
    // Dựng người ở vai (một lần: vai có số phận hoặc đã có người thì trả người hiện có). Trả NPC hoặc null.
    dung(c, vai) {
      const s = ensure(c); if (!s) return null;
      if (s.dan[vai]) return dan.get(c, vai);
      if (s.sp[vai]) return null; // đã chết, bỏ đi: không bốc lại
      const taken = Object.keys(s.dan).map(k => s.dan[k]);
      const o = find(c, vai, taken);
      if (o) s.dan[vai] = o.id;
      return o || null;
    },
    // Cộng gắn bó (d có thể âm). Dựng người nếu chưa có.
    gain(c, vai, d, why) {
      const s = ensure(c); if (!s || !K().dan.vai.includes(vai)) return 0;
      const o = dan.dung(c, vai); if (!o) return 0;
      s.gb[vai] = Math.max(0, Math.min(30, (s.gb[vai] || 0) + d));
      return d;
    },
    chet(c, vai, ngoai) {
      const s = ensure(c); const o = s && dan.dung(c, vai); if (!o) return false;
      s.sp[vai] = 'chet';
      if (o.alive) TT.life.die(o, ngoai ? 'qua đời ở nơi xa, bạn chỉ nghe tin' : 'mất vì biến cố liên quan tới ' + c.name);
      if (ngoai) TT.log(c, 'Tin từ xa tới: ' + o.name + ' đã mất.', 'bad');
      return true;
    },
    roi(c, vai) {
      const s = ensure(c); const o = s && dan.dung(c, vai); if (!o) return false;
      s.sp[vai] = 'roi';
      if (o.alive) { o.alive = false; o.left = true; o.deathMonth = TT.world.months; o.cause = 'bỏ đi'; }
      TT.log(c, o.name + ' bỏ đi, không ai rõ về đâu.', 'bad');
      return true;
    },
    thu(c, vai, why) {
      const s = ensure(c); const o = s && dan.dung(c, vai); if (!o || !o.alive) return false;
      TT.social.makeEnemy(o, c, why || 'oán hận từ chuyện cũ');
      s.sp[vai] = 'thu';
      if (!s.dan.ke_thu && !s.sp.ke_thu) s.dan.ke_thu = o.id; // người ở vai nào thành kẻ thù thật cũng trở thành kẻ thù định mệnh nếu chỗ ấy còn trống
      return true;
    },
    no(c, vai, d) {
      const s = ensure(c); const o = s && dan.dung(c, vai); if (!o) return 0;
      let e = s.no.find(x => x.vai === vai);
      if (!e) { e = { vai, d: 0, m: TT.world.months }; s.no.push(e); }
      e.d = Math.min(KC().noMax, e.d + d);
      c.flags['no_' + vai] = 1;
      return e.d;
    },
    traNo(c, vai) {
      const s = ensure(c); if (!s) return false;
      const i = s.no.findIndex(x => x.vai === vai); if (i < 0) return false;
      s.no.splice(i, 1); delete c.flags['no_' + vai];
      return true;
    },
    vat(c, id, nhan) {
      if (!D.ITEMS[id] || !D.ITEMS[id].ky) return false;
      if (nhan === false) { if (!TT.items.remove(c, id)) return false; TT.log(c, 'Bạn không còn giữ ' + D.ITEMS[id].n + '.', 'age'); return true; }
      TT.items.add(c, id); TT.log(c, 'Bạn giữ ' + D.ITEMS[id].n + ' trong túi.', 'good'); return true;
    },
    // Thay đổi bậc tông (fx.tong): mat_suat, len_noi_mon, giang, truc_xuat, truy. Trả chuỗi ghi cho hộp.
    tong(c, t) {
      const R = TT.sect, out = [];
      if (t.mat_suat) { c.flags.mat_suat = TT.world.months; if (c.sect) c.sect.total = Math.max(0, c.sect.total - 30); out.push('Mất suất nội môn'); TT.log(c, 'Suất lên nội môn của bạn bị người khác lấy mất.', 'bad'); }
      if (t.len_noi_mon && c.sect && c.sect.rank < 1) { c.sect.rank = 1; R.ensure(c); out.push('Lên nội môn'); TT.log(c, 'Bạn được nhận vào nội môn.', 'big'); }
      if (t.giang && c.sect && c.sect.rank > 0) { c.sect.rank--; out.push('Bị giáng chức'); TT.log(c, 'Bạn bị giáng xuống ' + TT.data.SECT_RANKS[c.sect.rank] + '.', 'bad'); }
      if (t.truc_xuat && c.sect) { R.expel(c, 'sự việc trong truyện'); out.push('Bị trục xuất'); }
      if (t.truy) {
        c.flags.bi_truy = TT.world.months;
        const sid = c.sect ? c.sect.id : null, h = sid ? R.head(sid) : null;
        if (h && h.kind === 'npc') TT.social.makeEnemy(h, c, 'bị coi là đào tẩu hoặc kẻ phản'); else TT.log(c, 'Bạn bị truy lùng.', 'bad');
        out.push('Bị truy lùng');
      }
      return out;
    },

    // ---------- mỗi tháng ----------
    // Số phận: vai có người chết hoặc rời đi thì ghi lại (không bốc lại).
    sync(c) {
      const s = ensure(c); if (!s) return;
      Object.keys(s.dan).forEach(v => {
        if (s.sp[v]) return;
        const o = TT.world.chars[s.dan[v]];
        if (!o) s.sp[v] = 'chet'; else if (!o.alive) s.sp[v] = o.left ? 'roi' : 'chet';
      });
    },
    // Dựng dần: tuổi thơ (thân nhân, bạn), A1 hoặc 16 tuổi (thầy, đối thủ, huynh), người thương khi có đạo lữ, vai mở khi có kẻ thù hoặc đồ đệ.
    build(c) {
      const s = ensure(c); if (!s) return;
      const age = TT.age(c);
      if (age >= 6) { dan.dung(c, 'than_nhan'); dan.dung(c, 'ban'); }
      if (s.arcs.bb_a1 || age >= 16) { dan.dung(c, 'su'); dan.dung(c, 'doi_thu'); dan.dung(c, 'huynh'); }
      if (!s.dan.thuong && !s.sp.thuong && TT.bond.main(c)) dan.dung(c, 'thuong');
      if (!s.dan.ke_thu && !s.sp.ke_thu) dan.dung(c, 'ke_thu');
      if (!s.dan.ke_thua && !s.sp.ke_thua) dan.dung(c, 'ke_thua');
    },
    // Khoảnh khắc ấm (cùng vùng) và thư (khác vùng): +1 gắn bó, tối đa 1 lần mỗi năm mỗi người.
    warm(c) {
      const s = ensure(c); if (!s) return;
      const now = TT.world.months, yr = yearOf();
      K().dan.codinh.forEach((v, idx) => {
        const o = dan.get(c, v); if (!o || !o.alive || o.left || s.sp[v]) return;
        const y = s.amY[v] || (s.amY[v] = { am: -9, thu: -99 });
        if (y.am === yr) return;
        const far = o.region !== c.region;
        if (hash('am:' + c.id + ':' + now + ':' + v) >= KC().pAm) return;
        if (far) {
          if (yr - y.thu < KC().thuNam) return;
          const L = K().thu.filter(x => x.vai === v); if (!L.length) return;
          const t = L[Math.floor(hash('t:' + c.id + ':' + now + v) * L.length) % L.length];
          y.thu = yr; y.am = yr;
          TT.log(c, t.t.replace(/\{vai\}/g, o.name).replace(/\{ten\}/g, c.name), 'good');
        } else {
          if (o.travel || o.cross || c.travel || c.cross || c.dungeon) return;
          const L = K().am.filter(x => x.vai === v); if (!L.length) return;
          const t = L[Math.floor(hash('a:' + c.id + ':' + now + v) * L.length) % L.length];
          y.am = yr;
          TT.log(c, t.t.replace(/\{vai\}/g, o.name).replace(/\{ten\}/g, c.name), 'good');
        }
        s.gb[v] = Math.min(30, (s.gb[v] || 0) + 1);
        TT.rel.add(c, o, 2, 'khoảnh khắc ấm');
      });
    },
    tick(c) { if (!ensure(c)) return; dan.build(c); dan.sync(c); dan.warm(c); }
  };
})();
