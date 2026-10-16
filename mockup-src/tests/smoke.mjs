import puppeteer from 'puppeteer-core';
const base=process.env.BASE||'http://127.0.0.1:8001/';
const pages=(process.argv[2]||'index.html').split(',');
const w=+process.argv[3]||375, h=+process.argv[4]||812, full=process.argv[5]==='full';
const b=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new',args:['--no-sandbox']});
for(const pg of pages){
  const p=await b.newPage(); await p.setViewport({width:w,height:h,deviceScaleFactor:1,isMobile:w<600,hasTouch:w<600});
  const errs=[],outside=new Set();
  p.on('console',m=>{if(['error','warning'].includes(m.type()))errs.push(m.type()+': '+m.text().slice(0,200))});
  p.on('pageerror',e=>errs.push('PAGEERROR: '+String(e).slice(0,300)));
  p.on('request',r=>{const u=r.url();if(!u.startsWith(base)&&!u.startsWith('data:')&&!u.startsWith('blob:'))outside.add(u)});
  p.on('requestfailed',r=>errs.push('REQFAIL '+r.url()));
  if(process.env.NOCK)await p.evaluateOnNewDocument(()=>{try{localStorage.setItem('dp_consent',JSON.stringify({shotgun:false,media:false,t:Date.now()}))}catch(e){}});
  if(process.env.SESSION)await p.evaluateOnNewDocument(()=>{try{sessionStorage.setItem('dp_admin','1')}catch(e){}});
  await p.goto(base+pg,{waitUntil:'networkidle0'}); await new Promise(r=>setTimeout(r,1800));
  await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,120))}scrollTo(0,0);await new Promise(r=>setTimeout(r,500))});
  const out=`${process.env.SHOTS||'/tmp'}/${pg.replace(/[^\w]/g,'_')}_${w}.png`;
  if(process.env.SEGS){const H=await p.evaluate(()=>document.documentElement.scrollHeight);const sh=+process.env.SEGS;for(let i=0;i*sh<H;i++){await p.screenshot({path:out.replace('.png','_s'+i+'.png'),clip:{x:0,y:i*sh,width:w,height:Math.min(sh,H-i*sh)},captureBeyondViewport:true});}console.log('height',H)}else await p.screenshot({path:out,fullPage:full});
  const hscroll=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
  console.log(pg.padEnd(34),'errors:',errs.length?errs:'none','| outside:',[...outside].length?[...outside]:'none','| hscroll:',hscroll,'->',out);
  await p.close();
}
await b.close();
