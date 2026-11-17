"""Localized colophon and author page, with shared verified profile links."""
from html import escape as esc
import json
import re

INDEX = 11
ROUTES = {'sk':'o-stranke-ada', 'cs':'o-strance-ada', 'en':'about-ada', 'de':'ueber-ada', 'es':'sobre-ada'}
PROFILES = [
    ('ita', 'IT Academy', 'https://www.it-academy.sk/', 'IT'),
    ('vita', 'VITA', 'https://www.vita.sk/', 'V'),
    ('youtube', 'YouTube', 'https://www.youtube.com/@VITA-Academy', '▶'),
    ('linkedin', 'LinkedIn', 'https://www.linkedin.com/in/miroslav-reiter/', 'in'),
    ('researchgate', 'ResearchGate', 'https://www.researchgate.net/profile/Miroslav_Reiter', 'Rɢ'),
]
BIO_SOURCE = 'https://www.vita.sk/faq/kto-je-miroslav-reiter-a-co-robi/'
PHOTO_SOURCE = 'https://www.vita.sk/lektori/'
RESEARCH_SOURCE = PROFILES[-1][2]
REPOSITORY = 'https://github.com/miroslav-reiter/ada-lovelace-web'

def load(root, lang):
    base = json.loads((root/'about.sk.json').read_text(encoding='utf-8'))
    data = json.loads((root/f'about.{lang}.json').read_text(encoding='utf-8'))
    assert set(data) == set(base), f'{lang}: about translation keys differ'
    for key, value in data.items():
        assert isinstance(value, str) and value.strip(), (lang, key)
        assert chr(8212) not in value and not re.search(r'&(?:mdash|#8212|#x2014);|\\u2014', value, re.I), (lang, key)
    return data

def navigation(t, lang, index, page_url, footer=False):
    attrs = ' class="footer-source"' if footer else ''
    if index == INDEX: attrs += ' aria-current="page"'
    return f'<a{attrs} href="{page_url(lang,INDEX)}">{esc(t["nav"])}'+(' ↗' if footer else '')+'</a>'

def external(url, text, css='text-link'):
    return f'<a class="{css}" href="{url}" target="_blank" rel="noopener noreferrer">{esc(text)} <span aria-hidden="true">↗</span></a>'

def content(t, lang, page_url):
    def s(key): return esc(t[key])
    profiles = ''.join(f'''<a class="about-profile" href="{url}" target="_blank" rel="noopener noreferrer"><span class="about-profile-icon" aria-hidden="true">{symbol}</span><span><strong>{name}</strong><span>{s('profile.'+key)}</span></span><span class="about-arrow" aria-hidden="true">↗</span></a>''' for key,name,url,symbol in PROFILES)
    steps = ''.join(f'<li><span class="about-step-number" aria-hidden="true">0{i}</span><div><h3>{s(f"step{i}.title")}</h3><p>{s(f"step{i}.text")}</p></div></li>' for i in range(1,5))
    principles = ''.join(f'<article><span class="eyebrow">0{i+1}</span><h3>{s(kind+".title")}</h3><p>{s(kind+".text")}</p></article>' for i,kind in enumerate(['facts','fiction','images']))
    return f'''<section class="section about-hero" aria-labelledby="about-title"><div class="about-intro"><span class="eyebrow">11 / {s('eyebrow')}</span><h1 id="about-title">{s('title')}</h1><p class="about-lead">{s('intro')}</p><p class="about-tagline">{s('tagline')}</p></div>
<aside class="about-author" aria-labelledby="author-name"><span class="eyebrow">{s('author.label')}</span><div class="about-author-identity"><figure class="about-author-portrait"><img src="/assets/miroslav-reiter-vita.jpg" alt="{s('author.photoAlt')}" width="394" height="391" decoding="async"><figcaption>{external(PHOTO_SOURCE,t['author.photoSource'],'about-photo-source')}</figcaption></figure><h2 id="author-name">Miroslav<br>Reiter</h2></div><p class="about-role">{s('author.role')}</p><p>{s('author.bio')}</p>{external(BIO_SOURCE,t['author.source'])}<p>{s('author.research')}</p>{external(RESEARCH_SOURCE,t['author.researchSource'])}</aside></section>
<section class="section about-links" aria-labelledby="profiles-title"><div class="about-section-heading"><span class="eyebrow">01 / {s('profiles.eyebrow')}</span><h2 id="profiles-title">{s('profiles.title')}</h2><p>{s('profiles.intro')}</p></div><div class="about-profiles">{profiles}</div></section>
<section class="section about-production" aria-labelledby="production-title"><div class="about-section-heading"><span class="eyebrow">02 / {s('production.eyebrow')}</span><h2 id="production-title">{s('production.title')}</h2><p>{s('production.intro')}</p></div><ol class="about-steps">{steps}</ol>
<div class="about-build-note"><div><h3>{s('technology.title')}</h3><p>{s('technology.text')}</p><div class="about-stack" aria-label="{s('technology.title')}"><span>HTML</span><span>CSS</span><span>JavaScript</span><span>Python</span><span>Sites</span><span>GitHub</span></div></div>{external(REPOSITORY,t['repository'],'button')}</div></section>
<section class="section about-principles" aria-labelledby="principles-title"><div class="about-section-heading"><span class="eyebrow">03 / {s('principles.eyebrow')}</span><h2 id="principles-title">{s('principles.title')}</h2></div><div class="about-principle-grid">{principles}</div><p class="about-source-link"><a class="text-link" href="{page_url(lang,4)}">{s('sources')} <span aria-hidden="true">↗</span></a></p><div class="about-access"><h3>{s('access.title')}</h3><p>{s('access.text')}</p></div></section>
<aside class="section about-closing"><p>{s('closing')}</p><a class="button" href="{page_url(lang,0)}">{s('back')} <span aria-hidden="true">↗</span></a></aside>'''

def document(template, t, lang, page_url):
    result = re.sub(r'<main\b[^>]*>.*?</main>', '<main id="obsah" tabindex="-1">'+content(t,lang,page_url)+'</main>', template, flags=re.S)
    title = esc(t['title']+' - Ada Lovelace')
    result = re.sub(r'<title>.*?</title>', '<title>'+title+'</title>', result)
    result = re.sub(r'(<meta (?:name="description"|property="og:description") content=")[^"]*', lambda m:m[1]+esc(t['description'],quote=True), result)
    result = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m:m[1]+title, result)
    return result.replace(' aria-current="page"','').replace('page-kviz','page-about')
