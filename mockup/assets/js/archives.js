(function(){
var DP=window.DP,$=DP.$,$$=DP.$$,esc=DP.esc,S=function(){return DP.store.get()};
var isD=function(el){return !!el.closest('.v-d')};
function pub(){return S().nights.filter(function(n){return n.published})}
var SUBX={'noa-act-ii':' · w/ DJ Tunez'};
/* ---------- index ---------- */
var sers=$$('[data-hook=series]');
if(sers.length){var cur='All';
  function chip(s){var on=s===cur;return '<button type="button" class="chip-h40" data-series="'+esc(s)+'" aria-pressed="'+on+'" style="'+(on?'border-color:#3CFF4E;background:#3CFF4E;color:#041A07':'color:#F2F5F3;background:transparent')+'">'+esc(s)+'</button>'}
  function draw(){$$('[data-hook=series]').forEach(function(l){l.innerHTML=DP.series.map(chip).join('')});
    var ns=pub().filter(function(n){return cur==='All'||n.series===cur}).sort(function(a,b){return b.date<a.date?-1:1});
    $$('[data-hook=nights]').forEach(function(l){l.innerHTML=ns.map(function(n){return '<a href="archive-night.html?n='+n.slug+'" style="display:flex;flex-direction:column;gap:6px;color:#F2F5F3"><div style="aspect-ratio:4/5;border-radius:4px;border:1px solid #222624;background:'+(DP.cover(n.slug)?'url('+DP.cover(n.slug)+') center/cover':'repeating-linear-gradient(135deg,#121413 0 8px,#171a18 8px 16px)')+';display:flex;align-items:flex-end;padding:6px;font:500 9px \'JetBrains Mono\';color:#8A938E">'+(DP.cover(n.slug)?'':'Cover')+'</div><div style="font:400 17px/1 \'Anton\'">'+esc(n.name)+'</div><div style="font:400 11px/1.4 \'Space Grotesk\';color:#B9C1BC">'+DP.fmt(n.date+'T12:00:00Z',{day:'numeric',month:'short',year:'numeric'})+' · '+esc(n.venue)+'</div><span style="align-self:flex-start;border:1px solid #2c312e;border-radius:999px;padding:3px 8px;font:500 10px \'Space Grotesk\';color:#D5DBD7">'+esc(n.series)+'</span></a>'}).join('')||'<div style="grid-column:1/-1;font:400 14px \'Space Grotesk\';color:#8A938E">Rien ici pour l’instant.</div>'})}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-series]');if(b){cur=b.dataset.series;draw()}});draw()}
/* ---------- night ---------- */
var nm=$('[data-night-m]');
if(nm){var slug=new URLSearchParams(location.search).get('n')||'noa-act-ii',all=S().nights,n=all.filter(function(x){return x.slug===slug})[0];
  if(!n||!n.published){$$('[data-night-m],[data-night-d]').forEach(function(r){r.innerHTML='<div style="padding:60px 16px;display:flex;flex-direction:column;gap:16px;align-items:flex-start"><h1 style="margin:0;font:400 56px/.88 \'Anton\'">SOIRÉE<br>INTROUVABLE</h1><a href="archives.html" style="font:500 14px \'Space Grotesk\'">← Archives</a></div>'});return}
  document.title=n.name+' — Archives — Don Parrty';
  var short=n.name.replace(/^NOA — /,'').toUpperCase(),kick=n.series==='Night of Afrobeats'?'NIGHT OF AFROBEATS':(n.series==='Other'?'DON PARRTY':n.series.toUpperCase());
  var sub=DP.fmt(n.date+'T12:00:00Z',{weekday:'short',day:'numeric',month:'short',year:'numeric'})+' · '+n.venue+(SUBX[n.slug]||'');
  var photos=DP.nightPhotos(n);
  function tileH(p,i,k){var d=k==='D',h=d?p.hd:p.h;return '<button type="button" data-ph="'+i+'" aria-label="Ouvrir la photo '+esc(p.id)+'" style="box-sizing:content-box;display:flex;'+(d?'width:calc(100% - 18px);break-inside:avoid;margin-bottom:8px;':'grid-row:span 1;')+'height:'+h+'px;border-radius:3px;background:'+(p.th?'#121413 url('+p.th+') center/cover':'repeating-linear-gradient(135deg,#121413 0 8px,#171a18 8px 16px)')+';border:1px solid #1e2220;align-items:flex-end;padding:'+(d?8:6)+'px;font:500 '+(d?10:9)+'px \'JetBrains Mono\';color:#8A938E;text-align:left" class="ph-b">'+(p.th?'<span class="sr">'+p.id+'</span>':p.id)+'</button>'}
  $$('[data-night-m],[data-night-d]').forEach(function(root){var d=!!root.hasAttribute('data-night-d');
    $$('[data-n=title]',root).forEach(function(e){e.textContent=short});$$('[data-n=kicker]',root).forEach(function(e){e.textContent=kick});$$('[data-n=sub]',root).forEach(function(e){e.textContent=sub});
    $$('[data-n=cover-label]',root).forEach(function(e){if(photos[0]&&photos[0].src){e.textContent='';e.parentNode.style.background='url('+photos[0].src+') center 22%/cover'}else e.textContent='Cover — crowd, '+n.name.replace(/^NOA — /,'')});
    $$('[data-n=credits]',root).forEach(function(e){e.innerHTML=n.credits.map(function(c){return '<span style="background:#111312;border:1px solid #222624;border-radius:4px;padding:'+(d?'8px 12px':'6px 9px')+';font:500 '+(d?13:12)+'px \'Space Grotesk\'">'+esc(c.handle)+'</span>'}).join('')});
    $$('[data-n=credit-line]',root).forEach(function(e){e.textContent=n.credits.length?"Comment 💚 if you're in this video.":'Crédits à compléter'});
    var pu=pub(),pi=pu.findIndex(function(x){return x.slug===slug}),prev=pu[pi+1],next=pu[pi-1];
    $$('[data-n=nav]',root).forEach(function(e){e.innerHTML=(prev?'<a href="archive-night.html?n='+prev.slug+'">← '+esc(prev.name)+'</a>':'<span></span>')+(next?'<a href="archive-night.html?n='+next.slug+'">'+esc(next.name)+' →</a>':'')});
    $$('[data-hook=wall]',root).forEach(function(w){var lim=(!d&&!w.dataset.all)?10:photos.length;w.innerHTML=photos.slice(0,lim).map(function(p,i){
      return d?tileH(p,i,'D')
      :tileH(p,i,'M')}).join('')+(!d&&photos.length>lim?'<button type="button" data-wall-more style="grid-column:1/-1;background:none;border:0;color:#3CFF4E;font:500 14px \'Space Grotesk\';height:44px;text-align:left;padding:0 12px">Voir toutes les photos ('+photos.length+') →</button>':'')})});
  document.addEventListener('click',function(e){var m=e.target.closest('[data-wall-more]');if(!m)return;var w=m.closest('[data-hook=wall]');w.dataset.all='1';w.innerHTML=photos.map(function(p,i){return tileH(p,i,'M')}).join('')});
  /* lightbox */
  var lb=$('#lb'),cur=0,likes=DP.lsGet('dp_likes',{});
  function base(id){var s=0;for(var k=0;k<id.length;k++)s=(s*31+id.charCodeAt(k))>>>0;return 100+s%60}
  function vis(sel){return $$(sel,lb).filter(function(e){return e.offsetParent!==null||e.closest('.v-m,.v-d')&&getComputedStyle(e.closest('.v-m,.v-d')).display!=='none'})}
  function render(){var p=photos[cur],liked=!!likes[p.id],c=n.credits[0],cr=c?c.handle+(n.credits.length>1?' +'+(n.credits.length-1):''):'Crédit à compléter';
    $$('[data-lb=count]',lb).forEach(function(e){e.textContent=short+' · '+(cur+1)+' / '+photos.length});
    $$('[data-lb=photo]',lb).forEach(function(e){var dd=!!e.closest('.v-d');if(e._bg===undefined)e._bg=e.style.background;
      if(p.src){e.textContent='';e.style.background='#000 url('+p.src+') center/contain no-repeat'}else{e.style.background=e._bg;e.textContent=dd?'Photo '+p.id:'Photo · '+p.id+' (grows from tile)'}});
    $$('[data-lb=credit]',lb).forEach(function(e){e.textContent=cr});
    $$('[data-lb=heart]',lb).forEach(function(e){e.setAttribute('aria-pressed',String(liked))});$$('[data-lb=hn]',lb).forEach(function(e){e.textContent=base(p.id)+(liked?1:0)});
    $$('[data-lb=td]',lb).forEach(function(e){e.dataset.photo=p.id;if(!e.closest('.v-d'))e.textContent="C'est toi ? Demande de retrait (photo "+p.id+")"})}
  function tile(){return $$('[data-ph]').filter(function(b){return +b.dataset.ph===cur&&b.offsetParent!==null})[0]}
  function stage(){return $$('[data-lb=photo]',lb).filter(function(e){return e.offsetParent!==null})[0]}
  function open(i){cur=i;var t=tile(),go=function(){render();DP.openDlg(lb)};
    if(document.startViewTransition&&!DP.reduced()&&t){t.style.viewTransitionName='lbphoto';var vt=document.startViewTransition(function(){t.style.viewTransitionName='';go();var s=stage();if(s)s.style.viewTransitionName='lbphoto'});vt.finished.then(function(){var s=stage();if(s)s.style.viewTransitionName=''},function(){var s=stage();if(s)s.style.viewTransitionName=''})}else go()}
  function close(){var t=tile(),s=stage();if(document.startViewTransition&&!DP.reduced()&&t&&s){s.style.viewTransitionName='lbphoto';var vt=document.startViewTransition(function(){s.style.viewTransitionName='';t.style.viewTransitionName='lbphoto';DP.closeDlg(lb)});vt.finished.then(function(){t.style.viewTransitionName=''},function(){t.style.viewTransitionName=''})}else DP.closeDlg(lb)}
  function step(d){cur=(cur+d+photos.length)%photos.length;render()}
  document.addEventListener('click',function(e){var b=e.target.closest('[data-ph]');if(b){open(+b.dataset.ph);return}
    var a=e.target.closest('[data-lb]');if(!a||!lb.contains(a))return;var k=a.dataset.lb;
    if(k==='close')close();else if(k==='prev')step(-1);else if(k==='next')step(1);
    else if(k==='heart'){var p=photos[cur];likes[p.id]=!likes[p.id];DP.lsSet('dp_likes',likes);render();var h=a;h.style.transform='scale(1.2)';setTimeout(function(){h.style.transform=''},160)}});
  lb.addEventListener('keydown',function(e){if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
  lb.addEventListener('cancel',function(e){e.preventDefault();close()});
  var sx=0,sy=0,down=false;
  lb.addEventListener('pointerdown',function(e){if(e.target.closest('button,a'))return;down=true;sx=e.clientX;sy=e.clientY});
  lb.addEventListener('pointerup',function(e){if(!down)return;down=false;var dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))step(dx<0?1:-1);else if(dy>120)close()});
  lb.addEventListener('pointercancel',function(){down=false});
}
})();
