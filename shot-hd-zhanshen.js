const puppeteer = require('C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/treewhisper-showcase/node_modules/puppeteer-core');
const OUT = 'C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/portfolio/shots/hd/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', '--force-device-scale-factor=2'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:5179/', { waitUntil: 'networkidle2', timeout: 90000 });
  await sleep(7000);
  await page.screenshot({ path: OUT + 'zs-1-title.png' });

  await page.mouse.click(640, 485); // 主线通关
  await sleep(3000);
  await page.mouse.click(928, 653); // 开始教程
  await sleep(3000);
  await page.mouse.click(655, 587); // 进入战斗
  await sleep(9000);
  for (let i = 0; i < 8; i++) { await page.mouse.click(640, 400); await sleep(1100); }
  await sleep(1200);
  await page.screenshot({ path: OUT + 'zs-2-enter.png' });

  for (let i = 0; i < 3; i++) {
    await page.keyboard.down('d'); await sleep(700); await page.keyboard.up('d'); await sleep(400);
  }
  await sleep(4000);
  await page.screenshot({ path: OUT + 'zs-3-fight.png' });
  await sleep(4000);
  await page.screenshot({ path: OUT + 'zs-4-fight2.png' });
  await sleep(4000);
  await page.screenshot({ path: OUT + 'zs-5-fight3.png' });
  await browser.close();
})();
