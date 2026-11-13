"""Check routing, metadata and language coverage of the generated editions."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json
import re
import importlib.util

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('build_i18n', Path(__file__).with_name('build-i18n.py'))
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.lang = None
        self.canonical = []
        self.alternates = {}
        self.switch = {}
        self.current = []
        self.scripts = []
        self.links = []
        self.meta = {}
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == 'html': self.lang = d.get('lang')
        if tag == 'meta': self.meta[d.get('name') or d.get('property')] = d.get('content')
        if tag == 'script' and 'src' in d: self.scripts.append(urlsplit(d['src']).path)
        if tag == 'link' and d.get('rel') == 'canonical': self.canonical.append(d['href'])
        if tag == 'link' and d.get('rel') == 'alternate': self.alternates[d.get('hreflang')] = d['href']
        if tag == 'a':
            if 'data-language' in d:
                self.switch[d['data-language']] = d['href']
                if d.get('aria-current') == 'page': self.current.append(d['data-language'])
                assert d['lang'] == d['hreflang'] == d['data-language']
            else: self.links.append(d.get('href', ''))

manifest = json.loads((ROOT/'dist/languages.json').read_text(encoding='utf-8'))
assert manifest['default'] == 'sk'
assert set(manifest['languages']) == {'sk', 'cs', 'en', 'de', 'es'}
assert len(manifest['pages']) == 35
assert len(list((ROOT/'dist').rglob('*.html'))) == 35
for lang in build.LANGUAGES:
    build.load_translations(lang)
    for index in range(7):
        url = build.page_url(lang, index)
        text = (ROOT/'dist'/url.lstrip('/')/'index.html').read_text(encoding='utf-8')
        page = Page(text)
        assert page.lang == lang, url
        assert page.canonical == [build.ORIGIN + url], url
        expected = {code: build.ORIGIN + build.page_url(code,index) for code in build.LANGUAGES}
        expected['x-default'] = build.ORIGIN + build.page_url('sk',index)
        assert page.alternates == expected, url
        assert page.switch == {code:build.page_url(code,index) for code in build.LANGUAGES}, url
        assert page.current == [lang], url
        assert page.meta['description'] and page.meta['og:locale'] == build.OG_LOCALES[lang], url
        assert '/language-switch.js' in page.scripts, url
        for script in page.scripts:
            if script.endswith(('/app.js','/pages.js','/gallery.js')):
                assert script.startswith('/locales/'+lang+'/') if lang != 'sk' else script.count('/') == 1
        for link in page.links:
            parsed=urlsplit(link)
            if parsed.scheme or parsed.netloc or not parsed.path: continue
            if parsed.path.endswith('/'):
                assert parsed.path in [build.page_url(lang,i) for i in range(7)], (url,link)
        assert not re.search(r'\{\d+\}', text), url

for file in (ROOT/'dist').rglob('*'):
    if file.suffix not in ('.html','.js','.css','.json'): continue
    text=file.read_text(encoding='utf-8')
    assert chr(8212) not in text, file
    assert not re.search(r'&(?:mdash|#8212|#x2014);|\\u2014',text,re.I), file
print('PASS: 35 pages, 5 complete catalogs, localized navigation and scripts, canonical URLs, hreflang and default Slovak edition.')
