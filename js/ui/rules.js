// Tab "Quy tắc nếu-thì": người chơi đặt trước cách nhân vật xử lý các tình huống lặp lại.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const h = ui.h;

  function build(box, c) {
    const r = TT.rules.ensure(c);
    box.appendChild(h('h2', null, 'Quy tắc nếu-thì'));
    box.appendChild(h('div', { class: 'small' }, 'Nhân vật tự theo các quy tắc này mỗi tháng và khi hết giờ chọn ở các hộp quyết định.'));
    TT.rules.DEFS.forEach(def => {
      const st = r[def.id];
      const row = h('div', { class: 'rule' });
      row.appendChild(h('input', {
        type: 'checkbox', checked: st.on ? 'checked' : null,
        onchange: e => { st.on = e.target.checked; ui.markDirty(); }
      }));
      row.appendChild(h('span', null, ' ' + def.text + ' '));
      const sel = h('select', { onchange: e => { st.v = def.vals ? Number(e.target.value) : e.target.value; ui.markDirty(); } });
      if (def.vals) {
        def.vals.forEach(v => sel.appendChild(h('option', { value: v, selected: st.v === v ? 'selected' : null }, v + def.unit)));
        row.appendChild(sel);
        row.appendChild(h('span', null, ' ' + def.act));
      } else {
        def.opts.forEach(o => sel.appendChild(h('option', { value: o[0], selected: st.v === o[0] ? 'selected' : null }, o[1])));
        row.appendChild(sel);
      }
      box.appendChild(row);
    });
  }

  ui.addTab({ id: 'rules', label: 'Quy tắc', key: c => c.id + JSON.stringify(TT.rules.ensure(c)), build });
})();
