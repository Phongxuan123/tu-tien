// Kiểm toàn bộ D.STORY.arcs (js/data/stories/*.js) bằng node, không cần trình duyệt.
//   node tools/story-lint.js        in lỗi, thoát mã 1 nếu có lỗi
// Kiểm: chặng trỏ đúng và tới được từ chặng đầu, 2 đến 4 lựa chọn, mac không bị khóa, gate có lý do, fx chỉ dùng khóa cho phép,
// vòng quay (2 đến 4 vùng, tổng 100, đúng một yếu tố, trần ≤ 15, giá 1..5), hậu quả trễ, kết cục (kv 0..2), khe {khe} có trong vai.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
const load = f => vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), ctx, { filename: f });
load('js/data/nature.js'); load('js/data/story.js'); load('js/data/bonds.js');
const dir = path.join(root, 'js/data/stories');
fs.readdirSync(dir).filter(f => /\.js$/.test(f)).sort().forEach(f => load('js/data/stories/' + f));
load('js/systems/story.js');

const arcs = ctx.TT.data.STORY.arcs, errs = ctx.TT.story.lint();
const chang = arcs.reduce((a, x) => a + Object.keys(x.chang).length, 0);
if (errs.length) { errs.forEach(e => console.log('LỖI ' + e)); console.log(errs.length + ' lỗi trong ' + arcs.length + ' tuyến.'); process.exit(1); }
console.log('story-lint sạch: ' + arcs.length + ' tuyến, ' + chang + ' chặng.');
