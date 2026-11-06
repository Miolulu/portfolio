const puppeteer = require('C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/treewhisper-showcase/node_modules/puppeteer-core');
const OUT = 'C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/portfolio/shots/hd/';
const SHARE = 'https://treewhisper-demo.app.workbuddy.host/?sharecode=D5ALB7TBDL';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new',
    args: ['--no-sandbox','--hide-scrollbars'] });
  const p = await b.newPage();
  await p.setViewport({ width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');
  await p.goto(SHARE, { waitUntil: 'networkidle2', timeout: 60000 });
  if (p.url().includes('/login')) {
    await p.waitForSelector('input');
    const inputs = await p.$$('input');
    await inputs[0].type('lulu_demo'); await inputs[1].type('demo123456');
    const btn = await p.$('button'); if (btn) await btn.click(); else await p.keyboard.press('Enter');
    await sleep(4500);
  }
  const origin = new URL(p.url()).origin;
  const shots = [['/', 'tree-home'], ['/notes', 'tree-notes'], ['/bottles', 'tree-bottle'], ['/spirit', 'tree-spirit']];
  for (const [path, name] of shots) {
    await p.goto(origin + path, { waitUntil: 'networkidle2', timeout: 45000 });
    await p.addStyleTag({ content: '.note-content,.note-preview{min-width:0 !important;}' }).catch(() => {});
    await sleep(2200);
    await p.screenshot({ path: OUT + name + '.png' });
    console.log('ok', name);
  }
  await b.close();
})();
