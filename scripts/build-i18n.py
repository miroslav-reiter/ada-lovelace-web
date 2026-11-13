"""Generate all five static language editions using the Python standard library.

Edit i18n/templates and the complete translation catalogs, then run this script.
The Slovak edition stays at the root. No runtime translation service is used.
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, urlunsplit
import html
import json
import re
import hashlib

ROOT = Path(__file__).resolve().parent.parent
I18N = ROOT / 'i18n'
DIST = ROOT / 'dist'
ORIGIN = 'https://ada-lovelace.vita-academy-7121.chatgpt.site'
LANGUAGES = {'sk': 'Slovenčina', 'cs': 'Čeština', 'en': 'English', 'de': 'Deutsch', 'es': 'Español'}
ROUTES = {
    'sk': ['', 'portfolio', 'kviz', 'cv', 'zdroje', 'jazyk-ada', 'fotografie'],
    'cs': ['', 'portfolio', 'kviz', 'cv', 'zdroje', 'jazyk-ada', 'fotografie'],
    'en': ['', 'portfolio', 'quiz', 'cv', 'sources', 'ada-language', 'photos'],
    'de': ['', 'portfolio', 'quiz', 'lebenslauf', 'quellen', 'ada-sprache', 'fotos'],
    'es': ['', 'portafolio', 'quiz', 'cv', 'fuentes', 'lenguaje-ada', 'fotos'],
}
SOURCE_PATHS = ['index.html'] + [x + '/index.html' for x in ROUTES['sk'][1:]]
OG_LOCALES = {'sk':'sk_SK','cs':'cs_CZ','en':'en_GB','de':'de_DE','es':'es_ES'}
CATALOG = json.loads((I18N / 'catalog.json').read_text(encoding='utf-8'))
SOURCE_IDS = {row['source']: row['id'] for row in CATALOG}
SEGMENTS = json.loads((I18N / 'js-segments.json').read_text(encoding='utf-8'))

def page_url(lang, index):
    parts = ([] if lang == 'sk' else [lang]) + ([ROUTES[lang][index]] if index else [])
    return '/' + '/'.join(parts) + ('/' if parts else '')

def write(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding='utf-8', newline='\n')

def load_translations(lang):
    result = json.loads((I18N / (lang + '.json')).read_text(encoding='utf-8'))
    expected = {row['id'] for row in CATALOG}
    if set(result) != expected:
        raise ValueError(f'{lang}: translation keys differ: missing {expected-set(result)}, extra {set(result)-expected}')
    for row in CATALOG:
        value = result[row['id']]
        if not isinstance(value, str) or not value:
            raise ValueError(f'{lang}: empty translation {row["id"]}')
        if chr(8212) in value or re.search(r'&(?:mdash|#8212|#x2014);|\\u2014',value,re.I):
            raise ValueError(f'{lang}: prohibited punctuation in {row["id"]}')
        if row['kind'] == 'template' and re.findall(r'\{\d+\}',value) != re.findall(r'\{\d+\}',row['source']):
            raise ValueError(f'{lang}: changed placeholders in {row["id"]}')
        if row['kind'] == 'literal' and re.findall(r'<[^>]+>',value) != re.findall(r'<[^>]+>',row['source']):
            raise ValueError(f'{lang}: changed HTML in {row["id"]}')
    return result

def translate(raw, strings):
    core = raw.strip()
    if core not in SOURCE_IDS:
        return raw
    before = raw[:len(raw)-len(raw.lstrip())]
    after = raw[len(raw.rstrip()):]
    return before + strings[SOURCE_IDS[core]] + after

def local_url(raw, lang):
    url = urlsplit(raw)
    if url.scheme or url.netloc or raw.startswith('#'):
        return raw
    path = url.path
    for index, route in enumerate(ROUTES['sk']):
        if path in ('/'+route+'/' if route else '/', '/'+route+'/index.html' if route else '/index.html'):
            return urlunsplit(('', '', page_url(lang,index), url.query, url.fragment))
    return raw

def local_photos(strings):
    photos = json.loads((I18N / 'photos.sk.json').read_text(encoding='utf-8'))
    for photo in photos:
        for key in ('title','label','date','alt','caption','credit','sourceLabel'):
            photo[key] = translate(photo[key],strings)
    return photos

class LocalizedPage(HTMLParser):
    def __init__(self, lang, index, strings):
        super().__init__(convert_charrefs=True)
        self.lang, self.index, self.strings = lang, index, strings
        self.out, self.stack = [], []
        self.script = None
    def handle_decl(self, decl): self.out.append('<!'+decl+'>')
    def handle_comment(self, comment): self.out.append('<!--'+comment+'-->')
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == 'link' and d.get('rel') == 'canonical': return
        if tag == 'html': d['lang'] = self.lang
        for key in ('alt','title','aria-label','placeholder'):
            if key in d: d[key] = translate(d[key],self.strings)
        if tag == 'meta' and (d.get('name') == 'description' or d.get('property') in ('og:title','og:description')):
            d['content'] = translate(d['content'],self.strings)
        for key in ('href','src'):
            if key not in d: continue
            value = d[key]
            if not value.startswith(('/','#','http:','https:','data:','mailto:')):
                value = '/' + value
            value = local_url(value,self.lang)
            if tag == 'script' and key == 'src' and urlsplit(value).path in ('/app.js','/pages.js','/gallery.js'):
                name = urlsplit(value).path.rsplit('/',1)[-1]
                value = ('/' if self.lang == 'sk' else '/locales/'+self.lang+'/') + name + '?v=i18n1'
            d[key] = value
        rendered = '<' + tag + ''.join(' '+k if v is None else ' '+k+'="'+html.escape(v,quote=True)+'"' for k,v in d.items()) + '>'
        self.out.append(rendered)
        if tag == 'script': self.script=d
        if tag not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):
            self.stack.append(tag)
    def handle_startendtag(self,tag,attrs): self.handle_starttag(tag,attrs)
    def handle_endtag(self, tag):
        if tag == 'head':
            current = ORIGIN + page_url(self.lang,self.index)
            self.out.append('<link rel="canonical" href="'+current+'">')
            self.out.append('<meta property="og:url" content="'+current+'"><meta property="og:locale" content="'+OG_LOCALES[self.lang]+'">')
            for lang in LANGUAGES:
                self.out.append('<link rel="alternate" hreflang="'+lang+'" href="'+ORIGIN+page_url(lang,self.index)+'">')
            self.out.append('<link rel="alternate" hreflang="x-default" href="'+ORIGIN+page_url('sk',self.index)+'">')
            self.out.append('<link rel="stylesheet" href="/languages.css?v=1"><script src="/language-switch.js?v=1" defer></script>')
        self.out.append('</'+tag+'>')
        if tag == 'header':
            self.out.append('<nav class="language-bar" aria-label="'+html.escape(self.strings['t0670'],quote=True)+'"><span class="language-label">'+html.escape(self.strings['t0677'])+'</span><div class="language-switch">')
            for lang, name in LANGUAGES.items():
                current = ' aria-current="page"' if lang == self.lang else ''
                self.out.append('<a href="'+page_url(lang,self.index)+'" lang="'+lang+'" hreflang="'+lang+'" data-language="'+lang+'"'+current+'>'+name+'</a>')
            self.out.append('</div></nav>')
        if tag == 'script': self.script=None
        if tag in self.stack:
            self.stack = self.stack[:len(self.stack)-1-self.stack[::-1].index(tag)]
    def handle_data(self, data):
        if self.script is not None:
            if self.script.get('id') == 'gallery-data':
                self.out.append(json.dumps(local_photos(self.strings),ensure_ascii=False).replace('<','\\u003c'))
            else: self.out.append(data)
            return
        if 'style' in self.stack:
            self.out.append(data); return
        value = data if 'code' in self.stack else translate(data,self.strings)
        self.out.append(html.escape(value,quote=False))

def localized_js(file, lang, strings):
    code=(I18N/'templates'/file).read_text(encoding='utf-8')
    hashes=json.loads((I18N/'js-source-hashes.json').read_text(encoding='utf-8'))
    if hashlib.sha256(code.encode('utf-8')).hexdigest()!=hashes[file]:
        raise ValueError('JavaScript source changed. Run scripts/refresh-js-segments.mjs: '+file)
    # Acorn offsets use UTF-16. Current sources contain only BMP characters.
    if len(code.encode('utf-16-le'))//2 != len(code):
        raise ValueError('Regenerate offsets for non-BMP JavaScript source: '+file)
    segments=SEGMENTS[file]
    def render(start,end):
        contained=sorted((s for s in segments if start<=s['start'] and s['end']<=end),key=lambda s:(s['start'],-s['end']))
        out=[];cursor=start
        for s in contained:
            if s['start']<cursor:continue
            out.append(code[cursor:s['start']])
            value=translate(s['source'],strings)
            if s['kind']=='literal':
                out.append(json.dumps(value,ensure_ascii=False))
            else:
                pieces=[]
                for part in re.split(r'(\{\d+\})',value):
                    if re.fullmatch(r'\{\d+\}',part):
                        r=s['expressionRanges'][int(part[1:-1])]
                        pieces.append('${'+render(r['start'],r['end'])+'}')
                    else:pieces.append(part.replace('\\','\\\\').replace('`','\\`').replace('${','\\${'))
                out.append('`'+''.join(pieces)+'`')
            cursor=s['end']
        out.append(code[cursor:end])
        return ''.join(out)
    result=render(0,len(code))
    # Only quoted internal page URLs are rewritten. Asset paths and external sources stay intact.
    return re.sub(r'''(['"])(/(?:portfolio/|kviz/|cv/|zdroje/|jazyk-ada/|fotografie/|\#laboratorium))\1''',lambda m:m[1]+local_url(m[2],lang)+m[1],result)

def build():
    paths=[]
    for lang in LANGUAGES:
        strings=load_translations(lang)
        for index,source in enumerate(SOURCE_PATHS):
            page=LocalizedPage(lang,index,strings)
            page.feed((I18N/'templates'/source).read_text(encoding='utf-8'))
            url=page_url(lang,index)
            write(DIST/url.lstrip('/')/'index.html',''.join(page.out))
            paths.append({'lang':lang,'page':index,'path':url})
        for file in SEGMENTS:
            folder=DIST if lang=='sk' else DIST/'locales'/lang
            write(folder/file,localized_js(file,lang,strings))
        write(DIST/'locales'/lang/'photos.json',json.dumps(local_photos(strings),ensure_ascii=False,indent=2))
    write(DIST/'languages.json',json.dumps({'default':'sk','languages':LANGUAGES,'pages':paths},ensure_ascii=False,indent=2))
    print(f'Generated {len(paths)} pages in {len(LANGUAGES)} languages, {len(CATALOG)} translations per language.')

if __name__=='__main__':build()
