import puppeteer from 'puppeteer-core';
import fs from 'fs';
const base=process.env.BASE||'http://localhost:8001/';
const out=new URL('../../screenshots/',import.meta.url).pathname;
fs.mkdirSync(out+'mobile',{recursive:true});fs.mkdirSync(out+'desktop',{recursive:true});
const b=await puppeteer.launch({executablePath:process.env.CHROME||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:'new'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const devices={mobile:{width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true},desktop:{width:1440,height:900,deviceScaleFactor:1.5}};
// [name, url, full?]
const shots=[
 ['01-home-first-screen','index.html',false],['02-home-full','index.html',true],
 ['03-event-act-iii','event.html',true],
 ['04-archives','archives.html',true],
 ['05-archive-night-act-ii','archive-night.html?n=noa-act-ii',true],
 ['06-work-with-us','work-with-us.html',false],
 ['07-tables','tables.html',true],
 ['08-admin-overview','admin/overview.html',false],
 ['09-admin-requests','admin/requests.html',false],
 ['10-admin-newsletter','admin/newsletter.html',false],
];
for(const [dev,vp] of Object.entries(devices)){
  for(const [name,url,full] of shots){
    const p=await b.newPage();await p.setViewport(vp);
    await p.evaluateOnNewDocument(()=>{try{localStorage.setItem('dp_consent',JSON.stringify({shotgun:false,media:false,t:Date.now()}));sessionStorage.setItem('dp_admin','1')}catch(e){}});
    await p.goto(base+url,{waitUntil:'networkidle0'});await sleep(2200);
    if(full){await p.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=400){scrollTo(0,y);await new Promise(r=>setTimeout(r,140))}scrollTo(0,0);await new Promise(r=>setTimeout(r,700))})}
    else{await p.evaluate(()=>{const v=document.querySelector('video[data-loop]');if(v){v.currentTime=4.2}});await sleep(1200)}
    await p.screenshot({path:`${out}${dev}/${name}.png`,fullPage:full});
    console.log(dev,name);await p.close();
  }
}
await b.close();
