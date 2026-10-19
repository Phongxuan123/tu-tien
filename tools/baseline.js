// Đường cơ sở thế giới: dựng thế giới cho vài hạt giống, chạy N năm mô phỏng thế lực rồi băm trạng thái và đếm biến cố.
// Dùng để chứng minh một chặng "không đổi cân bằng" (hash trùng khít) hoặc để so số đo trước/sau khi cố ý đổi.
//   node tools/baseline.js                  in kết quả
//   node tools/baseline.js --save           ghi tools/baseline/seeds.json
//   node tools/baseline.js --check          so với tools/baseline/seeds.json, thoát mã 1 nếu lệch
//   tùy chọn: --set=sect.purge.chance=0.07 (chỉnh D.SECT_MOD; không tiền tố sect thì chỉnh D.NATION)
//             --seeds=301,911 --years=300 --nation=off (tắt S3: phải trùng khít đường cơ sở trước S3)
//             --faith=off (tắt S5: phải trùng khít đường cơ sở trước S5; --set=faith.entry.k=0.05 chỉnh D.FAITH)
//             --sect=off (tắt S4: phải trùng khít đường cơ sở trước S4). --eco=off (tắt móc kinh tế E7a: D.ECO.sx = false), --hq=off (tắt hội và giám định E7b: D.ECO.hq = false).
//             --army=off (tắt S6a quân lực: phải trùng khít đường cơ sở trước S6a; --set=army.ratio.war=0.08 chỉnh D.ARMY).
//             --totalwar=off (tắt S6b chiến tranh tổng: phải trùng khít đường cơ sở trước S6b; --set=totalwar.open.chance=0.05 chỉnh D.TOTALWAR).
//             In thêm: số đại chiến mỗi thế giới, số lần mở, cách nhau tối thiểu (chỉ tiêu: không quá một lần trong 150 năm), kết cục.
//             Không ghi --seeds thì dùng danh sách trong seeds.json (nếu có).
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
let playwright;
for (const p of ['playwright', '/opt/node-tools/node_modules/playwright']) { try { playwright = require(p); break; } catch (e) { /* thử đường khác */ } }
if (!playwright) { console.error('Không tìm thấy Playwright.'); process.exit(2); }

const arg = k => { const a = process.argv.find(x => x.indexOf('--' + k + '=') === 0); return a ? a.slice(a.indexOf('=') + 1) : null; };
const FILE = path.join(__dirname, 'baseline', 'seeds.json');
const FILE_SEEDS = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')).seeds.map(o => o.seed) : null;
const SEEDS = arg('seeds') ? arg('seeds').split(',').map(Number) : (FILE_SEEDS || [301, 911, 77, 5, 12, 33]);
const YEARS = +(arg('years') || 300);
const NATION_OFF = arg('nation') === 'off';
const SECT_OFF = arg('sect') === 'off';
const FAITH_OFF = arg('faith') === 'off';
const ECO_OFF = arg('eco') === 'off';
const HQ_OFF = arg('hq') === 'off';
const ARMY_OFF = arg('army') === 'off';
const TW_OFF = arg('totalwar') === 'off';
const SET = arg('set') ? arg('set').split(',').map(x => x.split('=')) : []; // ví dụ --set=power.kVan=0,van.base=50: chỉnh D.NATION để đo thử

// Chạy trong trang: trả về { hash, chiến tranh, diệt vong, đổi chủ, ... } cho một hạt giống.
function inPage(seed, years, natOff, sectOff, faithOff, set, ecoOff, hqOff, armyOff, twOff) {
  TT.data.NATION.on = !natOff; TT.data.ARMY.on = !armyOff; TT.data.SECT_MOD.on = !sectOff; TT.data.FAITH.on = !faithOff; TT.data.ECO.sx = !ecoOff; TT.data.ECO.hq = !hqOff; TT.data.TOTALWAR.on = !twOff;
  const ROOT = { sect: 'SECT_MOD', faith: 'FAITH', army: 'ARMY', totalwar: 'TOTALWAR' };
  set.forEach(kv => { const p = kv[0].split('.'), root = TT.data[ROOT[p[0]] || 'NATION']; if (ROOT[p[0]]) p.shift(); let o = root; for (let i = 0; i < p.length - 1; i++) o = o[p[i]]; o[p[p.length - 1]] = +kv[1]; });
  TT.config.autosaveMonths = 1e12; TT.config.persistMeta = false;
  const hash = s => { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h.toString(16); };
  const fx = {}, fnote = TT.faith.note; TT.faith.note = function (t, k) { fx[k] = (fx[k] || 0) + 1; return fnote.apply(this, arguments); };
  TT.life.createWorld(seed);
  // Đếm biến cố bằng cách bọc hàm (sử ký bị cắt ở 300 mục nên không đếm từ sử ký được). Bọc không gọi rng.
  const n = { wars: 0, destroyed: 0, rulers: 0, purges: 0, twStarts: [], twKinds: {} };
  const pg = TT.sectmod.purge; TT.sectmod.purge = function () { n.purges++; return pg.apply(this, arguments); };
  const sw = TT.fac.startWar, ds = TT.fac.destroy, ew = TT.fac.endWar;
  TT.fac.startWar = function () { n.wars++; return sw.apply(this, arguments); };
  TT.fac.destroy = function () { n.destroyed++; return ds.apply(this, arguments); };
  TT.fac.endWar = function (war, res) { if (res !== 'draw') { const lose = TT.fac.get(res === 'a' ? war.b : war.a); if (lose && lose.kind === 'trieu') n.rulers++; } return ew.apply(this, arguments); };
  // Chiến tranh tổng đo riêng: số lần mở (mốc tháng) và kết cục; không cộng vào wars.
  const tws = TT.totalwar.start, twe = TT.totalwar.settle;
  TT.totalwar.start = function (opts) { const r = tws.apply(this, arguments); if (r) n.twStarts.push(TT.world.months); return r; };
  TT.totalwar.settle = function (f, tw, kind) { n.twKinds[kind] = (n.twKinds[kind] || 0) + 1; return twe.apply(this, arguments); };
  const t0 = performance.now();
  for (let y = 0; y < years; y++) { TT.world.months += 12; TT.fac.yearly(); }
  const ms = Math.round(performance.now() - t0);
  TT.fac.startWar = sw; TT.fac.destroy = ds; TT.fac.endWar = ew; TT.sectmod.purge = pg; TT.totalwar.start = tws; TT.totalwar.settle = twe;
  // khoảng cách tối thiểu giữa hai đại chiến (tháng); chỉ tiêu: không quá một lần trong 150 năm
  let twGap = Infinity; for (let i = 1; i < n.twStarts.length; i++) twGap = Math.min(twGap, n.twStarts[i] - n.twStarts[i - 1]);
  const f = TT.fac.S(), nt = Object.keys(f.nat || {}).map(k => f.nat[k]);
  const chron = f.chron.map(e => e.m + ':' + e.k + ':' + e.t);
  const list = Object.keys(f.list).sort().map(k => { const x = f.list[k]; return k + ':' + x.state + ':' + Math.round(x.power) + ':' + Math.round(x.unity) + ':' + Math.round(x.wealth) + ':' + (x.ally || []).join('+'); });
  const pacts = (f.pacts || []).map(p => [p.kind, p.a, p.b, Math.round(p.strain), p.defy ? 1 : 0].join(':'));
  return {
    seed, ms, fx,
    rel: hash(JSON.stringify(f.rel)),
    list: hash(list.join('|')),
    chron: hash(chron.join('|')),
    pacts: hash(pacts.join('|')),
    wars: n.wars, destroyed: n.destroyed, rulers: n.rulers, purges: n.purges,
    tw: n.twStarts.length, twGap: twGap === Infinity ? 0 : Math.round(twGap / 12), twKinds: n.twKinds,
    chronLen: f.chron.length, relPairs: Object.keys(f.rel || {}).length,
    mulAvg: TT.fac.list('trieu').reduce((a, x) => a + TT.army.mul(x), 0) / TT.fac.list('trieu').length,
    tranN: nt.filter(e => e.army && e.army.tr > 0).length, satAvg: nt.length ? nt.reduce((a, e) => a + (e.army ? e.army.sat : 0), 0) / nt.length : 0,
    falls: nt.reduce((a, e) => a + e.falls, 0), van: nt.length ? nt.reduce((a, e) => a + e.van, 0) / nt.length : 0, nho: nt.length ? nt.reduce((a, e) => a + e.nho, 0) / nt.length : 0
  };
}

(async () => {
  const browser = await playwright.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  await page.goto(pathToFileURL(path.join(__dirname, '..', 'sim.html')).href);
  const out = [];
  for (const s of SEEDS) out.push(await page.evaluate(`(${inPage.toString()})(${s}, ${YEARS}, ${NATION_OFF}, ${SECT_OFF}, ${FAITH_OFF}, ${JSON.stringify(SET)}, ${ECO_OFF}, ${HQ_OFF}, ${ARMY_OFF}, ${TW_OFF})`));
  await browser.close();
  if (errs.length) { console.error(errs.join('\n')); process.exit(2); }
  const stable = o => ({ seed: o.seed, rel: o.rel, list: o.list, chron: o.chron, pacts: o.pacts, wars: o.wars, destroyed: o.destroyed, rulers: o.rulers, chronLen: o.chronLen, relPairs: o.relPairs });
  const data = { years: YEARS, seeds: out.map(stable) };
  out.forEach(o => console.log('hạt ' + o.seed + ': chiến tranh ' + o.wars + ', diệt vong ' + o.destroyed + ', đổi chủ triều ' + o.rulers + ', thanh trừng ' + o.purges + ', sử ký ' + o.chronLen + ', cặp quan hệ ' + o.relPairs + ', ' + (NATION_OFF ? '' : 'mất mệnh ' + o.falls + ', vận ' + o.van.toFixed(0) + ', nho ' + o.nho.toFixed(0) + ', ') + (TW_OFF ? '' : 'đại chiến ' + o.tw + ' (cách nhau tối thiểu ' + o.twGap + ' năm; ' + Object.keys(o.twKinds).map(k => k + ' ' + o.twKinds[k]).join(', ') + '), ') + o.ms + ' ms, hash ' + o.rel + '/' + o.list + '/' + o.chron + '/' + o.pacts));
  const avg = k => (out.reduce((a, o) => a + o[k], 0) / out.length).toFixed(1);
  console.log('Trung bình: chiến tranh ' + avg('wars') + ', diệt vong ' + avg('destroyed') + ', đổi chủ ' + avg('rulers') + ', thanh trừng ' + avg('purges') + ' (trong ' + YEARS + ' năm)' + (NATION_OFF ? '' : '; mất mệnh ' + avg('falls') + ', quốc vận cuối kỳ ' + avg('van') + ', nho khí ' + avg('nho')) + (ARMY_OFF ? '' : '; triều có trận cuối kỳ ' + avg('tranN') + ', sát khí trung bình ' + avg('satAvg') + ', hệ số quân trung bình ' + avg('mulAvg')));
  if (!TW_OFF) console.log('Chiến tranh tổng (đo riêng, không tính vào 52 chiến tranh): trung bình ' + avg('tw') + ' đại chiến mỗi thế giới (' + YEARS + ' năm), ' + out.filter(o => o.tw > 0).length + '/' + out.length + ' thế giới có ít nhất một, vi phạm chỉ tiêu 150 năm: ' + out.filter(o => o.twGap > 0 && o.twGap < 150).length + ' thế giới.');
  if (!FAITH_OFF) { const kinds = {}; out.forEach(o => Object.keys(o.fx || {}).forEach(k => { kinds[k] = (kinds[k] || 0) + o.fx[k]; })); console.log('Tín ngưỡng, số biến cố mỗi thế giới (300 năm): ' + Object.keys(kinds).sort().map(k => k + ' ' + (kinds[k] / out.length).toFixed(1)).join(', ')); }
  if (process.argv.includes('--save')) { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(data, null, 1) + '\n'); console.log('Đã ghi ' + FILE); }
  if (process.argv.includes('--check')) {
    const base = JSON.parse(fs.readFileSync(FILE, 'utf8')); let bad = 0;
    data.seeds.forEach((o, i) => { const b = base.seeds.find(x => x.seed === o.seed); if (!b || JSON.stringify(b) !== JSON.stringify(o)) { bad++; console.log('LỆCH hạt ' + o.seed + '\n  cơ sở: ' + JSON.stringify(b) + '\n  hiện : ' + JSON.stringify(o)); } });
    console.log(bad ? bad + ' hạt giống lệch đường cơ sở.' : 'Trùng khít đường cơ sở (' + data.seeds.length + ' hạt giống).'); process.exit(bad ? 1 : 0);
  }
})().catch(e => { console.error(e); process.exit(2); });
