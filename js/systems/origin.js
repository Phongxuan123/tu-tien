// Xuất thân của người chơi (Q 8.2, 9A): bốc một trong tám xuất thân của D.ORIGINS2 bằng băm (không gọi TT.rng), áp start và ax,
// chọn địa điểm sinh theo place_types, dựng cha mẹ thật (NPC có quan hệ huyết thống) khi cha_me.co. NPC giữ xuất thân cũ ở regions.js.
// Công tắc D.ORIGINS2.on = false thì mọi thứ chạy như cũ (c.origin2 không có, không dựng cha mẹ).
// Dữ liệu người chơi: c.origin2 (id), c.origin (chữ hiển thị), c.flags.biMat (id xuất thân có bí mật, cho tuyến sau đọc), c.parents (id cha mẹ).
// Hàm đọc (get, burden, parents, roll, placeFor) không gọi rng và không ghi dữ liệu; spawnParents là hàm duy nhất rút rng.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data;
  const O = () => D.ORIGINS2;
  const on = c => !!(c && c.kind === 'player' && O() && O().on);

  // Băm chuỗi (FNV-1a) và bộ số giả ngẫu nhiên riêng (mulberry32): hoàn toàn tách khỏi TT.rng.
  function hash(str) { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function mk(seed) {
    let a = seed | 0;
    return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const worldSeed = () => (TT.world && TT.world.seed != null ? TT.world.seed : 0);
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  const origin = TT.origin = {
    on,
    hash, mk,

    // Bốc xuất thân theo trọng số từ (hạt giống thế giới, id người chơi, muối). Muối là trạng thái rng lúc sinh (chỉ đọc), nên Bốc lại ra xuất thân khác.
    roll(seed, id, salt) {
      const list = O(), r = mk(hash(seed + ':' + id + ':' + (salt || 0) + ':origin2'));
      const tot = list.reduce((a, o) => a + o.w, 0); let x = r() * tot, pick = list[list.length - 1];
      for (const o of list) { x -= o.w; if (x < 0) { pick = o; break; } }
      return pick;
    },
    // Địa điểm sinh theo place_types của xuất thân trong một vùng; null nếu vùng không có loại nào hợp (người gọi giữ địa điểm cũ).
    placeFor(o2, regionId, id, salt) {
      const cand = TT.map.placesOf(regionId).filter(p => o2.place_types.indexOf(p.type) >= 0);
      if (!cand.length) return null;
      const r = mk(hash(worldSeed() + ':' + id + ':' + (salt || 0) + ':origin2:place'));
      return cand[Math.floor(r() * cand.length)].id;
    },

    // Xuất thân của một nhân vật (đọc thuần): bản ghi D.ORIGINS2 hoặc null (NPC, bản lưu cũ, công tắc tắt).
    get(c) { return c && c.origin2 && D.ORIGINS2_BY_ID ? D.ORIGINS2_BY_ID[c.origin2] || null : null; },
    // Gánh nặng (chữ) của xuất thân; chuỗi rỗng nếu không có.
    burden(c) { const o = origin.get(c); return o ? o.gom : ''; },
    // Bí mật đã ghi cờ (chưa lộ): chữ hoặc chuỗi rỗng.
    secret(c) { const o = c && c.flags && c.flags.biMat ? D.ORIGINS2_BY_ID[c.flags.biMat] : null; return o && o.bi_mat ? o.bi_mat : ''; },
    // Cha mẹ: [{ c (nhân vật hoặc null nếu đã bị dọn), role: 'cha'|'mẹ', alive }] (đọc thuần).
    parents(c) {
      const w = TT.world;
      return (c.parents || []).map(id => {
        const p = w && w.chars[id];
        return p ? { c: p, role: p.gender === 'nu' ? 'mẹ' : 'cha', alive: !!p.alive } : { c: null, role: '?', alive: false };
      });
    },

    // Áp xuất thân lên người chơi vừa dựng (gọi trong createChar trước khi tính sinh lực). Không gọi rng.
    // start: gold đặt thẳng (thay vàng xuất thân cũ), luck/atk/nl/daoTam cộng thêm, items mỗi món một cái; ax cộng vào bốn trục tính cách.
    apply(c, o2, oldOrigin) {
      c.origin2 = o2.id; c.origin = o2.n;
      const s = o2.start || {};
      c.gold = s.gold || 0;
      c.baseLuck += (s.luck || 0) - (oldOrigin && oldOrigin.luck ? oldOrigin.luck : 0);
      if (s.atk) c.baseAtk += s.atk;
      if (s.nl) c.baseNl += s.nl;
      if (s.daoTam) c.daoTam = Math.min(100, c.daoTam + s.daoTam);
      (s.items || []).forEach(id => { c.inv[id] = (c.inv[id] || 0) + 1; });
      if (o2.bi_mat) c.flags.biMat = o2.id;
      if (c.nature && o2.ax) {
        const M = D.NATURE.max;
        Object.keys(o2.ax).forEach(k => { if (k in c.nature) c.nature[k] = Math.max(-M, Math.min(M, c.nature[k] + o2.ax[k])); });
        c.personality = TT.nature.legacyLabel(c.nature);
      }
    },

    // Dựng cha mẹ thật khi cha_me.co: 1 đến 2 NPC lõi tuổi 30 đến 50 (cha họ cùng họ với người chơi), tu hành theo cha_me.tu,
    // sống cùng nơi sinh, quan hệ huyết thống (rel.k = 'huyet') với người chơi và đạo lữ với nhau. Số lượng, giới, tuổi, thiện cảm lấy bằng băm;
    // createChar vẫn rút rng nên hàm này phải gọi SAU mọi lần rút cũ của life.reincarnate. Trả về danh sách NPC vừa dựng.
    spawnParents(c) {
      const o2 = origin.get(c);
      if (!o2 || !on(c) || !o2.cha_me.co || (c.parents && c.parents.length)) return [];
      const w = TT.world, rel = TT.rel, r = mk(hash(worldSeed() + ':' + c.id + ':' + c.birthMonth + ':' + c.name + ':cha_me'));
      const two = r() < 0.8, who = two ? ['nam', 'nu'] : [r() < 0.5 ? 'nam' : 'nu'];
      const realm = o2.cha_me.tu ? (o2.id === 't6' ? 2 : 1) : 0;
      const out = [];
      who.forEach(g => {
        const age = 30 + Math.floor(r() * 21), v = 60 + Math.floor(r() * 26);
        const p = TT.createChar({
          kind: 'npc', tier: 'core', age, gender: g, region: c.region, place: c.place,
          surname: g === 'nam' ? TT.surnameOf(c.name) : undefined,
          origin: { name: o2.n, gold: 0, luck: 0, types: [] }
        });
        p.realm = realm; p.hp = TT.stats.hpMax(p);
        p.gold = Math.max(5, Math.round(((o2.start && o2.start.gold) || 0) * 1.5)) * (1 + realm);
        p.children = [c.id];
        const k = rel.ensure(p, c); k.k = 'huyet'; k.v = v;
        out.push(p);
      });
      if (out.length === 2) { const k = rel.ensure(out[0], out[1]); k.k = 'dao_lu'; k.love = 100; k.v = 70; }
      c.parents = out.map(p => p.id);
      return out;
    },

    // Chữ tóm tắt cha mẹ cho hộp Đời mới và nhật ký: "cha Nguyễn A (còn sống), mẹ ..." hoặc lý do không có.
    parentsText(c) {
      const o2 = origin.get(c);
      if (!o2) return '';
      if (!o2.cha_me.co) return 'Bạn không có cha mẹ bên cạnh.';
      const ps = origin.parents(c);
      if (!ps.length) return 'Cha mẹ bạn không còn trong thế giới.';
      return ps.map(x => x.role + ' ' + (x.c ? x.c.name + (x.alive ? '' : ' (đã mất)') : '(không rõ)')).join(', ') + (o2.cha_me.tu ? ' · có tu hành' : '') + '.';
    },
    cap
  };
})();
