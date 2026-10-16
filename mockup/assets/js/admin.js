/* Admin shared: guard (FAKE auth, any login works), helpers, admin toast. */
(function(){
var DP=window.DP,$=DP.$,$$=DP.$$,esc=DP.esc;
var page=document.body.dataset.page;
var authed=false;try{authed=sessionStorage.getItem('dp_admin')==='1'}catch(e){}
if(page!=='login'&&!authed){location.replace('index.html');return}
var A=DP.A={};
A.S=function(){return DP.store.get()};
A.PILL={new:['#3CFF4E','transparent','#3CFF4E'],ok:['#3CFF4E','#3CFF4E','#041A07'],no:['#2c312e','#2c312e','#D5DBD7'],short:['#FFC53D','transparent','#FFC53D'],booked:['#3CFF4E','#3CFF4E','#041A07'],notnow:['#2c312e','#2c312e','#D5DBD7'],removed:['#3CFF4E','#3CFF4E','#041A07'],kept:['#2c312e','#2c312e','#D5DBD7']};
A.pill=function(st,L,big){var c=A.PILL[st]||A.PILL.no;return '<span class="pillx" style="font:600 '+(big?12:11)+'px \'Space Grotesk\';padding:'+(big?'5px 11px':'4px 9px')+';border-radius:999px;border:1px solid '+c[0]+';background:'+c[1]+';color:'+c[2]+'">'+esc(L[st]||st)+'</span>'};
A.sw=function(on,attrs){return '<button type="button" class="sw" role="switch" aria-checked="'+!!on+'" '+(attrs||'')+' style="flex:none;width:52px;height:32px;border-radius:999px;border:1px solid '+(on?'#3CFF4E':'#8A938E')+';background:'+(on?'#3CFF4E':'transparent')+';position:relative"><span style="position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:'+(on?'#041A07':'#8A938E')+';transform:'+(on?'translateX(20px)':'none')+'"></span></button>'};
A.counts=function(){var s=A.S();return{req:s.requests.filter(function(r){return r.status==='new'}).length,app:s.apps.filter(function(a){return a.status==='new'&&a.type!=='retrait'}).length,ret:s.apps.filter(function(a){return a.status==='new'&&a.type==='retrait'}).length}};
$$('[data-signout]').forEach(function(b){b.addEventListener('click',A.signout=function(){try{sessionStorage.removeItem('dp_admin')}catch(e){}location.href='index.html'})});
/* admin toast: light card + outlined buttons. buttons: [{l,fn,pri}] */
A.toast=function(msg,btns,ms){var box=$('#toasts');var t=document.createElement('div');t.className='toast adm';t.innerHTML='<span class="m"></span>';$('.m',t).textContent=msg;var timer;
  function close(){clearTimeout(timer);t.classList.add('out');setTimeout(function(){t.remove()},220)}
  (btns||[]).forEach(function(b){var e=document.createElement('button');e.type='button';e.textContent=b.l;if(b.pri)e.className='pri';e.onclick=function(){b.fn&&b.fn();close()};t.appendChild(e)});
  if(!btns||!btns.length){var x=document.createElement('button');x.type='button';x.textContent='OK';x.onclick=close;t.appendChild(x)}
  function arm(){timer=setTimeout(close,ms||5000)}arm();t.addEventListener('mouseenter',function(){clearTimeout(timer)});t.addEventListener('mouseleave',arm);t.addEventListener('focusin',function(){clearTimeout(timer)});t.addEventListener('focusout',arm);
  box.appendChild(t);return close};
/* Paris-time conversions for datetime-local inputs (store ISO UTC) */
A.parisOffsetMin=function(utcMs){var f=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Paris',hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}).formatToParts(new Date(utcMs)),g={};f.forEach(function(p){g[p.type]=+p.value});
  var asUtc=Date.UTC(g.year,g.month-1,g.day,g.hour,g.minute,g.second);return Math.round((asUtc-Math.floor(utcMs/1000)*1000)/60000)};
A.toInput=function(iso){if(!iso)return '';var ms=Date.parse(iso),off=A.parisOffsetMin(ms);return new Date(ms+off*60000).toISOString().slice(0,16)};
A.fromInput=function(v){if(!v)return '';var p=v.split(/[-T:]/).map(Number);var guess=Date.UTC(p[0],p[1]-1,p[2],p[3],p[4]);var off=A.parisOffsetMin(guess);var off2=A.parisOffsetMin(guess-off*60000);return new Date(guess-off2*60000).toISOString()};
A.dtFr=function(iso){return iso?DP.fmt(iso,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).replace(',',''):'—'};
A.parseDt=function(v){var M={janv:1,jan:1,'févr':2,fev:2,fevr:2,mars:3,avr:4,mai:5,juin:6,juil:7,'août':8,aout:8,sept:9,oct:10,nov:11,'déc':12,dec:12},m,d,mo,h,mi,y,now=new Date();
  v=v.toLowerCase().replace(/\./g,'').replace(/\s+/g,' ');
  if(m=v.match(/^(\d{1,2}) ([a-zéûô]+) (?:(\d{4}) )?(?:à )?(\d{1,2})[:h](\d{2})$/)){d=+m[1];mo=M[m[2]];y=m[3]?+m[3]:null;h=+m[4];mi=+m[5]}
  else if(m=v.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))? (\d{1,2})[:h](\d{2})$/)){d=+m[1];mo=+m[2];y=m[3]?+m[3]:null;h=+m[4];mi=+m[5]}
  else if(m=v.match(/^(\d{4})-(\d{2})-(\d{2})[ t](\d{1,2}):(\d{2})$/)){y=+m[1];mo=+m[2];d=+m[3];h=+m[4];mi=+m[5]}
  else return '';
  if(!mo||d<1||d>31||h>23||mi>59)return '';if(!y)y=now.getUTCFullYear();
  var pad=function(n){return(n<10?'0':'')+n};return A.fromInput(y+'-'+pad(mo)+'-'+pad(d)+'T'+pad(h)+':'+pad(mi))};
A.jd=function(){return DP.daysTo(DP.event.start)};
A.cdLabel=function(){var j=A.jd();return j>0?'J-'+j:j===0?'CE SOIR':''};
A.bannerStatus=function(b){var now=Date.now();if(!b.on)return{t:'Désactivé',c:'#8A938E'};
  if(b.start&&now<Date.parse(b.start))return{t:'Programmé · démarre le '+A.dtFr(b.start),c:'#FFC53D'};
  if(b.end&&now>=Date.parse(b.end))return{t:'Terminé · masqué depuis le '+A.dtFr(b.end),c:'#8A938E'};
  if(b.end){var d=Math.ceil((Date.parse(b.end)-now)/864e5);return{t:'En ligne · se masque dans '+d+' jour'+(d>1?'s':''),c:'#3CFF4E'}}
  return{t:'En ligne · sans date de fin',c:'#3CFF4E'}};
A.reset=function(){DP.store.reset();try{sessionStorage.removeItem('dp_admin')}catch(e){}A.toast('Démo réinitialisée',null,2000);setTimeout(function(){location.href='index.html'},700)};
})();
