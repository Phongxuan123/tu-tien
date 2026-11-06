// Kiểm toàn bộ D.STORY.arcs (js/data/stories/*.js) bằng node, không cần trình duyệt.
//   node tools/story-lint.js        in lỗi, thoát mã 1 nếu có lỗi
// Kiểm: chặng trỏ đúng và tới được từ chặng đầu, 2 đến 4 lựa chọn, mac không bị khóa, gate có lý do, fx chỉ dùng khóa cho phép,
// vòng quay (2 đến 4 vùng, tổng 100, đúng một yếu tố, trần ≤ 15, giá 1..5), hậu quả trễ, kết cục (kv 0..2), khe {khe} có trong vai.
// K1: khóa mới (lon, canh, sau, sau_neu, d_neu, can, mat, can_gan_bo, thu_thach, tre.chang, khe_kb, phan, fx.gan_bo/chet/roi/thu/tong/vat/no/tra_no, điều kiện thân phận).
// Kịch bản kiểu mới (có phan[]) còn bị kiểm các luật đo được của cẩm nang Q mục 8 (mat, cờ đặt và đọc, chặng rẽ, kết cục xấu, can_gan_bo, thử thách, phần thưởng "bấm là được")
// là LỖI; tuyến cũ (không có phan[]) chỉ in CẢNH BÁO (không làm hỏng lần chạy).
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
const load = f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
load('js/data/nature.js'); load('js/data/story.js'); load('js/data/bonds.js'); try { load('js/data/jobs.js'); } catch (e) { /* không có thì bỏ qua kiểm id nghề */ }
const dir = path.join(root, 'js/data/stories');
fs.readdirSync(dir).filter(f => /\.js$/.test(f)).sort().forEach(f => load('js/data/stories/' + f));
const kdir = path.join(root, 'js/data/khuon');
if (fs.existsSync(kdir)) fs.readdirSync(kdir).filter(f => /\.js$/.test(f)).sort().forEach(f => load('js/data/khuon/' + f));
load('js/systems/story.js'); load('js/systems/kb.js'); load('js/systems/khuon.js');

const arcs = ctx.TT.data.STORY.arcs, errs = ctx.TT.story.lint();
// AI1a: khuôn chính, khuôn phụ và kịch bản cụ thể (cụ thể hóa thử bằng nhân vật giả, đủ các xuất thân và mọi phương án lật)
const S = ctx.TT.data.STORY, KB = ctx.TT.kb; let nKhuon = 0, nPhu = 0, nKbc = 0;
Object.keys(S.khuon).forEach(id => {
  nKhuon++; KB.lintKhuon(S.khuon[id]).forEach(e => errs.push('khuôn ' + e));
  const kh = S.khuon[id];
  ['p1', 'p2', 'p3', 'p5', 't1', 't6', 't10'].forEach((xt, i) => {
    for (let k = 1; k <= 6; k++) {
      ctx.TT.bond = { main: () => (k % 2 ? {} : null) };
      const c = { id: i * 10 + k, birthMonth: k * 7, origin2: xt, sect: xt === 't6' ? { id: 'x' } : null, gender: 'nam', realm: 0, kind: 'player', story: { kd: kh.khuyet_diem } };
      const kbc = KB.cuThe(c, kh); nKbc++;
      KB.lintKbc(kbc).forEach(e => errs.push('kbc ' + xt + '#' + k + ' ' + e));
    }
  });
});
Object.keys(S.phu).forEach(id => { nPhu++; KB.lintPhu(S.phu[id]).forEach(e => errs.push('khuôn phụ ' + e)); });
const chang = arcs.reduce((a, x) => a + Object.keys(x.chang).length, 0);
const warns = ctx.TT.story.warn();
if (process.argv.includes('--warn')) warns.forEach(w => console.log('CẢNH BÁO ' + w));
else if (warns.length) console.log(warns.length + ' tuyến cũ chưa đạt luật mục 8 (cảnh báo, chạy với --warn để xem).');
if (errs.length) { errs.forEach(e => console.log('LỖI ' + e)); console.log(errs.length + ' lỗi trong ' + arcs.length + ' tuyến.'); process.exit(1); }
console.log('story-lint sạch: ' + arcs.length + ' tuyến, ' + chang + ' chặng; ' + nKhuon + ' khuôn, ' + nPhu + ' khuôn phụ, ' + nKbc + ' kịch bản cụ thể thử.');
