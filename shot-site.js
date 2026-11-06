const puppeteer = require('puppeteer-core');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = 'http://127.0.0.1:5188';

async function load(page, url) {
  await page.goto(url, { waitUntil: 'networkidle0' });
  // 滚到底，触发 lazy 加载，再回顶
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.waitForNetworkIdle({ idleTime: 300 }).catch(() => {});
  await page.evaluate(async () => {
    [...document.images].forEach(i => { i.loading = 'eager'; });
    await Promise.all([...document.images].map(i => (i.complete && i.naturalWidth)
      ? Promise.resolve()
      : new Promise(r => { i.onload = r; i.onerror = r; setTimeout(r, 8000); })));
  });
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: 'new',
    args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
  });
  const page = await browser.newPage();
  const logs = [];
  page.on('console', m => { if (m.type() === 'error') logs.push(m.text()); });
  page.on('pageerror', e => logs.push('PAGEERR ' + e.message));
  page.on('requestfailed', r => logs.push('FAIL ' + r.url().slice(-60)));
  page.on('response', r => { if (r.status() >= 400) logs.push(r.status() + ' ' + r.url().slice(-60)); });

  await page.setViewport({ width: 1440, height: 980, deviceScaleFactor: 1 });
  await load(page, BASE + '/');
  const info = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    innerW: innerWidth,
    pageH: Math.round(document.body.scrollHeight),
    broken: [...document.images].filter(i => !(i.complete && i.naturalWidth)).map(i => i.getAttribute('src')),
  }));
  console.log('INDEX', JSON.stringify(info));
  await page.screenshot({ path: 'shots/site/index-desktop.png', fullPage: true });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await load(page, BASE + '/');
  const m = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth, innerW: innerWidth,
    broken: [...document.images].filter(i => !(i.complete && i.naturalWidth)).map(i => i.getAttribute('src')),
  }));
  console.log('MOBILE', JSON.stringify(m));
  await page.screenshot({ path: 'shots/site/index-mobile.png', fullPage: true });

  await page.setViewport({ width: 1440, height: 980, deviceScaleFactor: 1 });
  for (const slug of ['zhanshen', 'tree', 'meow', 'ember']) {
    await load(page, BASE + '/' + slug + '/');
    const r = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth, innerW: innerWidth,
      broken: [...document.images].filter(i => !(i.complete && i.naturalWidth)).map(i => i.getAttribute('src')),
    }));
    console.log(slug, JSON.stringify(r));
    await page.screenshot({ path: 'shots/site/' + slug + '.png', fullPage: true });
  }
  if (logs.length) console.log('LOGS: ' + [...new Set(logs)].join(' | '));
  await browser.close();
})();
