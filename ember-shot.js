const puppeteer = require('C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/treewhisper-showcase/node_modules/puppeteer-core');
const OUT = 'C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/portfolio/docs/assets/ember/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--force-device-scale-factor=2', '--hide-scrollbars'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('https://miolulu.github.io/ember-novel/', { waitUntil: 'networkidle2' });
  await sleep(2500);

  // 1 封面
  await page.screenshot({ path: OUT + '01-cover.png' });

  // 2 角色页
  await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('.sidebar-tab')];
    const t = tabs.find((x) => x.innerText.includes('角色'));
    if (t) t.click();
  });
  await sleep(1200);
  await page.screenshot({ path: OUT + '02-roles.png' });

  // 3 点第一个角色看档案
  const roleInfo = await page.evaluate(() => {
    const cands = [...document.querySelectorAll('.role-card, .char-card, .role-item, .character-item, .role-list > *')];
    return cands.slice(0, 8).map((el) => ({ cls: el.className, t: el.innerText.slice(0, 30) }));
  });
  console.log('roleCards:', JSON.stringify(roleInfo));

  // 4 正文
  await page.evaluate(() => {
    const tabs = [...document.querySelectorAll('.sidebar-tab')];
    const t = tabs.find((x) => x.innerText.includes('目录'));
    if (t) t.click();
  });
  await sleep(600);
  await page.evaluate(() => {
    const items = [...document.querySelectorAll('.chapter-item')];
    const c = items.find((x) => x.innerText.includes('序章'));
    if (c) c.click();
  });
  await sleep(1500);
  await page.evaluate(() => window.scrollTo(0, 620));
  await sleep(800);
  await page.screenshot({ path: OUT + '03-reading.png' });

  // 5 往下再截一张带进度的
  await page.evaluate(() => window.scrollTo(0, 1500));
  await sleep(800);
  await page.screenshot({ path: OUT + '04-reading2.png' });

  await browser.close();
})();
