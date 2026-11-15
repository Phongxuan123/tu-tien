// Kiểm tra DOM, khung nhìn và nút gốc sau khi đổi bố cục.
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true });
  const page = await browser.newPage({ viewport: { width: 1816, height: 1000 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(pathToFileURL(path.join(__dirname, '..', 'index.html')).href);
  await page.waitForFunction(() => window.TT && TT.world && document.querySelector('#side-tabs button'));
  // Đóng màn tạo nhân vật để kiểm tra các điều khiển của màn chơi.
  await page.evaluate(() => {
    TT.ui.newLife.close(); TT.ui.childhood.close();
    TT.time.setSpeed(0); TT.time.hold = true;
    TT.world.pending = null; TT.ui.markDirty(); TT.ui.render();
  });
  const state = await page.evaluate(() => ({
    scene: document.querySelector('#scene-wrap').parentElement.id,
    floating: document.querySelector('#scene-wrap').classList.contains('floating'),
    last: document.querySelector('#col-right').lastElementChild.id,
    tabs: document.querySelectorAll('#side-tabs button').length,
    horizontalMenu: document.querySelector('#topbar .ink-menu #side-tabs') !== null,
    save: document.querySelector('#btn-save').closest('.bar-controls') !== null,
    options: ['btn-export', 'btn-import', 'btn-new', 'btn-keys', 'btn-ai', 'audio-box'].every(id => document.querySelector('.ink-options').contains(document.getElementById(id))),
    overflow: document.documentElement.scrollWidth > innerWidth
  }));
  if (state.scene !== 'col-mid' || state.floating || state.last !== 'lifemap-card' || !state.tabs || !state.horizontalMenu || !state.save || !state.options || state.overflow) throw Error(JSON.stringify(state));
  await page.locator('.ink-options > summary').click();
  if (!await page.locator('#btn-export').isVisible()) throw Error('Options inaccessible');
  await page.locator('.ink-options > summary').click();
  await page.locator('#side-tabs button').nth(1).click();
  await page.screenshot({ path: path.join(__dirname, '..', '.test-tools', 'desktop.png'), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error('Mobile overflow');
  await page.locator('.ink-options > summary').click();
  if (!await page.locator('#btn-keys').isVisible()) throw Error('Mobile options inaccessible');
  await page.screenshot({ path: path.join(__dirname, '..', '.test-tools', 'mobile.png'), fullPage: true });
  if (errors.length) throw Error(errors.join('\n'));
  console.log('PASS desktop/mobile: scene docked, life map last, tabs, options, no overflow or page errors', state);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
