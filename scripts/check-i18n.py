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
        self.in_script = False
        self.visible_text = []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == 'script': self.in_script = True
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
    def handle_endtag(self, tag):
        if tag=='script': self.in_script=False
    def handle_data(self, data):
        if not self.in_script:self.visible_text.append(data)

manifest = json.loads((ROOT/'dist/languages.json').read_text(encoding='utf-8'))
assert manifest['default'] == 'sk'
assert set(manifest['languages']) == {'sk', 'cs', 'en', 'de', 'es'}
page_count=len(build.ROUTES['sk'])
assert len(manifest['pages']) == page_count*5 == 85
assert len(list((ROOT/'dist').rglob('*.html'))) == page_count*5+10
for lang in build.LANGUAGES:
    build.load_translations(lang)
    build.experiences.load(ROOT/'i18n',lang)
    build.about.load(ROOT/'i18n',lang)
    build.learning.load(ROOT/'i18n',lang)
    for index in range(page_count):
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
                assert parsed.path in [build.page_url(lang,i) for i in range(page_count)], (url,link)
        assert not re.search(r'\{\d+\}', ''.join(page.visible_text)), url
        assert '/experiences.js' in page.scripts and '/reading-init.js' in page.scripts, url
        assert '/theme.js' in page.scripts and '/theme.css?v=1' in text, url
        assert '/dropdowns.js' in page.scripts and '/dropdowns.css?v=3' in text, url
        header = text[text.index('<header'):text.index('</header>')]
        about_url = build.page_url(lang,build.about.INDEX)
        assert f'href="{about_url}"' in header, url
        assert f'href="{about_url}"' in text[text.index('<footer'):], url
        if index == build.about.INDEX:
            assert '/about.css?v=2' in text and 'Miroslav' in text and 'Reiter' in text, url
            for _, _, profile_url, _ in build.about.PROFILES:
                assert f'href="{profile_url}"' in text, (url,profile_url)
            assert 'aria-current="page"' in header.split('id="site-nav"',1)[1], url
        assert 'class="header-preferences"' in header and 'id="theme-select"' in header and 'id="language-current-name"' in header, url
        assert text.count('class="language-flag"') == 6, url
        assert 'class="salon-dropdown language-dropdown"' in text, url
        assert 'aria-labelledby="language-label language-current-name language-current-code"' in text, url
        assert 'aria-labelledby="theme-label theme-current-label"' in text, url
        assert text.index('/theme.js') < text.index('rel="stylesheet"'), url
        assert text.count('id="theme-select"') == 1 and 'for="theme-select"' in text, url
        assert 'id="theme-status"' in text, url
        for value in ('system', 'light', 'dark'):
            assert '<option value="'+value+'"' in text, (url, value)
            assert 'data-theme-option="'+value+'"' in text, (url, value)

for file in (ROOT/'dist').rglob('*'):
    if file.suffix not in ('.html','.js','.css','.json'): continue
    text=file.read_text(encoding='utf-8')
    assert chr(8212) not in text, file
    assert not re.search(r'&(?:mdash|#8212|#x2014);|\\u2014',text,re.I), file
assert len(list((ROOT/'dist'/'downloads').glob('*.pdf'))) == 10
assert len(list((ROOT/'dist'/'downloads').glob('*.docx'))) == 10
print('PASS: 85 pages, 10 HTML, 10 PDF and 10 DOCX downloads, 5 complete catalogs, author profiles, localized navigation, canonical URLs, hreflang and default Slovak edition.')
