const p = require('C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/treewhisper-showcase/node_modules/puppeteer-core');
const OUT = 'C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/portfolio/shots/mobile';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await p.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', args: ['--hide-scrollbars'] });
  const pg = await b.newPage();
  await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await pg.goto('https://miolulu.github.io/ember-novel/', { waitUntil: 'networkidle2' });
  await sleep(2500);
  await pg.click('.menu-toggle');
  await sleep(800);
  await pg.evaluate(() => {
    const t = [...document.querySelectorAll('.sidebar-tab')].find((x) => x.innerText.includes('角色'));
    if (t) t.click();
    const s = document.querySelector('.sidebar');
    if (s) { s.style.width = '100%'; s.style.maxWidth = '100%'; }
  });
  await pg.evaluate(() => { const m = document.querySelector('.menu-toggle'); if (m) m.style.display = 'none'; });
  await sleep(1200);
  await pg.screenshot({ path: `${OUT}/ember-roles.png` });
  await b.close();
  console.log('ok');
})();
