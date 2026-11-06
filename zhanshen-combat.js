const puppeteer = require('C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/treewhisper-showcase/node_modules/puppeteer-core');
const OUT = 'C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/portfolio/docs/assets/zhanshen/';
const TMP = 'C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/portfolio/shots/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--force-device-scale-factor=2', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 960, height: 540, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:5179/', { waitUntil: 'networkidle2', timeout: 90000 });
  await sleep(6000);

  await page.mouse.click(480, 364); // 主线通关
  await sleep(3000);
  await page.mouse.click(696, 490); // 开始教程
  await sleep(3000);
  await page.mouse.click(491, 440); // 进入战斗
  await sleep(9000);
  for (let i = 0; i < 8; i++) { await page.mouse.click(480, 300); await sleep(1100); }
  await sleep(1500);
  await page.screenshot({ path: TMP + 'zs-d0.png' });

  // 走位 + 等敌人刷出来
  for (let i = 0; i < 3; i++) {
    await page.keyboard.down('d');
    await sleep(700);
    await page.keyboard.up('d');
    await sleep(400);
  }
  await sleep(4000);
  await page.screenshot({ path: TMP + 'zs-d1.png' });
  await sleep(5000);
  await page.screenshot({ path: TMP + 'zs-d2.png' });
  await sleep(5000);
  await page.screenshot({ path: TMP + 'zs-d3.png' });

  await browser.close();
})();
