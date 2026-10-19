// Đo kinh tế theo hạt giống (E7a): nạp tools/econ-sim.js vào sim.html, chạy econSim (63 chỉ số giá băm, lãi buôn, chênh giá, cú sốc).
//   node tools/econ-check.js                 in kết quả (mặc định 40 hạt giống 101-140, 300 năm như đường cơ sở thế giới)
//   node tools/econ-check.js --save          ghi tools/baseline/econ.json
//   node tools/econ-check.js --check         so băm với tools/baseline/econ.json, thoát mã 1 nếu lệch
//   --eco=off        tắt móc kinh tế E7a (D.ECO.sx = false): phải trùng khít mốc trước E7a
//   --hq=off         tắt hội và giám định E7b (D.ECO.hq = false)
//   --tw=off         tắt chiến tranh tổng S6b (D.TOTALWAR.on = false): phải trùng khít mốc trước S6b
//   --seeds=101,102 --years=60   tùy chọn
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
let playwright;
for (const p of ['playwright', '/opt/node-tools/node_modules/playwright']) { try { playwright = require(p); break; } catch (e) { /* thử đường khác */ } }
if (!playwright) { console.error('Không tìm thấy Playwright.'); process.exit(2); }

const arg = k => { const a = process.argv.find(x => x.indexOf('--' + k + '=') === 0); return a ? a.slice(a.indexOf('=') + 1) : null; };
const FILE = path.join(__dirname, 'baseline', 'econ.json');
const WORLD = path.join(__dirname, 'baseline', 'seeds.json');
const SEEDS = arg('seeds') ? arg('seeds').split(',').map(Number) : JSON.parse(fs.readFileSync(WORLD, 'utf8')).seeds.map(o => o.seed);
const YEARS = +(arg('years') || 300);
const ECO_OFF = arg('eco') === 'off';
const HQ_OFF = arg('hq') === 'off';
const TW_OFF = arg('tw') === 'off';
const COURT_OFF = arg('court') === 'off';

(async () => {
  const browser = await playwright.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  await page.goto(pathToFileURL(path.join(__dirname, '..', 'sim.html')).href);
  await page.addScriptTag({ path: path.join(__dirname, 'econ-sim.js') });
  const out = [];
  for (const s of SEEDS) {
    out.push(await page.evaluate(([seed, years, off, hqOff, twOff, courtOff]) => { if (TT.data.ECO) { TT.data.ECO.sx = !off; TT.data.ECO.hq = !hqOff; } TT.data.TOTALWAR.on = !twOff; TT.data.COURT.on = !courtOff; return econSim(seed, years, false); }, [s, YEARS, ECO_OFF, HQ_OFF, TW_OFF, COURT_OFF]));
  }
  await browser.close();
  if (errs.length) { console.error(errs.join('\n')); process.exit(2); }
  const data = { years: YEARS, seeds: out.map(o => ({ seed: o.seed, hash: o.hash })) };
  out.forEach(o => console.log('hạt ' + o.seed + ': hash ' + o.hash + ', lệch giá ' + o.dev.toFixed(3) + ', chênh vùng ' + o.gap.toFixed(2) + ' (max ' + o.gapMax.toFixed(2) + '), lãi tối đa/chuyến ' + (o.profit * 100).toFixed(1) + '% (max ' + (o.profitMax * 100).toFixed(0) + '%), cú sốc ' + o.shocks));
  const avg = k => out.reduce((a, o) => a + o[k], 0) / out.length;
  console.log('Trung bình ' + out.length + ' hạt giống, ' + YEARS + ' năm: lệch giá ' + avg('dev').toFixed(3) + ', chênh vùng ' + avg('gap').toFixed(2) + ', lãi tối đa/chuyến ' + (avg('profit') * 100).toFixed(1) + '%, cú sốc ' + avg('shocks').toFixed(1) + ' mỗi thế giới');
  if (process.argv.includes('--save')) { fs.writeFileSync(FILE, JSON.stringify(data, null, 1) + '\n'); console.log('Đã ghi ' + FILE); }
  if (process.argv.includes('--check')) {
    const base = JSON.parse(fs.readFileSync(FILE, 'utf8')); let bad = 0;
    data.seeds.forEach(o => { const b = base.seeds.find(x => x.seed === o.seed); if (!b || b.hash !== o.hash) { bad++; console.log('LỆCH hạt ' + o.seed + ': mốc ' + (b && b.hash) + ', hiện ' + o.hash); } });
    console.log(bad ? bad + ' hạt giống lệch mốc kinh tế.' : 'Băm giá trùng khít mốc (' + data.seeds.length + ' hạt giống).'); process.exit(bad ? 1 : 0);
  }
})().catch(e => { console.error(e); process.exit(2); });
