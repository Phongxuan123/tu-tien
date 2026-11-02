// AI kể chuyện lúc chơi (AI1b, Z 7d). TT.aiw (tên khác TT.ai là bộ quyết định của NPC). AI CHỈ viết chữ (cảnh, nhãn, cái giá, lời dẫn, hồ sơ, ký ức, hạt);
// cơ chế, số, phần thưởng do bộ máy giữ. Công tắc tắt (mặc định) thì mọi móc trong story.js/kb.js là hàm rỗng và game như sau AI1a.
//   - Lớp nhà cung cấp: gemini (mặc định), anthropic (tùy chọn). Khóa chỉ ở localStorage 'tt8b_ai_keys' (KHÔNG vào bản lưu, repo, xuất tệp).
//   - Gọi kiểu callback (không Promise) để kiểm thử bằng nhà cung cấp giả lập chạy đồng bộ: aiw.transport(req, cb) thay được.
//   - Chữ AI lưu ở c.story.ai (khởi tạo muộn, không đổi TT.VERSION): txt[tuyến][chặng] = { ok, d, dneu, lc{khóa:{label,mat,sau}}, hat[], mm[], model, pid, tier, m }.
//     Hiện chữ qua aiw.view(c, arc, ch) (không sửa dữ liệu tuyến); rec.fb (lý do) nghĩa là dùng dòng dự phòng của AI1a.
// Hàm ĐỌC (on, view, cfg, stats, hist, compose*, check*) không gọi rng và không ghi dữ liệu game.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data;
  const W = () => D.AIW, K = () => D.STORY;
  const CFG_KEY = 'tt8b_ai_cfg', KEY_KEY = 'tt8b_ai_keys', DAT_KEY = 'tt8b_ai_dat', TOT_KEY = 'tt8b_ai_tot';
  const EMPTY = {};
  const hash32 = s => { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; };
  const lsGet = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };
  const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const clone = o => (o === undefined ? undefined : JSON.parse(JSON.stringify(o)));
  const lower = s => String(s).toLowerCase();

  // ---------------------------------------------------------------- cài đặt, khóa, bộ đếm (localStorage riêng, không phải bản lưu)
  let CFG = null, KEYS = null, TOT = null;
  function cfg() {
    if (CFG) return CFG;
    const d = clone(W().cfg), s = lsGet(CFG_KEY) || {};
    CFG = Object.assign(d, s, { models: { gemini: Object.assign({}, d.models.gemini, (s.models || EMPTY).gemini), anthropic: Object.assign({}, d.models.anthropic, (s.models || EMPTY).anthropic) } });
    return CFG;
  }
  function setCfg(p) { const c = cfg(); Object.keys(p || {}).forEach(k => { if (k === 'models') { Object.keys(p.models).forEach(pr => { c.models[pr] = Object.assign(c.models[pr] || {}, p.models[pr]); }); } else c[k] = p[k]; }); lsSet(CFG_KEY, c); return c; }
  function keys() { if (!KEYS) KEYS = lsGet(KEY_KEY) || {}; return KEYS; }
  function setKey(pr, v) { const k = keys(); if (v) k[pr] = String(v).trim(); else delete k[pr]; lsSet(KEY_KEY, k); }
  const getKey = pr => keys()[pr || cfg().provider] || '';
  function tot() { if (!TOT) TOT = Object.assign({ n: 0, tin: 0, tout: 0, loi: 0, chan: 0 }, lsGet(TOT_KEY) || {}); return TOT; }
  const saveTot = () => lsSet(TOT_KEY, TOT);
  const dat = () => lsGet(DAT_KEY) || [];

  // ---------------------------------------------------------------- điều kiện bật
  const eligibleArc = arc => !!arc && ((arc.id || '').indexOf('kbc_') === 0 || !!arc.phu);
  function on(c) {
    const k = K();
    return !!(cfg().on && c && c.kind === 'player' && k && k.on && k.kbOn && k.khuonOn && c.story && getKey());
  }
  function AI(c, mk) {
    const S = c.story; if (!S) return null;
    if (!S.ai) { if (!mk) return null; S.ai = { v: 1, txt: {}, hoso: {}, hat: [], ky: '', n: 0, tin: 0, tout: 0, lo: [], hn: 0 }; }
    return S.ai;
  }
  const recOf = (c, arcId, chId) => { const a = c.story && c.story.ai; return a && a.txt[arcId] && a.txt[arcId][chId] || null; };
  function setRec(c, arcId, chId, rec) { const a = AI(c, true); (a.txt[arcId] = a.txt[arcId] || {})[chId] = rec; return rec; }
  function lo(c, key, why) { const a = AI(c, true); a.lo.push({ m: TT.world.months, k: key, why }); if (a.lo.length > 40) a.lo.shift(); }

  // ---------------------------------------------------------------- lớp nhà cung cấp
  const SAFE_CATS = ['HARM_CATEGORY_HARASSMENT', 'HARM_CATEGORY_HATE_SPEECH', 'HARM_CATEGORY_SEXUALLY_EXPLICIT', 'HARM_CATEGORY_DANGEROUS_CONTENT'];
  const PROV = {
    gemini: {
      req(model, sys, user, tier, key) { // không gửi temperature/top_p (bản 3.x bỏ các tham số lấy mẫu)
        return {
          url: 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: sys }] },
            contents: [{ role: 'user', parts: [{ text: user }] }],
            generationConfig: { responseMimeType: 'application/json', maxOutputTokens: W().maxTok[tier] },
            safetySettings: SAFE_CATS.map(category => ({ category, threshold: cfg().safety }))
          })
        };
      },
      parse(r) {
        const j = r.json || {}, o = { ok: false, text: '', tin: 0, tout: 0 };
        if (r.status === 404) { o.err = 'model'; return o; }
        if (r.status === 429 || r.status >= 500 || r.status === 0) { o.err = 'tam'; o.msg = r.err || (j.error && j.error.message) || ('HTTP ' + r.status); return o; }
        if (r.status >= 400) { o.err = 'loi'; o.msg = (j.error && j.error.message) || ('HTTP ' + r.status); return o; }
        const u = j.usageMetadata || {}; o.tin = u.promptTokenCount || 0; o.tout = (u.candidatesTokenCount || 0) + (u.thoughtsTokenCount || 0);
        if (j.promptFeedback && j.promptFeedback.blockReason) { o.chan = j.promptFeedback.blockReason; return o; }
        const cd = j.candidates && j.candidates[0];
        if (!cd) { o.chan = 'khong_co_ung_vien'; return o; }
        if (cd.finishReason && /SAFETY|PROHIBITED|BLOCKLIST|SPII|IMAGE_SAFETY/.test(cd.finishReason)) { o.chan = cd.finishReason; return o; }
        o.text = ((cd.content && cd.content.parts) || []).filter(p => !p.thought && typeof p.text === 'string').map(p => p.text).join('');
        o.ok = !!o.text; if (!o.ok) o.err = 'rong'; return o;
      },
      list(key) { return { url: 'https://generativelanguage.googleapis.com/v1beta/models?pageSize=200', headers: { 'x-goog-api-key': key }, method: 'GET' }; }
    },
    anthropic: {
      req(model, sys, user, tier, key) {
        return {
          url: 'https://api.anthropic.com/v1/messages',
          headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
          body: JSON.stringify({ model, max_tokens: W().maxTok[tier], system: sys, messages: [{ role: 'user', content: user }] })
        };
      },
      parse(r) {
        const j = r.json || {}, o = { ok: false, text: '', tin: 0, tout: 0 };
        if (r.status === 404) { o.err = 'model'; return o; }
        if (r.status === 429 || r.status === 529 || r.status >= 500 || r.status === 0) { o.err = 'tam'; o.msg = r.err || (j.error && j.error.message) || ('HTTP ' + r.status); return o; }
        if (r.status >= 400) { o.err = 'loi'; o.msg = (j.error && j.error.message) || ('HTTP ' + r.status); return o; }
        const u = j.usage || {}; o.tin = u.input_tokens || 0; o.tout = u.output_tokens || 0;
        if (j.stop_reason === 'refusal') { o.chan = 'refusal'; return o; }
        o.text = (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
        o.ok = !!o.text; if (!o.ok) o.err = 'rong'; return o;
      }
    }
  };
  // Giao thức thật: fetch. Kiểm thử thay bằng aiw.transport = (req, cb) => cb({ status, json }).
  function fetchTransport(req, cb) {
    let done = false; const fin = r => { if (!done) { done = true; cb(r); } };
    try {
      fetch(req.url, { method: req.method || 'POST', headers: req.headers, body: req.method === 'GET' ? undefined : req.body })
        .then(r => r.text().then(t => { let j = null; try { j = JSON.parse(t); } catch (e) { /* không phải JSON */ } fin({ status: r.status, json: j, text: t }); }))
        .catch(e => fin({ status: 0, err: String(e && e.message || e) }));
    } catch (e) { fin({ status: 0, err: String(e) }); }
  }

  function parseJson(text) {
    let t = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    const a = t.indexOf('{'), b = t.lastIndexOf('}'); if (a < 0 || b <= a) return null;
    try { return JSON.parse(t.slice(a, b + 1)); } catch (e) { return null; }
  }

  // ---------------------------------------------------------------- lịch sử lời gửi và chữ nhận về (bộ nhớ, cho bảng 🛠)
  const HIST = [];
  function pushHist(h) { HIST.push(h); if (HIST.length > 60) HIST.shift(); return h; }

  // Một lượt gọi một nhà cung cấp: đếm lượt và token (đời + tổng), thử lại MỘT lần khi lỗi tạm, dò lại model khi 404 (gemini).
  // cb({ ok, text, json, model, chan, err, msg, tin, tout })
  function callProvider(c, tier, sys, user, cb) {
    const A = AI(c, true), pr = cfg().provider, P = PROV[pr], key = getKey(pr);
    if (!P || !key) return cb({ ok: false, err: 'khoa' });
    if (A.n >= cfg().quota) return cb({ ok: false, err: 'han_muc' });
    let model = cfg().models[pr][tier], tried = 0, ha = false;
    const go = () => {
      A.n++; tot().n++;
      const req = P.req(model, sys, user, tier, key);
      aiw.transport(req, r => {
        const o = P.parse(r); o.model = model; A.tin += o.tin; A.tout += o.tout; tot().tin += o.tin; tot().tout += o.tout;
        if (o.chan) { tot().chan++; saveTot(); return cb(o); }
        if (!o.ok && o.err === 'model' && pr === 'gemini' && tried < 1) { tried++; return dimModel(key, tier, nm => { if (nm && nm !== model) { model = nm; setCfg({ models: { gemini: { [tier]: nm } } }); return go(); } tot().loi++; saveTot(); cb(o); }); }
        if (!o.ok && o.err === 'tam' && tried < 2) { tried++; return aiw.sleep(900, go); }
        if (!o.ok && tier === 'lon' && !ha && cfg().models[pr].nho !== model) { ha = true; tried = 0; model = cfg().models[pr].nho; o.ha = model; return go(); } // tầng lớn lỗi (ví dụ khóa miễn phí không có hạn mức Pro): hạ xuống model tầng nhỏ một lần
        if (!o.ok) tot().loi++;
        saveTot(); cb(o);
      });
    };
    go();
  }
  // Model không tồn tại: hỏi danh sách model của khóa, chọn bản mới nhất cùng họ (flash hoặc pro), dùng được generateContent.
  function dimModel(key, tier, cb) {
    const fam = tier === 'lon' ? 'pro' : 'flash';
    aiw.transport(PROV.gemini.list(key), r => {
      const L = (r.json && r.json.models) || [];
      const ok = L.filter(m => /generateContent/.test((m.supportedGenerationMethods || []).join(',')) && new RegExp('gemini-[\\d.]+-' + fam + '$').test(String(m.name || '').replace('models/', '')))
        .map(m => String(m.name).replace('models/', ''));
      const ver = s => parseFloat((s.match(/gemini-([\d.]+)-/) || [0, 0])[1]);
      ok.sort((a, b) => ver(b) - ver(a));
      cb(ok[0] || '');
    });
  }

  // ---------------------------------------------------------------- dữ kiện thật gửi kèm
  const ROLES = ['ke_thu', 'guong', 'su', 'doi_thu', 'than_nhan', 'ban'];
  function kbcOf(c) { return c.story && c.story.kbc || null; }
  function nameOfRole(c, st, r) {
    const kbc = kbcOf(c); if (!kbc) return '';
    const dv = kbc.roleDan[r], o = TT.dan.get(c, dv);
    return o ? o.name : (st && st.ten && st.ten[r]) || '';
  }
  function nearRegions(c) { return [c.region].concat(TT.map.macroNeighbors(c.region).map(x => x.to)); }
  function theLuc(c) { // tên thế lực thật quanh vùng
    const near = nearRegions(c), out = [];
    TT.fac.list('tong').forEach(f => { if (TT.fac.alive(f) && near.indexOf(f.region) >= 0) out.push({ n: f.n, r: f.region === c.region ? 'cùng vùng' : 'vùng giáp', m: Math.round(f.power) }); });
    out.sort((a, b) => b.m - a.m);
    return out.slice(0, 8);
  }
  function noiChon(c) { return TT.map.placesOf(c.region).filter(p => !p.site).slice(0, 14).map(p => p.n); }
  function bienCo(c) { // tin gần đây của vùng (kho tin của báo)
    const s = TT.world.press; if (!s) return [];
    return s.pool.filter(x => x.m >= TT.world.months - 72 && (x.r == null || x.r === c.region || x.i >= 4)).sort((a, b) => b.i - a.i || b.m - a.m).slice(0, 6).map(x => x.t);
  }
  const xungTable = (c, st) => ROLES.map(r => { const kbc = kbcOf(c), x = TT.kb.xung(c, kbc.roleDan[r]); return { vai: r, ten: nameOfRole(c, st, r), qh: x.qh, tu_xung: x.ta, goi_ban: x.goi, ban_goi_lai: x.goi_lai }; });

  function words(t) { return String(t || '').trim().split(/\s+/).filter(Boolean); }
  function sentences(t) { return (String(t).match(/[.!?…](?=["”]?(\s|$))/g) || []).length; }

  // Tập từ được phép viết hoa giữa câu: tên được phép + từ chung (cảnh giới, danh xưng).
  const CHUNG = ['Thiên', 'Cơ', 'Địa', 'Đạo', 'Trời', 'Đất', 'Phật', 'Luyện', 'Khí', 'Trúc', 'Kim', 'Đan', 'Nguyên', 'Anh', 'Hóa', 'Thần', 'Phi', 'Thăng', 'Phàm', 'Nhân', 'Đại', 'Điển', 'Hình', 'Đường', 'Tông', 'Môn', 'Phái'];
  function allowedWords(extra) {
    const s = new Set(); const add = t => String(t || '').split(/[\s,.:;!?…"“”()\-—]+/).forEach(w => { if (w) s.add(lower(w)); });
    CHUNG.forEach(add); (D.REALM_NAMES || []).forEach(add); (extra || []).forEach(add);
    return s;
  }
  // Từ viết hoa giữa câu mà không thuộc tập được phép (tên lạ).
  function unknownNames(text, allowed) {
    const out = [], re = /[^\s"“”‘’.!?…:;,()—]+/g; let m;
    const isUp = w => { const f = w.charAt(0); return f !== f.toLowerCase() && f === f.toUpperCase(); };
    while ((m = re.exec(text))) {
      const w = m[0].replace(/^[-'’]+|[-'’]+$/g, ''); if (!w || !isUp(w)) continue;
      let i = m.index - 1; while (i >= 0 && /\s/.test(text.charAt(i))) i--;
      if (i < 0 || /[.!?…:"“”‘’—(]/.test(text.charAt(i))) continue; // đầu câu
      if (!allowed.has(lower(w))) out.push(w);
    }
    return out.filter((w, i) => out.indexOf(w) === i);
  }
  const common = (a, b) => { const A = new Set(words(lower(a).replace(/[^\p{L}\s]/gu, ' ')).filter(w => w.length >= 3)); let n = 0; new Set(words(lower(b).replace(/[^\p{L}\s]/gu, ' '))).forEach(w => { if (A.has(w)) n++; }); return n; };

  // ---------------------------------------------------------------- kiểm chữ (thuần)
  // Kiểm một đoạn chữ tự do: từ cấm, chữ số/phần thưởng, khe thừa, tên lạ. Trả mảng lỗi.
  function checkText(t, label, allowed, opt) {
    const E = [], s = String(t == null ? '' : t);
    if (!s.trim()) return [label + ': trống'];
    if (/[{}<>]/.test(s)) E.push(label + ': còn ký tự khe hoặc thẻ');
    W().cam.forEach(w => { if (lower(s).indexOf(lower(w)) >= 0) E.push(label + ': từ cấm "' + w + '"'); });
    if (!(opt && opt.soLieu) && W().thuongLa.test(s)) E.push(label + ': có chữ số hoặc nhắc phần thưởng/số liệu');
    const un = unknownNames(s, allowed); if (un.length) E.push(label + ': tên ngoài danh sách được phép (' + un.join(', ') + ')');
    return E;
  }
  // Xưng hô: vai đã đổi quan hệ thì không được dùng cách gọi cũ đặc trưng trong lời thoại.
  function checkXung(c, st, texts) {
    const E = [], kbc = kbcOf(c), X = K().xung; if (!kbc) return E;
    const quoted = texts.join(' ').match(/["“][^"”]+["”]/g) || [], q = lower(quoted.join(' '));
    ROLES.forEach(r => {
      const now = TT.kb.xung(c, kbc.roleDan[r]).qh, base = X.mac_dinh[kbc.roleDan[r]] || X.mac_dinh[r]; if (!base || now === base) return;
      const old = X.qh[base], nw = X.qh[now]; if (!old || !nw) return;
      const pick = v => (v && typeof v === 'object' ? [v.n, v.f] : [v]);
      const newTerms = pick(nw.goi).concat(pick(nw.goi_lai)).map(lower);
      pick(old.goi).concat(pick(old.goi_lai)).map(lower).forEach(w => {
        if (w.length >= 5 && newTerms.indexOf(w) < 0 && q.indexOf(w) >= 0) E.push('xưng hô: ' + r + ' đã đổi quan hệ (' + now + '), không còn dùng "' + w + '"');
      });
    });
    return E;
  }

  // ---------------------------------------------------------------- soạn lời gửi
  function samples(nhip, kieu) { // cảnh chuẩn + các đoạn "đạt" của bạn (bảng 🛠)
    const M = W().mau.map(m => 'Cảnh mẫu: ' + m.ten + ' (' + m.boi + ')\n' + m.d + (m.sau ? '\nPhản đòn mẫu: ' + m.sau : '')).join('\n\n');
    const pool = dat().filter(x => x.kind === 'chang'), same = pool.filter(x => x.nhip === nhip), ok = (same.length ? same : pool).slice(-2).map(x => 'Đoạn ĐÃ DUYỆT (' + (x.nhip || '') + '): ' + x.d).join('\n');
    return M + (ok ? '\n\n' + ok : '');
  }
  function system(nhip) {
    return W().camNang + '\n\n=== MẪU GIỌNG (chỉ học cách viết; KHÔNG dùng tên, nhân vật hay chi tiết của mẫu) ===\n' + samples(nhip);
  }
  const hatList = c => (AI(c) ? AI(c).hat : []);
  function stateBlock(c, st, kbc) {
    const L = [], A = AI(c), realm = D.REALM_NAMES[Math.min(c.realm, D.REALM_NAMES.length - 1)];
    L.push('NGƯỜI CHƠI: ' + c.name + ', ' + (c.gender === 'nu' ? 'nữ' : 'nam') + ', ' + TT.age(c) + ' tuổi, cảnh giới ' + realm + (c.sect ? ', thuộc ' + (TT.fac.get(c.sect.id) || {}).n : ', chưa có tông') + ', xuất thân ' + (c.origin2 || '?') + '.');
    L.push('KHUYẾT ĐIỂM GỐC: ' + (K().kds[c.story.kd] || {}).n + '.');
    const tl = theLuc(c); L.push('THẾ LỰC ĐƯỢC PHÉP (tên thật, mạnh nhất trước): ' + (tl.map(x => x.n + ' (' + x.r + ')').join('; ') || 'không có'));
    L.push('NƠI ĐƯỢC PHÉP: ' + noiChon(c).join('; ') + (st && st.khe && st.khe.noi ? '. Nơi chính của cảnh: ' + st.khe.noi : ''));
    L.push('NGƯỜI ĐƯỢC PHÉP (dàn định mệnh): ' + ROLES.map(r => { const n = nameOfRole(c, st, r), o = TT.dan.get(c, kbc.roleDan[r]); return r + '=' + (n || '(chưa có)') + (o ? (o.alive ? '' : ' [đã mất]') : ' [đã mất hoặc bỏ đi]'); }).join('; '));
    L.push('BẢNG XƯNG HÔ HIỆN TẠI (bắt buộc theo): ' + JSON.stringify(xungTable(c, st)));
    const hs = A && A.hoso || {}; const hk = Object.keys(hs);
    if (hk.length) L.push('HỒ SƠ NGƯỜI TRONG DÀN: ' + JSON.stringify(hk.map(v => ({ vai: v, ten: hs[v].ten, giong: hs[v].giong, thoi_quen: hs[v].thoi_quen, uoc: hs[v].uoc, so: hs[v].so, vat: hs[v].vat }))));
    if (st && st.khe) { const v = ['vat', 'vat_guong', 'vat_su'].map(k => st.khe[k]).filter(Boolean); if (v.length) L.push('VẬT KỶ NIỆM: ' + v.join('; ')); }
    const hat = hatList(c); if (hat.length) L.push('HẠT CŨ (chi tiết do đời này sinh ra): ' + JSON.stringify(hat.map(h => ({ id: h.id, t: h.t, tu_khoa: h.tk }))));
    if (A && A.ky) L.push('KÝ ỨC TÍCH LŨY: ' + A.ky);
    const ch = Object.keys(kbc.chuoi || {}).map(p => 'phần ' + p + ': ' + kbc.chuoi[p].kieu + ' (' + kbc.chuoi[p].key + ')'); if (ch.length) L.push('NHỮNG LỰA CHỌN ĐÃ LÀM Ở CAO TRÀO: ' + ch.join('; '));
    const bc = bienCo(c); if (bc.length) L.push('BIẾN CỐ VÙNG GẦN ĐÂY: ' + bc.join(' | '));
    return L.join('\n');
  }
  function allowedFor(c, st, kbc, extra) {
    const names = [c.name]; ROLES.forEach(r => names.push(nameOfRole(c, st, r)));
    if (c.sect) names.push((TT.fac.get(c.sect.id) || {}).n);
    theLuc(c).forEach(x => names.push(x.n)); noiChon(c).forEach(n => names.push(n));
    if (st && st.khe) Object.keys(st.khe).forEach(k => names.push(st.khe[k]));
    Object.keys(AI(c, true).hoso).forEach(v => { names.push(AI(c).hoso[v].ten); });
    return allowedWords(names.concat(extra || []));
  }

  // Lời gửi cho một chặng (đã gồm yêu cầu máy đọc được ở dòng YEU_CAU).
  function composeChang(c, arc, chId, opt) {
    opt = opt || {};
    const st = c.story.arcs[arc.id], kbc = kbcOf(c), ch = arc.chang[chId], isMain = arc.id === kbc.arc;
    const pm = TT.kb.phanOf(arc, chId) || { i: 0, nhip: 'moc' }, nhip = pm.nhip;
    const kh = isMain ? K().khuon[kbc.khuon] : null, kp = isMain ? kh.phan[pm.i] : null;
    const fmt = t => TT.story.fmt(c, st, t);
    const kch = isMain ? kbc.phan[pm.i].chang.find(x => x.id === chId) : null;
    const mm = isMain && kch && kch.manh_moi ? kch.manh_moi.map(id => kbc.lat.manh_moi.find(m => m.id === id)).filter(Boolean).map(m => ({ id: m.id, y: fmt(m.t) })) : [];
    const lcs = ch.lc.map(l => { const mt = kch ? (kch.lc.find(x => x.key === l.key) || {}) : {}; return { key: l.key, kieu: l.kieu || '', vt: l.vt || '', doi: mt.doi ? nameOfRole(c, st, mt.doi) || mt.doi : '', cuu: mt.cuu ? nameOfRole(c, st, mt.cuu) || mt.cuu : '', nhan_du_phong: fmt(l.label), gia_du_phong: fmt(l.mat || ''), co_vong_quay: !!l.wheel }; });
    const needSau = ch.lon ? ch.lc.filter(l => !l.wheel && l.kieu !== 'chong').map(l => l.key) : [];
    const hats = hatList(c), needHat = nhip === 'cao_trao' && pm.i >= 1 && hats.length > 0;
    const bien = (ch.bien || []).filter(b => b.khi && b.khi.flag).map(b => b.khi.flag);
    const req = { loai: 'chang', arc: arc.id, chang: chId, nhip, lon: !!ch.lon, keys: ch.lc.map(l => l.key), kieu: ch.lc.map(l => l.kieu || ''), can_sau: needSau, manh_moi: mm, can_hat: needHat, hat_ids: hats.map(h => h.id), bien_flags: bien, tran: nhip === 'cao_trao' ? W().gioiHan.ct[1] : ch.lon ? W().gioiHan.lon[1] : W().gioiHan.thuong[1] };
    const P = [];
    P.push('=== YÊU CẦU: VIẾT TRỌN MỘT CHẶNG ===');
    if (isMain) {
      P.push('KỊCH BẢN: ' + kh.ten + ' (' + kh.logline + '). Câu hỏi trung tâm của đời: ' + kh.cau_hoi_trung_tam);
      if (kbc.ai && kbc.ai.logline) P.push('Logline cụ thể của đời này: ' + kbc.ai.logline + (kbc.ai.bang6 ? '\nBảng sáu phần (mỗi phần một dòng): ' + kbc.ai.bang6.join(' | ') : ''));
      P.push('PHẦN ' + (pm.i + 1) + '/6 "' + kbc.phan[pm.i].n + '": chức năng: ' + kp.chuc_nang + '. Câu hỏi của phần: ' + kp.cau_hoi + '. Cái mất (loại): ' + kp.cai_mat + '. Thắng hoặc vui: ' + kp.thang_vui + '.');
      P.push('Vết thương gốc của người chơi: ' + (kh.bay_manh.vet_thuong.find(v => v.id === kbc.chon.vet) || {}).canh + ' Điều người chơi muốn: ' + (kh.bay_manh.muon.find(v => v.id === kbc.chon.muon) || {}).t);
      if (kbc.lat.da_no) P.push('Cú lật ĐÃ NỔ: ' + fmt(kbc.lat.biet)); else P.push('Cú lật ẨN (TUYỆT ĐỐI KHÔNG tiết lộ, chỉ cài manh mối được giao): ' + kbc.lat.ten + '. Sự thật: ' + fmt(kbc.lat.biet));
    } else {
      const kp2 = K().phu[arc.id.replace(/^kbp_/, '')] || {};
      P.push('TUYẾN PHỤ: ' + arc.n + ' (loại ' + (kp2.loai || arc.kieu_phu || '?') + '), phần ' + (pm.i + 1) + ': ' + ((arc.phan[pm.i] || {}).n || '') + '. Tuyến này gieo gắn bó/vật/hạt cho người trong dàn và đổ về cao trào của tuyến chính.');
    }
    P.push('CHẶNG: nhịp "' + nhip + '"' + (ch.lon ? ' (CẢNH LỚN' + (nhip === 'cao_trao' ? ', CAO TRÀO' : '') + ')' : '') + ', tên chặng: "' + fmt(ch.t) + '"' + (ch.canh ? ', cảnh: ' + JSON.stringify(ch.canh) : '') + '.');
    P.push('DÒNG NHỊP DỰ PHÒNG (chỉ là chức năng của chặng, hãy viết hay hơn và cụ thể hơn, giữ đúng chức năng): ' + fmt(ch.d));
    P.push('CÁC LỰA CHỌN (mỗi lựa chọn có kiểu và cơ chế cố định do bộ máy áp; bạn chỉ viết nhãn, cái giá, lời dẫn cho ĐÚNG kiểu): ' + JSON.stringify(lcs));
    P.push(stateBlock(c, st, kbc));
    if (mm.length) P.push('MANH MỐI BẮT BUỘC CÀI vào cảnh (kể như chi tiết thường, không giải thích): ' + JSON.stringify(mm));
    if (needHat) P.push('BẮT BUỘC dùng lại ít nhất MỘT hạt cũ: nhắc đúng từ khóa của hạt trong đoạn cảnh và ghi id vào "dung_hat".');
    if (bien.length) P.push('BIẾN THỂ THEO CỜ (tùy chọn nhưng nên có): với mỗi cờ trong ' + JSON.stringify(bien) + ' viết một đoạn "d" khác phản ánh việc cờ đó đã xảy ra.');
    if (opt.chinh) P.push('LƯỢT CHỈNH: bản đã viết trước đó bên dưới. Biến cố mới xảy ra từ lúc viết: ' + JSON.stringify(opt.chinh.moi) + '. Chỉ chỉnh cho khớp biến cố mới (người chết, tin mới, thay đổi vùng), giữ nguyên cấu trúc và cường độ.\nBẢN CŨ: ' + JSON.stringify(opt.chinh.cu));
    if (opt.loi && opt.loi.length) P.push('LỖI CỦA LẦN VIẾT TRƯỚC, PHẢI SỬA: ' + opt.loi.join('; '));
    P.push('ĐỘ DÀI BẮT BUỘC: đoạn "d" từ ' + (nhip === 'cao_trao' ? W().gioiHan.ct : ch.lon ? W().gioiHan.lon : W().gioiHan.thuong).join(' đến ') + ' câu (mỗi câu kết thúc bằng dấu chấm, hỏi hoặc than; mỗi câu thoại trong ngoặc kép cũng tính một câu). Viết xong hãy đếm lại.');
    P.push('YEU_CAU=' + JSON.stringify(req));
    P.push('MẪU ĐẦU RA (JSON): {"d":"đoạn cảnh","lc":[{"key":"<khóa>","label":"nhãn là động từ mạnh","mat":"một câu sự thật về cái giá"' + (needSau.length ? ',"sau":"lời dẫn sau lựa chọn, 3 đến 6 câu, phản diện đánh trả, kết bằng hậu quả rõ"' : '') + '}],"bien":[{"flag":"<cờ>","d":"..."}],"hat":[{"t":"một câu mô tả chi tiết đáng nhớ mới (câu nói, thói quen, vật, nơi)","tk":"từ khóa ngắn xuất hiện nguyên văn trong d"}],"dung_hat":"<id hạt cũ hoặc null>","manh_moi":["<id đã cài>"]}');
    return { sys: system(nhip), user: P.join('\n\n'), req, st, kind: 'chang', nhip, allowed: allowedFor(c, st, kbc, [fmt(ch.d)].concat(ch.lc.map(l => fmt(l.label)))) };
  }

  // Kiểm một đầu ra của lượt viết chặng. Trả mảng lỗi (rỗng là đạt).
  function checkChang(c, cp, out) {
    const E = [], R = cp.req, G = W().gioiHan, st = cp.st;
    if (!out || typeof out !== 'object') return ['đầu ra không phải JSON đúng mẫu'];
    const texts = [];
    const lim = R.nhip === 'cao_trao' ? G.ct : R.lon ? G.lon : G.thuong;
    if (typeof out.d !== 'string') E.push('thiếu d'); else {
      const n = sentences(out.d); if (n < lim[0] || n > lim[1]) E.push('d: ' + n + ' câu, cần ' + lim[0] + ' đến ' + lim[1]);
      E.push.apply(E, checkText(out.d, 'd', cp.allowed)); texts.push(out.d);
    }
    const lcs = Array.isArray(out.lc) ? out.lc : [];
    if (lcs.length !== R.keys.length) E.push('lc: cần đúng ' + R.keys.length + ' lựa chọn, có ' + lcs.length);
    R.keys.forEach((k, i) => {
      const x = lcs.find(y => y && y.key === k);
      if (!x) return E.push('lc: thiếu khóa ' + k);
      if (words(x.label).length < 1 || words(x.label).length > G.nhan) E.push(k + '.label: 1 đến ' + G.nhan + ' chữ');
      if (words(x.mat).length < 3 || words(x.mat).length > G.mat) E.push(k + '.mat: 3 đến ' + G.mat + ' chữ');
      E.push.apply(E, checkText(x.label, k + '.label', cp.allowed)); E.push.apply(E, checkText(x.mat, k + '.mat', cp.allowed)); texts.push(x.label, x.mat);
      if (R.can_sau.indexOf(k) >= 0) {
        const n = sentences(x.sau || ''); if (n < G.sau[0] || n > G.sau[1]) E.push(k + '.sau: ' + n + ' câu, cần ' + G.sau[0] + ' đến ' + G.sau[1]);
        E.push.apply(E, checkText(x.sau, k + '.sau', cp.allowed)); texts.push(x.sau || '');
      }
    });
    if (lcs.some(y => y && R.keys.indexOf(y.key) < 0)) E.push('lc: có khóa lạ');
    (out.bien || []).forEach((b, i) => { if (!b || R.bien_flags.indexOf(b.flag) < 0) E.push('bien[' + i + ']: cờ lạ'); else { E.push.apply(E, checkText(b.d, 'bien.' + b.flag, cp.allowed)); const n = sentences(b.d || ''); if (n < lim[0] || n > lim[1]) E.push('bien.' + b.flag + ': ' + n + ' câu'); texts.push(b.d || ''); } });
    R.manh_moi.forEach(m => {
      if ((out.manh_moi || []).indexOf(m.id) < 0) E.push('chưa khai đã cài manh mối ' + m.id);
      else if (common(m.y, out.d || '') < 3) E.push('manh mối ' + m.id + ' chưa thấy trong đoạn cảnh (cần nhắc rõ: ' + m.y + ')');
    });
    if (R.can_hat) {
      const h = (c.story.ai.hat || []).find(x => x.id === out.dung_hat);
      if (!h) E.push('chưa dùng lại hạt cũ (dung_hat phải là một id trong ' + R.hat_ids.join(',') + ')');
      else if (lower(out.d || '').indexOf(lower(h.tk)) < 0) E.push('hạt ' + h.id + ': từ khóa "' + h.tk + '" không có trong đoạn cảnh');
    }
    const hs = Array.isArray(out.hat) ? out.hat : [];
    if (hs.length > G.hat) E.push('hat: tối đa ' + G.hat);
    hs.forEach((h, i) => { if (!h || !h.t || !h.tk) E.push('hat[' + i + '] thiếu t hoặc tk'); else { E.push.apply(E, checkText(h.t, 'hat.t', cp.allowed)); if (lower(out.d || '').indexOf(lower(h.tk)) < 0 && !(out.lc || []).some(l => lower(l.sau || '').indexOf(lower(h.tk)) >= 0)) E.push('hat[' + i + ']: từ khóa không xuất hiện trong chữ'); } });
    E.push.apply(E, checkXung(c, st, texts));
    return E;
  }

  // ---------------------------------------------------------------- hàng đợi
  const Q = [], INFL = {}; let running = 0;
  const MAXRUN = 2;
  const WAIT = { key: null, t0: 0, held: false };
  function aiwEmitWait(on_) { aiwEmitWait.last = on_; TT.bus.emit('aiwait', { on: on_, left: on_ ? Math.max(0, cfg().chuaMax - (aiw.clock() - WAIT.t0) / 1000) : 0 }); }

  function pump() {
    while (running < MAXRUN && Q.length) {
      Q.sort((a, b) => a.prio - b.prio || a.seq - b.seq);
      const job = Q.shift(); running++; INFL[job.key] = job; job.state = 'chay';
      let fin = false;
      const done = () => { if (fin) return; fin = true; running--; delete INFL[job.key]; job.state = 'xong'; releaseIf(job.key); pump(); };
      try { runJob(job, done); } catch (e) { console.warn('aiw job lỗi', e); done(); }
    }
  }
  let SEQ = 0;
  function enqueue(c, kind, key, prio, extra) {
    if (INFL[key] || Q.some(j => j.key === key)) { const j = INFL[key] || Q.find(x => x.key === key); if (prio < j.prio) j.prio = prio; return j; }
    const job = Object.assign({ kind, key, prio, cid: c.id, seq: ++SEQ, state: 'doi' }, extra || {});
    Q.push(job); pump(); return job;
  }
  const pending = key => !!(INFL[key] || Q.some(j => j.key === key));
  function releaseIf(key) {
    if (WAIT.held && WAIT.key && !pendingAnyFor(WAIT.key)) release();
  }
  const pendingAnyFor = key => pending(key) || pending('chinh:' + key) || pending('cham:' + key);
  function release() { if (!WAIT.held) return; WAIT.held = false; WAIT.key = null; TT.time.hold = false; aiwEmitWait(false); }

  // Một lượt hỏi có kiểm: gọi, phân tích JSON, kiểm; sai thì viết lại MỘT lần kèm lỗi; blocked thì dừng ngay.
  // done({ ok, out, model, pid, why })
  function ask(c, job, tier, build, check, cb) {
    let attempt = 0;
    const once = loi => {
      const cp = build(loi); const pid = 'p' + (hash32(cp.sys + cp.user) % 1679616).toString(36);
      const h = pushHist({ key: job.key, kind: job.kind, tier, sys: cp.sys, user: cp.user, pid, t: aiw.clock(), att: attempt, raw: '', errs: [], ok: false, model: '', redo: !!job.redo });
      callProvider(c, tier, cp.sys, cp.user, r => {
        h.model = r.model || ''; h.raw = r.text || ''; h.err = r.err || r.chan || '';
        if (r.chan) { h.errs = ['bị bộ lọc an toàn chặn: ' + r.chan]; return cb({ ok: false, why: 'chan', pid }); }
        if (!r.ok) { h.errs = ['lỗi nhà cung cấp: ' + (r.err || '') + (r.msg ? ' ' + r.msg : '')]; return cb({ ok: false, why: r.err === 'han_muc' ? 'han_muc' : r.err === 'khoa' ? 'khoa' : 'loi', pid, errs: [(r.err || '') + ' ' + String(r.msg || '').slice(0, 160)] }); }
        const out = parseJson(r.text); const E = out ? check(out, cp) : ['đầu ra không phải JSON hợp lệ'];
        h.errs = E;
        if (!E.length) { h.ok = true; return cb({ ok: true, out, model: r.model, pid, cp }); }
        if (attempt === 0) { attempt++; return once(E); }
        cb({ ok: false, why: 'kiem', errs: E, pid });
      });
    };
    once(null);
  }

  function runJob(job, done) {
    const c = TT.player(); if (!c || c.id !== job.cid || !c.story) return done();
    ({ chang: jChang, chinh: jChinh, kich_ban: jKichBan, hoso: jHoso, kyuc: jKyuc })[job.kind](c, job, done);
  }

  // ---- (c) viết trọn một chặng (và (d) chỉnh)
  function applyRec(c, job, r, cp, tier, extra) {
    const out = r.out, A = AI(c, true), rec = { ok: 1, d: out.d.trim(), dneu: (out.bien || []).map(b => ({ flag: b.flag, d: b.d.trim() })), lc: {}, hat: [], mm: out.manh_moi || [], model: r.model, pid: r.pid, tier, m: TT.world.months };
    (out.lc || []).forEach(l => { rec.lc[l.key] = { label: l.label.trim(), mat: l.mat.trim(), sau: l.sau ? l.sau.trim() : undefined }; });
    (out.hat || []).forEach(h => { const id = 'h' + (++A.hn); A.hat.push({ id, t: h.t.trim(), tk: h.tk.trim(), arc: job.arc, chang: job.ch, m: TT.world.months }); rec.hat.push(id); });
    if (extra) Object.assign(rec, extra);
    setRec(c, job.arc, job.ch, rec); return rec;
  }
  function jChang(c, job, done) {
    const arc = TT.story.arcOf(job.arc), ch = arc && arc.chang[job.ch], old = recOf(c, job.arc, job.ch);
    if (!arc || !ch || (old && (old.ok || old.fb) && !job.redo)) return done();
    const nhip = (TT.kb.phanOf(arc, job.ch) || {}).nhip, tier = nhip === 'cao_trao' ? 'lon' : 'nho';
    const st0 = c.story.arcs[arc.id]; if (!st0) return done();
    ask(c, job, tier, loi => composeChang(c, arc, job.ch, { loi }), (out, cp) => checkChang(c, cp, out), r => {
      if (job.abandoned) return done();
      if (!r.ok) { setRec(c, job.arc, job.ch, { fb: r.why, errs: (r.errs || []).slice(0, 3), m: TT.world.months, pid: r.pid }); lo(c, job.key, r.why + (r.errs ? ': ' + r.errs[0] : '')); return done(); }
      const rec = applyRec(c, job, r, r.cp, tier);
      if (nhip === 'cao_trao') {
        job.cham = true; return enqueueCham(c, job, rec, r.cp, done);
      }
      done();
    });
  }
  // (e) tự chấm cao trào: lượt nhỏ; không đạt thì viết lại một lần bằng tầng lớn (kèm lời chê), rồi dùng bản đó nếu qua kiểm chữ.
  function enqueueCham(c, job, rec, cp, done) {
    const cjob = { kind: 'cham', key: 'cham:' + job.key, arc: job.arc, ch: job.ch, cid: job.cid, redo: false };
    INFL[cjob.key] = cjob;
    jCham(c, cjob, () => { delete INFL[cjob.key]; done(); }, rec, cp);
  }
  function jCham(c, job, done, rec, cp) {
    const build = () => ({ sys: 'Bạn là biên tập viên khó tính của game tu tiên. Chấm đoạn cao trào theo danh sách kiểm. Chỉ trả JSON {"dat":true|false,"loi":["..."]}. "dat" chỉ true khi đạt TẤT CẢ mục.', user: 'DANH SÁCH KIỂM:\n- ' + W().kiem.join('\n- ') + '\n\nĐOẠN CẦN CHẤM:\n' + JSON.stringify({ d: rec.d, lc: rec.lc }) });
    ask(c, job, 'nho', build, out => (typeof out.dat === 'boolean' ? [] : ['thiếu dat']), r => {
      if (!r.ok || r.out.dat) { if (r.ok) rec.cham = 1; return done(); }
      rec.cham = 0; const loi = (r.out.loi || []).slice(0, 5).map(String);
      if (job.abandoned) return done();
      const rj = { kind: 'chang', key: job.key.replace('cham:', ''), arc: job.arc, ch: job.ch, cid: job.cid, redo: true };
      ask(c, rj, 'lon', l => composeChang(c, TT.story.arcOf(job.arc), job.ch, { loi: loi.concat(l || []) }), (out, cp2) => checkChang(c, cp2, out), r2 => {
        if (r2.ok && !rj.abandoned) { const nr = applyRec(c, rj, r2, r2.cp, 'lon', { cham: 2, viet_lai: 1 }); nr.hat = rec.hat.concat(nr.hat); }
        done();
      });
    });
  }
  // (d) chỉnh nhỏ theo biến cố mới, trước cao trào
  function jChinh(c, job, done) {
    const arc = TT.story.arcOf(job.arc), rec = recOf(c, job.arc, job.ch);
    if (!arc || !rec || !rec.ok || rec.chinh) return done();
    const moi = c.log.filter(e => e.m >= rec.m && e.cls && e.cls !== '' && e.cat !== 'dev').slice(-8).map(e => e.t);
    if (!moi.length) { rec.chinh = 1; return done(); }
    const cu = { d: rec.d, lc: rec.lc };
    ask(c, job, 'nho', l => composeChang(c, arc, job.ch, { chinh: { moi, cu }, loi: l }), (out, cp) => checkChang(c, cp, out), r => {
      rec.chinh = 1;
      if (r.ok && !job.abandoned) { const A = AI(c, true); const nr = applyRec(c, job, r, r.cp, 'nho', { chinh: 1, cham: rec.cham }); nr.hat = rec.hat.concat(nr.hat); } else if (!r.ok) lo(c, job.key, 'chinh ' + r.why);
      done();
    });
  }

  // ---- (a) cụ thể hóa kịch bản ở A1
  function composeKichBan(c, loi) {
    const kbc = kbcOf(c), kh = K().khuon[kbc.khuon], B = kh.bay_manh, st = null;
    const req = { loai: 'kich_ban', vet: B.vet_thuong.map(v => v.id), muon: B.muon.map(v => v.id), vat: kh.soi.chinh.vat.map(v => v.id), vat_guong: kh.soi.phu[0].vat.map(v => v.id), vat_su: kh.soi.phu[1].vat.map(v => v.id), lat: kh.lat.map(v => v.id), ra_mat: B.bong_toi.ra_mat.length, noi_cam: kh.noi.cam };
    const P = ['=== YÊU CẦU: CỤ THỂ HÓA KỊCH BẢN CỦA ĐỜI NÀY TỪ KHUÔN ===', 'KHUÔN: ' + kh.ten + ' (' + kh.logline + '). Câu hỏi trung tâm: ' + kh.cau_hoi_trung_tam,
      'CÁC PHƯƠNG ÁN (chọn theo xuất thân, dàn và vùng thật; chọn id):\n- vet: ' + JSON.stringify(B.vet_thuong.map(v => ({ id: v.id, xuat_than: v.xt, y: v.canh }))) + '\n- muon: ' + JSON.stringify(B.muon.map(v => ({ id: v.id, cho: v.cho, y: v.t }))) +
      '\n- vat (sợi chính): ' + JSON.stringify(kh.soi.chinh.vat.map(v => v.id)) + '\n- vat_guong: ' + JSON.stringify(kh.soi.phu[0].vat.map(v => v.id)) + '\n- vat_su: ' + JSON.stringify(kh.soi.phu[1].vat.map(v => v.id)) +
      '\n- lat (cú lật ẩn): ' + JSON.stringify(kh.lat.map(v => ({ id: v.id, ten: v.ten, kieu: v.kieu, phan_no: v.phan_no, su_that: v.no.biet }))) + '\n- ra_mat (chỉ số 0 đến ' + (B.bong_toi.ra_mat.length - 1) + ', cách kẻ bóng tối ra mắt): ' + JSON.stringify(B.bong_toi.ra_mat) + '\n- noi_cam: ' + JSON.stringify(kh.noi.cam),
      'LỜI DẶN CỦA KHUÔN: chọn phương án theo xuất thân và dàn thật; ' + B.bong_toi.cach_chon,
      'TRẠNG THÁI THẬT:\nNgười chơi ' + c.name + ', xuất thân ' + (c.origin2 || '?') + (c.sect ? ', thuộc ' + (TT.fac.get(c.sect.id) || {}).n : ', chưa có tông') + '. Dàn: ' + ROLES.map(r => r + '=' + (nameOfRole(c, null, r) || '(chưa có)')).join('; ') + '.\nThế lực: ' + theLuc(c).map(x => x.n).join('; ') + '. Nơi: ' + noiChon(c).join('; ') + '. Biến cố vùng: ' + bienCo(c).join(' | '),
      loi && loi.length ? 'LỖI LẦN TRƯỚC, PHẢI SỬA: ' + loi.join('; ') : '',
      'YEU_CAU=' + JSON.stringify(req),
      'MẪU ĐẦU RA (JSON): {"logline":"một câu về đời này","vet":"<id>","muon":"<id>","vat":"<id>","vat_guong":"<id>","vat_su":"<id>","lat":"<id>","ra_mat":0,"noi_cam":"<một trong noi_cam>","bang6":["sáu dòng, mỗi phần một dòng, không tiết lộ cú lật"],"ke_hoach":"kế hoạch lật ẩn: cài manh mối ở đâu, nổ ở phần nào","ly":"một dòng vì sao chọn vậy"}'];
    return { sys: system('cao_trao'), user: P.filter(Boolean).join('\n\n'), req, kind: 'kich_ban', allowed: allowedFor(c, null, kbc) };
  }
  function jKichBan(c, job, done) {
    const S = c.story, kbc = S.kbc; if (!kbc || kbc.ai) return done();
    const kh = K().khuon[kbc.khuon];
    const mkOv = o => ({ vet: o.vet, muon: o.muon, vat: o.vat, vat_guong: o.vat_guong, vat_su: o.vat_su, lat: o.lat, ra_mat: typeof o.ra_mat === 'number' ? o.ra_mat : undefined, noi_cam: o.noi_cam });
    ask(c, job, 'lon', loi => composeKichBan(c, loi), (out, cp) => {
      const E = [], R = cp.req;
      ['vet', 'muon', 'vat', 'vat_guong', 'vat_su', 'lat'].forEach(k => { if (R[k].indexOf(out[k]) < 0) E.push(k + ': id lạ "' + out[k] + '"'); });
      if (!(Number.isInteger(out.ra_mat) && out.ra_mat >= 0 && out.ra_mat < R.ra_mat)) E.push('ra_mat: chỉ số sai');
      if (R.noi_cam.indexOf(out.noi_cam) < 0) E.push('noi_cam: không thuộc danh sách');
      if (!Array.isArray(out.bang6) || out.bang6.length !== 6) E.push('bang6: cần đúng 6 dòng');
      ['logline', 'ke_hoach'].forEach(k => { if (typeof out[k] !== 'string' || !out[k].trim()) E.push('thiếu ' + k); });
      if (E.length) return E;
      [out.logline, out.ke_hoach, out.ly || ''].concat(out.bang6).forEach((t, i) => { E.push.apply(E, checkText(t, 'k' + i, cp.allowed)); });
      if (E.length) return E;
      const nk = cuThe(c, kh, mkOv(out)); nk.arc = kbc.arc; nk.v = kbc.v + 1; // kiểm bằng story-lint của kịch bản cụ thể
      const le = TT.kb.lintKbc(nk); if (le.length) return ['kịch bản cụ thể không qua story-lint: ' + le[0]];
      cp.nk = nk; return [];
    }, r => {
      if (!r.ok) { kbc.ai = { fb: r.why, m: TT.world.months }; lo(c, job.key, r.why + (r.errs ? ': ' + r.errs[0] : '')); return done(); }
      const o = r.out, nk = r.cp.nk, start = !!(kbc.mo && kbc.mo[1]) || !!S.arcs[kbc.arc];
      nk.ai = { logline: o.logline.trim(), bang6: o.bang6.map(s => s.trim()), ke_hoach: o.ke_hoach.trim(), ly: (o.ly || '').trim(), model: r.model, pid: r.pid, m: TT.world.months, doi: !start };
      nk.chon.ly.ai = nk.ai.ly;
      if (!start) { nk.chuoi = kbc.chuoi; nk.biet = kbc.biet; nk.mo = kbc.mo; S.kbc = nk; } else kbc.ai = nk.ai; // đã bắt đầu thì giữ kịch bản cũ, chỉ ghi logline
      done();
    });
  }
  const cuThe = (c, kh, ov) => TT.kb.cuThe(c, kh, ov);

  // ---- (b) hồ sơ người trong dàn
  function jHoso(c, job, done) {
    const S = c.story, kbc = S.kbc, A = AI(c, true); if (!kbc) return done();
    const st = S.arcs[kbc.arc], need = ROLES.filter(r => TT.dan.get(c, kbc.roleDan[r]) && !A.hoso[r]);
    if (!need.length) return done();
    const rows = need.map(r => { const o = TT.dan.get(c, kbc.roleDan[r]); return { vai: r, ten: o.name, gioi: o.gender === 'nu' ? 'nữ' : 'nam', tuoi: TT.age(o), canh_gioi: D.REALM_NAMES[Math.min(o.realm, 6)], tinh_cach: o.personality, quan_he_voi_ban: TT.kb.xung(c, kbc.roleDan[r]).qh }; });
    const allowed = allowedFor(c, st, kbc, rows.map(r => r.ten));
    const build = loi => ({ sys: W().camNang, user: '=== YÊU CẦU: VIẾT HỒ SƠ NGƯỜI TRONG DÀN ===\nVới mỗi người, viết hồ sơ ngắn (mỗi trường tối đa 25 chữ, bằng chữ, không chữ số) để giữ nhất quán suốt đời: giọng nói, thói quen, ước muốn, nỗi sợ, một vật mang theo. Chỉ dùng tên có sẵn.\n' + JSON.stringify(rows) + '\n' + stateBlock(c, st, kbc) + (loi && loi.length ? '\nLỖI LẦN TRƯỚC: ' + loi.join('; ') : '') + '\nYEU_CAU=' + JSON.stringify({ loai: 'hoso', vai: need }) + '\nMẪU ĐẦU RA: {"hs":{"<vai>":{"giong":"","thoi_quen":"","uoc":"","so":"","vat":""}}}', allowed });
    ask(c, job, 'nho', build, (out, cp) => {
      const E = []; need.forEach(r => { const h = out.hs && out.hs[r]; if (!h) return E.push('thiếu hồ sơ ' + r); ['giong', 'thoi_quen', 'uoc', 'so', 'vat'].forEach(k => { if (words(h[k]).length < 1 || words(h[k]).length > 30) E.push(r + '.' + k + ': 1 đến 30 chữ'); else E.push.apply(E, checkText(h[k], r + '.' + k, cp.allowed)); }); });
      return E;
    }, r => {
      if (!r.ok) { need.forEach(rl => { A.hoso[rl] = { fb: r.why, ten: rows.find(x => x.vai === rl).ten }; }); lo(c, job.key, r.why); return done(); }
      need.forEach(rl => { const h = r.out.hs[rl]; A.hoso[rl] = { ten: rows.find(x => x.vai === rl).ten, giong: h.giong.trim(), thoi_quen: h.thoi_quen.trim(), uoc: h.uoc.trim(), so: h.so.trim(), vat: h.vat.trim(), model: r.model, pid: r.pid, m: TT.world.months }; });
      done();
    });
  }

  // ---- (f) cuối phần: ký ức tích lũy và hạt mới
  function jKyuc(c, job, done) {
    const S = c.story, kbc = S.kbc, A = AI(c, true); if (!kbc) return done();
    const st = S.arcs[kbc.arc], i = job.phan, P = kbc.phan[i - 1]; if (!P) return done();
    const rows = P.chang.map(x => { const r = recOf(c, kbc.arc, x.id); return { chang: x.id, d: r && r.d || '' }; });
    const chon = kbc.chuoi[i] || {};
    const allowed = allowedFor(c, st, kbc, [A.ky]);
    const build = loi => ({ sys: W().camNang, user: '=== YÊU CẦU: CẬP NHẬT KÝ ỨC TÍCH LŨY SAU PHẦN ' + i + ' ===\nViết lại bản tóm tắt đời (tối đa ' + W().gioiHan.kyuc + ' chữ, bằng chữ không chữ số, giọng lạnh, chỉ sự thật đã xảy ra) gồm ký ức cũ và những gì vừa xảy ra ở phần ' + i + '. Và ghi 1 đến ' + W().gioiHan.hat + ' hạt mới (chi tiết đáng nhớ: một câu nói, một thói quen, một vật, một nơi) đã xuất hiện trong chữ của phần này; "tk" là từ khóa ngắn nằm nguyên văn trong chữ.\nKÝ ỨC CŨ: ' + (A.ky || '(chưa có)') + '\nPHẦN VỪA XONG: ' + JSON.stringify(rows) + '\nLỰA CHỌN Ở CAO TRÀO: ' + JSON.stringify(chon) + '\n' + stateBlock(c, st, kbc) + (loi && loi.length ? '\nLỖI LẦN TRƯỚC: ' + loi.join('; ') : '') + '\nYEU_CAU=' + JSON.stringify({ loai: 'kyuc', phan: i }) + '\nMẪU ĐẦU RA: {"ky_uc":"...","hat":[{"t":"...","tk":"..."}]}', allowed });
    ask(c, job, 'lon', build, (out, cp) => {
      const E = []; if (typeof out.ky_uc !== 'string' || !out.ky_uc.trim()) return ['thiếu ky_uc'];
      if (words(out.ky_uc).length > W().gioiHan.kyuc) E.push('ky_uc: quá ' + W().gioiHan.kyuc + ' chữ');
      E.push.apply(E, checkText(out.ky_uc, 'ky_uc', cp.allowed));
      const h = Array.isArray(out.hat) ? out.hat : []; if (h.length < 1 || h.length > W().gioiHan.hat) E.push('hat: cần 1 đến ' + W().gioiHan.hat);
      h.forEach((x, k) => { if (!x || !x.t || !x.tk) E.push('hat[' + k + '] thiếu t hoặc tk'); else E.push.apply(E, checkText(x.t, 'hat.t', cp.allowed)); });
      return E;
    }, r => {
      if (!r.ok) { lo(c, job.key, r.why); return done(); }
      A.ky = r.out.ky_uc.trim(); A.kym = TT.world.months;
      r.out.hat.forEach(h => { A.hat.push({ id: 'h' + (++A.hn), t: h.t.trim(), tk: h.tk.trim(), phan: i, m: TT.world.months }); });
      if (A.hat.length > 24) A.hat.splice(0, A.hat.length - 24);
      done();
    });
  }

  // ---------------------------------------------------------------- móc vào game
  // Việc cần có cho chặng hiện tại và các chặng cùng phần: lên lịch (idempotent). Gọi mỗi tháng và lúc người chơi vừa chọn.
  function planArc(c, arc, st, prio0) {
    const pm = arc.phan && TT.kb.phanOf(arc, st.st); if (!pm) return;
    const P = arc.phan[pm.i], ids = [].concat(P.moc, P.leo || [], P.cao_trao, P.treo || []).filter(id => id && arc.chang[id]);
    const cur = ids.indexOf(st.st);
    ids.forEach((id, k) => {
      if (k < cur) return;
      const r = recOf(c, arc.id, id); if (r && (r.ok || r.fb)) return;
      const isCT = id === P.cao_trao;
      enqueue(c, 'chang', arc.id + ':' + id, isCT ? 2 : 1 + (k - cur) * 0.1 + prio0, { arc: arc.id, ch: id });
    });
  }
  function tick(c) {
    if (!on(c)) return;
    const S = c.story, A = AI(c, true);
    if (S.kbc && !S.kbc.ai) enqueue(c, 'kich_ban', 'kb:' + c.id, 0, {});
    const kbc = S.kbc; // kịch bản có thể vừa được thay (cụ thể hóa bằng AI)
    if (kbc && kbc.ai) {
      if (ROLES.some(r => TT.dan.get(c, kbc.roleDan[r]) && !A.hoso[r])) enqueue(c, 'hoso', 'hoso:' + c.id, 3, {});
      Object.keys(S.arcs).forEach(id => { const arc = TT.story.arcOf(id), st = S.arcs[id]; if (eligibleArc(arc) && st.st && !st.ket) planArc(c, arc, st, 0); });
    }
  }
  function onChoose(c, arc, st, ch, lc) {
    if (!on(c) || !eligibleArc(arc)) return;
    const S = c.story, kbc = S.kbc; if (!kbc) return;
    const nexts = lc.wheel ? lc.wheel.vung.map(z => z.toi) : [lc.toi];
    const pm = arc.phan && TT.kb.phanOf(arc, st.st);
    nexts.forEach(id => {
      if (!id || /^ket:/.test(id) || !arc.chang[id]) return;
      const r = recOf(c, arc.id, id);
      if (!(r && (r.ok || r.fb))) enqueue(c, 'chang', arc.id + ':' + id, 0.5, { arc: arc.id, ch: id });
      const nm = TT.kb.phanOf(arc, id); // sắp vào cao trào: lượt chỉnh theo biến cố mới
      if (nm && nm.nhip === 'cao_trao' && r && r.ok && !r.chinh) enqueue(c, 'chinh', 'chinh:' + arc.id + ':' + id, 0.4, { arc: arc.id, ch: id });
    });
    if (arc.id === kbc.arc && pm && pm.nhip === 'treo') enqueue(c, 'kyuc', 'kyuc:' + (pm.i + 1), 2, { phan: pm.i + 1 });
  }

  // Giữ hộp chặng: gọi MỘT lần ngay trước khi dựng hộp. Cao trào chưa có chữ mà việc còn chạy thì dừng thời gian chờ (≤ chuaMax giây).
  // Chặng nhỏ chưa có chữ thì dùng dự phòng ngay (đánh dấu để chữ về muộn không đổi hộp đã hiện).
  function hold(c, arc, st, ch, force) { // force: lệnh nhảy của 🛠, chặng nào cũng chờ như cao trào
    if (!on(c) || !eligibleArc(arc) || !st.st) return false;
    const key = arc.id + ':' + st.st, pm = arc.phan && TT.kb.phanOf(arc, st.st), ct = !!force || !!(pm && pm.nhip === 'cao_trao');
    if (!(WAIT.held && WAIT.key === key)) planArc(c, arc, st, 0); // chưa xếp thì xếp ngay (nhà cung cấp nhanh có thể xong trước khi hộp hiện)
    const rec = recOf(c, arc.id, st.st);
    if (WAIT.held && WAIT.key === key) {
      if (aiw.clock() - WAIT.t0 >= cfg().chuaMax * 1000) { giveUp(c, key, arc.id, st.st); return false; }
      return pendingAnyFor(key);
    }
    if (rec && (rec.ok || rec.fb) && !(ct && pendingAnyFor(key))) return false;
    if (!ct) { markFb(c, key, arc.id, st.st, 'chua_kip'); return false; }
    if (!pendingAnyFor(key)) { enqueue(c, 'chang', key, 0, { arc: arc.id, ch: st.st }); if (!pendingAnyFor(key)) return false; }
    WAIT.key = key; WAIT.t0 = aiw.clock(); WAIT.held = true; TT.time.hold = true; aiwEmitWait(true);
    return true;
  }
  function markFb(c, key, arcId, chId, why) {
    const j = INFL[key] || Q.find(x => x.key === key); if (j) j.abandoned = true;
    const r = recOf(c, arcId, chId); if (!(r && (r.ok || r.fb))) { setRec(c, arcId, chId, { fb: why, m: TT.world.months }); lo(c, key, why); }
    Q.splice(0, Q.length, ...Q.filter(x => x.key !== key));
  }
  function giveUp(c, key, arcId, chId) {
    ['', 'chinh:', 'cham:'].forEach(p => { const j = INFL[p + key] || Q.find(x => x.key === p + key); if (j) j.abandoned = true; });
    const r = recOf(c, arcId, chId); if (!(r && r.ok)) { setRec(c, arcId, chId, { fb: 'het_gio', m: TT.world.months }); lo(c, key, 'het_gio'); }
    release();
  }
  // Giao diện gọi định kỳ khi đang chờ: quá giờ thì bỏ chờ và dùng dự phòng.
  function poll() {
    if (!WAIT.held) return false;
    const c = TT.player(); if (!c) { release(); return false; }
    if (aiw.clock() - WAIT.t0 >= cfg().chuaMax * 1000) { const [a, ch] = [WAIT.key.slice(0, WAIT.key.lastIndexOf(':')), WAIT.key.slice(WAIT.key.lastIndexOf(':') + 1)]; giveUp(c, WAIT.key, a, ch); return true; }
    aiwEmitWait(true); return false;
  }

  // Chữ AI hiện cho chặng (đọc thuần): trả bản sao nông của chặng với d, d_neu, nhãn, cái giá, lời dẫn thay bằng chữ AI. Không có (hoặc tắt) thì trả chính ch.
  function view(c, arc, ch, chId) {
    if (!on(c) || !eligibleArc(arc)) return ch;
    const id = chId || Object.keys(arc.chang).find(k => arc.chang[k] === ch), rec = id && recOf(c, arc.id, id);
    if (!rec || !rec.ok) return ch;
    return Object.assign({}, ch, {
      d: rec.d, d_pham: undefined, d_neu: rec.dneu && rec.dneu.length ? rec.dneu : undefined,
      lc: ch.lc.map(l => { const r = rec.lc[l.key]; return r ? Object.assign({}, l, { label: r.label, mat: r.mat, sau: r.sau || l.sau, sau_neu: r.sau ? undefined : l.sau_neu }) : l; })
    });
  }

  // ---------------------------------------------------------------- bảng 🛠 và thống kê
  function stats(c) {
    const A = c && AI(c), t = tot();
    return { doi: { n: A ? A.n : 0, tin: A ? A.tin : 0, tout: A ? A.tout : 0 }, tong: { n: t.n, tin: t.tin, tout: t.tout, loi: t.loi, chan: t.chan }, quota: cfg().quota, lo: A ? A.lo.slice(-10) : [], hat: A ? A.hat.length : 0, hoso: A ? Object.keys(A.hoso).length : 0, hangDoi: Q.length + running };
  }
  function danhDau(i, kind) { // 'dat' lưu thành mẫu cho lần sau; 'viet_lai' xếp viết lại
    const h = HIST[i]; if (!h) return false;
    if (kind === 'dat') {
      const out = parseJson(h.raw); if (!out || !h.ok || h.kind !== 'chang') return false;
      const L = dat(); L.push({ kind: 'chang', nhip: ((/"nhip":"([a-z_]+)"/.exec(h.user) || [])[1]) || '', d: out.d, lc: out.lc, key: h.key, model: h.model, pid: h.pid, m: TT.world.months }); if (L.length > 40) L.shift();
      h.dat = true; return lsSet(DAT_KEY, L);
    }
    if (kind === 'viet_lai') {
      const c = TT.player(), m = /^(.+):([^:]+)$/.exec(h.key); if (!c || !m || h.kind !== 'chang') return false;
      const r = recOf(c, m[1], m[2]); if (r) delete c.story.ai.txt[m[1]][m[2]];
      const j = enqueue(c, 'chang', h.key, 0, { arc: m[1], ch: m[2], redo: true }); return !!j;
    }
    return false;
  }
  const exportDat = () => JSON.stringify({ v: 1, mau: dat() }, null, 1);

  // Thử kết nối (nút trong Cài đặt, người chơi tự bấm; không dùng trong kiểm thử): trả cb({ ok, msg })
  function thu(cb) {
    const pr = cfg().provider, P = PROV[pr], key = getKey(pr); if (!key) return cb({ ok: false, msg: 'Chưa nhập khóa.' });
    const model = cfg().models[pr].nho;
    aiw.transport(P.req(model, 'Trả JSON {"ok":true}', 'ping', 'nho', key), r => { const o = P.parse(r); cb({ ok: o.ok, msg: o.ok ? 'Gọi được ' + model + '.' : (o.chan ? 'Bị chặn: ' + o.chan : 'Lỗi ' + (o.err || '') + ' ' + (o.msg || '')) }); });
  }

  const aiw = TT.aiw = {
    // cài đặt
    cfg, setCfg, getKey, setKey, hasKey: () => !!getKey(), PROV, parseJson, tot,
    reset() { CFG = null; KEYS = null; TOT = null; Q.length = 0; running = 0; Object.keys(INFL).forEach(k => delete INFL[k]); HIST.length = 0; release(); },
    transport: fetchTransport,
    sleep: (ms, fn) => setTimeout(fn, ms),
    clock: () => Date.now(),
    // đọc
    on, view, stats, recOf, hist: () => HIST, dat, exportDat, pending, waiting: () => (WAIT.held ? { key: WAIT.key, left: Math.max(0, cfg().chuaMax - (aiw.clock() - WAIT.t0) / 1000) } : null),
    compose: composeChang, composeKichBan, check: checkChang, checkText, unknownNames, allowedWords, checkXung, sentences,
    // ghi
    tick, onChoose, hold, poll, enqueue, danhDau, thu, release,
    kyUcChon: (c, i) => enqueue(c, 'kyuc', 'kyuc:' + i, 2, { phan: i })
  };
})();
