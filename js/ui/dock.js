// Khung nổi kéo được: màn hình nhân vật (tách ra, đổi cỡ, gắn lại) và thẻ trạng thái (thu gọn, gắn vào cột trái, kéo đi).
// Vị trí và trạng thái nhớ trong localStorage (khóa tt8b_ui). Điện thoại: không cho tách màn hình nhân vật.
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};
  const D = TT.data;

  const KEY = 'tt8b_ui';
  let st = {}, fresh = true;
  try { const raw = localStorage.getItem(KEY); fresh = !raw; st = JSON.parse(raw || '{}'); } catch (e) { st = {}; }
  st.scene = Object.assign({ fl: false, x: 60, y: 200, s: 1 }, st.scene || {});
  st.stat = Object.assign({ x: null, y: null, docked: false, folded: false }, st.stat || {});
  if (fresh && window.matchMedia('(max-width:800px)').matches) st.stat.folded = true; // điện thoại: thẻ trạng thái mặc định thu gọn để khỏi che màn hình
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) { /* bỏ qua */ } };
  const $ = id => document.getElementById(id);
  const small = () => window.matchMedia('(max-width:800px)').matches;
  const SIZES = [300, 440, 620];

  // Kéo một thẻ bằng phần đầu của nó; giữ thẻ trong màn hình.
  function drag(card, grip, onMove, onEnd) {
    let ox = 0, oy = 0, on = false;
    grip.addEventListener('pointerdown', e => {
      if (e.target.classList.contains('lnk') || !card.classList.contains('floating') && !card.classList.contains('floatcard') || card.classList.contains('docked')) return;
      const r = card.getBoundingClientRect(); card.style.left = r.left + 'px'; card.style.top = r.top + 'px'; card.style.right = 'auto'; card.style.bottom = 'auto';
      ox = e.clientX - r.left; oy = e.clientY - r.top; on = true; grip.setPointerCapture(e.pointerId); e.preventDefault();
    });
    grip.addEventListener('pointermove', e => {
      if (!on) return;
      const x = Math.max(4, Math.min(innerWidth - card.offsetWidth - 4, e.clientX - ox)), y = Math.max(4, Math.min(innerHeight - card.offsetHeight - 4, e.clientY - oy));
      card.style.left = x + 'px'; card.style.top = y + 'px'; onMove(x, y);
    });
    grip.addEventListener('pointerup', () => { if (on) { on = false; onEnd(); } });
  }

  // ---------- màn hình nhân vật ----------
  function applyScene() {
    const card = $('scene-wrap'), ph = $('scene-ph'); if (!card) return;
    const fl = st.scene.fl && !small();
    card.classList.toggle('floating', fl); ph.style.display = fl ? 'block' : 'none';
    if (fl) { card.style.left = st.scene.x + 'px'; card.style.top = st.scene.y + 'px'; card.style.width = SIZES[st.scene.s] + 'px'; } else { card.style.left = card.style.top = card.style.width = ''; }
    $('scene-detach').textContent = fl ? 'gắn lại' : 'tách ra';
  }
  function initScene() {
    const card = $('scene-wrap'); if (!card) return;
    $('scene-detach').onclick = () => { st.scene.fl = !st.scene.fl; applyScene(); save(); };
    $('scene-dock').onclick = () => { st.scene.fl = false; applyScene(); save(); };
    const fx = $('scene-fx'), upd = () => { if (fx) fx.textContent = st.scene.red ? 'đủ hiệu ứng' : 'giảm hiệu ứng'; if (ui.scene && ui.scene.setReduced) ui.scene.setReduced(!!st.scene.red); };
    if (fx) fx.onclick = () => { st.scene.red = !st.scene.red; upd(); save(); }; upd();
    $('scene-size').onclick = () => { st.scene.fl = true; st.scene.s = (st.scene.s + 1) % SIZES.length; applyScene(); save(); };
    drag(card, $('scene-grip'), (x, y) => { st.scene.x = x; st.scene.y = y; }, save);
    applyScene();
  }

  // ---------- thẻ trạng thái ----------
  function statRows(c) {
    const S = TT.stats, rows = [], hm = S.hpMax(c);
    rows.push(['Sinh lực', Math.round(c.hp) + '/' + hm, c.hp / hm, '#34c38f']);
    const need = c.realm < 6 ? D.NEED[Math.min(5, c.realm)] : Infinity;
    rows.push(['Tu vi', Math.floor(c.xp) + '/' + (need === Infinity ? '∞' : need), need === Infinity ? 1 : c.xp / need, '#e8497c']);
    rows.push(['Đạo tâm', String(Math.round(c.daoTam)), c.daoTam / 100, '#3fb8b0']);
    const w = TT.ls.wealth(c), ref = Math.max(300, S.pillCost(c) * 3);
    rows.push(['Linh thạch', TT.ls.fmt(w), Math.min(1, w / ref), '#8a7af0']);
    if (TT.loss.active(c)) { const d = D.WOUND[c.wound.sev]; rows.push([d.n, 'còn ' + TT.loss.left(c) + ' tháng', TT.loss.left(c) / d.months, '#e0564f', true]); }
    return rows;
  }
  let lastHtml = '';
  function renderStat() {
    const c = TT.player(), card = $('statcard'); if (!c || !card) return;
    card.style.display = 'block';
    const html = statRows(c).map(r => '<div class="srow' + (r[4] ? ' warn' : '') + '"><div class="t"><b>' + r[0] + '</b><span>' + ui.esc(r[1]) + '</span></div><div class="bar"><i style="width:' + Math.round(Math.max(0, Math.min(1, r[2])) * 100) + '%;background:' + r[3] + '"></i></div></div>').join('');
    if (html !== lastHtml) { lastHtml = html; $('stat-body').innerHTML = html; }
  }
  function applyStat() {
    const card = $('statcard'); if (!card) return;
    const docked = st.stat.docked;
    card.classList.toggle('docked', docked); card.classList.toggle('floating', !docked); card.classList.toggle('folded', st.stat.folded);
    if (docked) {
      const side = $('side-body'); if (side && card.parentNode !== side.parentNode) side.parentNode.insertBefore(card, side);
      card.style.left = card.style.top = card.style.right = card.style.bottom = '';
    } else {
      if (card.parentNode !== document.body) document.body.appendChild(card);
      if (st.stat.x != null) { card.style.left = st.stat.x + 'px'; card.style.top = st.stat.y + 'px'; card.style.right = 'auto'; card.style.bottom = 'auto'; }
    }
    $('stat-fold').textContent = st.stat.folded ? 'mở ra' : 'thu gọn';
    const dk = $('stat-dock'); if (dk) dk.textContent = docked ? 'tách ra' : 'gắn lại';
  }
  function initStat() {
    const card = $('statcard'); if (!card) return;
    $('stat-grip').querySelector('.cap:last-child').insertAdjacentHTML('afterbegin', '<span class="lnk" id="stat-dock">gắn lại</span> ');
    $('stat-fold').onclick = () => { st.stat.folded = !st.stat.folded; applyStat(); save(); };
    $('stat-dock').onclick = () => { st.stat.docked = !st.stat.docked; if (!st.stat.docked) { st.stat.x = null; } applyStat(); save(); };
    drag(card, $('stat-grip'), (x, y) => { st.stat.x = x; st.stat.y = y; }, save);
    applyStat();
    setInterval(() => { try { renderStat(); } catch (e) { /* chưa có thế giới */ } }, 300);
  }

  function setHH() { const t = $('topbar'); if (t) document.documentElement.style.setProperty('--hh', (small() ? 0 : t.offsetHeight) + 'px'); }
  function init() { initScene(); initStat(); setHH(); addEventListener('resize', () => { setHH(); applyScene(); }); setInterval(setHH, 1500); }
  ui.dock = { init, st: () => st, renderStat };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
