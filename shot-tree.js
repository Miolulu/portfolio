const p=require('puppeteer-core');
const OUT='shots/tree';
const EDGE='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const V={width:390,height:844,deviceScaleFactor:3,isMobile:true};
(async()=>{
  const b=await p.launch({executablePath:EDGE,headless:'new'});
  const pg=await b.newPage();
  await pg.setViewport(V);
  await pg.goto('http://127.0.0.1:5199/login',{waitUntil:'networkidle0'});
  await pg.type('input[name=username]','mio');
  await pg.type('input[name=password]','tree1234');
  await Promise.all([pg.waitForNavigation({waitUntil:'networkidle0'}),pg.click('button[type=submit],input[type=submit]')]);

  // 树洞首页（整屏）
  await pg.goto('http://127.0.0.1:5199/tree',{waitUntil:'networkidle0'}); await sleep(1800);
  await pg.screenshot({path:`${OUT}/home.png`});

  // 写纸条（弹窗紧贴边）
  await pg.evaluate(()=>openWriteModal()); await sleep(900);
  await pg.evaluate(()=>{const t=document.getElementById('writeContent');if(t)t.value='今天在地铁上看到一个人的伞上画着一只橘猫，忍不住看了好几站。';});
  await sleep(400);
  let el=await pg.$('#writeModal .modal-card'); let box=await el.boundingBox();
  await pg.screenshot({path:`${OUT}/write.png`,clip:box});

  // 树历
  await pg.evaluate(()=>{closeWriteModal();openCalendar();}); await sleep(900);
  el=await pg.$('#calendarModal > div'); box=await el.boundingBox();
  await pg.screenshot({path:`${OUT}/calendar.png`,clip:box});

  // 我的树洞（整页滚动）
  await pg.goto('http://127.0.0.1:5199/notes',{waitUntil:'networkidle0'}); await sleep(1200);
  el=await pg.$('.list-card'); box=await el.boundingBox();
  await pg.screenshot({path:`${OUT}/notes.png`,clip:{x:box.x-20,y:box.y-20,width:box.width+40,height:box.height+40}});

  // 纸条详情
  await pg.goto('http://127.0.0.1:5199/notes/27',{waitUntil:'networkidle0'}); await sleep(1000);
  el=await pg.$('.detail-page'); box=await el.boundingBox();
  const foot=await pg.evaluate(()=>document.querySelector('footer').getBoundingClientRect().top);
  await pg.screenshot({path:`${OUT}/note.png`,clip:{x:box.x-4,y:box.y-6,width:box.width+8,height:foot-box.y+2}});

  // 小蜗
  await pg.setViewport(V);
  await pg.goto('http://127.0.0.1:5199/spirit',{waitUntil:'networkidle0'}); await sleep(1400);
  el=await pg.$('.spirit-modal'); box=await el.boundingBox();
  await pg.screenshot({path:`${OUT}/spirit.png`,clip:box});
  console.log('done');
  await b.close();
})();
