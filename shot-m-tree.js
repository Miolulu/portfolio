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
  await pg.goto('http://127.0.0.1:5199/login', { waitUntil: 'networkidle0' });
  await pg.type('input[name=username]', 'mio');
  await pg.type('input[name=password]', 'tree1234');
  await Promise.all([pg.waitForNavigation({ waitUntil: 'networkidle0' }), pg.click('button[type=submit],input[type=submit]')]);

  await pg.goto('http://127.0.0.1:5199/tree', { waitUntil: 'networkidle0' });
  await sleep(2200);
  await pg.screenshot({ path: `${OUT}/tree-home.png` });

  await pg.evaluate(() => openWriteModal());
  await sleep(900);
  await pg.evaluate(() => { const t = document.getElementById('writeContent'); if (t) t.value = '今天在地铁上看到一个人的伞上画着一只橘猫，忍不住看了好几站。'; });
  await sleep(500);
  await pg.screenshot({ path: `${OUT}/tree-write.png` });

  await pg.evaluate(() => { closeWriteModal(); openCalendar(); });
  await sleep(1100);
  await pg.screenshot({ path: `${OUT}/tree-calendar.png` });

  await pg.goto('http://127.0.0.1:5199/notes', { waitUntil: 'networkidle0' });
  await sleep(1400);
  await pg.screenshot({ path: `${OUT}/tree-notes.png` });

  await pg.goto('http://127.0.0.1:5199/notes/27', { waitUntil: 'networkidle0' });
  await sleep(1200);
  await pg.screenshot({ path: `${OUT}/tree-note.png` });

  await pg.goto('http://127.0.0.1:5199/spirit', { waitUntil: 'networkidle0' });
  await sleep(1500);
  await pg.screenshot({ path: `${OUT}/tree-spirit.png` });

  console.log('tree done');
  await b.close();
})();
