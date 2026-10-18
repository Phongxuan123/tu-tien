// Lưu/tải thế giới: localStorage (tự lưu) và xuất/nhập file JSON để sao lưu.
(function () {
  const TT = window.TT = window.TT || {};
  const KEY = 'tt8b_world';

  function pack() {
    TT.world.rngState = TT.rng.getState();
    return JSON.stringify({ v: TT.VERSION, world: TT.world });
  }

  function unpack(text) {
    const d = JSON.parse(text);
    if (!d || d.v !== TT.VERSION || !d.world || !d.world.chars) throw new Error('Bản lưu không hợp lệ hoặc khác phiên bản.');
    // Infinity không lưu được trong JSON nên không có trường nào chứa nó; không cần khôi phục.
    TT.world = d.world;
    TT.rng.setState(d.world.rngState);
    return TT.world;
  }

  TT.save = {
    write() {
      try { localStorage.setItem(KEY, pack()); return true; } catch (e) { return false; }
    },
    hasSave() {
      try { return !!localStorage.getItem(KEY); } catch (e) { return false; }
    },
    load() {
      try {
        const t = localStorage.getItem(KEY);
        if (!t) return false;
        unpack(t);
        return true;
      } catch (e) { console.warn('Không tải được bản lưu:', e); return false; }
    },
    clear() { try { localStorage.removeItem(KEY); } catch (e) {} },
    snapshot: pack,
    restore: unpack,
    exportFile() {
      const blob = new Blob([pack()], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'tu-tien-save.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },
    importText(text) { return unpack(text); }
  };

  TT.bus.on('autosave', () => TT.save.write());

  // Bộ sưu tập kết cục và thành tích qua nhiều thế giới (khóa riêng, không mất khi tạo thế giới mới).
  const META_KEY = 'tt8b_meta';
  TT.meta = {
    data: { endings: {}, best: 0, lives: 0, ascended: 0 },
    load() {
      try { const t = localStorage.getItem(META_KEY); if (t) TT.meta.data = Object.assign(TT.meta.data, JSON.parse(t)); } catch (e) { /* không có localStorage thì thôi */ }
    },
    write() { if (TT.config.persistMeta === false) return; try { localStorage.setItem(META_KEY, JSON.stringify(TT.meta.data)); } catch (e) { /* bỏ qua */ } },
    classify(c, how) { return TT.data.ENDINGS.filter(e => { try { return e.test(c, how); } catch (err) { return false; } }); },
    record(endings, c) {
      const m = TT.meta.data;
      endings.forEach(e => { m.endings[e.id] = (m.endings[e.id] || 0) + 1; });
      m.lives++; if (c.ascended) m.ascended++;
      if (c.realm > m.best) m.best = c.realm;
      TT.meta.write();
    }
  };
  TT.meta.load();
})();
