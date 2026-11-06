const p = require('C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/treewhisper-showcase/node_modules/puppeteer-core');
const fs = require('fs');
const OUT = 'C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/portfolio/shots/mobile';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const V = { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const b = await p.launch({ executablePath: EDGE, headless: 'new', args: ['--no-sandbox', '--hide-scrollbars'] });
  const pg = await b.newPage();
  await pg.setViewport(V);
  await pg.goto('https://miolulu.github.io/ember-novel/', { waitUntil: 'networkidle2' });
  await sleep(2500);
  await pg.screenshot({ path: `${OUT}/ember-cover.png` });

  // 目录抽屉
  await pg.click('.menu-toggle');
  await sleep(900);
  await pg.screenshot({ path: `${OUT}/ember-catalog.png` });

  // 阅读正文：点序章
  const clicked = await pg.evaluate(() => {
    const items = [...document.querySelectorAll('.chapter-item')];
    const c = items.find((x) => x.innerText.includes('序章'));
    if (c) { c.click(); return c.innerText.trim().slice(0, 20); }
    return null;
  });
  console.log('chapter:', clicked);
  await sleep(1800);
  // 若抽屉还开着，关掉
  const open = await pg.evaluate(() => document.querySelector('.sidebar')?.classList.contains('open'));
  if (open) { await pg.click('.menu-toggle'); await sleep(600); }
  await sleep(600);
  await pg.screenshot({ path: `${OUT}/ember-read.png` });

  // 角色页
  await pg.click('.menu-toggle');
  await sleep(700);
  await pg.evaluate(() => {
    const t = [...document.querySelectorAll('.sidebar-tab')].find((x) => x.innerText.includes('角色'));
    if (t) t.click();
  });
  await sleep(900);
  await pg.screenshot({ path: `${OUT}/ember-roles.png` });
  await b.close();
  console.log('ember done');
})();
