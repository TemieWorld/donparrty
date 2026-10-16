/* Admin inboxes: table requests (A3/A4/AD) and applications (A5). */
(function(){
var DP=window.DP,A=DP.A,$=DP.$,$$=DP.$$,esc=DP.esc,page=document.body.dataset.page;
if(!A)return;
var mq=window.matchMedia('(min-width:1100px)');
var scrim=$('#scrim'),sheet=$('#detail-m');
function sheetOpen(o){sheet.classList.toggle('open',o);scrim.classList.toggle('on',o);document.body.style.overflow=o?'hidden':''}
scrim&&scrim.addEventListener('click',function(){sheetOpen(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')sheetOpen(false)});
var HANDLE='<div style="align-self:center;width:40px;height:4px;border-radius:2px;background:#2c312e;flex:none"></div>';
function maskWa(w){var p=String(w||'').split(' ');if(p.length>=6){p[3]='••';p[4]='••'}return p.join(' ')}
function pillOf(L,st,big){return A.pill(st,L,big)}
function seg(items,cur,cls){return '<div class="seg3 '+(cls||'')+'" role="group">'+items.map(function(x){return '<button type="button" data-st="'+x[0]+'" aria-pressed="'+(cur===x[0])+'">'+x[1]+'</button>'}).join('')+'</div>'}

/* ================= table requests ================= */
if(page==='requests'){
var L={new:'Nouvelle',ok:'Confirmée',no:'Refusée'};
var filter='all',selId=null,undoT=null;
var S=A.S;
function reqs(){return S().requests}
function cnt(k){return reqs().filter(function(r){return k==='all'||r.status===k}).length}
function visible(){return reqs().filter(function(r){return filter==='all'||r.status===filter})}
function cur(){var v=visible();return reqs().filter(function(r){return r.id===selId})[0]||v[0]||reqs()[0]}
var FILT=[['all','Toutes'],['new','Nouvelle'],['ok','Confirmée'],['no','Refusée']];
function rowHtml(r,big){var on=r.id===(cur()||{}).id;
  return '<button type="button" class="irow" data-id="'+r.id+'" style="text-align:left;background:'+(on?'#181B19':'#111312')+';border:1px solid '+(on?'#3a403c':'#222624')+'"><div style="display:flex;align-items:center;justify-content:space-between;width:100%"><span style="font:600 '+(big?15:16)+'px \'Space Grotesk\'">'+esc(r.name)+'</span>'+pillOf(L,r.status)+'</div><span style="font:400 13px \'Space Grotesk\';color:#B9C1BC">Act III · '+esc(r.size)+' pers. · '+esc(r.arrival)+' · '+esc(r.ago)+'</span></button>'}
function fields(r){var f=[['Soirée','Act III · sam. 24 oct.'],['Groupe',r.size+' pers.'],['Arrivée',r.arrival],['Occasion',r.occasion],['WhatsApp',maskWa(r.wa)],['Email',r.email?r.email.split('@')[0]+'@…':'—'],['Message',r.msg||'—']];return f}
function grid(r,w,gap,fs){return '<div style="display:grid;grid-template-columns:'+w+'px 1fr;gap:'+gap+';font:400 '+fs+'px \'Space Grotesk\'">'+fields(r).map(function(x){return '<span style="color:#8A938E">'+x[0]+'</span><span>'+esc(x[1])+'</span>'}).join('')+'</div>'}
function waText(r){return 'Salut '+r.name+', c’est Don Parrty 💚 pour ta table Act III (sam. 24 oct., Pantin) : on te confirme dès que possible. À très vite !'}
function actions(r,d){var wa=DP.wa(r.wa,waText(r));
  return '<div style="display:flex;'+(d?'gap:8px':'flex-direction:column;gap:8px')+'"><a data-act="wa" href="'+esc(wa)+'" target="_blank" rel="noopener" style="'+(d?'height:52px;padding:0 24px':'height:52px')+';background:#3CFF4E;color:#041A07;border-radius:6px;font:600 15px \'Space Grotesk\';display:flex;align-items:center;justify-content:center">Répondre sur WhatsApp</a><a data-act="mail" href="'+(r.email?'mailto:'+esc(r.email)+'?subject='+encodeURIComponent('Ta table — Don Parrty Act III')+'&body='+encodeURIComponent('Salut '+r.name+',\n\nMerci pour ta demande de table pour Act III (sam. 24 oct.). ')+'':'#')+'" style="'+(d?'height:52px;padding:0 20px':'height:48px')+';border:1px solid #2c312e;color:#F2F5F3;border-radius:6px;font:500 14px \'Space Grotesk\';display:flex;align-items:center;justify-content:center">Répondre par email</a></div>'}
function tl(r,fs){var items=(r.log&&r.log.length?r.log:['—']).concat(['Reçue · '+r.ago]);return '<div style="display:flex;flex-direction:column;gap:6px;border-left:1px solid #2c312e;padding-left:12px;font:400 '+fs+'px \'Space Grotesk\';color:#B9C1BC">'+items.map(function(t){return '<span>'+esc(t)+'</span>'}).join('')+'</div>'}
function detail(r,d){if(!r)return '';
  var head=d?'<div style="display:flex;justify-content:space-between;align-items:center"><span style="font:700 28px \'Space Grotesk\'">'+esc(r.name)+'</span>'+pillOf(L,r.status,true)+'</div>':HANDLE+'<div style="display:flex;justify-content:space-between;align-items:center"><span style="font:700 22px \'Space Grotesk\'">'+esc(r.name)+'</span>'+pillOf(L,r.status)+'</div>';
  var note=d?'<textarea data-note placeholder="Note interne" rows="3" style="background:#111312;border:1px solid #2c312e;border-radius:6px;padding:12px;color:#F2F5F3;font:400 14px \'Space Grotesk\';resize:none">'+esc(r.note||'')+'</textarea>':'<input data-note placeholder="Note interne (visible par l\'équipe)" value="'+esc(r.note||'')+'" style="height:44px;background:#050505;border:1px solid #2c312e;border-radius:6px;padding:0 12px;color:#F2F5F3;font:400 14px \'Space Grotesk\'">';
  return head+(d?grid(r,120,'10px 16px',15):grid(r,100,'8px 12px',14))+actions(r,d)+seg(FILT.slice(1),r.status,'')+note+tl(r,d?13:12)}
function render(){
  var v=visible(),r=cur();
  var pills=FILT.map(function(f){var on=filter===f[0];return '<button type="button" data-f="'+f[0]+'" style="height:40px;padding:0 12px;border-radius:999px;border:1px solid '+(on?'#F2F5F3':'#2c312e')+';background:'+(on?'#F2F5F3':'transparent')+';color:'+(on?'#050505':'#F2F5F3')+';font:500 13px \'Space Grotesk\'">'+f[1]+' <span style="opacity:.7">'+cnt(f[0])+'</span></button>'}).join('');
  $('[data-rq=pills]').innerHTML=pills;
  $('[data-rq=side]').innerHTML=FILT.map(function(f){var on=filter===f[0];return '<button type="button" data-f="'+f[0]+'" style="height:44px;border:0;border-radius:6px;padding:0 12px;display:flex;align-items:center;justify-content:space-between;background:'+(on?'#181B19':'transparent')+';color:#F2F5F3;font:500 14px \'Space Grotesk\'">'+f[1]+'<span style="color:#8A938E">'+cnt(f[0])+'</span></button>'}).join('');
  var empty='<div style="padding:40px 0;text-align:center;font:400 14px \'Space Grotesk\';color:#8A938E">Rien ici pour l\'instant.</div>';
  $('[data-rq=list-m]').innerHTML=v.map(function(x){return rowHtml(x)}).join('')||empty;
  $('[data-rq=list-d]').innerHTML=v.map(function(x){return rowHtml(x,1)}).join('')||empty;
  $('[data-rq=detail-d]').innerHTML=detail(r,true);
  if(sheet.classList.contains('open'))sheet.innerHTML=detail(r,false)}
function setStatus(id,st,noUndo){var r=reqs().filter(function(x){return x.id===id})[0];if(!r||r.status===st)return;var prev=r.status;
  r.status=st;(r.log=r.log||[]).unshift(L[st]+' par Temi · à l’instant');DP.store.save();
  var gone=filter!=='all'&&st!==filter;
  function done(){render();if(gone&&!mq.matches)sheetOpen(false)}
  if(gone){$$('.irow[data-id="'+id+'"]').forEach(function(e){e.classList.add('leave')});setTimeout(done,200)}else done();
  A.toast(r.name+' → '+L[st],[{l:'Annuler',fn:function(){r.status=prev;r.log.shift();DP.store.save();render()}}],5000)}
function ask(r){if(r.status==='ok')return;A.toast('Marquer comme confirmée ?',[{l:'Oui',pri:true,fn:function(){setStatus(r.id,'ok')}},{l:'Annuler'}],8000)}
document.addEventListener('click',function(e){var t=e.target;
  var f=t.closest('[data-f]');if(f){filter=f.dataset.f;render();return}
  var row=t.closest('.irow');if(row){selId=+row.dataset.id;render();if(!mq.matches){sheet.innerHTML=detail(cur(),false);sheetOpen(true)}return}
  var st=t.closest('[data-st]');if(st){var r=cur();setStatus(r.id,st.dataset.st);return}
  var a=t.closest('[data-act]');if(a){var r2=cur();if(a.dataset.act==='mail'&&!r2.email){e.preventDefault();A.toast('Pas d’email pour cette demande');return}if(a.dataset.act==='wa')ask(r2);else ask(r2)}});
document.addEventListener('change',function(e){var n=e.target.closest('[data-note]');if(n){cur().note=n.value;DP.store.save()}});
mq.addEventListener&&mq.addEventListener('change',function(){sheetOpen(false);render()});
render()}

/* ================= applications ================= */
if(page==='applications'){
var TABS=[['dj','DJ & artist'],['creator','Creator'],['sponsor','Sponsor'],['retrait','Retrait']];
var AL={new:'Nouvelle',short:'Shortlist',booked:'Bookée',notnow:'Pas maintenant',removed:'Retirée',kept:'Gardée'};
var tab=new URLSearchParams(location.search).get('t')||'dj';
function apps(t){return A.S().apps.filter(function(a){return a.type===t})}
function ncount(t){return apps(t).filter(function(a){return a.status==='new'}).length}
var NSEG=[['new','Nouvelle'],['short','Shortlist'],['booked','Bookée'],['notnow','Pas maintenant']],RSEG=[['new','Nouvelle'],['removed','Retirée'],['kept','Gardée']];
function nightOf(pid){var pre=String(pid).split('-')[0];return A.S().nights.filter(function(n){return n.pre===pre})[0]}
function retrait(a){return '<div data-app="'+a.id+'" style="display:flex;flex-direction:column;gap:14px"><div style="display:flex;justify-content:space-between;align-items:center"><span style="font:700 20px \'Space Grotesk\'">'+esc(a.name)+'</span>'+A.pill(a.status,AL)+'</div>'
  +'<div style="display:grid;grid-template-columns:120px 1fr;gap:12px"><div style="aspect-ratio:4/5;border-radius:4px;background:repeating-linear-gradient(135deg,#121413 0 8px,#171a18 8px 16px);border:1px solid #222624;display:flex;align-items:flex-end;padding:6px;font:500 9px \'JetBrains Mono\';color:#8A938E;box-sizing:border-box">'+esc(a.photo||'')+'</div><div style="display:flex;flex-direction:column;gap:6px;font:400 13px/1.45 \'Space Grotesk\'">'+a.fields.map(function(f){return '<span style="color:#8A938E">'+esc(f[0])+'</span><span>'+esc(f[1])+'</span>'}).join('')+'</div></div>'
  +(a.msg?'<div style="background:#111312;border:1px solid #222624;border-radius:6px;padding:12px;font:400 13px/1.5 \'Space Grotesk\';color:#D5DBD7">"'+esc(a.msg)+'"</div>':'')
  +'<button type="button" data-hide="'+a.id+'" class="press" '+(a.status==='removed'?'disabled':'')+' style="height:56px;background:#3CFF4E;color:#041A07;border:0;border-radius:6px;font:600 16px \'Space Grotesk\'">'+(a.status==='removed'?'Photo masquée':'Masquer la photo')+'</button>'
  +'<div style="font:400 12px/1.5 \'Space Grotesk\';color:#B9C1BC">Masquée tout de suite sur le site. Statut → Retirée. Annulable 5 s.</div>'+seg(RSEG,a.status)+'</div>'}
function arow(a){return '<button type="button" class="irow" data-open="'+a.id+'" style="text-align:left;background:#111312;border:1px solid #222624"><div style="display:flex;align-items:center;justify-content:space-between;width:100%"><span style="font:600 16px \'Space Grotesk\'">'+esc(a.name)+'</span>'+A.pill(a.status,AL)+'</div><span style="font:400 13px \'Space Grotesk\';color:#B9C1BC">'+esc(a.contact)+' · '+esc(a.ago)+'</span></button>'}
function asheet(a){return HANDLE+'<div style="display:flex;justify-content:space-between;align-items:center"><span style="font:700 22px \'Space Grotesk\'">'+esc(a.name)+'</span>'+A.pill(a.status,AL)+'</div><div style="display:grid;grid-template-columns:100px 1fr;gap:8px 12px;font:400 14px \'Space Grotesk\'">'+[['Contact',a.contact]].concat(a.fields).concat([['Reçu',a.ago]]).map(function(f){return '<span style="color:#8A938E">'+esc(f[0])+'</span><span>'+esc(f[1])+'</span>'}).join('')+'</div>'+seg(NSEG,a.status,'s4')+'<div style="font:400 11px/1.6 \'Space Grotesk\';color:#8A938E">Nouvelle → Shortlist → Bookée / Pas maintenant.</div>'}
var openId=null;
function render(){
  $('[data-ap=tabs]').innerHTML=TABS.map(function(t){var n=ncount(t[0]),on=tab===t[0];return '<button type="button" role="tab" data-tab="'+t[0]+'" aria-selected="'+on+'" style="height:44px;padding:0 8px;display:flex;align-items:center;white-space:nowrap;box-sizing:content-box;background:none;border:0;font:'+(on?600:500)+' 13px \'Space Grotesk\';color:'+(on?'#F2F5F3':'#B9C1BC')+';border-bottom:2px solid '+(on?'#3CFF4E':'transparent')+'">'+t[1]+(on&&n?' · '+n:'')+'</button>'}).join('');
  var list=apps(tab),body=$('[data-ap=body]');
  body.innerHTML=list.length?(tab==='retrait'?list.map(retrait).join('')+'<div style="font:400 11px/1.6 \'Space Grotesk\';color:#8A938E">Autres onglets : Nouvelle → Shortlist → Bookée / Pas maintenant.</div>':list.map(arow).join('')):'<div style="padding:40px 0;text-align:center;font:400 14px \'Space Grotesk\';color:#8A938E">Rien ici pour l\'instant.</div>';
  if(openId&&sheet.classList.contains('open')){var a=apps(tab).filter(function(x){return x.id===openId})[0];if(a)sheet.innerHTML=asheet(a)}}
function setSt(id,st){var a=A.S().apps.filter(function(x){return x.id===id})[0];if(!a||a.status===st)return;var prev=a.status;a.status=st;DP.store.save();render();A.toast(a.name+' → '+AL[st],[{l:'Annuler',fn:function(){a.status=prev;DP.store.save();render()}}],5000)}
function hide(id){var a=A.S().apps.filter(function(x){return x.id===id})[0];if(!a)return;var n=nightOf(a.photo),prev=a.status,was=n&&n.hiddenPhotos&&n.hiddenPhotos[a.photo];
  if(n){n.hiddenPhotos=n.hiddenPhotos||{};n.hiddenPhotos[a.photo]=true}a.status='removed';DP.store.save();render();
  A.toast('Photo '+a.photo+' masquée',[{l:'Annuler',fn:function(){if(n&&!was)delete n.hiddenPhotos[a.photo];a.status=prev;DP.store.save();render()}}],5000)}
document.addEventListener('click',function(e){var t=e.target;
  var tb=t.closest('[data-tab]');if(tb){tab=tb.dataset.tab;render();return}
  var h=t.closest('[data-hide]');if(h){hide(+h.dataset.hide);return}
  var o=t.closest('[data-open]');if(o){openId=+o.dataset.open;var a=apps(tab).filter(function(x){return x.id===openId})[0];sheet.innerHTML=asheet(a);sheetOpen(true);return}
  var s=t.closest('[data-st]');if(s){var host=s.closest('[data-app]');var id=host?+host.dataset.app:openId;setSt(id,s.dataset.st)}});
render()}
})();
