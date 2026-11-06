// Đo hiệu năng cảnh pixel trong Chromium không giao diện: ms mỗi khung (trung bình, p95, lớn nhất) và thời gian dựng lại lớp tĩnh.
//   node tools/scene-perf.js            đo các tình huống chính (mỗi tình huống 3 giây)
// Cần Playwright (đã cài sẵn trong môi trường đám mây). In bảng; không đổi gì trong repo.
const path = require('path');
const { pathToFileURL } = require('url');
let playwright;
for (const p of ['playwright', '/opt/node-tools/node_modules/playwright']) { try { playwright = require(p); break; } catch (e) { /* thử đường khác */ } }
if (!playwright) { console.error('Không tìm thấy Playwright.'); process.exit(2); }
const CASES = [
  ['thôn ban ngày', { cls: 'town', phase: 'day', terr: 'trung_chau', vis: ['thon', 'cho', 'yq', 'tro'] }],
  ['thành trì hoàng hôn', { cls: 'city', phase: 'dusk', terr: 'trung_chau', vis: ['quan', 'cho', 'dan', 'khi', 'bua', 'thu'] }],
  ['Kim Phong Môn ban ngày', { cls: 'sect', phase: 'day', terr: 'tay_son', sect: 'ts_kim_phong', vis: ['son', 'chap', 'duoc', 'tang', 'ngoai', 'dien'] }],
  ['Bách Thảo Môn hoàng hôn', { cls: 'sect', phase: 'dusk', terr: 'nam_lam', sect: 'nl_bach_thao', vis: ['son', 'chap', 'duoc', 'tang', 'ngoai', 'dien'] }],
  ['Âm Hồn Giáo ban đêm', { cls: 'sect', phase: 'night', terr: 'vu_trach', sect: 'vt_am_hon', vis: ['son', 'chap', 'duoc', 'tang', 'ngoai', 'dien'] }],
  ['Thủy Nguyệt Cung ban đêm', { cls: 'sect', phase: 'night', terr: 'dong_hai', sect: 'dh_thuy_nguyet', vis: ['son', 'chap', 'duoc', 'tang', 'ngoai', 'dien'] }],
  ['bão biển (mưa nặng, chớp)', { cls: 'port', phase: 'dusk', terr: 'dong_hai', wid: 'bao_bien', vis: ['tau', 'cho', 'tro'] }],
  ['bão tuyết ban đêm', { cls: 'town', phase: 'night', terr: 'bac_bang', wid: 'bao_tuyet', vis: ['thon', 'cho', 'yq', 'tro'] }],
  ['bão cát', { cls: 'town', phase: 'day', terr: 'hoang_mac', wid: 'bao_cat', vis: ['thon', 'cho', 'yq', 'tro'] }],
  ['chiến loạn', { cls: 'city', phase: 'dusk', terr: 'trung_chau', war: true, vis: ['quan', 'cho', 'dan'] }],
  ['đi đường ngự kiếm', { cls: 'road', phase: 'day', terr: 'nam_lam', realm: 3, vis: [] }],
  ['hư không', { cls: 'void', phase: 'void', terr: 'trung_chau', realm: 3, vis: [] }],
  ['bí cảnh tinh thể', { cls: 'secret', phase: 'cave', terr: 'trung_chau', dg: 'bi_canh', node: 'fight', vis: [] }],
  ['hung địa', { cls: 'secret', phase: 'cave', terr: 'trung_chau', dg: 'hung_dia', node: 'boss', vis: [] }]
];
(async () => {
  const browser = await playwright.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.addInitScript(() => localStorage.setItem('tt8b_ui', JSON.stringify({ scene: { fl: true, x: 40, y: 60, s: 2 } })));
  await page.goto(pathToFileURL(path.join(__dirname, '..', 'index.html')).href);
  await page.waitForTimeout(1500);
  const bt = await page.$('text=Bắt đầu'); if (bt) { await bt.click(); await page.waitForTimeout(500); }
  const rows = [];
  for (const [name, o] of CASES) {
    await page.evaluate(o => {
      const ui = TT.ui, base = ui.scene.readState(), T = ui.sc.data.TERRAIN[o.terr];
      ui.scene.force(Object.assign({}, base, { people: [], wid: o.wid || '', war: !!o.war, sect: o.sect || '', terr: T, cls: o.cls, phase: o.phase, vis: o.vis, pages: 1, page: 0, mon: null, foe: null, dgkind: o.dg || '', node: o.node ? { t: o.node } : null, c: Object.assign({}, base.c, { realm: o.realm || 1, dungeon: o.dg ? { name: 'x', kind: o.dg } : null, cross: o.cls === 'void' }) }));
      const f = ui.sc.perf; f.a.length = 0; f.n = 0; f.rebuilds = 0;
    }, o);
    await page.waitForTimeout(3200);
    rows.push([name, await page.evaluate(() => { const f = TT.ui.sc.perf; return { avg: f.avg, p95: f.p95, max: f.max, rebuild: f.rebuild, n: f.a.length }; })]);
  }
  await browser.close();
  console.log('tình huống'.padEnd(30) + 'trung bình'.padStart(12) + 'p95'.padStart(8) + 'lớn nhất'.padStart(10) + 'dựng lại'.padStart(10) + 'khung'.padStart(8));
  rows.forEach(([n, r]) => console.log(n.padEnd(30) + (r.avg.toFixed(2) + ' ms').padStart(12) + r.p95.toFixed(2).padStart(8) + r.max.toFixed(1).padStart(10) + (r.rebuild.toFixed(1) + ' ms').padStart(10) + String(r.n).padStart(8)));
  const all = rows.map(r => r[1].avg); console.log('trung bình chung ' + (all.reduce((a, b) => a + b, 0) / all.length).toFixed(2) + ' ms, nặng nhất ' + Math.max(...all).toFixed(2) + ' ms (mục tiêu dưới 4 ms)');
  errors.forEach(e => console.log('Lỗi trang: ' + e));
  process.exit(errors.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
