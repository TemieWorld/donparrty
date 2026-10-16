/* Admin: login (A1), overview (A2), settings (A10). */
(function(){
var DP=window.DP,A=DP.A,$=DP.$,$$=DP.$$,esc=DP.esc,page=document.body.dataset.page;
if(page==='login'){
  var form=$('[data-login]');
  form.addEventListener('submit',function(e){e.preventDefault();
    if(!DP.validate(form))return;
    var btn=$('.btn-go',form);DP.submitFx(btn,600,function(){try{sessionStorage.setItem('dp_admin','1')}catch(x){}setTimeout(function(){location.href='overview.html'},350)})});
  $('[data-magic]').addEventListener('click',function(e){e.preventDefault();DP.toast('Lien envoyé (simulation) — rien n’est expédié.')});
  return}
if(!A)return;
if(page==='overview'){
  var s=A.S(),c=A.counts(),jd=A.cdLabel()||'CE SOIR';
  $$('[data-ov=cd],[data-ov=cd2]').forEach(function(e){e.textContent=jd});
  function row(dot,txt,href){return '<a href="'+href+'" style="min-height:52px;background:#111312;border:1px solid #222624;border-radius:8px;padding:0 14px;display:flex;align-items:center;gap:10px;color:#F2F5F3;font:500 14px \'Space Grotesk\'"><span style="width:8px;height:8px;border-radius:50%;background:'+dot+'"></span>'+txt+'<span style="margin-left:auto;color:#8A938E">›</span></a>'}
  var todo='';
  if(c.req)todo+=row('#3CFF4E',c.req+' nouvelle'+(c.req>1?'s':'')+' demande'+(c.req>1?'s':'')+' de table','requests.html');
  if(c.app)todo+=row('#3CFF4E',c.app+' candidature'+(c.app>1?'s':''),'applications.html');
  if(c.ret)todo+=row('#FFC53D',c.ret+' demande'+(c.ret>1?'s':'')+' de retrait','applications.html?t=retrait');
  $('[data-ov=todo]').innerHTML=todo||'<div style="padding:14px;font:400 14px \'Space Grotesk\';color:#8A938E;border:1px solid #222624;border-radius:8px">Tout est à jour.</div>';
  var b=s.banner,bs=A.bannerStatus(b),btxt=bs.t;
  if(b.on&&b.end&&(!b.start||Date.now()>=Date.parse(b.start))&&Date.now()<Date.parse(b.end))btxt='En ligne · se masque le '+A.dtFr(b.end);
  $('[data-ov=stats]').innerHTML='<div style="border:1px solid #222624;border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:4px"><span style="font:700 24px \'Space Grotesk\'">'+(s.nl.subsBase+s.nl.subsExtra)+'</span><span style="font:400 12px \'Space Grotesk\';color:#B9C1BC">abonnés newsletter</span></div>'
   +'<div style="border:1px solid #222624;border-radius:8px;padding:12px;display:flex;flex-direction:column;gap:4px"><span style="font:700 24px \'Space Grotesk\'">'+(3+s.requests.length)+'</span><span style="font:400 12px \'Space Grotesk\';color:#B9C1BC">demandes cette semaine</span></div>'
   +'<div style="grid-column:span 2;border:1px solid #222624;border-radius:8px;padding:12px;display:flex;align-items:center;gap:8px"><span style="width:8px;height:8px;border-radius:50%;background:'+bs.c+'"></span><span style="font:500 13px \'Space Grotesk\'">Bandeau · '+esc(btxt)+'</span></div>'}
if(page==='settings'){
  var set=A.S().settings;
  var F=[['email','Email de contact','Affiché sur Info et Légal.','email'],['whatsapp','WhatsApp public','Utilisé pour les réponses tables.','tel'],['instagram','Instagram','','text'],['licence','N° de récépissé (licence)','Affiché dans le footer et la page Légal.','text'],['credit','Crédit footer','','text']];
  var host=$('[data-set-fields]');
  host.innerHTML=F.map(function(f){var v=f[0]==='instagram'?'@'+String(set.instagram||'').replace(/^@/,''):set[f[0]]||'';
    return '<label style="display:flex;flex-direction:column;gap:5px;font:500 12px \'Space Grotesk\';color:#B9C1BC">'+f[1]+'<input name="'+f[0]+'" value="'+esc(v)+'" placeholder="à compléter" autocomplete="off" style="height:46px;background:#111312;border:1px solid '+(f[0]==='licence'&&!v?'#FFC53D':'#2c312e')+';border-radius:6px;padding:0 12px;color:#F2F5F3;font:400 15px \'Space Grotesk\'"><span style="font:400 11px \'Space Grotesk\';color:#8A938E">'+f[2]+'</span></label>'}).join('');
  host.addEventListener('input',function(e){if(e.target.name==='licence')e.target.style.borderColor=e.target.value.trim()?'#2c312e':'#FFC53D'});
  $('[data-set-form]').addEventListener('submit',function(e){e.preventDefault();var fd=new FormData(this),st=A.S().settings;
    F.forEach(function(f){var v=String(fd.get(f[0])||'').trim();if(f[0]==='instagram')v=v.replace(/^@/,'');st[f[0]]=v});
    if(!st.credit)st.credit='Site par Temi';DP.store.save();A.toast('Réglages enregistrés')});
  $('[data-reset]').addEventListener('click',function(e){e.preventDefault();A.reset()})}
})();
