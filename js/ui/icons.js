// Biểu tượng pixel 16x16 cho mọi vật phẩm, sinh bằng mã (không tệp ảnh). Hình theo loại, viền theo phẩm, màu theo thuộc tính,
// trang bị lấy hình theo ô (kiếm, giáp, mũ, pháp bảo) và độ sáng theo chất lượng; pháp bảo bản mệnh có hào quang.
// TT.ui.icon(id, px) -> canvas px x px (mặc định 32); TT.ui.iconSpec(id) -> { kind, tier, elem, ... } để kiểm tra.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data;

  const TIER = ['#9aa7b6', '#4aa3ff', '#f0a840', '#e8497c'];
  const ELEM = { 'Kim': '#d8dde6', 'Mộc': '#58b36a', 'Thủy': '#3f8ee0', 'Hỏa': '#e0674f', 'Thổ': '#b08a4a', 'Lôi': '#d6d85a', 'Phong': '#8fd6c4', 'Băng': '#9fdcf0', 'Dương': '#f0c24a', 'Âm': '#8a6fc0' };
  const CRAFTCOL = { kiem: '#d8553a', khi: '#e8963a', dan: '#58b36a', bua: '#e8c84a' };
  const DK = '#1a2230';
  // cấu hình riêng cho vài món gốc (màu, hình)
  const BASE = {
    hoi_xuan_dan: { kind: 'dan', col: '#58b36a' }, ngung_than_dan: { kind: 'dan', col: '#4aa3ff' }, ho_mach_dan: { kind: 'dan', col: '#e0674f' },
    tu_khi_dan: { kind: 'pill', col: '#4aa3ff' }, pha_canh_dan: { kind: 'pill', col: '#f0a840' },
    ho_than_bua: { kind: 'bua', col: '#4a8ed8' }, thoat_than_bua: { kind: 'bua', col: '#58b36a' }, cong_kich_bua: { kind: 'bua', col: '#d8302a' },
    linh_thao: { kind: 'thao' }, quang_thach: { kind: 'khoang', ore: 0 }, tinh_thiet: { kind: 'khoang', ore: 1 }, huyen_thiet: { kind: 'khoang', ore: 2 }, thien_thach: { kind: 'khoang', ore: 3 },
    phu_giay: { kind: 'giay' }, yeu_dan: { kind: 'yeu' },
    chan_day: { kind: 'tamdac', col: '#b08a5a' }, giay_rom: { kind: 'da', col: '#c9b27a' }, thu_cu: { kind: 'giay' }, kiem_go: { kind: 'kiem', tier: 0 }, chuoi_hat: { kind: 'ngoc', tier: 0 } // vật kỷ niệm (K1)
  };

  function spec(id) {
    const d = D.ITEMS[id]; if (!d) return { kind: 'gen', tier: 0 };
    const s = { kind: 'gen', tier: d.tier || 0, elem: d.elem || null, col: null, q: d.q != null ? d.q : 0.5, relic: !!d.relic, stat: d.stat || null };
    if (BASE[id]) return Object.assign(s, BASE[id]);
    if (d.cat === 'khi') { s.kind = d.relic ? 'relic' : d.slot === 'weapon' ? 'kiem' : d.slot === 'armor' ? 'giap' : d.slot === 'helm' ? 'mu' : 'ngoc'; }
    else if (d.cat === 'lieu') { if (d.part === 'nanh') s.kind = 'nanh'; else if (d.part === 'da') s.kind = 'da'; else if (d.ore) { s.kind = 'khoang'; s.ore = d.tier; } else s.kind = 'gen'; }
    else if (d.cat === 'sach') { s.kind = 'sach'; }
    else if (d.cat === 'dac') { s.kind = 'tamdac'; s.col = CRAFTCOL[d.craft] || '#e8c84a'; }
    else if (d.cat === 'ls') { s.kind = 'ls'; }
    else if (d.cat === 'lo') { s.kind = 'lo'; }
    else if (d.cat === 'dan') { s.kind = 'dan'; s.col = '#58b36a'; }
    else if (d.cat === 'bua') { s.kind = 'bua'; s.col = '#d8302a'; }
    return s;
  }

  const cache = {};
  function base16(s) {
    const key = [s.kind, s.tier, s.elem, s.col, s.ore, s.relic ? 1 : 0, s.stat, Math.round((s.q || 0) * 4)].join('|');
    if (cache[key]) return cache[key];
    const c = document.createElement('canvas'); c.width = 16; c.height = 16; const x = c.getContext('2d');
    const R = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
    const t = TIER[Math.max(0, Math.min(3, s.tier || 0))], e = ELEM[s.elem] || s.col || '#9aa7b6', col = s.col || e;
    const hi = '#ffffff88';
    switch (s.kind) {
      case 'dan': R(5, 4, 6, 9, DK); R(6, 2, 4, 2, DK); R(6, 3, 4, 1, '#c8a060'); R(6, 5, 4, 7, col); R(7, 6, 1, 4, hi); R(6, 12, 4, 1, '#0004'); break;
      case 'pill': R(4, 5, 8, 7, DK); R(5, 4, 6, 9, DK); R(5, 6, 6, 5, col); R(6, 5, 4, 7, col); R(6, 6, 2, 2, hi); R(9, 10, 2, 1, '#0003'); break;
      case 'bua': R(4, 2, 8, 12, DK); R(5, 3, 6, 10, '#f0e0a0'); R(5, 3, 6, 1, '#d8c070'); R(7, 4, 2, 2, col); R(6, 7, 4, 1, col); R(7, 8, 2, 4, col); R(6, 11, 4, 1, col); break;
      case 'giay': R(3, 4, 10, 9, DK); R(4, 5, 8, 7, '#f4ecc8'); R(5, 7, 6, 1, '#b0a070'); R(5, 9, 5, 1, '#b0a070'); R(10, 4, 2, 2, '#c0302a'); break;
      case 'kiem': R(7, 0, 2, 11, DK); R(7, 1, 2, 9, t); R(7, 1, 1, 9, hi); R(4, 10, 8, 2, DK); R(5, 10, 6, 1, '#c8a060'); R(7, 12, 2, 3, '#7a4b2a'); R(7, 15, 2, 1, DK); break;
      case 'giap': R(2, 3, 12, 11, DK); R(3, 4, 10, 9, t); R(2, 3, 3, 3, DK); R(11, 3, 3, 3, DK); R(6, 3, 4, 2, DK); R(7, 5, 2, 7, '#0004'); R(3, 4, 10, 1, hi); R(5, 11, 6, 1, '#0003'); break;
      case 'mu': R(3, 4, 10, 9, DK); R(4, 3, 8, 8, t); R(4, 3, 8, 1, hi); R(5, 8, 6, 3, DK); R(7, 1, 2, 3, '#d8302a'); break;
      case 'ngoc': R(7, 0, 2, 4, DK); R(4, 4, 8, 10, DK); R(5, 5, 6, 8, e); R(6, 6, 2, 3, hi); R(5, 12, 6, 1, '#0004'); break;
      case 'relic': { // pháp bảo bản mệnh: quả cầu có hào quang, màu theo chỉ số
        const sc = s.stat === 'atk' ? '#e8493a' : s.stat === 'hpMax' ? '#3fcf8a' : '#a878f0';
        x.globalAlpha = 0.35; R(1, 1, 14, 14, t); R(2, 2, 12, 12, t); x.globalAlpha = 1;
        R(4, 3, 8, 10, DK); R(3, 5, 10, 6, DK); R(5, 4, 6, 8, sc); R(4, 6, 8, 4, sc); R(6, 5, 2, 3, hi); R(7, 0, 2, 2, t); R(7, 14, 2, 2, t); R(0, 7, 2, 2, t); R(14, 7, 2, 2, t); break;
      }
      case 'thao': R(7, 7, 2, 8, '#2f6a3c'); R(3, 4, 5, 3, '#58b36a'); R(8, 2, 5, 3, '#6ac87a'); R(9, 7, 4, 2, '#58b36a'); R(2, 5, 2, 1, '#2f6a3c'); R(7, 14, 2, 1, '#6a4a2a'); break;
      case 'khoang': { const oc = ['#7a8696', '#5aa0d8', '#c8a050', '#b878f0'][s.ore || 0], oh = ['#9aa7b6', '#9ad0f8', '#f0d078', '#e0b8ff'][s.ore || 0]; R(2, 8, 12, 6, DK); R(3, 6, 10, 8, oc); R(5, 3, 6, 5, oc); R(6, 3, 3, 2, oh); R(3, 6, 3, 2, oh); R(10, 10, 2, 2, oh); R(3, 13, 10, 1, '#0004'); break; }
      case 'yeu': R(4, 5, 8, 8, DK); R(5, 4, 6, 10, DK); R(5, 6, 6, 6, '#b04ad8'); R(6, 5, 4, 8, '#b04ad8'); R(6, 6, 2, 2, hi); R(7, 8, 2, 2, '#e8b0ff'); break;
      case 'nanh': R(5, 1, 6, 3, DK); R(4, 3, 8, 6, DK); R(5, 3, 6, 6, '#eee8d4'); R(6, 9, 4, 4, '#eee8d4'); R(7, 13, 2, 2, DK); R(6, 4, 1, 4, hi); R(7, 12, 2, 1, e); break;
      case 'da': R(2, 3, 12, 11, DK); R(3, 4, 10, 9, '#8a5a3a'); R(3, 4, 10, 2, '#a8704a'); R(2, 6, 2, 2, '#8a5a3a'); R(12, 8, 2, 2, '#8a5a3a'); R(5, 8, 6, 3, e); R(6, 9, 4, 1, hi); break;
      case 'sach': R(3, 1, 10, 14, DK); R(4, 2, 8, 12, ['#8a3a3a', '#2f5a8a', '#8a6b1f', '#5a2a8a'][s.tier || 0]); R(5, 2, 1, 12, '#f0e0a0'); R(7, 5, 4, 1, '#f0e0a0'); R(7, 7, 3, 1, '#f0e0a0'); R(7, 9, 4, 1, '#f0e0a0'); R(4, 13, 8, 1, '#0004'); break;
      case 'tamdac': R(2, 4, 12, 8, DK); R(3, 5, 10, 6, '#f0e0a0'); R(2, 3, 2, 10, '#8a6b3a'); R(12, 3, 2, 10, '#8a6b3a'); R(5, 6, 6, 1, '#b0a070'); R(5, 8, 5, 1, '#b0a070'); R(9, 9, 3, 3, col); R(10, 10, 1, 1, '#fff'); break;
      case 'ls': { const g = ['#6ad8d0', '#7ab4ff', '#f0c24a', '#ff7ab8'][Math.max(0, Math.min(3, s.tier))]; R(4, 3, 8, 11, DK); R(3, 5, 10, 7, DK); R(5, 4, 6, 9, g); R(4, 6, 8, 5, g); R(5, 5, 2, 3, hi); R(9, 10, 2, 2, '#0003'); R(1, 2, 1, 1, g); R(14, 11, 1, 1, g); if (s.tier >= 2) { R(13, 3, 1, 1, g); R(2, 12, 1, 1, g); } break; }
      case 'lo': R(2, 5, 12, 9, DK); R(3, 6, 10, 7, '#6a4a3a'); R(4, 3, 8, 3, DK); R(5, 4, 6, 1, '#8a6a5a'); R(5, 8, 6, 4, '#2a1a10'); R(6, 9, 4, 3, ['#ff9a3a', '#ffb23a', '#ffd23a', '#fff08a'][Math.max(0, Math.min(3, s.tier))]); R(1, 13, 14, 2, DK); break;
      default: R(4, 4, 8, 8, DK); R(5, 5, 6, 6, '#8da0b3'); R(6, 6, 2, 2, hi);
    }
    // viền phẩm (khung 16x16 mảnh)
    x.globalAlpha = 0.9; R(0, 0, 16, 1, t); R(0, 15, 16, 1, t); R(0, 0, 1, 16, t); R(15, 0, 1, 16, t); x.globalAlpha = 1;
    // chất lượng cao có điểm sáng ở góc
    const stars = s.kind === 'kiem' || s.kind === 'giap' || s.kind === 'mu' || s.kind === 'ngoc' || s.kind === 'relic' ? (s.q > 0.8 ? 2 : s.q > 0.6 ? 1 : 0) : 0;
    if (stars >= 1) R(13, 2, 1, 1, '#fff'); if (stars >= 2) { R(12, 2, 3, 1, '#fff8'); R(13, 1, 1, 3, '#fff8'); }
    return (cache[key] = c);
  }

  // Trả canvas px x px (mặc định 32), không làm mờ khi phóng.
  ui.icon = function (id, px) {
    px = px || 32;
    const c = document.createElement('canvas'); c.width = px; c.height = px; c.className = 'ico'; c.title = D.ITEMS[id] ? D.ITEMS[id].n : id;
    const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(base16(spec(id)), 0, 0, px, px);
    return c;
  };
  ui.iconSpec = spec;
})();
