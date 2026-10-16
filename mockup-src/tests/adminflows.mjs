import puppeteer from 'puppeteer-core';
const base=process.env.BASE||'http://127.0.0.1:8001/';
const b=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']});
let fails=0;const ok=(n,c,x='')=>{if(!c)fails++;console.log((c?'PASS':'FAIL'),n,x)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ctx=await b.createBrowserContext();
async function page(url,{w=375,h=812}={}){const p=await ctx.newPage();await p.setViewport({width:w,height:h,isMobile:w<600,hasTouch:w<600});
  const errs=[];p.on('pageerror',e=>errs.push(String(e).slice(0,200)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200))});p._errs=errs;
  await p.evaluateOnNewDocument(()=>{try{localStorage.setItem('dp_consent',JSON.stringify({shotgun:false,media:false,t:Date.now()}))}catch(e){}});
  await p.goto(base+url,{waitUntil:'networkidle0'});await sleep(400);return p}
const st=p=>p.evaluate(()=>JSON.parse(localStorage.dp_mock_state||'null')?.d);
const clr=p=>p.evaluate(()=>document.querySelectorAll('#toasts .toast').forEach(t=>t.remove()));
const txt=(p,s)=>p.$eval(s,e=>e.textContent);
/* guard + login */
let p=await page('admin/overview.html');ok('guard redirects to login',p.url().endsWith('admin/index.html'));
await p.$eval('[name=em]',e=>e.value='');await p.click('[data-login] button[type=submit]');await sleep(300);
ok('login validates empty email',await p.$$eval('[data-login] .fld.bad',e=>e.length)===1);
await p.type('[name=em]','a@b.co');await p.click('[data-login] button[type=submit]');await sleep(1800);
ok('login → overview',p.url().endsWith('admin/overview.html'));
ok('overview todo rows',await p.$$eval('[data-ov=todo] a',e=>e.length)===3,(await txt(p,'[data-ov=todo]')));
ok('overview stats 612 / 9',(await txt(p,'[data-ov=stats]')).includes('612')&&(await txt(p,'[data-ov=stats]')).includes('9'));
ok('bottom tabs labelled',(await p.$$eval('.a-tabs a',e=>e.map(x=>x.textContent))).join()==='Home,Requests,Newsletter,Content,More');
/* requests mobile */
await p.goto(base+'admin/requests.html',{waitUntil:'networkidle0'});await sleep(300);
ok('6 requests listed',await p.$$eval('[data-rq=list-m] .irow',e=>e.length)===6);
await p.click('[data-rq=pills] [data-f=ok]');await sleep(100);
ok('filter Confirmée → 2',await p.$$eval('[data-rq=list-m] .irow',e=>e.length)===2);
await p.click('[data-rq=pills] [data-f=all]');
await p.click('[data-rq=list-m] .irow[data-id="1"]');await sleep(450);
ok('detail sheet open',await p.$eval('#detail-m',e=>e.classList.contains('open')));
ok('whatsapp link built',await p.$eval('#detail-m [data-act=wa]',e=>e.href.startsWith('https://wa.me/33612')&&decodeURIComponent(e.href).includes('Amara')));
await p.evaluate(()=>document.querySelector('#detail-m [data-act=wa]').addEventListener('click',e=>e.preventDefault()));  // keep the test on this tab
await p.click('#detail-m [data-act=wa]');await sleep(200);
ok('confirm toast asked',(await txt(p,'#toasts')).includes('Marquer comme confirmée ?'));
await p.$$eval('#toasts button',bs=>bs.find(x=>x.textContent==='Oui').click());await sleep(500);
let s=await st(p);ok('status → ok in store',s.requests.find(r=>r.id===1).status==='ok');
ok('undo toast',(await txt(p,'#toasts')).includes('Amara → Confirmée'));
await p.$$eval('#toasts button',bs=>bs.find(x=>x.textContent==='Annuler').click());await sleep(400);
s=await st(p);ok('undo restores new',s.requests.find(r=>r.id===1).status==='new');
await p.click('#detail-m [data-st=no]');await sleep(300);s=await st(p);ok('segment sets Refusée',s.requests.find(r=>r.id===1).status==='no');
await clr(p);await p.mouse.click(180,30);await sleep(400);ok('scrim closes sheet',!(await p.$eval('#detail-m',e=>e.classList.contains('open'))));
/* applications + retrait */
await p.goto(base+'admin/applications.html?t=retrait',{waitUntil:'networkidle0'});await sleep(300);
ok('retrait tab active with 1',(await txt(p,'[data-ap=tabs] [aria-selected=true]')).includes('Retrait · 1'));
await p.click('[data-hide]');await sleep(300);s=await st(p);
ok('photo hidden in store',s.nights.find(n=>n.pre==='AII').hiddenPhotos['AII-007']===true&&s.apps.find(a=>a.id===107).status==='removed');
await p.goto(base+'archive-night.html?n=noa-act-ii',{waitUntil:'networkidle0'});await sleep(500);
ok('public night hides AII-007',await p.evaluate(()=>!document.querySelector('[aria-label="Ouvrir la photo AII-007"]')&&!!document.querySelector('[aria-label="Ouvrir la photo AII-012"]')));
await p.goto(base+'admin/applications.html?t=dj',{waitUntil:'networkidle0'});await sleep(300);
await p.click('.irow[data-open]');await sleep(400);await p.click('#detail-m [data-st=short]');await sleep(300);
s=await st(p);ok('application status shortlist',s.apps.find(a=>a.id===101).status==='short');
/* public → admin */
const pub=await page('tables.html');await pub.evaluate(()=>{});await pub.close();
/* newsletter */
await p.goto(base+'admin/newsletter.html',{waitUntil:'networkidle0'});await sleep(300);
ok('4 history items',await p.$$eval('[data-nl=hist] .hrow',e=>e.length)===4);
await p.click('[data-nl=form] .sw');await sleep(300);s=await st(p);ok('form switch off',s.nl.formVisible===false);
await p.click('[data-nl=form] .sw');await sleep(200);await clr(p);
await p.click('[data-nl=new]');await sleep(300);
ok('composer open with 612',(await txt(p,'[data-c=send]'))==='Envoyer à 612 personnes');
ok('quota warning shown',await p.$eval('[data-c=warn]',e=>!e.hidden));
await p.click('[data-c=test]');await sleep(200);s=await st(p);ok('test count 47',s.nl.testsLeft===47);
await clr(p);await p.click('[data-c=send]');await sleep(300);ok('confirm dialog open',await p.$eval('[data-nl=confirm]',e=>e.open));
await p.click('[data-k=yes]');await sleep(500);s=await st(p);
ok('sent campaign in history',s.nl.history[0].status==='sent'&&s.nl.history[0].recips===612);
await clr(p);await p.click('[data-cancel]');await sleep(300);s=await st(p);ok('cancel scheduling → draft',s.nl.history.find(h=>h.id===1).status==='draft');
/* content: archives, banner, partners, settings */
await p.goto(base+'admin/archives.html',{waitUntil:'networkidle0'});await sleep(300);
await p.click('[data-pub="3"]');await sleep(200);s=await st(p);ok('archive unpublished',s.nights[3].published===false);
await p.click('[data-edit="0"]');await sleep(300);
await p.click('[data-hide="AII-003"]');await sleep(200);s=await st(p);ok('editor hides photo',s.nights[0].hiddenPhotos['AII-003']===true);
await p.type('[data-cr=h][data-ci="0"]','x');await p.click('[data-e=save]');await sleep(400);s=await st(p);ok('editor saves credit',/x/.test(s.nights[0].credits[0].handle)&&s.nights[0].credits[0].handle!=='@gandhax',s.nights[0].credits[0].handle);
await p.goto(base+'admin/banner.html',{waitUntil:'networkidle0'});await sleep(300);
ok('banner status line',(await txt(p,'[data-bn=status]')).startsWith('En ligne'));
await p.click('[data-bn=styles] [data-s=white]');ok('savebar appears',await p.$eval('[data-bn=bar]',e=>e.classList.contains('on')));
await p.click('[data-bn=save]');await sleep(300);s=await st(p);ok('banner saved white',s.banner.style==='white');
await p.goto(base+'index.html',{waitUntil:'networkidle0'});await sleep(500);
ok('public banner uses white',await p.$$eval('[data-banner]',e=>e.some(x=>x.dataset.style==='white')));
await p.goto(base+'admin/partners.html',{waitUntil:'networkidle0'});await sleep(300);
await p.click('[data-vis] .sw');await sleep(200);s=await st(p);ok('partner hidden',s.partners[0].visible===false);
await p.goto(base+'admin/settings.html',{waitUntil:'networkidle0'});await sleep(300);
await p.$eval('[name=licence]',e=>e.value='');await p.type('[name=licence]','2-1234567');await p.click('[data-set-form] button[type=submit]');await sleep(300);
s=await st(p);ok('licence saved',s.settings.licence==='2-1234567');
await p.goto(base+'info.html',{waitUntil:'networkidle0'});await sleep(400);
ok('public footer shows licence',await p.evaluate(()=>document.body.textContent.includes('2-1234567')));
/* desktop three-pane */
await p.setViewport({width:1280,height:800});await p.goto(base+'admin/requests.html',{waitUntil:'networkidle0'});await sleep(400);
ok('desktop detail pane filled',(await txt(p,'[data-rq=detail-d]')).includes('Répondre sur WhatsApp'));
ok('sidebar visible',await p.$eval('.a-side',e=>getComputedStyle(e).display!=='none'));
ok('no console errors',p._errs.length===0,JSON.stringify(p._errs));
await b.close();console.log(fails?`\n${fails} FAILED`:'\nall passed');process.exit(fails?1:0);
