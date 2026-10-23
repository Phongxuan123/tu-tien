// Khuôn và kịch bản cụ thể (AI1a, Q-khuon-kich-ban, Z 7d). Mở rộng TT.kb (js/systems/kb.js) bằng:
//   - make(c): ở mốc A1 (khuyết điểm gốc đã suy ra), chọn khuôn theo c.story.kd, bốc phương án (vết thương, muốn, vật, lật, ra mắt, nơi cấm) BẰNG BĂM (không gọi rng),
//     gán vai từ dàn, sinh kịch bản cụ thể c.story.kbc (thuần dữ liệu) rồi dựng thành tuyến của K1 (TT.kb.dynArc, id kbc_<id nhân vật>).
//   - mo_phan(c, i): khi mở phần i, làm tươi khe chữ (nơi, đỉnh, cách gọi) và chọn biến thể chặng theo cờ. (AI1b sẽ thay bằng chữ AI.)
//   - kiểu lựa chọn (D.STORY.kieu) → cơ chế fx của K1; tam_ma chỉ hiện khi đạo tâm thấp hoặc tâm ma nặng; kết cục chọn theo chuỗi kiểu (ketKhuon).
//   - manh mối và "Nhìn lại" (c.story.manhMoi), bảng xưng hô (c.story.xung), khuôn phụ (Story Director), story-lint cho khuôn và kịch bản cụ thể.
// Công tắc D.STORY.khuonOn (cùng kbOn). Hàm ĐỌC (khuonOf, cuThe, dynArc, tamMaHien, nhinLai, xung, dinh, lintKhuon, lintKbc, lintPhu, phuOk) không gọi rng và không ghi dữ liệu.
// Dữ liệu thuần trong c.story: kbc { v, khuon, arc, chon, guong, phan[], lat, chuoi{}, biet[], mo{}, dung_ke_thu }, manhMoi[], xung{}.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data;
  const kb = TT.kb = TT.kb || {};
  const K = () => D.STORY;
  const EMPTY = {};
  const hash = str => { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return (h >>> 0) / 4294967296; };
  const clean = o => (o === undefined ? undefined : JSON.parse(JSON.stringify(o)));
  const on = c => !!(c && c.kind === 'player' && K() && K().on && K().kbOn && K().khuonOn);
  const lower = t => t.charAt(0).toLowerCase() + t.slice(1);
  const O4 = ['moc', 'leo', 'cao_trao', 'treo'], OID = { moc: 'm', leo: 'l', cao_trao: 'c', treo: 't' };
  const OKHI = { moc: 6, leo: 12, cao_trao: 18, treo: 12 };
  const ROLES = ['ke_thu', 'guong', 'su', 'doi_thu', 'than_nhan', 'ban'];
  const sentences = t => (String(t).replace(/\{(vet_canh|vat_canh|vat_treo|ke_thu_ra_mat)\}/g, 'X.').match(/[.!?…](?=["”]?(\s|$))/g) || []).length;

  // ---------------------------------------------------------------- chọn khuôn, cụ thể hóa (đọc thuần, băm)
  kb.khuonOf = c => { const S = c && c.story; const id = S && S.kd && K().khuonKd[S.kd]; return id ? K().khuon[id] || null : null; };

  // Thế "đỉnh" theo cảnh giới thật (Q 2.4).
  kb.dinh = (c, kh) => {
    kh = kh || kb.khuonOf(c); const T = (kh && kh.thang_suc_manh) || []; if (!T.length) return 'người đứng đầu';
    const st = TT.stats && TT.stats.stage ? TT.stats.stage(c) : 0; let out = T[0].dinh;
    T.forEach(e => { if (c.realm > e.realm || (c.realm === e.realm && (e.stage == null || st >= e.stage))) out = e.dinh; });
    return out;
  };

  // Quan hệ giữa người chơi và một vai (đọc thuần): theo cờ (phan_<vai>, phe_su, ket_nghia_<vai>), số phận (kẻ thù), quan hệ thật (kết nghĩa, đạo lữ).
  function qhOf(c, vai) {
    const X = K().xung, f = c.flags || EMPTY, S = c.story || EMPTY, o = TT.dan && TT.dan.get ? TT.dan.get(c, vai) : null;
    let qh = X.mac_dinh[vai] || 'ban';
    if (o && TT.rel) {
      const r = TT.rel.get(c, o);
      if (r && r.k === 'ket_nghia') qh = 'ket_nghia';
      if (r && r.k === 'dao_lu') qh = 'dao_lu';
    }
    if (f['ket_nghia_' + vai]) qh = 'ket_nghia';
    if (f.phe_su && vai === 'su') qh = 'phe_su';
    if (f['phe_' + vai]) qh = 'phe_su';
    if (f['phan_' + vai]) qh = 'phan_boi';
    if (S.sp && S.sp[vai] === 'thu' && qh !== 'phan_boi' && qh !== 'phe_su') qh = 'ke_thu';
    return qh;
  }
  // Cách xưng hô của một vai với người chơi: { qh, ta, goi, goi_lai, ve }. Đọc từ c.story.xung nếu có, không thì suy ra (không ghi).
  kb.xung = (c, vai) => {
    const X = K().xung, S = c.story || EMPTY, qh = (S.xung && S.xung[vai] && S.xung[vai].qh) || qhOf(c, vai), T = X.qh[qh] || X.qh.ban;
    const o = TT.dan && TT.dan.get ? TT.dan.get(c, vai) : null, g = o && o.gender === 'nu' ? 'f' : 'n', gp = c.gender === 'nu' ? 'f' : 'n';
    const pick = (v, k) => (v && typeof v === 'object' ? v[k] : v);
    return { qh, ta: T.ta, goi: pick(T.goi, g), goi_lai: pick(T.goi_lai, gp), ve: pick(T.ve, g) };
  };
  // Làm tươi bảng xưng hô: quan hệ đổi (kết nghĩa, phản bội, phế sư, thành thù...) thì ghi lại c.story.xung[vai] = { qh, m }. Trả số vai vừa đổi.
  kb.xungSync = c => {
    const S = c.story; if (!S || !S.xung || !TT.dan) return 0; let n = 0;
    K().dan.vai.forEach(v => {
      if (!S.dan || !S.dan[v]) return;
      const qh = qhOf(c, v), cur = S.xung[v];
      if (!cur) { S.xung[v] = { qh, m: TT.world.months }; return; }
      if (cur.qh !== qh) { S.xung[v] = { qh, m: TT.world.months, truoc: cur.qh }; n++; }
    });
    return n;
  };

  // tam_ma chỉ hiện khi đạo tâm thấp hoặc đang mang tâm ma (đọc thuần).
  kb.tamMaHien = c => { const T = K().tamMa || {}; return !!c && (c.daoTam < (T.daoTam == null ? 35 : T.daoTam) || (c.traitIds || []).indexOf(T.trait || 'tam_ma') >= 0); };

  function cuThe(c, kh) {
    kh = kh || kb.khuonOf(c); if (!kh) return null;
    const base = 'kbc:' + c.id + ':' + c.birthMonth + ':' + kh.id, B = kh.bay_manh;
    const pick = (list, salt) => list[Math.floor(hash(base + ':' + salt) * list.length) % list.length];
    const xt = c.origin2 || '', ly = {};
    const vetFit = B.vet_thuong.filter(v => (v.xt || []).indexOf(xt) >= 0), vet = pick(vetFit.length ? vetFit : B.vet_thuong, 'vet');
    ly.vet = vetFit.length ? 'xuất thân ' + xt + ' hợp phương án ' + vet.id : 'xuất thân ' + xt + ' không khớp phương án nào, bốc theo hạt giống';
    const cho = c.sect || xt === 't6' ? 'tong' : xt === 't1' ? 'tan_tu' : '', muFit = B.muon.filter(m => m.cho === cho);
    const muon = muFit.length ? muFit[0] : pick(B.muon.filter(m => m.cho !== 'tan_tu'), 'muon');
    ly.muon = muFit.length ? (cho === 'tong' ? 'đã có tông' : 'tán tu') + ' nên muốn ' + muon.id : 'chưa có tông, bốc theo hạt giống';
    const vat = pick(kh.soi.chinh.vat, 'vat'), vatG = pick(kh.soi.phu[0].vat, 'vat_g'), vatS = pick(kh.soi.phu[1].vat, 'vat_s');
    const guongVai = (kh.dan.guong || ['thuong', 'huynh']).find(v => v === 'thuong' ? !!(TT.bond && TT.bond.main && TT.bond.main(c)) : true);
    ly.guong = guongVai === 'thuong' ? 'đã có đạo lữ nên gương là người thương' : 'chưa có người thương nên gương là huynh đệ';
    const lat = pick(kh.lat, 'lat'), raMat = pick(B.bong_toi.ra_mat, 'ra_mat'), noiCam = pick(kh.noi.cam, 'noi_cam');
    const vn = id => lower(K().vat[id] ? K().vat[id].n : id);
    // chữ tĩnh (chọn một lần, thay vào dòng dự phòng); khe động ({noi}, {dinh}, vật, thế lực) để bộ máy điền khi chơi
    const S1 = {
      vet_canh: vet.canh, vet: vet.vet, muon: muon.t, vat_canh: vat.canh, vat_treo: vat.treo, ke_thu_ra_mat: raMat, noi_cam: noiCam,
      guong_dd: (B.guong.dd || '').replace(/\{vat_guong\}/g, vn(vatG.id))
    };
    const sub = t => { let s = String(t); for (let i = 0; i < 2; i++) s = s.replace(/\{([a-z_]+)\}/g, (m, k) => (S1[k] != null ? S1[k] : m)); return s; };
    const roleDan = { ke_thu: 'ke_thu', guong: guongVai, su: 'su', doi_thu: 'doi_thu', than_nhan: 'than_nhan', ban: 'ban' };

    // manh mối của phương án lật: gắn vào (phần, chỗ), cài vào dòng dự phòng
    const mm = (lat.manh_moi || []).map((m, i) => ({ id: 'mm' + (i + 1), phan: m.phan, o: m.o, t: sub(m.t), hieu: sub(m.hieu) }));
    const phan = kh.phan.map((P, pi) => {
      const n = pi + 1, chs = O4.map(o => {
        const src = P.chang[o], id = 'p' + n + OID[o], clues = mm.filter(m => m.phan === n && m.o === o);
        const addClue = d => (clues.length ? d + ' ' + clues.map(m => m.t).join(' ') : d);
        const ch = { id, nhip: o, t: src.t, d: addClue(sub(src.d)), manh_moi: clues.map(m => m.id) };
        if (src.d_pham) ch.d_pham = addClue(sub(src.d_pham));
        if (src.lon) ch.lon = true;
        if (src.canh) ch.canh = clean(src.canh);
        if (src.can_gan_bo) ch.can_gan_bo = clean(src.can_gan_bo);
        if (src.ep) ch.ep = clean(src.ep);
        if (src.bien) ch.bien = src.bien.map(b => ({ khi: clean(b.khi), d: addClue(sub(b.d)) }));
        const nol = o === 'treo' && lat.phan_no === n;
        if (nol) { ch.d = sub(lat.no.d); ch.lat = true; delete ch.manh_moi; }
        const mk = x => ({ key: x.key, label: sub(x.label), mat: sub(x.mat), kind: x.kind || 'safe', fx_them: clean(x.fx_them), tt: clean(x.tt), flag: x.flag });
        if (!nol && src.kieu) ch.lc = src.kieu.map(k => ({ key: k.kieu, kieu: k.kieu, vt: k.vt, doi: k.doi, cuu: k.cuu, label: sub(k.label), mat: sub(k.mat), sau: k.sau ? sub(k.sau) : undefined, hau: k.hau ? sub(k.hau) : undefined, fx_them: clean(k.fx_them) }));
        else ch.lc = (nol ? lat.no.lc : src.lc).map(mk);
        return ch;
      });
      return { i: n, id: P.id, n: P.n, tuoi: P.tuoi != null ? P.tuoi : K().tuoiPhan[pi], canh: clean(P.canh), tho: P.tho, cau_hoi: P.cau_hoi, biet: P.biet, chang: chs };
    });
    return {
      v: 1, khuon: kh.id, arc: 'kbc_' + c.id, kd: kh.khuyet_diem, guong: guongVai, roleDan,
      chon: { vet: vet.id, muon: muon.id, vat: vat.id, vat_guong: vatG.id, vat_su: vatS.id, lat: lat.id, ra_mat: B.bong_toi.ra_mat.indexOf(raMat), noi_cam: noiCam, ly },
      lat: { id: lat.id, kieu: lat.kieu, ten: lat.ten, phan_no: lat.phan_no, o_no: lat.o_no || 'treo', manh_moi: mm, biet: sub(lat.no.biet), hieu: sub(lat.no.hieu), da_no: false },
      phan, chuoi: {}, biet: [], mo: {}, dung_ke_thu: true
    };
  }
  kb.cuThe = cuThe;

  // ---------------------------------------------------------------- dựng tuyến từ kịch bản cụ thể (hoặc khuôn phụ)
  // ctx: { n (phần 1..), tag, truc, dau, roleDan, dest(i) (đích của chặng cuối) }
  function lcArc(lc, ctx, nextId, isCT, ep, ketOf) {
    if (!lc.kieu) {
      const o = { key: lc.key, label: lc.label, kind: lc.kind || 'safe', mat: lc.mat };
      const fx = Object.assign({}, mapDan(clean(lc.fx_them) || {}, ctx.roleDan)); if (lc.flag) fx.flag = lc.flag;
      if (Object.keys(fx).length) o.fx = fx;
      if (lc.tt) o.thu_thach = { can: clean(lc.tt.can), han: lc.tt.han, dat: nextId, truot: nextId }; else o.toi = nextId;
      return o;
    }
    const lib = K().kieu[lc.kieu], R = ctx.roleDan;
    const P = { p: ctx.tag, n: ctx.n, truc: ctx.truc, dau: ctx.dau, doi: R[lc.doi] || lc.doi, cuu: R[lc.cuu] || lc.cuu, slot: lc.doi };
    const b = lib.ap(P), fx = Object.assign({}, clean(b.fx) || {});
    if (ep) Object.keys(ep).forEach(k => { fx[k] = (fx[k] || 0) + ep[k]; });
    const them = mapDan(clean(lc.fx_them) || {}, R); Object.keys(them).forEach(k => { fx[k] = them[k]; });
    const o = { key: lc.key, label: lc.label, kind: b.kind, mat: lc.mat, kieu: lc.kieu, vt: lc.vt, fx };
    if (b.ax) o.ax = clean(b.ax);
    if (b.tm || lib.tm) o.tm = true;
    if (b.tre) o.tre = clean(b.tre);
    const to = ketOf && ketOf(lc) ? 'ket:' + ketOf(lc) : nextId;
    if (b.wheel) { o.wheel = clean(b.wheel); o.wheel.vung.forEach(z => { z.toi = to; }); }
    else { o.toi = to; if (lc.sau) o.sau = lc.sau; }
    if (lc.hau) o.hau = lc.hau;
    return o;
  }
  // Tên vai trong chữ (guong, ke_thu...) → vai của dàn (thuong hoặc huynh cho guong) ở mọi khóa `dan` của một khối fx / can_gan_bo.
  const mapDan = (o, R) => { if (Array.isArray(o)) return o.map(x => mapDan(x, R)); if (o && typeof o === 'object') { const r = {}; Object.keys(o).forEach(k => { r[k] = k === 'dan' && typeof o[k] === 'string' ? (R[o[k]] || o[k]) : mapDan(o[k], R); }); return r; } return o; };
  const victims = lcs => {
    const v = [];
    lcs.forEach(lc => [lc.fx].concat((lc.wheel ? lc.wheel.vung.map(z => z.fx) : [])).forEach(fx => { if (fx) ['chet', 'roi', 'thu'].forEach(k => { if (fx[k] && v.indexOf(fx[k].dan) < 0) v.push(fx[k].dan); }); }));
    return v;
  };
  const flagOf = lc => (lc.fx && lc.fx.flag) ? [].concat(lc.fx.flag)[0] : null;

  // chuyển một chặng của khuôn (đã cụ thể hóa) thành chặng của tuyến K1
  function chArc(ch, ctx, nextId, prevCT, ketOf, khi) {
    const o = { t: ch.t, d: ch.d, khi, han: ch.nhip === 'cao_trao' ? 36 : 24 };
    if (ch.d_pham) o.d_pham = ch.d_pham;
    if (ch.lon) o.lon = true;
    if (ch.canh) o.canh = ch.canh;
    o.lc = ch.lc.map(l => lcArc(l, ctx, nextId, ch.nhip === 'cao_trao', ch.ep, ketOf));
    const vic = victims(o.lc);
    let g = ch.can_gan_bo ? [].concat(mapDan(clean(ch.can_gan_bo), ctx.roleDan)) : [];
    const has = [], walk = x => { if (Array.isArray(x)) x.forEach(walk); else if (x && x.hoac) x.hoac.forEach(walk); else if (x && x.dan) has.push(x.dan); };
    walk(g); vic.forEach(v => { if (has.indexOf(v) < 0) g.push({ dan: v, min: 0 }); });
    if (g.length) o.can_gan_bo = g.length === 1 ? g[0] : g;
    const dk = o.lc.find(l => l.vt === 'dkd' && !l.tm), plain = o.lc.find(l => !l.tm);
    o.mac = (dk || plain || o.lc[0]).key;
    if (ch.bien) o.bien = ch.bien;
    // d_neu: cao trào của phần trước để lại dấu ở móc phần sau (đọc cờ)
    if (prevCT && ch.nhip === 'moc') {
      const dn = prevCT.map(l => ({ flag: flagOf(l), d: ch.d + ' ' + l.hau })).filter(x => x.flag && x.d);
      if (dn.length) o.d_neu = dn;
    }
    return o;
  }

  function ketsOf(kh) { const out = {}; Object.keys(kh.ket).forEach(k => { const e = kh.ket[k]; out[k] = { t: e.t, kv: e.kv, log: e.log }; if (e.xau) out[k].xau = true; }); return out; }

  // Tuyến chính từ kbc. Chọn biến thể chặng theo kbc.phan[i].bien_chon (mo_phan đặt).
  function buildArc(kbc) {
    const kh = K().khuon[kbc.khuon], kd = K().kds[kh.khuyet_diem], R = kbc.roleDan;
    const arc = {
      id: kbc.arc, n: kh.ten, loai: 'kb', dyn: true, mo: { kd: kh.khuyet_diem, age: kbc.phan[0].tuoi },
      vai: { ke_thu: { pick: 'dan:ke_thu' }, guong: { pick: 'dan:' + kbc.guong }, su: { pick: 'dan:su' }, doi_thu: { pick: 'dan:doi_thu' }, than_nhan: { pick: 'dan:than_nhan' }, ban: { pick: 'dan:ban' } },
      khe_kb: {
        vat: { vat: [kbc.chon.vat] }, vat_guong: { vat: [kbc.chon.vat_guong] }, vat_su: { vat: [kbc.chon.vat_su] }, the_luc: { the_luc: true },
        noi: { chu: kh.noi.chinh }, dinh: { chu: kh.thang_suc_manh[0].dinh }, guong_goi: { chu: 'bạn' }
      },
      dau: kbc.phan[0].chang[0].id, phan: [], chang: {}, ket: ketsOf(kh)
    };
    let prevCT = null;
    kbc.phan.forEach((P, pi) => {
      const ctx = { n: P.i, truc: kd.truc, dau: kd.dau, roleDan: R }, ids = P.chang.map(c => c.id);
      const phanO = { id: P.id, n: P.n, tuoi: P.tuoi, moc: ids[0], leo: [ids[1]], cao_trao: ids[2], treo: ids[3] };
      if (P.canh) phanO.canh = clean(P.canh); else if (P.tho != null) phanO.canh = { tho: P.tho };
      arc.phan.push(phanO);
      P.chang.forEach((ch0, j) => {
        const ch = Object.assign({}, ch0), nextId = j < 3 ? ids[j + 1] : (pi < kbc.phan.length - 1 ? kbc.phan[pi + 1].chang[0].id : 'ket:@khuon');
        if (ch.bien && P.bien_chon != null && ch.bien[P.bien_chon]) ch.d = ch.bien[P.bien_chon].d;
        const khi = { sau: pi === 0 && j === 0 ? 0 : OKHI[ch.nhip] };
        if (ch.nhip === 'moc' && phanO.canh) khi.hoac = [clean(phanO.canh), { age: P.tuoi }];
        arc.chang[ch.id] = chArc(ch, Object.assign({}, ctx, { tag: ch.nhip === 'cao_trao' ? String(P.i) : P.i + OID[ch.nhip] }), nextId, ch.nhip === 'moc' ? prevCT : null, null, khi);
      });
      const ct = arc.chang[ids[2]]; prevCT = ct.lc.map(l => ({ fx: l.fx, hau: l.hau }));
    });
    return arc;
  }

  // Khuôn phụ → tuyến (không phụ thuộc nhân vật): 2 đến 3 phần × 3 chặng (moc, leo, cao_trao).
  function buildPhu(kh) {
    const arc = { id: 'kbp_' + kh.id, n: kh.ten, loai: 'kb', phu: true, dyn: true, kieu_phu: kh.loai, thay: kh.thay, mo: clean(kh.mo), vai: {}, khe_kb: { noi: { chu: 'nơi này' } }, phan: [], chang: {}, ket: ketsOf(kh) };
    const R = {}; Object.keys(kh.vai).forEach(s => { arc.vai[s] = { pick: 'dan:' + kh.vai[s] }; R[s] = kh.vai[s]; });
    let prevCT = null; const N = kh.phan.length;
    kh.phan.forEach((P, pi) => {
      const n = pi + 1, ctx = { n, tag: 'q' + n, truc: null, dau: 0, roleDan: R }, ids = ['m', 'l', 'c'].map(x => 'q' + n + x);
      if (pi === 0) arc.dau = ids[0];
      arc.phan.push({ id: P.id, n: P.n, moc: ids[0], leo: [ids[1]], cao_trao: ids[2] });
      ['moc', 'leo', 'cao_trao'].forEach((o, j) => {
        const src = P.chang[o], ch = { id: ids[j], nhip: o, t: src.t, d: src.d, lon: src.lon, canh: src.canh };
        ch.lc = o === 'cao_trao' ? src.kieu.map(k => ({ key: k.kieu, kieu: k.kieu, vt: k.vt, doi: k.doi, cuu: k.cuu, label: k.label, mat: k.mat, sau: k.sau, hau: k.hau, ket: k.ket, fx_them: clean(k.fx_them) })) : src.lc.map(x => ({ key: x.key, label: x.label, mat: x.mat, kind: x.kind, fx_them: clean(x.fx_them), tt: clean(x.tt), flag: x.flag }));
        const last = pi === N - 1, nextId = j < 2 ? ids[j + 1] : (last ? null : 'q' + (n + 1) + 'm');
        arc.chang[ids[j]] = chArc(ch, ctx, nextId, o === 'moc' ? prevCT : null, last && o === 'cao_trao' ? (l => l.ket) : null, { sau: o === 'moc' ? (pi === 0 ? 1 : 3) : OKHI[o] });
        if (arc.chang[ids[j]].lc.some(l => l.kieu)) arc.chang[ids[j]].lc.forEach(l => { delete l.kieu0; });
      });
      const ct = arc.chang[ids[2]]; prevCT = ct.lc.map(l => ({ fx: l.fx, hau: l.hau }));
    });
    return arc;
  }

  // ---------------------------------------------------------------- bộ nhớ đệm tuyến sinh từ kbc (không ghi vào dữ liệu)
  let CACHE = null;
  kb.dynArc = id => {
    const p = TT.player && TT.player(), kbc = p && p.story && p.story.kbc;
    if (!kbc || kbc.arc !== id || !K().khuon[kbc.khuon]) return null;
    if (CACHE && CACHE.kbc === kbc && CACHE.v === kbc.v) return CACHE.arc;
    CACHE = { kbc, v: kbc.v, arc: buildArc(kbc) }; return CACHE.arc;
  };
  kb.arcFrom = buildArc;
  kb.arcPhu = buildPhu;
  kb.invalidate = c => { if (c && c.story && c.story.kbc) c.story.kbc.v++; };

  // Tuyến phụ: đăng ký vào D.STORY.arcs lúc nạp (không phụ thuộc nhân vật; mở bởi canOpen → phuOk).
  kb.regPhuArcs = () => {
    Object.keys(K().phu || {}).forEach(id => { const aid = 'kbp_' + id; if (!K().arcById[aid]) K().reg(buildPhu(K().phu[id])); });
  };

  // ---------------------------------------------------------------- ghi: make, mở tuyến, mở phần, đã áp lựa chọn
  kb.make = c => {
    if (!on(c)) return null;
    const S = TT.story.ensure(c); if (!S || S.kbc) return S && S.kbc || null;
    const kbc = cuThe(c); if (!kbc) return null;
    S.kbc = kbc; S.kd_khoa = 1; S.manhMoi = S.manhMoi || []; S.xung = S.xung || {};
    TT.dan.dung(c, 'ke_thu'); // kẻ bóng tối ra mắt từ phần 1
    kb.xungSync(c);
    return kbc;
  };
  // Ở mỗi tick (kb.tick): đến mốc A1 (đã có khuyết điểm gốc) thì dựng kịch bản cụ thể; mở tuyến chính khi đủ điều kiện (tuổi phần 1).
  kb.khuonTick = c => {
    if (!on(c)) return;
    const S = c.story;
    if (!S.kbc && S.kd && K().khuonKd[S.kd]) kb.make(c);
    if (S.kbc) kb.xungSync(c);
  };
  kb.openDyn = (c, S) => {
    if (!on(c) || !S.kbc || S.arcs[S.kbc.arc]) return null;
    const arc = kb.dynArc(S.kbc.arc); if (!arc || !TT.story.condOk(c, arc.mo)) return null;
    return arc;
  };

  // Khe chữ động: nơi (tên tông), đỉnh (theo cảnh giới), cách gọi của gương, thế lực dự phòng. Ghi vào st.khe của tuyến chính.
  function refreshKhe(c, arc, st, n) {
    const kbc = c.story.kbc, kh = K().khuon[kbc.khuon]; st.khe = st.khe || {};
    const f = c.sect && TT.fac && TT.fac.get ? TT.fac.get(c.sect.id) : null;
    st.khe.noi = f && f.n ? f.n : (n >= 3 && kh.noi.tong ? kh.noi.tong : kh.noi.chinh); // có tông thì tên tông; chưa có thì học đường (phần 1, 2) hoặc tông môn nói chung
    st.khe.dinh = kb.dinh(c, kh);
    st.khe.guong_goi = kb.xung(c, kbc.guong).goi_lai || 'bạn';
    st.ten = st.ten || {}; ROLES.forEach(r => { const o = TT.dan.get(c, kbc.roleDan[r]); if (o && o.name) st.ten[r] = o.name; }); // nhớ tên: người đã mất bị xóa khỏi thế giới sau nhiều năm
    if (!st.khe.the_luc) st.khe.the_luc = 'một thế lực lạ';
  }
  kb.khuonOpen = (c, arc, st) => { if (arc.dyn && !arc.phu && c.story.kbc) refreshKhe(c, arc, st, 1); };

  // Giữ người then chốt theo kịp nhịp đời (Q 2.4): phàm nhân chết già ở 70 mà kịch bản kéo dài tới 115+ tuổi. Từ phần 2: kẻ bóng tối luôn cao hơn người chơi đúng một bậc
  // (phàm thì vào Luyện Khí trước bạn), gương và thầy còn sống thì ít nhất Luyện Khí; kẻ bóng tối đã mất (chưa tới phần cuối) thì dựng người khác cùng vai.
  const nang = (o, tr, ts) => { if (!o || !o.alive || o.realm > tr || (o.realm === tr && TT.stats.stage(o) >= ts)) return false; o.realm = tr; o.xp = Math.floor(D.NEED[tr] * (ts / 3 + 0.05)); o.stuck = false; o.hp = TT.stats.hpMax(o); return true; };
  kb.giuVai = (c, i) => {
    const S = c.story, kbc = S && S.kbc; if (!kbc || i < 2) return 0; let n = 0;
    const r = c.realm, s = TT.stats.stage(c), tr = r === 0 ? 1 : (s < 2 ? r : r + 1), ts = r === 0 ? 0 : (s < 2 ? s + 1 : 0);
    if (!TT.dan.alive(c, 'ke_thu') && TT.dan.sp(c, 'ke_thu') === 'chet' && i < 6) { delete S.dan.ke_thu; delete S.sp.ke_thu; kbc.dung_ke_thu = true; if (TT.dan.dung(c, 'ke_thu')) { kbc.ke_thu_moi = (kbc.ke_thu_moi || 0) + 1; n++; } }
    if (nang(TT.dan.get(c, 'ke_thu'), Math.min(5, tr), ts)) n++;
    ['guong', 'su'].forEach(v => { if (nang(TT.dan.get(c, kbc.roleDan[v]), 1, 0)) n++; });
    return n;
  };

  // Mở phần i (1..6): làm tươi khe, chọn biến thể theo cờ và số phận người trong dàn; ghi kbc.mo[i]. (AI1b thay bằng chữ AI.)
  const bienOk = (c, khi) => {
    if (!khi) return false;
    if (khi.flag) return !!c.flags[khi.flag];
    if (khi.sp) { const dv = c.story.kbc.roleDan[khi.sp[0]] || khi.sp[0]; return TT.dan.sp(c, dv) === khi.sp[1] || (khi.sp[1] === 'chet' && TT.dan.sp(c, dv) === 'roi'); }
    return false;
  };
  kb.mo_phan = (c, i) => {
    const S = c.story, kbc = S && S.kbc; if (!kbc) return false;
    const P = kbc.phan[i - 1]; if (!P) return false;
    const arc = kb.dynArc(kbc.arc), st = S.arcs[kbc.arc];
    let ch = -1;
    P.chang.forEach(x => { if (x.bien) { const k = x.bien.findIndex(b => bienOk(c, b.khi)); if (k >= 0) ch = k; } });
    const bienDoi = (P.bien_chon == null ? -1 : P.bien_chon) !== ch;
    if (bienDoi) { P.bien_chon = ch < 0 ? null : ch; kbc.v++; }
    kbc.mo[i] = TT.world.months;
    kb.giuVai(c, i);
    if (st && arc) refreshKhe(c, arc, st, i);
    return true;
  };

  // Đã áp một lựa chọn của tuyến sinh từ khuôn: ghi chuỗi kiểu, đánh dấu manh mối, cú lật nổ, điều bạn biết.
  kb.dynApplied = (c, arc, st, chId, lc) => {
    const S = c.story, kbc = S.kbc; if (!kbc || arc.id !== kbc.arc) return;
    const ph = kbc.phan.find(P => P.chang.some(x => x.id === chId)), ch = ph && ph.chang.find(x => x.id === chId); if (!ch) return;
    if (ch.nhip === 'cao_trao' && lc) { kbc.chuoi[ph.i] = { kieu: lc.kieu || '', vt: lc.vt || '', key: lc.key }; if (kbc.biet.indexOf(ph.i) < 0) kbc.biet.push(ph.i); }
    (ch.manh_moi || []).forEach(id => {
      const m = kbc.lat.manh_moi.find(x => x.id === id); if (!m || S.manhMoi.some(x => x.id === id)) return;
      const t = TT.story.fmt(c, st, m.t);
      S.manhMoi.push({ id, m: TT.world.months, chang: chId, phan: ph.i, t, hieu: TT.story.fmt(c, st, m.hieu) });
      TT.log(c, t, 'age'); const le = c.log[c.log.length - 1]; if (le && le.t === t) le.mm = 1; // giữ dòng nhật ký manh mối (không bị cắt khi nhật ký đầy)
    });
    if (ch.lat && !kbc.lat.da_no) {
      kbc.lat.da_no = true; kbc.lat.m = TT.world.months; if (kbc.biet.indexOf('lat') < 0) kbc.biet.push('lat');
      TT.log(c, 'Bạn đã hiểu ra: ' + TT.story.fmt(c, st, kbc.lat.biet), 'big');
    }
  };
  // Vào chặng của tuyến sinh từ khuôn: chặng móc thì mở phần.
  kb.dynEnter = (c, arc, st, chId) => {
    const kbc = c.story.kbc; if (!kbc || arc.id !== kbc.arc) return;
    const ph = kbc.phan.find(P => P.chang.some(x => x.id === chId)); if (!ph) return;
    if (ph.chang[0].id === chId) kb.mo_phan(c, ph.i); else refreshKhe(c, arc, st, ph.i);
  };

  // Kết cục theo chuỗi kiểu lựa chọn (Q 2.7): toan_ven / doa / co_doc. Trả chuỗi 'ket:<id>'.
  kb.ketKhuon = (c, arc) => {
    const kbc = c.story && c.story.kbc, kh = kbc && K().khuon[kbc.khuon]; if (!kh) return 'ket:' + Object.keys(arc.ket)[0];
    const ch = kbc.chuoi, keys = Object.keys(kh.ket); let rest = null;
    for (const k of keys) {
      const dk = kh.ket[k].dk || {};
      if (dk.loai === 'con_lai') { rest = k; continue; }
      if (dk.loai === 'nguoc') {
        const n = Object.keys(ch).filter(p => +p >= dk.tu_phan && ch[p].vt === 'nguoc').length;
        if (n >= dk.min && ch[6] && ch[6].kieu === dk.p6) return 'ket:' + k;
      } else if (dk.loai === 'dkd') { if (dk.phan.every(p => ch[p] && ch[p].vt === 'dkd')) return 'ket:' + k; }
    }
    return 'ket:' + (rest || keys[keys.length - 1]);
  };

  // ---------------------------------------------------------------- "Nhìn lại" và giao diện (đọc thuần)
  // Sau cú lật, một dòng nhật ký (hoặc chặng) đã từng là manh mối thì trả câu "giờ bạn đã hiểu"; chưa lật thì rỗng.
  kb.latNo = c => !!(c && c.story && c.story.kbc && c.story.kbc.lat && c.story.kbc.lat.da_no);
  kb.nhinLai = (c, e) => {
    if (!kb.latNo(c)) return '';
    const m = (c.story.manhMoi || []).find(x => x.m === e.m && x.t === e.t);
    return m ? m.hieu : '';
  };
  // Chặng trong nhật ký truyện (st.log) là manh mối: trả "giờ bạn đã hiểu" theo tên chặng.
  kb.nhinLaiChang = (c, arc, text) => {
    if (!kb.latNo(c)) return '';
    const m = (c.story.manhMoi || []).find(x => { const a = arc.chang[x.chang]; return a && text.indexOf(TT.story.fmt(c, c.story.arcs[arc.id], a.t) + ':') === 0; });
    return m ? m.hieu : '';
  };
  // Khối "Truyện của đời bạn": câu hỏi đang treo, điều bạn biết (mỗi phần một dòng), người trong cuộc.
  kb.tomTat = c => {
    const S = c.story, kbc = S && S.kbc; if (!kbc) return null;
    const arc = kb.dynArc(kbc.arc), st = S.arcs[kbc.arc], f = s => TT.story.fmt(c, st, s);
    const cur = st && st.st && !st.ket ? kbc.phan.find(P => P.chang.some(x => x.id === st.st)) : null;
    const biet = []; kbc.phan.forEach(P => { if (kbc.biet.indexOf(P.i) >= 0 && P.biet && P.biet.charAt(0) !== '(') biet.push({ phan: P.i, t: f(P.biet) }); });
    if (kb.latNo(c)) biet.push({ phan: kbc.lat.phan_no, t: f(kbc.lat.biet), lat: true });
    const kh = K().khuon[kbc.khuon], cau = cur ? cur.cau_hoi : (st && st.ket ? '' : kbc.phan[0].cau_hoi);
    const nguoi = ROLES.map(r => {
      const dv = kbc.roleDan[r], o = TT.dan.get(c, dv), sp = TT.dan.sp(c, dv); if (!o && !sp) return null;
      const ten = o ? o.name : (st && st.ten && st.ten[r]) || '?';
      const dd = r === 'ke_thu' ? (kh.bay_manh.bong_toi.ra_mat[kbc.chon.ra_mat] || '') : r === 'guong' ? (kh.bay_manh.guong.dd || '') : '';
      return { vai: r, ten, ten_vai: K().dan.ten[dv], dd: f(dd.replace(/\{vat_guong\}/g, (st && st.khe && st.khe.vat_guong) || 'vật kỷ niệm')), song: !!(o && o.alive && !o.left), sp };
    }).filter(Boolean);
    return { cau_hoi_chinh: kh.cau_hoi_trung_tam, cau_hoi: cau, phan: cur ? cur.i : 0, biet, nguoi, lat: kb.latNo(c) };
  };

  // ---------------------------------------------------------------- khuôn phụ: Story Director
  kb.phuOk = (c, arc, S) => {
    if (!K().phuOn || !K().khuonOn) return false;
    S = S || c.story;
    for (const id of Object.keys(S.arcs)) { const a = TT.story.arcOf(id), s = S.arcs[id]; if (a && a.phu && !s.ket && id !== arc.id) return false; } // tối đa một tuyến phụ nóng
    const now = TT.world.months;
    if (S.ct_at != null && now - S.ct_at < K().phuGiaYen) return false; // khoảng yên sau cao trào chính
    const main = S.kbc && S.arcs[S.kbc.arc];
    if (main && !main.ket && main.nhip === 'cao_trao') return false; // cao trào chính kế đã tới hạn
    return true;
  };
  // Tuyến phụ xong: đổ vào khuôn chính (đặt cờ, gieo gắn bó cho dàn).
  kb.phuXong = (c, arc, st) => {
    const kh = K().phu[arc.id.replace(/^kbp_/, '')], d = kh && kh.do_vao; if (!d) return;
    if (d.flag) c.flags[d.flag] = TT.world.months;
    if (d.fx) TT.story.applyFx(c, st, d.fx, arc.n);
    if (c.story) { c.story.phuXong = c.story.phuXong || []; c.story.phuXong.push({ id: kh.id, m: TT.world.months, phan: d.phan }); }
  };

  // ---------------------------------------------------------------- story-lint cho khuôn, khuôn phụ và kịch bản cụ thể
  const SLOT = /\{([a-z_]+)\}/g;
  const SLOTS_OK = ['ten', 'ke_thu', 'guong', 'su', 'doi_thu', 'than_nhan', 'ban', 'vat', 'vat_guong', 'vat_su', 'vet', 'vet_canh', 'muon', 'vat_canh', 'vat_treo', 'ke_thu_ra_mat',
    'guong_dd', 'noi', 'noi_cam', 'dinh', 'the_luc', 'guong_goi'];
  const KIEU_KET = ['nguoc', 'dkd', 'con_lai'];
  kb.lintKhuon = function (kh) {
    const E = [], e = m => E.push((kh.id || '?') + ': ' + m), str = v => typeof v === 'string' && v.trim().length > 0, num = v => typeof v === 'number' && isFinite(v);
    const slots = (t, w, ok) => String(t).replace(SLOT, (m, k) => { if ((ok || SLOTS_OK).indexOf(k) < 0) e(w + ': khe {' + k + '} lạ'); return m; });
    const kieu = K().kieu, kds = K().kds;
    ['id', 'ten', 'cau_hoi_trung_tam', 'logline'].forEach(k => { if (!str(kh[k])) e('thiếu ' + k); });
    if (!kds[kh.khuyet_diem]) e('khuyet_diem không phải khuyết điểm gốc: ' + kh.khuyet_diem);
    const B = kh.bay_manh || {};
    if (!B.vet_thuong || B.vet_thuong.length < 2 || B.vet_thuong.length > 3) e('bay_manh.vet_thuong cần 2 đến 3 phương án');
    else B.vet_thuong.forEach((v, i) => { if (!str(v.id) || !Array.isArray(v.xt) || !v.xt.length || !str(v.vet) || !str(v.canh)) e('vet_thuong[' + i + '] thiếu id, xt, vet hoặc canh'); });
    if (!B.muon || B.muon.length < 2) e('bay_manh.muon cần ít nhất 2 phương án'); else B.muon.forEach((m, i) => { if (!str(m.id) || !str(m.t) || ['tong', 'vung', 'tan_tu'].indexOf(m.cho) < 0) e('muon[' + i + '] thiếu id, t hoặc cho'); });
    ['loi_noi_doi', 'can', 'hy_sinh'].forEach(k => { if (!str(B[k])) e('bay_manh.' + k + ' thiếu'); });
    if (!B.bong_toi || !str(B.bong_toi.vai) || !str(B.bong_toi.cach_chon) || !(B.bong_toi.ra_mat || []).length) e('bay_manh.bong_toi cần vai, cach_chon, ra_mat'); else B.bong_toi.ra_mat.forEach(t => slots(t, 'ra_mat'));
    if (!B.guong || !Array.isArray(B.guong.vai) || !B.guong.vai.length || !str(B.guong.dd)) e('bay_manh.guong cần vai (mảng) và dd'); else slots(B.guong.dd, 'guong.dd');
    const dan = kh.dan || {}; ROLES.forEach(r => { if (!dan[r]) e('dan thiếu ' + r); else [].concat(dan[r]).forEach(v => { if (K().dan.vai.indexOf(v) < 0) e('dan.' + r + ' không phải vai của dàn: ' + v); }); });
    const S0 = kh.soi || {};
    if (!S0.chinh || !str(S0.chinh.nguoi) || !(S0.chinh.vat || []).length) e('soi.chinh cần nguoi và vat'); else S0.chinh.vat.forEach(v => { if (!K().vat[v.id]) e('soi.chinh.vat không có trong D.STORY.vat: ' + v.id); slots(v.canh || '', 'vat.canh'); slots(v.treo || '', 'vat.treo'); });
    if (!Array.isArray(S0.phu) || S0.phu.length < 2 || S0.phu.length > 2) e('soi.phu cần đúng 2 sợi phụ (gương, thầy)'); else S0.phu.forEach(p => (p.vat || []).forEach(v => { if (!K().vat[v.id]) e('soi.phu.vat không có trong D.STORY.vat: ' + v.id); }));
    if (!kh.noi || !str(kh.noi.chinh) || !str(kh.noi.tong) || !(kh.noi.cam || []).length) e('noi cần chinh, tong và cam');
    if (!(kh.thang_suc_manh || []).length) e('thiếu thang_suc_manh'); else kh.thang_suc_manh.forEach((t, i) => { if (!num(t.realm) || !str(t.dinh)) e('thang_suc_manh[' + i + '] cần realm và dinh'); });
    const ph = kh.phan || [];
    if (ph.length !== 6) e('cần đúng 6 phần, có ' + ph.length);
    let lastAge = -1;
    ph.forEach((P, pi) => {
      const W = 'phan[' + pi + ']';
      ['id', 'n', 'chuc_nang', 'cau_hoi', 'biet', 'thang_vui', 'cai_mat'].forEach(k => { if (!str(P[k])) e(W + ' thiếu ' + k); });
      if (!num(P.tuoi) || P.tuoi < lastAge) e(W + '.tuoi phải là số tăng dần'); else lastAge = P.tuoi;
      slots(P.biet || '', W + '.biet');
      O4.forEach(o => {
        const ch = (P.chang || EMPTY)[o], X = W + '.' + o;
        if (!ch) return e(X + ' thiếu');
        if (!str(ch.t)) e(X + ' thiếu t'); if (!str(ch.d)) e(X + ' thiếu dòng dự phòng d'); else { slots(ch.d, X); const n = sentences(ch.d); if (n < 2 || n > 3) e(X + ': dòng dự phòng cần 2 đến 3 câu, có ' + n); }
        (ch.bien || []).forEach((b, i) => { if (!str(b.d)) e(X + '.bien[' + i + '] thiếu d'); else slots(b.d, X + '.bien' + i); });
        if (ch.lon && !ch.canh) e(X + ': cảnh lớn cần canh');
        if (o === 'cao_trao' || ch.kieu) {
          if (o === 'cao_trao' && !ch.lon) e(X + ' phải là cảnh lớn');
          const ks = ch.kieu || [], thuong = ks.filter(k => !(kieu[k.kieu] || EMPTY).tm);
          if (thuong.length < 2 || thuong.length > 3) e(X + ': cần 2 đến 3 kiểu thường (không tính tam_ma), có ' + thuong.length);
          if (ks.length - thuong.length > 1) e(X + ': tối đa một kiểu tam_ma');
          if (o === 'cao_trao' && !ks.some(k => k.vt === 'nguoc')) e(X + ': thiếu kiểu đi ngược khuyết điểm (vt nguoc)');
          if (o === 'cao_trao' && !ks.some(k => k.vt === 'dkd')) e(X + ': thiếu kiểu dung_khuyet_diem (vt dkd)');
          ks.forEach((k, i) => {
            const L = X + '.kieu[' + i + ']';
            if (!kieu[k.kieu]) return e(L + ': kiểu không có trong D.STORY.kieu: ' + k.kieu);
            if (['nguoc', 'dkd', 'khac'].indexOf(k.vt) < 0) e(L + ': vt phải là nguoc, dkd hoặc khac');
            if (kieu[k.kieu].tm && k.vt !== 'dkd') e(L + ': tam_ma phải có vt dkd');
            if (k.kieu === 'dung_khuyet_diem' && k.vt !== 'dkd') e(L + ': dung_khuyet_diem phải có vt dkd');
            ['doi', 'cuu'].forEach(r => { if (ROLES.indexOf(k[r]) < 0) e(L + ': ' + r + ' không phải vai trong chữ: ' + k[r]); });
            ['label', 'mat', 'hau'].forEach(f => { if (!str(k[f])) e(L + ' thiếu ' + f); else slots(k[f], L + '.' + f); });
            if (k.kieu !== 'chong') { if (!str(k.sau)) e(L + ' thiếu sau (lời dẫn)'); else slots(k.sau, L + '.sau'); }
            (k.fx_them && ['chet', 'roi', 'thu'].forEach(f => { if (k.fx_them[f] && K().dan.vai.indexOf(k.fx_them[f].dan) < 0 && ROLES.indexOf(k.fx_them[f].dan) < 0) e(L + ': fx_them.' + f + ' trỏ vai không có'); }));
          });
        } else {
          const lcs = ch.lc || [];
          if (lcs.length < 2 || lcs.length > 3) e(X + ': cần 2 đến 3 lựa chọn');
          lcs.forEach((l, i) => { const L = X + '.lc[' + i + ']'; ['key', 'label', 'mat'].forEach(f => { if (!str(l[f])) e(L + ' thiếu ' + f); else slots(l[f], L + '.' + f); }); });
          if (ch.lon) e(X + ': cảnh lớn ở chỗ ' + o + ' cần danh sách kieu');
        }
      });
      // leo lớn: chuyển lc có kieu sang kieu[] để builder dùng chung
    });
    // phương án lật
    const lat = kh.lat || [];
    if (lat.length < 2 || lat.length > 3) e('lat cần 2 đến 3 phương án');
    lat.forEach((l, i) => {
      const W = 'lat[' + i + ']';
      if (!str(l.id) || !str(l.kieu) || !str(l.ten)) e(W + ' thiếu id, kieu hoặc ten');
      if (l.phan_no !== 4 && l.phan_no !== 5) e(W + ': phan_no phải là 4 hoặc 5');
      const mms = l.manh_moi || [];
      if (mms.length < 3) e(W + ': cần ít nhất 3 manh_moi, có ' + mms.length);
      if (new Set(mms.map(m => m.phan)).size < 2) e(W + ': manh_moi phải rải qua ít nhất 2 phần');
      mms.forEach((m, j) => {
        const L = W + '.manh_moi[' + j + ']';
        if (!(m.phan >= 1 && m.phan < l.phan_no)) e(L + ': phần ' + m.phan + ' phải trước phần nổ ' + l.phan_no);
        if (O4.indexOf(m.o) < 0) e(L + ': o không hợp lệ'); if (!str(m.t) || !str(m.hieu)) e(L + ' thiếu t hoặc hieu'); else { slots(m.t, L + '.t'); slots(m.hieu, L + '.hieu'); }
      });
      const no = l.no || {};
      if (!str(no.d) || !str(no.biet) || !str(no.hieu)) e(W + '.no thiếu d, biet hoặc hieu'); else { slots(no.d, W + '.no.d'); slots(no.biet, W + '.no.biet'); }
      if (!no.lc || no.lc.length !== 2) e(W + '.no.lc cần đúng 2 lựa chọn'); else no.lc.forEach((x, j) => { if (!str(x.key) || !str(x.label) || !str(x.mat) || !str(x.flag)) e(W + '.no.lc[' + j + '] thiếu key, label, mat hoặc flag'); });
    });
    // chặng không có kẻ ác
    const kn = kh.khong_ke_ac;
    if (!kn || !ph[kn.phan - 1] || !ph[kn.phan - 1].chang[kn.o]) e('khong_ke_ac phải trỏ một chặng có thật');
    else {
      const ch = ph[kn.phan - 1].chang[kn.o], ks = (ch.kieu || ch.lc || []).map(x => x.kieu).filter(Boolean);
      if (!ch.lon) e('khong_ke_ac: chặng phải là cảnh lớn');
      ['chong', 'tam_ma', 'duong_tat'].forEach(k => { if (ks.indexOf(k) >= 0) e('khong_ke_ac: chặng có kiểu ' + k + ' (không còn là cảnh không kẻ ác)'); });
    }
    // kết cục
    const ket = kh.ket || {}, kk = Object.keys(ket);
    if (kk.length < 2) e('ket cần ít nhất 2 kết cục');
    if (kk.filter(k => (ket[k].dk || EMPTY).loai === 'con_lai').length !== 1) e('ket cần đúng một kết cục con_lai');
    kk.forEach(k => { const x = ket[k], dk = x.dk || EMPTY; if (!str(x.t) || !str(x.log)) e('ket.' + k + ' thiếu t hoặc log'); else slots(x.log, 'ket.' + k); if (!(num(x.kv) && x.kv >= 0 && x.kv <= 2)) e('ket.' + k + '.kv phải trong 0..2'); if (KIEU_KET.indexOf(dk.loai) < 0) e('ket.' + k + '.dk.loai không hợp lệ'); });
    return E;
  };

  // Kịch bản cụ thể: đủ phần, chặng, manh mối đã cài, kiểu lựa chọn đúng bảng của khuôn, ≤ 25 cờ, và tuyến dựng ra qua story-lint.
  kb.lintKbc = function (kbc, arc) {
    const E = [], e = m => E.push((kbc.arc || '?') + ': ' + m), kh = K().khuon[kbc.khuon];
    if (!kh) return [kbc.arc + ': không có khuôn ' + kbc.khuon];
    arc = arc || buildArc(kbc);
    if (kbc.phan.length !== kh.phan.length) e('số phần ' + kbc.phan.length + ' khác khuôn ' + kh.phan.length);
    const chs = []; kbc.phan.forEach(P => P.chang.forEach(x => chs.push(x)));
    if (chs.length < 20 || chs.length > 30) e('số chặng ' + chs.length + ' ngoài khoảng 20 đến 30 (mục tiêu 24)');
    if (new Set(chs.map(x => x.id)).size !== chs.length) e('id chặng trùng');
    const lt = kbc.lat; if (!lt || !kh.lat.some(x => x.id === lt.id)) e('lat không thuộc khuôn');
    else {
      if ((lt.manh_moi || []).length < 3) e('lat có ít hơn 3 manh mối');
      (lt.manh_moi || []).forEach(m => {
        const ph = kbc.phan[m.phan - 1], ch = ph && ph.chang.find(x => x.nhip === m.o);
        if (!ch) return e('manh mối ' + m.id + ' không có chỗ');
        if (m.phan >= lt.phan_no) e('manh mối ' + m.id + ' không ở trước phần nổ');
        if ((ch.manh_moi || []).indexOf(m.id) < 0 || ch.d.indexOf(m.t) < 0) e('manh mối ' + m.id + ' chưa được cài vào chữ của chặng ' + ch.id);
      });
      const nl = kbc.phan[lt.phan_no - 1].chang[3]; if (!nl.lat) e('chặng treo của phần nổ chưa mang đoạn sự thật');
    }
    kbc.phan.forEach((P, pi) => {
      const kp = kh.phan[pi], ct = P.chang[2], want = kp.chang.cao_trao.kieu.map(k => k.kieu).sort().join(','), got = ct.lc.map(l => l.kieu).sort().join(',');
      if (want !== got) e('phần ' + P.i + ': kiểu cao trào ' + got + ' không đúng bảng ' + want);
      if (!ct.lc.some(l => l.vt === 'nguoc') || !ct.lc.some(l => l.vt === 'dkd')) e('phần ' + P.i + ': thiếu nguoc hoặc dkd');
      P.chang.forEach(x => { if (!x.d || sentences(x.d) < 2) e('chặng ' + x.id + ': dòng dự phòng quá ngắn'); });
    });
    const fl = {};
    Object.keys(arc.chang).forEach(id => arc.chang[id].lc.forEach(l => { [l.fx].concat((l.tre || []).map(t => t.fx), l.wheel ? l.wheel.vung.map(z => z.fx) : []).forEach(fx => { if (fx && fx.flag) [].concat(fx.flag).forEach(f => { fl[f] = 1; }); }); }));
    if (Object.keys(fl).length > 25) e('quá 25 cờ (' + Object.keys(fl).length + ')');
    E.push.apply(E, TT.story.lint([arc]));
    return E;
  };

  // Khuôn phụ: 2 đến 3 phần × 3 chặng, loại hợp lệ, điều kiện mở, vai từ dàn, đổ vào phần của khuôn chính, kiểu lựa chọn từ thư viện.
  kb.lintPhu = function (kh) {
    const E = [], e = m => E.push((kh.id || '?') + ': ' + m), str = v => typeof v === 'string' && v.trim().length > 0, kieu = K().kieu;
    if (!str(kh.id) || !str(kh.ten)) e('thiếu id hoặc ten');
    if (['than_phan', 'the_gioi', 'quan_he'].indexOf(kh.loai) < 0) e('loai phải là than_phan, the_gioi hoặc quan_he');
    if (!kh.mo || !Object.keys(kh.mo).length) e('thiếu mo (khóa thân phận N1b hoặc cờ biến cố mô phỏng)');
    const vai = kh.vai || {}; if (!Object.keys(vai).length) e('thiếu vai'); Object.keys(vai).forEach(s => { if (K().dan.vai.indexOf(vai[s]) < 0) e('vai ' + s + ' không phải vai của dàn: ' + vai[s]); });
    if (!kh.do_vao || !(kh.do_vao.phan >= 1 && kh.do_vao.phan <= 6) || !str(kh.do_vao.flag)) e('do_vao cần phan (1..6) và flag');
    const ph = kh.phan || []; if (ph.length < 2 || ph.length > 3) e('cần 2 đến 3 phần, có ' + ph.length);
    const ket = kh.ket || {}; if (Object.keys(ket).length < 2) e('ket cần ít nhất 2 kết cục');
    const ok = (t, w) => String(t).replace(SLOT, (m, k) => { if (!vai[k] && k !== 'ten' && k !== 'noi') e(w + ': khe {' + k + '} không có trong vai'); return m; });
    ph.forEach((P, pi) => {
      const W = 'phan[' + pi + ']'; if (!str(P.id) || !str(P.n) || !str(P.cau_hoi)) e(W + ' thiếu id, n hoặc cau_hoi');
      ['moc', 'leo', 'cao_trao'].forEach(o => {
        const ch = (P.chang || EMPTY)[o], X = W + '.' + o; if (!ch) return e(X + ' thiếu');
        if (!str(ch.t) || !str(ch.d)) e(X + ' thiếu t hoặc d'); else { ok(ch.d, X); const n = sentences(ch.d); if (n < 2 || n > 3) e(X + ': dòng dự phòng cần 2 đến 3 câu'); }
        if (o === 'cao_trao') {
          if (!ch.lon) e(X + ' phải là cảnh lớn');
          const ks = ch.kieu || []; if (ks.length < 2 || ks.length > 4) e(X + ': cần 2 đến 4 kiểu');
          ks.forEach((k, i) => {
            const L = X + '.kieu[' + i + ']'; if (!kieu[k.kieu]) e(L + ': kiểu lạ ' + k.kieu);
            [k.doi, k.cuu].forEach(r => { if (!vai[r]) e(L + ': vai ' + r + ' không có trong vai'); });
            ['label', 'mat', 'hau'].forEach(f => { if (!str(k[f])) e(L + ' thiếu ' + f); else ok(k[f], L); });
            if (k.kieu !== 'chong' && !str(k.sau)) e(L + ' thiếu sau');
            if (pi === ph.length - 1 && !ket[k.ket]) e(L + ': phần cuối cần ket trỏ kết cục có thật');
          });
        } else if ((ch.lc || []).length < 2) e(X + ': cần ít nhất 2 lựa chọn');
      });
    });
    return E;
  };

  // Nạp: đăng ký tuyến sinh từ khuôn phụ (nếu dữ liệu đã nạp).
  if (K() && K().phu) kb.regPhuArcs();
})();
