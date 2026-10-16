(function(){
var DP=window.DP,$=DP.$,$$=DP.$$,S=function(){return DP.store.get()};
/* ---------- table request ---------- */
$$('[data-tbl-form]').forEach(function(form){
  var wrap=form.closest('[data-tbl-form-wrap]'),done=$('[data-tbl-done]',wrap.parentNode);
  form.addEventListener('submit',function(e){e.preventDefault();if(!DP.validate(form))return;var btn=$('button[type=submit]',form);
    DP.submitFx(btn,800,function(){var fd=new FormData(form),size=DP.chipValues(form,'size')[0],arr=DP.chipValues(form,'arrival')[0],occ=DP.chipValues(form,'occasion')[0]||'—',wa='+33 '+String(fd.get('wa')).trim();
      S().requests.unshift({id:DP.store.id(),name:fd.get('name'),size:size,arrival:arr,occasion:occ,ago:'à l’instant',status:'new',wa:wa,email:fd.get('email')||'',msg:fd.get('msg')||'',log:[]});DP.store.save();
      setTimeout(function(){wrap.hidden=true;$('[data-tbl-sum]',done).textContent='Act III · '+size+' pers. · '+arr+(occ!=='—'?' · '+occ:'');done.hidden=false;done.scrollIntoView({block:'start',behavior:DP.reduced()?'auto':'smooth'})},450)})})});
/* ---------- work with us: full-screen flows ---------- */
var screens=$$('.flow-screen');
if(screens.length){
  var openId=null;
  function setStep(sc,i){var steps=$$('.pstep',sc),n=steps.length,form=$('[data-flow-form]',sc);steps.forEach(function(s,j){s.classList.toggle('on',j===i)});sc.dataset.step=i;
    $('[data-flow-count]',sc).textContent=(i+1)+' / '+n;$('[data-flow-bar]',sc).style.width=Math.round((i+1)/n*100)+'%';
    $('[data-flow-next]',sc).hidden=i===n-1;$('[data-flow-send]',sc).hidden=i!==n-1;var al=$('[data-alert]',sc);if(al)al.hidden=true;sc.scrollTop=0;window.scrollTo(0,0)}
  function open(k){var sc=$('.flow-screen[data-flow="'+k+'"]');if(!sc)return;openId=k;sc.classList.add('open');document.body.style.overflow='hidden';
    $('[data-flow-form]',sc).hidden=false;$('[data-flow-done]',sc).hidden=true;setStep(sc,0);var f=$('input,textarea',sc);f&&setTimeout(function(){f.focus({preventScroll:true})},250);history.replaceState(null,'','#'+k)}
  function close(){screens.forEach(function(s){s.classList.remove('open')});document.body.style.overflow='';openId=null;history.replaceState(null,'',location.pathname+location.search)}
  document.addEventListener('click',function(e){var o=e.target.closest('[data-open-flow]');if(o)open(o.dataset.openFlow)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&openId)close()});
  screens.forEach(function(sc){var form=$('[data-flow-form]',sc),steps=$$('.pstep',sc);
    $('[data-flow-back]',sc).addEventListener('click',close);
    $('[data-flow-prev]',sc).addEventListener('click',function(){var i=+sc.dataset.step||0;if(i===0)close();else setStep(sc,i-1)});
    $('[data-flow-next]',sc).addEventListener('click',function(){var i=+sc.dataset.step||0;if(DP.validate(steps[i]))setStep(sc,i+1)});
    form.addEventListener('submit',function(e){e.preventDefault();var i=+sc.dataset.step||0;if(!DP.validate(steps[i]))return;var btn=$('[data-flow-send]',sc);
      DP.submitFx(btn,800,function(){var type=sc.dataset.flow,fd=new FormData(form),fields=[];
        var lab={stage:'Nom de scène',handle:'Instagram',city:'Ville',links:'Liens',bio:'Bio',note:'Note',portfolio:'Portfolio',gear:'Matériel',company:'Structure',contact:'Contact',email:'Email',phone:'Téléphone',site:'Site web',proposal:'Proposition'};
        var seen={};fd.forEach(function(v,k){v=String(v).trim();if(!v||k==='consent'||k==='credit')return;if(seen[k]){var f=fields.filter(function(x){return x[2]===k})[0];f[1]+=', '+v;return}seen[k]=1;fields.push([lab[k]||k,v,k])});
        [['genres','Genres'],['roles','Rôle'],['avail','Dispo'],['kind','Type'],['nights','Soirées visées']].forEach(function(g){var v=DP.chipValues(sc,g[0]);if(v.length)fields.push([g[1],v.join(', ')])});
        if(fd.get('credit'))fields.push(['Publication avec crédit','Oui']);
        var name=fd.get('stage')||fd.get('company')||fd.get('handle')||'Candidat',contact=fd.get('handle')||fd.get('email')||'';
        S().apps.unshift({id:DP.store.id(),type:type,name:name,contact:contact,ago:'à l’instant',status:'new',fields:fields.map(function(x){return[x[0],x[1]]})});DP.store.save();
        setTimeout(function(){form.hidden=true;$('[data-flow-done]',sc).hidden=false;sc.scrollTop=0},450)})})});
  var h=(location.hash||'').slice(1);if(h&&$('.flow-screen[data-flow="'+h+'"]'))open(h);
}
})();
