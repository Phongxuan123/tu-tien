// Chạy tests.html trong Chromium không giao diện và in kết quả.
//   node tools/run-tests.js            chạy tất cả
//   node tools/run-tests.js S1         chỉ chạy bài có tên chứa "S1"
// Cần Playwright (đã cài sẵn trong môi trường đám mây). Thoát mã 1 nếu có bài lỗi.
const path = require('path');
const { pathToFileURL } = require('url');
let playwright;
for (const p of ['playwright', '/opt/node-tools/node_modules/playwright']) { try { playwright = require(p); break; } catch (e) { /* thử đường khác */ } }
if (!playwright) { console.error('Không tìm thấy Playwright.'); process.exit(2); }

(async () => {
  const only = process.argv[2] || '';
  const url = pathToFileURL(path.join(__dirname, '..', 'tests.html')).href + (only ? '?only=' + encodeURIComponent(only) : '');
  const browser = await playwright.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  const t0 = Date.now();
  await page.goto(url);
  await page.waitForFunction(() => window.__done === true, null, { timeout: 15 * 60 * 1000, polling: 500 });
  const lines = await page.$$eval('#out > div', els => els.map(e => e.className + '|' + e.textContent));
  await browser.close();
  let bad = 0;
  lines.forEach(l => { const i = l.indexOf('|'), cls = l.slice(0, i), t = l.slice(i + 1); if (cls === 'fail') bad++; if (cls !== 'ok' || /^---/.test(t) || process.env.VERBOSE) console.log((cls === 'fail' ? '✗ ' : '') + t); });
  errors.forEach(e => console.log('Lỗi trang: ' + e));
  console.log('Thời gian: ' + Math.round((Date.now() - t0) / 1000) + ' s');
  process.exit(bad || errors.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
