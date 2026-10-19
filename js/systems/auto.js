// Trợ lý tự động của chế độ "Tự động": mỗi năm máy tự lo việc vặt thay người chơi (trang bị, học công pháp và tâm pháp, mua đồ ở chợ).
// Người chơi chọn "Thủ công" hoặc "Cân bằng" thì tự mình lo các việc này ở tab Hành trang và Công pháp.
(function () {
  const TT = window.TT = window.TT || {};
  const D = TT.data;

  TT.auto = {
    assist(c) {
      if (c.kind !== 'player' || !c.alive) return;
      TT.items.autoEquip(c);
      // đọc bí kíp học được, ưu tiên phẩm cao
      Object.keys(c.inv || {}).filter(id => id.indexOf('bk_') === 0).sort((a, b) => D.ITEMS[b].tier - D.ITEMS[a].tier).forEach(id => {
        if (!TT.tech.canLearn(c, D.ITEMS[id].tech)) TT.items.use(c, id);
      });
      // công pháp chính: phẩm cao nhất, cấp cao nhất
      const known = TT.tech.known(c).sort((a, b) => b.t.tier - a.t.tier || b.lv - a.lv);
      if (known.length && c.techMain !== known[0].t.id) TT.tech.setMain(c, known[0].t.id);
      // tâm pháp theo thứ tự có lợi cho đột phá và tu luyện
      ['pha_chuong', 'vong_tinh', 'thien_dao', 'tinh_tam', 'kim_cang', 'ho_dao', 'truong_sinh', 'thien_nhan'].forEach(id => { if (!TT.tech.canLearnXinfa(c, id)) TT.tech.learnXinfa(c, id); });
      if (c.sect && TT.sect.autoManage) TT.sect.autoManage(c); // chọn đường, nhận việc trên bảng tông
      // uống Tụ Khí Đan khi có
      while (TT.items.has(c, 'tu_khi_dan')) TT.items.use(c, 'tu_khi_dan');
      // mua sắm ở chợ
      if (TT.market.typeOf(c)) {
        const stock = TT.market.stock(c);
        const price = id => { const s = stock.find(x => x.id === id); return s ? s.price : null; };
        const tryBuy = (id, reserve) => { const p = price(id); if (p != null && TT.ls.wealth(c) >= p + (reserve || 0)) return TT.market.buy(c, id).ok; return false; };
        if (TT.items.count(c, 'hoi_xuan_dan') < 2) tryBuy('hoi_xuan_dan', 40);
        // sách công pháp tốt nhất mua được mà mình học được
        const books = stock.filter(s => D.ITEMS[s.id].cat === 'sach' && !TT.tech.canLearn(c, D.ITEMS[s.id].tech) && !(c.techs && c.techs[D.ITEMS[s.id].tech]))
          .sort((a, b) => D.ITEMS[b.id].tier - D.ITEMS[a.id].tier);
        const main = TT.tech.main(c);
        if (books.length && (!main || D.ITEMS[books[0].id].tier > main.tier) && TT.ls.wealth(c) >= books[0].price + 30) { TT.market.buy(c, books[0].id); TT.items.use(c, books[0].id); }
        // sắp đột phá thì chuẩn bị Phá Cảnh Đan
        if (c.realm < 6 && c.xp >= TT.data.NEED[c.realm] * 0.8 && TT.items.count(c, 'pha_canh_dan') < 2) tryBuy('pha_canh_dan', 60);
        if (TT.ls.wealth(c) > 400) { tryBuy('kiem_tinh', 100); tryBuy('giap_linh', 100); tryBuy('mu_sat', 100); tryBuy('ngoc_boi', 100); }
        TT.items.autoEquip(c);
      }
    }
  };
})();
