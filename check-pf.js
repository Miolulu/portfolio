const puppeteer = require('C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/treewhisper-showcase/node_modules/puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FILE = process.env.FILE || 'file:///C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/%E4%BD%9C%E5%93%81%E9%9B%86.html';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1.5 });
  await page.goto(FILE, { waitUntil: 'networkidle2' });
  await sleep(1500);

  const info = await page.evaluate(() => {
    const pages = [...document.querySelectorAll('.page')];
    return pages.map((el, i) => {
      const r = el.getBoundingClientRect();
      const kids = [...el.children].filter((c) => !c.classList.contains('pno')).map((c) => c.getBoundingClientRect().bottom);
      const last = kids.length ? Math.max(...kids) : r.top;
      return {
        page: i + 1,
        height: Math.round(r.height),
        overflowPx: Math.round(last - r.bottom),
        broken: [...el.querySelectorAll('img')].filter((x) => !x.naturalWidth).length,
      };
    });
  });
  console.log(JSON.stringify(info));

  const pages = await page.$$('.page');
  for (let i = 0; i < pages.length; i++) {
    await pages[i].screenshot({ path: 'shots/pf-' + (i + 1) + '.png' });
  }
  await browser.close();
})();
