import puppeteer from 'puppeteer-core';
const base=process.env.BASE||'http://127.0.0.1:8001/';
const b=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']});
let fails=0;const ok=(n,c,x='')=>{if(!c)fails++;console.log((c?'PASS':'FAIL'),n,x)};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ctx=await b.createBrowserContext();
async function page(url,{w=375,h=812,nock=true}={}){const p=await ctx.newPage();await p.setViewport({width:w,height:h,isMobile:w<600,hasTouch:w<600});
  const errs=[];p.on('pageerror',e=>errs.push(String(e).slice(0,200)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,200))});p._errs=errs;
  if(nock)await p.evaluateOnNewDocument(()=>{try{if(!localStorage.getItem('dp_consent'))localStorage.setItem('dp_consent',JSON.stringify({shotgun:false,media:false,t:Date.now()}))}catch(e){}});
  await p.goto(base+url,{waitUntil:'networkidle0'});await sleep(500);return p}
/* first visible element matching sel (m/d variants live side by side) */
const V=(p,sel,txt)=>p.evaluateHandle((sel,txt)=>[...document.querySelectorAll(sel)].find(e=>(e.offsetParent!==null||getComputedStyle(e).position==='fixed')&&(!txt||e.textContent.trim()===txt)),sel,txt);
const click=async(p,sel,txt)=>{const h=await V(p,sel,txt);const e=h.asElement();if(!e)throw new Error('not visible: '+sel+' '+(txt||''));await e.evaluate(x=>x.scrollIntoView({block:'center'}));await sleep(100);await e.click()};
const type=async(p,sel,t)=>{const h=(await V(p,sel)).asElement();await h.evaluate(x=>x.scrollIntoView({block:'center'}));await h.click();await h.type(t)};
const state=p=>p.evaluate(()=>JSON.parse(localStorage.dp_mock_state).d);
/* consent banner, banner, motion */
let p=await page('index.html',{nock:false});await sleep(900);
ok('consent banner shows',await p.$eval('#consent',e=>e.classList.contains('show')));
ok('top banner visible',await p.$$eval('[data-banner]',e=>e.some(x=>!x.hidden&&x.textContent.includes('LAST TICKET'))));
await click(p,'#consent [data-ck=no]');await sleep(300);ok('reject stores consent',await p.evaluate(()=>JSON.parse(localStorage.dp_consent).shotgun===false));
await click(p,'[data-motion-toggle]');ok('motion paused',await p.evaluate(()=>document.documentElement.dataset.motion==='paused'));
ok('countdown label',await p.$$eval('[data-cdl]',e=>e.some(x=>/^J-\d+$|CE SOIR/.test(x.textContent))));
ok('agenda has cards (upcoming)',await p.$$eval('[data-hook=agenda-list] > *',e=>e.length)>=1);
await click(p,'[data-agenda-mode=past]');await sleep(400);ok('past agenda lists more cards',await p.$$eval('[data-hook=agenda-list] > *',e=>e.length)>=5);
ok('lineup 8 artists (BLISSMAN first)',await p.$$eval('[data-hook=lineup]',e=>e.some(x=>x.textContent.startsWith('BLISSMAN')&&x.textContent.includes('DRSK')&&x.textContent.includes('DON MASSIMO'))));
/* newsletter */
await click(p,'[data-nl-form] button[type=submit]');await sleep(300);
ok('nl invalid shows errors',await p.$$eval('[data-nl-form] .bad',e=>e.length)>=1);
await type(p,'[data-nl-form] input[type=email],[data-nl-form] input[name=email]','test@example.com');
await click(p,'[data-nl-form] .cbx');await click(p,'[data-nl-form] button[type=submit]');await sleep(1600);
ok('nl success state',await p.$$eval('[data-nl-ok]',e=>e.some(x=>!x.hidden&&x.offsetParent!==null)));
ok('nl count stored',(await state(p)).nl.subsExtra===1);
ok('index no console errors',p._errs.length===0,JSON.stringify(p._errs));await p.close();
/* event + tickets */
p=await page('event.html');
await click(p,'[data-hook=tix] button');await sleep(2800);
ok('shotgun iframe loaded',await p.$$eval('iframe',e=>e.length>=1&&e.some(x=>x.offsetParent!==null)));
const ifr=await p.$('iframe');const fh=await ifr.contentFrame();const ch=await fh.evaluate(()=>document.documentElement.scrollHeight);const fhh=await ifr.evaluate(e=>e.getBoundingClientRect().height);
ok('iframe content fits (no inner scroll)',ch<=fhh+2,'content≈'+ch+' frame='+fhh);
ok('event no console errors',p._errs.length===0,JSON.stringify(p._errs));await p.close();
/* tables */
p=await page('tables.html');
await click(p,'[data-tbl-form] button[type=submit]');await sleep(300);
ok('table validation',await p.$$eval('[data-tbl-form] .bad',e=>e.length)>=3);
await type(p,'[data-tbl-form] input[name=name]','Test Guest');await type(p,'[data-tbl-form] input[name=wa]','6 39 98 00 99');
await click(p,'.chip-b[data-chip=size]','8');await click(p,'.chip-b[data-chip=arrival]','Après 01:30');await click(p,'[data-tbl-form] .cbx');
await click(p,'[data-tbl-form] button[type=submit]');await sleep(1800);
ok('table done panel',await p.$eval('[data-tbl-done]',e=>!e.hidden));
ok('request stored new',await p.evaluate(()=>{const s=JSON.parse(localStorage.dp_mock_state).d;return s.requests[0].name==='Test Guest'&&s.requests[0].status==='new'&&s.requests[0].size==='8'}));
ok('tables no console errors',p._errs.length===0,JSON.stringify(p._errs));await p.close();
/* work with us (DJ flow) */
p=await page('work-with-us.html');
await click(p,'[data-open-flow=dj]');await sleep(500);
ok('dj flow open',await p.$eval('.flow-screen[data-flow=dj]',e=>e.classList.contains('open')));
await click(p,'.flow-screen.open [data-flow-next]');await sleep(300);
ok('step 1 blocked when empty',await p.$$eval('.flow-screen.open .bad',e=>e.length)>=1);
const fill=async(n,t)=>type(p,`.flow-screen.open input[name=${n}]`,t);
await p.evaluate(()=>{document.querySelectorAll('.flow-screen.open input.inp[data-req]').forEach(i=>i.dataset.k=i.name)});
const names=await p.$$eval('.flow-screen.open .pstep.on input.inp',e=>e.map(x=>x.name));
for(const n of names)await fill(n,n.includes('handle')||n.includes('insta')?'@djtest':n.includes('link')||n.includes('mix')?'soundcloud.com/djtest':'DJ Test');
await p.$$eval('.flow-screen.open .pstep.on .chip-b',c=>c[0]&&c[0].click());
await click(p,'.flow-screen.open [data-flow-next]');await sleep(500);
ok('advanced to step 2',await p.$eval('.flow-screen.open [data-flow-count]',e=>e.textContent.includes('2')),await p.$eval('.flow-screen.open [data-flow-count]',e=>e.textContent));
ok('work no console errors (so far)',p._errs.length===0,JSON.stringify(p._errs));await p.close();
/* archives + night + lightbox + takedown */
p=await page('archives.html');
ok('archive index lists 11 published nights',await p.$$eval('[data-hook=nights] a',e=>new Set(e.map(x=>x.getAttribute('href'))).size)>=11);
ok('series filters present',await p.$$eval('[data-hook=series] button',e=>e.length)>=6);await p.close();
p=await page('archive-night.html?n=noa-act-ii');
ok('night title',await p.$$eval('[data-n=title]',e=>e.some(x=>x.textContent.includes('Act II')||x.textContent.includes('ACT II'))));
ok('credits show @gandhax',await p.$$eval('[data-n=credits]',e=>e.some(x=>x.textContent.includes('@gandhax'))));
await click(p,'[data-hook=wall] button');await sleep(900);ok('lightbox open',await p.$eval('dialog.lb-dlg',e=>e.open));
await click(p,'[data-lb=next]');await sleep(300);ok('next photo',await p.$$eval('[data-lb=count]',e=>e.some(x=>x.textContent.includes('2'))));
await click(p,'[data-lb=heart]');ok('heart toggles',await p.$$eval('[data-lb=heart]',e=>e.some(x=>x.getAttribute('aria-pressed')==='true'||x.classList.contains('on'))));
await click(p,'[data-lb=td]');await sleep(500);ok('takedown dialog open',await p.$$eval('dialog',e=>e.some(x=>x.open&&x.querySelector('[data-td-form]'))));
await type(p,'[data-td-form] input[type=email]','me@example.com');await click(p,'[data-td-form] .chip-b[data-chip=reason]');await click(p,'[data-td-form] .cbx');await click(p,'[data-td-form] button[type=submit]');await sleep(1800);
ok('takedown stored as retrait',(await state(p)).apps[0].type==='retrait'&&(await state(p)).apps[0].photo==='AII-002');
ok('night no console errors',p._errs.length===0,JSON.stringify(p._errs));await p.close();
/* misc */
p=await page('partners.html');ok('partners tiers',await p.$$eval('[data-hook=ptiers]',e=>e.some(x=>x.textContent.includes('Noctaa Club'))));await p.close();
p=await page('legal.html');ok('legal tabs',await p.$$eval('[data-hook=ltabs] button',e=>e.length)>=3);await p.close();
p=await page('info.html');await click(p,'[data-hook=faq] summary,[data-hook=faq] button');await sleep(400);ok('faq opens',await p.$$eval('[data-hook=faq] details[open],[data-hook=faq] [aria-expanded=true]',e=>e.length)>=1);await p.close();
p=await page('index.html');await click(p,'.lang');await sleep(200);ok('EN toggle',await p.$$eval('[data-nav=index],nav a',e=>e.some(x=>x.textContent.trim()==='Agenda')));await p.close();
await b.close();console.log(fails?`\n${fails} FAILED`:'\nall passed');process.exit(fails?1:0);
