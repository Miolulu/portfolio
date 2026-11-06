const puppeteer = require('C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/treewhisper-showcase/node_modules/puppeteer-core');
const FILE = 'file:///C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/%E5%8D%A2%E7%92%90-%E7%AE%80%E5%8E%86-%E4%B8%A4%E9%A1%B5%E9%A2%84%E8%A7%88.html';

(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 794, height: 1123 });
  await p.goto(FILE, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  const out = await p.evaluate(() => {
    const h2 = [...document.querySelectorAll('h2')].find(x => x.innerText.trim() === '个人作品');
    const wrap = h2.nextElementSibling.parentElement;
    const lines = [...h2.parentElement.querySelectorAll('.line')];
    return lines.map(el => {
      const cs = getComputedStyle(el);
      const lh = parseFloat(cs.lineHeight);
      const r = el.getBoundingClientRect();
      // 用 Range 测文本实际宽度
      const range = document.createRange();
      range.selectNodeContents(el);
      const tw = range.getBoundingClientRect().width;
      return { text: el.innerText.slice(0, 18), h: Math.round(r.height), lh: Math.round(lh), lines: Math.round(r.height / lh), avail: Math.round(el.clientWidth), textW: Math.round(tw) };
    });
  });
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
