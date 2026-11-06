// 通用探索脚本：打开页面，输出结构信息并截图
const puppeteer = require('C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/treewhisper-showcase/node_modules/puppeteer-core');
const path = require('path');

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const url = process.argv[2];
const out = process.argv[3] || 'shots/explore.png';
const w = parseInt(process.argv[4] || '1440', 10);
const h = parseInt(process.argv[5] || '900', 10);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text().slice(0, 120)); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + String(e).slice(0, 120)));
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }).catch((e) => console.log('goto warn', e.message.slice(0, 80)));
  await new Promise((r) => setTimeout(r, 2500));

  const info = await page.evaluate(() => {
    const pick = (sel) =>
      [...document.querySelectorAll(sel)]
        .slice(0, 40)
        .map((el) => ({
          t: (el.innerText || el.getAttribute('aria-label') || el.className || '').trim().slice(0, 40),
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 40),
          rect: (() => { const r = el.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; })(),
        }))
        .filter((x) => x.rect[2] > 0 && x.rect[3] > 0);
    return {
      title: document.title,
      bodyText: document.body.innerText.replace(/\n{2,}/g, '\n').slice(0, 900),
      buttons: pick('button, [role=button], a.btn, .btn'),
      headings: pick('h1,h2,h3'),
      canvas: pick('canvas'),
      scrollH: document.documentElement.scrollHeight,
      scrollW: document.documentElement.scrollWidth,
    };
  });
  console.log(JSON.stringify(info, null, 1));
  console.log('ERRORS:', errs.slice(0, 6));
  await page.screenshot({ path: path.resolve(out), fullPage: false });
  await browser.close();
})();
