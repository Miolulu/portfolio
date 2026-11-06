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
  await page.screenshot({ path: OUT + '01-title.png' });

  // 主线通关 → 楼层详情
  await page.mouse.click(480, 364);
  await sleep(3000);
  await page.screenshot({ path: OUT + '02-floor.png' });

  // 开始教程 → 战斗
  await page.mouse.click(696, 490);
  await sleep(8000);
  await page.screenshot({ path: TMP + 'zs-b1.png' });
  await sleep(5000);
  await page.mouse.move(480, 300);
  await sleep(400);
  await page.screenshot({ path: TMP + 'zs-b2.png' });
  await sleep(6000);
  await page.screenshot({ path: TMP + 'zs-b3.png' });

  // 回到主菜单看病历档案
  await page.goto('http://127.0.0.1:5179/', { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(6000);
  await page.mouse.click(480, 296);
  await sleep(3000);
  await page.screenshot({ path: TMP + 'zs-archive.png' });

  await browser.close();
})();
