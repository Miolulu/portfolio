const puppeteer = require('C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/treewhisper-showcase/node_modules/puppeteer-core');
const OUT = 'C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/portfolio/shots/hd/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new',
    args: ['--no-sandbox','--hide-scrollbars','--force-device-scale-factor=2'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
  await p.goto('http://127.0.0.1:5179/', { waitUntil: 'networkidle2', timeout: 90000 });
  await sleep(7000);
  const boxes = await p.evaluate(() => {
    const c = document.querySelector('canvas');
    return c ? { w: c.clientWidth, h: c.clientHeight, r: c.getBoundingClientRect().toJSON() } : null;
  });
  console.log('canvas', JSON.stringify(boxes));
  await p.mouse.click(640, 388);   // 病历档案
  await sleep(3500);
  await p.screenshot({ path: OUT + 'zs-6-archive.png' });
  await b.close();
})();
