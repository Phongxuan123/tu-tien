// Hình pixel art của 16 loại yêu thú, thủ vệ và thủ lĩnh (tự vẽ bằng bản đồ ký tự, quay mặt sang trái).
// Ký tự: a màu chính, b màu tối, c màu sáng, e mắt, k viền đen, w trắng, y vàng, o cam, r đỏ, g ánh sáng, '.' trong suốt.
// Màu chính theo thuộc tính của quái. Dùng bởi scene.js: TT.ui.sprites.monster(R, id, x, groundY, frame, scale).
(function () {
  const TT = window.TT = window.TT || {};
  const ui = TT.ui = TT.ui || {};

  const ELEM = {
    Phong: ['#8fd8c8', '#4f9a8a', '#d8fff4', '#ff4a4a'], 'Mộc': ['#6ac85a', '#2e7a38', '#b8f0a0', '#ffe04a'], 'Thổ': ['#b8925a', '#7a5a34', '#e0c690', '#ff4a4a'],
    'Băng': ['#bfe8ff', '#6aa8d8', '#ffffff', '#3a7ae8'], 'Hỏa': ['#ff7a3a', '#b8321a', '#ffd27a', '#fff04a'], 'Lôi': ['#ffe05a', '#b89a1a', '#fffbd0', '#8a5aff'],
    'Thủy': ['#4a9ae8', '#2a5aa8', '#a8d8ff', '#ffffff'], Kim: ['#e8d27a', '#9a8a3a', '#fff6c0', '#ff3a3a'], 'Âm': ['#a07ad8', '#5a3a90', '#d8c0ff', '#8affff'], 'Dương': ['#ffb84a', '#d8601a', '#fff0b0', '#ff3a3a']
  };

  // Mỗi mục: map (mảng chuỗi), tùy chọn pal bổ sung (ghi đè), float (lơ lửng), boss (to gấp đôi mặc định).
  const M = {
    soi_gio: { map: [
      '..bb...............',
      '.baab.........bb...',
      '.baaaaaaaaaaabaab..',
      'kaeaaaaaaaaaaaaaab.',
      'kkaaaccaaaaaaaaab..',
      '.kaaaaaaaaaaaaab...',
      '..aaaaaaaaaaaab....',
      '..aba.aba..aba.aba.',
      '..aba.aba..aba.aba.',
      '..kk..kk...kk..kk..'] },
    ran_doc: { map: [
      '..bbbb............',
      '.baaaeb...........',
      '.kaaaaab..........',
      '..kaaab...........',
      '...baaab..........',
      '..bbaaaab.........',
      '.baaaaab..........',
      '.baaaaaaabbb......',
      '..kbaaaaaaaaab....',
      '....kkbbbbbaaab...',
      '..............kkb.'] },
    heo_rung: { map: [
      '...bb..........bb.',
      '..bacb.......bbab.',
      '.kaaaaaaaaaaaaaab.',
      'cweaaaaaaaaaaaaaab',
      'wwkaaaaaaaaaaaaab.',
      '.kkaaaaaaaaaaaab..',
      '..aaaaaaaaaaaab...',
      '..abb.aba..abb.ab.',
      '..abb.aba..abb.ab.',
      '..kk..kk...kk..kk.'] },
    cop_bang: { map: [
      '..bb..........b...',
      '.baab.......bbab..',
      '.baaacaaaaaaaaaab.',
      'kaeaacbaabaabaaab.',
      'kkaaaaaaabaabaab..',
      '.kaaaaaaaaaaaaab..',
      '..aaaaaaaaaaaab...',
      '..aba.aba..aba.ab.',
      '..aba.aba..aba.ab.',
      '..kk..kk...kk..kk.'] },
    hoa_than: { map: [
      '..bbb.............',
      '.baeaab...........',
      '.kaaaaaaaaab......',
      '..kaaaaaaaaaaab...',
      '...kaaaabaabaaab..',
      '..oaaaaaaaaaaaaaab',
      '.ooaba.abaa.aba.ab',
      '.o.kk..kk...kk..kk',
      '....................'] },
    loi_ung: { float: true, map: [
      '..........bb......',
      '....bb...baab.....',
      '...baab.baaaab....',
      '..baaaabaaaaaab...',
      '.baaaaaaaaaaaaab..',
      'kaeaaaaaaaaaab....',
      'kyaaaaaaaaab......',
      '.kaaaaaaab........',
      '..bbaaab..........',
      '...ya.ya..........'] },
    thuy_xa: { map: [
      '...bbbb...........',
      '..baaaeb..........',
      '..kcaaaab.........',
      '...kaaab..........',
      '....baaab.........',
      '...bbaaab.........',
      '..baaaaab.........',
      '..baaaaaabbb......',
      '...kbaaaaaaabb....',
      '....kbcbcbcbaab...',
      '.....kkkkkkkkaab..'] },
    kim_giap: { float: true, map: [
      '..cc....cc.....cc.',
      '.cwcc..cwcc...cwcc',
      '..cc....cc.....cc.',
      '..bkbk..bkbk..bkbk',
      '.kyyyyk.kyyyyk.yyk',
      'eyyyykkkyyyykkkyyk',
      '.kyyyyk.kyyyyk.kk.',
      '..kkkk...kkkk.....'] },
    am_hon: { float: true, map: [
      '...bbbbb..........',
      '..baaaaab.........',
      '.baeaaeaab........',
      '.baaaaaaab........',
      '.baakkkaab........',
      '..baaaaab.........',
      '..baaaaaab........',
      '.baaaaaaaab.......',
      '.ba.baaa.bab......',
      '..b..ba...b.......'] },
    phuong_non: { float: true, map: [
      '....o.....o.......',
      '...oyo...oyo......',
      '..oyyoo.ooyyo.....',
      '.oyyyyoooyyyyo....',
      'ooyyyyyyyyyyyo....',
      'kyeyyyyyyyyyo.....',
      'kooyyyyyyyyo......',
      '.kooyyyyyoo.......',
      '..koooooook.oo....',
      '...ko.ko...oyo....'] },
    thu_ve: { map: [
      '...bbbbbb..........',
      '..bccccccb.........',
      '.bcceccecb.........',
      '.bcccccccb.bbbbb...',
      '..bbbbbbb.bcccccb..',
      '.bcccccccbbcccccb..',
      'bccbcccbccbcccccb..',
      'bcccbcbcccbbcccb...',
      'bccccccccb.bccb....',
      '.bccbbbccb.bccb....',
      '.bccb..bccb.bbb....',
      '.kkkk..kkkk........'] },
    kiem_linh: { float: true, map: [
      '.......c.........c..',
      '......cwc.......cwc.',
      '.....cwac......cwac.',
      '....cwac......cwac..',
      '...cwac......cwac...',
      '..cwac.c....cwac....',
      '.cwac.cwc..cwac.....',
      '.bkb.cwac.bkb.......',
      '.bb.cwac...bb.......',
      '....bkb.............'] },
    long_huyet: { boss: true, map: [
      '.......bb...bb..............',
      '......baab.baab.............',
      '.....baaabbaaab.....b.......',
      '....baaaaaaaaab....bab...bb.',
      '...kaeaaaaaaaaab..baaab.baab',
      '..kaaaaccaaaaaaabbaaaaabaaab',
      '..kkaaaaaaaaaaaaaaaaaaaaaab.',
      '...kkaaaaaaaaaaaaaaaaaaaab..',
      '....kaaaaaaaaaaaaaaaaaaab...',
      '.....kbaaabbaaaaabbaaab.....',
      '......ababa.....ababa.......',
      '......kkkkk.....kkkkk.......'] },
    co_tu: { boss: true, float: true, map: [
      '.....bbbbbbbb......',
      '....baaaaaaaab.....',
      '...baaeaaaaeaab....',
      '...baaaaaaaaaab....',
      '...baakkkkkaaab....',
      '....baaaaaaaab.....',
      '...bbaaaaaaabb.....',
      '..baaaaccaaaaab....',
      '.baaaaaccaaaaaab...',
      '.baaaabbbbaaaaab...',
      '..baab.bbbb.baab...',
      '...b....bb....b....'] },
    bang_vuong: { boss: true, map: [
      '...c..c....c.......c.....',
      '..cwc.cwc..cwc....cwc....',
      '.baabbaabbbaabbbbbaab....',
      'baaeaaaaaaaaaaaaaaaaab...',
      'kaaaaaaccaaaaaaaaaaaaab..',
      'kkaaaaaaaaaaaaaaaaaaaaab.',
      '.kaaaaaaaaaaaaaaaaaaaab..',
      '..kaaaaaaaaaaaaaaaaaab...',
      '..baaabaaab...baaabaaab..',
      '..baaabaaab...baaabaaab..',
      '..bbbbbbbbb...bbbbbbbbb..',
      '..kkkkkkkkk...kkkkkkkkk..'] },
    loi_long: { boss: true, map: [
      '......c.................',
      '.....cyc....bb..........',
      '....bbyb...baab....bb...',
      '...baaebbbbaaab...baab..',
      '..kaaaaaaaaaaab..baaaab.',
      '..kkaaaccaaaaaabbaaaaab.',
      '...kkaaaaaaaaaaaaaaaaab.',
      '....kbaaaaaaaaaaaaaaab..',
      '.....kbbaaaaaaaaaabb....',
      '......c.kbbaaabbk.c.....',
      '.....cyc..kkkkk..cyc....',
      '......c...........c.....'] }
  };

  function color(ch, p, extra) {
    switch (ch) {
      case 'a': return p[0]; case 'b': return p[1]; case 'c': return p[2]; case 'e': return p[3];
      case 'k': return '#14101c'; case 'w': return '#ffffff'; case 'y': return '#ffe04a'; case 'o': return '#ff8a2a'; case 'r': return '#e8433a'; case 'g': return '#fff6c0';
      default: return null;
    }
  }

  // Vẽ yêu thú: R(x,y,w,h,màu) là hàm vẽ ô; (x, gy) là điểm chạm đất ở giữa; scale làm to thêm.
  function monster(R, id, x, gy, frame, scale, opts) {
    const def = TT.data.monsterById && TT.data.monsterById[id]; if (!def) return null;
    const m = M[id]; if (!m) return null;
    const p = ELEM[def.elem] || ELEM['Thổ'], map = m.map, s = scale || (m.boss ? 3 : 2), w = map[0].length, h = map.length;
    const sz = Math.max(1, Math.round(s)), bob = m.float ? Math.round(Math.sin(frame * 0.25) * 1.5) - 2 * sz : (Math.floor(frame / 6) % 2 ? 0 : -1);
    const x0 = Math.round(x - w * sz / 2), y0 = Math.round(gy - h * sz + bob);
    if (opts && opts.shadow !== false) R(x0 + sz * 2, gy, (w - 4) * sz, 1, 'rgba(0,0,0,0.3)');
    for (let r = 0; r < h; r++) { const row = map[r]; for (let q = 0; q < row.length; q++) { const ch = row[q]; if (ch === '.') continue; const c = color(ch, p); if (c) R(x0 + q * sz, y0 + r * sz, sz, sz, c); } }
    if (opts && opts.glow) { const g = p[3]; R(x0 + 2 * sz, y0 + 3 * sz, 1, 1, g); }
    return { w: w * sz, h: h * sz, x: x0, y: y0 };
  }
  ui.sprites = { monster, ids: Object.keys(M) };
})();
