/* Shared helpers: store, i18n, toast, motion, forms. No outside requests. */
(function(){
var DP=window.DP;
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
DP.$=$;DP.$$=$$;
var clone=function(o){return JSON.parse(JSON.stringify(o))};DP.clone=clone;
/* ---- store (localStorage, always wrapped) ---- */
var KEY='dp_mock_state',cache=null;
function fresh(){var s=clone(DP.seed);s.nights=clone(DP.nights);s.nights.forEach(function(n){n.hiddenPhotos={}});s.partners=clone(DP.partners);return s}
DP.store={
  get:function(){if(cache)return cache;try{var r=JSON.parse(localStorage.getItem(KEY));if(r&&r.v===DP.VERSION){cache=r.d;return cache}}catch(e){}cache=fresh();return cache},
  save:function(){try{localStorage.setItem(KEY,JSON.stringify({v:DP.VERSION,d:cache}))}catch(e){}document.dispatchEvent(new Event('dp:state'))},
  reset:function(){cache=null;try{localStorage.removeItem(KEY);localStorage.removeItem('dp_consent');localStorage.removeItem('dp_likes')}catch(e){}},
  id:function(){var s=this.get();return s.nextId++}
};
DP.lsGet=function(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}};
DP.lsSet=function(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
/* night photos honouring the admin's order and hidden flags */
DP.nightPhotos=function(n,withHidden){var ps=DP.photos(n);
  if(n.order&&n.order.length){var pos={};n.order.forEach(function(id,i){pos[id]=i});ps.sort(function(a,b){return (pos[a.id]===undefined?999:pos[a.id])-(pos[b.id]===undefined?999:pos[b.id])})}
  return withHidden?ps:ps.filter(function(p){return !(n.hiddenPhotos&&n.hiddenPhotos[p.id])})};
/* ---- time ---- */
DP.fmt=function(iso,o){return new Intl.DateTimeFormat('fr-FR',Object.assign({timeZone:'Europe/Paris'},o||{weekday:'short',day:'numeric',month:'short'})).format(new Date(iso))};
DP.parisYMD=function(d){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Paris'}).format(d)};
DP.daysTo=function(iso,now){var a=new Date(DP.parisYMD(new Date(iso))+'T00:00:00Z'),b=new Date(DP.parisYMD(now||new Date())+'T00:00:00Z');return Math.round((a-b)/864e5)};
DP.esc=function(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
/* ---- i18n (UI chrome only; hype copy stays English, logistics French) ---- */
var EN={'nav.agenda':'Agenda','nav.archives':'Archives','nav.tables':'Tables','nav.work':'Work with us','nav.partners':'Partners','nav.info':'Info','nav.newsletter':'Newsletter',
'ft.info':'Info & FAQ','ft.legal':'Legal notice','ft.priv':'Privacy','ft.cookies':'Cookies','ft.manage':'Manage cookies','ft.licence':'Entrepreneur de spectacles licence (récépissé) no.:',
'nl.consent':'I want to receive the Don Parrty newsletter (announcements, tickets, events). Unsubscribe in 1 click.',
'ck.title':'COOKIES','ck.text':'No analytics here. Cookies are only used to load Shotgun ticketing and videos, if you want them.','ck.more':'Learn more','ck.no':'Reject all','ck.cust':'Customise','ck.yes':'Accept all','ck.cust2':'CUSTOMISE','ck.save':'Save','ck.shotgun':'Shotgun ticketing (Shotgun cookies)','ck.media':'Videos / social media'};
DP.lang=DP.lsGet('dp_lang','fr');
DP.t=function(k,fr){return DP.lang==='en'&&EN[k]?EN[k]:(fr||k)};
DP.applyLang=function(root){
  $$('[data-t]',root).forEach(function(el){if(el._fr===undefined)el._fr=el.textContent;var k=el.getAttribute('data-t');el.textContent=(DP.lang==='en'&&EN[k])?EN[k]:el._fr});
  document.documentElement.lang=DP.lang;
  $$('.lang').forEach(function(b){var fr=DP.lang==='fr';var a=$('.la',b),c=$('.lb',b);var sep=b.dataset.sep||'/';if(a){a.textContent=fr?'FR':'EN'}if(c){c.textContent=sep+(fr?'EN':'FR')}});
};
DP.setLang=function(l){DP.lang=l;DP.lsSet('dp_lang',l);DP.applyLang();document.dispatchEvent(new Event('dp:lang'))};
/* ---- toast (design: light toast, dot, underlined action) ---- */
DP.toast=function(msg,o){o=o||{};var box=$('#toasts');if(!box){box=document.createElement('div');box.id='toasts';box.setAttribute('role','status');box.setAttribute('aria-live','polite');document.body.appendChild(box)}
  var t=document.createElement('div');t.className='toast'+(o.err?' err':'');
  t.innerHTML='<span class="d"></span><span class="m"></span>'+(o.action?'<button type="button" class="a"></button>':'')+(o.noclose?'':'<button type="button" class="x" aria-label="Fermer">OK</button>');
  t.querySelector('.m').textContent=msg;var timer;
  function close(){clearTimeout(timer);t.classList.add('out');setTimeout(function(){t.remove()},220)}
  if(o.action){var a=t.querySelector('.a');a.textContent=o.label||'Annuler';a.style.marginLeft='auto';a.onclick=function(){o.action();close()}}
  var x=t.querySelector('.x');if(x){x.onclick=close;if(o.action)x.style.marginLeft='0'}
  function arm(){timer=setTimeout(close,o.ms||4000)}arm();
  t.addEventListener('mouseenter',function(){clearTimeout(timer)});t.addEventListener('mouseleave',arm);t.addEventListener('focusin',function(){clearTimeout(timer)});t.addEventListener('focusout',arm);
  box.appendChild(t);return close};
/* ---- motion toggle (⏸ Motion / ▶ Motion) ---- */
DP.motionPaused=function(){return document.documentElement.dataset.motion==='paused'};
DP.reduced=function(){return window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches};
DP.setMotion=function(p){document.documentElement.dataset.motion=p?'paused':'';DP.lsSet('dp_motion',p?'paused':'running');
  $$('[data-motion-toggle]').forEach(function(b){b.setAttribute('aria-pressed',String(p));});
  document.dispatchEvent(new Event('dp:motion'))};
DP.initMotion=function(){var m=DP.lsGet('dp_motion',null);var p=m==='paused'||(m===null&&DP.reduced());DP.setMotion(p);
  document.addEventListener('click',function(e){if(e.target.closest('[data-motion-toggle]'))DP.setMotion(!DP.motionPaused())})};
/* ---- forms ---- */
DP.nudge=function(el){el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake')};
DP.submitFx=function(btn,ms,cb){if(btn.dataset.state==='loading')return;btn.dataset.state='loading';btn.disabled=true;
  setTimeout(function(){btn.dataset.state='done';cb&&cb();setTimeout(function(){btn.dataset.state='';btn.disabled=false},900)},ms||700)};
/* single/multi chips: <button class="chip-b" data-chip="group" data-multi data-check aria-pressed> */
document.addEventListener('click',function(e){var b=e.target.closest('.chip-b[data-chip]');if(!b)return;var multi=b.hasAttribute('data-multi');
  if(multi){setChip(b,b.getAttribute('aria-pressed')!=='true')}else{$$('.chip-b[data-chip="'+b.dataset.chip+'"]',b.closest('form,[data-chipscope]')||document).forEach(function(x){setChip(x,x===b)})}
  var f=b.closest('.fld');if(f)f.classList.remove('bad')});
function setChip(b,on){b.setAttribute('aria-pressed',String(on));if(b.hasAttribute('data-check')){if(b._l===undefined)b._l=b.textContent;b.textContent=(on?'✓ ':'')+b._l}}
DP.chipValues=function(scope,group){return $$('.chip-b[data-chip="'+group+'"][aria-pressed=true]',scope).map(function(b){return b._l!==undefined?b._l:b.textContent})};
/* validate: .fld[data-req=req|email|tel|url|chip] and .cbx[data-req] */
DP.validate=function(scope){var ok=true,first=null,errs=0;
  $$('.fld[data-req]',scope).forEach(function(f){var t=f.dataset.req,bad=false,inp=$('input.inp,select.inp,textarea.inp',f);
    if(t==='chip')bad=!$('.chip-b[aria-pressed=true]',f);
    else if(inp&&!f.hidden){var v=(inp.value||'').trim();if(!v)bad=true;else if(t==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))bad=true;else if(t==='tel'&&v.replace(/\D/g,'').length<9)bad=true;else if(t==='url'&&v.length<4)bad=true}
    f.classList.toggle('bad',bad);f.classList.toggle('ok',!bad&&!!inp&&t!=='chip');if(bad){ok=false;errs++;if(!first)first=f;DP.nudge(f)}});
  $$('input.inp[data-req],textarea.inp[data-req]',scope).forEach(function(i){var t=i.dataset.req,v=(i.value||'').trim(),bad=!v||(t==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))||(t==='tel'&&v.replace(/\D/g,'').length<9);i.classList.toggle('bad',bad);i.setAttribute('aria-invalid',String(bad));if(bad){ok=false;errs++;if(!first)first=i;DP.nudge(i)}});
  $$('.cbx[data-req]',scope).forEach(function(c){var bad=!$('input',c).checked;c.classList.toggle('bad',bad);if(bad){ok=false;errs++;if(!first)first=c;DP.nudge(c)}});
  var al=$('[data-alert]',scope);if(al){al.hidden=ok;if(!ok)al.textContent=errs+' champ'+(errs>1?'s':'')+' à corriger avant d’envoyer.'}
  if(first){var i=$('input,select,textarea,button',first);if(i&&i.focus)i.focus({preventScroll:true});first.scrollIntoView({block:'center',behavior:DP.reduced()?'auto':'smooth'})}return ok};
document.addEventListener('input',function(e){if(e.target.classList&&e.target.classList.contains('bad')&&e.target.value)e.target.classList.remove('bad');var f=e.target.closest&&e.target.closest('.fld.bad');if(f&&(e.target.value||e.target.checked))f.classList.remove('bad')});
document.addEventListener('change',function(e){var c=e.target.closest&&e.target.closest('.cbx.bad');if(c)c.classList.remove('bad')});
DP.wa=function(num,text){return 'https://wa.me/'+String(num).replace(/\D/g,'')+'?text='+encodeURIComponent(text)};
/* dialogs */
DP.openDlg=function(d){if(d.showModal)d.showModal();else d.setAttribute('open','')};
DP.closeDlg=function(d){if(d.close)d.close();else d.removeAttribute('open')};
document.addEventListener('click',function(e){var c=e.target.closest('[data-close]');if(c){var d=c.closest('dialog');if(d)DP.closeDlg(d)}
  if(e.target.tagName==='DIALOG'&&e.target.classList.contains('sheet')){var r=e.target.getBoundingClientRect();if(e.clientY<r.top||e.clientY>r.bottom||e.clientX<r.left||e.clientX>r.right)DP.closeDlg(e.target)}});
})();
