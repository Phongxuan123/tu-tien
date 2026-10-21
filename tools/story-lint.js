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
load('js/systems/story.js');

const arcs = ctx.TT.data.STORY.arcs, errs = ctx.TT.story.lint();
const chang = arcs.reduce((a, x) => a + Object.keys(x.chang).length, 0);
const warns = ctx.TT.story.warn();
if (process.argv.includes('--warn')) warns.forEach(w => console.log('CẢNH BÁO ' + w));
else if (warns.length) console.log(warns.length + ' tuyến cũ chưa đạt luật mục 8 (cảnh báo, chạy với --warn để xem).');
if (errs.length) { errs.forEach(e => console.log('LỖI ' + e)); console.log(errs.length + ' lỗi trong ' + arcs.length + ' tuyến.'); process.exit(1); }
console.log('story-lint sạch: ' + arcs.length + ' tuyến, ' + chang + ' chặng.');
