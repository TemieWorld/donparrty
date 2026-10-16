/* Admin newsletter: history (A6c), composer checklist (A6a), confirm modal (A6b). Nothing is sent anywhere. */
(function(){
var DP=window.DP,A=DP.A,$=DP.$,$$=DP.$$,esc=DP.esc;if(!A)return;
var S=A.S,nl=function(){return S().nl},subs=function(){return nl().subsBase+nl().subsExtra};
var ST={sent:['Envoyée','#3CFF4E','#3CFF4E','#041A07'],scheduled:['Programmée','#FFC53D','transparent','#FFC53D'],draft:['Brouillon','#2c312e','transparent','#D5DBD7']};
function dFmt(iso,o){return DP.fmt(iso,o)}
function desc(h){if(h.status==='scheduled'){var d=new Date(h.when);return 'Programmée · '+DP.fmt(h.when,{weekday:'short',day:'numeric',month:'short'})+' '+DP.fmt(h.when,{hour:'2-digit',minute:'2-digit'})+' (Paris) · '+h.recips}
  if(h.status==='sent')return 'Envoyée · '+DP.fmt(h.when,{day:'numeric',month:'short'})+' · '+h.recips;return h.mod||'Modifié à l’instant'}
function hist(){$('[data-nl=hist]').innerHTML=nl().history.map(function(h){var c=ST[h.status];
  return '<div class="hrow" data-h="'+h.id+'" style="border:1px solid #222624;border-radius:8px;padding:12px 14px;display:flex;flex-direction:column;gap:6px'+(h.status==='draft'?';cursor:pointer':'')+'"><div style="display:flex;justify-content:space-between;gap:8px"><span style="font:600 15px \'Space Grotesk\'">'+esc(h.subject)+'</span><span style="flex:none;font:600 11px \'Space Grotesk\';padding:4px 9px;border-radius:999px;border:1px solid '+c[1]+';color:'+c[3]+';background:'+c[2]+'">'+c[0]+'</span></div><span style="font:400 12px \'Space Grotesk\';color:#B9C1BC">'+esc(desc(h))+'</span>'+(h.status==='scheduled'?'<a href="#" data-cancel="'+h.id+'" style="font:500 13px \'Space Grotesk\';color:#FF8A8A;height:32px;display:flex;align-items:center">Annuler la programmation</a>':'')+'</div>'}).join('');
  $('[data-nl=form]').innerHTML=A.sw(nl().formVisible!==false,'aria-label="Formulaire d’inscription visible sur le site"')}
document.addEventListener('click',function(e){var t=e.target;
  var c=t.closest('[data-cancel]');if(c){e.preventDefault();e.stopPropagation();var h=nl().history.filter(function(x){return x.id==+c.dataset.cancel})[0];var was=[h.status,h.when,h.mod];h.status='draft';h.mod='Modifié à l’instant';h.when='';DP.store.save();hist();A.toast('Programmation annulée',[{l:'Annuler',fn:function(){h.status=was[0];h.when=was[1];h.mod=was[2];DP.store.save();hist()}}],5000);return}
  var sw=t.closest('.sw');if(sw&&sw.closest('[data-nl=form]')){var n=nl();n.formVisible=n.formVisible===false;DP.store.save();hist();A.toast(n.formVisible?'Formulaire visible sur le site':'Formulaire masqué — newsletter en pause');return}
  var d=t.closest('.hrow');if(d){var hh=nl().history.filter(function(x){return x.id==+d.dataset.h})[0];if(hh&&hh.status==='draft')openComp(hh.subject==='Brouillon sans titre'?null:hh.subject)}});
/* ---- composer ---- */
var comp=$('[data-nl=comp]'),cf=function(k){return $('[data-c='+k+']',comp)};
var blocks,pv='phone';
var BTN={Titre:['H','NOUVEAU TITRE'],Texte:['T','Nouveau paragraphe…']};
function blocksHtml(){return blocks.map(function(b){
  if(b.k==='h')return '<div class="bk" style="font:600 15px \'Space Grotesk\'"><span class="gr">⋮⋮</span>H · '+esc(b.v)+'</div>';
  if(b.k==='t')return '<div class="bk" style="align-items:flex-start;font:400 13px/1.45 \'Space Grotesk\';color:#D5DBD7"><span class="gr">⋮⋮</span>'+esc(b.v)+'</div>';
  if(b.k==='e')return '<div class="bk" style="border-color:#3CFF4E;gap:10px"><span class="gr">⋮⋮</span><div style="width:48px;height:48px;border-radius:4px;background:repeating-linear-gradient(135deg,#121413 0 6px,#171a18 6px 12px)"></div><div style="display:flex;flex-direction:column;gap:2px"><span style="font:600 13px \'Space Grotesk\'">Bloc Event · auto</span><span style="font:400 12px \'Space Grotesk\';color:#B9C1BC">Act III · sam. 24 oct. · Pantin</span></div></div>';
  if(b.k==='i')return '<div class="bk" style="gap:10px"><span class="gr">⋮⋮</span><div style="width:48px;height:48px;border-radius:4px;background:repeating-linear-gradient(135deg,#121413 0 6px,#171a18 6px 12px)"></div><span style="font:600 13px \'Space Grotesk\'">Image</span></div>';
  return '<div class="bk" style="font:400 13px \'Space Grotesk\'"><span class="gr">⋮⋮</span><span style="background:#3CFF4E;color:#041A07;padding:6px 10px;border-radius:4px;font-weight:600">Bouton · TICKETS ↗</span></div>'}).join('')}
function upd(){var s=cf('subj').value,p=cf('pre').value;cf('sn').textContent=s.length+'/60';cf('pn').textContent=p.length+'/90';
  cf('pvt').textContent=(s.split('.')[0]||'—').toUpperCase();var tx=blocks.filter(function(b){return b.k==='t'})[0];tx=tx?tx.v:'';cf('pvx').textContent=tx.length>26?tx.slice(0,26).trim()+'…':tx;
  cf('blocks').innerHTML=blocksHtml();cf('pv').style.width=pv==='phone'?'180px':'300px';
  cf('pvm').setAttribute('aria-pressed',pv==='phone');cf('pvd').setAttribute('aria-pressed',pv!=='phone');
  var left=nl().testsLeft;cf('tl').textContent='Tests restants aujourd’hui : '+left+'/50';cf('test').disabled=left<=0;cf('test').style.opacity=left<=0?.4:1;
  var n=subs();cf('warn').hidden=n<=300;cf('to').textContent='Liste Don Parrty · '+n+' abonnés';
  var later=$('input[name=when]:checked',comp).value==='later';cf('when').hidden=!later;cf('send').textContent=later?'Programmer l’envoi':'Envoyer à '+n+' personnes'}
function openComp(subject){blocks=[{k:'h',v:'ACT III — LE FINAL'},{k:'t',v:'Le dernier acte. Samedi 24, après Accor Arena…'},{k:'e'},{k:'b'}];
  cf('subj').value=subject||'ACT III — LE FINAL. Release 3 en vente.';cf('pre').value='Release 3 en vente. Last Ticket bientôt.';
  $('input[name=when][value=now]',comp).checked=true;cf('when').value='';pv='phone';upd();comp.classList.add('open');document.body.style.overflow='hidden';comp.scrollTop=0}
function close(){comp.classList.remove('open');document.body.style.overflow=''}
$('[data-nl=new]').addEventListener('click',function(){openComp()});
cf('close').addEventListener('click',close);
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&comp.classList.contains('open')&&!$('[data-nl=confirm]').open)close()});
comp.addEventListener('input',upd);comp.addEventListener('change',upd);
cf('pvm').addEventListener('click',function(){pv='phone';upd()});cf('pvd').addEventListener('click',function(){pv='desk';upd()});
(function(){var add=cf('add');add.innerHTML=['Titre','Texte','Image','Bouton','Event'].map(function(b){return '<button type="button" data-add="'+b+'" style="height:36px;padding:0 10px;border:1px dashed #2c312e;border-radius:6px;background:none;color:#D5DBD7;font:500 12px \'Space Grotesk\'">+'+b+'</button>'}).join('');
  add.addEventListener('click',function(e){var b=e.target.closest('[data-add]');if(!b)return;var k={Titre:{k:'h',v:'NOUVEAU TITRE'},Texte:{k:'t',v:'Nouveau paragraphe…'},Image:{k:'i'},Bouton:{k:'b'},Event:{k:'e'}}[b.dataset.add];blocks.push(Object.assign({},k));upd()})})();
cf('test').addEventListener('click',function(){var n=nl();if(n.testsLeft<=0)return;n.testsLeft--;DP.store.save();upd();A.toast('Test envoyé à temi@donparrty.fr')});
/* confirm modal */
var dlg=$('[data-nl=confirm]'),k=function(x){return $('[data-k='+x+']',dlg)},pending=null;
cf('send').addEventListener('click',function(){var later=$('input[name=when]:checked',comp).value==='later',n=subs(),subj=cf('subj').value.trim();
  if(!subj){cf('subj').focus();A.toast('Ajoute un objet avant l’envoi');return}
  if(later){if(!cf('when').value){cf('when').focus();A.toast('Choisis une date et une heure (heure de Paris)');return}
    if(Date.parse(A.fromInput(cf('when').value))<=Date.now()){cf('when').focus();A.toast('La date doit être dans le futur');return}}
  pending={later:later,subj:subj,n:n};
  k('t').textContent=later?'Programmer l’envoi à '+n+' personnes ?':'Envoyer à '+n+' personnes maintenant ?';
  k('d').textContent=later?'L’email partira le '+A.dtFr(A.fromInput(cf('when').value))+' (heure de Paris). Tu peux annuler la programmation jusque-là.':'Action irréversible. L’email part tout de suite à toute la liste.';
  k('w').hidden=n<=300;k('yes').textContent=later?'Programmer':'Envoyer';DP.openDlg(dlg)});
k('no').addEventListener('click',function(){DP.closeDlg(dlg)});
dlg.addEventListener('click',function(e){if(e.target===dlg)DP.closeDlg(dlg)});
k('yes').addEventListener('click',function(){DP.closeDlg(dlg);var p=pending,h=nl().history;
  h.unshift({id:DP.store.id(),subject:p.subj,status:p.later?'scheduled':'sent',when:p.later?A.fromInput(cf('when').value):new Date().toISOString(),recips:p.n});DP.store.save();close();hist();A.toast(p.later?'Campagne programmée':'Campagne envoyée à '+p.n+' personnes (simulation)')});
hist()})();
