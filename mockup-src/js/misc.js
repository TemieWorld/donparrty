/* shared: FAQ accordion (from the boards), used by Info and the Event page */
(function(){
var DP=window.DP,$=DP.$,$$=DP.$$,esc=DP.esc;
DP.FAQ=[
 ['Je peux revendre mon billet ?','Oui, uniquement via la revente officielle Shotgun, depuis ton compte. Pas de revente hors Shotgun : on ne peut pas garantir les billets.'],
 ['Comment réserver une table ?','Remplis le formulaire Tables. On te répond sur WhatsApp ou par email avec les formules. La table est confirmée seulement après notre réponse.'],
 ['Pourquoi deux bandeaux cookies sur la billetterie ?','Le premier est le nôtre. Le widget Shotgun affiche le sien, car Shotgun dépose ses propres cookies.'],
 ['Je suis sur une photo, comment la retirer ?','Utilise "Demande de retrait" sous la photo. Elle est masquée dès réception, le temps qu\'on traite ta demande.'],
 ['Quel âge minimum ?','À compléter par l\'organisateur. Pièce d\'identité demandée à l\'entrée.']];
DP.faqHtml=function(items,o){o=o||{};var open=o.open==null?-1:o.open;
  return items.map(function(it,i){var on=i===open;
    return '<div data-acc style="border-bottom:1px solid #222624"><button type="button" aria-expanded="'+on+'" style="width:100%;min-height:'+(o.mini?56:60)+'px;background:none;border:0;color:#F2F5F3;display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left;font:500 '+(o.mini?14:15)+'px/1.35 \'Space Grotesk\';padding:0;cursor:pointer">'+esc(it[0])+'<span data-plus style="flex:none;'+(o.mini?'':'width:28px;height:28px;display:flex;align-items:center;justify-content:center;')+'color:#3CFF4E;font-size:'+(o.mini?20:22)+'px;transform:'+(on?'rotate(45deg)':'rotate(0)')+';transition:transform 200ms ease-out">+</span></button>'+
      '<div data-panel style="display:grid;grid-template-rows:'+(on?'1fr':'0fr')+';transition:grid-template-rows 200ms ease-out"><div style="overflow:hidden"><div style="padding:0 0 16px;font:400 14px/1.55 \'Space Grotesk\';color:#D5DBD7">'+esc(it[1])+'</div></div></div></div>'}).join('')};
document.addEventListener('click',function(e){var b=e.target.closest('[data-acc] > button');if(!b)return;var wrap=b.closest('[data-acc]'),root=wrap.parentNode,on=b.getAttribute('aria-expanded')==='true';
  $$('[data-acc]',root).forEach(function(w){var o=w===wrap&&!on;$('button',w).setAttribute('aria-expanded',String(o));$('[data-plus]',w).style.transform=o?'rotate(45deg)':'rotate(0)';$('[data-panel]',w).style.gridTemplateRows=o?'1fr':'0fr'})});
})();
