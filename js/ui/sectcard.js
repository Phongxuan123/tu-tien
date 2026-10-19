// Thẻ tông (S2): phong cách, năm trục giá trị, bảy chỉ số, năm chính sách, hành vi, công–tội, bí mật, các cơ quan. Chỉ hiện chữ và bậc.
// Tiết lộ theo mức gắn bó của người chơi: người ngoài thấy một công và một tội (tiếng đồn); đệ tử thấy nhiều hơn; chân truyền trở lên biết bí mật.
// Cũng thêm dòng bản sắc cho gia tộc, thương hội, vương triều ở tab Biên niên sử (ui.factionStyle).
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data, h = ui.h;

  ui.cardOpen = ui.cardOpen || {};
  const statWord = v => (v >= 78 ? 'Rất mạnh' : v >= 65 ? 'Mạnh' : v >= 50 ? 'Khá' : v >= 30 ? 'Vừa' : 'Yếu');
  const lean = (ax, v) => { const A = D.SECT_GT.axes[ax]; return v <= -60 ? 'rất nghiêng về ' + A[0].toLowerCase() : v <= -25 ? 'nghiêng về ' + A[0].toLowerCase() : v >= 60 ? 'rất nghiêng về ' + A[1].toLowerCase() : v >= 25 ? 'nghiêng về ' + A[1].toLowerCase() : 'cân bằng'; };
  const nhanWord = v => (v >= 50 ? 'nhân hậu' : v >= 15 ? 'thiên về nhân đạo' : v > -15 ? 'thực dụng' : v > -45 ? 'tàn nhẫn khi cần' : 'tàn nhẫn');

  // Mức hiểu biết của người chơi về tông: 1 người ngoài, 2 ngoại môn, 3 nội môn, 4 chân truyền trở lên.
  function know(c, id) { const s = c.sect; return s && s.id === id ? Math.min(4, 2 + s.rank) : 1; }

  ui.sectCard = function (id, c) {
    const d = D.SECTS[id], lv = know(c, id), box = h('div', { class: 'card sect-card' });
    if (!d || !d.gt) return box;
    const V = TT.sectmod.view(id); // giá trị hiện có của thế giới đang chạy (S4), không phải dữ liệu chung
    box.appendChild(h('div', { class: 'small' }, d.phongcach));
    box.appendChild(h('div', { class: 'sec' }, 'Giá trị'));
    D.SECT_GT.keys.forEach((k, i) => {
      const v = V.gt[i], A = D.SECT_GT.axes[k];
      box.appendChild(h('div', { class: 'gt' }, h('span', { class: 'gl' }, A[0]), h('div', { class: 'tr' }, h('i', { style: 'left:' + Math.round(50 + v / 2) + '%' })), h('span', { class: 'gr' }, A[1]), h('span', { class: 'small gw' }, lean(k, v))));
    });
    box.appendChild(h('div', { class: 'small' }, 'Hành vi gần đây: ' + nhanWord(V.nhan) + '.'));
    box.appendChild(h('div', { class: 'sec' }, 'Sức mạnh'));
    const g = h('div', { class: 'gstat' });
    D.SECT_STATS.keys.forEach((k, i) => { const v = Math.round(V.chiso[i]); g.appendChild(h('div', { class: 'small' }, D.SECT_STATS.names[k] + ': ', h('b', null, statWord(v)), h('div', { class: 'bar' }, h('i', { style: 'width:' + v + '%' })))); });
    box.appendChild(g);
    box.appendChild(h('div', { class: 'sec' }, 'Chính sách'));
    D.SECT_POLICY.keys.forEach((k, i) => box.appendChild(h('div', { class: 'small' }, D.SECT_POLICY.names[k] + ': ', h('b', null, D.SECT_POLICY.opt[k][V.chinhsach[i]]))));
    if (V.last && lv >= 2) box.appendChild(h('div', { class: 'small bad-txt' }, 'Đã có đợt thanh trừng nội bộ (ghi trong sử ký).'));
    const nc = Math.min(d.cong.length, lv >= 3 ? 9 : lv), nt = Math.min(d.toi.length, lv >= 3 ? 9 : lv);
    box.appendChild(h('div', { class: 'sec' }, lv >= 3 ? 'Công và tội' : 'Tiếng đồn'));
    d.cong.slice(0, nc).forEach(t => box.appendChild(h('div', { class: 'small good-txt' }, 'Công: ' + t)));
    d.toi.slice(0, nt).forEach(t => box.appendChild(h('div', { class: 'small bad-txt' }, 'Tội: ' + t)));
    if (nc < d.cong.length || nt < d.toi.length) box.appendChild(h('div', { class: 'small' }, 'Còn nhiều điều chưa ai kể rõ; ở gần tông sẽ biết thêm.'));
    box.appendChild(h('div', { class: 'small' }, lv >= 4 ? h('span', null, h('b', null, 'Bí mật: '), d.bimat) : 'Dường như tông còn giấu điều gì đó.'));
    box.appendChild(h('div', { class: 'sec' }, 'Bộ máy'));
    const orgs = ['chap', 'duoc', 'tang', 'ngoai', 'khoc'].map(b => TT.sect.bldName(b, id)).join(', ');
    box.appendChild(h('div', { class: 'small' }, orgs + '.'));
    (d.them || []).forEach(o => box.appendChild(h('div', { class: 'small' }, o.n + ': ' + o.desc + ' (sẽ mở ở các bản sau)')));
    return box;
  };

  // Dòng bản sắc thêm vào thẻ thế lực ở tab Biên niên sử.
  ui.factionStyle = function (row, x, k, c) {
    const idx = +String(x.id).split('_').pop();
    if (k === 'tong' && D.SECTS[x.id] && D.SECTS[x.id].phongcach) {
      const open = !!ui.cardOpen[x.id];
      row.appendChild(h('div', { class: 'small' }, D.SECTS[x.id].phongcach));
      row.appendChild(h('div', { class: 'small lnk', onclick: () => { ui.cardOpen[x.id] = !ui.cardOpen[x.id]; } }, (open ? '▾ ' : '▸ ') + 'Thẻ tông'));
      if (open) row.appendChild(ui.sectCard(x.id, c));
    } else if (k === 'gia' && D.GIA_KIEU.order[idx]) {
      const K = D.GIA_KIEU.info[D.GIA_KIEU.order[idx]]; row.appendChild(h('div', { class: 'small' }, K.n + ': ' + K.desc));
    } else if (k === 'hoi' && D.HOI_STYLE[idx]) row.appendChild(h('div', { class: 'small' }, D.HOI_STYLE[idx]));
    else if (k === 'trieu' && D.NATION_STYLE[x.region]) row.appendChild(h('div', { class: 'small' }, D.NATION_STYLE[x.region]));
  };
})();
