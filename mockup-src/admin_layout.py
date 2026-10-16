import os, glob, json, html
BUILD=os.environ.get("DP_BUILD","")
E=html.escape
TABS=[('overview','overview.html','Home'),('requests','requests.html','Requests'),('newsletter','newsletter.html','Newsletter'),('content','archives.html','Content'),('more','settings.html','More')]
NAVMAP={'overview':'overview','requests':'requests','applications':'requests','newsletter':'newsletter','content':'content','archives':'content','banner':'content','partners':'content','settings':'more','login':''}
def layout(meta,body):
    nav=NAVMAP.get(meta.get('nav',meta.get('page','overview')),''); title=meta['title']
    scripts=['data','core','admin']+meta.get('js',[])
    if meta.get('shell') is False: inner=body
    else:
        side=''.join(f'<a href="{h}"{" aria-current=\"page\"" if k==nav else ""}>{l}</a>' for k,h,l in TABS)
        tabs=''.join(f'<a href="{h}"{" aria-current=\"page\"" if k==nav else ""}>{l}</a>' for k,h,l in TABS)
        inner=f'''<div class="a-shell"><aside class="a-side"><a class="a-logo" href="overview.html" aria-label="Don Parrty — accueil">{{{{brand kind="wordmark" decor style="width:170px"}}}}</a>{side}<div class="a-who">Temi · organisateur</div></aside>
<main id="main" class="a-main">{body}</main><nav class="a-tabs" aria-label="Navigation admin">{tabs}</nav></div>'''
    return f'''<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex, nofollow">
<title>{E(title)} — Admin Don Parrty</title>
<meta name="theme-color" content="#050505">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 rx=%276%27 fill=%27%23050505%27/%3E%3Ccircle cx=%2716%27 cy=%2716%27 r=%276%27 fill=%27%233CFF4E%27/%3E%3C/svg%3E">
<link rel="stylesheet" href="../assets/css/admin.css?v={BUILD}">
<script>document.documentElement.className='js'</script>
</head>
<body class="adm" data-page="{meta.get('page','overview')}" data-root="../">
{inner}
<div id="toasts" role="status" aria-live="polite"></div>
{''.join(f'<script src="../assets/js/{s}.js?v={BUILD}"></script>' for s in scripts)}
</body></html>'''
def build(wr,split_meta,macros,HERE):
    n=0
    for f in sorted(glob.glob(os.path.join(HERE,'admin-pages','*.html'))):
        meta,body=split_meta(open(f,encoding='utf-8').read()); wr('admin/'+meta['out'],layout(meta,macros(body))); n+=1
    return n
