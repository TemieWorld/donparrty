/* Admin content: archives list + night editor (A7), banner (A8), partners (A9). */
(function(){
var DP=window.DP,A=DP.A,$=DP.$,$$=DP.$$,esc=DP.esc,page=document.body.dataset.page;
if(!A)return;
var S=A.S;
/* ---------- archives ---------- */
if(page==='archives'){
  var nights=function(){return S().nights};
  function list(){$('[data-a-list]').innerHTML=nights().map(function(n,i){
    return '<div class="arow" data-i="'+i+'" style="min-height:64px;border-bottom:1px solid #222624;display:flex;align-items:center;gap:12px"><div style="width:44px;height:44px;flex:none;border-radius:4px;background:repeating-linear-gradient(135deg,#121413 0 6px,#171a18 6px 12px)"></div><button type="button" data-edit="'+i+'" style="flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;text-align:left;background:none;border:0;color:#F2F5F3;min-height:44px;padding:0;justify-content:center"><span style="font:600 14px \'Space Grotesk\'">'+esc(n.name)+'</span><span style="font:400 12px \'Space Grotesk\';color:#B9C1BC">'+esc(DP.fmt(n.date+'T12:00:00Z',{day:'numeric',month:'short',year:'numeric'}))+' · '+(n.published?'Publiée':'Brouillon')+'</span></button>'+A.sw(n.published,'data-pub="'+i+'" aria-label="Publier '+esc(n.name)+'"')+'</div>'}).join('')}
  var ed=$('[data-a-editor]'),e=function(k){return $('[data-e='+k+']',ed)},cur=null,credits=[];
  var ROLES=[['video','Vidéo'],['photo','Photo'],['design','Design'],['host','Host'],['dj','DJ'],['drums','Drums']];
  function crHtml(){e('credits').innerHTML=credits.map(function(c,i){return '<div style="display:flex;gap:6px"><span style="position:relative;width:110px;flex:none"><select class="ain" data-cr="r" data-ci="'+i+'" style="appearance:none;-webkit-appearance:none;width:100%;box-sizing:border-box;padding:0 8px;font-size:13px">'+ROLES.map(function(r){return '<option value="'+r[0]+'"'+(r[0]===c.role?' selected':'')+'>'+r[1]+'</option>'}).join('')+'</select><span aria-hidden="true" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);color:#8A938E;pointer-events:none">▾</span></span><input class="ain" data-cr="h" data-ci="'+i+'" value="'+esc(c.handle)+'" aria-label="Crédit" style="flex:1;min-width:0"><button type="button" data-cx="'+i+'" aria-label="Supprimer le crédit" style="width:44px;height:44px;display:flex;align-items:center;justify-content:center;color:#B9C1BC;background:none;border:0">✕</button></div>'}).join('')}
  function phHtml(){var ps=DP.nightPhotos(cur,true);e('pcount').textContent='Photos · '+ps.length;
    e('photos').innerHTML=ps.map(function(p){var h=cur.hiddenPhotos&&cur.hiddenPhotos[p.id];return '<div class="ph" draggable="true" data-pid="'+p.id+'" style="position:relative;aspect-ratio:1/1;border-radius:4px;background:repeating-linear-gradient(135deg,#121413 0 6px,#171a18 6px 12px);border:1px solid #222624;opacity:'+(h?.45:1)+';cursor:grab"><span style="position:absolute;left:4px;top:4px;font:500 9px \'JetBrains Mono\';color:#8A938E">'+p.id+'</span><button type="button" data-hide="'+p.id+'" aria-pressed="'+!!h+'" style="position:absolute;left:4px;right:4px;bottom:4px;height:24px;border:0;border-radius:3px;background:rgba(5,5,5,.85);font:500 10px \'Space Grotesk\';color:'+(h?'#FFC53D':'#D5DBD7')+'">'+(h?'Masquée':'Masquer')+'</button></div>'}).join('')}
  function openEd(i){var n=i==='new'?null:nights()[i];
    if(i==='new'){var id=DP.store.id();n={slug:'nouvelle-soiree-'+id,pre:'NEW',name:'Nouvelle soirée',date:DP.parisYMD(new Date()),venue:'Paris',series:'Other',credits:[],published:false,photoCount:12,hiddenPhotos:{},fresh:true};nights().unshift(n);DP.store.save();list();i=0}
    cur=n;credits=n.credits.map(function(c){return{role:c.role,handle:c.handle}});
    e('title').textContent=n.name;e('date').value=n.date;e('venue').value=n.venue;e('name').value=n.name;e('name').closest('label').hidden=!n.fresh;
    e('series').innerHTML=DP.series.filter(function(s){return s!=='All'}).map(function(s){return '<option'+(s===n.series?' selected':'')+'>'+esc(s)+'</option>'}).join('');
    e('prev').href='archive-night.html?n='+encodeURIComponent(n.slug);crHtml();phHtml();ed.classList.add('open');document.body.style.overflow='hidden';ed.scrollTop=0}
  function closeEd(){ed.classList.remove('open');document.body.style.overflow='';list()}
  document.addEventListener('click',function(ev){var t=ev.target,b;
    if(b=t.closest('[data-edit]')){openEd(+b.dataset.edit);return}
    if(b=t.closest('[data-pub]')){var n=nights()[+b.dataset.pub];n.published=!n.published;DP.store.save();list();A.toast(n.name+(n.published?' publiée':' repassée en brouillon'));return}
    if(t.closest('[data-a-new]')){openEd('new');return}
    if(t.closest('[data-e=back]')){closeEd();return}
    if(b=t.closest('[data-cx]')){credits.splice(+b.dataset.cx,1);crHtml();return}
    if(t.closest('[data-e=addc]')){ev.preventDefault();credits.push({role:'photo',handle:'@'});crHtml();var ins=$$('[data-cr=h]',ed);ins[ins.length-1].focus();return}
    if(b=t.closest('[data-hide]')){cur.hiddenPhotos=cur.hiddenPhotos||{};var id=b.dataset.hide;if(cur.hiddenPhotos[id])delete cur.hiddenPhotos[id];else cur.hiddenPhotos[id]=true;DP.store.save();phHtml();return}
    if(t.closest('[data-e=save]')){var nm=e('name').value.trim();if(cur.fresh&&!nm){e('name').focus();A.toast('Donne un nom à la soirée');return}
      if(cur.fresh){cur.name=nm;cur.fresh=false}cur.date=e('date').value||cur.date;cur.venue=e('venue').value.trim()||cur.venue;cur.series=e('series').value;
      cur.credits=credits.filter(function(c){return c.handle.replace('@','').trim()}).map(function(c){return{role:c.role,handle:c.handle.charAt(0)==='@'?c.handle:'@'+c.handle}});DP.store.save();closeEd();A.toast('Soirée enregistrée')}});
  ed.addEventListener('input',function(ev){var t=ev.target;if(t.dataset.cr==='h')credits[+t.dataset.ci].handle=t.value});
  ed.addEventListener('change',function(ev){var t=ev.target;if(t.dataset.cr==='r')credits[+t.dataset.ci].role=t.value});
  /* drag to reorder photos */
  var drag=null;
  ed.addEventListener('dragstart',function(ev){var p=ev.target.closest('.ph');if(!p)return;drag=p.dataset.pid;p.classList.add('drag-o');try{ev.dataTransfer.effectAllowed='move';ev.dataTransfer.setData('text/plain',drag)}catch(x){}});
  ed.addEventListener('dragover',function(ev){if(drag&&ev.target.closest('.ph'))ev.preventDefault()});
  ed.addEventListener('dragend',function(){drag=null;$$('.drag-o',ed).forEach(function(x){x.classList.remove('drag-o')})});
  ed.addEventListener('drop',function(ev){var p=ev.target.closest('.ph');if(!p||!drag)return;ev.preventDefault();var ids=DP.nightPhotos(cur,true).map(function(x){return x.id}),from=ids.indexOf(drag),to=ids.indexOf(p.dataset.pid);
    if(from<0||to<0||from===to)return;ids.splice(to,0,ids.splice(from,1)[0]);cur.order=ids;DP.store.save();drag=null;phHtml()});
  document.addEventListener('keydown',function(ev){if(ev.key==='Escape'&&ed.classList.contains('open'))closeEd()});
  list()}
/* ---------- banner ---------- */
if(page==='banner'){
  var bn=function(k){return $('[data-bn='+k+']')};
  var STY=[['dark','Dark','#050505','#3CFF4E'],['green','Green','#3CFF4E','#041A07'],['white','White','#F2F5F3','#050505'],['warning','Warning','#FFC53D','#1a1200']];
  var saved=DP.clone(S().banner),draft=DP.clone(saved);
  function dirty(){return JSON.stringify(draft)!==JSON.stringify(saved)}
  function paint(){var st=STY.filter(function(x){return x[0]===draft.style})[0]||STY[0],bs=A.bannerStatus(draft);
    bn('dot').style.background=bs.c;bn('status').textContent=bs.t;
    var pv=bn('prev');pv.style.cssText='height:26px;background:'+st[2]+';color:'+st[3]+';display:flex;align-items:center;gap:5px;padding:0 8px;font:700 8px \'Space Grotesk\';letter-spacing:.06em;white-space:nowrap;overflow:hidden;opacity:'+(draft.on?1:.25)+(st[0]==='dark'?';border-bottom:1px solid #222624':'');
    pv.innerHTML='<span style="width:5px;height:5px;border-radius:50%;background:'+st[3]+'"></span>'+esc(draft.text);
    bn('count').textContent=draft.text.length+'/60';bn('count').style.color=draft.text.length>54?'#FFC53D':'#8A938E';
    bn('toggle').innerHTML=A.sw(draft.on,'aria-label="Afficher le bandeau"');
    $$('button',bn('styles')).forEach(function(b){b.setAttribute('aria-pressed',b.dataset.s===draft.style)});
    bn('bar').classList.toggle('on',dirty())}
  bn('styles').innerHTML=STY.map(function(s){return '<button type="button" data-s="'+s[0]+'" aria-pressed="false" style="height:38px;border:0;border-radius:4px;background:transparent;color:#B9C1BC;font:500 13px \'Space Grotesk\'">'+s[1]+'</button>'}).join('');
  var css=document.createElement('style');css.textContent='[data-bn=styles] button[aria-pressed=true]{background:#F2F5F3!important;color:#050505!important}';document.head.appendChild(css);
  function load(){bn('text').value=draft.text;bn('start').value=draft.start?A.dtFr(draft.start):'';bn('end').value=draft.end?A.dtFr(draft.end):'';
    var sel=bn('link');if(!$$('option',sel).some(function(o){return o.value===draft.link})){var o=document.createElement('option');o.value=draft.link;o.textContent=draft.link;sel.appendChild(o)}sel.value=draft.link;paint()}
  bn('text').addEventListener('input',function(){draft.text=this.value.slice(0,60);paint()});
  bn('link').addEventListener('change',function(){draft.link=this.value;paint()});
  ['start','end'].forEach(function(k){bn(k).addEventListener('change',function(){var v=this.value.trim();if(!v){draft[k]='';paint();return}var iso=A.parseDt(v);if(!iso){this.value=draft[k]?A.dtFr(draft[k]):'';A.toast('Format attendu : 25 oct. 05:45');return}draft[k]=iso;this.value=A.dtFr(iso);paint()})});
  bn('styles').addEventListener('click',function(ev){var b=ev.target.closest('[data-s]');if(!b)return;draft.style=b.dataset.s;paint()});
  bn('toggle').addEventListener('click',function(ev){if(!ev.target.closest('.sw'))return;draft.on=!draft.on;paint()});
  bn('cancel').addEventListener('click',function(){draft=DP.clone(saved);load()});
  bn('save').addEventListener('click',function(){if(!draft.text.trim()){bn('text').focus();A.toast('Ajoute un texte pour le bandeau');return}
    if(draft.start&&draft.end&&Date.parse(draft.end)<=Date.parse(draft.start)){A.toast('La fin doit être après le début');return}
    Object.assign(S().banner,draft);DP.store.save();saved=DP.clone(draft);paint();A.toast('Bandeau enregistré')});
  window.addEventListener('beforeunload',function(ev){if(dirty()){ev.preventDefault();ev.returnValue=''}});
  load()}
/* ---------- partners ---------- */
if(page==='partners'){
  var pl=function(){return S().partners},sel=0,pd=null;
  var short=function(n){return n.replace('Hôtel ','H. ')};
  function render(){var ps=pl();if(sel>=ps.length)sel=Math.max(0,ps.length-1);var p=ps[sel];
    $('[data-p-list]').innerHTML=ps.map(function(x,i){return '<div class="prow" draggable="true" data-i="'+i+'" style="min-height:56px;border-bottom:1px solid #222624;display:flex;align-items:center;gap:10px'+(i===sel?';background:#111312':'')+'"><span aria-hidden="true" style="width:28px;color:#8A938E;font-size:16px;text-align:center;cursor:grab">⋮⋮</span><button type="button" data-sel="'+i+'" style="flex:1;display:flex;flex-direction:column;gap:2px;text-align:left;background:none;border:0;color:#F2F5F3;min-height:44px;padding:0;justify-content:center"><span style="font:500 14px \'Space Grotesk\'">'+esc(x.name)+'</span><span style="font:400 12px \'Space Grotesk\';color:#B9C1BC">'+esc(x.tier)+'</span></button><span style="font:500 12px \'Space Grotesk\';color:'+(x.visible?'#3CFF4E':'#8A938E')+'">'+(x.visible?'Visible':'Masqué')+'</span></div>'}).join('');
    var ed=$('[data-p-edit]');ed.hidden=!p;
    if(p)ed.innerHTML='<div style="font:600 14px \'Space Grotesk\'">Modifier · '+esc(p.name)+'</div><div style="display:flex;gap:10px;align-items:center"><div style="width:72px;height:48px;border:1px dashed #2c312e;border-radius:4px;display:flex;align-items:center;justify-content:center;font:500 9px \'JetBrains Mono\';color:#8A938E">Logo</div><button type="button" data-logo style="font:500 13px \'Space Grotesk\';color:#3CFF4E;background:none;border:0;min-height:44px">Changer le logo</button></div>'
     +'<input class="ain" data-pf="name" value="'+esc(p.name)+'" aria-label="Nom"><input class="ain" data-pf="link" value="'+esc(p.link)+'" aria-label="Lien" inputmode="url">'
     +'<div class="seg3" role="group">'+['Venue','Partner','Sponsor'].map(function(t){return '<button type="button" data-tier="'+t+'" aria-pressed="'+(p.tier===t)+'" style="height:36px">'+t+'</button>'}).join('')+'</div>'
     +'<input class="ain" data-pf="blurb" value="'+esc(p.blurb)+'" aria-label="Description"><div style="display:flex;justify-content:space-between;align-items:center"><span style="font:500 14px \'Space Grotesk\'">Visible sur le site</span><span data-vis>'+A.sw(p.visible,'aria-label="Visible sur le site"')+'</span></div><button type="button" data-del style="align-self:flex-start;font:500 13px \'Space Grotesk\';color:#FF8A8A;background:none;border:0;min-height:40px">Supprimer ce partenaire</button>';
    $('[data-p-prev]').innerHTML=ps.filter(function(x){return x.visible}).map(function(x){return '<div style="height:44px;border:1px solid #222624;border-radius:4px;display:flex;align-items:center;justify-content:center;font:500 8px \'JetBrains Mono\';color:#8A938E;text-align:center;padding:2px">'+esc(short(x.name))+'</div>'}).join('')}
  document.addEventListener('click',function(ev){var t=ev.target,b,p=pl()[sel];
    if(b=t.closest('[data-sel]')){sel=+b.dataset.sel;render();return}
    if(t.closest('[data-p-add]')){var np={id:DP.store.id(),name:'Nouveau partenaire',tier:'Partner',link:'',blurb:'',visible:false};pl().push(np);DP.store.save();sel=pl().length-1;render();var f=$('[data-pf=name]');f&&(f.focus(),f.select());return}
    if(b=t.closest('[data-tier]')){p.tier=b.dataset.tier;DP.store.save();render();return}
    if(t.closest('[data-logo]')){A.toast('Choix de fichier indisponible dans la maquette');return}
    if(t.closest('[data-vis] .sw')){p.visible=!p.visible;DP.store.save();render();return}
    if(t.closest('[data-del]')){var idx=sel,rm=pl().splice(idx,1)[0];DP.store.save();render();A.toast(rm.name+' supprimé',[{l:'Annuler',fn:function(){pl().splice(idx,0,rm);DP.store.save();sel=idx;render()}}],5000)}});
  document.addEventListener('change',function(ev){var f=ev.target.closest('[data-pf]');if(!f)return;var p=pl()[sel];var v=f.value.trim();if(f.dataset.pf==='name'&&!v){f.value=p.name;return}p[f.dataset.pf]=v;DP.store.save();render()});
  var dr=null;
  document.addEventListener('dragstart',function(ev){var r=ev.target.closest('.prow');if(r){dr=+r.dataset.i;try{ev.dataTransfer.effectAllowed='move';ev.dataTransfer.setData('text/plain','p')}catch(x){}}});
  document.addEventListener('dragover',function(ev){if(dr!==null&&ev.target.closest('.prow'))ev.preventDefault()});
  document.addEventListener('drop',function(ev){var r=ev.target.closest('.prow');if(r&&dr!==null){ev.preventDefault();var to=+r.dataset.i,a=pl(),it=a.splice(dr,1)[0];a.splice(to,0,it);sel=to;dr=null;DP.store.save();render()}});
  render()}
})();
