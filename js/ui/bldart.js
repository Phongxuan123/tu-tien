// Hình vẽ pixel của các công trình: mỗi công trình có dáng riêng và một BIỂU TƯỢNG treo trước cửa nói rõ nó bán/làm gì
// (bình thuốc cho Đan các, đe và búa cho Khí phô, dải bùa vàng cho Phù trai...). Vẽ bằng khối pixel trên canvas, không dùng tệp ảnh.
// TT.ui.bld.draw(ctx, id, x, gy, w, opt): x là mép trái, gy là mặt đất (đáy công trình), w độ rộng (mặc định 30), opt = { hover, frame }.
// TT.ui.bld.defs: thông tin từng công trình (tên, mô tả, loại dịch vụ). Dùng cho màn hình nhân vật và trang xem asset.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};

  const DEFS = {
    cho: { n: 'Chợ', desc: 'Mua bán đồ thường ngày', col: '#b0382a', roof: '#7a2a20', h: 28 },
    dan: { n: 'Đan các', desc: 'Bán và thu mua đan dược, linh thảo', col: '#2f6a8c', roof: '#1f4a66', h: 30 },
    khi: { n: 'Khí phô', desc: 'Binh khí, giáp trụ, lò luyện, khoáng thạch', col: '#6a4a3a', roof: '#3a2a20', h: 30 },
    bua: { n: 'Phù trai', desc: 'Bùa chú, giấy bùa', col: '#8a6b1f', roof: '#5a4410', h: 30 },
    thu: { n: 'Thư các', desc: 'Công pháp, tâm đắc nghề', col: '#5a3a6a', roof: '#3a2446', h: 32 },
    hoi: { n: 'Thương hội', desc: 'Mua sỉ, đơn hàng, vay vốn, bảo hiểm, thông tin giá', col: '#a07820', roof: '#6a5010', h: 34 },
    vo: { n: 'Võ đài', desc: 'Thách đấu, luyện võ', col: '#7a2a2a', roof: '#4a1a1a', h: 28 },
    yq: { n: 'Y quán', desc: 'Chữa thương, thuốc bổ', col: '#2f7a5c', roof: '#1f5a40', h: 30 },
    tuu: { n: 'Tửu lâu', desc: 'Nghe tin đồn, giao du, thuê hộ vệ', col: '#8a4a2a', roof: '#5a2a1a', h: 34 },
    quan: { n: 'Nha môn', desc: 'Thông tin thành trì, thuế, bảng truy nã', col: '#4a5a7a', roof: '#2a3a5a', h: 34 },
    bao: { n: 'Tòa soạn', desc: 'Nhật báo, đăng tin', col: '#6a6a50', roof: '#3a3a28', h: 30 },
    kho: { n: 'Kho', desc: 'Cất đồ khi đi bí cảnh', col: '#5a5a5a', roof: '#363636', h: 28 },
    tro: { n: 'Quán trọ', desc: 'Nghỉ ngơi, hồi phục', col: '#7a6a3a', roof: '#4a3f1f', h: 30 },
    dgia: { n: 'Nhà đấu giá', desc: 'Đấu giá đồ quý', col: '#8a2a6a', roof: '#5a1a46', h: 32 },
    son: { n: 'Sơn môn', desc: 'Nhập môn, nhận nhiệm vụ tông', col: '#2f6a5a', roof: '#1f4a3c', h: 40 },
    khoc: { n: 'Kho cống hiến', desc: 'Đổi cống hiến lấy vật phẩm', col: '#3a7a8a', roof: '#244f5a', h: 28 },
    ham: { n: 'Hầm mỏ', desc: 'Làm việc thợ mỏ, đào khoáng', col: '#4a3a30', roof: '#2a2018', h: 26 },
    den: { n: 'Hang chợ đen', desc: 'Hàng cấm, đồ chưa giám định', col: '#3a2a4a', roof: '#201830', h: 28 },
    tau: { n: 'Bến tàu', desc: 'Thuê đò, qua sông', col: '#2f5a8a', roof: '#1f3e66', h: 30 },
    cua: { n: 'Cổng thám hiểm', desc: 'Vào bí cảnh, tàn tích, hung địa (nguy hiểm)', col: '#5a2a8a', roof: '#3a1a5a', h: 40 },
    ai: { n: 'Cổng ải', desc: 'Qua ải sang vùng khác, nộp thuế', col: '#6a6a7a', roof: '#44444f', h: 38 },
    rong: { n: 'Hàng rong', desc: 'Người bán rong ghé qua, hàng ít và lạ', col: '#8a6a3a', roof: '#c05a2a', h: 24 },
    lang: { n: 'Lều tộc trưởng', desc: 'Gặp tộc trưởng, tìm hiểu cứ địa', col: '#7a5a3a', roof: '#4a3220', h: 26 },
    thon: { n: 'Nhà trưởng thôn', desc: 'Hỏi thăm làng, tin tức trong vùng', col: '#8a6a44', roof: '#5a3a22', h: 28 },
    // công trình trong tông môn (xem trước, chưa gắn vào phố)
    chap: { n: 'Chấp pháp đường', desc: 'Luật tông, tuần tra, nhận việc Chấp pháp', col: '#6a2a2a', roof: '#3a1414', h: 30, sect: true },
    duoc: { n: 'Dược đường', desc: 'Luyện đan, thu hái, nhận việc Dược và luyện', col: '#2f6a46', roof: '#1c4630', h: 30, sect: true },
    tang: { n: 'Tàng kinh các', desc: 'Điển tịch, tuyệt học, nhận việc Tàng kinh', col: '#5a4a7a', roof: '#382c52', h: 44, sect: true },
    ngoai: { n: 'Ngoại vụ đường', desc: 'Giao thiệp, thương đoàn, nhận việc Ngoại vụ', col: '#2f5a8a', roof: '#1c3a60', h: 30, sect: true },
    dien: { n: 'Điện chưởng môn', desc: 'Chức vị, thăng bậc, lãnh đạo, chính sự', col: '#a8301f', roof: '#6a1a10', h: 42, sect: true },
    tran: { n: 'Trận đài truyền tống', desc: 'Vượt vùng bằng đại trận của tông', col: '#2f8a6a', roof: '#1c5a44', h: 36, sect: true },
    bi: { n: 'Đài đại bỉ', desc: 'Đại bỉ năm năm một lần, thi tuyển', col: '#8a6a3a', roof: '#5a4020', h: 30, sect: true }
  };

  const DK = '#1a1410';
  let ctx;
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const tri = (x1, y1, x2, y2, x3, y3, c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.fill(); };
  const shade = (c, a) => { const n = parseInt(c.slice(1), 16), r = Math.max(0, Math.min(255, (n >> 16) + a)), g = Math.max(0, Math.min(255, ((n >> 8) & 255) + a)), b = Math.max(0, Math.min(255, (n & 255) + a)); return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); };

  // thân nhà chung: tường, mái, cửa, cửa sổ. Trả về { cx (tâm), sy (y mép dưới biển) } để vẽ biểu tượng.
  function house(x, gy, w, h, d, o) {
    o = o || {};
    const top = gy - h;
    R(x, top + 10, w, h - 10, d.col); R(x, top + 10, w, 2, '#ffffff22'); R(x, gy - 2, w, 2, '#0003');
    tri(x - 3, top + 11, x + w / 2, top, x + w + 3, top + 11, d.roof); R(x - 3, top + 10, w + 6, 2, d.roof); R(x - 3, top + 12, w + 6, 1, '#0004');
    R(x + w / 2 - 3, gy - 12, 6, 12, DK); R(x + w / 2 - 2, gy - 11, 4, 1, '#ffffff22');
    if (!o.nowin) { R(x + 2, top + 16, 4, 4, '#ffe9a8'); R(x + w - 6, top + 16, 4, 4, '#ffe9a8'); R(x + 3, top + 17, 2, 1, '#fff'); }
    return { cx: x + w / 2, top };
  }

  // ----- biểu tượng treo trước nhà -----
  const E = {
    chap(cx, y, f) { for (let i = 0; i < 9; i++) { R(cx - 7 + i, y + 11 + i, 2, 1, '#cfd8e2'); R(cx + 6 - i, y + 11 + i, 2, 1, '#e4ebf2'); } R(cx - 9, y + 10, 4, 1, '#d8b24a'); R(cx + 5, y + 10, 4, 1, '#d8b24a'); R(cx - 1, y + 14, 2, 2, '#d8b24a'); R(cx - 2, y + 21, 4, 3, DK); },
    duoc(cx, y, f) { const s = Math.round(Math.sin(f * 0.15) * 1), s2 = Math.round(Math.sin(f * 0.15 + 2) * 1); R(cx - 1 + s, y + 8, 2, 2, '#cfeedd'); R(cx - 3 + s2, y + 11, 3, 2, '#e4f6ec'); R(cx + 1 + s, y + 12, 2, 2, '#cfeedd'); R(cx - 6, y + 15, 12, 2, '#6a5a4a'); R(cx - 5, y + 17, 10, 6, DK); R(cx - 4, y + 15, 8, 1, '#58d88a'); R(cx - 6, y + 23, 2, 2, DK); R(cx + 4, y + 23, 2, 2, DK); R(cx - 2, y + 24, 4, 1, f % 8 < 4 ? '#ff8a2a' : '#ffc84a'); },
    tang(cx, y, f) { R(cx - 7, y + 12, 14, 9, '#f4f0e0'); R(cx - 8, y + 11, 3, 11, '#c8a060'); R(cx + 5, y + 11, 3, 11, '#c8a060'); R(cx - 1, y + 12, 2, 9, '#c0302a'); R(cx - 5, y + 14, 3, 1, '#8a8470'); R(cx - 5, y + 16, 3, 1, '#8a8470'); R(cx - 5, y + 18, 3, 1, '#8a8470'); R(cx + 2, y + 14, 3, 1, '#8a8470'); R(cx + 2, y + 16, 3, 1, '#8a8470'); },
    ngoai(cx, y, f) { const w = Math.round(Math.sin(f * 0.2) * 1); R(cx - 1, y + 7, 1, 15, '#4a3020'); R(cx, y + 7, 9 + w, 5, '#3a78d8'); R(cx, y + 7, 9 + w, 1, '#7ab0f0'); R(cx - 9, y + 16, 9, 6, '#f4f0e0'); R(cx - 9, y + 16, 9, 1, '#8a8470'); R(cx - 8, y + 17, 2, 1, '#8a8470'); R(cx - 6, y + 18, 2, 1, '#8a8470'); R(cx - 4, y + 17, 2, 1, '#8a8470'); R(cx + 3, y + 17, 5, 5, '#f0c24a'); R(cx + 4, y + 18, 3, 3, '#c8a030'); },
    dien(cx, y, f) { R(cx - 6, y + 14, 12, 2, '#f0c24a'); R(cx - 6, y + 11, 2, 3, '#f0c24a'); R(cx - 1, y + 8, 2, 6, '#f0c24a'); R(cx + 4, y + 11, 2, 3, '#f0c24a'); R(cx - 5, y + 16, 10, 7, '#a8301f'); R(cx - 1, y + 17, 2, 5, '#f0c24a'); R(cx - 4, y + 17, 1, 5, '#6a1a10'); R(cx + 3, y + 17, 1, 5, '#6a1a10'); },    thon(cx, y, f) { R(cx - 1, y + 6, 2, 15, '#4a3020'); const w = Math.round(Math.sin(f * 0.18) * 1); R(cx + 1, y + 7, 8 + w, 5, '#58b36a'); R(cx + 1, y + 7, 8 + w, 1, '#8ad8a0'); R(cx - 8, y + 16, 6, 5, '#d8c27a'); R(cx - 8, y + 15, 6, 1, '#f0e0a0'); R(cx - 7, y + 14, 4, 1, '#c8b060'); R(cx - 6, y + 13, 2, 1, '#c8b060'); },
    cho(cx, y, f) { for (let i = 0; i < 6; i++) R(cx - 12 + i * 4, y + 12, 4, 4, i % 2 ? '#fff0d8' : '#e04a3a'); R(cx - 12, y + 16, 24, 1, '#0004'); R(cx - 9, y + 19, 5, 4, '#7a4b2a'); R(cx - 8, y + 18, 3, 2, '#e04a3a'); R(cx + 3, y + 19, 5, 4, '#7a4b2a'); R(cx + 4, y + 18, 3, 2, '#f0c24a'); },
    dan(cx, y, f) { R(cx - 1, y + 10, 1, 4, DK); R(cx - 4, y + 14, 8, 8, DK); R(cx - 3, y + 15, 6, 6, '#e8493a'); R(cx - 2, y + 13, 4, 2, '#e8493a'); R(cx - 2, y + 16, 2, 2, '#ffb0a0'); R(cx - 1, y + 12, 2, 1, '#c08a4a'); },
    khi(cx, y, f) { R(cx - 6, y + 16, 12, 3, DK); R(cx - 4, y + 15, 8, 2, '#8a96a6'); R(cx - 2, y + 19, 4, 3, DK); R(cx + 2, y + 10, 1, 6, '#b8c2d0'); R(cx + 1, y + 9, 3, 2, '#cfd8e2'); R(cx - 5, y + 11, 1, 5, '#c08a4a'); R(cx - 7, y + 10, 5, 2, '#6a7686'); },
    bua(cx, y, f) { [-6, 0, 6].forEach((dx, i) => { const s = Math.round(Math.sin(f * 0.15 + i) * 0.6); R(cx + dx - 2 + s, y + 11, 4, 11, '#f0d878'); R(cx + dx - 2 + s, y + 11, 4, 1, DK); R(cx + dx - 1 + s, y + 14, 2, 2, '#c0302a'); R(cx + dx + s, y + 17, 1, 3, '#c0302a'); }); },
    thu(cx, y, f) { R(cx - 7, y + 12, 14, 10, DK); R(cx - 6, y + 13, 6, 8, '#e8d9a0'); R(cx, y + 13, 6, 8, '#d8c890'); R(cx - 1, y + 13, 2, 8, '#8a3a3a'); R(cx - 5, y + 15, 4, 1, '#8a6b3a'); R(cx - 5, y + 17, 4, 1, '#8a6b3a'); R(cx + 2, y + 15, 3, 1, '#8a6b3a'); },
    hoi(cx, y, f) { R(cx - 1, y - 6, 1, 10, '#4a3020'); const w = Math.round(Math.sin(f * 0.2) * 1); R(cx, y - 6, 7 + w, 4, '#f0a840'); R(cx - 4, y + 12, 8, 8, DK); R(cx - 3, y + 13, 6, 6, '#f0c24a'); R(cx - 1, y + 15, 2, 2, DK); R(cx - 6, y + 21, 12, 1, DK); R(cx - 5, y + 20, 3, 1, '#f0c24a'); R(cx + 2, y + 20, 3, 1, '#f0c24a'); },
    vo(cx, y, f) { R(cx - 1, y + 10, 2, 12, '#4a3020'); R(cx - 6, y + 10, 12, 2, '#b0382a'); R(cx - 5, y + 14, 1, 7, '#c8d2de'); R(cx + 4, y + 14, 1, 7, '#c8d2de'); R(cx - 4, y + 16, 8, 1, '#c8d2de'); R(cx - 3, y + 15, 6, 1, '#c8d2de'); },
    yq(cx, y, f) { R(cx - 5, y + 12, 10, 10, '#f4f0e0'); R(cx - 1, y + 13, 2, 8, '#2fa86a'); R(cx - 4, y + 16, 8, 2, '#2fa86a'); R(cx - 5, y + 12, 10, 1, '#0003'); },
    tuu(cx, y, f) { const s = Math.round(Math.sin(f * 0.1) * 0.5); R(cx - 6 + s, y + 11, 1, 3, DK); R(cx - 7 + s, y + 14, 4, 5, '#d8302a'); R(cx - 6 + s, y + 19, 2, 1, DK); R(cx + 3, y + 10, 1, 4, DK); R(cx + 1, y + 14, 5, 7, '#9a5a2a'); R(cx + 2, y + 13, 3, 2, '#9a5a2a'); R(cx + 2, y + 16, 3, 1, '#e8d9a0'); },
    quan(cx, y, f) { R(cx - 6, y + 12, 12, 9, '#a8301f'); R(cx - 5, y + 13, 10, 7, '#c8402a'); R(cx - 2, y + 14, 4, 5, '#f0d878'); R(cx - 1, y + 15, 2, 3, '#a8301f'); R(cx - 7, y + 21, 2, 3, '#c8c0a8'); R(cx + 5, y + 21, 2, 3, '#c8c0a8'); },
    bao(cx, y, f) { R(cx - 6, y + 12, 12, 9, '#f4f0e0'); R(cx - 5, y + 13, 10, 1, DK); R(cx - 5, y + 15, 10, 1, '#8a8470'); R(cx - 5, y + 17, 7, 1, '#8a8470'); R(cx - 5, y + 19, 10, 1, '#8a8470'); R(cx + 4, y + 9, 1, 8, '#6a4a2a'); R(cx + 3, y + 8, 3, 2, '#e8e0c8'); },
    kho(cx, y, f) { R(cx - 7, y + 14, 8, 8, '#8a5a2a'); R(cx - 7, y + 17, 8, 1, '#5a3a1a'); R(cx - 2, y + 9, 7, 7, '#a06a30'); R(cx - 2, y + 12, 7, 1, '#5a3a1a'); R(cx + 3, y + 17, 6, 5, DK); R(cx + 4, y + 18, 4, 3, '#f0c24a'); R(cx + 5, y + 16, 2, 2, '#c8b060'); },
    tro(cx, y, f) { const g = 0.7 + 0.3 * Math.sin(f * 0.1); R(cx - 1, y + 10, 2, 2, '#4a3020'); R(cx - 4, y + 12, 8, 9, DK); R(cx - 3, y + 13, 6, 7, '#e8493a'); ctx.globalAlpha = g; R(cx - 2, y + 15, 4, 3, '#ffd870'); ctx.globalAlpha = 1; R(cx - 5, y + 21, 10, 1, '#4a3020'); },
    dgia(cx, y, f) { R(cx - 6, y + 12, 9, 4, '#7a4b2a'); R(cx - 6, y + 12, 9, 1, '#a06a30'); R(cx + 2, y + 15, 1, 6, '#7a4b2a'); R(cx - 7, y + 19, 12, 3, '#c8c0a8'); R(cx - 6, y + 20, 10, 1, '#8a8470'); },
    son(cx, y, f) { R(cx - 9, y + 14, 3, 14, '#b0382a'); R(cx + 6, y + 14, 3, 14, '#b0382a'); R(cx - 11, y + 12, 22, 3, '#7a2a20'); R(cx - 9, y + 17, 18, 2, '#7a2a20'); R(cx - 4, y + 20, 8, 8, '#ffffff'); R(cx - 3, y + 21, 6, 6, '#1f4a3c'); R(cx - 1, y + 22, 3, 3, '#ffffff'); R(cx - 3, y + 21, 3, 3, '#cfeedd'); },
    khoc(cx, y, f) { R(cx - 7, y + 15, 14, 8, '#7a4b2a'); R(cx - 7, y + 15, 14, 3, '#a06a30'); R(cx - 7, y + 18, 14, 1, '#4a2a10'); R(cx - 1, y + 18, 3, 4, '#f0c24a'); R(cx - 7, y + 15, 14, 1, DK); },
    ham(cx, y, f) { R(cx - 8, y + 12, 16, 12, DK); R(cx - 6, y + 10, 12, 4, '#6a5a4a'); R(cx - 6, y + 14, 12, 10, '#0c0a08'); R(cx - 7, y + 12, 2, 10, '#6a5a4a'); R(cx + 5, y + 12, 2, 10, '#6a5a4a'); R(cx - 5, y + 20, 5, 3, '#6a5a4a'); R(cx - 4, y + 22, 1, 1, '#c8b060'); R(cx + 2, y + 13, 1, 8, '#7a4b2a'); R(cx + 1, y + 12, 5, 2, '#b8c2d0'); },
    den(cx, y, f) { R(cx - 8, y + 12, 16, 12, '#0c0a14'); R(cx - 6, y + 10, 12, 4, '#2a1f3a'); R(cx - 5, y + 14, 10, 9, '#16101f'); const e = Math.round(f / 18) % 7 === 0 ? 1 : 3; R(cx - 4, y + 16, 3, e, '#d8302a'); R(cx + 1, y + 16, 3, e, '#d8302a'); R(cx - 3, y + 20, 6, 1, '#6a5a8a'); },
    tau(cx, y, f) { R(cx - 9, y + 20, 18, 3, '#7a4b2a'); R(cx - 9, y + 23, 2, 3, '#5a3a1a'); R(cx + 7, y + 23, 2, 3, '#5a3a1a'); R(cx, y + 8, 1, 12, '#4a3020'); tri(cx + 1, y + 9, cx + 8, y + 19, cx + 1, y + 19, '#f4f0e0'); tri(cx - 1, y + 11, cx - 6, y + 19, cx - 1, y + 19, '#d8d0b8'); R(cx - 6, y + 19, 12, 2, '#4a3020'); },
    cua(cx, y, f) { const p = 0.6 + 0.4 * Math.sin(f * 0.12); R(cx - 9, y + 10, 4, 18, '#3a2a5a'); R(cx + 5, y + 10, 4, 18, '#3a2a5a'); R(cx - 9, y + 8, 18, 4, '#4a3270'); ctx.globalAlpha = p; R(cx - 5, y + 12, 10, 16, '#b878ff'); ctx.globalAlpha = p * 0.7; R(cx - 3, y + 15, 6, 11, '#f0d8ff'); ctx.globalAlpha = 1; R(cx - 1, y + 5, 2, 3, '#d8a8ff'); },
    ai(cx, y, f) { R(cx - 12, y + 8, 7, 24, '#767684'); R(cx + 5, y + 8, 7, 24, '#767684'); R(cx - 12, y + 6, 24, 4, '#8a8a98'); for (let i = 0; i < 4; i++) R(cx - 12 + i * 6, y + 3, 3, 4, '#8a8a98'); R(cx - 5, y + 14, 10, 18, '#1a1a22'); R(cx - 4, y + 13, 8, 2, '#8a8a98'); R(cx - 1, y - 2, 1, 6, '#4a3020'); R(cx, y - 2, 6 + Math.round(Math.sin(f * 0.2)), 3, '#c0302a'); },
    rong(cx, y, f) { R(cx - 1, y + 4, 2, 14, '#6a4a2a'); tri(cx - 10, y + 10, cx, y + 2, cx + 10, y + 10, '#d8553a'); R(cx - 10, y + 10, 20, 1, '#a8301f'); R(cx - 7, y + 15, 14, 7, '#8a5a2a'); R(cx - 7, y + 15, 14, 1, '#b07a3a'); R(cx - 5, y + 13, 3, 3, '#58b36a'); R(cx, y + 13, 3, 3, '#e8d9a0'); R(cx - 6, y + 22, 3, 3, DK); R(cx + 3, y + 22, 3, 3, DK); },
    lang(cx, y, f) { tri(cx - 10, y + 24, cx, y + 6, cx + 10, y + 24, '#a07a4a'); tri(cx - 3, y + 24, cx, y + 14, cx + 3, y + 24, DK); R(cx - 1, y + 2, 1, 5, '#4a3020'); R(cx, y + 2, 4, 3, '#58b36a'); }
  };

  // công trình riêng không dùng nhà chung
  function special(id, x, gy, w, o, f) {
    const d = DEFS[id], h = d.h, top = gy - h, cx = x + w / 2;
    if (id === 'vo') { // võ đài: bệ tròn có hàng rào và cờ
      R(x, gy - 10, w, 10, '#7a6a50'); R(x + 1, gy - 12, w - 2, 4, '#b09a70'); R(x + 4, gy - 11, w - 8, 2, '#8a3a3a'); R(x + 2, gy - 9, w - 4, 1, '#5a4a30');
      R(x + 1, top + 4, 2, 14, '#4a3020'); R(x + w - 3, top + 4, 2, 14, '#4a3020'); R(x + 1, top + 3, 9, 3, '#b0382a'); R(x + w - 10, top + 3, 9, 3, '#b0382a');
      E.vo(cx, top - 4, f); return;
    }
    if (id === 'ham') { R(x, gy - 16, w, 16, '#3a3028'); R(x + 3, gy - 18, w - 6, 3, '#5a4a3a'); R(x - 2, gy - 22, w + 4, 8, '#6a5a4a'); R(x + 2, gy - 20, w - 4, 4, '#7a6a5a'); E.ham(cx, gy - 30, f); return; }
    if (id === 'den') { R(x, gy - 18, w, 18, '#1a1424'); R(x - 2, gy - 22, w + 4, 8, '#2a1f3a'); R(x + 2, gy - 20, w - 4, 4, '#3a2a4a'); E.den(cx, gy - 30, f); return; }
    if (id === 'tau') { R(x - 2, gy - 6, w + 4, 6, '#7a4b2a'); for (let i = 0; i < 5; i++) R(x - 1 + i * 7, gy - 5, 1, 5, '#4a2a10'); E.tau(cx, gy - 30, f); R(x - 2, gy, w + 4, 2, '#3f8ee0'); return; }
    if (id === 'cua') { E.cua(cx, gy - 36, f); R(x + 2, gy - 3, w - 4, 3, '#2a1f3a'); return; }
    if (id === 'ai') { E.ai(cx, gy - 34, f); return; }
    if (id === 'son') { E.son(cx, gy - 40, f); R(x + 4, gy - 4, w - 8, 4, '#6a6a7a'); R(x + 6, gy - 2, w - 12, 2, '#8a8a98'); return; }
    if (id === 'tang') { // gác ba tầng
      const tier = (xx, yy, ww, hh, col, roof) => { R(xx, yy - hh, ww, hh, col); R(xx, yy - hh, ww, 2, '#ffffff22'); tri(xx - 4, yy - hh + 1, xx + ww / 2, yy - hh - 6, xx + ww + 4, yy - hh + 1, roof); R(xx - 4, yy - hh, ww + 8, 2, roof); R(xx + 3, yy - hh + 4, 3, 3, '#ffe9a8'); R(xx + ww - 6, yy - hh + 4, 3, 3, '#ffe9a8'); };
      tier(x, gy, w, 14, d.col, d.roof); tier(x + 4, gy - 20, w - 8, 12, shade(d.col, 10), d.roof); tier(x + 8, gy - 38, w - 16, 10, shade(d.col, 20), d.roof);
      R(cx - 3, gy - 12, 6, 12, DK); R(cx - 2, gy - 11, 4, 1, '#ffffff22'); E.tang(cx, gy - 44, f); return;
    }
    if (id === 'dien') { // đại điện: bậc thềm, cột đỏ, mái hai tầng viền vàng
      R(x - 4, gy - 4, w + 8, 4, '#8a8a98'); R(x - 2, gy - 6, w + 4, 2, '#a8a8b6');
      R(x, gy - 24, w, 18, d.col); R(x, gy - 24, w, 2, '#ffffff22'); for (let i = 0; i < 4; i++) R(x + 2 + i * (w - 6) / 3, gy - 22, 2, 16, '#6a1a10');
      R(cx - 4, gy - 16, 8, 10, DK); R(cx - 3, gy - 15, 6, 1, '#ffffff22');
      tri(x - 6, gy - 22, cx, gy - 36, x + w + 6, gy - 22, d.roof); R(x - 6, gy - 24, w + 12, 3, d.roof); R(x - 6, gy - 22, w + 12, 1, '#f0c24a');
      tri(x - 2, gy - 34, cx, gy - 44, x + w + 2, gy - 34, shade(d.roof, 12)); R(x - 2, gy - 36, w + 4, 2, shade(d.roof, 12)); R(x - 2, gy - 34, w + 4, 1, '#f0c24a');
      E.dien(cx, gy - 62, f); return;
    }
    if (id === 'tran') { // trận đài: bệ đá, hai trụ, cổng xoáy xanh ngọc
      const p = 0.6 + 0.4 * Math.sin(f * 0.12);
      R(x - 3, gy - 5, w + 6, 5, '#767684'); R(x - 1, gy - 8, w + 2, 3, '#9a9aa8'); R(x, gy - 6, w, 1, '#b8b8c4');
      for (let i = 0; i < 5; i++) R(x + 2 + i * Math.floor((w - 6) / 4), gy - 7, 2, 1, '#6af0c8');
      R(cx - 10, gy - 30, 4, 25, '#8f8a80'); R(cx + 6, gy - 30, 4, 25, '#8f8a80'); R(cx - 12, gy - 33, 24, 4, '#b9b3a6');
      ctx.globalAlpha = p; R(cx - 6, gy - 28, 12, 22, '#2fd8a8'); ctx.globalAlpha = p * 0.7; R(cx - 3, gy - 24, 6, 14, '#d8fff0'); ctx.globalAlpha = 1;
      R(cx - 1, gy - 38, 2, 5, '#6af0c8'); R(cx - 3, gy - 36, 6, 1, '#6af0c8'); return;
    }
    if (id === 'bi') { // đài đại bỉ: bệ vuông, hàng rào, hai cờ, đèn lồng
      const w1 = Math.round(Math.sin(f * 0.2) * 1);
      R(x - 2, gy - 8, w + 4, 8, '#8a7a5a'); R(x, gy - 10, w, 3, '#c8b890'); R(cx - 6, gy - 9, 12, 2, '#b0382a'); R(x + 1, gy - 7, w - 2, 1, '#5a4a30');
      R(x, gy - 24, 2, 15, '#4a3020'); R(x + w - 2, gy - 24, 2, 15, '#4a3020'); R(x + 2, gy - 24, 8 + w1, 5, '#d8302a'); R(x + w - 10 - w1, gy - 24, 8 + w1, 5, '#3a78d8');
      R(x + 3, gy - 14, 3, 4, '#f0c24a'); R(x + w - 6, gy - 14, 3, 4, '#f0c24a'); R(cx - 1, gy - 22, 2, 12, '#7a2a20'); R(cx - 4, gy - 22, 8, 2, '#c8402a'); return;
    }    if (id === 'rong') { E.rong(cx, gy - 26, f); return; }
    if (id === 'lang') { E.lang(cx, gy - 26, f); return; }
  }

  function draw(ctx0, id, x, gy, w, opt) {
    ctx = ctx0; opt = opt || {}; w = w || 30;
    const d = DEFS[id]; if (!d) return;
    const f = opt.frame || 0, h = d.h;
    if (opt.hover) { ctx.globalAlpha = 0.35; R(x - 3, gy - h - 16, w + 6, h + 18, '#ffd870'); ctx.globalAlpha = 1; }
    if (['vo', 'ham', 'den', 'tau', 'cua', 'ai', 'son', 'rong', 'lang', 'tang', 'dien', 'tran', 'bi'].indexOf(id) >= 0) { special(id, x, gy, w, opt, f); return; }
    const hh = Math.min(h, id === 'tuu' || id === 'quan' ? 28 : 25), hs = house(x, gy, w, hh, d);
    // biểu tượng đặt trên mái (biển hiệu lớn) để không che cửa; khung vẽ biểu tượng cao khoảng 14 pixel ngay trên đỉnh mái
    if (E[id]) E[id](hs.cx, hs.top - 21, f);
  }

  ui.bld = { defs: DEFS, draw, ids: Object.keys(DEFS) };
})();
