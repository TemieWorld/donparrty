"""Brand assets (wordmark, sticker, mascot, FINE sticker, green sign), ported 1:1 from
'Design system for event platform 2/Brand.dc.html'. Used through the {{brand ...}} macro.

Like the design runtime, only these style properties reach the component's host element:
position, left, right, top, bottom, inset, width, height, z-index, transform."""
import re, itertools

HOST_PROPS = {'position', 'left', 'right', 'top', 'bottom', 'inset', 'width', 'height', 'z-index', 'transform'}
_ids = itertools.count(1)

EIFFEL = ('M48 0 L52 0 L53 20 L56 20 L57 34 L59 34 L63 68 L67 68 L68 77 L65 77 L73 108 L79 108 L80 117 '
          'L77 117 L96 150 L72 150 C68 132 59 124 50 124 C41 124 32 132 28 150 L4 150 L23 117 L20 117 '
          'L21 108 L27 108 L35 77 L32 77 L33 68 L37 68 L41 34 L43 34 L44 20 L47 20 Z '
          'M45.5 82 L54.5 82 L57.5 106 L42.5 106 Z')

TONES = {
    'red':  dict(ln='#111', lips='#E0201F', teeth='#fff', gold='#C99A2E', head='#fff', outlined=True),
    'pink': dict(ln='#111', lips='#F7B8CC', teeth='#fff', gold='#E77DA3', head='#fff', outlined=True),
    'line': dict(ln='#F2F5F3', lips='none', teeth='none', gold='#C08035', head='none', outlined=False),
}


def _host_style(style):
    out = []
    for decl in (style or '').split(';'):
        if ':' not in decl:
            continue
        k, v = decl.split(':', 1)
        if k.strip().lower() in HOST_PROPS:
            out.append(k.strip() + ':' + v.strip())
    return ';'.join(out)


def _wordmark(p):
    color = p.get('color', '#F2F5F3'); outline = 'outline' in p; script = 'script' in p; glow = 'glow' in p
    wc = 'transparent' if outline else color
    ws = f'.012em {color}' if outline else '0'
    wglow = f'drop-shadow(0 0 2.2cqw {color}88)' if glow else 'none'
    ef = 'none' if outline else color
    es = color if outline else 'none'
    esw = '2.2' if outline else '0'
    pb = '10cqw' if script else '0'
    sc = p.get('scriptColor', '#F2F5F3')
    sglow = '0 0 1.4cqw rgba(255,255,255,.7)' if glow else 'none'
    scr = (f'<div style="position:absolute;left:3%;top:52%;font:400 12.2cqw/1 \'Pinyon Script\',cursive;color:{sc};'
           f'white-space:nowrap;text-shadow:{sglow};letter-spacing:.01em">Only the Dons survive.</div>') if script else ''
    return (f'<div style="position:relative;width:100%;padding-bottom:{pb}">'
            f'<div style="display:flex;align-items:baseline;justify-content:flex-start;font:800 17cqw/.8 \'League Spartan\',sans-serif;'
            f'letter-spacing:-.025em;white-space:nowrap;color:{wc};-webkit-text-stroke:{ws};filter:{wglow}">'
            f'<span>DON</span><span style="width:.24em;flex:none"></span><span>P</span>'
            f'<svg viewBox="0 0 100 150" style="height:1.02em;width:.68em;flex:none;margin:0 -.02em 0 -.01em;overflow:visible" aria-hidden="true">'
            f'<path fill-rule="evenodd" d="{EIFFEL}" fill="{ef}" stroke="{es}" stroke-width="{esw}" stroke-linejoin="round"></path></svg>'
            f'<span>RRTY</span></div>{scr}</div>')


def _sticker(p):
    mouth = p.get('icon') == 'mouth'
    heart = not mouth
    icon = ''
    if heart:
        icon = ('<svg viewBox="0 0 24 22" style="height:.82em;width:.9em;flex:none" aria-hidden="true"><path d="M12 21.2S2.2 15 2.2 8.3A5.2 5.2 0 0 1 12 5.6a5.2 5.2 0 0 1 9.8 2.7C21.8 15 12 21.2 12 21.2z" fill="#EE2A2A"></path></svg>')
    else:
        icon = ('<svg viewBox="0 0 70 50" style="height:1em;width:1.4em;flex:none;overflow:visible" aria-hidden="true">'
                '<path d="M22 10 C22 0 48 0 48 10" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"></path>'
                '<path d="M30 7 C30 -1 40 -1 40 7" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"></path>'
                '<path d="M6 22 C-2 20 -2 34 6 33" fill="none" stroke="#111" stroke-width="3" stroke-linecap="round"></path>'
                '<rect x="6" y="9" width="58" height="38" rx="19" fill="#E0201F" stroke="#111" stroke-width="3.5"></rect>'
                '<rect x="16" y="18" width="38" height="20" rx="9" fill="#fff" stroke="#111" stroke-width="2.5"></rect>'
                '<path d="M16 28 H54 M24 18 V38 M31 18 V38 M39 18 V38 M46 18 V38" stroke="#111" stroke-width="1.6"></path>'
                '<rect x="24.5" y="19" width="6" height="8.5" fill="#D4A72C"></rect>'
                '<rect x="31.5" y="19" width="7" height="8.5" fill="none" stroke="#D4A72C" stroke-width="1.6"></rect></svg>')
    return ('<div style="display:flex;justify-content:center"><div style="display:flex;align-items:center;gap:1.6cqw;background:#fff;'
            'border-radius:999px;padding:1.8cqw 5cqw 2.6cqw 5.5cqw;box-shadow:0 0 0 .5cqw rgba(0,0,0,.18),0 1.4cqw 4cqw rgba(0,0,0,.45);'
            "font:400 10.6cqw/1 'Permanent Marker',cursive;color:#111;white-space:nowrap\">"
            f'<span>I</span>{icon}<span style="letter-spacing:-.01em">DONPARRTY</span></div></div>')


def _mascot(p):
    t = TONES.get(p.get('tone', 'red'), TONES['red'])
    cid = f'dpteeth{next(_ids)}'
    outlined = ''
    if t['outlined']:
        outlined = ('<g fill="#fff" stroke="#fff" stroke-width="40" stroke-linejoin="round" stroke-linecap="round">'
                    '<path d="M130 195 C110 105 190 62 285 62 C380 62 460 105 440 195 Z"></path><path d="M258 72 C240 8 330 8 312 72 Z"></path>'
                    '<path d="M128 185 C70 165 45 240 85 268 C105 282 125 272 135 255 Z"></path><path d="M80 266 L80 300"></path>'
                    '<rect x="110" y="140" width="350" height="215" rx="108"></rect><path d="M470 190 L514 190 L514 262 L470 262 Z"></path></g>')
    ln, lips, teeth, gold, head = t['ln'], t['lips'], t['teeth'], t['gold'], t['head']
    tag = (f'<div style="font:400 11cqw/1 \'Permanent Marker\',cursive;color:{ln};transform:rotate(4deg);white-space:nowrap">ONLY THE DONS</div>'
           ) if 'tagline' in p else ''
    return ('<div style="display:flex;flex-direction:column;align-items:center;gap:1cqw">'
            '<svg viewBox="0 0 560 380" style="width:100%;height:auto;display:block;overflow:visible" aria-hidden="true">'
            f'<defs><clipPath id="{cid}"><rect x="165" y="185" width="240" height="125" rx="55"></rect></clipPath></defs>{outlined}'
            f'<g fill="{head}" stroke="{ln}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">'
            '<path d="M130 195 C110 105 190 62 285 62 C380 62 460 105 440 195"></path>'
            '<path d="M258 72 C240 8 330 8 312 72" fill="none"></path>'
            '<path d="M165 145 C192 98 240 92 262 124" fill="none"></path><path d="M195 145 C210 124 236 120 248 136" fill="none"></path>'
            '<path d="M405 145 C378 98 330 92 308 124" fill="none"></path><path d="M375 145 C360 124 334 120 322 136" fill="none"></path>'
            '<path d="M128 185 C70 165 45 240 85 268 C105 282 125 272 135 255"></path>'
            '<path d="M100 210 C86 222 90 244 104 248" fill="none"></path>'
            '<path d="M80 268 L80 300" fill="none" stroke-width="9"></path>'
            '<path d="M477 200 L508 194 M482 224 L514 225 M480 248 L508 256" fill="none"></path></g>'
            f'<rect x="110" y="140" width="350" height="215" rx="108" fill="{lips}" stroke="{ln}" stroke-width="7"></rect>'
            f'<rect x="165" y="185" width="240" height="125" rx="55" fill="{teeth}" stroke="{ln}" stroke-width="6"></rect>'
            f'<g clip-path="url(#{cid})" stroke="{ln}" stroke-width="4.5" fill="{teeth}">'
            '<rect x="172" y="188" width="40" height="54" rx="14"></rect>'
            f'<rect x="212" y="188" width="40" height="54" rx="14" fill="{gold}"></rect>'
            f'<rect x="252" y="186" width="56" height="58" rx="13" fill="{teeth}" stroke="{gold}" stroke-width="5"></rect>'
            '<rect x="308" y="188" width="40" height="54" rx="14"></rect><rect x="348" y="188" width="40" height="54" rx="14"></rect>'
            '<rect x="388" y="188" width="22" height="54" rx="14"></rect><rect x="168" y="250" width="38" height="58" rx="14"></rect>'
            '<rect x="206" y="250" width="36" height="58" rx="14"></rect>'
            f'<rect x="242" y="248" width="76" height="62" rx="13" fill="{teeth}" stroke="{gold}" stroke-width="5"></rect>'
            '<rect x="318" y="250" width="36" height="58" rx="14"></rect><rect x="354" y="250" width="36" height="58" rx="14"></rect>'
            '<rect x="390" y="250" width="22" height="58" rx="14"></rect></g>'
            f'<path transform="translate(264 191) scale(.33)" fill-rule="evenodd" d="{EIFFEL}" fill="{gold}"></path>'
            f'<text x="280" y="292" text-anchor="middle" style="font:400 36px \'Pinyon Script\',cursive" fill="{gold}">Dons</text>'
            f'</svg>{tag}</div>')


def _fine(p):
    boy = p.get('word') == 'boy'
    word = 'BOY' if boy else 'GIRL'
    bg = '#CFF6D6' if boy else '#fff'
    return ('<div style="display:flex;justify-content:center;padding:6cqw 4cqw 2cqw">'
            f'<div style="position:relative;background:{bg};border-radius:9cqw;padding:5cqw 8cqw 6cqw;box-shadow:0 0 0 .8cqw rgba(0,0,0,.12),0 2cqw 5cqw rgba(0,0,0,.45)">'
            "<div style=\"font:400 24cqw/.86 'Bowlby One',sans-serif;color:#fff;-webkit-text-stroke:.9cqw #111;paint-order:stroke fill;"
            f'text-shadow:1.2cqw 1.2cqw 0 #111;text-align:center;letter-spacing:-.02em;white-space:nowrap">FINE<br>{word}</div>'
            '<svg viewBox="0 0 24 22" style="position:absolute;right:-3cqw;top:-6cqw;width:20cqw;transform:rotate(14deg)" aria-hidden="true">'
            '<path d="M12 21.2S2.2 15 2.2 8.3A5.2 5.2 0 0 1 12 5.6a5.2 5.2 0 0 1 9.8 2.7C21.8 15 12 21.2 12 21.2z" fill="#EE2A2A" stroke="#fff" stroke-width="1.6"></path></svg>'
            '</div></div>')


def _sign(p):
    return ('<div style="background:#4DFF5C;border-radius:7cqw 10cqw 8cqw 12cqw;padding:6cqw 6cqw 10cqw;box-shadow:0 0 6cqw rgba(77,255,92,.45),0 2cqw 5cqw rgba(0,0,0,.5)">'
            '<div style="position:relative;width:100%;padding-bottom:9cqw">'
            "<div style=\"display:flex;align-items:baseline;font:800 15cqw/.8 'League Spartan',sans-serif;letter-spacing:-.025em;white-space:nowrap;color:#5A1B12\">"
            '<span>DON</span><span style="width:.24em;flex:none"></span><span>P</span>'
            '<svg viewBox="0 0 100 150" style="height:1.02em;width:.68em;flex:none;margin:0 -.02em 0 -.01em;overflow:visible" aria-hidden="true">'
            f'<path fill-rule="evenodd" d="{EIFFEL}" fill="#5A1B12"></path></svg><span>RRTY</span></div>'
            "<div style=\"position:absolute;left:3%;top:56%;font:400 10.8cqw/1 'Pinyon Script',cursive;color:#2E0D08;white-space:nowrap\">Only the Dons survive.</div>"
            '</div></div>')


KINDS = {'wordmark': _wordmark, 'sticker': _sticker, 'mascot': _mascot, 'fine': _fine, 'sign': _sign}
ATTR = re.compile(r'(\w+)(?:="([^"]*)")?')


def render(argstr):
    p = {m.group(1): (m.group(2) if m.group(2) is not None else True) for m in ATTR.finditer(argstr)}
    kind = p.get('kind', 'wordmark')
    inner = KINDS[kind](p)
    label = ' role="img" aria-label="Don Parrty"' if kind == 'wordmark' and 'decor' not in p else ' aria-hidden="true"'
    hs = _host_style(p.get('style', ''))
    return (f'<div class="dp-brand dp-{kind}"{label} style="{hs}">'
            f'<div style="width:100%;container-type:inline-size;line-height:0">{inner}</div></div>')


MACRO = re.compile(r'\{\{brand\s+([^}]*)\}\}')


def expand(s):
    return MACRO.sub(lambda m: render(m.group(1)), s)


def expand_js(s):
    """Same as expand, but the HTML is escaped to sit inside a single-quoted JS string."""
    return MACRO.sub(lambda m: render(m.group(1)).replace('\\', '\\\\').replace("'", "\\'"), s)
