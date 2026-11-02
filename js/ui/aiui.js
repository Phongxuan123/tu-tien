// Giao diện AI kể chuyện (AI1b): nút "AI kể chuyện" ở thanh trên mở hộp Cài đặt (bật/tắt, khóa Gemini và Anthropic, model từng tầng, hạn mức, bộ đếm)
// và hộp "Thiên Cơ đang chép…" khi dừng thời gian chờ cao trào (TT.aiw.hold). Khóa chỉ lưu localStorage của trình duyệt này, không vào bản lưu.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const h = ui.h;
  let dlg = null, waitEl = null, pollTimer = null;

  function wait(on, left) {
    if (on) {
      if (!waitEl) {
        waitEl = h('div', { id: 'ai-wait', style: 'position:fixed;inset:0;z-index:60;display:flex;align-items:center;justify-content:center;background:rgba(10,8,6,.72)' },
          h('div', { style: 'background:#1d1813;border:1px solid #6b5a3c;color:#e8dfd0;padding:22px 30px;border-radius:6px;text-align:center;font-size:16px' }, h('div', null, 'Thiên Cơ đang chép…'), h('div', { class: 'small', id: 'ai-wait-s', style: 'margin-top:8px;color:#9a8f7e' }, '')));
        document.body.appendChild(waitEl);
      }
      const s = document.getElementById('ai-wait-s'); if (s) s.textContent = 'Còn khoảng ' + Math.ceil(left) + ' giây, quá hạn sẽ dùng dòng dự phòng.';
      if (!pollTimer) pollTimer = setInterval(() => { if (!TT.aiw.poll()) return; }, 500);
    } else {
      if (waitEl) { waitEl.remove(); waitEl = null; }
      if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    }
  }
  TT.bus.on('aiwait', e => wait(e.on, e.left));

  function close() { if (dlg) { dlg.remove(); dlg = null; } }
  function open() {
    close();
    const A = TT.aiw, cfg = A.cfg(), p = TT.player(), st = A.stats(p), msg = h('div', { class: 'small', style: 'min-height:18px' }, '');
    const inp = (type, val, w, ph) => h('input', { type, value: val == null ? '' : val, style: 'width:' + (w || 220) + 'px', placeholder: ph || '' });
    const row = (label, ...els) => h('div', { style: 'display:flex;gap:8px;align-items:center;margin:5px 0;flex-wrap:wrap' }, h('span', { style: 'min-width:150px' }, label), ...els);
    const on = h('input', { type: 'checkbox' }); on.checked = !!cfg.on;
    const prov = h('select', null, h('option', { value: 'gemini' }, 'Gemini (mặc định)'), h('option', { value: 'anthropic' }, 'Anthropic Claude (tùy chọn, cần nạp tiền API)')); prov.value = cfg.provider;
    const kg = inp('password', A.getKey('gemini'), 260, 'Khóa Gemini (AIza…)'), ka = inp('password', A.getKey('anthropic'), 260, 'Khóa Anthropic (sk-ant-…)');
    const m = { gemini: { nho: inp('text', cfg.models.gemini.nho, 200), lon: inp('text', cfg.models.gemini.lon, 200) }, anthropic: { nho: inp('text', cfg.models.anthropic.nho, 200), lon: inp('text', cfg.models.anthropic.lon, 200) } };
    const quota = inp('number', cfg.quota, 80), chua = inp('number', cfg.chuaMax, 80);
    const safety = h('select', null, ...['BLOCK_NONE', 'BLOCK_ONLY_HIGH', 'BLOCK_MEDIUM_AND_ABOVE', 'BLOCK_LOW_AND_ABOVE'].map(v => h('option', { value: v }, v))); safety.value = cfg.safety;
    const save = () => {
      A.setKey('gemini', kg.value); A.setKey('anthropic', ka.value);
      A.setCfg({ on: on.checked, provider: prov.value, quota: Math.max(1, +quota.value || 150), chuaMax: Math.max(3, Math.min(60, +chua.value || 15)), safety: safety.value, models: { gemini: { nho: m.gemini.nho.value.trim(), lon: m.gemini.lon.value.trim() }, anthropic: { nho: m.anthropic.nho.value.trim(), lon: m.anthropic.lon.value.trim() } } });
      msg.textContent = 'Đã lưu (khóa chỉ nằm trong trình duyệt này).';
    };
    const counts = h('div', { class: 'small' }, 'Đời này: ' + st.doi.n + '/' + st.quota + ' lượt gọi, ' + st.doi.tin + ' token vào, ' + st.doi.tout + ' token ra. Tổng mọi đời: ' + st.tong.n + ' lượt, ' + st.tong.tin + ' vào, ' + st.tong.tout + ' ra, ' + st.tong.loi + ' lỗi, ' + st.tong.chan + ' lần bị bộ lọc chặn. Hạt: ' + st.hat + '. Hồ sơ dàn: ' + st.hoso + '.');
    dlg = h('div', { style: 'position:fixed;inset:0;z-index:55;background:rgba(10,8,6,.72);display:flex;align-items:center;justify-content:center;overflow:auto' },
      h('div', { style: 'background:#1d1813;border:1px solid #6b5a3c;color:#e8dfd0;padding:16px 20px;border-radius:6px;max-width:640px;width:94%;max-height:92vh;overflow:auto' },
        h('h3', { style: 'margin:0 0 6px' }, 'AI kể chuyện (thử nghiệm)'),
        h('div', { class: 'small', style: 'color:#9a8f7e;margin-bottom:8px' }, 'AI chỉ viết chữ của truyện lúc chơi; cơ chế, số, phần thưởng vẫn do game giữ. Tắt thì game chạy bằng dòng viết sẵn. Gói Claude Pro không gồm API. Nên giới hạn khóa Gemini theo tên miền *.github.io trong bảng điều khiển Google. Người khác chơi trang này phải nhập khóa của chính họ.'),
        row('Bật AI kể chuyện', on),
        row('Nhà cung cấp', prov),
        row('Khóa Gemini', kg), row('Khóa Anthropic', ka),
        row('Gemini: tầng nhỏ / lớn', m.gemini.nho, m.gemini.lon),
        row('Claude: tầng nhỏ / lớn', m.anthropic.nho, m.anthropic.lon),
        h('div', { class: 'small', style: 'color:#9a8f7e' }, 'Tầng nhỏ: chặng thường, hồ sơ, chỉnh, chấm. Tầng lớn: kịch bản cụ thể, cao trào, ký ức. Tên model sai (404) thì tự dò bản Flash/Pro mới nhất của khóa.'),
        row('Hạn mức lượt gọi mỗi đời', quota), row('Chờ cao trào tối đa (giây)', chua), row('Mức lọc an toàn Gemini', safety),
        counts, msg,
        h('div', { style: 'display:flex;gap:8px;margin-top:10px;flex-wrap:wrap' },
          h('button', { onclick: save }, 'Lưu'),
          h('button', { onclick: () => { save(); msg.textContent = 'Đang thử…'; A.thu(r => { msg.textContent = r.msg; }); } }, 'Lưu và thử kết nối (1 lượt gọi nhỏ)'),
          h('button', { onclick: () => { kg.value = ''; ka.value = ''; save(); msg.textContent = 'Đã xóa khóa.'; } }, 'Xóa khóa'),
          h('button', { onclick: close }, 'Đóng'))));
    document.body.appendChild(dlg);
  }

  ui.aiOpen = open;
  function install() {
    const g = document.querySelector('.fgroup'); if (!g || document.getElementById('btn-ai')) return;
    g.appendChild(h('button', { id: 'btn-ai', title: 'AI kể chuyện: nhập khóa Gemini/Anthropic, chọn model, hạn mức', onclick: open }, 'AI kể chuyện'));
  }
  window.addEventListener('DOMContentLoaded', install);
})();
