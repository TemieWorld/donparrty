import puppeteer from 'puppeteer-core';
import fs from 'fs';
const base=process.env.BASE||'http://127.0.0.1:8001/';
const root=new URL('../../mockup/',import.meta.url).pathname;
const pub=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const adm=fs.readdirSync(root+'admin').filter(f=>f.endsWith('.html')).map(f=>'admin/'+f);
const b=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']});
const BAD=/&(amp|lt|gt|quot|apos|#\d+);|<\/?[a-z]+[^>]{0,20}>|\\u[0-9a-fA-F]{4}|\\n|\{\{|\}\}|\{brand|\{inc|\bundefined\b|\bNaN\b|\[object|\bnull\b|\$\{/;
const EMO=/\p{Extended_Pictographic}/gu;
let problems=0;
for(const pg of [...pub,...adm]){
  for(const w of [375,1280]){
    const p=await b.newPage();await p.setViewport({width:w,height:900,isMobile:w<600});
    const errs=[],bad404=[];
    p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,160))});
    p.on('pageerror',e=>errs.push('PAGEERROR '+String(e).slice(0,200)));
    p.on('response',r=>{if(r.status()>=400)bad404.push(r.status()+' '+r.url().replace(base,''))});
    p.on('requestfailed',r=>{const e=r.failure()&&r.failure().errorText;if(e!=='net::ERR_ABORTED')bad404.push('FAIL '+e+' '+r.url().replace(base,''))});
    await p.evaluateOnNewDocument(()=>{try{sessionStorage.setItem('dp_admin','1');localStorage.setItem('dp_consent',JSON.stringify({shotgun:false,media:false,t:Date.now()}))}catch(e){}});
    await p.goto(base+pg,{waitUntil:'networkidle0'}).catch(()=>{});await new Promise(r=>setTimeout(r,1500));
    const r=await p.evaluate((BADs,EMOs)=>{const BAD=new RegExp(BADs),EMO=new RegExp(EMOs,'gu');
      const clone=document.body.cloneNode(true);clone.querySelectorAll('script,style').forEach(e=>e.remove());
      const t=clone.textContent.replace(/\s+/g,' ');const hits=[];let m;const re=new RegExp(BAD.source,'g');while((m=re.exec(t))&&hits.length<5)hits.push(t.slice(Math.max(0,m.index-40),m.index+50));
      const attrs=[...document.querySelectorAll('*')].flatMap(e=>[...e.attributes].filter(a=>BAD.test(a.value)).map(a=>e.tagName+'['+a.name+']='+a.value.slice(0,60))).slice(0,5);
      const imgs=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src.split('/').slice(-3).join('/'));
      const emo=[...new Set(t.match(EMO)||[])];
      return {hits,attrs,imgs,emo,hs:document.documentElement.scrollWidth>innerWidth+1,title:document.title}},BAD.source,EMO.source);
    const issues=[];if(r.hits.length)issues.push('TEXT '+JSON.stringify(r.hits));if(r.attrs.length)issues.push('ATTR '+JSON.stringify(r.attrs));if(r.imgs.length)issues.push('IMG '+r.imgs);if(errs.length)issues.push('ERR '+JSON.stringify(errs));if(bad404.length)issues.push('NET '+JSON.stringify(bad404));if(r.hs)issues.push('HSCROLL');if(!r.title)issues.push('NOTITLE');
    if(issues.length)problems++;
    console.log(pg.padEnd(28),String(w).padEnd(5),issues.length?issues.join(' | '):'ok',r.emo.length?'  emoji:'+r.emo.join(''):'');
    await p.close();
  }
}
console.log(problems?problems+' page/viewport combos with issues':'AUDIT CLEAN');
await b.close();
