const puppeteer = require('C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/treewhisper-showcase/node_modules/puppeteer-core');
const FILE = 'file:///C:/Users/mio/WorkBuddy/2026-11-05-14-04-14/%E5%8D%A2%E7%92%90-%E7%AE%80%E5%8E%86-%E4%B8%A4%E9%A1%B5%E9%A2%84%E8%A7%88.html';

const CAND = {
  斩神: [
    'AI 独立游戏｜克苏鲁像素 Roguelike，30 层病区与 SAN 异化',
    'AI 独立游戏｜克苏鲁像素 Roguelike，30 层病区，越打越疯',
    'AI 独立游戏｜像素 Roguelike，30 层病区与 SAN 异化',
    'AI 独立游戏｜横屏自动战斗，30 层病区与 SAN 异化',
  ],
  余烬: [
    'AI 小说阅读器｜原创科幻群像长篇，十章正文与六张角色档案',
    'AI 小说阅读器｜科幻群像长篇，十章正文、六个角色档案',
    'AI 原创小说｜科幻群像长篇，十章正文与六张角色档案',
    'AI 互动阅读｜科幻群像长篇，十章正文与六张角色档案',
  ],
  喵喵: [
    'AI 音乐互动｜七个音阶七只猫，不懂乐理也能弹出旋律',
    'AI 音乐互动｜七只猫守七个音阶，会打字就能弹',
    'AI 互动音乐｜不认谱也能弹，支持音色切换与旋律保存',
  ],
  树语: [
    'AI 全栈社区｜情绪树洞，账号体系、实时通知与养成机制',
    'AI 全栈开发｜情绪树洞社区，账号体系与实时通知',
    'AI 全栈社区｜情绪树洞，账号、实时通知与养成机制',
  ],
};
const URLS = {
  斩神: 'miolulu.github.io/portfolio/zhanshen',
  余烬: 'miolulu.github.io/portfolio/ember',
  喵喵: 'miolulu.github.io/portfolio/meow',
  树语: 'miolulu.github.io/treewhisper',
};

(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage();
  await p.setViewport({ width: 794, height: 1123 });
  await p.goto(FILE, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 500));
  for (const [name, list] of Object.entries(CAND)) {
    for (const desc of list) {
      const w = await p.evaluate((name, desc, url) => {
        const h2 = [...document.querySelectorAll('h2')].find(x => x.innerText.trim() === '个人作品');
        const proto = h2.parentElement.querySelector('.line');
        const el = proto.cloneNode(false);
        el.innerHTML = '<b>' + name + '</b> · ' + desc + '｜在线 <a href="#">' + url + '</a>';
        proto.parentElement.appendChild(el);
        const range = document.createRange();
        range.selectNodeContents(el);
        const tw = range.getBoundingClientRect().width;
        el.remove();
        return Math.round(tw);
      }, name, desc, URLS[name]);
      console.log(String(w).padStart(4), w <= 680 ? 'OK ' : 'NG ', name, desc);
    }
  }
  await b.close();
})();
