const puppeteer = require('C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/treewhisper-showcase/node_modules/puppeteer-core');
const path = require('path');
const fs = require('fs');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const BASE = 'http://127.0.0.1:5175/';
const PAGES = ['', 'zhanshen/', 'meow/', 'tree/', 'ember/'];
const OUT = 'C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/portfolio/shots/site';
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars'],
  });

  for (const p of PAGES) {
    for (const vp of [{ n: 'desk', w: 1440, h: 900 }, { n: 'mob', w: 390, h: 844 }]) {
      const page = await browser.newPage();
      await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1 });
      const bad = [];
      page.on('response', (r) => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url().slice(-60)); });
      page.on('pageerror', (e) => bad.push('ERR ' + String(e).slice(0, 80)));
      await page.goto(BASE + p, { waitUntil: 'networkidle2', timeout: 30000 });
      await sleep(700);
      const info = await page.evaluate(() => {
        const imgs = [...document.images];
        return {
          title: document.title,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
          scrollW: document.documentElement.scrollWidth,
          innerW: window.innerWidth,
          h: document.documentElement.scrollHeight,
          broken: imgs.filter((i) => !i.naturalWidth).map((i) => i.getAttribute('src')),
          imgCount: imgs.length,
        };
      });
      console.log(`${p || 'index'} ${vp.n}: overflow=${info.overflow} (${info.scrollW}/${info.innerW}) h=${info.h} imgs=${info.imgCount} broken=${info.broken.length} bad=${bad.length}`);
      if (info.broken.length) console.log('   broken:', info.broken.join(', '));
      if (bad.length) console.log('   res:', bad.slice(0, 4).join(' | '));
      const name = (p || 'index').replace('/', '') + '-' + vp.n + '.png';
      await page.screenshot({ path: path.join(OUT, name), fullPage: vp.n === 'desk' });
      await page.close();
    }
  }
  await browser.close();
})();
