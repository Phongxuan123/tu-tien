// Trang bị: 4 ô (vũ khí, mũ, giáp, pháp bảo bản mệnh). Mỗi món cộng phần trăm vào chỉ số riêng của nó (vũ khí: công kích, giáp: sinh lực tối đa,
// mũ: niệm lực), tính trên sức mạnh gốc của nhân vật. Trần 30% mỗi món theo phẩm chất; pháp bảo bản mệnh thêm tối đa 15% khi lớn lên.
// Thông số nằm ngay trong mã vật phẩm để túi đồ, chợ, thừa kế dùng được cơ chế sẵn có:
//   g|ô|phẩm|q|hệ          trang bị thường (q 0-99 là vị trí trong khoảng của phẩm)
//   r|chỉ số|phẩm|q|hệ|cấp pháp bảo bản mệnh (cấp 0-10)
//   m|bộ phận|hệ|phẩm       vật liệu từ yêu thú (nanh, da)
// D.ITEMS là Proxy: mã dạng trên tự có định nghĩa; các id cũ (kiếm sắt, kiếm tinh cương...) là mẫu với q trung bình.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data = TT.data || {};

  D.EQUIP_SLOTS = { weapon: 'Vũ khí', helm: 'Mũ', armor: 'Giáp', relic: 'Pháp bảo bản mệnh' };
  D.GEAR = {
    TIERS: ['phàm', 'linh', 'bảo', 'tiên'],
    PCT: [[0.06, 0.10], [0.13, 0.18], [0.20, 0.25], [0.26, 0.30]],   // khoảng cộng của mỗi phẩm
    REQ: [0, 1, 3, 4],                                                  // cảnh giới tối thiểu để dùng theo phẩm
    RELIC_BASE: [0.01, 0.03, 0.05, 0.07], RELIC_GROW: 0.015, RELIC_MAX: 0.15, RELIC_LV: 10,
    STAT: { weapon: 'atk', armor: 'hpMax', helm: 'nl' },
    STAT_NAME: { atk: 'công kích', hpMax: 'sinh lực tối đa', nl: 'niệm lực' },
    NAMES: {
      weapon: ['Kiếm sắt', 'Kiếm tinh cương', 'Linh kiếm', 'Tiên kiếm'],
      armor: ['Áo da yêu thú', 'Giáp linh thiết', 'Giáp tiên văn', 'Thiên y'],
      helm: ['Khăn vấn tóc', 'Mũ sắt', 'Đạo quan', 'Tiên quan']
    },
    RELIC_NAMES: {
      atk: ['Phi kiếm nhỏ', 'Phi kiếm linh', 'Phi kiếm bản mệnh', 'Tiên phi kiếm'],
      hpMax: ['Bùa hộ mệnh', 'Chuông hộ mệnh', 'Thuẫn bản mệnh', 'Tiên chung'],
      nl: ['Ngọc bội tĩnh tâm', 'Ngọc linh', 'Ngọc bản mệnh', 'Tiên ngọc']
    },
    VALUE: [60, 250, 1000, 4500], SLOT_MUL: { weapon: 1, armor: 1.1, helm: 0.8, relic: 1.6 },
    PART_NAME: { nanh: 'Nanh', da: 'Da' }
  };
  const G = D.GEAR;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  function pctOf(tier, q, relic, lv) {
    if (relic) return Math.min(G.RELIC_MAX, G.RELIC_BASE[tier] * (0.8 + 0.4 * q) + G.RELIC_GROW * (lv || 0));
    const r = G.PCT[tier]; return r[0] + (r[1] - r[0]) * q;
  }
  const pct1 = x => (Math.round(x * 1000) / 10).toString().replace('.', ',') + '%';

  // Dựng định nghĩa vật phẩm cho một món trang bị.
  function gearDef(o) {
    const relic = !!o.relic, tier = o.tier, q = o.q, stat = relic ? o.stat : G.STAT[o.slot], slot = relic ? 'relic' : o.slot;
    const base = relic ? G.RELIC_NAMES[stat][tier] : G.NAMES[slot][tier];
    const pct = pctOf(tier, q, relic, o.lv);
    const name = o.name || base + (o.elem ? ' hệ ' + o.elem : '') + (relic && o.lv ? ' (cấp ' + o.lv + ')' : '');
    return {
      n: name, cat: 'khi', slot, tier, q, elem: o.elem || null, relic, stat, lv: o.lv || 0, pct, gear: true, m: {},
      value: Math.round(G.VALUE[tier] * (0.8 + 0.4 * q) * G.SLOT_MUL[slot]), minRealm: G.REQ[tier] || undefined,
      desc: (relic ? 'Pháp bảo bản mệnh. ' : '') + G.STAT_NAME[stat][0].toUpperCase() + G.STAT_NAME[stat].slice(1) + ' +' + pct1(pct) + ' (phẩm ' + G.TIERS[tier] + (o.elem ? ', hệ ' + o.elem : '') + ').' +
        (relic ? ' Lớn lên theo thời gian đeo, tối đa +' + Math.round(G.RELIC_MAX * 100) + '%; cùng hệ với kẻ địch thì khắc chế nhẹ.' : '') + (G.REQ[tier] ? ' Cần ' + (D.REALM_NAMES ? D.REALM_NAMES[G.REQ[tier]] : 'cảnh giới ' + G.REQ[tier]) + ' trở lên.' : '')
    };
  }
  function matDef(part, elem, tier) {
    return { n: G.PART_NAME[part] + ' yêu thú hệ ' + elem + ' (bậc ' + tier + ')', cat: 'lieu', part, elem, tier, mat: true, value: Math.round(18 * Math.pow(2.4, tier)),
      desc: 'Vật liệu luyện khí: ' + (part === 'nanh' ? 'dùng cho vũ khí' : 'dùng cho giáp và mũ') + ', mang thuộc tính ' + elem + '. Rơi từ yêu thú bậc ' + tier + ' trở lên.' };
  }

  const gear = TT.gear = {
    pctOf, pct1,
    key(slot, tier, q, elem) { return 'g|' + slot + '|' + tier + '|' + Math.round(clamp(q, 0, 0.99) * 99) + '|' + (elem || ''); },
    relicKey(stat, tier, q, elem, lv) { return 'r|' + stat + '|' + tier + '|' + Math.round(clamp(q, 0, 0.99) * 99) + '|' + (elem || '') + '|' + (lv || 0); },
    matKey(part, elem, tier) { return 'm|' + part + '|' + elem + '|' + tier; },
    // Sức mạnh gốc của chỉ số (chưa tính trang bị) để quy ra số cộng.
    base(c, k) {
      if (k === 'atk') return c.baseAtk + c.realm * 10 + (c.trainAtk || 0);
      if (k === 'hpMax') return 100 + c.realm * 40 + (c.trainHp || 0);
      if (k === 'nl') return c.baseNl + c.realm * 6 + (c.trainNl || 0);
      return 0;
    },
    parse(id) {
      const p = id.split('|');
      if (p[0] === 'g') return gearDef({ slot: p[1], tier: +p[2], q: +p[3] / 99, elem: p[4] || null });
      if (p[0] === 'r') return gearDef({ relic: true, stat: p[1], tier: +p[2], q: +p[3] / 99, elem: p[4] || null, lv: +p[5] || 0 });
      if (p[0] === 'm') return matDef(p[1], p[2], +p[3]);
      return null;
    },
    isGear: id => typeof id === 'string' && (id.charAt(1) === '|' && (id.charAt(0) === 'g' || id.charAt(0) === 'r')),
    // Cùng pháp bảo nhưng đổi cấp (dựng lại mã từ định nghĩa, nên dùng được cả với mẫu như ngoc_boi).
    withLv(id, lv) { const d = D.ITEMS[id]; return gear.relicKey(d.stat, d.tier, d.q, d.elem, lv); },
    // Món tốt hơn: so theo phần trăm cộng.
    better: (a, b) => (D.ITEMS[a].pct || 0) > (b ? D.ITEMS[b].pct || 0 : -1)
  };

  // Mẫu có sẵn (id cũ giữ nguyên để chợ, bản lưu và kiểm thử cũ vẫn chạy).
  const TPL = {
    kiem_sat: gearDef({ slot: 'weapon', tier: 0, q: 0.5 }), kiem_tinh: gearDef({ slot: 'weapon', tier: 1, q: 0.5 }), kiem_linh: gearDef({ slot: 'weapon', tier: 2, q: 0.5 }),
    ao_da: gearDef({ slot: 'armor', tier: 0, q: 0.5 }), giap_linh: gearDef({ slot: 'armor', tier: 1, q: 0.5 }), giap_tien: gearDef({ slot: 'armor', tier: 2, q: 0.5 }),
    mu_vai: gearDef({ slot: 'helm', tier: 0, q: 0.5 }), mu_sat: gearDef({ slot: 'helm', tier: 1, q: 0.5 }), dao_quan: gearDef({ slot: 'helm', tier: 2, q: 0.5 }),
    ngoc_boi: gearDef({ relic: true, stat: 'nl', tier: 0, q: 0.5, lv: 0 }), phu_truong: gearDef({ relic: true, stat: 'hpMax', tier: 0, q: 0.5, lv: 0 })
  };
  gear.TPL = TPL;
  const base = D.ITEMS || {};
  Object.keys(TPL).forEach(id => { base[id] = TPL[id]; });
  // Khoáng thạch bốn bậc và lò luyện (vật phẩm cố định).
  base.tinh_thiet = { n: 'Tinh thiết', cat: 'lieu', tier: 1, ore: true, value: 40, desc: 'Khoáng thạch bậc linh, nguyên liệu luyện khí phẩm linh.' };
  base.huyen_thiet = { n: 'Huyền thiết', cat: 'lieu', tier: 2, ore: true, value: 200, desc: 'Khoáng thạch bậc bảo, nguyên liệu luyện khí phẩm bảo.' };
  base.thien_thach = { n: 'Thiên ngoại thạch', cat: 'lieu', tier: 3, ore: true, value: 1200, desc: 'Khoáng thạch bậc tiên rơi từ trời, nguyên liệu luyện khí phẩm tiên.' };
  base.lo_linh = { n: 'Lò luyện linh phẩm', cat: 'lo', tier: 1, value: 450, desc: 'Lò luyện bậc linh: thêm 5% thành công và chất lượng khi luyện khí.' };
  base.lo_bao = { n: 'Lò luyện bảo phẩm', cat: 'lo', tier: 2, value: 2400, desc: 'Lò luyện bậc bảo: thêm 10% thành công và chất lượng khi luyện khí.' };
  base.lo_tien = { n: 'Lò luyện tiên phẩm', cat: 'lo', tier: 3, value: 11000, desc: 'Lò luyện bậc tiên: thêm 15% thành công và chất lượng khi luyện khí.' };
  if (base.quang_thach) { base.quang_thach.ore = true; base.quang_thach.tier = 0; }
  const cache = {};
  D.ITEMS = new Proxy(base, {
    get(t, k) {
      if (typeof k === 'string' && !(k in t) && k.charAt(1) === '|') { if (!(k in cache)) cache[k] = gear.parse(k); return cache[k]; }
      return t[k];
    },
    has(t, k) { return k in t || (typeof k === 'string' && k.charAt(1) === '|' && !!gear.parse(k)); }
  });
})();
