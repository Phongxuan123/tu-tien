// Chơi thử một đời bằng đọc (Z "Đặc tả 8B"): chạy một đời với hạt giống cho trước ở chế độ Tự động (Playwright như baseline.js),
// in nhật ký người chơi, tuổi thơ, "Truyện của đời bạn", tính cách đầu/cuối và khí vận kiếm/tiêu ra tệp văn bản.
//   node tools/life-sim.js --seed=101 [--years=80] [--dao=tu_luyen|auto]      ra tools/life-sim/101.txt
//   --nhay=bb_a3:c1   nhảy tới một chặng ngay đầu đời (TT.story.jump) để xem các mốc xa; ghi rõ ở đầu tệp
//   node tools/life-sim.js --batch=101-140 [--years=60]   đo 40 hạt giống bật/tắt truyện (D.STORY.on): chiến tranh, diệt vong, đổi chủ của thế giới và nhịp hộp quyết định
//   của người chơi (chế độ Cân bằng, chọn mặc định), in ra màn hình, không ghi tệp.
// Mặc định ép đạo tu luyện (--dao=auto thì để máy chọn ngã rẽ như Tự động thuần): Tự động thuần có thể chọn đạo giao du hay kiếm sống rồi không bao giờ tới Luyện Khí, khi đó không thấy các mốc truyện sau.
// Dừng khi người chơi mất hoặc hết số năm.
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
let playwright;
for (const p of ['playwright', '/opt/node-tools/node_modules/playwright']) { try { playwright = require(p); break; } catch (e) { /* thử đường khác */ } }
if (!playwright) { console.error('Không tìm thấy Playwright.'); process.exit(2); }

const arg = k => { const a = process.argv.find(x => x.indexOf('--' + k + '=') === 0); return a ? a.slice(a.indexOf('=') + 1) : null; };
const BATCH = arg('batch'), SEED = +(arg('seed') || 101), YEARS = +(arg('years') || 80), DAO = arg('dao') || 'tu_luyen', NHAY = arg('nhay') || '';

// Chạy trong trang: trả về dữ liệu thuần của một đời.
function inPage(seed, years, dao, nhay) {
  TT.config.autosaveMonths = 1e12; TT.config.persistMeta = false;
  // Gom toàn bộ nhật ký người chơi (nhật ký trong game bị cắt ở vài trăm dòng) và đếm hộp quyết định theo loại (Tự động xử lý ngay trong request).
  const all = [], boxes = { story: 0, wheel: 0, other: 0 }, lg = TT.log, rq = TT.decisions.request;
  TT.log = function (c, text) { if (c && c.kind === 'player' && !TT.quiet && all.length < 20000) all.push({ m: TT.world.months, t: text, b: c.birthMonth }); return lg.apply(this, arguments); };
  TT.decisions.request = function (d) { boxes[d.type === 'story' || d.type === 'wheel' ? d.type : 'other']++; return rq.apply(this, arguments); };
  TT.life.createWorld(seed);
  const p = TT.player(); TT.world.settings = TT.world.settings || {}; TT.world.settings.auto = 'tu_dong';
  if (dao !== 'auto') { TT.path.set(p, dao, 'life-sim'); p.pathAsked = true; }
  if (nhay) { const a = nhay.split(':'); TT.world.pending = null; TT.story.jump(a[0], a[1]); }
  const kv = { earned: 0, spent: 0 }, note = TT.kv.note;
  TT.kv.note = function (c, d) { if (c === p) { if (d > 0) kv.earned += d; else kv.spent -= d; } return note.apply(this, arguments); };
  const nat = () => Object.assign({}, TT.nature.get(p)), lab = () => TT.nature.summary(p);
  const o = {
    name: p.name, gender: p.gender, origin: p.origin, region: TT.map.region(p.region).n, born: p.birthMonth,
    tuchat: p.tuchat.total + ' (' + p.tuchat.attrs.map(a => a.n + ' ' + a.p).join(', ') + ')',
    traits: p.traitIds.map(id => TT.data.traitById[id].n),
    nat0: p.child ? Object.assign({}, p.child.nat0) : nat(), nat1: nat(), lab1: lab(), kv0: TT.kv.pts(p),
    child: TT.childhood.summary(p), steps: 0, boxes
  };
  const start = TT.world.months; let dead = false;
  for (let m = 0; m < years * 12; m++) {
    if (TT.player() !== p || !p.alive) { dead = true; break; }
    if (TT.world.pending) { TT.decisions.resolveDefault(); if (TT.player() !== p || !p.alive) { dead = true; break; } }
    TT.life.stepWorld(); o.steps++;
  }
  o.nat2 = nat(); o.lab2 = lab(); o.kv = kv; o.kvEnd = TT.kv.pts(p); o.alive = p.alive; o.age = TT.age(p); o.realm = TT.data.REALM_NAMES[p.realm];
  o.cause = p.cause || ''; o.stories = TT.story.rows(p); o.due = TT.story.pendingDue(p); o.years = Math.round((TT.world.months - start) / 12 * 10) / 10;
  o.log = all.filter(e => e.b === p.birthMonth).map(e => ({ age: Math.floor((e.m - e.b) / 12), t: e.t }));
  TT.log = lg; TT.decisions.request = rq;
  o.fx = p.childFx || {};
  return o;
}

// Chạy trong trang (chế độ --batch): một người chơi trong thế giới, đếm biến cố thế giới và hộp quyết định.
function inBatch(seed, years, storyOn) {
  TT.config.autosaveMonths = 1e12; TT.config.persistMeta = false; TT.data.STORY.on = storyOn;
  const n = { wars: 0, destroyed: 0, rulers: 0 }, sw = TT.fac.startWar, ds = TT.fac.destroy, ew = TT.fac.endWar;
  TT.fac.startWar = function () { const r = sw.apply(this, arguments); const last = TT.fac.S().wars.slice(-1)[0]; if (!(last && last.lt)) n.wars++; return r; };
  TT.fac.destroy = function () { n.destroyed++; return ds.apply(this, arguments); };
  TT.fac.endWar = function (war, res) { if (res !== 'draw') { const lose = TT.fac.get(res === 'a' ? war.b : war.a); if (lose && lose.kind === 'trieu') n.rulers++; } return ew.apply(this, arguments); };
  const o = { story: 0, wheel: 0, t2: 0, t3: 0, kvE: 0, kvS: 0 }, note = TT.kv.note;
  TT.kv.note = function (c, d) { if (c.kind === 'player') { if (d > 0) o.kvE += d; else o.kvS -= d; } return note.apply(this, arguments); };
  try {
    TT.life.createWorld(seed); const p = TT.player(); const y0 = Math.floor(TT.world.months / 12);
    for (let m = 0; m < years * 12 && TT.player() === p && p.alive; m++) {
      const d = TT.world.pending;
      if (d) { if (d.tier === 2) o.t2++; else o.t3++; if (d.type === 'story' || d.type === 'wheel') o[d.type]++; TT.decisions.resolveDefault(); if (TT.player() !== p) break; }
      TT.life.stepWorld();
    }
    o.years = Math.floor(TT.world.months / 12) - y0; o.realm = p.realm; o.alive = p.alive; o.arcs = p.story ? Object.keys(p.story.arcs).length : 0; o.done = p.story ? p.story.done.length : 0;
  } finally { TT.fac.startWar = sw; TT.fac.destroy = ds; TT.fac.endWar = ew; TT.kv.note = note; TT.data.STORY.on = true; }
  return Object.assign(o, n);
}

async function batch() {
  const m = /^(\d+)-(\d+)$/.exec(BATCH); if (!m) { console.error('--batch=101-140'); process.exit(2); }
  const lo = +m[1], hi = +m[2], Y = +(arg('years') || 60);
  const browser = await playwright.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e)));
  await page.goto(pathToFileURL(path.join(__dirname, '..', 'sim.html')).href);
  const res = { off: [], on: [] };
  for (let s = lo; s <= hi; s++) for (const k of ['off', 'on']) res[k].push(await page.evaluate(`(${inBatch.toString()})(${s}, ${Y}, ${k === 'on'})`));
  await browser.close();
  if (errs.length) { console.error(errs.join('\n')); process.exit(2); }
  const avg = (a, k) => (a.reduce((x, o) => x + o[k], 0) / a.length).toFixed(2);
  ['off', 'on'].forEach(k => {
    const a = res[k], yrs = a.reduce((x, o) => x + o.years, 0), boxes = a.reduce((x, o) => x + o.t2 + o.t3, 0);
    console.log('Truyện ' + (k === 'on' ? 'BẬT' : 'TẮT') + ' (' + a.length + ' hạt giống ' + lo + '-' + hi + ', tối đa ' + Y + ' năm mỗi đời): chiến tranh ' + avg(a, 'wars') + ', diệt vong ' + avg(a, 'destroyed') + ', đổi chủ ' + avg(a, 'rulers') +
      '; nhịp ' + (boxes / yrs * 12).toFixed(2) + ' hộp/phút ở x1 (' + yrs + ' năm, tầng 2 ' + a.reduce((x, o) => x + o.t2, 0) + ', tầng 3 ' + a.reduce((x, o) => x + o.t3, 0) + ', truyện ' + a.reduce((x, o) => x + o.story, 0) + ', vòng quay ' + a.reduce((x, o) => x + o.wheel, 0) + ')' +
      '; cảnh giới cuối TB ' + avg(a, 'realm') + ', tuyến mở TB ' + avg(a, 'arcs') + ', tuyến xong TB ' + avg(a, 'done') + ', khí vận kiếm ' + avg(a, 'kvE') + ' tiêu ' + avg(a, 'kvS'));
  });
}

(async () => {
  if (BATCH) return batch();
  const browser = await playwright.chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errs = []; page.on('pageerror', e => errs.push(String(e)));
  await page.goto(pathToFileURL(path.join(__dirname, '..', 'sim.html')).href);
  const o = await page.evaluate(`(${inPage.toString()})(${SEED}, ${YEARS}, '${DAO}', '${NHAY}')`);
  await browser.close();
  if (errs.length) { console.error(errs.join('\n')); process.exit(2); }

  const AX = { tinh: 'Tính tình', xuthe: 'Xử thế', daoduc: 'Đạo đức', tudung: 'Tu dưỡng' };
  const nv = n => Object.keys(AX).map(k => AX[k] + ' ' + (n[k] > 0 ? '+' : '') + Math.round(n[k] * 10) / 10).join(', ');
  const L = [];
  L.push('=== Một đời mô phỏng, hạt giống ' + SEED + ' (Tự động, đạo ' + DAO + ', tối đa ' + YEARS + ' năm' + (NHAY ? '; nhảy tới ' + NHAY + ' ở tháng đầu bằng TT.story.jump' : '') + ') ===');
  L.push(o.name + ' · ' + (o.gender === 'nu' ? 'nữ' : 'nam') + ' · ' + o.origin + ' · vùng ' + o.region);
  L.push('Tư chất ' + o.tuchat + ' · Tiên thiên: ' + (o.traits.length ? o.traits.join(', ') : 'không có'));
  L.push('Tính cách lúc sinh : ' + nv(o.nat0));
  L.push('Sau tuổi thơ       : ' + nv(o.nat1) + ' → ' + o.lab1);
  L.push('Cuối cuộc          : ' + nv(o.nat2) + ' → ' + o.lab2);
  L.push('Khí vận: đầu ' + o.kv0 + ', kiếm +' + o.kv.earned + ', tiêu −' + o.kv.spent + ', cuối ' + o.kvEnd);
  L.push((o.alive ? 'Còn sống sau ' + o.years + ' năm' : 'Mất sau ' + o.years + ' năm') + ', ' + o.age + ' tuổi, cảnh giới ' + o.realm + (o.cause ? ' (' + o.cause + ')' : '') + '. Hộp quyết định: truyện ' + o.boxes.story + ', vòng quay ' + o.boxes.wheel + ', khác ' + o.boxes.other + '.');
  L.push('');
  L.push('--- Tuổi thơ ---');
  o.child.hoi.forEach(h => { L.push('Hồi ' + h.hoi + ' (' + h.age + '):'); h.lines.forEach(l => L.push('  ' + l.t + ' — ' + l.label + ' → ' + l.r)); });
  L.push('Nhận được: ' + (o.child.stats.length ? o.child.stats.map(s => s.n + ' ' + (s.bad ? s.bad.n : (s.v > 0 ? '+' : '') + s.v)).join(', ') : 'không có'));
  L.push('');
  L.push('--- Truyện của đời bạn ---');
  if (!o.stories.length) L.push('(chưa có tuyến nào)');
  o.stories.forEach(s => { L.push(s.n + ' (' + (s.state === 'xong' ? 'xong: ' + s.ket : 'đang đi: ' + s.cur) + ')'); s.log.forEach(t => L.push('  • ' + t)); });
  if (o.due) L.push('Hậu quả còn chờ: ' + o.due + ' (có điều gì đó đang tới)');
  L.push('');
  L.push('--- Nhật ký ---');
  o.log.forEach(e => L.push('[' + String(e.age).padStart(3) + ' tuổi] ' + e.t));
  const dir = path.join(__dirname, 'life-sim'); fs.mkdirSync(dir, { recursive: true });
  const f = path.join(dir, SEED + '.txt'); fs.writeFileSync(f, L.join('\n') + '\n');
  console.log('Đã ghi ' + f + ' (' + o.log.length + ' dòng nhật ký, ' + o.boxes.story + ' hộp truyện, ' + o.boxes.wheel + ' hộp vòng quay).');
})().catch(e => { console.error(e); process.exit(2); });
