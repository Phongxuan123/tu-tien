// Danh sách script theo thứ tự nạp (thẻ script thường, không dùng ES module). index.html và tests.html cùng dùng:
//   <script src="js/files.js"></script><script>TT_LOAD(true)</script>   (true = kèm giao diện)
(function () {
  // Công cụ thử nghiệm (bảng chỉnh nhân vật): bật bằng ?dev=1 hoặc ô "Thử nghiệm" (localStorage tt8b_dev). Tắt thì không nạp js/ui/devpanel.js.
  var devOn = false;
  try { devOn = /[?&]dev=1(&|$)/.test(location.search) || localStorage.getItem('tt8b_dev') === '1'; } catch (e) { /* bỏ qua */ }
  window.TT_DEV_ON = devOn;
  var core = [
    'js/core/rng.js', 'js/core/bus.js', 'js/core/state.js',
    'js/data/realms.js', 'js/data/dev.js', 'js/data/elements.js', 'js/data/traits.js', 'js/data/nature.js', 'js/data/childhood.js', 'js/data/origins2.js', 'js/data/story.js', 'js/data/bonds.js', 'js/data/stories/bb_a.js', 'js/data/stories/tp_tan_tu.js', 'js/data/stories/tp_dao_tong.js', 'js/data/stories/tp_thuong_nhan.js', 'js/data/stories/tg_chien_su.js','js/data/stories/dl_mau.js', 'js/data/stories/dao_lu.js', 'js/data/names.js', 'js/data/actions.js',
    'js/data/regions.js', 'js/data/places.js', 'js/data/sects.js', 'js/data/sectmodern.js', 'js/data/diplo.js', 'js/data/nation.js', 'js/data/army.js', 'js/data/totalwar.js', 'js/data/faiths.js', 'js/data/faithrules.js', 'js/data/items.js', 'js/data/gear.js', 'js/data/techs.js', 'js/data/monsters.js', 'js/data/endings.js', 'js/data/events.js', 'js/data/relevents.js', 'js/data/sectevents.js', 'js/data/famevents.js', 'js/data/dgevents.js', 'js/data/facevents.js', 'js/data/bondevents.js', 'js/data/memevents.js', 'js/data/quests.js', 'js/data/paths.js', 'js/data/jobs.js', 'js/data/buildings.js', 'js/data/resources.js', 'js/data/population.js', 'js/data/court.js', 'js/data/liendo.js', 'js/data/eco.js', 'js/data/press.js',
    'js/systems/stats.js', 'js/systems/nature.js', 'js/systems/kv.js', 'js/systems/childhood.js', 'js/systems/origin.js', 'js/systems/story.js', 'js/systems/wheel.js', 'js/systems/ls.js', 'js/systems/map.js', 'js/systems/crossing.js', 'js/systems/character.js',
    'js/systems/cultivation.js', 'js/systems/events.js', 'js/systems/rules.js',
    'js/systems/relations.js', 'js/systems/combat.js', 'js/systems/loss.js', 'js/systems/social.js', 'js/systems/sect.js', 'js/systems/factions.js', 'js/systems/population.js', 'js/systems/pacts.js', 'js/systems/diplo.js', 'js/systems/nation.js', 'js/systems/army.js', 'js/systems/totalwar.js', 'js/systems/court.js', 'js/systems/inter.js', 'js/systems/faith.js', 'js/systems/sectmod.js', 'js/systems/eco.js', 'js/systems/hoi.js', 'js/systems/appraise.js', 'js/systems/press.js', 'js/systems/family.js', 'js/systems/bond.js', 'js/systems/bondmem.js', 'js/systems/items.js', 'js/systems/tech.js', 'js/systems/craft.js', 'js/systems/dungeon.js', 'js/systems/fate.js', 'js/systems/auto.js', 'js/systems/report.js', 'js/systems/quests.js', 'js/systems/path.js', 'js/systems/resources.js', 'js/systems/jobs.js', 'js/systems/buildings.js', 'js/systems/rumors.js',
    'js/systems/ai.js', 'js/systems/decisions.js', 'js/systems/world.js', 'js/core/time.js', 'js/core/save.js'
  ];
  // cảnh đầu cột: các module trong js/ui/scene/ rồi js/ui/scene.js (ghép lớp, giữ API TT.ui.scene)
  var scene = ['js/ui/scene/core.js', 'js/ui/scene/data.js', 'js/ui/scene/sky.js', 'js/ui/scene/land.js', 'js/ui/scene/cloud.js', 'js/ui/scene/arch.js', 'js/ui/scene/place.js', 'js/ui/scene/sect.js', 'js/ui/scene/shrine.js', 'js/ui/scene/street.js', 'js/ui/scene/fg.js', 'js/ui/scene/fx.js', 'js/ui/scene/weather.js', 'js/ui/scene/dungeon.js', 'js/ui/scene/actor.js', 'js/ui/scene/events.js', 'js/ui/scene.js'];
  var ui = [
    'js/ui/dom.js', 'js/ui/side.js', 'js/ui/panels.js', 'js/ui/profile.js', 'js/ui/journal.js','js/ui/people.js', 'js/ui/quests.js', 'js/ui/jobs.js', 'js/ui/sect.js', 'js/ui/bond.js', 'js/ui/family.js', 'js/ui/icons.js', 'js/ui/bldart.js', 'js/ui/shop.js', 'js/ui/bag.js', 'js/ui/sectcard.js', 'js/ui/diplo.js', 'js/ui/inter.js', 'js/ui/nation.js', 'js/ui/faith.js', 'js/ui/history.js', 'js/ui/press.js', 'js/ui/dungeon.js', 'js/ui/rules.js', 'js/ui/terrain.js', 'js/ui/map.js', 'js/ui/sprites.js'].concat(scene, ['js/ui/dock.js', 'js/ui/lifemap.js', 'js/ui/newlife.js', 'js/ui/childhood.js', 'js/ui/story.js', 'js/ui/controls.js', 'js/main.js'
  ]);
  // dành cho trang thử chỉ nạp lõi + cảnh (scenetest.html, uimock.html)
  window.TT_SCENE = function () { scene.forEach(function (f) { document.write('<script src="' + f + '"><\/script>'); }); };
  if (devOn) ui.splice(ui.indexOf('js/main.js'), 0, 'js/ui/devpanel.js');
  window.TT_LOAD = function (withUi) {
    core.concat(withUi ? ui : []).forEach(function (f) { document.write('<script src="' + f + '"><\/script>'); });
  };
})();
