/* Public shell: menu, banner, consent, reveals, countdown, ticker, hero, newsletter, takedown */
(function(){
var DP=window.DP,$=DP.$,$$=DP.$$,esc=DP.esc;
var S=function(){return DP.store.get()};
DP.initMotion();
var START=Date.parse(DP.event.start),END=Date.parse(DP.event.end);
/* ---- consent ---- */
var CK='dp_consent';
DP.consent={get:function(){var c=DP.lsGet(CK,null);if(c&&Date.now()-c.t>183*864e5)c=null;return c},
  has:function(cat){var c=this.get();return !!(c&&c[cat])},
  set:function(o){DP.lsSet(CK,{shotgun:!!o.shotgun,media:!!o.media,t:Date.now()});document.dispatchEvent(new Event('dp:consent'))}};
function setSw(b,on){b.setAttribute('aria-checked',String(on))}
function initConsent(){var box=$('#consent'),dlg=$('#consent-dlg');if(!box)return;
  var show=function(){box.classList.add('show')},hide=function(){box.classList.remove('show')};
  if(!DP.consent.get())setTimeout(show,700);
  function openDlg(){var c=DP.consent.get()||{};$$('[data-ck-sw]',dlg).forEach(function(b){setSw(b,!!c[b.dataset.ckSw])});DP.openDlg(dlg)}
  $$('[data-ck]',box).forEach(function(b){b.addEventListener('click',function(){var a=b.dataset.ck;
    if(a==='no'){DP.consent.set({});hide()}else if(a==='yes'){DP.consent.set({shotgun:1,media:1});hide()}else{hide();openDlg()}})});
  $$('[data-ck-sw]',dlg).forEach(function(b){b.addEventListener('click',function(){setSw(b,b.getAttribute('aria-checked')!=='true')})});
  $('[data-ck-none]',dlg).addEventListener('click',function(){DP.consent.set({});DP.closeDlg(dlg);hide()});
  $('[data-ck-save]',dlg).addEventListener('click',function(){var o={};$$('[data-ck-sw]',dlg).forEach(function(b){o[b.dataset.ckSw]=b.getAttribute('aria-checked')==='true'});DP.consent.set(o);DP.closeDlg(dlg);hide();DP.toast(DP.lang==='en'?'Preferences saved':'Préférences enregistrées 💚')});
  document.addEventListener('click',function(e){if(e.target.closest('[data-open-consent]')){e.preventDefault();hide();openDlg()}});
}
/* ---- header / menu / lang ---- */
function initHeader(){
  var menu=$('#menu'),openers=$$('[data-menu-open]');
  function setMenu(o){
    if(o){var h=$('.v-m header'),t=h?Math.max(0,Math.round(h.getBoundingClientRect().bottom)):0;menu.style.setProperty('--menu-top',t+'px')}
    menu.classList.toggle('open',o);openers.forEach(function(b){b.setAttribute('aria-expanded',String(o))});document.body.style.overflow=o?'hidden':'';
    if(o){var a=$('a.mi',menu);a&&a.focus({preventScroll:true})}else if(openers[0])openers[0].focus({preventScroll:true})}
  openers.forEach(function(b){b.addEventListener('click',function(){setMenu(!menu.classList.contains('open'))})});
  $$('a',menu).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open'))setMenu(false)});
  var de=document.documentElement;function sc(){de.classList.toggle('hdr-scrolled',scrollY>8)}addEventListener('scroll',sc,{passive:true});sc();
  addEventListener('resize',function(){if(innerWidth>=1100&&menu.classList.contains('open'))setMenu(false)});
  /* keep everything still while the pane is open: no page scroll behind it, no bounce when its content fits */
  function still(e){if(!menu.classList.contains('open'))return;var inside=menu.contains(e.target);if(!inside||menu.scrollHeight<=menu.clientHeight+1)e.preventDefault()}
  document.addEventListener('touchmove',still,{passive:false});document.addEventListener('wheel',still,{passive:false});
  var f=(location.pathname.split('/').pop()||'index.html').replace('.html','');if(f==='archive-night')f='archives';if(f==='event')f='index';
  $$('.dnav a[data-nav]').forEach(function(a){if(a.dataset.nav===f)a.style.color='#3CFF4E'});
  document.addEventListener('click',function(e){if(e.target.closest('.lang'))DP.setLang(DP.lang==='fr'?'en':'fr')});
  DP.applyLang();
}
/* ---- banner (admin-controlled) ---- */
DP.bannerVisible=function(b,now){now=now||Date.now();return !!(b&&b.on&&(!b.start||now>=Date.parse(b.start))&&(!b.end||now<Date.parse(b.end)))};
function initBanner(){var b=S().banner,vis=DP.bannerVisible(b);
  $$('[data-banner]').forEach(function(el){
    if(!vis){el.hidden=true;return}
    var href=/^https?:/.test(b.link||'')?b.link:(b.link||'event.html');
    el.setAttribute('data-style',b.style||'dark');el.innerHTML='<a href="'+esc(href)+'"><span class="dot" aria-hidden="true"></span><span class="bt">'+esc(b.text)+'</span></a>'})}
/* ---- settings in footer/legal ---- */
function initSettings(){var s=S().settings;
  $$('[data-set]').forEach(function(el){var k=el.dataset.set,v=s[k];
    if(k==='licence'||k==='company'||k==='email'){el.textContent=v||'à compléter'}
    else if(k==='credit'){el.textContent=v||'Site par Temi'}
    else if(k==='instagram-link'){el.href='https://www.instagram.com/'+String(s.instagram||'donparrty.fr').replace('@','')+'/'}});
  document.documentElement.dataset.nl=S().nl.formVisible===false?'off':'on'}
/* ---- reveals ---- */
function initReveal(){
  $$('[data-stagger]').forEach(function(p){Array.prototype.forEach.call(p.children,function(c,i){c.classList.add('reveal');c.style.setProperty('--i',Math.min(i,6))})});
  if(!('IntersectionObserver' in window)||DP.reduced()){DP.reveal=function(r){$$('.reveal',r).forEach(function(e){e.classList.add('shown')})};DP.reveal();return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('shown');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.06});
  DP.reveal=function(root){$$('.reveal:not(.shown)',root).forEach(function(e){io.observe(e)})};DP.reveal();
  setTimeout(function(){$$('.reveal:not(.shown)').forEach(function(e){var r=e.getBoundingClientRect();if(r.top<innerHeight&&r.height>0)e.classList.add('shown')})},1500)}
/* ---- sticky bar ---- */
function initSticky(){var bar=$('#sticky');if(!bar)return;if(document.body.dataset.scta!=='1'){bar.remove();return}
  var page=document.body.dataset.page,tix=$$('[data-anchor=tickets]').filter(function(e){return e.offsetParent!==null}),vis=false;
  function upd(){bar.classList.toggle('off',vis)}
  if(!('IntersectionObserver' in window)){bar.classList.remove('off');return}
  if(page==='home'){var cta=$$('[data-hero-cta]').filter(function(e){return e.offsetParent!==null})[0];vis=true;upd();
    if(cta)new IntersectionObserver(function(es){vis=es[0].isIntersecting;upd()}).observe(cta);else{vis=false;upd()}}
  else{vis=false;upd();tix.forEach(function(t){new IntersectionObserver(function(es){vis=es[0].isIntersecting;upd()},{threshold:.1}).observe(t)})}}
/* ---- anchors: m and d variants both exist, so scroll to the visible one ---- */
function anchorEl(n){return $$('[data-anchor='+n+']').filter(function(e){return e.offsetParent!==null})[0]}
function goAnchor(n,smooth){var e=anchorEl(n);if(!e)return false;var h=$$('.hdr-sticky').filter(function(x){return x.offsetParent!==null})[0],y=e.getBoundingClientRect().top+scrollY-((h?h.offsetHeight:0)+8);DP.scrollToY(y,smooth);return true}
document.addEventListener('click',function(e){var a=e.target.closest('a[href*="#"]');if(!a)return;var u=new URL(a.getAttribute('href'),location.href);if(u.pathname!==location.pathname||!u.hash)return;var n=u.hash.slice(1);if(anchorEl(n)){e.preventDefault();goAnchor(n,true);history.replaceState(null,'','#'+n)}});
function initAnchors(){var h=(location.hash||'').slice(1);if(h&&$$('[data-anchor='+h+']').length)setTimeout(function(){goAnchor(h,false)},60)}
/* ---- countdown ---- */
DP.cdLabel=function(now){now=now||Date.now();if(now>=END)return '';if(now>=START)return DP.lang==='en'?'LIVE':'EN COURS';var j=DP.daysTo(DP.event.start,new Date(now));return j<=0?(DP.lang==='en'?'TONIGHT':'CE SOIR'):'J-'+j};
function initCountdown(){
  var roots=$$('[data-cd]'),LAB={fr:['JOURS','HEURES','MIN','SEC'],en:['DAYS','HOURS','MIN','SEC']};
  roots.forEach(function(r){var h=+r.dataset.h||34,w=+r.dataset.w||17,fs=+r.dataset.fs||30;
    $$('.cd-box',r).forEach(function(box,i){var wrap=$('.cd-digits',box);wrap.innerHTML='';
      for(var k=0;k<2;k++){var o=document.createElement('div');o.style.cssText='height:'+h+'px;overflow:hidden';var c=document.createElement('div');c.className='odo-col';
        c.innerHTML='0123456789'.split('').map(function(d){return '<div style="height:'+h+'px;width:'+w+'px;text-align:center;font:400 '+fs+'px/'+h+'px \'Anton\'">'+d+'</div>'}).join('');o.appendChild(c);wrap.appendChild(o)}})});
  function update(){var now=Date.now(),diff=Math.max(0,START-now),
    d=Math.floor(diff/864e5),h=Math.floor(diff/36e5)%24,m=Math.floor(diff/6e4)%60,s=Math.floor(diff/1e3)%60,vals=[d,h,m,s],lab=DP.cdLabel(now),counting=now<START;
    $$('[data-cdl]').forEach(function(e){e.textContent=lab;e.hidden=!lab});
    roots.forEach(function(r){var boxes=$$('.cd-box',r);boxes.forEach(function(box,i){
        var cols=$$('.odo-col',box),v=vals[i];if(cols.length===2){cols[0].style.transform='translateY(-'+(Math.floor(v/10)%10)*10+'%)';cols[1].style.transform='translateY(-'+(v%10)*10+'%)'}
        var lb=$('.cd-lab',box);if(lb)lb.textContent=LAB[DP.lang==='en'?'en':'fr'][i];
        if(i===3)box.hidden=DP.reduced()});
      r.hidden=!counting;var note=r.parentNode&&$('[data-cd-note]',r.parentNode);if(note)note.hidden=!counting});
    $$('[data-cd-sr]').forEach(function(e){e.textContent=counting?'Ouverture dans '+d+' jours, '+h+' heures et '+m+' minutes':(now<END?'La soirée est en cours':'Soirée terminée')});
  }
  function loop(){update();setTimeout(loop,1000-(Date.now()%1000)+15)}
  DP.cdUpdate=update;loop();document.addEventListener('dp:lang',update)}
/* ---- marquees: scroll-speed boost ---- */
function initTicker(){var tracks=$$('.ticker-inner,.mq-inner');if(!tracks.length||DP.reduced())return;
  var last=window.scrollY,lt=performance.now(),rate=1,target=1,running=false;
  function loop(){rate+=(target-rate)*.07;target+=(1-target)*.04;
    tracks.forEach(function(t){var a=t.getAnimations&&t.getAnimations()[0];if(a&&a.updatePlaybackRate)a.updatePlaybackRate(rate)});
    if(Math.abs(rate-1)>.01||target>1.01)requestAnimationFrame(loop);else{running=false;rate=1;tracks.forEach(function(t){var a=t.getAnimations()[0];a&&a.updatePlaybackRate(1)})}}
  addEventListener('scroll',function(){var now=performance.now(),dy=Math.abs(window.scrollY-last),dt=Math.max(now-lt,16);last=window.scrollY;lt=now;
    target=Math.max(target,Math.min(1+dy/dt/1.2*0.4,1.4));if(!running&&!DP.motionPaused()){running=true;requestAnimationFrame(loop)}},{passive:true})}
/* ---- smooth scroll: inertial wheel (desktop pointers), eased anchors, hero parallax. Native touch scrolling is left alone. ---- */
function initSmooth(){
  /* feel: lower SPEED = slower page, higher SMOOTH = longer, softer start and stop */
  var SPEED=.6,SMOOTH=.42,MAXV=2200,sm=SMOOTH;
  var de=document.documentElement,cur=scrollY,tgt=cur,vel=0,lastSet=cur,raf=0,last=0,anim=null;
  function live(){return !DP.motionPaused()}
  function max(){return Math.max(0,de.scrollHeight-de.clientHeight)}
  function clamp(v){return Math.min(max(),Math.max(0,v))}
  function ease(p){return p<.5?8*p*p*p*p:1-Math.pow(-2*p+2,4)/2}
  /* critically damped spring (smooth-damp): velocity ramps up and eases out, no sudden start */
  function damp(dt){var w=2/sm,x=w*dt,e=1/(1+x+.48*x*x+.235*x*x*x),ch=cur-tgt,lim=MAXV*sm;ch=Math.max(-lim,Math.min(lim,ch));var t=(vel+w*ch)*dt;vel=(vel-w*t)*e;var o=tgt+(ch+t)*e;
    cur=o}
  function tick(t){raf=0;var dt=Math.min(.05,(t-(last||t-16))/1000);last=t;
    if(anim){var p=Math.min(1,(t-anim.t0)/anim.d);cur=anim.from+(anim.to-anim.from)*ease(p);tgt=cur;vel=0;if(p>=1)anim=null}
    else{damp(dt);if(Math.abs(tgt-cur)<.3&&Math.abs(vel)<6){cur=tgt;vel=0}}
    var mx=max();if(tgt>mx)tgt=mx;if(cur>mx){cur=mx;vel=0}if(cur<0){cur=0;vel=0}
    lastSet=cur;scrollTo(0,cur);
    if(anim||cur!==tgt||vel)raf=requestAnimationFrame(tick);else last=0}
  function run(){if(!raf){last=0;raf=requestAnimationFrame(tick)}}
  /* anything else that moves the page (keyboard, scrollbar drag, jump links) just resyncs us */
  addEventListener('scroll',function(){if(raf)return;if(Math.abs(scrollY-lastSet)>1.5){cur=tgt=lastSet=scrollY;vel=0;anim=null}},{passive:true});
  DP.scrollToY=function(y,smooth){y=clamp(y);if(!smooth||!live()||Math.abs(y-scrollY)<2){anim=null;vel=0;cur=tgt=lastSet=y;scrollTo(0,y);return}
    cur=scrollY;anim={from:cur,to:y,t0:performance.now(),d:Math.min(1700,Math.max(900,Math.abs(y-cur)*.85))};run()};
  function inner(el,dy){for(;el&&el!==de&&el!==document.body&&el.nodeType===1;el=el.parentElement){var cs=getComputedStyle(el);
    if(/(auto|scroll)/.test(cs.overflowY)&&el.scrollHeight>el.clientHeight+1){if(dy>0?el.scrollTop+el.clientHeight<el.scrollHeight-1:el.scrollTop>0)return true}}return false}
  addEventListener('wheel',function(e){
    if(e.ctrlKey||e.defaultPrevented||!live()||document.body.style.overflow==='hidden'||Math.abs(e.deltaX)>Math.abs(e.deltaY)||inner(e.target,e.deltaY))return;
    e.preventDefault();anim=null;if(!raf){cur=tgt=lastSet=scrollY;vel=0}
    var d=e.deltaY*(e.deltaMode===1?34:e.deltaMode===2?innerHeight:1);tgt=clamp(tgt+Math.max(-140,Math.min(140,d))*SPEED);sm=SMOOTH;run()},{passive:false});
  /* phone touch smoothing: touch devices only. Same spring as the wheel instead of the browser's own touch inertia. */
  var touchOn=('ontouchstart' in window)||(navigator.maxTouchPoints>0);
  if(touchOn){var ty=0,tx=0,ts=0,mode=0,hist=[];
    addEventListener('touchstart',function(e){mode=0;if(e.touches.length!==1||!live()||document.body.style.overflow==='hidden'||inner(e.target,1)||inner(e.target,-1)||e.target.closest('input,textarea,select,iframe,video[controls]')){mode=-1;return}
      var t=e.touches[0];ty=t.clientY;tx=t.clientX;anim=null;cur=tgt=lastSet=scrollY;vel=0;ts=cur;hist=[[performance.now(),ty]]},{passive:true});
    addEventListener('touchmove',function(e){if(mode===-1)return;if(e.touches.length!==1){mode=-1;return}var t=e.touches[0];
      if(mode===0){var ax=Math.abs(t.clientX-tx),ay=Math.abs(t.clientY-ty);if(ax<4&&ay<4)return;mode=ay>=ax?1:-1;if(mode===-1)return}
      /* the browser already started scrolling on its own: step aside completely */
      if(!e.cancelable){mode=-1;cur=tgt=lastSet=scrollY;vel=0;anim=null;return}
      e.preventDefault();var now=performance.now();hist.push([now,t.clientY]);while(hist.length>2&&now-hist[0][0]>110)hist.shift();
      tgt=clamp(ts-(t.clientY-ty));sm=.14;run()},{passive:false});
    addEventListener('touchend',function(){if(mode!==1)return;mode=0;var n=hist.length,a=hist[0],b=hist[n-1],dt=(b[0]-a[0])/1000;
      if(n>1&&dt>.016&&performance.now()-b[0]<90){var f=-(b[1]-a[1])/dt*.22,L=innerHeight*.9;tgt=clamp(tgt+Math.max(-L,Math.min(L,f)))}sm=.5;run()},{passive:true});
    addEventListener('touchcancel',function(){mode=0;sm=.5;run()},{passive:true});
  }
  /* hero parallax: the video drifts slower than the page */
  var px=$$('[data-parallax]'),pr=0;
  function par(){pr=0;var y=live()?scrollY:0;px.forEach(function(el){el.style.transform=y>innerHeight*1.3?el.style.transform:'translate3d(0,'+(y*(+el.dataset.parallax)).toFixed(1)+'px,0)'})}
  if(px.length){addEventListener('scroll',function(){if(!pr)pr=requestAnimationFrame(par)},{passive:true});document.addEventListener('dp:motion',par);par()}
}
/* ---- hero: sign lit state, cursor glow (desktop) ---- */
/* ---- looping videos: play only when visible, not paused, not reduced motion (poster stays) ---- */
function initVideos(){var vs=$$('video[data-loop]');if(!vs.length)return;
  function sync(v){if(!DP.motionPaused()&&v._in!==false){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()}
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){e.target._in=e.isIntersecting;sync(e.target)})},{threshold:.15}):null;
  vs.forEach(function(v){if(io)io.observe(v);else sync(v)});
  document.addEventListener('dp:motion',function(){vs.forEach(sync)})}
function initHero(){var heroes=$$('[data-hero]');
  var seen=false;try{seen=sessionStorage.getItem('dp_lit')==='1'}catch(e){}
  heroes.forEach(function(h){if(seen||DP.reduced()||DP.motionPaused())h.classList.add('lit')});
  if(!seen&&!DP.reduced()&&!DP.motionPaused()){try{sessionStorage.setItem('dp_lit','1')}catch(e){}}
  document.addEventListener('dp:motion',function(){if(DP.motionPaused())heroes.forEach(function(h){h.classList.add('lit')})});
  $$('[data-glow-zone]').forEach(function(z){var g=$('[data-glow]',z);if(!g||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    z.addEventListener('mousemove',function(e){if(DP.motionPaused()||DP.reduced())return;var r=(g.offsetParent||z).getBoundingClientRect();g.style.transform='translate('+(e.clientX-r.left)+'px,'+(e.clientY-r.top)+'px)'})})}
/* ---- text scramble (desktop hover only) ---- */
DP.scramble=function(el){if(DP.reduced()||DP.motionPaused()||el._s)return;el._s=1;var txt=el.dataset.final||el.textContent;el.dataset.final=txt;var w=el.getBoundingClientRect().width;el.style.width=w+'px';el.style.display='block';el.style.whiteSpace='nowrap';el.style.overflow='hidden';
  var glyphs='ABCDEFGHIJKLMNOPRSTUVWXYZ',t0=performance.now();
  (function f(now){var p=Math.min(1,(now-t0)/400),n=Math.floor(p*txt.length),out='';for(var i=0;i<txt.length;i++)out+=(i<n||txt[i]===' ')?txt[i]:glyphs[Math.floor(Math.random()*glyphs.length)];el.textContent=out;
    if(p<1)requestAnimationFrame(f);else{el.textContent=txt;el._s=0}})(t0)};
function initScramble(){if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  document.addEventListener('pointerover',function(e){var c=e.target.closest&&e.target.closest('[data-scramble-card],[data-scramble]');var el=c&&(c.matches('[data-scramble]')?c:c.querySelector('[data-scramble]'));if(el)DP.scramble(el)})}
/* ---- newsletter ---- */
function subscribe(){var st=S();st.nl.subsExtra++;DP.store.save()}
function initNewsletter(){
  $$('[data-nl-form]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();if(!DP.validate(f))return;var btn=$('button[type=submit]',f);
    DP.submitFx(btn,700,function(){subscribe();var card=f.closest('[data-nl-card]');if(card){$('[data-nl-form-wrap]',card).hidden=true;var ok=$('[data-nl-ok]',card);ok.hidden=false}f.reset()})})});
  var dlg=$('#nl-dlg'),pending='';
  $$('[data-nl-mini]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var i=$('input[name=email]',f),v=i.value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){i.style.borderColor='#FF4D4D';DP.nudge(f);i.focus();return}i.style.borderColor='';pending=v;$('.nl-dlg-mail',dlg).textContent=v;$('#nl-dlg-ok').checked=false;DP.openDlg(dlg)})});
  $('#nl-dlg-go').addEventListener('click',function(){var ok=$('#nl-dlg-ok');var lab=ok.closest('.cbx');if(!ok.checked){lab.classList.add('bad');DP.nudge(lab);return}lab.classList.remove('bad');
    DP.submitFx($('#nl-dlg-go'),600,function(){subscribe();setTimeout(function(){DP.closeDlg(dlg);$$('[data-nl-mini]').forEach(function(f){f.reset()});DP.toast('C’est noté — check ta boîte mail 💚')},500)})})}
/* ---- takedown dialog ---- */
function initTakedown(){var dlg=$('#td-dlg');if(!dlg)return;var form=$('[data-td-form]',dlg);
  document.addEventListener('click',function(e){var b=e.target.closest('[data-takedown]');if(!b)return;e.preventDefault();var pid=b.dataset.photo||'';
    $('[name=photo]',form).value=pid;$('.td-photo',dlg).textContent=pid?'Photo concernée : '+pid:'';$('.td-link',dlg).hidden=!!pid;
    $$('.chip-b',form).forEach(function(c){c.setAttribute('aria-pressed','false')});$$('.fld.bad,.cbx.bad',form).forEach(function(x){x.classList.remove('bad')});
    var lb=$('#lb');if(lb&&lb.open)DP.closeDlg(lb);DP.openDlg(dlg)});
  form.addEventListener('submit',function(e){e.preventDefault();if(!DP.validate(form))return;var btn=$('button[type=submit]',form);
    DP.submitFx(btn,700,function(){var s=S(),fd=new FormData(form),reason=DP.chipValues(form,'reason')[0]||'—';
      s.apps.unshift({id:DP.store.id(),type:'retrait',name:fd.get('photo')?'Photo '+fd.get('photo'):'Demande de retrait',contact:fd.get('email'),ago:'à l’instant',status:'new',photo:fd.get('photo')||fd.get('link'),msg:reason,fields:[['Photo',fd.get('photo')||fd.get('link')||'—'],['Motif',reason],['Demandé par',fd.get('email')]]});
      DP.store.save();setTimeout(function(){DP.closeDlg(dlg);form.reset();DP.toast('Demande reçue — la photo sera masquée dès examen. Merci 💚')},500)})})}
document.addEventListener('DOMContentLoaded',function(){[initHeader,initBanner,initSettings,initConsent,initReveal,initSticky,initSmooth,initAnchors,initCountdown,initTicker,initHero,initVideos,initScramble,initNewsletter,initTakedown].forEach(function(f){try{f()}catch(e){if(window.console)console.error('init failed:',f.name,e)}})});
})();
