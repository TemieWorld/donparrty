#!/usr/bin/env python3
"""Static site generator for the Don Parrty mockup. Run: python3 build.py"""
import re, json, os, shutil, glob, html
import brand
HERE=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.join(os.path.dirname(HERE),'mockup')
E=html.escape
def rd(p): return open(os.path.join(HERE,p),encoding='utf-8').read()
def wr(p,s):
    if p.endswith('.html'): s=brand.expand(s)
    full=os.path.join(OUT,p); os.makedirs(os.path.dirname(full),exist_ok=True); open(full,'w',encoding='utf-8').write(s)
def inc(name): return rd(f'partials/{name}.html')
def macros(s):
    s=re.sub(r'\{\{inc ([\w-]+)\}\}',lambda m:inc(m.group(1)),s)
    return brand.expand(s)
def btn_inner(label): return f'<span class="lb">{label}</span><span class="spin"></span><svg class="tk" viewBox="0 0 26 26" fill="none"><path d="M5 13.5l5.5 5.5L21 8" stroke="#041A07" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
def split_meta(src):
    m=re.match(r'\s*<!--(\{.*?\})-->\s*',src,re.S); return json.loads(m.group(1)),src[m.end():]
def split_variants(body):
    parts=re.split(r'<!--@(m|d)-->',body)
    if len(parts)==1: return body,None
    d={'m':None,'d':None}; i=1
    while i<len(parts): d[parts[i]]=parts[i+1]; i+=2
    return d['m'],d['d']
def pub_layout(meta,bm,bd):
    title=meta['title']; scripts=['data','core','public']+meta.get('js',[])
    sc=meta.get('scta',False)
    if meta.get('bare'):
        m_html='<div class="m-col"><main id="main">'+bm+'</main></div>'; d_html='<div class="d-col"><main>'+(bd if bd is not None else bm)+'</main></div>'
        return _page(meta,title,scripts,sc,m_html,d_html)
    m_html='<div class="m-col">'+inc('banner')+inc('header_m')+f'<main id="main">{bm}</main>'+inc('footer_m')+'</div>'
    if bd is None: bd_inner='<div class="dfall">'+bm+'</div>'; chrome_d='std'
    else: bd_inner=bd; chrome_d=meta.get('chrome_d','std')
    if chrome_d=='home': d_html=inc('banner')+f'<main class="d-col">{bd_inner}</main><div class="d-col">'+inc('footer_d')+'</div>'
    else: d_html=inc('banner')+'<div class="d-col">'+inc('header_d')+f'<main>{bd_inner}</main>'+inc('footer_d')+'</div>'
    return _page(meta,title,scripts,sc,m_html,d_html)
def _page(meta,title,scripts,sc,m_html,d_html):
    return f'''<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>{E(title)} — Don Parrty</title>
<meta name="description" content="{E(meta.get('desc','Don Parrty — Night of Afrobeats, Paris. Maquette statique.'))}">
<meta name="theme-color" content="#050505">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 rx=%276%27 fill=%27%23050505%27/%3E%3Ccircle cx=%2716%27 cy=%2716%27 r=%276%27 fill=%27%233CFF4E%27/%3E%3C/svg%3E">
<link rel="preload" href="assets/fonts/anton-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/space-grotesk-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/league-spartan-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/main.css">
<script>(function(){{var d=document.documentElement;d.className='js';try{{var m=localStorage.getItem('dp_motion');if(m==='"paused"'||(m===null&&matchMedia('(prefers-reduced-motion: reduce)').matches))d.dataset.motion='paused'}}catch(e){{}}}})()</script>
</head>
<body data-page="{meta.get('page','')}" data-scta="{1 if sc else 0}" data-root="">
<a class="skip" href="#main">Aller au contenu</a>
<div class="v-m">{m_html}</div>
<div class="v-d">{d_html}</div>
{inc('sticky_m')}
{inc('menu_m')}
{inc('dialogs')}
{''.join(inc(n) for n in meta.get('inc',[]))}
{''.join(f'<script src="assets/js/{s}.js"></script>' for s in scripts)}
</body></html>'''
def build():
    if os.path.isdir(OUT):
        for sub in ('assets/css','assets/js'): shutil.rmtree(os.path.join(OUT,sub),ignore_errors=True)
        for f in glob.glob(os.path.join(OUT,'*.html'))+glob.glob(os.path.join(OUT,'admin','*.html')): os.remove(f)
    wr('assets/css/main.css',rd('css/design.css'))
    wr('assets/css/admin.css',rd('css/design.css')+'\n'+rd('css/admin.css'))
    for f in glob.glob(os.path.join(HERE,'js','*.js')): wr('assets/js/'+os.path.basename(f),brand.expand_js(open(f,encoding='utf-8').read()))
    n=0
    for f in sorted(glob.glob(os.path.join(HERE,'pages','*.html'))):
        meta,body=split_meta(open(f,encoding='utf-8').read()); bm,bd=split_variants(macros(body))
        wr(meta['out'],pub_layout(meta,bm,bd)); n+=1
    for f in sorted(glob.glob(os.path.join(HERE,'raw','*.html'))):
        wr(os.path.basename(f),macros(open(f,encoding='utf-8').read())); n+=1
    try:
        import admin_layout; n+=admin_layout.build(wr,split_meta,macros,HERE)
    except ImportError: pass
    md=os.path.join(HERE,'media')
    if os.path.isdir(md): shutil.copytree(md,os.path.join(OUT,'assets','media'),dirs_exist_ok=True)
    wr('robots.txt','User-agent: *\nDisallow: /\n'); wr('.nojekyll','')
    print('built',n,'pages ->',OUT)
if __name__=='__main__': build()
