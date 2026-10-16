/* Fake data for the mockup. Nothing here is real except the public Shotgun tiers/dates and the nights' names. */
(function(){
var DP=window.DP=window.DP||{};
DP.VERSION=6;
DP.event={slug:'act-iii',title:'NIGHT OF AFROBEATS',act:'ACT III [FINAL]',start:'2026-10-24T21:59:00Z',end:'2026-10-25T04:45:00Z',
  venue:'Noctaa Club',city:'Pantin',address:'100 Av. du Général Leclerc, 93500 Pantin',
  shotgun:'https://shotgun.live/fr/events/night-of-afrobeats-afterparrty-asake',
  maps:'https://www.google.com/maps/search/?api=1&query=100+Avenue+du+G%C3%A9n%C3%A9ral+Leclerc+93500+Pantin'};
DP.tiers=[
 {name:'EARLY BIRD',price:'16,50 €',status:'Épuisé',state:'off'},
 {name:'RELEASE 1',price:'20,00 €',status:'Épuisé',state:'off'},
 {name:'RELEASE 2',price:'27,01 €',status:'Épuisé',state:'off'},
 {name:'RELEASE 3',price:'35,20 €',status:'En vente',state:'on'},
 {name:'LAST TICKET',price:'—',status:'Bientôt en vente',state:'soon'}];
DP.lineup=[
 {name:'BLISSMAN',handle:'@blisssman',flag:'',role:'ASAKE OFFICIAL DJ',rot:'-1.5deg',photo:'artists/blissman'},
 {name:'XEN',handle:'@xen.niat ⭐',flag:'',role:'DJ',photo:'artists/xen'},
 {name:'DJ TALVI',handle:'@talvimusic',flag:'🇳🇬',role:'DJ',photo:'artists/talvi'},
 {name:'JIM GORDON',handle:'@_jimgordon',flag:'🇫🇷🇳🇬',role:'DJ'},
 {name:'DON MASSIMO',handle:'@donmassimoo_',flag:'🇳🇬',role:'DJ',photo:'artists/don-massimo'},
 {name:'WAYANS',handle:'@wayansboy',flag:'🇳🇬',role:'DJ',photo:'artists/wayans'},
 {name:'21VIIBEZ',handle:'@21viibez',flag:'',role:'HOST'},
 {name:'DRSK',handle:'@deejay.drsk',flag:'',role:'🥁 DRUMS',photo:'artists/drsk'}];
DP.series=['All','Night of Afrobeats','Rooftop','Detty December','Jeunesse Dorée','Love & Summer','Other'];
/* nights shown in the design's archive index (newest first). The 4 extra real nights are kept as unpublished drafts. */
function N(slug,pre,name,date,venue,series,credits,photos,pub){return{slug:slug,pre:pre,name:name,date:date,venue:venue,series:series,credits:credits||[],published:pub!==false,photoCount:photos||12}}
DP.nights=[
 N('noa-act-ii','AII','NOA — Act II','2026-09-26','Pantin','Night of Afrobeats',[{role:'video',handle:'@gandhax'},{role:'video',handle:'@i.reinee'},{role:'video',handle:'@_kyyah_'}],12),
 N('noa-act-i','AI','NOA — Act I','2026-07-25','Paris','Night of Afrobeats',[],10),
 N('fete-de-la-musique','FDM','Fête de la Musique','2026-06-21','Bowling Foch','Other',[],12),
 N('love-summer','LS','Love & Summer','2026-05-31','Paris','Love & Summer',[],12),
 N('rooftop-panameboat','RPB','Rooftop × Panameboat','2026-04-19','Hôtel Maison Montmartre','Rooftop',[],14),
 N('reemix','RMX','Reemix','2026-02-06','Espace Pantin','Other',[],10),
 N('long-live-king-k','LLK','Long Live King K.','2026-01-30','Cha-Cha Club','Other',[],10),
 N('detty-december','DD','Detty December','2025-12-12','G Club','Detty December',[],14),
 N('jeunesse-doree','JD','Jeunesse Dorée','2025-11-10','Tape Paris','Jeunesse Dorée',[],12),
 N('fola-live-show','FLS','Fola Live Show','2025-08-08','Cha-Cha Club','Other',[],12),
 N('don-parrty','DP','Don Parrty','2025-07-06','Club Pierre Charron','Other',[],10),
 N('la-fibre-congo-xxl','FC','La Fibre Congo XXL','2026-09-25','Noct Club','Other',[],12,false),
 N('afrobeat-experience','AE','Don Parrty Afrobeat Experience','2026-05-01','Hôtel Maison Montmartre','Other',[],12,false),
 N('love-summer-fdlm','LSF','Love & Summer — FDLM Edition','2026-06-20','Hôtel Maison Montmartre','Love & Summer',[],12,false),
 N('don-p-parrty','DPP','Don P Parrty','2025-08-03','Paris','Other',[],10,false)];
DP.partners=[
 {id:1,name:'Noctaa Club',tier:'Venue',link:'noctaaclub.fr',blurb:'Le club de Pantin qui accueille Night of Afrobeats.',visible:true},
 {id:2,name:'Cha-Cha Club',tier:'Venue',link:'chachaclub.fr',blurb:'Fola Live Show, Long Live King K.',visible:true},
 {id:3,name:'Hôtel Maison Montmartre',tier:'Venue',link:'hotelmaisonmontmartre.fr',blurb:'Le rooftop du printemps.',visible:true},
 {id:4,name:'LVDK / Afromood',tier:'Partner',link:'lvdkafromood.fr',blurb:'Collectif partenaire.',visible:true},
 {id:5,name:'Panameboat',tier:'Partner',link:'panameboat.fr',blurb:'Rooftop × Panameboat, avril 2026.',visible:true},
 {id:6,name:'Love & Summer',tier:'Partner',link:'loveandsummer.fr',blurb:'Co-host, mai 2026.',visible:true},
 {id:7,name:'DTB Paris',tier:'Sponsor',link:'dtbparis.fr',blurb:'Sponsor — one-liner à compléter.',visible:true}];
DP.seed={
 requests:[
  {id:1,name:'Amara',size:'8',arrival:'00:30–01:30',occasion:'Birthday',ago:'il y a 12 min',status:'new',wa:'+33 6 12 98 00 41',email:'amara.o@example.com',msg:'Anniv de ma sœur 🎂, on arrive après le concert.',log:[]},
  {id:2,name:'Kelvin',size:'6',arrival:'Après 01:30',occasion:'Just vibes',ago:'il y a 1 h',status:'new',wa:'+33 7 81 28 00 09',email:'',msg:'',log:[]},
  {id:3,name:'Sarah',size:'10',arrival:'Avant 00:30',occasion:'Celebration',ago:'il y a 3 h',status:'ok',wa:'+33 6 45 98 00 77',email:'sarah.k@example.com',msg:'Promo de master 🎓',log:['Confirmée par Temi · il y a 3 min']},
  {id:4,name:'Yann',size:'4',arrival:'00:30–01:30',occasion:'Just vibes',ago:'hier',status:'no',wa:'+33 6 02 98 00 15',email:'',msg:'',log:['Refusée par Temi · hier']},
  {id:5,name:'Ife',size:'12+',arrival:'Après 01:30',occasion:'Birthday',ago:'il y a 2 h',status:'new',wa:'+33 7 55 28 00 30',email:'ife.a@example.com',msg:'14 personnes en tout, possible ?',log:[]},
  {id:6,name:'Grace',size:'6',arrival:'Avant 00:30',occasion:'Celebration',ago:'hier',status:'ok',wa:'+33 6 90 98 00 62',email:'grace@example.com',msg:'',log:['Confirmée par Temi · hier']}],
 apps:[
  {id:101,type:'dj',name:'DJ Kaylo',contact:'@djkaylo',ago:'il y a 2 h',status:'new',fields:[['Genres','Afrobeats, Amapiano'],['Ville','Paris'],['Lien','soundcloud.com/djkaylo'],['Dispo','Toutes les dates'],['Bio','Résident à Lagos 2 ans, installé à Paris depuis 2025.']]},
  {id:102,type:'creator',name:'Mina R.',contact:'@mina.frames',ago:'il y a 5 h',status:'new',fields:[['Rôle','Photographe'],['Portfolio','mina-frames.example'],['Dispo','24 oct.'],['Publication avec crédit','Oui']]},
  {id:103,type:'sponsor',name:'Brasserie Kora',contact:'contact@kora.example',ago:'hier',status:'short',fields:[['Type','Marque'],['Contact','Léa Martin'],['Site','kora.example'],['Proposition','Boisson partenaire pour Act III']]},
  {id:104,type:'dj',name:'Selecta Zee',contact:'@selectazee',ago:'hier',status:'booked',fields:[['Genres','Afro house, Shatta'],['Ville','Lyon'],['Lien','mixcloud.com/zee'],['Dispo','Any']]},
  {id:105,type:'creator',name:'Tobi Visuals',contact:'@tobi.visuals',ago:'il y a 2 j',status:'notnow',fields:[['Rôle','Vidéaste'],['Portfolio','tobivisuals.example'],['Dispo','Any']]},
  {id:106,type:'sponsor',name:'Studio Nuit',contact:'bonjour@studionuit.example',ago:'il y a 3 j',status:'new',fields:[['Type','Lieu'],['Contact','Paul'],['Proposition','Salle 400 pers., Paris 11e']]},
  {id:107,type:'retrait',name:'Photo AII-007',contact:'n.k***@gmail.com',ago:'il y a 40 min',status:'new',photo:'AII-007',msg:'C’est moi au centre, je préfère que la photo ne soit pas en ligne. Merci !',fields:[['Soirée','Act II · 26 sept.'],['Demandé par','n.k***@gmail.com'],['Reçu','il y a 40 min']]}],
 nights:null,
 banner:{on:true,text:'LAST TICKET — BIENTÔT EN VENTE →',link:'event.html#tickets',style:'dark',start:'',end:'2026-10-25T04:45:00Z'},
 partners:null,
 settings:{email:'hello@donparrty.fr',whatsapp:'+33 6 •• •• •• ••',instagram:'donparrty.fr',licence:'',credit:'Site par Temi',company:''},
 nl:{subsBase:612,subsExtra:0,formVisible:true,testsLeft:48,history:[
   {id:1,subject:'ACT III — LE FINAL',status:'scheduled',when:'2026-10-19T16:00:00Z',recips:612},
   {id:2,subject:'Brouillon sans titre',status:'draft',when:'',mod:'Modifié il y a 2 j',recips:0},
   {id:3,subject:'ACT II — DJ Tunez',status:'sent',when:'2026-09-12T10:00:00Z',recips:588},
   {id:4,subject:'Act I — tickets',status:'sent',when:'2026-07-10T10:00:00Z',recips:540}]},
 nextId:200};
/* real photos shipped with the mockup: slug -> count (assets/media/archives/<slug>/NN.webp + NN-t.webp). Other nights keep the placeholder tiles. */
DP.media={'noa-act-i':10,'noa-act-ii':12};
DP.asset=function(p){return (document.body&&document.body.dataset.root||'')+'assets/media/'+p};
DP.cover=function(slug){return DP.media[slug]?DP.asset('archives/'+slug+'/01-t.webp'):''};
/* deterministic photo list for a night (ids like AII-014; heights follow the design's masonry) */
DP.photos=function(n){var out=[],i,H=[220,150,160,230,190,190,240,140,150,210,260,180,320,220,200,300],HD=[260,180,320,220,200,300,240,180,280,220,340,190,210,260,180,300],s=0,k;
  for(k=0;k<n.slug.length;k++)s=(s*31+n.slug.charCodeAt(k))>>>0;var off=n.slug==='noa-act-ii'?0:s%7;
  for(i=0;i<n.photoCount;i++){var pad=(i+1<10?'00':i+1<100?'0':'')+(i+1);var q={id:n.pre+'-'+pad,h:H[(i+off)%H.length],hd:HD[(i+off)%HD.length]};if(DP.media[n.slug]&&i<DP.media[n.slug]){var nn=(i+1<10?'0':'')+(i+1);q.src=DP.asset('archives/'+n.slug+'/'+nn+'.webp');q.th=DP.asset('archives/'+n.slug+'/'+nn+'-t.webp')}out.push(q)}
  return out};
})();
