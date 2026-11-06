const puppeteer = require('C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/treewhisper-showcase/node_modules/puppeteer-core');
const OUT = 'C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/portfolio/docs/assets/meow/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--force-device-scale-factor=2', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });
  await page.goto('https://miolulu.github.io/meow-chime/', { waitUntil: 'networkidle2' });
  await sleep(3000);

  // 1 欢迎弹窗
  await page.screenshot({ path: OUT + '01-welcome.png' });

  // 2 进入森林
  await page.mouse.click(641, 512);
  await sleep(2500);
  await page.screenshot({ path: OUT + '02-forest.png' });

  // 3 敲几个音 + 点猫，制造光效
  for (const k of ['q', 'w', 'e', 'r', 't', 'y']) {
    await page.keyboard.press(k);
    await sleep(180);
  }
  await page.mouse.move(700, 560);
  await sleep(300);
  await page.mouse.click(700, 560);
  await sleep(500);
  for (const k of ['a', 's', 'd', 'f']) {
    await page.keyboard.press(k);
    await sleep(160);
  }
  await sleep(600);
  await page.screenshot({ path: OUT + '03-playing.png' });

  // 4 点底部「创作」按钮（约 x=657 y=594）
  await page.mouse.click(778, 704);
  await sleep(1500);
  await page.screenshot({ path: OUT + '04-create.png' });

  await browser.close();
})();
