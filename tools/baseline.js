// Đường cơ sở thế giới: dựng thế giới cho vài hạt giống, chạy N năm mô phỏng thế lực rồi băm trạng thái và đếm biến cố.
// Dùng để chứng minh một chặng "không đổi cân bằng" (hash trùng khít) hoặc để so số đo trước/sau khi cố ý đổi.
//   node tools/baseline.js                  in kết quả
//   node tools/baseline.js --save           ghi tools/baseline/seeds.json
//   node tools/baseline.js --check          so với tools/baseline/seeds.json, thoát mã 1 nếu lệch
//   tùy chọn: --seeds=301,911 --years=300 --nation=off (tắt S3: phải trùng khít đường cơ sở trước S3)
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
let playwright;
for (const p of ['playwright', '/opt/node-tools/node_modules/playwright']) { try { playwright = require(p); break; } catch (e) { /* thử đường khác */ } }
if (!playwright) { console.error('Không tìm thấy Playwright.'); process.exit(2); }

const arg = k => { const a = process.argv.find(x => x.indexOf('--' + k + '=') === 0); return a ? a.slice(a.indexOf('=') + 1) : null; };
const SEEDS = (arg('seeds') || '301,911,77,5,12,33').split(',').map(Number);
const YEARS = +(arg('years') || 300);
const NATION_OFF = arg('nation') === 'off';
const SET = arg('set') ? arg('set').split(',').map(x => x.split('=')) : []; // ví dụ --set=power.kVan=0,van.base=50: chỉnh D.NATION để đo thử
const FILE = path.join(__dirname, 'baseline', 'seeds.json');

// Chạy trong trang: trả về { hash, chiến tranh, diệt vong, đổi chủ, ... } cho một hạt giống.
function inPage(seed, years, natOff, set) {
  TT.data.NATION.on = !natOff;
  set.forEach(kv => { const p = kv[0].split('.'); if (p.length > 1) TT.data.NATION[p[0]][p[1]] = +kv[1]; else TT.data.NATION[p[0]] = +kv[1]; });
  TT.config.autosaveMonths = 1e12; TT.config.persistMeta = false;
  const hash = s => { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h.toString(16); };
  TT.life.createWorld(seed);
  // Đếm biến cố bằng cách bọc hàm (sử ký bị cắt ở 300 mục nên không đếm từ sử ký được). Bọc không gọi rng.
  const n = { wars: 0, destroyed: 0, rulers: 0 };
  const sw = TT.fac.startWar, ds = TT.fac.destroy, ew = TT.fac.endWar;
  TT.fac.startWar = function () { n.wars++; return sw.apply(this, arguments); };
  TT.fac.destroy = function () { n.destroyed++; return ds.apply(this, arguments); };
  TT.fac.endWar = function (war, res) { if (res !== 'draw') { const lose = TT.fac.get(res === 'a' ? war.b : war.a); if (lose && lose.kind === 'trieu') n.rulers++; } return ew.apply(this, arguments); };
  const t0 = performance.now();
  for (let y = 0; y < years; y++) { TT.world.months += 12; TT.fac.yearly(); }
  const ms = Math.round(performance.now() - t0);
  TT.fac.startWar = sw; TT.fac.destroy = ds; TT.fac.endWar = ew;
  const f = TT.fac.S(), nt = Object.keys(f.nat || {}).map(k => f.nat[k]);
  const chron = f.chron.map(e => e.m + ':' + e.k + ':' + e.t);
  const list = Object.keys(f.list).sort().map(k => { const x = f.list[k]; return k + ':' + x.state + ':' + Math.round(x.power) + ':' + Math.round(x.unity) + ':' + Math.round(x.wealth) + ':' + (x.ally || []).join('+'); });
  const pacts = (f.pacts || []).map(p => [p.kind, p.a, p.b, Math.round(p.strain), p.defy ? 1 : 0].join(':'));
  return {
    seed, ms,
    rel: hash(JSON.stringify(f.rel)),
    list: hash(list.join('|')),
    chron: hash(chron.join('|')),
    pacts: hash(pacts.join('|')),
    wars: n.wars, destroyed: n.destroyed, rulers: n.rulers,
    chronLen: f.chron.length, relPairs: Object.keys(f.rel || {}).length,
    falls: nt.reduce((a, e) => a + e.falls, 0), van: nt.length ? nt.reduce((a, e) => a + e.van, 0) / nt.length : 0, nho: nt.length ? nt.reduce((a, e) => a + e.nho, 0) / nt.length : 0
  };
}

(async () => {
  const browser = await playwright.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  await page.goto(pathToFileURL(path.join(__dirname, '..', 'sim.html')).href);
  const out = [];
  for (const s of SEEDS) out.push(await page.evaluate(`(${inPage.toString()})(${s}, ${YEARS}, ${NATION_OFF}, ${JSON.stringify(SET)})`));
  await browser.close();
  if (errs.length) { console.error(errs.join('\n')); process.exit(2); }
  const stable = o => ({ seed: o.seed, rel: o.rel, list: o.list, chron: o.chron, pacts: o.pacts, wars: o.wars, destroyed: o.destroyed, rulers: o.rulers, chronLen: o.chronLen, relPairs: o.relPairs });
  const data = { years: YEARS, seeds: out.map(stable) };
  const vv = []; // trung bình van/nho cuối kỳ
  out.forEach(o => console.log('hạt ' + o.seed + ': chiến tranh ' + o.wars + ', diệt vong ' + o.destroyed + ', đổi chủ triều ' + o.rulers + ', sử ký ' + o.chronLen + ', cặp quan hệ ' + o.relPairs + ', ' + (NATION_OFF ? '' : 'mất mệnh ' + o.falls + ', vận ' + o.van.toFixed(0) + ', nho ' + o.nho.toFixed(0) + ', ') + o.ms + ' ms, hash ' + o.rel + '/' + o.list + '/' + o.chron + '/' + o.pacts));
  const avg = k => (out.reduce((a, o) => a + o[k], 0) / out.length).toFixed(1);
  console.log('Trung bình: chiến tranh ' + avg('wars') + ', diệt vong ' + avg('destroyed') + ', đổi chủ ' + avg('rulers') + ' (trong ' + YEARS + ' năm)' + (NATION_OFF ? '' : '; mất mệnh ' + avg('falls') + ', quốc vận cuối kỳ ' + avg('van') + ', nho khí ' + avg('nho')));
  if (process.argv.includes('--save')) { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(data, null, 1) + '\n'); console.log('Đã ghi ' + FILE); }
  if (process.argv.includes('--check')) {
    const base = JSON.parse(fs.readFileSync(FILE, 'utf8')); let bad = 0;
    data.seeds.forEach((o, i) => { const b = base.seeds.find(x => x.seed === o.seed); if (!b || JSON.stringify(b) !== JSON.stringify(o)) { bad++; console.log('LỆCH hạt ' + o.seed + '\n  cơ sở: ' + JSON.stringify(b) + '\n  hiện : ' + JSON.stringify(o)); } });
    console.log(bad ? bad + ' hạt giống lệch đường cơ sở.' : 'Trùng khít đường cơ sở (' + data.seeds.length + ' hạt giống).'); process.exit(bad ? 1 : 0);
  }
})().catch(e => { console.error(e); process.exit(2); });
